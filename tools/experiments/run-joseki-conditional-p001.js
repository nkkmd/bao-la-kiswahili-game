#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const {
  AI, E, atomicWriteJson, hashValue, josekiProvenance, moveKey, stableStringify, stateFeatures,
} = require("./lib/joseki-common.js");
const { seedFrom, seededRandom } = require("./paired-first-player-common.js");
const { validateTree } = require("./generate-joseki-tree.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/run-joseki-conditional-p001.js";
const OPENING_NODE_ID = "p1-b3e1279167e3";
const NORTH_REPLY_KEY = "takata:namua:0:5:right:::false";
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
  relativeSupport: "South win count is tied for or above every legal third move",
  absoluteSupport: "South wins at least 4 of 6 conditions",
  interpretation: "conditional third-move screening; promotion requires all legal North fourth replies",
});

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/tree.json",
    allRepliesVerification: "artifacts/joseki-study/verified/all-replies-verification.json",
    naturalBlock: `artifacts/joseki-study/robustness/all-replies/blocks/${OPENING_NODE_ID}--reply-02-e444b2fcdbdb.json`,
    output: "artifacts/joseki-study/robustness/conditional-p001",
    verification: "artifacts/joseki-study/verified/conditional-p001-verification.json",
    summary: "artifacts/joseki-study/summaries/conditional-p001-summary.json",
    markdown: "doc/joseki/CONDITIONAL_P001_RESULTS.md",
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--status") options.status = true;
    else {
      const value = argv[++index];
      if (key === "--tree") options.tree = value;
      else if (key === "--all-replies-verification") options.allRepliesVerification = value;
      else if (key === "--natural-block") options.naturalBlock = value;
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
  const allRepliesVerification = JSON.parse(fs.readFileSync(options.allRepliesVerification, "utf8"));
  const naturalBlock = JSON.parse(fs.readFileSync(options.naturalBlock, "utf8"));
  validateTree(tree);
  if (!allRepliesVerification.passed || allRepliesVerification.treeHash !== tree.treeHash
    || allRepliesVerification.games !== 84) throw new Error("All-reply verification mismatch");
  const opening = tree.nodes.find(({ nodeId }) => nodeId === OPENING_NODE_ID);
  if (!opening || opening.ply !== 1) throw new Error("Missing P001 opening node");
  const northReply = E.moveVariants(opening.state).find((move) => moveKey(move) === NORTH_REPLY_KEY);
  if (!northReply) throw new Error("Missing P001 North reply");
  const startState = E.applyMove(opening.state, northReply).state;
  const startStateHash = hashValue(startState);
  if (naturalBlock.replyStateHash !== startStateHash || naturalBlock.results.length !== 6) {
    throw new Error("P001 natural continuation mismatch");
  }
  const entries = E.moveVariants(startState).map((thirdMove, index) => {
    const thirdMoveKey = moveKey(thirdMove);
    const state = E.applyMove(startState, thirdMove).state;
    return { candidateId: `third-${String(index + 1).padStart(2, "0")}-${hashValue(thirdMoveKey).slice(0, 12)}`,
      thirdMove, thirdMoveKey, state, stateHash: hashValue(state) };
  });
  if (entries.length !== 4) throw new Error("Expected four legal South third moves");
  return { tree, allRepliesVerification, naturalBlock, opening, startState, startStateHash, entries };
}

function configs() {
  return Object.fromEntries(Object.entries(CONDITIONS).map(([conditionId, item]) => [conditionId, {
    conditionId, level: "hard", searchProfile: "phase2", evaluationProfile: item.evaluation,
    maxDepth: item.depth, timeLimitMs: "Infinity", maxTotalPlies: MAX_TOTAL_PLIES,
  }]));
}

function identity(options, inputs) {
  const provenance = josekiProvenance();
  const conditionConfigs = configs();
  return { schemaVersion: 1, experiment: "joseki-conditional-p001-fixed-south-third-moves",
    treeFile: options.tree, treeHash: inputs.tree.treeHash,
    openingNodeId: OPENING_NODE_ID, openingMoveKey: inputs.opening.moveKey,
    northReplyKey: NORTH_REPLY_KEY, startStateHash: inputs.startStateHash,
    candidateStateHashes: Object.fromEntries(inputs.entries.map(({ candidateId, stateHash }) => [candidateId, stateHash])),
    allRepliesVerificationHash: inputs.allRepliesVerification.verificationHash,
    conditionConfigs,
    conditionHashes: Object.fromEntries(Object.entries(conditionConfigs).map(([id, config]) => [id, hashValue(config)])),
    maxTotalPlies: MAX_TOTAL_PLIES, fixedCriteria: FIXED_CRITERIA,
    sourceCommit: provenance.sourceCommit, node: provenance.node, sourceFileSha256: sourceHash() };
}

function assertIdentity(expected, actual, label) {
  if (stableStringify(expected) !== stableStringify(actual)) throw new Error(`${label} identity mismatch`);
}

function blockFile(output, id) { return path.join(output, "blocks", `${id}.json`); }
function partialFile(output, id) { return path.join(output, "partials", `${id}.partial.json`); }

function play(entry, conditionId, config, treeHash) {
  const seed = seedFrom(treeHash, entry.candidateId, conditionId, "conditional-p001-v1");
  const random = seededRandom(seed);
  let state = E.clone(entry.state);
  const continuationMoveKeys = [];
  const totals = { moves: 0, nodes: 0, evaluations: 0, timeouts: 0, elapsedMoveMs: 0 };
  const started = process.hrtime.bigint();
  while (state.winner === null && 3 + continuationMoveKeys.length < MAX_TOTAL_PLIES) {
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
  return { conditionId, conditionConfig: config, conditionConfigHash: hashValue(config), seed,
    candidateId: entry.candidateId, thirdMoveKey: entry.thirdMoveKey, candidateStateHash: entry.stateHash,
    winner: state.winner, reason: state.reason || (state.winner === null ? "max-turns" : ""),
    openingPlies: 3, continuationPlies: continuationMoveKeys.length,
    totalPlies: 3 + continuationMoveKeys.length, continuationMoveKeys,
    continuationHash: hashValue(continuationMoveKeys), finalState: state, finalStateHash: hashValue(state),
    stats: { ...totals, elapsedMs: Number(process.hrtime.bigint() - started) / 1e6 } };
}

function validateResult(result, entry, experimentIdentity) {
  if (result.candidateId !== entry.candidateId || result.thirdMoveKey !== entry.thirdMoveKey
    || result.candidateStateHash !== entry.stateHash
    || result.conditionConfigHash !== experimentIdentity.conditionHashes[result.conditionId]
    || result.continuationHash !== hashValue(result.continuationMoveKeys)
    || result.finalStateHash !== hashValue(result.finalState) || result.stats.timeouts !== 0) {
    throw new Error(`Result integrity mismatch: ${entry.candidateId}/${result.conditionId}`);
  }
}

function replay(startState, entry, result) {
  let state = E.clone(startState);
  const third = E.moveVariants(state).find((move) => moveKey(move) === entry.thirdMoveKey);
  if (!third) throw new Error(`Illegal fixed third move: ${entry.thirdMoveKey}`);
  state = E.applyMove(state, third).state;
  if (hashValue(state) !== entry.stateHash) throw new Error(`Third-move state mismatch: ${entry.candidateId}`);
  for (const key of result.continuationMoveKeys) {
    const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === key);
    if (!move) throw new Error(`Illegal replay move: ${entry.candidateId}/${result.conditionId}/${key}`);
    state = E.applyMove(state, move).state;
  }
  if (stableStringify(state) !== stableStringify(result.finalState) || hashValue(state) !== result.finalStateHash
    || state.winner !== result.winner || result.totalPlies !== 3 + result.continuationMoveKeys.length) {
    throw new Error(`Replay mismatch: ${entry.candidateId}/${result.conditionId}`);
  }
  return 1 + result.continuationMoveKeys.length;
}

function progressCounts(output, entries) {
  let completedCandidates = 0;
  let completedGames = 0;
  let partialGames = 0;
  for (const entry of entries) {
    if (fs.existsSync(blockFile(output, entry.candidateId))) {
      completedCandidates += 1;
      completedGames += JSON.parse(fs.readFileSync(blockFile(output, entry.candidateId), "utf8")).results.length;
    } else if (fs.existsSync(partialFile(output, entry.candidateId))) {
      partialGames += JSON.parse(fs.readFileSync(partialFile(output, entry.candidateId), "utf8")).results.length;
    }
  }
  return { completedCandidates, completedGames, partialGames, recordedGames: completedGames + partialGames };
}

function writeProgress(options, entries, experimentIdentity, startedAt, status, current = null) {
  const counts = progressCounts(options.output, entries);
  const expectedGames = entries.length * Object.keys(CONDITIONS).length;
  const elapsedSeconds = (Date.now() - Date.parse(startedAt)) / 1000;
  atomicWriteJson(path.join(options.output, "progress.json"), { schemaVersion: 1, status, startedAt,
    updatedAt: new Date().toISOString(), identity: experimentIdentity,
    expected: { candidates: entries.length, conditions: Object.keys(CONDITIONS).length, games: expectedGames },
    ...counts, elapsedSeconds,
    etaSeconds: counts.recordedGames ? elapsedSeconds / counts.recordedGames * (expectedGames - counts.recordedGames) : null,
    current });
}

function runGames(options, inputs, experimentIdentity) {
  fs.mkdirSync(options.output, { recursive: true });
  const progressPath = path.join(options.output, "progress.json");
  const prior = fs.existsSync(progressPath) ? JSON.parse(fs.readFileSync(progressPath, "utf8")) : null;
  if (prior) assertIdentity(experimentIdentity, prior.identity, "Progress");
  const startedAt = prior?.startedAt || new Date().toISOString();
  writeProgress(options, inputs.entries, experimentIdentity, startedAt, "running");
  for (const entry of inputs.entries) {
    const complete = blockFile(options.output, entry.candidateId);
    const incomplete = partialFile(options.output, entry.candidateId);
    if (fs.existsSync(complete)) continue;
    const partial = fs.existsSync(incomplete) ? JSON.parse(fs.readFileSync(incomplete, "utf8")) : {
      schemaVersion: 1, status: "partial", candidateId: entry.candidateId,
      thirdMoveKey: entry.thirdMoveKey, candidateStateHash: entry.stateHash,
      identity: experimentIdentity, results: [] };
    assertIdentity(experimentIdentity, partial.identity, `Partial ${entry.candidateId}`);
    const done = new Set(partial.results.map(({ conditionId }) => conditionId));
    for (const [conditionId, config] of Object.entries(experimentIdentity.conditionConfigs)) {
      if (done.has(conditionId)) continue;
      writeProgress(options, inputs.entries, experimentIdentity, startedAt, "running", { candidateId: entry.candidateId, conditionId });
      partial.results.push(play(entry, conditionId, config, inputs.tree.treeHash));
      atomicWriteJson(incomplete, partial);
    }
    for (const result of partial.results) validateResult(result, entry, experimentIdentity);
    atomicWriteJson(complete, { ...partial, status: "complete", completedAt: new Date().toISOString() });
    fs.unlinkSync(incomplete);
  }
  writeProgress(options, inputs.entries, experimentIdentity, startedAt, "complete");
}

function verify(options, inputs, experimentIdentity) {
  const progress = JSON.parse(fs.readFileSync(path.join(options.output, "progress.json"), "utf8"));
  if (progress.status !== "complete") throw new Error(`Experiment incomplete: ${progress.status}`);
  assertIdentity(experimentIdentity, progress.identity, "Verification");
  if (sourceHash() !== experimentIdentity.sourceFileSha256) throw new Error("Research source hash changed");
  const rows = [];
  let replayedMoves = 0;
  for (const entry of inputs.entries) {
    const block = JSON.parse(fs.readFileSync(blockFile(options.output, entry.candidateId), "utf8"));
    assertIdentity(experimentIdentity, block.identity, `Block ${entry.candidateId}`);
    if (block.results.length !== Object.keys(CONDITIONS).length) throw new Error(`Incomplete block: ${entry.candidateId}`);
    for (const result of block.results) {
      validateResult(result, entry, experimentIdentity);
      replayedMoves += replay(inputs.startState, entry, result);
      rows.push(result);
    }
  }
  const terminalGames = rows.filter(({ winner }) => winner !== null).length;
  const timeouts = rows.reduce((sum, row) => sum + row.stats.timeouts, 0);
  if (rows.length !== 24 || terminalGames !== 24 || timeouts !== 0) throw new Error("P001 game integrity mismatch");
  const verification = { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    treeHash: inputs.tree.treeHash, startStateHash: inputs.startStateHash,
    candidates: inputs.entries.length, games: rows.length, terminalGames, replayedMoves, timeouts,
    partialResults: 0, sourceHashesMatch: true, replayHashesMatch: true,
    allRepliesVerificationHash: inputs.allRepliesVerification.verificationHash,
    verificationHash: hashValue({ treeHash: inputs.tree.treeHash, startStateHash: inputs.startStateHash,
      games: rows.length, terminalGames, replayedMoves,
      allRepliesVerificationHash: inputs.allRepliesVerification.verificationHash }) };
  atomicWriteJson(options.verification, verification);
  return { verification, rows };
}

function buildSummary(inputs, verification, rows) {
  const naturalRecommendations = Object.fromEntries(inputs.naturalBlock.results.map((result) =>
    [result.conditionId, result.continuationMoveKeys[0]]));
  const rankings = inputs.entries.map((entry) => {
    const selected = rows.filter(({ candidateId }) => candidateId === entry.candidateId);
    return { candidateId: entry.candidateId, thirdMove: entry.thirdMove, thirdMoveKey: entry.thirdMoveKey,
      stateHash: entry.stateHash, games: selected.length,
      southWins: selected.filter(({ winner }) => winner === 0).length,
      northWins: selected.filter(({ winner }) => winner === 1).length,
      draws: selected.filter(({ winner }) => winner === null).length,
      naturalRecommendationCount: Object.values(naturalRecommendations).filter((key) => key === entry.thirdMoveKey).length,
      outcomes: Object.fromEntries(selected.map(({ conditionId, winner, totalPlies, reason }) =>
        [conditionId, { winner, totalPlies, reason }])) };
  }).sort((left, right) => right.southWins - left.southWins
    || right.naturalRecommendationCount - left.naturalRecommendationCount
    || left.thirdMoveKey.localeCompare(right.thirdMoveKey));
  const leaderWins = rankings[0].southWins;
  for (const item of rankings) {
    item.checks = { relativeSupport: item.southWins === leaderWins,
      absoluteSupport: item.southWins >= 4 };
    item.status = Object.values(item.checks).every(Boolean) ? "conditional-candidate" : "screened-out";
  }
  const candidates = rankings.filter(({ status }) => status === "conditional-candidate");
  return { schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: candidates.length ? "conditional-candidate-found" : "no-conditional-candidate",
    scope: "all legal South third moves after South index 6/right and North index 5/right under six fixed AI conditions",
    caveat: "A candidate remains only for this exact two-ply state and requires all legal North fourth-reply testing.",
    fixedCriteria: FIXED_CRITERIA,
    position: { openingMoveKey: inputs.opening.moveKey, northReplyKey: NORTH_REPLY_KEY,
      startStateHash: inputs.startStateHash, features: stateFeatures(inputs.startState),
      southStaticBaoScore: AI.evaluateWithProfile(inputs.startState, 0, "bao") },
    naturalRecommendations, rankings, candidates: candidates.map(({ thirdMoveKey }) => thirdMoveKey),
    integrity: verification };
}

function moveLabel(move) { return `${move.index + 1}番穴・${move.direction === "left" ? "左" : "右"}`; }
function winnerName(value) { return value === 0 ? "South" : value === 1 ? "North" : "打切り"; }
function markdown(summary) {
  const ids = Object.keys(CONDITIONS);
  return ["# 条件付き局面P001 第3手比較", "", `生成日時: ${summary.generatedAt}`, "",
    `判定: \`${summary.status}\``, "",
    "対象系列はSouth 7番穴・右、North 6番穴・右。正確な2 ply局面からSouthの合法第3手4通りを固定し、6 AI条件で終局まで継続した。", "",
    `- 開始state hash: \`${summary.position.startStateHash}\``, `- South静的bao評価: ${summary.position.southStaticBaoScore}`,
    `- reserve: ${summary.position.features.reserve.join(" / ")}`, `- 前列石: ${summary.position.features.frontSeeds.join(" / ")}`,
    `- nyumba: ${summary.position.features.nyumbaSeeds.join(" / ")}`, "",
    "## 事前固定基準", "", "- South勝数が単独または同率首位", "- 6条件中4勝以上", "- 昇格には候補後の全合法North第4手固定試験が必要", "",
    "## 第3手順位", "", "| 順位 | South第3手 | South勝 | North勝 | 自然推奨条件数 | 判定 |", "| ---: | --- | ---: | ---: | ---: | --- |",
    ...summary.rankings.map((item, index) => `| ${index + 1} | ${moveLabel(item.thirdMove)} | ${item.southWins} | ${item.northWins} | ${item.naturalRecommendationCount}/6 | ${item.status} |`), "",
    "## 条件別勝者", "", `| South第3手 | ${ids.join(" | ")} |`, `| --- | ${ids.map(() => "---").join(" | ")} |`,
    ...summary.rankings.map((item) => `| ${moveLabel(item.thirdMove)} | ${ids.map((id) => winnerName(item.outcomes[id].winner)).join(" | ")} |`), "",
    "## 完全性", "", `- 対局: ${summary.integrity.games}`, `- 固定第3手を含むreplay検証手数: ${summary.integrity.replayedMoves}`,
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
  const experimentIdentity = identity(options, inputs);
  runGames(options, inputs, experimentIdentity);
  const { verification, rows } = verify(options, inputs, experimentIdentity);
  const summary = buildSummary(inputs, verification, rows);
  atomicWriteJson(options.summary, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ summary: options.summary, markdown: options.markdown,
    status: summary.status, candidates: summary.candidates,
    rankings: summary.rankings, integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { buildSummary, identity, loadInputs, markdown, parseArgs, replay };
