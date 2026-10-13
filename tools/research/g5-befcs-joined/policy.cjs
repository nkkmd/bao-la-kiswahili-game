"use strict";
const assert=require('node:assert/strict'),path=require('node:path');
const {LIMITS}=require('../g5-befcs-envelope/envelope.cjs');
const CLASS='TECHNICAL-JOINED-WORKLOAD-FIXTURE',MODES=['complete','host-oom','deadline','final-mirror-failure'];
const PARTITIONS=Object.freeze({work:536870912,control:469762048,watch:67108864}),STOP_LEAD_MS=1000;
function config(mode){return {evidenceClass:CLASS,scientificSeedsRead:0,count:128,mode,limits:{...LIMITS},partitions:{...PARTITIONS},stopLeadMs:STOP_LEAD_MS};}
function validate(c){assert.equal(c.evidenceClass,CLASS,'SCIENTIFIC-JOINED-HOST-NOT-RELEASED');assert.equal(c.scientificSeedsRead,0);assert.equal(c.count,128);assert.ok(MODES.includes(c.mode));assert.deepEqual(c.limits,LIMITS);assert.deepEqual(c.partitions,PARTITIONS);assert.equal(c.stopLeadMs,STOP_LEAD_MS);return c.mode==='deadline'?{totalMs:15000,reserveMs:10000}:{totalMs:LIMITS.maxTotalMs,reserveMs:LIMITS.finalizationReserveMs};}
function ownCgroup(unit,raw){assert.match(unit,/^bao-g5-joined-[a-f0-9]{16}\.service$/);assert.equal(raw.trim().split('\n').length,1);assert.ok(raw.startsWith('0::'));const p=raw.trim().slice(3);assert.ok(p.startsWith('/')&&!p.split('/').some(x=>x==='.'||x==='..'));assert.equal(path.posix.basename(p),unit);const root=path.resolve('/sys/fs/cgroup','.'+p);assert.ok(root.startsWith('/sys/fs/cgroup/'));return root;}
function stopBeforeSave(names,kill,save,clock){const records=[];for(const target of names){kill(target);records.push({target,atMs:clock()});}save(records);return records;}
module.exports={CLASS,MODES,PARTITIONS,LIMITS,STOP_LEAD_MS,config,validate,ownCgroup,stopBeforeSave};
