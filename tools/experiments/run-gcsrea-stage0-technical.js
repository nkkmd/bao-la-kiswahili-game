#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const SearchP = require("./lib/silgm-production.js");
const SearchI = require("./lib/silgm-independent.js");
const SemP = require("./lib/gcsrea-stage0-production.js");
const SemI = require("./lib/gcsrea-stage0-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY_PATH = path.join(ROOT, "doc/geometry-conditioned-search-reliability-exact-agreement/prereg/STUDY_1_SPEC.json");
const STAGE_PATH = path.join(ROOT, "doc/geometry-conditioned-search-reliability-exact-agreement/prereg/STAGE_0_TECHNICAL_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/geometry-conditioned-search-reliability-exact-agreement/authorizations/STAGE_0_AUTHORIZATION.json");
const DEFAULT_OUT = path.join(ROOT, "doc/geometry-conditioned-search-reliability-exact-agreement/results/stage-0/STAGE_0_TECHNICAL_RESULT.json");

function need(value, message) {
  if (!value) throw new Error(message);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function sha256(value) {
  const text = typeof value === "string" ? value : SemP.stable(value);
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function conditionCore(result) {
  if (!result || result.estimable !== true) {
    return {
      estimable: false,
      completedDepth: result && Number.isInteger(result.completedDepth) ? result.completedDepth : 0,
    };
  }
  return {
    estimable: true,
    completedDepth: result.completedDepth,
    canonicalBestMoveKey: result.canonicalBestMoveKey,
    topSetMoveKeys: result.topSetMoveKeys,
    bestScore: result.bestScore,
    secondBestScore: result.secondBestScore,
    bestSecondGap: result.bestSecondGap,
    ranking: result.ranking,
    pvMoveKeys: result.pvMoveKeys,
  };
}

function geometryCore(result) {
  return {
    rootRawSha256: result.rootRawSha256,
    metrics: result.metrics,
    upstreamRootReconstructionCoreSha256: result.upstreamRootReconstructionCoreSha256,
    upstreamFamilyCoreSha256: result.upstreamFamilyCoreSha256,
  };
}

function actualSearchChecks(spec, state) {
  const rows = [];
  const byIdP = new Map();
  const byIdI = new Map();
  for (const condition of spec.searchConfigurations) {
    const p = SearchP.conditionResult(state, condition);
    const i = SearchI.conditionResult(state, condition);
    const pc = conditionCore(p);
    const ic = conditionCore(i);
    need(SemP.stable(pc) === SemI.stable(ic), `search production/independent mismatch: ${condition.id}`);
    byIdP.set(condition.id, p);
    byIdI.set(condition.id, i);
    rows.push({
      conditionId: condition.id,
      kind: condition.kind,
      estimable: pc.estimable,
      completedDepth: pc.completedDepth,
      digest: sha256(pc),
    });
  }

  const contrasts = [];
  for (const contrast of spec.technicalContrasts) {
    const aP = byIdP.get(contrast.a);
    const bP = byIdP.get(contrast.b);
    const aI = byIdI.get(contrast.a);
    const bI = byIdI.get(contrast.b);
    need(aP && bP && aI && bI, `contrast condition missing: ${contrast.id}`);
    if (!(aP.estimable && bP.estimable && aI.estimable && bI.estimable)) {
      contrasts.push({ id: contrast.id, status: "TECHNICAL-NONESTIMABLE" });
      continue;
    }
    const p = SemP.compareSearchOutputs(aP, bP);
    const i = SemI.compareSearchOutputs(aI, bI);
    need(SemP.stable(p) === SemI.stable(i), `stability production/independent mismatch: ${contrast.id}`);
    contrasts.push({ id: contrast.id, status: "ESTIMABLE", summary: p, digest: sha256(p) });
  }
  need(contrasts.some((row) => row.status === "ESTIMABLE"), "no estimable technical search contrast");
  return { rows, contrasts };
}

function geometryChecks(spec, initialState) {
  const legal = E.moveVariants(initialState).slice().sort((a, b) => SearchP.moveKey(a).localeCompare(SearchP.moveKey(b)));
  need(legal.length >= 2, "initial technical root must have >=2 legal moves");
  const childState = E.applyMove(initialState, legal[0]).state;
  const roots = [
    { id: "INITIAL", state: initialState, metadataSeed: spec.technicalGeometryMetadataSeed, ply: 0 },
    { id: "INITIAL-CANONICAL-FIRST-CHILD", state: childState, metadataSeed: spec.technicalGeometryMetadataSeed, ply: 1 },
  ];
  need(roots.length <= spec.resourceCeiling.maxGeometryRootMeasurements, "geometry root ceiling exceeded");
  const rows = [];
  for (const root of roots) {
    const p = SearchP.measureGeometry(E, root.state, root.metadataSeed, root.ply);
    const i = SearchI.measureGeometry(root.state, root.metadataSeed, root.ply);
    const pc = geometryCore(p);
    const ic = geometryCore(i);
    need(SemP.stable(pc) === SemI.stable(ic), `geometry production/independent mismatch: ${root.id}`);
    rows.push({ id: root.id, rootRawSha256: pc.rootRawSha256, metrics: pc.metrics, digest: sha256(pc) });
  }
  return rows;
}

function mockSearchResult() {
  return {
    estimable: true,
    completedDepth: 2,
    canonicalBestMoveKey: "MOVE-A",
    topSetMoveKeys: ["MOVE-A", "MOVE-B"],
    bestScore: 10,
    secondBestScore: 10,
    bestSecondGap: 0,
    ranking: [
      { moveKey: "MOVE-A", score: 10 },
      { moveKey: "MOVE-B", score: 10 },
      { moveKey: "MOVE-C", score: 5 },
      { moveKey: "MOVE-D", score: 1 },
    ],
    pvMoveKeys: ["MOVE-A", "MOVE-C"],
  };
}

function exactAgreementSemanticChecks(stage) {
  const search = mockSearchResult();
  const fixtures = [
    { id: "EQUAL", exact: ["MOVE-A", "MOVE-B"], expected: "EQUAL" },
    { id: "SEARCH-SUBSET-EXACT", exact: ["MOVE-A", "MOVE-B", "MOVE-C"], expected: "A-SUBSET-B" },
    { id: "SEARCH-SUPERSET-EXACT", exact: ["MOVE-A"], expected: "A-SUPERSET-B" },
    { id: "OVERLAP", exact: ["MOVE-B", "MOVE-C"], expected: "OVERLAP" },
    { id: "DISJOINT", exact: ["MOVE-C", "MOVE-D"], expected: "DISJOINT" },
  ];
  need(fixtures.length <= stage.resourceCeiling.maxExactSemanticFixtures, "exact semantic fixture ceiling exceeded");
  const rows = [];
  for (const fixture of fixtures) {
    const p = SemP.exactAgreement(search, fixture.exact, stage.exactAgreement.topK);
    const i = SemI.exactAgreement(search, fixture.exact, stage.exactAgreement.topK);
    need(SemP.stable(p) === SemI.stable(i), `exact-agreement semantic mismatch: ${fixture.id}`);
    need(p.topSetVsExact === fixture.expected, `unexpected exact set classification: ${fixture.id}`);
    rows.push({ id: fixture.id, exactMoveKeys: fixture.exact.slice().sort(), result: p, digest: sha256(p) });
  }
  return rows;
}

function main(outFile) {
  const started = Date.now();
  const result = {
    schemaVersion: 1,
    studyId: "GCSREA-STUDY1",
    stageId: "GCSREA-S0-TECHNICAL-2026-09-27-v1",
    evidenceClass: "TECHNICAL-FIXTURE",
    disposition: "TECHNICAL-INVALID",
    scientificExecution: false,
    freshScientificSeedReads: 0,
    g4_05ExactDomainNewMeasurements: 0,
    g4_10Depth11AccessCount: 0,
    publicAiChanged: false,
    checks: {},
  };

  try {
    const spec = readJson(STUDY_PATH);
    const stage = readJson(STAGE_PATH);
    const auth = readJson(AUTH_PATH);
    need(spec.studyId === result.studyId, "study identity mismatch");
    need(spec.status === "PREREGISTERED-STAGE0-ONLY", "study status mismatch");
    need(stage.studyId === result.studyId && stage.stageId === result.stageId, "stage identity mismatch");
    need(stage.evidenceClass === "TECHNICAL-FIXTURE", "evidence class mismatch");
    need(stage.freshScientificSeedAccessAuthorized === false, "fresh scientific seed access unexpectedly authorized");
    need(stage.g4_05ExactDomainScientificMeasurementAuthorized === false, "G4-05 exact-domain scientific measurement unexpectedly authorized");
    need(stage.protectedDepth11AccessAuthorized === false, "G4-10 depth11 access unexpectedly authorized");
    need(auth.studyId === result.studyId && auth.stageId === result.stageId && auth.decision === "AUTHORIZED", "Stage 0 authorization mismatch");
    need(auth.authorizationType === "TECHNICAL-ONLY", "authorization must be technical-only");
    result.checks.contractAndAuthorization = true;

    const initial = E.initialState();
    need(initial && initial.winner === null, "initial technical state unavailable");

    result.search = actualSearchChecks(spec, initial);
    result.checks.searchProductionIndependentExact = true;
    result.checks.searchStabilitySemanticsExact = true;

    result.geometry = geometryChecks(stage, initial);
    result.checks.geometryProductionIndependentExact = true;

    result.exactAgreementSemantics = exactAgreementSemanticChecks(stage);
    result.checks.exactAgreementProductionIndependentExact = true;
    result.checks.exactAgreementClassificationCoverage = true;

    need(spec.candidateFutureNamespaces.stage1.authorizedForRead === false, "Stage 1 namespace unexpectedly readable");
    need(spec.candidateFutureNamespaces.stage2.authorizedForRead === false, "Stage 2 namespace unexpectedly readable");
    need(spec.protectedEvidence.g4_10Depth11Access === false, "G4-10 depth11 access unexpectedly allowed");
    need(spec.protectedEvidence.publicAiChange === false, "public AI change unexpectedly allowed");
    result.checks.futureScientificNamespacesSealed = true;
    result.checks.protectedBoundariesSealed = true;

    result.disposition = "STAGE0-PASS";
  } catch (error) {
    result.error = { name: error.name, message: error.message, stack: error.stack };
  } finally {
    result.elapsedMs = Date.now() - started;
    result.peakRssBytes = process.memoryUsage().rss;
    result.resultCoreSha256 = sha256({
      studyId: result.studyId,
      stageId: result.stageId,
      disposition: result.disposition,
      scientificExecution: result.scientificExecution,
      freshScientificSeedReads: result.freshScientificSeedReads,
      g4_05ExactDomainNewMeasurements: result.g4_05ExactDomainNewMeasurements,
      g4_10Depth11AccessCount: result.g4_10Depth11AccessCount,
      publicAiChanged: result.publicAiChanged,
      checks: result.checks,
    });
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2) + "\n");
  }

  if (result.disposition !== "STAGE0-PASS") process.exitCode = 1;
}

main(process.argv[2] || DEFAULT_OUT);
