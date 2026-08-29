"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const { performance } = require("node:perf_hooks");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const P = require("./lib/mdft-stage0-production.js");
const I = require("./lib/mdft-stage0-independent.js");

const STAGE_ID = "MDFT-S0-TECHNICAL-2026-08-29-v1";
const CONTINUATION_PLIES = 6;
const WALL_CEILING_MS = 120000;
const RSS_CEILING_KB = 524288;
const GZIP_CEILING_BYTES = 5242880;
const TECHNICAL_SEEDS = Array.from({ length: 32 }, (_, index) => 8_080_001 + index);
const OUT_DIR = path.resolve(process.argv[2] || "artifacts/local/mdft-stage0-f10-preflight");

function assert(value, message) { if (!value) throw new Error(message); }
function stable(value) { return P.stableStringify(value); }
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function prng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function moves(state) { return E.moveVariants(state).slice().sort((a, b) => AI.moveKey(a).localeCompare(AI.moveKey(b))); }
function findMove(state, key, keyFn = AI.moveKey) { return moves(state).find((move) => keyFn(move) === key) || null; }

function fixtures() {
  const rows = [];
  const seen = new Set();
  let namua = 0;
  let mtaji = 0;
  for (const seed of TECHNICAL_SEEDS) {
    const random = prng(seed);
    let state = E.initialState();
    for (let ply = 0; ply <= 80 && state.winner === null; ply += 1) {
      const legal = moves(state);
      if (!legal.length) break;
      const selectNamua = state.phase === "namua" && [8, 20, 32, 40].includes(ply) && namua < 2;
      const selectMtaji = state.phase === "mtaji" && mtaji < 2 && (ply <= 52 || ply % 4 === 0);
      if ((selectNamua || selectMtaji) && legal.length >= 2) {
        const key = P.rawIdentityKey(state);
        if (!seen.has(key)) {
          rows.push({ id: `TECH-${seed}-P${String(ply).padStart(2, "0")}-${state.phase.toUpperCase()}`, state: E.clone(state), seed, ply });
          seen.add(key);
          if (state.phase === "namua") namua += 1; else mtaji += 1;
        }
      }
      if (namua >= 2 && mtaji >= 2) break;
      state = E.applyMove(state, legal[Math.floor(random() * legal.length)]).state;
    }
    if (namua >= 2 && mtaji >= 2) break;
  }
  assert(namua >= 2 && mtaji >= 1, "F10 technical fixture phase coverage failed");
  return rows.slice(0, 4);
}

function structuralVectorA(state) {
  const boardSeeds = state.pits.map((side) => side.flat().reduce((sum, value) => sum + value, 0));
  const legal = state.winner === null ? moves(state) : [];
  return {
    rawIdentityKey: P.rawIdentityKey(state), phase: state.phase, player: state.player,
    reserve: [...state.reserve], houseOwned: [...state.houseOwned], boardSeeds,
    legalMoveCount: legal.length, captureMoveCount: legal.filter((move) => move.type === "capture").length,
  };
}
function structuralVectorB(state) {
  let p0 = 0; let p1 = 0;
  for (const row of state.pits[0]) for (const value of row) p0 += value;
  for (const row of state.pits[1]) for (const value of row) p1 += value;
  const legal = state.winner === null ? E.moveVariants(state) : [];
  let captures = 0;
  for (const move of legal) if (move.type === "capture") captures += 1;
  return {
    rawIdentityKey: I.rawIdentityKey(state), phase: state.phase, player: state.player,
    reserve: [state.reserve[0], state.reserve[1]], houseOwned: [state.houseOwned[0], state.houseOwned[1]],
    boardSeeds: [p0, p1], legalMoveCount: legal.length, captureMoveCount: captures,
  };
}

function normalizeD1(row) {
  return {
    completedDepth: row.completedDepth, topSetMoveKeys: row.topSetMoveKeys,
    canonicalBestMoveKey: row.canonicalBestMoveKey, bestScore: row.bestScore,
    candidates: row.candidates, principalVariation: row.principalVariation ? { moveKeys: row.principalVariation.moveKeys, score: row.principalVariation.score } : null,
  };
}

function traceProduction(source, firstMoveKey) {
  let state = E.clone(source);
  const trace = [];
  let key = firstMoveKey;
  for (let ply = 0; ply < CONTINUATION_PLIES && state.winner === null; ply += 1) {
    const move = findMove(state, key, AI.moveKey);
    assert(move, `Production continuation move missing at ply ${ply}: ${key}`);
    state = E.applyMove(state, move).state;
    trace.push({ plyApplied: ply + 1, moveKey: key, structure: structuralVectorA(state) });
    if (state.winner !== null || ply + 1 >= CONTINUATION_PLIES) break;
    const grid = P.analyzeSearchGrid(state);
    key = grid.D1_Q1.canonicalBestMoveKey;
    trace[trace.length - 1].nextD1 = normalizeD1(grid.D1_Q1);
  }
  return trace;
}
function traceIndependent(source, firstMoveKey) {
  let state = E.clone(source);
  const trace = [];
  let key = firstMoveKey;
  for (let ply = 0; ply < CONTINUATION_PLIES && state.winner === null; ply += 1) {
    const move = findMove(state, key, I.moveKey);
    assert(move, `Independent continuation move missing at ply ${ply}: ${key}`);
    state = E.applyMove(state, move).state;
    trace.push({ plyApplied: ply + 1, moveKey: key, structure: structuralVectorB(state) });
    if (state.winner !== null || ply + 1 >= CONTINUATION_PLIES) break;
    const grid = I.analyzeSearchGrid(state);
    key = grid.D1_Q1.canonicalBestMoveKey;
    trace[trace.length - 1].nextD1 = normalizeD1(grid.D1_Q1);
  }
  return trace;
}

function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const start = performance.now();
  const sourceFixtures = fixtures();
  const phases = new Set(sourceFixtures.map(({ state }) => state.phase));
  assert(sourceFixtures.length >= 3 && phases.has("namua") && phases.has("mtaji"), "F10 fixture gate failed");

  const rows = [];
  for (const fixture of sourceFixtures) {
    const prodGrid = P.analyzeSearchGrid(fixture.state);
    const indGrid = I.analyzeSearchGrid(fixture.state);
    assert(stable(normalizeD1(prodGrid.D1_Q1)) === stable(normalizeD1(indGrid.D1_Q1)), `Initial D1 mismatch ${fixture.id}`);
    const firstMoves = [
      ["baseline", prodGrid.D2_Q1_BASE.canonicalBestMoveKey],
      ["reference", prodGrid.D3_Q1_REFERENCE.canonicalBestMoveKey],
    ];
    for (const [role, firstMoveKey] of firstMoves) {
      const production = traceProduction(fixture.state, firstMoveKey);
      const independent = traceIndependent(fixture.state, firstMoveKey);
      const equal = stable(production) === stable(independent);
      assert(equal, `F10 continuation mismatch ${fixture.id}/${role}`);
      rows.push({ fixtureId: fixture.id, phase: fixture.state.phase, role, firstMoveKey, production, independent, exactEqual: equal });
    }
  }

  const wallMs = performance.now() - start;
  const maxRssKb = process.resourceUsage().maxRSS;
  const canonical = Buffer.from(stable({ stageId: STAGE_ID, continuationPlies: CONTINUATION_PLIES, rows }), "utf8");
  const gzip = zlib.gzipSync(canonical, { level: 9 });
  const gates = {
    fixtureGate: sourceFixtures.length >= 3 && phases.has("namua") && phases.has("mtaji"),
    exactTraceGate: rows.every((row) => row.exactEqual),
    wallClockGate: wallMs <= WALL_CEILING_MS,
    maxRssGate: maxRssKb <= RSS_CEILING_KB,
    gzipArtifactGate: gzip.length <= GZIP_CEILING_BYTES,
  };
  const passed = Object.values(gates).every(Boolean);
  const result = {
    schemaVersion: "1.0.0", stageId: STAGE_ID, probe: "MDFT-F10-BOUNDED-CONTINUATION-TECHNICAL-PREFLIGHT",
    scientificInferenceAuthorized: false, scientificSeedUseAllowed: false,
    terminalOrGameOutcomeUsedAsAssignmentTarget: false,
    disposition: passed ? "MDFT-F10-TECHNICALLY-ELIGIBLE" : "MDFT-F10-TECHNICALLY-INELIGIBLE",
    thresholds: { fixtureMinimum: 3, continuationPlies: CONTINUATION_PLIES, wallClockCeilingMs: WALL_CEILING_MS, maxRssCeilingKb: RSS_CEILING_KB, gzipArtifactCeilingBytes: GZIP_CEILING_BYTES },
    observed: { fixtureCount: sourceFixtures.length, phases: [...phases].sort(), traceCount: rows.length, wallMs, maxRssKb, canonicalBytes: canonical.length, gzipBytes: gzip.length, canonicalSha256: sha256(canonical) },
    gates,
  };
  fs.writeFileSync(path.join(OUT_DIR, "F10_PREFLIGHT_RESULT.json"), `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, "F10_FULL_TRACE.json"), `${JSON.stringify({ stageId: STAGE_ID, rows }, null, 2)}\n`);
  fs.writeFileSync(path.join(OUT_DIR, "F10_FULL_TRACE.json.gz"), gzip);
  const manifest = ["F10_PREFLIGHT_RESULT.json", "F10_FULL_TRACE.json", "F10_FULL_TRACE.json.gz"].map((name) => {
    const data = fs.readFileSync(path.join(OUT_DIR, name));
    return { name, bytes: data.length, sha256: sha256(data) };
  });
  fs.writeFileSync(path.join(OUT_DIR, "HASH_MANIFEST.json"), `${JSON.stringify({ stageId: STAGE_ID, files: manifest }, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (!passed) process.exitCode = 1;
}

main();
