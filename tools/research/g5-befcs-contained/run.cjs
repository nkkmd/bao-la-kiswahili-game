"use strict";
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),zlib=require('node:zlib');
const {LIMITS,MODES,validate,cgroupPath}=require('./policy.cjs'),R=require('../g5-befcs-workload/registry.cjs'),I=require('../g5-befcs-workload/independent-registry.cjs'),P=require('../g5-befcs-pipeline/run.cjs');
const {captureTree}=require('../g5-befcs-workload/capture-tree.cjs'),{atomic}=require('../g5-befcs-workload/worker.cjs');
const base=path.resolve(__dirname,'../../..'),docs='doc/research-generation-5/befcs-contained-20261013';
function bindings(){for(const n of ['SOURCE_MANIFEST.json','PROTECTED_INPUTS.json'])for(const [p,h]of Object.entries(JSON.parse(fs.readFileSync(path.join(base,docs,n))).files))assert.equal(R.hash(fs.readFileSync(path.join(base,p))),h,p);return true;}
function config(mode){return {evidenceClass:'TECHNICAL-CONTAINED-WORKLOAD-FIXTURE',scientificSeedsRead:0,count:128,mode,limits:{...LIMITS}};}
function filesystem(p){const s=fs.statfsSync(p);return {blockBytes:s.bsize,blocks:s.blocks,bytes:s.blocks*s.bsize,availableBytes:s.bavail*s.bsize,freeBytes:s.bfree*s.bsize};}
async function one(directory,mode){
 const settings=config(mode),timing=validate(settings);assert.equal(process.env.GITHUB_ACTIONS,'true','REAL-QUOTA-FIXTURE-REQUIRES-ISOLATED-ACTIONS');
 directory=path.resolve(directory);assert.ok(directory.startsWith(path.join(base,'artifacts/local/befcs-contained')+path.sep));
 const began=performance.now(),deadlineEpochMs=Date.now()+timing.totalMs,observerPid=process.pid,work=directory+'/quota',image=directory+'/QUOTA.img';
 atomic(directory+'/HEADER.json',{...settings,observerPid,deadlineEpochMs,reserveMs:timing.reserveMs});
 const watchdog=cp.spawn('sudo',[process.execPath,path.join(__dirname,'watchdog.cjs'),directory],{detached:true,stdio:['ignore','pipe','pipe']});watchdog.stdout.resume();let watchdogStderr='';watchdog.stderr.on('data',b=>{if(watchdogStderr.length<65536)watchdogStderr+=b.toString().slice(0,65536-watchdogStderr.length);});
 const watchdogExited=new Promise((resolve,reject)=>{watchdog.once('error',reject);watchdog.once('exit',(code,signal)=>resolve({code,signal}));});
 let mounted=false,container=null,sampler=null,latestCgroup=null;
 const command=(name,args,extra={})=>cp.execFileSync(name,args,{timeout:Math.max(1,Math.min(30000,deadlineEpochMs-Date.now())),maxBuffer:16778240,...extra});
 try{
  // 既存disk/deviceを渡さない。wxで作成したこのcaseの通常fileだけをformatする。
  const fd=fs.openSync(image,'wx');fs.ftruncateSync(fd,LIMITS.maxEvidenceBytes);fs.fsyncSync(fd);fs.closeSync(fd);fs.mkdirSync(work);
  command('sudo',['mkfs.ext4','-q','-F','-m','0',image]);command('sudo',['mount','-o','loop,nosuid,nodev,noexec',image,work]);mounted=true;
  command('sudo',['chown',process.getuid()+':'+process.getgid(),work]);command('fallocate',['-l',String(LIMITS.storageReserveBytes),work+'/FINAL_RESERVE']);
  command('git',['init','--quiet','--bare',work+'/remote.git']);
  const initialFs=filesystem(work);assert.ok(initialFs.bytes<=LIMITS.maxEvidenceBytes);atomic(directory+'/QUOTA_BEFORE.json',{imageBytes:fs.statSync(image).size,filesystem:initialFs,reserveAllocatedBytes:fs.statSync(work+'/FINAL_RESERVE').blocks*512});
  const file=directory+'/CONFIG.json';atomic(file,{...settings,deadlineEpochMs,reserveMs:timing.reserveMs});
  container=command('docker',['create','--user',process.getuid()+':'+process.getgid(),'--read-only','--network=none','--memory=1073741824','--memory-swap=1073741824','--pids-limit=32','-e','TMPDIR=/work/tmp','-v',base+':/repo:ro','-v',work+':/work','-v',file+':/config.json:ro','node:24.19.0-bookworm','node','/repo/tools/research/g5-befcs-contained/controller.cjs'],{encoding:'utf8'}).trim();
  atomic(directory+'/CONTAINER.json',{id:container});
  const docker=cp.spawn('docker',['start','-a',container],{stdio:['ignore','pipe','pipe']});let stdout='',stderr='';docker.stdout.on('data',b=>{if(stdout.length<65536)stdout+=b.toString().slice(0,65536-stdout.length);});docker.stderr.on('data',b=>{if(stderr.length<65536)stderr+=b.toString().slice(0,65536-stderr.length);});
  const exited=new Promise((resolve,reject)=>{docker.once('error',reject);docker.once('exit',(code,signal)=>resolve({code,signal}));});
  let target=null;
  for(let n=0;n<100;n++){
   const s=JSON.parse(command('docker',['inspect',container],{encoding:'utf8'}))[0];
   if(s.State.Pid>0){const rawCgroup=fs.readFileSync('/proc/'+s.State.Pid+'/cgroup','utf8');target={id:container,rawCgroup,cgroupPath:cgroupPath(container,rawCgroup)};atomic(directory+'/TARGET.json',target);break;}
   if(s.State.Status==='exited')break;await new Promise(r=>setTimeout(r,10));
  }
  if(target)sampler=setInterval(()=>{try{latestCgroup={memoryCurrent:Number(fs.readFileSync(target.cgroupPath+'/memory.current','utf8')),memoryPeak:Number(fs.readFileSync(target.cgroupPath+'/memory.peak','utf8')),events:fs.readFileSync(target.cgroupPath+'/memory.events','utf8')};}catch(e){if(e.code!=='ENOENT')throw e;}},20);
  const exit=await exited;if(sampler){clearInterval(sampler);sampler=null;}
  const inspection=JSON.parse(command('docker',['inspect',container],{encoding:'utf8'}))[0];assert.equal(inspection.State.Running,false,'PRIMARY-MUST-STOP-BEFORE-RECOVERY');assert.equal(inspection.HostConfig.Memory,LIMITS.maxRssBytes);assert.equal(inspection.HostConfig.MemorySwap,LIMITS.maxRssBytes);assert.equal(inspection.HostConfig.PidsLimit,32);assert.equal(inspection.HostConfig.ReadonlyRootfs,true);assert.equal(inspection.HostConfig.NetworkMode,'none');
  atomic(directory+'/INSPECTION.json',{exit,state:inspection.State,hostConfig:inspection.HostConfig,image:inspection.Image,latestCgroup,stdout,stderr});
  if(mode==='observer-timeout'){atomic(directory+'/OBSERVER_HOLD.json',{primaryStopped:true,scientificSeedsRead:0});for(;;)Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,20);}
  fs.rmSync(work+'/FINAL_RESERVE',{force:true});
  const recovery=R.open(work+'/recovery',work+'/remote.git'),before=recovery.read(),beforeMarkers=before.record.leases[0]?.consumes.length??0;
  let recoveryMirror=null;
  if(mode!=='final-mirror-failure'&&before.record.leases.length){
   const lease=before.record.leases[0],files=captureTree(work+'/evidence',LIMITS.maxEvidenceBytes).files;
   files['PHASE.json']=Buffer.from(JSON.stringify({final:true,externalRecovery:true,marked:beforeMarkers,scientificSeedsRead:0,solution:null,resumeAuthorized:false}));
   const mirrored=recovery.mirror(lease.stageId,lease.runId,before.record.mirrors.length,files);recoveryMirror=mirrored.sha;
  }
  const current=recovery.read();assert.equal(current.record.leases[0]?.consumes.length??0,beforeMarkers,'RECOVERY-MUST-NOT-CONSUME');
  const verified=I.verify(work+'/recovery',current.sha),control=work+'/control';
  const ackNames=fs.existsSync(control)?fs.readdirSync(control).filter(p=>/^ACK-\d+\.json$/.test(p)):[],ackCount=ackNames.length;
  for(let n=0;n<ackCount;n++)assert.equal(JSON.parse(fs.readFileSync(control+'/ACK-'+n+'.json')).index,n);
  const unacknowledgedMarkers=verified.logicalReadsMarked-ackCount;assert.ok(unacknowledgedMarkers===0||unacknowledgedMarkers===1);assert.equal(fs.existsSync(control+'/ACK-'+ackCount+'.json'),false);
  command('git',['update-ref',recovery.ref,current.sha],{cwd:work+'/recovery'});const bundle=work+'/REGISTRY.bundle';command('git',['bundle','create',bundle,recovery.ref],{cwd:work+'/recovery'});
  const workerFile=work+'/evidence/summary/RESULT.json',hostFile=work+'/HOST_RESULT.json',worker=fs.existsSync(workerFile)?JSON.parse(fs.readFileSync(workerFile)):null,host=fs.existsSync(hostFile)?JSON.parse(fs.readFileSync(hostFile)):null;
  const row={mode,fixtureSourceCount:128,scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,registryHead:current.sha,registryRef:recovery.ref,registryBundleBase64:fs.readFileSync(bundle).toString('base64'),verified,worker,host,ackCount,unacknowledgedMarkers,recoveryMirror,finalMirrorSaved:mode!=='final-mirror-failure'&&Boolean(recoveryMirror),technicalComplete:mode==='complete'&&host?.technicalComplete===true,inspection:{state:inspection.State,image:inspection.Image},latestCgroup,filesystem:filesystem(work),externalObserverPeakRssBytes:process.resourceUsage().maxRSS*1024,solution:null,resumeAuthorized:false};
  if(mode==='complete'){assert.equal(row.technicalComplete,true,JSON.stringify({worker,host}));assert.equal(worker.read,128);assert.equal(worker.closures,1);assert.equal(worker.candidates,1);}
  else{assert.equal(row.technicalComplete,false);if(mode==='host-oom'){assert.equal(inspection.State.OOMKilled,true);assert.equal(fs.existsSync(work+'/INJECTION.json'),true);assert.equal(host,null);assert.ok(ackCount>=1&&ackCount<128);}if(mode==='disk-full'){row.enospc=JSON.parse(fs.readFileSync(work+'/ENOSPC.json'));assert.equal(row.enospc.error,'ENOSPC');assert.equal(ackCount,1);}if(mode==='detached'){row.detached=JSON.parse(fs.readFileSync(work+'/DETACHED.json'));assert.equal(ackCount,1);}if(mode==='final-mirror-failure'){assert.equal(worker.workerComplete,true);assert.equal(host.finalMirrorSaved,false);assert.equal(row.finalMirrorSaved,false);}}
  // 独立replayも元の単一deadline内。再生成するのは保存済みfixtureの抽象閉包だけ。
  const previousTmpdir=process.env.TMPDIR;process.env.TMPDIR=work+'/tmp';
  try{P.replay(row);}finally{if(previousTmpdir===undefined)delete process.env.TMPDIR;else process.env.TMPDIR=previousTmpdir;}
  assert.ok(Date.now()<deadlineEpochMs,'FINAL-VERIFY-EXCEEDED-TOTAL-DEADLINE');
  atomic(directory+'/SCENARIO.json',row);atomic(directory+'/VERIFIED.json',{sourceManifestSha256:R.hash(fs.readFileSync(path.join(base,docs,'SOURCE_MANIFEST.json'))),registryReplayPassed:true,markedBeforeRecovery:beforeMarkers,markedAfterRecovery:verified.logicalReadsMarked,scientificSeedsRead:0});
  command('sudo',['umount',work]);mounted=false;
  const archive=directory+'/QUOTA.img.gz',dest=fs.openSync(archive,'wx');try{command('gzip',['-c',image],{stdio:['ignore',dest,'pipe']});fs.fsyncSync(dest);}finally{fs.closeSync(dest);}
  assert.ok(Date.now()<deadlineEpochMs,'FINAL-ARCHIVE-EXCEEDED-TOTAL-DEADLINE');assert.ok(fs.statSync(archive).size<=LIMITS.maxEvidenceBytes);
  fs.unlinkSync(image);atomic(directory+'/WATCHDOG_DONE.json',{verified:true,elapsedMs:performance.now()-began,scientificSeedsRead:0});assert.equal((await watchdogExited).code,0);
  row.watchdog=JSON.parse(fs.readFileSync(directory+'/WATCHDOG.json'));row.elapsedTotalMs=performance.now()-began;row.archiveBytes=fs.statSync(archive).size;
  if(mode==='deadline')assert.ok(row.watchdog.records.some(x=>x.phase==='ORDINARY-DEADLINE'&&x.method==='KERNEL-CGROUP-KILL'));
  atomic(directory+'/SCENARIO.json',row);return row;
 }finally{
  if(sampler)clearInterval(sampler);
  if(container){try{cp.execFileSync('docker',['rm','-f',container],{stdio:'ignore',timeout:30000});}catch{}}
  if(mounted){try{cp.execFileSync('sudo',['umount',work],{stdio:'ignore',timeout:30000});}catch{}}
  if(!fs.existsSync(directory+'/WATCHDOG_DONE.json'))atomic(directory+'/WATCHDOG_DONE.json',{verified:false,scientificSeedsRead:0});
  atomic(directory+'/WATCHDOG_DIAGNOSTIC.json',{stderr:watchdogStderr,scientificSeedsRead:0});
 }
}
async function live(){
 bindings();assert.equal(process.env.GITHUB_ACTIONS,'true');const sourceDigest=R.hash(fs.readFileSync(path.join(base,docs,'SOURCE_MANIFEST.json'))),out=path.join(base,'artifacts/local/befcs-contained');fs.mkdirSync(out,{recursive:true});const rows=[];
 for(const mode of MODES){
  const directory=out+'/live-'+mode;fs.mkdirSync(directory);console.error('contained-scenario',mode);
  const executor=cp.spawn(process.execPath,[__filename,'--one',directory,mode],{detached:true,stdio:'inherit'});
  const exit=await new Promise((r,j)=>{executor.once('error',j);executor.once('exit',(code,signal)=>r({code,signal}));});
  if(exit.code!==0){
   // 全体deadlineでobserverがSIGKILLされた場合も、新規caseのimageを保存可能な状態へ閉じる。
   const f=directory+'/CONTAINER.json';if(fs.existsSync(f)){const {id}=JSON.parse(fs.readFileSync(f));assert.match(id,/^[a-f0-9]{64}$/);try{cp.execFileSync('docker',['rm','-f',id],{stdio:'ignore',timeout:30000});}catch{}}
   if(mode==='observer-timeout'){
    assert.equal(exit.signal,'SIGKILL');const watch=JSON.parse(fs.readFileSync(directory+'/WATCHDOG.json'));assert.ok(watch.records.some(x=>x.phase==='TOTAL-DEADLINE'));
    assert.equal(JSON.parse(fs.readFileSync(directory+'/OBSERVER_HOLD.json')).primaryStopped,true);const inspection=JSON.parse(fs.readFileSync(directory+'/INSPECTION.json'));assert.equal(inspection.state.Running,false);
    // 全体期限後の診断保存であり、consumeもmirrorも再開しない。
    const remote=directory+'/quota/remote.git',head=cp.execFileSync('git',['rev-parse',R.REF],{cwd:remote,encoding:'utf8',timeout:30000}).trim(),verified=I.verify(remote,head),bundle=directory+'/STOPPED_REGISTRY.bundle';
    cp.execFileSync('git',['bundle','create',bundle,R.REF],{cwd:remote,timeout:30000});const control=directory+'/quota/control',ackCount=fs.readdirSync(control).filter(p=>/^ACK-\d+\.json$/.test(p)).length;
    const unacknowledgedMarkers=verified.logicalReadsMarked-ackCount;assert.ok(unacknowledgedMarkers===0||unacknowledgedMarkers===1);
    const row={mode,fixtureSourceCount:128,registryHead:head,registryRef:R.REF,registryBundleBase64:fs.readFileSync(bundle).toString('base64'),verified,ackCount,unacknowledgedMarkers,watchdog:watch,inspection:{state:inspection.state,image:inspection.image},observerExit:exit,technicalComplete:false,completionWithinDeadline:false,forensicPreservationAfterDeadline:true,finalMirrorSaved:false,scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,solution:null,resumeAuthorized:false};
    cp.execFileSync('sudo',['umount',directory+'/quota'],{timeout:30000});const image=directory+'/QUOTA.img',archive=directory+'/QUOTA.img.gz',fd=fs.openSync(archive,'wx');try{cp.execFileSync('gzip',['-c',image],{stdio:['ignore',fd,'pipe'],timeout:30000});fs.fsyncSync(fd);}finally{fs.closeSync(fd);}fs.unlinkSync(image);row.archiveBytes=fs.statSync(archive).size;
    atomic(directory+'/FAILED_OBSERVER.json',{exit,expectedDeadlineStop:true,completionWithinDeadline:false,forensicCleanup:true,scientificSeedsRead:0});atomic(directory+'/SCENARIO.json',row);rows.push(row);fs.writeFileSync(out+'/SCENARIO-'+mode+'.json.gz',zlib.gzipSync(Buffer.from(JSON.stringify(row))));console.error('contained-scenario-saved',mode);continue;
   }
   try{cp.execFileSync('sudo',['umount',directory+'/quota'],{stdio:'ignore',timeout:30000});}catch{}
   atomic(directory+'/FAILED_OBSERVER.json',{exit,completionWithinDeadline:false,forensicCleanup:true,scientificSeedsRead:0});
   throw Error('CONTAINED-CASE-INCOMPLETE-'+mode);
  }
  const row=JSON.parse(fs.readFileSync(directory+'/SCENARIO.json'));rows.push(row);fs.writeFileSync(out+'/SCENARIO-'+mode+'.json.gz',zlib.gzipSync(Buffer.from(JSON.stringify(row))));console.error('contained-scenario-saved',mode);
 }
 bindings();assert.equal(R.hash(fs.readFileSync(path.join(base,docs,'SOURCE_MANIFEST.json'))),sourceDigest);const bytes=Buffer.from(JSON.stringify(rows));fs.writeFileSync(out+'/TECHNICAL_EVIDENCE.json.gz',zlib.gzipSync(bytes));const result={decision:'CONTAINED-WORKLOAD-QUOTA-AND-RECOVERY-TECHNICAL-PASS-SCIENTIFIC-DEPLOYMENT-PENDING',sourceManifestSha256:sourceDigest,evidenceSha256:R.hash(bytes),scenarios:rows.map(({registryBundleBase64,...r})=>r),scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,conservativeReadIdentities:103355,formalRelationRegistered:false};atomic(out+'/RESULT.json',result);console.log(JSON.stringify(result));return result;
}
if(require.main===module)Promise.resolve(process.argv[2]==='--bindings'?bindings():process.argv[2]==='--ci-live'?live():process.argv[2]==='--one'?one(process.argv[3],process.argv[4]):Promise.reject(Error('TECHNICAL-MODE-REQUIRED'))).catch(e=>{console.error(e);process.exitCode=1;});
module.exports={config,bindings,filesystem,one,live};
