#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson } = require("./lib/joseki-common.js");
const { verify } = require("./verify-joseki-artifacts.js");

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    input: "artifacts/joseki-study/phase-4",
    output: "artifacts/joseki-study/summaries/phase-4-summary.json",
    markdown: "doc/joseki/CANDIDATE_LINES.md",
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

function loadValues(input, nodes, conditionId) {
  return new Map(nodes.map((node) => {
    const block = JSON.parse(fs.readFileSync(path.join(input, "nodes", `${node.nodeId}.json`), "utf8"));
    const result = block.results.find(({ conditionId: id }) => id === conditionId);
    if (!result) throw new Error(`Missing condition ${conditionId}: ${node.nodeId}`);
    return [node.nodeId, result.southSearchScore];
  }));
}

function minimaxLine(tree, leafValues) {
  const nodesById = new Map(tree.nodes.map((node) => [node.nodeId, node]));
  const children = new Map();
  for (const edge of tree.edges) {
    if (!children.has(edge.parentId)) children.set(edge.parentId, []);
    children.get(edge.parentId).push(nodesById.get(edge.childId));
  }
  const backed = new Map();
  const choices = new Map();
  for (const node of tree.nodes.slice().sort((a, b) => b.ply - a.ply)) {
    const next = children.get(node.nodeId) || [];
    if (!next.length) {
      backed.set(node.nodeId, leafValues.get(node.nodeId));
      continue;
    }
    const ranked = next.map((child) => ({ child, value: backed.get(child.nodeId) }))
      .sort((a, b) => node.state.player === 0
        ? b.value - a.value || a.child.moveKey.localeCompare(b.child.moveKey)
        : a.value - b.value || a.child.moveKey.localeCompare(b.child.moveKey));
    backed.set(node.nodeId, ranked[0].value);
    choices.set(node.nodeId, ranked[0].child.nodeId);
  }
  const line = [];
  let current = nodesById.get(tree.rootNodeId);
  while (choices.has(current.nodeId)) {
    current = nodesById.get(choices.get(current.nodeId));
    line.push({ ply: current.ply, nodeId: current.nodeId, moveKey: current.moveKey,
      value: backed.get(current.nodeId), playerAfterMove: current.state.player });
  }
  return { value: backed.get(tree.rootNodeId), line, backed, choices };
}

function buildSummary(verified, input) {
  const { tree, progress, verification } = verified;
  const evaluatedNodes = tree.nodes.filter(({ ply }) => ply >= (progress.identity.minPly ?? 0));
  const conditions = progress.identity.conditionIds.map((conditionId) => {
    const result = minimaxLine(tree, loadValues(input, evaluatedNodes, conditionId));
    return { conditionId, candidateValue: result.value, line: result.line };
  });
  const baseline = conditions.find(({ conditionId }) => conditionId === "bao-d2") || conditions[0];
  const agreementByPly = baseline.line.map((move) => ({
    ply: move.ply,
    baselineMoveKey: move.moveKey,
    agreeingConditions: conditions.filter((condition) => condition.line[move.ply - 1]?.moveKey === move.moveKey)
      .map(({ conditionId }) => conditionId),
  }));
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: "screened",
    scope: "screened first move extended through 8 ply with multi-condition branch retention",
    selectionPolicy: tree.selectionPolicy,
    integrity: verification,
    tree: { counts: tree.counts, symmetry: tree.symmetry },
    baselineCondition: baseline.conditionId,
    baselineLine: baseline.line,
    conditions,
    agreementByPly,
  };
}

function markdown(summary) {
  const baseline = summary.conditions.find(({ conditionId }) => conditionId === summary.baselineCondition);
  return [
    "# 8 ply定石候補系列",
    "",
    `生成日時: ${summary.generatedAt}`,
    "",
    "最有力初手を固定し、C0上位3と深度・評価方式別推奨手の和集合を8 plyまで保持した候補木をminimax集計した。評価値はSouth視点の探索値であり、勝率ではない。",
    "",
    "## C0本線",
    "",
    `候補評価: ${baseline.candidateValue}`,
    "",
    ...baseline.line.map((move) => `${move.ply}. \`${move.moveKey}\``),
    "",
    "## 条件別評価",
    "",
    "| 条件 | 候補評価 | C0本線との一致手数 |",
    "| --- | ---: | ---: |",
    ...summary.conditions.map((condition) => `| ${condition.conditionId} | ${condition.candidateValue} | ${condition.line.filter((move, index) => move.moveKey === baseline.line[index]?.moveKey).length}/${baseline.line.length} |`),
    "",
    "## 完全性",
    "",
    `- ノード: ${summary.integrity.nodes}`,
    `- 評価結果: ${summary.integrity.results}`,
    `- partial: ${summary.integrity.partialResults}`,
    `- 座席交換監査: ${summary.integrity.symmetryPassed ? "合格" : "不合格"}`,
    `- tree hash: \`${summary.integrity.treeHash}\``,
    "",
  ].join("\n");
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
    baselineCondition: summary.baselineCondition, baselineLine: summary.baselineLine,
    integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();

module.exports = { analyze, buildSummary, loadValues, markdown, minimaxLine, parseArgs };
