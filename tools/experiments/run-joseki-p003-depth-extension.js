#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson, hashValue, stableStringify } = require("./lib/joseki-common.js");
const { loadInputs: loadSweepInputs, parseArgs: parseSweepArgs,
  runDepth } = require("./run-joseki-forced-depth-sweep.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/run-joseki-p003-depth-extension.js";
const DEPTHS = Object.freeze([9, 10]);

function parseArgs(argv) {
  const options = {
    artifacts: "artifacts/joseki-study",
    baseVerification: "artifacts/joseki-study/verified/forced-depth-sweep-verification.json",
    output: "artifacts/joseki-study/robustness/p003-depth-extension",
    verification: "artifacts/joseki-study/verified/p003-depth-extension-verification.json",
    summary: "artifacts/joseki-study/summaries/p003-depth-extension-summary.json",
    markdown: "doc/joseki/P003_DEPTH_EXTENSION.md",
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--status") options.status = true;
    else {
      const field = ({ "--artifacts": "artifacts", "--base-verification": "baseVerification",
        "--output": "output", "--verification": "verification",
        "--summary": "summary", "--markdown": "markdown" })[argv[index]];
      if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
      options[field] = argv[++index];
    }
  }
  return options;
}

function sourceHash() {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, SOURCE_FILE))).digest("hex");
}
function resultFile(output, depth) { return path.join(output, "results", `p003-d${depth}.json`); }
function assertIdentity(expected, actual, label) {
  if (stableStringify(expected) !== stableStringify(actual)) throw new Error(`${label} identity mismatch`);
}

function loadInputs(options) {
  const sweepOptions = parseSweepArgs(["--artifacts", options.artifacts]);
  const sweepInputs = loadSweepInputs(sweepOptions);
  const study = sweepInputs.studies.find(({ studyId }) => studyId === "p003");
  const baseVerification = JSON.parse(fs.readFileSync(options.baseVerification, "utf8"));
  if (!study || !baseVerification.passed || baseVerification.baselineRowsMatched !== 8) {
    throw new Error("P003 depth extension input mismatch");
  }
  return { study, baseVerification };
}

function identity(inputs) {
  return { schemaVersion: 1, experiment: "joseki-p003-depth-extension",
    studyId: inputs.study.studyId, nodeId: inputs.study.nodeId,
    stateHash: inputs.study.stateHash, terminalBestMoveKey: inputs.study.terminalBestMoveKey,
    consensusMoveKey: inputs.study.consensusMoveKey, depths: DEPTHS,
    searchConfig: { level: "hard", searchProfile: "phase2", evaluationProfile: "bao",
      quiescenceDepth: 1, timeLimitMs: 60_000 },
    fixedRules: { scope: "extend only unresolved P003 after P002 found a depth-8 terminal win",
      timeout: "60 seconds per root or fixed-child analysis; stop after a timed-out depth",
      interpretation: "absence of a switch proves only no switch through the deepest completed depth" },
    baseVerificationHash: inputs.baseVerification.verificationHash,
    sourceFileSha256: sourceHash() };
}

function writeProgress(options, experimentIdentity, status, current = null) {
  const rows = DEPTHS.filter((depth) => fs.existsSync(resultFile(options.output, depth)))
    .map((depth) => JSON.parse(fs.readFileSync(resultFile(options.output, depth), "utf8")));
  atomicWriteJson(path.join(options.output, "progress.json"), { schemaVersion: 1, status,
    updatedAt: new Date().toISOString(), identity: experimentIdentity,
    expected: DEPTHS.length, recorded: rows.length,
    completed: rows.filter((row) => row.status === "complete").length,
    timedOut: rows.filter((row) => row.status === "timed-out").length, current });
}

function run(options, inputs, experimentIdentity) {
  fs.mkdirSync(path.join(options.output, "results"), { recursive: true });
  const progressFile = path.join(options.output, "progress.json");
  if (fs.existsSync(progressFile)) {
    assertIdentity(experimentIdentity, JSON.parse(fs.readFileSync(progressFile, "utf8")).identity, "Progress");
  }
  writeProgress(options, experimentIdentity, "running");
  for (const depth of DEPTHS) {
    const file = resultFile(options.output, depth);
    if (fs.existsSync(file)) {
      const saved = JSON.parse(fs.readFileSync(file, "utf8"));
      assertIdentity(experimentIdentity, saved.identity, `P003/d${depth}`);
      if (saved.status === "timed-out") break;
      continue;
    }
    writeProgress(options, experimentIdentity, "running", { depth });
    const result = runDepth(inputs.study, depth, experimentIdentity);
    atomicWriteJson(file, result);
    if (result.status === "timed-out") break;
  }
  const rows = DEPTHS.filter((depth) => fs.existsSync(resultFile(options.output, depth)))
    .map((depth) => JSON.parse(fs.readFileSync(resultFile(options.output, depth), "utf8")));
  writeProgress(options, experimentIdentity,
    rows.length === DEPTHS.length || rows.some(({ status }) => status === "timed-out") ? "complete" : "partial");
}

function verify(options, inputs, experimentIdentity) {
  if (sourceHash() !== experimentIdentity.sourceFileSha256) throw new Error("P003 extension source hash changed");
  const rows = [];
  let sawTimeout = false;
  for (const depth of DEPTHS) {
    const file = resultFile(options.output, depth);
    if (!fs.existsSync(file)) {
      if (!sawTimeout) throw new Error(`Missing P003 depth extension d${depth}`);
      continue;
    }
    const row = JSON.parse(fs.readFileSync(file, "utf8"));
    assertIdentity(experimentIdentity, row.identity, `P003/d${depth}`);
    if (row.studyId !== "p003" || row.stateHash !== inputs.study.stateHash || row.depth !== depth) {
      throw new Error(`P003 extension result mismatch d${depth}`);
    }
    if (row.status === "timed-out") sawTimeout = true;
    rows.push(row);
  }
  const verification = { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    expectedRows: DEPTHS.length, recordedRows: rows.length,
    completeRows: rows.filter(({ status }) => status === "complete").length,
    timedOutRows: rows.filter(({ status }) => status === "timed-out").length,
    sourceHashMatches: true,
    baseVerificationHash: inputs.baseVerification.verificationHash,
    verificationHash: hashValue(rows.map(({ depth, status, root, comparison }) =>
      ({ depth, status, root, comparison }))) };
  atomicWriteJson(options.verification, verification);
  return { rows, verification };
}

function buildSummary(inputs, rows, verification) {
  const results = rows.map(({ depth, status, root, comparison, elapsedMs }) => ({ depth, status,
    recommendedMoveKey: root.recommendedMoveKey, rootScore: root.rootScore,
    completedDepth: root.completedDepth, nodes: root.nodes, elapsedMs,
    terminalBestMinusConsensus: comparison.terminalBestMinusConsensus,
    recommendedIsTerminalBest: comparison.recommendedIsTerminalBest }));
  const completedDepths = results.filter(({ status }) => status === "complete").map(({ depth }) => depth);
  return { schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: results.some(({ recommendedIsTerminalBest }) => recommendedIsTerminalBest)
      ? "terminal-best-switch-observed" : "no-terminal-best-switch-through-completed-depth",
    scope: "P003 phase2 bao extension at depths 9 and 10",
    caveat: experimentIdentityCaveat(),
    nodeId: inputs.study.nodeId, terminalBestMoveKey: inputs.study.terminalBestMoveKey,
    consensusMoveKey: inputs.study.consensusMoveKey,
    firstTerminalBestDepth: results.find(({ recommendedIsTerminalBest }) => recommendedIsTerminalBest)?.depth ?? null,
    deepestCompletedDepth: completedDepths.length ? Math.max(...completedDepths) : null,
    results, integrity: verification };
}

function experimentIdentityCaveat() {
  return "No switch through depth 10 does not exclude a deeper switch; timeout limits are part of the result.";
}
function markdown(summary) {
  return ["# P003 depth 9〜10 延長", "", `生成日時: ${summary.generatedAt}`, "",
    `判定: \`${summary.status}\``, "",
    "P002がdepth 8で終局勝ちを検出したため、未解決のP003だけをdepth 9〜10へ延長した。候補値差はterminal-best − consensusである。", "",
    "| depth | 状態 | 推奨 | root値 | 候補値差 | nodes | ms |", "| ---: | --- | --- | ---: | ---: | ---: | ---: |",
    ...summary.results.map((result) => `| ${result.depth} | ${result.status} | ${result.recommendedIsTerminalBest ? "terminal-best" : "consensus"} | ${result.rootScore} | ${result.terminalBestMinusConsensus ?? "n/a"} | ${result.nodes} | ${result.elapsedMs.toFixed(1)} |`), "",
    `最深完了depthは${summary.deepestCompletedDepth}、terminal-bestへの切替は${summary.firstTerminalBestDepth ?? "観測なし"}。より深いdepthでの切替を否定しない。`, "",
    "## 完全性", "", `- 記録: ${summary.integrity.recordedRows}/${summary.integrity.expectedRows}`,
    `- timeout: ${summary.integrity.timedOutRows}`,
    `- verification hash: \`${summary.integrity.verificationHash}\``, ""].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.status) {
    const file = path.join(options.output, "progress.json");
    console.log(fs.existsSync(file) ? fs.readFileSync(file, "utf8") : JSON.stringify({ status: "not-started" }, null, 2));
    return;
  }
  const inputs = loadInputs(options);
  const experimentIdentity = identity(inputs);
  run(options, inputs, experimentIdentity);
  const { rows, verification } = verify(options, inputs, experimentIdentity);
  const summary = buildSummary(inputs, rows, verification);
  atomicWriteJson(options.summary, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ summary: options.summary, markdown: options.markdown,
    status: summary.status, deepestCompletedDepth: summary.deepestCompletedDepth,
    firstTerminalBestDepth: summary.firstTerminalBestDepth,
    results: summary.results, integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { buildSummary, identity, loadInputs, markdown, parseArgs };
