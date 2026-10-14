"use strict";
// 保存ノードと合法手種別だけを読む。エンジン・solver・source生成器をimportしない。
const fs = require("node:fs"), path = require("node:path"), zlib = require("node:zlib"), crypto = require("node:crypto"), assert = require("node:assert/strict");
const C = require("./core.cjs");
const root = path.resolve(__dirname, "../../.."), docs = path.join(root, "doc/research-generation-5/source-design-20261013");
const sha = b => crypto.createHash("sha256").update(b).digest("hex");
const read = p => JSON.parse(fs.readFileSync(p));
function describeDomain(domain, limits, index) {
  const states = new Map(domain.states.map(r => [r.id, r.state])), nodes = new Map(domain.nodes.map(n => [n.id, n]));
  assert.equal(nodes.size, domain.nodes.length);
  const counts = {}, originalRoot = {};
  for (const node of domain.nodes) {
    const state = states.get(node.id); assert.ok(state);
    const projection = { nonterminal: node.winner === null, phase: state.phase, reserve: state.reserve, width: node.moves.length };
    const branches = node.moves.map(m => {
      const s = states.get(m.to), n = nodes.get(m.to);
      if (!s) return null;
      return { nonterminal: s.winner === null, width: n?.moves.length ?? null, mode: n ? C.replyMode(n.moves.map(m => m.key)) : null };
    });
    const status = C.classify(projection, branches, limits);
    counts[status] = (counts[status] ?? 0) + 1;
    if (node.id === domain.rootKey) originalRoot.status = status;
  }
  return { domain: index + 1, savedNodes: domain.nodes.length, complete: domain.complete, counts, originalRoot };
}
function audit() {
  const manifest = read(path.join(docs,"SOURCE_MANIFEST.json"));
  for (const [file, hash] of Object.entries(manifest.files)) assert.equal(sha(fs.readFileSync(path.join(root,file))),hash,file);
  const proposal = read(path.join(docs,"DESIGN_PROPOSAL.json"));
  assert.equal(proposal.status,"PROPOSAL-NOT-EXECUTION-REGISTRATION");
  const studies = ["g5-02","g5-03","g5-04"].map(id => {
    const file = path.join(root, `doc/research-generation-5/${id}/results/EVIDENCE.json.gz`), evidence = JSON.parse(zlib.gunzipSync(fs.readFileSync(file)));
    return { location:id, evidenceGzipSha256:sha(fs.readFileSync(file)),
      domains:evidence.domains.map((d,i) => describeDomain(d,proposal.selection,i)) };
  });
  const counts = {};
  for (const s of studies) for (const d of s.domains) for (const [k,v] of Object.entries(d.counts)) counts[k] = (counts[k] ?? 0) + v;
  return { designId:proposal.designId, kind:"SAVED-GRAPH-STRUCTURAL-DESIGN-AUDIT", inputManifestSha256:sha(fs.readFileSync(path.join(docs,"SOURCE_MANIFEST.json"))),
    studies, counts, freshScientificSeedsGenerated:0, freshTransitionsGenerated:0, candidatesReselected:0,
    exactValuesRead:false, rankingOutputsRead:false, formalInference:false, executionAuthorized:false };
}
if (require.main === module) {
  const result = audit(), file = path.join(docs,"results/RESULT.json");
  if (process.argv.includes("--check")) {
    assert.deepEqual(result,read(file));
    const binding = read(path.join(docs,"results/RESULT_BINDING.json"));
    assert.equal(sha(fs.readFileSync(file)),binding.files[path.relative(root,file)]);
    console.log("SOURCE-DESIGN-AUDIT-REPLAY-PASS");
  } else if (process.argv.includes("--write")) { fs.writeFileSync(file,JSON.stringify(result,null,2)+"\n"); console.log(JSON.stringify(result.counts)); }
  else console.log(JSON.stringify(result,null,2));
}
module.exports = { audit, describeDomain };
