#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const crypto = require("node:crypto");

const LGTGMIV_FIREWALL = "doc/transposition-concentration-tree-graph-divergence/prereg/UPSTREAM_IDENTITY_FIREWALL_V2.json";
const TCTGD_RESULT = "doc/transposition-concentration-tree-graph-divergence/results/stage-1/scientific-result.json";
const OUT = "doc/structural-forcing-corridor-decision-funnel/prereg/UPSTREAM_IDENTITY_FIREWALL.json";

const EXPECTED = {
  [LGTGMIV_FIREWALL]: "e644737dc32e2aec8694450aba8700d7a150fcc3",
  [TCTGD_RESULT]: "a8109d45d62ee4a8ceee78b3979767c5ed665b67"
};

function canon(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canon).join(",")}]`;
  return `{${Object.keys(v).sort().map(k => `${JSON.stringify(k)}:${canon(v[k])}`).join(",")}}`;
}
function sha(s) { return crypto.createHash("sha256").update(s, "utf8").digest("hex"); }
function need(x, m) { if (!x) throw new Error(m); }
function gitBlobSha(content) { return crypto.createHash("sha1").update(`blob ${Buffer.byteLength(content, "utf8")}\0`).update(content, "utf8").digest("hex"); }
function addIfString(set, value) { if (typeof value === "string" && value.length) set.add(value); }

const lgtText = fs.readFileSync(LGTGMIV_FIREWALL, "utf8");
const tctText = fs.readFileSync(TCTGD_RESULT, "utf8");
need(gitBlobSha(lgtText) === EXPECTED[LGTGMIV_FIREWALL], "LGTGMIV identity firewall blob mismatch");
need(gitBlobSha(tctText) === EXPECTED[TCTGD_RESULT], "TCTGD Stage 1 result blob mismatch");
const lgt = JSON.parse(lgtText);
const tct = JSON.parse(tctText);
need(lgt.scientificOutcomeFieldsRetained === false, "input LGTGMIV firewall is not identity-only");
need(lgt.identityRecordCount === 80 && Array.isArray(lgt.identityRecords) && lgt.identityRecords.length === 80, "unexpected LGTGMIV identity record count");

const roots = new Set();
const trajectories = new Set();
const prefixes = new Set();
for (const x of lgt.identityRecords) {
  addIfString(roots, x.rootRawSha256);
  addIfString(trajectories, x.sourceTrajectorySha256);
  addIfString(prefixes, x.openingPrefixSha256);
}

const pairs = tct && tct.sourceSelection && tct.sourceSelection.production && tct.sourceSelection.production.pairs;
need(Array.isArray(pairs) && pairs.length === 12, "expected 12 G3-03 production source pairs");
const g303IdentityRecords = [];
for (const p of pairs) {
  for (const phase of ["namua", "mtaji"]) {
    const x = p[phase];
    need(x && typeof x.rootRawSha256 === "string" && typeof x.sourceTrajectorySha256 === "string" && typeof x.openingPrefixSha256 === "string", `invalid G3-03 ${phase} source identity`);
    g303IdentityRecords.push({
      pairId: p.pairId,
      phase,
      sourceSeed: x.sourceSeed,
      selectedPly: x.selectedPly,
      rootRawSha256: x.rootRawSha256,
      sourceTrajectorySha256: x.sourceTrajectorySha256,
      openingPrefixSha256: x.openingPrefixSha256,
      openingPrefixLength: x.openingPrefixLength
    });
    roots.add(x.rootRawSha256);
    trajectories.add(x.sourceTrajectorySha256);
    prefixes.add(x.openingPrefixSha256);
  }
}
need(g303IdentityRecords.length === 24, "expected 24 G3-03 root identity records");
g303IdentityRecords.sort((a,b) => a.sourceSeed-b.sourceSeed || a.selectedPly-b.selectedPly || a.rootRawSha256.localeCompare(b.rootRawSha256));

const core = {
  schemaVersion: 2,
  studyId: "SFCDF-STUDY1",
  purpose: "UPSTREAM-IDENTITY-ONLY-EXCLUSION-FIREWALL",
  scientificOutcomeFieldsRetained: false,
  g302ScientificOutcomesLoaded: false,
  g303ScientificOutcomesRetained: false,
  sourceBindings: [
    { path: LGTGMIV_FIREWALL, gitBlobSha: EXPECTED[LGTGMIV_FIREWALL], inputClass: "IDENTITY-ONLY" },
    { path: TCTGD_RESULT, gitBlobSha: EXPECTED[TCTGD_RESULT], inputClass: "READ-ONCE-FOR-IDENTITY-EXTRACTION" }
  ],
  upstreamLgtgmivIdentityRecordCount: 80,
  g303SourcePairCount: 12,
  g303RootIdentityRecordCount: 24,
  identitySets: {
    rootRawSha256: [...roots].sort(),
    sourceTrajectorySha256: [...trajectories].sort(),
    openingPrefixSha256: [...prefixes].sort()
  },
  identitySetCounts: {
    root: roots.size,
    trajectory: trajectories.size,
    prefix: prefixes.size
  },
  g303IdentityRecords
};
const manifest = { ...core, identityCoreSha256: sha(canon(core)) };
fs.mkdirSync("doc/structural-forcing-corridor-decision-funnel/prereg", { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(`SFCDF_IDENTITY_FIREWALL=${JSON.stringify({identitySetCounts:manifest.identitySetCounts,g303RootIdentityRecordCount:manifest.g303RootIdentityRecordCount,identityCoreSha256:manifest.identityCoreSha256,scientificOutcomeFieldsRetained:false})}`);
