"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const Formal = require("../tools/experiments/run-phase-transition-d3-reversal-replication-formal.js");
const Prepare = require("../tools/experiments/prepare-phase-transition-d3-reversal-replication-execution.js");
const E020 = require("../tools/experiments/lib/phase-transition-d3-reversal-replication.js");

const policy = JSON.parse(fs.readFileSync(
  "config/experiments/phase-transition-d3-reversal-replication-execution-policy-v1.json",
  "utf8",
));
const preregistration = JSON.parse(fs.readFileSync(
  "config/experiments/phase-transition-d3-reversal-replication-v1.json",
  "utf8",
));
E020.validatePreregistration(preregistration);

assert.equal(policy.experimentId, "E-020");
assert.equal(policy.formalExecutionAllowed, true);
assert.equal(policy.formalAuthorization.granted, true);
assert.equal(policy.githubActionsFormalRunAllowed, false);
assert.match(policy.activationRule, /separate explicit user instruction specific to E-020/);

// Preserve coverage of the pre-authorization guard without requiring the
// repository's historical execution policy to remain in its pre-approval state.
const preAuthorizationPolicy = JSON.parse(JSON.stringify(policy));
preAuthorizationPolicy.formalExecutionAllowed = false;
preAuthorizationPolicy.status = "infrastructure-validated-awaiting-authorization";
preAuthorizationPolicy.formalAuthorization.granted = false;

const fakeLock = {
  approval: {
    approved: false,
    approvalTokenSha256: Prepare.sha256(policy.approvalToken),
  },
};
assert.throws(
  () => Formal.approve(fakeLock, preAuthorizationPolicy, policy.approvalToken),
  /disabled by the repository execution policy/,
);

const otherwiseValidEnvironment = {
  githubActions: false,
  repositoryRoot: policy.repositoryPath,
  branch: policy.branch,
  nodeVersion: policy.expectedNodeVersion,
  platform: policy.expectedPlatform,
  worktreeStatus: "",
  corpusRootIgnored: true,
  python: {
    error: null,
    version: policy.pythonEnvironment.expectedPythonVersion,
    packages: { ...policy.pythonEnvironment.expectedPackages },
  },
};
const authorizationErrors = Prepare.validateEnvironment(
  preAuthorizationPolicy,
  otherwiseValidEnvironment,
  preregistration,
);
assert.ok(authorizationErrors.some((message) => message.includes("explicit formal authorization")));

const noAuthorizationErrors = Prepare.validateEnvironment(policy, otherwiseValidEnvironment, preregistration);
assert.equal(noAuthorizationErrors.length, 0);

const directionChanged = JSON.parse(JSON.stringify(preregistration));
directionChanged.primaryEndpoint.directionRequirement = "phase2-only discordant pairs must exceed legacy-only discordant pairs";
assert.throws(() => E020.validatePreregistration(directionChanged), /prospective direction changed/);

const overlappingSeeds = JSON.parse(JSON.stringify(preregistration));
overlappingSeeds.corpus.seedRange = [20268001, 20272500];
overlappingSeeds.independence.newSeedRange = [20268001, 20272500];
assert.throws(() => E020.validatePreregistration(overlappingSeeds), /overlaps a prior block/);

console.log("phase transition D3 reversal formal guard tests passed");
