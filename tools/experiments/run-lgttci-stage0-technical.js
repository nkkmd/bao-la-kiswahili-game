#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const P = require("./lib/lgttci-compatibility-production.js");
const I = require("./lib/lgttci-compatibility-independent.js");
const SearchProduction = require("./lib/silgm-production.js");
const SearchIndependent = require("./lib/silgm-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY = "LGTTCI-STUDY1";
const STAGE = "LGTTCI-S0-TECHNICAL-2026-09-17-v1";
const SPEC_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/STUDY_1_SPEC.json");
const AMEND_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/PRE_EXECUTION_SPEC_AMENDMENT_V1.json");
const AUTH_PATH = path.join(ROOT, "doc/local-game-tree-geometry-transfer-compatibility-instrument/authorizations/STAGE_0_AUTHORIZATION.json");
const DEFAULT_OUT = path.join(ROOT, "artifacts/lgttci-stage0/result.json");

function need(value, message) { if (!value) throw new Error(message); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function sha256Text(text) { return crypto.createHash("sha256").update(text, "utf8").digest("hex"); }
function gitBlobSha(file) {
  const body = fs.readFileSync(file);
  const header = Buffer.from(`blob ${body.length}\0`, "utf8");
  return crypto.createHash("sha1").update(header).update(body).digest("hex");
}
function coreRow(row) {
  return {
    ply: row.ply,
    phase: row.phase,
    terminal: row.terminal,
    rootLegalWidth: row.rootLegalWidth,
    rawStateSha256: row.rawStateSha256
  };
}
function replayCore(x) {
  return {
    policyId: x.policyId,
    seed: x.seed,
    moveKeys: x.moveKeys,
    rows: x.rows.map(coreRow),
    trajectorySha256: x.trajectorySha256,
    terminal: x.terminal
  };
}
function anchorCore(a) {
  const row = x => x ? coreRow(x) : null;
  return { familyId: a.familyId, namua: row(a.namua), mtaji: row(a.mtaji), complete: a.complete };
}
function sourceBindings(spec) {
  const rows = [];
  for (const [name, item] of Object.entries(spec.sourceIdentity)) {
    need(item && item.path && item.gitBlobSha, `source identity incomplete: ${name}`);
    const file = path.join(ROOT, item.path);
    need(fs.existsSync(file), `source file missing: ${item.path}`);
    const actual = gitBlobSha(file);
    need(actual === item.gitBlobSha, `source blob mismatch ${name}: ${actual} != ${item.gitBlobSha}`);
    rows.push({ name, path: item.path, gitBlobSha: actual });
  }
  return rows;
}
function staticIndependenceAudit() {
  const productionPath = path.join(__dirname, "lib/lgttci-compatibility-production.js");
  const independentPath = path.join(__dirname, "lib/lgttci-compatibility-independent.js");
  const ps = fs.readFileSync(productionPath, "utf8");
  const is = fs.readFileSync(independentPath, "utf8");
  need(ps.includes('require("./lgtgmiv-stage1-production.js")'), "production RAW binding missing");
  need(ps.includes('require("./crclgr-production.js")'), "production continuous binding missing");
  need(ps.includes('require("./silgm-production.js")'), "production search binding missing");
  need(!ps.includes('require("./lgtgmiv-stage1-independent.js")'), "production imports independent RAW");
  need(!ps.includes('require("./crclgr-independent.js")'), "production imports independent continuous");
  need(!ps.includes('require("./silgm-independent.js")'), "production imports independent search");
  need(is.includes('require("./lgtgmiv-stage1-independent.js")'), "independent RAW binding missing");
  need(is.includes('require("./crclgr-independent.js")'), "independent continuous binding missing");
  need(is.includes('require("./silgm-independent.js")'), "independent search binding missing");
  need(!is.includes('require("./lgtgmiv-stage1-production.js")'), "independent imports production RAW");
  need(!is.includes('require("./crclgr-production.js")'), "independent imports production continuous");
  need(!is.includes('require("./silgm-production.js")'), "independent imports production search");
  need(ps !== is, "production and independent wrappers are identical");
  return {
    productionGitBlobSha: gitBlobSha(productionPath),
    independentGitBlobSha: gitBlobSha(independentPath),
    productionSha256: sha256Text(ps),
    independentSha256: sha256Text(is)
  };
}
function malformedIdentityNegativeControl() {
  const malformed = { pits: [], reserve: [], houseOwned: [], player: 0, phase: "namua", winner: null };
  let p = false, i = false;
  try { P.stateKey(malformed); } catch (_) { p = true; }
  try { I.stateKey(malformed); } catch (_) { i = true; }
  need(p && i, "malformed RAW identity did not fail closed");
  return true;
}
function directSingletonFailure(state, condition) {
  let productionError = null;
  let independentError = null;
  try { SearchProduction.conditionResult(state, condition); } catch (error) { productionError = error.message; }
  try { SearchIndependent.conditionResult(state, condition); } catch (error) { independentError = error.message; }
  need(productionError && /complete root ranking required/.test(productionError), `production singleton negative control did not expose historical precondition: ${productionError}`);
  need(independentError && /ranking requires >=2 moves/.test(independentError), `independent singleton negative control did not expose historical precondition: ${independentError}`);
  return { productionError, independentError };
}
function preflightPair(candidate, limits) {
  const pp = P.preflightContinuous(E, candidate.row.state, candidate.seed, candidate.row.ply, limits);
  const ip = I.preflightContinuous(E, candidate.row.state, candidate.seed, candidate.row.ply, limits);
  need(P.stable(pp) === I.stable(ip), `continuous preflight mismatch seed=${candidate.seed} ply=${candidate.row.ply}`);
  return pp;
}
function chooseRepresentative(candidates, phase, limits) {
  const xs = candidates
    .filter(x => x.row.phase === phase && !x.row.terminal && x.row.rootLegalWidth >= 2)
    .sort((a, b) => a.row.rootLegalWidth - b.row.rootLegalWidth || a.seed - b.seed || a.row.ply - b.row.ply);
  let tried = 0;
  for (const candidate of xs) {
    if (tried >= 24) break;
    tried++;
    const preflight = preflightPair(candidate, limits);
    if (preflight.eligible) return { ...candidate, preflight };
  }
  throw new Error(`no resource-eligible rankable ${phase} technical root among first ${tried} candidates`);
}
function verifyRepresentative(candidate, spec, limits) {
  const state = candidate.row.state;
  const legalP = P.legalRows(E, state).map(x => x.moveKey);
  const legalI = I.legalRows(E, state).map(x => x.moveKey);
  need(JSON.stringify(legalP) === JSON.stringify(legalI), `canonical move identity mismatch ${candidate.row.phase}`);
  need(P.stateKey(state) === I.stateKey(state), `RAW identity mismatch ${candidate.row.phase}`);

  const preflight = preflightPair(candidate, limits);
  need(preflight.eligible, `representative preflight not eligible ${candidate.row.phase}: ${preflight.reasonCode}`);

  const rawP = P.measureRaw(E, state, candidate.seed, candidate.row.ply);
  const rawI = I.measureRaw(E, state, candidate.seed, candidate.row.ply);
  need(P.stable(rawP) === I.stable(rawI), `RAW geometry mismatch ${candidate.row.phase}`);

  const search = [];
  for (const condition of spec.searchCompatibilityContract.conditions) {
    const sp = P.classifySearch(E, state, condition);
    const si = I.classifySearch(E, state, condition);
    need(P.stable(sp) === I.stable(si), `search compatibility mismatch phase=${candidate.row.phase} condition=${condition.id}`);
    need(sp.helperCalled === true, `rankable root unexpectedly skipped helper phase=${candidate.row.phase} condition=${condition.id}`);
    search.push({
      conditionId: condition.id,
      estimable: sp.estimable,
      reasonCode: sp.reasonCode,
      completedDepth: sp.completedDepth === undefined ? null : sp.completedDepth,
      digest: P.digest(sp)
    });
  }

  const contP = P.measureContinuous(E, state, candidate.seed, candidate.row.ply);
  const contI = I.measureContinuous(E, state, candidate.seed, candidate.row.ply);
  need(P.stable(contP) === I.stable(contI), `continuous geometry mismatch ${candidate.row.phase}`);

  return {
    policyId: candidate.policyId,
    seed: candidate.seed,
    ply: candidate.row.ply,
    phase: candidate.row.phase,
    rootLegalWidth: candidate.row.rootLegalWidth,
    rawStateSha256: candidate.row.rawStateSha256,
    preflight,
    rawGeometryDigest: P.digest(rawP),
    continuousGeometryDigest: P.digest(contP),
    search
  };
}
function main(outFile) {
  const started = Date.now();
  const checks = {};
  try {
    const specText = fs.readFileSync(SPEC_PATH, "utf8");
    const amendText = fs.readFileSync(AMEND_PATH, "utf8");
    const authText = fs.readFileSync(AUTH_PATH, "utf8");
    const spec = JSON.parse(specText);
    const amendment = JSON.parse(amendText);
    const auth = JSON.parse(authText);

    need(spec.studyId === STUDY, "Study identity mismatch");
    need(spec.authorizationDecision === "G4-01-AUTHORIZED", "Study authorization mismatch");
    need(amendment.studyId === STUDY && amendment.status === "ACTIVE-PRE-EXECUTION-CONTRACT-COMPLETION", "pre-execution amendment mismatch");
    need(auth.studyId === STUDY && auth.stageId === STAGE && auth.decision === "AUTHORIZED", "Stage 0 authorization mismatch");
    need(auth.authorizationType === "TECHNICAL-ONLY", "Stage 0 must remain technical-only");
    need(auth.freshCompatibilitySeedAccessAuthorized === false && auth.scientificOutcomeAuthorized === false, "scientific access unexpectedly authorized");
    need(spec.freshCompatibilitySeedBlocks.statusAtFreeze === "RESERVED-NOT-ACCESSED", "fresh compatibility namespace not sealed");
    checks.contractAndAuthorizationBinding = true;

    const sources = sourceBindings(spec);
    checks.frozenSourceBlobBinding = true;
    const staticAudit = staticIndependenceAudit();
    checks.productionIndependentStaticBoundary = true;

    const technical = spec.technicalFixtureNamespace;
    need(technical.seedStart === auth.allowedTechnicalFixtureSeeds.start && technical.seedEnd === auth.allowedTechnicalFixtureSeeds.end, "technical fixture authorization mismatch");
    const policies = spec.sourcePolicies.map(x => x.policyId);
    need(JSON.stringify(policies) === JSON.stringify([P.P1, P.P2]), "policy identity mismatch");

    const trajectories = [];
    const candidates = [];
    let policyDistinctCount = 0;
    const replayBySeed = new Map();
    const familySupport = {};
    for (const family of spec.rootFamilies) familySupport[family.rootFamilyId] = { [P.P1]: 0, [P.P2]: 0 };

    for (let seed = technical.seedStart; seed <= technical.seedEnd; seed++) {
      const seedRows = {};
      for (const policyId of policies) {
        const pr = P.replay(E, policyId, seed, spec.resourceCeilings.stage1.maxSourcePliesPerTrajectory);
        const ir = I.replay(E, policyId, seed, spec.resourceCeilings.stage1.maxSourcePliesPerTrajectory);
        const pc = replayCore(pr), ic = replayCore(ir);
        need(P.stable(pc) === I.stable(ic), `source-policy replay mismatch policy=${policyId} seed=${seed}`);
        seedRows[policyId] = pc;
        const anchors = [];
        for (const family of spec.rootFamilies) {
          const pa = P.selectAnchors(pr.rows, family.rootFamilyId);
          const ia = I.selectAnchors(ir.rows, family.rootFamilyId);
          need(P.stable(anchorCore(pa)) === I.stable(anchorCore(ia)), `root contract mismatch policy=${policyId} seed=${seed} family=${family.rootFamilyId}`);
          if (pa.complete) familySupport[family.rootFamilyId][policyId]++;
          anchors.push(anchorCore(pa));
        }
        trajectories.push({ policyId, seed, trajectorySha256: pr.trajectorySha256, plies: pr.rows.length, terminal: pr.terminal, anchors });
        for (const row of pr.rows) candidates.push({ policyId, seed, row });
      }
      if (seedRows[P.P1].trajectorySha256 !== seedRows[P.P2].trajectorySha256) policyDistinctCount++;
      replayBySeed.set(seed, seedRows);
    }
    need(policyDistinctCount > 0, "technical fixtures do not distinguish P1 and P2");
    for (const [familyId, byPolicy] of Object.entries(familySupport)) {
      need(byPolicy[P.P1] > 0 && byPolicy[P.P2] > 0, `root contract has no complete technical support family=${familyId}`);
    }
    checks.sourcePolicyProductionIndependentExact = true;
    checks.sourcePoliciesTechnicallyDistinguishable = true;
    checks.rootContractsExecutable = true;

    const singleton = candidates
      .filter(x => !x.row.terminal && x.row.rootLegalWidth === 1)
      .sort((a, b) => a.seed - b.seed || a.row.ply - b.row.ply)[0];
    need(singleton, "no reachable singleton technical root found in frozen technical fixture namespace");
    const singletonCondition = spec.searchCompatibilityContract.conditions.find(x => x.id === "D2_Q1");
    need(singletonCondition, "singleton technical condition missing");
    const sgP = P.classifySearch(E, singleton.row.state, singletonCondition);
    const sgI = I.classifySearch(E, singleton.row.state, singletonCondition);
    need(P.stable(sgP) === I.stable(sgI), "singleton compatibility classification mismatch");
    need(sgP.estimable === false && sgP.reasonCode === "ROOT-LEGAL-WIDTH-LT2" && sgP.helperCalled === false, "singleton did not fail cleanly before helper call");
    const historicalGapNegativeControl = directSingletonFailure(singleton.row.state, singletonCondition);
    checks.singletonPreconditionCaughtBeforeHelper = true;
    checks.historicalGapNegativeControl = true;

    const limits = amendment.activePreflightLimits;
    for (const key of ["distinctRawStates", "uniqueTransitions", "parentExpansions", "legalMoveEvaluations", "treeNodeOccurrences"]) {
      need(Number.isInteger(limits[key]) && limits[key] > 0, `active preflight limit missing: ${key}`);
    }
    const namua = chooseRepresentative(candidates, "namua", limits);
    const mtaji = chooseRepresentative(candidates, "mtaji", limits);
    const representativeRoots = [verifyRepresentative(namua, spec, limits), verifyRepresentative(mtaji, spec, limits)];
    checks.rawIdentityAndMoveIdentityExact = true;
    checks.rawDepth5GeometryExact = true;
    checks.rankableSearchCompatibilityExact = true;
    checks.continuousGeometryExact = true;
    checks.boundedPreflightExact = true;

    malformedIdentityNegativeControl();
    checks.failClosedMalformedIdentity = true;

    const repeated = P.replay(E, P.P1, technical.seedStart, 20);
    const repeatedAgain = P.replay(E, P.P1, technical.seedStart, 20);
    need(P.stable(replayCore(repeated)) === P.stable(replayCore(repeatedAgain)), "deterministic replay invariant failed");
    checks.deterministicReplay = true;

    checks.freshCompatibilitySeedAccess = false;
    checks.g3_12Stage1SeedReplay = false;
    checks.g3_12Stage2SeedAccess = false;
    checks.g3_11Depth10Rerun = false;
    checks.g4_10Depth11Access = false;
    checks.formalEffectComputation = false;

    const scientificCore = {
      studyId: STUDY,
      stageId: STAGE,
      evidenceClass: "TECHNICAL-FIXTURE-NON-SCIENTIFIC",
      checks,
      sourceBindings: sources,
      staticAudit,
      technicalFixtureNamespace: { seedStart: technical.seedStart, seedEnd: technical.seedEnd, count: technical.count },
      sourcePolicyDistinctTrajectoryCount: policyDistinctCount,
      familySupport,
      singletonRoot: {
        policyId: singleton.policyId,
        seed: singleton.seed,
        ply: singleton.row.ply,
        phase: singleton.row.phase,
        rawStateSha256: singleton.row.rawStateSha256,
        classification: sgP,
        historicalGapNegativeControl
      },
      representativeRoots,
      activePreflightLimits: limits,
      studySpecSha256: sha256Text(specText),
      preExecutionAmendmentSha256: sha256Text(amendText),
      stage0AuthorizationSha256: sha256Text(authText),
      freshCompatibilitySeedAccess: false,
      formalEffectComputation: false,
      protectedEvidenceAccess: false
    };

    const elapsedMs = Date.now() - started;
    const peakRssBytes = process.memoryUsage().rss;
    const stage0Ceilings = spec.resourceCeilings.stage0;
    let result = {
      schemaVersion: 1,
      ...scientificCore,
      deterministicCoreSha256: P.digest(scientificCore),
      telemetry: { elapsedMs, peakRssBytes, resultArtifactBytes: null },
      resourceCeilings: stage0Ceilings,
      stageDisposition: "STAGE0-PASS",
      freshCompatibilityAuthorizedByThisResult: false,
      nextRequiredDecision: "POST-STAGE0-STAGE1-AUTHORIZATION-REVIEW"
    };
    let text = JSON.stringify(result, null, 2) + "\n";
    result.telemetry.resultArtifactBytes = Buffer.byteLength(text);
    if (elapsedMs > stage0Ceilings.elapsedMs || peakRssBytes > stage0Ceilings.peakRssBytes || result.telemetry.resultArtifactBytes > stage0Ceilings.resultArtifactBytes) {
      result.stageDisposition = "STAGE0-NON-ESTIMABLE";
    }
    text = JSON.stringify(result, null, 2) + "\n";
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, text);
    console.log(`LGTTCI_STAGE0=${JSON.stringify({ stageDisposition: result.stageDisposition, deterministicCoreSha256: result.deterministicCoreSha256, elapsedMs, peakRssBytes, policyDistinctCount, singleton: result.singletonRoot, representatives: representativeRoots.map(x => ({ phase: x.phase, seed: x.seed, ply: x.ply, width: x.rootLegalWidth, rawStateSha256: x.rawStateSha256 })) })}`);
    if (result.stageDisposition !== "STAGE0-PASS") process.exitCode = 2;
  } catch (error) {
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    const result = {
      schemaVersion: 1,
      studyId: STUDY,
      stageId: STAGE,
      evidenceClass: "TECHNICAL-FIXTURE-NON-SCIENTIFIC",
      stageDisposition: "STAGE0-TECHNICAL-INVALID",
      error: { name: error.name, message: error.message, stack: error.stack },
      freshCompatibilitySeedAccess: false,
      formalEffectComputation: false,
      protectedEvidenceAccess: false,
      freshCompatibilityAuthorizedByThisResult: false
    };
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2) + "\n");
    console.error(`LGTTCI_STAGE0_ERROR=${error.stack || error.message}`);
    process.exitCode = 1;
  }
}

main(path.resolve(process.argv[2] || DEFAULT_OUT));
