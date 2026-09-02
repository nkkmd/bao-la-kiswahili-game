"use strict";

const V = require("./lgtgmiv-stage1-independent.js");
const G = require("./sfcdf-independent.js");

function assert(x,m){if(!x)throw new Error(m);}
function copy(x){return structuredClone(x);}
function randomStream(seed){let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function orderedMoves(E,state){if(state.winner!==null)return[];const rows=E.moveVariants(state).map(m=>[V.moveKey(m),m]);rows.sort((a,b)=>a[0].localeCompare(b[0]));assert(rows.length>0,"independent nonterminal zero legal moves");return rows;}
function identity(seed,ply,state,path){return{phase:state.phase,sourceSeed:seed,selectedPly:ply,rootRawSha256:V.stateKey(state),sourceTrajectorySha256:V.digest(path.join("\n")),openingPrefixSha256:V.digest(path.slice(0,16).join("\n")),openingPrefixLength:Math.min(16,path.length),rootState:copy(state)};}
function publicSource(x){const{phase,sourceSeed,selectedPly,rootRawSha256,sourceTrajectorySha256,openingPrefixSha256,openingPrefixLength}=x;return{phase,sourceSeed,selectedPly,rootRawSha256,sourceTrajectorySha256,openingPrefixSha256,openingPrefixLength};}
function firewall(manifest,extra){
  assert(manifest&&manifest.scientificOutcomeFieldsRetained===false,"identity-only firewall required");
  assert(manifest.g303ScientificOutcomesRetained===false,"G3-03 outcome retained");
  const ids=manifest.identitySets||{};
  const root=new Set(ids.rootRawSha256||[]),trajectory=new Set(ids.sourceTrajectorySha256||[]),prefix=new Set(ids.openingPrefixSha256||[]);
  if(extra){for(const x of extra.root||[])root.add(x);for(const x of extra.trajectory||[])trajectory.add(x);for(const x of extra.prefix||[])prefix.add(x);}
  const view={root:[...root].sort(),trajectory:[...trajectory].sort(),prefix:[...prefix].sort()};
  return{root,trajectory,prefix,digestSha256:V.digest(V.canonical(view)),counts:{root:root.size,trajectory:trajectory.size,prefix:prefix.size}};
}
function selectPairedRoots(E,S,manifest,extraFirewall){
  const blocked=firewall(manifest,extraFirewall),chosen=[],rejected=[],rawSeen=new Set();
  let seed=S.seedStart;
  while(seed<=S.seedEnd&&chosen.length<S.targetPairs){
    let state=E.initialState(),nextRandom=randomStream(seed),path=[],namua=null,mtaji=null,ply=0;
    while(++ply<=S.maxSourcePly&&state.winner===null){
      const options=orderedMoves(E,state),selected=options[Math.floor(nextRandom()*options.length)];
      path.push(selected[0]);state=E.applyMove(state,selected[1]).state;assert(state.reason!=="relay-limit",`independent relay-limit ${seed}/${ply}`);
      if(ply===S.namuaPly&&state.winner===null&&state.phase==="namua")namua=identity(seed,ply,state,path);
      if(mtaji===null&&ply>=S.mtajiMinPly&&state.winner===null&&state.phase==="mtaji")mtaji=identity(seed,ply,state,path);
      if(namua&&mtaji)break;
    }
    if(!namua||!mtaji){rejected.push({sourceSeed:seed,reason:"PAIR-INCOMPLETE",namuaPresent:!!namua,mtajiPresent:!!mtaji});seed++;continue;}
    let reason=null;
    for(const row of [namua,mtaji]){
      if(blocked.root.has(row.rootRawSha256)){reason="UPSTREAM-RAW";break;}
      if(blocked.trajectory.has(row.sourceTrajectorySha256)){reason="UPSTREAM-TRAJECTORY";break;}
      if(blocked.prefix.has(row.openingPrefixSha256)){reason="UPSTREAM-PREFIX";break;}
      if(rawSeen.has(row.rootRawSha256)){reason="WITHIN-STAGE-RAW-DUPLICATE";break;}
    }
    if(!reason&&namua.rootRawSha256===mtaji.rootRawSha256)reason="WITHIN-PAIR-RAW-DUPLICATE";
    if(reason){rejected.push({sourceSeed:seed,reason,namua:publicSource(namua),mtaji:publicSource(mtaji)});seed++;continue;}
    rawSeen.add(namua.rootRawSha256);rawSeen.add(mtaji.rootRawSha256);chosen.push({pairId:`seed-${seed}`,sourceSeed:seed,namua,mtaji});seed++;
  }
  return{pairs:chosen,rejections:rejected,populationComplete:chosen.length===S.targetPairs,selectedPairCount:chosen.length,selectedRootCount:chosen.length*2,firewallDigestSha256:blocked.digestSha256,firewallCounts:blocked.counts};
}
function resourceProjection(r){
  const c=r.reconstructionCore;
  let transitions=0n,expansions=0n,nodes=0n;
  for(const x of c.parentLayers)transitions+=BigInt(x.uniqueTransitionCount);
  for(const x of c.layers){nodes+=BigInt(x.treeNodeOccurrences);if(x.depth<G.HORIZON)expansions+=BigInt(x.uniqueRawStateCount);}
  return{distinctRawStates:String(c.cumulative.distinctRawStates),uniqueTransitions:String(transitions),parentExpansions:String(expansions),treeNodeOccurrences:String(nodes)};
}
function measureRoot(E,source){const upstream=V.measureRoot(E,source,G.HORIZON);return{source:upstream.source,upstreamRootReconstructionCoreSha256:upstream.rootReconstructionCoreSha256,upstreamFamilyCoreSha256:upstream.rootFamilyCoreSha256,resourceView:resourceProjection(upstream),sfcdf:G.deriveFromMeasurement(upstream)};}

module.exports={STUDY_ID:G.STUDY_ID,HORIZON:G.HORIZON,CANDIDATES:G.CANDIDATES,sourceOnly:publicSource,makeFirewall:firewall,selectPairedRoots,measureRoot,comparePair:G.comparePair,summarizeDevelopment:G.summarizeDevelopment,canonical:V.canonical,digest:V.digest};
