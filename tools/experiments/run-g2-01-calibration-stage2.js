#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const C = require("./lib/g2-01-calibration-stage2-common.js");

function parseArgs(argv) {
  const options = {
    phase: "generate",
    output: C.DEFAULT_OUTPUT,
    stage1Output: null,
    startIndex: 0,
    count: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (key === "--phase") options.phase = argv[++i];
    else if (key === "--output") options.output = path.resolve(argv[++i]);
    else if (key === "--stage1-output") options.stage1Output = path.resolve(argv[++i]);
    else if (key === "--start-index") options.startIndex = Number(argv[++i]);
    else if (key === "--count") options.count = Number(argv[++i]);
    else throw new Error(`Unknown argument: ${key}`);
  }
  if (!["generate", "select-measure"].includes(options.phase)) throw new Error("--phase must be generate or select-measure");
  return options;
}

function validateShard(spec, startIndex, count) {
  const n = count === null ? spec.population.games - startIndex : count;
  if (!Number.isInteger(startIndex) || startIndex < 0 || startIndex >= spec.population.games) throw new Error("Invalid --start-index");
  if (!Number.isInteger(n) || n < 1 || startIndex + n > spec.population.games) throw new Error("Invalid --count");
  return n;
}

function generate(output, loaded, authorization, startIndex, count) {
  const { spec, specSha256 } = loaded;
  const n = validateShard(spec, startIndex, count);
  fs.mkdirSync(path.join(output, "games"), { recursive: true });
  for (let offset = 0; offset < n; offset += 1) {
    const index = startIndex + offset;
    const file = C.gamePath(output, index);
    if (fs.existsSync(file)) {
      const existing = C.readJson(file);
      if (existing.specSha256 !== specSha256 || existing.gameIndex !== index || existing.seed !== spec.population.seedStart + index) {
        throw new Error(`Existing Stage 2 game does not match frozen identity: ${file}`);
      }
      continue;
    }
    C.writeJson(file, C.runGame(spec, specSha256, index));
    if ((offset + 1) % 64 === 0 || offset + 1 === n) {
      process.stderr.write(`[stage2-generate] ${offset + 1}/${n} global-index=${index}\n`);
    }
  }
  const endIndex = startIndex + n - 1;
  const manifest = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    scientificInferenceAuthorized: true,
    authorizationSha256: authorization.authorizationSha256,
    totalFrozenPopulationGames: spec.population.games,
    shard: {
      startIndex,
      endIndex,
      count: n,
      seedStart: spec.population.seedStart + startIndex,
      seedEnd: spec.population.seedStart + endIndex,
    },
    source: C.provenance(),
  };
  const name = `generation-manifest-shard-${String(startIndex).padStart(4, "0")}-${String(endIndex).padStart(4, "0")}.json`;
  C.writeJson(path.join(output, name), manifest);
  return manifest;
}

function selectMeasure(output, stage1Output, loaded, authorization) {
  if (!stage1Output) throw new Error("--stage1-output is required for select-measure");
  const { spec, specSha256 } = loaded;
  const frozen = C.loadFrozenMapping();
  const stage1Reference = C.buildStage1Reference(stage1Output);
  const games = C.readGames(output, spec);
  const selection = C.selectStates(games, spec, stage1Reference);
  fs.mkdirSync(path.join(output, "measurements"), { recursive: true });
  const measurements = selection.selected.map((row, index) => {
    const measured = C.measureSelected(row, spec, frozen);
    C.writeJson(C.measurementPath(output, index), measured);
    return measured;
  });
  const binary = measurements.filter((row) => !row.administrativeTruncation);
  const phaseCounts = Object.fromEntries(["namua", "mtaji"].map((phase) => [phase, measurements.filter((row) => row.phase === phase).length]));
  const outcomeByPhase = Object.fromEntries(["namua", "mtaji"].map((phase) => {
    const rows = binary.filter((row) => row.phase === phase);
    return [phase, { actorWins: rows.filter((row) => row.actorWin === 1).length, actorLosses: rows.filter((row) => row.actorWin === 0).length }];
  }));
  const distinctStaticEvaluationByPhase = Object.fromEntries(["namua", "mtaji"].map((phase) => [
    phase,
    new Set(measurements.filter((row) => row.phase === phase).map((row) => row.staticBaoEvaluation)).size,
  ]));
  const crossStageOverlap = {
    historicalTrajectoryHash: measurements.filter((row) => stage1Reference.trajectoryHashes.has(row.historicalTrajectoryHash)).length,
    openingPrefixHash: measurements.filter((row) => stage1Reference.openingPrefixHashes.has(row.openingPrefixHash)).length,
    rawStateKey: measurements.filter((row) => stage1Reference.rawStateKeys.has(row.rawStateKey)).length,
  };
  const summary = {
    schemaVersion: 1,
    programLabel: "G2-01",
    researchGeneration: "Research Generation 2",
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    formalInferenceAuthorizedByDesign: true,
    generatedGames: games.length,
    uniqueHistoricalTrajectoriesBeforeStage1Firewall: selection.representativesBeforeStage1Firewall.length,
    uniqueHistoricalTrajectoriesAfterStage1TrajectoryOpeningFirewall: selection.trajectoryEligible.length,
    stage1TrajectoryOverlapExcluded: selection.stage1TrajectoryOverlapExcluded,
    stage1OpeningPrefixOverlapExcluded: selection.stage1OpeningPrefixOverlapExcluded,
    stage1RawStateObservationsExcluded: selection.stage1RawStateObservationsExcluded,
    provisionalSelectedStates: selection.provisional.length,
    unavailableAssignedPhase: selection.unavailableAssignedPhase,
    duplicateSelectedRawStatesCollapsed: selection.duplicateSelectedRawStatesCollapsed,
    selectedUniqueRawStates: measurements.length,
    phaseCounts,
    distinctOpeningPrefixes: new Set(measurements.map((row) => row.openingPrefixHash)).size,
    distinctStaticEvaluationByPhase,
    administrativeTruncationSelectedStates: measurements.filter((row) => row.administrativeTruncation).length,
    administrativeTruncationRate: measurements.length ? measurements.filter((row) => row.administrativeTruncation).length / measurements.length : null,
    outcomeByPhase,
    crossStageOverlap,
    stage1ReferenceUniverseSha256: stage1Reference.universeSha256,
    stage1FrozenMappingSha256: frozen.mappingSha256,
    selectionHash: C.sha256(JSON.stringify(measurements.map((row) => ({
      historicalTrajectoryHash: row.historicalTrajectoryHash,
      rawStateKey: row.rawStateKey,
      ply: row.ply,
      phase: row.phase,
      openingPrefixHash: row.openingPrefixHash,
    })))),
    measurementHash: C.sha256(JSON.stringify(measurements)),
  };
  C.writeJson(path.join(output, "stage2-selection-measurement-summary.json"), summary);
  C.writeJson(path.join(output, "generation-manifest.json"), {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    scientificInferenceAuthorized: true,
    authorizationSha256: authorization.authorizationSha256,
    games: spec.population.games,
    seedStart: spec.population.seedStart,
    seedEnd: spec.population.seedEnd,
    executionMode: "fixed-population-shards-merged-before-outcome-blind-selection",
    source: C.provenance(),
  });
  return summary;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const loaded = C.loadSpec();
  const authorization = C.loadAuthorization(loaded.spec, loaded.specSha256);
  let result;
  if (options.phase === "generate") result = generate(options.output, loaded, authorization, options.startIndex, options.count);
  else result = selectMeasure(options.output, options.stage1Output, loaded, authorization);
  console.log(JSON.stringify({ passed: true, stageId: loaded.spec.stageId, phase: options.phase, output: options.output, result }, null, 2));
}

if (require.main === module) main();
module.exports = { generate, parseArgs, selectMeasure, validateShard };
