#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  AI, E, atomicWriteJson, hashValue, moveKey, stateFeatures,
} = require("./lib/joseki-common.js");
const { seedFrom, seededRandom } = require("./paired-first-player-common.js");
const {
  eventSummary, firstNegativeTransition, largestDrops,
  permanentNegativeTransition, signFlips,
} = require("./analyze-joseki-c0-loss.js");

function parseArgs(argv) {
  const options = {
    input: "artifacts/joseki-study/summaries/forced-p002-summary.json",
    blocks: "artifacts/joseki-study/robustness/forced-p002/blocks",
    output: "artifacts/joseki-study/summaries/p002-reversal-analysis.json",
    markdown: "doc/joseki/P002_REVERSAL_ANALYSIS.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--input") options.input = value;
    else if (key === "--blocks") options.blocks = value;
    else if (key === "--output") options.output = value;
    else if (key === "--markdown") options.markdown = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function loadInputs(options) {
  const study = JSON.parse(fs.readFileSync(options.input, "utf8"));
  const candidates = study.rankings.map((ranking) => {
    const file = path.join(options.blocks, `${ranking.candidateId}.json`);
    const block = JSON.parse(fs.readFileSync(file, "utf8"));
    if (block.fixedMoveKey !== ranking.moveKey) throw new Error(`Move mismatch: ${file}`);
    return { ranking, block, file };
  });
  return { study, candidates };
}

function applyFixedMove(state, fixedMoveKey) {
  const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === fixedMoveKey);
  if (!move) throw new Error(`Illegal P002 fixed move: ${fixedMoveKey}`);
  const applied = E.applyMove(state, move);
  return {
    state: applied.state,
    incoming: { moveKey: fixedMoveKey, player: state.player, ...eventSummary(applied.events) },
  };
}

function standardizedSearch(state, analysisId, ply) {
  if (state.winner !== null) return null;
  const seed = seedFrom("p002-reversal-v1", analysisId, ply);
  const analysis = AI.analyzeMove(state, "hard", seededRandom(seed), {
    searchProfile: "phase2", evaluationProfile: "bao", maxDepth: 2, timeLimitMs: Infinity,
  });
  return {
    southScore: analysis.stats.rootScore === null ? null
      : analysis.stats.rootScore * (state.player === 0 ? 1 : -1),
    recommendedMoveKey: analysis.move ? moveKey(analysis.move) : null,
    nodes: analysis.stats.nodes,
  };
}

function traceGame(startState, fixedIncoming, result) {
  let state = E.clone(startState);
  const trace = [];
  let incoming = fixedIncoming;
  const analysisId = `${result.candidateId}:${result.conditionId}`;
  for (let index = 0; index <= result.continuationMoveKeys.length; index += 1) {
    const ply = result.openingPlies + index;
    const breakdown = AI.evaluationBreakdown(state, 0, { evaluationProfile: "bao" });
    trace.push({
      ply, stateHash: hashValue(state), player: state.player, phase: state.phase,
      winner: state.winner, reason: state.reason, incoming,
      southStaticScore: breakdown.total, evaluationCategory: breakdown.category,
      evaluationFeatures: breakdown.features, evaluationContributions: breakdown.contributions,
      features: stateFeatures(state), search: standardizedSearch(state, analysisId, ply),
    });
    if (index === result.continuationMoveKeys.length) break;
    const key = result.continuationMoveKeys[index];
    const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === key);
    if (!move) throw new Error(`Illegal P002 trace move at ply ${ply + 1}: ${key}`);
    const applied = E.applyMove(state, move);
    incoming = { moveKey: key, player: state.player, ...eventSummary(applied.events) };
    state = applied.state;
  }
  if (hashValue(state) !== result.finalStateHash) {
    throw new Error(`P002 final state replay mismatch: ${analysisId}`);
  }
  return trace;
}

function traceSummary(result, trace) {
  const searchSelector = (item) => item.search?.southScore ?? null;
  const staticSelector = (item) => item.southStaticScore;
  return {
    conditionId: result.conditionId,
    winner: result.winner,
    totalPlies: result.totalPlies,
    firstReplyMoveKey: result.continuationMoveKeys[0] || null,
    initial: {
      search: searchSelector(trace[0]), static: staticSelector(trace[0]),
      northLegalMoves: trace[0].features.legalMoves[1],
      northCaptureMoves: trace[0].features.captureMoves[1],
    },
    searchReversal: firstNegativeTransition(trace, searchSelector),
    staticReversal: firstNegativeTransition(trace, staticSelector),
    permanentSearchReversal: permanentNegativeTransition(trace, searchSelector),
    permanentStaticReversal: permanentNegativeTransition(trace, staticSelector),
    signFlips: { search: signFlips(trace, searchSelector), static: signFlips(trace, staticSelector) },
    largestSearchDrops: largestDrops(trace, searchSelector, 3),
    largestStaticDrops: largestDrops(trace, staticSelector, 3),
    positions: trace.length,
    traceHash: hashValue(trace),
  };
}

function immediateComparison(candidateSummaries, consensusMoveKey) {
  const consensus = candidateSummaries.find(({ moveKey: key }) => key === consensusMoveKey);
  const alternative = candidateSummaries.find(({ moveKey: key }) => key !== consensusMoveKey);
  if (!consensus || !alternative) throw new Error("P002 comparison requires one consensus and one alternative");
  const left = alternative.immediateBreakdown;
  const right = consensus.immediateBreakdown;
  const featureNames = [...new Set([...Object.keys(left.features), ...Object.keys(right.features)])];
  return {
    convention: "delta is alternative minus consensus; negative values favor the consensus move",
    staticScore: {
      alternative: left.total, consensus: right.total, delta: left.total - right.total,
    },
    legacyScore: {
      alternative: left.legacy, consensus: right.legacy, delta: left.legacy - right.legacy,
    },
    contributionDeltas: featureNames.map((feature) => ({
      feature,
      alternativeValue: left.features[feature] ?? 0,
      consensusValue: right.features[feature] ?? 0,
      alternativeContribution: left.contributions[feature] ?? 0,
      consensusContribution: right.contributions[feature] ?? 0,
      delta: (left.contributions[feature] ?? 0) - (right.contributions[feature] ?? 0),
    })).filter(({ delta }) => delta !== 0)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.feature.localeCompare(b.feature)),
  };
}

function buildSummary(study, candidates) {
  let replayedPositions = 0;
  const candidateSummaries = candidates.map(({ ranking, block }) => {
    const fixed = applyFixedMove(study.position.state, ranking.moveKey);
    if (hashValue(fixed.state) !== ranking.stateHash || hashValue(fixed.state) !== block.candidateStateHash) {
      throw new Error(`P002 fixed state mismatch: ${ranking.candidateId}`);
    }
    const traces = block.results.map((result) => {
      const trace = traceGame(fixed.state, fixed.incoming, result);
      replayedPositions += trace.length;
      return traceSummary(result, trace);
    });
    return {
      candidateId: ranking.candidateId,
      moveKey: ranking.moveKey,
      isConsensusMove: ranking.isConsensusMove,
      southWins: ranking.southWins,
      immediateStateHash: hashValue(fixed.state),
      immediateBreakdown: AI.evaluationBreakdown(fixed.state, 0, { evaluationProfile: "bao" }),
      traces,
    };
  });
  const comparison = immediateComparison(candidateSummaries, study.selection.consensusMoveKey);
  const conditionIds = candidateSummaries[0].traces.map(({ conditionId }) => conditionId);
  const pairs = conditionIds.map((conditionId) => {
    const traces = candidateSummaries.map((candidate) => ({
      moveKey: candidate.moveKey,
      isConsensusMove: candidate.isConsensusMove,
      ...candidate.traces.find((trace) => trace.conditionId === conditionId),
    }));
    return { conditionId, traces };
  });
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    scope: "all 12 P002 continuations re-evaluated at every position with a common bao depth-2 search",
    caveat: "Turning points and feature deltas diagnose evaluator behavior; they do not prove a unique causal move or general playing strength.",
    selectedNodeId: study.selection.selectedNodeId,
    selectedStateHash: study.selection.selectedStateHash,
    consensusMoveKey: study.selection.consensusMoveKey,
    standardizedAnalysis: { searchProfile: "phase2", evaluationProfile: "bao", maxDepth: 2 },
    immediateComparison: comparison,
    pairs,
    candidates: candidateSummaries,
    integrity: {
      games: pairs.length * candidateSummaries.length,
      replayedPositions,
      allFinalStatesMatch: true,
      summaryHash: hashValue({ comparison, pairs: pairs.map(({ conditionId, traces }) => ({
        conditionId,
        traces: traces.map(({ moveKey: key, winner, traceHash }) => ({ moveKey: key, winner, traceHash })),
      })) }),
    },
  };
}

function score(value) { return value === null || value === undefined ? "n/a" : String(value); }
function ply(item) { return item ? String(item.ply) : "なし"; }

function markdown(summary) {
  const immediate = summary.immediateComparison;
  const consensus = summary.candidates.find(({ isConsensusMove }) => isConsensusMove);
  const alternative = summary.candidates.find(({ isConsensusMove }) => !isConsensusMove);
  const distinctReplies = (candidate) => new Set(candidate.traces.map(({ firstReplyMoveKey }) => firstReplyMoveKey)).size;
  const pairRows = summary.pairs.flatMap(({ conditionId, traces }) => traces
    .sort((a, b) => Number(b.isConsensusMove) - Number(a.isConsensusMove))
    .map((trace) => `| ${conditionId} | ${trace.isConsensusMove ? "consensus" : "alternative"} | ${trace.winner === 0 ? "South" : "North"} | ${score(trace.initial.search)} | ${score(trace.initial.static)} | ${ply(trace.searchReversal)} | ${ply(trace.permanentSearchReversal)} | ${trace.signFlips.search} |`));
  return [
    "# P002 評価反転trace比較", "", `生成日時: ${summary.generatedAt}`, "",
    "P002の両捕獲手について、6条件・12局の全保存局面を共通のbao深さ2で再評価した。以下は評価器の挙動を診断する相関的分析であり、単独の敗着や一般的な手の優劣を証明するものではない。", "",
    "## 固定手直後の差", "",
    `- alternative静的評価: ${immediate.staticScore.alternative}`,
    `- consensus静的評価: ${immediate.staticScore.consensus}`,
    `- alternative − consensus: ${immediate.staticScore.delta}`,
    `- legacy評価差: ${immediate.legacyScore.delta}`, "",
    "| 特徴 | alternative | consensus | 寄与差 |", "| --- | ---: | ---: | ---: |",
    ...immediate.contributionDeltas.slice(0, 8).map((item) => `| ${item.feature} | ${item.alternativeValue} | ${item.consensusValue} | ${item.delta} |`), "",
    "固定手直後、Northの合法応手はconsensus側が"
      + `${consensus.traces[0].initial.northLegalMoves}手、alternative側が${alternative.traces[0].initial.northLegalMoves}手だった。`
      + `保存継続で実際に選ばれた初回応手は、それぞれ${distinctReplies(consensus)}種類、${distinctReplies(alternative)}種類である。`, "",
    "## 条件別trace", "",
    "| 条件 | 固定手 | 勝者 | 初期探索値 | 初期静的値 | 最初の探索負転 | 恒久探索負転 | 符号反転 |",
    "| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |", ...pairRows, "",
    "## 解釈", "",
    "- consensus手直後は盤上石・前列石・前列安全性などの短期特徴が高く、静的bao評価で大きく先行する。phase2とMCTSの一致はこの局面形の差と整合する。",
    "- alternative手は直後評価では劣るが、6継続中5勝した。したがって直後の形の優位は、相手応手後の長期的な終局結果を十分に代理していない。",
    "- consensus敗戦3局で探索値が恒久的に負となるのは43/49 plyと遅い。alternative勝戦は11 plyで一度負転しても後に回復する。短期の符号や最初の反転だけでも終局を分類できない。",
    "- consensus側はNorth応手が1手に強制されるが、それでも条件により勝敗が分かれた。原因を単一plyへ還元するより、捕獲後の前列安全性と長い強制応手列を次の特徴候補として扱う。",
    "- この分析を根拠にalternative手を定石へ昇格しない。P002の事前cross-method基準を満たしていないためである。", "",
    "## 完全性", "",
    `- 対局trace: ${summary.integrity.games}`,
    `- 再評価局面: ${summary.integrity.replayedPositions}`,
    `- 全終局state一致: ${summary.integrity.allFinalStatesMatch ? "yes" : "no"}`,
    `- summary hash: \`${summary.integrity.summaryHash}\``, "",
  ].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const { study, candidates } = loadInputs(options);
  const summary = buildSummary(study, candidates);
  atomicWriteJson(options.output, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({
    output: options.output,
    markdown: options.markdown,
    immediateComparison: summary.immediateComparison,
    pairs: summary.pairs.map(({ conditionId, traces }) => ({ conditionId, traces: traces.map((trace) => ({
      consensus: trace.isConsensusMove, winner: trace.winner,
      initialSearch: trace.initial.search, searchReversal: trace.searchReversal?.ply ?? null,
      permanentSearchReversal: trace.permanentSearchReversal?.ply ?? null,
    })) })),
    integrity: summary.integrity,
  }, null, 2));
}

if (require.main === module) main();
module.exports = {
  applyFixedMove, buildSummary, immediateComparison, loadInputs, markdown, parseArgs,
  standardizedSearch, traceGame, traceSummary,
};
