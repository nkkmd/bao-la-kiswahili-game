"use strict";
// 取得後の保存byte検算器。fixture実行入力ではなく、CI出力bindingへ別固定する。
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),M=require(root+'/tools/research/g5-01/measurement.cjs'),Micro=require(root+'/tools/research/g5-method/microstate-check.cjs');
const R=require(root+'/tools/research/g5-befcs-workload/registry.cjs'),J=require(root+'/tools/research/g5-branch-envelope/storage.cjs'),F=require(root+'/tools/research/g5-branch-envelope/fixtures.cjs');
const IS=require(root+'/tools/research/g5-branch-envelope/independent-source.cjs'),IC=require(root+'/tools/research/g5-branch-envelope/independent-closure.cjs'),B=require(root+'/tools/research/g5-compact-bfs/reference.cjs');
const Codec=require(root+'/tools/research/g5-method/independent-raw-codec.cjs');
const order=xs=>[...xs].sort((a,b)=>M.moveKey(a)<M.moveKey(b)?-1:1);
function prefix(trace,screens,spec,initial,api){
 let state=structuredClone(initial),random=1,index=0,first=null;assert.ok(trace.length<=spec.maxPly);
 function screen(ply){if(screens[index]?.ply===ply){const actual=IS.inspect(state,ply,spec,api);assert.deepEqual(screens[index],actual);if(actual.status==='BRANCH-ENVELOPE-ELIGIBLE'&&first===null)first={ply,raw:M.rawKey(state),state:structuredClone(state),screenIndex:index};index++;}}
 for(let n=0;n<trace.length;n++){
  const row=trace[n];screen(n);assert.equal(row.ply,n);assert.equal(row.rawBefore,M.rawKey(state));assert.equal(row.randomBefore,random);const moves=order(api.variants(state).moves),ceiling=4294967296-(4294967296%moves.length);assert.ok(row.draws.length>0);
  // 保存済みdraw列の長さだけ照合し、prefixの先へ進めない。
  for(let i=0;i<row.draws.length;i++){let x=random>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;random=x>>>0;assert.equal(row.draws[i],random);assert.equal(random<ceiling,i===row.draws.length-1);}
  const move=moves[random%moves.length];assert.equal(M.moveKey(move),row.moveKey);assert.equal(M.moveKey(row.move),row.moveKey);const r=api.apply(state,move);Micro.check(r);assert.equal(r.status,'TERMINATED');
  assert.deepEqual(row.outcome,{status:r.status,to:r.state===null?null:M.rawKey(r.state),metadata:r.state===null?null:{reason:r.state.reason??'',turn:r.state.turn},relays:r.relays,microstateCount:r.microstates.length,microstateHash:M.digest(r.microstates),cycle:r.cycle,witness:r.state===null?r:null});state=r.state;
 }
 screen(trace.length);assert.equal(index,screens.length);return {state,first};
}
function verify(saved){
 assert.equal(saved.evidenceClass,'TECHNICAL-CONTAINED-WORKLOAD-FIXTURE');assert.equal(saved.scientificSeedsRead,0);const rows=[],prior=F.priorFirewall();
 for(const [mode,entries]of Object.entries(saved.filesByMode)){
  const files={};for(const [p,f]of Object.entries(entries)){assert.ok(!p.startsWith('/')&&!p.split('/').some(n=>n==='..'||n==='.'));const b=Buffer.from(saved.objects?.[f.sha256]??f.base64,'base64');assert.equal(b.length,f.bytes);assert.equal(R.hash(b),f.sha256);files[p]=b;}
  const q=F.sourceFixture('FIRST-48',{},true),spec=require(root+'/tools/research/g5-befcs-pipeline/run.cjs').fixtureConfig('complete','','').sourceSpec,sources=[];let journals=0,partial=0,journalSteps=0;
  for(const [p,b]of Object.entries(files))if(p.endsWith('.jsonl')){const end=b.lastIndexOf(10)+1,records=end?J.replayJournal(b.subarray(0,end)):[];journals++;
   if(p.endsWith('/source.jsonl')){assert.equal(records[0].kind,'fixture-seed');assert.equal(records[0].seed,1);assert.equal(records[0].fixtureId,'FIRST-48');const trace=records.filter(r=>r.kind==='source-step').map(r=>r.row),screens=records.filter(r=>r.kind==='source-screen').map(r=>r.screen);prefix(trace,screens,spec,q.initial,q.api);journalSteps+=trace.length;}
   if(p.endsWith('/reads.jsonl'))for(const r of records){assert.equal(M.rawKey(Codec.decodeRaw(Buffer.from(r.payload,'base64'))),r.id);assert.ok(prior.has(r.id),'NOVEL-FIXTURE-RAW-REFUSED');}
  }
  for(const name of Object.keys(files).filter(p=>p.endsWith('/SOURCE_CHECKPOINT.json')).sort()){
   const source=JSON.parse(files[name]).source;assert.equal(source.evidenceClass,'TECHNICAL-FIXTURE');assert.equal(source.fixtureId,'FIRST-48');assert.equal(source.seed,1);
   if(source.stop===null){assert.equal(source.selectionStatus,null);assert.equal(source.candidate,null);const p=prefix(source.trace,source.screens,spec,q.initial,q.api);assert.deepEqual(source.finalState,p.state);assert.deepEqual(source.firstEligible,p.first);partial++;}
   else{IS.replay(source,spec,q.initial,q.api,new Set(),{fixtureId:'FIRST-48',allowedSeeds:[1]});sources.push(source);}
  }
  let frozen=null,closures=0;if(files['summary/FROZEN.json']){frozen=JSON.parse(files['summary/FROZEN.json']);IS.verifyFrozen(sources,8,frozen);}
  const api={...q.api,variants(s){const v=q.api.variants(s);return {...v,moves:order(v.moves)};}};
  for(const name of Object.keys(files).filter(p=>p.endsWith('/closure.bin'))){const domain=B.decode(files[name]);IC.verifyEdges(domain,api);assert.equal(domain.complete,true);assert.deepEqual(B.build({id:'FIRST-48',evidenceClass:'ABSTRACT-NOT-BAO-EVIDENCE',state:frozen.candidates[0].state,adapter:api},{maxStates:10000,maxEdges:128000,maxDomainMs:1000}),domain);closures++;}
  rows.push({mode,evidenceFiles:Object.keys(files).length,journals,journalSteps,fullSourceCheckpoints:sources.length,partialCheckpoints:partial,partialSourceVerification:partial?'PREFIX-ONLY-NOT-FULL':null,completeAbstractClosures:closures,verified:true,scientificSeedsRead:0});
 }
 return rows;
}
if(require.main===module)console.log(JSON.stringify(verify(JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname,'CI_IMAGE_EVIDENCE.json.gz')))))));
module.exports={verify,prefix};
