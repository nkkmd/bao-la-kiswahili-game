"use strict";
// 主registryをimportせず、remote履歴・順序・blobを独立に読む。
const assert = require("node:assert/strict"), cp = require("node:child_process"), crypto = require("node:crypto");
function verify(repository, head) {
  const git = args => cp.execFileSync("git", args, { cwd: repository, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
  const history = git(["rev-list", "--reverse", head]).split("\n");
  let previous = { leases: [], mirrors: [] }, previousSha = null;
  for (const sha of history) {
    const parents = git(["show", "-s", "--format=%P", sha]); assert.equal(parents, previousSha ?? "");
    const record = JSON.parse(git(["show", sha + ":REGISTRY.json"])); assert.equal(record.version, 1);
    assert.ok(record.leases.length >= previous.leases.length && record.mirrors.length >= previous.mirrors.length);
    for (let n = 0; n < record.leases.length; n++) {
      const lease = record.leases[n]; assert.equal(lease.evidenceClass, "TECHNICAL-REGISTRY-FIXTURE");
      assert.equal(lease.runAttempt, 1); assert.equal(lease.status, "BLOCK-QUARANTINED-NO-RETRY");
      assert.ok(lease.consumes.length <= lease.block.count);
      if (previous.leases[n]) {
        const { consumes: before, ...a } = previous.leases[n], { consumes: after, ...b } = lease;
        assert.deepEqual(a, b); assert.deepEqual(after.slice(0, before.length), before);
        assert.ok(after.length <= before.length + 1);
      } else assert.equal(lease.consumes.length, 0);
      for (let k = 0; k < lease.consumes.length; k++) assert.deepEqual(lease.consumes[k], {
        index: k, logicalId: lease.block.start + k, binding: lease.binding, runId: lease.runId, beforeRead: true
      });
      for (const other of record.leases.slice(0, n)) {
        assert.notEqual(lease.stageId, other.stageId);
        assert.ok(lease.block.start + lease.block.count <= other.block.start || other.block.start + other.block.count <= lease.block.start);
      }
    }
    assert.deepEqual(record.mirrors.slice(0, previous.mirrors.length), previous.mirrors);
    for (const mirror of record.mirrors.slice(previous.mirrors.length)) {
      const lease = record.leases.find(l => l.stageId === mirror.stageId); assert.ok(lease); assert.equal(mirror.runId, lease.runId);
      assert.equal(mirror.sequence, previous.mirrors.filter(m => m.stageId === mirror.stageId).length);
      for (const f of mirror.files) {
        let offset = 0; const fileHash = crypto.createHash("sha256");
        for (const chunk of f.chunks) {
          assert.equal(chunk.offset, offset); assert.ok(chunk.bytes > 0 && chunk.bytes <= 50331648);
          assert.equal(chunk.object, "objects/" + chunk.sha256);
          const bytes = cp.execFileSync("git", ["show", sha + ":" + chunk.object], { cwd: repository, maxBuffer: 50331648 + 1024 });
          assert.equal(bytes.length, chunk.bytes); assert.equal(crypto.createHash("sha256").update(bytes).digest("hex"), chunk.sha256);
          offset += bytes.length; fileHash.update(bytes);
        }
        assert.equal(offset, f.bytes); assert.equal(fileHash.digest("hex"), f.sha256);
      }
    }
    const changes = record.leases.length - previous.leases.length + record.mirrors.length - previous.mirrors.length
      + record.leases.reduce((s, l, n) => s + l.consumes.length - (previous.leases[n]?.consumes.length ?? 0), 0);
    assert.equal(changes, 1, "ONE-DURABLE-TRANSACTION-PER-COMMIT");
    previous = record; previousSha = sha;
  }
  return { verified: true, commits: history.length, leases: previous.leases.length,
    logicalReadsMarked: previous.leases.reduce((n, l) => n + l.consumes.length, 0), mirrors: previous.mirrors.length,
    scientificSeedsRead: 0 };
}
module.exports = { verify };
