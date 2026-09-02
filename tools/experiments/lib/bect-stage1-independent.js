"use strict";

const G=require("./bect-independent.js");
const V=require("./lgtgmiv-stage1-independent.js");

function assert(v,m){if(!v)throw new Error(m);}
function publicSource(x){return{phase:x.phase,sourceSeed:x.sourceSeed,selectedPly:x.selectedPly,rootRawSha256:x.rootRawSha256,sourceTrajectorySha256:x.sourceTrajectorySha256,openingPrefixSha256:x.openingPrefixSha256,openingPrefixLength:x.openingPrefixLength};}
function firewall(m){
  assert(m&&m.studyId==="BECT-STUDY1","independent BECT firewall missing");
  assert(m.scientificOutcomeFieldsRetained===false&&m.g303DiagnosticScientificFieldsRetained===false&&m.g304ScientificOutcomeFieldsRetained===false,"independent firewall retained outcomes");
  const s=m.identitySets||{},r=new Set(s.rootRawSha256||[]),t=new Set(s.sourceTrajectorySha256||[]),p=new Set(s.openingPrefixSha256||[]);
  return{root:r,trajectory:t,prefix:p,identityCoreSha256:m.identityCoreSha256,counts:{root:r.size,trajectory:t.size,prefix:p.size}};
}
function longitudinalIds(rep,a,b){
  assert(rep.path.length>=b,"independent trajectory too short");
  const roots=[];
  for(let ply=a;ply<=b;ply++){
    const row=rep.rows.find(x=>x.ply===ply);
    assert(row&&row.root&&row.root.rootState&&row.root.rootState.winner===null,"independent analysis root invalid");
    roots.push(row.root);
  }
  const full=G.digest(rep.path.join("\n")),prefix=G.digest(rep.path.slice(0,16).join("\n"));
  const segment=G.digest(roots.map(x=>`${x.selectedPly}|${x.rootRawSha256}`).join("\n"));
  const pairs=[];for(let i=0;i<roots.length-1;i++)pairs.push(G.digest([roots[i].selectedPly,roots[i].rootRawSha256,roots[i+1].selectedPly,roots[i+1].rootRawSha256].join("|")));
  const windows=[];for(let i=0;i+3<roots.length;i++)windows.push(G.digest(roots.slice(i,i+4).map(x=>`${x.selectedPly}|${x.rootRawSha256}`).join("\n")));
  return{roots,fullSourceTrajectorySha256:full,openingPrefixSha256:prefix,trajectorySegmentSha256:segment,adjacentRootPairSha256:pairs,eventWindowSha256:windows};
}
function selectTrajectories(E,S,manifest){
  const fw=firewall(manifest),out=[],rejections=[];
  const rootsUsed=new Set(),fullUsed=new Set(),prefixUsed=new Set(),segmentUsed=new Set();
  for(let seed=S.seedStart;seed<=S.seedEnd&&out.length<S.targetTrajectories;seed++){
    const rep=G.replay(E,seed,S.maxSourcePly);
    if(rep.path.length<S.analysisRootPlyEnd){rejections.push({sourceSeed:seed,reason:"TRAJECTORY-TOO-SHORT",observedLength:rep.path.length});continue;}
    let ids;try{ids=longitudinalIds(rep,S.analysisRootPlyStart,S.analysisRootPlyEnd);}catch(e){rejections.push({sourceSeed:seed,reason:"ANALYSIS-ROOT-INELIGIBLE",message:e.message});continue;}
    let reason=null;const local=new Set();
    for(const r of ids.roots){
      if(local.has(r.rootRawSha256)){reason="WITHIN-TRAJECTORY-RAW-DUPLICATE";break;}local.add(r.rootRawSha256);
      if(fw.root.has(r.rootRawSha256)){reason="UPSTREAM-RAW";break;}
      if(fw.trajectory.has(r.sourceTrajectorySha256)){reason="UPSTREAM-TRAJECTORY";break;}
      if(rootsUsed.has(r.rootRawSha256)){reason="WITHIN-STAGE-RAW-DUPLICATE";break;}
    }
    if(!reason&&fw.prefix.has(ids.openingPrefixSha256))reason="UPSTREAM-PREFIX";
    if(!reason&&fullUsed.has(ids.fullSourceTrajectorySha256))reason="WITHIN-STAGE-FULL-TRAJECTORY-DUPLICATE";
    if(!reason&&prefixUsed.has(ids.openingPrefixSha256))reason="WITHIN-STAGE-PREFIX-DUPLICATE";
    if(!reason&&segmentUsed.has(ids.trajectorySegmentSha256))reason="WITHIN-STAGE-SEGMENT-DUPLICATE";
    if(reason){rejections.push({sourceSeed:seed,reason});continue;}
    for(const r of ids.roots)rootsUsed.add(r.rootRawSha256);fullUsed.add(ids.fullSourceTrajectorySha256);prefixUsed.add(ids.openingPrefixSha256);segmentUsed.add(ids.trajectorySegmentSha256);
    out.push({trajectoryId:`seed-${seed}`,sourceSeed:seed,fullSourceTrajectorySha256:ids.fullSourceTrajectorySha256,openingPrefixSha256:ids.openingPrefixSha256,trajectorySegmentSha256:ids.trajectorySegmentSha256,adjacentRootPairSha256:ids.adjacentRootPairSha256,eventWindowSha256:ids.eventWindowSha256,roots:ids.roots});
  }
  return{trajectories:out,rejections,populationComplete:out.length===S.targetTrajectories,selectedTrajectoryCount:out.length,selectedRootCount:out.reduce((n,x)=>n+x.roots.length,0),firewallIdentityCoreSha256:fw.identityCoreSha256,firewallCounts:fw.counts};
}
function resources(u){const c=u.reconstructionCore;let transitions=0n,expansions=0n,nodes=0n;for(const x of c.parentLayers)transitions+=BigInt(x.uniqueTransitionCount);for(const x of c.layers){nodes+=BigInt(x.treeNodeOccurrences);if(x.depth<5)expansions+=BigInt(x.uniqueRawStateCount);}return{uniqueRawStates:String(c.cumulative.distinctRawStates),uniqueTransitions:String(transitions),parentExpansions:String(expansions),legalMoveEvaluations:String(transitions),treeNodeOccurrencesSummedAcrossLayers:String(nodes)};}
function measureRoot(E,source){const u=V.measureRoot(E,source,5),level=G.deriveLevel(u);return{source:u.source,upstreamRootReconstructionCoreSha256:u.rootReconstructionCoreSha256,upstreamFamilyCoreSha256:u.rootFamilyCoreSha256,bect:level,resourceCounts:resources(u)};}
function measureTrajectory(E,t){const measured=[];for(const src of t.roots)measured.push(measureRoot(E,src));const series=measured.map(x=>({ply:x.source.selectedPly,phase:x.source.phase,rootRawSha256:x.source.rootRawSha256,levels:x.bect.levels}));const classified=G.classifySeries(series),balances=[];for(const id of G.METRICS){balances.push(G.eventBalance(classified,id,"UP"));balances.push(G.eventBalance(classified,id,"DOWN"));}return{trajectoryId:t.trajectoryId,sourceSeed:t.sourceSeed,fullSourceTrajectorySha256:t.fullSourceTrajectorySha256,openingPrefixSha256:t.openingPrefixSha256,trajectorySegmentSha256:t.trajectorySegmentSha256,adjacentRootPairSha256:t.adjacentRootPairSha256,eventWindowSha256:t.eventWindowSha256,roots:measured,series,classified,balances};}
function summarizeDevelopment(records,nExpected){
  const cands=[];
  for(const id of G.METRICS)for(const dir of ["UP","DOWN"]){
    let coverage=0,onsets=0,nz=0,pos=0,neg=0;
    for(const tr of records){if(tr.series.length===48&&tr.series.every(x=>x.levels[id]&&x.levels[id].defined===true))coverage++;const b=tr.balances.filter(x=>x.metricId===id&&x.direction===dir)[0];assert(b,"independent balance missing");if(b.onsetCount>0)onsets++;if(b.balance>0){nz++;pos++;}else if(b.balance<0){nz++;neg++;}}
    const cp=coverage===nExpected,op=onsets>=6,np=nz>=6,dp=nz>0&&3*pos>=2*nz;
    cands.push({candidateId:`${id}/${dir}`,metricId:id,direction:dir,coverageCount:coverage,onsetTrajectoryCount:onsets,nonZeroBalanceCount:nz,positiveBalanceCount:pos,negativeBalanceCount:neg,coveragePass:cp,onsetPrevalencePass:op,nonZeroBalancePass:np,dominantPersistencePass:dp,promoted:cp&&op&&np&&dp});
  }
  const promoted=cands.filter(x=>x.promoted).map(x=>({candidateId:x.candidateId,metricId:x.metricId,direction:x.direction}));
  return{expectedTrajectories:nExpected,observedTrajectories:records.length,candidates:cands,promotedCandidates:promoted,noPromotedCandidate:promoted.length===0};
}
function scientificTrajectoryView(t){return{trajectoryId:t.trajectoryId,sourceSeed:t.sourceSeed,fullSourceTrajectorySha256:t.fullSourceTrajectorySha256,openingPrefixSha256:t.openingPrefixSha256,trajectorySegmentSha256:t.trajectorySegmentSha256,adjacentRootPairSha256:t.adjacentRootPairSha256,eventWindowSha256:t.eventWindowSha256,roots:t.roots.map(r=>({source:publicSource(r.source),upstreamRootReconstructionCoreSha256:r.upstreamRootReconstructionCoreSha256,upstreamFamilyCoreSha256:r.upstreamFamilyCoreSha256,bect:r.bect})),series:t.series,classified:t.classified,balances:t.balances};}

module.exports={STUDY_ID:G.STUDY_ID,HORIZON:G.HORIZON,METRICS:G.METRICS,makeFirewall:firewall,identitiesFromReplay:longitudinalIds,selectTrajectories,resourceCounts:resources,measureRoot,measureTrajectory,summarizeDevelopment,scientificTrajectoryView,canonical:V.canonical,digest:V.digest};
