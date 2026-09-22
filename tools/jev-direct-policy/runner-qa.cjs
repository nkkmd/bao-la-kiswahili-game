#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const C=require('./core.cjs');
const B=require('./live-ledger.cjs');
const R=require('./live-client.cjs');
const T=require('./stats.cjs');
const Run=require('./run.cjs');
const repo=path.resolve(__dirname,'../..');
function rng(seed){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function findState(engine){const random=rng(2026092211);for(let game=0;game<40;game++){let state=engine.E.initialState();for(let ply=0;ply<100&&state.winner===null;ply++){
 const legal=engine.E.moveVariantsForSearch(state);if(legal.length>=2&&legal.length<=255)return C.clone(state);if(!legal.length)break;state=C.clone(engine.E.applyMoveForSearch(state,legal[Math.floor(random()*legal.length)]).state);}}
 throw new Error('QA_FIXTURE_NOT_FOUND');}
function responseFor(packet,tokens=1000){const ids=packet.candidateIds,choice=ids[0],probabilities=Object.fromEntries(ids.map(id=>[id,id===choice?1:0]));
 return{model:C.protocol.jev.model,answers:{move:{type:'choice',choice,confidence:1,probabilities}},usage:{input_tokens:tokens,output_tokens:10}};}
function okResponse(data){return{ok:true,status:200,headers:{get:()=>null},json:async()=>data};}
function failResponse(status,retryAfter=null){return{ok:false,status,headers:{get:name=>name.toLowerCase()==='retry-after'?retryAfter:null},body:{cancel:async()=>{}}};}
async function main(){
 C.assert(C.protocol.paidExecutionGate==='CLOSED','PAID_GATE_NOT_CLOSED');const O=Run.verifyOpenings();Run.checkEnvironment();
 const engine=C.makeEngine(repo),state=findState(engine),packet=C.requestFor(engine,state),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'jev-direct-runner-qa-'));
 try{
  const root=path.join(tmp,'success'),ledger=new B.Ledger(path.join(tmp,'ledger-success'),'qa-spec-success');let calls=0;
  const client=R.createClient(ledger,root,'qa-not-real',{transport:async()=>{calls++;return okResponse(responseFor(packet,1234));},now:()=>1000000});
  const result=await client.evaluate(packet,{logicalId:'qa-success',stage:'pilot',allowRetry:false});C.assert(result.status==='ok'&&calls===1,'QA_SUCCESS_CLIENT_FAILED');
  const d=C.directDecision(engine,state,result);C.assert(d.moveKey===result.moveKey,'QA_DIRECT_DECISION_FAILED');
  const summary=ledger.summary();C.assert(summary.requests===1&&summary.reportedUsageUSD===Number((1234*B.RATE_NANO/1e9).toFixed(9)),'QA_LEDGER_SETTLEMENT_FAILED');

  let now=2000000,retryCalls=0;const retryRoot=path.join(tmp,'retry'),retryLedger=new B.Ledger(path.join(tmp,'ledger-retry'),'qa-spec-retry');
  const retryClient=R.createClient(retryLedger,retryRoot,'qa-not-real',{now:()=>now,transport:async()=>{retryCalls++;return retryCalls===1?failResponse(500):okResponse(responseFor(packet,800));}});
  let pause=null;try{await retryClient.evaluate(packet,{logicalId:'qa-retry',stage:'pilot',allowRetry:false});}catch(e){pause=e;}
  C.assert(pause?.message==='API-PAUSED'&&retryCalls===1,'QA_MANUAL_RETRY_GATE_FAILED');now=pause.details.retryNotBefore+1;
  const recovered=await retryClient.evaluate(packet,{logicalId:'qa-retry',stage:'pilot',allowRetry:true});
  C.assert(recovered.status==='ok'&&recovered.attemptId.endsWith('-attempt-2')&&retryCalls===2,'QA_SECOND_ATTEMPT_FAILED');
  C.assert(retryLedger.records.size===2,'QA_RETRY_LEDGER_FAILED');

  C.assert(T.exactTwoSided(0,0)===1&&Math.abs(T.exactTwoSided(4,4)-0.125)<1e-12,'QA_STATS_FAILED');
  const pairSummary=T.summarize([
   {stage:'formal',status:'TERMINAL',openingId:'a',winner:0,jevPlayer:0},{stage:'formal',status:'TERMINAL',openingId:'a',winner:1,jevPlayer:1},
   {stage:'formal',status:'TERMINAL',openingId:'b',winner:0,jevPlayer:0},{stage:'formal',status:'TERMINAL',openingId:'b',winner:0,jevPlayer:1}
  ],'formal');
  C.assert(pairSummary.jev2_0Pairs===1&&pairSummary.split1_1Pairs===1,'QA_PAIR_SUMMARY_FAILED');
  console.log(JSON.stringify({status:'PASS',studyId:C.protocol.id,paidApiRequests:0,networkRequests:0,openingsHash:O.openingsHash,
   successClient:{calls,budget:summary},manualRetry:{calls:retryCalls,attempt:recovered.attemptId,budget:retryLedger.summary()},statistics:{exact4of4:T.exactTwoSided(4,4),pairSummary}},null,2));
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
}
main().catch(e=>{console.error(JSON.stringify({status:'FAIL',code:e.message,details:e.details||null},null,2));process.exitCode=1;});
