#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { E, atomicWriteJson, hashValue, moveKey } = require("./lib/joseki-common.js");

const STUDIES = Object.freeze(["p002", "p003"]);

function parseArgs(argv) {
  const options = {
    artifacts: "artifacts/joseki-study",
    output: "artifacts/joseki-study/summaries/forced-convergence-comparison.json",
    markdown: "doc/joseki/FORCED_CONVERGENCE_COMPARISON.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const field = ({ "--artifacts": "artifacts", "--output": "output", "--markdown": "markdown" })[argv[index]];
    if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
    options[field] = argv[index + 1];
  }
  return options;
}

function forcedCapture(state) {
  if (state.winner !== null) return false;
  const moves = E.moveVariants(state);
  return moves.length > 0 && moves.every(({ type }) => type === "capture");
}

function sequenceMetrics(startState, moveKeys) {
  let state = E.clone(startState);
  const flags = [];
  for (const key of moveKeys) {
    const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === key);
    if (!move) throw new Error(`Illegal convergence replay move: ${key}`);
    state = E.applyMove(state, move).state;
    if (state.winner === null) flags.push(forcedCapture(state));
  }
  let prefix = 0;
  while (prefix < flags.length && flags[prefix]) prefix += 1;
  let current = 0; let maximum = 0;
  for (const flag of flags) {
    current = flag ? current + 1 : 0;
    maximum = Math.max(maximum, current);
  }
  return { forcedCapturePrefix: prefix,
    totalForcedCapturePositions: flags.filter(Boolean).length,
    maximumForcedCaptureRun: maximum, replayedPositions: flags.length };
}

function loadStudy(options, studyId) {
  const summary = JSON.parse(fs.readFileSync(path.join(options.artifacts, "summaries", `forced-${studyId}-summary.json`), "utf8"));
  const reversal = JSON.parse(fs.readFileSync(path.join(options.artifacts, "summaries", `${studyId}-reversal-analysis.json`), "utf8"));
  const focus = [summary.rankings[0], summary.rankings.find(({ isConsensusMove }) => isConsensusMove)];
  const rows = [];
  for (const ranking of focus) {
    const role = ranking.isConsensusMove ? "consensus" : "terminal-best";
    const block = JSON.parse(fs.readFileSync(path.join(options.artifacts, "robustness", `forced-${studyId}`,
      "blocks", `${ranking.candidateId}.json`), "utf8"));
    for (const result of block.results) {
      const trace = reversal.candidates.find(({ moveKey: key }) => key === ranking.moveKey)
        .traces.find(({ conditionId }) => conditionId === result.conditionId);
      rows.push({ studyId: studyId.toUpperCase(), role, moveKey: ranking.moveKey,
        conditionId: result.conditionId, winner: result.winner, totalPlies: result.totalPlies,
        ...sequenceMetrics(summary.position.state, [ranking.moveKey, ...result.continuationMoveKeys]),
        permanentSearchReversalPly: trace.permanentSearchReversal?.ply ?? null,
        traceHash: trace.traceHash });
    }
  }
  const best = summary.rankings[0];
  const consensus = summary.rankings.find(({ isConsensusMove }) => isConsensusMove);
  return { studyId: studyId.toUpperCase(), selectedNodeId: summary.selection.selectedNodeId,
    terminalBestMoveKey: best.moveKey, consensusMoveKey: consensus.moveKey,
    southWins: { terminalBest: best.southWins, consensus: consensus.southWins,
      delta: best.southWins - consensus.southWins },
    immediate: {
      staticConsensusAdvantage: reversal.immediateComparison.staticScore.consensus
        - (reversal.immediateComparison.staticScore.alternative
          ?? reversal.immediateComparison.staticScore.terminalBest),
      searchConsensusAdvantage: reversal.candidates.find(({ isConsensusMove }) => isConsensusMove).traces[0].initial.search
        - reversal.candidates.find(({ isConsensusMove }) => !isConsensusMove).traces[0].initial.search,
      frontSafety: { terminalBest: best.immediate?.evaluationFeatures.frontSafety
          ?? reversal.candidates.find(({ isConsensusMove }) => !isConsensusMove).immediateBreakdown.features.frontSafety,
      consensus: consensus.immediate?.evaluationFeatures.frontSafety
          ?? reversal.candidates.find(({ isConsensusMove }) => isConsensusMove).immediateBreakdown.features.frontSafety },
      northLegalMoves: { terminalBest: best.immediate?.northLegalMoves
          ?? reversal.candidates.find(({ isConsensusMove }) => !isConsensusMove).traces[0].initial.northLegalMoves,
      consensus: consensus.immediate?.northLegalMoves
          ?? reversal.candidates.find(({ isConsensusMove }) => isConsensusMove).traces[0].initial.northLegalMoves },
    }, rows };
}

function mean(values) { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null; }
function range(values) { return values.length ? { min: Math.min(...values), max: Math.max(...values) } : null; }
function aggregate(rows) {
  const groups = [];
  for (const studyId of [...new Set(rows.map(({ studyId }) => studyId))]) {
    for (const role of ["terminal-best", "consensus"]) {
      for (const outcome of ["South-win", "North-win"]) {
        const winner = outcome === "South-win" ? 0 : 1;
        const selected = rows.filter((row) => row.studyId === studyId && row.role === role && row.winner === winner);
        if (!selected.length) continue;
        const prefixes = selected.map(({ forcedCapturePrefix }) => forcedCapturePrefix);
        const totals = selected.map(({ totalForcedCapturePositions }) => totalForcedCapturePositions);
        const reversals = selected.map(({ permanentSearchReversalPly }) => permanentSearchReversalPly).filter((value) => value !== null);
        groups.push({ studyId, role, outcome, games: selected.length,
          forcedCapturePrefix: { mean: mean(prefixes), range: range(prefixes) },
          totalForcedCapturePositions: { mean: mean(totals), range: range(totals) },
          permanentSearchReversal: { observed: reversals.length, mean: mean(reversals), range: range(reversals) } });
      }
    }
  }
  return groups;
}

function buildSummary(options) {
  const studies = STUDIES.map((studyId) => loadStudy(options, studyId));
  const rows = studies.flatMap(({ rows }) => rows);
  const groups = aggregate(rows);
  const losingReversals = rows.filter(({ winner, permanentSearchReversalPly }) => winner === 1 && permanentSearchReversalPly !== null)
    .map(({ permanentSearchReversalPly }) => permanentSearchReversalPly).sort((a, b) => a - b);
  return { schemaVersion: 1, generatedAt: new Date().toISOString(),
    scope: "P002 and P003 terminal-best versus cross-method-consensus continuations",
    caveat: "Two selected positions are enough to refute simple necessary-condition explanations, not to estimate general predictive accuracy.",
    studies: studies.map(({ rows: ignored, ...study }) => study), rows, groups,
    crossStudy: { positions: studies.length, games: rows.length,
      consensusRankInversions: studies.filter(({ southWins }) => southWins.delta > 0).length,
      losingPermanentReversalPlies: losingReversals,
      medianLosingPermanentReversalPly: losingReversals[Math.floor(losingReversals.length / 2)] },
    integrity: { rows: rows.length, allTraceHashesPresent: rows.every(({ traceHash }) => Boolean(traceHash)),
      summaryHash: hashValue({ studies: studies.map(({ rows: ignored, ...study }) => study), rows, groups }) } };
}

function format(value) { return Number.isInteger(value) ? String(value) : value.toFixed(1); }
function markdown(summary) {
  const studyRows = summary.studies.map((study) => `| ${study.studyId} | ${study.southWins.terminalBest}/6 | ${study.southWins.consensus}/6 | ${study.immediate.searchConsensusAdvantage} | ${study.immediate.staticConsensusAdvantage} | ${study.immediate.frontSafety.terminalBest}/${study.immediate.frontSafety.consensus} | ${study.immediate.northLegalMoves.terminalBest}/${study.immediate.northLegalMoves.consensus} |`);
  const groupRows = summary.groups.map((group) => `| ${group.studyId} | ${group.role} | ${group.outcome} | ${group.games} | ${format(group.forcedCapturePrefix.mean)} (${group.forcedCapturePrefix.range.min}–${group.forcedCapturePrefix.range.max}) | ${format(group.totalForcedCapturePositions.mean)} (${group.totalForcedCapturePositions.range.min}–${group.totalForcedCapturePositions.range.max}) |`);
  return ["# P002・P003 探索収束反例の横断比較", "", `生成日時: ${summary.generatedAt}`, "",
    "P002・P003の終局首位手とcross-method合意手を横断し、直後評価差、強制捕獲系列長、恒久負転を同じ定義で集約した。2局面は単純な必要条件を反証できるが、一般的な予測精度の推定には不足する。", "",
    "## 局面別", "", "| 局面 | 終局首位手勝 | 合意手勝 | 合意手の探索値差 | 合意手の静的値差 | frontSafety 首位/合意 | North応手 首位/合意 |",
    "| --- | ---: | ---: | ---: | ---: | --- | --- |", ...studyRows, "",
    "両局面とも探索は合意手を大差で支持したが、終局首位は非合意手だった。P003ではfrontSafetyとNorth応手数が同値なので、どちらも不一致の必要条件ではない。", "",
    "## 強制捕獲系列", "", "| 局面 | 手 | 結果 | 局数 | 冒頭連続capture平均 (範囲) | 全capture局面平均 (範囲) |",
    "| --- | --- | --- | ---: | --- | --- |", ...groupRows, "",
    "勝敗双方に短い系列と長い系列があり、単純な系列長の閾値でも終局を分類できない。South敗戦traceで観測した恒久負転plyは"
      + `${summary.crossStudy.losingPermanentReversalPlies.join("、")}、中央値${summary.crossStudy.medianLosingPermanentReversalPly}だった。`, "",
    "## 結論", "",
    "- frontSafety差、相手応手数差、強制捕獲系列長のいずれも単独の必要条件・十分条件として支持されない。",
    "- 2局面とも探索値は非合意の終局首位手を大幅に低く評価した。問題は小さな重み誤差ではなく、直後評価の優位が長期に維持されるという仮定にある。",
    "- 次の検証では単一特徴を追加する前に、同一局面をdepth 1〜より深い探索で追い、合意が終局首位へ切り替わるhorizonの有無を測る。", "",
    "## 完全性", "", `- 局面: ${summary.crossStudy.positions}`,
    `- trace: ${summary.crossStudy.games}`, `- trace hash欠損: ${summary.integrity.allTraceHashesPresent ? 0 : "あり"}`,
    `- summary hash: \`${summary.integrity.summaryHash}\``, ""].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const summary = buildSummary(options);
  atomicWriteJson(options.output, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown,
    studies: summary.studies, groups: summary.groups, crossStudy: summary.crossStudy,
    integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { aggregate, buildSummary, forcedCapture, loadStudy, markdown,
  parseArgs, sequenceMetrics };
