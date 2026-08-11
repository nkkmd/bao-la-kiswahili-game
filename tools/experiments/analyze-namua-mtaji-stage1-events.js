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
    input: "artifacts/local/namua-mtaji-transition/stage1-pilot-v1",
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

function gameFiles(input) {
  const directory = path.join(input, "games");
  return fs.readdirSync(directory)
    .filter((name) => /^game-\d+\.json$/.test(name))
    .sort()
    .map((name) => path.join(directory, name));
}

function observationAt(game, ply) {
  return game.observations.find((row) => Number(row.ply) === Number(ply)) || null;
}

function playerReserve(observation) {
  if (!observation) return { actorReserve: null, opponentReserve: null, totalReserve: null };
  const player = Number(observation.player);
  const reserve = observation.state.reserve.map(Number);
  return {
    actorReserve: reserve[player],
    opponentReserve: reserve[1 - player],
    totalReserve: reserve[0] + reserve[1],
  };
}

function featureSnapshot(observation, prefix) {
  if (!observation) {
    return Object.fromEntries([
      "actorReserve", "opponentReserve", "totalReserve", "actorNyumbaSeeds",
      "opponentNyumbaSeeds", "actorLegalMoveCount", "actorCaptureMoveCount",
      "actorForcedCapture", "actorFrontSeeds", "opponentFrontSeeds",
      "actorFrontConnections", "opponentFrontConnections", "actorMaxCapturableSeeds",
      "opponentMaxCapturableSeeds",
    ].map((name) => [`${prefix}${name[0].toUpperCase()}${name.slice(1)}`, null]));
  }
  const reserve = playerReserve(observation);
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
  const median = finite.length % 2
    ? finite[middle]
    : (finite[middle - 1] + finite[middle]) / 2;
  return { n: finite.length, min: finite[0], median, max: finite.at(-1) };
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
  }).sort((a, b) => fields.map((field) => String(a[field])).join("|").localeCompare(fields.map((field) => String(b[field])).join("|")));
}

function supportByClass(rows) {
  const classes = [...new Set(rows.map(({ classification }) => classification))].sort();
  return Object.fromEntries(classes.map((classification) => {
    const group = rows.filter((row) => row.classification === classification);
    return [classification, {
      events: group.length,
      candidatePly: numericSummary(group.map(({ candidatePly }) => candidatePly)),
      rawCandidateToMtaji: numericSummary(group.map(({ rawCandidateToMtaji }) => rawCandidateToMtaji)),
      postAscertainmentToMtaji: numericSummary(group.map(({ postAscertainmentToMtaji }) => postAscertainmentToMtaji)),
      candidateTotalReserve: numericSummary(group.map(({ candidateTotalReserve }) => candidateTotalReserve)),
      landmarkTotalReserve: numericSummary(group.map(({ landmarkTotalReserve }) => landmarkTotalReserve)),
      ascertainmentComplete: group.filter(({ ascertainmentComplete }) => ascertainmentComplete).length,
      reachedMtajiAfterCandidate: group.filter(({ reachedMtajiAfterCandidate }) => reachedMtajiAfterCandidate).length,
      terminalBeforeMtaji: group.filter(({ terminalBeforeMtaji }) => terminalBeforeMtaji).length,
      administrativeTruncation: group.filter(({ administrativeTruncation }) => administrativeTruncation).length,
    }];
  }));
}

function rangeOverlap(leftRows, rightRows, field) {
  const left = leftRows.map((row) => Number(row[field])).filter(Number.isFinite);
  const right = rightRows.map((row) => Number(row[field])).filter(Number.isFinite);
  if (!left.length || !right.length) return { estimable: false };
  const leftRange = [Math.min(...left), Math.max(...left)];
  const rightRange = [Math.min(...right), Math.max(...right)];
  const overlap = [Math.max(leftRange[0], rightRange[0]), Math.min(leftRange[1], rightRange[1])];
  return {
    estimable: true,
    leftRange,
    rightRange,
    overlapRange: overlap[0] <= overlap[1] ? overlap : null,
    hasOverlap: overlap[0] <= overlap[1],
  };
}

function multiplicity(rows, games) {
  const byGame = new Map();
  for (const row of rows) {
    if (!byGame.has(row.gameId)) byGame.set(row.gameId, []);
    byGame.get(row.gameId).push(row);
  }
  let overlappingAscertainmentWindows = 0;
  let sameClassRepeatGames = 0;
  let mixedClassGames = 0;
  for (const group of byGame.values()) {
    group.sort((a, b) => a.candidatePly - b.candidatePly);
    if (new Set(group.map(({ classification }) => classification)).size > 1) mixedClassGames += 1;
    const classCounts = new Map();
    for (const row of group) classCounts.set(row.classification, (classCounts.get(row.classification) || 0) + 1);
    if ([...classCounts.values()].some((count) => count > 1)) sameClassRepeatGames += 1;
    for (let left = 0; left < group.length; left += 1) {
      for (let right = left + 1; right < group.length; right += 1) {
        if (group[right].candidatePly <= group[left].candidatePly + FROZEN_EXPANSION_SETTINGS.after) {
          overlappingAscertainmentWindows += 1;
        }
      }
    }
  }
  const eventKeys = rows.map((row) => `${row.historicalTrajectoryHash}:${row.candidatePly}`);
  const keyCounts = new Map();
  for (const key of eventKeys) keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
  const trajectoryCounts = new Map();
  for (const game of games) trajectoryCounts.set(game.historicalTrajectoryHash, (trajectoryCounts.get(game.historicalTrajectoryHash) || 0) + 1);
  const perGame = [...byGame.values()].map((group) => group.length);
  return {
    gamesWithCategoryAEvents: byGame.size,
    gamesWithMultipleCategoryAEvents: perGame.filter((count) => count > 1).length,
    maxCategoryAEventsPerGame: perGame.length ? Math.max(...perGame) : 0,
    sameClassRepeatGames,
    mixedClassGames,
    overlappingAscertainmentWindowPairs: overlappingAscertainmentWindows,
    duplicateTrajectoryPlyUnits: [...keyCounts.values()].filter((count) => count > 1).reduce((sum, count) => sum + count - 1, 0),
    duplicateHistoricalTrajectoryGroups: [...trajectoryCounts.values()].filter((count) => count > 1).length,
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
    const rawCandidateToMtaji = reachedMtajiAfterCandidate ? firstMtajiPly - candidatePly : null;
    const ascertainmentComplete = ascertainment.classificationKnownByPly !== null;
    const postAscertainmentToMtaji = ascertainmentComplete && firstMtajiPly !== null && firstMtajiPly > landmarkPly
      ? firstMtajiPly - landmarkPly
      : null;
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
      ascertainmentComplete,
      firstMtajiPly,
      reachedMtajiAfterCandidate,
      rawCandidateToMtaji,
      postAscertainmentToMtaji,
      terminalPly: game.temporalOutcome.terminalPly,
      terminalBeforeMtaji: game.temporalOutcome.terminalBeforeMtaji,
      administrativeTruncation: game.temporalOutcome.administrativeTruncation,
      ...featureSnapshot(target, "candidate"),
      ...featureSnapshot(landmark, "landmark"),
    };
  });

  const expansion = events.filter(({ classification }) => classification === "capture-branch-expansion");
  const spikes = events.filter(({ classification }) => classification === "temporary-spike");
  const convergence = events.filter(({ classification }) => classification === "capture-branch-convergence");
  const stage6ComparatorFamily = [...spikes, ...convergence];
  const report = {
    schemaVersion: 1,
    status: "stage1-temporal-event-support-audit-complete",
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    exploratoryAnalysisAuthorized: true,
    confirmatoryReuseAllowed: false,
    inputConfigHash: manifest.configHash,
    categoryAEvents: events.length,
    counts: {
      byClassification: countBy(events, ["classification"]),
      byClassificationAndPhase: countBy(events, ["classification", "candidatePhase"]),
      byConditionAndClassification: countBy(events, ["conditionId", "classification"]),
    },
    supportByClass: supportByClass(events),
    reserveRangeOverlap: {
      expansionVsTemporarySpikeAtCandidate: rangeOverlap(expansion, spikes, "candidateTotalReserve"),
      expansionVsConvergenceAtCandidate: rangeOverlap(expansion, convergence, "candidateTotalReserve"),
      expansionVsStage6ComparatorFamilyAtCandidate: rangeOverlap(expansion, stage6ComparatorFamily, "candidateTotalReserve"),
      expansionVsStage6ComparatorFamilyAtLandmark: rangeOverlap(expansion, stage6ComparatorFamily, "landmarkTotalReserve"),
    },
    multiplicity: multiplicity(events, games),
    interpretationBoundary: {
      effectTestingPerformed: false,
      pValuesComputed: false,
      comparatorFrozen: false,
      timeOriginFrozen: false,
      statisticalUnitFrozen: false,
      reservePolicyFrozen: false,
      modelFrozen: false,
    },
  };
  writeCsv(path.join(output, "stage1-event-table.csv"), events);
  atomicWriteJson(path.join(output, "stage1-event-audit.json"), report);
  console.log(JSON.stringify(report, null, 2));
}

if (require.main === module) main();
module.exports = { numericSummary, rangeOverlap, readCsv, supportByClass };
