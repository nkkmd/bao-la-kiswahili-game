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
const {
  loadInputs: loadAllReplyInputs,
  parseArgs: parseAllReplyArgs,
  replay: replayAllReply,
} = require("../tools/experiments/run-joseki-all-replies.js");
const {
  loadInputs: loadP001Inputs,
  parseArgs: parseP001Args,
  replay: replayP001,
} = require("../tools/experiments/run-joseki-conditional-p001.js");
const {
  loadInputs: loadP002Inputs,
  parseArgs: parseP002Args,
  replay: replayP002,
} = require("../tools/experiments/run-joseki-forced-p002.js");

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

test("all 60 newly evaluated fixed-reply games replay", () => {
  const options = parseAllReplyArgs([]);
  const { openings, runEntries } = loadAllReplyInputs(options);
  const openingById = new Map(openings.map(({ node }) => [node.nodeId, node]));
  assert.equal(runEntries.length, 10);
  let games = 0;
  let replayedMoves = 0;
  for (const entry of runEntries) {
    const block = JSON.parse(fs.readFileSync(
      `${options.output}/blocks/${entry.entryId}.json`, "utf8",
    ));
    assert.equal(block.results.length, 6);
    for (const result of block.results) {
      replayedMoves += replayAllReply(openingById.get(entry.openingNodeId), entry, result);
      games += 1;
    }
  }
  assert.equal(games, 60);
  assert.equal(replayedMoves, 3518);
});

test("all-reply comparison leaves no response-robust first move", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/all-replies-summary.json", "utf8",
  ));
  assert.equal(summary.integrity.passed, true);
  assert.equal(summary.integrity.games, 84);
  assert.equal(summary.integrity.replayedMoves, 4931);
  assert.equal(summary.status, "no-response-robust-candidate");
  assert.equal(summary.rankings.every(({ status }) => status === "response-sensitive"), true);
  assert.equal(summary.rankings[0].openingMoveKey, "takata:namua:0:6:right:::false");
  assert.equal(summary.rankings[0].southWins, 14);
  assert.equal(summary.rankings[0].worstReplySouthWins, 2);
});

test("all P001 fixed third moves and continuations replay", () => {
  const options = parseP001Args([]);
  const { startState, entries } = loadP001Inputs(options);
  assert.equal(entries.length, 4);
  let games = 0;
  let replayedMoves = 0;
  for (const entry of entries) {
    const block = JSON.parse(fs.readFileSync(
      `${options.output}/blocks/${entry.candidateId}.json`, "utf8",
    ));
    assert.equal(block.results.length, 6);
    for (const result of block.results) {
      replayedMoves += replayP001(startState, entry, result);
      games += 1;
    }
  }
  assert.equal(games, 24);
  assert.equal(replayedMoves, 1269);
});

test("P001 has no conditional third-move candidate", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/conditional-p001-summary.json", "utf8",
  ));
  assert.equal(summary.integrity.passed, true);
  assert.equal(summary.status, "no-conditional-candidate");
  assert.deepEqual(summary.candidates, []);
  assert.equal(summary.rankings[0].thirdMoveKey, "takata:namua:0:7:right:::false");
  assert.equal(summary.rankings[0].southWins, 3);
  assert.equal(summary.rankings[0].naturalRecommendationCount, 0);
  assert.equal(summary.rankings[1].naturalRecommendationCount, 5);
});

test("P002 selection and all fixed captures replay", () => {
  const options = parseP002Args([]);
  const inputs = loadP002Inputs(options);
  assert.equal(inputs.selection.selected.node.nodeId, "p8-c1f65bf10696");
  assert.equal(inputs.selection.eligible.length, 2);
  assert.equal(inputs.entries.length, 2);
  let games = 0;
  let replayedMoves = 0;
  for (const entry of inputs.entries) {
    const block = JSON.parse(fs.readFileSync(
      `${options.output}/blocks/${entry.candidateId}.json`, "utf8",
    ));
    assert.equal(block.results.length, 6);
    for (const result of block.results) {
      replayedMoves += replayP002(inputs.selection.selected.node.state, entry, result);
      games += 1;
    }
  }
  assert.equal(games, 12);
  assert.equal(replayedMoves, 502);
});

test("P002 search consensus loses the terminal-outcome ranking", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/forced-p002-summary.json", "utf8",
  ));
  assert.equal(summary.integrity.passed, true);
  assert.equal(summary.status, "no-conditional-candidate");
  assert.deepEqual(summary.candidates, []);
  assert.equal(summary.rankings[0].southWins, 5);
  assert.equal(summary.rankings[0].isConsensusMove, false);
  assert.equal(summary.rankings[1].southWins, 3);
  assert.equal(summary.rankings[1].isConsensusMove, true);
});
