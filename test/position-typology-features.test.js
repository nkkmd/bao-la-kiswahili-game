"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const { mirrorState } = require("../tools/symmetry/transform-candidates.js");
const {
  extractPositionTypologyObservation,
  identityKeys,
  ruleState,
  stableStringify,
  validateObservation,
} = require("../tools/experiments/lib/position-typology-features.js");

{
  const state = E.initialState();
  const before = stableStringify(state);
  const observation = extractPositionTypologyObservation(state, { gameId: "test", conditionId: "T", seed: 1, ply: 0 });
  assert.equal(validateObservation(observation), true);
  assert.equal(stableStringify(state), before, "feature extraction must not mutate state");
  assert.deepEqual(observation.state.pits, state.pits, "full pit state is retained");
  assert.equal(observation.features.actor.reserve, 22);
  assert.equal(observation.features.opponent.reserve, 22);
  assert.equal(observation.features.global.boardSeedCount, 20);
  assert.equal(observation.features.actor.legalMoveCount, E.moveVariants(state).length);
}

{
  const state = E.initialState();
  const changedTurn = E.clone(state);
  changedTurn.turn += 10;
  assert.notEqual(identityKeys(state).historicalStateHash, identityKeys(changedTurn).historicalStateHash,
    "historical identity retains turn information");
  assert.equal(identityKeys(state).ruleStateKey, identityKeys(changedTurn).ruleStateKey,
    "rule-state identity intentionally ignores historical turn number");
  assert.deepEqual(ruleState(state), ruleState(changedTurn));
}

{
  const state = E.initialState();
  const move = E.moveVariants(state)[0];
  const next = E.applyMove(state, move).state;
  const mirrored = mirrorState(next);
  assert.equal(identityKeys(next).seatCanonicalKey, identityKeys(mirrored).seatCanonicalKey,
    "seat-canonical identity collapses the validated South/North seat exchange");
  assert.notEqual(identityKeys(next).ruleStateKey, identityKeys(mirrored).ruleStateKey,
    "direct rule-state identity retains the seat-labelled representation");
}

{
  const state = E.initialState();
  const observation = extractPositionTypologyObservation(state);
  assert.equal(Object.hasOwn(observation.features, "evaluation"), false);
  assert.equal(Object.hasOwn(observation.features, "searchDepth"), false);
  assert.equal(Object.hasOwn(observation.features, "nodes"), false,
    "AI/search diagnostics must not leak into primary position features");
}

console.log("Position typology feature tests passed");
