#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const { seededRandom } = require("../benchmark.js");
const {
  DEFINITIONS,
  definitionHash,
  exactMoveKey,
  rawStateKey,
} = require("./lib/symmetry-isomorphism-transforms.js");

const TECH_SEED_START = 22900001;
const TECH_SEED_END = 22900032;
const MAX_TRAJECTORY_PLY = 120;
const ROOT_CAP_PER_DOMAIN = 8;
const DEPTHS = [1, 2, 3];
const DOMAIN_IDS = ["namua", "mtaji", "mtaji-houseless"];

function sha256Buffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function trajectory(seed) {
  const random = seededRandom(seed);
  const rows = [];
  let state = E.initialState();
  let guardHit = false;
  for (let ply = 0; ply <= MAX_TRAJECTORY_PLY; ply += 1) {
    rows.push({ ply, state: clone(state) });
    if (state.winner !== null) break;
    const moves = E.moveVariants(state);
    if (!moves.length) break;
    const move = moves[Math.floor(random() * moves.length)];
    const next = E.applyMove(state, move).state;
    if (next.reason === "relay-limit") {
      guardHit = true;
      break;
    }
    state = next;
  }
  return { seed, rows, guardHit };
}

function matchesDomain(state, ply, domainId) {
  if (state.winner !== null) return false;
  if (domainId === "namua") return state.phase === "namua" && ply >= 8;
  if (domainId === "mtaji") return state.phase === "mtaji";
  if (domainId === "mtaji-houseless") {
    return state.phase === "mtaji"
      && state.reserve?.[0] === 0 && state.reserve?.[1] === 0
      && state.houseOwned?.[0] === false && state.houseOwned?.[1] === false;
  }
  throw new Error(`Unknown technical domain: ${domainId}`);
}

function selectTechnicalRoots(trajectories, domainId) {
  const byKey = new Map();
  for (const item of trajectories) {
    const candidate = item.rows.find(({ state, ply }) => matchesDomain(state, ply, domainId));
    if (!candidate) continue;
    const key = rawStateKey(candidate.state);
    if (!byKey.has(key)) {
      byKey.set(key, {
        stateKey: key,
        seed: item.seed,
        ply: candidate.ply,
        state: candidate.state,
      });
    }
  }
  return [...byKey.values()]
    .sort((a, b) => a.stateKey.localeCompare(b.stateKey))
    .slice(0, ROOT_CAP_PER_DOMAIN);
}

function expandLocalGraph(roots, depth) {
  const started = process.hrtime.bigint();
  const states = new Map();
  const edges = new Set();
  let attemptedEdges = 0;
  let guardHits = 0;
  let maxBranching = 0;
  const queue = [];
  for (const root of roots) {
    states.set(root.stateKey, clone(root.state));
    queue.push({ state: clone(root.state), stateKey: root.stateKey, level: 0 });
  }
  const expandedAt = new Map();
  while (queue.length) {
    const current = queue.shift();
    const prior = expandedAt.get(current.stateKey);
    if (prior !== undefined && prior <= current.level) continue;
    expandedAt.set(current.stateKey, current.level);
    if (current.level >= depth || current.state.winner !== null) continue;
    const moves = E.moveVariants(current.state);
    maxBranching = Math.max(maxBranching, moves.length);
    for (const move of moves) {
      attemptedEdges += 1;
      const next = E.applyMove(current.state, move).state;
      if (next.reason === "relay-limit") {
        guardHits += 1;
        continue;
      }
      const nextKey = rawStateKey(next);
      states.set(nextKey, clone(next));
      edges.add(`${current.stateKey}|${exactMoveKey(move)}|${nextKey}`);
      if (current.level + 1 < depth && next.winner === null) {
        queue.push({ state: next, stateKey: nextKey, level: current.level + 1 });
      }
    }
  }
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
  return {
    depth,
    rootCount: roots.length,
    stateCount: states.size,
    edgeCount: edges.size,
    attemptedEdges,
    guardHits,
    completeUnderRuntimeEngine: guardHits === 0,
    maxBranching,
    elapsedMs,
    rssBytes: process.memoryUsage().rss,
  };
}

function main() {
  const outputIndex = process.argv.indexOf("--output");
  const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : null;
  const candidatePath = path.join(
    __dirname,
    "../../doc/symmetry-isomorphic-positions/preregistration/CANDIDATE_TRANSFORMS.json",
  );
  const candidateBytes = fs.readFileSync(candidatePath);
  const trajectories = [];
  for (let seed = TECH_SEED_START; seed <= TECH_SEED_END; seed += 1) trajectories.push(trajectory(seed));

  const domainRoots = Object.fromEntries(
    DOMAIN_IDS.map((domainId) => [domainId, selectTechnicalRoots(trajectories, domainId)]),
  );
  const profiles = [];
  for (const domainId of DOMAIN_IDS) {
    for (const depth of DEPTHS) {
      profiles.push({ domainId, ...expandLocalGraph(domainRoots[domainId], depth) });
    }
  }

  const result = {
    schemaVersion: 1,
    studyId: "SIP-STUDY1",
    stageId: "SIP-STAGE0-TECHNICAL-2026-08-24-v2",
    supersedesTechnicalStageId: "SIP-STAGE0-TECHNICAL-2026-08-24-v1",
    supersessionReason: "Adds the prospectively frozen mtaji-houseless structural applicability stratum before any formal candidate outcome generation.",
    scientificOutcomeGenerated: false,
    candidateOutcomeInspected: false,
    technicalSeedBlock: {
      start: TECH_SEED_START,
      end: TECH_SEED_END,
      trajectories: trajectories.length,
      maximumTrajectoryPly: MAX_TRAJECTORY_PLY,
      trajectoryRuntimeGuardHits: trajectories.filter((row) => row.guardHit).length,
    },
    candidateContract: {
      path: "doc/symmetry-isomorphic-positions/preregistration/CANDIDATE_TRANSFORMS.json",
      bytesSha256: sha256Buffer(candidateBytes),
      implementationDefinitionHashes: Object.fromEntries(
        Object.keys(DEFINITIONS).map((candidateId) => [candidateId, definitionHash(candidateId)]),
      ),
    },
    technicalRootInventory: Object.fromEntries(Object.entries(domainRoots).map(([domainId, rows]) => [
      domainId,
      rows.map(({ stateKey, seed, ply }) => ({ stateKey, seed, ply })),
    ])),
    graphProfiles: profiles,
    formalSelectionAuthorized: false,
    formalSeedBlockConsumed: false,
    notes: [
      "No symmetry/isomorphism mismatch rate is computed by this technical benchmark.",
      "The mtaji-houseless stratum is a predeclared structural applicability domain, not an outcome-based subset.",
      "Runtime relay-limit hits are administrative incompleteness, never game-theoretic or symmetry outcomes.",
      "Stage 1 root count/depth must be frozen later using only these technical quantities.",
    ],
  };

  if (output) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) main();
