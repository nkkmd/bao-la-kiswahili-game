#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const { performance } = require("node:perf_hooks");
const crypto = require("node:crypto");
const P = require("./lib/psrre-stage1-production.js");
const I = require("./lib/psrre-stage1-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const OUT = path.resolve(process.argv[2] || "artifacts/local/psrre-stage1-tooling-smoke");
const DOC = "doc/prospective-strategic-regime-representation-eligibility";
function abs(p) { return path.join(ROOT, p); }
function json(p) { return JSON.parse(fs.readFileSync(abs(p), "utf8")); }
function text(p) { return fs.readFileSync(abs(p), "utf8"); }
function stable(v) { return P.stableStringify(v); }
function exact(a, b) { return stable(a) === stable(b); }
function sha(s) { return crypto.createHash("sha256").update(String(s), "utf8").digest("hex"); }
function git(args) { return cp.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
function bytes(dir) { let n = 0; for (const e of fs.readdirSync(dir, { withFileTypes: true })) { const p = path.join(dir, e.name); n += e.isDirectory() ? bytes(p) : fs.statSync(p).size; } return n; }
function gate(rows, id, pass, detail = null) { rows.push({ id, passed: !!pass, detail }); }
function stripRoot(records) {
  return records.map((r) => ({ gameSummary: r.gameSummary, candidate: r.candidate ? { ...r.candidate, root: undefined } : null }));
}
function selectedComparable(s) {
  return { generatedGames: s.generatedGames, uniqueTrajectories: s.uniqueTrajectories, distinctOpeningPrefixes: s.distinctOpeningPrefixes, selectedRoots: s.selectedRoots,
    stratumCounts: s.stratumCounts, selectedDistinctOpeningPrefixes: s.selectedDistinctOpeningPrefixes, maximumSingleSelectedOpeningPrefixShare: s.maximumSingleSelectedOpeningPrefixShare,
    selectionHash: s.selectionHash, selected: s.selected.map((x) => ({ seed: x.seed, sourcePolicy: x.sourcePolicy, phase: x.phase, ply: x.ply, legalMoveCount: x.legalMoveCount, rawStateKey: x.rawStateKey, trajectoryHash: x.trajectoryHash, openingPrefixHash: x.openingPrefixHash, stratumRank: x.stratumRank })) };
}
function syntheticRows(dict) {
  const rows = [];
  for (let i = 0; i < 40; i += 1) {
    const f = {};
    for (let j = 0; j < dict.features.length; j += 1) {
      const base = i < 20 ? -4 : 4;
      f[dict.features[j].id] = base + ((i % 5) - 2) * (j + 1) / 17 + ((i % 3) - 1) / 19;
    }
    rows.push({ rawStateKey: sha(`PSRRE-SYNTH|${String(i).padStart(3, "0")}`), seed: i, sourcePolicy: ["UNIFORM", "CAPTURE_FIRST", "HIGH_CAPTURE", "LOW_CAPTURE"][i % 4], phase: i % 2 ? "mtaji" : "namua", ply: 20 + i, trajectoryHash: sha(`TR|${i}`), openingPrefixHash: sha(`OP|${i}`), features: f });
  }
  return rows;
}
function modelComparable(m) {
  return { familyId: m.familyId, k: m.k, orderedRawStateKeys: m.orderedRawStateKeys, scaler: m.scaler, pca: m.pca, prototypes: m.prototypes, prototypeKeys: m.prototypeKeys, assignments: m.assignments, representationRows: m.representationRows };
}

function main() {
  const started = performance.now(); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
  const stage0 = json(`${DOC}/results/STAGE_0_TECHNICAL_CLOSURE_RESULT.json`), spec = json(`${DOC}/prereg/STAGE_1_DEVELOPMENT_SPEC.json`), dict = json(`${DOC}/prereg/STAGE_1_FEATURE_DICTIONARY.json`),
    stage2 = json(`${DOC}/prereg/STAGE_2_VALIDATION_CONTRACT.json`), smoke = json(`${DOC}/prereg/STAGE_1_TOOLING_SMOKE_SPEC.json`), auth = json(`${DOC}/authorizations/STAGE_1_TOOLING_SMOKE_EXECUTE.json`);
  const head = git(["rev-parse", "HEAD"]), parent = git(["rev-parse", "HEAD^"]); const gates = [];
  gate(gates, "STAGE0-PASS-BINDING", stage0.disposition === "STAGE0-TECHNICAL-PASS" && stage0.scientificSeedsUsed.length === 0);
  gate(gates, "STAGE1-CONTRACT-BINDING", spec.studyId === "PSRRE-STUDY1" && spec.scientificSeedUseAuthorizedAtFreeze === false && dict.featureCount === 28);
  gate(gates, "STAGE2-CONTRACT-PRESENCE", stage2.studyId === "PSRRE-STUDY1" && stage2.stage2ExecutionAuthorizedAtFreeze === false && stage2.g2_11Boundary.g2_11ScientificAuthorizationByThisContract === false);
  const forbidden = smoke.scientificSeedForbiddenRanges; const technicalRangeSafe = forbidden.every(([a, b]) => smoke.technicalSeedEnd < a || smoke.technicalSeedStart > b);
  gate(gates, "NO-SCIENTIFIC-SEED-USE", smoke.scientificSeedUseAuthorized === false && technicalRangeSafe && auth.scientificSeedUseAuthorized === false, { technicalRange: [smoke.technicalSeedStart, smoke.technicalSeedEnd], forbidden });
  const sourceBindings = [];
  for (const [p, expected] of Object.entries(auth.sourceBindings || {})) { let actual = null; try { actual = git(["hash-object", p]); } catch {} sourceBindings.push({ path: p, expected, actual, match: actual === expected }); }
  const authPass = auth.authorized === true && auth.sourceFreezeCommit === parent && auth.scientificInferenceAuthorized === false && auth.scientificSeedUseAuthorized === false && auth.g2_11OutcomeInspectionAuthorized === false && sourceBindings.every((x) => x.match);

  const opt = { games: smoke.technicalGames, seedStart: smoke.technicalSeedStart, maxPly: spec.sourceGeneration.maxPly };
  const pg = P.generate(spec, opt), ig = I.generate(spec, opt);
  const sourceExact = exact(stripRoot(pg), stripRoot(ig));
  gate(gates, "TECHNICAL-SOURCE-GENERATION-PRODUCTION-INDEPENDENT-EXACT", sourceExact, { games: pg.length });
  const ps = P.select(pg, spec, { quotaPerStratum: smoke.sourceSmoke.quotaPerPhaseSourcePolicyStratum }), is = I.select(ig, spec, { quotaPerStratum: smoke.sourceSmoke.quotaPerPhaseSourcePolicyStratum });
  const selectionExact = exact(selectedComparable(ps), selectedComparable(is)) && ps.selectedRoots === smoke.sourceSmoke.expectedSelectedRoots;
  gate(gates, "TECHNICAL-ROOT-SELECTION-PRODUCTION-INDEPENDENT-EXACT", selectionExact, { productionSelected: ps.selectedRoots, independentSelected: is.selectedRoots, strata: ps.stratumCounts });

  const pRows = ps.selected.map((r) => P.analyzeSelected(r, dict, 1)), iRows = is.selected.map((r) => I.analyzeSelected(r, dict, 1));
  const featureExact = pRows.length === dict.featureCount ? false : exact(pRows, iRows);
  gate(gates, "FEATURE-28-PRODUCTION-INDEPENDENT-EXACT", featureExact && pRows.every((r) => Object.keys(r.features).length === 28), { rows: pRows.length, features: pRows[0] ? Object.keys(pRows[0].features).length : 0 });
  const pScaler = P.fitScaler(pRows, dict), iScaler = I.fitScaler(iRows, dict);
  gate(gates, "MEDIAN-MAD-PRODUCTION-INDEPENDENT-EXACT", exact(pScaler, iScaler), { nonzeroMad: pScaler.nonzeroMadFeatureIds.length });

  const familyDetails = {};
  let pcaExact = true, wardExact = true, pamExact = true, assignmentExact = true;
  for (const familyId of smoke.familySmoke.allFamiliesRequired) {
    const pm = P.fitFamily(pRows, dict, familyId, 2), im = I.fitFamily(iRows, dict, familyId, 2);
    const mExact = exact(modelComparable(pm), modelComparable(im));
    const pa = P.applyModel(pRows, pm), ia = I.applyModel(iRows, im), aExact = exact(pa, ia);
    familyDetails[familyId] = { modelExact: mExact, assignmentExact: aExact, labels: pm.assignments };
    assignmentExact = assignmentExact && aExact;
    if (familyId === "RF-A-ROBUST-PCA-WARD") { pcaExact = pcaExact && exact(pm.pca, im.pca); wardExact = wardExact && mExact; }
    if (familyId === "RF-B-ROBUST-PCA-PAM") { pcaExact = pcaExact && exact(pm.pca, im.pca); pamExact = pamExact && mExact; }
    if (familyId === "RF-C-DIRECT-ROBUST-PAM") pamExact = pamExact && mExact;
  }
  gate(gates, "PCA8-PRODUCTION-INDEPENDENT-EXACT", pcaExact);
  gate(gates, "WARD-PRODUCTION-INDEPENDENT-EXACT", wardExact);
  gate(gates, "PAM-PRODUCTION-INDEPENDENT-EXACT", pamExact);
  gate(gates, "FROZEN-ASSIGNMENT-PRODUCTION-INDEPENDENT-EXACT", assignmentExact);

  const synth = syntheticRows(dict), pmx = P.candidateMetrics(synth, dict, "RF-C-DIRECT-ROBUST-PAM", 2), imx = I.candidateMetrics(synth, dict, "RF-C-DIRECT-ROBUST-PAM", 2);
  const pmSummary = { support: pmx.support, supportFractions: pmx.supportFractions, minimumSupportFraction: pmx.minimumSupportFraction, sourcePolicyShares: pmx.sourcePolicyShares,
    maximumSingleSourcePolicyShare: pmx.maximumSingleSourcePolicyShare, meanSilhouette: pmx.meanSilhouette, foldScores: pmx.foldScores, fiveFoldAssignmentStability: pmx.fiveFoldAssignmentStability,
    trainingPrototypeDistanceP99ByRegime: pmx.trainingPrototypeDistanceP99ByRegime };
  const imSummary = { support: imx.support, supportFractions: imx.supportFractions, minimumSupportFraction: imx.minimumSupportFraction, sourcePolicyShares: imx.sourcePolicyShares,
    maximumSingleSourcePolicyShare: imx.maximumSingleSourcePolicyShare, meanSilhouette: imx.meanSilhouette, foldScores: imx.foldScores, fiveFoldAssignmentStability: imx.fiveFoldAssignmentStability,
    trainingPrototypeDistanceP99ByRegime: imx.trainingPrototypeDistanceP99ByRegime };
  gate(gates, "CANDIDATE-METRIC-PLUMBING-SYNTHETIC-EXACT", exact(pmSummary, imSummary), { scientificInterpretationAuthorized: false });
  gate(gates, "CANONICAL-SERIALIZATION-HASH-EXACT", P.hashObject(pmSummary) === I.hashObject(imSummary));
  const independentSource = text("tools/experiments/lib/psrre-stage1-independent.js");
  const independentSeparated = !independentSource.includes("psrre-stage1-production") && !independentSource.includes("require(\"./psrre-stage1-production") && !independentSource.includes("require('./psrre-stage1-production");
  gate(gates, "INDEPENDENT-IMPLEMENTATION-SEPARATION", independentSeparated && authPass, { authPass, sourceBindings });

  const technical = { schemaVersion: "PSRRE_STAGE1_TOOLING_SMOKE_TECHNICAL_OUTPUT_V1", scientificEvidence: false, scientificPerformanceInterpretationAuthorized: false,
    source: { production: stripRoot(pg), independent: stripRoot(ig) }, selection: { production: selectedComparable(ps), independent: selectedComparable(is) },
    features: { production: pRows, independent: iRows }, familyDetails, syntheticMetric: { production: pmSummary, independent: imSummary } };
  fs.writeFileSync(path.join(OUT, "technical-output.json"), JSON.stringify(technical, null, 2) + "\n");
  const elapsed = (performance.now() - started) / 1000, rss = process.memoryUsage().rss, preBytes = bytes(OUT);
  const resourcePass = elapsed <= smoke.resourceCeilings.wallClockSeconds && rss <= smoke.resourceCeilings.maxRssBytes && preBytes <= smoke.resourceCeilings.uncompressedArtifactBytes;
  gate(gates, "RESOURCE-CEILING", resourcePass, { elapsedSeconds: elapsed, rssBytes: rss, preResultArtifactBytes: preBytes, ceilings: smoke.resourceCeilings });
  const required = new Set(smoke.mandatoryChecks), missing = [...required].filter((id) => !gates.some((g) => g.id === id)), failed = gates.filter((g) => required.has(g.id) && !g.passed).map((g) => g.id);
  const disposition = missing.length || failed.length ? "TOOLING-SMOKE-TECHNICAL-INVALID" : "TOOLING-SMOKE-PASS";
  const result = { schemaVersion: "PSRRE_STAGE1_TOOLING_SMOKE_RESULT_V1", studyId: "PSRRE-STUDY1", smokeId: smoke.smokeId, stageId: spec.stageId, head, parent,
    disposition, requiredCheckCount: smoke.mandatoryChecks.length, missingMandatoryChecks: missing, failedMandatoryChecks: failed, gates,
    technicalSeedsUsed: [smoke.technicalSeedStart, smoke.technicalSeedEnd], scientificSeedsUsed: [], scientificInferenceAuthorized: false, scientificOutcomeGenerated: false,
    scientificPerformanceInterpreted: false, g2_11OutcomeInspected: false, stage1ScientificExecutionAuthorized: false, resource: { elapsedSeconds: elapsed, rssBytes: rss } };
  fs.writeFileSync(path.join(OUT, "smoke-result.json"), JSON.stringify(result, null, 2) + "\n");
  result.resource.finalArtifactBytes = bytes(OUT); fs.writeFileSync(path.join(OUT, "smoke-result.json"), JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify({ smokeId: smoke.smokeId, disposition, failed, missing, selectedRoots: ps.selectedRoots, scientificSeedsUsed: [], scientificOutcomeGenerated: false, g2_11OutcomeInspected: false }, null, 2));
  if (disposition !== "TOOLING-SMOKE-PASS") process.exitCode = 2;
}
main();
