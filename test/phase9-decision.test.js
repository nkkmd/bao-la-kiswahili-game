"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  parseArgs,
  candidatesFromReport,
  aggregateFinalReports,
  summarizeCandidate,
  decide,
} = require("../tools/phase9-decision.js");

function tempFile(name, value) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bao-phase9-decision-"));
  const file = path.join(dir, name);
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  return file;
}

function benchmarkReport({ wins, losses, draws = 0, seed = 1, openingPhase = "namua" }) {
  const games = wins + losses + draws;
  return {
    config: { seed, openingPhase, openingPlies: 4 },
    games,
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
    "--final-reports", "a.json,b.json",
    "--min-score", "0.55",
    "--min-games", "100",
    "--min-wilson", "0.51",
    "--max-tactical-failures", "1",
    "--output", "decision.json",
    "--json",
  ]);
  assert.equal(options.input, "phase9.json");
  assert.equal(options.candidate, "candidate-01");
  assert.deepEqual(options.finalReports, ["a.json", "b.json"]);
  assert.equal(options.minScore, 0.55);
  assert.equal(options.minGames, 100);
  assert.equal(options.minWilson, 0.51);
  assert.equal(options.maxTacticalFailures, 1);
  assert.equal(options.output, "decision.json");
  assert.equal(options.json, true);
}

assert.throws(() => parseArgs([]), /Provide --input/);
assert.throws(() => parseArgs(["--input", "x", "--min-score", "2"]), /Invalid minimum score/);
assert.throws(() => parseArgs(["--input", "x", "--min-wilson", "2"]), /Invalid minimum Wilson/);

{
  assert.equal(candidatesFromReport({ finalists: [{ name: "a" }] }).length, 1);
  assert.equal(candidatesFromReport({ candidates: [{ name: "a" }] }).length, 1);
  assert.equal(candidatesFromReport({ name: "a", validation: { wins: 1 } }).length, 1);
  assert.throws(() => candidatesFromReport({}), /Invalid Phase 9 report/);
}

{
  const first = tempFile("first.json", benchmarkReport({ wins: 140, losses: 110, seed: 10 }));
  const second = tempFile("second.json", benchmarkReport({
    wins: 139, losses: 111, seed: 11, openingPhase: "mtaji",
  }));
  const summary = aggregateFinalReports([first, second]);
  assert.equal(summary.games, 500);
  assert.equal(summary.wins, 279);
  assert.equal(summary.losses, 221);
  assert.equal(summary.details.length, 2);
  assert.equal(summary.details[1].openingPhase, "mtaji");
  assert.ok(summary.wilsonLower95 > 0.5);
}

{
  const summary = summarizeCandidate({
    name: "candidate-01",
    tacticalPassed: 7,
    tacticalTotal: 7,
    tacticalFailures: [],
    validation: {
      games: 48,
      wins: 25,
      losses: 23,
      draws: 0,
      score: 25 / 48,
    },
  }, {
    minScore: 0.5,
    minGames: 500,
    minWilson: 0.5,
    maxTacticalFailures: 0,
  });
  assert.equal(summary.source, "validation");
  assert.equal(summary.decision, "long-run-candidate");
  assert.equal(summary.additionalGamesNeeded, 452);
  assert.ok(Number.isFinite(summary.wilsonLower95));
}

{
  const input = tempFile("phase9.json", {
    finalists: [{
      name: "candidate-01",
      tacticalPassed: 7,
      tacticalTotal: 7,
      tacticalFailures: [],
      validation: {
        games: 48,
        wins: 25,
        losses: 23,
        draws: 0,
        score: 25 / 48,
        wilsonLower95: 0.38,
      },
    }],
  });
  const finalA = tempFile("final-a.json", benchmarkReport({ wins: 140, losses: 110, seed: 20 }));
  const finalB = tempFile("final-b.json", benchmarkReport({
    wins: 139, losses: 111, seed: 21, openingPhase: "mtaji",
  }));
  const report = decide(parseArgs([
    "--input", input,
    "--candidate", "candidate-01",
    "--final-reports", `${finalA},${finalB}`,
  ]));
  assert.equal(report.candidates.length, 1);
  assert.equal(report.candidates[0].source, "final-reports");
  assert.equal(report.candidates[0].games, 500);
  assert.equal(report.candidates[0].decision, "adopt-candidate");
}

{
  const input = tempFile("phase9.json", {
    finalists: [
      { name: "candidate-01", validation: { games: 2, wins: 1, losses: 1, draws: 0 } },
      { name: "candidate-02", validation: { games: 2, wins: 1, losses: 1, draws: 0 } },
    ],
  });
  assert.throws(() => decide(parseArgs([
    "--input", input,
    "--final-report", tempFile("final.json", benchmarkReport({ wins: 1, losses: 1 })),
  ])), /Use --candidate/);
}

{
  const report = decide(parseArgs(["--input", tempFile("longrun.json", {
    candidates: [{
      name: "candidate-01",
      wins: 55,
      losses: 45,
      draws: 0,
      games: 100,
      score: 0.55,
      averageMoveMs: 12.5,
      averageNodes: 42,
      tacticalPassed: 7,
      tacticalTotal: 7,
      tacticalFailures: [],
      finalDetails: [{ chunk: 1, baseline: "default" }],
    }],
  })]));
  assert.equal(report.candidates[0].source, "longrun");
  assert.equal(report.candidates[0].finalDetails.length, 1);
  assert.equal(report.candidates[0].averageMoveMs, 12.5);
  assert.equal(report.candidates[0].averageNodes, 42);
}

console.log("Bao Phase 9 decision tests passed");
