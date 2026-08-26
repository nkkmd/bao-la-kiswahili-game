"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const Population = require("../tools/engineering/lib/pbai-p1-decision-population.js");

function analyze(state, enabled, depth = 3) {
  return AI.analyzeMove(state, "hard", () => 0.5, {
    timeLimitMs: Infinity,
    maxDepth: depth,
    evaluationProfile: "bao",
    pbaiC002C03Ordering: enabled,
  });
}

function findRoot(predicate, start = 9_000_001, limit = 4000) {
  for (let offset = 0; offset < limit; offset += 1) {
    const seed = start + offset;
    const root = Population.trajectoryRoot(seed, start, 160);
    if (root && predicate(root)) return root;
  }
  throw new Error("Unable to find synthetic PBAI-C002 fixture");
}

// Population materialization primitives are deterministic and use authoritative RAW identity.
{
  const one = Population.trajectoryRoot(9_100_002, 9_100_001, 160);
  const two = Population.trajectoryRoot(9_100_002, 9_100_001, 160);
  assert.deepEqual(one, two);
  if (one) {
    assert.equal(one.phase, "mtaji");
    assert.equal(one.rawKey.length, 64);
    assert.ok(one.legalMoveCount >= 2);
  }
}

// Feature-off remains the default and therefore cannot trigger on an eligible synthetic target.
const target = findRoot(Population.c002Eligible);
assert.equal(target.phase, "mtaji");
assert.ok(Population.reusablePits(target.state) <= 2);
assert.ok(E.moveVariants(target.state).some(Population.c002MoveMatches));
assert.ok(E.moveVariants(target.state).some((move) => !Population.c002MoveMatches(move)));

const implicitOff = AI.analyzeMove(target.state, "hard", () => 0.5, {
  timeLimitMs: Infinity,
  maxDepth: 3,
  evaluationProfile: "bao",
});
const explicitOff = analyze(target.state, false, 3);
assert.equal(AI.moveKey(implicitOff.move), AI.moveKey(explicitOff.move));
assert.equal(implicitOff.stats.rootScore, explicitOff.stats.rootScore);
assert.equal(implicitOff.stats.nodes, explicitOff.stats.nodes);
assert.equal(implicitOff.stats.quiescenceNodes, explicitOff.stats.quiescenceNodes);
assert.equal(implicitOff.stats.pbaiC002TriggerStates, 0);
assert.equal(explicitOff.stats.pbaiC002TriggerStates, 0);

// Feature-on must trigger on the current eligible root while preserving fixed-depth root semantics.
const enabled = analyze(target.state, true, 3);
assert.ok(enabled.stats.pbaiC002TriggerStates >= 1);
assert.ok(enabled.stats.pbaiC002PrioritizedMoves >= 1);
assert.equal(enabled.stats.rootScore, explicitOff.stats.rootScore);
assert.ok(E.moveVariants(target.state).some((move) => AI.moveKey(move) === AI.moveKey(enabled.move)));

// A Namua root is a negative control: feature-on must be exactly feature-off equivalent.
const namua = findRoot((root) => root.phase === "namua", 9_200_001);
const namuaOff = analyze(namua.state, false, 3);
const namuaOn = analyze(namua.state, true, 3);
assert.equal(namuaOn.stats.pbaiC002TriggerStates, 0);
assert.equal(namuaOn.stats.pbaiC002PrioritizedMoves, 0);
assert.equal(AI.moveKey(namuaOn.move), AI.moveKey(namuaOff.move));
assert.equal(namuaOn.stats.rootScore, namuaOff.stats.rootScore);
assert.equal(namuaOn.stats.nodes, namuaOff.stats.nodes);
assert.equal(namuaOn.stats.quiescenceNodes, namuaOff.stats.quiescenceNodes);

// A high-reusable Mtaji root is the second negative-control class.
const mtajiHighReusable = findRoot(
  (root) => root.phase === "mtaji" && Population.reusablePits(root.state) >= 3,
  9_300_001,
);
const highOff = analyze(mtajiHighReusable.state, false, 3);
const highOn = analyze(mtajiHighReusable.state, true, 3);
assert.equal(highOn.stats.pbaiC002TriggerStates, 0);
assert.equal(highOn.stats.pbaiC002PrioritizedMoves, 0);
assert.equal(AI.moveKey(highOn.move), AI.moveKey(highOff.move));
assert.equal(highOn.stats.rootScore, highOff.stats.rootScore);
assert.equal(highOn.stats.nodes, highOff.stats.nodes);
assert.equal(highOn.stats.quiescenceNodes, highOff.stats.quiescenceNodes);

console.log("PBAI-C002-v1 feature/population tests passed");
