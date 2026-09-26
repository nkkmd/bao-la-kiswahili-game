"use strict";

const SFCDFIndependent = require("./sfcdf-independent.js");

function assert(value, message) { if (!value) throw new Error(`independent:${message}`); }
function abs(n) { return n < 0n ? -n : n; }
function gcd(a, b) { a = abs(a); b = abs(b); while (b !== 0n) { const r = a % b; a = b; b = r; } return a; }
function rational(n, d) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { numerator: (n / g).toString(), denominator: (d / g).toString(), defined: true };
}
function normal(q) { return !q || q.defined === false ? rational(0, 0) : rational(q.numerator, q.denominator); }
function cmp(a, b) {
  const x = normal(a), y = normal(b);
  assert(x.defined && y.defined, "undefined rational comparison");
  const delta = BigInt(x.numerator) * BigInt(y.denominator) - BigInt(y.numerator) * BigInt(x.denominator);
  return delta === 0n ? 0 : delta < 0n ? -1 : 1;
}
function integerQ(value) { assert(Number.isInteger(value), "ordered integer required"); return rational(value, 1); }

function geometryScalars(measurement) {
  assert(measurement?.reconstructionCore, "measurement missing");
  const core = measurement.reconstructionCore;
  const endpoints = SFCDFIndependent.deriveFromMeasurement(JSON.parse(JSON.stringify(measurement))).endpoints;
  const replies = Object.keys(core.immediateReplyWidth || {}).sort().map((key) => BigInt(core.immediateReplyWidth[key]));
  assert(replies.length === Number(core.rootLegalMoveCount), "reply cardinality mismatch");
  let total = 0n;
  for (const width of replies) total += width;
  return {
    "GEO-CORRIDOR": normal(endpoints["SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION"]),
    "GEO-TREE-RAW": normal(endpoints["SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO"]),
    "GEO-TRANSPOSITION": normal(endpoints["SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION"]),
    "GEO-REPLY": rational(total, replies.length),
  };
}

function exactConsequences(graphNode, rootRow, solutionRows) {
  assert(graphNode && rootRow && Array.isArray(solutionRows), "exact inputs missing");
  assert(graphNode.id === rootRow.stateKey, "root mismatch");
  assert(rootRow.status === "WIN" || rootRow.status === "LOSS", "nondecisive root");
  assert(rootRow.absoluteWinner === 0 || rootRow.absoluteWinner === 1, "winner missing");
  const solved = Object.create(null);
  for (const row of solutionRows) solved[row.stateKey] = row;
  const preserving = [], dtfOptimal = [];
  const seen = new Set();
  const ordered = graphNode.moves.slice().sort((a, b) => a.key.localeCompare(b.key));
  for (const move of ordered) {
    assert(!seen.has(move.key), `duplicate move ${move.key}`); seen.add(move.key);
    const child = solved[move.to]; assert(child, `unsolved child ${move.to}`);
    if (child.absoluteWinner === rootRow.absoluteWinner) {
      preserving.push(move.key);
      if (Number.isInteger(rootRow.dtf) && Number.isInteger(child.dtf) && rootRow.dtf - child.dtf === 1) dtfOptimal.push(move.key);
    }
  }
  const solverOptimal = (rootRow.optimalMoveKeys || []).slice().sort();
  assert(dtfOptimal.length === solverOptimal.length && dtfOptimal.every((key, index) => key === solverOptimal[index]), "DTF optimal set mismatch");
  return {
    "EXACT-VALUE": rootRow.status,
    "EXACT-DTF": rootRow.dtf,
    "EXACT-VPMC": preserving.length,
    valuePreservingMoveKeys: preserving,
    dtfOptimalMoveCount: dtfOptimal.length,
    dtfOptimalMoveKeys: dtfOptimal,
    solverOptimalMoveKeys: solverOptimal,
  };
}

function binarySummary(rows, geometryId) {
  const winRows = [], lossRows = [];
  for (const row of rows) {
    if (row.exact["EXACT-VALUE"] === "WIN") winRows.push(row);
    else if (row.exact["EXACT-VALUE"] === "LOSS") lossRows.push(row);
    else assert(false, "unexpected value class");
  }
  let high = 0, low = 0, ties = 0;
  for (const win of winRows) for (const loss of lossRows) {
    const d = cmp(win.geometry[geometryId], loss.geometry[geometryId]);
    if (d > 0) high += 1; else if (d < 0) low += 1; else ties += 1;
  }
  const informative = high + low;
  let label = "MIXED-ORDER";
  if (informative === 0) label = "NON-ESTIMABLE-NO-INFORMATIVE-CROSS-CLASS-PAIRS";
  else if (high > 0 && low === 0) label = "WIN-GREATER-ORDER-CONSISTENT";
  else if (low > 0 && high === 0) label = "WIN-LESS-ORDER-CONSISTENT";
  const total = winRows.length * lossRows.length;
  return {
    measuredDomains: rows.length,
    winRoots: winRows.length,
    lossRoots: lossRows.length,
    pairCount: total,
    WIN_GREATER: high,
    WIN_LESS: low,
    TIE: ties,
    informativePairs: informative,
    completeSeparation: ties === 0 && ((high === total && low === 0) || (low === total && high === 0)),
    classification: label,
  };
}

function varied(values) {
  if (values.length < 2) return false;
  for (let i = 1; i < values.length; i += 1) if (cmp(values[0], values[i]) !== 0) return true;
  return false;
}
function orderedSummary(rows, geometryId, consequenceId) {
  const counts = { CONCORDANT: 0, DISCORDANT: 0, GEOMETRY_TIE: 0, CONSEQUENCE_TIE: 0, BOTH_TIE: 0 };
  for (let a = 0; a < rows.length; a += 1) for (let b = a + 1; b < rows.length; b += 1) {
    const g = cmp(rows[a].geometry[geometryId], rows[b].geometry[geometryId]);
    const c = cmp(integerQ(rows[a].exact[consequenceId]), integerQ(rows[b].exact[consequenceId]));
    if (g === 0 && c === 0) counts.BOTH_TIE += 1;
    else if (g === 0) counts.GEOMETRY_TIE += 1;
    else if (c === 0) counts.CONSEQUENCE_TIE += 1;
    else if ((g < 0 && c < 0) || (g > 0 && c > 0)) counts.CONCORDANT += 1;
    else counts.DISCORDANT += 1;
  }
  const geometryVariation = varied(rows.map((row) => row.geometry[geometryId]));
  const consequenceVariation = varied(rows.map((row) => integerQ(row.exact[consequenceId])));
  const informative = counts.CONCORDANT + counts.DISCORDANT;
  let label;
  if (!geometryVariation) label = "NON-ESTIMABLE-NO-GEOMETRY-VARIATION";
  else if (!consequenceVariation) label = "NON-ESTIMABLE-NO-CONSEQUENCE-VARIATION";
  else if (informative === 0) label = "NON-ESTIMABLE-NO-INFORMATIVE-PAIRS";
  else if (counts.CONCORDANT > 0 && counts.DISCORDANT === 0) label = "MONOTONE-INCREASING-ORDER-CONSISTENT";
  else if (counts.DISCORDANT > 0 && counts.CONCORDANT === 0) label = "MONOTONE-DECREASING-ORDER-CONSISTENT";
  else label = "MIXED-ORDER";
  return {
    measuredDomains: rows.length,
    pairCount: rows.length * (rows.length - 1) / 2,
    ...counts,
    informativePairs: informative,
    geometryVariation,
    consequenceVariation,
    classification: label,
  };
}
function relationMatrix(rows, spec) {
  assert(rows.length === spec.domainCount, "row count mismatch");
  return spec.relationMatrix.map((relation) => ({
    ...relation,
    summary: relation.consequence === "EXACT-VALUE"
      ? binarySummary(rows, relation.geometry)
      : orderedSummary(rows, relation.geometry, relation.consequence),
  }));
}

module.exports = { fraction: rational, normalize: normal, compare: cmp, geometryScalars, exactConsequences, binarySummary, orderedSummary, relationMatrix };
