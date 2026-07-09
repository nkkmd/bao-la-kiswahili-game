"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const WeightConfig = require("../public/ai-weights.js");
const {
  parseArgs, candidatesFromInput, summarizeReports, runValidation,
} = require("../tools/phase7-validate.js");

function tempFile(name, value) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bao-phase7-validate-"));
  const file = path.join(dir, name);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  return file;
}

{
  const options = parseArgs([
    "--input", "grid.json", "--candidate", "a.json", "--candidates", "b.json,c.json",
    "--games", "4", "--seed", "9", "--repeats", "2", "--seed-step", "5",
    "--opening-plies", "2,4", "--opening-phases", "namua,mtaji",
    "--time-limit", "100", "--max-depth", "3", "--max-turns", "60",
    "--min-score", "0.6", "--max-tactical-failures", "1",
    "--output", "out.json", "--json",
  ]);
  assert.equal(options.input, "grid.json");
  assert.deepEqual(options.candidates, ["a.json", "b.json", "c.json"]);
  assert.equal(options.games, 4);
  assert.equal(options.seed, 9);
  assert.equal(options.repeats, 2);
  assert.equal(options.seedStep, 5);
  assert.deepEqual(options.openingPlies, [2, 4]);
  assert.deepEqual(options.openingPhases, ["namua", "mtaji"]);
  assert.equal(options.timeLimitMs, 100);
  assert.equal(options.maxDepth, 3);
  assert.equal(options.maxTurns, 60);
  assert.equal(options.minScore, 0.6);
  assert.equal(options.maxTacticalFailures, 1);
  assert.equal(options.output, "out.json");
  assert.equal(options.json, true);
}

{
  const file = tempFile("grid.json", {
    promoted: [{
      name: "base",
      adjustments: WeightConfig.DEFAULT_V2_ADJUSTMENTS,
    }],
  });
  const candidates = candidatesFromInput(file);
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].name, "base");
  assert.deepEqual(candidates[0].adjustments, WeightConfig.DEFAULT_V2_ADJUSTMENTS);
}

{
  const file = tempFile("candidate.json", WeightConfig.DEFAULT_V2_ADJUSTMENTS);
  const candidates = candidatesFromInput(file);
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].name, "candidate");
}

{
  const summary = summarizeReports([
    { report: { competitors: [{ wins: 2, losses: 0, draws: 0, moves: 4, averageMoveMs: 5, maxMoveMs: 8, totalNodes: 40, timeouts: 1 }] } },
    { report: { competitors: [{ wins: 0, losses: 1, draws: 1, moves: 6, averageMoveMs: 15, maxMoveMs: 20, totalNodes: 90, timeouts: 2 }] } },
  ]);
  assert.equal(summary.games, 4);
  assert.equal(summary.score, 0.625);
  assert.equal(summary.averageMoveMs, 11);
  assert.equal(summary.maxMoveMs, 20);
  assert.equal(summary.averageNodes, 13);
  assert.equal(summary.timeouts, 3);
}

{
  const file = tempFile("grid.json", {
    promoted: [{
      name: "base",
      adjustments: WeightConfig.DEFAULT_V2_ADJUSTMENTS,
    }],
  });
  const report = runValidation(parseArgs([
    "--input", file, "--games", "2", "--seed", "20260741",
    "--repeats", "1", "--opening-plies", "0", "--opening-phases", "namua",
    "--time-limit", "0", "--max-depth", "1", "--max-turns", "20",
  ]));
  assert.equal(report.candidates.length, 1);
  assert.equal(report.candidates[0].tacticalFailures.length, 0);
  assert.equal(report.candidates[0].tacticalPassed, report.candidates[0].tacticalTotal);
}

assert.throws(() => parseArgs([]), /Provide --input or --candidate/);
assert.throws(() => parseArgs(["--input", "x", "--games", "3"]), /even/);
assert.throws(() => parseArgs(["--input", "x", "--opening-phases", "bad"]), /Invalid opening phases/);
assert.throws(() => parseArgs(["--input", "x", "--min-score", "2"]), /Invalid minimum score/);

console.log("Bao Phase 7 validation tests passed");
