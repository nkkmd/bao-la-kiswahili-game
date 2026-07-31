"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const Formal = require("../tools/experiments/run-phase-transition-robustness-formal.js");
const Prepare = require("../tools/experiments/prepare-phase-transition-robustness-execution.js");

assert.equal(Prepare.sha256("abc").length, 64);

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

const errors = Prepare.validateEnvironment({
  repositoryPath: "/repo",
  branch: "research/forced-capture-regime-analysis",
  expectedNodeVersion: process.version,
  expectedPlatform: process.platform,
  requireCleanWorktree: true,
  experimentId: "E-011",
  runOrder: ["C0", "C1"],
}, {
  repositoryRoot: "/repo",
  branch: "research/forced-capture-regime-analysis",
  nodeVersion: process.version,
  platform: process.platform,
  worktreeStatus: "",
}, {
  experimentId: "E-011",
  executionPolicy: { runOrder: ["C0", "C1"] },
});
assert.deepEqual(errors, []);

console.log("phase transition robustness formal execution tests passed");
