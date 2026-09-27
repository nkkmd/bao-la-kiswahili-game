#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const STUDY_PATH = "doc/rule-semantic-geometry-transition/prereg/STUDY_1_SPEC.json";
const STAGE_PATH = "doc/rule-semantic-geometry-transition/prereg/STAGE_0_V2_TECHNICAL_SPEC.json";
const AUTH_PATH = "doc/rule-semantic-geometry-transition/authorizations/STAGE_0_V2_AUTHORIZATION.json";
const TRIGGER_PATH = "doc/rule-semantic-geometry-transition/executions/STAGE_0_V2_TRIGGER.json";
const PROD_PATH = "tools/experiments/lib/brsgt-production.js";
const INDEP_PATH = "tools/experiments/lib/brsgt-independent.js";
const RUNNER_PATH = "tools/experiments/run-brsgt-stage0-v2-technical.js";

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
  need(study.status === "PREREGISTERED-STAGE0-V2-PREPARATION-ONLY", "study status mismatch");
  need(study.candidateFutureNamespaces.authorizedForRead === false, "future scientific namespace unexpectedly readable");
  need(Array.isArray(study.stages.stage0Versions), "stage0 version ledger missing");
  need(study.stages.stage0Versions.some((row) => row.stageId === "BRSGT-S0-TECHNICAL-2026-09-27-v1" && row.disposition.includes("TECHNICAL-INVALID")), "v1 closure missing");

  need(stage.studyId === study.studyId, "v2 stage study mismatch");
  need(stage.stageId === "BRSGT-S0-TECHNICAL-2026-09-27-v2", "v2 stage id mismatch");
  need(stage.supersedesTechnicalStage.includes("v1") && stage.supersedesTechnicalStage.includes("NO-RERUN"), "v1 no-rerun boundary missing");
  need(stage.evidenceClass === "TECHNICAL-FIXTURE", "v2 evidence class mismatch");
  need(stage.freshScientificSeedAccessAuthorized === false, "fresh scientific access unexpectedly authorized");
  need(stage.scientificOutcomeAuthorized === false, "scientific outcome unexpectedly authorized");
  need(stage.protectedDepth11AccessAuthorized === false, "G4-10 depth11 access unexpectedly authorized");
  need(stage.relativeDepth === 5, "relative depth mismatch");
  need(stage.resourceCeiling.maxGeometryRootMeasurements === 8, "geometry resource ceiling mismatch");
  need(stage.resourceCeiling.maxEventTransitionsMaterialized === 128, "transition resource ceiling mismatch");
  need(stage.resourceCeiling.maxDeterministicPhaseSearchPlies === 160, "phase search ceiling mismatch");

  need(auth.studyId === study.studyId && auth.stageId === stage.stageId, "v2 authorization identity mismatch");
  need(auth.decision === "AUTHORIZED", "Stage 0 v2 not authorized");
  need(auth.authorizationType === "TECHNICAL-ONLY", "v2 authorization type mismatch");
  need(auth.maxExecutions === 1, "v2 execution count must be exactly one");
  need(auth.freshScientificSeedAccessAuthorized === false, "v2 authorization permits fresh scientific access");
  need(auth.scientificOutcomeAuthorized === false, "v2 authorization permits scientific outcome");
  need(auth.protectedDepth11AccessAuthorized === false, "v2 authorization permits depth11 access");
  need(auth.executionBinding && auth.executionBinding.status === "FROZEN", "v2 execution binding not frozen");
  need(auth.executionBinding.branch === "research/g4-08-rule-semantic-geometry-transition", "v2 branch binding mismatch");
  need(/^[0-9a-f]{40}$/.test(auth.executionBinding.auditedSourceSha), "invalid v2 audited source SHA");

  need(trigger.studyId === study.studyId && trigger.stageId === stage.stageId, "v2 trigger identity mismatch");
  need(trigger.authorizationReviewId === auth.reviewId, "v2 trigger review mismatch");
  need(trigger.executionIntent === "TECHNICAL-ONLY", "v2 trigger intent mismatch");
  need(trigger.freshScientificSeedAccess === false, "v2 trigger requests scientific seed access");
  need(trigger.protectedDepth11Access === false, "v2 trigger requests depth11 access");

  const currentBranch = process.env.GITHUB_REF_NAME || git(["rev-parse", "--abbrev-ref", "HEAD"]);
  need(currentBranch === auth.executionBinding.branch, `unexpected branch ${currentBranch}`);
  const head = git(["rev-parse", "HEAD"]);
  git(["merge-base", "--is-ancestor", auth.executionBinding.auditedSourceSha, head]);

  const changedText = git(["diff", "--name-only", `${auth.executionBinding.auditedSourceSha}..HEAD`]);
  const changed = changedText ? changedText.split(/\r?\n/).filter(Boolean) : [];
  const allowed = new Set([AUTH_PATH, TRIGGER_PATH]);
  need(changed.length === 2, `unexpected v2 post-audit change count: ${changed.length}`);
  need(changed.every((file) => allowed.has(file)), `unauthorized v2 post-audit path: ${changed.join(",")}`);
  need(changed.includes(AUTH_PATH) && changed.includes(TRIGGER_PATH), "v2 authorization/trigger path missing after audit");

  const prod = read(PROD_PATH);
  const indep = read(INDEP_PATH);
  const runner = read(RUNNER_PATH);
  need(sha256(prod) !== sha256(indep), "production and independent implementation bytes must differ");
  need(prod.includes("lgtgmiv-stage1-production.js"), "production upstream binding missing");
  need(indep.includes("lgtgmiv-stage1-independent.js"), "independent upstream binding missing");
  need(runner.includes("representedSeedTotal"), "v2 64-seed fixture validation missing");
  need(runner.includes("findPhaseTransitionFixture"), "v2 deterministic reachable phase fixture missing");
  need(runner.includes("production/independent unit-by-unit selection mismatch"), "v2 unit-by-unit selection fail-closed guard missing");
  need(!runner.includes("40813001") && !runner.includes("40823001"), "v2 runner references future scientific namespace");
  need(!runner.includes("31610001") && !runner.includes("31620001"), "v2 runner references G3-06 scientific namespace");

  console.log(JSON.stringify({
    disposition: "STAGE0-V2-BINDING-PASS",
    studyId: study.studyId,
    stageId: stage.stageId,
    auditedSourceSha: auth.executionBinding.auditedSourceSha,
    head,
    branch: currentBranch,
    postAuditChangedPaths: changed,
    productionSha256: sha256(prod),
    independentSha256: sha256(indep),
    runnerSha256: sha256(runner),
    freshScientificSeedAccessAuthorized: false,
    g4_10Depth11AccessAuthorized: false
  }, null, 2));
}

main();
