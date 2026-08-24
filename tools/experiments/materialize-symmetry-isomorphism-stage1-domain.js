#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const { seededRandom } = require("../benchmark.js");
const { exactMoveKey, rawStateKey, stableStringify } = require("./lib/symmetry-isomorphism-transforms.js");

const SEED_START = 22910001;
const SEED_END = 22910064;
const MAX_PLY = 120;
const ROOTS_PER_STRATUM = 8;
const LOCAL_DEPTH = 3;

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function validRuleState(state) {
  if (!state || !Array.isArray(state.pits) || state.pits.length !== 2) return false;
  if (state.pits.some((rows) => !Array.isArray(rows) || rows.length !== 2
    || rows.some((row) => !Array.isArray(row) || row.length !== 8
      || row.some((v) => !Number.isInteger(v) || v < 0)))) return false;
  if (!Array.isArray(state.reserve) || state.reserve.length !== 2
    || state.reserve.some((v) => !Number.isInteger(v) || v < 0)) return false;
  if (!Array.isArray(state.houseOwned) || state.houseOwned.length !== 2
    || state.houseOwned.some((v) => typeof v !== "boolean")) return false;
  const pending = state.pending || [0, 0];
  if (!Array.isArray(pending) || pending.length !== 2 || pending.some((v) => !Number.isInteger(v) || v < 0)) return false;
  if (![0, 1].includes(state.player) || !["namua", "mtaji"].includes(state.phase) || ![null, 0, 1].includes(state.winner)) return false;
  const total = state.pits.flat(2).reduce((a, b) => a + b, 0)
    + state.reserve.reduce((a, b) => a + b, 0) + pending.reduce((a, b) => a + b, 0);
  return total === 64;
}
function trajectory(seed) {
  const random = seededRandom(seed);
  let state = E.initialState();
  const rows = [{ ply: 0, state: clone(state), witnessMoveKeys: [] }];
  const witnessMoveKeys = [];
  let guardHit = false;
  for (let ply = 0; ply < MAX_PLY; ply += 1) {
    if (state.winner !== null) break;
    const moves = E.moveVariants(state);
    if (!moves.length) break;
    const move = clone(moves[Math.floor(random() * moves.length)]);
    const next = E.applyMove(state, move).state;
    if (next.reason === "relay-limit") { guardHit = true; break; }
    witnessMoveKeys.push(exactMoveKey(move));
    state = next;
    rows.push({ ply: ply + 1, state: clone(state), witnessMoveKeys: witnessMoveKeys.slice() });
  }
  return { seed, rows, guardHit };
}
function eligible(row, stratum) {
  const state = row.state;
  if (!validRuleState(state) || state.winner !== null) return false;
  if (stratum === "namua") return state.phase === "namua" && row.ply >= 8;
  if (stratum === "mtaji") return state.phase === "mtaji";
  if (stratum === "mtaji-houseless") return state.phase === "mtaji"
    && state.reserve[0] === 0 && state.reserve[1] === 0
    && state.houseOwned[0] === false && state.houseOwned[1] === false;
  throw new Error(`Unknown stratum ${stratum}`);
}
function selectRoots(trajectories, stratum) {
  const byKey = new Map();
  for (const item of trajectories) {
    const row = item.rows.find((candidate) => eligible(candidate, stratum));
    if (!row) continue;
    const stateKey = rawStateKey(row.state);
    if (!byKey.has(stateKey)) {
      byKey.set(stateKey, {
        stateKey,
        seed: item.seed,
        ply: row.ply,
        witnessMoveKeys: row.witnessMoveKeys.slice(),
      });
    }
  }
  return [...byKey.values()].sort((a, b) => a.stateKey.localeCompare(b.stateKey)).slice(0, ROOTS_PER_STRATUM);
}
function verifyRoot(root, trajectories) {
  const trajectoryRow = trajectories.find((item) => item.seed === root.seed)?.rows.find((row) => row.ply === root.ply);
  if (!trajectoryRow) return { stateKey: root.stateKey, passed: false, reason: "ROW-NOT-FOUND" };
  const actualStateKey = rawStateKey(trajectoryRow.state);
  const witnessKeysEqual = JSON.stringify(trajectoryRow.witnessMoveKeys) === JSON.stringify(root.witnessMoveKeys);
  return {
    stateKey: root.stateKey,
    passed: actualStateKey === root.stateKey && witnessKeysEqual,
    actualStateKey,
    witnessKeysEqual,
    reason: actualStateKey === root.stateKey && witnessKeysEqual ? null : "REGENERATION-MISMATCH",
  };
}
function main() {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf("--output");
  const output = outputIndex >= 0 ? args[outputIndex + 1] : null;
  const trajectories = [];
  for (let seed = SEED_START; seed <= SEED_END; seed += 1) trajectories.push(trajectory(seed));
  const strata = {};
  for (const stratum of ["namua", "mtaji", "mtaji-houseless"]) {
    const roots = selectRoots(trajectories, stratum);
    strata[stratum] = {
      requiredRootCount: ROOTS_PER_STRATUM,
      roots,
      regenerationChecks: roots.map((root) => verifyRoot(root, trajectories)),
    };
  }
  const shortages = Object.entries(strata).filter(([, value]) => value.roots.length < ROOTS_PER_STRATUM)
    .map(([stratum, value]) => ({ stratum, observed: value.roots.length, required: ROOTS_PER_STRATUM }));
  const regenerationFailures = Object.entries(strata).flatMap(([stratum, value]) => value.regenerationChecks
    .filter((row) => !row.passed).map((row) => ({ stratum, ...row })));
  const result = {
    schemaVersion: 2,
    studyId: "SIP-STUDY1",
    domainId: "SIP-S1-DOMAIN-2026-08-24-v1",
    generatedScientificOutcome: false,
    candidateTransformApplied: false,
    compactContract: true,
    seedBlock: { start: SEED_START, end: SEED_END, maximumTrajectoryPly: MAX_PLY },
    selectionRule: {
      rootCountPerStratum: ROOTS_PER_STRATUM,
      localExpansionDepth: LOCAL_DEPTH,
      namua: "first nonterminal valid Namua state at ply>=8 per seed; deduplicate by direct raw state key; ascending key; first 8",
      mtaji: "first nonterminal valid Mtaji state per seed; deduplicate by direct raw state key; ascending key; first 8",
      mtajiHouseless: "first nonterminal valid Mtaji state with reserve=[0,0] and houseOwned=[false,false] per seed; deduplicate by direct raw state key; ascending key; first 8",
      outcomeInputsForbidden: ["candidate pass/fail", "commutation mismatch", "oracle invariance", "canonical orbit size"],
    },
    trajectorySummary: {
      count: trajectories.length,
      runtimeGuardHits: trajectories.filter((row) => row.guardHit).length,
    },
    strata,
    eligibility: {
      passed: shortages.length === 0 && regenerationFailures.length === 0,
      shortages,
      regenerationFailures,
    },
    reconstructionContract: "Production and independent verifier must regenerate each root and full witness move objects from seed+ply, then require stateKey and exact witnessMoveKeys equality before any candidate transform is evaluated.",
  };
  result.domainContentSha256 = sha256(stableStringify({ ...result, domainContentSha256: undefined }));
  if (output) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  }
  process.stdout.write(`${JSON.stringify({
    domainId: result.domainId,
    schemaVersion: result.schemaVersion,
    eligibility: result.eligibility,
    rootCounts: Object.fromEntries(Object.entries(strata).map(([key, value]) => [key, value.roots.length])),
    trajectoryRuntimeGuardHits: result.trajectorySummary.runtimeGuardHits,
  }, null, 2)}\n`);
  if (!result.eligibility.passed) process.exitCode = 2;
}

if (require.main === module) main();
