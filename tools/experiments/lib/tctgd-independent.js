"use strict";

const V = require("./lgtgmiv-stage1-independent.js");

const DEPTH = 5;
const IDS = Object.freeze([
  "TCTGD-C1-CUMULATIVE-TREE-RAW-RATIO",
  "TCTGD-C2-DUPLICATE-UNIQUE-TRANSITION-FRACTION",
  "TCTGD-C3-LAYER-SUM-MULTIPARENT-FRACTION",
  "TCTGD-C4-RECONVERGENCE-ONSET-SCORE",
  "TCTGD-C5-ROOT-BRANCH-OVERLAP-FRACTION"
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function abs(x) { return x < 0n ? -x : x; }

function divisor(a, b) {
  a = abs(a); b = abs(b);
  for (;;) {
    if (b === 0n) return a;
    const r = a % b;
    a = b; b = r;
  }
}

function rational(numerator, denominator) {
  let n = BigInt(numerator), d = BigInt(denominator);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { d = -d; n = -n; }
  const g = divisor(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}

function rationalDifference(x, y) {
  if (!(x && y && x.defined && y.defined)) return rational(0n, 0n);
  const xn = BigInt(x.numerator), xd = BigInt(x.denominator);
  const yn = BigInt(y.numerator), yd = BigInt(y.denominator);
  return rational(xn * yd - yn * xd, xd * yd);
}

function direction(q) {
  if (!q || !q.defined) return null;
  const z = BigInt(q.numerator);
  return z === 0n ? 0 : z > 0n ? 1 : -1;
}

function sum(rows, getter) {
  let total = 0n;
  for (const row of rows) total += BigInt(getter(row));
  return total;
}

function branchPairFraction(reconstruction) {
  const geometry = reconstruction.rootBranchGeometry;
  const labels = geometry.rootMoveLabels || [];
  const denominator = BigInt(labels.length * (labels.length - 1) / 2);
  if (denominator === 0n) return rational(0n, 0n);

  const hit = new Map();
  for (const layer of geometry.rootBranchPairOverlapByDepth || []) {
    if (layer.depth === 0 || layer.depth > DEPTH) continue;
    for (const item of layer.pairs || []) {
      const first = item.rootMoveA <= item.rootMoveB ? item.rootMoveA : item.rootMoveB;
      const second = item.rootMoveA <= item.rootMoveB ? item.rootMoveB : item.rootMoveA;
      const key = first + "\u0000" + second;
      const positive = item.overlap && item.overlap.defined && BigInt(item.overlap.numerator) > 0n;
      if (!hit.has(key)) hit.set(key, false);
      if (positive) hit.set(key, true);
    }
  }
  let numerator = 0n;
  for (const yes of hit.values()) if (yes) numerator++;
  return rational(numerator, denominator);
}

function project(measurement) {
  assert(measurement && measurement.reconstructionCore, "missing reconstruction core");
  const core = measurement.reconstructionCore;
  assert(core.targetDepth === DEPTH, "independent G3-03 depth mismatch");
  assert(core.representation && core.representation.mode === "RAW-ONLY", "independent RAW-only requirement failed");
  assert(Array.isArray(core.representation.validatedTransformSet) && core.representation.validatedTransformSet.length === 0, "independent transform-set requirement failed");
  assert(core.layers.length === 6 && core.parentLayers.length === 5, "independent complete layer requirement failed");

  const allTreeNodes = sum(core.layers, row => row.treeNodeOccurrences);
  const uniqueGlobalRaw = BigInt(core.cumulative.distinctRawStates);
  const depthLabelledRawStatePresences = sum(core.layers, row => row.uniqueRawStateCount);
  const crossDepthRawStateRevisitPresenceExcess = depthLabelledRawStatePresences - uniqueGlobalRaw;
  assert(crossDepthRawStateRevisitPresenceExcess >= 0n, "independent cross-depth RAW-state presence excess must be nonnegative");
  const duplicates = sum(core.parentLayers, row => row.duplicateEncounterCount);
  const transitionsByDepth = sum(core.parentLayers, row => row.uniqueTransitionCount);
  const multiParentByLayer = sum(core.parentLayers, row => row.multiParentRawStateCount);
  const statesWithoutRoot = sum(core.layers.slice(1), row => row.uniqueRawStateCount);
  const onset = core.firstReconvergenceDepth === null ? DEPTH + 1 : Number(core.firstReconvergenceDepth);

  const values = Object.create(null);
  values[IDS[0]] = rational(allTreeNodes, uniqueGlobalRaw);
  values[IDS[1]] = rational(duplicates, transitionsByDepth);
  values[IDS[2]] = rational(multiParentByLayer, statesWithoutRoot);
  values[IDS[3]] = rational(BigInt(onset), 1n);
  values[IDS[4]] = branchPairFraction(core);

  return {
    rootRawSha256: core.rootRawSha256,
    targetDepth: core.targetDepth,
    rawPrimitives: {
      rootIncludedInC1: true,
      rootExcludedFromC3Denominator: true,
      treeOccurrenceCountDepth0To5: String(allTreeNodes),
      distinctRawStatesDepth0To5: String(uniqueGlobalRaw),
      depthLabelledUniqueRawStatePresenceCountDepth0To5: String(depthLabelledRawStatePresences),
      crossDepthRawStateRevisitPresenceExcess: String(crossDepthRawStateRevisitPresenceExcess),
      duplicateEncounterCountParentDepth0To4: String(duplicates),
      depthLabelledUniqueTransitionCountParentDepth0To4: String(transitionsByDepth),
      multiParentRawStateCountLayerSumParentDepth0To4: String(multiParentByLayer),
      nonRootDepthLabelledUniqueRawStateCountDepth1To5: String(statesWithoutRoot),
      firstReconvergenceDepth: core.firstReconvergenceDepth === null ? null : Number(core.firstReconvergenceDepth),
      layerReconvergentRawStateCount: core.layers.map(row => ({ depth: row.depth, count: row.reconvergentRawStateCount })),
      arrivalMultiplicityHistogramByParentDepth: core.parentLayers.map(row => ({ depth: row.depth, histogram: row.arrivalMultiplicityHistogram })),
      parentMultiplicityHistogramByParentDepth: core.parentLayers.map(row => ({ depth: row.depth, histogram: row.parentMultiplicityHistogram })),
      treeNodeOccurrencesByDepth: core.layers.map(row => ({ depth: row.depth, count: row.treeNodeOccurrences })),
      uniqueRawStateCountByDepth: core.layers.map(row => ({ depth: row.depth, count: row.uniqueRawStateCount })),
      duplicateEncounterCountByParentDepth: core.parentLayers.map(row => ({ depth: row.depth, count: row.duplicateEncounterCount })),
      multiParentRawStateCountByParentDepth: core.parentLayers.map(row => ({ depth: row.depth, count: row.multiParentRawStateCount }))
    },
    endpoints: values
  };
}

function measure(engine, source) {
  const base = V.measureRoot(engine, source, DEPTH);
  return {
    upstreamRootReconstructionCoreSha256: base.rootReconstructionCoreSha256,
    upstreamFamilyCoreSha256: {
      "LGTGMIV-F1-TREE-OCCURRENCE": base.rootFamilyCoreSha256["LGTGMIV-F1-TREE-OCCURRENCE"],
      "LGTGMIV-F2-RAW-GRAPH": base.rootFamilyCoreSha256["LGTGMIV-F2-RAW-GRAPH"],
      "LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE": base.rootFamilyCoreSha256["LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE"],
      "LGTGMIV-F4-TREE-GRAPH-RELATION": base.rootFamilyCoreSha256["LGTGMIV-F4-TREE-GRAPH-RELATION"]
    },
    source: base.source,
    tctgd: project(base)
  };
}

function paired(pairId, namua, mtaji) {
  const out = {};
  for (const id of IDS) {
    const delta = rationalDifference(mtaji.tctgd.endpoints[id], namua.tctgd.endpoints[id]);
    out[id] = {
      namua: namua.tctgd.endpoints[id],
      mtaji: mtaji.tctgd.endpoints[id],
      deltaMtajiMinusNamua: delta,
      sign: direction(delta)
    };
  }
  return { pairId, candidates: out };
}

function requiredCoverage(id, total) {
  if (id !== IDS[4]) return total;
  return Math.ceil(total * 5 / 6);
}

function development(comparisons, target) {
  assert(comparisons.length === target, "independent development target mismatch");
  const promotedCandidates = [];
  const summaries = {};
  for (const id of IDS) {
    const counts = { comparable: 0, positive: 0, negative: 0, zero: 0 };
    for (const row of comparisons) {
      const s = row.candidates[id].sign;
      if (s === null) continue;
      counts.comparable++;
      if (s > 0) counts.positive++;
      else if (s < 0) counts.negative++;
      else counts.zero++;
    }
    const nonZero = counts.positive + counts.negative;
    const dominant = Math.max(counts.positive, counts.negative);
    let namedDirection = null;
    if (counts.positive > counts.negative) namedDirection = "MTAJI-GREATER";
    if (counts.negative > counts.positive) namedDirection = "NAMUA-GREATER";
    const coveragePass = counts.comparable >= requiredCoverage(id, target);
    const nonZeroPass = 3 * nonZero >= 2 * counts.comparable;
    const dominancePass = namedDirection !== null && 3 * dominant >= 2 * nonZero;
    const promote = coveragePass && nonZeroPass && dominancePass;
    summaries[id] = { ...counts, nonZero, dominant, direction: namedDirection, coveragePass, nonZeroPass, dominancePass, promote };
    if (promote) promotedCandidates.push({ candidateId: id, direction: namedDirection });
  }
  return { expectedPairs: target, summaries, promotedCandidates };
}

function combinations(n, k) {
  let nn = BigInt(n), kk = BigInt(k);
  if (kk < 0n || kk > nn) return 0n;
  if (kk > nn - kk) kk = nn - kk;
  let v = 1n;
  for (let i = 0n; i < kk; i++) v = v * (nn - i) / (i + 1n);
  return v;
}

function exactSignP(plus, minus) {
  const n = plus + minus;
  if (n === 0) return rational(1n, 1n);
  const tail = Math.min(plus, minus);
  let mass = 0n;
  for (let k = 0; k <= tail; k++) mass += combinations(n, k);
  const denominator = 2n ** BigInt(n);
  let numerator = 2n * mass;
  if (numerator > denominator) numerator = denominator;
  return rational(numerator, denominator);
}

function atMost(x, y) {
  assert(x.defined && y.defined, "independent rational comparison requires defined values");
  return BigInt(x.numerator) * BigInt(y.denominator) <= BigInt(y.numerator) * BigInt(x.denominator);
}

function formal(comparisons, frozenCandidates, target) {
  assert(comparisons.length === target, "independent formal target mismatch");
  const records = [];
  for (const frozen of frozenCandidates) {
    const id = frozen.candidateId;
    assert(IDS.includes(id), "unknown frozen candidate");
    let comparable = 0, positive = 0, negative = 0, zero = 0;
    for (const row of comparisons) {
      const s = row.candidates[id].sign;
      if (s === null) continue;
      comparable++;
      if (s > 0) positive++;
      else if (s < 0) negative++;
      else zero++;
    }
    const nonZero = positive + negative;
    const observedDirection = positive > negative ? "MTAJI-GREATER" : negative > positive ? "NAMUA-GREATER" : null;
    records.push({
      candidateId: id,
      frozenDirection: frozen.direction,
      comparable,
      positive,
      negative,
      zero,
      nonZero,
      observedDirection,
      coveragePass: comparable >= requiredCoverage(id, target),
      nonZeroPass: 3 * nonZero >= 2 * comparable,
      directionPass: observedDirection === frozen.direction,
      rawP: exactSignP(positive, negative)
    });
  }

  records.sort((x, y) => {
    const lx = BigInt(x.rawP.numerator) * BigInt(y.rawP.denominator);
    const ly = BigInt(y.rawP.numerator) * BigInt(x.rawP.denominator);
    if (lx < ly) return -1;
    if (lx > ly) return 1;
    return x.candidateId.localeCompare(y.candidateId);
  });

  let stillTesting = true;
  const count = records.length;
  records.forEach((row, index) => {
    const boundary = rational(1n, BigInt(20 * (count - index)));
    const localPass = atMost(row.rawP, boundary);
    row.holmRank = index + 1;
    row.holmThreshold = boundary;
    row.holmPass = stillTesting && localPass;
    row.confirmed = row.holmPass && row.coveragePass && row.nonZeroPass && row.directionPass;
    if (!localPass) stillTesting = false;
  });

  records.sort((a, b) => a.candidateId.localeCompare(b.candidateId));
  return {
    expectedPairs: target,
    alpha: rational(1n, 20n),
    candidates: records,
    confirmedCandidates: records.filter(row => row.confirmed).map(row => row.candidateId)
  };
}

module.exports = {
  STUDY_ID: "TCTGD-STUDY1",
  HORIZON: DEPTH,
  CANDIDATES: IDS,
  upstreamImplementation: "LGTGMIV-INDEPENDENT",
  fraction: rational,
  deriveFromMeasurement: project,
  measureRoot: measure,
  comparePair: paired,
  summarizeDevelopment: development,
  signTestTwoSided: exactSignP,
  validateFormal: formal
};
