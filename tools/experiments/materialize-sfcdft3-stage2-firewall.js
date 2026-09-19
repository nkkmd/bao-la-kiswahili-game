#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");

const REPO = process.env.GITHUB_REPOSITORY || "nkkmd/bao-la-kiswahili-game";
const TOKEN = process.env.GITHUB_TOKEN || "";
const RUN_ID = 35427427920;
const EXECUTION_HEAD = "dec9a91d5860b9f3d927d632a7165bcbf99f5f63";
const STUDY_ID = "SFCDFT-STUDY3";
const STAGE_ID = "SFCDFT3-S2-FORMAL-HELDOUT-2026-09-19-v1";
const OUTPUT = path.resolve(process.argv[2] || "artifacts/sfcdft3-stage2-firewall");
const API = "https://api.github.com";
const PRIMARY_START = 40521001;
const PRIMARY_END = 40521768;
const PRIMARY_COUNT = PRIMARY_END - PRIMARY_START + 1;

function need(value, message) { if (!value) throw new Error(message); }
function sha256(text) { return crypto.createHash("sha256").update(String(text), "utf8").digest("hex"); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
async function apiFetch(url, binary = false) {
  need(TOKEN, "GITHUB_TOKEN is required");
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "bao-sfcdft3-stage2-firewall-materializer"
    },
    redirect: "follow"
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status} ${url}: ${body.slice(0, 500)}`);
  }
  return binary ? Buffer.from(await response.arrayBuffer()) : response.json();
}
async function listArtifacts() {
  const artifacts = [];
  for (let page = 1; ; page += 1) {
    const payload = await apiFetch(`${API}/repos/${REPO}/actions/runs/${RUN_ID}/artifacts?per_page=100&page=${page}`);
    need(Array.isArray(payload.artifacts), "artifact list missing");
    artifacts.push(...payload.artifacts);
    if (payload.artifacts.length < 100) break;
  }
  return artifacts;
}
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      out[index] = await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length || 1) }, () => worker()));
  return out;
}
function readJsonFromZip(zipPath, preferredBasename = null) {
  const listing = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8", maxBuffer: 1024 * 1024 });
  const entries = listing.split(/\r?\n/).filter(Boolean);
  const jsonEntries = entries.filter((entry) => entry.endsWith(".json"));
  need(jsonEntries.length > 0, `no JSON entry in ${zipPath}`);
  const target = preferredBasename
    ? jsonEntries.find((entry) => path.posix.basename(entry) === preferredBasename)
    : jsonEntries[0];
  need(target, `preferred JSON ${preferredBasename} absent in ${zipPath}`);
  return JSON.parse(execFileSync("unzip", ["-p", zipPath, target], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }));
}
async function downloadAndReadJson(artifact, tmpDir, preferredBasename = null) {
  const zipPath = path.join(tmpDir, `${artifact.id}.zip`);
  const bytes = await apiFetch(`${API}/repos/${REPO}/actions/artifacts/${artifact.id}/zip`, true);
  fs.writeFileSync(zipPath, bytes);
  try { return readJsonFromZip(zipPath, preferredBasename); }
  finally { fs.rmSync(zipPath, { force: true }); }
}
function extractSeed(name, prefix) {
  const match = name.match(new RegExp(`^${prefix}-(\\d+)$`));
  return match ? Number(match[1]) : null;
}
function sortedUnique(values) { return [...new Set(values)].sort(); }
function validHash(value) { return typeof value === "string" && /^[0-9a-f]{64}$/.test(value); }

async function main() {
  fs.mkdirSync(OUTPUT, { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sfcdft3-s2-firewall-"));
  try {
    const artifacts = await listArtifacts();
    const sourceArtifacts = artifacts
      .filter((a) => /^sfcdft3-s2-source-\d+$/.test(a.name))
      .sort((a, b) => extractSeed(a.name, "sfcdft3-s2-source") - extractSeed(b.name, "sfcdft3-s2-source"));
    const startArtifacts = artifacts.filter((a) => /^sfcdft3-s2-primary-start-\d+$/.test(a.name));
    const failureArtifacts = artifacts.filter((a) => /^sfcdft3-s2-(primary|reserve)-failure-\d+$/.test(a.name));
    const reserveStartArtifacts = artifacts.filter((a) => /^sfcdft3-s2-reserve-start-\d+$/.test(a.name));
    const finalClassificationArtifacts = artifacts.filter((a) => a.name === "sfcdft3-s2-final-classification");

    need(sourceArtifacts.length === PRIMARY_COUNT, `expected ${PRIMARY_COUNT} source artifacts, got ${sourceArtifacts.length}`);
    need(startArtifacts.length === PRIMARY_COUNT, `expected ${PRIMARY_COUNT} primary START artifacts, got ${startArtifacts.length}`);
    need(failureArtifacts.length === 0, `expected zero failure artifacts, got ${failureArtifacts.length}`);
    need(reserveStartArtifacts.length === 0, `expected zero reserve START artifacts, got ${reserveStartArtifacts.length}`);
    need(finalClassificationArtifacts.length === 1, `expected one final classification artifact, got ${finalClassificationArtifacts.length}`);

    const classification = await downloadAndReadJson(finalClassificationArtifacts[0], tmpDir, "final-classification.json");
    need(classification.studyId === STUDY_ID && classification.stageId === STAGE_ID, "classification identity mismatch");
    need(classification.mode === "final", "classification mode mismatch");
    need(classification.sourceCount === PRIMARY_COUNT && classification.primaryStartCount === PRIMARY_COUNT, "classification source/START mismatch");
    need(classification.reserveStartCount === 0 && classification.retryCount === 0 && classification.reserveCount === 0, "unexpected reserve/retry use");
    need(classification.deterministicFailureCount === 0 && classification.reserveFailureCount === 0, "unexpected deterministic/reserve failure");
    need(classification.unresolvedCount === 0 && classification.fatal === false, "classification final state mismatch");

    const records = await mapLimit(sourceArtifacts, 8, async (artifact) => {
      const source = await downloadAndReadJson(artifact, tmpDir, "source.json");
      const seed = extractSeed(artifact.name, "sfcdft3-s2-source");
      need(seed >= PRIMARY_START && seed <= PRIMARY_END, `source seed outside frozen primary namespace ${seed}`);
      need(source.studyId === STUDY_ID && source.stageId === STAGE_ID, `source identity mismatch seed=${seed}`);
      need(source.evidenceClass === "FRESH-FORMAL-HELDOUT-SOURCE", `unexpected evidence class seed=${seed}`);
      need(source.slotSeed === seed && source.effectiveSeed === seed && source.seedRole === "PRIMARY", `seed identity mismatch seed=${seed}`);
      need(source.endpointValuesRetained === false, `endpoint retention must be false seed=${seed}`);
      need(validHash(source.sourceTrajectorySha256), `trajectory hash malformed seed=${seed}`);
      need(["CANDIDATE-PAIR-COMPLETE", "NO-CANDIDATE-ROOT-SHORTAGE", "NO-CANDIDATE-ENGINE-GUARD-CENSORING"].includes(source.candidateStatus), `unexpected candidate status seed=${seed}`);
      if (source.candidateStatus === "CANDIDATE-PAIR-COMPLETE") {
        need(source.pairComplete === true, `candidate pairComplete mismatch seed=${seed}`);
        need(source.openingPrefixAvailable === true && source.openingPrefixLength === 16 && validHash(source.openingPrefixSha256), `candidate opening prefix mismatch seed=${seed}`);
        need(source.namua && source.mtaji, `candidate roots absent seed=${seed}`);
      }
      if (source.openingPrefixSha256 !== null && source.openingPrefixSha256 !== undefined) {
        need(validHash(source.openingPrefixSha256), `opening prefix hash malformed seed=${seed}`);
      }
      const roots = [];
      for (const [label, root] of [["namua", source.namua], ["mtaji", source.mtaji]]) {
        if (!root) continue;
        need(validHash(root.rawStateSha256), `${label} root hash malformed seed=${seed}`);
        roots.push({ phase: label, sha256: root.rawStateSha256, ply: root.ply });
      }
      return {
        slotSeed: source.slotSeed,
        effectiveSeed: source.effectiveSeed,
        candidateStatus: source.candidateStatus,
        pairComplete: Boolean(source.pairComplete),
        stopReason: source.stopReason,
        policyId: source.policyId,
        rootFamilyId: source.rootFamilyId,
        domainId: source.domainId,
        moveCount: source.moveCount,
        sourceTrajectorySha256: source.sourceTrajectorySha256,
        openingPrefixSha256: source.openingPrefixSha256 || null,
        roots,
        artifactId: artifact.id,
        artifactDigest: artifact.digest || null
      };
    });

    records.sort((a, b) => a.slotSeed - b.slotSeed);
    need(records.length === PRIMARY_COUNT, "record count mismatch");
    need(new Set(records.map((r) => r.slotSeed)).size === PRIMARY_COUNT, "duplicate source slot");
    for (let i = 0; i < PRIMARY_COUNT; i++) {
      need(records[i].slotSeed === PRIMARY_START + i, `missing or reordered primary seed at index=${i}`);
    }

    const trajectories = sortedUnique(records.map((r) => r.sourceTrajectorySha256));
    const openingPrefixes = sortedUnique(records.map((r) => r.openingPrefixSha256).filter(Boolean));
    const rawRoots = sortedUnique(records.flatMap((r) => r.roots.map((root) => root.sha256)));
    const statusCounts = {
      candidatePairComplete: records.filter((r) => r.candidateStatus === "CANDIDATE-PAIR-COMPLETE").length,
      noCandidateRootShortage: records.filter((r) => r.candidateStatus === "NO-CANDIDATE-ROOT-SHORTAGE").length,
      noCandidateEngineGuardCensoring: records.filter((r) => r.candidateStatus === "NO-CANDIDATE-ENGINE-GUARD-CENSORING").length
    };
    need(Object.values(statusCounts).reduce((a, b) => a + b, 0) === PRIMARY_COUNT, "status accounting mismatch");

    const forbiddenSeedNamespaces = ["40521001..40521768", "41521001..41521768"];
    const identityCore = {
      forbiddenSeedNamespaces,
      sourceTrajectorySha256: trajectories,
      openingPrefixSha256: openingPrefixes,
      rawRootSha256: rawRoots
    };
    const identityCoreSha256 = sha256(stable(identityCore));
    const manifest = {
      schemaVersion: 1,
      firewallId: "G4-02-SFCDFT-STUDY3-STAGE2-IDENTITY-FIREWALL",
      sourceStudyId: STUDY_ID,
      sourceStageId: STAGE_ID,
      sourceRunId: RUN_ID,
      sourceExecutionHead: EXECUTION_HEAD,
      sourceRunFormalClosure: "TECHNICAL-INVALID / NO-SCIENTIFIC-DECISION / NO-RERUN",
      evidenceUse: "IDENTITY-ONLY-FIREWALL",
      scientificSeedReplay: false,
      scientificEndpointLoaded: false,
      scientificMeasurementLoaded: false,
      scientificAggregateLoaded: false,
      sourceArtifactCounts: {
        primaryStart: startArtifacts.length,
        sealedSource: records.length,
        deterministicFailure: 0,
        pairedReserveStart: 0,
        retry: 0,
        unresolved: 0
      },
      sourceStatusCounts: statusCounts,
      forbiddenSeedNamespaces,
      identityCounts: {
        sourceRecords: records.length,
        uniqueSourceTrajectorySha256: trajectories.length,
        uniqueOpeningPrefixSha256: openingPrefixes.length,
        uniqueRawRootSha256: rawRoots.length
      },
      identityCoreSha256,
      sourceFinalClassification: {
        artifactId: finalClassificationArtifacts[0].id,
        artifactDigest: finalClassificationArtifacts[0].digest || null,
        fatal: false,
        ready: true
      },
      materialization: {
        workflowRunId: process.env.GITHUB_RUN_ID || null,
        workflowRunAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
        headSha: process.env.GITHUB_SHA || null,
        artifactInputOnly: true
      },
      limitations: {
        sourceRunClosedTechnicalInvalid: true,
        sourceBundleWasNotCompleted: true,
        formalMeasurementWasNotStarted: true,
        scientificDecisionWasNotGenerated: true,
        selectedPairMembershipNotImported: true,
        endpointValuesNotImported: true,
        rootStatePayloadNotRetained: true,
        unreadStage2ReserveProtectedByNamespaceExclusion: true
      }
    };

    fs.writeFileSync(path.join(OUTPUT, "MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`);
    fs.writeFileSync(path.join(OUTPUT, "SOURCE_TRAJECTORY_SHA256.txt"), trajectories.length ? `${trajectories.join("\n")}\n` : "");
    fs.writeFileSync(path.join(OUTPUT, "OPENING_PREFIX_SHA256.txt"), openingPrefixes.length ? `${openingPrefixes.join("\n")}\n` : "");
    fs.writeFileSync(path.join(OUTPUT, "RAW_ROOT_SHA256.txt"), rawRoots.length ? `${rawRoots.join("\n")}\n` : "");
    fs.writeFileSync(path.join(OUTPUT, "SOURCE_RECORD_INDEX.jsonl"), `${records.map((r) => JSON.stringify(r)).join("\n")}\n`);
    process.stdout.write(`${JSON.stringify({
      event: "SFCDFT-STUDY3-STAGE2-FIREWALL-MATERIALIZED",
      sourceRecords: records.length,
      statusCounts,
      trajectoryCount: trajectories.length,
      openingPrefixCount: openingPrefixes.length,
      rawRootCount: rawRoots.length,
      identityCoreSha256
    })}\n`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
