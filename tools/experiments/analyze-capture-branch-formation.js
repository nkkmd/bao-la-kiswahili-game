#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const IO = require("./analyze-forced-capture-regimes.js");

function parseArgs(argv) {
  const options = {
    games: "artifacts/phase-transition/pilot-v2-current-source/games",
    candidates: "artifacts/local/phase-transition-regime-controls-current-source/candidate-control-metrics.csv",
    output: "artifacts/local/phase-transition-capture-branch-formation",
    window: 8,
  };
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]; const value = argv[i + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--games") options.games = value;
    else if (key === "--candidates") options.candidates = value;
    else if (key === "--output") options.output = value;
    else if (key === "--window") options.window = Number(value);
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function replayStates(game) {
  const states = [E.initialState()];
  let state = states[0];
  for (const item of game.moves) {
    state = E.applyMove(state, item.move).state;
    states.push(state);
  }
  return states;
}

function metricRow(state, focalPlayer, gameId, candidatePly, relativePly) {
  const own = AI.playerMetrics(state, focalPlayer);
  const enemy = AI.playerMetrics(state, 1 - focalPlayer);
  const moves = E.moveVariants(state);
  return {
    gameId,
    candidatePly,
    relativePly,
    actualPly: candidatePly + relativePly,
    phase: state.phase,
    playerToMove: state.player,
    focalPlayer,
    captureMoveCount: moves.filter((move) => move.type === "capture").length,
    legalMoveCount: moves.length,
    ownFrontOccupied: own.frontOccupied,
    enemyFrontOccupied: enemy.frontOccupied,
    ownReusablePits: own.reusablePits,
    enemyReusablePits: enemy.reusablePits,
    ownMaxCapture: own.maxCapture,
    enemyMaxCapture: enemy.maxCapture,
    ownFrontSeeds: own.frontSeeds,
    enemyFrontSeeds: enemy.frontSeeds,
    ownReserve: state.reserve[focalPlayer],
    enemyReserve: state.reserve[1 - focalPlayer],
    ownHouseOwned: state.houseOwned[focalPlayer],
    enemyHouseOwned: state.houseOwned[1 - focalPlayer],
  };
}

function candidatePlyValue(candidate) {
  const value = Number(candidate.candidatePly ?? candidate.ply);
  if (!Number.isInteger(value) || value < 0) throw new Error(`Invalid candidate ply: ${JSON.stringify(candidate)}`);
  return value;
}

function deltaRecord(candidate, rows) {
  const start = rows[0];
  const peak = rows.slice().sort((a, b) => b.captureMoveCount - a.captureMoveCount || a.relativePly - b.relativePly)[0];
  const fields = [
    "captureMoveCount", "legalMoveCount", "ownFrontOccupied", "enemyFrontOccupied",
    "ownReusablePits", "enemyReusablePits", "ownMaxCapture", "enemyMaxCapture",
    "ownFrontSeeds", "enemyFrontSeeds", "ownReserve", "enemyReserve",
  ];
  const result = {
    archetypeId: candidate.archetypeId,
    gameId: candidate.gameId,
    candidatePly: candidatePlyValue(candidate),
    peakRelativePly: peak.relativePly,
    peakCaptureMoveCount: peak.captureMoveCount,
    phaseChanged: start.phase !== peak.phase,
    ownHouseLost: start.ownHouseOwned && !peak.ownHouseOwned,
    enemyHouseLost: start.enemyHouseOwned && !peak.enemyHouseOwned,
  };
  for (const field of fields) result[`delta_${field}`] = peak[field] - start[field];
  return result;
}

function average(rows, field) {
  return rows.length ? rows.reduce((sum, row) => sum + Number(row[field] || 0), 0) / rows.length : null;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const candidates = IO.readCsv(path.resolve(options.candidates))
    .filter((row) => row.classification === "capture-branch-expansion");
  const timeline = [];
  const deltas = [];
  for (const candidate of candidates) {
    const gameIndex = Number(candidate.gameId.split("-").at(-1));
    const gamePath = path.resolve(options.games, `game-${String(gameIndex).padStart(4, "0")}.json`);
    const game = JSON.parse(fs.readFileSync(gamePath, "utf8"));
    const states = replayStates(game);
    const candidatePly = candidatePlyValue(candidate);
    if (!states[candidatePly]) throw new Error(`Candidate ply ${candidatePly} outside ${candidate.gameId} trajectory`);
    const focalPlayer = states[candidatePly].player;
    const rows = [];
    for (let offset = 0; offset <= options.window && candidatePly + offset < states.length; offset += 1) {
      const row = metricRow(states[candidatePly + offset], focalPlayer, candidate.gameId, candidatePly, offset);
      rows.push(row); timeline.push({ archetypeId: candidate.archetypeId, ...row });
    }
    deltas.push(deltaRecord(candidate, rows));
  }
  const summary = {
    analysisVersion: "10-capture-branch-formation",
    candidateCount: candidates.length,
    window: options.window,
    meanPeakRelativePly: average(deltas, "peakRelativePly"),
    meanCaptureMoveIncrease: average(deltas, "delta_captureMoveCount"),
    meanOwnFrontOccupiedChange: average(deltas, "delta_ownFrontOccupied"),
    meanEnemyFrontOccupiedChange: average(deltas, "delta_enemyFrontOccupied"),
    meanOwnReusablePitsChange: average(deltas, "delta_ownReusablePits"),
    meanEnemyReusablePitsChange: average(deltas, "delta_enemyReusablePits"),
    meanOwnMaxCaptureChange: average(deltas, "delta_ownMaxCapture"),
    meanEnemyMaxCaptureChange: average(deltas, "delta_enemyMaxCapture"),
    phaseChangeCount: deltas.filter((row) => row.phaseChanged).length,
    ownHouseLossCount: deltas.filter((row) => row.ownHouseLost).length,
    enemyHouseLossCount: deltas.filter((row) => row.enemyHouseLost).length,
  };
  const output = path.resolve(options.output); fs.mkdirSync(output, { recursive: true });
  IO.writeCsv(path.join(output, "capture-branch-formation-timeline.csv"), timeline);
  IO.writeCsv(path.join(output, "capture-branch-formation-deltas.csv"), deltas);
  fs.writeFileSync(path.join(output, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}

if (require.main === module) main();
module.exports = { candidatePlyValue, deltaRecord, replayStates };
