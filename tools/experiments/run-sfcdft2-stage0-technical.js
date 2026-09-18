#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const P = require("./lib/sfcdft2-production.js");
const I = require("./lib/sfcdft2-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_2_STAGE_0_TECHNICAL_SPEC.json");
const FW_DIR = path.join(ROOT, "doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study1");
const SCI_STAGE_ID = "SFCDFT2-S1-COMPATIBILITY-2026-09-18-v1";
const EXPECTED_FW_CORE = "8836ce233aa330538defd7271d4e69389526fafb42f605b542eebf9996522430";

function need(v, m) { if (!v) throw new Error(m); }
function canonical(v) {
  if (Array.isArray(v)) return `[${v.map(canonical).join(",")}]`;
  if (v && typeof v === "object") return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`;
  return JSON.stringify(v);
}
function digest(v) { return crypto.createHash("sha256").update(typeof v === "string" ? v : canonical(v), "utf8").digest("hex"); }
function parseArgs() {
  const args = process.argv.slice(2), out = {};
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith("--")) continue;
    const key = args[i].slice(2);
    out[key] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : true;
  }
  return out;
}
function readSet(file) {
  return new Set(fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean));
}
function sourceView(x) {
  return {
    stageId: x.stageId,
    seed: x.seed,
    policyId: x.policyId,
    familyId: x.familyId,
    domainId: x.domainId,
    trajectorySha256: x.trajectorySha256,
    candidateStatus: x.candidateStatus,
    pairComplete: x.pairComplete,
    openingPrefixAvailable: x.openingPrefixAvailable,
    openingPrefixLength: x.openingPrefixLength,
    openingPrefixSha256: x.openingPrefixSha256,
    moveCount: x.moveCount,
    terminal: x.terminal,
    namua: x.anchors && x.anchors.namua ? {ply:x.anchors.namua.ply,phase:x.anchors.namua.phase,rawStateSha256:x.anchors.namua.rawStateSha256} : null,
    mtaji: x.anchors && x.anchors.mtaji ? {ply:x.anchors.mtaji.ply,phase:x.anchors.mtaji.phase,rawStateSha256:x.anchors.mtaji.rawStateSha256} : null
  };
}
function inRange(seed, a, b) { return Number.isInteger(seed) && seed >= a && seed <= b; }
function loadFirewall() {
  const manifest = JSON.parse(fs.readFileSync(path.join(FW_DIR, "MANIFEST.json"), "utf8"));
  need(manifest.identityCoreSha256 === EXPECTED_FW_CORE, "Study1 firewall identity core mismatch");
  need(manifest.scientificOutcomeFieldsRetained === false, "Study1 firewall contains scientific outcome fields");
  need(manifest.replayOrSeedRereadPerformed === false, "Study1 firewall recovery replayed seeds");
  const trajectories = readSet(path.join(FW_DIR, "sourceTrajectorySha256.txt"));
  const prefixes = readSet(path.join(FW_DIR, "openingPrefixSha256.txt"));
  const roots = readSet(path.join(FW_DIR, "rootRawSha256.txt"));
  need(trajectories.size === 375, "Study1 trajectory firewall count mismatch");
  need(prefixes.size === 375, "Study1 prefix firewall count mismatch");
  need(roots.size === 660, "Study1 root firewall count mismatch");
  return {manifest, trajectories, prefixes, roots};
}
function collisions(fw, identity) {
  const hits = [];
  const seed = identity.seed;
  if (inRange(seed,40311001,40311384) || inRange(seed,41311001,41311384) || inRange(seed,40321001,40321768) || inRange(seed,41321001,41321768)) hits.push("STUDY1-SEED");
  if (identity.trajectorySha256 && fw.trajectories.has(identity.trajectorySha256)) hits.push("STUDY1-TRAJECTORY");
  if (identity.openingPrefixSha256 && fw.prefixes.has(identity.openingPrefixSha256)) hits.push("STUDY1-OPENING-PREFIX");
  for (const r of [identity.namuaRawSha256, identity.mtajiRawSha256]) if (r && fw.roots.has(r)) hits.push("STUDY1-RAW-ROOT");
  return [...new Set(hits)].sort();
}
function validateCandidateIdentity(x) {
  need(x.candidateStatus === "CANDIDATE-PAIR-COMPLETE", "candidate status required");
  need(x.pairComplete === true, "candidate pair must be complete");
  need(x.openingPrefixAvailable === true && x.openingPrefixLength === 16 && typeof x.openingPrefixSha256 === "string", "candidate first16 prefix invalid");
  need(x.namua && typeof x.namua.rawStateSha256 === "string", "candidate Namua root missing");
  need(x.mtaji && typeof x.mtaji.rawStateSha256 === "string", "candidate Mtaji root missing");
  return true;
}
function endpointAgreement(prod, ind) {
  const sourceP = {
    seed: prod.seed,
    trajectorySha256: prod.trajectorySha256,
    candidateStatus: prod.candidateStatus,
    openingPrefixAvailable: prod.openingPrefixAvailable,
    openingPrefixLength: prod.openingPrefixLength,
    openingPrefixSha256: prod.openingPrefixSha256
  };
  const sourceI = {
    seed: ind.seed,
    trajectorySha256: ind.trajectorySha256,
    candidateStatus: ind.candidateStatus,
    openingPrefixAvailable: ind.openingPrefixAvailable,
    openingPrefixLength: ind.openingPrefixLength,
    openingPrefixSha256: ind.openingPrefixSha256
  };
  const pairs = [
    [prod.anchors.namua, ind.anchors.namua, "namua"],
    [prod.anchors.mtaji, ind.anchors.mtaji, "mtaji"]
  ];
  for (const [rp, ri, label] of pairs) {
    const mp = P.endpointPair(E, rp, sourceP);
    const mi = I.endpointPair(E, ri, sourceI);
    need(canonical(mp) === canonical(mi), `${label} endpoint production/independent mismatch`);
  }
  return true;
}
function main() {
  const args = parseArgs();
  const output = path.resolve(args.output || "sfcdft2-stage0-result.json");
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  need(spec.studyId === "SFCDFT-STUDY2", "Study2 Stage0 spec mismatch");
  need(spec.freshScientificSeedAccessAuthorized === false, "Stage0 cannot authorize scientific seed access");
  const fw = loadFirewall();
  const start = spec.technicalFixtureNamespace.seedStart;
  const end = spec.technicalFixtureNamespace.seedEnd;

  const fixtures = {
    shortNoCandidate: null,
    longNoCandidate: null,
    candidatesByDomain: {}
  };
  let scanned = 0;
  for (let seed = start; seed <= end; seed++) {
    need(!inRange(seed,40411001,40411384) && !inRange(seed,41411001,41411384) && !inRange(seed,40421001,40421768) && !inRange(seed,41421001,41421768), "technical fixture overlapped scientific seed range");
    const prod = P.replaySource(E, SCI_STAGE_ID, seed, 240);
    const ind = I.replaySource(E, SCI_STAGE_ID, seed, 240);
    const pv = sourceView(prod), iv = sourceView(ind);
    need(canonical(pv) === canonical(iv), `source classification mismatch seed=${seed}`);
    scanned++;

    const hits = collisions(fw, {
      seed,
      trajectorySha256: pv.trajectorySha256,
      openingPrefixSha256: pv.openingPrefixSha256,
      namuaRawSha256: pv.namua && pv.namua.rawStateSha256,
      mtajiRawSha256: pv.mtaji && pv.mtaji.rawStateSha256
    });
    if (hits.length) continue;

    if (!pv.pairComplete && pv.moveCount < 16 && !fixtures.shortNoCandidate) {
      need(pv.candidateStatus === "NO-CANDIDATE-ROOT-SHORTAGE", "short trajectory not classified as no-candidate");
      need(pv.openingPrefixAvailable === false, "short no-candidate unexpectedly has opening prefix");
      need(pv.openingPrefixLength === pv.moveCount, "short no-candidate prefix length must equal move count");
      need(pv.openingPrefixSha256 === null, "short no-candidate prefix hash must be null");
      fixtures.shortNoCandidate = {seed, domainId:pv.domainId, moveCount:pv.moveCount, trajectoryDigest:pv.trajectorySha256};
    }
    if (!pv.pairComplete && pv.moveCount >= 16 && !fixtures.longNoCandidate) {
      need(pv.candidateStatus === "NO-CANDIDATE-ROOT-SHORTAGE", "long incomplete trajectory not classified as no-candidate");
      need(pv.openingPrefixAvailable === true && pv.openingPrefixLength === 16 && typeof pv.openingPrefixSha256 === "string", "long no-candidate prefix metadata invalid");
      fixtures.longNoCandidate = {seed, domainId:pv.domainId, moveCount:pv.moveCount, trajectoryDigest:pv.trajectorySha256, openingPrefixDigest:pv.openingPrefixSha256};
    }
    if (pv.pairComplete && !fixtures.candidatesByDomain[pv.domainId]) {
      validateCandidateIdentity(pv);
      endpointAgreement(prod, ind);
      fixtures.candidatesByDomain[pv.domainId] = {
        seed,
        moveCount: pv.moveCount,
        trajectoryDigest: pv.trajectorySha256,
        openingPrefixDigest: pv.openingPrefixSha256,
        endpointProductionIndependentAgreement: true
      };
    }
    if (fixtures.shortNoCandidate && fixtures.longNoCandidate && Object.keys(fixtures.candidatesByDomain).length === 4) break;
  }

  need(fixtures.shortNoCandidate, "technical namespace did not provide short-trajectory no-candidate fixture");
  need(fixtures.longNoCandidate, "technical namespace did not provide long no-candidate fixture");
  need(Object.keys(fixtures.candidatesByDomain).length === 4, "technical namespace did not cover four candidate domains");

  const firstTrajectory = fw.trajectories.values().next().value;
  const firstPrefix = fw.prefixes.values().next().value;
  const firstRoot = fw.roots.values().next().value;
  need(collisions(fw,{seed:49029991,trajectorySha256:firstTrajectory}).includes("STUDY1-TRAJECTORY"), "known Study1 trajectory collision not rejected");
  need(collisions(fw,{seed:49029992,openingPrefixSha256:firstPrefix}).includes("STUDY1-OPENING-PREFIX"), "known Study1 prefix collision not rejected");
  need(collisions(fw,{seed:49029993,namuaRawSha256:firstRoot}).includes("STUDY1-RAW-ROOT"), "known Study1 root collision not rejected");
  need(collisions(fw,{seed:40311019}).includes("STUDY1-SEED"), "known Study1 seed collision not rejected");

  let malformedRejected = false;
  try {
    validateCandidateIdentity({candidateStatus:"CANDIDATE-PAIR-COMPLETE",pairComplete:true,openingPrefixAvailable:false,openingPrefixLength:0,openingPrefixSha256:null,namua:{rawStateSha256:"x"},mtaji:{rawStateSha256:"y"}});
  } catch { malformedRejected = true; }
  need(malformedRejected, "malformed candidate identity did not fail closed");

  const result = {
    schemaVersion: 1,
    studyId: "SFCDFT-STUDY2",
    stageId: spec.stageId,
    evidenceClass: "TECHNICAL-FIXTURE",
    decision: "STAGE0-PASS",
    scientificSeedReads: 0,
    scientificOutcomeGenerated: false,
    technicalSeedRange: {seedStart:start,seedEnd:end,scanned},
    fixtureCoverage: fixtures,
    firewallChecks: {
      study1IdentityCoreSha256: EXPECTED_FW_CORE,
      trajectoryCount: fw.trajectories.size,
      openingPrefixCount: fw.prefixes.size,
      rawRootCount: fw.roots.size,
      knownTrajectoryCollisionRejected: true,
      knownOpeningPrefixCollisionRejected: true,
      knownRawRootCollisionRejected: true,
      knownSeedCollisionRejected: true
    },
    malformedCandidateRejected: true,
    forbiddenScientificOutputsGenerated: false,
    endpointValuesRetained: false,
    pairedEffectDirectionRetained: false,
    pValueRetained: false,
    generalizationDecisionRetained: false,
    counterexampleDecisionRetained: false,
    peakRssBytes: process.memoryUsage().rss
  };
  result.deterministicCoreSha256 = digest(result);
  fs.writeFileSync(output, JSON.stringify(result,null,2)+"\n", "utf8");
  process.stdout.write(JSON.stringify({event:"SFCDFT2-STAGE0-PASS",scanned,deterministicCoreSha256:result.deterministicCoreSha256})+"\n");
}

main();
