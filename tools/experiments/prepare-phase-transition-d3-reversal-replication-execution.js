#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");
const E020 = require("./lib/phase-transition-d3-reversal-replication.js");

function parseArgs(argv) {
  const options = {
    preregistration: "config/experiments/phase-transition-d3-reversal-replication-v1.json",
    policy: "config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json",
    output: "artifacts/phase-transition/d3-reversal-replication-v1/execution-lock.json",
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

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function git(args, cwd) { return execFileSync("git", args, { cwd, encoding: "utf8" }).trim(); }

function gitIgnored(relativePath, cwd) {
  const normalized = relativePath.replace(/[\\/]+$/, "");
  const result = spawnSync("git", ["check-ignore", "--quiet", "--no-index", `${normalized}/.e020-ignore-probe`], { cwd });
  return result.status === 0;
}

function atomicWrite(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, content);
  fs.renameSync(temporary, filePath);
}

function pythonEnvironment(pythonCommand) {
  try {
    const version = execFileSync(pythonCommand, ["--version"], { encoding: "utf8" }).trim();
    const packages = JSON.parse(execFileSync(
      pythonCommand,
      ["-c", "import json,numpy,pandas; print(json.dumps({'numpy':numpy.__version__,'pandas':pandas.__version__}))"],
      { encoding: "utf8" },
    ).trim());
    return { version, packages, error: null };
  } catch (error) {
    return { version: null, packages: null, error: error.message };
  }
}

function collectEnvironment(repositoryRoot, policy) {
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
    cpuModels: [...new Set(os.cpus().map((cpu) => cpu.model.trim()).filter(Boolean))],
    logicalCpuCount: os.cpus().length,
    totalMemoryBytes: os.totalmem(),
    githubActions: process.env.GITHUB_ACTIONS === "true",
    corpusRootIgnored: null,
    python: pythonEnvironment(policy.pythonCommand),
  };
}

function validateEnvironment(policy, environment, preregistration) {
  const errors = [];
  try { E020.validatePreregistration(preregistration); }
  catch (error) { errors.push(`Invalid E-020 preregistration: ${error.message}`); }
  if (environment.githubActions === true) errors.push("Formal E-020 execution lock cannot be prepared in GitHub Actions");
  if (environment.repositoryRoot !== policy.repositoryPath) errors.push(`Repository path mismatch: ${environment.repositoryRoot}`);
  if (environment.branch !== policy.branch) errors.push(`Branch mismatch: ${environment.branch}`);
  if (environment.nodeVersion !== policy.expectedNodeVersion) errors.push(`Node.js version mismatch: ${environment.nodeVersion}`);
  if (policy.expectedPlatform && environment.platform !== policy.expectedPlatform) errors.push(`Platform mismatch: ${environment.platform}`);
  if (policy.requireCleanWorktree && environment.worktreeStatus !== "") errors.push("Worktree is not clean");
  if (environment.corpusRootIgnored !== true) errors.push("Formal E-020 corpus root is not ignored by git");
  if (preregistration.experimentId !== policy.experimentId) errors.push("Experiment ID mismatch between preregistration and policy");
  if (policy.formalExecutionAllowed !== true || policy.status !== "approved-awaiting-local-lock" || policy.formalAuthorization?.granted !== true) {
    errors.push("E-020-specific explicit formal authorization is required before preparing an execution lock");
  }
  if (environment.python?.error) errors.push(`Python environment check failed: ${environment.python.error}`);
  if (environment.python?.version !== policy.pythonEnvironment.expectedPythonVersion) errors.push(`Python version mismatch: ${environment.python?.version}`);
  for (const [name, expected] of Object.entries(policy.pythonEnvironment.expectedPackages || {})) {
    if (environment.python?.packages?.[name] !== expected) errors.push(`${name} version mismatch: ${environment.python?.packages?.[name]}`);
  }
  return errors;
}

function prepare(options) {
  const policyPath = path.resolve(options.policy);
  const preregistrationPath = path.resolve(options.preregistration);
  const policyRaw = fs.readFileSync(policyPath);
  const preregistrationRaw = fs.readFileSync(preregistrationPath);
  const policy = JSON.parse(policyRaw);
  const preregistration = JSON.parse(preregistrationRaw);
  const repositoryRoot = fs.realpathSync(process.cwd());
  const environment = collectEnvironment(repositoryRoot, policy);
  environment.corpusRootIgnored = gitIgnored(policy.paths.corpusRoot, repositoryRoot);
  const errors = validateEnvironment(policy, environment, preregistration);
  const lock = {
    schemaVersion: "1.0.0",
    experimentId: policy.experimentId,
    hypothesisId: preregistration.hypothesisId,
    analysisVersion: preregistration.analysisVersion,
    status: errors.length ? "invalid" : "prepared-approved",
    preparedAt: new Date().toISOString(),
    preregistration: { path: path.relative(repositoryRoot, preregistrationPath), sha256: sha256(preregistrationRaw) },
    executionPolicy: { path: path.relative(repositoryRoot, policyPath), sha256: sha256(policyRaw) },
    environment,
    paths: policy.paths,
    corpus: preregistration.corpus,
    primaryEndpoint: preregistration.primaryEndpoint,
    decisionRule: preregistration.decisionRule,
    structuralSecondaryEndpoint: preregistration.structuralSecondaryEndpoint,
    mechanismBridgeSecondary: preregistration.mechanismBridgeSecondary,
    approval: {
      required: true,
      approved: errors.length === 0,
      approvalTokenSha256: sha256(policy.approvalToken),
      note: "This lock may exist with prepared-approved status only after explicit E-020 authorization. It never authorizes GitHub Actions formal execution.",
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
  try { prepare(parseArgs(process.argv.slice(2))); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
}

module.exports = {
  atomicWrite,
  collectEnvironment,
  gitIgnored,
  parseArgs,
  prepare,
  pythonEnvironment,
  sha256,
  validateEnvironment,
};
