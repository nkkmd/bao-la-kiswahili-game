#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { hashValue } = require("./lib/position-typology-features.js");
const Formal = require("./lib/tactical-motif-stage2-formal.js");
const C = require("./lib/tactical-motif-stage2-corpus.js");

function ratio(successes, total) {
  return total ? successes / total : null;
}

function countBy(rows, field) {
  const counts = {};
  for (const row of rows) counts[row[field]] = (counts[row[field]] || 0) + 1;
  return counts;
}

function candidateSummary(candidate, rows, spec) {
  const total = rows.length;
  const openingCounts = countBy(rows, "openingPrefixHash");
  const conditionCounts = countBy(rows, "conditionId");
  const structuralSuccesses = rows.filter((row) => row.formal.structuralSuccess).length;
  const d3TopSetSuccesses = rows.filter((row) => row.formal.d3IsTopSet).length;
  const d3AtOrAboveMedian = rows.filter((row) => row.formal.d3AtOrAboveStateMedian).length;
  const d3UniqueWorst = rows.filter((row) => row.formal.d3UniqueWorst).length;
  const pairedPrecondition = rows.filter((row) => row.diagnostic.pairedPreconditionHolds).length;
  const pairedConsequence = rows.filter((row) => row.diagnostic.pairedConsequenceHolds).length;

  const summary = {
    candidateId: candidate.candidateId,
    canonicalCandidateKey: candidate.canonicalCandidateKey,
    canonicalStage1Rank: candidate.canonicalStage1Rank,
    selectedRoots: total,
    uniqueHistoricalTrajectories: new Set(rows.map((row) => row.historicalTrajectoryHash)).size,
    uniqueRuleStates: new Set(rows.map((row) => row.ruleStateKey)).size,
    distinctOpeningPrefixes: Object.keys(openingCounts).length,
    maximumSingleOpeningPrefixShare: Formal.maxShare(openingCounts, total),
    generationStrata: Object.keys(conditionCounts).length,
    maximumSingleGenerationStratumShare: Formal.maxShare(conditionCounts, total),
    openingPrefixCounts: openingCounts,
    generationStratumCounts: conditionCounts,
    structuralSuccesses,
    structuralSuccessRate: ratio(structuralSuccesses, total),
    d3TopSetSuccesses,
    d3TopSetRate: ratio(d3TopSetSuccesses, total),
    d3AtOrAboveStateMedianCount: d3AtOrAboveMedian,
    d3AtOrAboveStateMedianRate: ratio(d3AtOrAboveMedian, total),
    d3UniqueWorstCount: d3UniqueWorst,
    d3UniqueWorstRate: ratio(d3UniqueWorst, total),
    medianD3ScoreMinusStateMedian: median(rows.map((row) => row.formal.d3ScoreMinusStateMedian)),
    medianD3ScoreMinusBestNoncandidate: median(rows.map((row) => row.formal.d3ScoreMinusBestNoncandidate)
      .filter((value) => value !== null)),
    pairedDiagnostic: {
      pairedStage1Rank: candidate.pairedDiagnosticDefinition.stage1Rank,
      pairedCandidateKey: candidate.pairedDiagnosticDefinition.candidateKey,
      pairedPreconditionHoldsCount: pairedPrecondition,
      pairedPreconditionHoldsRate: ratio(pairedPrecondition, total),
      pairedConsequenceHoldsCount: pairedConsequence,
      pairedConsequenceHoldsRate: ratio(pairedConsequence, total),
      decisionUse: false,
    },
  };
  summary.estimabilityGates = Formal.estimabilityGates(summary, spec);
  summary.estimable = Object.values(summary.estimabilityGates).every(Boolean);
  return summary;
}

function median(values) {
  if (!values.length) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function endpointEntries(candidateSummaries, spec) {
  const entries = [];
  for (const summary of candidateSummaries) {
    const endpoints = [
      {
        endpoint: "structuralSuccess",
        successes: summary.structuralSuccesses,
        total: summary.selectedRoots,
        observedRate: summary.structuralSuccessRate,
        endpointSpec: spec.formalEndpoints.structuralSuccess,
      },
      {
        endpoint: "tacticalValueSuccess",
        successes: summary.d3TopSetSuccesses,
        total: summary.selectedRoots,
        observedRate: summary.d3TopSetRate,
        endpointSpec: spec.formalEndpoints.tacticalValueSuccess,
      },
    ];
    for (const endpoint of endpoints) {
      const rawPValue = Formal.exactBinomialUpper(
        endpoint.successes,
        endpoint.total,
        endpoint.endpointSpec.nullProbability,
      );
      entries.push({
        id: `${summary.candidateId}:${endpoint.endpoint}`,
        candidateId: summary.candidateId,
        endpoint: endpoint.endpoint,
        successes: endpoint.successes,
        total: endpoint.total,
        observedRate: endpoint.observedRate,
        nullProbability: endpoint.endpointSpec.nullProbability,
        alternative: endpoint.endpointSpec.alternative,
        test: endpoint.endpointSpec.test,
        rawPValue,
        pValue: summary.estimable ? rawPValue : spec.multiplicity.nonEstimableEndpointPValueForAdjustment,
        substitutedForNonEstimability: !summary.estimable,
      });
    }
  }
  return entries;
}

function evaluateFromRows({ spec, specSha256, candidates, candidateSha256, selectionAudit, measurementManifest, rowsByCandidate }) {
  if (selectionAudit.specSha256 !== specSha256
    || selectionAudit.candidateDefinitionSha256 !== candidateSha256) {
    throw new Error("Selection audit binding mismatch");
  }
  if (measurementManifest.specSha256 !== specSha256
    || measurementManifest.candidateDefinitionSha256 !== candidateSha256
    || measurementManifest.selectionHash !== selectionAudit.selectionHash
    || measurementManifest.measurementIntegrityPassed !== true) {
    throw new Error("Formal evaluation blocked: measurement integrity binding failed");
  }

  const summaries = candidates.formalCandidates.map((candidate) => {
    const rows = rowsByCandidate[candidate.candidateId] || [];
    return candidateSummary(candidate, rows, spec);
  });

  const adjustedFamily = Formal.holmBonferroni(endpointEntries(summaries, spec), spec.multiplicity.alpha);
  const candidateResults = summaries.map((summary) => {
    const endpoints = adjustedFamily.filter((entry) => entry.candidateId === summary.candidateId);
    return {
      ...summary,
      coPrimaryEndpoints: endpoints,
      formalDecision: Formal.candidateDecision(summary, endpoints, spec),
    };
  });

  const confirmed = candidateResults.filter((result) => result.formalDecision === "CONFIRMED");
  const resultCore = {
    schemaVersion: 1,
    stageId: spec.stageId,
    formalExperiment: true,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    selectionHash: selectionAudit.selectionHash,
    measurementHash: measurementManifest.measurementHash,
    multiplicity: {
      family: spec.multiplicity.family,
      alpha: spec.multiplicity.alpha,
      method: spec.multiplicity.method,
      plannedTests: adjustedFamily.length,
      endpoints: adjustedFamily,
    },
    candidateResults,
    studySummary: {
      candidateCount: candidateResults.length,
      confirmedCount: confirmed.length,
      confirmedCandidateIds: confirmed.map((result) => result.candidateId),
      zeroConfirmedIsValidOutcome: spec.studySummary.zeroConfirmedIsValidOutcome,
      omnibusClaimRequired: spec.studySummary.omnibusClaimRequired,
    },
    interpretationBoundary: spec.interpretationBoundary,
    noRescue: spec.stoppingAndNoRescue,
  };
  return { ...resultCore, resultHash: hashValue(resultCore) };
}

function loadRows(output, measurementManifest) {
  const rowsByCandidate = {};
  for (const [candidateId, count] of Object.entries(measurementManifest.completedMeasurementsByCandidate)) {
    rowsByCandidate[candidateId] = Array.from({ length: count }, (_, index) =>
      C.readJson(C.candidateMeasurementPath(output, candidateId, index)));
  }
  return rowsByCandidate;
}

function parseArgs(argv) {
  const options = { output: C.DEFAULT_OUTPUT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") {
      options.output = path.resolve(argv[++i]);
      continue;
    }
    throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return options;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { spec, specSha256 } = C.loadSpec();
  const { candidates, candidateSha256 } = C.loadCandidates();
  C.loadAuthorization(specSha256, candidateSha256);
  const selectionAudit = C.readJson(path.join(options.output, "selection-audit.json"));
  const measurementManifest = C.readJson(path.join(options.output, "measurement-manifest.json"));
  const rowsByCandidate = loadRows(options.output, measurementManifest);
  const result = evaluateFromRows({
    spec,
    specSha256,
    candidates,
    candidateSha256,
    selectionAudit,
    measurementManifest,
    rowsByCandidate,
  });
  C.writeJson(path.join(options.output, "stage2-formal-result.json"), result);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();

module.exports = {
  candidateSummary,
  endpointEntries,
  evaluateFromRows,
  loadRows,
  median,
  parseArgs,
};
