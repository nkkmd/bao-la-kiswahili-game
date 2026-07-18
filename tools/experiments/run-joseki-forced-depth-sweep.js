#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { AI, E, atomicWriteJson, hashValue, josekiProvenance, moveKey, stableStringify } = require("./lib/joseki-common.js");
const { seedFrom, seededRandom } = require("./paired-first-player-common.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/run-joseki-forced-depth-sweep.js";
const STUDY_IDS = Object.freeze(["p002", "p003"]);
const DEPTHS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]);
const TIME_LIMIT_MS = 60_000;
const FIXED_RULES = Object.freeze({
  scope: "P002 and P003 exact states, phase2 search, bao evaluation, depths 1 through 8",
  timeout: "60 seconds per root or fixed-child analysis; stop deeper depths for that position after a timeout",
  switch: "report the first depth recommending the pre-existing terminal-best move",
  confirmation: "if a switch occurs before depth 8, continue through at least the next depth within the fixed range",
  interpretation: "absence of a switch proves only that no switch was observed through the deepest completed depth",
});

function parseArgs(argv) {
  const options = {
    artifacts: "artifacts/joseki-study",
    output: "artifacts/joseki-study/robustness/forced-depth-sweep",
    verification: "artifacts/joseki-study/verified/forced-depth-sweep-verification.json",
    summary: "artifacts/joseki-study/summaries/forced-depth-sweep-summary.json",
    markdown: "doc/joseki/FORCED_DEPTH_SWEEP.md",
    status: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--status") options.status = true;
    else {
      const field = ({ "--artifacts": "artifacts", "--output": "output",
        "--verification": "verification", "--summary": "summary", "--markdown": "markdown" })[argv[index]];
      if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
      options[field] = argv[++index];
    }
  }
  return options;
}

function sourceHash() {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, SOURCE_FILE))).digest("hex");
}
function resultFile(output, studyId, depth) { return path.join(output, "results", `${studyId}-d${depth}.json`); }

function loadInputs(options) {
  const studies = STUDY_IDS.map((studyId) => {
    const continuation = JSON.parse(fs.readFileSync(path.join(options.artifacts, "summaries", `forced-${studyId}-summary.json`), "utf8"));
    const reversal = JSON.parse(fs.readFileSync(path.join(options.artifacts, "summaries", `${studyId}-reversal-analysis.json`), "utf8"));
    const terminalBest = continuation.rankings[0];
    const consensus = continuation.rankings.find(({ isConsensusMove }) => isConsensusMove);
    if (!terminalBest || !consensus || terminalBest.isConsensusMove
      || reversal.selectedStateHash !== continuation.selection.selectedStateHash) {
      throw new Error(`Depth sweep input mismatch: ${studyId}`);
    }
    return { studyId, nodeId: continuation.selection.selectedNodeId,
      stateHash: continuation.selection.selectedStateHash, state: continuation.position.state,
      terminalBestMoveKey: terminalBest.moveKey, consensusMoveKey: consensus.moveKey,
      phase2Scores: continuation.phase2Scores,
      continuationVerificationHash: continuation.integrity.verificationHash,
      reversalSummaryHash: reversal.integrity.summaryHash };
  });
  return { studies };
}

function identity(inputs) {
  const provenance = josekiProvenance();
  return { schemaVersion: 1, experiment: "joseki-forced-depth-sweep",
    studies: inputs.studies.map(({ studyId, nodeId, stateHash, terminalBestMoveKey,
      consensusMoveKey, continuationVerificationHash, reversalSummaryHash }) => ({ studyId, nodeId,
      stateHash, terminalBestMoveKey, consensusMoveKey, continuationVerificationHash, reversalSummaryHash })),
    depths: DEPTHS, timeLimitMs: TIME_LIMIT_MS,
    searchConfig: { level: "hard", searchProfile: "phase2", evaluationProfile: "bao",
      quiescenceDepth: 1 }, fixedRules: FIXED_RULES,
    sourceCommit: provenance.sourceCommit, node: provenance.node, sourceFileSha256: sourceHash() };
}

function assertIdentity(expected, actual, label) {
  if (stableStringify(expected) !== stableStringify(actual)) throw new Error(`${label} identity mismatch`);
}

function analyze(state, depth, seedParts) {
  const analysis = AI.analyzeMove(state, "hard", seededRandom(seedFrom("forced-depth-sweep-v1", ...seedParts)), {
    searchProfile: "phase2", evaluationProfile: "bao", maxDepth: depth,
    quiescenceDepth: 1, timeLimitMs: TIME_LIMIT_MS,
  });
  return { recommendedMoveKey: analysis.move ? moveKey(analysis.move) : null,
    rootScore: analysis.stats.rootScore, completedDepth: analysis.stats.completedDepth,
    timedOut: analysis.stats.timedOut, nodes: analysis.stats.nodes,
    evaluations: analysis.stats.evaluations, cutoffs: analysis.stats.cutoffs,
    cacheHits: analysis.stats.cacheHits, elapsedMs: analysis.stats.elapsedMs };
}

function runDepth(study, depth, experimentIdentity) {
  const started = process.hrtime.bigint();
  const root = analyze(study.state, depth, [study.studyId, depth, "root"]);
  const candidates = E.moveVariants(study.state).map((move) => {
    const key = moveKey(move);
    const child = E.applyMove(study.state, move).state;
    if (depth === 1) {
      return { moveKey: key, stateHash: hashValue(child), southScore: null,
        note: "depth-1 candidate score omitted because root quiescence cannot be reconstructed by a depth-0 analyzeMove call" };
    }
    const childAnalysis = analyze(child, depth - 1, [study.studyId, depth, key]);
    return { moveKey: key, stateHash: hashValue(child),
      southScore: childAnalysis.rootScore === null ? null : -childAnalysis.rootScore,
      analysis: childAnalysis };
  });
  const timedOut = root.timedOut || candidates.some(({ analysis }) => analysis?.timedOut);
  const terminalBest = candidates.find(({ moveKey: key }) => key === study.terminalBestMoveKey);
  const consensus = candidates.find(({ moveKey: key }) => key === study.consensusMoveKey);
  return { schemaVersion: 1, status: timedOut ? "timed-out" : "complete",
    studyId: study.studyId, nodeId: study.nodeId, stateHash: study.stateHash, depth,
    identity: experimentIdentity, root, candidates,
    comparison: { terminalBestMoveKey: study.terminalBestMoveKey,
      consensusMoveKey: study.consensusMoveKey,
      recommendedIsTerminalBest: root.recommendedMoveKey === study.terminalBestMoveKey,
      recommendedIsConsensus: root.recommendedMoveKey === study.consensusMoveKey,
      terminalBestMinusConsensus: terminalBest.southScore === null || consensus.southScore === null
        ? null : terminalBest.southScore - consensus.southScore },
    elapsedMs: Number(process.hrtime.bigint() - started) / 1e6 };
}

function counts(options) {
  const files = STUDY_IDS.flatMap((studyId) => DEPTHS.map((depth) => resultFile(options.output, studyId, depth)));
  const rows = files.filter((file) => fs.existsSync(file)).map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  return { completed: rows.filter(({ status }) => status === "complete").length,
    timedOut: rows.filter(({ status }) => status === "timed-out").length,
    recorded: rows.length, expected: files.length };
}

function writeProgress(options, experimentIdentity, startedAt, status, current = null) {
  const progress = counts(options);
  const elapsedSeconds = (Date.now() - Date.parse(startedAt)) / 1000;
  atomicWriteJson(path.join(options.output, "progress.json"), { schemaVersion: 1, status,
    startedAt, updatedAt: new Date().toISOString(), identity: experimentIdentity,
    ...progress, elapsedSeconds,
    etaSeconds: progress.recorded ? elapsedSeconds / progress.recorded * (progress.expected - progress.recorded) : null,
    current });
}

function run(options, inputs, experimentIdentity) {
  fs.mkdirSync(path.join(options.output, "results"), { recursive: true });
  const progressFile = path.join(options.output, "progress.json");
  const prior = fs.existsSync(progressFile) ? JSON.parse(fs.readFileSync(progressFile, "utf8")) : null;
  if (prior) assertIdentity(experimentIdentity, prior.identity, "Progress");
  const startedAt = prior?.startedAt || new Date().toISOString();
  writeProgress(options, experimentIdentity, startedAt, "running");
  for (const study of inputs.studies) {
    let stop = false;
    for (const depth of DEPTHS) {
      const file = resultFile(options.output, study.studyId, depth);
      if (fs.existsSync(file)) {
        const saved = JSON.parse(fs.readFileSync(file, "utf8"));
        assertIdentity(experimentIdentity, saved.identity, `${study.studyId}/d${depth}`);
        if (saved.status === "timed-out") stop = true;
        continue;
      }
      if (stop) break;
      writeProgress(options, experimentIdentity, startedAt, "running", { studyId: study.studyId, depth });
      const result = runDepth(study, depth, experimentIdentity);
      atomicWriteJson(file, result);
      if (result.status === "timed-out") stop = true;
    }
  }
  const current = counts(options);
  writeProgress(options, experimentIdentity, startedAt,
    current.recorded === current.expected || current.timedOut > 0 ? "complete" : "partial");
}

function verify(options, inputs, experimentIdentity) {
  if (sourceHash() !== experimentIdentity.sourceFileSha256) throw new Error("Depth sweep source hash changed");
  const rows = [];
  for (const study of inputs.studies) {
    let sawTimeout = false;
    for (const depth of DEPTHS) {
      const file = resultFile(options.output, study.studyId, depth);
      if (!fs.existsSync(file)) {
        if (!sawTimeout) throw new Error(`Missing depth sweep result: ${study.studyId}/d${depth}`);
        continue;
      }
      const row = JSON.parse(fs.readFileSync(file, "utf8"));
      assertIdentity(experimentIdentity, row.identity, `${study.studyId}/d${depth}`);
      if (row.studyId !== study.studyId || row.stateHash !== study.stateHash || row.depth !== depth
        || row.root.completedDepth > depth || row.candidates.length !== E.moveVariants(study.state).length) {
        throw new Error(`Depth sweep result mismatch: ${study.studyId}/d${depth}`);
      }
      if (depth <= 4) {
        const existing = study.phase2Scores[`bao-d${depth}`];
        if (row.root.recommendedMoveKey !== existing.recommendedMoveKey
          || row.root.rootScore !== existing.southSearchScore) {
          throw new Error(`Depth sweep baseline mismatch: ${study.studyId}/d${depth}`);
        }
      }
      if (row.status === "timed-out") sawTimeout = true;
      rows.push(row);
    }
  }
  const verification = { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    studies: inputs.studies.length, expectedRows: inputs.studies.length * DEPTHS.length,
    recordedRows: rows.length, completeRows: rows.filter(({ status }) => status === "complete").length,
    timedOutRows: rows.filter(({ status }) => status === "timed-out").length,
    baselineRowsMatched: rows.filter(({ depth }) => depth <= 4).length,
    sourceHashMatches: true,
    verificationHash: hashValue(rows.map(({ studyId, depth, status, root, comparison }) =>
      ({ studyId, depth, status, root, comparison }))) };
  atomicWriteJson(options.verification, verification);
  return { rows, verification };
}

function buildSummary(inputs, rows, verification) {
  const studies = inputs.studies.map((study) => {
    const results = rows.filter(({ studyId }) => studyId === study.studyId).sort((a, b) => a.depth - b.depth);
    const switches = results.filter(({ status, comparison }) => status === "complete" && comparison.recommendedIsTerminalBest);
    return { studyId: study.studyId.toUpperCase(), nodeId: study.nodeId,
      terminalBestMoveKey: study.terminalBestMoveKey, consensusMoveKey: study.consensusMoveKey,
      firstTerminalBestDepth: switches[0]?.depth ?? null,
      deepestCompletedDepth: Math.max(...results.filter(({ status }) => status === "complete").map(({ depth }) => depth)),
      timedOutAtDepth: results.find(({ status }) => status === "timed-out")?.depth ?? null,
      results: results.map(({ depth, status, root, comparison, elapsedMs }) => ({ depth, status,
        recommendedMoveKey: root.recommendedMoveKey, rootScore: root.rootScore,
        completedDepth: root.completedDepth, nodes: root.nodes, elapsedMs,
        terminalBestMinusConsensus: comparison.terminalBestMinusConsensus,
        recommendedIsTerminalBest: comparison.recommendedIsTerminalBest })) };
  });
  return { schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: studies.every(({ firstTerminalBestDepth }) => firstTerminalBestDepth !== null)
      ? "terminal-best-switch-observed" : "no-terminal-best-switch-through-completed-depth",
    scope: "phase2 bao iterative-deepening horizon sweep on exact P002 and P003 states",
    caveat: FIXED_RULES.interpretation, fixedRules: FIXED_RULES, depths: DEPTHS,
    studies, integrity: verification };
}

function shortMove(key, study) {
  if (key === study.terminalBestMoveKey) return "terminal-best";
  if (key === study.consensusMoveKey) return "consensus";
  return key;
}
function markdown(summary) {
  const rows = summary.studies.flatMap((study) => study.results.map((result) => `| ${study.studyId} | ${result.depth} | ${result.status} | ${shortMove(result.recommendedMoveKey, study)} | ${result.rootScore} | ${result.terminalBestMinusConsensus ?? "n/a"} | ${result.nodes} | ${result.elapsedMs.toFixed(1)} |`));
  return ["# P002・P003 探索depth sweep", "", `生成日時: ${summary.generatedAt}`, "",
    `判定: \`${summary.status}\``, "",
    "P002・P003の正確な局面をphase2・bao・quiescence depth 1でdepth 1〜8まで反復深化し、終局首位手へ推奨が切り替わるかを調べた。候補値差はterminal-best − consensusで、負値は探索が合意手を支持することを示す。", "",
    "| 局面 | depth | 状態 | 推奨 | root値 | 候補値差 | nodes | ms |",
    "| --- | ---: | --- | --- | ---: | ---: | ---: | ---: |", ...rows, "",
    "## 到達点", "", ...summary.studies.map((study) => `- ${study.studyId}: 最深完了depth ${study.deepestCompletedDepth}、terminal-best切替 ${study.firstTerminalBestDepth ?? "なし"}、timeout ${study.timedOutAtDepth ?? "なし"}`), "",
    "切替がない場合も、最深完了depthより先を否定するものではない。depth増加時の候補値差と計算量を次の延長判断に使う。", "",
    "## 完全性", "", `- 記録: ${summary.integrity.recordedRows}/${summary.integrity.expectedRows}`,
    `- 既存depth 1〜4一致: ${summary.integrity.baselineRowsMatched}`,
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
    status: summary.status, studies: summary.studies, integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { buildSummary, identity, loadInputs, markdown, parseArgs, runDepth };
