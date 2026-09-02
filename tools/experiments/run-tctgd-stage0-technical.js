"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const P = require("./lib/tctgd-production.js");
const I = require("./lib/tctgd-independent.js");

function ok(x, message) { if (!x) throw new Error(message); }
function stable(x) {
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return `[${x.map(stable).join(",")}]`;
  return `{${Object.keys(x).sort().map(k => `${JSON.stringify(k)}:${stable(x[k])}`).join(",")}}`;
}
function sha(x) { return crypto.createHash("sha256").update(stable(x), "utf8").digest("hex"); }
function q(n, d) { return { numerator: String(n), denominator: String(d), defined: Number(d) !== 0 }; }

function baseMeasurement(kind) {
  const layers = [];
  const parentLayers = [];
  for (let d = 0; d <= 5; d++) {
    layers.push({
      depth: d,
      treeNodeOccurrences: d === 0 ? "1" : "2",
      uniqueRawStateCount: d === 0 ? 1 : 2,
      reconvergentRawStateCount: 0
    });
    if (d < 5) {
      parentLayers.push({
        depth: d,
        uniqueTransitionCount: 2,
        duplicateEncounterCount: 0,
        multiParentRawStateCount: 0,
        arrivalMultiplicityHistogram: { "1": "2" },
        parentMultiplicityHistogram: { "1": "2" }
      });
    }
  }
  const overlap = [];
  for (let d = 0; d <= 5; d++) {
    overlap.push({ depth: d, pairs: d === 0 ? [] : [{ rootMoveA: "A", rootMoveB: "B", overlap: q(0, 1) }] });
  }
  const r = {
    targetDepth: 5,
    representation: { mode: "RAW-ONLY", validatedTransformSet: [] },
    rootRawSha256: `fixture-${kind}`,
    layers,
    parentLayers,
    firstReconvergenceDepth: null,
    rootBranchGeometry: { rootMoveLabels: ["A", "B"], rootBranchPairOverlapByDepth: overlap },
    cumulative: { distinctRawStates: 11 }
  };

  if (kind === "same-parent-duplicate") {
    r.layers[1].treeNodeOccurrences = "2";
    r.layers[1].uniqueRawStateCount = 1;
    r.layers[1].reconvergentRawStateCount = 1;
    r.parentLayers[0].duplicateEncounterCount = 1;
    r.parentLayers[0].multiParentRawStateCount = 0;
    r.parentLayers[0].arrivalMultiplicityHistogram = { "2": "1" };
    r.parentLayers[0].parentMultiplicityHistogram = { "1": "1" };
    r.firstReconvergenceDepth = 1;
    r.rootBranchGeometry.rootBranchPairOverlapByDepth[1].pairs[0].overlap = q(1, 1);
    r.cumulative.distinctRawStates = 10;
  }

  if (kind === "multi-parent") {
    r.layers[2].treeNodeOccurrences = "4";
    r.layers[2].uniqueRawStateCount = 3;
    r.layers[2].reconvergentRawStateCount = 1;
    r.parentLayers[1].uniqueTransitionCount = 4;
    r.parentLayers[1].duplicateEncounterCount = 1;
    r.parentLayers[1].multiParentRawStateCount = 1;
    r.parentLayers[1].arrivalMultiplicityHistogram = { "1": "2", "2": "1" };
    r.parentLayers[1].parentMultiplicityHistogram = { "1": "2", "2": "1" };
    r.firstReconvergenceDepth = 2;
    r.rootBranchGeometry.rootBranchPairOverlapByDepth[2].pairs[0].overlap = q(1, 3);
    r.cumulative.distinctRawStates = 10;
  }

  return { reconstructionCore: r };
}

function assertFraction(x, n, d, message) {
  ok(x.defined, `${message}: undefined`);
  ok(BigInt(x.numerator) * BigInt(d) === BigInt(n) * BigInt(x.denominator), `${message}: ${x.numerator}/${x.denominator}`);
}

function fakeComparisons(expectedPairs) {
  const rows = [];
  for (let i = 0; i < expectedPairs; i++) {
    const candidates = {};
    for (const id of P.CANDIDATES) {
      let sign = i < 8 ? 1 : 0;
      if (id === "TCTGD-C5-ROOT-BRANCH-OVERLAP-FRACTION" && i >= 10) sign = null;
      if (id === "TCTGD-C5-ROOT-BRANCH-OVERLAP-FRACTION" && i >= 7 && i < 10) sign = 0;
      candidates[id] = { sign };
    }
    rows.push({ pairId: `fixture-${i + 1}`, candidates });
  }
  return rows;
}

function main() {
  const fixtures = ["no-transposition", "same-parent-duplicate", "multi-parent"];
  const fixtureResults = {};
  for (const name of fixtures) {
    const measurement = baseMeasurement(name);
    const p = P.deriveFromMeasurement(measurement);
    const i = I.deriveFromMeasurement(measurement);
    ok(stable(p) === stable(i), `${name}: production/independent mismatch`);
    fixtureResults[name] = p;
  }

  assertFraction(fixtureResults["no-transposition"].endpoints[P.CANDIDATES[0]], 1, 1, "no-transposition C1");
  assertFraction(fixtureResults["no-transposition"].endpoints[P.CANDIDATES[1]], 0, 1, "no-transposition C2");
  assertFraction(fixtureResults["no-transposition"].endpoints[P.CANDIDATES[2]], 0, 1, "no-transposition C3");
  assertFraction(fixtureResults["no-transposition"].endpoints[P.CANDIDATES[3]], 6, 1, "no-transposition C4");
  assertFraction(fixtureResults["no-transposition"].endpoints[P.CANDIDATES[4]], 0, 1, "no-transposition C5");

  ok(BigInt(fixtureResults["same-parent-duplicate"].endpoints[P.CANDIDATES[1]].numerator) > 0n, "same-parent duplicate must raise C2");
  assertFraction(fixtureResults["same-parent-duplicate"].endpoints[P.CANDIDATES[2]], 0, 1, "same-parent duplicate must not imply multi-parent");
  assertFraction(fixtureResults["same-parent-duplicate"].endpoints[P.CANDIDATES[3]], 1, 1, "same-parent first reconvergence");
  assertFraction(fixtureResults["same-parent-duplicate"].endpoints[P.CANDIDATES[4]], 1, 1, "same-parent root branch overlap");

  ok(BigInt(fixtureResults["multi-parent"].endpoints[P.CANDIDATES[2]].numerator) > 0n, "multi-parent fixture must raise C3");
  assertFraction(fixtureResults["multi-parent"].endpoints[P.CANDIDATES[3]], 2, 1, "multi-parent first reconvergence");
  ok(BigInt(fixtureResults["multi-parent"].endpoints[P.CANDIDATES[4]].numerator) > 0n, "multi-parent fixture must raise C5");

  const permuted = baseMeasurement("multi-parent");
  permuted.reconstructionCore.rootBranchGeometry.rootBranchPairOverlapByDepth.reverse();
  ok(stable(P.deriveFromMeasurement(baseMeasurement("multi-parent"))) === stable(P.deriveFromMeasurement(permuted)), "production traversal/order invariance failed");
  ok(stable(I.deriveFromMeasurement(baseMeasurement("multi-parent"))) === stable(I.deriveFromMeasurement(permuted)), "independent traversal/order invariance failed");

  const devRows = fakeComparisons(12);
  const pDev = P.summarizeDevelopment(devRows, 12);
  const iDev = I.summarizeDevelopment(devRows, 12);
  ok(stable(pDev) === stable(iDev), "development promotion mismatch");
  ok(pDev.promotedCandidates.length === 5, "development boundary fixture should promote all 5 candidates");

  const pSign = P.signTestTwoSided(18, 0);
  const iSign = I.signTestTwoSided(18, 0);
  ok(stable(pSign) === stable(iSign), "sign-test mismatch");
  assertFraction(pSign, 1, 131072, "18/0 exact two-sided sign test");

  const formalRows = [];
  for (let i = 0; i < 18; i++) {
    const candidates = {};
    for (const id of P.CANDIDATES) candidates[id] = { sign: 1 };
    formalRows.push({ pairId: `formal-${i + 1}`, candidates });
  }
  const frozen = P.CANDIDATES.map(candidateId => ({ candidateId, direction: "MTAJI-GREATER" }));
  const pFormal = P.validateFormal(formalRows, frozen, 18);
  const iFormal = I.validateFormal(formalRows, frozen, 18);
  ok(stable(pFormal) === stable(iFormal), "formal Holm/sign-test mismatch");
  ok(pFormal.confirmedCandidates.length === 5, "formal strong-signal fixture should confirm all candidates");

  const prodSource = fs.readFileSync(path.join(__dirname, "lib", "tctgd-production.js"), "utf8");
  const independentSource = fs.readFileSync(path.join(__dirname, "lib", "tctgd-independent.js"), "utf8");
  ok(!independentSource.includes("tctgd-production"), "independent implementation imports production implementation");
  ok(!prodSource.includes("tctgd-independent"), "production implementation imports independent implementation");
  ok(prodSource.includes("lgtgmiv-stage1-production"), "production upstream binding missing");
  ok(independentSource.includes("lgtgmiv-stage1-independent"), "independent upstream binding missing");

  const scientificCore = {
    schemaVersion: 1,
    studyId: "TCTGD-STUDY1",
    stageId: "TCTGD-S0-TECHNICAL-2026-09-02-v1",
    evidenceClass: "TECHNICAL-FIXTURE",
    protectedDepth10Access: false,
    freshScientificSeedAccess: false,
    checks: {
      syntheticNoTransposition: true,
      syntheticSameParentDuplicate: true,
      syntheticMultiParent: true,
      transpositionVsMultiParentSeparation: true,
      firstReconvergenceSemantics: true,
      branchPairOverlapSemantics: true,
      traversalOrderInvariance: true,
      productionIndependentExactAgreement: true,
      developmentPromotionBoundary: true,
      exactSignTestBoundary: true,
      exactHolmBoundary: true,
      staticIndependence: true
    },
    fixtureProjectionSha256: sha(fixtureResults),
    developmentBoundarySha256: sha(pDev),
    formalBoundarySha256: sha(pFormal)
  };
  const output = {
    scientificCore,
    stageScientificCoreSha256: sha(scientificCore),
    disposition: "STAGE0-PASS"
  };

  const arg = process.argv.find(x => x.startsWith("--output="));
  if (arg) fs.writeFileSync(arg.slice("--output=".length), JSON.stringify(output, null, 2) + "\n");
  process.stdout.write(JSON.stringify(output, null, 2) + "\n");
}

main();
