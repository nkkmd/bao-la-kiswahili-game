#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/structural-forcing-corridor-decision-funnel");
const STAGE1 = path.join(DOC, "results/stage-1/scientific-result.json");
const UPSTREAM = path.join(DOC, "prereg/UPSTREAM_IDENTITY_FIREWALL.json");
const OUT = path.join(DOC, "prereg/STAGE_2_FORMAL_INPUT.json");

function need(x, m) { if (!x) throw new Error(m); }
function readJson(f) { return JSON.parse(fs.readFileSync(f, "utf8")); }
function canonical(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonical).join(",")}]`;
  return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canonical(v[k])}`).join(",")}}`;
}
function sha256(s) { return crypto.createHash("sha256").update(s, "utf8").digest("hex"); }
function gitBlobSha(s) {
  const b = Buffer.from(s, "utf8");
  return crypto.createHash("sha1").update(Buffer.from(`blob ${b.length}\0`, "utf8")).update(b).digest("hex");
}
function sourceOnly(x) {
  return {
    phase: x.phase,
    sourceSeed: x.sourceSeed,
    selectedPly: x.selectedPly,
    rootRawSha256: x.rootRawSha256,
    sourceTrajectorySha256: x.sourceTrajectorySha256,
    openingPrefixSha256: x.openingPrefixSha256,
    openingPrefixLength: x.openingPrefixLength
  };
}

need(fs.existsSync(STAGE1), "Stage 1 canonical result missing");
need(fs.existsSync(UPSTREAM), "upstream identity firewall missing");
need(!fs.existsSync(OUT), "Stage 2 formal input already materialized");

const s1Text = fs.readFileSync(STAGE1, "utf8");
const upstreamText = fs.readFileSync(UPSTREAM, "utf8");
const s1 = JSON.parse(s1Text);
const upstream = JSON.parse(upstreamText);

need(s1.studyId === "SFCDF-STUDY1", "Stage 1 study mismatch");
need(s1.stageId === "SFCDF-S1-DEVELOPMENT-2026-09-02-v1", "Stage 1 id mismatch");
need(s1.stageDisposition === "STAGE1-PASS", "Stage 1 not PASS");
need(s1.seedBlockConsumed === true && s1.noRescueBoundaryCrossed === true, "Stage 1 consumption/no-rescue mismatch");
need(s1.verification && s1.verification.stageScientificExact === true, "Stage 1 scientific exactness missing");
need(s1.resourceStatus && s1.resourceStatus.rootResourcePass === true && s1.resourceStatus.stageResourcePass === true, "Stage 1 resource gates not PASS");
need(upstream.scientificOutcomeFieldsRetained === false && upstream.g303ScientificOutcomesRetained === false, "upstream firewall not identity-only");

const frozenPromoted = [
  { candidateId: "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION", direction: "MTAJI-GREATER" },
  { candidateId: "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO", direction: "NAMUA-GREATER" }
];
need(canonical(s1.promotedCandidates) === canonical(frozenPromoted), "Stage 1 promoted set differs from frozen Stage 2 input");

const pp = s1.sourceSelection && s1.sourceSelection.production && s1.sourceSelection.production.pairs;
const ip = s1.sourceSelection && s1.sourceSelection.independent && s1.sourceSelection.independent.pairs;
need(Array.isArray(pp) && Array.isArray(ip) && pp.length === 12 && ip.length === 12, "Stage 1 pair identities incomplete");
const pSources = pp.map(p => ({ pairId: p.pairId, sourceSeed: p.sourceSeed, namua: sourceOnly(p.namua), mtaji: sourceOnly(p.mtaji) }));
const iSources = ip.map(p => ({ pairId: p.pairId, sourceSeed: p.sourceSeed, namua: sourceOnly(p.namua), mtaji: sourceOnly(p.mtaji) }));
need(canonical(pSources) === canonical(iSources), "Stage 1 production/independent source identities differ");

const root = new Set(), trajectory = new Set(), prefix = new Set();
for (const pair of pSources) {
  for (const phase of ["namua", "mtaji"]) {
    const x = pair[phase];
    root.add(x.rootRawSha256);
    trajectory.add(x.sourceTrajectorySha256);
    prefix.add(x.openingPrefixSha256);
  }
}
need(root.size === 24, "Stage 1 RAW-root identity count must be 24");
need(trajectory.size === 24, "Stage 1 trajectory identity count must be 24");
need(prefix.size === 12, "Stage 1 first-16 prefix identity count must be 12");

const identitySets = {
  rootRawSha256: [...root].sort(),
  sourceTrajectorySha256: [...trajectory].sort(),
  openingPrefixSha256: [...prefix].sort()
};
const identityCoreSha256 = sha256(canonical(identitySets));

const out = {
  schemaVersion: 1,
  studyId: "SFCDF-STUDY1",
  stageId: "SFCDF-S2-FORMAL-2026-09-02-v1",
  materializationClass: "STAGE2-PREAUTH-FORMAL-INPUT",
  freshStage2ScientificEvidenceGenerated: false,
  stage2SeedAccess: false,
  protectedDepth10Access: false,
  sourceStage1Result: {
    path: "doc/structural-forcing-corridor-decision-funnel/results/stage-1/scientific-result.json",
    gitBlobSha: gitBlobSha(s1Text),
    stageScientificCoreSha256: s1.productionStageScientificCoreSha256,
    stageDisposition: s1.stageDisposition
  },
  upstreamIdentityFirewall: {
    path: "doc/structural-forcing-corridor-decision-funnel/prereg/UPSTREAM_IDENTITY_FIREWALL.json",
    gitBlobSha: gitBlobSha(upstreamText),
    identityCoreSha256: upstream.identityCoreSha256,
    scientificOutcomeFieldsRetained: false
  },
  promotedCandidates: frozenPromoted,
  nonPromotedCandidatesExcluded: [
    "SFCDF-C2-WIDTH-COMPRESSION-FRACTION",
    "SFCDF-C3-LONGEST-UNIT-WIDTH-RUN",
    "SFCDF-C4-RECONVERGENT-STATE-OCCUPANCY-FRACTION",
    "SFCDF-C5-ROOT-BRANCH-OVERLAP-FRACTION"
  ],
  stage1IdentitySets: identitySets,
  stage1IdentityCounts: {
    rootRawSha256: root.size,
    sourceTrajectorySha256: trajectory.size,
    openingPrefixSha256: prefix.size
  },
  stage1IdentityCoreSha256: identityCoreSha256,
  retainedStage1ScientificFields: ["promotedCandidates"],
  discardedStage1ScientificOutcomes: true
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`SFCDF_STAGE2_FORMAL_INPUT=${JSON.stringify({promotedCandidates:out.promotedCandidates,stage1IdentityCounts:out.stage1IdentityCounts,stage1IdentityCoreSha256:out.stage1IdentityCoreSha256,freshStage2ScientificEvidenceGenerated:false,stage2SeedAccess:false,protectedDepth10Access:false})}`);
