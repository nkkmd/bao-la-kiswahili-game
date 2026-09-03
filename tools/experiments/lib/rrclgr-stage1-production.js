"use strict";
const crypto=require("node:crypto");
const C=require("./rrclgr-production.js");
function need(x,m){if(!x)throw new Error(m);}function clone(x){return JSON.parse(JSON.stringify(x));}function sha(x){return crypto.createHash("sha256").update(String(x),"utf8").digest("hex");}function rng(seed){let v=seed>>>0;return()=>{v+=0x6D2B79F5;let n=v;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return((n^(n>>>14))>>>0)/4294967296;};}
function assignedPhase(stageId,seed){return(parseInt(sha(`${stageId}|${seed}`).slice(-1),16)%2===0)?"namua":"mtaji";}
function firewallHit(d,fw){if(fw.root.has(d.rootRawSha256))return"UPSTREAM-ROOT";if(fw.trajectory.has(d.sourceTrajectorySha256))return"UPSTREAM-TRAJECTORY";if(fw.prefix.has(d.openingPrefixSha256))return"UPSTREAM-PREFIX";return null;}
function descriptor(stageId,seed,ply,state,moves){const root=C.stateKey(state);return{phase:state.phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:root,sourceTrajectorySha256:sha(moves.join("\n")),openingPrefixSha256:sha(moves.slice(0,16).join("\n")),openingPrefixLength:Math.min(16,moves.length),selectionRankSha256:sha(`${stageId}|${seed}|${ply}|${root}`),rootState:clone(state)};}
function publicRow(x){return{phase:x.phase,sourceSeed:x.sourceSeed,selectedPly:x.selectedPly,rootRawSha256:x.rootRawSha256,sourceTrajectorySha256:x.sourceTrajectorySha256,openingPrefixSha256:x.openingPrefixSha256,openingPrefixLength:x.openingPrefixLength,selectionRankSha256:x.selectionRankSha256};}
function selectCandidates(E,S,SEL,fw){
  need(S.stageId===SEL.stageId,"stage mismatch");need(S.seedStart===SEL.seedStart&&S.seedEnd===SEL.seedEnd,"seed mismatch");
  const target={namua:SEL.candidateNamua,mtaji:SEL.candidateMtaji},got={namua:[],mtaji:[]},seen=new Set(),rejections=[];
  for(let seed=SEL.seedStart;seed<=SEL.seedEnd&&(got.namua.length<target.namua||got.mtaji.length<target.mtaji);seed++){
    const phase=assignedPhase(S.stageId,seed);if(got[phase].length>=target[phase])continue;
    let state=E.initialState(),random=rng(seed),moves=[],candidates=[],sourceRelay=false;
    for(let ply=1;ply<=SEL.maximumSourcePly&&state.winner===null;ply++){
      const legal=E.moveVariants(state).map(m=>({m,k:C.moveKey(m)})).sort((a,b)=>a.k.localeCompare(b.k));if(!legal.length)break;
      const chosen=legal[Math.floor(random()*legal.length)];moves.push(chosen.k);state=E.applyMove(state,chosen.m).state;
      if(state.reason==="relay-limit"){sourceRelay=true;break;}
      if(ply<SEL.minimumSelectablePly||state.winner!==null||state.phase!==phase)continue;
      const d=descriptor(S.stageId,seed,ply,state,moves),hit=firewallHit(d,fw);if(hit){rejections.push({sourceSeed:seed,phase,selectedPly:ply,reason:hit,rootRawSha256:d.rootRawSha256});continue;}candidates.push(d);
    }
    if(sourceRelay){rejections.push({sourceSeed:seed,phase,reason:"SOURCE-RELAY-LIMIT"});continue;}if(!candidates.length){rejections.push({sourceSeed:seed,phase,reason:"NO-IDENTITY-ELIGIBLE-CANDIDATE"});continue;}
    candidates.sort((a,b)=>a.selectionRankSha256.localeCompare(b.selectionRankSha256)||a.selectedPly-b.selectedPly||a.rootRawSha256.localeCompare(b.rootRawSha256));const d=candidates[0];
    if(seen.has(d.rootRawSha256)){rejections.push({sourceSeed:seed,phase,reason:"DUPLICATE-NEW-ROOT",rootRawSha256:d.rootRawSha256});continue;}seen.add(d.rootRawSha256);got[phase].push(d);
  }
  const roots=[...got.namua,...got.mtaji].sort((a,b)=>(a.phase==="namua"?0:1)-(b.phase==="namua"?0:1)||a.sourceSeed-b.sourceSeed||a.selectedPly-b.selectedPly||a.rootRawSha256.localeCompare(b.rootRawSha256));const identityRows=roots.map(publicRow);return{roots,identityRows,rejections,candidateCounts:{namua:got.namua.length,mtaji:got.mtaji.length,total:roots.length},populationComplete:got.namua.length===target.namua&&got.mtaji.length===target.mtaji,candidateCoreSha256:C.digest(identityRows)};
}
module.exports={assignedPhase,selectCandidates,sourceOnly:publicRow,preflight:C.boundedPreflight,measureRoot:C.measureRoot,distanceRows:C.distanceRows,neighbors:C.neighbors,AXES:C.AXES,REPRESENTATION_ID:C.REPRESENTATION_ID,digest:C.digest,canonical:C.canonical};
