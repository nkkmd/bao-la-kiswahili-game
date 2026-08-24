#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const Contract = require("./lib/critical-positions-stage1-contract.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT,
  "doc/critical-positions-outcome-branching/preregistration/STAGE_1_EXPLORATORY_SPEC.json");

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function assert(value, message) { if (!value) throw new Error(message); }
function same(a, b, label) { assert(JSON.stringify(a) === JSON.stringify(b), `${label} changed`); }
function loadSpec(specPath = SPEC_PATH) {
  const text = fs.readFileSync(specPath, "utf8");
  return { spec: JSON.parse(text), text, specSha256: sha256(text) };
}

function validateSpec(spec) {
  assert(spec.schemaVersion === 1, "schemaVersion");
  assert(spec.studyId === "CPOB-STUDY1", "studyId");
  assert(spec.stageId === Contract.STAGE1_ID, "stageId");
  assert(spec.status === "prospective-frozen-pending-contract-validation", "status");
  assert(spec.scientificInferenceAuthorized === false, "Stage1 must remain exploratory");
  assert(spec.confirmatoryReuseAllowed === false, "confirmatory reuse forbidden");
  assert(spec.baseMainHead === "576783b1a1d514726d4d30e4dfac1bf79dde9e2a", "baseline main");
  assert(spec.stage0TechnicalCoreHash === "75aaa30a9f8154873bf9391c27b4720886fce17ec7402b68800c03b2cbe276cd", "Stage0 core hash");
  assert(spec.stage0CapAuditCoreHash === "0530faca878fa71b86f6b55b355cd0b70f67b5f8c32e287b82ce10dd8bb77678", "cap core hash");

  const p = spec.population;
  assert(p.games === Contract.GAME_COUNT, "game count");
  assert(p.seedStart === Contract.SEED_START && p.seedEnd === Contract.SEED_END, "seed block");
  assert(p.seedEnd - p.seedStart + 1 === p.games, "seed interval");
  assert(p.opening.policy === "seeded-uniform-exact-E.moveVariants" && p.opening.plies === 8, "opening");
  assert(p.maxPly === 100, "maxPly");
  same(p.conditionAssignment.strata.map((x) => x.id), ["B-D1","B-D2","B-D3","LS-D2","V2-D2","LE-D2"], "strata ids");
  same(p.conditionAssignment.strata.map((x) => x.moduloRemainder), [0,1,2,3,4,5], "strata remainders");
  same(p.conditionAssignment.strata.map((x) => x.expectedGames), [512,512,512,512,512,512], "strata counts");
  for (const { id, generator: g } of p.conditionAssignment.strata) {
    assert(g.timeLimitMs === "Infinity", `time limit ${id}`);
    assert(g.adaptive === false && g.stableBestDepths === 0 && g.aspirationWindow === 0, `adaptive ${id}`);
  }

  const s = spec.rootSelection;
  assert(s.minimumPly === 8 && s.terminalIncluded === false && s.minimumLegalMoveCount === 2, "root eligibility");
  assert(s.legalMoveDefinition === "E.moveVariants(state).length", "legal move population");
  assert(s.phaseAssignment.salt === "CPOB-S1-PHASE-v1", "phase salt");
  assert(s.withinAssignedPhase.salt === "CPOB-S1-ROOT-v1", "root salt");
  assert(s.unavailableAssignedPhase === "no-replacement-no-reassignment", "phase replacement");
  same(s.phaseQuota.namua, Contract.PHASE_QUOTA.namua, "Namua quota");
  same(s.phaseQuota.mtaji, Contract.PHASE_QUOTA.mtaji, "Mtaji quota");
  assert(s.phaseQuota.salt === "CPOB-S1-QUOTA-v1", "quota salt");
  for (const forbidden of ["gameWinner","continuationOutcome","D_range","D2Score","D3Score","candidateMatcher","postMoveConsequence"]) {
    assert(s.selectionMayNotUse.includes(forbidden), `missing forbidden root-selection field ${forbidden}`);
  }

  const m = spec.continuationMeasurement;
  assert(m.rootActor === "state.player" && m.allExactLegalRootMoveVariants === true, "root measurement");
  assert(m.moveIdentity === "AI.moveKey", "move identity");
  assert(m.policy.id === Contract.POLICY_ID && m.policy.level === "normal" && m.policy.evaluationProfile === "bao", "policy");
  assert(m.replicatesPerExactRootMove === Contract.REPLICATES, "replicates");
  assert(m.maximumPostRootContinuationPlies === Contract.MAX_CONTINUATION_PLIES, "continuation cap");
  assert(m.replicateSeedDerivation.salt === "CPOB-S1-CONT-v1", "continuation salt");
  assert(m.replicateSeedDerivation.sameSeedAcrossRootMovesAtReplicateIndex === true, "paired seed");
  assert(m.replicateSeedDerivation.separateRngInstancePerRootMoveIntervention === true, "separate RNG instances");
  assert(m.terminalEncoding.unfinishedTreatedAsDraw === false, "unfinished draw recode");
  assert(m.primaryRootEstimability === "all-exact-legal-root-moves-have-64-of-64-terminal-replicates", "estimability");
  assert(m.highDivergenceThresholdInclusive === Contract.HIGH_DIVERGENCE_THRESHOLD, "D_range threshold");

  const secondary = spec.secondaryMeasurement;
  same(secondary.search.depths, [2,3], "search depths");
  assert(secondary.search.scoreToProbabilityConversionAllowed === false && secondary.search.D3IsGroundTruth === false, "search interpretation");
  assert(secondary.principalVariationRequired === false && secondary.wallClockInferentialUse === false, "PV/timing");

  const grammar = spec.candidateGrammar;
  assert(grammar.candidateObject === "root-structural-class-not-move-specific-error-pattern", "candidate object");
  assert(grammar.minimumPreconditionTokens === 1 && grammar.maximumPreconditionTokens === 2, "grammar arity");
  assert(grammar.continuationOutcomeExcludedFromMatcher === true && grammar.searchValueExcludedFromMatcher === true
    && grammar.postMoveConsequenceExcludedFromMatcher === true, "matcher blindness");
  same(grammar.tokenFamilies, Contract.TOKEN_FAMILIES, "token grammar");

  const promo = spec.candidatePromotion;
  for (const [key, value] of Object.entries(Contract.PROMOTION)) assert(promo[key] === value, `promotion ${key}`);
  assert(promo.candidateCap.maximumTotal === 6 && promo.candidateCap.maximumPerPhase === 3
    && promo.candidateCap.maximumPerPrimaryTokenFamily === 2, "candidate cap");
  assert(promo.manualOverrideAllowed === false && promo.zeroPromotedCandidatesAllowed === true, "manual/zero candidate handling");

  const r = spec.readinessGates;
  assert(r.minimumUniqueHistoricalTrajectories === 2500, "trajectory readiness");
  assert(r.requiredSelectedUniqueRuleStates === 600 && r.requiredNamuaSelectedRoots === 300 && r.requiredMtajiSelectedRoots === 300, "selected roots readiness");
  assert(r.minimumPrimaryEstimableRoots === 450 && r.minimumPrimaryEstimableNamuaRoots === 180 && r.minimumPrimaryEstimableMtajiRoots === 180, "estimability readiness");
  assert(r.independentCorpusVerificationRequired === true && r.independentContinuationRemeasurementRequired === true, "verification firewall");

  same(spec.executionFirewall, [
    "generate-source-corpus",
    "independent-full-corpus-replay-verification",
    "outcome-blind-root-selection",
    "all-move-continuation-and-secondary-measurement",
    "independent-full-continuation-remeasurement-and-secondary-recomputation",
    "deterministic-exploratory-candidate-discovery",
  ], "execution firewall");
  assert(spec.stopping.gamesFixed === Contract.GAME_COUNT && spec.stopping.selectedRootsFixedIfReadinessPasses === 600, "fixed stopping");
  assert(spec.stopping.outcomeDependentExtensionAllowed === false && spec.stopping.replacementForPrimaryNonEstimableRoot === false
    && spec.stopping.replicateExtensionAllowed === false, "no rescue stopping");
  assert(spec.authorization.generationAuthorizedBySpecAlone === false, "spec authorization firewall");
  assert(spec.stage2Boundary.stage1RootsReusableForConfirmation === false && spec.stage2Boundary.stage1SeedsReusableForConfirmation === false
    && spec.stage2Boundary.identityOverlapReplacementAllowed === false, "Stage2 identity firewall");
  same(spec.stage2Boundary.requiredFinalZeroOverlapAxes, ["historicalTrajectoryHash","openingPrefixHash","ruleStateKey"], "Stage2 overlap axes");
  assert(spec.interpretationBoundary.exploratoryOnly === true
    && spec.interpretationBoundary.empiricalContinuationOutcomeIsGameTheoreticProbability === false
    && spec.interpretationBoundary.engineScoreToValidatedWinProbabilityConversionUsed === false
    && spec.interpretationBoundary.humanCriticalityClaimAuthorized === false, "interpretation boundary");
  return true;
}

function main() {
  const loaded = loadSpec();
  validateSpec(loaded.spec);
  console.log(JSON.stringify({
    schemaVersion: 1,
    stageId: loaded.spec.stageId,
    specSha256: loaded.specSha256,
    passed: true,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    generationAuthorizedBySpecAlone: false,
    exactGames: loaded.spec.population.games,
    exactSeedStart: loaded.spec.population.seedStart,
    exactSeedEnd: loaded.spec.population.seedEnd,
    exactSelectedRootsIfReadinessPasses: loaded.spec.stopping.selectedRootsFixedIfReadinessPasses,
    replicatesPerExactRootMove: loaded.spec.continuationMeasurement.replicatesPerExactRootMove,
    continuationCap: loaded.spec.continuationMeasurement.maximumPostRootContinuationPlies,
    highDivergenceThreshold: loaded.spec.continuationMeasurement.highDivergenceThresholdInclusive
  }, null, 2));
}

if (require.main === module) main();
module.exports = { SPEC_PATH, loadSpec, validateSpec };
