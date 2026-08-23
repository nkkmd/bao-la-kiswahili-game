#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const { identityKeys, stableStringify } = require("./lib/position-typology-features.js");

const SALT = "CPOB-S0-TECHNICAL-2026-08-23-v1";
const POLICY_ID = "P1_NORMAL_TOP3";
const MAX_CAP = 200;
const CAP_GRID = [80, 120, 160, 200];
const R_GRID = [32, 48, 64];

function parseArgs(argv) {
  let input = null;
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--input") input = argv[++index];
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  if (!input) throw new Error("--input is required");
  return { input };
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableHash(value) {
  return sha256(stableStringify(value));
}

function deterministicCore(result) {
  const core = JSON.parse(JSON.stringify(result));
  delete core.resultHash;
  delete core.elapsedMs;
  return core;
}

function seed32(root, replicateIndex) {
  const identity = identityKeys(root);
  return Number.parseInt(sha256(`${SALT}|${identity.ruleStateKey}|${root.player}|${replicateIndex}`)
    .slice(0, 8), 16) >>> 0;
}

function legal(state) {
  return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
}

function replay(root, rootMove, replicateIndex) {
  const random = seededRandom(seed32(root, replicateIndex));
  let state = E.applyMove(root, rootMove).state;
  const moveKeys = [];
  const stateKeys = [];
  for (let ply = 0; ply < MAX_CAP && state.winner === null; ply += 1) {
    const analyzed = AI.analyzeMove(state, "normal", random, { evaluationProfile: "bao" });
    const exact = legal(state).find((move) => AI.moveKey(move) === AI.moveKey(analyzed.move));
    assert.ok(exact, "P1 verifier selected non-exact move");
    const applied = E.applyMove(state, exact);
    moveKeys.push(AI.moveKey(exact));
    stateKeys.push(identityKeys(applied.state).ruleStateKey);
    state = applied.state;
  }
  return { state, moveKeys, stateKeys };
}

function completion(records, r, cap) {
  const counts = { ROOT_ACTOR_WIN: 0, ROOT_ACTOR_LOSS: 0, ADMINISTRATIVE_UNFINISHED: 0 };
  for (const record of records.slice(0, r)) {
    const terminalWithinCap = record.outcome.category !== "ADMINISTRATIVE_UNFINISHED"
      && record.continuationMoves.length <= cap;
    if (!terminalWithinCap) counts.ADMINISTRATIVE_UNFINISHED += 1;
    else counts[record.outcome.category] += 1;
  }
  const completed = counts.ROOT_ACTOR_WIN + counts.ROOT_ACTOR_LOSS;
  return { replicates: r, cap, counts, completed, completionRate: completed / r };
}

function main() {
  const { input } = parseArgs(process.argv.slice(2));
  const result = JSON.parse(fs.readFileSync(input, "utf8"));
  assert.equal(result.technicalOnly, true);
  assert.equal(result.scientificInferenceAuthorized, false);
  assert.equal(result.confirmatoryReuseAllowed, false);
  assert.equal(result.scientificSeedConsumed, false);
  assert.equal(result.reservedScientificSeedBlocksTouched, false);
  assert.equal(result.policyId, POLICY_ID);
  assert.equal(result.replicateCount, 64);
  assert.equal(result.maxContinuationPlies, MAX_CAP);
  assert.equal(result.resultHash, stableHash(deterministicCore(result)));

  const root = E.initialState();
  const rootMove = legal(root)[0];
  assert.equal(result.rootMoveKey, AI.moveKey(rootMove));
  assert.equal(result.rootRuleStateKey, identityKeys(root).ruleStateKey);
  assert.equal(result.records.length, 64);

  for (let replicateIndex = 0; replicateIndex < 64; replicateIndex += 1) {
    const record = result.records[replicateIndex];
    assert.equal(record.replicateIndex, replicateIndex);
    assert.equal(record.seed32, seed32(root, replicateIndex));
    const replayed = replay(root, rootMove, replicateIndex);
    assert.deepEqual(replayed.moveKeys, record.continuationMoves.map((item) => item.moveKey));
    assert.deepEqual(replayed.stateKeys,
      record.continuationMoves.map((item) => item.afterRuleStateKey));
    const category = replayed.state.winner === null ? "ADMINISTRATIVE_UNFINISHED"
      : replayed.state.winner === root.player ? "ROOT_ACTOR_WIN" : "ROOT_ACTOR_LOSS";
    assert.equal(record.outcome.category, category);
    assert.equal(record.finalIdentity.ruleStateKey, identityKeys(replayed.state).ruleStateKey);
  }

  const expectedGrid = R_GRID.flatMap((r) => CAP_GRID.map((cap) => completion(result.records, r, cap)));
  assert.deepEqual(result.grid, expectedGrid);
  console.log(JSON.stringify({
    stageId: result.stageId,
    passed: true,
    recordsReplayed: 64,
    resultHash: result.resultHash,
    grid: result.grid,
    scientificSeedConsumed: false,
  }, null, 2));
}

main();
