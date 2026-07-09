"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const WeightConfig = require("../public/ai-weights.js");

function blank(phase = "namua") {
  const state = E.initialState();
  state.pits = [
    [Array(8).fill(0), Array(8).fill(0)],
    [Array(8).fill(0), Array(8).fill(0)],
  ];
  state.reserve = phase === "namua" ? [10, 10] : [0, 0];
  state.phase = phase;
  state.houseOwned = [false, false];
  return state;
}

{
  const expected = [
    "boardSeeds", "frontSeeds", "frontOccupied", "frontConnections", "reusablePits",
    "mobility", "captureMoves", "maxCapture", "relayShape", "frontSafety", "houseValue",
    "reserveEfficiency", "transitionShape", "tempo",
  ];
  assert.deepEqual(Object.keys(AI.EVALUATION_WEIGHTS.namua), expected,
    "namua defines every Bao evaluation weight");
  assert.deepEqual(Object.keys(AI.EVALUATION_WEIGHTS.mtaji), expected,
    "mtaji defines every Bao evaluation weight");
  assert.notDeepEqual(AI.EVALUATION_WEIGHTS.namua, AI.EVALUATION_WEIGHTS.mtaji,
    "namua and mtaji use different weights");
}

{
  const state = blank();
  state.pits[0][E.FRONT] = [2, 2, 1, 0, 6, 0, 0, 0];
  state.pits[0][E.BACK][0] = 3;
  state.pits[1][E.FRONT][0] = 1;
  state.houseOwned[0] = true;
  state.reserve = [2, 10];
  const own = AI.playerMetrics(state, 0);
  assert.equal(own.boardSeeds, 14, "board seed count is measured");
  assert.equal(own.frontSeeds, 11, "front seed count is measured");
  assert.equal(own.frontOccupied, 4, "occupied front pits are measured");
  assert.equal(own.frontConnections, 2, "front connectivity is measured");
  assert.equal(own.reusablePits, 4, "reusable pits are measured");
  assert.ok(own.mobility > 0, "mtaji mobility is measured");
  assert.ok(own.houseValue > 0, "nyumba ownership and seeds have value");
  assert.ok(own.reserveEfficiency > 0, "reserve placement efficiency is measured");
  assert.ok(own.transitionShape > 0, "the board near the mtaji transition is measured");
  assert.equal(own.tempo, 1, "side to move receives tempo");
}

{
  const state = blank();
  state.pits[0][E.FRONT][3] = 2;
  state.pits[0][E.FRONT][5] = 2;
  state.pits[1][E.FRONT][4] = 5;
  state.pits[1][E.FRONT][0] = 1;
  const own = AI.playerMetrics(state, 0);
  assert.ok(own.captureMoves > 0, "capture opportunities are counted");
  assert.equal(own.maxCapture, 5, "the largest available capture is measured");
  assert.ok(own.relayShape > 0, "capture relay shape is measured");
}

{
  const state = E.initialState();
  const south = AI.evaluateFeatures(state, 0);
  const north = AI.evaluateFeatures(state, 1);
  for (const name of Object.keys(south)) {
    assert.equal(south[name] + north[name], 0, `${name} is evaluated symmetrically`);
  }
  assert.equal(south.tempo, 1, "tempo difference follows the side to move");
}

{
  const state = blank("mtaji");
  state.pits[0][E.FRONT][0] = 1;
  state.pits[1][E.FRONT][0] = 2;
  state.winner = 0;
  assert.ok(AI.evaluate(state, 0) > 900_000, "a win dominates positional features");
  assert.ok(AI.evaluate(state, 1) < -900_000, "a loss dominates positional features");
}

{
  const state = blank("mtaji");
  state.pits[0][E.FRONT] = [1, 0, 2, 0, 1, 0, 0, 2];
  state.pits[0][E.BACK][1] = 2;
  state.pits[1][E.FRONT] = [0, 1, 0, 0, 1, 0, 1, 0];
  state.pits[1][E.BACK][3] = 2;
  const breakdown = AI.evaluationBreakdown(state, 0, { evaluationProfile: "bao-v2" });
  assert.equal(breakdown.profile, "bao-v2", "evaluation breakdown records the profile");
  assert.equal(breakdown.category, "mtaji-endurance", "bao-v2 classifies mtaji endurance positions");
  assert.ok(breakdown.weights.frontSafety > AI.EVALUATION_WEIGHTS.mtaji.frontSafety,
    "bao-v2 can adjust weights by category");
  assert.equal(
    breakdown.total,
    AI.evaluateWithProfile(state, 0, "bao-v2"),
    "breakdown total matches profile evaluation",
  );
  const adjustments = WeightConfig.cloneAdjustments();
  adjustments["mtaji-endurance"].mobility += 2;
  const adjusted = AI.evaluationBreakdown(state, 0, {
    evaluationProfile: "bao-v2",
    evaluationAdjustments: adjustments,
  });
  assert.equal(
    adjusted.weights.mobility,
    breakdown.weights.mobility + 2,
    "candidate adjustments can be injected into bao-v2",
  );
  assert.notEqual(adjusted.total, breakdown.total, "candidate adjustments affect the evaluation");
}

console.log("Bao evaluation tests passed");
