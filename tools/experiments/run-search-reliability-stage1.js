#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const C = require("./lib/search-reliability-stage1-common.js");
const M = require("./lib/search-reliability-stage1-measurement.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY_DIR = path.join(ROOT, "doc/search-reliability-decision-robustness");
const SPEC_PATH = path.join(STUDY_DIR, "preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const AUTH_PATH = path.join(STUDY_DIR, "preregistration/STAGE_1_DEVELOPMENT_AUTHORIZATION.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/search-reliability-decision-robustness/stage1-development-v1");

function parseArgs(argv) {
  const out = { phase: "all", output: DEFAULT_OUTPUT };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--phase") out.phase = argv[++i];
    else if (argv[i] === "--output") out.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!["generate", "select", "measure", "all"].includes(out.phase)) throw new Error("--phase must be generate, select, measure, or all");
  return out;
}

function sha256Bytes(buffer) { return crypto.createHash("sha256").update(buffer).digest("hex"); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); }

function loadContract() {
  const specBytes = fs.readFileSync(SPEC_PATH);
  const spec = JSON.parse(specBytes.toString("utf8"));
  if (!fs.existsSync(AUTH_PATH)) throw new Error("Stage 1 authorization file is absent; scientific generation is not authorized");
  const authBytes = fs.readFileSync(AUTH_PATH);
  const authorization = JSON.parse(authBytes.toString("utf8"));
  const specSha256 = sha256Bytes(specBytes);
  const authorizationSha256 = sha256Bytes(authBytes);
  if (authorization.studyId !== spec.studyId || authorization.stageId !== spec.stageId) throw new Error("Stage 1 authorization identity mismatch");
  if (authorization.specSha256 !== specSha256) throw new Error("Stage 1 spec SHA mismatch in authorization");
  if (authorization.stage1GenerationAuthorized !== true) throw new Error("Stage 1 scientific generation is not explicitly authorized");
  if (authorization.developmentCharacterizationAuthorized !== true) throw new Error("Stage 1 development characterization is not authorized");
  if (authorization.formalConfirmationClaimAuthorized !== false || authorization.stage2GenerationAuthorized !== false) throw new Error("Stage 1 authorization boundary violated");
  for (const [relative, expected] of Object.entries(authorization.sourceFileSha256 || {})) {
    const file = path.join(ROOT, relative);
    if (!fs.existsSync(file)) throw new Error(`Authorized source file missing: ${relative}`);
    const actual = sha256Bytes(fs.readFileSync(file));
    if (actual !== expected) throw new Error(`Authorized source hash mismatch: ${relative}: ${actual} != ${expected}`);
  }
  return { spec, specSha256, authorization, authorizationSha256 };
}

function generationPath(output, index) { return path.join(output, "games", `game-${String(index).padStart(4, "0")}.json`); }

function generate(output, contract) {
  const { spec, specSha256, authorizationSha256 } = contract;
  fs.mkdirSync(path.join(output, "games"), { recursive: true });
  const trajectoryCore = [];
  for (let index = 0; index < spec.population.games; index += 1) {
    const seed = spec.population.seedStart + index;
    const file = generationPath(output, index);
    let trajectory;
    if (fs.existsSync(file)) {
      trajectory = readJson(file);
      if (trajectory.seed !== seed || trajectory.specSha256 !== specSha256 || trajectory.stageId !== spec.stageId) throw new Error(`Existing generated trajectory conflicts with frozen Stage 1 identity: ${file}`);
    } else {
      trajectory = C.generateTrajectory(seed, spec);
      trajectory = { schemaVersion: 1, studyId: spec.studyId, stageId: spec.stageId, specSha256, scientificSeedConsumed: true, ...trajectory };
      writeJson(file, trajectory);
    }
    trajectoryCore.push({ seed: trajectory.seed, gameId: trajectory.gameId, historicalTrajectoryHash: trajectory.historicalTrajectoryHash, openingPrefixHash: trajectory.openingPrefixHash, terminal: trajectory.terminal, terminalPly: trajectory.terminalPly });
    if ((index + 1) % 64 === 0 || index + 1 === spec.population.games) process.stderr.write(`[generate] ${index + 1}/${spec.population.games}\n`);
  }
  const manifest = {
    schemaVersion: 1, programLabel: spec.programLabel, researchGeneration: spec.researchGeneration,
    studyId: spec.studyId, stageId: spec.stageId, specSha256, authorizationSha256,
    scientificInferenceAuthorized: false, developmentCharacterizationAuthorized: true,
    confirmatoryReuseAllowed: false, stage2GenerationAuthorized: false,
    games: spec.population.games, seedStart: spec.population.seedStart, seedEnd: spec.population.seedEnd,
    trajectoryManifestHash: C.sha256(C.stableStringify(trajectoryCore)),
  };
  writeJson(path.join(output, "stage1-generation-manifest.json"), manifest);
  return manifest;
}

function readGames(output, spec) {
  return Array.from({ length: spec.population.games }, (_, index) => {
    const file = generationPath(output, index);
    if (!fs.existsSync(file)) throw new Error(`Missing generated Stage 1 game: ${file}`);
    return readJson(file);
  });
}

function select(output, contract) {
  const { spec, specSha256, authorizationSha256 } = contract;
  const selected = C.selectStates(readGames(output, spec), spec);
  const document = {
    schemaVersion: 1, programLabel: spec.programLabel, researchGeneration: spec.researchGeneration,
    studyId: spec.studyId, stageId: spec.stageId, specSha256, authorizationSha256,
    scientificInferenceAuthorized: false, developmentCharacterizationAuthorized: true,
    confirmatoryReuseAllowed: false, audit: selected.audit, selectionHash: selected.selectionHash,
    selected: selected.selected.map((row) => ({ ...row, state: C.cloneJson(row.state) })),
  };
  writeJson(path.join(output, "stage1-selected-states.json"), document);
  return document;
}

function measure(output, contract) {
  const { spec, specSha256, authorizationSha256 } = contract;
  const selectedDoc = readJson(path.join(output, "stage1-selected-states.json"));
  if (selectedDoc.specSha256 !== specSha256 || selectedDoc.stageId !== spec.stageId) throw new Error("Selected-state artifact identity mismatch");
  const rows = [];
  for (let index = 0; index < selectedDoc.selected.length; index += 1) {
    rows.push(M.measureState(selectedDoc.selected[index], spec));
    if ((index + 1) % 32 === 0 || index + 1 === selectedDoc.selected.length) process.stderr.write(`[measure] ${index + 1}/${selectedDoc.selected.length}\n`);
  }
  const measurementHash = C.sha256(C.stableStringify(C.measurementCore(rows)));
  const document = {
    schemaVersion: 1, programLabel: spec.programLabel, researchGeneration: spec.researchGeneration,
    studyId: spec.studyId, stageId: spec.stageId, specSha256, authorizationSha256,
    scientificInferenceAuthorized: false, developmentCharacterizationAuthorized: true,
    formalConfirmationClaimAuthorized: false, confirmatoryReuseAllowed: false, stage2GenerationAuthorized: false,
    selectionHash: selectedDoc.selectionHash, measurementHash, selectedUniqueRawStates: rows.length,
    phaseCounts: { namua: rows.filter((x) => x.phase === "namua").length, mtaji: rows.filter((x) => x.phase === "mtaji").length },
    rows,
  };
  writeJson(path.join(output, "stage1-measurements.json"), document);
  return document;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const contract = loadContract();
  fs.mkdirSync(options.output, { recursive: true });
  let generation = null; let selection = null; let measurement = null;
  if (["generate", "all"].includes(options.phase)) generation = generate(options.output, contract);
  if (["select", "all"].includes(options.phase)) selection = select(options.output, contract);
  if (["measure", "all"].includes(options.phase)) measurement = measure(options.output, contract);
  console.log(JSON.stringify({ passed: true, stageId: contract.spec.stageId, phase: options.phase, output: options.output,
    ...(generation ? { generationManifest: generation } : {}),
    ...(selection ? { selectionAudit: selection.audit, selectionHash: selection.selectionHash } : {}),
    ...(measurement ? { measurementHash: measurement.measurementHash, selectedUniqueRawStates: measurement.selectedUniqueRawStates } : {}) }, null, 2));
}

try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
