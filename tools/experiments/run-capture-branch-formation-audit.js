#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { experimentConfig, parseArgs, runGame } = require("./run-phase-transition-research.js");
const F = require("./analyze-capture-branch-formation.js");
const IO = require("./analyze-forced-capture-regimes.js");

const CANDIDATES = [
  { archetypeId: "22807aff1baf", gameId: "pt-pilot-v2-0091", candidatePly: 30 },
  { archetypeId: "6b364e603366", gameId: "pt-pilot-v2-0082", candidatePly: 9 },
  { archetypeId: "9f778d512ae1", gameId: "pt-pilot-v2-0006", candidatePly: 7 },
  { archetypeId: "9f778d512ae1", gameId: "pt-pilot-v2-0017", candidatePly: 7 },
  { archetypeId: "9f778d512ae1", gameId: "pt-pilot-v2-0069", candidatePly: 7 },
];

function gameIndex(gameId) {
  const match = gameId.match(/(\d+)$/);
  if (!match) throw new Error(`Cannot parse game index: ${gameId}`);
  return Number(match[1]);
}

function average(rows, field) {
  return rows.reduce((sum, row) => sum + Number(row[field] || 0), 0) / rows.length;
}

function main() {
  const output = path.resolve(process.argv[2] || "artifacts/local/phase-transition-capture-branch-formation");
  const config = experimentConfig(parseArgs(["--profile", "pilot-v2"]));
  const timeline = [];
  const deltas = [];
  for (const candidate of CANDIDATES) {
    const game = runGame(config, gameIndex(candidate.gameId));
    const states = F.replayStates(game);
    const candidatePlayer = states[candidate.candidatePly].player;
    const rows = [];
    for (let offset = 0; offset <= 8 && candidate.candidatePly + offset < states.length; offset += 1) {
      const row = F.metricRow(states[candidate.candidatePly + offset], candidatePlayer, candidate.gameId, candidate.candidatePly, offset);
      rows.push(row);
      timeline.push({ archetypeId: candidate.archetypeId, ...row });
    }
    deltas.push(F.deltaRecord(candidate, rows));
  }
  const summary = {
    analysisVersion: "10-capture-branch-formation",
    executionMode: "targeted-deterministic-audit",
    metricPerspective: "player-to-move",
    candidateCount: CANDIDATES.length,
    uniqueArchetypeCount: new Set(CANDIDATES.map((row) => row.archetypeId)).size,
    window: 8,
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
  fs.mkdirSync(output, { recursive: true });
  IO.writeCsv(path.join(output, "capture-branch-formation-timeline.csv"), timeline);
  IO.writeCsv(path.join(output, "capture-branch-formation-deltas.csv"), deltas);
  fs.writeFileSync(path.join(output, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}

if (require.main === module) main();
module.exports = { CANDIDATES, gameIndex };
