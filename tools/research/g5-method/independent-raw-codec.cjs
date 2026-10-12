"use strict";
// 文字列bit列による独立実装。主codecとRAW測定関数をimportしない。
const assert=require("node:assert/strict"),RULE="BAO-RULES-V0.2.0-TAKASIA-001";
function encodeRaw(s) {
 if(s.ruleRevision!==undefined)assert.equal(s.ruleRevision,RULE);
 assert.ok(Array.isArray(s.pits)&&s.pits.length===2);const fields=[];
 for(let p=0;p<2;p++){assert.ok(Array.isArray(s.pits[p])&&s.pits[p].length===2);for(let r=0;r<2;r++){assert.ok(Array.isArray(s.pits[p][r])&&s.pits[p][r].length===8);for(const n of s.pits[p][r])fields.push([n,7]);}}
 for(const name of ['reserve','pending']){assert.ok(Array.isArray(s[name])&&s[name].length===2);for(const n of s[name])fields.push([n,7]);}
 for(const[n]of fields)assert.ok(Number.isInteger(n)&&n>=0&&n<=64);
 assert.ok(Array.isArray(s.houseOwned)&&s.houseOwned.length===2);for(const b of s.houseOwned){assert.ok(b===true||b===false);fields.push([b?1:0,1]);}
 assert.ok(s.player===0||s.player===1);fields.push([s.player,1]);assert.ok(s.phase==='namua'||s.phase==='mtaji');fields.push([s.phase==='namua'?0:1,1]);
 assert.ok(s.winner===null||s.winner===0||s.winner===1);fields.push([s.winner===null?0:s.winner+1,2]);
 let takasia=0;if(s.takasia!=null){const t=s.takasia;assert.deepEqual(Object.keys(t).sort(),['index','player']);assert.ok(t.player===0||t.player===1);assert.ok(Number.isInteger(t.index)&&t.index>=0&&t.index<=7);takasia=1+t.player*8+t.index;}fields.push([takasia,5]);
 const bits=fields.map(([n,w])=>n.toString(2).padStart(w,'0').split('').reverse().join('')).join('')+'0';
 return Buffer.from(Array.from({length:33},(_,i)=>parseInt(bits.slice(i*8,i*8+8).split('').reverse().join(''),2)));
}
function decodeRaw(bytes) {
 assert.ok(bytes instanceof Uint8Array);assert.equal(bytes.length,33);const bits=[...bytes].map(b=>b.toString(2).padStart(8,'0').split('').reverse().join('')).join('');assert.equal(bits[263],'0');let offset=0;
 const take=w=>{const n=parseInt(bits.slice(offset,offset+w).split('').reverse().join(''),2);offset+=w;return n;};
 const pits=Array.from({length:2},()=>Array.from({length:2},()=>Array.from({length:8},()=>take(7)))),reserve=[take(7),take(7)],pending=[take(7),take(7)];
 for(const n of [...pits.flat(2),...reserve,...pending])assert.ok(n<=64);
 const houseOwned=[take(1)===1,take(1)===1],player=take(1),phase=take(1)===1?'mtaji':'namua',winnerCode=take(2),target=take(5);assert.ok(winnerCode<3&&target<17);
 return {pits,reserve,pending,houseOwned,player,phase,winner:winnerCode===0?null:winnerCode-1,takasia:target===0?null:{player:Math.floor((target-1)/8),index:(target-1)%8},ruleRevision:RULE};
}
module.exports={encodeRaw,decodeRaw};
