#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const { seededRandom } = require("./benchmark.js");

function swapPlayer(value) {
  return value === null ? null : 1 - value;
}

function mirrorState(state) {
  return {
    ...JSON.parse(JSON.stringify(state)),
    pits: [
      [state.pits[1][0].slice().reverse(), state.pits[1][1].slice().reverse()],
      [state.pits[0][0].slice().reverse(), state.pits[0][1].slice().reverse()],
    ],
    reserve: [state.reserve[1], state.reserve[0]],
    houseOwned: [state.houseOwned[1], state.houseOwned[0]],
    player: 1 - state.player,
    winner: swapPlayer(state.winner),
    pending: [state.pending[1], state.pending[0]],
  };
}

function mirrorMove(move) {
  const mirrored = JSON.parse(JSON.stringify(move));
  if (typeof mirrored.player === "number") mirrored.player = 1 - mirrored.player;
  if (typeof mirrored.index === "number") mirrored.index = 7 - mirrored.index;
  if (typeof mirrored.start === "number") mirrored.start = 7 - mirrored.start;
  if (typeof mirrored.side === "string") mirrored.side = mirrored.side === "left" ? "right" : "left";
  if (typeof mirrored.direction === "string") mirrored.direction = mirrored.direction === "left" ? "right" : "left";
  return mirrored;
}

function canonicalMoves(state) {
  return E.moveVariants(state).map((move) => AI.moveKey(move)).sort();
}

function reachableStates(count, seed) {
  const random = seededRandom(seed);
  const states = [];
  let state = E.initialState();
  while (states.length < count) {
    if (state.winner !== null || E.moveVariants(state).length === 0) state = E.initialState();
    states.push(E.clone(state));
    const moves = E.moveVariants(state);
    const move = moves[Math.floor(random() * moves.length)];
    state = E.applyMove(state, move).state;
  }
  return states;
}

function main() {
  const output = process.argv[2] || "artifacts/first-player-suite/symmetry.json";
  const states = reachableStates(200, 20260714);
  const details = states.map((state, index) => {
    const mirrored = mirrorState(state);
    const expectedMoves = E.moveVariants(state).map(mirrorMove).map((move) => AI.moveKey(move)).sort();
    const actualMoves = canonicalMoves(mirrored);
    const legalMoveSymmetric = JSON.stringify(expectedMoves) === JSON.stringify(actualMoves);
    const legacyA = AI.evaluationBreakdown(state, state.player, { evaluationProfile: "legacy" }).total;
    const legacyB = AI.evaluationBreakdown(mirrored, mirrored.player, { evaluationProfile: "legacy" }).total;
    const baoA = AI.evaluationBreakdown(state, state.player, { evaluationProfile: "bao" }).total;
    const baoB = AI.evaluationBreakdown(mirrored, mirrored.player, { evaluationProfile: "bao" }).total;
    return {
      index,
      phase: state.phase,
      turn: state.turn,
      legalMoveSymmetric,
      legacyEvaluationSymmetric: legacyA === legacyB,
      baoEvaluationSymmetric: baoA === baoB,
      legalMoveCount: expectedMoves.length,
      mirroredMoveCount: actualMoves.length,
      legacyScores: [legacyA, legacyB],
      baoScores: [baoA, baoB],
    };
  });
  const summary = {
    states: details.length,
    legalMoveSymmetryPasses: details.filter((item) => item.legalMoveSymmetric).length,
    legacyEvaluationSymmetryPasses: details.filter((item) => item.legacyEvaluationSymmetric).length,
    baoEvaluationSymmetryPasses: details.filter((item) => item.baoEvaluationSymmetric).length,
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify({ generatedAt: new Date().toISOString(), summary, details }, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}

if (require.main === module) main();
module.exports = { mirrorState, mirrorMove, reachableStates };
