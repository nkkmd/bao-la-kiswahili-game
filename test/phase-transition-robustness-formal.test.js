"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const Formal = require("../tools/experiments/run-phase-transition-robustness-formal.js");
const Prepare = require("../tools/experiments/prepare-phase-transition-robustness-execution.js");

assert.equal(Prepare.sha256("abc").length, 64);
assert.equal(Prepare.gitIgnored(
  "artifacts/phase-transition/robustness-v1",
  path.resolve(__dirname, ".."),
), true);

const policy = {
  experimentId: "E-011",
  formalExecutionAllowed: true,
  approvalToken: "E-011-FORMAL-APPROVED",
  runOrder: ["C0", "C1"],
};
const lock = {
  approval: {
    approvalTokenSha256: Prepare.sha256(policy.approvalToken),
  },
};
assert.doesNotThrow(() => Formal.approve(lock, policy, policy.approvalToken));
assert.throws(() => Formal.approve(lock, policy, "wrong"));
assert.throws(() => Formal.approve(
  lock,
  { ...policy, formalExecutionAllowed: false },
  policy.approvalToken,
));

const root = fs.mkdtempSync(path.join(os.tmpdir(), "e011-formal-"));
assert.equal(Formal.nextCondition(policy.runOrder, root), "C0");
fs.mkdirSync(path.join(root, "C0"));
fs.writeFileSync(path.join(root, "C0", "manifest.json"), "{}\n");
assert.equal(Formal.nextCondition(policy.runOrder, root), "C1");
fs.mkdirSync(path.join(root, "C1"));
fs.writeFileSync(path.join(root, "C1", "manifest.json"), "{}\n");
assert.equal(Formal.nextCondition(policy.runOrder, root), null);

const integrityPath = path.join(root, "robustness-integrity.json");
assert.throws(() => Formal.assertIntegrity(integrityPath));
fs.writeFileSync(integrityPath, JSON.stringify({ valid: false, mode: "formal" }));
assert.throws(() => Formal.assertIntegrity(integrityPath));
fs.writeFileSync(integrityPath, JSON.stringify({ valid: true, mode: "fixture" }));
assert.throws(() => Formal.assertIntegrity(integrityPath));
fs.writeFileSync(integrityPath, JSON.stringify({ valid: true, mode: "formal" }));
assert.equal(Formal.assertIntegrity(integrityPath).valid, true);

const policyPath = path.join(root, "execution-policy.json");
const preregistrationPath = path.join(root, "preregistration.json");
const lockedPolicy = { paths: { preregistration: "preregistration.json" } };
const policyBytes = `${JSON.stringify(lockedPolicy)}\n`;
const preregistrationBytes = "{\"experimentId\":\"E-011\"}\n";
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
};
assert.doesNotThrow(() => Formal.assertLockedInputs(
  inputLock,
  policyPath,
  lockedPolicy,
  root,
));
fs.writeFileSync(preregistrationPath, "{\"experimentId\":\"changed\"}\n");
assert.throws(() => Formal.assertLockedInputs(
  inputLock,
  policyPath,
  lockedPolicy,
  root,
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
  experimentId: "E-011",
  runOrder: ["C0", "C1"],
};
const preregistration = {
  experimentId: "E-011",
  executionPolicy: { runOrder: ["C0", "C1"] },
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

console.log("phase transition robustness formal execution tests passed");
