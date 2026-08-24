"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const S0 = require("./lib/restricted-endgame-stage0.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(
  ROOT,
  "doc/restricted-endgame-winning-regions/preregistration/STAGE_0_TECHNICAL_SPEC.json",
);
const DEFAULT_OUTPUT = path.join(
  ROOT,
  "artifacts/local/restricted-endgame-winning-regions/stage0-technical-v1",
);

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function readSpec() {
  const text = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(text);
  if (spec.schemaVersion !== 1
    || spec.studyId !== "REWR-STUDY1"
    || spec.stageId !== "REWR-S0-TECHNICAL-2026-08-24-v1"
    || spec.technicalOnly !== true
    || spec.scientificOutcomeGenerationAuthorized !== false
    || spec.scientificTablebaseGenerationAuthorized !== false
    || spec.closure?.symmetryReduction !== false
    || spec.closure?.runtimeRelayLimitAsTerminalAllowed !== false) {
    throw new Error("Invalid Stage 0 technical firewall spec");
  }
  return { spec, specSha256: sha256(text) };
}

function parseArgs(argv) {
  const args = { mode: "scan", output: DEFAULT_OUTPUT };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--mode") args.mode = argv[++i];
    else if (token === "--output") args.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${token}`);
  }
  if (!new Set(["scan", "benchmark"]).has(args.mode)) throw new Error("--mode must be scan or benchmark");
  return args;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function publicRootRow(root) {
  return {
    rootStateKey: root.rootStateKey,
    seed: root.seed,
    ply: root.ply,
    nonEmptyPitCount: root.nonEmptyPitCount,
    legalMoveCount: root.legalMoveCount,
  };
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
  const plans = S0.buildCandidatePlans(scan.roots);

  const manifest = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    technicalOnly: true,
    scientificOutcomeGenerationAuthorized: false,
    scientificTablebaseGenerationAuthorized: false,
    outcomeFieldsEmitted: false,
    mode: args.mode,
    scan: {
      seedBase: scan.seedBase,
      seedEnd: scan.seedEnd,
      games: scan.games,
      maxPly: scan.maxPly,
      uniqueWitnessRoots: scan.uniqueWitnessRoots,
      roots: scan.roots.map(publicRootRow),
    },
    candidatePlans: plans.map((plan) => ({
      planKey: plan.planKey,
      rootKeys: plan.rootKeys,
      origins: plan.origins,
    })),
    benchmark: null,
  };

  writeJson(path.join(args.output, "witness-roots.json"), {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    technicalOnly: true,
    roots: scan.roots,
  });

  if (args.mode === "benchmark") {
    const c = spec.closure;
    manifest.benchmark = S0.benchmarkPlans(scan, {
      maxStates: c.maximumStatesTechnicalStop,
      maxEdges: c.maximumEdgesTechnicalStop,
      administrativeMaxMicrostates: c.maximumMoveMicrostatesTechnicalStop,
    });
  }

  const core = JSON.stringify(manifest);
  manifest.manifestSha256 = sha256(core);
  writeJson(path.join(args.output, "stage0-technical-manifest.json"), manifest);
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

if (require.main === module) main();

module.exports = { main, parseArgs, readSpec };
