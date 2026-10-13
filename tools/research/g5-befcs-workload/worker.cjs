"use strict";
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const Storage=require('../g5-branch-envelope/storage.cjs'),F=require('../g5-branch-envelope/fixtures.cjs'),I=require('../g5-branch-envelope/independent-source.cjs'),C=require('../g5-branch-envelope/closure.cjs'),{Stop}=require('../g5-branch-envelope/source.cjs'),BF=require('../g5-compact-bfs/fixtures.cjs'),{budget}=require('../g5-branch-envelope/budget.cjs'),{sharedStore}=require('./shared-store.cjs');
const root=path.resolve(__dirname,'../../..');
function atomic(file,value){const fd=fs.openSync(file+'.tmp','wx');try{fs.writeFileSync(fd,JSON.stringify(value)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}fs.renameSync(file+'.tmp',file);const dir=fs.openSync(path.dirname(file),'r');try{fs.fsyncSync(dir);}finally{fs.closeSync(dir);}}
function run(config){
 assert.equal(config.evidenceClass,'TECHNICAL-SAVED-WORKLOAD');assert.equal(config.scientificSeedsRead,0);assert.equal(config.count,128);if(config.mode==='kill-after-prefix')process.on('SIGTERM',()=>{});
 const began=performance.now(),whole=budget(config.limits),store=sharedStore(config.output,config.limits),summary=store.create('summary'),prior=F.priorFirewall();let read=0,closures=0,status='WORKLOAD-COMPLETE',interpretationComplete=false;
 const check=()=>whole.check();
 try{
 for(let n=0;n<128;n++){
 check();store.capacity(1024);if(config.mode==='insufficient-source-budget')store.capacity(config.limits.maxEvidenceBytes);
 atomic(path.join(config.control,'REQUEST.json'),{index:n,binding:config.binding});
 const ack=path.join(config.control,'ACK-'+n+'.json');while(!fs.existsSync(ack)){check();Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,10);}
 const receipt=JSON.parse(fs.readFileSync(ack));assert.equal(receipt.index,n);assert.equal(receipt.logicalId,n+1);assert.equal(receipt.binding,config.binding);assert.match(receipt.remoteCommit,/^[a-f0-9]{40}$/);
 // 保存済み技術byteだけを読む。新規source/科学seed生成器は呼ばない。
 const saved=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(root,'doc/research-generation-5/branch-envelope-preflight-20261013/results/TECHNICAL_EVIDENCE.json.gz'))));const row=saved.sources[n%saved.sources.length];read++;
 const opts={};if(row.id==='AGGREGATE-17')opts.replyWidths=[8,8,1];if(row.id==='AGGREGATE-16')opts.replyWidths=[8,8];if(row.id==='REPLY-UNKNOWN')opts.unknownReply=true;if(row.id==='LATER-UNKNOWN')opts.laterUnknown=true;if(row.id==='PLY-512')opts.long=true;
 const q=F.sourceFixture(row.id,opts,true);const output=store.create('source-'+String(n).padStart(3,'0'));
 try{output.append('source.jsonl',{kind:'durable-read-receipt',...receipt});I.replay(row.source,row.spec,q.initial,q.api,new Set(row.excluded),{fixtureId:row.id,allowedSeeds:[row.source.seed]});check();row.readIdentities.forEach(id=>assert.ok(prior.has(id),'NOVEL-RAW-REFUSED'));output.snapshot('SOURCE_CHECKPOINT.json',{source:row.source,verification:'SAVED-FIXTURE-REPLAY',resumeAuthorized:false});summary.append('progress.jsonl',{kind:'source-verified',index:n,fixtureId:row.id,scientificSeedsRead:0});}
 finally{output.close();}
 if(config.mode==='kill-after-prefix'&&n===0){while(true)Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,20);}
 }
 for(let n=0;n<8;n++){
 check();if(config.limits.maxTotalMs-(performance.now()-began)<(config.mode==='insufficient-domain-time'?config.limits.maxTotalMs:config.closureLimits.maxDomainMs))throw new Stop('INSUFFICIENT-DOMAIN-TIME-BUDGET');if(config.mode==='insufficient-domain-budget')store.capacity(config.limits.maxEvidenceBytes);
 const output=store.create('domain-'+n),p=BF.fixture('ABSTRACT-DIAMOND'),q=BF.fixture('ABSTRACT-DIAMOND',true),started=whole.clock();
 try{const result=C.runFixture(p,q,config.closureLimits,output,new Set(),()=>{if(config.mode==='domain-time'&&performance.now()-started>=1)throw new Stop('TIME-LIMIT');whole.check(started);});check();if(!result.interpretationComplete){summary.append('progress.jsonl',{kind:'closure-stopped',index:n,status:result.stageStatus,solution:null},true);throw new Stop('DOMAIN-'+result.stageStatus);}result.observedReadIdentities.forEach(id=>assert.ok(prior.has(id)));summary.append('progress.jsonl',{kind:'closure-verified',index:n,states:result.domain.states.length,edges:result.domain.edges.length});closures++;}
 finally{output.close();}
 }
 check();interpretationComplete=true;
 }catch(e){status=e.code??'WORKLOAD-ERROR';if(!e.code)throw e;}
 finally{const priorBytes=store.usedBytes,result={evidenceClass:'TECHNICAL-SAVED-WORKLOAD',status,read,closures,interpretationComplete,scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,solution:null,usedBytes:priorBytes,peakBytes:store.peakBytes,peakWorkerRssBytes:process.resourceUsage().maxRSS*1024,resumeAuthorized:false};for(let n=0;n<8;n++){const total=priorBytes+Buffer.byteLength(JSON.stringify(result)+'\n');if(result.usedBytes===total)break;result.usedBytes=total;result.peakBytes=Math.max(store.peakBytes,total);}summary.snapshot('RESULT.json',result,true);assert.equal(store.usedBytes,result.usedBytes);summary.close();}
}
if(require.main===module){assert.equal(process.argv.length,3);run(JSON.parse(fs.readFileSync(process.argv[2])));}
module.exports={run,atomic};
