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
const SOURCE_FILE = "tools/experiments/run-joseki-forced-p002.js";
const STRATUM = "2-4/forced-capture";
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
  selection: "among sampled 2-4/forced-capture nodes where all six phase2 and three 192-iteration MCTS runs agree on one move, choose fewest legal moves then node ID",
  relativeSupport: "South win count is tied for or above every legal move",
  absoluteSupport: "South wins at least 4 of 6 continuation conditions",
  crossMethodSupport: "winning candidate equals the pre-existing phase2 and MCTS consensus move",
});

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    sample: "artifacts/joseki-study/corpus/mcts-sensitivity-sample.json",
    phase2: "artifacts/joseki-study/phase-4",
    phase2Verification: "artifacts/joseki-study/verified/phase-4-verification.json",
    mcts: "artifacts/joseki-study/robustness/mcts-sensitivity",
    mctsVerification: "artifacts/joseki-study/verified/mcts-sensitivity-verification.json",
    output: "artifacts/joseki-study/robustness/forced-p002",
    verification: "artifacts/joseki-study/verified/forced-p002-verification.json",
    summary: "artifacts/joseki-study/summaries/forced-p002-summary.json",
    markdown: "doc/joseki/FORCED_P002_RESULTS.md",
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--status") options.status = true;
    else {
      const value = argv[++index];
      if (key === "--tree") options.tree = value;
      else if (key === "--sample") options.sample = value;
      else if (key === "--phase2") options.phase2 = value;
      else if (key === "--phase2-verification") options.phase2Verification = value;
      else if (key === "--mcts") options.mcts = value;
      else if (key === "--mcts-verification") options.mctsVerification = value;
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

function unanimous(values) { return values.length > 0 && new Set(values).size === 1 ? values[0] : null; }

function selectNode(tree, sample, phase2Directory, mctsDirectory) {
  const treeById = new Map(tree.nodes.map((node) => [node.nodeId, node]));
  const eligible = sample.nodes.filter(({ stratum }) => stratum === STRATUM).flatMap((sampleNode) => {
    const node = treeById.get(sampleNode.nodeId);
    const phase2 = JSON.parse(fs.readFileSync(path.join(phase2Directory, "nodes", `${sampleNode.nodeId}.json`), "utf8"));
    const mcts = JSON.parse(fs.readFileSync(path.join(mctsDirectory, "nodes", `${sampleNode.nodeId}.json`), "utf8"));
    const phase2Move = unanimous(phase2.results.map(({ recommendedMoveKey }) => recommendedMoveKey));
    const mcts192 = mcts.results.filter(({ conditionId }) => conditionId.startsWith("mcts-i192-"));
    const mctsMove = unanimous(mcts192.map(({ recommendedMoveKey }) => recommendedMoveKey));
    if (!node || phase2.stateHash !== node.stateHash || mcts.stateHash !== node.stateHash
      || mcts192.length !== 3 || !phase2Move || phase2Move !== mctsMove) return [];
    return [{ node, sampleNode, phase2, mcts, consensusMoveKey: phase2Move }];
  }).sort((left, right) => left.sampleNode.legalMoveCount - right.sampleNode.legalMoveCount
    || left.node.nodeId.localeCompare(right.node.nodeId));
  if (!eligible.length) throw new Error("No cross-method consensus node in target stratum");
  return { selected: eligible[0], eligible };
}

function loadInputs(options) {
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  const sample = JSON.parse(fs.readFileSync(options.sample, "utf8"));
  const phase2Verification = JSON.parse(fs.readFileSync(options.phase2Verification, "utf8"));
  const mctsVerification = JSON.parse(fs.readFileSync(options.mctsVerification, "utf8"));
  validateTree(tree);
  if (sample.treeHash !== tree.treeHash || !phase2Verification.passed || !mctsVerification.passed
    || phase2Verification.treeHash !== tree.treeHash || mctsVerification.treeHash !== tree.treeHash
    || mctsVerification.sampleHash !== sample.sampleHash) throw new Error("P002 input integrity mismatch");
  const selection = selectNode(tree, sample, options.phase2, options.mcts);
  const { node } = selection.selected;
  const entries = E.moveVariants(node.state).map((fixedMove, index) => {
    const fixedMoveKey = moveKey(fixedMove);
    const state = E.applyMove(node.state, fixedMove).state;
    return { candidateId: `move-${String(index + 1).padStart(2, "0")}-${hashValue(fixedMoveKey).slice(0, 12)}`,
      fixedMove, fixedMoveKey, state, stateHash: hashValue(state) };
  });
  if (entries.length !== 2 || entries.some(({ fixedMove }) => fixedMove.type !== "capture")) {
    throw new Error("P002 must have exactly two forced capture moves");
  }
  return { tree, sample, phase2Verification, mctsVerification, selection, entries };
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
  const selected = inputs.selection.selected;
  return { schemaVersion: 1, experiment: "joseki-forced-capture-p002-fixed-moves",
    treeFile: options.tree, treeHash: inputs.tree.treeHash, sampleHash: inputs.sample.sampleHash,
    selectedNodeId: selected.node.nodeId, selectedStateHash: selected.node.stateHash,
    eligibleNodeIds: inputs.selection.eligible.map(({ node }) => node.nodeId),
    consensusMoveKey: selected.consensusMoveKey,
    candidateStateHashes: Object.fromEntries(inputs.entries.map(({ candidateId, stateHash }) => [candidateId, stateHash])),
    phase2VerificationHash: inputs.phase2Verification.verificationHash,
    mctsVerificationHash: inputs.mctsVerification.verificationHash,
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
  const seed = seedFrom(treeHash, entry.candidateId, conditionId, "forced-p002-v1");
  const random = seededRandom(seed);
  let state = E.clone(entry.state);
  const continuationMoveKeys = [];
  const totals = { moves: 0, nodes: 0, evaluations: 0, timeouts: 0, elapsedMoveMs: 0 };
  const started = process.hrtime.bigint();
  while (state.winner === null && 9 + continuationMoveKeys.length < MAX_TOTAL_PLIES) {
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
    candidateId: entry.candidateId, fixedMoveKey: entry.fixedMoveKey, candidateStateHash: entry.stateHash,
    winner: state.winner, reason: state.reason || (state.winner === null ? "max-turns" : ""),
    openingPlies: 9, continuationPlies: continuationMoveKeys.length,
    totalPlies: 9 + continuationMoveKeys.length, continuationMoveKeys,
    continuationHash: hashValue(continuationMoveKeys), finalState: state, finalStateHash: hashValue(state),
    stats: { ...totals, elapsedMs: Number(process.hrtime.bigint() - started) / 1e6 } };
}

function validateResult(result, entry, experimentIdentity) {
  if (result.candidateId !== entry.candidateId || result.fixedMoveKey !== entry.fixedMoveKey
    || result.candidateStateHash !== entry.stateHash
    || result.conditionConfigHash !== experimentIdentity.conditionHashes[result.conditionId]
    || result.continuationHash !== hashValue(result.continuationMoveKeys)
    || result.finalStateHash !== hashValue(result.finalState) || result.stats.timeouts !== 0) {
    throw new Error(`Result integrity mismatch: ${entry.candidateId}/${result.conditionId}`);
  }
}

function replay(startState, entry, result) {
  let state = E.clone(startState);
  const fixed = E.moveVariants(state).find((move) => moveKey(move) === entry.fixedMoveKey);
  if (!fixed) throw new Error(`Illegal P002 fixed move: ${entry.fixedMoveKey}`);
  state = E.applyMove(state, fixed).state;
  if (hashValue(state) !== entry.stateHash) throw new Error(`P002 fixed state mismatch: ${entry.candidateId}`);
  for (const key of result.continuationMoveKeys) {
    const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === key);
    if (!move) throw new Error(`Illegal replay move: ${entry.candidateId}/${result.conditionId}/${key}`);
    state = E.applyMove(state, move).state;
  }
  if (stableStringify(state) !== stableStringify(result.finalState) || hashValue(state) !== result.finalStateHash
    || state.winner !== result.winner || result.totalPlies !== 9 + result.continuationMoveKeys.length) {
    throw new Error(`Replay mismatch: ${entry.candidateId}/${result.conditionId}`);
  }
  return 1 + result.continuationMoveKeys.length;
}

function counts(output, entries) {
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
  const currentCounts = counts(options.output, entries);
  const expectedGames = entries.length * Object.keys(CONDITIONS).length;
  const elapsedSeconds = (Date.now() - Date.parse(startedAt)) / 1000;
  atomicWriteJson(path.join(options.output, "progress.json"), { schemaVersion: 1, status, startedAt,
    updatedAt: new Date().toISOString(), identity: experimentIdentity,
    expected: { candidates: entries.length, conditions: Object.keys(CONDITIONS).length, games: expectedGames },
    ...currentCounts, elapsedSeconds,
    etaSeconds: currentCounts.recordedGames ? elapsedSeconds / currentCounts.recordedGames * (expectedGames - currentCounts.recordedGames) : null,
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
      fixedMoveKey: entry.fixedMoveKey, candidateStateHash: entry.stateHash,
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
      replayedMoves += replay(inputs.selection.selected.node.state, entry, result);
      rows.push(result);
    }
  }
  const terminalGames = rows.filter(({ winner }) => winner !== null).length;
  const timeouts = rows.reduce((sum, row) => sum + row.stats.timeouts, 0);
  if (rows.length !== 12 || terminalGames !== 12 || timeouts !== 0) throw new Error("P002 game integrity mismatch");
  const verification = { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    treeHash: inputs.tree.treeHash, sampleHash: inputs.sample.sampleHash,
    selectedNodeId: inputs.selection.selected.node.nodeId,
    selectedStateHash: inputs.selection.selected.node.stateHash,
    candidates: inputs.entries.length, games: rows.length, terminalGames, replayedMoves, timeouts,
    partialResults: 0, sourceHashesMatch: true, replayHashesMatch: true,
    phase2VerificationHash: inputs.phase2Verification.verificationHash,
    mctsVerificationHash: inputs.mctsVerification.verificationHash,
    verificationHash: hashValue({ treeHash: inputs.tree.treeHash,
      selectedStateHash: inputs.selection.selected.node.stateHash,
      games: rows.length, terminalGames, replayedMoves,
      phase2VerificationHash: inputs.phase2Verification.verificationHash,
      mctsVerificationHash: inputs.mctsVerification.verificationHash }) };
  atomicWriteJson(options.verification, verification);
  return { verification, rows };
}

function buildSummary(inputs, verification, rows) {
  const selected = inputs.selection.selected;
  const phase2Scores = Object.fromEntries(selected.phase2.results.map((result) =>
    [result.conditionId, { recommendedMoveKey: result.recommendedMoveKey, southSearchScore: result.southSearchScore }]));
  const mcts192 = selected.mcts.results.filter(({ conditionId }) => conditionId.startsWith("mcts-i192-")).map((result) => ({
    conditionId: result.conditionId, recommendedMoveKey: result.recommendedMoveKey,
    root: result.stats.mctsRoot }));
  const rankings = inputs.entries.map((entry) => {
    const selectedRows = rows.filter(({ candidateId }) => candidateId === entry.candidateId);
    return { candidateId: entry.candidateId, move: entry.fixedMove, moveKey: entry.fixedMoveKey,
      stateHash: entry.stateHash, games: selectedRows.length,
      southWins: selectedRows.filter(({ winner }) => winner === 0).length,
      northWins: selectedRows.filter(({ winner }) => winner === 1).length,
      draws: selectedRows.filter(({ winner }) => winner === null).length,
      isConsensusMove: entry.fixedMoveKey === selected.consensusMoveKey,
      outcomes: Object.fromEntries(selectedRows.map(({ conditionId, winner, totalPlies, reason }) =>
        [conditionId, { winner, totalPlies, reason }])) };
  }).sort((left, right) => right.southWins - left.southWins
    || Number(right.isConsensusMove) - Number(left.isConsensusMove));
  const bestWins = rankings[0].southWins;
  for (const item of rankings) {
    item.checks = { relativeSupport: item.southWins === bestWins, absoluteSupport: item.southWins >= 4,
      crossMethodSupport: item.isConsensusMove };
    item.status = Object.values(item.checks).every(Boolean) ? "conditional-candidate" : "screened-out";
  }
  const candidates = rankings.filter(({ status }) => status === "conditional-candidate");
  return { schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: candidates.length ? "conditional-candidate-found" : "no-conditional-candidate",
    scope: "two forced capture choices at the deterministically selected low-branching 8-ply position",
    caveat: "P002 applies only to this exact state; a candidate still requires fixed testing of every legal opponent reply.",
    fixedCriteria: FIXED_CRITERIA,
    selection: { stratum: STRATUM, eligibleNodeIds: inputs.selection.eligible.map(({ node }) => node.nodeId),
      selectedNodeId: selected.node.nodeId, selectedStateHash: selected.node.stateHash,
      legalMoveCount: selected.sampleNode.legalMoveCount, consensusMoveKey: selected.consensusMoveKey },
    position: { moveKeys: selected.node.moveKeys, state: selected.node.state,
      features: stateFeatures(selected.node.state), southStaticBaoScore: AI.evaluateWithProfile(selected.node.state, 0, "bao") },
    phase2Scores, mcts192, rankings,
    candidates: candidates.map(({ moveKey: key }) => key), integrity: verification };
}

function moveLabel(move) { return `${move.index + 1}番穴・direction ${move.direction}・side ${move.side}`; }
function winnerName(value) { return value === 0 ? "South" : value === 1 ? "North" : "打切り"; }
function markdown(summary) {
  const ids = Object.keys(CONDITIONS);
  return ["# 強制捕獲局面P002 固定継続比較", "", `生成日時: ${summary.generatedAt}`, "",
    `判定: \`${summary.status}\``, "",
    "MCTS感度試験の2〜4手・強制捕獲層から、phase2全6条件と192 iteration MCTS全3 seedが同じ手を選ぶ局面を抽出し、合法手最少・node ID順で代表を固定した。", "",
    `- node: \`${summary.selection.selectedNodeId}\``, `- state hash: \`${summary.selection.selectedStateHash}\``,
    `- 合法手: ${summary.selection.legalMoveCount}（全手capture）`, `- consensus: \`${summary.selection.consensusMoveKey}\``,
    `- South静的bao評価: ${summary.position.southStaticBaoScore}`, "",
    "## 事前固定基準", "", "- 6条件のSouth勝数が単独または同率首位", "- 4/6勝以上",
    "- 首位手が既存phase2・MCTS consensusと同じ", "- 昇格には候補後の全合法相手応手固定試験が必要", "",
    "## 結果", "", "| 順位 | 捕獲手 | South勝 | North勝 | consensus | 判定 |", "| ---: | --- | ---: | ---: | --- | --- |",
    ...summary.rankings.map((item, index) => `| ${index + 1} | ${moveLabel(item.move)} | ${item.southWins} | ${item.northWins} | ${item.isConsensusMove ? "yes" : "no"} | ${item.status} |`), "",
    "## 条件別勝者", "", `| 捕獲手 | ${ids.join(" | ")} |`, `| --- | ${ids.map(() => "---").join(" | ")} |`,
    ...summary.rankings.map((item) => `| ${moveLabel(item.move)} | ${ids.map((id) => winnerName(item.outcomes[id].winner)).join(" | ")} |`), "",
    "## 完全性", "", `- 対局: ${summary.integrity.games}`, `- 固定捕獲手を含むreplay検証手数: ${summary.integrity.replayedMoves}`,
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
    selection: summary.selection, rankings: summary.rankings, integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { buildSummary, identity, loadInputs, markdown, parseArgs, replay, selectNode, unanimous };
