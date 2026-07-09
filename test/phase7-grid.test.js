"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const WeightConfig = require("../public/ai-weights.js");
const {
  parseArgs, variantAdjustments, summarizeReports, runGrid, writePromoted,
} = require("../tools/phase7-grid.js");

{
  const options = parseArgs([
    "--games", "4", "--seed", "99", "--repeats", "2", "--seed-step", "7",
    "--opening-plies", "4,6", "--opening-phases", "namua,mtaji", "--time-limit", "100",
    "--max-depth", "3", "--max-turns", "60", "--variants", "base,attack-light",
    "--min-score", "0.55", "--max-tactical-failures", "1", "--promote-top", "2",
    "--promote-dir", "artifacts/phase7-promoted",
    "--output", "artifacts/phase7-grid-test.json", "--json",
  ]);
  assert.equal(options.games, 4);
  assert.equal(options.seed, 99);
  assert.equal(options.repeats, 2);
  assert.equal(options.seedStep, 7);
  assert.deepEqual(options.openingPlies, [4, 6]);
  assert.deepEqual(options.openingPhases, ["namua", "mtaji"]);
  assert.equal(options.timeLimitMs, 100);
  assert.equal(options.maxDepth, 3);
  assert.equal(options.maxTurns, 60);
  assert.deepEqual(options.variants, ["base", "attack-light"]);
  assert.equal(options.minScore, 0.55);
  assert.equal(options.maxTacticalFailures, 1);
  assert.equal(options.promoteTop, 2);
  assert.equal(options.promoteDir, "artifacts/phase7-promoted");
  assert.equal(options.output, "artifacts/phase7-grid-test.json");
  assert.equal(options.json, true);
}

{
  const base = variantAdjustments("base");
  assert.deepEqual(base, WeightConfig.DEFAULT_V2_ADJUSTMENTS,
    "the base variant matches default bao-v2 adjustments");
  const light = variantAdjustments("endurance-light");
  assert.ok(light["mtaji-endurance"].frontSafety
    < WeightConfig.DEFAULT_V2_ADJUSTMENTS["mtaji-endurance"].frontSafety,
  "the endurance-light variant weakens front safety adjustment");
  const namuaSafe = variantAdjustments("endurance-namua-safe");
  assert.deepEqual(namuaSafe["namua-opening"], {},
    "the namua-safe variant keeps namua opening on base bao weights");
  assert.deepEqual(namuaSafe["mtaji-endurance"], light["mtaji-endurance"],
    "the namua-safe variant keeps the light endurance adjustment");
  assert.throws(() => variantAdjustments("unknown"), /Invalid Phase 7 variant/);
}

{
  const summary = summarizeReports([
    {
      competitors: [{
        wins: 1, losses: 1, draws: 0, moves: 4,
        averageMoveMs: 10, maxMoveMs: 20, totalNodes: 40, timeouts: 2,
      }],
    },
    {
      competitors: [{
        wins: 0, losses: 1, draws: 1, moves: 6,
        averageMoveMs: 20, maxMoveMs: 30, totalNodes: 90, timeouts: 3,
      }],
    },
  ]);
  assert.equal(summary.games, 4);
  assert.equal(summary.score, 0.375);
  assert.equal(summary.averageMoveMs, 16);
  assert.equal(summary.maxMoveMs, 30);
  assert.equal(summary.averageNodes, 13);
  assert.equal(summary.timeouts, 5);
}

assert.throws(() => parseArgs(["--games", "3"]), /even/);
assert.throws(() => parseArgs(["--opening-phases", "unknown"]), /Invalid opening phases/);
assert.throws(() => parseArgs(["--variants", "unknown"]), /Invalid Phase 7 variant/);
assert.throws(() => parseArgs(["--min-score", "2"]), /Invalid minimum score/);

{
  const report = runGrid(parseArgs([
    "--games", "2", "--seed", "20260733", "--opening-plies", "0",
    "--opening-phases", "namua,mtaji", "--time-limit", "0", "--max-depth", "1", "--max-turns", "20",
    "--variants", "base",
  ]));
  assert.equal(report.variants.length, 1);
  assert.equal(report.variants[0].eligible, true);
  assert.equal(report.variants[0].tacticalFailures.length, 0);
  assert.equal(report.variants[0].tacticalPassed, report.variants[0].tacticalTotal);
  assert.equal(report.variants[0].details.length, 2);
  assert.deepEqual(report.variants[0].details.map((item) => item.openingPhase), ["namua", "mtaji"]);
  assert.equal(report.promoted.length, 1);
}

{
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-phase7-promoted-"));
  const files = writePromoted({
    promoted: [{
      name: "base",
      adjustments: WeightConfig.DEFAULT_V2_ADJUSTMENTS,
    }],
  }, temp);
  assert.equal(files.length, 1);
  assert.ok(fs.existsSync(files[0]), "promoted adjustment files are written");
  assert.deepEqual(JSON.parse(fs.readFileSync(files[0], "utf8")), WeightConfig.DEFAULT_V2_ADJUSTMENTS);
}

console.log("Bao Phase 7 grid tests passed");
