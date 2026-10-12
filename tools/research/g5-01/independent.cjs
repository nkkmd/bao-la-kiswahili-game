"use strict";
// productionの探索・順位関数を読み込まない全幅minimax。遷移と評価器は共有する。
const E = require("../../../public/engine.js");
function independentSearch(source, depth, evaluator, limit) {
  if (source.reason === "relay-limit") throw Error("MOVE-NONTERMINATION");
  if (source.winner !== null || !Number.isInteger(depth) || depth < 1) throw Error("Invalid search root/depth");
  const perspective = source.player; let count = 0;
  function descend(state, left, distance) {
    count++;
    if (count > limit) throw Error("NODE-LIMIT");
    if (state.reason === "relay-limit") throw Error("MOVE-NONTERMINATION");
    if (state.winner !== null) return state.winner === perspective ? 1000000 - distance : -1000000 + distance;
    if (left === 0) return evaluator(state, perspective);
    const moves = E.moveVariants(state);
    if (!moves.length) throw Error("Nonterminal state without moves");
    const scores = moves.map(move => descend(E.applyMove(state, move).state, left - 1, distance + 1));
    return state.player === perspective ? Math.max(...scores) : Math.min(...scores);
  }
  function key(move) {
    const fields = { direction: move.direction ?? null, houseChoice: move.houseChoice ?? null, houseTwo: Boolean(move.houseTwo),
      index: move.index ?? null, phase: move.phase ?? null, row: move.row ?? null,
      side: move.side ?? null, type: move.type };
    return JSON.stringify(fields);
  }
  const rows = E.moveVariants(source).map(move => ({ moveKey: key(move),
    score: descend(E.applyMove(source, move).state, depth - 1, 1) }));
  rows.sort((a, b) => a.moveKey < b.moveKey ? -1 : 1);
  const maximum = Math.max(...rows.map(row => row.score));
  const topSet = rows.filter(row => row.score === maximum).map(row => row.moveKey);
  return { ranking: { rows, selected: topSet[0], topSet }, nodes: count };
}
module.exports = { independentSearch };
