#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  analyzeFrozenCandidate,
  candidateAscertainment,
  FROZEN_EXPANSION_SETTINGS,
} = require("./lib/namua-mtaji-transition-features.js");

function parseArgs(argv) {
  const options = {
    input: "artifacts/local/namua-mtaji-transition/stage2-formal-v1",
    candidates: null,
    output: null,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--input") options.input = value;
    else if (key === "--candidates") options.candidates = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  options.candidates ||= path.join(options.input, "category-a-candidates.csv");
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

function gameFiles(input) {
  return fs.readdirSync(path.join(input, "games"))
    .filter((name) => /^game-\d+\.json$/.test(name))
    .sort()
    .map((name) => path.join(input, "games", name));
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

function countBy(rows, fields) {
  const counts = new Map();
  for (const row of rows) {
    const key = fields.map((field) => row[field] ?? "<null>").join("\u001f");
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].map(([key, count]) => {
    const values = key.split("\u001f");
    return Object.fromEntries([...fields.map((field, index) => [field, values[index]]), ["count", count]]);
  });
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = path.resolve(options.input);
  const output = path.resolve(options.output);
  const manifest = JSON.parse(fs.readFileSync(path.join(input, "manifest.json"), "utf8"));
  if (manifest.formalExperiment !== true
    || manifest.scientificInferenceAuthorized !== true
    || manifest.exploratoryAnalysisAuthorized !== false
    || manifest.config.stage !== "stage2-formal-confirmation") {
    throw new Error("Stage 2 formal boundary mismatch");
  }

  const candidates = readCsv(path.resolve(options.candidates)).filter((row) => row.category === "A");
  const games = gameFiles(input).map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  const gameMap = new Map(games.map((game) => [game.gameId, game]));

  const events = candidates.map((candidate) => {
    const game = gameMap.get(candidate.gameId);
    if (!game) throw new Error(`Missing game for ${candidate.gameId}`);
    const candidatePly = Number(candidate.representativePly);
    const metrics = analyzeFrozenCandidate({
      gameId: game.gameId,
      ply: candidatePly,
      category: "A",
      archetypeId: candidate.clusterId || null,
    }, game.observations);
    const ascertainment = candidateAscertainment(metrics, game.observations);
    const target = observationAt(game, candidatePly);
    const landmarkPly = candidatePly + FROZEN_EXPANSION_SETTINGS.after;
    const landmark = observationAt(game, landmarkPly);
    const firstMtajiPly = game.temporalOutcome.firstMtajiPly;
    const reachedMtajiAfterCandidate = firstMtajiPly !== null && firstMtajiPly > candidatePly;
    return {
      gameId: game.gameId,
      replicateIndex: game.replicateIndex,
      openingSeed: game.openingSeed,
      conditionId: game.conditionId,
      historicalTrajectoryHash: game.historicalTrajectoryHash,
      category: "A",
      candidateClusterId: candidate.clusterId || "",
      candidatePly,
      candidatePhase: target?.phase ?? null,
      classification: metrics.classification,
      forcedCaptureAtCandidate: metrics.forcedCaptureAtCandidate,
      regimeId: metrics.regimeId,
      regimeStartPly: metrics.regimeStartPly,
      regimeEndPly: metrics.regimeEndPly,
      regimeLength: metrics.regimeLength,
      captureDelta: metrics.captureDelta,
      postPersistenceFraction: metrics.postPersistenceFraction,
      distanceToForcingRelease: metrics.distanceToForcingRelease,
      classifierDistanceToMtaji: metrics.distanceToMtaji,
      landmarkPly,
      ascertainmentComplete: ascertainment.classificationKnownByPly !== null,
      firstMtajiPly,
      reachedMtajiAfterCandidate,
      terminalPly: game.temporalOutcome.terminalPly,
      terminalBeforeMtaji: game.temporalOutcome.terminalBeforeMtaji,
      administrativeTruncation: game.temporalOutcome.administrativeTruncation,
      ...snapshot(target, "candidate"),
      ...snapshot(landmark, "landmark"),
    };
  });

  writeCsv(path.join(output, "stage2-event-table.csv"), events);
  const cbe = events.filter((row) => row.candidatePhase === "namua"
    && row.classification === "capture-branch-expansion"
    && row.ascertainmentComplete === true);
  const trajectoryUnits = new Map();
  for (const row of cbe) {
    const prior = trajectoryUnits.get(row.historicalTrajectoryHash);
    if (!prior || row.candidatePly < prior.candidatePly) trajectoryUnits.set(row.historicalTrajectoryHash, row);
  }
  const report = {
    schemaVersion: 1,
    status: "stage2-formal-temporal-event-classification-complete",
    formalExperiment: true,
    scientificInferenceAuthorized: true,
    morphologyLabelsRead: false,
    inputConfigHash: manifest.configHash,
    categoryAEvents: events.length,
    counts: {
      byClassification: countBy(events, ["classification"]),
      byClassificationAndPhase: countBy(events, ["classification", "candidatePhase"]),
    },
    rawFullyAscertainedNamuaCbeRows: cbe.length,
    uniqueEarliestCbeHistoricalTrajectories: trajectoryUnits.size,
    earliestCbeCandidatePlyCounts: countBy([...trajectoryUnits.values()], ["candidatePly"]),
    interpretationBoundary: {
      morphologyLabelsRead: false,
      effectTestingPerformed: false,
      comparatorSelectedFromOutcome: false,
    },
  };
  atomicWriteJson(path.join(output, "stage2-event-audit.json"), report);
  console.log(JSON.stringify(report, null, 2));
}

if (require.main === module) main();
