"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),crypto=require('node:crypto');
const T=require('../tools/research/g5-befcs-integrated/transport.cjs'),R=require('../tools/research/g5-befcs-integrated/run.cjs');
const env={GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:'nkkmd/bao-la-kiswahili-game',GITHUB_EVENT_NAME:'push',GITHUB_RUN_ATTEMPT:'1',GITHUB_REF:'refs/heads/research/g5-resume-audit-20261015',GITHUB_RUN_ID:'123',BEFCS_FIXTURE_TOKEN:'fixture'};
const payload=mode=>Buffer.from(JSON.stringify({evidenceClass:'TECHNICAL-INTEGRATED-FIXTURE',inputBlob:'4c35ece242bc55a57a4ceebdbaaa815dadc666a7',mode,scientificSeedsRead:0,workCompleted:mode!=='enospc',workErrno:mode==='enospc'?28:null}));
test('旧ref・科学分類・異なる診断payloadを保存前に拒否する',async()=>{
 assert.match(T.validate(env,'complete'),/^refs\/heads\/research\/g5-integrated-preservation-/);
 for(const mode of ['complete','enospc','ack-loss']){let calls=0;await assert.rejects(()=>T.preserve(Buffer.from('{}'),mode,env,async()=>{calls++;},()=>{}));assert.equal(calls,0);}
});
test('ENOSPCはwork未完の診断だけを保存しACKを区別する',async()=>{
 const bytes=payload('enospc'),blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
 const replies=[{sha:blob},{sha:'tree'},{sha:'commit'},{object:{sha:'commit'}},{object:{sha:'commit'}},{tree:{sha:'tree'}},{encoding:'base64',content:bytes.toString('base64')}];let n=0;
 const r=await T.preserve(bytes,'enospc',env,async()=>replies[n++],()=>{});assert.equal(r.acknowledged,true);assert.equal(JSON.parse(bytes).workCompleted,false);assert.equal(n,7);
});
test('ACK抑止後は追加POSTをしない',async()=>{
 const bytes=payload('ack-loss'),blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');let n=0;
 const replies=[{sha:blob},{sha:'tree'},{sha:'commit'},{object:{sha:'commit'}}];const r=await T.preserve(bytes,'ack-loss',env,async()=>replies[n++],()=>{});assert.equal(n,4);assert.equal(r.acknowledged,false);
});
test('backing imageとmounted viewを二重に数えずsidecarを含める',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'g5-integrated-'));try{const mount=path.join(temp,'view');fs.mkdirSync(mount);fs.writeFileSync(path.join(temp,'image'),Buffer.alloc(4096));const first=R.backingCharge(temp,mount);fs.writeFileSync(path.join(mount,'shared'),Buffer.alloc(1048576));assert.equal(R.backingCharge(temp,mount),first);fs.writeFileSync(path.join(temp,'receipt'),Buffer.alloc(8192));assert.ok(R.backingCharge(temp,mount)>=first+8192);fs.symlinkSync('/tmp',path.join(temp,'outside'));assert.throws(()=>R.backingCharge(temp,mount));}finally{fs.rmSync(temp,{recursive:true,force:true});}
});
