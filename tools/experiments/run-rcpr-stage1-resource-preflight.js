"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const E = require("../../public/engine.js");
const R = require("./lib/rcpr-production.js");
const F = require("./lib/rcpr-independent.js");
const P = require("./lib/rcpr-stage1-production.js");
const I = require("./lib/rcpr-stage1-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/rich-critical-position-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/rich-critical-position-representation/authorizations/STAGE_1_EXECUTE.json");
const DEFAULT_OUT = path.join(ROOT, "artifacts/local/rich-critical-position-representation/stage1-resource-preflight-v1");
function ensure(c,m){if(!c)throw new Error(m);}
function clone(v){return JSON.parse(JSON.stringify(v));}
function parseOut(){const at=process.argv.indexOf("--out");return at>=0&&process.argv[at+1]?path.resolve(process.argv[at+1]):DEFAULT_OUT;}
function writeJson(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,`${JSON.stringify(v,null,2)}\n`,"utf8");}
function technicalRandom(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return(x>>>0)/0x100000000;};}

function fixtureSearch(){
  const found={namua:[],mtaji:[]};
  for(let offset=0;offset<256&&(found.namua.length<1||found.mtaji.length<1);offset+=1){
    const seed=28600001+offset;const rng=technicalRandom(seed);let state=E.initialState();const history=[];
    for(let ply=0;ply<160&&state.winner===null;ply+=1){
      const legal=R.exactLegalMoves(state);const phase=state.phase;
      if(found[phase].length<1&&history.length>=4&&legal.length>=2){
        const preRootHistory=history.slice(-4).map(clone);R.validatePreRootHistory(state,preRootHistory);
        found[phase].push({fixtureId:`${phase.toUpperCase()}-S1-RESOURCE`,sourceSeed:seed,sourcePly:ply,phase,root:clone(state),preRootHistory});
      }
      const move=legal[Math.floor(rng()*legal.length)];history.push({state:clone(state),move:clone(move)});if(history.length>4)history.shift();state=E.applyMove(state,move).state;
    }
  }
  ensure(found.namua.length===1&&found.mtaji.length===1,"resource fixture search failed");
  return [found.namua[0],found.mtaji[0]];
}

function productionItem(fixture){
  const historicalTrajectoryHash=P.canonicalHash({technicalFixture:fixture.fixtureId,sourceSeed:fixture.sourceSeed,sourcePly:fixture.sourcePly});
  const openingPrefixHash=P.canonicalHash({technicalFixture:fixture.fixtureId,opening:false});
  const historyWindowHash=P.historyWindowHash(fixture.preRootHistory);const rawStateKey=R.rawStateKey(fixture.root);
  return {...fixture,gameIndex:-1,seed:fixture.sourceSeed,generationStratum:"TECHNICAL-RESOURCE",rawStateKey,historicalTrajectoryHash,openingPrefixHash,historyWindowHash,
    representationRowIdentity:P.canonicalHash({historicalTrajectoryHash,rawStateKey,ply:fixture.sourcePly,historyWindowHash})};
}
function independentItem(fixture){
  const historicalTrajectoryHash=I.canonicalHash({technicalFixture:fixture.fixtureId,sourceSeed:fixture.sourceSeed,sourcePly:fixture.sourcePly});
  const openingPrefixHash=I.canonicalHash({technicalFixture:fixture.fixtureId,opening:false});
  const historyWindowHash=I.historyWindowHash(fixture.preRootHistory);const rawStateKey=F.independentRawKey(fixture.root);
  return {...fixture,gameIndex:-1,seed:fixture.sourceSeed,generationStratum:"TECHNICAL-RESOURCE",rawStateKey,historicalTrajectoryHash,openingPrefixHash,historyWindowHash,
    representationRowIdentity:I.canonicalHash({historicalTrajectoryHash,rawStateKey,ply:fixture.sourcePly,historyWindowHash})};
}

function summarizeTiming(elapsedMs, measurement, replicates){
  const exactMoveReplicates=measurement.legalMoveCount*replicates;
  return {elapsedMs,legalMoveCount:measurement.legalMoveCount,exactMoveReplicates,msPerExactMoveReplicate:elapsedMs/exactMoveReplicates,
    primaryEstimable:measurement.primaryEstimable,dRange:measurement.dRange,unfinishedMoveCount:measurement.moves.filter((m)=>m.unfinished>0).length};
}
function projection(rows, targetRoots, replicates, legalMovesPerRoot){
  const rates=rows.map((r)=>r.msPerExactMoveReplicate).sort((a,b)=>a-b);
  const mean=rates.reduce((a,b)=>a+b,0)/rates.length;const min=rates[0];const max=rates[rates.length-1];
  const minutes=(rate,moves)=>rate*targetRoots*moves*replicates/60000;
  return {sampleRatesMs:rates,meanRateMs:mean,projectedMinutesAtMinimumTwoLegalMoves:{fastestSample:minutes(min,2),meanSample:minutes(mean,2),slowestSample:minutes(max,2)},
    projectedMinutesAtObservedMeanLegalMoves:{legalMovesPerRoot,fastestSample:minutes(min,legalMovesPerRoot),meanSample:minutes(mean,legalMovesPerRoot),slowestSample:minutes(max,legalMovesPerRoot)}};
}

function run(){
  ensure(!fs.existsSync(AUTH_PATH),"resource preflight must precede Stage 1 authorization");
  const spec=JSON.parse(fs.readFileSync(SPEC_PATH,"utf8"));
  ensure(spec.sourcePopulation.seedStart===28610001,"scientific seed block drift");
  const fixtures=fixtureSearch();const replicates=2;const production=[];const independent=[];
  for(const fixture of fixtures){
    const pItem=productionItem(fixture);P.materializeRepresentations([pItem],spec);
    let t=performance.now();const pm=P.measureRoot(pItem,spec,{replicates});production.push({fixtureId:fixture.fixtureId,phase:fixture.phase,...summarizeTiming(performance.now()-t,pm,replicates)});
    const iItem=independentItem(fixture);I.materializeRepresentations([iItem],spec);
    t=performance.now();const im=I.measureRoot(iItem,spec,{replicates});independent.push({fixtureId:fixture.fixtureId,phase:fixture.phase,...summarizeTiming(performance.now()-t,im,replicates)});
    ensure(P.canonicalHash(pm)===I.canonicalHash(im),`production/independent resource measurement mismatch: ${fixture.fixtureId}`);
  }
  const observedMeanLegal=production.reduce((a,b)=>a+b.legalMoveCount,0)/production.length;
  const result={schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,scientificInferenceAuthorized:false,scientificOutcomeGenerated:false,scientificStage1SeedBlockConsumed:false,
    technicalSeedSource:"28600001+ deterministic technical fixture search",replicatesPerExactMove:replicates,maximumPostRootContinuationPlies:spec.criticalityMeasurement.maximumPostRootContinuationPlies,
    production,independent,productionProjection:projection(production,spec.rootSelection.phaseQuota.namua+spec.rootSelection.phaseQuota.mtaji,spec.criticalityMeasurement.replicatesPerExactRootMove,observedMeanLegal),
    independentProjection:projection(independent,spec.rootSelection.phaseQuota.namua+spec.rootSelection.phaseQuota.mtaji,spec.criticalityMeasurement.replicatesPerExactRootMove,observedMeanLegal)};
  result.resourcePreflightSha256=P.canonicalHash(result);const out=parseOut();fs.rmSync(out,{recursive:true,force:true});writeJson(path.join(out,"resource-preflight.json"),result);
  console.log(JSON.stringify(result,null,2));
}
try{run();}catch(error){console.error(error.stack||error.message||String(error));process.exitCode=1;}
