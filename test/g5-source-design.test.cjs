"use strict";
const { test } = require("node:test"), assert = require("node:assert/strict");
const C = require("../tools/research/g5-source-design/core.cjs"), A = require("../tools/research/g5-source-design/audit.cjs");
const limits = { minWidth:2,maxWidth:4,maxReplyWidth:8 };
const root = { nonterminal:true,phase:"mtaji",reserve:[0,0],width:2 };
const branches = [{nonterminal:true,width:2,mode:"capture"},{nonterminal:true,width:2,mode:"takata"}];
test("全root枝の応手種別差だけを適格とする", () => {
  assert.equal(C.classify(root,branches,limits),"MIXED-REPLY-ELIGIBLE");
  assert.equal(C.classify(root,branches.map(b=>({...b,mode:"capture"})),limits),"HOMOGENEOUS-REPLY-EXCLUDED");
});
test("欠落枝・未展開子の種別を0や非適格に埋めない", () => {
  assert.equal(C.classify(root,[branches[0]],limits),"UNKNOWN");
  assert.equal(C.classify(root,[branches[0],{nonterminal:true,width:null,mode:null}],limits),"UNKNOWN");
});
test("自然終局子を勝者にかかわらず除く", () => {
  assert.equal(C.classify(root,[branches[0],{nonterminal:false,width:0,mode:null}],limits),"TERMINAL-CHILD-EXCLUDED");
});
test("mtaji・reserve・root幅・応手幅の境界を守る", () => {
  for (const patch of [{phase:"namua"},{reserve:[1,0]},{width:1},{width:5},{nonterminal:false}]) assert.equal(C.classify({...root,...patch},branches,limits),"ROOT-EXCLUDED");
  assert.equal(C.classify(root,[branches[0],{...branches[1],width:9}],limits),"REPLY-WIDTH-EXCLUDED");
  assert.equal(C.classify(root,[branches[0],{...branches[1],mode:"pass"}],limits),"MODE-EXCLUDED");
});
test("最後の構造適格rootを値・後続の閉包成否によらず固定する", () => {
  const rows = [{ply:48,raw:"a",status:"MIXED-REPLY-ELIGIBLE"},{ply:52,raw:"b",status:"MIXED-REPLY-ELIGIBLE"},{ply:60,raw:"c",status:"HOMOGENEOUS-REPLY-EXCLUDED"}];
  for (const r of rows) Object.defineProperty(r,"value",{get(){throw Error("Value access");}});
  assert.deepEqual(C.latestEligible(rows),{ply:52,raw:"b"}); assert.equal(C.latestEligible([]),null);
  assert.throws(()=>C.latestEligible([...rows,rows[0]]),/Unordered/);
});
test("保存グラフの値・DTF・順位を読み出さない", () => {
  const key=t=>JSON.stringify({type:t});
  const d={rootKey:"r",complete:false,states:[{id:"r",state:{winner:null,phase:"mtaji",reserve:[0,0]}},{id:"c",state:{winner:null}},{id:"t",state:{winner:null}}],nodes:[{id:"r",winner:null,moves:[{key:key("takata"),to:"c"},{key:key("takata"),to:"t"}]},{id:"c",winner:null,moves:[{key:key("capture"),to:"absent"}]},{id:"t",winner:null,moves:[{key:key("takata"),to:"absent"}]}]};
  Object.defineProperty(d,"solution",{get(){throw Error("Solution access");}});
  assert.equal(A.describeDomain(d,limits,0).originalRoot.status,"MIXED-REPLY-ELIGIBLE");
});
test("混在合法手・空集合を単一種別とみなさない", () => {
  assert.equal(C.replyMode([]),null);
  assert.equal(C.replyMode(['{"type":"capture"}','{"type":"takata"}']),"mixed-or-other");
});
