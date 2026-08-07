#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");

const MEAN_FIELDS = [
  "peakRelativePly",
  "peakCaptureMoveCount",
  "delta_captureMoveCount",
  "delta_legalMoveCount",
  "delta_actorFrontOccupied",
  "delta_opponentFrontOccupied",
  "delta_actorReusablePits",
  "delta_opponentReusablePits",
  "delta_actorMaxCapture",
  "delta_opponentMaxCapture",
  "delta_actorFrontSeeds",
  "delta_opponentFrontSeeds",
  "delta_actorReserve",
  "delta_opponentReserve",
];

function parseArgs(argv) {
  const options = {
    games: "artifacts/phase-transition/confirmation-v1/games.json",
    deltas: "artifacts/local/phase-transition-confirmation-capture-branch-formation/capture-branch-formation-deltas.csv",
    output: "artifacts/local/phase-transition-confirmation-capture-branch-formation",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--games") options.games = value;
    else if (key === "--deltas") options.deltas = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function numericMean(rows, field) {
  const values = rows.map((row) => Number(row[field])).filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function booleanCount(rows, field) {
  return rows.filter((row) => row[field] === true || row[field] === "true").length;
}

function attachTrajectories(rows, games) {
  const trajectoryByGame = new Map(games.map((game) => [game.gameId, game.trajectoryHash]));
  return rows.map((row) => {
    const trajectoryHash = trajectoryByGame.get(row.gameId);
    if (!trajectoryHash) throw new Error(`Missing trajectoryHash for ${row.gameId}`);
    const candidatePly = Number(row.candidatePly);
    if (!Number.isInteger(candidatePly)) {
      throw new Error(`Invalid candidatePly for ${row.gameId}: ${row.candidatePly}`);
    }
    return {
      ...row,
      candidatePly,
      trajectoryHash,
      trajectoryPlyKey: `${trajectoryHash}:${candidatePly}`,
    };
  });
}

function deduplicate(rows) {
  const unique = new Map();
  for (const row of rows) {
    if (!unique.has(row.trajectoryPlyKey)) unique.set(row.trajectoryPlyKey, row);
  }
  return [...unique.values()];
}

function summarize(rows) {
  const means = {};
  for (const field of MEAN_FIELDS) means[field] = numericMean(rows, field);
  return {
    candidateCount: rows.length,
    means,
    counts: {
      peakOnCandidatePlayer: booleanCount(rows, "peakSamePlayerAsCandidate"),
      phaseChanged: booleanCount(rows, "phaseChanged"),
      actorHouseLost: booleanCount(rows, "actorHouseLost"),
      opponentHouseLost: booleanCount(rows, "opponentHouseLost"),
    },
  };
}

function duplicateGroups(rows) {
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.trajectoryPlyKey)) groups.set(row.trajectoryPlyKey, []);
    groups.get(row.trajectoryPlyKey).push(row);
  }
  return [...groups.values()].map((group) => ({
    trajectoryPlyKey: group[0].trajectoryPlyKey,
    trajectoryHash: group[0].trajectoryHash,
    candidatePly: group[0].candidatePly,
    candidateCount: group.length,
    archetypeId: [...new Set(group.map((row) => row.archetypeId))].sort().join("|"),
    gameIds: group.map((row) => row.gameId).sort().join("|"),
  })).sort((left, right) => right.candidateCount - left.candidateCount
    || left.trajectoryPlyKey.localeCompare(right.trajectoryPlyKey));
}

function analyze(games, deltaRows) {
  const rows = attachTrajectories(deltaRows, games);
  const uniqueRows = deduplicate(rows);
  const groups = duplicateGroups(rows);
  return {
    summary: {
      analysisVersion: "14-confirmation-capture-branch-formation-trajectory-sensitivity",
      metricPerspective: "player-to-move",
      raw: summarize(rows),
      trajectoryPlyDeduplicated: summarize(uniqueRows),
      structure: {
        uniqueTrajectoryPlyCount: uniqueRows.length,
        uniqueTrajectoryCount: new Set(rows.map((row) => row.trajectoryHash)).size,
        uniqueArchetypeCount: new Set(rows.map((row) => row.archetypeId)).size,
        largestTrajectoryPlyMultiplicity: groups.length ? groups[0].candidateCount : 0,
      },
      interpretation: {
        preregisteredDecisionChanged: false,
        sensitivityType: "post-hoc trajectory-plus-ply deduplication",
        note: "Raw and deduplicated formation summaries are both reported because deterministic trajectories can repeat across seeds.",
      },
    },
    rows,
    uniqueRows,
    duplicateGroups: groups,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const games = JSON.parse(fs.readFileSync(path.resolve(options.games), "utf8"));
  const deltaRows = IO.readCsv(path.resolve(options.deltas));
  const result = analyze(games, deltaRows);
  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(
    path.join(output, "trajectory-sensitive-summary.json"),
    `${JSON.stringify(result.summary, null, 2)}\n`,
  );
  IO.writeCsv(
    path.join(output, "trajectory-ply-deduplicated-deltas.csv"),
    result.uniqueRows,
  );
  IO.writeCsv(
    path.join(output, "formation-duplicate-groups.csv"),
    result.duplicateGroups,
  );
  console.log(JSON.stringify(result.summary, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  MEAN_FIELDS,
  analyze,
  attachTrajectories,
  deduplicate,
  parseArgs,
  summarize,
};
