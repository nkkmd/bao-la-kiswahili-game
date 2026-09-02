"use strict";

const fs = require("node:fs");
const path = require("node:path");
const prod = require("./lib/ebrws-stage0-production.js");
const indep = require("./lib/ebrws-stage0-independent.js");

const STAGE = "EBRWS-S0-TECHNICAL-2026-09-01-v1";
const outDir = process.argv[2] || "artifacts/local/effective-branching-reply-width-structure/stage0-technical-v1";

function assert(condition, label) {
  if (!condition) throw new Error(`assertion-failed:${label}`);
}

function dirs(kind) {
  if (kind === "expand") return [[4,1],[5,1],[6,2],[7,2],[8,3]];
  if (kind === "compress") return [[1,5],[1,4],[2,5],[1,3],[2,3]];
  if (kind === "balanced") return [[2,2],[3,3],[4,4],[2,2],[5,5]];
  if (kind === "mixed") return [[4,1],[1,4],[4,1],[1,4],[2,2]];
  throw new Error(`unknown-reply-kind:${kind}`);
}

function makeFixture(rootId, phase, treeKind, replyKind) {
  let T, Z;
  if (treeKind === "expand") { T=[1,2,6,24,120,720]; Z=[0,0,0,0,0,0]; }
  else if (treeKind === "compress") { T=[1,6,30,120,360,720]; Z=[0,0,0,0,0,0]; }
  else if (treeKind === "flat") { T=[1,2,4,8,16,32]; Z=[0,0,0,0,0,0]; }
  else if (treeKind === "mixed") { T=[1,2,6,12,36,72]; Z=[0,0,0,0,0,0]; }
  else if (treeKind === "truncated") { T=[1,2,4,4,0,0]; Z=[0,0,0,4,0,0]; }
  else throw new Error(`unknown-tree-kind:${treeKind}`);
  const rootLegalMoveCount = T[1];
  const immediateReplyWidth = {};
  for (let i=0;i<rootLegalMoveCount;i++) immediateReplyWidth[`move-${String(i+1).padStart(2,"0")}`] = (i % 4) + 1;
  const parentLayers = dirs(replyKind).map((pair, depth) => ({
    depth,
    widthExpansionCount: pair[0],
    widthCompressionCount: pair[1],
    widthStableCount: depth + 1,
    branchReopeningCount: depth,
    branchExtinctionCount: 0
  }));
  return {
    rootId,
    phase,
    families: {
      "LGTGMIV-F1-TREE-OCCURRENCE": {
        rootLegalMoveCount,
        layers: T.map((value, depth) => ({ depth, treeNodeOccurrences: String(value), terminalOccurrenceCount: String(Z[depth]) }))
      },
      "LGTGMIV-F5-REPLY-GEOMETRY": { immediateReplyWidth, parentLayers }
    }
  };
}

function same(a,b) { return prod.canonical(a) === indep.jsonCanon(b); }

function deriveBoth(fixture) {
  const a = prod.deriveRoot(fixture);
  const b = indep.calculate(fixture);
  assert(same(a,b), `root-exact-agreement:${fixture.rootId}`);
  return [a,b];
}

function main() {
  const started = Date.now();
  const checks = {};

  assert(prod.canonical({b:1,a:2}) === prod.canonical({a:2,b:1}), "production-canonical-key-order");
  assert(indep.jsonCanon({b:1,a:2}) === indep.jsonCanon({a:2,b:1}), "independent-canonical-key-order");
  checks.canonicalSerializationDeterminism = true;

  const pHalf = prod.exactRatio(1,2), pTwoThirds = prod.exactRatio(2,3), pEqual = prod.exactRatio(2,4), pZero = prod.exactRatio(1,0);
  const iHalf = indep.fraction(1,2), iTwoThirds = indep.fraction(2,3), iEqual = indep.fraction(2,4), iZero = indep.fraction(1,0);
  assert(prod.compareRatios(pHalf,pTwoThirds) === -1, "production-ratio-less");
  assert(indep.fractionOrder(iHalf,iTwoThirds) === -1, "independent-ratio-less");
  assert(prod.compareRatios(pHalf,pEqual) === 0, "production-ratio-equal");
  assert(indep.fractionOrder(iHalf,iEqual) === 0, "independent-ratio-equal");
  assert(pZero.defined === false && iZero.defined === false, "denominator-zero-defined-false");
  checks.exactRationalArithmetic = true;
  checks.denominatorZeroHandling = true;

  const boundaryFixtures = [
    makeFixture("tree-expand", "namua", "expand", "expand"),
    makeFixture("tree-compress", "namua", "compress", "compress"),
    makeFixture("tree-flat", "namua", "flat", "balanced"),
    makeFixture("tree-mixed", "namua", "mixed", "mixed"),
    makeFixture("tree-truncated", "namua", "truncated", "balanced")
  ];
  const expectedTree = ["EXPANSION-DOMINANT","COMPRESSION-DOMINANT","FLAT-DOMINANT","MIXED","TERMINAL-TRUNCATED"];
  boundaryFixtures.forEach((fx,idx) => {
    const [a,b] = deriveBoth(fx);
    assert(a.tree.treeWidthShapeClass === expectedTree[idx], `production-tree-class:${fx.rootId}`);
    assert(b.tree.treeWidthShapeClass === expectedTree[idx], `independent-tree-class:${fx.rootId}`);
  });
  checks.treeWidthShapeBoundaryCases = true;

  const replyExpected = [
    [makeFixture("reply-expand", "namua", "flat", "expand"), "EXPANSION-DOMINANT"],
    [makeFixture("reply-compress", "namua", "flat", "compress"), "COMPRESSION-DOMINANT"],
    [makeFixture("reply-balanced", "namua", "flat", "balanced"), "BALANCED-MIXED"],
    [makeFixture("reply-mixed", "namua", "flat", "mixed"), "BALANCED-MIXED"]
  ];
  for (const [fx, expected] of replyExpected) {
    const [a,b] = deriveBoth(fx);
    assert(a.reply.replyWidthShapeClass === expected, `production-reply-class:${fx.rootId}`);
    assert(b.reply.replyWidthShapeClass === expected, `independent-reply-class:${fx.rootId}`);
  }
  checks.replyWidthShapeBoundaryCases = true;

  const candidateFixtures = [
    makeFixture("n-01", "namua", "expand", "expand"),
    makeFixture("n-02", "namua", "expand", "expand"),
    makeFixture("n-03", "namua", "mixed", "mixed"),
    makeFixture("m-01", "mtaji", "compress", "compress"),
    makeFixture("m-02", "mtaji", "compress", "compress"),
    makeFixture("m-03", "mtaji", "mixed", "mixed"),
    makeFixture("m-04", "mtaji", "mixed", "mixed")
  ];
  const prodRoots = candidateFixtures.map(fx => prod.deriveRoot(fx));
  const indepRoots = candidateFixtures.map(fx => indep.calculate(fx));
  prodRoots.forEach((r,i) => assert(same(r,indepRoots[i]), `candidate-root-exact:${r.rootId}`));
  const pc = prod.promoteCandidates(prodRoots);
  const ic = indep.selectCandidates(indepRoots);
  assert(same(pc,ic), "candidate-set-exact-agreement");
  assert(pc.candidates.length === 2, "candidate-count-two");
  assert(pc.candidates.every(x => x.phase === "namua" && x.class === "EXPANSION-DOMINANT" && x.classCount === 2 && x.eligibleRootCount === 3), "exact-two-thirds-promotes");
  assert(!pc.candidates.some(x => x.phase === "mtaji"), "one-half-does-not-promote");
  checks.exactTwoThirdsPromotionBoundary = true;
  checks.productionIndependentCandidateAgreement = true;

  const stageA = prod.buildStage(prodRoots, { elapsedMs: 1, runner: "A" });
  const stageB = indep.assembleStage(indepRoots, { elapsedMs: 999999, runner: "B" });
  assert(stageA.stageScientificCoreSha256 === stageB.stageScientificCoreSha256, "stage-core-exact-agreement");
  assert(same(stageA.scientific, stageB.scientific), "stage-object-exact-agreement");
  checks.productionIndependentStageAgreement = true;

  const reversedA = prod.buildStage([...prodRoots].reverse(), { elapsedMs: 2 });
  const reversedB = indep.assembleStage([...indepRoots].reverse(), { elapsedMs: 3 });
  assert(reversedA.stageScientificCoreSha256 === stageA.stageScientificCoreSha256, "production-root-order-invariance");
  assert(reversedB.stageScientificCoreSha256 === stageB.stageScientificCoreSha256, "independent-root-order-invariance");
  checks.rootOrderInvariance = true;

  const telemetryMutation = prod.buildStage(prodRoots, { elapsedMs: 123456, peakRssBytes: 987654321, pid: 42, path: "/tmp/different" });
  assert(telemetryMutation.stageScientificCoreSha256 === stageA.stageScientificCoreSha256, "telemetry-excluded-from-scientific-core");
  checks.telemetrySeparation = true;

  const prodPath = path.join(__dirname, "lib", "ebrws-stage0-production.js");
  const indepPath = path.join(__dirname, "lib", "ebrws-stage0-independent.js");
  const prodSource = fs.readFileSync(prodPath, "utf8");
  const indepSource = fs.readFileSync(indepPath, "utf8");
  assert(!prodSource.includes("ebrws-stage0-independent"), "production-does-not-import-independent");
  assert(!indepSource.includes("ebrws-stage0-production"), "independent-does-not-import-production");
  assert(prod.sha256(prodSource) !== prod.sha256(indepSource), "source-files-structurally-distinct");
  checks.staticIndependenceAudit = true;

  checks.freshScientificSeedConsumption = false;
  checks.freshScientificRootGeneration = false;
  checks.protectedDepth10Access = false;

  const allMandatoryPass = Object.entries(checks).filter(([k]) => !k.startsWith("fresh") && k !== "protectedDepth10Access").every(([,v]) => v === true)
    && checks.freshScientificSeedConsumption === false
    && checks.freshScientificRootGeneration === false
    && checks.protectedDepth10Access === false;

  const result = {
    schemaVersion: 1,
    studyId: "EBRWS-STUDY1",
    stageId: STAGE,
    evidenceClass: "TECHNICAL-NON-SCIENTIFIC",
    checks,
    allMandatoryPass,
    formalStageDisposition: allMandatoryPass ? "STAGE0-PASS" : "TECHNICAL-INVALID",
    fixtureCount: boundaryFixtures.length + replyExpected.length + candidateFixtures.length,
    productionStageScientificCoreSha256: stageA.stageScientificCoreSha256,
    independentStageScientificCoreSha256: stageB.stageScientificCoreSha256,
    candidateSetSha256: pc.candidateSetSha256,
    promotedTechnicalCandidates: pc.candidates,
    telemetry: { elapsedMs: Date.now() - started },
    scientificEvidenceGenerated: false,
    scientificEvidenceRead: false,
    protectedDepth10Holdout: "SEALED / NOT GENERATED / NOT READ"
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "technical-validation.json"), JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = allMandatoryPass ? 0 : 1;
}

main();
