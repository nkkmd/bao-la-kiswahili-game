"use strict";
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {validate}=require('./policy.cjs');
const directory=process.argv[2],header=JSON.parse(fs.readFileSync(directory+'/HEADER.json'));validate(header.config);
assert.equal(fs.readFileSync('/proc/self/cgroup','utf8').trim(),'0::'+header.root.slice('/sys/fs/cgroup'.length)+'/control');
const P=require('../g5-befcs-pipeline/run.cjs'),R=require('../g5-befcs-workload/registry.cjs'),{session}=require('../g5-befcs-pipeline/session.cjs'),{atomic}=require('../g5-befcs-workload/worker.cjs');
async function run(){
 const mode=header.config.mode,registry=R.open(directory+'/registry',directory+'/remote.git'),binding=R.hash('BEFCS-JOINED-v1-'+mode),request={evidenceClass:'TECHNICAL-REGISTRY-FIXTURE',stageId:'JOINED-'+mode,runId:'joined-'+mode,runAttempt:1,binding,block:{start:1,count:128}};
 let reserve=true;function release(){if(reserve){fs.rmSync(directory+'/FINAL_RESERVE',{force:true});reserve=false;}}
 const mirror=registry.mirror.bind(registry);registry.mirror=(stage,run,sequence,files,...rest)=>{if(files['PHASE.json']&&JSON.parse(files['PHASE.json']).final)release();return mirror(stage,run,sequence,files,...rest);};
 const c=P.fixtureConfig(mode==='final-mirror-failure'?mode:'complete',directory+'/evidence',directory+'/control');c.binding=binding;c.runId=request.runId;c.limits.maxTotalMs=Math.max(1,header.deadlineEpochMs-header.reserveMs-header.config.stopLeadMs-Date.now());
 const protocol=session(registry,request,registry.acquire),permit=protocol.permit;let injected=false;
 protocol.permit=function(message,files){
  assert.ok(Date.now()<header.deadlineEpochMs-header.reserveMs-header.config.stopLeadMs,'JOINED-ORDINARY-CLOSED');
  if(mode==='host-oom'&&!injected&&message.index===1){assert.ok(fs.existsSync(c.output+'/source-000/SOURCE_CHECKPOINT.json'));injected=true;atomic(directory+'/INJECTION.json',{index:1,marked:protocol.marked,scientificSeedsRead:0});fs.writeFileSync('/proc/self/oom_score_adj','1000');const blocks=[];for(;;)blocks.push(Buffer.alloc(16777216,0x61));}
  return permit(message,files);
 };
 const result=await P.orchestrate(directory,c,registry,protocol,p=>p);
 atomic(directory+'/HOST_RESULT.json',{...result,scientificSeedsRead:0});
}
run().catch(e=>{atomic(directory+'/HOST_ERROR.json',{message:e.message,scientificSeedsRead:0});process.exitCode=1;});
