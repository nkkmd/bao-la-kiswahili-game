#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_REL = "doc/state-transformation-semantics-canonicalization-validation/preregistration/STAGE_1_SPEC.json";
const CONTRACT_REL = "doc/state-transformation-semantics-canonicalization-validation/preregistration/STAGE_1_CANDIDATE_CONTRACT.json";

function sha256Buffer(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function sha256File(rel) { return sha256Buffer(fs.readFileSync(path.join(ROOT, rel))); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}
function ensure(condition, message) { if (!condition) throw new Error(message); }
function load(rel) { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")); }

function main() {
  const outIndex = process.argv.indexOf("--output");
  const output = outIndex >= 0 ? process.argv[outIndex + 1] : null;
  ensure(output, "--output is required");
  const spec = load(SPEC_REL);
  const contract = load(CONTRACT_REL);
  ensure(spec.studyId === "STSCV-STUDY1" && spec.stageId === "STSCV-S1-DEVELOPMENT-2026-08-28-v1", "Stage 1 identity mismatch");
  ensure(spec.scientificInferenceAuthorized === false && spec.formalConfirmationAuthorized === false, "Stage 1 role drift");
  ensure(spec.population.seedBlock.count === spec.population.seedBlock.end - spec.population.seedBlock.start + 1, "seed count mismatch");
  ensure(spec.population.seedBlock.start > 26030032, "Stage 1 seed block overlaps Stage 0 technical block");
  ensure(spec.population.targetRootsPerStratum === 24, "root target drift");
  ensure(spec.localGraph.depth === 3, "local graph depth drift");
  ensure(spec.population.replacementOutsideFrozenSeedBlock === false, "replacement unexpectedly authorized");
  ensure(spec.authoritativeRawIdentity.include.join(",") === "pits,reserve,houseOwned,player,phase,winner,pending", "RAW identity include drift");
  ensure(spec.authoritativeRawIdentity.exclude.join(",") === "turn,reason", "RAW identity exclude drift");
  ensure(contract.scientificCandidates.map((row) => row.candidateId).join(",") === [
    "STSCV-T01-SEAT-SWAP-LOCAL",
    "STSCV-T02-LR-MTAJI-HOUSELESS",
    "STSCV-T03-SEAT-SWAP-LR-MTAJI-HOUSELESS",
  ].join(","), "candidate set drift");
  ensure(contract.controls.map((row) => row.candidateId).join(",") === "STSCV-C00-IDENTITY,STSCV-C01-LR-NO-DIRECTION-FLIP", "control set drift");

  const sourceSha256 = {};
  for (const rel of spec.frozenSourcePathsToBindBeforeAuthorization) {
    ensure(fs.existsSync(path.join(ROOT, rel)), `missing frozen source ${rel}`);
    sourceSha256[rel] = sha256File(rel);
  }
  const runnerSource = fs.readFileSync(path.join(ROOT, "tools/experiments/run-stscv-stage1-development.js"), "utf8");
  const verifierSource = fs.readFileSync(path.join(ROOT, "tools/experiments/verify-stscv-stage1-development.js"), "utf8");
  ensure(!/symmetry-isomorphic-positions\/results/.test(runnerSource), "production runner imports prior SIP result evidence");
  ensure(!/symmetry-isomorphic-positions\/results/.test(verifierSource), "independent verifier imports prior SIP result evidence");
  ensure(!/oracle-representation-integrity-symmetry-confirmation\/results/.test(runnerSource + verifierSource), "Stage 1 imports ORISC result evidence");
  ensure(!/run-stscv-stage1-development/.test(verifierSource), "independent verifier imports production runner");
  ensure(!/stscv-stage0-production/.test(verifierSource), "independent verifier imports production transform");

  const rawIdentityContract = {
    include: spec.authoritativeRawIdentity.include,
    exclude: spec.authoritativeRawIdentity.exclude,
    missingPendingAllowed: spec.authoritativeRawIdentity.missingPendingAllowed,
  };
  const manifest = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    classification: "PRE-SCIENTIFIC-SOURCE-FREEZE",
    readyForExplicitAuthorization: true,
    scientificOutcomeGenerated: false,
    specSha256: sha256File(SPEC_REL),
    candidateContractSha256: sha256File(CONTRACT_REL),
    rawStateIdentitySha256: sha256Buffer(Buffer.from(stable(rawIdentityContract), "utf8")),
    transformationDefinitionSha256: sha256File(CONTRACT_REL),
    sourceSha256,
    frozenPopulation: {
      seedBlock: spec.population.seedBlock,
      maximumTrajectoryPly: spec.population.maximumTrajectoryPly,
      targetRootsPerStratum: spec.population.targetRootsPerStratum,
      openingPrefixLengthMoves: spec.population.openingPrefixLengthMoves,
      localGraphDepth: spec.localGraph.depth,
      replacementOutsideFrozenSeedBlock: false,
    },
    candidateIds: spec.candidateIds,
    controlIds: spec.controlIds,
    stage2AutomaticAuthorization: false,
    canonicalizationAuthorized: false,
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

if (require.main === module) main();
