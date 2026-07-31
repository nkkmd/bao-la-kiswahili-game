#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");

function parseArgs(argv) {
  const options = {
    preregistration: "config/experiments/phase-transition-robustness-v1.json",
    policy: "config/experiments/phase-transition-robustness-execution-policy-v1.json",
    output: "artifacts/phase-transition/robustness-v1/execution-lock.json",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--preregistration") options.preregistration = value;
    else if (key === "--policy") options.policy = value;
    else if (key === "--output") options.output = value;
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

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function gitIgnored(relativePath, cwd) {
  const normalized = relativePath.replace(/[\\/]+$/, "");
  const probe = `${normalized}/.e011-ignore-probe`;
  const result = spawnSync(
    "git",
    ["check-ignore", "--quiet", "--no-index", probe],
    { cwd },
  );
  return result.status === 0;
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function atomicWrite(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, content);
  fs.renameSync(temporary, filePath);
}

function normalizedCpuModels() {
  return [...new Set(os.cpus().map((cpu) => cpu.model.trim()).filter(Boolean))];
}

function collectEnvironment(repositoryRoot) {
  return {
    repositoryRoot,
    sourceCommit: git(["rev-parse", "HEAD"], repositoryRoot),
    branch: git(["branch", "--show-current"], repositoryRoot),
    worktreeStatus: git(["status", "--porcelain=v1"], repositoryRoot),
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    osType: os.type(),
    osRelease: os.release(),
    hostname: os.hostname(),
    cpuModels: normalizedCpuModels(),
    logicalCpuCount: os.cpus().length,
    totalMemoryBytes: os.totalmem(),
    githubActions: process.env.GITHUB_ACTIONS === "true",
    corpusRootIgnored: null,
  };
}

function validateEnvironment(policy, environment, preregistration) {
  const errors = [];
  if (environment.githubActions === true) {
    errors.push("Formal execution lock cannot be prepared in GitHub Actions.");
  }
  if (environment.repositoryRoot !== policy.repositoryPath) {
    errors.push(`Repository path mismatch: ${environment.repositoryRoot}`);
  }
  if (environment.branch !== policy.branch) {
    errors.push(`Branch mismatch: ${environment.branch}`);
  }
  if (environment.nodeVersion !== policy.expectedNodeVersion) {
    errors.push(`Node.js version mismatch: ${environment.nodeVersion}`);
  }
  if (policy.expectedPlatform && environment.platform !== policy.expectedPlatform) {
    errors.push(`Platform mismatch: ${environment.platform}`);
  }
  if (policy.requireCleanWorktree && environment.worktreeStatus !== "") {
    errors.push("Worktree is not clean.");
  }
  if (environment.corpusRootIgnored !== true) {
    errors.push("Formal corpus root is not ignored by git.");
  }
  if (preregistration.experimentId !== policy.experimentId) {
    errors.push("Experiment ID mismatch between preregistration and execution policy.");
  }
  const plannedOrder = preregistration.executionPolicy?.runOrder || [];
  if (canonicalJson(plannedOrder) !== canonicalJson(policy.runOrder)) {
    errors.push("Run order differs from the preregistration.");
  }
  return errors;
}

function prepare(options) {
  const policyPath = path.resolve(options.policy);
  const preregistrationPath = path.resolve(options.preregistration);
  const policy = loadJson(policyPath);
  const preregistrationRaw = fs.readFileSync(preregistrationPath, "utf8");
  const preregistration = JSON.parse(preregistrationRaw);
  const repositoryRoot = fs.realpathSync(process.cwd());
  const environment = collectEnvironment(repositoryRoot);
  environment.corpusRootIgnored = gitIgnored(policy.paths.corpusRoot, repositoryRoot);
  const errors = validateEnvironment(policy, environment, preregistration);
  const lock = {
    schemaVersion: "1.0.0",
    experimentId: policy.experimentId,
    analysisVersion: preregistration.analysisVersion,
    status: errors.length ? "invalid" : "prepared-not-approved",
    preparedAt: new Date().toISOString(),
    preregistration: {
      path: path.relative(repositoryRoot, preregistrationPath),
      sha256: sha256(preregistrationRaw),
    },
    executionPolicy: {
      path: path.relative(repositoryRoot, policyPath),
      sha256: sha256(fs.readFileSync(policyPath)),
    },
    environment,
    paths: policy.paths,
    runOrder: policy.runOrder,
    approval: {
      required: true,
      approved: false,
      approvalTokenSha256: sha256(policy.approvalToken),
      note: "Formal self-play must not start until the user explicitly approves it.",
    },
    errors,
  };
  const output = path.resolve(options.output);
  atomicWrite(output, `${JSON.stringify(lock, null, 2)}\n`);
  console.log(JSON.stringify(lock, null, 2));
  if (errors.length) process.exitCode = 2;
  return lock;
}

if (require.main === module) {
  try {
    prepare(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  canonicalJson,
  collectEnvironment,
  gitIgnored,
  parseArgs,
  prepare,
  sha256,
  validateEnvironment,
};
