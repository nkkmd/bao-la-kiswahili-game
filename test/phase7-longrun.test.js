"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const WeightConfig = require("../public/ai-weights.js");
const {
  parseArgs, validationArgv, aggregateChunks, runLongrun,
} = require("../tools/phase7-longrun.js");

function tempFile(name, value) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bao-phase7-longrun-"));
  const file = path.join(dir, name);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  return file;
}

{
  const options = parseArgs([
    "--candidate", "base.json", "--games", "10", "--chunks", "3", "--run-chunks", "1",
    "--seed", "100", "--seed-step", "10", "--opening-plies", "4,8",
    "--opening-phases", "namua,mtaji", "--time-limit", "50", "--max-depth", "2",
    "--max-turns", "40", "--min-score", "0.5", "--min-games", "30",
    "--min-wilson", "0.5", "--output", "longrun.json",
    "--decision-output", "decision.json", "--json",
  ]);
  assert.deepEqual(options.candidates, ["base.json"]);
  assert.equal(options.games, 10);
  assert.equal(options.chunks, 3);
  assert.equal(options.runChunks, 1);
  assert.equal(options.seedStep, 10);
  assert.equal(options.output, "longrun.json");
  assert.equal(options.decisionOutput, "decision.json");
  assert.equal(options.json, true);
}

assert.throws(() => parseArgs([]), /Provide --input or --candidate/);
assert.throws(() => parseArgs(["--candidate", "x", "--games", "3"]), /even/);
assert.throws(() => parseArgs(["--candidate", "x", "--chunks", "1", "--run-chunks", "2"]),
  /Run chunks/);

{
  const options = parseArgs([
    "--candidate", "base.json", "--games", "10", "--chunks", "3",
    "--seed", "100", "--seed-step", "10",
  ]);
  const argv = validationArgv(options, 2);
  assert.ok(argv.includes("--candidate"));
  assert.ok(argv.includes("base.json"));
  assert.equal(argv[argv.indexOf("--seed") + 1], "120");
  assert.equal(argv[argv.indexOf("--repeats") + 1], "1");
}

{
  const report = aggregateChunks({ minScore: 0.5, chunks: 2 }, [
    {
      chunk: 1,
      report: { candidates: [{
        name: "base", wins: 3, losses: 1, draws: 0, score: 0.75,
        tacticalPassed: 7, tacticalTotal: 7, tacticalFailures: [],
        details: [], averageMoveMs: 10, maxMoveMs: 20, averageNodes: 30, timeouts: 2,
      }] },
    },
    {
      chunk: 2,
      report: { candidates: [{
        name: "base", wins: 1, losses: 3, draws: 0, score: 0.25,
        tacticalPassed: 7, tacticalTotal: 7, tacticalFailures: [],
        details: [], averageMoveMs: 20, maxMoveMs: 30, averageNodes: 40, timeouts: 3,
      }] },
    },
  ]);
  assert.equal(report.candidates.length, 1);
  assert.equal(report.candidates[0].games, 8);
  assert.equal(report.candidates[0].score, 0.5);
  assert.equal(report.candidates[0].timeouts, 5);
}

{
  const candidate = tempFile("base.json", WeightConfig.DEFAULT_V2_ADJUSTMENTS);
  const output = path.join(path.dirname(candidate), "longrun.json");
  const decision = path.join(path.dirname(candidate), "decision.json");
  const report = runLongrun(parseArgs([
    "--candidate", candidate, "--games", "2", "--chunks", "1", "--run-chunks", "1",
    "--seed", "20260950", "--opening-plies", "0", "--opening-phases", "namua",
    "--time-limit", "0", "--max-depth", "1", "--max-turns", "20",
    "--min-games", "2", "--output", output, "--decision-output", decision,
  ]));
  assert.equal(report.chunks.length, 1);
  assert.equal(report.candidates.length, 1);
  assert.ok(fs.existsSync(output));
  assert.ok(fs.existsSync(decision));
}

console.log("Bao Phase 7 longrun tests passed");
