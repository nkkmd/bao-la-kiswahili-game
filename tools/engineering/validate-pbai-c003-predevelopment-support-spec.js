#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const BASE = "doc/ai-engineering/public-ai-improvement-program-1/";
const SPEC_PATH = `${BASE}candidates/PBAI-C003-v1-predevelopment-support-spec.json`;
const GATE_PATH = `${BASE}benchmark/PBAI-C-GLOBAL-GATES-2026-08-26-v1.json`;
const ORACLE_PATH = "doc/restricted-endgame-winning-regions/results/STAGE_1_EXACT_RESULT.json";
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));

const spec = readJson(SPEC_PATH);
const gates = readJson(GATE_PATH);
const oracle = readJson(ORACLE_PATH);

assert.equal(spec.schemaVersion, 1);
assert.equal(spec.program, "PBAI-P1");
assert.equal(spec.candidateId, "PBAI-C003");
assert.equal(spec.candidateVersion, "PBAI-C003-v1");
assert.equal(spec.status, "FROZEN-PREDEVELOPMENT-SUPPORT-PROBE");
assert.equal(spec.freezeSourceMain, "5e7c67ef1fb0c1a9211c4c81d1f175f1921bde06");
assert.equal(spec.baselineId, gates.baselineId);
assert.equal(spec.globalGateSpecId, gates.gateSpecId);
assert.equal(spec.researchGeneration2EvidenceIncluded, false);
assert.equal(spec.researchEvidence.studyId, "REWR-STUDY1");
assert.equal(spec.researchEvidence.formalDecision, "EXACT-SOLVED-WITHIN-FROZEN-DOMAIN");
assert.equal(spec.researchEvidence.resultPath, ORACLE_PATH);
assert.equal(spec.researchEvidence.domainSha256, oracle.identities.domainSha256);
assert.equal(spec.researchEvidence.stateSetSha256, oracle.identities.stateSetSha256);
assert.equal(spec.researchEvidence.stateCount, 8);
assert.equal(oracle.domain.stateCount, 8);
assert.equal(oracle.domain.symmetryReduction, false);
assert.equal(oracle.interpretationBoundary.fullBaoSolved, false);
assert.equal(oracle.interpretationBoundary.allMtajiSolved, false);
assert.equal(oracle.interpretationBoundary.allEndgamesSolved, false);
const nonterminal = oracle.stateRows.filter((row) => row.ruleState.winner === null);
assert.equal(nonterminal.length, spec.researchEvidence.nonterminalStateCountExpected);
assert.equal(nonterminal.length, 4);
assert.deepEqual(spec.identityContract.requiredFields, ["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]);
assert.deepEqual(spec.identityContract.excludedFields, ["turn", "reason"]);
assert.equal(spec.identityContract.symmetryCanonicalizationAllowed, false);
assert.equal(spec.identityContract.seatCanonicalizationAllowed, false);
assert.equal(spec.identityContract.reflectionCanonicalizationAllowed, false);
assert.equal(spec.identityContract.aiStateKeyAllowed, false);
assert.equal(spec.identityContract.missingPendingAllowed, false);
assert.equal(spec.identityContract.oracleStoredStateKeysMustRecomputeUnderStrictRawIdentity, true);
assert.deepEqual(spec.developmentTrajectoryProbe.sourceSeedBlock, { start: 31300001, end: 31300512 });
assert.equal(spec.developmentTrajectoryProbe.trajectoryCount, 512);
assert.equal(spec.developmentTrajectoryProbe.maximumPlies, 160);
assert.equal(spec.supportMeasurement.minimumTrajectoriesWithNonterminalOracleHit, 1);
assert.equal(spec.supportMeasurement.minimumUniqueNonterminalOracleStatesHit, 1);
assert.equal(spec.supportMeasurement.oracleSolutionFieldsUsedForSupport, false);
assert.equal(spec.supportMeasurement.noArtificialOracleFixtureInjection, true);
for (const key of ["candidateImplementationObserved","candidateCodeUsed","candidateBenefitMetricsObserved","searchScoresOrReferenceValuesMeasured","oracleSolutionValuesInspectedForSupport","publicCodeChangeAuthorized","validationSeedBlockAccessAuthorized","releaseHoldoutSeedBlockAccessAuthorized","developmentAuthorizationGrantedBySupportResult","aiGen3PromotionAuthorized"]) {
  assert.equal(spec.firewall[key], false, `${key} must be false`);
}
assert.equal(spec.decisionRule.sameVersionSeedBlockExpansionAfterOutcomeAllowed, false);
assert.equal(spec.decisionRule.sameVersionIdentityRelaxationAfterOutcomeAllowed, false);
assert.equal(spec.decisionRule.sameVersionSyntheticFixtureSubstitutionForPracticalSupportAllowed, false);
assert.equal(spec.decisionRule.validationAfterSupportProbeAuthorized, false);
assert.equal(spec.decisionRule.releaseHoldoutAfterSupportProbeAuthorized, false);
console.log("PBAI-C003-v1 predevelopment support spec: PASS");
