#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const AI = require("../../public/ai.js");
const { seededRandom } = require("../benchmark.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY = path.join(ROOT, "doc/search-reliability-decision-robustness");
const SPEC_PATH = path.join(STUDY, "preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const DEFAULT_OUTPUT = path.join(ROOT, "artifacts/local/search-reliability-decision-robustness/stage1-development-v1");
const WIN = 1_000_000;

class BudgetExhausted extends Error {}
function clone(v) { return JSON.parse(JSON.stringify(v)); }
function stable(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`;
}
function sha(v) { return crypto.createHash("sha256").update(Buffer.isBuffer(v) ? v : Buffer.from(String(v))).digest("hex"); }
function read(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function write(file, v) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(v, null, 2)}\n`); }
function rawObject(s) { return { pits: clone(s.pits), reserve: clone(s.reserve), houseOwned: clone(s.houseOwned), player: s.player, phase: s.phase, winner: s.winner, pending: clone(s.pending) }; }
function rawKey(s) { return stable(rawObject(s)); }
function key(m) { return AI.moveKey(m); }
function legal(s) { return E.moveVariants(s).slice().sort((a, b) => key(a).localeCompare(key(b))); }
function terminalScore(s, player, ply) { return s.winner === null ? null : (s.winner === player ? WIN - ply : -WIN + ply); }
function scoreClass(x) { return x > WIN / 2 ? "root-win-mate-domain" : x < -WIN / 2 ? "root-loss-mate-domain" : "ordinary-evaluation-domain"; }
function evaluator(s, player) { return AI.evaluateWithProfile(s, player, "bao"); }
function counters() { return { nodes: 0, nominalNodes: 0, quiescenceNodes: 0, evaluations: 0, cutoffs: 0 }; }
function consume(budget, c, type) {
  if (budget.limit !== null && budget.used >= budget.limit) { budget.exhausted = true; throw new BudgetExhausted(); }
  budget.used += 1; c.nodes += 1; if (type === "nominal") c.nominalNodes += 1; else c.quiescenceNodes += 1;
}
function addCounters(to, from) { for (const k of Object.keys(to)) to[k] += from[k]; }
function captures(s) { return legal(s).filter((m) => m.type === "capture"); }
function qsearch(s, alpha, beta, player, c, ply, remaining, budget) {
  consume(budget, c, "quiescence");
  const term = terminalScore(s, player, ply); if (term !== null) return term;
  const moves = captures(s);
  if (!moves.length || remaining === 0) { c.evaluations += 1; return evaluator(s, player); }
  const max = s.player === player; let best = max ? -Infinity : Infinity;
  for (const move of moves) {
    const value = qsearch(E.applyMove(s, move).state, alpha, beta, player, c, ply + 1, remaining - 1, budget);
    if (max) { best = Math.max(best, value); alpha = Math.max(alpha, best); }
    else { best = Math.min(best, value); beta = Math.min(beta, best); }
    if (beta <= alpha) { c.cutoffs += 1; break; }
  }
  return best;
}
function ab(s, depth, alpha, beta, player, c, ply, qDepth, budget) {
  consume(budget, c, "nominal");
  const term = terminalScore(s, player, ply); if (term !== null) return term;
  if (depth === 0) return qsearch(s, alpha, beta, player, c, ply, qDepth, budget);
  const moves = legal(s);
  if (!moves.length) return s.player === player ? -WIN + ply : WIN - ply;
  const max = s.player === player; let best = max ? -Infinity : Infinity;
  for (const move of moves) {
    const value = ab(E.applyMove(s, move).state, depth - 1, alpha, beta, player, c, ply + 1, qDepth, budget);
    if (max) { best = Math.max(best, value); alpha = Math.max(alpha, best); }
    else { best = Math.min(best, value); beta = Math.min(beta, best); }
    if (beta <= alpha) { c.cutoffs += 1; break; }
  }
  return best;
}
function depthSearch(s, depth, qDepth, budget) {
  const player = s.player; const rows = []; const aggregate = counters();
  for (const move of legal(s)) {
    const c = counters(); const after = E.applyMove(s, move).state;
    const score = ab(after, depth - 1, -Infinity, Infinity, player, c, 1, qDepth, budget);
    addCounters(aggregate, c);
    rows.push({ moveKey: key(move), score, scoreClass: scoreClass(score), c });
  }
  const ranked = rows.slice().sort((a, b) => b.score - a.score || a.moveKey.localeCompare(b.moveKey));
  const bestScore = ranked[0].score;
  const topSet = ranked.filter((x) => x.score === bestScore).map((x) => x.moveKey).sort();
  const second = ranked.length >= 2 ? ranked[1].score : null;
  return {
    depth, legalMoveCount: ranked.length, bestScore, secondBestScore: second,
    bestSecondGap: second === null ? null : bestScore - second, topSetMoveKeys: topSet,
    topSetSize: topSet.length, canonicalBestMoveKey: topSet[0], aggregateCounters: aggregate,
    candidates: ranked.map((x, i) => ({ moveKey: x.moveKey, score: x.score, scoreClass: x.scoreClass,
      ordinal: i + 1, scoreRank: 1 + ranked.filter((y) => y.score > x.score).length, isTopSet: x.score === bestScore })),
  };
}
function exhaustiveQ(s, player, ply, remaining) {
  const term = terminalScore(s, player, ply); if (term !== null) return term;
  const moves = captures(s); if (!moves.length || remaining === 0) return evaluator(s, player);
  const values = moves.map((m) => exhaustiveQ(E.applyMove(s, m).state, player, ply + 1, remaining - 1));
  return s.player === player ? Math.max(...values) : Math.min(...values);
}
function pvTail(s, depth, player, ply, qDepth) {
  const term = terminalScore(s, player, ply);
  if (term !== null || depth === 0) return { score: term !== null ? term : exhaustiveQ(s, player, ply, qDepth), moveKeys: [] };
  const moves = legal(s); if (!moves.length) return { score: s.player === player ? -WIN + ply : WIN - ply, moveKeys: [] };
  const max = s.player === player; let selected = null;
  for (const move of moves) {
    const child = pvTail(E.applyMove(s, move).state, depth - 1, player, ply + 1, qDepth);
    const candidate = { score: child.score, moveKey: key(move), tail: child.moveKeys };
    if (!selected || (max && candidate.score > selected.score) || (!max && candidate.score < selected.score)
      || (candidate.score === selected.score && candidate.moveKey < selected.moveKey)) selected = candidate;
  }
  return { score: selected.score, moveKeys: [selected.moveKey, ...selected.tail] };
}
function pv(s, result, qDepth) {
  const root = legal(s).find((m) => key(m) === result.canonicalBestMoveKey);
  const tail = pvTail(E.applyMove(s, root).state, result.depth - 1, s.player, 1, qDepth);
  if (tail.score !== result.bestScore) throw new Error("independent PV score mismatch");
  return { semantics: "canonical-exact-nominal-pv/quiescence-score-only/v1", moveKeys: [key(root), ...tail.moveKeys], nominalPlyLength: 1 + tail.moveKeys.length, score: tail.score };
}
function compactExact(s, depth, qDepth) {
  const budget = { limit: null, used: 0, exhausted: false }; const result = depthSearch(s, depth, qDepth, budget);
  return { estimable: true, mode: "fixed-depth-exact-complete-root", completedDepth: depth, nodeBudget: null,
    nodeBudgetUsed: budget.used, budgetExhausted: false, result, principalVariation: pv(s, result, qDepth) };
}
function compactBudget(s, maxDepth, limit, qDepth) {
  const budget = { limit, used: 0, exhausted: false }; const completed = []; let attemptedDepth = 0; let abortedDepth = null;
  for (let depth = 1; depth <= maxDepth; depth += 1) {
    attemptedDepth = depth;
    try { completed.push(depthSearch(s, depth, qDepth, budget)); }
    catch (e) { if (!(e instanceof BudgetExhausted)) throw e; abortedDepth = depth; break; }
  }
  const result = completed.length ? completed[completed.length - 1] : null;
  if (!result) return { estimable: false, mode: "node-budgeted-iterative-deepening-last-complete-root-iteration", completedDepth: 0,
    attemptedDepth, abortedDepth, nodeBudget: limit, nodeBudgetUsed: budget.used, budgetExhausted: budget.exhausted, result: null, principalVariation: null };
  return { estimable: true, mode: "node-budgeted-iterative-deepening-last-complete-root-iteration", completedDepth: result.depth,
    attemptedDepth, abortedDepth, nodeBudget: limit, nodeBudgetUsed: budget.used, budgetExhausted: budget.exhausted,
    result, principalVariation: pv(s, result, qDepth) };
}
function replay(seed, spec) {
  const random = seededRandom(seed); let state = E.initialState(); const moves = [];
  const observations = [{ ply: 0, state: clone(state), rawStateKey: rawKey(state), phase: state.phase, terminal: state.winner !== null,
    legalMoveCount: state.winner === null ? E.moveVariants(state).length : 0 }];
  for (let ply = 0; ply < spec.population.maxPly && state.winner === null; ply += 1) {
    let move;
    if (ply < spec.population.opening.plies) { const choices = E.moveVariants(state); move = choices[Math.floor(random() * choices.length)]; }
    else {
      const g = spec.population.continuation;
      const r = AI.analyzeMove(state, g.level, () => 0, { searchProfile: g.searchProfile, evaluationProfile: g.evaluationProfile,
        maxDepth: g.maxDepth, timeLimitMs: Infinity, quiescenceDepth: g.quiescenceDepth, orderQuiescenceCaptures: g.orderQuiescenceCaptures,
        adaptive: g.adaptive, stableBestDepths: g.stableBestDepths, aspirationWindow: g.aspirationWindow });
      if (!r.move || r.stats.timedOut || r.stats.completedDepth !== g.maxDepth) throw new Error(`independent continuation incomplete seed=${seed} ply=${ply}`);
      move = r.move;
    }
    state = E.applyMove(state, move).state; const rk = rawKey(state);
    moves.push({ moveKey: key(move), afterRawStateKey: rk });
    observations.push({ ply: ply + 1, state: clone(state), rawStateKey: rk, phase: state.phase, terminal: state.winner !== null,
      legalMoveCount: state.winner === null ? E.moveVariants(state).length : 0 });
  }
  return { seed, gameId: `SRDR-S1-G${seed}`, historicalTrajectoryHash: sha(stable(moves)),
    openingPrefixHash: sha(stable(moves.slice(0, spec.population.opening.plies).map((x) => x.moveKey))), moves, observations,
    terminal: state.winner !== null, terminalPly: moves.length };
}
function representatives(games) {
  const map = new Map(); for (const g of games) { const cur = map.get(g.historicalTrajectoryHash); if (!cur || g.seed < cur.seed || (g.seed === cur.seed && g.gameId < cur.gameId)) map.set(g.historicalTrajectoryHash, g); }
  return [...map.values()].sort((a, b) => a.seed - b.seed || a.gameId.localeCompare(b.gameId));
}
function assigned(g, spec) { const d = sha(`${spec.stateSelection.phaseAssignment.salt}|${g.historicalTrajectoryHash}`); return Number.parseInt(d.slice(0, 8), 16) % 2 === 0 ? "namua" : "mtaji"; }
function rank(g, o, spec) { return sha([spec.stateSelection.withinAssignedPhase.salt, g.historicalTrajectoryHash, o.rawStateKey, o.ply].join("|")); }
function select(games, spec) {
  const reps = representatives(games); const preliminary = []; let unavailable = 0;
  for (const g of reps) {
    const phase = assigned(g, spec); const eligible = g.observations.filter((o) => o.ply >= spec.stateSelection.minimumPly && !o.terminal && o.phase === phase && o.legalMoveCount >= spec.stateSelection.minimumLegalMoveVariants);
    if (!eligible.length) { unavailable += 1; continue; }
    const r = eligible.map((o) => ({ observation: o, rank: rank(g, o, spec) })).sort((a, b) => a.rank.localeCompare(b.rank) || a.observation.rawStateKey.localeCompare(b.observation.rawStateKey) || a.observation.ply - b.observation.ply)[0];
    preliminary.push({ seed: g.seed, gameId: g.gameId, historicalTrajectoryHash: g.historicalTrajectoryHash, openingPrefixHash: g.openingPrefixHash,
      assignedPhase: phase, selectionRank: r.rank, ply: r.observation.ply, phase: r.observation.phase, rawStateKey: r.observation.rawStateKey,
      legalMoveCount: r.observation.legalMoveCount, state: clone(r.observation.state) });
  }
  const map = new Map();
  for (const row of preliminary) {
    const cur = map.get(row.rawStateKey); const better = !cur || row.selectionRank < cur.selectionRank
      || (row.selectionRank === cur.selectionRank && row.historicalTrajectoryHash < cur.historicalTrajectoryHash)
      || (row.selectionRank === cur.selectionRank && row.historicalTrajectoryHash === cur.historicalTrajectoryHash && row.seed < cur.seed);
    if (better) map.set(row.rawStateKey, row);
  }
  const selected = [...map.values()].sort((a, b) => a.selectionRank.localeCompare(b.selectionRank) || a.historicalTrajectoryHash.localeCompare(b.historicalTrajectoryHash));
  const core = selected.map(({ state, ...row }) => ({ ...row, state: rawObject(state) }));
  return { reps, preliminary, selected, unavailable, selectionHash: sha(stable(core)) };
}
function measure(row, spec) {
  const conditions = {};
  for (const c of spec.searchGrid.conditions) conditions[c.id] = c.kind === "exact-depth" ? compactExact(row.state, c.depth, c.quiescenceDepth) : compactBudget(row.state, c.maxDepth, c.nodeBudget, c.quiescenceDepth);
  return { seed: row.seed, gameId: row.gameId, historicalTrajectoryHash: row.historicalTrajectoryHash, openingPrefixHash: row.openingPrefixHash,
    selectionRank: row.selectionRank, ply: row.ply, phase: row.phase, rawStateKey: row.rawStateKey, legalMoveCount: row.legalMoveCount, conditions };
}
function measurementCore(rows) { return rows.map((r) => ({ historicalTrajectoryHash: r.historicalTrajectoryHash, rawStateKey: r.rawStateKey, phase: r.phase, conditions: r.conditions })); }
function same(a, b) { return stable(a) === stable(b); }
function parseArgs(argv) { let output = DEFAULT_OUTPUT; for (let i = 0; i < argv.length; i += 1) { if (argv[i] === "--output") output = path.resolve(argv[++i]); else throw new Error(`Unknown argument: ${argv[i]}`); } return { output }; }

function main() {
  const { output } = parseArgs(process.argv.slice(2)); const specBytes = fs.readFileSync(SPEC_PATH); const spec = JSON.parse(specBytes); const specSha256 = sha(specBytes);
  const storedSelection = read(path.join(output, "stage1-selected-states.json")); const storedMeasurements = read(path.join(output, "stage1-measurements.json"));
  const games = []; let gameReplayMismatches = 0;
  for (let i = 0; i < spec.population.games; i += 1) {
    const seed = spec.population.seedStart + i; const observed = replay(seed, spec); const stored = read(path.join(output, "games", `game-${String(i).padStart(4, "0")}.json`));
    const storedCore = { seed: stored.seed, gameId: stored.gameId, historicalTrajectoryHash: stored.historicalTrajectoryHash, openingPrefixHash: stored.openingPrefixHash,
      moves: stored.moves, observations: stored.observations, terminal: stored.terminal, terminalPly: stored.terminalPly };
    if (!same(storedCore, observed)) gameReplayMismatches += 1; games.push(observed);
    if ((i + 1) % 64 === 0 || i + 1 === spec.population.games) process.stderr.write(`[verify-games] ${i + 1}/${spec.population.games}\n`);
  }
  if (gameReplayMismatches) throw new Error(`independent trajectory replay mismatches=${gameReplayMismatches}`);
  const selection = select(games, spec);
  if (selection.selectionHash !== storedSelection.selectionHash) throw new Error("independent selection hash mismatch");
  if (selection.selected.length !== storedSelection.selected.length) throw new Error("independent selected count mismatch");
  let selectedStateMismatches = 0;
  for (let i = 0; i < selection.selected.length; i += 1) if (!same(selection.selected[i], storedSelection.selected[i])) selectedStateMismatches += 1;
  if (selectedStateMismatches) throw new Error(`independent selected-state mismatches=${selectedStateMismatches}`);
  const verifiedRows = []; let measurementMismatches = 0;
  for (let i = 0; i < selection.selected.length; i += 1) {
    const observed = measure(selection.selected[i], spec); verifiedRows.push(observed);
    if (!same(observed, storedMeasurements.rows[i])) measurementMismatches += 1;
    if ((i + 1) % 32 === 0 || i + 1 === selection.selected.length) process.stderr.write(`[verify-measurements] ${i + 1}/${selection.selected.length}\n`);
  }
  if (measurementMismatches) throw new Error(`independent measurement mismatches=${measurementMismatches}`);
  const measurementHash = sha(stable(measurementCore(verifiedRows)));
  const passed = storedMeasurements.selectionHash === selection.selectionHash && storedMeasurements.measurementHash === measurementHash;
  const result = {
    schemaVersion: 1, programLabel: spec.programLabel, researchGeneration: spec.researchGeneration, studyId: spec.studyId, stageId: spec.stageId, specSha256,
    passed, independentImplementation: true, productionStage1CommonImported: false, productionControlledSearchImported: false,
    gamesVerified: games.length, gameReplayMismatches, uniqueHistoricalTrajectories: selection.reps.length,
    selectedUniqueRawStates: selection.selected.length, selectedStateMismatches, measurementMismatches,
    storedSelectionHash: storedSelection.selectionHash, recomputedSelectionHash: selection.selectionHash, selectionHashMatches: storedSelection.selectionHash === selection.selectionHash,
    storedMeasurementHash: storedMeasurements.measurementHash, recomputedMeasurementHash: measurementHash, measurementHashMatches: storedMeasurements.measurementHash === measurementHash,
    scientificInferenceAuthorized: false, formalConfirmationClaimAuthorized: false, confirmatoryReuseAllowed: false, stage2GenerationAuthorized: false,
  };
  write(path.join(output, "stage1-verification.json"), result); console.log(JSON.stringify(result, null, 2)); if (!passed) process.exitCode = 1;
}

try { main(); } catch (error) { console.error(error.stack || error.message); process.exitCode = 1; }
