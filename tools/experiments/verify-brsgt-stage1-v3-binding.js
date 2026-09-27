#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = "doc/rule-semantic-geometry-transition/prereg/STAGE_1_V3_DEVELOPMENT_SPEC.json";
const FIREWALL_PATH = "doc/rule-semantic-geometry-transition/prereg/UPSTREAM_IDENTITY_FIREWALL_V3.json";
const AUTH_PATH = "doc/rule-semantic-geometry-transition/authorizations/STAGE_1_V3_AUTHORIZATION.json";
const TRIGGER_PATH = "doc/rule-semantic-geometry-transition/executions/STAGE_1_V3_TRIGGER.json";
const MATERIALIZER_PATH = "tools/experiments/materialize-brsgt-stage1-v3-runner.js";

function need(value, message) { if (!value) throw new Error(message); }
function readJson(rel) { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")); }
function git(args) { return cp.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
function fileSha(rel) { return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex"); }

function main() {
  const spec = readJson(SPEC_PATH);
  const firewall = readJson(FIREWALL_PATH);
  const auth = readJson(AUTH_PATH);
  const trigger = readJson(TRIGGER_PATH);

  need(spec.studyId === "BRSGT-STUDY1" && spec.stageId === "BRSGT-S1-DEVELOPMENT-2026-09-27-v3", "Stage1 v3 spec identity mismatch");
  need(spec.formalInferenceAllowed === false, "formal inference unexpectedly allowed");
  need(spec.effectValueRetentionAllowed === false && spec.effectSignRetentionAllowed === false, "effect-retention blindness mismatch");
  need(spec.seedBlock.start === 40815001 && spec.seedBlock.end === 40815512 && spec.seedBlock.slots === 512, "v3 seed block mismatch");
  need(Array.isArray(spec.quarantinedPriorStage1Blocks) && spec.quarantinedPriorStage1Blocks.length === 2, "prior Stage1 quarantine count mismatch");
  need(spec.quarantinedPriorStage1Blocks.every(row => row.reuseAuthorized === false), "prior Stage1 seed reuse unexpectedly authorized");
  need(spec.preflightLimitContract.preFreshContractSelfTestRequired === true, "preflight-contract self-test requirement missing");
  need(spec.failureHandling.catchPathSelfTestRequiredBeforeAuthorization === true && spec.failureHandling.preflightContractSelfTestRequiredBeforeAuthorization === true, "pre-fresh self-test requirements missing");
  need(spec.candidateStage2.authorizedForRead === false, "Stage2 seed access unexpectedly authorized");
  need(spec.protected.g4_10Depth11Access === false && spec.protected.publicAiChange === false && spec.protected.mainIntegration === false, "protected boundary mismatch");

  need(firewall.targetStage === spec.stageId && firewall.status === "FROZEN-PRE-FRESH", "v3 firewall identity/status mismatch");
  need(firewall.stage1Reservation.start === spec.seedBlock.start && firewall.stage1Reservation.end === spec.seedBlock.end && firewall.stage1Reservation.accessed === false, "v3 firewall reservation mismatch");
  need(Array.isArray(firewall.priorStage1Reservations) && firewall.priorStage1Reservations.length === 2 && firewall.priorStage1Reservations.every(row => row.reuseAuthorized === false), "v3 firewall prior-block quarantine mismatch");
  need(firewall.excludedSeedNamespaces.some(row => row.range === "40813001..40813512"), "v1 namespace absent from exclusions");
  need(firewall.excludedSeedNamespaces.some(row => row.range === "40814001..40814512"), "v2 namespace absent from exclusions");
  need(firewall.g4_08Stage1V1ScientificEvidenceReuse === false && firewall.g4_08Stage1V2ScientificEvidenceReuse === false, "prior Stage1 scientific evidence reuse unexpectedly enabled");
  need(firewall.g4_10Depth11Access === false && firewall.publicAiChange === false, "firewall protected boundary mismatch");

  need(auth.studyId === spec.studyId && auth.stageId === spec.stageId, "authorization identity mismatch");
  need(auth.reviewId === spec.authorizationReviewId, "authorization review mismatch");
  need(auth.decision === "AUTHORIZED" && auth.authorizationType === "FRESH-DEVELOPMENT-ONE-SHOT", "Stage1 v3 not one-shot authorized");
  need(auth.maxScientificExecutions === 1 && auth.singleAttemptOnly === true, "v3 must be exactly one scientific attempt");
  need(auth.formalInferenceAuthorized === false, "authorization permits formal inference");
  need(auth.effectValueRetentionAuthorized === false && auth.effectSignRetentionAuthorized === false, "authorization permits effect retention");
  need(auth.stage2SeedAccessAuthorized === false && auth.g4_10Depth11AccessAuthorized === false, "authorization permits protected evidence access");
  need(auth.publicAiChangeAuthorized === false && auth.mainIntegrationAuthorized === false, "authorization permits deployment/integration");
  need(auth.seedBlock.start === spec.seedBlock.start && auth.seedBlock.end === spec.seedBlock.end && auth.seedBlock.slots === spec.seedBlock.slots, "authorization seed block mismatch");
  need(auth.priorStage1V1SeedReuseAuthorized === false && auth.priorStage1V2SeedReuseAuthorized === false, "authorization permits prior Stage1 seed reuse");
  need(auth.executionBinding && auth.executionBinding.status === "FROZEN", "execution binding not frozen");
  need(auth.executionBinding.branch === "research/g4-08-rule-semantic-geometry-transition", "authorization branch mismatch");
  need(/^[0-9a-f]{40}$/.test(auth.executionBinding.auditedSourceSha), "invalid audited source SHA");
  need(/^[0-9a-f]{64}$/.test(auth.executionBinding.generatedRunnerSha256), "invalid generated runner SHA-256");
  need(auth.executionBinding.materializerSha256 === fileSha(MATERIALIZER_PATH), "materializer SHA-256 differs from authorized binding");
  need(auth.executionBinding.specSha256 === fileSha(SPEC_PATH), "v3 spec SHA-256 differs from authorized binding");
  need(auth.executionBinding.firewallSha256 === fileSha(FIREWALL_PATH), "v3 firewall SHA-256 differs from authorized binding");

  need(trigger.studyId === spec.studyId && trigger.stageId === spec.stageId, "trigger identity mismatch");
  need(trigger.authorizationReviewId === auth.reviewId, "trigger authorization review mismatch");
  need(trigger.executionIntent === "FRESH-DEVELOPMENT-ONE-SHOT", "trigger intent mismatch");
  need(trigger.seedBlock.start === spec.seedBlock.start && trigger.seedBlock.end === spec.seedBlock.end && trigger.seedBlock.slots === spec.seedBlock.slots, "trigger seed block mismatch");
  need(trigger.formalInference === false && trigger.effectValueRetention === false && trigger.effectSignRetention === false, "trigger blindness mismatch");
  need(trigger.stage2SeedAccess === false && trigger.protectedDepth11Access === false && trigger.publicAiChange === false && trigger.mainIntegration === false, "trigger protected boundary mismatch");
  need(trigger.priorStage1V1SeedReuse === false && trigger.priorStage1V2SeedReuse === false, "trigger permits prior Stage1 seed reuse");
  need(trigger.auditedSourceSha === auth.executionBinding.auditedSourceSha, "trigger audited source mismatch");
  need(trigger.expectedGeneratedRunnerSha256 === auth.executionBinding.generatedRunnerSha256, "trigger generated runner mismatch");

  const branch = process.env.GITHUB_REF_NAME || git(["rev-parse", "--abbrev-ref", "HEAD"]);
  need(branch === auth.executionBinding.branch, `unexpected execution branch ${branch}`);
  need(process.env.GITHUB_RUN_ATTEMPT === "1", "scientific workflow run attempt must be exactly 1");
  const head = git(["rev-parse", "HEAD"]);
  git(["merge-base", "--is-ancestor", auth.executionBinding.auditedSourceSha, head]);

  const changedText = git(["diff", "--name-only", `${auth.executionBinding.auditedSourceSha}..HEAD`]);
  const changed = changedText ? changedText.split(/\r?\n/).filter(Boolean) : [];
  const allowed = new Set([AUTH_PATH, TRIGGER_PATH]);
  need(changed.length === 2, `unexpected post-audit change count ${changed.length}`);
  need(changed.every(file => allowed.has(file)), `unauthorized post-audit path: ${changed.join(",")}`);
  need(changed.includes(AUTH_PATH) && changed.includes(TRIGGER_PATH), "v3 authorization/trigger paths not both present after audit");

  console.log(JSON.stringify({
    disposition: "STAGE1-V3-BINDING-PASS",
    studyId: spec.studyId,
    stageId: spec.stageId,
    auditedSourceSha: auth.executionBinding.auditedSourceSha,
    executionHead: head,
    branch,
    postAuditChangedPaths: changed,
    seedBlock: auth.seedBlock,
    priorStage1V1SeedReuseAuthorized: false,
    priorStage1V2SeedReuseAuthorized: false,
    maxScientificExecutions: 1,
    generatedRunnerSha256: auth.executionBinding.generatedRunnerSha256,
    materializerSha256: auth.executionBinding.materializerSha256,
    formalInferenceAuthorized: false,
    effectValueRetentionAuthorized: false,
    effectSignRetentionAuthorized: false,
    stage2SeedAccessAuthorized: false,
    g4_10Depth11AccessAuthorized: false,
    publicAiChangeAuthorized: false,
    mainIntegrationAuthorized: false
  }, null, 2));
}

main();
