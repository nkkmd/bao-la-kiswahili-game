#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Core = require("./lib/pcrpr-stage1-production.js");
const Model = require("./lib/pcrpr-stage1-model.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");

function ensure(ok, message) { if (!ok) throw new Error(message); }
function parseOut() { const at=process.argv.indexOf("--out"); return at>=0&&process.argv[at+1]?path.resolve(process.argv[at+1]):path.join(ROOT,"artifacts/local/practical-comeback-reply-pressure-representation/stage1-implementation-smoke-v1.json"); }
function writeJson(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n");}

function syntheticModelRows(realRows) {
  ensure(realRows.length > 0, "need real representation row for model smoke");
  const template = realRows[0];
  const rows=[];
  const measurements=[];
  const usedFolds=new Set();
  let counter=0;
  while(rows.length<20 || usedFolds.size<5){
    const historicalTrajectoryHash=Core.sha256("PCRPR-SMOKE-TRAJ|"+counter);
    const fold=Model.foldIndex(historicalTrajectoryHash);
    const rowIdentity=Core.sha256("PCRPR-SMOKE-ROW|"+counter);
    const phase=counter%2===0?"namua":"mtaji";
    const generationStratum="SMOKE-S"+(counter%6);
    const row={...Core.clone(template),rowIdentity,historicalTrajectoryHash,phase,generationStratum};
    rows.push(row); usedFolds.add(fold);
    const value=((counter%7)-3)/8;
    measurements.push({rowIdentity,strongWin:0,mediumWinRate:Math.max(0,value),weakWinRate:Math.max(0,value/2),primaryLift:value,weakLift:value/2,policySpan:Math.abs(value),administrative:{strong:0,medium:0,weak:0},outcomes:{STRONG:[{boundedWin:0}],MEDIUM:[{boundedWin:0}],WEAK:[{boundedWin:0}]}});
    counter+=1;
    ensure(counter<200,"failed to populate synthetic folds");
  }
  ensure(rows.some((row)=>row.phase==="namua")&&rows.some((row)=>row.phase==="mtaji"),"synthetic phase coverage missing");
  return {rows,measurements};
}

function run(){
  const spec=JSON.parse(fs.readFileSync(SPEC_PATH,"utf8"));
  ensure(spec.stageId==="PCRPR-S1-DEVELOPMENT-2026-08-29-v1","unexpected stageId");
  ensure(spec.developmentOutcomeGenerationAuthorizedBySpecAlone===false,"authorization firewall absent");
  ensure(spec.sourcePopulation.seedStart===28710001,"scientific seed contract drift");

  const records=Core.generateCorpus(spec,{games:64,seedStart:28701001,maxPly:60});
  const selection=Core.selectRoots(records,spec,{phaseQuota:{namua:1,mtaji:1}});
  ensure(selection.selected.length>=1,"technical smoke found no disadvantaged root");
  const rows=Core.makeRows(selection,spec,{maxMovesPerRoot:2});
  ensure(rows.length>=1,"technical smoke produced no exact root-move rows");
  ensure(rows.every((row)=>row.representation.vector.scalarCount===80),"representation width drift");
  const measurements=Core.measureRows(rows,spec,{replicates:{STRONG:1,MEDIUM:2,WEAK:2},horizon:16});
  ensure(measurements.length===rows.length,"measurement row count mismatch");
  ensure(measurements.every((m)=>Number.isFinite(m.primaryLift)&&Number.isFinite(m.weakLift)&&Number.isFinite(m.policySpan)),"non-finite smoke target");

  const synthetic=syntheticModelRows(rows);
  const prepared=Model.prepareRows(synthetic.rows,synthetic.measurements);
  const cv=Model.crossValidate(prepared,spec);
  ensure(cv.candidates.length===Object.keys(spec.developmentModel.candidateFamilySets).length*spec.developmentModel.ridgeLambdas.length,"candidate grid mismatch");
  ensure(Number.isFinite(cv.selectedPooledOofRmse)&&Number.isFinite(cv.selectedPooledOofSpearman),"non-finite model smoke metrics");
  ensure(Number.isFinite(cv.selectedNamuaOofSpearman)&&Number.isFinite(cv.selectedMtajiOofSpearman),"non-finite phase smoke metrics");

  const result={
    schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,
    classification:"PREAUTHORIZATION-TECHNICAL-SMOKE-ONLY",
    scientificOutcomeGenerated:false,scientificSeedsConsumed:false,
    technicalSeedMenu:"28701001..28701064",
    generatedGames:records.length,
    selectedTechnicalRoots:selection.selected.length,
    representationRows:rows.length,
    scalarFeaturesPerRow:rows[0].representation.vector.scalarCount,
    reducedContinuationReplicates:{strong:1,medium:2,weak:2,horizon:16},
    modelSmokeRows:prepared.length,
    modelCandidateGrid:cv.candidates.length,
    syntheticPhaseCounts:{namua:prepared.filter((row)=>row.phase==="namua").length,mtaji:prepared.filter((row)=>row.phase==="mtaji").length},
    syntheticFoldCounts:Object.fromEntries([0,1,2,3,4].map((fold)=>[fold,prepared.filter((row)=>Model.foldIndex(row.historicalTrajectoryHash)===fold).length])),
    selectedModelSmoke:{familySetId:cv.selectedFamilySetId,lambda:cv.selectedLambda,rmse:cv.selectedPooledOofRmse,spearman:cv.selectedPooledOofSpearman,namuaSpearman:cv.selectedNamuaOofSpearman,mtajiSpearman:cv.selectedMtajiOofSpearman},
    passed:true
  };
  writeJson(parseOut(),result);
  process.stdout.write(JSON.stringify(result,null,2)+"\n");
}

try{run();}catch(error){console.error(error.stack||error.message);process.exitCode=1;}
