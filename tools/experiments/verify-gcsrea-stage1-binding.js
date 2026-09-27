#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const BASE = "doc/geometry-conditioned-search-reliability-exact-agreement";
const AUTH = `${BASE}/authorizations/STAGE_1_AUTHORIZATION.json`;
const TRIGGER = `${BASE}/authorizations/STAGE_1_ACTIONS_EXECUTION_TRIGGER.json`;
function need(x,m){if(!x)throw new Error(m);}
function json(rel){return JSON.parse(fs.readFileSync(path.join(ROOT,rel),"utf8"));}
function git(args){return cp.execFileSync("git",args,{cwd:ROOT,encoding:"utf8"}).trim();}
function main(){
  const a=json(AUTH),t=json(TRIGGER);
  need(process.env.GITHUB_ACTIONS==="true","GitHub Actions required");
  need(process.env.GITHUB_EVENT_NAME==="push","push event required");
  need(process.env.GITHUB_REF_NAME==="research/g4-09-search-reliability-exact-agreement","branch mismatch");
  need(Number(process.env.GITHUB_RUN_ATTEMPT)===1,"run attempt must be 1");
  need(a.studyId==="GCSREA-STUDY1"&&a.stageId==="GCSREA-S1-DEVELOPMENT-2026-09-27-v1","authorization identity mismatch");
  need(a.decision==="GCSREA-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE","effective authorization missing");
  need(a.authorizedScientificExecutions===1&&a.rerunAfterFreshAccessAuthorized===false,"one-shot boundary mismatch");
  need(a.seedBlock?.start===40913001&&a.seedBlock?.end===40913768&&a.seedBlock?.count===768,"authorized seed block mismatch");
  need(a.actualG405SearchVsExactMeasurementAuthorized===false,"G4-05 actual agreement measurement unexpectedly authorized");
  need(a.g410Depth11AccessAuthorized===false&&a.publicAiChangeAuthorized===false,"protected boundary mismatch");
  need(t.studyId===a.studyId&&t.stageId===a.stageId,"trigger identity mismatch");
  need(t.action==="EXECUTE-AUTHORIZED-STAGE1-ONCE","trigger action mismatch");
  need(t.effectiveAuthorization===a.decision,"trigger authorization mismatch");
  need(t.seedBlock?.start===40913001&&t.seedBlock?.end===40913768&&t.seedBlock?.count===768,"trigger seed block mismatch");
  need(t.acknowledgeNoRerun===true&&t.acknowledgeNoSeedExtension===true&&t.acknowledgeNoReplacement===true,"trigger acknowledgement mismatch");
  need(t.actualG405SearchVsExactMeasurement===false&&t.g410Depth11Access===false&&t.publicAiChange===false,"trigger protected boundary mismatch");
  const changed=git(["diff-tree","--no-commit-id","--name-only","-r",process.env.GITHUB_SHA]).split(/\r?\n/).filter(Boolean);
  need(changed.length===1&&changed[0]===TRIGGER,`trigger commit must change only ${TRIGGER}; got ${changed.join(",")}`);
  need(/^[0-9a-f]{40}$/.test(a.codeFreezeHead),"invalid codeFreezeHead");
  git(["merge-base","--is-ancestor",a.codeFreezeHead,"HEAD"]);
  for(const [name,row] of Object.entries(a.bindings||{})){
    const actual=git(["hash-object",row.path]);
    need(actual===row.blobSha,`source binding mismatch ${name}: ${actual} != ${row.blobSha}`);
  }
  for(const [name,row] of Object.entries(a.upstreamArtifacts||{})){
    need(Number.isInteger(row.artifactId)&&row.artifactId>0,`artifact id missing ${name}`);
    need(/^sha256:[0-9a-f]{64}$/.test(row.digest),`artifact digest missing ${name}`);
  }
  console.log(JSON.stringify({disposition:"STAGE1-BINDING-PASS",codeFreezeHead:a.codeFreezeHead,triggerCommit:process.env.GITHUB_SHA,boundFiles:Object.keys(a.bindings||{}).length,upstreamArtifacts:Object.keys(a.upstreamArtifacts||{}).length,freshScientificSeedReads:0,actualG405SearchVsExactMeasurements:0,g410Depth11Access:0},null,2));
}
main();
