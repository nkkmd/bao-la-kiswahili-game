#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");

const V1_PATH = path.resolve(__dirname, "run-silgm-stage0-technical.js");
const EXPECTED_V1_GIT_BLOB = "5fb33143829b93dc45fa7fd6acd3f48f5a38d4f7";
const DEFAULT_OUT = path.resolve(__dirname, "../../doc/search-instability-local-geometry-mechanism/results/stage-0-v2/STAGE_0_TECHNICAL_RESULT.json");

function need(x, m) { if (!x) throw new Error(m); }
function gitBlobSha(text) {
  const body = Buffer.from(text, "utf8");
  const header = Buffer.from(`blob ${body.length}\0`, "utf8");
  return crypto.createHash("sha1").update(Buffer.concat([header, body])).digest("hex");
}
function replaceOne(text, from, to, label) {
  const parts = text.split(from);
  need(parts.length === 2, `${label} replacement count must be exactly one; got ${parts.length - 1}`);
  return parts[0] + to + parts[1];
}
function materialize() {
  const original = fs.readFileSync(V1_PATH, "utf8");
  need(gitBlobSha(original) === EXPECTED_V1_GIT_BLOB, "immutable v1 runner Git blob mismatch");
  let patched = original;
  patched = replaceOne(patched,
    'const STAGE = "SILGM-S0-TECHNICAL-2026-09-03-v1";',
    'const STAGE = "SILGM-S0-TECHNICAL-2026-09-03-v2";',
    "stage-id");
  patched = replaceOne(patched,
    'prereg/STAGE_0_TECHNICAL_SPEC.json',
    'prereg/STAGE_0_TECHNICAL_SPEC_V2.json',
    "stage-spec");
  patched = replaceOne(patched,
    'results/stage-0/STAGE_0_TECHNICAL_RESULT.json',
    'results/stage-0-v2/STAGE_0_TECHNICAL_RESULT.json',
    "default-output");
  patched = replaceOne(patched,
    'qeq(pg.metrics["SILGM-G5-UNIT-WIDTH-OCCUPANCY-FRACTION"],7,23);',
    'qeq(pg.metrics["SILGM-G5-UNIT-WIDTH-OCCUPANCY-FRACTION"],7,17);',
    "corrected-g5-fixture");
  patched = replaceOne(patched,
    'checks,technicalRoots:rootAudit,staticAudit:stat,',
    'checks:{...checks},technicalRoots:rootAudit,staticAudit:stat,',
    "deterministic-check-snapshot");
  patched = replaceOne(patched,
    'checks.T14_resourceCeilingsPass=elapsedMs<=spec.resourceCeilings.elapsedMs&&peakRssBytes<=spec.resourceCeilings.peakRssBytes&&result.telemetry.resultArtifactBytes<=spec.resourceCeilings.resultArtifactBytes;if(!checks.T14_resourceCeilingsPass)result.stageDisposition="STAGE0-NON-ESTIMABLE";',
    'result.resourceChecks={T14_resourceCeilingsPass:elapsedMs<=spec.resourceCeilings.elapsedMs&&peakRssBytes<=spec.resourceCeilings.peakRssBytes&&result.telemetry.resultArtifactBytes<=spec.resourceCeilings.resultArtifactBytes};if(!result.resourceChecks.T14_resourceCeilingsPass)result.stageDisposition="STAGE0-NON-ESTIMABLE";',
    "resource-bookkeeping");
  need(!patched.includes('SILGM-S0-TECHNICAL-2026-09-03-v1'), "v1 stage id leaked into materialized v2 runner");
  need(patched.includes('SILGM-S0-TECHNICAL-2026-09-03-v2'), "v2 stage id missing");
  need(patched.includes('7,17'), "corrected G5 expectation missing");
  return patched;
}

function main() {
  const verifyOnly = process.argv.includes("--verify-only");
  const outArgIndex = process.argv.indexOf("--output");
  const out = outArgIndex >= 0 ? path.resolve(process.argv[outArgIndex + 1]) : DEFAULT_OUT;
  const patched = materialize();
  const tmp = path.join(__dirname, `.silgm-stage0-v2-${process.pid}.js`);
  fs.writeFileSync(tmp, patched);
  try {
    const check = spawnSync(process.execPath, ["--check", tmp], { encoding: "utf8" });
    need(check.status === 0, `materialized v2 syntax check failed: ${check.stderr || check.stdout}`);
    if (verifyOnly) {
      console.log(JSON.stringify({v2MaterializationVerified:true,v1GitBlob:EXPECTED_V1_GIT_BLOB,patchedBytes:Buffer.byteLength(patched),freshScientificSeedAccess:false,protectedDepth10Access:false}));
      return;
    }
    const run = spawnSync(process.execPath, [tmp, out], { stdio: "inherit" });
    process.exitCode = run.status === null ? 1 : run.status;
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

main();
