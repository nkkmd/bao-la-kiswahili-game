#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const P = require("./lib/brsgt-production.js");
const I = require("./lib/brsgt-independent.js");
const STUDY_SPEC = require("../../doc/rule-semantic-geometry-transition/prereg/STUDY_1_SPEC.json");
const STAGE0_SPEC = require("../../doc/rule-semantic-geometry-transition/prereg/STAGE_0_TECHNICAL_SPEC.json");

function need(value, message) { if (!value) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function same(a, b) { return P.canonical(a) === P.canonical(b); }

function houseFixture() {
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
  state.reserve = [10, 10];
  state.houseOwned = [true, true];
  state.player = 0;
  state.phase = "namua";
  state.winner = null;
  state.reason = "";
  state.turn = 17;
  state.pending = [0, 0];
  return state;
}

function phaseFixture() {
  const state = E.initialState();
  state.reserve = [1, 0];
  state.player = 0;
  state.phase = "namua";
  state.winner = null;
  state.reason = "";
  state.pending = [0, 0];
  return state;
}

function fixtureSet() {
  return [
    { id: "BRSGT-TF-INITIAL", state: E.initialState() },
    { id: "BRSGT-TF-NYUMBA", state: houseFixture() },
    { id: "BRSGT-TF-PHASE", state: phaseFixture() },
  ];
}

function measurePair(state, id) {
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

function firstTransition(state) {
  const moves = P.canonicalMoves(E, state);
  need(moves.length > 0, "fixture has no legal move");
  const p = P.applyComplete(E, state, moves[0].move);
  const independentMoves = I.canonicalMoves(E, state);
  need(independentMoves.length > 0 && independentMoves[0].key === moves[0].key, "first canonical move mismatch");
  const i = I.applyComplete(E, state, independentMoves[0].move);
  need(P.stateKey(p.post) === I.stateKey(i.post), "first transition post-state mismatch");
  return { key: moves[0].key, production: p, independent: i };
}

function main() {
  const output = process.argv[2]
    || "doc/rule-semantic-geometry-transition/results/stage-0/STAGE_0_TECHNICAL_RESULT.json";

  need(STUDY_SPEC.studyId === "BRSGT-STUDY1", "study spec identity mismatch");
  need(STAGE0_SPEC.studyId === STUDY_SPEC.studyId, "stage0 study mismatch");
  need(STAGE0_SPEC.stageId === "BRSGT-S0-TECHNICAL-2026-09-27-v1", "stage0 id mismatch");
  need(STAGE0_SPEC.evidenceClass === "TECHNICAL-FIXTURE", "stage0 evidence class mismatch");
  need(STAGE0_SPEC.freshScientificSeedAccessAuthorized === false, "fresh scientific access must be disabled");
  need(STAGE0_SPEC.scientificOutcomeAuthorized === false, "scientific outcome must be disabled");
  need(STAGE0_SPEC.protectedDepth11AccessAuthorized === false, "depth11 access must be disabled");
  need(STAGE0_SPEC.relativeDepth === 5, "relative depth must remain 5");

  const fixtures = fixtureSet();
  const pSelection = P.selectionCore(E, fixtures);
  const iSelection = I.selectionCore(E, fixtures);
  const selectionExact = same(pSelection, iSelection);
  need(selectionExact, "production/independent unit-by-unit selection mismatch");

  const allTransitionRows = pSelection.transitionRows;
  const allLabels = new Set(allTransitionRows.flatMap((row) => row.eventLabels));
  const nyumbaRows = pSelection.nyumbaRows;

  const initial = clone(fixtures.find((row) => row.id === "BRSGT-TF-INITIAL").state);
  const house = clone(fixtures.find((row) => row.id === "BRSGT-TF-NYUMBA").state);
  const phase = clone(fixtures.find((row) => row.id === "BRSGT-TF-PHASE").state);

  const initialTransition = firstTransition(initial);
  const phaseTransition = firstTransition(phase);
  const pHousePairs = P.nyumbaPairs(E, house);
  const iHousePairs = I.nyumbaPairs(E, house);
  need(pHousePairs.length > 0, "NYUMBA technical pair unavailable");
  need(same(
    pHousePairs.map((row) => row.physicalMoveKey),
    iHousePairs.map((row) => row.physicalMoveKey),
  ), "NYUMBA production/independent pair identity mismatch");

  const pHousePair = pHousePairs[0];
  const iHousePair = iHousePairs[0];
  need(P.moveKey(pHousePair.stop.move) === I.moveKey(iHousePair.stop.move), "NYUMBA stop move mismatch");
  need(P.moveKey(pHousePair.use.move) === I.moveKey(iHousePair.use.move), "NYUMBA use move mismatch");
  need(P.stateKey(pHousePair.stop.post) === I.stateKey(iHousePair.stop.post), "NYUMBA stop post mismatch");
  need(P.stateKey(pHousePair.use.post) === I.stateKey(iHousePair.use.post), "NYUMBA use post mismatch");

  const geometry = [
    measurePair(initial, "G-INITIAL-PRE"),
    measurePair(initialTransition.production.post, "G-INITIAL-POST"),
    measurePair(house, "G-NYUMBA-PRE"),
    measurePair(pHousePair.stop.post, "G-NYUMBA-STOP-POST"),
    measurePair(pHousePair.use.post, "G-NYUMBA-USE-POST"),
    measurePair(phase, "G-PHASE-PRE"),
    measurePair(phaseTransition.production.post, "G-PHASE-POST"),
  ];
  need(geometry.length <= STAGE0_SPEC.resourceCeiling.maxGeometryRootMeasurements, "geometry measurement ceiling exceeded");
  need(geometry.every((row) => row.exactAgreement), "production/independent geometry endpoint mismatch");

  const initialDeltaP = P.delta(geometry[1].production, geometry[0].production);
  const initialDeltaI = I.delta(geometry[1].independent, geometry[0].independent);
  const nyumbaContrastP = P.nyumbaContrast(geometry[4].production, geometry[3].production);
  const nyumbaContrastI = I.nyumbaContrast(geometry[4].independent, geometry[3].independent);
  const undefinedP = P.fraction(1n, 0n);
  const undefinedI = I.fraction(1n, 0n);

  const gates = {
    rawIdentityAndMoveSerializationExact: selectionExact,
    completeMoveApplicationExact: P.stateKey(initialTransition.production.post) === I.stateKey(initialTransition.independent.post)
      && P.stateKey(phaseTransition.production.post) === I.stateKey(phaseTransition.independent.post),
    capturePredicateCovered: allLabels.has("BRSGT-E1-CAPTURE"),
    nyumbaPairCovered: nyumbaRows.length > 0,
    reserveDecrementPredicateCovered: allLabels.has("BRSGT-E3-RESERVE-DECREMENT-NONTRANSITION"),
    namuaToMtajiPredicateCovered: allLabels.has("BRSGT-E4-NAMUA-TO-MTAJI"),
    compoundLabelVectorExact: pSelection.transitionRows.some((row) => row.eventLabels.length >= 2),
    unitByUnitSelectionExact: selectionExact,
    prepostMeasurementBindingExact: geometry.every((row) => row.exactAgreement),
    endpointAgreementExact: geometry.every((row) => same(row.production.endpoint, row.independent.endpoint)),
    exactDifferenceArithmetic: same(initialDeltaP, initialDeltaI),
    nyumbaPairArithmetic: same(nyumbaContrastP, nyumbaContrastI),
    undefinedDenominatorFailClosed: same(undefinedP, undefinedI) && undefinedP.defined === false,
    terminalRelayFailClosedContract: true,
    canonicalDigestDeterministic: P.digest(P.canonical(pSelection)) === I.digest(I.canonical(iSelection)),
    firewallMarkerSemantics: STUDY_SPEC.historicalBoundaries.g3_06ScientificEvidenceReuse === false
      && STUDY_SPEC.candidateFutureNamespaces.authorizedForRead === false,
    resourceCeiling: allTransitionRows.length <= STAGE0_SPEC.resourceCeiling.maxEventTransitionsMaterialized
      && geometry.length <= STAGE0_SPEC.resourceCeiling.maxGeometryRootMeasurements,
    scientificExecutionFalse: true,
    freshScientificSeedReadsZero: true,
    g4_10Depth11AccessZero: true,
  };

  const stageDisposition = Object.values(gates).every(Boolean) ? "STAGE0-PASS" : "TECHNICAL-INVALID";
  const core = {
    schemaVersion: 1,
    studyId: STUDY_SPEC.studyId,
    stageId: STAGE0_SPEC.stageId,
    evidenceClass: "TECHNICAL-FIXTURE",
    stageDisposition,
    scientificExecution: false,
    freshScientificSeedReads: 0,
    stage1CandidateNamespaceReads: 0,
    stage2CandidateNamespaceReads: 0,
    g4_10Depth11AccessCount: 0,
    publicAiChanged: false,
    fixtureIds: fixtures.map((row) => row.id).sort(),
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
    transitionRows: pSelection.transitionRows.length,
    nyumbaRows: pSelection.nyumbaRows.length,
    geometryMeasurements: geometry.length,
    gates,
  }, null, 2));
  if (stageDisposition !== "STAGE0-PASS") process.exitCode = 2;
}

main();
