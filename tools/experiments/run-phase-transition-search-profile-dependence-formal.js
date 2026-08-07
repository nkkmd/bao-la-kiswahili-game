#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const E018 = require("./lib/phase-transition-search-profile-dependence.js");
const Runner = require("./run-phase-transition-search-profile-dependence.js");
const PairBuilder = require("./build-phase-transition-search-profile-pairs.js");
const Evaluator = require("./evaluate-phase-transition-search-profile-dependence.js");
const Structure = require("./summarize-phase-transition-search-profile-structure.js");

function parseArgs(argv) {
  const options = {
    phase: "status",
    lock: "artifacts/phase-transition/search-profile-dependence-v1/execution-lock.json",
    policy: "config/experiments/phase-transition-search-profile-dependence-execution-policy-v1.json",
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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

function execute(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: "inherit" });
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
  if (E018.canonicalJson(preregistration.corpus) !== E018.canonicalJson(lock.corpus)) {
    errors.push("Preregistered corpus differs from the execution lock.");
  }
  if (E018.canonicalJson(preregistration.primaryEndpoint) !== E018.canonicalJson(lock.primaryEndpoint)) {
    errors.push("Preregistered primary endpoint differs from the execution lock.");
  }
  if (E018.canonicalJson(preregistration.decisionRule) !== E018.canonicalJson(lock.decisionRule)) {
    errors.push("Preregistered decision rule differs from the execution lock.");
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
  if (policy.formalExecutionAllowed !== true || policy.status !== "approved-awaiting-local-lock") {
    throw new Error("Formal E-018 execution is disabled by the repository execution policy.");
  }
  if (!suppliedToken || suppliedToken !== policy.approvalToken) {
    throw new Error("Exact E-018 formal-run approval token is required.");
  }
  if (sha256(suppliedToken) !== lock.approval.approvalTokenSha256) {
    throw new Error("Approval token does not match the execution lock.");
  }
}

function conditionRoot(policy, conditionId) {
  return path.join(policy.paths.corpusRoot, conditionId);
}

function analysisPaths(policy, conditionId) {
  const root = path.join(policy.paths.analysisRoot, conditionId);
  return {
    root,
    archetypes: path.join(root, "archetypes"),
    controls: path.join(root, "controls"),
  };
}

function completedGameCount(corpusRoot) {
  const gamesRoot = path.join(corpusRoot, "games");
  if (!fs.existsSync(gamesRoot)) return 0;
  return fs.readdirSync(gamesRoot).filter((name) => /^game-\d{4}\.json$/.test(name)).length;
}

function status(lock, policy, preregistration) {
  const repositoryRoot = lock.environment.repositoryRoot;
  const conditions = {};
  for (const condition of preregistration.corpus.conditions) {
    const root = path.resolve(repositoryRoot, conditionRoot(policy, condition.conditionId));
    conditions[condition.conditionId] = {
      searchProfile: condition.searchProfile,
      completedGames: completedGameCount(root),
      plannedGames: preregistration.corpus.gamesPerCondition,
      manifestPresent: fs.existsSync(path.join(root, "manifest.json")),
    };
  }
  return {
    experimentId: lock.experimentId,
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
  if (!fs.existsSync(manifestPath) || !fs.existsSync(gamesPath)) {
    throw new Error(`${conditionId}: formal corpus manifest or games.json is missing.`);
  }
  const manifest = readJson(manifestPath);
  const games = readJson(gamesPath);
  if (Number(manifest.completedGames) !== Number(preregistration.corpus.gamesPerCondition)
      || games.length !== Number(preregistration.corpus.gamesPerCondition)) {
    throw new Error(`${conditionId}: formal corpus is not complete.`);
  }
  if (manifest.config?.execution?.mode !== "formal") {
    throw new Error(`${conditionId}: corpus manifest is not formal mode.`);
  }
  return root;
}

function runCorpus(lock, policy, preregistration, options) {
  approve(lock, policy, options.approvalToken);
  const loaded = E018.loadPreregistration(path.resolve(lock.environment.repositoryRoot, policy.paths.preregistration));
  const runOptions = {
    output: path.resolve(lock.environment.repositoryRoot, policy.paths.corpusRoot),
    fixtureGames: null,
    force: false,
    status: false,
  };
  const results = [];
  for (const condition of preregistration.corpus.conditions) {
    results.push(Runner.runCondition(loaded, condition, runOptions, "formal"));
  }
  return results;
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
  for (const condition of preregistration.corpus.conditions) {
    requireConditionComplete(lock.environment.repositoryRoot, policy, preregistration, condition.conditionId);
  }
  execute(process.execPath, [
    "tools/experiments/verify-phase-transition-search-profile-dependence.js",
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
    "search-profile-dependence-integrity.json",
  );
  if (!fs.existsSync(filePath)) {
    throw new Error("Formal E-018 integrity result is missing; run the verify phase first.");
  }
  const result = readJson(filePath);
  if (result.valid !== true || result.mode !== "formal" || result.experimentId !== "E-018") {
    throw new Error("Formal E-018 integrity verification has not passed.");
  }
  return result;
}

function writeInconclusive(policy, repositoryRoot, error) {
  const output = path.resolve(repositoryRoot, policy.paths.evaluationRoot);
  fs.mkdirSync(output, { recursive: true });
  const result = {
    experimentId: "E-018",
    analysisVersion: "16-search-profile-dependence",
    decision: "inconclusive",
    failureStage: "required-output-construction",
    error: error.message,
  };
  fs.writeFileSync(
    path.join(output, "search-profile-dependence-result.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  return result;
}

function evaluateCorpus(lock, policy, preregistration) {
  const repositoryRoot = lock.environment.repositoryRoot;
  for (const condition of preregistration.corpus.conditions) {
    requireConditionComplete(repositoryRoot, policy, preregistration, condition.conditionId);
  }
  assertIntegrity(repositoryRoot, policy);
  const p2 = analysisPaths(policy, "P2");
  const lg = analysisPaths(policy, "LG");
  const pairPath = path.resolve(repositoryRoot, policy.paths.analysisRoot, "paired-game-endpoints.json");
  try {
    const built = PairBuilder.run({
      config: path.resolve(repositoryRoot, policy.paths.preregistration),
      p2Games: path.resolve(repositoryRoot, conditionRoot(policy, "P2"), "games.json"),
      p2Candidates: path.resolve(repositoryRoot, p2.controls, "candidate-control-metrics.csv"),
      lgGames: path.resolve(repositoryRoot, conditionRoot(policy, "LG"), "games.json"),
      lgCandidates: path.resolve(repositoryRoot, lg.controls, "candidate-control-metrics.csv"),
      output: pairPath,
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
    fs.writeFileSync(
      path.join(output, "search-profile-dependence-result.json"),
      `${JSON.stringify(result, null, 2)}\n`,
    );
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
  E018.validatePreregistration(preregistration);
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
  analysisPaths,
  approve,
  assertIntegrity,
  assertLockedEnvironment,
  assertLockedInputs,
  completedGameCount,
  conditionRoot,
  evaluateCorpus,
  parseArgs,
  sha256,
  status,
  writeInconclusive,
};
