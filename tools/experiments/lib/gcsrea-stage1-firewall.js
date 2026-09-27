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
function rowDigest(rows) { return sha256Text(rows.map(stable).sort().join("\n")); }
function makeSets() { return { seed: new Set(), trajectory: new Set(), prefix: new Set(), root: new Set() }; }

function addRange(range, sets) {
  const [start, end] = String(range).split("..").map(Number);
  need(Number.isSafeInteger(start) && Number.isSafeInteger(end) && end >= start, `bad excluded seed range ${range}`);
  for (let seed = start; seed <= end; seed += 1) sets.seed.add(String(seed));
}
function addExcludedRanges(firewall, sets) {
  for (const entry of firewall.excludedSeedNamespaces || []) addRange(entry.range, sets);
}
function addIdentityRow(row, sets) {
  const seed = row.sourceSeed ?? row.seed;
  if (seed !== undefined && seed !== null) sets.seed.add(String(seed));
  const trajectory = row.sourceTrajectorySha256 || row.fullTrajectorySha256 || row.historicalTrajectoryHash;
  const prefix = row.openingPrefixSha256 || row.openingPrefixHash;
  const root = row.rootRawSha256;
  if (trajectory) sets.trajectory.add(trajectory);
  if (prefix) sets.prefix.add(prefix);
  if (root) sets.root.add(root);
  for (const cp of row.checkpointRoots || []) if (cp && cp.rootRawSha256) sets.root.add(cp.rootRawSha256);
  for (const cp of row.reachableRoots || []) if (cp && cp.rootRawSha256) sets.root.add(cp.rootRawSha256);
}
function recursiveFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...recursiveFiles(full));
    else out.push(full);
  }
  return out;
}
function findUniqueFile(dir, basename) {
  need(fs.existsSync(dir), `artifact directory missing: ${dir}`);
  const hits = recursiveFiles(dir).filter((file) => path.basename(file) === basename);
  need(hits.length === 1, `expected exactly one ${basename} below ${dir}, found ${hits.length}`);
  return hits[0];
}
function verifySet(values, expected, label) {
  need(values.size === expected.uniqueCount, `${label} unique count mismatch: ${values.size}`);
  need(setDigest(values) === expected.sha256.replace(/^sha256:/, ""), `${label} digest mismatch`);
}

function loadG202(dir, meta, sets, label) {
  const gamesDir = path.join(dir, "games");
  need(fs.existsSync(gamesDir), `${label} games directory missing`);
  const games = fs.readdirSync(gamesDir).filter((name) => /^game-\d+\.json$/.test(name)).sort();
  need(games.length === meta.gameCount, `${label} game count mismatch ${games.length}`);
  const trajectories = new Set(), prefixes = new Set(), roots = new Set();
  for (const name of games) {
    const row = JSON.parse(fs.readFileSync(path.join(gamesDir, name), "utf8"));
    need(row.scientificSeedConsumed === true, `${label} non-consumed game ${name}`);
    sets.seed.add(String(row.seed));
    trajectories.add(row.historicalTrajectoryHash);
    prefixes.add(row.openingPrefixHash);
    sets.trajectory.add(row.historicalTrajectoryHash);
    sets.prefix.add(row.openingPrefixHash);
    for (const move of row.moves || []) {
      need(typeof move.afterRawStateKey === "string", `${label} afterRawStateKey missing ${name}`);
      const digest = sha256Text(move.afterRawStateKey);
      roots.add(digest);
      sets.root.add(digest);
    }
  }
  verifySet(trajectories, meta.trajectorySet, `${label} trajectory set`);
  verifySet(prefixes, meta.openingPrefixSet, `${label} opening-prefix set`);
  verifySet(roots, meta.reachableRootSet, `${label} reachable-root set`);

  const selected = path.join(dir, meta.selectedStateFile);
  need(fs.existsSync(selected), `${label} selected-state file missing`);
  need(fileSha256(selected) === meta.selectedStateFileSha256, `${label} selected-state file digest mismatch`);
  const selectedObj = JSON.parse(fs.readFileSync(selected, "utf8"));
  need(Array.isArray(selectedObj.selected) && selectedObj.selected.length === meta.selectedCount, `${label} selected count mismatch`);
  for (const row of selectedObj.selected) {
    addIdentityRow(row, sets);
    if (typeof row.rawStateKey === "string") sets.root.add(sha256Text(row.rawStateKey));
  }
  return {
    gameCount: games.length,
    trajectoryUniqueCount: trajectories.size,
    openingPrefixUniqueCount: prefixes.size,
    reachableRootUniqueCount: roots.size,
    selectedCount: selectedObj.selected.length,
  };
}

function loadRepositoryIdentity(repoRoot, meta, sets, label) {
  const file = path.join(repoRoot, meta.path);
  need(fs.existsSync(file), `${label} repository identity file missing`);
  if (meta.fileSha256) need(fileSha256(file) === meta.fileSha256, `${label} repository identity file digest mismatch`);
  const obj = JSON.parse(fs.readFileSync(file, "utf8"));
  need(obj.scientificOutcomeFieldsRetained === false, `${label} retains scientific outcome fields`);
  need(Array.isArray(obj.identityRows) && obj.identityRows.length === meta.identityRowCount, `${label} identity row count mismatch`);
  for (const row of obj.identityRows) addIdentityRow(row, sets);
  return { identityRowCount: obj.identityRows.length, fileSha256: fileSha256(file) };
}

function loadG307Stage2(dir, meta, sets) {
  const file = findUniqueFile(dir, "scientific-result.json");
  const obj = JSON.parse(fs.readFileSync(file, "utf8"));
  const selected = obj?.selection?.core?.selected;
  need(Array.isArray(selected) && selected.length === meta.selectedIdentityRowCount, "G3-07 Stage2 selected identity count mismatch");
  const rows = selected.map((row) => ({
    seed: row.seed,
    selectedPly: row.selectedPly,
    rootRawSha256: row.rootRawSha256,
    fullTrajectorySha256: row.fullTrajectorySha256,
    openingPrefixSha256: row.openingPrefixSha256,
  }));
  need(rowDigest(rows) === meta.canonicalIdentityRowDigest.replace(/^sha256:/, ""), "G3-07 Stage2 canonical identity row digest mismatch");
  const roots = new Set(rows.map((row) => row.rootRawSha256));
  const trajectories = new Set(rows.map((row) => row.fullTrajectorySha256));
  const prefixes = new Set(rows.map((row) => row.openingPrefixSha256));
  verifySet(roots, meta.setDigests.rootRawSha256, "G3-07 Stage2 root set");
  verifySet(trajectories, meta.setDigests.fullTrajectorySha256, "G3-07 Stage2 trajectory set");
  verifySet(prefixes, meta.setDigests.openingPrefixSha256, "G3-07 Stage2 prefix set");
  for (const row of rows) addIdentityRow(row, sets);
  return { identityRowCount: rows.length, sourceFileSha256: fileSha256(file) };
}

function loadG401Silgm(dir, meta, sets) {
  const block = path.join(dir, meta.artifactBlock);
  need(fs.existsSync(block), "G4-01 SILGM source block missing");
  const files = fs.readdirSync(block).filter((name) => /^\d+\.json$/.test(name)).sort((a, b) => Number(a.slice(0, -5)) - Number(b.slice(0, -5)));
  need(files.length === meta.sourceRowCount, `G4-01 SILGM source row count mismatch ${files.length}`);
  const rows = [], sourceSeeds = new Set(), trajectories = new Set(), roots = new Set();
  for (const name of files) {
    const obj = JSON.parse(fs.readFileSync(path.join(block, name), "utf8"));
    const sourceSeed = obj.effectiveSeed ?? obj.slotSeed;
    const rootRawSha256 = obj.root?.rawStateSha256 || null;
    rows.push({ sourceSeed, fullTrajectorySha256: obj.trajectorySha256, rootRawSha256 });
    sourceSeeds.add(String(sourceSeed));
    sets.seed.add(String(sourceSeed));
    if (obj.trajectorySha256) { trajectories.add(obj.trajectorySha256); sets.trajectory.add(obj.trajectorySha256); }
    if (rootRawSha256) { roots.add(rootRawSha256); sets.root.add(rootRawSha256); }
  }
  need(rowDigest(rows) === meta.canonicalIdentityRowDigest.replace(/^sha256:/, ""), "G4-01 SILGM canonical identity row digest mismatch");
  verifySet(sourceSeeds, meta.setDigests.sourceSeed, "G4-01 SILGM source-seed set");
  verifySet(trajectories, meta.setDigests.fullTrajectorySha256, "G4-01 SILGM trajectory set");
  verifySet(roots, meta.setDigests.rootRawSha256, "G4-01 SILGM root set");
  return { sourceRowCount: rows.length, trajectoryUniqueCount: trajectories.size, rootUniqueCount: roots.size };
}

function loadG403(dir, meta, sets, label) {
  const file = findUniqueFile(dir, meta.identityFile);
  need(fileSha256(file) === meta.identityFileSha256, `${label} result digest mismatch`);
  const obj = JSON.parse(fs.readFileSync(file, "utf8"));
  need(Array.isArray(obj.identityManifest) && obj.identityManifest.length === meta.identityRowCount, `${label} identity manifest count mismatch`);
  need(obj.identityManifestSha256 === meta.identityManifestSha256, `${label} frozen identity manifest digest mismatch`);
  need(sha256Text(stable(obj.identityManifest)) === meta.identityManifestSha256, `${label} recomputed identity manifest digest mismatch`);
  for (const row of obj.identityManifest) addIdentityRow(row, sets);
  return { identityRowCount: obj.identityManifest.length, fileSha256: fileSha256(file) };
}

function loadGenericArtifactIdentity(dir, meta, sets, label) {
  const file = findUniqueFile(dir, path.basename(meta.identityFile));
  need(fileSha256(file) === meta.identityFileSha256, `${label} identity file digest mismatch`);
  const obj = JSON.parse(fs.readFileSync(file, "utf8"));
  need(obj.scientificOutcomeFieldsRetained === false, `${label} retains scientific outcome fields`);
  need(Array.isArray(obj.identityRows) && obj.identityRows.length === meta.identityRowCount, `${label} identity row count mismatch`);
  for (const row of obj.identityRows) addIdentityRow(row, sets);
  const localTrajectories = new Set(), localPrefixes = new Set(), localRoots = new Set();
  for (const row of obj.identityRows) {
    if (row.sourceTrajectorySha256) localTrajectories.add(row.sourceTrajectorySha256);
    if (row.openingPrefixSha256) localPrefixes.add(row.openingPrefixSha256);
    for (const cp of row.reachableRoots || row.checkpointRoots || []) if (cp?.rootRawSha256) localRoots.add(cp.rootRawSha256);
    if (row.rootRawSha256) localRoots.add(row.rootRawSha256);
  }
  if (meta.trajectorySet) verifySet(localTrajectories, meta.trajectorySet, `${label} trajectory set`);
  if (meta.openingPrefixSet) verifySet(localPrefixes, meta.openingPrefixSet, `${label} opening-prefix set`);
  if (meta.reachableRootSet) verifySet(localRoots, meta.reachableRootSet, `${label} reachable-root set`);
  return { identityRowCount: obj.identityRows.length, fileSha256: fileSha256(file), trajectoryUniqueCount: localTrajectories.size, rootUniqueCount: localRoots.size };
}

function materialize({ repoRoot, upstreamRoot, firewall }) {
  need(firewall.status === "FROZEN-PRE-FRESH", "firewall not frozen");
  need(firewall.scientificOutcomeFieldsRetained === false, "firewall retains scientific outcome fields");
  need(firewall.freshStage1SeedAccessDuringMaterialization === false, "firewall materialization allows fresh Stage1 access");
  const sets = makeSets();
  addExcludedRanges(firewall, sets);
  const s = firewall.identitySources;
  const verified = {};

  verified.g2_02_stage1 = loadG202(path.join(upstreamRoot, "g2-02-stage1"), s.g2_02_stage1, sets, "G2-02 Stage1");
  verified.g2_02_stage2 = loadG202(path.join(upstreamRoot, "g2-02-stage2"), s.g2_02_stage2, sets, "G2-02 Stage2");
  verified.g3_07_stage1 = loadRepositoryIdentity(repoRoot, s.g3_07_stage1, sets, "G3-07 Stage1");
  verified.g3_07_stage2 = loadG307Stage2(path.join(upstreamRoot, "g3-07-stage2"), s.g3_07_stage2, sets);
  verified.g3_10_stage1 = loadRepositoryIdentity(repoRoot, s.g3_10_stage1, sets, "G3-10 Stage1");
  verified.g3_10_stage2 = loadRepositoryIdentity(repoRoot, s.g3_10_stage2, sets, "G3-10 Stage2");
  verified.g4_01_stage1r_silgm = loadG401Silgm(path.join(upstreamRoot, "g4-01"), s.g4_01_stage1r_silgm, sets);
  verified.g4_03_stage1 = loadG403(path.join(upstreamRoot, "g4-03-stage1"), s.g4_03_stage1, sets, "G4-03 Stage1");
  verified.g4_03_stage2 = loadG403(path.join(upstreamRoot, "g4-03-stage2"), s.g4_03_stage2, sets, "G4-03 Stage2");
  verified.g4_04_stage1 = loadGenericArtifactIdentity(path.join(upstreamRoot, "g4-04-stage1"), s.g4_04_stage1, sets, "G4-04 Stage1");
  verified.g4_04_stage2 = loadGenericArtifactIdentity(path.join(upstreamRoot, "g4-04-stage2"), s.g4_04_stage2, sets, "G4-04 Stage2");
  verified.g4_07_stage1 = loadGenericArtifactIdentity(path.join(upstreamRoot, "g4-07-stage1"), s.g4_07_stage1, sets, "G4-07 Stage1");
  verified.g4_07_stage2 = loadGenericArtifactIdentity(path.join(upstreamRoot, "g4-07-stage2"), s.g4_07_stage2, sets, "G4-07 Stage2");
  verified.g4_08_stage1_v3 = loadGenericArtifactIdentity(path.join(upstreamRoot, "g4-08-stage1-v3"), s.g4_08_stage1_v3, sets, "G4-08 Stage1 v3");
  verified.g4_08_stage2 = loadGenericArtifactIdentity(path.join(upstreamRoot, "g4-08-stage2"), s.g4_08_stage2, sets, "G4-08 Stage2");

  const summary = {
    verified,
    setSizes: { seed: sets.seed.size, trajectory: sets.trajectory.size, prefix: sets.prefix.size, root: sets.root.size },
    setDigests: { seed: setDigest(sets.seed), trajectory: setDigest(sets.trajectory), prefix: setDigest(sets.prefix), root: setDigest(sets.root) },
    limitations: firewall.unavailableIdentityClasses,
    scientificOutcomeFieldsRetained: false,
    freshStage1SeedAccessDuringMaterialization: false,
    moduleBExactOracleUse: firewall.moduleBExactOracleUse,
  };
  summary.firewallDigestSha256 = sha256Text(stable(summary));
  return { sets, summary };
}

module.exports = { materialize, stable, sha256Text, fileSha256, setDigest };
