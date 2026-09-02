"use strict";

const V = require("./lgtgmiv-stage1-independent.js");
const G = require("./tctgd-independent.js");

function assert(x, message) { if (!x) throw new Error(message); }
function copyState(x) { return structuredClone(x); }
function randomStream(seed) {
  let x = seed >>> 0;
  return function next() {
    x += 0x6D2B79F5;
    let t = x;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function orderedMoves(engine, position) {
  if (position.winner !== null) return [];
  const out = engine.moveVariants(position).map(m => [V.moveKey(m), m]);
  out.sort((a, b) => a[0].localeCompare(b[0]));
  assert(out.length !== 0, "independent selector found zero moves");
  return out;
}
function identity(seed, ply, position, moveKeys) {
  return {
    phase: position.phase,
    sourceSeed: seed,
    selectedPly: ply,
    rootRawSha256: V.stateKey(position),
    sourceTrajectorySha256: V.digest(moveKeys.join("\n")),
    openingPrefixSha256: V.digest(moveKeys.slice(0, 16).join("\n")),
    openingPrefixLength: Math.min(16, moveKeys.length),
    rootState: copyState(position)
  };
}
function scan(value, root, trajectory, prefix) {
  if (value === null || typeof value !== "object") return;
  if (typeof value.rootRawSha256 === "string") root.add(value.rootRawSha256);
  if (typeof value.sourceTrajectorySha256 === "string") trajectory.add(value.sourceTrajectorySha256);
  if (typeof value.openingPrefixSha256 === "string") prefix.add(value.openingPrefixSha256);
  const children = Array.isArray(value) ? value : Object.values(value);
  for (const child of children) scan(child, root, trajectory, prefix);
}
function firewall(documents, extra) {
  const root = new Set(), trajectory = new Set(), prefix = new Set();
  for (const document of documents || []) scan(document, root, trajectory, prefix);
  if (extra) {
    for (const x of extra.root || []) root.add(x);
    for (const x of extra.trajectory || []) trajectory.add(x);
    for (const x of extra.prefix || []) prefix.add(x);
  }
  const canonicalRows = { root: [...root].sort(), trajectory: [...trajectory].sort(), prefix: [...prefix].sort() };
  return {
    root, trajectory, prefix,
    digestSha256: V.digest(V.canonical(canonicalRows)),
    counts: { root: root.size, trajectory: trajectory.size, prefix: prefix.size }
  };
}
function publicSource(row) {
  const { phase, sourceSeed, selectedPly, rootRawSha256, sourceTrajectorySha256, openingPrefixSha256, openingPrefixLength } = row;
  return { phase, sourceSeed, selectedPly, rootRawSha256, sourceTrajectorySha256, openingPrefixSha256, openingPrefixLength };
}
function selectPairedRoots(engine, spec, identityDocuments, extraFirewall) {
  const blocked = firewall(identityDocuments, extraFirewall);
  const chosen = [], rejected = [], rawSeen = new Set();
  let seed = spec.seedStart;
  while (seed <= spec.seedEnd && chosen.length < spec.targetPairs) {
    let position = engine.initialState();
    const nextRandom = randomStream(seed), path = [];
    let n = null, m = null, ply = 0;
    while (++ply <= spec.maxSourcePly && position.winner === null) {
      const options = orderedMoves(engine, position);
      const selected = options[Math.floor(nextRandom() * options.length)];
      path.push(selected[0]);
      position = engine.applyMove(position, selected[1]).state;
      assert(position.reason !== "relay-limit", `independent relay-limit ${seed}/${ply}`);
      if (ply === spec.namuaPly && position.winner === null && position.phase === "namua") n = identity(seed, ply, position, path);
      if (m === null && ply >= spec.mtajiMinPly && position.winner === null && position.phase === "mtaji") m = identity(seed, ply, position, path);
      if (n !== null && m !== null) break;
    }
    if (n === null || m === null) {
      rejected.push({ sourceSeed: seed, reason: "PAIR-INCOMPLETE", namuaPresent: n !== null, mtajiPresent: m !== null });
      seed++;
      continue;
    }
    const rows = [n, m];
    let reason = null;
    for (const row of rows) {
      if (blocked.root.has(row.rootRawSha256)) { reason = "UPSTREAM-RAW"; break; }
      if (blocked.trajectory.has(row.sourceTrajectorySha256)) { reason = "UPSTREAM-TRAJECTORY"; break; }
      if (blocked.prefix.has(row.openingPrefixSha256)) { reason = "UPSTREAM-PREFIX"; break; }
      if (rawSeen.has(row.rootRawSha256)) { reason = "WITHIN-STAGE-RAW-DUPLICATE"; break; }
    }
    if (reason === null && n.rootRawSha256 === m.rootRawSha256) reason = "WITHIN-PAIR-RAW-DUPLICATE";
    if (reason !== null) {
      rejected.push({ sourceSeed: seed, reason, namua: publicSource(n), mtaji: publicSource(m) });
      seed++;
      continue;
    }
    rawSeen.add(n.rootRawSha256);
    rawSeen.add(m.rootRawSha256);
    chosen.push({ pairId: `seed-${seed}`, sourceSeed: seed, namua: n, mtaji: m });
    seed++;
  }
  return {
    pairs: chosen,
    rejections: rejected,
    populationComplete: chosen.length === spec.targetPairs,
    selectedPairCount: chosen.length,
    selectedRootCount: chosen.length * 2,
    firewallDigestSha256: blocked.digestSha256,
    firewallCounts: blocked.counts
  };
}

module.exports = {
  STUDY_ID: G.STUDY_ID,
  HORIZON: G.HORIZON,
  CANDIDATES: G.CANDIDATES,
  sourceOnly: publicSource,
  makeFirewall: firewall,
  selectPairedRoots,
  measureRoot: G.measureRoot,
  comparePair: G.comparePair,
  summarizeDevelopment: G.summarizeDevelopment,
  canonical: V.canonical,
  digest: V.digest
};
