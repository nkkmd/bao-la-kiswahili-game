"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const Q = require("../tools/experiments/analyze-phase-transition-move-quality.js");

{
  const metrics = Q.eventMetrics([
    { kind: "capture", count: 3 },
    { kind: "relay", count: 4 },
    { kind: "capture", count: 2 },
    { kind: "sow" },
  ]);
  assert.deepEqual(metrics, {
    capturedSeedCount: 5,
    captureEventCount: 2,
    relayEventCount: 1,
    captureRelayLength: 3,
    sowEventCount: 1,
  });
}

{
  const state = E.initialState();
  const move = E.moveVariants(state)[0];
  const game = { gameId: "fixture", moves: [{ ply: 0, move }] };
  const states = Q.replayStates(game);
  assert.equal(states.size, 2);
  assert.deepEqual(states.get(1), E.applyMove(state, move).state);
}

{
  const summary = Q.summarize([
    { classification: "a", chosenCapturedSeedCount: 4, chosenCaptureRelayLength: 2, immediateEvaluationGap: 0, chosenIsImmediateBest: true, captureSeedOpportunityGap: 0 },
    { classification: "a", chosenCapturedSeedCount: 2, chosenCaptureRelayLength: 4, immediateEvaluationGap: 6, chosenIsImmediateBest: false, captureSeedOpportunityGap: 3 },
  ]);
  assert.equal(summary.candidateCount, 2);
  assert.equal(summary.byClassification.a.meanChosenCapturedSeedCount, 3);
  assert.equal(summary.byClassification.a.immediateBestRate, 0.5);
}

console.log("phase-transition move quality tests passed");
