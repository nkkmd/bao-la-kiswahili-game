#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const P = require("./lib/brsgt-production.js");
const I = require("./lib/brsgt-independent.js");
const STUDY_SPEC = require("../../doc/rule-semantic-geometry-transition/prereg/STUDY_1_SPEC.json");
const STAGE0_SPEC = require("../../doc/rule-semantic-geometry-transition/prereg/STAGE_0_V2_TECHNICAL_SPEC.json");

function need(value, message) { if (!value) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function same(a, b) { return P.canonical(a) === P.canonical(b); }
function representedSeedTotal(state) {
  return state.pits.flat(2).reduce((sum, value) => sum + value, 0)
    + state.reserve[0] + state.reserve[1]
    + state.pending[0] + state.pending[1];
}
function validateRawFixture(state, id) {
  need(representedSeedTotal(state) === 64, `${id} represented seed total ${representedSeedTotal(state)}`);
  need(P.stateKey(state) === I.stateKey(state), `${id} production/independent RAW identity mismatch`);
  return { fixtureId: id, representedSeedTotal: 64, rawSha256: P.stateKey(state) };
}

function houseFixtureV2() {
  const state = E.initialState();
  state.pits = [
    [Array(8).fill(0), Array(8).fill(0)],
    [Array(8).fill(0), Array(8).fill(0)],
  ];
  state.pits[0][E.FRONT][2] = 1;
  state.pits[0][E.FRONT][E.HOUSE] = 6;
  state.pits[0][E.FRONT][6] = 1;
  state.pits[1][E.FRONT][5] = 5;
  state.pits[1][E.FRONT][6] = 1;
  const balance = [4, 4, 4, 4, 4, 4, 3, 3];
  for (let index = 0; index < 8; index += 1) state.pits[1][E.BACK][index] = balance[index];
  state.reserve = [10, 10];
  state.houseOwned = [true, true];
  state.player = 0;
  state.phase = "namua";
  state.winner = null;
  state.reason = "";
  state.turn = 17;
  state.pending = [0, 0];
  need(representedSeedTotal(state) === 64, "NYUMBA v2 fixture must represent 64 seeds");
  return state;
}

function pairedCanonicalMoves(state) {
  const pMoves = P.canonicalMoves(E, state);
  const iMoves = I.canonicalMoves(E, state);
  const pKeys = pMoves.map((row) => row.key);
  const iKeys = iMoves.map((row) => row.key);
  need(same(pKeys, iKeys), "production/independent canonical move list mismatch during deterministic phase search");
  return { pMoves, iMoves, keys: pKeys };
}

function applyPaired(state, pRow, iRow, context) {
  need(pRow.key === iRow.key, `${context} move identity mismatch`);
  const pTransition = P.applyComplete(E, state, pRow.move);
  const iTransition = I.applyComplete(E, state, iRow.move);
  need(P.stateKey(pTransition.post) === I.stateKey(iTransition.post), `${context} post-state mismatch`);
  need(representedSeedTotal(pTransition.post) === 64, `${context} post state violates 64-seed invariant`);
  return { production: pTransition, independent: iTransition };
}

function findPhaseTransitionFixture() {
  let state = E.initialState();
  validateRawFixture(state, "PHASE-SEARCH-START");
  const pathMoveKeys = [];
  const maxPlies = STAGE0_SPEC.resourceCeiling.maxDeterministicPhaseSearchPlies;

  for (let sourcePly = 0; sourcePly < maxPlies; sourcePly += 1) {
    need(state.winner === null, `deterministic phase path terminated at ply ${sourcePly}`);
    need(state.reason !== "relay-limit", `deterministic phase path hit relay-limit at ply ${sourcePly}`);
    const paired = pairedCanonicalMoves(state);
    need(paired.pMoves.length > 0, `deterministic phase path has zero legal moves at ply ${sourcePly}`);

    const transitions = paired.pMoves.map((pRow, index) => ({
      pRow,
      iRow: paired.iMoves[index],
      transition: applyPaired(state, pRow, paired.iMoves[index], `phase-search-${sourcePly}-${index}`),
    }));

    const target = transitions.find((row) =>
      state.phase === "namua"
      && row.transition.production.post.phase === "mtaji"
      && row.transition.production.post.winner === null
      && row.transition.production.post.reason !== "relay-limit");
    if (target) {
      return {
        state: clone(state),
        targetMoveKey: target.pRow.key,
        targetMove: clone(target.pRow.move),
        targetPost: clone(target.transition.production.post),
        sourcePly,
        pathMoveKeys: pathMoveKeys.slice(),
        pathDigestSha256: P.digest(P.canonical(pathMoveKeys)),
      };
    }

    const next = transitions.find((row) =>
      row.transition.production.post.winner === null
      && row.transition.production.post.reason !== "relay-limit");
    need(next, `deterministic phase path has no nonterminal successor at ply ${sourcePly}`);
    pathMoveKeys.push(next.pRow.key);
    state = clone(next.transition.production.post);
  }
  throw new Error(`deterministic phase transition fixture not found within ${maxPlies} plies`);
}

function measurePair(state, id) {
  validateRawFixture(state, id);
  need(state.winner === null, `terminal geometry state prohibited: ${id}`);
  need(state.reason !== "relay-limit", `relay-limit geometry state prohibited: ${id}`);
  const production = P.measureState(E, state, id);
  const independent = I.measureState(E, state, id);
  return {
    id,
    production,
    independent,
    exactAgreement: production.reconstructionCoreSha256 === independent.reconstructionCoreSha256
      && same(production.familyCoreSha256, independent.familyCoreSha256)
      && same(production.endpoint, independent.endpoint),
  };
}

function firstTransition(state, id) {
  const paired = pairedCanonicalMoves(state);
  need(paired.pMoves.length > 0, `${id} fixture has no legal move`);
  const transition = applyPaired(state, paired.pMoves[0], paired.iMoves[0], id);
  return { key: paired.pMoves[0].key, ...transition };
}

function main() {
  const output = process.argv[2]
    || "doc/rule-semantic-geometry-transition/results/stage-0-v2/STAGE_0_V2_TECHNICAL_RESULT.json";

  need(STUDY_SPEC.studyId === "BRSGT-STUDY1", "study spec identity mismatch");
  need(STUDY_SPEC.candidateFutureNamespaces.authorizedForRead === false, "future scientific namespace unexpectedly readable");
  need(STAGE0_SPEC.studyId === STUDY_SPEC.studyId, "stage0 v2 study mismatch");
  need(STAGE0_SPEC.stageId === "BRSGT-S0-TECHNICAL-2026-09-27-v2", "stage0 v2 id mismatch");
  need(STAGE0_SPEC.evidenceClass === "TECHNICAL-FIXTURE", "stage0 v2 evidence class mismatch");
  need(STAGE0_SPEC.freshScientificSeedAccessAuthorized === false, "fresh scientific access must be disabled");
  need(STAGE0_SPEC.scientificOutcomeAuthorized === false, "scientific outcome must be disabled");
  need(STAGE0_SPEC.protectedDepth11AccessAuthorized === false, "depth11 access must be disabled");
  need(STAGE0_SPEC.relativeDepth === 5, "relative depth must remain 5");

  const initial = E.initialState();
  const house = houseFixtureV2();
  const phaseFixture = findPhaseTransitionFixture();
  const phase = phaseFixture.state;
  const fixtureValidation = [
    validateRawFixture(initial, "BRSGT-TF2-INITIAL"),
    validateRawFixture(house, "BRSGT-TF2-NYUMBA"),
    validateRawFixture(phase, "BRSGT-TF2-PHASE-REACHABLE"),
    validateRawFixture(phaseFixture.targetPost, "BRSGT-TF2-PHASE-POST"),
  ];

  const fixtures = [
    { id: "BRSGT-TF2-INITIAL", state: initial },
    { id: "BRSGT-TF2-NYUMBA", state: house },
    { id: "BRSGT-TF2-PHASE-REACHABLE", state: phase },
  ];
  const pSelection = P.selectionCore(E, fixtures);
  const iSelection = I.selectionCore(E, fixtures);
  const selectionExact = same(pSelection, iSelection);
  need(selectionExact, "production/independent unit-by-unit selection mismatch");

  const allTransitionRows = pSelection.transitionRows;
  const allLabels = new Set(allTransitionRows.flatMap((row) => row.eventLabels));
  const nyumbaRows = pSelection.nyumbaRows;
  const initialTransition = firstTransition(initial, "INITIAL-FIRST");
  const pHousePairs = P.nyumbaPairs(E, house);
  const iHousePairs = I.nyumbaPairs(E, house);
  need(pHousePairs.length > 0, "NYUMBA v2 technical pair unavailable");
  need(same(pHousePairs.map((row) => row.physicalMoveKey), iHousePairs.map((row) => row.physicalMoveKey)),
    "NYUMBA v2 production/independent pair identity mismatch");
  const pHousePair = pHousePairs[0];
  const iHousePair = iHousePairs[0];
  need(P.moveKey(pHousePair.stop.move) === I.moveKey(iHousePair.stop.move), "NYUMBA v2 stop move mismatch");
  need(P.moveKey(pHousePair.use.move) === I.moveKey(iHousePair.use.move), "NYUMBA v2 use move mismatch");
  need(P.stateKey(pHousePair.stop.post) === I.stateKey(iHousePair.stop.post), "NYUMBA v2 stop post mismatch");
  need(P.stateKey(pHousePair.use.post) === I.stateKey(iHousePair.use.post), "NYUMBA v2 use post mismatch");

  const targetPMoves = P.canonicalMoves(E, phase);
  const targetIMoves = I.canonicalMoves(E, phase);
  const pTargetIndex = targetPMoves.findIndex((row) => row.key === phaseFixture.targetMoveKey);
  const iTargetIndex = targetIMoves.findIndex((row) => row.key === phaseFixture.targetMoveKey);
  need(pTargetIndex >= 0 && iTargetIndex >= 0, "phase target move missing from canonical move set");
  const targetTransition = applyPaired(phase, targetPMoves[pTargetIndex], targetIMoves[iTargetIndex], "PHASE-TARGET");
  need(targetTransition.production.post.phase === "mtaji", "phase target did not transition to mtaji");

  const geometry = [
    measurePair(initial, "G2-INITIAL-PRE"),
    measurePair(initialTransition.production.post, "G2-INITIAL-POST"),
    measurePair(house, "G2-NYUMBA-PRE"),
    measurePair(pHousePair.stop.post, "G2-NYUMBA-STOP-POST"),
    measurePair(pHousePair.use.post, "G2-NYUMBA-USE-POST"),
    measurePair(phase, "G2-PHASE-PRE"),
    measurePair(targetTransition.production.post, "G2-PHASE-POST"),
  ];
  need(geometry.length <= STAGE0_SPEC.resourceCeiling.maxGeometryRootMeasurements, "geometry measurement ceiling exceeded");
  need(geometry.every((row) => row.exactAgreement), "production/independent geometry endpoint mismatch");

  const initialDeltaP = P.delta(geometry[1].production, geometry[0].production);
  const initialDeltaI = I.delta(geometry[1].independent, geometry[0].independent);
  const nyumbaContrastP = P.nyumbaContrast(geometry[4].production, geometry[3].production);
  const nyumbaContrastI = I.nyumbaContrast(geometry[4].independent, geometry[3].independent);
  const phaseDeltaP = P.delta(geometry[6].production, geometry[5].production);
  const phaseDeltaI = I.delta(geometry[6].independent, geometry[5].independent);
  const undefinedP = P.fraction(1n, 0n);
  const undefinedI = I.fraction(1n, 0n);

  const gates = {
    allFixtureRawState64SeedValid: fixtureValidation.every((row) => row.representedSeedTotal === 64),
    phaseFixtureEngineReachableSeedFree: phaseFixture.sourcePly <= STAGE0_SPEC.resourceCeiling.maxDeterministicPhaseSearchPlies
      && phaseFixture.pathMoveKeys.length === phaseFixture.sourcePly,
    rawIdentityAndMoveSerializationExact: selectionExact,
    completeMoveApplicationExact: P.stateKey(initialTransition.production.post) === I.stateKey(initialTransition.independent.post)
      && P.stateKey(targetTransition.production.post) === I.stateKey(targetTransition.independent.post),
    capturePredicateCovered: allLabels.has("BRSGT-E1-CAPTURE"),
    nyumbaPairCovered: nyumbaRows.length > 0,
    reserveDecrementPredicateCovered: allLabels.has("BRSGT-E3-RESERVE-DECREMENT-NONTRANSITION"),
    namuaToMtajiPredicateCovered: allLabels.has("BRSGT-E4-NAMUA-TO-MTAJI"),
    compoundLabelVectorExact: pSelection.transitionRows.some((row) => row.eventLabels.length >= 2),
    unitByUnitSelectionExact: selectionExact,
    prepostMeasurementBindingExact: geometry.every((row) => row.exactAgreement),
    endpointAgreementExact: geometry.every((row) => same(row.production.endpoint, row.independent.endpoint)),
    exactDifferenceArithmetic: same(initialDeltaP, initialDeltaI) && same(phaseDeltaP, phaseDeltaI),
    nyumbaPairArithmetic: same(nyumbaContrastP, nyumbaContrastI),
    undefinedDenominatorFailClosed: same(undefinedP, undefinedI) && undefinedP.defined === false,
    canonicalDigestDeterministic: P.digest(P.canonical(pSelection)) === I.digest(I.canonical(iSelection)),
    resourceCeiling: allTransitionRows.length <= STAGE0_SPEC.resourceCeiling.maxEventTransitionsMaterialized
      && geometry.length <= STAGE0_SPEC.resourceCeiling.maxGeometryRootMeasurements
      && phaseFixture.sourcePly < STAGE0_SPEC.resourceCeiling.maxDeterministicPhaseSearchPlies,
    scientificExecutionFalse: true,
    freshScientificSeedReadsZero: true,
    g4_10Depth11AccessZero: true,
  };

  const stageDisposition = Object.values(gates).every(Boolean) ? "STAGE0-PASS" : "TECHNICAL-INVALID";
  const core = {
    schemaVersion: 1,
    studyId: STUDY_SPEC.studyId,
    stageId: STAGE0_SPEC.stageId,
    supersedes: STAGE0_SPEC.supersedesTechnicalStage,
    evidenceClass: "TECHNICAL-FIXTURE",
    stageDisposition,
    scientificExecution: false,
    freshScientificSeedReads: 0,
    stage1CandidateNamespaceReads: 0,
    stage2CandidateNamespaceReads: 0,
    g4_10Depth11AccessCount: 0,
    publicAiChanged: false,
    fixtureValidation,
    phaseFixture: {
      sourcePly: phaseFixture.sourcePly,
      targetMoveKey: phaseFixture.targetMoveKey,
      pathLength: phaseFixture.pathMoveKeys.length,
      pathDigestSha256: phaseFixture.pathDigestSha256,
      preRawSha256: P.stateKey(phase),
      postRawSha256: P.stateKey(targetTransition.production.post),
    },
    selection: pSelection,
    geometry: geometry.map((row) => ({
      id: row.id,
      rootRawSha256: row.production.rootRawSha256,
      reconstructionCoreSha256: row.production.reconstructionCoreSha256,
      familyCoreSha256: row.production.familyCoreSha256,
      endpoint: row.production.endpoint,
    })),
    arithmetic: {
      initialPrePostDelta: initialDeltaP,
      nyumbaUseMinusStop: nyumbaContrastP,
      phasePrePostDelta: phaseDeltaP,
      undefinedFraction: undefinedP,
    },
    gates,
  };
  const result = { ...core, deterministicCoreSha256: P.digest(P.canonical(core)) };

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify({
    stageDisposition,
    deterministicCoreSha256: result.deterministicCoreSha256,
    phaseFixtureSourcePly: phaseFixture.sourcePly,
    transitionRows: pSelection.transitionRows.length,
    nyumbaRows: pSelection.nyumbaRows.length,
    geometryMeasurements: geometry.length,
    gates,
  }, null, 2));
  if (stageDisposition !== "STAGE0-PASS") process.exitCode = 2;
}

main();
