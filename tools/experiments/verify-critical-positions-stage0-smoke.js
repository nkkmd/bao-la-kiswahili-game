#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const { identityKeys, stableStringify } = require("./lib/position-typology-features.js");
const Search = require("./lib/position-complexity-search-diagnostic.js");

const SALT = "CPOB-S0-TECHNICAL-2026-08-23-v1";
const SEARCH_OPTIONS = {
  evaluationProfile: "bao",
  quiescenceDepth: 1,
  orderQuiescenceCaptures: false,
};

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

function seed32(root, replicateIndex) {
  const identity = identityKeys(root);
  return Number.parseInt(sha256(`${SALT}|${identity.ruleStateKey}|${root.player}|${replicateIndex}`)
    .slice(0, 8), 16) >>> 0;
}

function legal(state) {
  return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
}

function selector(policyId, seed) {
  const random = seededRandom(seed);
  return (state) => {
    const moves = legal(state);
    if (policyId === "P1_NORMAL_TOP3") {
      const result = AI.analyzeMove(state, "normal", random, { evaluationProfile: "bao" });
      return moves.find((move) => AI.moveKey(move) === AI.moveKey(result.move));
    }
    if (policyId === "P2_D2_TOP3") {
      const diagnostic = Search.analyzeRootCandidates(state, 2, SEARCH_OPTIONS);
      const pool = diagnostic.candidates.slice(0, Math.min(3, diagnostic.candidates.length));
      const selected = pool[Math.floor(random() * pool.length)].moveKey;
      return moves.find((move) => AI.moveKey(move) === selected);
    }
    if (policyId === "P3_UNIFORM_LEGAL") return moves[Math.floor(random() * moves.length)];
    throw new Error(`Unknown policy: ${policyId}`);
  };
}

function initialFixture() { return E.initialState(); }

function replaySample(root, sample) {
  const rootMove = legal(root).find((move) => AI.moveKey(move) === sample.rootMoveKey);
  assert.ok(rootMove, `missing root move ${sample.rootMoveKey}`);
  const derivedSeed = seed32(root, sample.replicateIndex);
  assert.equal(sample.seed32, derivedSeed);
  let state = E.applyMove(root, rootMove).state;
  const select = selector(sample.policyId, derivedSeed);
  const observed = [];
  for (let ply = 0; ply < sample.maxContinuationPlies && state.winner === null; ply += 1) {
    const move = select(state);
    assert.ok(move, "verifier selector returned no move");
    const applied = E.applyMove(state, move);
    observed.push({ moveKey: AI.moveKey(move), afterRuleStateKey: identityKeys(applied.state).ruleStateKey });
    state = applied.state;
  }
  assert.deepEqual(observed.map((item) => item.moveKey),
    sample.continuationMoves.map((item) => item.moveKey));
  assert.deepEqual(observed.map((item) => item.afterRuleStateKey),
    sample.continuationMoves.map((item) => item.afterRuleStateKey));
  const category = state.winner === null ? "ADMINISTRATIVE_UNFINISHED"
    : state.winner === root.player ? "ROOT_ACTOR_WIN" : "ROOT_ACTOR_LOSS";
  assert.equal(sample.outcome.category, category);
  assert.equal(sample.finalIdentity.ruleStateKey, identityKeys(state).ruleStateKey);
}

function main() {
  const { input } = parseArgs(process.argv.slice(2));
  const result = JSON.parse(fs.readFileSync(input, "utf8"));
  assert.equal(result.technicalOnly, true);
  assert.equal(result.scientificInferenceAuthorized, false);
  assert.equal(result.confirmatoryReuseAllowed, false);
  assert.equal(result.scientificSeedConsumed, false);
  assert.equal(result.reservedScientificSeedBlocksTouched, false);
  const withoutHash = { ...result };
  delete withoutHash.resultHash;
  assert.equal(result.resultHash, stableHash(withoutHash), "resultHash mismatch");

  const root = initialFixture();
  for (const sample of result.replaySamples) replaySample(root, sample);
  assert.equal(result.audit.exactInitialMoveCount, legal(root).length);
  assert.equal(result.audit.houseChoice.distinctMoveKeys, true);
  assert.equal(result.audit.houseChoice.distinctResultStates, true);
  assert.equal(result.audit.terminal.category, "ROOT_ACTOR_WIN");
  assert.equal(result.audit.terminal.reason, "front-empty");
  assert.equal(result.audit.phaseChange.after, "mtaji");
  assert.equal(result.audit.administrativeCap.category, "ADMINISTRATIVE_UNFINISHED");
  for (const item of result.audit.pairedSeedExamples) assert.equal(item.seed32, seed32(root, item.replicateIndex));
  const search = Search.analyzeDepthTrace(root, [2, 3], SEARCH_OPTIONS);
  assert.deepEqual(result.audit.exactSearch, search, "exact D2/D3 diagnostic recomputation mismatch");
  assert.equal(result.audit.structuralBranchCount, legal(root).length);
  assert.equal(result.benchmarks.length, 3);
  for (const benchmark of result.benchmarks) {
    assert.equal(benchmark.replicates, 32);
    assert.equal(benchmark.maxContinuationPlies, 24);
    assert.equal(Number.isFinite(benchmark.elapsedMs) && benchmark.elapsedMs >= 0, true);
    assert.equal(Number.isFinite(benchmark.meanBytesPerContinuation) && benchmark.meanBytesPerContinuation > 0, true);
  }

  console.log(JSON.stringify({
    stageId: result.stageId,
    passed: true,
    replaySamplesVerified: result.replaySamples.length,
    resultHash: result.resultHash,
    scientificSeedConsumed: false,
  }, null, 2));
}

main();
