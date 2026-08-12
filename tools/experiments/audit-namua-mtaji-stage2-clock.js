#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

function parseArgs(argv) {
  const options = { input: "artifacts/local/namua-mtaji-transition/stage2-formal-v1", output: null };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  options.output ||= path.join(options.input, "clock-audit.json");
  return options;
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = path.resolve(options.input);
  const manifest = JSON.parse(fs.readFileSync(path.join(input, "manifest.json"), "utf8"));
  if (manifest.formalExperiment !== true || manifest.config.stage !== "stage2-formal-confirmation") {
    throw new Error("Stage 2 formal boundary mismatch");
  }
  const gamePaths = fs.readdirSync(path.join(input, "games"))
    .filter((name) => /^game-\d+\.json$/.test(name)).sort()
    .map((name) => path.join(input, "games", name));
  const games = gamePaths.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  const violations = [];
  const firstMtajiPlyCounts = new Map();
  for (const game of games) {
    const first = game.temporalOutcome.firstMtajiPly;
    const key = first === null ? "<null>" : String(first);
    firstMtajiPlyCounts.set(key, (firstMtajiPlyCounts.get(key) || 0) + 1);
    if (game.temporalOutcome.reachedMtaji && Number(first) !== 44) {
      violations.push({ gameId: game.gameId, kind: "first-mtaji-ply", expected: 44, actual: first });
    }
    for (const observation of game.observations) {
      const ply = Number(observation.ply);
      if (observation.phase !== "namua") continue;
      const total = observation.state.reserve.map(Number).reduce((a, b) => a + b, 0);
      const expected = 44 - ply;
      if (total !== expected) {
        violations.push({ gameId: game.gameId, kind: "namua-total-reserve", ply, expected, actual: total });
      }
    }
  }
  const report = {
    schemaVersion: 1,
    status: "stage2-formal-deterministic-namua-clock-audit-complete",
    passed: violations.length === 0,
    formalExperiment: true,
    scientificInferenceAuthorized: true,
    inputConfigHash: manifest.configHash,
    expectedInvariant: {
      initialTotalReserve: 44,
      firstMtajiPlyForSurvivingStandardTrajectory: 44,
      namuaTotalReserveAtPly: "44 - ply",
      candidateToMtajiInterpretation: "deterministic clock distance, not survival time",
    },
    games: games.length,
    reachedMtajiGames: games.filter((game) => game.temporalOutcome.reachedMtaji).length,
    terminalBeforeMtajiGames: games.filter((game) => game.temporalOutcome.terminalBeforeMtaji).length,
    firstMtajiPlyCounts: Object.fromEntries([...firstMtajiPlyCounts.entries()].sort()),
    violations,
    interpretationBoundary: {
      survivalTimingPrimaryEndpointAuthorized: false,
      transitionAccelerationClaimAuthorized: false,
      transitionDelayClaimAuthorized: false,
      progressionMatchedMorphologyPrimaryEndpointAuthorized: true,
    },
  };
  atomicWriteJson(path.resolve(options.output), report);
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
}

if (require.main === module) main();
