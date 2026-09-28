'use strict';
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const test=require('node:test');
const vm=require('node:vm');
const BASE='22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b';
const CANDIDATE='e9e98290d600bc342a748b80d4589473a0b5ac57';
const FILES=['engine.js','ai-weights.js','ai.js','ai-config.js','logic-evaluator.js','ai-candidate.js','ai-release.js'];
function source(commit,name){return execFileSync('git',['show',commit+':public/'+name],{encoding:'utf8'});}
function load(commit){const c=vm.createContext({performance});c.self=c;for(const name of FILES)vm.runInContext(source(commit,name),c,{filename:name});return c;}
function rng(seed){let v=seed>>>0;return()=>{v=(v+1831565813)>>>0;let z=Math.imul(v^(v>>>15),v|1);z=(z^(z+Math.imul(z^(z>>>7),z|61)))>>>0;return((z^(z>>>14))>>>0)/4294967296;};}
function stable(r){const{elapsedMs,...stats}=r.stats;return JSON.stringify(JSON.parse(JSON.stringify({move:r.move,stats})));}
function namuaState(E,seed){const random=rng(seed);let s=E.initialState();for(let p=0;p<128&&s.winner===null;p++){if(s.phase==='namua'&&p>=12)return s;const moves=E.moveVariants(s);if(!moves.length)break;s=E.applyMove(s,moves[Math.floor(random()*moves.length)]).state;}return null;}
test('pinned AI-GEN4 and C017 sources retain same fixed-depth choices before timing',()=>{const base=load(BASE),cand=load(CANDIDATE),state=namuaState(base.BaoEngine,2026092901);assert.ok(state);const level='expert',options={...base.BaoReleaseConfig.searchOptions(level,{hardwareConcurrency:4,deviceMemory:4},state),maxDepth:2,timeLimitMs:Infinity,stableBestDepths:0,aspirationWindow:0};const candidateOptions={...cand.BaoReleaseConfig.searchOptions(level,{hardwareConcurrency:4,deviceMemory:4},state),maxDepth:2,timeLimitMs:Infinity,stableBestDepths:0,aspirationWindow:0,pbaiC017ReuseSearchTransitions:true};const a=base.BaoReleaseAI.analyzeMove(state,level,rng(7),options),b=cand.BaoReleaseAI.analyzeMove(state,level,rng(7),candidateOptions);assert.equal(stable(a),stable(b));assert.equal(a.stats.completedDepth,2);assert.equal(b.stats.completedDepth,2);assert.equal(a.stats.timedOut,false);assert.equal(b.stats.timedOut,false);});
