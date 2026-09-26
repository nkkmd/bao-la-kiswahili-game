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

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/multiscale-local-geometry-memory-return");
const STUDY = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STUDY_1_SPEC.json"), "utf8"));
const SPEC = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STAGE_1_DEVELOPMENT_SPEC.json"), "utf8"));
const FW_SPEC = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/UPSTREAM_IDENTITY_FIREWALL.json"), "utf8"));
const AUTH_PATH = path.join(DOC, "authorizations/STAGE_1_AUTHORIZATION.json");
const AUTH = JSON.parse(fs.readFileSync(AUTH_PATH, "utf8"));

function need(value, message) { if (!value) throw new Error(message); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function same(a, b, message) { need(stable(a) === stable(b), message); }
function sha256Bytes(bytes) { return crypto.createHash("sha256").update(bytes).digest("hex"); }
function sha256File(file) { return sha256Bytes(fs.readFileSync(file)); }
function digest(value) { return sha256Bytes(Buffer.from(stable(value), "utf8")); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const text = JSON.stringify(value, null, 2) + "\n";
  fs.writeFileSync(file, text);
  return { sha256: sha256Bytes(Buffer.from(text, "utf8")), bytes: Buffer.byteLength(text) };
}
function outputDir() { return process.argv[2] || path.join(ROOT, "artifacts/mlgmr-stage1"); }
function fileUnder(rel) { return path.join(ROOT, rel); }

function staticGuards() {
  need(STUDY.studyId === "MLGMR-STUDY1", "study mismatch");
  need(SPEC.studyId === STUDY.studyId && SPEC.stageId === "MLGMR-S1-DEVELOPMENT-2026-09-26-v1", "Stage 1 spec mismatch");
  need(FW_SPEC.studyId === STUDY.studyId && FW_SPEC.targetStage === SPEC.stageId, "firewall spec mismatch");
  need(AUTH.studyId === STUDY.studyId && AUTH.stageId === SPEC.stageId, "authorization identity mismatch");
  need(AUTH.decision === "AUTHORIZED" && AUTH.authorizationType === "ONE-SHOT-SCIENTIFIC-DEVELOPMENT", "Stage 1 scientific execution not authorized");
  need(AUTH.freshScientificSeedAccessAuthorized === true && AUTH.stage1SeedAccessAuthorized === true, "fresh Stage 1 access authorization missing");
  need(AUTH.stage2SeedAccessAuthorized === false, "Stage 2 access must remain disabled");
  need(AUTH.g4_10Depth11AccessAuthorized === false, "G4-10 depth 11 must remain disabled");
  need(AUTH.publicAiChangeAuthorized === false && AUTH.mainIntegrationAuthorized === false, "public AI/main guard invalid");
  need(AUTH.singleAttemptOnly === true, "single-attempt guard missing");
  need(SPEC.scientificExecutionAuthorized === false, "preregistered spec must remain pre-authorization frozen");
  need(SPEC.formalInferenceAllowed === false, "Stage 1 formal inference must remain disabled");
  same(SPEC.trajectoryContract.checkpointPlies, STUDY.checkpointGrid.plies, "checkpoint mismatch");
  same(SPEC.lagCheckpointIntervals, STUDY.lagFamily.checkpointIntervals, "lag mismatch");
  same(SPEC.returnHorizons, STUDY.secondaryReturnEndpoint.horizonsChangeIntervals, "return horizon mismatch");
  same(SPEC.primaryFamily.axes, MP.AXES, "production axis mismatch");
  same(MP.AXES, MI.AXES, "production/independent axis mismatch");
  need(MP.representationId === STUDY.representation.id && MI.representationId === STUDY.representation.id, "representation mismatch");
  need(SPEC.seedBlock.start === STUDY.stages.stage1.seedStart && SPEC.seedBlock.end === STUDY.stages.stage1.seedEnd, "Stage 1 seed block mismatch");
  need(FW_SPEC.stage1Reservation.start === SPEC.seedBlock.start && FW_SPEC.stage1Reservation.end === SPEC.seedBlock.end && FW_SPEC.stage1Reservation.accessed === false, "firewall Stage 1 reservation mismatch");
}

function verifyImplementationSeparation() {
  const prod = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/mlgmr-production.js"), "utf8");
  const indep = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/mlgmr-independent.js"), "utf8");
  need(!prod.includes("mlgmr-independent"), "production imports independent MLGMR");
  need(!indep.includes("mlgmr-production"), "independent imports production MLGMR");
  need(prod.includes("gcld-production.js"), "production upstream binding missing");
  need(indep.includes("gcld-independent.js"), "independent upstream binding missing");
}

function emptyFirewall() {
  return { seeds: new Set(), trajectory: new Set(), prefix: new Set(), root: new Set(), provenance: [] };
}
function addIdentityRow(fw, row, source) {
  if (Number.isInteger(row.sourceSeed)) fw.seeds.add(row.sourceSeed);
  if (row.sourceTrajectorySha256) fw.trajectory.add(row.sourceTrajectorySha256);
  if (row.openingPrefixSha256) fw.prefix.add(row.openingPrefixSha256);
  for (const cp of row.checkpointRoots || []) if (cp.rootRawSha256) fw.root.add(cp.rootRawSha256);
  fw.provenance.push({ source, sourceSeed: row.sourceSeed || null, sourceTrajectorySha256: row.sourceTrajectorySha256 || null });
}
function addSeedRange(fw, range) {
  const m = String(range).match(/^(\d+)\.\.(\d+)$/);
  need(m, `invalid excluded seed range ${range}`);
  const a = Number(m[1]), b = Number(m[2]);
  for (let n = a; n <= b; n++) fw.seeds.add(n);
}
function verifyIdentityFile(rel, expectedSha256, expectedRows, fw, sourceLabel) {
  const file = fileUnder(rel);
  need(fs.existsSync(file), `missing identity file ${rel}`);
  need(sha256File(file) === expectedSha256, `identity file digest mismatch ${rel}`);
  const obj = readJson(file);
  need(obj.scientificOutcomeFieldsRetained === false, `scientific fields retained in ${rel}`);
  need(Array.isArray(obj.identityRows) && obj.identityRows.length === expectedRows, `identity row count mismatch ${rel}`);
  for (const row of obj.identityRows) addIdentityRow(fw, row, sourceLabel);
  return { source: sourceLabel, path: rel, rowCount: obj.identityRows.length, sha256: expectedSha256 };
}
function verifyArtifactIdentityFile(localFile, spec, fw, sourceLabel) {
  need(fs.existsSync(localFile), `missing upstream artifact identity file ${localFile}`);
  need(sha256File(localFile) === spec.identityFileSha256, `artifact identity digest mismatch ${sourceLabel}`);
  const obj = readJson(localFile);
  need(obj.scientificOutcomeFieldsRetained === false, `scientific fields retained in artifact identity ${sourceLabel}`);
  need(Array.isArray(obj.identityRows) && obj.identityRows.length === spec.identityRowCount, `artifact identity row count mismatch ${sourceLabel}`);
  for (const row of obj.identityRows) addIdentityRow(fw, row, sourceLabel);
  return { source: sourceLabel, file: localFile, rowCount: obj.identityRows.length, sha256: spec.identityFileSha256 };
}
function canonicalG401Projection(rows) {
  return rows.map(x => ({
    slotSeed: x.slotSeed,
    effectiveSeed: x.effectiveSeed,
    trajectorySha256: x.trajectorySha256,
    checkpoints: (x.checkpoints || []).map(cp => cp ? ({ ply: cp.ply, rawStateSha256: cp.rawStateSha256 }) : null)
  })).sort((a,b) => a.slotSeed - b.slotSeed || a.effectiveSeed - b.effectiveSeed);
}
function digestStringSet(values) {
  return sha256Bytes(Buffer.from([...new Set(values)].sort().join("\n") + "\n", "utf8"));
}
function loadG401Artifact(dir, spec, fw) {
  const sourceDir = path.join(dir, "source/GCLD");
  need(fs.existsSync(sourceDir), "missing G4-01 GCLD artifact directory");
  const files = fs.readdirSync(sourceDir).filter(x => x.endsWith(".json")).sort();
  need(files.length === spec.sourceRowCount, "G4-01 source row count mismatch");
  const rows = files.map(name => readJson(path.join(sourceDir, name)));
  const projection = canonicalG401Projection(rows);
  need(digest(projection) === spec.canonicalIdentityProjectionSha256, "G4-01 canonical identity projection digest mismatch");
  const seeds = rows.map(x => String(x.effectiveSeed));
  const trajectories = rows.map(x => x.trajectorySha256).filter(Boolean);
  const roots = rows.flatMap(x => (x.checkpoints || []).filter(Boolean).map(cp => cp.rawStateSha256).filter(Boolean));
  need(new Set(seeds).size === spec.setDigests.sourceSeed.uniqueCount && digestStringSet(seeds) === spec.setDigests.sourceSeed.sha256, "G4-01 seed set digest mismatch");
  need(new Set(trajectories).size === spec.setDigests.fullTrajectorySha256.uniqueCount && digestStringSet(trajectories) === spec.setDigests.fullTrajectorySha256.sha256, "G4-01 trajectory set digest mismatch");
  need(new Set(roots).size === spec.setDigests.rootRawSha256.uniqueCount && digestStringSet(roots) === spec.setDigests.rootRawSha256.sha256, "G4-01 root set digest mismatch");
  for (const x of rows) {
    if (Number.isInteger(x.effectiveSeed)) fw.seeds.add(x.effectiveSeed);
    if (x.trajectorySha256) fw.trajectory.add(x.trajectorySha256);
    for (const cp of x.checkpoints || []) if (cp && cp.rawStateSha256) fw.root.add(cp.rawStateSha256);
  }
  return { source: "G4-01-STAGE1R-GCLD", rowCount: rows.length, projectionSha256: spec.canonicalIdentityProjectionSha256, openingPrefixAudited: false };
}
function materializeFirewall() {
  need(FW_SPEC.status === "FROZEN-PRE-FRESH" && FW_SPEC.scientificOutcomeFieldsRetained === false, "firewall not frozen pre-fresh");
  const fw = emptyFirewall();
  for (const row of FW_SPEC.excludedSeedNamespaces || []) addSeedRange(fw, row.range);
  const audit = [];
  const g310s1 = FW_SPEC.identitySources.g3_10_stage1;
  audit.push(verifyIdentityFile(g310s1.path, g310s1.fileSha256, g310s1.identityRowCount, fw, "G3-10-STAGE1"));
  const g310s2 = FW_SPEC.identitySources.g3_10_stage2;
  audit.push(verifyIdentityFile(g310s2.path, g310s2.fileSha256, g310s2.identityRowCount, fw, "G3-10-STAGE2"));
  const upstreamRoot = process.env.MLGMR_UPSTREAM_DIR || path.join(ROOT, "upstream/mlgmr-stage1");
  audit.push(loadG401Artifact(path.join(upstreamRoot, "g4-01"), FW_SPEC.identitySources.g4_01_stage1r_gcld, fw));
  const g404s1 = FW_SPEC.identitySources.g4_04_stage1;
  audit.push(verifyArtifactIdentityFile(path.join(upstreamRoot, "g4-04-stage1", g404s1.identityFile), g404s1, fw, "G4-04-STAGE1"));
  const g404s2 = FW_SPEC.identitySources.g4_04_stage2;
  audit.push(verifyArtifactIdentityFile(path.join(upstreamRoot, "g4-04-stage2", g404s2.identityFile), g404s2, fw, "G4-04-STAGE2"));
  return {
    sets: fw,
    audit,
    setSizes: { seed: fw.seeds.size, trajectory: fw.trajectory.size, prefix: fw.prefix.size, root: fw.root.size },
    digest: digest({
      seeds: [...fw.seeds].sort((a,b)=>a-b),
      trajectory: [...fw.trajectory].sort(),
      prefix: [...fw.prefix].sort(),
      root: [...fw.root].sort()
    })
  };
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
  if (cps.length !== SPEC.trajectoryContract.checkpointPlies.length) return false;
  if (cps.some(row => row.terminal)) return false;
  return cps[cps.length - 1].ply === SPEC.trajectoryContract.nonterminalThroughPly;
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
function policyForSeed(seed) {
  const offset = seed - SPEC.seedBlock.start;
  return offset % 2 === 0 ? TP.P1 : TP.P2;
}
function firewallCollision(row, fw) {
  if (fw.seeds.has(row.sourceSeed)) return "UPSTREAM-SEED";
  if (fw.trajectory.has(row.sourceTrajectorySha256)) return "UPSTREAM-TRAJECTORY";
  if (fw.prefix.has(row.openingPrefixSha256)) return "UPSTREAM-PREFIX";
  for (const cp of row.checkpointRoots || []) if (fw.root.has(cp.rootRawSha256)) return "UPSTREAM-ROOT";
  return null;
}
function bump(obj, key) { obj[key] = (obj[key] || 0) + 1; }

function scanCandidates(fw) {
  const resource = limits();
  const candidates = { [TP.P1]: [], [TP.P2]: [] };
  const rejections = { [TP.P1]: {}, [TP.P2]: {} };
  const consumedIdentityRows = [];
  let freshScientificSeedReads = 0;
  let firstSeedRead = null;
  let lastSeedRead = null;

  for (let seed = SPEC.seedBlock.start; seed <= SPEC.seedBlock.end; seed++) {
    const policyId = policyForSeed(seed);
    if (candidates[policyId].length >= SPEC.trajectoryContract.candidateTargetPerPolicy) continue;
    if (fw.seeds.has(seed)) { bump(rejections[policyId], "UPSTREAM-SEED"); continue; }

    freshScientificSeedReads++;
    if (firstSeedRead === null) firstSeedRead = seed;
    lastSeedRead = seed;
    let p, i;
    try {
      p = TP.replay(E, policyId, seed, 80);
      i = TI.replay(E, policyId, seed, 80);
    } catch (error) {
      bump(rejections[policyId], String(error && error.message || error).includes("relay-limit") ? "SOURCE-RELAY-LIMIT" : "SOURCE-ERROR");
      continue;
    }
    same(replayIdentity(p), replayIdentity(i), `replay identity mismatch ${policyId} seed=${seed}`);
    const id = identityRow(p);
    consumedIdentityRows.push(id);
    const collision = firewallCollision(id, fw);
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
    candidates[policyId].push({ replay: p, identity: id, preflight });
    if (candidates[TP.P1].length >= SPEC.trajectoryContract.candidateTargetPerPolicy && candidates[TP.P2].length >= SPEC.trajectoryContract.candidateTargetPerPolicy) break;
  }
  for (const policyId of [TP.P1, TP.P2]) {
    need(candidates[policyId].length >= SPEC.trajectoryContract.minimumFullyEligiblePerPolicy, `minimum fully eligible not met ${policyId}`);
  }
  return { candidates, rejections, consumedIdentityRows, freshScientificSeedReads, firstSeedRead, lastSeedRead };
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

function supportClassification(measurements) {
  const gate = SPEC.supportOnlyPromotion;
  need(measurements.length === gate.completeMeasuredTrajectoriesRequired, "complete measured trajectory requirement not met");
  const byPolicy = Object.fromEntries([TP.P1, TP.P2].map(p => [p, measurements.filter(x => x.policyId === p)]));
  for (const p of [TP.P1, TP.P2]) need(byPolicy[p].length === gate.measuredPerPolicy, `measured-per-policy mismatch ${p}`);
  const slots = [];
  for (const axis of MP.AXES) {
    for (const lag of SPEC.lagCheckpointIntervals) {
      const id = MP.slotId(axis, lag);
      const supportByPolicy = {};
      let combined = 0;
      for (const p of [TP.P1, TP.P2]) {
        const count = byPolicy[p].filter(m => m.primary.slots[id].comparableNonzero >= gate.minimumComparableNonzeroPerSupportingTrajectory).length;
        supportByPolicy[p] = count;
        combined += count;
      }
      const supported = combined >= gate.combinedSupportTrajectoriesRequired && [TP.P1, TP.P2].every(p => supportByPolicy[p] >= gate.perPolicySupportTrajectoriesRequired);
      slots.push({
        slotId: id,
        axis,
        lag,
        supportByPolicy,
        combinedSupportTrajectories: combined,
        status: supported ? "SUPPORTED-FOR-FORMAL-HOLDOUT" : "NOT-SUPPORTED-FOR-FORMAL-HOLDOUT",
        effectDirectionUsedForPromotion: false
      });
    }
  }
  return { slots, supportedSlotIds: slots.filter(x => x.status === "SUPPORTED-FOR-FORMAL-HOLDOUT").map(x => x.slotId), formalInferencePerformed: false };
}

function run() {
  const started = Date.now();
  staticGuards();
  verifyImplementationSeparation();

  // Critical ordering: all upstream identity material is verified before the first fresh Stage 1 seed read.
  const firewall = materializeFirewall();
  console.log(`MLGMR_STAGE1_FIREWALL_READY=${firewall.digest}`);

  const scan = scanCandidates(firewall.sets);
  const measured = [];
  for (const policyId of [TP.P1, TP.P2]) {
    const selected = scan.candidates[policyId].slice(0, SPEC.trajectoryContract.measuredPerPolicy);
    need(selected.length === SPEC.trajectoryContract.measuredPerPolicy, `insufficient measured candidates ${policyId}`);
    for (const candidate of selected) measured.push(measureCandidate(candidate));
  }
  const support = supportClassification(measured);
  const elapsedMs = Date.now() - started;
  need(elapsedMs <= SPEC.resourceCeilings.stageElapsedMs, "Stage 1 elapsed ceiling exceeded");
  need(process.memoryUsage().rss <= SPEC.resourceCeilings.stagePeakRssBytes, "Stage 1 RSS ceiling exceeded");

  const result = {
    schemaVersion: 1,
    studyId: STUDY.studyId,
    stageId: SPEC.stageId,
    evidenceClass: SPEC.evidenceClass,
    disposition: "STAGE1-DEVELOPMENT-COMPLETE",
    formalInferencePerformed: false,
    scientificOutcomeClass: "DEVELOPMENT-SUPPORT-ONLY",
    freshScientificSeedReads: scan.freshScientificSeedReads,
    firstSeedRead: scan.firstSeedRead,
    lastSeedRead: scan.lastSeedRead,
    stage2SeedReads: 0,
    g4_10Depth11AccessCount: 0,
    publicAiChange: false,
    mainIntegration: false,
    firewall: { digest: firewall.digest, setSizes: firewall.setSizes, audit: firewall.audit },
    candidateCounts: { [TP.P1]: scan.candidates[TP.P1].length, [TP.P2]: scan.candidates[TP.P2].length },
    rejectionCounts: scan.rejections,
    measuredCount: measured.length,
    measuredPerPolicy: { [TP.P1]: measured.filter(x => x.policyId === TP.P1).length, [TP.P2]: measured.filter(x => x.policyId === TP.P2).length },
    measurements: measured,
    supportOnlyPromotion: support,
    productionIndependentExact: measured.every(x => x.productionIndependentExact === true),
    resourceObservation: { elapsedMs, rssBytes: process.memoryUsage().rss, stageElapsedCeilingMs: SPEC.resourceCeilings.stageElapsedMs, stagePeakRssBytes: SPEC.resourceCeilings.stagePeakRssBytes }
  };
  need(result.productionIndependentExact, "production/independent exact agreement failed");

  const identityExclusion = {
    schemaVersion: 1,
    studyId: STUDY.studyId,
    sourceStageId: SPEC.stageId,
    scientificOutcomeFieldsRetained: false,
    consumedSeedNamespace: { start: SPEC.seedBlock.start, end: SPEC.seedBlock.end },
    freshScientificSeedReads: scan.freshScientificSeedReads,
    identityRowCount: scan.consumedIdentityRows.length,
    identityRows: scan.consumedIdentityRows
  };

  const out = outputDir();
  const resultMeta = writeJson(path.join(out, "STAGE_1_RESULT.json"), result);
  const identityMeta = writeJson(path.join(out, "STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json"), identityExclusion);
  need(resultMeta.bytes <= SPEC.resourceCeilings.resultArtifactBytes, "Stage 1 result artifact ceiling exceeded");
  console.log(`MLGMR_STAGE1_DISPOSITION=${result.disposition}`);
  console.log(`MLGMR_STAGE1_FRESH_SEED_READS=${result.freshScientificSeedReads}`);
  console.log(`MLGMR_STAGE1_RESULT_SHA256=${resultMeta.sha256}`);
  console.log(`MLGMR_STAGE1_IDENTITY_SHA256=${identityMeta.sha256}`);
}

try {
  run();
} catch (error) {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
}
