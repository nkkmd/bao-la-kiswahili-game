#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");

function parseArgs(argv) {
  const options = {
    games: "artifacts/phase-transition/confirmation-v1/games.json",
    candidates: "artifacts/local/phase-transition-confirmation-controls/candidate-control-metrics.csv",
    controls: "artifacts/local/phase-transition-confirmation-controls/control-point-metrics.csv",
    output: "artifacts/local/phase-transition-confirmation-trajectory-audit",
    minimumPliesRemaining: 9,
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--games") options.games = value;
    else if (key === "--candidates") options.candidates = value;
    else if (key === "--controls") options.controls = value;
    else if (key === "--output") options.output = value;
    else if (key === "--minimum-plies-remaining") {
      options.minimumPliesRemaining = Number(value);
      if (!Number.isInteger(options.minimumPliesRemaining)
          || options.minimumPliesRemaining < 0) {
        throw new Error(`Invalid ${key}: ${value}`);
      }
    } else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function number(row, names) {
  for (const name of names) {
    if (row[name] !== undefined && row[name] !== "") {
      const value = Number(row[name]);
      if (Number.isFinite(value)) return value;
    }
  }
  return null;
}

function terminalDistance(row) {
  return number(row, ["distanceToTerminal", "terminalDistance", "pliesRemaining"]);
}

function eventPly(row) {
  return number(row, ["candidatePly", "representativePly", "ply"]);
}

function rate(numerator, denominator) {
  return denominator ? numerator / denominator : null;
}

function riskRatio(candidateRate, controlRate) {
  if (candidateRate === null || controlRate === null) return null;
  if (controlRate === 0) return candidateRate > 0 ? Infinity : null;
  return candidateRate / controlRate;
}

function attachTrajectories(rows, trajectoryByGame, group, minimumPliesRemaining) {
  return rows.filter((row) => {
    const distance = terminalDistance(row);
    return distance === null || distance >= minimumPliesRemaining;
  }).map((row) => {
    const trajectoryHash = trajectoryByGame.get(row.gameId);
    if (!trajectoryHash) throw new Error(`Missing trajectoryHash for ${row.gameId}`);
    const ply = eventPly(row);
    if (ply === null) throw new Error(`Missing candidate/control ply for ${row.gameId}`);
    return {
      ...row,
      group,
      eventPly: ply,
      trajectoryHash,
      trajectoryPlyKey: `${trajectoryHash}:${ply}`,
    };
  });
}

function deduplicate(rows) {
  const unique = new Map();
  for (const row of rows) {
    if (!unique.has(row.trajectoryPlyKey)) unique.set(row.trajectoryPlyKey, row);
  }
  return [...unique.values()];
}

function endpoint(candidates, controls) {
  const isExpansion = (row) => row.classification === "capture-branch-expansion";
  const candidateExpansion = candidates.filter(isExpansion).length;
  const controlExpansion = controls.filter(isExpansion).length;
  const candidateRate = rate(candidateExpansion, candidates.length);
  const controlRate = rate(controlExpansion, controls.length);
  return {
    counts: {
      candidates: candidates.length,
      candidateExpansion,
      controls: controls.length,
      controlExpansion,
    },
    rates: {
      candidateExpansionRate: candidateRate,
      controlExpansionRate: controlRate,
      riskRatio: riskRatio(candidateRate, controlRate),
    },
  };
}

function groupedRows(rows, keyNames) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyNames.map((name) => row[name] ?? "").join("|");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups.values()];
}

function mean(rows, name) {
  const values = rows.map((row) => Number(row[name])).filter(Number.isFinite);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

function candidateArchetypes(candidates) {
  return groupedRows(candidates, ["archetypeId", "classification"]).map((rows) => ({
    archetypeId: rows[0].archetypeId,
    classification: rows[0].classification,
    candidateCount: rows.length,
    uniqueTrajectoryPlyCount: new Set(rows.map((row) => row.trajectoryPlyKey)).size,
    uniqueTrajectoryCount: new Set(rows.map((row) => row.trajectoryHash)).size,
    gameCount: new Set(rows.map((row) => row.gameId)).size,
    phaseAtCandidate: [...new Set(rows.map((row) => row.phaseAtCandidate))].sort().join("|"),
    meanDistanceToTerminal: mean(rows, "distanceToTerminal"),
    meanCaptureDelta: mean(rows, "captureDelta"),
    meanPostPersistenceFraction: mean(rows, "postPersistenceFraction"),
    meanPostCaptureMax: mean(rows, "postCaptureMax"),
  })).sort((left, right) => right.candidateCount - left.candidateCount
    || String(left.archetypeId).localeCompare(String(right.archetypeId)));
}

function duplicateGroups(candidates) {
  return groupedRows(candidates, ["trajectoryPlyKey"]).map((rows) => ({
    trajectoryPlyKey: rows[0].trajectoryPlyKey,
    trajectoryHash: rows[0].trajectoryHash,
    eventPly: rows[0].eventPly,
    candidateCount: rows.length,
    gameCount: new Set(rows.map((row) => row.gameId)).size,
    archetypeId: [...new Set(rows.map((row) => row.archetypeId))].sort().join("|"),
    classification: [...new Set(rows.map((row) => row.classification))].sort().join("|"),
    gameIds: rows.map((row) => row.gameId).sort().join("|"),
  })).sort((left, right) => right.candidateCount - left.candidateCount
    || left.trajectoryPlyKey.localeCompare(right.trajectoryPlyKey));
}

function analyze(games, candidateRows, controlRows, minimumPliesRemaining = 9) {
  const trajectoryByGame = new Map(games.map((game) => [game.gameId, game.trajectoryHash]));
  const candidates = attachTrajectories(
    candidateRows, trajectoryByGame, "candidate", minimumPliesRemaining,
  );
  const controls = attachTrajectories(
    controlRows, trajectoryByGame, "control", minimumPliesRemaining,
  );
  const uniqueCandidates = deduplicate(candidates);
  const uniqueControls = deduplicate(controls);
  const duplicateTable = duplicateGroups(candidates);
  const expansionCandidates = candidates.filter(
    (row) => row.classification === "capture-branch-expansion",
  );
  return {
    summary: {
      analysisVersion: "13-confirmation-trajectory-duplication-audit",
      primaryPopulation: { minimumPliesRemaining },
      rawEndpoint: endpoint(candidates, controls),
      trajectoryPlyDeduplicatedEndpoint: endpoint(uniqueCandidates, uniqueControls),
      candidateStructure: {
        rawCandidateCount: candidates.length,
        uniqueTrajectoryPlyCount: uniqueCandidates.length,
        uniqueTrajectoryCount: new Set(candidates.map((row) => row.trajectoryHash)).size,
        uniqueArchetypeCount: new Set(candidates.map((row) => row.archetypeId)).size,
        rawExpansionCandidateCount: expansionCandidates.length,
        uniqueExpansionTrajectoryPlyCount: deduplicate(expansionCandidates).length,
        uniqueExpansionTrajectoryCount:
          new Set(expansionCandidates.map((row) => row.trajectoryHash)).size,
        uniqueExpansionArchetypeCount:
          new Set(expansionCandidates.map((row) => row.archetypeId)).size,
        largestTrajectoryPlyMultiplicity:
          duplicateTable.length ? duplicateTable[0].candidateCount : 0,
      },
      interpretation: {
        preregisteredDecisionChanged: false,
        sensitivityType: "post-hoc trajectory-plus-ply deduplication",
        note: "This audit measures repeated deterministic trajectories. It does not replace the E-010 preregistered candidate-level decision rule.",
      },
    },
    candidates,
    uniqueCandidates,
    uniqueControls,
    archetypes: candidateArchetypes(candidates),
    duplicateGroups: duplicateTable,
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const games = JSON.parse(fs.readFileSync(path.resolve(options.games), "utf8"));
  const candidates = IO.readCsv(path.resolve(options.candidates));
  const controls = IO.readCsv(path.resolve(options.controls));
  const result = analyze(games, candidates, controls, options.minimumPliesRemaining);
  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(
    path.join(output, "trajectory-duplication-summary.json"),
    `${JSON.stringify(result.summary, null, 2)}\n`,
  );
  IO.writeCsv(path.join(output, "primary-candidate-events.csv"), result.candidates);
  IO.writeCsv(
    path.join(output, "trajectory-ply-deduplicated-candidates.csv"),
    result.uniqueCandidates,
  );
  IO.writeCsv(
    path.join(output, "trajectory-ply-deduplicated-controls.csv"),
    result.uniqueControls,
  );
  IO.writeCsv(path.join(output, "primary-candidate-archetypes.csv"), result.archetypes);
  IO.writeCsv(path.join(output, "candidate-duplicate-groups.csv"), result.duplicateGroups);
  console.log(JSON.stringify(result.summary, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  analyze,
  attachTrajectories,
  candidateArchetypes,
  deduplicate,
  endpoint,
  eventPly,
  parseArgs,
  terminalDistance,
};
