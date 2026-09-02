#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname, "../..");
const p = rel => path.join(ROOT, rel);
const read = rel => fs.readFileSync(p(rel), "utf8");
const write = (rel, s) => fs.writeFileSync(p(rel), s);
function replaceExact(s, oldText, newText, label) {
  if (s.includes(newText)) return s;
  if (!s.includes(oldText)) throw new Error(`${label}: expected old text missing`);
  return s.replace(oldText, newText);
}
function replaceRegex(s, re, newText, label) {
  if (s.includes(newText)) return s;
  if (!re.test(s)) throw new Error(`${label}: expected pattern missing`);
  return s.replace(re, newText);
}
function insertBefore(s, anchor, block, unique, label) {
  if (s.includes(unique)) return s;
  if (!s.includes(anchor)) throw new Error(`${label}: anchor missing`);
  return s.replace(anchor, block + anchor);
}
function insertAfter(s, anchor, block, unique, label) {
  if (s.includes(unique)) return s;
  if (!s.includes(anchor)) throw new Error(`${label}: anchor missing`);
  return s.replace(anchor, anchor + block);
}
function mustInclude(s, text, label) {
  if (!s.includes(text)) throw new Error(`${label}: missing ${text}`);
}
function mustNotInclude(s, text, label) {
  if (s.includes(text)) throw new Error(`${label}: stale text remains: ${text}`);
}

const f = {
  root: "README.md",
  index: "doc/RESEARCH_INDEX.md",
  future: "doc/FUTURE_RESEARCH_AGENDA.md",
  rg3Readme: "doc/research-generation-3/README.md",
  rg3Status: "doc/research-generation-3/CURRENT_STATUS.md",
  overview: "doc/bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md",
  current: "doc/bao-rule-mechanism-geometry-intervention/CURRENT_STATUS.md",
  studyReadme: "doc/bao-rule-mechanism-geometry-intervention/README.md",
  final: "doc/bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md",
  decision: "doc/bao-rule-mechanism-geometry-intervention/DECISION_REGISTER.md",
  repro: "doc/bao-rule-mechanism-geometry-intervention/REPRODUCIBILITY_INDEX.md",
  result: "doc/bao-rule-mechanism-geometry-intervention/results/stage-1/scientific-result.json",
  telemetry: "doc/bao-rule-mechanism-geometry-intervention/results/stage-1/telemetry.json",
  summary: "doc/bao-rule-mechanism-geometry-intervention/results/stage-1/execution-summary.json",
  plan: "doc/research-generation-3/PROGRAM_PLAN.md",
  checkpoint: "doc/bao-rule-mechanism-geometry-intervention/checkpoints/2026-09-03-final-document-consistency-pass.md"
};

// Root README: current RG3 state + G3-06 entry.
let s = read(f.root);
s = replaceExact(
  s,
  "- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / G3-02 / G3-03 / G3-05は`CLOSED / TECHNICAL-INVALID`、LGTGMIVは`FORMAL-ELIGIBLE-ALL`、G3-04は`CLOSED / FORMAL-COMPLETE`。G3-05 formal promoted candidate setは`[]`、Stage 2未実行。depth-10 holdoutはsealedのまま。G3-06は未承認で、次はseparate post-G3-05 authorization reviewが必要。",
  "- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / G3-02 / G3-03 / G3-05 / G3-06は`CLOSED / TECHNICAL-INVALID`、LGTGMIVは`FORMAL-ELIGIBLE-ALL`、G3-04は`CLOSED / FORMAL-COMPLETE`。G3-06 Stage 1はproduction / independent event-unit selection mismatchでfail-closedし、formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。depth-10 holdoutはsealedのまま。次のscientific program actionはseparate post-G3-06 current-state G3-07 authorization review。",
  "root RG3 status"
);
const rootInsertAnchor = "- [`doc/research-program-decisions/2026-09-01-lgtgmiv-closure-and-g3-02-review-required.md`]";
const rootG306 = "- [`doc/bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md`](doc/bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md): Research Generation 3 `G3-06` / `BRMGI-STUDY1`。capture、nyumba stop/use、reserve exhaustion / Namua→Mtaji linked eventに伴うbounded RAW geometry changeをprospectively検証したが、fresh Stage 1でproduction / independent event-unit selectionが一致せず`CLOSED / TECHNICAL-INVALID`。rule-event/geometryのpositive・negative・null scientific resultではない。\n- [`doc/bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md`](doc/bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md): G3-06のStage 0 v1/v2、Stage 1 exactly-one execution、selection-verification technical failure、no-rescue、Stage 2 non-authorizationの最終正本。\n";
s = insertBefore(s, rootInsertAnchor, rootG306, "doc/bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md", "root G3-06 links");
write(f.root, s);

// Research Index: add G3-05/G3-06 entries and update current program state.
s = read(f.index);
const idxBlock = `### G3-05 — Branch Expansion and Compression Transition Study 1\n\nG3-05 \`BECT-STUDY1\`はStage 0 v2を\`STAGE0-PASS\`として完了後、fresh Stage 1をexactly one authorized executionで開始したが、bounded RAW enumeration中の\`relay-limit\` technical errorでfail-closedした。formal decisionは **\`CLOSED / TECHNICAL-INVALID\`**、formal promoted candidate setは\`[]\`、Stage 2は\`NOT-AUTHORIZED-NOT-EXECUTED\`。partial telemetryはdiagnostic-onlyであり、branch expansion/compression transitionのpositive/negative scientific evidenceではない。\n\n**最初に読む:**\n\n- [\`branch-expansion-compression-transition/STUDY_1_OVERVIEW.md\`](branch-expansion-compression-transition/STUDY_1_OVERVIEW.md)\n- [\`branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md\`](branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md)\n\n---\n\n### G3-06 — Bao Rule-Mechanism / Geometry Intervention Study 1\n\nG3-06 \`BRMGI-STUDY1\`はLGTGMIV F1-F5 / RAW-only / relative depth 5だけを用いて、capture、nyumba stop/use、reserve exhaustion / Namua→Mtaji linked eventに伴うmove-conditioned / event-conditioned geometry changeをprospectively検証する独立Studyとして実施した。Stage 0 v1はsynthetic fixture invariantでtechnical-invalid、fresh-freeに別versionとしてrefreezeしたv2は\`STAGE0-PASS\`。その後fresh Stage 1をexactly one authorized executionで開始したが、geometry measurement前のproduction / independent event-unit selection agreement gateで\`production/independent selection mismatch\`となりfail-closedした。\n\nFormal decisionは **\`BRMGI-STUDY1 = CLOSED / TECHNICAL-INVALID\`**。Stage 1 seed \`31610001..31610256\`はconsume済み、formal promoted candidate setは\`[]\`、Stage 2は\`NOT-AUTHORIZED-NOT-EXECUTED\`でseed \`31620001..31620384\`は未消費。これはrule-event/geometryのnegative/null resultではない。same-evidence selector repair/rerun、seed extension、event/control/endpoint redesignによる救済を行わない。protected depth-10 holdoutは\`SEALED / NOT GENERATED / NOT READ\`。\n\n**最初に読む:**\n\n- [\`bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md\`](bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md)\n- [\`bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md\`](bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md)\n\n**詳細・正本:**\n\n- [\`bao-rule-mechanism-geometry-intervention/CURRENT_STATUS.md\`](bao-rule-mechanism-geometry-intervention/CURRENT_STATUS.md)\n- [\`bao-rule-mechanism-geometry-intervention/DECISION_REGISTER.md\`](bao-rule-mechanism-geometry-intervention/DECISION_REGISTER.md)\n- [\`bao-rule-mechanism-geometry-intervention/REPRODUCIBILITY_INDEX.md\`](bao-rule-mechanism-geometry-intervention/REPRODUCIBILITY_INDEX.md)\n- [\`research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md\`](research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md)\n\n**Boundary:** G3-06 technical-invalid provenanceをG3-07以降のpositive/negative mechanism evidenceへ昇格させない。G3-07を実施する場合はseparate post-G3-06 current-state authorization reviewを必要とする。\n\n---\n\n`;
s = insertBefore(s, "## 将来研究\n", idxBlock, "### G3-06 — Bao Rule-Mechanism / Geometry Intervention Study 1", "index G3-05/G3-06 sections");
s = replaceExact(
  s,
  "**Research Generation 3 state:** G3-01 / G3-02 / G3-03 / G3-05 are `CLOSED / TECHNICAL-INVALID`; LGTGMIV remains `FORMAL-ELIGIBLE-ALL`; G3-04 `SFCDF-STUDY1` remains `CLOSED / FORMAL-COMPLETE` with C1 `CONFIRMED / MTAJI-GREATER` and C6 `CONFIRMED / NAMUA-GREATER`. G3-05 `BECT-STUDY1` has formal promoted candidate set `[]` and Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`. G3-06 is `NOT AUTHORIZED`; the next program-safe scientific action is a separate post-G3-05 current-state authorization review. Protected depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.",
  "**Research Generation 3 state:** G3-01 / G3-02 / G3-03 / G3-05 / G3-06 are `CLOSED / TECHNICAL-INVALID`; LGTGMIV remains `FORMAL-ELIGIBLE-ALL`; G3-04 `SFCDF-STUDY1` remains `CLOSED / FORMAL-COMPLETE` with C1 `CONFIRMED / MTAJI-GREATER` and C6 `CONFIRMED / NAMUA-GREATER`. G3-06 `BRMGI-STUDY1` has formal promoted candidate set `[]`, Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`, Stage 1 seed consumed and Stage 2 seed not consumed. The next program-safe scientific action, if pursued, is a separate post-G3-06 current-state authorization review for G3-07. Protected depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.",
  "index RG3 current state"
);
write(f.index, s);

// Future agenda: current-facing header/update only; historical agenda definitions remain untouched.
s = read(f.future);
s = replaceExact(s, "更新日: 2026-09-02", "更新日: 2026-09-03", "future update date");
s = replaceExact(
  s,
  "Research Generation 3: **Active / G3-05 `BECT-STUDY1` closed `TECHNICAL-INVALID` / formal promoted candidate set `[]` / Stage 2 not authorized / G3-06 separate authorization review required and NOT AUTHORIZED (2026-09-02)**",
  "Research Generation 3: **Active / G3-06 `BRMGI-STUDY1` closed `TECHNICAL-INVALID` / formal promoted candidate set `[]` / Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED` / next action is separate post-G3-06 current-state G3-07 authorization review (2026-09-03)**",
  "future RG3 header"
);
s = replaceExact(s, "### 2026-09-02 Research Generation 3 current update", "### 2026-09-03 Research Generation 3 current update", "future current update heading");
const futureG306 = "\nG3-06 `BRMGI-STUDY1`は、LGTGMIV F1-F5 / RAW-only / relative depth 5のfrozen boundary内でcapture、nyumba stop/use、reserve exhaustion / Namua→Mtaji linked event周辺のmove-conditioned / event-conditioned geometry changeをprospectively検証する独立Studyとして実施した。Stage 0 v2は`STAGE0-PASS`。fresh Stage 1はexactly one authorized executionで開始したが、geometry measurement前のproduction / independent event-unit selection verificationで`production/independent selection mismatch`となり`TECHNICAL-INVALID`でfail-closedした。Stage 1 seed `31610001..31610256`はconsume済み、formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`でseed `31620001..31620384`は未消費。これはcapture / nyumba / reserve / Namua→Mtajiとgeometryのpositive・negative・null scientific resultではない。same-evidence selector repair/rerunを行わず、G3-07を実施する場合はseparate post-G3-06 current-state authorization reviewを必要とする。protected depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ`のまま。\n";
s = insertAfter(s, "### 2026-09-03 Research Generation 3 current update\n", futureG306, "G3-06 `BRMGI-STUDY1`は、LGTGMIV", "future G3-06 current update");
write(f.future, s);

// RG3 README top/current navigation/closure.
s = read(f.rg3Readme);
const rg3ReadmeStatus = `## 現在の状態\n\n\`\`\`text\nProgram = Bao Third-Generation Research Program\nStatus = ACTIVE / G3-06 BRMGI-STUDY1 CLOSED TECHNICAL-INVALID / POST-G3-06 G3-07 REVIEW REQUIRED / G3-07 NOT AUTHORIZED\nCore agenda = G3-01..G3-12\nHuman track = G3-H01 / independent / non-blocking\nG3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID\npost-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL / F1..F5\nG3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED\nG3-03 = TCTGD-STUDY1 / CLOSED / TECHNICAL-INVALID / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED\nG3-04 = SFCDF-STUDY1 / CLOSED / FORMAL-COMPLETE / C1 CONFIRMED MTAJI-GREATER / C6 CONFIRMED NAMUA-GREATER\nG3-05 = BECT-STUDY1 / CLOSED / TECHNICAL-INVALID / promoted [] / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED\nG3-06 = BRMGI-STUDY1 / CLOSED / TECHNICAL-INVALID\nG3-06 Stage 0 v1 = TECHNICAL-INVALID / NO RERUN\nG3-06 Stage 0 v2 = STAGE0-PASS\nG3-06 Stage 1 = TECHNICAL-INVALID / 1 authorized / 1 actual / seed 31610001..31610256 CONSUMED\nG3-06 formal promoted candidate set = []\nG3-06 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED / seed 31620001..31620384 NOT CONSUMED\nG3-06 no-rescue boundary = CROSSED / ACTIVE\nProtected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ\n\`\`\``;
s = replaceRegex(s, /## 現在の状態\n\n```text\n[\s\S]*?Protected depth-10 exact holdout = SEALED \/ NOT GENERATED \/ NOT READ\n```/, rg3ReadmeStatus, "RG3 README status block");
const firstReadAnchor = "- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing program state\n";
const firstReadG306 = "- [`../bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md`](../bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md) — G3-06初見向けclosure概要\n- [`../bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md`](../bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md) — G3-06 scientific/technical closure正本\n- [`../research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md`](../research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md) — G3-06 program-level closure / G3-07 not auto-authorized\n";
s = insertAfter(s, firstReadAnchor, firstReadG306, "G3-06初見向けclosure概要", "RG3 README first-read G3-06");
const rg3ReadmeG306 = `## G3-06 formal closure\n\nG3-06は\`BRMGI-STUDY1\`として、capture、nyumba stop/use、reserve exhaustion / Namua→Mtaji linked eventに伴うbounded RAW local geometry changeを、LGTGMIV F1-F5 / RAW-only / relative depth 5だけでprospectively検証した。\n\nStage 0 v1は34-seed synthetic nyumba fixtureが64-seed RAW invariantを満たさず\`TECHNICAL-INVALID / NO RERUN\`。fresh scientific evidence 0の状態でtechnical fixtureだけを修正した別version v2をrefreezeし、v2は全technical gateを通過して\`STAGE0-PASS\`となった。\n\nFresh Stage 1はseed \`31610001..31610256\`をexactly one authorized executionで開始したが、geometry measurement前のproduction / independent event-unit selection agreement gateで\`production/independent selection mismatch\`となりfail-closedした。Stage 1 seedはconsume済み、no-rescue boundaryはactive、formal promoted candidate setは\`[]\`。Stage 2は\`NOT-AUTHORIZED-NOT-EXECUTED\`でseed \`31620001..31620384\`は未消費。\n\nFormal closureは **\`BRMGI-STUDY1 = CLOSED / TECHNICAL-INVALID\`**。これはcapture / nyumba / reserve / Namua→Mtajiとgeometryのpositive・negative・null scientific resultではない。selector修正後のsame-evidence rerun、seed extension、event/control/endpoint redesignによる救済は行わない。\n\nCanonical records:\n\n- \`../bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md\`\n- \`../bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md\`\n- \`../bao-rule-mechanism-geometry-intervention/CURRENT_STATUS.md\`\n- \`../bao-rule-mechanism-geometry-intervention/DECISION_REGISTER.md\`\n- \`../bao-rule-mechanism-geometry-intervention/REPRODUCIBILITY_INDEX.md\`\n- \`../research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md\`\n- \`checkpoints/2026-09-03-g3-06-technical-invalid-closure.md\`\n\n`;
s = insertBefore(s, "## Protected evidence\n", rg3ReadmeG306, "## G3-06 formal closure", "RG3 README G3-06 closure");
s = replaceExact(s, "G3-02 / G3-03 / G3-04 / G3-05はいずれもこれを生成・readしていない。G3-05 closure後も封印を維持する。", "G3-02 / G3-03 / G3-04 / G3-05 / G3-06はいずれもこれを生成・readしていない。G3-06 closure後も封印を維持する。", "RG3 README protected evidence");
s = replaceRegex(
  s,
  /## Next program boundary\n[\s\S]*?\n## Canonical records/,
  "## Next program boundary\n\nG3-06 / `BRMGI-STUDY1`は`CLOSED / TECHNICAL-INVALID`であり、formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`である。\n\nHistorical program plan上の次候補はG3-07だが、**G3-07はまだauthorizeされていない**。次はseparate post-G3-06 current-state authorization reviewを行う。review前にG3-07 fresh evidenceを生成・readせず、G3-06 technical-invalid selection mismatchやpartial provenanceをpositive/negative scientific prerequisiteとして継承しない。\n\n## Canonical records",
  "RG3 README next boundary"
);
s = insertBefore(s, "- `CURRENT_STATUS.md`\n", "- `../bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md`\n- `../bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md`\n- `../bao-rule-mechanism-geometry-intervention/CURRENT_STATUS.md`\n- `../bao-rule-mechanism-geometry-intervention/DECISION_REGISTER.md`\n- `../bao-rule-mechanism-geometry-intervention/REPRODUCIBILITY_INDEX.md`\n- `../research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md`\n- `checkpoints/2026-09-03-g3-06-technical-invalid-closure.md`\n", "../research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md", "RG3 README canonical G3-06");
write(f.rg3Readme, s);

// RG3 CURRENT_STATUS: current state and formal G3-06 closure.
s = read(f.rg3Status);
s = replaceExact(s, "Updated: 2026-09-02", "Updated: 2026-09-03", "RG3 status date");
const rg3StatusTop = `\`\`\`text\nProgram = Bao Third-Generation Research Program\nProgram status = ACTIVE / G3-06 CLOSED TECHNICAL-INVALID / POST-G3-06 G3-07 REVIEW REQUIRED / G3-07 NOT AUTHORIZED\nCore agenda = G3-01..G3-12\nHuman track = G3-H01 / independent / non-blocking\nResearch Generation 2 = CLOSED\nG3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID\npost-G3-01 prerequisite = LGTGMIV-STUDY1 / CLOSED / FORMAL-ELIGIBLE-ALL / F1..F5\nG3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID / promoted [] / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED\nG3-03 = TCTGD-STUDY1 / CLOSED / TECHNICAL-INVALID / promoted [] / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED\nG3-04 = SFCDF-STUDY1 / CLOSED / FORMAL-COMPLETE / C1 CONFIRMED MTAJI-GREATER / C6 CONFIRMED NAMUA-GREATER\nG3-05 = BECT-STUDY1 / CLOSED / TECHNICAL-INVALID / promoted [] / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED\nG3-06 program review = G3-06-AUTHORIZED\nG3-06 = BRMGI-STUDY1 / CLOSED / TECHNICAL-INVALID\nG3-06 Stage 0 v1 = BRMGI-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID / NO RERUN\nG3-06 Stage 0 v2 = BRMGI-S0-TECHNICAL-2026-09-03-v2 / STAGE0-PASS\nG3-06 Stage 1 = BRMGI-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID / 1 authorized / 1 actual\nG3-06 Stage 1 seed = 31610001..31610256 / CONSUMED\nG3-06 formal promoted candidate set = []\nG3-06 Stage 2 = BRMGI-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED\nG3-06 Stage 2 seed = 31620001..31620384 / NOT CONSUMED\nG3-06 no-rescue boundary = CROSSED / ACTIVE\nProtected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ\nActive scientific research branch = research/g3-06-bao-rule-mechanism-geometry-intervention / CLOSED STUDY DOCUMENTATION ONLY\nNext scientific action = separate post-G3-06 current-state authorization review for G3-07\n\`\`\``;
s = replaceRegex(s, /```text\nProgram = Bao Third-Generation Research Program[\s\S]*?Next scientific action = create G3-06 research branch from post-decision main, freeze Study contract, then technical-only Stage 0\n```/, rg3StatusTop, "RG3 status top block");
const rg3StatusG306 = `## G3-06 formal closure\n\nG3-06は\`BRMGI-STUDY1\`としてprospectively freezeし、LGTGMIV F1-F5 / RAW-only / relative depth 5のbounded instrumentだけでrule-semantic event周辺のgeometry changeを検証する契約とした。\n\nStage 0 v1はtechnical fixture invariantで\`TECHNICAL-INVALID / NO RERUN\`。fresh scientific evidence 0の状態でtechnical fixtureだけを修正したv2を別versionとしてrefreezeし、v2は\`STAGE0-PASS\`。その後fresh Stage 1をexactly one authorized executionで開始した。\n\nStage 1 authorization/source binding/durable leaseはPASSしたが、geometry measurement前にproduction / independent event-unit selectionが一致せず、canonical resultは:\n\n\`\`\`text\nstageDisposition = TECHNICAL-INVALID\ntechnicalError = production/independent selection mismatch\nunitTimings = []\nformal promoted candidate set = []\nStage 1 seed = CONSUMED\nno-rescue boundary = CROSSED / ACTIVE\n\`\`\`\n\nDurable result artifactは\`9865581198\`、ZIP SHA-256は\`3f43ff832afaae5fc0a1d6756dcc9fa0101eb5a67befc7f3cdc2d1536bdb5d2a\`、exact-byte mirror commitは\`b8f9fe0e2d5008be2d41b3b8271fa325144f82fc\`。\n\nFormal closure:\n\n\`\`\`text\nG3-06 / BRMGI-STUDY1 = CLOSED / TECHNICAL-INVALID\nformal promoted candidate set = []\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nStage 2 seed = NOT CONSUMED\nsame-evidence selector repair/rerun = PROHIBITED\n\`\`\`\n\nこれはcapture / nyumba / reserve / Namua→Mtajiのgeometry effectが「ない」というnegative/null resultではない。\n\nCanonical closure records:\n\n- \`../bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md\`\n- \`../bao-rule-mechanism-geometry-intervention/STUDY_1_FINAL_REPORT.md\`\n- \`../bao-rule-mechanism-geometry-intervention/CURRENT_STATUS.md\`\n- \`../bao-rule-mechanism-geometry-intervention/DECISION_REGISTER.md\`\n- \`../bao-rule-mechanism-geometry-intervention/REPRODUCIBILITY_INDEX.md\`\n- \`../research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md\`\n- \`checkpoints/2026-09-03-g3-06-technical-invalid-closure.md\`\n\n`;
s = insertBefore(s, "## Protected evidence\n", rg3StatusG306, "## G3-06 formal closure", "RG3 status G3-06 closure");
s = replaceExact(s, "G3-02 / G3-03 / G3-04 / G3-05はいずれもこのholdoutを生成・read・peekしていない。G3-06 authorization review also generated/read no fresh scientific evidence and did not access the protected holdout. G2-12はdepth-10 truthの代替として使用しない。", "G3-02 / G3-03 / G3-04 / G3-05 / G3-06はいずれもこのholdoutを生成・read・peekしていない。G3-06 closure後もprotected holdoutはsealedのままである。G2-12はdepth-10 truthの代替として使用しない。", "RG3 status protected evidence");
s = replaceExact(s, "G3-06 authorization does not authorize causal-mechanism language. Until a formal Study produces valid heldout evidence, no substantive G3-06 rule-event/geometry claim exists.", "G3-06は`CLOSED / TECHNICAL-INVALID`であり、causal-mechanism languageはauthorizeされない。valid Stage 1 candidate evaluationへ到達していないため、G3-06からsubstantiveなrule-event/geometry positive・negative・null claimは存在しない。", "RG3 status G3-06 claim boundary");
s = replaceRegex(
  s,
  /## Next program boundary\n[\s\S]*?Historical `PROGRAM_PLAN\.md` remains unchanged\./,
  "## Next program boundary\n\nG3-06 / `BRMGI-STUDY1` remains `CLOSED / TECHNICAL-INVALID`; Stage 1 seed is consumed, same-evidence rescue is prohibited, formal promoted candidate set is `[]`, and Stage 2 is `NOT-AUTHORIZED-NOT-EXECUTED`.\n\nG3-07 is **NOT AUTHORIZED**. The next program-safe scientific action, if pursued, is a separate post-G3-06 current-state authorization review. G3-06 selection mismatch / technical-invalid provenance must not be promoted into a positive or negative G3-07 scientific prerequisite.\n\nProtected depth-10 holdout remains `SEALED / NOT GENERATED / NOT READ`.\n\nHistorical `PROGRAM_PLAN.md` remains unchanged.",
  "RG3 status next boundary"
);
write(f.rg3Status, s);

// Study Overview: turn prospective entry into accurate closure summary.
s = read(f.overview);
s = replaceExact(s, "更新日: 2026-09-02  \n状態: **Prospective / pre-Stage-0 / fresh scientific evidence未生成**", "更新日: 2026-09-03  \n状態: **CLOSED / TECHNICAL-INVALID**", "overview status");
const overviewCurrent = `## 現在地 / 最終結果\n\nProgram-level reviewは **\`G3-06-AUTHORIZED\`** としてStudy definitionとtechnical Stage 0を許可した。その後、Stage 0 v2 PASSとpreauthorization tooling auditを経てfresh Stage 1をexactly one authorized executionで実施した。\n\n最終状態:\n\n\`\`\`text\nStage 0 v1 = TECHNICAL-INVALID / NO RERUN\nStage 0 v2 = STAGE0-PASS\nStage 1 = TECHNICAL-INVALID\ntechnical error = production/independent selection mismatch\nStage 1 seed = 31610001..31610256 / CONSUMED\nformal promoted candidate set = []\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nStage 2 seed = 31620001..31620384 / NOT CONSUMED\nno-rescue boundary = CROSSED / ACTIVE\nStudy = CLOSED / TECHNICAL-INVALID\n\`\`\`\n\nStage 1 failureはgeometry measurement前のevent-unit selection agreement gateで発生したため、M1-M6のdevelopment candidate directionやrule-event/geometryのpositive・negative・null scientific resultは成立していない。同じseed/populationをselector修正後に再実行しない。\n\nProtected standard initial RAW depth-10 holdoutは引き続き **\`SEALED / NOT GENERATED / NOT READ\`**。\n\n詳細は\`STUDY_1_FINAL_REPORT.md\`を正本とする。\n`;
s = replaceRegex(s, /## 現在地\n[\s\S]*$/, overviewCurrent, "overview final state");
write(f.overview, s);

// Decision register: preserve prospective decisions, append lifecycle decisions.
s = read(f.decision);
s = replaceExact(
  s,
  "| BRMGI-D053 | Fresh Stage 1 | `NOT AUTHORIZED / REVIEW REQUIRED` | Stage 1 seeds remain unconsumed; no scientific execution until explicit post-Stage-0 decision. |",
  "| BRMGI-D053 | Post-Stage-0 Stage 1 review | `BRMGI-STAGE1-PREPARATION-AUTHORIZED / FRESH-SCIENTIFIC-EXECUTION-NOT-AUTHORIZED` | Fresh-free tooling/firewall/control-plane preparation allowed; seed access remained blocked until separate exactly-one authorization. |",
  "decision D053"
);
const decisionRows = "| BRMGI-D055 | Stage 1 preauthorization static audit | `PASS` | Run `33679102557`; unarmed runner stopped before seed access and production/independent separation, firewall, resource/fail-closed and one-shot controls passed. |\n| BRMGI-D056 | Stage 1 scientific authorization | `EXACTLY ONE AUTHORIZED` | Authorization commit `1edc8886...e6e7`, trigger `61cb2ed3...5898`, seed `31610001..31610256`. |\n| BRMGI-D057 | Stage 1 execution | `TECHNICAL-INVALID / 1 AUTHORIZED / 1 ACTUAL` | Production/independent event-unit selection mismatch occurred before geometry measurement. |\n| BRMGI-D058 | Stage 1 seed / no-rescue | `CONSUMED / CROSSED` | Same-evidence selector repair/rerun, seed extension, replacement and redesign prohibited. |\n| BRMGI-D059 | Formal promoted candidate set | `[]` | No M1-M6 development candidate receives formal direction/promotion. |\n| BRMGI-D060 | Stage 2 | `NOT-AUTHORIZED-NOT-EXECUTED` | Stage 2 prerequisites failed; seed `31620001..31620384` remains unconsumed. |\n| BRMGI-D061 | Study closure | `CLOSED / TECHNICAL-INVALID` | Technical validity result only; no positive/negative/null rule-event/geometry scientific conclusion. |\n| BRMGI-D062 | Post-G3-06 program boundary | `G3-07 REVIEW REQUIRED / NOT AUTO-AUTHORIZED` | G3-07 requires a separate current-state authorization review. |\n";
s = insertBefore(s, "\n## Formal program decision\n", decisionRows, "| BRMGI-D061 | Study closure", "decision lifecycle rows");
write(f.decision, s);

// Reproducibility index: actual Stage 0/1 provenance and closure.
s = read(f.repro);
s = replaceExact(s, "更新日: 2026-09-02", "更新日: 2026-09-03", "repro date");
s = replaceExact(
  s,
  "```text\nBRMGI-S0-TECHNICAL-2026-09-02-v1\nBRMGI-S1-DEVELOPMENT-2026-09-02-v1\nBRMGI-S2-FORMAL-2026-09-02-v1\n```",
  "```text\nBRMGI-S0-TECHNICAL-2026-09-02-v1 / TECHNICAL-INVALID / NO RERUN\nBRMGI-S0-TECHNICAL-2026-09-03-v2 / STAGE0-PASS\nBRMGI-S1-DEVELOPMENT-2026-09-02-v1 / TECHNICAL-INVALID\nBRMGI-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED\n```",
  "repro stage IDs"
);
s = replaceExact(
  s,
  "```text\ntechnical-only = 31609001..31609008 / scientific use prohibited\nStage 1 = 31610001..31610256 / RESERVED / NOT CONSUMED\nStage 2 = 31620001..31620384 / RESERVED / NOT CONSUMED\n```",
  "```text\ntechnical-only = 31609001..31609008 / scientific use prohibited\nStage 1 = 31610001..31610256 / CONSUMED / CLOSED TO SAME-EVIDENCE REUSE\nStage 2 = 31620001..31620384 / NOT CONSUMED / NOT-AUTHORIZED-NOT-EXECUTED\n```",
  "repro seeds"
);
s = replaceExact(s, "Upstream identity-only exclusions must be materialized before Stage 1 authorization from:", "Upstream identity-only exclusions were materialized before Stage 1 scientific authorization from:", "repro firewall tense");
s = replaceExact(s, "Outcome fields retained = false.\n\nG3-03 diagnostic values/directions, G3-04 candidate values/directions and G3-05 partial telemetry are not scientific selection inputs.", "Outcome fields retained = false. Final identity-only manifest counts: root RAW identities 149, source trajectory identities 124, opening-prefix identities 67; G3-05 retained only 25 `rootRawSha256` identities and no partial scientific fields. `identityCoreSha256 = a225b8c15d6da956dd1afbdc0a64c6d40b9c77add2e464d34f11dfc1278e2182`.\n\nG3-03 diagnostic values/directions, G3-04 candidate values/directions and G3-05 partial telemetry are not scientific selection inputs.", "repro firewall actual");
const reproExec = `## Actual Stage 0 / Stage 1 provenance\n\nStage 0 v1:\n\n\`\`\`text\nrun = 33677691455\ndisposition = TECHNICAL-INVALID / NO RERUN\nfresh scientific evidence = false\n\`\`\`\n\nStage 0 v2:\n\n\`\`\`text\nstatic audit run = 33677942576 / PASS\nexecution run = 33678004793 / STAGE0-PASS\nresult artifact = 9865102178\nresult ZIP SHA-256 = 06015d340a3a0de4703af2755c1a265153fef08393dc43fcd38e1285fb1295ff\nresult file SHA-256 = 4089bc0acd8b719e23a21a2605b34281d13992c2cc75dfd9dc5474c8bb2eade3\n\`\`\`\n\nUpstream firewall:\n\n\`\`\`text\nmaterialization run = 33678555012\nartifact = 9865308337\nZIP SHA-256 = 5f625d34f421da493fee1bcfc463687a26d9bd01d29a9bf838e3d1c6637f1ec7\nexact mirror commit = 6029679c7a218ca35bb1da343d86670285070d7a\n\`\`\`\n\nStage 1:\n\n\`\`\`text\npreauthorization static audit run = 33679102557 / PASS\nauthorization commit = 1edc8886ffb0d2b65c7f4c1c8fb002be0abbe6e7\ntrigger commit = 61cb2ed31c26151edf19b9c1eb49f6b22b935898\nscientific run = 33679269612\njob = 100411609044\nauthorized executions = 1\nactual executions = 1\nstageDisposition = TECHNICAL-INVALID\ntechnicalError = production/independent selection mismatch\nresult artifact = 9865581198\nresult ZIP SHA-256 = 3f43ff832afaae5fc0a1d6756dcc9fa0101eb5a67befc7f3cdc2d1536bdb5d2a\nscientific-result SHA-256 = a5a2f385699cd8bc629e1d1594005841778a82c7d1ca18bb7eb5bcfeb0d41452\ntelemetry SHA-256 = 141f4687528ce62fe60052c4c9ecff217a6a929a43190e4f5a507f8d4abc77f0\nexecution-summary SHA-256 = a3fdf314f12d6853e337f13b6c252eaebf27edb69c96dab53829b033ece5ca77\nexact-byte mirror commit = b8f9fe0e2d5008be2d41b3b8271fa325144f82fc\n\`\`\`\n\n`;
s = insertBefore(s, "## Protected evidence\n", reproExec, "## Actual Stage 0 / Stage 1 provenance", "repro actual provenance");
s = replaceExact(
  s,
  "```text\nfresh Stage 1 executions = 0\nfresh Stage 2 executions = 0\nStage 1 seed consumed = false\nStage 2 seed consumed = false\nno-rescue boundary crossed = false\nprotected depth-10 accessed = false\n```",
  "```text\nfresh Stage 1 authorized executions = 1\nfresh Stage 1 actual executions = 1\nfresh Stage 2 executions = 0\nStage 1 seed consumed = true\nStage 2 seed consumed = false\nno-rescue boundary crossed = true\nformal promoted candidate set = []\nStudy = CLOSED / TECHNICAL-INVALID\nprotected depth-10 accessed = false\nmain integration = NOT PERFORMED\n```",
  "repro current state"
);
write(f.repro, s);

// Cross-document immutable guards.
const current = read(f.current);
const studyReadme = read(f.studyReadme);
const final = read(f.final);
mustInclude(current, "Study status = CLOSED / TECHNICAL-INVALID", "BRMGI current closure");
mustInclude(current, "Stage 1 seed = 31610001..31610256 / CONSUMED", "BRMGI current Stage1 seed");
mustInclude(current, "Stage 2 = BRMGI-S2-FORMAL-2026-09-02-v1 / NOT-AUTHORIZED-NOT-EXECUTED", "BRMGI current Stage2");
mustInclude(studyReadme, "Study status = CLOSED / TECHNICAL-INVALID", "BRMGI README closure");
mustInclude(final, "BRMGI-STUDY1 = CLOSED / TECHNICAL-INVALID", "BRMGI final closure");
mustInclude(final, "formal promoted candidate set = []", "BRMGI final promoted set");
mustInclude(final, "production/independent selection mismatch", "BRMGI final technical error");

const result = JSON.parse(read(f.result));
if (result.stageDisposition !== "TECHNICAL-INVALID") throw new Error("Stage 1 disposition drift");
if (result.technicalError?.message !== "production/independent selection mismatch") throw new Error("Stage 1 technical error drift");
if (result.authorizedScientificExecutions !== 1 || result.actualScientificExecutions !== 1) throw new Error("Stage 1 execution count drift");
if (result.seedBlockConsumed !== true || result.noRescueBoundaryCrossed !== true) throw new Error("Stage 1 no-rescue drift");

// Stale current-facing text must be gone; historical plan/checkpoints are intentionally excluded.
for (const [name, rel] of [["root",f.root],["index",f.index],["future",f.future],["rg3Readme",f.rg3Readme],["rg3Status",f.rg3Status],["overview",f.overview],["decision",f.decision],["repro",f.repro]]) {
  const x = read(rel);
  if (["root","index","future","rg3Readme","rg3Status","overview","decision","repro"].includes(name)) {
    mustNotInclude(x, "G3-06 = NOT AUTHORIZED / separate post-G3-05 review required", `${name} stale G3-06`);
    mustNotInclude(x, "G3-06 separate authorization review required and NOT AUTHORIZED", `${name} stale G3-06 header`);
  }
}

mustInclude(read(f.root), "BRMGI-STUDY1", "root G3-06 link");
mustInclude(read(f.index), "### G3-06 — Bao Rule-Mechanism / Geometry Intervention Study 1", "index G3-06 section");
mustInclude(read(f.future), "G3-06 `BRMGI-STUDY1` closed `TECHNICAL-INVALID`", "future G3-06 current status");
mustInclude(read(f.rg3Readme), "## G3-06 formal closure", "RG3 README closure section");
mustInclude(read(f.rg3Status), "G3-06 = BRMGI-STUDY1 / CLOSED / TECHNICAL-INVALID", "RG3 current G3-06 closure");
mustInclude(read(f.overview), "状態: **CLOSED / TECHNICAL-INVALID**", "overview closure");
mustInclude(read(f.decision), "| BRMGI-D061 | Study closure | `CLOSED / TECHNICAL-INVALID`", "decision closure");
mustInclude(read(f.repro), "Study = CLOSED / TECHNICAL-INVALID", "repro closure");

const runId = process.env.GITHUB_RUN_ID || "local";
const head = process.env.GITHUB_SHA || "unknown";
const checkpoint = `# BRMGI-STUDY1 — Final document consistency checkpoint\n\nDate: 2026-09-03  \nStatus: **FINAL-DOCUMENT-CONSISTENCY-PASS**\n\n## Audited state\n\n\`\`\`text\nStudy = BRMGI-STUDY1 / CLOSED / TECHNICAL-INVALID\nStage 0 v1 = TECHNICAL-INVALID / NO RERUN\nStage 0 v2 = STAGE0-PASS\nStage 1 = TECHNICAL-INVALID / 1 authorized / 1 actual\nStage 1 seed = 31610001..31610256 / CONSUMED\ntechnical error = production/independent selection mismatch\nformal promoted candidate set = []\nStage 2 = NOT-AUTHORIZED-NOT-EXECUTED\nStage 2 seed = 31620001..31620384 / NOT CONSUMED\nno-rescue boundary = CROSSED / ACTIVE\nG3-07 = NOT AUTHORIZED / separate post-G3-06 review required\nprotected depth-10 = SEALED / NOT GENERATED / NOT READ\nmain integration = NOT PERFORMED\n\`\`\`\n\n## Scope\n\nRoot \`README.md\`, \`doc/RESEARCH_INDEX.md\`, \`doc/FUTURE_RESEARCH_AGENDA.md\`, Research Generation 3 current-facing \`README.md\` / \`CURRENT_STATUS.md\`, and BRMGI study-local README / overview / current status / final report / decision register / reproducibility index were cross-checked. Current-facing stale pre-G3-06 text was synchronized to the immutable G3-06 closure.\n\nHistorical \`doc/research-generation-3/PROGRAM_PLAN.md\`, historical checkpoints/authorization reviews, frozen preregistration/protocol, and Stage 1 scientific result bytes are intentionally not rewritten by this documentation audit.\n\nAudit workflow run: \`${runId}\`  \nAudit trigger HEAD: \`${head}\`\n`;
write(f.checkpoint, checkpoint);

console.log(JSON.stringify({
  disposition: "BRMGI-G3-06-FINAL-DOCUMENT-CONSISTENCY-PASS",
  study: "CLOSED / TECHNICAL-INVALID",
  promotedCandidates: [],
  stage2: "NOT-AUTHORIZED-NOT-EXECUTED",
  g307Authorized: false,
  protectedDepth10: "SEALED / NOT GENERATED / NOT READ",
  mainIntegrationPerformed: false
}));
