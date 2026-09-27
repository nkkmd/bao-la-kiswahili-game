"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

function need(value, message) { if (!value) throw new Error(message); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function sha256Bytes(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function sha256Text(value) { return sha256Bytes(Buffer.from(String(value), "utf8")); }
function fileSha256(file) { return sha256Bytes(fs.readFileSync(file)); }
function setDigest(values) { return sha256Text([...values].sort().join("\n")); }

function addIdentityRows(rows, sets) {
  for (const row of rows || []) {
    if (row.sourceSeed !== undefined && row.sourceSeed !== null) sets.seed.add(String(row.sourceSeed));
    if (row.sourceTrajectorySha256) sets.trajectory.add(row.sourceTrajectorySha256);
    if (row.openingPrefixSha256) sets.prefix.add(row.openingPrefixSha256);
    const rootRows = Array.isArray(row.checkpointRoots) ? row.checkpointRoots : (Array.isArray(row.reachableRoots) ? row.reachableRoots : []);
    for (const cp of rootRows) if (cp && cp.rootRawSha256) sets.root.add(cp.rootRawSha256);
  }
}

function loadIdentityFile(root, meta, sets, label) {
  const file = path.join(root, meta.identityFile || path.basename(meta.path || ""));
  need(fs.existsSync(file), `${label} identity file missing: ${file}`);
  const expected = meta.identityFileSha256 || meta.fileSha256;
  need(fileSha256(file) === expected, `${label} identity file hash mismatch`);
  const obj = JSON.parse(fs.readFileSync(file, "utf8"));
  need(obj.scientificOutcomeFieldsRetained === false, `${label} retains scientific outcome fields`);
  need(Array.isArray(obj.identityRows), `${label} identityRows missing`);
  need(obj.identityRows.length === meta.identityRowCount, `${label} identity row count mismatch ${obj.identityRows.length}`);
  addIdentityRows(obj.identityRows, sets);
  return { identityRowCount: obj.identityRows.length, fileSha256: expected };
}

function loadRepositoryIdentity(repoRoot, meta, sets, label) {
  const file = path.join(repoRoot, meta.path);
  need(fs.existsSync(file), `${label} repository identity file missing`);
  need(fileSha256(file) === meta.fileSha256, `${label} repository identity file hash mismatch`);
  const obj = JSON.parse(fs.readFileSync(file, "utf8"));
  need(obj.scientificOutcomeFieldsRetained === false, `${label} retains scientific outcome fields`);
  need(Array.isArray(obj.identityRows) && obj.identityRows.length === meta.identityRowCount, `${label} identity row count mismatch`);
  addIdentityRows(obj.identityRows, sets);
  return { identityRowCount: obj.identityRows.length, fileSha256: meta.fileSha256 };
}

function loadG401(root, meta, sets) {
  const dir = path.join(root, meta.artifactBlock);
  need(fs.existsSync(dir), "G4-01 GCLD artifact block missing");
  const files = fs.readdirSync(dir).filter((name) => /^\d+\.json$/.test(name)).sort((a, b) => Number(a.slice(0, -5)) - Number(b.slice(0, -5)));
  need(files.length === meta.sourceRowCount, `G4-01 source row count mismatch ${files.length}`);
  const projected = [];
  const sourceSeeds = new Set(), trajectories = new Set(), roots = new Set();
  for (const name of files) {
    const obj = JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
    const checkpoints = (obj.checkpoints || []).map((cp) => cp === null ? null : ({ ply: cp.ply, rawStateSha256: cp.rawStateSha256 }));
    projected.push({ slotSeed: obj.slotSeed, effectiveSeed: obj.effectiveSeed, trajectorySha256: obj.trajectorySha256, checkpoints });
    const sourceSeed = obj.effectiveSeed ?? obj.slotSeed;
    sourceSeeds.add(String(sourceSeed)); sets.seed.add(String(sourceSeed));
    if (obj.trajectorySha256) { trajectories.add(obj.trajectorySha256); sets.trajectory.add(obj.trajectorySha256); }
    for (const cp of checkpoints) if (cp && cp.rawStateSha256) { roots.add(cp.rawStateSha256); sets.root.add(cp.rawStateSha256); }
  }
  projected.sort((a, b) => a.slotSeed - b.slotSeed || a.effectiveSeed - b.effectiveSeed);
  const digest = sha256Text(stable(projected));
  need(digest === meta.canonicalIdentityProjectionSha256, "G4-01 canonical identity projection digest mismatch");
  return { sourceRowCount: files.length, canonicalIdentityProjectionSha256: digest, sourceSeedUniqueCount: sourceSeeds.size, trajectoryUniqueCount: trajectories.size, rootUniqueCount: roots.size };
}

function addExcludedRanges(firewall, sets) {
  for (const entry of firewall.excludedSeedNamespaces || []) {
    const [start, end] = String(entry.range).split("..").map(Number);
    need(Number.isSafeInteger(start) && Number.isSafeInteger(end) && end >= start, `bad excluded range ${entry.range}`);
    for (let seed = start; seed <= end; seed += 1) sets.seed.add(String(seed));
  }
}

function materialize({ repoRoot, upstreamRoot, firewall }) {
  need(firewall.status === "FROZEN-PRE-FRESH", "Stage2 firewall not frozen");
  need(firewall.scientificOutcomeFieldsRetained === false, "Stage2 firewall retains outcome fields");
  need(firewall.freshStage2SeedAccessDuringMaterialization === false, "Stage2 firewall materialization allows fresh access");
  const sets = { seed: new Set(), trajectory: new Set(), prefix: new Set(), root: new Set() };
  addExcludedRanges(firewall, sets);
  const sources = firewall.identitySources;
  const verified = {};

  verified.g3_10_stage1 = loadRepositoryIdentity(repoRoot, sources.g3_10_stage1, sets, "G3-10 Stage1");
  verified.g3_10_stage2 = loadRepositoryIdentity(repoRoot, sources.g3_10_stage2, sets, "G3-10 Stage2");
  verified.g4_01_stage1r_gcld = loadG401(path.join(upstreamRoot, "g4-01"), sources.g4_01_stage1r_gcld, sets);
  verified.g4_04_stage1 = loadIdentityFile(path.join(upstreamRoot, "g4-04-stage1"), sources.g4_04_stage1, sets, "G4-04 Stage1");
  verified.g4_04_stage2 = loadIdentityFile(path.join(upstreamRoot, "g4-04-stage2"), sources.g4_04_stage2, sets, "G4-04 Stage2");
  verified.g4_07_stage1 = loadIdentityFile(path.join(upstreamRoot, "g4-07-stage1"), sources.g4_07_stage1, sets, "G4-07 Stage1");
  verified.g4_07_stage2 = loadIdentityFile(path.join(upstreamRoot, "g4-07-stage2"), sources.g4_07_stage2, sets, "G4-07 Stage2");
  verified.g4_08_stage1_v3 = loadIdentityFile(path.join(upstreamRoot, "g4-08-stage1-v3"), sources.g4_08_stage1_v3, sets, "G4-08 Stage1 v3");

  const summary = {
    verified,
    setSizes: { seed: sets.seed.size, trajectory: sets.trajectory.size, prefix: sets.prefix.size, root: sets.root.size },
    setDigests: { seed: setDigest(sets.seed), trajectory: setDigest(sets.trajectory), prefix: setDigest(sets.prefix), root: setDigest(sets.root) },
    limitations: firewall.unavailableIdentityClasses,
    scientificOutcomeFieldsRetained: false,
    freshStage2SeedAccessDuringMaterialization: false,
  };
  summary.firewallDigestSha256 = sha256Text(stable(summary));
  return { sets, summary };
}

module.exports = { materialize, stable, sha256Text, fileSha256 };
