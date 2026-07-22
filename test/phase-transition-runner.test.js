"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  createOpeningPlan,
  experimentConfig,
  openingAttemptSeed,
  parseArgs,
  runGame,
  runResearch,
  sha256,
} = require("../tools/experiments/run-phase-transition-research.js");
const {
  verifyArtifacts,
} = require("../tools/experiments/verify-phase-transition-artifacts.js");

const root = fs.mkdtempSync(path.join(os.tmpdir(), "bao-phase-transition-"));
const output = path.join(root, "diversity-smoke");

try {
  const defaultSmoke = parseArgs([]);
  assert.equal(defaultSmoke.profile, "diversity-smoke");
  assert.equal(defaultSmoke.games, 10);
  assert.equal(defaultSmoke.output, "artifacts/phase-transition/diversity-smoke");

  const pilot = parseArgs(["--profile", "pilot"]);
  assert.equal(pilot.profile, "pilot");
  assert.equal(pilot.games, 100);
  assert.equal(pilot.output, "artifacts/phase-transition/pilot");
  const pilotConfig = experimentConfig(pilot);
  assert.equal(pilotConfig.profile, "pilot");
  assert.equal(pilotConfig.games, 100);
  assert.equal(pilotConfig.opening.validation, undefined);
  assert.match(runGame({ ...pilotConfig, maxPly: 1 }, 0).gameId, /^pt-pilot-0000$/);

  const pilotV2 = parseArgs(["--profile", "pilot-v2"]);
  assert.equal(pilotV2.profile, "pilot-v2");
  assert.equal(pilotV2.games, 100);
  assert.equal(pilotV2.output, "artifacts/phase-transition/pilot-v2");
  assert.equal(pilotV2.openingMaxAttempts, 100);
  const pilotV2Config = experimentConfig(pilotV2);
  assert.equal(pilotV2Config.studyVersion, "0.4.1");
  assert.equal(pilotV2Config.opening.validation.policy, "non-terminal-front-occupied");
  assert.equal(pilotV2Config.opening.validation.maxAttempts, 100);
  assert.match(runGame({ ...pilotV2Config, maxPly: 1 }, 0).gameId, /^pt-pilot-v2-0000$/);

  assert.equal(openingAttemptSeed(20260767, 1), 20260767,
    "attempt 1 must preserve the pilot-v1 game seed");
  assert.notEqual(openingAttemptSeed(20260767, 2), 20260767,
    "attempt 2 must use a deterministic alternate seed");

  const terminalOpeningSeed = 20260786;
  const terminalOpeningPlan = createOpeningPlan(
    pilotV2Config,
    terminalOpeningSeed - pilotV2Config.baseSeed,
    terminalOpeningSeed,
  );
  assert.equal(terminalOpeningPlan.moves.length, 6);
  assert.ok(terminalOpeningPlan.attempt >= 2 && terminalOpeningPlan.attempt <= 100,
    "the opening that is terminal at the six-ply boundary must be retried");
  assert.equal(terminalOpeningPlan.rejectedCount, terminalOpeningPlan.attempt - 1);
  assert.ok((terminalOpeningPlan.rejectionReasons["terminal:front-empty"] || 0) >= 1);

  const comparableGameIndex = 1;
  const pilotGame = runGame(pilotConfig, comparableGameIndex);
  const pilotV2Game = runGame(pilotV2Config, comparableGameIndex);
  assert.equal(pilotV2Game.openingAttempt, 1);
  assert.equal(pilotV2Game.openingSeed, pilotV2Game.seed);
  assert.equal(pilotV2Game.trajectoryHash, pilotGame.trajectoryHash,
    "valid attempt-1 openings must remain comparable with pilot-v1");

  const overriddenPilot = parseArgs([
    "--profile", "pilot-v2",
    "--games", "3",
    "--opening-max-attempts", "12",
    "--output", path.join(root, "pilot-test"),
  ]);
  assert.equal(overriddenPilot.games, 3);
  assert.equal(overriddenPilot.openingMaxAttempts, 12);
  assert.equal(overriddenPilot.output, path.join(root, "pilot-test"));
  assert.throws(() => parseArgs(["--profile", "unknown"]), /Invalid profile/);

  const options = parseArgs([
    "--games", "4",
    "--seed", "20260721",
    "--max-ply", "10",
    "--opening-plies", "4",
    "--baseline-games", "1",
    "--level", "easy",
    "--max-depth", "1",
    "--output", output,
  ]);

  const first = runResearch(options);
  assert.equal(first.completed, 4);
  const firstObservations = fs.readFileSync(path.join(output, "observations.jsonl"));
  const firstGames = fs.readFileSync(path.join(output, "games.json"));
  const firstManifest = JSON.parse(fs.readFileSync(path.join(output, "manifest.json"), "utf8"));
  const games = JSON.parse(firstGames);

  assert.equal(firstManifest.profile, "diversity-smoke");
  assert.equal(firstManifest.completedGames, 4);
  assert.equal(firstManifest.observationCount, 44);
  assert.deepEqual(verifyArtifacts(output), { observations: 44, games: 4 });
  assert.equal(games[0].baseline, true);
  assert.equal(games[0].openingPliesApplied, 0);
  assert.equal(games.slice(1).every((game) => game.baseline === false), true);
  assert.equal(games.slice(1).every((game) => game.openingPliesApplied === 4), true);
  assert.equal(games.slice(1).every((game) => game.trajectoryHash.length === 64), true);
  assert.ok(firstManifest.diversity.uniqueTrajectoryCount >= 2,
    "seeded openings should produce more than one trajectory");
  assert.ok(firstManifest.diversity.uniqueFinalStateCount >= 2,
    "seeded openings should produce more than one final state");
  assert.equal(firstManifest.openingQuality.rejectedOpenings, 0,
    "legacy diversity smoke must preserve its single-attempt opening policy");

  const second = runResearch(options);
  assert.equal(second.completed, 4);
  assert.equal(
    sha256(fs.readFileSync(path.join(output, "observations.jsonl"))),
    sha256(firstObservations),
    "resume must preserve deterministic observations",
  );
  assert.equal(
    sha256(fs.readFileSync(path.join(output, "games.json"))),
    sha256(firstGames),
    "resume must preserve deterministic game summaries",
  );

  const status = runResearch({ ...options, status: true });
  assert.equal(status.completed, 4);
  assert.equal(status.total, 4);

  assert.throws(
    () => runResearch({ ...options, openingPlies: 5 }),
    /different config hash/,
    "resume must reject a changed opening configuration",
  );

  console.log("phase-transition runner tests passed");
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
