#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const P = require("./lib/sfcdft3-production.js");
const I = require("./lib/sfcdft3-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const STAGE_ID = "SFCDFT3-S0-TECHNICAL-2026-09-19-v1";
const TECH_START = 49031001;
const TECH_END = 49031256;
const STUDY1_DIR = path.join(ROOT, "doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study1");
const STUDY2_DIR = path.join(ROOT, "doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study2");

function need(value, message) { if (!value) throw new Error(message); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function sha256(value) { return crypto.createHash("sha256").update(typeof value === "string" ? value : stable(value), "utf8").digest("hex"); }
function copy(value) { return JSON.parse(JSON.stringify(value)); }
function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i += 1) {
    if (!args[i].startsWith("--")) continue;
    const key = args[i].slice(2);
    out[key] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
  }
  return out;
}
function exact(a, b, label) { need(P.canonical(a) === I.canonical(b), `${label} production/independent mismatch`); }
function readLines(file) { return fs.readFileSync(file, "utf8").split(/\r?\n/).map((x) => x.trim()).filter(Boolean); }
function fixtureApply(kind, triggerPly) {
  return (state, move, context) => {
    const applied = E.applyMove(state, move, context.recording);
    const next = copy(applied.state);
    if (context.ply === triggerPly) {
      next.winner = 0;
      next.reason = kind === "ENGINE-GUARD" ? "relay-limit" : "front-empty";
    }
    return { state: next, events: applied.events };
  };
}
function checkFirewall(identity, sets) {
  const collisions = [];
  if (identity.seed && sets.seed.has(identity.seed)) collisions.push("seed");
  if (identity.trajectory && sets.trajectory.has(identity.trajectory)) collisions.push("trajectory");
  if (identity.opening && sets.opening.has(identity.opening)) collisions.push("opening-prefix");
  if (identity.root && sets.root.has(identity.root)) collisions.push("raw-root");
  return { pass: collisions.length === 0, collisions };
}
function forbiddenScientificKey(key) {
  return /(^|_)(endpoint|effect|pvalue|p_value|generalization|counterexample|paireddifference|paired_direction)/i.test(key);
}
function assertNoForbiddenKeys(value, trail = []) {
  if (value === null || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    need(!forbiddenScientificKey(key), `forbidden scientific output key ${[...trail, key].join(".")}`);
    assertNoForbiddenKeys(child, [...trail, key]);
  }
}
function summarizeSource(source) {
  return {
    seed: source.seed,
    domainId: source.domainId,
    candidateStatus: source.candidateStatus,
    stopReason: source.stopReason,
    moveCount: source.moveCount,
    pairComplete: source.pairComplete,
    scientificTerminal: source.scientificTerminal,
    engineGuard: source.engineGuard,
    openingPrefixAvailable: source.openingPrefixAvailable,
    anchorPlies: {
      namua: source.anchors.namua ? source.anchors.namua.ply : null,
      mtaji: source.anchors.mtaji ? source.anchors.mtaji.ply : null
    }
  };
}

function main() {
  const args = parseArgs();
  const output = path.resolve(args.output || path.join(ROOT, "artifacts/sfcdft3-stage0/STUDY_3_STAGE_0_TECHNICAL_RESULT.json"));
  const study2Manifest = JSON.parse(fs.readFileSync(path.join(STUDY2_DIR, "MANIFEST.json"), "utf8"));
  const study1Manifest = JSON.parse(fs.readFileSync(path.join(STUDY1_DIR, "MANIFEST.json"), "utf8"));
  need(study2Manifest.identityCoreSha256 === "7961d01342e35f3e70f82e5688f585be08ef99827b905dcccf032d285994abfc", "Study2 firewall core mismatch");
  need(study1Manifest.identityCoreSha256 === "8836ce233aa330538defd7271d4e69389526fafb42f605b542eebf9996522430", "Study1 firewall core mismatch");
  need(study2Manifest.scientificSeedReplay === false && study2Manifest.scientificEndpointLoaded === false, "Study2 firewall boundary mismatch");

  const study1Sets = {
    seed: new Set(Array.from({ length: 384 }, (_, i) => 40311001 + i)),
    trajectory: new Set(readLines(path.join(STUDY1_DIR, "sourceTrajectorySha256.txt"))),
    opening: new Set(readLines(path.join(STUDY1_DIR, "openingPrefixSha256.txt"))),
    root: new Set(readLines(path.join(STUDY1_DIR, "rootRawSha256.txt")))
  };
  const study2Sets = {
    seed: new Set(Array.from({ length: 384 }, (_, i) => 40411001 + i)),
    trajectory: new Set(readLines(path.join(STUDY2_DIR, "SOURCE_TRAJECTORY_SHA256.txt"))),
    opening: new Set(readLines(path.join(STUDY2_DIR, "OPENING_PREFIX_SHA256.txt"))),
    root: new Set(readLines(path.join(STUDY2_DIR, "RAW_ROOT_SHA256.txt")))
  };

  const scan = {
    seedsScanned: 0,
    statusCounts: {},
    candidateByDomain: {},
    firstRootShortage: null,
    firstEngineGuard: null
  };
  for (let seed = TECH_START; seed <= TECH_END; seed += 1) {
    const prod = P.replaySource(E, STAGE_ID, seed, 240);
    const independent = I.replaySource(E, STAGE_ID, seed, 240);
    exact(prod, independent, `technical seed ${seed}`);
    scan.seedsScanned += 1;
    scan.statusCounts[prod.candidateStatus] = (scan.statusCounts[prod.candidateStatus] || 0) + 1;
    if (prod.candidateStatus === "CANDIDATE-PAIR-COMPLETE" && !scan.candidateByDomain[prod.domainId]) {
      scan.candidateByDomain[prod.domainId] = summarizeSource(prod);
    }
    if (prod.candidateStatus === "NO-CANDIDATE-ROOT-SHORTAGE" && !scan.firstRootShortage) scan.firstRootShortage = summarizeSource(prod);
    if (prod.candidateStatus === "NO-CANDIDATE-ENGINE-GUARD-CENSORING" && !scan.firstEngineGuard) scan.firstEngineGuard = summarizeSource(prod);
    if (Object.keys(scan.candidateByDomain).length === 4 && scan.firstRootShortage) break;
  }
  need(Object.keys(scan.candidateByDomain).length === 4, "technical scan did not find candidate fixture in all four domains");
  need(scan.firstRootShortage, "technical scan did not find root-shortage fixture");
  for (const fixture of Object.values(scan.candidateByDomain)) {
    need(fixture.pairComplete === true && fixture.stopReason === "PAIR-COMPLETE", `candidate fixture stop mismatch ${fixture.domainId}`);
    need(fixture.moveCount === Math.max(fixture.anchorPlies.namua, fixture.anchorPlies.mtaji), `candidate post-anchor continuation ${fixture.domainId}`);
    need(fixture.openingPrefixAvailable === true, `candidate opening prefix unavailable ${fixture.domainId}`);
  }

  const syntheticSeed = TECH_START;
  const guardP = P.replaySource(E, STAGE_ID, syntheticSeed, 240, { applySelectedMove: fixtureApply("ENGINE-GUARD", 1) });
  const guardI = I.replaySource(E, STAGE_ID, syntheticSeed, 240, { applySelectedMove: fixtureApply("ENGINE-GUARD", 1) });
  exact(guardP, guardI, "synthetic engine guard");
  need(guardP.candidateStatus === "NO-CANDIDATE-ENGINE-GUARD-CENSORING", "engine guard classification mismatch");
  need(guardP.stopReason === "ENGINE-GUARD" && guardP.engineGuard?.kind === "relay-limit", "engine guard stop metadata mismatch");
  need(guardP.scientificTerminal === false && guardP.engineWinnerPresentAtStop === true, "relay-limit winner leaked into scientific terminal");
  need(guardP.pairComplete === false && guardP.moveCount === 1, "engine guard fixture pair/move count mismatch");

  const naturalP = P.replaySource(E, STAGE_ID, syntheticSeed, 240, { applySelectedMove: fixtureApply("NATURAL-TERMINAL", 1) });
  const naturalI = I.replaySource(E, STAGE_ID, syntheticSeed, 240, { applySelectedMove: fixtureApply("NATURAL-TERMINAL", 1) });
  exact(naturalP, naturalI, "synthetic natural terminal");
  need(naturalP.candidateStatus === "NO-CANDIDATE-ROOT-SHORTAGE", "natural terminal classification mismatch");
  need(naturalP.stopReason === "NATURAL-TERMINAL" && naturalP.scientificTerminal === true, "natural terminal semantics mismatch");

  let maxPlyFixture = null;
  for (let seed = TECH_START; seed <= TECH_END; seed += 1) {
    const prod = P.replaySource(E, STAGE_ID, seed, 5);
    const independent = I.replaySource(E, STAGE_ID, seed, 5);
    exact(prod, independent, `max-ply technical seed ${seed}`);
    if (prod.stopReason === "MAX-SOURCE-PLY" && prod.candidateStatus === "NO-CANDIDATE-ROOT-SHORTAGE") {
      maxPlyFixture = summarizeSource(prod);
      break;
    }
  }
  need(maxPlyFixture, "max-ply root shortage fixture unavailable");
  need(maxPlyFixture.moveCount === 5, "max-ply fixture moveCount mismatch");

  let malformedProdRejected = false;
  let malformedIndependentRejected = false;
  try { P.openingPrefix(["x"], true); } catch { malformedProdRejected = true; }
  try { I.openingPrefix(["x"], true); } catch { malformedIndependentRejected = true; }
  need(malformedProdRejected && malformedIndependentRejected, "malformed complete-candidate identity did not fail closed");

  const study1Trajectory = readLines(path.join(STUDY1_DIR, "sourceTrajectorySha256.txt"))[0];
  const study2Trajectory = readLines(path.join(STUDY2_DIR, "SOURCE_TRAJECTORY_SHA256.txt"))[0];
  const study1Collision = checkFirewall({ trajectory: study1Trajectory }, study1Sets);
  const study2Collision = checkFirewall({ trajectory: study2Trajectory }, study2Sets);
  need(!study1Collision.pass && study1Collision.collisions.includes("trajectory"), "Study1 trajectory collision not rejected");
  need(!study2Collision.pass && study2Collision.collisions.includes("trajectory"), "Study2 trajectory collision not rejected");
  need(!checkFirewall({ seed: 40311001 }, study1Sets).pass, "Study1 seed collision not rejected");
  need(!checkFirewall({ seed: 40411001 }, study2Sets).pass, "Study2 seed collision not rejected");

  const fixtures = {
    candidateStopsAtPairComplete: true,
    postCandidateContinuationCountZero: true,
    naturalTerminalIncompleteIsRootShortage: true,
    maxPlyIncompleteIsRootShortage: true,
    relayLimitBeforeCompleteIsEngineGuardCensoring: true,
    relayLimitWinnerNotScientificTerminal: true,
    candidateFirst16PrefixRequired: true,
    productionIndependentDecisionPrefixExact: true,
    study1IdentityCollisionRejected: true,
    study2IdentityCollisionRejected: true,
    malformedIdentityFailClosed: true,
    scientificEffectOutputAbsent: true
  };

  const deterministic = {
    schemaVersion: 1,
    studyId: "SFCDFT-STUDY3",
    stageId: STAGE_ID,
    evidenceClass: "TECHNICAL-FIXTURE",
    decision: "STAGE0-PASS",
    scientificSeedReads: 0,
    scientificOutcomeGenerated: false,
    technicalSeedRange: { start: TECH_START, end: TECH_END },
    firewallBindings: {
      study1IdentityCoreSha256: study1Manifest.identityCoreSha256,
      study2IdentityCoreSha256: study2Manifest.identityCoreSha256,
      study2SourceRecords: study2Manifest.identityCounts.sourceRecords,
      study2TrajectoryCount: study2Manifest.identityCounts.uniqueSourceTrajectorySha256,
      study2OpeningPrefixCount: study2Manifest.identityCounts.uniqueOpeningPrefixSha256,
      study2RawRootCount: study2Manifest.identityCounts.uniqueRawRootSha256
    },
    scan,
    syntheticFixtures: {
      engineGuard: summarizeSource(guardP),
      naturalTerminal: summarizeSource(naturalP),
      maxPly: maxPlyFixture
    },
    fixtures,
    stage1ScientificSeedAccessAuthorized: false,
    stage2ScientificSeedAccessAuthorized: false,
    mainIntegrationAuthorized: false
  };
  assertNoForbiddenKeys(deterministic);
  const deterministicCoreSha256 = sha256(deterministic);
  const result = {
    ...deterministic,
    deterministicCoreSha256,
    workflowProvenance: {
      runId: process.env.GITHUB_RUN_ID || null,
      runAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
      headSha: process.env.GITHUB_SHA || null
    }
  };

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ event: "SFCDFT3-STAGE0-PASS", deterministicCoreSha256, seedsScanned: scan.seedsScanned, candidateDomains: Object.keys(scan.candidateByDomain).length })}\n`);
}

main();
