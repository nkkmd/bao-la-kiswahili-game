"use strict";

const P0 = require("./lgtggc-stage0-production.js");

const STAGE_ID = "LGTGGC-S1-DEVELOPMENT-2026-09-04-v1";
const RF1 = P0.RF1, RF2 = P0.RF2, P1 = P0.P1, P2 = P0.P2;
const SALTS = Object.freeze({
  sfcdfRootFamily:"LGTGGC-S1-SFCDF-RF-2026-09-04-v1",
  sfcdfSelection:"LGTGGC-S1-SFCDF-SELECT-2026-09-04-v1",
  silgmPhase:"LGTGGC-S1-SILGM-PHASE-2026-09-04-v1",
  silgmRootFamily:"LGTGGC-S1-SILGM-RF-2026-09-04-v1",
  silgmSelection:"LGTGGC-S1-SILGM-SELECT-2026-09-04-v1",
  gcldCandidate:"LGTGGC-S1-GCLD-CANDIDATE-2026-09-04-v1"
});

function need(x,m){if(!x)throw new Error(m);}
function clone(x){return JSON.parse(JSON.stringify(x));}
function parity(salt,seed){return parseInt(P0.digest(`${salt}|${seed}`).slice(0,8),16)%2;}
function policyForSeed(seed){return seed%2===0?P1:P2;}
function familyForSeed(seed,salt){return parity(salt,seed)===0?RF1:RF2;}
function phaseForSeed(seed,salt){return parity(salt,seed)===0?"namua":"mtaji";}
function rank(salt,parts){return P0.digest([salt,...parts].join("|"));}
function trajectory(E,seed,maxPly){
  need(Number.isInteger(seed)&&Number.isInteger(maxPly)&&maxPly>0,"bad trajectory args");
  const policyId=policyForSeed(seed),r=P0.rng(seed),moveKeys=[],rows=[];
  let state=E.initialState(),relayLimit=false,firstMtaji=null;
  for(let ply=0;ply<=maxPly;ply++){
    const terminal=state.winner!==null;
    const rawStateKey=P0.stateKey(state);
    const row={ply,phase:state.phase,terminal,rawStateKey,state:clone(state)};
    rows.push(row);
    if(!terminal&&ply>=44&&state.phase==="mtaji"&&firstMtaji===null)firstMtaji=clone(row);
    if(terminal||ply===maxPly)break;
    const choice=P0.chooseMove(E,state,policyId,r());
    moveKeys.push(choice.moveKey);
    const applied=E.applyMove(state,choice.move);
    state=applied.state;
    if(state.reason==="relay-limit"){relayLimit=true;break;}
  }
  const prefix=moveKeys.slice(0,16);
  const trajectorySha256=P0.digest({seed,policyId,moveKeys,relayLimit,lastPly:rows[rows.length-1].ply,terminal:rows[rows.length-1].terminal});
  const openingPrefixSha256=P0.digest({moveKeys:prefix});
  return{seed,policyId,moveKeys,trajectorySha256,openingPrefixSha256,relayLimit,rows,firstMtaji,lastPly:rows[rows.length-1].ply,terminal:rows[rows.length-1].terminal};
}
function rowAt(t,ply){return t.rows.find(r=>r.ply===ply)||null;}
function pairAnchor(t,familyId){
  let namua=null,mtaji=null;
  if(familyId===RF1){
    const n=rowAt(t,24);if(n&&!n.terminal&&n.phase==="namua")namua=n;
    if(t.firstMtaji&&!t.firstMtaji.terminal)mtaji=t.firstMtaji;
  }else if(familyId===RF2){
    const n=rowAt(t,32),m=rowAt(t,56);
    if(n&&!n.terminal&&n.phase==="namua")namua=n;
    if(m&&!m.terminal&&m.phase==="mtaji")mtaji=m;
  }else throw new Error("unknown family");
  return{namua:namua?clone(namua):null,mtaji:mtaji?clone(mtaji):null,complete:Boolean(namua&&mtaji)};
}
function phaseAnchor(t,familyId,phase){
  need(phase==="namua"||phase==="mtaji","bad phase");
  const p=pairAnchor(t,familyId);
  return phase==="namua"?p.namua:p.mtaji;
}
function sourceObject(t,row){
  need(t&&row,"sourceObject args");
  return{phase:row.phase,sourceSeed:t.seed,selectedPly:row.ply,rootRawSha256:row.rawStateKey,sourceTrajectorySha256:t.trajectorySha256,openingPrefixSha256:t.openingPrefixSha256,openingPrefixLength:Math.min(16,t.moveKeys.length),rootState:clone(row.state)};
}
function sfcdfCandidate(E,seed){
  const t=trajectory(E,seed,80),familyId=familyForSeed(seed,SALTS.sfcdfRootFamily),p=pairAnchor(t,familyId);
  if(t.relayLimit||!p.complete)return{seed,policyId:t.policyId,familyId,eligible:false,reason:t.relayLimit?"SOURCE_RELAY_LIMIT":"ANCHOR_UNAVAILABLE",trajectorySha256:t.trajectorySha256,openingPrefixSha256:t.openingPrefixSha256};
  const cell=`${t.policyId}|${familyId}`;
  return{seed,policyId:t.policyId,familyId,cell,eligible:true,trajectorySha256:t.trajectorySha256,openingPrefixSha256:t.openingPrefixSha256,namua:sourceObject(t,p.namua),mtaji:sourceObject(t,p.mtaji),selectionRank:rank(SALTS.sfcdfSelection,[cell,seed,t.trajectorySha256,p.namua.rawStateKey,p.mtaji.rawStateKey])};
}
function selectSfcdf(candidates,target=10){
  const cells=[`${P1}|${RF1}`,`${P1}|${RF2}`,`${P2}|${RF1}`,`${P2}|${RF2}`],selected=[],support={};
  const usedTraj=new Set(),usedRaw=new Set();
  for(const cell of cells){
    const pool=candidates.filter(x=>x.eligible&&x.cell===cell).sort((a,b)=>a.selectionRank.localeCompare(b.selectionRank)||a.seed-b.seed);let n=0;
    for(const c of pool){if(usedTraj.has(c.trajectorySha256)||usedRaw.has(c.namua.rootRawSha256)||usedRaw.has(c.mtaji.rootRawSha256))continue;selected.push(c);usedTraj.add(c.trajectorySha256);usedRaw.add(c.namua.rootRawSha256);usedRaw.add(c.mtaji.rootRawSha256);n++;if(n===target)break;}
    support[cell]={eligiblePool:pool.length,selected:n,target};
  }
  return{cells,support,selected,complete:cells.every(c=>support[c].selected===target),selectionCoreSha256:P0.digest(selected.map(identitySfcdf))};
}
function identitySfcdf(c){return{seed:c.seed,policyId:c.policyId,familyId:c.familyId,trajectorySha256:c.trajectorySha256,openingPrefixSha256:c.openingPrefixSha256,namuaRaw:c.namua.rootRawSha256,namuaPly:c.namua.selectedPly,mtajiRaw:c.mtaji.rootRawSha256,mtajiPly:c.mtaji.selectedPly,selectionRank:c.selectionRank};}
function silgmCandidate(E,seed){
  const t=trajectory(E,seed,80),phase=phaseForSeed(seed,SALTS.silgmPhase),familyId=familyForSeed(seed,SALTS.silgmRootFamily),a=phaseAnchor(t,familyId,phase);
  if(t.relayLimit||!a)return{seed,policyId:t.policyId,familyId,phase,eligible:false,reason:t.relayLimit?"SOURCE_RELAY_LIMIT":"ANCHOR_UNAVAILABLE",trajectorySha256:t.trajectorySha256,openingPrefixSha256:t.openingPrefixSha256};
  const source=sourceObject(t,a),width=P0.legalRows(E,a.state).length,threshold=phase==="namua"?4:3,widthClass=width>threshold?"HIGH":width<threshold?"LOW":"EQUAL";
  if(widthClass==="EQUAL")return{seed,policyId:t.policyId,familyId,phase,eligible:false,reason:"WIDTH_EQUAL_THRESHOLD",rootLegalWidth:width,trajectorySha256:t.trajectorySha256,openingPrefixSha256:t.openingPrefixSha256,rootRawSha256:source.rootRawSha256};
  const cell=`${t.policyId}|${familyId}|${phase}|${widthClass}`;
  return{seed,policyId:t.policyId,familyId,phase,widthClass,rootLegalWidth:width,cell,eligible:true,trajectorySha256:t.trajectorySha256,openingPrefixSha256:t.openingPrefixSha256,source,selectionRank:rank(SALTS.silgmSelection,[cell,seed,t.trajectorySha256,source.rootRawSha256])};
}
function selectSilgm(candidates,target=8){
  const cells=[];for(const p of[P1,P2])for(const f of[RF1,RF2])for(const ph of["namua","mtaji"])for(const w of["HIGH","LOW"])cells.push(`${p}|${f}|${ph}|${w}`);
  const selected=[],support={},usedTraj=new Set(),usedRaw=new Set();
  for(const cell of cells){const pool=candidates.filter(x=>x.eligible&&x.cell===cell).sort((a,b)=>a.selectionRank.localeCompare(b.selectionRank)||a.seed-b.seed);let n=0;for(const c of pool){if(usedTraj.has(c.trajectorySha256)||usedRaw.has(c.source.rootRawSha256))continue;selected.push(c);usedTraj.add(c.trajectorySha256);usedRaw.add(c.source.rootRawSha256);n++;if(n===target)break;}support[cell]={eligiblePool:pool.length,selected:n,target};}
  return{cells,support,selected,complete:cells.every(c=>support[c].selected===target),selectionCoreSha256:P0.digest(selected.map(identitySilgm))};
}
function identitySilgm(c){return{seed:c.seed,policyId:c.policyId,familyId:c.familyId,phase:c.phase,widthClass:c.widthClass,rootLegalWidth:c.rootLegalWidth,trajectorySha256:c.trajectorySha256,openingPrefixSha256:c.openingPrefixSha256,rootRawSha256:c.source.rootRawSha256,selectedPly:c.source.selectedPly,selectionRank:c.selectionRank};}
function gcldCandidate(E,seed){
  const t=trajectory(E,seed,72);if(t.relayLimit)return{seed,policyId:t.policyId,eligible:false,reason:"SOURCE_RELAY_LIMIT",trajectorySha256:t.trajectorySha256,openingPrefixSha256:t.openingPrefixSha256};
  const r72=rowAt(t,72);if(!r72||r72.terminal)return{seed,policyId:t.policyId,eligible:false,reason:"TERMINAL_BEFORE_OR_AT_72",trajectorySha256:t.trajectorySha256,openingPrefixSha256:t.openingPrefixSha256};
  const checkpoints=[16,20,24,28,32,36,40,44,48,52,56,60,64,68,72].map(ply=>{const r=rowAt(t,ply);need(r&&!r.terminal,`missing live checkpoint ${ply}`);return sourceObject(t,r);});
  return{seed,policyId:t.policyId,eligible:true,trajectorySha256:t.trajectorySha256,openingPrefixSha256:t.openingPrefixSha256,checkpoints,candidateRank:rank(SALTS.gcldCandidate,[t.policyId,seed,t.trajectorySha256,t.openingPrefixSha256])};
}
function selectGcldCandidates(candidates,target=24){
  const selected=[],support={},usedTraj=new Set();for(const policyId of[P1,P2]){const pool=candidates.filter(x=>x.eligible&&x.policyId===policyId).sort((a,b)=>a.candidateRank.localeCompare(b.candidateRank)||a.seed-b.seed);let n=0;for(const c of pool){if(usedTraj.has(c.trajectorySha256))continue;selected.push(c);usedTraj.add(c.trajectorySha256);n++;if(n===target)break;}support[policyId]={eligiblePool:pool.length,selected:n,target};}
  return{support,selected,complete:[P1,P2].every(p=>support[p].selected===target),selectionCoreSha256:P0.digest(selected.map(identityGcld))};
}
function identityGcld(c){return{seed:c.seed,policyId:c.policyId,trajectorySha256:c.trajectorySha256,openingPrefixSha256:c.openingPrefixSha256,candidateRank:c.candidateRank,checkpointRawSha256:c.checkpoints.map(x=>x.rootRawSha256)};}
module.exports={STAGE_ID,SALTS,P1,P2,RF1,RF2,policyForSeed,familyForSeed,phaseForSeed,trajectory,pairAnchor,phaseAnchor,sourceObject,sfcdfCandidate,selectSfcdf,identitySfcdf,silgmCandidate,selectSilgm,identitySilgm,gcldCandidate,selectGcldCandidates,identityGcld,digest:P0.digest,stable:P0.stable};
