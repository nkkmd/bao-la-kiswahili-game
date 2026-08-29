#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const Prod = require("./lib/pcrpr-stage1-production.js");
const Model = require("./lib/pcrpr-stage1-model.js");

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
  ensure(gate.developmentOutcomeGenerationAuthorized===true,"development generation not authorized by gate");
  ensure(gate.specSha256===sha256File(SPEC_PATH),"gate/spec hash mismatch");
  if(process.env.GITHUB_RUN_ID)ensure(String(gate.workflowRunId)===String(process.env.GITHUB_RUN_ID),"gate workflow run mismatch");

  const records=Prod.generateCorpus(spec);
  const selection=Prod.selectRoots(records,spec);
  const rows=Prod.makeRows(selection,spec);
  const measurements=Prod.measureRows(rows,spec);
  const development=Model.develop(rows,measurements,selection,spec);

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
    representationSha256:Prod.canonicalHash(row.representation),
    target:{
      strongWin:measurements[index].strongWin,
      mediumWinRate:measurements[index].mediumWinRate,
      weakWinRate:measurements[index].weakWinRate,
      primaryLift:measurements[index].primaryLift,
      weakLift:measurements[index].weakLift,
      policySpan:measurements[index].policySpan,
      administrative:measurements[index].administrative
    },
    measurementSha256:Prod.canonicalHash(measurements[index])
  }));
  const hashes={
    sourceCorpusSha256:Prod.canonicalHash(records),
    selectionSha256:selection.selectionHash,
    rowsSha256:Prod.canonicalHash(rows),
    measurementsSha256:Prod.canonicalHash(measurements),
    compactRowsSha256:Prod.canonicalHash(compactRows),
    developmentCoreSha256:development.developmentCoreSha256
  };
  const result={
    schemaVersion:1,
    studyId:spec.studyId,
    stageId:spec.stageId,
    classification:"STAGE1-DEVELOPMENT-PRODUCTION",
    scientificInferenceAuthorized:false,
    developmentOutcomeGenerationAuthorized:true,
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
  result.productionResultSha256=Prod.canonicalHash(result);
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
    productionResultSha256:result.productionResultSha256
  },null,2)+"\n");
}
try{run();}catch(error){console.error(error.stack||error.message||String(error));process.exitCode=1;}
