#!/usr/bin/env node
'use strict';
const path=require('node:path');
const C=require('./core.cjs');
const repo=path.resolve(__dirname,'../..');
function rng(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function findState(engine,{wantForced=false}={}){
 const random=rng(wantForced?2026092201:2026092202);
 for(let game=0;game<80;game++){
  let state=engine.E.initialState();
  for(let ply=0;ply<120&&state.winner===null;ply++){
   const legal=engine.E.moveVariantsForSearch(state);
   if((wantForced&&legal.length===1)||(!wantForced&&legal.length>=2&&legal.length<=255))return C.clone(state);
   if(!legal.length)break;
   const move=legal[Math.floor(random()*legal.length)];
   state=C.clone(engine.E.applyMoveForSearch(state,move).state);
  }
 }
 throw new Error(wantForced?'FORCED_FIXTURE_NOT_FOUND':'MULTI_FIXTURE_NOT_FOUND');
}
function expectFail(fn,code){let seen='';try{fn();}catch(e){seen=e.message;}C.assert(seen===code,'EXPECTED_'+code+'_GOT_'+seen);}
function mockResponse(packet){
 const ids=packet.candidateIds,choice=ids[0],probabilities={};
 for(const id of ids)probabilities[id]=id===choice?1:0;
 return{model:C.protocol.jev.model,answers:{move:{type:'choice',choice,confidence:1,probabilities}},usage:{input_tokens:1234,output_tokens:20}};
}
function main(){
 const engine=C.makeEngine(repo),multi=findState(engine),forced=findState(engine,{wantForced:true});
 const packet=C.requestFor(engine,multi),mock=mockResponse(packet),checked=C.validateResponse(mock,packet),direct=C.directDecision(engine,multi,checked);
 const authoritative=engine.E.applyMoveForSearch(multi,checked.move).state;
 C.assert(direct.afterHash===C.sha256(authoritative),'AFTER_STATE_MISMATCH');
 const forcedResult=C.forcedDecision(engine,forced);C.assert(engine.E.moveVariantsForSearch(forced).length===1,'FORCED_COUNT_MISMATCH');
 const baseline=engine.baseline(multi);C.assert(baseline.stats.evaluationCandidate==='PBAI-C015-v1','BASELINE_EVALUATOR_MISMATCH');
 const badChoice=JSON.parse(JSON.stringify(mock));badChoice.answers.move.choice='not-supplied';expectFail(()=>C.validateResponse(badChoice,packet),'RESPONSE_INVALID');
 const badModel=JSON.parse(JSON.stringify(mock));badModel.model='jev-wrong';expectFail(()=>C.validateResponse(badModel,packet),'MODEL_MISMATCH');
 const badKeys=JSON.parse(JSON.stringify(mock));delete badKeys.answers.move.probabilities[packet.candidateIds.at(-1)];expectFail(()=>C.validateResponse(badKeys,packet),'RESPONSE_INVALID');
 const badNan=JSON.parse(JSON.stringify(mock));badNan.answers.move.probabilities[packet.candidateIds[0]]=null;expectFail(()=>C.validateResponse(badNan,packet),'RESPONSE_INVALID');
 const badSum=JSON.parse(JSON.stringify(mock));for(const id of packet.candidateIds)badSum.answers.move.probabilities[id]=0;expectFail(()=>C.validateResponse(badSum,packet),'RESPONSE_INVALID');
 const result={status:'PASS',studyId:C.protocol.id,paidApiRequests:0,networkRequests:0,
  multiFixture:{phase:multi.phase,legalCandidates:packet.candidateIds.length,stateHash:packet.stateHash,candidateSetHash:packet.candidateSetHash},
  forcedFixture:{phase:forced.phase,legalCandidates:1,selectedMoveKey:forcedResult.moveKey},
  directChoice:{candidateId:checked.candidateId,moveKey:checked.moveKey,afterHash:direct.afterHash},
  baseline:{release:engine.C.RELEASE_ID,evaluator:baseline.stats.evaluationCandidate,completedDepth:baseline.stats.completedDepth},
  negativeChecks:['unknown-choice','model-mismatch','candidate-key-mismatch','non-finite-probability','probability-sum']};
 console.log(JSON.stringify(result,null,2));
}
main();
