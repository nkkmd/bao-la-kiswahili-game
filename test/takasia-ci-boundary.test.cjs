"use strict";
const test = require("node:test"), assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), os = require("node:os");
const { execFileSync, spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "..");

test("改訂資産の変更と過去の採用記録の変更をそれぞれ拒否する", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-takasia-negative-"));
  const checkout = path.join(temp, "checkout");
  let added = false;
  try {
    execFileSync("git", ["worktree", "add", "--detach", checkout, "50988a4d3a3850ab5f790ee70aff95fad0380b4c"], { cwd: root, stdio: "pipe" }); added = true;
    for (const name of ["check-current-assets.cjs", "run-historical-ci.cjs"]) fs.copyFileSync(path.join(root, "tools/takasia", name), path.join(checkout, "tools/takasia", name));
    const current = () => spawnSync("node", ["tools/takasia/check-current-assets.cjs"], { cwd: checkout, encoding: "utf8" });
    assert.equal(current().status, 0);
    const engine = path.join(checkout, "public/engine.js"), bytes = fs.readFileSync(engine);
    fs.appendFileSync(engine, "\n// injected negative control\n");
    const changed = current();
    assert.notEqual(changed.status, 0); assert.match(changed.stderr, /public\/engine\.jsのtakasia改訂資産/);
    fs.writeFileSync(engine, bytes);
    const record = path.join(checkout, "tools/takasia/ui-validation-20261008.json");
    const recordBytes = fs.readFileSync(record); fs.appendFileSync(record, "\n");
    const forged = current();
    assert.notEqual(forged.status, 0); assert.match(forged.stderr, /工程6の固定検証記録を保持する/);
    fs.writeFileSync(record, recordBytes);
    const manifest = path.join(checkout, "doc/ai-engineering/ai-gen4-release/AI-GEN4-RELEASE-001.json");
    fs.appendFileSync(manifest, "\n");
    const historical = spawnSync("node", ["tools/takasia/run-historical-ci.cjs", "gen3"], { cwd: checkout, encoding: "utf8" });
    assert.notEqual(historical.status, 0);
    assert.match(historical.stderr, /git diff --exit-code/);
  } finally {
    if (added) execFileSync("git", ["worktree", "remove", "--force", checkout], { cwd: root, stdio: "pipe" });
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
