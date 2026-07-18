#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { atomicWriteJson, hashValue } = require("./lib/joseki-common.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/summarize-joseki-p003-depth11.js";

function sourceHash() {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, SOURCE_FILE))).digest("hex");
}

function parseArgs(argv) {
  const options = {
    depth11: "artifacts/joseki-study/robustness/p003-depth11/p003-d11.json",
    retry: "artifacts/joseki-study/robustness/p003-depth11-timeout-retry.json",
    output: "artifacts/joseki-study/summaries/p003-depth11-complete-summary.json",
    verification: "artifacts/joseki-study/verified/p003-depth11-complete-verification.json",
    markdown: "doc/joseki/P003_DEPTH11_COMPLETE.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const field = ({ "--depth11": "depth11", "--retry": "retry", "--output": "output",
      "--verification": "verification", "--markdown": "markdown" })[argv[index]];
    if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
    options[field] = argv[index + 1];
  }
  return options;
}

function build(depth11, retry) {
  const timedOut = depth11.candidates.filter(({ analysis }) => analysis?.timedOut);
  if (depth11.depth !== 11 || depth11.root.timedOut || depth11.root.completedDepth !== 11
    || timedOut.length !== 1 || retry.moveKey !== timedOut[0].moveKey
    || retry.analysis.timedOut || retry.analysis.completedDepth !== 10
    || retry.childStateHash !== timedOut[0].stateHash) {
    throw new Error("P003 depth-11 consolidation input mismatch");
  }
  const candidates = depth11.candidates.map((candidate) => {
    const replacement = candidate.moveKey === retry.moveKey ? retry : candidate;
    return { moveKey: candidate.moveKey, stateHash: candidate.stateHash,
      southScore: replacement.southScore,
      completedDepth: replacement.analysis.completedDepth,
      timedOut: replacement.analysis.timedOut,
      nodes: replacement.analysis.nodes, elapsedMs: replacement.analysis.elapsedMs,
      timeLimitMs: candidate.moveKey === retry.moveKey ? 120_000 : 60_000,
      retried: candidate.moveKey === retry.moveKey };
  });
  if (candidates.some(({ completedDepth, timedOut: didTimeOut }) => didTimeOut || completedDepth !== 10)) {
    throw new Error("P003 depth-11 candidate comparison remains incomplete");
  }
  const ranking = [...candidates].sort((left, right) => right.southScore - left.southScore)
    .map((candidate, index) => ({ rank: index + 1, ...candidate,
      isConsensus: candidate.moveKey === depth11.comparison.consensusMoveKey,
      isSelfPlayWinCountLeader: candidate.moveKey === depth11.comparison.terminalBestMoveKey }));
  const top = ranking[0];
  if (top.moveKey !== depth11.root.recommendedMoveKey || top.southScore !== depth11.root.rootScore) {
    throw new Error("P003 depth-11 root and consolidated child ranking disagree");
  }
  const verification = { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    sourceFileSha256: sourceHash(), sourceHashMatches: true,
    rootComplete: true, candidatesComplete: candidates.length,
    retriedCandidates: candidates.filter(({ retried }) => retried).length,
    rootMatchesTopCandidate: true,
    inputHash: hashValue({ depth11: { depth: depth11.depth, status: depth11.status,
      root: depth11.root, candidates: depth11.candidates, comparison: depth11.comparison },
    retry: { identity: retry.identity, status: retry.status, moveKey: retry.moveKey,
      childStateHash: retry.childStateHash, southScore: retry.southScore, analysis: retry.analysis } }),
    verificationHash: hashValue({ root: depth11.root, ranking }) };
  const summary = { schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: "depth-11-all-candidate-values-complete",
    scope: "P003 depth-11 root plus four depth-10 fixed-child analyses; one child retried at 120 seconds",
    caveat: "The retry changes the time limit for one child only. All searches otherwise use the same phase2, bao, quiescence-depth-1 configuration and deterministic seed scheme.",
    root: { recommendedMoveKey: depth11.root.recommendedMoveKey,
      rootScore: depth11.root.rootScore, completedDepth: depth11.root.completedDepth,
      timedOut: depth11.root.timedOut, nodes: depth11.root.nodes,
      elapsedMs: depth11.root.elapsedMs },
    consensusMoveKey: depth11.comparison.consensusMoveKey,
    selfPlayWinCountLeaderMoveKey: depth11.comparison.terminalBestMoveKey,
    selfPlayWinCountLeaderMinusConsensus: ranking.find(({ isSelfPlayWinCountLeader }) => isSelfPlayWinCountLeader).southScore
      - ranking.find(({ isConsensus }) => isConsensus).southScore,
    ranking, integrity: verification };
  return { summary, verification };
}

function markdown(summary) {
  return ["# P003 depth 11 全候補値の統合結果", "", `生成日時: ${summary.generatedAt}`, "",
    `判定: \`${summary.status}\``, "",
    "初回60秒上限で完了したrootと3候補に、唯一timeoutした候補の120秒限定再計測を統合した。4候補全ての固定子解析がdepth 10を完了し、rootのdepth 11推奨と候補順位が一致した。", "",
    "| 順位 | 着手 | South値 | 再計測 | 上限ms | nodes | ms |",
    "| ---: | --- | ---: | --- | ---: | ---: | ---: |",
    ...summary.ranking.map((row) => `| ${row.rank} | \`${row.moveKey}\`${row.isConsensus ? " (consensus)" : row.isSelfPlayWinCountLeader ? " (self-play win-count leader)" : ""} | ${row.southScore} | ${row.retried ? "yes" : "no"} | ${row.timeLimitMs} | ${row.nodes} | ${row.elapsedMs.toFixed(1)} |`), "",
    `consensus手がSouth値${summary.root.rootScore}で首位を維持した。自己対局勝数首位手は${summary.selfPlayWinCountLeaderMinusConsensus}点下であり、depth 11でも推奨切替はない。`, "",
    summary.caveat, "", "## 完全性", "",
    `- root completed depth: ${summary.root.completedDepth}`,
    `- completed candidates: ${summary.integrity.candidatesComplete}`,
    `- retried candidates: ${summary.integrity.retriedCandidates}`,
    `- root/top一致: ${summary.integrity.rootMatchesTopCandidate ? "yes" : "no"}`,
    `- source hash: \`${summary.integrity.sourceFileSha256}\``,
    `- input hash: \`${summary.integrity.inputHash}\``,
    `- verification hash: \`${summary.integrity.verificationHash}\``, ""].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const depth11 = JSON.parse(fs.readFileSync(options.depth11, "utf8"));
  const retry = JSON.parse(fs.readFileSync(options.retry, "utf8"));
  const { summary, verification } = build(depth11, retry);
  atomicWriteJson(options.output, summary);
  atomicWriteJson(options.verification, verification);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown,
    status: summary.status, selfPlayWinCountLeaderMinusConsensus:
      summary.selfPlayWinCountLeaderMinusConsensus, ranking: summary.ranking,
    integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { build, markdown, parseArgs };
