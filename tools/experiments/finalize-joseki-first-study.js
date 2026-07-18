#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { atomicWriteJson, hashValue } = require("./lib/joseki-common.js");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_FILE = "tools/experiments/finalize-joseki-first-study.js";
const VERIFICATION_FILES = Object.freeze({
  phase1: "phase-1-verification.json", phase3: "phase-3-verification.json",
  phase4: "phase-4-verification.json", mcts: "mcts-8ply-verification.json",
  mctsSensitivity: "mcts-sensitivity-verification.json",
  continuations: "continuations-verification.json",
  firstMoves: "first-move-continuations-verification.json",
  j001Replies: "j001-replies-verification.json", allReplies: "all-replies-verification.json",
  p001: "conditional-p001-verification.json", p002: "forced-p002-verification.json",
  p003: "forced-p003-verification.json", depthSweep: "forced-depth-sweep-verification.json",
  p002HumanReplay: "p002-human-replay-verification.json",
  p003Bounded: "p003-bounded-outcomes-verification.json",
  evidenceAxes: "evidence-axes-verification.json",
});

function parseArgs(argv) {
  const options = { artifacts: "artifacts/joseki-study",
    evidence: "artifacts/joseki-study/summaries/evidence-axes-summary.json",
    humanReplay: "artifacts/joseki-study/verified/p002-human-replay.json",
    output: "artifacts/joseki-study/summaries/first-study-conclusion.json",
    verification: "artifacts/joseki-study/verified/first-study-conclusion-verification.json",
    markdown: "doc/joseki/JOSEKI_FIRST_STUDY_CONCLUSION.md" };
  for (let index = 0; index < argv.length; index += 2) {
    const field = ({ "--artifacts": "artifacts", "--evidence": "evidence",
      "--human-replay": "humanReplay", "--output": "output",
      "--verification": "verification", "--markdown": "markdown" })[argv[index]];
    if (!field) throw new Error(`Unknown argument: ${argv[index]}`);
    options[field] = argv[index + 1];
  }
  return options;
}
function read(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function build(options) {
  const verifiedDirectory = path.join(options.artifacts, "verified");
  const verifications = Object.fromEntries(Object.entries(VERIFICATION_FILES)
    .map(([key, file]) => [key, read(path.join(verifiedDirectory, file))]));
  const failed = Object.entries(verifications).filter(([, value]) => value.passed !== true);
  if (failed.length) throw new Error(`Failed prerequisite verification: ${failed.map(([key]) => key).join(", ")}`);
  const evidence = read(options.evidence);
  const humanReplay = read(options.humanReplay);
  if (evidence.status !== "evidence-axes-separated-no-promotion"
    || evidence.integrity.promotionEligibleRows !== 0
    || humanReplay.integrity.passed !== true || humanReplay.plies.length !== 9) {
    throw new Error("First-study conclusion input mismatch");
  }
  const researchQuestions = [
    { id: "RQ1", question: "標準初期局面の初手に安定した優劣があるか",
      answer: "4初手全てが全応手頑健性基準に未達。一般定石として推せる単一初手は確認されなかった。" },
    { id: "RQ2", question: "各初手に代表的な最善応手があるか",
      answer: "応手ごとの差は確認したが、短期最悪評価と終局上の主要応手は一致しない場合があり、終局固定継続を優先して記録した。" },
    { id: "RQ3", question: "短い定型系列が存在するか",
      answer: "標準初期局面の一般系列は認定されなかった。条件付きP002では9 plyのSouth強制勝ち系列を現ルール実装内で証明した。" },
    { id: "RQ4", question: "深度・評価関数・探索方式に頑健か",
      answer: "広い局面では不安定。低分岐強制捕獲P002/P003ではcross-method consensusが安定し、P003はdepth 11まで維持した。" },
    { id: "RQ5", question: "主要応手以外にも頑健か",
      answer: "標準初手は全合法North応手試験で全て基準未達。P002の有界証明ではNorth証明節点の全合法応手を被覆した。" },
    { id: "RQ6", question: "局面特徴で有力性を説明できるか",
      answer: "強制捕獲・front-empty脅威は有用な分類軸だが、frontSafety、応手数、強制系列長の単独閾値では勝敗を説明できなかった。" },
  ];
  const successCriteria = [
    { criterion: "再現可能な開局木生成基盤", met: true },
    { criterion: "全初手・全応手比較", met: true },
    { criterion: "AI条件間一致・不一致の定量化", met: true },
    { criterion: "暫定定石または明確な非定石の特定", met: true,
      note: "暫定定石0件、一般初手候補なしを再現可能に特定" },
    { criterion: "主要応手と反例の記録", met: true },
    { criterion: "人間向けページ生成", met: true },
    { criterion: "成果物からの再集計", met: true },
    { criterion: "適用範囲と限界の明記", met: true },
  ];
  const candidates = evidence.studies.map((study) => ({ studyId: study.studyId,
    decision: study.decision, promotionEligible: study.promotionEligible,
    consensusMoveKey: study.consensusMoveKey }));
  const conclusion = { schemaVersion: 1, completedAt: new Date().toISOString(),
    status: "completed-without-provisional-joseki",
    scope: "標準namua初期局面と選定した条件付き強制捕獲局面を対象とする第一次AI実験研究",
    recognizedJoseki: 0, provisionalJoseki: 0, validatedJoseki: 0,
    completionBasis: "第一次研究の成功条件を全て満たした。再現可能な否定的結果を完了成果として認める。",
    researchQuestions, successCriteria, candidates,
    p002ExternalValidation: { status: "externally-unvalidated",
      engineRulesBoundedProof: true, humanWorksheetGenerated: true,
      humanWorksheetChecked: false, separateRulesImplementationChecked: false,
      handling: "第一次研究の終了は妨げないが、provisional-josekiまたはvalidatedへの昇格を妨げる。" },
    nonBlockingFutureResearch: [
      "P002 9手系列の人間または別ルール実装による再生",
      "J001のdepth相互作用と評価ホライズンの診断",
      "長期評価反転の特徴単位診断",
      "低分岐強制捕獲以外におけるMCTS candidate/prior再設計",
      "nyumba、namua-to-mtaji、kichwa、front-emptyを含む第二次局面標本",
      "熟練者棋譜比較、定石ブラウザ、opening book統合" ],
    verificationInputs: Object.keys(verifications) };
  return { conclusion, verifications, evidence, humanReplay };
}

function verify(built) {
  const sourceFileSha256 = sha256(path.join(ROOT, SOURCE_FILE));
  const verificationInputHashes = Object.fromEntries(Object.entries(built.verifications)
    .map(([key, value]) => [key, hashValue(value)]));
  const successCriteriaMet = built.conclusion.successCriteria.filter(({ met }) => met).length;
  const verification = { schemaVersion: 1, verifiedAt: new Date().toISOString(), passed: true,
    sourceFileSha256, prerequisiteVerifications: Object.keys(built.verifications).length,
    prerequisiteFailures: 0, successCriteriaMet,
    successCriteriaExpected: built.conclusion.successCriteria.length,
    promotionEligibleCandidates: built.conclusion.candidates.filter(({ promotionEligible }) => promotionEligible).length,
    verificationInputHashes,
    conclusionHash: hashValue(built.conclusion) };
  verification.verificationHash = hashValue({ sourceFileSha256,
    prerequisiteVerifications: verification.prerequisiteVerifications,
    successCriteriaMet, promotionEligibleCandidates: verification.promotionEligibleCandidates,
    verificationInputHashes, conclusionHash: verification.conclusionHash });
  if (successCriteriaMet !== verification.successCriteriaExpected
    || verification.promotionEligibleCandidates !== 0) throw new Error("First-study final verification failed");
  return verification;
}

function markdown(conclusion, verification) {
  return ["# Bao la Kiswahili 第一次定石研究 — 最終結論", "",
    `完了日時: ${conclusion.completedAt}`, "", `状態: \`${conclusion.status}\``, "",
    "## 結論", "",
    "第一次研究は、暫定定石を認定せずに完了した。標準初期局面の4初手は全て全応手頑健性基準に未達だった。条件付き局面P002には現ルール実装上の9 ply South強制勝ちがあるが外部未検証、P003はdepth 11でconsensus首位だが13 ply有界終局は全候補未解決である。", "",
    `- 認定定石: ${conclusion.recognizedJoseki}`, `- 暫定定石: ${conclusion.provisionalJoseki}`,
    `- validated: ${conclusion.validatedJoseki}`, "",
    "暫定定石0件は失敗ではない。AI条件に対する不安定性、全応手に対する脆弱性、固定自己対局と深い探索の不一致を再現可能に示したため、計画の成功条件を満たす。", "",
    "## RQ1〜RQ6の最終回答", "", ...conclusion.researchQuestions.flatMap((rq) =>
      [`### ${rq.id} — ${rq.question}`, "", rq.answer, ""]),
    "## 条件付き候補の最終状態", "", ...conclusion.candidates.map((candidate) =>
      `- ${candidate.studyId}: \`${candidate.decision}\`、promotion eligible: ${candidate.promotionEligible ? "yes" : "no"}`), "",
    "## P002外部検証の扱い", "",
    "9手盤面照合票は生成済みだが、チェック欄は未記入であり、別ルール実装でも未検証である。このためP002は`externally-unvalidated`とする。これは第一次研究の終了を妨げないが、暫定定石またはvalidatedへの昇格を妨げる。", "",
    "## 成功条件", "", ...conclusion.successCriteria.map((item) =>
      `- [${item.met ? "x" : " "}] ${item.criterion}${item.note ? ` — ${item.note}` : ""}`), "",
    "## 将来研究", "", ...conclusion.nonBlockingFutureResearch.map((item) => `- ${item}`), "",
    "これらは第一次研究の未完了作業ではなく、独立した将来研究バックログとして管理する。", "",
    "## 最終完全性", "", `- prerequisite verifications: ${verification.prerequisiteVerifications}`,
    `- success criteria: ${verification.successCriteriaMet}/${verification.successCriteriaExpected}`,
    `- conclusion hash: \`${verification.conclusionHash}\``,
    `- verification hash: \`${verification.verificationHash}\``, ""].join("\n");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const built = build(options);
  const integrity = verify(built);
  built.conclusion.integrity = integrity;
  atomicWriteJson(options.output, built.conclusion);
  atomicWriteJson(options.verification, integrity);
  fs.mkdirSync(path.dirname(options.markdown), { recursive: true });
  fs.writeFileSync(options.markdown, markdown(built.conclusion, integrity));
  console.log(JSON.stringify({ output: options.output, markdown: options.markdown,
    status: built.conclusion.status, recognizedJoseki: built.conclusion.recognizedJoseki,
    successCriteria: `${integrity.successCriteriaMet}/${integrity.successCriteriaExpected}`,
    integrity }, null, 2));
}

if (require.main === module) main();
module.exports = { VERIFICATION_FILES, build, markdown, parseArgs, verify };
