"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const { extractPhaseTransitionFeatures } = require("./lib/phase-transition-features.js");

const OUTPUT_DIR = path.resolve("artifacts/phase-transition/fixture");
const OBSERVATIONS = path.join(OUTPUT_DIR, "observations.jsonl");
const GAMES = path.join(OUTPUT_DIR, "games.json");
const MANIFEST = path.join(OUTPUT_DIR, "manifest.json");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableMove(moves) {
  return [...moves].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))[0];
}

function runGame(gameId, maxPly) {
  let state = E.initialState();
  let previousStateHash = null;
  const observations = [];
  const moves = [];

  for (let ply = 0; ply <= maxPly; ply += 1) {
    const observation = extractPhaseTransitionFeatures(state, {
      gameId,
      conditionId: "fixture-first-legal",
      seed: 0,
      ply,
      previousStateHash,
    });
    observations.push(observation);
    previousStateHash = observation.stateHash;

    if (state.winner !== null || ply === maxPly) break;
    const legal = E.moveVariants(state);
    if (!legal.length) break;
    const move = stableMove(legal);
    moves.push(move);
    state = E.applyMove(state, move).state;
  }

  return {
    observations,
    game: {
      gameId,
      conditionId: "fixture-first-legal",
      seed: 0,
      requestedMaxPly: maxPly,
      observedMaxPly: observations.at(-1).ply,
      winner: state.winner,
      reason: state.reason || "",
      finalStateHash: observations.at(-1).stateHash,
      moves,
    },
  };
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const runs = [runGame("pt-fixture-001", 12), runGame("pt-fixture-002", 24)];
  const observations = runs.flatMap((run) => run.observations);
  const games = runs.map((run) => run.game);
  const jsonl = `${observations.map((row) => JSON.stringify(row)).join("\n")}\n`;
  const gamesJson = `${JSON.stringify(games, null, 2)}\n`;

  fs.writeFileSync(OBSERVATIONS, jsonl);
  fs.writeFileSync(GAMES, gamesJson);
  const manifest = {
    study: "phase-transition",
    studyVersion: "0.1.0",
    schemaVersion: "1.0.0",
    generator: "tools/experiments/generate-phase-transition-fixture.js",
    conditionId: "fixture-first-legal",
    gameCount: games.length,
    observationCount: observations.length,
    files: {
      "observations.jsonl": sha256(jsonl),
      "games.json": sha256(gamesJson),
    },
  };
  fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Generated ${observations.length} observations for ${games.length} games in ${OUTPUT_DIR}`);
}

if (require.main === module) main();
module.exports = { runGame, stableMove };
