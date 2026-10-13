"use strict";
const assert=require('node:assert/strict'),path=require('node:path');
const {LIMITS}=require('../g5-befcs-envelope/envelope.cjs');
const MODES=['complete','host-oom','disk-full','deadline','detached','final-mirror-failure'];
function validate(config){
 assert.equal(config.evidenceClass,'TECHNICAL-CONTAINED-WORKLOAD-FIXTURE','SCIENTIFIC-CONTAINED-HOST-NOT-RELEASED');
 assert.equal(config.scientificSeedsRead,0);assert.equal(config.count,128);assert.deepEqual(config.limits,LIMITS);assert.ok(MODES.includes(config.mode));
 return {totalMs:config.mode==='deadline'?15000:LIMITS.maxTotalMs,reserveMs:config.mode==='deadline'?10000:LIMITS.finalizationReserveMs};
}
function cgroupPath(id,raw){
 assert.match(id,/^[a-f0-9]{64}$/);const row=raw.trim().split('\n').find(l=>l.startsWith('0::'));assert.ok(row,'CGROUP-V2-REQUIRED');const p=row.slice(3);
 assert.ok(p.startsWith('/')&&p!=='/'&&!p.split('/').some(x=>x==='..'||x==='.')&&p.includes(id),'UNRELATED-CGROUP-REFUSED');
 const target=path.resolve('/sys/fs/cgroup','.'+p);assert.ok(target.startsWith('/sys/fs/cgroup/'));return target;
}
function phase(deadlineEpochMs,reserveMs,nowEpochMs){return nowEpochMs>=deadlineEpochMs?'TOTAL':nowEpochMs>=deadlineEpochMs-reserveMs?'FINAL':'ORDINARY';}
module.exports={LIMITS,MODES,validate,cgroupPath,phase};
