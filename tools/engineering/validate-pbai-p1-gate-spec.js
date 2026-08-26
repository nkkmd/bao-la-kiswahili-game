#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const gatePath = path.join(
  ROOT,
  "doc/ai-engineering/public-ai-improvement-program-1/benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json",
);
const baselinePath = path.join(
  ROOT,
  "doc/ai-engineering/public-ai-improvement-program-1/baselines/AI-GEN2-BASELINE-2026-08-26-v1.json",
);

const gate = JSON.parse(fs.readFileSync(gatePath, "utf8"));
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));

assert.equal(gate.schemaVersion, 1);
assert.equal(gate.program, "PBAI-P1");
assert.equal(gate.phase, "PBAI-C");
assert.equal(gate.gateSpecId, "PBAI-C-GLOBAL-GATES-2026-08-26-v1");
assert.equal(gate.status, "FROZEN-BEFORE-CANDIDATE-IMPLEMENTATION");
assert.equal(gate.baselineId, baseline.baselineId);
assert.equal(gate.baselineSourceCommit, baseline.sourceOfTruth.repositoryCommit);

// These are historical freeze-time facts. The validator deliberately checks the
// immutable PBAI-C spec rather than requiring the current program state to keep
// development authorization at zero forever after PBAI-D begins.
assert.equal(gate.candidateImplementationsObservedBeforeFreeze, 0);
assert.equal(gate.candidateOutcomesObservedBeforeFreeze, 0);
assert.equal(gate.researchGeneration2EvidenceIncluded, false);
assert.equal(gate.principles.singleCandidateAblation, true);
assert.equal(gate.principles.hardGatesCannotBeOffset, true);
assert.equal(gate.principles.releaseHoldoutMayTuneCandidate, false);
assert.equal(gate.principles.unvalidatedSymmetryAllowed, false);

const intervals = [];
function collectIntervals(value, keyPath = []) {
  if (!value || typeof value !== "object") return;
  if (Number.isInteger(value.start) && Number.isInteger(value.end)) {
    assert.ok(value.start <= value.end, `${keyPath.join(".")} start <= end`);
    assert.ok(value.start >= 30_000_000, `${keyPath.join(".")} uses engineering seed namespace`);
    intervals.push({ start: value.start, end: value.end, label: keyPath.join(".") });
  }
  for (const [key, child] of Object.entries(value)) collectIntervals(child, [...keyPath, key]);
}
collectIntervals({
  strength: gate.fixedDepthStrength.seedBlocks,
  decision: gate.decisionQuality.sourceSeedBlocks,
  operational: gate.operationalQuality.sourceSeedBlocks,
});
intervals.sort((a, b) => a.start - b.start || a.end - b.end);
for (let index = 1; index < intervals.length; index += 1) {
  const previous = intervals[index - 1];
  const current = intervals[index];
  assert.ok(current.start > previous.end,
    `seed blocks overlap: ${previous.label} ${previous.start}-${previous.end} and ${current.label} ${current.start}-${current.end}`);
}

for (const [split, strata] of Object.entries(gate.fixedDepthStrength.seedBlocks)) {
  for (const [stratum, block] of Object.entries(strata)) {
    const inclusive = block.end - block.start + 1;
    assert.equal(inclusive, block.openingPairs, `${split}/${stratum} seed count equals pair count`);
    assert.equal(block.games, block.openingPairs * 2, `${split}/${stratum} games = 2 * pairs`);
  }
}

assert.equal(gate.fixedDepthStrength.bootstrap.replicates, 20000);
assert.equal(gate.fixedDepthStrength.bootstrap.analysisSeed, 31999991);
for (const split of ["validation", "releaseHoldout"]) {
  const strengthGate = gate.fixedDepthStrength.globalGate[split];
  assert.ok(strengthGate.coreObservedScoreMinimum >= 0.50,
    `${split} does not permit observed pooled strength below baseline`);
  assert.ok(strengthGate.coreOneSided95LowerBoundMinimum >= 0.47,
    `${split} lower confidence floor is bounded`);
  assert.ok(strengthGate.eachCorePhaseObservedScoreMinimum >= 0.48,
    `${split} has phase-local non-regression floor`);
  assert.ok(strengthGate.eachChallengeStratumObservedScoreMinimum >= 0.45,
    `${split} has challenge-stratum floor`);
}
const pooled = gate.fixedDepthStrength.globalGate.lockedValidationPlusHoldout;
assert.ok(pooled.coreObservedScoreMinimum >= 0.50);
assert.ok(pooled.coreOneSided95LowerBoundMinimum >= 0.48);

for (const split of ["validation", "releaseHoldout"]) {
  const dq = gate.decisionQuality.gate[split];
  assert.equal(dq.catastrophicNewLossCountMaximum, 0);
  assert.ok(dq.severeLossRateExcessOverBaselineMaximum <= 0.01);
  assert.ok(dq.topSetAgreementDeltaMinimum >= -0.02);
  assert.ok(dq.meanNormalizedRankLossDeltaMaximum <= 0.02);
}
const pooledDq = gate.decisionQuality.gate.lockedValidationPlusHoldout;
assert.equal(pooledDq.catastrophicNewLossCountMaximum, 0);
assert.ok(pooledDq.severeLossRateExcessOverBaselineMaximum <= 0.005);
assert.ok(pooledDq.topSetAgreementDeltaMinimum >= -0.01);
assert.ok(pooledDq.meanNormalizedRankLossDeltaMaximum <= 0.01);

const operational = gate.operationalQuality.gate;
assert.equal(operational.crashOrUnhandledExceptionCountMaximum, 0);
assert.equal(operational.illegalMoveCountMaximum, 0);
assert.equal(operational.invalidStateGenerationCountMaximum, 0);
assert.ok(operational.medianElapsedRatioCandidateOverBaselineMaximum <= 1.05);
assert.ok(operational.p95ElapsedRatioCandidateOverBaselineMaximum <= 1.10);
assert.ok(operational.fractionRootsWithCompletedDepthDeficitAtLeast2Maximum <= 0.05);
assert.equal(operational.directWorkerDeterministicMismatchCountMaximum, 0);

assert.equal(gate.correctnessAndRegression.hardGate, true);
assert.equal(gate.correctnessAndRegression.publicEngineSha256MustRemain,
  baseline.fileIdentity["public/engine.js"].sha256);
assert.equal(gate.correctnessAndRegression.existingTacticalSuiteFailureMaximum, 0);
assert.equal(gate.correctnessAndRegression.candidateSpecificRegressionFailureMaximum, 0);
assert.equal(gate.correctnessAndRegression.unvalidatedSymmetryCanonicalizationAllowed, false);
assert.equal(gate.correctnessAndRegression.researchGeneration1RawIdentityViolationAllowed, false);

assert.equal(gate.candidateSpecificGateFloor.mustBeFrozenBeforeDevelopmentAuthorization, true);
assert.equal(gate.candidateSpecificGateFloor.mayRelaxGlobalGate, false);
assert.equal(gate.implementationIsolation.candidateMustBeFeatureGated, true);
assert.equal(gate.implementationIsolation.featureDefaultBeforeAdoption, "off");
assert.equal(gate.implementationIsolation.featureOffMustReproduceFrozenBaselineBehavior, true);
assert.equal(gate.releaseHoldout.authorizedAtPBAI_C, false);
assert.equal(gate.releaseHoldout.tuningAfterHoldoutInspectionAllowed, false);
assert.equal(gate.releaseDecision.allRequiredGlobalHardGatesMustPass, true);
assert.equal(gate.releaseDecision.noAcceptableCandidateOutcome, "KEEP-AI-GEN2");

console.log("PBAI-P1 PBAI-C global gate specification: PASS");
