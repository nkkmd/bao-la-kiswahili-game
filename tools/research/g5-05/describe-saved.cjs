"use strict";
// 実行後の保存記録だけを記述する。エンジン・solver・source生成器を呼ばない。
const fs=require("node:fs"),path=require("node:path"),zlib=require("node:zlib"),crypto=require("node:crypto"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"../../.."),docs=path.join(root,"doc/research-generation-5/g5-05"),sha=b=>crypto.createHash("sha256").update(b).digest("hex");
const read=p=>JSON.parse(fs.readFileSync(p));
function describe() {
 const manifest=read(path.join(docs,"DESCRIPTION_MANIFEST.json"));for(const[p,h]of Object.entries(manifest.files))assert.equal(sha(fs.readFileSync(path.join(root,p))),h,p);
 const compressed=fs.readFileSync(path.join(docs,"results/EVIDENCE.json.gz")),bytes=zlib.gunzipSync(compressed),e=JSON.parse(bytes),r=read(path.join(docs,"results/RESULT.json"));
 const old=new Set();for(const location of ["g5-01/development","g5-02","g5-03","g5-04"]){const p=path.join(root,"doc/research-generation-5",location,"results/EVIDENCE.json.gz"),v=JSON.parse(zlib.gunzipSync(fs.readFileSync(p)));for(const id of v.developmentReadIdentities??v.supplyReadIdentities)old.add(id);}
 const union=new Set([...old,...e.supplyReadIdentities]);
 const rows=e.domains.map((d,i)=>{const c=e.selectedCandidates[i],s=e.sources[c.sourceIndex],screen=s.screens.find(p=>p.ply===c.ply);assert.equal(screen.status,"MIXED-REPLY-ELIGIBLE");
  const modes=screen.branches.map(b=>{const types=new Set(b.replyKeys.map(k=>JSON.parse(k).type));assert.equal(types.size,1);return {moveKey:b.key,replyMode:[...types][0],replyWidth:b.replyKeys.length};});
  return {candidate:i+1,sourceIndex:c.sourceIndex,seed:s.seed,ply:c.ply,sourceNaturalEndPly:s.trace.length,remainingSourcePlies:s.trace.length-c.ply,width:c.width,
   occupied:c.state.pits.flat(2).filter(v=>v>0).length,frontTotals:c.state.pits.map(r=>r[0].reduce((a,b)=>a+b,0)),replyModes:modes,
   status:d.status,complete:d.complete,states:d.states.length,edges:d.edges.length,exactRootValuesKnown:d.complete?null:false,winLossContrast:null,
   guardWitness:d.stopWitness?.runtimeGuardOnly?{from:d.stopWitness.from,moveKey:d.stopWitness.moveKey,runtimeGuardOnly:true,guardFreeTerminationOrRecurrence:null}:null};});
 assert.equal(r.completeDomains,0);assert.ok(rows.every(x=>!x.complete));
 return {studyId:e.studyId,stageId:e.stageId,kind:"POSTEXECUTION-SAVED-SUPPLY-DESCRIPTION",originalMirrorCommit:manifest.originalMirrorCommit,
  evidenceGzipSha256:sha(compressed),evidenceGzipBytes:compressed.length,evidenceJsonBytes:bytes.length,stateJournalBytes:r.stateJournalBytes,
  combinedRawBytes:bytes.length+r.stateJournalBytes,priorReadIdentityCount:old.size,currentReadIdentityCount:e.supplyReadIdentities.length,
  unionReadIdentityCount:union.size,readOverlap:old.size+e.supplyReadIdentities.length-union.size,eligibleSourceRepresentatives:e.sources.filter(s=>s.candidate).length,
  selectedCandidates:e.selectedCandidates.length,unanalysedRepresentatives:e.sources.filter(s=>s.candidate).length-e.selectedCandidates.length,
  states:e.domains.reduce((n,d)=>n+d.states.length,0),edges:e.domains.reduce((n,d)=>n+d.edges.length,0),rows,
  valueKnownRootCount:0,winLossContrastAmongSelectedRoots:null,freshSourcesGenerated:0,freshTransitionsGenerated:0,candidatesReselected:0,searchComparisonsPerformed:0,formalInference:false};
}
if(require.main===module){const v=describe(),p=path.join(docs,"results/DESCRIPTION.json");if(process.argv.includes("--check")){assert.deepEqual(v,read(p));const b=read(path.join(docs,"DESCRIPTION_BINDING.json"));assert.equal(sha(fs.readFileSync(p)),b.files[path.relative(root,p)]);console.log("G5-05-SAVED-DESCRIPTION-PASS");}else if(process.argv.includes("--write")){fs.writeFileSync(p,JSON.stringify(v,null,2)+"\n");console.log(JSON.stringify({union:v.unionReadIdentityCount,complete:0,valuesKnown:0}));}else console.log(JSON.stringify(v,null,2));}
module.exports={describe};
