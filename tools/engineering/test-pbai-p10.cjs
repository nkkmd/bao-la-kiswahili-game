'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {search}=require('./lib/pbai-p10-search');
const transform=require('./lib/pbai-p10-adapter.cjs');
const fixtures=require('./browser/pbai-p9/fixtures.json').rows;
const C=require('./lib/pbai-p10-common');
function load(actor,missing=null){const ctx=vm.createContext({performance});for(const name of ['engine.js','ai-weights.js','ai.js','ai-config.js','logic-evaluator.js','ai-candidate.js','ai-release.js']){if(name===missing)continue;let text=fs.readFileSync(path.join(C.ROOT,'public',name),'utf8');if(name==='ai-release.js'&&actor==='logic')text=transform(text);vm.runInContext(text,ctx);}return ctx;}
const stable=r=>{const {elapsedMs,evaluationCandidate,evaluationFallback,...stats}=r.stats;return JSON.stringify({move:r.move,stats});};
(async()=>{const results=[];
 assert.throws(()=>transform('unexpected'));
 for(const actor of ['baseline','logic'])for(const f of fixtures){
  const ctx=load(actor),options={...C.options(2,Infinity),pbaiC015LogicGate:actor==='logic'};
  const direct=ctx.BaoReleaseAI.analyzeMove(f.state,'expert',C.rng(f.seed),options);
  const reference=(actor==='logic'?ctx.BaoCandidateAI:ctx.BaoAI).analyzeMove(f.state,'expert',C.rng(f.seed),options);
  const worker=await search(actor,f.state,f.seed,options);
  assert.equal(worker.type,'result');assert.equal(stable(direct),stable(reference));assert.equal(stable(worker),stable(direct));
  assert.ok(ctx.BaoEngine.moveVariants(f.state).some(m=>ctx.BaoAI.moveKey(m)===ctx.BaoAI.moveKey(direct.move)));results.push({actor,fixture:f.id||f.seed,kind:'fixed-depth-equivalence'});
 }
 const on=load('logic'),off=load('baseline');
 for(const level of ['easy','normal','hard']){assert.equal(JSON.stringify(on.BaoReleaseConfig.searchOptions(level)),JSON.stringify(off.BaoReleaseConfig.searchOptions(level)));for(const f of fixtures){const o={...on.BaoReleaseConfig.searchOptions(level),maxDepth:2,timeLimitMs:Infinity};assert.equal(stable(on.BaoReleaseAI.analyzeMove(f.state,level,C.rng(f.seed),o)),stable(off.BaoReleaseAI.analyzeMove(f.state,level,C.rng(f.seed),o)));}}
 for(const missing of ['logic-evaluator.js','ai-candidate.js']){const ctx=load('logic',missing),o={...C.options(2,Infinity),pbaiC015LogicGate:true},f=fixtures[0];const a=ctx.BaoReleaseAI.analyzeMove(f.state,'expert',C.rng(f.seed),o);assert.equal(a.stats.evaluationFallback,true);assert.equal(stable(a),stable(ctx.BaoAI.analyzeMove(f.state,'expert',C.rng(f.seed),o)));}
 for(const extra of [{evaluationProfile:'legacy'},{evaluationProfile:'bao-v2'},{searchProfile:'legacy'},{evaluationAdjustments:{}}]){const ctx=load('logic');ctx.BaoLogicGate.evaluate=()=>{throw Error('Outside scope')};ctx.BaoReleaseAI.analyzeMove(fixtures[0].state,'expert',C.rng(1),{...C.options(1,10),pbaiC015LogicGate:true,...extra});}
 for(const [tier,cfg] of Object.entries(C.SPEC.matches).filter(([k])=>k!=='pilot'))for(const actor of ['baseline','logic'])for(const f of fixtures){const r=await search(actor,f.state,f.seed,C.options(cfg.maxDepth,cfg.timeLimitMs));assert.equal(r.type,'result');assert.equal(r.stats.allocatedTimeMs,cfg.timeLimitMs);assert.ok(r.stats.completedDepth<=cfg.maxDepth);assert.ok(r.wallTimeMs<cfg.timeLimitMs+500);if(actor==='logic'){assert.equal(r.stats.evaluationCandidate,'PBAI-C015-v1');assert.equal(r.stats.evaluationFallback,false);}results.push({tier,actor,kind:'known-actual-budget',elapsedMs:r.wallTimeMs,memory:r.workerMemory});}
 const result={passed:true,knownOnly:true,timedMatchSeedsConsumed:false,physicalDeviceVerified:false,results};
 fs.mkdirSync('artifacts/local/pbai-p10',{recursive:true});fs.writeFileSync('artifacts/local/pbai-p10/preparation.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({passed:true,checks:results.length}));
})().catch(e=>{console.error(e);process.exitCode=1});
