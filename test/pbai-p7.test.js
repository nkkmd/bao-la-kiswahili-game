"use strict";
const assert=require('node:assert/strict');
const C=require('../tools/engineering/lib/pbai-p7-common.js'),O=require('../tools/engineering/lib/pbai-p7-compiler.js');
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
console.log(JSON.stringify({passed:true,booleanVectors:4096,truthTables:16,fixtures:fixtures.length,compiler:optimized.stats,negativeControl:'detected'}));
