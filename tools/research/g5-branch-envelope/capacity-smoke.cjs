"use strict";
const fs = require("node:fs"), os = require("node:os"), path = require("node:path"), crypto = require("node:crypto"), assert = require("node:assert/strict");
const Storage = require("./storage.cjs"), limits = require("../../../doc/research-generation-5/branch-envelope-20261013/PROPOSAL.json").resources;
async function run(mode) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "befcs-cap-"));
  const started = performance.now(), check = () => {
    assert.ok(performance.now() - started < limits.maxTotalMs, "CAPACITY-TIME-LIMIT");
    assert.ok(process.resourceUsage().maxRSS * 1024 <= limits.maxRssBytes, "CAPACITY-RSS-LIMIT");
  };
  try {
    if (mode === "boundary") {
      const output = Storage.store(directory, limits), normal = limits.maxEvidenceBytes - limits.storageReserveBytes;
      output.snapshot("normal.bin", Buffer.alloc(normal));
      check();
      assert.throws(() => output.snapshot("too-normal.bin", Buffer.alloc(1)), /RESERVE/);
      output.snapshot("finish.bin", Buffer.alloc(limits.storageReserveBytes), true);
      assert.throws(() => output.snapshot("too-critical.bin", Buffer.alloc(1), true), /BYTE-LIMIT/);
      assert.equal(output.usedBytes, limits.maxEvidenceBytes); output.close();
      check();
      return { mode, normalBytes: normal, reserveBytes: limits.storageReserveBytes, totalBytes: limits.maxEvidenceBytes, byteBoundaryVerified: true };
    }
    assert.equal(mode, "shards");
    const fd = fs.openSync(path.join(directory, "pressure.bin"), "wx"), cipher = crypto.createCipheriv("aes-256-ctr", Buffer.alloc(32), Buffer.alloc(16));
    const bytes = limits.maxEvidenceBytes - limits.storageReserveBytes;
    try { for (let n = 0; n < bytes; n += 1048576) { check(); fs.writeSync(fd, cipher.update(Buffer.alloc(Math.min(1048576, bytes - n)))); } fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    // 暗号streamは容量fixtureの固定バイト生成だけに使用する。科学sourceのPRNGではない。
    const index = await Storage.bundle(directory, ["pressure.bin"], limits, check);
    assert.equal(index.complete, true); assert.equal(index.shards.length, 6); await Storage.verifyBundle(directory, index, limits); check();
    return { mode, expandedBytes: index.expandedBytes, gzipBytes: index.gzipBytes, shardBytes: index.shards.map(s => s.bytes), streamRoundtripVerified: true };
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}
if (require.main === module) run(process.argv[2]).then(result => console.log(JSON.stringify(result))).catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { run };
