"use strict";
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict'),zlib=require('node:zlib');
const Policy=require('./policy.cjs'),F=require('./fixture.cjs'),{LIMITS,disk}=require('../g5-befcs-envelope/envelope.cjs'),{hash}=require('../g5-befcs-workload/registry.cjs');
const root=path.resolve(__dirname,'../../..'),docs=path.join(root,'doc/research-generation-5/befcs-git-20261014');
function bindings(){for(const n of ['SOURCE_MANIFEST.json','PROTECTED_INPUTS.json'])for(const [p,h]of Object.entries(JSON.parse(fs.readFileSync(path.join(docs,n))).files))assert.equal(hash(fs.readFileSync(path.join(root,p))),h,p);return true;}
function auth(){
 const token=process.env.BEFCS_GIT_TOKEN;assert.ok(token);assert.ok(!/[\r\n]/.test(token));
 process.env.GIT_CONFIG_COUNT='2';process.env.GIT_CONFIG_KEY_0='http.https://github.com/.extraheader';process.env.GIT_CONFIG_VALUE_0='AUTHORIZATION: basic '+Buffer.from('x-access-token:'+token).toString('base64');
 process.env.GIT_CONFIG_KEY_1='credential.helper';process.env.GIT_CONFIG_VALUE_1='';process.env.GIT_TERMINAL_PROMPT='0';
 for(const k of ['GIT_TRACE','GIT_TRACE_CURL','GIT_CURL_VERBOSE','GIT_TRACE_PACKET','GIT_TRACE2'])delete process.env[k];
}
function save(target,rows,resources=null){
 const bytes=Buffer.from(JSON.stringify(rows));fs.writeFileSync(path.join(target,'TECHNICAL_EVIDENCE.json.gz'),zlib.gzipSync(bytes));
 const result={decision:resources?'AUTHENTICATED-GIT-FIXTURE-PASS-SCIENCE-GATES-PENDING':'LOCAL-GIT-FIXTURE-PASS-REMOTE-NOT-TESTED',sourceManifestSha256:hash(fs.readFileSync(path.join(docs,'SOURCE_MANIFEST.json'))),evidenceSha256:hash(bytes),
   cases:rows.map(({registryBundleBase64,...row})=>row),resources,scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,scienceHostReleased:false};
 fs.writeFileSync(path.join(target,'RESULT.json'),JSON.stringify(result,null,2)+'\n');return result;
}
function local(target=path.join(docs,'results')){
 bindings();fs.mkdirSync(target,{recursive:true});const temp=fs.mkdtempSync(path.join(os.tmpdir(),'befcs-git-'));
 try{const rows=[];for(const mode of Policy.MODES){const remote=path.join(temp,mode+'.git');cp.execFileSync('git',['init','--quiet','--bare',remote]);rows.push(F.exercise(path.join(temp,mode),{evidenceClass:Policy.CLASS,scientificSeedsRead:0,mode,runId:'1',runAttempt:1},remote));}return save(target,rows);}
 finally{fs.rmSync(temp,{recursive:true,force:true});}
}
function service(directory,unit){
 bindings();const url=Policy.remote(process.env);assert.equal(process.getuid(),0);assert.match(unit,/^bao-g5-git-[a-f0-9]{16}\.service$/);
 const raw=fs.readFileSync('/proc/self/cgroup','utf8').trim();assert.ok(raw.startsWith('0::/'));assert.equal(path.posix.basename(raw.slice(3)),unit);const group='/sys/fs/cgroup'+raw.slice(3);
 const num=n=>Number(fs.readFileSync(group+'/'+n,'utf8'));assert.equal(num('memory.max'),LIMITS.maxRssBytes);assert.equal(num('memory.swap.max'),0);assert.equal(num('pids.max'),64);
 const began=performance.now(),ordinaryEnd=LIMITS.maxTotalMs-LIMITS.finalizationReserveMs,rows=[];auth();
 fs.mkdirSync(directory+'/tmp');process.env.TMPDIR=directory+'/tmp';cp.execFileSync('fallocate',['-l',String(LIMITS.storageReserveBytes),directory+'/FINAL_RESERVE']);
 function check(){assert.ok(performance.now()-began<ordinaryEnd,'GIT-FINALIZATION-RESERVE');assert.ok(disk(directory).charged<LIMITS.maxEvidenceBytes-LIMITS.storageReserveBytes,'GIT-STORAGE-RESERVE');}
 for(const mode of Policy.MODES){check();const row=F.exercise(directory+'/'+mode,{evidenceClass:Policy.CLASS,scientificSeedsRead:0,mode,runId:process.env.GITHUB_RUN_ID,runAttempt:1},url,true,check);rows.push(row);fs.writeFileSync(directory+'/CASE-'+mode+'.json.gz',zlib.gzipSync(Buffer.from(JSON.stringify(row))));}
 fs.rmSync(directory+'/FINAL_RESERVE');const resources={cgroup:raw,memoryMaxBytes:num('memory.max'),swapMaxBytes:num('memory.swap.max'),pidsMax:num('pids.max'),memoryPeakBytes:num('memory.peak'),memoryEvents:fs.readFileSync(group+'/memory.events','utf8'),workspace:disk(directory),elapsedServiceMs:performance.now()-began,
   transportAndReplayInSameCgroup:true,dockerUsed:false,wholePipelineIntegrated:false,wholeStartupArtifactDeadlineProven:false};save(directory,rows,resources);bindings();assert.ok(performance.now()-began<LIMITS.maxTotalMs);
}
function live(){
 bindings();Policy.remote(process.env);const directory=path.join(root,'artifacts/local/befcs-git');const stats=fs.statfsSync(directory);assert.ok(stats.blocks*stats.bsize<=LIMITS.maxEvidenceBytes,'PHYSICAL-FILESYSTEM-NOT-CAPPED');
 const unit='bao-g5-git-'+crypto.randomBytes(8).toString('hex')+'.service';
 const args=['--preserve-env=BEFCS_GIT_TOKEN','systemd-run','--quiet','--wait','--unit='+unit,'--property=MemoryMax='+LIMITS.maxRssBytes,'--property=MemorySwapMax=0','--property=TasksMax=64','--property=KillMode=control-group','--property=RuntimeMaxSec=1200','--property=StandardOutput=null','--property=StandardError=null',
   '--setenv=BEFCS_GIT_TOKEN','--setenv=PATH='+process.env.PATH,...['GITHUB_ACTIONS','GITHUB_REPOSITORY','GITHUB_EVENT_NAME','GITHUB_RUN_ID','GITHUB_RUN_ATTEMPT','GITHUB_REF'].map(k=>'--setenv='+k+'='+process.env[k]),process.execPath,__filename,'--service',directory,unit];
 const child=cp.spawnSync('sudo',args,{timeout:LIMITS.maxTotalMs+10000,encoding:'utf8',maxBuffer:65536});assert.equal(child.status,0,F.clean(child.stderr));
 return JSON.parse(fs.readFileSync(directory+'/RESULT.json'));
}
function check(){bindings();const bytes=zlib.gunzipSync(fs.readFileSync(docs+'/results/TECHNICAL_EVIDENCE.json.gz')),r=JSON.parse(fs.readFileSync(docs+'/results/RESULT.json'));assert.equal(hash(bytes),r.evidenceSha256);assert.equal(hash(fs.readFileSync(docs+'/SOURCE_MANIFEST.json')),r.sourceManifestSha256);const temp=fs.mkdtempSync(path.join(os.tmpdir(),'befcs-git-replay-'));try{for(const row of JSON.parse(bytes))F.replay(row,temp);}finally{fs.rmSync(temp,{recursive:true,force:true});}return r;}
if(require.main===module){try{let result;switch(process.argv[2]){case '--bindings':result=bindings();break;case '--write':result=local();break;case '--check':result=check();break;case '--ci-live':result=live();break;case '--service':service(process.argv[3],process.argv[4]);break;default:throw Error('TECHNICAL-MODE-REQUIRED');}if(result)console.log(JSON.stringify(result));}catch(error){if(process.argv[2]==='--service')try{fs.writeFileSync(process.argv[3]+'/SERVICE_ERROR.json',JSON.stringify(F.errorRecord(error))+'\n');}catch{}console.error(F.clean(error.message));process.exitCode=1;}}
module.exports={bindings,local,check};
