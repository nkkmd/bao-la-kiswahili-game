"use strict";
const fs=require('node:fs'),assert=require('node:assert/strict');
const directory=process.argv[2],header=JSON.parse(fs.readFileSync(directory+'/HEADER.json')),{validate,stopBeforeSave}=require('./policy.cjs');validate(header.config);
assert.equal(fs.readFileSync('/proc/self/cgroup','utf8').trim(),'0::'+header.root.slice('/sys/fs/cgroup'.length)+'/control');fs.writeFileSync(header.root+'/watch/cgroup.procs',String(process.pid));
const began=performance.now(),remaining=header.deadlineEpochMs-Date.now(),records=[],fds={};
for(const n of ['work','control'])fds[n]=fs.openSync(header.root+'/'+n+'/cgroup.kill','w');
const {atomic}=require('../g5-befcs-workload/worker.cjs');
function save(){atomic(directory+'/WATCH.json',{records,elapsedFromServiceMs:header.totalMs-remaining+performance.now()-began,scientificSeedsRead:0});}
function stop(names,reason){return stopBeforeSave(names,n=>fs.writeSync(fds[n],'1'),rows=>{records.push(...rows.map(x=>({...x,reason})));save();},()=>header.totalMs-remaining+performance.now()-began);}
const ordinary=setTimeout(()=>stop(['work'],'ORDINARY-EARLY-STOP'),Math.max(1,remaining-header.reserveMs-header.config.stopLeadMs));
const total=setTimeout(()=>{stop(['work','control'],'TOTAL-EARLY-STOP');clearInterval(poll);clearTimeout(ordinary);process.exit(0);},Math.max(1,remaining-header.config.stopLeadMs));
const poll=setInterval(()=>{
 if(header.config.mode==='host-oom'&&/^oom_kill [1-9]\d*$/m.test(fs.readFileSync(header.root+'/control/memory.events','utf8'))&&!records.some(x=>x.reason==='HOST-OOM-NO-RESUME'))stop(['work'],'HOST-OOM-NO-RESUME');
 if(fs.existsSync(directory+'/WATCH_DONE.json')){clearTimeout(ordinary);clearTimeout(total);clearInterval(poll);save();process.exit(0);}
},20);
save();atomic(directory+'/WATCH_READY.json',{pid:process.pid,cgroup:header.root+'/watch',killDescriptorsOpened:true,scientificSeedsRead:0});
