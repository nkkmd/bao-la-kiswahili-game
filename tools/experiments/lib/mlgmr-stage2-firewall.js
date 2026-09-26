"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

function need(value, message) { if (!value) throw new Error(message); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
}
function sha256Bytes(bytes) { return crypto.createHash("sha256").update(bytes).digest("hex"); }
function sha256File(file) { return sha256Bytes(fs.readFileSync(file)); }
function digest(value) { return sha256Bytes(Buffer.from(stable(value), "utf8")); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function digestStringSet(values) { return sha256Bytes(Buffer.from([...new Set(values)].sort().join("\n") + "\n", "utf8")); }

function emptyFirewall() {
  return { seeds: new Set(), trajectory: new Set(), prefix: new Set(), root: new Set() };
}
function addSeedRange(fw, range) {
  const match = String(range).match(/^(\d+)\.\.(\d+)$/);
  need(match, `invalid excluded seed range ${range}`);
  const first = Number(match[1]), last = Number(match[2]);
  for (let seed = first; seed <= last; seed++) fw.seeds.add(seed);
}
function addIdentityRow(fw, row) {
  if (Number.isInteger(row.sourceSeed)) fw.seeds.add(row.sourceSeed);
  if (row.sourceTrajectorySha256) fw.trajectory.add(row.sourceTrajectorySha256);
  if (row.openingPrefixSha256) fw.prefix.add(row.openingPrefixSha256);
  for (const cp of row.checkpointRoots || []) if (cp && cp.rootRawSha256) fw.root.add(cp.rootRawSha256);
}
function verifyRepositoryIdentity(root, source, fw, label) {
  const file = path.join(root, source.path);
  need(fs.existsSync(file), `missing repository identity ${label}`);
  need(sha256File(file) === source.fileSha256, `repository identity digest mismatch ${label}`);
  const obj = readJson(file);
  need(obj.scientificOutcomeFieldsRetained === false, `scientific fields retained ${label}`);
  need(Array.isArray(obj.identityRows) && obj.identityRows.length === source.identityRowCount, `identity row count mismatch ${label}`);
  for (const row of obj.identityRows) addIdentityRow(fw, row);
  return { source: label, class: source.sourceClass, rowCount: obj.identityRows.length, sha256: source.fileSha256 };
}
function verifyArtifactIdentity(file, source, fw, label) {
  need(fs.existsSync(file), `missing artifact identity ${label}`);
  need(sha256File(file) === source.identityFileSha256, `artifact identity digest mismatch ${label}`);
  const obj = readJson(file);
  need(obj.scientificOutcomeFieldsRetained === false, `scientific fields retained in artifact ${label}`);
  need(Array.isArray(obj.identityRows) && obj.identityRows.length === source.identityRowCount, `artifact identity row count mismatch ${label}`);
  for (const row of obj.identityRows) addIdentityRow(fw, row);
  return { source: label, class: source.sourceClass, rowCount: obj.identityRows.length, sha256: source.identityFileSha256 };
}
function canonicalG401Projection(rows) {
  return rows.map(x => ({
    slotSeed: x.slotSeed,
    effectiveSeed: x.effectiveSeed,
    trajectorySha256: x.trajectorySha256,
    checkpoints: (x.checkpoints || []).map(cp => cp ? ({ ply: cp.ply, rawStateSha256: cp.rawStateSha256 }) : null)
  })).sort((a, b) => a.slotSeed - b.slotSeed || a.effectiveSeed - b.effectiveSeed);
}
function loadG401(dir, source, fw) {
  const sourceDir = path.join(dir, source.artifactBlock || "source/GCLD");
  need(fs.existsSync(sourceDir), "missing G4-01 artifact source directory");
  const files = fs.readdirSync(sourceDir).filter(name => name.endsWith(".json")).sort();
  need(files.length === source.sourceRowCount, "G4-01 source row count mismatch");
  const rows = files.map(name => readJson(path.join(sourceDir, name)));
  need(digest(canonicalG401Projection(rows)) === source.canonicalIdentityProjectionSha256, "G4-01 canonical identity projection mismatch");
  const seeds = rows.map(x => String(x.effectiveSeed));
  const trajectories = rows.map(x => x.trajectorySha256).filter(Boolean);
  const roots = rows.flatMap(x => (x.checkpoints || []).filter(Boolean).map(cp => cp.rawStateSha256).filter(Boolean));
  need(new Set(seeds).size === source.setDigests.sourceSeed.uniqueCount && digestStringSet(seeds) === source.setDigests.sourceSeed.sha256, "G4-01 seed set mismatch");
  need(new Set(trajectories).size === source.setDigests.fullTrajectorySha256.uniqueCount && digestStringSet(trajectories) === source.setDigests.fullTrajectorySha256.sha256, "G4-01 trajectory set mismatch");
  need(new Set(roots).size === source.setDigests.rootRawSha256.uniqueCount && digestStringSet(roots) === source.setDigests.rootRawSha256.sha256, "G4-01 root set mismatch");
  for (const row of rows) {
    if (Number.isInteger(row.effectiveSeed)) fw.seeds.add(row.effectiveSeed);
    if (row.trajectorySha256) fw.trajectory.add(row.trajectorySha256);
    for (const cp of row.checkpoints || []) if (cp && cp.rawStateSha256) fw.root.add(cp.rawStateSha256);
  }
  return { source: "G4-01-STAGE1R-GCLD", class: source.sourceClass, rowCount: rows.length, projectionSha256: source.canonicalIdentityProjectionSha256, openingPrefixAudited: false };
}

function load({ root, spec, upstreamRoot }) {
  need(spec && spec.status === "FROZEN-PRE-STAGE2-FRESH", "Stage 2 firewall not frozen");
  need(spec.scientificOutcomeFieldsRetained === false, "Stage 2 firewall retains scientific outcomes");
  need(spec.stage2Reservation && spec.stage2Reservation.accessed === false, "Stage 2 reservation already marked accessed");
  const fw = emptyFirewall();
  for (const row of spec.excludedSeedNamespaces || []) addSeedRange(fw, row.range);
  const audit = [];
  audit.push(verifyRepositoryIdentity(root, spec.identitySources.g3_10_stage1, fw, "G3-10-STAGE1"));
  audit.push(verifyRepositoryIdentity(root, spec.identitySources.g3_10_stage2, fw, "G3-10-STAGE2"));
  audit.push(loadG401(path.join(upstreamRoot, "g4-01"), spec.identitySources.g4_01_stage1r_gcld, fw));
  audit.push(verifyArtifactIdentity(path.join(upstreamRoot, "g4-04-stage1", spec.identitySources.g4_04_stage1.identityFile), spec.identitySources.g4_04_stage1, fw, "G4-04-STAGE1"));
  audit.push(verifyArtifactIdentity(path.join(upstreamRoot, "g4-04-stage2", spec.identitySources.g4_04_stage2.identityFile), spec.identitySources.g4_04_stage2, fw, "G4-04-STAGE2"));
  audit.push(verifyArtifactIdentity(path.join(upstreamRoot, "g4-07-stage1", spec.identitySources.g4_07_stage1.identityFile), spec.identitySources.g4_07_stage1, fw, "G4-07-STAGE1"));
  const summary = {
    audit,
    setSizes: { seed: fw.seeds.size, trajectory: fw.trajectory.size, prefix: fw.prefix.size, root: fw.root.size },
    digest: digest({
      seeds: [...fw.seeds].sort((a, b) => a - b),
      trajectory: [...fw.trajectory].sort(),
      prefix: [...fw.prefix].sort(),
      root: [...fw.root].sort()
    })
  };
  return { sets: fw, summary };
}

module.exports = { load, stable, digest };
