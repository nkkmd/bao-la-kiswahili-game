#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const AUTH_REL = "doc/multiscale-local-geometry-memory-return/authorizations/STAGE_0_AUTHORIZATION.json";
const TRIGGER_REL = "doc/multiscale-local-geometry-memory-return/executions/STAGE_0_TRIGGER.json";
const AUTH_PATH = path.join(ROOT, AUTH_REL);
const AUTH = JSON.parse(fs.readFileSync(AUTH_PATH, "utf8"));

function need(value, message) {
  if (!value) throw new Error(message);
}

function git(args) {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function gitBlobSha(relativePath) {
  const bytes = fs.readFileSync(path.join(ROOT, relativePath));
  const header = Buffer.from(`blob ${bytes.length}\0`, "utf8");
  return crypto.createHash("sha1").update(header).update(bytes).digest("hex");
}

need(AUTH.studyId === "MLGMR-STUDY1", "study mismatch");
need(AUTH.stageId === "MLGMR-S0-TECHNICAL-2026-09-26-v1", "stage mismatch");
need(AUTH.decision === "AUTHORIZED" && AUTH.authorizationType === "TECHNICAL-ONLY", "technical authorization missing");
need(AUTH.executionBinding && AUTH.executionBinding.status === "FROZEN", "execution binding not frozen");
need(AUTH.executionBinding.branch === "research/g4-07-multiscale-geometry-memory-return", "branch binding mismatch");
need(AUTH.freshScientificSeedAccessAuthorized === false, "fresh access guard invalid");
need(AUTH.stage1SeedAccessAuthorized === false && AUTH.stage2SeedAccessAuthorized === false, "future stage guard invalid");
need(AUTH.g3_08ScientificEvidenceReuseAuthorized === false, "G3-08 reuse guard invalid");
need(AUTH.g4_02ScientificDecisionProxyAuthorized === false, "G4-02 proxy guard invalid");
need(AUTH.g4_04SameEvidenceRerunAuthorized === false, "G4-04 rerun guard invalid");
need(AUTH.g3_11Depth10RerunAuthorized === false && AUTH.g4_10Depth11AccessAuthorized === false, "protected evidence guard invalid");
need(AUTH.publicAiChangeAuthorized === false && AUTH.mainIntegrationAuthorized === false, "deployment/integration guard invalid");

for (const [relativePath, expected] of Object.entries(AUTH.executionBinding.gitBlobShaByPath || {})) {
  const actual = gitBlobSha(relativePath);
  need(actual === expected, `blob mismatch ${relativePath}: ${actual} != ${expected}`);
}

const frozenSourceCommit = AUTH.executionBinding.frozenSourceCommit;
need(/^[0-9a-f]{40}$/.test(frozenSourceCommit || ""), "frozen source commit missing");
const sourceAncestor = git(["rev-parse", "HEAD~2"]);
need(sourceAncestor === frozenSourceCommit, `source ancestor mismatch: ${sourceAncestor} != ${frozenSourceCommit}`);

const changed = git(["diff", "--name-only", `${frozenSourceCommit}..HEAD`]).split("\n").filter(Boolean).sort();
const allowed = [AUTH_REL, TRIGGER_REL].sort();
need(JSON.stringify(changed) === JSON.stringify(allowed), `post-freeze delta invalid: ${JSON.stringify(changed)}`);

const trigger = JSON.parse(fs.readFileSync(path.join(ROOT, TRIGGER_REL), "utf8"));
need(trigger.studyId === AUTH.studyId && trigger.stageId === AUTH.stageId, "trigger identity mismatch");
need(trigger.bindingId === AUTH.executionBinding.bindingId, "trigger binding mismatch");
need(trigger.freshScientificSeedAccessAuthorized === false, "trigger fresh access guard invalid");
need(trigger.g4_10Depth11AccessAuthorized === false, "trigger G4-10 guard invalid");

console.log(`MLGMR_STAGE0_BINDING_OK=${AUTH.executionBinding.bindingId}`);
console.log(`MLGMR_STAGE0_FROZEN_SOURCE_COMMIT=${frozenSourceCommit}`);
