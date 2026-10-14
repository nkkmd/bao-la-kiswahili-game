"use strict";
// 隔離されたobserver process groupと、そのcaseのcontainerだけを停止する。
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {cgroupPath}=require('./policy.cjs');
const directory=path.resolve(process.argv[2]),header=JSON.parse(fs.readFileSync(directory+'/HEADER.json'));
assert.equal(header.evidenceClass,'TECHNICAL-CONTAINED-WORKLOAD-FIXTURE');assert.ok(Number.isInteger(header.observerPid)&&header.observerPid>1);
const stat=fs.readFileSync('/proc/'+header.observerPid+'/stat','utf8').split(') ')[1].split(' ');assert.equal(Number(stat[2]),header.observerPid,'OBSERVER-MUST-HAVE-OWN-PROCESS-GROUP');
const began=performance.now(),remaining=Math.max(1,header.deadlineEpochMs-Date.now()),records=[];
function save(){const fd=fs.openSync(directory+'/WATCHDOG.json','w');try{fs.writeFileSync(fd,JSON.stringify({records,elapsedMs:performance.now()-began,scientificSeedsRead:0})+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}
function killContainer(phase){
 let method=null,error=null;
 try{const target=JSON.parse(fs.readFileSync(directory+'/TARGET.json'));assert.equal(cgroupPath(target.id,target.rawCgroup),target.cgroupPath);fs.writeFileSync(target.cgroupPath+'/cgroup.kill','1');method='KERNEL-CGROUP-KILL';}
 catch(e){error=e.message;if(e.code==='ENOENT')method='ALREADY-STOPPED-OR-TARGET-NOT-AVAILABLE';}
 records.push({phase,method,error,atMs:performance.now()-began});save();
}
const ordinary=setTimeout(()=>killContainer('ORDINARY-DEADLINE'),Math.max(1,remaining-header.reserveMs));
const total=setTimeout(()=>{killContainer('TOTAL-DEADLINE');try{process.kill(-header.observerPid,'SIGKILL');}catch(e){if(e.code!=='ESRCH')throw e;}clearInterval(poll);clearTimeout(ordinary);save();process.exit(0);},remaining);
const poll=setInterval(()=>{if(fs.existsSync(directory+'/WATCHDOG_DONE.json')){clearTimeout(ordinary);clearTimeout(total);clearInterval(poll);save();process.exit(0);}},20);
