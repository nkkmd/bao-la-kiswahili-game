#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  atomicWriteJson,
  generateOpening,
  hashValue,
  provenance,
  sha256Text,
  validateCorpus,
} = require("./paired-first-player-common.js");

function parseArgs(argv) {
  const options = {
    count: 200,
    plies: 8,
    policy: "uniform",
    unique: false,
    stratify: null,
    seed: 20260716,
    corpusId: "uniform-8ply-unique-v1",
    output: "artifacts/paired-first-player/2026-07/corpus/uniform-8ply-unique-v1.jsonl",
  };
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (key === "--unique") options.unique = true;
    else {
      const value = argv[index + 1];
      if (key === "--count") options.count = Number(value);
      else if (key === "--plies") options.plies = Number(value);
      else if (key === "--policy") options.policy = value;
      else if (key === "--stratify") options.stratify = value;
      else if (key === "--seed") options.seed = Number(value);
      else if (key === "--corpus-id") options.corpusId = value;
      else if (key === "--output") options.output = value;
      else throw new Error(`Unknown argument: ${key}`);
      index += 1;
    }
  }
  if (!Number.isInteger(options.count) || options.count < 1) throw new Error("count must be a positive integer");
  if (!Number.isInteger(options.plies) || options.plies < 1) throw new Error("plies must be a positive integer");
  if (!Number.isSafeInteger(options.seed)) throw new Error("seed must be a safe integer");
  if (!["uniform", "top3", "softmax"].includes(options.policy)) throw new Error("unsupported policy");
  if (options.stratify && options.stratify !== "first-move") throw new Error("only first-move stratification is supported");
  if (!options.unique) throw new Error("the confirmatory corpus requires --unique");
  if (options.stratify === "first-move" && options.count % 4 !== 0) {
    throw new Error("first-move stratified count must be divisible by four");
  }
  return options;
}

function buildCorpus(options) {
  const accepted = [];
  const rejected = [];
  const seen = new Set();
  const firstMoves = new Map();
  const targetPerFirstMove = options.stratify === "first-move" ? options.count / 4 : Infinity;
  const maximumAttempts = Math.max(10_000, options.count * 1_000);
  for (let attempt = 1; accepted.length < options.count && attempt <= maximumAttempts; attempt += 1) {
    const seed = options.seed * 100_000 + attempt;
    const candidate = generateOpening(seed, options.plies, options.policy);
    let reason = null;
    if (candidate.terminal) reason = "terminal-before-handoff";
    else if (candidate.playedPlies !== options.plies) reason = "short-opening";
    else if (seen.has(candidate.openingMovesHash)) reason = "duplicate-opening";
    else if (options.stratify === "first-move"
      && (firstMoves.get(candidate.firstMove) || 0) >= targetPerFirstMove) reason = "first-move-stratum-full";
    if (reason) {
      rejected.push({ seed, reason, playedPlies: candidate.playedPlies, firstMove: candidate.firstMove,
        openingMovesHash: candidate.openingMovesHash });
      continue;
    }
    seen.add(candidate.openingMovesHash);
    firstMoves.set(candidate.firstMove, (firstMoves.get(candidate.firstMove) || 0) + 1);
    accepted.push({
      corpusId: options.corpusId,
      openingId: `op-${String(accepted.length + 1).padStart(4, "0")}`,
      ...candidate,
    });
  }
  if (accepted.length !== options.count) {
    throw new Error(`Could not construct corpus: accepted ${accepted.length}/${options.count}`);
  }
  if (options.stratify === "first-move" && firstMoves.size !== 4) {
    throw new Error(`Expected four first-move strata, found ${firstMoves.size}`);
  }
  validateCorpus(accepted);
  return { accepted, rejected, firstMoves: Object.fromEntries([...firstMoves].sort()) };
}

function outputPaths(output) {
  return {
    manifest: path.join(path.dirname(output), "manifest.json"),
    rejected: path.join(path.dirname(output), "rejected.jsonl"),
  };
}

function writeCorpus(options, built) {
  fs.mkdirSync(path.dirname(options.output), { recursive: true });
  const corpusText = `${built.accepted.map((entry) => JSON.stringify(entry)).join("\n")}\n`;
  const rejectedText = built.rejected.length
    ? `${built.rejected.map((entry) => JSON.stringify(entry)).join("\n")}\n`
    : "";
  const temporary = `${options.output}.tmp-${process.pid}`;
  fs.writeFileSync(temporary, corpusText);
  fs.renameSync(temporary, options.output);
  const paths = outputPaths(options.output);
  fs.writeFileSync(paths.rejected, rejectedText);
  const manifest = {
    schemaVersion: 1,
    corpusId: options.corpusId,
    generatedAt: new Date().toISOString(),
    generator: {
      seed: options.seed,
      count: options.count,
      plies: options.plies,
      policy: options.policy,
      unique: options.unique,
      stratify: options.stratify,
      adoptionRule: "deterministic generation order; no outcome-based selection",
    },
    openings: built.accepted.length,
    rejected: built.rejected.length,
    rejectionReasons: Object.fromEntries(Object.entries(built.rejected.reduce((counts, entry) => {
      counts[entry.reason] = (counts[entry.reason] || 0) + 1;
      return counts;
    }, {})).sort()),
    firstMoveStrata: built.firstMoves,
    corpusFile: path.basename(options.output),
    corpusFileSha256: sha256Text(corpusText),
    entriesHash: hashValue(built.accepted),
    provenance: provenance(),
  };
  atomicWriteJson(paths.manifest, manifest);
  validateCorpus(built.accepted, manifest, corpusText);
  return { manifest, paths };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const built = buildCorpus(options);
  const { manifest, paths } = writeCorpus(options, built);
  console.log(JSON.stringify({
    output: options.output,
    manifest: paths.manifest,
    rejected: paths.rejected,
    openings: manifest.openings,
    rejectedCandidates: manifest.rejected,
    firstMoveStrata: manifest.firstMoveStrata,
    corpusFileSha256: manifest.corpusFileSha256,
  }, null, 2));
}

if (require.main === module) main();

module.exports = { buildCorpus, outputPaths, parseArgs, writeCorpus };
