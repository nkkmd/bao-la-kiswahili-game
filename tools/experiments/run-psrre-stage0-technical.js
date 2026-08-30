#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const { performance } = require("node:perf_hooks");

const E = require("../../public/engine.js");
const P = require("./lib/psrre-stage0-production.js");
const I = require("./lib/psrre-stage0-independent.js");
const SRDR = require("./lib/search-reliability-decision-robustness.js");
const Legacy = require("./lib/position-complexity-search-diagnostic.js");
const TmgcP = require("./lib/tmgc-stage0-production.js");
const TmgcI = require("./lib/tmgc-stage0-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const OUT = path.resolve(process.argv[2] || "artifacts/local/psrre-stage0-technical");
const DOC = "doc/prospective-strategic-regime-representation-eligibility";
const SPEC_PATH = `${DOC}/prereg/STAGE_0_TECHNICAL_SPEC.json`;
const INITIAL_PATH = `${DOC}/prereg/STUDY_1_INITIAL_CONTRACT.json`;
const UPSTREAM_PATH = `${DOC}/UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`;
const AUTH_PATH = `${DOC}/authorizations/STAGE_0_TECHNICAL_EXECUTE.json`;
const G2_10_RESULT = "doc/unified-multiaxial-strategic-state-representation/results/STUDY_1_FINAL_RESULT.json";
const C03_PATH = "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json";

function abs(p){return path.join(ROOT,p);}
function text(p){return fs.readFileSync(abs(p),"utf8");}
function json(p){return JSON.parse(text(p));}
function sha256Buffer(b){return crypto.createHash("sha256").update(b).digest("hex");}
function fileSha256(p){return sha256Buffer(fs.readFileSync(abs(p)));}
function stable(v){return P.stableStringify(v);}
function normalize(v){const x=JSON.parse(JSON.stringify(v));delete x.semantics;return x;}
function exact(a,b){return stable(a)===stable(b);}
function git(args){return cp.execFileSync("git",args,{cwd:ROOT,encoding:"utf8"}).trim();}
function gate(rows,id,passed,detail=null){rows.push({id,passed:Boolean(passed),detail});return Boolean(passed);}
function directoryBytes(dir){
  let total=0;
  for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,ent.name);
    total += ent.isDirectory()?directoryBytes(p):fs.statSync(p).size;
  }
  return total;
}
function forcedMtaji(){
  return {
    pits:[
      [[1,0,0,0,0,0,0,0],Array(8).fill(0)],
      [[1,1,0,0,0,0,0,2],Array(8).fill(0)]
    ],
    reserve:[0,0],houseOwned:[false,false],player:1,phase:"mtaji",
    winner:null,reason:"PSRRE-TECHNICAL-FIXTURE",turn:50,pending:[0,0]
  };
}
function baseMtaji(backSeeds=2){
  const pits=[
    [Array(8).fill(0),Array(8).fill(0)],
    [Array(8).fill(0),Array(8).fill(0)]
  ];
  pits[0][E.FRONT][E.HOUSE]=1;pits[0][E.BACK][0]=backSeeds;
  pits[1][E.FRONT][E.HOUSE]=1;pits[1][E.BACK][0]=2;
  return {pits,reserve:[0,0],houseOwned:[true,true],player:0,phase:"mtaji",
    winner:null,reason:"PSRRE-TECHNICAL-FIXTURE",turn:80,pending:[0,0]};
}
function identityAudit(initial){
  const metadata=JSON.parse(JSON.stringify(initial));metadata.turn+=123;metadata.reason="META";
  const pending=JSON.parse(JSON.stringify(initial));pending.pending[0]+=1;
  return {
    productionIndependentExact:P.rawIdentityHash(initial)===I.rawIdentityHash(initial),
    metadataExcludedProduction:P.rawIdentityHash(initial)===P.rawIdentityHash(metadata),
    metadataExcludedIndependent:I.rawIdentityHash(initial)===I.rawIdentityHash(metadata),
    pendingIncludedProduction:P.rawIdentityHash(initial)!==P.rawIdentityHash(pending),
    pendingIncludedIndependent:I.rawIdentityHash(initial)!==I.rawIdentityHash(pending)
  };
}
function observableAudit(fixtures){
  return fixtures.map(({id,state})=>{
    const p=normalize(P.technicalObservable(state)),i=normalize(I.technicalObservable(state));
    return {id,exact:exact(p,i),production:p,independent:i};
  });
}
function searchOne(state,depth){
  const options={evaluationProfile:"bao",quiescenceDepth:1,orderQuiescenceCaptures:false};
  const pr=SRDR.analyzeExactCondition(state,depth,options).result;
  const ir=Legacy.analyzeRootCandidates(state,depth,options);
  function slim(r){
    const pairs=r.candidates.map(c=>[c.moveKey,c.score]).sort((a,b)=>a[0].localeCompare(b[0]));
    return {legalMoveCount:r.legalMoveCount,bestScore:r.bestScore,topSetMoveKeys:r.topSetMoveKeys.slice().sort(),
      canonicalBestMoveKey:r.canonicalBestMoveKey,scoreByMoveKey:Object.fromEntries(pairs)};
  }
  return {depth,exact:exact(slim(pr),slim(ir)),production:slim(pr),independent:slim(ir)};
}
function searchAudit(fixtures){
  const out=[];
  for(const f of fixtures) for(const d of [1,2]) out.push({fixture:f.id,...searchOne(f.state,d)});
  return out;
}
function c03Audit(initial){
  const payload=json(C03_PATH),candidate=payload.formalCandidates.find(x=>x.candidateId==="TM-S2-C03");
  function analyze(state){
    const p=TmgcP.analyzeFixture(state,candidate),i=TmgcI.analyzeFixture(state,candidate);
    return {exact:exact(normalize(p),normalize(i)),p,i};
  }
  const positive=analyze(baseMtaji(2)),negative=analyze(baseMtaji(6)),namua=analyze(initial);
  return {
    candidateId:candidate?.candidateId,
    exact:positive.exact&&negative.exact&&namua.exact,
    positiveEligible:positive.p.eligible,positiveStructuralSuccess:positive.p.structuralSuccess,
    negativeEligible:negative.p.eligible,negativeStructuralSuccess:negative.p.structuralSuccess,
    namuaEligible:namua.p.eligible,
    generalizationAuthorized:false,
    passed:candidate?.candidateId==="TM-S2-C03"&&positive.exact&&negative.exact&&namua.exact&&
      positive.p.eligible===true&&positive.p.structuralSuccess===true&&
      negative.p.eligible===true&&negative.p.structuralSuccess===false&&namua.p.eligible===false
  };
}
function technicalFamilyAudit(){
  const robustFixture=[[-2,-1,5],[-2,1,5],[2,-1,5],[2,1,5]];
  const pcaFixture=[[-1.5,-1],[-0.5,1],[0.5,1],[1.5,-1]];
  const partitionFixture=[[0,0],[0,2],[10,0],[10,2]];
  const heldout=[[5,0],[0,1],[10,1]];
  const pScale=P.robustScale(robustFixture),iScale=I.robustScale(robustFixture);
  const pPca=P.pca(pcaFixture,2),iPca=I.pca(pcaFixture,2);
  const pTie=P.pca([[-1,-1],[-1,1],[1,-1],[1,1]],2),iTie=I.pca([[-1,-1],[-1,1],[1,-1],[1,1]],2);
  const pWard=P.ward(partitionFixture,2),iWard=I.ward(partitionFixture,2);
  const pPam=P.pam(partitionFixture,2),iPam=I.pam(partitionFixture,2);
  const pAssign=P.assignFrozen(heldout,[[0,0],[10,0]]),iAssign=I.assignFrozen(heldout,[[0,0],[10,0]]);
  let pMissing=false,iMissing=false;
  try{P.robustScale([[1,null],[2,3]]);}catch{pMissing=true;}
  try{I.robustScale([[1,null],[2,3]]);}catch{iMissing=true;}
  const pRF_A={scale:pScale,pca:pPca,partition:P.ward(pPca.scores,2)};
  const iRF_A={scale:iScale,pca:iPca,partition:I.ward(iPca.scores,2)};
  const pRF_B={scale:pScale,pca:pPca,partition:P.pam(pPca.scores,2)};
  const iRF_B={scale:iScale,pca:iPca,partition:I.pam(iPca.scores,2)};
  const pRF_C={scale:pScale,partition:P.pam(pScale.transformed,2)};
  const iRF_C={scale:iScale,partition:I.pam(iScale.transformed,2)};
  return {
    robustScalingExact:exact(pScale,iScale),
    zeroVarianceExplicit:exact(pScale.zeroVarianceColumns,[2])&&exact(iScale.zeroVarianceColumns,[2]),
    missingUndefinedRejected:pMissing&&iMissing,
    pcaExact:exact(pPca,iPca),
    pcaTieExact:exact(pTie,iTie)&&exact(pTie.anchors,[0,1])&&exact(iTie.anchors,[0,1]),
    wardExact:exact(pWard,iWard),
    pamExact:exact(pPam,iPam),
    assignmentExact:exact(pAssign,iAssign),
    assignmentTieCanonical:pAssign[0].label===0&&iAssign[0].label===0,
    families:{
      "RF-A-ROBUST-PCA-WARD":{exact:exact(pRF_A,iRF_A),production:pRF_A,independent:iRF_A},
      "RF-B-ROBUST-PCA-PAM":{exact:exact(pRF_B,iRF_B),production:pRF_B,independent:iRF_B},
      "RF-C-DIRECT-ROBUST-PAM":{exact:exact(pRF_C,iRF_C),production:pRF_C,independent:iRF_C}
    }
  };
}
function floatAudit(){
  const values=[0,0.5,-1.5,4/3,Number.MIN_VALUE];
  const rows=values.map(v=>({value:String(v),production:P.binary64Hex(v),independent:I.binary64Hex(v)}));
  return {rows,passed:rows.every(r=>r.production===r.independent)};
}
function sourceBindingAudit(auth){
  const rows=[];
  for(const [p,expected] of Object.entries(auth.sourceBindings||{})){
    const exists=fs.existsSync(abs(p));
    const actual=exists?git(["hash-object",p]):null;
    rows.push({path:p,exists,expectedGitBlobSha:expected,actualGitBlobSha:actual,match:exists&&actual===expected});
  }
  return {rows,passed:rows.length>0&&rows.every(r=>r.match)};
}
function separationAudit(){
  const s=text("tools/experiments/lib/psrre-stage0-independent.js");
  const forbidden=["psrre-stage0-production","require(\"./psrre","require('./psrre"];
  return {forbiddenAbsent:Object.fromEntries(forbidden.map(x=>[x,!s.includes(x)])),passed:forbidden.every(x=>!s.includes(x))};
}
function upstreamAudit(){
  const u=text(UPSTREAM_PATH);
  const required=["G2-06","G2-07","G2-08","G2-09","G2-10","INELIGIBLE","DEVELOPMENT-CANDIDATE-ONLY","RAW"];
  return {requiredPresent:Object.fromEntries(required.map(x=>[x,u.includes(x)])),passed:required.every(x=>u.includes(x))};
}
function g2_10Audit(){
  const r=json(G2_10_RESULT);
  const ok=r.studyId==="UMSSR-STUDY1"&&r.stages.stage0.disposition==="STAGE0-TECHNICAL-PASS"&&
    r.stages.stage1.disposition==="STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION"&&
    r.stages.stage1.selectedRepresentation===null&&r.formalStudyDecision==="NOT-AUTHORIZED-NOT-EXECUTED"&&
    r.stages.stage2.disposition==="NOT-AUTHORIZED-NOT-EXECUTED"&&
    r.stages.stage1.seedBlock.status==="CONSUMED"&&r.stages.stage2.seedBlock.status==="RESERVED_UNCONSUMED"&&
    r.g2_11CandidateInputAuthorized===false;
  return {passed:ok,studyId:r.studyId,stage1:r.stages.stage1.disposition,selectedRepresentation:r.stages.stage1.selectedRepresentation,
    formalStudyDecision:r.formalStudyDecision,stage2:r.stages.stage2.disposition,stage1Seeds:r.stages.stage1.seedBlock.status,
    stage2Seeds:r.stages.stage2.seedBlock.status,g2_11CandidateInputAuthorized:r.g2_11CandidateInputAuthorized};
}

function main(){
  const started=performance.now();
  fs.rmSync(OUT,{recursive:true,force:true});fs.mkdirSync(OUT,{recursive:true});
  const spec=json(SPEC_PATH),initialContract=json(INITIAL_PATH),auth=json(AUTH_PATH);
  const head=git(["rev-parse","HEAD"]),parent=git(["rev-parse","HEAD^"]);
  const baseline=spec.baselineRemoteMain;
  const baselineExists=(()=>{try{git(["cat-file","-e",`${baseline}^{commit}`]);return true;}catch{return false;}})();
  const baselineAncestor=(()=>{try{cp.execFileSync("git",["merge-base","--is-ancestor",baseline,head],{cwd:ROOT});return true;}catch{return false;}})();
  const authorization={
    authorized:auth.authorized===true,sourceFreezeCommitMatches:auth.sourceFreezeCommit===parent,
    scientificInferenceFalse:auth.scientificInferenceAuthorized===false,scientificSeedFalse:auth.scientificSeedUseAuthorized===false,
    g2_11False:auth.g2_11Authorized===false
  };
  const initial=E.initialState(),mtaji=forcedMtaji(),fixtures=[{id:"ENGINE-INITIAL-NAMUA",state:initial},{id:"SYN-FORCED-MTAJI",state:mtaji}];
  const identity=identityAudit(initial),observables=observableAudit(fixtures),search=searchAudit(fixtures),c03=c03Audit(initial);
  const families=technicalFamilyAudit(),floats=floatAudit(),binding=sourceBindingAudit(auth),separation=separationAudit(),upstream=upstreamAudit(),g210=g2_10Audit();

  const gates=[];
  gate(gates,"BASELINE-REMOTE-MAIN-BINDING",initialContract.baselineRemoteMain===baseline&&baselineExists&&baselineAncestor,{baseline,baselineExists,baselineAncestor});
  gate(gates,"G2-10-IMMUTABLE-CLOSURE-BINDING",g210.passed,g210);
  gate(gates,"UPSTREAM-ELIGIBILITY-BINDING",upstream.passed,upstream);
  gate(gates,"RAW-IDENTITY-PRODUCTION-INDEPENDENT-EXACT",identity.productionIndependentExact&&identity.metadataExcludedProduction&&identity.metadataExcludedIndependent&&identity.pendingIncludedProduction&&identity.pendingIncludedIndependent,identity);
  gate(gates,"VALIDATED-TRANSFORM-SET-EMPTY",Array.isArray(spec.rawIdentity.validatedTransformSet)&&spec.rawIdentity.validatedTransformSet.length===0&&Array.isArray(initialContract.rawIdentity.validatedTransformSet)&&initialContract.rawIdentity.validatedTransformSet.length===0);
  gate(gates,"NO-SCIENTIFIC-SEED-USE",auth.scientificSeedUseAuthorized===false&&initialContract.seedReservation.stage1Scientific.status==="RESERVED_UNCONSUMED"&&initialContract.seedReservation.stage2Scientific.status==="RESERVED_UNCONSUMED",{usedSeeds:[]});
  gate(gates,"NO-G2-11-OUTCOME-INSPECTION",auth.g2_11Authorized===false&&spec.g2_11OutcomeInspectionAuthorized===false,{inspectedG2_11Outcome:false});
  gate(gates,"OBSERVABLE-FAMILY-TECHNICAL-RECOMPUTATION",observables.every(x=>x.exact)&&search.every(x=>x.exact)&&c03.passed,{observableExact:observables.map(x=>[x.id,x.exact]),searchExact:search.map(x=>[`${x.fixture}:D${x.depth}`,x.exact]),c03:c03.passed});
  gate(gates,"ROBUST-SCALING-DETERMINISM",families.robustScalingExact,{zeroVarianceExplicit:families.zeroVarianceExplicit});
  gate(gates,"PCA-SIGN-TIE-ORDER-DETERMINISM",families.pcaExact&&families.pcaTieExact);
  gate(gates,"WARD-TIEBREAK-SERIALIZATION-DETERMINISM",families.wardExact);
  gate(gates,"PAM-INIT-SWAP-TIEBREAK-DETERMINISM",families.pamExact);
  gate(gates,"FROZEN-ASSIGNMENT-SEMANTICS-IMPLEMENTABLE",families.assignmentExact&&families.assignmentTieCanonical);
  gate(gates,"ZERO-VARIANCE-MISSING-UNDEFINED-EXPLICIT",families.zeroVarianceExplicit&&families.missingUndefinedRejected);
  gate(gates,"FLOAT-CANONICALIZATION-EXACT",floats.passed,floats);
  gate(gates,"INDEPENDENT-IMPLEMENTATION-SEPARATION",separation.passed,separation);

  const sourceManifest={schemaVersion:"PSRRE_STAGE0_SOURCE_HASHES_V1",studyId:"PSRRE-STUDY1",stageId:spec.stageId,head,parent,
    files:binding.rows.map(r=>({path:r.path,gitBlobSha:r.actualGitBlobSha,sha256:r.exists?fileSha256(r.path):null}))};
  fs.writeFileSync(path.join(OUT,"source-hashes.json"),JSON.stringify(sourceManifest,null,2)+"\n");
  const technicalOutput={schemaVersion:"PSRRE_STAGE0_TECHNICAL_FAMILY_OUTPUT_V1",scientificPerformanceInspected:false,scientificOutcome:false,
    identity,observables,search,c03,families,floats};
  fs.writeFileSync(path.join(OUT,"technical-family-output.json"),JSON.stringify(technicalOutput,null,2)+"\n");

  gate(gates,"SOURCE-FREEZE-AUTHORIZATION-BINDING",authorization.authorized&&authorization.sourceFreezeCommitMatches&&authorization.scientificInferenceFalse&&authorization.scientificSeedFalse&&authorization.g2_11False&&binding.passed,{authorization,bindingPassed:binding.passed});
  gate(gates,"INDEPENDENT-IMPLEMENTATION-SEPARATION-SOURCE-BINDING",binding.rows.some(r=>r.path.endsWith("psrre-stage0-independent.js")&&r.match));
  gate(gates,"ARTIFACT-COMPLETENESS",fs.existsSync(path.join(OUT,"source-hashes.json"))&&fs.existsSync(path.join(OUT,"technical-family-output.json")));

  const elapsed=(performance.now()-started)/1000,rss=process.memoryUsage().rss;
  const prelimBytes=directoryBytes(OUT);
  const resourcePass=elapsed<=spec.resourceCeilings.runnerWallClockSeconds&&rss<=spec.resourceCeilings.maxRssBytes&&prelimBytes<=spec.resourceCeilings.uncompressedTechnicalArtifactBytes;
  gate(gates,"RESOURCE-CEILING",resourcePass,{elapsedSeconds:elapsed,rssBytes:rss,preResultArtifactBytes:prelimBytes,ceilings:spec.resourceCeilings});

  const mandated=new Set(spec.mandatoryGates);
  const mandatoryRows=gates.filter(g=>mandated.has(g.id));
  const missingMandatory=[...mandated].filter(id=>!gates.some(g=>g.id===id));
  let disposition;
  if(missingMandatory.length) disposition="STAGE0-TECHNICAL-INVALID";
  else if(mandatoryRows.every(g=>g.passed)) disposition="STAGE0-TECHNICAL-PASS";
  else if(mandatoryRows.filter(g=>!g.passed).every(g=>g.id==="RESOURCE-CEILING")) disposition="STAGE0-RESOURCE-CENSORED";
  else disposition="STAGE0-TECHNICAL-INVALID";

  const result={schemaVersion:"PSRRE_STAGE0_TECHNICAL_RESULT_V1",researchGeneration:"Research Generation 2",agendaLabel:null,studyId:"PSRRE-STUDY1",
    stageId:spec.stageId,technicalOnly:true,scientificInferenceAuthorized:false,scientificSeedUseAuthorized:false,scientificOutcomeGenerated:false,
    g2_11Authorized:false,g2_11OutcomeInspected:false,head,parent,authorization,sourceBindingPassed:binding.passed,
    mandatoryGateCount:spec.mandatoryGates.length,missingMandatoryGates:missingMandatory,gates,disposition,
    familyTechnicalQualification:Object.fromEntries(Object.entries(families.families).map(([k,v])=>[k,{technicalExact:v.exact,scientificPerformanceInspected:false}])),
    stage1AutomaticallyAuthorized:false,stage2Authorized:false,g2_11CandidateInputAuthorized:false,
    resource:{elapsedSeconds:elapsed,rssBytes:rss,preResultArtifactBytes:prelimBytes}};
  fs.writeFileSync(path.join(OUT,"stage0-result.json"),JSON.stringify(result,null,2)+"\n");
  const finalBytes=directoryBytes(OUT);
  result.resource.finalArtifactBytes=finalBytes;
  fs.writeFileSync(path.join(OUT,"stage0-result.json"),JSON.stringify(result,null,2)+"\n");
  console.log(JSON.stringify({studyId:result.studyId,stageId:result.stageId,disposition,head,parent,failed:gates.filter(g=>!g.passed).map(g=>g.id),
    missingMandatory,scientificSeedUseAuthorized:false,g2_11Authorized:false,artifactBytes:directoryBytes(OUT)},null,2));
  if(disposition!=="STAGE0-TECHNICAL-PASS") process.exitCode=2;
}
main();
