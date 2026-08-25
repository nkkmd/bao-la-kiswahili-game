"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const Raw = require("../tools/experiments/lib/ssgtc-representation-production.js");
const P = require("../tools/experiments/lib/practical-comeback-stage0-production.js");

const root = E.initialState();
Raw.assertStudyState(root);
assert.equal(Raw.representedSeeds(root), 64);

const missing = Raw.clone(root);
delete missing.pending;
assert.throws(() => P.exactLegalMoves(missing), /pending/);

const legal = P.exactLegalMoves(root);
assert.ok(legal.length >= 2);
assert.equal(new Set(legal.map(Raw.moveKey)).size, legal.length);

const d1a = P.referenceSearch(root, 1);
const d1b = P.referenceSearch(root, 1);
assert.deepEqual(d1a, d1b);
assert.equal(d1a.searchSemantics, P.SEARCH_SEMANTICS);
assert.equal(d1a.legalMoveCount, legal.length);
assert.ok(d1a.candidates.every((row) => Number.isFinite(row.score)));

const applied = P.applyExactMove(root, legal[0]);
Raw.assertStudyState(applied.state);
assert.equal(Raw.representedSeeds(applied.state), 64);

const reply = P.replyAudit(root, legal[0], 1);
if (!reply.terminalAfterRootMove) {
  assert.equal(reply.legalReplyCount, reply.legalReplyMoveKeys.length);
  assert.ok(reply.referenceBestReplyMoveKeys.length >= 1);
}

const sameSeedA = P.selectPolicyMove(root, "P_MEDIUM_D1_TOP3", P.seededRandom(17));
const sameSeedB = P.selectPolicyMove(root, "P_MEDIUM_D1_TOP3", P.seededRandom(17));
assert.equal(sameSeedA.moveKey, sameSeedB.moveKey);

const seed0move0 = P.runAsymmetricContinuation(root, legal[0], 0, { maxPostRootPlies: 2 });
const seed0move1 = P.runAsymmetricContinuation(root, legal[1], 0, { maxPostRootPlies: 2 });
assert.equal(seed0move0.seed32, seed0move1.seed32);
assert.equal(seed0move0.actorPolicyId, "P_REFERENCE_D2_BEST");
assert.equal(seed0move0.opponentPolicyId, "P_MEDIUM_D1_TOP3");
assert.ok(["ROOT_ACTOR_TERMINAL_WIN","ROOT_ACTOR_TERMINAL_LOSS","ADMINISTRATIVE_HORIZON_EXHAUSTED"].includes(seed0move0.outcome.category));

console.log("practical-comeback-stage0-tooling: ok");
