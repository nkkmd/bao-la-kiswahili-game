#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process");
const ROOT=path.resolve(__dirname,"../..");
const AUTH="doc/bao-rule-mechanism-geometry-intervention/authorizations/STAGE_0_V2_AUTHORIZATION.json";
const TRIGGER="doc/bao-rule-mechanism-geometry-intervention/authorizations/brmgi-stage0-v2-trigger.txt";
const a=JSON.parse(fs.readFileSync(path.join(ROOT,AUTH),"utf8"));
function need(x,m){if(!x)throw new Error(m);}function git(...x){return cp.execFileSync("git",x,{cwd:ROOT,encoding:"utf8"}).trim();}function changed(c){return git("diff-tree","--no-commit-id","--name-only","-r",c).split("\n").filter(Boolean);}
need(a.studyId==="BRMGI-STUDY1","study mismatch");need(a.stageId==="BRMGI-S0-TECHNICAL-2026-09-03-v2","stage mismatch");need(a.maxFormalExecutions===1,"execution count mismatch");need(a.freshStage1SeedAccessAuthorized===false&&a.freshStage2SeedAccessAuthorized===false&&a.protectedDepth10AccessAuthorized===false,"protected/fresh authorization violation");
const head=git("rev-parse","HEAD"),authCommit=git("rev-parse","HEAD^"),audited=git("rev-parse","HEAD~2");need(audited===a.auditedSourceHead,"audited head mismatch");need(changed(authCommit).length===1&&changed(authCommit)[0]===AUTH,"auth commit path mismatch");need(changed(head).length===1&&changed(head)[0]===TRIGGER,"trigger commit path mismatch");process.stdout.write(JSON.stringify({passed:true,head,authCommit,audited},null,2)+"\n");
