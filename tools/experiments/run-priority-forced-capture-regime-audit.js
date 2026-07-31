#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { experimentConfig, parseArgs, runGame } = require("./run-phase-transition-research.js");
const R = require("./lib/forced-capture-regimes.js");

const PRIORITY_CANDIDATES = [
  { archetypeId: "9f778d512ae1", category: "A", representativeGameId: "pt-pilot-v2-0006", representativePly: 7, expectedCaptureMoveCount: 8 },
  { archetypeId: "22807aff1baf", category: "A", representativeGameId: "pt-pilot-v2-0019", representativePly: 47, expectedCaptureMoveCount: 9 },
  { archetypeId: "0eb352745c9b", category: "A", representativeGameId: "pt-pilot-v2-0027", representativePly: 32, expectedCaptureMoveCount: 8 },
  { archetypeId: "2e79188a987a", category: "A", representativeGameId: "pt-pilot-v2-0063", representativePly: 39, expectedCaptureMoveCount: 9 },
  { archetypeId: "7360876ad5c7", category: "A", representativeGameId: "pt-pilot-v2-0013", representativePly: 37, expectedCaptureMoveCount: 9 },
  { archetypeId: "6b364e603366", category: "A", representativeGameId: "pt-pilot-v2-0082", representativePly: 9, expectedCaptureMoveCount: 7 },
];

function gameIndex(gameId) {
  const match = gameId.match(/(\d+)$/);
  if (!match) throw new Error(`Cannot parse game index: ${gameId}`);
  return Number(match[1]);
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(filePath, rows) {
  if (!rows.length) return fs.writeFileSync(filePath, "\n");
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(","), ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(","))];
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`);
}

function main() {
  const outputDir = path.resolve(process.argv[2] || "artifacts/local/priority-forced-capture-regime-audit");
  const config = experimentConfig(parseArgs(["--profile", "pilot-v2"]));
  const games = new Map();
  const observations = [];

  for (const candidate of PRIORITY_CANDIDATES) {
    const index = gameIndex(candidate.representativeGameId);
    if (!games.has(candidate.representativeGameId)) {
      const game = runGame(config, index);
      if (game.gameId !== candidate.representativeGameId) {
        throw new Error(`Game ID mismatch: expected ${candidate.representativeGameId}, got ${game.gameId}`);
      }
      games.set(game.gameId, game);
      observations.push(...game.observations);
    }
  }

  const regimes = R.extractForcedCaptureRegimes(observations);
  const gameRows = R.groupByGame(observations);
  const candidates = PRIORITY_CANDIDATES.map((candidate) => {
    const metrics = R.analyzeCandidate(candidate, gameRows, regimes, {
      before: 3,
      after: 8,
      expansionDelta: 3,
      convergenceDelta: -2,
      persistenceFraction: 0.5,
      eventWindow: 8,
    });
    if (!metrics.forcedCaptureAtCandidate) {
      throw new Error(`${candidate.archetypeId} is no longer forcedCapture at candidate ply`);
    }
    if (metrics.candidateCaptureMoveCount !== candidate.expectedCaptureMoveCount) {
      throw new Error(
        `${candidate.archetypeId} capture count mismatch: expected ${candidate.expectedCaptureMoveCount}, got ${metrics.candidateCaptureMoveCount}`,
      );
    }
    return metrics;
  });

  const classCounts = Object.fromEntries(
    [...new Set(candidates.map((row) => row.classification))]
      .sort()
      .map((classification) => [classification, candidates.filter((row) => row.classification === classification).length]),
  );
  const summary = {
    analysisVersion: "6-priority-forced-capture-regime-audit",
    studyVersion: config.studyVersion,
    profile: config.profile,
    baseSeed: config.baseSeed,
    config,
    gameCount: games.size,
    observationCount: observations.length,
    regimeCount: regimes.length,
    candidateCount: candidates.length,
    candidatesOutsideRegimes: candidates.filter((row) => !row.regimeId).length,
    classCounts,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  writeCsv(path.join(outputDir, "priority-candidate-regime-metrics.csv"), candidates);
  writeCsv(path.join(outputDir, "priority-forced-capture-regimes.csv"), regimes);
  fs.writeFileSync(path.join(outputDir, "priority-regime-audit.json"), `${JSON.stringify({ summary, candidates }, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify({ summary, candidates }, null, 2));
}

if (require.main === module) main();

module.exports = { PRIORITY_CANDIDATES, gameIndex };
