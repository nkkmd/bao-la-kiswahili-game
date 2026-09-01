"use strict";

const L1 = require("./lgtgmiv-stage1-production.js");
const L2 = require("./lgtgmiv-stage2-production.js");
const D = require("./ebrws-stage0-production.js");

const RAW = ["pits","reserve","houseOwned","player","phase","winner","pending"];
const UPSTREAM_S1 = {seedStart:31110001,seedEnd:31110128,maxSourcePly:240,namuaPly:24,namuaCount:8,mtajiMinPly:44,mtajiCount:8,depth:5};
const UPSTREAM_S2 = {seedStart:31120001,seedEnd:31120192,maxSourcePly:240,namuaPly:24,namuaCount:12,mtajiMinPly:44,mtajiCount:12,depth:5};

function ensure(x,m){ if(!x) throw new Error(m); }
function raw(s){ const o={}; for(const k of RAW){ensure(Object.prototype.hasOwnProperty.call(s,k),`raw field missing ${k}`);o[k]=s[k]!==null&&typeof s[k]==="object"?JSON.parse(JSON.stringify(s[k])):s[k];} return o; }
function rng(seed){let value=seed>>>0;return()=>{value+=0x6D2B79F5;let n=value;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return((n^(n>>>14))>>>0)/4294967296;};}
function legal(E,s){if(s.winner!==null)return[];const rows=E.moveVariants(s).map(m=>({m,k:L1.moveKey(m)})).sort((a,b)=>a.k.localeCompare(b.k));ensure(rows.length>0,"nonterminal zero legal move");return rows;}
function descriptor(seed,ply,state,moves){return{phase:state.phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:L1.stateKey(state),sourceTrajectorySha256:L1.digest(moves.join("\n")),openingPrefixSha256:L1.digest(moves.slice(0,16).join("\n")),openingPrefixLength:Math.min(16,moves.length)};}
function identity(r){return{phase:r.phase,sourceSeed:r.sourceSeed,selectedPly:r.selectedPly,rootRawSha256:r.rootRawSha256,sourceTrajectorySha256:r.sourceTrajectorySha256,openingPrefixSha256:r.openingPrefixSha256,openingPrefixLength:r.openingPrefixLength};}
function identitySets(rows){return{raw:new Set(rows.map(r=>r.rootRawSha256)),trajectory:new Set(rows.map(r=>r.sourceTrajectorySha256)),prefix:new Set(rows.map(r=>r.openingPrefixSha256))};}

function upstreamFirewall(E){
  const s1=L1.selectRoots(E,UPSTREAM_S1);
  ensure(s1.populationComplete&&s1.roots.length===16,"upstream LGTGMIV Stage 1 identity reconstruction incomplete");
  const s2=L2.selectRoots(E,UPSTREAM_S2,s1.roots,s1.firewallDigestSha256);
  ensure(s2.populationComplete&&s2.roots.length===24,"upstream LGTGMIV Stage 2 identity reconstruction incomplete");
  const s1rows=s1.roots.map(identity),s2rows=s2.roots.map(identity),all=s1rows.concat(s2rows);
  const sets=identitySets(all);
  return {
    ...sets,
    g301DigestSha256:s1.firewallDigestSha256,
    lgtgmivStage1DigestSha256:L1.digest(L1.canonical(s1rows)),
    lgtgmivStage2DigestSha256:L1.digest(L1.canonical(s2rows)),
    combinedDigestSha256:L1.digest(L1.canonical(all)),
    counts:{lgtgmivStage1:s1rows.length,lgtgmivStage2:s2rows.length}
  };
}

function collision(f,d){
  if(f.raw.has(d.rootRawSha256))return "UPSTREAM-RAW";
  if(f.trajectory.has(d.sourceTrajectorySha256))return "UPSTREAM-TRAJECTORY";
  if(f.prefix.has(d.openingPrefixSha256))return "UPSTREAM-PREFIX";
  return null;
}

function selectRoots(E,S){
  const fw=upstreamFirewall(E),got={namua:[],mtaji:[]},seen=new Set(),rejections=[];
  for(let seed=S.seedStart;seed<=S.seedEnd&&(got.namua.length<S.namuaCount||got.mtaji.length<S.mtajiCount);seed++){
    let state=E.initialState(),rand=rng(seed),moves=[],mtajiTaken=false;
    for(let ply=1;ply<=S.maxSourcePly&&state.winner===null;ply++){
      const list=legal(E,state),pick=list[Math.floor(rand()*list.length)];
      moves.push(pick.k);
      state=E.applyMove(state,pick.m).state;
      ensure(state.reason!=="relay-limit",`relay-limit ${seed}/${ply}`);
      let phase=null;
      if(ply===S.namuaPly&&state.winner===null&&state.phase==="namua"&&got.namua.length<S.namuaCount)phase="namua";
      else if(!mtajiTaken&&ply>=S.mtajiMinPly&&state.winner===null&&state.phase==="mtaji"){mtajiTaken=true;phase="mtaji";}
      if(!phase)continue;
      const d=descriptor(seed,ply,state,moves),why=collision(fw,d);
      if(why){rejections.push({reason:why,phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:d.rootRawSha256});continue;}
      if(seen.has(d.rootRawSha256)){rejections.push({reason:"G3-02-DUPLICATE-RAW",phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:d.rootRawSha256});continue;}
      got[phase].push({...d,rootState:raw(state)});seen.add(d.rootRawSha256);
    }
  }
  const roots=got.namua.concat(got.mtaji).sort((a,b)=>(a.phase==="namua"?0:1)-(b.phase==="namua"?0:1)||a.sourceSeed-b.sourceSeed||a.selectedPly-b.selectedPly||a.rootRawSha256.localeCompare(b.rootRawSha256));
  return {roots,rejections,populationComplete:got.namua.length===S.namuaCount&&got.mtaji.length===S.mtajiCount,selectedCounts:{namua:got.namua.length,mtaji:got.mtaji.length},firewall:{g301DigestSha256:fw.g301DigestSha256,lgtgmivStage1DigestSha256:fw.lgtgmivStage1DigestSha256,lgtgmivStage2DigestSha256:fw.lgtgmivStage2DigestSha256,combinedDigestSha256:fw.combinedDigestSha256,counts:fw.counts}};
}

function measureRoot(E,src,depth){
  const instrument=L1.measureRoot(E,src,depth);
  const endpoint=D.deriveRoot({rootId:src.rootRawSha256,phase:src.phase,families:instrument.families});
  return {
    source:instrument.source,
    instrument:{rootReconstructionCoreSha256:instrument.rootReconstructionCoreSha256,rootFamilyCoreSha256:instrument.rootFamilyCoreSha256,families:instrument.families},
    endpoint
  };
}

function candidateSet(records){return D.promoteCandidates(records.map(r=>r.endpoint));}

module.exports={selectRoots,measureRoot,candidateSet,canonical:D.canonical,digest:D.sha256};
