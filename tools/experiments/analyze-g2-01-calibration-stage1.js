#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const C = require("./lib/g2-01-calibration-stage1-common.js");

const PHASES=["namua","mtaji"];
function readinessAudit(summary, verification, spec) {
  const g=spec.readinessGates;
  const checks={
    uniqueHistoricalTrajectories:{observed:summary.uniqueHistoricalTrajectories,minimum:g.minimumUniqueHistoricalTrajectories,passed:summary.uniqueHistoricalTrajectories>=g.minimumUniqueHistoricalTrajectories},
    selectedUniqueRawStates:{observed:summary.selectedUniqueRawStates,minimum:g.minimumSelectedUniqueRawStates,passed:summary.selectedUniqueRawStates>=g.minimumSelectedUniqueRawStates},
    namuaSelectedStates:{observed:summary.phaseCounts.namua,minimum:g.minimumNamuaSelectedStates,passed:summary.phaseCounts.namua>=g.minimumNamuaSelectedStates},
    mtajiSelectedStates:{observed:summary.phaseCounts.mtaji,minimum:g.minimumMtajiSelectedStates,passed:summary.phaseCounts.mtaji>=g.minimumMtajiSelectedStates},
    namuaDistinctStaticEvaluations:{observed:summary.distinctStaticEvaluationByPhase.namua,minimum:g.minimumDistinctStaticEvaluationsPerPhase,passed:summary.distinctStaticEvaluationByPhase.namua>=g.minimumDistinctStaticEvaluationsPerPhase},
    mtajiDistinctStaticEvaluations:{observed:summary.distinctStaticEvaluationByPhase.mtaji,minimum:g.minimumDistinctStaticEvaluationsPerPhase,passed:summary.distinctStaticEvaluationByPhase.mtaji>=g.minimumDistinctStaticEvaluationsPerPhase},
    namuaActorWins:{observed:summary.outcomeByPhase.namua.actorWins,minimum:g.minimumActorWinsPerPhase,passed:summary.outcomeByPhase.namua.actorWins>=g.minimumActorWinsPerPhase},
    namuaActorLosses:{observed:summary.outcomeByPhase.namua.actorLosses,minimum:g.minimumActorLossesPerPhase,passed:summary.outcomeByPhase.namua.actorLosses>=g.minimumActorLossesPerPhase},
    mtajiActorWins:{observed:summary.outcomeByPhase.mtaji.actorWins,minimum:g.minimumActorWinsPerPhase,passed:summary.outcomeByPhase.mtaji.actorWins>=g.minimumActorWinsPerPhase},
    mtajiActorLosses:{observed:summary.outcomeByPhase.mtaji.actorLosses,minimum:g.minimumActorLossesPerPhase,passed:summary.outcomeByPhase.mtaji.actorLosses>=g.minimumActorLossesPerPhase},
    administrativeTruncationRate:{observed:summary.administrativeTruncationRate,maximum:g.maximumAdministrativeTruncationRate,passed:summary.administrativeTruncationRate!==null&&summary.administrativeTruncationRate<=g.maximumAdministrativeTruncationRate},
    independentVerification:{observed:verification.passed,required:true,passed:verification.passed===true},
    measurementHashMatch:{observed:verification.measurementHashMatches,required:true,passed:verification.measurementHashMatches===true},
    selectionHashMatch:{observed:verification.selectionHashMatches,required:true,passed:verification.selectionHashMatches===true},
  };
  return {passed:Object.values(checks).every((x)=>x.passed),checks};
}
function parseArgs(argv){const o={output:C.DEFAULT_OUTPUT};for(let i=0;i<argv.length;i+=1){if(argv[i]==="--output")o.output=path.resolve(argv[++i]);else throw new Error(`Unknown argument: ${argv[i]}`);}return o;}
function metricSummary(rows,fit,spec){if(!rows.length)return{n:0,brier:null,logLoss:null};let b=0,l=0;for(const r of rows){const p=C.predictPava(fit,r.phase,r.z,spec);b+=(p-r.y)**2;l+=-(r.y*Math.log(p)+(1-r.y)*Math.log(1-p));}return{n:rows.length,brier:b/rows.length,logLoss:l/rows.length};}
function main(){
  const options=parseArgs(process.argv.slice(2)); const {spec,specSha256}=C.loadSpec();
  const generationPath=path.join(options.output,"generation-manifest.json"); const summaryPath=path.join(options.output,"stage1-selection-measurement-summary.json"); const verificationPath=path.join(options.output,"verification.json");
  const generation=C.readJson(generationPath), summary=C.readJson(summaryPath), verification=C.readJson(verificationPath);
  for(const a of [generation,summary,verification]) if(a.studyId!==spec.studyId||a.stageId!==spec.stageId||a.specSha256!==specSha256) throw new Error("Stage 1 artifact identity/spec mismatch");
  if(generation.games!==spec.population.games||generation.seedStart!==spec.population.seedStart||generation.seedEnd!==spec.population.seedEnd) throw new Error("Generation manifest population mismatch");
  const readiness=readinessAudit(summary,verification,spec);
  const files=fs.readdirSync(path.join(options.output,"measurements")).filter((n)=>/^selected-\d+\.json$/.test(n)).sort();
  if(files.length!==summary.selectedUniqueRawStates) throw new Error("Measurement file count mismatch before development fit");
  const measurements=files.map((n)=>C.readJson(path.join(options.output,"measurements",n)));
  const measurementHash=C.sha256(JSON.stringify(measurements));
  if(measurementHash!==summary.measurementHash||measurementHash!==verification.storedMeasurementHash) throw new Error("Measurement hash mismatch before development fit");
  const rows=measurements.filter((r)=>!r.administrativeTruncation).map((r)=>{
    if(![0,1].includes(r.actorWin)||!PHASES.includes(r.phase)) throw new Error("Invalid binary calibration row");
    return{historicalTrajectoryHash:r.historicalTrajectoryHash,rawStateKey:r.rawStateKey,phase:r.phase,z:r.staticBaoEvaluation/100,y:r.actorWin};
  });
  let fit=null,modelArtifact=null,modelArtifactSha256=null,developmentMetrics=null,baseRates=null;
  if(readiness.passed){
    fit=C.fitPhaseStratifiedPava(rows); if(!fit.eligible) throw new Error(`Frozen PAVA fit failed: ${fit.reason}`);
    baseRates=Object.fromEntries(PHASES.map((phase)=>{const pr=rows.filter((r)=>r.phase===phase);const wins=pr.filter((r)=>r.y===1).length;return[phase,{n:pr.length,actorWins:wins,actorLosses:pr.length-wins,actorWinRate:wins/pr.length,zMin:Math.min(...pr.map((r)=>r.z)),zMax:Math.max(...pr.map((r)=>r.z))}];}));
    developmentMetrics={pooled:metricSummary(rows,fit,spec),byPhase:Object.fromEntries(PHASES.map((p)=>[p,metricSummary(rows.filter((r)=>r.phase===p),fit,spec)]))};
    modelArtifact={schemaVersion:1,programLabel:spec.programLabel,researchGeneration:spec.researchGeneration,studyId:spec.studyId,stageId:spec.stageId,specSha256,
      modelFamily:spec.modelDevelopment.primaryFamily,fitSeparatelyByPhase:true,scoreTransform:spec.score.transform,
      predictionWithinSupport:spec.modelDevelopment.predictionWithinSupport,predictionBelowSupport:spec.modelDevelopment.predictionBelowSupport,predictionAboveSupport:spec.modelDevelopment.predictionAboveSupport,
      formalPredictionClipping:spec.modelDevelopment.formalPredictionClipping,phaseFits:fit.phaseFits,phaseOnlyReference:baseRates,
      refitOnStage2Allowed:false,scientificInferenceAuthorized:false,formalCalibrationClaimAuthorized:false};
    const modelText=`${JSON.stringify(modelArtifact,null,2)}\n`; modelArtifactSha256=C.sha256(modelText); fs.writeFileSync(path.join(options.output,"stage1-frozen-mapping.json"),modelText);
  }
  const decision=readiness.passed?spec.stage1Decision.ifAllReadinessGatesPass:spec.stage1Decision.ifAnyReadinessGateFails;
  const result={schemaVersion:1,programLabel:spec.programLabel,researchGeneration:spec.researchGeneration,studyId:spec.studyId,stageId:spec.stageId,specSha256,
    scientificInferenceAuthorized:false,confirmatoryReuseAllowed:false,stage1Decision:decision,stage2GenerationAuthorized:false,
    inputAudit:{generationManifestSha256:C.sha256(fs.readFileSync(generationPath)),selectionMeasurementSummarySha256:C.sha256(fs.readFileSync(summaryPath)),verificationSha256:C.sha256(fs.readFileSync(verificationPath)),measurementHash,selectedBinaryRows:rows.length,readiness},
    model:{family:spec.modelDevelopment.primaryFamily,candidateFamilySelectionPerformed:false,fitEligible:fit?fit.eligible:false,modelArtifactPath:fit?"stage1-frozen-mapping.json":null,modelArtifactSha256,developmentMetrics,baseRates},
    interpretationBoundary:{stage1FormalCalibrationClaimAuthorized:false,gameTheoreticValueClaimAuthorized:false,humanClaimAuthorized:false,causalClaimAuthorized:false,priorStudyDecisionRevisionAuthorized:false,publicAiQualityClaimAuthorized:false},
    nextStage:{stage2AuthorizedByThisResultAlone:false,requiresExplicitAuthorization:true,reason:readiness.passed?"Stage 1 readiness passed and model is frozen; Stage 2 still requires its own technical smoke, source/model hash freeze, and explicit authorization.":"Stage 1 readiness failed; Stage 2 must remain NOT-AUTHORIZED-NOT-EXECUTED."}};
  C.writeJson(path.join(options.output,"stage1-development-result.json"),result); console.log(JSON.stringify(result,null,2));
}
try{main();}catch(e){console.error(e.stack||e.message);process.exitCode=1;}
