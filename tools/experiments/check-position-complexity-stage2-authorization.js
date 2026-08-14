#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const R = require("./run-position-complexity-stage2-formal.js");

const ROOT = path.resolve(__dirname, "../..");
const AUTH_PATH = path.join(ROOT, "doc/position-complexity/preregistration/STAGE_2_FORMAL_AUTHORIZATION.json");

function sha256File(relativePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, relativePath))).digest("hex");
}

function main() {
  const { spec, specSha256 } = R.loadSpec();
  const auth = R.loadAuthorization(spec, specSha256);
  const mismatches = [];
  for (const [file, expected] of Object.entries(auth.pipelineFileSha256 || {})) {
    if (!fs.existsSync(path.join(ROOT, file))) {
      mismatches.push({ file, expected, actual: null, reason: "missing" });
      continue;
    }
    const actual = sha256File(file);
    if (actual !== expected) mismatches.push({ file, expected, actual, reason: "sha256-mismatch" });
  }
  const result = {
    schemaVersion: 1,
    stageId: spec.stageId,
    authorized: auth.authorized === true,
    specSha256,
    validatedToolingCommit: auth.validatedToolingCommit,
    validatedCiRun: auth.validatedCi?.runId ?? null,
    sourceHashFirewallPassed: true,
    pipelineHashFirewallPassed: mismatches.length === 0,
    pipelineMismatches: mismatches,
    outputRoot: auth.formalCorpus?.outputRoot ?? null,
    passed: auth.authorized === true && mismatches.length === 0,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
}

if (require.main === module) main();
