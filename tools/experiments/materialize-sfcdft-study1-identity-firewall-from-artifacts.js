#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

function need(v, msg) { if (!v) throw new Error(msg); }
function sha256Text(s) { return crypto.createHash("sha256").update(String(s), "utf8").digest("hex"); }
function stable(v) {
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  if (v && typeof v === "object") return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`;
  return JSON.stringify(v);
}
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.isFile() && ent.name === "source.json") out.push(p);
  }
  return out;
}
function writeLines(file, values) {
  fs.writeFileSync(file, [...values].sort().join("\n") + "\n", "utf8");
}

const inputDir = path.resolve(process.argv[2] || "recovered");
const outputDir = path.resolve(process.argv[3] || "firewall-out");
need(fs.existsSync(inputDir), `input dir not found: ${inputDir}`);
fs.mkdirSync(outputDir, { recursive: true });

const files = walk(inputDir).sort();
need(files.length === 375, `expected exactly 375 sealed Study1 source artifacts, got ${files.length}`);

const slotSeeds = new Set();
const trajectories = new Set();
const prefixes = new Set();
const roots = new Set();
let pairCompleteCount = 0;
let pairIncompleteCount = 0;

for (const file of files) {
  const row = JSON.parse(fs.readFileSync(file, "utf8"));
  need(row.studyId === "SFCDFT-STUDY1", `unexpected studyId in ${file}`);
  need(row.stageId === "SFCDFT-S1-COMPATIBILITY-2026-09-18-v1", `unexpected stageId in ${file}`);
  need(row.evidenceClass === "FRESH-COMPATIBILITY-SOURCE", `unexpected evidenceClass in ${file}`);
  need(Number.isInteger(row.slotSeed) && row.slotSeed >= 40311001 && row.slotSeed <= 40311384, `unexpected slotSeed in ${file}`);
  need(row.effectiveSeed === row.slotSeed, `reserve/replacement evidence is not permitted in Study1 firewall recovery: ${file}`);
  need(typeof row.sourceTrajectorySha256 === "string" && /^[0-9a-f]{64}$/.test(row.sourceTrajectorySha256), `bad trajectory hash in ${file}`);
  need(row.openingPrefixLength === 16 && typeof row.openingPrefixSha256 === "string" && /^[0-9a-f]{64}$/.test(row.openingPrefixSha256), `bad opening prefix identity in ${file}`);

  slotSeeds.add(row.slotSeed);
  trajectories.add(row.sourceTrajectorySha256);
  prefixes.add(row.openingPrefixSha256);
  if (row.pairComplete) pairCompleteCount += 1; else pairIncompleteCount += 1;
  for (const root of [row.namua, row.mtaji]) {
    if (!root) continue;
    need(typeof root.rawStateSha256 === "string" && /^[0-9a-f]{64}$/.test(root.rawStateSha256), `bad root hash in ${file}`);
    roots.add(root.rawStateSha256);
  }
}
need(slotSeeds.size === 375, `expected 375 unique sealed slot seeds, got ${slotSeeds.size}`);

const failedPrimarySeeds = [40311019,40311131,40311191,40311195,40311223,40311263,40311301,40311365,40311381];
for (const s of failedPrimarySeeds) need(!slotSeeds.has(s), `failed primary seed unexpectedly has sealed source: ${s}`);

const trajectoryList = [...trajectories].sort();
const prefixList = [...prefixes].sort();
const rootList = [...roots].sort();
writeLines(path.join(outputDir, "sourceTrajectorySha256.txt"), trajectoryList);
writeLines(path.join(outputDir, "openingPrefixSha256.txt"), prefixList);
writeLines(path.join(outputDir, "rootRawSha256.txt"), rootList);

const identityCore = {
  schemaVersion: 1,
  sourceStudyId: "SFCDFT-STUDY1",
  sourceStageId: "SFCDFT-S1-COMPATIBILITY-2026-09-18-v1",
  sourceActionsRunId: 35311628238,
  sourceExecutionHead: "900884f687f6bc227106c7faa13bcce397574cc6",
  evidenceUse: "IDENTITY-ONLY-FRESHNESS-FIREWALL",
  fullConsumedPrimarySeedRange: { seedStart: 40311001, seedEnd: 40311384, count: 384 },
  sealedArtifactCount: files.length,
  failedPrimarySeeds,
  sealedSlotSeedCount: slotSeeds.size,
  sourceTrajectorySha256Count: trajectoryList.length,
  openingPrefixSha256Count: prefixList.length,
  rootRawSha256Count: rootList.length,
  pairCompleteCount,
  pairIncompleteCount,
  pairedReserveRange: { seedStart: 41311001, seedEnd: 41311384, reads: 0, status: "UNREAD-NOT-USED" },
  scientificOutcomeFieldsRetained: false,
  endpointValuesRetained: false,
  replayOrSeedRereadPerformed: false
};
const manifest = {
  ...identityCore,
  sourceTrajectoryListSha256: sha256Text(trajectoryList.join("\n") + "\n"),
  openingPrefixListSha256: sha256Text(prefixList.join("\n") + "\n"),
  rootRawListSha256: sha256Text(rootList.join("\n") + "\n"),
  identityCoreSha256: sha256Text(stable(identityCore))
};
fs.writeFileSync(path.join(outputDir, "MANIFEST.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
process.stdout.write(JSON.stringify({ event: "SFCDFT-STUDY1-IDENTITY-FIREWALL-MATERIALIZED", ...manifest }) + "\n");
