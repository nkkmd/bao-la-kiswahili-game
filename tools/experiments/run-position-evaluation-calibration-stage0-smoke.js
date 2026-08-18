#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const C = require("./lib/position-evaluation-calibration-common.js");

function main() {
  const loaded = C.loadSpec();
  const smokeSpec = JSON.parse(JSON.stringify(loaded.spec));
  smokeSpec.population.games = 8;
  smokeSpec.population.seedStart = 990001;
  smokeSpec.population.seedEnd = 990008;
  smokeSpec.population.maxPly = 100;
  const first = [];
  const second = [];
  for (let index = 0; index < smokeSpec.population.games; index += 1) {
    first.push(C.runGame(smokeSpec, loaded.specSha256, index));
    second.push(C.runGame(smokeSpec, loaded.specSha256, index));
  }
  const deterministic = first.every((game, index) =>
    game.historicalTrajectoryHash === second[index].historicalTrajectoryHash
      && game.ruleTrajectoryHash === second[index].ruleTrajectoryHash
      && game.winner === second[index].winner
      && JSON.stringify(game.moves.map((row) => row.moveKey))
        === JSON.stringify(second[index].moves.map((row) => row.moveKey)));
  if (!deterministic) throw new Error("Frozen generator determinism smoke failed");

  const initial = C.E.initialState();
  const actor = initial.player;
  const actorScore = C.AI.evaluate(initial, actor);
  const opponentScore = C.AI.evaluate(initial, 1 - actor);
  if (actorScore !== -opponentScore) throw new Error("Static evaluation perspective antisymmetry failed");

  const selection = C.selectStates(first, smokeSpec);
  if (!selection.selected.length) throw new Error("Smoke state selection produced no states");
  const measurements = selection.selected.map((row) => C.measureSelected(row, smokeSpec));
  for (const row of measurements) {
    if (!Number.isFinite(row.staticBaoEvaluation)) throw new Error("Nonfinite static evaluation");
    if (!Number.isFinite(row.exactD2RootBestScore)) throw new Error("Nonfinite D2 score");
    if (!["namua", "mtaji"].includes(row.phase)) throw new Error("Invalid selected phase");
    if (row.administrativeTruncation && row.actorWin !== null) {
      throw new Error("Administrative truncation must not receive a binary outcome");
    }
    if (!row.administrativeTruncation && ![0, 1].includes(row.actorWin)) {
      throw new Error("Terminal selected state must receive actor-relative binary outcome");
    }
  }

  const source = C.provenance(loaded.spec);
  const result = {
    schemaVersion: 1,
    smokeId: "PEC-S0-SMOKE-2026-08-18-v1",
    stageId: loaded.spec.stageId,
    specSha256: loaded.specSha256,
    passed: true,
    scientificGeneration: false,
    scientificInferenceAuthorized: false,
    smokeSeeds: [smokeSpec.population.seedStart, smokeSpec.population.seedEnd],
    deterministicReplay: true,
    staticPerspectiveAntisymmetry: true,
    games: first.length,
    uniqueHistoricalTrajectories: C.representativeGames(first).length,
    selectedStates: measurements.length,
    selectedNamua: measurements.filter((row) => row.phase === "namua").length,
    selectedMtaji: measurements.filter((row) => row.phase === "mtaji").length,
    source,
    authorizationFilePresent: fs.existsSync(C.AUTH_PATH),
    generationAuthorizedBySpecAlone: loaded.spec.authorization.generationAuthorizedBySpecAlone,
  };
  const outputIndex = process.argv.indexOf("--output");
  if (outputIndex >= 0) {
    const file = path.resolve(process.argv[outputIndex + 1]);
    C.writeJson(file, result);
  }
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) main();
