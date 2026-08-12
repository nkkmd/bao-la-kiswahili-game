#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_INPUT = "artifacts/local/namua-mtaji-transition/stage1-pilot-v1";
const LOOK_AHEAD = 8;
const INITIAL_TOTAL_RESERVE = 44;

function parseArgs(argv) {
  const options = { input: DEFAULT_INPUT, events: null, output: null };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--input") options.input = value;
    else if (key === "--events") options.events = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  options.events ||= path.join(options.input, "stage1-event-table.csv");
  options.output ||= options.input;
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

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (!rows.length) return fs.writeFileSync(filePath, "\n");
  const headers = Object.keys(rows[0]);
  const body = [headers.join(","), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(","))].join("\n");
  fs.writeFileSync(filePath, `${body}\n`);
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function bool(value) {
  if (value === true || value === "true" || value === "1") return true;
  if (value === false || value === "false" || value === "0" || value === "") return false;
  return Boolean(value);
}

function gameFiles(input) {
  const directory = path.join(input, "games");
  if (!fs.existsSync(directory)) throw new Error(`Missing games directory: ${directory}`);
  return fs.readdirSync(directory)
    .filter((name) => /^game-\d+\.json$/.test(name))
    .sort()
    .map((name) => path.join(directory, name));
}

function observationAt(game, ply) {
  return game.observations.find((row) => Number(row.ply) === Number(ply)) || null;
}

function reserveSnapshot(observation) {
  if (!observation) return { actorReserve: null, opponentReserve: null, totalReserve: null };
  const player = Number(observation.player);
  const reserve = observation.state.reserve.map(Number);
  return {
    actorReserve: reserve[player],
    opponentReserve: reserve[1 - player],
    totalReserve: reserve[0] + reserve[1],
  };
}

function snapshot(observation, prefix) {
  const nullFields = [
    "ActorReserve", "OpponentReserve", "TotalReserve", "ActorNyumbaSeeds",
    "OpponentNyumbaSeeds", "ActorLegalMoveCount", "ActorCaptureMoveCount",
    "ActorForcedCapture", "ActorFrontSeeds", "OpponentFrontSeeds",
    "ActorFrontConnections", "OpponentFrontConnections", "ActorMaxCapturableSeeds",
    "OpponentMaxCapturableSeeds",
  ];
  if (!observation) return Object.fromEntries(nullFields.map((name) => [`${prefix}${name}`, null]));
  const reserve = reserveSnapshot(observation);
  const actor = observation.features.actor;
  const opponent = observation.features.opponent;
  return {
    [`${prefix}ActorReserve`]: reserve.actorReserve,
    [`${prefix}OpponentReserve`]: reserve.opponentReserve,
    [`${prefix}TotalReserve`]: reserve.totalReserve,
    [`${prefix}ActorNyumbaSeeds`]: actor.nyumbaSeeds,
    [`${prefix}OpponentNyumbaSeeds`]: opponent.nyumbaSeeds,
    [`${prefix}ActorLegalMoveCount`]: actor.legalMoveCount,
    [`${prefix}ActorCaptureMoveCount`]: actor.captureMoveCount,
    [`${prefix}ActorForcedCapture`]: actor.forcedCapture,
    [`${prefix}ActorFrontSeeds`]: actor.frontSeeds,
    [`${prefix}OpponentFrontSeeds`]: opponent.frontSeeds,
    [`${prefix}ActorFrontConnections`]: actor.frontConnections,
    [`${prefix}OpponentFrontConnections`]: opponent.frontConnections,
    [`${prefix}ActorMaxCapturableSeeds`]: actor.maxCapturableSeeds,
    [`${prefix}OpponentMaxCapturableSeeds`]: opponent.maxCapturableSeeds,
  };
}

function numericSummary(values) {
  const finite = values.map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (!finite.length) return { n: 0, min: null, median: null, max: null };
  const middle = Math.floor(finite.length / 2);
  const median = finite.length % 2 ? finite[middle] : (finite[middle - 1] + finite[middle]) / 2;
  return { n: finite.length, min: finite[0], median, max: finite.at(-1) };
}

function dedupeByTrajectory(rows) {
  const map = new Map();
  for (const row of rows) if (!map.has(row.controlHistoricalTrajectoryHash)) map.set(row.controlHistoricalTrajectoryHash, row);
  return [...map.values()];
}

function supportSummary(rows) {
  const unique = dedupeByTrajectory(rows);
  const fields = [
    "candidateActorReserve", "candidateOpponentReserve", "candidateTotalReserve",
    "candidateActorNyumbaSeeds", "candidateOpponentNyumbaSeeds",
    "candidateActorLegalMoveCount", "candidateActorCaptureMoveCount",
    "candidateActorFrontSeeds", "candidateOpponentFrontSeeds",
    "candidateActorFrontConnections", "candidateOpponentFrontConnections",
    "candidateActorMaxCapturableSeeds", "candidateOpponentMaxCapturableSeeds",
    "landmarkActorReserve", "landmarkOpponentReserve", "landmarkTotalReserve",
    "landmarkActorNyumbaSeeds", "landmarkOpponentNyumbaSeeds",
    "landmarkActorLegalMoveCount", "landmarkActorCaptureMoveCount",
    "landmarkActorFrontSeeds", "landmarkOpponentFrontSeeds",
    "landmarkActorFrontConnections", "landmarkOpponentFrontConnections",
    "landmarkActorMaxCapturableSeeds", "landmarkOpponentMaxCapturableSeeds",
  ];
  return {
    rawGameRows: rows.length,
    uniqueHistoricalTrajectories: unique.length,
    forcedCaptureAtCandidate: {
      true: unique.filter((row) => row.candidateActorForcedCapture === true).length,
      false: unique.filter((row) => row.candidateActorForcedCapture === false).length,
    },
    reachedMtaji: unique.filter((row) => row.reachedMtaji).length,
    firstMtajiMorphologyEligible: unique.filter((row) => row.firstMtajiMorphologyEligible).length,
    terminalBeforeMtaji: unique.filter((row) => row.terminalBeforeMtaji).length,
    administrativeTruncation: unique.filter((row) => row.administrativeTruncation).length,
    structuralSupport: Object.fromEntries(fields.map((field) => [field, numericSummary(unique.map((row) => row[field]))])),
  };
}

function duplicateConditionAudit(games) {
  const byTrajectory = new Map();
  for (const game of games) {
    if (!byTrajectory.has(game.historicalTrajectoryHash)) byTrajectory.set(game.historicalTrajectoryHash, []);
    byTrajectory.get(game.historicalTrajectoryHash).push(game);
  }
  const duplicateGroups = [...byTrajectory.values()].filter((group) => group.length > 1);
  const conditionSets = new Map();
  const pairs = new Map();
  for (const group of duplicateGroups) {
    const conditions = [...new Set(group.map((game) => game.conditionId))].sort();
    const setKey = conditions.join("+");
    conditionSets.set(setKey, (conditionSets.get(setKey) || 0) + 1);
    for (let left = 0; left < conditions.length; left += 1) {
      for (let right = left + 1; right < conditions.length; right += 1) {
        const pair = `${conditions[left]}|${conditions[right]}`;
        pairs.set(pair, (pairs.get(pair) || 0) + 1);
      }
    }
  }
  return {
    duplicateHistoricalTrajectoryGroups: duplicateGroups.length,
    largestGroup: duplicateGroups.length ? Math.max(...duplicateGroups.map((group) => group.length)) : 0,
    groupSizeCounts: Object.fromEntries([...new Set(duplicateGroups.map((group) => group.length))].sort((a, b) => a - b).map((size) => [size, duplicateGroups.filter((group) => group.length === size).length])),
    conditionSetCounts: Object.fromEntries([...conditionSets.entries()].sort()),
    conditionPairCounts: Object.fromEntries([...pairs.entries()].sort()),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = path.resolve(options.input);
  const output = path.resolve(options.output);
  const manifest = JSON.parse(fs.readFileSync(path.join(input, "manifest.json"), "utf8"));
  if (manifest.formalExperiment !== false
    || manifest.scientificInferenceAuthorized !== false
    || manifest.exploratoryAnalysisAuthorized !== true
    || manifest.confirmatoryReuseAllowed !== false) {
    throw new Error("Stage 1 exploratory boundary mismatch");
  }

  const events = readCsv(path.resolve(options.events));
  const games = gameFiles(input).map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  const categoryAIndex = new Set(events.map((row) => `${row.gameId}:${Number(row.candidatePly)}`));
  const cbeTrajectories = new Set(events
    .filter((row) => row.candidatePhase === "namua" && row.classification === "capture-branch-expansion")
    .map((row) => row.historicalTrajectoryHash));

  const exposureRows = events.filter((row) => row.candidatePhase === "namua"
    && row.classification === "capture-branch-expansion"
    && bool(row.ascertainmentComplete));
  const exposureGroups = new Map();
  for (const row of exposureRows) {
    const key = `${row.historicalTrajectoryHash}:${Number(row.candidatePly)}`;
    if (!exposureGroups.has(key)) exposureGroups.set(key, []);
    exposureGroups.get(key).push(row);
  }

  const progressionViolations = [];
  const controlRows = [];
  const exposures = [];

  for (const [exposureKey, rows] of exposureGroups) {
    const representative = rows[0];
    const candidatePly = Number(representative.candidatePly);
    const landmarkPly = candidatePly + LOOK_AHEAD;
    const exposureForcedCapture = bool(representative.forcedCaptureAtCandidate);
    const exposureConditions = [...new Set(rows.map((row) => row.conditionId))].sort();
    exposures.push({
      exposureKey,
      historicalTrajectoryHash: representative.historicalTrajectoryHash,
      candidatePly,
      landmarkPly,
      forcedCaptureAtCandidate: exposureForcedCapture,
      conditionIds: exposureConditions,
      rawConditionRows: rows.length,
    });

    for (const conditionId of exposureConditions) {
      const base = [];
      for (const game of games) {
        if (game.conditionId !== conditionId) continue;
        if (game.historicalTrajectoryHash === representative.historicalTrajectoryHash) continue;
        const target = observationAt(game, candidatePly);
        const landmark = observationAt(game, landmarkPly);
        if (!target || target.phase !== "namua" || target.terminal === true) continue;
        if (!landmark) continue;

        const targetReserve = reserveSnapshot(target);
        const landmarkReserve = reserveSnapshot(landmark);
        const expectedCandidateReserve = INITIAL_TOTAL_RESERVE - candidatePly;
        const expectedLandmarkReserve = INITIAL_TOTAL_RESERVE - landmarkPly;
        if (targetReserve.totalReserve !== expectedCandidateReserve) {
          progressionViolations.push({
            exposureKey, conditionId, controlGameId: game.gameId, ply: candidatePly,
            expected: expectedCandidateReserve, actual: targetReserve.totalReserve,
          });
        }
        if (landmark.phase === "namua" && landmarkReserve.totalReserve !== expectedLandmarkReserve) {
          progressionViolations.push({
            exposureKey, conditionId, controlGameId: game.gameId, ply: landmarkPly,
            expected: expectedLandmarkReserve, actual: landmarkReserve.totalReserve,
          });
        }

        base.push({
          exposureKey,
          exposureConditionId: conditionId,
          exposureHistoricalTrajectoryHash: representative.historicalTrajectoryHash,
          exposureCandidatePly: candidatePly,
          exposureLandmarkPly: landmarkPly,
          exposureForcedCaptureAtCandidate: exposureForcedCapture,
          controlGameId: game.gameId,
          controlReplicateIndex: game.replicateIndex,
          controlOpeningSeed: game.openingSeed,
          controlConditionId: game.conditionId,
          controlHistoricalTrajectoryHash: game.historicalTrajectoryHash,
          controlCategoryAAtIndex: categoryAIndex.has(`${game.gameId}:${candidatePly}`),
          controlHasNamuaCbeAnywhere: cbeTrajectories.has(game.historicalTrajectoryHash),
          reachedMtaji: game.temporalOutcome.reachedMtaji,
          firstMtajiMorphologyEligible: game.temporalOutcome.firstMtajiMorphologyEligible,
          terminalBeforeMtaji: game.temporalOutcome.terminalBeforeMtaji,
          administrativeTruncation: game.temporalOutcome.administrativeTruncation,
          ...snapshot(target, "candidate"),
          ...snapshot(landmark, "landmark"),
        });
      }

      const r0 = base;
      const r1 = r0.filter((row) => !row.controlCategoryAAtIndex);
      const r2 = r1.filter((row) => row.candidateActorForcedCapture === exposureForcedCapture);
      const r3 = r2.filter((row) => !row.controlHasNamuaCbeAnywhere);
      for (const [family, rowsForFamily] of [["R0", r0], ["R1", r1], ["R2", r2], ["R3", r3]]) {
        controlRows.push(...rowsForFamily.map((row) => ({ family, ...row })));
      }
    }
  }

  if (progressionViolations.length) {
    const failure = {
      schemaVersion: 1,
      status: "stage1-riskset-support-audit-failed",
      passed: false,
      progressionViolations,
    };
    atomicWriteJson(path.join(output, "stage1-riskset-audit.json"), failure);
    throw new Error(`Deterministic progression violations found: ${progressionViolations.length}`);
  }

  const support = [];
  for (const exposure of exposures) {
    for (const conditionId of exposure.conditionIds) {
      for (const family of ["R0", "R1", "R2", "R3"]) {
        const rows = controlRows.filter((row) => row.exposureKey === exposure.exposureKey
          && row.exposureConditionId === conditionId && row.family === family);
        support.push({ exposureKey: exposure.exposureKey, conditionId, family, ...supportSummary(rows) });
      }
    }
  }

  const report = {
    schemaVersion: 1,
    status: "stage1-exact-ply-riskset-support-audit-complete",
    passed: true,
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    exploratoryAnalysisAuthorized: true,
    confirmatoryReuseAllowed: false,
    inputConfigHash: manifest.configHash,
    policy: {
      progressionAnchor: "exact candidate ply",
      candidateToLandmarkPly: LOOK_AHEAD,
      initialTotalReserve: INITIAL_TOTAL_RESERVE,
      duplicateExposureUnit: "historicalTrajectoryHash + candidatePly",
      baseEligibilityConditionsOnLaterMtaji: false,
      morphologyLabelsUsedForComparatorSelection: false,
    },
    exposureRows: exposureRows.length,
    uniqueExposureTrajectoryPlyUnits: exposures.length,
    exposures,
    support,
    duplicateConditionAudit: duplicateConditionAudit(games),
    progressionViolations,
    interpretationBoundary: {
      effectTestingPerformed: false,
      pValuesComputed: false,
      morphologyEffectSizesComputed: false,
      morphologyLabelContrastInspectedByRisksetFamily: false,
      comparatorFrozen: false,
      statisticalUnitFrozen: false,
      formalConditionSetFrozen: false,
      formalSampleSizeFrozen: false,
    },
  };

  atomicWriteJson(path.join(output, "stage1-riskset-audit.json"), report);
  writeCsv(path.join(output, "stage1-riskset-controls.csv"), controlRows);
  console.log(JSON.stringify(report, null, 2));
}

if (require.main === module) main();

module.exports = { parseArgs, readCsv, reserveSnapshot, snapshot, supportSummary };
