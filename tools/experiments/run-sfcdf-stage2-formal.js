#!/usr/bin/env node
"use strict";

const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const cp=require("node:child_process");
const E=require("../../public/engine.js");
const P=require("./lib/sfcdf-stage2-production.js");
const I=require("./lib/sfcdf-stage2-independent.js");

const ROOT=path.resolve(__dirname,"../..");
const DOC=path.join(ROOT,"doc/structural-forcing-corridor-decision-funnel");
const OUT=path.join(DOC,"results/stage-2");
const SPEC_PATH=path.join(DOC,"prereg/STUDY_1_SPEC.json");
const UPSTREAM_FIREWALL_PATH=path.join(DOC,"prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const FORMAL_INPUT_PATH=path.join(DOC,"prereg/STAGE_2_FORMAL_INPUT.json");
const AUTH_PATH=path.join(DOC,"authorizations/STAGE_2_FORMAL_AUTHORIZATION.json");
const LEASE_PATH=path.join(DOC,"executions/stage-2-execution-started.json");
const STAGE1_PATH=path.join(DOC,"results/stage-1/scientific-result.json");
const RESULT_PATH=path.join(OUT,"scientific-result.json");
const TELEMETRY_PATH=path.join(OUT,"telemetry.json");
const SUMMARY_PATH=path.join(OUT,"execution-summary.json");
const STAGE_ID="SFCDF-S2-FORMAL-2026-09-02-v1";
let freshAccessStarted=false;

function need(x,m){if(!x)throw new Error(m);}
function readJson(f){return JSON.parse(fs.readFileSync(f,"utf8"));}
function canon(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return`[${v.map(canon).join(",")}]`;return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`;}
function sha256(s){return crypto.createHash("sha256").update(s,"utf8").digest("hex");}
function gitBlobSha(s){const b=Buffer.from(s,"utf8");return crypto.createHash("sha1").update(Buffer.from(`blob ${b.length}\0`,"utf8")).update(b).digest("hex");}
function canonicalEqual(a,b){return canon(a)===canon(b);}
function maxRssBytes(){return process.resourceUsage().maxRSS*1024;}
function timed(fn){const t=process.hrtime.bigint();const value=fn();return{value,elapsedMs:Number(process.hrtime.bigint()-t)/1e6,peakRssBytes:maxRssBytes(),artifactBytes:Buffer.byteLength(JSON.stringify(value),"utf8")};}
function sourceOnly(x){return{phase:x.phase,sourceSeed:x.sourceSeed,selectedPly:x.selectedPly,rootRawSha256:x.rootRawSha256,sourceTrajectorySha256:x.sourceTrajectorySha256,openingPrefixSha256:x.openingPrefixSha256,openingPrefixLength:x.openingPrefixLength};}
function pairSources(s){return s.pairs.map(p=>({pairId:p.pairId,sourceSeed:p.sourceSeed,namua:sourceOnly(p.namua),mtaji:sourceOnly(p.mtaji)}));}
function verifyBlobBindings(auth){for(const[rel,expected]of Object.entries(auth.sourceBlobBindings||{})){const f=path.join(ROOT,rel);need(fs.existsSync(f),`bound source missing ${rel}`);const actual=gitBlobSha(fs.readFileSync(f,"utf8"));need(actual===expected,`bound source blob mismatch ${rel}: ${actual} != ${expected}`);}}
function resource(row,t,c){const v=row.resourceView;const uniqueRawStates=Number(v.distinctRawStates),uniqueTransitions=Number(v.uniqueTransitions),parentExpansions=Number(v.parentExpansions),treeNodeOccurrences=BigInt(v.treeNodeOccurrences);const within=uniqueRawStates<=c.uniqueRawStates&&uniqueTransitions<=c.uniqueTransitions&&parentExpansions<=c.parentExpansions&&uniqueTransitions<=c.legalMoveEvaluations&&treeNodeOccurrences<=BigInt(c.treeNodeOccurrencesSummedAcrossLayers)&&t.elapsedMs<=c.elapsedMs&&t.peakRssBytes<=c.peakRssBytes&&t.artifactBytes<=c.rootArtifactBytes;return{uniqueRawStates,uniqueTransitions,parentExpansions,legalMoveEvaluations:uniqueTransitions,treeNodeOccurrences:String(treeNodeOccurrences),elapsedMs:t.elapsedMs,peakRssBytes:t.peakRssBytes,artifactBytes:t.artifactBytes,within};}
function promotedEndpointProjection(m,promoted){const endpoints={};for(const x of promoted)endpoints[x.candidateId]=m.sfcdf.endpoints[x.candidateId];return endpoints;}
function formalPrimitiveProjection(m){const r=m.sfcdf.rawPrimitives;return{unitWidthStatePresenceDepth0To5:r.unitWidthStatePresenceDepth0To5,positiveReplyRawStatePresenceDepth0To5:r.positiveReplyRawStatePresenceDepth0To5,treeOccurrenceCountDepth0To5:r.treeOccurrenceCountDepth0To5,distinctRawStatesDepth0To5:r.distinctRawStatesDepth0To5};}
function scientificRow(pairId,phase,m,promoted){return{pairId,phase,source:m.source,upstreamRootReconstructionCoreSha256:m.upstreamRootReconstructionCoreSha256,upstreamFamilyCoreSha256:m.upstreamFamilyCoreSha256,formalPrimitives:formalPrimitiveProjection(m),promotedEndpoints:promotedEndpointProjection(m,promoted)};}
function promotedPair(row,promoted){const candidates={};for(const x of promoted)candidates[x.candidateId]=row.candidates[x.candidateId];return{pairId:row.pairId,candidates};}
function staticIndependence(){const files={ps2:"tools/experiments/lib/sfcdf-stage2-production.js",is2:"tools/experiments/lib/sfcdf-stage2-independent.js",ps1:"tools/experiments/lib/sfcdf-stage1-production.js",is1:"tools/experiments/lib/sfcdf-stage1-independent.js",pe:"tools/experiments/lib/sfcdf-production.js",ie:"tools/experiments/lib/sfcdf-independent.js"};const x={};for(const[k,f]of Object.entries(files))x[k]=fs.readFileSync(path.join(ROOT,f),"utf8");return !x.ps2.includes("sfcdf-stage2-independent")&&!x.is2.includes("sfcdf-stage2-production")&&!x.ps1.includes("sfcdf-stage1-independent")&&!x.is1.includes("sfcdf-stage1-production")&&!x.pe.includes("sfcdf-independent")&&!x.ie.includes("sfcdf-production")&&x.ps2.includes("sfcdf-stage1-production")&&x.is2.includes("sfcdf-stage1-independent")&&x.ps2.includes("sfcdf-production")&&x.is2.includes("sfcdf-independent")&&sha256(x.ps2)!==sha256(x.is2)&&sha256(x.pe)!==sha256(x.ie);}
function writeJson(f,x){fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(x,null,2)+"\n");}
function currentHead(){return cp.execFileSync("git",["rev-parse","HEAD"],{cwd:ROOT,encoding:"utf8"}).trim();}

function preflight(){
  for(const f of[SPEC_PATH,UPSTREAM_FIREWALL_PATH,FORMAL_INPUT_PATH,AUTH_PATH,LEASE_PATH,STAGE1_PATH])need(fs.existsSync(f),`required file missing ${path.relative(ROOT,f)}`);
  need(!fs.existsSync(RESULT_PATH),"Stage 2 scientific result already exists; rerun prohibited");
  need(process.env.SFCDF_EXECUTION_LEASE_CONFIRMED==="true","execution lease environment not confirmed");
  const spec=readJson(SPEC_PATH),fw=readJson(UPSTREAM_FIREWALL_PATH),formalInput=readJson(FORMAL_INPUT_PATH),auth=readJson(AUTH_PATH),lease=readJson(LEASE_PATH),stage1=readJson(STAGE1_PATH);
  const stage=spec.stages.find(x=>x.stageId===STAGE_ID);
  need(spec.studyId==="SFCDF-STUDY1"&&stage&&stage.evidenceClass==="FRESH-FORMAL-HELDOUT"&&stage.targetPairs===18,"Stage 2 spec mismatch");
  need(stage1.stageDisposition==="STAGE1-PASS"&&stage1.stage2AuthorizationEligible===true,"Stage 1 does not authorize formal preparation");
  need(canonicalEqual(stage1.promotedCandidates,formalInput.promotedCandidates)&&canonicalEqual(formalInput.promotedCandidates,P.EXPECTED_PROMOTED)&&canonicalEqual(P.EXPECTED_PROMOTED,I.EXPECTED_PROMOTED),"formal promoted set mismatch");
  need(auth.studyId===spec.studyId&&auth.stageId===STAGE_ID&&auth.authorizationDecision==="STAGE2-AUTHORIZED"&&auth.maxScientificExecutions===1,"Stage 2 authorization invalid");
  need(lease.studyId===spec.studyId&&lease.stageId===STAGE_ID,"lease identity mismatch");
  need(String(lease.workflowRunId)===String(process.env.GITHUB_RUN_ID),"lease workflow run mismatch");
  need(lease.authorizationNonce===auth.authorizationNonce,"lease nonce mismatch");
  need(lease.authorizedScientificContentHead===auth.authorizedScientificContentHead,"lease baseline mismatch");
  need(process.env.SFCDF_LEASE_COMMIT_SHA&&process.env.SFCDF_LEASE_COMMIT_SHA===currentHead(),"scientific checkout is not durable lease commit");
  need(fw.scientificOutcomeFieldsRetained===false&&fw.g303ScientificOutcomesRetained===false,"upstream firewall not identity-only");
  need(formalInput.freshStage2ScientificEvidenceGenerated===false&&formalInput.stage2SeedAccess===false&&formalInput.protectedDepth10Access===false,"formal input boundary violated");
  need(spec.protectedEvidence.standardInitialRawRootCompleteExactDepth10Holdout==="SEALED / NOT GENERATED / NOT READ","protected depth10 contract changed");
  verifyBlobBindings(auth);
  return{spec,fw,formalInput,auth,lease,stage,stage1};
}

function execute(ctx){
  const{spec,fw,formalInput,auth,stage}=ctx;
  const promoted=formalInput.promotedCandidates;
  const S={seedStart:stage.seedStart,seedEnd:stage.seedEnd,targetPairs:stage.targetPairs,maxSourcePly:spec.trajectoryPolicy.maxSourcePly,namuaPly:24,mtajiMinPly:44};
  const rootCeil=spec.resourceCeilings.perRoot,stageCeil=spec.resourceCeilings.stage2;
  freshAccessStarted=true;
  const stageStart=process.hrtime.bigint();
  const ps=P.selectPairedRoots(E,S,fw,formalInput),is=I.selectPairedRoots(E,S,fw,formalInput);
  const pSources=pairSources(ps),iSources=pairSources(is);
  const sourceIdentityExact=canonicalEqual(pSources,iSources)&&canonicalEqual(ps.rejections,is.rejections)&&ps.firewallDigestSha256===is.firewallDigestSha256&&canonicalEqual(ps.firewallCounts,is.firewallCounts);
  const rootChecks=[],telemetryRows=[],pRoots=[],iRoots=[],pPairs=[],iPairs=[];
  const n=Math.min(ps.pairs.length,is.pairs.length);
  for(let idx=0;idx<n;idx++){
    const pp=ps.pairs[idx],ip=is.pairs[idx],pm={},im={};
    for(const phase of["namua","mtaji"]){
      const pt=timed(()=>P.measureRoot(E,pp[phase])),it=timed(()=>I.measureRoot(E,ip[phase]));pm[phase]=pt.value;im[phase]=it.value;
      const pSci=scientificRow(pp.pairId,phase,pt.value,promoted),iSci=scientificRow(ip.pairId,phase,it.value,promoted);
      const pHash=P.digest(P.canonical(pSci)),iHash=I.digest(I.canonical(iSci));
      const familyExact={};for(const f of spec.eligibleMeasurementFamilies)familyExact[f]=pt.value.upstreamFamilyCoreSha256[f]===it.value.upstreamFamilyCoreSha256[f];
      rootChecks.push({pairId:pp.pairId,phase,sourceCanonicalExact:canonicalEqual(pt.value.source,it.value.source),upstreamReconstructionExact:pt.value.upstreamRootReconstructionCoreSha256===it.value.upstreamRootReconstructionCoreSha256,familyExact,canonicalScientificContentExact:pHash===iHash&&canonicalEqual(pSci,iSci),productionScientificSha256:pHash,independentScientificSha256:iHash,resourceViewExact:canonicalEqual(pt.value.resourceView,it.value.resourceView)});
      telemetryRows.push({pairId:pp.pairId,phase,source:sourceOnly(pt.value.source),production:resource(pt.value,pt,rootCeil),independent:resource(it.value,it,rootCeil)});
      pRoots.push(pSci);iRoots.push(iSci);
    }
    pPairs.push(promotedPair(P.comparePair(pp.pairId,pm.namua,pm.mtaji),promoted));
    iPairs.push(promotedPair(I.comparePair(ip.pairId,im.namua,im.mtaji),promoted));
  }
  const pFormal=P.validateFormal(pPairs,promoted,stage.targetPairs),iFormal=I.validateFormal(iPairs,promoted,stage.targetPairs);
  const pairComparisonExact=canonicalEqual(pPairs,iPairs)&&P.digest(P.canonical(pPairs))===I.digest(I.canonical(iPairs));
  const formalValidationExact=canonicalEqual(pFormal,iFormal)&&P.digest(P.canonical(pFormal))===I.digest(I.canonical(iFormal));
  const allRootExact=rootChecks.length===stage.targetPairs*2&&rootChecks.every(x=>x.sourceCanonicalExact&&x.upstreamReconstructionExact&&x.canonicalScientificContentExact&&x.resourceViewExact&&spec.eligibleMeasurementFamilies.every(f=>x.familyExact[f]));
  const populationComplete=ps.populationComplete&&is.populationComplete&&ps.selectedPairCount===stage.targetPairs&&is.selectedPairCount===stage.targetPairs;
  const rootResourcePass=telemetryRows.length===stage.targetPairs*2&&telemetryRows.every(x=>x.production.within&&x.independent.within);
  const independencePass=staticIndependence();
  const pCore={schemaVersion:1,studyId:spec.studyId,stageId:STAGE_ID,evidenceClass:"FRESH-FORMAL-HELDOUT",promotedCandidates:promoted,pairedSources:pSources,rootScientificRows:pRoots,pairComparisons:pPairs,formalValidation:pFormal};
  const iCore={schemaVersion:1,studyId:spec.studyId,stageId:STAGE_ID,evidenceClass:"FRESH-FORMAL-HELDOUT",promotedCandidates:promoted,pairedSources:iSources,rootScientificRows:iRoots,pairComparisons:iPairs,formalValidation:iFormal};
  const pStageHash=P.digest(P.canonical(pCore)),iStageHash=I.digest(I.canonical(iCore));
  const stageScientificExact=pStageHash===iStageHash&&canonicalEqual(pCore,iCore);
  const integrityPass=sourceIdentityExact&&independencePass&&allRootExact&&pairComparisonExact&&formalValidationExact&&stageScientificExact;
  const stageElapsedMs=Number(process.hrtime.bigint()-stageStart)/1e6;
  let stageResourcePass=rootResourcePass&&stageElapsedMs<=stageCeil.totalElapsedMs;
  const candidateDecisions=pFormal.candidates.map(x=>({candidateId:x.candidateId,frozenDirection:x.frozenDirection,formalLabel:x.confirmed?"CONFIRMED":"NOT-CONFIRMED",comparable:x.comparable,positive:x.positive,negative:x.negative,zero:x.zero,nonZero:x.nonZero,observedDirection:x.observedDirection,coveragePass:x.coveragePass,nonZeroPass:x.nonZeroPass,directionPass:x.directionPass,rawP:x.rawP,holmRank:x.holmRank,holmThreshold:x.holmThreshold,holmPass:x.holmPass}));
  const base={schemaVersion:1,studyId:spec.studyId,stageId:STAGE_ID,evidenceClass:"FRESH-FORMAL-HELDOUT",authorizedScientificExecutions:1,executionLease:{workflowRunId:Number(process.env.GITHUB_RUN_ID),authorizationNonce:auth.authorizationNonce,authorizedScientificContentHead:auth.authorizedScientificContentHead,leaseCommitSha:process.env.SFCDF_LEASE_COMMIT_SHA},seedBlock:`${stage.seedStart}..${stage.seedEnd}`,seedBlockConsumed:true,noRescueBoundaryCrossed:true,formalInput:{path:"doc/structural-forcing-corridor-decision-funnel/prereg/STAGE_2_FORMAL_INPUT.json",gitBlobSha:gitBlobSha(fs.readFileSync(FORMAL_INPUT_PATH,"utf8")),stage1IdentityCoreSha256:formalInput.stage1IdentityCoreSha256,promotedCandidates:promoted},sourceSelection:{production:{populationComplete:ps.populationComplete,selectedPairCount:ps.selectedPairCount,rejections:ps.rejections,pairs:pSources,firewallDigestSha256:ps.firewallDigestSha256,firewallCounts:ps.firewallCounts},independent:{populationComplete:is.populationComplete,selectedPairCount:is.selectedPairCount,rejections:is.rejections,pairs:iSources,firewallDigestSha256:is.firewallDigestSha256,firewallCounts:is.firewallCounts}},verification:{sourceIdentityExact,staticIndependence:independencePass,allRootExact,pairComparisonExact,formalValidationExact,stageScientificExact,rootChecks},productionStageScientificCoreSha256:pStageHash,independentStageScientificCoreSha256:iStageHash,formalValidation:pFormal,candidateDecisions};
  const telemetry={schemaVersion:1,studyId:spec.studyId,stageId:STAGE_ID,workflowRunId:Number(process.env.GITHUB_RUN_ID),stageElapsedMs,peakRssBytes:maxRssBytes(),rootRows:telemetryRows};
  let result;
  for(let pass=0;pass<3;pass++){
    let disposition;if(!integrityPass)disposition="TECHNICAL-INVALID";else if(!populationComplete||!stageResourcePass)disposition="NON-ESTIMABLE";else disposition="STAGE2-PASS";
    result={...base,resourceStatus:{rootResourcePass,stageResourcePass},stageDisposition:disposition,formalInferenceValid:disposition==="STAGE2-PASS"};
    const totalArtifactBytes=Buffer.byteLength(JSON.stringify(result),"utf8")+Buffer.byteLength(JSON.stringify(telemetry),"utf8");
    telemetry.totalCanonicalArtifactBytes=totalArtifactBytes;
    const next=rootResourcePass&&stageElapsedMs<=stageCeil.totalElapsedMs&&totalArtifactBytes<=stageCeil.totalArtifactBytes;if(next===stageResourcePass)break;stageResourcePass=next;
  }
  const summary={studyId:spec.studyId,stageId:STAGE_ID,workflowRunId:Number(process.env.GITHUB_RUN_ID),stageDisposition:result.stageDisposition,selectedPairCount:ps.selectedPairCount,candidateDecisions:result.candidateDecisions,confirmedCandidates:pFormal.confirmedCandidates,productionStageScientificCoreSha256:pStageHash,independentStageScientificCoreSha256:iStageHash,freshScientificEvidenceGenerated:true,seedBlockConsumed:true,noRescueBoundaryCrossed:true,protectedDepth10Access:false};
  writeJson(RESULT_PATH,result);writeJson(TELEMETRY_PATH,telemetry);writeJson(SUMMARY_PATH,summary);
  console.log(`SFCDF_STAGE2_SUMMARY=${JSON.stringify(summary)}`);
  if(result.stageDisposition==="TECHNICAL-INVALID")process.exitCode=2;else if(result.stageDisposition==="NON-ESTIMABLE")process.exitCode=3;
}

try{execute(preflight());}catch(error){
  if(freshAccessStarted){
    const minimal={schemaVersion:1,studyId:"SFCDF-STUDY1",stageId:STAGE_ID,evidenceClass:"FRESH-FORMAL-HELDOUT",stageDisposition:"TECHNICAL-INVALID",seedBlockConsumed:true,noRescueBoundaryCrossed:true,freshScientificEvidenceMayHaveBeenAccessed:true,protectedDepth10Access:false,error:{name:error.name,message:error.message}};
    writeJson(RESULT_PATH,minimal);writeJson(TELEMETRY_PATH,{schemaVersion:1,studyId:"SFCDF-STUDY1",stageId:STAGE_ID,requiredTelemetryMissing:true});writeJson(SUMMARY_PATH,{studyId:"SFCDF-STUDY1",stageId:STAGE_ID,stageDisposition:"TECHNICAL-INVALID",seedBlockConsumed:true,noRescueBoundaryCrossed:true,protectedDepth10Access:false,error:error.message});
    console.error(error.stack||error);process.exitCode=2;
  }else{console.error(error.stack||error);process.exitCode=1;}
}
