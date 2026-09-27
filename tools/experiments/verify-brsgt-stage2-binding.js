#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const cp = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/rule-semantic-geometry-transition");
const AUTH_PATH = path.join(DOC, "authorizations/STAGE_2_AUTHORIZATION.json");
const TRIGGER_PATH = path.join(DOC, "executions/STAGE_2_TRIGGER.json");
const SPEC_PATH = path.join(DOC, "prereg/STAGE_2_FORMAL_SPEC.json");
const FIREWALL_PATH = path.join(DOC, "prereg/STAGE_2_IDENTITY_FIREWALL.json");
const STAGE1_PATH = path.join(DOC, "results/stage-1-v3/STAGE_1_V3_CANONICAL_RECORD.json");
const FILES = {
  firewallImplementation: path.join(ROOT, "tools/experiments/lib/brsgt-stage2-firewall.js"),
  inferenceProduction: path.join(ROOT, "tools/experiments/lib/brsgt-stage2-inference-production.js"),
  inferenceIndependent: path.join(ROOT, "tools/experiments/lib/brsgt-stage2-inference-independent.js"),
  formalRunner: path.join(ROOT, "tools/experiments/run-brsgt-stage2-formal.js"),
  authorizedWrapper: path.join(ROOT, "tools/experiments/run-brsgt-stage2-authorized.js"),
  bindingVerifier: __filename,
  formalWorkflow: path.join(ROOT, ".github/workflows/brsgt-stage2-formal.yml"),
  staticWorkflow: path.join(ROOT, ".github/workflows/brsgt-stage2-preauth-static.yml"),
};

function need(value, message) { if (!value) throw new Error(message); }
function fileSha(file) { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
function git(args) { return cp.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
function sameSet(a, b) { return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort()); }

function main() {
  need(process.env.GITHUB_RUN_ATTEMPT === "1", "Stage2 binding requires workflow attempt 1");
  need(process.env.BRSGT_STAGE2_EXECUTION_TRIGGER_OK === "1", "Stage2 execution trigger env missing");
  need(fs.existsSync(AUTH_PATH), "Stage2 authorization missing");
  need(fs.existsSync(TRIGGER_PATH), "Stage2 trigger missing");

  const auth = JSON.parse(fs.readFileSync(AUTH_PATH, "utf8"));
  const trigger = JSON.parse(fs.readFileSync(TRIGGER_PATH, "utf8"));
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  const stage1 = JSON.parse(fs.readFileSync(STAGE1_PATH, "utf8"));
  need(auth.studyId === "BRSGT-STUDY1" && auth.stageId === "BRSGT-S2-FORMAL-2026-09-27-v1", "Stage2 authorization identity mismatch");
  need(auth.decision === "AUTHORIZED" && auth.authorizationType === "FRESH-FORMAL-HOLDOUT-ONE-SHOT", "Stage2 authorization decision/type mismatch");
  need(auth.maxScientificExecutions === 1 && auth.singleAttemptOnly === true, "Stage2 authorization must be one-shot attempt one");
  need(auth.formalInferenceAuthorized === true, "Stage2 formal inference not authorized");
  need(auth.g4_10Depth11AccessAuthorized === false && auth.publicAiChangeAuthorized === false && auth.mainIntegrationAuthorized === false, "Stage2 protected boundary invalid");
  need(auth.seedBlock.start === spec.seedBlock.start && auth.seedBlock.end === spec.seedBlock.end && auth.seedBlock.slots === spec.seedBlock.slots, "Stage2 seed block authorization mismatch");
  need(trigger.studyId === auth.studyId && trigger.stageId === auth.stageId, "Stage2 trigger identity mismatch");
  need(trigger.authorizationReviewId === auth.reviewId, "Stage2 trigger authorization reference mismatch");
  need(trigger.auditedSourceSha === auth.executionBinding.auditedSourceSha, "Stage2 trigger audited source mismatch");

  const currentBranch = process.env.GITHUB_REF_NAME || git(["branch", "--show-current"]);
  need(currentBranch === auth.executionBinding.branch, `Stage2 branch mismatch ${currentBranch}`);
  const head = git(["rev-parse", "HEAD"]);
  const audited = auth.executionBinding.auditedSourceSha;
  const changed = git(["diff", "--name-only", `${audited}..${head}`]).split(/\r?\n/).filter(Boolean);
  const expected = auth.executionBinding.postAuditAllowedFiles;
  need(Array.isArray(expected) && expected.length === 2, "Stage2 post-audit allowed file contract invalid");
  need(changed.length === 2 && sameSet(changed, expected), `Stage2 post-audit diff invalid: ${changed.join(",")}`);

  const binding = auth.executionBinding;
  need(fileSha(SPEC_PATH) === binding.specSha256, "Stage2 spec SHA mismatch");
  need(fileSha(FIREWALL_PATH) === binding.firewallSpecSha256, "Stage2 firewall spec SHA mismatch");
  need(fileSha(STAGE1_PATH) === binding.stage1CanonicalRecordSha256, "Stage1 canonical record SHA mismatch");
  for (const [key, file] of Object.entries(FILES)) {
    const field = `${key}Sha256`;
    need(binding[field] && fileSha(file) === binding[field], `Stage2 ${key} SHA mismatch`);
  }

  need(stage1.disposition === "STAGE1-DEVELOPMENT-COMPLETE", "Stage1 canonical disposition invalid");
  need(stage1.supportOnlyPromotion.effectDirectionUsedForPromotion === false, "Stage1 effect direction contaminated formal family");
  need(JSON.stringify(stage1.supportOnlyPromotion.supportedSlotIds) === JSON.stringify(spec.formalFamily.slotIds), "Stage2 formal family differs from frozen Stage1 support family");

  console.log(JSON.stringify({
    disposition: "STAGE2-BINDING-PASS",
    studyId: auth.studyId,
    stageId: auth.stageId,
    auditedSourceSha: audited,
    executionHead: head,
    branch: currentBranch,
    postAuditChangedPaths: changed,
    seedBlock: auth.seedBlock,
    maxScientificExecutions: auth.maxScientificExecutions,
    formalInferenceAuthorized: auth.formalInferenceAuthorized,
    g4_10Depth11AccessAuthorized: auth.g4_10Depth11AccessAuthorized,
    publicAiChangeAuthorized: auth.publicAiChangeAuthorized,
    mainIntegrationAuthorized: auth.mainIntegrationAuthorized,
  }, null, 2));
}

main();
