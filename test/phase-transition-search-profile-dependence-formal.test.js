"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const E018 = require("../tools/experiments/lib/phase-transition-search-profile-dependence.js");
const Prepare = require("../tools/experiments/prepare-phase-transition-search-profile-dependence-execution.js");
const Runner = require("../tools/experiments/run-phase-transition-search-profile-dependence.js");
const Formal = require("../tools/experiments/run-phase-transition-search-profile-dependence-formal.js");
const Verify = require("../tools/experiments/verify-phase-transition-search-profile-dependence.js");

const repositoryRoot = path.resolve(__dirname, "..");
const loaded = E018.loadPreregistration(
  "config/experiments/phase-transition-search-profile-dependence-v1.json",
);
const executionPolicy = JSON.parse(fs.readFileSync(
  "config/experiments/phase-transition-search-profile-dependence-execution-policy-v1.json",
  "utf8",
));
const validPolicyStates = new Map([
  ["prepared-not-approved", false],
  ["approved-awaiting-local-lock", true],
]);
assert.equal(validPolicyStates.has(executionPolicy.status), true);
assert.equal(executionPolicy.formalExecutionAllowed, validPolicyStates.get(executionPolicy.status));
assert.equal(Prepare.gitIgnored(
  "artifacts/phase-transition/search-profile-dependence-v1",
  repositoryRoot,
), true);

const condition = Runner.normalizeCondition(
  E018.conditionById(loaded.config, "P2"),
  loaded.config.corpus,
);
const formalConfig = Runner.buildConditionConfig(
  loaded.config,
  condition,
  loaded.config.corpus.gamesPerCondition,
  loaded.sha256,
  "formal",
);
assert.equal(formalConfig.execution.mode, "formal");
assert.equal(formalConfig.execution.formalExecutionApproved, true);
assert.equal(formalConfig.execution.actualGames, 2000);

assert.throws(() => Verify.parseArgs([]), /requires --lock/);
const fixtureArgs = Verify.parseArgs(["--fixture-games", "2"]);
assert.equal(fixtureArgs.fixtureGames, 2);
assert.equal(fixtureArgs.lock, null);
const formalArgs = Verify.parseArgs(["--lock", "execution-lock.json"]);
assert.equal(formalArgs.fixtureGames, null);
assert.equal(formalArgs.lock, "execution-lock.json");
assert.throws(
  () => Verify.parseArgs(["--fixture-games", "2", "--lock", "execution-lock.json"]),
  /either fixture verification or formal lock verification/,
);

const approvalToken = "E-018-FORMAL-APPROVED";
const approvalLock = {
  approval: { approvalTokenSha256: Formal.sha256(approvalToken) },
};
const approvedPolicy = {
  experimentId: "E-018",
  status: "approved-awaiting-local-lock",
  formalExecutionAllowed: true,
  approvalToken,
};
assert.doesNotThrow(() => Formal.approve(approvalLock, approvedPolicy, approvalToken));
assert.throws(() => Formal.approve(approvalLock, approvedPolicy, "wrong"));
assert.throws(() => Formal.approve(
  approvalLock,
  { ...approvedPolicy, status: "prepared-not-approved", formalExecutionAllowed: false },
  approvalToken,
));

const environment = {
  repositoryRoot: executionPolicy.repositoryPath,
  branch: executionPolicy.branch,
  nodeVersion: executionPolicy.expectedNodeVersion,
  platform: executionPolicy.expectedPlatform,
  worktreeStatus: "",
  githubActions: false,
  corpusRootIgnored: true,
};
const preparedPolicy = {
  ...executionPolicy,
  status: "prepared-not-approved",
  formalExecutionAllowed: false,
};
assert.deepEqual(
  Prepare.validateEnvironment(preparedPolicy, environment, loaded.config),
  [],
);
assert.deepEqual(
  Prepare.validateEnvironment(
    { ...executionPolicy, status: "approved-awaiting-local-lock", formalExecutionAllowed: true },
    environment,
    loaded.config,
  ),
  [],
);
assert.ok(Prepare.validateEnvironment(
  executionPolicy,
  { ...environment, githubActions: true },
  loaded.config,
).includes("Formal execution lock cannot be prepared in GitHub Actions."));

const root = fs.mkdtempSync(path.join(os.tmpdir(), "e018-formal-"));
const policyPath = path.join(root, "execution-policy.json");
const preregistrationPath = path.join(root, "preregistration.json");
const lockedPolicy = { paths: { preregistration: "preregistration.json" } };
const lockedPreregistration = {
  corpus: { gamesPerCondition: 2, totalGames: 4 },
  primaryEndpoint: { minimumDiscordantPairs: 20 },
  decisionRule: { confirmed: "fixed" },
};
const policyBytes = `${JSON.stringify(lockedPolicy)}\n`;
const preregistrationBytes = `${JSON.stringify(lockedPreregistration)}\n`;
fs.writeFileSync(policyPath, policyBytes);
fs.writeFileSync(preregistrationPath, preregistrationBytes);
const inputLock = {
  executionPolicy: {
    path: "execution-policy.json",
    sha256: Formal.sha256(policyBytes),
  },
  preregistration: {
    path: "preregistration.json",
    sha256: Formal.sha256(preregistrationBytes),
  },
  corpus: lockedPreregistration.corpus,
  primaryEndpoint: lockedPreregistration.primaryEndpoint,
  decisionRule: lockedPreregistration.decisionRule,
};
assert.doesNotThrow(() => Formal.assertLockedInputs(
  inputLock,
  policyPath,
  lockedPolicy,
  lockedPreregistration,
  root,
));
assert.throws(() => Formal.assertLockedInputs(
  inputLock,
  policyPath,
  lockedPolicy,
  { ...lockedPreregistration, primaryEndpoint: { minimumDiscordantPairs: 19 } },
  root,
));

const result = Formal.writeInconclusive(
  { paths: { evaluationRoot: "evaluation" } },
  root,
  new Error("synthetic output failure"),
);
assert.equal(result.decision, "inconclusive");
assert.equal(result.failureStage, "required-output-construction");
assert.equal(JSON.parse(fs.readFileSync(
  path.join(root, "evaluation", "search-profile-dependence-result.json"),
  "utf8",
)).decision, "inconclusive");

console.log("phase transition search profile dependence formal tests passed");
