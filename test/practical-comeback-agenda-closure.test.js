"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const agenda = fs.readFileSync(path.join(ROOT, "doc/FUTURE_RESEARCH_AGENDA.md"), "utf8");

const required = [
  "### 4.7 逆転可能性と勝負手 — Study 1完了",
  "Practical Comeback / Error-Inducing Move Study 1 (`PCEM-STUDY1`) complete / Stage 1 `EXPLORATORY-ONLY` / promoted candidates 0 / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`",
  "5. **[完了] 逆転可能性と勝負手 — Study 1（Stage 1 `EXPLORATORY-ONLY` / promoted candidates 0 / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`）**",
  "PCEM-STUDY1はStage 1 `EXPLORATORY-ONLY` / promoted candidate 0で閉じており、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`である。",
  "new study ID、fresh preregistration、fresh evidenceを用いる。"
];

for (const needle of required) {
  assert.ok(agenda.includes(needle), `FUTURE_RESEARCH_AGENDA.md missing terminal PCEM text: ${needle}`);
}

const forbidden = [
  "### 4.7 逆転可能性と勝負手\n\n#### 中心課題",
  "5. **[後続候補] 逆転可能性と勝負手**"
];

for (const needle of forbidden) {
  assert.ok(!agenda.includes(needle), `FUTURE_RESEARCH_AGENDA.md retains stale PCEM text: ${needle}`);
}

console.log("PCEM Future Research Agenda closure audit: PASS");
