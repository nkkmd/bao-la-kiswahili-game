#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const TP = require("./lib/lgttci-compatibility-production.js");
const TI = require("./lib/lgttci-compatibility-independent.js");
const MP = require("./lib/mlgmr-production.js");
const MI = require("./lib/mlgmr-independent.js");
const FW = require("./lib/mlgmr-stage2-firewall.js");
const IP = require("./lib/mlgmr-stage2-inference-production.js");
const II = require("./lib/mlgmr-stage2-inference-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/multiscale-local-geometry-memory-return");
const STUDY = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STUDY_1_SPEC.json"), "utf8"));
const SPEC = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STAGE_2_FORMAL_SPEC.json"), "utf8"));
const FW_SPEC = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STAGE_2_IDENTITY_FIREWALL.json"), "utf8"));
const S1 = JSON.parse(fs.readFileSync(path.join(DOC, "results/stage-1/STAGE_1_CANONICAL_RECORD.json"), "utf8"));
const EXECUTION = { freshScientificSeedReads: 0, firstSeedRead: null, lastSeedRead: null };

function need(value, message) { if (!value) throw new Error(message); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
}
function same(a, b, message) { need(stable(a) === stable(b), message); }
function sha256Bytes(bytes) { return crypto.createHash("sha256").update(bytes).digest("hex"); }
function sha256File(file) { return sha256Bytes(fs.readFileSync(file)); }
function digest(value) { return sha256Bytes(Buffer.from(stable(value), "utf8")); }
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const text = JSON.stringify(value, null, 2) + "\n";
  fs.writeFileSync(file, text);
  return { sha256: sha256Bytes(Buffer.from(text, "utf8")), bytes: Buffer.byteLength(text) };
}
function parseArgs() {
  const out = {};
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("--")) continue;
    const key = args[i].slice(2);
    out[key] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
  }
  return out;
}
function limits() {
  const x = SPEC.resourceCeilings.perCheckpointPerImplementation;
  return {
    distinctRawStates: x.uniqueRawStates,
    uniqueTransitions: x.uniqueTransitions,
    parentExpansions: x.parentExpansions,
    legalMoveEvaluations: x.legalMoveEvaluations,
    treeNodeOccurrences: x.summedTreeNodeOccurrences
  };
}
function bump(obj, key) { obj[key] = (obj[key] || 0) + 1; }

function staticGuards(auth) {
  need(STUDY.studyId === "MLGMR-STUDY1" && SPEC.studyId === STUDY.studyId, "study mismatch");
  need(SPEC.stageId === "MLGMR-S2-FORMAL-2026-09-26-v1", "Stage 2 stage mismatch");
  need(SPEC.scientificExecutionAuthorized === false, "frozen Stage 2 spec must remain pre-authorization");
  need(SPEC.seedBlock.start === STUDY.stages.stage2.seedStart && SPEC.seedBlock.end === STUDY.stages.stage2.seedEnd, "Stage 2 seed block mismatch");
  same(SPEC.trajectoryContract.checkpointPlies, STUDY.checkpointGrid.plies, "checkpoint mismatch");
  same(SPEC.lagCheckpointIntervals, STUDY.lagFamily.checkpointIntervals, "lag mismatch");
  same(SPEC.returnHorizons, STUDY.secondaryReturnEndpoint.horizonsChangeIntervals, "return horizon mismatch");
  same(SPEC.formalFamily.slotIds, S1.supportOnlyPromotion.supportedSlotIds, "formal family differs from Stage 1 support-only promotion");
  need(SPEC.formalFamily.slotCount === 16 && new Set(SPEC.formalFamily.slotIds).size === 16, "formal family invalid");
  need(SPEC.formalFamily.effectDirectionUsedForMembership === false, "effect direction must not select formal family");
  need(FW_SPEC.status === "FROZEN-PRE-STAGE2-FRESH" && FW_SPEC.stage2Reservation.accessed === false, "Stage 2 firewall state invalid");
  need(FW_SPEC.stage2Reservation.start === SPEC.seedBlock.start && FW_SPEC.stage2Reservation.end === SPEC.seedBlock.end, "firewall seed reservation mismatch");
  need(MP.representationId === STUDY.representation.id && MI.representationId === STUDY.representation.id, "representation mismatch");
  same(MP.AXES, MI.AXES, "MLGMR axis mismatch");
  need(auth.studyId === STUDY.studyId && auth.stageId === SPEC.stageId, "authorization identity mismatch");
  need(auth.decision === "AUTHORIZED" && auth.authorizationType === "ONE-SHOT-SCIENTIFIC-FORMAL-HOLDOUT", "Stage 2 execution not authorized");
  need(auth.freshScientificSeedAccessAuthorized === true && auth.stage2SeedAccessAuthorized === true, "Stage 2 fresh access authorization missing");
  need(auth.stage1SeedAccessAuthorized === false, "Stage 1 access must remain disabled");
  need(auth.formalInferenceAuthorized === true, "formal inference authorization missing");
  need(auth.g4_10Depth11AccessAuthorized === false, "G4-10 depth11 access must remain disabled");
  need(auth.publicAiChangeAuthorized === false && auth.mainIntegrationAuthorized === false, "public AI/main guard invalid");
  need(auth.singleAttemptOnly === true, "single-attempt guard missing");
  need(auth.seedExtensionAuthorized === false && auth.sameEvidenceRerunAuthorized === false, "no-rescue guard invalid");
}

function verifyImplementationSeparation() {
  const mp = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/mlgmr-production.js"), "utf8");
  const mi = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/mlgmr-independent.js"), "utf8");
  const ip = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/mlgmr-stage2-inference-production.js"), "utf8");
  const ii = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/mlgmr-stage2-inference-independent.js"), "utf8");
  need(!mp.includes("mlgmr-independent"), "production MLGMR imports independent implementation");
  need(!mi.includes("mlgmr-production"), "independent MLGMR imports production implementation");
  need(!ip.includes("mlgmr-stage2-inference-independent"), "production inference imports independent inference");
  need(!ii.includes("mlgmr-stage2-inference-production"), "independent inference imports production inference");
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
function openingPrefixSha(replay) { return TP.digest(replay.moveKeys.slice(0, 16).join("\n")); }
function checkpointRows(replay) {
  const wanted = new Set(SPEC.trajectoryContract.checkpointPlies);
  return replay.rows.filter(row => wanted.has(row.ply));
}
function identityRow(replay) {
  return {
    policyId: replay.policyId,
    sourceSeed: replay.seed,
    sourceTrajectorySha256: replay.trajectorySha256,
    openingPrefixSha256: openingPrefixSha(replay),
    moveCount: replay.moveKeys.length,
    checkpointRoots: checkpointRows(replay).map(row => ({ ply: row.ply, rootRawSha256: row.rawStateSha256 }))
  };
}
function completeThrough72(replay) {
  const cps = checkpointRows(replay);
  return cps.length === SPEC.trajectoryContract.checkpointPlies.length && cps.every(row => !row.terminal) && cps[cps.length - 1].ply === SPEC.trajectoryContract.nonterminalThroughPly;
}
function policyForSeed(seed) {
  return (seed - SPEC.seedBlock.start) % 2 === 0 ? TP.P1 : TP.P2;
}
function firewallCollision(row, fw) {
  if (fw.seeds.has(row.sourceSeed)) return "UPSTREAM-SEED";
  if (fw.trajectory.has(row.sourceTrajectorySha256)) return "UPSTREAM-TRAJECTORY";
  if (fw.prefix.has(row.openingPrefixSha256)) return "UPSTREAM-PREFIX";
  for (const cp of row.checkpointRoots || []) if (fw.root.has(cp.rootRawSha256)) return "UPSTREAM-ROOT";
  return null;
}

function verifyStage1Artifact(upstreamRoot) {
  const source = SPEC.stage1SourceArtifact;
  const resultFile = path.join(upstreamRoot, "g4-07-stage1", source.resultFile);
  const identityFile = path.join(upstreamRoot, "g4-07-stage1", source.identityFile);
  need(fs.existsSync(resultFile) && fs.existsSync(identityFile), "Stage 1 artifact files missing");
  need(sha256File(resultFile) === source.resultFileSha256, "Stage 1 result digest mismatch");
  need(sha256File(identityFile) === source.identityFileSha256, "Stage 1 identity digest mismatch");
  const identity = JSON.parse(fs.readFileSync(identityFile, "utf8"));
  need(identity.scientificOutcomeFieldsRetained === false && identity.identityRowCount === source.identityRowCount && identity.identityRows.length === source.identityRowCount, "Stage 1 identity contract mismatch");
  return { resultFileSha256: source.resultFileSha256, identityFileSha256: source.identityFileSha256, identityRowCount: source.identityRowCount };
}

function scanCandidates(fw) {
  const resource = limits();
  const candidates = { [TP.P1]: [], [TP.P2]: [] };
  const rejections = { [TP.P1]: {}, [TP.P2]: {} };
  const consumedIdentityRows = [];
  for (let seed = SPEC.seedBlock.start; seed <= SPEC.seedBlock.end; seed++) {
    const policyId = policyForSeed(seed);
    if (candidates[policyId].length >= SPEC.trajectoryContract.candidateTargetPerPolicy) continue;
    if (fw.seeds.has(seed)) { bump(rejections[policyId], "UPSTREAM-SEED"); continue; }
    EXECUTION.freshScientificSeedReads++;
    if (EXECUTION.firstSeedRead === null) EXECUTION.firstSeedRead = seed;
    EXECUTION.lastSeedRead = seed;
    let p, i;
    try {
      p = TP.replay(E, policyId, seed, 80);
      i = TI.replay(E, policyId, seed, 80);
    } catch (error) {
      bump(rejections[policyId], String(error && error.message || error).includes("relay-limit") ? "SOURCE-RELAY-LIMIT" : "SOURCE-ERROR");
      continue;
    }
    same(replayIdentity(p), replayIdentity(i), `replay identity mismatch ${policyId} seed=${seed}`);
    const identity = identityRow(p);
    consumedIdentityRows.push(identity);
    const collision = firewallCollision(identity, fw);
    if (collision) { bump(rejections[policyId], collision); continue; }
    if (!completeThrough72(p)) { bump(rejections[policyId], "TERMINAL-BEFORE-72"); continue; }
    const pCps = checkpointRows(p), iCps = checkpointRows(i);
    const preflight = [];
    let eligible = true;
    for (let c = 0; c < pCps.length; c++) {
      const pp = TP.preflightContinuous(E, pCps[c].state, seed, pCps[c].ply, resource);
      const ip = TI.preflightContinuous(E, iCps[c].state, seed, iCps[c].ply, resource);
      same(pp, ip, `preflight mismatch ${policyId} seed=${seed} ply=${pCps[c].ply}`);
      preflight.push({ ply: pCps[c].ply, eligible: pp.eligible, reasonCode: pp.reasonCode });
      if (!pp.eligible) eligible = false;
    }
    if (!eligible) { bump(rejections[policyId], "DEPTH5-PREFLIGHT-INELIGIBLE"); continue; }
    candidates[policyId].push({ replay: p, identity, preflight });
    if (candidates[TP.P1].length >= SPEC.trajectoryContract.candidateTargetPerPolicy && candidates[TP.P2].length >= SPEC.trajectoryContract.candidateTargetPerPolicy) break;
  }
  for (const policyId of [TP.P1, TP.P2]) need(candidates[policyId].length >= SPEC.trajectoryContract.minimumFullyEligiblePerPolicy, `minimum fully eligible not met ${policyId}`);
  return { candidates, rejections, consumedIdentityRows };
}

function measureCandidate(candidate) {
  const p = candidate.replay;
  const i = TI.replay(E, p.policyId, p.seed, 80);
  same(replayIdentity(p), replayIdentity(i), `measurement replay mismatch ${p.policyId} seed=${p.seed}`);
  const pCps = checkpointRows(p), iCps = checkpointRows(i);
  const pRows = [], iRows = [];
  for (let c = 0; c < pCps.length; c++) {
    const pm = TP.measureContinuous(E, pCps[c].state, p.seed, pCps[c].ply);
    const im = TI.measureContinuous(E, iCps[c].state, p.seed, iCps[c].ply);
    same(pm.representation, im.representation, `representation mismatch ${p.policyId} seed=${p.seed} ply=${pCps[c].ply}`);
    pRows.push({ ply: pCps[c].ply, phase: pCps[c].phase, representation: pm.representation });
    iRows.push({ ply: iCps[c].ply, phase: iCps[c].phase, representation: im.representation });
  }
  const ps = MP.summary(pRows, SPEC.lagCheckpointIntervals, SPEC.returnHorizons);
  const is = MI.summary(iRows, SPEC.lagCheckpointIntervals, SPEC.returnHorizons);
  same(ps, is, `MLGMR summary mismatch ${p.policyId} seed=${p.seed}`);
  return {
    policyId: p.policyId,
    sourceSeed: p.seed,
    identity: candidate.identity,
    preflight: candidate.preflight,
    primary: ps.lag,
    returnDescriptive: ps.return,
    summaryDigest: digest(ps),
    productionIndependentExact: true
  };
}

function formalInference(measurements) {
  need(measurements.length === SPEC.trajectoryContract.formalMeasuredTrajectoriesRequired, "formal measured trajectory count mismatch");
  const byPolicy = Object.fromEntries([TP.P1, TP.P2].map(policy => [policy, measurements.filter(row => row.policyId === policy)]));
  for (const policy of [TP.P1, TP.P2]) need(byPolicy[policy].length === SPEC.trajectoryContract.measuredPerPolicy, `measured-per-policy mismatch ${policy}`);
  const base = [];
  for (const slotId of SPEC.formalFamily.slotIds) {
    const supportByPolicy = {};
    let supportTotal = 0;
    const balances = [];
    for (const policy of [TP.P1, TP.P2]) {
      const rows = byPolicy[policy];
      const supporting = rows.filter(row => row.primary.slots[slotId].comparableNonzero >= 3).length;
      supportByPolicy[policy] = supporting;
      supportTotal += supporting;
      for (const row of rows) balances.push(row.primary.slots[slotId].balance);
    }
    let positive = 0, negative = 0, zero = 0;
    for (const balance of balances) balance > 0 ? positive++ : balance < 0 ? negative++ : zero++;
    const supportOK = supportTotal >= SPEC.formalSupportGate.supportTrajectoriesRequired && [TP.P1, TP.P2].every(policy => supportByPolicy[policy] >= SPEC.formalSupportGate.supportPerPolicyRequired);
    const nonzeroOK = positive + negative >= SPEC.formalSupportGate.nonzeroTrajectoryBalancesRequired;
    const estimable = supportOK && nonzeroOK;
    const pProd = IP.exactTwoSidedSignTest(positive, negative, zero);
    const pInd = II.exactTwoSidedSignTest(positive, negative, zero);
    need(IP.cmp(pProd.pValue, pInd.pValue) === 0, `independent sign-test p mismatch ${slotId}`);
    const mProd = MP.formalSignTest(balances);
    const mInd = MI.formalSignTest(balances);
    same(mProd, mInd, `MLGMR formal sign-test mismatch ${slotId}`);
    need(mProd.positive === positive && mProd.negative === negative && mProd.ties === zero && mProd.nonzero === positive + negative, `MLGMR sign counts mismatch ${slotId}`);
    need(IP.cmp(mProd.pValue, pProd.pValue) === 0, `MLGMR/inference sign-test mismatch ${slotId}`);
    base.push({
      slotId,
      supportByPolicy,
      supportTotal,
      supportOK,
      positive,
      negative,
      zero,
      nonzero: positive + negative,
      nonzeroOK,
      estimable,
      rawPValue: pProd.pValue,
      holmInputPValue: estimable ? pProd.pValue : IP.q(1n)
    });
  }
  const hp = IP.holm(base.map(row => ({ slotId: row.slotId, pValue: row.holmInputPValue })), 16);
  const hi = II.holm(base.map(row => ({ slotId: row.slotId, pValue: row.holmInputPValue })), 16);
  const labels = {};
  const rows = base.map((row, index) => {
    need(hp[index].slotId === row.slotId && hi[index].slotId === row.slotId, `Holm slot order mismatch ${row.slotId}`);
    need(IP.cmp(hp[index].holmAdjustedPValue, hi[index].holmAdjustedPValue) === 0, `Holm cross-check mismatch ${row.slotId}`);
    need(hp[index].holmRank === hi[index].holmRank, `Holm rank mismatch ${row.slotId}`);
    const holmSignificant = row.estimable && IP.significantAtFamilyAlpha(hp[index]);
    const decisionP = IP.decision({ estimable: row.estimable, holmSignificant, positive: row.positive, negative: row.negative });
    const decisionI = II.decision({ estimable: row.estimable, holmSignificant, positive: row.positive, negative: row.negative });
    need(decisionP === decisionI, `decision cross-check mismatch ${row.slotId}`);
    labels[row.slotId] = decisionP;
    return { ...row, holmRank: hp[index].holmRank, holmAdjustedPValue: hp[index].holmAdjustedPValue, holmSignificant, decision: decisionP };
  });
  const boundedP = MP.contiguousPersistence(labels, SPEC.boundedMemorySummary.orderedLags);
  const boundedI = MI.contiguousPersistence(labels, SPEC.boundedMemorySummary.orderedLags);
  same(boundedP, boundedI, "bounded-memory summary mismatch");
  return { rows, labels, confirmedContiguousPersistenceLagMax: boundedP };
}

function aggregateReturn(measurements) {
  const out = {};
  for (const axis of MP.AXES) {
    out[axis] = {};
    for (const horizon of SPEC.returnHorizons) {
      const counts = {};
      for (const row of measurements) {
        const classification = row.returnDescriptive.byAxis[axis].horizons[String(horizon)].classification;
        counts[classification] = (counts[classification] || 0) + 1;
      }
      out[axis][String(horizon)] = counts;
    }
  }
  return out;
}

function main() {
  const args = parseArgs();
  need(args["execute-authorized-once"] === true, "explicit one-shot execution flag required");
  need(process.env.MLGMR_STAGE2_EXECUTION_TRIGGER_OK === "1" && process.env.MLGMR_STAGE2_EXECUTION_LEASE_OK === "1", "Stage 2 trigger/lease guard missing");
  const authPath = path.join(DOC, "authorizations/STAGE_2_AUTHORIZATION.json");
  need(fs.existsSync(authPath), "Stage 2 final authorization missing");
  const auth = JSON.parse(fs.readFileSync(authPath, "utf8"));
  staticGuards(auth);
  verifyImplementationSeparation();

  const upstreamRoot = process.env.MLGMR_STAGE2_UPSTREAM_DIR || path.join(ROOT, "upstream/mlgmr-stage2");
  const stage1ArtifactVerification = verifyStage1Artifact(upstreamRoot);
  const firewall = FW.load({ root: ROOT, spec: FW_SPEC, upstreamRoot });
  console.log(`MLGMR_STAGE2_FIREWALL_READY=${firewall.summary.digest}`);
  console.log("MLGMR_STAGE2_FRESH_SEED_READS_BEFORE_SCAN=0");

  const started = Date.now();
  const scan = scanCandidates(firewall.sets);
  const selected = [];
  for (const policy of [TP.P1, TP.P2]) selected.push(...scan.candidates[policy].slice(0, SPEC.trajectoryContract.measuredPerPolicy));
  need(selected.length === SPEC.trajectoryContract.formalMeasuredTrajectoriesRequired, "formal selected population incomplete");
  const measurements = selected.map(measureCandidate);
  need(measurements.every(row => row.productionIndependentExact === true), "production/independent measurement disagreement");
  const inference = formalInference(measurements);
  const returnDescriptive = aggregateReturn(measurements);
  const elapsedMs = Date.now() - started;
  const rssBytes = process.memoryUsage().rss;
  need(elapsedMs <= SPEC.resourceCeilings.stageElapsedMs, "Stage 2 elapsed ceiling exceeded");
  need(rssBytes <= SPEC.resourceCeilings.stagePeakRssBytes, "Stage 2 RSS ceiling exceeded");

  const decisionCounts = inference.rows.reduce((out, row) => { out[row.decision] = (out[row.decision] || 0) + 1; return out; }, {});
  const candidateManifest = {
    schemaVersion: 1,
    studyId: STUDY.studyId,
    stageId: SPEC.stageId,
    scientificOutcomeFieldsRetained: false,
    consumedSeedNamespace: { start: SPEC.seedBlock.start, end: SPEC.seedBlock.end },
    freshScientificSeedReads: EXECUTION.freshScientificSeedReads,
    firstSeedRead: EXECUTION.firstSeedRead,
    lastSeedRead: EXECUTION.lastSeedRead,
    identityRowCount: scan.consumedIdentityRows.length,
    identityRows: scan.consumedIdentityRows
  };
  const formalMeasurements = {
    schemaVersion: 1,
    studyId: STUDY.studyId,
    stageId: SPEC.stageId,
    measuredCount: measurements.length,
    measuredPerPolicy: { [TP.P1]: measurements.filter(row => row.policyId === TP.P1).length, [TP.P2]: measurements.filter(row => row.policyId === TP.P2).length },
    productionIndependentExact: true,
    rows: measurements
  };
  const formalInferenceOutput = {
    schemaVersion: 1,
    studyId: STUDY.studyId,
    stageId: SPEC.stageId,
    formalInferencePerformed: true,
    formalFamilySize: SPEC.formalFamily.slotCount,
    formalTest: SPEC.formalInference.test,
    multiplicity: SPEC.formalInference.multiplicity,
    familyAlpha: SPEC.formalInference.familyAlpha,
    rows: inference.rows,
    confirmedContiguousPersistenceLagMax: inference.confirmedContiguousPersistenceLagMax,
    returnDescriptive
  };
  const out = path.resolve(String(args.output || "artifacts/mlgmr-stage2"));
  const manifestMeta = writeJson(path.join(out, "STAGE_2_CANDIDATE_MANIFEST.json"), candidateManifest);
  const measurementMeta = writeJson(path.join(out, "STAGE_2_FORMAL_MEASUREMENTS.json"), formalMeasurements);
  const inferenceMeta = writeJson(path.join(out, "STAGE_2_FORMAL_INFERENCE.json"), formalInferenceOutput);
  const result = {
    schemaVersion: 1,
    studyId: STUDY.studyId,
    stageId: SPEC.stageId,
    evidenceClass: SPEC.evidenceClass,
    stageDisposition: "FORMAL-COMPLETE",
    authorizationDecision: auth.decision,
    formalInferencePerformed: true,
    freshScientificSeedReads: EXECUTION.freshScientificSeedReads,
    firstSeedRead: EXECUTION.firstSeedRead,
    lastSeedRead: EXECUTION.lastSeedRead,
    candidateCounts: { [TP.P1]: scan.candidates[TP.P1].length, [TP.P2]: scan.candidates[TP.P2].length },
    rejectionCounts: scan.rejections,
    measuredCount: measurements.length,
    measuredPerPolicy: formalMeasurements.measuredPerPolicy,
    productionIndependentExact: true,
    formalFamilySize: SPEC.formalFamily.slotCount,
    formalDecisionCounts: decisionCounts,
    confirmedContiguousPersistenceLagMax: inference.confirmedContiguousPersistenceLagMax,
    stage1ArtifactVerification,
    firewall: firewall.summary,
    artifactFileDigests: {
      candidateManifestSha256: manifestMeta.sha256,
      formalMeasurementsSha256: measurementMeta.sha256,
      formalInferenceSha256: inferenceMeta.sha256
    },
    resourceObservation: { elapsedMs, rssBytes, stageElapsedCeilingMs: SPEC.resourceCeilings.stageElapsedMs, stagePeakRssBytes: SPEC.resourceCeilings.stagePeakRssBytes },
    stage1SameEvidenceRerun: false,
    g3_11Depth10Rerun: false,
    g4_10Depth11AccessCount: 0,
    publicAiChange: false,
    mainIntegration: false
  };
  const resultMeta = writeJson(path.join(out, "STAGE_2_RESULT.json"), result);
  need(resultMeta.bytes <= SPEC.resourceCeilings.resultArtifactBytes, "Stage 2 result artifact ceiling exceeded");
  console.log(`MLGMR_STAGE2_DISPOSITION=${result.stageDisposition}`);
  console.log(`MLGMR_STAGE2_FRESH_SEED_READS=${result.freshScientificSeedReads}`);
  console.log(`MLGMR_STAGE2_FIRST_SEED_READ=${result.firstSeedRead}`);
  console.log(`MLGMR_STAGE2_LAST_SEED_READ=${result.lastSeedRead}`);
  console.log(`MLGMR_STAGE2_RESULT_SHA256=${resultMeta.sha256}`);
  console.log(`MLGMR_STAGE2_MANIFEST_SHA256=${manifestMeta.sha256}`);
  console.log(`MLGMR_STAGE2_MEASUREMENTS_SHA256=${measurementMeta.sha256}`);
  console.log(`MLGMR_STAGE2_INFERENCE_SHA256=${inferenceMeta.sha256}`);
}

try {
  main();
} catch (error) {
  const args = parseArgs();
  const out = path.resolve(String(args.output || "artifacts/mlgmr-stage2"));
  const failure = {
    schemaVersion: 1,
    studyId: "MLGMR-STUDY1",
    stageId: "MLGMR-S2-FORMAL-2026-09-26-v1",
    stageDisposition: "TECHNICAL-INVALID",
    error: String(error && error.message ? error.message : error),
    freshScientificSeedReads: EXECUTION.freshScientificSeedReads,
    firstSeedRead: EXECUTION.firstSeedRead,
    lastSeedRead: EXECUTION.lastSeedRead,
    noRescueBoundaryCrossed: EXECUTION.freshScientificSeedReads > 0,
    rerunUnderSameAuthorizationAuthorized: false,
    seedExtensionAuthorized: false,
    replacementPopulationAuthorized: false,
    g4_10Depth11AccessCount: 0,
    publicAiChange: false,
    mainIntegration: false
  };
  writeJson(path.join(out, "STAGE_2_FAILURE.json"), failure);
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
}
