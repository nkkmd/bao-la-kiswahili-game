#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const C = require("./lib/position-evaluation-calibration-common.js");

function parseArgs(argv) {
  const options = { phase: "all", output: C.DEFAULT_OUTPUT };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--phase") options.phase = value;
    else if (key === "--output") options.output = path.resolve(value);
    else throw new Error(`Unknown argument: ${key}`);
    i += 1;
  }
  if (!["generate", "select-measure", "all"].includes(options.phase)) {
    throw new Error("--phase must be generate, select-measure, or all");
  }
  return options;
}

function generate(output, loaded, authorization) {
  const { spec, specSha256 } = loaded;
  fs.mkdirSync(path.join(output, "games"), { recursive: true });
  for (let index = 0; index < spec.population.games; index += 1) {
    const file = C.gamePath(output, index);
    if (fs.existsSync(file)) {
      const existing = C.readJson(file);
      if (existing.specSha256 !== specSha256 || existing.seed !== spec.population.seedStart + index) {
        throw new Error(`Existing game does not match frozen Stage 1 identity: ${file}`);
      }
      continue;
    }
    C.writeJson(file, C.runGame(spec, specSha256, index));
    if ((index + 1) % 64 === 0 || index + 1 === spec.population.games) {
      process.stderr.write(`[generate] ${index + 1}/${spec.population.games}\n`);
    }
  }
  C.writeJson(path.join(output, "generation-manifest.json"), {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    authorizationSha256: authorization.authorizationSha256,
    games: spec.population.games,
    seedStart: spec.population.seedStart,
    seedEnd: spec.population.seedEnd,
    source: C.provenance(spec),
  });
}

function selectMeasure(output, loaded) {
  const { spec, specSha256 } = loaded;
  const games = C.readGames(output, spec);
  const selection = C.selectStates(games, spec);
  fs.mkdirSync(path.join(output, "measurements"), { recursive: true });
  const measurements = selection.selected.map((row, index) => {
    const measured = C.measureSelected(row, spec);
    C.writeJson(C.measurementPath(output, index), measured);
    return measured;
  });
  const phaseCounts = Object.fromEntries(["namua", "mtaji"].map((phase) => [
    phase,
    measurements.filter((row) => row.phase === phase).length,
  ]));
  const nontruncated = measurements.filter((row) => !row.administrativeTruncation);
  const outcomeByPhase = Object.fromEntries(["namua", "mtaji"].map((phase) => {
    const rows = nontruncated.filter((row) => row.phase === phase);
    return [phase, {
      actorWins: rows.filter((row) => row.actorWin === 1).length,
      actorLosses: rows.filter((row) => row.actorWin === 0).length,
    }];
  }));
  const distinctEvaluationByPhase = Object.fromEntries(["namua", "mtaji"].map((phase) => [
    phase,
    new Set(measurements.filter((row) => row.phase === phase)
      .map((row) => row.staticBaoEvaluation)).size,
  ]));
  const summary = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    generatedGames: games.length,
    uniqueHistoricalTrajectories: selection.representatives.length,
    provisionalSelectedStates: selection.provisional.length,
    unavailableAssignedPhase: selection.unavailableAssignedPhase,
    duplicateSelectedRuleStatesCollapsed: selection.duplicateSelectedRuleStatesCollapsed,
    selectedUniqueRuleStates: measurements.length,
    phaseCounts,
    distinctOpeningPrefixes: new Set(measurements.map((row) => row.openingPrefixHash)).size,
    distinctStaticEvaluationByPhase: distinctEvaluationByPhase,
    administrativeTruncationSelectedStates: measurements.filter((row) => row.administrativeTruncation).length,
    administrativeTruncationRate: measurements.length
      ? measurements.filter((row) => row.administrativeTruncation).length / measurements.length : null,
    outcomeByPhase,
    selectionHash: C.sha256(JSON.stringify(measurements.map((row) => ({
      historicalTrajectoryHash: row.historicalTrajectoryHash,
      ruleStateKey: row.ruleStateKey,
      ply: row.ply,
      phase: row.phase,
      openingPrefixHash: row.openingPrefixHash,
    })))),
    measurementHash: C.sha256(JSON.stringify(measurements)),
  };
  C.writeJson(path.join(output, "stage1-selection-measurement-summary.json"), summary);
  return summary;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const loaded = C.loadSpec();
  const authorization = C.loadAuthorization(loaded.spec, loaded.specSha256);
  if (options.phase === "generate" || options.phase === "all") {
    generate(options.output, loaded, authorization);
  }
  let summary = null;
  if (options.phase === "select-measure" || options.phase === "all") {
    summary = selectMeasure(options.output, loaded);
  }
  console.log(JSON.stringify({
    passed: true,
    stageId: loaded.spec.stageId,
    phase: options.phase,
    output: options.output,
    ...(summary ? { summary } : {}),
  }, null, 2));
}

if (require.main === module) main();

module.exports = { generate, parseArgs, selectMeasure };
