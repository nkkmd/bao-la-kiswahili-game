"use strict";
// 保存グラフだけを走査する事後診断。新規source・遷移・候補を生成しない。
const fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib"), crypto = require("node:crypto");
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
function diagnose(directory) {
  const compressed = fs.readFileSync(path.join(directory, "EVIDENCE.json.gz"));
  const bytes = zlib.gunzipSync(compressed), evidence = JSON.parse(bytes);
  const rows = evidence.domains.map((domain, index) => {
    const candidate = evidence.selectedCandidates[index], state = candidate.state, adjacency = new Map();
    for (const edge of domain.edges) {
      if (!adjacency.has(edge.from)) adjacency.set(edge.from, []);
      adjacency.get(edge.from).push(edge.to);
    }
    const depth = new Map([[domain.rootKey, 0]]), queue = [domain.rootKey];
    for (let n = 0; n < queue.length; n++) for (const to of adjacency.get(queue[n]) ?? []) {
      if (!depth.has(to)) { depth.set(to, depth.get(queue[n]) + 1); queue.push(to); }
    }
    const counts = {};
    for (const d of depth.values()) counts[d] = (counts[d] ?? 0) + 1;
    return { candidate: index + 1, sourceIndex: candidate.sourceIndex,
      seed: evidence.sources[candidate.sourceIndex].seed, rootPly: candidate.ply, rootWidth: candidate.width,
      occupied: state.pits.flat(2).filter(v => v > 0).length,
      frontTotals: state.pits.map(side => side[0].reduce((a,b) => a+b, 0)),
      status: domain.status, states: domain.states.length, edges: domain.edges.length,
      fullyExpandedNodes: domain.nodes.length, savedMaxShortestDepth: Math.max(...depth.values()),
      savedDepthCounts: counts, elapsedMs: domain.elapsedMs };
  });
  return { studyId: evidence.studyId, stageId: evidence.stageId, kind: "POSTEXECUTION-SAVED-GRAPH-DESCRIPTION",
    evidenceGzipSha256: sha(compressed), compressedBytes: compressed.length, uncompressedBytes: bytes.length,
    freshSourcesGenerated: 0, freshTransitionsGenerated: 0, candidatesReselected: 0, formalInference: false,
    depthMeaning: "Shortest distance within saved partial edges; not a completely expanded or solved horizon.", rows };
}
if (require.main === module) console.log(JSON.stringify(diagnose(path.resolve(process.argv[2])), null, 2));
module.exports = { diagnose };
