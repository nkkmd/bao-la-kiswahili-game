"use strict";
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict'),zlib=require('node:zlib');
const {CLASS,MODES,PARTITIONS,LIMITS,config,validate,ownCgroup}=require('./policy.cjs');
const R=require('../g5-befcs-workload/registry.cjs'),I=require('../g5-befcs-workload/independent-registry.cjs'),P=require('../g5-befcs-pipeline/run.cjs'),{captureTree}=require('../g5-befcs-workload/capture-tree.cjs'),{atomic}=require('../g5-befcs-workload/worker.cjs');
const base=path.resolve(__dirname,'../../..'),docs='doc/research-generation-5/befcs-joined-20261013';
function bindings(){for(const n of ['SOURCE_MANIFEST.json','PROTECTED_INPUTS.json'])for(const [p,h]of Object.entries(JSON.parse(fs.readFileSync(path.join(base,docs,n))).files))assert.equal(R.hash(fs.readFileSync(path.join(base,p))),h,p);return true;}
function sample(root){const row={};for(const n of ['',...Object.keys(PARTITIONS)]){const p=root+(n?'/'+n:'');row[n||'parent']={max:fs.readFileSync(p+'/memory.max','utf8').trim(),swapMax:fs.readFileSync(p+'/memory.swap.max','utf8').trim(),peak:Number(fs.readFileSync(p+'/memory.peak','utf8')),current:Number(fs.readFileSync(p+'/memory.current','utf8')),events:fs.readFileSync(p+'/memory.events','utf8'),procs:fs.readFileSync(p+'/cgroup.procs','utf8').trim()};}return row;}
function filesystem(p){const s=fs.statfsSync(p);return {blockBytes:s.bsize,bytes:s.blocks*s.bsize,freeBytes:s.bfree*s.bsize,availableBytes:s.bavail*s.bsize};}
function command(name,args,extra={}){return cp.execFileSync(name,args,{timeout:30000,maxBuffer:16778240,...extra});}
function evidence(directory,mode,withRecovery,deadlineEpochMs=null){
 assert.equal(fs.readFileSync(directory+'/WORK_STOPPED.json','utf8').length>0,true,'NO-RECOVERY-WHILE-WORK-LIVE');
 fs.rmSync(directory+'/FINAL_RESERVE',{force:true});
 const registry=R.open(directory+'/recovery',directory+'/remote.git'),before=registry.read(),markers=before.record.leases[0]?.consumes.length??0;let recoveryMirror=null;
 if(withRecovery&&before.record.leases.length){const lease=before.record.leases[0],files=captureTree(directory+'/evidence',LIMITS.maxEvidenceBytes).files;files['PHASE.json']=Buffer.from(JSON.stringify({final:true,externalRecovery:true,marked:markers,scientificSeedsRead:0,solution:null}));recoveryMirror=registry.mirror(lease.stageId,lease.runId,before.record.mirrors.length,files).sha;}
 const current=registry.read(),verified=I.verify(directory+'/recovery',current.sha);assert.equal(verified.logicalReadsMarked,markers);
 const control=directory+'/control',ackCount=fs.existsSync(control)?fs.readdirSync(control).filter(x=>/^ACK-\d+\.json$/.test(x)).length:0;
 for(let n=0;n<ackCount;n++)assert.equal(JSON.parse(fs.readFileSync(control+'/ACK-'+n+'.json')).index,n);
 const unacknowledgedMarkers=markers-ackCount;assert.ok(unacknowledgedMarkers===0||unacknowledgedMarkers===1);assert.equal(fs.existsSync(control+'/ACK-'+ackCount+'.json'),false);
 command('git',['update-ref',registry.ref,current.sha],{cwd:directory+'/recovery'});const bundle=directory+'/REGISTRY.bundle';command('git',['bundle','create',bundle,registry.ref],{cwd:directory+'/recovery'});
 const read=p=>fs.existsSync(p)?JSON.parse(fs.readFileSync(p)):null,worker=read(directory+'/evidence/summary/RESULT.json'),host=read(directory+'/HOST_RESULT.json');
 const row={mode,fixtureSourceCount:128,registryHead:current.sha,registryRef:registry.ref,registryBundleBase64:fs.readFileSync(bundle).toString('base64'),verified,ackCount,unacknowledgedMarkers,recoveryMirror,finalMirrorSaved:withRecovery&&Boolean(recoveryMirror),worker,host,technicalComplete:mode==='complete'&&host?.technicalComplete===true,scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,scientificHostReleased:false,solution:null,resumeAuthorized:false};
 if(mode!=='deadline'){const prior=process.env.TMPDIR;process.env.TMPDIR=directory+'/tmp';try{P.replay(row);}finally{if(prior===undefined)delete process.env.TMPDIR;else process.env.TMPDIR=prior;}row.fullSavedMirrorReplayPassed=true;}
 else{row.fullSavedMirrorReplayPassed=false;row.partialSnapshotStatusNotFilled=true;row.forensicPreservationAfterDeadline=true;row.completionWithinDeadline=false;}
 if(deadlineEpochMs!==null)assert.ok(Date.now()<deadlineEpochMs,'JOINED-VERIFY-EXCEEDED-TOTAL');
 atomic(directory+'/SCENARIO.json',row);fs.writeFileSync(directory+'/SCENARIO.json.gz',zlib.gzipSync(Buffer.from(JSON.stringify(row))));
 if(deadlineEpochMs!==null)assert.ok(Date.now()<deadlineEpochMs,'JOINED-SAVE-EXCEEDED-TOTAL');return row;
}
async function service(directory,mode,unit){
 const settings=config(mode),timing=validate(settings);assert.equal(process.env.GITHUB_ACTIONS,'true');assert.equal(process.getuid(),0);const began=performance.now(),deadlineEpochMs=Date.now()+timing.totalMs,root=ownCgroup(unit,fs.readFileSync('/proc/self/cgroup','utf8'));
 assert.equal(fs.readFileSync(root+'/memory.max','utf8').trim(),String(LIMITS.maxRssBytes));assert.equal(fs.readFileSync(root+'/memory.swap.max','utf8').trim(),'0');
 fs.mkdirSync(root+'/control');fs.writeFileSync(root+'/control/cgroup.procs',String(process.pid));fs.writeFileSync(root+'/cgroup.subtree_control','+memory +pids');fs.writeFileSync('/proc/self/oom_score_adj','-1000');
 for(const [n,max]of Object.entries(PARTITIONS)){if(n!=='control')fs.mkdirSync(root+'/'+n);fs.writeFileSync(root+'/'+n+'/memory.max',String(max));fs.writeFileSync(root+'/'+n+'/memory.swap.max','0');fs.writeFileSync(root+'/'+n+'/pids.max','64');fs.writeFileSync(root+'/'+n+'/memory.oom.group','0');}
 for(const n of ['tmp','evidence','control'])fs.mkdirSync(directory+'/'+n);
 command('fallocate',['-l',String(LIMITS.storageReserveBytes),directory+'/FINAL_RESERVE']);command('git',['init','--quiet','--bare',directory+'/remote.git']);
 atomic(directory+'/HEADER.json',{root,config:settings,totalMs:timing.totalMs,reserveMs:timing.reserveMs,deadlineEpochMs,filesystem:filesystem(directory),initialResources:sample(root),scientificSeedsRead:0});
 const launch=(file,env={})=>{const child=cp.spawn(process.execPath,[path.join(__dirname,file),directory],{stdio:'ignore',env:{PATH:process.env.PATH,GITHUB_ACTIONS:'true',TMPDIR:directory+'/tmp',...env}});return {pid:child.pid,exit:new Promise((r,j)=>{child.once('error',j);child.once('exit',(code,signal)=>r({code,signal}));})};};
 const watch=launch('watch.cjs'),until=performance.now()+2000;
 while(!fs.existsSync(directory+'/WATCH_READY.json')){assert.ok(performance.now()<until,'JOINED-WATCH-NOT-READY');await new Promise(r=>setTimeout(r,10));}
 const ready=JSON.parse(fs.readFileSync(directory+'/WATCH_READY.json'));assert.equal(ready.pid,watch.pid);assert.ok(fs.readFileSync(root+'/watch/cgroup.procs','utf8').trim().split('\n').includes(String(watch.pid)));
 const host=launch('host.cjs',{NODE_OPTIONS:'--require='+path.join(__dirname,'bootstrap.cjs'),BEFCS_JOINED_ROOT:root});
 atomic(directory+'/PIDS.json',{manager:process.pid,host:host.pid,watch:watch.pid});
 const timer=setInterval(()=>atomic(directory+'/RESOURCE.json',sample(root)),50);
 const hostExit=await host.exit;atomic(directory+'/HOST_EXIT.json',hostExit);
 if(mode==='host-oom'){assert.equal(hostExit.signal,'SIGKILL');assert.ok(/^oom_kill [1-9]\d*$/m.test(fs.readFileSync(root+'/control/memory.events','utf8')));}
 const stopUntil=performance.now()+2000;
 while(fs.readFileSync(root+'/work/cgroup.procs','utf8').trim()){assert.ok(performance.now()<stopUntil,'WORK-NOT-STOPPED');await new Promise(r=>setTimeout(r,10));}
 atomic(directory+'/WORK_STOPPED.json',{cgroup:root+'/work',procs:[],scientificSeedsRead:0});
 if(mode==='deadline'){atomic(directory+'/HOLD.json',{hostStopped:true,workStopped:true,scientificSeedsRead:0});for(;;)Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,100);}
 const row=evidence(directory,mode,mode!=='final-mirror-failure',deadlineEpochMs);
 if(mode==='complete'){assert.equal(row.technicalComplete,true);assert.equal(row.worker.read,128);assert.equal(row.worker.closures,1);assert.equal(row.ackCount,128);}
 if(mode==='host-oom'){assert.equal(row.host,null);assert.equal(row.ackCount,1);assert.equal(row.technicalComplete,false);}
 if(mode==='final-mirror-failure'){assert.equal(row.worker.read,128);assert.equal(row.worker.workerComplete,true);assert.equal(row.host.finalMirrorSaved,false);assert.equal(row.finalMirrorSaved,false);assert.equal(row.technicalComplete,false);}
 clearInterval(timer);atomic(directory+'/RESOURCE.json',sample(root));atomic(directory+'/WATCH_DONE.json',{elapsedMs:performance.now()-began,scientificSeedsRead:0});assert.equal((await watch.exit).code,0);
 atomic(directory+'/COMPLETED.json',{elapsedMs:performance.now()-began,deadlineEpochMs,completedBeforeDeadline:Date.now()<deadlineEpochMs,scientificSeedsRead:0});assert.ok(Date.now()<deadlineEpochMs);
}
function live(){
 bindings();assert.equal(process.env.GITHUB_ACTIONS,'true');const directory=path.join(base,'artifacts/local/befcs-joined');assert.ok(filesystem(directory).bytes<=LIMITS.maxEvidenceBytes);const rows=[];
 for(const mode of MODES){const out=directory+'/'+mode;fs.mkdirSync(out);const unit='bao-g5-joined-'+crypto.randomBytes(8).toString('hex')+'.service',timing=validate(config(mode));
  const result=cp.spawnSync('sudo',['systemd-run','--quiet','--wait','--unit='+unit,'--property=MemoryMax='+LIMITS.maxRssBytes,'--property=MemorySwapMax=0','--property=TasksMax=256','--property=Delegate=yes','--property=ExitType=cgroup','--property=KillMode=control-group','--property=PrivateNetwork=yes','--property=RuntimeMaxSec='+Math.ceil(timing.totalMs/1000+5),'--property=StandardOutput=null','--property=StandardError=null','--setenv=GITHUB_ACTIONS=true','--setenv=PATH='+process.env.PATH,process.execPath,__filename,'--service',out,mode,unit],{timeout:timing.totalMs+10000,maxBuffer:65536,encoding:'utf8'});
  const header=JSON.parse(fs.readFileSync(out+'/HEADER.json')),watch=JSON.parse(fs.readFileSync(out+'/WATCH.json')),resources=JSON.parse(fs.readFileSync(out+'/RESOURCE.json'));let row;
  if(mode==='deadline'){
   assert.notEqual(result.status,0);assert.equal(JSON.parse(fs.readFileSync(out+'/HOLD.json')).workStopped,true);
   const stopped=watch.records.filter(x=>x.reason==='TOTAL-EARLY-STOP');assert.deepEqual(stopped.map(x=>x.target),['work','control']);assert.ok(stopped.every(x=>x.atMs<timing.totalMs),'STOP-EXCEEDED-FIXTURE-DEADLINE');
   assert.ok(watch.records.filter(x=>x.reason==='ORDINARY-EARLY-STOP').every(x=>x.atMs<timing.totalMs-timing.reserveMs));
   // service終了後の診断保存。科学経路のreplayやconsume/mirror再開は行わない。
   row=evidence(out,mode,false);
  }else{assert.equal(result.status,0,JSON.stringify(result));row=JSON.parse(fs.readFileSync(out+'/SCENARIO.json'));assert.equal(JSON.parse(fs.readFileSync(out+'/COMPLETED.json')).completedBeforeDeadline,true);}
  for(const [n,max]of Object.entries({parent:LIMITS.maxRssBytes,...PARTITIONS})){assert.equal(resources[n].max,String(max));assert.equal(resources[n].swapMax,'0');}
  assert.equal(JSON.parse(fs.readFileSync(out+'/WORKER_BOUNDARY.json')).beforeWorkerModule,true);assert.equal(JSON.parse(fs.readFileSync(out+'/WORKER_BOUNDARY.json')).cgroup.trim(),'0::'+header.root.slice('/sys/fs/cgroup'.length)+'/work');
  row={...row,header,watch,resources,systemdExit:{status:result.status,signal:result.signal},common128SourceIntegrated:true,dockerUsed:false,authenticatedTransportUsed:false};atomic(out+'/FINAL_SCENARIO.json',row);fs.writeFileSync(directory+'/SCENARIO-'+mode+'.json.gz',zlib.gzipSync(Buffer.from(JSON.stringify(row))));rows.push(row);console.error('joined-case',mode,'passed');
 }
 bindings();const bytes=Buffer.from(JSON.stringify(rows));fs.writeFileSync(directory+'/TECHNICAL_EVIDENCE.json.gz',zlib.gzipSync(bytes));const result={decision:'JOINED-128-SOURCE-CGROUP-TECHNICAL-PASS-SCIENTIFIC-RELEASE-PENDING',scenarios:rows.map(({registryBundleBase64,...r})=>r),evidenceSha256:R.hash(bytes),sourceManifestSha256:R.hash(fs.readFileSync(path.join(base,docs,'SOURCE_MANIFEST.json'))),scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false};atomic(directory+'/RESULT.json',result);console.log(JSON.stringify(result));return result;
}
if(require.main===module)Promise.resolve(process.argv[2]==='--bindings'?bindings():process.argv[2]==='--ci-live'?live():process.argv[2]==='--service'?service(process.argv[3],process.argv[4],process.argv[5]):Promise.reject(Error('TECHNICAL-MODE-REQUIRED'))).catch(e=>{if(process.argv[2]==='--service'){try{atomic(process.argv[3]+'/SERVICE_ERROR.json',{message:e.message,scientificSeedsRead:0});}catch{}}console.error(e);process.exitCode=1;});
module.exports={bindings,evidence};
