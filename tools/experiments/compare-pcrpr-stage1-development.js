#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname,"../..");
const SPEC_PATH = path.join(ROOT,"doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
function ensure(ok,message){if(!ok)throw new Error(message);}
function arg(name){const at=process.argv.indexOf(name);return at>=0?process.argv[at+1]:null;}
function sha256(text){return crypto.createHash("sha256").update(Buffer.from(String(text),"utf8")).digest("hex");}
function cmp(a,b){return a<b?-1:a>b?1:0;}
function canonical(value){if(value===null||typeof value!=="object")return JSON.stringify(value);if(Array.isArray(value))return `[${value.map(canonical).join(",")}]`;const keys=Object.keys(value).sort(cmp);return `{${keys.map((key)=>`${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;}
function canonicalHash(value){return sha256(canonical(value));}
function writeJson(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n","utf8");}

function run(){
  const productionPath=arg("--production"),independentPath=arg("--independent"),gatePath=arg("--gate"),outPath=arg("--out");
  ensure(productionPath&&independentPath&&gatePath&&outPath,"--production --independent --gate --out required");
  const production=JSON.parse(fs.readFileSync(path.resolve(productionPath),"utf8"));
  const independent=JSON.parse(fs.readFileSync(path.resolve(independentPath),"utf8"));
  const gate=JSON.parse(fs.readFileSync(path.resolve(gatePath),"utf8"));
  const spec=JSON.parse(fs.readFileSync(SPEC_PATH,"utf8"));
  ensure(production.studyId===spec.studyId&&independent.studyId===spec.studyId,"study identity mismatch");
  ensure(production.stageId===spec.stageId&&independent.stageId===spec.stageId,"stage identity mismatch");
  ensure(gate.scientificStage1SeedBlockConsumed===true,"consume-once gate absent");
  const checks={
    sameWorkflowRun:String(production.workflowRunId)===String(independent.workflowRunId)&&String(production.workflowRunId)===String(gate.workflowRunId),
    sourceCorpusExact:production.hashes.sourceCorpusSha256===independent.hashes.sourceCorpusSha256,
    rootSelectionExact:production.hashes.selectionSha256===independent.hashes.selectionSha256,
    rowsExact:production.hashes.rowsSha256===independent.hashes.rowsSha256,
    measurementsExact:production.hashes.measurementsSha256===independent.hashes.measurementsSha256,
    compactRowsExact:production.hashes.compactRowsSha256===independent.hashes.compactRowsSha256&&canonicalHash(production.compactRows)===canonicalHash(independent.compactRows),
    developmentCoreExact:production.hashes.developmentCoreSha256===independent.hashes.developmentCoreSha256&&production.development.developmentCoreSha256===independent.development.developmentCoreSha256,
    modelExact:canonicalHash(production.development.model)===canonicalHash(independent.development.model),
    finalModelExact:canonicalHash(production.development.finalModel)===canonicalHash(independent.development.finalModel),
    readinessExact:canonicalHash(production.development.support)===canonicalHash(independent.development.support)&&canonicalHash(production.development.performance)===canonicalHash(independent.development.performance),
    productionAndIndependentDispositionMatch:production.development.productionDisposition===independent.development.productionDisposition,
    stage2StillUnauthorized:production.stage2ExecutionAuthorized===false&&independent.stage2ExecutionAuthorized===false
  };
  const technicalPass=Object.values(checks).every(Boolean);
  let finalDecision;
  if(!technicalPass)finalDecision=spec.developmentDecision.technicalIntegrityOrIndependentVerificationFailure;
  else if(production.development.productionDisposition==="STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE")finalDecision=spec.developmentDecision.populationRootOrTargetSupportInsufficient;
  else if(production.development.productionDisposition==="STAGE1-DEVELOPMENT-BLOCKED-ZERO-PROMOTION")finalDecision=spec.developmentDecision.modelPerformanceOrEnrichmentBelowGate;
  else if(production.development.productionDisposition==="STAGE1-DEVELOPMENT-PASS-PENDING-INDEPENDENT-VERIFICATION")finalDecision=spec.developmentDecision.allReadinessAndIndependentVerificationGatesPass;
  else throw new Error(`unknown production disposition ${production.development.productionDisposition}`);

  const result={
    schemaVersion:1,
    studyId:spec.studyId,
    stageId:spec.stageId,
    classification:"STAGE1-DEVELOPMENT-INDEPENDENT-FINAL-VERIFICATION",
    scientificInferenceAuthorized:false,
    confirmatoryReuseAllowed:false,
    scientificStage1SeedBlockConsumed:true,
    sameBlockRerunAuthorized:false,
    stage2ExecutionAuthorized:false,
    technicalPass,
    checks,
    productionDisposition:production.development.productionDisposition,
    finalDecision,
    selectedModel:technicalPass?{
      familySetId:production.development.model.selectedFamilySetId,
      lambda:production.development.model.selectedLambda,
      pooledOofRmse:production.development.model.selectedPooledOofRmse,
      pooledOofSpearman:production.development.model.selectedPooledOofSpearman,
      namuaOofSpearman:production.development.model.selectedNamuaOofSpearman,
      mtajiOofSpearman:production.development.model.selectedMtajiOofSpearman,
      relativeRmseImprovement:production.development.model.relativeRmseImprovement,
      topScoreQuintile:production.development.model.topScoreQuintile
    }:null,
    support:technicalPass?production.development.support:null,
    performance:technicalPass?production.development.performance:null,
    hashes:{
      sourceCorpusSha256:production.hashes.sourceCorpusSha256,
      selectionSha256:production.hashes.selectionSha256,
      compactRowsSha256:production.hashes.compactRowsSha256,
      developmentCoreSha256:production.hashes.developmentCoreSha256,
      productionResultSha256:production.productionResultSha256,
      independentResultSha256:independent.independentResultSha256
    }
  };
  result.verificationSha256=canonicalHash(result);
  writeJson(path.resolve(outPath),result);
  process.stdout.write(JSON.stringify({technicalPass,productionDisposition:result.productionDisposition,finalDecision,checks,verificationSha256:result.verificationSha256},null,2)+"\n");
  ensure(technicalPass,"PCRPR Stage 1 independent verification failed; block is consumed and same-block rerun is not authorized");
}
try{run();}catch(error){console.error(error.stack||error.message||String(error));process.exitCode=1;}
