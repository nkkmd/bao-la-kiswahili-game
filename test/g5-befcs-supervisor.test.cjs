"use strict";
const test=require('node:test'),assert=require('node:assert/strict');
const {CLASS,LIMITS,PARTITIONS,validate,ownCgroup}=require('../tools/research/g5-befcs-supervisor/policy.cjs');
const c={evidenceClass:CLASS,scientificSeedsRead:0,mode:'complete',limits:{...LIMITS},partitions:{...PARTITIONS}};
test('科学入力と固定上限の変更を拒否する',()=>{for(const x of [{...c,evidenceClass:'BEFCS-STUDY1'},{...c,scientificSeedsRead:1},{...c,limits:{...LIMITS,maxRssBytes:LIMITS.maxRssBytes+1}},{...c,partitions:{...PARTITIONS,watch:PARTITIONS.watch+1}}])assert.throws(()=>validate(x));assert.equal(validate(c),c);});
test('全子区画の上限合計は提案1 GiBと同一',()=>{assert.equal(Object.values(PARTITIONS).reduce((a,b)=>a+b),1073741824);assert.equal(LIMITS.maxTotalMs,1200000);assert.equal(LIMITS.maxEvidenceBytes,268435456);});
test('委譲された自分のcase serviceだけを操作する',()=>{const unit='bao-g5-supervisor-0123456789abcdef.service';assert.equal(ownCgroup(unit,'0::/system.slice/'+unit+'\n'),'/sys/fs/cgroup/system.slice/'+unit);for(const raw of ['0::/','0::/system.slice/other.service','0::/../'+unit,'1:memory:/'+unit,'0::/system.slice/'+unit+'\n1:cpu:/x'])assert.throws(()=>ownCgroup(unit,raw));assert.throws(()=>ownCgroup('docker.service','0::/system.slice/docker.service'));});
