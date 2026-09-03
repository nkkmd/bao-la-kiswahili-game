#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),cp=require("node:child_process");
const ROOT=path.resolve(__dirname,"../.."),DOC=path.join(ROOT,"doc/local-geometry-persistence-memory-length");
function need(x,m){if(!x)throw Error(m);}function git(...a){return cp.execFileSync("git",a,{cwd:ROOT,encoding:"utf8"}).trim();}
const a=JSON.parse(fs.readFileSync(path.join(DOC,"authorizations/STAGE_1_SCIENTIFIC_AUTHORIZATION.json"),"utf8")),trigger=fs.readFileSync(path.join(DOC,"authorizations/lgpml-stage1-trigger.txt"),"utf8").trim();
need(a.studyId==="LGPML-STUDY1"&&a.stageId==="LGPML-S1-DEVELOPMENT-2026-09-03-v1","identity mismatch");need(a.authorizationDecision==="STAGE1-AUTHORIZED"&&a.maxAuthorizedScientificExecutions===1,"not authorized");need(trigger===a.triggerToken,"trigger mismatch");
const authCommit=git("rev-parse","HEAD^"),preauth=git("rev-parse","HEAD^^");need(preauth===a.preAuthorizationHead,"preauthorization ancestry mismatch");need(git("merge-base","--is-ancestor",a.toolingCommit,authCommit)==="","tooling not ancestor of authorization");
const triggerChanged=git("diff","--name-only","HEAD^","HEAD").split("\n").filter(Boolean);need(triggerChanged.length===1&&triggerChanged[0]==="doc/local-geometry-persistence-memory-length/authorizations/lgpml-stage1-trigger.txt","trigger commit contamination");
const authChanged=git("diff","--name-only","HEAD^^","HEAD^").split("\n").filter(Boolean);const allowed=new Set(["doc/local-geometry-persistence-memory-length/authorizations/STAGE_1_SCIENTIFIC_AUTHORIZATION.json","doc/local-geometry-persistence-memory-length/checkpoints/2026-09-03-stage-1-authorization.md","doc/local-geometry-persistence-memory-length/CURRENT_STATUS.md","doc/local-geometry-persistence-memory-length/DECISION_REGISTER.md"]);need(authChanged.length>=1&&authChanged.every(x=>allowed.has(x)),`authorization commit contamination: ${authChanged.join(",")}`);
for(const [p,s] of Object.entries(a.sourceBindings))need(git("hash-object",p)===s,`source binding ${p}`);
console.log(`LGPML_STAGE1_AUTHORIZATION_VERIFIED authCommit=${authCommit} preAuthorizationHead=${preauth}`);
