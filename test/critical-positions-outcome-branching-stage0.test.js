"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const C = require("../tools/experiments/lib/critical-positions-outcome-branching.js");

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

{
  assert.deepEqual(C.POLICY_IDS, ["P1_NORMAL_TOP3", "P2_D2_TOP3", "P3_UNIFORM_LEGAL"]);
  assert.deepEqual(C.SEARCH_OPTIONS, {
    evaluationProfile: "bao",
    quiescenceDepth: 1,
    orderQuiescenceCaptures: false,
  });
}

{
  const root = E.initialState();
  const before = JSON.stringify(root);
  const moves = C.exactLegalMoves(root);
  assert.equal(moves.length, E.moveVariants(root).length);
  assert.deepEqual(moves.map(AI.moveKey), moves.map(AI.moveKey).slice().sort());
  assert.equal(JSON.stringify(root), before);
}

{
  const root = houseChoiceFixture();
  const variants = C.exactLegalMoves(root);
  const stop = variants.find((move) => move.houseChoice === "stop" && move.side === "left");
  const use = variants.find((move) => move.houseChoice === "use" && move.side === "left");
  assert.ok(stop, "fixture must expose exact Namua houseChoice=stop variant");
  assert.ok(use, "fixture must expose exact Namua houseChoice=use variant");
  assert.notEqual(AI.moveKey(stop), AI.moveKey(use));
  assert.notDeepEqual(E.applyMove(root, stop).state, E.applyMove(root, use).state,
    "exact house-choice interventions must preserve distinct semantics");
}

{
  const root = E.initialState();
  const seeds = Array.from({ length: 32 }, (_, index) => C.deriveReplicateSeed32(root, index));
  assert.equal(new Set(seeds).size, seeds.length);
  assert.equal(C.deriveReplicateSeed32(root, 7), C.deriveReplicateSeed32(root, 7));
}

for (const policyId of C.POLICY_IDS) {
  const root = E.initialState();
  const seed = C.deriveReplicateSeed32(root, 3);
  const a = C.createPolicySelector(policyId, seed)(root);
  const b = C.createPolicySelector(policyId, seed)(root);
  assert.equal(a.moveKey, b.moveKey, `${policyId} must be deterministic conditional on seed`);
  assert.ok(C.exactLegalMoves(root).some((move) => AI.moveKey(move) === a.moveKey));
  if (policyId === "P2_D2_TOP3") {
    assert.equal(a.diagnostic.depth, 2);
    assert.equal(a.diagnostic.searchSemantics,
      "exact-full-window-root-candidates/phase2-value-semantics/v1");
    assert.ok(a.diagnostic.poolMoveKeys.includes(a.moveKey));
    assert.ok(a.diagnostic.poolMoveKeys.length <= 3);
  }
}

{
  const root = E.initialState();
  for (const policyId of C.POLICY_IDS) {
    const selected = new Set();
    for (let replicateIndex = 0; replicateIndex < 32; replicateIndex += 1) {
      const seed = C.deriveReplicateSeed32(root, replicateIndex);
      selected.add(C.createPolicySelector(policyId, seed)(root).moveKey);
    }
    assert.ok(selected.size >= 2, `${policyId} should respond to changing technical replicate seeds`);
  }
}

{
  const root = E.initialState();
  const move = C.exactLegalMoves(root)[0];
  const before = JSON.stringify(root);
  const a = C.runContinuation(root, move, 2, {
    policyId: "P3_UNIFORM_LEGAL", maxContinuationPlies: 12,
  });
  const b = C.runContinuation(root, move, 2, {
    policyId: "P3_UNIFORM_LEGAL", maxContinuationPlies: 12,
  });
  assert.deepEqual(a, b, "exact continuation replay must be deterministic");
  assert.equal(JSON.stringify(root), before, "continuation must not mutate root");
  assert.ok(["ROOT_ACTOR_WIN", "ROOT_ACTOR_LOSS", "ADMINISTRATIVE_UNFINISHED"]
    .includes(a.outcome.category));
}

{
  const root = E.initialState();
  const move = C.exactLegalMoves(root)[0];
  const result = C.runContinuation(root, move, 0, {
    policyId: "P1_NORMAL_TOP3", maxContinuationPlies: 0,
  });
  assert.equal(result.outcome.category, "ADMINISTRATIVE_UNFINISHED");
  assert.equal(result.outcome.reason, "continuation-cap");
}

{
  const root = terminalCaptureFixture();
  const moves = C.exactLegalMoves(root);
  assert.equal(moves.length, 1);
  const result = C.runContinuation(root, moves[0], 0, {
    policyId: "P1_NORMAL_TOP3", maxContinuationPlies: 20,
  });
  assert.equal(result.outcome.category, "ROOT_ACTOR_WIN");
  assert.equal(result.outcome.reason, "front-empty");
  assert.equal(result.continuationMoves.length, 0);
}

{
  const root = phaseChangeFixture();
  const move = C.exactLegalMoves(root)[0];
  const applied = E.applyMove(root, move).state;
  assert.equal(applied.phase, "mtaji", "reserve exhaustion fixture must exercise Namua->Mtaji phase change");
}

{
  const root = E.initialState();
  const measurement = C.measureRoot(root, {
    policyId: "P3_UNIFORM_LEGAL", replicates: 3, maxContinuationPlies: 6,
  });
  assert.equal(measurement.legalMoveCount, E.moveVariants(root).length);
  assert.equal(measurement.moves.every((item) => item.records.length === 3), true);
  for (let replicateIndex = 0; replicateIndex < 3; replicateIndex += 1) {
    const pairedSeeds = measurement.moves.map((item) => item.records[replicateIndex].seed32);
    assert.equal(new Set(pairedSeeds).size, 1,
      "all root moves must receive the same derived seed at a replicate index");
  }
}

{
  const root = E.initialState();
  const structural = C.structuralBranchSummary(root);
  assert.equal(structural.length, E.moveVariants(root).length);
  assert.equal(structural.every((item) => item.moveKey === item.transition.moveKey), true);
  const axes = C.secondarySearchAxes(root);
  assert.deepEqual(axes.depths, [2, 3]);
  assert.equal(axes.transitions.length, 1);
}

console.log("Critical positions / outcome branching Stage 0 technical tests passed");
