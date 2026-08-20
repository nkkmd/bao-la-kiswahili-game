#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const C = require("./lib/position-evaluation-calibration-stage2-common.js");

function parseArgs(argv) {
  const options = { phase: "all", output: C.DEFAULT_OUTPUT, stage1Output: C.DEFAULT_STAGE1_OUTPUT };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === "--phase") options.phase = value;
    else if (key === "--output") options.output = path.resolve(value);
    else if (key === "--stage1-output") options.stage1Output = path.resolve(value);
    else throw new Error(`Unknown argument: ${key}`);
    i += 1;
  }
  if (!["generate", "select-measure", "all"].includes(options.phase)) throw new Error("--phase must be generate, select-measure, or all");
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
        throw new Error(`Existing Stage 2 game does not match frozen identity: ${file}`);
      }
      continue;
    }
    C.writeJson(file, C.runGame(spec, specSha256, index));
    if ((index + 1) % 64 === 0 || index + 1 === spec.population.games) {
      process.stderr.write(`[stage2-generate] ${index + 1}/${spec.population.games}\n`);
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
function selectMeasure(output, stage1Output, loaded) {
  const { spec, specSha256 } = loaded;
  const stage1Reference = C.loadStage1Reference(stage1Output, spec);
  const games = C.readGames(output, spec);
  const selection = C.selectStates(games, spec, stage1Reference);
  fs.mkdirSync(path.join(output, "measurements"), { recursive: true });
  const measurements = selection.selected.map((row, index) => {
    const measured = C.measureSelected(row, spec, stage1Reference.result);
    C.writeJson(C.measurementPath(output, index), measured);
    return measured;
  });
  const binary = measurements.filter((row) => !row.administrativeTruncation);
  const phaseCounts = Object.fromEntries(["namua", "mtaji"].map((phase) => [phase, measurements.filter((r) => r.phase === phase).length]));
  const outcomeByPhase = Object.fromEntries(["namua", "mtaji"].map((phase) => {
    const rows = binary.filter((r) => r.phase === phase);
    return [phase, { actorWins: rows.filter((r) => r.actorWin === 1).length, actorLosses: rows.filter((r) => r.actorWin === 0).length }];
  }));
  const distinctStaticEvaluationByPhase = Object.fromEntries(["namua", "mtaji"].map((phase) => [
    phase, new Set(measurements.filter((r) => r.phase === phase).map((r) => r.staticBaoEvaluation)).size,
  ]));
  const crossStageOverlap = {
    historicalTrajectoryHash: measurements.filter((r) => stage1Reference.trajectoryHashes.has(r.historicalTrajectoryHash)).length,
    openingPrefixHash: measurements.filter((r) => stage1Reference.openingPrefixHashes.has(r.openingPrefixHash)).length,
    ruleStateKey: measurements.filter((r) => stage1Reference.ruleStateKeys.has(r.ruleStateKey)).length,
  };
  const summary = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    formalInferenceAuthorizedByDesign: true,
    generatedGames: games.length,
    uniqueHistoricalTrajectoriesBeforeStage1Firewall: selection.representativesBeforeStage1Firewall.length,
    uniqueHistoricalTrajectoriesAfterStage1TrajectoryOpeningFirewall: selection.trajectoryEligible.length,
    stage1TrajectoryOverlapExcluded: selection.stage1TrajectoryOverlapExcluded,
    stage1OpeningPrefixOverlapExcluded: selection.stage1OpeningPrefixOverlapExcluded,
    stage1RuleStateObservationsExcluded: selection.stage1RuleStateObservationsExcluded,
    provisionalSelectedStates: selection.provisional.length,
    unavailableAssignedPhase: selection.unavailableAssignedPhase,
    duplicateSelectedRuleStatesCollapsed: selection.duplicateSelectedRuleStatesCollapsed,
    selectedUniqueRuleStates: measurements.length,
    phaseCounts,
    distinctOpeningPrefixes: new Set(measurements.map((r) => r.openingPrefixHash)).size,
    distinctStaticEvaluationByPhase,
    administrativeTruncationSelectedStates: measurements.filter((r) => r.administrativeTruncation).length,
    administrativeTruncationRate: measurements.length ? measurements.filter((r) => r.administrativeTruncation).length / measurements.length : null,
    outcomeByPhase,
    crossStageOverlap,
    selectionHash: C.sha256(JSON.stringify(measurements.map((r) => ({
      historicalTrajectoryHash: r.historicalTrajectoryHash, ruleStateKey: r.ruleStateKey, ply: r.ply,
      phase: r.phase, openingPrefixHash: r.openingPrefixHash,
    })))),
    measurementHash: C.sha256(JSON.stringify(measurements)),
    stage1ResultSha256: spec.stage1Dependency.stage1ResultSha256,
    stage1MeasurementHash: spec.stage1Dependency.stage1MeasurementHash,
  };
  C.writeJson(path.join(output, "stage2-selection-measurement-summary.json"), summary);
  return summary;
}
function main() {
  const options = parseArgs(process.argv.slice(2));
  const loaded = C.loadSpec();
  const authorization = C.loadAuthorization(loaded.spec, loaded.specSha256);
  if (options.phase === "generate" || options.phase === "all") generate(options.output, loaded, authorization);
  let summary = null;
  if (options.phase === "select-measure" || options.phase === "all") summary = selectMeasure(options.output, options.stage1Output, loaded);
  console.log(JSON.stringify({ passed: true, stageId: loaded.spec.stageId, phase: options.phase, output: options.output, ...(summary ? { summary } : {}) }, null, 2));
}
if (require.main === module) main();
module.exports = { generate, parseArgs, selectMeasure };
