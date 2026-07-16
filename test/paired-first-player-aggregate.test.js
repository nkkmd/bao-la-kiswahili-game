"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { buildCorpus, parseArgs: parseCorpusArgs, writeCorpus } = require("../tools/experiments/generate-opening-corpus.js");
const { parseArgs: parseRunnerArgs, run } = require("../tools/experiments/run-paired-first-player-research.js");
const {
  aggregate,
  exactMcNemar,
  holmAdjust,
} = require("../tools/experiments/aggregate-paired-first-player-research.js");

assert.equal(exactMcNemar(0, 0), 1);
assert.equal(exactMcNemar(0, 5), 0.0625);
const adjusted = holmAdjust([{ mcnemarP: 0.01 }, { mcnemarP: 0.04 }, { mcnemarP: 0.03 }, { mcnemarP: 0.5 }]);
assert.deepEqual(adjusted.map(({ holmAdjustedP }) => holmAdjustedP), [0.04, 0.09, 0.09, 0.5]);

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-paired-aggregate-"));
const corpusOptions = parseCorpusArgs([
  "--count", "12", "--plies", "8", "--policy", "uniform", "--unique",
  "--stratify", "first-move", "--seed", "20260716", "--corpus-id", "fixture-12",
  "--output", path.join(temp, "corpus", "fixture.jsonl"),
]);
writeCorpus(corpusOptions, buildCorpus(corpusOptions));
const input = path.join(temp, "fixture-results");
run(parseRunnerArgs([
  "--profile", "fixture", "--corpus", corpusOptions.output, "--output", input,
  "--max-turns", "10", "--mcts-iterations", "2", "--mcts-playout-turns", "2",
]));
const output = path.join(temp, "summary.json");
const summary = aggregate({ input, output, bootstrapSamples: 200 });
assert.equal(summary.status, "complete");
assert.equal(summary.integrity.completeBlocks, 12);
assert.equal(summary.integrity.results, 84);
assert.equal(summary.conditions.length, 7);
assert.equal(summary.primaryComparisons.length, 4);
assert.equal(summary.secondaryComparisons.length, 2);
assert.ok(summary.primaryComparisons.every(({ pairedBootstrap95, holmAdjustedP }) => (
  pairedBootstrap95.length === 2 && holmAdjustedP >= 0 && holmAdjustedP <= 1
)));
assert.ok(fs.existsSync(output));

fs.mkdirSync(path.join(input, "partials"), { recursive: true });
fs.writeFileSync(path.join(input, "partials", "orphan.partial.json"), "{}\n");
assert.throws(() => aggregate({ input, output, bootstrapSamples: 200 }), /Partial results remain/);

const weightedCorpusOptions = parseCorpusArgs([
  "--count", "12", "--plies", "1", "--policy", "uniform", "--seed", "20260716",
  "--corpus-id", "weighted-fixture", "--output", path.join(temp, "weighted-corpus", "corpus.jsonl"),
]);
writeCorpus(weightedCorpusOptions, buildCorpus(weightedCorpusOptions));
const weightedInput = path.join(temp, "weighted-results");
run(parseRunnerArgs([
  "--profile", "sensitivity", "--count", "12", "--conditions", "C0,D3,EL,EV2",
  "--corpus", weightedCorpusOptions.output, "--output", weightedInput,
  "--max-turns", "10", "--mcts-iterations", "2", "--mcts-playout-turns", "2",
]));
const weightedSummary = aggregate({
  input: weightedInput, output: path.join(temp, "weighted-summary.json"), bootstrapSamples: 200,
});
assert.equal(weightedSummary.methodology.experimentalUnit, "openingId slot, clustered by openingMovesHash");
assert.equal(weightedSummary.methodology.conditions.length, 4);
assert.ok(weightedSummary.integrity.duplicateOpeningSlots > 0);
assert.ok(weightedSummary.primaryComparisons.every(({ mcnemarP, pairedBootstrapMethod }) => (
  mcnemarP === null && pairedBootstrapMethod === "openingMovesHash cluster bootstrap"
)));

console.log("Paired first-player aggregate tests passed");
