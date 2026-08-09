#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { mirrorMove, mirrorState } = require("../symmetry/transform-candidates.js");
const {
  identityKeys,
  ruleState,
  stableStringify,
} = require("./lib/position-typology-features.js");
const { gameFiles } = require("./verify-position-typology-smoke.js");

function parseArgs(argv) {
  const options = {
    input: "artifacts/local/position-typology/stage0-smoke-v1",
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
  options.output ||= path.join(options.input, "identity-audit.json");
  return options;
}

function atomicWriteJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(temporary, filePath);
}

function stateFromObservation(observation) {
  return {
    pits: observation.state.pits.map((rows) => rows.map((row) => row.slice())),
    reserve: [...observation.state.reserve],
    houseOwned: [...observation.state.houseOwned],
    player: observation.player,
    phase: observation.phase,
    winner: observation.winner,
    reason: observation.reason,
    turn: observation.turn,
    pending: [...observation.state.pending],
  };
}

function moveKeys(moves) {
  return moves.map((move) => AI.moveKey(move)).sort();
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const input = path.resolve(options.input);
  const games = gameFiles(input).map((file) => JSON.parse(fs.readFileSync(file, "utf8")));
  if (!games.length) throw new Error(`No smoke games found in ${input}`);

  const seen = new Set();
  const failures = [];
  const phaseCounts = { namua: 0, mtaji: 0 };
  let statesChecked = 0;
  let legalMovesChecked = 0;
  let transitionsChecked = 0;

  for (const game of games) {
    for (const observation of game.observations) {
      if (seen.has(observation.identity.ruleStateKey)) continue;
      seen.add(observation.identity.ruleStateKey);
      const state = stateFromObservation(observation);
      const mirrored = mirrorState(state);
      statesChecked += 1;
      phaseCounts[state.phase] = (phaseCounts[state.phase] || 0) + 1;

      if (stableStringify(mirrorState(mirrored)) !== stableStringify(state)) {
        failures.push({ gameId: game.gameId, ply: observation.ply, kind: "involution" });
        continue;
      }
      if (identityKeys(state).seatCanonicalKey !== identityKeys(mirrored).seatCanonicalKey) {
        failures.push({ gameId: game.gameId, ply: observation.ply, kind: "canonical-key" });
        continue;
      }

      const originalMoves = E.moveVariants(state);
      const actualMirroredMoves = E.moveVariants(mirrored);
      const expectedMirroredMoves = originalMoves.map((move) => mirrorMove(move));
      legalMovesChecked += originalMoves.length;
      if (stableStringify(moveKeys(actualMirroredMoves)) !== stableStringify(moveKeys(expectedMirroredMoves))) {
        failures.push({ gameId: game.gameId, ply: observation.ply, kind: "legal-moves" });
        continue;
      }

      for (const move of originalMoves) {
        const left = mirrorState(E.applyMove(state, move).state);
        const right = E.applyMove(mirrored, mirrorMove(move)).state;
        transitionsChecked += 1;
        if (stableStringify(ruleState(left)) !== stableStringify(ruleState(right))) {
          failures.push({
            gameId: game.gameId,
            ply: observation.ply,
            kind: "transition",
            moveKey: AI.moveKey(move),
          });
          break;
        }
      }
    }
  }

  const report = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    passed: failures.length === 0,
    input,
    uniqueRuleStatesChecked: statesChecked,
    phaseCounts,
    legalMovesChecked,
    transitionsChecked,
    failures,
    identityDefinition: {
      direct: "ruleStateKey",
      canonical: "minimum hash under validated South/North seat exchange",
      excludedTransform: "no column/direction reversal",
    },
  };
  atomicWriteJson(path.resolve(options.output), report);
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
}

if (require.main === module) main();
module.exports = { parseArgs, stateFromObservation };
