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

function need(value, message) { if (!value) throw new Error(message); }
function sha256Bytes(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function fileSha(file) { return sha256Bytes(fs.readFileSync(file)); }

function main() {
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  const firewall = JSON.parse(fs.readFileSync(FIREWALL_PATH, "utf8"));
  const runner = fs.readFileSync(RUNNER_PATH, "utf8");
  const upstreamRoot = process.env.BRSGT_STAGE1_UPSTREAM_DIR;

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

  need(runner.includes("FW.materialize"), "runner does not materialize firewall");
  need(runner.indexOf("FW.materialize") < runner.indexOf("for (let seed = SPEC.seedBlock.start"), "runner fresh loop precedes firewall materialization");
  need(runner.includes("effectValuesRetained: false") && runner.includes("effectSignsRetained: false"), "runner output blindness guards missing");
  need(runner.includes("exactDefined") && runner.includes("supportSlots"), "runner support-only path missing");
  need(runner.includes("GITHUB_RUN_ATTEMPT") && runner.includes('=== "1"'), "runner attempt-one guard missing");
  need(!runner.includes("40823001"), "runner directly references Stage2 seed namespace");
  need(!runner.includes("31610001") && !runner.includes("31620001"), "runner directly references G3-06 scientific seed namespace");
  need(fileSha(PROD_PATH) !== fileSha(INDEP_PATH), "production/independent BRSGT implementations are byte-identical");

  need(upstreamRoot && fs.existsSync(upstreamRoot), "static audit upstream directory missing");
  const materialized = FW.materialize({ repoRoot: ROOT, upstreamRoot, firewall });
  need(materialized.summary.freshStage1SeedAccessDuringMaterialization === false, "static firewall materialization accessed fresh data");

  console.log(JSON.stringify({
    disposition: "STAGE1-PRE-FRESH-STATIC-AUDIT-PASS",
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256: fileSha(SPEC_PATH),
    firewallSpecSha256: fileSha(FIREWALL_PATH),
    runnerSha256: fileSha(RUNNER_PATH),
    productionSha256: fileSha(PROD_PATH),
    independentSha256: fileSha(INDEP_PATH),
    firewallDigestSha256: materialized.summary.firewallDigestSha256,
    firewallSetSizes: materialized.summary.setSizes,
    freshScientificSeedReads: 0,
    stage2SeedReads: 0,
    g4_10Depth11AccessCount: 0
  }, null, 2));
}

main();
