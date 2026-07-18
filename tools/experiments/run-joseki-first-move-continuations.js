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
const SOURCE_FILE = "tools/experiments/run-joseki-first-move-continuations.js";
const CANDIDATE_MOVE_KEY = "takata:namua:0:5:left:::false";
const MAX_TOTAL_PLIES = 120;
const CONDITION_CONFIGS = Object.freeze({
  "bao-d1": { depth: 1, evaluation: "bao" },
  "bao-d2": { depth: 2, evaluation: "bao" },
  "bao-d3": { depth: 3, evaluation: "bao" },
  "bao-d4": { depth: 4, evaluation: "bao" },
  "legacy-d2": { depth: 2, evaluation: "legacy" },
  "bao-v2-d2": { depth: 2, evaluation: "bao-v2" },
});
const FIXED_CRITERIA = Object.freeze({
  relativeSupport: "candidate South-win count is tied for or above every alternative",
  absoluteSupport: "candidate wins at least 4 of 6 conditions",
});

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/tree.json",
    summary: "artifacts/joseki-study/summaries/phase-1-summary.json",
    output: "artifacts/joseki-study/robustness/first-move-continuations",
    verification: "artifacts/joseki-study/verified/first-move-continuations-verification.json",
    summaryOutput: "artifacts/joseki-study/summaries/first-move-continuations-summary.json",
    markdown: "doc/joseki/FIRST_MOVE_CONTINUATIONS.md",
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--status") options.status = true;
    else {
      const value = argv[++index];
      if (key === "--tree") options.tree = value;
      else if (key === "--summary") options.summary = value;
      else if (key === "--output") options.output = value;
      else if (key === "--verification") options.verification = value;
      else if (key === "--summary-output") options.summaryOutput = value;
      else if (key === "--markdown") options.markdown = value;
      else throw new Error(`Unknown argument: ${key}`);
    }
  }
  return options;
}

function sourceSha256() {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, SOURCE_FILE))).digest("hex");
}

function loadInputs(options) {
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  const phase1 = JSON.parse(fs.readFileSync(options.summary, "utf8"));
  validateTree(tree);
  if (!phase1.integrity.passed || phase1.integrity.treeHash !== tree.treeHash) {
    throw new Error("Phase 1 integrity mismatch");
  }
  const candidates = new Map(phase1.candidates.map((candidate) => [candidate.nodeId, candidate]));
  const entries = tree.nodes.filter(({ ply }) => ply === 1).map((node) => {
    const candidate = candidates.get(node.nodeId);
    if (!candidate || candidate.moveKey !== node.moveKeys[0]) throw new Error(`Candidate mismatch: ${node.nodeId}`);
    return {
      openingId: node.nodeId,
      nodeId: node.nodeId,
      move: candidate.move,
      moveKey: candidate.moveKey,
      baselineRank: candidate.baselineRank,
      baselineWorstReplyValue: candidate.worstReplyValue,
      stateHash: node.stateHash,
      state: node.state,
    };
  }).sort((left, right) => left.baselineRank - right.baselineRank);
  if (entries.length !== 4 || !entries.some(({ moveKey: key }) => key === CANDIDATE_MOVE_KEY)) {
    throw new Error("Expected four initial moves including C0");
  }
  return { tree, phase1, entries };
}

function identity(options, tree, entries) {
  const provenance = josekiProvenance();
  const configs = Object.fromEntries(Object.entries(CONDITION_CONFIGS).map(([conditionId, item]) => [conditionId, {
    conditionId, level: "hard", searchProfile: "phase2", evaluationProfile: item.evaluation,
    maxDepth: item.depth, timeLimitMs: "Infinity", maxTotalPlies: MAX_TOTAL_PLIES,
  }]));
  return {
    schemaVersion: 1,
    experiment: "joseki-all-first-move-continuation-selfplay",
    treeFile: options.tree,
    treeHash: tree.treeHash,
    openingStateHashes: Object.fromEntries(entries.map(({ openingId, stateHash }) => [openingId, stateHash])),
    conditionConfigs: configs,
    conditionHashes: Object.fromEntries(Object.entries(configs).map(([id, config]) => [id, hashValue(config)])),
    maxTotalPlies: MAX_TOTAL_PLIES,
    fixedCriteria: FIXED_CRITERIA,
    candidateMoveKey: CANDIDATE_MOVE_KEY,
    sourceCommit: provenance.sourceCommit,
    node: provenance.node,
    sourceFileSha256: sourceSha256(),
  };
}

function assertIdentity(expected, actual, label) {
  if (stableStringify(expected) !== stableStringify(actual)) throw new Error(`${label} identity mismatch`);
}

function blockPath(output, openingId) { return path.join(output, "blocks", `${openingId}.json`); }
function partialPath(output, openingId) { return path.join(output, "partials", `${openingId}.partial.json`); }

function play(entry, conditionId, config, treeHash) {
  const seed = seedFrom(treeHash, entry.openingId, conditionId, "first-move-continuation-v1");
  const random = seededRandom(seed);
  let state = E.clone(entry.state);
  const continuationMoveKeys = [];
  const stats = { moves: 0, nodes: 0, evaluations: 0, timeouts: 0, elapsedMoveMs: 0 };
  const started = process.hrtime.bigint();
  while (state.winner === null && 1 + continuationMoveKeys.length < MAX_TOTAL_PLIES) {
    const analysis = AI.analyzeMove(state, config.level, random, {
      searchProfile: config.searchProfile,
      evaluationProfile: config.evaluationProfile,
      maxDepth: config.maxDepth,
      timeLimitMs: Infinity,
    });
    if (!analysis.move) break;
    continuationMoveKeys.push(moveKey(analysis.move));
    stats.moves += 1;
    stats.nodes += analysis.stats.nodes || 0;
    stats.evaluations += analysis.stats.evaluations || 0;
    stats.elapsedMoveMs += analysis.stats.elapsedMs || 0;
    if (analysis.stats.timedOut) stats.timeouts += 1;
    state = E.applyMove(state, analysis.move).state;
  }
  return {
    conditionId, conditionConfig: config, conditionConfigHash: hashValue(config), seed,
    openingId: entry.openingId, openingStateHash: entry.stateHash,
    winner: state.winner, reason: state.reason || (state.winner === null ? "max-turns" : ""),
    openingPlies: 1, continuationPlies: continuationMoveKeys.length,
    totalPlies: 1 + continuationMoveKeys.length, continuationMoveKeys,
    continuationHash: hashValue(continuationMoveKeys), finalState: state, finalStateHash: hashValue(state),
    stats: { ...stats, elapsedMs: Number(process.hrtime.bigint() - started) / 1e6 },
  };
}

function validateResult(result, entry, experimentIdentity) {
  if (result.openingId !== entry.openingId || result.openingStateHash !== entry.stateHash
    || result.conditionConfigHash !== experimentIdentity.conditionHashes[result.conditionId]
    || result.continuationHash !== hashValue(result.continuationMoveKeys)
    || result.finalStateHash !== hashValue(result.finalState) || result.stats.timeouts !== 0) {
    throw new Error(`Result integrity mismatch: ${entry.openingId}/${result.conditionId}`);
  }
}

function replay(entry, result) {
  let state = E.clone(entry.state);
  for (const key of result.continuationMoveKeys) {
    const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === key);
    if (!move) throw new Error(`Illegal replay move: ${entry.openingId}/${result.conditionId}/${key}`);
    state = E.applyMove(state, move).state;
  }
  if (stableStringify(state) !== stableStringify(result.finalState) || hashValue(state) !== result.finalStateHash
    || state.winner !== result.winner || 1 + result.continuationMoveKeys.length !== result.totalPlies) {
    throw new Error(`Replay mismatch: ${entry.openingId}/${result.conditionId}`);
  }
  return result.continuationMoveKeys.length;
}

function countProgress(output, entries) {
  let completedOpenings = 0;
  let completedGames = 0;
  let partialGames = 0;
  for (const entry of entries) {
    if (fs.existsSync(blockPath(output, entry.openingId))) {
      completedOpenings += 1;
      completedGames += JSON.parse(fs.readFileSync(blockPath(output, entry.openingId), "utf8")).results.length;
    } else if (fs.existsSync(partialPath(output, entry.openingId))) {
      partialGames += JSON.parse(fs.readFileSync(partialPath(output, entry.openingId), "utf8")).results.length;
    }
  }
  return { completedOpenings, completedGames, partialGames, recordedGames: completedGames + partialGames };
}

function writeProgress(options, entries, experimentIdentity, startedAt, status, current = null) {
  const counts = countProgress(options.output, entries);
  const elapsedSeconds = (Date.now() - Date.parse(startedAt)) / 1000;
  const games = entries.length * Object.keys(CONDITION_CONFIGS).length;
  atomicWriteJson(path.join(options.output, "progress.json"), {
    schemaVersion: 1, status, startedAt, updatedAt: new Date().toISOString(), identity: experimentIdentity,
    expected: { openings: entries.length, conditions: Object.keys(CONDITION_CONFIGS).length, games },
    ...counts, elapsedSeconds,
    etaSeconds: counts.recordedGames ? elapsedSeconds / counts.recordedGames * (games - counts.recordedGames) : null,
    current,
  });
}

function runGames(options, tree, entries, experimentIdentity) {
  fs.mkdirSync(options.output, { recursive: true });
  const progressFile = path.join(options.output, "progress.json");
  const previous = fs.existsSync(progressFile) ? JSON.parse(fs.readFileSync(progressFile, "utf8")) : null;
  if (previous) assertIdentity(experimentIdentity, previous.identity, "Progress");
  const startedAt = previous?.startedAt || new Date().toISOString();
  writeProgress(options, entries, experimentIdentity, startedAt, "running");
  for (const entry of entries) {
    const completeFile = blockPath(options.output, entry.openingId);
    const incompleteFile = partialPath(options.output, entry.openingId);
    if (fs.existsSync(completeFile)) continue;
    const partial = fs.existsSync(incompleteFile)
      ? JSON.parse(fs.readFileSync(incompleteFile, "utf8"))
      : { schemaVersion: 1, status: "partial", openingId: entry.openingId,
        openingStateHash: entry.stateHash, identity: experimentIdentity, results: [] };
    assertIdentity(experimentIdentity, partial.identity, `Partial ${entry.openingId}`);
    const done = new Set(partial.results.map(({ conditionId }) => conditionId));
    for (const [conditionId, config] of Object.entries(experimentIdentity.conditionConfigs)) {
      if (done.has(conditionId)) continue;
      writeProgress(options, entries, experimentIdentity, startedAt, "running", { openingId: entry.openingId, conditionId });
      partial.results.push(play(entry, conditionId, config, tree.treeHash));
      atomicWriteJson(incompleteFile, partial);
    }
    for (const result of partial.results) validateResult(result, entry, experimentIdentity);
    atomicWriteJson(completeFile, { ...partial, status: "complete", completedAt: new Date().toISOString() });
    fs.unlinkSync(incompleteFile);
  }
  writeProgress(options, entries, experimentIdentity, startedAt, "complete");
}

function verify(options, tree, entries, experimentIdentity) {
  const progress = JSON.parse(fs.readFileSync(path.join(options.output, "progress.json"), "utf8"));
  if (progress.status !== "complete") throw new Error(`Experiment is not complete: ${progress.status}`);
  assertIdentity(experimentIdentity, progress.identity, "Verification");
  if (sourceSha256() !== experimentIdentity.sourceFileSha256) throw new Error("Research source hash changed");
  let games = 0;
  let replayedMoves = 0;
  let timeouts = 0;
  const conditionCounts = Object.fromEntries(Object.keys(CONDITION_CONFIGS).map((id) => [id, 0]));
  const rows = [];
  for (const entry of entries) {
    const block = JSON.parse(fs.readFileSync(blockPath(options.output, entry.openingId), "utf8"));
    assertIdentity(experimentIdentity, block.identity, `Block ${entry.openingId}`);
    if (block.results.length !== Object.keys(CONDITION_CONFIGS).length) throw new Error(`Incomplete block: ${entry.openingId}`);
    for (const result of block.results) {
      validateResult(result, entry, experimentIdentity);
      replayedMoves += replay(entry, result);
      games += 1;
      timeouts += result.stats.timeouts;
      conditionCounts[result.conditionId] += 1;
      rows.push({ ...result, moveKey: entry.moveKey, baselineRank: entry.baselineRank });
    }
  }
  const verification = {
    schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    treeHash: tree.treeHash, openings: entries.length, games, replayedMoves, timeouts, conditionCounts,
    partialResults: 0, sourceHashesMatch: true, replayHashesMatch: true,
    verificationHash: hashValue({ treeHash: tree.treeHash, games, replayedMoves, conditionCounts }),
  };
  atomicWriteJson(options.verification, verification);
  return { verification, rows };
}

function buildSummary(verification, rows, entries) {
  const rankings = entries.map((entry) => {
    const selected = rows.filter(({ openingId }) => openingId === entry.openingId);
    return {
      openingId: entry.openingId, move: entry.move, moveKey: entry.moveKey,
      baselineRank: entry.baselineRank, baselineWorstReplyValue: entry.baselineWorstReplyValue,
      games: selected.length, southWins: selected.filter(({ winner }) => winner === 0).length,
      northWins: selected.filter(({ winner }) => winner === 1).length,
      draws: selected.filter(({ winner }) => winner === null).length,
      averageTotalPlies: selected.reduce((sum, row) => sum + row.totalPlies, 0) / selected.length,
      outcomes: Object.fromEntries(selected.map(({ conditionId, winner, totalPlies, reason }) =>
        [conditionId, { winner, totalPlies, reason }])),
    };
  }).sort((left, right) => right.southWins - left.southWins || left.baselineRank - right.baselineRank);
  const candidate = rankings.find(({ moveKey: key }) => key === CANDIDATE_MOVE_KEY);
  const pairwise = rankings.filter(({ moveKey: key }) => key !== CANDIDATE_MOVE_KEY).map((alternative) => {
    let candidateOnlyWins = 0;
    let alternativeOnlyWins = 0;
    for (const conditionId of Object.keys(CONDITION_CONFIGS)) {
      const candidateWins = candidate.outcomes[conditionId].winner === 0;
      const alternativeWins = alternative.outcomes[conditionId].winner === 0;
      if (candidateWins && !alternativeWins) candidateOnlyWins += 1;
      if (!candidateWins && alternativeWins) alternativeOnlyWins += 1;
    }
    return { alternativeMoveKey: alternative.moveKey, candidateOnlyWins, alternativeOnlyWins,
      net: candidateOnlyWins - alternativeOnlyWins };
  });
  const relativeSupport = rankings.every(({ southWins }) => candidate.southWins >= southWins);
  const absoluteSupport = candidate.southWins >= 4;
  return {
    schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: relativeSupport && absoluteSupport ? "supported" : relativeSupport ? "relative-only" : "not-supported",
    scope: "deterministic self-play from all four legal initial moves under six fixed AI conditions",
    caveat: "This is a deterministic engine comparison, not a statistical estimate of human win rate.",
    fixedCriteria: FIXED_CRITERIA, checks: { relativeSupport, absoluteSupport },
    candidateMoveKey: CANDIDATE_MOVE_KEY, candidate, rankings, pairwise, integrity: verification,
  };
}

function winnerName(winner) { return winner === 0 ? "South" : winner === 1 ? "North" : "打切り"; }
function moveLabel(move) { return `${move.index + 1}番穴・${move.direction === "left" ? "左" : "右"}`; }

function markdown(summary) {
  const conditionIds = Object.keys(CONDITION_CONFIGS);
  return [
    "# 全4初手 継続自己対局比較", "", `生成日時: ${summary.generatedAt}`, "",
    `判定: \`${summary.status}\``, "",
    "標準初期局面で合法な4初手をそれぞれ指した直後から、同一の6 AI条件を両側に適用し、最大120 plyまで継続した決定論的比較である。人間の勝率に対する統計推定ではない。", "",
    "## 事前固定基準", "",
    "- 相対支持: C0のSouth勝数が他の全初手以上（同率首位を含む）", "- 絶対支持: C0が6条件中4勝以上", "",
    "## 順位", "",
    "| 順位 | 初手 | Phase 1順位 | South勝 | North勝 | 打切り | 平均終局ply |", "| ---: | --- | ---: | ---: | ---: | ---: | ---: |",
    ...summary.rankings.map((item, index) => `| ${index + 1} | ${moveLabel(item.move)}${item.moveKey === CANDIDATE_MOVE_KEY ? " (C0)" : ""} | ${item.baselineRank} | ${item.southWins} | ${item.northWins} | ${item.draws} | ${item.averageTotalPlies.toFixed(1)} |`), "",
    "## 条件別勝者", "",
    `| 初手 | ${conditionIds.join(" | ")} |`, `| --- | ${conditionIds.map(() => "---").join(" | ")} |`,
    ...summary.rankings.map((item) => `| ${moveLabel(item.move)}${item.moveKey === CANDIDATE_MOVE_KEY ? " (C0)" : ""} | ${conditionIds.map((id) => winnerName(item.outcomes[id].winner)).join(" | ")} |`), "",
    "## C0の直接比較", "",
    "| 対案 | C0のみSouth勝 | 対案のみSouth勝 | 差 |", "| --- | ---: | ---: | ---: |",
    ...summary.pairwise.map((item) => `| \`${item.alternativeMoveKey}\` | ${item.candidateOnlyWins} | ${item.alternativeOnlyWins} | ${item.net} |`), "",
    "## 判定", "", `- 相対支持: ${summary.checks.relativeSupport ? "yes" : "no"}`, `- 絶対支持: ${summary.checks.absoluteSupport ? "yes" : "no"}`, "",
    "## 完全性", "", `- 対局: ${summary.integrity.games}`, `- replay検証手数: ${summary.integrity.replayedMoves}`,
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
  const { tree, entries } = loadInputs(options);
  const experimentIdentity = identity(options, tree, entries);
  runGames(options, tree, entries, experimentIdentity);
  const { verification, rows } = verify(options, tree, entries, experimentIdentity);
  const summary = buildSummary(verification, rows, entries);
  atomicWriteJson(options.summaryOutput, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ summaryOutput: options.summaryOutput, markdown: options.markdown,
    status: summary.status, checks: summary.checks, rankings: summary.rankings,
    pairwise: summary.pairwise, integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { buildSummary, identity, loadInputs, markdown, parseArgs, replay };
