"use strict";

const U = require("./lgtgmiv-stage1-production.js");

const STUDY_ID = "BRSGT-STUDY1";
const HORIZON = 5;
const EVENTS = [
  "BRSGT-E1-CAPTURE",
  "BRSGT-E2-NYUMBA-USE-VS-STOP",
  "BRSGT-E3-RESERVE-DECREMENT-NONTRANSITION",
  "BRSGT-E4-NAMUA-TO-MTAJI",
];
const METRICS = [
  "BRSGT-M1-ROOT-LEGAL-WIDTH",
  "BRSGT-M2-CUMULATIVE-TREE-OCCURRENCE",
  "BRSGT-M3-GLOBAL-DISTINCT-RAW-STATES",
  "BRSGT-M4-DUPLICATE-TRANSITION-FRACTION",
  "BRSGT-M5-CUMULATIVE-TREE-RAW-RATIO",
  "BRSGT-M6-UNIT-WIDTH-OCCUPANCY-FRACTION",
];

function need(value, message) { if (!value) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function absBig(value) { return value < 0n ? -value : value; }
function gcd(a, b) {
  a = absBig(BigInt(a));
  b = absBig(BigInt(b));
  while (b !== 0n) { const t = a % b; a = b; b = t; }
  return a === 0n ? 1n : a;
}
function fraction(numerator, denominator = 1n) {
  let n = BigInt(numerator), d = BigInt(denominator);
  if (d === 0n) return { numerator: String(n), denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function asFraction(value) {
  if (value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "defined")) {
    return value.defined ? fraction(value.numerator, value.denominator)
      : { numerator: String(value.numerator || 0), denominator: String(value.denominator || 0), defined: false };
  }
  return fraction(value, 1n);
}
function subtract(a, b) {
  const x = asFraction(a), y = asFraction(b);
  if (!x.defined || !y.defined) return { numerator: "0", denominator: "0", defined: false };
  return fraction(
    BigInt(x.numerator) * BigInt(y.denominator) - BigInt(y.numerator) * BigInt(x.denominator),
    BigInt(x.denominator) * BigInt(y.denominator),
  );
}
function sumBig(rows, field) { return rows.reduce((sum, row) => sum + BigInt(row[field] || 0), 0n); }
function positiveHistogramCount(histogram) {
  let count = 0n;
  for (const [width, value] of Object.entries(histogram || {})) {
    if (BigInt(width) > 0n) count += BigInt(value);
  }
  return count;
}
function deriveEndpoints(measurement) {
  const c = measurement.reconstructionCore;
  need(c && c.targetDepth === HORIZON, "BRSGT production requires relative depth 5");
  const layers = c.layers || [], parents = c.parentLayers || [];
  need(layers.length === 6 && parents.length === 5, "BRSGT production unexpected layer count");
  const tree = sumBig(layers, "treeNodeOccurrences");
  const raw = BigInt(c.cumulative.distinctRawStates);
  const duplicate = sumBig(parents, "duplicateEncounterCount");
  const transitions = sumBig(parents, "uniqueTransitionCount");
  const unit = layers.reduce((sum, row) => sum + BigInt(row.unitWidthStateCount || 0), 0n);
  const nonterminal = layers.reduce((sum, row) => sum + positiveHistogramCount(row.replyWidthHistogram), 0n);
  const values = {};
  values[METRICS[0]] = fraction(c.rootLegalMoveCount);
  values[METRICS[1]] = fraction(tree);
  values[METRICS[2]] = fraction(raw);
  values[METRICS[3]] = fraction(duplicate, transitions);
  values[METRICS[4]] = fraction(tree, raw);
  values[METRICS[5]] = fraction(unit, nonterminal);
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
    rootRawSha256: U.stateKey(state),
    sourceTrajectorySha256: U.digest(`BRSGT-TECHNICAL:${id}`),
    openingPrefixSha256: U.digest(`BRSGT-TECHNICAL-PREFIX:${id}`),
    openingPrefixLength: 0,
    rootState: clone(state),
  };
}
function measureState(E, state, id) {
  const upstream = U.measureRoot(E, technicalSource(state, id), HORIZON);
  return {
    rootRawSha256: U.stateKey(state),
    reconstructionCoreSha256: upstream.rootReconstructionCoreSha256,
    familyCoreSha256: upstream.rootFamilyCoreSha256,
    endpoint: deriveEndpoints(upstream),
  };
}
function canonicalMoves(E, state) {
  if (state.winner !== null) return [];
  return E.moveVariants(state)
    .map((move) => ({ move, key: U.moveKey(move) }))
    .sort((a, b) => a.key.localeCompare(b.key));
}
function physicalMoveKey(move) {
  const copy = clone(move);
  delete copy.houseChoice;
  return U.moveKey(copy);
}
function applyComplete(E, state, move) {
  const pre = clone(state);
  const out = E.applyMove(state, move);
  return { pre, move: clone(move), post: clone(out.state), events: clone(out.events || []) };
}
function eventLabels(transition) {
  const labels = [];
  const { pre, move, post } = transition;
  const mover = pre.player;
  if (move.type === "capture") labels.push(EVENTS[0]);
  if (pre.phase === "namua" && post.phase === "namua"
      && pre.reserve[mover] - post.reserve[mover] === 1) labels.push(EVENTS[2]);
  if (pre.phase === "namua" && post.phase === "mtaji") labels.push(EVENTS[3]);
  return labels.sort();
}
function nyumbaPairs(E, state) {
  const groups = new Map();
  for (const row of canonicalMoves(E, state)) {
    if (row.move.phase !== "namua" || row.move.type !== "capture" || !row.move.houseChoice) continue;
    const key = physicalMoveKey(row.move);
    if (!groups.has(key)) groups.set(key, {});
    groups.get(key)[row.move.houseChoice] = row.move;
  }
  const pairs = [];
  for (const [key, group] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (!group.stop || !group.use) continue;
    const stop = applyComplete(E, state, group.stop);
    const use = applyComplete(E, state, group.use);
    const mover = state.player;
    if (U.stateKey(stop.post) === U.stateKey(use.post)) continue;
    if (!(state.houseOwned[mover] === true
      && stop.post.houseOwned[mover] === true
      && use.post.houseOwned[mover] === false)) continue;
    pairs.push({ physicalMoveKey: key, stop, use });
  }
  return pairs;
}
function transitionDisposition(transition) {
  if (transition.post && transition.post.reason === "relay-limit") return "EXCLUDED-RELAY-LIMIT";
  if (transition.post && transition.post.winner !== null) return "INCLUDED-TERMINAL-TRANSITION";
  return "INCLUDED-TRANSITION";
}
function selectionCore(E, fixtures) {
  const transitionRows = [];
  const nyumbaRows = [];
  for (const fixture of [...fixtures].sort((a, b) => a.id.localeCompare(b.id))) {
    const moves = canonicalMoves(E, fixture.state);
    need(transitionRows.length + moves.length <= 128, "BRSGT Stage 0 transition ceiling exceeded");
    moves.forEach((row, index) => {
      const t = applyComplete(E, fixture.state, row.move);
      const labels = eventLabels(t);
      transitionRows.push({
        fixtureId: fixture.id,
        eventLabels: labels,
        preRawSha256: U.stateKey(t.pre),
        moveKey: row.key,
        postRawSha256: U.stateKey(t.post),
        disposition: transitionDisposition(t),
        nyumbaPhysicalMoveKey: null,
        nyumbaStopMoveKey: null,
        nyumbaUseMoveKey: null,
        compoundLabelVector: labels,
        canonicalOrder: `T:${fixture.id}:${String(index).padStart(4, "0")}`,
      });
    });
    nyumbaPairs(E, fixture.state).forEach((pair, index) => {
      nyumbaRows.push({
        fixtureId: fixture.id,
        eventLabels: [EVENTS[1]],
        preRawSha256: U.stateKey(fixture.state),
        moveKey: pair.physicalMoveKey,
        postRawSha256: null,
        disposition: "INCLUDED-NYUMBA-PAIR",
        nyumbaPhysicalMoveKey: pair.physicalMoveKey,
        nyumbaStopMoveKey: U.moveKey(pair.stop.move),
        nyumbaUseMoveKey: U.moveKey(pair.use.move),
        nyumbaStopPostRawSha256: U.stateKey(pair.stop.post),
        nyumbaUsePostRawSha256: U.stateKey(pair.use.post),
        compoundLabelVector: [EVENTS[1]],
        canonicalOrder: `N:${fixture.id}:${String(index).padStart(4, "0")}`,
      });
    });
  }
  return { transitionRows, nyumbaRows };
}
function delta(postMeasurement, preMeasurement) {
  const out = {};
  for (const id of METRICS) out[id] = subtract(postMeasurement.endpoint.values[id], preMeasurement.endpoint.values[id]);
  return out;
}
function nyumbaContrast(useMeasurement, stopMeasurement) {
  const out = {};
  for (const id of METRICS) out[id] = subtract(useMeasurement.endpoint.values[id], stopMeasurement.endpoint.values[id]);
  return out;
}

module.exports = {
  STUDY_ID, HORIZON, EVENTS, METRICS,
  fraction, subtract, deriveEndpoints, technicalSource, measureState,
  canonicalMoves, physicalMoveKey, applyComplete, eventLabels, nyumbaPairs,
  selectionCore, delta, nyumbaContrast,
  canonical: U.canonical, digest: U.digest, stateKey: U.stateKey, moveKey: U.moveKey,
};
