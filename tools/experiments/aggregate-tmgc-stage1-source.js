#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const Prod = require("./lib/tmgc-stage1-production.js");
const Independent = require("./lib/tmgc-stage1-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const CONTRACT_PATH = path.join(ROOT, "doc/tactical-motif-generalization-counterexample/preregistration/STAGE_1_2_BOUNDARY_CONTRACT.json");
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full)); else out.push(full);
  }
  return out;
}
function counts(values) {
  const out = {};
  for (const value of values) out[value] = (out[value] || 0) + 1;
  return out;
}
function maxShare(map, total) {
  const vals = Object.values(map);
  return total && vals.length ? Math.max(...vals) / total : 0;
}
function parseArgs(argv) {
  const out = { input: null, output: path.join(ROOT, "artifacts/local/tmgc-stage1-aggregate") };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--input") out.input = path.resolve(argv[++i]);
    else if (argv[i] === "--output") out.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument ${argv[i]}`);
  }
  if (!out.input) throw new Error("--input required");
  return out;
}
function main() {
  const options = parseArgs(process.argv.slice(2));
  const contractText = fs.readFileSync(CONTRACT_PATH, "utf8");
  const contract = JSON.parse(contractText);
  const contractSha256 = sha256(contractText);
  const files = walk(options.input).filter((file) => /source-shard-\d+\.json\.gz$/.test(file)).sort();
  if (files.length !== contract.sourcePopulation.stage1.shardCount) {
    throw new Error(`Expected ${contract.sourcePopulation.stage1.shardCount} source shards, got ${files.length}`);
  }
  const shardRows = files.map((file) => JSON.parse(zlib.gunzipSync(fs.readFileSync(file)).toString("utf8")));
  if (shardRows.some((row) => row.contractSha256 !== contractSha256
    || row.stageId !== contract.stage1Id || row.productionIndependentFullSourceReplayExact !== true)) {
    throw new Error("Source shard binding/verification mismatch");
  }
  const games = shardRows.flatMap((row) => row.games).sort((a, b) => a.gameIndex - b.gameIndex);
  const expectedGames = contract.sourcePopulation.stage1.games;
  if (games.length !== expectedGames || new Set(games.map((game) => game.gameIndex)).size !== expectedGames) {
    throw new Error("Stage1 source game completeness failure");
  }
  for (let index = 0; index < games.length; index += 1) {
    if (games[index].gameIndex !== index || games[index].seed !== contract.sourcePopulation.stage1.seedStart + index) {
      throw new Error(`Stage1 source index/seed mismatch at ${index}`);
    }
  }
  const prodRoots = Prod.collapseRoots(games);
  const indRoots = Independent.collapseRoots(games);
  if (Prod.stable(prodRoots) !== Independent.stable(indRoots)) throw new Error("Independent selected-root collapse mismatch");
  const roots = prodRoots;
  const gameOpeningCounts = counts(games.map((game) => game.openingPrefixHash));
  const rootOpeningCounts = counts(roots.map((root) => root.openingPrefixHash));
  const rootStrataCounts = counts(roots.map((root) => root.stratumId));
  const rootFamilyCounts = counts(roots.map((root) => root.sourceFamily));
  const gate = contract.stage1GlobalReadinessGates;
  const checks = {
    minimumGeneratedGames: games.length >= gate.minimumGeneratedGames,
    minimumUniqueRawTrajectories: new Set(games.map((game) => game.rawTrajectoryHash)).size >= gate.minimumUniqueRawTrajectories,
    minimumDistinctOpeningPrefixes: Object.keys(gameOpeningCounts).length >= gate.minimumDistinctOpeningPrefixes,
    maximumSingleOpeningPrefixShare: maxShare(gameOpeningCounts, games.length) <= gate.maximumSingleOpeningPrefixShare,
    requiredSourceStrata: Object.keys(rootStrataCounts).length >= gate.requiredSourceStrata,
    maximumSingleSourceStratumShareAmongSelectedRoots: maxShare(rootStrataCounts, roots.length) <= gate.maximumSingleSourceStratumShareAmongSelectedRoots,
    requiredSourceFamilies: Object.keys(rootFamilyCounts).length >= gate.requiredSourceFamilies,
    maximumSingleSourceFamilyShareAmongSelectedRoots: maxShare(rootFamilyCounts, roots.length) <= gate.maximumSingleSourceFamilyShareAmongSelectedRoots,
    minimumSelectedUniqueRawRoots: roots.length >= gate.minimumSelectedUniqueRawRoots,
    minimumSelectedRootDistinctOpeningPrefixes: Object.keys(rootOpeningCounts).length >= gate.minimumSelectedRootDistinctOpeningPrefixes,
    productionIndependentSelectedRootIdentityExact: true,
    allSourceShardsProductionIndependentExact: shardRows.every((row) => row.productionIndependentFullSourceReplayExact === true),
  };
  const audit = {
    schemaVersion: "TMGC_STAGE1_SOURCE_AUDIT_V1",
    studyId: "TMGC-STUDY1", stageId: contract.stage1Id,
    scientificInferenceAuthorized: true, developmentEvidence: true,
    contractSha256,
    generatedGames: games.length,
    uniqueRawTrajectories: new Set(games.map((game) => game.rawTrajectoryHash)).size,
    distinctOpeningPrefixes: Object.keys(gameOpeningCounts).length,
    maximumSingleOpeningPrefixShare: maxShare(gameOpeningCounts, games.length),
    selectedUniqueRawRoots: roots.length,
    selectedRootDistinctOpeningPrefixes: Object.keys(rootOpeningCounts).length,
    selectedRootMaximumSingleOpeningPrefixShare: maxShare(rootOpeningCounts, roots.length),
    selectedRootSourceStratumCounts: rootStrataCounts,
    selectedRootMaximumSingleSourceStratumShare: maxShare(rootStrataCounts, roots.length),
    selectedRootSourceFamilyCounts: rootFamilyCounts,
    selectedRootMaximumSingleSourceFamilyShare: maxShare(rootFamilyCounts, roots.length),
    checks,
    sourceReadinessPass: Object.values(checks).every(Boolean),
    noReplacementPerformed: true,
  };
  const firewall = {
    schemaVersion: "TMGC_STAGE1_FIREWALL_IDENTITIES_V1",
    studyId: "TMGC-STUDY1", stageId: contract.stage1Id,
    rawStateHashes: roots.map((root) => root.rawStateHash).sort(),
    rawTrajectoryHashes: [...new Set(roots.map((root) => root.rawTrajectoryHash))].sort(),
    openingPrefixHashes: [...new Set(roots.map((root) => root.openingPrefixHash))].sort(),
  };
  fs.mkdirSync(options.output, { recursive: true });
  fs.writeFileSync(path.join(options.output, "STAGE_1_SOURCE_AUDIT.json"), `${JSON.stringify(audit, null, 2)}\n`);
  fs.writeFileSync(path.join(options.output, "STAGE_1_SELECTED_ROOTS.json.gz"),
    zlib.gzipSync(Buffer.from(JSON.stringify({ schemaVersion: "TMGC_STAGE1_SELECTED_ROOTS_V1", contractSha256, roots })), { level: 9 }));
  fs.writeFileSync(path.join(options.output, "STAGE_1_FIREWALL_IDENTITIES.json"), `${JSON.stringify(firewall, null, 2)}\n`);
  console.log(JSON.stringify(audit, null, 2));
}
if (require.main === module) main();
