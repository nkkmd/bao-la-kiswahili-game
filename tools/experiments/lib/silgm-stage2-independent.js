"use strict";

const S1 = require("./silgm-stage1-independent.js");
const Q = require("./silgm-independent.js");

function must(v,m){if(!v)throw new Error(m);}
function sortedUnique(a){return [...new Set(a)].sort();}
function stageSpec(s2,s1){return{seedStart:s2.seedStart,seedEnd:s2.seedEnd,maxSourcePly:s1.maxSourcePly,minimumSelectablePly:s1.minimumSelectablePly,targetRoots:s2.targetRoots,phaseAssignment:{salt:s2.phaseAssignment.salt,even:s2.phaseAssignment.even,odd:s2.phaseAssignment.odd},withinTrajectoryRootSelection:{rankSalt:s2.rootRankSalt},searchConditions:s1.searchConditions,searchContrasts:s1.searchContrasts,resourceCeilings:s2.resourceCeilings};}
function mergedFirewall(base,stage1Id){
  must(base&&base.scientificOutcomeFieldsRetained===false,"independent base firewall invalid");must(stage1Id&&stage1Id.scientificOutcomeFieldsRetained===false&&stage1Id.identityRowCount===48,"independent Stage1 identity invalid");
  const rows=stage1Id.identityRows||[];return{...base,identitySets:{rootRawSha256:sortedUnique((base.identitySets.rootRawSha256||[]).concat(rows.map(x=>x.rootRawSha256))),sourceTrajectorySha256:sortedUnique((base.identitySets.sourceTrajectorySha256||[]).concat(rows.map(x=>x.fullTrajectorySha256))),openingPrefixSha256:sortedUnique((base.identitySets.openingPrefixSha256||[]).concat(rows.map(x=>x.openingPrefixSha256)))}};
}
function selectPopulation(s2,s1,base,silgmFw,brmgi,stage1Id){return S1.selectPopulation(stageSpec(s2,s1),mergedFirewall(base,stage1Id),silgmFw,brmgi);}
function measureSelected(c,s2,s1){return S1.measureSelected(c,stageSpec(s2,s1));}
function key(c){return [c.contrastId,c.endpointId,c.metricId,c.direction].join("|");}
function phaseTable(rows,c,p){let hi=0,lo=0,hc=0,lc=0,eq=0;for(const r of rows){if(r.source.phase!==p)continue;const z=Q.cmpQ(r.geometry[c.metricId],c.thresholds[p]);if(z===0){eq++;continue;}const y=r.endpointsByContrast[c.contrastId][c.endpointId];must(y===0||y===1,"independent endpoint nonbinary");if(z>0){hi++;hc+=y;}else{lo++;lc+=y;}}const total=hi+lo,changed=hc+lc,unchanged=total-changed;return{phase:p,highN:hi,lowN:lo,equalN:eq,total,changedHigh:hc,changedLow:lc,changedTotal:changed,unchanged,supportPass:hi>=10&&lo>=10&&changed>=6&&unchanged>=6};}
function one(rows,c){const n=phaseTable(rows,c,"namua"),m=phaseTable(rows,c,"mtaji"),ok=n.supportPass&&m.supportPass;if(!ok)return{candidate:c,candidateKey:key(c),estimable:false,label:"NON-ESTIMABLE",strata:[n,m],p:null};const t=Q.exactStratifiedTail([n,m],c.direction);return{candidate:c,candidateKey:key(c),estimable:true,label:null,strata:[n,m],observed:t.observed,p:t.p};}
function formalEvaluate(rows,input){
  must(input&&input.promotedCandidateCount===8&&Array.isArray(input.formalPromotedCandidateSet)&&input.formalPromotedCandidateSet.length===8,"independent formal input invalid");const res=input.formalPromotedCandidateSet.map(c=>one(rows,c));
  const e=res.filter(x=>x.estimable).sort((a,b)=>Q.cmpQ(a.p,b.p)||a.candidateKey.localeCompare(b.candidateKey));let alive=true;const count=e.length;
  for(let i=0;i<count;i++){const x=e[i],threshold=Q.fraction(1n,20n*BigInt(count-i)),pass=alive&&Q.cmpQ(x.p,threshold)<=0;x.holmRank=i+1;x.holmThreshold=threshold;x.holmStepPass=pass;x.label=pass?"CONFIRMED":"NOT-CONFIRMED";if(!pass)alive=false;}
  const map=new Map(e.map(x=>[x.candidateKey,x]));for(const x of res)if(x.estimable)Object.assign(x,map.get(x.candidateKey));const ordered=res.slice().sort((a,b)=>a.candidateKey.localeCompare(b.candidateKey));const core={estimableCandidateCount:count,confirmedCandidateCount:ordered.filter(x=>x.label==="CONFIRMED").length,notConfirmedCandidateCount:ordered.filter(x=>x.label==="NOT-CONFIRMED").length,nonEstimableCandidateCount:ordered.filter(x=>x.label==="NON-ESTIMABLE").length,candidateResults:ordered};return{...core,formalCoreSha256:Q.digest(core)};
}
module.exports={stageSpec,mergedFirewall,selectPopulation,measureSelected,formalEvaluate,digest:Q.digest,stable:Q.stable};
