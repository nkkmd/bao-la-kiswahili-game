#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(
  ROOT,
  "doc/tactical-motifs/preregistration/STAGE_1_EXPLORATORY_SPEC.json",
);

function sha256Text(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function integer(value, label, minimum = 0) {
  assert(Number.isInteger(value) && value >= minimum, `${label} must be integer >= ${minimum}`);
}

function probability(value, label) {
  assert(typeof value === "number" && value >= 0 && value <= 1, `${label} must be in [0,1]`);
}

function loadSpec(specPath = SPEC_PATH) {
  const text = fs.readFileSync(specPath, "utf8");
  return { spec: JSON.parse(text), specSha256: sha256Text(text), text };
}

function validateSpec(spec) {
  assert(spec.schemaVersion === 1, "schemaVersion must be 1");
  assert(spec.studyId === "TM-STUDY1", "unexpected studyId");
  assert(/^TM-S1-EXPLORATORY-/.test(spec.stageId), "unexpected stageId");
  assert(spec.scientificInferenceAuthorized === false,
    "Stage 1 exploratory spec must not authorize confirmatory inference");
  assert(spec.confirmatoryReuseAllowed === false,
    "Stage 1 corpus must not be confirmatorily reusable");
  assert(spec.baseMainHead === "08c70ba6ac980884d51562c207410db3521b8ae4",
    "baseline main HEAD changed in frozen spec");

  const population = spec.population;
  integer(population.games, "population.games", 1);
  integer(population.seedStart, "population.seedStart", 1);
  integer(population.seedEnd, "population.seedEnd", population.seedStart);
  assert(population.seedEnd - population.seedStart + 1 === population.games,
    "seed interval must contain exactly population.games seeds");
  assert(population.games === 768
    && population.seedStart === 21900001
    && population.seedEnd === 21900768,
  "frozen Stage 1 game count or seed block changed");
  assert(population.opening.policy === "seeded-uniform-legal-moveVariants",
    "opening policy must use exact moveVariants");
  integer(population.opening.plies, "opening.plies", 0);
  assert(population.opening.appliesToAllStrata === true,
    "opening policy must apply to every generation stratum");
  integer(population.maxPly, "population.maxPly", population.opening.plies + 1);

  const assignment = population.conditionAssignment;
  assert(assignment.method === "game-index-modulo", "condition assignment must be deterministic modulo");
  assert(Array.isArray(assignment.strata) && assignment.strata.length >= 2,
    "at least two generation strata are required");
  const ids = assignment.strata.map(({ id }) => id);
  assert(new Set(ids).size === ids.length, "generation stratum ids must be unique");
  assert(JSON.stringify(ids) === JSON.stringify([
    "B-D1", "B-D2", "B-D3", "LS-D2", "V2-D2", "LE-D2",
  ]), "generation-stratum order/identity changed");
  const expectedPerStratum = assignment.strata.reduce((sum, item) => {
    integer(item.expectedGames, `expectedGames:${item.id}`, 1);
    const generator = item.generator;
    assert(generator && generator.kind === "ai", `unsupported generator kind for ${item.id}`);
    assert(["hard", "expert"].includes(generator.level), `unsupported AI level for ${item.id}`);
    assert(["bao", "bao-v2", "legacy"].includes(generator.evaluationProfile),
      `unsupported evaluation profile for ${item.id}`);
    assert(["phase2", "legacy"].includes(generator.searchProfile),
      `unsupported search profile for ${item.id}`);
    integer(generator.maxDepth, `maxDepth:${item.id}`, 1);
    assert(generator.timeLimitMs === "Infinity", `generation must be fixed-depth without wall-clock timeout: ${item.id}`);
    integer(generator.quiescenceDepth, `quiescenceDepth:${item.id}`, 0);
    assert(generator.adaptive === false, `adaptive generation forbidden: ${item.id}`);
    assert(generator.stableBestDepths === 0, `stable-depth early stopping forbidden: ${item.id}`);
    assert(generator.aspirationWindow === 0, `aspiration-window dependence forbidden: ${item.id}`);
    return sum + item.expectedGames;
  }, 0);
  assert(expectedPerStratum === population.games, "stratum expectedGames must sum to population.games");
  assert(population.games % assignment.strata.length === 0,
    "modulo assignment requires equal-size strata in this frozen design");
  for (const item of assignment.strata) {
    assert(item.expectedGames === population.games / assignment.strata.length,
      `expectedGames mismatch for ${item.id}`);
  }

  assert(spec.trajectoryIdentity.primary === "historicalTrajectoryHash",
    "historical trajectory must remain primary support identity");
  assert(spec.trajectoryIdentity.supportUnit === "unique-historical-trajectory",
    "support unit must be unique historical trajectory");

  integer(spec.openingFamily.prefixPlies, "openingFamily.prefixPlies", 1);
  assert(spec.openingFamily.prefixPlies === population.opening.plies,
    "opening family prefix must equal prospectively randomized opening length");
  integer(spec.openingFamily.candidateMinimumDistinctPrefixes,
    "openingFamily.candidateMinimumDistinctPrefixes", 2);
  probability(spec.openingFamily.candidateMaximumSinglePrefixShare,
    "openingFamily.candidateMaximumSinglePrefixShare");

  const selection = spec.stateSelection;
  integer(selection.minimumPly, "stateSelection.minimumPly", population.opening.plies);
  assert(selection.terminalIncluded === false, "terminal roots cannot be candidate move-choice roots");
  integer(selection.minimumLegalMoveCount, "stateSelection.minimumLegalMoveCount", 2);
  assert(selection.legalMoveDefinition === "E.moveVariants(state).length",
    "root decision set must use moveVariants");
  assert(selection.phaseAssignment.method === "sha256-parity",
    "phase assignment must be outcome-independent hash parity");
  assert(selection.phaseAssignment.mapping.even === "namua"
    && selection.phaseAssignment.mapping.odd === "mtaji",
  "phase assignment must map parity to Namua/Mtaji");
  assert(selection.withinAssignedPhase.method === "minimum-sha256-rank",
    "within-phase state selection must be hash ranked");
  assert(selection.unavailableAssignedPhase === "no-replacement",
    "unavailable assigned phases must not be replaced");

  const measurement = spec.measurement;
  assert(measurement.allLegalMoveVariants === true,
    "measurement must include every legal moveVariant");
  assert(JSON.stringify(measurement.rootSearch.depths) === JSON.stringify([1, 2, 3]),
    "root search depths are frozen at D1/D2/D3");
  assert(measurement.rootSearch.evaluationProfile === "bao",
    "root value instrument is frozen to bao evaluator");
  assert(measurement.replySearch.enabled === true && measurement.replySearch.depth === 1,
    "reply search must remain enabled at D1");
  assert(measurement.principalVariationRequired === false,
    "Stage 1 must not require an unavailable search-consistent PV");
  assert(measurement.wallClockInferentialUse === false,
    "wall-clock timing is not an inferential endpoint");
  const response = measurement.responseEnvelope;
  assert(response.replyPopulation === "all-immediate-E.moveVariants-replies-after-candidate-move",
    "response envelope must enumerate all immediate moveVariant replies");
  assert(response.orientation === "original-root-actor-relative",
    "response envelope orientation must remain root-actor relative");
  assert(response.deltaReference === "original-root-state",
    "response-envelope deltas must use the original root state");

  const representation = spec.discoveryRepresentation;
  assert(Array.isArray(representation.moveAbstractionModes)
    && representation.moveAbstractionModes.includes("coarse-no-index")
    && representation.moveAbstractionModes.includes("indexed"),
  "both coarse and indexed move abstractions must be retained");
  const enumeration = representation.candidateEnumeration;
  integer(enumeration.minimumUniqueHistoricalTrajectoriesForDetailedAudit,
    "candidateEnumeration.minimumUniqueHistoricalTrajectoriesForDetailedAudit", 2);
  assert(enumeration.belowThresholdHandling === "count-and-hash-summary-only",
    "low-support patterns must not be silently discarded");
  const pattern = representation.candidatePattern;
  assert(pattern.exactlyOneMoveAbstractionToken === true, "candidate must contain exactly one move token");
  integer(pattern.minimumPreconditionTokens, "minimumPreconditionTokens", 1);
  integer(pattern.maximumPreconditionTokens, "maximumPreconditionTokens", pattern.minimumPreconditionTokens);
  assert(pattern.maximumPreconditionTokens === 2,
    "precondition conjunction size is frozen at maximum two tokens");
  assert(pattern.exactlyOneConsequenceToken === true,
    "candidate must contain exactly one consequence token");
  assert(pattern.phaseTokenMandatory === true, "candidate phase must be explicit and bounded");
  assert(pattern.preconditionTokenCountExcludesMandatoryPhase === true,
    "precondition conjunction count must exclude the mandatory phase token");
  assert(pattern.supportRepresentativeWithinTrajectory === "lexicographically-smallest-moveKey",
    "within-trajectory support representative must be outcome-independent");

  const promotion = spec.candidatePromotion;
  integer(promotion.minimumUniqueHistoricalTrajectories,
    "minimumUniqueHistoricalTrajectories", 2);
  integer(promotion.minimumUniqueRuleStates, "minimumUniqueRuleStates", 2);
  integer(promotion.minimumDistinctOpeningPrefixes, "minimumDistinctOpeningPrefixes", 2);
  probability(promotion.maximumSingleOpeningPrefixShare, "maximumSingleOpeningPrefixShare");
  integer(promotion.minimumGenerationStrata, "minimumGenerationStrata", 2);
  probability(promotion.maximumSingleGenerationStratumShare, "maximumSingleGenerationStratumShare");
  probability(promotion.minimumD3TopSetRate, "minimumD3TopSetRate");
  probability(promotion.minimumD3AtOrAboveStateMedianRate, "minimumD3AtOrAboveStateMedianRate");
  probability(promotion.maximumD3UniqueWorstRate, "maximumD3UniqueWorstRate");
  assert(promotion.manualOverrideAllowed === false,
    "manual candidate promotion override is forbidden");
  assert(promotion.failedCandidatesRetainedInAudit === true,
    "failed candidate families must remain in the audit");
  integer(promotion.candidateCap.maximumTotal, "candidateCap.maximumTotal", 1);
  integer(promotion.candidateCap.maximumPerPhase, "candidateCap.maximumPerPhase", 1);
  integer(promotion.candidateCap.maximumPerMoveAbstractionKey,
    "candidateCap.maximumPerMoveAbstractionKey", 1);

  const readiness = spec.readinessGates;
  integer(readiness.minimumUniqueHistoricalTrajectories,
    "readiness.minimumUniqueHistoricalTrajectories", 1);
  integer(readiness.minimumSelectedUniqueRuleStates,
    "readiness.minimumSelectedUniqueRuleStates", 1);
  integer(readiness.minimumNamuaSelectedStates, "readiness.minimumNamuaSelectedStates", 1);
  integer(readiness.minimumMtajiSelectedStates, "readiness.minimumMtajiSelectedStates", 1);
  integer(readiness.minimumDistinctOpeningPrefixes, "readiness.minimumDistinctOpeningPrefixes", 2);
  integer(readiness.minimumSelectedPerGenerationStratum,
    "readiness.minimumSelectedPerGenerationStratum", 1);
  integer(readiness.minimumMeasuredMoveRecords, "readiness.minimumMeasuredMoveRecords", 1);
  assert(readiness.minimumSelectedUniqueRuleStates
    >= readiness.minimumNamuaSelectedStates + readiness.minimumMtajiSelectedStates,
  "overall selected-state readiness must cover the two phase minima");

  const stopping = spec.stopping;
  assert(stopping.gamesFixed === population.games, "fixed game count mismatch");
  assert(stopping.earlyStopAllowed === false, "early stop forbidden");
  assert(stopping.outcomeDependentExtensionAllowed === false, "outcome-dependent extension forbidden");
  assert(stopping.automaticReplacementForUnavailableTrajectory === false,
    "unavailable trajectories cannot be replaced");
  assert(stopping.automaticReplacementForDuplicateRuleState === false,
    "duplicate rule states cannot be replaced");

  assert(spec.authorization.generationAuthorizedBySpecAlone === false,
    "spec alone must never authorize scientific generation");
  assert(spec.stage2Boundary.stage1PositionsReusableForConfirmation === false,
    "Stage 1 positions cannot be reused in Stage 2");
  assert(spec.stage2Boundary.stage1SeedsReusableForConfirmation === false,
    "Stage 1 seeds cannot be reused in Stage 2");
  assert(spec.stage2Boundary.stage2GenerationAuthorizedByThisSpec === false,
    "Stage 1 spec must not authorize Stage 2");
  assert(spec.interpretationBoundary.exploratoryOnly === true,
    "Stage 1 remains exploratory");
  assert(spec.interpretationBoundary.confirmedTesujiClaimAuthorized === false,
    "Stage 1 cannot confirm tesuji");

  return true;
}

function main() {
  const { spec, specSha256 } = loadSpec();
  validateSpec(spec);
  console.log(JSON.stringify({
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    passed: true,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    stage1GenerationAuthorizedBySpecAlone: false,
    stage2GenerationAuthorized: false,
  }, null, 2));
}

if (require.main === module) main();
module.exports = { SPEC_PATH, loadSpec, validateSpec };
