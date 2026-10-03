'use strict';
const test = require('node:test');
const A = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const C = require('../tools/research/first-player-gen4/common.cjs');
const R = require('../tools/research/first-player-gen4/run.cjs');
const G = require('../tools/research/first-player-gen4/aggregate.cjs');
test('公開系統・正しい座席交換・通常/軽量遷移が一致する', () => {
  const e = C.engine();
  for(const policy of C.protocol.policies)for(let slot=0;slot<32;slot++) {
    const o=C.opening(e,'pilot',policy,8,slot), s=o.state, x=C.exchange(s);
    A.deepEqual(C.exchange(x),s);
    A.equal(e.L.evaluate(s,s.player),e.L.evaluate(x,x.player));
    A.deepEqual(C.clone(e.E.moveVariantsForSearch(s)),C.clone(e.E.moveVariantsForSearch(x)));
    for(const move of e.E.moveVariantsForSearch(s)) {
      const fast=C.clone(e.E.applyMoveForSearch(s,move).state);
      A.deepEqual(fast,C.clone(e.E.applyMove(s,move).state));
      A.deepEqual(C.exchange(fast),C.clone(e.E.applyMoveForSearch(x,move).state));
    }
  }
  const r=C.analyze(e,e.E.initialState(),'G4D4');
  A.equal(r.stats.evaluationCandidate,'PBAI-C015-v1');A.equal(r.stats.completedDepth,4);
});
test('種まき途中の保存点から同一棋譜を再開し、改変保存点を拒否する', async () => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'fpa4-test-'));
  try {
    const e=C.engine(),o=C.opening(e,'pilot','uniform',8,10);
    const decide=(s)=>({move:C.clone(e.E.moveVariantsForSearch(s)[0]),stats:{completedDepth:4,nodes:1,elapsedMs:0,rootScore:0}});
    const partial=await R.play(e,o,'G4D4',0,path.join(dir,'resume'),'test',{decide,maxPlies:20,pauseAfter:2});
    A.equal(partial.complete,false);
    const resumed=await R.play(e,o,'G4D4',0,path.join(dir,'resume'),'test',{decide,maxPlies:20});
    const direct=await R.play(e,o,'G4D4',0,path.join(dir,'direct'),'test',{decide,maxPlies:20});
    A.deepEqual(resumed.turns,direct.turns);A.deepEqual(resumed.outcome,direct.outcome);
    const corrupt=C.clone(resumed);corrupt.turns[0].afterHash='bad';A.throws(()=>R.replay(e,corrupt),/RECORD_HASH/);
    const forged=R.seal(corrupt);A.throws(()=>R.replay(e,forged),/REPLAY_AFTER_HASH/);
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
test('未決着は0.5点にせず上下限を広げ、座席ペアの欠損を拒否する', () => {
  const records=[0,1].map(firstPlayer=>({slot:0,firstPlayer,openingHash:'shared',openingStateHash:'state',openingMoves:[],turns:[],outcome:{score:null,reason:'max-plies',totalPlies:180}}));
  const s=G.summarize(records,.05,100);
  A.deepEqual(s.scoreIdentificationBounds,[0,1]);A.deepEqual(s.conservativeClusterInterval,[0,1]);
  A.equal(s.firstWinRateDecisive,null);A.equal(s.unresolved,2);
  A.throws(()=>G.summarize(records.slice(0,1),.05,100),/INCOMPLETE_SEAT_PAIR/);
});
test('正式shardの割当てに欠損・重複がなく、実行familyの和が全条件に一致する', () => {
  const all=[], split=[];
  for(let shard=0;shard<C.protocol.shards;shard++) {
    all.push(...R.taskList('formal',shard,'all'));
    for(const family of ['fixed','expert-uniform','expert-top3'])split.push(...R.taskList('formal',shard,family));
  }
  const keys=rows=>rows.map(C.canonical).sort();
  A.deepEqual(keys(all),keys(split));A.equal(new Set(keys(all)).size,16384);
  A.equal(R.taskList('pilot',0,'all').length,352);
  A.equal(R.taskList('sensitivity',0,'all').length,1024);
});
