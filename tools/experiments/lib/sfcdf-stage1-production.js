"use strict";

const U = require("./lgtgmiv-stage1-production.js");
const M = require("./sfcdf-production.js");

function need(x, m) { if (!x) throw new Error(m); }
function clone(x) { return JSON.parse(JSON.stringify(x)); }
function rng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let n = value;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}
function legal(E, state) {
  if (state.winner !== null) return [];
  const rows = E.moveVariants(state).map(move => ({ move, key: U.moveKey(move) }));
  rows.sort((a,b) => a.key.localeCompare(b.key));
  need(rows.length > 0, "nonterminal state has zero legal moves");
  return rows;
}
function descriptor(seed, ply, state, path) {
  return {
    phase: state.phase,
    sourceSeed: seed,
    selectedPly: ply,
    rootRawSha256: U.stateKey(state),
    sourceTrajectorySha256: U.digest(path.join("\n")),
    openingPrefixSha256: U.digest(path.slice(0,16).join("\n")),
    openingPrefixLength: Math.min(16, path.length),
    rootState: clone(state)
  };
}
function sourceOnly(x) {
  return {
    phase:x.phase, sourceSeed:x.sourceSeed, selectedPly:x.selectedPly,
    rootRawSha256:x.rootRawSha256, sourceTrajectorySha256:x.sourceTrajectorySha256,
    openingPrefixSha256:x.openingPrefixSha256, openingPrefixLength:x.openingPrefixLength
  };
}
function makeFirewall(manifest, extra) {
  need(manifest && manifest.scientificOutcomeFieldsRetained === false, "identity-only firewall required");
  need(manifest.g303ScientificOutcomesRetained === false, "G3-03 scientific outcome retained in firewall");
  const sets = manifest.identitySets || {};
  const root = new Set(sets.rootRawSha256 || []);
  const trajectory = new Set(sets.sourceTrajectorySha256 || []);
  const prefix = new Set(sets.openingPrefixSha256 || []);
  if (extra) {
    for (const x of extra.root || []) root.add(x);
    for (const x of extra.trajectory || []) trajectory.add(x);
    for (const x of extra.prefix || []) prefix.add(x);
  }
  const core = {root:[...root].sort(),trajectory:[...trajectory].sort(),prefix:[...prefix].sort()};
  return {root,trajectory,prefix,digestSha256:U.digest(U.canonical(core)),counts:{root:root.size,trajectory:trajectory.size,prefix:prefix.size}};
}
function selectPairedRoots(E, S, manifest, extraFirewall) {
  const fw = makeFirewall(manifest, extraFirewall);
  const pairs = [], rejections = [], selectedRoots = new Set();
  for (let seed=S.seedStart; seed<=S.seedEnd && pairs.length<S.targetPairs; seed++) {
    let state=E.initialState(), random=rng(seed), path=[], namua=null, mtaji=null;
    for (let ply=1; ply<=S.maxSourcePly && state.winner===null; ply++) {
      const moves=legal(E,state), chosen=moves[Math.floor(random()*moves.length)];
      path.push(chosen.key);
      state=E.applyMove(state,chosen.move).state;
      need(state.reason!=="relay-limit",`relay-limit ${seed}/${ply}`);
      if(ply===S.namuaPly && state.winner===null && state.phase==="namua") namua=descriptor(seed,ply,state,path);
      if(mtaji===null && ply>=S.mtajiMinPly && state.winner===null && state.phase==="mtaji") mtaji=descriptor(seed,ply,state,path);
      if(namua&&mtaji) break;
    }
    if(!namua||!mtaji){rejections.push({sourceSeed:seed,reason:"PAIR-INCOMPLETE",namuaPresent:!!namua,mtajiPresent:!!mtaji});continue;}
    let reason=null;
    for(const x of [namua,mtaji]){
      if(fw.root.has(x.rootRawSha256)){reason="UPSTREAM-RAW";break;}
      if(fw.trajectory.has(x.sourceTrajectorySha256)){reason="UPSTREAM-TRAJECTORY";break;}
      if(fw.prefix.has(x.openingPrefixSha256)){reason="UPSTREAM-PREFIX";break;}
      if(selectedRoots.has(x.rootRawSha256)){reason="WITHIN-STAGE-RAW-DUPLICATE";break;}
    }
    if(!reason&&namua.rootRawSha256===mtaji.rootRawSha256) reason="WITHIN-PAIR-RAW-DUPLICATE";
    if(reason){rejections.push({sourceSeed:seed,reason,namua:sourceOnly(namua),mtaji:sourceOnly(mtaji)});continue;}
    selectedRoots.add(namua.rootRawSha256); selectedRoots.add(mtaji.rootRawSha256);
    pairs.push({pairId:`seed-${seed}`,sourceSeed:seed,namua,mtaji});
  }
  return {pairs,rejections,populationComplete:pairs.length===S.targetPairs,selectedPairCount:pairs.length,selectedRootCount:pairs.length*2,firewallDigestSha256:fw.digestSha256,firewallCounts:fw.counts};
}
function resourceView(r) {
  const c=r.reconstructionCore;
  const uniqueTransitions=c.parentLayers.reduce((a,x)=>a+BigInt(x.uniqueTransitionCount),0n);
  const parentExpansions=c.layers.filter(x=>x.depth<M.HORIZON).reduce((a,x)=>a+BigInt(x.uniqueRawStateCount),0n);
  const treeNodeOccurrences=c.layers.reduce((a,x)=>a+BigInt(x.treeNodeOccurrences),0n);
  return {distinctRawStates:String(c.cumulative.distinctRawStates),uniqueTransitions:String(uniqueTransitions),parentExpansions:String(parentExpansions),treeNodeOccurrences:String(treeNodeOccurrences)};
}
function measureRoot(E, source) {
  const upstream=U.measureRoot(E,source,M.HORIZON);
  return {
    source:upstream.source,
    upstreamRootReconstructionCoreSha256:upstream.rootReconstructionCoreSha256,
    upstreamFamilyCoreSha256:upstream.rootFamilyCoreSha256,
    resourceView:resourceView(upstream),
    sfcdf:M.deriveFromMeasurement(upstream)
  };
}

module.exports={STUDY_ID:M.STUDY_ID,HORIZON:M.HORIZON,CANDIDATES:M.CANDIDATES,sourceOnly,makeFirewall,selectPairedRoots,measureRoot,comparePair:M.comparePair,summarizeDevelopment:M.summarizeDevelopment,canonical:U.canonical,digest:U.digest};
