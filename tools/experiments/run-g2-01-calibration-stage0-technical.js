#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");
const Raw = require("./lib/ssgtc-representation-production.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_DIR = path.join(ROOT, "doc/position-evaluation-empirical-outcome-calibration-replication/preregistration");
const S0_PATH = path.join(SPEC_DIR, "STAGE_0_TECHNICAL_SPEC.json");
const S1_PATH = path.join(SPEC_DIR, "STAGE_1_DEVELOPMENT_SPEC.json");
const S2_PATH = path.join(SPEC_DIR, "STAGE_2_FORMAL_SPEC.json");
const DEFAULT_OUT = path.join(ROOT, "artifacts/local/position-evaluation-empirical-outcome-calibration-replication/stage0-technical-v1");

function ensure(ok, message) { if (!ok) throw new Error(message); }
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function readText(file) { return fs.readFileSync(file, "utf8"); }
function parseOut(argv) {
  const i = argv.indexOf("--out");
  return i >= 0 ? path.resolve(argv[i + 1]) : DEFAULT_OUT;
}
function clone(value) { return JSON.parse(JSON.stringify(value)); }

function fitIsotonic(rows) {
  const sorted = [...rows].sort((a, b) => a.z - b.z || a.id.localeCompare(b.id));
  const support = [];
  for (const row of sorted) {
    const last = support[support.length - 1];
    if (last && last.z === row.z) {
      last.weight += 1;
      last.sumY += row.y;
    } else {
      support.push({ z: row.z, weight: 1, sumY: row.y });
    }
  }
  const blocks = [];
  for (const point of support) {
    blocks.push({
      minZ: point.z, maxZ: point.z, weight: point.weight,
      sumY: point.sumY, mean: point.sumY / point.weight,
    });
    while (blocks.length >= 2 && blocks[blocks.length - 2].mean > blocks[blocks.length - 1].mean) {
      const right = blocks.pop();
      const left = blocks.pop();
      const weight = left.weight + right.weight;
      const sumY = left.sumY + right.sumY;
      blocks.push({
        minZ: left.minZ, maxZ: right.maxZ, weight, sumY, mean: sumY / weight,
      });
    }
  }
  return blocks;
}
function predictIsotonic(blocks, z) {
  ensure(blocks.length > 0, "empty isotonic fit");
  if (z < blocks[0].minZ) return blocks[0].mean;
  let chosen = blocks[0];
  for (const block of blocks) {
    if (block.minZ <= z) chosen = block;
    else break;
  }
  return chosen.mean;
}
function clipProbability(p) { return Math.min(0.99, Math.max(0.01, p)); }
function brier(p, y) { return (p - y) ** 2; }
function logLoss(p, y) { return -(y * Math.log(p) + (1 - y) * Math.log(1 - p)); }
function bootstrapIndex(replicate, phase, draw, n) {
  const digest = sha256(`PEOCR-S2-BOOT-v1|${replicate}|${phase}|${draw}`);
  return Number(BigInt(`0x${digest}`) % BigInt(n));
}
function sigmoid(x) {
  if (x >= 0) return 1 / (1 + Math.exp(-x));
  const e = Math.exp(x);
  return e / (1 + e);
}
function logit(p) { return Math.log(p / (1 - p)); }
function fitCalibrationLine(rows) {
  let a = 0;
  let b = 1;
  for (let iteration = 0; iteration <= 200; iteration += 1) {
    let g0 = 0, g1 = 0, i00 = 0, i01 = 0, i11 = 0;
    for (const row of rows) {
      const x = logit(row.p);
      const q = sigmoid(a + b * x);
      const r = row.y - q;
      const w = q * (1 - q);
      g0 += r; g1 += r * x;
      i00 += w; i01 += w * x; i11 += w * x * x;
    }
    const maxAbsGradient = Math.max(Math.abs(g0), Math.abs(g1));
    if (maxAbsGradient <= 1e-8) return { converged: true, iterations: iteration, intercept: a, slope: b, maxAbsGradient };
    const determinant = i00 * i11 - i01 * i01;
    ensure(Number.isFinite(determinant) && Math.abs(determinant) > 1e-15, "calibration-line singular information");
    const da = (g0 * i11 - g1 * i01) / determinant;
    const db = (i00 * g1 - i01 * g0) / determinant;
    ensure(Number.isFinite(da) && Number.isFinite(db), "calibration-line non-finite update");
    a += da; b += db;
  }
  return { converged: false, iterations: 200, intercept: a, slope: b };
}

function openingTrajectory(seed) {
  const rng = seededRandom(seed);
  let state = E.initialState();
  const rows = [];
  for (let ply = 0; ply <= 60; ply += 1) {
    Raw.assertStudyState(state);
    rows.push({ ply, state: Raw.rawRuleState(state), stateKey: Raw.stateKey(state), phase: state.phase, winner: state.winner });
    if (state.winner !== null || ply === 60) break;
    const legal = E.moveVariants(state);
    ensure(legal.length > 0, "nonterminal fixture state has no legal move");
    const move = legal[Math.floor(rng() * legal.length)];
    state = E.applyMove(state, move).state;
  }
  return rows;
}
function chooseFixtures(spec) {
  for (let seed = spec.quarantinedSmokeSeeds.start; seed <= spec.quarantinedSmokeSeeds.end; seed += 1) {
    const rows = openingTrajectory(seed);
    const namua = rows.find((row) => row.ply >= 8 && row.phase === "namua" && row.winner === null);
    const mtaji = rows.find((row) => row.phase === "mtaji" && row.winner === null);
    if (namua && mtaji) return { seed, fixtures: [
      { id: "NAMUA", ply: namua.ply, state: namua.state },
      { id: "MTAJI", ply: mtaji.ply, state: mtaji.state },
    ] };
  }
  throw new Error("quarantined technical seed menu did not yield both Namua and Mtaji fixtures");
}
function analyzeFixture(state) {
  const options = {
    evaluationProfile: "bao",
    searchProfile: "phase2",
    maxDepth: 2,
    timeLimitMs: Infinity,
    quiescenceDepth: 1,
    orderQuiescenceCaptures: false,
    adaptive: false,
    stableBestDepths: 0,
    aspirationWindow: 0,
  };
  const a = AI.analyzeMove(state, "hard", seededRandom(991), options);
  const b = AI.analyzeMove(state, "hard", seededRandom(991), options);
  ensure(a.move && b.move, "analysis returned no move");
  return {
    moveKeyA: AI.moveKey(a.move),
    moveKeyB: AI.moveKey(b.move),
    rootScoreA: a.stats.rootScore,
    rootScoreB: b.stats.rootScore,
    completedDepthA: a.stats.completedDepth,
    completedDepthB: b.stats.completedDepth,
    timedOutA: a.stats.timedOut,
    timedOutB: b.stats.timedOut,
  };
}

function main() {
  const out = parseOut(process.argv.slice(2));
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  const s0Text = readText(S0_PATH);
  const s1Text = readText(S1_PATH);
  const s2Text = readText(S2_PATH);
  const s0 = JSON.parse(s0Text);
  const s1 = JSON.parse(s1Text);
  const s2 = JSON.parse(s2Text);

  const gates = {};
  gates.studyIdentity = s0.studyId === "PEOCR-STUDY1" && s0.programLabel === "G2-01";
  gates.authorizationClosed = s0.scientificOutcomeGenerationAuthorized === false
    && s1.stage1GenerationAuthorized === false && s2.stage2GenerationAuthorized === false;
  gates.seedBlocksDisjoint = s0.quarantinedSmokeSeeds.end < s1.population.seedStart
    && s1.population.seedEnd < s2.population.seedStart;

  const initial = E.initialState();
  Raw.assertStudyState(initial);
  gates.rawShape = true;
  gates.seedConservation = Raw.representedSeeds(initial) === 64;
  const missingPending = clone(initial); delete missingPending.pending;
  try { Raw.assertStudyState(missingPending); gates.missingPendingRejected = false; }
  catch (error) { gates.missingPendingRejected = /pending/.test(error.message); }
  const metadataMutation = clone(initial);
  metadataMutation.turn = (metadataMutation.turn || 0) + 7;
  metadataMutation.reason = "technical-metadata-change";
  gates.turnReasonExcludedFromIdentity = Raw.stateKey(initial) === Raw.stateKey(metadataMutation);

  const selected = chooseFixtures(s0);
  const fixtures = selected.fixtures.map((fixture) => {
    Raw.assertStudyState(fixture.state);
    const actor = fixture.state.player;
    const actorEvalA = AI.evaluate(fixture.state, actor);
    const actorEvalB = AI.evaluate(fixture.state, actor);
    const opponentEval = AI.evaluate(fixture.state, 1 - actor);
    const analysis = analyzeFixture(fixture.state);
    return {
      ...fixture,
      stateKey: Raw.stateKey(fixture.state),
      representedSeeds: Raw.representedSeeds(fixture.state),
      legalMoveCount: E.moveVariants(fixture.state).length,
      actorEvalA, actorEvalB, opponentEval, analysis,
    };
  });
  gates.phaseFixtures = fixtures.some((x) => x.state.phase === "namua") && fixtures.some((x) => x.state.phase === "mtaji");
  gates.fixtureSeedConservation = fixtures.every((x) => x.representedSeeds === 64);
  gates.evaluationDeterminism = fixtures.every((x) => Object.is(x.actorEvalA, x.actorEvalB));
  gates.perspectiveAntisymmetry = fixtures.every((x) => Math.abs(x.actorEvalA + x.opponentEval) <= 1e-9);
  gates.searchDeterminism = fixtures.every((x) => x.analysis.moveKeyA === x.analysis.moveKeyB
    && Object.is(x.analysis.rootScoreA, x.analysis.rootScoreB)
    && x.analysis.completedDepthA === 2 && x.analysis.completedDepthB === 2
    && x.analysis.timedOutA === false && x.analysis.timedOutB === false);

  const isoRows = [
    { id: "a", z: -2, y: 0 }, { id: "b", z: -1, y: 1 },
    { id: "c", z: 0, y: 0 }, { id: "d", z: 1, y: 1 },
    { id: "e", z: 2, y: 1 }, { id: "f", z: 2, y: 0 },
  ];
  const blocks = fitIsotonic(isoRows);
  const monotone = blocks.every((block, i) => i === 0 || blocks[i - 1].mean <= block.mean);
  const predictions = [-3, -1, 0.5, 3].map((z) => ({ z, raw: predictIsotonic(blocks, z) }))
    .map((x) => ({ ...x, clipped: clipProbability(x.raw) }));
  gates.pavaDeterministicMonotone = monotone && JSON.stringify(blocks) === JSON.stringify(fitIsotonic(isoRows));
  gates.clippingBounded = predictions.every((x) => x.clipped >= 0.01 && x.clipped <= 0.99);

  const metricRows = [
    { p: 0.01, y: 0 }, { p: 0.01, y: 1 }, { p: 0.99, y: 0 }, { p: 0.99, y: 1 },
    { p: 0.4, y: 0 }, { p: 0.6, y: 1 },
  ];
  const metrics = metricRows.map((row) => ({ ...row, brier: brier(row.p, row.y), logLoss: logLoss(row.p, row.y) }));
  gates.properScoresFinite = metrics.every((row) => Number.isFinite(row.brier) && Number.isFinite(row.logLoss));

  const bootstrapA = Array.from({ length: 32 }, (_, i) => bootstrapIndex(7, "namua", i, 19));
  const bootstrapB = Array.from({ length: 32 }, (_, i) => bootstrapIndex(7, "namua", i, 19));
  gates.bootstrapDeterminism = JSON.stringify(bootstrapA) === JSON.stringify(bootstrapB)
    && bootstrapA.every((x) => Number.isInteger(x) && x >= 0 && x < 19);

  const calibrationRows = [
    [0.08,0],[0.12,0],[0.18,0],[0.24,1],[0.30,0],[0.36,0],
    [0.42,1],[0.48,0],[0.52,1],[0.58,0],[0.64,1],[0.70,1],
    [0.76,0],[0.82,1],[0.88,1],[0.92,1],[0.32,1],[0.68,0],
  ].map(([p,y]) => ({ p, y }));
  const calibrationFit = fitCalibrationLine(calibrationRows);
  gates.calibrationDiagnosticFinite = calibrationFit.converged
    && Number.isFinite(calibrationFit.intercept) && Number.isFinite(calibrationFit.slope);

  const sourceFiles = [
    "public/engine.js",
    "public/ai.js",
    "public/ai-weights.js",
    "tools/benchmark.js",
    "tools/experiments/lib/ssgtc-representation-production.js",
    "tools/experiments/run-g2-01-calibration-stage0-technical.js",
    "tools/experiments/verify-g2-01-calibration-stage0-independent.js",
    "doc/position-evaluation-empirical-outcome-calibration-replication/preregistration/STAGE_0_TECHNICAL_SPEC.json",
    "doc/position-evaluation-empirical-outcome-calibration-replication/preregistration/STAGE_1_DEVELOPMENT_SPEC.json",
    "doc/position-evaluation-empirical-outcome-calibration-replication/preregistration/STAGE_2_FORMAL_SPEC.json",
  ];
  const sourceFileSha256 = Object.fromEntries(sourceFiles.map((file) => [
    file, sha256(fs.readFileSync(path.join(ROOT, file))),
  ]));
  gates.specHashesStable = sourceFileSha256[sourceFiles[7]] === sha256(s0Text)
    && sourceFileSha256[sourceFiles[8]] === sha256(s1Text)
    && sourceFileSha256[sourceFiles[9]] === sha256(s2Text);

  const passedProduction = Object.values(gates).every(Boolean);
  const production = {
    schemaVersion: 1,
    studyId: "PEOCR-STUDY1",
    stageId: "PEOCR-S0-TECHNICAL-2026-08-26-v1",
    baselineMain: "9e9cb6e2525f09a873e741db9f8fa42696839fbe",
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    decision: passedProduction ? "PRODUCTION-TECHNICAL-PASS-PENDING-INDEPENDENT-VERIFICATION" : "TECHNICALLY-INVALID",
    passedProduction,
    gates,
    technical: {
      selectedTechnicalTrajectorySeed: selected.seed,
      fixtures,
      pava: { blocks, predictions },
      properScoreRows: metrics,
      bootstrapProbe: bootstrapA,
      calibrationFit,
    },
    provenance: {
      specSha256: { stage0: sha256(s0Text), stage1: sha256(s1Text), stage2: sha256(s2Text) },
      sourceFileSha256,
    },
  };
  const text = `${JSON.stringify(production, null, 2)}\n`;
  fs.writeFileSync(path.join(out, "production.json"), text);
  fs.writeFileSync(path.join(out, "production-result.json"), `${JSON.stringify({
    schemaVersion: 1,
    studyId: production.studyId,
    stageId: production.stageId,
    passedProduction,
    decision: production.decision,
    gates,
    productionFileSha256: sha256(text),
  }, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(production, null, 2)}\n`);
  if (!passedProduction) process.exitCode = 1;
}

try { main(); } catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
