"use strict";

function div(a, b) { return b === 0 ? null : a / b; }
function tally(list) {
  const result = Object.create(null);
  for (const item of list) result[item] = (result[item] || 0) + 1;
  return result;
}
function dominantShare(table, total) {
  const vals = Object.keys(table).map((key) => table[key]);
  if (!total || !vals.length) return 0;
  return Math.max(...vals) / total;
}
function d3(row) {
  for (const search of row.searches) if (search.conditionId === "D3_Q1_REFERENCE") return search;
  throw new Error("Independent aggregation missing D3_Q1_REFERENCE");
}
function independentlySummarizeCell(axis, level, population, contract) {
  const rows = population.filter((row) => `${row.boundary[axis.id]}` === `${level}`);
  const total = rows.length;
  const prefixes = tally(rows.map((row) => row.openingPrefixHash));
  const strata = tally(rows.map((row) => row.stratumId));
  const families = tally(rows.map((row) => row.sourceFamily));
  const structural = rows.reduce((sum, row) => sum + (row.structuralSupport ? 1 : 0), 0);
  const tactical = rows.reduce((sum, row) => sum + (d3(row).candidateIsTopSet ? 1 : 0), 0);
  const g = contract.stage1CellEstimability;
  const gates = {
    minimumRoots: total >= g.minimumRoots,
    minimumDistinctOpeningPrefixes: Object.keys(prefixes).length >= g.minimumDistinctOpeningPrefixes,
    maximumSingleOpeningPrefixShare: dominantShare(prefixes, total) <= g.maximumSingleOpeningPrefixShare,
    minimumSourceStrata: Object.keys(strata).length >= g.minimumSourceStrata,
    maximumSingleSourceStratumShare: dominantShare(strata, total) <= g.maximumSingleSourceStratumShare,
    minimumSourceFamilies: Object.keys(families).length >= g.minimumSourceFamilies,
    maximumSingleSourceFamilyShare: dominantShare(families, total) <= g.maximumSingleSourceFamilyShare,
  };
  const ok = Object.keys(gates).every((key) => gates[key]);
  const sr = div(structural, total);
  const tr = div(tactical, total);
  const sf = total ? (total - structural) / total : null;
  const tf = total ? (total - tactical) / total : null;
  let label = "NON-ESTIMABLE";
  const triggers = [];
  if (ok) {
    const cStructural = sf >= 0.15;
    const cTactical = tf >= 0.55;
    if (cStructural || cTactical) {
      label = "COUNTEREXAMPLE-CANDIDATE";
      if (cStructural) triggers.push("STRUCTURAL-FAILURE");
      if (cTactical) triggers.push("REFERENCE-TACTICAL-FAILURE");
    } else if (sr >= 0.90 && tr >= 0.60) label = "GENERALIZATION-CANDIDATE";
    else label = "MIXED-CANDIDATE";
  }
  return {
    axisId: axis.id, level: String(level), roots: total,
    distinctOpeningPrefixes: Object.keys(prefixes).length,
    maximumSingleOpeningPrefixShare: dominantShare(prefixes, total),
    sourceStrata: Object.keys(strata).length,
    maximumSingleSourceStratumShare: dominantShare(strata, total),
    sourceFamilies: Object.keys(families).length,
    maximumSingleSourceFamilyShare: dominantShare(families, total),
    structuralSuccesses: structural, structuralSuccessRate: sr, structuralFailureRate: sf,
    referenceTopSetSuccesses: tactical, referenceTopSetRate: tr, referenceNonTopSetRate: tf,
    estimability: gates, estimable: ok, classification: label, counterexampleTriggers: triggers,
  };
}
function independentSearchSummary(condition, population, contract) {
  const rows = [];
  for (const measurement of population) {
    const found = measurement.searches.filter((search) => search.conditionId === condition.id);
    if (found.length !== 1) throw new Error(`Independent search count mismatch: ${condition.id}`);
    rows.push(found[0]);
  }
  const total = rows.length;
  const top = rows.filter((row) => row.candidateIsTopSet).length;
  const topRate = div(top, total);
  const nonTopRate = total ? (total - top) / total : null;
  let label = "NON-ESTIMABLE";
  if (total >= contract.stage1SearchConditionClassification.minimumRoots) {
    if (topRate >= 0.60) label = "GENERALIZATION-CANDIDATE";
    else if (nonTopRate >= 0.55) label = "COUNTEREXAMPLE-CANDIDATE";
    else label = "MIXED-CANDIDATE";
  }
  return { conditionId: condition.id, roots: total, topSetSuccesses: top, topSetRate, nonTopSetRate, classification: label };
}
function evaluate(measurements, contract, sourceAudit) {
  const cells = [];
  for (const axis of contract.prospectiveBoundaryAxes) {
    for (const level of axis.levels) cells.push(independentlySummarizeCell(axis, level, measurements, contract));
  }
  let cellCount = 0;
  for (const cell of cells) if (cell.estimable) cellCount += 1;
  let axisCount = 0;
  for (const axis of contract.prospectiveBoundaryAxes) {
    let n = 0;
    for (const cell of cells) if (cell.axisId === axis.id && cell.estimable) n += 1;
    if (n >= 2) axisCount += 1;
  }
  const searches = contract.referenceAndSensitivitySearch.conditions.map((condition) =>
    independentSearchSummary(condition, measurements, contract));
  const g = contract.stage1GlobalReadinessGates;
  const checks = {
    sourceReadinessPass: sourceAudit.sourceReadinessPass === true,
    minimumEstimableMarginalCells: cellCount >= g.minimumEstimableMarginalCells,
    minimumAxesWithAtLeastTwoEstimableLevels: axisCount >= g.minimumAxesWithAtLeastTwoEstimableLevels,
    allSelectedRootsMeasured: measurements.length === sourceAudit.selectedUniqueRawRoots,
    allFiveSearchConditionsMeasured: searches.length === 5 && searches.every((row) => row.roots === measurements.length),
  };
  const pass = Object.values(checks).reduce((a, b) => a && b, true);
  return {
    schemaVersion: "TMGC_STAGE1_BOUNDARY_RESULT_V1",
    studyId: "TMGC-STUDY1", stageId: contract.stage1Id,
    generatedGames: sourceAudit.generatedGames, selectedUniqueRawRoots: sourceAudit.selectedUniqueRawRoots,
    measurementCount: measurements.length, estimableMarginalCells: cellCount,
    axesWithAtLeastTwoEstimableLevels: axisCount, globalReadinessChecks: checks,
    sourceReadinessChecks: sourceAudit.checks, cells, searchConditions: searches,
    stage1Disposition: pass ? "STAGE1-DEVELOPMENT-PASS-BOUNDARY-FROZEN" : "STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE",
    stage2AuthorizationEligible: pass, noRescueApplied: true,
  };
}
module.exports = { evaluate };
