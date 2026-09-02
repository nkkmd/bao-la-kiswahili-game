#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path");
const ROOT=path.resolve(__dirname,"../..");
const p=r=>path.join(ROOT,r),read=r=>fs.readFileSync(p(r),"utf8"),write=(r,s)=>fs.writeFileSync(p(r),s);
function rep(s,a,b,label){if(s.includes(b))return s;if(!s.includes(a))throw new Error(`${label}: old text missing`);return s.replace(a,b);}
function ins(s,anchor,block,unique,label){if(s.includes(unique))return s;if(!s.includes(anchor))throw new Error(`${label}: anchor missing`);return s.replace(anchor,block+anchor);}
function has(s,x,label){if(!s.includes(x))throw new Error(`${label}: missing ${x}`);}
function no(s,x,label){if(s.includes(x))throw new Error(`${label}: stale ${x}`);}

let s=read("doc/RESEARCH_INDEX.md");
s=rep(s,
"**Program boundary:** G3-06は`NOT AUTHORIZED`。開始前にseparate post-G3-05 current-state authorization reviewが必要であり、G3-05 partial telemetryをvalidated mechanism/transition inputとして継承しない。",
"**Historical boundary at G3-05 closure:** このG3-05 closure時点ではG3-06は`NOT AUTHORIZED`で、separate post-G3-05 current-state authorization reviewが必要だった。その後このreviewを経てG3-06は独立に実施され、現在は`BRMGI-STUDY1 = CLOSED / TECHNICAL-INVALID`。G3-05 partial telemetryをvalidated mechanism/transition inputとして継承していない。",
"RESEARCH_INDEX historical G3-05 boundary");
write("doc/RESEARCH_INDEX.md",s);

s=read("doc/FUTURE_RESEARCH_AGENDA.md");
s=rep(s,
"G3-05 `BECT-STUDY1`はStage 0 v2を`STAGE0-PASS`として完了後、fresh Stage 1をexactly one authorized executionで開始したが、bounded RAW enumeration中の`relay-limit` technical errorにより`TECHNICAL-INVALID`でfail-closedした。Stage 1 seed `31510001..31510240`はconsume済み、no-rescue boundaryはactive、formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。partial telemetryはdiagnostic-onlyで、branch expansion/compression transitionのpositive/negative scientific evidenceへ格上げしない。G3-06は自動authorizeせず、次はseparate post-G3-05 current-state authorization reviewを行う。",
"G3-05 `BECT-STUDY1`はStage 0 v2を`STAGE0-PASS`として完了後、fresh Stage 1をexactly one authorized executionで開始したが、bounded RAW enumeration中の`relay-limit` technical errorにより`TECHNICAL-INVALID`でfail-closedした。Stage 1 seed `31510001..31510240`はconsume済み、no-rescue boundaryはactive、formal promoted candidate setは`[]`、Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。partial telemetryはdiagnostic-onlyで、branch expansion/compression transitionのpositive/negative scientific evidenceへ格上げしない。**G3-05 closure時点では**G3-06を自動authorizeせず、separate post-G3-05 current-state authorization reviewを次のactionとして要求した。そのreviewは後に完了し、G3-06も現在はclosure済みである。",
"FUTURE historical G3-05 boundary");
write("doc/FUTURE_RESEARCH_AGENDA.md",s);

s=read("doc/research-generation-3/README.md");
s=rep(s,
"- [`../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md`](../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md) — G3-05 program closure / G3-06 not authorized",
"- [`../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md`](../research-program-decisions/2026-09-02-g3-05-technical-invalid-closure.md) — G3-05 program closure時点のhistorical boundary（当時G3-06 not authorized）",
"RG3 README historical link label");
write("doc/research-generation-3/README.md",s);

s=read("doc/bao-rule-mechanism-geometry-intervention/REPRODUCIBILITY_INDEX.md");
s=rep(s,"## Program authorization\n","## Initial program authorization (historical)\n","repro auth heading");
s=rep(s,
"- fresh Stage 1: NOT AUTHORIZED",
"- fresh Stage 1 at this initial review point: NOT AUTHORIZED; Stage 1 was later separately authorized exactly once after Stage 0 PASS and preauthorization tooling audit",
"repro historical Stage1 auth");
s=rep(s,
"Each future fresh scientific Stage requires:",
"The frozen prospective execution-integrity contract required the following for any fresh scientific Stage:",
"repro execution integrity tense");
write("doc/bao-rule-mechanism-geometry-intervention/REPRODUCIBILITY_INDEX.md",s);

s=read("doc/bao-rule-mechanism-geometry-intervention/DECISION_REGISTER.md");
s=rep(s,
"G3-06のformal resultが将来`CONFIRMED`になった場合でも、そのlabelが直接意味するのはprospectively frozen population / event-control contract / relative depth 5におけるmove-conditioned or event-conditioned geometry differenceのみである。\n\nGeneric causal rule mechanism、長期勝敗、game-theoretic forcing、search ease/stability、human difficultyへの拡張は別Study/evidenceなしに行わない。",
"Prospective contract上、仮にvalid Stage 2 candidateが`CONFIRMED`へ到達した場合でも、許可される意味はfrozen population / event-control contract / relative depth 5におけるmove-conditioned or event-conditioned geometry differenceだけだった。実際のBRMGI-STUDY1はStage 1で`TECHNICAL-INVALID`となりformal promoted candidate set `[]`で閉じたため、そのconfirmation pathには到達していない。\n\nGeneric causal rule mechanism、長期勝敗、game-theoretic forcing、search ease/stability、human difficultyへの拡張は認めず、technical-invalid provenanceからそれらを推論しない。",
"decision causal boundary tense");
s=ins(s,"Stage 0 v1/v2 records:\n","Study closure records:\n\n- `../research-program-decisions/2026-09-03-g3-06-technical-invalid-closure.md`\n- `../research-generation-3/checkpoints/2026-09-03-g3-06-technical-invalid-closure.md`\n- `checkpoints/2026-09-03-stage-1-technical-invalid-study-closure.md`\n\n","Study closure records:","decision closure refs");
write("doc/bao-rule-mechanism-geometry-intervention/DECISION_REGISTER.md",s);

const cpRel="doc/bao-rule-mechanism-geometry-intervention/checkpoints/2026-09-03-final-document-consistency-pass.md";
s=read(cpRel);
const run=process.env.GITHUB_RUN_ID||"local", head=process.env.GITHUB_SHA||"unknown";
const chron=`\n## Final chronology clarification audit\n\nCurrent-facing historical-boundary wording was rechecked after the first consistency pass. G3-05-era statements that G3-06 was not yet authorized are now explicitly labeled as historical-at-that-time statements, while current state remains G3-06 closed and G3-07 not authorized. BRMGI reproducibility/decision prose was also changed from pending/future tense to historical prospective-contract wording. No scientific result, preregistration, protocol, or historical program plan was rewritten.\n\nChronology audit workflow run: \`${run}\`\nChronology audit trigger HEAD: \`${head}\`\n`;
if(!s.includes("## Final chronology clarification audit"))s+=chron;
write(cpRel,s);

for(const rel of ["README.md","doc/RESEARCH_INDEX.md","doc/FUTURE_RESEARCH_AGENDA.md","doc/research-generation-3/README.md","doc/research-generation-3/CURRENT_STATUS.md","doc/bao-rule-mechanism-geometry-intervention/STUDY_1_OVERVIEW.md","doc/bao-rule-mechanism-geometry-intervention/DECISION_REGISTER.md","doc/bao-rule-mechanism-geometry-intervention/REPRODUCIBILITY_INDEX.md"]){
 const x=read(rel);has(x,"G3-06",`${rel} G3-06`);if(rel!=="README.md")no(x,"G3-06は`NOT AUTHORIZED`。開始前に",`${rel} unqualified stale boundary`);
}
has(read("doc/bao-rule-mechanism-geometry-intervention/REPRODUCIBILITY_INDEX.md"),"Study = CLOSED / TECHNICAL-INVALID","repro closure");
has(read("doc/bao-rule-mechanism-geometry-intervention/DECISION_REGISTER.md"),"formal promoted candidate set `[]`","decision closed confirmation path");
has(read(cpRel),"Final chronology clarification audit","checkpoint chronology");
console.log(JSON.stringify({disposition:"BRMGI-G3-06-FINAL-DOCUMENT-CHRONOLOGY-CLEANUP-PASS",scientificFilesTouched:false,programPlanTouched:false}));
