"use strict";
// cgroupへの移動をpayloadのrequire・allocationより前に行う。
const fs=require('node:fs'),cp=require('node:child_process');
const [group,role,mode,directory]=process.argv.slice(2);
const assert=require('node:assert/strict'),path=require('node:path'),{ownCgroup,MODES}=require('./policy.cjs');
assert.ok(MODES.includes(mode));assert.ok(['work','observer'].includes(role));
const root=path.dirname(group);ownCgroup(path.basename(root),'0::'+root.slice('/sys/fs/cgroup'.length));
assert.equal(group,root+'/'+(role==='work'?'work':'control'));
assert.equal(fs.readFileSync('/proc/self/cgroup','utf8').trim(),'0::'+root.slice('/sys/fs/cgroup'.length)+'/control');
fs.writeFileSync(group+'/cgroup.procs',String(process.pid));
const write=(n,x)=>{const fd=fs.openSync(directory+'/'+n,'w');try{fs.writeFileSync(fd,JSON.stringify(x)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}};
if(role==='work'){
 write('WORK_STARTED.json',{pid:process.pid,scientificSeedsRead:0});
 if(mode==='worker-oom'){fs.writeFileSync('/proc/self/oom_score_adj','1000');const blocks=[];for(;;)blocks.push(Buffer.alloc(16*1024*1024,0x51));}
 const buffers=[];for(let i=0;i<12;i++)buffers.push(Buffer.alloc(16*1024*1024,0x31));
 if(mode==='complete')setTimeout(()=>{write('WORK_DONE.json',{bytes:buffers.reduce((s,b)=>s+b.length,0),checksum:buffers.reduce((s,b)=>s+b[0]+b[b.length-1],0),scientificSeedsRead:0});process.exit(0);},700);
 else setInterval(()=>{if(buffers[0][0]!==0x31)throw Error('BUFFER-CORRUPTED');},100);
}else if(role==='observer'){
 write('OBSERVER_STARTED.json',{pid:process.pid,scientificSeedsRead:0});
 // Gitとそのfile cacheもcontrol配下。使うのは既知fixture文字列だけ。
 cp.execFileSync('git',['init','--quiet','--bare',directory+'/fixture.git']);
 if(mode==='observer-oom'){fs.writeFileSync('/proc/self/oom_score_adj','1000');const blocks=[];for(;;)blocks.push(Buffer.alloc(16*1024*1024,0x61));}
 if(mode==='deadline')for(;;)Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,100);
 const poll=setInterval(()=>{if(fs.existsSync(directory+'/WORK_DONE.json')){write('OBSERVER_DONE.json',{scientificSeedsRead:0});clearInterval(poll);}},20);
 if(mode==='worker-oom')setTimeout(()=>{clearInterval(poll);write('OBSERVER_DONE.json',{workerUnknown:true,scientificSeedsRead:0});},2000);
}else throw Error('UNKNOWN-ROLE');
