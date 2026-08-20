#!/usr/bin/env node
"use strict";

const path = require("node:path");
const C = require("./lib/position-evaluation-calibration-stage2-common.js");
const Validator = require("./validate-position-evaluation-calibration-stage2-spec.js");

function parseArgs(argv) {
  const options = { output: null, stage1Output: C.DEFAULT_STAGE1_OUTPUT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") options.output = path.resolve(argv[++i]);
    else if (argv[i] === "--stage1-output") options.stage1Output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!options.output) throw new Error("--output is required");
  return options;
}
function main() {
  const options = parseArgs(process.argv.slice(2));
  const loaded = C.loadSpec();
  Validator.validateSpec(loaded.spec);
  const ref = C.loadStage1Reference(options.stage1Output, loaded.spec);
  const smokeSpec = JSON.parse(JSON.stringify(loaded.spec));
  smokeSpec.population.games = 8;
  smokeSpec.population.seedStart = 990101;
  smokeSpec.population.seedEnd = 990108;
  const gamesA = Array.from({ length: 8 }, (_, i) => C.runGame(smokeSpec, loaded.specSha256, i));
  const gamesB = Array.from({ length: 8 }, (_, i) => C.runGame(smokeSpec, loaded.specSha256, i));
  const deterministicReplay = C.sha256(JSON.stringify(gamesA)) === C.sha256(JSON.stringify(gamesB));
  const selection = C.selectStates(gamesA, smokeSpec, ref);
  const measurements = selection.selected.map((row) => C.measureSelected(row, smokeSpec, ref.result));
  const finitePredictions = measurements.every((r) => Number.isFinite(r.frozenWinProbability)
    && r.frozenWinProbability >= 0 && r.frozenWinProbability <= 1 && Number.isFinite(r.staticBaoEvaluation));
  const result = {
    schemaVersion: 1,
    smokeId: "PEC-S2-SMOKE-2026-08-20-v1",
    stageId: loaded.spec.stageId,
    specSha256: loaded.specSha256,
    passed: deterministicReplay && finitePredictions,
    scientificGeneration: false,
    formalInferencePerformed: false,
    stage2GenerationAuthorized: false,
    smokeSeeds: [990101, 990108],
    scientificReuseAllowed: false,
    deterministicReplay,
    stage1ResultHashVerified: true,
    stage1MeasurementHashVerified: true,
    games: gamesA.length,
    uniqueHistoricalTrajectories: C.representativeGames(gamesA).length,
    selectedStates: measurements.length,
    finiteFrozenModelPredictions: finitePredictions,
    source: C.provenance(loaded.spec),
    authorizationFilePresent: require("node:fs").existsSync(C.AUTH_PATH),
    generationAuthorizedBySpecAlone: loaded.spec.authorization.generationAuthorizedBySpecAlone,
  };
  C.writeJson(options.output, result);
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
}
if (require.main === module) main();
