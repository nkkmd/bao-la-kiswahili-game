"use strict";

const fs = require("node:fs");
const cp = require("node:child_process");

const AUTH_PATH = "doc/local-game-tree-geometry-generalization-counterexample/authorizations/STAGE_0_TECHNICAL_V3_AUTHORIZATION.json";
const EXEC_PATH = "doc/local-game-tree-geometry-generalization-counterexample/authorizations/STAGE_0_TECHNICAL_V3_EXECUTE.json";

function need(x,m){if(!x)throw new Error(m);}
function read(p){return JSON.parse(fs.readFileSync(p,"utf8"));}
function blob(p){return cp.execFileSync("git",["hash-object",p],{encoding:"utf8"}).trim();}
function ancestor(a,b){try{cp.execFileSync("git",["merge-base","--is-ancestor",a,b],{stdio:"ignore"});return true;}catch(_){return false;}}

const auth=read(AUTH_PATH),exec=read(EXEC_PATH),head=cp.execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim();
need(auth.studyId==="LGTGGC-STUDY1","study mismatch");
need(auth.stageId==="LGTGGC-S0-TECHNICAL-2026-09-04-v3","stage mismatch");
need(auth.executionAuthorized===true,"technical execution not authorized");
need(auth.scientificInferenceAuthorized===false,"scientific inference must be false");
need(auth.freshScientificSeedAccessAuthorized===false,"fresh scientific seed access must be false");
need(auth.protectedDepth10AccessAuthorized===false,"depth10 access must be false");
need(auth.depth11AccessAuthorized===false,"depth11 access must be false");
need(auth.g2_12EstimatorScientificInputAuthorized===false,"estimator input must be false");
need(auth.technicalSeedStart===32309001&&auth.technicalSeedEnd===32309064,"technical seed range mismatch");
need(auth.v2TechnicalSeedReadCount===0,"V2 seed-read count must remain zero");
need(ancestor(auth.authorizedSourceHead,head),"authorized source head not ancestor of execution head");
for(const [p,expected] of Object.entries(auth.sourceBindings||{})){need(fs.existsSync(p),`bound source missing ${p}`);need(blob(p)===expected,`git blob mismatch ${p}`);}
need(exec.studyId===auth.studyId&&exec.stageId===auth.stageId,"execute token identity mismatch");
need(exec.executionAuthorized===true&&exec.maximumExecutions===1,"execute token invalid");
need(exec.authorizationGitBlobSha===blob(AUTH_PATH),"authorization git blob mismatch");
need(exec.freshScientificSeedAccessAuthorized===false,"execute token fresh access invalid");
need(exec.protectedDepth10AccessAuthorized===false&&exec.depth11AccessAuthorized===false,"execute token depth firewall invalid");
console.log(JSON.stringify({passed:true,studyId:auth.studyId,stageId:auth.stageId,head,authorizedSourceHead:auth.authorizedSourceHead,boundSourceCount:Object.keys(auth.sourceBindings||{}).length,technicalSeedStart:auth.technicalSeedStart,technicalSeedEnd:auth.technicalSeedEnd,v2TechnicalSeedReadCount:auth.v2TechnicalSeedReadCount,scientificSeedAccessAuthorized:false,protectedDepth10AccessAuthorized:false,depth11AccessAuthorized:false,g2_12EstimatorScientificInputAuthorized:false}));
