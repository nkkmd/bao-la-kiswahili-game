"use strict";

const fs=require("node:fs"),cp=require("node:child_process");
const AUTH="doc/local-game-tree-geometry-generalization-counterexample/authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json";
const EXEC="doc/local-game-tree-geometry-generalization-counterexample/authorizations/STAGE_1_DEVELOPMENT_EXECUTE.json";
function need(x,m){if(!x)throw new Error(m);}function read(p){return JSON.parse(fs.readFileSync(p,"utf8"));}function blob(p){return cp.execFileSync("git",["hash-object",p],{encoding:"utf8"}).trim();}function ancestor(a,b){try{cp.execFileSync("git",["merge-base","--is-ancestor",a,b],{stdio:"ignore"});return true;}catch(_){return false;}}
const a=read(AUTH),e=read(EXEC),head=cp.execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim();
need(a.studyId==="LGTGGC-STUDY1"&&a.stageId==="LGTGGC-S1-DEVELOPMENT-2026-09-04-v1","identity mismatch");
need(a.executionAuthorized===true&&a.maximumScientificExecutions===1,"execution authorization invalid");
need(a.formalInferenceAuthorized===false&&a.pValuesAuthorized===false&&a.effectBasedPromotionAuthorized===false,"development inference firewall invalid");
need(a.stage2SeedAccessAuthorized===false&&a.protectedDepth10AccessAuthorized===false&&a.depth11AccessAuthorized===false&&a.g2_12EstimatorScientificInputAuthorized===false,"protected evidence firewall invalid");
need(a.seedBlocks&&a.seedBlocks.SFCDF.seedStart===32311001&&a.seedBlocks.SFCDF.seedEnd===32311384,"SFCDF seed block mismatch");
need(a.seedBlocks.SILGM.seedStart===32312001&&a.seedBlocks.SILGM.seedEnd===32312768,"SILGM seed block mismatch");
need(a.seedBlocks.GCLD.seedStart===32313001&&a.seedBlocks.GCLD.seedEnd===32313384,"GCLD seed block mismatch");
need(ancestor(a.authorizedSourceHead,head),"authorized source head not ancestor");
for(const [p,h] of Object.entries(a.sourceBindings||{})){need(fs.existsSync(p),`missing bound source ${p}`);need(blob(p)===h,`source binding mismatch ${p}`);}
need(e.studyId===a.studyId&&e.stageId===a.stageId&&e.executionAuthorized===true&&e.maximumScientificExecutions===1,"execute token invalid");
need(e.authorizationGitBlobSha===blob(AUTH),"authorization blob mismatch");
need(e.stage2SeedAccessAuthorized===false&&e.protectedDepth10AccessAuthorized===false&&e.depth11AccessAuthorized===false&&e.g2_12EstimatorScientificInputAuthorized===false,"execute protected evidence firewall invalid");
console.log(JSON.stringify({passed:true,studyId:a.studyId,stageId:a.stageId,head,authorizedSourceHead:a.authorizedSourceHead,boundSourceCount:Object.keys(a.sourceBindings||{}).length,formalInferenceAuthorized:false,pValuesAuthorized:false,stage2SeedAccessAuthorized:false,protectedDepth10AccessAuthorized:false,depth11AccessAuthorized:false,g2_12EstimatorScientificInputAuthorized:false}));
