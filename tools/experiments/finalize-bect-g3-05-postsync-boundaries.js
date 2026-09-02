#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const paths={
  future:"doc/FUTURE_RESEARCH_AGENDA.md",
  status:"doc/research-generation-3/CURRENT_STATUS.md",
  readme:"doc/research-generation-3/README.md",
  plan:"doc/research-generation-3/PROGRAM_PLAN.md",
  result:"doc/branch-expansion-compression-transition/results/stage-1/scientific-result.json"
};
function read(p){return fs.readFileSync(p,"utf8");}
function write(p,s){fs.writeFileSync(p,s);}
function need(x,m){if(!x)throw new Error(m);}
function rep(s,a,b,label){if(s.includes(b))return s;need(s.includes(a),`${label}: old text missing`);return s.replace(a,b);}
const planBefore=read(paths.plan);

let s=read(paths.future);
s=rep(s,
  "historical program plan上の次候補はG3-05だが、自動開始せず、次はseparate post-G3-04 G3-05 authorization reviewを行う。",
  "その後separate post-G3-04 reviewを経てG3-05が独立に実施されたが、G3-04のC1/C6を救済・再定義したものではない。",
  "future historical G3-04 next-step sentence");
write(paths.future,s);

s=read(paths.status);
s=rep(s,
  "G3-02 / G3-03 / G3-04はいずれもこのholdoutを生成・read・peekしていない。G2-12はdepth-10 truthの代替として使用しない。",
  "G3-02 / G3-03 / G3-04 / G3-05はいずれもこのholdoutを生成・read・peekしていない。G2-12はdepth-10 truthの代替として使用しない。",
  "RG3 status protected evidence");
const newStatusBoundary=`## Next program boundary\n\nG3-05 / \`BECT-STUDY1\`は\`CLOSED / TECHNICAL-INVALID\`。Stage 1 seedはconsume済みでsame-evidence rescueは禁止、formal promoted candidate setは\`[]\`、Stage 2は\`NOT-AUTHORIZED-NOT-EXECUTED\`である。\n\nHistorical \`PROGRAM_PLAN.md\`上の次候補はG3-06 — Bao Rule-Mechanism / Geometry Intervention Study 1。ただしG3-05はvalid transition familyをpromotionしていないため、G3-06はBECT partial telemetry / transition directionをvalidated inputとして継承できない。\n\n次の安全なprogram actionは、**post-G3-05 current-state G3-06 authorization review**をfresh-free / read-onlyで実施し、LGTGMIVのformal eligible RAW depth-5 geometryと独立に定義したrule-semantic eventsだけでG3-06を開始可能か、追加prerequisiteが必要か、またはnot-authorizedかを明示的に判定することである。review完了前にG3-06 fresh scientific evidenceを生成・readしない。\n\nProtected depth-10 holdoutは引き続き\`SEALED / NOT GENERATED / NOT READ\`。\n\nHistorical \`PROGRAM_PLAN.md\` remains unchanged.\n`;
need(s.includes("## Next program boundary"),"RG3 status next boundary heading missing");
s=s.replace(/## Next program boundary[\s\S]*$/m,newStatusBoundary);
write(paths.status,s);

s=read(paths.readme);
s=rep(s,
  "G3-02 / G3-03 / G3-04はいずれもこれを生成・readしていない。G3-04 closure後も封印を維持する。",
  "G3-02 / G3-03 / G3-04 / G3-05はいずれもこれを生成・readしていない。G3-05 closure後も封印を維持する。",
  "RG3 README protected evidence");
if(!s.includes("## G3-05 formal closure")){
  const anchor="## Protected evidence\n";
  need(s.includes(anchor),"RG3 README protected heading missing");
  const block=`## G3-05 formal closure\n\nG3-05は\`BECT-STUDY1\`としてprospectively freezeし、Stage 0 v2を\`STAGE0-PASS\`として完了した。その後fresh Stage 1をexactly one authorized executionで開始したが、bounded RAW enumeration中の\`relay-limit enumeration c948b9e00d1e8b4bd711528eda7a7441e4e40ffe369e52a9ada6e7d86963f529\`によりfail-closedした。\n\nFormal closureは\`CLOSED / TECHNICAL-INVALID\`。Stage 1 seed \`31510001..31510240\`はconsume済み、formal promoted candidate setは\`[]\`、Stage 2は\`NOT-AUTHORIZED-NOT-EXECUTED\`。partial telemetryはdiagnostic-onlyで、branch expansion/compression transitionのpositive/negative scientific evidenceへ格上げしない。same-evidence rerunやrelay-limit repair-and-rescueは禁止する。\n\nDurable artifact \`9849245665\`はexact-byte mirror run \`33637372364\`でscientific recomputationなしにrepositoryへ保存された。\n\nCanonical records:\n\n- \`../branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md\`\n- \`../branch-expansion-compression-transition/CURRENT_STATUS.md\`\n- \`../branch-expansion-compression-transition/DECISION_REGISTER.md\`\n- \`../branch-expansion-compression-transition/REPRODUCIBILITY_INDEX.md\`\n- \`../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md\`\n- \`checkpoints/2026-09-02-g3-05-technical-invalid-closure.md\`\n\n`;
  s=s.replace(anchor,block+anchor);
}
const oldBoundary=/## Next program boundary\n[\s\S]*?\n## Canonical records\n/m;
need(oldBoundary.test(s),"RG3 README next-boundary section missing");
const newBoundary=`## Next program boundary\n\nG3-05 / \`BECT-STUDY1\`は\`CLOSED / TECHNICAL-INVALID\`であり、formal promoted candidate setは\`[]\`、Stage 2は未実行である。\n\nHistorical program plan上の次候補はG3-06だが、**G3-06はまだauthorizeされていない**。次はseparate post-G3-05 current-state authorization reviewを行う。review前にG3-06 fresh evidenceを生成・readせず、G3-05 partial telemetryをvalidated transition/mechanism evidenceとして継承しない。\n\n## Canonical records\n`;
s=s.replace(oldBoundary,newBoundary);
if(!s.includes("../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md`\n- `CURRENT_STATUS.md")){
  const anchor="- `CURRENT_STATUS.md`\n";
  need(s.includes(anchor),"RG3 README canonical current-status anchor missing");
  const block="- `../branch-expansion-compression-transition/STUDY_1_OVERVIEW.md`\n- `../branch-expansion-compression-transition/STUDY_1_FINAL_REPORT.md`\n- `../branch-expansion-compression-transition/CURRENT_STATUS.md`\n- `../branch-expansion-compression-transition/DECISION_REGISTER.md`\n- `../branch-expansion-compression-transition/REPRODUCIBILITY_INDEX.md`\n- `../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md`\n- `checkpoints/2026-09-02-g3-05-technical-invalid-closure.md`\n";
  s=s.replace(anchor,block+anchor);
}
write(paths.readme,s);

need(read(paths.plan)===planBefore,"historical PROGRAM_PLAN changed unexpectedly");
const r=JSON.parse(read(paths.result));
need(r.stageDisposition==="TECHNICAL-INVALID"&&r.actualScientificExecutions===1&&r.seedBlockConsumed===true&&r.noRescueBoundaryCrossed===true,"scientific closure drift");
console.log(JSON.stringify({disposition:"BECT-G3-05-POSTSYNC-BOUNDARIES-FINALIZED",g305:"CLOSED / TECHNICAL-INVALID",g306Authorized:false,programPlanModified:false,scientificResultModified:false}));
