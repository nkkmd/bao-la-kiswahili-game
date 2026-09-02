#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const ROOT = path.resolve(__dirname, "../..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function write(rel, text) {
  fs.writeFileSync(path.join(ROOT, rel), text);
}

function replaceOnce(rel, from, to) {
  const src = read(rel);
  const first = src.indexOf(from);
  assert(first >= 0, `${rel}: expected text not found`);
  assert(src.indexOf(from, first + from.length) < 0, `${rel}: expected text is not unique`);
  write(rel, src.slice(0, first) + to + src.slice(first + from.length));
}

function insertAfterOnce(rel, marker, addition, guard) {
  const src = read(rel);
  if (guard && src.includes(guard)) return;
  const first = src.indexOf(marker);
  assert(first >= 0, `${rel}: insertion marker not found`);
  assert(src.indexOf(marker, first + marker.length) < 0, `${rel}: insertion marker is not unique`);
  const at = first + marker.length;
  write(rel, src.slice(0, at) + addition + src.slice(at));
}

// FUTURE_RESEARCH_AGENDA is current-facing. Keep historical PROGRAM_PLAN untouched.
replaceOnce(
  "doc/FUTURE_RESEARCH_AGENDA.md",
  "更新日: 2026-09-01",
  "更新日: 2026-09-02"
);

replaceOnce(
  "doc/FUTURE_RESEARCH_AGENDA.md",
  "- **G3-02 — Effective Branching / Reply-Width Structure Study 1**: 数plyにわたるeffective branching / reply-width profileが再現可能な局面特性として存在するかを検証する。LGTGMIV closure後もautomatic startは未承認で、別のpost-closure authorization reviewが必要。review完了前にfresh scientific evidenceを生成しない。**P0 / AUTHORIZATION REVIEW REQUIRED / NOT STARTED**",
  "- **G3-02 — Effective Branching / Reply-Width Structure Study 1**: LGTGMIV closure後の別authorization reviewを経て`EBRWS-STUDY1`としてprospectively開始。Stage 0は`STAGE0-PASS`。Stage 1はauthorized runのcanonical artifact materialization failureと、workflow armingに起因するunintended duplicate scientific executionによるexactly-one-execution contract違反のためfail-closedで`CLOSED / TECHNICAL-INVALID`。formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。**P0 / CLOSED / TECHNICAL-INVALID / NEXT PROGRAM REVIEW REQUIRED**"
);

insertAfterOnce(
  "doc/FUTURE_RESEARCH_AGENDA.md",
  "G3-02 = EBRWS-STUDY1 / CLOSED / TECHNICAL-INVALID\n",
  "G3-02 research workflow = COMPLETE ON RESEARCH BRANCH\nG3-02 main integration = NOT PERFORMED / PENDING EXPLICIT USER INSTRUCTION\n",
  "G3-02 main integration = NOT PERFORMED / PENDING EXPLICIT USER INSTRUCTION"
);

// RG3 README: distinguish the authorized one-shot from the later invalid duplicate.
replaceOnce(
  "doc/research-generation-3/README.md",
  "Stage 1はfresh `31210001..31210192`から12 Namua + 12 Mtajiを一度だけ実行した。runner内部ではglobal gate PASSとproduction / independent exact stage-core agreementを得たが、生成済みcanonical Stage 1 filesのrepository pushがnon-fast-forwardで失敗し、ephemeral runner終了後にfull canonical artifactを回収できなかった。",
  "Stage 1はfresh `31210001..31210192`、12 Namua + 12 Mtajiについて**exactly one scientific execution**をprospectively authorizationし、authorized run `33569323221`を実行した。runner内部ではglobal gate PASSとproduction / independent exact stage-core agreementを得たが、生成済みcanonical Stage 1 filesのrepository pushがnon-fast-forwardで失敗し、ephemeral runner終了後にfull canonical artifactを回収できなかった。後のActions-history auditで判明した2回目の実行は、このauthorizationに含まれない`INVALID-DO-NOT-USE`である。"
);

// Reproducibility index: make the chronology unambiguous now that the duplicate audit is known.
replaceOnce(
  "doc/effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md",
  "## Stage 1 one-shot execution",
  "## Authorized Stage 1 one-shot execution"
);

replaceOnce(
  "doc/effective-branching-reply-width-structure/REPRODUCIBILITY_INDEX.md",
  "No second Stage 1 execution is authorized after the no-rescue boundary. Therefore full canonical Stage 1 result/telemetry files are not regenerated.",
  "No second Stage 1 execution was authorized after the no-rescue boundary. A later final Actions-history audit nevertheless discovered an unintended unauthorized duplicate execution; it is `INVALID-DO-NOT-USE` and cannot regenerate, replace, or repair the missing canonical Stage 1 evidence. Therefore full canonical Stage 1 result/telemetry files are not regenerated as valid evidence."
);

// Study README: expose branch-completion / integration-hold state at the directory entry point.
insertAfterOnce(
  "doc/effective-branching-reply-width-structure/README.md",
  "`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID`\n",
  "\nResearch workflow: `COMPLETE ON RESEARCH BRANCH`\nMain integration: `NOT PERFORMED / PENDING EXPLICIT USER INSTRUCTION`\n",
  "Main integration: `NOT PERFORMED / PENDING EXPLICIT USER INSTRUCTION`"
);

// Root README: make the current branch-only completion state explicit without changing the scientific claim.
replaceOnce(
  "README.md",
  "- [`doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md`](doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md): Research Generation 3 `G3-02` / `EBRWS-STUDY1`。RAW-only depth 5でfresh Stage 1を実行したが、canonical result push失敗・回収不能に加え、workflow armingにより意図せず2回目のStage 1が実行されexactly-one-execution contractも違反。formal decisionは`CLOSED / TECHNICAL-INVALID`、2回目はscientific inferenceから除外、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。",
  "- [`doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md`](doc/effective-branching-reply-width-structure/STUDY_1_OVERVIEW.md): Research Generation 3 `G3-02` / `EBRWS-STUDY1`。RAW-only depth 5でfresh Stage 1を実行したが、canonical result push失敗・回収不能に加え、workflow armingにより意図せず2回目のStage 1が実行されexactly-one-execution contractも違反。formal decisionは`CLOSED / TECHNICAL-INVALID`、2回目はscientific inferenceから除外、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。research branch上のG3-02 closure作業は完了しており、`main`統合は明示的指示待ち。"
);

// Central research index: expose the same integration boundary.
insertAfterOnce(
  "doc/RESEARCH_INDEX.md",
  "Formal decision: **`EBRWS-STUDY1 = CLOSED / TECHNICAL-INVALID`**\n",
  "\nRepository state: **G3-02 research workflow complete on research branch / `main` integration not performed / pending explicit user instruction**\n",
  "Repository state: **G3-02 research workflow complete on research branch"
);

console.log("EBRWS_FINAL_DOCUMENT_CONSISTENCY_FIXES_MATERIALIZED");
