"use strict";
// 工程6で確認した配信候補のbyteを、過去のreleaseとは別に照合する。
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const assert = require("node:assert/strict"), { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, "../..");
const checkpoint = "50988a4d3a3850ab5f790ee70aff95fad0380b4c";
const recordPath = "tools/takasia/ui-validation-20261008.json";
function verify() {
  const bytes = fs.readFileSync(path.join(root, recordPath));
  assert.deepEqual(bytes, execFileSync("git", ["show", `${checkpoint}:${recordPath}`], { cwd: root, maxBuffer: 8 * 1024 * 1024 }), "工程6の固定検証記録を保持する");
  const record = JSON.parse(bytes);
  assert.equal(record.status, "PASS");
  assert.equal(record.ruleRevision, "BAO-RULES-V0.2.0-TAKASIA-001");
  assert.equal(record.aiRevision, "AI-GEN4-TAKASIA-001");
  const assets = {};
  for (const sources of [record.sourceSha256, record.aiBudget.report.sources]) {
    for (const [file, hash] of Object.entries(sources)) if (file.startsWith("public/")) {
      if (assets[file]) assert.equal(assets[file], hash, file + "の記録間照合");
      assets[file] = hash;
    }
  }
  for (const required of ["public/engine.js", "public/ai.js", "public/ai-candidate.js", "public/ai-release.js", "public/ai-worker.js", "public/main.js", "public/service-worker.js"]) assert.ok(assets[required], required);
  for (const [file, hash] of Object.entries(assets)) assert.equal(
    crypto.createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex"), hash, file + "のtakasia改訂資産");
  return { passed: true, checkpoint, ruleRevision: record.ruleRevision, aiRevision: record.aiRevision, assets: Object.keys(assets).length };
}
module.exports = { verify };
if (require.main === module) console.log(JSON.stringify(verify()));
