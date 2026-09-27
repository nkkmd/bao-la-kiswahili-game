#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const STUDY_PATH = "doc/rule-semantic-geometry-transition/prereg/STUDY_1_SPEC.json";
const STAGE_PATH = "doc/rule-semantic-geometry-transition/prereg/STAGE_0_TECHNICAL_SPEC.json";
const AUTH_PATH = "doc/rule-semantic-geometry-transition/authorizations/STAGE_0_AUTHORIZATION.json";
const TRIGGER_PATH = "doc/rule-semantic-geometry-transition/executions/STAGE_0_TRIGGER.json";
const PROD_PATH = "tools/experiments/lib/brsgt-production.js";
const INDEP_PATH = "tools/experiments/lib/brsgt-independent.js";
const RUNNER_PATH = "tools/experiments/run-brsgt-stage0-technical.js";

function need(value, message) { if (!value) throw new Error(message); }
function read(rel) { return fs.readFileSync(path.join(ROOT, rel), "utf8"); }
function json(rel) { return JSON.parse(read(rel)); }
function sha256(text) { return crypto.createHash("sha256").update(text).digest("hex"); }
function git(args) { return cp.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }

function main() {
  const study = json(STUDY_PATH);
  const stage = json(STAGE_PATH);
  const auth = json(AUTH_PATH);
  const trigger = json(TRIGGER_PATH);

  need(study.studyId === "BRSGT-STUDY1", "study identity mismatch");
  need(study.status === "PREREGISTERED-STAGE0-ONLY", "study status mismatch");
  need(study.candidateFutureNamespaces.authorizedForRead === false, "future scientific namespace unexpectedly readable");
  need(stage.studyId === study.studyId, "stage study mismatch");
  need(stage.stageId === "BRSGT-S0-TECHNICAL-2026-09-27-v1", "stage id mismatch");
  need(stage.evidenceClass === "TECHNICAL-FIXTURE", "stage evidence class mismatch");
  need(stage.freshScientificSeedAccessAuthorized === false, "fresh scientific seed access unexpectedly authorized");
  need(stage.scientificOutcomeAuthorized === false, "scientific outcome unexpectedly authorized");
  need(stage.protectedDepth11AccessAuthorized === false, "G4-10 depth11 access unexpectedly authorized");
  need(stage.relativeDepth === 5, "relative depth mismatch");
  need(stage.resourceCeiling.maxGeometryRootMeasurements === 8, "geometry resource ceiling mismatch");
  need(stage.resourceCeiling.maxEventTransitionsMaterialized === 128, "transition resource ceiling mismatch");

  need(auth.studyId === study.studyId && auth.stageId === stage.stageId, "authorization identity mismatch");
  need(auth.decision === "AUTHORIZED", "Stage 0 not authorized");
  need(auth.authorizationType === "TECHNICAL-ONLY", "authorization type mismatch");
  need(auth.freshScientificSeedAccessAuthorized === false, "authorization permits fresh scientific access");
  need(auth.scientificOutcomeAuthorized === false, "authorization permits scientific outcome");
  need(auth.protectedDepth11AccessAuthorized === false, "authorization permits depth11 access");
  need(auth.executionBinding && auth.executionBinding.status === "FROZEN", "execution binding not frozen");
  need(auth.executionBinding.branch === "research/g4-08-rule-semantic-geometry-transition", "branch binding mismatch");
  need(/^[0-9a-f]{40}$/.test(auth.executionBinding.auditedSourceSha), "invalid audited source SHA");

  need(trigger.studyId === study.studyId && trigger.stageId === stage.stageId, "trigger identity mismatch");
  need(trigger.authorizationReviewId === auth.reviewId, "trigger review mismatch");
  need(trigger.executionIntent === "TECHNICAL-ONLY", "trigger intent mismatch");
  need(trigger.freshScientificSeedAccess === false, "trigger requests scientific seed access");
  need(trigger.protectedDepth11Access === false, "trigger requests depth11 access");

  const currentBranch = process.env.GITHUB_REF_NAME || git(["rev-parse", "--abbrev-ref", "HEAD"]);
  need(currentBranch === auth.executionBinding.branch, `unexpected branch ${currentBranch}`);
  const head = git(["rev-parse", "HEAD"]);
  need(git(["merge-base", "--is-ancestor", auth.executionBinding.auditedSourceSha, head]) === "", "audited source is not ancestor");

  const changedText = git(["diff", "--name-only", `${auth.executionBinding.auditedSourceSha}..HEAD`]);
  const changed = changedText ? changedText.split(/\r?\n/).filter(Boolean) : [];
  const allowed = new Set([AUTH_PATH, TRIGGER_PATH]);
  need(changed.length === 2, `unexpected post-audit change count: ${changed.length}`);
  need(changed.every((file) => allowed.has(file)), `unauthorized post-audit path: ${changed.join(",")}`);
  need(changed.includes(AUTH_PATH) && changed.includes(TRIGGER_PATH), "authorization/trigger path missing after audit");

  const prod = read(PROD_PATH);
  const indep = read(INDEP_PATH);
  const runner = read(RUNNER_PATH);
  need(sha256(prod) !== sha256(indep), "production and independent implementation bytes must differ");
  need(prod.includes("lgtgmiv-stage1-production.js"), "production upstream binding missing");
  need(indep.includes("lgtgmiv-stage1-independent.js"), "independent upstream binding missing");
  need(runner.includes("brsgt-production.js") && runner.includes("brsgt-independent.js"), "runner dual implementation binding missing");
  need(runner.includes("production/independent unit-by-unit selection mismatch"), "unit-by-unit selection fail-closed guard missing");
  need(!runner.includes("40813001") && !runner.includes("40823001"), "runner references future scientific seed namespace");
  need(!prod.includes("31610001") && !indep.includes("31610001"), "G3-06 scientific seed reference detected");

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
    freshScientificSeedAccessAuthorized: false,
    g4_10Depth11AccessAuthorized: false
  }, null, 2));
}

main();
