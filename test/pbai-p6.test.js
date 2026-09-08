"use strict";
const assert=require('node:assert/strict');
const C=require('../tools/engineering/lib/pbai-p6-common.js');
const B=C.load(),H=C.load(true);
// Every Boolean function is checked against its independently written truth table.
const tables=['0000','1000','0100','1100','0010','1010','0110','1110','0001','1001','0101','1101','0011','1011','0111','1111'];
for(let g=0;g<16;g++)for(let a=0;a<2;a++)for(let b=0;b<2;b++)assert.equal((g>>((a<<1)|b))&1,Number(tables[g][2*a+b]));
const initial=B.E.initialState(),x=C.encode(initial,0);
assert.equal(x.length,399);assert.ok(x.every(v=>v===0||v===1));
const changed=JSON.parse(JSON.stringify(initial));changed.pits[0][0][0]=3;changed.pending[0]=2**31+1;
const bits=C.encode(changed,0);assert.deepEqual(bits.slice(0,10),[1,1,0,0,0,0,0,1,1,0]);
assert.equal(bits.slice(330,362).reduce((a,b,i)=>a+b*2**i,0),2**31+1);
changed.pits[0][0][0]=128;assert.throws(()=>C.encode(changed,0),/range/);
const stable=r=>{const {elapsedMs,...stats}=r.stats;return JSON.stringify({move:r.move,stats});};
for(const s of [initial, B.E.applyMove(initial,B.E.moveVariants(initial)[0]).state]) {
  const before=JSON.stringify(s);
  const a=B.A.analyzeMove(s,'hard',()=>0,C.options(2,Infinity));
  const off=H.A.analyzeMove(s,'hard',()=>0,C.options(2,Infinity));
  const on=H.A.analyzeMove(s,'hard',()=>0,C.options(2,Infinity,(s,p)=>H.fast.evaluate(s,p)));
  assert.equal(stable(a),stable(off));assert.equal(stable(a),stable(on));assert.equal(JSON.stringify(s),before);
}
// A synthetic export exercises all gate IDs, all three layers and negative coefficients.
const model={kind:'logic',inputSize:399,layers:Array.from({length:3},(_,l)=>({a:Array.from({length:512},(_,i)=>i%(l?911:399)),b:Array.from({length:512},(_,i)=>(i+17)%(l?911:399)),gates:Array.from({length:512},(_,i)=>i%16)})),weights:Array.from({length:512},(_,i)=>i%2?-17:23),bias:-15};
const M=C.compile(model);for(const p of [0,1])assert.equal(M.raw(C.encode(initial,p)),C.referenceLogic(model,C.encode(initial,p)));
assert.equal(M.evaluate(initial,0),-M.evaluate(initial,1));
const terminal={...initial,winner:0};assert.equal(M.evaluate(terminal,0),1000000);assert.equal(M.evaluate(terminal,1),-1000000);
console.log('PBAI-P6 technical tests passed');
