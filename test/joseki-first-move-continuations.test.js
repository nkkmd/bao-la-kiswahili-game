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
const {
  loadInputs: loadJ001Inputs,
  parseArgs: parseJ001Args,
  replay: replayJ001,
} = require("../tools/experiments/run-joseki-j001-replies.js");

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

test("all J001 fixed replies and continuations replay", () => {
  const options = parseJ001Args([]);
  const { opening, entries } = loadJ001Inputs(options);
  assert.equal(entries.length, 4);
  let games = 0;
  let replayedMoves = 0;
  for (const entry of entries) {
    const block = JSON.parse(fs.readFileSync(
      `${options.output}/blocks/${entry.replyId}.json`, "utf8",
    ));
    assert.equal(block.results.length, 6);
    for (const result of block.results) {
      replayedMoves += replayJ001(opening, entry, result);
      games += 1;
    }
  }
  assert.equal(games, 24);
  assert.equal(replayedMoves, 1413);
});

test("J001 is response-sensitive with a universal losing reply", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/j001-replies-summary.json", "utf8",
  ));
  assert.equal(summary.integrity.passed, true);
  assert.equal(summary.status, "response-sensitive");
  assert.deepEqual(summary.checks, {
    terminalAndReplay: true,
    perReplySouthWins: false,
    pooledSouthWins: false,
  });
  assert.equal(summary.totals.southWins, 7);
  assert.equal(summary.replies[0].replyMoveKey, "takata:namua:0:5:left:::false");
  assert.equal(summary.replies[0].southWins, 0);
});
