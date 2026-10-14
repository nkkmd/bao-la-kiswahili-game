"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),cp=require('node:child_process');
const {guard}=require('../tools/research/g5-befcs-remote-stop-v3/guard.cjs');
const {lifecycle}=require('../tools/research/g5-befcs-remote-stop-v3/lifecycle.cjs');
const final={'PHASE.json':'{"final":true}'};
test('未完成workerの最終mirrorは容量解放・実writeの前に拒否する',()=>{
 let writes=0,releases=0;const g=guard({mirror(){writes++;}},{allowFinal:()=>false,release(){releases++;}});
 assert.throws(()=>g.transport.mirror('s','1',0,final),/INCOMPLETE-WORKER/);
 assert.equal(writes,0);assert.equal(releases,0);assert.equal(g.locked,true);
 assert.throws(()=>g.transport.mirror('s','1',0,final),/LOCKED/);
});
test('session.stop後の旧回復mirrorと全後続writeを固定遮断する',()=>{
 let writes=0;const raw={acquire(){writes++;},consume(){writes++;},mirror(){writes++;},read(){return {sha:'saved'};}};
 const g=guard(raw,{allowFinal:()=>true});g.stop('ORIGINAL-STOP');g.stop('SECONDARY');
 for(const call of [()=>g.transport.acquire({}),()=>g.transport.consume(),()=>g.transport.mirror('s','1',0,final)])assert.throws(call,/LOCKED/);
 assert.equal(g.reason,'ORIGINAL-STOP');assert.equal(writes,0);assert.equal(g.transport.read().sha,'saved');
});
test('完成workerの最終mirror通信拒否も元理由を保持し再試行しない',()=>{
 let writes=0;const g=guard({mirror(){writes++;}},{mode:'proxy-final-mirror',allowFinal:()=>true,denied:{mirror(){throw Error('ORIGINAL-TRANSPORT-FAILURE');}}});
 assert.throws(()=>g.transport.mirror('s','1',0,final),/ORIGINAL-TRANSPORT/);g.stop('CLEANUP-STOP');
 assert.equal(g.reason,'ORIGINAL-TRANSPORT-FAILURE');assert.equal(writes,0);
 assert.throws(()=>g.transport.mirror('s','1',0,final),/LOCKED/);
});
test('判定失敗でも停止が保存より先でtimer/watchを終え元errorを投げる',async()=>{
 const order=[],original=Error('ASSERTION-FAILURE');let receipt;
 await assert.rejects(lifecycle(async()=>{throw original;},{stopWork(){order.push('kill');},clearTimer(){order.push('timer');},finishWatch(){order.push('watch');},save(r){order.push('save');receipt=r;}}),e=>e===original);
 assert.deepEqual(order,['kill','timer','watch','save']);assert.equal(receipt.workStopped,true);assert.equal(receipt.primaryError,original.message);
});
test('work停止確認失敗時はwatchを保ちcleanup errorで原因を上書きしない',async()=>{
 const original=Error('GIT-COMMIT-REFS-FAILURE');let receipt,watch=0;
 await assert.rejects(lifecycle(async()=>{throw original;},{stopWork(){throw Error('STOP-CHECK-FAILURE');},clearTimer(){},finishWatch(){watch++;},save(r){receipt=r;}}),e=>e===original);
 assert.equal(watch,0);assert.equal(receipt.workStopped,false);assert.deepEqual(receipt.cleanupErrors,[{phase:'stopWork',message:'STOP-CHECK-FAILURE'}]);
});
test('保存失敗・watch終了失敗でも最初の失敗を保持する',async()=>{
 const original=Error('FIRST');let receipt;
 await assert.rejects(lifecycle(async()=>{throw original;},{stopWork(){},clearTimer(){},finishWatch(){throw Error('WATCH');},save(r){receipt=r;throw Error('SAVE');}}),e=>e===original);
 assert.equal(receipt.primaryError,'FIRST');assert.equal(receipt.cleanupErrors[0].phase,'finishWatch');
});
test('本物の待機timerを持つ子も判定失敗後に期限待ちせず終了する',()=>{
 const modulePath=require.resolve('../tools/research/g5-befcs-remote-stop-v3/lifecycle.cjs');
 const script=`const {lifecycle}=require(${JSON.stringify(modulePath)});const timer=setInterval(()=>{},1200000);let watch;const exited=new Promise(r=>watch=setTimeout(r,1200000));lifecycle(async()=>{throw Error('original');},{stopWork(){},clearTimer(){clearInterval(timer);},finishWatch(){clearTimeout(watch);return Promise.resolve();},save(){}}).catch(e=>{if(e.message!=='original')process.exitCode=2;});`;
 const result=cp.spawnSync(process.execPath,['-e',script],{timeout:2000});assert.equal(result.error,undefined);assert.equal(result.status,0);
});
test('科学入力・旧branch・retry・source増量・予算増加を拒否する',()=>{
 const P=require('../tools/research/g5-befcs-remote-stop-v3/policy.cjs'),c=P.config('complete','1');
 for(const patch of [{evidenceClass:'BEFCS-SCIENTIFIC-PIPELINE'},{scientificSeedsRead:1},{count:129},{runAttempt:2},{limits:{...c.limits,maxTotalMs:1200001}}])assert.throws(()=>P.validate({...c,...patch}));
 const e={GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:'nkkmd/bao-la-kiswahili-game',GITHUB_EVENT_NAME:'push',GITHUB_RUN_ATTEMPT:'1',GITHUB_RUN_ID:'1',GITHUB_REF:'refs/heads/research/g5-befcs-remote-stop-v3-preflight',BEFCS_GIT_TOKEN:'fake'};
 assert.equal(P.remote(e),'https://github.com/nkkmd/bao-la-kiswahili-game.git');
 for(const patch of [{GITHUB_REF:'refs/heads/research/g5-befcs-remote-joined-preflight'},{GITHUB_EVENT_NAME:'pull_request'},{GITHUB_RUN_ATTEMPT:'2'}])assert.throws(()=>P.remote({...e,...patch}));
});
test('実workerとローカルGitの統合でも完成128件だけ最終mirrorを許可する',async()=>{
 const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
 const R=require('../tools/research/g5-befcs-workload/registry.cjs'),P=require('../tools/research/g5-befcs-pipeline/run.cjs'),G=require('../tools/research/g5-befcs-remote-stop-v3/guard.cjs');
 for(const mode of ['complete','global-time']){
  const d=fs.mkdtempSync(path.join(os.tmpdir(),'v3-real-worker-'));
  try{
   cp.execFileSync('git',['init','--quiet','--bare',d+'/remote.git']);const raw=R.open(d+'/registry',d+'/remote.git');
   const cfg=P.fixtureConfig(mode,d+'/evidence',d+'/control');cfg.runId='local-v3-'+mode;if(mode==='global-time')cfg.limits.maxTotalMs=100;
   const g=G.guard(raw,{allowFinal(){const f=cfg.output+'/summary/RESULT.json';return fs.existsSync(f)&&JSON.parse(fs.readFileSync(f)).workerComplete===true;}});
   const request={evidenceClass:'TECHNICAL-REGISTRY-FIXTURE',stageId:'LOCAL-V3-'+mode,runId:cfg.runId,runAttempt:1,binding:cfg.binding,block:{start:1,count:128}};
   const protocol=G.bindStop(require('../tools/research/g5-befcs-pipeline/session.cjs').session(g.transport,request,g.transport.acquire),g);
   const row=await P.orchestrate(d,cfg,g.transport,protocol,p=>p);
   if(mode==='complete'){assert.equal(row.technicalComplete,true);assert.equal(row.ackCount,128);assert.equal(row.worker.closures,1);assert.equal(g.locked,false);}
   else{assert.equal(row.technicalComplete,false);assert.equal(row.finalMirrorSaved,false);assert.equal(g.locked,true);const before=raw.read().sha;assert.throws(()=>g.transport.mirror(request.stageId,request.runId,0,final),/LOCKED/);assert.equal(raw.read().sha,before);}
  }finally{fs.rmSync(d,{recursive:true,force:true});}
 }
});
