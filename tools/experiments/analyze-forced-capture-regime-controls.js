#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const R = require("./lib/forced-capture-regimes.js");
const C = require("./lib/regime-control-analysis.js");
const IO = require("./analyze-forced-capture-regimes.js");

function parseArgs(argv) {
  const options = {
    observations: "artifacts/phase-transition/pilot-v2-current-source/observations.jsonl",
    candidates: "artifacts/local/phase-transition-archetypes-current-source/archetype-members.csv",
    output: "artifacts/local/phase-transition-regime-controls-current-source",
    before: 3,
    after: 8,
    exclusionBuffer: 8,
  };
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]; const value = argv[i + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--observations") options.observations = value;
    else if (key === "--candidates") options.candidates = value;
    else if (key === "--output") options.output = value;
    else if (key === "--before") options.before = Number(value);
    else if (key === "--after") options.after = Number(value);
    else if (key === "--exclusion-buffer") options.exclusionBuffer = Number(value);
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function rate(count, total) { return total ? count / total : null; }

function main() {
  const options = parseArgs(process.argv.slice(2));
  const observations = IO.readJsonl(path.resolve(options.observations));
  const members = IO.readCsv(path.resolve(options.candidates)).filter((row) => row.category === "A");
  const regimes = R.extractForcedCaptureRegimes(observations);
  const gameRows = R.groupByGame(observations);
  const candidatePoints = members.map((row) => ({ ...row, ply: Number(row.representativePly) }));
  const controls = observations
    .filter((row) => row.forcedCapture === true)
    .filter((row) => !C.overlapsCandidate(row, members, options.exclusionBuffer))
    .filter((row) => {
      const rows = gameRows.get(row.gameId) || [];
      return row.ply >= options.before && (rows.at(-1)?.ply ?? row.ply) - row.ply >= options.after;
    })
    .map((row, index) => ({ archetypeId: `control-${index}`, category: "CONTROL", gameId: row.gameId, ply: row.ply }));

  const sensitivity = [];
  let primaryCandidates = []; let primaryControls = [];
  for (const setting of C.sensitivitySettings()) {
    const config = { before: options.before, after: options.after, ...setting };
    const candidates = candidatePoints.map((row) => R.analyzeCandidate(row, gameRows, regimes, config));
    const controlRows = controls.map((row) => R.analyzeCandidate(row, gameRows, regimes, config));
    const cc = C.classCounts(candidates); const kc = C.classCounts(controlRows);
    for (const classification of [...new Set([...Object.keys(cc), ...Object.keys(kc)])].sort()) {
      const candidateCount = cc[classification] || 0; const controlCount = kc[classification] || 0;
      sensitivity.push({ ...setting, classification, candidateCount, candidateRate: rate(candidateCount, candidates.length), controlCount, controlRate: rate(controlCount, controlRows.length), rateDifference: rate(candidateCount, candidates.length) - rate(controlCount, controlRows.length) });
    }
    if (setting.expansionDelta === 3 && setting.persistenceFraction === 0.5 && setting.eventWindow === 8) {
      primaryCandidates = candidates; primaryControls = controlRows;
    }
  }

  const summary = {
    analysisVersion: "7-forced-capture-regime-controls",
    observationCount: observations.length,
    regimeCount: regimes.length,
    candidateMemberCount: members.length,
    controlPointCount: controls.length,
    exclusionBuffer: options.exclusionBuffer,
    candidateClassCounts: C.classCounts(primaryCandidates),
    controlClassCounts: C.classCounts(primaryControls),
    sensitivitySettingCount: C.sensitivitySettings().length,
  };
  const output = path.resolve(options.output); fs.mkdirSync(output, { recursive: true });
  IO.writeCsv(path.join(output, "candidate-control-metrics.csv"), primaryCandidates);
  IO.writeCsv(path.join(output, "control-point-metrics.csv"), primaryControls);
  IO.writeCsv(path.join(output, "classification-sensitivity.csv"), sensitivity);
  fs.writeFileSync(path.join(output, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}

if (require.main === module) main();
module.exports = { parseArgs };
