#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");
const Engine = require("../../public/engine.js");
const Weights = require("../../public/ai-weights.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC = path.join(ROOT, "doc/ai-engineering/public-ai-improvement-program-2/candidates/PBAI-C009-v1-feature-off-equivalence-spec.json");
function assert(v, m) { if (!v) throw new Error(m); }
function copy(v) { return JSON.parse(JSON.stringify(v)); }
function digest(v) { return crypto.createHash("sha256").update(v).digest("hex"); }
function keyMove(m) { return m ? [m.type,m.phase,m.row,m.index,m.direction,m.side,m.houseChoice,Boolean(m.houseTwo)].join(":") : ""; }
function strictState(s) {
  assert(Array.isArray(s.pending) && s.pending.length === 2, "pending missing");
  return { pits:s.pits.map(r=>r.map(x=>x.slice())), reserve:s.reserve.slice(), houseOwned:s.houseOwned.slice(), player:s.player, phase:s.phase, winner:s.winner, pending:s.pending.slice() };
}
function stateKey(s) { return digest(JSON.stringify(strictState(s))); }
function moves(s) { return Engine.moveVariants(s).slice().sort((a,b)=>keyMove(a).localeCompare(keyMove(b))); }
function rng(seed) {
  let n=seed>>>0;
  return ()=>{ n+=0x6D2B79F5; let x=n; x=Math.imul(x^(x>>>15),x|1); x^=x+Math.imul(x^(x>>>7),x|61); return ((x^(x>>>14))>>>0)/4294967296; };
}
function phaseFor(seed) { return seed%2===1 ? "namua" : "mtaji"; }
function rootFor(spec, seed) {
  const wanted=phaseFor(seed), random=rng(seed);
  let s=Engine.initialState();
  for(let ply=0; ply<=spec.population.maximumGamePlies; ply+=1) {
    if(s.winner===null && s.phase===wanted && moves(s).length>=2) return {seed,ply,phase:wanted,rawKey:stateKey(s),state:copy(s)};
    if(s.winner!==null || ply===spec.population.maximumGamePlies) return null;
    const legal=moves(s); if(!legal.length) return null;
    s=Engine.applyMove(s,legal[Math.floor(random()*legal.length)]).state;
  }
  return null;
}
function population(spec) {
  const n=[],m=[]; let failures=0;
  for(let seed=spec.population.seedStart; seed<=spec.population.seedEnd; seed+=1) {
    try { const r=rootFor(spec,seed); if(r) (r.phase==="namua"?n:m).push(r); } catch (_) { failures+=1; }
  }
  n.sort((a,b)=>a.seed-b.seed||a.ply-b.ply); m.sort((a,b)=>a.seed-b.seed||a.ply-b.ply);
  assert(failures<=spec.gate.rootSelectionTechnicalFailuresMaximum,`root failures ${failures}`);
  assert(n.length>=spec.population.targetPerPhase && m.length>=spec.population.targetPerPhase,"insufficient phase roots");
  return { n,m,failures,selected:[...n.slice(0,spec.population.targetPerPhase),...m.slice(0,spec.population.targetPerPhase)] };
}
function vmAi(source,name) {
  const module={exports:{}};
  const math=Object.create(Math); math.random=()=>0;
  const box={module,exports:module.exports,BaoEngine:Engine,BaoAIWeights:Weights,performance:{now:()=>0},Math:math,console,
    require(q){ if(q==="./engine.js")return Engine; if(q==="./ai-weights.js")return Weights; throw new Error(`unexpected require ${q}`); }};
  box.globalThis=box; vm.createContext(box); vm.runInContext(source,box,{filename:name}); return module.exports;
}
function run(ai,state,condition,options) {
  try { const r=ai.analyzeMove(copy(state),condition.level,()=>0,options); return {ok:true,move:copy(r.move),moveKey:ai.moveKey(r.move),stats:copy(r.stats),candidateDiagnosticPresent:Object.prototype.hasOwnProperty.call(r.stats,"pbaiC009")}; }
  catch(e){ return {ok:false,error:{name:e?.name||"Error",message:e?.message||String(e)}}; }
}
function arg(argv,n){const i=argv.indexOf(n);assert(i>=0&&argv[i+1],`${n} required`);return path.resolve(argv[i+1]);}
function main(argv=process.argv.slice(2)) {
  const baselinePath=arg(argv,"--baseline-ai"), productionPath=arg(argv,"--production"), output=arg(argv,"--output");
  const specText=fs.readFileSync(SPEC,"utf8"), spec=JSON.parse(specText);
  const baseText=fs.readFileSync(baselinePath,"utf8"), candidateText=fs.readFileSync(path.join(ROOT,"public/ai.js"),"utf8");
  assert(digest(baseText)===spec.baselineAiSha256,"baseline hash mismatch");
  assert(digest(fs.readFileSync(path.join(ROOT,"public/engine.js")))===spec.publicEngineSha256,"engine hash mismatch");
  assert(candidateText.includes(spec.candidateFeatureFlag),"feature missing");
  const base=vmAi(baseText,"independent-baseline.js"), cand=vmAi(candidateText,"independent-candidate.js"), pop=population(spec);
  const rows=[]; let mismatches=0,diagnostics=0;
  for(const root of pop.selected) for(const condition of spec.searchConditions) {
    const options={...spec.commonSearchOptions,maxDepth:condition.maxDepth,timeLimitMs:condition.timeLimitMs==="Infinity"?Infinity:condition.timeLimitMs,[spec.candidateFeatureFlag]:false};
    const a=run(base,root.state,condition,options), b=run(cand,root.state,condition,options);
    if(b.ok&&b.candidateDiagnosticPresent) diagnostics+=1;
    const equal=JSON.stringify(a)===JSON.stringify(b); if(!equal)mismatches+=1;
    rows.push({seed:root.seed,ply:root.ply,phase:root.phase,rawKey:root.rawKey,conditionId:condition.id,equal,baseline:a,candidate:b});
  }
  const passed=pop.failures<=spec.gate.rootSelectionTechnicalFailuresMaximum&&mismatches<=spec.gate.comparisonMismatchesMaximum&&diagnostics<=spec.gate.candidateDiagnosticPresenceMaximum;
  const core={
    specId:spec.specId,specSha256:digest(specText),baselineAiSha256:digest(baseText),candidateAiSha256:digest(candidateText),engineSha256:digest(fs.readFileSync(path.join(ROOT,"public/engine.js"))),
    rootSelectionRule:"first eligible state per trajectory; first targetPerPhase roots by ascending seed",
    population:{sourceSeeds:spec.population.seedCount,availableNamua:pop.n.length,availableMtaji:pop.m.length,selectedRoots:pop.selected.length,selectedNamua:pop.selected.filter(x=>x.phase==="namua").length,selectedMtaji:pop.selected.filter(x=>x.phase==="mtaji").length,rootSelectionTechnicalFailures:pop.failures,selectedRootDigest:digest(JSON.stringify(pop.selected.map(x=>({seed:x.seed,ply:x.ply,phase:x.phase,rawKey:x.rawKey}))))},
    measurement:{conditionsPerRoot:spec.searchConditions.length,totalComparisons:rows.length,comparisonMismatches:mismatches,candidateDiagnosticPresence:diagnostics},
    decision:{passed,disposition:passed?spec.gate.decisionMapping.allPass:spec.gate.decisionMapping.anyFailure,developmentBenefitExecutionAuthorizedByThisResult:passed,validationAuthorized:false,releaseHoldoutAuthorized:false}
  };
  const coreHash=digest(JSON.stringify(core));
  const prod=JSON.parse(fs.readFileSync(productionPath,"utf8"));
  const rowEquality=JSON.stringify(rows)===JSON.stringify(prod.comparisons);
  const productionCoreHash=prod.deterministicCoreSha256;
  const result={schemaVersion:1,program:spec.program,stage:"PBAI-P2-E-TECHNICAL-PREFLIGHT-INDEPENDENT-VERIFICATION",candidateVersion:spec.candidateVersion,productionRunnerImported:false,productionSelectedRootsTrustedWithoutReconstruction:false,fullComparisonRowsEquality:rowEquality,productionDeterministicCoreSha256:productionCoreHash,independentDeterministicCoreSha256:coreHash,deterministicCoreEquality:productionCoreHash===coreHash,verifiedDisposition:core.decision.disposition,passed:rowEquality&&productionCoreHash===coreHash&&passed};
  fs.mkdirSync(path.dirname(output),{recursive:true}); fs.writeFileSync(output,`${JSON.stringify(result,null,2)}\n`);
  console.log(JSON.stringify(result,null,2)); if(!result.passed)process.exitCode=1;
}
if(require.main===module)main();
