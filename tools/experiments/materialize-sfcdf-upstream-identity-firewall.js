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

function identityRecord(x, origin) {
  if (!x || typeof x !== "object") return null;
  if (typeof x.rootRawSha256 !== "string" || typeof x.sourceTrajectorySha256 !== "string" || typeof x.openingPrefixSha256 !== "string") return null;
  return {
    origin,
    rootRawSha256: x.rootRawSha256,
    sourceTrajectorySha256: x.sourceTrajectorySha256,
    openingPrefixSha256: x.openingPrefixSha256,
    openingPrefixLength: Number.isInteger(x.openingPrefixLength) ? x.openingPrefixLength : null
  };
}
function collectTriples(v, origin, out, seen = new Set()) {
  if (!v || typeof v !== "object") return;
  const r = identityRecord(v, origin);
  if (r) {
    const key = `${r.rootRawSha256}\u0000${r.sourceTrajectorySha256}\u0000${r.openingPrefixSha256}`;
    if (!seen.has(key)) { seen.add(key); out.push(r); }
  }
  if (Array.isArray(v)) for (const x of v) collectTriples(x, origin, out, seen);
  else for (const x of Object.values(v)) collectTriples(x, origin, out, seen);
}

const lgtText = fs.readFileSync(LGTGMIV_FIREWALL, "utf8");
const tctText = fs.readFileSync(TCTGD_RESULT, "utf8");
need(gitBlobSha(lgtText) === EXPECTED[LGTGMIV_FIREWALL], "LGTGMIV identity firewall blob mismatch");
need(gitBlobSha(tctText) === EXPECTED[TCTGD_RESULT], "TCTGD Stage 1 result blob mismatch");
const lgt = JSON.parse(lgtText);
const tct = JSON.parse(tctText);
need(lgt.scientificOutcomeFieldsRetained === false, "input LGTGMIV firewall is not identity-only");

const records = [];
const seen = new Set();
for (const x of lgt.identityRecords || []) {
  const r = identityRecord(x, "LGTGMIV-IDENTITY-ONLY");
  need(r, "invalid upstream identity record");
  const k = `${r.rootRawSha256}\u0000${r.sourceTrajectorySha256}\u0000${r.openingPrefixSha256}`;
  if (!seen.has(k)) { seen.add(k); records.push(r); }
}
collectTriples(tct, "G3-03-STAGE1-IDENTITY-EXTRACT", records, seen);
records.sort((a,b) => a.rootRawSha256.localeCompare(b.rootRawSha256) || a.sourceTrajectorySha256.localeCompare(b.sourceTrajectorySha256) || a.openingPrefixSha256.localeCompare(b.openingPrefixSha256) || a.origin.localeCompare(b.origin));

const counts = {};
for (const r of records) counts[r.origin] = (counts[r.origin] || 0) + 1;
need((counts["LGTGMIV-IDENTITY-ONLY"] || 0) === 80, `expected 80 LGTGMIV identity records, got ${counts["LGTGMIV-IDENTITY-ONLY"] || 0}`);
need((counts["G3-03-STAGE1-IDENTITY-EXTRACT"] || 0) === 24, `expected 24 unique G3-03 Stage 1 identities, got ${counts["G3-03-STAGE1-IDENTITY-EXTRACT"] || 0}`);

const core = {
  schemaVersion: 1,
  studyId: "SFCDF-STUDY1",
  purpose: "UPSTREAM-IDENTITY-ONLY-EXCLUSION-FIREWALL",
  scientificOutcomeFieldsRetained: false,
  g302ScientificOutcomesLoaded: false,
  g303ScientificOutcomesRetained: false,
  sourceBindings: [
    { path: LGTGMIV_FIREWALL, gitBlobSha: EXPECTED[LGTGMIV_FIREWALL], inputClass: "IDENTITY-ONLY" },
    { path: TCTGD_RESULT, gitBlobSha: EXPECTED[TCTGD_RESULT], inputClass: "READ-ONCE-FOR-IDENTITY-EXTRACTION" }
  ],
  identityRecordCount: records.length,
  countsByOrigin: counts,
  identityRecords: records
};
const manifest = { ...core, identityCoreSha256: sha(canon(core)) };
fs.mkdirSync("doc/structural-forcing-corridor-decision-funnel/prereg", { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(`SFCDF_IDENTITY_FIREWALL=${JSON.stringify({identityRecordCount:manifest.identityRecordCount,countsByOrigin:manifest.countsByOrigin,identityCoreSha256:manifest.identityCoreSha256,scientificOutcomeFieldsRetained:false})}`);
