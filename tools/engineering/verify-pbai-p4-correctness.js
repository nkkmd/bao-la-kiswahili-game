"use strict";
const C=require("./lib/pbai-p4-common.js"),assert=require("node:assert/strict"),fs=require("node:fs");
const {verifyEvents}=require("./lib/pbai-p4-event-verifier.js");
const target=C.OUT+"/correctness.json";
if(fs.existsSync(target))throw Error("Correctness seeds already consumed");
const B=C.baseline(),N=C.candidate();
const strip=a=>a.map(({state,...e})=>e);
let transitions=0,states=0,eventCount=0;const coverage={},digests=[],seedRows=[];
function check(s,label,firstOnly=false){
 const input=JSON.stringify(s);states++;
 const legal=B.E.legalMoves(s),variants=B.E.moveVariants(s);
 assert.deepEqual(N.E.legalMoves(s),legal);
 assert.deepEqual(N.E.moveVariants(s),variants);assert.deepEqual(N.E.moveVariantsForSearch(s),variants);
 for(const m of (firstOnly?variants.slice(0,1):variants)){
  const b=B.E.applyMove(s,m),n=N.E.applyMove(s,m),q=N.E.applyMoveForSearch(s,m);
  assert.deepEqual(n.state,b.state);assert.deepEqual(q.state,b.state);
  assert.equal(n.events.length,b.events.length);assert.equal(q.events.length,b.events.length);
  for(let i=0;i<b.events.length;i++){
   assert.deepEqual(n.events[i],b.events[i]);
   const {state,...e}=b.events[i];assert.deepEqual(q.events[i],e);
   assert.notEqual(n.events[i].state,n.state);assert.notEqual(n.events[i].state,s);
   if(i)assert.notEqual(n.events[i].state,n.events[i-1].state);
  }
  verifyEvents(s,b);eventCount+=b.events.length;transitions++;
  for(const e of b.events)coverage[e.kind]=(coverage[e.kind]||0)+1;
  if(m.houseChoice)coverage["house-"+m.houseChoice]=(coverage["house-"+m.houseChoice]||0)+1;
  if(m.type==="pass")coverage.pass=(coverage.pass||0)+1;
  if(b.state.reason)coverage[b.state.reason]=(coverage[b.state.reason]||0)+1;
  if(b.events.filter(e=>e.kind==="capture").length>=2)coverage.captureChain=(coverage.captureChain||0)+1;
  digests.push(C.sha([label,m,b.state]));
 }
 assert.equal(JSON.stringify(s),input);
}
for(let seed=815000001;seed<=815000064;seed++){
 let s=B.E.initialState(),r=C.rng(seed),plies=0;
 for(;plies<96&&s.winner===null;plies++){
  check(s,`${seed}:${plies}`);const v=B.E.moveVariants(s);s=B.E.applyMove(s,v[Math.floor(r()*v.length)]).state;
 }
 seedRows.push({seed,plies,finalRaw:C.raw(s)});
}
const {tacticalCases}=require("../../test/tactical.test.js");
for(const t of tacticalCases)check(t.position,"known:"+t.category);
const pass=B.E.initialState();pass.reserve=[0,1];check(pass,"synthetic:pass");
const phase=B.E.initialState();phase.reserve=[1,0];check(phase,"synthetic:phase");
// Oversized synthetic stress state: tests the real 512 boundary, not reachability.
for(const n of [32,1024]){const s=B.E.initialState();s.phase="mtaji";s.reserve=[0,0];s.houseOwned=[false,false];s.pits[0]=[Array(8).fill(n),Array(8).fill(n)];s.pits[1]=[Array(8).fill(1),Array(8).fill(0)];check(s,"synthetic:dense-"+n,true);}
for(const key of ["phase","captureChain","house-stop","house-use","pass","front-empty","no-move","relay-limit"])assert(coverage[key]>0,key);
const s=B.E.initialState(),m=B.E.legalMoves(s)[0],a=B.E.applyMove(s,m);
a.events.find(e=>e.kind==="sow").state.pits[0][0][0]++;
assert.throws(()=>verifyEvents(s,a),"independent checker detects corrupted snapshot");
assert.throws(()=>N.E.applyMoveForSearch(s,{type:"illegal"}),/Illegal move/);
C.write(target,{passed:true,baseline:C.BASE,sourceHashes:{engine:C.sha(fs.readFileSync(C.ROOT+"/public/engine.js")),ai:C.sha(fs.readFileSync(C.ROOT+"/public/ai.js"))},states,transitions,eventCount,coverage,seedRows,transitionDigest:C.sha(digests),mismatches:0,independentEventReplay:true,negativeControlDetected:true,relayLimitSynthetic:true});
console.log(JSON.stringify({passed:true,states,transitions,eventCount,coverage}));
