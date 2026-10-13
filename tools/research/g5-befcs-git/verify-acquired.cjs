"use strict";
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const F=require('./fixture.cjs'),{hash}=require('../g5-befcs-workload/registry.cjs');
function verify(directory){
 const result=JSON.parse(fs.readFileSync(path.join(directory,'RESULT.json'))),bytes=zlib.gunzipSync(fs.readFileSync(path.join(directory,'TECHNICAL_EVIDENCE.json.gz')));
 assert.equal(result.decision,'AUTHENTICATED-GIT-FIXTURE-PASS-SCIENCE-GATES-PENDING');assert.equal(hash(bytes),result.evidenceSha256);
 const root=path.resolve(__dirname,'../../..'),manifest=fs.readFileSync(path.join(root,'doc/research-generation-5/befcs-git-20261014/SOURCE_MANIFEST.json'));assert.equal(hash(manifest),result.sourceManifestSha256);
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'befcs-git-acquired-'));
 try{const rows=JSON.parse(bytes);assert.equal(rows.length,5);assert.deepEqual(rows.map(r=>r.mode),require('./policy.cjs').MODES);for(const row of rows){assert.equal(row.authenticatedGitUsed,true);F.replay(row,temp);}
 const r=result.resources;assert.equal(r.memoryMaxBytes,1073741824);assert.equal(r.swapMaxBytes,0);assert.equal(r.pidsMax,64);assert.ok(r.memoryPeakBytes<=r.memoryMaxBytes);assert.ok(r.workspace.charged<=268435456);assert.ok(r.elapsedServiceMs<1200000);assert.equal(r.transportAndReplayInSameCgroup,true);assert.equal(r.wholePipelineIntegrated,false);assert.equal(r.wholeStartupArtifactDeadlineProven,false);
 return {verified:true,sourceManifestSha256:result.sourceManifestSha256,evidenceSha256:result.evidenceSha256,cases:rows.map(r=>({mode:r.mode,registryRef:r.registryRef,registryHead:r.registryHead,commits:r.verified.commits,markers:r.verified.logicalReadsMarked,ack:r.ackCount,unacknowledged:r.unacknowledgedMarkers,finalMirrorSaved:r.finalMirrorSaved,sessionStatus:r.sessionStatus})),resources:r,scientificSeedsRead:0,scientificLeaseCreated:false,scientificStudyRegistered:false};
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
}
if(require.main===module)console.log(JSON.stringify(verify(process.argv[2])));
module.exports={verify};
