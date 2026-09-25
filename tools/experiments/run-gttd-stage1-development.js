#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const GP = require("./lib/gcld-production.js");
const GI = require("./lib/gcld-independent.js");
const TP = require("./lib/lgttci-compatibility-production.js");
const TI = require("./lib/lgttci-compatibility-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/geometry-trajectory-dynamics-transfer");
const G3 = path.join(ROOT, "doc/geometry-conditioned-longitudinal-dynamics");
const STUDY = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STUDY_1_SPEC.json"), "utf8"));
const SPEC = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STAGE_1_DEVELOPMENT_SPEC.json"), "utf8"));
const FIREWALL = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/UPSTREAM_IDENTITY_FIREWALL.json"), "utf8"));
const AUTH = JSON.parse(fs.readFileSync(path.join(DOC, "authorizations/STAGE_1_AUTHORIZATION.json"), "utf8"));
const TARGETS = [
  "C1-DIRECTIONALITY-PATH-EFFICIENCY",
  "C2-PERSISTENCE-LAG-DISTANCE-GRADIENT",
  "C3-RETURN-FRACTION",
  "C5-FIRST-ORDER-DIRECTIONAL-PATH-DEPENDENCE"
];

function need(x,m){ if(!x) throw new Error(m); }
function stable(v){
  if(v===null || typeof v!=="object") return JSON.stringify(v);
  if(Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  return `{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`;
}
function same(a,b,m){ need(stable(a)===stable(b),m); }
function sha256Bytes(b){ return crypto.createHash("sha256").update(b).digest("hex"); }
function sha256Text(s){ return sha256Bytes(Buffer.from(String(s),"utf8")); }
function fileSha256(p){ return sha256Bytes(fs.readFileSync(p)); }
function setDigest(set){ return sha256Text([...set].map(String).sort().join("\n")); }
function countInc(o,k){ o[k]=(o[k]||0)+1; }
function rangeContains(range,s){ const [a,b]=range.split("..").map(Number); return s>=a&&s<=b; }
function policyFor(seed){ return ((seed-SPEC.seedBlock.start)%2===0)?TP.P1:TP.P2; }
function targetOnly(summary){
  const out={};
  for(const id of TARGETS) out[id]={actual:summary.actual[id],controlMedian:summary.controlMedians[id],contrast:summary.contrasts[id]};
  return out;
}
function replayResult(lib,policyId,seed){
  try{return{ok:true,value:lib.replay(E,policyId,seed,72)}}catch(error){return{ok:false,error:String(error&&error.message?error.message:error)}}
}
function publicReplay(x){
  return {policyId:x.policyId,seed:x.seed,moveKeys:x.moveKeys,trajectorySha256:x.trajectorySha256,terminal:x.terminal,rows:x.rows.map(r=>({ply:r.ply,phase:r.phase,terminal:r.terminal,rootLegalWidth:r.rootLegalWidth,rawStateSha256:r.rawStateSha256}))};
}
function checkpointRows(x){
  const map=new Map(x.rows.map(r=>[r.ply,r]));
  return STUDY.longitudinalContract.checkpointPlies.map(ply=>{
    const r=map.get(ply); need(r && !r.terminal,`missing/nonterminal checkpoint seed=${x.seed} ply=${ply}`); return r;
  });
}
function complete72(x){ return x.rows.length===72 && x.terminal===false && x.rows[71].ply===72 && x.rows[71].terminal===false; }
function identityRow(policyId,seed,replay,cps,prefix){
  return {policyId,sourceSeed:seed,sourceTrajectorySha256:replay.trajectorySha256,openingPrefixSha256:prefix,moveCount:replay.moveKeys.length,checkpointRoots:cps.map(r=>({ply:r.ply,rootRawSha256:r.rawStateSha256}))};
}
function materializeFirewall(g4dir){
  need(FIREWALL.status==="FROZEN-PRE-FRESH","firewall not frozen");
  need(FIREWALL.scientificOutcomeFieldsRetained===false,"firewall retains scientific fields");
  const sets={seed:new Set(),trajectory:new Set(),prefix:new Set(),root:new Set()};
  for(const x of FIREWALL.excludedSeedNamespaces){ const [a,b]=x.range.split("..").map(Number); for(let s=a;s<=b;s++) sets.seed.add(String(s)); }

  const g3s1Path=path.join(G3,"results/stage-1/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json");
  const g3s1Meta=FIREWALL.identitySources.g3_10_stage1;
  need(fileSha256(g3s1Path)===g3s1Meta.fileSha256,"G3-10 Stage1 identity file hash mismatch");
  const g3s1=JSON.parse(fs.readFileSync(g3s1Path,"utf8"));
  need(g3s1.scientificOutcomeFieldsRetained===false && g3s1.identityRows.length===g3s1Meta.identityRowCount,"G3-10 Stage1 identity contract mismatch");
  for(const r of g3s1.identityRows){ sets.seed.add(String(r.sourceSeed)); sets.trajectory.add(r.sourceTrajectorySha256); sets.prefix.add(r.openingPrefixSha256); for(const cp of r.checkpointRoots||[]) sets.root.add(cp.rootRawSha256); }

  const g3s2Path=path.join(G3,"results/stage-2/STAGE_2_CANDIDATE_MANIFEST.json");
  const g3s2Meta=FIREWALL.identitySources.g3_10_stage2;
  need(fileSha256(g3s2Path)===g3s2Meta.fileSha256,"G3-10 Stage2 candidate file hash mismatch");
  const g3s2=JSON.parse(fs.readFileSync(g3s2Path,"utf8"));
  need(Array.isArray(g3s2.identityRows)&&g3s2.identityRows.length===g3s2Meta.identityRowCount,"G3-10 Stage2 identity row count mismatch");
  for(const r of g3s2.identityRows){ sets.seed.add(String(r.sourceSeed)); sets.trajectory.add(r.sourceTrajectorySha256); sets.prefix.add(r.openingPrefixSha256); for(const cp of r.checkpointRoots||[]) sets.root.add(cp.rootRawSha256); }

  const meta=FIREWALL.identitySources.g4_01_stage1r_gcld;
  need(fs.existsSync(g4dir),"G4-01 source bundle extraction missing");
  const files=fs.readdirSync(g4dir).filter(n=>/^\d+\.json$/.test(n)).sort();
  need(files.length===meta.sourceRowCount,`G4-01 GCLD row count mismatch ${files.length}`);
  const projected=[]; const g4seed=new Set(),g4traj=new Set(),g4root=new Set(); const policyCounts={};
  for(const name of files){
    const o=JSON.parse(fs.readFileSync(path.join(g4dir,name),"utf8"));
    const cps=(o.checkpoints||[]).filter(Boolean).map(cp=>({ply:cp.ply,rootRawSha256:cp.rawStateSha256}));
    const row={sourceSeed:o.effectiveSeed??o.slotSeed,slotSeed:o.slotSeed,seedRole:o.seedRole,policyId:o.policyId,fullTrajectorySha256:o.trajectorySha256,checkpointRoots:cps};
    projected.push(row);
    g4seed.add(String(row.sourceSeed)); g4traj.add(row.fullTrajectorySha256); for(const cp of cps) if(cp.rootRawSha256) g4root.add(cp.rootRawSha256);
    countInc(policyCounts,row.policyId);
  }
  need(sha256Text(stable(projected))===meta.canonicalIdentityProjectionSha256,"G4-01 GCLD projection digest mismatch");
  need(g4seed.size===meta.setDigests.sourceSeed.uniqueCount && setDigest(g4seed)===meta.setDigests.sourceSeed.sha256,"G4-01 sourceSeed set mismatch");
  need(g4traj.size===meta.setDigests.fullTrajectorySha256.uniqueCount && setDigest(g4traj)===meta.setDigests.fullTrajectorySha256.sha256,"G4-01 trajectory set mismatch");
  need(g4root.size===meta.setDigests.rootRawSha256.uniqueCount && setDigest(g4root)===meta.setDigests.rootRawSha256.sha256,"G4-01 root set mismatch");
  same(policyCounts,meta.policyCounts,"G4-01 policy counts mismatch");
  for(const v of g4seed) sets.seed.add(v); for(const v of g4traj) sets.trajectory.add(v); for(const v of g4root) sets.root.add(v);

  const b=SPEC.seedBlock;
  for(const x of FIREWALL.excludedSeedNamespaces) need(!rangeContains(x.range,b.start)&&!rangeContains(x.range,b.end),`Stage1 block overlaps excluded range ${x.range}`);
  return {sets,summary:{g3Stage1Rows:g3s1.identityRows.length,g3Stage2Rows:g3s2.identityRows.length,g4Stage1rRows:projected.length,g4OpeningPrefixAudited:false,g4PolicyCounts:policyCounts,verified:true}};
}
function chooseCandidates(fw){
  const target=SPEC.trajectoryContract.candidateTargetPerPolicy;
  const per={ [TP.P1]:[], [TP.P2]:[] };
  const reject={ [TP.P1]:{}, [TP.P2]:{} };
  let seedReads=0,lastSeed=null;
  for(let seed=SPEC.seedBlock.start;seed<=SPEC.seedBlock.end;seed++){
    const policy=policyFor(seed); if(per[policy].length>=target){ if(per[TP.P1].length>=target&&per[TP.P2].length>=target) break; continue; }
    seedReads++; lastSeed=seed;
    if(fw.sets.seed.has(String(seed))){ countInc(reject[policy],"EXCLUDED-SEED"); continue; }
    const a=replayResult(TP,policy,seed), b=replayResult(TI,policy,seed);
    need(a.ok===b.ok,`replay success mismatch seed=${seed}`);
    if(!a.ok){ need(a.error===b.error,`replay error mismatch seed=${seed}`); countInc(reject[policy],a.error.includes("relay-limit")?"SOURCE-RELAY-LIMIT":"SOURCE-ERROR"); continue; }
    same(publicReplay(a.value),publicReplay(b.value),`replay identity mismatch seed=${seed}`);
    if(!complete72(a.value)){ countInc(reject[policy],"TERMINAL-BEFORE-72"); continue; }
    const cpsA=checkpointRows(a.value),cpsB=checkpointRows(b.value);
    same(cpsA.map(r=>({ply:r.ply,phase:r.phase,rawStateSha256:r.rawStateSha256})),cpsB.map(r=>({ply:r.ply,phase:r.phase,rawStateSha256:r.rawStateSha256})),`checkpoint identity mismatch seed=${seed}`);
    const prefixA=TP.digest(a.value.moveKeys.slice(0,16).join("\n")),prefixB=TI.digest(b.value.moveKeys.slice(0,16).join("\n"));
    need(prefixA===prefixB,`prefix mismatch seed=${seed}`);
    if(fw.sets.trajectory.has(a.value.trajectorySha256)){ countInc(reject[policy],"UPSTREAM-TRAJECTORY"); continue; }
    if(fw.sets.prefix.has(prefixA)){ countInc(reject[policy],"UPSTREAM-OPENING-PREFIX"); continue; }
    if(cpsA.some(r=>fw.sets.root.has(r.rawStateSha256))){ countInc(reject[policy],"UPSTREAM-CHECKPOINT-ROOT"); continue; }
    per[policy].push({policyId:policy,seed,replayP:a.value,replayI:b.value,cpsP:cpsA,cpsI:cpsB,prefixSha256:prefixA,identity:identityRow(policy,seed,a.value,cpsA,prefixA)});
    if(per[TP.P1].length>=target&&per[TP.P2].length>=target) break;
  }
  return {per,reject,seedReads,lastSeed,populationComplete:per[TP.P1].length===target&&per[TP.P2].length===target};
}
function limits(){ return SPEC.resourceEligibility.limits; }
function preflight(policyRows){
  const out=[]; const eligible=[];
  for(const c of policyRows){ let ok=true; const reasons={};
    for(let i=0;i<c.cpsP.length;i++){
      const a=TP.preflightContinuous(E,c.cpsP[i].state,c.seed,c.cpsP[i].ply,limits());
      const b=TI.preflightContinuous(E,c.cpsI[i].state,c.seed,c.cpsI[i].ply,limits());
      same(a,b,`preflight mismatch seed=${c.seed} ply=${c.cpsP[i].ply}`);
      countInc(reasons,a.reasonCode); if(!a.eligible) ok=false;
    }
    out.push({sourceSeed:c.seed,eligible:ok,reasonCounts:reasons}); if(ok) eligible.push(c);
  }
  return {rows:out,eligible};
}
function measure(policyId,eligible){
  const target=SPEC.resourceEligibility.measuredDevelopmentPopulationPerPolicy;
  const selected=eligible.slice(0,target); const defined=Object.fromEntries(TARGETS.map(x=>[x,0]));
  let bothPhases=0,rf1=0,rf2=0;
  for(const c of selected){
    const rowsP=[],rowsI=[]; const phases=new Set();
    for(let i=0;i<c.cpsP.length;i++){
      const a=TP.measureContinuous(E,c.cpsP[i].state,c.seed,c.cpsP[i].ply);
      const b=TI.measureContinuous(E,c.cpsI[i].state,c.seed,c.cpsI[i].ply);
      same(a,b,`measurement mismatch seed=${c.seed} ply=${c.cpsP[i].ply}`);
      phases.add(c.cpsP[i].phase);
      rowsP.push({ply:c.cpsP[i].ply,phase:c.cpsP[i].phase,representation:a.representation});
      rowsI.push({ply:c.cpsI[i].ply,phase:c.cpsI[i].phase,representation:b.representation});
    }
    const ps=GP.longitudinalSummary(rowsP,SPEC.stageId,c.seed,STUDY.longitudinalContract.controlCount);
    const is=GI.longitudinalSummary(rowsI,SPEC.stageId,c.seed,STUDY.longitudinalContract.controlCount);
    same(targetOnly(ps),targetOnly(is),`longitudinal exact mismatch seed=${c.seed}`);
    for(const id of TARGETS) if(ps.contrasts[id]&&ps.contrasts[id].defined===true) defined[id]++;
    if(phases.has("namua")&&phases.has("mtaji")) bothPhases++;
    if(TP.selectAnchors(c.replayP.rows,TP.RF1).complete) rf1++;
    if(TP.selectAnchors(c.replayP.rows,TP.RF2).complete) rf2++;
  }
  return {policyId,measuredCount:selected.length,definedContrastCounts:defined,bothPhaseMeasuredTrajectories:bothPhases,rf1CompleteMeasuredTrajectories:rf1,rf2CompleteMeasuredTrajectories:rf2,productionIndependentExact:true,endpointValuesRetained:false,contrastSignsRetained:false};
}
function writeJson(p,obj){ fs.mkdirSync(path.dirname(p),{recursive:true}); const text=JSON.stringify(obj,null,2)+"\n"; fs.writeFileSync(p,text); return {sha256:sha256Text(text),bytes:Buffer.byteLength(text)}; }
function main(){
  need(STUDY.studyId==="GTTD-STUDY1"&&SPEC.studyId===STUDY.studyId&&AUTH.studyId===STUDY.studyId,"study identity mismatch");
  need(AUTH.decision==="GTTD-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE"&&AUTH.authorizedScientificExecutions===1,"Stage1 not authorized exactly once");
  need(AUTH.stage1EffectInferenceAuthorized===false&&AUTH.stage1EndpointValueRetentionAuthorized===false&&AUTH.stage1ContrastSignRetentionAuthorized===false,"Stage1 blindness guard invalid");
  need(AUTH.stage2SeedAccessAuthorized===false&&AUTH.stage2FormalInferenceAuthorized===false,"Stage2 guard invalid");
  need(SPEC.seedBlock.start===AUTH.freshSeedBlock.start&&SPEC.seedBlock.end===AUTH.freshSeedBlock.end&&SPEC.seedBlock.count===AUTH.freshSeedBlock.count,"seed block auth mismatch");
  need(process.env.GTTD_EXECUTION_TRIGGER_OK==="1","dedicated execution trigger guard missing");
  need(process.env.GTTD_EXECUTION_LEASE_OK==="1","durable execution lease guard missing");
  const g4dir=process.env.GTTD_G4_01_GCLD_SOURCE_DIR; need(g4dir,"G4-01 source directory env missing");
  const fw=materializeFirewall(g4dir); // MUST finish before any fresh seed read.
  const cand=chooseCandidates(fw);
  const summaries=[]; const preflightSummary={}; const identityRows=[];
  for(const policy of [TP.P1,TP.P2]){
    for(const c of cand.per[policy]) identityRows.push(c.identity);
    const pf=preflight(cand.per[policy]);
    preflightSummary[policy]={candidateCount:cand.per[policy].length,fullyEligibleCount:pf.eligible.length,rejectionCounts:cand.reject[policy]};
    summaries.push(measure(policy,pf.eligible));
  }
  const minEligible=SPEC.resourceEligibility.minimumFullyEligiblePerPolicy;
  const minDefined=SPEC.endpointReadiness.minimumDefinedContrastsPerEndpointPerPolicy;
  const populationPass=cand.populationComplete;
  const eligibilityPass=[TP.P1,TP.P2].every(p=>preflightSummary[p].fullyEligibleCount>=minEligible);
  const measuredPass=summaries.every(x=>x.measuredCount===SPEC.resourceEligibility.measuredDevelopmentPopulationPerPolicy);
  const definedPass=summaries.every(x=>TARGETS.every(id=>x.definedContrastCounts[id]>=minDefined));
  const pass=populationPass&&eligibilityPass&&measuredPass&&definedPass;
  const identity={schemaVersion:1,studyId:STUDY.studyId,sourceStageId:SPEC.stageId,scientificOutcomeFieldsRetained:false,identityRowCount:identityRows.length,identityRows};
  const outputDir=process.argv[2]||path.join(DOC,"results/stage-1");
  const idMeta=writeJson(path.join(outputDir,"STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json"),identity);
  const core={schemaVersion:1,studyId:STUDY.studyId,stageId:SPEC.stageId,evidenceClass:SPEC.evidenceClass,authorizationDecision:AUTH.decision,seedBlock:SPEC.seedBlock,seedReads:cand.seedReads,lastSeedRead:cand.lastSeed,firewallVerification:fw.summary,candidatePopulationComplete:populationPass,perPolicyPreflight:preflightSummary,developmentMeasurements:summaries,minimumEligibilityPass:eligibilityPass,measuredPopulationPass:measuredPass,minimumDefinednessPass:definedPass,productionIndependentExact:true,scientificEndpointValuesRetained:false,contrastSignsRetained:false,effectDirectionsRetained:false,pValuesComputed:false,formalInferencePerformed:false,stage2SeedAccess:false,g3_11Depth10Rerun:false,g4_10Depth11Access:false,publicAiChange:false,identityExclusion:{rowCount:identityRows.length,sha256:idMeta.sha256}};
  const result={...core,deterministicCoreSha256:sha256Text(stable(core)),stageDisposition:pass?"STAGE1-PASS":"STAGE1-NON-ESTIMABLE-FOR-STAGE2-PROMOTION",stage2AutomaticallyAuthorized:false};
  const rMeta=writeJson(path.join(outputDir,"STAGE_1_RESULT.json"),result);
  console.log(`GTTD_STAGE1_RESULT=${JSON.stringify({stageDisposition:result.stageDisposition,deterministicCoreSha256:result.deterministicCoreSha256,resultJsonSha256:rMeta.sha256,identitySha256:idMeta.sha256,seedReads:result.seedReads,lastSeedRead:result.lastSeedRead})}`);
  if(!pass) process.exitCode=2;
}
try{main()}catch(error){
  const outputDir=process.argv[2]||path.join(DOC,"results/stage-1");
  const failure={schemaVersion:1,studyId:"GTTD-STUDY1",stageId:"GTTD-S1-DEVELOPMENT-2026-09-25-v1",evidenceClass:"FRESH-DEVELOPMENT",stageDisposition:"STAGE1-TECHNICAL-INVALID",error:String(error&&error.message?error.message:error),scientificEndpointValuesRetained:false,contrastSignsRetained:false,pValuesComputed:false,formalInferencePerformed:false,stage2SeedAccess:false,stage2AutomaticallyAuthorized:false};
  writeJson(path.join(outputDir,"STAGE_1_FAILURE.json"),failure);
  console.error(`GTTD_STAGE1_FAILURE=${JSON.stringify(failure)}`); process.exitCode=1;
}
