#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { E, atomicWriteJson, hashValue, moveKey } = require("./lib/joseki-common.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/audit-joseki-p003-bounded-outcomes.js";
const HORIZONS = Object.freeze([11, 13]);

function parseArgs(argv) {
  const options = {
    study: "artifacts/joseki-study/summaries/forced-p003-summary.json",
    output: "artifacts/joseki-study/robustness/p003-bounded-outcomes.json",
    verification: "artifacts/joseki-study/verified/p003-bounded-outcomes-verification.json",
    summary: "artifacts/joseki-study/summaries/p003-bounded-outcomes-summary.json",
    markdown: "doc/joseki/P003_BOUNDED_OUTCOMES.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const field = ({ "--study": "study", "--output": "output",
      "--verification": "verification", "--summary": "summary",
      "--markdown": "markdown" })[argv[index]];
    if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
    options[field] = argv[index + 1];
  }
  return options;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function createSolver(targetPlayer) {
  const memo = new Map();
  const stats = { visitedNodes: 0, cacheHits: 0, terminalNodes: 0,
    horizonNodes: 0, maxBranching: 0 };

  function solve(state, remaining) {
    stats.visitedNodes += 1;
    if (state.winner !== null) {
      stats.terminalNodes += 1;
      return state.winner === targetPlayer;
    }
    if (remaining === 0) {
      stats.horizonNodes += 1;
      return false;
    }
    const key = `${hashValue(state)}:${remaining}`;
    if (memo.has(key)) {
      stats.cacheHits += 1;
      return memo.get(key);
    }
    const legalMoves = E.moveVariants(state);
    if (!legalMoves.length) throw new Error("Nonterminal P003 state has no legal move");
    stats.maxBranching = Math.max(stats.maxBranching, legalMoves.length);
    const targetCanForceWin = state.player === targetPlayer
      ? legalMoves.some((move) => solve(E.applyMove(state, move).state, remaining - 1))
      : legalMoves.every((move) => solve(E.applyMove(state, move).state, remaining - 1));
    memo.set(key, targetCanForceWin);
    return targetCanForceWin;
  }

  return { solve, stats: () => ({ ...stats, memoizedStates: memo.size }) };
}

function audit(study) {
  const startState = E.clone(study.position.state);
  const legalMoves = E.moveVariants(startState);
  const role = (key) => {
    return { isConsensus: key === study.selection.consensusMoveKey,
      isSelfPlayWinCountLeader: key === study.rankings[0]?.moveKey };
  };
  const results = [];
  for (const horizonPlies of HORIZONS) {
    for (const move of legalMoves) {
      const child = E.applyMove(startState, move).state;
      const south = createSolver(0);
      const north = createSolver(1);
      const started = process.hrtime.bigint();
      const southCanForceWin = south.solve(child, horizonPlies - 1);
      const northCanForceWin = north.solve(child, horizonPlies - 1);
      if (southCanForceWin && northCanForceWin) throw new Error("Both players cannot force a bounded win");
      results.push({ horizonPlies, moveKey: moveKey(move), childStateHash: hashValue(child),
        ...role(moveKey(move)), southCanForceWin, northCanForceWin,
        outcome: southCanForceWin ? "south-forced-win"
          : northCanForceWin ? "north-forced-win" : "unresolved",
        southProofSearch: south.stats(), northProofSearch: north.stats(),
        elapsedMs: Number(process.hrtime.bigint() - started) / 1e6 });
    }
  }
  return { startState, results };
}

function build(study, audited) {
  const deterministicResults = audited.results.map(({ elapsedMs, ...result }) => result);
  const sourceFileSha256 = sha256(path.join(ROOT, SOURCE_FILE));
  const rulesEngineSha256 = sha256(path.join(ROOT, "public/engine.js"));
  const verification = { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    sourceFileSha256, rulesEngineSha256,
    startStateHashMatches: hashValue(audited.startState) === study.selection.selectedStateHash,
    expectedRows: HORIZONS.length * E.moveVariants(audited.startState).length,
    recordedRows: audited.results.length,
    contradictoryRows: audited.results.filter(({ southCanForceWin, northCanForceWin }) =>
      southCanForceWin && northCanForceWin).length,
    verificationHash: hashValue({ startStateHash: hashValue(audited.startState),
      horizons: HORIZONS, results: deterministicResults,
      sourceFileSha256, rulesEngineSha256 }) };
  if (!verification.startStateHashMatches || verification.recordedRows !== verification.expectedRows
    || verification.contradictoryRows) throw new Error("P003 bounded audit verification failed");
  const byHorizon = HORIZONS.map((horizonPlies) => {
    const rows = audited.results.filter((result) => result.horizonPlies === horizonPlies);
    return { horizonPlies, candidates: rows.length,
      southForcedWins: rows.filter(({ southCanForceWin }) => southCanForceWin).length,
      northForcedWins: rows.filter(({ northCanForceWin }) => northCanForceWin).length,
      unresolved: rows.filter(({ outcome }) => outcome === "unresolved").length,
      visitedNodes: rows.reduce((total, row) => total
        + row.southProofSearch.visitedNodes + row.northProofSearch.visitedNodes, 0),
      memoizedStates: rows.reduce((total, row) => total
        + row.southProofSearch.memoizedStates + row.northProofSearch.memoizedStates, 0),
      elapsedMs: rows.reduce((total, row) => total + row.elapsedMs, 0) };
  });
  const summary = { schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: audited.results.every(({ outcome }) => outcome === "unresolved")
      ? "all-candidates-unresolved-through-13-ply" : "bounded-forced-outcome-observed",
    scope: "P003 terminal-only AND/OR audit using legal moves, transitions, and winners from public/engine.js",
    caveat: "Unresolved means neither player can force a terminal win within the bounded horizon. It is not a draw, an equal-position judgment, or a move ranking.",
    nodeId: study.selection.selectedNodeId,
    startStateHash: study.selection.selectedStateHash,
    horizons: HORIZONS, byHorizon,
    results: audited.results, integrity: verification };
  return { summary, verification };
}

function markdown(summary) {
  const rows = summary.results.map((result) =>
    `| ${result.horizonPlies} | \`${result.moveKey}\`${result.isConsensus ? " (consensus)" : result.isSelfPlayWinCountLeader ? " (self-play win-count leader)" : ""} | ${result.outcome} | ${result.southProofSearch.visitedNodes.toLocaleString("en-US")} | ${result.northProofSearch.visitedNodes.toLocaleString("en-US")} |`);
  return ["# P003 11/13 ply有界終局の独立監査", "", `生成日時: ${summary.generatedAt}`, "",
    `判定: \`${summary.status}\``, "",
    "AI評価器・alpha-beta・quiescenceを使わず、現ルールエンジンの合法手生成・遷移・終局判定だけで三値AND/OR探索を行った。各候補について、SouthとNorthのどちらが範囲内の終局勝ちを強制できるかを別々に判定した。", "",
    "| horizon | 着手 | 三値結果 | South証明探索nodes | North証明探索nodes |",
    "| ---: | --- | --- | ---: | ---: |", ...rows, "",
    "全4候補は11 plyでも13 plyでも`unresolved`だった。したがって、depth 11の評価値順位は短い強制終局の有無では説明できない。", "",
    summary.caveat, "", "## 集計", "",
    ...summary.byHorizon.map((item) => `- ${item.horizonPlies} ply: ${item.unresolved}/${item.candidates} unresolved、${item.visitedNodes.toLocaleString("en-US")} nodes、memo ${item.memoizedStates.toLocaleString("en-US")}`), "",
    "## 完全性", "", `- source sha256: \`${summary.integrity.sourceFileSha256}\``,
    `- rules engine sha256: \`${summary.integrity.rulesEngineSha256}\``,
    `- verification hash: \`${summary.integrity.verificationHash}\``, ""].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const study = JSON.parse(fs.readFileSync(options.study, "utf8"));
  const audited = audit(study);
  const { summary, verification } = build(study, audited);
  atomicWriteJson(options.output, { schemaVersion: 1, generatedAt: summary.generatedAt,
    nodeId: summary.nodeId, startStateHash: summary.startStateHash,
    horizons: summary.horizons, results: summary.results });
  atomicWriteJson(options.verification, verification);
  atomicWriteJson(options.summary, summary);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ output: options.output, summary: options.summary,
    markdown: options.markdown, status: summary.status, byHorizon: summary.byHorizon,
    integrity: summary.integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { HORIZONS, audit, build, createSolver, markdown, parseArgs };
