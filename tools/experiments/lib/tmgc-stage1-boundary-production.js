"use strict";

function ratio(n, d) { return d ? n / d : null; }
function counts(values) {
  const out = {};
  for (const value of values) out[value] = (out[value] || 0) + 1;
  return out;
}
function maxShare(map, total) {
  const values = Object.values(map);
  return total && values.length ? Math.max(...values) / total : 0;
}
function referenceRow(row) {
  const found = row.searches.find((entry) => entry.conditionId === "D3_Q1_REFERENCE");
  if (!found) throw new Error("Missing D3_Q1_REFERENCE search measurement");
  return found;
}
function cellSummary(axis, level, rows, contract) {
  const n = rows.length;
  const opening = counts(rows.map((row) => row.openingPrefixHash));
  const strata = counts(rows.map((row) => row.stratumId));
  const families = counts(rows.map((row) => row.sourceFamily));
  const structuralSuccesses = rows.filter((row) => row.structuralSupport).length;
  const referenceTopSet = rows.filter((row) => referenceRow(row).candidateIsTopSet).length;
  const gate = contract.stage1CellEstimability;
  const estimability = {
    minimumRoots: n >= gate.minimumRoots,
    minimumDistinctOpeningPrefixes: Object.keys(opening).length >= gate.minimumDistinctOpeningPrefixes,
    maximumSingleOpeningPrefixShare: maxShare(opening, n) <= gate.maximumSingleOpeningPrefixShare,
    minimumSourceStrata: Object.keys(strata).length >= gate.minimumSourceStrata,
    maximumSingleSourceStratumShare: maxShare(strata, n) <= gate.maximumSingleSourceStratumShare,
    minimumSourceFamilies: Object.keys(families).length >= gate.minimumSourceFamilies,
    maximumSingleSourceFamilyShare: maxShare(families, n) <= gate.maximumSingleSourceFamilyShare,
  };
  const estimable = Object.values(estimability).every(Boolean);
  const structuralRate = ratio(structuralSuccesses, n);
  const referenceRate = ratio(referenceTopSet, n);
  const structuralFailureRate = n ? 1 - structuralRate : null;
  const referenceNonTopSetRate = n ? 1 - referenceRate : null;
  let classification = "NON-ESTIMABLE";
  const triggers = [];
  if (estimable) {
    if (structuralFailureRate >= 0.15 || referenceNonTopSetRate >= 0.55) {
      classification = "COUNTEREXAMPLE-CANDIDATE";
      if (structuralFailureRate >= 0.15) triggers.push("STRUCTURAL-FAILURE");
      if (referenceNonTopSetRate >= 0.55) triggers.push("REFERENCE-TACTICAL-FAILURE");
    } else if (structuralRate >= 0.90 && referenceRate >= 0.60) {
      classification = "GENERALIZATION-CANDIDATE";
    } else {
      classification = "MIXED-CANDIDATE";
    }
  }
  return {
    axisId: axis.id, level: String(level), roots: n,
    distinctOpeningPrefixes: Object.keys(opening).length,
    maximumSingleOpeningPrefixShare: maxShare(opening, n),
    sourceStrata: Object.keys(strata).length,
    maximumSingleSourceStratumShare: maxShare(strata, n),
    sourceFamilies: Object.keys(families).length,
    maximumSingleSourceFamilyShare: maxShare(families, n),
    structuralSuccesses, structuralSuccessRate: structuralRate, structuralFailureRate,
    referenceTopSetSuccesses: referenceTopSet, referenceTopSetRate: referenceRate, referenceNonTopSetRate,
    estimability, estimable, classification, counterexampleTriggers: triggers,
  };
}
function searchSummary(condition, rows, contract) {
  const matches = rows.map((row) => row.searches.find((entry) => entry.conditionId === condition.id));
  if (matches.some((entry) => !entry)) throw new Error(`Missing search condition: ${condition.id}`);
  const n = matches.length;
  const top = matches.filter((entry) => entry.candidateIsTopSet).length;
  const topRate = ratio(top, n);
  const nonTopRate = n ? 1 - topRate : null;
  let classification = "NON-ESTIMABLE";
  if (n >= contract.stage1SearchConditionClassification.minimumRoots) {
    classification = topRate >= 0.60 ? "GENERALIZATION-CANDIDATE"
      : nonTopRate >= 0.55 ? "COUNTEREXAMPLE-CANDIDATE" : "MIXED-CANDIDATE";
  }
  return {
    conditionId: condition.id, roots: n, topSetSuccesses: top,
    topSetRate: topRate, nonTopSetRate: nonTopRate, classification,
  };
}
function evaluate(measurements, contract, sourceAudit) {
  const cells = [];
  for (const axis of contract.prospectiveBoundaryAxes) {
    for (const level of axis.levels) {
      const rows = measurements.filter((row) => String(row.boundary[axis.id]) === String(level));
      cells.push(cellSummary(axis, level, rows, contract));
    }
  }
  const estimableCells = cells.filter((cell) => cell.estimable).length;
  const axesWithAtLeastTwoEstimableLevels = contract.prospectiveBoundaryAxes.filter((axis) =>
    cells.filter((cell) => cell.axisId === axis.id && cell.estimable).length >= 2).length;
  const searchConditions = contract.referenceAndSensitivitySearch.conditions.map((condition) =>
    searchSummary(condition, measurements, contract));
  const gate = contract.stage1GlobalReadinessGates;
  const checks = {
    sourceReadinessPass: sourceAudit.sourceReadinessPass === true,
    minimumEstimableMarginalCells: estimableCells >= gate.minimumEstimableMarginalCells,
    minimumAxesWithAtLeastTwoEstimableLevels: axesWithAtLeastTwoEstimableLevels >= gate.minimumAxesWithAtLeastTwoEstimableLevels,
    allSelectedRootsMeasured: measurements.length === sourceAudit.selectedUniqueRawRoots,
    allFiveSearchConditionsMeasured: searchConditions.length === 5
      && searchConditions.every((row) => row.roots === measurements.length),
  };
  const pass = Object.values(checks).every(Boolean);
  return {
    schemaVersion: "TMGC_STAGE1_BOUNDARY_RESULT_V1",
    studyId: "TMGC-STUDY1",
    stageId: contract.stage1Id,
    generatedGames: sourceAudit.generatedGames,
    selectedUniqueRawRoots: sourceAudit.selectedUniqueRawRoots,
    measurementCount: measurements.length,
    estimableMarginalCells: estimableCells,
    axesWithAtLeastTwoEstimableLevels,
    globalReadinessChecks: checks,
    sourceReadinessChecks: sourceAudit.checks,
    cells,
    searchConditions,
    stage1Disposition: pass ? "STAGE1-DEVELOPMENT-PASS-BOUNDARY-FROZEN" : "STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE",
    stage2AuthorizationEligible: pass,
    noRescueApplied: true,
  };
}
module.exports = { evaluate };
