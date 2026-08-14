"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const CANDIDATE_PATH = path.join(ROOT, "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json");
const SPEC_PATH = path.join(ROOT, "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_SPEC.json");
const STAGE1_FREEZE_PATH = path.join(ROOT, "doc/tactical-motifs/STAGE_1_CANDIDATE_FREEZE.json");

const EXPECTED_STAGE_ID = "TM-S2-FORMAL-2026-08-14-v1";
const EXPECTED_CANDIDATE_SHA256 = "667f4645fb7c0c704b1d3e49a1d7caefca54de2b9df2ddf0e542f7241aeb81e8";
const EXPECTED_SPEC_SHA256 = "83ad5916b2f70846b493d9a4a87191c4a9d4bf667e27dcc624d4fe04014838d8";
const EXPECTED_STAGE1_FREEZE_SHA256 = "f257f6e49d8b6856cc1b75222cb455506359520fcbfc8fb361adc3ad2db4cb73";

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function validate() {
  const candidateSha = sha256File(CANDIDATE_PATH);
  const specSha = sha256File(SPEC_PATH);
  const stage1FreezeSha = sha256File(STAGE1_FREEZE_PATH);

  assert.equal(candidateSha, EXPECTED_CANDIDATE_SHA256, "Stage 2 candidate-definition SHA mismatch");
  assert.equal(specSha, EXPECTED_SPEC_SHA256, "Stage 2 formal-spec SHA mismatch");
  assert.equal(stage1FreezeSha, EXPECTED_STAGE1_FREEZE_SHA256, "Stage 1 candidate-freeze SHA mismatch");

  const candidates = readJson(CANDIDATE_PATH);
  const spec = readJson(SPEC_PATH);

  assert.equal(candidates.schemaVersion, 1);
  assert.equal(candidates.stageId, EXPECTED_STAGE_ID);
  assert.equal(candidates.sourceStage1CandidateFreeze.sha256, EXPECTED_STAGE1_FREEZE_SHA256);
  assert.equal(candidates.sourceStage1CandidateFreeze.discoveryResultSha256,
    "aab251ffa583204dc0ff5162f1f39c8a96323aac9182da051f29eaa080b8cd34");
  assert.equal(candidates.familyHandling.stage1PromotedDefinitions, 8);
  assert.equal(candidates.familyHandling.supportEquivalentGroups, 4);
  assert.equal(candidates.familyHandling.formalPrimaryCandidates, 4);
  assert.equal(candidates.familyHandling.postFreshDataSubstitutionAllowed, false);
  assert.equal(candidates.familyHandling.postFreshDataMergeAllowed, false);
  assert.equal(candidates.familyHandling.postFreshDataSplitAllowed, false);

  const expectedCandidates = [
    ["TM-S2-C01", 1, "23e3dbe362049a6e220fa2aa74b6f9364b8277cadc4f329e8181b483cf03fe38", 2],
    ["TM-S2-C02", 3, "76dacf8980eeecec8af798b19fb3e87d23665a67bffaf555fb05cec5dea5c852", 4],
    ["TM-S2-C03", 5, "7a9ebacdc74234cf206b59696a92551b3e15f5e97336ef09a16e1efbf0042eba", 6],
    ["TM-S2-C04", 7, "8a2c28eaefd59c83d6a7983b3f7c6b36c80f677b08ab6d2af65203e6af0c8755", 8],
  ];
  assert.equal(candidates.formalCandidates.length, 4);
  candidates.formalCandidates.forEach((candidate, index) => {
    const [candidateId, rank, key, pairedRank] = expectedCandidates[index];
    assert.equal(candidate.candidateId, candidateId);
    assert.equal(candidate.canonicalStage1Rank, rank);
    assert.equal(candidate.canonicalCandidateKey, key);
    assert.equal(candidate.canonicalSelectionRule,
      "lowest-stage1-promoted-rank-within-supportIdentityHash-group");
    assert.equal(candidate.pairedDiagnosticDefinition.stage1Rank, pairedRank);
    assert.equal(candidate.pairedDiagnosticDefinition.sameStage1SupportIdentity, true);
    assert.equal(candidate.pairedDiagnosticDefinition.formalDecisionUse, false);
  });

  assert.equal(spec.schemaVersion, 1);
  assert.equal(spec.stageId, EXPECTED_STAGE_ID);
  assert.equal(spec.formalExperiment, true);
  assert.equal(spec.scientificInferenceAuthorized, false);
  assert.equal(spec.generationAuthorizedBySpecAlone, false);
  assert.equal(spec.candidateDefinition.sha256, EXPECTED_CANDIDATE_SHA256);
  assert.equal(spec.candidateDefinition.formalCandidateCount, 4);

  assert.equal(spec.population.games, 3072);
  assert.equal(spec.population.seedStart, 22000001);
  assert.equal(spec.population.seedEnd, 22003072);
  assert.equal(spec.population.maxPly, 100);
  assert.equal(spec.population.opening.policy, "seeded-uniform-legal-moveVariants");
  assert.equal(spec.population.opening.plies, 8);
  assert.equal(spec.population.conditionAssignment.strata.length, 6);
  for (const stratum of spec.population.conditionAssignment.strata) {
    assert.equal(stratum.expectedGames, 512);
    assert.equal(stratum.generator.timeLimitMs, "Infinity");
    assert.equal(stratum.generator.adaptive, false);
    assert.equal(stratum.generator.stableBestDepths, 0);
    assert.equal(stratum.generator.aspirationWindow, 0);
  }
  assert.equal(spec.population.earlyStopAllowed, false);
  assert.equal(spec.population.outcomeDependentExtensionAllowed, false);
  assert.equal(spec.population.replacementSamplingAllowed, false);

  assert.equal(spec.trajectoryIdentity.primary, "historicalTrajectoryHash");
  assert.equal(spec.candidateSpecificRootSelection.minimumPly, 8);
  assert.equal(spec.candidateSpecificRootSelection.terminalIncluded, false);
  assert.equal(spec.candidateSpecificRootSelection.minimumLegalMoveCount, 2);
  assert.deepEqual(spec.candidateSpecificRootSelection.eligibilityExplicitlyExcludes,
    ["candidate-consequence", "D1-value", "D2-value", "D3-value", "reply-outcome", "game-outcome"]);
  assert.equal(spec.candidateSpecificRootSelection.unavailableCandidate, "no-replacement");
  assert.equal(spec.candidateMoveRepresentative.representative, "lexicographically-smallest-AI.moveKey");
  assert.equal(spec.candidateMoveRepresentative.selectionUsesSearchValue, false);
  assert.equal(spec.candidateMoveRepresentative.selectionUsesConsequence, false);
  assert.equal(spec.candidateMoveRepresentative.allLegalMovesMeasuredForComparator, true);

  assert.equal(spec.formalEndpoints.structuralSuccess.nullProbability, 0.5);
  assert.equal(spec.formalEndpoints.structuralSuccess.minimumObservedRate, 0.6);
  assert.equal(spec.formalEndpoints.structuralSuccess.test, "exact-one-sided-binomial");
  assert.equal(spec.formalEndpoints.tacticalValueSuccess.nullProbability, 0.5);
  assert.equal(spec.formalEndpoints.tacticalValueSuccess.minimumObservedRate, 0.6);
  assert.equal(spec.formalEndpoints.tacticalValueSuccess.test, "exact-one-sided-binomial");
  assert.equal(spec.formalEndpoints.consistencyGates.minimumD3AtOrAboveStateMedianRate, 0.6);
  assert.equal(spec.formalEndpoints.consistencyGates.maximumD3UniqueWorstRate, 0.15);

  const gates = spec.estimabilityAndTransferabilityGates;
  assert.equal(gates.minimumSelectedUniqueHistoricalTrajectoriesPerCandidate, 96);
  assert.equal(gates.minimumSelectedUniqueRuleStatesPerCandidate, 96);
  assert.equal(gates.minimumDistinctOpeningPrefixesPerCandidate, 48);
  assert.equal(gates.maximumSingleOpeningPrefixShare, 0.1);
  assert.equal(gates.minimumGenerationStrataPerCandidate, 4);
  assert.equal(gates.maximumSingleGenerationStratumShare, 0.5);

  assert.equal(spec.multiplicity.family, "8-planned-co-primary-tests-4-candidates-x-2-endpoints");
  assert.equal(spec.multiplicity.alpha, 0.05);
  assert.equal(spec.multiplicity.method, "Holm-Bonferroni");
  assert.equal(spec.multiplicity.nonEstimableEndpointPValueForAdjustment, 1.0);
  assert.equal(spec.multiplicity.manualEndpointDroppingAllowed, false);

  assert.equal(spec.pairedDefinitionDiagnostics.decisionUse, false);
  assert.equal(spec.pairedDefinitionDiagnostics.canonicalReplacementFromDiagnostic, false);
  assert.equal(spec.verificationFirewall.fullSeedReplayRequired, true);
  assert.equal(spec.verificationFirewall.fullGenerationSearchRecomputationRequired, true);
  assert.equal(spec.verificationFirewall.selectionBlockedUntilVerificationPasses, true);
  assert.equal(spec.verificationFirewall.formalEvaluationBlockedUntilMeasurementIntegrityPasses, true);

  for (const value of Object.values(spec.stoppingAndNoRescue)) {
    if (typeof value === "boolean") assert.equal(value, false);
  }
  assert.equal(spec.stoppingAndNoRescue.gamesFixed, 3072);
  assert.equal(spec.stage1LeakageFirewall.stage1SeedsReusable, false);
  assert.equal(spec.stage1LeakageFirewall.stage1StatesReusable, false);
  assert.equal(spec.stage1LeakageFirewall.stage1MeasurementsReusableAsFormalObservations, false);
  assert.equal(spec.authorization.specOrCandidateFilesAloneAuthorizeGeneration, false);

  return {
    stageId: EXPECTED_STAGE_ID,
    passed: true,
    candidateDefinitionSha256: candidateSha,
    specSha256: specSha,
    stage1CandidateFreezeSha256: stage1FreezeSha,
    formalCandidates: candidates.formalCandidates.map(({ candidateId, canonicalStage1Rank, canonicalCandidateKey }) => ({
      candidateId,
      canonicalStage1Rank,
      canonicalCandidateKey,
    })),
    population: {
      games: spec.population.games,
      seedStart: spec.population.seedStart,
      seedEnd: spec.population.seedEnd,
      strata: spec.population.conditionAssignment.strata.map(({ id, expectedGames }) => ({ id, expectedGames })),
    },
    coPrimaryTests: 8,
    multiplicity: spec.multiplicity.method,
    generationAuthorized: false,
  };
}

if (require.main === module) {
  console.log(JSON.stringify(validate(), null, 2));
}

module.exports = { validate };
