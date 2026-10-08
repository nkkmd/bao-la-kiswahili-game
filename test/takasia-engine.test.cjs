"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const E = require("../public/engine.js");
const F = require("../tools/takasia/fixtures.json");
const O = require("../tools/takasia/oracle.cjs");
const copy = structuredClone;
const total = s => s.pits.flat(2).reduce((a, b) => a + b, 0)
  + s.reserve.reduce((a, b) => a + b, 0) + s.pending.reduce((a, b) => a + b, 0);
const mtaji = () => Object.assign(E.initialState(), { phase: "mtaji", reserve: [0, 0],
  houseOwned: [false, false], pits: Array.from({ length: 2 }, () => [Array(8).fill(0), Array(8).fill(0)]) });
const move = (index, direction = "right", row = 0) => ({ type: "takata", phase: "mtaji", row, index, direction });
function apply(s, m) {
  const original = copy(s);
  const detailed = E.applyMove(s, m), compact = E.applyMoveForSearch(s, m);
  assert.deepEqual(s, original);
  assert.deepEqual(compact.state, detailed.state);
  assert.deepEqual(compact.events, detailed.events.map(({ state, ...event }) => event));
  assert.equal(total(detailed.state), total(s));
  return detailed;
}

test("成立イベントと最終スナップショットに次の手の対象を保持する", () => {
  const r = apply(F.e30.predecessor, F.e30.move);
  assert.deepEqual(r.state, F.e30.post);
  assert.deepEqual(r.events.filter(e => e.kind === "takasia").map(e => [e.action, e.target]),
    [["activate", { player: 1, index: 3 }]]);
  assert.deepEqual(r.events.at(-1).state, r.state);
});

test("対象を通過しても蒔き続け、最後の1個で停止して取り上げない", () => {
  const r = apply(F.e30.post, move(7, "left"));
  const changes = r.events.filter(e => e.kind === "takasia");
  assert.deepEqual(changes.map(e => e.action), ["stop", "expire"]);
  assert.equal(changes[0].state.pits[1][0][3], 5);
  assert.deepEqual(changes[0].state.takasia, { player: 1, index: 3 });
  assert.equal(changes[1].state.takasia, null);
  assert.equal(r.state.takasia, null);
  assert.equal(r.events.filter(e => e.kind === "lift" || e.kind === "relay").length, 5);
});

test("対象穴へ着地しない応手でも次の1手で必ず失効する", () => {
  const r = apply(F.e30.post, move(7));
  assert.equal(r.state.takasia, null);
  assert.deepEqual(r.events.filter(e => e.kind === "takasia").map(e => e.action), ["expire"]);
});

test("旧対象の失効後に成立した新対象を消去しない（構成した旧マーカー）", () => {
  // 初期配置からの到達可能性は主張しない。失効と再判定の順序を検証する。
  const s = copy(F.e30.predecessor);
  s.takasia = { player: 0, index: 1 };
  const r = apply(s, F.e30.move);
  assert.deepEqual(r.state, F.e30.post);
  assert.deepEqual(r.events.filter(e => e.kind === "takasia").map(e => [e.action, e.target]),
    [["expire", { player: 0, index: 1 }], ["activate", { player: 1, index: 3 }]]);
  assert.deepEqual(O.playTakata(s, 6, -1).state, r.state);
});

test("無関係な手番のマーカーで開始穴・relayを制限しない", () => {
  const s = copy(F.e30.post); s.takasia.player = 0;
  const plain = copy(s); plain.takasia = null;
  assert.deepEqual(E.legalMoves(s), E.legalMoves(plain));
  const r = apply(s, move(3));
  assert.deepEqual(r.state, E.applyMove(plain, move(3)).state);
});

test("namuaのマーカーを無視し、mtaji移行手で新たに成立させない", () => {
  const s = E.initialState(); s.reserve = [0, 1]; s.player = 1;
  s.takasia = { player: 1, index: 4 };
  const plain = copy(s); plain.takasia = null;
  assert.deepEqual(E.legalMoves(s), E.legalMoves(plain));
  const r = apply(s, E.legalMoves(s)[0]);
  assert.equal(r.state.phase, "mtaji");
  assert.equal(r.state.takasia, null);
  assert.equal(r.events.some(e => e.action === "activate"), false);
});

test("捕獲が優先され、最初のmtaji捕獲で両側のnyumba所有を解除する", () => {
  const s = mtaji(); s.houseOwned = [true, true];
  s.pits[0][0] = [0, 0, 2, 1, 6, 0, 0, 0];
  s.pits[1][0] = [2, 0, 0, 3, 6, 0, 0, 0]; s.pits[1][1][0] = 44;
  // 通常の成立局面にはないマーカーでも捕獲を妨げない。
  s.takasia = { player: 0, index: 2 };
  const m = E.legalMoves(s).find(m => m.index === 2 && m.direction === "right");
  assert.equal(m.type, "capture");
  const r = apply(s, m), capture = r.events.find(e => e.kind === "capture");
  assert.deepEqual(capture.state.houseOwned, [false, false]);
  assert.deepEqual(r.state.houseOwned, [false, false]);
  assert.equal(r.state.takasia, null);
});

test("mtaji捕獲で最後の敵前列を取った瞬間にも所有・対象を解除する", () => {
  const s = mtaji(); s.houseOwned = [true, true];
  s.pits[0][0] = [0, 0, 2, 1, 6, 0, 0, 0];
  s.pits[1][0][3] = 3; s.pits[1][1][0] = 52;
  s.takasia = { player: 0, index: 2 };
  const r = apply(s, E.legalMoves(s).find(m => m.index === 2 && m.direction === "right"));
  assert.equal(r.state.winner, 0); assert.equal(r.state.reason, "front-empty");
  assert.equal(r.state.pending[0], 3); assert.equal(r.state.takasia, null);
  assert.deepEqual(r.state.houseOwned, [false, false]);
  assert.equal(r.events.at(-1).state.takasia, null);
});

test("次手に2個以上の穴がなく終局する場合も対象を残さない", () => {
  const s = mtaji(); s.pits[0][0][2] = 2; s.pits[0][1][0] = 61;
  s.pits[1][0][0] = 1; s.takasia = { player: 0, index: 6 };
  const r = apply(s, move(2));
  assert.equal(r.state.winner, 0); assert.equal(r.state.reason, "no-move");
  assert.equal(r.state.takasia, null);
});

test("namua捕獲は空にしていない相手nyumbaの所有を消さない", () => {
  const s = E.initialState(); s.pits = mtaji().pits;
  s.pits[0][0][2] = 1; s.pits[0][0][4] = 6;
  s.pits[1][0][5] = 3; s.pits[1][0][4] = 6;
  const r = apply(s, E.legalMoves(s)[0]);
  assert.equal(r.state.houseOwned[1], true);
});

test("16個の開始を捕獲手にせず、takataとして64個を保存する", () => {
  const s = mtaji(); s.pits[0][0][0] = 16; s.pits[1][0][0] = 2; s.pits[1][1][0] = 46;
  assert.equal(E.legalMoves(s).every(m => m.type === "takata"), true);
  assert.deepEqual(apply(s, move(0)).state, O.playTakata(s, 0, 1).state);
});

test("takasia項目がない入力を変更せず、現行遷移でnullを明示する", () => {
  const s = copy(F.e30.predecessor); delete s.takasia;
  assert.deepEqual(apply(s, F.e30.move).state, F.e30.post);
});

function boundedEngine(limit) {
  // 上限境界を短いE30で検証するため、独立VM内の定数だけを置き換える。
  const fs = require("node:fs"), vm = require("node:vm");
  const source = fs.readFileSync(require.resolve("../public/engine.js"), "utf8");
  assert.equal(source.match(/const MAX_RELAY = 512;/g)?.length, 1);
  const context = { module: { exports: {} } };
  vm.runInNewContext(source.replace("const MAX_RELAY = 512;", `const MAX_RELAY = ${limit};`), context);
  return context.module.exports;
}

test("最後の許容relayで対象へ着地した場合は上限負けより停止を優先する", () => {
  const B = boundedEngine(4);
  const r = B.applyMove(F.e30.post, move(7, "left"));
  assert.deepEqual(JSON.parse(JSON.stringify(r.state)), E.applyMove(F.e30.post, move(7, "left")).state);
  assert.equal(r.events.some(e => e.kind === "limit"), false);
});

test("対象到達前にrelay上限へ達した場合は終局と同時に対象を消去する", () => {
  const B = boundedEngine(3);
  const r = B.applyMove(F.e30.post, move(7, "left"));
  assert.equal(r.state.reason, "relay-limit"); assert.equal(r.state.winner, 0);
  assert.equal(r.state.takasia, null); assert.equal(r.events.at(-1).state.takasia, null);
  assert.deepEqual(JSON.parse(JSON.stringify(B.applyMoveForSearch(F.e30.post, move(7, "left")).state)),
    JSON.parse(JSON.stringify(r.state)));
  assert.equal(total(r.state), 64);
});

test("呼出側のphase省略・誤記で実際のmtaji手の成立判定を回避しない", () => {
  for (const phase of [undefined, "namua"]) {
    const m = { ...F.e30.move, phase };
    assert.deepEqual(apply(F.e30.predecessor, m).state, F.e30.post);
  }
});
