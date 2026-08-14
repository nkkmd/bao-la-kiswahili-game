"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const { mirrorMove, mirrorState } = require("../tools/symmetry/transform-candidates.js");
const T = require("../tools/experiments/lib/tactical-motif-features.js");

{
  const state = E.initialState();
  const move = E.moveVariants(state)[0];
  const before = JSON.stringify(state);
  const summary = T.summarizeMoveTransition(state, move);
  assert.equal(JSON.stringify(state), before, "transition extraction must not mutate the root state");
  assert.equal(summary.moveKey, AI.moveKey(move), "moveVariant identity uses the frozen AI move key");
  assert.equal(summary.replySet.count, E.moveVariants(E.applyMove(state, move).state).length,
    "reply-set cardinality is measured from moveVariants");
  assert.equal(summary.events.eventKinds.length > 0, true, "engine event sequence is retained");
  assert.equal(summary.beforeIdentity.ruleStateKey.length, 64);
  assert.equal(summary.afterIdentity.ruleStateKey.length, 64);
}

{
  let state = E.initialState();
  state = E.applyMove(state, E.moveVariants(state)[0]).state;
  const move = E.moveVariants(state)[0];
  const mirroredState = mirrorState(state);
  const mirroredMove = mirrorMove(move);
  const direct = T.summarizeMoveTransition(state, move);
  const mirrored = T.summarizeMoveTransition(mirroredState, mirroredMove);
  assert.deepEqual(T.structuralSignature(direct), T.structuralSignature(mirrored),
    "actor-relative transition signature is invariant under the validated seat exchange");
  assert.equal(direct.beforeIdentity.seatCanonicalKey, mirrored.beforeIdentity.seatCanonicalKey,
    "seat-canonical root identity is shared by mirrored states");
}

{
  const state = E.initialState();
  const before = JSON.stringify(state);
  const trace = T.analyzeExactRootValues(state, [1, 2]);
  assert.equal(JSON.stringify(state), before, "exact value diagnostics must not mutate the root state");
  assert.deepEqual(trace.depths, [1, 2]);
  assert.equal(trace.results[0].legalMoveCount, E.moveVariants(state).length);
  assert.equal(trace.results[1].topSetMoveKeys.length > 0, true);
}

{
  const state = E.initialState();
  const move = E.moveVariants(state)[0];
  const replies = T.analyzeReplyValues(state, move, 1);
  assert.equal(replies.terminal, false);
  assert.equal(replies.replyPlayer, 1);
  assert.equal(replies.replyCount, E.moveVariants(E.applyMove(state, move).state).length);
  assert.equal(replies.diagnostic.depth, 1);
}

console.log("Tactical motif Stage 0 feature tests passed");
