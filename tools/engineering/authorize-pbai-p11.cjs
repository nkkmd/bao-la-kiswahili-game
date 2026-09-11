'use strict';
// 新規runや再実行が同じ集団を消費しないよう、開始前に一つのrun IDへ結び付ける。
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..'),doc=path.join(root,'doc/ai-engineering/public-ai-improvement-program-11');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
function output(allowed){fs.appendFileSync(process.env.GITHUB_OUTPUT,'allowed='+allowed+'\n');}
(async()=>{
 if(process.env.GITHUB_RUN_ATTEMPT!=='1'){output(false);return;}
 const spec=JSON.parse(fs.readFileSync(path.join(doc,'SPEC.json')));assert.equal(process.env.GITHUB_REPOSITORY,spec.authorization.repository);
 const deadline=Date.now()+600000;
 while(Date.now()<deadline){
  const url='https://api.github.com/repos/'+spec.authorization.repository+'/contents/doc/ai-engineering/public-ai-improvement-program-11/AUTHORIZATION.json?ref='+encodeURIComponent(spec.authorization.branch);
  const response=await fetch(url,{headers:{Authorization:'Bearer '+process.env.GITHUB_TOKEN,Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(15000)});
  if(response.status===404){await new Promise(r=>setTimeout(r,5000));continue;}
  if(!response.ok)throw Error('Authorization read failed: '+response.status);
  const result=await response.json(),a=JSON.parse(Buffer.from(result.content,'base64').toString());
  if(String(a.runId)!==process.env.GITHUB_RUN_ID||a.sourceCommit!==head){output(false);return;}
  assert.equal(a.program,'PBAI-P11');assert.equal(a.sourceLockSha256,sha(path.join(doc,'SOURCE_LOCK.json')));assert.equal(a.specSha256,sha(path.join(doc,'SPEC.json')));
  const out=path.join(root,'artifacts/pbai-p11/run');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'AUTHORIZATION.json'),JSON.stringify(a,null,2)+'\n',{flag:'wx'});output(true);console.log(JSON.stringify({authorized:true,runId:a.runId,sourceCommit:head}));return;
 }
 output(false);console.log('No run authorization; no seed consumed');
})().catch(e=>{console.error(e);process.exitCode=1;});
