#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const { reachableStates } = require("./symmetry/generate-states.js");
const {
  CANDIDATES,
  mirrorMove,
  mirrorState,
  moveFor,
  stateFor,
} = require("./symmetry/transform-candidates.js");

function parseArgs(argv) {
  const options = {
    candidate: "D", count: 200, seed: 20260714, input: null, output: null,
    summaryOutput: null, summaryOnly: false,
  };
  if (argv[0] && !argv[0].startsWith("--")) options.output = argv[0];
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index + 1];
    if (argv[index] === "--candidate") options.candidate = value.toUpperCase();
    if (argv[index] === "--count") options.count = Number(value);
    if (argv[index] === "--seed") options.seed = Number(value);
    if (argv[index] === "--input") options.input = value;
    if (argv[index] === "--output") options.output = value;
    if (argv[index] === "--summary-output") options.summaryOutput = value;
    if (argv[index] === "--summary-only") options.summaryOnly = true;
  }
  if (!CANDIDATES[options.candidate]) throw new Error("Invalid --candidate (expected A, B, C, or D)");
  if (!Number.isInteger(options.count) || options.count < 1) throw new Error("Invalid --count");
  if (!Number.isInteger(options.seed)) throw new Error("Invalid --seed");
  return options;
}

function readStates(input) {
  return fs.readFileSync(input, "utf8").trim().split("\n")
    .filter(Boolean).map((line) => JSON.parse(line));
}

function moveKeys(moves) {
  return moves.map((move) => AI.moveKey(move)).sort();
}

function difference(left, right) {
  const remaining = [...right];
  return left.filter((value) => {
    const index = remaining.indexOf(value);
    if (index < 0) return true;
    remaining.splice(index, 1);
    return false;
  });
}

function deltaObject(original = {}, mirrored = {}) {
  return Object.fromEntries([...new Set([...Object.keys(original), ...Object.keys(mirrored)])]
    .map((name) => [name, (original[name] || 0) - (mirrored[name] || 0)]));
}

function metadataFor(state) {
  const moves = E.moveVariants(state);
  return {
    phase: state.phase,
    player: state.player,
    turn: state.turn,
    reserve: state.reserve.slice(),
    houseOwned: state.houseOwned.slice(),
    nyumbaSeeds: state.pits.map((rows) => rows[E.FRONT][E.HOUSE]),
    captureAvailable: moves.some((move) => move.type === "capture"),
    takataAvailable: moves.some((move) => move.type === "takata"),
    legalMoveCount: moves.length,
    pending: state.pending?.slice() || [0, 0],
  };
}

function auditState(state, index, candidate) {
  const mirroredState = stateFor(candidate, state);
  const expectedMoves = moveKeys(E.moveVariants(state).map((move) => moveFor(candidate, move)));
  const actualMoves = moveKeys(E.moveVariants(mirroredState));
  const originalEvaluation = {
    legacy: AI.legacyEvaluate(state, state.player),
    bao: AI.evaluationBreakdown(state, state.player, { evaluationProfile: "bao" }),
  };
  const mirroredEvaluation = {
    legacy: AI.legacyEvaluate(mirroredState, mirroredState.player),
    bao: AI.evaluationBreakdown(mirroredState, mirroredState.player, { evaluationProfile: "bao" }),
  };
  return {
    index,
    state,
    mirroredState,
    expectedMoves,
    actualMoves,
    missingMoves: difference(expectedMoves, actualMoves),
    unexpectedMoves: difference(actualMoves, expectedMoves),
    originalEvaluation,
    mirroredEvaluation,
    evaluationDelta: {
      legacy: originalEvaluation.legacy - mirroredEvaluation.legacy,
      total: originalEvaluation.bao.total - mirroredEvaluation.bao.total,
      features: deltaObject(originalEvaluation.bao.features, mirroredEvaluation.bao.features),
      contributions: deltaObject(
        originalEvaluation.bao.contributions,
        mirroredEvaluation.bao.contributions,
      ),
    },
    metadata: metadataFor(state),
    legalMoveSymmetric: JSON.stringify(expectedMoves) === JSON.stringify(actualMoves),
    legacyEvaluationSymmetric: originalEvaluation.legacy === mirroredEvaluation.legacy,
    baoEvaluationSymmetric: originalEvaluation.bao.total === mirroredEvaluation.bao.total,
  };
}

function summarize(details) {
  return {
    states: details.length,
    legalMoveSymmetryPasses: details.filter((item) => item.legalMoveSymmetric).length,
    legacyEvaluationSymmetryPasses: details.filter((item) => item.legacyEvaluationSymmetric).length,
    baoEvaluationSymmetryPasses: details.filter((item) => item.baoEvaluationSymmetric).length,
  };
}

function writeJson(output, value) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`);
}

function auditStates(states, candidate = "D") {
  const details = states.map((state, index) => auditState(state, index, candidate));
  return { candidate, transform: CANDIDATES[candidate], summary: summarize(details), details };
}

function auditSummary(states, candidate = "D") {
  const counts = {
    states: 0,
    legalMoveSymmetryPasses: 0,
    legacyEvaluationSymmetryPasses: 0,
    baoEvaluationSymmetryPasses: 0,
  };
  const mismatches = [];
  states.forEach((state, index) => {
    const detail = auditState(state, index, candidate);
    counts.states += 1;
    if (detail.legalMoveSymmetric) counts.legalMoveSymmetryPasses += 1;
    if (detail.legacyEvaluationSymmetric) counts.legacyEvaluationSymmetryPasses += 1;
    if (detail.baoEvaluationSymmetric) counts.baoEvaluationSymmetryPasses += 1;
    if (!detail.legalMoveSymmetric || !detail.legacyEvaluationSymmetric
      || !detail.baoEvaluationSymmetric) mismatches.push(detail);
  });
  return { candidate, transform: CANDIDATES[candidate], summary: counts, details: mismatches };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const states = options.input ? readStates(options.input) : reachableStates(options.count, options.seed);
  const result = {
    generatedAt: new Date().toISOString(),
    seed: options.input ? null : options.seed,
    input: options.input,
    ...(options.summaryOnly
      ? auditSummary(states, options.candidate)
      : auditStates(states, options.candidate)),
  };
  if (options.output) {
    writeJson(options.output, result);
  }
  if (options.summaryOutput) writeJson(options.summaryOutput, {
    generatedAt: result.generatedAt,
    seed: result.seed,
    input: result.input,
    candidate: result.candidate,
    transform: result.transform,
    summary: result.summary,
  });
  process.stdout.write(`${JSON.stringify({ candidate: result.candidate, ...result.summary }, null, 2)}\n`);
}

if (require.main === module) main();
module.exports = {
  auditState,
  auditStates,
  auditSummary,
  mirrorMove,
  mirrorState,
  parseArgs,
  reachableStates,
};
