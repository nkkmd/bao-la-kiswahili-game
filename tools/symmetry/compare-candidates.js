#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { auditStates } = require("../first-player-symmetry-audit.js");
const { reachableStates } = require("./generate-states.js");
const { verify } = require("./verify-transition-symmetry.js");

function compare(states) {
  return ["A", "B", "C", "D"].map((candidate) => {
    const audit = auditStates(states, candidate);
    const transitions = verify(states, candidate);
    return {
      candidate,
      transform: audit.transform,
      ...audit.summary,
      transitionSymmetryPasses: transitions.passes,
      transitions: transitions.transitions,
    };
  });
}

function main() {
  const args = process.argv.slice(2);
  const valueAfter = (name, fallback) => {
    const index = args.indexOf(name);
    return index < 0 ? fallback : args[index + 1];
  };
  const count = Number(valueAfter("--count", 200));
  const seed = Number(valueAfter("--seed", 20260714));
  const output = valueAfter("--output", null);
  const result = { count, seed, candidates: compare(reachableStates(count, seed)) };
  if (output) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) main();
module.exports = { compare };
