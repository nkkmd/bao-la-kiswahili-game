#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const { performance } = require("node:perf_hooks");

const E = require("../../public/engine.js");
const P = require("./lib/umssr-stage0-production.js");
const I = require("./lib/umssr-stage0-independent.js");
const TmgcP = require("./lib/tmgc-stage0-production.js");
const TmgcI = require("./lib/tmgc-stage0-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const OUT = path.resolve(process.argv[2] || "artifacts/local/umssr-stage0-technical");
const STUDY_ID = "UMSSR-STUDY1";
const STAGE_ID = "UMSSR-S0-TECHNICAL-2026-08-30-v1";
const DOC_ROOT = "doc/unified-multiaxial-strategic-state-representation";
const SPEC_PATH = `${DOC_ROOT}/prereg/STAGE_0_TECHNICAL_SPEC.json`;
const INITIAL_PATH = `${DOC_ROOT}/prereg/STUDY_1_INITIAL_CONTRACT.json`;
const AUTH_PATH = `${DOC_ROOT}/authorizations/STAGE_0_TECHNICAL_EXECUTE.json`;
const C03_PATH = "doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json";
const DRSSE_FINAL_PATH = "doc/deep-raw-state-space-enumeration/results/STUDY_1_FINAL_RESULT.json";
const MORPH_AUDIT_PATH = "doc/machine-decision-failure-taxonomy/checkpoints/2026-08-29-stage0-f09-static-audit.md";
const MORPH_ARTIFACT_PATH = "artifacts/local/position-typology/stage1-pilot-v1/mtaji-candidate-definition-v1/mtaji-candidate-definition.json";

const SOURCE_PATHS = [
  SPEC_PATH,
  INITIAL_PATH,
  AUTH_PATH,
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "tools/experiments/run-umssr-stage0-technical.js",
  "tools/experiments/lib/umssr-stage0-production.js",
  "tools/experiments/lib/umssr-stage0-independent.js",
  "tools/experiments/lib/search-reliability-decision-robustness.js",
  "tools/experiments/lib/position-complexity-search-diagnostic.js",
  "tools/experiments/lib/tmgc-stage0-production.js",
  "tools/experiments/lib/tmgc-stage0-independent.js",
  "tools/experiments/lib/position-typology-features.js",
  "tools/experiments/lib/tactical-motif-features.js",
  "tools/experiments/lib/tactical-motif-stage2-formal.js",
  C03_PATH,
  DRSSE_FINAL_PATH,
  MORPH_AUDIT_PATH,
];

function abs(relative) { return path.join(ROOT, relative); }
function readText(relative) { return fs.readFileSync(abs(relative), "utf8"); }
function readJson(relative) { return JSON.parse(readText(relative)); }
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function fileSha256(relative) { return sha256(fs.readFileSync(abs(relative))); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function stable(value) { return P.stableStringify(value); }
function gitHead() {
  return cp.execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
}
function normalizeSemantics(value) {
  const out = clone(value);
  delete out.semantics;
  return out;
}
function exact(a, b) { return stable(a) === stable(b); }
function gate(gates, id, passed, detail = null) {
  gates.push({ id, passed: Boolean(passed), detail });
  return Boolean(passed);
}
function emptyPits() { return [Array(8).fill(0), Array(8).fill(0)]; }
function baseMtaji(backSeeds = 2) {
  const pits = [emptyPits(), emptyPits()];
  pits[0][E.FRONT][E.HOUSE] = 1;
  pits[0][E.BACK][0] = backSeeds;
  pits[1][E.FRONT][E.HOUSE] = 1;
  pits[1][E.BACK][0] = 2;
  return {
    pits,
    reserve: [0, 0],
    houseOwned: [true, true],
    player: 0,
    phase: "mtaji",
    winner: null,
    reason: "TECHNICAL-FIXTURE",
    turn: 80,
    pending: [0, 0],
  };
}
function forcedMtaji() {
  return {
    pits: [
      [[1, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)],
      [[1, 1, 0, 0, 0, 0, 0, 2], Array(8).fill(0)],
    ],
    reserve: [0, 0],
    houseOwned: [false, false],
    player: 1,
    phase: "mtaji",
    winner: null,
    reason: "TECHNICAL-FIXTURE",
    turn: 50,
    pending: [0, 0],
  };
}
function c03Candidate() {
  const payload = readJson(C03_PATH);
  return payload.formalCandidates.find((row) => row.candidateId === "TM-S2-C03");
}
function c03Check(state, candidate) {
  const production = TmgcP.analyzeFixture(state, candidate);
  const independent = TmgcI.analyzeFixture(state, candidate);
  return {
    exact: exact(normalizeSemantics(production), normalizeSemantics(independent)),
    production,
    independent,
  };
}
function sourcePresence() {
  return SOURCE_PATHS.map((relative) => ({
    path: relative,
    exists: fs.existsSync(abs(relative)),
    sha256: fs.existsSync(abs(relative)) ? fileSha256(relative) : null,
  }));
}
function helperSeparation() {
  const text = readText("tools/experiments/lib/umssr-stage0-independent.js");
  const forbidden = [
    "umssr-stage0-production",
    "rcpr-production",
    "rcpr-stage1",
    "pcrpr-stage1",
    "mdft-stage1",
  ];
  return {
    passed: forbidden.every((token) => !text.includes(token)),
    forbiddenTokensAbsent: Object.fromEntries(forbidden.map((token) => [token, !text.includes(token)])),
  };
}
function technicalObservableChecks(fixtures) {
  return fixtures.map(({ id, state }) => {
    const production = P.technicalObservable(state);
    const independent = I.technicalObservable(state);
    return {
      id,
      exact: exact(normalizeSemantics(production), normalizeSemantics(independent)),
      production,
      independent,
    };
  });
}
function identityControls(initial) {
  const metadata = clone(initial);
  metadata.turn += 999;
  metadata.reason = "METADATA-SENTINEL";
  const pending = clone(initial);
  pending.pending[0] += 1;
  return {
    productionIndependentExact: P.rawIdentityHash(initial) === I.rawIdentityHash(initial),
    turnReasonExcludedProduction: P.rawIdentityHash(initial) === P.rawIdentityHash(metadata),
    turnReasonExcludedIndependent: I.rawIdentityHash(initial) === I.rawIdentityHash(metadata),
    pendingIncludedProduction: P.rawIdentityHash(initial) !== P.rawIdentityHash(pending),
    pendingIncludedIndependent: I.rawIdentityHash(initial) !== I.rawIdentityHash(pending),
  };
}
function numericControls() {
  const a = {};
  a.capture = 2;
  a.pass = 1;
  a.takata = 3;
  const b = {};
  b.takata = 3;
  b.capture = 2;
  b.pass = 1;
  const pA = P.binary64Hex(P.entropyFromCounts(a));
  const pB = P.binary64Hex(P.entropyFromCounts(b));
  const iA = I.binary64Hex(I.entropyFromCounts(a));
  const iB = I.binary64Hex(I.entropyFromCounts(b));
  return {
    productionInsertionOrderInvariant: pA === pB,
    independentInsertionOrderInvariant: iA === iB,
    productionIndependentExactHex: pA === iA && pB === iB,
    canonicalEntropyHex: pA,
  };
}
function searchChecks(fixtures, spec) {
  return fixtures.map(({ id, state }) => {
    const production = P.searchSummary(state, spec.searchTechnicalReference.depths, spec.searchTechnicalReference.options);
    const independent = I.searchSummary(state, spec.searchTechnicalReference.depths, spec.searchTechnicalReference.options);
    return {
      id,
      exact: exact(normalizeSemantics(production), normalizeSemantics(independent)),
      production,
      independent,
    };
  });
}
function morphologyAudit() {
  const text = readText(MORPH_AUDIT_PATH);
  const artifactExists = fs.existsSync(abs(MORPH_ARTIFACT_PATH));
  const reasonToken = "FROZEN_HISTORICAL_CLASSIFIER_NOT_EXACTLY_RECONSTRUCTIBLE_FROM_CURRENT_PRESERVED_REPOSITORY_SOURCES";
  const expectedHash = "7a276a8c795efddaf9b9555e0fbb7fdc1e56563d30ebcb352b42b3f53ba0e75d";
  const reasonPresent = text.includes(reasonToken);
  const historicalHashPresent = text.includes(expectedHash);
  return {
    auditPath: MORPH_AUDIT_PATH,
    expectedHistoricalCandidateDefinitionHash: expectedHash,
    preservedClassifierArtifactPath: MORPH_ARTIFACT_PATH,
    artifactExists,
    reasonPresent,
    historicalHashPresent,
    directExecutableDisposition: !artifactExists && reasonPresent && historicalHashPresent
      ? "INELIGIBLE"
      : "UNRESOLVED-TECHNICAL-STATE",
    historicalFormalClaimChanged: false,
    freshG2_10Fallback: "DEVELOPMENT-CANDIDATE-ONLY",
    passed: !artifactExists && reasonPresent && historicalHashPresent,
  };
}
function boundedExactAudit(initial, spec) {
  const final = readJson(DRSSE_FINAL_PATH);
  const expected = spec.g2_05BoundedExactControl;
  const initialRawHashProduction = P.rawIdentityHash(initial);
  const initialRawHashIndependent = I.rawIdentityHash(initial);
  return {
    finalDecision: final.formalDecision,
    targetDepth: final.targetDepth,
    rootRawStateKey: final.rootRawStateKey,
    initialRawHashProduction,
    initialRawHashIndependent,
    validatedTransformSet: final.representation.validatedTransformSet,
    exactRecomputationPassed: final.verification.fullIndependentExactRecomputationPassed,
    extrapolationAuthorized: false,
    passed: final.formalDecision === expected.requiredFormalDecision
      && final.targetDepth === expected.requiredTargetDepth
      && final.rootRawStateKey === expected.requiredRootRawStateKey
      && initialRawHashProduction === expected.requiredRootRawStateKey
      && initialRawHashIndependent === expected.requiredRootRawStateKey
      && Array.isArray(final.representation.validatedTransformSet)
      && final.representation.validatedTransformSet.length === 0
      && final.verification.fullIndependentExactRecomputationPassed === true,
  };
}
function initialContractAudit(initial, spec, auth) {
  return {
    studyId: initial.studyId,
    stage0: initial.stages.stage0,
    stage1Authorized: initial.authorization.stage1Authorized,
    stage2Authorized: initial.authorization.stage2Authorized,
    stage1SeedStatus: initial.seedReservation.stage1Scientific.status,
    stage2SeedStatus: initial.seedReservation.stage2Scientific.status,
    rawIdentityFields: initial.rawIdentity.includedFields,
    validatedTransformSet: initial.rawIdentity.validatedTransformSet,
    technicalAuthorization: auth.authorized,
    technicalAuthorizationScientificInference: auth.scientificInferenceAuthorized,
    passed: initial.studyId === STUDY_ID
      && initial.stages.stage0 === STAGE_ID
      && initial.authorization.stage1Authorized === false
      && initial.authorization.stage2Authorized === false
      && initial.seedReservation.stage1Scientific.status === "RESERVED-UNCONSUMED"
      && initial.seedReservation.stage2Scientific.status === "RESERVED-UNCONSUMED"
      && exact(initial.rawIdentity.includedFields, spec.rawIdentity.includedFields)
      && initial.rawIdentity.validatedTransformSet.length === 0
      && auth.authorized === true
      && auth.scientificInferenceAuthorized === false
      && auth.scientificSeedUseAuthorized === false,
  };
}

function main() {
  const started = performance.now();
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const spec = readJson(SPEC_PATH);
  const initialContract = readJson(INITIAL_PATH);
  const auth = readJson(AUTH_PATH);
  const initial = E.initialState();
  const mtaji = forcedMtaji();
  const observables = technicalObservableChecks([
    { id: "ENGINE-INITIAL-NAMUA", state: initial },
    { id: "SYN-FORCED-MTAJI", state: mtaji },
  ]);
  const identity = identityControls(initial);
  const numeric = numericControls();
  const searches = searchChecks([
    { id: "ENGINE-INITIAL-NAMUA", state: initial },
    { id: "SYN-FORCED-MTAJI", state: mtaji },
  ], spec);

  const c03 = c03Candidate();
  const c03Positive = c03Check(baseMtaji(2), c03);
  const c03Negative = c03Check(baseMtaji(6), c03);
  const c03Namua = c03Check(initial, c03);
  const c03Audit = {
    candidateId: c03.candidateId,
    candidatePhase: c03.phase,
    productionIndependentExact: c03Positive.exact && c03Negative.exact && c03Namua.exact,
    positiveEligible: c03Positive.production.eligible,
    positiveStructuralSuccess: c03Positive.production.structuralSuccess,
    negativeEligible: c03Negative.production.eligible,
    negativeStructuralSuccess: c03Negative.production.structuralSuccess,
    namuaEligible: c03Namua.production.eligible,
    generalizationAuthorized: false,
    passed: c03.candidateId === "TM-S2-C03"
      && c03Positive.exact && c03Negative.exact && c03Namua.exact
      && c03Positive.production.eligible === true
      && c03Positive.production.structuralSuccess === true
      && c03Negative.production.eligible === true
      && c03Negative.production.structuralSuccess === false
      && c03Namua.production.eligible === false,
  };

  const morphology = morphologyAudit();
  const boundedExact = boundedExactAudit(initial, spec);
  const separation = helperSeparation();
  const sourceRows = sourcePresence();
  const contract = initialContractAudit(initialContract, spec, auth);

  const gates = [];
  gate(gates, "INITIAL-CONTRACT-BINDING", contract.passed, contract);
  gate(gates, "SOURCE-PATH-PRESENCE", sourceRows.every((row) => row.exists), {
    missing: sourceRows.filter((row) => !row.exists).map((row) => row.path),
  });
  gate(gates, "RAW-IDENTITY-PRODUCTION-INDEPENDENT-EXACT", identity.productionIndependentExact, identity);
  gate(gates, "RAW-IDENTITY-METADATA-EXCLUSION",
    identity.turnReasonExcludedProduction && identity.turnReasonExcludedIndependent, identity);
  gate(gates, "RAW-IDENTITY-PENDING-INCLUSION",
    identity.pendingIncludedProduction && identity.pendingIncludedIndependent, identity);
  gate(gates, "FRESH-TECHNICAL-OBSERVABLE-EXACT", observables.every((row) => row.exact), {
    fixtureExact: Object.fromEntries(observables.map((row) => [row.id, row.exact])),
  });
  gate(gates, "NUMERIC-CANONICALIZATION-EXACT", Object.entries(numeric)
    .filter(([key]) => key !== "canonicalEntropyHex").every(([, value]) => value === true), numeric);
  gate(gates, "SEARCH-INSTRUMENT-RECONSTRUCTION-EXACT", searches.every((row) => row.exact), {
    fixtureExact: Object.fromEntries(searches.map((row) => [row.id, row.exact])),
  });
  gate(gates, "TM-S2-C03-ORIGINAL-SCOPE-RECONSTRUCTION-EXACT", c03Audit.passed, c03Audit);
  gate(gates, "G2-05-BOUNDED-EXACT-CONTROL-BINDING", boundedExact.passed, boundedExact);
  gate(gates, "MORPHOLOGY-HISTORICAL-EXECUTABLE-AVAILABILITY-AUDIT", morphology.passed, morphology);
  gate(gates, "INDEPENDENT-HELPER-SEPARATION", separation.passed, separation);
  gate(gates, "NO-SCIENTIFIC-SEED-USE", true, {
    seedValuesUsed: [],
    fixtureOnlyExecution: true,
    stage1SeedStatus: initialContract.seedReservation.stage1Scientific.status,
    stage2SeedStatus: initialContract.seedReservation.stage2Scientific.status,
  });

  const runtimeSecondsBeforeResult = (performance.now() - started) / 1000;
  const maxRssBytes = process.resourceUsage().maxRSS * 1024;
  const resultBase = {
    schemaVersion: "UMSSR_STAGE0_TECHNICAL_RESULT_V1",
    researchGeneration: "Research Generation 2",
    program: "G2-10",
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    stageType: "TECHNICAL_ONLY",
    sourceCommit: gitHead(),
    scientificInferenceAuthorized: false,
    scientificSeedUseAllowed: false,
    scientificSeedsConsumed: false,
    stage1Authorized: false,
    stage2Authorized: false,
    specSha256: fileSha256(SPEC_PATH),
    initialContractSha256: fileSha256(INITIAL_PATH),
    technicalAuthorizationSha256: fileSha256(AUTH_PATH),
    sourceFileSha256: Object.fromEntries(sourceRows.filter((row) => row.exists).map((row) => [row.path, row.sha256])),
    identity,
    numeric,
    technicalObservables: observables,
    searchTechnicalReference: searches,
    tacticalC03OriginalScope: c03Audit,
    morphologyHistoricalExecutableAvailability: morphology,
    g2_05BoundedExactControl: boundedExact,
    independentHelperSeparation: separation,
    gates,
    resource: {
      runtimeSecondsBeforeResult,
      maxRssBytes,
      ceilings: spec.resourceCeilings,
    },
    interpretationBoundary: {
      scientificConclusionGenerated: false,
      searchReferenceValidatedAsStrategicAxis: false,
      c03GeneralizationGenerated: false,
      morphologyHistoricalClaimChanged: false,
      g2_05ExtrapolationGenerated: false,
      stage1RepresentationSelected: false,
    },
  };
  const predictedBytes = Buffer.byteLength(`${JSON.stringify(resultBase, null, 2)}\n`, "utf8");
  const resourcePassed = runtimeSecondsBeforeResult <= spec.resourceCeilings.runnerWallClockSeconds
    && maxRssBytes <= spec.resourceCeilings.maxRssBytes
    && predictedBytes <= spec.resourceCeilings.uncompressedTechnicalArtifactBytes;
  gate(gates, "RESOURCE-CEILING", resourcePassed, {
    runtimeSecondsBeforeResult,
    maxRssBytes,
    predictedResultBytes: predictedBytes,
    ceilings: spec.resourceCeilings,
  });

  const technicalFailures = gates.filter((row) => row.id !== "RESOURCE-CEILING" && !row.passed);
  const resourceFailure = gates.find((row) => row.id === "RESOURCE-CEILING" && !row.passed);
  const disposition = technicalFailures.length
    ? "STAGE0-TECHNICAL-INVALID"
    : resourceFailure
      ? "STAGE0-RESOURCE-CENSORED"
      : "STAGE0-TECHNICAL-PASS";

  const result = {
    ...resultBase,
    formalDisposition: disposition,
    mandatoryGateCount: gates.length,
    passedGateCount: gates.filter((row) => row.passed).length,
    failedGateIds: gates.filter((row) => !row.passed).map((row) => row.id),
    nextAuthorizationState: {
      stage0TechnicalExecutionComplete: true,
      stage1AutomaticallyAuthorized: false,
      stage1ScientificSeedConsumptionAllowed: false,
      stage2ScientificSeedConsumptionAllowed: false,
    },
  };
  result.resultSha256 = sha256(Buffer.from(stable(result), "utf8"));
  const text = `${JSON.stringify(result, null, 2)}\n`;
  fs.writeFileSync(path.join(OUT, "STAGE_0_TECHNICAL_RESULT.json"), text, "utf8");
  fs.writeFileSync(path.join(OUT, "SOURCE_HASHES.json"), `${JSON.stringify(result.sourceFileSha256, null, 2)}\n`, "utf8");
  process.stdout.write(text);
  if (disposition !== "STAGE0-TECHNICAL-PASS") process.exitCode = 1;
}

main();
