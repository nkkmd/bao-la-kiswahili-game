#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const {
  IDS, exactMoveKey, isApplicable, rawStateKey,
  transformMove, transformState,
} = require("./lib/symmetry-isomorphism-transforms.js");
const { applyMtajiGuardFree, exactMtajiMoves } = require("./lib/restricted-endgame-transition.js");

const REPO_ROOT = path.resolve(__dirname, "../..");
const DEFAULT_SPEC = path.join(REPO_ROOT, "doc/symmetry-isomorphic-positions/preregistration/STAGE_1_FORMAL_SPEC.json");
const DEFAULT_AUTH = path.join(REPO_ROOT, "doc/symmetry-isomorphic-positions/preregistration/STAGE_1_AUTHORIZATION.json");
const DEFAULT_OUTPUT = path.join(REPO_ROOT, "doc/symmetry-isomorphic-positions/results/STAGE_1_PRODUCTION_RESULT.json");
const VERIFIER_PATH = path.join(__dirname, "verify-symmetry-isomorphism-stage1-formal.js");

function sha256Buffer(buffer) { return crypto.createHash("sha256").update(buffer).digest("hex"); }
function sha256File(file) { return sha256Buffer(fs.readFileSync(file)); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function sorted(values) { return [...values].sort(); }
function sameSet(a, b) { return JSON.stringify(sorted(a)) === JSON.stringify(sorted(b)); }
function swapWinner(value, candidateId) {
  if (value === null) return null;
  return [IDS.SEAT_SWAP, IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS].includes(candidateId) ? 1 - value : value;
}
function inflateRoot(root) { return { ...clone(root.state), reason: "", turn: root.ply + 1 }; }

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

function parseArgs() {
  const args = process.argv.slice(2);
  const valueAfter = (name, fallback) => { const i = args.indexOf(name); return i < 0 ? fallback : args[i + 1]; };
  return { spec: valueAfter("--spec", DEFAULT_SPEC), authorization: valueAfter("--authorization", DEFAULT_AUTH), output: valueAfter("--output", DEFAULT_OUTPUT) };
}

function verifyAuthorization(specPath, authPath) {
  const specBytes = fs.readFileSync(specPath);
  const spec = JSON.parse(specBytes);
  const auth = JSON.parse(fs.readFileSync(authPath));
  if (auth.studyId !== "SIP-STUDY1" || auth.stageId !== spec.stageId || auth.authorized !== true) throw new Error("Stage 1 not authorized");
  if (auth.specSha256 !== sha256Buffer(specBytes)) throw new Error("Authorization/spec SHA256 mismatch");
  if (auth.scientificOutcomeGeneratedBeforeAuthorization !== false) throw new Error("Invalid authorization chronology");
  const p = spec.paths;
  const expected = spec.sourceSha256;
  const files = {
    engine: path.join(REPO_ROOT, p.engine), candidateContract: path.join(REPO_ROOT, p.candidateContract),
    transformImplementation: path.join(REPO_ROOT, p.transformImplementation), domain: path.join(REPO_ROOT, p.domain),
    oracle: path.join(REPO_ROOT, p.oracle), runner: __filename, verifier: VERIFIER_PATH,
  };
  for (const [key, file] of Object.entries(files)) {
    if (sha256File(file) !== expected[key]) throw new Error(`Source hash mismatch: ${key}`);
  }
  return { spec, auth, files, specSha256: sha256Buffer(specBytes) };
}

function expandLocalGraph(roots, depth) {
  const states = new Map();
  const levels = new Map();
  const queue = [];
  const edges = [];
  const expanded = new Set();
  const terminalKeys = new Set();
  let technicalFailure = null;
  function add(state, level) {
    const key = rawStateKey(state);
    if (!states.has(key)) states.set(key, clone(state));
    if (!levels.has(key) || level < levels.get(key)) { levels.set(key, level); queue.push(key); }
    if (state.winner !== null) terminalKeys.add(key);
    return key;
  }
  for (const root of roots) add(inflateRoot(root), 0);
  while (queue.length && !technicalFailure) {
    const sourceKey = queue.shift();
    const level = levels.get(sourceKey);
    const state = states.get(sourceKey);
    if (state.winner !== null || level >= depth) continue;
    expanded.add(sourceKey);
    const moves = E.moveVariants(state);
    for (const move of moves) {
      let next;
      try { next = E.applyMove(state, move).state; } catch (error) {
        technicalFailure = { type: "SOURCE-TRANSITION-ERROR", sourceKey, moveKey: exactMoveKey(move), error: error.message }; break;
      }
      if (next.reason === "relay-limit") { technicalFailure = { type: "RUNTIME-GUARD", sourceKey, moveKey: exactMoveKey(move) }; break; }
      const targetKey = add(next, level + 1);
      edges.push({ sourceKey, move: clone(move), moveKey: exactMoveKey(move), targetKey });
    }
  }
  return { states, levels, edges, expanded, terminalKeys, technicalFailure };
}

function checkWitness(root, candidateId) {
  if (candidateId !== IDS.SEAT_SWAP && candidateId !== IDS.IDENTITY) return { status: "N/A", reason: "candidate is not applicable to the full standard-initial witness" };
  let state = transformState(E.initialState(), candidateId);
  for (const sourceMove of root.witnessMoves) {
    const mapped = transformMove(sourceMove, candidateId);
    const mappedKey = exactMoveKey(mapped);
    const actual = E.moveVariants(state).find((m) => exactMoveKey(m) === mappedKey);
    if (!actual) return { status: "FAIL", reason: "mapped witness move illegal", mappedMoveKey: mappedKey };
    const next = E.applyMove(state, actual).state;
    if (next.reason === "relay-limit") return { status: "NON-ESTIMABLE", reason: "runtime guard on transformed witness" };
    state = next;
  }
  const expected = rawStateKey(transformState(inflateRoot(root), candidateId));
  return { status: rawStateKey(state) === expected ? "PASS" : "FAIL", finalStateKey: rawStateKey(state), expectedStateKey: expected };
}

function validateFreshScope(domain, candidateId, strataNames, depth) {
  const roots = strataNames.flatMap((name) => domain.strata[name].roots);
  const graph = expandLocalGraph(roots, depth);
  const mismatches = [];
  const gateFailures = new Set();
  const mismatchCounts = {};
  const record = (gate, type, data = {}) => {
    gateFailures.add(gate); mismatchCounts[type] = (mismatchCounts[type] || 0) + 1;
    if (mismatches.length < 100) mismatches.push({ gate, type, ...data });
  };
  if (graph.technicalFailure) return {
    technicalFailure: graph.technicalFailure, decision: "NON-ESTIMABLE",
    gates: Object.fromEntries([1,2,3,4,5,6,7,8].map((n) => [`G${n}`, "NON-ESTIMABLE"])),
    counts: { roots: roots.length, states: graph.states.size, edges: graph.edges.length }, mismatchCount: 0, mismatches: [], mismatchCounts: {}, witness: [],
  };
  const testedKeys = new Set([...graph.expanded, ...graph.terminalKeys]);
  for (const key of testedKeys) {
    const source = graph.states.get(key);
    let transformed;
    try { transformed = transformState(source, candidateId); } catch (error) { record("G1", "TRANSFORM-ERROR", { stateKey: key, error: error.message }); continue; }
    if (!isApplicable(source, candidateId) || !isApplicable(transformed, candidateId)) record("G2", "APPLICABILITY-FAIL", { stateKey: key });
    if (!validRuleState(transformed)) record("G2", "TRANSFORMED-STATE-INVALID", { stateKey: key });
    try {
      const twice = transformState(transformed, candidateId);
      if (rawStateKey(twice) !== key) record("G3", "STATE-INVERSE-MISMATCH", { stateKey: key, twiceKey: rawStateKey(twice) });
    } catch (error) { record("G3", "STATE-INVERSE-ERROR", { stateKey: key, error: error.message }); }
    const terminalSource = source.winner !== null;
    const terminalTarget = transformed.winner !== null;
    if (terminalSource !== terminalTarget) record("G6", "TERMINAL-MISMATCH", { stateKey: key });
    if (terminalSource && transformed.winner !== swapWinner(source.winner, candidateId)) record("G7", "WINNER-MISMATCH", { stateKey: key, sourceWinner: source.winner, transformedWinner: transformed.winner });
    const sourceMoves = source.winner === null && graph.expanded.has(key) ? E.moveVariants(source) : [];
    const mappedMoves = [];
    for (const move of sourceMoves) {
      try {
        const mapped = transformMove(move, candidateId); mappedMoves.push(exactMoveKey(mapped));
        if (exactMoveKey(transformMove(mapped, candidateId)) !== exactMoveKey(move)) record("G3", "MOVE-INVERSE-MISMATCH", { stateKey: key, moveKey: exactMoveKey(move) });
      } catch (error) { record("G1", "MOVE-TRANSFORM-ERROR", { stateKey: key, moveKey: exactMoveKey(move), error: error.message }); }
    }
    const targetMoves = transformed.winner === null && graph.expanded.has(key) ? E.moveVariants(transformed).map(exactMoveKey) : [];
    if (!sameSet(mappedMoves, targetMoves)) record("G4", "LEGAL-MOVE-SET-MISMATCH", { stateKey: key, mappedMoves: sorted(mappedMoves), targetMoves: sorted(targetMoves) });
  }
  for (const edge of graph.edges) {
    const source = graph.states.get(edge.sourceKey);
    const target = graph.states.get(edge.targetKey);
    const transformedSource = transformState(source, candidateId);
    const mappedKey = exactMoveKey(transformMove(edge.move, candidateId));
    const actual = E.moveVariants(transformedSource).find((m) => exactMoveKey(m) === mappedKey);
    if (!actual) { record("G5", "MAPPED-MOVE-ILLEGAL", { sourceKey: edge.sourceKey, moveKey: edge.moveKey, mappedMoveKey: mappedKey }); continue; }
    let actualTarget;
    try { actualTarget = E.applyMove(transformedSource, actual).state; } catch (error) { record("G5", "TRANSFORMED-APPLY-ERROR", { sourceKey: edge.sourceKey, mappedMoveKey: mappedKey, error: error.message }); continue; }
    if (actualTarget.reason === "relay-limit") return {
      technicalFailure: { type: "TRANSFORMED-RUNTIME-GUARD", sourceKey: edge.sourceKey, mappedMoveKey: mappedKey }, decision: "NON-ESTIMABLE",
      gates: Object.fromEntries([1,2,3,4,5,6,7,8].map((n) => [`G${n}`, "NON-ESTIMABLE"])), counts: { roots: roots.length, states: graph.states.size, edges: graph.edges.length },
      mismatchCount: Object.values(mismatchCounts).reduce((a,b) => a+b, 0), mismatchCounts, mismatches, witness: [],
    };
    const expectedKey = rawStateKey(transformState(target, candidateId));
    if (rawStateKey(actualTarget) !== expectedKey) record("G5", "TRANSITION-COMMUTATION-MISMATCH", { sourceKey: edge.sourceKey, moveKey: edge.moveKey, mappedMoveKey: mappedKey, expectedKey, actualKey: rawStateKey(actualTarget) });
  }
  const witness = roots.map((root) => ({ stateKey: root.stateKey, ...checkWitness(root, candidateId) }));
  if (witness.some((row) => row.status === "FAIL")) gateFailures.add("G8");
  if (witness.some((row) => row.status === "NON-ESTIMABLE")) return {
    technicalFailure: { type: "WITNESS-NON-ESTIMABLE" }, decision: "NON-ESTIMABLE",
    gates: Object.fromEntries([1,2,3,4,5,6,7,8].map((n) => [`G${n}`, n === 8 ? "NON-ESTIMABLE" : (gateFailures.has(`G${n}`) ? "FAIL" : "PASS")])),
    counts: { roots: roots.length, states: graph.states.size, edges: graph.edges.length }, mismatchCount: Object.values(mismatchCounts).reduce((a,b) => a+b, 0), mismatchCounts, mismatches, witness,
  };
  const gates = {};
  for (let n = 1; n <= 8; n += 1) {
    const gate = `G${n}`;
    if (n === 8 && ![IDS.SEAT_SWAP, IDS.IDENTITY].includes(candidateId)) gates[gate] = "N/A";
    else gates[gate] = gateFailures.has(gate) ? "FAIL" : "PASS";
  }
  const mismatchCount = Object.values(mismatchCounts).reduce((a,b) => a+b, 0);
  return { technicalFailure: null, decision: mismatchCount ? "NOT-VALIDATED" : "VALIDATED-BOUNDED-ISOMORPHISM", gates, counts: { roots: roots.length, states: graph.states.size, edges: graph.edges.length, testedStates: testedKeys.size }, mismatchCount, mismatchCounts, mismatches, witness };
}

function tarjan(nodes, edgesBySource) {
  let index = 0; const stack = []; const onStack = new Set(); const indices = new Map(); const low = new Map(); const out = [];
  function strong(v) {
    indices.set(v, index); low.set(v, index); index += 1; stack.push(v); onStack.add(v);
    for (const edge of edgesBySource.get(v) || []) {
      const w = edge.targetKey; if (!nodes.has(w)) continue;
      if (!indices.has(w)) { strong(w); low.set(v, Math.min(low.get(v), low.get(w))); }
      else if (onStack.has(w)) low.set(v, Math.min(low.get(v), indices.get(w)));
    }
    if (low.get(v) === indices.get(v)) {
      const comp = []; let w; do { w = stack.pop(); onStack.delete(w); comp.push(w); } while (w !== v); out.push(comp.sort());
    }
  }
  for (const v of [...nodes].sort()) if (!indices.has(v)) strong(v);
  return out;
}

function solveCompleteGraph(states, edges) {
  const bySource = new Map();
  for (const edge of edges) { if (!bySource.has(edge.sourceKey)) bySource.set(edge.sourceKey, []); bySource.get(edge.sourceKey).push(edge); }
  const solved = new Map();
  for (const [key, state] of states) if (state.winner !== null) solved.set(key, { status: "TERMINAL", absoluteWinner: state.winner, dtf: 0, optimalMoveKeys: [] });
  let changed = true;
  while (changed) {
    changed = false;
    for (const [key, state] of states) {
      if (solved.has(key)) continue;
      const outgoing = bySource.get(key) || [];
      const resolved = outgoing.map((edge) => ({ edge, result: solved.get(edge.targetKey) }));
      const wins = resolved.filter(({ result }) => result && result.absoluteWinner === state.player);
      if (wins.length) {
        const min = Math.min(...wins.map(({ result }) => result.dtf));
        solved.set(key, { status: "WIN", absoluteWinner: state.player, dtf: min + 1, optimalMoveKeys: sorted(wins.filter(({ result }) => result.dtf === min).map(({ edge }) => edge.moveKey)) }); changed = true; continue;
      }
      if (outgoing.length && resolved.every(({ result }) => result && result.absoluteWinner === 1 - state.player)) {
        const max = Math.max(...resolved.map(({ result }) => result.dtf));
        solved.set(key, { status: "LOSS", absoluteWinner: 1 - state.player, dtf: max + 1, optimalMoveKeys: sorted(resolved.filter(({ result }) => result.dtf === max).map(({ edge }) => edge.moveKey)) }); changed = true;
      }
    }
  }
  const unresolved = new Set([...states.keys()].filter((key) => !solved.has(key)));
  const sccs = tarjan(unresolved, bySource).filter((comp) => comp.length > 1 || (bySource.get(comp[0]) || []).some((edge) => edge.targetKey === comp[0]));
  for (const key of unresolved) solved.set(key, { status: "RECURRENT", absoluteWinner: null, dtf: null, optimalMoveKeys: [] });
  return { solved, recurrentSccs: sccs };
}

function validateOracle(oracle, candidateId) {
  const mismatches = []; const counts = {};
  const fail = (gate, type, data = {}) => { counts[type] = (counts[type] || 0) + 1; if (mismatches.length < 100) mismatches.push({ gate, type, ...data }); };
  const sourceStates = new Map(oracle.stateRows.map((row) => [row.stateKey, { ...clone(row.ruleState), reason: "", turn: 1 }]));
  const transformedStates = new Map(); const edges = [];
  let technicalFailure = null;
  for (const row of oracle.stateRows) {
    const source = sourceStates.get(row.stateKey);
    if (!isApplicable(source, candidateId)) { fail("G2", "ORACLE-NOT-APPLICABLE", { stateKey: row.stateKey }); continue; }
    const transformed = transformState(source, candidateId); const transformedKey = rawStateKey(transformed); transformedStates.set(transformedKey, transformed);
    if (!validRuleState(transformed)) fail("G2", "ORACLE-TRANSFORMED-INVALID", { stateKey: row.stateKey });
    if (rawStateKey(transformState(transformed, candidateId)) !== row.stateKey) fail("G3", "ORACLE-STATE-INVERSE", { stateKey: row.stateKey });
    if ((source.winner !== null) !== (transformed.winner !== null)) fail("G6", "ORACLE-TERMINAL-MISMATCH", { stateKey: row.stateKey });
    if (source.winner !== null && transformed.winner !== swapWinner(source.winner, candidateId)) fail("G7", "ORACLE-WINNER-MISMATCH", { stateKey: row.stateKey });
    if (source.winner !== null) continue;
    const sourceMoves = exactMtajiMoves(source);
    const mappedKeys = sourceMoves.map((move) => exactMoveKey(transformMove(move, candidateId)));
    const targetMoves = exactMtajiMoves(transformed);
    if (!sameSet(mappedKeys, targetMoves.map(exactMoveKey))) fail("G4", "ORACLE-LEGAL-SET-MISMATCH", { stateKey: row.stateKey, mappedKeys: sorted(mappedKeys), targetKeys: sorted(targetMoves.map(exactMoveKey)) });
    for (const move of sourceMoves) {
      const applied = applyMtajiGuardFree(source, move); if (applied.status !== "TERMINATED") { technicalFailure = { type: applied.status, stateKey: row.stateKey }; break; }
      const sourceTargetKey = rawStateKey(applied.state);
      if (!sourceStates.has(sourceTargetKey)) fail("G5", "ORACLE-SOURCE-EDGE-ESCAPE", { stateKey: row.stateKey, moveKey: exactMoveKey(move), targetKey: sourceTargetKey });
      const mappedKey = exactMoveKey(transformMove(move, candidateId));
      const targetMove = targetMoves.find((candidate) => exactMoveKey(candidate) === mappedKey);
      if (!targetMove) { fail("G5", "ORACLE-MAPPED-MOVE-ILLEGAL", { stateKey: row.stateKey, moveKey: exactMoveKey(move), mappedKey }); continue; }
      const transformedApplied = applyMtajiGuardFree(transformed, targetMove); if (transformedApplied.status !== "TERMINATED") { technicalFailure = { type: transformedApplied.status, stateKey: transformedKey }; break; }
      const expected = rawStateKey(transformState(applied.state, candidateId)); const actual = rawStateKey(transformedApplied.state);
      if (actual !== expected) fail("G5", "ORACLE-COMMUTATION-MISMATCH", { stateKey: row.stateKey, moveKey: exactMoveKey(move), expected, actual });
      edges.push({ sourceKey: transformedKey, moveKey: mappedKey, targetKey: actual });
    }
    if (technicalFailure) break;
  }
  if (technicalFailure) return { decision: "NON-ESTIMABLE", technicalFailure, gates: { G9: "NON-ESTIMABLE", G10: "NON-ESTIMABLE", G11: "NON-ESTIMABLE" }, mismatchCount: Object.values(counts).reduce((a,b) => a+b, 0), mismatchCounts: counts, mismatches };
  if (transformedStates.size !== oracle.stateRows.length) fail("G9", "ORACLE-STATE-BIJECTION-COUNT", { transformed: transformedStates.size, expected: oracle.stateRows.length });
  if (edges.length !== oracle.domain.edgeCount) fail("G9", "ORACLE-EDGE-BIJECTION-COUNT", { transformed: edges.length, expected: oracle.domain.edgeCount });
  const solution = solveCompleteGraph(transformedStates, edges);
  for (const row of oracle.stateRows) {
    const source = sourceStates.get(row.stateKey); const transformedKey = rawStateKey(transformState(source, candidateId)); const result = solution.solved.get(transformedKey);
    if (!result) { fail("G9", "ORACLE-SOLUTION-MISSING", { stateKey: row.stateKey }); continue; }
    if (result.status !== row.status) fail("G9", "ORACLE-VALUE-MISMATCH", { stateKey: row.stateKey, sourceStatus: row.status, transformedStatus: result.status });
    const expectedWinner = row.absoluteWinner === null ? null : swapWinner(row.absoluteWinner, candidateId);
    if (result.absoluteWinner !== expectedWinner) fail("G9", "ORACLE-ABSOLUTE-WINNER-MISMATCH", { stateKey: row.stateKey, expectedWinner, actualWinner: result.absoluteWinner });
    if (result.dtf !== row.dtf) fail("G10", "ORACLE-DTF-MISMATCH", { stateKey: row.stateKey, expected: row.dtf, actual: result.dtf });
    const mappedOptimal = row.optimalMoveKeys.map((key) => {
      const move = exactMtajiMoves(source).find((candidate) => exactMoveKey(candidate) === key);
      return move ? exactMoveKey(transformMove(move, candidateId)) : `UNRESOLVED:${key}`;
    });
    if (!sameSet(mappedOptimal, result.optimalMoveKeys)) fail("G11", "ORACLE-OPTIMAL-MOVE-MISMATCH", { stateKey: row.stateKey, expected: sorted(mappedOptimal), actual: sorted(result.optimalMoveKeys) });
  }
  if (solution.recurrentSccs.length !== (oracle.recurrentSccs || []).length) fail("G9", "ORACLE-RECURRENT-SCC-COUNT-MISMATCH", { expected: (oracle.recurrentSccs || []).length, actual: solution.recurrentSccs.length });
  const mismatchCount = Object.values(counts).reduce((a,b) => a+b, 0);
  return {
    decision: mismatchCount ? "NOT-VALIDATED" : "VALIDATED-BOUNDED-ISOMORPHISM", technicalFailure: null,
    gates: { G9: mismatches.some((row) => row.gate === "G9") ? "FAIL" : "PASS", G10: mismatches.some((row) => row.gate === "G10") ? "FAIL" : "PASS", G11: mismatches.some((row) => row.gate === "G11") ? "FAIL" : "PASS" },
    counts: { states: transformedStates.size, edges: edges.length, recurrentSccs: solution.recurrentSccs.length }, mismatchCount, mismatchCounts: counts, mismatches,
  };
}

function combineDecision(fresh, oracle) {
  if (fresh.decision === "NON-ESTIMABLE" || oracle.decision === "NON-ESTIMABLE") return "NON-ESTIMABLE";
  if (fresh.decision === "NOT-VALIDATED" || oracle.decision === "NOT-VALIDATED") return "NOT-VALIDATED";
  return "VALIDATED-BOUNDED-ISOMORPHISM";
}

function main() {
  const options = parseArgs();
  const binding = verifyAuthorization(options.spec, options.authorization);
  const domain = JSON.parse(fs.readFileSync(binding.files.domain));
  const oracle = JSON.parse(fs.readFileSync(binding.files.oracle));
  if (!domain.eligibility?.passed) throw new Error("Frozen Stage 1 domain is not eligible");
  const scientific = [
    { outcomeId: "SIP-O01-T01-NAMUA", candidateId: IDS.SEAT_SWAP, strata: ["namua"] },
    { outcomeId: "SIP-O02-T01-MTAJI", candidateId: IDS.SEAT_SWAP, strata: ["mtaji"] },
    { outcomeId: "SIP-O03-T01-BOTH", candidateId: IDS.SEAT_SWAP, strata: ["namua", "mtaji"] },
    { outcomeId: "SIP-O04-T02-MTAJI-HOUSELESS", candidateId: IDS.LR_MTAJI_HOUSELESS, strata: ["mtaji-houseless"] },
    { outcomeId: "SIP-O05-T03-MTAJI-HOUSELESS", candidateId: IDS.SEAT_SWAP_LR_MTAJI_HOUSELESS, strata: ["mtaji-houseless"] },
  ];
  const oracleByCandidate = {};
  for (const candidateId of [...new Set(scientific.map((row) => row.candidateId))]) oracleByCandidate[candidateId] = validateOracle(oracle, candidateId);
  const outcomes = scientific.map((item) => {
    const fresh = validateFreshScope(domain, item.candidateId, item.strata, domain.selectionRule.localExpansionDepth);
    const anchor = oracleByCandidate[item.candidateId];
    return { ...item, fresh, exactOracle: anchor, provisionalDecision: combineDecision(fresh, anchor), G12: "PENDING-INDEPENDENT-VERIFICATION" };
  });
  const controls = [IDS.IDENTITY, IDS.NEGATIVE_LR_NO_DIRECTION].map((candidateId) => {
    const strata = candidateId === IDS.IDENTITY ? ["namua", "mtaji"] : ["mtaji-houseless"];
    const fresh = validateFreshScope(domain, candidateId, strata, domain.selectionRule.localExpansionDepth);
    const exactOracle = validateOracle(oracle, candidateId);
    return { candidateId, fresh, exactOracle, controlDecision: combineDecision(fresh, exactOracle) };
  });
  const result = {
    schemaVersion: 1, studyId: "SIP-STUDY1", stageId: binding.spec.stageId,
    formalOutcomeGenerated: true, productionImplementation: true, independentVerificationComplete: false,
    identities: { specSha256: binding.specSha256, authorizationSha256: sha256File(options.authorization), domainSha256: sha256File(binding.files.domain), candidateContractSha256: sha256File(binding.files.candidateContract), oracleSha256: sha256File(binding.files.oracle) },
    claimBoundary: "Fresh results are exact only over the frozen selected roots and depth-3 bounded local source graphs; oracle results are exact only over the immutable 8-state REWR frozen domain. No global Bao/Namua/Mtaji theorem is claimed.",
    outcomes, controls,
    summary: { validated: outcomes.filter((row) => row.provisionalDecision === "VALIDATED-BOUNDED-ISOMORPHISM").length, notValidated: outcomes.filter((row) => row.provisionalDecision === "NOT-VALIDATED").length, nonEstimable: outcomes.filter((row) => row.provisionalDecision === "NON-ESTIMABLE").length },
    interpretationBoundary: { globalSymmetryClaimAuthorized: false, allReachableStatesClaimAuthorized: false, stateSpaceReductionAuthorized: false, canonicalizationAuthorized: false, groupClaimAuthorized: false },
  };
  fs.mkdirSync(path.dirname(options.output), { recursive: true }); fs.writeFileSync(options.output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ stageId: result.stageId, summary: result.summary, outcomes: outcomes.map((row) => ({ outcomeId: row.outcomeId, candidateId: row.candidateId, decision: row.provisionalDecision, freshMismatches: row.fresh.mismatchCount, oracleMismatches: row.exactOracle.mismatchCount })) }, null, 2)}\n`);
}

if (require.main === module) main();
