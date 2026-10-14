"use strict";
// 保存済み着手記録だけを再生する事後の供給診断。source生成・候補選定・閉包解析は行わない。
const fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib");
const I = require("../transition/independent-engine.cjs"), M = require("../measurement.cjs"), R = require("./run.cjs");
function diagnose(directory) {
  R.binding();
  const evidence = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(directory, "EVIDENCE.json.gz"))));
  const spec = R.binding().spec.selection, rows = [];
  for (const source of evidence.sources) {
    let state = { pits: Array.from({ length: 2 }, () => [[0,0,0,0,6,2,2,0], Array(8).fill(0)]),
      reserve: [22,22], houseOwned: [true,true], player: 0, phase: "namua", winner: null,
      reason: "", turn: 1, pending: [0,0], takasia: null };
    const stages = [0,0,0,0,0,0], occupiedAfterWidth = []; let reachesMtaji = false;
    for (let ply = 0; ply <= source.trace.length; ply++) {
      reachesMtaji ||= state.phase === "mtaji";
      if (state.winner === null) {
        const width = I.moveVariants(state, { mode: "runtime" }).length;
        const occupied = state.pits.flat(2).filter(v => v > 0).length;
        const pass = [ply >= spec.minPly, state.phase === "mtaji", state.reserve.every(n => n === 0),
          width >= spec.minWidth && width <= spec.maxWidth, occupied <= spec.maxOccupied,
          Math.min(...state.pits.map(r => r[0].reduce((a,b) => a+b, 0))) <= spec.maxSmallFront];
        let all = true;
        for (let n = 0; n < pass.length; n++) { all &&= pass[n]; if (all) stages[n]++; }
        if (pass.slice(0,4).every(Boolean)) occupiedAfterWidth.push(occupied);
      }
      if (ply < source.trace.length) {
        const t = source.trace[ply];
        if (M.rawKey(state) !== t.rawBefore) throw Error("Recorded parent differs");
        const child = I.applyMove(state, t.move);
        if (child.status !== "TERMINATED") throw Error("Recorded move no longer terminates");
        state = child.state; if (M.rawKey(state) !== t.rawAfter) throw Error("Recorded child differs");
      }
    }
    rows.push({ seed: source.seed, plies: source.trace.length, terminalPhase: state.phase, reachesMtaji, stages,
      minOccupiedAfterWidth: occupiedAfterWidth.length ? Math.min(...occupiedAfterWidth) : null });
  }
  const plies = rows.map(r => r.plies).sort((a,b) => a-b), half = Math.floor(plies.length / 2);
  const output = { evidenceClass: "POSTEXECUTION-SUPPLY-DIAGNOSTIC-ONLY", newSourceGeneration: 0,
    newCandidateSelection: 0, sourceCount: rows.length,
    plies: { min: plies[0], median: plies.length % 2 ? plies[half] : (plies[half-1]+plies[half])/2, max: plies.at(-1) },
    sourcesReachingMtaji: rows.filter(r => r.reachesMtaji).length,
    terminalNamua: rows.filter(r => r.terminalPhase === "namua").length,
    cumulativeGates: ["ply>=48", "+mtaji", "+both reserve=0", "+legal width 2..12", "+occupied<=12", "+min front KETE<=8"]
      .map((gate,k) => ({ gate, states: rows.reduce((n,r) => n+r.stages[k],0), sources: rows.filter(r => r.stages[k]>0).length })), rows };
  fs.writeFileSync(path.join(directory, "SUPPLY_DIAGNOSTIC.json"), JSON.stringify(output, null, 2) + "\n");
  return output;
}
if (require.main === module) { const output = diagnose(path.resolve(process.argv[2])); console.log(JSON.stringify({ ...output, rows: undefined })); }
module.exports = { diagnose };
