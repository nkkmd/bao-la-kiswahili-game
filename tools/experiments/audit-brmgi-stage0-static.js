#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const cp=require("node:child_process");
const ROOT=path.resolve(__dirname,"../..");
function read(p){return fs.readFileSync(path.join(ROOT,p),"utf8");}
function need(x,m){if(!x)throw new Error(m);}
function main(){
 const specPath="doc/bao-rule-mechanism-geometry-intervention/prereg/STUDY_1_SPEC.json";
 const prodPath="tools/experiments/lib/brmgi-production.js";
 const indepPath="tools/experiments/lib/brmgi-independent.js";
 const runnerPath="tools/experiments/run-brmgi-stage0-technical.js";
 const workflowPath=".github/workflows/brmgi-stage0-technical.yml";
 const spec=JSON.parse(read(specPath)),prod=read(prodPath),indep=read(indepPath),runner=read(runnerPath),workflow=read(workflowPath);
 need(spec.studyId==="BRMGI-STUDY1","studyId mismatch");
 need(spec.stages[0].stageId==="BRMGI-S0-TECHNICAL-2026-09-02-v1","Stage 0 mismatch");
 need(spec.seedNamespaces.technical.start===31609001&&spec.seedNamespaces.technical.end===31609008,"technical seed mismatch");
 need(!runner.includes("31610001")&&!runner.includes("31620001"),"scientific seed literal found in Stage 0 runner");
 need(!runner.includes("depth-10")&&!runner.includes("DEPTH_10"),"depth-10 path found in runner");
 for(const forbidden of ["transposition-concentration-tree-graph-divergence/results","structural-forcing-corridor-decision-funnel/results","branch-expansion-compression-transition/results"])need(!runner.includes(forbidden)&&!prod.includes(forbidden)&&!indep.includes(forbidden),`forbidden upstream outcome read: ${forbidden}`);
 need(prod.includes('require("./lgtgmiv-stage1-production.js")'),"production upstream binding missing");
 need(indep.includes('require("./lgtgmiv-stage1-independent.js")'),"independent upstream binding missing");
 need(!prod.includes("brmgi-independent")&&!indep.includes("brmgi-production"),"BRMGI cross-import detected");
 need(prod!==indep,"production/independent source unexpectedly identical");
 need(workflow.includes("brmgi-stage0-trigger.txt"),"unique trigger marker missing");
 need(workflow.includes("upload-artifact"),"artifact upload missing");
 need(workflow.includes("concurrency:"),"concurrency guard missing");
 for(const file of [prodPath,indepPath,runnerPath])cp.execFileSync(process.execPath,["--check",path.join(ROOT,file)],{stdio:"pipe"});
 const result={schemaVersion:1,studyId:spec.studyId,stageId:spec.stages[0].stageId,audit:"STATIC-PASS",scientificRunnerExecuted:false,technicalFixtureExecuted:false,freshStage1SeedAccess:false,freshStage2SeedAccess:false,protectedDepth10Access:false,checks:{preregJsonParse:true,stageBinding:true,scientificSeedAbsentFromRunner:true,protectedDepth10PathAbsent:true,upstreamOutcomeReadsAbsent:true,implementationSeparation:true,syntax:true,workflowTriggerUnique:true,artifactPathDeclared:true,concurrencyDeclared:true}};
 process.stdout.write(JSON.stringify(result,null,2)+"\n");
}
main();
