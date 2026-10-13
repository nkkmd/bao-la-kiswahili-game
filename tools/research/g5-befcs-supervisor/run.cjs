"use strict";
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {CLASS,MODES,PARTITIONS,LIMITS,validate,ownCgroup}=require('./policy.cjs');
const base=path.resolve(__dirname,'../../..'),docs='doc/research-generation-5/befcs-supervisor-20261013';
function config(mode){return {evidenceClass:CLASS,scientificSeedsRead:0,limits:{...LIMITS},partitions:{...PARTITIONS},mode};}
function write(p,x){const fd=fs.openSync(p,'w');try{fs.writeFileSync(fd,JSON.stringify(x)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}
function sample(root){const row={};for(const name of ['',...Object.keys(PARTITIONS)]){const p=root+(name?'/'+name:'');row[name||'parent']={max:fs.readFileSync(p+'/memory.max','utf8').trim(),swapMax:fs.readFileSync(p+'/memory.swap.max','utf8').trim(),peak:Number(fs.readFileSync(p+'/memory.peak','utf8')),current:Number(fs.readFileSync(p+'/memory.current','utf8')),events:fs.readFileSync(p+'/memory.events','utf8'),procs:fs.readFileSync(p+'/cgroup.procs','utf8').trim()};}return row;}
async function service(directory,mode,unit){
 validate(config(mode));assert.equal(process.env.GITHUB_ACTIONS,'true');assert.equal(process.getuid(),0);const root=ownCgroup(unit,fs.readFileSync('/proc/self/cgroup','utf8'));
 assert.equal(fs.readFileSync(root+'/memory.max','utf8').trim(),String(LIMITS.maxRssBytes));assert.equal(fs.readFileSync(root+'/memory.swap.max','utf8').trim(),'0');
 // 親のresidentをcontrolへ移してから子へのcontroller委譲を有効にする。
 fs.mkdirSync(root+'/control');fs.writeFileSync(root+'/control/cgroup.procs',String(process.pid));fs.writeFileSync(root+'/cgroup.subtree_control','+memory +pids');
 for(const [name,max]of Object.entries(PARTITIONS)){if(name!=='control')fs.mkdirSync(root+'/'+name);fs.writeFileSync(root+'/'+name+'/memory.max',String(max));fs.writeFileSync(root+'/'+name+'/memory.swap.max','0');fs.writeFileSync(root+'/'+name+'/pids.max','64');fs.writeFileSync(root+'/'+name+'/memory.oom.group','0');}
 write(directory+'/BOUNDARY.json',{root,config:config(mode),enforced:sample(root),parentResidentEmpty:fs.readFileSync(root+'/cgroup.procs','utf8').trim()==='',shortFixtureTotalMs:15000,shortFixtureOrdinaryMs:5000,scientificSeedsRead:0});
 const launch=(file,args)=>{const child=cp.spawn(process.execPath,[path.join(__dirname,file),...args],{stdio:'ignore',env:{PATH:process.env.PATH,GITHUB_ACTIONS:'true',TMPDIR:directory}});return {pid:child.pid,exit:new Promise((r,j)=>{child.once('error',j);child.once('exit',(code,signal)=>r({code,signal}));})};};
 const watch=launch('watch.cjs',[root+'/watch',root,mode,directory]);
 const worker=launch('task.cjs',[root+'/work','work',mode,directory]);
 const observer=launch('task.cjs',[root+'/control','observer',mode,directory]);
 let latest=sample(root);const timer=setInterval(()=>{latest=sample(root);write(directory+'/RESOURCE.json',latest);},50);
 write(directory+'/PIDS.json',{main:process.pid,worker:worker.pid,observer:observer.pid,watch:watch.pid});
 const workerExit=await worker.exit,observerExit=await observer.exit,watchExit=await watch.exit;
 clearInterval(timer);latest=sample(root);write(directory+'/RESOURCE.json',latest);
 write(directory+'/EXIT.json',{workerExit,observerExit,watchExit,scientificSeedsRead:0});
}
function bindings(){for(const n of ['SOURCE_MANIFEST.json','PROTECTED_INPUTS.json'])for(const [p,h]of Object.entries(JSON.parse(fs.readFileSync(path.join(base,docs,n))).files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(base,p))).digest('hex'),h,p);return true;}
function live(){
 bindings();assert.equal(process.env.GITHUB_ACTIONS,'true');const directory=path.join(base,'artifacts/local/befcs-supervisor');assert.ok(fs.existsSync(directory));const stat=fs.statfsSync(directory);assert.ok(stat.blocks*stat.bsize<=LIMITS.maxEvidenceBytes,'EXCLUSIVE-PHYSICAL-QUOTA-REQUIRED');const rows=[];
 for(const mode of MODES){const out=directory+'/'+mode;fs.mkdirSync(out);const unit='bao-g5-supervisor-'+crypto.randomBytes(8).toString('hex')+'.service';
  const result=cp.spawnSync('sudo',['systemd-run','--quiet','--wait','--unit='+unit,'--property=MemoryMax='+LIMITS.maxRssBytes,'--property=MemorySwapMax=0','--property=TasksMax=256','--property=Delegate=yes','--property=KillMode=control-group','--property=RuntimeMaxSec=25','--property=StandardOutput=null','--property=StandardError=null','--setenv=GITHUB_ACTIONS=true','--setenv=PATH='+process.env.PATH,process.execPath,__filename,'--service',out,mode,unit],{timeout:35000,maxBuffer:65536,encoding:'utf8'});
  const boundary=JSON.parse(fs.readFileSync(out+'/BOUNDARY.json')),resources=JSON.parse(fs.readFileSync(out+'/RESOURCE.json')),watch=JSON.parse(fs.readFileSync(out+'/WATCH.json'));
  assert.equal(boundary.parentResidentEmpty,true);assert.equal(resources.parent.max,String(LIMITS.maxRssBytes));assert.equal(resources.parent.swapMax,'0');
  for(const [name,max]of Object.entries(PARTITIONS)){assert.equal(resources[name].max,String(max));assert.equal(resources[name].swapMax,'0');}
  if(mode==='complete'){assert.equal(result.status,0);assert.equal(JSON.parse(fs.readFileSync(out+'/WORK_DONE.json')).checksum,1176);assert.equal(watch.records.length,0);}
  if(mode==='worker-oom')assert.ok(Number(resources.work.events.match(/^oom_kill (\d+)$/m)[1])>0);
  if(mode==='observer-oom'){assert.ok(Number(resources.control.events.match(/^oom_kill (\d+)$/m)[1])>0);assert.ok(watch.records.some(x=>x.reason==='OBSERVER-OOM-NO-RESUME'));}
  if(mode==='deadline'){assert.notEqual(result.status,0);assert.ok(watch.records.some(x=>x.reason==='TOTAL-DEADLINE'&&x.target==='control'));assert.equal(fs.existsSync(out+'/WORK_DONE.json'),false);assert.equal(fs.existsSync(out+'/OBSERVER_DONE.json'),false);}
  const row={mode,unit,systemdExit:{status:result.status,signal:result.signal,error:result.error?.message??null},boundary,resources,watch,scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,common128SourceIntegrated:false,dockerDaemonIntegrated:false,scientificHostReleased:false};write(out+'/RESULT.json',row);rows.push(row);console.error('supervisor-case',mode,'passed');
 }
 bindings();const result={decision:'SUPERVISOR-PARTITION-PRIMITIVE-PASS-INTEGRATION-PENDING',rows,scientificSeedsRead:0};write(directory+'/RESULT.json',result);console.log(JSON.stringify(result));return result;
}
if(require.main===module)Promise.resolve(process.argv[2]==='--bindings'?bindings():process.argv[2]==='--ci-live'?live():process.argv[2]==='--service'?service(process.argv[3],process.argv[4],process.argv[5]):Promise.reject(Error('TECHNICAL-MODE-REQUIRED'))).catch(e=>{console.error(e);process.exitCode=1;});
module.exports={config,bindings};
