#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const CANDIDATE_PATH = path.join(ROOT, "doc/blunder-misvaluation-patterns/preregistration/STAGE_2_FORMAL_CANDIDATES.json");
const SPEC_PATH = path.join(ROOT, "doc/blunder-misvaluation-patterns/preregistration/STAGE_2_FORMAL_SPEC.json");
const STAGE1_RESULT_PATH = path.join(ROOT, "doc/blunder-misvaluation-patterns/results/STAGE_1_DISCOVERY_RESULT.json");

const EXPECTED_STAGE_ID = "BMP-S2-FORMAL-2026-08-22-v1";
const EXPECTED_CANDIDATE_SHA256 = "12ee81bac3ec669d39427cac3fe46e6657e89228284a0d8e6111653098dd955b";
const EXPECTED_SPEC_SHA256 = "e2845026a8414fcff1f5c8163a7de8a9089c7cbe3138fd67660cf0e026da5c65";
const EXPECTED_STAGE1_SPEC_SHA256 = "f4820c1fa77f8a3c1f808e5367e2b10a1150492c0a1544aa076b61929f68a3dd";
const EXPECTED_STAGE1_SELECTION_HASH = "80a8ccbacb2ee943a8620f853a91789e24a09a55a8d46a3b93936246536a10df";
const EXPECTED_STAGE1_MEASUREMENT_HASH = "614c0a41473dcc6a3dd5a609d6b6890449b8cf9014a6cae711ec541fdf40cd92";
const EXPECTED_STAGE1_RAW_DISCOVERY_SHA256 = "c910b7c4f854daf0223fa5ed935dc0b2a5fe844ef5541d623adfdaca94cb8d26";

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function validate() {
  const candidateSha = sha256File(CANDIDATE_PATH);
  const specSha = sha256File(SPEC_PATH);
  assert.equal(candidateSha, EXPECTED_CANDIDATE_SHA256, "Stage 2 candidate-freeze SHA mismatch");
  assert.equal(specSha, EXPECTED_SPEC_SHA256, "Stage 2 formal-spec SHA mismatch");

  const candidates = readJson(CANDIDATE_PATH);
  const spec = readJson(SPEC_PATH);
  const stage1 = readJson(STAGE1_RESULT_PATH);

  assert.equal(candidates.schemaVersion, 1);
  assert.equal(candidates.stageId, EXPECTED_STAGE_ID);
  assert.equal(candidates.candidateFreezeId, "BMP-S2-CANDIDATES-2026-08-22-v1");
  assert.equal(candidates.upstream.stage1SpecSha256, EXPECTED_STAGE1_SPEC_SHA256);
  assert.equal(candidates.upstream.stage1SelectionHash, EXPECTED_STAGE1_SELECTION_HASH);
  assert.equal(candidates.upstream.stage1MeasurementHash, EXPECTED_STAGE1_MEASUREMENT_HASH);
  assert.equal(candidates.upstream.stage1RawDiscoverySha256, EXPECTED_STAGE1_RAW_DISCOVERY_SHA256);
  assert.equal(candidates.candidateSelectionRule.renamingAllowed, false);
  assert.equal(candidates.candidateSelectionRule.mergingAllowed, false);
  assert.equal(candidates.candidateSelectionRule.splittingAllowed, false);
  assert.equal(candidates.candidateSelectionRule.postOutcomeRedefinitionAllowed, false);
  assert.equal(candidates.supportGroups.length, 2);
  assert.equal(candidates.formalCandidates.length, 4);

  const g01 = candidates.supportGroups[0];
  assert.equal(g01.supportGroupId, "BMP-S2-G01-NAMUA");
  assert.deepEqual(g01.sourceStage1CandidateIds, ["BMP-S1-C01", "BMP-S1-C02", "BMP-S1-C03"]);
  assert.equal(g01.phase, "namua");
  assert.deepEqual(g01.preconditionTokens, [
    { family: "frontOccupiedBins", value: "6-8" },
    { family: "houseOwned", value: "false" },
  ]);
  assert.equal(g01.moveAbstractionMode, "indexed");
  assert.deepEqual(g01.moveAbstraction, {
    direction: "left", houseChoice: null, houseTwo: false, index: 4,
    phase: "namua", row: 0, side: "right", type: "capture",
  });
  assert.equal(g01.stage1OpportunityIdentityHash,
    "bf553ebf87514ed00f4f620780df21fa4d3c4f507ca8508d02f581131bda8f5d");

  const g02 = candidates.supportGroups[1];
  assert.equal(g02.supportGroupId, "BMP-S2-G02-MTAJI");
  assert.deepEqual(g02.sourceStage1CandidateIds, ["BMP-S1-C04"]);
  assert.equal(g02.phase, "mtaji");
  assert.deepEqual(g02.preconditionTokens, [
    { family: "frontOccupiedBins", value: "3-5" },
    { family: "legalMoveCountBins", value: "5+" },
  ]);
  assert.equal(g02.moveAbstractionMode, "coarse-no-index");
  assert.deepEqual(g02.moveAbstraction, {
    direction: "right", houseChoice: null, houseTwo: false,
    phase: "mtaji", row: 1, side: null, type: "capture",
  });
  assert.equal(g02.stage1OpportunityIdentityHash,
    "3dd70e0b64efb50bdd6122792815df029c231967e5e7e2e020b78979451dfb88");

  const expected = [
    ["BMP-S2-C01", "BMP-S1-C01", 1, "BMP-S2-G01-NAMUA", "worstReplyActorFrontConnectionsDeltaNegative", "response-envelope"],
    ["BMP-S2-C02", "BMP-S1-C02", 2, "BMP-S2-G01-NAMUA", "actorCaptureMoveDeltaNegative", "immediate-structural"],
    ["BMP-S2-C03", "BMP-S1-C03", 3, "BMP-S2-G01-NAMUA", "actorLegalMoveDeltaNegative", "immediate-structural"],
    ["BMP-S2-C04", "BMP-S1-C04", 4, "BMP-S2-G02-MTAJI", "allRepliesActorCaptureMoveDeltaNegative", "response-envelope"],
  ];
  candidates.formalCandidates.forEach((candidate, index) => {
    const [formalId, sourceId, rank, groupId, failureToken, failureFamily] = expected[index];
    assert.equal(candidate.formalCandidateId, formalId);
    assert.equal(candidate.sourceStage1CandidateId, sourceId);
    assert.equal(candidate.sourcePromotedRank, rank);
    assert.equal(candidate.supportGroupId, groupId);
    assert.equal(candidate.failureToken, failureToken);
    assert.equal(candidate.failureFamily, failureFamily);
    const source = stage1.promotedCandidates.find((row) => row.candidateId === sourceId);
    assert.ok(source, `Missing Stage 1 source candidate ${sourceId}`);
    assert.equal(source.promotedRank, rank);
    assert.equal(source.failureToken, failureToken);
    assert.equal(source.failureFamily, failureFamily);
  });

  assert.equal(spec.schemaVersion, 1);
  assert.equal(spec.stageId, EXPECTED_STAGE_ID);
  assert.equal(spec.formalExperiment, true);
  assert.equal(spec.scientificGenerationAuthorized, false);
  assert.equal(spec.scientificInferenceAuthorizedBySpecAlone, false);
  assert.equal(spec.confirmatoryReuseOfStage1DataAllowed, false);
  assert.equal(spec.candidateFreeze.sha256, EXPECTED_CANDIDATE_SHA256);
  assert.deepEqual(spec.candidateFreeze.formalCandidateIds,
    ["BMP-S2-C01", "BMP-S2-C02", "BMP-S2-C03", "BMP-S2-C04"]);

  assert.equal(spec.population.games, 4096);
  assert.equal(spec.population.seedStart, 22500001);
  assert.equal(spec.population.seedEnd, 22504096);
  assert.equal(spec.population.maxPly, 100);
  assert.equal(spec.population.opening.policy, "seeded-uniform-legal-moveVariants");
  assert.equal(spec.population.opening.plies, 8);
  assert.deepEqual(spec.population.conditionAssignment.strata.map(({ id, expectedGames }) => [id, expectedGames]), [
    ["B-D1", 683], ["B-D2", 683], ["B-D3", 683],
    ["LS-D2", 683], ["V2-D2", 682], ["LE-D2", 682],
  ]);
  assert.equal(spec.population.conditionAssignment.strata.reduce((sum, row) => sum + row.expectedGames, 0), 4096);
  for (const stratum of spec.population.conditionAssignment.strata) {
    assert.equal(stratum.generator.timeLimitMs, "Infinity");
    assert.equal(stratum.generator.adaptive, false);
    assert.equal(stratum.generator.stableBestDepths, 0);
    assert.equal(stratum.generator.aspirationWindow, 0);
  }

  assert.equal(spec.stage1IdentityFirewall.required, true);
  assert.deepEqual(spec.stage1IdentityFirewall.requiredFinalOverlapCounts,
    { historicalTrajectoryHash: 0, openingPrefixHash: 0, ruleStateKey: 0 });
  assert.equal(spec.stage1IdentityFirewall.seedExtensionAllowed, false);
  assert.equal(spec.stage1IdentityFirewall.replacementAllowed, false);

  assert.equal(spec.supportGroupSelection.minimumPly, 8);
  assert.equal(spec.supportGroupSelection.terminalIncluded, false);
  assert.equal(spec.supportGroupSelection.minimumLegalMoveCount, 2);
  assert.ok(spec.supportGroupSelection.eligibilityExcludes.includes("failure-token"));
  assert.ok(spec.supportGroupSelection.eligibilityExcludes.includes("D3-inferior-status"));
  assert.ok(spec.supportGroupSelection.eligibilityExcludes.includes("game-outcome"));
  assert.deepEqual(spec.supportGroupSelection.supportGroupSharing["BMP-S2-G01-NAMUA"],
    ["BMP-S2-C01", "BMP-S2-C02", "BMP-S2-C03"]);
  assert.equal(spec.candidateMoveSelection.selectionRule, "lexicographically-smallest-AI.moveKey");
  assert.equal(spec.candidateMoveSelection.selectionMayUseFailureOrSearchValue, false);
  assert.equal(spec.candidateMoveSelection.allLegalRootMovesMeasured, true);

  assert.equal(spec.formalMeasurement.rootSearch.depth, 3);
  assert.equal(spec.formalMeasurement.rootSearch.evaluationProfile, "bao");
  assert.equal(spec.formalMeasurement.rootSearch.quiescenceDepth, 1);
  assert.equal(spec.formalMeasurement.rootSearch.perspective, "root-actor");
  assert.equal(spec.formalMeasurement.decisionLoss.inferiorEventId, "d3-inferior-v1");

  const gates = spec.estimabilityGates;
  assert.equal(gates.minimumOpportunityUniqueHistoricalTrajectories, 96);
  assert.equal(gates.minimumOpportunityUniqueRuleStates, 96);
  assert.equal(gates.minimumDistinctOpeningPrefixes, 48);
  assert.equal(gates.maximumSingleOpeningPrefixShare, 0.1);
  assert.equal(gates.minimumGenerationStrata, 4);
  assert.equal(gates.maximumSingleGenerationStratumShare, 0.5);
  assert.equal(gates.noExtensionOrReplacement, true);

  assert.equal(spec.coPrimaryEndpoints.length, 2);
  assert.equal(spec.coPrimaryEndpoints[0].id, "failure-signature-recurrence");
  assert.equal(spec.coPrimaryEndpoints[0].nullProbability, 0.5);
  assert.equal(spec.coPrimaryEndpoints[0].minimumObservedRateForConfirmation, 0.65);
  assert.equal(spec.coPrimaryEndpoints[1].id, "d3-inferior-recurrence");
  assert.equal(spec.coPrimaryEndpoints[1].nullProbability, 0.5);
  assert.equal(spec.coPrimaryEndpoints[1].minimumObservedRateForConfirmation, 0.7);
  assert.equal(spec.multiplicity.plannedTests, 8);
  assert.equal(spec.multiplicity.familyWiseAlpha, 0.05);
  assert.equal(spec.multiplicity.method, "Holm-Bonferroni");
  assert.equal(spec.multiplicity.nonEstimableEndpointPValueForFamily, 1.0);
  assert.equal(spec.consistencyGates.maximumD3TopSetRate, 0.2);
  assert.equal(spec.consistencyGates.minimumMedianNormalizedRankLoss, 0.5);

  assert.deepEqual(spec.verificationFirewall.executionOrder, [
    "generate",
    "independent-full-replay-and-generation-search-verify",
    "support-group-select",
    "formal-measure",
    "formal-evaluate",
  ]);
  assert.equal(spec.verificationFirewall.independentVerifierRequired, true);
  assert.equal(spec.verificationFirewall.fullGenerationSearchRecomputationRequired, true);
  assert.equal(spec.verificationFirewall.formalD3CandidateTableRecomputationRequired, true);
  assert.equal(spec.verificationFirewall.candidateMatcherAndFailureRecomputationRequired, true);

  assert.equal(spec.stopping.gamesFixed, 4096);
  assert.equal(spec.stopping.earlyStopAllowed, false);
  assert.equal(spec.stopping.outcomeDependentExtensionAllowed, false);
  assert.equal(spec.stopping.replacementSamplingAllowed, false);
  for (const [key, value] of Object.entries(spec.noRescue)) {
    assert.equal(value, false, `No-rescue flag must remain false: ${key}`);
  }
  assert.equal(spec.authorization.generationAuthorizedBySpecAlone, false);

  return {
    schemaVersion: 1,
    stageId: EXPECTED_STAGE_ID,
    passed: true,
    candidateDefinitionSha256: candidateSha,
    specSha256: specSha,
    formalCandidates: candidates.formalCandidates.map(({ formalCandidateId, sourceStage1CandidateId, supportGroupId, failureToken }) => ({
      formalCandidateId, sourceStage1CandidateId, supportGroupId, failureToken,
    })),
    population: {
      games: spec.population.games,
      seedStart: spec.population.seedStart,
      seedEnd: spec.population.seedEnd,
      strata: spec.population.conditionAssignment.strata.map(({ id, expectedGames }) => ({ id, expectedGames })),
    },
    plannedCoPrimaryTests: spec.multiplicity.plannedTests,
    multiplicity: spec.multiplicity.method,
    generationAuthorized: false,
  };
}

if (require.main === module) {
  console.log(JSON.stringify(validate(), null, 2));
}

module.exports = { validate };
