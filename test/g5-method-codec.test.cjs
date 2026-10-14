"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),A=require("../tools/research/g5-method/raw-codec.cjs"),B=require("../tools/research/g5-method/independent-raw-codec.cjs"),F=require("../tools/research/g5-01/transition/fixtures.cjs"),M=require("../tools/research/g5-01/measurement.cjs");
test("全17takasia codeと数値境界を独立二codecで可逆保存する",()=>{
 for(const amount of [0,64])for(let t=0;t<17;t++)for(const winner of [null,0,1]){const s=F.blank();s.pits=s.pits.map(rows=>rows.map(row=>row.map(()=>amount)));s.reserve=[amount,amount];s.pending=[amount,amount];s.houseOwned=[true,false];s.player=1;s.winner=winner;s.takasia=t===0?null:{player:Math.floor((t-1)/8),index:(t-1)%8};const a=A.encodeRaw(s),b=B.encodeRaw(s);assert.deepEqual(a,b);assert.equal(a.length,33);assert.deepEqual(A.decodeRaw(a),M.raw(s));assert.deepEqual(B.decodeRaw(b),M.raw(s));assert.equal(M.rawKey(A.decodeRaw(a)),M.rawKey(s));}
});
test("範囲外・未知winner・takasia未知field・配列形をclampせず棄却する",()=>{
 for(const change of [s=>s.pits[0][0][0]=65,s=>s.pending[0]=-1,s=>s.winner='DRAW',s=>s.takasia={player:0,index:1,extra:1},s=>s.reserve.push(0),s=>s.ruleRevision='other-rule']){const s=F.blank();change(s);assert.throws(()=>A.encodeRaw(s));assert.throws(()=>B.encodeRaw(s));}
});
test("paddingや予約codeの改変を棄却する",()=>{
 const raw=A.encodeRaw(F.blank()),padding=Buffer.from(raw);padding[32]|=128;assert.throws(()=>A.decodeRaw(padding));assert.throws(()=>B.decodeRaw(padding));
 const invalid=Buffer.from(raw);invalid[0]=127;assert.throws(()=>A.decodeRaw(invalid));assert.throws(()=>B.decodeRaw(invalid));
 const winner=Buffer.from(raw);winner[32]|=3;assert.throws(()=>A.decodeRaw(winner));assert.throws(()=>B.decodeRaw(winner));
 const target=Buffer.from(raw);target[32]|=17<<2;assert.throws(()=>A.decodeRaw(target));assert.throws(()=>B.decodeRaw(target));
 assert.throws(()=>A.decodeRaw(Array(33).fill(0)));assert.throws(()=>B.decodeRaw(Array(33).fill(0)));
});
test("reason/turnはRAW codecの対象外で、勝敗labelを自然終局と認証しない",()=>{
 const s=F.blank();s.reason='relay-limit';s.winner=1;s.turn=20;const r=A.decodeRaw(A.encodeRaw(s));assert.equal(r.reason,undefined);assert.equal(r.turn,undefined);assert.equal(r.winner,1);assert.deepEqual(r,M.raw(s));
});
