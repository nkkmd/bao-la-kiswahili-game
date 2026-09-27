#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const { seededRandom } = require("../benchmark.js");
const T = require("./lib/restricted-endgame-transition.js");
const TB = require("./lib/restricted-endgame-tablebase.js");
const V = require("./lib/restricted-endgame-independent-verifier.js");
const ITB = require("./lib/restricted-endgame-tablebase-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/geometry-conditioned-search-reliability-exact-agreement/prereg/STAGE_1_DEVELOPMENT_SPEC.json");

function need(value, message) { if (!value) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function equalArray(a, b) {
  const x = [...a].sort(), y = [...b].sort();
  return x.length === y.length && x.every((value, index) => value === y[index]);
}
function independentRng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let n = value;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

function materializeProduction(entry) {
  const random = seededRandom(entry.seed);
  let state = E.initialState();
  for (let ply = 0; ply < entry.ply; ply += 1) {
    need(state.winner === null, `production trajectory ended early:${entry.domainIndex}:${ply}`);
    const moves = E.moveVariants(state).map(clone).sort((a, b) => T.moveKey(a).localeCompare(T.moveKey(b)));
    need(moves.length > 0, `production no legal move:${entry.domainIndex}:${ply}`);
    const move = moves[Math.min(moves.length - 1, Math.floor(random() * moves.length))];
    state = E.applyMove(state, move).state;
    need(state.reason !== "relay-limit", `production relay-limit:${entry.domainIndex}:${ply + 1}`);
  }
  const key = T.directStateKey(state);
  need(key === entry.rootStateKey, `production root key mismatch:${entry.domainIndex}`);
  return state;
}

function materializeIndependent(entry) {
  const random = independentRng(entry.seed);
  let state = E.initialState();
  for (let ply = 0; ply < entry.ply; ply += 1) {
    need(state.winner === null, `independent trajectory ended early:${entry.domainIndex}:${ply}`);
    const moves = E.moveVariants(state).map(clone).sort((a, b) => V.moveKey(a).localeCompare(V.moveKey(b)));
    need(moves.length > 0, `independent no legal move:${entry.domainIndex}:${ply}`);
    const move = moves[Math.min(moves.length - 1, Math.floor(random() * moves.length))];
    state = E.applyMove(state, move).state;
    need(state.reason !== "relay-limit", `independent relay-limit:${entry.domainIndex}:${ply + 1}`);
  }
  const key = V.stateKey(state);
  need(key === entry.rootStateKey, `independent root key mismatch:${entry.domainIndex}`);
  return state;
}

function solveProduction(entry, state) {
  const solved = TB.solveExactTablebase([state], {
    maxStates: entry.stateCount,
    maxEdges: entry.edgeCount,
    maxMicrostates: entry.maximumMoveMicrosteps,
  });
  const root = solved.solution.rows.find((row) => row.stateKey === entry.rootStateKey);
  need(root, `production root result missing:${entry.domainIndex}`);
  return {
    stateCount: solved.graph.stateCount,
    edgeCount: solved.graph.edgeCount,
    stateSetSha256: solved.graph.stateSetSha256,
    transitionSetSha256: solved.graph.transitionSetSha256,
    solutionSha256: solved.solution.solutionSha256,
    rootStatus: root.status,
    rootAbsoluteWinner: root.absoluteWinner,
    rootDtf: root.dtf,
    rootOptimalMoveKeys: [...(root.optimalMoveKeys || [])].sort(),
  };
}

function solveIndependent(entry, state) {
  const solved = ITB.solveIndependentTablebase([state], {
    maxStates: entry.stateCount,
    maxEdges: entry.edgeCount,
    maxMicrostates: entry.maximumMoveMicrosteps,
  });
  const root = solved.solution.rows.find((row) => row.stateKey === entry.rootStateKey);
  need(root, `independent root result missing:${entry.domainIndex}`);
  return {
    stateCount: solved.graph.stateCount,
    edgeCount: solved.graph.edgeCount,
    stateSetSha256: solved.graph.stateSetSha256,
    transitionSetSha256: solved.graph.transitionSetSha256,
    solutionSha256: solved.solution.solutionSha256,
    rootStatus: root.status,
    rootAbsoluteWinner: root.absoluteWinner,
    rootDtf: root.dtf,
    rootOptimalMoveKeys: [...(root.optimalMoveKeys || [])].sort(),
  };
}

function expected(entry) {
  return {
    stateCount: entry.stateCount,
    edgeCount: entry.edgeCount,
    stateSetSha256: entry.stateSetSha256,
    transitionSetSha256: entry.transitionSetSha256,
    solutionSha256: entry.solutionSha256,
    rootStatus: entry.rootStatus,
    rootAbsoluteWinner: entry.rootAbsoluteWinner,
    rootDtf: entry.rootDtf,
    rootOptimalMoveKeys: [...entry.rootOptimalMoveKeys].sort(),
  };
}

function main() {
  const output = path.resolve(process.argv[2]);
  const spec = readJson(SPEC_PATH);
  need(spec.studyId === "GCSREA-STUDY1", "Stage1 spec study mismatch");
  need(spec.moduleB.stage1Role === "ORACLE-INTEGRITY-AND-REMATERIALIZATION-READINESS-ONLY", "Module B Stage1 role mismatch");
  need(spec.moduleB.actualSearchVsExactMeasurementAuthorized === false, "actual search-vs-exact measurement unexpectedly authorized");
  need(spec.moduleB.candidateRescan === false && spec.moduleB.domainReplacement === false && spec.moduleB.stateLimitRescue === false, "G4-05 protected boundary mismatch");

  const manifestPath = path.join(ROOT, spec.moduleB.fixedManifestPath);
  const manifest = readJson(manifestPath);
  need(manifest.populationRole === "IMMUTABLE-G4-05-FORMAL-DOMAINS-ONLY", "G4-05 immutable population role mismatch");
  need(manifest.formalDomainCount === 8 && manifest.domains.length === 8, "fixed exact domain count mismatch");
  need(manifest.selectionChangesAfterFreezeAllowed === false && manifest.seedExtensionAllowed === false && manifest.candidateRescanAllowed === false, "upstream exact manifest protection mismatch");

  const rows = [];
  for (const entry of manifest.domains.slice().sort((a, b) => a.domainIndex - b.domainIndex)) {
    const pState = materializeProduction(entry);
    const iState = materializeIndependent(entry);
    need(T.directStateKey(pState) === V.stateKey(iState), `production/independent root identity mismatch:${entry.domainIndex}`);
    const p = solveProduction(entry, pState);
    const i = solveIndependent(entry, iState);
    const e = expected(entry);
    need(stable(p) === stable(e), `production exact integrity mismatch:${entry.domainIndex}`);
    need(stable(i) === stable(e), `independent exact integrity mismatch:${entry.domainIndex}`);
    need(equalArray(p.rootOptimalMoveKeys, i.rootOptimalMoveKeys), `optimal move disagreement:${entry.domainIndex}`);
    rows.push({ domainIndex: entry.domainIndex, seed: entry.seed, ply: entry.ply, rootStateKey: entry.rootStateKey, exactIntegrity: e });
  }

  const core = {
    studyId: spec.studyId,
    stageId: spec.stageId,
    role: "PRE-FRESH-UPSTREAM-EXACT-ORACLE-INTEGRITY-PREFLIGHT",
    fixedDomainCount: rows.length,
    allProductionIndependentUpstreamAgreement: true,
    rows,
    actualSearchVsExactMeasurements: 0,
    g405CandidateRescanCount: 0,
    g405DomainReplacementCount: 0,
    g410Depth11AccessCount: 0,
    publicAiChanged: false,
    freshStage1SeedReads: 0,
  };
  const result = {
    schemaVersion: 1,
    disposition: "EXACT-ORACLE-INTEGRITY-PREFLIGHT-PASS",
    scientificOutcomeGenerated: false,
    core,
    coreSha256: sha256(Buffer.from(stable(core))),
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ disposition: result.disposition, fixedDomainCount: rows.length, coreSha256: result.coreSha256, actualSearchVsExactMeasurements: 0 }, null, 2));
}

main();
