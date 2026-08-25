"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const agenda = fs.readFileSync(path.join(ROOT, "doc/FUTURE_RESEARCH_AGENDA.md"), "utf8");
const index = fs.readFileSync(path.join(ROOT, "doc/RESEARCH_INDEX.md"), "utf8");

const required = [
  "Version: 2.0.0",
  "## 9. 第二世代研究アジェンダ",
  "第二世代は純粋な研究プログラムとして完結させる。",
  "G2-01 — Position Evaluation / Empirical Outcome Calibration Replication Study 1",
  "G2-02 — Search Reliability / Decision Robustness Study 1",
  "G2-03 — State Transformation Semantics / Canonicalization Validation Study 1",
  "G2-04 — Restricted Endgame Exact Oracle Expansion Study 1",
  "G2-05 — Deep RAW State-Space Enumeration Study 1",
  "G2-06 — Rich Critical-Position Representation Study 1",
  "G2-07 — Practical Comeback / Reply-Pressure Representation Study 1",
  "G2-08 — Machine Decision-Failure Taxonomy Study 1",
  "G2-09 — Tactical Motif Generalization / Counterexample Study 1",
  "G2-10 — Unified Multiaxial Strategic State Representation Study 1",
  "G2-11 — Long-Horizon Strategic Transition Structure Study 1",
  "G2-12 — State-Space / Game-Tree Growth Estimation Study 1",
  "G2-H01 — Human / Expert Strategic Judgment Study 1",
  "G2-04はG2-03の成功を前提としない。",
  "本Studyは**bounded exact enumerationだけ**を扱い、full-game growth estimationを同一Study内で結果後に追加しない。",
  "public AIの棋力、対局勝率、応答速度、ユーザー体験、deployment成否を研究endpointにしない。",
  "Agenda上の順序ラベルであり、正式Study IDではない"
];
for (const needle of required) {
  assert.ok(agenda.includes(needle), `FUTURE_RESEARCH_AGENDA.md missing: ${needle}`);
}

const g2 = agenda.slice(agenda.indexOf("## 9. 第二世代研究アジェンダ"));
assert.ok(!g2.includes("Research-to-AI Translation"), "Generation 2 research agenda must not contain AI-translation study");
assert.ok(!g2.includes("translationReadiness"), "Generation 2 research agenda must not use AI translation readiness as a scientific construct");
assert.equal((g2.match(/^#### G2-\d{2} —/gm) || []).length, 12, "expected exactly 12 core G2 studies");
assert.equal((g2.match(/^#### G2-H01 —/gm) || []).length, 1, "expected one independent human track study");

assert.ok(index.includes("第二世代の純粋研究プログラム"), "RESEARCH_INDEX missing Generation 2 navigation");
assert.ok(index.includes("独立engineering track"), "RESEARCH_INDEX missing research/AI separation");

console.log("Second-generation pure research agenda audit: PASS");
