"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const ROOT = path.resolve(__dirname, "../../..");
const BASE = "548ccead3965fa98602d99c8b3e2a49fbeeed093";
const DOC = path.join(ROOT,"doc/ai-engineering/public-ai-improvement-program-4");
const OUT = path.join(ROOT,"artifacts/pbai-p4");
const sha = x => crypto.createHash("sha256").update(typeof x === "string" || Buffer.isBuffer(x) ? x : JSON.stringify(x)).digest("hex");
function baseline() {
  const dir = path.join(ROOT,"artifacts/local/pbai-p4-baseline");
  fs.mkdirSync(dir,{recursive:true});
  for(const name of ["engine.js","ai.js","ai-weights.js","ai-config.js","ai-worker.js"]){
    const text = cp.execFileSync("git",["show",`${BASE}:public/${name}`],{cwd:ROOT});
    const file=path.join(dir,name);
    if(!fs.existsSync(file))fs.writeFileSync(file,text,{flag:"wx"});
    if(sha(fs.readFileSync(file))!==sha(text))throw Error("Baseline identity mismatch");
  }
  // These modules consult globals before require; load each matched set together.
  delete globalThis.BaoEngine; delete globalThis.BaoAI; delete globalThis.BaoAIWeights;
  const E=require(path.join(dir,"engine.js")); globalThis.BaoEngine=E;
  const W=require(path.join(dir,"ai-weights.js")); globalThis.BaoAIWeights=W;
  const A=require(path.join(dir,"ai.js"));
  return {E,A,dir};
}
function candidate(){
  delete globalThis.BaoEngine; delete globalThis.BaoAI; delete globalThis.BaoAIWeights;
  const E=require(path.join(ROOT,"public/engine.js")); globalThis.BaoEngine=E;
  globalThis.BaoAIWeights=require(path.join(ROOT,"public/ai-weights.js"));
  return {E,A:require(path.join(ROOT,"public/ai.js"))};
}
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function raw(s){return sha([s.pits,s.reserve,s.houseOwned,s.player,s.phase,s.winner,s.pending]);}
function write(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n",{flag:"wx"});}
module.exports={ROOT,BASE,DOC,OUT,sha,baseline,candidate,rng,raw,write};
