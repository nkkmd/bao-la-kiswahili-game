#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");
const Confirmation = require("./evaluate-phase-transition-confirmation.js");
const Robustness = require("./lib/phase-transition-robustness.js");

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-robustness-v1.json",
    input: "artifacts/local/phase-transition-robustness",
    output: "artifacts/local/phase-transition-robustness/evaluation",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--config") options.config = value;
    else if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function conditionEvaluationConfig(config) {
  return {
    analysisVersion: config.analysisVersion,
    experimentId: config.experimentId,
    status: config.status,
    primaryPopulation: config.primaryPopulation,
    successCriteria: config.conditionSuccessCriteria,
  };
}

function readJsonIfExists(filePath) {
  return fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, "utf8")) : null;
}

function evaluateCondition(config, condition, candidatesPath, controlsPath, trajectorySensitivity = null) {
  const candidates = IO.readCsv(candidatesPath)
    .map((row) => ({ ...row, group: "candidate" }));
  const controls = IO.readCsv(controlsPath)
    .map((row) => ({ ...row, group: "control" }));
  const result = Confirmation.evaluate(
    conditionEvaluationConfig(config),
    [...candidates, ...controls],
  );
  return {
    conditionId: condition.id,
    role: condition.role,
    parameters: {
      level: condition.level,
      evaluationProfile: condition.evaluationProfile,
      searchProfile: condition.searchProfile,
      maxDepth: condition.maxDepth,
    },
    status: Robustness.conditionStatus(result),
    result,
    trajectorySensitivity,
  };
}

function conditionCsvRows(conditionResults) {
  return conditionResults.map((item) => {
    const deduplicated = item.trajectorySensitivity?.trajectoryPlyDeduplicatedEndpoint;
    const structure = item.trajectorySensitivity?.candidateStructure;
    return {
      conditionId: item.conditionId,
      role: item.role,
      status: item.status,
      level: item.parameters.level,
      evaluationProfile: item.parameters.evaluationProfile,
      searchProfile: item.parameters.searchProfile,
      maxDepth: item.parameters.maxDepth,
      primaryCandidates: item.result.counts.primaryCandidates,
      candidateExpansion: item.result.counts.candidateExpansion,
      candidateExpansionRate: item.result.rates.candidateExpansionRate,
      primaryControls: item.result.counts.primaryControls,
      controlExpansion: item.result.counts.controlExpansion,
      controlExpansionRate: item.result.rates.controlExpansionRate,
      riskRatio: item.result.rates.riskRatio,
      uniqueTrajectoryPlyCandidates: deduplicated?.counts?.candidates ?? null,
      uniqueTrajectoryPlyCandidateExpansion:
        deduplicated?.counts?.candidateExpansion ?? null,
      uniqueTrajectoryPlyControls: deduplicated?.counts?.controls ?? null,
      uniqueTrajectoryPlyControlExpansion:
        deduplicated?.counts?.controlExpansion ?? null,
      trajectoryPlyDeduplicatedRiskRatio: deduplicated?.rates?.riskRatio ?? null,
      uniqueCandidateTrajectories: structure?.uniqueTrajectoryCount ?? null,
      uniqueExpansionTrajectories: structure?.uniqueExpansionTrajectoryCount ?? null,
      uniqueCandidateArchetypes: structure?.uniqueArchetypeCount ?? null,
      uniqueExpansionArchetypes: structure?.uniqueExpansionArchetypeCount ?? null,
      largestTrajectoryPlyMultiplicity:
        structure?.largestTrajectoryPlyMultiplicity ?? null,
      minimumPrimaryCandidateCount:
        item.result.checks.minimumPrimaryCandidateCount,
      minimumExpansionCandidateCount:
        item.result.checks.minimumExpansionCandidateCount,
      minimumControlPointCount:
        item.result.checks.minimumControlPointCount,
      minimumRiskRatio: item.result.checks.minimumRiskRatio,
      candidateRateGreaterThanControlRate:
        item.result.checks.candidateRateGreaterThanControlRate,
    };
  });
}

function globalCsvRows(result) {
  const statuses = result.conditions.reduce((counts, item) => {
    counts[item.status] = (counts[item.status] || 0) + 1;
    return counts;
  }, {});
  const ratios = result.conditions
    .map((item) => item.result.rates.riskRatio)
    .filter((value) => Number.isFinite(value));
  const deduplicatedRatios = result.conditions
    .map((item) => item.trajectorySensitivity
      ?.trajectoryPlyDeduplicatedEndpoint?.rates?.riskRatio)
    .filter((value) => Number.isFinite(value));
  return [{
    experimentId: result.experimentId,
    decision: result.decision,
    conditionCount: result.conditions.length,
    passCount: statuses.pass || 0,
    insufficientCount: statuses.insufficient || 0,
    failCount: statuses.fail || 0,
    inconclusiveCount: statuses.inconclusive || 0,
    trajectorySensitivityComplete:
      result.conditions.every((item) => item.trajectorySensitivity !== null),
    minimumFiniteRiskRatio: ratios.length ? Math.min(...ratios) : null,
    maximumFiniteRiskRatio: ratios.length ? Math.max(...ratios) : null,
    minimumFiniteTrajectoryPlyDeduplicatedRiskRatio:
      deduplicatedRatios.length ? Math.min(...deduplicatedRatios) : null,
    maximumFiniteTrajectoryPlyDeduplicatedRiskRatio:
      deduplicatedRatios.length ? Math.max(...deduplicatedRatios) : null,
  }];
}

function inconclusiveCondition(config, condition, controlsRoot) {
  return {
    conditionId: condition.id,
    role: condition.role,
    parameters: {
      level: condition.level,
      evaluationProfile: condition.evaluationProfile,
      searchProfile: condition.searchProfile,
      maxDepth: condition.maxDepth,
    },
    status: "inconclusive",
    result: {
      analysisVersion: config.analysisVersion,
      experimentId: config.experimentId,
      counts: {
        inputRows: 0,
        primaryCandidates: 0,
        primaryControls: 0,
        candidateExpansion: 0,
        controlExpansion: 0,
      },
      rates: {
        candidateExpansionRate: null,
        controlExpansionRate: null,
        riskRatio: null,
      },
      checks: {
        minimumPrimaryCandidateCount: false,
        minimumExpansionCandidateCount: false,
        minimumControlPointCount: false,
        minimumRiskRatio: false,
        candidateRateGreaterThanControlRate: false,
      },
      decision: "inconclusive",
      error: `Missing candidate/control metrics under ${controlsRoot}`,
    },
    trajectorySensitivity: null,
  };
}

function evaluate(options) {
  const loaded = Robustness.loadPreregistration(options.config);
  const input = path.resolve(options.input);
  const conditionResults = loaded.config.conditions.map((condition) => {
    const conditionRoot = path.join(input, condition.id);
    const controlsRoot = path.join(conditionRoot, "controls");
    const candidatesPath = path.join(controlsRoot, "candidate-control-metrics.csv");
    const controlsPath = path.join(controlsRoot, "control-point-metrics.csv");
    if (!fs.existsSync(candidatesPath) || !fs.existsSync(controlsPath)) {
      return inconclusiveCondition(loaded.config, condition, controlsRoot);
    }
    const trajectorySensitivity = readJsonIfExists(path.join(
      conditionRoot,
      "trajectory-audit",
      "trajectory-duplication-summary.json",
    ));
    return evaluateCondition(
      loaded.config,
      condition,
      candidatesPath,
      controlsPath,
      trajectorySensitivity,
    );
  });

  const decision = Robustness.globalDecision(loaded.config, conditionResults);
  const result = {
    experimentId: loaded.config.experimentId,
    analysisVersion: loaded.config.analysisVersion,
    preregistrationStatus: loaded.config.status,
    preregistrationConfigSha256: loaded.sha256,
    decision,
    trajectorySensitivityComplete:
      conditionResults.every((item) => item.trajectorySensitivity !== null),
    conditions: conditionResults,
  };
  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(
    path.join(output, "robustness-result.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  IO.writeCsv(
    path.join(output, "condition-summary.csv"),
    conditionCsvRows(conditionResults),
  );
  IO.writeCsv(
    path.join(output, "robustness-summary.csv"),
    globalCsvRows(result),
  );
  console.log(JSON.stringify(result, null, 2));
  if (decision === "inconclusive") process.exitCode = 2;
  return result;
}

if (require.main === module) {
  try {
    evaluate(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  conditionCsvRows,
  conditionEvaluationConfig,
  evaluate,
  evaluateCondition,
  globalCsvRows,
  inconclusiveCondition,
  parseArgs,
  readJsonIfExists,
};
