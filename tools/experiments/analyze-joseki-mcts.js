#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson } = require("./lib/joseki-common.js");
const { verify: verifyMcts } = require("./verify-joseki-mcts.js");

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    input: "artifacts/joseki-study/robustness/mcts-8ply",
    phase2: "artifacts/joseki-study/phase-4",
    output: "artifacts/joseki-study/summaries/mcts-8ply-summary.json",
    markdown: "doc/joseki/MCTS_ROBUSTNESS.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--tree") options.tree = value;
    else if (key === "--input") options.input = value;
    else if (key === "--phase2") options.phase2 = value;
    else if (key === "--output") options.output = value;
    else if (key === "--markdown") options.markdown = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function ratio(numerator, denominator) { return denominator ? numerator / denominator : null; }

function baselineMove(phase2, nodeId) {
  const file = path.join(phase2, "nodes", `${nodeId}.json`);
  if (!fs.existsSync(file)) throw new Error(`Missing phase2 baseline: ${nodeId}`);
  const block = JSON.parse(fs.readFileSync(file, "utf8"));
  const result = block.results.find(({ conditionId }) => conditionId === "bao-d2");
  if (!result) throw new Error(`Missing bao-d2 baseline: ${nodeId}`);
  return result.recommendedMoveKey;
}

function buildSummary(verified, input, phase2) {
  const { tree, progress, verification } = verified;
  const nodes = tree.nodes.filter(({ ply }) => ply >= progress.identity.minPly)
    .slice(0, progress.expected.nodes);
  const perSeed = Object.fromEntries(progress.identity.conditionIds.map((id) => [id, {
    conditionId: id, choiceNodes: 0, agreements: 0, simulations: 0, playoutTurns: 0,
  }]));
  let forcedNodes = 0;
  let choiceNodes = 0;
  let unanimousChoiceNodes = 0;
  let allSeedChoiceEvaluations = 0;
  let allSeedAgreements = 0;
  let topVisits = 0;
  let topAverageValues = 0;
  let topAverageValueCount = 0;
  for (const node of nodes) {
    const block = JSON.parse(fs.readFileSync(path.join(input, "nodes", `${node.nodeId}.json`), "utf8"));
    const baseline = baselineMove(phase2, node.nodeId);
    const legalMoveCount = block.results[0].legalMoveCount;
    if (legalMoveCount <= 1) {
      forcedNodes += 1;
      continue;
    }
    choiceNodes += 1;
    const recommendations = new Set(block.results.map(({ recommendedMoveKey }) => recommendedMoveKey));
    if (recommendations.size === 1) unanimousChoiceNodes += 1;
    for (const result of block.results) {
      const seed = perSeed[result.conditionId];
      seed.choiceNodes += 1;
      seed.simulations += result.stats.simulations;
      seed.playoutTurns += result.stats.playoutTurns;
      allSeedChoiceEvaluations += 1;
      if (result.recommendedMoveKey === baseline) {
        seed.agreements += 1;
        allSeedAgreements += 1;
      }
      const selected = result.stats.mctsRoot.find(({ moveKey }) => moveKey === result.recommendedMoveKey);
      if (selected) {
        topVisits += selected.visits;
        if (selected.averageValue !== null) {
          topAverageValues += selected.averageValue;
          topAverageValueCount += 1;
        }
      }
    }
  }
  const phase2Agreement = ratio(allSeedAgreements, allSeedChoiceEvaluations);
  const unanimousSeedConsensus = ratio(unanimousChoiceNodes, choiceNodes);
  const thresholds = progress.identity.fixedThresholds;
  const checks = {
    phase2Agreement: phase2Agreement !== null
      && phase2Agreement >= thresholds.choiceNodePhase2AgreementMinimum,
    unanimousSeedConsensus: unanimousSeedConsensus !== null
      && unanimousSeedConsensus >= thresholds.choiceNodeUnanimousSeedConsensusMinimum,
    timeouts: verification.timeouts <= thresholds.maximumTimeouts,
  };
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: Object.values(checks).every(Boolean) ? "passed-screening" : "unstable",
    scope: "seeded MCTS recommendation robustness on the shared 8-ply leaf corpus",
    config: progress.identity.fixedConfig,
    thresholds,
    checks,
    integrity: verification,
    nodes: { total: nodes.length, forced: forcedNodes, choice: choiceNodes },
    phase2Agreement,
    unanimousSeedConsensus,
    perSeed: Object.values(perSeed).map((item) => ({
      ...item,
      agreementRate: ratio(item.agreements, item.choiceNodes),
      averagePlayoutTurnsPerSimulation: ratio(item.playoutTurns, item.simulations),
    })),
    mcts: {
      averageSelectedMoveVisits: ratio(topVisits, allSeedChoiceEvaluations),
      averageSelectedMoveValue: ratio(topAverageValues, topAverageValueCount),
    },
  };
}

function percent(value) { return value === null ? "n/a" : `${(value * 100).toFixed(1)}%`; }

function markdown(summary) {
  return [
    "# 8 ply葉 MCTS頑健性試験",
    "",
    `生成日時: ${summary.generatedAt}`,
    "",
    `判定: \`${summary.status}\``,
    "",
    "同一の8 ply葉局面をphase2 bao depth 2とseed付きMCTSで比較した。合法手が1つしかない強制手局面は一致率から除外した。",
    "",
    "## 事前固定条件",
    "",
    `- seed数: ${summary.integrity.conditionCounts ? Object.keys(summary.integrity.conditionCounts).length : 0}`,
    `- iteration: ${summary.config.mctsIterations}`,
    `- playout上限: ${summary.config.mctsPlayoutTurns}手`,
    `- phase2一致率閾値: ${percent(summary.thresholds.choiceNodePhase2AgreementMinimum)}`,
    `- 3 seed完全一致率閾値: ${percent(summary.thresholds.choiceNodeUnanimousSeedConsensusMinimum)}`,
    "",
    "## 結果",
    "",
    `- 全葉: ${summary.nodes.total}（強制手 ${summary.nodes.forced}、選択あり ${summary.nodes.choice}）`,
    `- phase2推奨手との一致: ${percent(summary.phase2Agreement)}`,
    `- seed間完全一致: ${percent(summary.unanimousSeedConsensus)}`,
    `- timeout: ${summary.integrity.timeouts}`,
    `- 完全性: ${summary.integrity.passed ? "合格" : "不合格"}`,
    "",
    "| seed | phase2一致 | 平均playout手数 / simulation |",
    "| --- | ---: | ---: |",
    ...summary.perSeed.map((seed) => `| ${seed.conditionId} | ${percent(seed.agreementRate)} | ${seed.averagePlayoutTurnsPerSimulation === null ? "n/a" : seed.averagePlayoutTurnsPerSimulation.toFixed(2)} |`),
    "",
  ].join("\n");
}

function analyze(options) {
  const verified = verifyMcts({ tree: options.tree, input: options.input });
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
    phase2Agreement: summary.phase2Agreement, unanimousSeedConsensus: summary.unanimousSeedConsensus,
    integrity: summary.integrity }, null, 2));
}
if (require.main === module) main();

module.exports = { analyze, baselineMove, buildSummary, markdown, parseArgs, ratio };
