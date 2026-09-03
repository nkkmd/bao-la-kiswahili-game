"use strict";

const S1 = require("./silgm-stage1-production.js");
const Q = require("./silgm-production.js");

function need(v,m){if(!v)throw new Error(m);}
function uniq(a){return [...new Set(a)].sort();}
function normalizedSpec(s2,s1){
  return {
    seedStart:s2.seedStart,seedEnd:s2.seedEnd,maxSourcePly:s1.maxSourcePly,minimumSelectablePly:s1.minimumSelectablePly,targetRoots:s2.targetRoots,
    phaseAssignment:{salt:s2.phaseAssignment.salt,even:s2.phaseAssignment.even,odd:s2.phaseAssignment.odd},
    withinTrajectoryRootSelection:{rankSalt:s2.rootRankSalt},
    searchConditions:s1.searchConditions,searchContrasts:s1.searchContrasts,resourceCeilings:s2.resourceCeilings
  };
}
function combineBaseFirewall(base,stage1Id){
  need(base&&base.scientificOutcomeFieldsRetained===false,"base firewall invalid");
  need(stage1Id&&stage1Id.scientificOutcomeFieldsRetained===false&&stage1Id.identityRowCount===48,"Stage1 identity firewall invalid");
  const rows=stage1Id.identityRows||[];
  return {...base,identitySets:{
    rootRawSha256:uniq([...(base.identitySets.rootRawSha256||[]),...rows.map(x=>x.rootRawSha256)]),
    sourceTrajectorySha256:uniq([...(base.identitySets.sourceTrajectorySha256||[]),...rows.map(x=>x.fullTrajectorySha256)]),
    openingPrefixSha256:uniq([...(base.identitySets.openingPrefixSha256||[]),...rows.map(x=>x.openingPrefixSha256)])
  }};
}
function selectPopulation(s2,s1,base,silgmFw,brmgi,stage1Id){return S1.selectPopulation(normalizedSpec(s2,s1),combineBaseFirewall(base,stage1Id),silgmFw,brmgi);}
function measureSelected(c,s2,s1){return S1.measureSelected(c,normalizedSpec(s2,s1));}
function candidateKey(c){return `${c.contrastId}|${c.endpointId}|${c.metricId}|${c.direction}`;}
function stratum(rows,c,phase){
  let highN=0,lowN=0,changedHigh=0,changedLow=0,equalN=0;
  for(const r of rows){if(r.source.phase!==phase)continue;const cmp=Q.cmpQ(r.geometry[c.metricId],c.thresholds[phase]);if(cmp===0){equalN++;continue;}const y=r.endpointsByContrast[c.contrastId][c.endpointId];need(y===0||y===1,"binary endpoint required");if(cmp>0){highN++;changedHigh+=y;}else{lowN++;changedLow+=y;}}
  const total=highN+lowN,changedTotal=changedHigh+changedLow,unchanged=total-changedTotal;
  const supportPass=highN>=10&&lowN>=10&&changedTotal>=6&&unchanged>=6;
  return{phase,highN,lowN,equalN,total,changedHigh,changedLow,changedTotal,unchanged,supportPass};
}
function evaluateOne(rows,c){
  const namua=stratum(rows,c,"namua"),mtaji=stratum(rows,c,"mtaji"),estimable=namua.supportPass&&mtaji.supportPass;
  if(!estimable)return{candidate:c,candidateKey:candidateKey(c),estimable:false,label:"NON-ESTIMABLE",strata:[namua,mtaji],p:null};
  const test=Q.exactStratifiedTail([namua,mtaji],c.direction);
  return{candidate:c,candidateKey:candidateKey(c),estimable:true,label:null,strata:[namua,mtaji],observed:test.observed,p:test.p};
}
function formalEvaluate(rows,input){
  need(input&&input.promotedCandidateCount===8&&Array.isArray(input.formalPromotedCandidateSet)&&input.formalPromotedCandidateSet.length===8,"formal candidate input invalid");
  const results=input.formalPromotedCandidateSet.map(c=>evaluateOne(rows,c));
  const estimable=results.filter(x=>x.estimable).sort((a,b)=>Q.cmpQ(a.p,b.p)||a.candidateKey.localeCompare(b.candidateKey));
  const m=estimable.length;let active=true;
  for(let i=0;i<m;i++){
    const x=estimable[i],thr=Q.fraction(1n,20n*BigInt(m-i)),pass=active&&Q.cmpQ(x.p,thr)<=0;
    x.holmRank=i+1;x.holmThreshold=thr;x.holmStepPass=pass;x.label=pass?"CONFIRMED":"NOT-CONFIRMED";if(!pass)active=false;
  }
  const byKey=new Map(estimable.map(x=>[x.candidateKey,x]));
  for(const x of results)if(x.estimable)Object.assign(x,byKey.get(x.candidateKey));
  const ordered=results.slice().sort((a,b)=>a.candidateKey.localeCompare(b.candidateKey));
  const core={estimableCandidateCount:m,confirmedCandidateCount:ordered.filter(x=>x.label==="CONFIRMED").length,notConfirmedCandidateCount:ordered.filter(x=>x.label==="NOT-CONFIRMED").length,nonEstimableCandidateCount:ordered.filter(x=>x.label==="NON-ESTIMABLE").length,candidateResults:ordered};
  return{...core,formalCoreSha256:Q.digest(core)};
}
module.exports={normalizedSpec,combineBaseFirewall,selectPopulation,measureSelected,formalEvaluate,digest:Q.digest,stable:Q.stable};
