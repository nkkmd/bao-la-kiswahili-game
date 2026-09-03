#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),zlib=require("node:zlib"),crypto=require("node:crypto");
const ROOT=path.resolve(__dirname,"../..");
const IN=path.join(ROOT,"doc/search-instability-local-geometry-mechanism/results/stage-1/scientific-result.json.gz");
const SUMMARY=path.join(ROOT,"doc/search-instability-local-geometry-mechanism/results/stage-1/STAGE_1_RESULT_SUMMARY.json");
const DEFAULT_OUT=path.join(ROOT,"artifacts/local/search-instability-local-geometry-mechanism/stage2-input/STAGE_2_FORMAL_INPUT.json");
const RAW_SHA="20209db1b87bdf3e87f48f1968014154d6f2862820eabea40be645cd1f924470";
function need(x,m){if(!x)throw new Error(m)}
function sha(b){return crypto.createHash("sha256").update(b).digest("hex")}
function parseArgs(){let out=DEFAULT_OUT,a=process.argv.slice(2);for(let i=0;i<a.length;i++){if(a[i]==="--output")out=path.resolve(a[++i]);else throw Error(`unknown arg ${a[i]}`)}return out}
function uniqSorted(a){return [...new Set(a)].sort()}
function main(){
 const out=parseArgs(),raw=zlib.gunzipSync(fs.readFileSync(IN));need(sha(raw)===RAW_SHA,"Stage1 canonical gzip/raw SHA mismatch");
 const d=JSON.parse(raw.toString("utf8")),s=JSON.parse(fs.readFileSync(SUMMARY,"utf8"));
 need(d.stageDisposition==="STAGE1-PASS"&&d.protectedDepth10Access===false,"Stage1 prerequisite invalid");
 need(s.canonicalScientificResultSha256===RAW_SHA&&s.promotedCandidateCount===8,"Stage1 compact summary mismatch");
 need(Array.isArray(d.formalPromotedCandidateSet)&&d.formalPromotedCandidateSet.length===8,"promoted set count mismatch");
 const selected=d.selection&&d.selection.core&&d.selection.core.selected;need(Array.isArray(selected)&&selected.length===48,"Stage1 selected identity set mismatch");
 const ids={
  sourceSeed:selected.map(x=>x.seed).sort((a,b)=>a-b),
  fullTrajectorySha256:uniqSorted(selected.map(x=>x.fullTrajectorySha256)),
  openingPrefixSha256:uniqSorted(selected.map(x=>x.openingPrefixSha256)),
  rootRawSha256:uniqSorted(selected.map(x=>x.rootRawSha256)),
  sourcePlyRootIdentity:selected.map(x=>`${x.seed}|${x.selectedPly}|${x.rootRawSha256}`).sort()
 };
 for(const [k,v] of Object.entries(ids))need(v.length===48,`Stage1 identity collision/count mismatch ${k}`);
 const result={schemaVersion:1,studyId:"SILGM-STUDY1",stageId:"SILGM-S2-FORMAL-2026-09-03-v1",purpose:"STAGE2-FORMAL-INPUT-AND-STAGE1-IDENTITY-EXCLUSION",canonicalStage1ScientificResultSha256:RAW_SHA,retainedStage1ScientificFields:["formalPromotedCandidateSet"],retainedStage1IdentityFields:Object.keys(ids),stage1ScientificRowsRetained:false,stage1MeasurementsRetained:false,stage1DevelopmentNonPromotedCandidateDetailsRetained:false,promotedCandidates:d.formalPromotedCandidateSet,identityExclusion:ids,identityCounts:Object.fromEntries(Object.entries(ids).map(([k,v])=>[k,v.length])),stage2FreshSeedAccessDuringMaterialization:false,protectedDepth10Access:false};
 fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+"\n");
 console.log(JSON.stringify({materialized:true,promotedCandidateCount:8,identityCounts:result.identityCounts,stage2FreshSeedAccess:false,protectedDepth10Access:false,outputSha256:sha(fs.readFileSync(out))}));
}
main();
