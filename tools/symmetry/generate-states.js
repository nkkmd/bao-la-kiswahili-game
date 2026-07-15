#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const { seededRandom } = require("../benchmark.js");

function reachableStates(count, seed) {
  const random = seededRandom(seed);
  const states = [];
  let state = E.initialState();
  while (states.length < count) {
    if (state.winner !== null || E.moveVariants(state).length === 0) state = E.initialState();
    states.push(E.clone(state));
    const moves = E.moveVariants(state);
    state = E.applyMove(state, moves[Math.floor(random() * moves.length)]).state;
  }
  return states;
}

function parseArgs(argv) {
  const result = { count: 200, seed: 20260714, output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index + 1];
    if (argv[index] === "--count") result.count = Number(value);
    if (argv[index] === "--seed") result.seed = Number(value);
    if (argv[index] === "--output") result.output = value;
  }
  if (!Number.isInteger(result.count) || result.count < 1) throw new Error("Invalid --count");
  if (!Number.isInteger(result.seed)) throw new Error("Invalid --seed");
  return result;
}

function writeJsonl(output, states) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${states.map((state) => JSON.stringify(state)).join("\n")}\n`);
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const states = reachableStates(options.count, options.seed);
  if (options.output) writeJsonl(options.output, states);
  process.stdout.write(`${JSON.stringify({ count: states.length, seed: options.seed, output: options.output }, null, 2)}\n`);
}

if (require.main === module) main();
module.exports = { parseArgs, reachableStates, writeJsonl };
