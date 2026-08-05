#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const E020 = require("./lib/phase-transition-d3-reversal-replication.js");
const Runner = require("./run-phase-transition-d3-reversal-replication.js");
const PairBuilder = require("./build-phase-transition-d3-reversal-replication-pairs.js");
const Evaluator = require("./evaluate-phase-transition-d3-reversal-replication.js");
const Structure = require("./summarize-phase-transition-d3-reversal-replication-structure.js");

function parseArgs(argv) {
  const options = {
    phase: "status",
    lock: "artifacts/phase-transition/d3-reversal-replication-v1/execution-lock.json",
    policy: "config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json",
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

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function git(args, cwd) { return execFileSync("git", args, { cwd, encoding: "utf8" }).trim(); }
function execute(command, args, cwd) { execFileSync(command, args, { cwd, stdio: "inherit" }); }

function assertLockedInputs(lock, policyPath, policy, preregistration, repositoryRoot) {
  const errors = [];
  const resolvedPolicyPath = fs.realpathSync(policyPath);
  if (path.relative(repositoryRoot, resolvedPolicyPath) !== lock.executionPolicy.path) errors.push("Execution policy path differs from lock");
  if (sha256(fs.readFileSync(resolvedPolicyPath)) !== lock.executionPolicy.sha256) errors.push("Execution policy hash differs from lock");
  const preregistrationPath = path.resolve(repositoryRoot, policy.paths.preregistration);
  if (!fs.existsSync(preregistrationPath)) errors.push("Preregistration file is missing");
  else {
    if (path.relative(repositoryRoot, preregistrationPath) !== lock.preregistration.path) errors.push("Preregistration path differs from lock");
    if (sha256(fs.readFileSync(preregistrationPath)) !== lock.preregistration.sha256) errors.push("Preregistration hash differs from lock");
  }
  for (const [name, value] of [
    ["corpus", preregistration.corpus],
    ["primaryEndpoint", preregistration.primaryEndpoint],
    ["decisionRule", preregistration.decisionRule],
    ["structuralSecondaryEndpoint", preregistration.structuralSecondaryEndpoint],
    ["mechanismBridgeSecondary", preregistration.mechanismBridgeSecondary],
  ]) {
    if (E020.canonicalJson(lock[name]) !== E020.canonicalJson(value)) errors.push(`Preregistered ${name} differs from lock`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
}

function assertLockedEnvironment(lock, policy, repositoryRoot) {
  const errors = [];
  if (process.env.GITHUB_ACTIONS === "true") errors.push("Formal E-020 run is forbidden in GitHub Actions");
  if (fs.realpathSync(repositoryRoot) !== lock.environment.repositoryRoot) errors.push("Repository root changed after lock preparation");
  if (git(["rev-parse", "HEAD"], repositoryRoot) !== lock.environment.sourceCommit) errors.push("Source commit changed after lock preparation");
  if (git(["branch", "--show-current"], repositoryRoot) !== lock.environment.branch) errors.push("Branch changed after lock preparation");
  if (git(["status", "--porcelain=v1"], repositoryRoot) !== "") errors.push("Worktree is not clean");
  if (process.version !== lock.environment.nodeVersion) errors.push("Node.js version changed after lock preparation");
  if (lock.status !== "prepared-approved" || lock.approval?.approved !== true) errors.push(`Execution lock is not an approved E-020 lock: ${lock.status}`);
  if (lock.experimentId !== "E-020" || lock.experimentId !== policy.experimentId) errors.push("Execution lock experiment mismatch");
  if (lock.hypothesisId !== "H18") errors.push("Execution lock hypothesis mismatch");
  if (errors.length) throw new Error(errors.join("\n"));
}

function approve(lock, policy, suppliedToken) {
  if (policy.formalExecutionAllowed !== true || policy.status !== "approved-awaiting-local-lock" || policy.formalAuthorization?.granted !== true) {
    throw new Error("Formal E-020 execution is disabled by the repository execution policy");
  }
  if (!suppliedToken || suppliedToken !== policy.approvalToken) throw new Error("Exact E-020 formal-run approval token is required");
  if (sha256(suppliedToken) !== lock.approval?.approvalTokenSha256) throw new Error("Approval token does not match the E-020 execution lock");
  if (lock.approval?.approved !== true) throw new Error("E-020 execution lock was not prepared after explicit authorization");
}

function conditionRoot(policy, conditionId) { return path.join(policy.paths.corpusRoot, conditionId); }
function analysisPaths(policy, conditionId) {
  const root = path.join(policy.paths.analysisRoot, conditionId);
  return { root, archetypes: path.join(root, "archetypes"), controls: path.join(root, "controls") };
}

function completedGameCount(corpusRoot) {
  const gamesRoot = path.join(corpusRoot, "games");
  if (!fs.existsSync(gamesRoot)) return 0;
  return fs.readdirSync(gamesRoot).filter((name) => /^game-\d{4}\.json$/.test(name)).length;
}

function status(lock, policy, preregistration) {
  const conditions = {};
  for (const condition of preregistration.corpus.conditions) {
    const root = path.resolve(lock.environment.repositoryRoot, conditionRoot(policy, condition.conditionId));
    conditions[condition.conditionId] = {
      searchProfile: condition.searchProfile,
      completedGames: completedGameCount(root),
      plannedGames: preregistration.corpus.gamesPerCondition,
      manifestPresent: fs.existsSync(path.join(root, "manifest.json")),
    };
  }
  return {
    experimentId: lock.experimentId,
    hypothesisId: lock.hypothesisId,
    sourceCommit: lock.environment.sourceCommit,
    formalExecutionAllowed: policy.formalExecutionAllowed === true,
    policyStatus: policy.status,
    plannedGamesTotal: preregistration.corpus.totalGames,
    conditions,
  };
}

function requireConditionComplete(repositoryRoot, policy, preregistration, conditionId) {
  const root = path.resolve(repositoryRoot, conditionRoot(policy, conditionId));
  const manifestPath = path.join(root, "manifest.json");
  const gamesPath = path.join(root, "games.json");
  if (!fs.existsSync(manifestPath) || !fs.existsSync(gamesPath)) throw new Error(`${conditionId}: formal corpus manifest or games.json is missing`);
  const manifest = readJson(manifestPath);
  const games = readJson(gamesPath);
  if (Number(manifest.completedGames) !== preregistration.corpus.gamesPerCondition || games.length !== preregistration.corpus.gamesPerCondition) {
    throw new Error(`${conditionId}: formal corpus is not complete`);
  }
  if (manifest.config?.execution?.mode !== "formal") throw new Error(`${conditionId}: corpus manifest is not formal mode`);
  return root;
}

function runCorpus(lock, policy, preregistration, options) {
  approve(lock, policy, options.approvalToken);
  const loaded = E020.loadPreregistration(path.resolve(lock.environment.repositoryRoot, policy.paths.preregistration));
  const runOptions = {
    output: path.resolve(lock.environment.repositoryRoot, policy.paths.corpusRoot),
    fixtureGames: null,
    fixtureBaseSeed: null,
    force: false,
    status: false,
  };
  return preregistration.corpus.conditions.map((condition) => Runner.runCondition(loaded, condition, runOptions, "formal"));
}

function analyzeCorpus(lock, policy, preregistration) {
  const repositoryRoot = lock.environment.repositoryRoot;
  for (const condition of preregistration.corpus.conditions) {
    const corpusRoot = requireConditionComplete(repositoryRoot, policy, preregistration, condition.conditionId);
    const outputs = analysisPaths(policy, condition.conditionId);
    execute(policy.pythonCommand, [
      "tools/experiments/analyze-phase-transition-archetypes.py",
      "--input", corpusRoot,
      "--output", outputs.archetypes,
    ], repositoryRoot);
    execute(process.execPath, [
      "tools/experiments/analyze-forced-capture-regime-controls.js",
      "--observations", path.join(corpusRoot, "observations.jsonl"),
      "--candidates", path.join(outputs.archetypes, "archetype-members.csv"),
      "--output", outputs.controls,
    ], repositoryRoot);
  }
}

function verifyCorpus(lock, policy, preregistration, lockPath) {
  for (const condition of preregistration.corpus.conditions) requireConditionComplete(lock.environment.repositoryRoot, policy, preregistration, condition.conditionId);
  execute(process.execPath, [
    "tools/experiments/verify-phase-transition-d3-reversal-replication.js",
    "--config", policy.paths.preregistration,
    "--input", policy.paths.corpusRoot,
    "--lock", lockPath,
    "--output", policy.paths.integrityRoot,
  ], lock.environment.repositoryRoot);
}

function assertIntegrity(repositoryRoot, policy) {
  const filePath = path.resolve(repositoryRoot, policy.paths.integrityRoot, "d3-reversal-replication-integrity.json");
  if (!fs.existsSync(filePath)) throw new Error("Formal E-020 integrity result is missing; run verify first");
  const result = readJson(filePath);
  if (result.valid !== true || result.mode !== "formal" || result.experimentId !== "E-020" || result.hypothesisId !== "H18") {
    throw new Error("Formal E-020 integrity verification has not passed");
  }
  return result;
}

function writeInconclusive(policy, repositoryRoot, error) {
  const output = path.resolve(repositoryRoot, policy.paths.evaluationRoot);
  fs.mkdirSync(output, { recursive: true });
  const result = {
    experimentId: "E-020",
    hypothesisId: "H18",
    analysisVersion: "18-d3-reversal-replication",
    decision: "inconclusive",
    failureStage: "required-output-construction",
    structuralSecondaryMayChangePrimaryDecision: false,
    error: error.message,
  };
  fs.writeFileSync(path.join(output, "d3-reversal-replication-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  return result;
}

function evaluateCorpus(lock, policy, preregistration) {
  const repositoryRoot = lock.environment.repositoryRoot;
  for (const condition of preregistration.corpus.conditions) requireConditionComplete(repositoryRoot, policy, preregistration, condition.conditionId);
  assertIntegrity(repositoryRoot, policy);
  const p2 = analysisPaths(policy, "P2");
  const lg = analysisPaths(policy, "LG");
  try {
    const built = PairBuilder.run({
      config: path.resolve(repositoryRoot, policy.paths.preregistration),
      p2Games: path.resolve(repositoryRoot, conditionRoot(policy, "P2"), "games.json"),
      p2Candidates: path.resolve(repositoryRoot, p2.controls, "candidate-control-metrics.csv"),
      lgGames: path.resolve(repositoryRoot, conditionRoot(policy, "LG"), "games.json"),
      lgCandidates: path.resolve(repositoryRoot, lg.controls, "candidate-control-metrics.csv"),
      output: path.resolve(repositoryRoot, policy.paths.analysisRoot, "paired-game-endpoints.json"),
    });
    Structure.run({
      config: path.resolve(repositoryRoot, policy.paths.preregistration),
      p2Games: path.resolve(repositoryRoot, conditionRoot(policy, "P2"), "games.json"),
      p2Candidates: path.resolve(repositoryRoot, p2.controls, "candidate-control-metrics.csv"),
      p2Controls: path.resolve(repositoryRoot, p2.controls, "control-point-metrics.csv"),
      lgGames: path.resolve(repositoryRoot, conditionRoot(policy, "LG"), "games.json"),
      lgCandidates: path.resolve(repositoryRoot, lg.controls, "candidate-control-metrics.csv"),
      lgControls: path.resolve(repositoryRoot, lg.controls, "control-point-metrics.csv"),
      output: path.resolve(repositoryRoot, policy.paths.analysisRoot, "structure"),
    });
    const result = Evaluator.evaluate(preregistration, built.pairs);
    const output = path.resolve(repositoryRoot, policy.paths.evaluationRoot);
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(path.join(output, "d3-reversal-replication-result.json"), `${JSON.stringify(result, null, 2)}\n`);
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    const result = writeInconclusive(policy, repositoryRoot, error);
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
}

function main(options) {
  const lockPath = path.resolve(options.lock);
  const policyPath = path.resolve(options.policy);
  const lock = readJson(lockPath);
  const policy = readJson(policyPath);
  const repositoryRoot = lock.environment.repositoryRoot;
  const preregistration = readJson(path.resolve(repositoryRoot, policy.paths.preregistration));
  E020.validatePreregistration(preregistration);
  assertLockedInputs(lock, policyPath, policy, preregistration, repositoryRoot);
  assertLockedEnvironment(lock, policy, repositoryRoot);
  if (options.phase === "status") { const result = status(lock, policy, preregistration); console.log(JSON.stringify(result, null, 2)); return result; }
  if (options.phase === "run") return runCorpus(lock, policy, preregistration, options);
  if (options.phase === "analyze") return analyzeCorpus(lock, policy, preregistration);
  if (options.phase === "verify") return verifyCorpus(lock, policy, preregistration, lockPath);
  if (options.phase === "evaluate") return evaluateCorpus(lock, policy, preregistration);
  throw new Error(`Unknown phase: ${options.phase}`);
}

if (require.main === module) {
  try { main(parseArgs(process.argv.slice(2))); }
  catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
}

module.exports = {
  analysisPaths,
  approve,
  assertIntegrity,
  assertLockedEnvironment,
  assertLockedInputs,
  completedGameCount,
  conditionRoot,
  evaluateCorpus,
  parseArgs,
  status,
  writeInconclusive,
};
