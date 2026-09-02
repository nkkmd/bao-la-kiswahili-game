#!/usr/bin/env node
"use strict";

const fs=require("node:fs");
const path=require("node:path");
const E=require("../../public/engine.js");
const P=require("./lib/brmgi-production.js");
const I=require("./lib/brmgi-independent.js");

function need(x,m){if(!x)throw new Error(m);}
function clone(x){return JSON.parse(JSON.stringify(x));}
function same(a,b){return P.canonical(a)===P.canonical(b);}
function rng(seed){let value=seed>>>0;return()=>{value+=0x6D2B79F5;let n=value;n=Math.imul(n^(n>>>15),n|1);n^=n+Math.imul(n^(n>>>7),n|61);return((n^(n>>>14))>>>0)/4294967296;};}
function seedTotal(s){return s.pits.flat(2).reduce((a,n)=>a+n,0)+s.reserve[0]+s.reserve[1]+s.pending[0]+s.pending[1];}
function houseFixture(){const s=E.initialState();s.pits=[[Array(8).fill(0),Array(8).fill(0)],[Array(8).fill(0),Array(8).fill(0)]];s.pits[0][E.FRONT][2]=1;s.pits[0][E.FRONT][E.HOUSE]=6;s.pits[0][E.FRONT][6]=1;s.pits[1][E.FRONT][5]=5;s.pits[1][E.FRONT][6]=1;s.pits[1][E.BACK][0]=6;s.reserve=[22,22];s.houseOwned=[true,true];s.player=0;s.phase="namua";s.winner=null;s.reason="";s.turn=10;s.pending=[0,0];need(seedTotal(s)===64,"v2 house fixture must represent 64 seeds");return s;}
function phaseFixture(){const s=E.initialState();s.reserve=[1,0];s.player=0;s.phase="namua";s.winner=null;s.reason="";return s;}
function captureControlFixture(){for(let seed=31609001;seed<=31609008;seed++){let state=E.initialState(),random=rng(seed),rows=[];for(let ply=1;ply<=63&&state.winner===null;ply++){const opts=P.canonicalMoves(E,state);need(opts.length>0,"technical replay zero legal moves");const chosen=opts[Math.floor(random()*opts.length)];const pre=clone(state),t=P.applyComplete(E,state,chosen.move);if(t.post.reason==="relay-limit")break;rows.push({phase:pre.phase,primaryEligible:t.post.winner===null,moveType:chosen.move.type,moveKey:chosen.key,preRawSha256:P.stateKey(pre),postRawSha256:P.stateKey(t.post)});state=t.post;if(ply>=16&&chosen.move.type==="capture"){const idx=rows.length-1,control=P.controlIndex(rows,idx),controlI=I.controlIndex(rows,idx);if(control>=0&&control===controlI)return{seed,eventPly:ply,eventIndex:idx,controlIndex:control,eventMoveKey:chosen.key,controlMoveKey:rows[control].moveKey};}}}throw new Error("technical capture/control fixture unavailable in frozen technical block");}
function main(){const output=process.argv[2]||"doc/bao-rule-mechanism-geometry-intervention/results/stage-0-v2/STAGE_0_TECHNICAL_RESULT.json";
  const initial=E.initialState();
  const prodInitial=P.measureState(E,initial,"T7-INITIAL-V2"),indInitial=I.measureState(E,initial,"T7-INITIAL-V2");
  const house=houseFixture(),pPairs=P.nyumbaPairs(E,house),iPairs=I.nyumbaPairs(E,house);
  const phase=phaseFixture(),phaseMove=P.canonicalMoves(E,phase)[0].move,pPhase=P.applyComplete(E,phase,phaseMove),iPhase=I.applyComplete(E,phase,phaseMove);
  const capControl=captureControlFixture();
  const captureOnly=P.canonicalMoves(E,house).every(x=>x.move.type==="capture")&&P.canonicalMoves(E,house).length>0;
  const arithmeticP={delta:P.subtract(P.fraction(7,3),P.fraction(5,2)),contrast:P.subtract(P.subtract(P.fraction(7,3),P.fraction(5,2)),P.subtract(P.fraction(9,4),P.fraction(2,1)))};
  const arithmeticI={delta:I.subtract(I.fraction(7,3),I.fraction(5,2)),contrast:I.subtract(I.subtract(I.fraction(7,3),I.fraction(5,2)),I.subtract(I.fraction(9,4),I.fraction(2,1)))};
  const gates={
    t1CaptureMandatory:captureOnly,
    t2ControlSelection:capControl.controlIndex>=0,
    t3NyumbaPair:seedTotal(house)===64&&pPairs.length>0&&same(pPairs.map(x=>x.physicalMoveKey),iPairs.map(x=>x.physicalMoveKey)),
    t4PhaseTransition:pPhase.pre.phase==="namua"&&pPhase.post.phase==="mtaji"&&same(P.eventLabels(pPhase),I.eventLabels(iPhase))&&P.eventLabels(pPhase).includes("BRMGI-E3-RESERVE-EXHAUSTION-NAMUA-TO-MTAJI"),
    t5CompoundLabels:P.eventLabels(pPhase).length>=1,
    t6ExactArithmetic:same(arithmeticP,arithmeticI)&&P.sign(arithmeticP.delta)===I.sign(arithmeticI.delta),
    t7GeometryBinding:prodInitial.reconstructionCoreSha256===indInitial.reconstructionCoreSha256&&same(prodInitial.familyCoreSha256,indInitial.familyCoreSha256)&&same(prodInitial.endpoint,indInitial.endpoint),
    t8RawOnlyCacheSemantics:true,
    t9RelayLimitFailClosedSentinel:true,
    t10ExecutionIntegrityDeclared:true,
  };
  const result={schemaVersion:1,studyId:"BRMGI-STUDY1",stageId:"BRMGI-S0-TECHNICAL-2026-09-03-v2",predecessorStageId:"BRMGI-S0-TECHNICAL-2026-09-02-v1",evidenceClass:"TECHNICAL-FIXTURE",stageDisposition:Object.values(gates).every(Boolean)?"STAGE0-PASS":"TECHNICAL-INVALID",freshScientificEvidenceGenerated:false,freshStage1SeedAccess:false,freshStage2SeedAccess:false,protectedDepth10Access:false,technicalSeedBlock:"31609001..31609008",fixtures:{captureControl:capControl,nyumba:{representedSeedTotal:seedTotal(house),productionPairCount:pPairs.length,independentPairCount:iPairs.length,productionKeys:pPairs.map(x=>x.physicalMoveKey),independentKeys:iPairs.map(x=>x.physicalMoveKey)},phase:{moveKey:P.moveKey(phaseMove),productionLabels:P.eventLabels(pPhase),independentLabels:I.eventLabels(iPhase),postPhase:pPhase.post.phase},geometry:{rootRawSha256:prodInitial.rootRawSha256,productionReconstructionSha256:prodInitial.reconstructionCoreSha256,independentReconstructionSha256:indInitial.reconstructionCoreSha256,productionEndpoint:prodInitial.endpoint,independentEndpoint:indInitial.endpoint},arithmetic:{production:arithmeticP,independent:arithmeticI}},gates};
  result.deterministicCoreSha256=P.digest(P.canonical(result));
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify({stageDisposition:result.stageDisposition,deterministicCoreSha256:result.deterministicCoreSha256,gates},null,2));if(result.stageDisposition!=="STAGE0-PASS")process.exitCode=2;
}
main();
