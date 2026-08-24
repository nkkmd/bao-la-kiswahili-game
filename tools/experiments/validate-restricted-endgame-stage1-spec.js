"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT,
  "doc/restricted-endgame-winning-regions/preregistration/STAGE_1_EXACT_SPEC.json");
const DOMAIN_PATH = path.join(ROOT,
  "doc/restricted-endgame-winning-regions/preregistration/STAGE_1_DOMAIN.json");
const AUTH_PATH = path.join(ROOT,
  "doc/restricted-endgame-winning-regions/preregistration/STAGE_1_EXACT_AUTHORIZATION.json");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map(
    (key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`,
  ).join(",")}}`;
}

function readJsonWithHash(file) {
  const text = fs.readFileSync(file, "utf8");
  return { value: JSON.parse(text), rawSha256: sha256(text), text };
}

function validateDomain(domain) {
  if (!domain || domain.schemaVersion !== 1 || domain.studyId !== "REWR-STUDY1"
    || domain.domainId !== "REWR-S1-DOMAIN-2026-08-24-v1"
    || domain.symmetryReduction !== false
    || domain.phase !== "mtaji"
    || domain.reachability?.historicalWitnessRequired !== true
    || !Array.isArray(domain.roots) || domain.roots.length !== 1
    || domain.expectedGraph?.stateCount !== 8
    || domain.expectedGraph?.edgeCount !== 7
    || domain.expectedGraph?.stateSetSha256 !== "95717c07495b19c55bdadd62d067354de0a5ee58d18cd62d1e4783fb279a1307"
    || domain.expectedGraph?.transitionSetSha256 !== "33703e84a47db7a2149542fe74db88702a6b57faaac6f1c86a9f5c189860cc11") {
    throw new Error("Invalid frozen Stage 1 domain");
  }
  const root = domain.roots[0];
  if (root.rootStateKey !== "fc1e124884276ba44b6d153580db9a7ddfc194d8b5e1b0d898e16de45f427d33"
    || root.seed !== 22800188 || root.ply !== 48
    || root.nonEmptyPitCount !== 16 || root.legalMoveCount !== 1
    || !root.state || !root.witness || !Array.isArray(root.witness.moves)) {
    throw new Error("Invalid frozen Stage 1 root witness");
  }
  return domain;
}

function validateSpec(spec) {
  if (!spec || spec.schemaVersion !== 1 || spec.studyId !== "REWR-STUDY1"
    || spec.stageId !== "REWR-S1-EXACT-2026-08-24-v1"
    || spec.domainId !== "REWR-S1-DOMAIN-2026-08-24-v1"
    || spec.scientificOutcomeGenerationAuthorized !== false
    || spec.confirmatoryReuseAllowed !== false
    || spec.symmetryReduction !== false
    || spec.identity?.state !== "direct-raw-rule-state"
    || spec.identity?.move !== "exact-move-key-with-houseChoice-and-houseTwo"
    || spec.terminalSemantics?.runtimeRelayLimitIsTerminal !== false
    || spec.terminalSemantics?.formalDrawRulePresent !== false
    || spec.classification?.terminalStatus !== "TERMINAL"
    || spec.classification?.nonterminalStatuses?.join("|") !== "WIN|LOSS|RECURRENT"
    || spec.distance?.name !== "DTF"
    || spec.distance?.terminalDistance !== 0
    || spec.distance?.recurrentDistance !== null
    || spec.distance?.winnerChoice !== "minimize"
    || spec.distance?.loserChoice !== "maximize-resistance"
    || spec.verification?.fullStateEqualityRequired !== true
    || spec.verification?.fullEdgeEqualityRequired !== true
    || spec.verification?.fullValueEqualityRequired !== true
    || spec.verification?.fullOptimalMoveSetEqualityRequired !== true
    || spec.verification?.fullDistanceEqualityRequired !== true
    || spec.failureRules?.domainRetuningAfterOutcomeAllowed !== false
    || spec.failureRules?.additionalStage0CapExpansionAllowed !== false
    || !Array.isArray(spec.sourceFiles) || spec.sourceFiles.length < 8
    || !spec.sourceFileSha256 || typeof spec.domainSha256 !== "string") {
    throw new Error("Invalid frozen Stage 1 spec");
  }
  return spec;
}

function currentSourceFileSha256(spec) {
  return Object.fromEntries(spec.sourceFiles.map((file) => {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full)) throw new Error(`Missing frozen Stage 1 source: ${file}`);
    return [file, sha256(fs.readFileSync(full))];
  }));
}

function loadFrozenContract() {
  if (!fs.existsSync(SPEC_PATH) || !fs.existsSync(DOMAIN_PATH)) {
    throw new Error("Stage 1 exact generation blocked: frozen spec/domain absent");
  }
  const specRecord = readJsonWithHash(SPEC_PATH);
  const domainRecord = readJsonWithHash(DOMAIN_PATH);
  const spec = validateSpec(specRecord.value);
  const domain = validateDomain(domainRecord.value);
  if (spec.domainSha256 !== domainRecord.rawSha256) throw new Error("Stage 1 spec/domain hash mismatch");
  const actual = currentSourceFileSha256(spec);
  if (stableStringify(actual) !== stableStringify(spec.sourceFileSha256)) {
    throw new Error("Stage 1 frozen source hashes do not match current source");
  }
  return {
    spec, domain,
    specSha256: specRecord.rawSha256,
    domainSha256: domainRecord.rawSha256,
    sourceFileSha256: actual,
  };
}

function loadAuthorization(contract) {
  if (!fs.existsSync(AUTH_PATH)) {
    throw new Error("Stage 1 exact generation blocked: authorization absent");
  }
  const authRecord = readJsonWithHash(AUTH_PATH);
  const auth = authRecord.value;
  if (!auth || auth.schemaVersion !== 1 || auth.studyId !== contract.spec.studyId
    || auth.stageId !== contract.spec.stageId
    || auth.stage1ExactGenerationAuthorized !== true
    || auth.scientificInferenceAuthorized !== true
    || auth.specSha256 !== contract.specSha256
    || auth.domainSha256 !== contract.domainSha256
    || stableStringify(auth.authorizedSourceFileSha256) !== stableStringify(contract.sourceFileSha256)) {
    throw new Error("Invalid Stage 1 exact authorization");
  }
  return { authorization: auth, authorizationSha256: authRecord.rawSha256 };
}

module.exports = {
  AUTH_PATH, DOMAIN_PATH, ROOT, SPEC_PATH,
  currentSourceFileSha256, loadAuthorization, loadFrozenContract,
  readJsonWithHash, sha256, stableStringify, validateDomain, validateSpec,
};
