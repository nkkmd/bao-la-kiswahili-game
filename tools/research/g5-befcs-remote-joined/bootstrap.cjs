"use strict";
const path=require('node:path');
const worker=path.resolve(__dirname,'../g5-befcs-pipeline/worker.cjs');
if(process.argv[1]===worker){
 require('../g5-befcs-joined/bootstrap.cjs');
 for(const name of Object.keys(process.env))if(name==='BEFCS_GIT_TOKEN'||name==='GITHUB_TOKEN'||name.startsWith('GIT_CONFIG_'))delete process.env[name];
 const fs=require('node:fs'),c=JSON.parse(fs.readFileSync(process.argv[2]));
 require('../g5-befcs-workload/worker.cjs').atomic(path.dirname(c.control)+'/WORKER_CREDENTIALS.json',{beforeWorkerModule:true,credentialsRemoved:true,scientificSeedsRead:0});
}
