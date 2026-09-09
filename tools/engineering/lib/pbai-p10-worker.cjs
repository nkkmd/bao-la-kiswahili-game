"use strict";
const {parentPort,workerData}=require('node:worker_threads'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=path.resolve(__dirname,'../../../public');
const transform=require('./pbai-p10-adapter.cjs');
const ctx=vm.createContext({performance});ctx.self=ctx;
ctx.importScripts=(...names)=>{for(const name of names){let text=fs.readFileSync(path.join(dir,name),'utf8');if(name.endsWith('ai-release.js')&&workerData.actor==='logic')text=transform(text);vm.runInContext(text,ctx,{filename:name});}};
ctx.addEventListener=(type,cb)=>parentPort.on('message',data=>{ctx.random=()=>{let a=ctx.seed;ctx.seed=(a+0x6D2B79F5)>>>0;let t=ctx.seed;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};ctx.seed=data.seed;vm.runInContext('Math.random=random',ctx);cb({data});});
ctx.postMessage=data=>parentPort.postMessage({...data,workerMemory:process.memoryUsage()});
ctx.importScripts('ai-release-worker.js');
