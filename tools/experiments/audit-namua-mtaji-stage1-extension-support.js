#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const MIN_UNIQUE_EXPOSURE_UNITS = 10;
const MIN_UNIQUE_EXPOSURE_TRAJECTORIES = 8;

function parseArgs(argv) {
  const options = {
    pilot: "artifacts/local/namua-mtaji-transition/stage1-pilot-v1",
    extension: "artifacts/local/namua-mtaji-transition/stage1-extension-v1",
    output: null,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--pilot") options.pilot = value;
    else if (key === "--extension") options.extension = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  options.output ||= path.join(options.extension, "stage1-extension-support-audit.json");
  return options;
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') { current += '"'; index += 1; }
      else quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current); current = "";
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

function countBy(values) {
  const counts = new Map();
  for (const value of values) counts.set(String(value), (counts.get(String(value)) || 0) + 1);
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })));
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function cbeRows(directory, source) {
  return readCsv(path.join(directory, "stage1-event-table.csv"))
    .filter((row) => row.candidatePhase === "namua" && row.classification === "capture-branch-expansion")
    .map((row) => ({
      source,
      gameId: row.gameId,
      conditionId: row.conditionId,
      historicalTrajectoryHash: row.historicalTrajectoryHash,
      candidatePly: Number(row.candidatePly),
      landmarkPly: Number(row.landmarkPly),
      forcedCaptureAtCandidate: String(row.forcedCaptureAtCandidate).toLowerCase() === "true",
    }));
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const pilot = path.resolve(options.pilot);
  const extension = path.resolve(options.extension);
  const extensionManifest = JSON.parse(fs.readFileSync(path.join(extension, "manifest.json"), "utf8"));
  if (extensionManifest.formalExperiment !== false
    || extensionManifest.scientificInferenceAuthorized !== false
    || extensionManifest.exploratoryAnalysisAuthorized !== true
    || extensionManifest.confirmatoryReuseAllowed !== false
    || extensionManifest.morphologyEffectInspectionAuthorized !== false) {
    throw new Error("Extension scientific boundary mismatch");
  }

  const rows = [...cbeRows(pilot, "primary-pilot"), ...cbeRows(extension, "extension")];
  const units = new Map();
  for (const row of rows) {
    const key = `${row.historicalTrajectoryHash}:${row.candidatePly}`;
    if (!units.has(key)) units.set(key, { ...row, exposureKey: key, conditionIds: new Set(), sources: new Set(), rawRows: 0 });
    const unit = units.get(key);
    unit.conditionIds.add(row.conditionId);
    unit.sources.add(row.source);
    unit.rawRows += 1;
  }
  const unique = [...units.values()].map((unit) => ({
    exposureKey: unit.exposureKey,
    historicalTrajectoryHash: unit.historicalTrajectoryHash,
    candidatePly: unit.candidatePly,
    landmarkPly: unit.landmarkPly,
    forcedCaptureAtCandidate: unit.forcedCaptureAtCandidate,
    conditionIds: [...unit.conditionIds].sort(),
    sources: [...unit.sources].sort(),
    rawConditionRows: unit.rawRows,
  })).sort((a, b) => a.candidatePly - b.candidatePly || a.exposureKey.localeCompare(b.exposureKey));

  const byTrajectory = new Map();
  for (const unit of unique) {
    if (!byTrajectory.has(unit.historicalTrajectoryHash)) byTrajectory.set(unit.historicalTrajectoryHash, []);
    byTrajectory.get(unit.historicalTrajectoryHash).push(unit);
  }

  const readiness = unique.length >= MIN_UNIQUE_EXPOSURE_UNITS
    && byTrajectory.size >= MIN_UNIQUE_EXPOSURE_TRAJECTORIES;
  const report = {
    schemaVersion: 1,
    status: "stage1-combined-exposure-support-audit-complete",
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    exploratoryAnalysisAuthorized: true,
    confirmatoryReuseAllowed: false,
    morphologyEffectInspectionAuthorized: false,
    supportPolicy: {
      exposure: "Namua Category-A classified capture-branch-expansion",
      deduplicationKey: "historicalTrajectoryHash + candidatePly",
      minimumUniqueExposureUnits: MIN_UNIQUE_EXPOSURE_UNITS,
      minimumUniqueExposureTrajectories: MIN_UNIQUE_EXPOSURE_TRAJECTORIES,
    },
    rawCbeRows: rows.length,
    uniqueCbeTrajectoryPlyUnits: unique.length,
    uniqueCbeHistoricalTrajectories: byTrajectory.size,
    uniqueCbeBearingTrajectoriesWithMultipleEvents: [...byTrajectory.values()].filter((group) => group.length > 1).length,
    candidatePlyCounts: countBy(unique.map((row) => row.candidatePly)),
    rawConditionCounts: countBy(rows.map((row) => row.conditionId)),
    sourceCounts: countBy(rows.map((row) => row.source)),
    duplicateConditionRows: rows.length - unique.length,
    stage2DesignReadinessMinimumMet: readiness,
    exposures: unique,
    interpretationBoundary: {
      morphologyLabelsRead: false,
      morphologyEffectInspected: false,
      pValuesComputed: false,
      comparatorFrozen: false,
      formalModelFrozen: false,
      readinessIsDesignFeasibilityNotStatisticalConfirmation: true,
    },
  };
  atomicWriteJson(path.resolve(options.output), report);
  console.log(JSON.stringify(report, null, 2));
}

if (require.main === module) main();
