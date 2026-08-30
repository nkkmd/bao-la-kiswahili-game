"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const { seededRandom } = require("../../benchmark.js");
const SRDR = require("./search-reliability-decision-robustness.js");
const N = require("./psrre-stage0-production.js");
const C03 = require("./tmgc-stage0-production.js");
const CAND = require("../../../doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json")
  .formalCandidates.find((x) => x.candidateId === "TM-S2-C03");

const SEMANTICS = "psrre-stage1-production/v1";
const FAMILY_IDS = Object.freeze([
  "RF-A-ROBUST-PCA-WARD",
  "RF-B-ROBUST-PCA-PAM",
  "RF-C-DIRECT-ROBUST-PAM",
]);

function ensure(x, m) { if (!x) throw new Error(m); }
function clone(x) { return JSON.parse(JSON.stringify(x)); }
function stable(x) { return N.stableStringify(x); }
function sha(s) { return crypto.createHash("sha256").update(String(s), "utf8").digest("hex"); }
function hash(x) { return sha(stable(x)); }
function u32(s) { return parseInt(sha(s).slice(0, 8), 16) >>> 0; }
function key(m) { return AI.moveKey(m); }
function moves(s) { return E.moveVariants(s).slice().sort((a, b) => key(a).localeCompare(key(b))); }
function raw(s) { return N.rawIdentityHash(s); }
function bhex(x) { return N.binary64Hex(x); }
function policy(i) { return ["UNIFORM", "CAPTURE_FIRST", "HIGH_CAPTURE", "LOW_CAPTURE"][i % 4]; }
function captured(s, m) {
  return E.applyMove(s, m).events.filter((e) => e.kind === "capture").reduce((a, e) => a + (e.count || 0), 0);
}
function choose(s, p, rng) {
  const all = moves(s); ensure(all.length, "no source move");
  let pool = all;
  if (p === "CAPTURE_FIRST") {
    const c = all.filter((m) => m.type === "capture"); if (c.length) pool = c;
  } else if (p === "HIGH_CAPTURE" || p === "LOW_CAPTURE") {
    const rows = all.map((m) => [m, captured(s, m)]);
    const v = p === "HIGH_CAPTURE" ? Math.max(...rows.map((x) => x[1])) : Math.min(...rows.map((x) => x[1]));
    pool = rows.filter((x) => x[1] === v).map((x) => x[0]);
  }
  return pool[Math.floor(rng() * pool.length)];
}
function assignedPhase(seed, spec) {
  return u32(`${spec.rootSelection.phaseAssignment.salt}|${seed}`) % 2 === 0 ? "namua" : "mtaji";
}
function rootRank(seed, rawStateKey, ply, spec) {
  return sha(`${spec.rootSelection.withinTrajectoryOccurrence.salt}|${seed}|${rawStateKey}|${ply}`);
}
function stratumRank(c, spec) {
  const q = spec.rootSelection.stratumQuota;
  return sha(`${q.salt}|${c.phase}|${c.sourcePolicy}|${c.trajectoryHash}|${c.openingPrefixHash}|${c.rawStateKey}|${c.seed}|${c.ply}`);
}
function runGame(spec, i, opt = {}) {
  const seed = (opt.seedStart ?? spec.seedBlock.seedStart) + i;
  const rng = seededRandom(seed >>> 0);
  const sourcePolicy = policy(i);
  const phase = assignedPhase(seed, spec);
  const maxPly = opt.maxPly ?? spec.sourceGeneration.maxPly;
  const opening = spec.sourceGeneration.openingPlies;
  let state = E.initialState(), candidate = null;
  const states = [], prefix = [];
  for (let ply = 0; ply <= maxPly; ply += 1) {
    const rawStateKey = raw(state);
    const legal = state.winner === null ? moves(state) : [];
    states.push(rawStateKey);
    if (state.winner === null && ply >= spec.rootSelection.minimumPlyInclusive && legal.length >= spec.rootSelection.minimumLegalMoveCount && state.phase === phase) {
      const rank = rootRank(seed, rawStateKey, ply, spec);
      const row = { gameIndex: i, seed, sourcePolicy, phase, ply, legalMoveCount: legal.length, rawStateKey, selectionRank: rank, root: clone(state) };
      if (!candidate || rank < candidate.selectionRank || (rank === candidate.selectionRank && rawStateKey < candidate.rawStateKey)) candidate = row;
    }
    if (state.winner !== null || ply === maxPly) break;
    let move;
    if (ply < opening) { move = legal[Math.floor(rng() * legal.length)]; prefix.push(key(move)); }
    else move = choose(state, sourcePolicy, rng);
    state = E.applyMove(state, move).state;
  }
  const trajectoryHash = hash({ length: states.length, rawStateKeys: states });
  const openingPrefixHash = hash({ length: prefix.length, moveKeys: prefix });
  if (candidate) { candidate.trajectoryHash = trajectoryHash; candidate.openingPrefixHash = openingPrefixHash; candidate.stratumRank = stratumRank(candidate, spec); }
  return {
    gameSummary: { gameIndex: i, seed, sourcePolicy, assignedPhase: phase, trajectoryHash, openingPrefixHash, terminal: state.winner !== null, winner: state.winner, observedStates: states.length },
    candidate,
  };
}
function generate(spec, opt = {}) {
  const n = opt.games ?? spec.seedBlock.games;
  const out = []; for (let i = 0; i < n; i += 1) out.push(runGame(spec, i, opt)); return out;
}
function select(records, spec, opt = {}) {
  const trajectory = new Map();
  for (const r of records) {
    const old = trajectory.get(r.gameSummary.trajectoryHash);
    if (!old || r.gameSummary.seed < old.gameSummary.seed) trajectory.set(r.gameSummary.trajectoryHash, r);
  }
  const reps = [...trajectory.values()];
  const quota = opt.quotaPerStratum ?? spec.rootSelection.stratumQuota.quotaPerStratum;
  const order = spec.rootSelection.stratumQuota.fixedStratumOrder;
  const usedRaw = new Set(), selected = [];
  for (const stratum of order) {
    const [phase, sourcePolicy] = stratum.split("/");
    const pool = reps.map((r) => r.candidate).filter(Boolean).filter((c) => c.phase === phase && c.sourcePolicy === sourcePolicy)
      .sort((a, b) => a.stratumRank.localeCompare(b.stratumRank) || a.rawStateKey.localeCompare(b.rawStateKey) || a.seed - b.seed);
    let count = 0;
    for (const c of pool) {
      if (usedRaw.has(c.rawStateKey)) continue;
      usedRaw.add(c.rawStateKey); selected.push(c); count += 1; if (count === quota) break;
    }
  }
  selected.sort((a, b) => a.phase.localeCompare(b.phase) || a.sourcePolicy.localeCompare(b.sourcePolicy) || a.stratumRank.localeCompare(b.stratumRank));
  const strata = {};
  for (const s of order) { const [ph, sp] = s.split("/"); strata[s] = selected.filter((x) => x.phase === ph && x.sourcePolicy === sp).length; }
  const opens = new Map(); for (const x of selected) opens.set(x.openingPrefixHash, (opens.get(x.openingPrefixHash) || 0) + 1);
  return {
    generatedGames: records.length,
    uniqueTrajectories: reps.length,
    distinctOpeningPrefixes: new Set(records.map((r) => r.gameSummary.openingPrefixHash)).size,
    selectedRoots: selected.length,
    stratumCounts: strata,
    selectedDistinctOpeningPrefixes: opens.size,
    maximumSingleSelectedOpeningPrefixShare: selected.length ? Math.max(...opens.values()) / selected.length : 1,
    selected,
    selectionHash: hash(selected.map((x) => ({ seed: x.seed, sourcePolicy: x.sourcePolicy, phase: x.phase, ply: x.ply, rawStateKey: x.rawStateKey, trajectoryHash: x.trajectoryHash, openingPrefixHash: x.openingPrefixHash, stratumRank: x.stratumRank }))),
  };
}

function exactSearch(state, depth, q) {
  return SRDR.analyzeExactCondition(state, depth, { evaluationProfile: "bao", quiescenceDepth: q, legalMoveOrdering: "canonical", orderQuiescenceCaptures: false }).result;
}
function jaccard(a, b) {
  const A = new Set(a), B = new Set(b), U = new Set([...A, ...B]); if (!U.size) return 1;
  let n = 0; for (const x of A) if (B.has(x)) n += 1; return n / U.size;
}
function entropy(counts) {
  const ks = Object.keys(counts).sort(); const total = ks.reduce((s, k) => s + counts[k], 0); if (!total) return 0;
  let e = 0; for (const k of ks) if (counts[k]) { const p = counts[k] / total; e += -p * Math.log2(p); } return e;
}
function median(xs) {
  const a = xs.slice().sort((x, y) => x - y), n = a.length; return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2;
}
function replyFeatures(root, d2) {
  const actor = root.player;
  const rootMove = moves(root).find((m) => key(m) === d2.canonicalBestMoveKey); ensure(rootMove, "D2 best move missing");
  const after = E.applyMove(root, rootMove).state;
  if (after.winner !== null) return { count: 0, nonterminalFraction: 0, staticScoreRange: 0 };
  const replies = moves(after); if (!replies.length) return { count: 0, nonterminalFraction: 0, staticScoreRange: 0 };
  let nonterminal = 0; const scores = [];
  for (const r of replies) {
    const post = E.applyMove(after, r).state;
    if (post.winner === null) nonterminal += 1;
    scores.push(AI.evaluateWithProfile(post, actor, "bao"));
  }
  return { count: replies.length, nonterminalFraction: nonterminal / replies.length, staticScoreRange: scores.length < 2 ? 0 : Math.max(...scores) - Math.min(...scores) };
}
function featureValues(sel, dict, q = 1) {
  const root = sel.root, actor = root.player, opp = 1 - actor, legal = moves(root);
  const typeCounts = {}; for (const m of legal) typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
  function pitStats(p) {
    const vals = [...root.pits[p][E.FRONT], ...root.pits[p][E.BACK]];
    return { total: vals.reduce((a, b) => a + b, 0), occupied: vals.filter((x) => x > 0).length, maxPit: Math.max(...vals) };
  }
  const actorPits = pitStats(actor), opponentPits = pitStats(opp);
  const replyWidths = legal.map((m) => { const n = E.applyMove(root, m).state; return n.winner === null ? moves(n).length : 0; });
  const d1 = exactSearch(root, 1, q), d2 = exactSearch(root, 2, q);
  const rp = replyFeatures(root, d2);
  const c03 = C03.analyzeFixture(root, CAND);
  const f = {
    "PSRRE-F01": root.reserve[actor], "PSRRE-F02": root.reserve[opp], "PSRRE-F03": root.pending[actor], "PSRRE-F04": root.pending[opp],
    "PSRRE-F05": root.houseOwned[actor] ? 1 : 0, "PSRRE-F06": root.houseOwned[opp] ? 1 : 0,
    "PSRRE-F07": actorPits.total, "PSRRE-F08": opponentPits.total, "PSRRE-F09": actorPits.occupied, "PSRRE-F10": opponentPits.occupied,
    "PSRRE-F11": actorPits.maxPit, "PSRRE-F12": opponentPits.maxPit,
    "PSRRE-F13": legal.length, "PSRRE-F14": legal.length ? (typeCounts.capture || 0) / legal.length : 0, "PSRRE-F15": legal.length ? (typeCounts.takata || 0) / legal.length : 0,
    "PSRRE-F16": entropy(typeCounts),
    "PSRRE-F17": replyWidths.length ? Math.min(...replyWidths) : 0, "PSRRE-F18": replyWidths.length ? median(replyWidths) : 0,
    "PSRRE-F19": replyWidths.length ? Math.max(...replyWidths) : 0, "PSRRE-F20": replyWidths.length ? Math.max(...replyWidths) - Math.min(...replyWidths) : 0,
    "PSRRE-F21": d1.canonicalBestMoveKey === d2.canonicalBestMoveKey ? 1 : 0, "PSRRE-F22": jaccard(d1.topSetMoveKeys, d2.topSetMoveKeys),
    "PSRRE-F23": Math.abs(d2.bestScore - d1.bestScore),
    "PSRRE-F24": rp.count, "PSRRE-F25": rp.nonterminalFraction, "PSRRE-F26": rp.staticScoreRange,
    "PSRRE-F27": c03.eligible ? 1 : 0, "PSRRE-F28": c03.eligible && c03.structuralSuccess ? 1 : 0,
  };
  const out = {};
  for (const def of dict.features) {
    ensure(Object.prototype.hasOwnProperty.call(f, def.id), `feature missing ${def.id}`);
    const v = f[def.id]; ensure(v !== null && Number.isFinite(v), `invalid feature ${def.id}`); out[def.id] = v;
  }
  return out;
}
function analyzeSelected(sel, dict, q = 1) {
  return { seed: sel.seed, sourcePolicy: sel.sourcePolicy, phase: sel.phase, ply: sel.ply, rawStateKey: sel.rawStateKey, trajectoryHash: sel.trajectoryHash, openingPrefixHash: sel.openingPrefixHash, features: featureValues(sel, dict, q) };
}
function featureIds(dict) { return dict.features.map((f) => f.id); }
function fitScaler(rows, dict) {
  const ordered = rows.slice().sort((a, b) => a.rawStateKey.localeCompare(b.rawStateKey));
  const ids = featureIds(dict), center = [], scale = [], zero = [];
  for (let j = 0; j < ids.length; j += 1) {
    const col = ordered.map((r) => r.features[ids[j]]); const m = median(col), mad = median(col.map((x) => Math.abs(x - m)));
    center.push(m); scale.push(mad); if (mad === 0) zero.push(j);
  }
  return { featureIds: ids, center, scale, centerHex: center.map(bhex), scaleHex: scale.map(bhex), zeroMadFeatureIds: zero.map((j) => ids[j]), nonzeroMadFeatureIds: ids.filter((_, j) => scale[j] !== 0) };
}
function scaleRow(row, scaler) { return scaler.featureIds.map((id, j) => scaler.scale[j] === 0 ? 0 : (row.features[id] - scaler.center[j]) / scaler.scale[j]); }
function projectRow(vector, pca) {
  return pca.loadings.map((loading) => vector.reduce((s, x, j) => s + (x - pca.mean[j]) * loading[j], 0));
}
function sqdist(a, b) { let s = 0; for (let i = 0; i < a.length; i += 1) { const d = a[i] - b[i]; s += d * d; } return s; }
function coordinateRows(rows, familyId, scaler = null, pcaFit = null) {
  const ordered = rows.slice().sort((a, b) => a.rawStateKey.localeCompare(b.rawStateKey));
  const fit = scaler || fitScaler(ordered, { features: ordered[0].featureOrder ? ordered[0].featureOrder.map((id) => ({ id })) : Object.keys(ordered[0].features).sort().map((id) => ({ id })) });
  const scaled = ordered.map((r) => scaleRow(r, fit));
  let pca = pcaFit, coords = scaled;
  if (familyId !== "RF-C-DIRECT-ROBUST-PAM") {
    if (!pca) pca = N.pca(scaled, 8);
    coords = scaled.map((v) => projectRow(v, pca));
  }
  return { ordered, scaler: fit, pca, coords };
}
function distanceMatrix(coords) {
  return coords.map((a) => coords.map((b) => sqdist(a, b)));
}
function assignmentCost(dm, medoids) {
  let total = 0;
  for (let i = 0; i < dm.length; i += 1) total += Math.min(...medoids.map((m) => dm[i][m]));
  return total;
}
function pamBuildSwap(points, k) {
  const n = points.length; ensure(n >= k, "PAM k exceeds rows"); const dm = distanceMatrix(points.map((p) => p.vector));
  const keys = points.map((p) => p.rawStateKey);
  let first = 0, firstCost = dm[0].reduce((a, b) => a + b, 0);
  for (let i = 1; i < n; i += 1) { const c = dm[i].reduce((a, b) => a + b, 0); if (c < firstCost || (c === firstCost && keys[i] < keys[first])) { first = i; firstCost = c; } }
  let medoids = [first];
  while (medoids.length < k) {
    let best = null;
    for (let i = 0; i < n; i += 1) if (!medoids.includes(i)) {
      const ms = medoids.concat([i]); const cost = assignmentCost(dm, ms);
      if (!best || cost < best.cost || (cost === best.cost && keys[i] < keys[best.i])) best = { i, cost };
    }
    medoids.push(best.i);
  }
  medoids.sort((a, b) => keys[a].localeCompare(keys[b]));
  let current = assignmentCost(dm, medoids);
  for (let iter = 0; iter < 100; iter += 1) {
    let best = null;
    const inSet = new Set(medoids);
    for (let mi = 0; mi < medoids.length; mi += 1) for (let cand = 0; cand < n; cand += 1) if (!inSet.has(cand)) {
      const next = medoids.slice(); next[mi] = cand; next.sort((a, b) => keys[a].localeCompare(keys[b]));
      const cost = assignmentCost(dm, next); if (!(cost < current)) continue;
      const tuple = next.map((x) => keys[x]).join("|");
      if (!best || cost < best.cost || (cost === best.cost && tuple < best.tuple)) best = { medoids: next, cost, tuple };
    }
    if (!best) break; medoids = best.medoids; current = best.cost;
  }
  const assignments = [];
  for (let i = 0; i < n; i += 1) {
    let best = medoids[0], bd = dm[i][best];
    for (let j = 1; j < medoids.length; j += 1) { const m = medoids[j], d = dm[i][m]; if (d < bd || (d === bd && keys[m] < keys[best])) { best = m; bd = d; } }
    assignments.push(medoids.indexOf(best));
  }
  return { medoidIndices: medoids, assignments, cost: current };
}
function canonicalize(points, prototypes, assignments, prototypeKeys = null) {
  const rows = prototypes.map((p, i) => ({ old: i, vector: p, hex: p.map(bhex).join(""), key: prototypeKeys ? prototypeKeys[i] : "" }))
    .sort((a, b) => a.hex.localeCompare(b.hex) || a.key.localeCompare(b.key) || a.old - b.old);
  const map = new Map(rows.map((x, i) => [x.old, i]));
  return { prototypes: rows.map((x) => x.vector), prototypeKeys: rows.map((x) => x.key), assignments: assignments.map((a) => map.get(a)) };
}
function fitFamily(rows, dict, familyId, k) {
  ensure(FAMILY_IDS.includes(familyId), `unknown family ${familyId}`);
  const ordered = rows.slice().sort((a, b) => a.rawStateKey.localeCompare(b.rawStateKey));
  const scaler = fitScaler(ordered, dict), scaled = ordered.map((r) => scaleRow(r, scaler));
  let pca = null, coords = scaled;
  if (familyId !== "RF-C-DIRECT-ROBUST-PAM") { pca = N.pca(scaled, 8); coords = scaled.map((v) => projectRow(v, pca)); }
  const points = ordered.map((r, i) => ({ rawStateKey: r.rawStateKey, row: r, vector: coords[i] }));
  let assignments, prototypes, prototypeKeys = [];
  if (familyId === "RF-A-ROBUST-PCA-WARD") {
    const w = N.ward(coords, k); assignments = Array(points.length).fill(-1);
    for (let c = 0; c < w.clusters.length; c += 1) for (const idx of w.clusters[c]) assignments[idx] = c;
    prototypes = w.centroids;
  } else {
    const p = pamBuildSwap(points, k); assignments = p.assignments; prototypes = p.medoidIndices.map((idx) => coords[idx]); prototypeKeys = p.medoidIndices.map((idx) => ordered[idx].rawStateKey);
  }
  ensure(assignments.every((x) => x >= 0), "unassigned training row");
  const canon = canonicalize(points, prototypes, assignments, prototypeKeys);
  return {
    familyId, k, orderedRawStateKeys: ordered.map((r) => r.rawStateKey), scaler, pca,
    prototypes: canon.prototypes, prototypeKeys: canon.prototypeKeys,
    assignments: canon.assignments,
    representationRows: points.map((p) => p.vector),
  };
}
function applyModel(rows, model) {
  const out = [];
  for (const row of rows) {
    const scaled = scaleRow(row, model.scaler); const v = model.pca ? projectRow(scaled, model.pca) : scaled;
    let best = 0, bd = sqdist(v, model.prototypes[0]);
    for (let j = 1; j < model.prototypes.length; j += 1) { const d = sqdist(v, model.prototypes[j]); if (d < bd) { best = j; bd = d; } }
    out.push({ rawStateKey: row.rawStateKey, label: best, distance2: bd, vector: v });
  }
  return out;
}
function silhouette(coords, labels, k) {
  const n = coords.length, groups = Array.from({ length: k }, () => []); for (let i = 0; i < n; i += 1) groups[labels[i]].push(i);
  let total = 0;
  for (let i = 0; i < n; i += 1) {
    const own = groups[labels[i]]; let a = 0;
    if (own.length > 1) { for (const j of own) if (j !== i) a += Math.sqrt(sqdist(coords[i], coords[j])); a /= own.length - 1; }
    let b = Infinity;
    for (let c = 0; c < k; c += 1) if (c !== labels[i] && groups[c].length) {
      let d = 0; for (const j of groups[c]) d += Math.sqrt(sqdist(coords[i], coords[j])); d /= groups[c].length; if (d < b) b = d;
    }
    const den = Math.max(a, b); total += den && Number.isFinite(den) ? (b - a) / den : 0;
  }
  return total / n;
}
const permCache = new Map();
function permutations(k) {
  if (permCache.has(k)) return permCache.get(k);
  const out = [], used = Array(k).fill(false), cur = [];
  function rec() { if (cur.length === k) { out.push(cur.slice()); return; } for (let i = 0; i < k; i += 1) if (!used[i]) { used[i] = true; cur.push(i); rec(); cur.pop(); used[i] = false; } }
  rec(); permCache.set(k, out); return out;
}
function bestMapping(foldLabels, fullLabels, k) {
  const counts = Array.from({ length: k }, () => Array(k).fill(0)); for (let i = 0; i < foldLabels.length; i += 1) counts[foldLabels[i]][fullLabels[i]] += 1;
  let best = null;
  for (const p of permutations(k)) { let score = 0; for (let i = 0; i < k; i += 1) score += counts[i][p[i]]; const sig = p.join(","); if (!best || score > best.score || (score === best.score && sig < best.sig)) best = { p, score, sig }; }
  return best.p;
}
function foldIndex(rawStateKey) { return u32(`PSRRE-S1-FOLD-v1|${rawStateKey}`) % 5; }
function candidateMetrics(rows, dict, familyId, k) {
  const full = fitFamily(rows, dict, familyId, k), ordered = rows.slice().sort((a, b) => a.rawStateKey.localeCompare(b.rawStateKey));
  const support = Array(k).fill(0); for (const a of full.assignments) support[a] += 1;
  const supportFractions = support.map((x) => x / ordered.length);
  const policyShares = Array.from({ length: k }, () => ({}));
  for (let i = 0; i < ordered.length; i += 1) { const c = full.assignments[i], p = ordered[i].sourcePolicy; policyShares[c][p] = (policyShares[c][p] || 0) + 1; }
  const maxPolicyShare = policyShares.map((o, c) => Math.max(...Object.values(o)) / support[c]);
  const meanSilhouette = silhouette(full.representationRows, full.assignments, k);
  const fullByKey = new Map(ordered.map((r, i) => [r.rawStateKey, full.assignments[i]]));
  const foldScores = [];
  for (let f = 0; f < 5; f += 1) {
    const train = ordered.filter((r) => foldIndex(r.rawStateKey) !== f), hold = ordered.filter((r) => foldIndex(r.rawStateKey) === f);
    if (!hold.length || train.length < k) { foldScores.push(0); continue; }
    const fm = fitFamily(train, dict, familyId, k);
    if (new Set(fm.assignments).size !== k) { foldScores.push(0); continue; }
    const trainFoldLabels = fm.assignments, trainFullLabels = train.map((r) => fullByKey.get(r.rawStateKey));
    const mapping = bestMapping(trainFoldLabels, trainFullLabels, k), predicted = applyModel(hold, fm);
    let match = 0; for (let i = 0; i < hold.length; i += 1) if (mapping[predicted[i].label] === fullByKey.get(hold[i].rawStateKey)) match += 1;
    foldScores.push(match / hold.length);
  }
  const stability = foldScores.reduce((a, b) => a + b, 0) / 5;
  const distancesByRegime = Array.from({ length: k }, () => []);
  for (let i = 0; i < ordered.length; i += 1) distancesByRegime[full.assignments[i]].push(sqdist(full.representationRows[i], full.prototypes[full.assignments[i]]));
  const p99 = distancesByRegime.map((xs) => { const a = xs.slice().sort((x, y) => x - y); return a[Math.max(0, Math.ceil(0.99 * a.length) - 1)]; });
  return { model: full, support, supportFractions, minimumSupportFraction: Math.min(...supportFractions), sourcePolicyShares: policyShares, maximumSingleSourcePolicyShare: Math.max(...maxPolicyShare), meanSilhouette, foldScores, fiveFoldAssignmentStability: stability, trainingPrototypeDistanceP99ByRegime: p99 };
}
function candidateEligible(m, spec) {
  const t = spec.selectionMetrics;
  return m.minimumSupportFraction >= t.minimumClusterSupportFraction && m.meanSilhouette >= t.minimumMeanSilhouette && m.fiveFoldAssignmentStability >= t.minimumFiveFoldAssignmentStability && m.maximumSingleSourcePolicyShare <= t.maximumSingleSourcePolicyShareWithinAnyRegime && m.support.every((x) => x > 0);
}
function candidateSummary(m, familyId, k, spec) {
  return { familyId, k, eligible: candidateEligible(m, spec), minimumSupportFraction: m.minimumSupportFraction, meanSilhouette: m.meanSilhouette, fiveFoldAssignmentStability: m.fiveFoldAssignmentStability, maximumSingleSourcePolicyShare: m.maximumSingleSourcePolicyShare, support: m.support, foldScores: m.foldScores };
}
function chooseWinner(candidates, spec) {
  const priority = new Map(spec.winnerRule.tie4FamilyPriority.map((x, i) => [x, i]));
  const eligible = candidates.filter((c) => c.summary.eligible);
  eligible.sort((a, b) => b.summary.fiveFoldAssignmentStability - a.summary.fiveFoldAssignmentStability || b.summary.meanSilhouette - a.summary.meanSilhouette || b.summary.minimumSupportFraction - a.summary.minimumSupportFraction || a.k - b.k || priority.get(a.familyId) - priority.get(b.familyId));
  return eligible[0] || null;
}
function evaluateAll(rows, dict, spec) {
  const candidates = [];
  for (const familyId of FAMILY_IDS) for (const k of spec.candidatePartitionComplexity.candidateK) {
    const metrics = candidateMetrics(rows, dict, familyId, k); candidates.push({ familyId, k, metrics, summary: candidateSummary(metrics, familyId, k, spec) });
  }
  const winner = chooseWinner(candidates, spec);
  return { candidates, winner };
}
function frozenRepresentation(winner, rows, dict, featureDictionarySha256) {
  if (!winner) return null;
  const m = winner.metrics.model;
  return {
    schemaVersion: "PSRRE_FROZEN_REPRESENTATION_V1", studyId: "PSRRE-STUDY1", stageId: "PSRRE-S1-DEVELOPMENT-2026-08-30-v1",
    featureDictionarySha256, familyId: winner.familyId, K: winner.k,
    trainingRawStateKeysHash: hash(rows.map((r) => r.rawStateKey).sort()),
    scalerFeatureIds: m.scaler.featureIds, scalerMedianBinary64Hex: m.scaler.center.map(bhex), scalerMadBinary64Hex: m.scaler.scale.map(bhex),
    pcaMeanBinary64Hex: m.pca ? m.pca.mean.map(bhex) : null,
    pcaLoadingsBinary64Hex: m.pca ? m.pca.loadings.map((r) => r.map(bhex)) : null,
    prototypeBinary64Hex: m.prototypes.map((r) => r.map(bhex)), prototypeKeys: m.prototypeKeys,
    canonicalRegimeLabels: Array.from({ length: winner.k }, (_, i) => `R${String(i + 1).padStart(2, "0")}`),
    trainingAssignmentHash: hash(m.assignments), trainingSupportByRegime: winner.metrics.support,
    meanSilhouette: winner.summary.meanSilhouette, fiveFoldAssignmentStability: winner.summary.fiveFoldAssignmentStability,
    sourcePolicyShareByRegime: winner.metrics.sourcePolicyShares, trainingPrototypeDistanceP99ByRegime: winner.metrics.trainingPrototypeDistanceP99ByRegime.map(bhex),
    assignmentRule: "frozen median/MAD -> frozen PCA if applicable -> nearest frozen prototype; tie lower canonical regime label",
    serializationContract: "canonical JSON; scientific floats stored as big-endian IEEE754 binary64 lowercase hex",
  };
}

module.exports = {
  SEMANTICS, FAMILY_IDS, stableStringify: stable, sha256: sha, hashObject: hash, binary64Hex: bhex, rawStateKey: raw,
  runGame, generate, select, featureValues, analyzeSelected, fitScaler, fitFamily, applyModel, candidateMetrics, candidateEligible, candidateSummary, chooseWinner, evaluateAll, frozenRepresentation,
};
