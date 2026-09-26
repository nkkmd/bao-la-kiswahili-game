"use strict";

const SFCDF = require("./sfcdf-production.js");

function need(value, message) {
  if (!value) throw new Error(message);
}

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function fraction(numerator, denominator) {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}

function normalizeFraction(value) {
  if (!value || value.defined === false) return fraction(0n, 0n);
  return fraction(value.numerator, value.denominator);
}

function compareFraction(a, b) {
  const x = normalizeFraction(a);
  const y = normalizeFraction(b);
  need(x.defined && y.defined, "fraction comparison requires defined values");
  const left = BigInt(x.numerator) * BigInt(y.denominator);
  const right = BigInt(y.numerator) * BigInt(x.denominator);
  return left < right ? -1 : left > right ? 1 : 0;
}

function geometryTechnicalSummary(measurement) {
  need(measurement && measurement.reconstructionCore, "measurement reconstructionCore required");
  const derived = SFCDF.deriveFromMeasurement(measurement);
  const endpoints = derived.endpoints;
  const layer1 = measurement.reconstructionCore.layers.find((row) => row.depth === 1);
  need(layer1 && layer1.replyWidthHistogram, "depth-1 reply-width histogram required");
  let replyNumerator = 0n;
  let replyDenominator = 0n;
  for (const [width, count] of Object.entries(layer1.replyWidthHistogram)) {
    replyNumerator += BigInt(width) * BigInt(count);
    replyDenominator += BigInt(count);
  }
  return {
    corridor: normalizeFraction(endpoints["SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION"]),
    treeRawInflation: normalizeFraction(endpoints["SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO"]),
    transposition: normalizeFraction(endpoints["SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION"]),
    replyWidthMean: fraction(replyNumerator, replyDenominator),
  };
}

function exactMoveStructure(graphNode, rootRow, solutionRows) {
  need(graphNode && rootRow && Array.isArray(solutionRows), "exact move structure input required");
  need(graphNode.id === rootRow.stateKey, "graph/solution root identity mismatch");
  need(rootRow.status === "WIN" || rootRow.status === "LOSS", "root must be exact WIN or LOSS");
  const byKey = new Map(solutionRows.map((row) => [row.stateKey, row]));
  const seen = new Set();
  const rows = [];
  for (const move of [...graphNode.moves].sort((a, b) => a.key.localeCompare(b.key))) {
    need(!seen.has(move.key), `duplicate move key ${move.key}`);
    seen.add(move.key);
    const child = byKey.get(move.to);
    need(child, `missing solved child ${move.to}`);
    const valuePreserving = rootRow.status === "WIN" ? child.status === "LOSS" : child.status === "WIN";
    const dtfConsistent = valuePreserving
      && Number.isInteger(rootRow.dtf)
      && Number.isInteger(child.dtf)
      && child.dtf + 1 === rootRow.dtf;
    rows.push({
      moveKey: move.key,
      childStateKey: move.to,
      childStatus: child.status,
      childDtf: child.dtf,
      valuePreserving,
      dtfConsistent,
    });
  }
  const valuePreservingMoveKeys = rows.filter((row) => row.valuePreserving).map((row) => row.moveKey);
  const dtfConsistentMoveKeys = rows.filter((row) => row.dtfConsistent).map((row) => row.moveKey);
  const solverOptimalMoveKeys = [...(rootRow.optimalMoveKeys || [])].sort();
  return {
    rootStateKey: rootRow.stateKey,
    rootStatus: rootRow.status,
    rootDtf: rootRow.dtf,
    legalMoveCount: rows.length,
    valuePreservingMoveCount: valuePreservingMoveKeys.length,
    valuePreservingMoveKeys,
    dtfConsistentMoveCount: dtfConsistentMoveKeys.length,
    dtfConsistentMoveKeys,
    solverOptimalMoveKeys,
    dtfConsistentMatchesSolverOptimal: JSON.stringify(dtfConsistentMoveKeys) === JSON.stringify(solverOptimalMoveKeys),
    rows,
  };
}

function binaryOrdering(rows) {
  need(Array.isArray(rows), "binary rows required");
  const win = rows.filter((row) => row.valueClass === "WIN");
  const loss = rows.filter((row) => row.valueClass === "LOSS");
  const counts = { WIN_GREATER: 0, WIN_LESS: 0, TIE: 0, pairCount: 0 };
  let undefinedRows = 0;
  for (const row of rows) if (!normalizeFraction(row.geometry).defined) undefinedRows += 1;
  for (const w of win) for (const l of loss) {
    const a = normalizeFraction(w.geometry);
    const b = normalizeFraction(l.geometry);
    if (!a.defined || !b.defined) continue;
    const cmp = compareFraction(a, b);
    counts.pairCount += 1;
    if (cmp > 0) counts.WIN_GREATER += 1;
    else if (cmp < 0) counts.WIN_LESS += 1;
    else counts.TIE += 1;
  }
  return {
    ...counts,
    winCount: win.length,
    lossCount: loss.length,
    undefinedRows,
    estimable: win.length > 0 && loss.length > 0 && counts.pairCount > 0,
  };
}

function hasVariation(values) {
  const defined = values.map(normalizeFraction).filter((value) => value.defined);
  if (defined.length < 2) return false;
  return defined.slice(1).some((value) => compareFraction(value, defined[0]) !== 0);
}

function orderedConcordance(rows) {
  need(Array.isArray(rows), "ordered rows required");
  const counts = {
    CONCORDANT: 0,
    DISCORDANT: 0,
    GEOMETRY_TIE: 0,
    CONSEQUENCE_TIE: 0,
    BOTH_TIE: 0,
    pairCount: 0,
    skippedUndefinedPairs: 0,
  };
  for (let i = 0; i < rows.length; i += 1) for (let j = i + 1; j < rows.length; j += 1) {
    const gx = normalizeFraction(rows[i].geometry);
    const gy = normalizeFraction(rows[j].geometry);
    const cx = normalizeFraction(rows[i].consequence);
    const cy = normalizeFraction(rows[j].consequence);
    if (!gx.defined || !gy.defined || !cx.defined || !cy.defined) {
      counts.skippedUndefinedPairs += 1;
      continue;
    }
    const g = compareFraction(gx, gy);
    const c = compareFraction(cx, cy);
    counts.pairCount += 1;
    if (g === 0 && c === 0) counts.BOTH_TIE += 1;
    else if (g === 0) counts.GEOMETRY_TIE += 1;
    else if (c === 0) counts.CONSEQUENCE_TIE += 1;
    else if (g === c) counts.CONCORDANT += 1;
    else counts.DISCORDANT += 1;
  }
  const geometryVariation = hasVariation(rows.map((row) => row.geometry));
  const consequenceVariation = hasVariation(rows.map((row) => row.consequence));
  return {
    ...counts,
    measuredRowCount: rows.filter((row) => normalizeFraction(row.geometry).defined && normalizeFraction(row.consequence).defined).length,
    geometryVariation,
    consequenceVariation,
    estimable: rows.length >= 2 && counts.pairCount > 0 && geometryVariation && consequenceVariation,
  };
}

module.exports = {
  fraction,
  normalizeFraction,
  compareFraction,
  geometryTechnicalSummary,
  exactMoveStructure,
  binaryOrdering,
  orderedConcordance,
};
