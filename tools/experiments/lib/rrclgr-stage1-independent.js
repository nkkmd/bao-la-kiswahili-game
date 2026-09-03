"use strict";
const crypto=require("node:crypto");
const C=require("./rrclgr-independent.js");
function assert(x,m){if(!x)throw new Error(m);}function copy(x){return JSON.parse(JSON.stringify(x));}function hashText(x){return crypto.createHash("sha256").update(String(x),"utf8").digest("hex");}function randomStream(seed){let x=seed>>>0;return function(){x+=0x6D2B79F5;let z=x;z=Math.imul(z^(z>>>15),z|1);z^=z+Math.imul(z^(z>>>7),z|61);return((z^(z>>>14))>>>0)/4294967296;};}
function assignedPhase(stageId,seed){const h=hashText(stageId+"|"+seed);return(parseInt(h[h.length-1],16)&1)===0?"namua":"mtaji";}
function exclusionReason(row,fw){if(fw.root.has(row.rootRawSha256))return"UPSTREAM-ROOT";if(fw.trajectory.has(row.sourceTrajectorySha256))return"UPSTREAM-TRAJECTORY";if(fw.prefix.has(row.openingPrefixSha256))return"UPSTREAM-PREFIX";return null;}
function makeDescriptor(stageId,seed,ply,state,moves){const id=C.stateKey(state),trajectory=hashText(moves.join("\n")),prefix=hashText(moves.slice(0,16).join("\n"));return{phase:state.phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:id,sourceTrajectorySha256:trajectory,openingPrefixSha256:prefix,openingPrefixLength:Math.min(16,moves.length),selectionRankSha256:hashText([stageId,seed,ply,id].join("|")),rootState:copy(state)};}
function identity(x){return{phase:x.phase,sourceSeed:x.sourceSeed,selectedPly:x.selectedPly,rootRawSha256:x.rootRawSha256,sourceTrajectorySha256:x.sourceTrajectorySha256,openingPrefixSha256:x.openingPrefixSha256,openingPrefixLength:x.openingPrefixLength,selectionRankSha256:x.selectionRankSha256};}
function selectCandidates(E,S,SEL,fw){
  assert(S.stageId===SEL.stageId,"wrong stage");assert(S.seedStart===SEL.seedStart&&S.seedEnd===SEL.seedEnd,"wrong seeds");const needCount={namua:SEL.candidateNamua,mtaji:SEL.candidateMtaji},bucket={namua:[],mtaji:[]},used=new Set(),rejections=[];
  let seed=SEL.seedStart;while(seed<=SEL.seedEnd&&(bucket.namua.length<needCount.namua||bucket.mtaji.length<needCount.mtaji)){
    const phase=assignedPhase(S.stageId,seed);if(bucket[phase].length>=needCount[phase]){seed++;continue;}
    let state=E.initialState(),pick=randomStream(seed),moves=[],pool=[],relay=false;
    for(let ply=1;ply<=SEL.maximumSourcePly&&state.winner===null;ply++){
      let variants=E.moveVariants(state).map(m=>({move:m,key:C.moveKey(m)}));variants.sort((a,b)=>a.key.localeCompare(b.key));if(variants.length===0)break;const chosen=variants[Math.floor(pick()*variants.length)];moves.push(chosen.key);state=E.applyMove(state,chosen.move).state;if(state.reason==="relay-limit"){relay=true;break;}if(ply>=SEL.minimumSelectablePly&&state.winner===null&&state.phase===phase){const row=makeDescriptor(S.stageId,seed,ply,state,moves),reason=exclusionReason(row,fw);if(reason)rejections.push({sourceSeed:seed,phase,selectedPly:ply,reason,rootRawSha256:row.rootRawSha256});else pool.push(row);}
    }
    if(relay){rejections.push({sourceSeed:seed,phase,reason:"SOURCE-RELAY-LIMIT"});seed++;continue;}if(pool.length===0){rejections.push({sourceSeed:seed,phase,reason:"NO-IDENTITY-ELIGIBLE-CANDIDATE"});seed++;continue;}
    let chosen=pool[0];for(let i=1;i<pool.length;i++){const r=pool[i];if(r.selectionRankSha256<chosen.selectionRankSha256||(r.selectionRankSha256===chosen.selectionRankSha256&&(r.selectedPly<chosen.selectedPly||(r.selectedPly===chosen.selectedPly&&r.rootRawSha256<chosen.rootRawSha256))))chosen=r;}
    if(used.has(chosen.rootRawSha256))rejections.push({sourceSeed:seed,phase,reason:"DUPLICATE-NEW-ROOT",rootRawSha256:chosen.rootRawSha256});else{used.add(chosen.rootRawSha256);bucket[phase].push(chosen);}seed++;
  }
  const roots=bucket.namua.concat(bucket.mtaji).sort((a,b)=>{const pa=a.phase==="namua"?0:1,pb=b.phase==="namua"?0:1;return pa-pb||a.sourceSeed-b.sourceSeed||a.selectedPly-b.selectedPly||a.rootRawSha256.localeCompare(b.rootRawSha256);}),identityRows=roots.map(identity);return{roots,identityRows,rejections,candidateCounts:{namua:bucket.namua.length,mtaji:bucket.mtaji.length,total:roots.length},populationComplete:bucket.namua.length===needCount.namua&&bucket.mtaji.length===needCount.mtaji,candidateCoreSha256:C.digest(identityRows)};
}
module.exports={assignedPhase,selectCandidates,sourceOnly:identity,preflight:C.boundedPreflight,measureRoot:C.measureRoot,distanceRows:C.distanceRows,neighbors:C.neighbors,AXES:C.AXES,REPRESENTATION_ID:C.REPRESENTATION_ID,digest:C.digest,canonical:C.canonical};
