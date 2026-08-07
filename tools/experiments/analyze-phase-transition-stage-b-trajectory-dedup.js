#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const BOUNDARY = Object.freeze({
  analysisType: "Stage B retrospective archived trajectory-ply dedup synthesis",
  generatesGames: false,
  invokesFormalRunner: false,
  recomputesTrajectoryAudit: false,
  changesPrimaryDecision: false,
  note: "This analyzer reads already-produced structural-secondary JSON only. It does not rebuild trajectory hashes or rerun games.",
});

const INPUTS = Object.freeze({
  "--e018-structure": "e018",
  "--e019-d3-structure": "e019D3",
  "--e020-structure": "e020",
});

const EXPECTED_EXPERIMENT_IDS = Object.freeze({
  e018: "E-018",
  e019D3: "E-019",
  e020: "E-020",
});

const E020_KNOWN_DEDUP = Object.freeze({
  P2: Object.freeze({ candidates: 42, candidateExpansion: 5 }),
  LG: Object.freeze({ candidates: 35, candidateExpansion: 13 }),
});

function parseArgs(argv) {
  const options = {
    inputs: {},
    output: "artifacts/local/phase-transition-stage-b-mechanism/stage-b-trajectory-dedup-summary.json",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--output") options.output = value;
    else if (INPUTS[key]) options.inputs[INPUTS[key]] = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  for (const inputKey of Object.values(INPUTS)) {
    if (!options.inputs[inputKey]) {
      const flag = Object.entries(INPUTS).find(([, value]) => value === inputKey)?.[0];
      throw new Error(`${flag} is required`);
    }
  }
  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), "utf8"));
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function finiteInteger(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) throw new Error(`${label} must be a non-negative integer`);
  return number;
}

function rate(numerator, denominator) {
  return denominator ? numerator / denominator : null;
}

function ratio(numerator, denominator) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return null;
  return numerator / denominator;
}

function direction(p2Rate, lgRate) {
  if (!Number.isFinite(p2Rate) || !Number.isFinite(lgRate) || p2Rate === lgRate) return "tie-or-unavailable";
  return p2Rate > lgRate ? "P2>LG" : "LG>P2";
}

function conditionSummary(condition, label) {
  const endpoint = condition?.trajectoryPlyDeduplicatedEndpoint;
  if (!endpoint?.counts) throw new Error(`${label}: missing trajectoryPlyDeduplicatedEndpoint.counts`);
  const candidates = finiteInteger(endpoint.counts.candidates, `${label}.candidates`);
  const expansion = finiteInteger(endpoint.counts.candidateExpansion, `${label}.candidateExpansion`);
  if (expansion > candidates) throw new Error(`${label}: expansion count exceeds candidate count`);
  const structure = condition.candidateStructure || {};
  const rawCandidateCount = Number.isInteger(Number(structure.rawCandidateCount))
    ? Number(structure.rawCandidateCount)
    : null;
  const rawExpansionCandidateCount = Number.isInteger(Number(structure.rawExpansionCandidateCount))
    ? Number(structure.rawExpansionCandidateCount)
    : null;
  return {
    trajectoryPlyCandidates: candidates,
    trajectoryPlyExpansions: expansion,
    trajectoryPlyExpansionRate: rate(expansion, candidates),
    rawCandidateCount,
    rawExpansionCandidateCount,
    rawToTrajectoryPlyMultiplicity: rawCandidateCount === null ? null : ratio(rawCandidateCount, candidates),
    largestTrajectoryPlyMultiplicity: Number.isInteger(Number(structure.largestTrajectoryPlyMultiplicity))
      ? Number(structure.largestTrajectoryPlyMultiplicity)
      : null,
  };
}

function validateDocument(document, inputKey) {
  const expectedExperimentId = EXPECTED_EXPERIMENT_IDS[inputKey];
  if (document.experimentId !== expectedExperimentId) {
    throw new Error(`${inputKey}: expected experimentId ${expectedExperimentId}, found ${document.experimentId}`);
  }
  if (document.primaryDecisionChanged !== false) {
    throw new Error(`${inputKey}: primaryDecisionChanged must be false`);
  }
  if (inputKey === "e019D3" && document.stratumId !== undefined && document.stratumId !== "D3") {
    throw new Error(`e019D3: expected stratumId D3, found ${document.stratumId}`);
  }
  if (!document.conditions?.P2 || !document.conditions?.LG) {
    throw new Error(`${inputKey}: missing P2/LG conditions`);
  }
  const P2 = conditionSummary(document.conditions.P2, `${inputKey}.P2`);
  const LG = conditionSummary(document.conditions.LG, `${inputKey}.LG`);
  if (inputKey === "e020") {
    for (const profile of ["P2", "LG"]) {
      const summary = profile === "P2" ? P2 : LG;
      const expected = E020_KNOWN_DEDUP[profile];
      if (summary.trajectoryPlyCandidates !== expected.candidates
          || summary.trajectoryPlyExpansions !== expected.candidateExpansion) {
        throw new Error(
          `e020 ${profile}: expected dedup ${expected.candidateExpansion}/${expected.candidates}, found ${summary.trajectoryPlyExpansions}/${summary.trajectoryPlyCandidates}`,
        );
      }
    }
  }
  return { P2, LG };
}

function comparison(P2, LG) {
  const p2Rate = P2.trajectoryPlyExpansionRate;
  const lgRate = LG.trajectoryPlyExpansionRate;
  return {
    direction: direction(p2Rate, lgRate),
    rateDifferenceP2MinusLG: Number.isFinite(p2Rate) && Number.isFinite(lgRate) ? p2Rate - lgRate : null,
    riskRatioP2OverLG: ratio(p2Rate, lgRate),
    riskRatioLGOverP2: ratio(lgRate, p2Rate),
  };
}

function run(options) {
  const documents = {};
  const provenance = {};
  for (const inputKey of Object.keys(EXPECTED_EXPERIMENT_IDS)) {
    const input = path.resolve(options.inputs[inputKey]);
    const document = readJson(input);
    documents[inputKey] = validateDocument(document, inputKey);
    provenance[inputKey] = { path: input, sha256: sha256File(input) };
  }

  const conditions = {
    E018_D2: documents.e018,
    E019_D3: documents.e019D3,
    E020_D3: documents.e020,
  };
  const comparisons = Object.fromEntries(
    Object.entries(conditions).map(([key, value]) => [key, comparison(value.P2, value.LG)]),
  );

  const result = {
    schemaVersion: "1.0.0",
    analysisVersion: "stage-b-trajectory-dedup-1",
    boundary: BOUNDARY,
    inputs: provenance,
    conditions,
    comparisons,
    directionSummary: Object.fromEntries(
      Object.entries(comparisons).map(([key, value]) => [key, value.direction]),
    ),
    interpretationBoundary: [
      "All inputs are archived structural-secondary outputs from already-fixed formal corpora.",
      "Trajectory-ply deduplication is a secondary sensitivity unit and does not replace the paired game-level formal endpoint.",
      "Cross-experiment depth comparison is descriptive because E-018 and E-019/E-020 use different seed blocks.",
      "No output establishes a causal search-profile-by-depth interaction or search-tree mediation.",
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
  E020_KNOWN_DEDUP,
  comparison,
  conditionSummary,
  direction,
  parseArgs,
  run,
  validateDocument,
};
