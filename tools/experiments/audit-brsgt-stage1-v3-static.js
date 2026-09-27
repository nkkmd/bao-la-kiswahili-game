#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");
const FW = require("./lib/brsgt-stage1-firewall.js");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/rule-semantic-geometry-transition");
const SPEC_PATH = path.join(DOC, "prereg/STAGE_1_V3_DEVELOPMENT_SPEC.json");
const FIREWALL_PATH = path.join(DOC, "prereg/UPSTREAM_IDENTITY_FIREWALL_V3.json");
const AUTH_PATH = path.join(DOC, "authorizations/STAGE_1_V3_AUTHORIZATION.json");
const TRIGGER_PATH = path.join(DOC, "executions/STAGE_1_V3_TRIGGER.json");
const V1_RUNNER_PATH = path.join(ROOT, "tools/experiments/run-brsgt-stage1-development.js");
const MATERIALIZER_PATH = path.join(ROOT, "tools/experiments/materialize-brsgt-stage1-v3-runner.js");
const BINDING_PATH = path.join(ROOT, "tools/experiments/verify-brsgt-stage1-v3-binding.js");
const PROD_PATH = path.join(ROOT, "tools/experiments/lib/brsgt-production.js");
const INDEP_PATH = path.join(ROOT, "tools/experiments/lib/brsgt-independent.js");
const DEV_WORKFLOW_PATH = path.join(ROOT, ".github/workflows/brsgt-stage1-v3-development.yml");
const STATIC_WORKFLOW_PATH = path.join(ROOT, ".github/workflows/brsgt-stage1-v3-preauth-static.yml");
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
function setEq(a, b) { return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort()); }

function main() {
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  const firewall = JSON.parse(fs.readFileSync(FIREWALL_PATH, "utf8"));
  const materializer = fs.readFileSync(MATERIALIZER_PATH, "utf8");
  const binding = fs.readFileSync(BINDING_PATH, "utf8");
  const developmentWorkflow = fs.readFileSync(DEV_WORKFLOW_PATH, "utf8");
  const staticWorkflow = fs.readFileSync(STATIC_WORKFLOW_PATH, "utf8");

  need(spec.studyId === "BRSGT-STUDY1" && spec.stageId === "BRSGT-S1-DEVELOPMENT-2026-09-27-v3", "v3 identity mismatch");
  need(spec.statusAtFreeze.includes("EXECUTION-NOT-AUTHORIZED") && spec.scientificExecutionAuthorized === false, "v3 execution must remain unauthorized during static audit");
  need(spec.formalInferenceAllowed === false && spec.effectValueRetentionAllowed === false && spec.effectSignRetentionAllowed === false, "v3 blindness contract invalid");
  need(spec.seedBlock.start === 40815001 && spec.seedBlock.end === 40815512 && spec.seedBlock.slots === 512, "v3 seed block mismatch");
  need(spec.seedBlock.scanRule === "READ-ALL-SLOTS-IN-ASCENDING-ORDER", "v3 scan rule mismatch");
  need(Array.isArray(spec.quarantinedPriorStage1Blocks) && spec.quarantinedPriorStage1Blocks.length === 2, "v3 prior-block quarantine count mismatch");
  need(spec.quarantinedPriorStage1Blocks.some(row => row.start === 40813001 && row.end === 40813512 && row.reuseAuthorized === false), "v1 quarantine missing from spec");
  need(spec.quarantinedPriorStage1Blocks.some(row => row.start === 40814001 && row.end === 40814512 && row.reuseAuthorized === false), "v2 quarantine missing from spec");
  need(setEq(spec.preflightLimitContract.requiredKeys, ["distinctRawStates", "uniqueTransitions", "parentExpansions", "legalMoveEvaluations", "treeNodeOccurrences"]), "v3 preflight limit contract mismatch");
  need(spec.preflightLimitContract.preFreshContractSelfTestRequired === true, "v3 preflight self-test requirement missing");
  need(spec.failureHandling.catchPathSelfTestRequiredBeforeAuthorization === true && spec.failureHandling.preflightContractSelfTestRequiredBeforeAuthorization === true, "v3 self-test requirements missing");
  need(spec.supportFamily.metrics.length === 6 && spec.eventUnitSelection.eventFamilies.length === 4, "v3 metric/event family count mismatch");
  need(spec.supportFamily.minimumExactDefinedPerPolicy === 6 && spec.supportFamily.minimumExactDefinedCombined === 12, "v3 support gate mismatch");
  need(spec.measurementSelection.targetPerFamilyPerPolicy === 8 && spec.resourceCeilings.maxMeasuredEventUnits === 64, "v3 measurement target mismatch");
  need(spec.geometry.relativeDepth === 5 && spec.geometry.representation === "RAW-ONLY", "v3 geometry contract mismatch");
  need(spec.candidateStage2.authorizedForRead === false, "Stage2 seed access unexpectedly authorized");
  need(spec.protected.g4_10Depth11Access === false && spec.protected.publicAiChange === false && spec.protected.mainIntegration === false, "v3 protected boundary invalid");

  need(!fs.existsSync(AUTH_PATH), "v3 scientific authorization must be absent during static audit");
  need(!fs.existsSync(TRIGGER_PATH), "v3 scientific trigger must be absent during static audit");

  need(firewall.studyId === spec.studyId && firewall.targetStage === spec.stageId && firewall.status === "FROZEN-PRE-FRESH", "v3 firewall identity/status mismatch");
  need(firewall.stage1Reservation.start === spec.seedBlock.start && firewall.stage1Reservation.end === spec.seedBlock.end && firewall.stage1Reservation.count === spec.seedBlock.slots && firewall.stage1Reservation.accessed === false, "v3 firewall reservation mismatch");
  need(Array.isArray(firewall.priorStage1Reservations) && firewall.priorStage1Reservations.length === 2 && firewall.priorStage1Reservations.every(row => row.reuseAuthorized === false), "v3 firewall prior-block quarantine mismatch");
  need(firewall.excludedSeedNamespaces.some(row => row.range === "40813001..40813512"), "v1 block missing from v3 exclusions");
  need(firewall.excludedSeedNamespaces.some(row => row.range === "40814001..40814512"), "v2 block missing from v3 exclusions");
  need(firewall.g4_08Stage1V1ScientificEvidenceReuse === false && firewall.g4_08Stage1V2ScientificEvidenceReuse === false, "prior Stage1 evidence reuse boundary invalid");
  need(firewall.g4_10Depth11Access === false && firewall.publicAiChange === false, "v3 firewall protected boundary invalid");

  need(fileSha(V1_RUNNER_PATH) === EXPECTED_V1_RUNNER_SHA256, "frozen v1 runner content changed");
  need(materializer.includes(EXPECTED_V1_RUNNER_SHA256), "v3 materializer does not pin frozen v1 runner hash");
  need(materializer.includes(', 4, "fresh-read-counter-mapping"'), "v3 materializer does not require four fresh-read counter fixes");
  need(materializer.includes(', 1, "limit-distinct-raw-states"'), "v3 distinctRawStates mapping count guard missing");
  need(materializer.includes(', 1, "limit-unique-transitions"'), "v3 uniqueTransitions mapping count guard missing");
  need(materializer.includes(', 1, "limit-legal-move-evaluations"'), "v3 legalMoveEvaluations mapping count guard missing");
  need(materializer.includes("BRSGT-STAGE1-V3-CATCH-SELF-TEST") && materializer.includes("BRSGT-STAGE1-V3-PREFLIGHT-CONTRACT-SELF-TEST-PASS"), "v3 pre-fresh self-test markers missing");

  need(binding.includes("STAGE_1_V3_AUTHORIZATION.json") && binding.includes("STAGE_1_V3_TRIGGER.json"), "v3 binding paths missing");
  need(binding.includes("changed.length === 2"), "v3 binding does not enforce two post-audit changes");
  need(binding.includes('GITHUB_RUN_ATTEMPT === "1"'), "v3 binding attempt-one guard missing");
  need(binding.includes("priorStage1V1SeedReuseAuthorized === false") && binding.includes("priorStage1V2SeedReuseAuthorized === false"), "v3 prior-seed reuse guards missing");
  need(binding.includes("generatedRunnerSha256"), "v3 binding generated-runner hash guard missing");

  need(developmentWorkflow.includes("doc/rule-semantic-geometry-transition/executions/STAGE_1_V3_TRIGGER.json"), "v3 development trigger path missing");
  need(!developmentWorkflow.includes("doc/rule-semantic-geometry-transition/executions/STAGE_1_V2_TRIGGER.json"), "v3 development workflow can be triggered by v2 trigger");
  need(developmentWorkflow.includes("Run pre-fresh catch and preflight-contract self-tests"), "v3 development workflow self-test step missing");
  need(developmentWorkflow.includes("Materialize frozen v3 runner"), "v3 development workflow materialization step missing");
  need(developmentWorkflow.includes("Verify generated runner hash against authorization"), "v3 generated-runner authorization check missing");
  need(developmentWorkflow.includes("results/stage-1-v3"), "v3 output isolation missing");
  need(developmentWorkflow.indexOf("Run pre-fresh catch and preflight-contract self-tests") < developmentWorkflow.indexOf("Run one-shot fresh Stage 1 v3 development"), "v3 self-tests occur after fresh execution");
  need(developmentWorkflow.indexOf("Verify one-shot authorization and frozen source binding") < developmentWorkflow.indexOf("Run one-shot fresh Stage 1 v3 development"), "v3 binding occurs after fresh execution");

  need(staticWorkflow.includes("doc/rule-semantic-geometry-transition/executions/STAGE_1_V3_STATIC_AUDIT_TRIGGER.json"), "v3 static workflow trigger missing");
  need(!staticWorkflow.includes("doc/rule-semantic-geometry-transition/executions/STAGE_1_V3_TRIGGER.json"), "v3 static workflow is coupled to scientific trigger");
  need(fileSha(PROD_PATH) !== fileSha(INDEP_PATH), "production/independent BRSGT implementations are byte-identical");

  const selfTest = parseJsonStdout(cp.spawnSync(process.execPath, [MATERIALIZER_PATH, "--self-test"], { cwd: ROOT, encoding: "utf8" }), "v3 pre-fresh self-tests");
  need(selfTest.disposition === "BRSGT-STAGE1-V3-PRE-FRESH-SELF-TESTS-PASS", "v3 self-test disposition mismatch");
  need(selfTest.catchSelfTest.disposition === "PASS" && selfTest.catchSelfTest.freshScientificSeedReads === 0 && selfTest.catchSelfTest.noRescueBoundaryCrossed === false && selfTest.catchSelfTest.failureArtifactCreated === true, "v3 catch self-test boundary mismatch");
  const preflightTest = selfTest.preflightContractSelfTest;
  need(preflightTest.disposition === "BRSGT-STAGE1-V3-PREFLIGHT-CONTRACT-SELF-TEST-PASS", "v3 preflight self-test disposition mismatch");
  need(setEq(preflightTest.limitKeys, ["distinctRawStates", "uniqueTransitions", "parentExpansions", "legalMoveEvaluations", "treeNodeOccurrences"]), "v3 preflight self-test limit key set mismatch");
  need(preflightTest.freshScientificSeedReads === 0 && preflightTest.noRescueBoundaryCrossed === false && preflightTest.stage2SeedReads === 0 && preflightTest.g4_10Depth11AccessCount === 0, "v3 preflight self-test boundary mismatch");

  const generatedPath = path.join(ROOT, "tools/experiments/.brsgt-stage1-v3-static.generated.js");
  let materialization;
  let generated;
  try {
    materialization = parseJsonStdout(cp.spawnSync(process.execPath, [MATERIALIZER_PATH, "--emit", generatedPath], { cwd: ROOT, encoding: "utf8" }), "v3 runner materialization");
    const syntax = cp.spawnSync(process.execPath, ["--check", generatedPath], { cwd: ROOT, encoding: "utf8" });
    need(syntax.status === 0, `generated v3 runner syntax invalid: ${syntax.stderr}`);
    generated = fs.readFileSync(generatedPath, "utf8");
    need(generated.includes("STAGE_1_V3_DEVELOPMENT_SPEC.json") && generated.includes("UPSTREAM_IDENTITY_FIREWALL_V3.json") && generated.includes("STAGE_1_V3_AUTHORIZATION.json"), "generated v3 bindings missing");
    need(generated.includes("BRSGT-S1-DEVELOPMENT-2026-09-27-v3"), "generated v3 stage identity missing");
    need(count(generated, "freshScientificSeedReads: freshSeedReads,") === 4, "generated v3 fresh-read mappings != 4");
    need(count(generated, "freshScientificSeedReads,") === 0, "generated v3 retains undefined fresh-read shorthand");
    need(count(generated, "distinctRawStates: source.maxDistinctRawStates,") === 1, "generated v3 distinctRawStates mapping != 1");
    need(count(generated, "uniqueTransitions: source.maxUniqueTransitions,") === 1, "generated v3 uniqueTransitions mapping != 1");
    need(count(generated, "legalMoveEvaluations: source.maxLegalMoveEvaluations,") === 1, "generated v3 legalMoveEvaluations mapping != 1");
    need(!generated.includes("globalDistinctRawStates: source.maxDistinctRawStates"), "generated v3 old distinctRawStates key remains");
    need(!generated.includes("uniqueCanonicalTransitions: source.maxUniqueTransitions"), "generated v3 old uniqueTransitions key remains");
    need(!generated.includes("legalMoveVariantsEnumerated: source.maxLegalMoveEvaluations"), "generated v3 old legalMoveEvaluations key remains");
    need(generated.indexOf("FW.materialize") < generated.indexOf("for (let seed = SPEC.seedBlock.start"), "generated v3 fresh loop precedes firewall materialization");
    need(!generated.includes("40813001") && !generated.includes("40814001") && !generated.includes("40823001"), "generated v3 directly references protected seed namespace");
  } finally {
    try { fs.rmSync(generatedPath, { force: true }); } catch {}
  }

  const upstreamRoot = process.env.BRSGT_STAGE1_UPSTREAM_DIR;
  need(upstreamRoot && fs.existsSync(upstreamRoot), "v3 static audit upstream directory missing");
  const materializedFirewall = FW.materialize({ repoRoot: ROOT, upstreamRoot, firewall });
  need(materializedFirewall.summary.freshStage1SeedAccessDuringMaterialization === false, "v3 static firewall materialization accessed fresh data");

  console.log(JSON.stringify({
    disposition: "STAGE1-V3-PRE-FRESH-STATIC-AUDIT-PASS",
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
    catchSelfTestDisposition: selfTest.catchSelfTest.disposition,
    preflightContractSelfTestDisposition: preflightTest.disposition,
    preflightContractSelfTestReasonCode: preflightTest.result.reasonCode,
    preflightContractLimitKeys: preflightTest.limitKeys,
    scientificAuthorizationPresentAtAudit: false,
    scientificTriggerPresentAtAudit: false,
    priorStage1V1SeedBlockQuarantined: true,
    priorStage1V2SeedBlockQuarantined: true,
    firewallDigestSha256: materializedFirewall.summary.firewallDigestSha256,
    firewallSetSizes: materializedFirewall.summary.setSizes,
    freshScientificSeedReads: 0,
    stage2SeedReads: 0,
    g4_10Depth11AccessCount: 0,
    publicAiChanged: false
  }, null, 2));
}

main();
