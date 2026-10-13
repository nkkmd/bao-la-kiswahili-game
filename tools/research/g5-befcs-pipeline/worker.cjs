"use strict";
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const D=require('./drivers.cjs'),M=require('../g5-01/measurement.cjs'),Codec=require('../g5-method/raw-codec.cjs'),IndependentCodec=require('../g5-method/independent-raw-codec.cjs');
const {sharedStore}=require('../g5-befcs-workload/shared-store.cjs'),{budget}=require('../g5-branch-envelope/budget.cjs'),{Stop}=require('../g5-branch-envelope/source.cjs'),{atomic}=require('../g5-befcs-workload/worker.cjs');
function run(config){
 // 科学gateの拒否は出力作成・状態初期化・PRNGより先。
 const driver=config.evidenceClass==='BEFCS-SCIENTIFIC-PIPELINE'?D.scienceDriver(config):D.fixtureDriver(config);
 assert.ok(Number.isInteger(config.count)&&config.count>=1&&config.count<=128);if(driver.scientific)assert.equal(config.count,128);assert.equal(fs.readdirSync(config.control).length,0,'EXISTING-CONTROL-REFUSED');
 const whole=budget({...config.limits,maxDomainMs:config.closureLimits.maxDomainMs}),began=whole.clock(),store=sharedStore(config.output,config.limits),summary=store.create('summary');
 let read=0,closures=0,status='PIPELINE-COMPLETE',workerComplete=false;const sources=[];let frozen=null,failure=null;
 const check=()=>whole.check();
 try{
  for(let n=0;n<config.count;n++){
   check();store.capacity(1024);if(config.mode==='source-budget')store.capacity(config.limits.maxEvidenceBytes);
   atomic(path.join(config.control,'REQUEST.json'),{index:n,binding:config.binding});
   const file=path.join(config.control,'ACK-'+n+'.json');while(!fs.existsSync(file)){check();Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,10);}
   const permit=JSON.parse(fs.readFileSync(file));assert.equal(permit.index,n);assert.equal(permit.binding,config.binding);assert.equal(permit.beforeRead,true);assert.equal(permit.runAttempt,1);assert.match(permit.remoteCommit,/^[a-f0-9]{40}$/);
   assert.equal(permit.logicalId,driver.scientific?50613001+n:n+1);check();
   const output=store.create('source-'+String(n).padStart(3,'0')),seen=new Set();
   const observe=(state,context)=>{const id=M.rawKey(state);if(!driver.scientific)assert.ok(driver.prior.has(id),'NOVEL-FIXTURE-RAW-REFUSED');if(seen.has(id))return;seen.add(id);const payload=Codec.encodeRaw(state);assert.equal(M.rawKey(IndependentCodec.decodeRaw(payload)),id);output.append('reads.jsonl',{id,payload:payload.toString('base64'),context,metadata:{reason:state.reason??'',turn:state.turn}});};
   try{output.append('receipt.jsonl',permit);read++;const source=driver.source(n,permit,output,check,observe);check();if(source.interruption)throw new Stop(source.stop);sources.push(source);summary.append('progress.jsonl',{kind:'source-verified',index:n,stop:source.stop,selectionStatus:source.selectionStatus});}
   finally{output.close();}
   if(config.mode==='kill-after-prefix'&&n===0){process.on('SIGTERM',()=>{});while(true)Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,20);}
  }
  check();frozen=driver.freeze(sources);summary.snapshot('FROZEN.json',frozen);check();
  for(let n=0;n<frozen.candidates.length;n++){
   check();if(config.limits.maxTotalMs-(whole.clock()-began)<config.closureLimits.maxDomainMs||config.mode==='domain-time-budget')throw new Stop('INSUFFICIENT-DOMAIN-TIME-BUDGET');
   if(config.mode==='domain-budget')store.capacity(config.limits.maxEvidenceBytes);
   const output=store.create('domain-'+n),started=whole.clock();
   try{const result=driver.closure(frozen.candidates[n],config.closureLimits,output,()=>{whole.check(started);if(config.mode==='domain-time'&&whole.clock()-started>=1)throw new Stop('TIME-LIMIT');});check();if(!driver.scientific)result.observedReadIdentities.forEach(id=>assert.ok(driver.prior.has(id),'NOVEL-FIXTURE-CLOSURE-RAW'));summary.append('progress.jsonl',{kind:'closure-result',index:n,status:result.stageStatus,domainComplete:result.domain.complete,interpretationComplete:result.interpretationComplete});if(!result.interpretationComplete)throw new Stop('DOMAIN-'+result.stageStatus);closures++;}
   finally{output.close();}
  }
  check();workerComplete=true;
 }catch(error){status=error instanceof Stop?error.code:'PIPELINE-ERROR';failure={message:error.message,code:error.code??null};if(!(error instanceof Stop))throw error;}
 finally{summary.snapshot('RESULT.json',{evidenceClass:config.evidenceClass,status,failure,read,closures,candidates:frozen?.candidates.length??null,workerComplete,interpretationComplete:false,finalMirrorRequired:true,solution:null,resumeAuthorized:false,scientificSeedsRead:driver.scientific?read:0,peakWorkerRssBytes:process.resourceUsage().maxRSS*1024,usedBytesBeforeFinal:store.usedBytes},true);summary.close();}
}
if(require.main===module){assert.equal(process.argv.length,3);run(JSON.parse(fs.readFileSync(process.argv[2])));}
module.exports={run};
