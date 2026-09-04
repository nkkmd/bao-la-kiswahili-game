"use strict";

const fs=require("node:fs"),path=require("node:path");
const E=require("../../public/engine.js");
const P=require("./lib/lgtggc-stage1-production.js");
const I=require("./lib/lgtggc-stage1-independent.js");
const SP=require("./lib/silgm-production.js");
const SI=require("./lib/silgm-independent.js");
const OUT=process.argv[2]||"artifacts/local/lgtggc-stage1/silgm.json";
const START=32312001,END=32312768,TARGET=8;
const CONDITIONS={
  SC1:[{kind:"exact-depth",depth:2,quiescenceDepth:1},{kind:"exact-depth",depth:3,quiescenceDepth:1}],
  SC2:[{kind:"node-budget",maxDepth:3,nodeBudget:256,quiescenceDepth:1},{kind:"node-budget",maxDepth:3,nodeBudget:1024,quiescenceDepth:1}],
  SC3:[{kind:"exact-depth",depth:2,quiescenceDepth:0},{kind:"exact-depth",depth:2,quiescenceDepth:2}]
};
function stable(x){return P.stable(x);}function need(x,m){if(!x)throw new Error(m);}function eq(a,b,m){need(stable(a)===stable(b),m);}
function candidateCore(c,lib){if(!c.eligible)return{seed:c.seed,policyId:c.policyId,familyId:c.familyId,phase:c.phase,eligible:false,reason:c.reason,trajectorySha256:c.trajectorySha256,openingPrefixSha256:c.openingPrefixSha256,rootLegalWidth:c.rootLegalWidth??null,rootRawSha256:c.rootRawSha256??null};return{eligible:true,...lib.identitySilgm(c)};}
function write(result){fs.mkdirSync(path.dirname(OUT),{recursive:true});fs.writeFileSync(OUT,JSON.stringify(result,null,2)+"\n","utf8");console.log("LGTGGC_STAGE1_SILGM="+JSON.stringify(result));}
function e3(lib,state,pair){const a=lib.conditionResult(state,pair[0]),b=lib.conditionResult(state,pair[1]);if(!a.estimable||!b.estimable)return{estimable:false,e3:null};return{estimable:true,e3:lib.endpoints(a,b)["SILGM-E3-RANKING-PREORDER-CHANGE"]};}
try{
  const pc=[],ic=[];for(let seed=START;seed<=END;seed++){pc.push(P.silgmCandidate(E,seed));ic.push(I.silgmCandidate(E,seed));}
  eq(pc.map(c=>candidateCore(c,P)),ic.map(c=>candidateCore(c,I)),"SILGM source/candidate reconstruction mismatch");
  const ps=P.selectSilgm(pc,TARGET),is=I.selectSilgm(ic,TARGET);
  eq({support:ps.support,ids:ps.selected.map(P.identitySilgm),selectionCoreSha256:ps.selectionCoreSha256},{support:is.support,ids:is.selected.map(I.identitySilgm),selectionCoreSha256:is.selectionCoreSha256},"SILGM selection mismatch");
  const identityManifest=ps.selected.map(P.identitySilgm);let disposition="STAGE1-PASS",estimableSlots=0,measurementRows=[];
  if(!ps.complete)disposition="STAGE1-NON-ESTIMABLE";
  else{
    const imap=new Map(is.selected.map(c=>[c.seed,c]));
    for(const c of ps.selected){const d=imap.get(c.seed);need(d,"independent selected root missing");for(const [contrast,pair] of Object.entries(CONDITIONS)){const pe=e3(SP,c.source.rootState,pair),ie=e3(SI,d.source.rootState,pair);eq(pe,ie,`SILGM ${contrast} mismatch seed ${c.seed}`);if(pe.estimable)estimableSlots++;measurementRows.push({seed:c.seed,rootRawSha256:c.source.rootRawSha256,contrast,estimable:pe.estimable,e3:pe.e3});}}
    if(estimableSlots!==ps.selected.length*3)disposition="STAGE1-NON-ESTIMABLE";
  }
  const result={schemaVersion:1,studyId:"LGTGGC-STUDY1",stageId:P.STAGE_ID,module:"SILGM-TRANSFER",evidenceClass:"FRESH-DEVELOPMENT",seedStart:START,seedEnd:END,scientificSeedsRead:END-START+1,formalInferencePerformed:false,pValuesComputed:false,riskDifferencesComputed:false,effectDirectionSummarized:false,support:ps.support,selectedRoots:ps.selected.length,estimableSearchSlots:estimableSlots,expectedSearchSlots:ps.selected.length*3,selectionCoreSha256:ps.selectionCoreSha256,measurementCoreSha256:P.digest(measurementRows),identityManifest,productionIndependentExact:true,stageDisposition:disposition,stage2SeedAccess:false,protectedDepth10Access:false,depth11Access:false,g2_12EstimatorScientificInput:false};write(result);
}catch(error){write({schemaVersion:1,studyId:"LGTGGC-STUDY1",stageId:P.STAGE_ID,module:"SILGM-TRANSFER",evidenceClass:"FRESH-DEVELOPMENT",seedStart:START,seedEnd:END,formalInferencePerformed:false,pValuesComputed:false,stageDisposition:"STAGE1-TECHNICAL-INVALID",stage2SeedAccess:false,protectedDepth10Access:false,depth11Access:false,g2_12EstimatorScientificInput:false,fatalError:String(error&&error.stack||error)});process.exitCode=2;}
