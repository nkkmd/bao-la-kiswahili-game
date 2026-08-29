"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const R = require("./lib/rcpr-production.js");
const P = require("./lib/rcpr-stage1-production.js");

const ROOT=path.resolve(__dirname,"../..");
const SPEC_PATH=path.join(ROOT,"doc/rich-critical-position-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const AUTH_PATH=path.join(ROOT,"doc/rich-critical-position-representation/authorizations/STAGE_1_EXECUTE.json");
const DEFAULT_OUT=path.join(ROOT,"artifacts/local/rich-critical-position-representation/stage1-implementation-smoke-v1");
function ensure(c,m){if(!c)throw new Error(m);}
function clone(v){return JSON.parse(JSON.stringify(v));}
function sha256File(p){return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");}
function parseOut(){const at=process.argv.indexOf("--out");return at>=0&&process.argv[at+1]?path.resolve(process.argv[at+1]):DEFAULT_OUT;}
function writeJson(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,`${JSON.stringify(v,null,2)}\n`,"utf8");}
function technicalRandom(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/0x100000000;};}

function fixtureSearch(){
  const need={namua:1,mtaji:1};const found={namua:[],mtaji:[]};
  for(let offset=0;offset<256&&(found.namua.length<1||found.mtaji.length<1);offset+=1){
    const seed=28600001+offset;const rng=technicalRandom(seed);let state=E.initialState();const history=[];
    for(let ply=0;ply<160&&state.winner===null;ply+=1){
      const legal=R.exactLegalMoves(state);const phase=state.phase;
      if(found[phase].length<need[phase]&&history.length>=4&&legal.length>=2){
        const preRootHistory=history.slice(-4).map(clone);R.validatePreRootHistory(state,preRootHistory);
        found[phase].push({fixtureId:`${phase.toUpperCase()}-S1-SMOKE`,sourceSeed:seed,sourcePly:ply,phase,root:clone(state),preRootHistory});
      }
      const move=legal[Math.floor(rng()*legal.length)];history.push({state:clone(state),move:clone(move)});if(history.length>4)history.shift();state=E.applyMove(state,move).state;
    }
  }
  ensure(found.namua.length===1&&found.mtaji.length===1,"failed to find two-phase technical fixtures");
  return [found.namua[0],found.mtaji[0]];
}

function technicalItems(fixtures){
  return fixtures.map((fixture)=>{
    const historicalTrajectoryHash=P.canonicalHash({technicalFixture:fixture.fixtureId,sourceSeed:fixture.sourceSeed,sourcePly:fixture.sourcePly});
    const openingPrefixHash=P.canonicalHash({technicalFixture:fixture.fixtureId,opening:false});
    const historyWindowHash=P.historyWindowHash(fixture.preRootHistory);
    const rawStateKey=R.rawStateKey(fixture.root);
    return {...fixture,gameIndex:-1,seed:fixture.sourceSeed,generationStratum:"TECHNICAL-FIXTURE",rawStateKey,historicalTrajectoryHash,openingPrefixHash,historyWindowHash,
      representationRowIdentity:P.canonicalHash({historicalTrajectoryHash,rawStateKey,ply:fixture.sourcePly,historyWindowHash})};
  });
}

function trajectoryForFold(targetFold,spec,label,phase,ordinal){
  for(let n=0;n<100000;n+=1){const token=`SMOKE|${targetFold}|${label}|${phase}|${ordinal}|${n}`;if(P.foldForTrajectory(token,spec)===targetFold)return token;}
  throw new Error("unable to construct fold-balanced synthetic trajectory");
}

function syntheticRows(spec){
  const families=Object.keys(spec.developmentModel.candidateFamilySets).filter((id)=>id.endsWith("_ONLY"))
    .map((id)=>spec.developmentModel.candidateFamilySets[id][0]);
  const featureNames=families.map((family)=>`${family}.smokeScalar`).sort();
  const rows=[];let serial=0;
  for(let fold=0;fold<5;fold+=1)for(const high of [false,true])for(const phase of ["namua","mtaji"])for(let k=0;k<5;k+=1){
    const historicalTrajectoryHash=trajectoryForFold(fold,spec,high,phase,k);
    const numericFeatures=Object.fromEntries(featureNames.map((name,index)=>[name,(high?2:-2)+(index*0.001)+(k*0.00001)]));
    rows.push({serial:serial++,phase,historicalTrajectoryHash,representationRowIdentity:P.canonicalHash({historicalTrajectoryHash,serial}),primaryEstimable:true,highDivergence:high,
      representation:{featureNames,numericFeatures}});
  }
  ensure(rows.length===100,"unexpected synthetic row count");
  return rows;
}

function run(){
  const spec=JSON.parse(fs.readFileSync(SPEC_PATH,"utf8"));
  ensure(spec.sourcePopulation.seedStart===28610001&&spec.sourcePopulation.seedEnd===28613072,"frozen Stage 1 seed block drift");
  ensure(spec.sourcePopulation.games===3072,"frozen Stage 1 game count drift");
  ensure(spec.representation.stage0FeatureSchemaSha256==="1d9dd5e0ea42dc7bcdb7a385077397e08385fcdb4eeb695fc5625501dbc8526b","feature schema contract drift");
  ensure(spec.criticalityMeasurement.replicatesPerExactRootMove===64,"replicate contract drift");
  ensure(spec.criticalityMeasurement.highDivergenceThresholdInclusive===0.30,"D_range threshold drift");
  ensure(!fs.existsSync(AUTH_PATH),"smoke must execute before Stage 1 scientific authorization exists");

  const smokeSpec=clone(spec);
  smokeSpec.sourcePopulation.games=6;smokeSpec.sourcePopulation.seedStart=28600001;smokeSpec.sourcePopulation.seedEnd=28600006;smokeSpec.sourcePopulation.maxPly=16;
  smokeSpec.criticalityMeasurement.replicatesPerExactRootMove=1;smokeSpec.criticalityMeasurement.maximumPostRootContinuationPlies=12;
  ensure(smokeSpec.sourcePopulation.seedEnd<spec.sourcePopulation.seedStart,"technical smoke overlaps scientific Stage 1 seed block");

  const games=Array.from({length:6},(_,gameIndex)=>P.runGame(smokeSpec,gameIndex));
  const gameSignatures=games.map((record)=>({gameSummary:record.gameSummary,candidate:record.candidate?{
    seed:record.candidate.seed,phase:record.candidate.phase,ply:record.candidate.ply,rawStateKey:record.candidate.rawStateKey,
    historicalTrajectoryHash:record.candidate.historicalTrajectoryHash,openingPrefixHash:record.candidate.openingPrefixHash,historyWindowHash:record.candidate.historyWindowHash,
    representationRowIdentity:record.candidate.representationRowIdentity,selectionRank:record.candidate.selectionRank}:null}));
  const selection=P.selectRoots(games,smokeSpec);

  const fixtures=fixtureSearch();const items=technicalItems(fixtures);const represented=P.materializeRepresentations(items,smokeSpec);
  const measurements=represented.map((item)=>P.measureRoot(item,smokeSpec,{replicates:1}));
  const fixtureSignatures=represented.map((item,index)=>({fixtureId:item.fixtureId,phase:item.phase,rawStateKey:item.rawStateKey,historyWindowHash:item.historyWindowHash,
    featureSchemaSha256:item.representation.featureSchemaSha256,featureVectorSha256:item.featureVectorSha256,measurementSha256:measurements[index].measurementSha256,
    primaryEstimable:measurements[index].primaryEstimable,dRange:measurements[index].dRange,highDivergence:measurements[index].highDivergence}));

  const model=P.developModel(syntheticRows(spec),spec);ensure(model.estimable===true,"synthetic model smoke not estimable");
  ensure(model.overallAuc===1,"synthetic model AUROC control failed");ensure(model.top3FoldStabilityCount===5,"synthetic fold stability control failed");
  ensure(model.operatingThreshold&&model.operatingThreshold.phasePositive.namua>=20&&model.operatingThreshold.phasePositive.mtaji>=20,"synthetic threshold support control failed");

  const result={schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,scientificInferenceAuthorized:false,scientificOutcomeGenerated:false,
    scientificStage1SeedBlockConsumed:false,specSha256:sha256File(SPEC_PATH),technicalSeedBlock:[28600001,28600006],
    controls:{frozenSpecContract:true,authorizationAbsent:true,scientificSeedSeparation:true,twoPhaseTechnicalFixtures:true,finite310FeatureVectors:represented.every((item)=>Object.values(item.representation.numericFeatures).length===310&&Object.values(item.representation.numericFeatures).every(Number.isFinite)),syntheticModelAucOne:model.overallAuc===1},
    gameSignatures,selectionHash:selection.selectionHash,fixtureSignatures,syntheticModel:{selectedFamilySetId:model.selectedFamilySetId,overallAuc:model.overallAuc,phaseAuc:model.phaseAuc,foldAuc:model.foldAuc,top3FoldStabilityCount:model.top3FoldStabilityCount,operatingThreshold:model.operatingThreshold,modelDevelopmentSha256:model.modelDevelopmentSha256}};
  result.productionSmokeSha256=P.canonicalHash(result);const out=parseOut();fs.rmSync(out,{recursive:true,force:true});writeJson(path.join(out,"production-smoke.json"),result);
  console.log(JSON.stringify({status:"PASS-AWAITING-INDEPENDENT-SMOKE",specSha256:result.specSha256,gameCount:games.length,fixtureCount:fixtures.length,featureWidth:Object.keys(represented[0].representation.numericFeatures).length,syntheticModelAuc:model.overallAuc,productionSmokeSha256:result.productionSmokeSha256},null,2));
}
try{run();}catch(error){console.error(error.stack||error.message||String(error));process.exitCode=1;}
