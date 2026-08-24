"use strict";

const assert = require("node:assert/strict");
const { solveRetrograde, validateGraph } = require(
  "../tools/experiments/lib/restricted-endgame-retrograde.js",
);

{
  const solved = solveRetrograde([
    { id: "t-win0", player: 0, winner: 0, moves: [] },
    { id: "t-win1", player: 0, winner: 1, moves: [] },
    {
      id: "root", player: 0, winner: null,
      moves: [
        { key: "winning-move", to: "t-win0" },
        { key: "losing-move", to: "t-win1" },
      ],
    },
  ]);
  assert.equal(solved.results["t-win0"].status, "TERMINAL");
  assert.equal(solved.results["t-win1"].status, "TERMINAL");
  assert.equal(solved.results.root.status, "WIN");
  assert.equal(solved.results.root.absoluteWinner, 0);
  assert.equal(solved.results.root.dtf, 1);
  assert.deepEqual(solved.results.root.optimalMoveKeys, ["winning-move"]);
}

{
  const solved = solveRetrograde([
    { id: "t-win0", player: 1, winner: 0, moves: [] },
    {
      id: "loss-1", player: 1, winner: null,
      moves: [{ key: "forced", to: "t-win0" }],
    },
    {
      id: "win-2", player: 0, winner: null,
      moves: [{ key: "force-loss", to: "loss-1" }],
    },
    {
      id: "loss-root", player: 1, winner: null,
      moves: [
        { key: "fast-loss", to: "t-win0" },
        { key: "slow-loss", to: "win-2" },
      ],
    },
  ]);
  assert.equal(solved.results["loss-1"].status, "LOSS");
  assert.equal(solved.results["loss-1"].dtf, 1);
  assert.equal(solved.results["win-2"].status, "WIN");
  assert.equal(solved.results["win-2"].dtf, 2);
  assert.equal(solved.results["loss-root"].status, "LOSS");
  assert.equal(solved.results["loss-root"].absoluteWinner, 0);
  assert.equal(solved.results["loss-root"].dtf, 3);
  assert.deepEqual(solved.results["loss-root"].optimalMoveKeys, ["slow-loss"]);
}

// Regression: synchronous waves prevent node-id ordering from freezing a
// longer WIN distance before a shorter winning child becomes resolved.
{
  const solved = solveRetrograde([
    { id: "terminal", player: 0, winner: 0, moves: [] },
    { id: "a1", player: 0, winner: null, moves: [{ key: "a1", to: "terminal" }] },
    { id: "a2", player: 0, winner: null, moves: [{ key: "a2", to: "a1" }] },
    { id: "a3", player: 0, winner: null, moves: [{ key: "a3", to: "a2" }] },
    {
      id: "root", player: 0, winner: null,
      moves: [
        { key: "slow", to: "a3" },
        { key: "fast", to: "z1" },
      ],
    },
    { id: "z1", player: 0, winner: null, moves: [{ key: "z1", to: "terminal" }] },
  ]);
  assert.equal(solved.results.root.status, "WIN");
  assert.equal(solved.results.root.dtf, 2);
  assert.deepEqual(solved.results.root.optimalMoveKeys, ["fast"]);
}

{
  const solved = solveRetrograde([
    { id: "x", player: 0, winner: null, moves: [{ key: "xy", to: "y" }] },
    { id: "y", player: 1, winner: null, moves: [{ key: "yx", to: "x" }] },
  ]);
  assert.equal(solved.results.x.status, "RECURRENT");
  assert.equal(solved.results.y.status, "RECURRENT");
  assert.equal(solved.results.x.dtf, null);
  assert.equal(solved.results.x.cyclicScc, true);
  assert.equal(solved.results.x.sccId, solved.results.y.sccId);
  assert.deepEqual(solved.results.x.recurrentMoveKeys, ["xy"]);
}

{
  const solved = solveRetrograde([
    { id: "t-win1", player: 0, winner: 1, moves: [] },
    { id: "x", player: 0, winner: null, moves: [{ key: "xy", to: "y" }] },
    { id: "y", player: 1, winner: null, moves: [{ key: "yx", to: "x" }] },
    {
      id: "z", player: 0, winner: null,
      moves: [
        { key: "accept-loss", to: "t-win1" },
        { key: "preserve-recurrence", to: "x" },
      ],
    },
  ]);
  assert.equal(solved.results.z.status, "RECURRENT");
  assert.equal(solved.results.z.cyclicScc, false,
    "a recurrent state may feed a cycle without itself belonging to a cyclic SCC");
  assert.deepEqual(solved.results.z.recurrentMoveKeys, ["preserve-recurrence"]);
}

assert.throws(() => validateGraph([
  { id: "bad", player: 0, winner: null, moves: [] },
]), /Nonterminal node has no moves/);

console.log("Restricted endgame synthetic retrograde tests passed");
