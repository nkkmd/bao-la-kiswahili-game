#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");

const E = require("../../public/engine.js");
const { seededRandom } = require("../benchmark.js");
const T = require("./lib/restricted-endgame-transition.js");
const TB = require("./lib/restricted-endgame-tablebase.js");
const LGT = require("./lib/lgtgmiv-stage1-production.js");
const Bridge = require("./lib/lgtgecb-formal-production.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY = path.join(ROOT, "doc/local-game-tree-geometry-exact-consequence-bridge");
const SPEC_PATH = path.join(STUDY, "preregistration/STAGE_1_FORMAL_SPEC.json");
const MANIFEST_PATH = path.join(STUDY, "preregistration/STAGE_1_FORMAL_INPUT_MANIFEST.json");
const AUTH_PATH = path.join(STUDY, "authorizations/STAGE_1_AUTHORIZATION.json");

function need(value, message) { if (!value) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function blob(file) { return cp.execFileSync("git", ["hash-object", file], { cwd: ROOT, encoding: "utf8" }).trim(); }
function equalArray(a, b) { return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort()); }

function authorize(auth, spec) {
  need(auth.studyId === "LGTGECB-STUDY1" && auth.stageId === spec.stageId, "INVALID-AUTH-IDENTITY");
  need(auth.executionAuthorized === true && auth.formalBridgeDecisionAuthorized === true, "EXECUTION-NOT-AUTHORIZED");
  need(auth.allowedEvent === process.env.GITHUB_EVENT_NAME, "UNAUTHORIZED-EVENT");
  need(auth.allowedRunAttempt === Number(process.env.GITHUB_RUN_ATTEMPT), "UNAUTHORIZED-RUN-ATTEMPT");
  need(process.env.GITHUB_ACTIONS === "true", "GITHUB-ACTIONS-REQUIRED");
  need(process.env.GITHUB_REF === `refs/heads/${auth.authorizedBranch}`, "UNAUTHORIZED-BRANCH");
  for (const [file, expected] of Object.entries(auth.sourceGitBlobSha || {})) {
    need(blob(file) === expected, `SOURCE-FREEZE-MISMATCH:${file}`);
  }
}

function materializeFixedRoot(entry) {
  const random = seededRandom(entry.seed);
  let state = E.initialState();
  const moveKeys = [];
  for (let ply = 0; ply < entry.ply; ply += 1) {
    need(state.winner === null, `ROOT-TRAJECTORY-TERMINATED-EARLY:${entry.domainIndex}:${ply}`);
    const moves = E.moveVariants(state).map(clone).sort((a, b) => T.moveKey(a).localeCompare(T.moveKey(b)));
    need(moves.length > 0, `ROOT-TRAJECTORY-NO-MOVE:${entry.domainIndex}:${ply}`);
    const move = moves[Math.min(moves.length - 1, Math.floor(random() * moves.length))];
    moveKeys.push(T.moveKey(move));
    state = E.applyMove(state, move).state;
    need(state.reason !== "relay-limit", `ROOT-TRAJECTORY-RELAY-LIMIT:${entry.domainIndex}:${ply + 1}`);
  }
  const rootStateKey = T.directStateKey(state);
  need(rootStateKey === entry.rootStateKey, `ROOT-KEY-MISMATCH:${entry.domainIndex}`);
  need(state.phase === "mtaji" && state.winner === null, `ROOT-CONTRACT-MISMATCH:${entry.domainIndex}`);
  const exactLegalMoveCount = T.exactMtajiMoves(state).length;
  need(exactLegalMoveCount === entry.rootLegalMoveCount, `ROOT-LEGAL-WIDTH-MISMATCH:${entry.domainIndex}`);
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
  const solved = TB.solveExactTablebase([state], {
    maxStates: entry.stateCount,
    maxEdges: entry.edgeCount,
    maxMicrostates: entry.maximumMoveMicrosteps,
  });
  need(solved.graph.stateCount === entry.stateCount, `STATE-COUNT-MISMATCH:${entry.domainIndex}`);
  need(solved.graph.edgeCount === entry.edgeCount, `EDGE-COUNT-MISMATCH:${entry.domainIndex}`);
  need(solved.graph.stateSetSha256 === entry.stateSetSha256, `STATE-DIGEST-MISMATCH:${entry.domainIndex}`);
  need(solved.graph.transitionSetSha256 === entry.transitionSetSha256, `TRANSITION-DIGEST-MISMATCH:${entry.domainIndex}`);
  need(solved.solution.solutionSha256 === entry.solutionSha256, `SOLUTION-DIGEST-MISMATCH:${entry.domainIndex}`);
  need(solved.graph.maxMoveMicrosteps <= entry.maximumMoveMicrosteps, `MOVE-MICROSTEP-CEILING:${entry.domainIndex}`);
  const rootRow = solved.solution.rows.find((row) => row.stateKey === entry.rootStateKey);
  const rootNode = solved.graph.graphNodes.find((node) => node.id === entry.rootStateKey);
  need(rootRow && rootNode, `ROOT-SOLUTION-MISSING:${entry.domainIndex}`);
  need(rootRow.status === entry.rootStatus, `ROOT-STATUS-MISMATCH:${entry.domainIndex}`);
  need(rootRow.absoluteWinner === entry.rootAbsoluteWinner, `ROOT-WINNER-MISMATCH:${entry.domainIndex}`);
  need(rootRow.dtf === entry.rootDtf, `ROOT-DTF-MISMATCH:${entry.domainIndex}`);
  need(equalArray(rootRow.optimalMoveKeys || [], entry.rootOptimalMoveKeys), `ROOT-OPTIMAL-MOVES-MISMATCH:${entry.domainIndex}`);
  return { solved, rootRow, rootNode };
}

function formalRow(entry, spec) {
  const materialized = materializeFixedRoot(entry);
  const exact = solveAndVerify(entry, materialized.state);
  const measurement = LGT.measureRoot(E, materialized.source, spec.geometryMeasurement.relativeHorizon);
  need(measurement.reconstructionCore.rootRawSha256 === entry.rootStateKey, `GEOMETRY-ROOT-MISMATCH:${entry.domainIndex}`);
  const geometry = Bridge.geometryScalars(measurement);
  for (const scalar of spec.geometryMeasurement.scalars) need(geometry[scalar.id]?.defined === true, `GEOMETRY-UNDEFINED:${entry.domainIndex}:${scalar.id}`);
  const exactConsequences = Bridge.exactConsequences(exact.rootNode, exact.rootRow, exact.solved.solution.rows);
  need(exactConsequences["EXACT-VALUE"] === entry.rootStatus, `EXACT-VALUE-UPSTREAM-MISMATCH:${entry.domainIndex}`);
  need(exactConsequences["EXACT-DTF"] === entry.rootDtf, `EXACT-DTF-UPSTREAM-MISMATCH:${entry.domainIndex}`);
  need(equalArray(exactConsequences.solverOptimalMoveKeys, entry.rootOptimalMoveKeys), `SECONDARY-INTEGRITY-MISMATCH:${entry.domainIndex}`);
  return {
    domainIndex: entry.domainIndex,
    upstreamCandidateIndex: entry.upstreamCandidateIndex,
    seed: entry.seed,
    ply: entry.ply,
    rootStateKey: entry.rootStateKey,
    rematerialization: {
      rootStateKey: materialized.rootStateKey,
      exactLegalMoveCount: materialized.exactLegalMoveCount,
      sourceTrajectorySha256: materialized.source.sourceTrajectorySha256,
      openingPrefixSha256: materialized.source.openingPrefixSha256,
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
    exact: exactConsequences,
  };
}

function main() {
  const outputPath = path.resolve(process.argv[2]);
  const spec = readJson(SPEC_PATH);
  const manifest = readJson(MANIFEST_PATH);
  const auth = readJson(AUTH_PATH);
  authorize(auth, spec);
  need(manifest.stageId === spec.stageId && manifest.formalDomainCount === spec.domainCount, "MANIFEST-SPEC-MISMATCH");
  need(manifest.domains.length === spec.domainCount, "MANIFEST-DOMAIN-COUNT-MISMATCH");

  const rows = manifest.domains.slice().sort((a, b) => a.domainIndex - b.domainIndex).map((entry) => formalRow(entry, spec));
  const relations = Bridge.relationMatrix(rows, spec);
  need(relations.length === spec.relationMatrix.length, "RELATION-COUNT-MISMATCH");

  const core = {
    formalDomainCount: rows.length,
    experimentalUnit: spec.experimentalUnit,
    rows,
    relations,
    studyLevelDecision: spec.formalDecision.successToken,
  };
  const result = {
    schemaVersion: 1,
    agenda: "G4-06",
    studyId: spec.studyId,
    stageId: spec.stageId,
    resultRole: "formal-geometry-exact-bridge-production",
    formalBridgeDecisionAuthorized: true,
    studyLevelDecision: spec.formalDecision.successToken,
    wholeBaoGeneralizationAuthorized: false,
    publicAiChangeAuthorized: false,
    g405CandidateRescanCount: 0,
    g410Depth11AccessCount: 0,
    core,
    coreSha256: sha256(Buffer.from(stable(core))),
  };
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  const reopened = JSON.parse(fs.readFileSync(outputPath, "utf8"));
  need(sha256(Buffer.from(stable(reopened.core))) === result.coreSha256, "RESULT-REOPEN-HASH-MISMATCH");
  console.log(JSON.stringify({
    studyLevelDecision: result.studyLevelDecision,
    formalDomainCount: rows.length,
    relationCount: relations.length,
    coreSha256: result.coreSha256,
    g405CandidateRescanCount: 0,
    g410Depth11AccessCount: 0,
  }, null, 2));
}

main();
