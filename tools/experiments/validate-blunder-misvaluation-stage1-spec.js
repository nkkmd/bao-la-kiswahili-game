#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const Contract = require("./lib/blunder-misvaluation-stage1-contract.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(
  ROOT,
  "doc/blunder-misvaluation-patterns/preregistration/STAGE_1_EXPLORATORY_SPEC.json",
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
function sameJson(a, b, label) {
  assert(JSON.stringify(a) === JSON.stringify(b), `${label} changed from machine-frozen contract`);
}
function loadSpec(specPath = SPEC_PATH) {
  const text = fs.readFileSync(specPath, "utf8");
  return { spec: JSON.parse(text), specSha256: sha256Text(text), text };
}

function validateSpec(spec) {
  assert(spec.schemaVersion === 1, "schemaVersion must be 1");
  assert(spec.studyId === "BMP-STUDY1", "unexpected studyId");
  assert(spec.stageId === Contract.STAGE1_ID, "unexpected Stage 1 id");
  assert(spec.status === "prospective-frozen-pending-contract-validation", "unexpected spec status");
  assert(spec.scientificInferenceAuthorized === false, "Stage 1 is exploratory only");
  assert(spec.confirmatoryReuseAllowed === false, "Stage 1 cannot be confirmatorily reused");
  assert(spec.baseMainHead === "b1cc7047504b73c5a848e866f795c26a64250d13", "baseline main changed");
  assert(spec.designFreezeParentHead === "45ce006eb63d5555a030d50fe7aa4e97637db327",
    "design-freeze parent must remain the source-verified feasibility HEAD");

  const p = spec.population;
  assert(p.games === Contract.GAME_COUNT, "game count changed");
  assert(p.seedStart === Contract.SEED_START && p.seedEnd === Contract.SEED_END, "seed block changed");
  assert(p.seedEnd - p.seedStart + 1 === p.games, "seed interval must equal exact game count");
  assert(p.opening.policy === "seeded-uniform-legal-moveVariants", "opening policy changed");
  assert(p.opening.plies === 8 && p.opening.appliesToAllStrata === true, "opening freeze changed");
  assert(p.maxPly === 100, "maxPly changed");

  const a = p.conditionAssignment;
  assert(a.method === "game-index-modulo-6" && a.indexBase === 0, "generation assignment changed");
  sameJson(a.strata.map(({ id }) => id), ["B-D1","B-D2","B-D3","LS-D2","V2-D2","LE-D2"], "generation strata");
  sameJson(a.strata.map(({ moduloRemainder }) => moduloRemainder), [0,1,2,3,4,5], "modulo remainders");
  sameJson(a.strata.map(({ expectedGames }) => expectedGames), [342,342,341,341,341,341], "stratum counts");
  assert(a.strata.reduce((sum, item) => sum + item.expectedGames, 0) === p.games,
    "stratum counts must sum to population.games");
  for (const item of a.strata) {
    const g = item.generator;
    assert(g.kind === "ai", `unsupported generator kind: ${item.id}`);
    assert(["hard","expert"].includes(g.level), `unsupported AI level: ${item.id}`);
    assert(["bao","bao-v2","legacy"].includes(g.evaluationProfile), `unsupported evaluator: ${item.id}`);
    assert(["phase2","legacy"].includes(g.searchProfile), `unsupported search profile: ${item.id}`);
    integer(g.maxDepth, `maxDepth:${item.id}`, 1);
    assert(g.timeLimitMs === "Infinity", `wall-clock generation forbidden: ${item.id}`);
    integer(g.quiescenceDepth, `qDepth:${item.id}`, 0);
    assert(g.orderQuiescenceCaptures === false, `quiescence ordering changed: ${item.id}`);
    assert(g.adaptive === false && g.stableBestDepths === 0 && g.aspirationWindow === 0,
      `adaptive/early-stop generation forbidden: ${item.id}`);
  }

  assert(spec.trajectoryIdentity.primary === "historicalTrajectoryHash", "trajectory identity changed");
  assert(spec.trajectoryIdentity.supportUnit === "unique-historical-trajectory", "support unit changed");
  assert(spec.openingFamily.prefixPlies === p.opening.plies, "opening-family prefix mismatch");
  assert(spec.openingFamily.candidateMinimumDistinctPrefixes === 6, "candidate opening diversity changed");
  assert(spec.openingFamily.candidateMaximumSinglePrefixShare === 0.40,
    "candidate opening concentration changed");

  const s = spec.stateSelection;
  assert(s.minimumPly === 8 && s.terminalIncluded === false && s.minimumLegalMoveCount === 2,
    "root eligibility changed");
  assert(s.legalMoveDefinition === "E.moveVariants(state).length", "root move population changed");
  assert(s.phaseAssignment.method === "sha256-parity", "phase assignment changed");
  assert(s.phaseAssignment.salt === "BMP-S1-PHASE-v1", "phase-assignment salt changed");
  assert(s.phaseAssignment.mapping.even === "namua" && s.phaseAssignment.mapping.odd === "mtaji",
    "phase parity mapping changed");
  assert(s.withinAssignedPhase.method === "minimum-sha256-rank"
    && s.withinAssignedPhase.salt === "BMP-S1-STATE-v1", "within-phase rank changed");
  assert(s.unavailableAssignedPhase === "no-replacement-no-reassignment", "phase availability rule changed");
  assert(s.duplicateSelectedRuleStateHandling
    === "retain-lowest-historicalTrajectoryHash-then-seed-before-quota", "ruleState dedup changed");
  assert(s.phaseQuota.namua === Contract.PHASE_QUOTA.namua
    && s.phaseQuota.mtaji === Contract.PHASE_QUOTA.mtaji, "phase quota changed");
  assert(s.phaseQuota.salt === "BMP-S1-QUOTA-v1", "quota salt changed");
  assert(s.phaseQuota.insufficientPoolHandling === "fail-readiness-no-extension-no-reassignment",
    "quota failure handling changed");

  const m = spec.measurement;
  assert(m.allLegalMoveVariants === true, "all legal moveVariants must be measured");
  assert(m.rootSearch.searchSemantics === Contract.PRIMARY_REFERENCE.searchSemantics, "search semantics changed");
  sameJson(m.rootSearch.depths, [1,2,3], "search depths");
  assert(m.rootSearch.primaryDepth === Contract.PRIMARY_REFERENCE.depth, "primary depth changed");
  assert(m.rootSearch.evaluationProfile === Contract.PRIMARY_REFERENCE.evaluationProfile, "evaluator changed");
  assert(m.rootSearch.quiescenceDepth === Contract.PRIMARY_REFERENCE.quiescenceDepth, "q-depth changed");
  assert(m.rootSearch.orderQuiescenceCaptures === false && m.rootSearch.perspective === "root-actor",
    "search options/perspective changed");
  assert(m.staticPostMove.evaluationProfile === "bao"
    && m.staticPostMove.perspective === "original-root-actor", "static evaluator perspective changed");
  assert(m.responseEnvelope.replyPopulation === "all-immediate-E.moveVariants-replies-after-candidate-move",
    "reply population changed");
  assert(m.responseEnvelope.orientation === "original-root-actor-relative"
    && m.responseEnvelope.deltaReference === "original-root-state", "response orientation changed");
  assert(m.wallClockInferentialUse === false && m.principalVariationRequired === false,
    "forbidden timing/PV inference enabled");
  assert(m.d4Measured === false && m.freshDeterministicContinuationMeasured === false,
    "Stage 1 scope expanded to D4/continuation");

  const d = spec.decisionLoss;
  assert(d.primaryReference === "D3+Q1", "primary decision-loss reference changed");
  assert(d.topSetLoss === "regret-zero-for-all-D3-top-set-ties", "tie semantics changed");
  sameJson(d.domainOrder, ["root-loss-mate-domain","ordinary-evaluation-domain","root-win-mate-domain"],
    "score-domain order");
  assert(d.ordinaryRegretPoolingAcrossMateDomainsAllowed === false, "cross-domain raw regret pooling forbidden");
  assert(d.inferiorEvent.id === "d3-inferior-v1", "inferior-event id changed");

  const r = spec.discoveryRepresentation;
  sameJson(r.moveAbstractionModes, Contract.MOVE_ABSTRACTION_MODES, "move abstraction modes");
  sameJson(r.preconditionTokenFamilies, Contract.PRECONDITION_TOKEN_FAMILIES, "precondition token families");
  sameJson(r.failureTokenFamilies, Contract.FAILURE_TOKEN_FAMILIES, "failure token families");
  const cp = r.candidatePattern;
  assert(cp.mandatoryPhaseToken === true, "phase token must remain mandatory");
  assert(cp.minimumPreconditionTokens === 1 && cp.maximumPreconditionTokens === 2,
    "precondition conjunction size changed");
  assert(cp.maximumOneTokenPerPreconditionFamily === true, "same-family conjunction forbidden");
  assert(cp.exactlyOneMoveAbstractionToken === true && cp.exactlyOneFailureToken === true,
    "candidate arity changed");
  assert(cp.matcherExcludesFailureToken === true,
    "failure token must not enter the outcome-blind matcher");
  assert(cp.withinTrajectoryMatcherRepresentative === "lexicographically-smallest-exact-AI.moveKey",
    "within-trajectory representative changed");
  assert(cp.oneOpportunityVotePerHistoricalTrajectoryPerMatcher === true,
    "trajectory support dedup changed");
  assert(cp.patternComplexity
    === "number-of-precondition-tokens + (move-abstraction-mode==indexed ? 1 : 0)",
  "pattern complexity changed");
  assert(r.candidateEnumeration.minimumMatcherOpportunityTrajectoriesForDetailedAudit === 12,
    "detailed audit threshold changed");
  assert(r.candidateEnumeration.manualCandidateAdditionAllowed === false, "manual candidates forbidden");

  const promo = spec.candidatePromotion;
  for (const [key, value] of Object.entries(Contract.PROMOTION)) {
    assert(promo[key] === value, `promotion threshold changed: ${key}`);
  }
  assert(promo.supportEquivalence.opportunityIdentity
    === "sha256-sorted-historicalTrajectoryHash|ruleStateKey|moveKey-tuples",
  "support identity changed");
  assert(promo.supportEquivalence.equivalentIf
    === "same-opportunityIdentityHash-and-same-failureToken", "support equivalence changed");
  assert(promo.candidateCap.maximumTotal === 6
    && promo.candidateCap.maximumPerPhase === 3
    && promo.candidateCap.maximumPerFailureFamily === 2, "candidate cap changed");
  assert(promo.failedCandidatesRetainedInAudit === true && promo.manualOverrideAllowed === false,
    "promotion audit/manual override changed");

  const ready = spec.readinessGates;
  assert(ready.minimumUniqueHistoricalTrajectories === 1600, "trajectory readiness changed");
  assert(ready.requiredSelectedUniqueRuleStates === 1200, "selected-state readiness changed");
  assert(ready.requiredNamuaSelectedStates === 600 && ready.requiredMtajiSelectedStates === 600,
    "phase readiness changed");
  assert(ready.minimumDistinctOpeningPrefixes === 128, "opening readiness changed");
  assert(ready.minimumSelectedPerGenerationStratum === 100, "stratum readiness changed");
  assert(ready.minimumMeasuredMoveRecords === 3600, "measurement readiness changed");
  assert(ready.allSelectedRootsRequireFiniteD3CandidateTables === true, "finite D3 gate disabled");

  const stop = spec.stopping;
  assert(stop.gamesFixed === Contract.GAME_COUNT && stop.rootsFixedIfReadinessPasses === 1200,
    "fixed population/root budget changed");
  assert(stop.earlyStopAllowed === false && stop.outcomeDependentExtensionAllowed === false,
    "outcome-dependent stopping enabled");
  assert(stop.automaticReplacementForUnavailableAssignedPhase === false
    && stop.automaticPhaseReassignmentAllowed === false
    && stop.automaticReplacementForDuplicateRuleState === false, "replacement/reassignment enabled");
  assert(stop.unusedReservedSeedCapacityAfterGeneration === 0, "reserved Stage 1 block is not exact");

  assert(spec.authorization.generationAuthorizedBySpecAlone === false,
    "spec alone must not authorize generation");
  assert(Array.isArray(spec.authorization.requiredBeforeGeneration)
    && spec.authorization.requiredBeforeGeneration.includes("separate-explicit-authorization-commit"),
  "separate authorization firewall missing");
  assert(spec.stage2Boundary.stage1PositionsReusableForConfirmation === false
    && spec.stage2Boundary.stage1SeedsReusableForConfirmation === false
    && spec.stage2Boundary.stage2GenerationAuthorizedByThisSpec === false, "Stage 2 firewall changed");
  assert(spec.interpretationBoundary.exploratoryOnly === true
    && spec.interpretationBoundary.machineReproduciblePatternOnly === true,
  "Stage 1 interpretation boundary changed");
  assert(spec.interpretationBoundary.gameTheoreticBlunderClaimAuthorized === false
    && spec.interpretationBoundary.validatedWinProbabilityLossClaimAuthorized === false
    && spec.interpretationBoundary.humanMisconceptionClaimAuthorized === false
    && spec.interpretationBoundary.closedStudyRescueAuthorized === false,
  "forbidden claim authorization enabled");

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
    generationAuthorizedBySpecAlone: false,
    exactGames: spec.population.games,
    exactSeedStart: spec.population.seedStart,
    exactSeedEnd: spec.population.seedEnd,
    exactSelectedRootsIfReadinessPasses: spec.stopping.rootsFixedIfReadinessPasses,
  }, null, 2));
}

if (require.main === module) main();
module.exports = { SPEC_PATH, loadSpec, validateSpec };
