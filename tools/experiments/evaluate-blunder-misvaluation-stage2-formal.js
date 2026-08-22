#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { hashValue } = require("./lib/position-typology-features.js");
const Formal = require("./lib/blunder-misvaluation-stage2-formal.js");
const C = require("./lib/blunder-misvaluation-stage2-corpus.js");

function ratio(successes, total) {
  return total ? successes / total : null;
}

function countBy(rows, field) {
  const counts = {};
  for (const row of rows) counts[row[field]] = (counts[row[field]] || 0) + 1;
  return counts;
}

function candidateSummary(candidate, rows, spec, technicalIntegrityPassed) {
  const total = rows.length;
  const openingCounts = countBy(rows, "openingPrefixHash");
  const conditionCounts = countBy(rows, "conditionId");
  const failurePositive = rows.filter((row) =>
    row.formalByCandidate[candidate.formalCandidateId]?.failureTokenHolds === true).length;
  const d3Inferior = rows.filter((row) => row.formal.d3Inferior === true).length;
  const d3TopSet = rows.filter((row) => row.formal.d3TopSet === true).length;
  const summary = {
    formalCandidateId: candidate.formalCandidateId,
    sourceStage1CandidateId: candidate.sourceStage1CandidateId,
    supportGroupId: candidate.supportGroupId,
    failureToken: candidate.failureToken,
    failureFamily: candidate.failureFamily,
    selectedRoots: total,
    uniqueHistoricalTrajectories: new Set(rows.map((row) => row.historicalTrajectoryHash)).size,
    uniqueRuleStates: new Set(rows.map((row) => row.ruleStateKey)).size,
    distinctOpeningPrefixes: Object.keys(openingCounts).length,
    maximumSingleOpeningPrefixShare: Formal.maxShare(openingCounts, total),
    generationStrata: Object.keys(conditionCounts).length,
    maximumSingleGenerationStratumShare: Formal.maxShare(conditionCounts, total),
    openingPrefixCounts: openingCounts,
    generationStratumCounts: conditionCounts,
    failurePositiveCount: failurePositive,
    failureSignatureRate: ratio(failurePositive, total),
    d3InferiorCount: d3Inferior,
    d3InferiorRate: ratio(d3Inferior, total),
    d3TopSetCount: d3TopSet,
    d3TopSetRate: ratio(d3TopSet, total),
    medianNormalizedRankLoss: Formal.median(rows.map((row) => row.formal.normalizedRankLoss)),
    technicalIntegrityPassed,
  };
  summary.estimabilityGates = Formal.estimabilityGates(summary, spec);
  summary.estimable = Object.values(summary.estimabilityGates).every(Boolean);
  return summary;
}

function endpointEntries(summaries, spec) {
  const failureSpec = spec.coPrimaryEndpoints.find((row) => row.id === "failure-signature-recurrence");
  const d3Spec = spec.coPrimaryEndpoints.find((row) => row.id === "d3-inferior-recurrence");
  const entries = [];
  for (const summary of summaries) {
    const endpoints = [
      {
        endpoint: failureSpec.id,
        successes: summary.failurePositiveCount,
        total: summary.selectedRoots,
        observedRate: summary.failureSignatureRate,
        endpointSpec: failureSpec,
      },
      {
        endpoint: d3Spec.id,
        successes: summary.d3InferiorCount,
        total: summary.selectedRoots,
        observedRate: summary.d3InferiorRate,
        endpointSpec: d3Spec,
      },
    ];
    for (const endpoint of endpoints) {
      const rawPValue = Formal.exactBinomialUpper(
        endpoint.successes,
        endpoint.total,
        endpoint.endpointSpec.nullProbability,
      );
      entries.push({
        id: `${summary.formalCandidateId}:${endpoint.endpoint}`,
        formalCandidateId: summary.formalCandidateId,
        endpoint: endpoint.endpoint,
        successes: endpoint.successes,
        total: endpoint.total,
        observedRate: endpoint.observedRate,
        nullProbability: endpoint.endpointSpec.nullProbability,
        alternative: endpoint.endpointSpec.alternative,
        test: endpoint.endpointSpec.test,
        minimumObservedRateForConfirmation:
          endpoint.endpointSpec.minimumObservedRateForConfirmation,
        rawPValue,
        pValue: summary.estimable && summary.technicalIntegrityPassed
          ? rawPValue
          : spec.multiplicity.nonEstimableEndpointPValueForFamily,
        substitutedForNonEstimabilityOrTechnicalFailure:
          !(summary.estimable && summary.technicalIntegrityPassed),
      });
    }
  }
  return entries;
}

function evaluateFromRows({
  spec,
  specSha256,
  candidates,
  candidateSha256,
  selectionAudit,
  measurementManifest,
  measurementVerification,
  rowsBySupportGroup,
}) {
  if (selectionAudit.specSha256 !== specSha256
      || selectionAudit.candidateDefinitionSha256 !== candidateSha256
      || selectionAudit.selectionIntegrityPassed !== true
      || selectionAudit.stage1IdentityFirewallPassed !== true) {
    throw new Error("Formal evaluation blocked: selection binding/integrity mismatch");
  }
  if (measurementManifest.specSha256 !== specSha256
      || measurementManifest.candidateDefinitionSha256 !== candidateSha256
      || measurementManifest.selectionHash !== selectionAudit.selectionHash
      || measurementManifest.measurementIntegrityPassed !== true) {
    throw new Error("Formal evaluation blocked: measurement manifest binding/integrity mismatch");
  }
  if (measurementVerification.specSha256 !== specSha256
      || measurementVerification.candidateDefinitionSha256 !== candidateSha256
      || measurementVerification.selectionHash !== selectionAudit.selectionHash
      || measurementVerification.measurementHash !== measurementManifest.measurementHash
      || measurementVerification.passed !== true
      || measurementVerification.measurementHashMatches !== true
      || measurementVerification.stage1IdentityFirewallPassed !== true) {
    throw new Error("Formal evaluation blocked: independent measurement verification mismatch");
  }

  const technicalIntegrityPassed = true;
  const summaries = candidates.formalCandidates.map((candidate) => {
    const rows = rowsBySupportGroup[candidate.supportGroupId] || [];
    return candidateSummary(candidate, rows, spec, technicalIntegrityPassed);
  });
  const endpointFamily = endpointEntries(summaries, spec);
  if (endpointFamily.length !== spec.multiplicity.plannedTests) {
    throw new Error(`Planned multiplicity family mismatch: ${endpointFamily.length}`);
  }
  const adjustedFamily = Formal.holmBonferroni(
    endpointFamily,
    spec.multiplicity.familyWiseAlpha,
  );
  const candidateResults = summaries.map((summary) => {
    const endpoints = adjustedFamily.filter((entry) =>
      entry.formalCandidateId === summary.formalCandidateId);
    return {
      ...summary,
      coPrimaryEndpoints: endpoints,
      consistencyGates: {
        d3TopSetRate: summary.d3TopSetRate <= spec.consistencyGates.maximumD3TopSetRate,
        medianNormalizedRankLoss:
          summary.medianNormalizedRankLoss >= spec.consistencyGates.minimumMedianNormalizedRankLoss,
      },
      formalDecision: Formal.candidateDecision(summary, endpoints, spec),
    };
  });

  const confirmed = candidateResults.filter((row) => row.formalDecision === "CONFIRMED");
  const core = {
    schemaVersion: 1,
    studyId: "BMP-STUDY1",
    stageId: spec.stageId,
    formalExperiment: true,
    specSha256,
    candidateDefinitionSha256: candidateSha256,
    selectionHash: selectionAudit.selectionHash,
    measurementHash: measurementManifest.measurementHash,
    independentMeasurementVerificationHash: measurementVerification.verificationHash,
    multiplicity: {
      family: spec.multiplicity.family,
      plannedTests: spec.multiplicity.plannedTests,
      alpha: spec.multiplicity.familyWiseAlpha,
      method: spec.multiplicity.method,
      endpoints: adjustedFamily,
    },
    candidateResults,
    studySummary: {
      formalCandidateCount: candidateResults.length,
      confirmedCount: confirmed.length,
      confirmedCandidateIds: confirmed.map((row) => row.formalCandidateId),
      zeroConfirmedIsValidOutcome: true,
    },
    interpretationBoundary: spec.interpretationBoundary,
    noRescue: spec.noRescue,
  };
  return { ...core, resultHash: hashValue(core) };
}

function loadRows(output, measurementManifest) {
  const rowsBySupportGroup = {};
  for (const [supportGroupId, count] of Object.entries(
    measurementManifest.completedMeasurementsBySupportGroup,
  )) {
    rowsBySupportGroup[supportGroupId] = Array.from({ length: count }, (_, index) =>
      C.readJson(C.supportGroupMeasurementPath(output, supportGroupId, index)));
  }
  return rowsBySupportGroup;
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
  const measurementVerification = C.readJson(path.join(options.output, "measurement-verification.json"));
  const rowsBySupportGroup = loadRows(options.output, measurementManifest);
  const result = evaluateFromRows({
    spec,
    specSha256,
    candidates,
    candidateSha256,
    selectionAudit,
    measurementManifest,
    measurementVerification,
    rowsBySupportGroup,
  });
  C.writeJson(path.join(options.output, "stage2-formal-result.json"), result);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();

module.exports = {
  candidateSummary,
  countBy,
  endpointEntries,
  evaluateFromRows,
  loadRows,
  parseArgs,
  ratio,
};
