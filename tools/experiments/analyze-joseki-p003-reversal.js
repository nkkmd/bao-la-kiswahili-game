#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { AI, E, atomicWriteJson, hashValue, moveKey, stateFeatures } = require("./lib/joseki-common.js");
const { seedFrom, seededRandom } = require("./paired-first-player-common.js");
const { eventSummary, firstNegativeTransition, largestDrops,
  permanentNegativeTransition, signFlips } = require("./analyze-joseki-c0-loss.js");

function parseArgs(argv) {
  const options = {
    input: "artifacts/joseki-study/summaries/forced-p003-summary.json",
    blocks: "artifacts/joseki-study/robustness/forced-p003/blocks",
    output: "artifacts/joseki-study/summaries/p003-reversal-analysis.json",
    markdown: "doc/joseki/P003_REVERSAL_ANALYSIS.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const field = ({ "--input": "input", "--blocks": "blocks",
      "--output": "output", "--markdown": "markdown" })[argv[index]];
    if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
    options[field] = argv[index + 1];
  }
  return options;
}

function loadInputs(options) {
  const study = JSON.parse(fs.readFileSync(options.input, "utf8"));
  const selected = [study.rankings[0], study.rankings.find(({ isConsensusMove }) => isConsensusMove)];
  if (!selected[0] || !selected[1] || selected[0].isConsensusMove) {
    throw new Error("P003 requires a non-consensus terminal winner and a consensus comparator");
  }
  const candidates = selected.map((ranking) => {
    const file = path.join(options.blocks, `${ranking.candidateId}.json`);
    const block = JSON.parse(fs.readFileSync(file, "utf8"));
    if (block.fixedMoveKey !== ranking.moveKey) throw new Error(`P003 move mismatch: ${file}`);
    return { ranking, block };
  });
  return { study, candidates };
}

function applyFixedMove(state, fixedMoveKey) {
  const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === fixedMoveKey);
  if (!move) throw new Error(`Illegal P003 fixed move: ${fixedMoveKey}`);
  const applied = E.applyMove(state, move);
  return { state: applied.state,
    incoming: { moveKey: fixedMoveKey, player: state.player, ...eventSummary(applied.events) } };
}

function standardizedSearch(state, analysisId, ply) {
  if (state.winner !== null) return null;
  const analysis = AI.analyzeMove(state, "hard",
    seededRandom(seedFrom("p003-reversal-v1", analysisId, ply)), {
      searchProfile: "phase2", evaluationProfile: "bao", maxDepth: 2, timeLimitMs: Infinity,
    });
  return { southScore: analysis.stats.rootScore === null ? null
    : analysis.stats.rootScore * (state.player === 0 ? 1 : -1),
  recommendedMoveKey: analysis.move ? moveKey(analysis.move) : null, nodes: analysis.stats.nodes };
}

function traceGame(startState, fixedIncoming, result) {
  let state = E.clone(startState);
  let incoming = fixedIncoming;
  const trace = [];
  const analysisId = `${result.candidateId}:${result.conditionId}`;
  for (let index = 0; index <= result.continuationMoveKeys.length; index += 1) {
    const ply = result.openingPlies + index;
    const breakdown = AI.evaluationBreakdown(state, 0, { evaluationProfile: "bao" });
    trace.push({ ply, stateHash: hashValue(state), player: state.player, phase: state.phase,
      winner: state.winner, incoming, southStaticScore: breakdown.total,
      evaluationFeatures: breakdown.features, evaluationContributions: breakdown.contributions,
      features: stateFeatures(state), search: standardizedSearch(state, analysisId, ply) });
    if (index === result.continuationMoveKeys.length) break;
    const key = result.continuationMoveKeys[index];
    const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === key);
    if (!move) throw new Error(`Illegal P003 trace move at ply ${ply + 1}: ${key}`);
    const applied = E.applyMove(state, move);
    incoming = { moveKey: key, player: state.player, ...eventSummary(applied.events) };
    state = applied.state;
  }
  if (hashValue(state) !== result.finalStateHash) throw new Error(`P003 trace final mismatch: ${analysisId}`);
  return trace;
}

function summarizeTrace(result, trace) {
  const search = (item) => item.search?.southScore ?? null;
  const stat = (item) => item.southStaticScore;
  return { conditionId: result.conditionId, winner: result.winner, totalPlies: result.totalPlies,
    firstReplyMoveKey: result.continuationMoveKeys[0] || null,
    initial: { search: search(trace[0]), static: stat(trace[0]),
      northLegalMoves: trace[0].features.legalMoves[1] },
    searchReversal: firstNegativeTransition(trace, search),
    staticReversal: firstNegativeTransition(trace, stat),
    permanentSearchReversal: permanentNegativeTransition(trace, search),
    permanentStaticReversal: permanentNegativeTransition(trace, stat),
    signFlips: { search: signFlips(trace, search), static: signFlips(trace, stat) },
    largestSearchDrops: largestDrops(trace, search, 3),
    largestStaticDrops: largestDrops(trace, stat, 3),
    positions: trace.length, traceHash: hashValue(trace) };
}

function featureComparison(best, consensus) {
  const left = best.immediateBreakdown; const right = consensus.immediateBreakdown;
  return { convention: "delta is terminal-best minus consensus",
    staticScore: { terminalBest: left.total, consensus: right.total, delta: left.total - right.total },
    legacyScore: { terminalBest: left.legacy, consensus: right.legacy, delta: left.legacy - right.legacy },
    contributionDeltas: [...new Set([...Object.keys(left.features), ...Object.keys(right.features)])]
      .map((feature) => ({ feature, terminalBestValue: left.features[feature] ?? 0,
        consensusValue: right.features[feature] ?? 0,
        delta: (left.contributions[feature] ?? 0) - (right.contributions[feature] ?? 0) }))
      .filter(({ delta }) => delta !== 0)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.feature.localeCompare(b.feature)) };
}

function buildSummary(study, candidates) {
  let replayedPositions = 0;
  const summaries = candidates.map(({ ranking, block }) => {
    const fixed = applyFixedMove(study.position.state, ranking.moveKey);
    if (hashValue(fixed.state) !== ranking.immediate.stateHash || hashValue(fixed.state) !== block.candidateStateHash) {
      throw new Error(`P003 fixed state mismatch: ${ranking.candidateId}`);
    }
    const traces = block.results.map((result) => {
      const trace = traceGame(fixed.state, fixed.incoming, result);
      replayedPositions += trace.length;
      return summarizeTrace(result, trace);
    });
    return { candidateId: ranking.candidateId, moveKey: ranking.moveKey,
      isConsensusMove: ranking.isConsensusMove, southWins: ranking.southWins,
      immediateBreakdown: AI.evaluationBreakdown(fixed.state, 0, { evaluationProfile: "bao" }), traces };
  });
  const best = summaries.find(({ isConsensusMove }) => !isConsensusMove);
  const consensus = summaries.find(({ isConsensusMove }) => isConsensusMove);
  const comparison = featureComparison(best, consensus);
  const pairs = best.traces.map(({ conditionId }) => ({ conditionId,
    traces: summaries.map((candidate) => ({ moveKey: candidate.moveKey,
      isConsensusMove: candidate.isConsensusMove,
      ...candidate.traces.find((trace) => trace.conditionId === conditionId) })) }));
  return { schemaVersion: 1, generatedAt: new Date().toISOString(),
    scope: "P003 terminal-best and cross-method-consensus captures across all six saved continuations, re-evaluated with common bao depth 2",
    caveat: "Turning points diagnose evaluator behavior and do not prove a unique causal move or general playing strength.",
    selectedNodeId: study.selection.selectedNodeId, selectedStateHash: study.selection.selectedStateHash,
    consensusMoveKey: study.selection.consensusMoveKey, terminalBestMoveKey: best.moveKey,
    standardizedAnalysis: { searchProfile: "phase2", evaluationProfile: "bao", maxDepth: 2 },
    immediateComparison: comparison, pairs, candidates: summaries,
    integrity: { games: 12, replayedPositions, allFinalStatesMatch: true,
      summaryHash: hashValue({ comparison, pairs: pairs.map(({ conditionId, traces }) => ({ conditionId,
        traces: traces.map(({ moveKey: key, winner, traceHash }) => ({ moveKey: key, winner, traceHash })) })) }) } };
}

function score(value) { return value === null || value === undefined ? "n/a" : String(value); }
function ply(item) { return item ? String(item.ply) : "なし"; }
function markdown(summary) {
  const rows = summary.pairs.flatMap(({ conditionId, traces }) => traces
    .sort((a, b) => Number(b.isConsensusMove) - Number(a.isConsensusMove))
    .map((trace) => `| ${conditionId} | ${trace.isConsensusMove ? "consensus" : "terminal-best"} | ${trace.winner === 0 ? "South" : "North"} | ${score(trace.initial.search)} | ${score(trace.initial.static)} | ${ply(trace.searchReversal)} | ${ply(trace.permanentSearchReversal)} |`));
  return ["# P003 評価反転trace比較", "", `生成日時: ${summary.generatedAt}`, "",
    "P003の終局首位手と探索合意手について、同じ6条件の保存局面を共通bao depth 2で再評価した。相関的な診断であり、単独の敗着を証明するものではない。", "",
    "## 固定手直後", "",
    `- terminal-best静的評価: ${summary.immediateComparison.staticScore.terminalBest}`,
    `- consensus静的評価: ${summary.immediateComparison.staticScore.consensus}`,
    `- terminal-best − consensus: ${summary.immediateComparison.staticScore.delta}`, "",
    "| 特徴 | terminal-best | consensus | 寄与差 |", "| --- | ---: | ---: | ---: |",
    ...summary.immediateComparison.contributionDeltas.map((item) => `| ${item.feature} | ${item.terminalBestValue} | ${item.consensusValue} | ${item.delta} |`), "",
    "## 条件別trace", "",
    "| 条件 | 固定手 | 勝者 | 初期探索値 | 初期静的値 | 最初の探索負転 | 恒久探索負転 |",
    "| --- | --- | --- | ---: | ---: | ---: | ---: |", ...rows, "",
    "## 完全性", "", `- trace: ${summary.integrity.games}`,
    `- 再評価局面: ${summary.integrity.replayedPositions}`,
    `- 全終局state一致: ${summary.integrity.allFinalStatesMatch ? "yes" : "no"}`,
    `- summary hash: \`${summary.integrity.summaryHash}\``, ""].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { study, candidates } = loadInputs(options);
  const summary = buildSummary(study, candidates);
  atomicWriteJson(options.output, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown,
    immediateComparison: summary.immediateComparison,
    pairs: summary.pairs.map(({ conditionId, traces }) => ({ conditionId, traces: traces.map((trace) => ({
      consensus: trace.isConsensusMove, winner: trace.winner, initialSearch: trace.initial.search,
      searchReversal: trace.searchReversal?.ply ?? null,
      permanentSearchReversal: trace.permanentSearchReversal?.ply ?? null })) })),
    integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { applyFixedMove, buildSummary, featureComparison, loadInputs, markdown,
  parseArgs, standardizedSearch, summarizeTrace, traceGame };
