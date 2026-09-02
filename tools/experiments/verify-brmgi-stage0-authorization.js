#!/usr/bin/env node
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const cp=require("node:child_process");
const ROOT=path.resolve(__dirname,"../..");
const AUTH_PATH="doc/bao-rule-mechanism-geometry-intervention/authorizations/STAGE_0_AUTHORIZATION.json";
const TRIGGER_PATH="doc/bao-rule-mechanism-geometry-intervention/authorizations/brmgi-stage0-trigger.txt";
const auth=JSON.parse(fs.readFileSync(path.join(ROOT,AUTH_PATH),"utf8"));
function need(x,m){if(!x)throw new Error(m);}
function git(...args){return cp.execFileSync("git",args,{cwd:ROOT,encoding:"utf8"}).trim();}
function changed(commit){const out=git("diff-tree","--no-commit-id","--name-only","-r",commit);return out.split("\n").filter(Boolean);}
need(auth.studyId==="BRMGI-STUDY1","authorization study mismatch");
need(auth.stageId==="BRMGI-S0-TECHNICAL-2026-09-02-v1","authorization stage mismatch");
need(auth.maxFormalExecutions===1,"authorization execution count mismatch");
need(auth.freshStage1SeedAccessAuthorized===false,"Stage 1 seed unexpectedly authorized");
need(auth.freshStage2SeedAccessAuthorized===false,"Stage 2 seed unexpectedly authorized");
need(auth.protectedDepth10AccessAuthorized===false,"depth-10 unexpectedly authorized");
const head=git("rev-parse","HEAD"),authorizationCommit=git("rev-parse","HEAD^"),auditedHead=git("rev-parse","HEAD~2");
need(auditedHead===auth.auditedSourceHead,"audited source head mismatch");
const authChanges=changed(authorizationCommit);
need(authChanges.length===1&&authChanges[0]===AUTH_PATH,"authorization commit changed unexpected paths");
const triggerChanges=changed(head);
need(triggerChanges.length===1&&triggerChanges[0]===TRIGGER_PATH,"trigger commit changed unexpected paths");
process.stdout.write(JSON.stringify({passed:true,head,authorizationCommit,auditedHead,authorizationChanges:authChanges,triggerChanges},null,2)+"\n");
