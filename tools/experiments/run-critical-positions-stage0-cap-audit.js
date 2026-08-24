#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const E = require("../../public/engine.js");
const C = require("./lib/critical-positions-outcome-branching.js");

const REPLICATES = 64;
const MAX_CAP = 200;
const CAP_GRID = Object.freeze([80, 120, 160, 200]);
const R_GRID = Object.freeze([32, 48, 64]);
const POLICY_ID = "P1_NORMAL_TOP3";

function parseArgs(argv) {
  const result = { output: null };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--output") result.output = argv[++index];
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  return result;
}

function terminalWithinCap(record, cap) {
  if (record.outcome.category === "ADMINISTRATIVE_UNFINISHED") return false;
  return record.continuationMoves.length <= cap;
}

function summarizePrefix(records, r, cap) {
  const selected = records.slice(0, r);
  const counts = {
    ROOT_ACTOR_WIN: 0,
    ROOT_ACTOR_LOSS: 0,
    ADMINISTRATIVE_UNFINISHED: 0,
  };
  for (const record of selected) {
    if (!terminalWithinCap(record, cap)) {
      counts.ADMINISTRATIVE_UNFINISHED += 1;
      continue;
    }
    counts[record.outcome.category] += 1;
  }
  const completed = counts.ROOT_ACTOR_WIN + counts.ROOT_ACTOR_LOSS;
  return {
    replicates: r,
    cap,
    counts,
    completed,
    completionRate: completed / r,
  };
}

function deterministicCore(result) {
  const core = JSON.parse(JSON.stringify(result));
  delete core.resultHash;
  delete core.elapsedMs;
  return core;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = E.initialState();
  const rootMove = C.exactLegalMoves(root)[0];
  const started = performance.now();
  const records = Array.from({ length: REPLICATES }, (_, replicateIndex) => C.runContinuation(
    root, rootMove, replicateIndex, { policyId: POLICY_ID, maxContinuationPlies: MAX_CAP },
  ));
  const elapsedMs = performance.now() - started;
  const terminalContinuationPlies = records
    .filter((record) => record.outcome.category !== "ADMINISTRATIVE_UNFINISHED")
    .map((record) => record.continuationMoves.length);
  const result = {
    schemaVersion: 1,
    stageId: "CPOB-S0-CAP-AUDIT-2026-08-23-v1",
    technicalOnly: true,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    scientificSeedConsumed: false,
    reservedScientificSeedBlocksTouched: false,
    fixtureId: "initial/rootMoveLexicographicFirst",
    policyId: POLICY_ID,
    rootRuleStateKey: C.runContinuation(root, rootMove, 0, {
      policyId: POLICY_ID, maxContinuationPlies: 0,
    }).rootIdentity.ruleStateKey,
    rootMoveKey: C.exactLegalMoves(root)[0] && require("../../public/ai.js").moveKey(rootMove),
    replicateCount: REPLICATES,
    maxContinuationPlies: MAX_CAP,
    elapsedMs,
    totalRecordedContinuationPlies: records.reduce(
      (sum, record) => sum + record.continuationMoves.length, 0,
    ),
    bytes: Buffer.byteLength(JSON.stringify(records)),
    nativeTerminalCountByMaxCap: terminalContinuationPlies.length,
    terminalContinuationPlySummary: terminalContinuationPlies.length ? {
      min: Math.min(...terminalContinuationPlies),
      max: Math.max(...terminalContinuationPlies),
      mean: terminalContinuationPlies.reduce((a, b) => a + b, 0) / terminalContinuationPlies.length,
    } : null,
    grid: R_GRID.flatMap((r) => CAP_GRID.map((cap) => summarizePrefix(records, r, cap))),
    records,
  };
  result.resultHash = C.canonicalHash(deterministicCore(result));
  const text = `${JSON.stringify(result, null, 2)}\n`;
  if (args.output) {
    fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
    fs.writeFileSync(args.output, text);
  } else process.stdout.write(text);
}

main();
