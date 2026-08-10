#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const { stateHash } = require("./lib/phase-transition-features.js");
const { extractPositionTypologyObservation } = require("./lib/position-typology-features.js");

const EXPECTED_PROTOCOL = "4fcf67ed5f0e43acb898af4adacb010d56b5305bbac68be5bfa3672fc3df8ecc";
const DEFAULT_INPUT = "artifacts/local/position-typology/stage6-cross-study-bridge-v1/replay-input/replay-input-manifest.json";
const DEFAULT_OUTPUT_ROOT = "artifacts/local/position-typology/stage6-cross-study-bridge-v1/replay";

function parseArgs(argv) {
  const options = { input: DEFAULT_INPUT, output: DEFAULT_OUTPUT_ROOT };
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--input") options.input = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function atomicJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(tmp, filePath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function replayGame(game, targets, experiment, condition) {
  const obsByPly = new Map(game.observations.map((obs) => [Number(obs.ply), obs]));
  const moveByPly = new Map(game.moves.map((move) => [Number(move.ply), move]));
  const targetsByPly = new Map();
  for (const target of targets) {
    const ply = Number(target.candidatePly);
    const rows = targetsByPly.get(ply) || [];
    rows.push(target);
    targetsByPly.set(ply, rows);
  }

  let state = E.initialState();
  let verifiedObservationCount = 0;
  let verifiedMoveCount = 0;
  const records = [];
  const maxObservedPly = Math.max(...game.observations.map((obs) => Number(obs.ply)));

  for (let ply = 0; ply <= maxObservedPly; ply += 1) {
    const archivedObs = obsByPly.get(ply);
    if (!archivedObs) throw new Error(`${experiment}/${condition}/${game.gameId}: missing observation at ply ${ply}`);
    const currentHash = stateHash(state);
    if (currentHash !== archivedObs.stateHash) {
      throw new Error(
        `${experiment}/${condition}/${game.gameId}: replay stateHash mismatch at ply ${ply}: ` +
        `${currentHash} != ${archivedObs.stateHash}`
      );
    }
    verifiedObservationCount += 1;

    const targetRows = targetsByPly.get(ply) || [];
    if (targetRows.length) {
      const position = extractPositionTypologyObservation(state, {
        gameId: game.gameId,
        conditionId: condition,
        seed: game.seed,
        ply,
      });
      for (const target of targetRows) {
        if (target.phaseAtCandidate !== archivedObs.phase) {
          throw new Error(
            `${experiment}/${condition}/${game.gameId}:${ply}: CSV/archive phase mismatch ` +
            `${target.phaseAtCandidate} != ${archivedObs.phase}`
          );
        }
        if (position.phase !== archivedObs.phase) {
          throw new Error(
            `${experiment}/${condition}/${game.gameId}:${ply}: replay/archive phase mismatch ` +
            `${position.phase} != ${archivedObs.phase}`
          );
        }
        records.push({
          experiment,
          condition,
          gameId: game.gameId,
          gameIndex: game.gameIndex,
          seed: game.seed,
          trajectoryHash: game.trajectoryHash,
          candidatePly: ply,
          sourceRow: target.sourceRow,
          category: target.category,
          classification: target.classification,
          phaseAtCandidate: target.phaseAtCandidate,
          distanceToTerminal: target.distanceToTerminal,
          regimeId: target.regimeId,
          regimeStartPly: target.regimeStartPly,
          regimeEndPly: target.regimeEndPly,
          regimeLength: target.regimeLength,
          normalizedPositionInRegime: target.normalizedPositionInRegime,
          archivedStateHash: archivedObs.stateHash,
          position,
        });
      }
    }

    const archivedMove = moveByPly.get(ply);
    if (!archivedMove) {
      if (ply !== maxObservedPly && state.winner === null) {
        throw new Error(`${experiment}/${condition}/${game.gameId}: missing move at nonfinal ply ${ply}`);
      }
      continue;
    }
    if (archivedMove.beforeStateHash && archivedMove.beforeStateHash !== currentHash) {
      throw new Error(`${experiment}/${condition}/${game.gameId}: move beforeStateHash mismatch at ply ${ply}`);
    }
    const applied = E.applyMove(state, archivedMove.move);
    const afterHash = stateHash(applied.state);
    if (archivedMove.afterStateHash && archivedMove.afterStateHash !== afterHash) {
      throw new Error(`${experiment}/${condition}/${game.gameId}: move afterStateHash mismatch at ply ${ply}`);
    }
    state = applied.state;
    verifiedMoveCount += 1;
  }

  if (records.length !== targets.length) {
    throw new Error(
      `${experiment}/${condition}/${game.gameId}: target count mismatch ${records.length} != ${targets.length}`
    );
  }

  return { records, verifiedObservationCount, verifiedMoveCount };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const manifestPath = path.resolve(options.input);
  const manifestRoot = path.dirname(manifestPath);
  const manifest = readJson(manifestPath);
  if (manifest.protocolHash !== EXPECTED_PROTOCOL) throw new Error("Stage 6 protocol hash mismatch");
  if (manifest.associationAnalysisPerformed !== false || manifest.gamesExecuted !== false) {
    throw new Error("replay-input boundary mismatch");
  }

  const allRecords = [];
  const conditionAudits = [];

  for (const conditionEntry of manifest.conditions) {
    let observations = 0;
    let moves = 0;
    let targets = 0;
    for (const gameEntry of conditionEntry.games) {
      const gamePath = path.resolve(manifestRoot, gameEntry.file);
      const game = readJson(gamePath);
      if (game.gameId !== gameEntry.gameId) throw new Error(`prepared gameId mismatch: ${gamePath}`);
      if (game.trajectoryHash !== gameEntry.trajectoryHash) {
        throw new Error(`prepared trajectoryHash mismatch: ${gamePath}`);
      }
      const replay = replayGame(
        game,
        gameEntry.targets,
        conditionEntry.experiment,
        conditionEntry.condition
      );
      allRecords.push(...replay.records);
      observations += replay.verifiedObservationCount;
      moves += replay.verifiedMoveCount;
      targets += replay.records.length;
    }
    if (targets !== Number(conditionEntry.candidateRowsEligible)) {
      throw new Error(
        `${conditionEntry.experiment}/${conditionEntry.condition}: condition target mismatch`
      );
    }
    conditionAudits.push({
      experiment: conditionEntry.experiment,
      condition: conditionEntry.condition,
      candidateBearingGames: conditionEntry.games.length,
      targetsVerified: targets,
      observationsStateHashVerified: observations,
      movesBeforeAfterHashVerified: moves,
      replayPassed: true,
    });
  }

  const dataset = {
    schemaVersion: 1,
    status: "stage6-cross-study-candidate-replay-complete",
    protocolHash: EXPECTED_PROTOCOL,
    formalExperiment: false,
    associationAnalysisPerformed: false,
    gamesExecuted: false,
    formalAnalysisRerun: false,
    study1FormalDecisionsModified: false,
    stage5DecisionModified: false,
    records: allRecords,
  };
  const datasetHash = sha256(stableStringify(dataset));
  dataset.datasetHash = datasetHash;

  const outputRoot = path.resolve(options.output);
  const datasetPath = path.join(outputRoot, "replayed-candidate-states.json");
  atomicJson(datasetPath, dataset);

  const audit = {
    schemaVersion: 1,
    status: "stage6-cross-study-candidate-replay-audit-complete",
    protocolHash: EXPECTED_PROTOCOL,
    replayedCandidateStateDatasetHash: datasetHash,
    formalExperiment: false,
    associationAnalysisPerformed: false,
    gamesExecuted: false,
    formalAnalysisRerun: false,
    archivesModified: false,
    scientificAssociationValuesComputed: false,
    study1FormalDecisionsModified: false,
    stage5DecisionModified: false,
    conditions: conditionAudits,
    allReplayChecksPassed: conditionAudits.every((row) => row.replayPassed),
  };
  audit.auditHash = sha256(stableStringify(audit));
  const auditPath = path.join(outputRoot, "replay-audit.json");
  atomicJson(auditPath, audit);

  console.log(JSON.stringify({
    status: audit.status,
    protocolHash: audit.protocolHash,
    datasetHash,
    auditHash: audit.auditHash,
    conditionCount: conditionAudits.length,
    totalTargets: allRecords.length,
    output: auditPath,
  }, null, 2));
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}
