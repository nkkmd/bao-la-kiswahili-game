"use strict";
// 原Git objectと保存journalだけを読む。通信・source生成・再開を行わない。
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto'),zlib=require('node:zlib');
const Policy=require('../g5-befcs-remote-stop-v3/policy.cjs'),I=require('../g5-befcs-workload/independent-registry.cjs'),Replay=require('../g5-befcs-remote-joined/replay.cjs'),P=require('../g5-befcs-pipeline/run.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function verify(directory){
 const read=n=>JSON.parse(fs.readFileSync(path.join(directory,n))),header=read('HEADER.json'),c=header.remoteConfig;Policy.validate(c);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'remote-review-'));try{
 const repo=temp+'/repo',bundle=directory+'/REGISTRY.bundle';cp.execFileSync('git',['init','--quiet',repo]);cp.execFileSync('git',['-C',repo,'fetch','--quiet',bundle,Policy.ref(c)]);
 const git=args=>cp.execFileSync('git',['-C',repo,...args],{maxBuffer:67108864}),head=git(['rev-parse','FETCH_HEAD']).toString().trim(),verified=I.verify(repo,head),record=JSON.parse(git(['show',head+':REGISTRY.json']));assert.equal(record.leases.length,1);
 const lease=record.leases[0];assert.equal(lease.runId,c.runId);assert.equal(lease.block.count,128);
 const acks=fs.readdirSync(directory+'/control').filter(n=>/^ACK-\d+\.json$/.test(n)).length;
 for(let n=0;n<acks;n++){const ack=read('control/ACK-'+n+'.json');assert.equal(ack.index,n);assert.equal(ack.logicalId,n+1);assert.equal(ack.beforeRead,true);assert.equal(ack.binding,lease.binding);cp.execFileSync('git',['-C',repo,'merge-base','--is-ancestor',ack.remoteCommit,head]);assert.equal(JSON.parse(git(['show',ack.remoteCommit+':REGISTRY.json'])).leases[0].consumes.length,n+1);}
 assert.equal(fs.existsSync(directory+'/control/ACK-'+acks+'.json'),false);const unack=verified.logicalReadsMarked-acks;assert.ok(unack===0||unack===1);
 const last=record.mirrors.at(-1),restored={},files={};let remoteProof={fullSources:0,partialSources:0,completeClosures:0,partialProofs:[],sourceGenerationPerformed:false};
 const spec=P.fixtureConfig('complete','','').sourceSpec;
 if(last){for(const f of last.files)restored[f.name]=Buffer.concat(f.chunks.map(p=>git(['show',head+':'+p.object])));const coverage=JSON.parse(restored['COVERAGE.json']);for(const [key,p]of Object.entries(coverage.paths))files[p]=restored[key];remoteProof=Replay.filesProof(files,spec);}
 const captured=require('../g5-befcs-workload/capture-tree.cjs').captureTree(directory+'/evidence',Policy.LIMITS.maxEvidenceBytes).files,coverage=JSON.parse(captured['COVERAGE.json']),localFiles={};for(const [key,p]of Object.entries(coverage.paths))localFiles[p]=captured[key];const localProof=Replay.filesProof(localFiles,spec);
 const scenario=fs.existsSync(directory+'/SCENARIO.json')?read('SCENARIO.json'):null;
 if(scenario){assert.equal(scenario.registryHead,head);assert.equal(scenario.registryRef,Policy.ref(c));assert.deepEqual(scenario.verified,verified);assert.equal(scenario.ackCount,acks);assert.equal(scenario.unacknowledgedMarkers,unack);assert.deepEqual(scenario.remoteMirrorProof,remoteProof);assert.deepEqual(scenario.localSourceProof,localProof);for(const k of ['scientificLeaseCreated','scientificStudyRegistered','resumeAuthorized'])assert.equal(scenario[k],false);assert.equal(scenario.scientificSeedsRead,0);assert.equal(scenario.solution,null);}
 const resultPresent=fs.existsSync(directory+'/RESULT.json');
 if(resultPresent){const result=read('RESULT.json'),bytes=zlib.gunzipSync(fs.readFileSync(directory+'/TECHNICAL_EVIDENCE.json.gz'));assert.equal(hash(bytes),result.evidenceSha256);const full=JSON.parse(bytes);assert.ok(scenario);for(const [k,v]of Object.entries(scenario))assert.deepEqual(full[k],v,k);assert.equal(result.decision,'REMOTE-JOINED-FIXTURE-PASS-SCIENCE-GATES-PENDING');if(c.mode==='complete'){assert.equal(acks,128);assert.equal(full.technicalComplete,true);assert.equal(remoteProof.fullSources,128);assert.equal(remoteProof.completeClosures,1);}else assert.equal(full.technicalComplete,false);}
 const resources=read('RESOURCE.json');for(const [n,max]of Object.entries({parent:Policy.LIMITS.maxRssBytes,...Policy.PARTITIONS})){assert.equal(resources[n].max,String(max));assert.equal(resources[n].swapMax,'0');assert.ok(resources[n].peak<=max);}
 assert.deepEqual(read('WORK_STOPPED.json').procs,[]);assert.equal(read('WORKER_BOUNDARY.json').beforeWorkerModule,true);assert.equal(read('WORKER_CREDENTIALS.json').credentialsRemoved,true);
 const serviceError=fs.existsSync(directory+'/SERVICE_ERROR.json')?read('SERVICE_ERROR.json'):null,host=fs.existsSync(directory+'/HOST_RESULT.json')?read('HOST_RESULT.json'):null,completed=fs.existsSync(directory+'/COMPLETED.json');
 if(serviceError){assert.equal(resultPresent,false);assert.equal(completed,false);assert.ok(!scenario||scenario.technicalComplete===false);}
 return {verifiedSavedEvidence:true,fixturePassed:resultPresent&&!serviceError,mode:c.mode,runId:c.runId,registryHead:head,registryRef:Policy.ref(c),registryBlobSha:git(['rev-parse',head+':REGISTRY.json']).toString().trim(),registry:verified,ackCount:acks,unacknowledgedMarkers:unack,remoteProof,localProof,parentPeak:resources.parent.peak,resultPresent,serviceError,guard:host?.guard??null,finalMirrorSaved:host?.finalMirrorSaved===true,technicalComplete:resultPresent&&scenario?.technicalComplete===true,completedRecordPresent:completed,completionClaimAuthorized:resultPresent&&!serviceError&&scenario?.technicalComplete===true,stops:fs.existsSync(directory+'/WATCH.json')?read('WATCH.json'):null,sourceGenerationPerformed:false,scientificSeedsRead:0,resumeAuthorized:false,solution:null};
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
}
if(require.main===module)console.log(JSON.stringify(verify(path.resolve(process.argv[2])),null,2));module.exports={verify};
