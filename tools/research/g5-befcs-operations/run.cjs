"use strict";
const fs = require("node:fs"), os = require("node:os"), path = require("node:path"), cp = require("node:child_process"), zlib = require("node:zlib"), assert = require("node:assert/strict");
const R = require("./registry.cjs"), I = require("./independent-registry.cjs"), { capture } = require("./capture.cjs"), { supervise } = require("./supervisor.cjs");
const root = path.resolve(__dirname, "../../.."), docs = path.join(root, "doc/research-generation-5/befcs-operations-20261013");
function binding() {
  for (const name of ["SOURCE_MANIFEST.json", "PROTECTED_INPUTS.json"]) {
    const file = JSON.parse(fs.readFileSync(path.join(docs, name)));
    for (const [name, digest] of Object.entries(file.files)) assert.equal(R.hash(fs.readFileSync(path.join(root, name))), digest, name);
  }
  const config = JSON.parse(fs.readFileSync(path.join(docs, "CONFIG.json")));
  assert.equal(config.scientificSeedsRead, 0); assert.equal(config.scientificExecutionAuthorized, false);
  return config;
}
async function write() {
  const config = binding(), temp = fs.mkdtempSync(path.join(os.tmpdir(), "befcs-ops-evidence-"));
  try {
    const remote = path.join(temp, "remote.git"), repo = path.join(temp, "client"), directory = path.join(temp, "worker");
    cp.execFileSync("git", ["init", "--quiet", "--bare", remote]);
    const registry = R.open(repo, remote), request = { evidenceClass: "TECHNICAL-REGISTRY-FIXTURE", stageId: config.technicalId,
      runId: "fixed-operations-fixture", runAttempt: 1, binding: R.hash(fs.readFileSync(path.join(docs, "CONFIG.json"))), block: { start: 1, count: 128 } };
    registry.acquire(request); let logicalCallbacks = 0;
    for (let index = 0; index < 128; index++) registry.consume(request.stageId, request.runId, index, id => {
      assert.equal(id, index + 1); logicalCallbacks++;
    }, request.binding);
    let sequence = 0; const phases = [];
    const execution = await supervise(process.execPath, [path.join(__dirname, "worker-fixture.cjs"), "ignore-term", directory], config.supervisionLimits, {
      async mirror(final) {
        const c = capture(directory, config.captureMaxBytes); if (!Object.keys(c.journals).length) return;
        c.files["PHASE.json"] = Buffer.from(JSON.stringify({ final, complete: false, solution: null }));
        registry.mirror(request.stageId, request.runId, sequence++, c.files, config.mirrorLimits); phases.push(final);
      }
    });
    assert.equal(execution.status, "GLOBAL-TIME-LIMIT"); assert.equal(execution.signal, "SIGKILL");
    assert.ok(phases.includes(false)); assert.equal(phases.at(-1), true);
    const current = registry.read(), replay = I.verify(repo, current.sha), bundle = path.join(temp, "REGISTRY.bundle");
    cp.execFileSync("git", ["update-ref", registry.ref, current.sha], { cwd: repo });
    cp.execFileSync("git", ["bundle", "create", bundle, registry.ref], { cwd: repo });
    const evidence = { technicalId: config.technicalId, ref: registry.ref, head: current.sha,
      registryBundleBase64: fs.readFileSync(bundle).toString("base64"), replay, phases, logicalCallbacks,
      fixtureStoppedStatus: execution.status, solution: null, scientificSeedsRead: 0 };
    const bytes = Buffer.from(JSON.stringify(evidence)), result = { technicalId: config.technicalId,
      decision: "LOCAL-OPERATIONS-FIXTURE-PASS-CGROUP-CI-PENDING", registryReplay: replay, logicalCallbacks,
      liveMirrorVerified: phases.includes(false), finalMirrorVerified: phases.at(-1) === true,
      evidenceSha256: R.hash(bytes), evidenceBytes: bytes.length, solution: null,
      scientificSeedsRead: 0, scientificLeaseCreated: false, scientificStudyRegistered: false, scientificExecutionAuthorized: false,
      conservativeReadIdentities: 103355, newBaoRawObserved: 0, formalRelationRegistered: false, publicAiChanged: false };
    fs.writeFileSync(path.join(docs, "results/RESULT.json"), JSON.stringify(result, null, 2) + "\n");
    fs.writeFileSync(path.join(docs, "results/TECHNICAL_EVIDENCE.json.gz"), zlib.gzipSync(bytes));
    fs.writeFileSync(path.join(docs, "results/EXECUTION.json"), JSON.stringify({ node: process.version, ...execution }, null, 2) + "\n");
    return result;
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}
function check() {
  binding(); const result = JSON.parse(fs.readFileSync(path.join(docs, "results/RESULT.json"))), bytes = zlib.gunzipSync(fs.readFileSync(path.join(docs, "results/TECHNICAL_EVIDENCE.json.gz")));
  assert.equal(bytes.length, result.evidenceBytes); assert.equal(R.hash(bytes), result.evidenceSha256);
  const evidence = JSON.parse(bytes), temp = fs.mkdtempSync(path.join(os.tmpdir(), "befcs-ops-replay-"));
  try {
    const bundle = path.join(temp, "REGISTRY.bundle"), repo = path.join(temp, "repo");
    fs.writeFileSync(bundle, Buffer.from(evidence.registryBundleBase64, "base64")); cp.execFileSync("git", ["init", "--quiet", repo]);
    cp.execFileSync("git", ["bundle", "verify", bundle], { cwd: repo, stdio: "ignore" });
    cp.execFileSync("git", ["fetch", "--quiet", bundle, evidence.ref], { cwd: repo });
    assert.deepEqual(I.verify(repo, evidence.head), evidence.replay); assert.deepEqual(evidence.replay, result.registryReplay);
    const record = JSON.parse(cp.execFileSync("git", ["show", evidence.head + ":REGISTRY.json"], { cwd: repo, encoding: "utf8" }));
    const phases = [];
    for (const mirror of record.mirrors) {
      const restored = {};
      for (const f of mirror.files) restored[f.name] = Buffer.concat(f.chunks.map(c => cp.execFileSync("git", ["show", evidence.head + ":" + c.object], { cwd: repo })));
      const coverage = JSON.parse(restored["MIRROR_COVERAGE.json"]), phase = JSON.parse(restored["PHASE.json"]);
      assert.equal(coverage.solution, null); assert.equal(coverage.complete, false); assert.equal(coverage.resumeAuthorized, false);
      for (const [name, row] of Object.entries(coverage.journals)) {
        const bytes = restored[name], end = bytes.lastIndexOf(10) + 1;
        const prefix = require("../g5-branch-envelope/storage.cjs").replayJournal(bytes.subarray(0, end));
        assert.equal(row.verifiedPrefixBytes, end); assert.equal(row.verifiedRows, prefix.length); assert.equal(row.partialTailBytes, bytes.length - end);
        prefix.forEach((value, index) => assert.deepEqual(value, { kind: "technical-only", sequence: index }));
      }
      assert.equal(phase.solution, null); assert.equal(phase.complete, false); phases.push(phase.final);
    }
    assert.deepEqual(phases, evidence.phases);
    assert.equal(evidence.logicalCallbacks, 128); assert.equal(evidence.scientificSeedsRead, 0);
    assert.equal(result.scientificExecutionAuthorized, false); assert.equal(result.scientificStudyRegistered, false);
    assert.ok(evidence.phases.includes(false)); assert.equal(evidence.phases.at(-1), true); assert.equal(evidence.solution, null);
    assert.equal(evidence.fixtureStoppedStatus, "GLOBAL-TIME-LIMIT"); return result;
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
}
if (require.main === module) {
  assert.ok(process.argv.length === 3 && ["--write", "--check"].includes(process.argv[2]), "TECHNICAL-ONLY-CLI");
  Promise.resolve(process.argv[2] === "--write" ? write() : check()).then(result => console.log(JSON.stringify(result))).catch(e => { console.error(e); process.exitCode = 1; });
}
module.exports = { binding, write, check };
