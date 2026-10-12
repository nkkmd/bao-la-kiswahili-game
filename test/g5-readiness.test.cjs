"use strict";
const test = require("node:test"), assert = require("node:assert/strict");
const C = require("../tools/research/g5-readiness/core.cjs");
const p = { alpha:0.05,errorHalfWidth:0.20 };
const node = { id:"r",player:0,winner:null,moves:[{key:"a",to:"a"},{key:"b",to:"b"}] };
test("DTF差だけでは主要な勝敗価値差の条件を通過しない", () => {
  const x=C.characterize(node,{a:{absoluteWinner:0,dtf:0},b:{absoluteWinner:0,dtf:2}});
  assert.equal(x.winLossContrast,false);assert.equal(x.dtfContrast,true);assert.equal(x.allChoiceWinLossRegretZero,true);
});
test("勝者0を欠損にせず、異なる勝敗価値を識別する", () => {
  const x=C.characterize(node,{a:{absoluteWinner:0,dtf:0},b:{absoluteWinner:1,dtf:1}});
  assert.equal(x.valuesKnown,true);assert.equal(x.winLossContrast,true);assert.equal(x.allChoiceWinLossRegretZero,false);
});
test("未解決子の値やDTFを0へ補填しない", () => {
  const x=C.characterize(node,{a:{absoluteWinner:0,dtf:0},b:{absoluteWinner:null,dtf:null}});
  assert.equal(x.valuesKnown,false);assert.equal(x.winLossContrast,null);assert.equal(x.dtfContrast,null);
});
test("提案精度の境界は92では不足し93ずつで満たす", () => {
  assert.equal(C.balancedMinimum(p.alpha,p.errorHalfWidth),93);
  assert.ok(C.tailBound(92,92,p.errorHalfWidth)>p.alpha);
  assert.ok(C.tailBound(93,93,p.errorHalfWidth)<p.alpha);
  assert.equal(C.tailBound(0,93,p.errorHalfWidth),null);
  assert.equal(C.balancedMinimum(.05,.10),369);
});
const rows = () => Array.from({length:186},(_,i) => ({raw:String(i).padStart(3,"0"),sourceId:"s"+i,componentId:"c"+i,
  exactVerified:true,valuesKnown:true,freshHoldout:true,winLossContrast:true,rankingChanged:i>=93,
  positiveValueLoss:i%2===0}));
test("精度の数だけ満たしても独立性未検証・既読なら承認しない", () => {
  assert.equal(C.assess(rows(),p,false).gates.independentSampling,false);
  const known=rows();known[0].freshHoldout=false;
  assert.equal(C.assess(known,p,true).gates.freshHoldout,false);
  assert.equal(C.assess(rows(),p,true).decision,"DESIGN-CHECK-PASS-NOT-AUTHORIZATION");
  assert.equal(C.assess(rows(),p,true).formalAuthorization,false);
});
test("同じsource・共有閉包の推移的連結を重複標本として数えない", () => {
  const xs=[{raw:"a",sourceId:"s0",componentId:"c0"},{raw:"b",sourceId:"s0",componentId:"c1"},
    {raw:"c",sourceId:"s1",componentId:"c1"}];
  assert.deepEqual(C.representatives(xs),[xs[0]]);
});
test("損失観測が未実施または一様なら主要関係の情報条件を通過しない", () => {
  const xs=rows();for(const x of xs)x.positiveValueLoss=null;
  const gate=C.assess(xs,p,true);assert.equal(gate.gates.lossMeasured,false);assert.equal(gate.gates.observedLossVariation,false);
  for(const x of xs)x.positiveValueLoss=false;
  assert.equal(C.assess(xs,p,true).gates.observedLossVariation,false);
});
