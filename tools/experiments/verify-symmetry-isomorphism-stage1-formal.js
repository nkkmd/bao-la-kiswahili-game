#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const E = require("../../public/engine.js");
const IV = require("./lib/restricted-endgame-independent-verifier.js");

const REPO_ROOT = path.resolve(__dirname, "../..");
const IDS = Object.freeze({
  IDENTITY: "SIP-C00-IDENTITY", SEAT: "SIP-T01-SEAT-SWAP-LOCAL", LR: "SIP-T02-LR-MTAJI-HOUSELESS",
  SEAT_LR: "SIP-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS", NEG: "SIP-C01-LR-NO-DIRECTION-FLIP",
});
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function sha256Buffer(buffer) { return crypto.createHash("sha256").update(buffer).digest("hex"); }
function sha256File(file) { return sha256Buffer(fs.readFileSync(file)); }
function rawState(state) { return { pits: state.pits.map((rows) => rows.map((row) => row.slice())), reserve: [...state.reserve], houseOwned: [...state.houseOwned], player: state.player, phase: state.phase, winner: state.winner, pending: [...(state.pending || [0, 0])] }; }
function stateKey(state) { return sha256Buffer(Buffer.from(stable(rawState(state)))); }
function moveKey(move) { return [move?.type, move?.phase, move?.row, move?.index, move?.direction, move?.side, move?.houseChoice, Boolean(move?.houseTwo)].join(":"); }
function sorted(values) { return [...values].sort(); }
function sameSet(a, b) { return JSON.stringify(sorted(a)) === JSON.stringify(sorted(b)); }
function swap01(value) { return value === null || value === undefined ? value : 1 - value; }
function flip(value) { return value === "left" ? "right" : value === "right" ? "left" : value; }
function flags(id) {
  if (id === IDS.IDENTITY) return { sp: false, ri: false, fd: false, fs: false, app: "all" };
  if (id === IDS.SEAT) return { sp: true, ri: false, fd: false, fs: false, app: "all" };
  if (id === IDS.LR) return { sp: false, ri: true, fd: true, fs: true, app: "mtaji-houseless" };
  if (id === IDS.SEAT_LR) return { sp: true, ri: true, fd: true, fs: true, app: "mtaji-houseless" };
  if (id === IDS.NEG) return { sp: false, ri: true, fd: false, fs: false, app: "mtaji-houseless" };
  throw new Error(`Unknown candidate ${id}`);
}
function transformStateIndependent(state, id) {
  const f = flags(id); const out = clone(state);
  out.pits = [0, 1].map((targetPlayer) => {
    const sourcePlayer = f.sp ? 1 - targetPlayer : targetPlayer;
    return [0, 1].map((row) => f.ri ? state.pits[sourcePlayer][row].slice().reverse() : state.pits[sourcePlayer][row].slice());
  });
  out.reserve = f.sp ? [state.reserve[1], state.reserve[0]] : [...state.reserve];
  out.houseOwned = f.sp ? [state.houseOwned[1], state.houseOwned[0]] : [...state.houseOwned];
  const pending = state.pending || [0, 0]; out.pending = f.sp ? [pending[1], pending[0]] : [...pending];
  out.player = f.sp ? swap01(state.player) : state.player; out.winner = f.sp ? swap01(state.winner) : state.winner;
  return out;
}
function transformMoveIndependent(move, id) {
  const f = flags(id); const out = clone(move);
  if (typeof out.player === "number" && f.sp) out.player = 1 - out.player;
  if (typeof out.index === "number" && f.ri) out.index = 7 - out.index;
  if (typeof out.start === "number" && f.ri) out.start = 7 - out.start;
  if (typeof out.direction === "string" && f.fd) out.direction = flip(out.direction);
  if (typeof out.side === "string" && f.fs) out.side = flip(out.side);
  return out;
}
function applicable(state, id) {
  const f = flags(id);
  if (f.app === "all") return ["namua", "mtaji"].includes(state.phase);
  return state.phase === "mtaji" && state.reserve[0] === 0 && state.reserve[1] === 0 && state.houseOwned[0] === false && state.houseOwned[1] === false;
}
function mappedWinner(winner, id) { return flags(id).sp && winner !== null ? 1 - winner : winner; }
function valid(state) {
  if (!state || !Array.isArray(state.pits) || state.pits.length !== 2) return false;
  if (state.pits.some((rows) => !Array.isArray(rows) || rows.length !== 2 || rows.some((row) => !Array.isArray(row) || row.length !== 8 || row.some((value) => !Number.isInteger(value) || value < 0)))) return false;
  const pending = state.pending || [0, 0];
  const total = state.pits.flat(2).reduce((a, b) => a + b, 0) + state.reserve.reduce((a, b) => a + b, 0) + pending.reduce((a, b) => a + b, 0);
  return total === 64 && [0, 1].includes(state.player) && ["namua", "mtaji"].includes(state.phase) && [null, 0, 1].includes(state.winner);
}
function inflate(root) { return { ...clone(root.state), turn: root.ply + 1, reason: "" }; }

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5; let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1); next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
function regenerateDomain(domain) {
  const trajectories = [];
  for (let seed = domain.seedBlock.start; seed <= domain.seedBlock.end; seed += 1) {
    const random = seededRandom(seed); let state = E.initialState(); const rows = [{ ply: 0, state: clone(state), moves: [] }]; const moves = []; let guard = false;
    for (let ply = 0; ply < domain.seedBlock.maximumTrajectoryPly; ply += 1) {
      if (state.winner !== null) break; const legal = E.moveVariants(state); if (!legal.length) break;
      const move = clone(legal[Math.floor(random() * legal.length)]); const next = E.applyMove(state, move).state;
      if (next.reason === "relay-limit") { guard = true; break; }
      moves.push(move); state = next; rows.push({ ply: ply + 1, state: clone(state), moves: clone(moves) });
    }
    trajectories.push({ seed, rows, guard });
  }
  function eligible(row, stratum) {
    const state = row.state; if (!valid(state) || state.winner !== null) return false;
    if (stratum === "namua") return state.phase === "namua" && row.ply >= 8;
    if (stratum === "mtaji") return state.phase === "mtaji";
    return state.phase === "mtaji" && state.reserve[0] === 0 && state.reserve[1] === 0 && state.houseOwned[0] === false && state.houseOwned[1] === false;
  }
  const strata = {};
  for (const stratum of ["namua", "mtaji", "mtaji-houseless"]) {
    const map = new Map();
    for (const trajectory of trajectories) {
      const row = trajectory.rows.find((item) => eligible(item, stratum)); if (!row) continue;
      const key = stateKey(row.state); if (!map.has(key)) map.set(key, { stateKey: key, seed: trajectory.seed, ply: row.ply, witnessMoveKeys: row.moves.map(moveKey) });
    }
    strata[stratum] = [...map.values()].sort((a, b) => a.stateKey.localeCompare(b.stateKey)).slice(0, domain.selectionRule.rootCountPerStratum);
  }
  return { guardHits: trajectories.filter((row) => row.guard).length, strata };
}

function graphFor(roots, depth) {
  const states = new Map(); const levels = new Map(); const queue = []; const expanded = new Set(); const edges = []; let technicalFailure = null;
  function add(state, level) { const key = stateKey(state); if (!states.has(key)) states.set(key, clone(state)); if (!levels.has(key) || level < levels.get(key)) { levels.set(key, level); queue.push(key); } return key; }
  for (const root of roots) add(inflate(root), 0);
  while (queue.length && !technicalFailure) {
    const sourceKey = queue.shift(); const level = levels.get(sourceKey); const state = states.get(sourceKey);
    if (state.winner !== null || level >= depth) continue; expanded.add(sourceKey);
    for (const move of E.moveVariants(state)) {
      let next; try { next = E.applyMove(state, move).state; } catch (error) { technicalFailure = { type: "SOURCE-ERROR", error: error.message }; break; }
      if (next.reason === "relay-limit") { technicalFailure = { type: "RUNTIME-GUARD" }; break; }
      const targetKey = add(next, level + 1); edges.push({ sourceKey, move, moveKey: moveKey(move), targetKey });
    }
  }
  return { states, expanded, edges, technicalFailure };
}
function freshCheck(domain, id, strata) {
  const roots = strata.flatMap((stratum) => domain.strata[stratum].roots); const graph = graphFor(roots, domain.selectionRule.localExpansionDepth);
  if (graph.technicalFailure) return { decision: "NON-ESTIMABLE", mismatchCount: 0, technicalFailure: graph.technicalFailure };
  let mismatchCount = 0;
  const tested = new Set([...graph.expanded, ...[...graph.states].filter(([, state]) => state.winner !== null).map(([key]) => key)]);
  for (const key of tested) {
    const source = graph.states.get(key); const transformed = transformStateIndependent(source, id);
    if (!applicable(source, id) || !applicable(transformed, id) || !valid(transformed)) mismatchCount += 1;
    if (stateKey(transformStateIndependent(transformed, id)) !== key) mismatchCount += 1;
    if ((source.winner !== null) !== (transformed.winner !== null)) mismatchCount += 1;
    if (source.winner !== null && transformed.winner !== mappedWinner(source.winner, id)) mismatchCount += 1;
    const sourceMoves = source.winner === null && graph.expanded.has(key) ? E.moveVariants(source) : [];
    const mapped = sourceMoves.map((move) => moveKey(transformMoveIndependent(move, id)));
    const targetMoves = transformed.winner === null && graph.expanded.has(key) ? E.moveVariants(transformed).map(moveKey) : [];
    if (!sameSet(mapped, targetMoves)) mismatchCount += 1;
    for (const move of sourceMoves) if (moveKey(transformMoveIndependent(transformMoveIndependent(move, id), id)) !== moveKey(move)) mismatchCount += 1;
  }
  for (const edge of graph.edges) {
    const source = graph.states.get(edge.sourceKey); const target = graph.states.get(edge.targetKey); const transformedSource = transformStateIndependent(source, id);
    const mappedKey = moveKey(transformMoveIndependent(edge.move, id)); const actual = E.moveVariants(transformedSource).find((move) => moveKey(move) === mappedKey);
    if (!actual) { mismatchCount += 1; continue; }
    const next = E.applyMove(transformedSource, actual).state;
    if (next.reason === "relay-limit") return { decision: "NON-ESTIMABLE", mismatchCount, technicalFailure: { type: "TRANSFORMED-RUNTIME-GUARD" } };
    if (stateKey(next) !== stateKey(transformStateIndependent(target, id))) mismatchCount += 1;
  }
  if (id === IDS.SEAT || id === IDS.IDENTITY) {
    for (const root of roots) {
      let state = transformStateIndependent(E.initialState(), id);
      for (const move of root.witnessMoves) {
        const mappedKey = moveKey(transformMoveIndependent(move, id)); const actual = E.moveVariants(state).find((candidate) => moveKey(candidate) === mappedKey);
        if (!actual) { mismatchCount += 1; break; } state = E.applyMove(state, actual).state;
      }
      if (stateKey(state) !== stateKey(transformStateIndependent(inflate(root), id))) mismatchCount += 1;
    }
  }
  return { decision: mismatchCount ? "NOT-VALIDATED" : "VALIDATED-BOUNDED-ISOMORPHISM", mismatchCount, technicalFailure: null, counts: { roots: roots.length, states: graph.states.size, edges: graph.edges.length, testedStates: tested.size } };
}

function scc(nodes, bySource) {
  let index = 0; const stack = []; const onStack = new Set(); const indices = new Map(); const low = new Map(); const out = [];
  function visit(v) {
    indices.set(v, index); low.set(v, index); index += 1; stack.push(v); onStack.add(v);
    for (const edge of bySource.get(v) || []) {
      const w = edge.targetKey; if (!nodes.has(w)) continue;
      if (!indices.has(w)) { visit(w); low.set(v, Math.min(low.get(v), low.get(w))); } else if (onStack.has(w)) low.set(v, Math.min(low.get(v), indices.get(w)));
    }
    if (low.get(v) === indices.get(v)) { const comp = []; let w; do { w = stack.pop(); onStack.delete(w); comp.push(w); } while (w !== v); out.push(comp); }
  }
  for (const node of nodes) if (!indices.has(node)) visit(node); return out;
}
function solve(states, edges) {
  const bySource = new Map(); for (const edge of edges) { if (!bySource.has(edge.sourceKey)) bySource.set(edge.sourceKey, []); bySource.get(edge.sourceKey).push(edge); }
  const solved = new Map(); for (const [key, state] of states) if (state.winner !== null) solved.set(key, { status: "TERMINAL", absoluteWinner: state.winner, dtf: 0, optimalMoveKeys: [] });
  let changed = true;
  while (changed) {
    changed = false;
    for (const [key, state] of states) {
      if (solved.has(key)) continue; const outgoing = bySource.get(key) || []; const resolved = outgoing.map((edge) => ({ edge, result: solved.get(edge.targetKey) })); const wins = resolved.filter((row) => row.result && row.result.absoluteWinner === state.player);
      if (wins.length) { const dtf = Math.min(...wins.map((row) => row.result.dtf)); solved.set(key, { status: "WIN", absoluteWinner: state.player, dtf: dtf + 1, optimalMoveKeys: sorted(wins.filter((row) => row.result.dtf === dtf).map((row) => row.edge.moveKey)) }); changed = true; continue; }
      if (outgoing.length && resolved.every((row) => row.result && row.result.absoluteWinner === 1 - state.player)) { const dtf = Math.max(...resolved.map((row) => row.result.dtf)); solved.set(key, { status: "LOSS", absoluteWinner: 1 - state.player, dtf: dtf + 1, optimalMoveKeys: sorted(resolved.filter((row) => row.result.dtf === dtf).map((row) => row.edge.moveKey)) }); changed = true; }
    }
  }
  const unresolved = new Set([...states.keys()].filter((key) => !solved.has(key))); const components = scc(unresolved, bySource).filter((comp) => comp.length > 1 || (bySource.get(comp[0]) || []).some((edge) => edge.targetKey === comp[0]));
  for (const key of unresolved) solved.set(key, { status: "RECURRENT", absoluteWinner: null, dtf: null, optimalMoveKeys: [] }); return { solved, components };
}
function oracleCheck(oracle, id) {
  let mismatchCount = 0; const sourceStates = new Map(oracle.stateRows.map((row) => [row.stateKey, { ...clone(row.ruleState), turn: 1, reason: "" }])); const transformedStates = new Map(); const edges = [];
  for (const row of oracle.stateRows) {
    const source = sourceStates.get(row.stateKey); if (!applicable(source, id)) { mismatchCount += 1; continue; }
    const transformed = transformStateIndependent(source, id); const transformedKey = stateKey(transformed); transformedStates.set(transformedKey, transformed);
    if (!valid(transformed) || stateKey(transformStateIndependent(transformed, id)) !== row.stateKey) mismatchCount += 1;
    if (source.winner !== null) { if (transformed.winner !== mappedWinner(source.winner, id)) mismatchCount += 1; continue; }
    const sourceMoves = IV.legalMtajiMoves(source); const targetMoves = IV.legalMtajiMoves(transformed);
    if (!sameSet(sourceMoves.map((move) => moveKey(transformMoveIndependent(move, id))), targetMoves.map(IV.moveKey))) mismatchCount += 1;
    for (const move of sourceMoves) {
      const applied = IV.applyGuardFree(source, move); if (applied.status !== "TERMINATED") return { decision: "NON-ESTIMABLE", mismatchCount, technicalFailure: { type: applied.status } };
      const mappedKey = moveKey(transformMoveIndependent(move, id)); const actual = targetMoves.find((candidate) => IV.moveKey(candidate) === mappedKey);
      if (!actual) { mismatchCount += 1; continue; }
      const transformedApplied = IV.applyGuardFree(transformed, actual); if (transformedApplied.status !== "TERMINATED") return { decision: "NON-ESTIMABLE", mismatchCount, technicalFailure: { type: transformedApplied.status } };
      const expected = stateKey(transformStateIndependent(applied.state, id)); const actualKey = stateKey(transformedApplied.state); if (expected !== actualKey) mismatchCount += 1;
      edges.push({ sourceKey: transformedKey, moveKey: mappedKey, targetKey: actualKey });
    }
  }
  if (transformedStates.size !== oracle.stateRows.length || edges.length !== oracle.domain.edgeCount) mismatchCount += 1;
  const solution = solve(transformedStates, edges);
  for (const row of oracle.stateRows) {
    const source = sourceStates.get(row.stateKey); const result = solution.solved.get(stateKey(transformStateIndependent(source, id))); if (!result) { mismatchCount += 1; continue; }
    if (result.status !== row.status || result.absoluteWinner !== (row.absoluteWinner === null ? null : mappedWinner(row.absoluteWinner, id)) || result.dtf !== row.dtf) mismatchCount += 1;
    const sourceMoves = source.winner === null ? IV.legalMtajiMoves(source) : [];
    const optimal = row.optimalMoveKeys.map((key) => { const move = sourceMoves.find((candidate) => IV.moveKey(candidate) === key); return move ? moveKey(transformMoveIndependent(move, id)) : `UNRESOLVED:${key}`; });
    if (!sameSet(optimal, result.optimalMoveKeys)) mismatchCount += 1;
  }
  if (solution.components.length !== (oracle.recurrentSccs || []).length) mismatchCount += 1;
  return { decision: mismatchCount ? "NOT-VALIDATED" : "VALIDATED-BOUNDED-ISOMORPHISM", mismatchCount, technicalFailure: null, counts: { states: transformedStates.size, edges: edges.length, recurrentSccs: solution.components.length } };
}
function combine(a, b) {
  if (a.decision === "NON-ESTIMABLE" || b.decision === "NON-ESTIMABLE") return "NON-ESTIMABLE";
  if (a.decision === "NOT-VALIDATED" || b.decision === "NOT-VALIDATED") return "NOT-VALIDATED";
  return "VALIDATED-BOUNDED-ISOMORPHISM";
}
function parseArgs() {
  const args = process.argv.slice(2); const valueAfter = (name, fallback) => { const i = args.indexOf(name); return i < 0 ? fallback : args[i + 1]; };
  return {
    spec: valueAfter("--spec", path.join(REPO_ROOT, "doc/symmetry-isomorphic-positions/preregistration/STAGE_1_FORMAL_SPEC.json")),
    auth: valueAfter("--authorization", path.join(REPO_ROOT, "doc/symmetry-isomorphic-positions/preregistration/STAGE_1_AUTHORIZATION.json")),
    production: valueAfter("--production", path.join(REPO_ROOT, "doc/symmetry-isomorphic-positions/results/STAGE_1_PRODUCTION_RESULT.json")),
    output: valueAfter("--output", path.join(REPO_ROOT, "doc/symmetry-isomorphic-positions/results/STAGE_1_INDEPENDENT_VERIFICATION.json")),
  };
}
function main() {
  const options = parseArgs(); const specBytes = fs.readFileSync(options.spec); const spec = JSON.parse(specBytes); const authorization = JSON.parse(fs.readFileSync(options.auth));
  if (!authorization.authorized || authorization.specSha256 !== sha256Buffer(specBytes)) throw new Error("authorization mismatch");
  const files = { engine: path.join(REPO_ROOT, spec.paths.engine), candidateContract: path.join(REPO_ROOT, spec.paths.candidateContract), transformImplementation: path.join(REPO_ROOT, spec.paths.transformImplementation), domain: path.join(REPO_ROOT, spec.paths.domain), oracle: path.join(REPO_ROOT, spec.paths.oracle), runner: path.join(REPO_ROOT, spec.paths.runner), verifier: __filename };
  for (const [key, file] of Object.entries(files)) if (sha256File(file) !== spec.sourceSha256[key]) throw new Error(`source hash mismatch: ${key}`);
  const domain = JSON.parse(fs.readFileSync(files.domain)); const oracle = JSON.parse(fs.readFileSync(files.oracle)); const production = JSON.parse(fs.readFileSync(options.production));
  const regenerated = regenerateDomain(domain); const domainChecks = { runtimeGuardHitsEqual: regenerated.guardHits === domain.trajectorySummary.runtimeGuardHits, strata: {} };
  for (const stratum of ["namua", "mtaji", "mtaji-houseless"]) {
    const expected = domain.strata[stratum].roots.map((root) => ({ stateKey: root.stateKey, seed: root.seed, ply: root.ply, witnessMoveKeys: root.witnessMoveKeys }));
    domainChecks.strata[stratum] = stable(regenerated.strata[stratum]) === stable(expected);
  }
  const outcomeDefinitions = [
    { outcomeId: "SIP-O01-T01-NAMUA", id: IDS.SEAT, strata: ["namua"] },
    { outcomeId: "SIP-O02-T01-MTAJI", id: IDS.SEAT, strata: ["mtaji"] },
    { outcomeId: "SIP-O03-T01-BOTH", id: IDS.SEAT, strata: ["namua", "mtaji"] },
    { outcomeId: "SIP-O04-T02-MTAJI-HOUSELESS", id: IDS.LR, strata: ["mtaji-houseless"] },
    { outcomeId: "SIP-O05-T03-MTAJI-HOUSELESS", id: IDS.SEAT_LR, strata: ["mtaji-houseless"] },
  ];
  const oracleCache = {}; const outcomes = [];
  for (const definition of outcomeDefinitions) {
    if (!oracleCache[definition.id]) oracleCache[definition.id] = oracleCheck(oracle, definition.id);
    const fresh = freshCheck(domain, definition.id, definition.strata); const exactOracle = oracleCache[definition.id]; const decision = combine(fresh, exactOracle);
    const productionRow = production.outcomes.find((row) => row.outcomeId === definition.outcomeId);
    const agreement = Boolean(productionRow) && productionRow.provisionalDecision === decision && productionRow.fresh.mismatchCount === fresh.mismatchCount && productionRow.exactOracle.mismatchCount === exactOracle.mismatchCount;
    outcomes.push({ ...definition, fresh, exactOracle, recomputedDecision: decision, productionAgreement: agreement, finalDecision: agreement ? decision : "NON-ESTIMABLE", G12: agreement ? "PASS" : "FAIL" });
  }
  const controls = [
    { id: IDS.IDENTITY, strata: ["namua", "mtaji"] }, { id: IDS.NEG, strata: ["mtaji-houseless"] },
  ].map((definition) => {
    const fresh = freshCheck(domain, definition.id, definition.strata); const exactOracle = oracleCheck(oracle, definition.id); const decision = combine(fresh, exactOracle); const productionRow = production.controls.find((row) => row.candidateId === definition.id);
    return { ...definition, fresh, exactOracle, recomputedDecision: decision, productionAgreement: Boolean(productionRow) && productionRow.controlDecision === decision && productionRow.fresh.mismatchCount === fresh.mismatchCount && productionRow.exactOracle.mismatchCount === exactOracle.mismatchCount };
  });
  const domainPassed = domainChecks.runtimeGuardHitsEqual && Object.values(domainChecks.strata).every(Boolean);
  const passed = domainPassed && outcomes.every((row) => row.productionAgreement) && controls.every((row) => row.productionAgreement);
  const result = {
    schemaVersion: 1, studyId: "SIP-STUDY1", stageId: spec.stageId, independentVerification: true, passed,
    identities: { specSha256: sha256Buffer(specBytes), productionSha256: sha256File(options.production), verifierSha256: sha256File(__filename) },
    domainRegeneration: domainChecks,
    independence: { candidateTransformImplementationShared: false, graphTraversalImplementationShared: false, serializationImplementationShared: false, freshLegalMoveGeneratorSharedEngine: true, freshTransitionSharedEngine: true, oracleLegalMoveGeneratorSharedProduction: false, oracleGuardFreeTransitionSharedProduction: false, retrogradeImplementationShared: false },
    outcomes, controls,
    summary: { validated: outcomes.filter((row) => row.finalDecision === "VALIDATED-BOUNDED-ISOMORPHISM").length, notValidated: outcomes.filter((row) => row.finalDecision === "NOT-VALIDATED").length, nonEstimable: outcomes.filter((row) => row.finalDecision === "NON-ESTIMABLE").length },
    interpretationBoundary: { globalTheorem: false, fullReachabilityPreservation: false, stateSpaceReductionAuthorized: false, canonicalizationPendingConditionalStage: true },
  };
  fs.mkdirSync(path.dirname(options.output), { recursive: true }); fs.writeFileSync(options.output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ passed: result.passed, summary: result.summary, outcomes: outcomes.map((row) => ({ outcomeId: row.outcomeId, decision: row.finalDecision, G12: row.G12, freshMismatches: row.fresh.mismatchCount, oracleMismatches: row.exactOracle.mismatchCount })) }, null, 2)}\n`);
  if (!passed) process.exitCode = 3;
}

if (require.main === module) main();
