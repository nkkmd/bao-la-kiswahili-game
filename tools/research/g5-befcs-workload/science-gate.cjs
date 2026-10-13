"use strict";
// 最終登録ファイルがまだ存在しない間は、科学sourceの初期化前に拒否する。
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../../..'),docs=path.join(root,'doc/research-generation-5/befcs-study1');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function openScience(){
 for(const f of ['SPEC.json','CONTRACT.md','AUTHORIZATION.json','SOURCE_MANIFEST.json','PROTECTED_INPUTS.json','CI_RECEIPT.json','PRE_EXECUTION_REVIEW.json'])assert.ok(fs.existsSync(path.join(docs,f)),'SCIENCE-GATE-NOT-FROZEN');
 const read=f=>JSON.parse(fs.readFileSync(path.join(docs,f))),spec=read('SPEC.json'),auth=read('AUTHORIZATION.json'),review=read('PRE_EXECUTION_REVIEW.json');
 assert.equal(spec.studyId,'BEFCS-STUDY1');assert.equal(spec.stageId,'BEFCS-S1-SUPPLY-2026-10-13-v1');assert.deepEqual(spec.seedBlock,{start:50613001,end:50613128,count:128});assert.equal(auth.executionAuthorized,true);assert.equal(auth.formalRelationRegistered,false);assert.equal(review.decision,'READY-FOR-ONE-SUPPLY-ATTEMPT');assert.equal(review.runAttempt,1);
 const manifest=read('SOURCE_MANIFEST.json'),protectedInputs=read('PROTECTED_INPUTS.json');for(const m of [manifest,protectedInputs])for(const [file,digest] of Object.entries(m.files)){assert.ok(!path.isAbsolute(file)&&!file.split('/').includes('..'));assert.equal(hash(fs.readFileSync(path.join(root,file))),digest,file);}
 for(const f of ['SPEC.json','CONTRACT.md','AUTHORIZATION.json','SOURCE_MANIFEST.json','PROTECTED_INPUTS.json','CI_RECEIPT.json'])assert.equal(hash(fs.readFileSync(path.join(docs,f))),review.files[f],f);
 return {spec,binding:hash(fs.readFileSync(path.join(docs,'PRE_EXECUTION_REVIEW.json')))};
}
function authorizeRead(seed,context){const g=openScience();assert.equal(context.evidenceClass,'BEFCS-SCIENTIFIC-SOURCE');assert.equal(context.runAttempt,1);assert.equal(context.binding,g.binding);assert.ok(Number.isInteger(context.index)&&context.index>=0&&context.index<128);assert.equal(seed,50613001+context.index);assert.equal(context.sourceId,'BEFCS/source-'+context.index);assert.equal(context.beforeRead,true);assert.match(context.remoteCommit,/^[a-f0-9]{40}$/);assert.ok(context.runId);return g;}
module.exports={openScience,authorizeRead};
