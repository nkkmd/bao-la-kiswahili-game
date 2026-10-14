"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {LIMITS,disk,createEnvelope}=require('../tools/research/g5-befcs-envelope/envelope.cjs');
const {createSession}=require('../tools/research/g5-befcs-envelope/transport-session.cjs');
const config=()=>({evidenceClass:'TECHNICAL-ENVELOPE-FIXTURE',scientificSeedsRead:0,limits:{...LIMITS}});
function fixture(){let now=0,m={rss:100,diskBytes:100};const e=createEnvelope(config(),()=>now,()=>m);return {e,setTime:t=>now=t,setMeasure:x=>m=x};}
test('科学分類と上限変更を計測・出力より前に拒否する',()=>{
  let reads=0;assert.throws(()=>createEnvelope({...config(),evidenceClass:'BEFCS-SCIENTIFIC-PIPELINE'},()=>{reads++;},()=>{}),/NOT-RELEASED/);assert.equal(reads,0);
  assert.throws(()=>createEnvelope({...config(),limits:{...LIMITS,maxTotalMs:1200001}},()=>0,()=>{}),/MUST-NOT-CHANGE/);
});
test('提案20分・領域180秒と終了予約180秒を同じ時計で監督する',()=>{
  const f=fixture();f.setTime(840000);const began=f.e.admitDomain();f.setTime(1019999);f.e.domainCheck(began);
  f.setTime(1020000);assert.throws(()=>f.e.domainCheck(began),/FINALIZATION-RESERVE/);assert.equal(f.e.status,'STOPPED');
  assert.throws(()=>f.e.sample(),/NO-RETRY/);f.e.sample('final');f.setTime(1199999);assert.equal(f.e.transportTimeout('final'),1);
  f.setTime(1200000);assert.throws(()=>f.e.finish(),/TOTAL-TIME/);
});
test('領域上限と残余不足を個別に保持する',()=>{
  const f=fixture();const began=f.e.admitDomain();f.setTime(180000);assert.throws(()=>f.e.domainCheck(began),/DOMAIN-TIME-LIMIT/);
  const g=fixture();g.setTime(840001);assert.throws(()=>g.e.admitDomain(),/INSUFFICIENT-DOMAIN-TIME/);
});
test('制御・Git・mirror一時領域と累積remote保存を同一容量へ課金する',()=>{
  const f=fixture();f.setMeasure({rss:1024,diskBytes:LIMITS.maxEvidenceBytes-LIMITS.storageReserveBytes-100});
  const release=f.e.reserve(60);assert.throws(()=>f.e.reserve(41),/STORAGE-LIMIT/);release();assert.equal(f.e.accounting.outstandingReservations,0);
  f.e.sample('final',100);assert.throws(()=>f.e.sample('final',LIMITS.storageReserveBytes+101),/STORAGE-LIMIT/);
  const g=fixture();g.e.chargeRemote(200);assert.equal(g.e.sample().chargedBytes,300);assert.throws(()=>g.e.chargeRemote(199),/CUMULATIVE/);
});
test('全cgroupメモリが上限を越えたら科学的な値へ置換せず停止する',()=>{
  const f=fixture();f.setMeasure({rss:LIMITS.maxRssBytes+1,diskBytes:1});assert.throws(()=>f.e.sample(),/TOTAL-MEMORY/);assert.equal(f.e.reason,'ENVELOPE-TOTAL-MEMORY-LIMIT');
});
test('disk会計は疎ファイルとhard linkを過少計数せずsymlinkを拒否する',()=>{
  const d=fs.mkdtempSync(path.join(os.tmpdir(),'envelope-disk-'));try{
    for(const n of ['evidence','control','git','mirror','verification'])fs.mkdirSync(path.join(d,n));
    const p=path.join(d,'git/a'),fd=fs.openSync(p,'w');fs.ftruncateSync(fd,1048576);fs.closeSync(fd);fs.linkSync(p,path.join(d,'mirror/a'));
    assert.equal(disk(d).logical,2097152);assert.ok(disk(d).charged>=2097152);
    fs.symlinkSync(p,path.join(d,'control/link'));assert.throws(()=>disk(d),/SYMLINK/);
  }finally{fs.rmSync(d,{recursive:true,force:true});}
});
const request=()=>({evidenceClass:'TECHNICAL-ENVELOPE-REGISTRY-FIXTURE',stageId:'ENVELOPE-TEST',runId:'fixture',runAttempt:1,binding:'a'.repeat(64),block:{start:1,count:4}});
function transport(){let r={sha:'1'.repeat(40),record:null},counter=1,failure=null;const calls=[];return {
  adapter:{async read(){calls.push('read');return structuredClone(r);},async update(record,expected){calls.push('update');assert.equal(expected,r.sha);if(failure==='before')throw Error('BEFORE-DISPATCH');r={sha:String(++counter).repeat(40),record:structuredClone(record)};if(failure==='after')throw Error('COMMITTED-RESPONSE-UNKNOWN');return {sha:r.sha};}},
  fail:x=>failure=x,get current(){return structuredClone(r);},calls};}
test('remote markerが成立しても応答不明なら許可0・retry禁止・区画保全になる',async()=>{
  const t=transport(),s=createSession(t.adapter,request());await s.begin();t.fail('after');let ack=0;
  await assert.rejects(async()=>{await s.permit(0);ack++;},/RESPONSE-UNKNOWN/);assert.equal(ack,0);assert.equal(s.marked,0);
  assert.equal(t.current.record.lease.consumes.length,1);assert.equal(s.status,'STOPPED');const n=t.calls.length;
  await assert.rejects(()=>s.permit(0),/NO-RETRY/);assert.equal(t.calls.length,n);
});
test('送信前失敗と終了mirror失敗は未完として停止する',async()=>{
  const t=transport(),s=createSession(t.adapter,request());await s.begin();t.fail('before');await assert.rejects(()=>s.permit(0),/BEFORE-DISPATCH/);
  assert.equal(t.current.record.lease.consumes.length,0);assert.equal(s.status,'STOPPED');
  const u=transport(),q=createSession(u.adapter,request());await q.begin();u.fail('before');await assert.rejects(()=>q.mirror({sha256:'b'.repeat(64),bytes:2},true));assert.equal(q.status,'STOPPED');
});
test('通信中に終了予約へ入れば永続markerがあっても許可を返さない',async()=>{
  const t=transport(),f=fixture(),adapter={...t.adapter,async update(r,e){const v=await t.adapter.update(r,e);if(r.lease.consumes.length)f.setTime(1020000);return v;}},s=createSession(adapter,request(),()=>f.e.sample());
  await s.begin();await assert.rejects(()=>s.permit(0),/FINALIZATION-RESERVE/);assert.equal(t.current.record.lease.consumes.length,1);assert.equal(s.marked,0);
});
test('技術transportは科学分類・提案seed区画・attempt 2を接続前に拒否する',()=>{
  const t=transport();for(const r of [{...request(),evidenceClass:'SCIENCE'},{...request(),block:{start:50613001,count:128}},{...request(),runAttempt:2}])assert.throws(()=>createSession(t.adapter,r));assert.equal(t.calls.length,0);
});
