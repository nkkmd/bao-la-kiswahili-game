#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const crypto = require("node:crypto");
const util = require("node:util");
const P = require("./lib/sfcdf-production.js");
const I = require("./lib/sfcdf-independent.js");

function need(x,m){if(!x)throw new Error(m);}
function canon(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return `[${v.map(canon).join(",")}]`;return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`;}
function sha(s){return crypto.createHash("sha256").update(s,"utf8").digest("hex");}
function clone(x){return JSON.parse(JSON.stringify(x));}
function q(n,d){return{numerator:String(n),denominator:String(d),defined:BigInt(d)!==0n};}
function measurement(){
  return {reconstructionCore:{
    rootRawSha256:"fixture-root",
    targetDepth:5,
    representation:{mode:"RAW-ONLY",validatedTransformSet:[]},
    rootLegalMoveCount:4,
    layers:[
      {depth:0,treeNodeOccurrences:"1",uniqueRawStateCount:1,replyWidthHistogram:{"4":"1"},unitWidthStateCount:0,reconvergentRawStateCount:0},
      {depth:1,treeNodeOccurrences:"4",uniqueRawStateCount:4,replyWidthHistogram:{"1":"2","2":"2"},unitWidthStateCount:2,reconvergentRawStateCount:0},
      {depth:2,treeNodeOccurrences:"6",uniqueRawStateCount:5,replyWidthHistogram:{"1":"3","2":"2"},unitWidthStateCount:3,reconvergentRawStateCount:1},
      {depth:3,treeNodeOccurrences:"8",uniqueRawStateCount:5,replyWidthHistogram:{"1":"2","3":"3"},unitWidthStateCount:2,reconvergentRawStateCount:2},
      {depth:4,treeNodeOccurrences:"9",uniqueRawStateCount:5,replyWidthHistogram:{"0":"1","1":"1","2":"3"},unitWidthStateCount:1,reconvergentRawStateCount:2},
      {depth:5,treeNodeOccurrences:"10",uniqueRawStateCount:6,replyWidthHistogram:{"0":"2","1":"1","2":"3"},unitWidthStateCount:1,reconvergentRawStateCount:2}
    ],
    parentLayers:[
      {depth:0,widthCompressionCount:2,widthExpansionCount:1,widthStableCount:1,branchReopeningCount:0,branchExtinctionCount:0},
      {depth:1,widthCompressionCount:3,widthExpansionCount:1,widthStableCount:2,branchReopeningCount:1,branchExtinctionCount:0},
      {depth:2,widthCompressionCount:2,widthExpansionCount:2,widthStableCount:2,branchReopeningCount:1,branchExtinctionCount:0},
      {depth:3,widthCompressionCount:3,widthExpansionCount:1,widthStableCount:1,branchReopeningCount:1,branchExtinctionCount:1},
      {depth:4,widthCompressionCount:2,widthExpansionCount:1,widthStableCount:2,branchReopeningCount:0,branchExtinctionCount:2}
    ],
    cumulative:{distinctRawStates:20},
    narrowPathGeometry:{lengthHistogram:{"1":"1","2":"1","3":"1"},recordsDigestSha256:"fixture-narrow-digest",records:[{length:1},{length:3},{length:2}]},
    rootBranchGeometry:{
      rootMoveLabels:["A","B","C","D"],
      rootBranchPairOverlapByDepth:[
        {depth:0,pairs:[]},
        {depth:1,pairs:[{rootMoveA:"A",rootMoveB:"B",overlap:q(1,3)},{rootMoveA:"A",rootMoveB:"C",overlap:q(0,1)}]},
        {depth:2,pairs:[{rootMoveA:"A",rootMoveB:"B",overlap:q(1,2)},{rootMoveA:"B",rootMoveB:"C",overlap:q(1,4)}]},
        {depth:3,pairs:[{rootMoveA:"C",rootMoveB:"D",overlap:q(2,5)}]},
        {depth:4,pairs:[]},{depth:5,pairs:[]}
      ]
    }
  }};
}
function expectFraction(x,n,d,label){need(x.defined,`${label} undefined`);need(BigInt(x.numerator)*BigInt(d)===BigInt(n)*BigInt(x.denominator),`${label} expected ${n}/${d} got ${x.numerator}/${x.denominator}`);}
function coreView(x){return{rootRawSha256:x.rootRawSha256,targetDepth:x.targetDepth,constructSeparation:x.constructSeparation,rawPrimitives:x.rawPrimitives,endpoints:x.endpoints};}

const fixture=measurement();
const p=P.deriveFromMeasurement(fixture),i=I.deriveFromMeasurement(fixture);
need(canon(p)===canon(i),"production/independent canonical endpoint content mismatch");
need(!util.isDeepStrictEqual(p.endpoints,i.endpoints),"prototype-sensitive control unexpectedly equal; fixture must exercise G3-03 failure mode");
expectFraction(p.endpoints["SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION"],9,23,"C1");
expectFraction(p.endpoints["SFCDF-C2-WIDTH-COMPRESSION-FRACTION"],12,26,"C2");
expectFraction(p.endpoints["SFCDF-C3-LONGEST-UNIT-WIDTH-RUN"],3,1,"C3");
expectFraction(p.endpoints["SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION"],7,25,"C4");
expectFraction(p.endpoints["SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION"],3,6,"C5");
expectFraction(p.endpoints["SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO"],38,20,"C6");
need(p.constructSeparation.combinedClassDefined===false,"combined corridor/funnel class must remain undefined");

const corridorOnly=measurement();
for(const l of corridorOnly.reconstructionCore.layers)l.reconvergentRawStateCount=0;
corridorOnly.reconstructionCore.rootBranchGeometry.rootBranchPairOverlapByDepth=[{depth:0,pairs:[]},{depth:1,pairs:[]},{depth:2,pairs:[]},{depth:3,pairs:[]},{depth:4,pairs:[]},{depth:5,pairs:[]}];
corridorOnly.reconstructionCore.cumulative.distinctRawStates=38;
const co=P.deriveFromMeasurement(corridorOnly);
need(BigInt(co.endpoints["SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION"].numerator)>0n,"corridor-only control lost corridor signal");
need(BigInt(co.endpoints["SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION"].numerator)===0n,"corridor-only control has reconvergence");
need(BigInt(co.endpoints["SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION"].numerator)===0n,"corridor-only control has branch overlap");
expectFraction(co.endpoints["SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO"],1,1,"corridor-only C6");

const funnelOnly=measurement();
for(const l of funnelOnly.reconstructionCore.layers){const positive=Object.entries(l.replyWidthHistogram).reduce((a,[k,v])=>Number(k)>0?a+Number(v):a,0);l.replyWidthHistogram={"0":String(Object.entries(l.replyWidthHistogram).reduce((a,[k,v])=>Number(k)===0?a+Number(v):a,0)),"2":String(positive)};l.unitWidthStateCount=0;}
funnelOnly.reconstructionCore.narrowPathGeometry={lengthHistogram:{},recordsDigestSha256:"none",records:[]};
const fo=P.deriveFromMeasurement(funnelOnly);
expectFraction(fo.endpoints["SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION"],0,1,"funnel-only C1");
expectFraction(fo.endpoints["SFCDF-C3-LONGEST-UNIT-WIDTH-RUN"],0,1,"funnel-only C3");
need(BigInt(fo.endpoints["SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION"].numerator)>0n,"funnel-only control lost reconvergence");
need(BigInt(fo.endpoints["SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION"].numerator)>0n,"funnel-only control lost overlap");

const noRootPair=measurement();
noRootPair.reconstructionCore.rootLegalMoveCount=1;
noRootPair.reconstructionCore.rootBranchGeometry={rootMoveLabels:["A"],rootBranchPairOverlapByDepth:[]};
const nr=P.deriveFromMeasurement(noRootPair);
need(nr.endpoints["SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION"].defined===false,"C5 zero denominator must be undefined");

const pairRows=[];
for(let n=0;n<12;n++){
  const nam={sfcdf:{endpoints:{}}},mt={sfcdf:{endpoints:{}}};
  for(const id of P.CANDIDATES){nam.sfcdf.endpoints[id]=P.fraction(1n,10n);mt.sfcdf.endpoints[id]=P.fraction(BigInt(n<9?2:1),10n);}
  pairRows.push(P.comparePair(`pair-${n}`,nam,mt));
}
const ps=P.summarizeDevelopment(pairRows,12),is=I.summarizeDevelopment(pairRows.map(r=>JSON.parse(JSON.stringify(r))),12);
need(canon(ps)===canon(is),"development summary canonical mismatch");
need(ps.promotedCandidates.length===P.CANDIDATES.length,"development promotion boundary fixture failed");

const psrc=fs.readFileSync(__dirname+"/lib/sfcdf-production.js","utf8"),isrc=fs.readFileSync(__dirname+"/lib/sfcdf-independent.js","utf8");
need(psrc.includes('lgtgmiv-stage1-production.js'),"production upstream binding missing");
need(!psrc.includes('lgtgmiv-stage1-independent.js'),"production imports independent upstream");
need(isrc.includes('lgtgmiv-stage1-independent.js'),"independent upstream binding missing");
need(!isrc.includes('lgtgmiv-stage1-production.js'),"independent imports production upstream");
need(!isrc.includes('sfcdf-production.js'),"independent imports G3-04 production implementation");

const scientificCore={studyId:P.STUDY_ID,stageId:"SFCDF-S0-TECHNICAL-2026-09-02-v1",fixtureExact:true,constructSeparation:true,canonicalPrototypeInsensitiveEquality:true,productionIndependentCanonicalAgreement:true,endpointValues:coreView(p).endpoints,protectedDepth10Access:false,freshScientificSeedAccess:false};
const result={schemaVersion:1,...scientificCore,deterministicCoreSha256:sha(canon(scientificCore)),stageDisposition:"STAGE0-PASS"};
const outDir="doc/structural-forcing-corridor-decision-funnel/results/stage-0";fs.mkdirSync(outDir,{recursive:true});fs.writeFileSync(`${outDir}/STAGE_0_TECHNICAL_RESULT.json`,JSON.stringify(result,null,2)+"\n");
console.log(`SFCDF_STAGE0_RESULT=${JSON.stringify(result)}`);
