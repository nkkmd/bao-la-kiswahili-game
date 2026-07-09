"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const WeightConfig = require("../public/ai-weights.js");
const { seededRandom } = require("../tools/benchmark.js");
const {
  parseArgs,
  loadBaselines,
  createCandidates,
  scoreCandidate,
  selectSurvivors,
  finalCommands,
} = require("../tools/phase9-tune.js");

function tempFile(name, data) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bao-phase9-"));
  const file = path.join(dir, name);
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  return file;
}

{
  const options = parseArgs([
    "--candidates", "4",
    "--round-games", "2,4",
    "--round-repeats", "1,2",
    "--baselines", "default",
    "--validation-games", "4",
    "--final-games", "8",
  ]);
  assert.equal(options.candidates, 4);
  assert.deepEqual(options.roundGames, [2, 4]);
  assert.deepEqual(options.roundRepeats, [1, 2]);
  assert.deepEqual(options.baselines, ["default"]);
}

assert.throws(() => parseArgs(["--round-games", "3"]), /even/);
assert.throws(() => parseArgs(["--round-repeats", "1,2,3,4"]), /one value or match/);
assert.throws(() => parseArgs(["--keep", "1"]), /Invalid keep ratio/);
assert.throws(() => parseArgs(["--opening-phases", "unknown"]), /Invalid phases/);

{
  const baselineFile = tempFile("baseline.json", WeightConfig.DEFAULT_WEIGHTS);
  const baselines = loadBaselines(["default", baselineFile]);
  assert.deepEqual(baselines.map((item) => item.name), ["default", "baseline"]);
  assert.equal(baselines[0].source, "default");
  assert.deepEqual(baselines[1].weights, WeightConfig.DEFAULT_WEIGHTS);
}

{
  const candidates = createCandidates(
    WeightConfig.DEFAULT_WEIGHTS, 6, seededRandom(9), 2, ["mtaji"],
  );
  assert.equal(candidates.length, 6);
  assert.equal(new Set(candidates.map(JSON.stringify)).size, 6);
  assert.ok(candidates.every((weights) => (
    JSON.stringify(weights.namua) === JSON.stringify(WeightConfig.DEFAULT_WEIGHTS.namua)
  )), "phase-scoped Phase 9 candidates leave other phases unchanged");
}

{
  const survivors = selectSurvivors([
    { name: "bad-tactical", score: 0.7, rawScore: 0.8, tacticalFailures: [{}] },
    { name: "clean", score: 0.65, rawScore: 0.65, tacticalFailures: [] },
    { name: "weak", score: 0.4, rawScore: 0.4, tacticalFailures: [] },
  ], 0.5);
  assert.deepEqual(survivors.map((item) => item.name), ["bad-tactical", "clean"]);
}

{
  const options = parseArgs([
    "--candidates", "2",
    "--round-games", "2",
    "--round-repeats", "1",
    "--baselines", "default",
    "--opening-phases", "namua",
    "--opening-plies", "0",
    "--validation-games", "2",
    "--final-games", "2",
    "--max-depth", "1",
  ]);
  const result = scoreCandidate(
    { name: "default", weights: WeightConfig.DEFAULT_WEIGHTS },
    loadBaselines(options.baselines),
    options,
    0,
    2,
  );
  assert.equal(result.games, 2);
  assert.equal(result.tacticalPassed, result.tacticalTotal);
  assert.equal(result.categories.length, 1);
  assert.equal(result.details[0].baseline, "default");
}

{
  const commands = finalCommands(
    "candidate.json",
    loadBaselines(["default"]),
    parseArgs([
      "--baselines", "default",
      "--opening-phases", "namua,mtaji",
      "--opening-plies", "4,8",
      "--validation-games", "4",
      "--final-games", "10",
    ]),
  );
  assert.equal(commands.length, 2);
  assert.ok(commands[0].includes("--first-weights candidate.json"));
  assert.ok(commands[0].includes("--games 5"));
}

console.log("Bao Phase 9 tuner tests passed");
