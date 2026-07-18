#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { AI, E, atomicWriteJson, hashValue, moveKey, stableStringify } = require("./lib/joseki-common.js");
const { seedFrom, seededRandom } = require("./paired-first-player-common.js");

const DEPTH = 8;
const WIN_THRESHOLD = 500_000;

function parseArgs(argv) {
  const options = {
    study: "artifacts/joseki-study/summaries/forced-p002-summary.json",
    sweep: "artifacts/joseki-study/robustness/forced-depth-sweep/results/p002-d8.json",
    blocks: "artifacts/joseki-study/robustness/forced-p002/blocks",
    output: "artifacts/joseki-study/verified/p002-depth8-win-verification.json",
    markdown: "doc/joseki/P002_DEPTH8_WIN.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const field = ({ "--study": "study", "--sweep": "sweep", "--blocks": "blocks",
      "--output": "output", "--markdown": "markdown" })[argv[index]];
    if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
    options[field] = argv[index + 1];
  }
  return options;
}

function analyze(state, depth, ply) {
  return AI.analyzeMove(state, "hard", seededRandom(seedFrom("p002-depth8-win-v1", depth, ply)), {
    searchProfile: "phase2", evaluationProfile: "bao", maxDepth: depth,
    quiescenceDepth: 1, timeLimitMs: 60_000,
  });
}

function reconstruct(study, sweep) {
  let state = E.clone(study.position.state);
  const line = [];
  for (let depth = DEPTH; depth >= 1 && state.winner === null; depth -= 1) {
    const legalMoves = E.moveVariants(state);
    const analysis = analyze(state, depth, line.length + 1);
    if (analysis.stats.timedOut || analysis.stats.completedDepth !== depth || !analysis.move) {
      throw new Error(`Incomplete P002 principal variation at depth ${depth}`);
    }
    const key = moveKey(analysis.move);
    const applied = E.applyMove(state, analysis.move);
    line.push({ ply: line.length + 1, depth, player: state.player,
      stateHash: hashValue(state), legalMoveCount: legalMoves.length,
      moveKey: key, rootScore: analysis.stats.rootScore,
      nodes: analysis.stats.nodes, eventsHash: hashValue(applied.events) });
    state = applied.state;
  }
  const quiescence = [];
  while (state.winner === null && quiescence.length < 1) {
    const legalMoves = E.moveVariants(state);
    if (!legalMoves.length || legalMoves.some(({ type }) => type !== "capture")) break;
    if (legalMoves.length !== 1) throw new Error("P002 quiescence continuation is not uniquely forced");
    const applied = E.applyMove(state, legalMoves[0]);
    quiescence.push({ ply: line.length + quiescence.length + 1, player: state.player,
      stateHash: hashValue(state), legalMoveCount: legalMoves.length,
      moveKey: moveKey(legalMoves[0]), eventsHash: hashValue(applied.events) });
    state = applied.state;
  }
  if (line[0].moveKey !== study.selection.consensusMoveKey
    || line[0].moveKey !== sweep.root.recommendedMoveKey
    || line[0].rootScore !== sweep.root.rootScore || line[0].rootScore < WIN_THRESHOLD
    || state.winner !== 0 || state.reason !== "front-empty") {
    throw new Error("P002 depth-8 forced-win verification failed");
  }
  return { line, quiescence, finalState: state, finalStateHash: hashValue(state) };
}

function replay(startState, result) {
  let state = E.clone(startState);
  for (const item of [...result.line, ...result.quiescence]) {
    if (hashValue(state) !== item.stateHash) throw new Error(`P002 PV state mismatch at ply ${item.ply}`);
    const moves = E.moveVariants(state);
    if (moves.length !== item.legalMoveCount) throw new Error(`P002 PV legal-count mismatch at ply ${item.ply}`);
    const move = moves.find((candidate) => moveKey(candidate) === item.moveKey);
    if (!move) throw new Error(`P002 PV illegal move at ply ${item.ply}`);
    state = E.applyMove(state, move).state;
  }
  if (stableStringify(state) !== stableStringify(result.finalState)
    || hashValue(state) !== result.finalStateHash) throw new Error("P002 PV final replay mismatch");
  return state;
}

function compareContinuations(study, result, blocksDirectory) {
  const consensus = study.rankings.find(({ isConsensusMove }) => isConsensusMove);
  const block = JSON.parse(fs.readFileSync(path.join(blocksDirectory, `${consensus.candidateId}.json`), "utf8"));
  const principalVariation = [...result.line, ...result.quiescence].map(({ moveKey: key }) => key);
  return block.results.map((saved) => {
    const actual = [saved.fixedMoveKey, ...saved.continuationMoveKeys];
    let commonPrefixPlies = 0;
    while (commonPrefixPlies < principalVariation.length && commonPrefixPlies < actual.length
      && principalVariation[commonPrefixPlies] === actual[commonPrefixPlies]) commonPrefixPlies += 1;
    return { conditionId: saved.conditionId, winner: saved.winner,
      commonPrefixPlies, followsFullWinningLine: commonPrefixPlies === principalVariation.length,
      divergencePly: commonPrefixPlies === principalVariation.length ? null : commonPrefixPlies + 1,
      principalVariationMoveKey: principalVariation[commonPrefixPlies] ?? null,
      actualMoveKey: actual[commonPrefixPlies] ?? null };
  });
}

function buildVerification(study, sweep, result, blocksDirectory) {
  const replayed = replay(study.position.state, result);
  const northMoves = result.line.filter(({ player }) => player === 1);
  const continuationComparison = compareContinuations(study, result, blocksDirectory);
  return { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    scope: "engine depth-8 phase2 bao minimax principal variation plus one quiescence capture",
    caveat: "This verifies the engine search result and replayed terminal line; it is not an implementation-independent game-theoretic proof.",
    nodeId: study.selection.selectedNodeId, startStateHash: study.selection.selectedStateHash,
    consensusMoveKey: study.selection.consensusMoveKey,
    rootScore: sweep.root.rootScore, completedDepth: sweep.root.completedDepth,
    searchPlies: result.line.length, quiescencePlies: result.quiescence.length,
    totalPlies: result.line.length + result.quiescence.length,
    northPrincipalVariationMoves: northMoves.length,
    northPrincipalVariationMovesAllForced: northMoves.every(({ legalMoveCount }) => legalMoveCount === 1),
    winner: replayed.winner, reason: replayed.reason, finalStateHash: result.finalStateHash,
    finalState: result.finalState,
    line: result.line, quiescence: result.quiescence,
    continuationComparison,
    fullLineFollowers: continuationComparison.filter(({ followsFullWinningLine }) => followsFullWinningLine).length,
    lineHash: hashValue({ line: result.line, quiescence: result.quiescence,
      finalStateHash: result.finalStateHash }),
    sweepVerificationHash: sweep.identity ? hashValue({ studyId: sweep.studyId, depth: sweep.depth,
      root: sweep.root, comparison: sweep.comparison }) : null };
}

function markdown(verification) {
  const rows = [...verification.line, ...verification.quiescence].map((item) =>
    `| ${item.ply} | ${item.player === 0 ? "South" : "North"} | ${item.depth ?? "q"} | ${item.legalMoveCount} | \`${item.moveKey}\` | ${item.rootScore ?? "terminal"} |`);
  return ["# P002 depth 8 強制勝ち系列の検証", "", `生成日時: ${verification.verifiedAt}`, "",
    "phase2・bao・depth 8・quiescence depth 1が返した勝ちスコアを主変化として再構成し、全着手を再適用した。これは現在の探索実装内の検証であり、独立実装によるゲーム理論的証明ではない。", "",
    `- root score: ${verification.rootScore}`,
    `- 探索ply: ${verification.searchPlies}`,
    `- quiescence ply: ${verification.quiescencePlies}`,
    `- 終局: South勝、${verification.reason}`,
    `- North主変化応手は全て1択: ${verification.northPrincipalVariationMovesAllForced ? "yes" : "no"}`, "",
    "| ply | 手番 | 残depth | 合法手 | 着手 | root値 |", "| ---: | --- | ---: | ---: | --- | ---: |",
    ...rows, "", "## 解釈", "",
    "- P002の探索合意手は、depth 8では単に静的評価が高いだけでなく、探索器が9 ply以内の終局勝ちを検出している。",
    "- 3/6勝だった固定自己対局は、この強制勝ちを常に実現できていない。自己対局勝数を手の真の優劣と同一視できない。",
    "- P002を事後的に定石へ昇格はしない。候補基準は変更せず、保存自己対局がどこで勝ち系列から外れたかを下で比較する。", "",
    "## 保存自己対局との比較", "",
    "| 条件 | 勝者 | 共通prefix | 分岐ply | 強制勝ち側 | 実際 |", "| --- | --- | ---: | ---: | --- | --- |",
    ...verification.continuationComparison.map((item) => `| ${item.conditionId} | ${item.winner === 0 ? "South" : "North"} | ${item.commonPrefixPlies} | ${item.divergencePly ?? "なし"} | ${item.principalVariationMoveKey ? `\`${item.principalVariationMoveKey}\`` : "—"} | ${item.actualMoveKey ? `\`${item.actualMoveKey}\`` : "—"} |`), "",
    "bao-d3・d4は全9手を一致してSouth勝となった。敗戦条件は3手目または5手目のSouth着手で系列から外れており、固定した合意初手自体ではなく、その後の浅い方策が勝ち筋を維持できなかった。legacy-d2は3手目で外れても別経路で勝つため、この主変化だけが唯一の勝ち筋とは断定しない。", "",
    "## 完全性", "", `- final state hash: \`${verification.finalStateHash}\``,
    `- line hash: \`${verification.lineHash}\``, ""].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const study = JSON.parse(fs.readFileSync(options.study, "utf8"));
  const sweep = JSON.parse(fs.readFileSync(options.sweep, "utf8"));
  const result = reconstruct(study, sweep);
  const verification = buildVerification(study, sweep, result, options.blocks);
  atomicWriteJson(options.output, verification);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(verification));
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown,
    rootScore: verification.rootScore, totalPlies: verification.totalPlies,
    northPrincipalVariationMovesAllForced: verification.northPrincipalVariationMovesAllForced,
    winner: verification.winner, reason: verification.reason,
    finalStateHash: verification.finalStateHash, lineHash: verification.lineHash }, null, 2));
}

if (require.main === module) main();
module.exports = { buildVerification, compareContinuations, markdown, parseArgs, reconstruct, replay };
