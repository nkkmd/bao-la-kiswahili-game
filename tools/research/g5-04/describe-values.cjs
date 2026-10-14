"use strict";
// 保存済みの独立一致解だけを記述する。生成・探索・再選定は行わない。
const fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib"), crypto = require("node:crypto");
function describe(directory) {
  const compressed = fs.readFileSync(path.join(directory, "EVIDENCE.json.gz"));
  const bytes = zlib.gunzipSync(compressed), evidence = JSON.parse(bytes);
  const rows = evidence.domains.map((domain, index) => {
    const candidate = evidence.selectedCandidates[index];
    if (!domain.complete) return { candidate: index + 1, complete: false, values: null };
    const root = domain.nodes.find(node => node.id === domain.rootKey), solved = domain.solution.results;
    const choices = root.moves.map(move => {
      const next = solved[move.to], winner = next.absoluteWinner;
      return { moveKey: move.key, absoluteWinner: winner,
        rootRelativeValue: winner === 0 || winner === 1 ? (winner === root.player ? 1 : -1) : null,
        dtfAfterMove: next.dtf };
    });
    const known = choices.every(move => move.rootRelativeValue !== null);
    return { candidate: index + 1, complete: true, sourceIndex: candidate.sourceIndex,
      seed: evidence.sources[candidate.sourceIndex].seed, ply: candidate.ply, width: candidate.width,
      states: domain.states.length, edges: domain.edges.length, rootStatus: solved[root.id].status,
      rootDtf: solved[root.id].dtf, choices,
      heterogeneousWinLoss: known ? new Set(choices.map(m => m.rootRelativeValue)).size > 1 : null,
      heterogeneousDtf: choices.every(m => Number.isInteger(m.dtfAfterMove))
        ? new Set(choices.map(m => m.dtfAfterMove)).size > 1 : null };
  });
  return { studyId: evidence.studyId, stageId: evidence.stageId, kind: "POSTEXECUTION-SAVED-SOLUTION-DESCRIPTION",
    evidenceGzipSha256: crypto.createHash("sha256").update(compressed).digest("hex"),
    uncompressedBytes: bytes.length, rows,
    rootsWithWinLossVariation: rows.filter(r => r.heterogeneousWinLoss === true).length,
    rootsWithDtfVariation: rows.filter(r => r.heterogeneousDtf === true).length,
    freshSourcesGenerated: 0, freshTransitionsGenerated: 0, candidatesReselected: 0,
    searchComparisonsPerformed: 0, formalInference: false };
}
if (require.main === module) console.log(JSON.stringify(describe(path.resolve(process.argv[2])), null, 2));
module.exports = { describe };
