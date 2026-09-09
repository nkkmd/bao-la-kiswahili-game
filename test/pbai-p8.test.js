"use strict";
const assert=require('node:assert/strict');
const C=require('../tools/engineering/lib/pbai-p8-common.js'),O=require('../tools/engineering/lib/pbai-p7-compiler.js');
for(let g=0;g<16;g++)for(let a=0;a<2;a++)for(let b=0;b<2;b++) {
 const fn=new Function('a','b','return '+O.expression(g,'a','b'));
 assert.equal(fn(a,b),Math.floor(g/2**(2*a+b))%2);
}
const model=C.model(),optimized=O.compile(model),previous=C.compile(model),random=C.rng(C.SPEC.technicalBooleanSeed);
for(let n=0;n<C.SPEC.technicalBooleanVectors;n++) {
 const x=Array.from({length:399},()=>Number(random()>=.5));
 assert.equal(optimized.rawBits(x),C.referenceLogic(model,x));
}
const B=C.load(true),fixtures=[B.E.initialState(),...require('./tactical.test.js').tacticalCases.map(t=>t.position)];
for(const s of fixtures)for(const p of [0,1]) {
 const before=JSON.stringify(s);
 assert.equal(optimized.raw(s,p),previous.raw(C.encode(s,p)));
 assert.equal(optimized.evaluate(s,p),previous.evaluate(s,p));assert.equal(JSON.stringify(s),before);
}
const stable=a=>{const {elapsedMs,...stats}=a.stats;return JSON.stringify({move:a.move,stats});};
for(const s of fixtures.slice(0,3)) {
 const a=B.A.analyzeMove(s,'hard',()=>0,C.options(2,Infinity,previous.evaluate));
 const b=B.A.analyzeMove(s,'hard',()=>0,C.options(2,Infinity,optimized.evaluate));
 assert.equal(stable(a),stable(b));
}
const bad=B.E.initialState();bad.pending[0]=4294967296;assert.throws(()=>optimized.evaluate(bad,0),/range/);
const edge=B.E.initialState();edge.pending=[2147483649,4294967295];edge.pits[0][0][0]=127;
for(const p of [0,1])assert.equal(optimized.evaluate(edge,p),previous.evaluate(edge,p));
const negative=structuredClone(model);negative.bias+=4096;const wrong=O.compile(negative);
assert.notEqual(wrong.rawBits(Array(399).fill(0)),optimized.rawBits(Array(399).fill(0)));
const zero=structuredClone(model);zero.weights.fill(0);zero.bias=0;const z=O.compile(zero);
assert.equal(z.graph.nodes.length,0);assert.equal(z.evaluate(B.E.initialState(),0),0);
const {equalSavedNumber}=require('../tools/engineering/lib/pbai-p8-json-number.js');
for(const n of [0,-0,1,-1,0.5,-0.5,Number.MIN_VALUE,-Number.MIN_VALUE,Number.MAX_SAFE_INTEGER])equalSavedNumber(JSON.parse(JSON.stringify(n)),n);
for(const [a,b] of [[0,1],[0,Number.MIN_VALUE],[1,1+Number.EPSILON],[NaN,NaN],[Infinity,Infinity],[-Infinity,-Infinity],[null,0],['0',0],[undefined,0]])assert.throws(()=>equalSavedNumber(a,b));
const jsonFixtures=C.read(require('node:path').join(C.DOC,'JSON_ZERO_FIXTURES.json')).rows;
assert.equal(jsonFixtures.length,1);
for(const r of jsonFixtures){const n=optimized.evaluate(r.state,r.state.player);assert.ok(Object.is(n,-0));assert.equal(Object.is(JSON.parse(JSON.stringify(n)),-0),false);assert.throws(()=>assert.equal(r.storedScore,n));equalSavedNumber(r.storedScore,n);equalSavedNumber(JSON.parse(JSON.stringify({n})).n,n);}
console.log(JSON.stringify({passed:true,booleanVectors:4096,truthTables:16,fixtures:fixtures.length,compiler:optimized.stats,negativeControl:'detected',jsonNegativeZeroFixtures:jsonFixtures.length,nonzeroMismatchRejected:true,nonfiniteRejected:true}));
