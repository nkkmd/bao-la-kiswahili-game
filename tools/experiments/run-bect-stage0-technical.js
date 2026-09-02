#!/usr/bin/env node
"use strict";

const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const util=require("node:util");
const E=require("../../public/engine.js");
const P=require("./lib/bect-production.js");
const I=require("./lib/bect-independent.js");

const ROOT=path.resolve(__dirname,"../..");
const DOC=path.join(ROOT,"doc/branch-expansion-compression-transition");
const SPEC=JSON.parse(fs.readFileSync(path.join(DOC,"prereg/STUDY_1_SPEC.json"),"utf8"));
const CLAR=JSON.parse(fs.readFileSync(path.join(DOC,"prereg/STUDY_1_SPEC_CLARIFICATION_1.json"),"utf8"));
const TECHNICAL_SEED=31500001;
const STAGE_ID="BECT-S0-TECHNICAL-2026-09-02-v1";

function need(x,m){if(!x)throw new Error(m);}
function canon(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return`[${v.map(canon).join(",")}]`;return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`;}
function sha(v){return crypto.createHash("sha256").update(typeof v==="string"?v:canon(v),"utf8").digest("hex");}
function clone(x){return JSON.parse(JSON.stringify(x));}
function q(n,d=1){return P.fraction(BigInt(n),BigInt(d));}
function same(a,b,m){need(canon(a)===canon(b),m);}
function expect(v,n,d,label){need(v.defined,`${label} unexpectedly undefined`);need(BigInt(v.numerator)*BigInt(d)===BigInt(n)*BigInt(v.denominator),`${label} expected ${n}/${d}, got ${v.numerator}/${v.denominator}`);}

need(SPEC.studyId==="BECT-STUDY1","wrong Study ID");
need(SPEC.relativeLocalHorizon===5,"relative horizon changed");
need(SPEC.stages[1].seedStart===31510001&&SPEC.stages[1].seedEnd===31510240,"Stage 1 seed contract changed");
need(SPEC.stages[2].seedStart===31520001&&SPEC.stages[2].seedEnd===31520384,"Stage 2 seed contract changed");
need(SPEC.protectedDepth10Holdout.status==="SEALED / NOT GENERATED / NOT READ","protected holdout state changed");
need(CLAR.clarification.authoritativeMeaning==="sum uniqueTransitionCount[d] over parent depths d=0..4","M5 clarification missing");
need(TECHNICAL_SEED<SPEC.stages[1].seedStart&&TECHNICAL_SEED<SPEC.stages[2].seedStart,"technical seed collides with fresh namespace");

function fixture(){
  return{reconstructionCore:{
    rootRawSha256:"fixture-root",targetDepth:5,rootLegalMoveCount:4,
    layers:[
      {depth:0,treeNodeOccurrences:"1",unitWidthStateCount:0,replyWidthHistogram:{"4":"1"}},
      {depth:1,treeNodeOccurrences:"4",unitWidthStateCount:2,replyWidthHistogram:{"1":"2","2":"2"}},
      {depth:2,treeNodeOccurrences:"6",unitWidthStateCount:3,replyWidthHistogram:{"1":"3","2":"2"}},
      {depth:3,treeNodeOccurrences:"8",unitWidthStateCount:2,replyWidthHistogram:{"1":"2","3":"3"}},
      {depth:4,treeNodeOccurrences:"9",unitWidthStateCount:1,replyWidthHistogram:{"0":"1","1":"1","2":"3"}},
      {depth:5,treeNodeOccurrences:"10",unitWidthStateCount:1,replyWidthHistogram:{"0":"2","1":"1","2":"3"}}
    ],
    parentLayers:[
      {depth:0,uniqueTransitionCount:4,duplicateEncounterCount:0,widthCompressionCount:2,widthExpansionCount:1,widthStableCount:1,branchReopeningCount:0,branchExtinctionCount:0},
      {depth:1,uniqueTransitionCount:5,duplicateEncounterCount:1,widthCompressionCount:3,widthExpansionCount:1,widthStableCount:2,branchReopeningCount:1,branchExtinctionCount:0},
      {depth:2,uniqueTransitionCount:5,duplicateEncounterCount:2,widthCompressionCount:2,widthExpansionCount:2,widthStableCount:2,branchReopeningCount:1,branchExtinctionCount:0},
      {depth:3,uniqueTransitionCount:4,duplicateEncounterCount:1,widthCompressionCount:3,widthExpansionCount:1,widthStableCount:1,branchReopeningCount:1,branchExtinctionCount:1},
      {depth:4,uniqueTransitionCount:2,duplicateEncounterCount:0,widthCompressionCount:2,widthExpansionCount:1,widthStableCount:2,branchReopeningCount:0,branchExtinctionCount:2}
    ],
    cumulative:{distinctRawStates:20}
  }};
}

const fp=P.deriveLevel(fixture()),fi=I.deriveLevel(fixture());
same(fp,fi,"production/independent synthetic level mismatch");
need(!util.isDeepStrictEqual(fp.levels,fi.levels),"G3-03 prototype negative control was not exercised");
expect(fp.levels["BECT-M1-ROOT-LEGAL-WIDTH"],4,1,"M1");
expect(fp.levels["BECT-M2-CUMULATIVE-TREE-OCCURRENCE"],38,1,"M2");
expect(fp.levels["BECT-M3-GLOBAL-DISTINCT-RAW-STATES"],20,1,"M3");
expect(fp.levels["BECT-M4-CUMULATIVE-TREE-RAW-RATIO"],19,10,"M4");
expect(fp.levels["BECT-M5-DUPLICATE-TRANSITION-FRACTION"],1,5,"M5");
expect(fp.levels["BECT-M6-UNIT-WIDTH-OCCUPANCY-FRACTION"],9,23,"M6");
expect(fp.levels["BECT-M7-BRANCH-REOPENING-FRACTION"],3,26,"M7");
expect(fp.levels["BECT-M8-BRANCH-EXTINCTION-FRACTION"],3,26,"M8");

function rows(values,phases=["namua","namua","namua","namua"]){return values.map((v,i)=>{const levels={};for(const id of P.METRICS)levels[id]=q(v,1);return{ply:20+i,phase:phases[i],levels};});}
function classify(values,phases){const a=P.classifySeries(rows(values,phases)),b=I.classifySeries(rows(values,phases));same(a,b,"event grammar production/independent mismatch");return a;}
function firstEvent(c){return c[P.METRICS[0]].events[0]||null;}

need(firstEvent(classify([1,1,1,1]))===null,"no-change fixture produced event");
let e=firstEvent(classify([2,1,2,3]));need(e&&e.direction==="UP"&&e.disposition==="PERSISTENCE","up persistence fixture failed");
e=firstEvent(classify([1,2,1,0]));need(e&&e.direction==="DOWN"&&e.disposition==="PERSISTENCE","down persistence fixture failed");
e=firstEvent(classify([2,1,2,1]));need(e&&e.direction==="UP"&&e.disposition==="REVERSAL","up reversal/recovery fixture failed");
e=firstEvent(classify([2,1,2,2]));need(e&&e.direction==="UP"&&e.disposition==="STALL","stall fixture failed");
need(firstEvent(classify([2,1,2,3],["namua","namua","mtaji","mtaji"]))===null,"cross-phase primary event was not excluded");

const reopenLow=fixture(),reopenHigh=fixture();
for(const x of reopenLow.reconstructionCore.parentLayers)x.branchReopeningCount=0;
for(const x of reopenHigh.reconstructionCore.parentLayers)x.branchReopeningCount=1;
const rl=P.deriveLevel(reopenLow),rh=P.deriveLevel(reopenHigh);
need(P.sign(P.subtract(rh.levels["BECT-M7-BRANCH-REOPENING-FRACTION"],rl.levels["BECT-M7-BRANCH-REOPENING-FRACTION"]))==="UP","reopening expansion fixture failed");
const extinctLow=fixture(),extinctHigh=fixture();
for(const x of extinctLow.reconstructionCore.parentLayers)x.branchExtinctionCount=0;
for(const x of extinctHigh.reconstructionCore.parentLayers)x.branchExtinctionCount=2;
const el=P.deriveLevel(extinctLow),eh=P.deriveLevel(extinctHigh);
need(P.sign(P.subtract(eh.levels["BECT-M8-BRANCH-EXTINCTION-FRACTION"],el.levels["BECT-M8-BRANCH-EXTINCTION-FRACTION"]))==="UP","extinction fixture failed");

const pp=P.replay(E,TECHNICAL_SEED,26),ii=I.replay(E,TECHNICAL_SEED,26);
same({path:pp.path,roots:pp.rows.map(x=>({ply:x.ply,moveKey:x.moveKey,parent:x.parentRawSha256,root:x.root.rootRawSha256,phase:x.root.phase}))},{path:ii.path,roots:ii.rows.map(x=>({ply:x.ply,moveKey:x.moveKey,parent:x.parentRawSha256,root:x.root.rootRawSha256,phase:x.root.phase}))},"technical trajectory replay mismatch");
need(pp.rows.length===26,"technical trajectory ended before ply 26");
for(let k=1;k<pp.rows.length;k++)need(pp.rows[k].parentRawSha256===pp.rows[k-1].root.rootRawSha256,`adjacent successor binding failed at ply ${pp.rows[k].ply}`);

const techRoots=[24,25].map(ply=>pp.rows.find(x=>x.ply===ply).root);
for(const x of techRoots)need(x.rootState.winner===null,"technical overlap root terminal");
const pm=techRoots.map(r=>P.measureRoot(E,r)),im=techRoots.map(r=>I.measureRoot(E,r));
for(let k=0;k<pm.length;k++){
  need(pm[k].source.rootRawSha256===im[k].source.rootRawSha256,"technical root identity mismatch");
  need(pm[k].upstreamRootReconstructionCoreSha256===im[k].upstreamRootReconstructionCoreSha256,"technical upstream reconstruction mismatch");
  same(pm[k].upstreamFamilyCoreSha256,im[k].upstreamFamilyCoreSha256,"technical upstream family hash mismatch");
  same(pm[k].bect,im[k].bect,"technical BECT level mismatch");
}
need(pm[1].source.rootRawSha256===pp.rows.find(x=>x.ply===25).root.rootRawSha256,"ordered technical root binding failed");
need(pp.rows.find(x=>x.ply===25).parentRawSha256===pm[0].source.rootRawSha256,"overlapping-window successor semantics failed");

const orderedSeries=pm.map((m,k)=>({ply:24+k,phase:m.source.phase,levels:m.bect.levels,rootRawSha256:m.source.rootRawSha256}));
need(orderedSeries.length===2,"overlapping windows must remain time-indexed rather than deduplicated");
const repeatedIdentityControl=[{ply:1,rootRawSha256:"R"},{ply:2,rootRawSha256:"R"}];
need(repeatedIdentityControl.length===2&&new Set(repeatedIdentityControl.map(x=>x.rootRawSha256)).size===1,"repeated-root time-index control failed");

const insertionVariant=clone(fp);insertionVariant.levels={};for(const id of P.METRICS.slice().reverse())insertionVariant.levels[id]=fp.levels[id];
need(sha(fp)===sha(insertionVariant),"canonical property-order invariance failed");

const psrc=fs.readFileSync(path.join(__dirname,"lib/bect-production.js"),"utf8"),isrc=fs.readFileSync(path.join(__dirname,"lib/bect-independent.js"),"utf8");
need(psrc.includes('lgtgmiv-stage1-production.js'),"production upstream binding missing");
need(!psrc.includes('lgtgmiv-stage1-independent.js'),"production imports independent upstream");
need(isrc.includes('lgtgmiv-stage1-independent.js'),"independent upstream binding missing");
need(!isrc.includes('lgtgmiv-stage1-production.js'),"independent imports production upstream");
need(!isrc.includes('bect-production.js'),"independent imports BECT production implementation");

const technicalCore={
  schemaVersion:1,studyId:"BECT-STUDY1",stageId:STAGE_ID,evidenceClass:"TECHNICAL-FIXTURE",
  syntheticLevelExact:true,eventGrammarExact:true,noChangeControl:true,expansionControl:true,compressionControl:true,persistenceControl:true,reversalRecoveryControl:true,stallControl:true,crossPhaseExclusionControl:true,reopeningControl:true,extinctionControl:true,
  canonicalPrototypeInsensitiveEquality:true,prototypeSensitiveEqualityNegativeControl:true,propertyOrderInvariance:true,
  technicalTrajectorySeed:TECHNICAL_SEED,technicalTrajectorySeedPermanentlyProhibitedFromScientificUse:true,trajectoryReplayExact:true,adjacentSuccessorBindingExact:true,overlappingWindowSemanticsExact:true,repeatedRawIdentityTimeIndexSemanticsExact:true,
  technicalMeasuredRootPlies:[24,25],technicalProductionIndependentRootReconstructionExact:true,technicalProductionIndependentFamilyExact:true,technicalProductionIndependentBectLevelExact:true,
  implementationSeparation:true,m5Denominator:"sum uniqueTransitionCount[d], d=0..4",freshScientificSeedAccess:false,stage1SeedAccess:false,stage2SeedAccess:false,protectedDepth10Access:false
};
const result={...technicalCore,deterministicCoreSha256:sha(technicalCore),stageDisposition:"STAGE0-PASS"};
const out=path.join(DOC,"results/stage-0");fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,"STAGE_0_TECHNICAL_RESULT.json"),JSON.stringify(result,null,2)+"\n");
console.log(`BECT_STAGE0_RESULT=${JSON.stringify(result)}`);
