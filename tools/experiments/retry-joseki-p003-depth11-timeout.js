#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { AI, E, atomicWriteJson, hashValue, moveKey } = require("./lib/joseki-common.js");
const { seedFrom, seededRandom } = require("./paired-first-player-common.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/retry-joseki-p003-depth11-timeout.js";
const ROOT_DEPTH = 11;
const CHILD_DEPTH = 10;
const TIME_LIMIT_MS = 120_000;

function parseArgs(argv) {
  const options = {
    study: "artifacts/joseki-study/summaries/forced-p003-summary.json",
    depth11: "artifacts/joseki-study/robustness/p003-depth11/p003-d11.json",
    output: "artifacts/joseki-study/robustness/p003-depth11-timeout-retry.json",
    verification: "artifacts/joseki-study/verified/p003-depth11-timeout-retry-verification.json",
    summary: "artifacts/joseki-study/summaries/p003-depth11-timeout-retry-summary.json",
    markdown: "doc/joseki/P003_DEPTH11_TIMEOUT_RETRY.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const field = ({ "--study": "study", "--depth11": "depth11", "--output": "output",
      "--verification": "verification", "--summary": "summary",
      "--markdown": "markdown" })[argv[index]];
    if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
    options[field] = argv[index + 1];
  }
  return options;
}

function sourceHash() {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, SOURCE_FILE))).digest("hex");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const study = JSON.parse(fs.readFileSync(options.study, "utf8"));
  const prior = JSON.parse(fs.readFileSync(options.depth11, "utf8"));
  const timedOut = prior.candidates.filter(({ analysis }) => analysis?.timedOut);
  if (prior.depth !== ROOT_DEPTH || !prior.root || prior.root.timedOut || timedOut.length !== 1
    || prior.stateHash !== study.selection.selectedStateHash) {
    throw new Error("P003 timeout retry input mismatch");
  }
  const target = timedOut[0];
  const startState = study.position.state;
  const legalMove = E.moveVariants(startState).find((move) => moveKey(move) === target.moveKey);
  if (!legalMove) throw new Error("P003 timeout retry move is no longer legal");
  const child = E.applyMove(startState, legalMove).state;
  const seed = seedFrom("forced-depth-sweep-v1", "p003", ROOT_DEPTH, target.moveKey);
  const analysis = AI.analyzeMove(child, "hard", seededRandom(seed), {
    searchProfile: "phase2", evaluationProfile: "bao", maxDepth: CHILD_DEPTH,
    quiescenceDepth: 1, timeLimitMs: TIME_LIMIT_MS,
  });
  const identity = { schemaVersion: 1, experiment: "joseki-p003-depth11-timeout-retry",
    nodeId: study.selection.selectedNodeId, stateHash: study.selection.selectedStateHash,
    rootDepth: ROOT_DEPTH, childDepth: CHILD_DEPTH, moveKey: target.moveKey,
    childStateHash: hashValue(child), seed, priorCompletedDepth: target.analysis.completedDepth,
    priorTimedOut: target.analysis.timedOut, priorDepth11VerificationHash: hashValue({
      depth: prior.depth, status: prior.status, root: prior.root, comparison: prior.comparison }),
    searchConfig: { level: "hard", searchProfile: "phase2", evaluationProfile: "bao",
      quiescenceDepth: 1, timeLimitMs: TIME_LIMIT_MS }, sourceFileSha256: sourceHash() };
  const result = { schemaVersion: 1, generatedAt: new Date().toISOString(), identity,
    status: analysis.stats.timedOut ? "timed-out" : "complete",
    moveKey: target.moveKey, childStateHash: hashValue(child),
    southScore: analysis.stats.rootScore === null ? null : -analysis.stats.rootScore,
    analysis: { recommendedMoveKey: analysis.move ? moveKey(analysis.move) : null,
      rootScore: analysis.stats.rootScore, completedDepth: analysis.stats.completedDepth,
      timedOut: analysis.stats.timedOut, nodes: analysis.stats.nodes,
      evaluations: analysis.stats.evaluations, cutoffs: analysis.stats.cutoffs,
      cacheHits: analysis.stats.cacheHits, elapsedMs: analysis.stats.elapsedMs } };
  const verification = { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    sourceHashMatches: sourceHash() === identity.sourceFileSha256,
    moveStillLegal: true, childStateHashMatches: result.childStateHash === target.stateHash,
    completedTargetDepth: !result.analysis.timedOut && result.analysis.completedDepth === CHILD_DEPTH,
    verificationHash: hashValue({ identity, status: result.status, moveKey: result.moveKey,
      childStateHash: result.childStateHash, southScore: result.southScore,
      analysis: result.analysis }) };
  const summary = { schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: verification.completedTargetDepth ? "depth-11-all-candidate-values-complete"
      : "retry-timed-out",
    caveat: "This retry changes only the timed-out child limit from 60 to 120 seconds; the root and other child results remain the saved depth-11 results.",
    moveKey: result.moveKey, priorCompletedDepth: target.analysis.completedDepth,
    completedDepth: result.analysis.completedDepth, timedOut: result.analysis.timedOut,
    southScore: result.southScore, elapsedMs: result.analysis.elapsedMs,
    nodes: result.analysis.nodes, integrity: verification };
  atomicWriteJson(options.output, result);
  atomicWriteJson(options.verification, verification);
  atomicWriteJson(options.summary, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, ["# P003 depth 11 timeout枝の限定再計測", "",
    `生成日時: ${summary.generatedAt}`, "", `判定: \`${summary.status}\``, "",
    "depth 11の4候補比較で唯一timeoutした非注目候補だけを、同じseed・探索設定のまま個別上限60秒から120秒へ延長した。rootと他3候補は再計算していない。", "",
    `- move: \`${summary.moveKey}\``, `- completed depth: ${summary.completedDepth}`,
    `- timed out: ${summary.timedOut ? "yes" : "no"}`,
    `- South score: ${summary.southScore ?? "n/a"}`, `- nodes: ${summary.nodes}`,
    `- elapsed ms: ${summary.elapsedMs.toFixed(1)}`, "", summary.caveat, "",
    "## 完全性", "", `- child state hash match: ${verification.childStateHashMatches ? "yes" : "no"}`,
    `- source hash match: ${verification.sourceHashMatches ? "yes" : "no"}`,
    `- verification hash: \`${verification.verificationHash}\``, ""].join("\n"));
  console.log(JSON.stringify({ output: options.output, summary: options.summary,
    markdown: options.markdown, status: summary.status, completedDepth: summary.completedDepth,
    timedOut: summary.timedOut, southScore: summary.southScore, nodes: summary.nodes,
    elapsedMs: summary.elapsedMs, integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { parseArgs };
