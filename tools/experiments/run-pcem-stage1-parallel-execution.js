#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { performance } = require("node:perf_hooks");

const Validator = require("./validate-pcem-stage1-spec.js");
const Corpus = require("./lib/practical-comeback-stage1-corpus.js");
const Measurement = require("./lib/practical-comeback-stage1-measurement.js");
const Discovery = require("./lib/practical-comeback-stage1-discovery.js");
const P = require("./lib/practical-comeback-stage0-production.js");

const ROOT = Validator.ROOT;
const AMEND_PATH = path.join(ROOT, "doc/practical-comeback-error-inducing-moves/preregistration/STAGE_1_EXECUTION_AMENDMENT_1.json");
const WORKFLOW_PATH = ".github/workflows/pcem-stage1-parallel.yml";
const SELF_PATH = "tools/experiments/run-pcem-stage1-parallel-execution.js";

function sha256Bytes(bytes) { return crypto.createHash("sha256").update(bytes).digest("hex"); }
function fileSha256(file) { return sha256Bytes(fs.readFileSync(path.join(ROOT, file))); }
function gitBlob(file) { return execFileSync("git", ["hash-object", file], { cwd: ROOT, encoding: "utf8" }).trim(); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); }
function recursiveFiles(dir) { if (!fs.existsSync(dir)) return []; const out=[]; for (const entry of fs.readdirSync(dir,{withFileTypes:true})) { const p=path.join(dir,entry.name); if(entry.isDirectory()) out.push(...recursiveFiles(p)); else out.push(p); } return out; }
function filesNamed(dir, prefix) { return recursiveFiles(dir).filter((p)=>path.basename(p).startsWith(prefix)&&p.endsWith(".json")); }
function argMap(argv) { const out={}; for(let i=0;i<argv.length;i+=2){assert.ok(argv[i].startsWith("--"),`bad arg ${argv[i]}`);out[argv[i].slice(2)]=argv[i+1];} return out; }
function elapsed(start){return (performance.now()-start)/1000;}

function loadContracts() {
  const loaded = Validator.loadValidated();
  const auth = readJson(Validator.AUTH_PATH);
  assert.equal(auth.studyId, loaded.spec.studyId);
  assert.equal(auth.stageId, loaded.spec.stageId);
  assert.equal(auth.stage1GenerationAuthorized, true);
  assert.equal(auth.stage2GenerationAuthorized, false);
  assert.equal(auth.scientificInferenceAuthorized, false);
  assert.equal(auth.confirmatoryReuseAllowed, false);
  assert.equal(auth.specSha256, loaded.specSha256);
  assert.equal(auth.featureDefinitionsSha256, loaded.featureSha256);
  for (const [file, expected] of Object.entries(auth.authorizedSourceFileSha256)) {
    assert.equal(fileSha256(file), expected, `authorized scientific source mismatch: ${file}`);
  }
  assert.ok(fs.existsSync(AMEND_PATH), "parallel execution amendment absent");
  const amendment = readJson(AMEND_PATH);
  const scientific = amendment.scientificContract;
  const parallel = amendment.parallelPlan;
  assert.equal(amendment.studyId, loaded.spec.studyId);
  assert.equal(amendment.stageId, loaded.spec.stageId);
  assert.equal(amendment.parallelExecutionAuthorized, true);
  assert.equal(scientific.scientificLogicChanged, false);
  assert.equal(scientific.sourceSeedBlockChanged, false);
  assert.equal(scientific.endpointChanged, false);
  assert.equal(scientific.promotionRuleChanged, false);
  assert.equal(parallel.sourceChunks, 12);
  assert.equal(parallel.sourceGamesPerChunk, 256);
  assert.equal(parallel.measurementChunks, 12);
  assert.equal(parallel.maximumRootsPerMeasurementChunk, 25);
  assert.equal(gitBlob(SELF_PATH), amendment.executionBindings.parallelProductionHelperGitBlobSha);
  assert.equal(gitBlob(WORKFLOW_PATH), amendment.executionBindings.parallelWorkflowGitBlobSha);
  return { loaded, auth, amendment, scientific, parallel };
}

function compactSelected(item) {
  return {
    historicalTrajectoryHash:item.historicalTrajectoryHash, ruleTrajectoryHash:item.ruleTrajectoryHash,
    openingPrefixHash:item.openingPrefixHash, seed:item.seed, gameIndex:item.gameIndex, conditionId:item.conditionId,
    assignedPhase:item.assignedPhase, ply:item.ply, rawStateKey:item.rawStateKey, historicalStateHash:item.historicalStateHash,
    selectionRank:item.selectionRank, quotaRank:item.quotaRank,
    referenceDisadvantageBestScore:item.referenceDisadvantageBestScore, referenceDisadvantageTableHash:item.referenceDisadvantageTableHash,
    state:item.state,
  };
}

function provenance(contracts, execution) {
  return {
    sourceCommit: execFileSync("git", ["rev-parse","HEAD"], {cwd:ROOT,encoding:"utf8"}).trim(),
    specSha256: contracts.loaded.specSha256,
    featureDefinitionsSha256: contracts.loaded.featureSha256,
    authorizationSha256: fileSha256(path.relative(ROOT, Validator.AUTH_PATH)),
    executionAmendmentSha256: fileSha256(path.relative(ROOT, AMEND_PATH)),
    executionMode: "parallel-chunked-v1",
    execution,
    node: process.version, platform: process.platform, arch: process.arch,
  };
}

function modeGate() {
  const c=loadContracts();
  process.stdout.write(`${JSON.stringify({passed:true,stageId:c.loaded.spec.stageId,parallelExecutionAuthorized:true,sourceChunks:c.parallel.sourceChunks,measurementChunks:c.parallel.measurementChunks},null,2)}\n`);
}

function modeSource(args) {
  const startTime=performance.now(); const c=loadContracts(); const spec=c.loaded.spec;
  const chunkIndex=Number(args["chunk-index"]); const chunkCount=Number(args["chunk-count"]); assert.equal(chunkCount,c.parallel.sourceChunks); assert.ok(Number.isInteger(chunkIndex)&&chunkIndex>=0&&chunkIndex<chunkCount);
  const start=chunkIndex*c.parallel.sourceGamesPerChunk; const end=Math.min(spec.population.games,start+c.parallel.sourceGamesPerChunk); const records=[];
  for(let i=start;i<end;i++) records.push(Corpus.runGame(spec,i));
  const result={schemaVersion:1,stageId:spec.stageId,chunkIndex,chunkCount,startGameIndex:start,endGameIndexExclusive:end,records,recordHash:P.canonicalHash(records),resource:{elapsedSeconds:elapsed(startTime),maxRSSMiB:process.resourceUsage().maxRSS/1024}};
  writeJson(path.resolve(args.out),result);
}

function modeSelect(args) {
  const startTime=performance.now(); const c=loadContracts(); const spec=c.loaded.spec;
  const chunks=filesNamed(path.resolve(args["source-dir"]),"source-chunk-").map(readJson).sort((a,b)=>a.chunkIndex-b.chunkIndex); assert.equal(chunks.length,c.parallel.sourceChunks);
  chunks.forEach((x,i)=>{assert.equal(x.chunkIndex,i);assert.equal(x.recordHash,P.canonicalHash(x.records));});
  const records=chunks.flatMap((x)=>x.records).sort((a,b)=>a.gameSummary.gameIndex-b.gameSummary.gameIndex); assert.equal(records.length,spec.population.games); records.forEach((r,i)=>assert.equal(r.gameSummary.gameIndex,i));
  const gameSummaries=records.map((r)=>r.gameSummary); const outDir=path.resolve(args["out-dir"]);
  writeJson(path.join(outDir,"source-summary.json"),{schemaVersion:1,stageId:spec.stageId,games:gameSummaries,sourceSummaryHash:P.canonicalHash(gameSummaries)});
  const selection=Corpus.selectRoots(records,spec); writeJson(path.join(outDir,"selection.json"),{...selection,selected:selection.selected.map(compactSelected)});
  const plannedInterventions=selection.selected.reduce((sum,item)=>sum+P.exactLegalMoves(item.state).length,0);
  const reps=spec.continuation.primaryOpponentPolicy.replicatesPerExactRootMove+spec.continuation.secondaryOpponentPolicy.replicatesPerExactRootMove+spec.continuation.referenceOpponentPolicy.replicatesPerExactRootMove;
  const plannedContinuationRows=plannedInterventions*reps;
  let classification=null,reason=null;
  if(!selection.passed){classification="NON-ESTIMABLE";reason="selection-readiness-gate-failure";}
  else if(plannedInterventions>spec.resourceCaps.maximumExactRootMoveInterventions||plannedContinuationRows>spec.resourceCaps.maximumPlannedContinuationRows){classification="RESOURCE-CENSORED";reason="pre-measurement-intervention-cap";}
  const control={schemaVersion:1,stageId:spec.stageId,readyForMeasurement:classification===null,classification,reason,plannedInterventions,plannedContinuationRows,resource:{elapsedSeconds:elapsed(startTime),maxRSSMiB:process.resourceUsage().maxRSS/1024}};
  writeJson(path.join(outDir,"parallel-control.json"),control); process.stdout.write(`${JSON.stringify(control,null,2)}\n`);
}

function modeMeasure(args) {
  const startTime=performance.now(); const c=loadContracts(); const spec=c.loaded.spec; const selection=readJson(path.resolve(args.selection)); assert.equal(selection.passed,true);
  const chunkIndex=Number(args["chunk-index"]); const chunkCount=Number(args["chunk-count"]); assert.equal(chunkCount,c.parallel.measurementChunks); const size=c.parallel.maximumRootsPerMeasurementChunk; const start=chunkIndex*size,end=Math.min(selection.selected.length,start+size); const measurements=[]; let resourceCensored=false;
  for(let i=start;i<end;i++){measurements.push(Measurement.measureRoot(selection.selected[i],i,spec));if(elapsed(startTime)>spec.resourceCaps.maximumWallClockSecondsPerWorkflowJob||process.resourceUsage().maxRSS/1024>spec.resourceCaps.maximumRSSMiB){resourceCensored=true;break;}}
  const result={schemaVersion:1,stageId:spec.stageId,chunkIndex,chunkCount,startSelectedIndex:start,endSelectedIndexExclusive:end,plannedRoots:end-start,measuredRoots:measurements.length,resourceCensored,measurements,measurementHash:P.canonicalHash(measurements.map((m)=>m.measurementHash)),resource:{elapsedSeconds:elapsed(startTime),maxRSSMiB:process.resourceUsage().maxRSS/1024}};
  writeJson(path.resolve(args.out),result);
}

function modeFinalize(args) {
  const startTime=performance.now(); const c=loadContracts(); const spec=c.loaded.spec; const baseDir=path.resolve(args["selection-dir"]); const outDir=path.resolve(args["out-dir"]); fs.mkdirSync(outDir,{recursive:true});
  for(const name of ["source-summary.json","selection.json","parallel-control.json"]) fs.copyFileSync(path.join(baseDir,name),path.join(outDir,name));
  const selection=readJson(path.join(baseDir,"selection.json")); const control=readJson(path.join(baseDir,"parallel-control.json")); const prov=provenance(c,{sourceChunks:c.parallel.sourceChunks,measurementChunks:c.parallel.measurementChunks});
  if(!control.readyForMeasurement){const result={schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,scientificLabel:control.classification,scientificInferenceAuthorized:false,confirmatoryReuseAllowed:false,reason:control.reason,generatedGames:selection.generatedGames,selection:{...selection,selected:undefined},plannedInterventions:control.plannedInterventions,plannedContinuationRows:control.plannedContinuationRows,provenance:prov};writeJson(path.join(outDir,"stage1-result.json"),result);return;}
  const chunks=filesNamed(path.resolve(args["measure-dir"]),"measure-chunk-").map(readJson).sort((a,b)=>a.chunkIndex-b.chunkIndex); assert.equal(chunks.length,c.parallel.measurementChunks);
  chunks.forEach((x,i)=>{assert.equal(x.chunkIndex,i);assert.equal(x.measurementHash,P.canonicalHash(x.measurements.map((m)=>m.measurementHash)));});
  if(chunks.some((x)=>x.resourceCensored||x.measuredRoots!==x.plannedRoots)){const result={schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,scientificLabel:"RESOURCE-CENSORED",scientificInferenceAuthorized:false,confirmatoryReuseAllowed:false,reason:"parallel-measurement-resource-cap",measuredRoots:chunks.reduce((s,x)=>s+x.measuredRoots,0),plannedRoots:selection.selected.length,provenance:prov};writeJson(path.join(outDir,"stage1-result.json"),result);return;}
  const measurements=chunks.flatMap((x)=>x.measurements).sort((a,b)=>a.selectedIndex-b.selectedIndex); assert.equal(measurements.length,selection.selected.length); measurements.forEach((m,i)=>assert.equal(m.selectedIndex,i));
  writeJson(path.join(outDir,"measurements.json"),{schemaVersion:1,stageId:spec.stageId,measurements,measurementSetHash:P.canonicalHash(measurements.map((m)=>m.measurementHash))});
  const account=Measurement.accounting(measurements); const readiness={exactRootMoveInterventionsWithinCap:account.interventions<=spec.readinessGates.maximumExactRootMoveInterventions,allReferenceTablesFinite:measurements.every((root)=>Number.isFinite(root.referenceSearch.bestScore)&&root.moves.every((move)=>Number.isFinite(move.d3ReferenceScore))),allPrimaryContinuationRowsAccounted:measurements.every((root)=>root.moves.every((move)=>move.continuation.primary.records.length===spec.continuation.primaryOpponentPolicy.replicatesPerExactRootMove)),totalContinuationRowsWithinPlan:account.totalContinuationRows<=spec.resourceCaps.maximumPlannedContinuationRows};
  if(!Object.values(readiness).every(Boolean)){const result={schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,scientificLabel:"NON-ESTIMABLE",scientificInferenceAuthorized:false,confirmatoryReuseAllowed:false,reason:"measurement-readiness-gate-failure",readiness,accounting:account,provenance:prov};writeJson(path.join(outDir,"stage1-result.json"),result);return;}
  const discovery=Discovery.discover(measurements,spec); writeJson(path.join(outDir,"discovery.json"),discovery);
  const chunkResource={sourceElapsedSeconds:null,selectionElapsedSeconds:control.resource.elapsedSeconds,measurementElapsedSecondsSum:chunks.reduce((s,x)=>s+x.resource.elapsedSeconds,0),maximumChunkRSSMiB:Math.max(control.resource.maxRSSMiB,...chunks.map((x)=>x.resource.maxRSSMiB))};
  const result={schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,scientificLabel:"EXPLORATORY-ONLY",scientificInferenceAuthorized:false,confirmatoryReuseAllowed:false,generatedGames:selection.generatedGames,uniqueHistoricalTrajectories:selection.uniqueHistoricalTrajectories,selectedRoots:selection.selected.length,phaseCounts:selection.phaseCounts,selectionHash:selection.selectionHash,accounting:account,readiness,candidateAuditCount:discovery.candidateAuditCount,candidatesPassingPromotionGates:discovery.candidatesPassingPromotionGates,supportEquivalenceRepresentativeCount:discovery.supportEquivalenceRepresentativeCount,promotedCandidateCount:discovery.promotedCandidateCount,promotedCandidates:discovery.promotedCandidates,discoveryHash:discovery.discoveryHash,zeroPromotedCandidatesAllowed:true,manualPromotionPerformed:false,resource:{elapsedSeconds:elapsed(startTime),maxRSSMiB:process.resourceUsage().maxRSS/1024,parallelChunkResource:chunkResource},provenance:prov}; result.resultHash=P.canonicalHash(result); writeJson(path.join(outDir,"stage1-result.json"),result); process.stdout.write(`${JSON.stringify(result,null,2)}\n`);
}

function main(){const args=argMap(process.argv.slice(2));const mode=args.mode;if(mode==="gate")return modeGate();if(mode==="source")return modeSource(args);if(mode==="select")return modeSelect(args);if(mode==="measure")return modeMeasure(args);if(mode==="finalize")return modeFinalize(args);throw new Error(`unknown mode ${mode}`);}
try{main();}catch(error){console.error(error.stack||error.message);process.exitCode=1;}
