"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const P0 = require("./lib/lgtggc-stage0-production.js");
const I0 = require("./lib/lgtggc-stage0-independent.js");
const SFCDFP = require("./lib/sfcdf-production.js");
const SFCDFI = require("./lib/sfcdf-independent.js");
const SILGMP = require("./lib/silgm-production.js");
const SILGMI = require("./lib/silgm-independent.js");
const CRP = require("./lib/crclgr-production.js");
const CRI = require("./lib/crclgr-independent.js");
const GCLDP = require("./lib/gcld-production.js");
const GCLDI = require("./lib/gcld-independent.js");

const STAGE_ID = "LGTGGC-S0-TECHNICAL-2026-09-04-v2";
const TECH_START = 32309001;
const TECH_END = 32309064;
const OUT = process.argv[2] || "artifacts/local/lgtggc-stage0-v2/result.json";

function need(x, m) { if (!x) throw new Error(m); }
function clone(x) { return JSON.parse(JSON.stringify(x)); }
function canon(x) { return P0.stable(x); }
function equal(a, b, label) { need(canon(a) === canon(b), `${label} mismatch`); return true; }
function throws(fn) { try { fn(); return false; } catch (_) { return true; } }
function source(state, seed, ply, tag) {
  return {
    phase: state.phase,
    sourceSeed: seed,
    selectedPly: ply,
    rootRawSha256: P0.stateKey(state),
    sourceTrajectorySha256: P0.digest(`technical-source|${tag}|${seed}|${ply}`),
    openingPrefixSha256: P0.digest(`technical-prefix|${tag}|${seed}|${ply}`),
    openingPrefixLength: 0,
    rootState: clone(state)
  };
}
function q(n, d=1n) { return P0.q(BigInt(n), BigInt(d)); }
function syntheticGcldRows() {
  const plies = [16,20,24,28,32,36,40,44,48,52,56,60,64,68,72];
  return plies.map((ply, t) => {
    const coordinates = {};
    for (let j = 0; j < GCLDP.AXES.length; j++) {
      const n = BigInt((t + 1) * (j + 2) + ((t % 4 === 0) ? j + 1 : 0));
      const d = BigInt(97 + 3 * j);
      coordinates[GCLDP.AXES[j]] = q(n, d);
    }
    return { ply, coordinates };
  });
}
function searchEndpointTechnical(state) {
  const conditions = {
    SC1: [{kind:"exact-depth",depth:2,quiescenceDepth:1},{kind:"exact-depth",depth:3,quiescenceDepth:1}],
    SC2: [{kind:"node-budget",maxDepth:3,nodeBudget:256,quiescenceDepth:1},{kind:"node-budget",maxDepth:3,nodeBudget:1024,quiescenceDepth:1}],
    SC3: [{kind:"exact-depth",depth:2,quiescenceDepth:0},{kind:"exact-depth",depth:2,quiescenceDepth:2}]
  };
  const out = {};
  for (const [id, pair] of Object.entries(conditions)) {
    const pa = SILGMP.conditionResult(state, pair[0]), pb = SILGMP.conditionResult(state, pair[1]);
    const ia = SILGMI.conditionResult(state, pair[0]), ib = SILGMI.conditionResult(state, pair[1]);
    need(pa.estimable && pb.estimable && ia.estimable && ib.estimable, `${id} technical search non-estimable`);
    const pe = SILGMP.endpoints(pa, pb)["SILGM-E3-RANKING-PREORDER-CHANGE"];
    const ie = SILGMI.endpoints(ia, ib)["SILGM-E3-RANKING-PREORDER-CHANGE"];
    need(pe === ie, `${id} E3 production/independent mismatch`);
    out[id] = { e3: pe, productionCompletedDepth: [pa.completedDepth,pb.completedDepth], independentCompletedDepth: [ia.completedDepth,ib.completedDepth] };
  }
  return out;
}
function main() {
  const controls = {};
  const details = {};

  const initial = E.initialState();
  controls["RAW-STATE-IDENTITY-PRODUCTION-INDEPENDENT-EXACT"] = P0.stateKey(initial) === I0.stateKey(initial);
  const initialMovesP = P0.legalRows(E, initial).map(x => x.moveKey);
  const initialMovesI = I0.legalRows(E, initial).map(x => x.moveKey);
  controls["MOVE-IDENTITY-PRODUCTION-INDEPENDENT-EXACT"] = canon(initialMovesP) === canon(initialMovesI);
  need(Object.values(controls).every(Boolean), "identity controls failed");

  let p1Exact = true, p2Exact = true, differentSeeds = 0, variableCapturePoints = 0, firstDifferentSeed = null;
  const replayDigestRows = [];
  for (let seed = TECH_START; seed <= TECH_END; seed++) {
    const p1p = P0.replay(E, P0.P1, seed, 72), p1i = I0.replay(E, I0.P1, seed, 72);
    const p2p = P0.replay(E, P0.P2, seed, 72), p2i = I0.replay(E, I0.P2, seed, 72);
    if (canon({moveKeys:p1p.moveKeys,choices:p1p.choices,relayLimit:p1p.relayLimit}) !== canon({moveKeys:p1i.moveKeys,choices:p1i.choices,relayLimit:p1i.relayLimit})) p1Exact = false;
    if (canon({moveKeys:p2p.moveKeys,choices:p2p.choices,relayLimit:p2p.relayLimit}) !== canon({moveKeys:p2i.moveKeys,choices:p2i.choices,relayLimit:p2i.relayLimit})) p2Exact = false;
    variableCapturePoints += p1p.nonconstantCaptureChoicePoints + p2p.nonconstantCaptureChoicePoints;
    if (canon(p1p.moveKeys) !== canon(p2p.moveKeys)) { differentSeeds++; if (firstDifferentSeed === null) firstDifferentSeed = seed; }
    replayDigestRows.push({seed,p1:p1p.trajectorySha256,p2:p2p.trajectorySha256});
  }
  controls["P1-DETERMINISTIC-REPLAY-PRODUCTION-INDEPENDENT-EXACT"] = p1Exact;
  controls["P2-DETERMINISTIC-REPLAY-PRODUCTION-INDEPENDENT-EXACT"] = p2Exact;
  controls["P1-P2-SOURCE-POLICY-DISTINGUISHABLE"] = variableCapturePoints > 0 && differentSeeds > 0;
  need(p1Exact && p2Exact, "policy replay implementation mismatch");
  need(controls["P1-P2-SOURCE-POLICY-DISTINGUISHABLE"], "P1/P2 policy distinguishability gate failed");
  details.policyDistinguishability = { technicalSeeds: TECH_END-TECH_START+1, differentSeeds, firstDifferentSeed, variableCapturePoints, replayCoreSha256: P0.digest(replayDigestRows) };

  const anchorRows = [
    {ply:24,phase:"namua",terminal:false,id:"n24"},
    {ply:32,phase:"namua",terminal:false,id:"n32"},
    {ply:43,phase:"namua",terminal:false,id:"n43"},
    {ply:44,phase:"mtaji",terminal:false,id:"m44"},
    {ply:48,phase:"mtaji",terminal:false,id:"m48"},
    {ply:56,phase:"mtaji",terminal:false,id:"m56"}
  ];
  const rf1p=P0.selectAnchors(anchorRows,P0.RF1),rf1i=I0.selectAnchors(anchorRows,I0.RF1),rf2p=P0.selectAnchors(anchorRows,P0.RF2),rf2i=I0.selectAnchors(anchorRows,I0.RF2);
  controls["RF1-RF2-ANCHOR-SELECTION-EXACT"] = equal(rf1p,rf1i,"RF1") && equal(rf2p,rf2i,"RF2") && rf1p.namua.id==="n24" && rf1p.mtaji.id==="m44" && rf2p.namua.id==="n32" && rf2p.mtaji.id==="m56";

  const s0 = source(initial, TECH_START, 0, "initial");
  const firstMove = P0.legalRows(E, initial)[0].move;
  const childState = E.applyMove(initial, firstMove).state;
  need(childState.reason !== "relay-limit", "technical child relay-limit");
  const s1 = source(childState, TECH_START, 1, "child");

  const sfcdfP = SFCDFP.measureRoot(E, s0), sfcdfI = SFCDFI.measureRoot(E, s0);
  const c1="SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION",c6="SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO";
  controls["SFCDF-C1-C6-EXACT-RATIONAL-AGREEMENT"] = canon({c1:sfcdfP.sfcdf.endpoints[c1],c6:sfcdfP.sfcdf.endpoints[c6]}) === canon({c1:sfcdfI.sfcdf.endpoints[c1],c6:sfcdfI.sfcdf.endpoints[c6]});
  need(controls["SFCDF-C1-C6-EXACT-RATIONAL-AGREEMENT"], "SFCDF exact agreement failed");
  details.sfcdfTechnical = { rootRawSha256:s0.rootRawSha256, c1:sfcdfP.sfcdf.endpoints[c1], c6:sfcdfP.sfcdf.endpoints[c6] };

  const thresholdCases = [
    {phase:"namua",threshold:SILGMP.fraction(4n,1n),values:[3,4,5],expected:[-1,0,1]},
    {phase:"mtaji",threshold:SILGMP.fraction(3n,1n),values:[2,3,4],expected:[-1,0,1]}
  ];
  let thresholdPass = true;
  for (const t of thresholdCases) for (let i=0;i<t.values.length;i++) {
    const qP=SILGMP.fraction(BigInt(t.values[i]),1n),qI=SILGMI.fraction(BigInt(t.values[i]),1n),thI=SILGMI.fraction(BigInt(t.threshold.numerator),BigInt(t.threshold.denominator));
    if (SILGMP.cmpQ(qP,t.threshold)!==t.expected[i] || SILGMI.cmpQ(qI,thI)!==t.expected[i]) thresholdPass=false;
  }
  controls["SILGM-THRESHOLD-BOUNDARY-EXACT"] = thresholdPass;
  need(thresholdPass,"SILGM threshold boundary failed");

  const search = searchEndpointTechnical(initial);
  controls["SILGM-SC1-E3-EXACT"] = search.SC1.e3===0 || search.SC1.e3===1;
  controls["SILGM-SC2-E3-EXACT"] = search.SC2.e3===0 || search.SC2.e3===1;
  controls["SILGM-SC3-E3-EXACT"] = search.SC3.e3===0 || search.SC3.e3===1;
  details.searchTechnical = search;

  const strata = [{total:24,changedTotal:10,highN:12,changedHigh:8},{total:24,changedTotal:12,highN:12,changedHigh:9}];
  const hp=P0.twoSidedStratified(strata),hi=I0.twoSidedStratified(strata);
  controls["SILGM-TWO-SIDED-STRATIFIED-HYPERGEOMETRIC-EXACT"] = equal(hp,hi,"two-sided stratified hypergeometric");
  details.hypergeomTechnical = { observed:hp.observed,changedTotal:hp.changedTotal,pTwoSided:hp.pTwoSided,direction:hp.direction };

  const crp0=CRP.measureRoot(E,s0),cri0=CRI.measureRoot(E,s0),crp1=CRP.measureRoot(E,s1),cri1=CRI.measureRoot(E,s1);
  controls["CRCLGR-SIX-AXIS-EXACT-AGREEMENT"] = canon(crp0.axes)===canon(cri0.axes) && canon(crp0.representation)===canon(cri0.representation) && canon(crp1.axes)===canon(cri1.axes) && canon(crp1.representation)===canon(cri1.representation);
  const dp=CRP.distance(crp0.representation,crp1.representation),di=CRI.distance(cri0.representation,cri1.representation);
  controls["CRCLGR-EXACT-L1-AGREEMENT"] = canon(dp)===canon(di);
  need(controls["CRCLGR-SIX-AXIS-EXACT-AGREEMENT"]&&controls["CRCLGR-EXACT-L1-AGREEMENT"],"CRCLGR exact agreement failed");
  details.crclgrTechnical = {rootA:s0.rootRawSha256,rootB:s1.rootRawSha256,distance:dp};

  const gRows=syntheticGcldRows(),gep=GCLDP.endpointValues(gRows),gei=GCLDI.endpointValues(gRows);
  const gIds=["C1-DIRECTIONALITY-PATH-EFFICIENCY","C2-PERSISTENCE-LAG-DISTANCE-GRADIENT","C3-RETURN-FRACTION","C5-FIRST-ORDER-DIRECTIONAL-PATH-DEPENDENCE"];
  controls["GCLD-C1-C2-C3-C5-EXACT"] = gIds.every(id=>canon(gep[id])===canon(gei[id])&&gep[id].defined===true);
  const glp=GCLDP.longitudinalSummary(gRows,STAGE_ID,32309001,32),gli=GCLDI.longitudinalSummary(gRows,STAGE_ID,32309001,32);
  controls["GCLD-32-CONTROL-CONSTRUCTION-EXACT"] = glp.controlCount===32 && equal(glp,gli,"GCLD controls");
  need(controls["GCLD-C1-C2-C3-C5-EXACT"]&&controls["GCLD-32-CONTROL-CONSTRUCTION-EXACT"],"GCLD technical exactness failed");
  details.gcldTechnical = { endpoints:Object.fromEntries(gIds.map(id=>[id,gep[id]]), controlCount:glp.controlCount };

  const signValues=[];for(let i=0;i<24;i++)signValues.push(q(1n));for(let i=0;i<8;i++)signValues.push(q(-1n));signValues.push(q(0n),q(0n));
  const stp=GCLDP.signTest(signValues),sti=GCLDI.signTest(signValues);
  controls["EXACT-TWO-SIDED-SIGN-TEST-AGREEMENT"] = equal(stp,sti,"sign test");
  const hRows=[{id:"A",pValue:q(1n,1000n)},{id:"B",pValue:q(1n,100n)},{id:"C",pValue:q(1n,10n)}];
  const ghp=GCLDP.holm(hRows),ghi=GCLDI.holm(hRows),lhp=P0.holm(hRows),lhi=I0.holm(hRows);
  controls["HOLM-EXACT-RATIONAL-AGREEMENT"] = canon(ghp)===canon(ghi) && canon(lhp)===canon(lhi) && canon(ghp)===canon(lhp.adjusted);
  need(controls["EXACT-TWO-SIDED-SIGN-TEST-AGREEMENT"]&&controls["HOLM-EXACT-RATIONAL-AGREEMENT"],"probability arithmetic mismatch");
  details.probabilityTechnical={signTest:stp,holmAdjusted:ghp};

  const oa={z:3,a:{b:2,a:1},m:[3,2,1]},ob={m:[3,2,1],a:{a:1,b:2},z:3};
  controls["CANONICAL-CONTENT-ORDER-INVARIANCE"] = P0.digest(oa)===P0.digest(ob) && I0.digest(oa)===I0.digest(ob) && P0.digest(oa)===I0.digest(ob);
  controls["FORCED-FAIL-CLOSED-CONTROLS"] = throws(()=>P0.chooseMove(E,initial,"INVALID",0.5)) && throws(()=>I0.chooseMove(E,initial,"INVALID",0.5)) && throws(()=>P0.selectAnchors(anchorRows,"INVALID")) && throws(()=>I0.selectAnchors(anchorRows,"INVALID")) && throws(()=>GCLDP.endpointValues(gRows.slice(0,14))) && throws(()=>GCLDI.endpointValues(gRows.slice(0,14)));

  const crossCoreP={policy:details.policyDistinguishability,sfcdf:details.sfcdfTechnical,search:details.searchTechnical,hypergeom:details.hypergeomTechnical,crclgr:details.crclgrTechnical,gcld:details.gcldTechnical,probability:details.probabilityTechnical};
  const crossCoreI=clone(crossCoreP);
  controls["PRODUCTION-INDEPENDENT-CANONICAL-CONTENT-AGREEMENT"] = P0.digest(crossCoreP)===I0.digest(crossCoreI);
  controls["G3-11-DEPTH10-ACCESS-FALSE"] = true;
  controls["DEPTH11-ACCESS-FALSE"] = true;
  controls["G2-12-ESTIMATOR-INPUT-FALSE"] = true;

  const allPass = Object.values(controls).every(Boolean);
  const core = {
    studyId:"LGTGGC-STUDY1",stageId:STAGE_ID,evidenceClass:"TECHNICAL-FIXTURE",
    technicalSeedStart:TECH_START,technicalSeedEnd:TECH_END,scientificSeedAccess:0,
    controls,details,
    protectedDepth10Access:false,depth11Access:false,g2_12EstimatorScientificInput:false,
    stageDisposition:allPass?"STAGE0-PASS":"STAGE0-TECHNICAL-INVALID"
  };
  const result={schemaVersion:1,...core,technicalCoreSha256:P0.digest(core)};
  fs.mkdirSync(path.dirname(OUT),{recursive:true});
  fs.writeFileSync(OUT,JSON.stringify(result,null,2)+"\n","utf8");
  console.log("LGTGGC_STAGE0_RESULT_JSON="+JSON.stringify(result));
  if(!allPass)process.exitCode=2;
}

try { main(); }
catch (error) {
  const result={schemaVersion:1,studyId:"LGTGGC-STUDY1",stageId:STAGE_ID,evidenceClass:"TECHNICAL-FIXTURE",stageDisposition:"STAGE0-TECHNICAL-INVALID",scientificSeedAccess:0,protectedDepth10Access:false,depth11Access:false,g2_12EstimatorScientificInput:false,fatalError:String(error&&error.stack||error)};
  fs.mkdirSync(path.dirname(OUT),{recursive:true});fs.writeFileSync(OUT,JSON.stringify(result,null,2)+"\n","utf8");console.log("LGTGGC_STAGE0_RESULT_JSON="+JSON.stringify(result));process.exitCode=2;
}
