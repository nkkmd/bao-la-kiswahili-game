#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-confirmation-v1.json",
    candidates: "artifacts/local/phase-transition-confirmation-controls/candidate-control-metrics.csv",
    controls: "artifacts/local/phase-transition-confirmation-controls/control-point-metrics.csv",
    output: "artifacts/local/phase-transition-confirmation",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--config") options.config = value;
    else if (key === "--candidates") options.candidates = value;
    else if (key === "--controls") options.controls = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function integer(row, names) {
  for (const name of names) {
    if (row[name] !== undefined && row[name] !== "") {
      const value = Number(row[name]);
      if (Number.isFinite(value)) return value;
    }
  }
  return null;
}

function groupName(row) {
  return row.group || row.population || row.sample || "";
}

function terminalDistance(row) {
  return integer(row, ["distanceToTerminal", "terminalDistance", "pliesRemaining"]);
}

function rate(numerator, denominator) {
  return denominator ? numerator / denominator : null;
}

function evaluate(config, rows) {
  const minimumRemaining = config.primaryPopulation.minimumPliesRemaining;
  const primary = rows.filter((row) => {
    const distance = terminalDistance(row);
    return distance === null || distance >= minimumRemaining;
  });
  const candidates = primary.filter((row) => groupName(row) === "candidate");
  const controls = primary.filter((row) => groupName(row) === "control");
  const isExpansion = (row) => row.classification === "capture-branch-expansion";
  const candidateExpansionCount = candidates.filter(isExpansion).length;
  const controlExpansionCount = controls.filter(isExpansion).length;
  const candidateRate = rate(candidateExpansionCount, candidates.length);
  const controlRate = rate(controlExpansionCount, controls.length);
  const riskRatio = candidateRate === null || controlRate === null
    ? null
    : controlRate === 0 ? (candidateRate > 0 ? Infinity : null) : candidateRate / controlRate;

  const criteria = config.successCriteria;
  const checks = {
    minimumPrimaryCandidateCount: candidates.length >= criteria.minimumPrimaryCandidateCount,
    minimumExpansionCandidateCount: candidateExpansionCount >= criteria.minimumExpansionCandidateCount,
    minimumControlPointCount: controls.length >= criteria.minimumControlPointCount,
    minimumRiskRatio: riskRatio !== null && riskRatio >= criteria.minimumRiskRatio,
    candidateRateGreaterThanControlRate: !criteria.requireCandidateRateGreaterThanControlRate
      || (candidateRate !== null && controlRate !== null && candidateRate > controlRate),
  };
  const valid = candidates.length > 0 && controls.length > 0;
  const decision = !valid ? "inconclusive" : Object.values(checks).every(Boolean) ? "confirmed" : "not-confirmed";
  return {
    analysisVersion: config.analysisVersion,
    experimentId: config.experimentId,
    preregistrationStatus: config.status,
    primaryPopulation: { minimumPliesRemaining: minimumRemaining },
    counts: {
      inputRows: rows.length,
      primaryCandidates: candidates.length,
      primaryControls: controls.length,
      candidateExpansion: candidateExpansionCount,
      controlExpansion: controlExpansionCount,
    },
    rates: { candidateExpansionRate: candidateRate, controlExpansionRate: controlRate, riskRatio },
    checks,
    decision,
  };
}

function csvSummary(result) {
  return [{
    experimentId: result.experimentId,
    decision: result.decision,
    primaryCandidates: result.counts.primaryCandidates,
    candidateExpansion: result.counts.candidateExpansion,
    candidateExpansionRate: result.rates.candidateExpansionRate,
    primaryControls: result.counts.primaryControls,
    controlExpansion: result.counts.controlExpansion,
    controlExpansionRate: result.rates.controlExpansionRate,
    riskRatio: result.rates.riskRatio,
    allCriteriaPass: Object.values(result.checks).every(Boolean),
  }];
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const config = JSON.parse(fs.readFileSync(path.resolve(options.config), "utf8"));
  const candidates = IO.readCsv(path.resolve(options.candidates)).map((row) => ({ ...row, group: "candidate" }));
  const controls = IO.readCsv(path.resolve(options.controls)).map((row) => ({ ...row, group: "control" }));
  const result = evaluate(config, [...candidates, ...controls]);
  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "confirmation-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  IO.writeCsv(path.join(output, "confirmation-summary.csv"), csvSummary(result));
  console.log(JSON.stringify(result, null, 2));
  if (result.decision === "inconclusive") process.exitCode = 2;
}

if (require.main === module) main();
module.exports = { evaluate, terminalDistance };
