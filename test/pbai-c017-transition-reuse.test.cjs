'use strict';
const assert=require('node:assert/strict');
const test=require('node:test');
const E=require('../../public/engine.js');
function rng(seed){let v=seed>>>0;return()=>{v=(v+1831565813)>>>0;let z=Math.imul(v^(v>>>15),v|1);z=(z^(z+Math.imul(z^(z>>>7),z|61)))>>>0;return((z^(z>>>14))>>>0)/4294967296;};}
function meaning(events){return events.map(({state,...e})=>e);}
function sample(seed){const random=rng(seed);let s=E.initialState();for(let p=0;p<128&&s.winner===null;p++){if(s.phase==='namua'&&p>=12)return s;const vs=E.moveVariants(s);if(!vs.length)break;s=E.applyMove(s,vs[Math.floor(random()*vs.length)]).state;}return null;}
test('PBAI-C017 cache preserves Namua variant order, after-states, and event meaning',()=>{let checked=0;for(const seed of[2026092901,2026092907,2026092913,2026092941,2026092964]){const s=sample(seed);if(!s)continue;const expected=E.moveVariants(s),entries=E.moveVariantsWithTransitionsForSearch(s);assert.deepEqual(JSON.parse(JSON.stringify(entries.map(x=>x.move))),JSON.parse(JSON.stringify(expected)));for(const x of entries)if(x.transition){checked++;const y=E.applyMove(s,x.move);assert.deepEqual(JSON.parse(JSON.stringify(x.transition.state)),JSON.parse(JSON.stringify(y.state)));assert.deepEqual(meaning(JSON.parse(JSON.stringify(x.transition.events))),meaning(JSON.parse(JSON.stringify(y.events))));}}assert.ok(checked>0);});
test('PBAI-C017 leaves non-Namua-capture transitions uncomputed',()=>{const entries=E.moveVariantsWithTransitionsForSearch(E.initialState());assert.ok(entries.length>0);assert.ok(entries.every(x=>x.transition===null));});
