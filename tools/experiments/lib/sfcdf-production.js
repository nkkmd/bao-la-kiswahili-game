"use strict";

const U = require("./lgtgmiv-stage1-production.js");

const STUDY_ID = "SFCDF-STUDY1";
const HORIZON = 5;
const CANDIDATES = [
  "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION",
  "SFCDF-C2-WIDTH-COMPRESSION-FRACTION",
  "SFCDF-C3-LONGEST-UNIT-WIDTH-RUN",
  "SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION",
  "SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION",
  "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO"
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
function subtract(a, b) {
  if (!a || !b || !a.defined || !b.defined) return fraction(0n, 0n);
  return fraction(BigInt(a.numerator) * BigInt(b.denominator) - BigInt(b.numerator) * BigInt(a.denominator), BigInt(a.denominator) * BigInt(b.denominator));
}
function sign(q) { if (!q || !q.defined) return null; const n = BigInt(q.numerator); return n > 0n ? 1 : n < 0n ? -1 : 0; }
function sum(rows, field) { return rows.reduce((a, x) => a + BigInt(x[field]), 0n); }
function positiveReplyPresence(layers) {
  let n = 0n;
  for (const row of layers) for (const [width, count] of Object.entries(row.replyWidthHistogram || {})) if (BigInt(width) > 0n) n += BigInt(count);
  return n;
}
function rootBranchOverlapFraction(branch) {
  const labels = branch.rootMoveLabels || [];
  const total = BigInt(labels.length * (labels.length - 1) / 2);
  if (total === 0n) return fraction(0n, 0n);
  const positive = new Set();
  for (const d of branch.rootBranchPairOverlapByDepth || []) {
    if (d.depth < 1 || d.depth > HORIZON) continue;
    for (const p of d.pairs || []) if (p.overlap && p.overlap.defined && BigInt(p.overlap.numerator) > 0n) {
      const a = p.rootMoveA < p.rootMoveB ? p.rootMoveA : p.rootMoveB;
      const b = p.rootMoveA < p.rootMoveB ? p.rootMoveB : p.rootMoveA;
      positive.add(`${a}\u0000${b}`);
    }
  }
  return fraction(BigInt(positive.size), total);
}
function longestUnitRun(narrow) {
  let m = 0;
  for (const r of (narrow && narrow.records) || []) if (Number(r.length) > m) m = Number(r.length);
  return m;
}
function deriveFromMeasurement(measurement) {
  need(measurement && measurement.reconstructionCore, "measurement reconstructionCore required");
  const r = measurement.reconstructionCore;
  need(r.targetDepth === HORIZON, "SFCDF requires relative depth 5");
  need(r.representation && r.representation.mode === "RAW-ONLY", "RAW-only representation required");
  need(Array.isArray(r.representation.validatedTransformSet) && r.representation.validatedTransformSet.length === 0, "validated transform set must be empty");
  need(r.layers.length === HORIZON + 1 && r.parentLayers.length === HORIZON, "complete depth layers required");

  const unit = sum(r.layers, "unitWidthStateCount");
  const positiveReply = positiveReplyPresence(r.layers);
  const compression = sum(r.parentLayers, "widthCompressionCount");
  const expansion = sum(r.parentLayers, "widthExpansionCount");
  const stable = sum(r.parentLayers, "widthStableCount");
  const widthComparisons = compression + expansion + stable;
  const longest = longestUnitRun(r.narrowPathGeometry);
  const reconvergent = sum(r.layers.slice(1), "reconvergentRawStateCount");
  const nonRootRawPresence = r.layers.slice(1).reduce((a, x) => a + BigInt(x.uniqueRawStateCount), 0n);
  const treeOccurrences = sum(r.layers, "treeNodeOccurrences");
  const distinctRaw = BigInt(r.cumulative.distinctRawStates);
  const reopening = sum(r.parentLayers, "branchReopeningCount");
  const extinction = sum(r.parentLayers, "branchExtinctionCount");

  const endpoints = {
    "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION": fraction(unit, positiveReply),
    "SFCDF-C2-WIDTH-COMPRESSION-FRACTION": fraction(compression, widthComparisons),
    "SFCDF-C3-LONGEST-UNIT-WIDTH-RUN": fraction(BigInt(longest), 1n),
    "SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION": fraction(reconvergent, nonRootRawPresence),
    "SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION": rootBranchOverlapFraction(r.rootBranchGeometry),
    "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO": fraction(treeOccurrences, distinctRaw)
  };

  return {
    rootRawSha256: r.rootRawSha256,
    targetDepth: r.targetDepth,
    constructSeparation: {
      corridorCandidates: CANDIDATES.slice(0, 3),
      funnelCandidates: CANDIDATES.slice(3),
      combinedClassDefined: false
    },
    rawPrimitives: {
      unitWidthStatePresenceDepth0To5: String(unit),
      positiveReplyRawStatePresenceDepth0To5: String(positiveReply),
      widthCompressionTransitionCountDepth0To4: String(compression),
      widthExpansionTransitionCountDepth0To4: String(expansion),
      widthStableTransitionCountDepth0To4: String(stable),
      widthComparisonTransitionCountDepth0To4: String(widthComparisons),
      branchReopeningCountDepth0To4: String(reopening),
      branchExtinctionCountDepth0To4: String(extinction),
      longestUnitWidthRun: longest,
      unitWidthRunLengthHistogram: (r.narrowPathGeometry && r.narrowPathGeometry.lengthHistogram) || {},
      narrowPathRecordsDigestSha256: r.narrowPathGeometry ? r.narrowPathGeometry.recordsDigestSha256 : null,
      reconvergentRawStatePresenceDepth1To5: String(reconvergent),
      nonRootUniqueRawStatePresenceDepth1To5: String(nonRootRawPresence),
      treeOccurrenceCountDepth0To5: String(treeOccurrences),
      distinctRawStatesDepth0To5: String(distinctRaw),
      rootLegalMoveCount: r.rootLegalMoveCount,
      replyWidthHistogramByDepth: r.layers.map(x => ({ depth: x.depth, histogram: x.replyWidthHistogram })),
      reconvergentRawStateCountByDepth: r.layers.map(x => ({ depth: x.depth, count: x.reconvergentRawStateCount })),
      widthTransitionCountsByParentDepth: r.parentLayers.map(x => ({ depth: x.depth, expansion: x.widthExpansionCount, compression: x.widthCompressionCount, stable: x.widthStableCount, reopening: x.branchReopeningCount, extinction: x.branchExtinctionCount }))
    },
    endpoints
  };
}
function measureRoot(engine, source) {
  const upstream = U.measureRoot(engine, source, HORIZON);
  return {
    upstreamRootReconstructionCoreSha256: upstream.rootReconstructionCoreSha256,
    upstreamFamilyCoreSha256: {
      "LGTGMIV-F1-TREE-OCCURRENCE": upstream.rootFamilyCoreSha256["LGTGMIV-F1-TREE-OCCURRENCE"],
      "LGTGMIV-F2-RAW-GRAPH": upstream.rootFamilyCoreSha256["LGTGMIV-F2-RAW-GRAPH"],
      "LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE": upstream.rootFamilyCoreSha256["LGTGMIV-F3-TRANSPOSITION-RECONVERGENCE"],
      "LGTGMIV-F4-TREE-GRAPH-RELATION": upstream.rootFamilyCoreSha256["LGTGMIV-F4-TREE-GRAPH-RELATION"],
      "LGTGMIV-F5-REPLY-GEOMETRY": upstream.rootFamilyCoreSha256["LGTGMIV-F5-REPLY-GEOMETRY"]
    },
    source: upstream.source,
    sfcdf: deriveFromMeasurement(upstream)
  };
}
function comparePair(pairId, namuaRoot, mtajiRoot) {
  const candidates = {};
  for (const id of CANDIDATES) {
    const n = namuaRoot.sfcdf.endpoints[id], m = mtajiRoot.sfcdf.endpoints[id], d = subtract(m, n);
    candidates[id] = { namua: n, mtaji: m, deltaMtajiMinusNamua: d, sign: sign(d) };
  }
  return { pairId, candidates };
}
function minimumComparable(id, expectedPairs) { return id === "SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION" ? Math.ceil(expectedPairs * 5 / 6) : expectedPairs; }
function summarizeDevelopment(rows, expectedPairs) {
  need(rows.length === expectedPairs, "development pair count mismatch");
  const summaries = {}, promotedCandidates = [];
  for (const id of CANDIDATES) {
    let comparable = 0, positive = 0, negative = 0, zero = 0;
    for (const row of rows) { const s = row.candidates[id].sign; if (s === null) continue; comparable++; if (s > 0) positive++; else if (s < 0) negative++; else zero++; }
    const nonZero = positive + negative, dominant = Math.max(positive, negative);
    const direction = positive > negative ? "MTAJI-GREATER" : negative > positive ? "NAMUA-GREATER" : null;
    const coveragePass = comparable >= minimumComparable(id, expectedPairs);
    const nonZeroPass = 3 * nonZero >= 2 * comparable;
    const dominancePass = direction !== null && 3 * dominant >= 2 * nonZero;
    const promote = coveragePass && nonZeroPass && dominancePass;
    summaries[id] = { comparable, positive, negative, zero, nonZero, dominant, direction, coveragePass, nonZeroPass, dominancePass, promote };
    if (promote) promotedCandidates.push({ candidateId: id, direction });
  }
  return { expectedPairs, summaries, promotedCandidates };
}
function choose(n, k) { n = BigInt(n); k = BigInt(k); if (k < 0n || k > n) return 0n; if (k > n-k) k=n-k; let x=1n; for(let i=1n;i<=k;i++)x=x*(n-k+i)/i; return x; }
function signTestTwoSided(pos, neg) { const n=pos+neg; if(!n)return fraction(1n,1n); const t=Math.min(pos,neg); let c=0n; for(let k=0;k<=t;k++)c+=choose(n,k); const den=1n<<BigInt(n); let num=2n*c; if(num>den)num=den; return fraction(num,den); }
function leq(a,b){need(a.defined&&b.defined,"defined fractions required");return BigInt(a.numerator)*BigInt(b.denominator)<=BigInt(b.numerator)*BigInt(a.denominator);}
function validateFormal(rows, promotedCandidates, expectedPairs) {
  need(rows.length === expectedPairs, "formal pair count mismatch");
  const frozen = new Map(promotedCandidates.map(x => [x.candidateId, x.direction]));
  const out=[];
  for(const [id, frozenDirection] of frozen){let comparable=0,positive=0,negative=0,zero=0;for(const row of rows){const s=row.candidates[id].sign;if(s===null)continue;comparable++;if(s>0)positive++;else if(s<0)negative++;else zero++;}const nonZero=positive+negative;const observedDirection=positive>negative?"MTAJI-GREATER":negative>positive?"NAMUA-GREATER":null;out.push({candidateId:id,frozenDirection,comparable,positive,negative,zero,nonZero,observedDirection,coveragePass:comparable>=minimumComparable(id,expectedPairs),nonZeroPass:3*nonZero>=2*comparable,directionPass:observedDirection===frozenDirection,rawP:signTestTwoSided(positive,negative)});} 
  out.sort((a,b)=>{const l=BigInt(a.rawP.numerator)*BigInt(b.rawP.denominator),r=BigInt(b.rawP.numerator)*BigInt(a.rawP.denominator);return l<r?-1:l>r?1:a.candidateId.localeCompare(b.candidateId);});
  let open=true; const m=out.length; for(let i=0;i<out.length;i++){const threshold=fraction(1n,BigInt(20*(m-i)));const rawPass=leq(out[i].rawP,threshold);out[i].holmRank=i+1;out[i].holmThreshold=threshold;out[i].holmPass=open&&rawPass;out[i].confirmed=out[i].holmPass&&out[i].coveragePass&&out[i].nonZeroPass&&out[i].directionPass;if(!rawPass)open=false;} out.sort((a,b)=>a.candidateId.localeCompare(b.candidateId)); return {expectedPairs,alpha:fraction(1n,20n),candidates:out,confirmedCandidates:out.filter(x=>x.confirmed).map(x=>x.candidateId)};
}

module.exports = { STUDY_ID, HORIZON, CANDIDATES, upstreamImplementation: "LGTGMIV-PRODUCTION", fraction, deriveFromMeasurement, measureRoot, comparePair, summarizeDevelopment, signTestTwoSided, validateFormal };
