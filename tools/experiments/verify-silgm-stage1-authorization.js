#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");

const ROOT = path.resolve(__dirname, "../..");
const AUTH = path.join(ROOT,"doc/search-instability-local-geometry-mechanism/authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json");
const TRIGGER = path.join(ROOT,"doc/search-instability-local-geometry-mechanism/authorizations/silgm-stage1-development-v1-trigger.json");
const PREAUTH = path.join(ROOT,"doc/search-instability-local-geometry-mechanism/results/stage-1-preauthorization-v1/PREAUTH_AUDIT_RESULT.json");
const EXPECTED_PREAUTH_SHA256 = "ccb7fcc99915686ccbce7d74cdc1b4218eef1cf959e5da73018241e677667174";
const TRIGGER_PATH = "doc/search-instability-local-geometry-mechanism/authorizations/silgm-stage1-development-v1-trigger.json";
const AUTH_PATH = "doc/search-instability-local-geometry-mechanism/authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json";

function need(x,m){if(!x)throw new Error(m);}
function git(...args){return cp.execFileSync("git",args,{cwd:ROOT,encoding:"utf8"}).trim();}
function readJson(p){return JSON.parse(fs.readFileSync(p,"utf8"));}
function sha256File(p){return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");}
function lines(s){return s.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);}

function main(){
  need(process.env.GITHUB_EVENT_NAME==="push","Stage1 scientific workflow must be push-triggered");
  need(process.env.GITHUB_RUN_ATTEMPT==="1","Stage1 rerun attempt prohibited");
  need(process.env.GITHUB_REF_NAME==="research/g3-07-search-instability-local-geometry-mechanism","unexpected branch");
  need(fs.existsSync(AUTH),"Stage1 authorization artifact absent");
  need(fs.existsSync(TRIGGER),"Stage1 trigger artifact absent");

  const a=readJson(AUTH),t=readJson(TRIGGER),pre=readJson(PREAUTH);
  need(a.studyId==="SILGM-STUDY1"&&a.stageId==="SILGM-S1-DEVELOPMENT-2026-09-03-v1","authorization identity mismatch");
  need(a.authorizationDecision==="STAGE1-AUTHORIZED","Stage1 authorization decision mismatch");
  need(a.maxAuthorizedScientificExecutions===1,"authorized scientific execution count must be 1");
  need(a.seedStart===31710001&&a.seedEnd===31710256,"authorized seed block mismatch");
  need(a.seedExtensionAuthorized===false&&a.rootReplacementAuthorized===false&&a.sameEvidenceRerunAuthorized===false,"no-rescue authorization invalid");
  need(a.protectedDepth10AccessAuthorized===false&&a.stage2Authorized===false,"protected/Stage2 incorrectly authorized");
  need(a.expectedPreauthorizationAuditCanonicalSha256===EXPECTED_PREAUTH_SHA256,"preauthorization digest binding mismatch");
  need(sha256File(PREAUTH)===EXPECTED_PREAUTH_SHA256,"preauthorization mirror bytes mismatch");
  need(pre.auditDisposition==="STAGE1-PREAUTH-STATIC-AUDIT-PASS"&&pre.freshStage1SeedAccess===false&&pre.protectedDepth10Access===false&&pre.noRescueBoundaryCrossed===false,"preauthorization evidence boundary mismatch");

  const head=git("rev-parse","HEAD"),authCommit=git("rev-parse","HEAD^"),toolingCommit=git("rev-parse","HEAD^^");
  need(t.studyId===a.studyId&&t.stageId===a.stageId,"trigger identity mismatch");
  need(t.authorizationCommit===authCommit,"trigger does not bind authorization commit");
  need(t.authorizationNonce===a.authorizationNonce,"trigger nonce mismatch");
  need(toolingCommit===a.expectedToolingCommit,"authorization tooling-parent mismatch");
  need(t.expectedToolingCommit===a.expectedToolingCommit,"trigger tooling-parent mismatch");

  const triggerDiff=lines(git("diff-tree","--no-commit-id","--name-only","-r","HEAD"));
  need(triggerDiff.length===1&&triggerDiff[0]===TRIGGER_PATH,"trigger commit must change only trigger artifact");
  const authDiff=lines(git("diff-tree","--no-commit-id","--name-only","-r","HEAD^"));
  need(authDiff.length===1&&authDiff[0]===AUTH_PATH,"authorization commit must change only authorization artifact");

  for(const [file,blob] of Object.entries(a.boundGitBlobs||{})){
    const got=git("rev-parse",`HEAD:${file}`); need(got===blob,`bound blob mismatch ${file}: ${got} != ${blob}`);
  }

  const spec=readJson(path.join(ROOT,"doc/search-instability-local-geometry-mechanism/prereg/STAGE_1_DEVELOPMENT_SPEC.json"));
  need(spec.seedStart===a.seedStart&&spec.seedEnd===a.seedEnd&&spec.seedExtension===false,"Stage1 spec/authorization seed mismatch");
  need(spec.executionIntegrity.maxAuthorizedScientificExecutions===1,"Stage1 spec execution count mismatch");
  need(spec.protectedDepth10==="SEALED-NOT-GENERATED-NOT-READ","protected depth10 spec mismatch");

  const runner=fs.readFileSync(path.join(ROOT,"tools/experiments/run-silgm-stage1-development.js"),"utf8");
  const prod=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/silgm-stage1-production.js"),"utf8");
  const indep=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/silgm-stage1-independent.js"),"utf8");
  need(runner.indexOf("auth=authCheck(spec)")>=0&&runner.indexOf("P.selectPopulation")>runner.indexOf("auth=authCheck(spec)"),"runner population access may precede authorization");
  need(!indep.includes("silgm-stage1-production.js")&&!indep.includes("silgm-production.js")&&!indep.includes("search-reliability-decision-robustness.js"),"independent Stage1 aliases production path");
  need(prod!==indep,"production and independent Stage1 sources identical");

  console.log(JSON.stringify({authorizationVerified:true,studyId:a.studyId,stageId:a.stageId,head,authorizationCommit:authCommit,toolingCommit,authorizationNonce:a.authorizationNonce,maxAuthorizedScientificExecutions:1,seedBlock:`${a.seedStart}..${a.seedEnd}`,freshStage1SeedAccessBeforeRunner:false,protectedDepth10AccessAuthorized:false,stage2Authorized:false,runAttempt:process.env.GITHUB_RUN_ATTEMPT}));
}

main();
