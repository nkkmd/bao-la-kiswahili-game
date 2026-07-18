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

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/run-joseki-j001-replies.js";
const J001_NODE_ID = "p1-f710cf3e10d4";
const J001_MOVE_KEY = "takata:namua:0:5:right:::false";
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
  terminalAndReplay: "all 24 games terminate and replay to the saved final state",
  perReplySouthWinsMinimum: 3,
  pooledSouthWinsMinimum: 12,
  interpretation: "screening for reply sensitivity, not promotion to joseki",
});

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/tree.json",
    phase1: "artifacts/joseki-study/summaries/phase-1-summary.json",
    output: "artifacts/joseki-study/robustness/j001-replies",
    verification: "artifacts/joseki-study/verified/j001-replies-verification.json",
    summary: "artifacts/joseki-study/summaries/j001-replies-summary.json",
    markdown: "doc/joseki/J001_REPLY_RESULTS.md",
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--status") options.status = true;
    else {
      const value = argv[++index];
      if (key === "--tree") options.tree = value;
      else if (key === "--phase1") options.phase1 = value;
      else if (key === "--output") options.output = value;
      else if (key === "--verification") options.verification = value;
      else if (key === "--summary") options.summary = value;
      else if (key === "--markdown") options.markdown = value;
      else throw new Error(`Unknown argument: ${key}`);
    }
  }
  return options;
}

function sourceHash() {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, SOURCE_FILE))).digest("hex");
}

function loadInputs(options) {
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  const phase1 = JSON.parse(fs.readFileSync(options.phase1, "utf8"));
  validateTree(tree);
  if (!phase1.integrity.passed || phase1.integrity.treeHash !== tree.treeHash) {
    throw new Error("Phase 1 integrity mismatch");
  }
  const opening = tree.nodes.find(({ nodeId }) => nodeId === J001_NODE_ID);
  if (!opening || opening.moveKey !== J001_MOVE_KEY || opening.state.player !== 1) {
    throw new Error("J001 opening mismatch");
  }
  const entries = E.moveVariants(opening.state).map((reply, index) => {
    const applied = E.applyMove(opening.state, reply).state;
    const replyMoveKey = moveKey(reply);
    return {
      replyId: `reply-${String(index + 1).padStart(2, "0")}-${hashValue(replyMoveKey).slice(0, 12)}`,
      reply, replyMoveKey, state: applied, stateHash: hashValue(applied),
    };
  });
  if (entries.length !== 4 || new Set(entries.map(({ replyMoveKey }) => replyMoveKey)).size !== 4) {
    throw new Error("Expected four unique J001 replies");
  }
  return { tree, phase1, opening, entries };
}

function conditionConfigs() {
  return Object.fromEntries(Object.entries(CONDITIONS).map(([conditionId, item]) => [conditionId, {
    conditionId, level: "hard", searchProfile: "phase2", evaluationProfile: item.evaluation,
    maxDepth: item.depth, timeLimitMs: "Infinity", maxTotalPlies: MAX_TOTAL_PLIES,
  }]));
}

function identity(options, tree, opening, entries) {
  const provenance = josekiProvenance();
  const configs = conditionConfigs();
  return {
    schemaVersion: 1, experiment: "joseki-j001-fixed-north-reply-continuations",
    treeFile: options.tree, treeHash: tree.treeHash, openingNodeId: opening.nodeId,
    openingStateHash: opening.stateHash, openingMoveKey: J001_MOVE_KEY,
    replyStateHashes: Object.fromEntries(entries.map(({ replyId, stateHash }) => [replyId, stateHash])),
    conditionConfigs: configs,
    conditionHashes: Object.fromEntries(Object.entries(configs).map(([id, config]) => [id, hashValue(config)])),
    maxTotalPlies: MAX_TOTAL_PLIES, fixedCriteria: FIXED_CRITERIA,
    sourceCommit: provenance.sourceCommit, node: provenance.node, sourceFileSha256: sourceHash(),
  };
}

function assertIdentity(expected, actual, label) {
  if (stableStringify(expected) !== stableStringify(actual)) throw new Error(`${label} identity mismatch`);
}

function blockFile(output, replyId) { return path.join(output, "blocks", `${replyId}.json`); }
function partialFile(output, replyId) { return path.join(output, "partials", `${replyId}.partial.json`); }

function play(entry, conditionId, config, treeHash) {
  const seed = seedFrom(treeHash, entry.replyId, conditionId, "j001-replies-v1");
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
    replyId: entry.replyId, replyMoveKey: entry.replyMoveKey, replyStateHash: entry.stateHash,
    winner: state.winner, reason: state.reason || (state.winner === null ? "max-turns" : ""),
    openingPlies: 2, continuationPlies: continuationMoveKeys.length,
    totalPlies: 2 + continuationMoveKeys.length, continuationMoveKeys,
    continuationHash: hashValue(continuationMoveKeys), finalState: state,
    finalStateHash: hashValue(state),
    stats: { ...totals, elapsedMs: Number(process.hrtime.bigint() - started) / 1e6 },
  };
}

function validateResult(result, entry, experimentIdentity) {
  if (result.replyId !== entry.replyId || result.replyMoveKey !== entry.replyMoveKey
    || result.replyStateHash !== entry.stateHash
    || result.conditionConfigHash !== experimentIdentity.conditionHashes[result.conditionId]
    || result.continuationHash !== hashValue(result.continuationMoveKeys)
    || result.finalStateHash !== hashValue(result.finalState) || result.stats.timeouts !== 0) {
    throw new Error(`Result integrity mismatch: ${entry.replyId}/${result.conditionId}`);
  }
}

function replay(opening, entry, result) {
  let state = E.clone(opening.state);
  const reply = E.moveVariants(state).find((candidate) => moveKey(candidate) === entry.replyMoveKey);
  if (!reply) throw new Error(`Illegal fixed reply: ${entry.replyMoveKey}`);
  state = E.applyMove(state, reply).state;
  if (hashValue(state) !== entry.stateHash) throw new Error(`Fixed reply state mismatch: ${entry.replyId}`);
  for (const key of result.continuationMoveKeys) {
    const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === key);
    if (!move) throw new Error(`Illegal replay move: ${entry.replyId}/${result.conditionId}/${key}`);
    state = E.applyMove(state, move).state;
  }
  if (stableStringify(state) !== stableStringify(result.finalState) || hashValue(state) !== result.finalStateHash
    || state.winner !== result.winner || result.totalPlies !== 2 + result.continuationMoveKeys.length) {
    throw new Error(`Replay mismatch: ${entry.replyId}/${result.conditionId}`);
  }
  return 1 + result.continuationMoveKeys.length;
}

function counts(output, entries) {
  let completedReplies = 0;
  let completedGames = 0;
  let partialGames = 0;
  for (const entry of entries) {
    if (fs.existsSync(blockFile(output, entry.replyId))) {
      completedReplies += 1;
      completedGames += JSON.parse(fs.readFileSync(blockFile(output, entry.replyId), "utf8")).results.length;
    } else if (fs.existsSync(partialFile(output, entry.replyId))) {
      partialGames += JSON.parse(fs.readFileSync(partialFile(output, entry.replyId), "utf8")).results.length;
    }
  }
  return { completedReplies, completedGames, partialGames, recordedGames: completedGames + partialGames };
}

function writeProgress(options, entries, experimentIdentity, startedAt, status, current = null) {
  const currentCounts = counts(options.output, entries);
  const expectedGames = entries.length * Object.keys(CONDITIONS).length;
  const elapsedSeconds = (Date.now() - Date.parse(startedAt)) / 1000;
  atomicWriteJson(path.join(options.output, "progress.json"), {
    schemaVersion: 1, status, startedAt, updatedAt: new Date().toISOString(), identity: experimentIdentity,
    expected: { replies: entries.length, conditions: Object.keys(CONDITIONS).length, games: expectedGames },
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
    const complete = blockFile(options.output, entry.replyId);
    const incomplete = partialFile(options.output, entry.replyId);
    if (fs.existsSync(complete)) continue;
    const partial = fs.existsSync(incomplete) ? JSON.parse(fs.readFileSync(incomplete, "utf8")) : {
      schemaVersion: 1, status: "partial", replyId: entry.replyId,
      replyMoveKey: entry.replyMoveKey, replyStateHash: entry.stateHash,
      identity: experimentIdentity, results: [],
    };
    assertIdentity(experimentIdentity, partial.identity, `Partial ${entry.replyId}`);
    const done = new Set(partial.results.map(({ conditionId }) => conditionId));
    for (const [conditionId, config] of Object.entries(experimentIdentity.conditionConfigs)) {
      if (done.has(conditionId)) continue;
      writeProgress(options, entries, experimentIdentity, startedAt, "running", { replyId: entry.replyId, conditionId });
      partial.results.push(play(entry, conditionId, config, tree.treeHash));
      atomicWriteJson(incomplete, partial);
    }
    for (const result of partial.results) validateResult(result, entry, experimentIdentity);
    atomicWriteJson(complete, { ...partial, status: "complete", completedAt: new Date().toISOString() });
    fs.unlinkSync(incomplete);
  }
  writeProgress(options, entries, experimentIdentity, startedAt, "complete");
}

function verify(options, tree, opening, entries, experimentIdentity) {
  const progress = JSON.parse(fs.readFileSync(path.join(options.output, "progress.json"), "utf8"));
  if (progress.status !== "complete") throw new Error(`Experiment incomplete: ${progress.status}`);
  assertIdentity(experimentIdentity, progress.identity, "Verification");
  if (sourceHash() !== experimentIdentity.sourceFileSha256) throw new Error("Research source hash changed");
  const rows = [];
  let replayedMoves = 0;
  let timeouts = 0;
  const conditionCounts = Object.fromEntries(Object.keys(CONDITIONS).map((id) => [id, 0]));
  for (const entry of entries) {
    const block = JSON.parse(fs.readFileSync(blockFile(options.output, entry.replyId), "utf8"));
    assertIdentity(experimentIdentity, block.identity, `Block ${entry.replyId}`);
    if (block.results.length !== Object.keys(CONDITIONS).length) throw new Error(`Incomplete block: ${entry.replyId}`);
    for (const result of block.results) {
      validateResult(result, entry, experimentIdentity);
      replayedMoves += replay(opening, entry, result);
      timeouts += result.stats.timeouts;
      conditionCounts[result.conditionId] += 1;
      rows.push(result);
    }
  }
  const terminalGames = rows.filter(({ winner }) => winner !== null).length;
  const verification = {
    schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    treeHash: tree.treeHash, openingStateHash: opening.stateHash,
    replies: entries.length, games: rows.length, terminalGames, replayedMoves, timeouts,
    conditionCounts, partialResults: 0, sourceHashesMatch: true, replayHashesMatch: true,
    verificationHash: hashValue({ treeHash: tree.treeHash, openingStateHash: opening.stateHash,
      games: rows.length, terminalGames, replayedMoves, conditionCounts }),
  };
  atomicWriteJson(options.verification, verification);
  return { verification, rows };
}

function phase1WorstReplies(phase1) {
  return Object.fromEntries(Object.keys(CONDITIONS).map((conditionId) => {
    const ranking = phase1.rankings[conditionId];
    const item = ranking?.find(({ moveKey: key }) => key === J001_MOVE_KEY);
    if (!item) throw new Error(`Missing Phase 1 J001 ranking: ${conditionId}`);
    return [conditionId, { replyMoveKey: item.bestReplyForNorth.moveKey,
      southScore: item.bestReplyForNorth.value }];
  }));
}

function buildSummary(verification, rows, entries, phase1) {
  const replies = entries.map((entry) => {
    const selected = rows.filter(({ replyId }) => replyId === entry.replyId);
    return {
      replyId: entry.replyId, reply: entry.reply, replyMoveKey: entry.replyMoveKey,
      stateHash: entry.stateHash, games: selected.length,
      southWins: selected.filter(({ winner }) => winner === 0).length,
      northWins: selected.filter(({ winner }) => winner === 1).length,
      draws: selected.filter(({ winner }) => winner === null).length,
      averageTotalPlies: selected.reduce((sum, item) => sum + item.totalPlies, 0) / selected.length,
      outcomes: Object.fromEntries(selected.map(({ conditionId, winner, totalPlies, reason }) =>
        [conditionId, { winner, totalPlies, reason }])),
    };
  }).sort((left, right) => left.southWins - right.southWins || left.replyMoveKey.localeCompare(right.replyMoveKey));
  const conditions = Object.keys(CONDITIONS).map((conditionId) => {
    const selected = rows.filter((row) => row.conditionId === conditionId);
    const northWinningReplies = selected.filter(({ winner }) => winner === 1).map(({ replyMoveKey }) => replyMoveKey).sort();
    return { conditionId, southWins: selected.filter(({ winner }) => winner === 0).length,
      northWins: northWinningReplies.length, draws: selected.filter(({ winner }) => winner === null).length,
      northWinningReplies, allRepliesSouthWin: northWinningReplies.length === 0 };
  });
  const pooledSouthWins = rows.filter(({ winner }) => winner === 0).length;
  const terminalAndReplay = verification.terminalGames === rows.length && verification.replayHashesMatch;
  const perReplyMinimum = Math.min(...replies.map(({ southWins }) => southWins));
  const checks = {
    terminalAndReplay,
    perReplySouthWins: perReplyMinimum >= FIXED_CRITERIA.perReplySouthWinsMinimum,
    pooledSouthWins: pooledSouthWins >= FIXED_CRITERIA.pooledSouthWinsMinimum,
  };
  return {
    schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: Object.values(checks).every(Boolean) ? "response-robust-screening" : "response-sensitive",
    scope: "all four fixed legal North replies after J001, continued under six deterministic shared AI conditions",
    caveat: "This screening resolves reply coverage but does not establish a human win rate or promote J001.",
    openingNodeId: J001_NODE_ID, openingMoveKey: J001_MOVE_KEY,
    fixedCriteria: FIXED_CRITERIA, checks,
    totals: { games: rows.length, southWins: pooledSouthWins,
      northWins: rows.filter(({ winner }) => winner === 1).length,
      draws: rows.filter(({ winner }) => winner === null).length,
      perReplySouthWinsMinimum: perReplyMinimum },
    replies, conditions, phase1WorstReplies: phase1WorstReplies(phase1), integrity: verification,
  };
}

function winnerName(value) { return value === 0 ? "South" : value === 1 ? "North" : "打切り"; }
function replyLabel(reply) { return `${reply.index + 1}番穴・${reply.direction === "left" ? "左" : "右"}`; }

function markdown(summary) {
  const conditionIds = Object.keys(CONDITIONS);
  return [
    "# J001 全North応手固定継続", "", `生成日時: ${summary.generatedAt}`, "",
    `判定: \`${summary.status}\``, "",
    "J001（South 6番穴・右）の直後にNorthが指せる4応手を一つずつ固定し、同じ6 AI条件を両側へ適用して最大120 plyまで継続した。決定論的な応手感度スクリーニングであり、昇格判定や人間勝率ではない。", "",
    "## 事前固定基準", "", "- 24局すべてが終局し、保存最終局面まで再生一致",
    `- 各応手でSouth ${summary.fixedCriteria.perReplySouthWinsMinimum}/6勝以上`,
    `- 全体でSouth ${summary.fixedCriteria.pooledSouthWinsMinimum}/24勝以上`, "",
    "## 応手別結果", "", "| North応手 | South勝 | North勝 | 打切り | 平均終局ply |", "| --- | ---: | ---: | ---: | ---: |",
    ...summary.replies.map((item) => `| ${replyLabel(item.reply)} | ${item.southWins} | ${item.northWins} | ${item.draws} | ${item.averageTotalPlies.toFixed(1)} |`), "",
    "## 条件別勝者", "", `| North応手 | ${conditionIds.join(" | ")} |`,
    `| --- | ${conditionIds.map(() => "---").join(" | ")} |`,
    ...summary.replies.map((item) => `| ${replyLabel(item.reply)} | ${conditionIds.map((id) => winnerName(item.outcomes[id].winner)).join(" | ")} |`), "",
    "## 条件別応手耐性", "", "| 条件 | South勝応手数 | North勝応手数 | 全応手でSouth勝 | Phase 1最悪応手 |", "| --- | ---: | ---: | --- | --- |",
    ...summary.conditions.map((item) => `| ${item.conditionId} | ${item.southWins} | ${item.northWins} | ${item.allRepliesSouthWin ? "yes" : "no"} | \`${summary.phase1WorstReplies[item.conditionId].replyMoveKey}\` |`), "",
    "## 判定", "", `- 全局終局・再生一致: ${summary.checks.terminalAndReplay ? "yes" : "no"}`,
    `- 各応手3/6勝以上: ${summary.checks.perReplySouthWins ? "yes" : "no"}`,
    `- 全体12/24勝以上: ${summary.checks.pooledSouthWins ? "yes" : "no"}`,
    `- 合計: South ${summary.totals.southWins}勝、North ${summary.totals.northWins}勝、打切り ${summary.totals.draws}`, "",
    "## 完全性", "", `- 対局: ${summary.integrity.games}`, `- 固定応手を含むreplay検証手数: ${summary.integrity.replayedMoves}`,
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
  const { tree, phase1, opening, entries } = loadInputs(options);
  const experimentIdentity = identity(options, tree, opening, entries);
  runGames(options, tree, entries, experimentIdentity);
  const { verification, rows } = verify(options, tree, opening, entries, experimentIdentity);
  const summary = buildSummary(verification, rows, entries, phase1);
  atomicWriteJson(options.summary, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ summary: options.summary, markdown: options.markdown,
    status: summary.status, checks: summary.checks, totals: summary.totals,
    replies: summary.replies, conditions: summary.conditions, integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { buildSummary, identity, loadInputs, markdown, parseArgs, replay };
