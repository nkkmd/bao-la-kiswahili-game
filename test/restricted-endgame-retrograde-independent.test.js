"use strict";

const assert = require("node:assert/strict");
const P = require("../tools/experiments/lib/restricted-endgame-retrograde.js");
const I = require("../tools/experiments/lib/restricted-endgame-retrograde-independent.js");

const graphs = [
  [
    { id: "t0", player: 0, winner: 0, moves: [] },
    { id: "t1", player: 0, winner: 1, moves: [] },
    { id: "r", player: 0, winner: null, moves: [
      { key: "a", to: "t0" }, { key: "b", to: "t1" },
    ] },
  ],
  [
    { id: "terminal", player: 0, winner: 0, moves: [] },
    { id: "a1", player: 0, winner: null, moves: [{ key: "a1", to: "terminal" }] },
    { id: "a2", player: 0, winner: null, moves: [{ key: "a2", to: "a1" }] },
    { id: "a3", player: 0, winner: null, moves: [{ key: "a3", to: "a2" }] },
    { id: "root", player: 0, winner: null, moves: [
      { key: "slow", to: "a3" }, { key: "fast", to: "z1" },
    ] },
    { id: "z1", player: 0, winner: null, moves: [{ key: "z1", to: "terminal" }] },
  ],
  [
    { id: "t1", player: 0, winner: 1, moves: [] },
    { id: "x", player: 0, winner: null, moves: [{ key: "xy", to: "y" }] },
    { id: "y", player: 1, winner: null, moves: [{ key: "yx", to: "x" }] },
    { id: "z", player: 0, winner: null, moves: [
      { key: "lose", to: "t1" }, { key: "cycle", to: "x" },
    ] },
  ],
];

for (const graph of graphs) {
  const p = P.solveRetrograde(graph);
  const i = I.solveIndependent(graph);
  assert.deepEqual(i.counts, p.counts);
  assert.deepEqual(i.results, p.results);
  assert.deepEqual(i.recurrentSccs, p.recurrentSccs);
}

console.log("Restricted endgame independent retrograde tests passed");
