"use strict";

const crypto = require("node:crypto");
const L = require("./lgttci-compatibility-production.js");

const STUDY_ID = "SFCDFT-STUDY3";
const P1 = L.P1, P2 = L.P2, RF1 = L.RF1, RF2 = L.RF2;
function need(x,m){if(!x)throw new Error(m);}function clone(x){return JSON.parse(JSON.stringify(x));}
function hash(x){return crypto.createHash("sha256").update(String(x),"utf8").digest("hex");}
function canonical(x){return L.stable(x);}
function policyForSeed(seed){need(Number.isInteger(seed),"assignment seed must be integer");return seed%2===1?P1:P2;}
function familyForSeed(stageId,seed){need(typeof stageId==='string'&&stageId,'stageId required');need(Number.isInteger(seed),'assignment seed must be integer');const byte=parseInt(hash(`${stageId}|RF|${seed}`).slice(0,2),16);return byte%2===0?RF1:RF2;}
function domainId(policyId,familyId){if(policyId===P1&&familyId===RF1)return'SFCDFT3-D1-P1-RF1';if(policyId===P1&&familyId===RF2)return'SFCDFT3-D2-P1-RF2';if(policyId===P2&&familyId===RF1)return'SFCDFT3-D3-P2-RF1';if(policyId===P2&&familyId===RF2)return'SFCDFT3-D4-P2-RF2';throw new Error('unknown domain');}
function prefix(moveKeys,complete){need(Array.isArray(moveKeys),'moveKeys required');if(moveKeys.length<16){need(!complete,'complete candidate requires first16');return{openingPrefixAvailable:false,openingPrefixLength:moveKeys.length,openingPrefixSha256:null};}return{openingPrefixAvailable:true,openingPrefixLength:16,openingPrefixSha256:hash(moveKeys.slice(0,16).join('\n'))};}
function anchorsFor(familyId){return{familyId,namua:null,mtaji:null,complete:false};}
function update(a,row){if(row.terminal)return;if(a.familyId===RF1){if(!a.namua&&row.ply===20&&row.phase==='namua')a.namua=clone(row);if(!a.mtaji&&row.ply>=40&&row.phase==='mtaji')a.mtaji=clone(row);}else if(a.familyId===RF2){if(!a.namua&&row.ply===28&&row.phase==='namua')a.namua=clone(row);if(!a.mtaji&&row.ply===52&&row.phase==='mtaji')a.mtaji=clone(row);}else throw new Error('unknown root family');a.complete=Boolean(a.namua&&a.mtaji);}
function replay(E,stageId,assignmentSeed,effectiveSeed,maxPly=240){
 need(Number.isInteger(assignmentSeed)&&Number.isInteger(effectiveSeed),'assignment/effective seed required');need(Number.isInteger(maxPly)&&maxPly>0,'maxPly invalid');
 const policyId=policyForSeed(assignmentSeed),familyId=familyForSeed(stageId,assignmentSeed),rng=L.rng(effectiveSeed),a=anchorsFor(familyId),rows=[],moveKeys=[];let state=E.initialState(),stopReason=null,engineGuard=null;
 for(let ply=1;ply<=maxPly&&state.winner===null;ply++){
  const chosen=L.chooseMove(E,state,policyId,rng());moveKeys.push(chosen.moveKey);const applied=E.applyMove(state,clone(chosen.move),{snapshots:false});need(applied&&applied.state,'applyMove state missing');state=applied.state;
  if(state.reason==='relay-limit'){stopReason='ENGINE-GUARD';engineGuard={kind:'relay-limit',ply};break;}
  const terminal=state.winner!==null,row={ply,phase:state.phase,terminal,rootLegalWidth:terminal?0:E.moveVariants(state).length,rawStateSha256:L.stateKey(state),state:clone(state)};rows.push(row);update(a,row);
  if(a.complete){stopReason='PAIR-COMPLETE';break;}if(terminal){stopReason='NATURAL-TERMINAL';break;}
 }
 if(stopReason===null)stopReason='MAX-SOURCE-PLY';const complete=a.complete,p=prefix(moveKeys,complete),candidateStatus=complete?'CANDIDATE-PAIR-COMPLETE':stopReason==='ENGINE-GUARD'?'NO-CANDIDATE-ENGINE-GUARD-CENSORING':'NO-CANDIDATE-ROOT-SHORTAGE';
 if(complete){need(stopReason==='PAIR-COMPLETE','complete pair stop mismatch');need(moveKeys.length===Math.max(a.namua.ply,a.mtaji.ply),'post-candidate continuation detected');need(p.openingPrefixAvailable&&p.openingPrefixLength===16&&typeof p.openingPrefixSha256==='string','candidate prefix invalid');}
 return{studyId:STUDY_ID,stageId,assignmentSeed,effectiveSeed,policyId,familyId,domainId:domainId(policyId,familyId),candidateStatus,pairComplete:Boolean(complete),stopReason,engineGuard,scientificTerminal:stopReason==='NATURAL-TERMINAL',engineWinnerPresentAtStop:state.winner!==null,postCandidateContinuationCount:0,sourceTrajectorySha256:hash(moveKeys.join('\n')),...p,moveCount:moveKeys.length,anchors:clone(a),replay:{moveKeys:clone(moveKeys),rows:clone(rows),stopReason,engineGuard:clone(engineGuard)}};
}
module.exports={STUDY_ID,P1,P2,RF1,RF2,canonical,policyForSeed,familyForSeed,domainId,replay,stateKey:L.stateKey,moveKey:L.moveKey};
