#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const FW = require("./lib/brsgt-stage2-firewall.js");
const IP = require("./lib/brsgt-stage2-inference-production.js");
const II = require("./lib/brsgt-stage2-inference-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/rule-semantic-geometry-transition");
const SPEC_PATH = path.join(DOC, "prereg/STAGE_2_FORMAL_SPEC.json");
const FIREWALL_PATH = path.join(DOC, "prereg/STAGE_2_IDENTITY_FIREWALL.json");
const STAGE1_PATH = path.join(DOC, "results/stage-1-v3/STAGE_1_V3_CANONICAL_RECORD.json");
const AUTH_PATH = path.join(DOC, "authorizations/STAGE_2_AUTHORIZATION.json");
const TRIGGER_PATH = path.join(DOC, "executions/STAGE_2_TRIGGER.json");
const STATIC_TRIGGER_PATH = path.join(DOC, "executions/STAGE_2_STATIC_AUDIT_TRIGGER.json");
const FILES = {
  firewallImplementation: path.join(ROOT, "tools/experiments/lib/brsgt-stage2-firewall.js"),
  inferenceProduction: path.join(ROOT, "tools/experiments/lib/brsgt-stage2-inference-production.js"),
  inferenceIndependent: path.join(ROOT, "tools/experiments/lib/brsgt-stage2-inference-independent.js"),
  formalRunner: path.join(ROOT, "tools/experiments/run-brsgt-stage2-formal.js"),
  authorizedWrapper: path.join(ROOT, "tools/experiments/run-brsgt-stage2-authorized.js"),
  bindingVerifier: path.join(ROOT, "tools/experiments/verify-brsgt-stage2-binding.js"),
  formalWorkflow: path.join(ROOT, ".github/workflows/brsgt-stage2-formal.yml"),
  staticWorkflow: path.join(ROOT, ".github/workflows/brsgt-stage2-preauth-static.yml"),
};

function need(value, message) { if (!value) throw new Error(message); }
function read(file) { return fs.readFileSync(file, "utf8"); }
function json(file) { return JSON.parse(read(file)); }
function sha(file) { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
function stable(value) { return FW.stable(value); }
function same(a, b, message) { need(stable(a) === stable(b), message); }
function count(haystack, needle) { return haystack.split(needle).length - 1; }

function syntheticInferenceAudit() {
  const cases = [
    [8, 0, 0], [0, 8, 0], [4, 4, 2], [5, 3, 1], [0, 0, 8], [12, 4, 0], [16, 0, 0]
  ];
  for (const [positive, negative, zero] of cases) {
    same(IP.exactTwoSidedSignTest(positive, negative, zero), II.exactTwoSidedSignTest(positive, negative, zero), `synthetic sign-test disagreement ${positive}/${negative}/${zero}`);
  }
  const base = Array.from({ length: 24 }, (_, i) => ({
    slotId: `S${String(i + 1).padStart(2, "0")}`,
    pValue: i === 0 ? IP.exactTwoSidedSignTest(20, 0, 0).pValue : IP.q(1n),
  }));
  const independentBase = base.map((row) => ({ slotId: row.slotId, pValue: II.q(BigInt(row.pValue.numerator), BigInt(row.pValue.denominator)) }));
  const hp = IP.holm(base, 24);
  const hi = II.holm(independentBase, 24);
  same(hp, hi, "synthetic Holm disagreement");
  need(IP.significant(hp[0]) === true && II.significant(hi[0]) === true, "synthetic Holm strong result should be significant");
  need(IP.significant(hp[1]) === false && II.significant(hi[1]) === false, "synthetic Holm null result should not be significant");
  const perPolicyIncrease = { P1: { positive: 7, negative: 1 }, P2: { positive: 6, negative: 2 } };
  const perPolicyMixed = { P1: { positive: 7, negative: 1 }, P2: { positive: 2, negative: 6 } };
  need(IP.decision({ estimable: true, holmSignificant: true, positive: 13, negative: 3, perPolicy: perPolicyIncrease }) === "INCREASE-CONFIRMED", "production increase decision mismatch");
  need(II.decision({ estimable: true, holmSignificant: true, positive: 13, negative: 3, perPolicy: perPolicyIncrease }) === "INCREASE-CONFIRMED", "independent increase decision mismatch");
  need(IP.decision({ estimable: true, holmSignificant: true, positive: 9, negative: 7, perPolicy: perPolicyMixed }) === "NOT-CONFIRMED", "policy discordance must not confirm");
  need(II.decision({ estimable: false, holmSignificant: false, positive: 0, negative: 0, perPolicy: {} }) === "NON-ESTIMABLE", "non-estimable decision mismatch");
  return { cases: cases.length, holmFamilySize: 24, exactAgreement: true };
}

function main() {
  need(!fs.existsSync(AUTH_PATH), "Stage2 authorization must not exist during pre-fresh audit");
  need(!fs.existsSync(TRIGGER_PATH), "Stage2 scientific trigger must not exist during pre-fresh audit");
  need(fs.existsSync(STATIC_TRIGGER_PATH), "Stage2 static audit trigger missing");
  for (const [key, file] of Object.entries(FILES)) need(fs.existsSync(file), `Stage2 ${key} missing`);

  const spec = json(SPEC_PATH);
  const firewallSpec = json(FIREWALL_PATH);
  const stage1 = json(STAGE1_PATH);
  need(spec.studyId === "BRSGT-STUDY1" && spec.stageId === "BRSGT-S2-FORMAL-2026-09-27-v1", "Stage2 spec identity mismatch");
  need(spec.seedBlock.start === 40823001 && spec.seedBlock.end === 40824024 && spec.seedBlock.slots === 1024, "Stage2 seed block drift");
  need(spec.formalFamily.fixedFamilySize === 24 && spec.formalFamily.slotIds.length === 24, "Stage2 formal family size drift");
  need(spec.inference && spec.inference.test === "EXACT-TWO-SIDED-SIGN-TEST", "Stage2 sign-test contract drift");
  need(spec.inference.multiplicity === "HOLM-BONFERRONI-ACROSS-24-FROZEN-SLOTS", "Stage2 multiplicity contract drift");
  need(spec.stage1Source.effectDirectionAllowed === false && spec.stage1Source.effectValueAllowed === false, "Stage1 effect leakage allowed by spec");
  need(spec.protectedBoundaries.g4_10Depth11Access === false && spec.protectedBoundaries.publicAiChange === false && spec.protectedBoundaries.mainIntegration === false, "Stage2 protected boundary drift");
  need(firewallSpec.status === "FROZEN-PRE-FRESH" && firewallSpec.scientificOutcomeFieldsRetained === false && firewallSpec.freshStage2SeedAccessDuringMaterialization === false, "Stage2 firewall contract drift");
  need(stage1.disposition === "STAGE1-DEVELOPMENT-COMPLETE", "Stage1 canonical source not complete");
  need(stage1.supportOnlyPromotion.effectDirectionUsedForPromotion === false, "Stage1 promotion used effect direction");
  same(stage1.supportOnlyPromotion.supportedSlotIds, spec.formalFamily.slotIds, "formal family differs from Stage1 supported slots");

  const productionSource = read(FILES.inferenceProduction);
  const independentSource = read(FILES.inferenceIndependent);
  need(sha(FILES.inferenceProduction) !== sha(FILES.inferenceIndependent), "production and independent inference implementations are byte-identical");
  need(productionSource.includes("exactTwoSidedSignTest") && independentSource.includes("exactTwoSidedSignTest"), "sign-test implementation missing");
  need(productionSource.includes("function holm") && independentSource.includes("function holm"), "Holm implementation missing");

  const formalSource = read(FILES.formalRunner);
  const wrapperSource = read(FILES.authorizedWrapper);
  const bindingSource = read(FILES.bindingVerifier);
  const formalWorkflow = read(FILES.formalWorkflow);
  const staticWorkflow = read(FILES.staticWorkflow);
  need(wrapperSource.includes('BRSGT_STAGE2_EXECUTION_TRIGGER_OK !== "1"'), "authorized wrapper trigger guard missing");
  need(formalSource.indexOf("FW.materialize") >= 0 && formalSource.indexOf("FW.materialize") < formalSource.indexOf("for (let seed = SPEC.seedBlock.start"), "firewall must materialize before Stage2 seed loop");
  need(formalSource.includes("freshSeedReads += 1") && formalSource.includes("noRescueBoundaryCrossed = true"), "fresh-read accounting/no-rescue marker missing");
  need(formalSource.includes("same(testP, testI") && formalSource.includes("same(holmP, holmI"), "production/independent inference agreement gates missing");
  need(formalSource.includes("stage1EffectDirectionUsedForFamilyMembership: false") && formalSource.includes("stage1EffectValueUsedForFamilyMembership: false"), "Stage1-effect nonuse result marker missing");
  need(bindingSource.includes('GITHUB_RUN_ATTEMPT === "1"'), "binding attempt-one guard missing");
  need(bindingSource.includes("changed.length === 2") && bindingSource.includes("postAuditAllowedFiles"), "binding two-file post-audit contract missing");
  need(bindingSource.includes("g4_10Depth11AccessAuthorized === false") && bindingSource.includes("publicAiChangeAuthorized === false") && bindingSource.includes("mainIntegrationAuthorized === false"), "binding protected-boundary guard missing");

  const exactTriggerPath = "doc/rule-semantic-geometry-transition/executions/STAGE_2_TRIGGER.json";
  const exactStaticPath = "doc/rule-semantic-geometry-transition/executions/STAGE_2_STATIC_AUDIT_TRIGGER.json";
  need(formalWorkflow.includes(exactTriggerPath), "formal workflow exact trigger path missing");
  need(staticWorkflow.includes(exactStaticPath), "static workflow exact trigger path missing");
  need(!formalWorkflow.includes("workflow_dispatch") && !formalWorkflow.includes("schedule:"), "formal workflow must not have manual/scheduled trigger");
  need(!staticWorkflow.includes("workflow_dispatch") && !staticWorkflow.includes("schedule:"), "static workflow must not have manual/scheduled trigger");
  need(formalWorkflow.indexOf("verify-brsgt-stage2-binding.js") < formalWorkflow.indexOf("run-brsgt-stage2-authorized.js"), "binding verifier must run before authorized runner");
  need(count(formalWorkflow, exactTriggerPath) === 1, "formal workflow trigger path must appear exactly once");
  need(count(staticWorkflow, exactStaticPath) === 1, "static workflow trigger path must appear exactly once");

  const upstreamRoot = process.env.BRSGT_STAGE2_UPSTREAM_DIR;
  need(upstreamRoot && fs.existsSync(upstreamRoot), "Stage2 upstream artifact directory missing for static audit");
  const firewall = FW.materialize({ repoRoot: ROOT, upstreamRoot, firewall: firewallSpec });
  need(firewall.summary.freshStage2SeedAccessDuringMaterialization === false, "firewall reports fresh access during materialization");
  for (let seed = spec.seedBlock.start; seed <= spec.seedBlock.end; seed += 1) need(!firewall.sets.seed.has(String(seed)), `fresh Stage2 seed already excluded/used: ${seed}`);

  const inferenceAudit = syntheticInferenceAudit();
  const hashes = Object.fromEntries(Object.entries(FILES).map(([key, file]) => [`${key}Sha256`, sha(file)]));
  const result = {
    schemaVersion: 1,
    disposition: "STAGE2-PRE-FRESH-STATIC-AUDIT-PASS",
    studyId: spec.studyId,
    stageId: spec.stageId,
    auditScopeVersion: 1,
    auditHead: process.env.GITHUB_SHA || null,
    seedBlock: spec.seedBlock,
    formalFamilySize: spec.formalFamily.fixedFamilySize,
    specSha256: sha(SPEC_PATH),
    firewallSpecSha256: sha(FIREWALL_PATH),
    stage1CanonicalRecordSha256: sha(STAGE1_PATH),
    ...hashes,
    inferenceSyntheticAudit: inferenceAudit,
    inferenceImplementationsByteDistinct: true,
    firewallDigestSha256: firewall.summary.firewallDigestSha256,
    firewallSetSizes: firewall.summary.setSizes,
    freshStage2SeedReads: 0,
    stage2AuthorizationPresent: false,
    stage2ScientificTriggerPresent: false,
    stage1EffectDirectionUsedForFamilySelection: false,
    stage1EffectValueUsedForFamilySelection: false,
    g4_10Depth11AccessCount: 0,
    publicAiChanged: false,
    mainIntegrationPerformed: false,
  };
  console.log(JSON.stringify(result, null, 2));
}

main();
