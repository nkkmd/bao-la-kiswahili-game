#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const Ind = require("./lib/pcrpr-stage1-independent.js");

const ROOT = path.resolve(__dirname,"../..");
const SPEC_PATH = path.join(ROOT,"doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
function ensure(ok,message){if(!ok)throw new Error(message);}
function arg(name){const at=process.argv.indexOf(name);return at>=0?process.argv[at+1]:null;}
function sha256File(file){return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");}
function writeJson(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n","utf8");}

function run(){
  const gatePath=arg("--gate"),outPath=arg("--out");ensure(gatePath&&outPath,"--gate and --out required");
  const gate=JSON.parse(fs.readFileSync(path.resolve(gatePath),"utf8"));
  const spec=JSON.parse(fs.readFileSync(SPEC_PATH,"utf8"));
  ensure(gate.studyId===spec.studyId&&gate.stageId===spec.stageId,"execution gate identity mismatch");
  ensure(gate.scientificStage1SeedBlockConsumed===true,"consume-once gate not crossed");
  ensure(gate.independentVerifierReplayAuthorized===true,"independent verifier replay not authorized");
  ensure(gate.specSha256===sha256File(SPEC_PATH),"gate/spec hash mismatch");
  if(process.env.GITHUB_RUN_ID)ensure(String(gate.workflowRunId)===String(process.env.GITHUB_RUN_ID),"gate workflow run mismatch");

  const runResult=Ind.runDevelopment(spec);
  const {records,selection,rows,measurements,development}=runResult;
  const compactRows=rows.map((row,index)=>({
    rowIdentity:row.rowIdentity,
    seed:row.seed,
    generationStratum:row.generationStratum,
    phase:row.phase,
    ply:row.ply,
    historicalTrajectoryHash:row.historicalTrajectoryHash,
    openingPrefixHash:row.openingPrefixHash,
    rawStateKey:row.rawStateKey,
    rootOccurrenceHistoryHash:row.rootOccurrenceHistoryHash,
    rootMoveKey:row.rootMoveKey,
    rootActor:row.rootActor,
    representationVector:row.representation.vector,
    representationSha256:Ind.canonicalHash(row.representation),
    target:{
      strongWin:measurements[index].strongWin,
      mediumWinRate:measurements[index].mediumWinRate,
      weakWinRate:measurements[index].weakWinRate,
      primaryLift:measurements[index].primaryLift,
      weakLift:measurements[index].weakLift,
      policySpan:measurements[index].policySpan,
      administrative:measurements[index].administrative
    },
    measurementSha256:Ind.canonicalHash(measurements[index])
  }));
  const hashes={
    sourceCorpusSha256:Ind.canonicalHash(records),
    selectionSha256:selection.selectionHash,
    rowsSha256:Ind.canonicalHash(rows),
    measurementsSha256:Ind.canonicalHash(measurements),
    compactRowsSha256:Ind.canonicalHash(compactRows),
    developmentCoreSha256:development.developmentCoreSha256
  };
  const result={
    schemaVersion:1,
    studyId:spec.studyId,
    stageId:spec.stageId,
    classification:"STAGE1-DEVELOPMENT-INDEPENDENT-REPLAY",
    scientificInferenceAuthorized:false,
    independentVerifierReplayAuthorized:true,
    confirmatoryReuseAllowed:false,
    scientificStage1SeedBlockConsumed:true,
    stage2ExecutionAuthorized:false,
    sourceCommit:process.env.GITHUB_SHA||null,
    workflowRunId:process.env.GITHUB_RUN_ID||null,
    workflowRunAttempt:process.env.GITHUB_RUN_ATTEMPT||null,
    specSha256:sha256File(SPEC_PATH),
    gateAuthorizationSha256:gate.authorizationSha256,
    sourceSummary:{
      generatedGames:records.length,
      uniqueHistoricalTrajectories:selection.uniqueHistoricalTrajectories,
      generatedDistinctOpeningPrefixes:selection.generatedDistinctOpeningPrefixes,
      unavailableAssignedPhase:selection.unavailableAssignedPhase,
      failedReferenceDisadvantage:selection.failedReferenceDisadvantage
    },
    selectionSummary:{
      selectedRoots:selection.selected.length,
      disadvantagedPool:selection.disadvantagedPool,
      selectedDistinctOpeningPrefixes:selection.selectedDistinctOpeningPrefixes,
      conditionCounts:selection.conditionCounts
    },
    compactRows,
    development,
    hashes
  };
  result.independentResultSha256=Ind.canonicalHash(result);
  writeJson(path.resolve(outPath),result);
  process.stdout.write(JSON.stringify({
    classification:result.classification,
    generatedGames:records.length,
    selectedRoots:selection.selected.length,
    rows:rows.length,
    disposition:development.productionDisposition,
    selectedFamilySetId:development.model.selectedFamilySetId,
    selectedLambda:development.model.selectedLambda,
    developmentCoreSha256:development.developmentCoreSha256,
    independentResultSha256:result.independentResultSha256
  },null,2)+"\n");
}
try{run();}catch(error){console.error(error.stack||error.message||String(error));process.exitCode=1;}
