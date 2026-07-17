#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson } = require("./lib/joseki-common.js");
const { verify } = require("./verify-joseki-mcts-sensitivity.js");

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    sample: "artifacts/joseki-study/corpus/mcts-sensitivity-sample.json",
    input: "artifacts/joseki-study/robustness/mcts-sensitivity",
    phase2: "artifacts/joseki-study/phase-4",
    output: "artifacts/joseki-study/summaries/mcts-sensitivity-summary.json",
    markdown: "doc/joseki/MCTS_SENSITIVITY.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--tree") options.tree = value;
    else if (key === "--sample") options.sample = value;
    else if (key === "--input") options.input = value;
    else if (key === "--phase2") options.phase2 = value;
    else if (key === "--output") options.output = value;
    else if (key === "--markdown") options.markdown = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function ratio(numerator, denominator) { return denominator ? numerator / denominator : null; }

function phase2Move(input, nodeId) {
  const file = path.join(input, "nodes", `${nodeId}.json`);
  if (!fs.existsSync(file)) throw new Error(`Missing phase2 result: ${nodeId}`);
  const result = JSON.parse(fs.readFileSync(file, "utf8")).results
    .find(({ conditionId }) => conditionId === "bao-d2");
  if (!result) throw new Error(`Missing bao-d2 result: ${nodeId}`);
  return result.recommendedMoveKey;
}

function iterationSummary(iterations, nodeRows, strata) {
  let unanimous = 0;
  let phase2Agreements = 0;
  let evaluations = 0;
  let selectedVisits = 0;
  const byStratum = Object.fromEntries(strata.map((stratum) => [stratum, {
    stratum, nodes: 0, unanimous: 0, phase2Agreements: 0, evaluations: 0,
  }]));
  for (const row of nodeRows) {
    const results = row.results.filter((result) => result.iterations === iterations);
    const recommendations = new Set(results.map(({ recommendedMoveKey }) => recommendedMoveKey));
    const isUnanimous = recommendations.size === 1;
    if (isUnanimous) unanimous += 1;
    const stratum = byStratum[row.stratum];
    stratum.nodes += 1;
    if (isUnanimous) stratum.unanimous += 1;
    for (const result of results) {
      evaluations += 1;
      stratum.evaluations += 1;
      if (result.recommendedMoveKey === row.phase2MoveKey) {
        phase2Agreements += 1;
        stratum.phase2Agreements += 1;
      }
      const selected = result.stats.mctsRoot.find(({ moveKey }) => moveKey === result.recommendedMoveKey);
      if (selected) selectedVisits += selected.visits;
    }
  }
  return {
    iterations,
    nodes: nodeRows.length,
    evaluations,
    unanimousNodes: unanimous,
    unanimousConsensusRate: ratio(unanimous, nodeRows.length),
    phase2Agreements,
    phase2AgreementRate: ratio(phase2Agreements, evaluations),
    averageSelectedMoveVisits: ratio(selectedVisits, evaluations),
    strata: Object.values(byStratum).map((item) => ({
      ...item,
      unanimousConsensusRate: ratio(item.unanimous, item.nodes),
      phase2AgreementRate: ratio(item.phase2Agreements, item.evaluations),
    })),
  };
}

function buildSummary(verified, input, phase2) {
  const strata = Object.keys(verified.sample.counts.selectedByStratum).sort();
  const sampleById = new Map(verified.sample.nodes.map((item) => [item.nodeId, item]));
  const nodeRows = verified.nodes.map((node) => ({
    nodeId: node.nodeId,
    stratum: sampleById.get(node.nodeId).stratum,
    phase2MoveKey: phase2Move(phase2, node.nodeId),
    results: JSON.parse(fs.readFileSync(path.join(input, "nodes", `${node.nodeId}.json`), "utf8")).results,
  }));
  const iterations = verified.progress.identity.iterations
    .map((value) => iterationSummary(value, nodeRows, strata));
  const low = iterations[0];
  const high = iterations.at(-1);
  const improvement = high.unanimousConsensusRate - low.unanimousConsensusRate;
  const thresholds = verified.progress.identity.fixedThresholds;
  const checks = {
    highIterationConsensus: high.unanimousConsensusRate
      >= thresholds.highIterationUnanimousConsensusMinimum,
    consensusImprovement: improvement >= thresholds.unanimousConsensusImprovementMinimum,
    timeouts: verified.verification.timeouts <= thresholds.maximumTimeouts,
  };
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: Object.values(checks).every(Boolean) ? "converged" : "unstable",
    scope: "MCTS iteration sensitivity on a deterministic stratified sample of 8-ply leaves",
    selectionPolicy: verified.sample.selectionPolicy,
    thresholds,
    checks,
    integrity: verified.verification,
    nodes: verified.sample.counts,
    unanimousConsensusImprovement: improvement,
    iterations,
  };
}

function percent(value) { return value === null ? "n/a" : `${(value * 100).toFixed(1)}%`; }

function markdown(summary) {
  return [
    "# MCTS iteration感度試験",
    "",
    `生成日時: ${summary.generatedAt}`,
    "",
    `判定: \`${summary.status}\``,
    "",
    "8 ply葉を合法手数と強制捕獲の有無で6層に分け、各層4局面をhash順で固定抽出した。同じ局面・3 seedでiterationだけを12、48、192へ変更した。",
    "",
    "## 事前固定判定",
    "",
    `- 192 iterationのseed完全一致率: ${percent(summary.thresholds.highIterationUnanimousConsensusMinimum)}以上`,
    `- 12から192 iterationの改善: ${percent(summary.thresholds.unanimousConsensusImprovementMinimum)}以上`,
    `- timeout: ${summary.thresholds.maximumTimeouts}`,
    "",
    "## 結果",
    "",
    "| iteration | seed完全一致 | phase2一致 | 選択手平均visit |",
    "| ---: | ---: | ---: | ---: |",
    ...summary.iterations.map((item) => `| ${item.iterations} | ${percent(item.unanimousConsensusRate)} | ${percent(item.phase2AgreementRate)} | ${item.averageSelectedMoveVisits.toFixed(2)} |`),
    "",
    `seed完全一致率の改善: ${percent(summary.unanimousConsensusImprovement)}`,
    "",
    "## 192 iteration 層別結果",
    "",
    "| 層 | seed完全一致 | phase2一致 |",
    "| --- | ---: | ---: |",
    ...summary.iterations.at(-1).strata.map((item) => `| ${item.stratum} | ${percent(item.unanimousConsensusRate)} | ${percent(item.phase2AgreementRate)} |`),
    "",
    "## 完全性",
    "",
    `- 局面: ${summary.integrity.nodes}`,
    `- 評価: ${summary.integrity.results}`,
    `- simulation: ${summary.integrity.simulations}`,
    `- partial: ${summary.integrity.partialResults}`,
    `- timeout: ${summary.integrity.timeouts}`,
    `- sample hash: \`${summary.integrity.sampleHash}\``,
    `- verification hash: \`${summary.integrity.verificationHash}\``,
    "",
  ].join("\n");
}

function analyze(options) {
  const verified = verify(options);
  const summary = buildSummary(verified, options.input, options.phase2);
  atomicWriteJson(options.output, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  return summary;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const summary = analyze(options);
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown, status: summary.status,
    unanimousConsensusImprovement: summary.unanimousConsensusImprovement,
    iterations: summary.iterations.map(({ iterations, unanimousConsensusRate, phase2AgreementRate }) => ({
      iterations, unanimousConsensusRate, phase2AgreementRate,
    })), integrity: summary.integrity }, null, 2));
}
if (require.main === module) main();

module.exports = { analyze, buildSummary, iterationSummary, markdown, parseArgs, phase2Move, ratio };
