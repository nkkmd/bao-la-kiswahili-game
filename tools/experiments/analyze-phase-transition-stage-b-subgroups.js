#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const IO = require("./analyze-forced-capture-regimes.js");
const StageB = require("./analyze-phase-transition-stage-b-mechanism.js");

const EXPANSION = "capture-branch-expansion";

const ARGUMENTS = Object.freeze({
  "--e018-p2-candidates": "e018P2",
  "--e018-lg-candidates": "e018Lg",
  "--e019-d3-p2-candidates": "e019D3P2",
  "--e019-d3-lg-candidates": "e019D3Lg",
  "--e020-p2-candidates": "e020P2",
  "--e020-lg-candidates": "e020Lg",
});

const BOUNDARY = Object.freeze({
  analysisType: "Stage B retrospective categorical subgroup decomposition",
  generatesGames: false,
  invokesFormalRunner: false,
  changesPrimaryDecision: false,
  continuousOutcomeChosenCutpointsUsed: false,
  note: "This analysis uses only existing categorical fields in fixed formal-analysis outputs. It is descriptive and non-formal.",
});

function parseArgs(argv) {
  const options = {
    inputs: {},
    output: "artifacts/local/phase-transition-stage-b-mechanism/stage-b-subgroup-summary.json",
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

function ratio(numerator, denominator) {
  return denominator ? numerator / denominator : null;
}

function valueOrMissing(value) {
  return value === undefined || value === null || value === "" ? "<missing>" : String(value);
}

function subgroupSummary(rows) {
  const expansion = rows.filter((row) => row.classification === EXPANSION);
  const candidateGames = new Set(rows.map((row) => row.gameId).filter(Boolean));
  const expansionGames = new Set(expansion.map((row) => row.gameId).filter(Boolean));
  return {
    candidateRows: rows.length,
    candidateGames: candidateGames.size,
    expansionRows: expansion.length,
    expansionGames: expansionGames.size,
    rowExpansionRate: ratio(expansion.length, rows.length),
    gameExpansionRateAmongSubgroupCandidateGames: ratio(expansionGames.size, candidateGames.size),
  };
}

function groupedManifestation(rows, keyFunction) {
  const groups = new Map();
  for (const row of rows) {
    const key = keyFunction(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return Object.fromEntries(
    [...groups.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, group]) => [key, subgroupSummary(group)]),
  );
}

function regimeMembership(row) {
  return row.regimeId ? "inside-regime" : "outside-regime";
}

function summarizeCondition(definition, rows) {
  // Reuse the Stage B primary-event guard and fixed eligibility definition.
  const guarded = StageB.summarizeCondition(definition, rows);
  const eligible = rows.filter((row) => StageB.eligibleCandidate(row));
  return {
    key: definition.key,
    experimentId: definition.experimentId,
    condition: guarded.condition,
    integrityCheck: guarded.integrityCheck,
    eligibleCandidateRows: eligible.length,
    subgroupDimensions: {
      phaseAtCandidate: groupedManifestation(
        eligible,
        (row) => valueOrMissing(row.phaseAtCandidate),
      ),
      forcedCaptureAtCandidate: groupedManifestation(
        eligible,
        (row) => valueOrMissing(row.forcedCaptureAtCandidate),
      ),
      regimeMembership: groupedManifestation(eligible, regimeMembership),
      phaseByRegimeMembership: groupedManifestation(
        eligible,
        (row) => `${valueOrMissing(row.phaseAtCandidate)}|${regimeMembership(row)}`,
      ),
    },
  };
}

function difference(left, right) {
  return Number.isFinite(left) && Number.isFinite(right) ? left - right : null;
}

function riskRatio(left, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) return null;
  if (right === 0) return left > 0 ? Infinity : null;
  return left / right;
}

function compareSubgroupDimension(p2, lg, dimension) {
  const left = p2.subgroupDimensions[dimension] || {};
  const right = lg.subgroupDimensions[dimension] || {};
  const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort();
  return Object.fromEntries(keys.map((key) => {
    const p = left[key] || subgroupSummary([]);
    const l = right[key] || subgroupSummary([]);
    return [key, {
      P2: p,
      LG: l,
      rowExpansionRateDifferenceP2MinusLG: difference(p.rowExpansionRate, l.rowExpansionRate),
      gameExpansionRateDifferenceP2MinusLG: difference(
        p.gameExpansionRateAmongSubgroupCandidateGames,
        l.gameExpansionRateAmongSubgroupCandidateGames,
      ),
      rowExpansionRiskRatioP2OverLG: riskRatio(p.rowExpansionRate, l.rowExpansionRate),
      gameExpansionRiskRatioP2OverLG: riskRatio(
        p.gameExpansionRateAmongSubgroupCandidateGames,
        l.gameExpansionRateAmongSubgroupCandidateGames,
      ),
    }];
  }));
}

function compareProfiles(p2, lg) {
  return {
    direction: "P2-minus-LG within fixed recorded categorical subgroups; descriptive only",
    phaseAtCandidate: compareSubgroupDimension(p2, lg, "phaseAtCandidate"),
    forcedCaptureAtCandidate: compareSubgroupDimension(p2, lg, "forcedCaptureAtCandidate"),
    regimeMembership: compareSubgroupDimension(p2, lg, "regimeMembership"),
    phaseByRegimeMembership: compareSubgroupDimension(p2, lg, "phaseByRegimeMembership"),
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
    analysisVersion: "stage-b-subgroups-1",
    boundary: BOUNDARY,
    inputs,
    conditions,
    comparisons,
    interpretationBoundary: [
      "All subgroup results are retrospective descriptive secondary analyses.",
      "No subgroup result changes any formal primary decision.",
      "Subgroup candidate rows are not independent experimental units.",
      "The categorical dimensions are existing recorded fields; no result-selected continuous cut point is introduced.",
      "Within-subgroup differences do not establish causal mediation or a general search-profile-by-depth interaction.",
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
  compareProfiles,
  compareSubgroupDimension,
  groupedManifestation,
  parseArgs,
  regimeMembership,
  subgroupSummary,
  summarizeCondition,
};
