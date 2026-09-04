"use strict";

const fs=require("node:fs"),path=require("node:path");
const E=require("../../public/engine.js");
const P=require("./lib/lgtggc-stage1-production.js");
const I=require("./lib/lgtggc-stage1-independent.js");
const CRP=require("./lib/crclgr-production.js");
const CRI=require("./lib/crclgr-independent.js");
const GP=require("./lib/gcld-production.js");
const GI=require("./lib/gcld-independent.js");
const OUT=process.argv[2]||"artifacts/local/lgtggc-stage1/gcld.json";
const START=32313001,END=32313384,CANDIDATE_TARGET=24,MEASURED_TARGET=16;
const LIMITS={distinctRawStates:100000,uniqueTransitions:750000,parentExpansions:100000,legalMoveEvaluations:750000,treeNodeOccurrences:1000000000};
const ENDPOINTS=["C1-DIRECTIONALITY-PATH-EFFICIENCY","C2-PERSISTENCE-LAG-DISTANCE-GRADIENT","C3-RETURN-FRACTION","C5-FIRST-ORDER-DIRECTIONAL-PATH-DEPENDENCE"];
function stable(x){return P.stable(x);}function need(x,m){if(!x)throw new Error(m);}function eq(a,b,m){need(stable(a)===stable(b),m);}function write(r){fs.mkdirSync(path.dirname(OUT),{recursive:true});fs.writeFileSync(OUT,JSON.stringify(r,null,2)+"\n","utf8");console.log("LGTGGC_STAGE1_GCLD="+JSON.stringify(r));}
function candidateCore(c,lib){if(!c.eligible)return{seed:c.seed,policyId:c.policyId,eligible:false,reason:c.reason,trajectorySha256:c.trajectorySha256,openingPrefixSha256:c.openingPrefixSha256};return{eligible:true,...lib.identityGcld(c)};}
try{
  const pc=[],ic=[];for(let seed=START;seed<=END;seed++){pc.push(P.gcldCandidate(E,seed));ic.push(I.gcldCandidate(E,seed));}
  eq(pc.map(c=>candidateCore(c,P)),ic.map(c=>candidateCore(c,I)),"GCLD source/candidate reconstruction mismatch");
  const ps=P.selectGcldCandidates(pc,CANDIDATE_TARGET),is=I.selectGcldCandidates(ic,CANDIDATE_TARGET);
  eq({support:ps.support,ids:ps.selected.map(P.identityGcld),selectionCoreSha256:ps.selectionCoreSha256},{support:is.support,ids:is.selected.map(I.identityGcld),selectionCoreSha256:is.selectionCoreSha256},"GCLD candidate selection mismatch");
  const candidateIdentityManifest=ps.selected.map(P.identityGcld);let disposition="STAGE1-PASS";
  if(!ps.complete)disposition="STAGE1-NON-ESTIMABLE";
  const imap=new Map(is.selected.map(c=>[c.seed,c])),preflightRows=[];
  if(ps.complete){
    for(const c of ps.selected){const d=imap.get(c.seed);need(d,"independent GCLD candidate missing");let eligible=true;const checkpoint=[];for(let k=0;k<c.checkpoints.length;k++){const pp=CRP.boundedPreflight(E,c.checkpoints[k],LIMITS),ip=CRI.boundedPreflight(E,d.checkpoints[k],LIMITS);eq(pp,ip,`GCLD preflight mismatch seed ${c.seed} checkpoint ${k}`);checkpoint.push({ply:c.checkpoints[k].selectedPly,eligible:pp.eligible,reasonCode:pp.reasonCode,counters:pp.counters});if(!pp.eligible)eligible=false;}preflightRows.push({seed:c.seed,policyId:c.policyId,eligible,checkpoint});}
  }
  const measured=[];if(ps.complete){for(const policyId of[P.P1,P.P2]){const ordered=ps.selected.filter(c=>c.policyId===policyId);for(const c of ordered){const pf=preflightRows.find(r=>r.seed===c.seed);if(!pf||!pf.eligible)continue;measured.push(c);if(measured.filter(x=>x.policyId===policyId).length===MEASURED_TARGET)break;}if(measured.filter(x=>x.policyId===policyId).length<MEASURED_TARGET)disposition="STAGE1-NON-ESTIMABLE";}}
  let definedEndpoints=0,measurementRows=[];
  if(disposition==="STAGE1-PASS"){
    for(const c of measured){const d=imap.get(c.seed),prows=[],irows=[];for(let k=0;k<c.checkpoints.length;k++){const pm=CRP.measureRoot(E,c.checkpoints[k]),im=CRI.measureRoot(E,d.checkpoints[k]);eq(pm.representation,im.representation,`GCLD representation mismatch seed ${c.seed} checkpoint ${k}`);prows.push({ply:c.checkpoints[k].selectedPly,coordinates:pm.representation.coordinates});irows.push({ply:d.checkpoints[k].selectedPly,coordinates:im.representation.coordinates});}const psum=GP.longitudinalSummary(prows,P.STAGE_ID,c.seed,32),isum=GI.longitudinalSummary(irows,I.STAGE_ID,d.seed,32);eq(psum,isum,`GCLD longitudinal mismatch seed ${c.seed}`);for(const id of ENDPOINTS)if(psum.actual[id]&&psum.actual[id].defined)definedEndpoints++;measurementRows.push({seed:c.seed,trajectorySha256:c.trajectorySha256,checkpointRawSha256:c.checkpoints.map(x=>x.rootRawSha256),summary:psum});}
    if(definedEndpoints!==measured.length*ENDPOINTS.length)disposition="STAGE1-NON-ESTIMABLE";
  }
  const eligibleByPolicy={};for(const p of[P.P1,P.P2])eligibleByPolicy[p]=preflightRows.filter(x=>x.policyId===p&&x.eligible).length;
  const measuredByPolicy={};for(const p of[P.P1,P.P2])measuredByPolicy[p]=measured.filter(x=>x.policyId===p).length;
  const identityManifest=measured.map(P.identityGcld);
  const result={schemaVersion:1,studyId:"LGTGGC-STUDY1",stageId:P.STAGE_ID,module:"GCLD-TRANSFER",evidenceClass:"FRESH-DEVELOPMENT",seedStart:START,seedEnd:END,scientificSeedsRead:END-START+1,formalInferencePerformed:false,pValuesComputed:false,contrastSignsSummarized:false,candidateSupport:ps.support,candidateSelected:ps.selected.length,preflightEligibleByPolicy:eligibleByPolicy,measuredByPolicy,measuredTrajectories:measured.length,definedEndpoints,expectedDefinedEndpoints:measured.length*ENDPOINTS.length,selectionCoreSha256:ps.selectionCoreSha256,preflightCoreSha256:P.digest(preflightRows),measurementCoreSha256:P.digest(measurementRows),candidateIdentityManifest,identityManifest,productionIndependentExact:true,stageDisposition:disposition,stage2SeedAccess:false,protectedDepth10Access:false,depth11Access:false,g2_12EstimatorScientificInput:false};write(result);
}catch(error){write({schemaVersion:1,studyId:"LGTGGC-STUDY1",stageId:P.STAGE_ID,module:"GCLD-TRANSFER",evidenceClass:"FRESH-DEVELOPMENT",seedStart:START,seedEnd:END,formalInferencePerformed:false,pValuesComputed:false,stageDisposition:"STAGE1-TECHNICAL-INVALID",stage2SeedAccess:false,protectedDepth10Access:false,depth11Access:false,g2_12EstimatorScientificInput:false,fatalError:String(error&&error.stack||error)});process.exitCode=2;}
