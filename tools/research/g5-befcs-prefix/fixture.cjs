"use strict";
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const F=require('../g5-branch-envelope/fixtures.cjs'),S=require('../g5-branch-envelope/source.cjs'),Storage=require('../g5-branch-envelope/storage.cjs');
const spec={...require('../../../doc/research-generation-5/branch-envelope-preflight-20261013/CONFIG.json').sourceLimits,checkpointSourcePlyInterval:8};
const modes=['before-checkpoint','stale-checkpoint','screen-boundary','step-boundary','resource-stop'];
const permit={index:0,logicalId:1,binding:Storage.hash('BEFCS-PREFIX-ABSTRACT-FIXTURE-v1'),remoteCommit:'1'.repeat(40),runAttempt:1,beforeRead:true};
function context(){return {evidenceClass:'TECHNICAL-FIXTURE',fixtureId:'FIRST-48',seed:1,allowedSeeds:[1],...permit,prior:F.priorFirewall()};}
function generate(directory,mode) {
  assert.ok(modes.includes(mode));const output=Storage.store(directory,{maxEvidenceBytes:8388608,storageReserveBytes:1048576});
  output.append('receipt.jsonl',permit);const p=F.sourceFixture('FIRST-48'),q=F.sourceFixture('FIRST-48',{},true),prior=F.priorFirewall(),seen=new Set();let steps=0;
  const observe=(state,context)=>{const id=require('../g5-01/measurement.cjs').rawKey(state);assert.ok(prior.has(id));if(seen.has(id))return;seen.add(id);const Codec=require('../g5-method/raw-codec.cjs');output.append('reads.jsonl',{id,payload:Codec.encodeRaw(state).toString('base64'),context});};
  const check=()=>{if(mode==='resource-stop'&&steps>=10)throw new S.Stop('GLOBAL-TIME-LIMIT');};
  S.generateFixture(1,spec,p.initial,S.paired(p.api,q.api,{check,observe}),new Set(),context(),{check,observe,
    emit(record){output.append('source.jsonl',record);if(record.kind==='source-step')steps++;
      if((mode==='before-checkpoint'&&steps===2)||(mode==='stale-checkpoint'&&steps===10)||(mode==='step-boundary'&&steps===49)
        ||(mode==='screen-boundary'&&record.kind==='source-screen'&&record.screen.ply===48))process.kill(process.pid,'SIGKILL');},
    checkpoint(source,mode){output.snapshot('SOURCE_CHECKPOINT.json',{source,resumeAuthorized:false},Boolean(mode?.final));}});
  output.close();
}
function input(directory){const read=name=>fs.readFileSync(path.join(directory,name));return {journal:read('source.jsonl'),receipt:read('receipt.jsonl'),reads:read('reads.jsonl'),
  checkpoint:fs.existsSync(path.join(directory,'SOURCE_CHECKPOINT.json'))?JSON.parse(read('SOURCE_CHECKPOINT.json')):null};}
function validate(value){const q=F.sourceFixture('FIRST-48',{},true);return require('./verify.cjs').verify(value,spec,q.initial,q.api,context());}
if(require.main===module){assert.equal(process.argv.length,4);generate(process.argv[2],process.argv[3]);}
module.exports={spec,modes,permit,context,generate,input,validate};
