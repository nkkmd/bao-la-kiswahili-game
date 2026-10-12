"use strict";
const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const RULE = "BAO-RULES-V0.2.0-TAKASIA-001";
const stable = v => v === null || typeof v !== "object" ? JSON.stringify(v)
  : Array.isArray(v) ? `[${v.map(stable).join(",")}]`
  : `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`;
const digest = v => crypto.createHash("sha256").update(stable(v)).digest("hex");
function raw(state) {
  const result = {};
  for (const k of ["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]) {
    if (state[k] === undefined) throw Error(`Missing RAW field: ${k}`);
    result[k] = state[k];
  }
  result.takasia = state.takasia ?? null;
  result.ruleRevision = RULE;
  return result;
}
const rawKey = state => digest(raw(state));
function moveKey(m) {
  return stable({ row: m.row ?? null, index: m.index ?? null, direction: m.direction ?? null,
    type: m.type, phase: m.phase ?? null, side: m.side ?? null, houseChoice: m.houseChoice ?? null,
    houseTwo: Boolean(m.houseTwo) });
}
function rank(rows) {
  if (!rows.length || rows.some(r => typeof r.moveKey !== "string" || !Number.isFinite(r.score))
    || new Set(rows.map(r => r.moveKey)).size !== rows.length) throw Error("Invalid complete ranking");
  const sorted = [...rows].sort((a, b) => b.score - a.score || (a.moveKey < b.moveKey ? -1 : 1));
  return { rows: [...rows].sort((a, b) => a.moveKey < b.moveKey ? -1 : 1),
    selected: sorted[0].moveKey, topSet: sorted.filter(r => r.score === sorted[0].score).map(r => r.moveKey) };
}
function compare(a, b) {
  const A = new Map(a.rows.map(r => [r.moveKey, r.score])), B = new Map(b.rows.map(r => [r.moveKey, r.score]));
  if (A.size !== B.size || [...A.keys()].some(k => !B.has(k))) throw Error("Move universe differs");
  const keys = [...A.keys()].sort(); let changed = false;
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    changed ||= Math.sign(A.get(keys[i]) - A.get(keys[j])) !== Math.sign(B.get(keys[i]) - B.get(keys[j]));
  }
  return { rankingChanged: changed, selectedChanged: a.selected !== b.selected,
    topSetChanged: stable(a.topSet) !== stable(b.topSet) };
}
function exactLoss(nodes, solved, rootId, ranking) {
  const root = nodes.find(n => n.id === rootId);
  if (!root || root.winner !== null) throw Error("Nonterminal exact root required");
  const keys = root.moves.map(m => m.key).sort();
  if (stable(keys) !== stable(ranking.rows.map(r => r.moveKey).sort())) throw Error("Incomplete exact move universe");
  const children = root.moves.map(m => ({ moveKey: m.key, result: solved.results[m.to] }));
  if (children.some(c => !c.result || c.result.absoluteWinner === null)) {
    return { status: "NON-ESTIMABLE", reason: "UNRESOLVED-CHILD", valueLoss: null,
      exactOptimalSet: null, selectedValue: null, dtfRegret: null };
  }
  const values = children.map(c => ({ moveKey: c.moveKey,
    value: c.result.absoluteWinner === root.player ? 1 : -1, dtf: c.result.dtf + 1 }));
  const best = Math.max(...values.map(v => v.value));
  const optimal = values.filter(v => v.value === best);
  const selected = values.find(v => v.moveKey === ranking.selected);
  const bestDTF = best === 1 ? Math.min(...optimal.map(v => v.dtf)) : Math.max(...optimal.map(v => v.dtf));
  return { status: "ESTIMABLE", valueLoss: best - selected.value, selectedValue: selected.value,
    exactOptimalSet: optimal.map(v => v.moveKey).sort(), outsideOptimalSet: selected.value !== best,
    selectedDTF: selected.dtf, dtfRegret: selected.value !== best ? null
      : best === 1 ? selected.dtf - bestDTF : bestDTF - selected.dtf };
}
function search(state, depth, evaluate, maxNodes) {
  if (state.reason === "relay-limit") throw Error("MOVE-NONTERMINATION");
  if (state.winner !== null || !Number.isInteger(depth) || depth < 1) throw Error("Invalid search root/depth");
  const player = state.player; let nodes = 0;
  function visit(s, remaining, ply, alpha, beta) {
    if (++nodes > maxNodes) throw Error("NODE-LIMIT");
    if (s.reason === "relay-limit") throw Error("MOVE-NONTERMINATION");
    if (s.winner !== null) return s.winner === player ? 1000000 - ply : -1000000 + ply;
    if (!remaining) return evaluate(s, player);
    const moves = E.moveVariants(s);
    if (!moves.length) throw Error("Nonterminal state without moves");
    const maximizing = s.player === player; let best = maximizing ? -Infinity : Infinity;
    for (const move of moves) {
      const value = visit(E.applyMoveForSearch(s, move).state, remaining - 1, ply + 1, alpha, beta);
      best = maximizing ? Math.max(best, value) : Math.min(best, value);
      if (maximizing) alpha = Math.max(alpha, best); else beta = Math.min(beta, best);
      if (alpha >= beta) break;
    }
    return best;
  }
  // 各root手を独立した全幅窓で測る。枝刈りの境界値を順位の確定値にしない。
  const rows = E.moveVariants(state).map(m => ({ moveKey: moveKey(m),
    score: visit(E.applyMoveForSearch(state, m).state, depth - 1, 1, -Infinity, Infinity) }));
  return { ranking: rank(rows), nodes };
}
module.exports = { RULE, stable, digest, raw, rawKey, moveKey, rank, compare, exactLoss, search };
