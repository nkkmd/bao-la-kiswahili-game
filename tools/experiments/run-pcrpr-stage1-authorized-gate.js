#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const childProcess = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const STUDY_ID = "PCRPR-STUDY1";
const STAGE_ID = "PCRPR-S1-DEVELOPMENT-2026-08-29-v1";
const SPEC_PATH = "doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json";
const COMPUTATION_PATH = "doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_COMPUTATION_CONTRACT.json";
const ADDENDUM_PATH = "doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_EXECUTION_ADDENDUM.json";
const AUTH_PATH = "doc/practical-comeback-reply-pressure-representation/authorizations/STAGE_1_EXECUTE.json";

function ensure(ok, message) { if (!ok) throw new Error(message); }
function abs(relative) { return path.join(ROOT, relative); }
function sha256File(relative) { return crypto.createHash("sha256").update(fs.readFileSync(abs(relative))).digest("hex"); }
function gitBlob(relative) { return childProcess.execFileSync("git", ["hash-object", relative], {cwd:ROOT,encoding:"utf8"}).trim(); }
function gitText(args) { return childProcess.execFileSync("git", args, {cwd:ROOT,encoding:"utf8"}).trim(); }
function parseOut() { const at=process.argv.indexOf("--out"); ensure(at>=0&&process.argv[at+1],"--out required"); return path.resolve(process.argv[at+1]); }
function writeJson(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n","utf8");}

function validate() {
  ensure(fs.existsSync(abs(AUTH_PATH)), "Stage 1 authorization absent");
  ensure(fs.existsSync(abs(ADDENDUM_PATH)), "Stage 1 execution addendum absent");
  const spec=JSON.parse(fs.readFileSync(abs(SPEC_PATH),"utf8"));
  const addendum=JSON.parse(fs.readFileSync(abs(ADDENDUM_PATH),"utf8"));
  const auth=JSON.parse(fs.readFileSync(abs(AUTH_PATH),"utf8"));
  ensure(spec.studyId===STUDY_ID&&spec.stageId===STAGE_ID,"spec identity mismatch");
  ensure(spec.developmentOutcomeGenerationAuthorizedBySpecAlone===false,"spec-alone firewall missing");
  ensure(spec.scientificInferenceAuthorized===false,"Stage 1 must remain development-only");
  ensure(addendum.studyId===STUDY_ID&&addendum.stageId===STAGE_ID,"addendum identity mismatch");
  ensure(auth.studyId===STUDY_ID&&auth.stageId===STAGE_ID,"authorization identity mismatch");
  ensure(auth.status==="AUTHORIZED","Stage 1 authorization inactive");
  ensure(auth.scientificDevelopmentOutcomeGenerationAuthorized===true,"scientific development generation not authorized");
  ensure(auth.independentVerifierReplayAuthorized===true,"independent verifier replay not authorized");
  ensure(auth.stage2ExecutionAuthorized===false,"Stage 2 must remain unauthorized");
  ensure(auth.specSha256===sha256File(SPEC_PATH),"spec SHA256 drift");
  ensure(auth.computationContractSha256===sha256File(COMPUTATION_PATH),"computation contract SHA256 drift");
  ensure(auth.executionAddendumSha256===sha256File(ADDENDUM_PATH),"execution addendum SHA256 drift");
  ensure(auth.sourceBlobHashes&&auth.sourceSha256&&typeof auth.sourceBlobHashes==="object"&&typeof auth.sourceSha256==="object","authorization source hash maps missing");
  const paths=Object.keys(auth.sourceBlobHashes).sort();
  ensure(paths.length>0,"empty authorized source map");
  ensure(JSON.stringify(paths)===JSON.stringify(Object.keys(auth.sourceSha256).sort()),"source hash path sets differ");
  for(const relative of paths){
    ensure(gitBlob(relative)===auth.sourceBlobHashes[relative],`authorized git blob drift: ${relative}`);
    ensure(sha256File(relative)===auth.sourceSha256[relative],`authorized SHA256 drift: ${relative}`);
  }
  ensure(gitText(["status","--porcelain"])==="","authorized source tree must be clean");
  return {spec,addendum,auth,sourcePaths:paths};
}

function run(){
  const out=parseOut();
  const {spec,addendum,auth,sourcePaths}=validate();
  const record={
    schemaVersion:1,
    studyId:STUDY_ID,
    stageId:STAGE_ID,
    classification:"STAGE1-CONSUME-ONCE-EXECUTION-START",
    scientificInferenceAuthorized:false,
    developmentOutcomeGenerationAuthorized:true,
    scientificStage1SeedBlockConsumed:true,
    seedStart:spec.sourcePopulation.seedStart,
    seedEnd:spec.sourcePopulation.seedEnd,
    seedCount:spec.sourcePopulation.games,
    sourceFreezeCommit:auth.sourceFreezeCommit,
    executionCommit:process.env.GITHUB_SHA||gitText(["rev-parse","HEAD"]),
    workflowRunId:process.env.GITHUB_RUN_ID||null,
    workflowRunAttempt:process.env.GITHUB_RUN_ATTEMPT||null,
    specSha256:auth.specSha256,
    computationContractSha256:auth.computationContractSha256,
    executionAddendumSha256:auth.executionAddendumSha256,
    authorizationSha256:sha256File(AUTH_PATH),
    authorizedSourcePathCount:sourcePaths.length,
    consumeOnceBoundary:addendum.consumeOnceBoundary,
    independentVerifierReplayAuthorized:true,
    sameBlockRepairOrReplacementAuthorized:false,
    stage2ExecutionAuthorized:false
  };
  writeJson(out,record);
  process.stdout.write(JSON.stringify(record,null,2)+"\n");
}
try{run();}catch(error){console.error(error.stack||error.message||String(error));process.exitCode=1;}
