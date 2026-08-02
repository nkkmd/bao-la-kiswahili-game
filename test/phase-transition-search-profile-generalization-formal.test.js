"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const E019 = require("../tools/experiments/lib/phase-transition-search-profile-generalization.js");
const Prepare = require("../tools/experiments/prepare-phase-transition-search-profile-generalization-execution.js");
const Runner = require("../tools/experiments/run-phase-transition-search-profile-generalization.js");
const Formal = require("../tools/experiments/run-phase-transition-search-profile-generalization-formal.js");
const Verify = require("../tools/experiments/verify-phase-transition-search-profile-generalization.js");

const repositoryRoot = path.resolve(__dirname, "..");
const loaded = E019.loadPreregistration("config/experiments/phase-transition-search-profile-generalization-v2.json");
const executionPolicy = JSON.parse(fs.readFileSync(
  "config/experiments/phase-transition-search-profile-generalization-execution-policy-v2.json",
  "utf8",
));
assert.equal(executionPolicy.formalExecutionAllowed, false);
assert.equal(executionPolicy.status, "infrastructure-validated-awaiting-authorization");
assert.equal(executionPolicy.infrastructureValidation.validated, true);
assert.equal(executionPolicy.infrastructureValidation.workflowRunId, 30747182554);
assert.equal(Prepare.gitIgnored("artifacts/phase-transition/search-profile-generalization-v2", repositoryRoot), true);

const d1 = Runner.normalizeCondition(loaded.config, "D1-P2");
const formalConfig = Runner.buildConditionConfig(
  loaded.config,
  d1,
  d1.pairedSeeds,
  d1.seedRange[0],
  loaded.sha256,
  "formal",
);
assert.equal(formalConfig.execution.mode, "formal");
assert.equal(formalConfig.execution.formalExecutionApproved, true);
assert.equal(formalConfig.execution.actualGames, 6500);
assert.equal(formalConfig.configHash, undefined);
assert.equal(Formal.plannedGamesForCondition(loaded.config, "D1-P2"), 6500);
assert.equal(Formal.plannedGamesForCondition(loaded.config, "D3-LG"), 4500);
assert.equal(Formal.plannedGamesForCondition(loaded.config, "V2-P2"), 2000);

assert.throws(() => Verify.parseArgs([]), /requires --lock/);
const fixtureArgs = Verify.parseArgs(["--fixture-games", "2"]);
assert.equal(fixtureArgs.fixtureGames, 2);
assert.equal(fixtureArgs.lock, null);
const formalArgs = Verify.parseArgs(["--lock", "execution-lock.json"]);
assert.equal(formalArgs.fixtureGames, null);
assert.equal(formalArgs.lock, "execution-lock.json");
assert.throws(() => Verify.parseArgs(["--fixture-games", "2", "--lock", "execution-lock.json"]), /either fixture verification or formal lock verification/);

const environment = {
  repositoryRoot: executionPolicy.repositoryPath,
  branch: executionPolicy.branch,
  nodeVersion: executionPolicy.expectedNodeVersion,
  platform: executionPolicy.expectedPlatform,
  worktreeStatus: "",
  githubActions: false,
  corpusRootIgnored: true,
  python: {
    version: executionPolicy.pythonEnvironment.expectedPythonVersion,
    packages: { ...executionPolicy.pythonEnvironment.expectedPackages },
    error: null,
  },
};
const preAuthorizationErrors = Prepare.validateEnvironment(executionPolicy, environment, loaded.config);
assert.ok(preAuthorizationErrors.includes("E-019-specific formal authorization is required before preparing an execution lock."));
const approvedPolicy = { ...executionPolicy, status: "approved-awaiting-local-lock", formalExecutionAllowed: true };
assert.deepEqual(Prepare.validateEnvironment(approvedPolicy, environment, loaded.config), []);
assert.ok(Prepare.validateEnvironment(approvedPolicy, { ...environment, githubActions: true }, loaded.config).includes("Formal E-019 execution lock cannot be prepared in GitHub Actions."));

const approvalToken = "E-019-FORMAL-APPROVED";
const approvalLock = { approval: { approved: true, approvalTokenSha256: Prepare.sha256(approvalToken) } };
assert.doesNotThrow(() => Formal.approve(approvalLock, approvedPolicy, approvalToken));
assert.throws(() => Formal.approve(approvalLock, approvedPolicy, "wrong"));
assert.throws(() => Formal.approve(approvalLock, executionPolicy, approvalToken));

const root = fs.mkdtempSync(path.join(os.tmpdir(), "e019-formal-"));
const policyPath = path.join(root, "execution-policy.json");
const preregistrationPath = path.join(root, "preregistration.json");
const lockedPolicy = { paths: { preregistration: "preregistration.json" } };
const lockedPreregistration = {
  corpus: { totalGames: 26000 },
  primaryEndpoint: { minimumDiscordantPairsPerStratum: 20 },
  conditionDecisionRule: { pass: "fixed" },
  globalDecisionRule: { confirmed: "fixed" },
  individualStandaloneInference: { method: "fixed" },
  structuralSecondaryEndpoint: { status: "fixed" },
};
const policyBytes = `${JSON.stringify(lockedPolicy)}\n`;
const preregistrationBytes = `${JSON.stringify(lockedPreregistration)}\n`;
fs.writeFileSync(policyPath, policyBytes);
fs.writeFileSync(preregistrationPath, preregistrationBytes);
const inputLock = {
  executionPolicy: { path: "execution-policy.json", sha256: Prepare.sha256(policyBytes) },
  preregistration: { path: "preregistration.json", sha256: Prepare.sha256(preregistrationBytes) },
  corpus: lockedPreregistration.corpus,
  primaryEndpoint: lockedPreregistration.primaryEndpoint,
  conditionDecisionRule: lockedPreregistration.conditionDecisionRule,
  globalDecisionRule: lockedPreregistration.globalDecisionRule,
  individualStandaloneInference: lockedPreregistration.individualStandaloneInference,
  structuralSecondaryEndpoint: lockedPreregistration.structuralSecondaryEndpoint,
};
assert.doesNotThrow(() => Formal.assertLockedInputs(inputLock, policyPath, lockedPolicy, lockedPreregistration, root));
assert.throws(() => Formal.assertLockedInputs(
  inputLock,
  policyPath,
  lockedPolicy,
  { ...lockedPreregistration, primaryEndpoint: { minimumDiscordantPairsPerStratum: 19 } },
  root,
));

const result = Formal.writeInconclusive({ paths: { evaluationRoot: "evaluation" } }, root, new Error("synthetic output failure"));
assert.equal(result.globalDecision, "inconclusive");
assert.equal(result.failureStage, "required-output-construction");
assert.equal(JSON.parse(fs.readFileSync(path.join(root, "evaluation", "search-profile-generalization-result.json"), "utf8")).globalDecision, "inconclusive");

console.log("phase transition search profile generalization formal tests passed");
