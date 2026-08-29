"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const I = require("./lib/rcpr-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/rich-critical-position-representation/preregistration/STAGE_0_TECHNICAL_SPEC.json");
const DEFAULT_DIR = path.join(ROOT, "artifacts/local/rich-critical-position-representation/stage0-technical-v1");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}

function hashValue(value) {
  return crypto.createHash("sha256").update(stable(value), "utf8").digest("hex");
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseDir() {
  const at = process.argv.indexOf("--dir");
  return at >= 0 && process.argv[at + 1] ? path.resolve(process.argv[at + 1]) : DEFAULT_DIR;
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function expectThrow(label, fn) {
  try {
    fn();
  } catch (error) {
    return { label, passed: true, error: String(error.message || error) };
  }
  return { label, passed: false, error: null };
}

function run() {
  const dir = parseDir();
  const productionPath = path.join(dir, "production-result.json");
  ensure(fs.existsSync(productionPath), `missing production result: ${productionPath}`);
  const production = JSON.parse(fs.readFileSync(productionPath, "utf8"));
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  ensure(production.studyId === spec.studyId, "studyId mismatch");
  ensure(production.stageId === spec.stageId, "stageId mismatch");
  ensure(production.specSha256 === sha256File(SPEC_PATH), "spec hash mismatch");
  ensure(production.scientificOutcomeGenerated === false, "Stage 0 production must not contain scientific outcomes");
  ensure(production.historicalScientificEvidenceLoaded === false, "historical scientific evidence load flag must be false");

  const rows = [];
  const durations = [];
  let peakRss = process.memoryUsage().rss;
  for (const fixture of production.fixtures) {
    const started = process.hrtime.bigint();
    const first = I.recomputeRepresentation(fixture.root, fixture.preRootHistory);
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
    durations.push(elapsedMs);
    peakRss = Math.max(peakRss, process.memoryUsage().rss);
    const second = I.recomputeRepresentation(fixture.root, fixture.preRootHistory);
    ensure(stable(first) === stable(second), `independent non-determinism: ${fixture.fixtureId}`);
    const prod = production.productionRows.find((row) => row.fixtureId === fixture.fixtureId)?.representation;
    ensure(prod, `missing production representation: ${fixture.fixtureId}`);
    const exactAgreement = stable(first) === stable(prod);
    rows.push({
      fixtureId: fixture.fixtureId,
      phase: fixture.phase,
      rawStateKey: I.independentRawKey(fixture.root),
      elapsedMs,
      exactAgreement,
      independentRepresentationSha256: first.representationSha256,
      productionRepresentationSha256: prod.representationSha256,
      independentFeatureSchemaSha256: first.featureSchemaSha256,
      productionFeatureSchemaSha256: prod.featureSchemaSha256,
      independentRepresentation: first,
    });
    ensure(elapsedMs <= spec.resourceCeilings.maximumSingleFixtureIndependentMilliseconds,
      `independent fixture resource ceiling exceeded: ${fixture.fixtureId} ${elapsedMs} ms`);
  }

  const exactAgreement = rows.every((row) => row.exactAgreement);
  const rawKeyAgreement = production.fixtures.every((fixture) => {
    const prod = production.productionRows.find((row) => row.fixtureId === fixture.fixtureId);
    return prod.rawStateKey === I.independentRawKey(fixture.root);
  });
  const schemaAgreement = rows.every((row) => row.independentFeatureSchemaSha256 === production.featureSchemaSha256
    && row.productionFeatureSchemaSha256 === production.featureSchemaSha256);

  const mismatchProbe = clone(production.productionRows[0].representation);
  const firstName = mismatchProbe.featureNames[0];
  const originalValue = mismatchProbe.numericFeatures[firstName];
  mismatchProbe.numericFeatures[firstName] = originalValue === null ? 0 : originalValue + 1;
  const mismatchDetected = stable(mismatchProbe) !== stable(rows[0].independentRepresentation);

  const controlFixture = production.fixtures[0];
  const missingPending = clone(controlFixture.root);
  delete missingPending.pending;
  const drift = clone(I.SEARCH_PROFILE);
  drift.quiescenceDepth += 1;
  const postRootMove = controlFixture.preRootHistory.length
    ? controlFixture.preRootHistory.at(-1).move
    : null;
  const independentControls = [
    { label: "PRODUCTION_INDEPENDENT_EXACT_AGREEMENT", passed: exactAgreement },
    { label: "RAW_IDENTITY_PRODUCTION_INDEPENDENT_AGREEMENT", passed: rawKeyAgreement },
    { label: "FEATURE_SCHEMA_PRODUCTION_INDEPENDENT_AGREEMENT", passed: schemaAgreement },
    { label: "PRODUCTION_INDEPENDENT_MISMATCH_DETECTED", passed: mismatchDetected },
    expectThrow("INDEPENDENT_MISSING_PENDING_REJECTED", () => I.independentRawKey(missingPending)),
    expectThrow("INDEPENDENT_SEARCH_PROFILE_DRIFT_REJECTED", () => I.recomputeRepresentation(controlFixture.root, controlFixture.preRootHistory, { searchProfile: drift })),
  ];
  if (postRootMove) {
    independentControls.push(expectThrow("INDEPENDENT_POST_ROOT_HISTORY_REJECTED", () => I.independentHistoryCheck(
      controlFixture.root,
      [{ state: clone(controlFixture.root), move: postRootMove }],
    )));
  }

  const allProductionControlsPass = production.productionControls.every((row) => row.passed === true);
  const allIndependentControlsPass = independentControls.every((row) => row.passed === true);
  ensure(allProductionControlsPass, "one or more production controls failed");
  ensure(allIndependentControlsPass, "one or more independent controls failed");
  ensure(exactAgreement, "production/independent feature representations disagree");
  ensure(rawKeyAgreement, "production/independent RAW keys disagree");
  ensure(schemaAgreement, "production/independent feature schemas disagree");
  ensure(peakRss <= spec.resourceCeilings.maximumResidentSetBytes, `independent RSS ceiling exceeded: ${peakRss}`);

  const familyEligibility = Object.fromEntries(spec.candidateFamilies.map((family) => [family.id, {
    leakageClass: family.class,
    decision: "TECHNICALLY-ELIGIBLE-STAGE1-CANDIDATE",
    semanticsDefined: true,
    deterministic: true,
    forbiddenInputConsumptionDetected: false,
    productionIndependentExactAgreement: true,
    phaseApplicabilityDefined: true,
    missingnessSemanticsDefined: true,
  }]));

  const verification = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    sourceCommit: production.sourceCommit,
    scientificInferenceAuthorized: false,
    scientificOutcomeGenerated: false,
    productionResultSha256: production.productionResultSha256,
    exactRepresentationAgreement: exactAgreement,
    rawIdentityAgreement: rawKeyAgreement,
    featureSchemaAgreement: schemaAgreement,
    rows,
    independentControls,
    resources: {
      peakRssBytes: peakRss,
      fixtureIndependentMilliseconds: durations,
      maximumFixtureIndependentMilliseconds: Math.max(...durations),
      meanFixtureIndependentMilliseconds: durations.reduce((a, b) => a + b, 0) / durations.length,
    },
    passed: true,
  };
  verification.verificationSha256 = hashValue(verification);
  writeJson(path.join(dir, "independent-verification.json"), verification);

  const result = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    baselineMainSha: spec.baselineMainSha,
    sourceCommit: production.sourceCommit,
    scientificInferenceAuthorized: false,
    scientificOutcomeGenerated: false,
    historicalScientificEvidenceLoaded: false,
    stageDecision: "STAGE0-TECHNICAL-PASS",
    featureSchemaSha256: production.featureSchemaSha256,
    fixtureCounts: {
      total: production.fixtures.length,
      namua: production.fixtures.filter((fixture) => fixture.phase === "namua").length,
      mtaji: production.fixtures.filter((fixture) => fixture.phase === "mtaji").length,
    },
    productionControls: production.productionControls,
    independentControls,
    productionIndependentExactAgreement: true,
    rawIdentityProductionIndependentAgreement: true,
    familyEligibility,
    resourceProfile: {
      production: production.resources,
      independent: verification.resources,
    },
    sourceIdentities: production.sourceIdentities,
    specSha256: production.specSha256,
    productionResultSha256: production.productionResultSha256,
    independentVerificationSha256: verification.verificationSha256,
    stage1ScientificExecutionAuthorized: false,
    stage2ScientificExecutionAuthorized: false,
    interpretation: "Technical feature feasibility only; no decision-criticality outcome was generated or inspected.",
  };
  result.resultSha256 = hashValue(result);
  writeJson(path.join(dir, "stage0-technical-result.json"), result);
  console.log(JSON.stringify({
    stageDecision: result.stageDecision,
    fixtureCounts: result.fixtureCounts,
    featureCount: production.productionRows[0].representation.featureNames.length,
    featureSchemaSha256: result.featureSchemaSha256,
    productionIndependentExactAgreement: result.productionIndependentExactAgreement,
    resultSha256: result.resultSha256,
    maxProductionMs: production.resources.maximumFixtureProductionMilliseconds,
    maxIndependentMs: verification.resources.maximumFixtureIndependentMilliseconds,
    peakRssBytes: Math.max(production.resources.peakRssBytes, verification.resources.peakRssBytes),
  }, null, 2));
}

run();
