#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");

const E = require("../../public/engine.js");
const V = require("./lib/restricted-endgame-independent-verifier.js");
const ITB = require("./lib/restricted-endgame-tablebase-independent.js");
const LGT = require("./lib/lgtgmiv-stage1-independent.js");
const Bridge = require("./lib/lgtgecb-formal-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY = path.join(ROOT, "doc/local-game-tree-geometry-exact-consequence-bridge");
const SPEC_PATH = path.join(STUDY, "preregistration/STAGE_1_FORMAL_SPEC.json");
const MANIFEST_PATH = path.join(STUDY, "preregistration/STAGE_1_FORMAL_INPUT_MANIFEST.json");
const AUTH_PATH = path.join(STUDY, "authorizations/STAGE_1_AUTHORIZATION.json");

function assert(value, message) { if (!value) throw new Error(`independent:${message}`); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function blob(file) { return cp.execFileSync("git", ["hash-object", file], { cwd: ROOT, encoding: "utf8" }).trim(); }
function equalArray(a, b) { const x = [...a].sort(), y = [...b].sort(); return x.length === y.length && x.every((value, index) => value === y[index]); }
function rng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let n = value;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

function authorize(auth, spec) {
  assert(auth.studyId === "LGTGECB-STUDY1" && auth.stageId === spec.stageId, "invalid auth identity");
  assert(auth.executionAuthorized === true && auth.formalBridgeDecisionAuthorized === true, "execution not authorized");
  assert(process.env.GITHUB_ACTIONS === "true", "GitHub Actions required");
  assert(auth.allowedEvent === process.env.GITHUB_EVENT_NAME, "event mismatch");
  assert(auth.allowedRunAttempt === Number(process.env.GITHUB_RUN_ATTEMPT), "run attempt mismatch");
  assert(process.env.GITHUB_REF === `refs/heads/${auth.authorizedBranch}`, "branch mismatch");
  for (const [file, expected] of Object.entries(auth.sourceGitBlobSha || {})) assert(blob(file) === expected, `source freeze mismatch:${file}`);
}

function materializeFixedRoot(entry) {
  const random = rng(entry.seed);
  let state = E.initialState();
  const moveKeys = [];
  for (let ply = 0; ply < entry.ply; ply += 1) {
    assert(state.winner === null, `trajectory ended early:${entry.domainIndex}:${ply}`);
    const moves = E.moveVariants(state).map(clone).sort((a, b) => V.moveKey(a).localeCompare(V.moveKey(b)));
    assert(moves.length > 0, `no move:${entry.domainIndex}:${ply}`);
    const move = moves[Math.min(moves.length - 1, Math.floor(random() * moves.length))];
    moveKeys.push(V.moveKey(move));
    state = E.applyMove(state, move).state;
    assert(state.reason !== "relay-limit", `relay-limit:${entry.domainIndex}:${ply + 1}`);
  }
  const rootStateKey = V.stateKey(state);
  assert(rootStateKey === entry.rootStateKey, `root key mismatch:${entry.domainIndex}`);
  assert(state.phase === "mtaji" && state.winner === null, `root contract mismatch:${entry.domainIndex}`);
  const exactLegalMoveCount = V.legalMtajiMoves(state).length;
  assert(exactLegalMoveCount === entry.rootLegalMoveCount, `root width mismatch:${entry.domainIndex}`);
  return {
    state: clone(state),
    rootStateKey,
    exactLegalMoveCount,
    source: {
      phase: state.phase,
      sourceSeed: entry.seed,
      selectedPly: entry.ply,
      rootRawSha256: rootStateKey,
      sourceTrajectorySha256: sha256(Buffer.from(moveKeys.join("\n"))),
      openingPrefixSha256: sha256(Buffer.from(moveKeys.slice(0, 16).join("\n"))),
      openingPrefixLength: Math.min(16, moveKeys.length),
      rootState: clone(state),
    },
  };
}

function solveAndVerify(entry, state) {
  const solved = ITB.solveIndependentTablebase([state], {
    maxStates: entry.stateCount,
    maxEdges: entry.edgeCount,
    maxMicrostates: entry.maximumMoveMicrosteps,
  });
  assert(solved.graph.stateCount === entry.stateCount, `state count mismatch:${entry.domainIndex}`);
  assert(solved.graph.edgeCount === entry.edgeCount, `edge count mismatch:${entry.domainIndex}`);
  assert(solved.graph.stateSetSha256 === entry.stateSetSha256, `state digest mismatch:${entry.domainIndex}`);
  assert(solved.graph.transitionSetSha256 === entry.transitionSetSha256, `transition digest mismatch:${entry.domainIndex}`);
  assert(solved.solution.solutionSha256 === entry.solutionSha256, `solution digest mismatch:${entry.domainIndex}`);
  const rootRow = solved.solution.rows.find((row) => row.stateKey === entry.rootStateKey);
  const rootNode = solved.graph.graphNodes.find((node) => node.id === entry.rootStateKey);
  assert(rootRow && rootNode, `root solution missing:${entry.domainIndex}`);
  assert(rootRow.status === entry.rootStatus, `root status mismatch:${entry.domainIndex}`);
  assert(rootRow.absoluteWinner === entry.rootAbsoluteWinner, `root winner mismatch:${entry.domainIndex}`);
  assert(rootRow.dtf === entry.rootDtf, `root DTF mismatch:${entry.domainIndex}`);
  assert(equalArray(rootRow.optimalMoveKeys || [], entry.rootOptimalMoveKeys), `root optimal moves mismatch:${entry.domainIndex}`);
  return { solved, rootRow, rootNode };
}

function independentRow(entry, spec) {
  const root = materializeFixedRoot(entry);
  const exact = solveAndVerify(entry, root.state);
  const measurement = LGT.measureRoot(E, root.source, spec.geometryMeasurement.relativeHorizon);
  assert(measurement.reconstructionCore.rootRawSha256 === entry.rootStateKey, `geometry root mismatch:${entry.domainIndex}`);
  const geometry = Bridge.geometryScalars(measurement);
  for (const scalar of spec.geometryMeasurement.scalars) assert(geometry[scalar.id]?.defined === true, `undefined geometry:${entry.domainIndex}:${scalar.id}`);
  const consequences = Bridge.exactConsequences(exact.rootNode, exact.rootRow, exact.solved.solution.rows);
  assert(consequences["EXACT-VALUE"] === entry.rootStatus, `value mismatch:${entry.domainIndex}`);
  assert(consequences["EXACT-DTF"] === entry.rootDtf, `DTF mismatch:${entry.domainIndex}`);
  assert(equalArray(consequences.solverOptimalMoveKeys, entry.rootOptimalMoveKeys), `secondary exact integrity mismatch:${entry.domainIndex}`);
  return {
    domainIndex: entry.domainIndex,
    upstreamCandidateIndex: entry.upstreamCandidateIndex,
    seed: entry.seed,
    ply: entry.ply,
    rootStateKey: entry.rootStateKey,
    rematerialization: {
      rootStateKey: root.rootStateKey,
      exactLegalMoveCount: root.exactLegalMoveCount,
      sourceTrajectorySha256: root.source.sourceTrajectorySha256,
      openingPrefixSha256: root.source.openingPrefixSha256,
    },
    upstreamExactIntegrity: {
      stateCount: exact.solved.graph.stateCount,
      edgeCount: exact.solved.graph.edgeCount,
      stateSetSha256: exact.solved.graph.stateSetSha256,
      transitionSetSha256: exact.solved.graph.transitionSetSha256,
      solutionSha256: exact.solved.solution.solutionSha256,
      maxMoveMicrosteps: exact.solved.graph.maxMoveMicrosteps,
    },
    geometryMeasurement: {
      rootReconstructionCoreSha256: measurement.rootReconstructionCoreSha256,
      rootFamilyCoreSha256: measurement.rootFamilyCoreSha256,
    },
    geometry,
    exact: consequences,
  };
}

function scientificComparable(row) {
  return {
    domainIndex: row.domainIndex,
    upstreamCandidateIndex: row.upstreamCandidateIndex,
    seed: row.seed,
    ply: row.ply,
    rootStateKey: row.rootStateKey,
    rematerialization: {
      rootStateKey: row.rematerialization.rootStateKey,
      exactLegalMoveCount: row.rematerialization.exactLegalMoveCount,
    },
    upstreamExactIntegrity: row.upstreamExactIntegrity,
    geometryMeasurement: row.geometryMeasurement,
    geometry: row.geometry,
    exact: row.exact,
  };
}

function main() {
  const productionPath = path.resolve(process.argv[2]);
  const outputPath = path.resolve(process.argv[3]);
  const spec = readJson(SPEC_PATH);
  const manifest = readJson(MANIFEST_PATH);
  const auth = readJson(AUTH_PATH);
  authorize(auth, spec);
  assert(manifest.stageId === spec.stageId && manifest.domains.length === spec.domainCount, "manifest/spec mismatch");

  const productionBytes = fs.readFileSync(productionPath);
  const production = JSON.parse(productionBytes);
  assert(production.studyId === spec.studyId && production.stageId === spec.stageId, "production identity mismatch");
  assert(production.studyLevelDecision === spec.formalDecision.successToken, "production decision mismatch");
  assert(production.g405CandidateRescanCount === 0 && production.g410Depth11AccessCount === 0 && production.publicAiChangeAuthorized === false, "production protected boundary mismatch");

  const rows = manifest.domains.slice().sort((a, b) => a.domainIndex - b.domainIndex).map((entry) => independentRow(entry, spec));
  assert(rows.length === production.core.rows.length, "production/independent row count mismatch");
  for (let index = 0; index < rows.length; index += 1) {
    assert(stable(scientificComparable(rows[index])) === stable(scientificComparable(production.core.rows[index])), `production/independent root mismatch:${index + 1}`);
  }
  const relations = Bridge.relationMatrix(rows, spec);
  assert(stable(relations) === stable(production.core.relations), "production/independent relation matrix mismatch");

  const core = {
    formalDomainCount: rows.length,
    allRootScientificComparablesMatch: true,
    relationMatrixAgreement: true,
    rows,
    relations,
    productionCoreSha256: production.coreSha256,
    studyLevelDecision: spec.formalDecision.successToken,
  };
  const result = {
    schemaVersion: 1,
    agenda: "G4-06",
    studyId: spec.studyId,
    stageId: spec.stageId,
    resultRole: "independent-formal-geometry-exact-bridge-verification",
    studyLevelDecision: spec.formalDecision.successToken,
    allProductionIndependentAgreement: true,
    wholeBaoGeneralizationAuthorized: false,
    publicAiChangeAuthorized: false,
    g405CandidateRescanCount: 0,
    g410Depth11AccessCount: 0,
    productionResultFileSha256: sha256(productionBytes),
    verification: core,
    verificationCoreSha256: sha256(Buffer.from(stable(core))),
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  const reopened = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  assert(sha256(Buffer.from(stable(reopened.verification))) === result.verificationCoreSha256, "verification reopen/hash mismatch");
  console.log(JSON.stringify({
    studyLevelDecision: result.studyLevelDecision,
    formalDomainCount: rows.length,
    relationCount: relations.length,
    allProductionIndependentAgreement: true,
    productionResultFileSha256: result.productionResultFileSha256,
    verificationCoreSha256: result.verificationCoreSha256,
  }, null, 2));
}

main();
