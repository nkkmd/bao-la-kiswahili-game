#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const cp=require("node:child_process");
const ROOT=path.resolve(__dirname,"../..");
const auth=JSON.parse(fs.readFileSync(path.join(ROOT,"doc/bao-rule-mechanism-geometry-intervention/authorizations/STAGE_0_AUTHORIZATION.json"),"utf8"));
function need(x,m){if(!x)throw new Error(m);}
function git(...args){return cp.execFileSync("git",args,{cwd:ROOT,encoding:"utf8"}).trim();}
need(auth.studyId==="BRMGI-STUDY1","authorization study mismatch");
need(auth.stageId==="BRMGI-S0-TECHNICAL-2026-09-02-v1","authorization stage mismatch");
need(auth.maxFormalExecutions===1,"authorization execution count mismatch");
need(auth.freshStage1SeedAccessAuthorized===false,"Stage 1 seed unexpectedly authorized");
need(auth.freshStage2SeedAccessAuthorized===false,"Stage 2 seed unexpectedly authorized");
need(auth.protectedDepth10AccessAuthorized===false,"depth-10 unexpectedly authorized");
const head=git("rev-parse","HEAD"),authorizationCommit=git("rev-parse","HEAD^"),auditedHead=git("rev-parse","HEAD~2");
need(auditedHead===auth.auditedSourceHead,"audited source head mismatch");
need(authorizationCommit===auth.authorizationCommit,"authorization commit mismatch");
const changedTrigger=git("diff-tree","--no-commit-id","--name-only","-r",head).split("\n").filter(Boolean);
need(changedTrigger.length===1&&changedTrigger[0]==="doc/bao-rule-mechanism-geometry-intervention/authorizations/brmgi-stage0-trigger.txt","trigger commit changed unexpected paths");
process.stdout.write(JSON.stringify({passed:true,head,authorizationCommit,auditedHead},null,2)+"\n");
