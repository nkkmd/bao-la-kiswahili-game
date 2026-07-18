#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { E, atomicWriteJson, hashValue, moveKey, stableStringify } = require("./lib/joseki-common.js");
const { loadInputs, validateBlock } = require("./run-joseki-continuations.js");

const ROOT = path.resolve(__dirname, "../..");

function parseArgs(argv) {
  const options = {
    tree: "artifacts/joseki-study/corpus/candidate-tree-8ply.json",
    summary: "artifacts/joseki-study/summaries/phase-4-summary.json",
    phase2: "artifacts/joseki-study/phase-4",
    corpus: "artifacts/joseki-study/corpus/continuation-principal-leaves.json",
    input: "artifacts/joseki-study/robustness/continuations",
    output: "artifacts/joseki-study/verified/continuations-verification.json",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--tree") options.tree = value;
    else if (key === "--summary") options.summary = value;
    else if (key === "--phase2") options.phase2 = value;
    else if (key === "--corpus") options.corpus = value;
    else if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function currentFileHash(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, file))).digest("hex");
}

function replay(entry, result) {
  let state = E.clone(entry.state);
  for (const key of result.continuationMoveKeys) {
    const move = E.moveVariants(state).find((candidate) => moveKey(candidate) === key);
    if (!move) throw new Error(`Illegal replay move: ${entry.openingId}/${result.conditionId}/${key}`);
    state = E.applyMove(state, move).state;
  }
  if (hashValue(state) !== result.finalStateHash || stableStringify(state) !== stableStringify(result.finalState)
    || state.winner !== result.winner || entry.moveKeys.length + result.continuationMoveKeys.length !== result.totalPlies) {
    throw new Error(`Replay mismatch: ${entry.openingId}/${result.conditionId}`);
  }
  return true;
}

function verify(options) {
  const { tree, corpus } = loadInputs(options);
  const progressFile = path.join(options.input, "progress.json");
  if (!fs.existsSync(progressFile)) throw new Error(`Missing progress file: ${progressFile}`);
  const progress = JSON.parse(fs.readFileSync(progressFile, "utf8"));
  if (progress.status !== "complete") throw new Error(`Continuation experiment is not complete: ${progress.status}`);
  if (progress.identity.treeHash !== tree.treeHash || progress.identity.corpusHash !== corpus.corpusHash) {
    throw new Error("Continuation experiment identity mismatch");
  }
  const partialDir = path.join(options.input, "partials");
  if (fs.existsSync(partialDir) && fs.readdirSync(partialDir).some((file) => file.endsWith(".json"))) {
    throw new Error("Partial continuation results remain");
  }
  for (const [file, expected] of Object.entries(progress.identity.sourceFileSha256)) {
    if (currentFileHash(file) !== expected) throw new Error(`Research source hash changed: ${file}`);
  }
  let games = 0;
  let replayedMoves = 0;
  let timeouts = 0;
  const conditionCounts = Object.fromEntries(progress.identity.conditionIds.map((id) => [id, 0]));
  for (const entry of corpus.entries) {
    const file = path.join(options.input, "blocks", `${entry.openingId}.json`);
    if (!fs.existsSync(file)) throw new Error(`Missing continuation block: ${entry.openingId}`);
    const block = JSON.parse(fs.readFileSync(file, "utf8"));
    validateBlock(block, entry, progress.identity);
    for (const result of block.results) {
      replay(entry, result);
      games += 1;
      replayedMoves += result.continuationPlies;
      timeouts += result.stats.timeouts;
      conditionCounts[result.conditionId] += 1;
    }
  }
  const expectedGames = corpus.entries.length * progress.identity.conditionIds.length;
  if (games !== expectedGames || Object.values(conditionCounts).some((count) => count !== corpus.entries.length)) {
    throw new Error("Continuation game count mismatch");
  }
  return {
    tree,
    corpus,
    progress,
    verification: {
      schemaVersion: 1,
      verifiedAt: new Date().toISOString(),
      passed: true,
      treeHash: tree.treeHash,
      corpusHash: corpus.corpusHash,
      openings: corpus.entries.length,
      games,
      replayedMoves,
      timeouts,
      conditionCounts,
      partialResults: 0,
      sourceHashesMatch: true,
      replayHashesMatch: true,
      verificationHash: hashValue({ treeHash: tree.treeHash, corpusHash: corpus.corpusHash,
        games, replayedMoves, conditionCounts }),
    },
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const verification = verify(options).verification;
  atomicWriteJson(options.output, verification);
  console.log(JSON.stringify({ output: options.output, ...verification }, null, 2));
}
if (require.main === module) main();

module.exports = { parseArgs, replay, verify };
