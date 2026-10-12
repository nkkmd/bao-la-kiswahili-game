"use strict";
const F=require("../g5-01/transition/fixtures.cjs"),M=require("../g5-01/measurement.cjs"),P=require("../g5-method/object-engine.cjs"),I=require("../g5-method/ring-engine.cjs"),Micro=require("../g5-method/microstate-check.cjs");
const order=xs=>[...xs].sort((a,b)=>M.moveKey(a)<M.moveKey(b)?-1:1);
const meta=s=>({reason:s.reason??"",turn:s.turn});
function baoAdapter(engine,cap,object) {
 return {variants(s){
  const probes=[];
  // houseChoiceの同値判定で読んだ状態も遮断集合へ記録する。
  for(const m of engine.legalMoves(s))if(s.phase==="namua"&&m.type==="capture")for(const houseChoice of ["stop","use"])probes.push(engine.applyMove(s,{...m,houseChoice},{maxMicrostates:cap}));
  const moves=object?engine.moveVariants(s,engine.legalMoves(s),{maxMicrostates:cap}):engine.moveVariants(s,{maxMicrostates:cap});
  return {moves:order(moves),probes};
 },apply:(s,m)=>engine.applyMove(s,m,{maxMicrostates:cap})};
}
function label(n,winner=null,turn=n+1,reason="abstract") {
 const s=F.blank();s.pits[0][0][0]=n%64;s.pits[0][0][1]=Math.floor(n/64);s.player=n%2;s.winner=winner;s.turn=turn;s.reason=reason;return s;
}
const number=s=>s.pits[0][0][0]+64*s.pits[0][0][1];
function abstractAdapter(kind,size,independent) {
 function choices(s){const n=number(s);if(s.winner!==null)return [];
  if(kind==="diamond")return n===0?[1,2]:[3];
  if(kind==="cycle")return [1-n];
  if(kind==="chain")return n+2<size?[n+1,n+2]:[n+1];
  return [0];
 }
 return {variants(s){const moves=choices(s).map(to=>({type:"abstract",index:to,direction:"right"}));return {moves:order(independent?moves.toReversed():moves),probes:[]};},apply(s,m){
  if(kind==="recurrence"||kind==="admin"){
   // 抽象状態機械の独立な生成。Baoの反復証明ではない。
   if(!independent)return Micro.abstractMachine({x:0},v=>({x:kind==="recurrence"?1-v.x:v.x+1}),kind==="admin"?1:8);
   return kind==="recurrence"?{status:"MOVE-RECURRENT",state:null,relays:2,microstates:[{x:0},{x:1},{x:0}],cycle:{first:0,repeatedAt:2,period:2}}
    :{status:"ADMIN-CUTOFF",state:null,relays:1,microstates:[{x:0},{x:1}],cycle:null};
  }
  const terminal=kind==="diamond"?m.index===3:kind==="chain"?m.index===size-1:false;
  return {status:"TERMINATED",state:label(m.index,terminal?0:null,s.turn+1,`from-${number(s)}`),relays:0,microstates:[],cycle:null};
 }};
}
function fixture(id,independent=false){
 if(id.startsWith("BAO-")){const relay=id==="BAO-RELAY-CAP-1",root=F.corpus().find(f=>f.id===(relay?"P9/capture-relay":"P9/forced-win"));return {id,evidenceClass:"TECHNICAL-KNOWN-BAO",state:structuredClone(root.state),adapter:baoAdapter(independent?I:P,relay?1:8192,!independent),limits:{}};}
 const kind=id.includes("DIAMOND")?"diamond":id.includes("CYCLE")?"cycle":id.includes("RECURRENCE")?"recurrence":id==="ABSTRACT-ADMIN"?"admin":"chain";
 const size=id.endsWith("1024")?1024:id.endsWith("256")?256:8;
 return {id,evidenceClass:"ABSTRACT-NOT-BAO-EVIDENCE",state:label(0),adapter:abstractAdapter(kind,size,independent),limits:id==="ABSTRACT-STATE-LIMIT"?{maxStates:2}:id==="ABSTRACT-EDGE-LIMIT"?{maxEdges:1}:{}};
}
module.exports={fixture,order,meta};
