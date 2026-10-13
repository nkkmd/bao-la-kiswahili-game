"use strict";
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),assert=require('node:assert/strict');
const W=require('../g5-befcs-workload/run.cjs'),S=require('../g5-branch-envelope/storage.cjs');
function filesProof(files,spec){
 const F=require('../g5-branch-envelope/fixtures.cjs'),I=require('../g5-branch-envelope/independent-source.cjs'),V=require('../g5-befcs-prefix/verify.cjs'),q=F.sourceFixture('FIRST-48',{},true),prior=F.priorFirewall(),sources=[];
 let full=0,partial=0;const proofs=[];
 const dirs=[...new Set(Object.keys(files).filter(p=>/^source-\d{3}\/source\.jsonl$/.test(p)).map(p=>p.split('/')[0]))].sort();
 for(const dir of dirs){const cpName=dir+'/SOURCE_CHECKPOINT.json',checkpoint=files[cpName]?JSON.parse(files[cpName]):null;
  if(checkpoint&&typeof checkpoint.source.stop==='string'&&!checkpoint.source.interruption){I.replay(checkpoint.source,spec,q.initial,q.api,new Set(),{fixtureId:'FIRST-48',allowedSeeds:[1]});sources.push(checkpoint.source);full++;}
  else{const receipt=S.replayJournal(files[dir+'/receipt.jsonl'])[0],context={evidenceClass:'TECHNICAL-FIXTURE',fixtureId:'FIRST-48',seed:1,allowedSeeds:[1],prior,...receipt};const result=V.verify({journal:files[dir+'/source.jsonl'],receipt:files[dir+'/receipt.jsonl'],reads:files[dir+'/reads.jsonl'],checkpoint},spec,q.initial,q.api,context);proofs.push({dir,...result});partial++;}
 }
 if(files['summary/FROZEN.json']){assert.equal(partial,0);I.verifyFrozen(sources,8,JSON.parse(files['summary/FROZEN.json']));}
 const reference={...q.api,variants(state){const value=q.api.variants(state);return {...value,moves:require('../g5-branch-envelope/source.cjs').order(value.moves)};}};
 let closures=0;for(const name of Object.keys(files).filter(p=>p.endsWith('/closure.bin'))){const domain=require('../g5-compact-bfs/reference.cjs').decode(files[name]);require('../g5-branch-envelope/independent-closure.cjs').verifyEdges(domain,reference);if(domain.complete){const state=JSON.parse(files['summary/FROZEN.json']).candidates[0].state;assert.deepEqual(require('../g5-compact-bfs/reference.cjs').build({id:'FIRST-48',evidenceClass:'ABSTRACT-NOT-BAO-EVIDENCE',state,adapter:reference},{maxStates:10000,maxEdges:128000,maxDomainMs:1000}),domain);closures++;}}
 return {fullSources:full,partialSources:partial,completeClosures:closures,partialProofs:proofs,sourceGenerationPerformed:false};
}
function replay(row,spec){W.replay(row);const temp=fs.mkdtempSync(path.join(os.tmpdir(),'remote-joined-proof-'));try{
 const bundle=path.join(temp,'REGISTRY.bundle'),repo=path.join(temp,'repo');fs.writeFileSync(bundle,Buffer.from(row.registryBundleBase64,'base64'));cp.execFileSync('git',['init','--quiet',repo]);cp.execFileSync('git',['-C',repo,'fetch','--quiet',bundle,row.registryRef]);
 const git=p=>cp.execFileSync('git',['-C',repo,'show',row.registryHead+':'+p],{maxBuffer:50331648+1024});const record=JSON.parse(git('REGISTRY.json')),last=record.mirrors.at(-1);if(!last)return {fullSources:0,partialSources:0,completeClosures:0,partialProofs:[],sourceGenerationPerformed:false};
 const restored={};for(const file of last.files)restored[file.name]=Buffer.concat(file.chunks.map(c=>git(c.object)));const coverage=JSON.parse(restored['COVERAGE.json']),files={};for(const [key,p]of Object.entries(coverage.paths))files[p]=restored[key];return filesProof(files,spec);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}}
module.exports={filesProof,replay};
