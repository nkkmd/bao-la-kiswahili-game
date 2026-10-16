"use strict";
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {ownScope}=require('../g5-befcs-lifecycle/os-fixture.cjs'),{create}=require('../g5-befcs-lifecycle/ledger.cjs'),{LIMITS}=require('../g5-befcs-envelope/envelope.cjs');
const {backingCharge}=require('../g5-befcs-integrated/run.cjs'),C=require('./codec.cjs'),T=require('./transport.cjs');
const base=path.resolve(__dirname,'../../..'),manifestPath=path.join(base,'doc/research-generation-5/befcs-capsule-20261016/CODE_MANIFEST.json');
async function run(output,mode,unit,env=process.env){
 const started=performance.now(),ref=T.ref(env,mode);assert.equal(process.getuid(),0);const root=ownScope(unit,fs.readFileSync('/proc/self/cgroup','utf8'));
 const image=path.join(output,'WORKSPACE.img'),mount=path.join(output,'workspace'),archive=path.join(output,'EVIDENCE.img.gz');
 assert.ok(!fs.existsSync(output),'NEW-OUTPUT-REQUIRED');let mounted=false,remoteBytes=0,source=null,moduleCheck=null,archiveMeta=null,remote=null,finished=null,failure=null;
 const commands=[],manifest=JSON.parse(fs.readFileSync(manifestPath));C.manifestValid(manifest);
 const read=n=>Number(fs.readFileSync(root+'/'+n,'utf8'));
 const ledger=create({evidenceClass:'TECHNICAL-WHOLE-LIFECYCLE-FIXTURE',scientificSeedsRead:0,limits:{...LIMITS}},()=>performance.now()-started,
 ()=>({scopeCreatedBeforeCheckout:true,controllerIncluded:fs.readFileSync(root+'/cgroup.procs','utf8').trim().split(/\s+/).includes(String(process.pid)),scopeId:root,hardMemoryBytes:read('memory.max'),swapMaxBytes:read('memory.swap.max'),coveredRoles:['supervisor','checkout','worker','transport','preserver'],memoryPeakBytes:read('memory.peak'),workspaceBytes:backingCharge(output,mount),remoteBytes,accountingComplete:true}));
 function save(file,value){const fd=fs.openSync(file,'wx',0o600);try{fs.writeFileSync(fd,JSON.stringify(value,null,2)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}
 function exec(command,args,cwd){ledger.sample();const r=cp.spawnSync(command,args,{cwd,timeout:120000,encoding:'utf8',maxBuffer:65536,env:{PATH:env.PATH,HOME:mounted?path.join(mount,'home'):output,TMPDIR:mounted?path.join(mount,'tmp'):output,GIT_TERMINAL_PROMPT:'0',GIT_CONFIG_NOSYSTEM:'1'}});commands.push({command,args,status:r.status,signal:r.signal,stdout:r.stdout?.slice(-8192),stderr:r.stderr?.slice(-8192)});assert.equal(r.status,0,'CAPSULE-COMMAND-FAILED:'+command);if(command==='mount')mounted=true;if(command==='umount')mounted=false;ledger.sample();return r;}
 try{
 ledger.enter('checkout');fs.mkdirSync(output,{recursive:true});const fd=fs.openSync(image,'wx');fs.ftruncateSync(fd,C.IMAGE_BYTES);fs.closeSync(fd);fs.mkdirSync(mount);
 exec('mkfs.ext4',['-q','-F','-m','0',image]);exec('mount',['-o','loop,nosuid,nodev,noexec',image,mount]);assert.equal(fs.statfsSync(mount).type,0xEF53);
 for(const name of ['home','tmp','BOOTSTRAP'])fs.mkdirSync(path.join(mount,name));exec('fallocate',['-l',String(LIMITS.storageReserveBytes),path.join(mount,'FINAL_RESERVE')]);
 for(const f of ['run.cjs','codec.cjs','transport.cjs'])fs.copyFileSync(path.join(__dirname,f),path.join(mount,'BOOTSTRAP',f));fs.copyFileSync(manifestPath,path.join(mount,'CODE_MANIFEST.json'));
 const capsule=path.join(mount,'capsule');exec('git',['init','-q',capsule],mount);
 const git=args=>exec('git',['-C',capsule,'-c','core.hooksPath=/dev/null',...args],mount);
 git(['remote','add','origin','https://github.com/nkkmd/bao-la-kiswahili-game.git']);git(['config','remote.origin.promisor','true']);git(['config','remote.origin.partialclonefilter','blob:none']);
 git(['-c','protocol.version=2','fetch','--no-tags','--depth=1','--filter=blob:none','origin',manifest.sourceCommit]);
 git(['sparse-checkout','set','--no-cone','/tools/','/public/*.js']);git(['-c','core.autocrlf=false','checkout','--detach','FETCH_HEAD']);
 assert.equal(git(['rev-parse','HEAD']).stdout.trim(),manifest.sourceCommit);source=C.verifyCode(capsule,manifest);save(path.join(mount,'SOURCE_RECEIPT.json'),source);
 ledger.enter('prepare');
 const checkScript='const p=require("node:path"),a=require("node:assert/strict");for(const f of ["tools/research/g5-befcs-workload/scientific-source.cjs","tools/research/g5-befcs-workload/independent-scientific-source.cjs","tools/research/g5-befcs-workload/scientific-closure.cjs","tools/research/g5-befcs-host/host.cjs"])require(p.resolve(f));const g=require(p.resolve("tools/research/g5-befcs-workload/science-gate.cjs"));a.throws(()=>g.openScience(),/SCIENCE-GATE-NOT-FROZEN/);process.stdout.write(JSON.stringify({modulesLoaded:4,scienceGateClosed:true,scientificSeedsRead:0}));';
 moduleCheck=JSON.parse(exec(process.execPath,['-e',checkScript],capsule).stdout);save(path.join(mount,'MODULE_CHECK.json'),moduleCheck);
 ledger.enter('work');save(path.join(mount,'FIXTURE_OUTPUT.json'),{evidenceClass:'TECHNICAL-RUNTIME-CAPSULE',work:'MODULE-LOAD-AND-GATE-REFUSAL-ONLY',scientificSeedsRead:0});
 ledger.enter('finalize');fs.unlinkSync(path.join(mount,'FINAL_RESERVE'));save(path.join(mount,'SEALED_PREFIX.json'),{source,moduleCheck,commands,records:ledger.records,bootstrapCommit:env.GITHUB_SHA,scientificSeedsRead:0,finalScientificInputSet:false});
 exec('sync',['-f',mount]);exec('umount',[mount]);mounted=false;
 archiveMeta=await C.seal(image,archive);ledger.sample();
 archiveMeta={...archiveMeta,evidenceClass:'TECHNICAL-SEALED-RUNTIME-IMAGE',sourceCommit:manifest.sourceCommit,sourceManifestSha256:C.hash(fs.readFileSync(manifestPath)),scientificSeedsRead:0,finalScientificInputSet:false};save(path.join(output,'ARCHIVE_MANIFEST.json'),archiveMeta);
 ledger.enter('preserve');const bytes=fs.readFileSync(archive),client=T.client(env,started+600000),journal=fs.openSync(path.join(output,'TRANSPORT.jsonl'),'wx');
 try{remote=await T.preserve(bytes,archiveMeta,mode,env,async(method,suffix,body)=>{
 fs.writeSync(journal,JSON.stringify({event:'BEFORE',method,suffix})+'\n');fs.fsyncSync(journal);
 const response=await client(method,suffix,body);
 fs.writeSync(journal,JSON.stringify({event:'RESPONSE',method,suffix,sha:response.sha??null,objectSha:response.object?.sha??null,contentSha256:response.content?C.hash(Buffer.from(response.content.replace(/\s/g,''),'base64')):null})+'\n');fs.fsyncSync(journal);return response;
 },()=>{remoteBytes=bytes.length;ledger.sample();});}finally{fs.closeSync(journal);}
 save(path.join(output,'REMOTE_RECEIPT.json'),remote);
 assert.deepEqual(fs.readFileSync(root+'/cgroup.procs','utf8').trim().split(/\s+/),[String(process.pid)]);
 finished=ledger.finish({workStopped:true,allManagedChildrenStopped:true,durableReceipt:{acknowledged:remote.acknowledged,sha256:archiveMeta.archiveSha256}});
 }catch(e){failure=e.message;}finally{if(mounted){const r=cp.spawnSync('umount',[mount],{timeout:10000});assert.equal(r.status,0,'CAPSULE-UNMOUNT-FAILED');mounted=false;}}
 const result={mode,ref,source,moduleCheck,archiveMeta,remote,finished,failure,commands,records:ledger.records,chargedBytes:backingCharge(output,mount)+remoteBytes,elapsedMs:performance.now()-started,memoryPeakBytes:read('memory.peak'),sealedImagePreservedRemotely:remote?.acknowledged===true,finalScientificInputSet:false,externalBootstrapCovered:false,postSealTransportJournalInsideImage:false,actionsArtifactUploadCovered:false,wholeLifecycleOsProven:false,scientificSeedsRead:0,scientificExecutionAuthorized:false};
 save(path.join(output,'RESULT.json'),result);assert.ok(backingCharge(output,mount)+remoteBytes<=LIMITS.maxEvidenceBytes);
 if(mode==='complete')assert.ok(finished,failure);else{assert.ok(remote&&!remote.acknowledged);assert.match(failure??'',/PRESERVATION-NOT-ACKNOWLEDGED/);}return result;
}
if(require.main===module)run(path.resolve(process.argv[2]),process.argv[3],process.argv[4]).then(r=>console.log(JSON.stringify(r))).catch(e=>{console.error(e.message);process.exitCode=1;});
module.exports={run};
