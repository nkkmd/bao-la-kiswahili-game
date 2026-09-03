"use strict";

const E = require("../../../public/engine.js");
const Q = require("./silgm-independent.js");
const IU = require("./lgtgmiv-stage1-independent.js");

const G = ["SILGM-G1-ROOT-LEGAL-WIDTH","SILGM-G2-CUMULATIVE-TREE-OCCURRENCE","SILGM-G3-DUPLICATE-TRANSITION-FRACTION","SILGM-G4-CUMULATIVE-TREE-RAW-RATIO","SILGM-G5-UNIT-WIDTH-OCCUPANCY-FRACTION"];
const EP = ["SILGM-E1-CANONICAL-BEST-CHANGE","SILGM-E2-TOPSET-CHANGE","SILGM-E3-RANKING-PREORDER-CHANGE","SILGM-E4-BEST-SECOND-GAP-CHANGE","SILGM-E5-PV-PREFIX2-CHANGE"];
function must(v, m) { if (!v) throw new Error(m); }
function cp(v) { return structuredClone(v); }
function randomFor(seed) { let x = seed >>> 0; return () => { x += 0x6D2B79F5; let t=x; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; }; }
function moves(s) { if (s.winner !== null) return []; const a=E.moveVariants(s).map(m=>({m,k:Q.moveKey(m)})); a.sort((x,y)=>x.k.localeCompare(y.k)); return a; }
function assignedPhase(traj, S) { const d=Q.digest(`${S.phaseAssignment.salt}|${traj}`); return ((parseInt(d.substring(0,8),16)>>>0)&1)===0?S.phaseAssignment.even:S.phaseAssignment.odd; }
function rankFor(traj, raw, ply, S) { return Q.digest(`${S.withinTrajectoryRootSelection.rankSalt}|${traj}|${raw}|${String(ply)}`); }
function replay(seed, S) {
  let s=E.initialState(), r=randomFor(seed), relay=false; const history=[], obs=[];
  for(let ply=1;ply<=S.maxSourcePly&&s.winner===null;ply++){
    const a=moves(s); must(a.length>0,`independent zero legal seed=${seed} ply=${ply}`); const z=a[Math.floor(r()*a.length)];
    const applied=E.applyMove(s,z.m).state, raw=Q.stateKey(applied); history.push({moveKey:z.k,afterRawStateSha256:raw});
    if(applied.reason==="relay-limit"){relay=true;s=applied;break;} s=applied;
    if(ply>=S.minimumSelectablePly&&s.winner===null){const width=E.moveVariants(s).length;if(width>=2)obs.push({ply,phase:s.phase,rawStateSha256:raw,legalMoveCount:width,state:cp(s)});}
  }
  return {seed,relayLimit:relay,fullTrajectorySha256:Q.digest(history),openingPrefixSha256:Q.digest(history.slice(0,16).map(x=>x.moveKey)),openingPrefixLength:Math.min(16,history.length),trajectoryLength:history.length,observations:obs};
}
function firewall(base, meta, brmgi) {
  must(meta.scientificOutcomeFieldsRetained===false&&meta.g202ScientificRowsRetained===false&&meta.g306SelectionMismatchDiagnosticsRetained===false,"independent firewall meta invalid");
  must(base.scientificOutcomeFieldsRetained===false&&base.g303DiagnosticScientificFieldsRetained===false&&base.g304ScientificOutcomeFieldsRetained===false&&base.g305PartialScientificFieldsRetained===false,"independent base firewall invalid");
  must(brmgi.stageDisposition==="TECHNICAL-INVALID"&&Array.isArray(brmgi.formalPromotedCandidateSet)&&brmgi.formalPromotedCandidateSet.length===0,"independent BRMGI boundary invalid");
  must(meta.brmgiContribution.retainedIdentityRows.length===0,"BRMGI failed selection rows retained");
  return {r:new Set(base.identitySets.rootRawSha256||[]),t:new Set(base.identitySets.sourceTrajectorySha256||[]),p:new Set(base.identitySets.openingPrefixSha256||[])};
}
function candidate(game,S,F){
  if(game.relayLimit)return{why:"SOURCE-RELAY-LIMIT",seed:game.seed}; if(F.t.has(game.fullTrajectorySha256))return{why:"UPSTREAM-TRAJECTORY",seed:game.seed}; if(F.p.has(game.openingPrefixSha256))return{why:"UPSTREAM-PREFIX",seed:game.seed};
  const phase=assignedPhase(game.fullTrajectorySha256,S), a=[]; for(const o of game.observations)if(o.phase===phase)a.push({...o,selectionRank:rankFor(game.fullTrajectorySha256,o.rawStateSha256,o.ply,S)});
  if(!a.length)return{why:"ASSIGNED-PHASE-UNAVAILABLE",seed:game.seed,assignedPhase:phase}; a.sort((x,y)=>x.selectionRank.localeCompare(y.selectionRank)||x.rawStateSha256.localeCompare(y.rawStateSha256)||x.ply-y.ply); const o=a[0];
  if(F.r.has(o.rawStateSha256))return{why:"UPSTREAM-RAW",seed:game.seed,assignedPhase:phase,selectedRaw:o.rawStateSha256};
  return {seed:game.seed,assignedPhase:phase,phase:o.phase,selectedPly:o.ply,selectionRank:o.selectionRank,rootRawSha256:o.rawStateSha256,fullTrajectorySha256:game.fullTrajectorySha256,openingPrefixSha256:game.openingPrefixSha256,openingPrefixLength:game.openingPrefixLength,trajectoryLength:game.trajectoryLength,legalMoveCount:o.legalMoveCount,state:o.state};
}
function publicRow(x){return{seed:x.seed,assignedPhase:x.assignedPhase,phase:x.phase,selectedPly:x.selectedPly,selectionRank:x.selectionRank,rootRawSha256:x.rootRawSha256,fullTrajectorySha256:x.fullTrajectorySha256,openingPrefixSha256:x.openingPrefixSha256,openingPrefixLength:x.openingPrefixLength,trajectoryLength:x.trajectoryLength,legalMoveCount:x.legalMoveCount};}
function better(x,y){let c=x.selectionRank.localeCompare(y.selectionRank);if(c)return c<0?x:y;c=x.fullTrajectorySha256.localeCompare(y.fullTrajectorySha256);if(c)return c<0?x:y;if(x.seed!==y.seed)return x.seed<y.seed?x:y;if(x.selectedPly!==y.selectedPly)return x.selectedPly<y.selectedPly?x:y;return x.rootRawSha256<y.rootRawSha256?x:y;}
function selectPopulation(S,base,meta,brmgi){
  const F=firewall(base,meta,brmgi), prelim=[],reject=[]; for(let seed=S.seedStart;seed<=S.seedEnd;seed++){const c=candidate(replay(seed,S),S,F);if(c.why)reject.push(c);else prelim.push(c);}
  const map=new Map();for(const x of prelim)map.set(x.rootRawSha256,map.has(x.rootRawSha256)?better(map.get(x.rootRawSha256),x):x);const retained=[...map.values()];
  const ord=(x,y)=>x.selectionRank.localeCompare(y.selectionRank)||x.fullTrajectorySha256.localeCompare(y.fullTrajectorySha256)||x.seed-y.seed||x.selectedPly-y.selectedPly||x.rootRawSha256.localeCompare(y.rootRawSha256);
  const n=retained.filter(x=>x.phase==="namua").sort(ord).slice(0,S.targetRoots.namua),m=retained.filter(x=>x.phase==="mtaji").sort(ord).slice(0,S.targetRoots.mtaji),selected=n.concat(m).sort((x,y)=>(x.phase==="namua"?0:1)-(y.phase==="namua"?0:1)||ord(x,y));
  const rejectionCounts={};for(const x of reject)rejectionCounts[x.why]=(rejectionCounts[x.why]||0)+1;
  const core={selected:selected.map(publicRow),selectedCounts:{namua:n.length,mtaji:m.length,total:selected.length},populationComplete:n.length===S.targetRoots.namua&&m.length===S.targetRoots.mtaji,preliminaryCount:prelim.length,deduplicatedCount:retained.length,rejectionCounts};
  return{selected,selectionCore:core,selectionCoreSha256:Q.digest(core)};
}
function src(c){return{phase:c.phase,sourceSeed:c.seed,selectedPly:c.selectedPly,rootRawSha256:c.rootRawSha256,sourceTrajectorySha256:c.fullTrajectorySha256,openingPrefixSha256:c.openingPrefixSha256,openingPrefixLength:c.openingPrefixLength,rootState:cp(c.state)};}
function measureSelected(c,S){
  const raw=IU.measureRoot(E,src(c),5), geom=Q.deriveGeometry(raw), conditions={};for(const cond of S.searchConditions)conditions[cond.id]=Q.conditionResult(c.state,cond);const estimable=Object.values(conditions).every(x=>x.estimable===true),by={};if(estimable)for(const z of S.searchContrasts)by[z.contrastId]=Q.endpoints(conditions[z.a],conditions[z.b]);
  const row={source:publicRow(c),geometry:geom.metrics,conditions,endpointsByContrast:by,allSearchEstimable:estimable,upstreamRootReconstructionCoreSha256:geom.upstreamRootReconstructionCoreSha256,upstreamFamilyCoreSha256:geom.upstreamFamilyCoreSha256};return{row,rowSha256:Q.digest(row)};
}
function qadd(a,b){return Q.fraction(BigInt(a.numerator)*BigInt(b.denominator)+BigInt(b.numerator)*BigInt(a.denominator),BigInt(a.denominator)*BigInt(b.denominator));}
function qabs(a){return Q.fraction(BigInt(a.numerator)<0n?-BigInt(a.numerator):BigInt(a.numerator),BigInt(a.denominator));}
function qsign(a){const n=BigInt(a.numerator);return n>0n?1:n<0n?-1:0;}
function summarizeDevelopment(rows,S){
  const groups={namua:rows.filter(x=>x.source.phase==="namua"),mtaji:rows.filter(x=>x.source.phase==="mtaji")},thresholds={namua:{},mtaji:{}};for(const p of ["namua","mtaji"])for(const g of G)thresholds[p][g]=Q.midpoint(groups[p].map(x=>x.geometry[g]));
  const slots=[],promotedCandidates=[];for(const contrast of S.searchContrasts)for(const endpointId of EP){const candidates=[];for(const metricId of G){const phase={};let support=true;for(const p of ["namua","mtaji"]){let changed=0;for(const x of groups[p])changed+=x.endpointsByContrast[contrast.contrastId][endpointId];const small=groups[p].map(x=>({geometry:x.geometry,endpoints:x.endpointsByContrast[contrast.contrastId]})),rd=Q.riskDifference(small,metricId,thresholds[p][metricId],endpointId);phase[p]={changed,unchanged:groups[p].length-changed,riskDifference:rd};support=support&&rd.defined&&rd.highN>=S.developmentPromotion.minimumSupportPerPhase.high&&rd.lowN>=S.developmentPromotion.minimumSupportPerPhase.low&&changed>=S.developmentPromotion.minimumSupportPerPhase.changed&&(groups[p].length-changed)>=S.developmentPromotion.minimumSupportPerPhase.unchanged;}
    const sn=phase.namua.riskDifference.defined?qsign(phase.namua.riskDifference.value):0,sm=phase.mtaji.riskDifference.defined?qsign(phase.mtaji.riskDifference.value):0,direction=support&&sn!==0&&sn===sm?(sn>0?"HIGHER-IN-HIGH":"LOWER-IN-HIGH"):null,strength=direction?qadd(qabs(phase.namua.riskDifference.value),qabs(phase.mtaji.riskDifference.value)):Q.fraction(0n,1n);candidates.push({metricId,thresholds:{namua:thresholds.namua[metricId],mtaji:thresholds.mtaji[metricId]},phase,supportPass:support,direction,strength});}
    const eligible=candidates.filter(x=>x.direction).sort((a,b)=>Q.cmpQ(b.strength,a.strength)||a.metricId.localeCompare(b.metricId)),pick=eligible[0]||null;slots.push({contrastId:contrast.contrastId,endpointId,candidates,selectedMetricId:pick?pick.metricId:null,direction:pick?pick.direction:null});if(pick)promotedCandidates.push({contrastId:contrast.contrastId,endpointId,metricId:pick.metricId,thresholds:pick.thresholds,direction:pick.direction,strength:pick.strength});}
  promotedCandidates.sort((a,b)=>a.contrastId.localeCompare(b.contrastId)||a.endpointId.localeCompare(b.endpointId));const core={thresholds,slots,promotedCandidates};return{...core,developmentCoreSha256:Q.digest(core)};
}
module.exports={replaySeed:replay,selectPopulation,measureSelected,summarizeDevelopment,publicCandidate:publicRow,stable:Q.stable,digest:Q.digest};
