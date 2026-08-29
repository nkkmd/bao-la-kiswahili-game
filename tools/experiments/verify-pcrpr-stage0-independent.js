#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");

const STUDY_ID = "PCRPR-STUDY1";
const STAGE_ID = "PCRPR-S0-TECHNICAL-2026-08-29-v1";
const SCHEMA_ID = "PCRPR_FEATURES_STAGE0_V1";
const SEARCH_ID = "pcrpr-exact-full-window/bao/q0/v1";
const WIN = 1000000;
const familiesInOrder = [
  "REPLY_SET_WIDTH","DEFENSE_MAINTAINING_REPLY_FRACTION","REPLY_QUALITY_DISTRIBUTION","PUNISHMENT_CONCENTRATION",
  "BEST_REPLY_GAP_VECTOR","FORCING_REPLY_STRUCTURE","REPLY_BRANCH_ASYMMETRY","REPLY_SEARCH_STABILITY",
  "OPPONENT_POLICY_SENSITIVITY","ROOT_MOVE_REFERENCE_CONTEXT","LOCAL_TACTICAL_GEOMETRY_RESERVE_HOUSE_PHASE","LOCAL_TEMPORAL_CONTEXT",
];
const featureNames = {
  REPLY_SET_WIDTH:["legalReplyCount","log1pLegalReplyCount","replyCaptureCount","replyPassCount","replyTakataCount"],
  DEFENSE_MAINTAINING_REPLY_FRACTION:["d1TopSetCount","d1TopSetFraction","d2TopSetCount","d2TopSetFraction"],
  REPLY_QUALITY_DISTRIBUTION:["d2GapMax","d2GapMean","d2GapMin","d2GapQ25","d2GapQ50","d2GapQ75","d2GapStd","distinctD2ScoreCount"],
  PUNISHMENT_CONCENTRATION:["positiveGapCount","positiveGapFraction","positiveGapHhi","positiveGapTop1Share","positiveGapTop2Share","positiveGapTotal"],
  BEST_REPLY_GAP_VECTOR:["d1BestToSecondGap","d2BestToMedianGap","d2BestToSecondGap","d2BestToWorstGap"],
  FORCING_REPLY_STRUCTURE:["allRepliesCapture","anyReplyCapture","d2TopSetCount","immediateTerminalAfterRootMove","uniqueD2BestReply","uniqueLegalReply"],
  REPLY_BRANCH_ASYMMETRY:["forcedRootActorReplyFraction","replySuccessorLegalCountMax","replySuccessorLegalCountMean","replySuccessorLegalCountMin","replySuccessorLegalCountRange","replySuccessorLegalCountStd","terminalReplySuccessorFraction"],
  REPLY_SEARCH_STABILITY:["d1D2CanonicalBestMatch","d1D2MeanAbsoluteRankDifference","d1D2TopSetIntersectionCount","d1D2TopSetJaccard"],
  OPPONENT_POLICY_SENSITIVITY:["expectedGapMedium","expectedGapPolicySpan","expectedGapStrong","expectedGapWeak","mediumMinusStrongExpectedGap","tvMediumWeak","tvStrongMedium","tvStrongWeak","weakMinusStrongExpectedGap"],
  ROOT_MOVE_REFERENCE_CONTEXT:["rootD2BestToSecondGap","rootLegalMoveCount","rootMoveInD2TopSet","rootMoveScoreMinusBest","rootMoveTieAwareRank"],
  LOCAL_TACTICAL_GEOMETRY_RESERVE_HOUSE_PHASE:["actorHouse","actorReserve","opponentHouse","opponentReserve","phaseMtaji","phaseNamua","reserveDiffActorMinusOpponent","rootMoveCapturedSeeds","rootMoveIsCapture","rootMoveTerminal","successorActorFrontOccupied","successorActorReusablePits","successorOpponentFrontOccupied","successorOpponentReusablePits"],
  LOCAL_TEMPORAL_CONTEXT:["historyLength","immediatelyPriorCapture","priorCaptureCount","priorDirectionLeftCount","priorDirectionRightCount","priorPassCount","priorPhaseChangeCount","priorTakataCount"],
};
const moveFields=["type","phase","row","index","direction","side","houseChoice","houseTwo"];
const rawFields=["pits","reserve","houseOwned","player","phase","winner","pending"];
const allowedState=new Set([...rawFields,"turn","reason"]);

function failUnless(ok,msg){ if(!ok) throw new Error(msg); }
function cmp(a,b){ return a<b?-1:a>b?1:0; }
function copy(x){ return JSON.parse(JSON.stringify(x)); }
function digest(text){ const h=crypto.createHash("sha256"); h.update(Buffer.from(String(text),"utf8")); return h.digest("hex"); }
function canonical(x){
  if(x===null||typeof x!=="object") return JSON.stringify(x);
  if(Array.isArray(x)) return `[${x.map(canonical).join(",")}]`;
  const ks=Object.keys(x).sort(cmp); let s="{";
  for(let i=0;i<ks.length;i+=1){ if(i)s+=","; const k=ks[i]; s+=`${JSON.stringify(k)}:${canonical(x[k])}`; }
  return `${s}}`;
}
function valueHash(x){ return digest(canonical(x)); }
function checkState(s, nonterminal=false){
  failUnless(s&&typeof s==="object"&&!Array.isArray(s),"state object required");
  for(const k of Object.keys(s)) failUnless(allowedState.has(k),`state unexpected field ${k}`);
  for(const k of rawFields) failUnless(Object.prototype.hasOwnProperty.call(s,k),`raw identity field missing: ${k}`);
  failUnless(Array.isArray(s.pits)&&s.pits.length===2,"bad pits");
  let total=0;
  for(const rows of s.pits){ failUnless(Array.isArray(rows)&&rows.length===2,"bad rows"); for(const row of rows){ failUnless(Array.isArray(row)&&row.length===8,"bad row"); for(const n of row){ failUnless(Number.isInteger(n)&&n>=0,"bad pit"); total+=n; } } }
  failUnless(Array.isArray(s.reserve)&&s.reserve.length===2&&s.reserve.every((n)=>Number.isInteger(n)&&n>=0),"bad reserve");
  failUnless(Array.isArray(s.pending)&&s.pending.length===2&&s.pending.every((n)=>Number.isInteger(n)&&n>=0),"bad pending");
  failUnless(Array.isArray(s.houseOwned)&&s.houseOwned.length===2&&s.houseOwned.every((v)=>typeof v==="boolean"),"bad houseOwned");
  failUnless(s.player===0||s.player===1,"bad player"); failUnless(s.phase==="namua"||s.phase==="mtaji","bad phase");
  failUnless(s.winner===null||s.winner===0||s.winner===1,"bad winner");
  total+=s.reserve[0]+s.reserve[1]+s.pending[0]+s.pending[1]; failUnless(total===64,`seed conservation failed: ${total}`);
  if(nonterminal) failUnless(s.winner===null,"expected nonterminal");
}
function project(s){ checkState(s); return {pits:s.pits.map((rs)=>rs.map((r)=>r.slice())),reserve:[s.reserve[0],s.reserve[1]],houseOwned:[s.houseOwned[0],s.houseOwned[1]],player:s.player,phase:s.phase,winner:s.winner,pending:[s.pending[0],s.pending[1]]}; }
function stateKey(s){ return digest(canonical(project(s))); }
function normalize(m){ const out={}; for(const f of moveFields){ if(f==="houseTwo") out.houseTwo=m.houseTwo===true; else if(m[f]!==undefined) out[f]=m[f]; } return out; }
function keyOfMove(m){ const n=normalize(m); return moveFields.map((f)=>f==="houseTwo"?(n.houseTwo?"true":"false"):(n[f]===undefined||n[f]===null?"":String(n[f]))).join(":"); }
function legal(s){ checkState(s,true); return E.moveVariants(s).map(normalize).sort((a,b)=>cmp(keyOfMove(a),keyOfMove(b))); }
function findMove(s,m){ const k=keyOfMove(m), hit=legal(s).find((x)=>keyOfMove(x)===k); failUnless(hit,`independent exact move absent ${k}`); return hit; }
function play(s,m){ const chosen=findMove(s,m); const a=E.applyMove(s,chosen); checkState(a.state); return {move:chosen,state:a.state,events:a.events||[]}; }
function terminal(s,actor,ply){ return s.winner===null?null:(s.winner===actor?WIN-ply:-WIN+ply); }
function value(s,depth,actor,ply){ checkState(s); const t=terminal(s,actor,ply); if(t!==null)return t; if(depth===0)return AI.evaluateWithProfile(s,actor,"bao"); const ms=legal(s); failUnless(ms.length,"no moves"); const max=s.player===actor; let best=max?-Infinity:Infinity; for(const m of ms){ const v=value(play(s,m).state,depth-1,actor,ply+1); best=max?Math.max(best,v):Math.min(best,v); } return best; }
function table(s,depth){ checkState(s,true); const actor=s.player; const rs=legal(s).map((m)=>({moveKey:keyOfMove(m),score:value(play(s,m).state,depth-1,actor,1)})).sort((a,b)=>b.score-a.score||cmp(a.moveKey,b.moveKey)); const best=rs[0].score; const tops=rs.filter((r)=>r.score===best).map((r)=>r.moveKey).sort(cmp); return {searchId:SEARCH_ID,depth,actor,rawStateKey:stateKey(s),bestScore:best,topSetMoveKeys:tops,canonicalBestMoveKey:tops[0],rows:rs.map((r,i)=>({moveKey:r.moveKey,score:r.score,ordinal:i+1,rank:1+rs.filter((x)=>x.score>r.score).length}))}; }
function add(xs){ let z=0; for(const x of xs){ failUnless(Number.isFinite(x),"nonfinite"); z+=x; } return z; }
function avg(xs){ return xs.length?add(xs)/xs.length:0; }
function sd(xs){ if(!xs.length)return 0; const m=avg(xs); return Math.sqrt(add(xs.map((x)=>(x-m)**2))/xs.length); }
function q(xs,p){ if(!xs.length)return 0; const a=xs.slice().sort((x,y)=>x-y),h=(a.length-1)*p,l=Math.floor(h),u=Math.ceil(h); return l===u?a[l]:a[l]+(a[u]-a[l])*(h-l); }
function ranking(rows,field){ const a=rows.slice().sort((x,y)=>y[field]-x[field]||cmp(x.key,y.key)); const ranks=new Map(); for(const r of a) ranks.set(r.key,1+a.filter((x)=>x[field]>r[field]).length); return {a,ranks}; }
function policies(rows){ if(!rows.length)return {s:new Map(),m:new Map(),w:new Map()}; const r1=ranking(rows,"d1").a,r2=ranking(rows,"d2").a,b=r2[0].d2; const ks=r2.filter((r)=>r.d2===b).map((r)=>r.key),km=r1.slice(0,Math.min(3,r1.length)).map((r)=>r.key),kw=rows.map((r)=>r.key); const mk=(a)=>new Map(a.map((k)=>[k,1/a.length])); return {s:mk(ks),m:mk(km),w:mk(kw)}; }
function tv(a,b,keys){ return .5*add(keys.map((k)=>Math.abs((a.get(k)||0)-(b.get(k)||0)))); }
function numericProfile(source){
  const rows=source.map((r)=>({key:String(r.key),d1:Number(r.d1),d2:Number(r.d2)})).sort((a,b)=>cmp(a.key,b.key)); for(const r of rows)failUnless(Number.isFinite(r.d1)&&Number.isFinite(r.d2),"nonfinite scores");
  if(!rows.length)return {defense:{d1TopSetCount:0,d1TopSetFraction:0,d2TopSetCount:0,d2TopSetFraction:0},quality:{d2GapMax:0,d2GapMean:0,d2GapMin:0,d2GapQ25:0,d2GapQ50:0,d2GapQ75:0,d2GapStd:0,distinctD2ScoreCount:0},punishment:{positiveGapCount:0,positiveGapFraction:0,positiveGapHhi:0,positiveGapTop1Share:0,positiveGapTop2Share:0,positiveGapTotal:0},gaps:{d1BestToSecondGap:0,d2BestToMedianGap:0,d2BestToSecondGap:0,d2BestToWorstGap:0},stability:{d1D2CanonicalBestMatch:0,d1D2MeanAbsoluteRankDifference:0,d1D2TopSetIntersectionCount:0,d1D2TopSetJaccard:0},policy:{expectedGapMedium:0,expectedGapPolicySpan:0,expectedGapStrong:0,expectedGapWeak:0,mediumMinusStrongExpectedGap:0,tvMediumWeak:0,tvStrongMedium:0,tvStrongWeak:0,weakMinusStrongExpectedGap:0}};
  const r1=ranking(rows,"d1"),r2=ranking(rows,"d2"),b1=r1.a[0].d1,b2=r2.a[0].d2,t1=r1.a.filter((r)=>r.d1===b1).map((r)=>r.key),t2=r2.a.filter((r)=>r.d2===b2).map((r)=>r.key);
  const gap=new Map(rows.map((r)=>[r.key,b2-r.d2])),gl=rows.map((r)=>gap.get(r.key)),pos=gl.filter((x)=>x>0),sum=add(pos),desc=pos.slice().sort((a,b)=>b-a);
  const set2=new Set(t2),inter=t1.filter((k)=>set2.has(k)).length,union=new Set([...t1,...t2]).size;
  const rankDiff=avg(rows.map((r)=>Math.abs(r1.ranks.get(r.key)-r2.ranks.get(r.key)))),ps=policies(rows),exp=(p)=>add(rows.map((r)=>(p.get(r.key)||0)*gap.get(r.key))),es=exp(ps.s),em=exp(ps.m),ew=exp(ps.w),keys=rows.map((r)=>r.key);
  return {defense:{d1TopSetCount:t1.length,d1TopSetFraction:t1.length/rows.length,d2TopSetCount:t2.length,d2TopSetFraction:t2.length/rows.length},quality:{d2GapMax:Math.max(...gl),d2GapMean:avg(gl),d2GapMin:Math.min(...gl),d2GapQ25:q(gl,.25),d2GapQ50:q(gl,.5),d2GapQ75:q(gl,.75),d2GapStd:sd(gl),distinctD2ScoreCount:new Set(rows.map((r)=>r.d2)).size},punishment:{positiveGapCount:pos.length,positiveGapFraction:pos.length/rows.length,positiveGapHhi:sum?add(pos.map((x)=>x*x))/(sum*sum):0,positiveGapTop1Share:sum?desc[0]/sum:0,positiveGapTop2Share:sum?add(desc.slice(0,2))/sum:0,positiveGapTotal:sum},gaps:{d1BestToSecondGap:r1.a.length>=2?b1-r1.a[1].d1:0,d2BestToMedianGap:b2-q(rows.map((r)=>r.d2),.5),d2BestToSecondGap:r2.a.length>=2?b2-r2.a[1].d2:0,d2BestToWorstGap:b2-r2.a[r2.a.length-1].d2},stability:{d1D2CanonicalBestMatch:Number(t1.slice().sort(cmp)[0]===t2.slice().sort(cmp)[0]),d1D2MeanAbsoluteRankDifference:rankDiff,d1D2TopSetIntersectionCount:inter,d1D2TopSetJaccard:union?inter/union:0},policy:{expectedGapMedium:em,expectedGapPolicySpan:Math.max(es,em,ew)-Math.min(es,em,ew),expectedGapStrong:es,expectedGapWeak:ew,mediumMinusStrongExpectedGap:em-es,tvMediumWeak:tv(ps.m,ps.w,keys),tvStrongMedium:tv(ps.s,ps.m,keys),tvStrongWeak:tv(ps.s,ps.w,keys),weakMinusStrongExpectedGap:ew-es}};
}
function captured(events){ let n=0; for(const e of events)if(e.kind==="capture")n+=e.count||0; return n; }
function occupied(s,p){ return s.pits[p][E.FRONT].filter((n)=>n>0).length; }
function reusable(s,p){ return s.pits[p].flat().filter((n)=>n>=2).length; }
function rootFeatures(root,mk){ const t=table(root,2),r=t.rows.find((x)=>x.moveKey===mk); failUnless(r,"root move missing"); return {rootD2BestToSecondGap:t.rows.length>=2?t.bestScore-t.rows[1].score:0,rootLegalMoveCount:t.rows.length,rootMoveInD2TopSet:Number(r.score===t.bestScore),rootMoveScoreMinusBest:r.score-t.bestScore,rootMoveTieAwareRank:r.rank}; }
function historyFeatures(history,root){ failUnless(Array.isArray(history)&&history.length<=4,"history bad"); if(history.length)failUnless(stateKey(history[history.length-1].after)===stateKey(root),"history end mismatch"); let cap=0,tak=0,pas=0,left=0,right=0,pc=0; for(const h of history){ checkState(h.before,true);checkState(h.after);const m=normalize(h.move); if(m.type==="capture")cap++;if(m.type==="takata")tak++;if(m.type==="pass")pas++;if(m.direction==="left")left++;if(m.direction==="right")right++;if(h.before.phase!==h.after.phase)pc++; } const last=history.length?normalize(history[history.length-1].move):null; return {historyLength:history.length,immediatelyPriorCapture:Number(last?.type==="capture"),priorCaptureCount:cap,priorDirectionLeftCount:left,priorDirectionRightCount:right,priorPassCount:pas,priorPhaseChangeCount:pc,priorTakataCount:tak}; }
function floatHex(v){ failUnless(Number.isFinite(v),"finite scalar required");const b=Buffer.alloc(8);b.writeDoubleBE(v,0);return b.toString("hex"); }
function vector(fams){ const rows=[]; for(const f of familiesInOrder){ assert.deepEqual(Object.keys(fams[f]).sort(cmp),featureNames[f].slice().sort(cmp)); for(const n of featureNames[f].slice().sort(cmp)){ const v=fams[f][n];failUnless(Number.isFinite(v),`nonfinite ${f}.${n}`);rows.push({family:f,name:n,value:v,encoding:`f64be:${floatHex(v)}`}); } } const text=`${SCHEMA_ID}\n${rows.map((r)=>`${r.family}\t${r.name}\t${r.encoding}\n`).join("")}`; return {schemaId:SCHEMA_ID,scalarCount:rows.length,rows,vectorSha256:digest(text)}; }
function recompute(input){
  const allowed=new Set(["root","rootMove","history","searchConfigId"]); for(const k of Object.keys(input))failUnless(allowed.has(k),`representation input forbidden/unexpected field: ${k}`); failUnless(input.searchConfigId===SEARCH_ID,`search config drift: ${input.searchConfigId}`); checkState(input.root,true);
  const root=copy(input.root),hist=copy(input.history||[]),rm=findMove(root,input.rootMove),rmk=keyOfMove(rm),first=play(root,rm),actor=root.player,opp=1-actor,term=first.state.winner!==null;
  let rms=[],rr=[],branches=[],terminalReplies=0;
  if(!term){ rms=legal(first.state); const t1=table(first.state,1),t2=table(first.state,2),m1=new Map(t1.rows.map((r)=>[r.moveKey,r.score])),m2=new Map(t2.rows.map((r)=>[r.moveKey,r.score])); rr=rms.map((r)=>({key:keyOfMove(r),d1:m1.get(keyOfMove(r)),d2:m2.get(keyOfMove(r))})); for(const r of rms){ const s=play(first.state,r).state;if(s.winner!==null){terminalReplies++;branches.push(0);}else branches.push(legal(s).length); } }
  const num=numericProfile(rr),capCount=rms.filter((m)=>m.type==="capture").length,takCount=rms.filter((m)=>m.type==="takata").length,passCount=rms.filter((m)=>m.type==="pass").length;
  const fams={REPLY_SET_WIDTH:{legalReplyCount:rms.length,log1pLegalReplyCount:Math.log1p(rms.length),replyCaptureCount:capCount,replyPassCount:passCount,replyTakataCount:takCount},DEFENSE_MAINTAINING_REPLY_FRACTION:num.defense,REPLY_QUALITY_DISTRIBUTION:num.quality,PUNISHMENT_CONCENTRATION:num.punishment,BEST_REPLY_GAP_VECTOR:num.gaps,FORCING_REPLY_STRUCTURE:{allRepliesCapture:Number(rms.length>0&&rms.every((m)=>m.type==="capture")),anyReplyCapture:Number(capCount>0),d2TopSetCount:num.defense.d2TopSetCount,immediateTerminalAfterRootMove:Number(term),uniqueD2BestReply:Number(num.defense.d2TopSetCount===1&&rms.length>0),uniqueLegalReply:Number(rms.length===1)},REPLY_BRANCH_ASYMMETRY:{forcedRootActorReplyFraction:branches.length?branches.filter((n)=>n===1).length/branches.length:0,replySuccessorLegalCountMax:branches.length?Math.max(...branches):0,replySuccessorLegalCountMean:avg(branches),replySuccessorLegalCountMin:branches.length?Math.min(...branches):0,replySuccessorLegalCountRange:branches.length?Math.max(...branches)-Math.min(...branches):0,replySuccessorLegalCountStd:sd(branches),terminalReplySuccessorFraction:rms.length?terminalReplies/rms.length:0},REPLY_SEARCH_STABILITY:num.stability,OPPONENT_POLICY_SENSITIVITY:num.policy,ROOT_MOVE_REFERENCE_CONTEXT:rootFeatures(root,rmk),LOCAL_TACTICAL_GEOMETRY_RESERVE_HOUSE_PHASE:{actorHouse:Number(root.houseOwned[actor]),actorReserve:root.reserve[actor],opponentHouse:Number(root.houseOwned[opp]),opponentReserve:root.reserve[opp],phaseMtaji:Number(root.phase==="mtaji"),phaseNamua:Number(root.phase==="namua"),reserveDiffActorMinusOpponent:root.reserve[actor]-root.reserve[opp],rootMoveCapturedSeeds:captured(first.events),rootMoveIsCapture:Number(rm.type==="capture"),rootMoveTerminal:Number(term),successorActorFrontOccupied:occupied(first.state,actor),successorActorReusablePits:reusable(first.state,actor),successorOpponentFrontOccupied:occupied(first.state,opp),successorOpponentReusablePits:reusable(first.state,opp)},LOCAL_TEMPORAL_CONTEXT:historyFeatures(hist,root)};
  return {studyId:STUDY_ID,stageId:STAGE_ID,schemaId:SCHEMA_ID,searchId:SEARCH_ID,rootRawStateKey:stateKey(root),rootMoveKey:rmk,successorRawStateKey:stateKey(first.state),terminalAfterRootMove:term,replyMoveKeys:rms.map(keyOfMove),families:fams,vector:vector(fams)};
}
function thrown(fn,re){try{fn();return false;}catch(e){return re?re.test(String(e.message)):true;}}
function args(argv){const out={input:null,output:null};for(let i=0;i<argv.length;i++){if(argv[i]==="--input")out.input=path.resolve(argv[++i]);else if(argv[i]==="--output")out.output=path.resolve(argv[++i]);else throw new Error(`unknown arg ${argv[i]}`);}if(!out.input)throw new Error("--input required");out.output||=path.join(path.dirname(out.input),"independent-verification.json");return out;}
function main(){
  const a=args(process.argv.slice(2)),artifact=JSON.parse(fs.readFileSync(a.input,"utf8")); assert.equal(artifact.studyId,STUDY_ID);assert.equal(artifact.stageId,STAGE_ID);assert.equal(artifact.scientificInferenceAuthorized,false);assert.equal(artifact.scientificSeedBlocksConsumed,false);
  const gates={};let rows=0;
  gates.rawIdentity=true;gates.exactMoveSets=true;gates.searchTables=true;gates.allFeatureVectorsExact=true;gates.vectorHashesExact=true;
  for(const row of artifact.rows){ checkState(row.input.root,true);assert.equal(stateKey(row.input.root),row.representation.rootRawStateKey);const keys=legal(row.input.root).map(keyOfMove);assert.ok(keys.includes(row.representation.rootMoveKey));const r=recompute(row.input);assert.deepEqual(r,row.representation);rows++; }
  const src=fs.readFileSync(__filename,"utf8"),requires=src.split("\n").filter((line)=>line.includes("require("));const forbidden=[["pcrpr","stage0","production"].join("-"),["rcpr","production"].join("-"),["rcpr","independent"].join("-"),["practical","comeback","stage0","production"].join("-")];gates.independence=forbidden.every((token)=>requires.every((line)=>!line.includes(token)));
  const synth=artifact.syntheticControls.input,p0=numericProfile(synth),p1=numericProfile(synth.slice().reverse());assert.deepEqual(p0,artifact.syntheticControls.canonicalProfile);assert.deepEqual(p1,p0);assert.deepEqual(numericProfile([{key:"2",d1:5,d2:7},{key:"10",d1:5,d2:7},{key:"1",d1:1,d2:2}]),artifact.syntheticControls.tiedProfile);assert.deepEqual(numericProfile([]),artifact.syntheticControls.zeroReplyProfile);assert.deepEqual(numericProfile([{key:"7",d1:4,d2:9}]),artifact.syntheticControls.oneReplyProfile);gates.syntheticNumericControlsExact=true;
  const initial=E.initialState(),missing=copy(initial);delete missing.pending;const bad=copy(initial);bad.reserve[0]++;const sample=artifact.rows[0];gates.negativeControlsDetected=thrown(()=>checkState(missing),/pending/)&&thrown(()=>checkState(bad),/seed conservation/)&&thrown(()=>recompute({...copy(sample.input),futureWinner:0}),/forbidden\/unexpected field/)&&thrown(()=>recompute({...copy(sample.input),searchConfigId:"drift"}),/search config drift/);
  const core={...artifact};delete core.productionCoreSha256;gates.productionArtifactHashBinding=valueHash(core)===artifact.productionCoreSha256;
  const passed=Object.values(gates).every(Boolean);const result={schemaVersion:1,studyId:STUDY_ID,stageId:STAGE_ID,scientificInferenceAuthorized:false,scientificSeedBlocksConsumed:false,decision:passed?"TECHNICAL-PASS":"STAGE0-TECHNICAL-FAILED",passed,gates,verified:{rows,scalarCount:artifact.rows[0]?.representation.vector.scalarCount||0},productionCoreSha256:artifact.productionCoreSha256};
  fs.writeFileSync(a.output,`${JSON.stringify(result,null,2)}\n`);process.stdout.write(`${JSON.stringify(result,null,2)}\n`);if(!passed)process.exitCode=1;
}
try{main();}catch(e){console.error(e.stack||e.message);process.exitCode=1;}
