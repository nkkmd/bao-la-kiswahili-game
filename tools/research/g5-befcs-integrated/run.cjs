"use strict";
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const {ownScope}=require('../g5-befcs-lifecycle/os-fixture.cjs'),{create}=require('../g5-befcs-lifecycle/ledger.cjs');
const {LIMITS}=require('../g5-befcs-envelope/envelope.cjs'),T=require('./transport.cjs');
const IMAGE_BYTES=224*1024*1024,INPUT_BLOB='4c35ece242bc55a57a4ceebdbaaa815dadc666a7';
// mounted viewはbacking imageと同じbyteであり、二重加算しない。scope外の作業は認定しない。
function backingCharge(output,mount){
 if(!fs.existsSync(output))return 0;
 let logical=0,allocated=0;
 function visit(p){const s=fs.lstatSync(p);assert.ok(!s.isSymbolicLink());if(p===mount)return;
 allocated+=s.blocks*512;if(s.isDirectory())for(const n of fs.readdirSync(p))visit(path.join(p,n));
 else{assert.ok(s.isFile());logical+=s.size;}}
 visit(output);return Math.max(logical,allocated);
}
async function run(output,mode,unit,env=process.env){
 const began=performance.now(),ref=T.validate(env,mode);assert.equal(process.getuid(),0);
 const root=ownScope(unit,fs.readFileSync('/proc/self/cgroup','utf8')),mount=path.join(output,'workspace'),image=path.join(output,'WORKSPACE.img');
 assert.ok(!fs.existsSync(output),'NEW-OUTPUT-REQUIRED');let mounted=false,journal=null,remote=null,finished=null,failure=null,work=null;
 const commands=[],read=n=>Number(fs.readFileSync(root+'/'+n,'utf8'));
 const ledger=create({evidenceClass:'TECHNICAL-WHOLE-LIFECYCLE-FIXTURE',scientificSeedsRead:0,limits:{...LIMITS}},()=>performance.now()-began,
 ()=>({scopeCreatedBeforeCheckout:true,controllerIncluded:fs.readFileSync(root+'/cgroup.procs','utf8').trim().split(/\s+/).includes(String(process.pid)),scopeId:root,
 hardMemoryBytes:read('memory.max'),swapMaxBytes:read('memory.swap.max'),coveredRoles:['supervisor','checkout','worker','transport','preserver'],
 memoryPeakBytes:read('memory.peak'),workspaceBytes:backingCharge(output,mount),remoteBytes:0,accountingComplete:true}));
 const save=(p,v)=>{const fd=fs.openSync(p,'wx');try{fs.writeFileSync(fd,JSON.stringify(v,null,2)+'\n');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}};
 function exec(file,args){ledger.sample();const r=cp.spawnSync(file,args,{timeout:15000,encoding:'utf8',maxBuffer:65536});commands.push({file,status:r.status,signal:r.signal});assert.equal(r.status,0,'FIXTURE-COMMAND-FAILED:'+file);if(file==='mount')mounted=true;ledger.sample();}
 const client=T.client(env,began+60000);
 try{
 ledger.enter('checkout');fs.mkdirSync(output,{recursive:true});const fd=fs.openSync(image,'wx');fs.ftruncateSync(fd,IMAGE_BYTES);fs.closeSync(fd);fs.mkdirSync(mount);
 exec('mkfs.ext4',['-q','-F','-m','0',image]);exec('mount',['-o','loop,nosuid,nodev,noexec',image,mount]);mounted=true;
 assert.equal(fs.statfsSync(mount).type,0xEF53);exec('fallocate',['-l',String(LIMITS.storageReserveBytes),path.join(mount,'FINAL_RESERVE')]);
 // 既知の固定inputを、有限imageと専用cgroupの内側で初めて取得する。
 const input=await client('GET','/git/blobs/'+INPUT_BLOB);assert.equal(input.sha,INPUT_BLOB);
 const bytes=Buffer.from(input.content.replace(/\s/g,''),'base64');assert.deepEqual(bytes,T.fixtureBytes());fs.writeFileSync(path.join(mount,'INPUT.json'),bytes);ledger.sample();
 ledger.enter('prepare');save(path.join(mount,'INPUT_RECEIPT.json'),{blob:input.sha,scientificSeedsRead:0});
 ledger.enter('work');
 const script='import sys,json\nf=open(sys.argv[1],"wb",buffering=0);n=0;err=None\ntry:\n while sys.argv[2]=="enospc" or n<1048576:n+=f.write(b"x"*1048576)\nexcept OSError as e:err=e.errno\nfinally:f.close()\nprint(json.dumps({"writtenBytes":n,"errno":err}))';
 const r=cp.spawnSync('python3',['-c',script,path.join(mount,'WORK.bin'),mode],{timeout:15000,encoding:'utf8',maxBuffer:65536,env:{PATH:env.PATH,TMPDIR:mount}});
 assert.equal(r.status,0);work=JSON.parse(r.stdout);assert.equal(work.errno,mode==='enospc'?28:null);
 ledger.enter('finalize');fs.unlinkSync(path.join(mount,'FINAL_RESERVE'));
 const payload={evidenceClass:'TECHNICAL-INTEGRATED-FIXTURE',inputBlob:INPUT_BLOB,mode,scientificSeedsRead:0,workCompleted:mode!=='enospc',workErrno:work.errno};
 save(path.join(mount,'STOP_WITNESS.json'),payload);journal=fs.openSync(path.join(mount,'TRANSPORT.jsonl'),'wx');
 ledger.enter('preserve');remote=await T.preserve(Buffer.from(JSON.stringify(payload)),mode,env,async(method,suffix,body)=>{
 fs.writeSync(journal,JSON.stringify({event:'BEFORE',method,suffix})+'\n');fs.fsyncSync(journal);
 const response=await client(method,suffix,body);fs.writeSync(journal,JSON.stringify({event:'RESPONSE',method,suffix,response})+'\n');fs.fsyncSync(journal);return response;
 },()=>ledger.sample());save(path.join(mount,'REMOTE_RECEIPT.json'),remote);
 assert.deepEqual(fs.readFileSync(root+'/cgroup.procs','utf8').trim().split(/\s+/),[String(process.pid)]);
 finished=ledger.finish({workStopped:true,allManagedChildrenStopped:true,durableReceipt:remote});
 }catch(e){failure=e.message;}finally{
 if(journal!==null)fs.closeSync(journal);
 if(mounted){const r=cp.spawnSync('umount',[mount],{timeout:10000,encoding:'utf8'});assert.equal(r.status,0,'UNMOUNT-FAILED');mounted=false;}
 }
 const result={mode,ref,remote,finished,failure,work,fixtureWorkCompleted:mode!=='enospc',preservationCompleted:finished!==null,commands,records:ledger.records,imageBytes:fs.statSync(image).size,
 physicalBackingCharge:backingCharge(output,mount),elapsedMs:performance.now()-began,memoryPeakBytes:read('memory.peak'),
 initialTechnicalInputAcquiredInsideScope:true,inputAndWitnessInsideFiniteImage:true,externalBootstrapCovered:false,
 actionsArtifactUploadCovered:false,fullImagePreservedRemotely:false,wholeLifecycleOsProven:false,scientificSeedsRead:0,scientificExecutionAuthorized:false};
 save(path.join(output,'RESULT.json'),result);assert.ok(backingCharge(output,mount)<=LIMITS.maxEvidenceBytes);
 if(mode==='ack-loss'){assert.ok(remote&&!remote.acknowledged);assert.match(failure??'',/PRESERVATION-NOT-ACKNOWLEDGED/);}else assert.ok(finished,failure);
 return result;
}
if(require.main===module)run(path.resolve(process.argv[2]),process.argv[3],process.argv[4]).then(r=>console.log(JSON.stringify(r))).catch(e=>{console.error(e.message);process.exitCode=1;});
module.exports={IMAGE_BYTES,backingCharge};
