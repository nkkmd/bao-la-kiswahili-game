"use strict";
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {LIMITS,disk,createEnvelope}=require('./envelope.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const root='/work',mode=process.argv[2],journal=path.join(root,'evidence/PREFIX.jsonl');
const readNumber=p=>Number(fs.readFileSync('/sys/fs/cgroup/'+p,'utf8').trim());
function events(){return Object.fromEntries(fs.readFileSync('/sys/fs/cgroup/memory.events','utf8').trim().split('\n').map(l=>{const [k,v]=l.split(' ');return [k,Number(v)];}));}
function alive(pid){try{return fs.readFileSync('/proc/'+pid+'/stat','utf8').split(') ')[1][0]!=='Z';}catch(e){if(e.code==='ENOENT')return false;throw e;}}
function save(file,value){const fd=fs.openSync(file,'w');try{fs.writeFileSync(fd,JSON.stringify(value)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}const dir=fs.openSync(path.dirname(file),'r');try{fs.fsyncSync(dir);}finally{fs.closeSync(dir);}}
async function worker(){
  const fd=fs.openSync(journal,'wx');let previous='0'.repeat(64);
  try{for(let i=0;i<10;i++){const body={seq:i,previous,record:{kind:'FIXED-BYTES-NO-BAO-NO-PRNG',text:'prefix-'+i}},digest=hash(JSON.stringify(body));fs.writeSync(fd,JSON.stringify({...body,hash:digest})+'\n');fs.fsyncSync(fd);previous=digest;}}
  finally{fs.closeSync(fd);const d=fs.openSync(path.dirname(journal),'r');try{fs.fsyncSync(d);}finally{fs.closeSync(d);}}
  if(mode==='worker-detached'){
    const child=cp.spawn(process.execPath,[__filename,'descendant'],{detached:true,stdio:'ignore'});child.unref();
    save(path.join(root,'control/DESCENDANT.json'),{pid:child.pid});return;
  }
  if(mode==='worker-oom'){
    fs.writeFileSync('/proc/self/oom_score_adj','500');const buffers=[];
    for(;;){buffers.push(Buffer.alloc(67108864,0x61));await new Promise(r=>setTimeout(r,20));}
  }
}
async function host(){
  assert.ok(['complete','detached','oom'].includes(mode));
  for(const n of ['evidence','control','git','mirror','verification'])fs.mkdirSync(path.join(root,n));
  assert.equal(readNumber('memory.max'),LIMITS.maxRssBytes);assert.equal(readNumber('memory.swap.max'),0);
  assert.equal(readNumber('pids.max'),32);
  const initialEvents=events(),hostCgroup=fs.readFileSync('/proc/self/cgroup','utf8');
  const e=createEnvelope({evidenceClass:'TECHNICAL-ENVELOPE-FIXTURE',scientificSeedsRead:0,limits:{...LIMITS}},()=>performance.now(),()=>({rss:readNumber('memory.current'),diskBytes:disk(root).charged}));
  save(path.join(root,'control/BEFORE.json'),{evidenceClass:'TECHNICAL-ENVELOPE-FIXTURE',scientificSeedsRead:0,limits:LIMITS,hostCgroup,initialEvents});
  // Git・mirror・検算を含むhost自身がworkerと同じcgroup内にある。
  async function command(name,args,phase='ordinary'){
    const timeout=e.transportTimeout(phase);let output=Buffer.alloc(0);
    const release=e.reserve(1048576,phase),child=cp.spawn(name,args,{cwd:root,stdio:['ignore','pipe','pipe']});
    const timer=setTimeout(()=>child.kill('SIGKILL'),timeout);
    child.stdout.on('data',b=>{if(output.length+b.length>1048576)child.kill('SIGKILL');else output=Buffer.concat([output,b]);});
    child.stderr.on('data',()=>{});
    try{const exit=await new Promise((r,j)=>{child.once('error',j);child.once('exit',(code,signal)=>r({code,signal}));});assert.equal(exit.code,0,'BOUNDED-CHILD-INCOMPLETE');e.sample(phase);return output.toString().trim();}
    finally{clearTimeout(timer);release();}
  }
  await command('git',['init','--quiet','git']);
  const workerProcess=cp.spawn(process.execPath,[__filename,'worker-'+mode],{stdio:['ignore','pipe','pipe']});
  const workerCgroup=fs.readFileSync('/proc/'+workerProcess.pid+'/cgroup','utf8');assert.equal(workerCgroup,hostCgroup);
  let supervisorError=null;
  const timer=setInterval(()=>{try{e.sample();}catch(error){supervisorError=error.message;e.stop(supervisorError);workerProcess.kill('SIGKILL');}},20);
  workerProcess.stdout.resume();workerProcess.stderr.resume();
  const exit=await new Promise((r,j)=>{workerProcess.once('error',j);workerProcess.once('exit',(code,signal)=>r({code,signal}));});clearInterval(timer);
  const afterEvents=events(),oomKills=afterEvents.oom_kill-initialEvents.oom_kill;
  if(exit.code!==0)e.stop(oomKills>0?'CGROUP-OOM':'WORKER-INCOMPLETE');
  const descendantFile=path.join(root,'control/DESCENDANT.json');let detachedObserved=false,descendantCgroup=null;
  if(fs.existsSync(descendantFile)){
    const {pid}=JSON.parse(fs.readFileSync(descendantFile));detachedObserved=alive(pid);
    descendantCgroup=fs.readFileSync('/proc/'+pid+'/cgroup','utf8');assert.equal(descendantCgroup,hostCgroup);
    if(alive(pid))process.kill(pid,'SIGKILL');
    for(let i=0;i<100&&alive(pid);i++)await new Promise(r=>setTimeout(r,10));assert.equal(alive(pid),false,'DESCENDANT-STILL-LIVE');
    e.stop('DETACHED-DESCENDANT-TERMINATED');
  }
  e.sample('final');const prefix=fs.readFileSync(journal),prefixHash=hash(prefix);
  const release=e.reserve(prefix.length*2+4096,'final');
  try{
    // 固定prefixのmirrorとGit object・出力検算を終了予算内に作る。
    const payload=path.join(root,'mirror/PREFIX.jsonl');fs.copyFileSync(journal,payload);const fd=fs.openSync(payload,'r');try{fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
    e.chargeRemote(prefix.length,'final');
    const blob=await command('git',['-C','git','hash-object','-w',payload],'final');
    const recovered=await command('git',['-C','git','cat-file','blob',blob],'final');
    assert.equal(hash(Buffer.from(recovered+'\n')),prefixHash);
    save(path.join(root,'verification/PROOF.json'),{blob,prefixHash,scientificSeedsRead:0});
  }finally{release();}
  const finalSample=e.sample('final');e.finish();
  const report={mode,exit,supervisorError,oomKills,initialEvents,afterEvents,detachedObserved,
    descendantCgroup,hostCgroup,workerCgroup,limits:LIMITS,accounting:e.accounting,workspace:disk(root),
    elapsedInnerMs:finalSample.elapsedMs,stopReason:e.reason,kernelMemoryPeakBytes:readNumber('memory.peak'),
    prefixSha256:prefixHash,prefixBytes:prefix.length,prefixRecords:10,finalLocalMirrorSaved:true,
    technicalComplete:mode==='complete'&&exit.code===0&&!supervisorError,
    scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,solution:null,resumeAuthorized:false};
  save(path.join(root,'RESULT.json'),report);
}
if(mode==='descendant'){setInterval(()=>{},1000);}
else Promise.resolve(mode.startsWith('worker-')?worker():host()).catch(e=>{console.error(e);process.exitCode=1;});
