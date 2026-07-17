"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const {
  loadInputs, parseArgs, replay,
} = require("../tools/experiments/run-joseki-first-move-continuations.js");
const {
  firstNegativeTransition, permanentNegativeTransition, signFlips,
} = require("../tools/experiments/analyze-joseki-c0-loss.js");

test("all four first moves and every saved continuation replay", () => {
  const options = parseArgs([]);
  const { entries } = loadInputs(options);
  assert.equal(entries.length, 4);
  let games = 0;
  let replayedMoves = 0;
  for (const entry of entries) {
    const block = JSON.parse(fs.readFileSync(
      `${options.output}/blocks/${entry.openingId}.json`, "utf8",
    ));
    assert.equal(block.results.length, 6);
    for (const result of block.results) {
      replayedMoves += replay(entry, result);
      games += 1;
    }
  }
  assert.equal(games, 24);
  assert.equal(replayedMoves, 1399);
});

test("C0 diagnostic distinguishes the first and permanent negative transitions", () => {
  const trace = [3, -1, 2, -4, -5].map((value, index) => ({
    ply: index + 1, value, incoming: { moveKey: `m${index}` }, stateHash: `s${index}`,
  }));
  const selector = ({ value }) => value;
  assert.equal(firstNegativeTransition(trace, selector).ply, 2);
  assert.equal(permanentNegativeTransition(trace, selector).ply, 4);
  assert.equal(signFlips(trace, selector), 3);
});

test("saved first-move result rejects the old C0 candidate", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/first-move-continuations-summary.json", "utf8",
  ));
  assert.equal(summary.integrity.passed, true);
  assert.equal(summary.integrity.games, 24);
  assert.equal(summary.status, "not-supported");
  assert.equal(summary.candidate.southWins, 0);
  assert.equal(summary.rankings[0].moveKey, "takata:namua:0:5:right:::false");
  assert.equal(summary.rankings[0].southWins, 3);
});
