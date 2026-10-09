"use strict";
// 工程6の固定証拠を保持し、v0.6.0の表記・キャッシュ変更だけを厳密に許可する。
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto");
const assert = require("node:assert/strict"), { execFileSync } = require("node:child_process");
const root = path.resolve(__dirname, "../..");
const checkpoint = "50988a4d3a3850ab5f790ee70aff95fad0380b4c";
const recordPath = "tools/takasia/ui-validation-20261008.json";
const presentationUpdates = {
  "public/index.html": [[">v0.5.0</span>", ">v0.6.0</span>"]],
  "public/service-worker.js": [
    ["// Refresh marker: takasiaの表示・日英説明・E30図解を追加 (2026-10-08)。配信前の作業ブランチ。",
      "// Refresh marker: v0.6.0の表記へ更新 (2026-10-09)。takasia対応版のリリース準備。"],
    ['const CACHE = "bao-la-kiswahili-v57";', 'const CACHE = "bao-la-kiswahili-v58";'],
  ],
};
const sha256 = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
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
  // 固定コミットの原文から、明示した置換だけで期待byteを計算する。
  // それ以外のHTML・Service Worker変更も、エンジン等の変更も拒否する。
  for (const [file, changes] of Object.entries(presentationUpdates)) {
    const original = execFileSync("git", ["show", `${checkpoint}:${file}`], { cwd: root });
    if (assets[file]) assert.equal(sha256(original), assets[file], file + "の工程6の固定資産");
    let expected = original.toString("utf8");
    for (const [before, after] of changes) {
      assert.equal(expected.split(before).length - 1, 1, file + "の一意な表記変更");
      expected = expected.replace(before, after);
    }
    assert.deepEqual(fs.readFileSync(path.join(root, file)), Buffer.from(expected), file + "のv0.6.0表記・キャッシュ変更");
    assets[file] = sha256(expected);
  }
  for (const [file, hash] of Object.entries(assets)) assert.equal(
    sha256(fs.readFileSync(path.join(root, file))), hash, file + "のtakasia改訂資産");
  return { passed: true, checkpoint, appVersion: "v0.6.0", cache: "bao-la-kiswahili-v58",
    ruleRevision: record.ruleRevision, aiRevision: record.aiRevision, assets: Object.keys(assets).length };
}
module.exports = { verify };
if (require.main === module) console.log(JSON.stringify(verify()));
