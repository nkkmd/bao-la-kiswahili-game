"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const S0 = require("./lib/restricted-endgame-stage0.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(
  ROOT,
  "doc/restricted-endgame-winning-regions/preregistration/STAGE_0_TECHNICAL_SPEC_V2.json",
);
const DEFAULT_OUTPUT = path.join(
  ROOT,
  "artifacts/local/restricted-endgame-winning-regions/stage0-technical-v2",
  "initial-closure-benchmark.json",
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

function readSpec() {
  const text = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(text);
  if (spec.schemaVersion !== 1
    || spec.studyId !== "REWR-STUDY1"
    || spec.stageId !== "REWR-S0-TECHNICAL-2026-08-24-v2"
    || spec.technicalOnly !== true
    || spec.scientificOutcomeGenerationAuthorized !== false
    || spec.scientificTablebaseGenerationAuthorized !== false
    || spec.closure?.symmetryReduction !== false
    || spec.closure?.runtimeRelayLimitAsTerminalAllowed !== false) {
    throw new Error("Invalid Stage 0 v2 technical firewall spec");
  }
  return { spec, specSha256: sha256(text) };
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

function exactProfileRoots(roots, profile) {
  const eligible = roots.filter(
    (root) => root.nonEmptyPitCount <= profile.nonEmptyCap
      && root.legalMoveCount <= profile.legalMoveCap,
  ).sort((a, b) => a.rootStateKey.localeCompare(b.rootStateKey));
  if (eligible.length < profile.prefixSize) {
    return { eligibleCount: eligible.length, selected: [] };
  }
  return { eligibleCount: eligible.length, selected: eligible.slice(0, profile.prefixSize) };
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const { spec, specSha256 } = readSpec();
  const p = spec.population;
  const scan = S0.scanWitnessRoots({
    seedBase: p.technicalSeedBase,
    games: p.technicalGames,
    maxPly: p.maximumTrajectoryPly,
  });
  const profile = p.initialBenchmarkProfile;
  const selected = exactProfileRoots(scan.roots, profile);

  const result = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
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
    benchmarkProfile: {
      nonEmptyCap: profile.nonEmptyCap,
      legalMoveCap: profile.legalMoveCap,
      prefixSize: profile.prefixSize,
      eligibleRootCount: selected.eligibleCount,
      selectedRootKeys: selected.selected.map((root) => root.rootStateKey),
    },
    closure: null,
    elapsedMs: null,
    heapUsedBytesAfter: null,
  };

  if (selected.selected.length !== profile.prefixSize) {
    result.closure = {
      complete: false,
      technicalStopReason: "PROFILE-NOT-ESTIMABLE",
      stateCountObserved: 0,
      edgeCountObserved: 0,
    };
  } else {
    const started = process.hrtime.bigint();
    result.closure = S0.enumerateClosure(
      selected.selected.map((root) => root.state),
      {
        maxStates: spec.closure.maximumStatesTechnicalStop,
        maxEdges: spec.closure.maximumEdgesTechnicalStop,
        administrativeMaxMicrostates: spec.closure.maximumMoveMicrostatesTechnicalStop,
      },
    );
    result.elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
    result.heapUsedBytesAfter = process.memoryUsage().heapUsed;
  }

  const forbidden = /\b(WIN|LOSS|RECURRENT|DTF|optimalMoveSet|absoluteWinner)\b/;
  if (forbidden.test(stableStringify(result))) {
    throw new Error("Scientific outcome field leaked into Stage 0 v2 benchmark");
  }
  result.resultSha256 = sha256(stableStringify(result));
  writeJson(args.output, result);
  process.stdout.write(`${JSON.stringify({
    stageId: result.stageId,
    specSha256: result.specSha256,
    uniqueWitnessRoots: result.witnessPool.uniqueWitnessRoots,
    benchmarkProfile: result.benchmarkProfile,
    closure: result.closure,
    elapsedMs: result.elapsedMs,
    heapUsedBytesAfter: result.heapUsedBytesAfter,
    outcomeFieldsEmitted: result.outcomeFieldsEmitted,
    resultSha256: result.resultSha256,
  }, null, 2)}\n`);
  return result;
}

if (require.main === module) main();

module.exports = { exactProfileRoots, main, parseArgs, readSpec };
