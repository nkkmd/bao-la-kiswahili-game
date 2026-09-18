#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = path.resolve(__dirname, "../..");
const MANIFEST = path.join(ROOT, "doc/research-generation-4/g4-02-prerequisites/FRESHNESS_FIREWALL_MANIFEST.json");
const G304 = path.join(ROOT, "doc/branch-expansion-compression-transition/prereg/UPSTREAM_IDENTITY_FIREWALL.json");

function need(x, m) { if (!x) throw new Error(m); }
function sha256Bytes(buf) { return crypto.createHash("sha256").update(buf).digest("hex"); }

function loadBloom(spec) {
  const file = path.join(ROOT, spec.path);
  const bytes = Buffer.from(fs.readFileSync(file, "utf8").trim(), "base64");
  need(bytes.length * 8 === spec.mBits, `Bloom bit length mismatch: ${spec.path}`);
  need(sha256Bytes(bytes) === spec.decodedBitsetSha256, `Bloom SHA-256 mismatch: ${spec.path}`);
  return bytes;
}

function bloomPositive(bytes, spec, label, identity) {
  need(/^[0-9a-f]{64}$/.test(identity), `bad identity for ${label}`);
  for (let i = 0; i < spec.k; i += 1) {
    const digest = crypto.createHash("sha256")
      .update(`G4-01-SFCDF-BLOOM-v1|${label}|${i}|${identity}`, "utf8")
      .digest();
    const idx = Number(digest.readBigUInt64BE(0) % BigInt(spec.mBits));
    if ((bytes[Math.floor(idx / 8)] & (1 << (idx % 8))) === 0) return false;
  }
  return true;
}

function exactSet(xs) { return new Set(xs || []); }

function buildFirewall() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  const g304 = JSON.parse(fs.readFileSync(G304, "utf8"));
  need(manifest.status === "MATERIALIZED-BEFORE-G4-02-SCIENTIFIC-SEED-ACCESS", "manifest status mismatch");
  need(manifest.scientificSeedAccessBeforeMaterialization === 0, "pre-materialization scientific access must be zero");
  need(manifest.g304IdentityFirewall.identityCoreSha256 === g304.identityCoreSha256, "G3-04 identity core mismatch");
  need(g304.scientificOutcomeFieldsRetained === false && g304.g304ScientificOutcomeFieldsRetained === false, "G3-04 firewall is not identity-only");

  const trajectoryBits = loadBloom(manifest.g401SfcdfCompatibilityFirewall.trajectoryBloom);
  const rootBits = loadBloom(manifest.g401SfcdfCompatibilityFirewall.rootBloom);
  const g3Roots = exactSet(g304.identitySets.rootRawSha256);
  const g3Trajectories = exactSet(g304.identitySets.sourceTrajectorySha256);
  const g3Prefixes = exactSet(g304.identitySets.openingPrefixSha256);
  const seedRange = manifest.g401SfcdfCompatibilityFirewall.seedExclusion;

  function classify(candidate) {
    need(candidate && Number.isInteger(candidate.seed), "candidate seed required");
    need(/^[0-9a-f]{64}$/.test(candidate.sourceTrajectorySha256 || ""), "candidate trajectory identity required");
    need(/^[0-9a-f]{64}$/.test(candidate.rootRawSha256 || ""), "candidate root identity required");
    need(/^[0-9a-f]{64}$/.test(candidate.openingPrefixSha256 || ""), "candidate opening-prefix identity required");

    const reasons = [];
    if (candidate.seed >= seedRange.start && candidate.seed <= seedRange.end) reasons.push("G4-01-SEED-OVERLAP");
    if (g3Roots.has(candidate.rootRawSha256)) reasons.push("G3-04-ROOT-OVERLAP");
    if (g3Trajectories.has(candidate.sourceTrajectorySha256)) reasons.push("G3-04-TRAJECTORY-OVERLAP");
    if (g3Prefixes.has(candidate.openingPrefixSha256)) reasons.push("G3-04-OPENING-PREFIX-OVERLAP");
    if (bloomPositive(trajectoryBits, manifest.g401SfcdfCompatibilityFirewall.trajectoryBloom, "trajectory", candidate.sourceTrajectorySha256)) reasons.push("G4-01-TRAJECTORY-BLOOM-POSITIVE");
    if (bloomPositive(rootBits, manifest.g401SfcdfCompatibilityFirewall.rootBloom, "root", candidate.rootRawSha256)) reasons.push("G4-01-ROOT-BLOOM-POSITIVE");
    return { eligible: reasons.length === 0, reasons };
  }

  return { manifest, g304, classify, bloomPositive, trajectoryBits, rootBits };
}

function selfTest() {
  const fw = buildFirewall();
  const positives = [
    {
      kind: "trajectory",
      identity: "4069f9f028f5acf490f6ddeb591c2d0923027602cfd753890e9329ca25d765f4"
    },
    {
      kind: "trajectory",
      identity: "5da1a1962bfd7ee8842fe483543ca4a95c78eb01d84a815c11d09092d1bad128"
    },
    {
      kind: "root",
      identity: "8a1aae7731a499404235e79e5877f38840bc9cfb50802f669557956156c5d49f"
    },
    {
      kind: "root",
      identity: "1992910cf9d2dd5508077df0b58147b6b25c0035b5f32432a5b48dda535a744a"
    }
  ];
  for (const p of positives) {
    const spec = p.kind === "trajectory"
      ? fw.manifest.g401SfcdfCompatibilityFirewall.trajectoryBloom
      : fw.manifest.g401SfcdfCompatibilityFirewall.rootBloom;
    const bits = p.kind === "trajectory" ? fw.trajectoryBits : fw.rootBits;
    need(fw.bloomPositive(bits, spec, p.kind, p.identity), `known G4-01 ${p.kind} identity not positive`);
  }

  const g3Root = fw.g304.identitySets.rootRawSha256[0];
  const g3Trajectory = fw.g304.identitySets.sourceTrajectorySha256[0];
  const g3Prefix = fw.g304.identitySets.openingPrefixSha256[0];
  const c = fw.classify({
    seed: 40211001,
    rootRawSha256: g3Root,
    sourceTrajectorySha256: g3Trajectory,
    openingPrefixSha256: g3Prefix
  });
  need(c.eligible === false, "historical-overlap fixture unexpectedly eligible");
  need(c.reasons.includes("G4-01-SEED-OVERLAP"), "seed overlap gate missing");
  need(c.reasons.includes("G3-04-ROOT-OVERLAP"), "G3-04 root gate missing");
  need(c.reasons.includes("G3-04-TRAJECTORY-OVERLAP"), "G3-04 trajectory gate missing");
  need(c.reasons.includes("G3-04-OPENING-PREFIX-OVERLAP"), "G3-04 prefix gate missing");

  process.stdout.write(JSON.stringify({
    event: "G4-02-FRESHNESS-FIREWALL-PASS",
    g304IdentityCounts: fw.g304.identityCounts,
    g401TrajectoryInserted: fw.manifest.g401SfcdfCompatibilityFirewall.trajectoryBloom.insertedUniqueCount,
    g401RootInserted: fw.manifest.g401SfcdfCompatibilityFirewall.rootBloom.insertedUniqueCount,
    g401OpeningPrefixDisposition: fw.manifest.g401SfcdfCompatibilityFirewall.openingPrefixIdentity.disposition
  }) + "\n");
}

if (require.main === module) selfTest();
module.exports = { buildFirewall };
