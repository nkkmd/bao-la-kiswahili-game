"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { buildCorpus, parseArgs: parseCorpusArgs, writeCorpus } = require("../tools/experiments/generate-opening-corpus.js");
const {
  parseArgs,
  resultPaths,
  run,
  shuffleConditions,
} = require("../tools/experiments/run-paired-first-player-research.js");

const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-paired-runner-"));
const corpusOptions = parseCorpusArgs([
  "--count", "12", "--plies", "8", "--policy", "uniform", "--unique",
  "--stratify", "first-move", "--seed", "20260716", "--corpus-id", "fixture-12",
  "--output", path.join(temp, "corpus", "fixture.jsonl"),
]);
const built = buildCorpus(corpusOptions);
writeCorpus(corpusOptions, built);
const output = path.join(temp, "fixture-results");
const options = parseArgs([
  "--profile", "fixture", "--corpus", corpusOptions.output, "--output", output,
  "--max-turns", "10", "--mcts-iterations", "2", "--mcts-playout-turns", "2",
]);
run(options);

const progress = JSON.parse(fs.readFileSync(path.join(output, "progress.json"), "utf8"));
assert.equal(progress.status, "complete");
assert.equal(progress.completedBlocks, 12);
assert.equal(progress.completedGames, 84);
assert.equal(progress.partialGames, 0);
for (const opening of built.accepted) {
  const files = resultPaths(output, opening.openingId);
  assert.ok(fs.existsSync(files.block));
  assert.ok(!fs.existsSync(files.partial));
  const block = JSON.parse(fs.readFileSync(files.block, "utf8"));
  assert.equal(block.results.length, 7);
  assert.equal(new Set(block.results.map(({ conditionId }) => conditionId)).size, 7);
  assert.ok(block.results.every(({ openingStateHash }) => openingStateHash === opening.openingStateHash));
}
assert.deepEqual(
  shuffleConditions("op-0001", progress.identity.corpusFileSha256).map(({ id }) => id),
  shuffleConditions("op-0001", progress.identity.corpusFileSha256).map(({ id }) => id),
);

run(options);
const resumed = JSON.parse(fs.readFileSync(path.join(output, "progress.json"), "utf8"));
assert.equal(resumed.completedGames, 84);

const subsetOutput = path.join(temp, "subset-results");
run(parseArgs([
  "--profile", "sensitivity", "--count", "4", "--conditions", "C0,D3,EL,EV2",
  "--corpus", corpusOptions.output, "--output", subsetOutput,
  "--max-turns", "10", "--mcts-iterations", "2", "--mcts-playout-turns", "2",
]));
const subsetProgress = JSON.parse(fs.readFileSync(path.join(subsetOutput, "progress.json"), "utf8"));
assert.deepEqual(subsetProgress.expected, {
  openings: 4, conditions: 4, conditionIds: ["C0", "D3", "EL", "EV2"], games: 16,
});
assert.equal(subsetProgress.completedGames, 16);
assert.throws(() => parseArgs(["--conditions", "D3,EL"]), /include C0/);

console.log("Paired first-player runner tests passed");
