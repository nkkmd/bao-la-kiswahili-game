"use strict";
const fs=require('node:fs'),assert=require('node:assert/strict');
const directory=process.argv[2],header=JSON.parse(fs.readFileSync(directory+'/HEADER.json')),Policy=require('./policy.cjs');Policy.validate(header.remoteConfig);
assert.equal(fs.readFileSync('/proc/self/cgroup','utf8').trim(),'0::'+header.root.slice('/sys/fs/cgroup'.length)+'/control');
require('./auth.cjs').configure();
const R=require('../g5-befcs-workload/registry.cjs'),P=require('../g5-befcs-pipeline/run.cjs'),{session}=require('../g5-befcs-pipeline/session.cjs'),{atomic}=require('../g5-befcs-workload/worker.cjs');
async function run(){
 const c=header.remoteConfig,url=Policy.remote(process.env),ref=Policy.ref(c),registry=R.open(directory+'/registry',url,ref),denied=require('./auth.cjs').proxy(directory+'/blocked',url,ref);
 assert.equal(registry.read().sha,null,'EXISTING-REMOTE-REF-NO-RETRY');
 const binding=R.hash('BEFCS-REMOTE-JOINED-v1-'+c.mode),request={evidenceClass:'TECHNICAL-REGISTRY-FIXTURE',stageId:'REMOTE-JOINED-'+c.mode+'-'+c.runId,runId:c.runId,runAttempt:1,binding,block:{start:1,count:128}};
 const cfg=P.fixtureConfig('complete',directory+'/evidence',directory+'/control');cfg.binding=binding;cfg.runId=c.runId;cfg.limits.maxTotalMs=Math.max(1,header.deadlineEpochMs-header.reserveMs-1000-Date.now());
 const g=require('./guard.cjs').guard(registry,{mode:c.mode,denied,check(phase){assert.ok(Date.now()<header.deadlineEpochMs-(phase==='ordinary'?header.reserveMs:0)-1000,'REMOTE-JOINED-TIME-BOUNDARY');},release(){fs.rmSync(directory+'/FINAL_RESERVE',{force:true});}});
 const protocol=session(g.transport,request,g.transport.acquire),permit=protocol.permit;let injected=false;
 protocol.permit=function(message,files){if(c.mode==='host-oom'&&!injected&&message.index===1){assert.ok(fs.existsSync(cfg.output+'/source-000/SOURCE_CHECKPOINT.json'));injected=true;atomic(directory+'/INJECTION.json',{index:1,marked:protocol.marked,scientificSeedsRead:0});fs.writeFileSync('/proc/self/oom_score_adj','1000');const blocks=[];for(;;)blocks.push(Buffer.alloc(16777216,0x61));}return permit(message,files);};
 const result=await P.orchestrate(directory,cfg,g.transport,protocol,p=>p);
 atomic(directory+'/HOST_RESULT.json',{...result,guard:{locked:g.locked,reason:g.reason,consumesAcknowledged:g.consumesAcknowledged,mirrorsSucceeded:g.mirrorsSucceeded},scientificSeedsRead:0});
}
run().catch(error=>{atomic(directory+'/HOST_ERROR.json',{message:require('../g5-befcs-git/fixture.cjs').clean(error.message),scientificSeedsRead:0});process.exitCode=1;});
