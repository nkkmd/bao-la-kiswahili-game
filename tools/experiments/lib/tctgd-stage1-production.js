"use strict";

const U = require("./lgtgmiv-stage1-production.js");
const M = require("./tctgd-production.js");

function need(x, message) { if (!x) throw new Error(message); }
function clone(x) { return JSON.parse(JSON.stringify(x)); }
function rng(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let n = value;
    n = Math.imul(n ^ (n >>> 15), n | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}
function legal(E, state) {
  if (state.winner !== null) return [];
  const rows = E.moveVariants(state).map(move => ({ move, key: U.moveKey(move) }));
  rows.sort((a, b) => a.key.localeCompare(b.key));
  need(rows.length > 0, "nonterminal state has zero legal moves");
  return rows;
}
function descriptor(seed, ply, state, path) {
  return {
    phase: state.phase,
    sourceSeed: seed,
    selectedPly: ply,
    rootRawSha256: U.stateKey(state),
    sourceTrajectorySha256: U.digest(path.join("\n")),
    openingPrefixSha256: U.digest(path.slice(0, 16).join("\n")),
    openingPrefixLength: Math.min(16, path.length),
    rootState: clone(state)
  };
}
function collectIdentityObjects(value, sets) {
  if (!value || typeof value !== "object") return;
  if (typeof value.rootRawSha256 === "string") sets.root.add(value.rootRawSha256);
  if (typeof value.sourceTrajectorySha256 === "string") sets.trajectory.add(value.sourceTrajectorySha256);
  if (typeof value.openingPrefixSha256 === "string") sets.prefix.add(value.openingPrefixSha256);
  if (Array.isArray(value)) for (const x of value) collectIdentityObjects(x, sets);
  else for (const x of Object.values(value)) collectIdentityObjects(x, sets);
}
function makeFirewall(identityDocuments, extra) {
  const sets = { root: new Set(), trajectory: new Set(), prefix: new Set() };
  for (const doc of identityDocuments || []) collectIdentityObjects(doc, sets);
  if (extra) {
    for (const x of extra.root || []) sets.root.add(x);
    for (const x of extra.trajectory || []) sets.trajectory.add(x);
    for (const x of extra.prefix || []) sets.prefix.add(x);
  }
  const digestObject = {
    root: [...sets.root].sort(),
    trajectory: [...sets.trajectory].sort(),
    prefix: [...sets.prefix].sort()
  };
  return { ...sets, digestSha256: U.digest(U.canonical(digestObject)), counts: { root: sets.root.size, trajectory: sets.trajectory.size, prefix: sets.prefix.size } };
}
function sourceOnly(x) {
  return {
    phase: x.phase,
    sourceSeed: x.sourceSeed,
    selectedPly: x.selectedPly,
    rootRawSha256: x.rootRawSha256,
    sourceTrajectorySha256: x.sourceTrajectorySha256,
    openingPrefixSha256: x.openingPrefixSha256,
    openingPrefixLength: x.openingPrefixLength
  };
}
function selectPairedRoots(E, S, identityDocuments, extraFirewall) {
  const fw = makeFirewall(identityDocuments, extraFirewall);
  const pairs = [], rejections = [], selectedRoots = new Set();
  for (let seed = S.seedStart; seed <= S.seedEnd && pairs.length < S.targetPairs; seed++) {
    let state = E.initialState(), random = rng(seed), path = [], namua = null, mtaji = null;
    for (let ply = 1; ply <= S.maxSourcePly && state.winner === null; ply++) {
      const moves = legal(E, state);
      const chosen = moves[Math.floor(random() * moves.length)];
      path.push(chosen.key);
      state = E.applyMove(state, chosen.move).state;
      need(state.reason !== "relay-limit", `relay-limit ${seed}/${ply}`);
      if (ply === S.namuaPly && state.winner === null && state.phase === "namua") namua = descriptor(seed, ply, state, path);
      if (mtaji === null && ply >= S.mtajiMinPly && state.winner === null && state.phase === "mtaji") mtaji = descriptor(seed, ply, state, path);
      if (namua && mtaji) break;
    }
    if (!namua || !mtaji) {
      rejections.push({ sourceSeed: seed, reason: "PAIR-INCOMPLETE", namuaPresent: !!namua, mtajiPresent: !!mtaji });
      continue;
    }
    const roots = [namua, mtaji];
    let why = null;
    for (const x of roots) {
      if (fw.root.has(x.rootRawSha256)) { why = "UPSTREAM-RAW"; break; }
      if (fw.trajectory.has(x.sourceTrajectorySha256)) { why = "UPSTREAM-TRAJECTORY"; break; }
      if (fw.prefix.has(x.openingPrefixSha256)) { why = "UPSTREAM-PREFIX"; break; }
      if (selectedRoots.has(x.rootRawSha256)) { why = "WITHIN-STAGE-RAW-DUPLICATE"; break; }
    }
    if (!why && namua.rootRawSha256 === mtaji.rootRawSha256) why = "WITHIN-PAIR-RAW-DUPLICATE";
    if (why) {
      rejections.push({ sourceSeed: seed, reason: why, namua: sourceOnly(namua), mtaji: sourceOnly(mtaji) });
      continue;
    }
    selectedRoots.add(namua.rootRawSha256);
    selectedRoots.add(mtaji.rootRawSha256);
    pairs.push({ pairId: `seed-${seed}`, sourceSeed: seed, namua, mtaji });
  }
  return {
    pairs,
    rejections,
    populationComplete: pairs.length === S.targetPairs,
    selectedPairCount: pairs.length,
    selectedRootCount: pairs.length * 2,
    firewallDigestSha256: fw.digestSha256,
    firewallCounts: fw.counts
  };
}

module.exports = {
  STUDY_ID: M.STUDY_ID,
  HORIZON: M.HORIZON,
  CANDIDATES: M.CANDIDATES,
  sourceOnly,
  makeFirewall,
  selectPairedRoots,
  measureRoot: M.measureRoot,
  comparePair: M.comparePair,
  summarizeDevelopment: M.summarizeDevelopment,
  canonical: U.canonical,
  digest: U.digest
};
