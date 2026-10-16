"use strict";
const assert=require('node:assert/strict'),crypto=require('node:crypto'),C=require('./codec.cjs');
function ref(env,mode){assert.equal(env.GITHUB_ACTIONS,'true');assert.equal(env.GITHUB_REPOSITORY,'nkkmd/bao-la-kiswahili-game');assert.equal(env.GITHUB_EVENT_NAME,'push');assert.equal(env.GITHUB_RUN_ATTEMPT,'1');assert.equal(env.GITHUB_REF,'refs/heads/research/g5-capsule-20261016');assert.match(env.GITHUB_RUN_ID??'',/^[1-9][0-9]*$/);assert.ok(env.BEFCS_FIXTURE_TOKEN);assert.ok(['complete','ack-loss'].includes(mode));return 'refs/heads/research/g5-capsule-archive-'+env.GITHUB_RUN_ID+'-a1-'+mode;}
function client(env,deadline){return async(method,suffix,body)=>{
 const remaining=Math.floor(deadline-performance.now());assert.ok(remaining>0,'CAPSULE-DEADLINE');const response=await fetch('https://api.github.com/repos/nkkmd/bao-la-kiswahili-game'+suffix,{method,redirect:'error',headers:{Authorization:'Bearer '+env.BEFCS_FIXTURE_TOKEN,Accept:'application/vnd.github+json','Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(Math.min(30000,remaining))});assert.ok(response.ok,'CAPSULE-HTTP-'+response.status);
 const chunks=[];let size=0;for await(const chunk of response.body){size+=chunk.length;if(size>24*1024*1024)throw Error('CAPSULE-RESPONSE-LIMIT');chunks.push(chunk);}return JSON.parse(Buffer.concat(chunks).toString());};}
async function preserve(bytes,meta,mode,env,request,check){
 const target=ref(env,mode);C.payloadValid(bytes,meta);const calls=[];
 async function call(method,suffix,body){check();calls.push({method,suffix});const r=await request(method,suffix,body);check();return r;}
 const blob=await call('POST','/git/blobs',{encoding:'base64',content:bytes.toString('base64')});
 assert.equal(blob.sha,crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex'));
 const manifest=await call('POST','/git/blobs',{encoding:'utf-8',content:JSON.stringify(meta)});
 const tree=await call('POST','/git/trees',{tree:[{path:'EVIDENCE.img.gz',mode:'100644',type:'blob',sha:blob.sha},{path:'MANIFEST.json',mode:'100644',type:'blob',sha:manifest.sha}]});
 const commit=await call('POST','/git/commits',{message:'Sealed technical runtime image; scientific seeds 0',tree:tree.sha,parents:[]});
 const created=await call('POST','/git/refs',{ref:target,sha:commit.sha});assert.equal(created.object.sha,commit.sha);
 if(mode==='ack-loss')return {ref:target,commit:commit.sha,blob:blob.sha,manifestBlob:manifest.sha,acknowledged:false,calls};
 const readRef=await call('GET','/git/ref/'+target.slice(5));assert.equal(readRef.object.sha,commit.sha);
 const readCommit=await call('GET','/git/commits/'+commit.sha);assert.equal(readCommit.tree.sha,tree.sha);
 const remote=await call('GET','/git/blobs/'+blob.sha);assert.equal(remote.encoding,'base64');assert.deepEqual(Buffer.from(remote.content.replace(/\s/g,''),'base64'),bytes);
 const remoteManifest=await call('GET','/git/blobs/'+manifest.sha);assert.deepEqual(JSON.parse(Buffer.from(remoteManifest.content.replace(/\s/g,''),'base64')),meta);
 return {ref:target,commit:commit.sha,blob:blob.sha,manifestBlob:manifest.sha,acknowledged:true,calls};
}
module.exports={ref,client,preserve};
