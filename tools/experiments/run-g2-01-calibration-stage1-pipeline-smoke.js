#!/usr/bin/env node
"use strict";
const C=require("./lib/g2-01-calibration-stage1-common.js");
function ensure(ok,msg){if(!ok)throw new Error(msg);}
function main(){
  const loaded=C.loadSpec(); const {spec,specSha256}=loaded;
  let authorizationClosed=false; try{C.loadAuthorization(spec,specSha256);}catch(e){authorizationClosed=/authorization file absent|Invalid Stage 1 authorization/.test(e.message);}
  ensure(authorizationClosed,"Stage 1 authorization firewall is not closed before authorization");
  const technicalSeeds=[24010001,24010002,24010003,24010004];
  const games=technicalSeeds.map((seed,i)=>C.runGame(spec,specSha256,i,seed,"peocr-s1-smoke"));
  const repeat=C.runGame(spec,specSha256,0,technicalSeeds[0],"peocr-s1-smoke");
  ensure(C.sha256(JSON.stringify(games[0]))===C.sha256(JSON.stringify(repeat)),"technical runGame is not deterministic");
  ensure(games.every((g)=>g.observations.every((o)=>typeof o.identity.rawStateKey==="string"&&o.identity.rawStateKey.length===64)),"RAW state keys missing");
  ensure(games.every((g)=>g.openingPrefix.length===spec.population.opening.plies),"opening prefix length mismatch");
  const selection=C.selectStates(games,spec); ensure(selection.selected.length>0,"technical selection empty");
  const measurements=selection.selected.map((row)=>C.measureSelected(row,spec)); ensure(measurements.every((r)=>Number.isFinite(r.staticBaoEvaluation)),"static evaluation nonfinite");
  const synthetic=[
    {phase:"namua",z:-2,y:0,historicalTrajectoryHash:"a"},{phase:"namua",z:-1,y:0,historicalTrajectoryHash:"b"},{phase:"namua",z:1,y:1,historicalTrajectoryHash:"c"},{phase:"namua",z:2,y:1,historicalTrajectoryHash:"d"},
    {phase:"mtaji",z:-3,y:0,historicalTrajectoryHash:"e"},{phase:"mtaji",z:-1,y:0,historicalTrajectoryHash:"f"},{phase:"mtaji",z:1,y:1,historicalTrajectoryHash:"g"},{phase:"mtaji",z:3,y:1,historicalTrajectoryHash:"h"},
  ];
  const fit=C.fitPhaseStratifiedPava(synthetic); ensure(fit.eligible,"PAVA synthetic fit failed");
  for(const phase of ["namua","mtaji"]){const blocks=fit.phaseFits[phase].blocks;for(let i=1;i<blocks.length;i+=1)ensure(blocks[i-1].mean<=blocks[i].mean,"PAVA monotonicity failed");
    const low=C.predictPava(fit,phase,-999,spec), high=C.predictPava(fit,phase,999,spec);ensure(low>=0.01&&high<=0.99,"clipping failed");}
  const sourceFileSha256=C.sourceFileSha256();
  const result={schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,specSha256,scientificInferenceAuthorized:false,confirmatoryReuseAllowed:false,
    passed:true,authorizationClosed,technicalSeeds,technicalGames:games.length,technicalSelectedStates:selection.selected.length,
    phaseCoverage:[...new Set(games.flatMap((g)=>g.observations.filter((o)=>!o.terminal).map((o)=>o.phase)))].sort(),sourceFileSha256};
  console.log(JSON.stringify(result,null,2));
}
try{main();}catch(e){console.error(e.stack||e.message);process.exitCode=1;}
