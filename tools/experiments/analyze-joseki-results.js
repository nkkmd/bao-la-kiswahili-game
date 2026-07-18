#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson } = require("./lib/joseki-common.js");
const { verify } = require("./verify-joseki-artifacts.js");

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/tree.json",
    input: "artifacts/joseki-study/phase-1",
    output: "artifacts/joseki-study/summaries/phase-1-summary.json",
    markdown: "doc/joseki/OPENING_INDEX.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--tree") options.tree = value;
    else if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else if (key === "--markdown") options.markdown = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function loadResults(input, nodes) {
  return new Map(nodes.map((node) => {
    const block = JSON.parse(fs.readFileSync(path.join(input, "nodes", `${node.nodeId}.json`), "utf8"));
    return [node.nodeId, new Map(block.results.map((result) => [result.conditionId, result]))];
  }));
}

function rankFirstMoves(tree, results, conditionId) {
  const firstMoves = tree.nodes.filter(({ ply }) => ply === 1);
  return firstMoves.map((first) => {
    const replies = tree.nodes.filter((node) => node.ply === 2 && node.parentId === first.nodeId);
    const replyValues = replies.map((reply) => ({
      nodeId: reply.nodeId,
      moveKey: reply.moveKey,
      value: results.get(reply.nodeId).get(conditionId).southSearchScore,
    }));
    replyValues.sort((a, b) => a.value - b.value || a.moveKey.localeCompare(b.moveKey));
    const values = replyValues.map(({ value }) => value);
    return {
      nodeId: first.nodeId,
      move: first.move,
      moveKey: first.moveKey,
      directValue: results.get(first.nodeId).get(conditionId).southSearchScore,
      worstReplyValue: values.length ? Math.min(...values) : null,
      averageReplyValue: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
      bestReplyForNorth: replyValues[0] || null,
      replies: replyValues,
    };
  }).sort((a, b) => b.worstReplyValue - a.worstReplyValue
    || b.averageReplyValue - a.averageReplyValue || a.moveKey.localeCompare(b.moveKey));
}

function buildSummary(verified, input) {
  const { tree, progress, verification } = verified;
  const results = loadResults(input, tree.nodes);
  const rankings = Object.fromEntries(progress.identity.conditionIds.map((id) => [id,
    rankFirstMoves(tree, results, id)]));
  const top3 = (id) => new Set(rankings[id].slice(0, 3).map(({ nodeId }) => nodeId));
  const baseline = rankings["bao-d2"] || rankings[progress.identity.conditionIds[0]];
  const candidates = baseline.map((entry) => {
    const depthIds = [1, 2, 3, 4].map((depth) => `bao-d${depth}`).filter((id) => rankings[id]);
    const evaluatorIds = ["legacy-d2", "bao-d2", "bao-v2-d2"].filter((id) => rankings[id]);
    return {
      ...entry,
      baselineRank: baseline.findIndex(({ nodeId }) => nodeId === entry.nodeId) + 1,
      depthTop3Count: depthIds.filter((id) => top3(id).has(entry.nodeId)).length,
      depthConditions: depthIds.length,
      evaluatorTop3Count: evaluatorIds.filter((id) => top3(id).has(entry.nodeId)).length,
      evaluatorConditions: evaluatorIds.length,
    };
  });
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "screened",
    scope: "standard initial position, exhaustive 2-ply tree",
    methodology: {
      baseline: rankings["bao-d2"] ? "bao-d2" : progress.identity.conditionIds[0],
      robustValue: "minimum South-perspective search score over every legal North reply",
      caveat: "Search scores are engine heuristic minimax values, not win probabilities.",
    },
    integrity: verification,
    tree: { counts: tree.counts, symmetry: tree.symmetry },
    candidates,
    rankings,
  };
}

function formatScore(value) {
  return value === null || !Number.isFinite(value) ? "—" : value.toFixed(1);
}

function markdown(summary) {
  const lines = [
    "# Bao la Kiswahili 初手・応手スクリーニング",
    "",
    `生成日時: ${summary.generatedAt}`,
    "",
    "標準初期局面から2 plyを全数列挙し、相手の全合法応手に対する最悪時評価で初手を比較した。値はSouth視点のAI探索評価であり、勝率ではない。",
    "",
    "| 順位 | South初手 | C0最悪応手評価 | C0平均応手評価 | North最善応手 | depth上位3 | 評価方式上位3 | 状態 |",
    "| ---: | --- | ---: | ---: | --- | ---: | ---: | --- |",
    ...summary.candidates.map((candidate) => `| ${candidate.baselineRank} | \`${candidate.moveKey}\` | ${formatScore(candidate.worstReplyValue)} | ${formatScore(candidate.averageReplyValue)} | \`${candidate.bestReplyForNorth?.moveKey || "—"}\` | ${candidate.depthTop3Count}/${candidate.depthConditions} | ${candidate.evaluatorTop3Count}/${candidate.evaluatorConditions} | screened |`),
    "",
    "## 完全性",
    "",
    `- ノード: ${summary.integrity.nodes}`,
    `- 評価結果: ${summary.integrity.results}`,
    `- partial: ${summary.integrity.partialResults}`,
    `- 座席交換監査: ${summary.integrity.symmetryPassed ? "合格" : "不合格"}`,
    `- tree hash: \`${summary.integrity.treeHash}\``,
    "",
    "## 再現コマンド",
    "",
    "```bash",
    "node tools/experiments/generate-joseki-tree.js --max-ply 2",
    "node tools/experiments/evaluate-joseki-nodes.js",
    "node tools/experiments/verify-joseki-artifacts.js",
    "node tools/experiments/analyze-joseki-results.js",
    "```",
    "",
  ];
  return lines.join("\n");
}

function analyze(options) {
  const verified = verify({ tree: options.tree, input: options.input });
  const summary = buildSummary(verified, options.input);
  atomicWriteJson(options.output, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  return summary;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const summary = analyze(options);
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown,
    candidates: summary.candidates, integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();

module.exports = { analyze, buildSummary, loadResults, markdown, parseArgs, rankFirstMoves };
