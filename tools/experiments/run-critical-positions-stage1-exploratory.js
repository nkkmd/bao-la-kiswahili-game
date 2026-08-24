#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { hashValue } = require("./lib/position-typology-features.js");
const C = require("./lib/critical-positions-stage1-corpus.js");
const Discovery = require("./lib/critical-positions-stage1-discovery.js");

function parseArgs(argv) {
  const result = { phase: "status", output: C.DEFAULT_OUTPUT, force: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--force") {
      result.force = true;
      continue;
    }
    if (arg === "--phase" || arg === "--mode") {
      result.phase = argv[++index];
      continue;
    }
    if (arg === "--output") {
      result.output = path.resolve(argv[++index]);
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (result.phase === "technical-smoke") result.phase = "technical-pipeline-smoke";
  const allowed = ["status", "generate", "select", "measure", "discover", "technical-pipeline-smoke"];
  if (!allowed.includes(result.phase)) throw new Error(`Unsupported phase: ${result.phase}`);
  return result;
}

function countFiles(directory, regex) {
  if (!fs.existsSync(directory)) return 0;
  return fs.readdirSync(directory).filter((name) => regex.test(name)).length;
}

function status(output, spec, specSha256) {
  return {
    stageId: spec.stageId,
    specSha256,
    output,
    authorizationFilePresent: fs.existsSync(C.AUTH_PATH),
    generatedGames: countFiles(path.join(output, "games"), /^game-\d+\.json$/),
    expectedGames: spec.population.games,
    hasManifest: fs.existsSync(path.join(output, "manifest.json")),
    hasCorpusVerification: fs.existsSync(path.join(output, "verification.json")),
    hasSelectionAudit: fs.existsSync(path.join(output, "selection-audit.json")),
    hasSelectedRoots: fs.existsSync(path.join(output, "selected-roots.json")),
    measurementFiles: countFiles(path.join(output, "measurements"), /^selected-\d+\.json$/),
    hasMeasurementAudit: fs.existsSync(path.join(output, "measurement-audit.json")),
    hasMeasurementVerification: fs.existsSync(path.join(output, "measurement-verification.json")),
    hasDiscoveryResult: fs.existsSync(path.join(output, "discovery-result.json")),
    sourceFileSha256: C.sourceFileSha256(),
  };
}

function generate(output, spec, specSha256, authorization, force) {
  const provenance = C.provenance();
  if (provenance.sourceTreeDirty) throw new Error("Frozen scientific source tree is dirty");
  const games = [];
  for (let index = 0; index < spec.population.games; index += 1) {
    const file = C.gamePath(output, index);
    let game = !force && fs.existsSync(file) ? C.readJson(file) : null;
    if (game && game.specSha256 !== specSha256) throw new Error(`Spec mismatch: ${file}`);
    if (!game) {
      game = C.runScientificGame(spec, specSha256, index);
      C.writeJson(file, game);
    }
    games.push(game);
    console.error(`[cpob stage1 generate] ${index + 1}/${spec.population.games}`);
  }
  const conditionCounts = {};
  const trajectoryCounts = new Map();
  for (const game of games) {
    conditionCounts[game.conditionId] = (conditionCounts[game.conditionId] || 0) + 1;
    trajectoryCounts.set(
      game.historicalTrajectoryHash,
      (trajectoryCounts.get(game.historicalTrajectoryHash) || 0) + 1,
    );
  }
  const summary = {
    games: games.length,
    uniqueHistoricalTrajectories: trajectoryCounts.size,
    duplicateHistoricalTrajectoryGroups: [...trajectoryCounts.values()].filter((count) => count > 1).length,
    largestHistoricalTrajectoryGroup: Math.max(...trajectoryCounts.values()),
    distinctOpeningPrefixes: new Set(games.map((game) => game.openingPrefix.hash)).size,
    conditionCounts,
  };
  const manifest = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    exploratory: true,
    formalExperiment: false,
    scientificInferenceAuthorized: false,
    confirmatoryReuseAllowed: false,
    authorizationSha256: authorization.authorizationSha256,
    generatedAt: new Date().toISOString(),
    population: spec.population,
    summary,
    summaryHash: hashValue(summary),
    provenance,
  };
  C.writeJson(path.join(output, "manifest.json"), manifest);
  return manifest;
}

function requireCorpusVerification(output, specSha256) {
  const file = path.join(output, "verification.json");
  if (!fs.existsSync(file)) throw new Error("Root selection blocked: verification.json absent");
  const verification = C.readJson(file);
  if (verification.specSha256 !== specSha256
    || verification.passed !== true
    || verification.fullCorpusReplay !== true) {
    throw new Error("Root selection blocked: independent full corpus replay did not pass");
  }
  return verification;
}

function select(output, spec, specSha256) {
  requireCorpusVerification(output, specSha256);
  const games = C.readGames(output, spec);
  const selection = C.selectRoots(games, spec);
  const selectedPayload = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    selectionHash: selection.selectionHash,
    selected: selection.selected,
  };
  const audit = { ...selection };
  delete audit.selected;
  C.writeJson(path.join(output, "selection-audit.json"), audit);
  C.writeJson(path.join(output, "selected-roots.json"), selectedPayload);
  return audit;
}

function requireSelection(output, specSha256) {
  const auditPath = path.join(output, "selection-audit.json");
  const rootsPath = path.join(output, "selected-roots.json");
  if (!fs.existsSync(auditPath) || !fs.existsSync(rootsPath)) {
    throw new Error("Measurement blocked: root-selection artifacts absent");
  }
  const audit = C.readJson(auditPath);
  const roots = C.readJson(rootsPath);
  if (roots.specSha256 !== specSha256 || audit.readiness?.passed !== true
    || roots.selectionHash !== audit.selectionHash) {
    throw new Error("Measurement blocked: root-selection readiness did not pass");
  }
  return roots;
}

function measure(output, spec, specSha256, force) {
  const roots = requireSelection(output, specSha256);
  if (roots.selected.length !== spec.stopping.selectedRootsFixedIfReadinessPasses) {
    throw new Error("Measurement blocked: selected-root count differs from frozen count");
  }
  const measurements = [];
  for (let index = 0; index < roots.selected.length; index += 1) {
    const file = C.measurementPath(output, index);
    let measurement = !force && fs.existsSync(file) ? C.readJson(file) : null;
    if (measurement && (measurement.selectionHash !== roots.selectionHash
      || measurement.selectedIndex !== index)) {
      throw new Error(`Measurement identity mismatch: ${file}`);
    }
    if (!measurement) {
      measurement = C.measureSelectedRoot(roots.selected[index], index, spec, {
        selectionHash: roots.selectionHash,
      });
      C.writeJson(file, measurement);
    }
    measurements.push(measurement);
    console.error(`[cpob stage1 measure] ${index + 1}/${roots.selected.length}`);
  }
  const readiness = C.measurementReadiness(measurements, spec);
  const audit = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    selectionHash: roots.selectionHash,
    selectedRoots: roots.selected.length,
    replacementPerformed: false,
    replicateExtensionPerformed: false,
    continuationPolicySubstitutionPerformed: false,
    ...readiness,
    independentContinuationRemeasurementPending: true,
  };
  C.writeJson(path.join(output, "measurement-audit.json"), audit);
  return audit;
}

function requireMeasurementVerification(output, specSha256) {
  const file = path.join(output, "measurement-verification.json");
  if (!fs.existsSync(file)) throw new Error("Discovery blocked: measurement-verification.json absent");
  const verification = C.readJson(file);
  if (verification.specSha256 !== specSha256
    || verification.passed !== true
    || verification.fullContinuationRemeasurement !== true
    || verification.fullSecondaryRecomputation !== true) {
    throw new Error("Discovery blocked: independent measurement verification did not pass");
  }
  return verification;
}

function discover(output, spec, specSha256) {
  requireMeasurementVerification(output, specSha256);
  const roots = requireSelection(output, specSha256);
  const measurements = roots.selected.map((_, index) => C.readJson(C.measurementPath(output, index)));
  const result = Discovery.discover(roots.selected, measurements, spec);
  result.specSha256 = specSha256;
  result.selectionHash = roots.selectionHash;
  C.writeJson(path.join(output, "discovery-result.json"), result);
  return result;
}

function technicalPipelineSmoke(spec, specSha256) {
  const games = [];
  const phases = new Set();
  for (let index = 0; index < 24 && phases.size < 2; index += 1) {
    const game = C.runGameCore(
      spec,
      specSha256,
      index,
      C.technicalSeed(index),
      60,
      true,
      0,
    );
    games.push(game);
    const candidate = C.candidateForGame(game, spec);
    if (candidate.selected) phases.add(candidate.assignedPhase);
  }
  const selection = C.selectRoots(games, spec, {
    phaseQuota: { namua: 1, mtaji: 1 },
    strictReadiness: false,
  });
  if (selection.selected.length !== 2) {
    throw new Error("Technical pipeline could not materialize one root per phase");
  }
  const measurements = selection.selected.map((root, index) => C.measureSelectedRoot(root, index, spec, {
    selectionHash: selection.selectionHash,
    replicates: 2,
    maxContinuationPlies: 6,
    stageSalt: C.TECHNICAL_CONTINUATION_SALT,
  }));
  const discovery = Discovery.discover(selection.selected, measurements, spec);
  const payload = {
    schemaVersion: 1,
    stageId: spec.stageId,
    specSha256,
    mode: "technical-pipeline-smoke",
    technicalOnly: true,
    scientificSeedConsumed: false,
    reservedScientificSeedBlocksTouched: false,
    technicalConfig: {
      conditionId: "B-D1",
      maxGamePly: 60,
      phaseQuota: { namua: 1, mtaji: 1 },
      replicates: 2,
      maxContinuationPlies: 6,
      stageSalt: C.TECHNICAL_CONTINUATION_SALT,
    },
    games,
    selection,
    measurements,
    discovery,
  };
  payload.resultHash = hashValue(payload);
  return payload;
}

function writeSingle(file, value) {
  if (!file) {
    process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
    return;
  }
  C.writeJson(file, value);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const loaded = C.loadSpec();
  if (args.phase === "status") return writeSingle(null, status(args.output, loaded.spec, loaded.specSha256));
  if (args.phase === "technical-pipeline-smoke") {
    return writeSingle(args.output, technicalPipelineSmoke(loaded.spec, loaded.specSha256));
  }
  if (args.phase === "generate") {
    const authorization = C.loadAuthorization(loaded.specSha256);
    return writeSingle(null, generate(args.output, loaded.spec, loaded.specSha256, authorization, args.force));
  }
  if (args.phase === "select") return writeSingle(null, select(args.output, loaded.spec, loaded.specSha256));
  if (args.phase === "measure") return writeSingle(null, measure(args.output, loaded.spec, loaded.specSha256, args.force));
  if (args.phase === "discover") return writeSingle(null, discover(args.output, loaded.spec, loaded.specSha256));
  throw new Error(`Unhandled phase: ${args.phase}`);
}

if (require.main === module) main();
module.exports = {
  discover,
  generate,
  measure,
  parseArgs,
  select,
  status,
  technicalPipelineSmoke,
};
