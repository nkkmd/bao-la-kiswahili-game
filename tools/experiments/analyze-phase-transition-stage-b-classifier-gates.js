#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");
const StageB = require("./analyze-phase-transition-stage-b-mechanism.js");

const EXPANSION = "capture-branch-expansion";

const FIXED_CLASSIFIER = Object.freeze({
  eventWindow: 8,
  expansionDelta: 3,
  persistenceFraction: 0.5,
});

const ARGUMENTS = Object.freeze({
  "--e018-p2-candidates": "e018P2",
  "--e018-lg-candidates": "e018Lg",
  "--e019-d3-p2-candidates": "e019D3P2",
  "--e019-d3-lg-candidates": "e019D3Lg",
  "--e020-p2-candidates": "e020P2",
  "--e020-lg-candidates": "e020Lg",
});

const BOUNDARY = Object.freeze({
  analysisType: "Stage B retrospective fixed classifier-gate decomposition",
  generatesGames: false,
  invokesFormalRunner: false,
  changesPrimaryDecision: false,
  resultChosenThresholdsUsed: false,
  thresholdsArePreExistingClassifierDefaults: true,
  note: "This analysis reconstructs passage through the pre-existing ordered classification gates. It is descriptive and must not be treated as independent validation of the expansion phenotype.",
});

function parseArgs(argv) {
  const options = {
    inputs: {},
    output: "artifacts/local/phase-transition-stage-b-mechanism/stage-b-classifier-gates.json",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--output") options.output = value;
    else if (ARGUMENTS[key]) options.inputs[ARGUMENTS[key]] = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  for (const conditionKey of Object.keys(StageB.CONDITION_DEFINITIONS)) {
    if (!options.inputs[conditionKey]) {
      const flag = Object.entries(ARGUMENTS).find(([, value]) => value === conditionKey)?.[0];
      throw new Error(`${flag} is required`);
    }
  }
  return options;
}

function finiteNumber(row, name) {
  if (row[name] === undefined || row[name] === null || row[name] === "") return null;
  const value = Number(row[name]);
  return Number.isFinite(value) ? value : null;
}

function uniqueGames(rows) {
  return new Set(rows.map((row) => row.gameId).filter(Boolean)).size;
}

function rowAndGameCount(rows) {
  return {
    rows: rows.length,
    games: uniqueGames(rows),
  };
}

function primaryContext(row) {
  return row.phaseAtCandidate === "namua" && Boolean(row.regimeId);
}

function gateDisposition(row, settings = FIXED_CLASSIFIER) {
  const distanceToMtaji = finiteNumber(row, "distanceToMtaji");
  if (distanceToMtaji !== null && distanceToMtaji <= settings.eventWindow) {
    return "blocked-near-mtaji";
  }

  const distanceToForcingRelease = finiteNumber(row, "distanceToForcingRelease");
  if (distanceToForcingRelease !== null && distanceToForcingRelease <= settings.eventWindow) {
    return "blocked-near-forcing-release";
  }

  const captureDelta = finiteNumber(row, "captureDelta");
  if (captureDelta === null || captureDelta < settings.expansionDelta) {
    return "insufficient-capture-delta";
  }

  const persistence = finiteNumber(row, "postPersistenceFraction");
  if (persistence === null || persistence < settings.persistenceFraction) {
    return "insufficient-persistence";
  }

  return "expansion-compatible";
}

function summarizeGates(rows, settings = FIXED_CLASSIFIER) {
  const contextRows = rows.filter(primaryContext);
  const buckets = {
    "blocked-near-mtaji": [],
    "blocked-near-forcing-release": [],
    "insufficient-capture-delta": [],
    "insufficient-persistence": [],
    "expansion-compatible": [],
  };

  for (const row of contextRows) buckets[gateDisposition(row, settings)].push(row);

  const afterMtaji = contextRows.filter((row) => gateDisposition(row, settings) !== "blocked-near-mtaji");
  const afterForcing = afterMtaji.filter((row) => gateDisposition(row, settings) !== "blocked-near-forcing-release");
  const afterDelta = afterForcing.filter((row) => !["insufficient-capture-delta"].includes(gateDisposition(row, settings)));
  const compatible = buckets["expansion-compatible"];
  const recordedExpansion = contextRows.filter((row) => row.classification === EXPANSION);

  const compatibleGames = new Set(compatible.map((row) => row.gameId).filter(Boolean));
  const expansionGames = new Set(recordedExpansion.map((row) => row.gameId).filter(Boolean));
  if (compatible.length !== recordedExpansion.length || compatibleGames.size !== expansionGames.size) {
    throw new Error(
      `Classifier reconstruction mismatch: compatible rows/games ${compatible.length}/${compatibleGames.size}, recorded expansion rows/games ${recordedExpansion.length}/${expansionGames.size}`,
    );
  }

  return {
    primaryContext: "eligible candidate AND phaseAtCandidate=namua AND regimeId present",
    context: rowAndGameCount(contextRows),
    blockedAtGate: Object.fromEntries(
      Object.entries(buckets).map(([key, bucket]) => [key, rowAndGameCount(bucket)]),
    ),
    sequentialSurvival: {
      enteredContext: rowAndGameCount(contextRows),
      survivedMtajiPrecursorGate: rowAndGameCount(afterMtaji),
      survivedForcingReleaseGate: rowAndGameCount(afterForcing),
      survivedCaptureDeltaGate: rowAndGameCount(afterDelta),
      survivedPersistenceGate: rowAndGameCount(compatible),
    },
    rates: {
      expansionCompatibleRowsAmongContext: contextRows.length ? compatible.length / contextRows.length : null,
      expansionCompatibleGamesAmongContextGames: uniqueGames(contextRows) ? compatibleGames.size / uniqueGames(contextRows) : null,
    },
    integrityCheck: {
      reconstructedExpansionRows: compatible.length,
      recordedExpansionRowsInContext: recordedExpansion.length,
      reconstructedExpansionGames: compatibleGames.size,
      recordedExpansionGamesInContext: expansionGames.size,
      exactMatch: true,
    },
  };
}

function summarizeCondition(definition, rows) {
  const guarded = StageB.summarizeCondition(definition, rows);
  const eligible = rows.filter((row) => StageB.eligibleCandidate(row));
  const gates = summarizeGates(eligible);
  if (gates.integrityCheck.recordedExpansionGamesInContext !== definition.expectedPrimaryExpansionGames) {
    throw new Error(
      `${definition.key}: not all formal primary expansion games are represented in namua × inside-regime context`,
    );
  }
  return {
    key: definition.key,
    experimentId: definition.experimentId,
    condition: guarded.condition,
    primaryIntegrityCheck: guarded.integrityCheck,
    gates,
  };
}

function compareProfiles(p2, lg) {
  const p = p2.gates;
  const l = lg.gates;
  const stages = [
    "enteredContext",
    "survivedMtajiPrecursorGate",
    "survivedForcingReleaseGate",
    "survivedCaptureDeltaGate",
    "survivedPersistenceGate",
  ];
  const sequential = Object.fromEntries(stages.map((stage) => [stage, {
    P2Rows: p.sequentialSurvival[stage].rows,
    LGRows: l.sequentialSurvival[stage].rows,
    P2Games: p.sequentialSurvival[stage].games,
    LGGames: l.sequentialSurvival[stage].games,
    P2RowSurvivalFromContext: p.context.rows ? p.sequentialSurvival[stage].rows / p.context.rows : null,
    LGRowSurvivalFromContext: l.context.rows ? l.sequentialSurvival[stage].rows / l.context.rows : null,
  }]));

  return {
    direction: "P2 versus LG passage through fixed pre-existing classifier gates; descriptive only",
    sequentialSurvival: sequential,
    finalExpansionCompatibleRateDifferenceP2MinusLG:
      p.rates.expansionCompatibleRowsAmongContext - l.rates.expansionCompatibleRowsAmongContext,
  };
}

function run(options) {
  const conditions = {};
  const inputs = {};
  for (const [conditionKey, definition] of Object.entries(StageB.CONDITION_DEFINITIONS)) {
    const input = path.resolve(options.inputs[conditionKey]);
    const rows = IO.readCsv(input);
    conditions[definition.key] = summarizeCondition(definition, rows);
    inputs[conditionKey] = {
      path: input,
      sha256: StageB.sha256File(input),
    };
  }

  const comparisons = {
    E018_D2: compareProfiles(conditions["E018-D2-P2"], conditions["E018-D2-LG"]),
    E019_D3: compareProfiles(conditions["E019-D3-P2"], conditions["E019-D3-LG"]),
    E020_D3: compareProfiles(conditions["E020-D3-P2"], conditions["E020-D3-LG"]),
  };

  const result = {
    schemaVersion: "1.0.0",
    analysisVersion: "stage-b-classifier-gates-1",
    boundary: BOUNDARY,
    fixedClassifierDefaults: FIXED_CLASSIFIER,
    inputs,
    conditions,
    comparisons,
    interpretationBoundary: [
      "This is a reconstruction of the already-existing classifier decision path, not an independent predictor analysis.",
      "The fixed thresholds are inherited from the pre-existing classifier and were not selected from Stage B outcomes.",
      "Candidate rows are not independent experimental units.",
      "No output changes E-018/H16, E-019/H17, or E-020/H18.",
      "Gate differences may identify where profile-specific candidate pools separate, but do not establish causal mediation.",
    ],
  };

  const output = path.resolve(options.output);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

if (require.main === module) {
  try {
    run(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  BOUNDARY,
  FIXED_CLASSIFIER,
  gateDisposition,
  parseArgs,
  primaryContext,
  summarizeCondition,
  summarizeGates,
};
