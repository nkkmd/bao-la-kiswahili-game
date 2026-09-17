#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const P = require("./lib/lgttci-compatibility-production.js");
const I = require("./lib/lgttci-compatibility-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY_SPEC_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/STUDY_1_SPEC.json");
const STAGE_SPEC_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/STAGE_1_COMPATIBILITY_SPEC.json");
const CLARIFICATION_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/STAGE_1_PRE_ACCESS_CLARIFICATION_V1.json");
const AUTH_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/authorizations/STAGE_1_AUTHORIZATION.json");
const BINDING_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/authorizations/STAGE_1_EXECUTION_BINDING.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/lgttci-stage1/result.json");

class ResourceCutoff extends Error {
  constructor(message) { super(message); this.name = "ResourceCutoff"; }
}

function need(x, message) { if (!x) throw new Error(message); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function sha256Text(text) { return crypto.createHash("sha256").update(text, "utf8").digest("hex"); }
function sha256(value) { return sha256Text(typeof value === "string" ? value : P.stable(value)); }
function gitBlobShaBuffer(buffer) {
  const header = Buffer.from(`blob ${buffer.length}\0`, "utf8");
  return crypto.createHash("sha1").update(header).update(buffer).digest("hex");
}
function gitBlobShaFile(file) { return gitBlobShaBuffer(fs.readFileSync(file)); }
function exact(a, b, label) { need(P.stable(a) === I.stable(b), `${label} production/independent mismatch`); }
function policyForSeed(seed) { return seed % 2 === 1 ? P.P1 : P.P2; }
function hashByte(label, seed) { return Number.parseInt(sha256Text(`${label}${seed}`).slice(0, 2), 16); }
function familyForSeed(seed) { return hashByte("LGTTCI-S1-SILGM-RF|", seed) % 2 === 0 ? P.RF1 : P.RF2; }
function phaseForSeed(seed) { return hashByte("LGTTCI-S1-SILGM-PHASE|", seed) % 2 === 0 ? "namua" : "mtaji"; }
function stateAtPly(rows, ply) { return rows.find(row => row.ply === ply && !row.terminal) || null; }
function stripState(row) {
  if (!row) return null;
  return { ply: row.ply, phase: row.phase, rootLegalWidth: row.rootLegalWidth, rawStateSha256: row.rawStateSha256 };
}
function countReason(map, key) { map[key] = (map[key] || 0) + 1; }

function main(outFile) {
  const started = Date.now();
  let peakRssBytes = process.memoryUsage().rss;
  const seedReads = { SFCDF: 0, SILGM: 0, GCLD: 0 };
  const readKeys = new Set();
  const updatePeak = () => { peakRssBytes = Math.max(peakRssBytes, process.memoryUsage().rss); };

  const study = readJson(STUDY_SPEC_PATH);
  const spec = readJson(STAGE_SPEC_PATH);
  const clarification = readJson(CLARIFICATION_PATH);
  const auth = readJson(AUTH_PATH);
  const binding = readJson(BINDING_PATH);
  const limits = spec.activePerRootPreflightLimits;
  const ceiling = spec.executionCeilings;

  function resourceCheck() {
    updatePeak();
    if (Date.now() - started > ceiling.elapsedMs) throw new ResourceCutoff("elapsedMs ceiling exceeded");
    if (peakRssBytes > ceiling.peakRssBytes) throw new ResourceCutoff("peakRssBytes ceiling exceeded");
  }
  function markRead(block, seed) {
    const key = `${block}:${seed}`;
    need(!readKeys.has(key), `duplicate fresh seed read ${key}`);
    readKeys.add(key);
    seedReads[block] += 1;
    need(seedReads.SFCDF + seedReads.SILGM + seedReads.GCLD <= auth.maxTotalSeedReads, "maxTotalSeedReads exceeded");
  }
  function replayExact(block, seed) {
    markRead(block, seed);
    const policyId = policyForSeed(seed);
    const a = P.replay(E, policyId, seed, ceiling.maxSourcePliesPerTrajectory);
    const b = I.replay(E, policyId, seed, ceiling.maxSourcePliesPerTrajectory);
    exact(a, b, `${block} replay seed=${seed}`);
    resourceCheck();
    return a;
  }
  function preflightExact(row, seed, label) {
    const a = P.preflightContinuous(E, row.state, seed, row.ply, limits);
    const b = I.preflightContinuous(E, row.state, seed, row.ply, limits);
    exact(a, b, `${label} preflight seed=${seed} ply=${row.ply}`);
    resourceCheck();
    return a;
  }

  let result;
  try {
    need(study.studyId === "LGTTCI-STUDY1", "Study identity mismatch");
    need(spec.stageId === "LGTTCI-S1-COMPATIBILITY-2026-09-17-v1", "Stage spec identity mismatch");
    need(auth.decision === "LGTTCI-STAGE1-AUTHORIZED", "Stage 1 not authorized");
    need(auth.stage1SpecGitBlobSha === gitBlobShaFile(STAGE_SPEC_PATH), "Stage 1 spec blob mismatch");
    need(clarification.freshCompatibilitySeedAccessBeforeClarification === 0, "clarification not pre-access");
    need(spec.scientificEffectAuthorized === false && auth.scientificEffectAuthorized === false, "scientific effect unexpectedly authorized");
    need(auth.githubActionsFreshCompatibilityExecutionAuthorized === false, "fresh compatibility execution route mismatch");

    const bindingFiles = binding.files;
    for (const [relative, expected] of Object.entries(bindingFiles)) {
      need(gitBlobShaFile(path.join(ROOT, relative)) === expected, `execution binding mismatch ${relative}`);
    }
    for (const source of Object.values(study.sourceIdentity)) {
      need(gitBlobShaFile(path.join(ROOT, source.path)) === source.gitBlobSha, `frozen source mismatch ${source.path}`);
    }

    const conditions = study.searchCompatibilityContract.conditions;
    const thresholds = study.searchCompatibilityContract.phaseThresholdsInheritedOnlyForSupportClassification;
    const families = [P.RF1, P.RF2];

    // SFCDF compatibility: replay all reserved seeds, then select the first eight
    // preflight-eligible pairs in the frozen hash order for each policy x family cell.
    const sfcdfCandidates = new Map();
    const sfcdfRejects = {};
    for (const policy of [P.P1, P.P2]) for (const family of families) sfcdfCandidates.set(`${policy}|${family}`, []);
    for (let seed = spec.seedAccessContract.blocks.SFCDF.seedStart; seed <= spec.seedAccessContract.blocks.SFCDF.seedEnd; seed += 1) {
      const replay = replayExact("SFCDF", seed);
      for (const familyId of families) {
        const pa = P.selectAnchors(replay.rows, familyId);
        const ia = I.selectAnchors(replay.rows, familyId);
        exact(pa, ia, `SFCDF anchors seed=${seed} family=${familyId}`);
        if (!pa.complete) { countReason(sfcdfRejects, `${replay.policyId}|${familyId}|ROOT-PAIR-UNAVAILABLE`); continue; }
        const selectionKey = sha256Text(`LGTTCI-S1-SFCDF|${replay.policyId}|${familyId}|${seed}|${pa.namua.rawStateSha256}|${pa.mtaji.rawStateSha256}`);
        sfcdfCandidates.get(`${replay.policyId}|${familyId}`).push({ seed, policyId: replay.policyId, familyId, selectionKey, namua: pa.namua, mtaji: pa.mtaji });
      }
    }

    const sfcdfCells = {};
    let sfcdfCompatible = true;
    for (const [cell, rows] of sfcdfCandidates.entries()) {
      rows.sort((a, b) => a.selectionKey.localeCompare(b.selectionKey));
      const selected = [];
      let scanned = 0;
      for (const candidate of rows) {
        if (selected.length >= spec.sfcdfCompatibility.selectedCountPerCell) break;
        scanned += 1;
        const n = preflightExact(candidate.namua, candidate.seed, `SFCDF ${cell} namua`);
        const m = preflightExact(candidate.mtaji, candidate.seed, `SFCDF ${cell} mtaji`);
        if (!n.eligible || !m.eligible) {
          countReason(sfcdfRejects, `${cell}|PREFLIGHT-${!n.eligible ? n.reasonCode : m.reasonCode}`);
          continue;
        }
        selected.push(candidate);
      }
      if (selected.length < spec.sfcdfCompatibility.minimumCompletePairsPerCell) sfcdfCompatible = false;
      const measured = [];
      for (const candidate of selected) {
        const rootRows = [candidate.namua, candidate.mtaji];
        const digests = [];
        for (const root of rootRows) {
          const a = P.measureRaw(E, root.state, candidate.seed, root.ply);
          const b = I.measureRaw(E, root.state, candidate.seed, root.ply);
          exact(a, b, `SFCDF RAW measurement seed=${candidate.seed} ply=${root.ply}`);
          digests.push(sha256(a));
          resourceCheck();
        }
        measured.push({ seed: candidate.seed, selectionKey: candidate.selectionKey, namua: stripState(candidate.namua), mtaji: stripState(candidate.mtaji), measurementDigests: digests });
      }
      sfcdfCells[cell] = { candidatesBeforePreflight: rows.length, scannedForMinimum: scanned, selectedCount: selected.length, selected: measured };
    }

    // SILGM compatibility: one deterministically assigned root per seed. Width 1 is
    // classified without helper access. LOW/HIGH cells select four roots by frozen hash.
    const silgmCandidates = new Map();
    const silgmSupport = {};
    const silgmRejects = {};
    for (const policy of [P.P1, P.P2]) for (const family of families) for (const phase of ["namua", "mtaji"]) for (const cls of ["LOW-RANKABLE", "HIGH"]) silgmCandidates.set(`${policy}|${family}|${phase}|${cls}`, []);
    for (let seed = spec.seedAccessContract.blocks.SILGM.seedStart; seed <= spec.seedAccessContract.blocks.SILGM.seedEnd; seed += 1) {
      const replay = replayExact("SILGM", seed);
      const familyId = familyForSeed(seed);
      const phase = phaseForSeed(seed);
      const pa = P.selectAnchors(replay.rows, familyId);
      const ia = I.selectAnchors(replay.rows, familyId);
      exact(pa, ia, `SILGM anchors seed=${seed}`);
      const root = phase === "namua" ? pa.namua : pa.mtaji;
      if (!root) { countReason(silgmRejects, `${replay.policyId}|${familyId}|${phase}|ROOT-UNAVAILABLE`); continue; }
      const width = root.rootLegalWidth;
      let cls;
      if (width === 1) cls = "SINGLETON";
      else if (width < thresholds[phase]) cls = "LOW-RANKABLE";
      else if (width === thresholds[phase]) cls = "EQUAL";
      else cls = "HIGH";
      const supportKey = `${replay.policyId}|${familyId}|${phase}|${cls}`;
      silgmSupport[supportKey] = (silgmSupport[supportKey] || 0) + 1;
      if (cls === "SINGLETON") {
        const a = P.classifySearch(E, root.state, conditions[0]);
        const b = I.classifySearch(E, root.state, conditions[0]);
        exact(a, b, `SILGM singleton classification seed=${seed}`);
        need(a.estimable === false && a.helperCalled === false && a.reasonCode === "ROOT-LEGAL-WIDTH-LT2", "singleton guard failed");
        continue;
      }
      if (cls === "EQUAL") continue;
      const selectionKey = sha256Text(`LGTTCI-S1-SILGM|${replay.policyId}|${familyId}|${phase}|${cls}|${seed}|${root.rawStateSha256}`);
      silgmCandidates.get(supportKey).push({ seed, policyId: replay.policyId, familyId, phase, widthClass: cls, selectionKey, root });
    }

    let silgmCompatible = true;
    const silgmCells = {};
    for (const [cell, rows] of silgmCandidates.entries()) {
      rows.sort((a, b) => a.selectionKey.localeCompare(b.selectionKey));
      if (rows.length < spec.silgmCompatibility.minimumPerCell) silgmCompatible = false;
      const selected = rows.slice(0, spec.silgmCompatibility.selectedCountPerCell);
      const measured = [];
      for (const candidate of selected) {
        const conditionRows = [];
        for (const condition of conditions) {
          const a = P.classifySearch(E, candidate.root.state, condition);
          const b = I.classifySearch(E, candidate.root.state, condition);
          exact(a, b, `SILGM search seed=${candidate.seed} condition=${condition.id}`);
          if (!a.estimable) silgmCompatible = false;
          conditionRows.push({ conditionId: condition.id, estimable: a.estimable, reasonCode: a.reasonCode, completedDepth: a.completedDepth ?? null, digest: sha256(a) });
          resourceCheck();
        }
        measured.push({ seed: candidate.seed, selectionKey: candidate.selectionKey, root: stripState(candidate.root), conditions: conditionRows });
      }
      silgmCells[cell] = { supportCount: rows.length, selectedCount: selected.length, selected: measured };
    }

    // GCLD compatibility: replay all reserved seeds, sort trajectories before preflight,
    // then take the first twelve eligible trajectories per policy.
    const gcldCandidates = new Map([[P.P1, []], [P.P2, []]]);
    const gcldRejects = {};
    for (let seed = spec.seedAccessContract.blocks.GCLD.seedStart; seed <= spec.seedAccessContract.blocks.GCLD.seedEnd; seed += 1) {
      const replay = replayExact("GCLD", seed);
      const selectionKey = sha256Text(`LGTTCI-S1-GCLD|${replay.policyId}|${seed}|${replay.trajectorySha256}`);
      gcldCandidates.get(replay.policyId).push({ seed, policyId: replay.policyId, selectionKey, replay });
    }

    let gcldCompatible = true;
    const gcldPolicies = {};
    for (const [policyId, candidates] of gcldCandidates.entries()) {
      candidates.sort((a, b) => a.selectionKey.localeCompare(b.selectionKey));
      const selected = [];
      let scanned = 0;
      for (const candidate of candidates) {
        if (selected.length >= spec.gcldCompatibility.selectedCountPerPolicy) break;
        scanned += 1;
        const eligibleCheckpoints = [];
        for (const ply of spec.gcldCompatibility.checkpoints) {
          const row = stateAtPly(candidate.replay.rows, ply);
          if (!row) continue;
          const pf = preflightExact(row, candidate.seed, `GCLD ${policyId}`);
          if (pf.eligible) eligibleCheckpoints.push(row);
          else countReason(gcldRejects, `${policyId}|${pf.reasonCode}`);
        }
        const phases = new Set(eligibleCheckpoints.map(row => row.phase));
        if (eligibleCheckpoints.length < 4 || !phases.has("namua") || !phases.has("mtaji")) {
          countReason(gcldRejects, `${policyId}|TRAJECTORY-NOT-ELIGIBLE`);
          continue;
        }
        selected.push({ ...candidate, eligibleCheckpoints });
      }
      if (selected.length < spec.gcldCompatibility.minimumTrajectoriesPerPolicy) gcldCompatible = false;
      const measured = [];
      for (const candidate of selected) {
        const checkpoints = [];
        for (const row of candidate.eligibleCheckpoints) {
          const a = P.measureContinuous(E, row.state, candidate.seed, row.ply);
          const b = I.measureContinuous(E, row.state, candidate.seed, row.ply);
          exact(a, b, `GCLD continuous measurement seed=${candidate.seed} ply=${row.ply}`);
          checkpoints.push({ root: stripState(row), measurementDigest: sha256(a) });
          resourceCheck();
        }
        measured.push({ seed: candidate.seed, selectionKey: candidate.selectionKey, trajectorySha256: candidate.replay.trajectorySha256, checkpoints });
      }
      gcldPolicies[policyId] = { candidatesBeforePreflight: candidates.length, scannedForMinimum: scanned, selectedCount: selected.length, selected: measured };
    }

    need(seedReads.SFCDF === spec.seedAccessContract.blocks.SFCDF.count, "SFCDF seed read count mismatch");
    need(seedReads.SILGM === spec.seedAccessContract.blocks.SILGM.count, "SILGM seed read count mismatch");
    need(seedReads.GCLD === spec.seedAccessContract.blocks.GCLD.count, "GCLD seed read count mismatch");
    need(readKeys.size === spec.seedAccessContract.maxTotalSeedReads, "total fresh seed read count mismatch");

    const familyStatus = {
      SFCDF: sfcdfCompatible ? "COMPATIBLE" : "NON-ESTIMABLE",
      SILGM: silgmCompatible ? "COMPATIBLE" : "NON-ESTIMABLE",
      GCLD: gcldCompatible ? "COMPATIBLE" : "NON-ESTIMABLE"
    };
    const compatibleCount = Object.values(familyStatus).filter(x => x === "COMPATIBLE").length;
    const stageDisposition = compatibleCount === 3 ? "COMPATIBILITY-ELIGIBLE-ALL" : compatibleCount > 0 ? "COMPATIBILITY-ELIGIBLE-PARTIAL" : "NON-ESTIMABLE";

    const deterministicCore = {
      schemaVersion: 1,
      studyId: study.studyId,
      stageId: spec.stageId,
      evidenceClass: spec.evidenceClass,
      authorizationDecision: auth.decision,
      seedReads,
      familyStatus,
      stageDisposition,
      SFCDF: { cells: sfcdfCells, rejectionCounts: sfcdfRejects },
      SILGM: { cells: silgmCells, supportCounts: silgmSupport, rejectionCounts: silgmRejects },
      GCLD: { policies: gcldPolicies, rejectionCounts: gcldRejects },
      protectedEvidence: {
        g3_11Depth10Rerun: false,
        g3_12Stage1Replay: false,
        g3_12Stage2Access: false,
        g3_12PartialMeasurementReuse: false,
        g4_10Depth11Access: false,
        formalEffectComputation: false,
        publicAiChange: false
      }
    };
    const deterministicCoreSha256 = sha256(deterministicCore);
    updatePeak();
    result = {
      ...deterministicCore,
      deterministicCoreSha256,
      telemetry: {
        elapsedMs: Date.now() - started,
        peakRssBytes,
        resultArtifactBytes: null
      },
      executionCeilings: ceiling
    };
    let text = JSON.stringify(result, null, 2) + "\n";
    result.telemetry.resultArtifactBytes = Buffer.byteLength(text);
    if (result.telemetry.elapsedMs > ceiling.elapsedMs || result.telemetry.peakRssBytes > ceiling.peakRssBytes || result.telemetry.resultArtifactBytes > ceiling.resultArtifactBytes) {
      result.stageDisposition = "NON-ESTIMABLE";
      result.resourceCutoff = true;
    }
    text = JSON.stringify(result, null, 2) + "\n";
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, text);
    console.log(`LGTTCI_STAGE1=${JSON.stringify({stageDisposition:result.stageDisposition,familyStatus:result.familyStatus,seedReads:result.seedReads,deterministicCoreSha256:result.deterministicCoreSha256,elapsedMs:result.telemetry.elapsedMs,peakRssBytes:result.telemetry.peakRssBytes,resultArtifactBytes:result.telemetry.resultArtifactBytes})}`);
    if (result.stageDisposition === "TECHNICAL-INVALID") process.exitCode = 1;
  } catch (error) {
    updatePeak();
    const resource = error instanceof ResourceCutoff;
    result = {
      schemaVersion: 1,
      studyId: "LGTTCI-STUDY1",
      stageId: "LGTTCI-S1-COMPATIBILITY-2026-09-17-v1",
      evidenceClass: "FRESH-COMPATIBILITY",
      stageDisposition: resource ? "NON-ESTIMABLE" : "TECHNICAL-INVALID",
      resourceCutoff: resource,
      error: { name: error.name, message: error.message, stack: error.stack },
      seedReads,
      totalFreshSeedReads: readKeys.size,
      protectedEvidence: {
        g3_11Depth10Rerun: false,
        g3_12Stage1Replay: false,
        g3_12Stage2Access: false,
        g3_12PartialMeasurementReuse: false,
        g4_10Depth11Access: false,
        formalEffectComputation: false,
        publicAiChange: false
      },
      telemetry: { elapsedMs: Date.now() - started, peakRssBytes }
    };
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2) + "\n");
    console.error(error.stack || error);
    process.exitCode = resource ? 2 : 1;
  }
}

main(path.resolve(process.argv[2] || DEFAULT_OUTPUT));
