#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const FW = require("./lib/brsgt-stage1-firewall.js");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/rule-semantic-geometry-transition");
const SPEC_PATH = path.join(DOC, "prereg/STAGE_1_V2_DEVELOPMENT_SPEC.json");
const FIREWALL_PATH = path.join(DOC, "prereg/UPSTREAM_IDENTITY_FIREWALL_V2.json");
const AUTH_PATH = path.join(DOC, "authorizations/STAGE_1_V2_AUTHORIZATION.json");
const TRIGGER_PATH = path.join(DOC, "executions/STAGE_1_V2_TRIGGER.json");
const V1_RUNNER_PATH = path.join(ROOT, "tools/experiments/run-brsgt-stage1-development.js");
const MATERIALIZER_PATH = path.join(ROOT, "tools/experiments/materialize-brsgt-stage1-v2-runner.js");
const BINDING_PATH = path.join(ROOT, "tools/experiments/verify-brsgt-stage1-v2-binding.js");
const PROD_PATH = path.join(ROOT, "tools/experiments/lib/brsgt-production.js");
const INDEP_PATH = path.join(ROOT, "tools/experiments/lib/brsgt-independent.js");
const DEV_WORKFLOW_PATH = path.join(ROOT, ".github/workflows/brsgt-stage1-v2-development.yml");
const STATIC_WORKFLOW_PATH = path.join(ROOT, ".github/workflows/brsgt-stage1-v2-preauth-static.yml");
const EXPECTED_V1_RUNNER_SHA256 = "9f5bd50a4027fb5df97788d98203f177f53b5ee31326fdc6fd4ed847505f2b12";

function need(value, message) { if (!value) throw new Error(message); }
function sha256Bytes(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function fileSha(file) { return sha256Bytes(fs.readFileSync(file)); }
function git(args) { return cp.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
function parseJsonStdout(child, label) {
  need(child.status === 0, `${label} failed: ${child.stderr || child.stdout}`);
  return JSON.parse(child.stdout);
}
function count(text, needle) { return text.split(needle).length - 1; }

function main() {
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  const firewall = JSON.parse(fs.readFileSync(FIREWALL_PATH, "utf8"));
  const materializer = fs.readFileSync(MATERIALIZER_PATH, "utf8");
  const binding = fs.readFileSync(BINDING_PATH, "utf8");
  const developmentWorkflow = fs.readFileSync(DEV_WORKFLOW_PATH, "utf8");
  const staticWorkflow = fs.readFileSync(STATIC_WORKFLOW_PATH, "utf8");

  need(spec.studyId === "BRSGT-STUDY1", "v2 study identity mismatch");
  need(spec.stageId === "BRSGT-S1-DEVELOPMENT-2026-09-27-v2", "v2 stage identity mismatch");
  need(spec.statusAtFreeze.includes("EXECUTION-NOT-AUTHORIZED"), "v2 should remain execution-not-authorized during static audit");
  need(spec.scientificExecutionAuthorized === false, "v2 scientific execution unexpectedly authorized");
  need(spec.formalInferenceAllowed === false, "v2 formal inference unexpectedly allowed");
  need(spec.effectValueRetentionAllowed === false && spec.effectSignRetentionAllowed === false, "v2 blindness contract invalid");
  need(spec.seedBlock.start === 40814001 && spec.seedBlock.end === 40814512 && spec.seedBlock.slots === 512, "v2 seed block mismatch");
  need(spec.seedBlock.scanRule === "READ-ALL-SLOTS-IN-ASCENDING-ORDER", "v2 scan rule mismatch");
  need(spec.quarantinedPriorStage1Block.start === 40813001 && spec.quarantinedPriorStage1Block.end === 40813512 && spec.quarantinedPriorStage1Block.reuseAuthorized === false, "v1 quarantine contract mismatch");
  need(spec.supportFamily.metrics.length === 6 && spec.eventUnitSelection.eventFamilies.length === 4, "v2 metric/event family count mismatch");
  need(spec.supportFamily.minimumExactDefinedPerPolicy === 6 && spec.supportFamily.minimumExactDefinedCombined === 12, "v2 support gate mismatch");
  need(spec.measurementSelection.targetPerFamilyPerPolicy === 8 && spec.resourceCeilings.maxMeasuredEventUnits === 64, "v2 measurement target mismatch");
  need(spec.geometry.relativeDepth === 5 && spec.geometry.representation === "RAW-ONLY", "v2 geometry contract mismatch");
  need(spec.failureHandling.failureArtifactRequired === true && spec.failureHandling.catchPathSelfTestRequiredBeforeAuthorization === true, "v2 failure-handling contract mismatch");
  need(spec.candidateStage2.authorizedForRead === false, "Stage2 seed access unexpectedly authorized");
  need(spec.protected.g4_10Depth11Access === false && spec.protected.publicAiChange === false && spec.protected.mainIntegration === false, "v2 protected boundary invalid");

  need(!fs.existsSync(AUTH_PATH), "v2 scientific authorization must be absent during static audit");
  need(!fs.existsSync(TRIGGER_PATH), "v2 scientific trigger must be absent during static audit");

  need(firewall.studyId === spec.studyId && firewall.targetStage === spec.stageId, "v2 firewall identity mismatch");
  need(firewall.status === "FROZEN-PRE-FRESH", "v2 firewall status mismatch");
  need(firewall.stage1Reservation.start === spec.seedBlock.start && firewall.stage1Reservation.end === spec.seedBlock.end && firewall.stage1Reservation.count === spec.seedBlock.slots, "v2 firewall reservation mismatch");
  need(firewall.stage1Reservation.accessed === false, "v2 firewall says fresh reservation already accessed");
  need(firewall.priorStage1V1Reservation.start === 40813001 && firewall.priorStage1V1Reservation.end === 40813512 && firewall.priorStage1V1Reservation.reuseAuthorized === false, "v1 firewall quarantine mismatch");
  need(firewall.excludedSeedNamespaces.some((row) => row.range === "40813001..40813512"), "v1 seed block missing from v2 exclusions");
  need(firewall.g4_08Stage1V1ScientificEvidenceReuse === false, "v1 scientific evidence reuse boundary invalid");
  need(firewall.g4_10Depth11Access === false && firewall.publicAiChange === false, "v2 firewall protected boundary invalid");

  need(fileSha(V1_RUNNER_PATH) === EXPECTED_V1_RUNNER_SHA256, "frozen v1 runner content changed");
  need(materializer.includes(EXPECTED_V1_RUNNER_SHA256), "materializer does not pin frozen v1 runner hash");
  need(materializer.includes('replace all') === false, "materializer contains ambiguous free-form replacement marker");
  need(materializer.includes('"fresh-read-counter-mapping"') && materializer.includes(', 4, "fresh-read-counter-mapping"'), "materializer does not require four fresh-read counter fixes");
  need(materializer.includes("BRSGT-STAGE1-V2-CATCH-SELF-TEST"), "materializer catch self-test marker missing");

  need(binding.includes("STAGE_1_V2_AUTHORIZATION.json") && binding.includes("STAGE_1_V2_TRIGGER.json"), "v2 binding paths missing");
  need(binding.includes("changed.length === 2"), "v2 binding does not enforce two post-audit changes");
  need(binding.includes('GITHUB_RUN_ATTEMPT === "1"'), "v2 binding attempt-one guard missing");
  need(binding.includes("priorStage1V1SeedReuseAuthorized === false"), "v2 binding v1 seed-reuse guard missing");
  need(binding.includes("generatedRunnerSha256"), "v2 binding generated-runner hash guard missing");

  need(developmentWorkflow.includes("doc/rule-semantic-geometry-transition/executions/STAGE_1_V2_TRIGGER.json"), "v2 development workflow trigger path missing");
  need(!developmentWorkflow.includes("doc/rule-semantic-geometry-transition/executions/STAGE_1_TRIGGER.json"), "v2 development workflow can be triggered by v1 trigger");
  need(developmentWorkflow.includes("Run pre-fresh catch-path self-test"), "v2 development workflow self-test step missing");
  need(developmentWorkflow.includes("Materialize frozen v2 runner"), "v2 development workflow materialization step missing");
  need(developmentWorkflow.includes("Verify generated runner hash against authorization"), "v2 generated-runner authorization check missing");
  need(developmentWorkflow.includes("results/stage-1-v2"), "v2 development workflow output isolation missing");
  need(developmentWorkflow.indexOf("Run pre-fresh catch-path self-test") < developmentWorkflow.indexOf("Run one-shot fresh Stage 1 v2 development"), "v2 self-test occurs after fresh execution");
  need(developmentWorkflow.indexOf("Verify one-shot authorization and frozen source binding") < developmentWorkflow.indexOf("Run one-shot fresh Stage 1 v2 development"), "v2 binding check occurs after fresh execution");

  need(staticWorkflow.includes("doc/rule-semantic-geometry-transition/executions/STAGE_1_V2_STATIC_AUDIT_TRIGGER.json"), "v2 static workflow trigger missing");
  need(!staticWorkflow.includes("STAGE_1_V2_TRIGGER.json"), "v2 static workflow is coupled to scientific trigger");
  need(fileSha(PROD_PATH) !== fileSha(INDEP_PATH), "production/independent BRSGT implementations are byte-identical");

  const selfTest = parseJsonStdout(cp.spawnSync(process.execPath, [MATERIALIZER_PATH, "--self-test"], { cwd: ROOT, encoding: "utf8" }), "v2 catch self-test");
  need(selfTest.disposition === "BRSGT-STAGE1-V2-CATCH-SELF-TEST-PASS", "v2 catch self-test disposition mismatch");
  need(selfTest.freshScientificSeedReads === 0 && selfTest.noRescueBoundaryCrossed === false && selfTest.failureArtifactCreated === true, "v2 catch self-test boundary mismatch");

  const generatedPath = path.join(ROOT, "tools/experiments/.brsgt-stage1-v2-static.generated.js");
  let materialization;
  let generated;
  try {
    materialization = parseJsonStdout(cp.spawnSync(process.execPath, [MATERIALIZER_PATH, "--emit", generatedPath], { cwd: ROOT, encoding: "utf8" }), "v2 runner materialization");
    const syntax = cp.spawnSync(process.execPath, ["--check", generatedPath], { cwd: ROOT, encoding: "utf8" });
    need(syntax.status === 0, `generated v2 runner syntax invalid: ${syntax.stderr}`);
    generated = fs.readFileSync(generatedPath, "utf8");
    need(generated.includes("STAGE_1_V2_DEVELOPMENT_SPEC.json") && generated.includes("UPSTREAM_IDENTITY_FIREWALL_V2.json") && generated.includes("STAGE_1_V2_AUTHORIZATION.json"), "generated v2 runner bindings missing");
    need(generated.includes("BRSGT-S1-DEVELOPMENT-2026-09-27-v2"), "generated v2 runner stage identity missing");
    need(count(generated, "freshScientificSeedReads: freshSeedReads,") === 4, "generated v2 runner fresh-read mappings != 4");
    need(count(generated, "freshScientificSeedReads,") === 0, "generated v2 runner retains undefined fresh-read shorthand");
    need(generated.includes("BRSGT-STAGE1-V2-CATCH-SELF-TEST"), "generated v2 runner self-test gate missing");
    need(generated.indexOf("FW.materialize") < generated.indexOf("for (let seed = SPEC.seedBlock.start"), "generated v2 runner fresh loop precedes firewall materialization");
    need(!generated.includes("40813001") && !generated.includes("40823001"), "generated v2 runner directly references protected seed namespace");
  } finally {
    try { fs.rmSync(generatedPath, { force: true }); } catch {}
  }

  const upstreamRoot = process.env.BRSGT_STAGE1_UPSTREAM_DIR;
  need(upstreamRoot && fs.existsSync(upstreamRoot), "v2 static audit upstream directory missing");
  const materializedFirewall = FW.materialize({ repoRoot: ROOT, upstreamRoot, firewall });
  need(materializedFirewall.summary.freshStage1SeedAccessDuringMaterialization === false, "v2 static firewall materialization accessed fresh data");

  console.log(JSON.stringify({
    disposition: "STAGE1-V2-PRE-FRESH-STATIC-AUDIT-PASS",
    auditScopeVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    auditHeadSha: git(["rev-parse", "HEAD"]),
    specSha256: fileSha(SPEC_PATH),
    firewallSpecSha256: fileSha(FIREWALL_PATH),
    v1RunnerSha256: fileSha(V1_RUNNER_PATH),
    materializerSha256: fileSha(MATERIALIZER_PATH),
    bindingVerifierSha256: fileSha(BINDING_PATH),
    developmentWorkflowSha256: fileSha(DEV_WORKFLOW_PATH),
    staticWorkflowSha256: fileSha(STATIC_WORKFLOW_PATH),
    generatedRunnerSha256: materialization.generatedSha256,
    replacementCounts: materialization.replacementCounts,
    catchSelfTestDisposition: selfTest.disposition,
    catchSelfTestFreshScientificSeedReads: 0,
    scientificAuthorizationPresentAtAudit: false,
    scientificTriggerPresentAtAudit: false,
    priorStage1V1SeedBlockQuarantined: true,
    firewallDigestSha256: materializedFirewall.summary.firewallDigestSha256,
    firewallSetSizes: materializedFirewall.summary.setSizes,
    freshScientificSeedReads: 0,
    stage2SeedReads: 0,
    g4_10Depth11AccessCount: 0,
    publicAiChanged: false
  }, null, 2));
}

main();
