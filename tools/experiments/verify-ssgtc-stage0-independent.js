#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const indep = require("./lib/ssgtc-representation-independent.js");

const STUDY_ID = "SSGTC-STUDY1";
const BASELINE_MAIN = "9e5cd1a4f48114bb0a8f13a8a58eb7a117cb5901";
const MAX_DEPTH = 2;
const OUT_DIR = process.env.SSGTC_STAGE0_OUT
  ? path.resolve(process.env.SSGTC_STAGE0_OUT)
  : path.resolve(__dirname, "../../artifacts/local/state-space-game-tree-complexity/stage0-technical-v1");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function withoutRowHash(row) {
  const copy = { ...row };
  delete copy.rowSha256;
  return copy;
}

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(OUT_DIR, name), "utf8"));
}

function main() {
  const raw = readJson("scientific-raw.json");
  const reporting = readJson("repository-facing-reporting.json");
  const productionVerification = readJson("verification.json");

  ensure(raw.studyId === STUDY_ID, "unexpected study id");
  ensure(raw.baselineMain === BASELINE_MAIN, "unexpected baseline main");
  ensure(raw.protocol && raw.protocol.maxDepth === MAX_DEPTH, "unexpected max depth");
  ensure(raw.protocol.symmetryReduction === false, "symmetry reduction must be false");
  ensure(raw.protocol.scientificInference === false, "Stage 0 scientific inference must be false");

  const stateByKey = new Map();
  for (const row of raw.states) {
    indep.assertStudyState(row.rawState);
    ensure(indep.seedCount(row.rawState) === 64, "state seed conservation failure");
    const key = indep.key(row.rawState);
    ensure(key === row.stateKey, "stored state key mismatch");
    ensure(!stateByKey.has(key), "duplicate state row");
    const rowHash = indep.sha256(indep.canonical(withoutRowHash(row)));
    ensure(rowHash === row.rowSha256, "state row hash mismatch");
    ensure(Number.isInteger(row.minDepth) && row.minDepth >= 0 && row.minDepth <= MAX_DEPTH, "invalid state minDepth");
    stateByKey.set(key, row);
  }

  const stateKeys = Array.from(stateByKey.keys()).sort();
  const stateSetSha256 = indep.sha256(stateKeys.join("\n"));
  ensure(stateSetSha256 === raw.hashes.stateSetSha256, "state-set hash mismatch");
  ensure(raw.counts.uniqueRawStates === stateByKey.size, "unique-state count mismatch");

  const roots = raw.states.filter((row) => row.minDepth === 0);
  ensure(roots.length === 1, "Stage 0 must have exactly one depth-0 root");
  const rootKey = roots[0].stateKey;

  const adjacency = new Map(stateKeys.map((key) => [key, []]));
  const indegree = new Map(stateKeys.map((key) => [key, 0]));
  const transitionLines = [];

  for (const row of raw.transitions) {
    ensure(stateByKey.has(row.parentKey), "unknown transition parent");
    ensure(stateByKey.has(row.childKey), "unknown transition child");
    ensure(indep.moveIdentity(row.move) === row.moveKey, "move identity mismatch");
    const rowHash = indep.sha256(indep.canonical(withoutRowHash(row)));
    ensure(rowHash === row.rowSha256, "transition row hash mismatch");
    ensure(Number.isInteger(row.parentDepth) && Number.isInteger(row.childDepth), "invalid transition depths");
    ensure(row.childDepth === row.parentDepth + 1, "transition depth step mismatch");
    ensure(row.parentDepth >= 0 && row.childDepth <= MAX_DEPTH, "transition outside frozen depth");
    transitionLines.push(`${row.parentKey}|${row.moveKey}|${row.childKey}`);
    adjacency.get(row.parentKey).push(row.childKey);
    indegree.set(row.childKey, indegree.get(row.childKey) + 1);
  }

  const transitionSetSha256 = indep.sha256(transitionLines.slice().sort().join("\n"));
  ensure(transitionSetSha256 === raw.hashes.transitionSetSha256, "transition-set hash mismatch");
  ensure(raw.counts.transitionRows === raw.transitions.length, "transition row count mismatch");
  ensure(raw.counts.generatedSuccessorOccurrences === raw.transitions.length, "generated-node occurrence count mismatch");

  const discoveredDepth = new Map([[rootKey, 0]]);
  const queue = [rootKey];
  while (queue.length) {
    const parent = queue.shift();
    const depth = discoveredDepth.get(parent);
    if (depth >= MAX_DEPTH) continue;
    for (const child of adjacency.get(parent)) {
      if (!discoveredDepth.has(child)) {
        discoveredDepth.set(child, depth + 1);
        queue.push(child);
      }
    }
  }
  ensure(discoveredDepth.size === stateByKey.size, "raw artifact contains unreachable state row");
  for (const [key, row] of stateByKey) {
    ensure(discoveredDepth.get(key) === row.minDepth, "stored minDepth disagrees with independent BFS reconstruction");
  }

  const independentlyDerivedDuplicateEncounters = raw.transitions.length - (raw.states.length - 1);
  ensure(independentlyDerivedDuplicateEncounters >= 0, "impossible duplicate count");
  ensure(raw.counts.duplicateEncounters === independentlyDerivedDuplicateEncounters, "duplicate encounter count mismatch");

  ensure(reporting.studyId === STUDY_ID, "reporting study id mismatch");
  ensure(reporting.scientificInference === false, "reporting scientific inference must be false");
  ensure(reporting.hashes.stateSetSha256 === stateSetSha256, "reporting state hash mismatch");
  ensure(reporting.hashes.transitionSetSha256 === transitionSetSha256, "reporting transition hash mismatch");
  ensure(reporting.states.length === raw.states.length, "reporting state count mismatch");
  for (const row of reporting.states) {
    const source = stateByKey.get(row.stateKey);
    ensure(source, "reporting row references unknown raw key");
    ensure(row.minDepth === source.minDepth, "reporting depth mismatch");
    ensure(row.phase === source.rawState.phase, "reporting phase mismatch");
    ensure(row.player === source.rawState.player, "reporting player mismatch");
    ensure(row.winner === source.rawState.winner, "reporting winner mismatch");
    ensure(row.representedSeeds === 64, "reporting seed count mismatch");
  }

  ensure(productionVerification.studyId === STUDY_ID, "production verification study id mismatch");
  ensure(productionVerification.passed === true, "production Stage 0 verification did not pass");
  ensure(productionVerification.decision === "SSGTC-STAGE0-PASS", "production Stage 0 decision mismatch");
  ensure(productionVerification.diagnosticOnly.stateSetSha256 === stateSetSha256, "production/independent state hash mismatch");
  ensure(productionVerification.diagnosticOnly.transitionSetSha256 === transitionSetSha256, "production/independent transition hash mismatch");

  const multiParentStates = Array.from(indegree.values()).filter((value) => value >= 2).length;
  const result = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stage: "stage0-technical-v1-independent-verification",
    scientificInferenceAuthorized: false,
    passed: true,
    checks: {
      rawStateRows: raw.states.length,
      transitionRows: raw.transitions.length,
      independentlyDerivedDuplicateEncounters,
      multiParentStates,
      stateSetSha256,
      transitionSetSha256,
      reachableRows: discoveredDepth.size,
      maxDepth: MAX_DEPTH,
    },
    independence: {
      importsProductionSerializer: false,
      importsProductionExpander: false,
      reconstructsFromMaterializedRawArtifact: true,
    },
  };

  fs.writeFileSync(path.join(OUT_DIR, "independent-verification.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
