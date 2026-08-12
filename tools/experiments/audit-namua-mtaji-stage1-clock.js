#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const EXPECTED_INITIAL_TOTAL_RESERVE = 44;
const EXPECTED_FIRST_MTAJI_PLY = 44;

function parseArgs(argv) {
  const options = {
    input: "artifacts/local/namua-mtaji-transition/stage1-pilot-v1",
    output: null,
  };
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

function gameFiles(input) {
  const directory = path.join(input, "games");
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((name) => /^game-\d+\.json$/.test(name))
    .sort()
    .map((name) => path.join(directory, name));
}

function totalReserve(observation) {
  return observation.state.reserve.map(Number).reduce((sum, value) => sum + value, 0);
}

function auditGame(game) {
  const violations = [];
  for (const observation of game.observations) {
    const ply = Number(observation.ply);
    const total = totalReserve(observation);
    if (observation.phase === "namua") {
      const expected = EXPECTED_INITIAL_TOTAL_RESERVE - ply;
      if (total !== expected) {
        violations.push({
          kind: "namua-total-reserve-clock",
          ply,
          expectedTotalReserve: expected,
          actualTotalReserve: total,
        });
      }
      if (ply >= EXPECTED_FIRST_MTAJI_PLY && observation.terminal !== true) {
        violations.push({ kind: "nonterminal-namua-at-or-after-fixed-boundary", ply });
      }
    }
  }

  const firstMtaji = game.observations.find((row) => row.phase === "mtaji") || null;
  if (firstMtaji && Number(firstMtaji.ply) !== EXPECTED_FIRST_MTAJI_PLY) {
    violations.push({
      kind: "first-mtaji-ply",
      expectedPly: EXPECTED_FIRST_MTAJI_PLY,
      actualPly: Number(firstMtaji.ply),
    });
  }
  if (firstMtaji && totalReserve(firstMtaji) !== 0) {
    violations.push({ kind: "first-mtaji-nonzero-reserve", actualTotalReserve: totalReserve(firstMtaji) });
  }

  return {
    gameId: game.gameId,
    conditionId: game.conditionId,
    reachedMtaji: Boolean(firstMtaji),
    firstMtajiPly: firstMtaji ? Number(firstMtaji.ply) : null,
    terminalBeforeMtaji: Boolean(game.temporalOutcome?.terminalBeforeMtaji),
    violations,
  };
}

function countBy(values) {
  const counts = new Map();
  for (const value of values) {
    const key = value === null ? "<null>" : String(value);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = path.resolve(options.input);
  const manifestPath = path.join(input, "manifest.json");
  if (!fs.existsSync(manifestPath)) throw new Error(`Missing manifest: ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.formalExperiment !== false
    || manifest.scientificInferenceAuthorized !== false
    || manifest.exploratoryAnalysisAuthorized !== true
    || manifest.confirmatoryReuseAllowed !== false) {
    throw new Error("Stage 1 exploratory boundary mismatch");
  }

  const files = gameFiles(input);
  if (files.length !== manifest.completedGames) {
    throw new Error(`Game file count mismatch: ${files.length} != ${manifest.completedGames}`);
  }
  const games = files.map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  const results = games.map(auditGame);
  const violations = results.flatMap((row) => row.violations.map((violation) => ({ gameId: row.gameId, ...violation })));
  const reached = results.filter(({ reachedMtaji }) => reachedMtaji);

  const report = {
    schemaVersion: 1,
    status: "stage1-deterministic-namua-clock-audit-complete",
    passed: violations.length === 0,
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    exploratoryAnalysisAuthorized: true,
    confirmatoryReuseAllowed: false,
    expectedInvariant: {
      initialTotalReserve: EXPECTED_INITIAL_TOTAL_RESERVE,
      firstMtajiPlyForSurvivingStandardTrajectory: EXPECTED_FIRST_MTAJI_PLY,
      namuaTotalReserveAtPly: "44 - ply",
      rawCandidateToMtajiInterpretation: "deterministic clock distance, not survival time",
    },
    games: games.length,
    reachedMtajiGames: reached.length,
    terminalBeforeMtajiGames: results.filter(({ terminalBeforeMtaji }) => terminalBeforeMtaji).length,
    firstMtajiPlyCounts: countBy(results.map(({ firstMtajiPly }) => firstMtajiPly)),
    violations,
    interpretationBoundary: {
      survivalTimingPrimaryEndpointAuthorized: false,
      transitionAccelerationClaimAuthorized: false,
      transitionDelayClaimAuthorized: false,
      progressionMatchedMorphologyCandidateEndpointRemainsOpen: true,
      postAscertainmentStructuralTrajectoryCandidateEndpointRemainsOpen: true,
    },
  };
  atomicWriteJson(path.resolve(options.output), report);
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
}

if (require.main === module) main();
module.exports = { EXPECTED_FIRST_MTAJI_PLY, EXPECTED_INITIAL_TOTAL_RESERVE, auditGame };
