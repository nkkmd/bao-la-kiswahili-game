#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const R = require("./lib/forced-capture-regimes.js");

function parseArgs(argv) {
  const options = {
    observations: "artifacts/phase-transition/pilot-v2/observations.jsonl",
    candidates: "artifacts/local/phase-transition-archetypes/candidate-archetypes.csv",
    output: "artifacts/local/phase-transition-forced-capture-regimes",
    before: 3,
    after: 8,
    expansionDelta: 3,
    convergenceDelta: -2,
    persistenceFraction: 0.5,
    eventWindow: 8,
  };
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--observations") options.observations = value;
    else if (key === "--candidates") options.candidates = value;
    else if (key === "--output") options.output = value;
    else if (key === "--before") options.before = Number(value);
    else if (key === "--after") options.after = Number(value);
    else if (key === "--expansion-delta") options.expansionDelta = Number(value);
    else if (key === "--convergence-delta") options.convergenceDelta = Number(value);
    else if (key === "--persistence-fraction") options.persistenceFraction = Number(value);
    else if (key === "--event-window") options.eventWindow = Number(value);
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (quoted && line[i + 1] === '"') { current += '"'; i += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else current += char;
  }
  values.push(current);
  return values;
}

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, "utf8").trim();
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const headers = parseCsvLine(lines.shift());
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function readJsonl(filePath) {
  return fs.readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => {
      try { return JSON.parse(line); }
      catch (error) { throw new Error(`Invalid JSONL at line ${index + 1}: ${error.message}`); }
    });
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, rows) {
  if (!rows.length) return fs.writeFileSync(filePath, "\n");
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(","), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(","))];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const observationsPath = path.resolve(options.observations);
  const candidatesPath = path.resolve(options.candidates);
  const outputDir = path.resolve(options.output);
  const observations = readJsonl(observationsPath);
  const candidates = readCsv(candidatesPath).filter((row) => row.category === "A");
  if (!observations.length) throw new Error("No observations found");
  if (!candidates.length) throw new Error("No category A candidates found");

  const regimes = R.extractForcedCaptureRegimes(observations);
  const gameRows = R.groupByGame(observations);
  const candidateMetrics = candidates.map((candidate) => R.analyzeCandidate(candidate, gameRows, regimes, options));
  const classCounts = Object.fromEntries(
    [...new Set(candidateMetrics.map((row) => row.classification))]
      .sort()
      .map((classification) => [classification, candidateMetrics.filter((row) => row.classification === classification).length]),
  );
  const summary = {
    analysisVersion: "6-forced-capture-regimes",
    inputObservations: path.basename(observationsPath),
    inputCandidates: path.basename(candidatesPath),
    observationCount: observations.length,
    gameCount: gameRows.size,
    regimeCount: regimes.length,
    candidateCount: candidateMetrics.length,
    candidatesOutsideRegimes: candidateMetrics.filter((row) => !row.regimeId).length,
    parameters: {
      before: options.before,
      after: options.after,
      expansionDelta: options.expansionDelta,
      convergenceDelta: options.convergenceDelta,
      persistenceFraction: options.persistenceFraction,
      eventWindow: options.eventWindow,
    },
    classCounts,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  writeCsv(path.join(outputDir, "forced-capture-regimes.csv"), regimes);
  writeCsv(path.join(outputDir, "candidate-regime-metrics.csv"), candidateMetrics);
  fs.writeFileSync(path.join(outputDir, "forced-capture-regime-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDir, "forced-capture-regime-analysis.json"), `${JSON.stringify({ summary, regimes, candidates: candidateMetrics }, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}

if (require.main === module) main();

module.exports = { parseArgs, parseCsvLine, readCsv, readJsonl, writeCsv };
