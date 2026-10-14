"use strict";
// 抽象ゲームグラフ用の有限戦略証明。Baoの合法手/到達性検査を代行しない。
const assert=require("node:assert/strict");
function check(graph,certificate) {
 const nodes=new Map(graph.map(n=>[n.id,n]));assert.equal(nodes.size,graph.length);
 assert.ok(certificate.winner===0||certificate.winner===1);
 const proof=new Map(certificate.nodes.map(n=>[n.id,n]));assert.equal(proof.size,certificate.nodes.length);assert.ok(proof.has(certificate.root));
 const reached=new Set([certificate.root]);
 const ordered=[...proof.values()].sort((a,b)=>b.rank-a.rank);
 for(const p of ordered) {
  assert.ok(Number.isSafeInteger(p.rank)&&p.rank>=0);assert.ok(reached.has(p.id),"Unused certificate node");
  const n=nodes.get(p.id);assert.ok(n&&n.expanded===true,"Unknown legal universe");
  assert.equal(new Set(n.moves.map(m=>m.key)).size,n.moves.length);
  if(n.winner!==null){assert.equal(n.terminalKind,"NATURAL-RULE-END");assert.equal(n.winner,certificate.winner);assert.equal(n.moves.length,0);assert.equal(p.edges.length,0);continue;}
  assert.ok(n.player===0||n.player===1);assert.ok(n.moves.length>0,"Nonterminal with no legal moves");
  if(n.player===certificate.winner)assert.equal(p.edges.length,1);
  else assert.deepEqual(p.edges.map(e=>e.key).sort(),n.moves.map(m=>m.key).sort(),"Missing opponent choice");
  for(const e of p.edges){const actual=n.moves.find(m=>m.key===e.key);assert.ok(actual);assert.equal(e.to,actual.to);const child=proof.get(e.to);assert.ok(child);assert.ok(child.rank<p.rank,"Nondecreasing rank");reached.add(e.to);}
 }
 assert.equal(reached.size,proof.size);return {status:"ABSTRACT-FINITE-STRATEGY-PROOF-VALID",winner:certificate.winner,nodes:proof.size};
}
function allRootChoices(graph,rootId,certificates) {
 const root=graph.find(n=>n.id===rootId);assert.ok(root&&root.expanded===true&&root.winner===null&&root.moves.length);
 assert.deepEqual(certificates.map(c=>c.moveKey).sort(),root.moves.map(m=>m.key).sort());
 const rows=certificates.map(c=>{const move=root.moves.find(m=>m.key===c.moveKey);assert.equal(c.proof.root,move.to);return {moveKey:c.moveKey,...check(graph,c.proof)};});
 return {root:rootId,values:rows.map(r=>({moveKey:r.moveKey,value:r.winner===root.player?1:-1})),
   status:"ABSTRACT-ALL-ROOT-CHOICES-PROVED",baoOracle:false,fullClosure:false,formalEligible:false};
}
function closedDomainEligibility(input) {
 return {eligible:input.fullClosure===true&&input.ruleValidated===true&&input.allRootValuesKnown===true,
  finiteStrategyProofAloneEligible:false,formalExecutionAuthorized:false};
}
module.exports={check,allRootChoices,closedDomainEligibility};
