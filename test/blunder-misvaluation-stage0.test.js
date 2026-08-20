"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const Search = require("../tools/experiments/lib/position-complexity-search-diagnostic.js");
const B = require("../tools/experiments/lib/blunder-misvaluation-patterns.js");

{
  assert.equal(B.PRIMARY_DEPTH, 3);
  assert.deepEqual(B.PRIMARY_SEARCH_OPTIONS, {
    evaluationProfile: "bao",
    quiescenceDepth: 1,
    orderQuiescenceCaptures: false,
  });
}

{
  const WIN = Search.WIN;
  assert.deepEqual(B.decisionLoss(50, 50), {
    bestScore: 50,
    candidateScore: 50,
    rawRegret: 0,
    bestDomain: "ordinary-evaluation-domain",
    candidateDomain: "ordinary-evaluation-domain",
    sameDomain: true,
    domainDrop: 0,
    category: "none",
    ordinaryRegret: 0,
    mateDistanceRegret: null,
    crossDomain: false,
  });
  assert.equal(B.decisionLoss(50, 40).category, "ordinary-regret");
  assert.equal(B.decisionLoss(50, 40).ordinaryRegret, 10);
  assert.equal(B.decisionLoss(WIN - 2, WIN - 5).category, "win-mate-distance-regret");
  assert.equal(B.decisionLoss(WIN - 2, WIN - 5).mateDistanceRegret, 3);
  assert.equal(B.decisionLoss(-WIN + 8, -WIN + 5).category, "loss-mate-distance-regret");
  assert.equal(B.decisionLoss(-WIN + 8, -WIN + 5).mateDistanceRegret, 3);
  assert.equal(B.decisionLoss(WIN - 2, 25).category, "win-mate-to-ordinary");
  assert.equal(B.decisionLoss(WIN - 2, 25).domainDrop, 1);
  assert.equal(B.decisionLoss(25, -WIN + 5).category, "ordinary-to-loss-mate");
  assert.equal(B.decisionLoss(25, -WIN + 5).domainDrop, 1);
  assert.equal(B.decisionLoss(WIN - 2, -WIN + 5).category, "win-mate-to-loss-mate");
  assert.equal(B.decisionLoss(WIN - 2, -WIN + 5).domainDrop, 2);
  assert.throws(() => B.decisionLoss(10, 11), /exceeds declared best score/);
}

{
  assert.equal(B.median([1]), 1);
  assert.equal(B.median([3, 1, 2]), 2);
  assert.equal(B.median([4, 1, 3, 2]), 2.5);
}

{
  const stop = {
    type: "capture", phase: "namua", row: 0, index: 4,
    direction: "right", side: "left", houseChoice: "stop",
  };
  const use = { ...stop, houseChoice: "use" };
  assert.notEqual(AI.moveKey(stop), AI.moveKey(use),
    "exact move identity must retain distinct Namua house-choice variants");
}

{
  const state = E.initialState();
  const before = JSON.stringify(state);
  const analysis = B.analyzeRootDecisionLoss(state, 3);
  assert.equal(JSON.stringify(state), before, "D3 decision-loss analysis must not mutate root state");
  assert.equal(analysis.searchSemantics,
    "exact-full-window-root-candidates/phase2-value-semantics/v1");
  assert.equal(analysis.depth, 3);
  assert.equal(analysis.options.quiescenceDepth, 1);
  assert.equal(analysis.legalMoveCount, E.moveVariants(state).length);
  assert.equal(analysis.candidates.length, analysis.legalMoveCount);
  assert.equal(analysis.topSetMoveKeys.length > 0, true);
  assert.equal(Number.isFinite(analysis.stateMedianScore), true);
  for (const candidate of analysis.candidates) {
    assert.equal(candidate.decisionLoss.rawRegret >= 0, true);
    assert.equal(candidate.normalizedRankLoss >= 0 && candidate.normalizedRankLoss <= 1, true);
    if (candidate.isTopSet) {
      assert.equal(candidate.decisionLoss.rawRegret, 0);
      assert.equal(candidate.scoreRank, 1);
      assert.equal(candidate.normalizedRankLoss, 0);
    }
    assert.equal(candidate.isBelowStateMedian, candidate.score < analysis.stateMedianScore);
  }
  const repeated = B.analyzeRootDecisionLoss(state, 3);
  assert.deepEqual(repeated, analysis, "D3+Q1 exact decision-loss analysis must be deterministic");
}

{
  const state = E.initialState();
  const move = E.moveVariants(state)[0];
  const before = JSON.stringify(state);
  const summary = B.summarizeCandidate(state, move, 3);
  assert.equal(JSON.stringify(state), before, "candidate summary must not mutate the root state");
  assert.equal(summary.actor, state.player);
  assert.equal(summary.moveKey, AI.moveKey(move));
  assert.equal(summary.candidate.moveKey, AI.moveKey(move));
  const applied = E.applyMove(state, move);
  assert.equal(summary.staticPostMove.score,
    AI.evaluateWithProfile(applied.state, state.player, "bao"),
    "static post-move score must retain root-actor perspective");
  assert.equal(summary.transition.moveKey, AI.moveKey(move));
  assert.equal(summary.responseEnvelope.moveKey, AI.moveKey(move));
}

{
  const state = E.initialState();
  const trace = B.analyzeDepthAgreement(state, [1, 2, 3]);
  assert.deepEqual(trace.depths, [1, 2, 3]);
  assert.equal(trace.results.every((item) => item.options.quiescenceDepth === 1), true);
  assert.equal(trace.transitions.length, 2);
}

console.log("Blunder / misvaluation Stage 0 technical tests passed");
