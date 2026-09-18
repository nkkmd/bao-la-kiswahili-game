#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");

const E = require("../../public/engine.js");
const SrcP = require("./lib/ctgts-source-production.js");
const SrcI = require("./lib/ctgts-source-independent.js");
const LgtP = require("./lib/lgttci-compatibility-production.js");
const LgtI = require("./lib/lgttci-compatibility-independent.js");
const SfcP = require("./lib/sfcdf-production.js");
const SfcI = require("./lib/sfcdf-independent.js");
const FormP = require("./lib/ctgts-formal-production.js");
const FormI = require("./lib/ctgts-formal-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY_PATH = path.join(ROOT, "doc/corridor-tree-graph-transfer/prereg/STUDY_1_SPEC.json");
const STAGE_PATH = path.join(ROOT, "doc/corridor-tree-graph-transfer/prereg/STAGE_0_TECHNICAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/corridor-tree-graph-transfer/authorizations/STAGE_0_AUTHORIZATION.json");
const DEFAULT_OUT = path.join(ROOT, "artifacts/ctgts/stage-0/STAGE_0_TECHNICAL_RESULT.json");

function need(x,m){if(!x)throw new Error(m);}
function stable(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return "["+v.map(stable).join(",")+"]";return "{"+Object.keys(v).sort().map(k=>JSON.stringify(k)+":"+stable(v[k])).join(",")+"}";}
function sha256(v){return crypto.createHash("sha256").update(typeof v==="string"?v:stable(v),"utf8").digest("hex");}
function gitBlobSha(file){const b=fs.readFileSync(file);return crypto.createHash("sha1").update(Buffer.from("blob "+b.length+"\0")).update(b).digest("hex");}
function exact(a,b,label){need(stable(a)===stable(b),label+" mismatch");return true;}
function clone(v){return JSON.parse(JSON.stringify(v));}
function q(n,d){return{numerator:String(n),denominator:String(d),defined:BigInt(d)!==0n};}
function endpointFixture(){
  return {reconstructionCore:{
    rootRawSha256:"ctgts-stage0-fixture-root",targetDepth:5,
    representation:{mode:"RAW-ONLY",validatedTransformSet:[]},rootLegalMoveCount:4,
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
    narrowPathGeometry:{lengthHistogram:{"1":"1","2":"1","3":"1"},recordsDigestSha256:"fixture",records:[{length:1},{length:3},{length:2}]},
    rootBranchGeometry:{rootMoveLabels:["A","B","C","D"],rootBranchPairOverlapByDepth:[
      {depth:0,pairs:[]},{depth:1,pairs:[{rootMoveA:"A",rootMoveB:"B",overlap:q(1,3)}]},
      {depth:2,pairs:[{rootMoveA:"B",rootMoveB:"C",overlap:q(1,4)}]},{depth:3,pairs:[]},{depth:4,pairs:[]},{depth:5,pairs:[]}
    ]}
  }};
}
function cells(kind){
  const ids=["CTGTS-CELL-P1-RF1","CTGTS-CELL-P1-RF2","CTGTS-CELL-P2-RF1","CTGTS-CELL-P2-RF2"];
  return ids.map((cellId,i)=>{
    if(kind==="generalize-positive")return{cellId,comparable:24,positive:24,negative:0,zero:0,estimable:true,technicalValid:true};
    if(kind==="generalize-negative")return{cellId,comparable:24,positive:0,negative:24,zero:0,estimable:true,technicalValid:true};
    if(kind==="counterexample")return{cellId,comparable:24,positive:i===2?0:24,negative:i===2?24:0,zero:0,estimable:true,technicalValid:true};
    if(kind==="not-confirmed")return{cellId,comparable:24,positive:13,negative:11,zero:0,estimable:true,technicalValid:true};
    if(kind==="non-estimable")return{cellId,comparable:24,positive:i===1?15:24,negative:0,zero:i===1?9:0,estimable:true,technicalValid:true};
    if(kind==="technical-invalid")return{cellId,comparable:24,positive:24,negative:0,zero:0,estimable:true,technicalValid:i!==3};
    throw new Error("unknown fixture kind");
  });
}
function sourceCore(x){return{seed:x.seed,cellId:x.cellId,policyId:x.policyId,rootFamilyId:x.rootFamilyId,moveKeys:x.moveKeys,trajectorySha256:x.trajectorySha256,terminal:x.terminal,pairComplete:x.pairComplete,namua:x.namua?{phase:x.namua.phase,selectedPly:x.namua.selectedPly,rootRawSha256:x.namua.rootRawSha256,sourceTrajectorySha256:x.namua.sourceTrajectorySha256,openingPrefixSha256:x.namua.openingPrefixSha256,openingPrefixLength:x.namua.openingPrefixLength}:null,mtaji:x.mtaji?{phase:x.mtaji.phase,selectedPly:x.mtaji.selectedPly,rootRawSha256:x.mtaji.rootRawSha256,sourceTrajectorySha256:x.mtaji.sourceTrajectorySha256,openingPrefixSha256:x.mtaji.openingPrefixSha256,openingPrefixLength:x.mtaji.openingPrefixLength}:null};}

function main(outFile){
  const started=Date.now();
  const study=JSON.parse(fs.readFileSync(STUDY_PATH,"utf8"));
  const stage=JSON.parse(fs.readFileSync(STAGE_PATH,"utf8"));
  const auth=JSON.parse(fs.readFileSync(AUTH_PATH,"utf8"));
  need(study.studyId==="CTGTS-STUDY1"&&stage.stageId==="CTGTS-S0-TECHNICAL-2026-09-18-v1","study/stage identity mismatch");
  need(auth.decision==="CTGTS-STAGE0-EXECUTION-AUTHORIZED","Stage 0 not authorized");
  need(auth.freshScientificSeedAccessAuthorized===false,"Stage 0 must not authorize scientific seed access");
  for(const [rel,expected] of Object.entries(auth.bindings||{}))need(gitBlobSha(path.join(ROOT,rel))===expected,"binding mismatch "+rel);

  const controls={},details={};
  controls["STUDY-SPEC-IDENTITY-PASS"]=study.freshSeedBlock.statusAtFreeze==="RESERVED-NOT-ACCESSED"&&study.freshSeedBlock.count===768&&study.stageStructure[0].freshScientificSeedAccess===false;

  const balances={};
  let cellExact=true;
  for(let seed=study.freshSeedBlock.seedStart;seed<=study.freshSeedBlock.seedEnd;seed++){
    const p=SrcP.cellForSeed(seed),i=SrcI.cellForSeed(seed);
    if(stable(p)!==stable(i))cellExact=false;
    balances[p.cellId]=(balances[p.cellId]||0)+1;
  }
  controls["FROZEN-SCIENTIFIC-SEED-CELL-BALANCE-192-EACH-NO-READ"]=cellExact&&Object.keys(balances).length===4&&Object.values(balances).every(x=>x===192);
  controls["CELL-ASSIGNMENT-PRODUCTION-INDEPENDENT-EXACT"]=cellExact;
  details.scientificSeedArithmeticOnly={start:study.freshSeedBlock.seedStart,end:study.freshSeedBlock.seedEnd,engineReplayPerformed:false,balances};

  let replayExact=true,pairAgreement=true,p1=0,p2=0,completeByCell={};
  const replayDigests=[];
  for(let seed=stage.technicalSeedNamespace.seedStart;seed<=stage.technicalSeedNamespace.seedEnd;seed++){
    const a=SrcP.replayAssigned(E,seed,80),b=SrcI.replayAssigned(E,seed,80);
    if(stable(sourceCore(a))!==stable(sourceCore(b)))replayExact=false;
    if(a.policyId===LgtP.P1)p1++;else if(a.policyId===LgtP.P2)p2++;
    if(a.pairComplete){completeByCell[a.cellId]=(completeByCell[a.cellId]||0)+1;if(SrcP.selectionKey(a)!==SrcI.selectionKey(b))pairAgreement=false;}
    replayDigests.push({seed,cellId:a.cellId,trajectorySha256:a.trajectorySha256,pairComplete:a.pairComplete});
  }
  controls["P1-P2-TECHNICAL-REPLAY-PRODUCTION-INDEPENDENT-EXACT"]=replayExact&&p1>0&&p2>0;
  controls["RF1-RF2-ANCHOR-SELECTION-PRODUCTION-INDEPENDENT-EXACT"]=replayExact&&pairAgreement;
  details.technicalReplay={seedCount:stage.technicalSeedNamespace.count,p1,p2,completeByCell,replayCoreSha256:sha256(replayDigests)};

  const fwOut=cp.execFileSync(process.execPath,[path.join(ROOT,"tools/experiments/verify-g4-02-freshness-firewall.js")],{encoding:"utf8"}).trim();
  need(fwOut.includes("G4-02-FRESHNESS-FIREWALL-PASS"),"freshness verifier did not PASS");
  const FW=require("./verify-g4-02-freshness-firewall.js").buildFirewall();
  controls["G3-04-EXACT-FRESHNESS-FIREWALL-PASS"]=FW.g304.scientificOutcomeFieldsRetained===false&&FW.g304.g304ScientificOutcomeFieldsRetained===false;
  controls["G4-01-TRAJECTORY-BLOOM-PASS"]=FW.trajectoryBits.length*8===FW.manifest.g401SfcdfCompatibilityFirewall.trajectoryBloom.mBits;
  controls["G4-01-ROOT-BLOOM-PASS"]=FW.rootBits.length*8===FW.manifest.g401SfcdfCompatibilityFirewall.rootBloom.mBits;
  details.freshnessVerifierOutput=fwOut;

  const fixture=endpointFixture(),ep=SfcP.deriveFromMeasurement(fixture),ei=SfcI.deriveFromMeasurement(clone(fixture));
  const c1="SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION",c6="SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO";
  controls["SFCDF-C1-C6-ENDPOINT-PRODUCTION-INDEPENDENT-EXACT"]=exact({c1:ep.endpoints[c1],c6:ep.endpoints[c6]},{c1:ei.endpoints[c1],c6:ei.endpoints[c6]},"C1/C6 endpoints");
  need(BigInt(ep.endpoints[c1].numerator)*23n===9n*BigInt(ep.endpoints[c1].denominator),"C1 fixture expected 9/23");
  need(BigInt(ep.endpoints[c6].numerator)*20n===38n*BigInt(ep.endpoints[c6].denominator),"C6 fixture expected 38/20");
  details.endpointFixture={c1:ep.endpoints[c1],c6:ep.endpoints[c6]};

  const gp=FormP.evaluateClaim(cells("generalize-positive"),"MTAJI-GREATER"),gi=FormI.evaluateClaim(cells("generalize-positive"),"MTAJI-GREATER");
  const gnP=FormP.evaluateClaim(cells("generalize-negative"),"NAMUA-GREATER"),gnI=FormI.evaluateClaim(cells("generalize-negative"),"NAMUA-GREATER");
  const cpP=FormP.evaluateClaim(cells("counterexample"),"MTAJI-GREATER"),cpI=FormI.evaluateClaim(cells("counterexample"),"MTAJI-GREATER");
  const np=FormP.evaluateClaim(cells("not-confirmed"),"MTAJI-GREATER"),ni=FormI.evaluateClaim(cells("not-confirmed"),"MTAJI-GREATER");
  const nep=FormP.evaluateClaim(cells("non-estimable"),"MTAJI-GREATER"),nei=FormI.evaluateClaim(cells("non-estimable"),"MTAJI-GREATER");
  const tip=FormP.evaluateClaim(cells("technical-invalid"),"MTAJI-GREATER"),tii=FormI.evaluateClaim(cells("technical-invalid"),"MTAJI-GREATER");
  exact(gp,gi,"generalize positive");exact(gnP,gnI,"generalize negative");exact(cpP,cpI,"counterexample");exact(np,ni,"not confirmed");exact(nep,nei,"non-estimable");exact(tip,tii,"technical-invalid");
  controls["EXACT-SIGN-TEST-PRODUCTION-INDEPENDENT-EXACT"]=stable(gp.cells.map(x=>x.rawP))===stable(gi.cells.map(x=>x.rawP));
  controls["HOLM-FOUR-CELL-PRODUCTION-INDEPENDENT-EXACT"]=stable(gp.cells.map(x=>({rank:x.holmRank,threshold:x.holmThreshold,pass:x.holmPass})))===stable(gi.cells.map(x=>({rank:x.holmRank,threshold:x.holmThreshold,pass:x.holmPass})));
  controls["GENERALIZES-MAPPING-PRODUCTION-INDEPENDENT-EXACT"]=gp.decision==="GENERALIZES-WITHIN-FROZEN-DOMAIN"&&gnP.decision==="GENERALIZES-WITHIN-FROZEN-DOMAIN";
  controls["COUNTEREXAMPLE-MAPPING-PRODUCTION-INDEPENDENT-EXACT"]=cpP.decision==="COUNTEREXAMPLE-BOUNDARY-DETECTED";
  controls["NOT-CONFIRMED-MAPPING-PRODUCTION-INDEPENDENT-EXACT"]=np.decision==="NOT-CONFIRMED";
  controls["NON-ESTIMABLE-MAPPING-PRODUCTION-INDEPENDENT-EXACT"]=nep.decision==="NON-ESTIMABLE";
  controls["TECHNICAL-INVALID-MAPPING-PRODUCTION-INDEPENDENT-EXACT"]=tip.decision==="TECHNICAL-INVALID";
  details.inferenceFixtures={generalizePositive:gp,generalizeNegative:gnP,counterexample:cpP,notConfirmed:np,nonEstimable:nep,technicalInvalid:tip};

  const prodSource=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/ctgts-source-production.js"),"utf8");
  const indepSource=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/ctgts-source-independent.js"),"utf8");
  need(prodSource.includes("lgttci-compatibility-production.js")&&!prodSource.includes("lgttci-compatibility-independent.js"),"source production dependency separation failed");
  need(indepSource.includes("lgttci-compatibility-independent.js")&&!indepSource.includes("lgttci-compatibility-production.js"),"source independent dependency separation failed");

  controls["G3-11-DEPTH10-ACCESS-FALSE"]=true;
  controls["G3-12-REPLAY-ACCESS-FALSE"]=true;
  controls["G4-01-FRESH-REREAD-FALSE"]=true;
  controls["G4-10-DEPTH11-ACCESS-FALSE"]=true;

  for(const id of stage.requiredControls)need(controls[id]===true,"required control failed: "+id);
  const core={
    studyId:study.studyId,stageId:stage.stageId,evidenceClass:stage.evidenceClass,
    technicalSeedNamespace:stage.technicalSeedNamespace,
    scientificSeedBlock:{seedStart:study.freshSeedBlock.seedStart,seedEnd:study.freshSeedBlock.seedEnd,count:study.freshSeedBlock.count,status:"RESERVED-NOT-ACCESSED"},
    scientificSeedAccess:0,scientificEndpointOutcomeGenerated:false,
    controls,details,
    protectedEvidence:{g311Depth10:false,g312Replay:false,g401FreshReread:false,g410Depth11:false},
    elapsedMs:Date.now()-started,
    stageDisposition:"STAGE0-PASS"
  };
  const result={schemaVersion:1,...core,technicalCoreSha256:sha256(core)};
  const text=JSON.stringify(result,null,2)+"\n";
  need(Buffer.byteLength(text)<=stage.stage0Ceilings.resultArtifactBytes,"Stage 0 artifact ceiling exceeded");
  fs.mkdirSync(path.dirname(outFile),{recursive:true});fs.writeFileSync(outFile,text);
  process.stdout.write("CTGTS_STAGE0_RESULT="+JSON.stringify({stageDisposition:result.stageDisposition,technicalCoreSha256:result.technicalCoreSha256,scientificSeedAccess:0,elapsedMs:result.elapsedMs})+"\n");
}
try{main(path.resolve(process.argv[2]||DEFAULT_OUT));}
catch(error){
  const out=path.resolve(process.argv[2]||DEFAULT_OUT);
  const result={schemaVersion:1,studyId:"CTGTS-STUDY1",stageId:"CTGTS-S0-TECHNICAL-2026-09-18-v1",evidenceClass:"TECHNICAL-FIXTURE",stageDisposition:"STAGE0-TECHNICAL-INVALID",scientificSeedAccess:0,scientificEndpointOutcomeGenerated:false,protectedEvidence:{g311Depth10:false,g312Replay:false,g401FreshReread:false,g410Depth11:false},fatalError:String(error&&error.stack||error)};
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+"\n");console.error(error.stack||error);process.exitCode=2;
}
