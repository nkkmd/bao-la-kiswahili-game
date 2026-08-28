#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const C = require("./lib/search-reliability-stage1-common.js");
const M = require("./lib/search-reliability-stage1-measurement.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY = path.join(ROOT, "doc/search-reliability-decision-robustness");
const SPEC_PATH = path.join(STUDY, "preregistration/STAGE_2_FORMAL_SPEC.json");
const AUTH_PATH = path.join(STUDY, "preregistration/STAGE_2_FORMAL_AUTHORIZATION.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/search-reliability-decision-robustness/stage2-formal-v1");

function shaBytes(v) { return crypto.createHash("sha256").update(v).digest("hex"); }
function read(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function write(file, v) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(v, null, 2)}\n`); }
function parseArgs(argv) {
  const out = { phase: "all", output: DEFAULT_OUTPUT, stage1Artifact: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--phase") out.phase = argv[++i];
    else if (argv[i] === "--output") out.output = path.resolve(argv[++i]);
    else if (argv[i] === "--stage1-artifact") out.stage1Artifact = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!["generate", "select", "measure", "all"].includes(out.phase)) throw new Error("--phase must be generate, select, measure, or all");
  if (!out.stage1Artifact) throw new Error("--stage1-artifact is required");
  return out;
}
function gamePath(output, index) { return path.join(output, "games", `game-${String(index).padStart(4, "0")}.json`); }

function loadContract() {
  const specBytes = fs.readFileSync(SPEC_PATH);
  const spec = JSON.parse(specBytes.toString("utf8"));
  if (!fs.existsSync(AUTH_PATH)) throw new Error("Stage 2 authorization file absent");
  const authBytes = fs.readFileSync(AUTH_PATH);
  const authorization = JSON.parse(authBytes.toString("utf8"));
  const specSha256 = shaBytes(specBytes);
  const authorizationSha256 = shaBytes(authBytes);
  if (authorization.studyId !== spec.studyId || authorization.stageId !== spec.stageId) throw new Error("Stage 2 authorization identity mismatch");
  if (authorization.specSha256 !== specSha256) throw new Error("Stage 2 spec SHA mismatch in authorization");
  if (authorization.stage2GenerationAuthorized !== true || authorization.formalInferenceAuthorized !== true) throw new Error("Stage 2 formal generation/inference not explicitly authorized");
  for (const [relative, expected] of Object.entries(authorization.sourceFileSha256 || {})) {
    const file = path.join(ROOT, relative);
    if (!fs.existsSync(file)) throw new Error(`Authorized source file missing: ${relative}`);
    const actual = shaBytes(fs.readFileSync(file));
    if (actual !== expected) throw new Error(`Authorized source hash mismatch: ${relative}: ${actual} != ${expected}`);
  }
  return { spec, specSha256, authorization, authorizationSha256 };
}

function loadStage1(stage1Artifact, spec) {
  const required = spec.stage1DevelopmentProvenance.requiredFileSha256;
  for (const [name, expected] of Object.entries(required)) {
    const file = path.join(stage1Artifact, name);
    if (!fs.existsSync(file)) throw new Error(`Required Stage 1 firewall source missing: ${name}`);
    const actual = shaBytes(fs.readFileSync(file));
    if (actual !== expected) throw new Error(`Stage 1 firewall source hash mismatch: ${name}`);
  }
  const result = read(path.join(stage1Artifact, "stage1-development-result.json"));
  const verification = read(path.join(stage1Artifact, "stage1-verification.json"));
  const selected = read(path.join(stage1Artifact, "stage1-selected-states.json"));
  if (result.stage1Decision !== "PROFILE-FROZEN-DEVELOPMENT" || result.developmentProfileHash !== spec.stage1DevelopmentProvenance.developmentProfileHash) throw new Error("Stage 1 development provenance mismatch");
  if (verification.passed !== true || verification.canonicalMeasurementHashMatches !== true) throw new Error("Corrected Stage 1 verification is not PASS");
  const historical = new Set(); const opening = new Set();
  const gamesDir = path.join(stage1Artifact, "games");
  for (const name of fs.readdirSync(gamesDir).filter((x) => x.endsWith(".json")).sort()) {
    const game = read(path.join(gamesDir, name)); historical.add(game.historicalTrajectoryHash); opening.add(game.openingPrefixHash);
  }
  const raw = new Set(selected.selected.map((x) => x.rawStateKey));
  return { historical, opening, raw, selectedCount: selected.selected.length };
}

function generate(output, contract) {
  const { spec, specSha256, authorizationSha256 } = contract;
  fs.mkdirSync(path.join(output, "games"), { recursive: true });
  const core = [];
  for (let index = 0; index < spec.population.games; index += 1) {
    const seed = spec.population.seedStart + index;
    const file = gamePath(output, index);
    let trajectory;
    if (fs.existsSync(file)) {
      trajectory = read(file);
      if (trajectory.seed !== seed || trajectory.specSha256 !== specSha256 || trajectory.stageId !== spec.stageId) throw new Error(`Existing Stage 2 trajectory identity conflict: ${file}`);
    } else {
      trajectory = C.generateTrajectory(seed, spec);
      trajectory.gameId = `SRDR-S2-G${seed}`;
      trajectory = { schemaVersion: 1, studyId: spec.studyId, stageId: spec.stageId, specSha256, scientificSeedConsumed: true, ...trajectory };
      write(file, trajectory);
    }
    core.push({ seed: trajectory.seed, gameId: trajectory.gameId, historicalTrajectoryHash: trajectory.historicalTrajectoryHash, openingPrefixHash: trajectory.openingPrefixHash, terminal: trajectory.terminal, terminalPly: trajectory.terminalPly });
    if ((index + 1) % 64 === 0 || index + 1 === spec.population.games) process.stderr.write(`[generate-stage2] ${index + 1}/${spec.population.games}\n`);
  }
  const manifest = {
    schemaVersion: 1, programLabel: spec.programLabel, researchGeneration: spec.researchGeneration,
    studyId: spec.studyId, stageId: spec.stageId, specSha256, authorizationSha256,
    formalInferenceAuthorized: true, stage2GenerationAuthorized: true,
    games: spec.population.games, seedStart: spec.population.seedStart, seedEnd: spec.population.seedEnd,
    trajectoryManifestHash: C.sha256(C.stableStringify(core)),
    stage1FirewallArtifactZipSha256: spec.stage1DevelopmentProvenance.canonicalArtifactZipSha256,
  };
  write(path.join(output, "stage2-generation-manifest.json"), manifest);
  return manifest;
}
function readGames(output, spec) { return Array.from({ length: spec.population.games }, (_, i) => read(gamePath(output, i))); }

function select(output, contract, stage1) {
  const { spec, specSha256, authorizationSha256 } = contract;
  const games = readGames(output, spec);
  let historicalOverlapExcluded = 0; let openingOverlapExcluded = 0; let eitherExcluded = 0;
  const kept = [];
  for (const game of games) {
    const h = stage1.historical.has(game.historicalTrajectoryHash);
    const o = stage1.opening.has(game.openingPrefixHash);
    if (h) historicalOverlapExcluded += 1;
    if (o) openingOverlapExcluded += 1;
    if (h || o) { eitherExcluded += 1; continue; }
    kept.push(game);
  }
  const base = C.selectStates(kept, spec);
  const rawFiltered = base.selected.filter((row) => !stage1.raw.has(row.rawStateKey));
  const stage1RawOverlapExcluded = base.selected.length - rawFiltered.length;
  const finalSelected = rawFiltered;
  const selectionCore = finalSelected.map(({ state, ...row }) => ({ ...row, state: C.rawStateObject(state) }));
  const selectionHash = C.sha256(C.stableStringify(selectionCore));
  const audit = {
    generatedTrajectories: games.length,
    stage1HistoricalTrajectoryOverlapExcluded: historicalOverlapExcluded,
    stage1OpeningPrefixOverlapExcluded: openingOverlapExcluded,
    stage1TrajectoryOrOpeningOverlapExcluded: eitherExcluded,
    trajectoriesAfterStage1TrajectoryOpeningFirewall: kept.length,
    uniqueHistoricalTrajectoriesAfterStage1Firewall: base.audit.uniqueHistoricalTrajectories,
    duplicateHistoricalTrajectoriesCollapsed: base.audit.duplicateHistoricalTrajectoriesCollapsed,
    distinctOpeningPrefixesAfterStage1Firewall: base.audit.distinctOpeningPrefixes,
    unavailableAssignedPhase: base.audit.unavailableAssignedPhase,
    preliminarySelectedStates: base.audit.preliminarySelectedStates,
    duplicateSelectedRawStatesCollapsed: base.audit.duplicateSelectedRawStatesCollapsed,
    stage1SelectedRawStateOverlapExcluded: stage1RawOverlapExcluded,
    selectedUniqueRawStates: finalSelected.length,
    phaseCounts: {
      namua: finalSelected.filter((x) => x.phase === "namua").length,
      mtaji: finalSelected.filter((x) => x.phase === "mtaji").length,
    },
    postFirewallOverlapCounts: {
      historicalTrajectory: new Set(kept.filter((g) => stage1.historical.has(g.historicalTrajectoryHash)).map((g) => g.historicalTrajectoryHash)).size,
      openingPrefix: new Set(kept.filter((g) => stage1.opening.has(g.openingPrefixHash)).map((g) => g.openingPrefixHash)).size,
      selectedRawState: finalSelected.filter((x) => stage1.raw.has(x.rawStateKey)).length,
    }
  };
  const doc = {
    schemaVersion: 1, programLabel: spec.programLabel, researchGeneration: spec.researchGeneration,
    studyId: spec.studyId, stageId: spec.stageId, specSha256, authorizationSha256,
    formalInferenceAuthorized: true, confirmatoryReuseAllowed: false,
    audit, selectionHash, selected: finalSelected.map((row) => ({ ...row, state: C.cloneJson(row.state) }))
  };
  write(path.join(output, "stage2-selected-states.json"), doc);
  return doc;
}

function measure(output, contract) {
  const { spec, specSha256, authorizationSha256 } = contract;
  const selection = read(path.join(output, "stage2-selected-states.json"));
  const rows = [];
  for (let i = 0; i < selection.selected.length; i += 1) {
    rows.push(M.measureState(selection.selected[i], spec));
    if ((i + 1) % 32 === 0 || i + 1 === selection.selected.length) process.stderr.write(`[measure-stage2] ${i + 1}/${selection.selected.length}\n`);
  }
  const canonicalCore = JSON.parse(JSON.stringify(C.measurementCore(rows)));
  const measurementHash = C.sha256(C.stableStringify(canonicalCore));
  const doc = {
    schemaVersion: 1, programLabel: spec.programLabel, researchGeneration: spec.researchGeneration,
    studyId: spec.studyId, stageId: spec.stageId, specSha256, authorizationSha256,
    formalInferenceAuthorized: true, confirmatoryReuseAllowed: false,
    selectionHash: selection.selectionHash, measurementHash,
    measurementHashSemantics: "json-roundtrip-canonical-measurement-core/v1",
    selectedUniqueRawStates: rows.length,
    phaseCounts: { namua: rows.filter((x) => x.phase === "namua").length, mtaji: rows.filter((x) => x.phase === "mtaji").length },
    rows
  };
  write(path.join(output, "stage2-measurements.json"), doc);
  return doc;
}

function main() {
  const options = parseArgs(process.argv.slice(2)); const contract = loadContract(); const stage1 = loadStage1(options.stage1Artifact, contract.spec);
  fs.mkdirSync(options.output, { recursive: true });
  let generation = null; let selection = null; let measurement = null;
  if (["generate", "all"].includes(options.phase)) generation = generate(options.output, contract);
  if (["select", "all"].includes(options.phase)) selection = select(options.output, contract, stage1);
  if (["measure", "all"].includes(options.phase)) measurement = measure(options.output, contract);
  console.log(JSON.stringify({ passed: true, stageId: contract.spec.stageId, phase: options.phase,
    ...(generation ? { generationManifest: generation } : {}),
    ...(selection ? { selectionAudit: selection.audit, selectionHash: selection.selectionHash } : {}),
    ...(measurement ? { measurementHash: measurement.measurementHash, selectedUniqueRawStates: measurement.selectedUniqueRawStates } : {}) }, null, 2));
}

try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
