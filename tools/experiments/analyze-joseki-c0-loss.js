#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  AI, E, atomicWriteJson, hashValue, moveKey, stateFeatures,
} = require("./lib/joseki-common.js");
const { seedFrom, seededRandom } = require("./paired-first-player-common.js");

const C0_NODE_ID = "p1-601242bbb060";
const CONDITION_ID = "bao-d2";

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/tree.json",
    block: `artifacts/joseki-study/robustness/first-move-continuations/blocks/${C0_NODE_ID}.json`,
    output: "artifacts/joseki-study/summaries/c0-loss-analysis.json",
    markdown: "doc/joseki/C0_LOSS_ANALYSIS.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--tree") options.tree = value;
    else if (key === "--block") options.block = value;
    else if (key === "--output") options.output = value;
    else if (key === "--markdown") options.markdown = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function eventSummary(events) {
  const captures = events.filter(({ kind }) => kind === "capture");
  return {
    captures: captures.length,
    capturedSeeds: captures.reduce((sum, { count }) => sum + count, 0),
    relays: events.filter(({ kind }) => kind === "relay").length,
    houseUsed: events.some(({ kind, state }, index) => index > 0
      && events[index - 1].state.houseOwned.some((owned, player) => owned && !state.houseOwned[player])),
    eventKinds: [...new Set(events.map(({ kind }) => kind))],
  };
}

function searchScore(state, ply, treeHash) {
  if (state.winner !== null) return null;
  const analysis = AI.analyzeMove(state, "hard", seededRandom(seedFrom(treeHash, C0_NODE_ID, CONDITION_ID, ply)), {
    searchProfile: "phase2", evaluationProfile: "bao", maxDepth: 2, timeLimitMs: Infinity,
  });
  return {
    southScore: analysis.stats.rootScore === null ? null
      : analysis.stats.rootScore * (state.player === 0 ? 1 : -1),
    recommendedMoveKey: analysis.move ? moveKey(analysis.move) : null,
    nodes: analysis.stats.nodes,
  };
}

function traceGame(tree, entry, result) {
  let state = E.clone(entry.state);
  const trace = [];
  let incoming = null;
  for (let index = 0; index <= result.continuationMoveKeys.length; index += 1) {
    const ply = 1 + index;
    const breakdown = AI.evaluationBreakdown(state, 0, { evaluationProfile: "bao" });
    trace.push({
      ply, stateHash: hashValue(state), player: state.player, phase: state.phase,
      winner: state.winner, reason: state.reason, incoming,
      southStaticScore: breakdown.total, evaluationCategory: breakdown.category,
      evaluationFeatures: breakdown.features, evaluationContributions: breakdown.contributions,
      features: stateFeatures(state), search: searchScore(state, ply, tree.treeHash),
    });
    if (index === result.continuationMoveKeys.length) break;
    const key = result.continuationMoveKeys[index];
    const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === key);
    if (!move) throw new Error(`Illegal trace move at ply ${ply + 1}: ${key}`);
    const applied = E.applyMove(state, move);
    incoming = { moveKey: key, player: state.player, ...eventSummary(applied.events) };
    state = applied.state;
  }
  if (hashValue(state) !== result.finalStateHash) throw new Error("C0 final state replay mismatch");
  return trace;
}

function firstNegativeTransition(trace, selector) {
  for (let index = 1; index < trace.length; index += 1) {
    const before = selector(trace[index - 1]);
    const after = selector(trace[index]);
    if (before !== null && after !== null && before >= 0 && after < 0) {
      return { ply: trace[index].ply, before, after, delta: after - before,
        incoming: trace[index].incoming, stateHash: trace[index].stateHash };
    }
  }
  return null;
}

function permanentNegativeTransition(trace, selector) {
  const scored = trace.map((item) => ({ item, value: selector(item) })).filter(({ value }) => value !== null);
  for (let index = 1; index < scored.length; index += 1) {
    if (scored[index - 1].value >= 0 && scored[index].value < 0
      && scored.slice(index).every(({ value }) => value < 0)) {
      return { ply: scored[index].item.ply, before: scored[index - 1].value,
        after: scored[index].value, delta: scored[index].value - scored[index - 1].value,
        incoming: scored[index].item.incoming, stateHash: scored[index].item.stateHash };
    }
  }
  return null;
}

function signFlips(trace, selector) {
  const values = trace.map(selector).filter((value) => value !== null && value !== 0);
  return values.slice(1).filter((value, index) => Math.sign(value) !== Math.sign(values[index])).length;
}

function largestDrops(trace, selector, limit = 5) {
  return trace.slice(1).map((item, index) => {
    const before = selector(trace[index]);
    const after = selector(item);
    return before === null || after === null ? null : {
      ply: item.ply, before, after, delta: after - before,
      incoming: item.incoming, stateHash: item.stateHash,
    };
  }).filter(Boolean).sort((left, right) => left.delta - right.delta).slice(0, limit);
}

function buildSummary(tree, entry, result) {
  const trace = traceGame(tree, entry, result);
  const searchSelector = (item) => item.search?.southScore ?? null;
  const staticSelector = (item) => item.southStaticScore;
  const searchReversal = firstNegativeTransition(trace, searchSelector);
  const staticReversal = firstNegativeTransition(trace, staticSelector);
  const permanentSearchReversal = permanentNegativeTransition(trace, searchSelector);
  const permanentStaticReversal = permanentNegativeTransition(trace, staticSelector);
  const reference = trace.find(({ ply }) => ply === permanentSearchReversal?.ply) || trace[0];
  const adverseContributions = Object.entries(reference.evaluationContributions)
    .map(([feature, contribution]) => ({ feature, contribution,
      value: reference.evaluationFeatures[feature] }))
    .sort((left, right) => left.contribution - right.contribution).slice(0, 6);
  return {
    schemaVersion: 1, generatedAt: new Date().toISOString(),
    scope: "C0 followed by deterministic bao-d2 self-play from ply 1 to terminal",
    caveat: "Score changes identify engine-evaluation turning points; they do not prove a unique causal blunder.",
    nodeId: entry.nodeId, openingMoveKey: entry.moveKey, conditionId: result.conditionId,
    outcome: { winner: result.winner, reason: result.reason, totalPlies: result.totalPlies,
      finalStateHash: result.finalStateHash },
    searchReversal, staticReversal, permanentSearchReversal, permanentStaticReversal,
    signFlips: { search: signFlips(trace, searchSelector), static: signFlips(trace, staticSelector) },
    largestSearchDrops: largestDrops(trace, searchSelector),
    largestStaticDrops: largestDrops(trace, staticSelector),
    adverseContributionsAtSearchReversal: adverseContributions,
    transitions: trace.slice(1).map(({ incoming }) => incoming),
    trace,
    integrity: { replayPassed: true, positions: trace.length,
      traceHash: hashValue(trace), finalStateHashMatches: true },
  };
}

function score(value) { return value === null ? "n/a" : String(value); }
function moveShort(key) { return `\`${key}\``; }

function markdown(summary) {
  const search = summary.searchReversal;
  const stat = summary.staticReversal;
  const permanentSearch = summary.permanentSearchReversal;
  const permanentStatic = summary.permanentStaticReversal;
  return [
    "# C0敗着系列の評価反転分析", "", `生成日時: ${summary.generatedAt}`, "",
    "C0（6番穴・左）後をbao-d2同士で終局まで継続し、各局面をSouth視点の深さ2探索値と静的評価値で再評価した。反転点は相関的な診断であり、単独の敗着を証明するものではない。", "",
    "## 結果", "", `- 終局: North勝、${summary.outcome.totalPlies} ply、${summary.outcome.reason}`,
    `- 探索値の最初の正→負反転: ${search ? `${search.ply} ply、${score(search.before)} → ${score(search.after)}（差 ${score(search.delta)}）` : "なし"}`,
    `- その着手: ${search ? moveShort(search.incoming.moveKey) : "n/a"}`,
    `- 静的評価の最初の正→負反転: ${stat ? `${stat.ply} ply、${score(stat.before)} → ${score(stat.after)}（差 ${score(stat.delta)}）` : "なし"}`,
    `- その着手: ${stat ? moveShort(stat.incoming.moveKey) : "n/a"}`, "",
    `- 探索値が以後負のままになる反転: ${permanentSearch ? `${permanentSearch.ply} ply、${score(permanentSearch.before)} → ${score(permanentSearch.after)}` : "なし"}`,
    `- その着手: ${permanentSearch ? moveShort(permanentSearch.incoming.moveKey) : "n/a"}`,
    `- 静的評価が以後負のままになる反転: ${permanentStatic ? `${permanentStatic.ply} ply、${score(permanentStatic.before)} → ${score(permanentStatic.after)}` : "なし"}`,
    `- 符号反転回数: 探索 ${summary.signFlips.search}、静的評価 ${summary.signFlips.static}`, "",
    "## 探索値の大幅低下", "", "| 到達ply | 着手 | 捕獲石 | relay | 変化 |", "| ---: | --- | ---: | ---: | ---: |",
    ...summary.largestSearchDrops.map((item) => `| ${item.ply} | ${moveShort(item.incoming.moveKey)} | ${item.incoming.capturedSeeds} | ${item.incoming.relays} | ${score(item.before)} → ${score(item.after)} (${score(item.delta)}) |`), "",
    "## 反転局面でSouthに不利な静的評価要因", "", "| 特徴 | 特徴差 | 寄与 |", "| --- | ---: | ---: |",
    ...summary.adverseContributionsAtSearchReversal.map((item) => `| ${item.feature} | ${item.value} | ${item.contribution} |`), "",
    "## 解釈", "",
    "- C0直後の短期評価が正でも、同一評価器の継続で勝敗へ維持されなかった。初手の頑健性判定に2〜8 ply評価だけを使うのは不十分である。",
    "- 最大低下点は捕獲・relayと一致するが、評価差には手番交替と次手の強制性も含まれる。各着手を単独の人間的な敗着とは断定しない。",
    "- Phase 7ではC0を定石候補から外し、全4初手比較で首位の6番穴・右を新しい未検証候補として扱う。", "",
    "## 完全性", "", `- 再生局面: ${summary.integrity.positions}`, `- trace hash: \`${summary.integrity.traceHash}\``,
    `- final state一致: ${summary.integrity.finalStateHashMatches ? "yes" : "no"}`, "",
  ].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const tree = JSON.parse(fs.readFileSync(options.tree, "utf8"));
  const block = JSON.parse(fs.readFileSync(options.block, "utf8"));
  const entry = tree.nodes.find(({ nodeId }) => nodeId === C0_NODE_ID);
  const result = block.results.find(({ conditionId }) => conditionId === CONDITION_ID);
  if (!entry || !result) throw new Error("Missing C0 bao-d2 input");
  const summary = buildSummary(tree, entry, result);
  atomicWriteJson(options.output, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown,
    outcome: summary.outcome, searchReversal: summary.searchReversal,
    staticReversal: summary.staticReversal, largestSearchDrops: summary.largestSearchDrops,
    adverseContributionsAtSearchReversal: summary.adverseContributionsAtSearchReversal,
    integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { buildSummary, eventSummary, firstNegativeTransition, largestDrops, markdown,
  permanentNegativeTransition, signFlips, traceGame };
