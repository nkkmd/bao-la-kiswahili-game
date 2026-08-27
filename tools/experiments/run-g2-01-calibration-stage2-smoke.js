#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const C = require("./lib/g2-01-calibration-stage2-common.js");
const Eval = require("./evaluate-g2-01-calibration-stage2.js");

const TECHNICAL_SEEDS = [24010001, 24010002, 24010003, 24010004];
function clone(v) { return JSON.parse(JSON.stringify(v)); }
function core(game) { return { seed: game.seed, historicalTrajectoryHash: game.historicalTrajectoryHash, rawTrajectoryHash: game.rawTrajectoryHash, openingPrefixHash: game.openingPrefix.hash, winner: game.winner, moveKeys: game.moves.map((r) => r.moveKey) }; }
function args(argv) {
  const out = { stage1Output: null, output: path.join(C.ROOT, "artifacts/local/position-evaluation-empirical-outcome-calibration-replication/stage2-smoke-v1") };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--stage1-output") out.stage1Output = path.resolve(argv[++i]);
    else if (argv[i] === "--output") out.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!out.stage1Output) throw new Error("--stage1-output is required");
  return out;
}
function main() {
  const options = args(process.argv.slice(2));
  const { spec, specSha256 } = C.loadSpec();
  if (fs.existsSync(C.AUTH_PATH)) throw new Error("Stage 2 smoke requires closed authorization");
  const frozen = C.loadFrozenMapping();
  const reference = C.buildStage1Reference(options.stage1Output);
  const gamesA = TECHNICAL_SEEDS.map((seed, i) => C.runGame(spec, specSha256, i, seed, "peocr-s2-smoke"));
  const gamesB = TECHNICAL_SEEDS.map((seed, i) => C.runGame(spec, specSha256, i, seed, "peocr-s2-smoke"));
  const deterministicReplay = JSON.stringify(gamesA.map(core)) === JSON.stringify(gamesB.map(core));
  const selection = C.selectStates(gamesA, spec, reference);
  const measurements = selection.selected.map((row) => C.measureSelected(row, spec, frozen));

  const trajectoryProbe = clone(gamesA[0]);
  trajectoryProbe.historicalTrajectoryHash = reference.trajectoryHashes.values().next().value;
  const trajectoryProbeResult = C.selectStates([trajectoryProbe], spec, reference);
  const openingProbe = clone(gamesA[0]);
  openingProbe.openingPrefix.hash = reference.openingPrefixHashes.values().next().value;
  const openingProbeResult = C.selectStates([openingProbe], spec, reference);

  const predictionChecks = [];
  for (const phase of ["namua", "mtaji"]) {
    for (const score of [-800, -100, 0, 100, 800]) predictionChecks.push({ phase, score, ...C.predictFrozenModel(frozen.mapping, phase, score), reference: C.referencePrediction(frozen.mapping, phase) });
  }
  const syntheticRows = [
    { phase: "namua", modelPrediction: 0.2, referencePrediction: 0.48, actorWin: 0 },
    { phase: "namua", modelPrediction: 0.8, referencePrediction: 0.48, actorWin: 1 },
    { phase: "mtaji", modelPrediction: 0.3, referencePrediction: 0.52, actorWin: 0 },
    { phase: "mtaji", modelPrediction: 0.7, referencePrediction: 0.52, actorWin: 1 }
  ];
  const smokeSpec = clone(spec); smokeSpec.primaryFormalEvaluation.uncertainty.replicates = 64;
  const boot1 = Eval.bootstrapPrimary(syntheticRows, smokeSpec); const boot2 = Eval.bootstrapPrimary(syntheticRows, smokeSpec);
  const selectedOverlap = {
    historicalTrajectoryHash: measurements.filter((r) => reference.trajectoryHashes.has(r.historicalTrajectoryHash)).length,
    openingPrefixHash: measurements.filter((r) => reference.openingPrefixHashes.has(r.openingPrefixHash)).length,
    rawStateKey: measurements.filter((r) => reference.rawStateKeys.has(r.rawStateKey)).length
  };
  const gates = {
    authorizationClosed: !fs.existsSync(C.AUTH_PATH),
    noScientificSeedsUsed: TECHNICAL_SEEDS.every((s) => s < spec.population.seedStart || s > spec.population.seedEnd),
    referenceUniverseVerified: reference.universeSha256 === "5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063",
    frozenMappingVerified: frozen.mappingSha256 === "b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac",
    deterministicReplay,
    trajectoryFirewallProbe: trajectoryProbeResult.stage1TrajectoryOverlapExcluded === 1 && trajectoryProbeResult.selected.length === 0,
    openingFirewallProbe: openingProbeResult.stage1OpeningPrefixOverlapExcluded === 1 && openingProbeResult.selected.length === 0,
    selectedCrossStageOverlapZero: Object.values(selectedOverlap).every((v) => v === 0),
    predictionsFiniteAndClipped: predictionChecks.every((r) => Number.isFinite(r.prediction) && r.prediction >= 0.01 && r.prediction <= 0.99),
    properScoresFinite: syntheticRows.every((r) => Number.isFinite(C.brierLoss(r.modelPrediction, r.actorWin)) && Number.isFinite(C.logLoss(r.modelPrediction, r.actorWin))),
    primaryBootstrapDeterministic: JSON.stringify(boot1) === JSON.stringify(boot2),
    calibrationIrlsExecutable: typeof Eval.calibrationIrls(syntheticRows).converged === "boolean",
    sourceTreeClean: C.provenance().sourceTreeDirty === false
  };
  const result = {
    schemaVersion: 1, programLabel: "G2-01", researchGeneration: "Research Generation 2", studyId: spec.studyId, stageId: spec.stageId,
    smokeId: "PEOCR-S2-SMOKE-2026-08-27-v1", specSha256, passed: Object.values(gates).every(Boolean), scientificGeneration: false,
    formalInferencePerformed: false, technicalSeeds: TECHNICAL_SEEDS, technicalSeedsScientificReuseAllowed: false,
    stage1Dependency: { referenceUniverseSha256: reference.universeSha256, trajectoryCount: reference.trajectoryHashes.size,
      openingPrefixCount: reference.openingPrefixHashes.size, rawStateCount: reference.rawStateKeys.size, observations: reference.observations,
      frozenMappingSha256: frozen.mappingSha256, developmentResultSha256: frozen.resultSha256 },
    gates, selectedCrossStageOverlap: selectedOverlap, technicalGameCore: gamesA.map(core), predictionChecks, bootstrapSmoke: boot1,
    source: C.provenance()
  };
  C.writeJson(path.join(options.output, "stage2-smoke.json"), result);
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
}
if (require.main === module) main();
