"use strict";
// 別経路: rootから再帰して全証明分岐とrankを検算する。主検算器を呼ばない。
const assert=require("node:assert/strict");
function check(graph,certificate) {
 assert.ok([0,1].includes(certificate.winner));
 const unique=a=>{assert.equal(new Set(a.map(x=>x.id)).size,a.length);};unique(graph);unique(certificate.nodes);
 const visited=new Set(),active=new Set();
 function walk(id,upper) {
  const p=certificate.nodes.find(x=>x.id===id),n=graph.find(x=>x.id===id);assert.ok(p&&n&&n.expanded===true);
  assert.ok(Number.isSafeInteger(p.rank)&&p.rank>=0&&p.rank<upper);assert.ok(!active.has(id));
  if(visited.has(id))return;active.add(id);
  assert.equal(new Set(n.moves.map(m=>m.key)).size,n.moves.length);
  if(n.winner!==null){assert.ok(n.winner===certificate.winner&&n.terminalKind==="NATURAL-RULE-END");assert.equal(n.moves.length,0);assert.equal(p.edges.length,0);}
  else {
   assert.ok([0,1].includes(n.player));assert.ok(n.moves.length>0);
   if(n.player===certificate.winner)assert.equal(p.edges.length,1);
   else {assert.equal(p.edges.length,n.moves.length);for(const m of n.moves)assert.equal(p.edges.filter(e=>e.key===m.key&&e.to===m.to).length,1);}
   for(const e of p.edges){assert.ok(n.moves.some(m=>m.key===e.key&&m.to===e.to));walk(e.to,p.rank);}
  }
  active.delete(id);visited.add(id);
 }
 walk(certificate.root,Infinity);assert.equal(visited.size,certificate.nodes.length);
 return {status:"ABSTRACT-FINITE-STRATEGY-PROOF-VALID",winner:certificate.winner,nodes:visited.size};
}
module.exports={check};
