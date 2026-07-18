#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson, hashValue } = require("./lib/joseki-common.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/summarize-joseki-evidence-axes.js";

function parseArgs(argv) {
  const options = {
    artifacts: "artifacts/joseki-study",
    output: "artifacts/joseki-study/summaries/evidence-axes-summary.json",
    verification: "artifacts/joseki-study/verified/evidence-axes-verification.json",
    markdown: "doc/joseki/EVIDENCE_AXES.md",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const field = ({ "--artifacts": "artifacts", "--output": "output",
      "--verification": "verification", "--markdown": "markdown" })[argv[index]];
    if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
    options[field] = argv[index + 1];
  }
  return options;
}

function read(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function sourceHash() {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, SOURCE_FILE))).digest("hex");
}

function load(options) {
  const summaries = path.join(options.artifacts, "summaries");
  const verified = path.join(options.artifacts, "verified");
  return {
    p002Study: read(path.join(summaries, "forced-p002-summary.json")),
    p002Deep: read(path.join(options.artifacts, "robustness/forced-depth-sweep/results/p002-d8.json")),
    p002Bounded: read(path.join(verified, "p002-bounded-win-proof.json")),
    p003Study: read(path.join(summaries, "forced-p003-summary.json")),
    p003Deep: read(path.join(summaries, "p003-depth11-complete-summary.json")),
    p003Bounded: read(path.join(summaries, "p003-bounded-outcomes-summary.json")),
  };
}

function rankScores(entries) {
  return [...entries].sort((left, right) => right.southScore - left.southScore)
    .map((entry, index) => ({ ...entry, deepSearchRank: index + 1 }));
}

function build(inputs) {
  const p002Deep = rankScores(inputs.p002Deep.candidates.map(({ moveKey, southScore }) =>
    ({ moveKey, southScore })));
  const p003Deep = inputs.p003Deep.ranking.map(({ moveKey, southScore, rank }) =>
    ({ moveKey, southScore, deepSearchRank: rank }));
  const p003Bounded = new Map(inputs.p003Bounded.results
    .filter(({ horizonPlies }) => horizonPlies === 13)
    .map((result) => [result.moveKey, result.outcome]));

  function studyRows(studyId, study, deepEntries, boundedFor) {
    return study.rankings.map((candidate) => {
      const deep = deepEntries.find(({ moveKey }) => moveKey === candidate.moveKey);
      const boundedOutcome = boundedFor(candidate.moveKey);
      let evidenceState = "screened-out";
      if (boundedOutcome === "south-forced-win") evidenceState = "bounded-forced-win-supported";
      else if (deep.deepSearchRank === 1 && boundedOutcome === "unresolved") {
        evidenceState = "deep-search-supported-bounded-unresolved";
      }
      return { studyId, moveKey: candidate.moveKey,
        crossMethodConsensus: candidate.isConsensusMove,
        fixedSelfPlay: { southWins: candidate.southWins, games: candidate.games,
          rank: study.rankings.indexOf(candidate) + 1,
          interpretation: "follow-up-policy outcome; not a minimax move rank" },
        deepSearch: { southScore: deep.southScore, rank: deep.deepSearchRank,
          rootDepth: studyId === "P002" ? 8 : 11 },
        boundedTerminal: { outcome: boundedOutcome,
          horizonPlies: studyId === "P002" ? 9 : 13 },
        evidenceState,
        promotionEligible: false };
    });
  }

  const p002Bounded = new Map(inputs.p002Bounded.candidateResults.map((result) =>
    [result.moveKey, result.southCanForceWin ? "south-forced-win" : "not-south-forced"]));
  const rows = [
    ...studyRows("P002", inputs.p002Study, p002Deep,
      (moveKey) => p002Bounded.get(moveKey)),
    ...studyRows("P003", inputs.p003Study, p003Deep,
      (moveKey) => p003Bounded.get(moveKey)),
  ];
  const studies = ["P002", "P003"].map((studyId) => {
    const candidates = rows.filter((row) => row.studyId === studyId);
    const consensus = candidates.find(({ crossMethodConsensus }) => crossMethodConsensus);
    return { studyId, candidates: candidates.length,
      fixedSelfPlayLeaderMoveKey: [...candidates]
        .sort((left, right) => right.fixedSelfPlay.southWins - left.fixedSelfPlay.southWins)[0].moveKey,
      deepSearchLeaderMoveKey: candidates.find(({ deepSearch: { rank } }) => rank === 1).moveKey,
      consensusMoveKey: consensus.moveKey,
      consensusEvidenceState: consensus.evidenceState,
      axesAgreeOnConsensus: consensus.fixedSelfPlay.rank === 1
        && consensus.deepSearch.rank === 1
        && consensus.boundedTerminal.outcome === "south-forced-win",
      promotionEligible: false,
      decision: studyId === "P002" ? "bounded-consensus-supported-no-promotion"
        : "deep-consensus-supported-bounded-unresolved-no-promotion" };
  });
  const policy = { schemaVersion: 1,
    axes: {
      fixedSelfPlay: "Stress test of a fixed follow-up policy; never treated as a game-theoretic rank.",
      deepSearch: "Relative score/rank at the deepest completed common search depth.",
      boundedTerminal: "Evaluator-free forced terminal outcome within an explicit horizon.",
      crossMethodConsensus: "Whether phase2 and the predeclared MCTS seeds selected the move." },
    classificationPriority: ["bounded terminal proof", "deep common-depth search",
      "cross-method stability", "fixed-policy self-play"],
    promotionRule: "No row is promotion-eligible without a separate rules implementation or human-game validation, even when an engine-rules bounded win exists.",
    prohibitedInference: "A fixed-self-play win-count leader is not called terminal-best, minimax-best, or theoretically best." };
  return { rows, studies, policy };
}

function verify(inputs, built) {
  const sourceFileSha256 = sourceHash();
  const inputHashes = {
    p002Study: hashValue(inputs.p002Study), p002Deep: hashValue(inputs.p002Deep),
    p002Bounded: hashValue(inputs.p002Bounded), p003Study: hashValue(inputs.p003Study),
    p003Deep: hashValue(inputs.p003Deep), p003Bounded: hashValue(inputs.p003Bounded) };
  const verification = { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    sourceFileSha256, inputHashes, studies: built.studies.length,
    candidates: built.rows.length,
    promotionEligibleRows: built.rows.filter(({ promotionEligible }) => promotionEligible).length,
    fixedSelfPlayDeepRankDisagreements: built.rows.filter((row) =>
      (row.fixedSelfPlay.rank === 1) !== (row.deepSearch.rank === 1)).length,
    verificationHash: hashValue({ sourceFileSha256, inputHashes,
      rows: built.rows, studies: built.studies, policy: built.policy }) };
  if (verification.studies !== 2 || verification.candidates !== 6
    || verification.promotionEligibleRows !== 0
    || built.studies.some(({ deepSearchLeaderMoveKey, consensusMoveKey }) =>
      deepSearchLeaderMoveKey !== consensusMoveKey)) throw new Error("Evidence-axis verification failed");
  return verification;
}

function markdown(summary) {
  return ["# 定石候補の証拠軸と判定表", "", `生成日時: ${summary.generatedAt}`, "",
    "固定自己対局勝数、深い共通探索、有界強制終局、cross-method一致を別々の証拠軸として記録する。左から右へ単純加点せず、各軸が答える問いを限定する。", "",
    "| 局面 | 着手 | 固定自己対局 | 深い探索 | 有界終局 | consensus | 証拠状態 |",
    "| --- | --- | ---: | ---: | --- | --- | --- |",
    ...summary.rows.map((row) => `| ${row.studyId} | \`${row.moveKey}\` | ${row.fixedSelfPlay.southWins}/${row.fixedSelfPlay.games} (#${row.fixedSelfPlay.rank}) | ${row.deepSearch.southScore} (#${row.deepSearch.rank}, d${row.deepSearch.rootDepth}) | ${row.boundedTerminal.outcome} (${row.boundedTerminal.horizonPlies} ply) | ${row.crossMethodConsensus ? "yes" : "no"} | \`${row.evidenceState}\` |`), "",
    "## 判定", "", ...summary.studies.map((study) =>
      `- ${study.studyId}: \`${study.decision}\`。固定自己対局首位は\`${study.fixedSelfPlayLeaderMoveKey}\`、深い探索首位・consensusは\`${study.deepSearchLeaderMoveKey}\`。`), "",
    "P002は現ルール実装内の有界強制勝ちが最優先証拠となる。P003は深い探索首位とconsensusが一致する一方、13 ply有界終局は全候補未解決である。どちらも別ルール実装または人間対局検証がないため昇格しない。", "",
    "## 運用規則", "", `1. ${summary.policy.classificationPriority.join(" → ")}`,
    `2. ${summary.policy.prohibitedInference}`, `3. ${summary.policy.promotionRule}`, "",
    "## 完全性", "", `- candidates: ${summary.integrity.candidates}`,
    `- fixed-self-play/deep-rank disagreements: ${summary.integrity.fixedSelfPlayDeepRankDisagreements}`,
    `- promotion eligible: ${summary.integrity.promotionEligibleRows}`,
    `- source sha256: \`${summary.integrity.sourceFileSha256}\``,
    `- verification hash: \`${summary.integrity.verificationHash}\``, ""].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputs = load(options);
  const built = build(inputs);
  const integrity = verify(inputs, built);
  const summary = { schemaVersion: 1, generatedAt: new Date().toISOString(),
    status: "evidence-axes-separated-no-promotion", ...built, integrity };
  atomicWriteJson(options.output, summary);
  atomicWriteJson(options.verification, integrity);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(summary));
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown,
    status: summary.status, studies: summary.studies, integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { build, load, markdown, parseArgs, verify };
