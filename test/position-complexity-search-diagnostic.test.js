"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const AI = require("../public/ai.js");
const D = require("../tools/experiments/lib/position-complexity-search-diagnostic.js");

function sortedKeys(moves) {
  return moves.map((move) => AI.moveKey(move)).sort();
}

function verifyAgainstEngine(state, depth, options = {}) {
  const before = JSON.stringify(state);
  const diagnostic = D.analyzeRootCandidates(state, depth, options);
  const engine = AI.analyzeMove(state, "hard", () => 0, {
    searchProfile: "phase2",
    evaluationProfile: options.evaluationProfile || "bao",
    maxDepth: depth,
    timeLimitMs: Infinity,
    quiescenceDepth: options.quiescenceDepth ?? 1,
    orderQuiescenceCaptures: options.orderQuiescenceCaptures ?? false,
    stableBestDepths: 0,
    aspirationWindow: 0,
  });
  assert.equal(engine.stats.timedOut, false, "comparison search must complete");
  assert.equal(engine.stats.completedDepth, depth, "comparison search must reach requested depth");
  assert.equal(diagnostic.bestScore, engine.stats.rootScore,
    `exact diagnostic best score matches phase2 root score at depth ${depth}`);
  assert.ok(diagnostic.topSetMoveKeys.includes(AI.moveKey(engine.move)),
    `phase2 selected move belongs to exact diagnostic top set at depth ${depth}`);
  assert.equal(JSON.stringify(state), before, "diagnostic and comparison search do not mutate source state");
  return diagnostic;
}

{
  const state = E.initialState();
  const before = JSON.stringify(state);
  const diagnostic = D.analyzeRootCandidates(state, 1);
  assert.equal(JSON.stringify(state), before, "root diagnostic does not mutate initial state");
  assert.deepEqual(diagnostic.candidates.map(({ moveKey }) => moveKey).sort(), sortedKeys(E.moveVariants(state)),
    "root candidate table contains every legal move exactly once");
  assert.equal(new Set(diagnostic.candidates.map(({ moveKey }) => moveKey)).size,
    diagnostic.legalMoveCount, "root candidate move keys are unique");
  assert.deepEqual(diagnostic.topSetMoveKeys, diagnostic.topSetMoveKeys.slice().sort(),
    "top set has deterministic lexical ordering");
  assert.equal(diagnostic.canonicalBestMoveKey, diagnostic.topSetMoveKeys[0],
    "canonical best move is deterministic member of top set");
}

{
  const state = E.initialState();
  for (const depth of [1, 2, 3]) verifyAgainstEngine(state, depth);
}

{
  const state = E.initialState();
  const first = D.analyzeDepthTrace(state, [1, 2, 3]);
  const second = D.analyzeDepthTrace(state, [3, 2, 1, 2]);
  assert.deepEqual(first, second, "identical fixed-depth diagnostics are deterministic");
  for (const result of first.results) {
    const direct = D.analyzeRootCandidates(state, result.depth);
    assert.deepEqual(result, direct, `depth-trace result matches direct diagnostic at depth ${result.depth}`);
  }
  assert.equal(first.transitions.length, 2, "three depths yield two adjacent transitions");
  for (const transition of first.transitions) {
    assert.equal(typeof transition.topSetDisjoint, "boolean", "transition records tie-aware disjointness");
  }
}

{
  const forcedWin = {
    pits: [
      [[1, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)],
      [[1, 1, 0, 0, 0, 0, 0, 2], Array(8).fill(0)],
    ],
    reserve: [0, 0],
    houseOwned: [false, false],
    player: 1,
    phase: "mtaji",
    winner: null,
    reason: "",
    turn: 50,
    pending: [0, 0],
  };
  const diagnostic = verifyAgainstEngine(forcedWin, 4);
  assert.equal(diagnostic.bestScoreClass, "root-win-mate-domain",
    "terminal/mate-domain root scores are explicitly classified");
  assert.ok(diagnostic.bestScore > D.WIN / 2, "mate-domain score is separated from ordinary evaluator margins");
}

{
  const singleVariant = {
    pits: [
      [[2, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)],
      [[1, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)],
    ],
    reserve: [0, 0],
    houseOwned: [false, false],
    player: 0,
    phase: "mtaji",
    winner: null,
    reason: "",
    turn: 50,
    pending: [0, 0],
  };
  assert.equal(E.moveVariants(singleVariant).length, 1, "fixture is a true single-variant root");
  const diagnostic = D.analyzeRootCandidates(singleVariant, 3);
  assert.equal(diagnostic.legalMoveCount, 1);
  assert.equal(diagnostic.topSetSize, 1);
  assert.equal(diagnostic.bestSecondGap, null,
    "decision ambiguity margin is undefined rather than fabricated for single-choice roots");
}

{
  const state = E.initialState();
  const unordered = verifyAgainstEngine(state, 2, { orderQuiescenceCaptures: false });
  const ordered = verifyAgainstEngine(state, 2, { orderQuiescenceCaptures: true });
  assert.equal(unordered.bestScore, ordered.bestScore,
    "quiescence move ordering preserves exact fixed-depth value");
}

console.log("Position-complexity search diagnostic tests passed");
