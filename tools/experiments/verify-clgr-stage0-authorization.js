#!/usr/bin/env node
"use strict";

const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process");
const ROOT=path.resolve(__dirname,"../.."),DOC=path.join(ROOT,"doc/continuous-local-geometry-representation");
const AUTH=path.join(DOC,"authorizations/STAGE_0_TECHNICAL_AUTHORIZATION.json");
const TRIGGER=path.join(DOC,"authorizations/clgr-stage0-v1-trigger.txt");
function need(x,m){if(!x)throw new Error(m);}
function git(...args){return cp.execFileSync("git",args,{cwd:ROOT,encoding:"utf8"}).trim();}
const a=JSON.parse(fs.readFileSync(AUTH,"utf8"));
const trigger=fs.readFileSync(TRIGGER,"utf8").trim();
need(a.studyId==="CLGR-STUDY1","study mismatch");
need(a.stageId==="CLGR-S0-TECHNICAL-2026-09-03-v1","stage mismatch");
need(a.authorizationDecision==="STAGE0-TECHNICAL-AUTHORIZED","authorization missing");
need(a.scientificInferenceAuthorized===false,"scientific inference unexpectedly authorized");
need(a.stage1ScientificExecutionAuthorized===false&&a.stage2ScientificExecutionAuthorized===false,"scientific stage unexpectedly authorized");
need(a.protectedDepth10AccessAuthorized===false,"protected depth10 unexpectedly authorized");
need(a.sameVersionAutomaticRerunAuthorized===false,"same-version rerun unexpectedly authorized");
need(trigger===a.executionContract.triggerToken,"trigger token mismatch");
need(git("merge-base","--is-ancestor",a.toolingCommit,"HEAD^")==="","tooling commit is not ancestor of trigger parent");
const changed=git("diff","--name-only","HEAD^","HEAD").split("\n").filter(Boolean);
need(changed.length===1&&changed[0]===a.executionContract.triggerPath,"trigger commit changed unexpected files");
for(const [p,blob] of Object.entries(a.sourceBindings)){need(git("hash-object",p)===blob,`blob mismatch ${p}`);}
const s1=JSON.parse(fs.readFileSync(path.join(DOC,"prereg/STAGE_1_DEVELOPMENT_SPEC.json"),"utf8"));
const s2=JSON.parse(fs.readFileSync(path.join(DOC,"prereg/STAGE_2_FORMAL_SPEC.json"),"utf8"));
need(s1.generationAuthorizedAtFreeze===false&&s2.generationAuthorizedAtFreeze===false,"fresh stage prereg unexpectedly authorized");
need(s1.seedStart===31910001&&s2.seedStart===31920001,"scientific seed namespace changed");
need(a.executionContract.maxTechnicalExecutions===1,"technical execution ceiling mismatch");
console.log("CLGR_STAGE0_AUTHORIZATION_VERIFIED");
