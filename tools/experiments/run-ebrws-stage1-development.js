#!/usr/bin/env node
"use strict";

const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),util=require("node:util");
const E=require("../../public/engine.js");
const P=require("./lib/ebrws-stage1-production.js");
const I=require("./lib/ebrws-stage1-independent.js");

const ROOT=path.resolve(__dirname,"../..");
const DOC=path.join(ROOT,"doc/effective-branching-reply-width-structure");
const OUT=path.join(DOC,"results/stage-1");
const SPEC=JSON.parse(fs.readFileSync(path.join(DOC,"prereg/STUDY_1_SPEC.json"),"utf8"));
const STAGE="EBRWS-S1-DEVELOPMENT-2026-09-01-v1";
const AUTH=path.join(DOC,"authorizations/2026-09-01-stage-1-development-authorization.md");
const TRIGGER=path.join(DOC,"authorizations/2026-09-01-stage-1-execution-trigger.md");
const RESULT=path.join(OUT,"scientific-result.json");

function ensure(x,m){if(!x)throw new Error(m);}
function hashText(t){return crypto.createHash("sha256").update(t,"utf8").digest("hex");}
function maxRss(){return process.resourceUsage().maxRSS*1024;}
function sourceOnly(r){return{phase:r.phase,sourceSeed:r.sourceSeed,selectedPly:r.selectedPly,rootRawSha256:r.rootRawSha256,sourceTrajectorySha256:r.sourceTrajectorySha256,openingPrefixSha256:r.openingPrefixSha256,openingPrefixLength:r.openingPrefixLength};}
function timed(fn){const t=process.hrtime.bigint(),value=fn();return{value,elapsedMs:Number(process.hrtime.bigint()-t)/1e6,peakRssBytes:maxRss(),artifactBytes:Buffer.byteLength(JSON.stringify(value))};}
function resource(record,t,ceil){
  const f1=record.instrument.families["LGTGMIV-F1-TREE-OCCURRENCE"];
  const f2=record.instrument.families["LGTGMIV-F2-RAW-GRAPH"];
  const uniqueRawStates=f2.cumulative.distinctRawStates;
  const uniqueTransitions=f2.parentLayers.reduce((a,x)=>a+x.uniqueTransitionCount,0);
  const parentExpansions=f2.layers.slice(0,-1).reduce((a,x)=>a+x.uniqueRawStateCount,0);
  const treeNodeOccurrences=f1.layers.reduce((a,x)=>a+BigInt(x.treeNodeOccurrences),0n);
  const within=uniqueRawStates<=ceil.uniqueRawStates&&uniqueTransitions<=ceil.uniqueTransitions&&parentExpansions<=ceil.parentExpansions&&uniqueTransitions<=ceil.legalMoveEvaluations&&treeNodeOccurrences<=BigInt(ceil.treeNodeOccurrencesSummedAcrossLayers)&&t.elapsedMs<=ceil.elapsedMs&&t.peakRssBytes<=ceil.peakRssBytes&&t.artifactBytes<=ceil.rootArtifactBytes;
  return{uniqueRawStates,uniqueTransitions,parentExpansions,legalMoveEvaluations:uniqueTransitions,treeNodeOccurrences:String(treeNodeOccurrences),elapsedMs:t.elapsedMs,peakRssBytes:t.peakRssBytes,artifactBytes:t.artifactBytes,within};
}
function compactRoot(r){return{source:r.source,instrument:{rootReconstructionCoreSha256:r.instrument.rootReconstructionCoreSha256,rootFamilyCoreSha256:r.instrument.rootFamilyCoreSha256,families:r.instrument.families},endpoint:r.endpoint};}
function independentCompact(r){return{source:r.source,instrument:{rootReconstructionCoreSha256:r.instrument.rootReconstructionCoreSha256,rootFamilyCoreSha256:r.instrument.rootFamilyCoreSha256},endpoint:r.endpoint};}

ensure(SPEC.studyId==="EBRWS-STUDY1","study spec mismatch");
const stageSpec=SPEC.stages.find(x=>x.stageId===STAGE);ensure(stageSpec,"Stage 1 spec missing");
ensure(fs.existsSync(AUTH),"Stage 1 authorization missing");
ensure(fs.existsSync(TRIGGER),"one-shot execution trigger missing");
ensure(fs.existsSync(path.join(DOC,"results/stage-0/technical-validation.json")),"Stage 0 result missing");
ensure(JSON.parse(fs.readFileSync(path.join(DOC,"results/stage-0/technical-validation.json"),"utf8")).formalStageDisposition==="STAGE0-PASS","Stage 0 not PASS");
ensure(!fs.existsSync(RESULT),"Stage 1 result already exists; rerun prohibited");
ensure(SPEC.protectedEvidence.standardInitialRawRootCompleteExactDepth10==="SEALED / NOT GENERATED / NOT READ","protected holdout contract mismatch");

const S={seedStart:stageSpec.seedStart,seedEnd:stageSpec.seedEnd,maxSourcePly:SPEC.trajectoryPolicy.maxSourcePly,namuaPly:24,namuaCount:stageSpec.targetRoots.namua,mtajiMinPly:44,mtajiCount:stageSpec.targetRoots.mtaji,depth:SPEC.relativeLocalHorizon};
const ceil=SPEC.resourceCeilings.perRoot,stageCeil=SPEC.resourceCeilings.stage1;
const deep=util.isDeepStrictEqual;
const prodSrc=fs.readFileSync(path.join(__dirname,"lib/ebrws-stage1-production.js"),"utf8");
const indSrc=fs.readFileSync(path.join(__dirname,"lib/ebrws-stage1-independent.js"),"utf8");
const staticIndependence=!prodSrc.includes("ebrws-stage1-independent")&&!indSrc.includes("ebrws-stage1-production")&&prodSrc.includes("ebrws-stage0-production")&&indSrc.includes("ebrws-stage0-independent")&&prodSrc.includes("lgtgmiv-stage1-production")&&indSrc.includes("lgtgmiv-stage1-independent")&&hashText(prodSrc)!==hashText(indSrc);

const started=process.hrtime.bigint();
const psel=P.selectRoots(E,S),isel=I.selectRoots(E,S);
const pSources=psel.roots.map(sourceOnly),iSources=isel.roots.map(sourceOnly);
const sourceIdentityExact=deep(pSources,iSources)&&deep(psel.rejections,isel.rejections)&&deep(psel.firewall,isel.firewall);

const prod=[],ind=[],rootChecks=[],rootTelemetry=[];
const n=Math.min(psel.roots.length,isel.roots.length);
for(let idx=0;idx<n;idx++){
  const pt=timed(()=>P.measureRoot(E,psel.roots[idx],S.depth));
  const it=timed(()=>I.measureRoot(E,isel.roots[idx],S.depth));
  const p=pt.value,i=it.value;
  const reconstructionExact=p.instrument.rootReconstructionCoreSha256===i.instrument.rootReconstructionCoreSha256;
  const familyExact={};
  for(const f of SPEC.eligibleMeasurementFamilies)familyExact[f]=p.instrument.rootFamilyCoreSha256[f]===i.instrument.rootFamilyCoreSha256[f]&&deep(p.instrument.families[f],i.instrument.families[f]);
  const endpointExact=p.endpoint.endpointSha256===i.endpoint.endpointSha256&&deep(p.endpoint,i.endpoint);
  prod.push(p);ind.push(i);
  rootChecks.push({source:p.source,reconstructionExact,familyExact,endpointExact});
  rootTelemetry.push({source:p.source,production:resource(p,pt,ceil),independent:resource(i,it,ceil)});
}

const pc=P.candidateSet(prod),ic=I.candidateSet(ind);
const candidateSetExact=pc.candidateSetSha256===ic.candidateSetSha256&&deep(pc,ic);
const candidateOrderInvariant=P.candidateSet(prod.slice().reverse()).candidateSetSha256===pc.candidateSetSha256&&I.candidateSet(ind.slice().reverse()).candidateSetSha256===ic.candidateSetSha256;
const pCore={schemaVersion:1,studyId:"EBRWS-STUDY1",stageId:STAGE,rootEndpointDigests:prod.map(r=>({source:r.source,endpointSha256:r.endpoint.endpointSha256})),candidateSetSha256:pc.candidateSetSha256,promotedCandidates:pc.candidates};
const iCore={schemaVersion:1,studyId:"EBRWS-STUDY1",stageId:STAGE,rootEndpointDigests:ind.map(r=>({source:r.source,endpointSha256:r.endpoint.endpointSha256})),candidateSetSha256:ic.candidateSetSha256,promotedCandidates:ic.candidates};
const pStageDigest=P.digest(P.canonical(pCore)),iStageDigest=I.digest(I.canonical(iCore));
const stageScientificExact=pStageDigest===iStageDigest&&deep(pCore,iCore);

const populationComplete=psel.populationComplete&&isel.populationComplete&&prod.length===24&&ind.length===24&&psel.selectedCounts.namua===12&&psel.selectedCounts.mtaji===12&&isel.selectedCounts.namua===12&&isel.selectedCounts.mtaji===12;
const allRootIntegrity=rootChecks.length===24&&rootChecks.every(x=>x.reconstructionExact&&x.endpointExact&&SPEC.eligibleMeasurementFamilies.every(f=>x.familyExact[f]));
const rootResourcePass=rootTelemetry.length===24&&rootTelemetry.every(x=>x.production.within&&x.independent.within);
const stageElapsedMs=Number(process.hrtime.bigint()-started)/1e6;
const protectedEvidenceSealed=true;
const integrityPass=populationComplete&&sourceIdentityExact&&allRootIntegrity&&candidateSetExact&&candidateOrderInvariant&&stageScientificExact&&staticIndependence&&protectedEvidenceSealed;

const productionRoots=prod.map(compactRoot),independentRoots=ind.map(independentCompact);
let telemetry={schemaVersion:1,studyId:"EBRWS-STUDY1",stageId:STAGE,scientificDigestExcluded:true,rootTelemetry,stageElapsedMs,stageArtifactBytes:0,stageResourceCeilings:stageCeil};
let stageResourcePass=rootResourcePass&&stageElapsedMs<=stageCeil.totalElapsedMs;
let finalSci="",finalTel="";
for(let pass=0;pass<3;pass++){
  const globalGatePass=integrityPass&&stageResourcePass;
  let disposition;if(!integrityPass)disposition="TECHNICAL-INVALID";else if(!stageResourcePass)disposition="NON-ESTIMABLE";else disposition="STAGE1-PASS";
  const scientific={
    schemaVersion:1,studyId:"EBRWS-STUDY1",stageId:STAGE,evidenceClass:"FRESH-DEVELOPMENT",
    seedConsumption:`${S.seedStart}..${S.seedEnd}`,noRescueBoundaryCrossed:true,
    sourceSelection:{production:{selectedCounts:psel.selectedCounts,rejections:psel.rejections,firewall:psel.firewall,roots:pSources},independent:{selectedCounts:isel.selectedCounts,rejections:isel.rejections,firewall:isel.firewall,roots:iSources},sourceIdentityExact},
    production:{roots:productionRoots,stageScientificCore:pCore,stageScientificCoreSha256:pStageDigest,candidateSet:pc},
    independent:{roots:independentRoots,stageScientificCore:iCore,stageScientificCoreSha256:iStageDigest,candidateSet:ic},
    verification:{populationComplete,sourceIdentityExact,allRootIntegrity,candidateSetExact,candidateOrderInvariant,stageScientificExact,staticIndependence,rootChecks,protectedEvidenceSealed},
    promotedCandidates:pc.candidates,
    stageResourcePass,globalGatePass,stageDisposition:disposition,
    stage2AuthorizationEligible:globalGatePass&&pc.candidates.length>0,
    stage1NoCandidateStop:globalGatePass&&pc.candidates.length===0,
    protectedStandardRootDepth10Generated:false,protectedStandardRootDepth10Read:false,stage2Executed:false
  };
  finalSci=JSON.stringify(scientific,null,2)+"\n";
  for(let z=0;z<4;z++){finalTel=JSON.stringify(telemetry,null,2)+"\n";telemetry.stageArtifactBytes=Buffer.byteLength(finalSci)+Buffer.byteLength(finalTel);}
  finalTel=JSON.stringify(telemetry,null,2)+"\n";
  const actual=rootResourcePass&&stageElapsedMs<=stageCeil.totalElapsedMs&&telemetry.stageArtifactBytes<=stageCeil.totalArtifactBytes;
  if(actual===stageResourcePass)break;stageResourcePass=actual;
}
const sciObj=JSON.parse(finalSci);
const summary={schemaVersion:1,studyId:"EBRWS-STUDY1",stageId:STAGE,stageDisposition:sciObj.stageDisposition,globalGatePass:sciObj.globalGatePass,selectedCounts:psel.selectedCounts,promotedCandidates:sciObj.promotedCandidates,stage2AuthorizationEligible:sciObj.stage2AuthorizationEligible,stage1NoCandidateStop:sciObj.stage1NoCandidateStop,productionStageScientificCoreSha256:pStageDigest,independentStageScientificCoreSha256:iStageDigest,candidateSetSha256:pc.candidateSetSha256,scientificResultFileSha256:hashText(finalSci),telemetryFileSha256:hashText(finalTel),freshScientificSeedAccessed:true,noRescueBoundaryCrossed:true,protectedStandardRootDepth10Generated:false,protectedStandardRootDepth10Read:false};

fs.mkdirSync(OUT,{recursive:true});
fs.writeFileSync(path.join(OUT,"scientific-result.json"),finalSci);
fs.writeFileSync(path.join(OUT,"telemetry.json"),finalTel);
fs.writeFileSync(path.join(OUT,"execution-summary.json"),JSON.stringify(summary,null,2)+"\n");
console.log("EBRWS_STAGE1_RESULT="+JSON.stringify(summary));
if(sciObj.stageDisposition==="TECHNICAL-INVALID")process.exitCode=2;
else if(sciObj.stageDisposition==="NON-ESTIMABLE")process.exitCode=3;
