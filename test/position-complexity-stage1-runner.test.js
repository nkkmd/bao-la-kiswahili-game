"use strict";

const assert = require("node:assert/strict");
const { identityKeys } = require("../tools/experiments/lib/position-typology-features.js");
const {
  assignedPhase,
  loadSpec,
  runGame,
  selectionRank,
  stateFromObservation,
} = require("../tools/experiments/run-position-complexity-stage1-exploratory.js");
const { verifyGame } = require("../tools/experiments/verify-position-complexity-stage1-exploratory.js");

const { spec: frozen } = loadSpec();
const spec = JSON.parse(JSON.stringify(frozen));
spec.population.maxPly = 12;
spec.population.games = 1;
spec.population.seedEnd = spec.population.seedStart;
const testSpecSha = "technical-test-spec";

{
  const a = assignedPhase("0".repeat(64), spec.stateSelection);
  const b = assignedPhase("0".repeat(64), spec.stateSelection);
  assert.ok(["namua", "mtaji"].includes(a));
  assert.equal(a, b, "phase assignment is deterministic");
}

{
  const first = runGame(spec, testSpecSha, 0);
  const second = runGame(spec, testSpecSha, 0);
  assert.equal(first.seed, spec.population.seedStart);
  assert.equal(first.gameId, "pcx-s1-0000");
  assert.equal(first.plies, second.plies);
  assert.equal(first.historicalTrajectoryHash, second.historicalTrajectoryHash,
    "fixed seeded technical trajectory is deterministic");
  assert.equal(first.ruleTrajectoryHash, second.ruleTrajectoryHash,
    "rule trajectory identity is deterministic");
  assert.deepEqual(first.moves.map(({ moveKey }) => moveKey), second.moves.map(({ moveKey }) => moveKey),
    "fixed seeded move sequence is deterministic");
  assert.ok(first.moves.slice(spec.population.opening.plies)
    .every(({ generationSearch }) => generationSearch && !generationSearch.timedOut
      && generationSearch.completedDepth === spec.population.trajectoryGenerator.maxDepth),
  "post-opening trajectory moves complete the frozen depth-2 generator");

  const verified = verifyGame(first, 0, spec, testSpecSha, true);
  assert.equal(verified.gameIndex, 0);
  assert.equal(verified.seed, spec.population.seedStart);
  assert.ok(verified.searchMovesRecomputed > 0,
    "technical verifier recomputes post-opening search decisions");

  const observation = first.observations[Math.min(8, first.observations.length - 1)];
  const state = stateFromObservation(observation);
  assert.equal(identityKeys(state).ruleStateKey, observation.identity.ruleStateKey,
    "stored observation reconstructs the same rule state");

  const rankA = selectionRank(first, observation, spec.stateSelection);
  const rankB = selectionRank(first, observation, spec.stateSelection);
  assert.match(rankA, /^[a-f0-9]{64}$/);
  assert.equal(rankA, rankB, "within-trajectory selection rank is deterministic");
}

console.log("Position-complexity Stage 1 runner tests passed");
