#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const ROOT = path.resolve(__dirname, "../..");
function read(p) { return fs.readFileSync(path.join(ROOT, p), "utf8"); }
function write(p, s) { fs.writeFileSync(path.join(ROOT, p), s); }
function once(s, oldText, newText, label) {
  const count = s.split(oldText).length - 1;
  assert.equal(count, 1, `${label}: expected exactly one anchor, got ${count}`);
  assert(!s.includes(newText), `${label}: replacement already present unexpectedly`);
  return s.replace(oldText, newText);
}
function insertAfterOnce(s, anchor, addition, label) {
  const count = s.split(anchor).length - 1;
  assert.equal(count, 1, `${label}: expected exactly one anchor, got ${count}`);
  assert(!s.includes(addition.trim()), `${label}: addition already present unexpectedly`);
  return s.replace(anchor, anchor + addition);
}

// 1) G3-01 README: keep G3-01 immutable; update only the current downstream dependency paragraph.
{
  const p = "doc/local-game-tree-geometry-measurement-foundation/README.md";
  let s = read(p);
  const oldText = "G3-01のformal eligible measurement family setは空である。したがって、G3-02〜G3-08をこのinstrumentのまま自動開始してはならない。2026-08-31のprogram-level dependency decisionにより、次のscientific directionとしてG3-01とは別の新しいpost-G3-01 / pre-G3-02 measurement-instrument prerequisite（working title: `Local Game-Tree Geometry Measurement Instrument Verification Study 1`）を選択した。formal Study ID、scientific execution、fresh seed consumptionはまだ開始していない。";
  const newText = "G3-01のformal eligible measurement family setは空である。このG3-01 formal decisionは現在も不変であり、本Study自体からG3-02〜G3-08を自動開始してはならない。\n\nその後、2026-08-31のprogram-level dependency decisionに従って、G3-01とは別のpost-G3-01 / pre-G3-02 prospective prerequisite `LGTGMIV-STUDY1`を新規に開始し、fresh Stage 1 / Stage 2 evidenceで独立検証した。`LGTGMIV-STUDY1`は2026-09-01に`CLOSED / FORMAL-ELIGIBLE-ALL`で閉じ、5つのfrozen RAW-only depth-5 local geometry measurement familiesすべてがformal eligibleとなり、research branchの`main`統合も完了した。これはG3-01のrepair / rescue / rerunではなく、G3-01の`TECHNICAL-INVALID`およびeligible family `[]`を変更しない。\n\n現在は`automaticG302StartAuthorized = false`であり、G3-02は別のpost-closure authorization review待ちである。review完了前にG3-02 fresh scientific evidenceを生成しない。standard initial RAW-root complete exact depth-10 holdoutは引き続き`SEALED / NOT GENERATED / NOT READ`である。";
  s = once(s, oldText, newText, "G3-01 README current dependency");
  write(p, s);
}

// 2) G3-01 CURRENT_STATUS: update only the current RG3 dependency paragraph, preserving all historical stage records.
{
  const p = "doc/local-game-tree-geometry-measurement-foundation/CURRENT_STATUS.md";
  let s = read(p);
  const oldText = "2026-08-31のprogram-level dependency reassessmentにより、次のscientific directionとしてmeasurement instrumentを新規に再構築・検証するpost-G3-01 / pre-G3-02 prospective prerequisite Study（working title: `Local Game-Tree Geometry Measurement Instrument Verification Study 1`）を選択した。これはG3-01のStudy 2、corrected rerun、rescue、G3-02そのものではない。formal Study ID、scientific execution、fresh seed consumptionはまだ開始しておらず、G3-01のclosed resultは変更しない。";
  const newText = "2026-08-31のprogram-level dependency reassessmentにより選択したpost-G3-01 / pre-G3-02 prospective prerequisiteは、その後`LGTGMIV-STUDY1`として正式固定され、G3-01とは別のfresh evidenceを用いてStage 0/1/2を完遂した。2026-09-01のformal closureは`CLOSED / FORMAL-ELIGIBLE-ALL`で、5つのfrozen RAW-only depth-5 local geometry measurement familiesすべてがformal eligibleとなり、research branchの`main`統合も完了している。これはG3-01のStudy 2、corrected rerun、repair、rescue、same-evidence replicationではなく、G3-01のclosed resultは変更しない。\n\n現在のdownstream stateは`automaticG302StartAuthorized = false`であり、G3-02は別のpost-closure authorization review待ちである。review完了前にG3-02 fresh scientific evidenceを生成しない。protected standard-root depth-10 exact holdoutは`SEALED / NOT GENERATED / NOT READ`のままである。";
  s = once(s, oldText, newText, "G3-01 CURRENT_STATUS RG3 dependency");
  write(p, s);
}

// 3) FUTURE_RESEARCH_AGENDA §10.5: synchronize only current Wave-A disposition labels.
{
  const p = "doc/FUTURE_RESEARCH_AGENDA.md";
  let s = read(p);
  const oldG301 = "- **G3-01 — Local Game-Tree Geometry Measurement Foundation Study 1**: `LGTGMF-STUDY1`として実行・closure済み。Stage 1でroot-level / F1〜F5 exact agreementは得たがcanonical stage-manifest implementation defectによりformal decision `TECHNICAL-INVALID`、eligible family `[]`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`。同evidenceを修正rerunせず、新規prospective prerequisiteまたはdependency再設計が必要。**CLOSED / dependency-blocking**";
  const newG301 = "- **G3-01 — Local Game-Tree Geometry Measurement Foundation Study 1**: `LGTGMF-STUDY1`として実行・closure済み。Stage 1でroot-level / F1〜F5 exact agreementは得たがcanonical stage-manifest implementation defectによりformal decision `TECHNICAL-INVALID`、eligible family `[]`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`。このformal decisionは不変。後続の独立prerequisite `LGTGMIV-STUDY1`はfresh evidenceで`CLOSED / FORMAL-ELIGIBLE-ALL`となり、5 familyすべてのbounded RAW-only depth-5 eligibilityを別Studyとして確立済み。**G3-01 CLOSED / immutable; prerequisite completed separately**";
  const oldG302 = "- **G3-02 — Effective Branching / Reply-Width Structure Study 1**: 数plyにわたるeffective branching / reply-width profileが再現可能な局面特性として存在するかを検証する。**P0**";
  const newG302 = "- **G3-02 — Effective Branching / Reply-Width Structure Study 1**: 数plyにわたるeffective branching / reply-width profileが再現可能な局面特性として存在するかを検証する。LGTGMIV closure後もautomatic startは未承認で、別のpost-closure authorization reviewが必要。review完了前にfresh scientific evidenceを生成しない。**P0 / AUTHORIZATION REVIEW REQUIRED / NOT STARTED**";
  s = once(s, oldG301, newG301, "FUTURE §10.5 G3-01");
  s = once(s, oldG302, newG302, "FUTURE §10.5 G3-02");
  write(p, s);
}

// 4) RG3 README: add current closure decision and integration checkpoint to the current-facing reading path.
{
  const p = "doc/research-generation-3/README.md";
  let s = read(p);
  const anchor = "- [`../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md`](../local-game-tree-geometry-measurement-instrument-verification/STUDY_1_FINAL_REPORT.md) — `LGTGMIV-STUDY1`最終報告\n";
  const addition = "- [`../research-program-decisions/2026-09-01-lgtgmiv-closure-and-g3-02-review-required.md`](../research-program-decisions/2026-09-01-lgtgmiv-closure-and-g3-02-review-required.md) — LGTGMIV formal closureとG3-02別authorization review requirementのcurrent program decision\n- [`checkpoints/2026-09-01-lgtgmiv-main-integration-complete.md`](checkpoints/2026-09-01-lgtgmiv-main-integration-complete.md) — LGTGMIV closed research branchの`main`統合完了記録\n";
  s = insertAfterOnce(s, anchor, addition, "RG3 README current closure links");
  write(p, s);
}

// 5) LGTGMIV README: surface repository integration without changing scientific closure.
{
  const p = "doc/local-game-tree-geometry-measurement-instrument-verification/README.md";
  let s = read(p);
  const anchor = "Study-start source baseline:\n\n`a53aabd26f78ac408445aff2d18ace3b21b827d7`\n";
  const addition = "\nRepository integration:\n\n- scientific research-branch head: `1777ba717ced88be64cbaf981ce7096372046334`\n- `main` integration: **COMPLETE**\n- final closure audit: `33466581297 / success`\n- checkpoint: [`checkpoints/2026-09-01-main-integration-complete.md`](checkpoints/2026-09-01-main-integration-complete.md)\n";
  s = insertAfterOnce(s, anchor, addition, "LGTGMIV README integration status");
  write(p, s);
}

// 6) Research index: add direct current program-decision/integration links to item 30.
{
  const p = "doc/RESEARCH_INDEX.md";
  let s = read(p);
  const anchor = "- [`local-game-tree-geometry-measurement-instrument-verification/CURRENT_STATUS.md`](local-game-tree-geometry-measurement-instrument-verification/CURRENT_STATUS.md)\n";
  const addition = "- [`research-program-decisions/2026-09-01-lgtgmiv-closure-and-g3-02-review-required.md`](research-program-decisions/2026-09-01-lgtgmiv-closure-and-g3-02-review-required.md) — LGTGMIV closure / G3-02 review requirementのprogram decision\n- [`research-generation-3/checkpoints/2026-09-01-lgtgmiv-main-integration-complete.md`](research-generation-3/checkpoints/2026-09-01-lgtgmiv-main-integration-complete.md) — `main` integration完了checkpoint\n";
  s = insertAfterOnce(s, anchor, addition, "RESEARCH_INDEX item 30 current links");
  write(p, s);
}

// 7) Root README: add direct program decision / integration checkpoint beside RG3 current status.
{
  const p = "README.md";
  let s = read(p);
  const anchor = "- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / `LGTGMF-STUDY1`は`TECHNICAL-INVALID`のままclosed。post-G3-01 prerequisite `LGTGMIV-STUDY1`は`FORMAL-ELIGIBLE-ALL`でclosedし、RAW-only depth-5 local geometryの5 measurement familiesがformal eligible。G3-02は自動開始せず別authorization review待ち、depth 10はG3-11用holdoutとしてsealed。\n";
  const addition = "- [`doc/research-program-decisions/2026-09-01-lgtgmiv-closure-and-g3-02-review-required.md`](doc/research-program-decisions/2026-09-01-lgtgmiv-closure-and-g3-02-review-required.md): `LGTGMIV-STUDY1`のformal closureを受理し、G3-02を自動開始せず別authorization reviewを要求するcurrent program decision。\n- [`doc/research-generation-3/checkpoints/2026-09-01-lgtgmiv-main-integration-complete.md`](doc/research-generation-3/checkpoints/2026-09-01-lgtgmiv-main-integration-complete.md): LGTGMIV closed research branchの`main` fast-forward統合完了checkpoint。\n";
  s = insertAfterOnce(s, anchor, addition, "Root README RG3 current links");
  write(p, s);
}

// 8) Maintenance checkpoint. This is repository-documentation synchronization only.
{
  const p = "doc/research-generation-3/checkpoints/2026-09-01-lgtgmiv-current-doc-consistency-sync.md";
  assert(!fs.existsSync(path.join(ROOT, p)), "maintenance checkpoint already exists unexpectedly");
  const body = `# Research Generation 3 — LGTGMIV current-document consistency synchronization\n\nDate: 2026-09-01\n\n## Scope\n\nThis checkpoint records a documentation-only synchronization after \`LGTGMIV-STUDY1\` scientific closure and \`main\` integration.\n\nNo scientific result, preregistration, protocol, authorization, result JSON, seed consumption, formal decision, eligible-family set or protected-evidence state was regenerated or reinterpreted. Historical dated checkpoints remain unchanged. \`doc/research-generation-3/PROGRAM_PLAN.md\` remains immutable historical prospective planning material.\n\n## Current state preserved\n\n\`\`\`text\nG3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID / eligible families []\nLGTGMIV-STUDY1 = CLOSED / FORMAL-ELIGIBLE-ALL\nLGTGMIV formal eligible families = F1,F2,F3,F4,F5\nLGTGMIV main integration = COMPLETE\nG3-02 automatic start = BLOCKED\nNext scientific action = separate post-closure G3-02 authorization review\nProtected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ\n\`\`\`\n\n## Current-facing files synchronized\n\n- \`README.md\`\n- \`doc/RESEARCH_INDEX.md\`\n- \`doc/FUTURE_RESEARCH_AGENDA.md\`\n- \`doc/research-generation-3/README.md\`\n- \`doc/local-game-tree-geometry-measurement-foundation/README.md\`\n- \`doc/local-game-tree-geometry-measurement-foundation/CURRENT_STATUS.md\`\n- \`doc/local-game-tree-geometry-measurement-instrument-verification/README.md\`\n`;
  write(p, body);
}

console.log("LGTGMIV_CURRENT_DOC_CONSISTENCY_MATERIALIZED=PASS");
