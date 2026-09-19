#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const P = require("./lib/sfcdft-production.js");
const I = require("./lib/sfcdft-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY = "SFCDFT-STUDY1";
const STAGE = "SFCDFT-S0-TECHNICAL-2026-09-18-v1";
const STUDY_SPEC = path.join(ROOT, "doc/structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_1_SPEC.json");
const STAGE_SPEC = path.join(ROOT, "doc/structural-forcing-corridor-tree-raw-transfer/prereg/STAGE_0_TECHNICAL_SPEC.json");
const AUTH = path.join(ROOT, "doc/structural-forcing-corridor-tree-raw-transfer/authorizations/STAGE_0_AUTHORIZATION.json");
const FIREWALL_DIR = path.join(ROOT, "doc/research-generation-4/prereg/g4-02-legacy-compatibility-firewall");
const DEFAULT_OUT = path.join(ROOT, "artifacts/sfcdft-stage0/result.json");

function need(x, m) { if (!x) throw new Error(m); }
function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function sha256Text(x) { return crypto.createHash("sha256").update(x, "utf8").digest("hex"); }
function sha256File(p) { return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex"); }
function gitBlobSha(p) {
  const b = fs.readFileSync(p);
  return crypto.createHash("sha1").update(Buffer.from(`blob ${b.length}\0`)).update(b).digest("hex");
}
function atomic(p, v) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const t = `${p}.tmp-${process.pid}`;
  fs.writeFileSync(t, JSON.stringify(v, null, 2) + "\n");
  fs.renameSync(t, p);
}
function exact(a, b, label) { need(P.canonical(a) === I.canonical(b), `${label} production/independent mismatch`); }
function rowCore(M, r) {
  if (!r) return null;
  return { ply: r.ply, phase: r.phase, terminal: r.terminal, rootLegalWidth: r.rootLegalWidth, rawStateSha256: r.rawStateSha256, stateKey: M.stateKey(r.state) };
}
function sourceCore(M, s) {
  return {
    stageId: s.stageId,
    seed: s.seed,
    policyId: s.policyId,
    familyId: s.familyId,
    domainId: s.domainId,
    trajectorySha256: s.trajectorySha256,
    openingPrefixLength: s.openingPrefixLength,
    openingPrefixSha256: s.openingPrefixSha256,
    moveCount: s.moveCount,
    terminal: s.terminal,
    anchors: {
      familyId: s.anchors.familyId,
      complete: s.anchors.complete,
      namua: rowCore(M, s.anchors.namua),
      mtaji: rowCore(M, s.anchors.mtaji)
    }
  };
}
function staticIndependenceAudit() {
  const pp = path.join(__dirname, "lib/sfcdft-production.js");
  const ip = path.join(__dirname, "lib/sfcdft-independent.js");
  const ps = fs.readFileSync(pp, "utf8"), is = fs.readFileSync(ip, "utf8");
  need(ps.includes('require("./lgttci-compatibility-production.js")'), "production LGTTCI binding missing");
  need(ps.includes('require("./sfcdf-production.js")'), "production SFCDF binding missing");
  need(!ps.includes('require("./lgttci-compatibility-independent.js")') && !ps.includes('require("./sfcdf-independent.js")'), "production imports independent path");
  need(is.includes('require("./lgttci-compatibility-independent.js")'), "independent LGTTCI binding missing");
  need(is.includes('require("./sfcdf-independent.js")'), "independent SFCDF binding missing");
  need(!is.includes('require("./lgttci-compatibility-production.js")') && !is.includes('require("./sfcdf-production.js")'), "independent imports production path");
  need(ps !== is, "production and independent transfer wrappers are identical");
  return { productionGitBlobSha: gitBlobSha(pp), independentGitBlobSha: gitBlobSha(ip), productionSha256: sha256Text(ps), independentSha256: sha256Text(is) };
}
function loadFirewall(manifest) {
  const trajectories = new Set(), roots = new Set(), files = [];
  for (const item of manifest.stage1rSfcdf.files) {
    const p = path.join(FIREWALL_DIR, item.path);
    need(fs.existsSync(p), `firewall chunk missing ${item.path}`);
    need(sha256File(p) === item.sha256, `firewall chunk SHA-256 mismatch ${item.path}`);
    const rows = fs.readFileSync(p, "utf8").split(/\r?\n/).filter(Boolean);
    need(rows.length === item.count, `firewall chunk count mismatch ${item.path}`);
    need(rows.every(x => /^[0-9a-f]{64}$/.test(x)), `invalid firewall hash ${item.path}`);
    need(rows.every((x, i) => i === 0 || rows[i - 1] < x), `firewall chunk not strictly sorted ${item.path}`);
    const target = item.path.includes("source-trajectory") ? trajectories : roots;
    for (const x of rows) { need(!target.has(x), `duplicate firewall identity ${x}`); target.add(x); }
    files.push({ path: item.path, count: rows.length, sha256: item.sha256 });
  }
  need(trajectories.size === manifest.stage1rSfcdf.sourceTrajectorySha256Count, "trajectory firewall total mismatch");
  need(roots.size === manifest.stage1rSfcdf.completeAnchorRootRawSha256Count, "root firewall total mismatch");
  const t0 = files.find(x => x.path.includes("source-trajectory"));
  const r0 = files.find(x => x.path.includes("complete-anchor-root"));
  const firstT = fs.readFileSync(path.join(FIREWALL_DIR, t0.path), "utf8").split(/\r?\n/).filter(Boolean)[0];
  const firstR = fs.readFileSync(path.join(FIREWALL_DIR, r0.path), "utf8").split(/\r?\n/).filter(Boolean)[0];
  need(trajectories.has(firstT) && roots.has(firstR), "firewall positive membership control failed");
  const zero = "0".repeat(64);
  need(!trajectories.has(zero) && !roots.has(zero), "firewall negative membership control failed");
  return { trajectories, roots, files, positiveControls: { trajectory: firstT, root: firstR }, negativeControl: zero };
}
function preflightLimits(stageSpec) {
  const x = stageSpec.resourceCeilings.perRepresentativeRoot;
  return {
    distinctRawStates: x.maxDistinctRawStates,
    uniqueTransitions: x.maxUniqueTransitions,
    parentExpansions: x.maxParentExpansions,
    legalMoveEvaluations: x.maxLegalMoveEvaluations,
    treeNodeOccurrences: x.maxTreeNodeOccurrences
  };
}
function preflightPair(source, limits) {
  const rows = [source.anchors.namua, source.anchors.mtaji];
  for (const r of rows) {
    const p = P.preflight(E, r.state, source.seed, r.ply, limits);
    const i = I.preflight(E, r.state, source.seed, r.ply, limits);
    exact(p, i, `preflight seed=${source.seed} ply=${r.ply}`);
    if (!p.eligible) return false;
  }
  return true;
}
function malformedIdentityNegativeControl() {
  const bad = { pits: [], reserve: [], houseOwned: [], player: 0, phase: "namua", winner: null };
  let a = false, b = false;
  try { P.stateKey(bad); } catch (_) { a = true; }
  try { I.stateKey(bad); } catch (_) { b = true; }
  need(a && b, "malformed RAW identity did not fail closed");
}
function scientificRangeGuard(studySpec, seed) {
  const ranges = [studySpec.seedAccessContract.stage1.primary, studySpec.seedAccessContract.stage1.pairedReserve, studySpec.seedAccessContract.stage2.primary, studySpec.seedAccessContract.stage2.pairedReserve];
  need(!ranges.some(r => seed >= r.seedStart && seed <= r.seedEnd), `technical runner attempted scientific seed ${seed}`);
}
function main(outFile) {
  const started = Date.now();
  let peakRssBytes = process.memoryUsage().rss;
  const checks = {};
  try {
    const studySpec = readJson(STUDY_SPEC), stageSpec = readJson(STAGE_SPEC), auth = readJson(AUTH);
    need(studySpec.studyId === STUDY && stageSpec.studyId === STUDY && auth.studyId === STUDY, "Study identity mismatch");
    need(stageSpec.stageId === STAGE && auth.stageId === STAGE, "Stage identity mismatch");
    need(auth.decision === "AUTHORIZED" && auth.authorizationType === "TECHNICAL-ONLY", "Stage 0 not technical-authorized");
    need(auth.stage1FreshScientificSeedAccessAuthorized === false && auth.stage2FreshScientificSeedAccessAuthorized === false, "scientific seed access unexpectedly authorized");
    need(auth.scientificEffectAuthorized === false && auth.formalDecisionAuthorized === false, "scientific outcome unexpectedly authorized");
    need(gitBlobSha(STUDY_SPEC) === stageSpec.studySpecBinding.gitBlobSha, "Study spec binding mismatch");
    need(gitBlobSha(AUTH) !== "", "authorization blob unreadable");
    need(gitBlobSha(path.join(ROOT, stageSpec.studyAuthorizationBinding.path)) === stageSpec.studyAuthorizationBinding.gitBlobSha, "Study authorization binding mismatch");
    need(gitBlobSha(STAGE_SPEC) === auth.stage0SpecBinding.gitBlobSha, "Stage 0 spec binding mismatch");
    checks.contractBindings = true;

    const staticAudit = staticIndependenceAudit();
    checks.productionIndependentStaticBoundary = true;

    const manifest = readJson(path.join(FIREWALL_DIR, "MANIFEST.json"));
    need(gitBlobSha(path.join(FIREWALL_DIR, "MANIFEST.json")) === stageSpec.legacyFirewallChecks.manifestGitBlobSha, "legacy firewall manifest binding mismatch");
    const firewall = loadFirewall(manifest);
    checks.legacyFirewallExactMembership = true;

    const fixture = stageSpec.technicalFixtureNamespace;
    need(fixture.seedStart === auth.allowedTechnicalFixtureSeeds.start && fixture.seedEnd === auth.allowedTechnicalFixtureSeeds.end, "technical fixture namespace authorization mismatch");
    need(fixture.count === fixture.seedEnd - fixture.seedStart + 1, "technical fixture count mismatch");
    const required = new Set(stageSpec.requiredDomainCoverage);
    const representatives = new Map();
    const limits = preflightLimits(stageSpec);
    let matchedReplayFailures = 0, scannedSeeds = 0;

    for (let seed = fixture.seedStart; seed <= fixture.seedEnd && representatives.size < required.size; seed++) {
      scientificRangeGuard(studySpec, seed);
      scannedSeeds++;
      let p = null, i = null, pe = null, ie = null;
      try { p = P.replaySource(E, STAGE, seed, stageSpec.sourceMaxPly); } catch (e) { pe = e; }
      try { i = I.replaySource(E, STAGE, seed, stageSpec.sourceMaxPly); } catch (e) { ie = e; }
      if (pe || ie) {
        need(pe && ie, `replay fail-closed mismatch seed=${seed}`);
        matchedReplayFailures++;
        continue;
      }
      exact(sourceCore(P, p), sourceCore(I, i), `source replay seed=${seed}`);
      exact(p.replay.moveKeys, i.replay.moveKeys, `canonical move sequence seed=${seed}`);
      need(required.has(p.domainId), `unexpected domain ${p.domainId}`);
      if (!p.anchors.complete || representatives.has(p.domainId)) continue;
      if (firewall.trajectories.has(p.trajectorySha256)) continue;
      if (firewall.roots.has(p.anchors.namua.rawStateSha256) || firewall.roots.has(p.anchors.mtaji.rawStateSha256)) continue;
      if (!preflightPair(p, limits)) continue;
      representatives.set(p.domainId, p);
      peakRssBytes = Math.max(peakRssBytes, process.memoryUsage().rss);
      need(Date.now() - started <= stageSpec.resourceCeilings.stage.maxElapsedMs, "Stage 0 elapsed ceiling exceeded during source scan");
      need(peakRssBytes <= stageSpec.resourceCeilings.stage.maxPeakRssBytes, "Stage 0 RSS ceiling exceeded during source scan");
    }
    need(representatives.size === required.size, `technical domain coverage incomplete ${representatives.size}/${required.size}`);
    checks.policyAssignmentExact = true;
    checks.rootFamilyAssignmentExact = true;
    checks.sourceReplayExact = true;
    checks.rawAndMoveIdentityExact = true;
    checks.trajectoryAndOpeningPrefixExact = true;
    checks.allFourDomainsCovered = true;
    checks.preflightExact = true;

    const representativeOutput = [];
    for (const domainId of [...required].sort()) {
      const s = representatives.get(domainId);
      const roots = [];
      for (const r of [s.anchors.namua, s.anchors.mtaji]) {
        need(P.stateKey(r.state) === I.stateKey(r.state), `RAW identity mismatch domain=${domainId} ply=${r.ply}`);
        const pm = P.endpointPair(E, r, s), im = I.endpointPair(E, r, s);
        exact(pm, im, `C1/C6 measurement domain=${domainId} ply=${r.ply}`);
        roots.push({
          phase: r.phase,
          ply: r.ply,
          rootRawSha256: r.rawStateSha256,
          endpointDigest: P.digest(pm.endpoints),
          c1Defined: pm.endpoints[P.C1].defined,
          c6Defined: pm.endpoints[P.C6].defined
        });
        peakRssBytes = Math.max(peakRssBytes, process.memoryUsage().rss);
        need(Date.now() - started <= stageSpec.resourceCeilings.stage.maxElapsedMs, "Stage 0 elapsed ceiling exceeded during measurement");
        need(peakRssBytes <= stageSpec.resourceCeilings.stage.maxPeakRssBytes, "Stage 0 RSS ceiling exceeded during measurement");
      }
      representativeOutput.push({
        domainId,
        seed: s.seed,
        policyId: s.policyId,
        familyId: s.familyId,
        trajectorySha256: s.trajectorySha256,
        openingPrefixSha256: s.openingPrefixSha256,
        roots
      });
    }
    checks.c1ExactEndpointCanonicalEquality = true;
    checks.c6ExactEndpointCanonicalEquality = true;

    const qa = P.subtract(P.fraction(2n, 3n), P.fraction(1n, 2n));
    const qb = I.subtract(I.fraction(2n, 3n), I.fraction(1n, 2n));
    exact(qa, qb, "exact rational subtraction");
    need(qa.defined && qa.numerator === "1" && qa.denominator === "6" && P.sign(qa) === 1 && I.sign(qb) === 1, "exact rational fixture failed");
    checks.exactRationalArithmetic = true;

    const hp = P.fixedEightHolm(stageSpec.syntheticFormalFixtures.slots);
    const hi = I.fixedEightHolm(stageSpec.syntheticFormalFixtures.slots);
    exact(hp, hi, "fixed-eight Holm fixture");
    need(hp.familySize === 8 && hp.slots.length === 8, "fixed multiplicity family shrank");
    const f1 = hp.slots.find(x => x.id === "F1"), f7 = hp.slots.find(x => x.id === "F7");
    need(f1.rawP.numerator === "1" && f1.rawP.denominator === "131072", "exact sign-test fixture mismatch");
    need(f7.estimable === false && f7.rawP.numerator === "1" && f7.rawP.denominator === "1" && f7.holmPass === false, "NON-ESTIMABLE placeholder fixture failed");
    checks.exactSignTestAgreement = true;
    checks.fixedEightHolmAgreement = true;
    checks.nonEstimablePlaceholderPreserved = true;

    malformedIdentityNegativeControl();
    checks.malformedRawIdentityFailsClosed = true;

    const core = {
      schemaVersion: 1,
      studyId: STUDY,
      stageId: STAGE,
      evidenceClass: "TECHNICAL-FIXTURE",
      decision: "STAGE0-PASS",
      checks,
      fixtureNamespace: fixture,
      scannedSeeds,
      matchedReplayFailures,
      representativeDomains: representativeOutput,
      firewallAudit: {
        trajectoryCount: firewall.trajectories.size,
        rootCount: firewall.roots.size,
        positiveControls: firewall.positiveControls,
        negativeControl: firewall.negativeControl
      },
      syntheticHolmDigest: P.digest(hp),
      staticImplementationAudit: staticAudit,
      protectedEvidence: {
        stage1ScientificSeedRead: false,
        stage2ScientificSeedRead: false,
        g3_11Depth10Rerun: false,
        g3_12Stage2Access: false,
        g4_01SeedReplay: false,
        g4_10Depth11Access: false,
        publicAiChange: false
      }
    };
    const result = { ...core, deterministicCoreSha256: P.digest(core), telemetry: { elapsedMs: Date.now() - started, peakRssBytes, resultArtifactBytes: null } };
    atomic(outFile, result);
    result.telemetry.resultArtifactBytes = fs.statSync(outFile).size;
    need(result.telemetry.resultArtifactBytes <= stageSpec.resourceCeilings.stage.maxArtifactBytes, "Stage 0 artifact ceiling exceeded");
    atomic(outFile, result);
    process.stdout.write(`SFCDFT_STAGE0=${JSON.stringify({decision:result.decision,deterministicCoreSha256:result.deterministicCoreSha256,scannedSeeds,elapsedMs:result.telemetry.elapsedMs,peakRssBytes:result.telemetry.peakRssBytes})}\n`);
  } catch (error) {
    peakRssBytes = Math.max(peakRssBytes, process.memoryUsage().rss);
    const failure = {
      schemaVersion: 1,
      studyId: STUDY,
      stageId: STAGE,
      evidenceClass: "TECHNICAL-FIXTURE",
      decision: "TECHNICAL-INVALID",
      error: { name: error.name, message: error.message, stack: error.stack },
      checks,
      protectedEvidence: {
        stage1ScientificSeedRead: false,
        stage2ScientificSeedRead: false,
        g3_11Depth10Rerun: false,
        g3_12Stage2Access: false,
        g4_01SeedReplay: false,
        g4_10Depth11Access: false,
        publicAiChange: false
      },
      telemetry: { elapsedMs: Date.now() - started, peakRssBytes }
    };
    atomic(outFile, failure);
    console.error(error.stack || error);
    process.exitCode = 1;
  }
}

main(path.resolve(process.argv[2] || DEFAULT_OUT));
