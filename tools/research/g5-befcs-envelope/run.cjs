"use strict";
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {LIMITS}=require('./envelope.cjs');const base=path.resolve(__dirname,'../../..'),docs='doc/research-generation-5/befcs-envelope-20261013';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function bindings(){for(const f of ['SOURCE_MANIFEST.json','PROTECTED_INPUTS.json'])for(const [p,h]of Object.entries(JSON.parse(fs.readFileSync(path.join(base,docs,f))).files))assert.equal(hash(fs.readFileSync(path.join(base,p))),h,p);return true;}
function verifyPrefix(bytes){let previous='0'.repeat(64),seq=0;for(const line of bytes.toString().trimEnd().split('\n')){const row=JSON.parse(line),{hash:digest,...body}=row;assert.equal(row.seq,seq++);assert.equal(row.previous,previous);assert.equal(hash(JSON.stringify(body)),digest);previous=digest;}assert.equal(seq,10);}
async function live(){
  bindings();const digest=hash(fs.readFileSync(path.join(base,docs,'SOURCE_MANIFEST.json'))),out=path.join(base,'artifacts/local/befcs-envelope');fs.mkdirSync(out,{recursive:true});
  const rows=[];
  for(const mode of ['complete','detached','oom']){
    const began=performance.now(),work=path.join(out,mode);fs.mkdirSync(work);let container=null;
    const header={mode,sourceManifestSha256:digest,scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false};fs.writeFileSync(path.join(out,'BEFORE-'+mode+'.json'),JSON.stringify(header,null,2)+'\n');
    try{
      container=cp.execFileSync('docker',['create','--user',process.getuid()+':'+process.getgid(),'--network=none','--memory=1073741824','--memory-swap=1073741824','--pids-limit=32','-v',base+':/repo:ro','-v',work+':/work','node:24.19.0-bookworm','node','/repo/tools/research/g5-befcs-envelope/container.cjs',mode],{encoding:'utf8',timeout:30000}).trim();
      const child=cp.spawn('docker',['start','-a',container],{stdio:'inherit'}),remaining=LIMITS.maxTotalMs-(performance.now()-began),timer=setTimeout(()=>child.kill('SIGKILL'),Math.max(1,remaining));
      let exit;try{exit=await new Promise((r,j)=>{child.once('error',j);child.once('exit',(code,signal)=>r({code,signal}));});}finally{clearTimeout(timer);}
      const inspection=JSON.parse(cp.execFileSync('docker',['inspect',container],{encoding:'utf8',timeout:30000}))[0];
      fs.writeFileSync(path.join(out,'INSPECT-'+mode+'.json'),JSON.stringify({exit,elapsedOuterMs:performance.now()-began,hostConfig:inspection.HostConfig,state:inspection.State,image:inspection.Image},null,2)+'\n');
      assert.equal(inspection.State.Running,false);assert.equal(exit.code,0);assert.equal(inspection.HostConfig.Memory,LIMITS.maxRssBytes);assert.equal(inspection.HostConfig.MemorySwap,LIMITS.maxRssBytes);assert.equal(inspection.HostConfig.PidsLimit,32);assert.equal(inspection.HostConfig.NetworkMode,'none');
      const result=JSON.parse(fs.readFileSync(path.join(work,'RESULT.json'))),prefix=fs.readFileSync(path.join(work,'evidence/PREFIX.jsonl'));verifyPrefix(prefix);assert.equal(hash(prefix),result.prefixSha256);assert.deepEqual(fs.readFileSync(path.join(work,'mirror/PREFIX.jsonl')),prefix);
      assert.equal(result.scientificSeedsRead,0);assert.equal(result.finalLocalMirrorSaved,true);if(mode!=='oom')assert.ok(result.accounting.rss<=LIMITS.maxRssBytes);assert.ok(result.accounting.chargedBytes<=LIMITS.maxEvidenceBytes);
      if(mode==='complete')assert.equal(result.technicalComplete,true);else assert.equal(result.technicalComplete,false);
      if(mode==='detached')assert.equal(result.detachedObserved,true);if(mode==='oom')assert.ok(result.oomKills>0);
      rows.push({...header,...result,containerStoppedBeforeOuterInspection:true,image:inspection.Image,elapsedOuterMs:performance.now()-began});fs.writeFileSync(path.join(out,'SCENARIO-'+mode+'.json'),JSON.stringify(rows.at(-1),null,2)+'\n');
    }finally{if(container)cp.execFileSync('docker',['rm','-f',container],{stdio:'ignore',timeout:30000});}
  }
  bindings();assert.equal(hash(fs.readFileSync(path.join(base,docs,'SOURCE_MANIFEST.json'))),digest);
  const result={decision:'TOTAL-ENVELOPE-TECHNICAL-PASS-SCIENTIFIC-DEPLOYMENT-PENDING',sourceManifestSha256:digest,scenarios:rows,scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false};fs.writeFileSync(path.join(out,'RESULT.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));return result;
}
if(require.main===module)Promise.resolve(process.argv[2]==='--bindings'?bindings():process.argv[2]==='--ci-live'?live():Promise.reject(Error('TECHNICAL-MODE-REQUIRED'))).catch(e=>{console.error(e);process.exitCode=1;});
module.exports={bindings,verifyPrefix,live};
