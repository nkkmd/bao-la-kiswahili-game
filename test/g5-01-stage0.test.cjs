"use strict";
const test = require("node:test"), assert = require("node:assert/strict");
const fs = require("node:fs"), os = require("node:os"), path = require("node:path");
const { execFileSync } = require("node:child_process");
const M = require("../tools/research/g5-01/measurement.cjs");
const R = require("../tools/research/g5-01/run.cjs");
const E = require("../public/engine.js");
const P = require("../tools/experiments/lib/restricted-endgame-retrograde.js");
const Q = require("../tools/experiments/lib/restricted-endgame-retrograde-independent.js");

test("RAW識別はtakasia全対象とpendingを区別し、表示用turnを除外する", () => {
  const s = E.initialState(), keys = new Set([M.rawKey(s)]);
  for (const player of [0, 1]) for (let index = 0; index < 8; index++) keys.add(M.rawKey({ ...s, takasia: { player, index } }));
  assert.equal(keys.size, 17);
  assert.notEqual(M.rawKey(s), M.rawKey({ ...s, pending: [1, 0] }));
  assert.equal(M.rawKey(s), M.rawKey({ ...s, turn: 999 }));
  const absent = structuredClone(s); delete absent.takasia; assert.equal(M.rawKey(s), M.rawKey(absent));
  for (const field of ["pits", "reserve", "houseOwned", "player", "phase", "winner", "pending"]) {
    const invalid = structuredClone(s); delete invalid[field]; assert.throws(() => M.rawKey(invalid), /Missing RAW/);
  }
});
test("nyumba停止・使用・houseTwo・パスの手キーは衝突しない", () => {
  const states = R.technicalStates();
  for (const { state } of states) {
    const moves = E.moveVariants(state); assert.equal(new Set(moves.map(M.moveKey)).size, moves.length);
  }
  assert.notEqual(M.moveKey({ type: "capture", houseChoice: "stop" }), M.moveKey({ type: "capture", houseChoice: "use" }));
  assert.notEqual(M.moveKey({ type: "takata", houseTwo: true }), M.moveKey({ type: "takata" }));
  assert.doesNotThrow(() => JSON.parse(M.moveKey({ type: "pass" })));
});
test("不完全・重複・非有限の順位を拒否し、同点の手を固定する", () => {
  for (const rows of [[], [{ moveKey: "a", score: NaN }], [{ moveKey: "a", score: Infinity }],
    [{ moveKey: "a", score: 1 }, { moveKey: "a", score: 2 }]]) assert.throws(() => M.rank(rows));
  const a = M.rank([{ moveKey: "b", score: 2 }, { moveKey: "a", score: 2 }]);
  assert.equal(a.selected, "a"); assert.deepEqual(a.topSet, ["a", "b"]);
  assert.throws(() => M.compare(a, M.rank([{ moveKey: "c", score: 2 }])));
});
test("完全閉包の欠損を両解法が拒否する", () => {
  const graph = [{ id: "r", player: 0, winner: null, moves: [{ key: "a", to: "missing" }] }];
  assert.throws(() => P.solveRetrograde(graph), /Missing successor/);
  assert.throws(() => Q.solveIndependent(graph), /Missing successor/);
});
test("再帰を引分けや中間価値へ読み替えず、同価値と距離差を分離する", () => {
  const f = require("../tools/research/g5-01/fixtures.json"), solution = P.solveRetrograde(f.graph);
  const score = (root, values) => M.rank(f.graph.find(n => n.id === root).moves.map((m, i) => ({ moveKey: m.key, score: values[i] })));
  const longWin = M.exactLoss(f.graph, solution, "R", score("R", [2, 3, 0]));
  assert.equal(longWin.valueLoss, 0); assert.equal(longWin.dtfRegret, 2); assert.deepEqual(longWin.exactOptimalSet, ["a", "b"]);
  const shortLoss = M.exactLoss(f.graph, solution, "L", score("L", [2, 1]));
  assert.equal(shortLoss.valueLoss, 0); assert.equal(shortLoss.dtfRegret, 1);
  const mixed = M.exactLoss(f.graph, solution, "M", score("M", [2, 1]));
  assert.equal(mixed.status, "NON-ESTIMABLE"); assert.equal(mixed.valueLoss, null);
  assert.throws(() => M.exactLoss(f.graph, solution, "R", M.rank([{ moveKey: "a", score: 1 }])));
});
test("計算上限・連続蒔きの安全停止は勝敗価値として使用しない", () => {
  const s = E.initialState(); assert.throws(() => M.search(s, 2, () => 0, 1), /NODE-LIMIT/);
  const limited = { ...s, reason: "relay-limit", winner: 1 };
  assert.throws(() => M.search(limited, 1, () => 0, 100), /MOVE-NONTERMINATION/);
  assert.throws(() => require("../tools/research/g5-01/independent.cjs").independentSearch(limited, 1, () => 0, 100), /MOVE-NONTERMINATION/);
});
test("中断復帰・成果物改変・同時実行防止を確認する", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "g5-01-"));
  try {
    assert.equal(R.run(dir, false, 2).interrupted, true);
    assert.throws(() => R.run(dir), /Existing checkpoint/);
    const completed = R.run(dir, true); assert.equal(completed.decision, "STAGE0-TECHNICAL-PASS");
    const verifier = path.resolve(__dirname, "../tools/research/g5-01/verify.py");
    execFileSync("python3", [verifier, path.join(dir, "result.json")]);
    const fullDir = path.join(dir, "full");
    assert.equal(R.run(fullDir).coreSha256, completed.coreSha256);
    const checkpointPath = path.join(dir, "checkpoint.json"), saved = JSON.parse(fs.readFileSync(checkpointPath));
    saved.rows[0].id = "tampered"; fs.writeFileSync(checkpointPath, JSON.stringify(saved));
    assert.throws(() => R.run(dir, true), /checksum mismatch/);
    fs.writeFileSync(path.join(dir, "technical.lock"), ""); assert.throws(() => R.run(dir, true), /EEXIST/);
    const resultPath = path.join(fullDir, "result.json"), result = JSON.parse(fs.readFileSync(resultPath));
    result.core.rows.at(-1).rows[0].losses[0].valueLoss = 0;
    result.coreSha256 = M.digest(result.core); fs.writeFileSync(resultPath, JSON.stringify(result));
    assert.throws(() => execFileSync("python3", [verifier, resultPath], { stdio: "pipe" }));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
