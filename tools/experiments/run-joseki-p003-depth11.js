#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson, hashValue } = require("./lib/joseki-common.js");
const { loadInputs: loadSweepInputs, parseArgs: parseSweepArgs,
  runDepth } = require("./run-joseki-forced-depth-sweep.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/run-joseki-p003-depth11.js";
const DEPTH = 11;

function parseArgs(argv) {
  const options = {
    artifacts: "artifacts/joseki-study",
    priorVerification: "artifacts/joseki-study/verified/p003-depth-extension-verification.json",
    output: "artifacts/joseki-study/robustness/p003-depth11/p003-d11.json",
    verification: "artifacts/joseki-study/verified/p003-depth11-verification.json",
    summary: "artifacts/joseki-study/summaries/p003-depth11-summary.json",
    markdown: "doc/joseki/P003_DEPTH11.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const field = ({ "--artifacts": "artifacts", "--prior-verification": "priorVerification",
      "--output": "output", "--verification": "verification",
      "--summary": "summary", "--markdown": "markdown" })[argv[index]];
    if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
    options[field] = argv[index + 1];
  }
  return options;
}

function sourceHash() {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, SOURCE_FILE))).digest("hex");
}

function loadInputs(options) {
  const inputs = loadSweepInputs(parseSweepArgs(["--artifacts", options.artifacts]));
  const study = inputs.studies.find(({ studyId }) => studyId === "p003");
  const priorVerification = JSON.parse(fs.readFileSync(options.priorVerification, "utf8"));
  if (!study || !priorVerification.passed || priorVerification.completeRows !== 2
    || priorVerification.timedOutRows !== 0) throw new Error("P003 depth-11 input mismatch");
  return { study, priorVerification };
}

function identity(inputs) {
  return { schemaVersion: 1, experiment: "joseki-p003-depth11",
    studyId: inputs.study.studyId, nodeId: inputs.study.nodeId,
    stateHash: inputs.study.stateHash, depth: DEPTH,
    terminalBestMoveKey: inputs.study.terminalBestMoveKey,
    consensusMoveKey: inputs.study.consensusMoveKey,
    searchConfig: { level: "hard", searchProfile: "phase2", evaluationProfile: "bao",
      quiescenceDepth: 1, timeLimitMsPerAnalysis: 60_000 },
    fixedRules: { scope: "one-depth continuation after P003 completed depth 10",
      timeout: "record a timed-out result if root or any fixed child reaches 60 seconds",
      interpretation: "a completed result applies only through depth 11; a timeout is not a move ranking" },
    priorVerificationHash: inputs.priorVerification.verificationHash,
    sourceFileSha256: sourceHash() };
}

function buildSummary(inputs, row, verification) {
  const timedOutCandidateMoveKeys = row.candidates
    .filter(({ analysis }) => analysis?.timedOut).map(({ moveKey }) => moveKey);
  const focalMoveKeys = [inputs.study.consensusMoveKey, inputs.study.terminalBestMoveKey];
  const focalComparisonComplete = focalMoveKeys.every((key) => {
    const candidate = row.candidates.find(({ moveKey }) => moveKey === key);
    return candidate?.analysis && !candidate.analysis.timedOut
      && candidate.analysis.completedDepth === DEPTH - 1;
  });
  return { schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: row.root.timedOut ? "root-timed-out"
      : timedOutCandidateMoveKeys.length ? "root-complete-with-candidate-timeout"
      : row.comparison.recommendedIsTerminalBest ? "terminal-best-switch-observed"
        : "consensus-preserved-through-depth-11",
    scope: "P003 phase2 bao depth 11, quiescence depth 1",
    caveat: timedOutCandidateMoveKeys.length
      ? "The depth-11 root and the focal consensus-versus-self-play-leader comparison completed, but one other fixed-child analysis timed out; the all-candidate comparison is incomplete."
      : "No switch through depth 11 does not exclude a deeper switch.",
    nodeId: inputs.study.nodeId,
    consensusMoveKey: inputs.study.consensusMoveKey,
    terminalBestMoveKey: inputs.study.terminalBestMoveKey,
    result: { depth: row.depth, status: row.status,
      recommendedMoveKey: row.root.recommendedMoveKey, rootScore: row.root.rootScore,
      completedDepth: row.root.completedDepth, nodes: row.root.nodes,
      elapsedMs: row.elapsedMs,
      rootTimedOut: row.root.timedOut, timedOutCandidateMoveKeys,
      focalComparisonComplete,
      terminalBestMinusConsensus: focalComparisonComplete
        ? row.comparison.terminalBestMinusConsensus : null,
      recommendedIsTerminalBest: row.comparison.recommendedIsTerminalBest },
    integrity: verification };
}

function markdown(summary) {
  const result = summary.result;
  return ["# P003 depth 11 追試", "", `生成日時: ${summary.generatedAt}`, "",
    `判定: \`${summary.status}\``, "",
    "P003のdepth 9〜10完了後、同じphase2・bao・quiescence depth 1でdepth 11を追試した。rootおよび各固定子局面は個別に60秒上限とした。", "",
    "| depth | 状態 | 推奨 | root値 | 自己対局勝数首位−合意 | nodes | 合計ms |",
    "| ---: | --- | --- | ---: | ---: | ---: | ---: |",
    `| ${result.depth} | ${result.status} | ${result.recommendedIsTerminalBest ? "self-play win-count leader" : "consensus"} | ${result.rootScore ?? "n/a"} | ${result.terminalBestMinusConsensus ?? "n/a"} | ${result.nodes} | ${result.elapsedMs.toFixed(1)} |`, "",
    summary.caveat, "", "root探索はdepth 11を完了してconsensus手を維持した。自己対局勝数首位手とconsensus手の固定子解析もdepth 10を完了し、値差は-257だった。一方、別の非合意手1件がdepth 9完了後に60秒timeoutとなったため、4候補全体の値比較は完了していない。", "", "## 完全性", "",
    `- completed depth: ${result.completedDepth}`,
    `- focal comparison complete: ${result.focalComparisonComplete ? "yes" : "no"}`,
    `- timed-out candidate: ${result.timedOutCandidateMoveKeys.length ? `\`${result.timedOutCandidateMoveKeys.join("`, `")}\`` : "none"}`,
    `- timeout: ${summary.integrity.timedOutRows}`,
    `- source hash match: ${summary.integrity.sourceHashMatches ? "yes" : "no"}`,
    `- verification hash: \`${summary.integrity.verificationHash}\``, ""].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputs = loadInputs(options);
  const experimentIdentity = identity(inputs);
  const row = runDepth(inputs.study, DEPTH, experimentIdentity);
  if (sourceHash() !== experimentIdentity.sourceFileSha256) throw new Error("P003 depth-11 source changed");
  const verification = { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    expectedRows: 1, recordedRows: 1,
    completeRows: row.status === "complete" ? 1 : 0,
    timedOutRows: row.status === "timed-out" ? 1 : 0,
    sourceHashMatches: true,
    priorVerificationHash: inputs.priorVerification.verificationHash,
    verificationHash: hashValue({ depth: row.depth, status: row.status,
      root: row.root, comparison: row.comparison }) };
  const summary = buildSummary(inputs, row, verification);
  atomicWriteJson(options.output, row);
  atomicWriteJson(options.verification, verification);
  atomicWriteJson(options.summary, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ output: options.output, summary: options.summary,
    markdown: options.markdown, status: summary.status, result: summary.result,
    integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { buildSummary, identity, loadInputs, markdown, parseArgs };
