"use strict";
const {Worker}=require('node:worker_threads'),{performance}=require('node:perf_hooks'),path=require('node:path');
function search(actor,state,seed,options,deadlineMs=10000){
 if(!['logic','baseline'].includes(actor))throw Error('Actor');
 return new Promise((resolve,reject)=>{
  const started=performance.now();
  const worker=new Worker(path.join(__dirname,'pbai-p11-worker.cjs'),{workerData:{actor},resourceLimits:{maxOldGenerationSizeMb:256}});
  let done=false;
  const finish=async(error,data)=>{if(done)return;done=true;clearTimeout(timer);const wallTimeMs=performance.now()-started;await worker.terminate();if(error)reject(error);else resolve({...data,wallTimeMs});};
  const timer=setTimeout(()=>finish(Error('Worker request deadline')),deadlineMs);
  worker.on('error',e=>finish(e));worker.on('exit',code=>{if(!done)finish(Error('Worker exited: '+code));});
  worker.once('message',data=>finish(data.type==='error'?Error(data.message):null,data));
  worker.postMessage({type:'search',id:seed,seed,state,level:'expert',options:{...options,pbaiC015LogicGate:actor==='logic'}});
 });
}
module.exports={search};
