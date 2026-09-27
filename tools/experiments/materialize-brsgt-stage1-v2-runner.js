#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const SOURCE_PATH = path.join(ROOT, "tools/experiments/run-brsgt-stage1-development.js");
const SOURCE_SHA256 = "9f5bd50a4027fb5df97788d98203f177f53b5ee31326fdc6fd4ed847505f2b12";
const SELF_TEST_MARKER = "BRSGT-STAGE1-V2-CATCH-SELF-TEST";

function need(value, message) { if (!value) throw new Error(message); }
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function occurrences(text, needle) {
  let count = 0;
  let index = 0;
  while ((index = text.indexOf(needle, index)) !== -1) { count += 1; index += needle.length; }
  return count;
}
function replaceExact(text, from, to, expected, label) {
  const count = occurrences(text, from);
  need(count === expected, `${label} replacement count ${count} != ${expected}`);
  return { text: text.split(from).join(to), count };
}

function materialize() {
  const source = fs.readFileSync(SOURCE_PATH, "utf8");
  need(sha256(source) === SOURCE_SHA256, "frozen v1 runner SHA-256 mismatch");
  let text = source;
  const counts = {};
  function apply(from, to, expected, label) {
    const row = replaceExact(text, from, to, expected, label);
    text = row.text;
    counts[label] = row.count;
  }

  apply("prereg/STAGE_1_DEVELOPMENT_SPEC.json", "prereg/STAGE_1_V2_DEVELOPMENT_SPEC.json", 1, "spec-path");
  apply("prereg/UPSTREAM_IDENTITY_FIREWALL.json", "prereg/UPSTREAM_IDENTITY_FIREWALL_V2.json", 1, "firewall-path");
  apply("authorizations/STAGE_1_AUTHORIZATION.json", "authorizations/STAGE_1_V2_AUTHORIZATION.json", 1, "authorization-path");
  apply("BRSGT-S1-DEVELOPMENT-2026-09-27-v1", "BRSGT-S1-DEVELOPMENT-2026-09-27-v2", 1, "stage-id");
  apply('path.join(DOC, "results/stage-1")', 'path.join(DOC, "results/stage-1-v2")', 1, "default-output-path");
  apply("freshScientificSeedReads,", "freshScientificSeedReads: freshSeedReads,", 4, "fresh-read-counter-mapping");

  const authLine = 'const AUTH = JSON.parse(fs.readFileSync(path.join(DOC, "authorizations/STAGE_1_V2_AUTHORIZATION.json"), "utf8"));';
  const authConditional = 'const AUTH = process.env.BRSGT_STAGE1_V2_PRE_FRESH_SELF_TEST === "1"\n  ? { studyId: "BRSGT-STUDY1", stageId: "BRSGT-S1-DEVELOPMENT-2026-09-27-v2" }\n  : JSON.parse(fs.readFileSync(path.join(DOC, "authorizations/STAGE_1_V2_AUTHORIZATION.json"), "utf8"));';
  apply(authLine, authConditional, 1, "self-test-auth-loader");

  const tryNeed = '  try {\n    need(SPEC.studyId === "BRSGT-STUDY1" && AUTH.studyId === SPEC.studyId, "study identity mismatch");';
  const selfTestGate = `  try {\n    if (process.env.BRSGT_STAGE1_V2_PRE_FRESH_SELF_TEST === "1") throw new Error("${SELF_TEST_MARKER}");\n    need(SPEC.studyId === "BRSGT-STUDY1" && AUTH.studyId === SPEC.studyId, "study identity mismatch");`;
  apply(tryNeed, selfTestGate, 1, "catch-self-test-gate");

  need(!text.includes("40813001"), "generated v2 runner directly contains v1 seed namespace");
  need(!text.includes("freshScientificSeedReads,"), "unfixed freshScientificSeedReads shorthand remains");
  return { source, generated: text, counts };
}

function emit(target) {
  const { source, generated, counts } = materialize();
  const resolved = path.resolve(target);
  need(path.dirname(resolved) === path.join(ROOT, "tools/experiments"), "generated runner must remain in tools/experiments");
  fs.writeFileSync(resolved, generated);
  return {
    disposition: "BRSGT-STAGE1-V2-RUNNER-MATERIALIZED",
    sourcePath: path.relative(ROOT, SOURCE_PATH),
    sourceSha256: sha256(source),
    generatedPath: path.relative(ROOT, resolved),
    generatedSha256: sha256(generated),
    replacementCounts: counts,
  };
}

function selfTest() {
  const generatedPath = path.join(ROOT, "tools/experiments/.brsgt-stage1-v2-selftest.generated.js");
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "brsgt-s1-v2-selftest-"));
  try {
    const meta = emit(generatedPath);
    const child = cp.spawnSync(process.execPath, [generatedPath, "--output", outputDir], {
      cwd: ROOT,
      env: { ...process.env, BRSGT_STAGE1_V2_PRE_FRESH_SELF_TEST: "1", GITHUB_RUN_ATTEMPT: "1" },
      encoding: "utf8",
    });
    need(child.status === 2, `catch self-test exit status ${child.status} != 2`);
    const failurePath = path.join(outputDir, "STAGE_1_FAILURE.json");
    need(fs.existsSync(failurePath), "catch self-test did not create STAGE_1_FAILURE.json");
    const failure = JSON.parse(fs.readFileSync(failurePath, "utf8"));
    need(failure.stageDisposition === "STAGE1-TECHNICAL-INVALID", "catch self-test disposition mismatch");
    need(failure.technicalError === SELF_TEST_MARKER, "catch self-test error marker mismatch");
    need(failure.freshScientificSeedReads === 0, "catch self-test fresh read count must be zero");
    need(failure.noRescueBoundaryCrossed === false, "catch self-test crossed no-rescue boundary");
    need(failure.firstSeedRead === null && failure.lastSeedRead === null, "catch self-test seed identity must remain null");
    need(failure.stage2SeedReads === 0 && failure.g4_10Depth11AccessCount === 0, "catch self-test protected-read count mismatch");
    return {
      disposition: "BRSGT-STAGE1-V2-CATCH-SELF-TEST-PASS",
      freshScientificSeedReads: 0,
      noRescueBoundaryCrossed: false,
      failureArtifactCreated: true,
      technicalError: failure.technicalError,
      materialization: meta,
    };
  } finally {
    try { fs.rmSync(generatedPath, { force: true }); } catch {}
    try { fs.rmSync(outputDir, { recursive: true, force: true }); } catch {}
  }
}

function main() {
  const mode = process.argv[2];
  if (mode === "--self-test") {
    console.log(JSON.stringify(selfTest(), null, 2));
    return;
  }
  if (mode === "--emit") {
    const target = process.argv[3];
    need(target, "--emit requires a target path");
    console.log(JSON.stringify(emit(target), null, 2));
    return;
  }
  throw new Error("usage: materialize-brsgt-stage1-v2-runner.js --self-test | --emit <tools/experiments/path>");
}

main();
