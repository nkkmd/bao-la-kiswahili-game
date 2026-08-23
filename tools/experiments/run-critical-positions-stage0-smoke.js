#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const C = require("./lib/critical-positions-outcome-branching.js");

function parseArgs(argv) {
  const result = { output: null };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--output") result.output = argv[++index];
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  return result;
}

function houseChoiceFixture() {
  const state = E.initialState();
  state.pits = [
    [Array(8).fill(0), Array(8).fill(0)],
    [Array(8).fill(0), Array(8).fill(0)],
  ];
  state.pits[0][E.FRONT][2] = 1;
  state.pits[0][E.FRONT][E.HOUSE] = 6;
  state.pits[0][E.FRONT][6] = 1;
  state.pits[1][E.FRONT][5] = 5;
  state.pits[1][E.FRONT][6] = 1;
  state.reserve = [10, 10];
  state.houseOwned = [true, true];
  state.player = 0;
  state.phase = "namua";
  state.winner = null;
  state.reason = "";
  state.turn = 10;
  state.pending = [0, 0];
  return state;
}

function terminalCaptureFixture() {
  const state = E.initialState();
  state.pits = [
    [Array(8).fill(0), Array(8).fill(0)],
    [Array(8).fill(0), Array(8).fill(0)],
  ];
  state.pits[0][E.FRONT][0] = 2;
  state.pits[1][E.FRONT][5] = 2;
  state.reserve = [0, 0];
  state.houseOwned = [false, false];
  state.player = 0;
  state.phase = "mtaji";
  state.winner = null;
  state.reason = "";
  state.turn = 60;
  state.pending = [0, 0];
  return state;
}

function phaseChangeFixture() {
  const state = E.initialState();
  state.reserve = [1, 0];
  state.player = 0;
  state.phase = "namua";
  state.winner = null;
  state.reason = "";
  return state;
}

function benchmarkPolicy(root, policyId) {
  const move = C.exactLegalMoves(root)[0];
  const replicates = 32;
  const maxContinuationPlies = 24;
  const started = performance.now();
  const records = Array.from({ length: replicates }, (_, replicateIndex) => C.runContinuation(
    root, move, replicateIndex, { policyId, maxContinuationPlies },
  ));
  const elapsedMs = performance.now() - started;
  const bytes = Buffer.byteLength(JSON.stringify(records));
  return {
    policyId,
    replicates,
    maxContinuationPlies,
    elapsedMs,
    bytes,
    meanBytesPerContinuation: bytes / replicates,
    outcomeCounts: C.summarizeOutcomes(records).counts,
    meanRecordedContinuationPlies: records.reduce(
      (sum, record) => sum + record.continuationMoves.length, 0,
    ) / records.length,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const initial = E.initialState();
  const house = houseChoiceFixture();
  const terminal = terminalCaptureFixture();
  const phase = phaseChangeFixture();
  const houseVariants = C.exactLegalMoves(house);
  const stop = houseVariants.find((move) => move.houseChoice === "stop" && move.side === "left");
  const use = houseVariants.find((move) => move.houseChoice === "use" && move.side === "left");
  if (!stop || !use) throw new Error("House-choice fixture did not expose stop/use pair");

  const replaySamples = [];
  for (const policyId of C.POLICY_IDS) {
    for (const move of C.exactLegalMoves(initial).slice(0, 2)) {
      for (const replicateIndex of [0, 1]) {
        replaySamples.push(C.runContinuation(initial, move, replicateIndex, {
          policyId, maxContinuationPlies: 12,
        }));
      }
    }
  }

  const terminalMove = C.exactLegalMoves(terminal)[0];
  const terminalRecord = C.runContinuation(terminal, terminalMove, 0, {
    policyId: "P1_NORMAL_TOP3", maxContinuationPlies: 12,
  });
  const phaseMove = C.exactLegalMoves(phase)[0];
  const phaseAfter = E.applyMove(phase, phaseMove).state;
  const capRecord = C.runContinuation(initial, C.exactLegalMoves(initial)[0], 0, {
    policyId: "P1_NORMAL_TOP3", maxContinuationPlies: 0,
  });

  const result = {
    schemaVersion: 1,
    stageId: "CPOB-S0-TECHNICAL-2026-08-23-v1",
    technicalOnly: true,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    scientificSeedConsumed: false,
    reservedScientificSeedBlocksTouched: false,
    fixtureIds: ["initial", "house-choice", "terminal-capture", "phase-change"],
    audit: {
      exactInitialMoveCount: C.exactLegalMoves(initial).length,
      houseChoice: {
        stopMoveKey: AI.moveKey(stop),
        useMoveKey: AI.moveKey(use),
        distinctMoveKeys: AI.moveKey(stop) !== AI.moveKey(use),
        distinctResultStates: JSON.stringify(E.applyMove(house, stop).state)
          !== JSON.stringify(E.applyMove(house, use).state),
      },
      terminal: terminalRecord.outcome,
      phaseChange: { before: phase.phase, after: phaseAfter.phase },
      administrativeCap: capRecord.outcome,
      pairedSeedExamples: [0, 1, 2, 3].map((replicateIndex) => ({
        replicateIndex,
        seed32: C.deriveReplicateSeed32(initial, replicateIndex),
      })),
      exactSearch: C.secondarySearchAxes(initial),
      structuralBranchCount: C.structuralBranchSummary(initial).length,
    },
    replaySamples,
    benchmarks: C.POLICY_IDS.map((policyId) => benchmarkPolicy(initial, policyId)),
  };
  result.resultHash = C.canonicalHash({ ...result, resultHash: undefined });
  const text = `${JSON.stringify(result, null, 2)}\n`;
  if (args.output) {
    fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
    fs.writeFileSync(args.output, text);
  } else process.stdout.write(text);
}

main();
