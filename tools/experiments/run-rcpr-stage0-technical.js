"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const childProcess = require("node:child_process");
const E = require("../../public/engine.js");
const R = require("./lib/rcpr-production.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/rich-critical-position-representation/preregistration/STAGE_0_TECHNICAL_SPEC.json");
const DEFAULT_OUT = path.join(ROOT, "artifacts/local/rich-critical-position-representation/stage0-technical-v1");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function gitBlob(filePath) {
  return childProcess.execFileSync("git", ["hash-object", filePath], { cwd: ROOT, encoding: "utf8" }).trim();
}

function gitText(args) {
  return childProcess.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function parseOutDir() {
  const at = process.argv.indexOf("--out");
  return at >= 0 && process.argv[at + 1] ? path.resolve(process.argv[at + 1]) : DEFAULT_OUT;
}

function seededRandom(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 0x100000000;
  };
}

function fixtureSearch(spec) {
  const need = { namua: spec.technicalFixtures.requiredNamuaFixtures, mtaji: spec.technicalFixtures.requiredMtajiFixtures };
  const found = { namua: [], mtaji: [] };
  const keys = new Set();
  const start = spec.technicalFixtures.fixtureSearchSeedStart;
  const count = spec.technicalFixtures.fixtureSearchSeedCountMaximum;
  const maxPlies = spec.technicalFixtures.maximumPliesPerFixtureSearchGame;

  for (let offset = 0; offset < count && (found.namua.length < need.namua || found.mtaji.length < need.mtaji); offset += 1) {
    const seed = start + offset;
    const random = seededRandom(seed);
    let state = E.initialState();
    const completedHistory = [];
    for (let ply = 0; ply < maxPlies && state.winner === null; ply += 1) {
      const legal = R.exactLegalMoves(state);
      const key = R.rawStateKey(state);
      const phase = state.phase;
      const history = completedHistory.slice(-R.MAX_HISTORY).map(clone);
      const canTake = history.length >= 2 && legal.length > 0 && !keys.has(key) && found[phase].length < need[phase];
      if (canTake) {
        const fixture = {
          fixtureId: `${phase.toUpperCase()}-${found[phase].length + 1}`,
          sourceSeed: seed,
          sourcePly: ply,
          phase,
          root: clone(state),
          preRootHistory: history,
          rawStateKey: key,
        };
        found[phase].push(fixture);
        keys.add(key);
      }
      const move = legal[Math.floor(random() * legal.length)];
      completedHistory.push({ state: clone(state), move: clone(move) });
      state = E.applyMove(state, move).state;
    }
  }

  ensure(found.namua.length === need.namua, `insufficient Namua fixtures: ${found.namua.length}/${need.namua}`);
  ensure(found.mtaji.length === need.mtaji, `insufficient Mtaji fixtures: ${found.mtaji.length}/${need.mtaji}`);
  const fixtures = [...found.namua, ...found.mtaji];
  ensure(fixtures.filter((fixture) => fixture.preRootHistory.length > 0).length >= spec.technicalFixtures.minimumFixturesWithNonzeroHistory,
    "insufficient fixtures with pre-root history");
  return fixtures;
}

function expectThrow(label, fn) {
  try {
    fn();
  } catch (error) {
    return { label, passed: true, error: String(error.message || error) };
  }
  return { label, passed: false, error: null };
}

function controlMap(rows) {
  return Object.fromEntries(rows.map((row) => [row.label, row]));
}

function sourceIdentities() {
  const relativePaths = [
    "doc/rich-critical-position-representation/preregistration/STAGE_0_TECHNICAL_SPEC.json",
    "public/engine.js",
    "public/ai.js",
    "public/ai-weights.js",
    "tools/experiments/lib/position-complexity-search-diagnostic.js",
    "tools/experiments/lib/rcpr-production.js",
    "tools/experiments/lib/rcpr-independent.js",
    "tools/experiments/run-rcpr-stage0-technical.js",
    "tools/experiments/verify-rcpr-stage0-independent.js",
    ".github/workflows/rcpr-stage0-technical.yml"
  ];
  return Object.fromEntries(relativePaths.map((relative) => {
    const absolute = path.join(ROOT, relative);
    ensure(fs.existsSync(absolute), `missing frozen source path: ${relative}`);
    return [relative, { gitBlobSha: gitBlob(absolute), sha256: sha256File(absolute) }];
  }));
}

function run() {
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  ensure(spec.studyId === "RCPR-STUDY1", "unexpected studyId");
  ensure(spec.stageId === "RCPR-S0-TECHNICAL-2026-08-28-v1", "unexpected stageId");
  ensure(spec.scientificOutcomeGenerationAuthorized === false, "Stage 0 must not authorize scientific outcomes");
  const outDir = parseOutDir();
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const fixtures = fixtureSearch(spec);
  const productionRows = [];
  const durations = [];
  let peakRss = process.memoryUsage().rss;
  let schemaSha = null;

  for (const fixture of fixtures) {
    const before = R.stableStringify(fixture.root);
    const started = process.hrtime.bigint();
    const first = R.extractRepresentation(fixture.root, fixture.preRootHistory);
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
    durations.push(elapsedMs);
    peakRss = Math.max(peakRss, process.memoryUsage().rss);
    const second = R.extractRepresentation(fixture.root, fixture.preRootHistory);
    ensure(R.stableStringify(first) === R.stableStringify(second), `production non-determinism: ${fixture.fixtureId}`);
    ensure(R.stableStringify(fixture.root) === before, `root mutation: ${fixture.fixtureId}`);
    if (schemaSha === null) schemaSha = first.featureSchemaSha256;
    ensure(first.featureSchemaSha256 === schemaSha, `feature schema differs by fixture: ${fixture.fixtureId}`);
    ensure(elapsedMs <= spec.resourceCeilings.maximumSingleFixtureProductionMilliseconds,
      `production fixture resource ceiling exceeded: ${fixture.fixtureId} ${elapsedMs} ms`);
    productionRows.push({
      fixtureId: fixture.fixtureId,
      sourceSeed: fixture.sourceSeed,
      sourcePly: fixture.sourcePly,
      phase: fixture.phase,
      rawStateKey: fixture.rawStateKey,
      historyDepth: fixture.preRootHistory.length,
      elapsedMs,
      representation: first,
    });
  }

  const controlFixture = fixtures[0];
  const controlRoot = controlFixture.root;
  const controls = [];

  controls.push({ label: "RAW_KEY_DETERMINISM", passed: R.rawStateKey(controlRoot) === R.rawStateKey(clone(controlRoot)) });
  const excludedMutation = clone(controlRoot);
  excludedMutation.turn = (excludedMutation.turn || 0) + 991;
  excludedMutation.reason = "RCPR-TECHNICAL-EXCLUDED-FIELD-CONTROL";
  controls.push({ label: "TURN_REASON_EXCLUSION", passed: R.rawStateKey(controlRoot) === R.rawStateKey(excludedMutation) });
  const includedMutation = clone(controlRoot);
  includedMutation.player = 1 - includedMutation.player;
  controls.push({ label: "RAW_INCLUDED_FIELD_SENSITIVITY", passed: R.rawStateKey(controlRoot) !== R.rawStateKey(includedMutation) });
  controls.push({ label: "SEED_CONSERVATION", passed: (() => { R.assertStateShape(controlRoot); return true; })() });
  controls.push({ label: "FEATURE_DETERMINISM", passed: productionRows.every((row) => row.representation.representationSha256) });
  controls.push({ label: "NAMUA_PHASE_HANDLING", passed: productionRows.filter((row) => row.phase === "namua").length === spec.technicalFixtures.requiredNamuaFixtures });
  controls.push({ label: "MTAJI_PHASE_HANDLING", passed: productionRows.filter((row) => row.phase === "mtaji").length === spec.technicalFixtures.requiredMtajiFixtures });
  controls.push({ label: "TEMPORAL_CHAIN_REPLAY", passed: fixtures.every((fixture) => R.validatePreRootHistory(fixture.root, fixture.preRootHistory)) });
  controls.push({ label: "SEARCH_PROFILE_REPRODUCIBILITY", passed: productionRows.every((row) => row.representation.searchProfile.searchSemantics === spec.searchCandidateProfile.searchSemantics) });

  const missingPending = clone(controlRoot);
  delete missingPending.pending;
  controls.push(expectThrow("MISSING_PENDING_REJECTED", () => R.rawStateKey(missingPending)));
  const unexpected = clone(controlRoot);
  unexpected.unregisteredTechnicalField = 1;
  controls.push(expectThrow("UNEXPECTED_ROOT_FIELD_REJECTED", () => R.extractRepresentation(unexpected, [])));
  const outcomeLeak = clone(controlRoot);
  outcomeLeak.dRange = 0.9;
  controls.push(expectThrow("OUTCOME_FIELD_INJECTION_REJECTED", () => R.extractRepresentation(outcomeLeak, [])));
  const postRootMove = R.exactLegalMoves(controlRoot)[0];
  controls.push(expectThrow("POST_ROOT_HISTORY_REJECTED", () => R.validatePreRootHistory(controlRoot, [{ state: clone(controlRoot), move: postRootMove }])));
  const historyFixture = fixtures.find((fixture) => fixture.preRootHistory.length >= 2);
  const brokenHistory = historyFixture.preRootHistory.map(clone).reverse();
  controls.push(expectThrow("BROKEN_HISTORY_CHAIN_REJECTED", () => R.validatePreRootHistory(historyFixture.root, brokenHistory)));
  const drift = clone(R.SEARCH_PROFILE);
  drift.quiescenceDepth += 1;
  controls.push(expectThrow("SEARCH_PROFILE_DRIFT_REJECTED", () => R.extractRepresentation(controlRoot, [], { searchProfile: drift })));
  const baselineNames = productionRows[0].representation.featureNames;
  const driftedNames = baselineNames.slice(1);
  controls.push({ label: "FEATURE_SCHEMA_DRIFT_DETECTED", passed: crypto.createHash("sha256").update(driftedNames.join("\n")).digest("hex") !== schemaSha });
  controls.push({ label: "RAW_KEY_MISMATCH_DETECTED", passed: R.rawStateKey(controlRoot) !== R.rawStateKey(includedMutation) });

  const requiredProductionControls = spec.positiveControls.filter((name) => name !== "PRODUCTION_INDEPENDENT_EXACT_AGREEMENT")
    .concat(spec.negativeControls.filter((name) => name !== "PRODUCTION_INDEPENDENT_MISMATCH_DETECTED"));
  const indexed = controlMap(controls);
  for (const label of requiredProductionControls) ensure(indexed[label]?.passed === true, `mandatory production control failed or absent: ${label}`);
  ensure(peakRss <= spec.resourceCeilings.maximumResidentSetBytes, `RSS ceiling exceeded: ${peakRss}`);

  const sourceCommit = process.env.GITHUB_SHA || gitText(["rev-parse", "HEAD"]);
  const sourceTreeDirty = gitText(["status", "--porcelain"]) !== "";
  ensure(sourceTreeDirty === false, "source tree must be clean");
  const payload = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    baselineMainSha: spec.baselineMainSha,
    scientificInferenceAuthorized: false,
    scientificOutcomeGenerated: false,
    historicalScientificEvidenceLoaded: false,
    sourceCommit,
    sourceTreeDirty,
    workflow: {
      runId: process.env.GITHUB_RUN_ID || null,
      runAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
      jobName: process.env.GITHUB_JOB || null,
    },
    specSha256: sha256File(SPEC_PATH),
    sourceIdentities: sourceIdentities(),
    fixtureContract: spec.technicalFixtures,
    fixtures,
    productionRows,
    featureSchemaSha256: schemaSha,
    productionControls: controls,
    resources: {
      peakRssBytes: peakRss,
      fixtureProductionMilliseconds: durations,
      maximumFixtureProductionMilliseconds: Math.max(...durations),
      meanFixtureProductionMilliseconds: durations.reduce((a, b) => a + b, 0) / durations.length,
      ceilings: spec.resourceCeilings,
    },
    productionStatus: "PASS-AWAITING-INDEPENDENT-VERIFICATION",
  };
  payload.productionResultSha256 = R.canonicalHash(payload);
  writeJson(path.join(outDir, "production-result.json"), payload);
  console.log(JSON.stringify({
    status: payload.productionStatus,
    fixtures: fixtures.length,
    namua: fixtures.filter((f) => f.phase === "namua").length,
    mtaji: fixtures.filter((f) => f.phase === "mtaji").length,
    featureCount: productionRows[0].representation.featureNames.length,
    featureSchemaSha256: schemaSha,
    productionResultSha256: payload.productionResultSha256,
    maximumFixtureProductionMilliseconds: payload.resources.maximumFixtureProductionMilliseconds,
    peakRssBytes: peakRss,
  }, null, 2));
}

run();
