#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const audit = require("../tools/experiments/extract-phase-transition-candidate-audit.js");

assert.equal(audit.gameIndex("pt-pilot-v2-0094"), 94);
assert.deepEqual(audit.parseCsvLine('A,"x,y",3'), ["A", "x,y", "3"]);

const initial = E.initialState();
const board = audit.boardRows(initial);
assert.deepEqual(board.southFront, [0, 0, 0, 0, 6, 2, 2, 0]);
assert.deepEqual(board.northFront, [0, 2, 2, 6, 0, 0, 0, 0]);

const move = E.moveVariants(initial)[0];
const game = {
  gameId: "pt-pilot-v2-0000",
  observations: [
    { stateHash: "a", forcedCapture: false },
    { stateHash: "b", forcedCapture: false },
  ],
  moves: [{ ply: 0, move }],
};
const states = audit.replayStates(game);
assert.equal(states.length, 2);
assert.notDeepEqual(states[0], states[1]);

const rows = audit.auditRows(
  { archetypeId: "test", category: "A", representativePly: "0" },
  game,
  states,
  0,
  1,
);
assert.equal(rows.length, 2);
assert.equal(rows[0].isTarget, true);
assert.equal(rows[1].relativePly, 1);
assert.equal(Array.isArray(rows[0].southFront), true);

console.log("phase-transition candidate audit regression passed");
