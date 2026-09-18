#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");

const REPO = process.env.GITHUB_REPOSITORY || "nkkmd/bao-la-kiswahili-game";
const TOKEN = process.env.GITHUB_TOKEN || "";
const RUN_ID = 35345143248;
const EXECUTION_HEAD = "8c84f2cda1a62f812f030ef319341683a4d77e54";
const STUDY_ID = "SFCDFT-STUDY2";
const STAGE_ID = "SFCDFT2-S1-COMPATIBILITY-2026-09-18-v1";
const OUTPUT = path.resolve(process.argv[2] || "artifacts/sfcdft-study2-firewall");
const API = "https://api.github.com";

function need(value, message) {
  if (!value) throw new Error(message);
}

function sha256(text) {
  return crypto.createHash("sha256").update(String(text), "utf8").digest("hex");
}

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
      "User-Agent": "bao-sfcdft-study2-firewall-materializer"
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
      const index = cursor;
      cursor += 1;
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
  const text = execFileSync("unzip", ["-p", zipPath, target], {
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024
  });
  return JSON.parse(text);
}

async function downloadAndReadJson(artifact, tmpDir, preferredBasename = null) {
  const zipPath = path.join(tmpDir, `${artifact.id}.zip`);
  const bytes = await apiFetch(`${API}/repos/${REPO}/actions/artifacts/${artifact.id}/zip`, true);
  fs.writeFileSync(zipPath, bytes);
  try {
    return readJsonFromZip(zipPath, preferredBasename);
  } finally {
    fs.rmSync(zipPath, { force: true });
  }
}

function extractSlot(name, prefix) {
  const match = name.match(new RegExp(`^${prefix}-(\\d+)$`));
  return match ? Number(match[1]) : null;
}

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

async function main() {
  fs.mkdirSync(OUTPUT, { recursive: true });
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sfcdft2-firewall-"));

  try {
    const artifacts = await listArtifacts();
    const sourceArtifacts = artifacts
      .filter((artifact) => /^sfcdft2-s1-source-\d+$/.test(artifact.name))
      .sort((a, b) => extractSlot(a.name, "sfcdft2-s1-source") - extractSlot(b.name, "sfcdft2-s1-source"));
    const startArtifacts = artifacts.filter((artifact) => /^sfcdft2-s1-primary-start-\d+$/.test(artifact.name));
    const failureArtifacts = artifacts
      .filter((artifact) => /^sfcdft2-s1-primary-failure-\d+$/.test(artifact.name))
      .sort((a, b) => extractSlot(a.name, "sfcdft2-s1-primary-failure") - extractSlot(b.name, "sfcdft2-s1-primary-failure"));
    const classificationArtifacts = artifacts.filter((artifact) => artifact.name === "sfcdft2-s1-final-classification");

    need(sourceArtifacts.length === 382, `expected 382 source artifacts, got ${sourceArtifacts.length}`);
    need(startArtifacts.length === 384, `expected 384 primary START artifacts, got ${startArtifacts.length}`);
    need(failureArtifacts.length === 2, `expected 2 failure artifacts, got ${failureArtifacts.length}`);
    need(classificationArtifacts.length === 1, `expected one final classification artifact, got ${classificationArtifacts.length}`);

    const classification = await downloadAndReadJson(classificationArtifacts[0], tmpDir);
    need(classification.studyId === STUDY_ID && classification.stageId === STAGE_ID, "classification identity mismatch");
    need(classification.sourceCount === 382, "classification sourceCount mismatch");
    need(classification.primaryStartCount === 384, "classification primaryStartCount mismatch");
    need(classification.deterministicFailureCount === 2, "classification failure count mismatch");
    need(classification.reserveStartCount === 0 && classification.retryCount === 0 && classification.reserveCount === 0, "unexpected reserve/retry use");
    need(classification.unresolvedCount === 0 && classification.fatal === true, "classification final state mismatch");

    const expectedFailureSlots = [40411112, 40411312];
    const failureSlots = failureArtifacts.map((artifact) => extractSlot(artifact.name, "sfcdft2-s1-primary-failure"));
    need(stable(failureSlots) === stable(expectedFailureSlots), `failure slot mismatch: ${JSON.stringify(failureSlots)}`);

    const records = await mapLimit(sourceArtifacts, 8, async (artifact) => {
      const source = await downloadAndReadJson(artifact, tmpDir, "source.json");
      const slot = extractSlot(artifact.name, "sfcdft2-s1-source");
      need(source.studyId === STUDY_ID && source.stageId === STAGE_ID, `source identity mismatch slot=${slot}`);
      need(source.evidenceClass === "FRESH-COMPATIBILITY-SOURCE", `unexpected evidence class slot=${slot}`);
      need(source.slotSeed === slot && source.effectiveSeed === slot && source.seedRole === "PRIMARY", `seed identity mismatch slot=${slot}`);
      need(source.endpointValuesRetained === false, `endpoint retention must be false slot=${slot}`);
      need(typeof source.sourceTrajectorySha256 === "string" && /^[0-9a-f]{64}$/.test(source.sourceTrajectorySha256), `trajectory hash malformed slot=${slot}`);
      need(["CANDIDATE-PAIR-COMPLETE", "NO-CANDIDATE-ROOT-SHORTAGE"].includes(source.candidateStatus), `unexpected candidate status slot=${slot}`);
      if (source.candidateStatus === "CANDIDATE-PAIR-COMPLETE") {
        need(source.pairComplete === true, `candidate pairComplete mismatch slot=${slot}`);
        need(source.openingPrefixAvailable === true && source.openingPrefixLength === 16, `candidate opening prefix mismatch slot=${slot}`);
        need(typeof source.openingPrefixSha256 === "string" && /^[0-9a-f]{64}$/.test(source.openingPrefixSha256), `candidate opening hash malformed slot=${slot}`);
        need(source.namua && source.mtaji, `candidate roots absent slot=${slot}`);
      }
      const roots = [];
      for (const [label, root] of [["namua", source.namua], ["mtaji", source.mtaji]]) {
        if (!root) continue;
        need(typeof root.rawStateSha256 === "string" && /^[0-9a-f]{64}$/.test(root.rawStateSha256), `${label} root hash malformed slot=${slot}`);
        roots.push({ phase: label, sha256: root.rawStateSha256, ply: root.ply });
      }
      return {
        slotSeed: source.slotSeed,
        effectiveSeed: source.effectiveSeed,
        candidateStatus: source.candidateStatus,
        pairComplete: Boolean(source.pairComplete),
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
    need(records.length === 382, "record count mismatch");
    need(new Set(records.map((record) => record.slotSeed)).size === 382, "duplicate source slot");
    for (const failed of expectedFailureSlots) need(!records.some((record) => record.slotSeed === failed), `failed slot unexpectedly sealed ${failed}`);

    const trajectories = sortedUnique(records.map((record) => record.sourceTrajectorySha256));
    const openingPrefixes = sortedUnique(records.map((record) => record.openingPrefixSha256).filter(Boolean));
    const rawRoots = sortedUnique(records.flatMap((record) => record.roots.map((root) => root.sha256)));
    const candidateCount = records.filter((record) => record.candidateStatus === "CANDIDATE-PAIR-COMPLETE").length;
    const shortageCount = records.filter((record) => record.candidateStatus === "NO-CANDIDATE-ROOT-SHORTAGE").length;

    const forbiddenSeedNamespaces = [
      "40411001..40411384",
      "41411001..41411384",
      "40421001..40421768",
      "41421001..41421768"
    ];

    const identityCore = {
      forbiddenSeedNamespaces,
      sourceTrajectorySha256: trajectories,
      openingPrefixSha256: openingPrefixes,
      rawRootSha256: rawRoots
    };
    const identityCoreSha256 = sha256(stable(identityCore));

    const manifest = {
      schemaVersion: 1,
      firewallId: "G4-02-SFCDFT-STUDY2-IDENTITY-FIREWALL",
      sourceStudyId: STUDY_ID,
      sourceStageId: STAGE_ID,
      sourceRunId: RUN_ID,
      sourceExecutionHead: EXECUTION_HEAD,
      evidenceUse: "IDENTITY-ONLY-FIREWALL",
      scientificSeedReplay: false,
      scientificEndpointLoaded: false,
      sourceArtifactCounts: {
        primaryStart: startArtifacts.length,
        sealedSource: records.length,
        deterministicFailure: failureArtifacts.length,
        pairedReserveStart: 0,
        retry: 0,
        unresolved: 0
      },
      sourceStatusCounts: {
        candidatePairComplete: candidateCount,
        noCandidateRootShortage: shortageCount
      },
      failedPrimarySlots: expectedFailureSlots,
      forbiddenSeedNamespaces,
      identityCounts: {
        sourceRecords: records.length,
        uniqueSourceTrajectorySha256: trajectories.length,
        uniqueOpeningPrefixSha256: openingPrefixes.length,
        uniqueRawRootSha256: rawRoots.length
      },
      identityCoreSha256,
      sourceFinalClassification: {
        artifactId: classificationArtifacts[0].id,
        artifactDigest: classificationArtifacts[0].digest || null,
        fatal: true
      },
      materialization: {
        workflowRunId: process.env.GITHUB_RUN_ID || null,
        workflowRunAttempt: process.env.GITHUB_RUN_ATTEMPT || null,
        headSha: process.env.GITHUB_SHA || null,
        artifactInputOnly: true
      },
      limitations: {
        study2TrajectorySemantics: "FULL-TRAJECTORY-TO-FROZEN-MAXPLY-OR-TERMINAL",
        study3TrajectorySemantics: "ANCHOR-BOUNDED-DECISION-PREFIX",
        fullTrajectoryHashDoesNotProvePrefixDisjointness: true,
        study2FailedSlotsHaveNoSealedSourceIdentity: true,
        failedSlotsProtectedBySeedNamespaceExclusion: true
      }
    };

    fs.writeFileSync(path.join(OUTPUT, "MANIFEST.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    fs.writeFileSync(path.join(OUTPUT, "SOURCE_TRAJECTORY_SHA256.txt"), trajectories.length ? `${trajectories.join("\n")}\n` : "", "utf8");
    fs.writeFileSync(path.join(OUTPUT, "OPENING_PREFIX_SHA256.txt"), openingPrefixes.length ? `${openingPrefixes.join("\n")}\n` : "", "utf8");
    fs.writeFileSync(path.join(OUTPUT, "RAW_ROOT_SHA256.txt"), rawRoots.length ? `${rawRoots.join("\n")}\n` : "", "utf8");
    fs.writeFileSync(path.join(OUTPUT, "SOURCE_RECORD_INDEX.jsonl"), `${records.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");

    process.stdout.write(`${JSON.stringify({
      event: "SFCDFT-STUDY2-FIREWALL-MATERIALIZED",
      sourceRecords: records.length,
      candidateCount,
      shortageCount,
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
