#!/usr/bin/env node
"use strict";

const fs = require("node:fs");

function read(p) { return fs.readFileSync(p, "utf8"); }
function write(p, s) { fs.writeFileSync(p, s); }
function replaceRequired(text, oldText, newText, label) {
  if (text.includes(newText)) return text;
  const n = text.split(oldText).length - 1;
  if (n !== 1) throw new Error(`${label}: expected one old block, found ${n}`);
  return text.replace(oldText, newText);
}
function insertAfter(text, anchor, block, label) {
  if (text.includes(block.trim())) return text;
  const i = text.indexOf(anchor);
  if (i < 0) throw new Error(`${label}: anchor not found`);
  const end = i + anchor.length;
  return text.slice(0, end) + block + text.slice(end);
}
function appendIfMissing(text, marker, block) {
  if (text.includes(marker)) return text;
  return text.trimEnd() + "\n\n" + block.trim() + "\n";
}

const provenanceBlock = `

> **Closure provenance clarification:** the executed Stage 1 v1 candidate-decision run was technically invalidated after the IDENTITY positive control exposed an exact-oracle reconstruction defect. Its fresh zero-mismatch observations are retained only as reproducible diagnostics. A corrected v2 path was drafted, but v2 was not authorized or executed. The canonical \`NON-ESTIMABLE\` result is therefore a **Study-level closure decision because no valid formal candidate-decision run was completed**, not a candidate validation or rejection.
`;

// Study README
{
  const p = "doc/symmetry-isomorphic-positions/README.md";
  let t = read(p);
  t = insertAfter(t, "Study ID: `SIP-STUDY1`", provenanceBlock, "study README provenance");
  t = t.replace("Fresh historically reachable depth-3 bounded-local graphsでは、3 scientific candidates / 5 formal outcomesのすべてでexact mismatchが0だった。", "Technically invalidated v1 executionのfresh historically reachable depth-3 bounded-local graphsでは、3 scientific candidates / 5 preregistered scopesのすべてでexact mismatchが0だった。このzero-mismatch observationはdiagnostic evidenceとしてのみ保持する。");
  t = t.replace("このためfresh zero-mismatch evidenceは保持するが、formal validationへ昇格しない。candidate rejectionにも読み替えず、5 outcomesすべてを`NON-ESTIMABLE`としてStudy 1をcloseした。", "v1はcandidate-decision runとしてtechnical invalidationされ、corrected v2は未承認・未実行のまま終了した。このためformal validationにもcandidate rejectionにも進まず、5 outcomesすべてをStudy-level `NON-ESTIMABLE`としてcloseした。");
  write(p, t);
}

// Current status
{
  const p = "doc/symmetry-isomorphic-positions/CURRENT_STATUS.md";
  let t = read(p);
  t = insertAfter(t, "**COMPLETED — formal result `NON-ESTIMABLE`; 0 formally validated transforms.**", provenanceBlock, "current status provenance");
  t = t.replace("Five preregistered scientific outcomes were executed under frozen candidate, domain, source-hash and authorization contracts. Fresh historically reachable bounded-local graphs showed exact zero mismatch for all scientific candidates, but the mandatory immutable Restricted Endgame 8-state oracle anchor could not satisfy the positive-control / independent-equality requirements. The independent verifier therefore assigned all five outcomes `NON-ESTIMABLE` with `G12=FAIL`.", "The v1 candidate-decision execution used frozen candidate, domain, source-hash and authorization contracts, but was technically invalidated when the mandatory immutable Restricted Endgame 8-state oracle reconstruction failed the IDENTITY positive control. Production/independent fresh bounded-local diagnostics both observed exact zero mismatch, while the oracle path disagreed. No corrected v2 formal contract was completed or authorized. The Study therefore closes all five preregistered outcomes as `NON-ESTIMABLE` without a valid candidate-level pass/fail decision.");
  t = t.replace("The fresh zero-mismatch evidence is preserved as bounded evidence but is not promoted to formal validation.", "The invalidated-v1 fresh zero-mismatch evidence is preserved as bounded diagnostic evidence only and is not promoted to formal validation.");
  write(p, t);
}

// Overview
{
  const p = "doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md";
  let t = read(p);
  t = insertAfter(t, "Status: **COMPLETED — FORMAL OUTCOMES NON-ESTIMABLE**", provenanceBlock, "overview provenance");
  t = t.replace("Formal fresh validationではproductionとindependent verifierの双方が以下を再現した。", "Technically invalidated v1 executionのfresh-domain diagnosticではproductionとindependent verifierの双方が以下を再現した。");
  t = t.replace("したがってfresh bounded-local source graphsだけを見れば、全candidateはG1–G8のprospective scopeでzero mismatchだった。", "したがってinvalidated v1のfresh bounded-local source graphsだけを見れば、全candidateはG1–G8相当のprospective scopeでzero mismatchだった。ただしv1はcandidate-decision runとして無効であり、この観測をformal validationへ使わない。");
  t = t.replace("5 preregistered outcomesすべてについて、independent verifierはG12をFAILとし、最終decisionを", "v1ではproduction / independent oracle accountingが一致せずG12相当のequality requirementを満たさなかったうえ、IDENTITY failureによりrun自体がtechnical invalidationされた。corrected v2は未承認・未実行である。したがってStudy-level closureとして5 preregistered outcomesすべてを");
  write(p, t);
}

// Final report
{
  const p = "doc/symmetry-isomorphic-positions/STUDY_1_FINAL_REPORT.md";
  let t = read(p);
  t = t.replace("Formal stage: `SIP-S1-FORMAL-2026-08-24-v1`  ", "Executed candidate-decision stage: `SIP-S1-FORMAL-2026-08-24-v1` — **TECHNICALLY INVALIDATED**  \nCorrected v2 stage: **NOT AUTHORIZED / NOT EXECUTED**  ");
  t = insertAfter(t, "Status: **COMPLETED**", provenanceBlock, "final report provenance");
  t = t.replace("本Studyのformal resultは、5つのpreregistered scientific outcomeすべてについて", "本Studyの**Study-level closure decision**は、5つのpreregistered scientific outcomeすべてについて");
  t = t.replace("これはcandidate transformationにexact transition mismatchが確認されたためではない。fresh historically reachable bounded-local graphsでは、productionとindependent verifierの双方で全scientific candidateがzero mismatchだった。", "これはcandidate transformationにvalid formal run上のexact transition mismatchが確認されたためではない。technically invalidated v1のfresh historically reachable bounded-local diagnosticsでは、productionとindependent verifierの双方で全scientific candidateがzero mismatchだった。これらはcandidate decision evidenceではない。");
  t = t.replace("formal validationを止めたのは、prospectively mandatoryとしたRestricted Endgame 8-state exact-oracle anchorのstate-row identity integrityと、それに起因するproduction / independent equality gate `G12` のfailureである。", "v1をcandidate-decision runとしてtechnical invalidationしたのは、prospectively mandatoryとしたRestricted Endgame 8-state exact-oracle reconstructionがIDENTITY positive controlを満たさず、state-row identity integrityとproduction / independent equalityを保証できなかったためである。補正v2は設計草案に留まり、spec / authorization / independent verifier / formal outcomeを作成せず終了した。そのためStudy-levelで`NON-ESTIMABLE`としてcloseした。");
  write(p, t);
}

// Experiment index: append clarification
{
  const p = "doc/symmetry-isomorphic-positions/EXPERIMENT_INDEX.md";
  let t = read(p);
  t = appendIfMissing(t, "## Closure provenance clarification", `## Closure provenance clarification

The executed v1 candidate-decision path is recorded in \`results/STAGE_1_V1_INVALIDATION.json\` as \`TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION\`. Fresh zero-mismatch and control counts from v1 are diagnostic only. A corrected v2 runner draft existed, but no v2 formal spec, authorization, independent verifier, or result was created; v2 was not authorized or executed. The Study-level final state remains 0 validated / 0 rejected / 5 \`NON-ESTIMABLE\`.`);
  write(p, t);
}

// Decision register
{
  const p = "doc/symmetry-isomorphic-positions/DECISION_REGISTER.md";
  let t = read(p);
  t = appendIfMissing(t, "## D-025 — v1 invalidation controls the closure provenance", `## D-025 — v1 invalidation controls the closure provenance

The executed \`SIP-S1-FORMAL-2026-08-24-v1\` run is technically invalidated for candidate-decision use because the IDENTITY positive control fails only in the exact-oracle reconstruction path. Its fresh zero-mismatch observations remain diagnostic only. The proposed corrected \`SIP-S1-FORMAL-2026-08-24-v2\` path was not completed: no v2 formal spec, authorization, independent verifier, or scientific result exists. Study closure at 5/5 \`NON-ESTIMABLE\` is therefore a Study-level estimability decision caused by the absence of a valid completed formal candidate run. This clarification supersedes any wording that could be read as treating v1 G12 output itself as a valid formal candidate decision.`);
  write(p, t);
}

// Reproducibility index
{
  const p = "doc/symmetry-isomorphic-positions/REPRODUCIBILITY_INDEX.md";
  let t = read(p);
  const block = `## v1 technical invalidation and unexecuted v2 correction

The archived v1 production/independent files are preserved byte-for-byte for traceability, but \`results/STAGE_1_V1_INVALIDATION.json\` marks that run \`TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION\`. The root cause is the oracle reconstruction from terminal \`stateRows.ruleState\`, for which three snapshots do not re-hash to their stored raw keys and represent 63 seeds.

A corrected v2 production runner was drafted prospectively around raw oracle graph reconstruction, but the correction path was not completed: \`STAGE_1_FORMAL_SPEC_V2.json\`, \`STAGE_1_AUTHORIZATION_V2.json\`, an independent v2 verifier, and v2 result artifacts were never created. v2 was not authorized or executed. The draft runner is not part of the closed Study result.

Accordingly, the final 0 validated / 0 rejected / 5 \`NON-ESTIMABLE\` status is a Study-level closure decision. Fresh v1 zero-mismatch counts are reproducible diagnostics from an invalidated run, not formal positive findings.

`;
  if (!t.includes("## v1 technical invalidation and unexecuted v2 correction")) {
    const marker = "## Formal outcome artifacts";
    const i = t.indexOf(marker);
    if (i < 0) throw new Error("repro formal artifact marker missing");
    t = t.slice(0, i) + block + t.slice(i);
  }
  write(p, t);
}

// Research log
{
  const p = "doc/symmetry-isomorphic-positions/RESEARCH_LOG.md";
  let t = read(p);
  t = appendIfMissing(t, "## 2026-08-24 — Closure provenance clarification", `## 2026-08-24 — Closure provenance clarification

- Final repository audit recovered the already-recorded \`STAGE_1_V1_INVALIDATION.json\` chronology.
- The v1 run is therefore treated as technically invalidated for candidate-decision use; its fresh zero-mismatch observations remain diagnostics only.
- A corrected v2 runner draft existed, but no v2 formal spec, authorization, independent verifier, workflow result, or candidate decision was ever created.
- The correction path was not resumed. Study closure remains 0 validated / 0 rejected / 5 \`NON-ESTIMABLE\` because no valid completed formal candidate-decision run exists.
- This does not change Restricted Endgame Study 1 and does not rescue any SIP candidate.`);
  write(p, t);
}

// Closure checkpoint
{
  const p = "doc/symmetry-isomorphic-positions/checkpoints/2026-08-24-study1-closure.md";
  let t = read(p);
  t = insertAfter(t, "Status: **CLOSED**", provenanceBlock, "closure checkpoint provenance");
  t = t.replace("All five frozen fresh bounded-local scientific scopes produced exact mismatch count 0 in production and independent implementations. This evidence is retained but is not promoted to Study-level validation because the prospectively mandatory immutable exact-oracle anchor and production/independent equality gate `G12` were not estimable to the required exact standard.", "The technically invalidated v1 execution produced exact fresh bounded-local mismatch count 0 in production and independent implementations for all five frozen scopes. These counts are retained as diagnostics only. v1 cannot supply candidate decisions because IDENTITY exposed an oracle reconstruction defect, and the proposed corrected v2 path was not authorized or executed. The Study-level closure is therefore 5/5 `NON-ESTIMABLE` because no valid completed formal candidate-decision run exists.");
  write(p, t);
}

// Central RESEARCH_INDEX
{
  const p = "doc/RESEARCH_INDEX.md";
  let t = read(p);
  const old1 = "Fresh formal domainはseeds `22910001..22910064`、Namua / Mtaji / Mtaji-houseless各8 roots、depth 3である。3 candidates / 5 scientific outcomesはいずれもproduction / independent双方でfresh bounded-local mismatch 0だった。negative controlは638 fresh mismatches、IDENTITYはfresh mismatch 0で、fresh machineryはpositive/negative controlを識別した。";
  const new1 = "Technically invalidated v1 diagnosticはseeds `22910001..22910064`、Namua / Mtaji / Mtaji-houseless各8 roots、depth 3で実行され、3 candidates / 5 preregistered scopesはいずれもproduction / independent双方でfresh bounded-local mismatch 0だった。negative controlは638 fresh mismatches、IDENTITYはfresh mismatch 0だったが、v1はcandidate-decision runとしてtechnical invalidationされているため、これらはdiagnostic evidenceのみである。";
  t = replaceRequired(t, old1, new1, "research index fresh paragraph");
  const old2 = "しかしmandatoryとしたRestricted Endgame Study 1のimmutable 8-state exact-oracle anchorではIDENTITY positive control自身がPASSせず、production oracle mismatch count 19とindependent count 10が一致しなかった。G12がFAILしたため、5 outcomesすべて最終 `NON-ESTIMABLE` とした。post-outcome read-only diagnosticでは3 terminal stateRowsについてstored `stateKey`とstored `ruleState`のcanonical re-hash不一致を確認したが、これは上流Restricted Endgame Study 1のformal decisionを変更しない。";
  const new2 = "mandatoryとしたRestricted Endgame Study 1のimmutable 8-state exact-oracle reconstructionでIDENTITY positive control自身がPASSしなかったため、v1は`TECHNICALLY-INVALIDATED-NO-CANDIDATE-DECISION`となった。corrected v2はdraft runnerに留まり、formal spec / authorization / independent verifier / resultを作成せず未承認・未実行で終了した。したがってvalid formal candidate-decision runが存在せず、Study-level closureは5 outcomesすべて`NON-ESTIMABLE`である。read-only diagnosticで確認した3 terminal stateRowsのidentity limitationは、上流Restricted Endgame Study 1のformal decisionを変更しない。";
  t = replaceRequired(t, old2, new2, "research index closure paragraph");
  write(p, t);
}

// Future research agenda
{
  const p = "doc/FUTURE_RESEARCH_AGENDA.md";
  let t = read(p);
  const oldIntro = "Symmetry / Isomorphic Positions Study 1も完了した。fresh formal seed block `22910001..22910064`からoutcome-blindにfreezeしたNamua / Mtaji / Mtaji-houselessのdepth-3 bounded-local graphsでは、3 scientific candidates・5 formal outcomesすべてでproduction / independent双方がexact mismatch 0を再現した。一方、preregistered mandatory anchorであるRestricted Endgame Study 1のimmutable 8-state result artifactをrule-semantic transform検証へ接続した際、IDENTITY positive controlを含むoracle layerでproduction / independent equality `G12`を満たせなかった。post-outcome read-only diagnosticでは8 stateRows中3 terminal rowsにstored `stateKey`とstored `ruleState`のre-hash不一致が確認されたため、formal resultは0 validated / 0 rejected / 5 `NON-ESTIMABLE`で閉じた。この診断はRestricted Endgame Study 1のformal decisionを変更しない。";
  const newIntro = "Symmetry / Isomorphic Positions Study 1も完了した。technically invalidated v1 executionのfresh bounded-local diagnosticsでは3 scientific candidates・5 preregistered scopesすべてでproduction / independent双方がexact mismatch 0を再現したが、mandatory oracle reconstructionでIDENTITY positive controlがFAILしたためv1はcandidate-decision runとして無効化された。corrected v2はformal spec / authorization / independent verifier / resultを作成せず未承認・未実行で終了した。したがってvalid formal candidate-decision runは完成せず、Study-level resultは0 validated / 0 rejected / 5 `NON-ESTIMABLE`で閉じた。post-v1 read-only diagnosticで確認したoracle terminal-row identity limitationはRestricted Endgame Study 1のformal decisionを変更しない。";
  t = replaceRequired(t, oldIntro, newIntro, "agenda intro symmetry paragraph");
  const old411 = "Fresh historically reachable bounded-local graphsではT01 seat swap、T02 houseless-Mtaji LR、T03 compositionの5 formal scopesすべてでexact mismatch 0だった。しかしmandatory exact-oracle anchorのIDENTITY positive controlとproduction / independent equality G12を満たせず、formal validationは成立しなかった。validated transformは0件で、canonicalization / symmetry group / symmetry-reduced state countingは未承認である。";
  const new411 = "Technically invalidated v1のfresh historically reachable bounded-local diagnosticsではT01 seat swap、T02 houseless-Mtaji LR、T03 compositionの5 preregistered scopesすべてでexact mismatch 0だった。しかしmandatory exact-oracle reconstructionのIDENTITY positive control failureによりv1はcandidate-decision runとして無効化され、corrected v2は未承認・未実行で終了した。valid formal candidate-decision runは完成していないためvalidated transformは0件で、canonicalization / symmetry group / symmetry-reduced state countingは未承認である。";
  t = replaceRequired(t, old411, new411, "agenda 4.11 result paragraph");
  const oldStage3 = "限定終盤と必勝圏 Study 1のbounded exact solutionはそのformal boundaryのまま保持する。Symmetry Study 1ではfresh bounded-local zero-mismatch evidenceを得た一方、mandatory oracle-anchor integrity / G12を完了できずformal transform validationは0件だった。したがってcanonical representationやsymmetry reductionをState Space研究の前提にしない。raw-state State Space研究は進行可能であり、symmetry-reduced countが必要な場合のみ、上流Studyを変更しない新規oracle-integrity / symmetry-confirmation研究を先行させる。";
  const newStage3 = "限定終盤と必勝圏 Study 1のbounded exact solutionはそのformal boundaryのまま保持する。Symmetry Study 1ではinvalidated v1 fresh diagnosticsとしてzero-mismatchを観測した一方、valid formal candidate-decision runは完成せず、corrected v2は未承認・未実行のままStudy-level 5/5 `NON-ESTIMABLE`で閉じた。したがってcanonical representationやsymmetry reductionをState Space研究の前提にしない。raw-state State Space研究は進行可能であり、symmetry-reduced countが必要な場合のみ、上流Studyを変更しない新規oracle-integrity / symmetry-confirmation研究を先行させる。";
  t = replaceRequired(t, oldStage3, newStage3, "agenda stage3 paragraph");
  write(p, t);
}

// Root README research bullet
{
  const p = "README.md";
  let t = read(p);
  const old = "- [`doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`](doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md): Symmetry / Isomorphic Positions Study 1「対称性と同型局面の厳密検証」の初見向け成果概要（Study 1 closed、0 validated / 0 rejected / 5 `NON-ESTIMABLE`; fresh bounded-local mismatch 0、mandatory oracle-anchor G12 failed）";
  const neu = "- [`doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`](doc/symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md): Symmetry / Isomorphic Positions Study 1「対称性と同型局面の厳密検証」の初見向け成果概要（Study 1 closed、0 validated / 0 rejected / 5 `NON-ESTIMABLE`; invalidated v1 fresh diagnostics mismatch 0、corrected v2 not authorized/executed）";
  t = replaceRequired(t, old, neu, "root README symmetry bullet");
  write(p, t);
}

console.log("Symmetry Study 1 closure provenance clarification complete");
