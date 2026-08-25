"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "../..");
const defaultSpecPath = path.join(repoRoot, "doc/oracle-representation-integrity-symmetry-confirmation/preregistration/STAGE_1_FORMAL_SPEC.json");
const defaultAuthorizationPath = path.join(repoRoot, "doc/oracle-representation-integrity-symmetry-confirmation/preregistration/STAGE_1_AUTHORIZATION.json");

function sha256Buffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function fileSha256(file) {
  return sha256Buffer(fs.readFileSync(file));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function resolveRepo(relativePath) {
  return path.join(repoRoot, relativePath);
}

function verifySourceHashes(sourceSha256) {
  const checks = {};
  for (const [relativePath, expected] of Object.entries(sourceSha256)) {
    const file = resolveRepo(relativePath);
    if (!fs.existsSync(file)) throw new Error(`Frozen source missing: ${relativePath}`);
    const actual = fileSha256(file);
    checks[relativePath] = { expected, actual, passed: actual === expected };
    if (actual !== expected) throw new Error(`Frozen source hash mismatch: ${relativePath}`);
  }
  return checks;
}

function loadSpec(specPath = defaultSpecPath) {
  const absolute = path.resolve(specPath);
  const spec = readJson(absolute);
  if (spec.studyId !== "ORISC-STUDY1") throw new Error("Unexpected ORISC studyId");
  if (spec.stageId !== "ORISC-S1-REPRESENTATION-INTEGRITY-2026-08-25-v1") throw new Error("Unexpected ORISC Stage 1 stageId");
  if (spec.freezeStatus !== "FROZEN-BEFORE-STAGE1-FORMAL-OUTCOME") throw new Error("ORISC Stage 1 spec is not frozen");
  if (spec.scientificOutcomeGeneratedAtFreeze !== false) throw new Error("Stage 1 outcome already generated at freeze");
  const specSha256 = fileSha256(absolute);
  const sourceChecks = verifySourceHashes(spec.sourceSha256);
  const candidateContractPath = resolveRepo(spec.paths.stage2CandidateContract);
  const candidateContractSha256 = fileSha256(candidateContractPath);
  if (candidateContractSha256 !== spec.stage2CandidateContractSha256) throw new Error("Frozen Stage 2 candidate contract hash mismatch");
  return { absolute, spec, specSha256, sourceChecks, candidateContractSha256 };
}

function loadAuthorization(contract, authorizationPath = defaultAuthorizationPath) {
  const absolute = path.resolve(authorizationPath);
  const authorization = readJson(absolute);
  if (authorization.studyId !== "ORISC-STUDY1") throw new Error("Unexpected authorization studyId");
  if (authorization.stageId !== contract.spec.stageId) throw new Error("Authorization stageId mismatch");
  if (authorization.status !== "AUTHORIZED-FOR-STAGE1-OUTCOME-GENERATION") throw new Error("Stage 1 is not authorized");
  if (authorization.specSha256 !== contract.specSha256) throw new Error("Authorization spec hash mismatch");
  if (authorization.stage2CandidateContractSha256 !== contract.candidateContractSha256) throw new Error("Authorization candidate contract hash mismatch");
  if (authorization.upstreamFormalDecisionsMayChange !== false) throw new Error("Authorization violates upstream immutability");
  if (authorization.stage2ExecutionAuthorized !== false) throw new Error("Stage 1 authorization must not authorize Stage 2");
  return {
    absolute,
    authorization,
    authorizationSha256: fileSha256(absolute),
  };
}

module.exports = {
  defaultAuthorizationPath,
  defaultSpecPath,
  fileSha256,
  loadAuthorization,
  loadSpec,
  repoRoot,
  resolveRepo,
  sha256Buffer,
  verifySourceHashes,
};
