"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const S0 = require("./lib/restricted-endgame-stage0.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(
  ROOT,
  "doc/restricted-endgame-winning-regions/preregistration/STAGE_0_TECHNICAL_SPEC_V2.json",
);
const RULE_PATH = path.join(
  ROOT,
  "doc/restricted-endgame-winning-regions/preregistration/STAGE_0_V2_MATRIX_SELECTION_RULE.json",
);
const DEFAULT_OUTPUT = path.join(
  ROOT,
  "artifacts/local/restricted-endgame-winning-regions/stage0-technical-v2",
  "closure-matrix.json",
);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map(
    (key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`,
  ).join(",")}}`;
}

function readFrozenInputs() {
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const ruleText = fs.readFileSync(RULE_PATH, "utf8");
  const spec = JSON.parse(specText);
  const rule = JSON.parse(ruleText);
  const specSha256 = sha256(specText);
  const ruleSha256 = sha256(ruleText);
  if (spec.stageId !== "REWR-S0-TECHNICAL-2026-08-24-v2"
    || specSha256 !== rule.bindsTechnicalSpecSha256
    || rule.stageId !== "REWR-S0-MATRIX-SELECTION-2026-08-24-v1"
    || rule.technicalOnly !== true
    || rule.scientificOutcomeGenerationAuthorized !== false
    || rule.scientificTablebaseGenerationAuthorized !== false
    || rule.postSelectionGate?.fallbackToSecondRankedOnVerificationFailure !== false) {
    throw new Error("Invalid Stage 0 matrix freeze");
  }
  return { spec, rule, specSha256, ruleSha256 };
}

function parseArgs(argv) {
  const args = { output: DEFAULT_OUTPUT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") args.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return args;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function selectedForProfile(roots, profile) {
  const eligible = roots.filter(
    (root) => root.nonEmptyPitCount <= profile.nonEmptyCap
      && root.legalMoveCount <= profile.legalMoveCap,
  ).sort((a, b) => a.rootStateKey.localeCompare(b.rootStateKey));
  return {
    eligibleRootCount: eligible.length,
    selected: eligible.length >= profile.prefixSize ? eligible.slice(0, profile.prefixSize) : [],
  };
}

function rootSetSha256(roots) {
  return sha256(roots.map((root) => root.rootStateKey).sort().join("\n"));
}

function rankUnits(a, b) {
  return b.closure.stateCount - a.closure.stateCount
    || b.closure.edgeCount - a.closure.edgeCount
    || b.rootCount - a.rootCount
    || a.rootSetSha256.localeCompare(b.rootSetSha256);
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const { spec, rule, specSha256, ruleSha256 } = readFrozenInputs();
  const p = spec.population;
  const scan = S0.scanWitnessRoots({
    seedBase: p.technicalSeedBase,
    games: p.technicalGames,
    maxPly: p.maximumTrajectoryPly,
  });

  const profiles = [];
  const units = new Map();
  for (const nonEmptyCap of rule.profileEnumeration.nonEmptyPitCountCaps) {
    for (const legalMoveCap of rule.profileEnumeration.legalMoveCountCaps) {
      for (const prefixSize of rule.profileEnumeration.rootPrefixSizes) {
        const profile = { nonEmptyCap, legalMoveCap, prefixSize };
        const chosen = selectedForProfile(scan.roots, profile);
        const row = {
          ...profile,
          eligibleRootCount: chosen.eligibleRootCount,
          estimable: chosen.selected.length === prefixSize,
          rootSetSha256: null,
        };
        if (row.estimable) {
          row.rootSetSha256 = rootSetSha256(chosen.selected);
          if (!units.has(row.rootSetSha256)) {
            units.set(row.rootSetSha256, {
              rootSetSha256: row.rootSetSha256,
              roots: chosen.selected,
              origins: [],
            });
          }
          units.get(row.rootSetSha256).origins.push(profile);
        }
        profiles.push(row);
      }
    }
  }

  const benchmarkedUnits = [];
  for (const unit of [...units.values()].sort((a, b) => a.rootSetSha256.localeCompare(b.rootSetSha256))) {
    const started = process.hrtime.bigint();
    const closure = S0.enumerateClosure(unit.roots.map((root) => root.state), {
      maxStates: spec.closure.maximumStatesTechnicalStop,
      maxEdges: spec.closure.maximumEdgesTechnicalStop,
      administrativeMaxMicrostates: spec.closure.maximumMoveMicrostatesTechnicalStop,
    });
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
    benchmarkedUnits.push({
      rootSetSha256: unit.rootSetSha256,
      rootCount: unit.roots.length,
      rootKeys: unit.roots.map((root) => root.rootStateKey),
      origins: unit.origins,
      closure,
      elapsedMs,
      heapUsedBytesAfter: process.memoryUsage().heapUsed,
    });
  }

  const completeUnits = benchmarkedUnits.filter(
    (unit) => unit.closure.complete === true && unit.closure.technicalStopReason === null,
  ).sort(rankUnits);
  const selected = completeUnits[0] || null;

  const result = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: rule.stageId,
    technicalSpecStageId: spec.stageId,
    technicalSpecSha256: specSha256,
    selectionRuleSha256: ruleSha256,
    technicalOnly: true,
    scientificOutcomeGenerationAuthorized: false,
    scientificTablebaseGenerationAuthorized: false,
    outcomeFieldsEmitted: false,
    witnessPool: {
      seedBase: scan.seedBase,
      seedEnd: scan.seedEnd,
      games: scan.games,
      maxPly: scan.maxPly,
      uniqueWitnessRoots: scan.uniqueWitnessRoots,
    },
    profileCount: profiles.length,
    estimableProfileCount: profiles.filter((row) => row.estimable).length,
    uniqueSelectedRootSetCount: benchmarkedUnits.length,
    profiles,
    benchmarkedUnits,
    completeUnitCount: completeUnits.length,
    selectedTechnicalDomainCandidate: selected ? {
      rootSetSha256: selected.rootSetSha256,
      rootCount: selected.rootCount,
      rootKeys: selected.rootKeys,
      origins: selected.origins,
      closure: selected.closure,
      elapsedMs: selected.elapsedMs,
      heapUsedBytesAfter: selected.heapUsedBytesAfter,
      independentVerificationRequired: true,
      stage1Authorized: false,
    } : null,
    technicalDecision: selected ? "CANDIDATE-SELECTED-PENDING-INDEPENDENT-VERIFICATION" : "TECHNICALLY-INFEASIBLE",
  };

  const forbidden = /\b(WIN|LOSS|RECURRENT|DTF|optimalMoveSet|absoluteWinner)\b/;
  if (forbidden.test(stableStringify(result))) {
    throw new Error("Scientific outcome field leaked into Stage 0 matrix");
  }
  result.resultSha256 = sha256(stableStringify(result));
  writeJson(args.output, result);
  process.stdout.write(`${JSON.stringify({
    stageId: result.stageId,
    technicalSpecSha256: result.technicalSpecSha256,
    selectionRuleSha256: result.selectionRuleSha256,
    uniqueWitnessRoots: result.witnessPool.uniqueWitnessRoots,
    profileCount: result.profileCount,
    estimableProfileCount: result.estimableProfileCount,
    uniqueSelectedRootSetCount: result.uniqueSelectedRootSetCount,
    completeUnitCount: result.completeUnitCount,
    selectedTechnicalDomainCandidate: result.selectedTechnicalDomainCandidate,
    technicalDecision: result.technicalDecision,
    outcomeFieldsEmitted: result.outcomeFieldsEmitted,
    resultSha256: result.resultSha256,
  }, null, 2)}\n`);
  return result;
}

if (require.main === module) main();

module.exports = { main, rankUnits, readFrozenInputs, rootSetSha256, selectedForProfile };
