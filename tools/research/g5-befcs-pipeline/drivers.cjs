"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const S=require('../g5-branch-envelope/source.cjs'),M=require('../g5-01/measurement.cjs');
function fixtureDriver(config){
 assert.equal(config.evidenceClass,'TECHNICAL-PIPELINE-FIXTURE');assert.equal(config.scientificSeedsRead,0);
 const F=require('../g5-branch-envelope/fixtures.cjs'),I=require('../g5-branch-envelope/independent-source.cjs'),C=require('../g5-branch-envelope/closure.cjs');
 const prior=F.priorFirewall();
 return {scientific:false,prior,
  source(n,permit,output,check,observe){
   const id='FIRST-48',p=F.sourceFixture(id),q=F.sourceFixture(id,{},true),context={evidenceClass:'TECHNICAL-FIXTURE',fixtureId:id,allowedSeeds:[1]};
   const api=S.paired(p.api,q.api,{check,observe});
   const source=S.generateFixture(1,config.sourceSpec,p.initial,api,new Set(),context,{check,observe,emit:r=>output.append('source.jsonl',r),checkpoint:(source,mode)=>output.snapshot('SOURCE_CHECKPOINT.json',{source,resumeAuthorized:false},Boolean(mode?.final))});
   I.replay(source,config.sourceSpec,q.initial,q.api,new Set(),context);return {...source,sourceId:'fixture/source-'+n};
  },
  freeze(sources){const value=S.freezeCandidates(sources,8);I.verifyFrozen(sources,8,value);return value;},
  closure(candidate,limits,output,check){const p=F.sourceFixture('FIRST-48'),q=F.sourceFixture('FIRST-48',{},true),reference={...q.api,variants(state){const v=q.api.variants(state);return {...v,moves:S.order(v.moves)};}};return C.runFixture({id:candidate.fixtureId,evidenceClass:p.evidenceClass,state:candidate.state,adapter:p.api},{id:candidate.fixtureId,evidenceClass:q.evidenceClass,state:candidate.state,adapter:reference},limits,output,new Set(),check);}
 };
}
function scienceDriver(config){
 const gate=require('../g5-befcs-workload/science-gate.cjs').openScience();
 assert.equal(config.evidenceClass,'BEFCS-SCIENTIFIC-PIPELINE');assert.equal(config.binding,gate.binding);assert.equal(config.count,128);
 // 追加entryも最終manifestの対象でなければworkerを初期化しない。
 const root=path.resolve(__dirname,'../../..'),manifest=JSON.parse(fs.readFileSync(path.join(root,'doc/research-generation-5/befcs-study1/SOURCE_MANIFEST.json')));
 for(const name of ['drivers.cjs','worker.cjs','run.cjs'])assert.match(manifest.files['tools/research/g5-befcs-pipeline/'+name]??'',/^[a-f0-9]{64}$/,'PIPELINE-NOT-BOUND');
 const spec=gate.spec;
 assert.deepEqual(config.limits,spec.resources);assert.deepEqual(config.closureLimits,spec.closure);
 assert.deepEqual(config.sourceSpec,{...spec.trajectory,...spec.selection,checkpointSourcePlyInterval:spec.resources.checkpointSourcePlyInterval});
 const P=require('../g5-method/object-engine.cjs'),Q=require('../g5-method/ring-engine.cjs');
 const Source=require('../g5-befcs-workload/scientific-source.cjs'),I=require('../g5-befcs-workload/independent-scientific-source.cjs'),C=require('../g5-befcs-workload/scientific-closure.cjs');
 const prior=require('../g5-branch-envelope/fixtures.cjs').priorFirewall();
 function adapter(engine,primary){return {variants(state){const probes=[];for(const m of engine.legalMoves(state))if(state.phase==='namua'&&m.type==='capture')for(const houseChoice of ['stop','use'])probes.push(engine.applyMove(state,{...m,houseChoice},{maxMicrostates:spec.closure.maxMicrostatesPerMove}));return {probes,moves:S.order(primary?engine.moveVariants(state,engine.legalMoves(state),{maxMicrostates:spec.closure.maxMicrostatesPerMove}):engine.moveVariants(state,{maxMicrostates:spec.closure.maxMicrostatesPerMove}))};},apply:(state,move)=>engine.applyMove(state,move,{maxMicrostates:spec.closure.maxMicrostatesPerMove})};}
 const primary=adapter(P,true),reference=adapter(Q,false);
 return {scientific:true,prior,
  source(n,permit,output,check,observe){
   assert.equal(permit.index,n);assert.equal(permit.logicalId,50613001+n);
   const context={...permit,evidenceClass:'BEFCS-SCIENTIFIC-SOURCE',sourceId:'BEFCS/source-'+n};
   const initial=P.initialState(),api=S.paired(primary,reference,{check,observe});
   const source=Source.generateSource(permit.logicalId,config.sourceSpec,initial,api,prior,context,{check,observe,emit:r=>output.append('source.jsonl',r),checkpoint:(source,mode)=>output.snapshot('SOURCE_CHECKPOINT.json',{source,resumeAuthorized:false},Boolean(mode?.final))});
   check();I.replay(source,config.sourceSpec,initial,reference,prior,context);check();return source;
  },
  freeze(sources){const value=Source.freezeCandidates(sources,8);I.verifyFrozen(sources,8,value);return value;},
  closure(candidate,limits,output,check){return C.runScientificClosure({id:candidate.sourceId,evidenceClass:'BEFCS-SCIENTIFIC-CLOSURE',state:candidate.state,adapter:primary},{id:candidate.sourceId,evidenceClass:'BEFCS-SCIENTIFIC-CLOSURE',state:candidate.state,adapter:reference},limits,output,prior,check);}
 };
}
module.exports={fixtureDriver,scienceDriver};
