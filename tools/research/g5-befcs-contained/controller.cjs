"use strict";
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {validate,LIMITS}=require('./policy.cjs'),P=require('../g5-befcs-pipeline/run.cjs'),R=require('../g5-befcs-workload/registry.cjs');
const {session}=require('../g5-befcs-pipeline/session.cjs'),{atomic}=require('../g5-befcs-workload/worker.cjs');
const root='/work',config=JSON.parse(fs.readFileSync('/config.json'));validate(config);
const now=()=>Number(fs.readFileSync('/sys/fs/cgroup/memory.current','utf8')),events=()=>fs.readFileSync('/sys/fs/cgroup/memory.events','utf8');
function free(){const s=fs.statfsSync(root);return {blockBytes:s.bsize,blocks:s.blocks,availableBytes:s.bavail*s.bsize,freeBytes:s.bfree*s.bsize};}
function release(){fs.rmSync(root+'/FINAL_RESERVE',{force:true});}
async function run(){
 fs.mkdirSync(root+'/evidence');fs.mkdirSync(root+'/control');fs.mkdirSync(root+'/tmp');
 const registry=R.open(root+'/registry',root+'/remote.git'),binding=R.hash('BEFCS-CONTAINED-v1-'+config.mode),request={evidenceClass:'TECHNICAL-REGISTRY-FIXTURE',stageId:'CONTAINED-'+config.mode,runId:'contained-'+config.mode,runAttempt:1,binding,block:{start:1,count:128}};
 const worker=P.fixtureConfig(config.mode==='final-mirror-failure'?'final-mirror-failure':'complete',root+'/evidence',root+'/control');worker.binding=binding;worker.runId=request.runId;
 // workerの時計は、host起動までに使った残余時間を引く。外部watchdogは別に同じ終了時刻を守る。
 worker.limits.maxTotalMs=Math.max(1,config.deadlineEpochMs-config.reserveMs-Date.now());
 atomic(root+'/START.json',{evidenceClass:config.evidenceClass,limits:LIMITS,workerLimits:worker.limits,workerCgroup:fs.readFileSync('/proc/self/cgroup','utf8'),filesystem:free(),events:events(),scientificSeedsRead:0});
 const protocol=session(registry,request,registry.acquire),originalPermit=protocol.permit,originalMirror=registry.mirror;let injected=false,child=null,peak=now();
 const sampler=setInterval(()=>{peak=Math.max(peak,now());},20);
 registry.mirror=function(stage,run,sequence,files,...rest){if(files['PHASE.json']&&JSON.parse(files['PHASE.json']).final)release();return originalMirror(stage,run,sequence,files,...rest);};
 protocol.permit=function(message,files){
  if(Date.now()>=config.deadlineEpochMs-config.reserveMs)throw Error('CONTAINED-ORDINARY-DEADLINE');
  if(!injected&&message.index===1&&['host-oom','disk-full','detached'].includes(config.mode)){
   assert.ok(fs.existsSync(root+'/evidence/source-000/SOURCE_CHECKPOINT.json'),'PREFIX-NOT-DURABLE');injected=true;
   atomic(root+'/INJECTION.json',{mode:config.mode,index:1,filesystem:free(),events:events(),scientificSeedsRead:0});
   if(config.mode==='host-oom'){
    fs.writeFileSync('/proc/self/oom_score_adj','1000');const held=[];for(;;)held.push(Buffer.alloc(67108864,0x63));
   }
   if(config.mode==='disk-full'){
    const fd=fs.openSync(root+'/BALLAST','wx'),bytes=Buffer.alloc(1048576,0x62);let written=0,error=null;
    try{for(;;)written+=fs.writeSync(fd,bytes);}catch(e){assert.equal(e.code,'ENOSPC');error=e.code;}finally{try{fs.fsyncSync(fd);}catch(e){assert.equal(e.code,'ENOSPC');error=e.code;}finally{fs.closeSync(fd);}}
    // 実ENOSPC後にだけ終了予約を解放し、以後はconsumeを許可しない。
    release();atomic(root+'/ENOSPC.json',{written,error,filesystem:free(),scientificSeedsRead:0});throw Error('FIXTURE-PHYSICAL-ENOSPC');
   }
   child=cp.spawn(process.execPath,['-e','setInterval(()=>{},1000)'],{detached:true,stdio:'ignore'});child.unref();
   atomic(root+'/DETACHED.json',{pid:child.pid,cgroup:fs.readFileSync('/proc/'+child.pid+'/cgroup','utf8')});throw Error('FIXTURE-DETACHED-CHILD-STOP');
  }
  return originalPermit(message,files);
 };
 let result;
 try{result=await P.orchestrate(root,worker,registry,protocol,p=>p);}
 finally{clearInterval(sampler);if(child){try{process.kill(child.pid,'SIGKILL');}catch(e){if(e.code!=='ESRCH')throw e;}}}
 atomic(root+'/HOST_RESULT.json',{...result,primaryCgroupPeakBytes:Number(fs.readFileSync('/sys/fs/cgroup/memory.peak','utf8')),sampledCgroupPeakBytes:peak,events:events(),filesystem:free(),scientificSeedsRead:0});
}
run().catch(e=>{console.error(e);process.exitCode=1;});
