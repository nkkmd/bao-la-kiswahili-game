"use strict";
const {parentPort,workerData}=require('node:worker_threads'),path=require('node:path');
const dir=path.resolve(__dirname,'../browser/pbai-p9');
globalThis.self=globalThis;
globalThis.importScripts=(...names)=>{for(const name of names)require(path.join(dir,name));};
globalThis.addEventListener=(type,callback)=>{if(type!=='message')throw Error('Transport event');parentPort.on('message',data=>callback({data}));};
globalThis.postMessage=data=>parentPort.postMessage(data);
require(path.join(dir,workerData.actor+'-worker.js'));
