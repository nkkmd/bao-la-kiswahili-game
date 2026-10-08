"use strict";
// 現行配信から隔離したworktreeで、旧版のassertを変更せず再実行する。
const fs = require("node:fs"), path = require("node:path"), os = require("node:os");
const assert = require("node:assert/strict"), { execFileSync, spawnSync } = require("node:child_process");
const root = path.resolve(__dirname, "../..");
const source = "8c87ed44c9b08f75456766f0a9bd9f76d06209d4";
const profiles = {
  gen3: {
    preserved: ["doc/ai-engineering/public-ai-improvement-program-5/releases/AI-GEN3-RELEASE-001.json", "doc/ai-engineering/ai-gen4-release/AI-GEN4-RELEASE-001.json"],
    commands: [["node", "test/ai-generation-release.test.js"]],
  },
  c015: {
    preserved: ["tools/engineering/browser/pbai-p9", "artifacts/pbai-p11/device-package/expert-preview.zip", "public/logic-evaluator.js", "public/ai-config.js", "public/ai-weights.js"],
    commands: [["node", "--test", "test/pbai-c015-expert-production.test.cjs", "test/pbai-c015-integration.test.cjs"]],
  },
  p4: {
    preserved: ["artifacts/pbai-p4", "doc/ai-engineering/public-ai-improvement-program-4/BASELINE.json", "doc/ai-engineering/public-ai-improvement-program-4/PROTOCOL.md", "doc/ai-engineering/public-ai-improvement-program-4/AUTHORIZATION_REVIEW.md", "tools/engineering/audit-pbai-p4-artifacts.py", "tools/engineering/verify-pbai-p4-stage-independent.js", "tools/engineering/verify-pbai-p4-metrics-independent.py", "tools/engineering/lib/pbai-p4-common.js"],
    commands: [["python3", "tools/engineering/audit-pbai-p4-artifacts.py"], ...["development", "validation", "holdout"].flatMap(stage => [
      ["node", "tools/engineering/verify-pbai-p4-stage-independent.js", stage, "--check"],
      ["python3", "tools/engineering/verify-pbai-p4-metrics-independent.py", stage, "--check"],
    ])],
    executionBundle: "artifacts/pbai-p4/EXECUTION_BUNDLE.json",
  },
  p5: {
    preserved: ["artifacts/pbai-p5", "doc/ai-engineering/public-ai-improvement-program-5/PROTOCOL.md", "doc/ai-engineering/public-ai-improvement-program-5/PREPARATION_LOCK.json", "doc/ai-engineering/public-ai-improvement-program-5/SOURCE_LOCK.json", "tools/engineering/audit-pbai-p5-results.py"],
    commands: [["python3", "tools/engineering/audit-pbai-p5-results.py"]],
  },
  lgttci: {
    preserved: ["doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg", "doc/local-game-tree-geometry-transfer-compatibility-instrument/authorizations/STAGE_0_AUTHORIZATION.json", "tools/experiments/run-lgttci-stage0-technical.js", "tools/experiments/lib/lgttci-compatibility-production.js", "tools/experiments/lib/lgttci-compatibility-independent.js", "tools/experiments/lib/lgtgmiv-stage1-production.js", "tools/experiments/lib/lgtgmiv-stage1-independent.js", "tools/experiments/lib/crclgr-production.js", "tools/experiments/lib/crclgr-independent.js", "tools/experiments/lib/silgm-production.js", "tools/experiments/lib/silgm-independent.js", "tools/experiments/lib/search-reliability-decision-robustness.js"],
    commands: [["node", "tools/experiments/run-lgttci-stage0-technical.js", "artifacts/local/lgttci-historical-result.json"]],
  },
};
function run(profile) {
  assert.ok(Object.hasOwn(profiles, profile), "既知の履歴検証profileが必要");
  const { preserved, commands, executionBundle } = profiles[profile];
  execFileSync("git", ["diff", "--exit-code", source, "--", ...preserved], { cwd: root, stdio: "pipe" });
  const out = path.join(root, "artifacts/local/takasia-history", profile);
  fs.mkdirSync(out, { recursive: true });
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "bao-takasia-history-"));
  const checkout = path.join(temp, "checkout");
  const report = { profile, historicalSourceCommit: source, currentSourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(), historicalEvidenceChanged: false, scientificMeasurementRepeated: false, passed: false, commands: [] };
  const save = () => fs.writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2) + "\n");
  let added = false;
  try {
    execFileSync("git", ["worktree", "add", "--detach", checkout, source], { cwd: root, stdio: "pipe" }); added = true;
    if (executionBundle) {
      // P4実行当時の設定・UIも保持する。後のmainの設定で過去の証拠を検査しない。
      const bundle = JSON.parse(fs.readFileSync(path.join(root, executionBundle)));
      const actual = require("node:crypto").createHash("sha256").update(fs.readFileSync(path.join(root, bundle.path))).digest("hex");
      assert.equal(actual, bundle.sha256, "P4実行バンドルの固定hash");
      execFileSync("git", ["bundle", "verify", path.join(root, bundle.path)], { cwd: root, stdio: "pipe" });
      execFileSync("git", ["fetch", path.join(root, bundle.path), "HEAD"], { cwd: checkout, stdio: "pipe" });
      assert.equal(execFileSync("git", ["rev-parse", "FETCH_HEAD"], { cwd: checkout, encoding: "utf8" }).trim(), bundle.head);
      const baseline = JSON.parse(fs.readFileSync(path.join(root, "doc/ai-engineering/public-ai-improvement-program-4/BASELINE.json")));
      report.runtimeAssetsCommit = bundle.head;
      report.runtimeAssetPaths = Object.keys(baseline.sources);
      for (const file of report.runtimeAssetPaths) {
        assert.match(file, /^public\/[a-z0-9.-]+$/i);
        fs.writeFileSync(path.join(checkout, file), execFileSync("git", ["show", `${bundle.head}:${file}`], { cwd: checkout }));
      }
      save();
    }
    for (let i = 0; i < commands.length; i++) {
      const [binary, ...args] = commands[i];
      const result = spawnSync(binary, args, { cwd: checkout, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
      fs.writeFileSync(path.join(out, `command-${i}.log`), (result.stdout || "") + (result.stderr || ""));
      report.commands.push({ command: commands[i], exitCode: result.status, error: result.error?.message || null }); save();
      assert.equal(result.status, 0, `${profile}: ${commands[i].join(" ")}。詳細: ${out}/command-${i}.log`);
      console.log(`${profile}: ${i + 1}/${commands.length} PASS`);
    }
    if (profile === "lgttci") fs.copyFileSync(path.join(checkout, "artifacts/local/lgttci-historical-result.json"), path.join(out, "technical-result.json"));
    report.passed = true;
  } catch (error) { report.failure = String(error.stack || error); throw error; }
  finally {
    save();
    if (added) execFileSync("git", ["worktree", "remove", "--force", checkout], { cwd: root, stdio: "pipe" });
    fs.rmSync(temp, { recursive: true, force: true });
  }
  console.log(JSON.stringify(report));
  return report;
}
module.exports = { source, profiles, run };
if (require.main === module) run(process.argv[2]);
