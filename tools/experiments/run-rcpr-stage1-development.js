"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const childProcess = require("node:child_process");
const P = require("./lib/rcpr-stage1-production.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/rich-critical-position-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/rich-critical-position-representation/authorizations/STAGE_1_EXECUTE.json");
const DEFAULT_OUT = path.join(ROOT, "artifacts/local/rich-critical-position-representation/stage1-development-v1");

function ensure(condition, message) { if (!condition) throw new Error(message); }
function sha256File(filePath) { return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex"); }
function gitBlob(relativePath) { return childProcess.execFileSync("git", ["hash-object", relativePath], { cwd: ROOT, encoding: "utf8" }).trim(); }
function gitText(args) { return childProcess.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
function writeJson(filePath, value) { fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8"); }
function parseOutDir() { const at = process.argv.indexOf("--out"); return at >= 0 && process.argv[at + 1] ? path.resolve(process.argv[at + 1]) : DEFAULT_OUT; }

function validateAuthorization(spec) {
  ensure(fs.existsSync(AUTH_PATH), "Stage 1 execution authorization absent; scientific development run refused");
  const auth = JSON.parse(fs.readFileSync(AUTH_PATH, "utf8"));
  ensure(auth.studyId === spec.studyId, "authorization studyId mismatch");
  ensure(auth.stageId === spec.stageId, "authorization stageId mismatch");
  ensure(auth.status === "AUTHORIZED", "Stage 1 authorization status is not AUTHORIZED");
  ensure(auth.scientificDevelopmentOutcomeGenerationAuthorized === true, "Stage 1 outcome generation is not explicitly authorized");
  ensure(auth.specSha256 === sha256File(SPEC_PATH), "Stage 1 spec hash mismatch");
  ensure(auth.sourceBlobHashes && typeof auth.sourceBlobHashes === "object", "authorization sourceBlobHashes missing");
  for (const [relativePath, expected] of Object.entries(auth.sourceBlobHashes)) {
    ensure(gitBlob(relativePath) === expected, `authorized source blob drift: ${relativePath}`);
  }
  return { auth, authorizationSha256: sha256File(AUTH_PATH) };
}

function run() {
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  ensure(spec.studyId === "RCPR-STUDY1", "unexpected studyId");
  ensure(spec.stageId === "RCPR-S1-DEVELOPMENT-2026-08-28-v1", "unexpected stageId");
  ensure(spec.developmentOutcomeGenerationAuthorizedBySpecAlone === false, "spec-alone authorization firewall missing");
  ensure(spec.scientificInferenceAuthorized === false, "Stage 1 must remain development-only");
  const { auth, authorizationSha256 } = validateAuthorization(spec);
  ensure(gitText(["status", "--porcelain"]) === "", "source tree must be clean");

  const outDir = parseOutDir();
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const development = P.runDevelopment(spec);
  const result = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    baselineMainSha: spec.baselineMainSha,
    scientificInferenceAuthorized: false,
    developmentOutcomeGenerationAuthorized: true,
    confirmatoryReuseAllowed: false,
    sourceCommit: process.env.GITHUB_SHA || gitText(["rev-parse", "HEAD"]),
    workflow: {
      runId: process.env.GITHUB_RUN_ID || null,
      runAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
      jobName: process.env.GITHUB_JOB || null,
    },
    specSha256: sha256File(SPEC_PATH),
    authorizationSha256,
    authorizationSourceFreezeCommit: auth.sourceFreezeCommit || null,
    sourceBlobHashes: auth.sourceBlobHashes,
    development,
  };
  result.productionResultSha256 = P.canonicalHash(result);
  writeJson(path.join(outDir, "production-result.json"), result);
  console.log(JSON.stringify({
    status: development.readiness.productionDisposition,
    generatedGames: development.selection.generatedGames,
    selectedRoots: development.rows.length,
    primaryEstimable: development.readiness.counts.primaryEstimable,
    highDivergence: development.readiness.counts.highDivergence,
    lowDivergence: development.readiness.counts.lowDivergence,
    selectedFamilySetId: development.model.selectedFamilySetId || null,
    overallAuc: development.model.overallAuc ?? null,
    productionResultSha256: result.productionResultSha256,
  }, null, 2));
}

try { run(); }
catch (error) { console.error(error.stack || error.message || String(error)); process.exitCode = 1; }
