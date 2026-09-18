"use strict";

const crypto = require("node:crypto");
const L = require("./lgttci-compatibility-independent.js");

const STUDY_ID = "SFCDFT-STUDY3";
const P1 = L.P1, P2 = L.P2, RF1 = L.RF1, RF2 = L.RF2;
function assertOk(x,m){if(!x)throw new Error(m);}function clone(x){return JSON.parse(JSON.stringify(x));}
function hash(x){return crypto.createHash("sha256").update(String(x),"utf8").digest("hex");}
function canonical(x){return L.stable(x);}
function policyForSeed(seed){assertOk(Number.isInteger(seed),"independent assignment seed must be integer");return(seed&1)===1?P1:P2;}
function familyForSeed(stageId,seed){assertOk(typeof stageId==='string'&&stageId!=='' ,'independent stageId required');assertOk(Number.isInteger(seed),'independent assignment seed must be integer');const byte=Number.parseInt(hash(stageId+'|RF|'+seed).slice(0,2),16);return(byte&1)===0?RF1:RF2;}
function domainId(policyId,familyId){const m=new Map([[`${P1}|${RF1}`,'SFCDFT3-D1-P1-RF1'],[`${P1}|${RF2}`,'SFCDFT3-D2-P1-RF2'],[`${P2}|${RF1}`,'SFCDFT3-D3-P2-RF1'],[`${P2}|${RF2}`,'SFCDFT3-D4-P2-RF2']]);const v=m.get(`${policyId}|${familyId}`);assertOk(v,'independent unknown domain');return v;}
function prefix(moveKeys,complete){assertOk(Array.isArray(moveKeys),'independent moveKeys required');if(moveKeys.length<16){assertOk(!complete,'independent complete candidate requires first16');return{openingPrefixAvailable:false,openingPrefixLength:moveKeys.length,openingPrefixSha256:null};}let text='';for(let i=0;i<16;i++)text+=(i?'\n':'')+moveKeys[i];return{openingPrefixAvailable:true,openingPrefixLength:16,openingPrefixSha256:hash(text)};}
function anchorsFor(familyId){return{familyId,namua:null,mtaji:null,complete:false};}
function update(a,row){if(row.terminal)return;if(a.familyId===RF1){if(a.namua===null&&row.ply===20&&row.phase==='namua')a.namua=clone(row);if(a.mtaji===null&&row.ply>=40&&row.phase==='mtaji')a.mtaji=clone(row);}else if(a.familyId===RF2){if(a.namua===null&&row.ply===28&&row.phase==='namua')a.namua=clone(row);if(a.mtaji===null&&row.ply===52&&row.phase==='mtaji')a.mtaji=clone(row);}else throw new Error('independent unknown root family');a.complete=a.namua!==null&&a.mtaji!==null;}
function replay(E,stageId,assignmentSeed,effectiveSeed,maxPly=240){
 assertOk(Number.isInteger(assignmentSeed)&&Number.isInteger(effectiveSeed),'independent assignment/effective seed required');assertOk(Number.isInteger(maxPly)&&maxPly>0,'independent maxPly invalid');
 const policyId=policyForSeed(assignmentSeed),familyId=familyForSeed(stageId,assignmentSeed),rng=L.rng(effectiveSeed),a=anchorsFor(familyId),rows=[],moveKeys=[];let state=E.initialState(),stopReason=null,engineGuard=null;
 for(let ply=1;ply<=maxPly&&state.winner===null;ply++){
  const chosen=L.chooseMove(E,state,policyId,rng());moveKeys.push(chosen.moveKey);const applied=E.applyMove(state,clone(chosen.move),{snapshots:false});assertOk(applied&&applied.state,'independent applyMove state missing');state=applied.state;
  if(state.reason==='relay-limit'){stopReason='ENGINE-GUARD';engineGuard={kind:'relay-limit',ply};break;}
  const terminal=state.winner!==null,row={ply,phase:state.phase,terminal,rootLegalWidth:terminal?0:E.moveVariants(state).length,rawStateSha256:L.stateKey(state),state:clone(state)};rows.push(row);update(a,row);
  if(a.complete){stopReason='PAIR-COMPLETE';break;}if(terminal){stopReason='NATURAL-TERMINAL';break;}
 }
 if(stopReason===null)stopReason='MAX-SOURCE-PLY';const complete=Boolean(a.complete),p=prefix(moveKeys,complete);let candidateStatus='NO-CANDIDATE-ROOT-SHORTAGE';if(complete)candidateStatus='CANDIDATE-PAIR-COMPLETE';else if(stopReason==='ENGINE-GUARD')candidateStatus='NO-CANDIDATE-ENGINE-GUARD-CENSORING';
 if(complete){assertOk(stopReason==='PAIR-COMPLETE','independent complete pair stop mismatch');const latest=a.namua.ply>a.mtaji.ply?a.namua.ply:a.mtaji.ply;assertOk(moveKeys.length===latest,'independent post-candidate continuation detected');assertOk(p.openingPrefixAvailable&&p.openingPrefixLength===16&&typeof p.openingPrefixSha256==='string','independent candidate prefix invalid');}
 const trajectory=hash(moveKeys.join('\n'));return{studyId:STUDY_ID,stageId,assignmentSeed,effectiveSeed,policyId,familyId,domainId:domainId(policyId,familyId),candidateStatus,pairComplete:complete,stopReason,engineGuard,scientificTerminal:stopReason==='NATURAL-TERMINAL',engineWinnerPresentAtStop:state.winner!==null,postCandidateContinuationCount:0,sourceTrajectorySha256:trajectory,openingPrefixAvailable:p.openingPrefixAvailable,openingPrefixLength:p.openingPrefixLength,openingPrefixSha256:p.openingPrefixSha256,moveCount:moveKeys.length,anchors:clone(a),replay:{moveKeys:clone(moveKeys),rows:clone(rows),stopReason,engineGuard:clone(engineGuard)}};
}
module.exports={STUDY_ID,P1,P2,RF1,RF2,canonical,policyForSeed,familyForSeed,domainId,replay,stateKey:L.stateKey,moveKey:L.moveKey};
