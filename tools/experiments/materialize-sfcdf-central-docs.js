#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const files = {
  rootReadme: path.join(ROOT, "README.md"),
  researchIndex: path.join(ROOT, "doc/RESEARCH_INDEX.md"),
  future: path.join(ROOT, "doc/FUTURE_RESEARCH_AGENDA.md"),
  rg3Readme: path.join(ROOT, "doc/research-generation-3/README.md"),
  rg3Status: path.join(ROOT, "doc/research-generation-3/CURRENT_STATUS.md"),
  rg3Plan: path.join(ROOT, "doc/research-generation-3/PROGRAM_PLAN.md")
};

const MARK = "SFCDF-G3-04-CLOSURE";
function need(x, m) { if (!x) throw new Error(m); }
function read(f) { return fs.readFileSync(f, "utf8"); }
function write(f, s) { fs.writeFileSync(f, s); }
function insertAfterLineContaining(text, needle, block, label) {
  if (text.includes(MARK) || text.includes(block.trim())) return text;
  const lines = text.split("\n");
  const i = lines.findIndex(line => line.includes(needle));
  need(i >= 0, `${label}: anchor not found: ${needle}`);
  lines.splice(i + 1, 0, block);
  return lines.join("\n");
}
function replaceLineStarting(text, prefix, replacement, label) {
  const lines = text.split("\n");
  const i = lines.findIndex(line => line.startsWith(prefix));
  need(i >= 0, `${label}: line prefix not found: ${prefix}`);
  lines[i] = replacement;
  return lines.join("\n");
}
function insertBefore(text, anchor, block, label) {
  if (text.includes(block.trim())) return text;
  const i = text.indexOf(anchor);
  need(i >= 0, `${label}: anchor not found`);
  return text.slice(0, i) + block + text.slice(i);
}
function replaceSection(text, startHeading, endHeading, replacement, label) {
  const s = text.indexOf(startHeading);
  need(s >= 0, `${label}: start heading missing: ${startHeading}`);
  const e = text.indexOf(endHeading, s + startHeading.length);
  need(e >= 0, `${label}: end heading missing: ${endHeading}`);
  return text.slice(0, s) + replacement + text.slice(e);
}

const g304RootBullet = `<!-- ${MARK}:ROOT -->\n- [\`doc/structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md\`](doc/structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md): Research Generation 3 \`G3-04\` / \`SFCDF-STUDY1\`。RAW-only relative depth 5でcorridor / funnel descriptorsをprospectively検証し、Stage 1からC1/C6だけをpromotion。fresh Stage 2 holdout 18 paired trajectoriesではC1 unit-width occupancyが18/18でMtaji > Namua、C6 cumulative tree/RAW ratioが18/18でNamua > Mtajiとなり、両候補ともexact sign test \`p=1/131072\`とHolm gateをPASSして\`CONFIRMED\`。Studyは\`CLOSED / FORMAL-COMPLETE\`。game-theoretic forcing、search ease、value等への拡張はしない。depth-10 holdoutはsealed。`;

let s = read(files.rootReadme);
if (!s.includes(`${MARK}:ROOT`)) {
  s = insertAfterLineContaining(
    s,
    "doc/transposition-concentration-tree-graph-divergence/STUDY_1_FINAL_REPORT.md",
    g304RootBullet,
    "root README"
  );
  write(files.rootReadme, s);
}

const g304IndexBlock = `\n<!-- ${MARK}:RESEARCH-INDEX -->\n### G3-04 — Structural Forcing-Corridor and Decision-Funnel Study 1\n\nG3-04 \`SFCDF-STUDY1\`は、RAW-only relative depth 5でsustained reply narrowing（corridor）とbranch-to-RAW convergence / tree-to-graph compression（funnel）をprospectively分離して検証した。Stage 0は\`STAGE0-PASS\`、Stage 1は12 paired trajectoriesで\`STAGE1-PASS\`。Stage 1からpromotionされたのはC1 unit-width occupancy（\`MTAJI-GREATER\`）とC6 cumulative tree/RAW ratio（\`NAMUA-GREATER\`）だけで、C2–C5はStage 2へ進めていない。\n\nFresh Stage 2 formal holdoutは18 paired trajectories / 36 roots。Stage 1のRAW-root 24、trajectory 24、first-16-prefix 12 identitiesを追加firewallし、exactly one authorized formal executionを行った。production / independent Stage scientific coreは\`e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039\`でexact一致した。\n\nFormal result:\n\n- C1 \`SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION\` — **\`CONFIRMED\` / \`MTAJI-GREATER\`**。18/18 pairで同方向、exact two-sided sign-test \`p=1/131072\`、Holm PASS。\n- C6 \`SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO\` — **\`CONFIRMED\` / \`NAMUA-GREATER\`**。18/18 pairで同方向、exact two-sided sign-test \`p=1/131072\`、Holm PASS。\n\nStudy lifecycleは\`CLOSED / FORMAL-COMPLETE\`。これはcandidate-level formal labelsとは別のrepository statusである。C1/C6をgame-theoretic forcing、best-move clarity、search ease、strategic simplicity、human difficulty、value/win probability、causal phase effectへ読み替えない。standard initial RAW-root complete exact depth-10 holdoutは\`SEALED / NOT GENERATED / NOT READ\`のまま。\n\n**最初に読む:**\n\n- [\`structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md\`](structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md)\n- [\`structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md\`](structural-forcing-corridor-decision-funnel/STUDY_1_OVERVIEW.md)\n- [\`structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md\`](structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md)\n- [\`structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md\`](structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md)\n\n`;

s = read(files.researchIndex);
s = s.replace(
  "### 30. Research Generation 3 — G3-01 / LGTGMIV / G3-02 / G3-03 closure",
  "### 30. Research Generation 3 — G3-01 / LGTGMIV / G3-02 / G3-03 / G3-04 closure"
);
s = s.replace(
  "**状態:** **ACTIVE / G3-01 `TECHNICAL-INVALID` / LGTGMIV `FORMAL-ELIGIBLE-ALL` / G3-02 `TECHNICAL-INVALID` / G3-03 `TCTGD-STUDY1 = TECHNICAL-INVALID` / G3-03 Stage 2 not executed / next program review required**",
  "**状態:** **ACTIVE / G3-01 `TECHNICAL-INVALID` / LGTGMIV `FORMAL-ELIGIBLE-ALL` / G3-02 `TECHNICAL-INVALID` / G3-03 `TECHNICAL-INVALID` / G3-04 `SFCDF-STUDY1 = CLOSED / FORMAL-COMPLETE` / C1+C6 `CONFIRMED` / post-G3-04 review required**"
);
if (!s.includes(`${MARK}:RESEARCH-INDEX`)) {
  const futureAnchor = "---\n\n## 将来研究";
  const futurePos = s.indexOf(futureAnchor, s.indexOf("### G3-03 — Transposition Concentration and Tree-to-Graph Divergence Study 1"));
  need(futurePos >= 0, "RESEARCH_INDEX: future anchor after G3-03 missing");
  s = s.slice(0, futurePos) + g304IndexBlock + s.slice(futurePos);
}
s = replaceLineStarting(
  s,
  "**Research Generation 3 state:**",
  "**Research Generation 3 state:** G3-01 remains `TECHNICAL-INVALID`; LGTGMIV remains `FORMAL-ELIGIBLE-ALL`; G3-02 `EBRWS-STUDY1` and G3-03 `TCTGD-STUDY1` remain `CLOSED / TECHNICAL-INVALID`. G3-04 `SFCDF-STUDY1` is now `CLOSED / FORMAL-COMPLETE`: C1 unit-width occupancy is `CONFIRMED / MTAJI-GREATER` and C6 cumulative tree/RAW ratio is `CONFIRMED / NAMUA-GREATER` on the frozen Stage 2 holdout. G3-05 is not automatically authorized; the next program-safe action is a separate post-G3-04 current-state authorization review. Protected depth-10 holdout remains sealed.",
  "RESEARCH_INDEX"
);
write(files.researchIndex, s);

s = read(files.future);
s = replaceLineStarting(
  s,
  "Research Generation 3:",
  "Research Generation 3: **Active / G3-04 `SFCDF-STUDY1` closed `FORMAL-COMPLETE` / C1 `CONFIRMED / MTAJI-GREATER` / C6 `CONFIRMED / NAMUA-GREATER` / G3-05 separate authorization review required (2026-09-02)**",
  "FUTURE_RESEARCH_AGENDA"
);
const updateHeading = "### 2026-09-02 Research Generation 3 current update\n\n";
const uh = s.indexOf(updateHeading);
need(uh >= 0, "FUTURE_RESEARCH_AGENDA: current update heading missing");
const afterUh = uh + updateHeading.length;
const endCurrentPara = s.indexOf("\n\n", afterUh);
need(endCurrentPara >= 0, "FUTURE_RESEARCH_AGENDA: current update paragraph end missing");
const currentUpdate = `G3-04 \`SFCDF-STUDY1\`はRAW-only relative depth 5のcorridor / funnel structureをprospectively検証して完了した。Stage 1は12 paired trajectoriesで\`STAGE1-PASS\`となり、C1 unit-width occupancy（\`MTAJI-GREATER\`）とC6 cumulative tree/RAW ratio（\`NAMUA-GREATER\`）だけをpromotionした。fresh Stage 2 formal holdout 18 paired trajectoriesではC1が18/18でMtaji > Namua、C6が18/18でNamua > Mtajiとなり、両候補ともexact two-sided sign-test \`p=1/131072\`とprospectively fixed Holm-Bonferroni gateをPASSして\`CONFIRMED\`。production / independent formal Stage coreもexact一致した。Study lifecycleは\`CLOSED / FORMAL-COMPLETE\`。C1/C6をgame-theoretic forcing、search ease、value等へ拡張しない。Stage 1/2 seedはconsume済みでsame-evidence rerunを行わない。protected depth-10 holdoutは\`SEALED / NOT GENERATED / NOT READ\`のまま。historical program plan上の次候補はG3-05だが、自動開始せず、次はseparate post-G3-04 G3-05 authorization reviewを行う。`;
s = s.slice(0, afterUh) + currentUpdate + s.slice(endCurrentPara);
const oldG304 = "- **G3-04 — Structural Forcing-Corridor / Decision-Funnel Study 1**: reply narrowingが持続するcorridorと、多数branchが少数RAW stateへ収束するfunnelを検証する。`forcing`はstructural forcingのみを意味する。post-G3-03 reviewで**`G3-04-AUTHORIZED`**（prospective Study-definitionのみ）。fresh evidenceは未承認。**P0 / AUTHORIZED-FOR-PREREG**";
const newG304 = "- **G3-04 — Structural Forcing-Corridor / Decision-Funnel Study 1**: `SFCDF-STUDY1`として完了。Stage 1からC1/C6だけをpromotionし、fresh Stage 2 holdout 18 pairsでC1 `MTAJI-GREATER`、C6 `NAMUA-GREATER`をそれぞれ18/18同方向・exact `p=1/131072`・Holm PASSで`CONFIRMED`。**P0 / CLOSED / FORMAL-COMPLETE**";
need(s.includes(oldG304) || s.includes(newG304), "FUTURE_RESEARCH_AGENDA: G3-04 wave bullet missing");
s = s.replace(oldG304, newG304);
s = s.replace(
  "- **G3-05 — Branch Expansion / Compression Transition Study 1**: trajectory上のbranch explosion、reply compression、branch reopening等のgeometry transitionを検証する。Research Generation 1 phase-transition resultとは別construct。**P1**",
  "- **G3-05 — Branch Expansion / Compression Transition Study 1**: trajectory上のbranch explosion、reply compression、branch reopening等のgeometry transitionを検証する。Research Generation 1 phase-transition resultとは別construct。G3-04 closure後も自動authorizeしない。**P1 / NEXT PROGRAM AUTHORIZATION REVIEW REQUIRED / NOT AUTHORIZED**"
);
write(files.future, s);

const g304ProgramBlock = `## G3-04 formal closure\n\nG3-04は\`SFCDF-STUDY1\`としてprospectively freezeし、Stage 0 \`STAGE0-PASS\`、Stage 1 \`STAGE1-PASS\`、Stage 2 \`STAGE2-PASS\`まで完了した。\n\nStage 1 fresh \`31410001..31410192\`では12 paired trajectoriesをexactly one authorized executionで測定し、C1 unit-width occupancyを\`MTAJI-GREATER\`、C6 cumulative tree/RAW ratioを\`NAMUA-GREATER\`としてpromotionした。C2–C5はpromotionされずStage 2へ進めていない。\n\nStage 2ではStage 1 RAW-root 24、trajectory 24、first-16-prefix 12 identitiesをadditional firewallとしてmaterializeし、fresh \`31420001..31420288\`から18 paired trajectories / 36 rootsをexactly one authorized formal executionで測定した。\n\nFormal candidate decisions:\n\n- C1 \`SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION\` = **\`CONFIRMED / MTAJI-GREATER\`**。18/18同方向、exact two-sided sign-test \`p=1/131072\`、Holm PASS。\n- C6 \`SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO\` = **\`CONFIRMED / NAMUA-GREATER\`**。18/18同方向、exact two-sided sign-test \`p=1/131072\`、Holm PASS。\n\nProduction / independent formal Stage scientific coreは\`e9c3a70cba8e7341bcda33fcc7c5083bb24147d32f3ccfc024ed0f6c551b7039\`でexact一致した。Stage 2 durable artifactはID \`9844368476\`、ZIP SHA-256 \`c4d10eb07eec6ed75510f344f5c06d13deabeb03210023cd541035f05bd5da0f\`。\n\nStudy lifecycleは\`CLOSED / FORMAL-COMPLETE\`。このlifecycle tokenは新しいscientific omnibus labelではなく、formal inferenceはcandidate-levelの\`CONFIRMED\` / \`NOT-CONFIRMED\`に限定する。\n\nC1/C6からgame-theoretic forcing、best-move clarity、search ease、strategic simplicity、human difficulty、value/win probability、causal phase effect、depth >5 generalizationを導かない。\n\nCanonical records:\n\n- \`../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md\`\n- \`../structural-forcing-corridor-decision-funnel/CURRENT_STATUS.md\`\n- \`../structural-forcing-corridor-decision-funnel/DECISION_REGISTER.md\`\n- \`../structural-forcing-corridor-decision-funnel/REPRODUCIBILITY_INDEX.md\`\n- \`../structural-forcing-corridor-decision-funnel/checkpoints/2026-09-02-stage-2-formal-pass-study-closure.md\`\n\n`;

s = read(files.rg3Status);
s = s.replace(
  "Program status = ACTIVE / G3-03 CLOSED TECHNICAL-INVALID / G3-04 AUTHORIZED / PREREG FREEZE REQUIRED",
  "Program status = ACTIVE / G3-04 CLOSED FORMAL-COMPLETE / POST-G3-04 G3-05 REVIEW REQUIRED"
);
s = s.replace(
  "Active scientific research branch = none / G3-04 STUDY DEFINITION NOT YET FROZEN",
  "Active scientific research branch = none / G3-04 CLOSED"
);
s = s.replace(
  "Next scientific action = prospective G3-04 Study-definition / preregistration freeze; no G3-04 fresh evidence is authorized before freeze and separate Stage authorization",
  "Next scientific action = separate post-G3-04 current-state authorization review for G3-05; G3-05 is NOT AUTHORIZED"
);
if (!s.includes("G3-04 = SFCDF-STUDY1 / CLOSED / FORMAL-COMPLETE")) {
  const line = "G3-03 no-rescue boundary = CROSSED / ACTIVE";
  const add = `${line}\nG3-04 = SFCDF-STUDY1 / CLOSED / FORMAL-COMPLETE\nG3-04 Stage 0 = STAGE0-PASS\nG3-04 Stage 1 = STAGE1-PASS / authorized executions 1 / actual executions 1\nG3-04 Stage 2 = STAGE2-PASS / authorized executions 1 / actual executions 1\nG3-04 C1 = CONFIRMED / MTAJI-GREATER\nG3-04 C6 = CONFIRMED / NAMUA-GREATER\nG3-04 Stage 1 seed = 31410001..31410192 / CONSUMED\nG3-04 Stage 2 seed = 31420001..31420288 / CONSUMED\nG3-04 no-rescue boundary = CROSSED / ACTIVE`;
  need(s.includes(line), "RG3 CURRENT_STATUS: G3-03 boundary anchor missing");
  s = s.replace(line, add);
}
if (!s.includes("## G3-04 formal closure")) s = insertBefore(s, "## Protected evidence", g304ProgramBlock, "RG3 CURRENT_STATUS");
s = replaceSection(
  s,
  "## Next program boundary",
  "Historical `PROGRAM_PLAN.md` remains unchanged.",
  `## Next program boundary\n\nG3-04はclosedであり、同Studyの追加seed、rerun、endpoint rescue、threshold変更は行わない。\n\nHistorical \`PROGRAM_PLAN.md\`では次のcore agenda itemはG3-05 — Branch Expansion / Compression Transition Study 1である。ただしG3-04のpositive resultはG3-05を自動authorizeしない。\n\n次の安全なprogram actionは、**post-G3-04 current-state G3-05 authorization review**をread-onlyで実施し、G3-05が現在のformal evidence boundaryから独立に開始可能か、追加prerequisiteが必要か、またはnot-authorizedかを明示的に判定することである。authorization review完了前にG3-05 fresh scientific evidenceを生成・readしない。\n\nProtected depth-10 holdoutは引き続き\`SEALED / NOT GENERATED / NOT READ\`。\n\nHistorical \`PROGRAM_PLAN.md\` remains unchanged.\n`,
  "RG3 CURRENT_STATUS"
);
write(files.rg3Status, s);

s = read(files.rg3Readme);
s = s.replace(
  "Status = ACTIVE / G3-03 TCTGD-STUDY1 CLOSED TECHNICAL-INVALID / NEXT STUDY REVIEW REQUIRED",
  "Status = ACTIVE / G3-04 SFCDF-STUDY1 CLOSED FORMAL-COMPLETE / POST-G3-04 G3-05 REVIEW REQUIRED"
);
if (!s.includes("G3-04 = SFCDF-STUDY1 / CLOSED / FORMAL-COMPLETE")) {
  const anchor = "G3-03 Stage 2 seed = 31320001..31320288 / NOT CONSUMED";
  need(s.includes(anchor), "RG3 README: G3-03 status anchor missing");
  s = s.replace(anchor, `${anchor}\nG3-04 program review = G3-04-AUTHORIZED\nG3-04 = SFCDF-STUDY1 / CLOSED / FORMAL-COMPLETE\nG3-04 Stage 0 = STAGE0-PASS\nG3-04 Stage 1 = STAGE1-PASS / executions 1 authorized / 1 actual\nG3-04 Stage 2 = STAGE2-PASS / executions 1 authorized / 1 actual\nG3-04 C1 = CONFIRMED / MTAJI-GREATER\nG3-04 C6 = CONFIRMED / NAMUA-GREATER\nG3-04 Stage 1 seed = CONSUMED\nG3-04 Stage 2 seed = CONSUMED`);
}
if (!s.includes("../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md")) {
  const firstReadAnchor = "- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing program state";
  need(s.includes(firstReadAnchor), "RG3 README: first-read anchor missing");
  s = s.replace(firstReadAnchor, `${firstReadAnchor}\n- [\`../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md\`](../structural-forcing-corridor-decision-funnel/STUDY_1_FINAL_REPORT.md) — completed G3-04 formal result and interpretation boundary`);
}
if (!s.includes("## G3-04 formal closure")) s = insertBefore(s, "## Protected evidence", g304ProgramBlock, "RG3 README");
s = s.replace(
  "G3-02もpost-G3-02 program reviewもこれを生成・readしていない。G3-03 Studyでもこのholdoutを開封しない。",
  "G3-02 / G3-03 / G3-04はいずれもこれを生成・readしていない。G3-04 closure後も封印を維持する。"
);
s = replaceSection(
  s,
  "## Next program boundary",
  "## Canonical records",
  `## Next program boundary\n\nG3-04は\`SFCDF-STUDY1 = CLOSED / FORMAL-COMPLETE\`。C1は\`CONFIRMED / MTAJI-GREATER\`、C6は\`CONFIRMED / NAMUA-GREATER\`。\n\nHistorical program plan上の次候補はG3-05 — Branch Expansion / Compression Transition Study 1だが、**G3-05はまだauthorizeされていない**。次はseparate post-G3-04 current-state authorization reviewを行う。review前にG3-05 fresh evidenceを生成・readしない。\n\n`,
  "RG3 README"
);
write(files.rg3Readme, s);

const planAfter = read(files.rg3Plan);
need(planAfter.includes("G3-05 — Branch Expansion / Compression Transition Study 1"), "historical PROGRAM_PLAN expected G3-05 entry missing");

for (const [name, f] of Object.entries(files)) {
  need(fs.existsSync(f), `${name} missing after materialization`);
}

console.log(JSON.stringify({
  studyId: "SFCDF-STUDY1",
  disposition: "CENTRAL-DOC-SYNC-MATERIALIZED",
  rootReadmeUpdated: true,
  researchIndexUpdated: true,
  futureAgendaUpdated: true,
  rg3ReadmeUpdated: true,
  rg3CurrentStatusUpdated: true,
  historicalProgramPlanModified: false,
  nextProgramAction: "POST-G3-04-G3-05-AUTHORIZATION-REVIEW",
  g305Authorized: false,
  protectedDepth10: "SEALED / NOT GENERATED / NOT READ"
}));
