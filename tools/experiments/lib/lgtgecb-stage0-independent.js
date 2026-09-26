"use strict";

const SFCDFIndependent = require("./sfcdf-independent.js");

function assert(condition, message) {
  if (!condition) throw new Error(`independent:${message}`);
}

function abs(value) { return value < 0n ? -value : value; }
function gcdIndependent(a, b) {
  a = abs(a); b = abs(b);
  for (;;) {
    if (b === 0n) return a;
    const r = a % b;
    a = b;
    b = r;
  }
}

function makeFraction(n, d) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n *= -1n; d *= -1n; }
  const divisor = gcdIndependent(n, d);
  return { numerator: (n / divisor).toString(), denominator: (d / divisor).toString(), defined: true };
}

function normalized(input) {
  return !input || input.defined === false ? makeFraction(0, 0) : makeFraction(input.numerator, input.denominator);
}

function compare(a, b) {
  const aa = normalized(a), bb = normalized(b);
  assert(aa.defined && bb.defined, "undefined fraction comparison");
  const delta = BigInt(aa.numerator) * BigInt(bb.denominator) - BigInt(bb.numerator) * BigInt(aa.denominator);
  return delta === 0n ? 0 : delta < 0n ? -1 : 1;
}

function geometryTechnicalSummary(measurement) {
  assert(measurement?.reconstructionCore, "missing reconstructionCore");
  const derived = SFCDFIndependent.deriveFromMeasurement(JSON.parse(JSON.stringify(measurement)));
  const depthOne = measurement.reconstructionCore.layers.filter((row) => row.depth === 1);
  assert(depthOne.length === 1, "depth-1 layer count");
  let weighted = 0n, total = 0n;
  const entries = Object.entries(depthOne[0].replyWidthHistogram || {}).sort((a, b) => Number(a[0]) - Number(b[0]));
  for (const entry of entries) {
    const width = BigInt(entry[0]), count = BigInt(entry[1]);
    weighted += width * count;
    total += count;
  }
  const ep = derived.endpoints;
  return {
    corridor: normalized(ep["SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION"]),
    treeRawInflation: normalized(ep["SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO"]),
    transposition: normalized(ep["SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION"]),
    replyWidthMean: makeFraction(weighted, total),
  };
}

function exactMoveStructure(graphNode, rootRow, solutionRows) {
  assert(graphNode && rootRow && Array.isArray(solutionRows), "exact inputs missing");
  assert(graphNode.id === rootRow.stateKey, "root identity mismatch");
  assert(["WIN", "LOSS"].includes(rootRow.status), "unsupported root status");
  const solution = Object.create(null);
  for (const row of solutionRows) solution[row.stateKey] = row;
  const orderedMoves = graphNode.moves.slice().sort((a, b) => a.key.localeCompare(b.key));
  const keys = new Set();
  const detail = orderedMoves.map((move) => {
    assert(!keys.has(move.key), `duplicate move key ${move.key}`);
    keys.add(move.key);
    const child = solution[move.to];
    assert(child, `missing child ${move.to}`);
    const preserves = (rootRow.status === "WIN" && child.status === "LOSS")
      || (rootRow.status === "LOSS" && child.status === "WIN");
    const dtfMatches = preserves && Number.isInteger(rootRow.dtf) && Number.isInteger(child.dtf)
      ? rootRow.dtf - child.dtf === 1
      : false;
    return {
      moveKey: move.key,
      childStateKey: move.to,
      childStatus: child.status,
      childDtf: child.dtf,
      valuePreserving: preserves,
      dtfConsistent: dtfMatches,
    };
  });
  const preservingKeys = detail.filter((x) => x.valuePreserving).map((x) => x.moveKey);
  const dtfKeys = detail.filter((x) => x.dtfConsistent).map((x) => x.moveKey);
  const optimal = (rootRow.optimalMoveKeys || []).slice().sort();
  return {
    rootStateKey: rootRow.stateKey,
    rootStatus: rootRow.status,
    rootDtf: rootRow.dtf,
    legalMoveCount: detail.length,
    valuePreservingMoveCount: preservingKeys.length,
    valuePreservingMoveKeys: preservingKeys,
    dtfConsistentMoveCount: dtfKeys.length,
    dtfConsistentMoveKeys: dtfKeys,
    solverOptimalMoveKeys: optimal,
    dtfConsistentMatchesSolverOptimal: dtfKeys.length === optimal.length && dtfKeys.every((key, index) => key === optimal[index]),
    rows: detail,
  };
}

function binaryOrdering(rows) {
  assert(Array.isArray(rows), "binary rows missing");
  const wins = [], losses = [];
  let undefinedRows = 0;
  for (const row of rows) {
    const q = normalized(row.geometry);
    if (!q.defined) undefinedRows += 1;
    if (row.valueClass === "WIN") wins.push(q);
    else if (row.valueClass === "LOSS") losses.push(q);
  }
  let greater = 0, less = 0, tie = 0, pairCount = 0;
  for (const w of wins) for (const l of losses) {
    if (!w.defined || !l.defined) continue;
    const c = compare(w, l);
    pairCount += 1;
    if (c === 1) greater += 1;
    else if (c === -1) less += 1;
    else tie += 1;
  }
  return {
    WIN_GREATER: greater,
    WIN_LESS: less,
    TIE: tie,
    pairCount,
    winCount: wins.length,
    lossCount: losses.length,
    undefinedRows,
    estimable: wins.length !== 0 && losses.length !== 0 && pairCount !== 0,
  };
}

function variation(list) {
  const xs = list.map(normalized).filter((q) => q.defined);
  if (xs.length <= 1) return false;
  for (let i = 1; i < xs.length; i += 1) if (compare(xs[0], xs[i]) !== 0) return true;
  return false;
}

function orderedConcordance(rows) {
  assert(Array.isArray(rows), "ordered rows missing");
  const result = {
    CONCORDANT: 0,
    DISCORDANT: 0,
    GEOMETRY_TIE: 0,
    CONSEQUENCE_TIE: 0,
    BOTH_TIE: 0,
    pairCount: 0,
    skippedUndefinedPairs: 0,
  };
  for (let left = 0; left < rows.length; left += 1) {
    for (let right = left + 1; right < rows.length; right += 1) {
      const g1 = normalized(rows[left].geometry), g2 = normalized(rows[right].geometry);
      const c1 = normalized(rows[left].consequence), c2 = normalized(rows[right].consequence);
      if (![g1, g2, c1, c2].every((q) => q.defined)) {
        result.skippedUndefinedPairs += 1;
        continue;
      }
      const gc = compare(g1, g2), cc = compare(c1, c2);
      result.pairCount += 1;
      if (gc === 0 && cc === 0) result.BOTH_TIE += 1;
      else if (gc === 0) result.GEOMETRY_TIE += 1;
      else if (cc === 0) result.CONSEQUENCE_TIE += 1;
      else if ((gc < 0 && cc < 0) || (gc > 0 && cc > 0)) result.CONCORDANT += 1;
      else result.DISCORDANT += 1;
    }
  }
  const geometryVariation = variation(rows.map((row) => row.geometry));
  const consequenceVariation = variation(rows.map((row) => row.consequence));
  const measuredRowCount = rows.filter((row) => normalized(row.geometry).defined && normalized(row.consequence).defined).length;
  return {
    ...result,
    measuredRowCount,
    geometryVariation,
    consequenceVariation,
    estimable: measuredRowCount >= 2 && result.pairCount > 0 && geometryVariation && consequenceVariation,
  };
}

module.exports = {
  fraction: makeFraction,
  normalizeFraction: normalized,
  compareFraction: compare,
  geometryTechnicalSummary,
  exactMoveStructure,
  binaryOrdering,
  orderedConcordance,
};
