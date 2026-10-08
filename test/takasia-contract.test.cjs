"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { spawnSync } = require("node:child_process");
const O = require("../tools/takasia/oracle.cjs");
const F = require("../tools/takasia/fixtures.json");
const total = state => state.pits.flat(2).reduce((a, b) => a + b, 0)
  + state.reserve.reduce((a, b) => a + b, 0) + state.pending.reduce((a, b) => a + b, 0);

for (const fixture of F.detectionCases) {
  test("成立判定: " + fixture.id, () => {
    assert.equal(total(fixture.state), 64);
    const original = JSON.stringify(fixture.state);
    assert.deepEqual(O.detectTarget(fixture.state, fixture.attacker, fixture.previousMove), fixture.expected);
    assert.equal(JSON.stringify(fixture.state), original);
  });
}

test("E30の直前takataが対象a4を設定する", () => {
  const applied = O.playTakata(F.e30.predecessor, 6, -1);
  assert.deepEqual(applied.state, F.e30.post);
  assert.equal(applied.trace.length, 1);
  assert.equal(total(applied.state), 64);
});

test("E30の開始穴はa5・a8の全4手で、a4からは開始できない", () => {
  assert.deepEqual(O.starts(F.e30.post), [
    { start: 4, step: -1 }, { start: 4, step: 1 },
    { start: 7, step: -1 }, { start: 7, step: 1 },
  ]);
  assert.throws(() => O.playTakata(F.e30.post, 3, -1), /Illegal oracle start/);
});

for (const response of F.e30.responses) {
  test(`E30応手: 開始${response.start}・方向${response.step}`, () => {
    const applied = O.playTakata(F.e30.post, response.start, response.step);
    assert.deepEqual(applied.state.pits[1], response.pits);
    assert.equal(applied.trace.length, response.sowings);
    assert.equal(applied.trace.at(-1).end, response.end);
    assert.equal(applied.state.pits[1][0][3], response.targetCount);
    assert.equal(applied.reason, response.reason);
    assert.ok(applied.trace.every(sow => sow.start !== 3));
    assert.equal(total(applied.state), 64);
    assert.equal(applied.state.takasia, null, "元の制約は全応手で失効する");
    assert.ok(O.captureOptions(applied.state, 0).some(move => move.target === 3));
  });
}

test("対象穴の途中通過で蒔きを止めず、最後の1個で止める", () => {
  const applied = O.playTakata(F.e30.post, 7, -1);
  assert.ok(applied.trace[0].visits.slice(0, -1).includes(3));
  assert.equal(applied.trace[0].end, 13);
  assert.deepEqual(applied.trace.map(({ start, count, end }) => ({ start, count, end })), [
    { start: 7, count: 10, end: 13 }, { start: 13, count: 9, end: 4 },
    { start: 4, count: 12, end: 8 }, { start: 8, count: 2, end: 6 },
    { start: 6, count: 3, end: 3 },
  ]);
});

test("nyumba位置a5から開始してもtakasia停止を免除しない", () => {
  const fixture = F.sowingCases[0];
  const applied = O.playTakata(fixture.state, fixture.start, fixture.step);
  assert.ok(applied.trace.every(sow => sow.start !== 3));
  assert.deepEqual(applied.state.pits[1], fixture.expectedPits);
  assert.equal(applied.reason, "takasia");
  assert.equal(applied.trace.length, 5);
  assert.equal(applied.state.houseOwned[1], false, "開始時に空にした所有は失う");
});

test("複数捕獲手を対象穴数として数えない", () => {
  const fixture = F.detectionCases.find(row => row.id === "multiple-captures-same-target");
  assert.equal(O.captureOptions(fixture.state, 0).length, 2);
  assert.equal(new Set(O.captureOptions(fixture.state, 0).map(move => move.target)).size, 1);
});

test("捕獲開始の2〜15個と16個takataを混同しない", () => {
  const s = structuredClone(F.e30.post);
  s.takasia = null;
  s.player = 0;
  s.pits[0] = [[16, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)];
  s.pits[1] = [[2, 0, 0, 0, 0, 0, 0, 0], [46, 0, 0, 0, 0, 0, 0, 0]];
  assert.equal(O.captureOptions(s, 0).length, 0);
  const result = O.playTakata(s, 0, 1);
  assert.equal(result.trace.length, 1);
  assert.equal(total(result.state), 64);
});

test("捕獲候補は開始1個を除外し、2個・15個を含め、16個を除外する", () => {
  for (const count of [1, 2, 15, 16]) {
    const s = structuredClone(F.e30.post);
    s.pits[0] = [[0, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)];
    s.pits[1] = [[0, 0, 0, 0, 0, 0, 0, 0], Array(8).fill(0)];
    const start = count <= 2 ? 2 : 8;
    const end = (start + count) % 16;
    if (start < 8) s.pits[0][0][start] = count;
    else s.pits[0][1][15 - start] = count;
    if (end < 8) { s.pits[0][0][end] = 1; s.pits[1][0][7 - end] = 2; }
    s.pits[1][1][0] = 64 - s.pits.flat(2).reduce((a, b) => a + b, 0);
    assert.equal(total(s), 64);
    const selected = O.captureOptions(s, 0).filter(m => m.start === start && m.step === 1);
    assert.equal(selected.length, count === 2 || count === 15 ? 1 : 0);
  }
});

test("Pythonの商・余りによる別計算も固定期待値に一致する", () => {
  const result = spawnSync("python3", ["tools/takasia/verify.py"], { cwd: require("node:path").resolve(__dirname, ".."), encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).status, "PASS");
});

test("E30の参照版と出典付き局面・構成例を区別する", () => {
  assert.equal(F.source.commit, "aad9fda3ffb12c2ca785509951c71ce8a42bef5a");
  assert.ok(F.detectionCases.filter(row => row.id !== "E30").every(row => row.provenance.startsWith("constructed-unit-case")));
});
