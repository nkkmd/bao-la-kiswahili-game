"use strict";

// 検証用の限定計算。公開エンジンを読み込まず、捕獲後の蒔き・namuaは扱わない。
const copy = value => JSON.parse(JSON.stringify(value));
const sequence = pits => pits[0].concat(pits[1].slice().reverse());
const rows = ring => [ring.slice(0, 8), ring.slice(8).reverse()];

function captureOptions(state, player) {
  const own = sequence(state.pits[player]);
  const other = state.pits[1 - player][0];
  const result = [];
  for (let start = 0; start < 16; start += 1) {
    if (own[start] < 2 || own[start] > 15) continue;
    for (const step of [-1, 1]) {
      let end = start;
      for (let seed = 0; seed < own[start]; seed += 1) end = (end + step + 16) % 16;
      if (end < 8 && own[end] > 0 && other[7 - end] > 0) {
        result.push({ start, step, target: 7 - end });
      }
    }
  }
  return result;
}

function detectTarget(state, attacker, previousMove) {
  if (state.winner !== null || state.phase !== "mtaji"
      || previousMove.phase !== "mtaji" || previousMove.type !== "takata") return null;
  const defender = 1 - attacker;
  if (captureOptions(state, defender).length) return null;
  const targets = new Set(captureOptions(state, attacker).map(move => move.target));
  if (targets.size !== 1) return null;
  const index = [...targets][0];
  const front = state.pits[defender][0];
  if (front[index] < 2 || front.filter(n => n > 0).length === 1
      || front.filter(n => n >= 2).length === 1
      || (index === 4 && state.houseOwned[defender])) return null;
  return { player: defender, index };
}

function starts(state) {
  const player = state.player;
  if (captureOptions(state, player).length) throw Error("Oracle scope: capturing turn");
  const blocked = state.takasia?.player === player ? state.takasia.index : null;
  const own = sequence(state.pits[player]);
  let options = own.map((count, start) => ({ count, start }))
    .filter(item => item.count >= 2 && item.start !== blocked);
  if (options.some(item => item.start < 8)) options = options.filter(item => item.start < 8);
  const occupied = own.slice(0, 8).filter(n => n > 0).length;
  return options.flatMap(({ start }) => [-1, 1].filter(step => !(occupied === 1
    && ((start === 0 && step === -1) || (start === 7 && step === 1))))
    .map(step => ({ start, step })));
}

function playTakata(source, start, step) {
  if (source.phase !== "mtaji" || source.winner !== null) throw Error("Oracle scope: mtaji only");
  if (!starts(source).some(move => move.start === start && move.step === step)) throw Error("Illegal oracle start");
  const state = copy(source);
  const player = state.player;
  const board = sequence(state.pits[player]);
  const blocked = state.takasia?.player === player ? state.takasia.index : null;
  const trace = [], seen = new Set();
  let current = start;
  for (;;) {
    const key = board.join(",") + ":" + current;
    if (seen.has(key)) throw Error("Oracle scope: non-terminating move");
    seen.add(key);
    if (current === blocked) throw Error("Blocked pit lifted");
    const count = board[current];
    board[current] = 0;
    if (current === 4) state.houseOwned[player] = false;
    let end = current;
    const visits = [];
    for (let seed = 0; seed < count; seed += 1) {
      end = (end + step + 16) % 16;
      board[end] += 1;
      visits.push(end);
    }
    trace.push({ start: current, count, end, visits });
    if (end === blocked || board[end] === 1) {
      state.pits[player] = rows(board);
      state.takasia = detectTarget(state, player, { phase: "mtaji", type: "takata" });
      state.player = 1 - player;
      state.turn += 1;
      return { state, trace, reason: end === blocked ? "takasia" : "empty" };
    }
    current = end;
  }
}

module.exports = { captureOptions, detectTarget, starts, playTakata, sequence, rows };
