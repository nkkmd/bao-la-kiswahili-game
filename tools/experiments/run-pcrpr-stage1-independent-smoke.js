#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Prod = require("./lib/pcrpr-stage1-production.js");
const ProdModel = require("./lib/pcrpr-stage1-model.js");
const Ind = require("./lib/pcrpr-stage1-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/practical-comeback-reply-pressure-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
function ensure(ok,message){if(!ok)throw new Error(message);}
function parseOut(){const at=process.argv.indexOf("--out");return at>=0&&process.argv[at+1]?path.resolve(process.argv[at+1]):path.join(ROOT,"artifacts/local/practical-comeback-reply-pressure-representation/stage1-independent-smoke-v1.json");}
function writeJson(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n","utf8");}

function syntheticRows(template,spec){
  const rows=[],measurements=[],folds=new Set();let counter=0;
  while(rows.length<20||folds.size<5){
    const historicalTrajectoryHash=Prod.sha256("PCRPR-INDEPENDENT-SMOKE-TRAJ|"+counter);
    const rowIdentity=Prod.sha256("PCRPR-INDEPENDENT-SMOKE-ROW|"+counter);
    const phase=counter%2===0?"namua":"mtaji";
    const generationStratum=spec.sourcePopulation.conditionAssignment.strata[counter%spec.sourcePopulation.conditionAssignment.strata.length].id;
    const row={...Prod.clone(template),rowIdentity,historicalTrajectoryHash,phase,generationStratum};
    rows.push(row);folds.add(ProdModel.foldIndex(historicalTrajectoryHash));
    const primaryLift=((counter%9)-4)/16;
    measurements.push({rowIdentity,strongWin:0,mediumWinRate:Math.max(0,primaryLift),weakWinRate:Math.max(0,primaryLift/2),primaryLift,weakLift:primaryLift/2,policySpan:Math.abs(primaryLift),administrative:{strong:0,medium:0,weak:0},outcomes:{STRONG:[{boundedWin:0}],MEDIUM:[{boundedWin:0}],WEAK:[{boundedWin:0}]}});
    counter++;ensure(counter<200,"failed to cover all folds");
  }
  return {rows,measurements};
}
function fakeSelection(rows,spec){
  const selected=rows.slice(0,Math.min(rows.length,12)).map((row,index)=>({phase:index%2===0?"namua":"mtaji",generationStratum:spec.sourcePopulation.conditionAssignment.strata[index%spec.sourcePopulation.conditionAssignment.strata.length].id,openingPrefixHash:"smoke-prefix-"+index}));
  const conditionCounts={};for(const item of selected)conditionCounts[item.generationStratum]=(conditionCounts[item.generationStratum]||0)+1;
  return {selectionHash:"PCRPR-INDEPENDENT-MODEL-SMOKE",selected,conditionCounts,uniqueHistoricalTrajectories:rows.length,generatedDistinctOpeningPrefixes:rows.length,selectedDistinctOpeningPrefixes:selected.length};
}

function run(){
  const spec=JSON.parse(fs.readFileSync(SPEC_PATH,"utf8"));
  ensure(spec.stageId==="PCRPR-S1-DEVELOPMENT-2026-08-29-v1","stage drift");
  ensure(spec.developmentOutcomeGenerationAuthorizedBySpecAlone===false,"authorization firewall absent");
  const options={games:24,seedStart:28701001,maxPly:48,phaseQuota:{namua:1,mtaji:1}};
  const prodRecords=Prod.generateCorpus(spec,options);
  const indRecords=Ind.generateCorpus(spec,options);
  assert.equal(Prod.canonicalHash(prodRecords),Ind.canonicalHash(indRecords),"independent source corpus mismatch");

  const prodSelection=Prod.selectRoots(prodRecords,spec,options);
  const indSelection=Ind.selectRoots(indRecords,spec,options);
  assert.equal(prodSelection.selectionHash,indSelection.selectionHash,"independent root selection mismatch");
  ensure(prodSelection.selected.length>0,"no technical selected root");

  const prodRows=Prod.makeRows(prodSelection,spec,{maxMovesPerRoot:2});
  const indRows=Ind.makeRows(indSelection,spec,{maxMovesPerRoot:2});
  assert.equal(prodRows.length,indRows.length,"independent row count mismatch");
  ensure(prodRows.length>0,"no technical representation rows");
  for(let index=0;index<prodRows.length;index++){
    assert.equal(prodRows[index].rowIdentity,indRows[index].rowIdentity,"row identity mismatch");
    assert.equal(prodRows[index].rawStateKey,indRows[index].rawStateKey,"raw state mismatch");
    assert.deepEqual(prodRows[index].representation,indRows[index].representation,"feature representation mismatch");
  }

  const continuationOptions={replicates:{STRONG:1,MEDIUM:2,WEAK:2},horizon:16};
  const prodMeasurements=Prod.measureRows(prodRows,spec,continuationOptions);
  const indMeasurements=Ind.measureRows(indRows,spec,continuationOptions);
  assert.deepEqual(prodMeasurements,indMeasurements,"independent continuation mismatch");

  const synthetic=syntheticRows(prodRows[0],spec),selection=fakeSelection(synthetic.rows,spec);
  const prodDevelopment=ProdModel.develop(synthetic.rows,synthetic.measurements,selection,spec);
  const indDevelopment=Ind.develop(synthetic.rows,synthetic.measurements,selection,spec);
  assert.equal(prodDevelopment.developmentCoreSha256,indDevelopment.developmentCoreSha256,"independent model/development core mismatch");
  assert.deepEqual(prodDevelopment.model,indDevelopment.model,"independent model object mismatch");
  assert.deepEqual(prodDevelopment.finalModel,indDevelopment.finalModel,"independent final fit mismatch");

  const independentSource=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/pcrpr-stage1-independent.js"),"utf8");
  const forbidden=["pcrpr-stage0-production","pcrpr-stage1-production","pcrpr-stage1-model","rcpr-stage1-production","practical-comeback-stage1-corpus"];
  ensure(forbidden.every((token)=>!independentSource.includes(`require(\"./${token}`)&&!independentSource.includes(`require('./${token}`)),"independent core imports forbidden production helper");

  const result={schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,classification:"PREAUTHORIZATION-INDEPENDENT-SMOKE-ONLY",scientificOutcomeGenerated:false,scientificSeedsConsumed:false,technicalSeedMenu:"28701001..28701024",checks:{sourceCorpusExact:true,rootSelectionExact:true,rowIdentityExact:true,allFeatureRepresentationsExact:true,reducedContinuationExact:true,modelDevelopmentCoreExact:true,finalFitExact:true,independentProductionHelperImportAbsent:true},counts:{games:prodRecords.length,selectedRoots:prodSelection.selected.length,rows:prodRows.length,syntheticModelRows:synthetic.rows.length},hashes:{sourceCorpus:Prod.canonicalHash(prodRecords),selection:prodSelection.selectionHash,modelDevelopment:prodDevelopment.developmentCoreSha256},passed:true};
  writeJson(parseOut(),result);process.stdout.write(JSON.stringify(result,null,2)+"\n");
}
try{run();}catch(error){console.error(error.stack||error.message||String(error));process.exitCode=1;}
