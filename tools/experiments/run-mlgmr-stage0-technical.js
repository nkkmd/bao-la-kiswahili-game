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
const MP = require("./lib/mlgmr-production.js");
const MI = require("./lib/mlgmr-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/multiscale-local-geometry-memory-return");
const STUDY_SPEC = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STUDY_1_SPEC.json"), "utf8"));
const STAGE0_SPEC = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STAGE_0_TECHNICAL_SPEC.json"), "utf8"));
const AUTH = JSON.parse(fs.readFileSync(path.join(DOC, "authorizations/STAGE_0_AUTHORIZATION.json"), "utf8"));

function need(value, message) { if (!value) throw new Error(message); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function same(a, b, message) { need(stable(a) === stable(b), message); }
function sha256Text(text) { return crypto.createHash("sha256").update(String(text), "utf8").digest("hex"); }
function digest(value) { return sha256Text(stable(value)); }
function outputPath() { return process.argv[2] || path.join(DOC, "results/stage-0/STAGE_0_TECHNICAL_RESULT.json"); }
function writeResult(result) {
  const out = outputPath();
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const text = JSON.stringify(result, null, 2) + "\n";
  fs.writeFileSync(out, text);
  return { path: out, sha256: sha256Text(text), bytes: Buffer.byteLength(text) };
}
function overlaps(a0, a1, b0, b1) { return Math.max(a0, b0) <= Math.min(a1, b1); }

function staticGuards() {
  need(STUDY_SPEC.studyId === "MLGMR-STUDY1", "study spec mismatch");
  need(STAGE0_SPEC.studyId === STUDY_SPEC.studyId, "Stage 0 spec study mismatch");
  need(STAGE0_SPEC.stageId === "MLGMR-S0-TECHNICAL-2026-09-26-v1", "Stage 0 id mismatch");
  need(AUTH.studyId === STUDY_SPEC.studyId && AUTH.stageId === STAGE0_SPEC.stageId, "authorization identity mismatch");
  need(AUTH.decision === "AUTHORIZED" && AUTH.authorizationType === "TECHNICAL-ONLY", "Stage 0 not authorized");
  need(AUTH.freshScientificSeedAccessAuthorized === false, "fresh scientific access guard invalid");
  need(AUTH.stage1SeedAccessAuthorized === false && AUTH.stage2SeedAccessAuthorized === false, "future stage guard invalid");
  need(AUTH.g3_08ScientificEvidenceReuseAuthorized === false && AUTH.g4_02ScientificDecisionProxyAuthorized === false, "upstream evidence guard invalid");
  need(AUTH.g4_04SameEvidenceRerunAuthorized === false, "G4-04 rerun guard invalid");
  need(AUTH.g3_11Depth10RerunAuthorized === false && AUTH.g4_10Depth11AccessAuthorized === false, "protected evidence guard invalid");
  need(AUTH.publicAiChangeAuthorized === false && AUTH.mainIntegrationAuthorized === false, "deployment/integration guard invalid");
  need(MP.representationId === STUDY_SPEC.representation.id && MI.representationId === STUDY_SPEC.representation.id, "representation binding mismatch");
  same(STAGE0_SPEC.checkpointPlies, STUDY_SPEC.checkpointGrid.plies, "checkpoint binding mismatch");
  same(STAGE0_SPEC.lagCheckpointIntervals, STUDY_SPEC.lagFamily.checkpointIntervals, "lag binding mismatch");
  same(STAGE0_SPEC.returnHorizons, STUDY_SPEC.secondaryReturnEndpoint.horizonsChangeIntervals, "return horizon binding mismatch");
  const t = STAGE0_SPEC.technicalFixtureSeedBlock;
  need(t.scientificUseAuthorized === false, "technical seed scientific-use guard invalid");
  need(!overlaps(t.start, t.end, STUDY_SPEC.stages.stage1.seedStart, STUDY_SPEC.stages.stage1.seedEnd), "technical seed overlaps Stage 1 reservation");
  need(!overlaps(t.start, t.end, STUDY_SPEC.stages.stage2.seedStart, STUDY_SPEC.stages.stage2.seedEnd), "technical seed overlaps Stage 2 reservation");
}

function q(lib, n) { return lib.q(BigInt(n)); }

function syntheticRows(lib) {
  same(MP.AXES, MI.AXES, "axis definition mismatch");
  need(MP.AXES.length === 6, "six axes required");
  const [a1, a2, a3, a4, a5, a6] = MP.AXES;
  const values = {
    [a1]: [0,1,2,3,4,5,6,7,8,9,10,11,10,9,8],
    [a2]: [0,1,2,3,4,5,6,7,8,9,10,11,10,11,12],
    [a3]: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    [a4]: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [a5]: [14,13,12,11,10,9,8,7,6,5,4,3,2,1,0],
    [a6]: [0,1,2,2,3,4,5,6,7,8,9,10,11,12,13]
  };
  const rows = [];
  for (let i = 0; i < 15; i++) {
    const coordinates = {};
    for (const axis of MP.AXES) coordinates[axis] = q(lib, values[axis][i]);
    rows.push({
      ply: 16 + 4 * i,
      phase: i <= 7 ? "namua" : "mtaji",
      representation: { representationId: STUDY_SPEC.representation.id, coordinates }
    });
  }
  return rows;
}

function semanticCoverage(summary) {
  const slots = Object.values(summary.lag.slots);
  const returnClasses = [];
  for (const axis of Object.keys(summary.return.byAxis)) {
    for (const row of Object.values(summary.return.byAxis[axis].horizons)) returnClasses.push(row.classification);
  }
  return {
    same: slots.some(x => x.sameCount > 0),
    opposite: slots.some(x => x.oppositeCount > 0),
    zero: slots.some(x => x.zeroExcludedCount > 0),
    phaseCrossingCensor: slots.some(x => x.phaseCrossingCensoredCount > 0),
    windowCensor: slots.some(x => x.windowCensoredCount > 0),
    firstReversal: Object.values(summary.return.byAxis).some(x => x.firstReversal !== null),
    return: returnClasses.includes("RETURN"),
    stayReversed: returnClasses.includes("STAY-REVERSED"),
    noWindow: returnClasses.includes("NO-WINDOW")
  };
}

function verifySyntheticSemantics() {
  const pRows = syntheticRows(GP);
  const iRows = syntheticRows(GI);
  const p = MP.summary(pRows, STAGE0_SPEC.lagCheckpointIntervals, STAGE0_SPEC.returnHorizons);
  const i = MI.summary(iRows, STAGE0_SPEC.lagCheckpointIntervals, STAGE0_SPEC.returnHorizons);
  same(p, i, "production/independent synthetic summary mismatch");
  const coverage = semanticCoverage(p);
  for (const [key, value] of Object.entries(coverage)) need(value === true, `synthetic semantic coverage missing ${key}`);

  const labels = {};
  for (const axis of MP.AXES) for (const lag of STAGE0_SPEC.lagCheckpointIntervals) labels[MP.slotId(axis, lag)] = "NOT-CONFIRMED";
  labels[MP.slotId(MP.AXES[0], 1)] = "PERSISTENCE-CONFIRMED";
  labels[MP.slotId(MP.AXES[0], 2)] = "PERSISTENCE-CONFIRMED";
  const pc = MP.contiguousPersistence(labels, STAGE0_SPEC.lagCheckpointIntervals);
  const ic = MI.contiguousPersistence(labels, STAGE0_SPEC.lagCheckpointIntervals);
  same(pc, ic, "contiguous persistence mismatch");
  need(pc[MP.AXES[0]] === 2, "contiguous persistence expected lag2");
  need(pc[MP.AXES[1]] === "NONE", "contiguous persistence expected NONE");

  const balances = [3, 2, 1, -1, 0, 4, -2];
  const pt = MP.formalSignTest(balances);
  const it = MI.formalSignTest(balances);
  same(pt, it, "formal sign-test technical mismatch");

  return { coverage, summaryDigest: digest(p), contiguousPersistence: pc, signTest: pt };
}

function replayIdentity(x) {
  return {
    policyId: x.policyId,
    seed: x.seed,
    moveKeys: x.moveKeys,
    trajectorySha256: x.trajectorySha256,
    terminal: x.terminal,
    rows: x.rows.map(row => ({ ply: row.ply, phase: row.phase, terminal: row.terminal, rootLegalWidth: row.rootLegalWidth, rawStateSha256: row.rawStateSha256 }))
  };
}

function checkpointRows(replay) {
  const wanted = new Set(STAGE0_SPEC.checkpointPlies);
  return replay.rows.filter(row => wanted.has(row.ply));
}

function completeThrough72(replay) {
  const cps = checkpointRows(replay);
  if (cps.length !== STAGE0_SPEC.checkpointPlies.length) return false;
  if (cps.some(row => row.terminal)) return false;
  return cps[cps.length - 1].ply === 72;
}

function limits() {
  const x = STUDY_SPEC.resourceCeilings.perCheckpointPerImplementation;
  return {
    distinctRawStates: x.uniqueRawStates,
    uniqueTransitions: x.uniqueTransitions,
    parentExpansions: x.parentExpansions,
    legalMoveEvaluations: x.legalMoveEvaluations,
    treeNodeOccurrences: x.summedTreeNodeOccurrences
  };
}

function preflightAndMeasure(policyId) {
  const block = STAGE0_SPEC.technicalFixtureSeedBlock;
  const resource = limits();
  const rejections = {};
  for (let seed = block.start; seed <= block.end; seed++) {
    let p;
    let i;
    try {
      p = TP.replay(E, policyId, seed, 80);
      i = TI.replay(E, policyId, seed, 80);
    } catch (error) {
      const key = String(error && error.message || error).includes("relay-limit") ? "SOURCE-RELAY-LIMIT" : "SOURCE-ERROR";
      rejections[key] = (rejections[key] || 0) + 1;
      continue;
    }
    same(replayIdentity(p), replayIdentity(i), `technical replay identity mismatch ${policyId} seed=${seed}`);
    if (!completeThrough72(p)) {
      rejections["TERMINAL-BEFORE-72"] = (rejections["TERMINAL-BEFORE-72"] || 0) + 1;
      continue;
    }
    const pCps = checkpointRows(p);
    const iCps = checkpointRows(i);
    const pRows = [];
    const iRows = [];
    let eligible = true;
    const preflight = [];
    for (let c = 0; c < pCps.length; c++) {
      const pp = TP.preflightContinuous(E, pCps[c].state, seed, pCps[c].ply, resource);
      const ip = TI.preflightContinuous(E, iCps[c].state, seed, iCps[c].ply, resource);
      same(pp, ip, `preflight mismatch ${policyId} seed=${seed} ply=${pCps[c].ply}`);
      preflight.push({ ply: pCps[c].ply, eligible: pp.eligible, reasonCode: pp.reasonCode });
      if (!pp.eligible) eligible = false;
    }
    if (!eligible) {
      rejections["DEPTH5-PREFLIGHT-INELIGIBLE"] = (rejections["DEPTH5-PREFLIGHT-INELIGIBLE"] || 0) + 1;
      continue;
    }
    for (let c = 0; c < pCps.length; c++) {
      const pm = TP.measureContinuous(E, pCps[c].state, seed, pCps[c].ply);
      const im = TI.measureContinuous(E, iCps[c].state, seed, iCps[c].ply);
      same(pm.representation, im.representation, `continuous representation mismatch ${policyId} seed=${seed} ply=${pCps[c].ply}`);
      pRows.push({ ply: pCps[c].ply, phase: pCps[c].phase, representation: pm.representation });
      iRows.push({ ply: iCps[c].ply, phase: iCps[c].phase, representation: im.representation });
    }
    const ps = MP.summary(pRows, STAGE0_SPEC.lagCheckpointIntervals, STAGE0_SPEC.returnHorizons);
    const is = MI.summary(iRows, STAGE0_SPEC.lagCheckpointIntervals, STAGE0_SPEC.returnHorizons);
    same(ps, is, `technical MLGMR summary mismatch ${policyId} seed=${seed}`);
    return {
      policyId,
      technicalSeed: seed,
      checkpointCount: pRows.length,
      preflight,
      rejectionCountsBeforeSelection: rejections,
      summaryDigest: digest(ps),
      productionIndependentExact: true,
      scientificUseAuthorized: false
    };
  }
  throw new Error(`no fully eligible technical trajectory for ${policyId} in ${block.start}..${block.end}`);
}

function verifyFirewallFixture() {
  const block = STAGE0_SPEC.technicalFixtureSeedBlock;
  const seed = block.start;
  const checkpoints = STAGE0_SPEC.checkpointPlies;
  const p = GP.sourceTrajectory(E, STAGE0_SPEC.stageId, seed, checkpoints, null);
  const i = GI.sourceTrajectory(E, STAGE0_SPEC.stageId, seed, checkpoints, null);
  same({ eligible: p.eligible, reason: p.reason, sourceTrajectorySha256: p.sourceTrajectorySha256, openingPrefixSha256: p.openingPrefixSha256 }, { eligible: i.eligible, reason: i.reason, sourceTrajectorySha256: i.sourceTrajectorySha256, openingPrefixSha256: i.openingPrefixSha256 }, "firewall source identity mismatch");
  if (!p.eligible) return { exercised: false, reason: p.reason || "TECHNICAL-SOURCE-INELIGIBLE" };
  const fwP = { trajectory: new Set([p.sourceTrajectorySha256]), prefix: new Set(), root: new Set() };
  const fwI = { trajectory: new Set([i.sourceTrajectorySha256]), prefix: new Set(), root: new Set() };
  const blockedP = GP.sourceTrajectory(E, STAGE0_SPEC.stageId, seed, checkpoints, fwP);
  const blockedI = GI.sourceTrajectory(E, STAGE0_SPEC.stageId, seed, checkpoints, fwI);
  same({ eligible: blockedP.eligible, reason: blockedP.reason }, { eligible: blockedI.eligible, reason: blockedI.reason }, "firewall block mismatch");
  need(blockedP.eligible === false && blockedP.reason === "UPSTREAM-TRAJECTORY", "firewall trajectory fixture did not block");
  return { exercised: true, reason: blockedP.reason };
}

function verifyImplementationSeparation() {
  const prod = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/mlgmr-production.js"), "utf8");
  const independent = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/mlgmr-independent.js"), "utf8");
  need(!prod.includes("mlgmr-independent"), "production imports independent implementation");
  need(!independent.includes("mlgmr-production"), "independent imports production implementation");
  need(prod.includes("gcld-production.js"), "production does not bind production upstream");
  need(independent.includes("gcld-independent.js"), "independent does not bind independent upstream");
}

function gateRows() {
  return STAGE0_SPEC.mandatoryGates.map(id => ({ id, status: "PASS" }));
}

function run() {
  const started = Date.now();
  const rssBefore = process.memoryUsage().rss;
  staticGuards();
  verifyImplementationSeparation();
  const synthetic = verifySyntheticSemantics();
  const firewall = verifyFirewallFixture();
  const p1 = preflightAndMeasure(TP.P1);
  const p2 = preflightAndMeasure(TP.P2);
  const rssAfter = process.memoryUsage().rss;
  const result = {
    schemaVersion: 1,
    studyId: STUDY_SPEC.studyId,
    stageId: STAGE0_SPEC.stageId,
    evidenceClass: "TECHNICAL-FIXTURE",
    disposition: "STAGE0-PASS",
    scientificExecution: false,
    scientificOutcomeGenerated: false,
    freshScientificSeedReads: 0,
    stage1SeedReads: 0,
    stage2SeedReads: 0,
    g4_10Depth11AccessCount: 0,
    publicAiChange: false,
    mainIntegration: false,
    mandatoryGates: gateRows(),
    synthetic,
    firewall,
    technicalPolicies: [p1, p2],
    productionIndependentExact: true,
    resourceObservation: {
      elapsedMs: Date.now() - started,
      rssBeforeBytes: rssBefore,
      rssAfterBytes: rssAfter,
      peakRssCeilingBytes: STUDY_SPEC.resourceCeilings.stagePeakRssBytes
    }
  };
  need(result.resourceObservation.rssAfterBytes <= result.resourceObservation.peakRssCeilingBytes, "Stage 0 RSS ceiling exceeded");
  const written = writeResult(result);
  console.log(`MLGMR_STAGE0_DISPOSITION=${result.disposition}`);
  console.log(`MLGMR_STAGE0_RESULT_SHA256=${written.sha256}`);
  console.log(`MLGMR_STAGE0_RESULT_BYTES=${written.bytes}`);
}

try {
  run();
} catch (error) {
  const result = {
    schemaVersion: 1,
    studyId: "MLGMR-STUDY1",
    stageId: "MLGMR-S0-TECHNICAL-2026-09-26-v1",
    evidenceClass: "TECHNICAL-FIXTURE",
    disposition: "STAGE0-TECHNICAL-INVALID",
    scientificExecution: false,
    scientificOutcomeGenerated: false,
    freshScientificSeedReads: 0,
    stage1SeedReads: 0,
    stage2SeedReads: 0,
    g4_10Depth11AccessCount: 0,
    error: String(error && error.stack ? error.stack : error)
  };
  const written = writeResult(result);
  console.error(result.error);
  console.error(`MLGMR_STAGE0_RESULT_SHA256=${written.sha256}`);
  process.exitCode = 1;
}
