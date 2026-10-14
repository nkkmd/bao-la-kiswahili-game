"use strict";
const assert = require("node:assert/strict");
const P = require("../g5-01/transition/runtime-engine.cjs"), I = require("../g5-01/transition/independent-engine.cjs");
const M = require("../g5-01/measurement.cjs"), F = require("../g5-01/transition/fixtures.cjs");
const SolverP = require("../../experiments/lib/restricted-endgame-retrograde.js");
const SolverI = require("../../experiments/lib/restricted-endgame-retrograde-independent.js");
const fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib");
function priorFirewall() {
  const base = path.resolve(__dirname, "../../../doc/research-generation-5");
  const old = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(base, "g5-01/development/results/EVIDENCE.json.gz")))).developmentReadIdentities;
  const newer = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(base, "g5-02/results/EVIDENCE.json.gz")))).supplyReadIdentities;
  return new Set([...old, ...newer]);
}
const normalize = s => ({ ...M.raw(s), reason: s.reason ?? "", turn: s.turn });
const sorted = moves => moves.map(m => ({ key: M.moveKey(m), move: m })).sort((a, b) => a.key < b.key ? -1 : 1);
const nextUint = value => { let v = value >>> 0; v ^= v << 13; v ^= v >>> 17; v ^= v << 5; return v >>> 0; };
function draw(state, width) {
  const bound = Math.floor(4294967296 / width) * width, values = [];
  let value = state;
  do { value = nextUint(value); values.push(value); } while (value >= bound);
  return { values, randomState: value, index: value % width };
}
function eligible(state, ply, width, spec) {
  return state.winner === null && state.phase === "mtaji" && state.reserve.every(v => v === 0)
    && ply >= spec.minPly && width >= spec.minWidth && width <= spec.maxWidth
    && state.pits.flat(2).filter(v => v > 0).length <= spec.maxOccupied
    && Math.min(...state.pits.map(rows => rows[0].reduce((a, b) => a + b, 0))) <= spec.maxSmallFront;
}
function technicalFirewall() {
  // 固定fixtureのrootと相対深さ2までの読取済み状態を再構成する。科学的seedは使わない。
  const seen = new Set(), all = new Set(), queue = F.corpus().map(f => ({ state: structuredClone(f.state), depth: 0 }));
  for (let n = 0; n < queue.length; n++) {
    const { state, depth } = queue[n], key = M.rawKey(state); all.add(key);
    if (depth >= 2 || seen.has(key)) continue; seen.add(key);
    for (const m of P.moveVariantsForSearch(state)) {
      const child = P.applyMoveForSearch(state, m).state;
      if (child.reason !== "relay-limit") queue.push({ state: child, depth: depth + 1 });
    }
  }
  return all;
}
function probe(state, spec, check = () => {}) {
  const states = new Map(), edges = []; let status = null;
  function visit(current, remaining) {
    check(); const id = M.rawKey(current); states.set(id, current);
    if (current.winner !== null) return true;
    if (remaining === 0) { status = "PROBE-DEPTH-NOT-CLOSED"; return false; }
    const choices = sorted(P.moveVariantsForSearch(current));
    assert.deepEqual(choices.map(x => x.key), sorted(I.moveVariants(current, { mode: "runtime" })).map(x => x.key));
    if (!choices.length || choices.length > spec.probeMaxWidth) { status = "PROBE-WIDTH-EXCLUDED"; return false; }
    for (const { key, move } of choices) {
      check();
      const child = P.applyMoveForSearch(current, move).state;
      const to = M.rawKey(child); states.set(to, child);
      if (child.reason === "relay-limit") { status = "PROBE-RUNTIME-GUARD"; return false; }
      const exact = I.applyMove(current, move, { maxMicrostates: spec.maxMicrostates });
      if (exact.status !== "TERMINATED") { status = "PROBE-" + exact.status; return false; }
      assert.deepEqual(normalize(exact.state), normalize(child), "Probe child differs");
      edges.push({ from: id, moveKey: key, to });
      if (!visit(child, remaining - 1)) return false;
    }
    return true;
  }
  const complete = visit(state, spec.probeDepth);
  return { rootKey: M.rawKey(state), status: complete ? "PROBE-COMPLETE" : status,
    states: [...states].map(([id, state]) => ({ id, state })), edges };
}
function generateSource(seed, spec, excluded, check = () => {}) {
  assert.ok(Number.isInteger(seed) && seed > 0 && seed <= 4294967295);
  let state = P.initialState(), randomState = seed;
  const trace = [], probes = [];
  for (let ply = 0; ply <= spec.maxPly; ply++) {
    check();
    if (state.winner !== null) return { seed, trace, probes, stop: "TERMINAL-BEFORE-CANDIDATE", finalState: state, candidate: null };
    const choices = sorted(P.moveVariantsForSearch(state));
    assert.deepEqual(sorted(I.moveVariants(state, { mode: "runtime" })).map(x => x.key), choices.map(x => x.key), "Source move set differs");
    if (eligible(state, ply, choices.length, spec)) {
      const examined = { ply, ...probe(state, spec, check) }; probes.push(examined);
      if (examined.status === "PROBE-COMPLETE") {
        const raw = M.rawKey(state), rejected = examined.states.some(s => excluded.has(s.id));
        return { seed, trace, probes, stop: rejected ? "BOUNDED-DOMAIN-OVERLAP-EXCLUDED" : "FIRST-ELIGIBLE-ROOT", finalState: state,
          candidate: rejected ? null : { state, raw, ply, width: choices.length } };
      }
      if (!["PROBE-DEPTH-NOT-CLOSED", "PROBE-WIDTH-EXCLUDED"].includes(examined.status)) {
        return { seed, trace, probes, stop: examined.status, finalState: state, candidate: null };
      }
    }
    if (ply === spec.maxPly) return { seed, trace, probes, stop: "PLY-LIMIT", finalState: state, candidate: null };
    assert.ok(choices.length, "Nonterminal source without legal moves");
    const picked = draw(randomState, choices.length), { key, move } = choices[picked.index];
    const child = P.applyMoveForSearch(state, move).state;
    const independent = I.applyMove(state, move, { maxMicrostates: spec.maxMicrostates });
    if (child.reason === "relay-limit" || independent.status !== "TERMINATED") {
      return { seed, trace, probes, stop: child.reason === "relay-limit" ? "RUNTIME-GUARD" : independent.status,
        finalState: state, candidate: null, stoppedMove: move,
        stoppedDraw: { randomBefore: randomState, values: picked.values, index: picked.index } };
    }
    assert.deepEqual(normalize(independent.state), normalize(child), "Source child differs");
    trace.push({ ply, moveKey: key, move, randomBefore: randomState, draws: picked.values,
      rawBefore: M.rawKey(state), rawAfter: M.rawKey(child) });
    randomState = picked.randomState; state = child;
  }
  throw Error("Unreachable source stop");
}
function buildClosure(root, spec, globalCheck = () => {}, excluded = new Set()) {
  const start = performance.now(), rootKey = M.rawKey(root), states = new Map([[rootKey, structuredClone(root)]]);
  const queue = [rootKey], nodes = [], edges = []; let stop = null, stopWitness = null;
  const stopIf = code => { stop = code; };
  const check = () => { try { globalCheck(); return true; } catch (e) { stopIf(e.message); return false; } };
  outer: for (let n = 0; n < queue.length; n++) {
    if (!check()) break;
    if (excluded.has(queue[n])) { stopIf("PRIOR-READ-OVERLAP"); stopWitness = { raw: queue[n] }; break; }
    if (performance.now() - start > spec.maxDomainMs) { stopIf("TIME-LIMIT"); break; }
    const id = queue[n], state = states.get(id), moves = sorted(P.moveVariantsForSearch(state));
    assert.deepEqual(sorted(I.moveVariants(state, { mode: "runtime" })).map(x => x.key), moves.map(x => x.key), "Closure move set differs");
    const node = { id, player: state.player, winner: state.winner, moves: [] };
    if (state.winner === null) assert.ok(moves.length, "Nonterminal closure state without moves");
    for (const { key, move } of moves) {
      if (!check()) break outer;
      if (performance.now() - start > spec.maxDomainMs) { stopIf("TIME-LIMIT"); break outer; }
      if (edges.length >= spec.maxEdges) { stopIf("EDGE-LIMIT"); break outer; }
      const child = P.applyMoveForSearch(state, move).state;
      if (child.reason === "relay-limit") { stopIf("RUNTIME-GUARD"); break outer; }
      const exact = I.applyMove(state, move, { maxMicrostates: spec.maxMicrostates });
      if (exact.status !== "TERMINATED") { stopIf(exact.status); break outer; }
      assert.deepEqual(normalize(exact.state), normalize(child), "Closure child differs");
      const to = M.rawKey(child);
      if (excluded.has(to)) {
        stopIf("PRIOR-READ-OVERLAP"); stopWitness = { from: id, moveKey: key, raw: to, state: child }; break outer;
      }
      if (!states.has(to)) {
        if (states.size >= spec.maxStates) {
          stopIf("STATE-LIMIT"); stopWitness = { from: id, moveKey: key, raw: to, state: child }; break outer;
        }
        states.set(to, child); queue.push(to);
      }
      node.moves.push({ key, to }); edges.push({ from: id, moveKey: key, to });
    }
    nodes.push(node);
  }
  const fullStates = [...states].map(([id, state]) => ({ id, state }));
  if (stop) return { status: stop, stopWitness, complete: false, rootKey, states: fullStates, nodes, edges, solution: null,
    elapsedMs: Math.round(performance.now() - start) };
  const solution = SolverP.solveRetrograde(nodes), independent = SolverI.solveIndependent(nodes);
  assert.deepEqual(solution, independent, "Independent solution differs");
  if (performance.now() - start > spec.maxDomainMs) {
    return { status: "TIME-LIMIT", complete: false, rootKey, states: fullStates, nodes, edges, solution: null,
      elapsedMs: Math.round(performance.now() - start) };
  }
  return { status: "COMPLETE-INDEPENDENT-AGREEMENT", complete: true, rootKey, states: fullStates,
    nodes, edges, solution, elapsedMs: Math.round(performance.now() - start) };
}
function domainGroups(domains) {
  const parent = domains.map((_, i) => i), owners = new Map();
  function find(i) { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; }
  for (let i = 0; i < domains.length; i++) for (const { id } of domains[i].states) {
    if (owners.has(id)) parent[find(i)] = find(owners.get(id)); else owners.set(id, i);
  }
  const groups = new Map(); domains.forEach((_, i) => { const key = find(i); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(i); });
  return [...groups.values()];
}
module.exports = { sorted, nextUint, draw, eligible, technicalFirewall, priorFirewall, probe, generateSource, buildClosure, domainGroups, normalize };
