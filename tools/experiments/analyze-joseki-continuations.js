#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson } = require("./lib/joseki-common.js");
const { verify } = require("./verify-joseki-continuations.js");

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    summary: "artifacts/joseki-study/summaries/phase-4-summary.json",
    phase2: "artifacts/joseki-study/phase-4",
    corpus: "artifacts/joseki-study/corpus/continuation-principal-leaves.json",
    input: "artifacts/joseki-study/robustness/continuations",
    output: "artifacts/joseki-study/summaries/continuations-summary.json",
    markdown: "doc/joseki/CONTINUATION_RESULTS.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--tree") options.tree = value;
    else if (key === "--summary") options.summary = value;
    else if (key === "--phase2") options.phase2 = value;
    else if (key === "--corpus") options.corpus = value;
    else if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else if (key === "--markdown") options.markdown = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function ratio(numerator, denominator) { return denominator ? numerator / denominator : null; }

function resultRows(verified, input) {
  return verified.corpus.entries.flatMap((entry) => {
    const block = JSON.parse(fs.readFileSync(path.join(input, "blocks", `${entry.openingId}.json`), "utf8"));
    return block.results.map((result) => ({ ...result, sourceConditions: entry.sourceConditions,
      nodeId: entry.nodeId }));
  });
}

function summarizeRows(rows, key, value) {
  const terminal = rows.filter(({ winner }) => winner !== null);
  const predictableTerminal = terminal.filter(({ predictedWinner }) => predictedWinner !== null);
  const agreements = predictableTerminal.filter(({ predictedWinner, winner }) => predictedWinner === winner).length;
  return {
    key,
    value,
    games: rows.length,
    southWins: rows.filter(({ winner }) => winner === 0).length,
    northWins: rows.filter(({ winner }) => winner === 1).length,
    draws: rows.filter(({ winner }) => winner === null).length,
    terminalRate: ratio(terminal.length, rows.length),
    scoreWinnerAgreements: agreements,
    scoreWinnerComparisons: predictableTerminal.length,
    scoreWinnerAgreementRate: ratio(agreements, predictableTerminal.length),
    averageContinuationPlies: ratio(rows.reduce((sum, row) => sum + row.continuationPlies, 0), rows.length),
  };
}

function groupRows(rows, key, selector) {
  const groups = new Map();
  for (const row of rows) {
    const value = selector(row);
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(row);
  }
  return [...groups.entries()].sort(([left], [right]) => String(left).localeCompare(String(right)))
    .map(([value, selected]) => summarizeRows(selected, key, value));
}

function buildSummary(verified, input) {
  const rows = resultRows(verified, input);
  const horizons = groupRows(rows, "horizon", ({ horizon }) => String(horizon));
  const conditions180 = groupRows(rows.filter(({ horizon }) => horizon === 180), "condition",
    ({ baseConditionId }) => baseConditionId);
  const openings180 = groupRows(rows.filter(({ horizon }) => horizon === 180), "opening",
    ({ openingId }) => openingId);
  const pairs = [];
  for (const row of rows.filter(({ horizon }) => horizon === 120)) {
    const extended = rows.find((candidate) => candidate.openingId === row.openingId
      && candidate.baseConditionId === row.baseConditionId && candidate.horizon === 180);
    if (!extended) throw new Error(`Missing horizon pair: ${row.openingId}/${row.baseConditionId}`);
    pairs.push({ openingId: row.openingId, baseConditionId: row.baseConditionId,
      winner120: row.winner, winner180: extended.winner });
  }
  const comparable = pairs.filter(({ winner120, winner180 }) => winner120 !== null && winner180 !== null);
  const flips = comparable.filter(({ winner120, winner180 }) => winner120 !== winner180).length;
  const resolutions = pairs.filter(({ winner120, winner180 }) => winner120 === null && winner180 !== null).length;
  const horizon180 = horizons.find(({ value }) => value === "180");
  const thresholds = verified.progress.identity.fixedThresholds;
  const winnerFlipRate = ratio(flips, comparable.length) ?? 0;
  const checks = {
    terminalRate: horizon180.terminalRate >= thresholds.horizon180TerminalRateMinimum,
    scoreWinnerAgreement: horizon180.scoreWinnerAgreementRate !== null
      && horizon180.scoreWinnerAgreementRate >= thresholds.scoreWinnerAgreementMinimum,
    winnerFlipRate: winnerFlipRate <= thresholds.horizonWinnerFlipRateMaximum,
  };
  const baselineOpening = verified.corpus.entries.find(({ sourceConditions }) => sourceConditions.includes("bao-d2"));
  const baselineResult = rows.find((row) => row.openingId === baselineOpening.openingId
    && row.baseConditionId === "bao-d2" && row.horizon === 180);
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    status: Object.values(checks).every(Boolean) ? "consistent-screening" : "inconsistent",
    scope: "deterministic phase2 self-play continuations from unique Phase 4 principal leaves",
    thresholds,
    checks,
    integrity: verified.verification,
    corpus: { hash: verified.corpus.corpusHash, counts: verified.corpus.counts,
      selectionPolicy: verified.corpus.selectionPolicy },
    horizons,
    conditions180,
    openings180,
    horizonComparison: { pairs: pairs.length, terminalPairs: comparable.length,
      winnerFlips: flips, winnerFlipRate, drawResolutions: resolutions },
    baseline: {
      openingId: baselineOpening.openingId,
      predictedSouthScore: baselineResult.predictedSouthScore,
      predictedWinner: baselineResult.predictedWinner,
      winner: baselineResult.winner,
      reason: baselineResult.reason,
      totalPlies: baselineResult.totalPlies,
      agrees: baselineResult.predictedWinner === baselineResult.winner,
    },
  };
}

function percent(value) { return value === null ? "n/a" : `${(value * 100).toFixed(1)}%`; }
function winner(value) { return value === 0 ? "South" : value === 1 ? "North" : "draw"; }

function markdown(summary) {
  return [
    "# 8 ply主要系列 継続自己対局",
    "",
    `生成日時: ${summary.generatedAt}`,
    "",
    `判定: \`${summary.status}\``,
    "",
    "Phase 4の6条件が選んだprincipal leafを重複除去した3局面から、同じphase2条件を両側へ適用して最大120手・180手まで継続した。評価符号は8 ply葉でのSouth視点探索値である。",
    "",
    "## 事前固定基準",
    "",
    `- 180手終局率: ${percent(summary.thresholds.horizon180TerminalRateMinimum)}以上`,
    `- 評価符号と勝者の一致: ${percent(summary.thresholds.scoreWinnerAgreementMinimum)}以上`,
    `- 120→180手の勝者反転: ${percent(summary.thresholds.horizonWinnerFlipRateMaximum)}以下`,
    "",
    "## 手数上限別結果",
    "",
    "| 最大手数 | 対局 | South勝 | North勝 | 打切り | 終局率 | 評価・勝者一致 | 平均継続ply |",
    "| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...summary.horizons.map((item) => `| ${item.value} | ${item.games} | ${item.southWins} | ${item.northWins} | ${item.draws} | ${percent(item.terminalRate)} | ${percent(item.scoreWinnerAgreementRate)} | ${item.averageContinuationPlies.toFixed(1)} |`),
    "",
    "## 180手・条件別",
    "",
    "| 条件 | South勝 | North勝 | 打切り | 評価・勝者一致 |",
    "| --- | ---: | ---: | ---: | ---: |",
    ...summary.conditions180.map((item) => `| ${item.value} | ${item.southWins} | ${item.northWins} | ${item.draws} | ${percent(item.scoreWinnerAgreementRate)} |`),
    "",
    "## C0本線",
    "",
    `- 8 ply評価: ${summary.baseline.predictedSouthScore}（予測 ${winner(summary.baseline.predictedWinner)}）`,
    `- 180手継続結果: ${winner(summary.baseline.winner)}、${summary.baseline.totalPlies} ply、${summary.baseline.reason}`,
    `- 整合: ${summary.baseline.agrees ? "yes" : "no"}`,
    "",
    "## 最大手数感度",
    "",
    `- 対応組: ${summary.horizonComparison.pairs}`,
    `- 両方終局: ${summary.horizonComparison.terminalPairs}`,
    `- 勝者反転: ${summary.horizonComparison.winnerFlips}（${percent(summary.horizonComparison.winnerFlipRate)}）`,
    `- 120手打切りから180手で終局: ${summary.horizonComparison.drawResolutions}`,
    "",
    "## 完全性",
    "",
    `- corpus hash: \`${summary.integrity.corpusHash}\``,
    `- 対局: ${summary.integrity.games}`,
    `- replay検証手数: ${summary.integrity.replayedMoves}`,
    `- partial: ${summary.integrity.partialResults}`,
    `- timeout: ${summary.integrity.timeouts}`,
    `- verification hash: \`${summary.integrity.verificationHash}\``,
    "",
  ].join("\n");
}

function analyze(options) {
  const verified = verify(options);
  const summary = buildSummary(verified, options.input);
  atomicWriteJson(options.output, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  return summary;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const summary = analyze(options);
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown, status: summary.status,
    checks: summary.checks, horizons: summary.horizons, horizonComparison: summary.horizonComparison,
    baseline: summary.baseline, integrity: summary.integrity }, null, 2));
}
if (require.main === module) main();

module.exports = { analyze, buildSummary, groupRows, markdown, parseArgs, ratio, resultRows, summarizeRows };
