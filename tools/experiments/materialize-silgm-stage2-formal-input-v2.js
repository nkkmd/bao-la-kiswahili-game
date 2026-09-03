#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = path.resolve(__dirname, "../..");
const SUMMARY = path.join(ROOT, "doc/search-instability-local-geometry-mechanism/results/stage-1/STAGE_1_RESULT_SUMMARY.json");
const IDENT = path.join(ROOT, "doc/search-instability-local-geometry-mechanism/prereg/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json");
const SPEC = path.join(ROOT, "doc/search-instability-local-geometry-mechanism/prereg/STAGE_2_FORMAL_SPEC.json");
const DEFAULT_OUT = path.join(ROOT, "artifacts/local/search-instability-local-geometry-mechanism/stage2-input-v2/STAGE_2_FORMAL_INPUT.json");

function need(v,m){if(!v)throw new Error(m);}
function read(p){return JSON.parse(fs.readFileSync(p,"utf8"));}
function sha(v){return crypto.createHash("sha256").update(v,"utf8").digest("hex");}
function canonical(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return `[${v.map(canonical).join(",")}]`;return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`;}
function args(){const a=process.argv.slice(2);let out=DEFAULT_OUT;for(let i=0;i<a.length;i++){if(a[i]==="--output")out=path.resolve(a[++i]);else throw new Error(`unknown arg ${a[i]}`);}return{out};}
function candidateIdentity(x){return{contrastId:x.contrastId,endpointId:x.endpointId,metricId:x.metricId,thresholds:x.thresholds,direction:x.direction};}
function main(){
  const {out}=args(), s=read(SUMMARY), id=read(IDENT), spec=read(SPEC);
  need(s.studyId==="SILGM-STUDY1"&&s.stageId==="SILGM-S1-DEVELOPMENT-2026-09-03-v1","Stage1 summary identity mismatch");
  need(s.stageDisposition==="STAGE1-PASS","Stage1 not PASS");
  need(s.canonicalScientificResultSha256===spec.stage1Prerequisite.canonicalResultSha256,"Stage1 result hash mismatch");
  need(s.promotedCandidateCount===spec.stage1Prerequisite.promotedCandidateCount&&s.promotedCandidateCount===8,"promoted candidate count mismatch");
  need(Array.isArray(s.formalPromotedCandidateSet)&&s.formalPromotedCandidateSet.length===8,"promoted set unavailable");
  need(id.studyId==="SILGM-STUDY1"&&id.sourceStageId===s.stageId,"identity manifest stage mismatch");
  need(id.canonicalStage1ScientificResultSha256===s.canonicalScientificResultSha256,"identity manifest result hash mismatch");
  need(id.scientificOutcomeFieldsRetained===false,"identity manifest retains scientific outcomes");
  need(id.identityRowCount===48&&Array.isArray(id.identityRows)&&id.identityRows.length===48,"identity row count mismatch");
  need(id.stage2FreshSeedAccessDuringMaterialization===false&&id.protectedDepth10Access===false,"identity materialization boundary invalid");
  const root=new Set(),traj=new Set(),prefix=new Set();
  for(const r of id.identityRows){
    need(Number.isInteger(r.sourceSeed)&&r.sourceSeed>=31710001&&r.sourceSeed<=31710256,"Stage1 source seed invalid");
    need(Number.isInteger(r.selectedPly)&&r.selectedPly>=16&&r.selectedPly<=80,"Stage1 selected ply invalid");
    for(const k of ["rootRawSha256","fullTrajectorySha256","openingPrefixSha256"])need(typeof r[k]==="string"&&/^[0-9a-f]{64}$/.test(r[k]),`invalid ${k}`);
    root.add(r.rootRawSha256);traj.add(r.fullTrajectorySha256);prefix.add(r.openingPrefixSha256);
  }
  need(root.size===48&&traj.size===48,"Stage1 root/trajectory identities not unique");
  const formalPromotedCandidateSet=s.formalPromotedCandidateSet.map(candidateIdentity);
  const identityRows=id.identityRows.map(r=>({sourceSeed:r.sourceSeed,selectedPly:r.selectedPly,rootRawSha256:r.rootRawSha256,fullTrajectorySha256:r.fullTrajectorySha256,openingPrefixSha256:r.openingPrefixSha256}));
  const output={
    schemaVersion:1,studyId:"SILGM-STUDY1",stageId:spec.stageId,purpose:"STAGE2-FORMAL-INPUT-FROZEN-FROM-STAGE1",
    sourceStage1:{stageId:s.stageId,canonicalScientificResultSha256:s.canonicalScientificResultSha256,selectionCoreSha256:s.selectionCoreSha256,developmentCoreSha256:s.developmentCoreSha256},
    formalPromotedCandidateSet,promotedCandidateCount:formalPromotedCandidateSet.length,
    stage1IdentityExclusion:{identityRowCount:identityRows.length,identityRows,rootRawSha256:[...root].sort(),fullTrajectorySha256:[...traj].sort(),openingPrefixSha256:[...prefix].sort()},
    retainedStage1ScientificFields:["formalPromotedCandidateSet identity only"],stage1MeasurementsRetained:false,stage1NonPromotedCandidateDetailsRetained:false,stage1PromotionStrengthRetained:false,
    stage2FreshSeedAccess:false,protectedDepth10Access:false
  };
  output.formalInputCoreSha256=sha(canonical(output));
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,`${JSON.stringify(output,null,2)}\n`);
  console.log(JSON.stringify({materialized:true,stageId:spec.stageId,promotedCandidateCount:8,identityRowCount:48,formalInputCoreSha256:output.formalInputCoreSha256,stage2FreshSeedAccess:false,protectedDepth10Access:false}));
}
main();
