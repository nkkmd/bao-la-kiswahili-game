#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const AUTH_PATH = path.join(ROOT, "doc/structural-forcing-corridor-tree-raw-transfer/authorizations/STUDY_3_STAGE_0_EXECUTION_AUTHORIZATION.json");
const STAGE_ID = "SFCDFT3-S0-TECHNICAL-2026-09-19-v1";

function need(value, message) { if (!value) throw new Error(message); }
function blobSha(rel) {
  return execFileSync("git", ["hash-object", rel], { cwd: ROOT, encoding: "utf8" }).trim();
}

function main() {
  need(fs.existsSync(AUTH_PATH), "Study3 Stage0 authorization absent");
  const auth = JSON.parse(fs.readFileSync(AUTH_PATH, "utf8"));
  need(auth.studyId === "SFCDFT-STUDY3", "Study3 authorization study mismatch");
  need(auth.stageId === STAGE_ID, "Study3 authorization stage mismatch");
  need(auth.decision === "SFCDFT3-STAGE0-EXECUTION-AUTHORIZED", "Study3 Stage0 not authorized");
  need(auth.executionRoute === "GITHUB-ACTIONS-TECHNICAL-ONLY", "unexpected execution route");
  need(auth.authorizedParentHead === process.env.GITHUB_EVENT_BEFORE, "authorization parent/event.before mismatch");
  need(process.env.GITHUB_RUN_ATTEMPT === "1", "Stage0 workflow rerun is not authorized");
  need(auth.freshScientificSeedAccessAuthorized === false, "fresh scientific seed access must remain false");
  need(auth.stage1ScientificSeedAccessAuthorized === false, "Stage1 access must remain false");
  need(auth.stage2ScientificSeedAccessAuthorized === false, "Stage2 access must remain false");
  need(auth.mainIntegrationAuthorized === false, "main integration must remain false");
  need(auth.technicalSeedRange?.seedStart === 49031001 && auth.technicalSeedRange?.seedEnd === 49031256, "technical seed range mismatch");
  need(auth.study2Firewall?.identityCoreSha256 === "7961d01342e35f3e70f82e5688f585be08ef99827b905dcccf032d285994abfc", "Study2 firewall core mismatch");
  need(auth.study1Firewall?.identityCoreSha256 === "8836ce233aa330538defd7271d4e69389526fafb42f605b542eebf9996522430", "Study1 firewall core mismatch");
  need(Array.isArray(auth.bindings) && auth.bindings.length >= 10, "authorization bindings absent");
  for (const binding of auth.bindings) {
    need(typeof binding.path === "string" && /^[0-9a-f]{40}$/.test(binding.gitBlobSha), `invalid binding ${JSON.stringify(binding)}`);
    need(fs.existsSync(path.join(ROOT, binding.path)), `bound file absent ${binding.path}`);
    need(blobSha(binding.path) === binding.gitBlobSha, `bound blob mismatch ${binding.path}`);
  }
  process.stdout.write(`${JSON.stringify({ authorized: true, studyId: auth.studyId, stageId: auth.stageId, authorizedParentHead: auth.authorizedParentHead, boundFileCount: auth.bindings.length })}\n`);
}

main();
