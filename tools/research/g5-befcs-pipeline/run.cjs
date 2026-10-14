"use strict";
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),assert=require('node:assert/strict'),zlib=require('node:zlib');
const R=require('../g5-befcs-workload/registry.cjs'),I=require('../g5-befcs-workload/independent-registry.cjs'),W=require('../g5-befcs-workload/run.cjs');
const {session}=require('./session.cjs'),{supervise}=require('../g5-befcs-operations/supervisor.cjs'),{captureTree}=require('../g5-befcs-workload/capture-tree.cjs'),{atomic}=require('../g5-befcs-workload/worker.cjs');
const base=path.resolve(__dirname,'../../..'),docs=path.join(base,'doc/research-generation-5/befcs-pipeline-20261013');
function fixtureConfig(mode,output,control){return {evidenceClass:'TECHNICAL-PIPELINE-FIXTURE',scientificSeedsRead:0,count:128,mode,output,control,binding:R.hash('BEFCS-PIPELINE-TECHNICAL-v1'),sourceSpec:{maxPly:512,minCandidatePly:48,minRootWidth:2,maxRootWidth:4,minReplyWidth:1,maxReplyWidth:8,maxAggregateReplyWidth:16,checkpointSourcePlyInterval:32},limits:{maxTotalMs:1200000,maxDomainMs:180000,maxRssBytes:1073741824,maxEvidenceBytes:268435456,storageReserveBytes:16777216},closureLimits:{maxStates:10000,maxEdges:128000,maxDomainMs:180000}};}
async function orchestrate(directory,config,registry,protocol,context,options={}){
 assert.equal(config.evidenceClass,'TECHNICAL-PIPELINE-FIXTURE','SCIENTIFIC-HOST-NOT-RELEASED');
 fs.mkdirSync(config.output,{recursive:true});fs.mkdirSync(config.control,{recursive:true});const output=config.output,control=config.control,began=performance.now(),phases=[];
 const check=()=>{if(performance.now()-began>=config.limits.maxTotalMs)throw Error('HOST-GLOBAL-TIME-LIMIT');};
 const workerConfig={...config};if(options.docker){workerConfig.output='/evidence';workerConfig.control='/control';}
 const file=path.join(directory,'CONFIG.json');fs.writeFileSync(file,JSON.stringify(workerConfig));
 let container=null,armed=false,lastReads=-1,lastAt=performance.now(),mirrorFailed=false,ackCount=0,peakHostRssBytes=0;
 const supervision={maxTotalMs:config.limits.maxTotalMs,maxRssBytes:config.limits.maxRssBytes,pollMs:20,mirrorEveryTicks:1};
 protocol.begin();
 if(options.docker)container=cp.execFileSync('docker',['create','--user',process.getuid()+':'+process.getgid(),'--network=none','--memory=1073741824','--memory-swap=1073741824','--pids-limit=32','-v',base+':/repo:ro','-v',output+':/evidence','-v',control+':/control','-v',file+':/config.json:ro','node:24.19.0-bookworm-slim','node','/repo/tools/research/g5-befcs-pipeline/worker.cjs','/config.json'],{encoding:'utf8'}).trim();
 const execution=await supervise(options.docker?'docker':process.execPath,options.docker?['start','-a',container]:[path.join(__dirname,'worker.cjs'),file],supervision,{
  sample(sample){peakHostRssBytes=Math.max(peakHostRssBytes,process.memoryUsage().rss);if(sample.bytes+process.memoryUsage().rss>config.limits.maxRssBytes)throw Error('COMBINED-HOST-WORKER-RSS-LIMIT');if(config.mode==='kill-after-prefix'&&!armed&&fs.existsSync(path.join(output,'source-000/SOURCE_CHECKPOINT.json'))){armed=true;supervision.maxTotalMs=performance.now()-began+100;}},
  async mirror(final){
   if(final&&container){const state=JSON.parse(cp.execFileSync('docker',['inspect',container],{encoding:'utf8'}))[0];if(state.State.Running)cp.execFileSync('docker',['kill',container],{stdio:'ignore'});cp.execFileSync('docker',['wait',container],{timeout:30000});}
   const pending=path.join(control,'REQUEST.json');let message=null;
   if(!final&&fs.existsSync(pending)){const req=JSON.parse(fs.readFileSync(pending));if(req.index===protocol.marked)message=req;else assert.equal(req.index,protocol.marked-1);}
   const required=final||protocol.marked+(message?1:0)-lastReads>=8||performance.now()-lastAt>=5000;
   let files=null;
   if(required){if(config.mode==='mirror-failure'&&!final&&protocol.marked>=8&&!mirrorFailed){mirrorFailed=true;protocol.stop();throw Error('INJECTED-MIRROR-FAILURE');}if(config.mode==='final-mirror-failure'&&final){protocol.stop();throw Error('INJECTED-FINAL-MIRROR-FAILURE');}files=captureTree(output,config.limits.maxEvidenceBytes).files;files['PHASE.json']=Buffer.from(JSON.stringify({final,marked:protocol.marked,scientificSeedsRead:0,solution:null}));}
   if(final){
    if(protocol.status==='LEASED')protocol.finish(files);
    else {const current=registry.read(),lease=current.record.leases.find(l=>l.runId===config.runId);const sequence=current.record.mirrors.filter(m=>m.stageId===lease.stageId).length;registry.mirror(lease.stageId,lease.runId,sequence,files);}
    phases.push(true);return;
   }
   if(message){try{check();const permit=protocol.permit(message,files);check();atomic(path.join(control,'ACK-'+permit.index+'.json'),context(permit));ackCount++;if(files){phases.push(false);lastReads=protocol.marked;lastAt=performance.now();}}catch(error){protocol.stop();throw error;}}
   else if(files){protocol.checkpoint(files);phases.push(false);lastAt=performance.now();}
  }});
 if(container){const s=JSON.parse(cp.execFileSync('docker',['inspect',container],{encoding:'utf8'}))[0];assert.equal(s.HostConfig.Memory,1073741824);assert.equal(s.HostConfig.MemorySwap,1073741824);assert.equal(s.HostConfig.NetworkMode,'none');execution.container={memoryBytes:s.HostConfig.Memory,memorySwapBytes:s.HostConfig.MemorySwap,image:s.Image,state:s.State,pidsLimit:s.HostConfig.PidsLimit};cp.execFileSync('docker',['rm','-f',container],{stdio:'ignore'});}
 const resultFile=path.join(output,'summary/RESULT.json'),worker=fs.existsSync(resultFile)?JSON.parse(fs.readFileSync(resultFile)):null;
 return {execution,worker,phases,ackCount,hostProtocolStatus:protocol.status,finalMirrorSaved:phases.at(-1)===true,technicalComplete:config.evidenceClass==='TECHNICAL-PIPELINE-FIXTURE'&&worker?.workerComplete===true&&protocol.status==='FINISHED'&&execution.status==='WORKER-COMPLETE',peakHostRssBytes,elapsedHostMs:performance.now()-began};
}
async function exercise(mode,options={}){
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'befcs-pipeline-'));
 try{
  const output=path.join(directory,'evidence'),control=path.join(directory,'control'),repo=path.join(directory,'registry');
  const remote=options.checkpoint?path.join(options.checkpoint,'registry.git'):path.join(directory,'remote.git');if(options.checkpoint)fs.mkdirSync(options.checkpoint,{recursive:true});cp.execFileSync('git',['init','--quiet','--bare',remote]);
  const config=fixtureConfig(mode,output,control);if(['domain-budget','domain-time','domain-time-budget','final-mirror-failure'].includes(mode))config.count=16;if(mode==='global-time')config.limits.maxTotalMs=4000;
  const registry=R.open(repo,remote);config.runId='pipeline-'+mode;
  const request={evidenceClass:'TECHNICAL-REGISTRY-FIXTURE',stageId:'PIPELINE-'+mode,runId:config.runId,runAttempt:1,binding:config.binding,block:{start:1,count:128}};
  const protocol=session(registry,request,registry.acquire);
  const result=await orchestrate(directory,config,registry,protocol,p=>p,options),current=registry.read(),verified=I.verify(repo,current.sha);
  assert.equal(verified.scientificSeedsRead,0);result.unacknowledgedMarkers=verified.logicalReadsMarked-result.ackCount;assert.ok(result.unacknowledgedMarkers===0||result.unacknowledgedMarkers===1);assert.equal(fs.existsSync(path.join(control,'ACK-'+result.ackCount+'.json')),false);
  if(mode==='complete'){assert.equal(result.technicalComplete,true,JSON.stringify(result));assert.equal(result.worker.read,128);assert.equal(result.worker.candidates,1);assert.equal(result.worker.closures,1);}
  else {assert.equal(result.technicalComplete,false);if(mode==='final-mirror-failure'){assert.equal(result.worker.workerComplete,true);assert.equal(result.finalMirrorSaved,false);assert.equal(result.execution.status,'MIRROR-FAILURE');}else assert.equal(result.finalMirrorSaved,true);
   if(mode==='mirror-failure'){assert.equal(result.execution.status,'MIRROR-FAILURE');assert.ok(result.ackCount>=8&&result.ackCount<128);}
   if(mode==='kill-after-prefix'){assert.equal(result.execution.status,'GLOBAL-TIME-LIMIT');assert.ok(result.ackCount>0&&result.ackCount<128);}
   if(mode==='global-time'){assert.ok(result.execution.status==='GLOBAL-TIME-LIMIT'||result.worker?.status==='GLOBAL-TIME-LIMIT'||result.execution.mirrorError==='HOST-GLOBAL-TIME-LIMIT');assert.ok(result.ackCount<128);}
   if(mode==='source-budget'){assert.equal(result.worker.status,'GLOBAL-EVIDENCE-RESERVE-LIMIT');assert.equal(result.ackCount,0);}
   if(mode==='domain-budget')assert.equal(result.worker.status,'GLOBAL-EVIDENCE-RESERVE-LIMIT');
   if(mode==='domain-time')assert.equal(result.worker.status,'DOMAIN-TIME-LIMIT');
   if(mode==='domain-time-budget')assert.equal(result.worker.status,'INSUFFICIENT-DOMAIN-TIME-BUDGET');
  }
  cp.execFileSync('git',['update-ref',registry.ref,current.sha],{cwd:repo});const bundle=path.join(directory,'REGISTRY.bundle');cp.execFileSync('git',['bundle','create',bundle,registry.ref],{cwd:repo});
  const row={mode,fixtureSourceCount:config.count,...result,verified,registryHead:current.sha,registryRef:registry.ref,registryBundleBase64:fs.readFileSync(bundle).toString('base64'),scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false};
  replay(row);return row;
 }finally{fs.rmSync(directory,{recursive:true,force:true});}
}
function scientificReadiness(){require('../g5-befcs-workload/science-gate.cjs').openScience();throw Error('SCIENTIFIC-HOST-RESOURCE-REVIEW-NOT-FROZEN');}
function replay(row){
 W.replay(row);const directory=fs.mkdtempSync(path.join(os.tmpdir(),'befcs-pipeline-proof-'));
 try{
  const bundle=path.join(directory,'REGISTRY.bundle'),repo=path.join(directory,'repo');fs.writeFileSync(bundle,Buffer.from(row.registryBundleBase64,'base64'));cp.execFileSync('git',['init','--quiet',repo]);cp.execFileSync('git',['fetch','--quiet',bundle,row.registryRef],{cwd:repo});
  const git=(name)=>cp.execFileSync('git',['show',row.registryHead+':'+name],{cwd:repo,maxBuffer:16778240}),record=JSON.parse(git('REGISTRY.json')),mirror=record.mirrors.at(-1);if(!mirror)return true;
  const objects=new Map(),restored={};for(const f of mirror.files)restored[f.name]=Buffer.concat(f.chunks.map(c=>{if(!objects.has(c.sha256))objects.set(c.sha256,git(c.object));return objects.get(c.sha256);}));
  const coverage=JSON.parse(restored['COVERAGE.json']),files={};for(const [key,p] of Object.entries(coverage.paths))files[p]=restored[key];
  const F=require('../g5-branch-envelope/fixtures.cjs'),Independent=require('../g5-branch-envelope/independent-source.cjs'),q=F.sourceFixture('FIRST-48',{},true),spec=fixtureConfig('complete','','').sourceSpec,sources=[];
  for(const name of Object.keys(files).filter(p=>p.endsWith('/SOURCE_CHECKPOINT.json')).sort()){const source=JSON.parse(files[name]).source;Independent.replay(source,spec,q.initial,q.api,new Set(),{fixtureId:'FIRST-48',allowedSeeds:[1]});sources.push(source);}
  if(files['summary/FROZEN.json'])Independent.verifyFrozen(sources,8,JSON.parse(files['summary/FROZEN.json']));
  const reference={...q.api,variants(state){const v=q.api.variants(state);return {...v,moves:require('../g5-branch-envelope/source.cjs').order(v.moves)};}};
  for(const name of Object.keys(files).filter(p=>p.endsWith('/closure.bin'))){const domain=require('../g5-compact-bfs/reference.cjs').decode(files[name]);require('../g5-branch-envelope/independent-closure.cjs').verifyEdges(domain,reference);if(domain.complete){const state=JSON.parse(files['summary/FROZEN.json']).candidates[0].state;assert.deepEqual(require('../g5-compact-bfs/reference.cjs').build({id:'FIRST-48',evidenceClass:'ABSTRACT-NOT-BAO-EVIDENCE',state,adapter:reference},{maxStates:10000,maxEdges:128000,maxDomainMs:1000}),domain);}}
  return true;
 }finally{fs.rmSync(directory,{recursive:true,force:true});}
}
function binding(outputs=true){for(const name of ['SOURCE_MANIFEST.json','PROTECTED_INPUTS.json',...(outputs?['OUTPUT_BINDING.json']:[])]){const m=JSON.parse(fs.readFileSync(path.join(docs,name)));for(const [p,h] of Object.entries(m.files))assert.equal(R.hash(fs.readFileSync(path.join(base,p))),h,p);}return true;}
async function write(docker=false){binding(false);const sourceDigest=R.hash(fs.readFileSync(path.join(docs,'SOURCE_MANIFEST.json'))),target=docker?path.join(base,'artifacts/local/befcs-pipeline'):path.join(docs,'results');fs.mkdirSync(target,{recursive:true});const rows=[];for(const mode of ['complete','mirror-failure','kill-after-prefix','source-budget','domain-budget','domain-time','domain-time-budget','global-time','final-mirror-failure']){console.error('pipeline-scenario',mode);const row=await exercise(mode,{docker,checkpoint:docker?path.join(target,'live-'+mode):null});rows.push(row);fs.writeFileSync(path.join(target,'SCENARIO-'+mode+'.json.gz'),zlib.gzipSync(Buffer.from(JSON.stringify(row))));console.error('pipeline-scenario-saved',mode);}binding(false);assert.equal(R.hash(fs.readFileSync(path.join(docs,'SOURCE_MANIFEST.json'))),sourceDigest,'INPUT-FREEZE-CHANGED');const bytes=Buffer.from(JSON.stringify(rows));fs.writeFileSync(path.join(target,'TECHNICAL_EVIDENCE.json.gz'),zlib.gzipSync(bytes));const result={decision:'WORKER-HOST-PIPELINE-FIXTURE-PASS-SCIENTIFIC-RELEASE-PENDING',sourceManifestSha256:sourceDigest,evidenceSha256:R.hash(bytes),scenarios:rows.map(({registryBundleBase64,...r})=>r),scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false,conservativeReadIdentities:103355,formalRelationRegistered:false};fs.writeFileSync(path.join(target,'RESULT.json'),JSON.stringify(result,null,2)+'\n');return result;}
function check(){binding();const file=path.join(docs,'results'),result=JSON.parse(fs.readFileSync(path.join(file,'RESULT.json'))),bytes=zlib.gunzipSync(fs.readFileSync(path.join(file,'TECHNICAL_EVIDENCE.json.gz')));assert.equal(R.hash(bytes),result.evidenceSha256);assert.equal(R.hash(fs.readFileSync(path.join(docs,'SOURCE_MANIFEST.json'))),result.sourceManifestSha256);const rows=JSON.parse(bytes);rows.forEach(replay);assert.deepEqual(rows.map(({registryBundleBase64,...r})=>r),result.scenarios);return result;}
if(require.main===module){const mode=process.argv[2];assert.ok(['--write','--check','--bindings','--ci-live','--science-readiness'].includes(mode));Promise.resolve(mode==='--science-readiness'?scientificReadiness():mode==='--check'?check():mode==='--bindings'?binding(false):write(mode==='--ci-live')).then(r=>console.log(JSON.stringify(r))).catch(e=>{console.error(e);process.exitCode=1;});}
module.exports={fixtureConfig,orchestrate,exercise,replay,scientificReadiness,binding,write,check};
