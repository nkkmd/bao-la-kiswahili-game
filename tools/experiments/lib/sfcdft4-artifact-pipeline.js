"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const STUDY_ID = "SFCDFT-STUDY4";
const STAGE_ID = "SFCDFT4-S0-E2E-TECHNICAL-2026-09-19-v1";
const SCHEMA_VERSION = 1;
const TECHNICAL_SEED_MIN = 49041001;
const TECHNICAL_SEED_MAX = 49041256;
const SCIENTIFIC_RANGES = [
  [40611001, 40611384], [41611001, 41611384],
  [40621001, 40621768], [41621001, 41621768]
];
const DOMAINS = [
  "SFCDFT4-D1-P1-RF1",
  "SFCDFT4-D2-P1-RF2",
  "SFCDFT4-D3-P2-RF1",
  "SFCDFT4-D4-P2-RF2"
];
const CLAIMS = [
  "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION",
  "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO"
];

function need(condition, message) {
  if (!condition) throw new Error(message);
}

function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}

function sha256(value) {
  const input = Buffer.isBuffer(value) ? value : Buffer.from(String(value), "utf8");
  return crypto.createHash("sha256").update(input).digest("hex");
}

function canonicalSha256(value) {
  return sha256(stable(value));
}

function syntheticHash(label) {
  return sha256(`SFCDFT4-STAGE0-SYNTHETIC|${label}`);
}

function isScientificSeed(seed) {
  return SCIENTIFIC_RANGES.some(([lo, hi]) => seed >= lo && seed <= hi);
}

function assertFixtureSeed(seed) {
  need(Number.isInteger(seed), `fixture seed is not integer: ${seed}`);
  need(seed >= TECHNICAL_SEED_MIN && seed <= TECHNICAL_SEED_MAX, `fixture seed outside frozen technical range: ${seed}`);
  need(!isScientificSeed(seed), `scientific seed contamination: ${seed}`);
}

function makeSyntheticSource({ seed, domainId, status, ordinal }) {
  assertFixtureSeed(seed);
  need(DOMAINS.includes(domainId), `unknown domain ${domainId}`);
  const base = {
    schemaVersion: SCHEMA_VERSION,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    evidenceClass: "TECHNICAL-FIXTURE-E2E",
    fixtureOnly: true,
    scientificSeed: false,
    fixtureSeed: seed,
    domainId,
    candidateStatus: status,
    ordinal,
    endpointValuesRetained: false,
    effectDirectionRetained: false,
    pValueRetained: false,
    formalDecisionRetained: false,
    sourceTrajectorySha256: syntheticHash(`trajectory|${seed}|${domainId}|${status}|${ordinal}`)
  };
  if (status === "CANDIDATE-PAIR-COMPLETE") {
    return {
      ...base,
      pairComplete: true,
      openingPrefixAvailable: true,
      openingPrefixLength: 16,
      openingPrefixSha256: syntheticHash(`prefix|${seed}|${domainId}|${ordinal}`),
      namua: {
        phase: "namua",
        ply: domainId.includes("RF2") ? 28 : 20,
        rawStateSha256: syntheticHash(`namua|${seed}|${domainId}|${ordinal}`)
      },
      mtaji: {
        phase: "mtaji",
        ply: domainId.includes("RF2") ? 52 : 40,
        rawStateSha256: syntheticHash(`mtaji|${seed}|${domainId}|${ordinal}`)
      }
    };
  }
  return {
    ...base,
    pairComplete: false,
    openingPrefixAvailable: false,
    openingPrefixLength: 0,
    openingPrefixSha256: null,
    namua: null,
    mtaji: null
  };
}

function generateSyntheticFixtures() {
  const rows = [];
  let seed = TECHNICAL_SEED_MIN;
  for (const domainId of DOMAINS) {
    rows.push(makeSyntheticSource({ seed: seed++, domainId, status: "CANDIDATE-PAIR-COMPLETE", ordinal: 1 }));
    rows.push(makeSyntheticSource({ seed: seed++, domainId, status: "CANDIDATE-PAIR-COMPLETE", ordinal: 2 }));
  }
  rows.push(makeSyntheticSource({ seed: seed++, domainId: DOMAINS[0], status: "NO-CANDIDATE-ROOT-SHORTAGE", ordinal: 1 }));
  rows.push(makeSyntheticSource({ seed: seed++, domainId: DOMAINS[1], status: "NO-CANDIDATE-ENGINE-GUARD-CENSORING", ordinal: 1 }));
  return rows;
}

// Production and independent projections are intentionally separate implementations.
function productionSelection(fixtures) {
  const selected = [];
  for (const domainId of DOMAINS) {
    const candidates = fixtures.filter((row) => row.domainId === domainId && row.candidateStatus === "CANDIDATE-PAIR-COMPLETE");
    candidates.sort((a, b) => {
      const ka = syntheticHash(`${STAGE_ID}|${a.domainId}|${a.fixtureSeed}|${a.sourceTrajectorySha256}|${a.openingPrefixSha256}|${a.namua.rawStateSha256}|${a.mtaji.rawStateSha256}`);
      const kb = syntheticHash(`${STAGE_ID}|${b.domainId}|${b.fixtureSeed}|${b.sourceTrajectorySha256}|${b.openingPrefixSha256}|${b.namua.rawStateSha256}|${b.mtaji.rawStateSha256}`);
      return ka.localeCompare(kb);
    });
    candidates.forEach((row, index) => selected.push({
      domainId,
      rank: index + 1,
      fixtureSeed: row.fixtureSeed,
      sourceTrajectorySha256: row.sourceTrajectorySha256,
      openingPrefixSha256: row.openingPrefixSha256,
      namuaRawSha256: row.namua.rawStateSha256,
      mtajiRawSha256: row.mtaji.rawStateSha256
    }));
  }
  return selected;
}

function independentSelection(fixtures) {
  const byDomain = new Map(DOMAINS.map((d) => [d, []]));
  fixtures.forEach((row) => {
    if (row.candidateStatus !== "CANDIDATE-PAIR-COMPLETE") return;
    byDomain.get(row.domainId).push(row);
  });
  const out = [];
  DOMAINS.forEach((domainId) => {
    const decorated = byDomain.get(domainId).map((row) => ({
      row,
      key: syntheticHash([STAGE_ID, row.domainId, row.fixtureSeed, row.sourceTrajectorySha256, row.openingPrefixSha256, row.namua.rawStateSha256, row.mtaji.rawStateSha256].join("|"))
    }));
    decorated.sort((x, y) => x.key < y.key ? -1 : x.key > y.key ? 1 : 0);
    for (let i = 0; i < decorated.length; i++) {
      const row = decorated[i].row;
      out.push({
        domainId,
        rank: i + 1,
        fixtureSeed: row.fixtureSeed,
        sourceTrajectorySha256: row.sourceTrajectorySha256,
        openingPrefixSha256: row.openingPrefixSha256,
        namuaRawSha256: row.namua.rawStateSha256,
        mtajiRawSha256: row.mtaji.rawStateSha256
      });
    }
  });
  return out;
}

function validateSelectedPairs(selected) {
  need(Array.isArray(selected) && selected.length === 8, `selected pair count must be 8, got ${selected && selected.length}`);
  const identities = new Set();
  for (const domainId of DOMAINS) {
    const rows = selected.filter((row) => row.domainId === domainId);
    need(rows.length === 2, `domain ${domainId} must have 2 synthetic selected pairs`);
  }
  for (const row of selected) {
    assertFixtureSeed(row.fixtureSeed);
    const identity = `${row.domainId}|${row.rank}|${row.fixtureSeed}`;
    need(!identities.has(identity), `duplicate selected pair identity ${identity}`);
    identities.add(identity);
    for (const key of ["sourceTrajectorySha256", "openingPrefixSha256", "namuaRawSha256", "mtajiRawSha256"]) {
      need(typeof row[key] === "string" && /^[0-9a-f]{64}$/.test(row[key]), `invalid ${key}`);
    }
  }
}

function aggregateSchema() {
  return {
    schemaVersion: SCHEMA_VERSION,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    fixtureOnly: true,
    scientificInferencePerformed: false,
    familySize: 8,
    cells: CLAIMS.flatMap((claimId) => DOMAINS.map((domainId) => ({ claimId, domainId, status: "STRUCTURE-ONLY" })))
  };
}

function validateAggregateSchema(schema) {
  need(schema && schema.schemaVersion === SCHEMA_VERSION, "aggregate schema version mismatch");
  need(schema.studyId === STUDY_ID && schema.stageId === STAGE_ID, "aggregate identity mismatch");
  need(schema.fixtureOnly === true && schema.scientificInferencePerformed === false, "aggregate scientific boundary mismatch");
  need(schema.familySize === 8 && Array.isArray(schema.cells) && schema.cells.length === 8, "aggregate fixed-eight schema mismatch");
  const expected = new Set(CLAIMS.flatMap((claimId) => DOMAINS.map((domainId) => `${claimId}|${domainId}`)));
  for (const cell of schema.cells) {
    need(cell.status === "STRUCTURE-ONLY", "aggregate cell must be structure-only");
    need(expected.delete(`${cell.claimId}|${cell.domainId}`), "aggregate cell duplicate or unexpected");
  }
  need(expected.size === 0, "aggregate schema missing cells");
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function buildBundle(outputDir) {
  const fixtures = generateSyntheticFixtures();
  const prod = productionSelection(fixtures);
  const indep = independentSelection(fixtures);
  validateSelectedPairs(prod);
  validateSelectedPairs(indep);
  need(stable(prod) === stable(indep), "production/independent synthetic selection mismatch");

  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
  const selectedEntries = [];
  for (const row of prod) {
    const fixture = fixtures.find((x) => x.fixtureSeed === row.fixtureSeed);
    const rel = `selected/${row.domainId}/${String(row.rank).padStart(2, "0")}-${row.fixtureSeed}.json`;
    const file = path.join(outputDir, rel);
    writeJson(file, fixture);
    selectedEntries.push({ ...row, path: rel, sha256: sha256(fs.readFileSync(file)) });
  }
  const sourceSummary = {
    schemaVersion: SCHEMA_VERSION,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    fixtureOnly: true,
    scientificSeedReads: 0,
    fixtureCount: fixtures.length,
    candidateCount: fixtures.filter((x) => x.candidateStatus === "CANDIDATE-PAIR-COMPLETE").length,
    rootShortageCount: fixtures.filter((x) => x.candidateStatus === "NO-CANDIDATE-ROOT-SHORTAGE").length,
    engineGuardCensoringCount: fixtures.filter((x) => x.candidateStatus === "NO-CANDIDATE-ENGINE-GUARD-CENSORING").length,
    fixtureDigest: canonicalSha256(fixtures)
  };
  const selectionManifest = {
    schemaVersion: SCHEMA_VERSION,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    fixtureOnly: true,
    scientificSeedReads: 0,
    selectionReady: true,
    selectedPairCount: selectedEntries.length,
    selectedPairs: selectedEntries,
    productionIndependentExact: true,
    selectionDigest: canonicalSha256(prod)
  };
  const aggregate = aggregateSchema();
  validateAggregateSchema(aggregate);
  writeJson(path.join(outputDir, "SOURCE_FIXTURE_SUMMARY.json"), sourceSummary);
  writeJson(path.join(outputDir, "SELECTED_SOURCE_MANIFEST.json"), selectionManifest);
  writeJson(path.join(outputDir, "AGGREGATE_STRUCTURE.json"), aggregate);

  const files = ["SOURCE_FIXTURE_SUMMARY.json", "SELECTED_SOURCE_MANIFEST.json", "AGGREGATE_STRUCTURE.json", ...selectedEntries.map((x) => x.path)].sort();
  const contentDigests = Object.fromEntries(files.map((rel) => [rel, sha256(fs.readFileSync(path.join(outputDir, rel)))]));
  const manifestCore = {
    schemaVersion: SCHEMA_VERSION,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    evidenceClass: "TECHNICAL-FIXTURE-E2E",
    fixtureOnly: true,
    scientificSeedReads: 0,
    scientificOutputsGenerated: 0,
    consumerSchemaVersion: SCHEMA_VERSION,
    selectedPairCount: selectedEntries.length,
    contentDigests
  };
  const bundleManifest = { ...manifestCore, deterministicCoreSha256: canonicalSha256(manifestCore) };
  writeJson(path.join(outputDir, "BUNDLE_MANIFEST.json"), bundleManifest);
  return { bundleManifest, sourceSummary, selectionManifest, aggregate };
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function validateBundle(inputDir, options = {}) {
  need(inputDir && fs.existsSync(inputDir), "bundle missing");
  const manifestPath = path.join(inputDir, "BUNDLE_MANIFEST.json");
  need(fs.existsSync(manifestPath), "bundle manifest missing");
  const manifest = readJson(manifestPath);
  need(manifest.schemaVersion === SCHEMA_VERSION, "schema version mismatch");
  need(manifest.studyId === STUDY_ID && manifest.stageId === STAGE_ID, "study/stage identity mismatch");
  need(manifest.fixtureOnly === true && manifest.evidenceClass === "TECHNICAL-FIXTURE-E2E", "fixture identity mismatch");
  need(manifest.scientificSeedReads === 0 && manifest.scientificOutputsGenerated === 0, "scientific boundary contamination");
  const core = { ...manifest };
  delete core.deterministicCoreSha256;
  need(canonicalSha256(core) === manifest.deterministicCoreSha256, "bundle manifest/content core mismatch");
  need(manifest.contentDigests && typeof manifest.contentDigests === "object", "content digest map missing");
  for (const [rel, expected] of Object.entries(manifest.contentDigests)) {
    const file = path.join(inputDir, rel);
    need(fs.existsSync(file), `bundle content missing ${rel}`);
    need(sha256(fs.readFileSync(file)) === expected, `bundle digest mismatch ${rel}`);
  }
  const selection = readJson(path.join(inputDir, "SELECTED_SOURCE_MANIFEST.json"));
  need(selection.studyId === STUDY_ID && selection.stageId === STAGE_ID, "selection identity mismatch");
  need(selection.fixtureOnly === true && selection.scientificSeedReads === 0, "selection scientific boundary mismatch");
  need(selection.selectionReady === true, "synthetic selection not ready");
  validateSelectedPairs(selection.selectedPairs);
  need(selection.selectionDigest === canonicalSha256(selection.selectedPairs.map(({ path: _p, sha256: _s, ...row }) => row)), "selection digest mismatch");
  const sourceSummary = readJson(path.join(inputDir, "SOURCE_FIXTURE_SUMMARY.json"));
  need(sourceSummary.scientificSeedReads === 0, "source summary scientific seed contamination");
  const aggregate = readJson(path.join(inputDir, "AGGREGATE_STRUCTURE.json"));
  validateAggregateSchema(aggregate);
  if (options.requireAllSelectedFiles !== false) {
    for (const row of selection.selectedPairs) {
      const file = path.join(inputDir, row.path);
      need(fs.existsSync(file), `selected source missing ${row.path}`);
      const fixture = readJson(file);
      need(fixture.fixtureOnly === true && fixture.scientificSeed === false, "selected fixture contamination");
      assertFixtureSeed(fixture.fixtureSeed);
      need(sha256(fs.readFileSync(file)) === row.sha256, `selected source digest mismatch ${row.path}`);
    }
  }
  return { manifest, selection, sourceSummary, aggregate };
}

function cloneDir(src, dst) {
  fs.rmSync(dst, { recursive: true, force: true });
  fs.cpSync(src, dst, { recursive: true });
}

function expectFailure(name, fn) {
  let failed = false;
  try { fn(); } catch (_error) { failed = true; }
  need(failed, `negative fixture did not fail closed: ${name}`);
  return name;
}

function runNegativeFixtures(validBundleDir, scratchDir) {
  fs.rmSync(scratchDir, { recursive: true, force: true });
  fs.mkdirSync(scratchDir, { recursive: true });
  const passed = [];
  passed.push(expectFailure("missing-bundle", () => validateBundle(path.join(scratchDir, "does-not-exist"))));

  function mutate(name, mutator) {
    const dst = path.join(scratchDir, name);
    cloneDir(validBundleDir, dst);
    mutator(dst);
    passed.push(expectFailure(name, () => validateBundle(dst)));
  }

  mutate("malformed-json", (dir) => fs.writeFileSync(path.join(dir, "BUNDLE_MANIFEST.json"), "{not-json\n"));
  mutate("schema-version-mismatch", (dir) => {
    const p = path.join(dir, "BUNDLE_MANIFEST.json"), j = readJson(p); j.schemaVersion = 999; writeJson(p, j);
  });
  mutate("missing-selected-pair", (dir) => {
    const p = path.join(dir, "SELECTED_SOURCE_MANIFEST.json"), j = readJson(p); j.selectedPairs.pop(); writeJson(p, j);
  });
  mutate("duplicate-pair-identity", (dir) => {
    const p = path.join(dir, "SELECTED_SOURCE_MANIFEST.json"), j = readJson(p); j.selectedPairs[1] = { ...j.selectedPairs[0] }; writeJson(p, j);
  });
  mutate("bundle-digest-mismatch", (dir) => fs.appendFileSync(path.join(dir, "SOURCE_FIXTURE_SUMMARY.json"), " \n"));
  mutate("manifest-content-mismatch", (dir) => {
    const p = path.join(dir, "BUNDLE_MANIFEST.json"), j = readJson(p); j.contentDigests["SOURCE_FIXTURE_SUMMARY.json"] = "0".repeat(64); writeJson(p, j);
  });
  mutate("wrong-study-stage-identity", (dir) => {
    const p = path.join(dir, "BUNDLE_MANIFEST.json"), j = readJson(p); j.studyId = "WRONG-STUDY"; writeJson(p, j);
  });
  mutate("scientific-seed-marker-contamination", (dir) => {
    const selectionPath = path.join(dir, "SELECTED_SOURCE_MANIFEST.json");
    const selection = readJson(selectionPath);
    const target = path.join(dir, selection.selectedPairs[0].path);
    const fixture = readJson(target);
    fixture.fixtureSeed = 40611001;
    fixture.scientificSeed = true;
    writeJson(target, fixture);
    selection.selectedPairs[0].sha256 = sha256(fs.readFileSync(target));
    writeJson(selectionPath, selection);
    const bundlePath = path.join(dir, "BUNDLE_MANIFEST.json"), bundle = readJson(bundlePath);
    bundle.contentDigests[selection.selectedPairs[0].path] = sha256(fs.readFileSync(target));
    bundle.contentDigests["SELECTED_SOURCE_MANIFEST.json"] = sha256(fs.readFileSync(selectionPath));
    const core = { ...bundle }; delete core.deterministicCoreSha256; bundle.deterministicCoreSha256 = canonicalSha256(core); writeJson(bundlePath, bundle);
  });
  return passed;
}

module.exports = {
  STUDY_ID,
  STAGE_ID,
  SCHEMA_VERSION,
  DOMAINS,
  CLAIMS,
  stable,
  sha256,
  canonicalSha256,
  buildBundle,
  validateBundle,
  validateAggregateSchema,
  runNegativeFixtures
};
