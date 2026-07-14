"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const conditions = [
  "depth-1", "depth-2", "depth-3", "depth-4",
  "policy-uniform", "policy-top3", "policy-softmax",
  "eval-legacy", "eval-bao", "eval-bao-v2", "eval-mcts",
];
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-first-player-aggregate-"));
const suiteDir = path.join(temp, "artifacts", "first-player-suite", "screening-2026-07");
fs.mkdirSync(suiteDir, { recursive: true });

for (const [conditionIndex, conditionName] of conditions.entries()) {
  for (let batch = 1; batch <= 4; batch += 1) {
    const games = Array.from({ length: 10 }, (_, index) => ({
      game: index + 1,
      seed: 1000 + index,
      winner: index % 2,
      turns: 20,
      firstMove: "move-a",
    }));
    const report = {
      status: "complete",
      generatedAt: "2026-07-15T00:00:00.000Z",
      config: {
        conditionName,
        experimentProfile: "screening-2026-07",
        maxDepth: conditionName === "depth-1" ? 1 : 2,
        maxTurns: 120,
        openingPolicy: "uniform",
        evaluationProfile: "bao",
        searchProfile: conditionName === "eval-mcts" ? "mcts" : "phase2",
        randomPlies: 8,
        mctsIterations: 12,
        mctsPlayoutTurns: 16,
        seed: 20260715 + conditionIndex * 100 + batch,
      },
      totals: { games: 10, southWins: 5, northWins: 5, draws: 0, averageTurns: 20 },
      firstMoves: [{ move: "move-a", games: 10, southWins: 5, northWins: 5, draws: 0 }],
      games,
    };
    fs.writeFileSync(
      path.join(suiteDir, `${conditionName}-batch-${batch}.json`),
      `${JSON.stringify(report)}\n`,
    );
  }
}
fs.writeFileSync(path.join(suiteDir, "symmetry.json"), JSON.stringify({ summary: { passed: true } }));

const script = path.resolve(__dirname, "../tools/experiments/aggregate-first-player-research.js");
const result = spawnSync(process.execPath, [script, "suite", "--profile", "screening-2026-07"], {
  cwd: temp,
  encoding: "utf8",
});
assert.equal(result.status, 0, result.stderr);

const summary = JSON.parse(fs.readFileSync(path.join(suiteDir, "summary.json"), "utf8"));
assert.equal(summary.profile, "screening-2026-07");
assert.equal(summary.totalBatchReports, 44);
assert.equal(summary.totalGames, 440);
assert.equal(summary.conditions.length, 11);
assert.ok(summary.conditions.every((condition) => condition.batches === 4 && condition.games === 40));

console.log("First-player aggregate tests passed");
