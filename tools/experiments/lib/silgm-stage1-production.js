"use strict";

const E = require("../../../public/engine.js");
const Core = require("./silgm-production.js");
const U = require("./lgtgmiv-stage1-production.js");

const HORIZON = 5;

function need(x, m) { if (!x) throw new Error(m); }
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
function legal(state) {
  if (state.winner !== null) return [];
  return E.moveVariants(state).map(move => ({ move, key: Core.moveKey(move) }))
    .sort((a, b) => a.key.localeCompare(b.key));
}
function phaseFor(fullTrajectorySha256, spec) {
  const d = Core.digest(`${spec.phaseAssignment.salt}|${fullTrajectorySha256}`);
  const word = Number.parseInt(d.slice(0, 8), 16) >>> 0;
  return word % 2 === 0 ? spec.phaseAssignment.even : spec.phaseAssignment.odd;
}
function selectionRank(fullTrajectorySha256, raw, ply, spec) {
  return Core.digest(`${spec.withinTrajectoryRootSelection.rankSalt}|${fullTrajectorySha256}|${raw}|${ply}`);
}
function replaySeed(seed, spec) {
  let state = E.initialState();
  const random = rng(seed);
  const path = [];
  const observations = [];
  let relayLimit = false;
  for (let ply = 1; ply <= spec.maxSourcePly && state.winner === null; ply += 1) {
    const choices = legal(state);
    need(choices.length > 0, `nonterminal zero legal moves seed=${seed} ply=${ply}`);
    const picked = choices[Math.floor(random() * choices.length)];
    const next = E.applyMove(state, picked.move).state;
    const raw = Core.stateKey(next);
    path.push({ moveKey: picked.key, afterRawStateSha256: raw });
    if (next.reason === "relay-limit") { relayLimit = true; state = next; break; }
    state = next;
    if (ply >= spec.minimumSelectablePly && state.winner === null) {
      const width = E.moveVariants(state).length;
      if (width >= 2) observations.push({ ply, phase: state.phase, rawStateSha256: raw, legalMoveCount: width, state: clone(state) });
    }
  }
  const fullTrajectorySha256 = Core.digest(path);
  const openingPrefixSha256 = Core.digest(path.slice(0, 16).map(x => x.moveKey));
  return { seed, relayLimit, fullTrajectorySha256, openingPrefixSha256, openingPrefixLength: Math.min(16, path.length), trajectoryLength: path.length, observations };
}
function buildFirewall(base, manifest, brmgiResult) {
  need(manifest && manifest.scientificOutcomeFieldsRetained === false, "SILGM firewall scientific fields retained");
  need(manifest.g202ScientificRowsRetained === false, "G2-02 scientific rows retained");
  need(manifest.g306SelectionMismatchDiagnosticsRetained === false, "G3-06 diagnostics retained");
  need(base && base.scientificOutcomeFieldsRetained === false, "base firewall scientific fields retained");
  need(base.g303DiagnosticScientificFieldsRetained === false, "base G3-03 diagnostics retained");
  need(base.g304ScientificOutcomeFieldsRetained === false, "base G3-04 outcomes retained");
  need(base.g305PartialScientificFieldsRetained === false, "base G3-05 scientific fields retained");
  need(brmgiResult && brmgiResult.stageDisposition === "TECHNICAL-INVALID", "BRMGI canonical disposition mismatch");
  need(Array.isArray(brmgiResult.formalPromotedCandidateSet) && brmgiResult.formalPromotedCandidateSet.length === 0, "BRMGI promoted set nonempty");
  need(manifest.brmgiContribution.validMaterializedSelectedPopulationIdentitySetAvailable === false, "unexpected BRMGI valid identity set");
  return {
    raw: new Set(base.identitySets.rootRawSha256 || []),
    trajectory: new Set(base.identitySets.sourceTrajectorySha256 || []),
    prefix: new Set(base.identitySets.openingPrefixSha256 || []),
  };
}
function trajectoryCandidate(game, spec, firewall) {
  if (game.relayLimit) return { rejected: "SOURCE-RELAY-LIMIT", seed: game.seed };
  if (firewall.trajectory.has(game.fullTrajectorySha256)) return { rejected: "UPSTREAM-TRAJECTORY", seed: game.seed };
  if (firewall.prefix.has(game.openingPrefixSha256)) return { rejected: "UPSTREAM-PREFIX", seed: game.seed };
  const assignedPhase = phaseFor(game.fullTrajectorySha256, spec);
  const eligible = game.observations.filter(x => x.phase === assignedPhase).map(x => ({ ...x, selectionRank: selectionRank(game.fullTrajectorySha256, x.rawStateSha256, x.ply, spec) }));
  if (!eligible.length) return { rejected: "ASSIGNED-PHASE-UNAVAILABLE", seed: game.seed, assignedPhase };
  eligible.sort((a, b) => a.selectionRank.localeCompare(b.selectionRank) || a.rawStateSha256.localeCompare(b.rawStateSha256) || a.ply - b.ply);
  const x = eligible[0];
  if (firewall.raw.has(x.rawStateSha256)) return { rejected: "UPSTREAM-RAW", seed: game.seed, assignedPhase, selectedRaw: x.rawStateSha256 };
  return {
    seed: game.seed,
    assignedPhase,
    phase: x.phase,
    selectedPly: x.ply,
    selectionRank: x.selectionRank,
    rootRawSha256: x.rawStateSha256,
    fullTrajectorySha256: game.fullTrajectorySha256,
    openingPrefixSha256: game.openingPrefixSha256,
    openingPrefixLength: game.openingPrefixLength,
    trajectoryLength: game.trajectoryLength,
    legalMoveCount: x.legalMoveCount,
    state: x.state,
  };
}
function betterDuplicate(a, b) {
  const c = a.selectionRank.localeCompare(b.selectionRank);
  if (c) return c < 0 ? a : b;
  const t = a.fullTrajectorySha256.localeCompare(b.fullTrajectorySha256);
  if (t) return t < 0 ? a : b;
  if (a.seed !== b.seed) return a.seed < b.seed ? a : b;
  if (a.selectedPly !== b.selectedPly) return a.selectedPly < b.selectedPly ? a : b;
  return a.rootRawSha256 <= b.rootRawSha256 ? a : b;
}
function publicCandidate(x) {
  return {
    seed: x.seed, assignedPhase: x.assignedPhase, phase: x.phase, selectedPly: x.selectedPly,
    selectionRank: x.selectionRank, rootRawSha256: x.rootRawSha256,
    fullTrajectorySha256: x.fullTrajectorySha256, openingPrefixSha256: x.openingPrefixSha256,
    openingPrefixLength: x.openingPrefixLength, trajectoryLength: x.trajectoryLength, legalMoveCount: x.legalMoveCount,
  };
}
function selectPopulation(spec, baseFirewall, silgmFirewall, brmgiResult) {
  const firewall = buildFirewall(baseFirewall, silgmFirewall, brmgiResult);
  const preliminary = [], rejections = [];
  for (let seed = spec.seedStart; seed <= spec.seedEnd; seed += 1) {
    const game = replaySeed(seed, spec);
    const c = trajectoryCandidate(game, spec, firewall);
    if (c.rejected) rejections.push(c); else preliminary.push(c);
  }
  const byRaw = new Map();
  for (const c of preliminary) byRaw.set(c.rootRawSha256, byRaw.has(c.rootRawSha256) ? betterDuplicate(byRaw.get(c.rootRawSha256), c) : c);
  const retained = [...byRaw.values()];
  const order = (a, b) => a.selectionRank.localeCompare(b.selectionRank)
    || a.fullTrajectorySha256.localeCompare(b.fullTrajectorySha256)
    || a.seed - b.seed || a.selectedPly - b.selectedPly || a.rootRawSha256.localeCompare(b.rootRawSha256);
  const namua = retained.filter(x => x.phase === "namua").sort(order).slice(0, spec.targetRoots.namua);
  const mtaji = retained.filter(x => x.phase === "mtaji").sort(order).slice(0, spec.targetRoots.mtaji);
  const selected = [...namua, ...mtaji].sort((a, b) => (a.phase === "namua" ? 0 : 1) - (b.phase === "namua" ? 0 : 1) || order(a, b));
  const selectionCore = {
    selected: selected.map(publicCandidate),
    selectedCounts: { namua: namua.length, mtaji: mtaji.length, total: selected.length },
    populationComplete: namua.length === spec.targetRoots.namua && mtaji.length === spec.targetRoots.mtaji,
    preliminaryCount: preliminary.length,
    deduplicatedCount: retained.length,
    rejectionCounts: rejections.reduce((o, x) => { o[x.rejected] = (o[x.rejected] || 0) + 1; return o; }, {}),
  };
  return { selected, selectionCore, selectionCoreSha256: Core.digest(selectionCore) };
}
function sourceDescriptor(c) {
  return {
    phase: c.phase,
    sourceSeed: c.seed,
    selectedPly: c.selectedPly,
    rootRawSha256: c.rootRawSha256,
    sourceTrajectorySha256: c.fullTrajectorySha256,
    openingPrefixSha256: c.openingPrefixSha256,
    openingPrefixLength: c.openingPrefixLength,
    rootState: clone(c.state),
  };
}
function measureSelected(c, spec) {
  const source = sourceDescriptor(c);
  const upstream = U.measureRoot(E, source, HORIZON);
  const geometry = Core.deriveGeometry(upstream);
  const conditions = {};
  for (const condition of spec.searchConditions) conditions[condition.id] = Core.conditionResult(c.state, condition);
  const allSearchEstimable = Object.values(conditions).every(x => x.estimable === true);
  const endpointsByContrast = {};
  if (allSearchEstimable) for (const contrast of spec.searchContrasts) endpointsByContrast[contrast.contrastId] = Core.endpoints(conditions[contrast.a], conditions[contrast.b]);
  const row = {
    source: publicCandidate(c), geometry: geometry.metrics, conditions, endpointsByContrast, allSearchEstimable,
    upstreamRootReconstructionCoreSha256: geometry.upstreamRootReconstructionCoreSha256,
    upstreamFamilyCoreSha256: geometry.upstreamFamilyCoreSha256,
  };
  return { row, rowSha256: Core.digest(row) };
}
function signQ(q) { const n = BigInt(q.numerator); return n > 0n ? 1 : n < 0n ? -1 : 0; }
function changedCounts(rows, contrastId, endpointId) {
  let changed = 0; for (const r of rows) changed += r.endpointsByContrast[contrastId][endpointId];
  return { changed, unchanged: rows.length - changed };
}
function summarizeDevelopment(measurements, spec) {
  const byPhase = { namua: measurements.filter(x => x.source.phase === "namua"), mtaji: measurements.filter(x => x.source.phase === "mtaji") };
  const thresholds = { namua: {}, mtaji: {} };
  for (const phase of ["namua", "mtaji"]) for (const metricId of Core.GEOMETRY_IDS) thresholds[phase][metricId] = Core.midpoint(byPhase[phase].map(x => x.geometry[metricId]));
  const slots = [], promotedCandidates = [];
  for (const contrast of spec.searchContrasts) for (const endpointId of Core.ENDPOINT_IDS) {
    const candidates = [];
    for (const metricId of Core.GEOMETRY_IDS) {
      const phase = {};
      let support = true;
      for (const p of ["namua", "mtaji"]) {
        const counts = changedCounts(byPhase[p], contrast.contrastId, endpointId);
        const rd = Core.riskDifference(byPhase[p].map(x => ({ geometry: x.geometry, endpoints: x.endpointsByContrast[contrast.contrastId] })), metricId, thresholds[p][metricId], endpointId);
        phase[p] = { ...counts, riskDifference: rd };
        support = support && rd.defined && rd.highN >= spec.developmentPromotion.minimumSupportPerPhase.high && rd.lowN >= spec.developmentPromotion.minimumSupportPerPhase.low
          && counts.changed >= spec.developmentPromotion.minimumSupportPerPhase.changed && counts.unchanged >= spec.developmentPromotion.minimumSupportPerPhase.unchanged;
      }
      const sN = phase.namua.riskDifference.defined ? signQ(phase.namua.riskDifference.value) : 0;
      const sM = phase.mtaji.riskDifference.defined ? signQ(phase.mtaji.riskDifference.value) : 0;
      const direction = support && sN !== 0 && sN === sM ? (sN > 0 ? "HIGHER-IN-HIGH" : "LOWER-IN-HIGH") : null;
      const strength = direction ? Core.addQ(Core.absQ(phase.namua.riskDifference.value), Core.absQ(phase.mtaji.riskDifference.value)) : Core.fraction(0n, 1n);
      candidates.push({ metricId, thresholds: { namua: thresholds.namua[metricId], mtaji: thresholds.mtaji[metricId] }, phase, supportPass: support, direction, strength });
    }
    const eligible = candidates.filter(x => x.direction !== null).sort((a, b) => {
      const c = Core.cmpQ(b.strength, a.strength); return c || a.metricId.localeCompare(b.metricId);
    });
    const selected = eligible.length ? eligible[0] : null;
    const slot = { contrastId: contrast.contrastId, endpointId, candidates, selectedMetricId: selected ? selected.metricId : null, direction: selected ? selected.direction : null };
    slots.push(slot);
    if (selected) promotedCandidates.push({ contrastId: contrast.contrastId, endpointId, metricId: selected.metricId, thresholds: selected.thresholds, direction: selected.direction, strength: selected.strength });
  }
  promotedCandidates.sort((a, b) => a.contrastId.localeCompare(b.contrastId) || a.endpointId.localeCompare(b.endpointId));
  const core = { thresholds, slots, promotedCandidates };
  return { ...core, developmentCoreSha256: Core.digest(core) };
}

module.exports = { replaySeed, selectPopulation, measureSelected, summarizeDevelopment, publicCandidate, stable: Core.stable, digest: Core.digest };
