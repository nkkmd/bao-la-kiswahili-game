#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const E = require("../../public/engine.js");
const P = require("./lib/silgm-production.js");
const I = require("./lib/silgm-independent.js");

const STUDY = "SILGM-STUDY1";
const STAGE = "SILGM-S0-TECHNICAL-2026-09-03-v1";
const SPEC = path.resolve(__dirname, "../../doc/search-instability-local-geometry-mechanism/prereg/STAGE_0_TECHNICAL_SPEC.json");
const STUDY_SPEC = path.resolve(__dirname, "../../doc/search-instability-local-geometry-mechanism/prereg/STUDY_1_SPEC.json");
const DEFAULT_OUT = path.resolve(__dirname, "../../doc/search-instability-local-geometry-mechanism/results/stage-0/STAGE_0_TECHNICAL_RESULT.json");

function need(x,m){if(!x)throw new Error(m);}
function shaText(x){return crypto.createHash("sha256").update(x,"utf8").digest("hex");}
function readJson(file){return JSON.parse(fs.readFileSync(file,"utf8"));}
function mulberry32(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
function canonicalMoves(state){return E.moveVariants(state).slice().sort((a,b)=>P.moveKey(a).localeCompare(P.moveKey(b)));}
function technicalRoot(seed,target){
  const r=mulberry32(seed); let state=E.initialState();
  for(let ply=1;ply<=80&&state.winner===null;ply++){
    const moves=canonicalMoves(state); need(moves.length>0,`zero legal moves seed=${seed}`);
    const move=moves[Math.floor(r()*moves.length)]; state=E.applyMove(state,move).state;
    need(state.reason!=="relay-limit",`technical source relay-limit seed=${seed} ply=${ply}`);
    if(target==="namua"&&ply>=24&&state.phase==="namua"&&state.winner===null&&E.moveVariants(state).length>=2)return{seed,ply,state};
    if(target==="mtaji"&&ply>=44&&state.phase==="mtaji"&&state.winner===null&&E.moveVariants(state).length>=2)return{seed,ply,state};
  }
  throw new Error(`technical ${target} root unavailable for frozen seed ${seed}`);
}
function geometryFixture(){
  return {reconstructionCore:{rootRawSha256:"silgm-synthetic-root",targetDepth:5,representation:{mode:"RAW-ONLY",validatedTransformSet:[]},rootLegalMoveCount:3,
    layers:[
      {depth:0,treeNodeOccurrences:"1",uniqueRawStateCount:1,replyWidthHistogram:{"3":"1"},unitWidthStateCount:0},
      {depth:1,treeNodeOccurrences:"3",uniqueRawStateCount:3,replyWidthHistogram:{"1":"1","2":"2"},unitWidthStateCount:1},
      {depth:2,treeNodeOccurrences:"5",uniqueRawStateCount:4,replyWidthHistogram:{"0":"1","1":"1","2":"2"},unitWidthStateCount:1},
      {depth:3,treeNodeOccurrences:"6",uniqueRawStateCount:4,replyWidthHistogram:{"0":"1","1":"2","2":"1"},unitWidthStateCount:2},
      {depth:4,treeNodeOccurrences:"7",uniqueRawStateCount:5,replyWidthHistogram:{"0":"1","1":"2","2":"2"},unitWidthStateCount:2},
      {depth:5,treeNodeOccurrences:"8",uniqueRawStateCount:5,replyWidthHistogram:{"0":"2","1":"1","2":"2"},unitWidthStateCount:1}
    ],
    parentLayers:[
      {depth:0,duplicateEncounterCount:0,uniqueTransitionCount:3},
      {depth:1,duplicateEncounterCount:1,uniqueTransitionCount:5},
      {depth:2,duplicateEncounterCount:1,uniqueTransitionCount:5},
      {depth:3,duplicateEncounterCount:2,uniqueTransitionCount:6},
      {depth:4,duplicateEncounterCount:1,uniqueTransitionCount:6}
    ],
    cumulative:{distinctRawStates:18}}};
}
function qeq(q,n,d){need(q.defined,`fraction undefined expected ${n}/${d}`);need(BigInt(q.numerator)*BigInt(d)===BigInt(n)*BigInt(q.denominator),`fraction ${q.numerator}/${q.denominator} != ${n}/${d}`);}
function conditions(){return[
  {id:"D2_Q1",kind:"exact-depth",depth:2,quiescenceDepth:1},
  {id:"D3_Q1",kind:"exact-depth",depth:3,quiescenceDepth:1},
  {id:"B256_Q1_MAXD3",kind:"node-budget",nodeBudget:256,maxDepth:3,quiescenceDepth:1},
  {id:"B1024_Q1_MAXD3",kind:"node-budget",nodeBudget:1024,maxDepth:3,quiescenceDepth:1},
  {id:"D2_Q0",kind:"exact-depth",depth:2,quiescenceDepth:0},
  {id:"D2_Q2",kind:"exact-depth",depth:2,quiescenceDepth:2}
];}
function contrasts(){return[["SILGM-SC1-DEPTH","D2_Q1","D3_Q1"],["SILGM-SC2-NODE-BUDGET","B256_Q1_MAXD3","B1024_Q1_MAXD3"],["SILGM-SC3-QUIESCENCE","D2_Q0","D2_Q2"]];}
function staticAudit(){
  const ps=fs.readFileSync(path.join(__dirname,"lib/silgm-production.js"),"utf8"),is=fs.readFileSync(path.join(__dirname,"lib/silgm-independent.js"),"utf8");
  need(ps.includes("lgtgmiv-stage1-production.js"),"production geometry binding missing");
  need(!ps.includes("lgtgmiv-stage1-independent.js"),"production imports independent geometry");
  need(is.includes("lgtgmiv-stage1-independent.js"),"independent geometry binding missing");
  need(!is.includes("lgtgmiv-stage1-production.js"),"independent imports production geometry");
  need(ps.includes("search-reliability-decision-robustness.js"),"production controlled-search binding missing");
  need(!is.includes("search-reliability-decision-robustness.js"),"independent aliases production search primitive");
  need(!is.includes("silgm-production.js"),"independent imports SILGM production");
  need(ps!==is,"production and independent sources identical");
  const gp=fs.readFileSync(path.join(__dirname,"lib/lgtgmiv-stage1-production.js"),"utf8"),gi=fs.readFileSync(path.join(__dirname,"lib/lgtgmiv-stage1-independent.js"),"utf8");
  need(gp.includes("relay-limit")&&gi.includes("relay-limit"),"geometry relay-limit fail-closed source guard missing");
  return {productionSha256:shaText(ps),independentSha256:shaText(is),productionGeometrySha256:shaText(gp),independentGeometrySha256:shaText(gi)};
}
function main(outFile){
  const started=Date.now(), checks={};
  try{
    const spec=readJson(SPEC),study=readJson(STUDY_SPEC);
    need(spec.studyId===STUDY&&spec.stageId===STAGE,"stage spec identity mismatch"); need(study.studyId===STUDY,"study spec identity mismatch");
    need(study.seedNamespaces.stage1Development.statusAtFreeze==="RESERVED-NOT-CONSUMED"&&study.seedNamespaces.stage2Formal.statusAtFreeze==="RESERVED-NOT-CONSUMED","fresh namespaces not reserved"); checks.T1_sourceAndSpecBinding=true;

    const f=geometryFixture(),pg=P.deriveGeometry(f),ig=I.deriveGeometry(f); need(P.stable(pg)===I.stable(ig),"synthetic geometry production/independent mismatch");
    qeq(pg.metrics["SILGM-G1-ROOT-LEGAL-WIDTH"],3,1); qeq(pg.metrics["SILGM-G2-CUMULATIVE-TREE-OCCURRENCE"],30,1); qeq(pg.metrics["SILGM-G3-DUPLICATE-TRANSITION-FRACTION"],5,25); qeq(pg.metrics["SILGM-G4-CUMULATIVE-TREE-RAW-RATIO"],30,18); qeq(pg.metrics["SILGM-G5-UNIT-WIDTH-OCCUPANCY-FRACTION"],7,23); checks.T3_syntheticGeometryHandDerived=true;

    const roots=[technicalRoot(31709001,"namua"),technicalRoot(31709002,"mtaji")];
    const rootAudit=[];
    for(const r of roots){
      const pm=P.measureGeometry(E,r.state,r.seed,r.ply),im=I.measureGeometry(r.state,r.seed,r.ply); need(P.stable(pm)===I.stable(im),`real geometry mismatch seed=${r.seed}`); checks.T4_realDepth5GeometryExact=true;
      const movePairs=E.moveVariants(r.state); for(const m of movePairs) need(P.moveKey(m)===I.moveKey(m),"canonical move identity mismatch"); need(P.stateKey(r.state)===I.stateKey(r.state),"RAW identity mismatch"); checks.T2_identityExact=true;
      const byIdP={},byIdI={};
      for(const c of conditions()){
        const a=P.conditionResult(r.state,c),b=I.conditionResult(r.state,c); need(P.stable(a)===I.stable(b),`search mismatch seed=${r.seed} condition=${c.id}`); need(a.estimable,`frozen condition nonestimable seed=${r.seed} condition=${c.id}`); byIdP[c.id]=a;byIdI[c.id]=b;
      }
      checks.T6_allSearchConditionsEstimable=true; checks.T7_searchOutputsExact=true;
      const endpointRows={}; for(const [id,a,b] of contrasts()){const pe=P.endpoints(byIdP[a],byIdP[b]),ie=I.endpoints(byIdI[a],byIdI[b]);need(P.stable(pe)===I.stable(ie),`endpoint mismatch ${id}`);endpointRows[id]=pe;} checks.T8_searchEndpointsExact=true;
      rootAudit.push({seed:r.seed,ply:r.ply,phase:r.state.phase,rawStateSha256:P.stateKey(r.state),geometryDigest:P.digest(pm),searchDigest:P.digest(byIdP),endpointDigest:P.digest(endpointRows)});
    }
    checks.T5_geometryMetricDerivationExact=true;

    const vals=[P.fraction(1,1),P.fraction(2,1),P.fraction(3,1),P.fraction(4,1)],midP=P.midpoint(vals),midI=I.midpoint(vals); qeq(midP,5,2); need(P.stable(midP)===I.stable(midI),"midpoint mismatch");
    const rows=[
      {geometry:{G:P.fraction(1,1)},endpoints:{E:0}},{geometry:{G:P.fraction(2,1)},endpoints:{E:0}},
      {geometry:{G:P.fraction(3,1)},endpoints:{E:1}},{geometry:{G:P.fraction(4,1)},endpoints:{E:1}}
    ];
    const rdP=P.riskDifference(rows,"G",midP,"E"),rdI=I.riskDifference(JSON.parse(JSON.stringify(rows)),"G",midI,"E"); qeq(rdP.value,1,1); need(P.stable(rdP)===I.stable(rdI),"risk difference mismatch"); checks.T9_rationalPromotionPrimitivesExact=true;

    const strata=[{total:4,changedTotal:2,highN:2,changedHigh:2},{total:4,changedTotal:2,highN:2,changedHigh:2}],tp=P.exactStratifiedTail(strata,"HIGHER-IN-HIGH"),ti=I.exactStratifiedTail(strata,"HIGHER-IN-HIGH"); qeq(tp.p,1,36); need(P.stable(tp)===I.stable(ti),"exact formal distribution mismatch"); checks.T10_exactFormalTestHandDerived=true;

    const tiny={id:"B1",kind:"node-budget",nodeBudget:1,maxDepth:3,quiescenceDepth:1}; const np=P.conditionResult(roots[0].state,tiny),ni=I.conditionResult(roots[0].state,tiny); need(!np.estimable&&!ni.estimable,"low-budget negative control unexpectedly estimable");
    let bad=false;try{P.stateKey({pits:[],reserve:[],houseOwned:[],player:0,phase:"namua",winner:null});}catch(_){bad=true;}need(bad,"malformed RAW identity negative control failed"); need(!Number.isSafeInteger(Infinity)&&!Number.isSafeInteger(NaN),"nonfinite safe-integer guard unavailable"); checks.T13_failClosedNegativeControls=true;

    const stat=staticAudit(); checks.T11_staticIndependence=true;
    const repeat=P.conditionResult(roots[0].state,conditions()[0]); need(P.stable(repeat)===P.stable(P.conditionResult(roots[0].state,conditions()[0])),"repeat search nondeterminism"); checks.T12_repeatAndSerializationInvariant=true;

    checks.T15_freshStage1SeedsAccessed=false;checks.T15_freshStage2SeedsAccessed=false;checks.T15_protectedDepth10Generated=false;checks.T15_protectedDepth10Read=false;checks.T15_protectedDepth10Peeked=false;
    const elapsedMs=Date.now()-started,peakRssBytes=process.memoryUsage().rss;
    const scientificCore={studyId:STUDY,stageId:STAGE,evidenceClass:"TECHNICAL-FIXTURE-NON-SCIENTIFIC",checks,technicalRoots:rootAudit,staticAudit:stat,studySpecSha256:shaText(fs.readFileSync(STUDY_SPEC,"utf8")),stage0SpecSha256:shaText(fs.readFileSync(SPEC,"utf8")),freshScientificSeedAccess:false,protectedDepth10Access:false};
    let result={schemaVersion:1,...scientificCore,deterministicCoreSha256:P.digest(scientificCore),telemetry:{elapsedMs,peakRssBytes,resultArtifactBytes:null},resourceCeilings:spec.resourceCeilings,stageDisposition:"STAGE0-PASS",freshStage1AuthorizedByThisResult:false,protectedStandardRootDepth10State:"SEALED-NOT-GENERATED-NOT-READ"};
    let text=JSON.stringify(result,null,2)+"\n";result.telemetry.resultArtifactBytes=Buffer.byteLength(text);checks.T14_resourceCeilingsPass=elapsedMs<=spec.resourceCeilings.elapsedMs&&peakRssBytes<=spec.resourceCeilings.peakRssBytes&&result.telemetry.resultArtifactBytes<=spec.resourceCeilings.resultArtifactBytes;if(!checks.T14_resourceCeilingsPass)result.stageDisposition="STAGE0-NON-ESTIMABLE";
    text=JSON.stringify(result,null,2)+"\n";fs.mkdirSync(path.dirname(outFile),{recursive:true});fs.writeFileSync(outFile,text);console.log(`SILGM_STAGE0=${JSON.stringify({stageDisposition:result.stageDisposition,deterministicCoreSha256:result.deterministicCoreSha256,elapsedMs,technicalRoots:rootAudit.map(x=>({seed:x.seed,ply:x.ply,phase:x.phase}))})}`);if(result.stageDisposition!=="STAGE0-PASS")process.exitCode=2;
  }catch(e){
    fs.mkdirSync(path.dirname(outFile),{recursive:true});const result={schemaVersion:1,studyId:STUDY,stageId:STAGE,evidenceClass:"TECHNICAL-FIXTURE-NON-SCIENTIFIC",stageDisposition:"STAGE0-TECHNICAL-INVALID",error:{name:e.name,message:e.message,stack:e.stack},freshStage1SeedAccess:false,freshStage2SeedAccess:false,protectedDepth10Access:false};fs.writeFileSync(outFile,JSON.stringify(result,null,2)+"\n");console.error(e);process.exitCode=1;
  }
}
main(path.resolve(process.argv[2]||DEFAULT_OUT));
