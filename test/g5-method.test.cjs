"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),P=require("../tools/research/g5-method/object-engine.cjs"),I=require("../tools/research/g5-method/ring-engine.cjs"),F=require("../tools/research/g5-01/transition/fixtures.cjs");
const Micro=require("../tools/research/g5-method/microstate-check.cjs"),A=require("../tools/research/g5-method/certificates.cjs"),B=require("../tools/research/g5-method/independent-certificates.cjs"),f=require("../tools/research/g5-method/proof-fixtures.json");
const normalize=s=>({...require('../tools/research/g5-01/measurement.cjs').raw(s),reason:s.reason??'',turn:s.turn});
test("既知全40rootの合法手と自然遷移/microstate列が二経路で一致する",()=>{
 for(const {state}of F.corpus()) {
  const choices=P.moveVariants(state),independent=I.moveVariants(state,{maxMicrostates:8192});
  const key=require('../tools/research/g5-01/measurement.cjs').moveKey;
  assert.deepEqual(choices.map(key).sort(),independent.map(key).sort());
  for(const move of choices){const a=P.applyMove(state,move),b=I.applyMove(state,move);assert.equal(a.status,b.status);assert.deepEqual(a.microstates,b.microstates);assert.deepEqual(a.cycle,b.cycle);assert.equal(a.relays,b.relays);if(a.state)assert.deepEqual(normalize(a.state),normalize(b.state));else assert.equal(b.state,null);Micro.check(a);}
 }
});
test("管理上限は勝者を付けず、既知relayの自然停止と分離する",()=>{
 const s=F.corpus().find(f=>f.id==='P9/capture-relay').state;let examples=0;
 for(const m of P.moveVariants(s)){const limited=P.applyMove(s,m,{maxMicrostates:1}),natural=P.applyMove(s,m);assert.equal(natural.status,'TERMINATED');if(limited.status==='ADMIN-CUTOFF'){examples++;assert.equal(limited.state,null);assert.deepEqual(limited,I.applyMove(s,m,{maxMicrostates:1}));}}
 assert.ok(examples>0);
});
test("完全microstateは盤だけでなくcursorを含み、反復証明の周期を持つ",()=>{
 const r=Micro.abstractMachine({board:[2],cursor:0},s=>({...s,cursor:1-s.cursor}),5);assert.equal(r.status,'MOVE-RECURRENT');assert.equal(r.cycle.period,2);Micro.check(r);
 const bad=structuredClone(r);bad.microstates.at(-1).cursor=7;assert.throws(()=>Micro.check(bad));
});
test("抽象自然停止と上限による未知を0価値へ変換しない",()=>{
 const next=s=>s.n===2?{end:true,n:3}:{n:s.n+1};const small=Micro.abstractMachine({n:0},next,1),full=Micro.abstractMachine({n:0},next,5);
 assert.equal(small.status,'ADMIN-CUTOFF');assert.equal(small.state,null);assert.equal(full.status,'TERMINATED');Micro.check(small);Micro.check(full);
});
test("有限戦略証明と全root手の値を二検算器で照合する",()=>{
 for(const c of f.choices)assert.deepEqual(A.check(f.graph,c.proof),B.check(f.graph,c.proof));
 const all=A.allRootChoices(f.graph,'r',f.choices);assert.deepEqual(all.values.map(r=>r.value),[-1,1]);assert.equal(all.formalEligible,false);
});
test("相手の合法分岐欠落と非合法辺を拒否する",()=>{
 for(const mutate of [p=>p.nodes[0].edges.pop(),p=>p.nodes[0].edges[0].key='illegal']) {
  const p=structuredClone(f.choices[1].proof);mutate(p);assert.throws(()=>A.check(f.graph,p));assert.throws(()=>B.check(f.graph,p));
 }
});
test("非減少rankと循環による偽の勝利証明を拒否する",()=>{
 const p=structuredClone(f.choices[1].proof);p.nodes[1].rank=1;assert.throws(()=>A.check(f.graph,p));assert.throws(()=>B.check(f.graph,p));
 const g=[{id:'x',player:0,winner:null,expanded:true,moves:[{key:'loop',to:'x'}]}],cycle={root:'x',winner:0,nodes:[{id:'x',rank:1,edges:[{key:'loop',to:'x'}]}]};assert.throws(()=>A.check(g,cycle));assert.throws(()=>B.check(g,cycle));
});
test("未知の合法集合と非終局空集合を勝利にしない",()=>{
 for(const patch of [{expanded:false},{moves:[]}]){const g=structuredClone(f.graph);Object.assign(g.find(n=>n.id==='b'),patch);assert.throws(()=>A.check(g,f.choices[1].proof));assert.throws(()=>B.check(g,f.choices[1].proof));}
});
test("runtime guardの勝者を自然な終局証明として拒否する",()=>{
 const g=structuredClone(f.graph);g.find(n=>n.id==='w1').terminalKind='RUNTIME-GUARD';assert.throws(()=>A.check(g,f.choices[0].proof));assert.throws(()=>B.check(g,f.choices[0].proof));
 assert.throws(()=>Micro.check({status:'TERMINATED',state:{reason:'relay-limit'},cycle:null}));
});
test("root勝利の1証明だけでは全root手の損失を評価できない",()=>{
 assert.throws(()=>A.allRootChoices(f.graph,'r',[f.choices[1]]));
 assert.equal(A.closedDomainEligibility({fullClosure:false,ruleValidated:true,allRootValuesKnown:true}).eligible,false);
 assert.equal(A.closedDomainEligibility({fullClosure:true,ruleValidated:false,allRootValuesKnown:true}).eligible,false);
 assert.equal(A.closedDomainEligibility({fullClosure:true,ruleValidated:true,allRootValuesKnown:true}).formalExecutionAuthorized,false);
});
test("証明に無関係なnodeや重複IDを拒否する",()=>{
 const p=structuredClone(f.choices[0].proof);p.nodes.push({id:'w0a',rank:0,edges:[]});assert.throws(()=>A.check(f.graph,p));assert.throws(()=>B.check(f.graph,p));
 const q=structuredClone(f.choices[0].proof);q.nodes.push(structuredClone(q.nodes[0]));assert.throws(()=>A.check(f.graph,q));assert.throws(()=>B.check(f.graph,q));
});
