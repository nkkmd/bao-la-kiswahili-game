#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  CONDITIONS,
  atomicWriteJson,
  parseJsonLines,
  provenance,
  seedFrom,
  seededRandom,
  sha256Text,
  stableStringify,
  validateCorpus,
} = require("./paired-first-player-common.js");

const PRIMARY_COMPARISONS = Object.freeze(["D3", "EL", "EV2", "SM"]);

function parseArgs(argv) {
  const options = {
    input: "artifacts/paired-first-player/2026-07/confirmatory",
    output: "artifacts/paired-first-player/2026-07/summary.json",
    bootstrapSamples: 10_000,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else if (key === "--bootstrap-samples") options.bootstrapSamples = Number(value);
    else throw new Error(`Unknown argument: ${key}`);
  }
  if (!Number.isInteger(options.bootstrapSamples) || options.bootstrapSamples < 100) {
    throw new Error("bootstrap-samples must be an integer of at least 100");
  }
  return options;
}

function wilson(successes, total) {
  if (!total) return [0, 0];
  const z = 1.959963984540054;
  const p = successes / total;
  const denominator = 1 + z * z / total;
  const center = (p + z * z / (2 * total)) / denominator;
  const margin = z * Math.sqrt((p * (1 - p) + z * z / (4 * total)) / total) / denominator;
  return [center - margin, center + margin];
}

function quantile(sorted, probability) {
  if (!sorted.length) return null;
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position);
  const fraction = position - lower;
  return sorted[lower + 1] === undefined
    ? sorted[lower]
    : sorted[lower] + fraction * (sorted[lower + 1] - sorted[lower]);
}

function binomialCoefficient(n, k) {
  const count = Math.min(k, n - k);
  let result = 1;
  for (let index = 1; index <= count; index += 1) result = result * (n - count + index) / index;
  return result;
}

function exactMcNemar(n01, n10) {
  const discordant = n01 + n10;
  if (!discordant) return 1;
  const tail = Math.min(n01, n10);
  let cumulative = 0;
  for (let value = 0; value <= tail; value += 1) {
    cumulative += binomialCoefficient(discordant, value) * (0.5 ** discordant);
  }
  return Math.min(1, 2 * cumulative);
}

function pairedBootstrap(differences, samples, seed) {
  const random = seededRandom(seed);
  const means = [];
  for (let iteration = 0; iteration < samples; iteration += 1) {
    let total = 0;
    for (let draw = 0; draw < differences.length; draw += 1) {
      total += differences[Math.floor(random() * differences.length)];
    }
    means.push(total / differences.length);
  }
  means.sort((a, b) => a - b);
  return [quantile(means, 0.025), quantile(means, 0.975)];
}

function holmAdjust(comparisons) {
  const sorted = comparisons.map((comparison, index) => ({ comparison, index }))
    .sort((a, b) => a.comparison.mcnemarP - b.comparison.mcnemarP);
  let previous = 0;
  for (let rank = 0; rank < sorted.length; rank += 1) {
    const adjusted = Math.min(1, (sorted.length - rank) * sorted[rank].comparison.mcnemarP);
    previous = Math.max(previous, adjusted);
    sorted[rank].comparison.holmAdjustedP = previous;
  }
  return comparisons;
}

function outcomeLabel(result) {
  return result.winner === 0 ? "south" : result.winner === 1 ? "north" : "draw";
}

function aggregateCondition(conditionId, results) {
  const selected = results.map((block) => block.results.find((result) => result.conditionId === conditionId));
  const southWins = selected.filter(({ winner }) => winner === 0).length;
  const northWins = selected.filter(({ winner }) => winner === 1).length;
  const draws = selected.length - southWins - northWins;
  const turns = selected.map(({ totalPlies }) => totalPlies).sort((a, b) => a - b);
  return {
    conditionId,
    games: selected.length,
    southWins,
    northWins,
    draws,
    southWinRateDecisive: southWins + northWins ? southWins / (southWins + northWins) : null,
    southWinRateWilson95: wilson(southWins, southWins + northWins),
    averagePlies: turns.reduce((sum, value) => sum + value, 0) / turns.length,
    medianPlies: quantile(turns, 0.5),
  };
}

function compareToBaseline(conditionId, blocks, bootstrapSamples, corpusHash) {
  const pairs = blocks.map((block) => ({
    openingId: block.openingId,
    baseline: block.results.find(({ conditionId: id }) => id === "C0"),
    comparison: block.results.find(({ conditionId: id }) => id === conditionId),
  }));
  const differences = pairs.map(({ baseline, comparison }) => comparison.score - baseline.score);
  const meanPairedDifference = differences.reduce((sum, value) => sum + value, 0) / differences.length;
  let towardSouth = 0;
  let towardNorth = 0;
  let n01 = 0;
  let n10 = 0;
  const outcomeTable = { south: { south: 0, north: 0, draw: 0 }, north: { south: 0, north: 0, draw: 0 }, draw: { south: 0, north: 0, draw: 0 } };
  for (const { baseline, comparison } of pairs) {
    outcomeTable[outcomeLabel(baseline)][outcomeLabel(comparison)] += 1;
    if (comparison.score > baseline.score) towardSouth += 1;
    if (comparison.score < baseline.score) towardNorth += 1;
    if (baseline.winner === 1 && comparison.winner === 0) n01 += 1;
    if (baseline.winner === 0 && comparison.winner === 1) n10 += 1;
  }
  return {
    baseline: "C0",
    comparison: conditionId,
    openings: pairs.length,
    meanPairedDifference,
    pairedBootstrap95: pairedBootstrap(differences, bootstrapSamples,
      seedFrom(corpusHash, "C0", conditionId, "paired-bootstrap")),
    differentOutcome: pairs.filter(({ baseline, comparison }) => baseline.winner !== comparison.winner).length,
    towardSouth,
    towardNorth,
    outcomeTable,
    decisiveDiscordant: { baselineNorthComparisonSouth: n01, baselineSouthComparisonNorth: n10, total: n01 + n10 },
    mcnemarP: exactMcNemar(n01, n10),
  };
}

function verifyAndLoad(input) {
  const progressFile = path.join(input, "progress.json");
  if (!fs.existsSync(progressFile)) throw new Error(`Missing progress file: ${progressFile}`);
  const progress = JSON.parse(fs.readFileSync(progressFile, "utf8"));
  if (progress.status !== "complete") throw new Error(`Experiment is not complete: ${progress.status}`);
  const partialDir = path.join(input, "partials");
  if (fs.existsSync(partialDir) && fs.readdirSync(partialDir).some((file) => file.endsWith(".json"))) {
    throw new Error("Partial results remain; refusing to aggregate");
  }
  const corpusText = fs.readFileSync(progress.identity.corpusFile, "utf8");
  const corpus = parseJsonLines(corpusText, progress.identity.corpusFile);
  const manifest = JSON.parse(fs.readFileSync(progress.identity.corpusManifestFile, "utf8"));
  validateCorpus(corpus, manifest, corpusText);
  if (sha256Text(corpusText) !== progress.identity.corpusFileSha256) throw new Error("Runner corpus hash mismatch");
  const openings = corpus.slice(0, progress.expected.openings);
  const currentSource = provenance();
  if (stableStringify(currentSource.sourceFileSha256) !== stableStringify(progress.identity.sourceFileSha256)) {
    throw new Error("Source files changed after the experiment");
  }
  const blocks = openings.map((opening) => {
    const file = path.join(input, "blocks", `${opening.openingId}.json`);
    if (!fs.existsSync(file)) throw new Error(`Missing block: ${opening.openingId}`);
    const block = JSON.parse(fs.readFileSync(file, "utf8"));
    if (block.status !== "complete" || block.openingId !== opening.openingId) throw new Error(`Invalid block: ${opening.openingId}`);
    if (block.openingStateHash !== opening.openingStateHash) throw new Error(`Opening state mismatch: ${opening.openingId}`);
    if (stableStringify(block.identity) !== stableStringify(progress.identity)) throw new Error(`Identity mismatch: ${opening.openingId}`);
    const ids = block.results.map(({ conditionId }) => conditionId);
    if (ids.length !== CONDITIONS.length || new Set(ids).size !== CONDITIONS.length
      || CONDITIONS.some(({ id }) => !ids.includes(id))) throw new Error(`Incomplete block: ${opening.openingId}`);
    for (const result of block.results) {
      if (result.openingId !== opening.openingId || result.openingStateHash !== opening.openingStateHash) {
        throw new Error(`Result opening mismatch: ${opening.openingId}/${result.conditionId}`);
      }
      if (result.conditionConfigHash !== progress.identity.conditionHashes[result.conditionId]) {
        throw new Error(`Condition configuration mismatch: ${opening.openingId}/${result.conditionId}`);
      }
    }
    const totals = {
      southWins: block.results.filter(({ winner }) => winner === 0).length,
      northWins: block.results.filter(({ winner }) => winner === 1).length,
      draws: block.results.filter(({ winner }) => winner === null).length,
    };
    if (stableStringify(totals) !== stableStringify(block.totals)) throw new Error(`Block totals mismatch: ${opening.openingId}`);
    return block;
  });
  return { progress, corpus, manifest, openings, blocks };
}

function aggregate(options) {
  const verified = verifyAndLoad(options.input);
  const conditions = CONDITIONS.map(({ id }) => aggregateCondition(id, verified.blocks));
  const allComparisons = CONDITIONS.filter(({ id }) => id !== "C0").map(({ id }) => compareToBaseline(
    id, verified.blocks, options.bootstrapSamples, verified.progress.identity.corpusFileSha256,
  ));
  const primaryComparisons = holmAdjust(PRIMARY_COMPARISONS.map((id) => allComparisons.find(({ comparison }) => comparison === id)));
  const summary = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    profile: verified.progress.profile,
    status: "complete",
    methodology: {
      experimentalUnit: "openingId",
      openings: verified.openings.length,
      conditions: CONDITIONS.map(({ id }) => id),
      games: verified.openings.length * CONDITIONS.length,
      score: { southWin: 1, draw: 0.5, northWin: 0 },
      bootstrapSamples: options.bootstrapSamples,
      primaryComparisons: PRIMARY_COMPARISONS.map((id) => `C0 vs ${id}`),
      multiplicityAdjustment: "Holm",
    },
    integrity: {
      corpusId: verified.manifest.corpusId,
      corpusFileSha256: verified.progress.identity.corpusFileSha256,
      entriesHash: verified.manifest.entriesHash,
      completeBlocks: verified.blocks.length,
      results: verified.blocks.reduce((sum, block) => sum + block.results.length, 0),
      missingBlocks: 0,
      duplicateResults: 0,
      partialResults: 0,
      openingStateHashesMatch: true,
      conditionHashesMatch: true,
      sourceHashesMatch: true,
    },
    provenance: {
      sourceCommit: verified.progress.identity.sourceCommit,
      sourceTreeDirty: verified.progress.identity.sourceTreeDirty,
      node: verified.progress.identity.node,
      sourceFileSha256: verified.progress.identity.sourceFileSha256,
    },
    conditions,
    primaryComparisons,
    secondaryComparisons: allComparisons.filter(({ comparison }) => !PRIMARY_COMPARISONS.includes(comparison)),
  };
  atomicWriteJson(options.output, summary);
  return summary;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const summary = aggregate(options);
  console.log(JSON.stringify({
    output: options.output,
    profile: summary.profile,
    integrity: summary.integrity,
    conditions: summary.conditions,
    primaryComparisons: summary.primaryComparisons,
  }, null, 2));
}

if (require.main === module) main();

module.exports = {
  PRIMARY_COMPARISONS,
  aggregate,
  aggregateCondition,
  compareToBaseline,
  exactMcNemar,
  holmAdjust,
  pairedBootstrap,
  parseArgs,
  verifyAndLoad,
  wilson,
};
