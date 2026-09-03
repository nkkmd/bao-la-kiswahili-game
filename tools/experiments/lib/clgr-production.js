"use strict";

const U = require("./lgtgmiv-stage1-production.js");

const STUDY_ID = "CLGR-STUDY1";
const HORIZON = 5;
const REPRESENTATION_ID = "CLGR-R1-EXACT-SQUASHED-L1";
const AXES = [
  "CLGR-A1-ROOT-LEGAL-WIDTH",
  "CLGR-A2-CUMULATIVE-TREE-OCCURRENCE",
  "CLGR-A3-CUMULATIVE-DISTINCT-RAW-STATES",
  "CLGR-A4-CUMULATIVE-TREE-RAW-RATIO",
  "CLGR-A5-DUPLICATE-TRANSITION-FRACTION",
  "CLGR-A6-UNIT-WIDTH-OCCUPANCY-FRACTION"
];

function need(x, m) { if (!x) throw new Error(m); }
function abs(x) { return x < 0n ? -x : x; }
function gcd(a, b) { a = abs(BigInt(a)); b = abs(BigInt(b)); while (b) [a, b] = [b, a % b]; return a; }
function rational(n, d = 1n) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function requireDefined(q, label) { need(q && q.defined, `${label} undefined`); need(BigInt(q.denominator) > 0n, `${label} denominator invalid`); return q; }
function add(a, b) { requireDefined(a, "left"); requireDefined(b, "right"); return rational(BigInt(a.numerator) * BigInt(b.denominator) + BigInt(b.numerator) * BigInt(a.denominator), BigInt(a.denominator) * BigInt(b.denominator)); }
function subtract(a, b) { requireDefined(a, "left"); requireDefined(b, "right"); return rational(BigInt(a.numerator) * BigInt(b.denominator) - BigInt(b.numerator) * BigInt(a.denominator), BigInt(a.denominator) * BigInt(b.denominator)); }
function absolute(a) { requireDefined(a, "value"); return rational(abs(BigInt(a.numerator)), BigInt(a.denominator)); }
function compare(a, b) { requireDefined(a, "left"); requireDefined(b, "right"); const x = BigInt(a.numerator) * BigInt(b.denominator), y = BigInt(b.numerator) * BigInt(a.denominator); return x < y ? -1 : x > y ? 1 : 0; }
function squash(q) { requireDefined(q, "axis"); const n = BigInt(q.numerator), d = BigInt(q.denominator); need(n >= 0n, "negative geometry axis"); return rational(n, n + d); }
function sumBig(rows, field) { return rows.reduce((a, x) => a + BigInt(x[field]), 0n); }
function positiveReplyPresence(layers) {
  let n = 0n;
  for (const row of layers) for (const [width, count] of Object.entries(row.replyWidthHistogram || {})) if (BigInt(width) > 0n) n += BigInt(count);
  return n;
}
function deriveAxes(measurement) {
  need(measurement && measurement.reconstructionCore, "measurement reconstructionCore required");
  const r = measurement.reconstructionCore;
  need(r.targetDepth === HORIZON, "CLGR requires relative depth 5");
  need(r.representation && r.representation.mode === "RAW-ONLY", "RAW-only representation required");
  need(Array.isArray(r.representation.validatedTransformSet) && r.representation.validatedTransformSet.length === 0, "validated transform set must be empty");
  need(Array.isArray(r.layers) && r.layers.length === 6, "six depth layers required");
  need(Array.isArray(r.parentLayers) && r.parentLayers.length === 5, "five parent layers required");
  const tree = sumBig(r.layers, "treeNodeOccurrences");
  const distinct = BigInt(r.cumulative.distinctRawStates);
  const dup = sumBig(r.parentLayers, "duplicateEncounterCount");
  const transitions = sumBig(r.parentLayers, "uniqueTransitionCount");
  const unit = sumBig(r.layers, "unitWidthStateCount");
  const nonterminalPresence = positiveReplyPresence(r.layers);
  const axes = {
    [AXES[0]]: rational(BigInt(r.rootLegalMoveCount), 1n),
    [AXES[1]]: rational(tree, 1n),
    [AXES[2]]: rational(distinct, 1n),
    [AXES[3]]: rational(tree, distinct),
    [AXES[4]]: rational(dup, transitions),
    [AXES[5]]: rational(unit, nonterminalPresence)
  };
  for (const id of AXES) requireDefined(axes[id], id);
  return { rootRawSha256: r.rootRawSha256, axes, rawPrimitives: { rootLegalMoveCount: String(r.rootLegalMoveCount), treeNodeOccurrencesDepth0To5: String(tree), distinctRawStatesDepth0To5: String(distinct), duplicateEncounterCountDepth0To4: String(dup), uniqueTransitionCountDepth0To4: String(transitions), unitWidthStatePresenceDepth0To5: String(unit), nonterminalRawStatePresenceDepth0To5: String(nonterminalPresence) } };
}
function represent(derived) {
  need(derived && derived.axes, "derived axes required");
  const coordinates = {};
  for (const id of AXES) coordinates[id] = squash(derived.axes[id]);
  return { representationId: REPRESENTATION_ID, rootRawSha256: derived.rootRawSha256, coordinates };
}
function distance(a, b) {
  need(a && b && a.coordinates && b.coordinates, "representations required");
  let total = rational(0n, 1n);
  for (const id of AXES) total = add(total, absolute(subtract(a.coordinates[id], b.coordinates[id])));
  return total;
}
function distanceRows(representations) {
  const rows = [];
  const xs = [...representations].sort((a,b) => a.rootRawSha256.localeCompare(b.rootRawSha256));
  for (let i=0;i<xs.length;i++) for (let j=i+1;j<xs.length;j++) rows.push({ rootA: xs[i].rootRawSha256, rootB: xs[j].rootRawSha256, distance: distance(xs[i], xs[j]) });
  return rows;
}
function neighbors(representations, k = 3) {
  need(Number.isInteger(k) && k >= 1, "k invalid");
  const xs = [...representations].sort((a,b) => a.rootRawSha256.localeCompare(b.rootRawSha256));
  need(xs.length > k, "insufficient roots for neighborhood");
  const out = [];
  for (const x of xs) {
    const ds = xs.filter(y => y.rootRawSha256 !== x.rootRawSha256).map(y => ({ rootRawSha256: y.rootRawSha256, distance: distance(x,y) }));
    ds.sort((a,b) => compare(a.distance,b.distance) || a.rootRawSha256.localeCompare(b.rootRawSha256));
    const cutoff = ds[k-1].distance;
    out.push({ rootRawSha256: x.rootRawSha256, cutoff, neighbors: ds.filter(r => compare(r.distance, cutoff) <= 0).map(r => r.rootRawSha256).sort() });
  }
  return out;
}
function resourceView(measurement) {
  const r = measurement.reconstructionCore;
  const transitions = sumBig(r.parentLayers, "uniqueTransitionCount");
  const parents = r.layers.slice(0,5).reduce((a,x) => a + BigInt(x.uniqueRawStateCount), 0n);
  const tree = sumBig(r.layers, "treeNodeOccurrences");
  return { distinctRawStates: String(r.cumulative.distinctRawStates), uniqueTransitions: String(transitions), parentExpansions: String(parents), treeNodeOccurrences: String(tree) };
}
function measureRoot(engine, source) {
  const upstream = U.measureRoot(engine, source, HORIZON);
  const derived = deriveAxes(upstream);
  return { source: upstream.source, upstreamRootReconstructionCoreSha256: upstream.rootReconstructionCoreSha256, upstreamFamilyCoreSha256: upstream.rootFamilyCoreSha256, resourceView: resourceView(upstream), axes: derived.axes, rawPrimitives: derived.rawPrimitives, representation: represent(derived) };
}

module.exports = { STUDY_ID, HORIZON, REPRESENTATION_ID, AXES, upstreamImplementation: "LGTGMIV-PRODUCTION", rational, add, subtract, absolute, compare, squash, deriveAxes, represent, distance, distanceRows, neighbors, measureRoot, canonical: U.canonical, digest: U.digest, stateKey: U.stateKey, moveKey: U.moveKey };
