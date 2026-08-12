#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { identityKeys } = require("./lib/position-typology-features.js");
const D = require("./lib/position-complexity-search-diagnostic.js");

function hashValue(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function fixtures() {
  return [
    { id: "initial", state: E.initialState(), depths: [1, 2, 3] },
    {
      id: "forced-namua-single-choice",
      state: {
        pits: [
          [[0, 0, 0, 0, 0, 4, 5, 1], [0, 0, 0, 0, 0, 0, 1, 1]],
          [[0, 1, 0, 6, 9, 0, 1, 0], [0, 0, 0, 0, 0, 0, 1, 1]],
        ],
        reserve: [16, 17], houseOwned: [false, true], player: 1, phase: "namua",
        winner: null, reason: "", turn: 12, pending: [0, 0],
      },
      depths: [1, 2, 3],
    },
    {
      id: "mtaji-forced-win",
      state: {
        pits: [
          [[1, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)],
          [[1, 1, 0, 0, 0, 0, 0, 2], Array(8).fill(0)],
        ],
        reserve: [0, 0], houseOwned: [false, false], player: 1, phase: "mtaji",
        winner: null, reason: "", turn: 50, pending: [0, 0],
      },
      depths: [1, 2, 3, 4],
    },
  ];
}

function compareEngine(state, depth) {
  const diagnostic = D.analyzeRootCandidates(state, depth);
  const engine = AI.analyzeMove(state, "hard", () => 0, {
    searchProfile: "phase2",
    evaluationProfile: "bao",
    maxDepth: depth,
    timeLimitMs: Infinity,
    quiescenceDepth: 1,
    stableBestDepths: 0,
    aspirationWindow: 0,
  });
  return {
    passed: !engine.stats.timedOut
      && engine.stats.completedDepth === depth
      && engine.stats.rootScore === diagnostic.bestScore
      && diagnostic.topSetMoveKeys.includes(AI.moveKey(engine.move)),
    diagnosticBestScore: diagnostic.bestScore,
    diagnosticTopSet: diagnostic.topSetMoveKeys,
    engineRootScore: engine.stats.rootScore,
    engineMoveKey: AI.moveKey(engine.move),
    engineCompletedDepth: engine.stats.completedDepth,
    engineTimedOut: engine.stats.timedOut,
  };
}

function auditFixture(fixture) {
  const sourceSnapshot = JSON.stringify(fixture.state);
  const legalMoveKeys = E.moveVariants(fixture.state).map((move) => AI.moveKey(move)).sort();
  const traceA = D.analyzeDepthTrace(fixture.state, fixture.depths);
  const traceB = D.analyzeDepthTrace(fixture.state, fixture.depths.slice().reverse());
  const directConsistency = traceA.results.every((result) =>
    JSON.stringify(result) === JSON.stringify(D.analyzeRootCandidates(fixture.state, result.depth)));
  const candidateExhaustive = traceA.results.every((result) => {
    const keys = result.candidates.map(({ moveKey }) => moveKey).sort();
    return JSON.stringify(keys) === JSON.stringify(legalMoveKeys)
      && new Set(keys).size === legalMoveKeys.length;
  });
  const replayValid = traceA.results.every((result) => result.candidates.every(({ moveKey }) => {
    const move = E.moveVariants(fixture.state).find((candidate) => AI.moveKey(candidate) === moveKey);
    if (!move) return false;
    try {
      E.applyMove(fixture.state, move);
      return true;
    } catch {
      return false;
    }
  }));
  const identity = identityKeys(fixture.state);
  const identityValid = [identity.historicalStateHash, identity.ruleStateKey, identity.seatCanonicalKey]
    .every((value) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value));
  const engineComparisons = fixture.depths.map((depth) => ({ depth, ...compareEngine(fixture.state, depth) }));
  const stateUnchanged = JSON.stringify(fixture.state) === sourceSnapshot;
  return {
    id: fixture.id,
    stateKey: AI.stateKey(fixture.state),
    identity,
    legalMoveCount: legalMoveKeys.length,
    depths: fixture.depths,
    gates: {
      G0_1_stateImmutability: stateUnchanged,
      G0_2_legalRootExhaustiveness: candidateExhaustive,
      G0_3_commonRootPlayerPerspective: engineComparisons.every(({ passed }) => passed),
      G0_4_fixedDepthConsistency: engineComparisons.every(({ passed }) => passed),
      G0_5_determinism: JSON.stringify(traceA) === JSON.stringify(traceB),
      G0_6_depthTraceConsistency: directConsistency,
      G0_7_replayValidity: replayValid,
      G0_8_identityAvailability: identityValid,
    },
    engineComparisons,
    traceHash: hashValue(traceA),
    trace: traceA,
  };
}

function main() {
  const audited = fixtures().map(auditFixture);
  const gates = Object.fromEntries(Object.keys(audited[0].gates).map((gate) => [
    gate, audited.every((fixture) => fixture.gates[gate]),
  ]));
  const passed = Object.values(gates).every(Boolean);
  const result = {
    schemaVersion: 1,
    study: "position-complexity",
    stage: "stage0-technical-smoke",
    scientificInferenceAuthorized: false,
    formalCorpus: false,
    searchSemantics: D.SEARCH_SEMANTICS,
    fixtures: audited,
    aggregateGates: gates,
    G0_9_existingSearchBehaviorProtection: "run test/search.test.js separately",
    passed,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!passed) process.exitCode = 1;
}

if (require.main === module) main();
module.exports = { auditFixture, compareEngine, fixtures };
