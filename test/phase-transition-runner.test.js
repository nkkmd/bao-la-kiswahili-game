"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  parseArgs,
  runResearch,
  sha256,
} = require("../tools/experiments/run-phase-transition-research.js");
const {
  verifyArtifacts,
} = require("../tools/experiments/verify-phase-transition-artifacts.js");

const root = fs.mkdtempSync(path.join(os.tmpdir(), "bao-phase-transition-"));
const output = path.join(root, "smoke");

try {
  const options = parseArgs([
    "--games", "2",
    "--seed", "20260721",
    "--max-ply", "6",
    "--level", "easy",
    "--max-depth", "1",
    "--output", output,
  ]);

  const first = runResearch(options);
  assert.equal(first.completed, 2);
  const firstObservations = fs.readFileSync(path.join(output, "observations.jsonl"));
  const firstGames = fs.readFileSync(path.join(output, "games.json"));
  const firstManifest = JSON.parse(fs.readFileSync(path.join(output, "manifest.json"), "utf8"));
  assert.equal(firstManifest.completedGames, 2);
  assert.equal(firstManifest.observationCount, 14);
  assert.deepEqual(verifyArtifacts(output), { observations: 14, games: 2 });

  const second = runResearch(options);
  assert.equal(second.completed, 2);
  assert.equal(
    sha256(fs.readFileSync(path.join(output, "observations.jsonl"))),
    sha256(firstObservations),
    "resume must preserve deterministic observations",
  );
  assert.equal(
    sha256(fs.readFileSync(path.join(output, "games.json"))),
    sha256(firstGames),
    "resume must preserve deterministic game summaries",
  );

  const status = runResearch({ ...options, status: true });
  assert.equal(status.completed, 2);
  assert.equal(status.total, 2);

  assert.throws(
    () => runResearch({ ...options, games: 3 }),
    /different config hash/,
    "resume must reject a changed experiment configuration",
  );

  console.log("phase-transition runner tests passed");
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
