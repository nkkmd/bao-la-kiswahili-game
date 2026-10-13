"use strict";
// 保存済みstep/screenだけを再生する。欠落した次手・screenを生成しない。
const assert = require('node:assert/strict');
const M = require('../g5-01/measurement.cjs');
const Micro = require('../g5-method/microstate-check.cjs');
const Storage = require('../g5-branch-envelope/storage.cjs');
const Independent = require('../g5-branch-envelope/independent-source.cjs');
const Codec = require('../g5-method/independent-raw-codec.cjs');
const sorted = moves => [...moves].sort((a,b) => M.moveKey(a)<M.moveKey(b)?-1:1);
function gate(context) {
  if (context.evidenceClass === 'BEFCS-SCIENTIFIC-SOURCE') {
    const g = require('../g5-befcs-workload/science-gate.cjs').authorizeRead(context.seed, context);
    const fs = require('node:fs'), path = require('node:path');
    const root = path.resolve(__dirname, '../../..');
    const manifest = JSON.parse(fs.readFileSync(path.join(root,'doc/research-generation-5/befcs-study1/SOURCE_MANIFEST.json')));
    assert.equal(manifest.files['tools/research/g5-befcs-prefix/verify.cjs'], Storage.hash(fs.readFileSync(__filename)), 'PREFIX-VALIDATOR-NOT-BOUND');
    return g;
  }
  assert.equal(context.evidenceClass, 'TECHNICAL-FIXTURE');
  assert.ok(Number.isInteger(context.seed) && context.seed>0 && context.seed<=0xffffffff);
  assert.ok(context.seed<50613001 || context.seed>50613128, 'SCIENTIFIC-SEED-REFUSED');
  assert.ok(context.allowedSeeds?.includes(context.seed) && context.fixtureId, 'FIXTURE-NOT-ALLOWLISTED');
  return null;
}
function prefix(bytes) {
  assert.ok(Buffer.isBuffer(bytes) && bytes.length<=268435456, 'PREFIX-BYTE-LIMIT');
  const end = bytes.lastIndexOf(10)+1;
  return {records:Storage.replayJournal(bytes.subarray(0,end)),prefixBytes:end,tailBytes:bytes.length-end,
    bytes:bytes.length,sha256:Storage.hash(bytes),tailSha256:Storage.hash(bytes.subarray(end))};
}
function detail(r) {
  Micro.check(r);
  return {status:r.status,to:r.state===null?null:M.rawKey(r.state),metadata:r.state===null?null:{reason:r.state.reason??'',turn:r.state.turn},
    relays:r.relays,microstateCount:r.microstates.length,microstateHash:M.digest(r.microstates),cycle:r.cycle,witness:r.state===null?r:null};
}
function verify(input, spec, initial, api, context) {
  // 科学用は入力Bufferや初期局面に触れる前に最終freezeとconsume receiptを照合する。
  const authorization = gate(context), scientific = Boolean(authorization);
  if(scientific)assert.deepEqual(spec,{...authorization.spec.trajectory,...authorization.spec.selection,
    checkpointSourcePlyInterval:authorization.spec.resources.checkpointSourcePlyInterval},'PREFIX-SPEC-NOT-FROZEN');
  assert.ok(Number.isInteger(spec.maxPly) && spec.maxPly>=0 && spec.maxPly<=512);
  const journal = prefix(input.journal), receipt = prefix(input.receipt);
  assert.equal(receipt.records.length,1,'ONE-RECEIPT-REQUIRED');
  const permit = receipt.records[0];
  for (const k of ['index','logicalId','binding','remoteCommit','runAttempt','beforeRead']) assert.deepEqual(permit[k],context[k],'RECEIPT-'+k);
  assert.equal(permit.beforeRead,true); assert.equal(permit.runAttempt,1); assert.match(permit.remoteCommit,/^[a-f0-9]{40}$/);
  assert.match(permit.binding,/^[a-f0-9]{64}$/);
  assert.equal(permit.logicalId,scientific?context.seed:context.index+1);
  assert.ok(Number.isInteger(context.index)&&context.index>=0&&context.index<128);
  assert.ok(journal.records.length>0,'NO-SAVED-SOURCE-MARKER');
  assert.deepEqual(journal.records[0],scientific?{kind:'scientific-source-consume',seed:context.seed,sourceId:context.sourceId}
    :{kind:'fixture-seed',seed:context.seed,fixtureId:context.fixtureId});
  let state=structuredClone(initial),random=context.seed,stopped=false;
  const states=[structuredClone(state)],trace=[],screens=[],requiredReads=new Set([M.rawKey(state)]);
  function remember(r){Micro.check(r);if(r.state)requiredReads.add(M.rawKey(r.state));for(const s of r.microstates)if(s.pits)requiredReads.add(M.rawKey({...s,winner:null}));}
  function select(row,moves) {
    assert.ok(moves.length>0); assert.equal(row.randomBefore,random);
    assert.ok(Array.isArray(row.draws)&&row.draws.length>0&&row.draws.length<=1048576);
    const ceiling=4294967296-(4294967296%moves.length);
    for(let n=0;n<row.draws.length;n++) {
      let next=random>>>0;next^=next<<13;next^=next>>>17;next^=next<<5;random=next>>>0;
      assert.equal(row.draws[n],random,'PREFIX-PRNG-MISMATCH');assert.equal(random<ceiling,n===row.draws.length-1,'PREFIX-REJECTION-MISMATCH');
    }
    const move=moves[random%moves.length];assert.equal(row.moveKey,M.moveKey(move));assert.equal(M.moveKey(row.move),row.moveKey);return move;
  }
  for(const record of journal.records.slice(1)) {
    assert.equal(stopped,false,'RECORD-AFTER-STOP');assert.equal(state.winner,null,'RECORD-AFTER-TERMINAL');
    const ply=trace.length;assert.ok(ply<=spec.maxPly);const legal=api.variants(state),moves=sorted(legal.moves);legal.probes.forEach(remember);
    const eligible=state.phase==='mtaji'&&state.reserve.every(x=>x===0)&&ply>=spec.minCandidatePly&&moves.length>=spec.minRootWidth&&moves.length<=spec.maxRootWidth;
    if(record.kind==='source-screen') {
      assert.ok(eligible,'UNEXPECTED-SCREEN');assert.ok(!screens.some(x=>x.ply===ply),'DUPLICATE-SCREEN');
      assert.deepEqual(record.screen,Independent.inspect(state,ply,spec,api),'PREFIX-SCREEN-MISMATCH');screens.push(record.screen);record.screen.readIdentities.forEach(id=>requiredReads.add(id));
      if(record.screen.status.startsWith('SCREEN-'))stopped=true;
    } else {
      assert.ok(record.kind==='source-step'||record.kind==='source-stop','UNKNOWN-SOURCE-RECORD');assert.ok(ply<spec.maxPly);
      if(eligible)assert.equal(screens.at(-1)?.ply,ply,'MISSING-SAVED-SCREEN');
      const row=record.row;assert.equal(row.ply,ply);assert.equal(row.rawBefore,M.rawKey(state));
      const r=api.apply(state,select(row,moves));assert.deepEqual(row.outcome,detail(r),'PREFIX-TRANSITION-MISMATCH');remember(r);
      if(record.kind==='source-stop'){assert.notEqual(r.status,'TERMINATED');stopped=true;}
      else{assert.equal(r.status,'TERMINATED');trace.push(row);state=r.state;states.push(structuredClone(state));}
    }
  }
  let checkpointPly=null,checkpointScreens=null;
  if(input.checkpoint!==null) {
    assert.equal(input.checkpoint.resumeAuthorized,false);const source=input.checkpoint.source;
    assert.equal(source.evidenceClass,context.evidenceClass);assert.equal(source.seed,context.seed);
    assert.equal(scientific?source.sourceId:source.fixtureId,scientific?context.sourceId:context.fixtureId);
    assert.ok(Array.isArray(source.trace)&&source.trace.length<=trace.length);
    assert.deepEqual(source.trace,trace.slice(0,source.trace.length),'SNAPSHOT-TRACE-NOT-JOURNAL-PREFIX');
    assert.ok(Array.isArray(source.screens)&&source.screens.length<=screens.length);
    assert.deepEqual(source.screens,screens.slice(0,source.screens.length),'SNAPSHOT-SCREENS-NOT-JOURNAL-PREFIX');
    assert.ok(source.screens.every(x=>x.ply<=source.trace.length));
    // 各snapshotのstep以前の必須screenは省けない。最末端の未保存screenは推測しない。
    assert.deepEqual(source.screens.filter(x=>x.ply<source.trace.length),screens.filter(x=>x.ply<source.trace.length));
    assert.deepEqual(source.finalState,states[source.trace.length],'SNAPSHOT-FINAL-STATE-MISMATCH');
    const first=source.screens.find(x=>x.status==='BRANCH-ENVELOPE-ELIGIBLE');
    assert.deepEqual(source.firstEligible,first?{ply:first.ply,raw:first.root,state:states[first.ply],screenIndex:source.screens.indexOf(first)}:null);
    assert.equal(source.candidate,null,'PARTIAL-CANDIDATE-REFUSED');
    if(source.stop===null){assert.equal(source.selectionStatus,null);assert.equal(source.interruption,undefined);}
    else {
      assert.ok(typeof source.stop==='string'&&!['NATURAL-TERMINAL','PLY-LIMIT'].includes(source.stop),'COMPLETE-SOURCE-USE-FULL-VALIDATOR');
      assert.equal(source.selectionStatus,'SOURCE-FAILURE-NO-CANDIDATE');
      if(source.interruption)assert.equal(source.interruption.verification,'PREFIX-ONLY-NOT-FULL');
      else {
        assert.ok(stopped,'UNPROVEN-SOURCE-STOP');
        if(source.stop.startsWith('SCREEN-'))assert.equal(source.stop,screens.at(-1)?.status,'SNAPSHOT-STOP-MISMATCH');
        else {const row=journal.records.at(-1);assert.equal(row.kind,'source-stop');assert.deepEqual(source.stopped,row.row);assert.equal(source.stop,row.row.outcome.status);}
      }
    }
    checkpointPly=source.trace.length;checkpointScreens=source.screens.length;
  }
  let reads=null;
  if(input.reads) {
    reads=prefix(input.reads);
    const savedReads=new Set();for(const row of reads.records) {
      const decoded=Codec.decodeRaw(Buffer.from(row.payload,'base64'));assert.equal(M.rawKey(decoded),row.id,'READ-RAW-MISMATCH');
      assert.equal(typeof row.context,'string');
      if(!scientific)assert.ok(context.prior.has(row.id),'NOVEL-FIXTURE-RAW-REFUSED');savedReads.add(row.id);
    }
    for(const id of requiredReads)assert.ok(savedReads.has(id),'SAVED-READ-COVERAGE-MISSING');
  }
  const summary=x=>x&&{bytes:x.bytes,prefixBytes:x.prefixBytes,tailBytes:x.tailBytes,sha256:x.sha256,tailSha256:x.tailSha256,rows:x.records.length};
  return {verified:true,scope:'SAVED-PREFIX-ONLY-NOT-FULL',savedSteps:trace.length,savedScreens:screens.length,checkpointPly,checkpointScreens,
    journals:{source:summary(journal),receipt:summary(receipt),reads:summary(reads)},savedReadCoverageVerified:reads!==null,sourceComplete:false,fullSourceVerified:false,
    candidate:null,solution:null,resumeAuthorized:false,scientificSeedGenerationPerformed:false};
}
module.exports={verify};
