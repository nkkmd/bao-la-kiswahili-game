"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const Prepare = require("../tools/experiments/prepare-phase-transition-independent-confirmation-execution.js");
const Formal = require("../tools/experiments/run-phase-transition-independent-confirmation-formal.js");
const Verify = require("../tools/experiments/verify-phase-transition-independent-confirmation.js");

const repositoryRoot = path.resolve(__dirname, "..");
assert.equal(Prepare.gitIgnored(
  "artifacts/phase-transition/independent-confirmation-v2",
  repositoryRoot,
), true);

const approvalToken = "E-017-FORMAL-APPROVED";
const policy = {
  experimentId: "E-017",
  formalExecutionAllowed: true,
  approvalToken,
};
const approvalLock = {
  approval: { approvalTokenSha256: Formal.sha256(approvalToken) },
};
assert.doesNotThrow(() => Formal.approve(approvalLock, policy, approvalToken));
assert.throws(() => Formal.approve(approvalLock, policy, "wrong"));
assert.throws(() => Formal.approve(
  approvalLock,
  { ...policy, formalExecutionAllowed: false },
  approvalToken,
));

const environment = {
  repositoryRoot: "/repo",
  branch: "research/forced-capture-regime-analysis",
  nodeVersion: process.version,
  platform: process.platform,
  worktreeStatus: "",
  githubActions: false,
  corpusRootIgnored: true,
};
const executionPolicy = {
  repositoryPath: "/repo",
  branch: "research/forced-capture-regime-analysis",
  expectedNodeVersion: process.version,
  expectedPlatform: process.platform,
  requireCleanWorktree: true,
  experimentId: "E-017",
};
const preregistration = {
  experimentId: "E-017",
  corpus: { games: 1000, baseSeed: 20263001 },
};
assert.deepEqual(
  Prepare.validateEnvironment(executionPolicy, environment, preregistration),
  [],
);
assert.deepEqual(
  Prepare.validateEnvironment(
    executionPolicy,
    { ...environment, githubActions: true },
    preregistration,
  ),
  ["Formal execution lock cannot be prepared in GitHub Actions."],
);
assert.deepEqual(
  Prepare.validateEnvironment(
    executionPolicy,
    { ...environment, corpusRootIgnored: false },
    preregistration,
  ),
  ["Formal corpus root is not ignored by git."],
);

const root = fs.mkdtempSync(path.join(os.tmpdir(), "e017-formal-"));
assert.equal(Formal.completedGameCount(root), 0);
fs.mkdirSync(path.join(root, "games"));
fs.writeFileSync(path.join(root, "games", "game-0000.json"), "{}\n");
fs.writeFileSync(path.join(root, "games", "unrelated.json"), "{}\n");
assert.equal(Formal.completedGameCount(root), 1);

const policyPath = path.join(root, "execution-policy.json");
const preregistrationPath = path.join(root, "preregistration.json");
const lockedPolicy = { paths: { preregistration: "preregistration.json" } };
const lockedPreregistration = { corpus: { games: 3, baseSeed: 100 } };
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
  { corpus: { games: 4, baseSeed: 100 } },
  root,
));

const integrityConfig = {
  experimentId: "E-017",
  analysisVersion: "test",
  corpus: {
    profile: "pilot-v2",
    games: 2,
    baseSeed: 100,
    level: "hard",
    evaluationProfile: "bao",
    searchProfile: "phase2",
    maxDepth: 2,
  },
};
const integrityManifest = {
  completedGames: 2,
  sourceCommit: "locked-commit",
  configHash: "fixture-hash",
  config: {
    profile: "pilot-v2",
    games: 2,
    baseSeed: 100,
    condition: {
      level: "hard",
      evaluator: "bao",
      search: "phase2",
      maxDepth: 2,
    },
  },
};
const integrityGames = [
  { gameId: "g1", seed: 100, trajectoryHash: "t1", configHash: "fixture-hash" },
  { gameId: "g2", seed: 101, trajectoryHash: "t2", configHash: "fixture-hash" },
];
const integrityLock = {
  experimentId: "E-017",
  analysisVersion: "test",
  environment: { sourceCommit: "locked-commit" },
  preregistration: { sha256: "a".repeat(64) },
  executionPolicy: { sha256: "b".repeat(64) },
};
const validIntegrity = Verify.buildIntegrity(
  integrityConfig,
  integrityManifest,
  integrityGames,
  integrityLock,
  { observations: 10, games: 2 },
  null,
);
assert.equal(validIntegrity.valid, true);
assert.equal(validIntegrity.mode, "formal");
const invalidIntegrity = Verify.buildIntegrity(
  integrityConfig,
  { ...integrityManifest, sourceCommit: "changed" },
  integrityGames,
  integrityLock,
  { observations: 10, games: 2 },
  null,
);
assert.equal(invalidIntegrity.valid, false);
assert.equal(invalidIntegrity.checks.sourceCommitMatchesLock, false);

console.log("phase transition independent confirmation formal tests passed");
