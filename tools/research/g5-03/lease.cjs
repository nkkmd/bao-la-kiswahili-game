"use strict";
const fs = require("node:fs"), path = require("node:path"), assert = require("node:assert/strict");
const R = require("./run.cjs");
const { execFileSync } = require("node:child_process");
const BRANCH = "research/g5-03-bounded-terminal-supply";
const LEASE_PATH = "doc/research-generation-5/g5-03/executions/LEASE.json";
function leaseRecord(env, binding, trigger) {
  assert.equal(env.GITHUB_ACTIONS, "true"); assert.equal(env.GITHUB_REF_NAME, BRANCH);
  assert.equal(String(env.GITHUB_RUN_ATTEMPT), "1", "Attempt >1 cannot consume fresh seeds");
  assert.equal(trigger.binding, binding.digest); assert.equal(trigger.stageId, binding.spec.stageId);
  return { schemaVersion: 1, studyId: "BTCS-STUDY1", stageId: binding.spec.stageId, binding: binding.digest,
    seedBlock: binding.spec.seedBlock, runId: Number(env.GITHUB_RUN_ID), runAttempt: 1,
    triggerCommit: env.GITHUB_SHA, frozenSourceCommit: trigger.frozenSourceCommit,
    acquiredBeforeFreshSeedRead: true, status: "CONSUMED-BLOCK / NO-RERUN" };
}
async function acquire(output) {
  const b = R.binding(), trigger = JSON.parse(fs.readFileSync("doc/research-generation-5/g5-03/executions/TRIGGER.json"));
  const lease = leaseRecord(process.env, b, trigger);
  assert.equal(process.env.GITHUB_REPOSITORY, "nkkmd/bao-la-kiswahili-game");
  assert.match(trigger.frozenSourceCommit, /^[0-9a-f]{40}$/);
  execFileSync("git", ["merge-base", "--is-ancestor", trigger.frozenSourceCommit, process.env.GITHUB_SHA]);
  const base = `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/contents/${LEASE_PATH}`;
  const headers = { Authorization: `Bearer ${process.env.GH_TOKEN}`, Accept: "application/vnd.github+json" };
  const existing = await fetch(base + `?ref=${encodeURIComponent(BRANCH)}`, { headers });
  if (existing.status !== 404) throw Error(`Lease is not absent (HTTP ${existing.status}); refusing consume-once execution`);
  const response = await fetch(base, { method: "PUT", headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ branch: BRANCH, message: "research(g5-03): acquire durable supply seed lease",
      content: Buffer.from(JSON.stringify(lease, null, 2) + "\n").toString("base64") }) });
  if (!response.ok) throw Error(`Lease acquisition failed (HTTP ${response.status}); no seed access`);
  const record = await response.json(); lease.leaseCommit = record.commit.sha;
  fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, JSON.stringify(lease, null, 2) + "\n");
  console.log(JSON.stringify({ leaseCommit: lease.leaseCommit, runId: lease.runId, acquiredBeforeFreshSeedRead: true }));
}
if (require.main === module) acquire(path.resolve(process.argv[2])).catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { leaseRecord };
