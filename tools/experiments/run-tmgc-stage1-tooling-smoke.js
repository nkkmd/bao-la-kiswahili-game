#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const Prod = require("./lib/tmgc-stage1-production.js");
const Independent = require("./lib/tmgc-stage1-independent.js");
const ProdBoundary = require("./lib/tmgc-stage1-boundary-production.js");
const IndependentBoundary = require("./lib/tmgc-stage1-boundary-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const CONTRACT_PATH = path.join(ROOT, "doc/tactical-motif-generalization-counterexample/preregistration/STAGE_1_2_BOUNDARY_CONTRACT.json");
const SMOKE_PATH = path.join(ROOT, "doc/tactical-motif-generalization-counterexample/preregistration/STAGE_1_TOOLING_SMOKE_SPEC.json");
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function sourceHashes(files) {
  const out = {};
  for (const file of files) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) throw new Error(`Missing Stage1 source file for freeze: ${file}`);
    out[file] = sha256(fs.readFileSync(full));
  }
  return out;
}
function main() {
  const output = path.resolve(process.argv[2] || path.join(ROOT, "artifacts/local/tmgc-stage1-tooling-smoke"));
  const contractText = fs.readFileSync(CONTRACT_PATH, "utf8");
  const contract = JSON.parse(contractText);
  const smokeText = fs.readFileSync(SMOKE_PATH, "utf8");
  const smoke = JSON.parse(smokeText);
  const seedOverlap = !(smoke.seedEnd < contract.sourcePopulation.stage1.seedStart
    || smoke.seedStart > contract.sourcePopulation.stage2.seedEnd);
  const games = [];
  let sourceExact = true;
  const sourceStart = performance.now();
  for (let i = 0; i < smoke.games; i += 1) {
    const p = Prod.generateGame(contract, smoke.seedStart, i);
    const q = Independent.generateGame(contract, smoke.seedStart, i);
    if (Prod.stable(p) !== Independent.stable(q)) sourceExact = false;
    games.push(p);
  }
  const sourceWallMs = performance.now() - sourceStart;
  const prodRoots = Prod.collapseRoots(games);
  const indRoots = Independent.collapseRoots(games);
  const collapseExact = Prod.stable(prodRoots) === Independent.stable(indRoots);
  const allowed = new Map(contract.prospectiveBoundaryAxes.map((axis) => [axis.id, new Set(axis.levels.map(String))]));
  const measurements = [];
  let measurementExact = true;
  let levelsAllowed = true;
  const perRootMs = [];
  for (const root of prodRoots) {
    const start = performance.now();
    const p = Prod.measureRoot(root, contract);
    const q = Independent.measureRoot(root, contract);
    perRootMs.push(performance.now() - start);
    if (Prod.stable(p) !== Independent.stable(q)) measurementExact = false;
    for (const [axisId, levels] of allowed) if (!levels.has(String(p.boundary[axisId]))) levelsAllowed = false;
    measurements.push(p);
  }
  const smokeSourceAudit = {
    sourceReadinessPass: false,
    generatedGames: games.length,
    selectedUniqueRawRoots: prodRoots.length,
    checks: { smokeOnly: true },
  };
  const prodBoundary = ProdBoundary.evaluate(measurements, contract, smokeSourceAudit);
  const indBoundary = IndependentBoundary.evaluate(measurements, contract, smokeSourceAudit);
  const boundaryExact = Prod.stable(prodBoundary) === Prod.stable(indBoundary);
  const meanMeasurementMs = perRootMs.length ? perRootMs.reduce((a, b) => a + b, 0) / perRootMs.length : Infinity;
  const projected128RootMeasurementSeconds = meanMeasurementMs * 128 / 1000;
  const hashes = sourceHashes(smoke.authorizedSourceFiles);
  const sourceStrata = new Set(prodRoots.map((root) => root.stratumId)).size;
  const sourceFamilies = new Set(prodRoots.map((root) => root.sourceFamily)).size;
  const checks = {
    technicalSeedsDoNotOverlapScientificSeeds: !seedOverlap,
    allTechnicalGamesGenerated: games.length === smoke.games,
    productionIndependentFullSourceExact: sourceExact,
    productionIndependentRootCollapseExact: collapseExact,
    minimumSelectedRoots: prodRoots.length >= smoke.passGates.minimumSelectedRoots,
    minimumSelectedRootSourceStrata: sourceStrata >= smoke.passGates.minimumSelectedRootSourceStrata,
    minimumSelectedRootSourceFamilies: sourceFamilies >= smoke.passGates.minimumSelectedRootSourceFamilies,
    productionIndependentMeasurementsExact: measurementExact,
    allBoundaryLevelsWithinFrozenContract: levelsAllowed,
    productionIndependentBoundaryAggregationExact: boundaryExact,
    maximumProjected128RootMeasurementSeconds: projected128RootMeasurementSeconds <= smoke.passGates.maximumProjected128RootMeasurementSeconds,
    maximumObservedRssKb: process.resourceUsage().maxRSS <= smoke.passGates.maximumObservedRssKb,
  };
  const result = {
    schemaVersion: "TMGC_STAGE1_TOOLING_SMOKE_RESULT_V1",
    studyId: "TMGC-STUDY1", stageId: contract.stage1Id,
    stageType: "TECHNICAL_ONLY_TOOLING_SMOKE",
    scientificInferenceAuthorized: false, scientificSeedUseAllowed: false,
    smokeSpecSha256: sha256(smokeText), contractSha256: sha256(contractText),
    technicalSeeds: { start: smoke.seedStart, end: smoke.seedEnd },
    games: games.length, selectedUniqueRoots: prodRoots.length,
    selectedRootSourceStrata: sourceStrata, selectedRootSourceFamilies: sourceFamilies,
    resource: {
      sourceWallMs, meanSourceGameMs: sourceWallMs / games.length,
      meanMeasurementRootMs: Number.isFinite(meanMeasurementMs) ? meanMeasurementMs : null,
      maxMeasurementRootMs: perRootMs.length ? Math.max(...perRootMs) : null,
      projected128RootMeasurementSeconds: Number.isFinite(projected128RootMeasurementSeconds) ? projected128RootMeasurementSeconds : null,
      maxRssKb: process.resourceUsage().maxRSS,
    },
    sourceFileSha256: hashes,
    checks,
    disposition: Object.values(checks).every(Boolean) ? "STAGE1-TOOLING-SMOKE-PASS" : "STAGE1-TOOLING-SMOKE-FAIL",
    scientificOutcomesUsedToChangeContract: false,
  };
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "STAGE_1_TOOLING_SMOKE_RESULT.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (result.disposition !== "STAGE1-TOOLING-SMOKE-PASS") process.exitCode = 2;
}
if (require.main === module) main();
