#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const Diagnostics = require("../public/diagnostics.js");

function integerArg(value, name, minimum) {
  const result = Number(value);
  if (!Number.isInteger(result) || result < minimum) throw new Error(`Invalid ${name}: ${value}`);
  return result;
}

function parseArgs(argv) {
  const options = { input: null, index: null, output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const value = argv[index + 1];
    if (arg === "--input") options.input = value;
    else if (arg === "--index") options.index = integerArg(value, arg, 0);
    else if (arg === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${arg}`);
    index += 1;
  }
  if (!options.input) throw new Error("--input is required");
  return options;
}

function loadSnapshots(path, selectedIndex = null) {
  const parsed = JSON.parse(fs.readFileSync(path, "utf8"));
  const snapshots = Array.isArray(parsed) ? parsed : [parsed];
  if (selectedIndex !== null) {
    if (!snapshots[selectedIndex]) throw new Error(`Snapshot index out of range: ${selectedIndex}`);
    return [snapshots[selectedIndex]];
  }
  return snapshots;
}

function indentJson(value, spaces) {
  const indent = " ".repeat(spaces);
  return JSON.stringify(value, null, 2).split("\n").map((line, index) => {
    return index === 0 ? line : `${indent}${line}`;
  }).join("\n");
}

function fixtureTemplate(snapshot, index = 0) {
  const position = Diagnostics.stateFromSnapshot(snapshot);
  const observedMove = snapshot.ai?.move ? JSON.stringify(snapshot.ai.move) : "null";
  const observedDepth = snapshot.ai?.stats?.completedDepth;
  const depth = Number.isInteger(observedDepth) && observedDepth > 0 ? observedDepth : 4;
  return [
    "{",
    '  category: "human-review",',
    `  name: "TODO: explain reviewed diagnostic ${index + 1}",`,
    `  depth: ${depth},`,
    `  position: state(${indentJson(position, 2)}),`,
    `  // Observed AI move: ${observedMove}`,
    "  // TODO: confirm the expected or forbidden move with a Bao reviewer.",
    "  // TODO: explain whether deeper search solves it or evaluation knowledge is required.",
    "  assert(analysis, position) {",
    "    void analysis;",
    "    void position;",
    '    assert.fail("TODO: define the reviewed tactical expectation");',
    "  },",
    "}",
  ].join("\n");
}

function convertSnapshots(snapshots) {
  if (!snapshots.length) throw new Error("No diagnostic snapshots found");
  return snapshots.map((snapshot, index) => fixtureTemplate(snapshot, index)).join(",\n\n");
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const output = `${convertSnapshots(loadSnapshots(options.input, options.index))}\n`;
    if (options.output) fs.writeFileSync(options.output, output);
    else process.stdout.write(output);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { parseArgs, loadSnapshots, fixtureTemplate, convertSnapshots };
