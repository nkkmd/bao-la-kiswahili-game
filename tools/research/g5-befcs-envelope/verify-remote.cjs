"use strict";
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function verify(p){
  assert.equal(p.sessionSourceSha256,hash(fs.readFileSync(path.join(__dirname,'transport-session.cjs'))));
  assert.equal(p.request.evidenceClass,'TECHNICAL-ENVELOPE-REGISTRY-FIXTURE');assert.equal(p.request.runAttempt,1);assert.deepEqual(p.request.block,{start:1,count:4});
  assert.equal(p.scientificSeedsRead,0);assert.equal(p.scientificLeaseCreated,false);assert.equal(p.scientificStudyRegistered,false);
  assert.equal(p.history.length,3);let previous=p.initialHead;
  for(let i=0;i<3;i++){
    const r=p.history[i];assert.match(r.sha,/^[a-f0-9]{40}$/);assert.equal(r.parent,previous);assert.match(r.tree,/^[a-f0-9]{40}$/);previous=r.sha;
    assert.equal(r.updateRefAccepted,true);assert.deepEqual(r.record.lease.request,p.request);assert.equal(r.record.lease.status,'BLOCK-QUARANTINED-NO-RETRY');
    assert.equal(r.record.lease.consumes.length,i===2?1:0);assert.equal(r.record.mirrors.length,i===0?0:1);
    if(i>0){const m=r.record.mirrors[0];assert.equal(m.sequence,0);assert.equal(m.final,false);assert.equal(m.bytes,Buffer.byteLength(m.text));assert.equal(m.sha256,hash(m.text));}
  }
  assert.equal(p.history[2].responseSuppressedAtAdapter,true);assert.equal(p.observedHead,previous);assert.deepEqual(p.observedRecord,p.history[2].record);
  assert.deepEqual(p.observedRecord.lease.consumes[0],{index:0,logicalId:1,binding:p.request.binding,runId:p.request.runId,beforeRead:true});
  assert.equal(p.ackCount,0);assert.equal(p.sessionMarked,0);assert.equal(p.sessionStatus,'STOPPED');assert.equal(p.failure,'INJECTED-COMMITTED-RESPONSE-UNKNOWN');assert.equal(p.retryError,'SESSION-STOPPED-NO-RETRY');
  assert.equal(p.finalMirrorSaved,false);assert.equal(p.solution,null);assert.equal(p.resumeAuthorized,false);
  assert.equal(p.staleCas.headUnchanged,true);assert.equal(p.staleCas.observedHeadAfter,previous);
  assert.equal(p.staleCas.verdict,'UNKNOWN-SERVICE-ERROR-HEAD-UNCHANGED-CAS-REJECTION-REASON-NOT-VERIFIED');assert.equal(p.staleCas.response.isError,true);
  // これは保存snapshotとconnector receiptの整合性。raw Git commit/objectの独立復元ではない。
  return {verifiedSnapshotConsistency:true,rawGitObjectsIndependentlyReconstructed:false,casRejectionReasonVerified:false,scientificSeedsRead:0};
}
if(require.main===module)console.log(JSON.stringify(verify(JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../../doc/research-generation-5/befcs-envelope-20261013/results/REMOTE_TRANSPORT_RECEIPT.json'))))));
module.exports={verify};
