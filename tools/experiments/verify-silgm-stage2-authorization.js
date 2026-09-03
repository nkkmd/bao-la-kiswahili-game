#!/usr/bin/env node
"use strict";

const fs=require("node:fs");
const path=require("node:path");
const cp=require("node:child_process");
const crypto=require("node:crypto");
const ROOT=path.resolve(__dirname,"../..");
const AUTH_PATH="doc/search-instability-local-geometry-mechanism/authorizations/STAGE_2_FORMAL_AUTHORIZATION.json";
const TRIGGER_PATH="doc/search-instability-local-geometry-mechanism/triggers/STAGE_2_FORMAL_EXECUTION_TRIGGER.json";
const PREAUTH_PATH="doc/search-instability-local-geometry-mechanism/results/stage-2-preauthorization-v1/PREAUTH_AUDIT_RESULT.json";
function need(v,m){if(!v)throw new Error(m);}
function read(p){return JSON.parse(fs.readFileSync(path.join(ROOT,p),"utf8"));}
function git(...a){return cp.execFileSync("git",a,{cwd:ROOT,encoding:"utf8"}).trim();}
function blobAt(ref,p){return git("rev-parse",`${ref}:${p}`);}
function sha(p){return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT,p))).digest("hex");}
function main(){
  const head=git("rev-parse","HEAD"),authorizationCommit=git("rev-parse","HEAD^"),toolingCommit=git("rev-parse","HEAD^^");need(fs.existsSync(path.join(ROOT,AUTH_PATH)),"Stage2 authorization missing");need(fs.existsSync(path.join(ROOT,TRIGGER_PATH)),"Stage2 execution trigger missing");const a=read(AUTH_PATH),t=read(TRIGGER_PATH),audit=read(PREAUTH_PATH);
  need(a.studyId==="SILGM-STUDY1"&&a.stageId==="SILGM-S2-FORMAL-2026-09-03-v1","authorization identity mismatch");need(a.authorizationDecision==="STAGE2-AUTHORIZED","Stage2 authorization decision mismatch");need(a.authorizationNonce==="SILGM-S2-AUTH-2026-09-03-V1-01","Stage2 nonce mismatch");need(a.maxAuthorizedScientificExecutions===1,"Stage2 max executions mismatch");need(a.seedStart===31720001&&a.seedEnd===31720384,"Stage2 seed block mismatch");need(a.formalInputCoreSha256==="6c796df950f05df2b193ab0a5d2a6f74dfa179745a9953d337f72a745cc5d0b0","formal input core authorization mismatch");need(a.protectedDepth10AccessAuthorized===false,"protected evidence authorization invalid");need(a.expectedToolingCommit===toolingCommit,"tooling commit mismatch");
  need(t.studyId===a.studyId&&t.stageId===a.stageId&&t.authorizationNonce===a.authorizationNonce,"trigger identity mismatch");need(t.authorizationCommit===authorizationCommit&&t.toolingCommit===toolingCommit,"trigger commit binding mismatch");need(t.authorizationGitBlobSha===blobAt("HEAD^",AUTH_PATH),"trigger authorization Git blob mismatch");need(t.authorizationContentSha256===sha(AUTH_PATH),"trigger authorization content hash mismatch");need(t.maxScientificExecutions===1,"trigger execution count mismatch");need(t.protectedDepth10AccessAuthorized===false,"trigger protected access invalid");need(process.env.GITHUB_RUN_ATTEMPT===undefined||process.env.GITHUB_RUN_ATTEMPT==="1","workflow rerun attempt prohibited");
  need(audit.auditDisposition==="STAGE2-PREAUTH-STATIC-AUDIT-PASS"&&audit.formalInputCoreSha256===a.formalInputCoreSha256,"preauth audit binding invalid");for(const b of audit.bindings)need(blobAt("HEAD",b.path)===b.gitBlobSha,`source blob changed: ${b.path}`);for(const b of a.executionToolBindings)need(blobAt("HEAD",b.path)===b.gitBlobSha,`execution tool blob changed: ${b.path}`);
  console.log(JSON.stringify({authorizationVerified:true,studyId:a.studyId,stageId:a.stageId,head,authorizationCommit,toolingCommit,authorizationNonce:a.authorizationNonce,maxAuthorizedScientificExecutions:1,seedBlock:`${a.seedStart}..${a.seedEnd}`,formalInputCoreSha256:a.formalInputCoreSha256,freshStage2SeedAccessBeforeRunner:false,protectedDepth10AccessAuthorized:false,runAttempt:process.env.GITHUB_RUN_ATTEMPT||null}));
}
main();
