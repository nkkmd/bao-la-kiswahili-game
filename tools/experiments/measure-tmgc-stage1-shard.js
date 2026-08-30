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
const AUTH_PATH = path.join(ROOT, "doc/tactical-motif-generalization-counterexample/authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json");
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function fileSha(file) { return sha256(fs.readFileSync(path.join(ROOT, file))); }
function parseArgs(argv) {
  const out = { shard: null, selected: null, output: path.join(ROOT, "artifacts/local/tmgc-stage1-measure") };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--shard") out.shard = Number(argv[++i]);
    else if (argv[i] === "--selected") out.selected = path.resolve(argv[++i]);
    else if (argv[i] === "--output") out.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument ${argv[i]}`);
  }
  if (!Number.isInteger(out.shard) || out.shard < 0 || !out.selected) throw new Error("Invalid arguments");
  return out;
}
function loadBound() {
  const contractText = fs.readFileSync(CONTRACT_PATH, "utf8");
  const contract = JSON.parse(contractText);
  const authText = fs.readFileSync(AUTH_PATH, "utf8");
  const auth = JSON.parse(authText);
  if (auth.stageId !== contract.stage1Id || auth.stage1ScientificGenerationAuthorized !== true
    || auth.contractSha256 !== sha256(contractText)) throw new Error("Measurement authorization binding mismatch");
  for (const [file, expected] of Object.entries(auth.authorizedSourceFileSha256)) {
    if (fileSha(file) !== expected) throw new Error(`Measurement source hash mismatch: ${file}`);
  }
  return { contract, contractSha256: sha256(contractText), authSha256: sha256(authText) };
}
function allowedBoundaryLevels(measurement, contract) {
  const axes = new Map(contract.prospectiveBoundaryAxes.map((axis) => [axis.id, new Set(axis.levels.map(String))]));
  for (const [axisId, allowed] of axes) {
    const value = String(measurement.boundary[axisId]);
    if (!allowed.has(value)) throw new Error(`Boundary level outside frozen contract: ${axisId}=${value}`);
  }
}
function main() {
  const options = parseArgs(process.argv.slice(2));
  const { contract, contractSha256, authSha256 } = loadBound();
  const shardCount = contract.sourcePopulation.stage1.shardCount;
  if (options.shard >= shardCount) throw new Error("Measurement shard out of range");
  const selected = JSON.parse(zlib.gunzipSync(fs.readFileSync(options.selected)).toString("utf8"));
  if (selected.contractSha256 !== contractSha256) throw new Error("Selected-root contract binding mismatch");
  const roots = selected.roots.filter((_, index) => index % shardCount === options.shard);
  const measurements = [];
  for (let index = 0; index < roots.length; index += 1) {
    const root = roots[index];
    const production = Prod.measureRoot(root, contract);
    const independent = Independent.measureRoot(root, contract);
    if (Prod.stable(production) !== Independent.stable(independent)) {
      throw new Error(`Production/independent measurement mismatch: ${root.rawStateHash}`);
    }
    allowedBoundaryLevels(production, contract);
    measurements.push(production);
    console.error(`[TMGC S1 measure ${options.shard}] ${index + 1}/${roots.length}`);
  }
  const result = {
    schemaVersion: "TMGC_STAGE1_MEASUREMENT_SHARD_V1",
    studyId: "TMGC-STUDY1", stageId: contract.stage1Id,
    contractSha256, authorizationSha256: authSha256,
    shardIndex: options.shard, measurementCount: measurements.length,
    productionIndependentExact: true, boundaryLevelsWithinFrozenContract: true,
    measurements,
  };
  fs.mkdirSync(options.output, { recursive: true });
  const file = path.join(options.output, `measurement-shard-${String(options.shard).padStart(2, "0")}.json.gz`);
  fs.writeFileSync(file, zlib.gzipSync(Buffer.from(JSON.stringify(result)), { level: 9 }));
  console.log(JSON.stringify({ shardIndex: options.shard, measurements: measurements.length, output: file }, null, 2));
}
if (require.main === module) main();
