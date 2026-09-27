#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const FW = require("./lib/brsgt-stage1-firewall.js");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/rule-semantic-geometry-transition");
const SPEC_PATH = path.join(DOC, "prereg/STAGE_1_DEVELOPMENT_SPEC.json");
const FIREWALL_PATH = path.join(DOC, "prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const RUNNER_PATH = path.join(ROOT, "tools/experiments/run-brsgt-stage1-development.js");
const PROD_PATH = path.join(ROOT, "tools/experiments/lib/brsgt-production.js");
const INDEP_PATH = path.join(ROOT, "tools/experiments/lib/brsgt-independent.js");
const BINDING_PATH = path.join(ROOT, "tools/experiments/verify-brsgt-stage1-binding.js");
const WORKFLOW_PATH = path.join(ROOT, ".github/workflows/brsgt-stage1-development.yml");
const AUTH_PATH = path.join(DOC, "authorizations/STAGE_1_AUTHORIZATION.json");
const TRIGGER_PATH = path.join(DOC, "executions/STAGE_1_TRIGGER.json");

function need(value, message) { if (!value) throw new Error(message); }
function sha256Bytes(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function fileSha(file) { return sha256Bytes(fs.readFileSync(file)); }
function text(file) { return fs.readFileSync(file, "utf8"); }
function before(haystack, first, second, message) {
  const a = haystack.indexOf(first);
  const b = haystack.indexOf(second);
  need(a >= 0 && b >= 0 && a < b, message);
}

function main() {
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  const firewall = JSON.parse(fs.readFileSync(FIREWALL_PATH, "utf8"));
  const runner = text(RUNNER_PATH);
  const binding = text(BINDING_PATH);
  const workflow = text(WORKFLOW_PATH);
  const upstreamRoot = process.env.BRSGT_STAGE1_UPSTREAM_DIR;

  // The static audit itself must remain strictly pre-fresh.
  need(!fs.existsSync(AUTH_PATH), "Stage1 scientific authorization already exists during pre-fresh audit");
  need(!fs.existsSync(TRIGGER_PATH), "Stage1 scientific trigger already exists during pre-fresh audit");

  need(spec.studyId === "BRSGT-STUDY1", "Stage1 study identity mismatch");
  need(spec.stageId === "BRSGT-S1-DEVELOPMENT-2026-09-27-v1", "Stage1 stage identity mismatch");
  need(spec.statusAtFreeze.includes("EXECUTION-NOT-AUTHORIZED"), "Stage1 should remain execution-not-authorized during static audit");
  need(spec.scientificExecutionAuthorized === false, "Stage1 scientific execution unexpectedly authorized");
  need(spec.formalInferenceAllowed === false, "formal inference unexpectedly allowed");
  need(spec.effectValueRetentionAllowed === false && spec.effectSignRetentionAllowed === false, "Stage1 blindness contract invalid");
  need(spec.seedBlock.start === 40813001 && spec.seedBlock.end === 40813512 && spec.seedBlock.slots === 512, "Stage1 seed block mismatch");
  need(spec.seedBlock.scanRule === "READ-ALL-SLOTS-IN-ASCENDING-ORDER", "Stage1 scan rule mismatch");
  need(spec.supportFamily.metrics.length === 6, "metric family count mismatch");
  need(spec.eventUnitSelection.eventFamilies.length === 4, "event family count mismatch");
  need(spec.supportFamily.minimumExactDefinedPerPolicy === 6 && spec.supportFamily.minimumExactDefinedCombined === 12, "support gate mismatch");
  need(spec.measurementSelection.targetPerFamilyPerPolicy === 8 && spec.resourceCeilings.maxMeasuredEventUnits === 64, "measurement target mismatch");
  need(spec.geometry.relativeDepth === 5 && spec.geometry.representation === "RAW-ONLY", "geometry contract mismatch");
  need(spec.candidateStage2.authorizedForRead === false, "Stage2 seed access unexpectedly authorized");
  need(spec.protected.g4_10Depth11Access === false && spec.protected.publicAiChange === false, "protected boundary invalid");

  need(firewall.status === "FROZEN-PRE-FRESH", "firewall status mismatch");
  need(firewall.stage1Reservation.start === spec.seedBlock.start && firewall.stage1Reservation.end === spec.seedBlock.end, "firewall Stage1 reservation mismatch");
  need(firewall.stage1Reservation.accessed === false, "firewall says Stage1 already accessed");
  need(firewall.g3_06ScientificEvidenceReuse === false && firewall.g4_07ScientificEffectReuse === false, "historical science reuse boundary invalid");
  need(firewall.g4_10Depth11Access === false && firewall.publicAiChange === false, "firewall protected boundary invalid");

  // Development workflow must be trigger-only and must verify binding before the runner.
  need(workflow.includes("doc/rule-semantic-geometry-transition/executions/STAGE_1_TRIGGER.json"), "development workflow trigger path missing");
  need(!workflow.includes("workflow_dispatch:") && !workflow.includes("schedule:"), "development workflow has an alternate execution trigger");
  need(workflow.includes("node tools/experiments/verify-brsgt-stage1-binding.js"), "development workflow binding verifier missing");
  need(workflow.includes("node tools/experiments/run-brsgt-stage1-development.js"), "development workflow runner missing");
  before(workflow, "node tools/experiments/verify-brsgt-stage1-binding.js", "node tools/experiments/run-brsgt-stage1-development.js", "development runner can execute before binding verification");
  need(workflow.includes("BRSGT_STAGE1_EXECUTION_TRIGGER_OK: '1'"), "development workflow execution-trigger environment guard missing");

  // Binding verifier must freeze branch/source and permit only auth + trigger after the audit head.
  need(binding.includes("STAGE_1_AUTHORIZATION.json") && binding.includes("STAGE_1_TRIGGER.json"), "binding verifier auth/trigger inputs missing");
  need(binding.includes('auth.decision === "AUTHORIZED"'), "binding verifier authorization decision gate missing");
  need(binding.includes('auth.authorizationType === "FRESH-DEVELOPMENT-ONE-SHOT"'), "binding verifier one-shot authorization gate missing");
  need(binding.includes("auth.maxScientificExecutions === 1"), "binding verifier exactly-once gate missing");
  need(binding.includes("GITHUB_RUN_ATTEMPT") && binding.includes('=== "1"'), "binding verifier attempt-one guard missing");
  need(binding.includes("changed.length === 2"), "binding verifier post-audit change-count gate missing");
  need(binding.includes("const allowed = new Set([AUTH_PATH, TRIGGER_PATH])"), "binding verifier post-audit path allowlist missing");
  need(binding.includes("auth.stage2SeedAccessAuthorized === false") && binding.includes("auth.g4_10Depth11AccessAuthorized === false"), "binding verifier protected-evidence gate missing");
  need(binding.includes("auth.publicAiChangeAuthorized === false") && binding.includes("auth.mainIntegrationAuthorized === false"), "binding verifier deployment/integration gate missing");

  // Runner ordering: authorization and execution guards -> firewall -> first fresh seed read.
  need(runner.includes('AUTH.decision === "AUTHORIZED"'), "runner authorization gate missing");
  need(runner.includes('AUTH.authorizationType === "FRESH-DEVELOPMENT-ONE-SHOT"'), "runner one-shot authorization gate missing");
  need(runner.includes("AUTH.maxScientificExecutions === 1"), "runner exactly-once authorization gate missing");
  need(runner.includes("BRSGT_STAGE1_EXECUTION_TRIGGER_OK") && runner.includes("GITHUB_RUN_ATTEMPT"), "runner execution/attempt guards missing");
  need(runner.includes("FW.materialize"), "runner does not materialize firewall");
  before(runner, 'AUTH.decision === "AUTHORIZED"', "FW.materialize", "runner firewall can materialize before authorization gate");
  before(runner, "FW.materialize", "for (let seed = SPEC.seedBlock.start", "runner fresh loop precedes firewall materialization");
  need(runner.includes("effectValuesRetained: false") && runner.includes("effectSignsRetained: false"), "runner output blindness guards missing");
  need(runner.includes("exactDefined") && runner.includes("supportSlots"), "runner support-only path missing");
  need(!runner.includes("40823001"), "runner directly references Stage2 seed namespace");
  need(!runner.includes("31610001") && !runner.includes("31620001"), "runner directly references G3-06 scientific seed namespace");

  // Relay-limit/source error behavior must agree independently and fail closed before candidate use.
  need(runner.includes("function replayResult"), "runner replay error wrapper missing");
  need(runner.includes("need(a.ok === b.ok"), "runner production/independent replay-status agreement gate missing");
  need(runner.includes("need(a.error === b.error"), "runner production/independent replay-error agreement gate missing");
  need(runner.includes('a.error.includes("relay-limit") ? "SOURCE-RELAY-LIMIT" : "SOURCE-ERROR"'), "runner relay-limit source rejection rule missing");
  need(runner.includes("if (relayLimit(transition.post)) continue;"), "runner relay-limit candidate exclusion missing");
  need(fileSha(PROD_PATH) !== fileSha(INDEP_PATH), "production/independent BRSGT implementations are byte-identical");

  need(upstreamRoot && fs.existsSync(upstreamRoot), "static audit upstream directory missing");
  const materialized = FW.materialize({ repoRoot: ROOT, upstreamRoot, firewall });
  need(materialized.summary.freshStage1SeedAccessDuringMaterialization === false, "static firewall materialization accessed fresh data");

  console.log(JSON.stringify({
    disposition: "STAGE1-PRE-FRESH-STATIC-AUDIT-PASS",
    auditScopeVersion: 2,
    studyId: spec.studyId,
    stageId: spec.stageId,
    auditHeadSha: process.env.GITHUB_SHA || null,
    specSha256: fileSha(SPEC_PATH),
    firewallSpecSha256: fileSha(FIREWALL_PATH),
    runnerSha256: fileSha(RUNNER_PATH),
    productionSha256: fileSha(PROD_PATH),
    independentSha256: fileSha(INDEP_PATH),
    bindingVerifierSha256: fileSha(BINDING_PATH),
    developmentWorkflowSha256: fileSha(WORKFLOW_PATH),
    scientificAuthorizationPresentAtAudit: false,
    scientificTriggerPresentAtAudit: false,
    firewallDigestSha256: materialized.summary.firewallDigestSha256,
    firewallSetSizes: materialized.summary.setSizes,
    freshScientificSeedReads: 0,
    stage2SeedReads: 0,
    g4_10Depth11AccessCount: 0,
    publicAiChanged: false
  }, null, 2));
}

main();
