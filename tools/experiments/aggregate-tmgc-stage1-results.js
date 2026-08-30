#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const ProdBoundary = require("./lib/tmgc-stage1-boundary-production.js");
const IndependentBoundary = require("./lib/tmgc-stage1-boundary-independent.js");
const Prod = require("./lib/tmgc-stage1-production.js");

const ROOT = path.resolve(__dirname, "../..");
const CONTRACT_PATH = path.join(ROOT, "doc/tactical-motif-generalization-counterexample/preregistration/STAGE_1_2_BOUNDARY_CONTRACT.json");
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full)); else out.push(full);
  }
  return out;
}
function parseArgs(argv) {
  const out = { sourceAudit: null, measurements: null, output: path.join(ROOT, "artifacts/local/tmgc-stage1-final") };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--source-audit") out.sourceAudit = path.resolve(argv[++i]);
    else if (argv[i] === "--measurements") out.measurements = path.resolve(argv[++i]);
    else if (argv[i] === "--output") out.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument ${argv[i]}`);
  }
  if (!out.sourceAudit) throw new Error("--source-audit required");
  return out;
}
function main() {
  const options = parseArgs(process.argv.slice(2));
  const contractText = fs.readFileSync(CONTRACT_PATH, "utf8");
  const contract = JSON.parse(contractText);
  const contractSha256 = sha256(contractText);
  const sourceAudit = JSON.parse(fs.readFileSync(options.sourceAudit, "utf8"));
  if (sourceAudit.contractSha256 !== contractSha256 || sourceAudit.stageId !== contract.stage1Id) {
    throw new Error("Final source-audit binding mismatch");
  }
  fs.mkdirSync(options.output, { recursive: true });
  let result;
  if (!sourceAudit.sourceReadinessPass) {
    result = {
      schemaVersion: "TMGC_STAGE1_DEVELOPMENT_RESULT_V1",
      studyId: "TMGC-STUDY1", stageId: contract.stage1Id,
      contractSha256, sourceAudit,
      scientificInferenceAuthorized: true, developmentEvidence: true,
      measurementExecuted: false,
      stage1Disposition: "STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE",
      stage2AuthorizationEligible: false,
      studyTerminalDisposition: "NON-ESTIMABLE",
      stage2Disposition: "NOT-AUTHORIZED-NOT-EXECUTED",
      noRescueApplied: true,
    };
  } else {
    if (!options.measurements) throw new Error("Measurement directory required when source readiness passes");
    const files = walk(options.measurements).filter((file) => /measurement-shard-\d+\.json\.gz$/.test(file)).sort();
    if (files.length !== contract.sourcePopulation.stage1.shardCount) {
      throw new Error(`Expected ${contract.sourcePopulation.stage1.shardCount} measurement shards, got ${files.length}`);
    }
    const shards = files.map((file) => JSON.parse(zlib.gunzipSync(fs.readFileSync(file)).toString("utf8")));
    if (shards.some((row) => row.contractSha256 !== contractSha256 || row.productionIndependentExact !== true
      || row.boundaryLevelsWithinFrozenContract !== true)) throw new Error("Measurement shard integrity mismatch");
    const measurements = shards.flatMap((row) => row.measurements)
      .sort((a, b) => a.rawStateHash.localeCompare(b.rawStateHash));
    if (measurements.length !== sourceAudit.selectedUniqueRawRoots
      || new Set(measurements.map((row) => row.rawStateHash)).size !== measurements.length) {
      throw new Error("Measurement completeness/identity failure");
    }
    const production = ProdBoundary.evaluate(measurements, contract, sourceAudit);
    const independent = IndependentBoundary.evaluate(measurements, contract, sourceAudit);
    if (Prod.stable(production) !== Prod.stable(independent)) throw new Error("Production/independent boundary aggregation mismatch");
    result = {
      schemaVersion: "TMGC_STAGE1_DEVELOPMENT_RESULT_V1",
      studyId: "TMGC-STUDY1", stageId: contract.stage1Id,
      contractSha256, scientificInferenceAuthorized: true, developmentEvidence: true,
      measurementExecuted: true,
      sourceAudit,
      boundaryResult: production,
      productionIndependentBoundaryAggregationExact: true,
      stage1Disposition: production.stage1Disposition,
      stage2AuthorizationEligible: production.stage2AuthorizationEligible,
      studyTerminalDisposition: production.stage2AuthorizationEligible ? null : "NON-ESTIMABLE",
      stage2Disposition: production.stage2AuthorizationEligible ? "PENDING-AUTHORIZATION" : "NOT-AUTHORIZED-NOT-EXECUTED",
      noRescueApplied: true,
    };
  }
  result.resultSha256BeforeHashField = sha256(JSON.stringify(result));
  fs.writeFileSync(path.join(options.output, "STAGE_1_DEVELOPMENT_RESULT.json"), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
}
if (require.main === module) main();
