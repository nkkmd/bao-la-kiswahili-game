"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const WeightConfig = require("../public/ai-weights.js");
const {
  parseArgs,
  runPlan,
  aggregateChunks,
  runLongrun,
} = require("../tools/phase9-longrun.js");

function tempFile(name, value) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bao-phase9-longrun-"));
  const file = path.join(dir, name);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  return file;
}

function phase9Report(extra = {}) {
  return {
    config: {
      openingPlies: [0],
      openingPhases: ["namua"],
      maxDepth: 1,
    },
    baselines: [{ name: "default", source: "default" }],
    finalists: [{
      name: "candidate-01",
      weights: WeightConfig.DEFAULT_WEIGHTS,
      tacticalPassed: 7,
      tacticalTotal: 7,
      tacticalFailures: [],
      validation: { games: 2, wins: 1, losses: 1, draws: 0, score: 0.5 },
    }],
    ...extra,
  };
}

function benchmarkReport({ wins, losses, draws = 0, seed = 1 }) {
  return {
    config: { seed, openingPhase: "namua", openingPlies: 0 },
    competitors: [{
      wins,
      losses,
      draws,
      moves: 10,
      averageMoveMs: 2,
      maxMoveMs: 5,
      totalNodes: 100,
      timeouts: 1,
    }],
  };
}

{
  const options = parseArgs([
    "--input", "phase9.json",
    "--candidate", "candidate-01",
    "--games", "20",
    "--chunks", "2",
    "--run-chunks", "1",
    "--seed", "100",
    "--seed-step", "10",
    "--opening-plies", "0,4",
    "--opening-phases", "namua,mtaji",
    "--baselines", "default",
    "--time-limit", "0",
    "--max-depth", "1",
    "--max-turns", "20",
    "--min-score", "0.5",
    "--min-games", "20",
    "--min-wilson", "0.5",
    "--output", "longrun.json",
    "--decision-output", "decision.json",
    "--json",
  ]);
  assert.equal(options.input, "phase9.json");
  assert.equal(options.candidate, "candidate-01");
  assert.equal(options.games, 20);
  assert.equal(options.chunks, 2);
  assert.equal(options.runChunks, 1);
  assert.deepEqual(options.openingPhases, ["namua", "mtaji"]);
  assert.deepEqual(options.baselines, ["default"]);
  assert.equal(options.output, "longrun.json");
  assert.equal(options.decisionOutput, "decision.json");
  assert.equal(options.json, true);
}

assert.throws(() => parseArgs([]), /Provide --input/);
assert.throws(() => parseArgs(["--input", "x"]), /Provide --candidate/);
assert.throws(() => parseArgs(["--input", "x", "--candidate", "c", "--run-chunks", "2", "--chunks", "1"]),
  /Run chunks/);

{
  const file = tempFile("phase9.json", phase9Report());
  const options = parseArgs([
    "--input", file,
    "--candidate", "candidate-01",
    "--games", "4",
    "--chunks", "2",
    "--baselines", "default",
    "--opening-phases", "namua",
    "--opening-plies", "0",
  ]);
  const plan = runPlan(phase9Report(), options);
  assert.equal(plan.buckets.length, 1);
  assert.equal(plan.gamesPerBucketChunk, 2);
}

{
  const aggregate = aggregateChunks({ games: 4, chunks: 2 }, {
    name: "candidate-01",
    tacticalPassed: 7,
    tacticalTotal: 7,
    tacticalFailures: [],
  }, [
    { chunk: 1, reports: [{ baseline: "default", openingPhase: "namua", openingPlies: 0, report: benchmarkReport({ wins: 2, losses: 0 }) }] },
    { chunk: 2, reports: [{ baseline: "default", openingPhase: "namua", openingPlies: 0, report: benchmarkReport({ wins: 0, losses: 2 }) }] },
  ]);
  assert.equal(aggregate.candidates.length, 1);
  assert.equal(aggregate.candidates[0].games, 4);
  assert.equal(aggregate.candidates[0].score, 0.5);
  assert.equal(aggregate.candidates[0].timeouts, 2);
  assert.equal(aggregate.candidates[0].finalDetails.length, 2);
}

{
  const input = tempFile("phase9.json", phase9Report());
  const output = path.join(path.dirname(input), "longrun.json");
  const decision = path.join(path.dirname(input), "decision.json");
  const report = runLongrun(parseArgs([
    "--input", input,
    "--candidate", "candidate-01",
    "--games", "2",
    "--chunks", "1",
    "--run-chunks", "1",
    "--seed", "20261200",
    "--opening-plies", "0",
    "--opening-phases", "namua",
    "--baselines", "default",
    "--time-limit", "0",
    "--max-depth", "1",
    "--max-turns", "20",
    "--min-games", "2",
    "--output", output,
    "--decision-output", decision,
  ]));
  assert.equal(report.chunks.length, 1);
  assert.equal(report.candidates.length, 1);
  assert.equal(report.candidates[0].games, 2);
  assert.ok(fs.existsSync(output));
  assert.ok(fs.existsSync(decision));
}

console.log("Bao Phase 9 longrun tests passed");
