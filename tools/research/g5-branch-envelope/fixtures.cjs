"use strict";
const fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib"), assert = require("node:assert/strict");
const M = require("../g5-01/measurement.cjs");
const evidenceFile = path.resolve(__dirname, "../../../doc/research-generation-5/bfs-integration-20261013/results/TECHNICAL_EVIDENCE.json.gz");
let fixed = null;
function state(n, winner = null) {
  if (!fixed) {
    fixed = new Map(); const saved = JSON.parse(zlib.gunzipSync(fs.readFileSync(evidenceFile)));
    for (const d of saved.domains.filter(d => d.evidenceClass === "ABSTRACT-NOT-BAO-EVIDENCE"))
      for (const r of d.states) fixed.set(r.state.pits[0][0][0] + 64 * r.state.pits[0][0][1] + ":" + r.state.winner, r.state);
  }
  const s = fixed.get(n + ":" + winner); assert.ok(s, "FIXTURE-STATE-NOT-IN-FIXED-EVIDENCE"); return structuredClone(s);
}
const number = s => s.pits[0][0][0] + 64 * s.pits[0][0][1];
const move = (type, index) => ({ type, phase: "mtaji", row: 0, index, direction: "right" });
function sourceFixture(id, options = {}, independent = false) {
  const widths = options.replyWidths ?? [2, 2, 2], rootWidth = widths.length;
  // 遷移表は抽象テスト専用。すべて既存abstract RAWのmetadataだけを変えて使用する。
  const table = new Map();
  for (let n = 0; n < 512; n++) table.set(n, [{ move: move("takata", 0), to: n === 511 ? 0 : n + 1, terminal: false }]);
  for (const [root, start, count] of [[48, 600, rootWidth], [49, 610, 2]]) {
    table.set(root, Array.from({ length: count }, (_, i) => ({ move: move("takata", i), to: start + i, terminal: options.terminalChild === true && root === 48 && i === 0 })));
    for (let i = 0; i < count; i++) table.set(start + i, Array.from({ length: root === 48 ? widths[i] : 2 }, (_, j) => ({
      move: move(i % 2 ? "takata" : "capture", j), to: root === 48 ? 49 : 50, terminal: false,
      unknown: (options.unknownReply && root === 48 && i === 0) || (options.laterUnknown && root === 49 && i === 0)
    })));
  }
  if (!options.long) table.set(50, [{ move: move("takata", 0), to: 3, terminal: true }]);
  const unknown = () => ({ status: "MOVE-RECURRENT", state: null, relays: 2,
    microstates: [{ x: 0 }, { x: 1 }, { x: 0 }], cycle: { first: 0, repeatedAt: 2, period: 2 } });
  const api = independent ? {
    variants(s) { return { probes: [], moves: s.winner !== null ? [] : [...table.get(number(s))].reverse().map(r => ({ ...r.move })) }; },
    apply(s, m) {
      const rows = table.get(number(s)), index = rows.map(r => M.moveKey(r.move)).indexOf(M.moveKey(m)); assert.ok(index >= 0);
      const row = rows[index]; if (row.unknown) return unknown();
      const child = state(row.terminal ? 3 : row.to, row.terminal ? 0 : null); child.turn = s.turn + 1; child.reason = "technical-from-" + number(s);
      return { status: "TERMINATED", state: child, relays: 0, microstates: [], cycle: null };
    }
  } : {
    variants(s) { return { probes: [], moves: s.winner === null ? table.get(number(s)).map(r => r.move) : [] }; },
    apply(s, m) {
      const row = table.get(number(s)).find(r => M.moveKey(r.move) === M.moveKey(m)); assert.ok(row);
      if (row.unknown) return unknown();
      return { status: "TERMINATED", state: { ...state(row.terminal ? 3 : row.to, row.terminal ? 0 : null), turn: s.turn + 1,
        reason: "technical-from-" + number(s) }, relays: 0, microstates: [], cycle: null };
    }
  };
  return { id, initial: state(0), api, evidenceClass: "ABSTRACT-NOT-BAO-EVIDENCE" };
}
function priorFirewall() {
  const p = require("../g5-compact-bfs/run.cjs").priorRead();
  const e = JSON.parse(zlib.gunzipSync(fs.readFileSync(evidenceFile)));
  e.baoRawProjectionIdentities.forEach(id => p.add(id)); e.abstractRawProjectionIdentities.forEach(id => p.add(id));
  assert.equal(p.size, 103355); return p;
}
module.exports = { state, sourceFixture, priorFirewall };
