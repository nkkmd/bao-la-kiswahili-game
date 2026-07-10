"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const WeightConfig = require("../public/ai-weights.js");
const { seededRandom, parseArgs, createOpening, runBenchmark } = require("../tools/benchmark.js");

{
  const first = seededRandom(42);
  const second = seededRandom(42);
  assert.deepEqual(Array.from({ length: 10 }, first), Array.from({ length: 10 }, second),
    "a seed reproduces the random sequence");
}

{
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-adjustments-"));
  const adjustmentsPath = path.join(temp, "adjustments.json");
  fs.writeFileSync(adjustmentsPath, JSON.stringify(WeightConfig.DEFAULT_V2_ADJUSTMENTS));
  const options = parseArgs([
    "--games", "4", "--seed", "99", "--first", "easy", "--second", "easy",
    "--first-profile", "bao-v2", "--second-profile", "legacy", "--opening-plies", "4",
    "--first-search", "mcts", "--second-search", "legacy",
    "--first-adaptive", "--second-adaptive",
    "--first-tt-move-first", "--second-tt-move-first",
    "--first-q-capture-ordering", "--second-q-capture-ordering",
    "--first-adjustments", adjustmentsPath,
    "--opening-phase", "namua",
    "--mcts-iterations", "16", "--mcts-playout-turns", "12", "--mcts-exploration", "1.1",
    "--mcts-policy", "balanced", "--mcts-root", "value", "--mcts-reward", "terminal",
    "--mcts-prior", "static", "--mcts-prior-weight", "2",
    "--mcts-candidate-limit", "3", "--mcts-candidate-source", "phase2",
    "--mcts-candidate-depth", "2",
  ]);
  assert.equal(options.firstProfile, "bao-v2");
  assert.equal(options.secondProfile, "legacy");
  assert.deepEqual(options.firstAdjustments, WeightConfig.DEFAULT_V2_ADJUSTMENTS);
  assert.equal(options.openingPlies, 4);
  assert.equal(options.firstSearch, "mcts");
  assert.equal(options.secondSearch, "legacy");
  assert.equal(options.firstAdaptive, true);
  assert.equal(options.secondAdaptive, true);
  assert.equal(options.firstTtMoveFirst, true);
  assert.equal(options.secondTtMoveFirst, true);
  assert.equal(options.firstQCaptureOrdering, true);
  assert.equal(options.secondQCaptureOrdering, true);
  assert.equal(options.openingPhase, "namua");
  assert.equal(options.mctsIterations, 16);
  assert.equal(options.mctsPlayoutTurns, 12);
  assert.equal(options.mctsExploration, 1.1);
  assert.equal(options.mctsPolicy, "balanced");
  assert.equal(options.mctsRoot, "value");
  assert.equal(options.mctsReward, "terminal");
  assert.equal(options.mctsPrior, "static");
  assert.equal(options.mctsPriorWeight, 2);
  assert.equal(options.mctsCandidateLimit, 3);
  assert.equal(options.mctsCandidateSource, "phase2");
  assert.equal(options.mctsCandidateDepth, 2);
  const summarize = (report) => ({
    southWins: report.southWins,
    northWins: report.northWins,
    draws: report.draws,
    averageTurns: report.averageTurns,
    records: report.competitors.map(({ wins, losses, draws }) => ({ wins, losses, draws })),
  });
  assert.deepEqual(summarize(runBenchmark(options)), summarize(runBenchmark(options)),
    "the same benchmark seed reproduces game results");
}

assert.throws(() => parseArgs(["--first-profile", "unknown"]), /Invalid profile/,
  "unknown evaluation profiles are rejected");
assert.throws(() => parseArgs(["--first-search", "unknown"]), /Invalid search/,
  "unknown search profiles are rejected");
assert.throws(() => parseArgs(["--mcts-policy", "unknown"]), /Invalid MCTS policy/,
  "unknown MCTS policies are rejected");
assert.throws(() => parseArgs(["--mcts-root", "unknown"]), /Invalid MCTS root selection/,
  "unknown MCTS root selectors are rejected");
assert.throws(() => parseArgs(["--mcts-reward", "unknown"]), /Invalid MCTS reward/,
  "unknown MCTS rewards are rejected");
assert.throws(() => parseArgs(["--mcts-prior", "unknown"]), /Invalid MCTS prior/,
  "unknown MCTS priors are rejected");
assert.throws(() => parseArgs(["--mcts-candidate-source", "unknown"]), /Invalid MCTS candidate source/,
  "unknown MCTS candidate sources are rejected");

{
  const report = runBenchmark(parseArgs([
    "--games", "2", "--seed", "77", "--first", "hard", "--second", "easy",
    "--first-search", "mcts", "--time-limit", "0",
    "--mcts-iterations", "4", "--mcts-playout-turns", "4", "--mcts-policy", "random",
  ]));
  assert.ok(report.competitors[0].totalSimulations > 0,
    "MCTS benchmark results include simulation counts");
}

{
  const report = runBenchmark(parseArgs([
    "--games", "2", "--seed", "88", "--first", "hard", "--second", "hard",
    "--first-adaptive", "--time-limit", "20", "--max-depth", "2", "--max-turns", "6",
  ]));
  assert.ok(report.competitors[0].averageAllocatedMs > 0,
    "adaptive benchmark summaries include allocated time budgets");
  assert.equal(report.competitors[1].averageBaseTimeLimitMs, 20,
    "fixed benchmark summaries still record their configured budget");
}

{
  const mtaji = createOpening(seededRandom(1234), 2, "mtaji");
  assert.equal(mtaji.phase, "mtaji", "benchmarks can start from a generated mtaji position");
  assert.equal(mtaji.winner, null, "generated openings are playable positions");
}

console.log("Bao benchmark tests passed");
