"use strict";
// 既存workerのmodule/source/PRNG初期化前に同じ親配下のworkへ移す。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const worker=path.resolve(__dirname,'../g5-befcs-pipeline/worker.cjs');
if(process.argv[1]===worker){
 const c=JSON.parse(fs.readFileSync(process.argv[2]));assert.equal(c.evidenceClass,'TECHNICAL-PIPELINE-FIXTURE');assert.equal(c.scientificSeedsRead,0);assert.equal(c.count,128);
 const root=process.env.BEFCS_JOINED_ROOT;assert.ok(root);require('./policy.cjs').ownCgroup(path.basename(root),'0::'+root.slice('/sys/fs/cgroup'.length));
 assert.equal(fs.readFileSync('/proc/self/cgroup','utf8').trim(),'0::'+root.slice('/sys/fs/cgroup'.length)+'/control');fs.writeFileSync(root+'/work/cgroup.procs',String(process.pid));
 const {atomic}=require('../g5-befcs-workload/worker.cjs');atomic(path.dirname(c.control)+'/WORKER_BOUNDARY.json',{pid:process.pid,cgroup:fs.readFileSync('/proc/self/cgroup','utf8'),beforeWorkerModule:true,scientificSeedsRead:0});
}
