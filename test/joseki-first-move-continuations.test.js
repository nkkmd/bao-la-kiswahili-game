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
const {
  loadInputs: loadP003Inputs,
  parseArgs: parseP003Args,
  replay: replayP003,
} = require("../tools/experiments/run-joseki-forced-p003.js");
const {
  replay: replayP002Depth8Win,
} = require("../tools/experiments/verify-joseki-p002-depth8-win.js");
const {
  verifyCertificate: verifyP002BoundedWinCertificate,
  verifyProof: verifyP002BoundedWinProof,
} = require("../tools/experiments/solve-joseki-p002-bounded-win.js");

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

test("P002 reversal traces expose a large immediate consensus advantage", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/p002-reversal-analysis.json", "utf8",
  ));
  assert.deepEqual(summary.standardizedAnalysis, {
    searchProfile: "phase2", evaluationProfile: "bao", maxDepth: 2,
  });
  assert.equal(summary.integrity.games, 12);
  assert.equal(summary.integrity.replayedPositions, 502);
  assert.equal(summary.integrity.allFinalStatesMatch, true);
  assert.deepEqual(summary.immediateComparison.staticScore, {
    alternative: 389, consensus: 579, delta: -190,
  });
  const frontSafety = summary.immediateComparison.contributionDeltas
    .find(({ feature }) => feature === "frontSafety");
  assert.equal(frontSafety.delta, -40);
  const consensusLosses = summary.candidates.find(({ isConsensusMove }) => isConsensusMove)
    .traces.filter(({ winner }) => winner === 1);
  assert.deepEqual(consensusLosses.map(({ permanentSearchReversal }) => permanentSearchReversal.ply),
    [43, 49, 49]);
});

test("P003 selection and all four fixed captures replay", () => {
  const options = parseP003Args([]);
  const inputs = loadP003Inputs(options);
  assert.equal(inputs.node.nodeId, "p8-701bf2f6430d");
  assert.equal(inputs.entries.length, 4);
  let games = 0;
  let replayedMoves = 0;
  for (const entry of inputs.entries) {
    const block = JSON.parse(fs.readFileSync(
      `${options.output}/blocks/${entry.candidateId}.json`, "utf8",
    ));
    assert.equal(block.results.length, 6);
    for (const result of block.results) {
      replayedMoves += replayP003(inputs.node.state, entry, result);
      games += 1;
    }
  }
  assert.equal(games, 24);
  assert.equal(replayedMoves, 1169);
});

test("P003 reproduces the terminal ranking inversion without a front-safety gap", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/forced-p003-summary.json", "utf8",
  ));
  assert.equal(summary.status, "no-conditional-candidate");
  assert.deepEqual(summary.candidates, []);
  assert.equal(summary.rankings[0].southWins, 5);
  assert.equal(summary.rankings[0].isConsensusMove, false);
  assert.equal(summary.rankings[1].southWins, 4);
  assert.equal(summary.rankings[1].isConsensusMove, true);
  assert.deepEqual(summary.rankings.map(({ immediate }) => immediate.evaluationFeatures.frontSafety),
    [2, 2, 2, 2]);
  assert.deepEqual(summary.rankings.map(({ immediate }) => immediate.northLegalMoves), [2, 2, 2, 2]);
});

test("P003 traces retain the inversion under a common depth-two analysis", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/p003-reversal-analysis.json", "utf8",
  ));
  assert.equal(summary.integrity.games, 12);
  assert.equal(summary.integrity.replayedPositions, 577);
  assert.equal(summary.integrity.allFinalStatesMatch, true);
  assert.deepEqual(summary.immediateComparison.staticScore,
    { terminalBest: 101, consensus: 192, delta: -91 });
  const pair = summary.pairs.find(({ conditionId }) => conditionId === "bao-d4");
  const consensus = pair.traces.find(({ isConsensusMove }) => isConsensusMove);
  assert.equal(consensus.initial.search, 56);
  assert.equal(consensus.permanentSearchReversal.ply, 43);
  const terminalBest = pair.traces.find(({ isConsensusMove }) => !isConsensusMove);
  assert.equal(terminalBest.initial.search, -374);
  assert.equal(terminalBest.winner, 0);
});

test("P002 and P003 convergence comparison rejects simple forcing thresholds", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/forced-convergence-comparison.json", "utf8",
  ));
  assert.equal(summary.crossStudy.positions, 2);
  assert.equal(summary.crossStudy.games, 24);
  assert.equal(summary.crossStudy.consensusRankInversions, 2);
  assert.equal(summary.crossStudy.medianLosingPermanentReversalPly, 45);
  assert.deepEqual(summary.studies.map(({ immediate }) => immediate.searchConsensusAdvantage),
    [459, 430]);
  assert.deepEqual(summary.studies[1].immediate.frontSafety,
    { terminalBest: 2, consensus: 2 });
  const p002Consensus = summary.groups.filter(({ studyId, role }) =>
    studyId === "P002" && role === "consensus");
  assert.equal(p002Consensus[0].forcedCapturePrefix.range.min, 3);
  assert.equal(p002Consensus[1].forcedCapturePrefix.range.min, 3);
  assert.equal(summary.integrity.allTraceHashesPresent, true);
});

test("forced-capture depth sweep preserves consensus through depth eight", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/forced-depth-sweep-summary.json", "utf8",
  ));
  assert.equal(summary.integrity.recordedRows, 16);
  assert.equal(summary.integrity.baselineRowsMatched, 8);
  assert.equal(summary.integrity.timedOutRows, 0);
  const p002 = summary.studies.find(({ studyId }) => studyId === "P002");
  const p002Depth8 = p002.results.find(({ depth }) => depth === 8);
  assert.equal(p002Depth8.recommendedMoveKey, p002.consensusMoveKey);
  assert.equal(p002Depth8.rootScore, 999991);
  assert.equal(p002Depth8.terminalBestMinusConsensus, -999716);
  const p003 = summary.studies.find(({ studyId }) => studyId === "P003");
  assert.equal(p003.results.find(({ depth }) => depth === 8).terminalBestMinusConsensus, -220);
});

test("P002 depth-eight winning line replays to a forced North-front loss", () => {
  const study = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/forced-p002-summary.json", "utf8",
  ));
  const verification = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/verified/p002-depth8-win-verification.json", "utf8",
  ));
  const finalState = replayP002Depth8Win(study.position.state, verification);
  assert.equal(verification.passed, true);
  assert.equal(verification.rootScore, 999991);
  assert.equal(verification.totalPlies, 9);
  assert.equal(verification.northPrincipalVariationMovesAllForced, true);
  assert.equal(finalState.winner, 0);
  assert.equal(finalState.reason, "front-empty");
  assert.deepEqual(verification.continuationComparison
    .filter(({ followsFullWinningLine }) => followsFullWinningLine)
    .map(({ conditionId }) => conditionId), ["bao-d3", "bao-d4"]);
});

test("P002 bounded proof covers every North reply without the AI evaluator", () => {
  const study = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/forced-p002-summary.json", "utf8",
  ));
  const proof = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/verified/p002-bounded-win-proof.json", "utf8",
  ));
  const verification = verifyP002BoundedWinProof(study, proof);
  assert.equal(proof.passed, true);
  assert.equal(proof.consensusSouthCanForceWin, true);
  assert.equal(proof.certificate.moveKey, study.selection.consensusMoveKey);
  assert.deepEqual(proof.excludedFromProof,
    ["public/ai.js", "static evaluation", "alpha-beta search", "quiescence search"]);
  assert.deepEqual(proof.candidateResults.map(({ southCanForceWin }) => southCanForceWin),
    [true, false]);
  assert.deepEqual(verification, proof.verification);
  assert.equal(verification.maxPly, 9);
  assert.equal(verification.northAndNodes, 4);
  assert.equal(verification.northRepliesCovered, 4);
  assert.equal(verification.terminalLeaves, 1);

  const damaged = structuredClone(proof.certificate);
  damaged.legalMoveCount += 1;
  assert.throws(() => verifyP002BoundedWinCertificate(
    study.position.state, damaged, proof.horizonPlies,
  ), /Legal-count mismatch/);
});

test("P003 keeps the consensus move through depth ten", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/p003-depth-extension-summary.json", "utf8",
  ));
  assert.equal(summary.deepestCompletedDepth, 10);
  assert.equal(summary.firstTerminalBestDepth, null);
  assert.equal(summary.integrity.timedOutRows, 0);
  assert.deepEqual(summary.results.map(({ depth }) => depth), [9, 10]);
  assert.deepEqual(summary.results.map(({ terminalBestMinusConsensus }) => terminalBestMinusConsensus),
    [-260, -198]);
  assert.equal(summary.results.every(({ recommendedIsTerminalBest }) => !recommendedIsTerminalBest), true);
});

test("P003 depth-eleven root completes while one non-focal child times out", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/p003-depth11-summary.json", "utf8",
  ));
  const row = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/robustness/p003-depth11/p003-d11.json", "utf8",
  ));
  assert.equal(summary.status, "root-complete-with-candidate-timeout");
  assert.equal(summary.result.completedDepth, 11);
  assert.equal(summary.result.rootTimedOut, false);
  assert.equal(summary.result.recommendedMoveKey, summary.consensusMoveKey);
  assert.equal(summary.result.focalComparisonComplete, true);
  assert.equal(summary.result.terminalBestMinusConsensus, -257);
  assert.deepEqual(summary.result.timedOutCandidateMoveKeys,
    ["capture:namua:0:2:right:left::false"]);
  const focal = row.candidates.filter(({ moveKey }) =>
    [summary.consensusMoveKey, summary.terminalBestMoveKey].includes(moveKey));
  assert.equal(focal.every(({ analysis }) =>
    !analysis.timedOut && analysis.completedDepth === 10), true);
  assert.equal(row.candidates.filter(({ analysis }) => analysis.timedOut).length, 1);
  assert.equal(summary.integrity.verificationHash,
    "0900eff032d7dc018db21d00a80db0b9453a2f4ce21e26227ad4d3852527e0f6");
});

test("P003 depth-eleven retry completes all four candidate values", () => {
  const summary = JSON.parse(fs.readFileSync(
    "artifacts/joseki-study/summaries/p003-depth11-complete-summary.json", "utf8",
  ));
  assert.equal(summary.status, "depth-11-all-candidate-values-complete");
  assert.equal(summary.root.completedDepth, 11);
  assert.equal(summary.root.timedOut, false);
  assert.equal(summary.integrity.candidatesComplete, 4);
  assert.equal(summary.integrity.retriedCandidates, 1);
  assert.equal(summary.integrity.rootMatchesTopCandidate, true);
  assert.equal(summary.ranking.every(({ completedDepth, timedOut }) =>
    completedDepth === 10 && !timedOut), true);
  assert.deepEqual(summary.ranking.map(({ southScore }) => southScore),
    [-45, -173, -295, -302]);
  assert.equal(summary.ranking[0].isConsensus, true);
  assert.equal(summary.ranking[3].isSelfPlayWinCountLeader, true);
  assert.equal(summary.selfPlayWinCountLeaderMinusConsensus, -257);
  assert.equal(summary.integrity.verificationHash,
    "43492bf42b101987a36ca8e2439dbd86a5412c132660567113248a293ddd1947");
});
