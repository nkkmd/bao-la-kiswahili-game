#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const BASE = "doc/geometry-conditioned-search-reliability-exact-agreement";
const STUDY_PATH = `${BASE}/prereg/STUDY_1_SPEC.json`;
const STAGE_PATH = `${BASE}/prereg/STAGE_0_TECHNICAL_SPEC.json`;
const AUTH_PATH = `${BASE}/authorizations/STAGE_0_AUTHORIZATION.json`;
const TRIGGER_PATH = `${BASE}/executions/STAGE_0_TRIGGER.json`;
const PROD_PATH = "tools/experiments/lib/gcsrea-stage0-production.js";
const INDEP_PATH = "tools/experiments/lib/gcsrea-stage0-independent.js";
const RUNNER_PATH = "tools/experiments/run-gcsrea-stage0-technical.js";
const SEARCH_PROD_PATH = "tools/experiments/lib/silgm-production.js";
const SEARCH_INDEP_PATH = "tools/experiments/lib/silgm-independent.js";

function need(value, message) {
  if (!value) throw new Error(message);
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function json(rel) {
  return JSON.parse(read(rel));
}

function sha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function git(args) {
  return cp.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function main() {
  const study = json(STUDY_PATH);
  const stage = json(STAGE_PATH);
  const auth = json(AUTH_PATH);
  const trigger = json(TRIGGER_PATH);

  need(study.studyId === "GCSREA-STUDY1", "study identity mismatch");
  need(study.status === "PREREGISTERED-STAGE0-ONLY", "study status mismatch");
  need(study.candidateFutureNamespaces.stage1.authorizedForRead === false, "Stage 1 namespace unexpectedly readable");
  need(study.candidateFutureNamespaces.stage2.authorizedForRead === false, "Stage 2 namespace unexpectedly readable");
  need(study.exactModuleBoundary.stage0ActualExactDomainMeasurement === false, "Stage 0 exact-domain measurement unexpectedly enabled");

  need(stage.studyId === study.studyId, "stage study mismatch");
  need(stage.stageId === "GCSREA-S0-TECHNICAL-2026-09-27-v1", "stage id mismatch");
  need(stage.evidenceClass === "TECHNICAL-FIXTURE", "stage evidence class mismatch");
  need(stage.freshScientificSeedAccessAuthorized === false, "fresh scientific access unexpectedly authorized");
  need(stage.scientificOutcomeAuthorized === false, "scientific outcome unexpectedly authorized");
  need(stage.g4_05ExactDomainScientificMeasurementAuthorized === false, "G4-05 scientific measurement unexpectedly authorized");
  need(stage.protectedDepth11AccessAuthorized === false, "G4-10 depth11 access unexpectedly authorized");
  need(stage.relativeDepth === 5, "relative depth mismatch");
  need(stage.resourceCeiling.maxGeometryRootMeasurements === 2, "geometry resource ceiling mismatch");
  need(stage.resourceCeiling.maxExactSemanticFixtures === 5, "exact semantic fixture ceiling mismatch");

  need(auth.studyId === study.studyId && auth.stageId === stage.stageId, "authorization identity mismatch");
  need(auth.decision === "AUTHORIZED", "Stage 0 not authorized");
  need(auth.authorizationType === "TECHNICAL-ONLY", "authorization type mismatch");
  need(auth.maxExecutions === 1, "Stage 0 execution count must be one");
  need(auth.freshScientificSeedAccessAuthorized === false, "authorization permits fresh scientific access");
  need(auth.scientificOutcomeAuthorized === false, "authorization permits scientific outcome");
  need(auth.g4_05ExactDomainScientificMeasurementAuthorized === false, "authorization permits G4-05 scientific measurement");
  need(auth.protectedDepth11AccessAuthorized === false, "authorization permits depth11 access");
  need(auth.publicAiChangeAuthorized === false, "authorization permits public AI change");
  need(auth.executionBinding && auth.executionBinding.status === "FROZEN", "execution binding not frozen");
  need(auth.executionBinding.branch === "research/g4-09-search-reliability-exact-agreement", "branch binding mismatch");
  need(/^[0-9a-f]{40}$/.test(auth.executionBinding.auditedSourceSha), "invalid audited source SHA");

  need(trigger.studyId === study.studyId && trigger.stageId === stage.stageId, "trigger identity mismatch");
  need(trigger.authorizationReviewId === auth.reviewId, "trigger review mismatch");
  need(trigger.executionIntent === "TECHNICAL-ONLY", "trigger intent mismatch");
  need(trigger.freshScientificSeedAccess === false, "trigger requests scientific seed access");
  need(trigger.g4_05ExactDomainScientificMeasurement === false, "trigger requests G4-05 scientific measurement");
  need(trigger.protectedDepth11Access === false, "trigger requests depth11 access");
  need(trigger.publicAiChange === false, "trigger requests public AI change");

  const currentBranch = process.env.GITHUB_REF_NAME || git(["rev-parse", "--abbrev-ref", "HEAD"]);
  need(currentBranch === auth.executionBinding.branch, `unexpected branch ${currentBranch}`);
  const head = git(["rev-parse", "HEAD"]);
  git(["merge-base", "--is-ancestor", auth.executionBinding.auditedSourceSha, head]);

  const changedText = git(["diff", "--name-only", `${auth.executionBinding.auditedSourceSha}..HEAD`]);
  const changed = changedText ? changedText.split(/\r?\n/).filter(Boolean) : [];
  const allowed = new Set([AUTH_PATH, TRIGGER_PATH]);
  need(changed.length === 2, `unexpected post-audit change count: ${changed.length}`);
  need(changed.every((file) => allowed.has(file)), `unauthorized post-audit path: ${changed.join(",")}`);
  need(changed.includes(AUTH_PATH) && changed.includes(TRIGGER_PATH), "authorization/trigger path missing after audit");

  const prod = read(PROD_PATH);
  const indep = read(INDEP_PATH);
  const runner = read(RUNNER_PATH);
  const searchProd = read(SEARCH_PROD_PATH);
  const searchIndep = read(SEARCH_INDEP_PATH);
  need(sha256(prod) !== sha256(indep), "production and independent semantic implementations must differ");
  need(sha256(searchProd) !== sha256(searchIndep), "upstream search implementations must differ");
  need(runner.includes("silgm-production.js") && runner.includes("silgm-independent.js"), "runner dual search binding missing");
  need(runner.includes("gcsrea-stage0-production.js") && runner.includes("gcsrea-stage0-independent.js"), "runner dual semantic binding missing");
  need(!runner.includes("40913001") && !runner.includes("40923001"), "runner references future scientific namespace");
  need(!runner.includes("STAGE_2_CANONICAL_RESULT_SUMMARY.json"), "runner references G4-05 formal result artifact");
  need(!runner.includes("reachable-late-game-exact-microdomain-oracle-foundation"), "runner references actual G4-05 domain files");

  console.log(JSON.stringify({
    disposition: "STAGE0-BINDING-PASS",
    studyId: study.studyId,
    stageId: stage.stageId,
    auditedSourceSha: auth.executionBinding.auditedSourceSha,
    head,
    branch: currentBranch,
    postAuditChangedPaths: changed,
    productionSha256: sha256(prod),
    independentSha256: sha256(indep),
    searchProductionSha256: sha256(searchProd),
    searchIndependentSha256: sha256(searchIndep),
    freshScientificSeedAccessAuthorized: false,
    g4_05ExactDomainScientificMeasurementAuthorized: false,
    g4_10Depth11AccessAuthorized: false,
    publicAiChangeAuthorized: false
  }, null, 2));
}

main();
