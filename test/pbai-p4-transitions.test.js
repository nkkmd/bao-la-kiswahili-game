"use strict";
const assert=require("node:assert/strict"),vm=require("node:vm"),fs=require("node:fs"),path=require("node:path");
const {Worker,isMainThread,parentPort}=require("node:worker_threads");
const flag="pbaiC011LightweightTransitions";
if(!isMainThread){
 globalThis.self=globalThis;self.addEventListener=(type,listener)=>parentPort.on("message",data=>listener({data}));
 self.postMessage=x=>parentPort.postMessage(x);
 globalThis.importScripts=(...files)=>files.forEach(f=>require(path.resolve(__dirname,"../public",f)));
 require("../public/ai-worker.js");
}else{
 const E=require("../public/engine.js"),A=require("../public/ai.js");
 function clean(a){const {elapsedMs,...stats}=a.stats;return {move:a.move,stats};}
 const opts={maxDepth:2,timeLimitMs:Infinity};
 // Script globals without require/module reproduce the fallback loading contract.
 const ctx=vm.createContext({performance,console});ctx.window=ctx;
 for(const f of ["engine.js","ai-weights.js","ai.js"])vm.runInContext(fs.readFileSync(path.join(__dirname,"../public",f),"utf8"),ctx);
 const s=E.initialState();
 for(const on of [false,true]){
  const result=ctx.BaoAI.analyzeMove(s,"hard",()=>.5,{...opts,[flag]:on});
  assert.deepEqual(JSON.parse(JSON.stringify(clean(result))),JSON.parse(JSON.stringify(clean(A.analyzeMove(s,"hard",()=>.5,opts)))));
 }
 for(const [level,extra] of [["easy",{}],["normal",{}],["hard",{searchProfile:"legacy"}],["hard",{evaluationProfile:"bao-v2"}],["hard",{searchProfile:"mcts",mctsIterations:2}]]){
  const off=A.analyzeMove(s,level,()=>.5,{...opts,...extra});const on=A.analyzeMove(s,level,()=>.5,{...opts,...extra,[flag]:true});assert.deepEqual(clean(on),clean(off));
 }
 const m=E.moveVariants(s)[0],full=E.applyMove(s,m),compact=E.applyMoveForSearch(s,m);
 assert.deepEqual(full.state,compact.state);assert(full.events.every(e=>e.state));assert(compact.events.every(e=>!Object.hasOwn(e,"state")));
 const json=JSON.stringify(full);A.analyzeMove(s,"hard",()=>.5,{...opts,[flag]:true});assert.equal(JSON.stringify(E.applyMove(s,m)),json);
 (async()=>{
  const worker=new Worker(__filename);let ticks=0;const timer=setInterval(()=>ticks++,5);
  try{for(const on of [true,false,true]){
   const message={type:"search",id:Number(on),state:s,level:"hard",options:{...opts,[flag]:on}};
   const result=await new Promise((resolve,reject)=>{worker.once("message",resolve);worker.once("error",reject);worker.postMessage(message);});
   assert.equal(result.type,"result");assert.deepEqual(clean(result),clean(A.analyzeMove(s,"hard",()=>.5,opts)));
  }
  const cancel=new Worker(__filename);let delivered=false;cancel.on("message",()=>delivered=true);cancel.postMessage({type:"search",id:5,state:s,level:"expert",options:{maxDepth:30,timeLimitMs:2000,[flag]:true}});
  await new Promise(r=>setTimeout(r,20));await cancel.terminate();assert(!delivered);
  assert(ticks>0);console.log("PBAI-P4 global-script / Worker / feature boundaries passed");
  }finally{clearInterval(timer);await worker.terminate();}
 })().catch(e=>{console.error(e);process.exitCode=1;});
}
