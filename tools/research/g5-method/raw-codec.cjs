"use strict";
const assert=require("node:assert/strict"),RULE="BAO-RULES-V0.2.0-TAKASIA-001";
function pair(a){assert.ok(Array.isArray(a)&&a.length===2);}
function values(s) {
 if(s.ruleRevision!==undefined)assert.equal(s.ruleRevision,RULE);
 pair(s.pits);for(const rows of s.pits){pair(rows);for(const row of rows)assert.ok(Array.isArray(row)&&row.length===8);}
 pair(s.reserve);pair(s.pending);pair(s.houseOwned);
 const v=[...s.pits.flat(2),...s.reserve,...s.pending];v.forEach(n=>assert.ok(Number.isInteger(n)&&n>=0&&n<=64));
 s.houseOwned.forEach(b=>assert.equal(typeof b,"boolean"));assert.ok([0,1].includes(s.player));assert.ok(["namua","mtaji"].includes(s.phase));assert.ok(s.winner===null||s.winner===0||s.winner===1);
 const t=s.takasia??null;if(t!==null){assert.deepEqual(Object.keys(t).sort(),["index","player"]);assert.ok([0,1].includes(t.player));assert.ok(Number.isInteger(t.index)&&t.index>=0&&t.index<8);}
 return [...v,...s.houseOwned.map(Number),s.player,s.phase==="mtaji"?1:0,s.winner===null?0:s.winner+1,t===null?0:1+8*t.player+t.index];
}
const widths=[...Array(36).fill(7),1,1,1,1,2,5];
function encodeRaw(s) {
 const data=values(s),bytes=Buffer.alloc(33);let at=0;
 data.forEach((v,i)=>{for(let k=0;k<widths[i];k++,at++)bytes[at>>>3]|=((v>>>k)&1)<<(at&7);});assert.equal(at,263);return bytes;
}
function decodeRaw(bytes) {
 assert.ok(bytes instanceof Uint8Array);assert.equal(bytes.length,33);assert.equal(bytes[32]&128,0,"Nonzero padding");let at=0;
 const v=widths.map(w=>{let n=0;for(let k=0;k<w;k++,at++)n|=((bytes[at>>>3]>>>(at&7))&1)<<k;return n;});
 v.slice(0,36).forEach(n=>assert.ok(n<=64));assert.ok(v[40]<=2);assert.ok(v[41]<=16);
 const pits=Array.from({length:2},(_,p)=>Array.from({length:2},(_,r)=>v.slice(p*16+r*8,p*16+r*8+8)));
 return {pits,reserve:v.slice(32,34),pending:v.slice(34,36),houseOwned:[!!v[36],!!v[37]],player:v[38],phase:v[39]?"mtaji":"namua",winner:v[40]===0?null:v[40]-1,takasia:v[41]===0?null:{player:Math.floor((v[41]-1)/8),index:(v[41]-1)%8},ruleRevision:RULE};
}
module.exports={encodeRaw,decodeRaw,RULE};
