"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const C=require('../tools/research/g5-befcs-capsule/codec.cjs'),T=require('../tools/research/g5-befcs-capsule/transport.cjs');
const env={GITHUB_ACTIONS:'true',GITHUB_REPOSITORY:'nkkmd/bao-la-kiswahili-game',GITHUB_EVENT_NAME:'push',GITHUB_RUN_ATTEMPT:'1',GITHUB_REF:'refs/heads/research/g5-capsule-20261016',GITHUB_RUN_ID:'123',BEFCS_FIXTURE_TOKEN:'fixture'};
function fixture(){const bytes=Buffer.from('known-fixture'),meta={rawBytes:C.IMAGE_BYTES,archiveBytes:bytes.length,archiveSha256:C.hash(bytes),imageSha256:'a'.repeat(64),sourceCommit:'484e3f659480a21fec2009fd4a355f9323191c17',sourceManifestSha256:'b'.repeat(64),evidenceClass:'TECHNICAL-SEALED-RUNTIME-IMAGE',scientificSeedsRead:0,finalScientificInputSet:false};return {bytes,meta};}
test('科学分類・別branch・retryと不整合archiveを通信前に拒否する',async()=>{
 for(const change of [{GITHUB_RUN_ATTEMPT:'2'},{GITHUB_REF:'refs/heads/main'},{GITHUB_EVENT_NAME:'workflow_dispatch'}])assert.throws(()=>T.ref({...env,...change},'complete'));
 const {bytes,meta}=fixture();for(const patch of [{scientificSeedsRead:1},{finalScientificInputSet:true},{archiveSha256:'0'.repeat(64)}]){let calls=0;await assert.rejects(()=>T.preserve(bytes,{...meta,...patch},'complete',env,async()=>{calls++;},()=>{}));assert.equal(calls,0);}
});
test('応答抑止後のGETと追加POSTをしない',async()=>{
 const {bytes,meta}=fixture(),blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');let n=0;
 const replies=[{sha:blob},{sha:'manifest'},{sha:'tree'},{sha:'commit'},{object:{sha:'commit'}}];const r=await T.preserve(bytes,meta,'ack-loss',env,async()=>replies[n++],()=>{});assert.equal(n,5);assert.equal(r.acknowledged,false);
});
test('通信失敗をretryしない',async()=>{const {bytes,meta}=fixture();let calls=0;await assert.rejects(()=>T.preserve(bytes,meta,'complete',env,async()=>{calls++;throw Error('lost');},()=>{}),/lost/);assert.equal(calls,1);});
test('圧縮は保存上限前で止まり原imageを変更しない',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'g5-capsule-'));try{const image=path.join(dir,'image');const input=crypto.randomBytes(4096);fs.writeFileSync(image,input);await assert.rejects(()=>C.seal(image,path.join(dir,'too-small.gz'),32),/ARCHIVE-BYTE-LIMIT/);assert.deepEqual(fs.readFileSync(image),input);const r=await C.seal(image,path.join(dir,'ok.gz'),8192);assert.equal(r.rawBytes,input.length);assert.equal(r.imageSha256,C.hash(input));assert.equal(r.archiveSha256,C.hash(fs.readFileSync(path.join(dir,'ok.gz'))));}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('manifestは重複・traversal・symlinkとsource bytes不一致を拒否する',()=>{
 const d=fs.mkdtempSync(path.join(os.tmpdir(),'g5-code-'));try{fs.mkdirSync(path.join(d,'tools'));const bytes=Buffer.from('fixture');fs.writeFileSync(path.join(d,'tools/a.cjs'),bytes);const file={path:'tools/a.cjs',mode:'100644',bytes:bytes.length,sha256:C.hash(bytes),gitBlob:crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex')};const m={evidenceClass:'TECHNICAL-RUNTIME-CAPSULE',scientificSeedsRead:0,finalScientificInputSet:false,sourceCommit:'a'.repeat(40),files:[file],totalBytes:bytes.length};assert.equal(C.verifyCode(d,m).files,1);assert.throws(()=>C.manifestValid({...m,files:[file,file]}));assert.throws(()=>C.manifestValid({...m,files:[{...file,path:'../tools/a.cjs'}]}));fs.writeFileSync(path.join(d,'tools/a.cjs'),'changed');assert.throws(()=>C.verifyCode(d,m));fs.unlinkSync(path.join(d,'tools/a.cjs'));fs.symlinkSync('/tmp',path.join(d,'tools/a.cjs'));assert.throws(()=>C.verifyCode(d,m));}finally{fs.rmSync(d,{recursive:true,force:true});}
});
test('archiveとmanifestを読み戻して一致するまでACKを与えない',async()=>{
 const {bytes,meta}=fixture(),blob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
 const replies=[{sha:blob},{sha:'manifest'},{sha:'tree'},{sha:'commit'},{object:{sha:'commit'}},{object:{sha:'commit'}},{tree:{sha:'tree'}},{encoding:'base64',content:bytes.toString('base64')},{content:Buffer.from(JSON.stringify(meta)).toString('base64')}];let n=0;
 const r=await T.preserve(bytes,meta,'complete',env,async()=>replies[n++],()=>{});assert.equal(n,9);assert.equal(r.acknowledged,true);
 let bad=0;await assert.rejects(()=>T.preserve(bytes,meta,'complete',env,async()=>{const x=replies[bad++];return bad===8?{...x,content:Buffer.from('wrong').toString('base64')}:x;},()=>{}));assert.equal(bad,8);
});
