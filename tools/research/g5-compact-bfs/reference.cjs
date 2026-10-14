"use strict";
// 主BFS/主codec/主snapshot readerをimportしない。
const assert=require("node:assert/strict"),M=require("../g5-01/measurement.cjs"),C=require("../g5-method/independent-raw-codec.cjs"),Micro=require("../g5-method/microstate-check.cjs");
function build(f,config){
 assert.notEqual(f.state.reason,"relay-limit","Runtime guard terminal is not a scientific root");
 const budget={...config,...f.limits},start=performance.now(),states=[structuredClone(f.state)],ids=[M.rawKey(f.state)],legal=[null],expanded=[false],keys=[],edges=[],boundary=new Set(ids),projections=new Set(ids);let status="COMPLETE",witness=null;
 function observed(r){Micro.check(r);if(r.state){boundary.add(M.rawKey(r.state));projections.add(M.rawKey(r.state));}for(const frame of r.microstates)if(frame.pits)projections.add(M.rawKey({...frame,winner:null}));}
 function cap(){return performance.now()-start>=budget.maxDomainMs?"TIME-LIMIT":process.resourceUsage().maxRSS*1024>budget.maxRssBytes?"RSS-LIMIT":null;}
 scan:for(let n=0;n<states.length;n++){
  const limit=cap();if(limit){status=limit;break;}
  const s=states[n];assert.deepEqual(C.decodeRaw(C.encodeRaw(s)),M.raw(s));
  const options=f.adapter.variants(s);options.probes.forEach(observed);legal[n]=options.moves.map(M.moveKey);assert.equal(new Set(legal[n]).size,legal[n].length);
  if(s.winner===null)assert.ok(options.moves.length);else assert.equal(options.moves.length,0);
  for(const move of options.moves){
   const limit=cap()??(edges.length===budget.maxEdges?"EDGE-LIMIT":null);if(limit){status=limit;break scan;}
   const r=f.adapter.apply(s,move);observed(r);const key=M.moveKey(move);if(!keys.includes(key))keys.push(key);
   const e={from:n,move:keys.indexOf(key),to:null,status:r.status,relays:r.relays,microstateCount:r.microstates.length,microstateHash:M.digest(r.microstates),cycle:r.cycle,metadata:r.state?{reason:r.state.reason??"",turn:r.state.turn}:null,witness:r.state?null:r};
   if(r.state){const id=M.rawKey(r.state);let position=ids.indexOf(id);if(position<0){if(states.length>=budget.maxStates){status="STATE-LIMIT";e.witness=r;}else{position=states.length;states.push(structuredClone(r.state));ids.push(id);legal.push(null);expanded.push(false);}}if(position>=0)e.to=position;}
   else status=r.status;
   edges.push(e);if(status!=="COMPLETE"){witness={from:ids[n],moveKey:key,record:r};break scan;}
  }
  expanded[n]=true;
 }
 return {version:1,ruleRevision:M.RULE,codec:"RAW263-LE-v1",fixtureId:f.id,evidenceClass:f.evidenceClass,root:ids[0],ids,metadata:states.map(s=>({reason:s.reason??"",turn:s.turn})),legal,expanded,keys,edges,complete:status==="COMPLETE",status,stopWitness:witness,frontier:ids.filter((_,i)=>!expanded[i]),boundaryIdentities:[...boundary].sort(),rawProjectionIdentities:[...projections].sort(),states:states.map((s,i)=>({id:ids[i],state:{...M.raw(s),reason:s.reason??"",turn:s.turn}}))};
}
function decode(bytes){
 assert.ok(Buffer.isBuffer(bytes)&&bytes.length>=12);assert.equal(bytes.subarray(0,8).toString(),"RCBI0001");const size=bytes.readUInt32LE(8);assert.ok(size<=bytes.length-12);
 const h=JSON.parse(bytes.subarray(12,12+size));assert.equal(h.version,1);assert.equal(h.ruleRevision,M.RULE);assert.equal(h.codec,"RAW263-LE-v1");assert.equal(h.rawWidth,33);assert.equal(h.edgeCount,h.edges.length);
 const n=h.ids.length;assert.equal(bytes.length,12+size+33*n+12*h.edgeCount);assert.equal(new Set(h.ids).size,n);
 for(const field of ["metadata","legal","expanded"])assert.equal(h[field].length,n);assert.equal(h.root,h.ids[0]);assert.equal(new Set(h.keys).size,h.keys.length);
 const states=h.ids.map((id,i)=>{const raw=C.decodeRaw(bytes.subarray(12+size+i*33,12+size+(i+1)*33));assert.equal(M.rawKey(raw),id);assert.equal(typeof h.metadata[i].reason,"string");assert.ok(Number.isInteger(h.metadata[i].turn));return {id,state:{...raw,...h.metadata[i]}};});
 const off=12+size+33*n,edges=h.edges.map((record,i)=>{for(const k of ["from","move","to"])assert.equal(Object.hasOwn(record,k),false);const from=bytes.readUInt32LE(off+i*12),move=bytes.readUInt32LE(off+i*12+4),t=bytes.readUInt32LE(off+i*12+8),to=t===0xffffffff?null:t;assert.ok(from<n&&move<h.keys.length&&(to===null||to<n));assert.ok(h.legal[from].includes(h.keys[move]));assert.ok(["TERMINATED","ADMIN-CUTOFF","MOVE-RECURRENT"].includes(record.status));
  if(record.witness){Micro.check(record.witness);assert.equal(record.status,record.witness.status);assert.equal(record.relays,record.witness.relays);assert.equal(record.microstateCount,record.witness.microstates.length);assert.equal(record.microstateHash,M.digest(record.witness.microstates));assert.deepEqual(record.cycle,record.witness.cycle);}
  if(record.status!=="TERMINATED"){assert.equal(to,null);assert.ok(record.witness);assert.equal(record.metadata,null);}else{assert.ok(record.metadata);assert.notEqual(record.metadata.reason,"relay-limit");if(to===null){assert.ok(record.witness?.state);assert.equal(h.complete,false);}}
  return {from,move,to,...record};});
 for(let i=0;i<n;i++){assert.equal(typeof h.expanded[i],"boolean");if(h.legal[i]!==null)assert.equal(new Set(h.legal[i]).size,h.legal[i].length);const rows=edges.filter(e=>e.from===i);assert.equal(new Set(rows.map(e=>e.move)).size,rows.length);if(h.expanded[i])assert.deepEqual(rows.map(e=>h.keys[e.move]),h.legal[i]);if(states[i].state.winner!==null)assert.equal(rows.length,0);}
 assert.deepEqual(h.frontier,h.ids.filter((_,i)=>!h.expanded[i]));assert.equal(h.complete,h.status==="COMPLETE");if(h.complete){assert.equal(h.frontier.length,0);assert.ok(edges.every(e=>e.to!==null&&e.status==="TERMINATED"));assert.equal(h.stopWitness,null);}
 const {edgeCount,rawWidth,...domain}=h;return {...domain,edges,states};
}
function graph(c){assert.equal(c.complete,true);return c.states.map((r,i)=>({id:r.id,player:r.state.player,winner:r.state.winner,moves:c.edges.filter(e=>e.from===i).map(e=>({key:c.keys[e.move],to:c.ids[e.to]}))}));}
module.exports={build,decode,graph};
