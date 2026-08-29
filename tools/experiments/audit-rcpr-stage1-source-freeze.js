#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const childProcess = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const SCIENTIFIC_SOURCE_COMMIT = "a69ffce86cb278680ee676a2a9469aeb1d9ab1d4";
const EXPECTED_BASELINE_MAIN = "37480777246aa306c6ca3d0679d936b5e0107071";
const EXPECTED_SPEC_SHA256 = "813b99ed64cc3af1438119f513faf6be64e7c6b6d6015a0fff5c962b58ef1fbb";
const SPEC_PATH = "doc/rich-critical-position-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json";
const ADDENDUM_PATH = "doc/rich-critical-position-representation/preregistration/STAGE_1_EXECUTION_ADDENDUM.json";
const AUTH_PATH = "doc/rich-critical-position-representation/authorizations/STAGE_1_EXECUTE.json";
const DEFAULT_OUT = path.join(ROOT, "artifacts/local/rich-critical-position-representation/stage1-source-freeze-audit-v1");

const SCIENTIFIC_SOURCE_PATHS = Object.freeze([
  SPEC_PATH,
  ADDENDUM_PATH,
  "public/engine.js",
  "public/ai.js",
  "public/ai-config.js",
  "public/ai-weights.js",
  "tools/benchmark.js",
  "tools/experiments/lib/position-complexity-search-diagnostic.js",
  "tools/experiments/lib/rcpr-production.js",
  "tools/experiments/lib/rcpr-independent.js",
  "tools/experiments/lib/rcpr-stage1-production.js",
  "tools/experiments/lib/rcpr-stage1-independent.js",
  "tools/experiments/lib/rcpr-stage1-independent-corpus.js",
  "tools/experiments/lib/rcpr-stage1-independent-model.js",
  "tools/experiments/run-rcpr-stage1-development.js",
  "tools/experiments/verify-rcpr-stage1-independent.js",
  ".github/workflows/rcpr-stage1-development.yml"
]);

function ensure(condition, message) { if (!condition) throw new Error(message); }
function git(args) { return childProcess.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
function sha256File(relativePath) { return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, relativePath))).digest("hex"); }
function parseOut() { const at = process.argv.indexOf("--out"); return at >= 0 && process.argv[at + 1] ? path.resolve(process.argv[at + 1]) : DEFAULT_OUT; }
function writeJson(filePath, value) { fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8"); }

function run() {
  const outDir = parseOut();
  ensure(git(["status", "--porcelain"]) === "", "source-freeze audit requires a clean checkout");
  ensure(!fs.existsSync(path.join(ROOT, AUTH_PATH)), "Stage 1 authorization already exists; preauthorization audit refused");
  childProcess.execFileSync("git", ["cat-file", "-e", `${SCIENTIFIC_SOURCE_COMMIT}^{commit}`], { cwd: ROOT });
  childProcess.execFileSync("git", ["merge-base", "--is-ancestor", SCIENTIFIC_SOURCE_COMMIT, "HEAD"], { cwd: ROOT });

  const currentHead = git(["rev-parse", "HEAD"]);
  const baselineMain = git(["rev-parse", "origin/main"]);
  ensure(baselineMain === EXPECTED_BASELINE_MAIN, `remote main drift: ${baselineMain}`);

  const spec = JSON.parse(fs.readFileSync(path.join(ROOT, SPEC_PATH), "utf8"));
  const addendum = JSON.parse(fs.readFileSync(path.join(ROOT, ADDENDUM_PATH), "utf8"));
  const specSha256 = sha256File(SPEC_PATH);
  const executionAddendumSha256 = sha256File(ADDENDUM_PATH);
  ensure(specSha256 === EXPECTED_SPEC_SHA256, `Stage 1 spec SHA256 drift: ${specSha256}`);
  ensure(spec.studyId === "RCPR-STUDY1" && spec.stageId === "RCPR-S1-DEVELOPMENT-2026-08-28-v1", "Stage 1 spec identity drift");
  ensure(spec.developmentOutcomeGenerationAuthorizedBySpecAlone === false, "spec-alone authorization firewall drift");
  ensure(spec.scientificInferenceAuthorized === false, "Stage 1 scientific inference authorization drift");
  ensure(spec.sourcePopulation.games === 3072 && spec.sourcePopulation.seedStart === 28610001 && spec.sourcePopulation.seedEnd === 28613072, "Stage 1 source population drift");
  ensure(spec.sourcePopulation.seedUse === "CONSUME-ONCE-DEVELOPMENT-ONLY", "Stage 1 seed-use contract drift");
  ensure(addendum.parentStage1SpecSha256 === specSha256, "execution addendum parent spec hash mismatch");
  ensure(addendum.scientificOutcomeGeneratedBeforeFreeze === false && addendum.scientificDesignChanged === false, "execution addendum prospective boundary drift");
  ensure(addendum.authorization?.separateExplicitAuthorizationStillRequired === true, "separate authorization gate drift");
  ensure(addendum.resourceContract?.productionAndIndependentMustUseSeparateJobs === true, "job separation resource gate drift");

  const sourceBlobHashes = {};
  const sourceSha256 = {};
  for (const relativePath of SCIENTIFIC_SOURCE_PATHS) {
    const absolute = path.join(ROOT, relativePath);
    ensure(fs.existsSync(absolute), `missing scientific source path: ${relativePath}`);
    const currentBlob = git(["hash-object", relativePath]);
    const frozenBlob = git(["rev-parse", `${SCIENTIFIC_SOURCE_COMMIT}:${relativePath}`]);
    ensure(currentBlob === frozenBlob, `scientific source drift after freeze: ${relativePath}`);
    sourceBlobHashes[relativePath] = frozenBlob;
    sourceSha256[relativePath] = sha256File(relativePath);
  }

  const result = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    auditId: "RCPR-S1-SOURCE-FREEZE-AUDIT-2026-08-29-v1",
    status: "PASS",
    scientificInferenceAuthorized: false,
    scientificOutcomeGeneratedByAudit: false,
    scientificStage1SeedBlockConsumedByAudit: false,
    authorizationAbsent: true,
    baselineMainSha: baselineMain,
    scientificSourceCommit: SCIENTIFIC_SOURCE_COMMIT,
    auditCommit: currentHead,
    specSha256,
    executionAddendumSha256,
    sourceBlobHashes,
    sourceSha256,
    scientificSourcePaths: SCIENTIFIC_SOURCE_PATHS,
    seedBlock: { games: spec.sourcePopulation.games, start: spec.sourcePopulation.seedStart, end: spec.sourcePopulation.seedEnd, use: spec.sourcePopulation.seedUse },
    implementationValidation: {
      finalSmokeRunId: 33195723195,
      finalSmokeJobId: 98932225577,
      finalSmokeArtifactId: 9695647002,
      finalSmokeArtifactZipSha256: "9d87a3aba46e69952061aa3b30a628f41fe6525db69299634bf1386716273a11",
      productionSmokeSha256: "e8c7a944876b370f0516b8b4dc2a1176e649202fc08354dc4663503a01d54611",
      independentSmokeSha256: "e0e335e85f6759178f510dc50d6ca585c35c4aa10aa933045c2f6a6f1cf89bc4"
    },
    resourcePreflight: {
      runId: 33195349152,
      jobId: 98930953453,
      artifactId: 9695494212,
      artifactZipSha256: "aec9f6c4c5bca8308ace21bfa47b17bc400e7215ecde8a69395b6183c560f4b1",
      resultSha256: "48682f9bf2c11cb7c3410d1620fe1a127cd4108befa2ddae88f20bb4697e32c0"
    },
    authorizationDisposition: "ELIGIBLE-FOR-SEPARATE-EXPLICIT-AUTHORIZATION",
    stage2Authorized: false,
    failClosed: true
  };
  const canonical = JSON.stringify(result, Object.keys(result).sort());
  result.auditEnvelopeSha256 = crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
  writeJson(path.join(outDir, "source-freeze-audit.json"), result);
  console.log(JSON.stringify(result, null, 2));
}

try { run(); } catch (error) { console.error(error.stack || error.message || String(error)); process.exitCode = 1; }
