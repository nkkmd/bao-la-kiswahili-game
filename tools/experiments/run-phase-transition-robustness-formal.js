#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

function parseArgs(argv) {
  const options = {
    phase: "status",
    condition: null,
    lock: "artifacts/phase-transition/robustness-v1/execution-lock.json",
    policy: "config/experiments/phase-transition-robustness-execution-policy-v1.json",
    approvalToken: null,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--phase") options.phase = value;
    else if (key === "--condition") options.condition = value;
    else if (key === "--lock") options.lock = value;
    else if (key === "--policy") options.policy = value;
    else if (key === "--approval-token") options.approvalToken = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function assertLockedEnvironment(lock, policy, repositoryRoot) {
  const errors = [];
  if (process.env.GITHUB_ACTIONS === "true") errors.push("Formal run is forbidden in GitHub Actions.");
  if (fs.realpathSync(repositoryRoot) !== lock.environment.repositoryRoot) errors.push("Repository root changed after lock preparation.");
  if (git(["rev-parse", "HEAD"], repositoryRoot) !== lock.environment.sourceCommit) errors.push("Source commit changed after lock preparation.");
  if (git(["branch", "--show-current"], repositoryRoot) !== lock.environment.branch) errors.push("Branch changed after lock preparation.");
  if (git(["status", "--porcelain=v1"], repositoryRoot) !== "") errors.push("Worktree is not clean.");
  if (process.version !== lock.environment.nodeVersion) errors.push("Node.js version changed after lock preparation.");
  if (lock.status !== "prepared-not-approved") errors.push(`Execution lock status is ${lock.status}.`);
  if (lock.experimentId !== policy.experimentId) errors.push("Execution lock experiment mismatch.");
  if (errors.length) throw new Error(errors.join("\n"));
}

function approve(lock, policy, suppliedToken) {
  if (!suppliedToken || suppliedToken !== policy.approvalToken) {
    throw new Error("Exact formal-run approval token is required.");
  }
  if (sha256(suppliedToken) !== lock.approval.approvalTokenSha256) {
    throw new Error("Approval token does not match the execution lock.");
  }
}

function conditionComplete(root, conditionId) {
  return fs.existsSync(path.join(root, conditionId, "manifest.json"));
}

function nextCondition(runOrder, corpusRoot) {
  return runOrder.find((conditionId) => !conditionComplete(corpusRoot, conditionId)) || null;
}

function execute(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

function status(lock, policy) {
  const corpusRoot = path.resolve(lock.environment.repositoryRoot, policy.paths.corpusRoot);
  return {
    experimentId: lock.experimentId,
    sourceCommit: lock.environment.sourceCommit,
    nextCondition: nextCondition(policy.runOrder, corpusRoot),
    conditions: policy.runOrder.map((conditionId) => ({
      conditionId,
      complete: conditionComplete(corpusRoot, conditionId),
    })),
  };
}

function runCondition(lock, policy, options) {
  approve(lock, policy, options.approvalToken);
  const repositoryRoot = lock.environment.repositoryRoot;
  const corpusRoot = path.resolve(repositoryRoot, policy.paths.corpusRoot);
  const expected = nextCondition(policy.runOrder, corpusRoot);
  if (!expected) throw new Error("All preregistered conditions are already complete.");
  if (options.condition !== expected) {
    throw new Error(`Run-order violation: expected ${expected}, received ${options.condition || "none"}.`);
  }
  execute(process.execPath, [
    "tools/experiments/run-phase-transition-robustness.js",
    "--config", policy.paths.preregistration,
    "--condition", expected,
    "--output", policy.paths.corpusRoot,
  ], repositoryRoot);
}

function analyzeCondition(lock, policy, options) {
  const repositoryRoot = lock.environment.repositoryRoot;
  const conditionId = options.condition;
  if (!policy.runOrder.includes(conditionId)) throw new Error(`Invalid condition: ${conditionId}`);
  const corpusRoot = path.join(policy.paths.corpusRoot, conditionId);
  const analysisRoot = path.join(policy.paths.analysisRoot, conditionId);
  if (!conditionComplete(path.resolve(repositoryRoot, policy.paths.corpusRoot), conditionId)) {
    throw new Error(`Condition ${conditionId} is not complete.`);
  }
  execute(policy.pythonCommand, [
    "tools/experiments/analyze-phase-transition-archetypes.py",
    "--input", corpusRoot,
    "--output", path.join(analysisRoot, "archetypes"),
  ], repositoryRoot);
  execute(process.execPath, [
    "tools/experiments/analyze-forced-capture-regime-controls.js",
    "--observations", path.join(corpusRoot, "observations.jsonl"),
    "--candidates", path.join(analysisRoot, "archetypes", "archetype-members.csv"),
    "--output", path.join(analysisRoot, "controls"),
  ], repositoryRoot);
}

function verifyAll(lock, policy) {
  execute(process.execPath, [
    "tools/experiments/verify-phase-transition-robustness.js",
    "--config", policy.paths.preregistration,
    "--input", policy.paths.corpusRoot,
    "--output", policy.paths.integrityRoot,
  ], lock.environment.repositoryRoot);
}

function evaluateAll(lock, policy) {
  execute(process.execPath, [
    "tools/experiments/evaluate-phase-transition-robustness.js",
    "--config", policy.paths.preregistration,
    "--input", policy.paths.analysisRoot,
    "--output", policy.paths.evaluationRoot,
  ], lock.environment.repositoryRoot);
}

function main(options) {
  const lock = readJson(path.resolve(options.lock));
  const policy = readJson(path.resolve(options.policy));
  const repositoryRoot = lock.environment.repositoryRoot;
  assertLockedEnvironment(lock, policy, repositoryRoot);
  if (options.phase === "status") {
    const result = status(lock, policy);
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
  if (options.phase === "run") return runCondition(lock, policy, options);
  if (options.phase === "analyze") return analyzeCondition(lock, policy, options);
  if (options.phase === "verify") return verifyAll(lock, policy);
  if (options.phase === "evaluate") return evaluateAll(lock, policy);
  throw new Error(`Unknown phase: ${options.phase}`);
}

if (require.main === module) {
  try {
    main(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  approve,
  assertLockedEnvironment,
  conditionComplete,
  nextCondition,
  parseArgs,
  status,
};
