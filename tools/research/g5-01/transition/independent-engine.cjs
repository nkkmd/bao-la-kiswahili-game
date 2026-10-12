"use strict";
// 独立実装。公開エンジン・既存oracle・測定関数をimportしない。
// 前列0..7、逆順の後列8..15という環状配列で遷移する。
const copy = structuredClone;
const flatten = s => s.pits.map(rows => [...rows[0], ...rows[1].toReversed()]);
const expand = rings => rings.map(a => [a.slice(0, 8), a.slice(8).toReversed()]);
const mod = x => (x % 16 + 16) % 16;
const step = d => d === "right" ? 1 : -1;
const indexOf = m => m.row === 0 ? m.index : 15 - m.index;
function blocked(s, player) {
  const t = s.takasia;
  return s.phase === "mtaji" && t?.player === player && Number.isInteger(t.index)
    && t.index >= 0 && t.index < 8 ? t.index : null;
}
function captures(s, player) {
  const board = flatten(s), own = board[player], enemy = board[1 - player];
  const moves = [];
  for (let start = 0; start < 16; start++) {
    const amount = own[start];
    if (amount < 2 || amount > 15) continue;
    for (const direction of ["left", "right"]) {
      const landing = mod(start + step(direction) * amount);
      if (landing < 8 && own[landing] > 0 && enemy[7 - landing] > 0) {
        moves.push({ row: start < 8 ? 0 : 1, index: start < 8 ? start : 15 - start,
          direction, target: 7 - landing });
      }
    }
  }
  return moves;
}
function detectTakasia(s, attacker, previous) {
  if (s.winner !== null || s.phase !== "mtaji" || previous?.phase !== "mtaji" || previous.type !== "takata") return null;
  const defender = 1 - attacker;
  if (captures(s, defender).length) return null;
  const targets = new Set(captures(s, attacker).map(m => m.target));
  if (targets.size !== 1) return null;
  const [index] = targets, front = s.pits[defender][0];
  if (front[index] < 2 || front.filter(n => n > 0).length === 1 || front.filter(n => n >= 2).length === 1
      || (index === 4 && s.houseOwned[defender])) return null;
  return { player: defender, index };
}
function legalMoves(s) {
  if (s.winner !== null) return [];
  const player = s.player, front = s.pits[player][0];
  const occupied = front.reduce((n, count) => n + Number(count > 0), 0);
  const inward = m => !(m.row === 0 && occupied === 1
    && ((m.index === 0 && m.direction === "left") || (m.index === 7 && m.direction === "right")));
  if (s.phase === "mtaji") {
    const captureMoves = captures(s, player);
    if (captureMoves.length) return captureMoves.map(({ target, ...m }) => ({ ...m, type: "capture", phase: "mtaji" }));
    const own = flatten(s)[player], target = blocked(s, player);
    let starts = Array.from({ length: 16 }, (_, i) => i).filter(i => own[i] >= 2 && i !== target);
    if (starts.some(i => i < 8)) starts = starts.filter(i => i < 8);
    return starts.flatMap(i => ["left", "right"].map(direction => ({ row: i < 8 ? 0 : 1,
      index: i < 8 ? i : 15 - i, direction, type: "takata", phase: "mtaji" }))).filter(inward);
  }
  if (s.reserve[player] <= 0) return [{ type: "pass" }];
  const capturesAt = front.flatMap((n, index) => n > 0 && s.pits[1 - player][0][7 - index] > 0
    ? (index < 2 ? ["left"] : index > 5 ? ["right"] : ["left", "right"]).map(side => ({
      type: "capture", phase: "namua", row: 0, index, direction: side === "left" ? "right" : "left", side })) : []);
  if (capturesAt.length) return capturesAt;
  const starts = front.map((amount, index) => ({ amount, index })).filter(x => x.amount > 0);
  if (starts.length === 1 && starts[0].index === 4 && s.houseOwned[player]) {
    return ["left", "right"].map(direction => ({ type: "takata", phase: "namua", row: 0, index: 4,
      direction, houseTwo: true }));
  }
  const free = starts.filter(x => !(x.index === 4 && s.houseOwned[player] && x.amount >= 6));
  const multi = free.some(x => x.amount >= 2);
  let selected = free.filter(x => x.amount >= 2 || !multi || s.houseOwned[player]);
  if (!selected.length) selected = starts.filter(x => x.index !== 4 || x.amount < 6);
  return selected.flatMap(x => ["left", "right"].map(direction => ({ type: "takata", phase: "namua",
    row: 0, index: x.index, direction }))).filter(inward);
}
function samePhysical(a, b) {
  return ["type", "row", "index", "direction", "side"].every(k => a[k] === b[k])
    && Boolean(a.houseTwo) === Boolean(b.houseTwo);
}
function applyMove(source, move, options = {}) {
  const mode = options.mode ?? "guard-free", relayCap = options.runtimeRelayCap ?? 512;
  const microCap = options.maxMicrostates ?? 8192;
  if (!["runtime", "guard-free"].includes(mode) || !Number.isInteger(microCap) || microCap < 1
    || !Number.isInteger(relayCap) || relayCap < 1) throw Error("Invalid transition resource contract");
  if (!legalMoves(source).some(m => samePhysical(m, move))) throw Error("Illegal independent move");
  const state = copy(source); state.takasia ??= null;
  let rings = flatten(state), player = state.player, direction = step(move.direction);
  let cursor = indexOf(move), wasEmpty = false, relays = 0;
  const captureTurn = move.type === "capture";
  const target = captureTurn ? null : blocked(state, player);
  const previous = { phase: source.phase, type: move.type };
  const seen = new Set();
  function publish() { state.pits = expand(rings); }
  function answer(status) { publish(); return { status, state, relays }; }
  const frontHas = p => rings[p].slice(0, 8).some(n => n > 0);
  function terminate(winner, reason) { state.winner = winner; state.reason = reason; state.takasia = null; }
  function lift(location, amount, removeHouse) {
    rings[player][location] -= amount;
    if (removeHouse && location === 4 && rings[player][location] === 0) state.houseOwned[player] = false;
  }
  function scatter(amount, includeFirst) {
    for (let n = 0; n < amount; n++) {
      if (!includeFirst || n > 0) cursor = mod(cursor + direction);
      wasEmpty = rings[player][cursor] === 0;
      rings[player][cursor]++;
    }
  }
  function capture() {
    const enemyIndex = 7 - cursor, amount = rings[1 - player][enemyIndex];
    rings[1 - player][enemyIndex] = 0;
    if (enemyIndex === 4) state.houseOwned[1 - player] = false;
    if (state.phase === "mtaji") state.houseOwned = [false, false];
    if (!frontHas(1 - player)) {
      state.pending ||= [0, 0]; state.pending[player] += amount; terminate(player, "front-empty"); return false;
    }
    return amount;
  }
  function finish() {
    state.takasia = null;
    if (!frontHas(1 - player)) { terminate(player, "front-empty"); return answer("TERMINATED"); }
    if (!frontHas(player)) { terminate(1 - player, "front-empty"); return answer("TERMINATED"); }
    if (state.phase === "namua" && state.reserve.every(n => n === 0)) state.phase = "mtaji";
    state.player = 1 - player; state.turn++;
    publish(); state.takasia = detectTakasia(state, player, previous);
    if (!legalMoves(state).length) terminate(player, "no-move");
    return answer("TERMINATED");
  }
  if (move.type === "pass") return finish();
  if (state.phase === "namua") {
    state.reserve[player]--; rings[player][cursor]++;
    if (captureTurn) {
      const amount = capture(); if (amount === false) return answer("TERMINATED");
      cursor = move.side === "left" ? 0 : 7; direction = move.side === "left" ? 1 : -1;
      scatter(amount, true);
    } else {
      const amount = move.houseTwo ? 2 : rings[player][cursor];
      lift(cursor, amount, false); scatter(amount, false);
    }
  } else { const amount = rings[player][cursor]; lift(cursor, amount, true); scatter(amount, false); }
  while (!wasEmpty) {
    // 対象への最終着地はruntimeの上限境界でも停止に優先する。
    if (cursor === target) break;
    if (mode === "runtime" && relays >= relayCap) {
      terminate(1 - player, "relay-limit"); return answer("RUNTIME-GUARD");
    }
    if (mode === "guard-free") {
      const signature = JSON.stringify([rings, state.reserve, state.houseOwned, state.pending,
        state.phase, state.takasia, cursor, direction, captureTurn]);
      if (seen.has(signature)) return { status: "MOVE-RECURRENT", state: null, relays };
      if (seen.size >= microCap) return { status: "ADMIN-CUTOFF", state: null, relays };
      seen.add(signature);
    }
    relays++;
    if (!frontHas(1 - player)) { terminate(player, "front-empty"); return answer("TERMINATED"); }
    if (captureTurn && cursor < 8 && rings[1 - player][7 - cursor] > 0) {
      const side = cursor < 2 ? "left" : cursor > 5 ? "right" : direction === 1 ? "left" : "right";
      const amount = capture(); if (amount === false) return answer("TERMINATED");
      cursor = side === "left" ? 0 : 7; direction = side === "left" ? 1 : -1; scatter(amount, true);
      continue;
    }
    const house = state.phase === "namua" && cursor === 4 && state.houseOwned[player] && rings[player][4] >= 6;
    if (house && (!captureTurn || move.houseChoice !== "use")) break;
    if (house && captureTurn) state.houseOwned[player] = false;
    const amount = rings[player][cursor]; lift(cursor, amount, true); scatter(amount, false);
  }
  return finish();
}
function moveVariants(state, options = {}) {
  return legalMoves(state).flatMap(m => {
    if (state.phase !== "namua" || m.type !== "capture") return [m];
    const stop = { ...m, houseChoice: "stop" }, use = { ...m, houseChoice: "use" };
    const a = applyMove(state, stop, options), b = applyMove(state, use, options);
    // 未完の遷移は等価と判定せず、両候補を保ったまま閉包側で不適格にする。
    if (!a.state || !b.state) return [stop, use];
    return JSON.stringify(a.state) === JSON.stringify(b.state) ? [m] : [stop, use];
  });
}
module.exports = { legalMoves, moveVariants, applyMove, detectTakasia };
