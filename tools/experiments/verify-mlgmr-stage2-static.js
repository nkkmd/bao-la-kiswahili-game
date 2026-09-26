#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const P = require("./lib/mlgmr-stage2-inference-production.js");
const I = require("./lib/mlgmr-stage2-inference-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/multiscale-local-geometry-memory-return");
const SPEC = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STAGE_2_FORMAL_SPEC.json"), "utf8"));
const FW = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STAGE_2_IDENTITY_FIREWALL.json"), "utf8"));
const S1 = JSON.parse(fs.readFileSync(path.join(DOC, "results/stage-1/STAGE_1_CANONICAL_RECORD.json"), "utf8"));

function need(value, message) { if (!value) throw new Error(message); }
function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stable(value[k])}`).join(",")}}`;
}
function same(a, b, message) { need(stable(a) === stable(b), message); }

need(SPEC.studyId === "MLGMR-STUDY1", "study mismatch");
need(SPEC.stageId === "MLGMR-S2-FORMAL-2026-09-26-v1", "stage mismatch");
need(SPEC.scientificExecutionAuthorized === false, "Stage 2 execution must remain disabled during static verification");
need(SPEC.formalFamily.slotCount === 16 && SPEC.formalFamily.slotIds.length === 16, "formal family size mismatch");
need(new Set(SPEC.formalFamily.slotIds).size === 16, "duplicate formal slot");
same(SPEC.formalFamily.slotIds, S1.supportOnlyPromotion.supportedSlotIds, "Stage 2 family must equal Stage 1 support-only promoted family");
need(SPEC.formalFamily.effectDirectionUsedForMembership === false, "effect direction selection prohibited");
need(FW.status === "FROZEN-PRE-STAGE2-FRESH", "Stage 2 firewall not frozen");
need(FW.stage2Reservation.accessed === false, "Stage 2 reservation already accessed");
need(FW.stage2Reservation.start === SPEC.seedBlock.start && FW.stage2Reservation.end === SPEC.seedBlock.end, "Stage 2 reservation mismatch");
need(FW.identitySources.g4_07_stage1.identityFileSha256 === SPEC.stage1SourceArtifact.identityFileSha256, "Stage 1 identity digest mismatch in freeze documents");
need(FW.identitySources.g4_07_stage1.identityRowCount === 96, "Stage 1 identity row count mismatch");
need(SPEC.protectedEvidence.g4_10Depth11AccessAuthorized === false, "G4-10 must remain disabled");
need(SPEC.publicAiChangeAuthorized === false && SPEC.mainIntegrationAuthorized === false, "deployment/main guard invalid");

const productionSource = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/mlgmr-stage2-inference-production.js"), "utf8");
const independentSource = fs.readFileSync(path.join(ROOT, "tools/experiments/lib/mlgmr-stage2-inference-independent.js"), "utf8");
need(!productionSource.includes("mlgmr-stage2-inference-independent"), "production imports independent inference");
need(!independentSource.includes("mlgmr-stage2-inference-production"), "independent imports production inference");

for (const fixture of [
  [0,0,64], [64,0,0], [0,64,0], [40,0,24], [0,40,24], [20,20,24], [21,19,24], [32,8,24], [8,32,24]
]) {
  const [positive, negative, zero] = fixture;
  same(P.exactTwoSidedSignTest(positive, negative, zero), I.exactTwoSidedSignTest(positive, negative, zero), `sign-test mismatch ${fixture.join("/")}`);
}

const holmInputP = [];
const holmInputI = [];
for (let index = 0; index < 16; index++) {
  const slotId = SPEC.formalFamily.slotIds[index];
  const pP = index < 4 ? P.q(1n, 1n << BigInt(20 + index)) : index < 8 ? P.q(BigInt(index - 2), 100n) : P.q(1n);
  const pI = index < 4 ? I.q(1n, 1n << BigInt(20 + index)) : index < 8 ? I.q(BigInt(index - 2), 100n) : I.q(1n);
  holmInputP.push({ slotId, pValue: pP });
  holmInputI.push({ slotId, pValue: pI });
}
const hp = P.holm(holmInputP, 16);
const hi = I.holm(holmInputI, 16);
for (let index = 0; index < 16; index++) {
  need(hp[index].slotId === hi[index].slotId, "Holm slot mismatch");
  need(P.cmp(hp[index].holmAdjustedPValue, hi[index].holmAdjustedPValue) === 0, `Holm adjusted p mismatch ${hp[index].slotId}`);
  need(hp[index].holmRank === hi[index].holmRank, `Holm rank mismatch ${hp[index].slotId}`);
}

for (const fixture of [
  { estimable:false, holmSignificant:false, positive:0, negative:0, expected:"NON-ESTIMABLE" },
  { estimable:true, holmSignificant:false, positive:60, negative:4, expected:"NOT-CONFIRMED" },
  { estimable:true, holmSignificant:true, positive:60, negative:4, expected:"PERSISTENCE-CONFIRMED" },
  { estimable:true, holmSignificant:true, positive:4, negative:60, expected:"REVERSAL-CONFIRMED" }
]) {
  need(P.decision(fixture) === fixture.expected, `production decision mismatch ${fixture.expected}`);
  need(I.decision(fixture) === fixture.expected, `independent decision mismatch ${fixture.expected}`);
}

console.log("MLGMR_STAGE2_STATIC_OK=1");
console.log(`MLGMR_STAGE2_FORMAL_FAMILY_SIZE=${SPEC.formalFamily.slotIds.length}`);
console.log("MLGMR_STAGE2_FRESH_SEED_READS=0");
console.log("MLGMR_G4_10_DEPTH11_ACCESS=0");
