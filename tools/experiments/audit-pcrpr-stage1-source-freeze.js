#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const ROOT = path.resolve(__dirname,"../..");
const STUDY_ID = "PCRPR-STUDY1";
const STAGE_ID = "PCRPR-S1-DEVELOPMENT-2026-08-29-v1";
const SOURCE_PATHS = [
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/experiments/lib/pcrpr-stage0-production.js",
  "tools/experiments/lib/pcrpr-stage1-production.js",
  "tools/experiments/lib/pcrpr-stage1-model.js",
  "tools/experiments/lib/pcrpr-stage1-independent.js",
  "tools/experiments/run-pcrpr-stage1-authorized-gate.js",
  "tools/experiments/run-pcrpr-stage1-development.js",
  "tools/experiments/run-pcrpr-stage1-independent.js",
  "tools/experiments/compare-pcrpr-stage1-development.js",
  ".github/workflows/pcrpr-stage1-development.yml",
  "doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_0_TECHNICAL_VALIDATION_PROTOCOL.md",
  "doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json",
  "doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_COMPUTATION_CONTRACT.json",
  "doc/practical-comeback-reply-pressure-representation/FEATURE_DICTIONARY.md"
];
const REQUIRED_RESULTS = [
  "doc/practical-comeback-reply-pressure-representation/results/STAGE_0_TECHNICAL_RESULT.json",
  "doc/practical-comeback-reply-pressure-representation/results/STAGE_1_IMPLEMENTATION_SMOKE.json",
  "doc/practical-comeback-reply-pressure-representation/results/STAGE_1_RESOURCE_PREFLIGHT.json",
  "doc/practical-comeback-reply-pressure-representation/results/STAGE_1_INDEPENDENT_SMOKE.json"
];
function ensure(ok,message){if(!ok)throw new Error(message);}
function abs(relative){return path.join(ROOT,relative);}
function sha256File(relative){return crypto.createHash("sha256").update(fs.readFileSync(abs(relative))).digest("hex");}
function gitBlob(relative){return childProcess.execFileSync("git",["hash-object",relative],{cwd:ROOT,encoding:"utf8"}).trim();}
function gitText(args){return childProcess.execFileSync("git",args,{cwd:ROOT,encoding:"utf8"}).trim();}
function parseOut(){const at=process.argv.indexOf("--out");ensure(at>=0&&process.argv[at+1],"--out required");return path.resolve(process.argv[at+1]);}
function writeJson(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n","utf8");}

function prerequisitePassed(relative,value){
  if(relative.includes("STAGE_0_TECHNICAL_RESULT")) return value.finalDecision==="STAGE0-TECHNICAL-PASS" && value.production?.passed===true && value.independentVerification?.passed===true;
  return value.passed===true;
}
function scientificSeedConsumed(value){return value.scientificSeedsConsumed===true||value.scientificSeedBlocksConsumed===true||value.scientificStage1SeedBlockConsumed===true;}

function run(){
  ensure(gitText(["status","--porcelain"])==="","source-freeze audit requires clean tree");
  const sourceBlobHashes={},sourceSha256={};
  for(const relative of SOURCE_PATHS){ensure(fs.existsSync(abs(relative)),`missing frozen source ${relative}`);sourceBlobHashes[relative]=gitBlob(relative);sourceSha256[relative]=sha256File(relative);}
  const prerequisites={};
  for(const relative of REQUIRED_RESULTS){
    ensure(fs.existsSync(abs(relative)),`missing prerequisite result ${relative}`);
    const value=JSON.parse(fs.readFileSync(abs(relative),"utf8"));
    ensure(value.studyId===STUDY_ID,"prerequisite study mismatch");
    ensure(prerequisitePassed(relative,value),`prerequisite not passed: ${relative}`);
    ensure(!scientificSeedConsumed(value),`preauthorization prerequisite consumed scientific seeds: ${relative}`);
    prerequisites[relative]={sha256:sha256File(relative),passed:true};
  }
  const spec=JSON.parse(fs.readFileSync(abs("doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json"),"utf8"));
  ensure(spec.studyId===STUDY_ID&&spec.stageId===STAGE_ID,"spec identity mismatch");
  ensure(spec.sourcePopulation.seedStart===28710001&&spec.sourcePopulation.seedEnd===28713072,"scientific seed block drift");
  ensure(spec.developmentOutcomeGenerationAuthorizedBySpecAlone===false,"spec-alone firewall missing");
  const independentSource=fs.readFileSync(abs("tools/experiments/lib/pcrpr-stage1-independent.js"),"utf8");
  const forbidden=["pcrpr-stage0-production","pcrpr-stage1-production","pcrpr-stage1-model"];
  ensure(forbidden.every((token)=>!independentSource.includes(`require(\"./${token}`)&&!independentSource.includes(`require('./${token}`)),"independent source imports forbidden production helper");
  const audit={
    schemaVersion:1,
    studyId:STUDY_ID,
    stageId:STAGE_ID,
    classification:"STAGE1-PREAUTHORIZATION-SOURCE-FREEZE-AUDIT",
    scientificInferenceAuthorized:false,
    scientificOutcomeGenerated:false,
    scientificSeedsConsumed:false,
    sourceFreezeCommit:process.env.GITHUB_SHA||gitText(["rev-parse","HEAD"]),
    baselineMainSha:"e5ad840520eb6c5bd0408f924c1f9a55c4cba6a5",
    specSha256:sourceSha256["doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json"],
    computationContractSha256:sourceSha256["doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_COMPUTATION_CONTRACT.json"],
    featureDictionarySha256:sourceSha256["doc/practical-comeback-reply-pressure-representation/FEATURE_DICTIONARY.md"],
    sourceBlobHashes,
    sourceSha256,
    prerequisites,
    gates:{
      allSourcesPresent:true,
      dualHashMapComplete:Object.keys(sourceBlobHashes).length===SOURCE_PATHS.length&&Object.keys(sourceSha256).length===SOURCE_PATHS.length,
      stage0TechnicalPassMaterialized:true,
      implementationSmokePassMaterialized:true,
      resourcePreflightPassMaterialized:true,
      independentSmokePassMaterialized:true,
      independentProductionHelperImportAbsent:true,
      stage1ScientificSeedBlockUnconsumed:true,
      stage1SpecAloneCannotAuthorize:true,
      stage2NotAuthorized:true
    }
  };
  audit.passed=Object.values(audit.gates).every(Boolean);
  writeJson(parseOut(),audit);
  process.stdout.write(JSON.stringify(audit,null,2)+"\n");
  ensure(audit.passed,"PCRPR Stage 1 source-freeze audit failed");
}
try{run();}catch(error){console.error(error.stack||error.message||String(error));process.exitCode=1;}
