"use strict";

const crypto = require("node:crypto");
const U = require("./lgtgmiv-stage1-production.js");
const Search = require("./search-reliability-decision-robustness.js");

const HORIZON = 5;
const GEOMETRY_IDS = [
  "SILGM-G1-ROOT-LEGAL-WIDTH",
  "SILGM-G2-CUMULATIVE-TREE-OCCURRENCE",
  "SILGM-G3-DUPLICATE-TRANSITION-FRACTION",
  "SILGM-G4-CUMULATIVE-TREE-RAW-RATIO",
  "SILGM-G5-UNIT-WIDTH-OCCUPANCY-FRACTION",
];
const ENDPOINT_IDS = [
  "SILGM-E1-CANONICAL-BEST-CHANGE",
  "SILGM-E2-TOPSET-CHANGE",
  "SILGM-E3-RANKING-PREORDER-CHANGE",
  "SILGM-E4-BEST-SECOND-GAP-CHANGE",
  "SILGM-E5-PV-PREFIX2-CHANGE",
];

function need(x, m) { if (!x) throw new Error(m); }
function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; }
function fraction(n, d) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function cmpQ(a, b) {
  need(a && b && a.defined && b.defined, "defined rational required");
  const x = BigInt(a.numerator) * BigInt(b.denominator);
  const y = BigInt(b.numerator) * BigInt(a.denominator);
  return x < y ? -1 : x > y ? 1 : 0;
}
function addQ(a, b) { return fraction(BigInt(a.numerator) * BigInt(b.denominator) + BigInt(b.numerator) * BigInt(a.denominator), BigInt(a.denominator) * BigInt(b.denominator)); }
function subQ(a, b) { return fraction(BigInt(a.numerator) * BigInt(b.denominator) - BigInt(b.numerator) * BigInt(a.denominator), BigInt(a.denominator) * BigInt(b.denominator)); }
function absQ(a) { return fraction(BigInt(a.numerator) < 0n ? -BigInt(a.numerator) : BigInt(a.numerator), BigInt(a.denominator)); }
function stable(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`;
}
function digest(v) { return crypto.createHash("sha256").update(stable(v), "utf8").digest("hex"); }
function sum(rows, field) { return rows.reduce((a, x) => a + BigInt(x[field]), 0n); }
function positiveReplyPresence(layers) {
  let n = 0n;
  for (const row of layers) for (const [w, c] of Object.entries(row.replyWidthHistogram || {})) if (BigInt(w) > 0n) n += BigInt(c);
  return n;
}
function deriveGeometry(measurement) {
  need(measurement && measurement.reconstructionCore, "reconstructionCore required");
  const r = measurement.reconstructionCore;
  need(r.targetDepth === HORIZON, "relative depth 5 required");
  need(r.representation && r.representation.mode === "RAW-ONLY", "RAW-only required");
  need(Array.isArray(r.representation.validatedTransformSet) && r.representation.validatedTransformSet.length === 0, "transforms must be empty");
  need(r.layers.length === 6 && r.parentLayers.length === 5, "complete depth-5 reconstruction required");
  const tree = sum(r.layers, "treeNodeOccurrences");
  const dup = sum(r.parentLayers, "duplicateEncounterCount");
  const uniqueTransitions = r.parentLayers.reduce((a, x) => a + BigInt(x.uniqueTransitionCount), 0n);
  const unit = sum(r.layers, "unitWidthStateCount");
  const positive = positiveReplyPresence(r.layers);
  const distinct = BigInt(r.cumulative.distinctRawStates);
  return {
    rootRawSha256: r.rootRawSha256,
    metrics: {
      "SILGM-G1-ROOT-LEGAL-WIDTH": fraction(BigInt(r.rootLegalMoveCount), 1n),
      "SILGM-G2-CUMULATIVE-TREE-OCCURRENCE": fraction(tree, 1n),
      "SILGM-G3-DUPLICATE-TRANSITION-FRACTION": fraction(dup, uniqueTransitions),
      "SILGM-G4-CUMULATIVE-TREE-RAW-RATIO": fraction(tree, distinct),
      "SILGM-G5-UNIT-WIDTH-OCCUPANCY-FRACTION": fraction(unit, positive),
    },
    upstreamRootReconstructionCoreSha256: measurement.rootReconstructionCoreSha256,
    upstreamFamilyCoreSha256: measurement.rootFamilyCoreSha256,
  };
}
function sourceFor(state, seed = 31709001, ply = 24) {
  return {
    phase: state.phase,
    sourceSeed: seed,
    selectedPly: ply,
    rootRawSha256: U.stateKey(state),
    sourceTrajectorySha256: digest({ technical: true, seed, ply }),
    openingPrefixSha256: digest({ technicalPrefix: true, seed, ply }),
    openingPrefixLength: 0,
    rootState: JSON.parse(JSON.stringify(state)),
  };
}
function measureGeometry(E, state, seed, ply) { return deriveGeometry(U.measureRoot(E, sourceFor(state, seed, ply), HORIZON)); }
function conditionResult(state, condition) {
  const opts = { evaluationProfile: "bao", legalMoveOrdering: "canonical", quiescenceDepth: condition.quiescenceDepth, orderQuiescenceCaptures: false };
  const raw = condition.kind === "exact-depth"
    ? Search.analyzeExactCondition(state, condition.depth, opts)
    : Search.analyzeBudgetCondition(state, condition.maxDepth, condition.nodeBudget, opts);
  if (condition.kind === "node-budget" && !raw.estimable) return { estimable: false, completedDepth: 0 };
  const result = raw.result;
  need(result && result.candidates && result.candidates.length >= 2, "complete root ranking required");
  for (const c of result.candidates) need(Number.isSafeInteger(c.score), "unsafe/noninteger score");
  need(Number.isSafeInteger(result.bestScore), "unsafe best score");
  need(result.secondBestScore === null || Number.isSafeInteger(result.secondBestScore), "unsafe second score");
  need(result.bestSecondGap === null || Number.isSafeInteger(result.bestSecondGap), "unsafe gap");
  return {
    estimable: true,
    completedDepth: raw.completedDepth,
    canonicalBestMoveKey: result.canonicalBestMoveKey,
    topSetMoveKeys: result.topSetMoveKeys.slice().sort(),
    bestScore: result.bestScore,
    secondBestScore: result.secondBestScore,
    bestSecondGap: result.bestSecondGap,
    ranking: result.candidates.map(c => ({ moveKey: c.moveKey, score: c.score })).sort((a, b) => a.moveKey.localeCompare(b.moveKey)),
    pvMoveKeys: raw.principalVariation ? raw.principalVariation.moveKeys.slice() : [],
  };
}
function relation(a, b) { return a < b ? -1 : a > b ? 1 : 0; }
function rankingPreorderChanged(a, b) {
  const A = new Map(a.ranking.map(x => [x.moveKey, x.score]));
  const B = new Map(b.ranking.map(x => [x.moveKey, x.score]));
  need(A.size === B.size && [...A.keys()].every(k => B.has(k)), "legal move universe differs");
  const keys = [...A.keys()].sort();
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    if (relation(A.get(keys[i]), A.get(keys[j])) !== relation(B.get(keys[i]), B.get(keys[j]))) return 1;
  }
  return 0;
}
function pvPrefix2(x) {
  const a = x.pvMoveKeys.slice(0, 2);
  while (a.length < 2) a.push("<TERMINATED>");
  return a;
}
function endpoints(a, b) {
  need(a.estimable && b.estimable, "both conditions must be estimable");
  const A = JSON.stringify(a.topSetMoveKeys), B = JSON.stringify(b.topSetMoveKeys);
  return {
    "SILGM-E1-CANONICAL-BEST-CHANGE": Number(a.canonicalBestMoveKey !== b.canonicalBestMoveKey),
    "SILGM-E2-TOPSET-CHANGE": Number(A !== B),
    "SILGM-E3-RANKING-PREORDER-CHANGE": rankingPreorderChanged(a, b),
    "SILGM-E4-BEST-SECOND-GAP-CHANGE": Number(a.bestSecondGap !== b.bestSecondGap),
    "SILGM-E5-PV-PREFIX2-CHANGE": Number(JSON.stringify(pvPrefix2(a)) !== JSON.stringify(pvPrefix2(b))),
  };
}
function riskDifference(rows, metricId, threshold, endpointId) {
  const groups = { high: [], low: [] };
  for (const r of rows) {
    const c = cmpQ(r.geometry[metricId], threshold);
    if (c > 0) groups.high.push(r.endpoints[endpointId]); else if (c < 0) groups.low.push(r.endpoints[endpointId]);
  }
  if (!groups.high.length || !groups.low.length) return { defined: false };
  const h = groups.high.reduce((a, x) => a + BigInt(x), 0n), l = groups.low.reduce((a, x) => a + BigInt(x), 0n);
  return { defined: true, highN: groups.high.length, lowN: groups.low.length, highChanged: Number(h), lowChanged: Number(l), value: subQ(fraction(h, BigInt(groups.high.length)), fraction(l, BigInt(groups.low.length))) };
}
function midpoint(values) {
  need(values.length > 1, "at least two values required");
  const a = values.slice().sort(cmpQ), n = a.length;
  return n % 2 ? a[(n - 1) / 2] : fraction(BigInt(a[n / 2 - 1].numerator) * BigInt(a[n / 2].denominator) + BigInt(a[n / 2].numerator) * BigInt(a[n / 2 - 1].denominator), 2n * BigInt(a[n / 2 - 1].denominator) * BigInt(a[n / 2].denominator));
}
function choose(n, k) { n = BigInt(n); k = BigInt(k); if (k < 0n || k > n) return 0n; if (k > n - k) k = n - k; let x = 1n; for (let i = 1n; i <= k; i++) x = x * (n - k + i) / i; return x; }
function hypergeom(N, K, n) {
  N = BigInt(N); K = BigInt(K); n = BigInt(n); const den = choose(N, n), out = [];
  const lo = Number(n > N - K ? n - (N - K) : 0n), hi = Number(n < K ? n : K);
  for (let x = lo; x <= hi; x++) out.push({ x, p: fraction(choose(K, BigInt(x)) * choose(N - K, n - BigInt(x)), den) });
  return out;
}
function convolve(a, b) {
  const m = new Map();
  for (const x of a) for (const y of b) {
    const k = x.x + y.x, old = m.get(k) || fraction(0n, 1n); m.set(k, addQ(old, fraction(BigInt(x.p.numerator) * BigInt(y.p.numerator), BigInt(x.p.denominator) * BigInt(y.p.denominator))));
  }
  return [...m].sort((x, y) => x[0] - y[0]).map(([x, p]) => ({ x, p }));
}
function exactStratifiedTail(strata, direction) {
  need(["HIGHER-IN-HIGH", "LOWER-IN-HIGH"].includes(direction), "direction required");
  let dist = [{ x: 0, p: fraction(1n, 1n) }], observed = 0;
  for (const s of strata) { observed += s.changedHigh; dist = convolve(dist, hypergeom(s.total, s.changedTotal, s.highN)); }
  let p = fraction(0n, 1n);
  for (const row of dist) if ((direction === "HIGHER-IN-HIGH" && row.x >= observed) || (direction === "LOWER-IN-HIGH" && row.x <= observed)) p = addQ(p, row.p);
  return { observed, distribution: dist, p };
}

module.exports = { GEOMETRY_IDS, ENDPOINT_IDS, fraction, cmpQ, addQ, subQ, absQ, stable, digest, deriveGeometry, measureGeometry, sourceFor, conditionResult, endpoints, midpoint, riskDifference, choose, hypergeom, convolve, exactStratifiedTail, stateKey: U.stateKey, moveKey: U.moveKey };
