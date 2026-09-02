"use strict";

const B=require("./bect-production.js");
const U=require("./lgtgmiv-stage1-production.js");

function need(x,m){if(!x)throw new Error(m);}
function clone(x){return JSON.parse(JSON.stringify(x));}
function sourceOnly(x){return{phase:x.phase,sourceSeed:x.sourceSeed,selectedPly:x.selectedPly,rootRawSha256:x.rootRawSha256,sourceTrajectorySha256:x.sourceTrajectorySha256,openingPrefixSha256:x.openingPrefixSha256,openingPrefixLength:x.openingPrefixLength};}
function sortedUnique(xs){return[...new Set(xs)].sort();}
function makeFirewall(m){
  need(m&&m.studyId==="BECT-STUDY1","BECT identity firewall required");
  need(m.scientificOutcomeFieldsRetained===false,"scientific outcome retained in firewall");
  need(m.g303DiagnosticScientificFieldsRetained===false,"G3-03 diagnostic fields retained");
  need(m.g304ScientificOutcomeFieldsRetained===false,"G3-04 scientific outcome retained");
  const s=m.identitySets||{};
  const root=new Set(s.rootRawSha256||[]),trajectory=new Set(s.sourceTrajectorySha256||[]),prefix=new Set(s.openingPrefixSha256||[]);
  return{root,trajectory,prefix,identityCoreSha256:m.identityCoreSha256,counts:{root:root.size,trajectory:trajectory.size,prefix:prefix.size}};
}
function identitiesFromReplay(rep,startPly,endPly){
  need(rep.path.length>=endPly,"trajectory shorter than analysis end");
  const roots=[];
  for(let ply=startPly;ply<=endPly;ply++){
    const row=rep.rows[ply-1];
    need(row&&row.ply===ply,"analysis root row missing");
    need(row.root&&row.root.rootState&&row.root.rootState.winner===null,"analysis root must be nonterminal");
    roots.push(row.root);
  }
  const fullSourceTrajectorySha256=B.digest(rep.path.join("\n"));
  const openingPrefixSha256=B.digest(rep.path.slice(0,16).join("\n"));
  const segmentLines=roots.map(r=>`${r.selectedPly}|${r.rootRawSha256}`);
  const trajectorySegmentSha256=B.digest(segmentLines.join("\n"));
  const adjacentRootPairSha256=[];
  for(let i=0;i+1<roots.length;i++)adjacentRootPairSha256.push(B.digest(`${roots[i].selectedPly}|${roots[i].rootRawSha256}|${roots[i+1].selectedPly}|${roots[i+1].rootRawSha256}`));
  const eventWindowSha256=[];
  for(let i=0;i+3<roots.length;i++)eventWindowSha256.push(B.digest(roots.slice(i,i+4).map(r=>`${r.selectedPly}|${r.rootRawSha256}`).join("\n")));
  return{roots,fullSourceTrajectorySha256,openingPrefixSha256,trajectorySegmentSha256,adjacentRootPairSha256,eventWindowSha256};
}
function selectTrajectories(E,S,manifest){
  const fw=makeFirewall(manifest),selected=[],rejections=[];
  const usedRoots=new Set(),usedFull=new Set(),usedPrefix=new Set(),usedSegment=new Set();
  for(let seed=S.seedStart;seed<=S.seedEnd&&selected.length<S.targetTrajectories;seed++){
    const rep=B.replay(E,seed,S.maxSourcePly);
    if(rep.path.length<S.analysisRootPlyEnd){rejections.push({sourceSeed:seed,reason:"TRAJECTORY-TOO-SHORT",observedLength:rep.path.length});continue;}
    let id;
    try{id=identitiesFromReplay(rep,S.analysisRootPlyStart,S.analysisRootPlyEnd);}catch(e){rejections.push({sourceSeed:seed,reason:"ANALYSIS-ROOT-INELIGIBLE",message:String(e.message)});continue;}
    let reason=null;
    const candidateRootSet=new Set();
    for(const r of id.roots){
      if(candidateRootSet.has(r.rootRawSha256)){reason="WITHIN-TRAJECTORY-RAW-DUPLICATE";break;}
      candidateRootSet.add(r.rootRawSha256);
      if(fw.root.has(r.rootRawSha256)){reason="UPSTREAM-RAW";break;}
      if(fw.trajectory.has(r.sourceTrajectorySha256)){reason="UPSTREAM-TRAJECTORY";break;}
      if(usedRoots.has(r.rootRawSha256)){reason="WITHIN-STAGE-RAW-DUPLICATE";break;}
    }
    if(!reason&&fw.prefix.has(id.openingPrefixSha256))reason="UPSTREAM-PREFIX";
    if(!reason&&usedFull.has(id.fullSourceTrajectorySha256))reason="WITHIN-STAGE-FULL-TRAJECTORY-DUPLICATE";
    if(!reason&&usedPrefix.has(id.openingPrefixSha256))reason="WITHIN-STAGE-PREFIX-DUPLICATE";
    if(!reason&&usedSegment.has(id.trajectorySegmentSha256))reason="WITHIN-STAGE-SEGMENT-DUPLICATE";
    if(reason){rejections.push({sourceSeed:seed,reason});continue;}
    for(const r of id.roots)usedRoots.add(r.rootRawSha256);
    usedFull.add(id.fullSourceTrajectorySha256);usedPrefix.add(id.openingPrefixSha256);usedSegment.add(id.trajectorySegmentSha256);
    selected.push({trajectoryId:`seed-${seed}`,sourceSeed:seed,fullSourceTrajectorySha256:id.fullSourceTrajectorySha256,openingPrefixSha256:id.openingPrefixSha256,trajectorySegmentSha256:id.trajectorySegmentSha256,adjacentRootPairSha256:id.adjacentRootPairSha256,eventWindowSha256:id.eventWindowSha256,roots:id.roots});
  }
  return{trajectories:selected,rejections,populationComplete:selected.length===S.targetTrajectories,selectedTrajectoryCount:selected.length,selectedRootCount:selected.reduce((n,t)=>n+t.roots.length,0),firewallIdentityCoreSha256:fw.identityCoreSha256,firewallCounts:fw.counts};
}
function resourceCounts(upstream){
  const c=upstream.reconstructionCore;
  const uniqueTransitions=c.parentLayers.reduce((a,x)=>a+BigInt(x.uniqueTransitionCount),0n);
  const parentExpansions=c.layers.filter(x=>x.depth<B.HORIZON).reduce((a,x)=>a+BigInt(x.uniqueRawStateCount),0n);
  const treeNodes=c.layers.reduce((a,x)=>a+BigInt(x.treeNodeOccurrences),0n);
  return{uniqueRawStates:String(c.cumulative.distinctRawStates),uniqueTransitions:String(uniqueTransitions),parentExpansions:String(parentExpansions),legalMoveEvaluations:String(uniqueTransitions),treeNodeOccurrencesSummedAcrossLayers:String(treeNodes)};
}
function measureRoot(E,source){
  const upstream=U.measureRoot(E,source,B.HORIZON);
  const bect=B.deriveLevel(upstream);
  return{source:upstream.source,upstreamRootReconstructionCoreSha256:upstream.rootReconstructionCoreSha256,upstreamFamilyCoreSha256:upstream.rootFamilyCoreSha256,bect,resourceCounts:resourceCounts(upstream)};
}
function measureTrajectory(E,t){
  const roots=t.roots.map(r=>measureRoot(E,r));
  const series=roots.map(r=>({ply:r.source.selectedPly,phase:r.source.phase,rootRawSha256:r.source.rootRawSha256,levels:r.bect.levels}));
  const classified=B.classifySeries(series);
  const balances=[];
  for(const metricId of B.METRICS)for(const direction of ["UP","DOWN"])balances.push(B.eventBalance(classified,metricId,direction));
  return{trajectoryId:t.trajectoryId,sourceSeed:t.sourceSeed,fullSourceTrajectorySha256:t.fullSourceTrajectorySha256,openingPrefixSha256:t.openingPrefixSha256,trajectorySegmentSha256:t.trajectorySegmentSha256,adjacentRootPairSha256:t.adjacentRootPairSha256,eventWindowSha256:t.eventWindowSha256,roots,series,classified,balances};
}
function summarizeDevelopment(records,expectedTrajectories){
  const candidates=[];
  for(const metricId of B.METRICS){
    for(const direction of ["UP","DOWN"]){
      let coverage=0,onsetTrajectories=0,nonZero=0,positive=0,negative=0;
      for(const t of records){
        const defined=t.series.length===48&&t.series.every(r=>r.levels[metricId]&&r.levels[metricId].defined===true);
        if(defined)coverage++;
        const b=t.balances.find(x=>x.metricId===metricId&&x.direction===direction);
        need(b,"candidate balance missing");
        if(b.onsetCount>0)onsetTrajectories++;
        if(b.balance>0){nonZero++;positive++;}else if(b.balance<0){nonZero++;negative++;}
      }
      const coveragePass=coverage===expectedTrajectories;
      const onsetPrevalencePass=onsetTrajectories>=6;
      const nonZeroBalancePass=nonZero>=6;
      const dominantPersistencePass=nonZero>0&&3*positive>=2*nonZero;
      candidates.push({candidateId:`${metricId}/${direction}`,metricId,direction,coverageCount:coverage,onsetTrajectoryCount:onsetTrajectories,nonZeroBalanceCount:nonZero,positiveBalanceCount:positive,negativeBalanceCount:negative,coveragePass,onsetPrevalencePass,nonZeroBalancePass,dominantPersistencePass,promoted:coveragePass&&onsetPrevalencePass&&nonZeroBalancePass&&dominantPersistencePass});
    }
  }
  const promotedCandidates=candidates.filter(c=>c.promoted).map(c=>({candidateId:c.candidateId,metricId:c.metricId,direction:c.direction}));
  return{expectedTrajectories,observedTrajectories:records.length,candidates,promotedCandidates,noPromotedCandidate:promotedCandidates.length===0};
}
function scientificTrajectoryView(t){return{trajectoryId:t.trajectoryId,sourceSeed:t.sourceSeed,fullSourceTrajectorySha256:t.fullSourceTrajectorySha256,openingPrefixSha256:t.openingPrefixSha256,trajectorySegmentSha256:t.trajectorySegmentSha256,adjacentRootPairSha256:t.adjacentRootPairSha256,eventWindowSha256:t.eventWindowSha256,roots:t.roots.map(r=>({source:sourceOnly(r.source),upstreamRootReconstructionCoreSha256:r.upstreamRootReconstructionCoreSha256,upstreamFamilyCoreSha256:r.upstreamFamilyCoreSha256,bect:r.bect})),series:t.series,classified:t.classified,balances:t.balances};}

module.exports={STUDY_ID:B.STUDY_ID,HORIZON:B.HORIZON,METRICS:B.METRICS,makeFirewall,identitiesFromReplay,selectTrajectories,resourceCounts,measureRoot,measureTrajectory,summarizeDevelopment,scientificTrajectoryView,canonical:B.canonical,digest:B.digest};
