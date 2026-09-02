"use strict";

const Q1 = require("./lgtgmiv-stage1-independent.js");
const Q2 = require("./lgtgmiv-stage2-independent.js");
const X = require("./ebrws-stage0-independent.js");

const RAW_FIELDS = ["pits","reserve","houseOwned","player","phase","winner","pending"];
const PRIOR_DEV = {seedStart:31110001,seedEnd:31110128,maxSourcePly:240,namuaPly:24,namuaCount:8,mtajiMinPly:44,mtajiCount:8,depth:5};
const PRIOR_FORMAL = {seedStart:31120001,seedEnd:31120192,maxSourcePly:240,namuaPly:24,namuaCount:12,mtajiMinPly:44,mtajiCount:12,depth:5};

function check(v,m){if(!v)throw new Error(m);}
function copyRaw(s){const z={};for(const f of RAW_FIELDS){check(Object.prototype.hasOwnProperty.call(s,f),`raw missing ${f}`);z[f]=s[f]!==null&&typeof s[f]==="object"?structuredClone(s[f]):s[f];}return z;}
function random(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function options(E,s){if(s.winner!==null)return[];const a=E.moveVariants(s).map(move=>({move,id:Q1.moveKey(move)}));a.sort((u,v)=>u.id.localeCompare(v.id));check(a.length>0,"zero legal choices");return a;}
function makeRow(seed,ply,state,path){return{phase:state.phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:Q1.stateKey(state),sourceTrajectorySha256:Q1.digest(path.join("\n")),openingPrefixSha256:Q1.digest(path.slice(0,16).join("\n")),openingPrefixLength:Math.min(path.length,16)};}
function idOnly(r){return{phase:r.phase,sourceSeed:r.sourceSeed,selectedPly:r.selectedPly,rootRawSha256:r.rootRawSha256,sourceTrajectorySha256:r.sourceTrajectorySha256,openingPrefixSha256:r.openingPrefixSha256,openingPrefixLength:r.openingPrefixLength};}
function buildIndex(rows){const raw=new Set(),trajectory=new Set(),prefix=new Set();for(const r of rows){raw.add(r.rootRawSha256);trajectory.add(r.sourceTrajectorySha256);prefix.add(r.openingPrefixSha256);}return{raw,trajectory,prefix};}

function priorFirewall(E){
  const a=Q1.selectRoots(E,PRIOR_DEV);
  check(a.populationComplete&&a.roots.length===16,"prior development identity reconstruction incomplete");
  const b=Q2.selectRoots(E,PRIOR_FORMAL,a.roots,a.firewallDigestSha256);
  check(b.populationComplete&&b.roots.length===24,"prior formal identity reconstruction incomplete");
  const dev=a.roots.map(idOnly),formal=b.roots.map(idOnly),rows=dev.concat(formal),index=buildIndex(rows);
  return {
    ...index,
    g301DigestSha256:a.firewallDigestSha256,
    lgtgmivStage1DigestSha256:Q1.digest(Q1.canonical(dev)),
    lgtgmivStage2DigestSha256:Q1.digest(Q1.canonical(formal)),
    combinedDigestSha256:Q1.digest(Q1.canonical(rows)),
    counts:{lgtgmivStage1:dev.length,lgtgmivStage2:formal.length}
  };
}

function overlap(f,d){
  if(f.raw.has(d.rootRawSha256))return "UPSTREAM-RAW";
  if(f.trajectory.has(d.sourceTrajectorySha256))return "UPSTREAM-TRAJECTORY";
  if(f.prefix.has(d.openingPrefixSha256))return "UPSTREAM-PREFIX";
  return null;
}

function selectRoots(E,S){
  const fw=priorFirewall(E),nam=[],mta=[],accepted=new Set(),rejections=[];
  for(let seed=S.seedStart;seed<=S.seedEnd&&(nam.length<S.namuaCount||mta.length<S.mtajiCount);seed++){
    let state=E.initialState(),r=random(seed),path=[],mtajiSeen=false;
    for(let ply=1;ply<=S.maxSourcePly&&state.winner===null;ply++){
      const list=options(E,state),pick=list[Math.floor(r()*list.length)];
      path.push(pick.id);state=E.applyMove(state,pick.move).state;
      check(state.reason!=="relay-limit",`source relay-limit ${seed}/${ply}`);
      let phase=null;
      if(ply===S.namuaPly&&state.winner===null&&state.phase==="namua"&&nam.length<S.namuaCount)phase="namua";
      else if(!mtajiSeen&&ply>=S.mtajiMinPly&&state.winner===null&&state.phase==="mtaji"){mtajiSeen=true;phase="mtaji";}
      if(phase===null)continue;
      const d=makeRow(seed,ply,state,path),reason=overlap(fw,d);
      if(reason){rejections.push({reason,phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:d.rootRawSha256});continue;}
      if(accepted.has(d.rootRawSha256)){rejections.push({reason:"G3-02-DUPLICATE-RAW",phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:d.rootRawSha256});continue;}
      const item={...d,rootState:copyRaw(state)};
      if(phase==="namua")nam.push(item);else mta.push(item);
      accepted.add(d.rootRawSha256);
    }
  }
  const roots=nam.concat(mta).sort((a,b)=>(a.phase==="namua"?0:1)-(b.phase==="namua"?0:1)||a.sourceSeed-b.sourceSeed||a.selectedPly-b.selectedPly||a.rootRawSha256.localeCompare(b.rootRawSha256));
  return {roots,rejections,populationComplete:nam.length===S.namuaCount&&mta.length===S.mtajiCount,selectedCounts:{namua:nam.length,mtaji:mta.length},firewall:{g301DigestSha256:fw.g301DigestSha256,lgtgmivStage1DigestSha256:fw.lgtgmivStage1DigestSha256,lgtgmivStage2DigestSha256:fw.lgtgmivStage2DigestSha256,combinedDigestSha256:fw.combinedDigestSha256,counts:fw.counts}};
}

function measureRoot(E,src,depth){
  const instrument=Q1.measureRoot(E,src,depth);
  const endpoint=X.calculate({rootId:src.rootRawSha256,phase:src.phase,families:instrument.families});
  return {
    source:instrument.source,
    instrument:{rootReconstructionCoreSha256:instrument.rootReconstructionCoreSha256,rootFamilyCoreSha256:instrument.rootFamilyCoreSha256,families:instrument.families},
    endpoint
  };
}

function candidateSet(records){return X.selectCandidates(records.map(r=>r.endpoint));}

module.exports={selectRoots,measureRoot,candidateSet,canonical:X.jsonCanon,digest:X.digest};
