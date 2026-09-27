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
const CATCH_SELF_TEST_MARKER = "BRSGT-STAGE1-V3-CATCH-SELF-TEST";
const PREFLIGHT_SELF_TEST_SEED = 44015001;

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

  apply("prereg/STAGE_1_DEVELOPMENT_SPEC.json", "prereg/STAGE_1_V3_DEVELOPMENT_SPEC.json", 1, "spec-path");
  apply("prereg/UPSTREAM_IDENTITY_FIREWALL.json", "prereg/UPSTREAM_IDENTITY_FIREWALL_V3.json", 1, "firewall-path");
  apply("authorizations/STAGE_1_AUTHORIZATION.json", "authorizations/STAGE_1_V3_AUTHORIZATION.json", 1, "authorization-path");
  apply("BRSGT-S1-DEVELOPMENT-2026-09-27-v1", "BRSGT-S1-DEVELOPMENT-2026-09-27-v3", 1, "stage-id");
  apply('path.join(DOC, "results/stage-1")', 'path.join(DOC, "results/stage-1-v3")', 1, "default-output-path");
  apply("freshScientificSeedReads,", "freshScientificSeedReads: freshSeedReads,", 4, "fresh-read-counter-mapping");
  apply("globalDistinctRawStates: source.maxDistinctRawStates,", "distinctRawStates: source.maxDistinctRawStates,", 1, "limit-distinct-raw-states");
  apply("uniqueCanonicalTransitions: source.maxUniqueTransitions,", "uniqueTransitions: source.maxUniqueTransitions,", 1, "limit-unique-transitions");
  apply("legalMoveVariantsEnumerated: source.maxLegalMoveEvaluations,", "legalMoveEvaluations: source.maxLegalMoveEvaluations,", 1, "limit-legal-move-evaluations");

  const authLine = 'const AUTH = JSON.parse(fs.readFileSync(path.join(DOC, "authorizations/STAGE_1_V3_AUTHORIZATION.json"), "utf8"));';
  const authConditional = 'const AUTH = (process.env.BRSGT_STAGE1_V3_PRE_FRESH_CATCH_SELF_TEST === "1" || process.env.BRSGT_STAGE1_V3_PRE_FRESH_PREFLIGHT_SELF_TEST === "1")\n  ? { studyId: "BRSGT-STUDY1", stageId: "BRSGT-S1-DEVELOPMENT-2026-09-27-v3" }\n  : JSON.parse(fs.readFileSync(path.join(DOC, "authorizations/STAGE_1_V3_AUTHORIZATION.json"), "utf8"));';
  apply(authLine, authConditional, 1, "self-test-auth-loader");

  const tryNeed = '  try {\n    need(SPEC.studyId === "BRSGT-STUDY1" && AUTH.studyId === SPEC.studyId, "study identity mismatch");';
  const selfTestGate = `  try {\n    if (process.env.BRSGT_STAGE1_V3_PRE_FRESH_CATCH_SELF_TEST === "1") throw new Error("${CATCH_SELF_TEST_MARKER}");\n    if (process.env.BRSGT_STAGE1_V3_PRE_FRESH_PREFLIGHT_SELF_TEST === "1") {\n      const limits = rawLimits();\n      const stateP = E.initialState();\n      const stateI = E.initialState();\n      const a = TP.preflightContinuous(E, stateP, ${PREFLIGHT_SELF_TEST_SEED}, 0, limits);\n      const b = TI.preflightContinuous(E, stateI, ${PREFLIGHT_SELF_TEST_SEED}, 0, limits);\n      same(a, b, "v3 preflight-contract production/independent mismatch");\n      console.log(JSON.stringify({\n        disposition: "BRSGT-STAGE1-V3-PREFLIGHT-CONTRACT-SELF-TEST-PASS",\n        technicalSeed: ${PREFLIGHT_SELF_TEST_SEED},\n        limitKeys: Object.keys(limits).sort(),\n        limits,\n        result: a,\n        freshScientificSeedReads: freshSeedReads,\n        noRescueBoundaryCrossed,\n        stage2SeedReads: 0,\n        g4_10Depth11AccessCount: 0\n      }, null, 2));\n      return;\n    }\n    need(SPEC.studyId === "BRSGT-STUDY1" && AUTH.studyId === SPEC.studyId, "study identity mismatch");`;
  apply(tryNeed, selfTestGate, 1, "pre-fresh-self-test-gates");

  need(!text.includes("40813001") && !text.includes("40814001"), "generated v3 runner directly contains prior Stage1 seed namespace");
  need(!text.includes("freshScientificSeedReads,"), "unfixed freshScientificSeedReads shorthand remains");
  need(!text.includes("globalDistinctRawStates: source.maxDistinctRawStates"), "old distinctRawStates limit key remains");
  need(!text.includes("uniqueCanonicalTransitions: source.maxUniqueTransitions"), "old uniqueTransitions limit key remains");
  need(!text.includes("legalMoveVariantsEnumerated: source.maxLegalMoveEvaluations"), "old legalMoveEvaluations limit key remains");
  return { source, generated: text, counts };
}

function emit(target) {
  const { source, generated, counts } = materialize();
  const resolved = path.resolve(target);
  need(path.dirname(resolved) === path.join(ROOT, "tools/experiments"), "generated runner must remain in tools/experiments");
  fs.writeFileSync(resolved, generated);
  return {
    disposition: "BRSGT-STAGE1-V3-RUNNER-MATERIALIZED",
    sourcePath: path.relative(ROOT, SOURCE_PATH),
    sourceSha256: sha256(source),
    generatedPath: path.relative(ROOT, resolved),
    generatedSha256: sha256(generated),
    replacementCounts: counts,
  };
}

function runGenerated(generatedPath, outputDir, env) {
  return cp.spawnSync(process.execPath, [generatedPath, "--output", outputDir], {
    cwd: ROOT,
    env: { ...process.env, GITHUB_RUN_ATTEMPT: "1", ...env },
    encoding: "utf8",
  });
}

function selfTest() {
  const generatedPath = path.join(ROOT, "tools/experiments/.brsgt-stage1-v3-selftest.generated.js");
  const catchOutput = fs.mkdtempSync(path.join(os.tmpdir(), "brsgt-s1-v3-catch-"));
  const preflightOutput = fs.mkdtempSync(path.join(os.tmpdir(), "brsgt-s1-v3-preflight-"));
  try {
    const meta = emit(generatedPath);

    const caught = runGenerated(generatedPath, catchOutput, { BRSGT_STAGE1_V3_PRE_FRESH_CATCH_SELF_TEST: "1" });
    need(caught.status === 2, `catch self-test exit status ${caught.status} != 2`);
    const failurePath = path.join(catchOutput, "STAGE_1_FAILURE.json");
    need(fs.existsSync(failurePath), "catch self-test did not create STAGE_1_FAILURE.json");
    const failure = JSON.parse(fs.readFileSync(failurePath, "utf8"));
    need(failure.stageDisposition === "STAGE1-TECHNICAL-INVALID", "catch self-test disposition mismatch");
    need(failure.technicalError === CATCH_SELF_TEST_MARKER, "catch self-test error marker mismatch");
    need(failure.freshScientificSeedReads === 0, "catch self-test fresh read count must be zero");
    need(failure.noRescueBoundaryCrossed === false, "catch self-test crossed no-rescue boundary");
    need(failure.firstSeedRead === null && failure.lastSeedRead === null, "catch self-test seed identity must remain null");

    const preflight = runGenerated(generatedPath, preflightOutput, { BRSGT_STAGE1_V3_PRE_FRESH_PREFLIGHT_SELF_TEST: "1" });
    need(preflight.status === 0, `preflight-contract self-test failed: ${preflight.stderr || preflight.stdout}`);
    const row = JSON.parse(preflight.stdout);
    need(row.disposition === "BRSGT-STAGE1-V3-PREFLIGHT-CONTRACT-SELF-TEST-PASS", "preflight self-test disposition mismatch");
    const required = ["distinctRawStates", "legalMoveEvaluations", "parentExpansions", "treeNodeOccurrences", "uniqueTransitions"].sort();
    need(JSON.stringify(row.limitKeys) === JSON.stringify(required), `preflight limit key set mismatch ${JSON.stringify(row.limitKeys)}`);
    need(row.freshScientificSeedReads === 0 && row.noRescueBoundaryCrossed === false, "preflight self-test crossed fresh boundary");
    need(row.stage2SeedReads === 0 && row.g4_10Depth11AccessCount === 0, "preflight self-test protected-read count mismatch");

    return {
      disposition: "BRSGT-STAGE1-V3-PRE-FRESH-SELF-TESTS-PASS",
      catchSelfTest: {
        disposition: "PASS",
        freshScientificSeedReads: 0,
        noRescueBoundaryCrossed: false,
        failureArtifactCreated: true,
        technicalError: failure.technicalError,
      },
      preflightContractSelfTest: row,
      materialization: meta,
    };
  } finally {
    try { fs.rmSync(generatedPath, { force: true }); } catch {}
    try { fs.rmSync(catchOutput, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(preflightOutput, { recursive: true, force: true }); } catch {}
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
  throw new Error("usage: materialize-brsgt-stage1-v3-runner.js --self-test | --emit <tools/experiments/path>");
}

main();
