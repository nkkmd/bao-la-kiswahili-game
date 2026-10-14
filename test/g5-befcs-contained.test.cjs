"use strict";
const test=require('node:test'),assert=require('node:assert/strict');
const {LIMITS,validate,cgroupPath,phase}=require('../tools/research/g5-befcs-contained/policy.cjs');
const config=mode=>({evidenceClass:'TECHNICAL-CONTAINED-WORKLOAD-FIXTURE',scientificSeedsRead:0,count:128,mode,limits:{...LIMITS}});
test('科学分類・科学seed消費・source数変更・上限変更を副作用前に拒否する',()=>{
 for(const c of [{...config('complete'),evidenceClass:'BEFCS-SCIENTIFIC-PIPELINE'},{...config('complete'),scientificSeedsRead:1},{...config('complete'),count:129},{...config('complete'),limits:{...LIMITS,maxEvidenceBytes:268435457}}])assert.throws(()=>validate(c));
});
test('通常20分/終了180秒と短縮fixtureを区別する',()=>{assert.deepEqual(validate(config('complete')),{totalMs:1200000,reserveMs:180000});assert.deepEqual(validate(config('deadline')),{totalMs:15000,reserveMs:10000});});
test('kernel停止対象はcase固有のcgroup v2だけに限定する',()=>{const id='a'.repeat(64);assert.equal(cgroupPath(id,'0::/system.slice/docker-'+id+'.scope\n'),'/sys/fs/cgroup/system.slice/docker-'+id+'.scope');for(const s of ['0::/','0::/system.slice/unrelated.scope','0::/../'+id,'1:memory:/docker/'+id])assert.throws(()=>cgroupPath(id,s));});
test('同じdeadlineの通常・終了・全体境界を判定する',()=>{assert.equal(phase(1200000,180000,1019999),'ORDINARY');assert.equal(phase(1200000,180000,1020000),'FINAL');assert.equal(phase(1200000,180000,1200000),'TOTAL');});
test('外部observerの全体停止fixtureも科学上限を変更せず別枠にする',()=>{assert.deepEqual(validate(config('observer-timeout')),{totalMs:15000,reserveMs:10000});assert.deepEqual(config('observer-timeout').limits,LIMITS);});
