"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  parseArgs, wilsonLower, minimumSuccessesForWilson,
  candidatesFromReport, summarizeCandidate, decide,
} = require("../tools/phase7-decision.js");

function tempFile(value) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bao-phase7-decision-"));
  const file = path.join(dir, "report.json");
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
  return file;
}

{
  const options = parseArgs([
    "--input", "report.json", "--candidate", "base",
    "--min-score", "0.55", "--min-games", "100", "--min-wilson", "0.51",
    "--max-tactical-failures", "1", "--output", "decision.json", "--json",
  ]);
  assert.equal(options.input, "report.json");
  assert.equal(options.candidate, "base");
  assert.equal(options.minScore, 0.55);
  assert.equal(options.minGames, 100);
  assert.equal(options.minWilson, 0.51);
  assert.equal(options.maxTacticalFailures, 1);
  assert.equal(options.output, "decision.json");
  assert.equal(options.json, true);
}

assert.equal(wilsonLower(0, 0), 0);
assert.ok(wilsonLower(279, 500) > 0.5, "Phase 4 style result clears the adoption line");
assert.ok(wilsonLower(12, 24) < 0.5, "small even result does not clear the adoption line");
assert.equal(minimumSuccessesForWilson(500, 0.5), 272);
assert.equal(minimumSuccessesForWilson(2, 0.9), null);

{
  const validation = { candidates: [{ name: "base", wins: 12, losses: 12, draws: 0 }] };
  assert.equal(candidatesFromReport(validation).length, 1);
  const grid = { variants: [{ name: "base", wins: 9, losses: 7, draws: 0 }] };
  assert.equal(candidatesFromReport(grid).length, 1);
  assert.throws(() => candidatesFromReport({}), /Invalid Phase 7 report/);
}

{
  const summary = summarizeCandidate({
    name: "base",
    wins: 12,
    losses: 12,
    draws: 0,
    score: 0.5,
    tacticalPassed: 7,
    tacticalTotal: 7,
    tacticalFailures: [],
  }, {
    minScore: 0.5,
    minGames: 500,
    minWilson: 0.5,
    maxTacticalFailures: 0,
  });
  assert.equal(summary.games, 24);
  assert.equal(summary.tacticalOk, true);
  assert.equal(summary.scoreOk, true);
  assert.equal(summary.enoughGames, false);
  assert.equal(summary.additionalGamesNeeded, 476);
  assert.equal(summary.minimumSuccessesForWilson, 272);
  assert.equal(summary.minimumScoreForWilson, 0.544);
  assert.equal(summary.decision, "long-run-candidate");
}

{
  const summary = summarizeCandidate({
    name: "adoptable",
    wins: 279,
    losses: 221,
    draws: 0,
    score: 0.558,
    tacticalPassed: 7,
    tacticalTotal: 7,
    tacticalFailures: [],
  }, {
    minScore: 0.5,
    minGames: 500,
    minWilson: 0.5,
    maxTacticalFailures: 0,
  });
  assert.equal(summary.enoughGames, true);
  assert.equal(summary.wilsonOk, true);
  assert.equal(summary.decision, "adopt-candidate");
}

{
  const file = tempFile({
    candidates: [{
      name: "02-base",
      wins: 12,
      losses: 12,
      draws: 0,
      score: 0.5,
      tacticalPassed: 7,
      tacticalTotal: 7,
      tacticalFailures: [],
    }],
  });
  const report = decide(parseArgs(["--input", file, "--candidate", "base"]));
  assert.equal(report.candidates.length, 1);
  assert.equal(report.candidates[0].name, "02-base");
  assert.equal(report.candidates[0].decision, "long-run-candidate");
}

assert.throws(() => parseArgs([]), /Provide --input/);
assert.throws(() => parseArgs(["--input", "x", "--min-score", "2"]), /Invalid minimum score/);
assert.throws(() => parseArgs(["--input", "x", "--min-wilson", "2"]), /Invalid minimum Wilson/);

console.log("Bao Phase 7 decision tests passed");
