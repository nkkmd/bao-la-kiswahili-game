#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

function parseArgs(argv) {
  const options = {
    phase: "status",
    lock: "artifacts/phase-transition/independent-confirmation-v2/execution-lock.json",
    policy: "config/experiments/phase-transition-independent-confirmation-execution-policy-v1.json",
    approvalToken: null,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--phase") options.phase = value;
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

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function assertLockedInputs(lock, policyPath, policy, preregistration, repositoryRoot) {
  const errors = [];
  const resolvedPolicyPath = fs.realpathSync(policyPath);
  const relativePolicyPath = path.relative(repositoryRoot, resolvedPolicyPath);
  if (relativePolicyPath !== lock.executionPolicy.path) {
    errors.push("Execution policy path differs from the execution lock.");
  }
  if (sha256(fs.readFileSync(resolvedPolicyPath)) !== lock.executionPolicy.sha256) {
    errors.push("Execution policy hash differs from the execution lock.");
  }
  const preregistrationPath = path.resolve(repositoryRoot, policy.paths.preregistration);
  if (!fs.existsSync(preregistrationPath)) {
    errors.push("Preregistration file is missing.");
  } else {
    const relativePreregistrationPath = path.relative(repositoryRoot, preregistrationPath);
    if (relativePreregistrationPath !== lock.preregistration.path) {
      errors.push("Preregistration path differs from the execution lock.");
    }
    if (sha256(fs.readFileSync(preregistrationPath)) !== lock.preregistration.sha256) {
      errors.push("Preregistration hash differs from the execution lock.");
    }
  }
  if (canonicalJson(preregistration.corpus) !== canonicalJson(lock.corpus)) {
    errors.push("Preregistered corpus differs from the execution lock.");
  }
  if (errors.length) throw new Error(errors.join("\n"));
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
  if (policy.formalExecutionAllowed !== true) {
    throw new Error("Formal execution is disabled by the repository execution policy.");
  }
  if (!suppliedToken || suppliedToken !== policy.approvalToken) {
    throw new Error("Exact E-017 formal-run approval token is required.");
  }
  if (sha256(suppliedToken) !== lock.approval.approvalTokenSha256) {
    throw new Error("Approval token does not match the execution lock.");
  }
}

function execute(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

function completedGameCount(corpusRoot) {
  const gamesRoot = path.join(corpusRoot, "games");
  if (!fs.existsSync(gamesRoot)) return 0;
  return fs.readdirSync(gamesRoot).filter((name) => /^game-\d{4}\.json$/.test(name)).length;
}

function status(lock, policy, preregistration) {
  const corpusRoot = path.resolve(lock.environment.repositoryRoot, policy.paths.corpusRoot);
  return {
    experimentId: lock.experimentId,
    sourceCommit: lock.environment.sourceCommit,
    formalExecutionAllowed: policy.formalExecutionAllowed === true,
    completedGames: completedGameCount(corpusRoot),
    plannedGames: preregistration.corpus.games,
    manifestPresent: fs.existsSync(path.join(corpusRoot, "manifest.json")),
  };
}

function runCorpus(lock, policy, preregistration, options) {
  approve(lock, policy, options.approvalToken);
  const corpus = preregistration.corpus;
  execute(process.execPath, [
    "tools/experiments/run-phase-transition-research.js",
    "--profile", corpus.profile,
    "--games", String(corpus.games),
    "--seed", String(corpus.baseSeed),
    "--max-ply", String(corpus.maxPly),
    "--opening-plies", String(corpus.openingPlies),
    "--baseline-games", String(corpus.baselineGames),
    "--level", corpus.level,
    "--evaluation-profile", corpus.evaluationProfile,
    "--search-profile", corpus.searchProfile,
    "--max-depth", String(corpus.maxDepth),
    "--output", policy.paths.corpusRoot,
  ], lock.environment.repositoryRoot);
}

function requireCorpusComplete(repositoryRoot, policy, preregistration) {
  const corpusRoot = path.resolve(repositoryRoot, policy.paths.corpusRoot);
  const manifestPath = path.join(corpusRoot, "manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error("Formal corpus manifest is missing.");
  const manifest = readJson(manifestPath);
  if (Number(manifest.completedGames) !== Number(preregistration.corpus.games)) {
    throw new Error("Formal corpus is not complete.");
  }
  return corpusRoot;
}

function analyzeCorpus(lock, policy, preregistration) {
  const repositoryRoot = lock.environment.repositoryRoot;
  const corpusRoot = requireCorpusComplete(repositoryRoot, policy, preregistration);
  execute(policy.pythonCommand, [
    "tools/experiments/analyze-phase-transition-archetypes.py",
    "--input", corpusRoot,
    "--output", policy.paths.archetypeRoot,
  ], repositoryRoot);
  execute(process.execPath, [
    "tools/experiments/analyze-forced-capture-regime-controls.js",
    "--observations", path.join(corpusRoot, "observations.jsonl"),
    "--candidates", path.join(policy.paths.archetypeRoot, "archetype-members.csv"),
    "--output", policy.paths.controlRoot,
  ], repositoryRoot);
}

function verifyCorpus(lock, policy, preregistration, lockPath) {
  requireCorpusComplete(lock.environment.repositoryRoot, policy, preregistration);
  execute(process.execPath, [
    "tools/experiments/verify-phase-transition-independent-confirmation.js",
    "--config", policy.paths.preregistration,
    "--input", policy.paths.corpusRoot,
    "--lock", lockPath,
    "--output", policy.paths.integrityRoot,
  ], lock.environment.repositoryRoot);
}

function assertIntegrity(repositoryRoot, policy) {
  const filePath = path.resolve(
    repositoryRoot,
    policy.paths.integrityRoot,
    "independent-confirmation-integrity.json",
  );
  if (!fs.existsSync(filePath)) {
    throw new Error("Formal integrity result is missing; run the verify phase first.");
  }
  const result = readJson(filePath);
  if (result.valid !== true || result.mode !== "formal" || result.experimentId !== "E-017") {
    throw new Error("Formal E-017 integrity verification has not passed.");
  }
  return result;
}

function evaluateCorpus(lock, policy, preregistration) {
  const repositoryRoot = lock.environment.repositoryRoot;
  requireCorpusComplete(repositoryRoot, policy, preregistration);
  assertIntegrity(repositoryRoot, policy);
  execute(process.execPath, [
    "tools/experiments/evaluate-phase-transition-independent-confirmation.js",
    "--config", policy.paths.preregistration,
    "--manifest", path.join(policy.paths.corpusRoot, "manifest.json"),
    "--games", path.join(policy.paths.corpusRoot, "games.json"),
    "--candidates", path.join(policy.paths.controlRoot, "candidate-control-metrics.csv"),
    "--controls", path.join(policy.paths.controlRoot, "control-point-metrics.csv"),
    "--output", policy.paths.evaluationRoot,
  ], repositoryRoot);
}

function main(options) {
  const lockPath = path.resolve(options.lock);
  const policyPath = path.resolve(options.policy);
  const lock = readJson(lockPath);
  const policy = readJson(policyPath);
  const repositoryRoot = lock.environment.repositoryRoot;
  const preregistration = readJson(path.resolve(repositoryRoot, policy.paths.preregistration));
  assertLockedInputs(lock, policyPath, policy, preregistration, repositoryRoot);
  assertLockedEnvironment(lock, policy, repositoryRoot);
  if (options.phase === "status") {
    const result = status(lock, policy, preregistration);
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
  if (options.phase === "run") return runCorpus(lock, policy, preregistration, options);
  if (options.phase === "analyze") return analyzeCorpus(lock, policy, preregistration);
  if (options.phase === "verify") return verifyCorpus(lock, policy, preregistration, lockPath);
  if (options.phase === "evaluate") return evaluateCorpus(lock, policy, preregistration);
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
  assertIntegrity,
  assertLockedEnvironment,
  assertLockedInputs,
  canonicalJson,
  completedGameCount,
  parseArgs,
  sha256,
  status,
};
