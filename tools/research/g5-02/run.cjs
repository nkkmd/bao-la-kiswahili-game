"use strict";
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto"), zlib = require("node:zlib");
const { execFileSync } = require("node:child_process"), assert = require("node:assert/strict");
const C = require("./core.cjs"), M = require("../g5-01/measurement.cjs");
const root = path.resolve(__dirname, "../../.."), docs = path.join(root, "doc/research-generation-5/g5-02");
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const shaBytes = value => crypto.createHash("sha256").update(value).digest("hex");
function atomic(file, value) {
  const fd = fs.openSync(file + ".tmp", "w"); fs.writeFileSync(fd, JSON.stringify(value, null, 2) + "\n");
  fs.fsyncSync(fd); fs.closeSync(fd); fs.renameSync(file + ".tmp", file);
}
function binding() {
  const spec = read(path.join(docs, "SPEC.json")), auth = read(path.join(docs, "AUTHORIZATION.json"));
  const manifest = read(path.join(docs, "SOURCE_MANIFEST.json"));
  assert.equal(spec.stageId, "RECSF-S1-SUPPLY-2026-10-12-v1");
  assert.equal(auth.stageId, spec.stageId); assert.equal(auth.decision, "AUTHORIZED-SUPPLY-ONCE");
  assert.equal(auth.specSha256, shaBytes(fs.readFileSync(path.join(docs, "SPEC.json"))));
  assert.equal(auth.manifestSha256, shaBytes(fs.readFileSync(path.join(docs, "SOURCE_MANIFEST.json"))));
  assert.equal(spec.formalInference, false);
  for (const [p, expected] of Object.entries(manifest.files)) assert.equal(shaBytes(fs.readFileSync(path.join(root, p))), expected, `Source binding: ${p}`);
  require("../g5-01/transition/run.cjs").binding(); require("../g5-01/run.cjs").checkBinding();
  return { spec, digest: M.digest({ spec, auth, manifest }) };
}
function checkLease(lease, b, environment = process.env) {
  assert.equal(environment.GITHUB_ACTIONS, "true", "Fresh supply execution is Actions-only");
  assert.equal(String(lease.runId), environment.GITHUB_RUN_ID, "Lease run differs");
  assert.equal(String(lease.runAttempt), environment.GITHUB_RUN_ATTEMPT, "Lease attempt differs");
  assert.equal(lease.triggerCommit, environment.GITHUB_SHA, "Lease trigger differs");
  assert.equal(lease.binding, b.digest, "Lease binding differs"); assert.equal(lease.stageId, b.spec.stageId);
  assert.equal(lease.acquiredBeforeFreshSeedRead, true);
  assert.deepEqual(lease.seedBlock, b.spec.seedBlock);
  assert.equal(lease.status, "CONSUMED-BLOCK / NO-RERUN");
}
function run(directory, leaseFile) {
  const b = binding(), lease = read(leaseFile); checkLease(lease, b);
  if (fs.existsSync(path.join(directory, "START.json"))) throw Error("Existing supply start: no rerun");
  fs.mkdirSync(directory, { recursive: true });
  const started = performance.now();
  const technical = C.technicalFirewall(), prior = C.priorFirewall(), excluded = new Set([...technical, ...prior]);
  const allExcluded = new Set(excluded);
  const evidence = { studyId: "RECSF-STUDY1", stageId: b.spec.stageId, binding: b.digest,
    technicalFirewall: [...technical].sort(), priorReadFirewall: [...prior].sort(), sources: [], selectedCandidates: [], domains: [],
    supplyReadIdentities: [], groups: [], scientificSeedsRead: 0, formalInference: false };
  const meta = { triggerCommit: process.env.GITHUB_SHA,
    sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
    runId: process.env.GITHUB_RUN_ID, runAttempt: process.env.GITHUB_RUN_ATTEMPT, node: process.version };
  atomic(path.join(directory, "START.json"), { ...meta, lease, binding: b.digest, startedAt: new Date().toISOString() });
  const journal = fs.openSync(path.join(directory, "SEED_READS.jsonl"), "wx");
  function limits() {
    if (performance.now() - started > b.spec.maxTotalMs) throw Error("GLOBAL-TIME-LIMIT");
    if (process.resourceUsage().maxRSS * 1024 > b.spec.maxRssBytes) throw Error("GLOBAL-RSS-LIMIT");
  }
  function save() {
    const bytes = Buffer.from(JSON.stringify(evidence));
    if (bytes.length > b.spec.maxEvidenceBytes) throw Error("EVIDENCE-BYTE-LIMIT");
    fs.writeFileSync(path.join(directory, "EVIDENCE.json.gz.tmp"), zlib.gzipSync(bytes));
    fs.renameSync(path.join(directory, "EVIDENCE.json.gz.tmp"), path.join(directory, "EVIDENCE.json.gz"));
    atomic(path.join(directory, "CHECKPOINT.json"), { ...meta, binding: b.digest, scientificSeedsRead: evidence.scientificSeedsRead,
      sourcesSaved: evidence.sources.length, domainsSaved: evidence.domains.length,
      evidenceSha256: shaBytes(bytes), complete: false, resumeAuthorized: false });
  }
  let disposition = "STAGE1-SUPPLY-COMPLETE", failure = null;
  try {
    for (let n = 0; n < b.spec.seedBlock.count; n++) {
      limits(); const seed = b.spec.seedBlock.start + n;
      fs.writeSync(journal, JSON.stringify({ index: n, seed, event: "CONSUME-BEFORE-SOURCE", runId: meta.runId }) + "\n");
      fs.fsyncSync(journal); evidence.scientificSeedsRead++;
      const source = C.generateSource(seed, b.spec.selection, allExcluded, limits);
      evidence.sources.push(source);
      if (source.candidate) {
        allExcluded.add(source.candidate.raw);
        if (evidence.selectedCandidates.length < b.spec.maxCandidates) {
          evidence.selectedCandidates.push({ sourceIndex: n, ...source.candidate });
        }
      }
      save(); console.log(`source ${n + 1}/${b.spec.seedBlock.count}: ${source.stop}; ply ${source.trace.length}`);
    }
    // 全候補の選定を先に確定する。解析結果で候補を置換しない。
    atomic(path.join(directory, "CANDIDATES_FROZEN.json"), { binding: b.digest,
      candidates: evidence.selectedCandidates, digest: M.digest(evidence.selectedCandidates) });
    for (let n = 0; n < evidence.selectedCandidates.length; n++) {
      limits(); const candidate = evidence.selectedCandidates[n];
      atomic(path.join(directory, "DOMAIN_IN_PROGRESS.json"), { index: n, raw: candidate.raw, runId: meta.runId, rerunAuthorized: false });
      const domain = C.buildClosure(candidate.state, b.spec.closure, limits, excluded);
      evidence.domains.push(domain); save();
      console.log(`domain ${n + 1}/${evidence.selectedCandidates.length}: ${domain.status}; ${domain.states.length} states; ${domain.edges.length} edges`);
    }
    evidence.groups = C.domainGroups(evidence.domains);
  } catch (error) {
    disposition = "STAGE1-SUPPLY-INCOMPLETE";
    failure = { message: error.message, sourcesSaved: evidence.sources.length, domainsSaved: evidence.domains.length };
  } finally { fs.closeSync(journal); }
  // 読取済みの全source状態・試行閉包を後続正式検証から隔離する。
  const identities = new Set(evidence.technicalFirewall);
  for (const s of evidence.sources) { identities.add(M.rawKey(s.finalState)); for (const t of s.trace) { identities.add(t.rawBefore); identities.add(t.rawAfter); } }
  for (const d of evidence.domains) {
    for (const s of d.states) identities.add(s.id);
    if (d.stopWitness?.raw) identities.add(d.stopWitness.raw);
  }
  evidence.supplyReadIdentities = [...identities].sort();
  try { limits(); save(); limits(); } catch (error) { disposition = "STAGE1-SUPPLY-INCOMPLETE"; failure = { message: error.message }; }
  const evidencePath = path.join(directory, "EVIDENCE.json.gz");
  const result = { disposition, failure, studyId: evidence.studyId, stageId: evidence.stageId, binding: b.digest,
    seedBlock: b.spec.seedBlock, scientificSeedsRead: evidence.scientificSeedsRead,
    sourceCount: evidence.sources.length, sourceStops: {}, candidateCount: evidence.selectedCandidates.length,
    completeDomains: evidence.domains.filter(d => d.complete).length, domainStatuses: evidence.domains.map(d => ({
      status: d.status, states: d.states.length, edges: d.edges.length, elapsedMs: d.elapsedMs, complete: d.complete,
      counts: d.complete ? d.solution.counts : null })), domainGroups: evidence.groups,
    evidenceGzipSha256: fs.existsSync(evidencePath) ? shaBytes(fs.readFileSync(evidencePath)) : null,
    supplyIdentityCount: identities.size, formalInference: false, publicAiChanged: false,
    execution: { ...meta, elapsedMs: Math.round(performance.now() - started), peakRssBytes: process.resourceUsage().maxRSS * 1024 } };
  for (const s of evidence.sources) result.sourceStops[s.stop] = (result.sourceStops[s.stop] ?? 0) + 1;
  atomic(path.join(directory, "RESULT.json"), result);
  console.log(JSON.stringify(result)); if (disposition !== "STAGE1-SUPPLY-COMPLETE") process.exitCode = 1;
  return result;
}
if (require.main === module) {
  if (!process.argv[2] || !process.argv[3]) throw Error("Usage: node run.cjs OUTPUT_DIRECTORY LEASE_JSON");
  run(path.resolve(process.argv[2]), path.resolve(process.argv[3]));
}
module.exports = { binding, checkLease, run, shaBytes };
