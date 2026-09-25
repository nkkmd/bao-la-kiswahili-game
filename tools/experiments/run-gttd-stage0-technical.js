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
const SPEC = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STUDY_1_SPEC.json"), "utf8"));
const AUTH = JSON.parse(fs.readFileSync(path.join(DOC, "authorizations/STAGE_0_AUTHORIZATION.json"), "utf8"));
const TARGETS = [
  "C1-DIRECTIONALITY-PATH-EFFICIENCY",
  "C2-PERSISTENCE-LAG-DISTANCE-GRADIENT",
  "C3-RETURN-FRACTION",
  "C5-FIRST-ORDER-DIRECTIONAL-PATH-DEPENDENCE"
];

function need(x, m) { if (!x) throw new Error(m); }
function stable(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`;
}
function same(a, b, m) { need(stable(a) === stable(b), m); }
function sha256(s) { return crypto.createHash("sha256").update(String(s), "utf8").digest("hex"); }
function outputPath() { return process.argv[2] || path.join(DOC, "results/stage-0/STAGE_0_TECHNICAL_RESULT.json"); }
function writeResult(result) {
  const out = outputPath();
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const text = JSON.stringify(result, null, 2) + "\n";
  fs.writeFileSync(out, text);
  return { path: out, sha256: sha256(text), bytes: Buffer.byteLength(text) };
}
function overlaps(a0, a1, b0, b1) { return Math.max(a0, b0) <= Math.min(a1, b1); }
function qeq(x, n, d, label) {
  need(x && x.defined === true, `${label} undefined`);
  need(BigInt(x.numerator) * BigInt(d) === BigInt(n) * BigInt(x.denominator), `${label} mismatch`);
}
function syntheticRows(lib) {
  const rows = [];
  for (let t = 0; t < 15; t++) {
    const coordinates = {};
    for (let j = 0; j < lib.AXES.length; j++) coordinates[lib.AXES[j]] = j === 0 ? lib.q(BigInt(t), 100n) : lib.q(0n);
    rows.push({ ply: 16 + 4 * t, representation: { representationId: SPEC.representationContract.representationId, coordinates } });
  }
  return rows;
}
function replayOutcome(lib, policyId, seed) {
  try { return { ok: true, value: lib.replay(E, policyId, seed, 80) }; }
  catch (error) { return { ok: false, error: String(error && error.message ? error.message : error) }; }
}
function replayIdentity(x) {
  return {
    policyId: x.policyId,
    seed: x.seed,
    moveKeys: x.moveKeys,
    trajectorySha256: x.trajectorySha256,
    terminal: x.terminal,
    rows: x.rows.map(r => ({ ply: r.ply, phase: r.phase, terminal: r.terminal, rootLegalWidth: r.rootLegalWidth, rawStateSha256: r.rawStateSha256 }))
  };
}
function completeThrough72(x, checkpoints) {
  const byPly = new Map(x.rows.map(r => [r.ply, r]));
  const last = byPly.get(72);
  if (!last || last.terminal) return false;
  return checkpoints.every(ply => {
    const row = byPly.get(ply);
    return Boolean(row && !row.terminal);
  });
}
function checkpointsFromReplay(x, checkpoints) {
  const byPly = new Map(x.rows.map(r => [r.ply, r]));
  return checkpoints.map(ply => {
    const row = byPly.get(ply);
    need(row && !row.terminal, `missing technical checkpoint ${ply}`);
    return row;
  });
}
function limitsFromSpec() {
  const x = SPEC.resourceCeilings.perDepth5Root;
  return {
    distinctRawStates: x.maxDistinctRawStates,
    uniqueTransitions: x.maxUniqueTransitions,
    parentExpansions: x.maxParentExpansions,
    legalMoveEvaluations: x.maxLegalMoveEvaluations,
    treeNodeOccurrences: x.maxTreeNodeOccurrences
  };
}
function targetOnly(summary) {
  const out = {};
  for (const id of TARGETS) out[id] = {
    actual: summary.actual[id],
    controlMedian: summary.controlMedians[id],
    contrast: summary.contrasts[id]
  };
  return out;
}
function verifyStaticGuards() {
  need(SPEC.studyId === "GTTD-STUDY1", "study mismatch");
  need(AUTH.studyId === SPEC.studyId && AUTH.stageId === "GTTD-S0-TECHNICAL-2026-09-25-v1", "authorization stage mismatch");
  need(AUTH.decision === "AUTHORIZED" && AUTH.authorizationType === "TECHNICAL-ONLY", "Stage 0 not technically authorized");
  need(AUTH.freshScientificSeedAccessAuthorized === false && AUTH.scientificOutcomeAuthorized === false, "scientific access guard invalid");
  need(AUTH.stage1SeedAccessAuthorized === false && AUTH.stage2SeedAccessAuthorized === false, "fresh stage guard invalid");
  need(AUTH.g3_10ScientificReplayAuthorized === false && AUTH.g3_12ScientificEvidenceReuseAuthorized === false, "historical evidence guard invalid");
  need(AUTH.g3_11Depth10RerunAuthorized === false && AUTH.g4_10Depth11AccessAuthorized === false, "protected evidence guard invalid");
  need(AUTH.publicAiChangeAuthorized === false && AUTH.mainIntegrationAuthorized === false, "deployment/integration guard invalid");
  need(SPEC.futureStageReservations.seedReadAuthorized === false, "future seed read guard invalid");
  need(SPEC.representationContract.representationId === "CRCLGR-R1-EXACT-SQUASHED-L1", "representation mismatch");
  need(GP.representationId === SPEC.representationContract.representationId && GI.representationId === SPEC.representationContract.representationId, "GCLD representation mismatch");
  const t = SPEC.stage0.technicalFixtureSeedBlock;
  same(t, { start: 44014001, end: 44014064, count: 64, scientificUseAuthorized: false }, "technical fixture namespace mismatch");
  same(AUTH.allowedTechnicalFixtureSeeds, { start: 44014001, end: 44014064, evidenceClass: "TECHNICAL-FIXTURE", scientificUseAuthorized: false }, "authorization fixture namespace mismatch");
  const blocked = [[32210001,32210256],[32220001,32220384],[40113001,40113384],[40213001,40213384],[41213001,41213384]];
  for (const [a,b] of blocked) need(!overlaps(t.start, t.end, a, b), `technical namespace overlaps blocked ${a}..${b}`);
  need(!overlaps(t.start, t.end, SPEC.futureStageReservations.stage1SeedBlock.start, SPEC.futureStageReservations.stage1SeedBlock.start), "technical namespace overlaps Stage 1 reservation");
  need(!overlaps(t.start, t.end, SPEC.futureStageReservations.stage2SeedBlock.start, SPEC.futureStageReservations.stage2SeedBlock.start), "technical namespace overlaps Stage 2 reservation");
}
function verifySynthetic() {
  const pRows = syntheticRows(GP), iRows = syntheticRows(GI);
  const pEp = GP.endpointValues(pRows), iEp = GI.endpointValues(iRows);
  for (const id of TARGETS) same(pEp[id], iEp[id], `synthetic endpoint mismatch ${id}`);
  qeq(pEp["C1-DIRECTIONALITY-PATH-EFFICIENCY"], 1, 1, "C1");
  qeq(pEp["C2-PERSISTENCE-LAG-DISTANCE-GRADIENT"], 3, 100, "C2");
  qeq(pEp["C3-RETURN-FRACTION"], 0, 1, "C3");
  qeq(pEp["C5-FIRST-ORDER-DIRECTIONAL-PATH-DEPENDENCE"], 1, 1, "C5");
  const p = GP.longitudinalSummary(pRows, AUTH.stageId, 44014001, 32);
  const i = GI.longitudinalSummary(iRows, AUTH.stageId, 44014001, 32);
  same(targetOnly(p), targetOnly(i), "synthetic longitudinal target mismatch");
  need(p.controlCount === 32 && i.controlCount === 32, "control count mismatch");
  for (let r = 0; r < 32; r++) {
    const a = GP.permuteRows(pRows, AUTH.stageId, 44014001, r).map(x => x.ply);
    const b = GI.permuteRows(iRows, AUTH.stageId, 44014001, r).map(x => x.ply);
    same(a, b, `permutation mismatch ${r}`);
    need(a[0] === 16 && a[14] === 72, `endpoint preservation failed ${r}`);
  }
}
function collectPolicyFixtures(policyId) {
  const checkpoints = SPEC.longitudinalContract.checkpointPlies;
  const seedBlock = SPEC.stage0.technicalFixtureSeedBlock;
  const selected = [];
  const rejectionCounts = {};
  for (let seed = seedBlock.start; seed <= seedBlock.end && selected.length < 2; seed++) {
    const p = replayOutcome(TP, policyId, seed), i = replayOutcome(TI, policyId, seed);
    need(p.ok === i.ok, `replay success mismatch ${policyId} seed=${seed}`);
    if (!p.ok) {
      need(p.error === i.error, `replay error mismatch ${policyId} seed=${seed}`);
      const key = p.error.includes("relay-limit") ? "SOURCE-RELAY-LIMIT" : "SOURCE-ERROR";
      rejectionCounts[key] = (rejectionCounts[key] || 0) + 1;
      continue;
    }
    same(replayIdentity(p.value), replayIdentity(i.value), `replay identity mismatch ${policyId} seed=${seed}`);
    if (!completeThrough72(p.value, checkpoints)) {
      rejectionCounts["TERMINAL-BEFORE-72"] = (rejectionCounts["TERMINAL-BEFORE-72"] || 0) + 1;
      continue;
    }
    const pRf1 = TP.selectAnchors(p.value.rows, TP.RF1), iRf1 = TI.selectAnchors(i.value.rows, TI.RF1);
    const pRf2 = TP.selectAnchors(p.value.rows, TP.RF2), iRf2 = TI.selectAnchors(i.value.rows, TI.RF2);
    same(pRf1, iRf1, `RF1 classification mismatch ${policyId} seed=${seed}`);
    same(pRf2, iRf2, `RF2 classification mismatch ${policyId} seed=${seed}`);
    const cpsP = checkpointsFromReplay(p.value, checkpoints), cpsI = checkpointsFromReplay(i.value, checkpoints);
    same(cpsP.map(r => ({ply:r.ply,phase:r.phase,rawStateSha256:r.rawStateSha256})), cpsI.map(r => ({ply:r.ply,phase:r.phase,rawStateSha256:r.rawStateSha256})), `checkpoint identity mismatch ${policyId} seed=${seed}`);
    selected.push({ seed, p: p.value, i: i.value, cpsP, cpsI, rf1Complete: pRf1.complete, rf2Complete: pRf2.complete });
  }
  need(selected.length >= 2, `insufficient complete technical trajectories for ${policyId}`);
  return { selected, rejectionCounts };
}
function preflightAndMeasure(policyId, fixtureSet) {
  const limits = limitsFromSpec();
  const preflightRows = [];
  const eligible = [];
  for (const item of fixtureSet.selected) {
    let allEligible = true;
    const rows = [];
    for (let k = 0; k < item.cpsP.length; k++) {
      const a = TP.preflightContinuous(E, item.cpsP[k].state, item.seed, item.cpsP[k].ply, limits);
      const b = TI.preflightContinuous(E, item.cpsI[k].state, item.seed, item.cpsI[k].ply, limits);
      same(a, b, `preflight mismatch ${policyId} seed=${item.seed} ply=${item.cpsP[k].ply}`);
      rows.push({ ply: item.cpsP[k].ply, eligible: a.eligible, reasonCode: a.reasonCode });
      if (!a.eligible) allEligible = false;
    }
    preflightRows.push({ seed: item.seed, allEligible, rows });
    if (allEligible) eligible.push(item);
  }
  need(eligible.length >= 1, `no fully preflight-eligible technical trajectory for ${policyId}`);
  const item = eligible[0];
  const pMeasured = [], iMeasured = [];
  for (let k = 0; k < item.cpsP.length; k++) {
    const a = TP.measureContinuous(E, item.cpsP[k].state, item.seed, item.cpsP[k].ply);
    const b = TI.measureContinuous(E, item.cpsI[k].state, item.seed, item.cpsI[k].ply);
    same(a, b, `continuous measurement mismatch ${policyId} seed=${item.seed} ply=${item.cpsP[k].ply}`);
    pMeasured.push({ ply: item.cpsP[k].ply, phase: item.cpsP[k].phase, representation: a.representation });
    iMeasured.push({ ply: item.cpsI[k].ply, phase: item.cpsI[k].phase, representation: b.representation });
  }
  const ps = GP.longitudinalSummary(pMeasured, AUTH.stageId, item.seed, 32);
  const is = GI.longitudinalSummary(iMeasured, AUTH.stageId, item.seed, 32);
  same(targetOnly(ps), targetOnly(is), `longitudinal aggregation mismatch ${policyId} seed=${item.seed}`);
  const phaseCounts = item.cpsP.reduce((acc, r) => { acc[r.phase] = (acc[r.phase] || 0) + 1; return acc; }, {});
  return {
    policyId,
    completeTechnicalTrajectoryCount: fixtureSet.selected.length,
    fullyPreflightEligibleCount: eligible.length,
    rejectionCounts: fixtureSet.rejectionCounts,
    rf1CompleteCount: fixtureSet.selected.filter(x => x.rf1Complete).length,
    rf2CompleteCount: fixtureSet.selected.filter(x => x.rf2Complete).length,
    measuredTechnicalSeed: item.seed,
    phaseCounts,
    preflightRows,
    targetEndpointProductionIndependentExact: true,
    scientificEndpointValuesRetained: false
  };
}
function verifySeparation() {
  const files = [
    ["tools/experiments/lib/gcld-production.js", "gcld-independent.js"],
    ["tools/experiments/lib/gcld-independent.js", "gcld-production.js"],
    ["tools/experiments/lib/lgttci-compatibility-production.js", "lgttci-compatibility-independent.js"],
    ["tools/experiments/lib/lgttci-compatibility-independent.js", "lgttci-compatibility-production.js"]
  ];
  for (const [rel, forbidden] of files) {
    const src = fs.readFileSync(path.join(ROOT, rel), "utf8");
    need(!src.includes(forbidden), `${rel} imports opposite implementation`);
  }
}
function main() {
  verifyStaticGuards();
  verifySynthetic();
  verifySeparation();
  const p1 = collectPolicyFixtures(TP.P1);
  const p2 = collectPolicyFixtures(TP.P2);
  const policyResults = [preflightAndMeasure(TP.P1, p1), preflightAndMeasure(TP.P2, p2)];
  const core = {
    schemaVersion: 1,
    studyId: SPEC.studyId,
    stageId: AUTH.stageId,
    evidenceClass: "TECHNICAL-FIXTURE",
    representationId: SPEC.representationContract.representationId,
    checkpointCount: SPEC.longitudinalContract.checkpointCount,
    controlCount: SPEC.longitudinalContract.controlCount,
    targetEndpoints: TARGETS,
    syntheticExactAgreement: true,
    endpointPreservingControlsExact: true,
    implementationSeparation: true,
    sourcePolicies: policyResults,
    rootFamilyClassificationTechnicalOnly: true,
    phaseCompositionTechnicalOnly: true,
    scientificEndpointValuesRetained: false,
    formalInferencePerformed: false,
    freshScientificSeedAccess: false,
    stage1SeedAccess: false,
    stage2SeedAccess: false,
    g3_11Depth10Rerun: false,
    g4_10Depth11Access: false,
    publicAiChange: false,
    technicalSeedsScientificUseProhibited: true
  };
  const result = {
    ...core,
    deterministicCoreSha256: sha256(stable(core)),
    stageDisposition: "STAGE0-PASS",
    stage1AutomaticallyAuthorized: false
  };
  const meta = writeResult(result);
  console.log(`GTTD_STAGE0_RESULT=${JSON.stringify({...result, resultJsonSha256: meta.sha256, resultBytes: meta.bytes})}`);
}

try { main(); }
catch (error) {
  const failure = {
    schemaVersion: 1,
    studyId: SPEC && SPEC.studyId ? SPEC.studyId : "GTTD-STUDY1",
    stageId: AUTH && AUTH.stageId ? AUTH.stageId : "GTTD-S0-TECHNICAL-2026-09-25-v1",
    evidenceClass: "TECHNICAL-FIXTURE",
    stageDisposition: "STAGE0-TECHNICAL-INVALID",
    error: String(error && error.message ? error.message : error),
    formalInferencePerformed: false,
    freshScientificSeedAccess: false,
    stage1SeedAccess: false,
    stage2SeedAccess: false,
    stage1AutomaticallyAuthorized: false
  };
  const meta = writeResult(failure);
  console.error(`GTTD_STAGE0_FAILURE=${JSON.stringify({...failure, resultJsonSha256: meta.sha256, resultBytes: meta.bytes})}`);
  process.exitCode = 1;
}
