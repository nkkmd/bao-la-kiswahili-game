"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const { performance } = require("node:perf_hooks");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const P = require("./lib/mdft-stage0-production.js");
const I = require("./lib/mdft-stage0-independent.js");

const STAGE_ID = "MDFT-S0-TECHNICAL-2026-08-29-v1";
const TECHNICAL_SEEDS = Array.from({ length: 32 }, (_, index) => 8_080_001 + index);
const OUT_DIR = path.resolve(process.argv[2] || "artifacts/local/mdft-stage0-technical");
const SHARD_BYTES = 128 * 1024;

function cloneJson(value) { return JSON.parse(JSON.stringify(value)); }
function sha256(bufferOrString) { return crypto.createHash("sha256").update(bufferOrString).digest("hex"); }
function assert(condition, message) { if (!condition) throw new Error(message); }
function prng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function canonicalMoves(state) {
  return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b)));
}

function generateTechnicalFixtures() {
  const fixtures = [];
  const seen = new Set();
  let namuaCount = 0;
  let mtajiCount = 0;
  for (const seed of TECHNICAL_SEEDS) {
    const random = prng(seed);
    let state = E.initialState();
    for (let ply = 0; ply <= 80 && state.winner === null; ply += 1) {
      const moves = canonicalMoves(state);
      if (!moves.length) break;
      const wantedNamua = state.phase === "namua" && [8, 20, 32, 40].includes(ply) && namuaCount < 2;
      const wantedMtaji = state.phase === "mtaji" && mtajiCount < 2 && (ply <= 52 || ply % 4 === 0);
      if ((wantedNamua || wantedMtaji) && moves.length >= 2) {
        const key = P.rawIdentityKey(state);
        if (!seen.has(key)) {
          const id = `TECH-${seed}-P${String(ply).padStart(2, "0")}-${state.phase.toUpperCase()}`;
          fixtures.push({ id, seed, ply, state: E.clone(state) });
          seen.add(key);
          if (state.phase === "namua") namuaCount += 1; else mtajiCount += 1;
        }
      }
      if (namuaCount >= 2 && mtajiCount >= 2) break;
      const selected = moves[Math.floor(random() * moves.length)];
      state = E.applyMove(state, selected).state;
    }
    if (namuaCount >= 2 && mtajiCount >= 2) break;
  }
  assert(namuaCount >= 2, `Technical fixture generation produced only ${namuaCount} Namua roots`);
  assert(mtajiCount >= 1, `Technical fixture generation produced no Mtaji root`);
  return fixtures.slice(0, 4);
}

function normalizedPv(pv) { return pv ? { moveKeys: pv.moveKeys, score: pv.score } : null; }
function normalizedCondition(row) {
  return {
    mode: row.mode, completedDepth: row.completedDepth, nodeBudget: row.nodeBudget,
    nodeBudgetUsed: row.nodeBudgetUsed, budgetExhausted: row.budgetExhausted,
    estimable: row.estimable, nonEstimableReason: row.nonEstimableReason,
    topSetMoveKeys: row.topSetMoveKeys, canonicalBestMoveKey: row.canonicalBestMoveKey,
    bestScore: row.bestScore, bestScoreClass: row.bestScoreClass,
    candidates: row.candidates, principalVariation: normalizedPv(row.principalVariation),
  };
}
function compareGrids(production, independent) {
  const conditions = Object.keys(production);
  const mismatches = [];
  for (const condition of conditions) {
    const a = normalizedCondition(production[condition]);
    const b = normalizedCondition(independent[condition]);
    if (P.stableStringify(a) !== P.stableStringify(b)) mismatches.push({ condition, production: a, independent: b });
  }
  return { passed: mismatches.length === 0, mismatches };
}

function rawIdentityControl(fixture) {
  const original = fixture.state;
  const metadataChanged = E.clone(original);
  metadataChanged.turn = (metadataChanged.turn || 0) + 1000;
  metadataChanged.reason = "TECHNICAL-METADATA-SENTINEL";
  const pendingChanged = E.clone(original);
  pendingChanged.pending = [...pendingChanged.pending];
  pendingChanged.pending[0] += 1;
  return {
    passed: P.rawIdentityKey(original) === P.rawIdentityKey(metadataChanged)
      && P.rawIdentityKey(original) !== P.rawIdentityKey(pendingChanged)
      && P.rawIdentityKey(original) === I.rawIdentityKey(original),
    metadataExcluded: P.rawIdentityKey(original) === P.rawIdentityKey(metadataChanged),
    pendingIncluded: P.rawIdentityKey(original) !== P.rawIdentityKey(pendingChanged),
    productionIndependentEqual: P.rawIdentityKey(original) === I.rawIdentityKey(original),
  };
}

function moveIdentityControl(fixtures) {
  const syntheticA = { type: "capture", phase: "namua", row: 0, index: 1, direction: "cw", side: 0, houseChoice: "use", houseTwo: false };
  const syntheticB = { ...syntheticA, houseChoice: "stop" };
  const productionA = P.moveKey(syntheticA);
  const independentA = I.moveKey(syntheticA);
  const productionB = P.moveKey(syntheticB);
  const uniqueLegal = fixtures.every(({ state }) => {
    const keys = canonicalMoves(state).map(AI.moveKey);
    return new Set(keys).size === keys.length;
  });
  return {
    passed: productionA === independentA && productionA !== productionB && uniqueLegal,
    productionIndependentExact: productionA === independentA,
    variantDistinguished: productionA !== productionB,
    legalKeysUnique: uniqueLegal,
  };
}

function orderingControl(fixture) {
  const forward = canonicalMoves(fixture.state).map(AI.moveKey);
  const reverseInput = E.moveVariants(fixture.state).slice().reverse().sort((a, b) => I.moveKey(a).localeCompare(I.moveKey(b))).map(I.moveKey);
  return { passed: P.stableStringify(forward) === P.stableStringify(reverseInput), moveCount: forward.length };
}

function leakageControl() {
  function acceptTaxonomyAssignmentInput(input) {
    const forbidden = ["terminalOutcome", "gameOutcome", "futureWinner", "humanDifficulty", "humanErrorProbability"];
    for (const key of forbidden) if (Object.hasOwn(input, key)) throw new Error(`Forbidden leakage field: ${key}`);
    return true;
  }
  let rejected = false;
  try { acceptTaxonomyAssignmentInput({ layers: ["A", "B", "C", "D"], terminalOutcome: "WIN" }); }
  catch { rejected = true; }
  return { passed: rejected && acceptTaxonomyAssignmentInput({ layers: ["A", "B", "C", "D"] }) };
}

function comparerControls(example) {
  const same = cloneJson(example);
  const negativePassed = P.stableStringify(example) === P.stableStringify(same);
  const tampered = cloneJson(example);
  const keys = tampered.legalMoveKeys;
  assert(keys.length >= 2, "Positive comparer control needs two legal moves");
  tampered.searchGrid.D2_Q1_BASE.canonicalBestMoveKey = keys.find((key) => key !== tampered.searchGrid.D2_Q1_BASE.canonicalBestMoveKey);
  const positiveDetected = P.stableStringify(example) !== P.stableStringify(tampered);
  return {
    negative: { passed: negativePassed, semantics: "identical artifact must compare equal" },
    positive: { passed: positiveDetected, semantics: "intentional exact-field corruption must be detected" },
  };
}

function serializationControl(value) {
  const serialized = P.stableStringify(value);
  const roundTrip = JSON.parse(serialized);
  const serializedAgain = P.stableStringify(roundTrip);
  return { passed: serialized === serializedAgain && sha256(serialized) === sha256(serializedAgain), sha256: sha256(serialized), bytes: Buffer.byteLength(serialized) };
}

function finiteEvaluatorControl(rows) {
  const scalars = rows.flatMap((row) => [
    row.evaluator.total, row.evaluator.reserveEfficiency.feature, row.evaluator.reserveEfficiency.weight,
    row.evaluator.reserveEfficiency.contribution, row.evaluator.houseValue.feature,
    row.evaluator.houseValue.weight, row.evaluator.houseValue.contribution,
  ]).filter((value) => value !== null);
  return { passed: scalars.every(Number.isFinite), scalarCount: scalars.length };
}

function referenceBudgetPreflight(rows) {
  const completed = rows.filter((row) => row.searchGrid.B1024_Q1_MAXD3.completedDepth === 3).length;
  return {
    fixtureCount: rows.length, completedDepth3Count: completed,
    allDepth1Estimable: rows.every((row) => row.searchGrid.B1024_Q1_MAXD3.completedDepth >= 1),
    note: "Technical fixture completion is a feasibility diagnostic, not a scientific population estimate.",
  };
}

function shardBuffer(buffer, directory) {
  fs.mkdirSync(directory, { recursive: true });
  const shards = [];
  for (let offset = 0, index = 0; offset < buffer.length; offset += SHARD_BYTES, index += 1) {
    const shard = buffer.subarray(offset, Math.min(buffer.length, offset + SHARD_BYTES));
    const name = `stage0-full-${String(index).padStart(4, "0")}.json.gz.part`;
    fs.writeFileSync(path.join(directory, name), shard);
    shards.push({ name, bytes: shard.length, sha256: sha256(shard) });
  }
  return shards;
}

function main() {
  const wallStart = performance.now();
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const fixtureStart = performance.now();
  const fixtures = generateTechnicalFixtures();
  const fixtureMs = performance.now() - fixtureStart;

  const productionRows = [];
  const independentRows = [];
  const equality = [];
  const perFixtureRuntimeMs = [];
  for (const fixture of fixtures) {
    const start = performance.now();
    const production = P.analyzeFixture(fixture.state, fixture.id);
    const independent = I.analyzeFixture(fixture.state, fixture.id);
    const comparison = compareGrids(production.searchGrid, independent.searchGrid);
    assert(comparison.passed, `Production/independent mismatch at ${fixture.id}`);
    assert(production.rawIdentityKey === independent.rawIdentityKey, `RAW key mismatch at ${fixture.id}`);
    assert(P.stableStringify(production.legalMoveKeys) === P.stableStringify(independent.legalMoveKeys), `Legal move mismatch at ${fixture.id}`);
    productionRows.push(production);
    independentRows.push(independent);
    equality.push({ fixtureId: fixture.id, ...comparison, rawIdentityEqual: true, legalMoveSetEqual: true });
    perFixtureRuntimeMs.push(performance.now() - start);
  }

  const first = fixtures[0];
  const identity = rawIdentityControl(first);
  const moveIdentity = moveIdentityControl(fixtures);
  const ordering = orderingControl(first);
  const leakage = leakageControl();
  const comparer = comparerControls(productionRows[0]);
  const evaluator = finiteEvaluatorControl(productionRows);
  const determinismRerun = P.analyzeFixture(first.state, first.id);
  const determinism = { passed: determinismRerun.outputSha256 === productionRows[0].outputSha256, sha256: productionRows[0].outputSha256 };
  const productionIndependent = { passed: equality.every((row) => row.passed && row.rawIdentityEqual && row.legalMoveSetEqual), rows: equality };
  const budgetPreflight = referenceBudgetPreflight(productionRows);

  const core = {
    schemaVersion: "1.0.0", stageId: STAGE_ID, stageType: "TECHNICAL_ONLY",
    scientificInferenceAuthorized: false, scientificSeedUseAllowed: false,
    technicalSeeds: TECHNICAL_SEEDS,
    fixtures: fixtures.map(({ id, seed, ply, state }) => ({ id, technicalSeed: seed, ply, phase: state.phase, rawIdentityKey: P.rawIdentityKey(state), legalMoveCount: canonicalMoves(state).length })),
    productionRows, independentRows,
    controls: { identity, moveIdentity, ordering, leakage, comparer, evaluator, determinism, productionIndependent },
    technicalEligibility: {
      "MDFT-F05": productionIndependent.passed ? "TECHNICALLY-ELIGIBLE-LINE-TRACE-EXACT-ON-FIXTURES" : "TECHNICALLY-INELIGIBLE",
      "MDFT-F09": "PENDING-STATIC-HISTORICAL-CLASSIFIER-AUDIT",
      "MDFT-F10": "PENDING-BOUNDED-CONTINUATION-RESOURCE-PREFLIGHT",
    },
    referenceBudgetPreflight: budgetPreflight,
  };
  const serialization = serializationControl(core);
  core.controls.serialization = serialization;
  const requiredPass = [identity.passed, moveIdentity.passed, ordering.passed, leakage.passed,
    comparer.negative.passed, comparer.positive.passed, evaluator.passed, determinism.passed,
    productionIndependent.passed, serialization.passed, budgetPreflight.allDepth1Estimable].every(Boolean);

  const canonical = Buffer.from(P.stableStringify(core), "utf8");
  const gzip = zlib.gzipSync(canonical, { level: 9 });
  const shards = shardBuffer(gzip, path.join(OUT_DIR, "full-shards"));
  const ru = process.resourceUsage();
  const runtime = {
    fixtureGenerationMs: fixtureMs,
    perFixtureRuntimeMs,
    meanFixtureRuntimeMs: perFixtureRuntimeMs.reduce((a, b) => a + b, 0) / perFixtureRuntimeMs.length,
    maxFixtureRuntimeMs: Math.max(...perFixtureRuntimeMs),
    totalWallMs: performance.now() - wallStart,
    maxRssKb: ru.maxRSS,
  };
  const artifact = {
    canonicalBytes: canonical.length, gzipBytes: gzip.length,
    compressionRatio: canonical.length ? gzip.length / canonical.length : null,
    shardCeilingBytes: SHARD_BYTES, shardCount: shards.length, shards,
    projections: Object.fromEntries([1024, 4096, 8192].map((roots) => [String(roots), {
      canonicalBytesAtCurrentMean: Math.ceil((canonical.length / fixtures.length) * roots),
      gzipBytesAtCurrentMeanRatio: Math.ceil((canonical.length / fixtures.length) * roots * (gzip.length / canonical.length)),
    }])),
    note: "Projection from technical fixtures only; not a scientific target-distribution estimate.",
  };
  const final = {
    schemaVersion: "1.0.0", stageId: STAGE_ID,
    disposition: requiredPass ? "STAGE0-CORE-TECHNICAL-PASS-PENDING-F09-F10" : "STAGE0-TECHNICAL-INVALID",
    scientificInferenceAuthorized: false, scientificSeedUseAllowed: false,
    runtime, artifact, coreSha256: sha256(canonical), controls: core.controls,
    referenceBudgetPreflight: budgetPreflight, technicalEligibility: core.technicalEligibility,
  };

  fs.writeFileSync(path.join(OUT_DIR, "ESSENTIAL_CORE.json"), `${JSON.stringify(final, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, "FULL_TECHNICAL_CORE.json"), `${JSON.stringify(core, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, "FINAL_EXACT_COMPARISON.json"), `${JSON.stringify({ stageId: STAGE_ID, passed: productionIndependent.passed, rows: equality }, null, 2)}\n`);
  const manifestEntries = ["ESSENTIAL_CORE.json", "FULL_TECHNICAL_CORE.json", "FINAL_EXACT_COMPARISON.json"].map((name) => {
    const data = fs.readFileSync(path.join(OUT_DIR, name));
    return { name, bytes: data.length, sha256: sha256(data) };
  });
  fs.writeFileSync(path.join(OUT_DIR, "HASH_MANIFEST.json"), `${JSON.stringify({ stageId: STAGE_ID, files: manifestEntries, shards }, null, 2)}\n`);

  process.stdout.write(`${JSON.stringify(final, null, 2)}\n`);
  if (!requiredPass) process.exitCode = 1;
}

main();
