#!/usr/bin/env node
"use strict";

const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const E=require("../../public/engine.js");
const P=require("./lib/bect-stage1-production.js");
const I=require("./lib/bect-stage1-independent.js");
const PB=require("./lib/bect-production.js");
const IB=require("./lib/bect-independent.js");

const ROOT=path.resolve(__dirname,"../..");
const DOC=path.join(ROOT,"doc/branch-expansion-compression-transition");
const SPEC_PATH=path.join(DOC,"prereg/STUDY_1_SPEC.json");
const CLAR2_PATH=path.join(DOC,"prereg/STUDY_1_SPEC_CLARIFICATION_2.json");
const FW_PATH=path.join(DOC,"prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const AUTH_PATH=path.join(DOC,"authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json");
const STAGE0_PATH=path.join(DOC,"results/stage-0-v2/STAGE_0_TECHNICAL_RESULT.json");
const OUT=path.join(DOC,"results/stage-1");
const RESULT_PATH=path.join(OUT,"scientific-result.json");
const TELEMETRY_PATH=path.join(OUT,"telemetry.json");
const SUMMARY_PATH=path.join(OUT,"execution-summary.json");
const STAGE_ID="BECT-S1-DEVELOPMENT-2026-09-02-v1";
let freshAccessStarted=false;

function need(x,m){if(!x)throw new Error(m);}
function readJson(p){return JSON.parse(fs.readFileSync(p,"utf8"));}
function canon(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return`[${v.map(canon).join(",")}]`;return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`;}
function sha256(s){return crypto.createHash("sha256").update(s,"utf8").digest("hex");}
function canonicalHash(v){return sha256(canon(v));}
function canonicalEqual(a,b){return canon(a)===canon(b);}
function maxRssBytes(){return process.resourceUsage().maxRSS*1024;}
function byteLength(v){return Buffer.byteLength(canon(v),"utf8");}
function elapsedMs(start){return Number(process.hrtime.bigint()-start)/1e6;}
function publicTrajectory(t){return{trajectoryId:t.trajectoryId,sourceSeed:t.sourceSeed,fullSourceTrajectorySha256:t.fullSourceTrajectorySha256,openingPrefixSha256:t.openingPrefixSha256,trajectorySegmentSha256:t.trajectorySegmentSha256,adjacentRootPairSha256:t.adjacentRootPairSha256,eventWindowSha256:t.eventWindowSha256,roots:t.roots.map(r=>({phase:r.phase,sourceSeed:r.sourceSeed,selectedPly:r.selectedPly,rootRawSha256:r.rootRawSha256,sourceTrajectorySha256:r.sourceTrajectorySha256,openingPrefixSha256:r.openingPrefixSha256,openingPrefixLength:r.openingPrefixLength}))};}
function selectionCore(sel){return{populationComplete:sel.populationComplete,selectedTrajectoryCount:sel.selectedTrajectoryCount,selectedRootCount:sel.selectedRootCount,firewallIdentityCoreSha256:sel.firewallIdentityCoreSha256,trajectories:sel.trajectories.map(publicTrajectory)};}
function assemble(base,t,roots){const series=roots.map(r=>({ply:r.source.selectedPly,phase:r.source.phase,rootRawSha256:r.source.rootRawSha256,levels:r.bect.levels}));const classified=base.classifySeries(series),balances=[];for(const id of base.METRICS)for(const d of ["UP","DOWN"])balances.push(base.eventBalance(classified,id,d));return{trajectoryId:t.trajectoryId,sourceSeed:t.sourceSeed,fullSourceTrajectorySha256:t.fullSourceTrajectorySha256,openingPrefixSha256:t.openingPrefixSha256,trajectorySegmentSha256:t.trajectorySegmentSha256,adjacentRootPairSha256:t.adjacentRootPairSha256,eventWindowSha256:t.eventWindowSha256,roots,series,classified,balances};}
function rootScientificView(r){return{source:r.source,upstreamRootReconstructionCoreSha256:r.upstreamRootReconstructionCoreSha256,upstreamFamilyCoreSha256:r.upstreamFamilyCoreSha256,bect:r.bect};}
function trajectoryScientificView(t){return{trajectoryId:t.trajectoryId,sourceSeed:t.sourceSeed,fullSourceTrajectorySha256:t.fullSourceTrajectorySha256,openingPrefixSha256:t.openingPrefixSha256,trajectorySegmentSha256:t.trajectorySegmentSha256,adjacentRootPairSha256:t.adjacentRootPairSha256,eventWindowSha256:t.eventWindowSha256,roots:t.roots.map(rootScientificView),series:t.series,classified:t.classified,balances:t.balances};}
function structuralResourcePass(r,c){return BigInt(r.uniqueRawStates)<=BigInt(c.uniqueRawStates)&&BigInt(r.uniqueTransitions)<=BigInt(c.uniqueTransitions)&&BigInt(r.parentExpansions)<=BigInt(c.parentExpansions)&&BigInt(r.legalMoveEvaluations)<=BigInt(c.legalMoveEvaluations)&&BigInt(r.treeNodeOccurrencesSummedAcrossLayers)<=BigInt(c.treeNodeOccurrencesSummedAcrossLayers);}
function writeAll(result,telemetry,summary){fs.mkdirSync(OUT,{recursive:true});fs.writeFileSync(RESULT_PATH,JSON.stringify(result,null,2)+"\n");fs.writeFileSync(TELEMETRY_PATH,JSON.stringify(telemetry,null,2)+"\n");fs.writeFileSync(SUMMARY_PATH,JSON.stringify(summary,null,2)+"\n");}

const spec=readJson(SPEC_PATH),clar2=readJson(CLAR2_PATH),fw=readJson(FW_PATH),auth=readJson(AUTH_PATH),s0=readJson(STAGE0_PATH);
need(spec.studyId==="BECT-STUDY1"&&spec.stages[1].stageId===STAGE_ID,"Stage 1 spec mismatch");
need(clar2.freshScientificEvidenceGeneratedBeforeClarification===false&&clar2.stage1SeedAccessBeforeClarification===false,"clarification chronology invalid");
need(fw.scientificOutcomeFieldsRetained===false&&fw.g303DiagnosticScientificFieldsRetained===false&&fw.g304ScientificOutcomeFieldsRetained===false,"identity firewall invalid");
need(s0.stageDisposition==="STAGE0-PASS"&&s0.stageId==="BECT-S0-TECHNICAL-2026-09-02-v2","Stage 0 PASS required");
need(auth.studyId==="BECT-STUDY1"&&auth.stageId===STAGE_ID&&auth.decision==="STAGE1-AUTHORIZED","Stage 1 authorization missing");
need(auth.maxScientificExecutions===1,"authorization execution count invalid");
need(auth.seedStart===31510001&&auth.seedEnd===31510240,"authorization seed block mismatch");
need(process.env.BECT_AUTHORIZATION_NONCE===auth.authorizationNonce,"authorization nonce environment mismatch");
need(process.env.BECT_LEASE_COMMIT_SHA,"durable lease commit missing");
need(String(process.env.GITHUB_RUN_ID||"")!=="","workflow run id missing");

const S={seedStart:31510001,seedEnd:31510240,targetTrajectories:10,maxSourcePly:80,analysisRootPlyStart:16,analysisRootPlyEnd:63};
const rootCeil=spec.resourceCeilings.perRoot,stageCeil=spec.resourceCeilings.stage1;
const stageStart=process.hrtime.bigint();
const telemetry={schemaVersion:1,studyId:"BECT-STUDY1",stageId:STAGE_ID,workflowRunId:Number(process.env.GITHUB_RUN_ID),leaseCommitSha:process.env.BECT_LEASE_COMMIT_SHA,rootTelemetry:[],freshAccessStarted:false};
let result,summary,exitCode=0;
try{
  freshAccessStarted=true;telemetry.freshAccessStarted=true;
  const ps=P.selectTrajectories(E,S,fw),is=I.selectTrajectories(E,S,fw);
  const pSelCore=selectionCore(ps),iSelCore=selectionCore(is);
  const sourceIdentityExact=canonicalEqual(pSelCore,iSelCore);
  if(!sourceIdentityExact)throw new Error("production/independent source selection identity mismatch");
  const pRecords=[],iRecords=[];let allRootExact=true,allResourcePass=true;
  if(ps.populationComplete&&is.populationComplete){
    for(let ti=0;ti<ps.trajectories.length;ti++){
      const pt=ps.trajectories[ti],it=is.trajectories[ti],pr=[],ir=[];
      for(let ri=0;ri<pt.roots.length;ri++){
        const pStart=process.hrtime.bigint();const pm=P.measureRoot(E,pt.roots[ri]);const pMs=elapsedMs(pStart);const pRss=maxRssBytes();
        const iStart=process.hrtime.bigint();const im=I.measureRoot(E,it.roots[ri]);const iMs=elapsedMs(iStart);const iRss=maxRssBytes();
        const pView=rootScientificView(pm),iView=rootScientificView(im),exact=canonicalEqual(pView,iView);
        if(!exact)allRootExact=false;
        const structuralP=structuralResourcePass(pm.resourceCounts,rootCeil),structuralI=structuralResourcePass(im.resourceCounts,rootCeil);
        const pBytes=byteLength(pView),iBytes=byteLength(iView);
        const resourcePass=structuralP&&structuralI&&pMs<=rootCeil.elapsedMs&&iMs<=rootCeil.elapsedMs&&pRss<=rootCeil.peakRssBytes&&iRss<=rootCeil.peakRssBytes&&pBytes<=rootCeil.rootArtifactBytes&&iBytes<=rootCeil.rootArtifactBytes;
        if(!resourcePass)allResourcePass=false;
        telemetry.rootTelemetry.push({trajectoryIndex:ti,rootIndex:ri,ply:pm.source.selectedPly,rootRawSha256:pm.source.rootRawSha256,production:{elapsedMs:pMs,peakRssBytes:pRss,artifactBytes:pBytes,resourceCounts:pm.resourceCounts},independent:{elapsedMs:iMs,peakRssBytes:iRss,artifactBytes:iBytes,resourceCounts:im.resourceCounts},scientificExact:exact,resourcePass});
        pr.push(pm);ir.push(im);
      }
      pRecords.push(assemble(PB,pt,pr));iRecords.push(assemble(IB,it,ir));
    }
  }
  const pDev=P.summarizeDevelopment(pRecords,10),iDev=I.summarizeDevelopment(iRecords,10);
  const developmentExact=canonicalEqual(pDev,iDev);
  const pTraj=pRecords.map(trajectoryScientificView),iTraj=iRecords.map(trajectoryScientificView),trajectoryScientificExact=canonicalEqual(pTraj,iTraj);
  const stageElapsedMs=elapsedMs(stageStart);
  const preCore={schemaVersion:1,studyId:"BECT-STUDY1",stageId:STAGE_ID,evidenceClass:"FRESH-DEVELOPMENT",seedBlock:"31510001..31510240",population:pSelCore,trajectories:pTraj,development:pDev};
  const coreBytes=byteLength(preCore);
  const stageResourcePass=allResourcePass&&pSelCore.selectedRootCount<=stageCeil.maxRoots&&stageElapsedMs<=stageCeil.elapsedMs&&coreBytes<=stageCeil.artifactBytes;
  let stageDisposition="STAGE1-PASS";
  if(!sourceIdentityExact||!allRootExact||!trajectoryScientificExact||!developmentExact)stageDisposition="TECHNICAL-INVALID";
  else if(!ps.populationComplete||!stageResourcePass)stageDisposition="NON-ESTIMABLE";
  const scientificCore={...preCore,integrity:{sourceIdentityExact,allRootExact,trajectoryScientificExact,developmentExact},resource:{stageResourcePass}};
  result={...scientificCore,authorizedScientificExecutions:1,actualScientificExecutions:1,authorizationNonce:auth.authorizationNonce,leaseCommitSha:process.env.BECT_LEASE_COMMIT_SHA,noRescueBoundaryCrossed:true,seedBlockConsumed:true,productionStageScientificCoreSha256:canonicalHash(scientificCore),independentStageScientificCoreSha256:canonicalHash({...preCore,trajectories:iTraj,development:iDev,integrity:{sourceIdentityExact,allRootExact,trajectoryScientificExact,developmentExact},resource:{stageResourcePass}}),stageDisposition};
  telemetry.stageElapsedMs=stageElapsedMs;telemetry.stageScientificCoreBytes=coreBytes;telemetry.populationRejectionsProduction=ps.rejections;telemetry.populationRejectionsIndependent=is.rejections;telemetry.allRootExact=allRootExact;telemetry.trajectoryScientificExact=trajectoryScientificExact;telemetry.developmentExact=developmentExact;telemetry.stageResourcePass=stageResourcePass;
  summary={schemaVersion:1,studyId:"BECT-STUDY1",stageId:STAGE_ID,stageDisposition,workflowRunId:Number(process.env.GITHUB_RUN_ID),leaseCommitSha:process.env.BECT_LEASE_COMMIT_SHA,selectedTrajectoryCount:pSelCore.selectedTrajectoryCount,selectedRootCount:pSelCore.selectedRootCount,populationComplete:ps.populationComplete,sourceIdentityExact,allRootExact,trajectoryScientificExact,developmentExact,stageResourcePass,promotedCandidates:pDev.promotedCandidates,protectedDepth10Access:false,stage2SeedAccess:false};
  if(stageDisposition!=="STAGE1-PASS")exitCode=2;
}catch(e){
  const stageElapsedMs=elapsedMs(stageStart);
  result={schemaVersion:1,studyId:"BECT-STUDY1",stageId:STAGE_ID,evidenceClass:"FRESH-DEVELOPMENT",authorizedScientificExecutions:1,actualScientificExecutions:1,authorizationNonce:auth.authorizationNonce,leaseCommitSha:process.env.BECT_LEASE_COMMIT_SHA,noRescueBoundaryCrossed:freshAccessStarted,seedBlockConsumed:freshAccessStarted,stageDisposition:"TECHNICAL-INVALID",technicalError:{name:e.name,message:e.message}};
  telemetry.stageElapsedMs=stageElapsedMs;telemetry.technicalError={name:e.name,message:e.message};
  summary={schemaVersion:1,studyId:"BECT-STUDY1",stageId:STAGE_ID,stageDisposition:"TECHNICAL-INVALID",workflowRunId:Number(process.env.GITHUB_RUN_ID),leaseCommitSha:process.env.BECT_LEASE_COMMIT_SHA,freshAccessStarted,protectedDepth10Access:false,stage2SeedAccess:false,error:e.message};
  exitCode=2;
}
writeAll(result,telemetry,summary);
console.log(`BECT_STAGE1_SUMMARY=${JSON.stringify(summary)}`);
process.exit(exitCode);
