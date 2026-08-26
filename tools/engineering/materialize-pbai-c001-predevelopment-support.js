#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const Population = require("./lib/pbai-p1-decision-population.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = "doc/ai-engineering/public-ai-improvement-program-1/candidates/PBAI-C001-v1-predevelopment-support-spec.json";

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8"));
}

function sha256File(rel) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");
}

function parseArgs(argv) {
  const options = { output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--output") {
      options.output = argv[index + 1];
      if (!options.output) throw new Error("--output requires a path");
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return options;
}

function stableRootOrder(a, b) {
  return a.populationRankHash.localeCompare(b.populationRankHash)
    || a.seed - b.seed || a.ply - b.ply;
}

function summarizeRoot(root) {
  const moves = Population.sortedMoves(root.state);
  const moveTypes = [...new Set(moves.map((move) => move.type))].sort();
  const allCapture = moves.length >= 2 && moves.every((move) => move.type === "capture");
  const anyNonCapture = moves.some((move) => move.type !== "capture");
  return {
    ...Population.rootRef(root),
    populationRankHash: root.populationRankHash,
    legalMoveCount: moves.length,
    moveTypes,
    allCapture,
    anyNonCapture,
  };
}

function refs(rows) {
  return rows.map(({ seed, ply, phase, rawKey }) => ({ seed, ply, phase, rawKey }));
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const spec = readJson(SPEC_PATH);
  if (spec.firewall.validationSeedBlockAccessAuthorized !== false
      || spec.firewall.releaseHoldoutSeedBlockAccessAuthorized !== false
      || spec.firewall.candidateOutcomeMeasurementAuthorized !== false
      || spec.firewall.publicCodeChangeAuthorized !== false) {
    throw new Error("Predevelopment firewall is not closed");
  }

  const block = spec.developmentPopulation.sourceSeedBlock;
  const population = Population.materializeSplit({
    split: "development",
    start: block.start,
    end: block.end,
    maximumPlies: spec.developmentPopulation.maximumTrajectoryPlies,
  });
  if (population.support.namua !== spec.developmentPopulation.populationTarget.namua
      || population.support.mtaji !== spec.developmentPopulation.populationTarget.mtaji
      || population.support.total !== spec.developmentPopulation.populationTarget.total) {
    throw new Error(`Development population support mismatch: ${JSON.stringify(population.support)}`);
  }

  const measured = population.roots.map(summarizeRoot).sort(stableRootOrder);
  const eligible = measured.filter((root) => root.phase === "namua" && root.allCapture);
  const selectedTargets = eligible.slice(0, spec.supportMeasurement.targetMaximum);
  const mtajiControls = measured
    .filter((root) => root.phase === "mtaji")
    .slice(0, spec.supportMeasurement.phaseControl.selectionMaximum);
  const namuaNonForcedControls = measured
    .filter((root) => root.phase === "namua" && root.legalMoveCount >= 2 && root.anyNonCapture)
    .slice(0, spec.supportMeasurement.namuaNonForcedControl.selectionMaximum);
  const supportPass = eligible.length >= spec.supportMeasurement.minimumEstimableTargets;

  const report = {
    schemaVersion: 1,
    program: "PBAI-P1",
    phase: "PBAI-D-PREDEVELOPMENT-SUPPORT",
    candidateId: spec.candidateId,
    candidateVersion: spec.candidateVersion,
    specPath: SPEC_PATH,
    specStatus: spec.status,
    baselineId: spec.baselineId,
    globalGateSpecId: spec.globalGateSpecId,
    sourceSeedBlock: block,
    candidateImplementationObserved: false,
    candidateCodeUsed: false,
    candidateBenefitMetricsObserved: false,
    validationSeedsAccessed: false,
    releaseHoldoutSeedsAccessed: false,
    publicCodeChanged: false,
    sourceBinding: {
      publicEngineSha256: sha256File("public/engine.js"),
      publicAiSha256: sha256File("public/ai.js"),
      expectedPublicEngineSha256: "e6acf1fe4d97db67dbcfadc3a785e802342ae0b0cbaec35f53eb8e77424cfc1c",
      expectedPublicAiSha256: "2823dbcf96c7a47489301ecd768a63975aa8b4e12b62cc4629fc8283ef5dff9e",
    },
    population: {
      materializationId: population.materializationId,
      digest: Population.populationDigest(population),
      support: population.support,
      trajectoryCandidates: population.trajectoryCandidates,
      maximumPlies: population.maximumPlies,
    },
    measurement: {
      definition: "current-root legal moveVariants only; no search score/value/reference/continuation outcome measurement",
      rootsMeasured: measured.length,
      namuaRoots: measured.filter((root) => root.phase === "namua").length,
      mtajiRoots: measured.filter((root) => root.phase === "mtaji").length,
      namuaAllCaptureRoots: eligible.length,
      namuaAtLeastOneNonCaptureRoots: measured.filter(
        (root) => root.phase === "namua" && root.anyNonCapture,
      ).length,
    },
    targetSupport: {
      eligibility: "nonterminal phase=namua; >=2 legal moveVariants; all variants type=capture",
      eligible: eligible.length,
      selected: selectedTargets.length,
      maximum: spec.supportMeasurement.targetMaximum,
      minimumEstimable: spec.supportMeasurement.minimumEstimableTargets,
      supportPass,
    },
    controls: {
      mtaji: {
        available: measured.filter((root) => root.phase === "mtaji").length,
        selected: mtajiControls.length,
        expectedRuntimeTrigger: false,
        refs: refs(mtajiControls),
      },
      namuaNonForced: {
        available: measured.filter(
          (root) => root.phase === "namua" && root.legalMoveCount >= 2 && root.anyNonCapture,
        ).length,
        selected: namuaNonForcedControls.length,
        expectedRuntimeTrigger: false,
        refs: refs(namuaNonForcedControls),
      },
    },
    selectedTargetRefs: refs(selectedTargets),
    decision: supportPass
      ? "SUPPORT-PASS-ELIGIBLE-FOR-EXACT-CANDIDATE-CONTRACT-FREEZE"
      : "NON-ESTIMABLE/HOLD-NO-DEVELOPMENT",
    decisionBoundary: {
      engineeringEstimabilityEvidenceOnly: true,
      legacySearchStrengthClaimAuthorized: false,
      captureBranchExpansionWinningValueClaimAuthorized: false,
      scientificDecisionChanged: false,
    },
    developmentAuthorizationGrantedByThisReport: false,
    validationAuthorizedByThisReport: false,
    releaseHoldoutAuthorizedByThisReport: false,
    aiGen3PromotionAuthorizedByThisReport: false,
  };

  if (report.sourceBinding.publicEngineSha256 !== report.sourceBinding.expectedPublicEngineSha256) {
    throw new Error("Frozen public engine hash mismatch");
  }
  if (report.sourceBinding.publicAiSha256 !== report.sourceBinding.expectedPublicAiSha256) {
    throw new Error("Frozen public AI hash mismatch");
  }

  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (options.output) {
    const absolute = path.resolve(ROOT, options.output);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, serialized);
  }
  process.stdout.write(serialized);
}

main();
