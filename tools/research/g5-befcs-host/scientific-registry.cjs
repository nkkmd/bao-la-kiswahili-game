"use strict";
// 科学専用Git transport。全区画取得は最終science-gateの照合後だけ許可する。
const fs = require("node:fs"), path = require("node:path"), cp = require("node:child_process"), assert = require("node:assert/strict"), crypto = require("node:crypto");
const hash = b => crypto.createHash("sha256").update(b).digest("hex");
const REF = "refs/heads/research/g5-source-registry-v1";
function open(repository, remote, ref = REF) {
  assert.equal(ref, REF, 'SCIENTIFIC-REGISTRY-NAMESPACE-MISMATCH');
  fs.mkdirSync(repository, { recursive: true });
  const env = { ...process.env, GIT_AUTHOR_NAME: "BEFCS scientific registry", GIT_AUTHOR_EMAIL: "registry@example.invalid", GIT_COMMITTER_NAME: "BEFCS scientific registry", GIT_COMMITTER_EMAIL: "registry@example.invalid" };
  function git(args, input) { return cp.execFileSync("git", args, { cwd: repository, env, input, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], timeout: 30000, maxBuffer: 16778240 }).trim(); }
  if (!fs.existsSync(path.join(repository, ".git"))) git(["init", "--quiet"]);
  function head() { const rows = git(["ls-remote", remote, ref]); return rows ? rows.split(/\s+/)[0] : null; }
  function read() {
    const sha = head();
    if (sha === null) return { sha, record: { version: 1, leases: [], mirrors: [] } };
    git(["fetch", "--quiet", remote, sha]);
    return { sha, record: JSON.parse(git(["show", sha + ":REGISTRY.json"])) };
  }
  function commit(expected, record, files = {}) {
    assert.ok(Buffer.byteLength(JSON.stringify(record)+"\n")<=16777216,"REGISTRY-METADATA-LIMIT");
    assert.equal(head(), expected, "REGISTRY-CAS-CONFLICT");
    const index = path.join(repository, "temporary-index"); fs.rmSync(index, { force: true });
    const saved = env.GIT_INDEX_FILE; env.GIT_INDEX_FILE = index;
    let commit;
    try {
      if (expected) git(["read-tree", expected]); else git(["read-tree", "--empty"]);
      for (const [name, bytes] of Object.entries({ ...files, "REGISTRY.json": JSON.stringify(record) + "\n" })) {
        assert.ok(!name.startsWith("/") && !name.split("/").some(p => !p || p === "." || p === ".."));
        const blob = git(["hash-object", "-w", "--stdin"], bytes);
        git(["update-index", "--add", "--cacheinfo", "100644," + blob + "," + name]);
      }
      const tree = git(["write-tree"]);
      commit = git(["commit-tree", tree, ...(expected ? ["-p", expected] : []), "-m", "BEFCS durable scientific transaction"]);
      const output = git(["push", "--porcelain", "--force-with-lease=" + ref + ":" + (expected ?? ""), remote, commit + ":" + ref]);
      assert.ok(!output.includes("[up to date]"), "CAS-NO-OP-REFUSED");
      assert.equal(head(), commit, "REMOTE-RECEIPT-MISMATCH");
    } finally { if (saved === undefined) delete env.GIT_INDEX_FILE; else env.GIT_INDEX_FILE = saved; fs.rmSync(index, { force: true }); }
    return { sha: commit, record };
  }
  function acquire(request) {
    const gate = require('../g5-befcs-workload/science-gate.cjs').openScience();
    const runId = require('./host.cjs').validateTrigger(gate, process.env);
    assert.equal(request.runId, runId); assert.equal(request.executionCommit, process.env.GITHUB_SHA);
    assert.equal(request.evidenceClass, 'BEFCS-SCIENTIFIC-SOURCE');
    assert.equal(request.studyId, gate.spec.studyId); assert.equal(request.stageId, gate.spec.stageId);
    assert.equal(request.binding, gate.binding); assert.equal(request.runAttempt, 1);
    assert.deepEqual(request.block, { start: gate.spec.seedBlock.start, count: gate.spec.seedBlock.count });
    const current = read();
    for (const lease of current.record.leases) {
      assert.notEqual(lease.stageId, request.stageId, 'DUPLICATE-STAGE');
      assert.ok(request.block.start + request.block.count <= lease.block.start ||
        lease.block.start + lease.block.count <= request.block.start, 'BLOCK-OVERLAP');
    }
    current.record.leases.push({ ...structuredClone(request), status: 'BLOCK-QUARANTINED-NO-RETRY', consumes: [] });
    return commit(current.sha, current.record);
  }
  function consume(stageId, runId, index, readValue, binding) {
    const gate = require('../g5-befcs-workload/science-gate.cjs').openScience();
    assert.equal(stageId, gate.spec.stageId); assert.equal(binding, gate.binding);
    assert.equal(runId, require('./host.cjs').validateTrigger(gate, process.env));
    const current = read(), lease = current.record.leases.find(l => l.stageId === stageId);
    assert.equal(lease?.evidenceClass, 'BEFCS-SCIENTIFIC-SOURCE');
    assert.ok(lease); assert.equal(lease.runAttempt, 1); assert.equal(lease.runId, runId); assert.equal(lease.binding, binding);
    assert.equal(index, lease.consumes.length, "NONSEQUENTIAL-OR-DUPLICATE-CONSUME"); assert.ok(index < lease.block.count);
    const marker = { index, logicalId: lease.block.start + index, binding, runId, beforeRead: true };
    lease.consumes.push(marker);
    const receipt = commit(current.sha, current.record);
    // callbackへ値を渡す前にremote refのreceipt一致を確認する。
    return { receipt: receipt.sha, value: readValue(marker.logicalId, receipt.sha) };
  }
  function mirror(stageId, runId, sequence, files, limits = { chunkBytes: 65536, maxStoredBytes: 268435456 }) {
    const gate = require('../g5-befcs-workload/science-gate.cjs').openScience();
    assert.equal(stageId, gate.spec.stageId);
    assert.equal(runId, require('./host.cjs').validateTrigger(gate, process.env));
    const current = read(), lease = current.record.leases.find(l => l.stageId === stageId);
    assert.ok(lease); assert.equal(lease.runId, runId);
    assert.equal(lease.evidenceClass, 'BEFCS-SCIENTIFIC-SOURCE'); assert.equal(lease.binding, gate.binding);
    const previous = current.record.mirrors.filter(m => m.stageId === stageId);
    assert.equal(sequence, previous.length, "MIRROR-SEQUENCE-CONFLICT");
    assert.ok(limits.chunkBytes > 0 && limits.chunkBytes <= 50331648);
    const objects = {}, entries = [], stored = new Map();
    for (const m of current.record.mirrors) for (const f of m.files) for (const chunk of f.chunks) stored.set(chunk.sha256, chunk.bytes);
    for (const [name, bytes] of Object.entries(files)) {
      assert.match(name, /^[A-Za-z0-9_.-]+$/); const payload = Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes), chunks = [];
      for (let offset = 0; offset < payload.length; offset += limits.chunkBytes) {
        const part = payload.subarray(offset, offset + limits.chunkBytes), digest = hash(part), key = "objects/" + digest;
        chunks.push({ offset, bytes: part.length, sha256: digest, object: key });
        if (!stored.has(digest)) { stored.set(digest, part.length); objects[key] = part; }
      }
      entries.push({ name, bytes: payload.length, sha256: hash(payload), chunks });
    }
    assert.ok([...stored.values()].reduce((a, b) => a + b, 0) <= limits.maxStoredBytes, "MIRROR-STORAGE-LIMIT");
    const manifest = { stageId, runId, sequence, files: entries.sort((a, b) => a.name.localeCompare(b.name)), coverage: "DURABLE-BYTES-NOT-SCIENTIFIC-COMPLETENESS" };
    current.record.mirrors.push(manifest);
    assert.ok(Buffer.byteLength(JSON.stringify(current.record)) <= 16777216, "REGISTRY-METADATA-LIMIT");
    const result = commit(current.sha, current.record, objects);
    return { ...result, manifest };
  }
  return { read, acquire, consume, mirror, ref };
}
module.exports = { open, hash, REF };

