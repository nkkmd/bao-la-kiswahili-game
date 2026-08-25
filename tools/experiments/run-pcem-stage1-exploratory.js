#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { performance } = require("node:perf_hooks");

const Validator = require("./validate-pcem-stage1-spec.js");
const Corpus = require("./lib/practical-comeback-stage1-corpus.js");
const Measurement = require("./lib/practical-comeback-stage1-measurement.js");
const Discovery = require("./lib/practical-comeback-stage1-discovery.js");
const P = require("./lib/practical-comeback-stage0-production.js");

const ROOT = Validator.ROOT;
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/practical-comeback-error-inducing-moves/stage1-exploratory-v1");
const SOURCE_FILES = Object.freeze([
  "public/engine.js",
  "public/ai.js",
  "public/ai-weights.js",
  "tools/experiments/lib/ssgtc-representation-production.js",
  "tools/experiments/lib/practical-comeback-stage0-production.js",
  "tools/experiments/lib/practical-comeback-stage1-corpus.js",
  "tools/experiments/lib/practical-comeback-stage1-measurement.js",
  "tools/experiments/lib/practical-comeback-stage1-discovery.js",
  "tools/experiments/validate-pcem-stage1-spec.js",
  "tools/experiments/run-pcem-stage1-exploratory.js",
  "doc/practical-comeback-error-inducing-moves/preregistration/STAGE_1_EXPLORATORY_SPEC.json",
  "doc/practical-comeback-error-inducing-moves/preregistration/STAGE_1_FEATURE_DEFINITIONS.json"
]);

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function fileHashes() { return Object.fromEntries(SOURCE_FILES.map((file) => [file, sha256(fs.readFileSync(path.join(ROOT, file)))])); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive:true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function git(args, fallback = null) { try { return execFileSync("git", args, { cwd:ROOT, encoding:"utf8", stdio:["ignore","pipe","ignore"] }).trim(); } catch { return fallback; } }
function parseArgs(argv) { const i = argv.indexOf("--out"); return { out: i >= 0 ? path.resolve(argv[i + 1]) : DEFAULT_OUTPUT }; }
function elapsedSeconds(start) { return (performance.now() - start) / 1000; }
function directoryBytes(dir) { let total = 0; if (!fs.existsSync(dir)) return 0; for (const entry of fs.readdirSync(dir, { withFileTypes:true })) { const p = path.join(dir, entry.name); total += entry.isDirectory() ? directoryBytes(p) : fs.statSync(p).size; } return total; }

function loadAuthorization(loaded) {
  if (!fs.existsSync(Validator.AUTH_PATH)) throw new Error("Stage 1 generation blocked: authorization file absent");
  const text = fs.readFileSync(Validator.AUTH_PATH, "utf8");
  const auth = JSON.parse(text);
  if (auth.schemaVersion !== 1 || auth.studyId !== loaded.spec.studyId || auth.stageId !== loaded.spec.stageId
    || auth.stage1GenerationAuthorized !== true || auth.scientificInferenceAuthorized !== false
    || auth.confirmatoryReuseAllowed !== false || auth.specSha256 !== loaded.specSha256
    || auth.featureDefinitionsSha256 !== loaded.featureSha256) {
    throw new Error("Stage 1 authorization semantics/hash binding invalid");
  }
  const actual = fileHashes();
  if (JSON.stringify(auth.authorizedSourceFileSha256) !== JSON.stringify(actual)) throw new Error("Stage 1 authorization source hashes mismatch");
  return { auth, authorizationSha256: sha256(text), sourceFileSha256: actual };
}

function compactSelected(item) {
  return {
    historicalTrajectoryHash:item.historicalTrajectoryHash, ruleTrajectoryHash:item.ruleTrajectoryHash,
    openingPrefixHash:item.openingPrefixHash, seed:item.seed, gameIndex:item.gameIndex, conditionId:item.conditionId,
    assignedPhase:item.assignedPhase, ply:item.ply, rawStateKey:item.rawStateKey, historicalStateHash:item.historicalStateHash,
    selectionRank:item.selectionRank, quotaRank:item.quotaRank,
    referenceDisadvantageBestScore:item.referenceDisadvantageBestScore, referenceDisadvantageTableHash:item.referenceDisadvantageTableHash,
    state:item.state,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  fs.rmSync(args.out, { recursive:true, force:true }); fs.mkdirSync(args.out, { recursive:true });
  const start = performance.now();
  const loaded = Validator.loadValidated();
  const authorization = loadAuthorization(loaded);
  const spec = loaded.spec;
  const provenance = {
    sourceCommit: git(["rev-parse","HEAD"]), sourceTreeDirty: Boolean(git(["status","--porcelain","--", ...SOURCE_FILES], "")),
    sourceFileSha256: authorization.sourceFileSha256, specSha256: loaded.specSha256, featureDefinitionsSha256: loaded.featureSha256,
    authorizationSha256: authorization.authorizationSha256, node:process.version, platform:process.platform, arch:process.arch,
  };
  if (provenance.sourceTreeDirty) throw new Error("Scientific source tree is dirty");

  const records = [];
  for (let gameIndex = 0; gameIndex < spec.population.games; gameIndex += 1) {
    records.push(Corpus.runGame(spec, gameIndex));
    if ((gameIndex + 1) % 128 === 0) process.stdout.write(`PCEM Stage1 source games ${gameIndex + 1}/${spec.population.games}\n`);
    if (elapsedSeconds(start) > spec.resourceCaps.maximumWallClockSecondsPerWorkflowJob) {
      const censored = { schemaVersion:1, stageId:spec.stageId, scientificLabel:"RESOURCE-CENSORED", reason:"wall-clock-during-source-generation", generatedGames:records.length, provenance };
      writeJson(path.join(args.out, "stage1-result.json"), censored); process.stdout.write(`${JSON.stringify(censored,null,2)}\n`); return;
    }
  }
  const gameSummaries = records.map((r) => r.gameSummary);
  writeJson(path.join(args.out, "source-summary.json"), { schemaVersion:1, stageId:spec.stageId, games:gameSummaries, sourceSummaryHash:P.canonicalHash(gameSummaries) });

  const selection = Corpus.selectRoots(records, spec);
  writeJson(path.join(args.out, "selection.json"), { ...selection, selected:selection.selected.map(compactSelected) });
  if (!selection.passed) {
    const result = { schemaVersion:1, stageId:spec.stageId, scientificLabel:"NON-ESTIMABLE", reason:"selection-readiness-gate-failure", generatedGames:records.length, selection:{ ...selection, selected:undefined }, provenance };
    writeJson(path.join(args.out, "stage1-result.json"), result); process.stdout.write(`${JSON.stringify(result,null,2)}\n`); return;
  }

  const plannedInterventions = selection.selected.reduce((sum, item) => sum + P.exactLegalMoves(item.state).length, 0);
  const plannedContinuationRows = plannedInterventions * (spec.continuation.primaryOpponentPolicy.replicatesPerExactRootMove + spec.continuation.secondaryOpponentPolicy.replicatesPerExactRootMove + spec.continuation.referenceOpponentPolicy.replicatesPerExactRootMove);
  if (plannedInterventions > spec.resourceCaps.maximumExactRootMoveInterventions || plannedContinuationRows > spec.resourceCaps.maximumPlannedContinuationRows) {
    const result = { schemaVersion:1, stageId:spec.stageId, scientificLabel:"RESOURCE-CENSORED", reason:"pre-measurement-intervention-cap", plannedInterventions, plannedContinuationRows, provenance };
    writeJson(path.join(args.out, "stage1-result.json"), result); process.stdout.write(`${JSON.stringify(result,null,2)}\n`); return;
  }

  const measurements = [];
  let resourceCensored = false;
  for (let i = 0; i < selection.selected.length; i += 1) {
    measurements.push(Measurement.measureRoot(selection.selected[i], i, spec));
    if ((i + 1) % 10 === 0) process.stdout.write(`PCEM Stage1 measured roots ${i + 1}/${selection.selected.length}\n`);
    if (elapsedSeconds(start) > spec.resourceCaps.maximumWallClockSecondsPerWorkflowJob || process.resourceUsage().maxRSS / 1024 > spec.resourceCaps.maximumRSSMiB) { resourceCensored = true; break; }
  }
  writeJson(path.join(args.out, "measurements.json"), { schemaVersion:1, stageId:spec.stageId, measurements, measurementSetHash:P.canonicalHash(measurements.map((m) => m.measurementHash)) });
  if (resourceCensored || measurements.length !== selection.selected.length) {
    const result = { schemaVersion:1, stageId:spec.stageId, scientificLabel:"RESOURCE-CENSORED", reason:"measurement-resource-cap", measuredRoots:measurements.length, plannedRoots:selection.selected.length, provenance };
    writeJson(path.join(args.out, "stage1-result.json"), result); process.stdout.write(`${JSON.stringify(result,null,2)}\n`); return;
  }

  const account = Measurement.accounting(measurements);
  const readiness = {
    exactRootMoveInterventionsWithinCap: account.interventions <= spec.readinessGates.maximumExactRootMoveInterventions,
    allReferenceTablesFinite: measurements.every((root) => Number.isFinite(root.referenceSearch.bestScore) && root.moves.every((move) => Number.isFinite(move.d3ReferenceScore))),
    allPrimaryContinuationRowsAccounted: measurements.every((root) => root.moves.every((move) => move.continuation.primary.records.length === spec.continuation.primaryOpponentPolicy.replicatesPerExactRootMove)),
    totalContinuationRowsWithinPlan: account.totalContinuationRows <= spec.resourceCaps.maximumPlannedContinuationRows,
  };
  const readyForDiscovery = Object.values(readiness).every(Boolean);
  if (!readyForDiscovery) {
    const result = { schemaVersion:1, stageId:spec.stageId, scientificLabel:"NON-ESTIMABLE", reason:"measurement-readiness-gate-failure", readiness, accounting:account, provenance };
    writeJson(path.join(args.out, "stage1-result.json"), result); process.stdout.write(`${JSON.stringify(result,null,2)}\n`); return;
  }

  const discovery = Discovery.discover(measurements, spec);
  writeJson(path.join(args.out, "discovery.json"), discovery);
  const artifactBytes = directoryBytes(args.out);
  if (artifactBytes > spec.resourceCaps.maximumUncompressedArtifactBytes) {
    const result = { schemaVersion:1, stageId:spec.stageId, scientificLabel:"RESOURCE-CENSORED", reason:"artifact-size-cap", artifactBytes, provenance };
    writeJson(path.join(args.out, "stage1-result.json"), result); process.stdout.write(`${JSON.stringify(result,null,2)}\n`); return;
  }
  const result = {
    schemaVersion:1, studyId:spec.studyId, stageId:spec.stageId, scientificLabel:"EXPLORATORY-ONLY",
    scientificInferenceAuthorized:false, confirmatoryReuseAllowed:false,
    generatedGames:records.length, uniqueHistoricalTrajectories:selection.uniqueHistoricalTrajectories,
    selectedRoots:selection.selected.length, phaseCounts:selection.phaseCounts, selectionHash:selection.selectionHash,
    accounting:account, readiness, candidateAuditCount:discovery.candidateAuditCount,
    candidatesPassingPromotionGates:discovery.candidatesPassingPromotionGates,
    supportEquivalenceRepresentativeCount:discovery.supportEquivalenceRepresentativeCount,
    promotedCandidateCount:discovery.promotedCandidateCount, promotedCandidates:discovery.promotedCandidates,
    discoveryHash:discovery.discoveryHash, zeroPromotedCandidatesAllowed:true, manualPromotionPerformed:false,
    resource:{elapsedSeconds:elapsedSeconds(start),maxRSSMiB:process.resourceUsage().maxRSS/1024,artifactBytes}, provenance,
  };
  result.resultHash = P.canonicalHash(result);
  writeJson(path.join(args.out, "stage1-result.json"), result);
  process.stdout.write(`${JSON.stringify(result,null,2)}\n`);
}

try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }

module.exports = { SOURCE_FILES, fileHashes, loadAuthorization };
