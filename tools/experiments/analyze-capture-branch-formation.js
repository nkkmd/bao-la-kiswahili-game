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

function metricRow(state, candidatePlayer, gameId, candidatePly, relativePly) {
  const actor = state.player;
  const actorMetrics = AI.playerMetrics(state, actor);
  const opponentMetrics = AI.playerMetrics(state, 1 - actor);
  const moves = E.moveVariants(state);
  return {
    gameId,
    candidatePly,
    relativePly,
    actualPly: candidatePly + relativePly,
    phase: state.phase,
    playerToMove: actor,
    samePlayerAsCandidate: actor === candidatePlayer,
    captureMoveCount: moves.filter((move) => move.type === "capture").length,
    legalMoveCount: moves.length,
    actorFrontOccupied: actorMetrics.frontOccupied,
    opponentFrontOccupied: opponentMetrics.frontOccupied,
    actorReusablePits: actorMetrics.reusablePits,
    opponentReusablePits: opponentMetrics.reusablePits,
    actorMaxCapture: actorMetrics.maxCapture,
    opponentMaxCapture: opponentMetrics.maxCapture,
    actorFrontSeeds: actorMetrics.frontSeeds,
    opponentFrontSeeds: opponentMetrics.frontSeeds,
    actorReserve: state.reserve[actor],
    opponentReserve: state.reserve[1 - actor],
    actorHouseOwned: state.houseOwned[actor],
    opponentHouseOwned: state.houseOwned[1 - actor],
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
    "captureMoveCount", "legalMoveCount", "actorFrontOccupied", "opponentFrontOccupied",
    "actorReusablePits", "opponentReusablePits", "actorMaxCapture", "opponentMaxCapture",
    "actorFrontSeeds", "opponentFrontSeeds", "actorReserve", "opponentReserve",
  ];
  const result = {
    archetypeId: candidate.archetypeId,
    gameId: candidate.gameId,
    candidatePly: candidatePlyValue(candidate),
    peakRelativePly: peak.relativePly,
    peakCaptureMoveCount: peak.captureMoveCount,
    peakSamePlayerAsCandidate: peak.samePlayerAsCandidate,
    phaseChanged: start.phase !== peak.phase,
    actorHouseLost: start.actorHouseOwned && !peak.actorHouseOwned,
    opponentHouseLost: start.opponentHouseOwned && !peak.opponentHouseOwned,
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
    const candidatePlayer = states[candidatePly].player;
    const rows = [];
    for (let offset = 0; offset <= options.window && candidatePly + offset < states.length; offset += 1) {
      const row = metricRow(states[candidatePly + offset], candidatePlayer, candidate.gameId, candidatePly, offset);
      rows.push(row); timeline.push({ archetypeId: candidate.archetypeId, ...row });
    }
    deltas.push(deltaRecord(candidate, rows));
  }
  const summary = {
    analysisVersion: "10-capture-branch-formation",
    metricPerspective: "player-to-move",
    candidateCount: candidates.length,
    window: options.window,
    meanPeakRelativePly: average(deltas, "peakRelativePly"),
    peakOnCandidatePlayerCount: deltas.filter((row) => row.peakSamePlayerAsCandidate).length,
    meanCaptureMoveIncrease: average(deltas, "delta_captureMoveCount"),
    meanActorFrontOccupiedChange: average(deltas, "delta_actorFrontOccupied"),
    meanOpponentFrontOccupiedChange: average(deltas, "delta_opponentFrontOccupied"),
    meanActorReusablePitsChange: average(deltas, "delta_actorReusablePits"),
    meanOpponentReusablePitsChange: average(deltas, "delta_opponentReusablePits"),
    meanActorMaxCaptureChange: average(deltas, "delta_actorMaxCapture"),
    meanOpponentMaxCaptureChange: average(deltas, "delta_opponentMaxCapture"),
    phaseChangeCount: deltas.filter((row) => row.phaseChanged).length,
    actorHouseLossCount: deltas.filter((row) => row.actorHouseLost).length,
    opponentHouseLossCount: deltas.filter((row) => row.opponentHouseLost).length,
  };
  const output = path.resolve(options.output); fs.mkdirSync(output, { recursive: true });
  IO.writeCsv(path.join(output, "capture-branch-formation-timeline.csv"), timeline);
  IO.writeCsv(path.join(output, "capture-branch-formation-deltas.csv"), deltas);
  fs.writeFileSync(path.join(output, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}

if (require.main === module) main();
module.exports = { candidatePlyValue, deltaRecord, metricRow, replayStates };
