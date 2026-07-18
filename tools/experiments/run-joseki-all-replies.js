#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const {
  AI, E, atomicWriteJson, hashValue, josekiProvenance, moveKey, stableStringify,
} = require("./lib/joseki-common.js");
const { seedFrom, seededRandom } = require("./paired-first-player-common.js");
const { validateTree } = require("./generate-joseki-tree.js");
const { replay: replayJ001 } = require("./run-joseki-j001-replies.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/run-joseki-all-replies.js";
const J001_NODE_ID = "p1-f710cf3e10d4";
const MAX_TOTAL_PLIES = 120;
const CONDITIONS = Object.freeze({
  "bao-d1": { depth: 1, evaluation: "bao" },
  "bao-d2": { depth: 2, evaluation: "bao" },
  "bao-d3": { depth: 3, evaluation: "bao" },
  "bao-d4": { depth: 4, evaluation: "bao" },
  "legacy-d2": { depth: 2, evaluation: "legacy" },
  "bao-v2-d2": { depth: 2, evaluation: "bao-v2" },
});
const FIXED_CRITERIA = Object.freeze({
  ranking: "descending worst-reply South wins, then pooled South wins, then Phase 1 rank",
  perReplySouthWinsMinimum: 3,
  pooledSouthWinRateMinimum: 0.5,
  interpretation: "reply-robust screening, not proof of optimal play or human win rate",
});

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/tree.json",
    phase1: "artifacts/joseki-study/summaries/phase-1-summary.json",
    j001: "artifacts/joseki-study/robustness/j001-replies",
    j001Verification: "artifacts/joseki-study/verified/j001-replies-verification.json",
    output: "artifacts/joseki-study/robustness/all-replies",
    verification: "artifacts/joseki-study/verified/all-replies-verification.json",
    summary: "artifacts/joseki-study/summaries/all-replies-summary.json",
    markdown: "doc/joseki/ALL_REPLY_RESULTS.md",
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--status") options.status = true;
    else {
      const value = argv[++index];
      if (key === "--tree") options.tree = value;
      else if (key === "--phase1") options.phase1 = value;
      else if (key === "--j001") options.j001 = value;
      else if (key === "--j001-verification") options.j001Verification = value;
      else if (key === "--output") options.output = value;
      else if (key === "--verification") options.verification = value;
      else if (key === "--summary") options.summary = value;
      else if (key === "--markdown") options.markdown = value;
      else throw new Error(`Unknown argument: ${key}`);
    }
  }
  return options;
}

function fileHash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, file))).digest("hex");
}

function conditionConfigs() {
  return Object.fromEntries(Object.entries(CONDITIONS).map(([conditionId, item]) => [conditionId, {
    conditionId, level: "hard", searchProfile: "phase2", evaluationProfile: item.evaluation,
    maxDepth: item.depth, timeLimitMs: "Infinity", maxTotalPlies: MAX_TOTAL_PLIES,
  }]));
}

function loadInputs(options) {
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  const phase1 = JSON.parse(fs.readFileSync(options.phase1, "utf8"));
  const j001Verification = JSON.parse(fs.readFileSync(options.j001Verification, "utf8"));
  validateTree(tree);
  if (!phase1.integrity.passed || phase1.integrity.treeHash !== tree.treeHash
    || !j001Verification.passed || j001Verification.treeHash !== tree.treeHash
    || j001Verification.games !== 24 || j001Verification.replies !== 4) {
    throw new Error("Input integrity mismatch");
  }
  const nodes = new Map(tree.nodes.filter(({ ply }) => ply === 1).map((node) => [node.nodeId, node]));
  const openings = phase1.candidates.slice().sort((a, b) => a.baselineRank - b.baselineRank).map((candidate) => {
    const node = nodes.get(candidate.nodeId);
    if (!node || node.moveKey !== candidate.moveKey) throw new Error(`Opening mismatch: ${candidate.nodeId}`);
    const replies = E.moveVariants(node.state).map((reply, index) => {
      const replyMoveKey = moveKey(reply);
      const state = E.applyMove(node.state, reply).state;
      const legacyReplyId = `reply-${String(index + 1).padStart(2, "0")}-${hashValue(replyMoveKey).slice(0, 12)}`;
      return { entryId: `${node.nodeId}--${legacyReplyId}`, legacyReplyId,
        openingNodeId: node.nodeId, openingMove: candidate.move, openingMoveKey: candidate.moveKey,
        baselineRank: candidate.baselineRank, reply, replyMoveKey, state, stateHash: hashValue(state) };
    });
    return { node, candidate, replies };
  });
  const entries = openings.flatMap(({ replies }) => replies);
  const runEntries = entries.filter(({ openingNodeId }) => openingNodeId !== J001_NODE_ID);
  if (entries.length !== 14 || runEntries.length !== 10) throw new Error("Expected 14 total and 10 new reply states");
  return { tree, phase1, j001Verification, openings, entries, runEntries };
}

function identity(options, tree, runEntries, j001Verification) {
  const provenance = josekiProvenance();
  const configs = conditionConfigs();
  return {
    schemaVersion: 1, experiment: "joseki-remaining-fixed-north-reply-continuations",
    treeFile: options.tree, treeHash: tree.treeHash,
    runEntryStateHashes: Object.fromEntries(runEntries.map(({ entryId, stateHash }) => [entryId, stateHash])),
    reusedJ001VerificationHash: j001Verification.verificationHash,
    conditionConfigs: configs,
    conditionHashes: Object.fromEntries(Object.entries(configs).map(([id, config]) => [id, hashValue(config)])),
    maxTotalPlies: MAX_TOTAL_PLIES, fixedCriteria: FIXED_CRITERIA,
    sourceCommit: provenance.sourceCommit, node: provenance.node,
    sourceFileSha256: { [SOURCE_FILE]: fileHash(SOURCE_FILE),
      "tools/experiments/run-joseki-j001-replies.js": fileHash("tools/experiments/run-joseki-j001-replies.js") },
  };
}

function assertIdentity(expected, actual, label) {
  if (stableStringify(expected) !== stableStringify(actual)) throw new Error(`${label} identity mismatch`);
}

function blockFile(output, entryId) { return path.join(output, "blocks", `${entryId}.json`); }
function partialFile(output, entryId) { return path.join(output, "partials", `${entryId}.partial.json`); }

function play(entry, conditionId, config, treeHash) {
  const seed = seedFrom(treeHash, entry.legacyReplyId, conditionId, "j001-replies-v1");
  const random = seededRandom(seed);
  let state = E.clone(entry.state);
  const continuationMoveKeys = [];
  const totals = { moves: 0, nodes: 0, evaluations: 0, timeouts: 0, elapsedMoveMs: 0 };
  const started = process.hrtime.bigint();
  while (state.winner === null && 2 + continuationMoveKeys.length < MAX_TOTAL_PLIES) {
    const analysis = AI.analyzeMove(state, config.level, random, {
      searchProfile: config.searchProfile, evaluationProfile: config.evaluationProfile,
      maxDepth: config.maxDepth, timeLimitMs: Infinity,
    });
    if (!analysis.move) break;
    continuationMoveKeys.push(moveKey(analysis.move));
    totals.moves += 1;
    totals.nodes += analysis.stats.nodes || 0;
    totals.evaluations += analysis.stats.evaluations || 0;
    totals.elapsedMoveMs += analysis.stats.elapsedMs || 0;
    if (analysis.stats.timedOut) totals.timeouts += 1;
    state = E.applyMove(state, analysis.move).state;
  }
  return {
    conditionId, conditionConfig: config, conditionConfigHash: hashValue(config), seed,
    entryId: entry.entryId, openingNodeId: entry.openingNodeId, openingMoveKey: entry.openingMoveKey,
    replyMoveKey: entry.replyMoveKey, replyStateHash: entry.stateHash,
    winner: state.winner, reason: state.reason || (state.winner === null ? "max-turns" : ""),
    openingPlies: 2, continuationPlies: continuationMoveKeys.length,
    totalPlies: 2 + continuationMoveKeys.length, continuationMoveKeys,
    continuationHash: hashValue(continuationMoveKeys), finalState: state, finalStateHash: hashValue(state),
    stats: { ...totals, elapsedMs: Number(process.hrtime.bigint() - started) / 1e6 },
  };
}

function validateResult(result, entry, experimentIdentity) {
  if (result.entryId !== entry.entryId || result.openingNodeId !== entry.openingNodeId
    || result.openingMoveKey !== entry.openingMoveKey || result.replyMoveKey !== entry.replyMoveKey
    || result.replyStateHash !== entry.stateHash
    || result.conditionConfigHash !== experimentIdentity.conditionHashes[result.conditionId]
    || result.continuationHash !== hashValue(result.continuationMoveKeys)
    || result.finalStateHash !== hashValue(result.finalState) || result.stats.timeouts !== 0) {
    throw new Error(`Result integrity mismatch: ${entry.entryId}/${result.conditionId}`);
  }
}

function replay(opening, entry, result) {
  let state = E.clone(opening.state);
  const reply = E.moveVariants(state).find((candidate) => moveKey(candidate) === entry.replyMoveKey);
  if (!reply) throw new Error(`Illegal fixed reply: ${entry.entryId}`);
  state = E.applyMove(state, reply).state;
  if (hashValue(state) !== entry.stateHash) throw new Error(`Fixed reply state mismatch: ${entry.entryId}`);
  for (const key of result.continuationMoveKeys) {
    const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === key);
    if (!move) throw new Error(`Illegal replay move: ${entry.entryId}/${result.conditionId}/${key}`);
    state = E.applyMove(state, move).state;
  }
  if (stableStringify(state) !== stableStringify(result.finalState) || hashValue(state) !== result.finalStateHash
    || state.winner !== result.winner || result.totalPlies !== 2 + result.continuationMoveKeys.length) {
    throw new Error(`Replay mismatch: ${entry.entryId}/${result.conditionId}`);
  }
  return 1 + result.continuationMoveKeys.length;
}

function counts(output, entries) {
  let completedEntries = 0;
  let completedGames = 0;
  let partialGames = 0;
  for (const entry of entries) {
    if (fs.existsSync(blockFile(output, entry.entryId))) {
      completedEntries += 1;
      completedGames += JSON.parse(fs.readFileSync(blockFile(output, entry.entryId), "utf8")).results.length;
    } else if (fs.existsSync(partialFile(output, entry.entryId))) {
      partialGames += JSON.parse(fs.readFileSync(partialFile(output, entry.entryId), "utf8")).results.length;
    }
  }
  return { completedEntries, completedGames, partialGames, recordedGames: completedGames + partialGames };
}

function writeProgress(options, entries, experimentIdentity, startedAt, status, current = null) {
  const currentCounts = counts(options.output, entries);
  const expectedGames = entries.length * Object.keys(CONDITIONS).length;
  const elapsedSeconds = (Date.now() - Date.parse(startedAt)) / 1000;
  atomicWriteJson(path.join(options.output, "progress.json"), {
    schemaVersion: 1, status, startedAt, updatedAt: new Date().toISOString(), identity: experimentIdentity,
    expected: { entries: entries.length, conditions: Object.keys(CONDITIONS).length, games: expectedGames },
    ...currentCounts, elapsedSeconds,
    etaSeconds: currentCounts.recordedGames
      ? elapsedSeconds / currentCounts.recordedGames * (expectedGames - currentCounts.recordedGames) : null,
    current,
  });
}

function runGames(options, tree, entries, experimentIdentity) {
  fs.mkdirSync(options.output, { recursive: true });
  const progressPath = path.join(options.output, "progress.json");
  const prior = fs.existsSync(progressPath) ? JSON.parse(fs.readFileSync(progressPath, "utf8")) : null;
  if (prior) assertIdentity(experimentIdentity, prior.identity, "Progress");
  const startedAt = prior?.startedAt || new Date().toISOString();
  writeProgress(options, entries, experimentIdentity, startedAt, "running");
  for (const entry of entries) {
    const complete = blockFile(options.output, entry.entryId);
    const incomplete = partialFile(options.output, entry.entryId);
    if (fs.existsSync(complete)) continue;
    const partial = fs.existsSync(incomplete) ? JSON.parse(fs.readFileSync(incomplete, "utf8")) : {
      schemaVersion: 1, status: "partial", entryId: entry.entryId,
      openingNodeId: entry.openingNodeId, openingMoveKey: entry.openingMoveKey,
      replyMoveKey: entry.replyMoveKey, replyStateHash: entry.stateHash,
      identity: experimentIdentity, results: [],
    };
    assertIdentity(experimentIdentity, partial.identity, `Partial ${entry.entryId}`);
    const done = new Set(partial.results.map(({ conditionId }) => conditionId));
    for (const [conditionId, config] of Object.entries(experimentIdentity.conditionConfigs)) {
      if (done.has(conditionId)) continue;
      writeProgress(options, entries, experimentIdentity, startedAt, "running", { entryId: entry.entryId, conditionId });
      partial.results.push(play(entry, conditionId, config, tree.treeHash));
      atomicWriteJson(incomplete, partial);
    }
    for (const result of partial.results) validateResult(result, entry, experimentIdentity);
    atomicWriteJson(complete, { ...partial, status: "complete", completedAt: new Date().toISOString() });
    fs.unlinkSync(incomplete);
  }
  writeProgress(options, entries, experimentIdentity, startedAt, "complete");
}

function newRowsAndVerification(options, tree, openings, entries, experimentIdentity) {
  const progress = JSON.parse(fs.readFileSync(path.join(options.output, "progress.json"), "utf8"));
  if (progress.status !== "complete") throw new Error(`Experiment incomplete: ${progress.status}`);
  assertIdentity(experimentIdentity, progress.identity, "Verification");
  for (const [file, expected] of Object.entries(experimentIdentity.sourceFileSha256)) {
    if (fileHash(file) !== expected) throw new Error(`Research source hash changed: ${file}`);
  }
  const openingById = new Map(openings.map(({ node }) => [node.nodeId, node]));
  const rows = [];
  let replayedMoves = 0;
  for (const entry of entries) {
    const block = JSON.parse(fs.readFileSync(blockFile(options.output, entry.entryId), "utf8"));
    assertIdentity(experimentIdentity, block.identity, `Block ${entry.entryId}`);
    if (block.results.length !== Object.keys(CONDITIONS).length) throw new Error(`Incomplete block: ${entry.entryId}`);
    for (const result of block.results) {
      validateResult(result, entry, experimentIdentity);
      replayedMoves += replay(openingById.get(entry.openingNodeId), entry, result);
      rows.push(result);
    }
  }
  return { rows, replayedMoves };
}

function reusedJ001Rows(options, opening, entries, expectedVerification) {
  const progress = JSON.parse(fs.readFileSync(path.join(options.j001, "progress.json"), "utf8"));
  if (progress.status !== "complete" || progress.identity.treeHash !== expectedVerification.treeHash
    || progress.identity.sourceFileSha256 !== fileHash("tools/experiments/run-joseki-j001-replies.js")) {
    throw new Error("Reused J001 source integrity mismatch");
  }
  const rows = [];
  let replayedMoves = 0;
  for (const entry of entries) {
    const file = path.join(options.j001, "blocks", `${entry.legacyReplyId}.json`);
    const block = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const result of block.results) {
      replayedMoves += replayJ001(opening, {
        replyId: entry.legacyReplyId, replyMoveKey: entry.replyMoveKey,
        stateHash: entry.stateHash, state: entry.state,
      }, result);
      rows.push({ ...result, entryId: entry.entryId, openingNodeId: entry.openingNodeId,
        openingMoveKey: entry.openingMoveKey });
    }
  }
  if (rows.length !== expectedVerification.games || replayedMoves !== expectedVerification.replayedMoves) {
    throw new Error("Reused J001 replay mismatch");
  }
  return { rows, replayedMoves };
}

function buildSummary(integrity, rows, openings) {
  const rankings = openings.map(({ node, candidate, replies }) => {
    const replyResults = replies.map((entry) => {
      const selected = rows.filter((row) => row.entryId === entry.entryId);
      return { entryId: entry.entryId, reply: entry.reply, replyMoveKey: entry.replyMoveKey,
        stateHash: entry.stateHash, games: selected.length,
        southWins: selected.filter(({ winner }) => winner === 0).length,
        northWins: selected.filter(({ winner }) => winner === 1).length,
        draws: selected.filter(({ winner }) => winner === null).length,
        outcomes: Object.fromEntries(selected.map(({ conditionId, winner, totalPlies, reason }) =>
          [conditionId, { winner, totalPlies, reason }])) };
    }).sort((left, right) => left.southWins - right.southWins || left.replyMoveKey.localeCompare(right.replyMoveKey));
    const games = replyResults.reduce((sum, item) => sum + item.games, 0);
    const southWins = replyResults.reduce((sum, item) => sum + item.southWins, 0);
    const worstReplySouthWins = Math.min(...replyResults.map(({ southWins: wins }) => wins));
    const checks = { perReplySouthWins: worstReplySouthWins >= FIXED_CRITERIA.perReplySouthWinsMinimum,
      pooledSouthWinRate: southWins / games >= FIXED_CRITERIA.pooledSouthWinRateMinimum };
    return { openingNodeId: node.nodeId, openingMove: candidate.move, openingMoveKey: candidate.moveKey,
      phase1Rank: candidate.baselineRank, replies: replyResults.length, games, southWins,
      northWins: games - southWins, draws: replyResults.reduce((sum, item) => sum + item.draws, 0),
      southWinRate: southWins / games, worstReplySouthWins, worstReplies: replyResults.filter(
        ({ southWins: wins }) => wins === worstReplySouthWins).map(({ replyMoveKey }) => replyMoveKey),
      checks, status: Object.values(checks).every(Boolean) ? "response-robust-screening" : "response-sensitive",
      replyResults };
  }).sort((left, right) => right.worstReplySouthWins - left.worstReplySouthWins
    || right.southWins - left.southWins || left.phase1Rank - right.phase1Rank);
  return { schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: rankings.some(({ status }) => status === "response-robust-screening")
      ? "candidate-remains" : "no-response-robust-candidate",
    scope: "all 14 legal North reply states after all four legal South initial moves under six fixed AI conditions",
    caveat: "Deterministic engine screening; not proof of optimal play or a human win-rate estimate.",
    fixedCriteria: FIXED_CRITERIA, rankings, integrity };
}

function moveLabel(move) { return `${move.index + 1}番穴・${move.direction === "left" ? "左" : "右"}`; }
function percent(value) { return `${(value * 100).toFixed(1)}%`; }
function markdown(summary) {
  return ["# 全初手・全North応手 固定継続比較", "", `生成日時: ${summary.generatedAt}`, "",
    `判定: \`${summary.status}\``, "",
    "標準初期局面の4初手と、その直後の合法North応手全14通りを固定し、6 AI条件で終局まで継続した84局の比較である。J001の既検証24局を同一条件・seed規則の成果物から再利用し、残り60局を追加した。", "",
    "## 事前固定基準", "", "- 順位: 最悪応手でのSouth勝数、全応手合計South勝数、Phase 1順位の順",
    "- 応手頑健性: 各応手でSouth 3/6勝以上、かつ全応手合計50%以上", "",
    "## 初手順位", "", "| 順位 | South初手 | 応手数 | 最悪応手South勝 | 合計South勝 | 合計North勝 | South率 | 判定 |",
    "| ---: | --- | ---: | ---: | ---: | ---: | ---: | --- |",
    ...summary.rankings.map((item, index) => `| ${index + 1} | ${moveLabel(item.openingMove)} | ${item.replies} | ${item.worstReplySouthWins}/6 | ${item.southWins}/${item.games} | ${item.northWins}/${item.games} | ${percent(item.southWinRate)} | ${item.status} |`), "",
    "## 最悪応手", "", "| South初手 | 最終勝敗基準の最悪North応手 | South勝 |", "| --- | --- | ---: |",
    ...summary.rankings.flatMap((item) => item.worstReplies.map((reply) =>
      `| ${moveLabel(item.openingMove)} | \`${reply}\` | ${item.worstReplySouthWins}/6 |`)), "",
    "## 完全性", "", `- 全応手局面: ${summary.integrity.replyStates}`, `- 統合対局: ${summary.integrity.games}`,
    `- 新規対局: ${summary.integrity.newGames}`, `- 再利用J001対局: ${summary.integrity.reusedGames}`,
    `- 固定応手を含むreplay検証手数: ${summary.integrity.replayedMoves}`,
    `- timeout: ${summary.integrity.timeouts}`, `- verification hash: \`${summary.integrity.verificationHash}\``, "",
  ].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.status) {
    const file = path.join(options.output, "progress.json");
    console.log(fs.existsSync(file) ? fs.readFileSync(file, "utf8") : JSON.stringify({ status: "not-started" }, null, 2));
    return;
  }
  const inputs = loadInputs(options);
  const experimentIdentity = identity(options, inputs.tree, inputs.runEntries, inputs.j001Verification);
  runGames(options, inputs.tree, inputs.runEntries, experimentIdentity);
  const fresh = newRowsAndVerification(options, inputs.tree, inputs.openings, inputs.runEntries, experimentIdentity);
  const j001Opening = inputs.openings.find(({ node }) => node.nodeId === J001_NODE_ID);
  const reused = reusedJ001Rows(options, j001Opening.node, j001Opening.replies, inputs.j001Verification);
  const rows = [...fresh.rows, ...reused.rows];
  const terminalGames = rows.filter(({ winner }) => winner !== null).length;
  const timeouts = rows.reduce((sum, row) => sum + row.stats.timeouts, 0);
  if (rows.length !== 84 || terminalGames !== 84 || timeouts !== 0) throw new Error("Combined result integrity mismatch");
  const integrity = { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    treeHash: inputs.tree.treeHash, replyStates: inputs.entries.length, games: rows.length,
    newGames: fresh.rows.length, reusedGames: reused.rows.length, terminalGames,
    replayedMoves: fresh.replayedMoves + reused.replayedMoves, timeouts, partialResults: 0,
    sourceHashesMatch: true, replayHashesMatch: true,
    reusedJ001VerificationHash: inputs.j001Verification.verificationHash,
    verificationHash: hashValue({ treeHash: inputs.tree.treeHash, replyStates: inputs.entries.length,
      games: rows.length, terminalGames, replayedMoves: fresh.replayedMoves + reused.replayedMoves,
      reusedJ001VerificationHash: inputs.j001Verification.verificationHash }) };
  atomicWriteJson(options.verification, integrity);
  const summary = buildSummary(integrity, rows, inputs.openings);
  atomicWriteJson(options.summary, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ summary: options.summary, markdown: options.markdown,
    status: summary.status, rankings: summary.rankings.map(({ replyResults, ...item }) => item),
    integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { buildSummary, identity, loadInputs, markdown, parseArgs, replay };
