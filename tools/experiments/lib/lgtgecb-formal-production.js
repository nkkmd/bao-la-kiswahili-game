"use strict";

const SFCDF = require("./sfcdf-production.js");

function need(value, message) { if (!value) throw new Error(message); }
function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b !== 0n) [a, b] = [b, a % b]; return a; }
function fraction(n, d) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function normalize(q) { return !q || q.defined === false ? fraction(0n, 0n) : fraction(q.numerator, q.denominator); }
function compare(a, b) {
  const x = normalize(a), y = normalize(b);
  need(x.defined && y.defined, "defined rational values required");
  const d = BigInt(x.numerator) * BigInt(y.denominator) - BigInt(y.numerator) * BigInt(x.denominator);
  return d < 0n ? -1 : d > 0n ? 1 : 0;
}
function integerFraction(value) { need(Number.isInteger(value), "integer consequence required"); return fraction(BigInt(value), 1n); }

function geometryScalars(measurement) {
  need(measurement && measurement.reconstructionCore, "LGTGMIV measurement required");
  const core = measurement.reconstructionCore;
  const endpoints = SFCDF.deriveFromMeasurement(measurement).endpoints;
  const immediate = Object.entries(core.immediateReplyWidth || {}).sort((a, b) => a[0].localeCompare(b[0]));
  need(immediate.length === Number(core.rootLegalMoveCount), "immediate reply-width cardinality mismatch");
  let replySum = 0n;
  for (const [, width] of immediate) replySum += BigInt(width);
  return {
    "GEO-CORRIDOR": normalize(endpoints["SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION"]),
    "GEO-TREE-RAW": normalize(endpoints["SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO"]),
    "GEO-TRANSPOSITION": normalize(endpoints["SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION"]),
    "GEO-REPLY": fraction(replySum, BigInt(immediate.length)),
  };
}

function exactConsequences(graphNode, rootRow, solutionRows) {
  need(graphNode && rootRow && Array.isArray(solutionRows), "exact solution input required");
  need(graphNode.id === rootRow.stateKey, "exact root identity mismatch");
  need(rootRow.status === "WIN" || rootRow.status === "LOSS", "decisive root required");
  need(rootRow.absoluteWinner === 0 || rootRow.absoluteWinner === 1, "absolute winner required");
  const byKey = new Map(solutionRows.map((row) => [row.stateKey, row]));
  const moves = [...graphNode.moves].sort((a, b) => a.key.localeCompare(b.key));
  const detail = [];
  const keys = new Set();
  for (const move of moves) {
    need(!keys.has(move.key), `duplicate root move ${move.key}`); keys.add(move.key);
    const child = byKey.get(move.to); need(child, `missing solved child ${move.to}`);
    const valuePreserving = child.absoluteWinner === rootRow.absoluteWinner;
    const dtfOptimal = valuePreserving && Number.isInteger(child.dtf) && Number.isInteger(rootRow.dtf) && child.dtf + 1 === rootRow.dtf;
    detail.push({ moveKey: move.key, childStateKey: move.to, childStatus: child.status, childAbsoluteWinner: child.absoluteWinner, childDtf: child.dtf, valuePreserving, dtfOptimal });
  }
  const valuePreservingMoveKeys = detail.filter((row) => row.valuePreserving).map((row) => row.moveKey);
  const dtfOptimalMoveKeys = detail.filter((row) => row.dtfOptimal).map((row) => row.moveKey);
  const solverOptimalMoveKeys = [...(rootRow.optimalMoveKeys || [])].sort();
  need(JSON.stringify(dtfOptimalMoveKeys) === JSON.stringify(solverOptimalMoveKeys), "DTF-optimal move set differs from solver optimalMoveKeys");
  return {
    "EXACT-VALUE": rootRow.status,
    "EXACT-DTF": rootRow.dtf,
    "EXACT-VPMC": valuePreservingMoveKeys.length,
    valuePreservingMoveKeys,
    dtfOptimalMoveCount: dtfOptimalMoveKeys.length,
    dtfOptimalMoveKeys,
    solverOptimalMoveKeys,
  };
}

function binarySummary(rows, geometryId) {
  const wins = rows.filter((row) => row.exact["EXACT-VALUE"] === "WIN");
  const losses = rows.filter((row) => row.exact["EXACT-VALUE"] === "LOSS");
  let greater = 0, less = 0, tie = 0;
  for (const win of wins) for (const loss of losses) {
    const c = compare(win.geometry[geometryId], loss.geometry[geometryId]);
    if (c > 0) greater += 1; else if (c < 0) less += 1; else tie += 1;
  }
  const informative = greater + less;
  let classification;
  if (informative === 0) classification = "NON-ESTIMABLE-NO-INFORMATIVE-CROSS-CLASS-PAIRS";
  else if (greater > 0 && less === 0) classification = "WIN-GREATER-ORDER-CONSISTENT";
  else if (less > 0 && greater === 0) classification = "WIN-LESS-ORDER-CONSISTENT";
  else classification = "MIXED-ORDER";
  return {
    measuredDomains: rows.length,
    winRoots: wins.length,
    lossRoots: losses.length,
    pairCount: wins.length * losses.length,
    WIN_GREATER: greater,
    WIN_LESS: less,
    TIE: tie,
    informativePairs: informative,
    completeSeparation: tie === 0 && ((greater === wins.length * losses.length && less === 0) || (less === wins.length * losses.length && greater === 0)),
    classification,
  };
}

function hasVariation(values) {
  if (values.length < 2) return false;
  return values.slice(1).some((value) => compare(values[0], value) !== 0);
}

function orderedSummary(rows, geometryId, consequenceId) {
  let concordant = 0, discordant = 0, geometryTie = 0, consequenceTie = 0, bothTie = 0;
  for (let i = 0; i < rows.length; i += 1) for (let j = i + 1; j < rows.length; j += 1) {
    const g = compare(rows[i].geometry[geometryId], rows[j].geometry[geometryId]);
    const c = compare(integerFraction(rows[i].exact[consequenceId]), integerFraction(rows[j].exact[consequenceId]));
    if (g === 0 && c === 0) bothTie += 1;
    else if (g === 0) geometryTie += 1;
    else if (c === 0) consequenceTie += 1;
    else if (g === c) concordant += 1;
    else discordant += 1;
  }
  const geometryVariation = hasVariation(rows.map((row) => row.geometry[geometryId]));
  const consequenceVariation = hasVariation(rows.map((row) => integerFraction(row.exact[consequenceId])));
  const informative = concordant + discordant;
  let classification;
  if (!geometryVariation) classification = "NON-ESTIMABLE-NO-GEOMETRY-VARIATION";
  else if (!consequenceVariation) classification = "NON-ESTIMABLE-NO-CONSEQUENCE-VARIATION";
  else if (informative === 0) classification = "NON-ESTIMABLE-NO-INFORMATIVE-PAIRS";
  else if (concordant > 0 && discordant === 0) classification = "MONOTONE-INCREASING-ORDER-CONSISTENT";
  else if (discordant > 0 && concordant === 0) classification = "MONOTONE-DECREASING-ORDER-CONSISTENT";
  else classification = "MIXED-ORDER";
  return {
    measuredDomains: rows.length,
    pairCount: rows.length * (rows.length - 1) / 2,
    CONCORDANT: concordant,
    DISCORDANT: discordant,
    GEOMETRY_TIE: geometryTie,
    CONSEQUENCE_TIE: consequenceTie,
    BOTH_TIE: bothTie,
    informativePairs: informative,
    geometryVariation,
    consequenceVariation,
    classification,
  };
}

function relationMatrix(rows, spec) {
  need(rows.length === spec.domainCount, "formal row count mismatch");
  const result = [];
  for (const relation of spec.relationMatrix) {
    const summary = relation.consequence === "EXACT-VALUE"
      ? binarySummary(rows, relation.geometry)
      : orderedSummary(rows, relation.geometry, relation.consequence);
    result.push({ ...relation, summary });
  }
  return result;
}

module.exports = { fraction, normalize, compare, geometryScalars, exactConsequences, binarySummary, orderedSummary, relationMatrix };
