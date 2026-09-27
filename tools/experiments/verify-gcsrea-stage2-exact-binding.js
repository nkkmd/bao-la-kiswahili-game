#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.resolve(__dirname, "../..");
const AUTH_REL = "doc/geometry-conditioned-search-reliability-exact-agreement/authorizations/STAGE_2_EXACT_MEASUREMENT_AUTHORIZATION.json";
const TRIGGER_REL = "doc/geometry-conditioned-search-reliability-exact-agreement/authorizations/STAGE_2_EXACT_MEASUREMENT_TRIGGER.json";
const REVIEW_REL = "doc/research-program-decisions/2026-09-28-g4-09-stage2-exact-measurement-authorization-review.md";
const LEASE_REL = "doc/geometry-conditioned-search-reliability-exact-agreement/executions/STAGE_2_EXACT_CENSUS_MEASUREMENT_LEASE.json";

function need(value, message) { if (!value) throw new Error(message); }
function readJson(rel) { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")); }
function git(args) { return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
function lines(value) { return value.split(/\r?\n/).map(x => x.trim()).filter(Boolean); }

function main() {
  need(fs.existsSync(path.join(ROOT, AUTH_REL)), "measurement authorization missing");
  need(fs.existsSync(path.join(ROOT, TRIGGER_REL)), "measurement trigger missing");
  need(!fs.existsSync(path.join(ROOT, LEASE_REL)), "durable measurement lease already present in trigger checkout");
  const auth = readJson(AUTH_REL);
  const trigger = readJson(TRIGGER_REL);

  need(auth.studyId === "GCSREA-STUDY1" && auth.stageId === "GCSREA-S2-EXACT-CENSUS-2026-09-27-v1", "authorization identity mismatch");
  need(auth.decision === "GCSREA-STUDY1-STAGE2-EXACT-CENSUS-MEASUREMENT-AUTHORIZED-ONCE", "authorization decision mismatch");
  need(auth.authorizedScientificMeasurements === 1 && auth.rerunAuthorized === false, "one-shot authorization mismatch");
  need(auth.fixedDomainCount === 8 && auth.forcedDomainCount === 2 && auth.nontrivialDomainCount === 6 && auth.searchConfigurationCount === 6, "authorization census mismatch");
  need(auth.generalStage2FreshSeedReadAuthorized === false, "general Stage2 fresh read unexpectedly authorized");
  need(auth.g405CandidateRescanAuthorized === false && auth.g405DomainReplacementAuthorized === false, "G4-05 mutation unexpectedly authorized");
  need(auth.g410Depth11AccessAuthorized === false && auth.publicAiChangeAuthorized === false && auth.mainIntegrationAuthorized === false, "protected boundary unexpectedly authorized");
  need(/^[0-9a-f]{40}$/.test(auth.codeFreezeHead), "invalid codeFreezeHead");

  need(trigger.studyId === auth.studyId && trigger.stageId === auth.stageId, "trigger identity mismatch");
  need(trigger.action === "EXECUTE-SINGLE-AUTHORIZED-FIXED8-EXACT-CENSUS-MEASUREMENT", "trigger action mismatch");
  need(trigger.authorizedScientificMeasurements === 1 && trigger.rerunAuthorized === false, "trigger one-shot mismatch");
  need(trigger.generalStage2FreshSeedReadAuthorized === false && trigger.g410Depth11AccessAuthorized === false && trigger.publicAiChangeAuthorized === false, "trigger protected boundary mismatch");

  try { execFileSync("git", ["merge-base", "--is-ancestor", auth.codeFreezeHead, "HEAD"], { cwd: ROOT, stdio: "ignore" }); }
  catch { throw new Error("code freeze is not an ancestor of trigger HEAD"); }

  const headFiles = lines(git(["show", "--pretty=format:", "--name-only", "HEAD"]));
  need(headFiles.length === 1 && headFiles[0] === TRIGGER_REL, `trigger commit must change exactly one file: ${headFiles.join(",")}`);
  const allowedAfterFreeze = new Set([REVIEW_REL, AUTH_REL, TRIGGER_REL]);
  const diffFiles = lines(git(["diff", "--name-only", `${auth.codeFreezeHead}..HEAD`]));
  need(diffFiles.length === 3, `expected exactly three post-freeze authorization files, got ${diffFiles.length}`);
  for (const rel of diffFiles) need(allowedAfterFreeze.has(rel), `unexpected post-freeze change: ${rel}`);
  for (const rel of allowedAfterFreeze) need(diffFiles.includes(rel), `missing required post-freeze file: ${rel}`);

  need(Array.isArray(auth.sourceBindings) && auth.sourceBindings.length >= 10, "source bindings missing");
  for (const binding of auth.sourceBindings) {
    need(binding && typeof binding.path === "string" && /^[0-9a-f]{40}$/.test(binding.blobSha), `invalid source binding ${JSON.stringify(binding)}`);
    const frozen = git(["rev-parse", `${auth.codeFreezeHead}:${binding.path}`]);
    const current = git(["rev-parse", `HEAD:${binding.path}`]);
    need(frozen === binding.blobSha, `frozen blob mismatch: ${binding.path}`);
    need(current === binding.blobSha, `post-freeze source changed: ${binding.path}`);
  }

  need(auth.evidenceBindings && auth.evidenceBindings.classifierPreflight && auth.evidenceBindings.premeasurementAudit, "technical evidence bindings missing");
  const c = auth.evidenceBindings.classifierPreflight;
  need(c.runId === 36328650822 && c.runAttempt === 1 && c.artifactId === 10934528767 && c.artifactSha256 === "b878b4b5fa04458f171621d24b3be17afe39c1c08b64c9ee2fc66e2673876929", "classifier-preflight evidence mismatch");
  const p = auth.evidenceBindings.premeasurementAudit;
  need(p.runId === 36328833487 && p.runAttempt === 1 && p.artifactId === 10934489177 && p.artifactSha256 === "e312b91a0d8273ce5b697b9cf830ecf8ac6429c0fb726f55027282dc8f1780dd", "premeasurement evidence mismatch");

  const expectedConfigs = ["D2_Q1","D3_Q1","D2_Q0","D2_Q2","B256_Q1_MAXD3","B1024_Q1_MAXD3"];
  need(JSON.stringify(auth.searchConfigurationIds) === JSON.stringify(expectedConfigs), "authorized search configuration identity/order mismatch");
  need(auth.resourceCeiling.maximumNontrivialSearchExecutionsPerImplementation === 36, "per-implementation resource ceiling mismatch");
  need(auth.resourceCeiling.maximumTotalNontrivialSearchExecutionsAcrossTwoImplementations === 72, "total resource ceiling mismatch");

  const out = {
    disposition: "STAGE2-EXACT-CENSUS-SOURCE-BINDING-PASS",
    codeFreezeHead: auth.codeFreezeHead,
    triggerHead: git(["rev-parse", "HEAD"]),
    sourceBindingCount: auth.sourceBindings.length,
    postFreezeFiles: diffFiles,
    authorizedScientificMeasurements: 1,
    rerunAuthorized: false,
    generalStage2FreshSeedReadAuthorized: false,
    g410Depth11AccessAuthorized: false,
    publicAiChangeAuthorized: false
  };
  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
