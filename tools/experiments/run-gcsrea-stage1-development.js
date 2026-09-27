#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const SrcP = require("./lib/lgttci-compatibility-production.js");
const SrcI = require("./lib/lgttci-compatibility-independent.js");
const SearchP = require("./lib/silgm-production.js");
const SearchI = require("./lib/silgm-independent.js");
const LgtP = require("./lib/lgtgmiv-stage1-production.js");
const LgtI = require("./lib/lgtgmiv-stage1-independent.js");
const DevP = require("./lib/gcsrea-stage1-production.js");
const DevI = require("./lib/gcsrea-stage1-independent.js");
const FW = require("./lib/gcsrea-stage1-firewall.js");

const ROOT = path.resolve(__dirname, "../..");
const BASE = path.join(ROOT, "doc/geometry-conditioned-search-reliability-exact-agreement");
const SPEC_PATH = path.join(BASE, "prereg/STAGE_1_DEVELOPMENT_SPEC.json");
const FIREWALL_PATH = path.join(BASE, "prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const AUTH_PATH = path.join(BASE, "authorizations/STAGE_1_AUTHORIZATION.json");
const STAGE_ID = "GCSREA-S1-DEVELOPMENT-2026-09-27-v1";

function need(value, message) { if (!value) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function sha(text) { return crypto.createHash("sha256").update(String(text), "utf8").digest("hex"); }
function stable(value) { return DevP.stable(value); }
function write(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function args() {
  const out = {};
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 1) if (a[i].startsWith("--")) {
    const key = a[i].slice(2);
    out[key] = a[i + 1] && !a[i + 1].startsWith("--") ? a[++i] : true;
  }
  return out;
}
function eq(a, b, message) { need(DevP.stable(a) === DevI.stable(b), message); }
function sourceDescriptor(candidate) {
  return {
    phase: candidate.phase,
    sourceSeed: candidate.sourceSeed,
    selectedPly: candidate.selectedPly,
    rootRawSha256: candidate.rootRawSha256,
    sourceTrajectorySha256: candidate.fullTrajectorySha256,
    openingPrefixSha256: candidate.openingPrefixSha256,
    openingPrefixLength: Math.min(16, candidate.moveCount),
    rootState: clone(candidate.rootState),
  };
}
function reconstructionResource(core) {
  const distinct = Number(core.cumulative.distinctRawStates);
  const transitions = Number(core.cumulative.uniqueGlobalTransitions);
  let tree = 0n;
  for (const layer of core.layers || []) tree += BigInt(layer.treeNodeOccurrences);
  return { distinctRawStates: distinct, uniqueTransitions: transitions, treeOccurrences: tree.toString() };
}
function identityRow(policyId, seed, replay, prefix) {
  return {
    policyId,
    sourceSeed: seed,
    sourceTrajectorySha256: replay.trajectorySha256,
    openingPrefixSha256: prefix,
    moveCount: replay.moveKeys.length,
    reachableRoots: [
      { ply: 0, rootRawSha256: SrcP.stateKey(E.initialState()) },
      ...replay.rows.map((row) => ({ ply: row.ply, rootRawSha256: row.rawStateSha256 })),
    ],
  };
}
function cellKey(row) { return `${row.policyId}|${row.rootFamilyId}|${row.phase}`; }
function contrastMap(spec) { return new Map(spec.search.contrasts.map((row) => [row.id, row])); }
function configMap(spec) { return new Map(spec.search.configurations.map((row) => [row.id, row])); }
function allCellKeys(spec) {
  const out = [];
  for (const policyId of spec.moduleA.policies) for (const rootFamilyId of spec.moduleA.rootFamilies) for (const phase of spec.moduleA.phases) out.push(`${policyId}|${rootFamilyId}|${phase}`);
  return out.sort();
}
function exactIdentityRows(rows) {
  return rows.map((row) => ({
    sourceSeed: row.sourceSeed,
    policyId: row.policyId,
    rootFamilyId: row.rootFamilyId,
    phase: row.phase,
    selectedPly: row.selectedPly,
    fullTrajectorySha256: row.fullTrajectorySha256,
    openingPrefixSha256: row.openingPrefixSha256,
    rootRawSha256: row.rootRawSha256,
    selectionRank: row.selectionRank,
  }));
}

function main() {
  const a = args();
  const spec = readJson(SPEC_PATH);
  const firewall = readJson(FIREWALL_PATH);
  need(spec.studyId === "GCSREA-STUDY1" && spec.stageId === STAGE_ID, "frozen Stage1 spec mismatch");
  need(spec.formalInferenceAuthorized === false, "formal inference unexpectedly authorized");
  need(spec.moduleA.seedBlock.start === 40913001 && spec.moduleA.seedBlock.end === 40913768 && spec.moduleA.seedBlock.count === 768, "seed block mismatch");
  need(spec.moduleB.actualSearchVsExactMeasurementAuthorized === false, "fixed-8 search-vs-exact measurement unexpectedly authorized");
  const upstreamRoot = path.resolve(String(a["upstream-root"] || ""));
  need(upstreamRoot && fs.existsSync(upstreamRoot), "--upstream-root required");
  const fw = FW.materialize({ repoRoot: ROOT, upstreamRoot, firewall });
  if (a["dry-run-firewall-only"] === true) {
    console.log(JSON.stringify({ disposition: "STAGE1-FIREWALL-PASS", freshScientificSeedReads: 0, summary: fw.summary }, null, 2));
    return;
  }

  need(a["execute-authorized-once"] === true, "--execute-authorized-once required");
  const auth = readJson(AUTH_PATH);
  need(auth.studyId === spec.studyId && auth.stageId === spec.stageId, "Stage1 authorization identity mismatch");
  need(auth.decision === "GCSREA-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE", "Stage1 fresh execution not authorized");
  need(auth.authorizedScientificExecutions === 1 && auth.rerunAfterFreshAccessAuthorized === false, "one-shot authorization mismatch");
  need(auth.seedBlock.start === spec.moduleA.seedBlock.start && auth.seedBlock.end === spec.moduleA.seedBlock.end && auth.seedBlock.count === 768, "authorization seed block mismatch");
  need(auth.actualG405SearchVsExactMeasurementAuthorized === false, "authorization unexpectedly permits fixed-8 search measurement");
  need(auth.g410Depth11AccessAuthorized === false && auth.publicAiChangeAuthorized === false, "protected boundary authorization mismatch");

  const outDir = path.resolve(String(a["output-dir"] || path.join(ROOT, "artifacts/local/gcsrea-stage1")));
  const leasePath = path.resolve(String(a.lease || path.join(outDir, "FRESH_ACCESS_LEASE.json")));
  fs.mkdirSync(outDir, { recursive: true });
  const fd = fs.openSync(leasePath, "wx");
  fs.writeFileSync(fd, `${JSON.stringify({ schemaVersion: 1, studyId: spec.studyId, stageId: spec.stageId, seedBlock: spec.moduleA.seedBlock, acquiredBeforeFirstFreshRead: true, acquiredAt: new Date().toISOString() })}\n`);
  fs.closeSync(fd);

  let freshSeedsRead = 0;
  const t0 = process.hrtime.bigint();
  const identityRows = [];
  const candidates = [];
  const reject = { UPSTREAM_TRAJECTORY: 0, UPSTREAM_PREFIX: 0, UPSTREAM_ROOT: 0, ANCHOR_UNAVAILABLE: 0 };
  const cells = Object.fromEntries(allCellKeys(spec).map((key) => [key, { eligiblePool: 0, provisionalSelected: 0, selectedAfterRawDedup: 0, target: spec.moduleA.targetPerPolicyRootFamilyPhaseCell }]));

  try {
    for (let seed = spec.moduleA.seedBlock.start; seed <= spec.moduleA.seedBlock.end; seed += 1) {
      need(!fw.sets.seed.has(String(seed)), `fresh seed collides quarantined namespace ${seed}`);
      const ap = DevP.assign(seed), ai = DevI.assign(seed);
      eq(ap, ai, `assignment mismatch seed ${seed}`);
      freshSeedsRead += 1;
      const rp = SrcP.replay(E, ap.policyId, seed, spec.moduleA.maxSourcePly);
      const ri = SrcI.replay(E, ai.policyId, seed, spec.moduleA.maxSourcePly);
      eq(rp, ri, `source replay mismatch seed ${seed}`);
      const prefix = sha(rp.moveKeys.slice(0, 16).join("\n"));
      identityRows.push(identityRow(ap.policyId, seed, rp, prefix));
      if (fw.sets.trajectory.has(rp.trajectorySha256)) { reject.UPSTREAM_TRAJECTORY += 1; continue; }
      if (fw.sets.prefix.has(prefix)) { reject.UPSTREAM_PREFIX += 1; continue; }
      const anchorsP = SrcP.selectAnchors(rp.rows, ap.rootFamilyId);
      const anchorsI = SrcI.selectAnchors(ri.rows, ai.rootFamilyId);
      eq(anchorsP, anchorsI, `anchor mismatch seed ${seed}`);
      const root = ap.phase === "namua" ? anchorsP.namua : anchorsP.mtaji;
      if (!root) { reject.ANCHOR_UNAVAILABLE += 1; continue; }
      if (fw.sets.root.has(root.rawStateSha256)) { reject.UPSTREAM_ROOT += 1; continue; }
      const candidate = {
        sourceSeed: seed,
        policyId: ap.policyId,
        rootFamilyId: ap.rootFamilyId,
        phase: ap.phase,
        selectedPly: root.ply,
        rootLegalWidth: root.rootLegalWidth,
        fullTrajectorySha256: rp.trajectorySha256,
        openingPrefixSha256: prefix,
        rootRawSha256: root.rawStateSha256,
        moveCount: rp.moveKeys.length,
        rootState: clone(root.state),
      };
      candidate.selectionRank = DevP.selectionRank(candidate);
      need(candidate.selectionRank === DevI.selectionRank(candidate), `selection-rank mismatch seed ${seed}`);
      candidates.push(candidate);
      cells[cellKey(candidate)].eligiblePool += 1;
    }

    need(freshSeedsRead === 768, `fresh seed read count mismatch ${freshSeedsRead}`);
    const identityArtifact = {
      schemaVersion: 1,
      studyId: spec.studyId,
      stageId: spec.stageId,
      role: "STAGE1-IDENTITY-EXCLUSION-FOR-STAGE2",
      scientificOutcomeFieldsRetained: false,
      identityRows,
    };
    identityArtifact.identityRowsSha256 = DevP.sha(stable(identityRows));
    write(path.join(outDir, "STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json"), identityArtifact);

    const provisional = [];
    for (const key of allCellKeys(spec)) {
      const pool = candidates.filter((row) => cellKey(row) === key).sort((a, b) => a.selectionRank.localeCompare(b.selectionRank) || a.sourceSeed - b.sourceSeed);
      const take = pool.slice(0, spec.moduleA.targetPerPolicyRootFamilyPhaseCell);
      cells[key].provisionalSelected = take.length;
      provisional.push(...take);
    }
    const byRaw = new Map();
    for (const row of provisional) {
      const old = byRaw.get(row.rootRawSha256);
      if (!old || row.selectionRank.localeCompare(old.selectionRank) < 0) byRaw.set(row.rootRawSha256, row);
    }
    const selected = [...byRaw.values()].sort((a, b) => cellKey(a).localeCompare(cellKey(b)) || a.selectionRank.localeCompare(b.selectionRank) || a.sourceSeed - b.sourceSeed);
    for (const row of selected) cells[cellKey(row)].selectedAfterRawDedup += 1;
    const allEightCellsRepresented = Object.values(cells).every((row) => row.selectedAfterRawDedup > 0);

    const geometryRows = [];
    const searchDefinedness = Object.fromEntries(spec.search.contrasts.map((row) => [row.id, 0]));
    const configDefinedness = Object.fromEntries(spec.search.configurations.map((row) => [row.id, 0]));
    const configById = configMap(spec);
    const contrastById = contrastMap(spec);
    let searchConditionMeasurements = 0;
    let maxGeometryElapsedMs = 0;
    let maxDistinctRawStates = 0, maxUniqueTransitions = 0;
    let maxTreeOccurrences = 0n;

    for (const candidate of selected) {
      const src = sourceDescriptor(candidate);
      const rt0 = process.hrtime.bigint();
      const mp = LgtP.measureRoot(E, src, spec.geometry.relativeDepth);
      const mi = LgtI.measureRoot(E, src, spec.geometry.relativeDepth);
      const gp = SearchP.deriveGeometry(mp), gi = SearchI.deriveGeometry(mi);
      eq(gp, gi, `geometry production/independent mismatch seed ${candidate.sourceSeed}`);
      need(gp.rootRawSha256 === candidate.rootRawSha256, `geometry root identity mismatch seed ${candidate.sourceSeed}`);
      const elapsed = Number(process.hrtime.bigint() - rt0) / 1e6;
      maxGeometryElapsedMs = Math.max(maxGeometryElapsedMs, elapsed);
      const resource = reconstructionResource(mp.reconstructionCore);
      maxDistinctRawStates = Math.max(maxDistinctRawStates, resource.distinctRawStates);
      maxUniqueTransitions = Math.max(maxUniqueTransitions, resource.uniqueTransitions);
      maxTreeOccurrences = maxTreeOccurrences > BigInt(resource.treeOccurrences) ? maxTreeOccurrences : BigInt(resource.treeOccurrences);
      need(elapsed <= spec.resourceCeiling.perGeometryRootElapsedMs, `per-root geometry elapsed ceiling exceeded seed ${candidate.sourceSeed}`);
      need(resource.distinctRawStates <= spec.resourceCeiling.perGeometryRootDistinctRawStates, `distinct RAW ceiling exceeded seed ${candidate.sourceSeed}`);
      need(resource.uniqueTransitions <= spec.resourceCeiling.perGeometryRootUniqueTransitions, `transition ceiling exceeded seed ${candidate.sourceSeed}`);
      need(BigInt(resource.treeOccurrences) <= BigInt(spec.resourceCeiling.perGeometryRootTreeOccurrence), `tree occurrence ceiling exceeded seed ${candidate.sourceSeed}`);
      geometryRows.push({ phase: candidate.phase, geometry: gp.metrics });

      if (candidate.rootLegalWidth < 2) continue;
      const conditionResultsP = new Map(), conditionResultsI = new Map();
      for (const condition of spec.search.configurations) {
        const p = SearchP.conditionResult(candidate.rootState, condition);
        const i = SearchI.conditionResult(candidate.rootState, condition);
        eq(p, i, `search condition mismatch ${candidate.sourceSeed}/${condition.id}`);
        conditionResultsP.set(condition.id, p);
        conditionResultsI.set(condition.id, i);
        searchConditionMeasurements += 1;
        if (p.estimable) configDefinedness[condition.id] += 1;
      }
      for (const contrast of spec.search.contrasts) {
        const pa = conditionResultsP.get(contrast.a), pb = conditionResultsP.get(contrast.b);
        const ia = conditionResultsI.get(contrast.a), ib = conditionResultsI.get(contrast.b);
        if (!(pa?.estimable && pb?.estimable && ia?.estimable && ib?.estimable)) continue;
        const ep = SearchP.endpoints(pa, pb), ei = SearchI.endpoints(ia, ib);
        eq(ep, ei, `search endpoint semantics mismatch ${candidate.sourceSeed}/${contrast.id}`);
        need(Object.prototype.hasOwnProperty.call(ep, "SILGM-E3-RANKING-PREORDER-CHANGE"), `primary endpoint missing ${contrast.id}`);
        searchDefinedness[contrast.id] += 1;
      }
    }

    need(selected.length <= spec.resourceCeiling.selectedRoots, "selected-root ceiling exceeded");
    need(geometryRows.length <= spec.resourceCeiling.geometryRootMeasurements, "geometry measurement ceiling exceeded");
    need(searchConditionMeasurements <= spec.resourceCeiling.searchConditionMeasurements, "search condition measurement ceiling exceeded");

    const profileP = DevP.profile(geometryRows, spec.geometry.primary);
    const profileI = DevI.profile(geometryRows, spec.geometry.primary);
    eq(profileP, profileI, "geometry-only threshold profile mismatch");
    const supportInput = {
      geometryProfile: profileP,
      searchDefinedness,
      metricIds: spec.geometry.primary,
      contrastIds: spec.search.contrasts.map((row) => row.id),
      selectedRootCount: selected.length,
      allEightCellsRepresented,
      productionIndependentExact: true,
    };
    const slotsP = DevP.supportSlots(supportInput), slotsI = DevI.supportSlots({ ...supportInput, geometryProfile: profileI });
    eq(slotsP, slotsI, "support-only slot classification mismatch");

    const elapsedMs = Number(process.hrtime.bigint() - t0) / 1e6;
    need(elapsedMs <= spec.resourceCeiling.stageElapsedMs, "Stage1 elapsed ceiling exceeded");
    need(process.memoryUsage().rss <= spec.resourceCeiling.peakRssBytes, "Stage1 RSS ceiling exceeded");
    const selectedIdentity = exactIdentityRows(selected);
    const result = {
      schemaVersion: 1,
      studyId: spec.studyId,
      stageId: spec.stageId,
      evidenceClass: spec.evidenceClass,
      stageDisposition: "STAGE1-DEVELOPMENT-COMPLETE",
      seedBlock: spec.moduleA.seedBlock,
      scientificSeedsRead: freshSeedsRead,
      authorizedScientificExecutions: 1,
      actualScientificExecutions: 1,
      formalInferencePerformed: false,
      pValuesComputed: false,
      riskDifferencesComputed: false,
      effectDirectionSummarized: false,
      winnerSubgroupSummarized: false,
      actualG405SearchVsExactMeasurements: 0,
      g405CandidateRescanCount: 0,
      g405DomainReplacementCount: 0,
      g410Depth11AccessCount: 0,
      publicAiChanged: false,
      firewallSummary: fw.summary,
      rejectionCounts: reject,
      sourceCells: cells,
      allEightCellsRepresented,
      selectedRootCount: selected.length,
      selectedIdentityManifestSha256: DevP.sha(stable(selectedIdentity)),
      selectedIdentityManifest: selectedIdentity,
      geometryPrimaryProfile: profileP,
      geometrySecondaryDefinedness: Object.fromEntries(spec.geometry.secondary.map((id) => [id, geometryRows.filter((row) => row.geometry[id]?.defined).length])),
      searchConfigurationDefinedness: configDefinedness,
      searchContrastDefinedness: searchDefinedness,
      supportOnlySlots: slotsP,
      supportedSlotCount: slotsP.filter((row) => row.decision === "SUPPORTED-FOR-FORMAL-HOLDOUT").length,
      productionIndependentExact: true,
      resourceReadiness: {
        elapsedMs,
        peakRssBytes: process.memoryUsage().rss,
        maxGeometryElapsedMs,
        maxDistinctRawStates,
        maxUniqueTransitions,
        maxTreeOccurrences: maxTreeOccurrences.toString(),
        searchConditionMeasurements,
      },
      stage2SeedAccess: false,
    };
    write(path.join(outDir, "STAGE_1_RESULT.json"), result);
    need(fs.statSync(path.join(outDir, "STAGE_1_RESULT.json")).size + fs.statSync(path.join(outDir, "STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json")).size <= spec.resourceCeiling.artifactBytes, "Stage1 artifact size ceiling exceeded");
    console.log(JSON.stringify({ event: "GCSREA-STAGE1-COMPLETE", stageDisposition: result.stageDisposition, scientificSeedsRead: freshSeedsRead, selectedRootCount: selected.length, supportedSlotCount: result.supportedSlotCount, outputDir: outDir }, null, 2));
  } catch (error) {
    const failure = {
      schemaVersion: 1,
      studyId: spec.studyId,
      stageId: spec.stageId,
      evidenceClass: spec.evidenceClass,
      stageDisposition: "STAGE1-TECHNICAL-INVALID",
      scientificSeedsRead: freshSeedsRead,
      formalInferencePerformed: false,
      pValuesComputed: false,
      riskDifferencesComputed: false,
      actualG405SearchVsExactMeasurements: 0,
      g405CandidateRescanCount: 0,
      g410Depth11AccessCount: 0,
      publicAiChanged: false,
      noRerunAuthorized: true,
      error: { name: error.name, message: error.message, stack: error.stack },
    };
    write(path.join(outDir, "STAGE_1_FAILURE.json"), failure);
    throw error;
  }
}

try { main(); } catch (error) { process.stderr.write(`${error.stack || error}\n`); process.exitCode = 1; }
