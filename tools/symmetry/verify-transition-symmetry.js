#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const { reachableStates } = require("./generate-states.js");
const { CANDIDATES, moveFor, stateFor } = require("./transform-candidates.js");

function verify(states, candidate = "D") {
  let transitions = 0;
  const mismatches = [];
  states.forEach((state, stateIndex) => {
    const mirrored = stateFor(candidate, state);
    E.moveVariants(state).forEach((move, moveIndex) => {
      transitions += 1;
      let expected;
      let actual;
      let error = null;
      try {
        expected = stateFor(candidate, E.applyMove(state, move).state);
        actual = E.applyMove(mirrored, moveFor(candidate, move)).state;
      } catch (caught) {
        error = caught.message;
      }
      if (error || JSON.stringify(expected) !== JSON.stringify(actual)) {
        mismatches.push({ stateIndex, moveIndex, move, expected, actual, error });
      }
    });
  });
  return { candidate, states: states.length, transitions, passes: transitions - mismatches.length, mismatches };
}

function main() {
  const args = process.argv.slice(2);
  const valueAfter = (name, fallback) => {
    const index = args.indexOf(name);
    return index < 0 ? fallback : args[index + 1];
  };
  const candidate = String(valueAfter("--candidate", "D")).toUpperCase();
  if (!CANDIDATES[candidate]) throw new Error("Invalid --candidate");
  const count = Number(valueAfter("--count", 1000));
  const seed = Number(valueAfter("--seed", 20260714));
  const output = valueAfter("--output", null);
  const result = verify(reachableStates(count, seed), candidate);
  if (output) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  }
  process.stdout.write(`${JSON.stringify({ ...result, mismatches: result.mismatches.length }, (key, value) => key === "mismatches" && Array.isArray(value) ? value.length : value, 2)}\n`);
}

if (require.main === module) main();
module.exports = { verify };
