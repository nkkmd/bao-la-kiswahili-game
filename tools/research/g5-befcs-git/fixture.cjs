"use strict";
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const R=require('../g5-befcs-workload/registry.cjs'),I=require('../g5-befcs-workload/independent-registry.cjs'),{session}=require('../g5-befcs-pipeline/session.cjs');
const Policy=require('./policy.cjs');
const PREFIX=Buffer.from('BEFCS-GIT-TECHNICAL-FIXED-BYTES-NO-BAO-NO-PRNG\n'+Array.from({length:20},(_,n)=>'saved-prefix-'+n+'\n').join(''));
function clean(text){let value=String(text);const token=process.env.BEFCS_GIT_TOKEN;for(const secret of [token,token?Buffer.from('x-access-token:'+token).toString('base64'):null,process.env.GIT_CONFIG_VALUE_0])if(secret)value=value.split(secret).join('[REDACTED]');return value;}
function errorRecord(error){return {message:clean(error.message),status:error.status??null,signal:error.signal??null,stdout:clean(error.stdout??''),stderr:clean(error.stderr??'')};}
function capture(fn){try{return {ok:true,value:fn()};}catch(error){return {ok:false,error:errorRecord(error)};}}
function withProxyOpen(repository,url,ref){
 const keys=['GIT_CONFIG_COUNT','GIT_CONFIG_KEY_2','GIT_CONFIG_VALUE_2'],before=keys.map(k=>process.env[k]);
 try{process.env.GIT_CONFIG_COUNT='3';process.env.GIT_CONFIG_KEY_2='http.proxy';process.env.GIT_CONFIG_VALUE_2='http://127.0.0.1:1';return R.open(repository,url,ref);}
 finally{keys.forEach((k,n)=>{if(before[n]===undefined)delete process.env[k];else process.env[k]=before[n];});}
}
function replay(row,directory){
 assert.equal(row.evidenceClass,Policy.CLASS);assert.equal(row.scientificSeedsRead,0);assert.equal(row.scientificLeaseCreated,false);assert.equal(row.scientificStudyRegistered,false);
 const folder=path.join(directory,row.mode);fs.mkdirSync(folder,{recursive:true});const file=path.join(folder,'REGISTRY.bundle'),repo=path.join(folder,'independent');fs.writeFileSync(file,Buffer.from(row.registryBundleBase64,'base64'));
 cp.execFileSync('git',['init','--quiet',repo]);cp.execFileSync('git',['-C',repo,'fetch','--quiet',file,row.registryRef]);assert.deepEqual(I.verify(repo,row.registryHead),row.verified);
 const raw=JSON.parse(cp.execFileSync('git',['-C',repo,'show',row.registryHead+':REGISTRY.json'],{encoding:'utf8'}));
 assert.equal(raw.leases.length,1);assert.deepEqual(raw.leases[0],row.lease);assert.equal(raw.mirrors.length,row.mirrorCount);
 assert.deepEqual(row.lease.block,{start:1,count:4});assert.equal(row.lease.runAttempt,1);assert.equal(row.registryRef,Policy.fixtureRef({evidenceClass:Policy.CLASS,scientificSeedsRead:0,runId:row.runId,runAttempt:1,mode:row.mode}));
 const {consumes,status,...identity}=row.lease;assert.deepEqual(identity,row.request);assert.equal(status,'BLOCK-QUARANTINED-NO-RETRY');
 assert.equal(row.ackCount,row.mode==='complete'||row.mode==='proxy-final-mirror'?1:0);assert.equal(row.verified.logicalReadsMarked,row.mode==='complete'||row.mode==='lost-response'||row.mode==='proxy-final-mirror'?1:0);
 assert.equal(row.unacknowledgedMarkers,row.mode==='lost-response'?1:0);assert.equal(row.finalMirrorSaved,row.mode==='complete');
 assert.equal(row.sessionStatus,row.mode==='complete'?'FINISHED':'STOPPED');assert.equal(row.retryRefused,true);assert.equal(row.solution,null);assert.equal(row.resumeAuthorized,false);
 if(row.mode==='stale-cas'){assert.equal(row.staleCas.ok,false);assert.match(row.staleCas.error.stdout,/\[rejected\].*\(stale info\)/);assert.equal(row.headUnchangedAfterStale,true);}
 if(row.mode.startsWith('proxy-')&&row.authenticatedGitUsed){assert.match(row.failure.stderr,/127\.0\.0\.1.*(?:port 1|:1)|Failed to connect/);assert.equal(row.proxyFailureIsActualGitFailure,true);}
 return true;
}
function exercise(directory,c,url,live=false,check=()=>{}){
 Policy.validate(c);assert.equal(fs.existsSync(directory),false,'EXISTING-CASE-NO-RETRY');fs.mkdirSync(directory,{recursive:true});
 const ref=Policy.fixtureRef(c),repo=path.join(directory,'registry'),registry=R.open(repo,url,ref);assert.equal(registry.read().sha,null,'EXISTING-REMOTE-REF-NO-RETRY');
 const request={evidenceClass:'TECHNICAL-REGISTRY-FIXTURE',stageId:'GIT-'+c.mode+'-'+c.runId,runId:c.runId,runAttempt:1,binding:R.hash('BEFCS-AUTHENTICATED-GIT-v1-'+c.mode),block:{start:1,count:4}};
 let proxyActive=false,ackCount=0;const denied=live?withProxyOpen(path.join(directory,'blocked'),url,ref):null;
 const selected=()=>{if(proxyActive){if(live)return denied;throw Error('INJECTED-LOCAL-NETWORK-UNAVAILABLE');}return registry;};
 const adapter={...registry,read(){return selected().read();},mirror(...args){return selected().mirror(...args);},
 consume(stage,run,index,callback,binding){return selected().consume(stage,run,index,(logicalId,sha)=>{if(c.mode==='lost-response')throw Error('INJECTED-POST-COMMIT-RESPONSE-LOSS');return callback(logicalId,sha);},binding);}};
 const protocol=session(adapter,request,registry.acquire,check),leaseHead=protocol.begin();
 protocol.checkpoint({'PREFIX.jsonl':PREFIX});let staleCas=null,headUnchangedAfterStale=null,failure=null;
 const message={index:0,binding:request.binding};
 if(c.mode==='stale-cas') {
   const before=registry.read().sha;
   staleCas=capture(()=>registry.git(['push','--porcelain','--force-with-lease='+ref+':'+leaseHead,url,leaseHead+':'+ref]));
   assert.equal(staleCas.ok,false,'STALE-CAS-NOT-REJECTED');assert.match(staleCas.error.stdout,/\[rejected\].*\(stale info\)/,'CAS-REJECTION-REASON-NOT-PROVEN');
   headUnchangedAfterStale=registry.read().sha===before;assert.equal(headUnchangedAfterStale,true);protocol.stop();failure=staleCas.error;
 } else {
   if(c.mode==='proxy-before-consume')proxyActive=true;
   const consumed=capture(()=>protocol.permit(message));
   if(consumed.ok){ackCount++;if(c.mode==='proxy-final-mirror')proxyActive=true;const finish=capture(()=>protocol.finish({'PREFIX.jsonl':PREFIX,'FINAL.json':JSON.stringify({final:true,scientificSeedsRead:0,solution:null})}));if(!finish.ok)failure=finish.error;}
   else failure=consumed.error;
 }
 assert.equal(protocol.status,c.mode==='complete'?'FINISHED':'STOPPED');
 const retry=capture(()=>protocol.permit({index:protocol.marked,binding:request.binding}));assert.equal(retry.ok,false);assert.match(retry.error.message,/SESSION-(?:STOPPED|FINISHED)-NO-RETRY/);
 // 停止後は読取・原object保存だけを行い、consume/mirrorを再開しない。
 check();const current=registry.read(),verified=I.verify(repo,current.sha);registry.git(['update-ref',ref,current.sha]);const bundle=path.join(directory,'REGISTRY.bundle');registry.git(['bundle','create',bundle,ref]);
 const row={evidenceClass:Policy.CLASS,mode:c.mode,runId:c.runId,request,registryRef:ref,registryHead:current.sha,registryBundleBase64:fs.readFileSync(bundle).toString('base64'),
   verified,lease:current.record.leases[0],mirrorCount:current.record.mirrors.length,ackCount,unacknowledgedMarkers:verified.logicalReadsMarked-ackCount,
   sessionStatus:protocol.status,sessionMarked:protocol.marked,finalMirrorSaved:c.mode==='complete',staleCas,headUnchangedAfterStale,failure,retryRefused:true,
   authenticatedGitUsed:live,proxyFailureIsActualGitFailure:live&&c.mode.startsWith('proxy-'),responseLossInjectedAfterActualCommit:c.mode==='lost-response',
   scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,scienceHostReleased:false,solution:null,resumeAuthorized:false};
 const verifyDirectory=path.join(directory,'replay');fs.mkdirSync(verifyDirectory);replay(row,verifyDirectory);check();return row;
}
module.exports={PREFIX,clean,errorRecord,capture,replay,exercise};
