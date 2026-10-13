"use strict";
// Actions上の実cgroup OOM検証。科学用runnerではない。
const fs = require("node:fs"), os = require("node:os"), path = require("node:path"), cp = require("node:child_process"), assert = require("node:assert/strict");
const root = path.resolve(__dirname, "../../.."), image = "node:24.19.0-bookworm-slim";
function run() {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "befcs-cgroup-")), results = [];
  try {
    cp.execFileSync("docker", ["pull", image], { stdio: "inherit", timeout: 180000 });
    for (const bytes of [134217728, 1073741824]) {
      const directory = path.join(output, String(bytes)); fs.mkdirSync(directory);
      const id = cp.execFileSync("docker", ["create", "--network=none", "--memory=" + bytes, "--memory-swap=" + bytes, "--pids-limit=32", "--mount", "type=bind,src=" + root + ",dst=/repo,readonly", "--mount", "type=bind,src=" + directory + ",dst=/evidence", image, "node", "/repo/tools/research/g5-befcs-operations/worker-fixture.cjs", "oom", "/evidence"], { encoding: "utf8" }).trim();
      try {
        cp.execFileSync("docker", ["start", id], { encoding: "utf8" });
        const exit = cp.execFileSync("docker", ["wait", id], { encoding: "utf8", timeout: 30000 }).trim();
        const inspect = JSON.parse(cp.execFileSync("docker", ["inspect", id], { encoding: "utf8" }))[0];
        assert.equal(inspect.HostConfig.Memory, bytes); assert.equal(inspect.HostConfig.MemorySwap, bytes);
        assert.equal(inspect.HostConfig.NetworkMode, "none"); assert.equal(inspect.State.OOMKilled, true); assert.equal(Number(exit), 137);
        const prefix = JSON.parse(fs.readFileSync(path.join(directory, "OOM_PREFIX.jsonl"), "utf8"));
        assert.equal(prefix.scientificSeedsRead, 0); assert.equal(prefix.solution, null);
        results.push({ capBytes: bytes, swapDisabled: true, oomKilled: true, exitCode: 137, durablePrefixVerified: true, solution: null, imageId: inspect.Image });
      } finally { cp.execFileSync("docker", ["rm", "-f", id], { stdio: "ignore" }); }
    }
    return { evidenceClass: "TECHNICAL-CGROUP-FIXTURE", nodeVersion: "24.19.0", results, scientificSeedsRead: 0, scientificExecutionAuthorized: false };
  } finally { fs.rmSync(output, { recursive: true, force: true }); }
}
if (require.main === module) {
  assert.equal(process.argv.length, 3); const result = run();
  fs.mkdirSync(path.dirname(path.resolve(process.argv[2])), { recursive: true });
  fs.writeFileSync(path.resolve(process.argv[2]), JSON.stringify(result, null, 2) + "\n"); console.log(JSON.stringify(result));
}
module.exports = { run };
