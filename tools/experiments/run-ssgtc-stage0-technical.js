#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const engine = require("../../public/engine.js");
const prod = require("./lib/ssgtc-representation-production.js");
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

function normalizeMove(move) {
  const out = {};
  for (const field of ["type", "phase", "row", "index", "direction", "side", "houseChoice"]) {
    if (move[field] !== undefined) out[field] = move[field];
  }
  if (move.houseTwo === true) out.houseTwo = true;
  return out;
}

function hashCanonical(value) {
  return prod.sha256Text(prod.stableStringify(value));
}

function withoutRowHash(row) {
  const copy = { ...row };
  delete copy.rowSha256;
  return copy;
}

function rowWithHash(row) {
  return { ...row, rowSha256: hashCanonical(row) };
}

function datasetHash(lines) {
  return prod.sha256Text(lines.slice().sort().join("\n"));
}

function buildIdentitySensitivityFixtures(root) {
  const fixtures = {};

  const pits = prod.clone(root);
  pits.pits[0][0][4] -= 1;
  pits.pending[0] += 1;
  fixtures.pits = pits;

  const reserve = prod.clone(root);
  reserve.reserve[0] -= 1;
  reserve.pending[0] += 1;
  fixtures.reserve = reserve;

  const houseOwned = prod.clone(root);
  houseOwned.houseOwned[0] = !houseOwned.houseOwned[0];
  fixtures.houseOwned = houseOwned;

  const player = prod.clone(root);
  player.player = 1;
  fixtures.player = player;

  const phase = prod.clone(root);
  phase.phase = "mtaji";
  fixtures.phase = phase;

  const winner = prod.clone(root);
  winner.winner = 0;
  fixtures.winner = winner;

  const pending = prod.clone(root);
  pending.reserve[0] -= 1;
  pending.pending[0] += 1;
  fixtures.pending = pending;

  return fixtures;
}

function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const gates = {};
  let engineEntryCalls = 0;
  function guardedMoveVariants(state) {
    prod.assertStudyState(state);
    engineEntryCalls += 1;
    return engine.moveVariants(state);
  }
  function guardedApplyMove(state, move) {
    prod.assertStudyState(state);
    engineEntryCalls += 1;
    const result = engine.applyMove(state, move);
    prod.assertStudyState(result.state);
    return result;
  }

  const root = engine.initialState();
  prod.assertStudyState(root);
  indep.assertStudyState(root);
  gates["S0-G1"] = true;
  gates["S0-G2"] = prod.representedSeeds(root) === 64 && indep.seedCount(root) === 64;
  ensure(gates["S0-G2"], "root seed conservation failed");

  const missingPending = prod.clone(root);
  delete missingPending.pending;
  const beforeMissing = engineEntryCalls;
  let productionMissingRejected = false;
  let independentMissingRejected = false;
  try { guardedMoveVariants(missingPending); } catch (error) { productionMissingRejected = /pending/.test(error.message); }
  try { indep.assertStudyState(missingPending); } catch (error) { independentMissingRejected = /pending/.test(error.message); }
  gates["S0-G4"] = productionMissingRejected && independentMissingRejected && engineEntryCalls === beforeMissing;
  ensure(gates["S0-G4"], "missing pending was not rejected before engine entry");

  const rootProdKey = prod.stateKey(root);
  const rootIndKey = indep.key(root);
  gates["S0-G3"] = rootProdKey === rootIndKey;
  ensure(gates["S0-G3"], "production/independent root key mismatch");

  const metadataVariant = prod.clone(root);
  metadataVariant.turn = 987654;
  metadataVariant.reason = "excluded-metadata-probe";
  const deterministic = prod.stateKey(root) === prod.stateKey(root)
    && indep.key(root) === indep.key(root)
    && prod.stateKey(metadataVariant) === rootProdKey
    && indep.key(metadataVariant) === rootIndKey;
  gates["S0-G5"] = deterministic;
  ensure(gates["S0-G5"], "deterministic/excluded-metadata identity check failed");

  const sensitivity = buildIdentitySensitivityFixtures(root);
  gates["S0-G6"] = Object.entries(sensitivity).every(([field, fixture]) => {
    prod.assertStudyState(fixture);
    indep.assertStudyState(fixture);
    const pk = prod.stateKey(fixture);
    const ik = indep.key(fixture);
    if (pk !== ik) throw new Error(`serializer mismatch in ${field} sensitivity fixture`);
    return pk !== rootProdKey;
  });
  ensure(gates["S0-G6"], "included identity sensitivity check failed");

  const stateByKey = new Map();
  const engineStateByKey = new Map();
  const queue = [];
  const transitions = [];
  let generatedSuccessorOccurrences = 0;
  let duplicateEncounters = 0;

  function addState(state, minDepth) {
    prod.assertStudyState(state);
    indep.assertStudyState(state);
    const pk = prod.stateKey(state);
    const ik = indep.key(state);
    ensure(pk === ik, `serializer mismatch for state ${pk}`);
    if (stateByKey.has(pk)) return false;
    const rawState = prod.rawRuleState(state);
    const row = rowWithHash({ stateKey: pk, rawState, minDepth });
    stateByKey.set(pk, row);
    engineStateByKey.set(pk, prod.clone(state));
    queue.push({ key: pk, depth: minDepth });
    return true;
  }

  addState(root, 0);
  let replayChecks = 0;
  let transitionIntegrityChecks = 0;

  while (queue.length) {
    const current = queue.shift();
    if (current.depth >= MAX_DEPTH) continue;
    const parent = engineStateByKey.get(current.key);
    prod.assertStudyState(parent);
    indep.assertStudyState(parent);
    const moves = guardedMoveVariants(parent)
      .map(normalizeMove)
      .sort((a, b) => prod.moveKey(a).localeCompare(prod.moveKey(b)));

    for (const move of moves) {
      const moveKey = prod.moveKey(move);
      ensure(moveKey === indep.moveIdentity(move), "move identity mismatch");
      const result = guardedApplyMove(parent, move);
      const child = result.state;
      transitionIntegrityChecks += 1;
      ensure(prod.representedSeeds(child) === 64, "production child seed conservation failed");
      ensure(indep.seedCount(child) === 64, "independent child seed conservation failed");
      const childKey = prod.stateKey(child);
      ensure(childKey === indep.key(child), "child serializer mismatch");
      generatedSuccessorOccurrences += 1;

      const replay = guardedApplyMove(parent, move).state;
      replayChecks += 1;
      ensure(prod.stateKey(replay) === childKey, "deterministic move replay mismatch");

      const isNew = addState(child, current.depth + 1);
      if (!isNew) duplicateEncounters += 1;
      transitions.push(rowWithHash({
        parentKey: current.key,
        moveKey,
        move,
        childKey,
        parentDepth: current.depth,
        childDepth: current.depth + 1,
      }));
    }
  }

  gates["S0-G7"] = replayChecks === generatedSuccessorOccurrences;
  gates["S0-G8"] = transitionIntegrityChecks === generatedSuccessorOccurrences;
  ensure(gates["S0-G7"] && gates["S0-G8"], "replay/transition gate accounting failed");

  const states = Array.from(stateByKey.values()).sort((a, b) => a.stateKey.localeCompare(b.stateKey));
  transitions.sort((a, b) => {
    const ak = `${a.parentKey}|${a.moveKey}|${a.childKey}`;
    const bk = `${b.parentKey}|${b.moveKey}|${b.childKey}`;
    return ak.localeCompare(bk);
  });

  const stateSetSha256 = datasetHash(states.map((row) => row.stateKey));
  const transitionSetSha256 = datasetHash(transitions.map((row) => `${row.parentKey}|${row.moveKey}|${row.childKey}`));

  const rawArtifact = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stage: "stage0-technical-v1",
    baselineMain: BASELINE_MAIN,
    protocol: { root: "engine.initialState()", maxDepth: MAX_DEPTH, symmetryReduction: false, scientificInference: false },
    counts: {
      uniqueRawStates: states.length,
      generatedSuccessorOccurrences,
      transitionRows: transitions.length,
      duplicateEncounters,
    },
    hashes: { stateSetSha256, transitionSetSha256 },
    states,
    transitions,
  };

  const rawPath = path.join(OUT_DIR, "scientific-raw.json");
  fs.writeFileSync(rawPath, `${JSON.stringify(rawArtifact, null, 2)}\n`, "utf8");

  const reopened = JSON.parse(fs.readFileSync(rawPath, "utf8"));
  const independentStateKeys = [];
  for (const row of reopened.states) {
    indep.assertStudyState(row.rawState);
    const key = indep.key(row.rawState);
    ensure(key === row.stateKey, "independent stored state-key binding failed");
    const expectedRowHash = indep.sha256(indep.canonical(withoutRowHash(row)));
    ensure(expectedRowHash === row.rowSha256, "independent state row hash failed");
    independentStateKeys.push(key);
  }

  const known = new Set(independentStateKeys);
  const independentTransitionLines = [];
  const indegree = new Map(independentStateKeys.map((key) => [key, 0]));
  for (const row of reopened.transitions) {
    ensure(known.has(row.parentKey) && known.has(row.childKey), "transition references unknown state");
    ensure(indep.moveIdentity(row.move) === row.moveKey, "independent move binding failed");
    const expectedRowHash = indep.sha256(indep.canonical(withoutRowHash(row)));
    ensure(expectedRowHash === row.rowSha256, "independent transition row hash failed");
    independentTransitionLines.push(`${row.parentKey}|${row.moveKey}|${row.childKey}`);
    indegree.set(row.childKey, (indegree.get(row.childKey) || 0) + 1);
  }

  const independentStateHash = indep.sha256(independentStateKeys.slice().sort().join("\n"));
  const independentTransitionHash = indep.sha256(independentTransitionLines.slice().sort().join("\n"));
  gates["S0-G9"] = reopened.counts.generatedSuccessorOccurrences === reopened.transitions.length
    && reopened.counts.duplicateEncounters === duplicateEncounters;
  gates["S0-G10"] = independentStateHash === reopened.hashes.stateSetSha256
    && independentTransitionHash === reopened.hashes.transitionSetSha256
    && reopened.counts.uniqueRawStates === independentStateKeys.length;
  ensure(gates["S0-G9"] && gates["S0-G10"], "independent graph reconstruction failed");

  const reporting = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    sourceStage: reopened.stage,
    scientificInference: false,
    counts: reopened.counts,
    hashes: reopened.hashes,
    states: reopened.states.map((row) => ({
      stateKey: row.stateKey,
      minDepth: row.minDepth,
      phase: row.rawState.phase,
      player: row.rawState.player,
      winner: row.rawState.winner,
      reserve: row.rawState.reserve,
      pending: row.rawState.pending,
      representedSeeds: indep.seedCount(row.rawState),
    })),
  };
  const reportingPath = path.join(OUT_DIR, "repository-facing-reporting.json");
  fs.writeFileSync(reportingPath, `${JSON.stringify(reporting, null, 2)}\n`, "utf8");

  const reportingReopened = JSON.parse(fs.readFileSync(reportingPath, "utf8"));
  const rawByKey = new Map(reopened.states.map((row) => [row.stateKey, row]));
  gates["S0-G11"] = reportingReopened.states.length === reopened.states.length
    && reportingReopened.states.every((row) => {
      const rawRow = rawByKey.get(row.stateKey);
      return rawRow
        && row.minDepth === rawRow.minDepth
        && row.phase === rawRow.rawState.phase
        && row.player === rawRow.rawState.player
        && row.winner === rawRow.rawState.winner
        && row.representedSeeds === 64;
    })
    && reportingReopened.hashes.stateSetSha256 === reopened.hashes.stateSetSha256
    && reportingReopened.hashes.transitionSetSha256 === reopened.hashes.transitionSetSha256;
  ensure(gates["S0-G11"], "post-materialization reporting verification failed");

  const independentSource = fs.readFileSync(path.resolve(__dirname, "lib/ssgtc-representation-independent.js"), "utf8");
  gates["S0-G12"] = !/ssgtc-representation-production/.test(independentSource)
    && !/orisc-representation-production/.test(independentSource);
  ensure(gates["S0-G12"], "independent serializer imports production identity code");

  gates["S0-G3"] = gates["S0-G3"] && states.every((row) => prod.stateKey(row.rawState) === indep.key(row.rawState));
  gates["S0-G2"] = gates["S0-G2"] && states.every((row) => prod.representedSeeds(row.rawState) === 64 && indep.seedCount(row.rawState) === 64);
  gates["S0-G1"] = gates["S0-G1"] && states.every((row) => {
    prod.assertStudyState(row.rawState);
    indep.assertStudyState(row.rawState);
    return true;
  });

  const mandatory = Array.from({ length: 12 }, (_, i) => `S0-G${i + 1}`);
  const passed = mandatory.every((gate) => gates[gate] === true);
  const multiParentStates = Array.from(indegree.values()).filter((value) => value >= 2).length;
  const verification = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stage: "stage0-technical-v1",
    scientificInferenceAuthorized: false,
    decision: passed ? "SSGTC-STAGE0-PASS" : "SSGTC-STAGE0-TECHNICAL-BLOCK",
    passed,
    gates,
    diagnosticOnly: {
      maxDepth: MAX_DEPTH,
      uniqueRawStates: states.length,
      generatedSuccessorOccurrences,
      duplicateEncounters,
      multiParentStates,
      stateSetSha256,
      transitionSetSha256,
    },
    provenance: {
      baselineMain: BASELINE_MAIN,
      rawArtifactSha256: prod.sha256Text(fs.readFileSync(rawPath, "utf8")),
      repositoryFacingSha256: prod.sha256Text(fs.readFileSync(reportingPath, "utf8")),
    },
  };
  const verificationPath = path.join(OUT_DIR, "verification.json");
  fs.writeFileSync(verificationPath, `${JSON.stringify(verification, null, 2)}\n`, "utf8");

  process.stdout.write(`${JSON.stringify(verification, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  process.exitCode = 1;
}
