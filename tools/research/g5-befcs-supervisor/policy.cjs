"use strict";
const assert=require('node:assert/strict'),path=require('node:path');
const {LIMITS}=require('../g5-befcs-envelope/envelope.cjs');
const CLASS='TECHNICAL-SUPERVISOR-CGROUP-FIXTURE';
const MODES=['complete','worker-oom','observer-oom','deadline'];
const PARTITIONS=Object.freeze({work:805306368,control:201326592,watch:67108864});
function validate(c){assert.equal(c.evidenceClass,CLASS,'SCIENTIFIC-SUPERVISOR-NOT-RELEASED');assert.equal(c.scientificSeedsRead,0);assert.deepEqual(c.limits,LIMITS);assert.deepEqual(c.partitions,PARTITIONS);assert.ok(MODES.includes(c.mode));assert.equal(Object.values(PARTITIONS).reduce((a,b)=>a+b),LIMITS.maxRssBytes);return c;}
function ownCgroup(unit,raw){assert.match(unit,/^bao-g5-supervisor-[a-f0-9]{16}\.service$/);assert.equal(raw.trim().split('\n').length,1);const prefix='0::';assert.ok(raw.startsWith(prefix));const p=raw.trim().slice(prefix.length);assert.ok(p.startsWith('/')&&!p.split('/').some(x=>x==='.'||x==='..'));assert.equal(path.posix.basename(p),unit);const root=path.resolve('/sys/fs/cgroup','.'+p);assert.ok(root.startsWith('/sys/fs/cgroup/'));return root;}
module.exports={CLASS,MODES,PARTITIONS,LIMITS,validate,ownCgroup};
