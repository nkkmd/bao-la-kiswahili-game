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
    output: "artifacts/local/phase-transition-move-quality-current-source",
    evaluationProfile: "bao",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--games") options.games = value;
    else if (key === "--candidates") options.candidates = value;
    else if (key === "--output") options.output = value;
    else if (key === "--evaluation-profile") options.evaluationProfile = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function eventMetrics(events) {
  const captures = events.filter((event) => event.kind === "capture");
  const relays = events.filter((event) => event.kind === "relay");
  return {
    capturedSeedCount: captures.reduce((sum, event) => sum + Number(event.count || 0), 0),
    captureEventCount: captures.length,
    relayEventCount: relays.length,
    captureRelayLength: captures.length + relays.length,
    sowEventCount: events.filter((event) => event.kind === "sow").length,
  };
}

function replayStates(game) {
  const states = new Map();
  let state = E.initialState();
  states.set(0, E.clone(state));
  for (const record of game.moves || []) {
    if (Number(record.ply) !== states.size - 1) {
      throw new Error(`Non-contiguous move sequence in ${game.gameId} at ply ${record.ply}`);
    }
    state = E.applyMove(state, record.move).state;
    states.set(Number(record.ply) + 1, E.clone(state));
  }
  return states;
}

function analyzeCandidate(candidate, game, evaluationProfile) {
  const ply = Number(candidate.candidatePly ?? candidate.representativePly);
  const states = replayStates(game);
  const state = states.get(ply);
  if (!state) throw new Error(`Missing state ${game.gameId} ply ${ply}`);
  const chosenRecord = (game.moves || []).find((record) => Number(record.ply) === ply);
  if (!chosenRecord) throw new Error(`Missing chosen move ${game.gameId} ply ${ply}`);
  const player = state.player;
  const chosenKey = AI.moveKey(chosenRecord.move);
  const alternatives = E.moveVariants(state).map((move) => {
    const result = E.applyMove(state, move);
    const evaluation = AI.evaluateWithProfile(result.state, player, evaluationProfile);
    return {
      move,
      moveKey: AI.moveKey(move),
      evaluation,
      terminal: result.state.winner !== null,
      ...eventMetrics(result.events),
    };
  }).sort((left, right) => right.evaluation - left.evaluation || left.moveKey.localeCompare(right.moveKey));
  const chosenIndex = alternatives.findIndex((row) => row.moveKey === chosenKey);
  if (chosenIndex < 0) throw new Error(`Chosen move is not legal for ${game.gameId} ply ${ply}`);
  const chosen = alternatives[chosenIndex];
  const best = alternatives[0];
  const captureAmounts = alternatives.map((row) => row.capturedSeedCount);
  const relayLengths = alternatives.map((row) => row.captureRelayLength);
  return {
    archetypeId: candidate.archetypeId || null,
    classification: candidate.classification || null,
    gameId: game.gameId,
    candidatePly: ply,
    phase: state.phase,
    player,
    legalMoveCount: alternatives.length,
    captureMoveCount: alternatives.filter((row) => row.move.type === "capture").length,
    chosenMoveKey: chosen.moveKey,
    chosenMoveType: chosen.move.type,
    chosenCapturedSeedCount: chosen.capturedSeedCount,
    chosenCaptureEventCount: chosen.captureEventCount,
    chosenRelayEventCount: chosen.relayEventCount,
    chosenCaptureRelayLength: chosen.captureRelayLength,
    chosenSowEventCount: chosen.sowEventCount,
    chosenImmediateEvaluation: chosen.evaluation,
    bestImmediateEvaluation: best.evaluation,
    immediateEvaluationGap: best.evaluation - chosen.evaluation,
    chosenImmediateRank: chosenIndex + 1,
    chosenIsImmediateBest: chosenIndex === 0,
    maxAvailableCaptureSeedCount: Math.max(...captureAmounts),
    meanAvailableCaptureSeedCount: captureAmounts.reduce((sum, value) => sum + value, 0) / captureAmounts.length,
    maxAvailableCaptureRelayLength: Math.max(...relayLengths),
    captureSeedOpportunityGap: Math.max(...captureAmounts) - chosen.capturedSeedCount,
    relayOpportunityGap: Math.max(...relayLengths) - chosen.captureRelayLength,
    chosenTerminal: chosen.terminal,
  };
}

function mean(rows, key) {
  const values = rows.map((row) => Number(row[key])).filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function summarize(rows) {
  const byClass = {};
  for (const classification of [...new Set(rows.map((row) => row.classification))].sort()) {
    const subset = rows.filter((row) => row.classification === classification);
    byClass[classification] = {
      count: subset.length,
      meanChosenCapturedSeedCount: mean(subset, "chosenCapturedSeedCount"),
      meanChosenCaptureRelayLength: mean(subset, "chosenCaptureRelayLength"),
      meanImmediateEvaluationGap: mean(subset, "immediateEvaluationGap"),
      immediateBestRate: subset.filter((row) => row.chosenIsImmediateBest).length / subset.length,
      meanCaptureSeedOpportunityGap: mean(subset, "captureSeedOpportunityGap"),
    };
  }
  return {
    analysisVersion: "9-candidate-move-quality",
    candidateCount: rows.length,
    classificationCounts: Object.fromEntries([...new Set(rows.map((row) => row.classification))].sort().map(
      (classification) => [classification, rows.filter((row) => row.classification === classification).length],
    )),
    byClassification: byClass,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const candidates = IO.readCsv(path.resolve(options.candidates));
  const games = new Map();
  for (const filename of fs.readdirSync(path.resolve(options.games)).filter((name) => name.endsWith(".json"))) {
    const game = JSON.parse(fs.readFileSync(path.join(path.resolve(options.games), filename), "utf8"));
    games.set(game.gameId, game);
  }
  const rows = candidates.map((candidate) => {
    const game = games.get(candidate.gameId);
    if (!game) throw new Error(`Missing game ${candidate.gameId}`);
    return analyzeCandidate(candidate, game, options.evaluationProfile);
  });
  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  IO.writeCsv(path.join(output, "candidate-move-quality.csv"), rows);
  const summary = summarize(rows);
  fs.writeFileSync(path.join(output, "move-quality-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}

if (require.main === module) main();
module.exports = { analyzeCandidate, eventMetrics, parseArgs, replayStates, summarize };
