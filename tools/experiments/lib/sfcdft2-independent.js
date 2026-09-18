"use strict";

const crypto = require("node:crypto");
const L = require("./lgttci-compatibility-independent.js");
const S = require("./sfcdf-independent.js");

const STUDY_ID = "SFCDFT-STUDY2";
const C1 = "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION";
const C6 = "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO";
const P1 = L.P1;
const P2 = L.P2;
const RF1 = L.RF1;
const RF2 = L.RF2;

function assertOk(v, m) { if (!v) throw new Error(m); }
function hashText(v) { return crypto.createHash("sha256").update(String(v), "utf8").digest("hex"); }
function canonical(v) { return L.stable(v); }
function digest(v) { return hashText(typeof v === "string" ? v : canonical(v)); }
function copy(v) { return JSON.parse(JSON.stringify(v)); }

function policyForSeed(seed) {
  assertOk(Number.isInteger(seed), "independent seed must be integer");
  return (seed & 1) === 1 ? P1 : P2;
}
function familyForSeed(stageId, seed) {
  assertOk(typeof stageId === "string" && stageId !== "", "independent stageId required");
  assertOk(Number.isInteger(seed), "independent seed must be integer");
  const byte = Number.parseInt(hashText(stageId + "|RF|" + seed).slice(0, 2), 16);
  return (byte & 1) === 0 ? RF1 : RF2;
}
function domainId(policyId, familyId) {
  const table = new Map([
    [`${P1}|${RF1}`, "SFCDFT2-D1-P1-RF1"],
    [`${P1}|${RF2}`, "SFCDFT2-D2-P1-RF2"],
    [`${P2}|${RF1}`, "SFCDFT2-D3-P2-RF1"],
    [`${P2}|${RF2}`, "SFCDFT2-D4-P2-RF2"]
  ]);
  const value = table.get(`${policyId}|${familyId}`);
  assertOk(value, `independent unknown policy/family ${policyId}/${familyId}`);
  return value;
}
function openingPrefix(moveKeys, pairComplete) {
  assertOk(Array.isArray(moveKeys), "independent moveKeys array required");
  if (moveKeys.length < 16) {
    assertOk(!pairComplete, "independent complete candidate requires at least 16 moves");
    return {
      openingPrefixAvailable: false,
      openingPrefixLength: moveKeys.length,
      openingPrefixSha256: null
    };
  }
  let text = "";
  for (let i = 0; i < 16; i++) text += (i ? "\n" : "") + moveKeys[i];
  return {
    openingPrefixAvailable: true,
    openingPrefixLength: 16,
    openingPrefixSha256: hashText(text)
  };
}
function replaySource(E, stageId, seed, maxPly = 240) {
  const policyId = policyForSeed(seed);
  const familyId = familyForSeed(stageId, seed);
  const replay = L.replay(E, policyId, seed, maxPly);
  const anchors = L.selectAnchors(replay.rows, familyId);
  const prefix = openingPrefix(replay.moveKeys, anchors.complete);
  const candidateStatus = anchors.complete ? "CANDIDATE-PAIR-COMPLETE" : "NO-CANDIDATE-ROOT-SHORTAGE";
  if (anchors.complete) {
    assertOk(prefix.openingPrefixAvailable === true, "independent complete candidate opening prefix unavailable");
    assertOk(prefix.openingPrefixLength === 16 && typeof prefix.openingPrefixSha256 === "string", "independent complete candidate prefix invalid");
  }
  return {
    stageId,
    seed,
    policyId,
    familyId,
    domainId: domainId(policyId, familyId),
    trajectorySha256: replay.trajectorySha256,
    candidateStatus,
    pairComplete: Boolean(anchors.complete),
    openingPrefixAvailable: prefix.openingPrefixAvailable,
    openingPrefixLength: prefix.openingPrefixLength,
    openingPrefixSha256: prefix.openingPrefixSha256,
    moveCount: replay.moveKeys.length,
    terminal: replay.terminal,
    anchors,
    replay
  };
}
function endpointPair(E, rootRow, sourceIdentity) {
  assertOk(rootRow && rootRow.state && Number.isInteger(rootRow.ply), "independent root row required");
  assertOk(sourceIdentity && Number.isInteger(sourceIdentity.seed), "independent source seed required");
  assertOk(typeof sourceIdentity.trajectorySha256 === "string", "independent source trajectory required");
  assertOk(sourceIdentity.candidateStatus === "CANDIDATE-PAIR-COMPLETE", "independent candidate source required");
  assertOk(sourceIdentity.openingPrefixAvailable === true, "independent candidate prefix must be available");
  assertOk(typeof sourceIdentity.openingPrefixSha256 === "string" && sourceIdentity.openingPrefixLength === 16, "independent source prefix required");
  const source = {
    phase: rootRow.phase,
    sourceSeed: sourceIdentity.seed,
    selectedPly: rootRow.ply,
    rootRawSha256: rootRow.rawStateSha256,
    sourceTrajectorySha256: sourceIdentity.trajectorySha256,
    openingPrefixSha256: sourceIdentity.openingPrefixSha256,
    openingPrefixLength: sourceIdentity.openingPrefixLength,
    rootState: copy(rootRow.state)
  };
  const measured = S.measureRoot(E, source);
  const c1 = measured.sfcdf.endpoints[C1];
  const c6 = measured.sfcdf.endpoints[C6];
  assertOk(c1 && c6, "independent C1/C6 endpoint missing");
  return {
    rootRawSha256: rootRow.rawStateSha256,
    ply: rootRow.ply,
    phase: rootRow.phase,
    endpoints: { [C1]: c1, [C6]: c6 },
    measurementDigest: digest(measured)
  };
}
function abs(n) { return n < 0n ? -n : n; }
function fraction(n, d) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  let a = abs(n), b = abs(d);
  while (b !== 0n) { const r = a % b; a = b; b = r; }
  const g = a === 0n ? 1n : a;
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function subtract(a, b) {
  if (!a || !b || !a.defined || !b.defined) return fraction(0n, 0n);
  return fraction(BigInt(a.numerator) * BigInt(b.denominator) - BigInt(b.numerator) * BigInt(a.denominator), BigInt(a.denominator) * BigInt(b.denominator));
}
function sign(q) {
  if (!q || !q.defined) return null;
  const n = BigInt(q.numerator);
  return n > 0n ? 1 : n < 0n ? -1 : 0;
}
function ratioLE(a, b) {
  assertOk(a && b && a.defined && b.defined, "independent defined fractions required");
  return BigInt(a.numerator) * BigInt(b.denominator) <= BigInt(b.numerator) * BigInt(a.denominator);
}
function fixedEightHolm(slots) {
  assertOk(Array.isArray(slots) && slots.length === 8, "independent exactly eight formal slots required");
  const rows = slots.map(slot => {
    assertOk(slot && typeof slot.id === "string", "independent slot id required");
    const estimable = slot.estimable !== false;
    return {
      id: slot.id,
      estimable,
      positive: Number(slot.positive),
      negative: Number(slot.negative),
      rawP: estimable ? S.signTestTwoSided(Number(slot.positive), Number(slot.negative)) : fraction(1n, 1n)
    };
  });
  rows.sort((a, b) => {
    const l = BigInt(a.rawP.numerator) * BigInt(b.rawP.denominator);
    const r = BigInt(b.rawP.numerator) * BigInt(a.rawP.denominator);
    return l < r ? -1 : l > r ? 1 : a.id.localeCompare(b.id);
  });
  let open = true;
  for (let i = 0; i < rows.length; i++) {
    const threshold = fraction(1n, BigInt(20 * (8 - i)));
    const rawPass = rows[i].estimable && ratioLE(rows[i].rawP, threshold);
    rows[i].holmRank = i + 1;
    rows[i].holmThreshold = threshold;
    rows[i].holmPass = open && rawPass;
    if (!rawPass) open = false;
  }
  rows.sort((a, b) => a.id.localeCompare(b.id));
  return { familySize: 8, familyAlpha: fraction(1n, 20n), slots: rows };
}

module.exports = {
  STUDY_ID, C1, C6, P1, P2, RF1, RF2,
  canonical, digest, policyForSeed, familyForSeed, domainId, openingPrefix,
  replaySource, endpointPair, fraction, subtract, sign, fixedEightHolm,
  stateKey: L.stateKey, moveKey: L.moveKey, preflight: L.preflightContinuous
};
