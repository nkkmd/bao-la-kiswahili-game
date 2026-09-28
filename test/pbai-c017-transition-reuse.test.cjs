'use strict';
const assert=require('node:assert/strict');
const test=require('node:test');
const E=require('../public/engine.js');
require('../public/ai-weights.js');
const AI=require('../public/ai-candidate.js');
function rng(seed){let v=seed>>>0;return()=>{v=(v+1831565813)>>>0;let z=Math.imul(v^(v>>>15),v|1);z=(z^(z+Math.imul(z^(z>>>7),z|61)))>>>0;return((z^(z>>>14))>>>0)/4294967296;};}
function clone(x){return JSON.parse(JSON.stringify(x));}
function sample(seed){const random=rng(seed);let s=E.initialState();for(let p=0;p<128&&s.winner===null;p++){if(s.phase==='namua'&&p>=12)return s;const vs=E.moveVariants(s);if(!vs.length)break;s=E.applyMove(s,vs[Math.floor(random()*vs.length)]).state;}return null;}
function stable(r){const{elapsedMs,...stats}=r.stats;return{move:r.move,stats};}
test('PBAI-C017 flag preserves fixed-depth search output on Namua sample',()=>{const state=sample(2026092901);assert.ok(state);const before=clone(state),options={maxDepth:3,timeLimitMs:Infinity,stableBestDepths:0,aspirationWindow:0};const baseline=AI.analyzeMove(state,'expert',rng(2026092901),options);const candidate=AI.analyzeMove(state,'expert',rng(2026092901),{...options,pbaiC017ReuseSearchTransitions:true});assert.deepEqual(stable(candidate),stable(baseline));assert.deepEqual(clone(state),before);assert.equal(candidate.stats.completedDepth,3);assert.equal(candidate.stats.timedOut,false);});
test('PBAI-C017 flag is opt-in and leaves current AI release assets intact',()=>{assert.equal(typeof AI.analyzeMove,'function');assert.equal(E.moveVariantsWithTransitionsForSearch,undefined);});
