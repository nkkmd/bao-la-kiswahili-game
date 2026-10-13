"use strict";
const fs = require("node:fs"), path = require("node:path"), os = require("node:os"), zlib = require("node:zlib"), assert = require("node:assert/strict"), cp = require("node:child_process");
const S = require("./source.cjs"), I = require("./independent-source.cjs"), Storage = require("./storage.cjs"), F = require("./fixtures.cjs"), Closure = require("./closure.cjs");
const M = require("../g5-01/measurement.cjs"), Codec = require("../g5-method/raw-codec.cjs"), IndependentCodec = require("../g5-method/independent-raw-codec.cjs");
const BF = require("../g5-compact-bfs/fixtures.cjs"), { budget } = require("./budget.cjs");
const root = path.resolve(__dirname, "../../.."), docs = path.join(root, "doc/research-generation-5/branch-envelope-preflight-20261013");
function binding() {
  const manifest = JSON.parse(fs.readFileSync(path.join(docs, "SOURCE_MANIFEST.json"))), config = JSON.parse(fs.readFileSync(path.join(docs, "CONFIG.json")));
  for (const [p, digest] of Object.entries(manifest.files)) assert.equal(Storage.hash(fs.readFileSync(path.join(root, p))), digest, p);
  const protectedInputs = JSON.parse(fs.readFileSync(path.join(docs, "PROTECTED_INPUTS.json")));
  for (const [p, digest] of Object.entries(protectedInputs.files)) assert.equal(Storage.hash(fs.readFileSync(path.join(root, p))), digest, p);
  assert.equal(config.scientificSeedBlock, null); assert.equal(config.scientificSeedsConsumed, 0); assert.equal(config.scientificRunnerAuthorized, false); assert.equal(config.leaseCreated, false);
  return { config, manifest, digest: Storage.hash(fs.readFileSync(path.join(docs, "SOURCE_MANIFEST.json"))) };
}
async function run() {
  const { config, manifest, digest } = binding(), began = performance.now(), global = budget(config.wholeTechnicalRunLimits), prior = F.priorFirewall();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "befcs-preflight-")), evidence = { technicalId: config.technicalId, sources: [], closures: [], archives: [] }, reads = new Set();
  async function archive(directory, id) {
    global.check(); const names = fs.readdirSync(directory).sort(), index = await Storage.bundle(directory, names, config.smallStorageLimits, () => global.check());
    assert.equal(index.complete, true); await Storage.verifyBundle(directory, index, config.smallStorageLimits); global.check();
    evidence.archives.push({ id, index, parts: index.shards.map(s => ({ name: s.name, base64: fs.readFileSync(path.join(directory, s.name)).toString("base64") })) });
  }
  try {
    const cases = [
      { id: "FIRST-48" }, { id: "AGGREGATE-17", options: { replyWidths: [8, 8, 1] } },
      { id: "AGGREGATE-16", options: { replyWidths: [8, 8] } }, { id: "FIRST-CHILD-READ", block: [600] },
      { id: "SHARED-PATH-ALLOWED", block: [0] }, { id: "REPLY-UNKNOWN", options: { unknownReply: true } },
      { id: "LATER-UNKNOWN", options: { laterUnknown: true } }, { id: "PLY-48", limits: { maxPly: 48 } },
      { id: "PLY-512", options: { long: true }, limits: { maxPly: 512 } }, { id: "REJECTION-DRAW", seed: 4166445141 }
    ];
    for (const row of cases) {
      global.check(); const directory = path.join(temp, row.id), output = Storage.store(directory, config.smallStorageLimits);
      const p = F.sourceFixture(row.id, row.options), q = F.sourceFixture(row.id, row.options, true), seen = new Set();
      const observe = (state, context) => {
        const id = M.rawKey(state); reads.add(id); if (seen.has(id)) return; seen.add(id);
        output.append("reads.jsonl", { id, payload: Codec.encodeRaw(state).toString("base64"), context });
      };
      const excluded = new Set((row.block ?? []).map(n => M.rawKey(F.state(n)))), spec = { ...config.sourceLimits, ...row.limits };
      const context = { evidenceClass: "TECHNICAL-FIXTURE", fixtureId: row.id, allowedSeeds: config.fixtureSeeds };
      const api = S.paired(p.api, q.api, { check: () => global.check(), observe });
      let result;
      try {
        result = S.generateFixture(row.seed ?? 1, spec, p.initial, api, excluded, context, {
          check: () => global.check(), observe, emit: r => output.append("source.jsonl", r),
          checkpoint: (s, mode) => output.snapshot("SOURCE_CHECKPOINT.json", { source: s, resumeAuthorized: false }, Boolean(mode?.final))
        });
        I.replay(result, spec, q.initial, q.api, excluded, context);
        for (const r of Storage.replayJournal(fs.readFileSync(path.join(directory, "reads.jsonl")))) {
          assert.equal(M.rawKey(IndependentCodec.decodeRaw(Buffer.from(r.payload, "base64"))), r.id); assert.ok(prior.has(r.id), "NOVEL-TECHNICAL-RAW");
        }
        const rows = Storage.replayJournal(fs.readFileSync(path.join(directory, "source.jsonl")));
        assert.equal(rows[0].kind, "fixture-seed"); assert.equal(rows[0].seed, result.seed);
        assert.deepEqual(rows.filter(r => r.kind === "source-step").map(r => r.row), result.trace);
        assert.deepEqual(rows.filter(r => r.kind === "source-screen").map(r => r.screen), result.screens);
      } finally { output.close(); }
      evidence.sources.push({ id: row.id, spec, excluded: [...excluded], source: result, readIdentities: [...seen].sort() });
      await archive(directory, row.id);
    }
    const frozen = S.freezeCandidates(evidence.sources.map(r => r.source), 8); I.verifyFrozen(evidence.sources.map(r => r.source), 8, frozen); evidence.fixtureSelection = frozen;
    const closureCases = [
      { id: "BAO-COMPLETE", fixture: "BAO-FORCED-WIN" }, { id: "BAO-READ-STOP", fixture: "BAO-FORCED-WIN", childBlocked: true },
      { id: "BAO-MICRO-STOP", fixture: "BAO-RELAY-CAP-1" }, { id: "ABSTRACT-CYCLE", fixture: "ABSTRACT-CYCLE" },
      { id: "STATE-STOP", fixture: "ABSTRACT-DIAMOND", limits: { maxStates: 2 } },
      { id: "EDGE-STOP", fixture: "ABSTRACT-DIAMOND", limits: { maxEdges: 1 } },
      { id: "STORAGE-STOP", fixture: "ABSTRACT-CHAIN-256", storage: { maxEvidenceBytes: 100000, storageReserveBytes: 90000 } }
    ];
    for (const row of closureCases) {
      global.check(); const directory = path.join(temp, row.id), output = Storage.store(directory, { ...config.smallStorageLimits, ...row.storage });
      const p = BF.fixture(row.fixture), q = BF.fixture(row.fixture, true), excluded = new Set();
      if (row.childBlocked) excluded.add(M.rawKey(p.adapter.apply(p.state, p.adapter.variants(p.state).moves[0]).state));
      const start = global.clock(), limits = { ...config.closureLimits, ...row.limits }, domainBudget = budget({ ...config.wholeTechnicalRunLimits, maxDomainMs: limits.maxDomainMs });
      let result;
      try { result = Closure.runFixture(p, q, limits, output, excluded, () => { global.check(); domainBudget.check(start); }); }
      finally { output.close(); }
      result.observedReadIdentities.forEach(id => { reads.add(id); assert.ok(prior.has(id)); });
      evidence.closures.push({ id: row.id, result }); await archive(directory, row.id);
    }
    const nominal = [];
    for (const mode of ["boundary", "shards"]) {
      global.check(); nominal.push(JSON.parse(cp.execFileSync(process.execPath, [path.join(__dirname, "capacity-smoke.cjs"), mode], { encoding: "utf8", timeout: 90000 }))); global.check();
    }
    evidence.nominalCapacity = nominal;
    const bytes = Buffer.from(JSON.stringify(evidence));
    const result = { technicalId: config.technicalId, decision: "BRANCH-ENVELOPE-FIXTURE-PREFLIGHT-PASS-NOT-SCIENTIFIC-AUTHORIZATION",
      sourceManifestSha256: digest, protectedInputCount: manifest.protectedInputCount, sourceFixtureCount: evidence.sources.length,
      sourceFixtures: evidence.sources.map(r => ({ id: r.id, stop: r.source.stop, traceLength: r.source.trace.length, firstEligiblePly: r.source.firstEligible?.ply ?? null, selectedPly: r.source.candidate?.ply ?? null })),
      closureFixtures: evidence.closures.map(r => ({ id: r.id, status: r.result.stageStatus, graphComplete: r.result.domain.complete,
        interpretationComplete: r.result.interpretationComplete, states: r.result.domain.ids.length, edges: r.result.domain.edges.length, solutionCounts: r.result.solution?.counts ?? null })),
      archivesVerified: evidence.archives.length, observedTechnicalIdentities: reads.size, novelConservativeIdentities: [...reads].filter(id => !prior.has(id)).length,
      conservativeCombinedReadIdentities: prior.size, nominalCapacity: nominal, evidenceBytes: bytes.length, evidenceSha256: Storage.hash(bytes),
      newScientificSources: 0, newScientificSeeds: 0, newScientificCandidates: 0, scientificRunnerAuthorized: false, leaseCreated: false,
      fullClosureRequirementChanged: false, formalRelationRegistered: false, formalRelationExecuted: false, publicAiChanged: false };
    return { bytes, result, execution: { node: process.version, elapsedMs: Math.round(performance.now() - began), peakRssBytes: process.resourceUsage().maxRSS * 1024 } };
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}
if (require.main === module) {
  assert.ok(process.argv.length === 3 && ["--write", "--check"].includes(process.argv[2]), "FIXTURE-ONLY-CLI");
  run().then(value => {
    if (process.argv[2] === "--write") {
      fs.writeFileSync(path.join(docs, "results/RESULT.json"), JSON.stringify(value.result, null, 2) + "\n");
      fs.writeFileSync(path.join(docs, "results/TECHNICAL_EVIDENCE.json.gz"), zlib.gzipSync(value.bytes));
      fs.writeFileSync(path.join(docs, "results/EXECUTION.json"), JSON.stringify(value.execution, null, 2) + "\n");
    } else {
      assert.deepEqual(value.result, JSON.parse(fs.readFileSync(path.join(docs, "results/RESULT.json"))));
      assert.deepEqual(value.bytes, zlib.gunzipSync(fs.readFileSync(path.join(docs, "results/TECHNICAL_EVIDENCE.json.gz"))));
    }
    console.log(JSON.stringify(value.result));
  }).catch(error => { console.error(error); process.exitCode = 1; });
}
module.exports = { binding, run };
