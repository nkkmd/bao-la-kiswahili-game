#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const cp = require("node:child_process");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const AUTH = path.join(ROOT, "doc/search-instability-local-geometry-mechanism/authorizations/STAGE_0_TECHNICAL_AUTHORIZATION.json");
const TRIGGER = path.join(ROOT, "doc/search-instability-local-geometry-mechanism/authorizations/silgm-stage0-v1-trigger.txt");
function need(x,m){if(!x)throw new Error(m);}
function git(...args){return cp.execFileSync("git",args,{cwd:ROOT,encoding:"utf8"}).trim();}
function main(){
  const a=JSON.parse(fs.readFileSync(AUTH,"utf8")),trigger=fs.readFileSync(TRIGGER,"utf8").trim();
  need(a.studyId==="SILGM-STUDY1","study mismatch");
  need(a.stageId==="SILGM-S0-TECHNICAL-2026-09-03-v1","stage mismatch");
  need(a.authorizationDecision==="AUTHORIZED-TECHNICAL-ONLY","authorization decision mismatch");
  need(a.maxAuthorizedExecutions===1,"execution count contract mismatch");
  need(a.freshStage1Authorized===false&&a.freshStage2Authorized===false,"fresh stage incorrectly authorized");
  need(a.protectedDepth10AccessAuthorized===false,"protected evidence incorrectly authorized");
  need(trigger===a.authorizationNonce,"trigger nonce mismatch");
  const head=git("rev-parse","HEAD"),parent=git("rev-parse","HEAD^");
  need(parent===a.expectedToolingCommit,"trigger parent is not frozen tooling commit");
  need(head!==parent,"trigger commit missing");
  for(const [file,blob] of Object.entries(a.boundGitBlobs)){
    const got=git("rev-parse",`HEAD:${file}`); need(got===blob,`blob mismatch ${file}: ${got} != ${blob}`);
  }
  const runner=fs.readFileSync(path.join(ROOT,"tools/experiments/run-silgm-stage0-technical.js"),"utf8");
  const prod=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/silgm-production.js"),"utf8");
  const indep=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/silgm-independent.js"),"utf8");
  need(!runner.includes("31710001")&&!runner.includes("31720001"),"fresh scientific seed literal present in Stage0 runner");
  need(!prod.includes("31710001")&&!prod.includes("31720001")&&!indep.includes("31710001")&&!indep.includes("31720001"),"fresh scientific seed literal present in Stage0 libs");
  need(!indep.includes("silgm-production.js")&&!indep.includes("search-reliability-decision-robustness.js"),"independent implementation aliases production search");
  console.log(JSON.stringify({authorizationVerified:true,studyId:a.studyId,stageId:a.stageId,head,parent,authorizationNonce:a.authorizationNonce,freshScientificSeedAccessAuthorized:false,protectedDepth10AccessAuthorized:false}));
}
main();
