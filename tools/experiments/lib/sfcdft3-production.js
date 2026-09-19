"use strict";

const crypto = require("node:crypto");
const L = require("./lgttci-compatibility-production.js");
const S = require("./sfcdf-production.js");

const STUDY_ID = "SFCDFT-STUDY3";
const C1 = "SFCDF-C1-UNIT-WIDTH-OCCUPANCY-FRACTION";
const C6 = "SFCDF-C6-CUMULATIVE-TREE-RAW-RATIO";
const P1 = L.P1;
const P2 = L.P2;
const RF1 = L.RF1;
const RF2 = L.RF2;

function need(x, message) { if (!x) throw new Error(message); }
function copy(x) { return JSON.parse(JSON.stringify(x)); }
function sha256Text(x) { return crypto.createHash("sha256").update(String(x), "utf8").digest("hex"); }
function canonical(x) { return L.stable(x); }
function digest(x) { return sha256Text(typeof x === "string" ? x : canonical(x)); }

function policyForSeed(seed) {
  need(Number.isInteger(seed), "seed must be integer");
  return seed % 2 === 1 ? P1 : P2;
}

function familyForSeed(stageId, seed) {
  need(typeof stageId === "string" && stageId.length > 0, "stageId required");
  need(Number.isInteger(seed), "seed must be integer");
  const byte = Number.parseInt(sha256Text(`${stageId}|RF|${seed}`).slice(0, 2), 16);
  return byte % 2 === 0 ? RF1 : RF2;
}

function domainId(policyId, familyId) {
  if (policyId === P1 && familyId === RF1) return "SFCDFT3-D1-P1-RF1";
  if (policyId === P1 && familyId === RF2) return "SFCDFT3-D2-P1-RF2";
  if (policyId === P2 && familyId === RF1) return "SFCDFT3-D3-P2-RF1";
  if (policyId === P2 && familyId === RF2) return "SFCDFT3-D4-P2-RF2";
  throw new Error(`unknown policy/family ${policyId}/${familyId}`);
}

function openingPrefix(moveKeys, pairComplete) {
  need(Array.isArray(moveKeys), "moveKeys array required");
  if (moveKeys.length < 16) {
    need(!pairComplete, "complete candidate requires at least 16 moves");
    return {
      openingPrefixAvailable: false,
      openingPrefixLength: moveKeys.length,
      openingPrefixSha256: null
    };
  }
  return {
    openingPrefixAvailable: true,
    openingPrefixLength: 16,
    openingPrefixSha256: sha256Text(moveKeys.slice(0, 16).join("\n"))
  };
}

function emptyAnchors(familyId) {
  return { familyId, namua: null, mtaji: null, complete: false };
}

function updateAnchors(anchors, row) {
  if (!row || row.terminal) return anchors;
  if (anchors.familyId === RF1) {
    if (!anchors.namua && row.ply === 20 && row.phase === "namua") anchors.namua = copy(row);
    if (!anchors.mtaji && row.ply >= 40 && row.phase === "mtaji") anchors.mtaji = copy(row);
  } else if (anchors.familyId === RF2) {
    if (!anchors.namua && row.ply === 28 && row.phase === "namua") anchors.namua = copy(row);
    if (!anchors.mtaji && row.ply === 52 && row.phase === "mtaji") anchors.mtaji = copy(row);
  } else {
    throw new Error(`unknown root family ${anchors.familyId}`);
  }
  anchors.complete = Boolean(anchors.namua && anchors.mtaji);
  return anchors;
}

function replaySource(E, stageId, seed, maxPly = 240, options = {}) {
  need(E && typeof E.initialState === "function" && typeof E.applyMove === "function", "engine contract unavailable");
  need(Number.isInteger(seed), "seed must be integer");
  need(Number.isInteger(maxPly) && maxPly > 0, "maxPly must be positive integer");
  const policyId = policyForSeed(seed);
  const familyId = familyForSeed(stageId, seed);
  const random = L.rng(seed);
  const applySelectedMove = typeof options.applySelectedMove === "function"
    ? options.applySelectedMove
    : (state, move, context) => E.applyMove(state, move, context?.recording);

  let state = E.initialState();
  const rows = [];
  const moveKeys = [];
  const anchors = emptyAnchors(familyId);
  let stopReason = null;
  let engineGuard = null;

  for (let ply = 1; ply <= maxPly && state.winner === null; ply += 1) {
    const selected = L.chooseMove(E, state, policyId, random());
    moveKeys.push(selected.moveKey);
    const applied = applySelectedMove(state, copy(selected.move), { ply, seed, policyId, familyId, recording: { snapshots: false } });
    need(applied && applied.state, `applySelectedMove state missing ply=${ply}`);
    state = applied.state;

    if (state.reason === "relay-limit") {
      stopReason = "ENGINE-GUARD";
      engineGuard = { kind: "relay-limit", ply };
      break;
    }

    const terminal = state.winner !== null;
    const row = {
      ply,
      phase: state.phase,
      terminal,
      rootLegalWidth: terminal ? 0 : E.moveVariants(state).length,
      rawStateSha256: L.stateKey(state),
      state: copy(state)
    };
    rows.push(row);
    updateAnchors(anchors, row);

    if (anchors.complete) {
      stopReason = "PAIR-COMPLETE";
      break;
    }
    if (terminal) {
      stopReason = "NATURAL-TERMINAL";
      break;
    }
  }

  if (stopReason === null) stopReason = "MAX-SOURCE-PLY";

  const pairComplete = anchors.complete;
  const prefix = openingPrefix(moveKeys, pairComplete);
  const candidateStatus = pairComplete
    ? "CANDIDATE-PAIR-COMPLETE"
    : stopReason === "ENGINE-GUARD"
      ? "NO-CANDIDATE-ENGINE-GUARD-CENSORING"
      : "NO-CANDIDATE-ROOT-SHORTAGE";
  if (pairComplete) {
    need(prefix.openingPrefixAvailable === true && prefix.openingPrefixLength === 16 && typeof prefix.openingPrefixSha256 === "string", "complete candidate requires first16 prefix");
    need(stopReason === "PAIR-COMPLETE", "complete pair must stop immediately");
    const latestAnchorPly = Math.max(anchors.namua.ply, anchors.mtaji.ply);
    need(moveKeys.length === latestAnchorPly, "post-candidate continuation detected");
  }
  if (candidateStatus === "NO-CANDIDATE-ENGINE-GUARD-CENSORING") {
    need(engineGuard && engineGuard.kind === "relay-limit", "engine guard metadata absent");
    need(!pairComplete, "engine guard censoring cannot contain complete pair");
  }

  return {
    studyId: STUDY_ID,
    stageId,
    seed,
    policyId,
    familyId,
    domainId: domainId(policyId, familyId),
    candidateStatus,
    pairComplete,
    stopReason,
    engineGuard,
    scientificTerminal: stopReason === "NATURAL-TERMINAL",
    engineWinnerPresentAtStop: state.winner !== null,
    postCandidateContinuationCount: 0,
    sourceTrajectorySha256: sha256Text(moveKeys.join("\n")),
    ...prefix,
    moveCount: moveKeys.length,
    anchors: copy(anchors),
    replay: {
      policyId,
      seed,
      moveKeys: copy(moveKeys),
      rows: copy(rows),
      trajectorySha256: sha256Text(moveKeys.join("\n")),
      stopReason,
      engineGuard: copy(engineGuard),
      scientificTerminal: stopReason === "NATURAL-TERMINAL"
    }
  };
}

function endpointPair(E, rootRow, sourceIdentity) {
  need(rootRow && rootRow.state && Number.isInteger(rootRow.ply), "root row required");
  need(sourceIdentity && Number.isInteger(sourceIdentity.seed), "source identity seed required");
  need(typeof sourceIdentity.sourceTrajectorySha256 === "string", "source trajectory identity required");
  need(sourceIdentity.candidateStatus === "CANDIDATE-PAIR-COMPLETE", "candidate source required");
  need(sourceIdentity.openingPrefixAvailable === true && sourceIdentity.openingPrefixLength === 16, "candidate opening prefix required");
  const source = {
    phase: rootRow.phase,
    sourceSeed: sourceIdentity.seed,
    selectedPly: rootRow.ply,
    rootRawSha256: rootRow.rawStateSha256,
    sourceTrajectorySha256: sourceIdentity.sourceTrajectorySha256,
    openingPrefixSha256: sourceIdentity.openingPrefixSha256,
    openingPrefixLength: sourceIdentity.openingPrefixLength,
    rootState: copy(rootRow.state)
  };
  const measured = S.measureRoot(E, source);
  const c1 = measured.sfcdf.endpoints[C1];
  const c6 = measured.sfcdf.endpoints[C6];
  need(c1 && c6, "C1/C6 endpoint missing");
  return {
    rootRawSha256: rootRow.rawStateSha256,
    ply: rootRow.ply,
    phase: rootRow.phase,
    endpoints: { [C1]: c1, [C6]: c6 },
    measurementDigest: digest(measured)
  };
}

function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b !== 0n) [a, b] = [b, a % b]; return a; }
function fraction(n, d) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d) || 1n;
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
function leq(a, b) {
  need(a && b && a.defined && b.defined, "defined fractions required");
  return BigInt(a.numerator) * BigInt(b.denominator) <= BigInt(b.numerator) * BigInt(a.denominator);
}
function fixedEightHolm(slots) {
  need(Array.isArray(slots) && slots.length === 8, "exactly eight formal slots required");
  const rows = slots.map((slot) => {
    need(slot && typeof slot.id === "string", "slot id required");
    const estimable = slot.estimable !== false;
    const rawP = estimable ? S.signTestTwoSided(Number(slot.positive), Number(slot.negative)) : fraction(1n, 1n);
    return { id: slot.id, estimable, positive: Number(slot.positive), negative: Number(slot.negative), rawP };
  });
  rows.sort((a, b) => {
    const l = BigInt(a.rawP.numerator) * BigInt(b.rawP.denominator);
    const r = BigInt(b.rawP.numerator) * BigInt(a.rawP.denominator);
    return l < r ? -1 : l > r ? 1 : a.id.localeCompare(b.id);
  });
  let open = true;
  for (let i = 0; i < rows.length; i += 1) {
    const threshold = fraction(1n, BigInt(20 * (8 - i)));
    const rawPass = rows[i].estimable && leq(rows[i].rawP, threshold);
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
