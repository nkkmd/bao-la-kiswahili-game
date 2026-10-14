"use strict";
const assert=require("node:assert/strict"),M=require("../g5-01/measurement.cjs"),C=require("../g5-method/raw-codec.cjs"),Micro=require("../g5-method/microstate-check.cjs"),{meta}=require("./fixtures.cjs");
const trace=r=>({status:r.status,relays:r.relays,microstateCount:r.microstates.length,microstateHash:M.digest(r.microstates),cycle:r.cycle});
function build(f,config,emit=()=>{}){
 assert.notEqual(f.state.reason,"relay-limit","Runtime guard terminal is not a scientific root");
 const limits={...config,...f.limits},started=performance.now(),payloads=[],ids=[],metadata=[],legal=[],expanded=[],edges=[],keys=[],keyIndex=new Map(),index=new Map(),boundary=new Set(),projections=new Set();let stop=null,witness=null,cursor=0;
 function log(record){emit(record);}
 function observe(s){const id=M.rawKey(s);boundary.add(id);projections.add(id);return id;}
 function observeOutcome(r){Micro.check(r);if(r.state)observe(r.state);for(const m of r.microstates)if(m.pits)projections.add(M.rawKey({...m,winner:null}));}
 function add(s){const id=observe(s);if(index.has(id))return index.get(id);const n=ids.length;index.set(id,n);ids.push(id);payloads.push(C.encodeRaw(s));metadata.push(meta(s));legal.push(null);expanded.push(false);log({kind:"node",id,payload:payloads[n].toString("base64"),metadata:metadata[n]});return n;}
 const root=add(f.state);
 function administrative(){if(performance.now()-started>=limits.maxDomainMs)return "TIME-LIMIT";if(process.resourceUsage().maxRSS*1024>limits.maxRssBytes)return "RSS-LIMIT";return null;}
 outer:for(;cursor<ids.length;cursor++){
  stop=administrative();if(stop)break;
  const s={...C.decodeRaw(payloads[cursor]),...metadata[cursor]};
  const variants=f.adapter.variants(s);variants.probes.forEach(observeOutcome);
  const moves=variants.moves;assert.equal(new Set(moves.map(M.moveKey)).size,moves.length);
  legal[cursor]=moves.map(M.moveKey);log({kind:"legal",id:ids[cursor],keys:legal[cursor]});
  if(s.winner===null)assert.ok(moves.length,"Nonterminal without legal moves");else assert.equal(moves.length,0);
  for(const m of moves){
   stop=administrative()??(edges.length>=limits.maxEdges?"EDGE-LIMIT":null);if(stop)break outer;
   const result=f.adapter.apply(s,m);observeOutcome(result);
   const key=M.moveKey(m);if(!keyIndex.has(key)){keyIndex.set(key,keys.length);keys.push(key);}
   const edge={from:cursor,move:keyIndex.get(key),to:null,...trace(result),metadata:result.state?meta(result.state):null,witness:result.state?null:result};
   if(result.state){const id=M.rawKey(result.state);if(!index.has(id)&&ids.length>=limits.maxStates){stop="STATE-LIMIT";edge.witness=result;}else edge.to=add(result.state);}
   else stop=result.status;
   edges.push(edge);log({kind:"edge",from:ids[cursor],key,to:edge.to===null?null:ids[edge.to],record:{...edge,from:undefined,move:undefined,to:undefined}});
   if(stop){witness={from:ids[cursor],moveKey:key,record:result};break outer;}
  }
  expanded[cursor]=true;log({kind:"expanded",id:ids[cursor]});
 }
 const complete=stop===null,frontier=ids.filter((_,i)=>!expanded[i]);
 const domain={version:1,ruleRevision:C.RULE,codec:"RAW263-LE-v1",fixtureId:f.id,evidenceClass:f.evidenceClass,root:ids[root],ids,metadata,legal,expanded,keys,edges,complete,status:stop??"COMPLETE",stopWitness:witness,frontier,boundaryIdentities:[...boundary].sort(),rawProjectionIdentities:[...projections].sort()};
 log({kind:"finish",domain:{...domain,ids:undefined,metadata:undefined,legal:undefined,expanded:undefined,keys:undefined,edges:undefined}});
 return {domain,payloads};
}
function serialize(value){
 const {domain,payloads}=value,edgeBytes=Buffer.alloc(domain.edges.length*12);
 domain.edges.forEach((e,n)=>{edgeBytes.writeUInt32LE(e.from,n*12);edgeBytes.writeUInt32LE(e.move,n*12+4);edgeBytes.writeUInt32LE(e.to??0xffffffff,n*12+8);});
 const header=Buffer.from(JSON.stringify({...domain,edges:domain.edges.map(e=>({...e,from:undefined,move:undefined,to:undefined})),edgeCount:domain.edges.length,rawWidth:33})),prefix=Buffer.alloc(12);prefix.write("RCBI0001");prefix.writeUInt32LE(header.length,8);
 return Buffer.concat([prefix,header,...payloads,edgeBytes]);
}
function canonical(value){const d=value.domain;return {...d,states:value.payloads.map((p,i)=>({id:d.ids[i],state:{...C.decodeRaw(p),...d.metadata[i]}}))};}
function graph(c){assert.equal(c.complete,true);return c.states.map((n,i)=>({id:n.id,player:n.state.player,winner:n.state.winner,moves:c.edges.filter(e=>e.from===i).map(e=>({key:c.keys[e.move],to:c.ids[e.to]}))}));}
module.exports={build,serialize,canonical,graph,trace};
