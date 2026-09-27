"use strict";

const V = require("./lgtgmiv-stage1-independent.js");

const STUDY_ID = "BRSGT-STUDY1";
const HORIZON = 5;
const EVENT_IDS = {
  capture: "BRSGT-E1-CAPTURE",
  nyumba: "BRSGT-E2-NYUMBA-USE-VS-STOP",
  reserve: "BRSGT-E3-RESERVE-DECREMENT-NONTRANSITION",
  phase: "BRSGT-E4-NAMUA-TO-MTAJI",
};
const METRICS = [
  "BRSGT-M1-ROOT-LEGAL-WIDTH",
  "BRSGT-M2-CUMULATIVE-TREE-OCCURRENCE",
  "BRSGT-M3-GLOBAL-DISTINCT-RAW-STATES",
  "BRSGT-M4-DUPLICATE-TRANSITION-FRACTION",
  "BRSGT-M5-CUMULATIVE-TREE-RAW-RATIO",
  "BRSGT-M6-UNIT-WIDTH-OCCUPANCY-FRACTION",
];

function assertOk(value, message) { if (!value) throw new Error(message); }
function copy(value) { return JSON.parse(JSON.stringify(value)); }
function magnitude(value) { return value < 0n ? -value : value; }
function divisor(a, b) {
  a = magnitude(BigInt(a));
  b = magnitude(BigInt(b));
  for (; b !== 0n; ) { const r = a % b; a = b; b = r; }
  return a === 0n ? 1n : a;
}
function rational(numerator, denominator = 1n) {
  let n = BigInt(numerator), d = BigInt(denominator);
  if (d === 0n) return { numerator: String(n), denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = divisor(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function normalized(value) {
  if (value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "defined")) {
    if (!value.defined) return { numerator: String(value.numerator || 0), denominator: String(value.denominator || 0), defined: false };
    return rational(value.numerator, value.denominator);
  }
  return rational(value);
}
function difference(left, right) {
  const a = normalized(left), b = normalized(right);
  if (!a.defined || !b.defined) return { numerator: "0", denominator: "0", defined: false };
  return rational(
    BigInt(a.numerator) * BigInt(b.denominator) - BigInt(b.numerator) * BigInt(a.denominator),
    BigInt(a.denominator) * BigInt(b.denominator),
  );
}
function endpoints(measurement) {
  const core = measurement.reconstructionCore;
  assertOk(core && core.targetDepth === 5, "BRSGT independent requires relative depth 5");
  const layers = core.layers || [];
  const parents = core.parentLayers || [];
  assertOk(layers.length === 6 && parents.length === 5, "BRSGT independent layer shape mismatch");
  let tree = 0n, duplicate = 0n, transitions = 0n, unit = 0n, nonterminal = 0n;
  for (const layer of layers) {
    tree += BigInt(layer.treeNodeOccurrences || 0);
    unit += BigInt(layer.unitWidthStateCount || 0);
    for (const [width, count] of Object.entries(layer.replyWidthHistogram || {})) {
      if (BigInt(width) > 0n) nonterminal += BigInt(count);
    }
  }
  for (const parent of parents) {
    duplicate += BigInt(parent.duplicateEncounterCount || 0);
    transitions += BigInt(parent.uniqueTransitionCount || 0);
  }
  const raw = BigInt(core.cumulative.distinctRawStates);
  const values = {};
  values[METRICS[0]] = rational(core.rootLegalMoveCount);
  values[METRICS[1]] = rational(tree);
  values[METRICS[2]] = rational(raw);
  values[METRICS[3]] = rational(duplicate, transitions);
  values[METRICS[4]] = rational(tree, raw);
  values[METRICS[5]] = rational(unit, nonterminal);
  return {
    values,
    primitiveTotals: {
      treeNodeOccurrences: String(tree),
      distinctRawStates: String(raw),
      duplicateEncounterCount: String(duplicate),
      uniqueTransitionCount: String(transitions),
      unitWidthStateCount: String(unit),
      positiveReplyWidthStatePresence: String(nonterminal),
    },
  };
}
function technicalSource(state, id) {
  return {
    phase: state.phase,
    sourceSeed: null,
    selectedPly: null,
    rootRawSha256: V.stateKey(state),
    sourceTrajectorySha256: V.digest("BRSGT-TECHNICAL:" + id),
    openingPrefixSha256: V.digest("BRSGT-TECHNICAL-PREFIX:" + id),
    openingPrefixLength: 0,
    rootState: copy(state),
  };
}
function measureState(E, state, id) {
  const measured = V.measureRoot(E, technicalSource(state, id), 5);
  return {
    rootRawSha256: V.stateKey(state),
    reconstructionCoreSha256: measured.rootReconstructionCoreSha256,
    familyCoreSha256: measured.rootFamilyCoreSha256,
    endpoint: endpoints(measured),
  };
}
function orderedMoves(E, state) {
  if (state.winner !== null) return [];
  const out = [];
  for (const move of E.moveVariants(state)) out.push({ move, key: V.moveKey(move) });
  out.sort((a, b) => a.key.localeCompare(b.key));
  return out;
}
function physicalKey(move) {
  const stripped = {};
  for (const key of Object.keys(move)) if (key !== "houseChoice") stripped[key] = copy(move[key]);
  return V.moveKey(stripped);
}
function complete(E, state, move) {
  const result = E.applyMove(state, move);
  return { pre: copy(state), move: copy(move), post: copy(result.state), events: copy(result.events || []) };
}
function labelsFor(transition) {
  const predicates = [
    [transition.move.type === "capture", EVENT_IDS.capture],
    [transition.pre.phase === "namua"
      && transition.post.phase === "namua"
      && transition.pre.reserve[transition.pre.player] - transition.post.reserve[transition.pre.player] === 1, EVENT_IDS.reserve],
    [transition.pre.phase === "namua" && transition.post.phase === "mtaji", EVENT_IDS.phase],
  ];
  return predicates.filter((row) => row[0]).map((row) => row[1]).sort();
}
function nyumbaPairs(E, state) {
  const variants = orderedMoves(E, state)
    .filter((row) => row.move.phase === "namua" && row.move.type === "capture" && row.move.houseChoice)
    .map((row) => ({ ...row, physical: physicalKey(row.move) }));
  const keys = [...new Set(variants.map((row) => row.physical))].sort();
  const pairs = [];
  for (const key of keys) {
    const samePhysical = variants.filter((row) => row.physical === key);
    const stopRow = samePhysical.find((row) => row.move.houseChoice === "stop");
    const useRow = samePhysical.find((row) => row.move.houseChoice === "use");
    if (!stopRow || !useRow) continue;
    const stop = complete(E, state, stopRow.move);
    const use = complete(E, state, useRow.move);
    const mover = state.player;
    const postDifferent = V.stateKey(stop.post) !== V.stateKey(use.post);
    const ownershipContract = state.houseOwned[mover] === true
      && stop.post.houseOwned[mover] === true
      && use.post.houseOwned[mover] === false;
    if (postDifferent && ownershipContract) pairs.push({ physicalMoveKey: key, stop, use });
  }
  return pairs;
}
function disposition(transition) {
  if (transition.post && transition.post.reason === "relay-limit") return "EXCLUDED-RELAY-LIMIT";
  return transition.post && transition.post.winner !== null ? "INCLUDED-TERMINAL-TRANSITION" : "INCLUDED-TRANSITION";
}
function selectionCore(E, fixtures) {
  const transitionRows = [];
  const nyumbaRows = [];
  const orderedFixtures = fixtures.slice().sort((a, b) => a.id.localeCompare(b.id));
  for (const fixture of orderedFixtures) {
    const moves = orderedMoves(E, fixture.state);
    assertOk(transitionRows.length + moves.length <= 128, "BRSGT Stage 0 transition ceiling exceeded");
    let ordinal = 0;
    for (const row of moves) {
      const transition = complete(E, fixture.state, row.move);
      const labels = labelsFor(transition);
      transitionRows.push({
        fixtureId: fixture.id,
        eventLabels: labels,
        preRawSha256: V.stateKey(transition.pre),
        moveKey: row.key,
        postRawSha256: V.stateKey(transition.post),
        disposition: disposition(transition),
        nyumbaPhysicalMoveKey: null,
        nyumbaStopMoveKey: null,
        nyumbaUseMoveKey: null,
        compoundLabelVector: labels.slice(),
        canonicalOrder: "T:" + fixture.id + ":" + String(ordinal).padStart(4, "0"),
      });
      ordinal += 1;
    }
    let pairOrdinal = 0;
    for (const pair of nyumbaPairs(E, fixture.state)) {
      nyumbaRows.push({
        fixtureId: fixture.id,
        eventLabels: [EVENT_IDS.nyumba],
        preRawSha256: V.stateKey(fixture.state),
        moveKey: pair.physicalMoveKey,
        postRawSha256: null,
        disposition: "INCLUDED-NYUMBA-PAIR",
        nyumbaPhysicalMoveKey: pair.physicalMoveKey,
        nyumbaStopMoveKey: V.moveKey(pair.stop.move),
        nyumbaUseMoveKey: V.moveKey(pair.use.move),
        nyumbaStopPostRawSha256: V.stateKey(pair.stop.post),
        nyumbaUsePostRawSha256: V.stateKey(pair.use.post),
        compoundLabelVector: [EVENT_IDS.nyumba],
        canonicalOrder: "N:" + fixture.id + ":" + String(pairOrdinal).padStart(4, "0"),
      });
      pairOrdinal += 1;
    }
  }
  return { transitionRows, nyumbaRows };
}
function delta(postMeasurement, preMeasurement) {
  const result = {};
  for (const metric of METRICS) result[metric] = difference(postMeasurement.endpoint.values[metric], preMeasurement.endpoint.values[metric]);
  return result;
}
function nyumbaContrast(useMeasurement, stopMeasurement) {
  const result = {};
  for (const metric of METRICS) result[metric] = difference(useMeasurement.endpoint.values[metric], stopMeasurement.endpoint.values[metric]);
  return result;
}

module.exports = {
  STUDY_ID,
  HORIZON,
  EVENTS: [EVENT_IDS.capture, EVENT_IDS.nyumba, EVENT_IDS.reserve, EVENT_IDS.phase],
  METRICS,
  fraction: rational,
  subtract: difference,
  deriveEndpoints: endpoints,
  technicalSource,
  measureState,
  canonicalMoves: orderedMoves,
  physicalMoveKey: physicalKey,
  applyComplete: complete,
  eventLabels: labelsFor,
  nyumbaPairs,
  selectionCore,
  delta,
  nyumbaContrast,
  canonical: V.canonical,
  digest: V.digest,
  stateKey: V.stateKey,
  moveKey: V.moveKey,
};
