"use strict";

const crypto = require("node:crypto");
const E = require("../../../public/engine.js");
const AI = require("../../../public/ai.js");
const Legacy = require("./position-complexity-search-diagnostic.js");
const N = require("./psrre-stage0-independent.js");
const C03 = require("./tmgc-stage0-independent.js");
const CAND = require("../../../doc/tactical-motifs/preregistration/STAGE_2_FORMAL_CANDIDATES.json")
  .formalCandidates.find((x) => x.candidateId === "TM-S2-C03");

const SEMANTICS = "psrre-stage1-independent/v1";
const FAMILIES = Object.freeze(["RF-A-ROBUST-PCA-WARD", "RF-B-ROBUST-PCA-PAM", "RF-C-DIRECT-ROBUST-PAM"]);

function copy(v) { return JSON.parse(JSON.stringify(v)); }
function canonical(v) { return N.stableStringify(v); }
function digest(s) { return crypto.createHash("sha256").update(String(s), "utf8").digest("hex"); }
function digestObject(v) { return digest(canonical(v)); }
function requireTrue(v, msg) { if (!v) throw new Error(msg); }
function uint32(text) { return parseInt(digest(text).slice(0, 8), 16) >>> 0; }
function floatHex(v) { return N.binary64Hex(v); }
function moveKey(m) { return AI.moveKey(m); }
function exactMoves(s) { return E.moveVariants(s).map((m) => copy(m)).sort((a, b) => moveKey(a).localeCompare(moveKey(b))); }
function rawKey(s) { return N.rawIdentityHash(s); }
function mulberry32(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6D2B79F5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}
function sourcePolicy(index) { const list = ["UNIFORM", "CAPTURE_FIRST", "HIGH_CAPTURE", "LOW_CAPTURE"]; return list[index % list.length]; }
function captureAmount(state, move) {
  const applied = E.applyMove(state, move); let n = 0; for (const event of applied.events) if (event.kind === "capture") n += event.count || 0; return n;
}
function chooseMove(state, policy, random) {
  const legal = exactMoves(state); requireTrue(legal.length > 0, "source move missing"); let pool = legal;
  if (policy === "CAPTURE_FIRST") {
    const captures = legal.filter((m) => m.type === "capture"); if (captures.length) pool = captures;
  } else if (policy === "HIGH_CAPTURE" || policy === "LOW_CAPTURE") {
    const values = legal.map((m) => ({ move: m, amount: captureAmount(state, m) }));
    let target = values[0].amount; for (const v of values) target = policy === "HIGH_CAPTURE" ? Math.max(target, v.amount) : Math.min(target, v.amount);
    pool = values.filter((v) => v.amount === target).map((v) => v.move);
  }
  return pool[Math.floor(random() * pool.length)];
}
function phaseFor(seed, spec) { return uint32(`${spec.rootSelection.phaseAssignment.salt}|${seed}`) % 2 === 0 ? "namua" : "mtaji"; }
function candidateRank(seed, stateKey, ply, spec) { return digest(`${spec.rootSelection.withinTrajectoryOccurrence.salt}|${seed}|${stateKey}|${ply}`); }
function finalRank(c, spec) {
  const q = spec.rootSelection.stratumQuota;
  return digest(`${q.salt}|${c.phase}|${c.sourcePolicy}|${c.trajectoryHash}|${c.openingPrefixHash}|${c.rawStateKey}|${c.seed}|${c.ply}`);
}
function replayOne(spec, index, options = {}) {
  const seed = (options.seedStart ?? spec.seedBlock.seedStart) + index, random = mulberry32(seed), policy = sourcePolicy(index), targetPhase = phaseFor(seed, spec);
  const maxPly = options.maxPly ?? spec.sourceGeneration.maxPly, openingPlies = spec.sourceGeneration.openingPlies;
  let state = E.initialState(), best = null; const history = [], opening = [];
  for (let ply = 0; ply <= maxPly; ply += 1) {
    const stateKey = rawKey(state), legal = state.winner === null ? exactMoves(state) : []; history.push(stateKey);
    if (state.winner === null && state.phase === targetPhase && ply >= spec.rootSelection.minimumPlyInclusive && legal.length >= spec.rootSelection.minimumLegalMoveCount) {
      const rank = candidateRank(seed, stateKey, ply, spec);
      const c = { gameIndex: index, seed, sourcePolicy: policy, phase: targetPhase, ply, legalMoveCount: legal.length, rawStateKey: stateKey, selectionRank: rank, root: copy(state) };
      if (best === null || rank < best.selectionRank || (rank === best.selectionRank && stateKey < best.rawStateKey)) best = c;
    }
    if (state.winner !== null || ply === maxPly) break;
    let selected;
    if (ply < openingPlies) { selected = legal[Math.floor(random() * legal.length)]; opening.push(moveKey(selected)); }
    else selected = chooseMove(state, policy, random);
    state = E.applyMove(state, selected).state;
  }
  const trajectoryHash = digestObject({ length: history.length, rawStateKeys: history }), openingPrefixHash = digestObject({ length: opening.length, moveKeys: opening });
  if (best) { best.trajectoryHash = trajectoryHash; best.openingPrefixHash = openingPrefixHash; best.stratumRank = finalRank(best, spec); }
  return { gameSummary: { gameIndex: index, seed, sourcePolicy: policy, assignedPhase: targetPhase, trajectoryHash, openingPrefixHash, terminal: state.winner !== null, winner: state.winner, observedStates: history.length }, candidate: best };
}
function generate(spec, options = {}) { const n = options.games ?? spec.seedBlock.games, out = new Array(n); for (let i = 0; i < n; i += 1) out[i] = replayOne(spec, i, options); return out; }
function select(records, spec, options = {}) {
  const byTrajectory = new Map();
  for (const row of records) { const old = byTrajectory.get(row.gameSummary.trajectoryHash); if (!old || row.gameSummary.seed < old.gameSummary.seed) byTrajectory.set(row.gameSummary.trajectoryHash, row); }
  const reps = Array.from(byTrajectory.values()), quota = options.quotaPerStratum ?? spec.rootSelection.stratumQuota.quotaPerStratum;
  const selected = [], rawSeen = new Set(), counts = {};
  for (const stratum of spec.rootSelection.stratumQuota.fixedStratumOrder) {
    const parts = stratum.split("/"), phase = parts[0], source = parts[1];
    const pool = [];
    for (const r of reps) if (r.candidate && r.candidate.phase === phase && r.candidate.sourcePolicy === source) pool.push(r.candidate);
    pool.sort((a, b) => a.stratumRank.localeCompare(b.stratumRank) || a.rawStateKey.localeCompare(b.rawStateKey) || a.seed - b.seed);
    let n = 0;
    for (const c of pool) { if (rawSeen.has(c.rawStateKey)) continue; rawSeen.add(c.rawStateKey); selected.push(c); n += 1; if (n >= quota) break; }
    counts[stratum] = n;
  }
  selected.sort((a, b) => a.phase.localeCompare(b.phase) || a.sourcePolicy.localeCompare(b.sourcePolicy) || a.stratumRank.localeCompare(b.stratumRank));
  const prefixCounts = new Map(); for (const c of selected) prefixCounts.set(c.openingPrefixHash, (prefixCounts.get(c.openingPrefixHash) || 0) + 1);
  let maxPrefix = 0; for (const n of prefixCounts.values()) if (n > maxPrefix) maxPrefix = n;
  return {
    generatedGames: records.length, uniqueTrajectories: reps.length, distinctOpeningPrefixes: new Set(records.map((r) => r.gameSummary.openingPrefixHash)).size,
    selectedRoots: selected.length, stratumCounts: counts, selectedDistinctOpeningPrefixes: prefixCounts.size,
    maximumSingleSelectedOpeningPrefixShare: selected.length ? maxPrefix / selected.length : 1, selected,
    selectionHash: digestObject(selected.map((x) => ({ seed: x.seed, sourcePolicy: x.sourcePolicy, phase: x.phase, ply: x.ply, rawStateKey: x.rawStateKey, trajectoryHash: x.trajectoryHash, openingPrefixHash: x.openingPrefixHash, stratumRank: x.stratumRank }))),
  };
}

function search(state, depth, q) { return Legacy.analyzeRootCandidates(state, depth, { evaluationProfile: "bao", quiescenceDepth: q, orderQuiescenceCaptures: false }); }
function intersectionOverUnion(a, b) {
  const A = new Set(a), B = new Set(b); let inter = 0; for (const x of A) if (B.has(x)) inter += 1; const union = new Set([...A, ...B]).size; return union ? inter / union : 1;
}
function entropyFromCounts(counts) {
  const keys = Object.keys(counts).slice().sort(); let total = 0; for (const k of keys) total += counts[k]; if (total === 0) return 0;
  let value = 0; for (const k of keys) { if (!counts[k]) continue; const p = counts[k] / total; value = value + (-p * Math.log2(p)); } return value;
}
function median(values) { const a = values.slice().sort((x, y) => x - y), n = a.length; return n & 1 ? a[(n - 1) >> 1] : (a[n / 2 - 1] + a[n / 2]) / 2; }
function reply(root, d2) {
  const actor = root.player, rootMove = exactMoves(root).find((m) => moveKey(m) === d2.canonicalBestMoveKey); requireTrue(rootMove, "D2 best move missing");
  const after = E.applyMove(root, rootMove).state; if (after.winner !== null) return { count: 0, nonterminalFraction: 0, staticScoreRange: 0 };
  const replies = exactMoves(after); if (replies.length === 0) return { count: 0, nonterminalFraction: 0, staticScoreRange: 0 };
  let alive = 0; const scores = [];
  for (const r of replies) { const post = E.applyMove(after, r).state; if (post.winner === null) alive += 1; scores.push(AI.evaluateWithProfile(post, actor, "bao")); }
  let range = 0; if (scores.length >= 2) range = Math.max(...scores) - Math.min(...scores);
  return { count: replies.length, nonterminalFraction: alive / replies.length, staticScoreRange: range };
}
function calculateFeatures(selected, dictionary, q = 1) {
  const root = selected.root, actor = root.player, opponent = actor === 0 ? 1 : 0, legal = exactMoves(root), typeCounts = {};
  for (const m of legal) typeCounts[m.type] = (typeCounts[m.type] || 0) + 1;
  function pitData(player) { let total = 0, occupied = 0, maxPit = 0; for (const row of [E.FRONT, E.BACK]) for (let i = 0; i < 8; i += 1) { const v = root.pits[player][row][i]; total += v; if (v > 0) occupied += 1; if (v > maxPit) maxPit = v; } return { total, occupied, maxPit }; }
  const a = pitData(actor), b = pitData(opponent), widths = [];
  for (const m of legal) { const next = E.applyMove(root, m).state; widths.push(next.winner === null ? exactMoves(next).length : 0); }
  const d1 = search(root, 1, q), d2 = search(root, 2, q), pressure = reply(root, d2), c03 = C03.analyzeFixture(root, CAND);
  const values = {
    "PSRRE-F01": root.reserve[actor], "PSRRE-F02": root.reserve[opponent], "PSRRE-F03": root.pending[actor], "PSRRE-F04": root.pending[opponent],
    "PSRRE-F05": root.houseOwned[actor] ? 1 : 0, "PSRRE-F06": root.houseOwned[opponent] ? 1 : 0,
    "PSRRE-F07": a.total, "PSRRE-F08": b.total, "PSRRE-F09": a.occupied, "PSRRE-F10": b.occupied, "PSRRE-F11": a.maxPit, "PSRRE-F12": b.maxPit,
    "PSRRE-F13": legal.length, "PSRRE-F14": legal.length ? (typeCounts.capture || 0) / legal.length : 0, "PSRRE-F15": legal.length ? (typeCounts.takata || 0) / legal.length : 0,
    "PSRRE-F16": entropyFromCounts(typeCounts),
    "PSRRE-F17": widths.length ? Math.min(...widths) : 0, "PSRRE-F18": widths.length ? median(widths) : 0, "PSRRE-F19": widths.length ? Math.max(...widths) : 0,
    "PSRRE-F20": widths.length ? Math.max(...widths) - Math.min(...widths) : 0,
    "PSRRE-F21": d1.canonicalBestMoveKey === d2.canonicalBestMoveKey ? 1 : 0, "PSRRE-F22": intersectionOverUnion(d1.topSetMoveKeys, d2.topSetMoveKeys),
    "PSRRE-F23": Math.abs(d2.bestScore - d1.bestScore), "PSRRE-F24": pressure.count, "PSRRE-F25": pressure.nonterminalFraction, "PSRRE-F26": pressure.staticScoreRange,
    "PSRRE-F27": c03.eligible ? 1 : 0, "PSRRE-F28": c03.eligible && c03.structuralSuccess ? 1 : 0,
  };
  const out = {};
  for (const def of dictionary.features) { requireTrue(Object.prototype.hasOwnProperty.call(values, def.id), `feature missing ${def.id}`); const v = values[def.id]; requireTrue(v !== null && Number.isFinite(v), `invalid feature ${def.id}`); out[def.id] = v; }
  return out;
}
function analyzeSelected(selected, dictionary, q = 1) { return { seed: selected.seed, sourcePolicy: selected.sourcePolicy, phase: selected.phase, ply: selected.ply, rawStateKey: selected.rawStateKey, trajectoryHash: selected.trajectoryHash, openingPrefixHash: selected.openingPrefixHash, features: calculateFeatures(selected, dictionary, q) }; }
function fitScaler(rows, dictionary) {
  const ordered = rows.slice().sort((x, y) => x.rawStateKey.localeCompare(y.rawStateKey)), ids = dictionary.features.map((f) => f.id);
  const matrix = ordered.map((r) => ids.map((id) => r.features[id])), fit = N.robustScale(matrix);
  return { featureIds: ids, center: fit.center, scale: fit.scale, centerHex: fit.center.map(floatHex), scaleHex: fit.scale.map(floatHex), zeroMadFeatureIds: fit.zeroVarianceColumns.map((j) => ids[j]), nonzeroMadFeatureIds: ids.filter((_, j) => !fit.zeroVarianceColumns.includes(j)) };
}
function scaledVector(row, scaler) { const out = []; for (let j = 0; j < scaler.featureIds.length; j += 1) out.push(scaler.scale[j] === 0 ? 0 : (row.features[scaler.featureIds[j]] - scaler.center[j]) / scaler.scale[j]); return out; }
function pcaProject(v, pca) { const out = []; for (const loading of pca.loadings) { let s = 0; for (let j = 0; j < v.length; j += 1) s += (v[j] - pca.mean[j]) * loading[j]; out.push(s); } return out; }
function squared(a, b) { let s = 0; for (let i = 0; i < a.length; i += 1) { const d = a[i] - b[i]; s += d * d; } return s; }
function allDistances(points) { const n = points.length, dm = Array.from({ length: n }, () => Array(n).fill(0)); for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) dm[i][j] = dm[j][i] = squared(points[i].vector, points[j].vector); return dm; }
function cost(dm, medoids) { let total = 0; for (let i = 0; i < dm.length; i += 1) { let best = Infinity; for (const m of medoids) if (dm[i][m] < best) best = dm[i][m]; total += best; } return total; }
function pam(points, k) {
  requireTrue(points.length >= k, "PAM k exceeds rows"); const dm = allDistances(points), keys = points.map((p) => p.rawStateKey), n = points.length;
  let first = null;
  for (let i = 0; i < n; i += 1) { let c = 0; for (let j = 0; j < n; j += 1) c += dm[i][j]; if (first === null || c < first.cost || (c === first.cost && keys[i] < keys[first.index])) first = { index: i, cost: c }; }
  let medoids = [first.index];
  while (medoids.length < k) {
    let pick = null;
    for (let i = 0; i < n; i += 1) if (medoids.indexOf(i) < 0) { const c = cost(dm, medoids.concat([i])); if (pick === null || c < pick.cost || (c === pick.cost && keys[i] < keys[pick.index])) pick = { index: i, cost: c }; }
    medoids.push(pick.index);
  }
  medoids.sort((a, b) => keys[a].localeCompare(keys[b])); let current = cost(dm, medoids);
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const membership = new Set(medoids); let choice = null;
    for (let slot = 0; slot < medoids.length; slot += 1) for (let candidate = 0; candidate < n; candidate += 1) if (!membership.has(candidate)) {
      const next = medoids.slice(); next[slot] = candidate; next.sort((a, b) => keys[a].localeCompare(keys[b])); const c = cost(dm, next); if (c >= current) continue;
      const tuple = next.map((i) => keys[i]).join("|"); if (choice === null || c < choice.cost || (c === choice.cost && tuple < choice.tuple)) choice = { medoids: next, cost: c, tuple };
    }
    if (choice === null) break; medoids = choice.medoids; current = choice.cost;
  }
  const labels = [];
  for (let i = 0; i < n; i += 1) { let chosen = medoids[0], best = dm[i][chosen]; for (let j = 1; j < medoids.length; j += 1) { const m = medoids[j], d = dm[i][m]; if (d < best || (d === best && keys[m] < keys[chosen])) { chosen = m; best = d; } } labels.push(medoids.indexOf(chosen)); }
  return { medoidIndices: medoids, assignments: labels, cost: current };
}
function canonicalize(prototypes, labels, prototypeKeys) {
  const items = prototypes.map((v, i) => ({ old: i, v, h: v.map(floatHex).join(""), key: prototypeKeys ? prototypeKeys[i] : "" }));
  items.sort((a, b) => a.h.localeCompare(b.h) || a.key.localeCompare(b.key) || a.old - b.old); const remap = new Map(); items.forEach((x, i) => remap.set(x.old, i));
  return { prototypes: items.map((x) => x.v), prototypeKeys: items.map((x) => x.key), assignments: labels.map((x) => remap.get(x)) };
}
function fitFamily(rows, dictionary, family, k) {
  requireTrue(FAMILIES.includes(family), `unknown family ${family}`); const ordered = rows.slice().sort((x, y) => x.rawStateKey.localeCompare(y.rawStateKey));
  const scaler = fitScaler(ordered, dictionary), scaled = ordered.map((r) => scaledVector(r, scaler)); let pcaFit = null, coordinates = scaled;
  if (family !== "RF-C-DIRECT-ROBUST-PAM") { pcaFit = N.pca(scaled, 8); coordinates = scaled.map((v) => pcaProject(v, pcaFit)); }
  const points = ordered.map((r, i) => ({ rawStateKey: r.rawStateKey, row: r, vector: coordinates[i] })); let assignments, prototypes, prototypeKeys = [];
  if (family === "RF-A-ROBUST-PCA-WARD") {
    const w = N.ward(coordinates, k); assignments = Array(points.length).fill(-1); for (let c = 0; c < w.clusters.length; c += 1) for (const i of w.clusters[c]) assignments[i] = c; prototypes = w.centroids;
  } else {
    const p = pam(points, k); assignments = p.assignments; prototypes = p.medoidIndices.map((i) => coordinates[i]); prototypeKeys = p.medoidIndices.map((i) => ordered[i].rawStateKey);
  }
  requireTrue(assignments.every((x) => x >= 0), "unassigned training row"); const canon = canonicalize(prototypes, assignments, prototypeKeys);
  return { familyId: family, k, orderedRawStateKeys: ordered.map((r) => r.rawStateKey), scaler, pca: pcaFit, prototypes: canon.prototypes, prototypeKeys: canon.prototypeKeys, assignments: canon.assignments, representationRows: coordinates };
}
function applyModel(rows, model) {
  const out = [];
  for (const row of rows) {
    const scaled = scaledVector(row, model.scaler), v = model.pca ? pcaProject(scaled, model.pca) : scaled; let label = 0, best = squared(v, model.prototypes[0]);
    for (let c = 1; c < model.prototypes.length; c += 1) { const d = squared(v, model.prototypes[c]); if (d < best) { label = c; best = d; } }
    out.push({ rawStateKey: row.rawStateKey, label, distance2: best, vector: v });
  }
  return out;
}
function silhouette(coords, labels, k) {
  const groups = Array.from({ length: k }, () => []); for (let i = 0; i < labels.length; i += 1) groups[labels[i]].push(i); let total = 0;
  for (let i = 0; i < coords.length; i += 1) {
    const own = groups[labels[i]]; let a = 0; if (own.length > 1) { for (const j of own) if (j !== i) a += Math.sqrt(squared(coords[i], coords[j])); a /= own.length - 1; }
    let b = Infinity; for (let c = 0; c < k; c += 1) if (c !== labels[i] && groups[c].length) { let d = 0; for (const j of groups[c]) d += Math.sqrt(squared(coords[i], coords[j])); d /= groups[c].length; if (d < b) b = d; }
    const denominator = Math.max(a, b); total += denominator && Number.isFinite(denominator) ? (b - a) / denominator : 0;
  }
  return total / coords.length;
}
const permutationCache = new Map();
function permutations(k) {
  if (permutationCache.has(k)) return permutationCache.get(k); const out = [], current = [], used = Array(k).fill(false);
  function walk() { if (current.length === k) { out.push(current.slice()); return; } for (let i = 0; i < k; i += 1) if (!used[i]) { used[i] = true; current.push(i); walk(); current.pop(); used[i] = false; } }
  walk(); permutationCache.set(k, out); return out;
}
function mapping(foldLabels, fullLabels, k) {
  const counts = Array.from({ length: k }, () => Array(k).fill(0)); for (let i = 0; i < foldLabels.length; i += 1) counts[foldLabels[i]][fullLabels[i]] += 1;
  let best = null; for (const p of permutations(k)) { let score = 0; for (let i = 0; i < k; i += 1) score += counts[i][p[i]]; const signature = p.join(","); if (best === null || score > best.score || (score === best.score && signature < best.signature)) best = { p, score, signature }; } return best.p;
}
function fold(rawStateKey) { return uint32(`PSRRE-S1-FOLD-v1|${rawStateKey}`) % 5; }
function candidateMetrics(rows, dictionary, family, k) {
  const ordered = rows.slice().sort((a, b) => a.rawStateKey.localeCompare(b.rawStateKey)), full = fitFamily(ordered, dictionary, family, k), support = Array(k).fill(0);
  for (const label of full.assignments) support[label] += 1; const fractions = support.map((n) => n / ordered.length), policyCounts = Array.from({ length: k }, () => ({}));
  for (let i = 0; i < ordered.length; i += 1) { const c = full.assignments[i], p = ordered[i].sourcePolicy; policyCounts[c][p] = (policyCounts[c][p] || 0) + 1; }
  const policyMax = policyCounts.map((o, c) => Math.max(...Object.values(o)) / support[c]), meanSilhouette = silhouette(full.representationRows, full.assignments, k);
  const fullLabel = new Map(); for (let i = 0; i < ordered.length; i += 1) fullLabel.set(ordered[i].rawStateKey, full.assignments[i]);
  const foldScores = [];
  for (let f = 0; f < 5; f += 1) {
    const train = [], held = []; for (const r of ordered) (fold(r.rawStateKey) === f ? held : train).push(r);
    if (!held.length || train.length < k) { foldScores.push(0); continue; }
    const fm = fitFamily(train, dictionary, family, k); if (new Set(fm.assignments).size !== k) { foldScores.push(0); continue; }
    const map = mapping(fm.assignments, train.map((r) => fullLabel.get(r.rawStateKey)), k), predicted = applyModel(held, fm); let matches = 0;
    for (let i = 0; i < held.length; i += 1) if (map[predicted[i].label] === fullLabel.get(held[i].rawStateKey)) matches += 1; foldScores.push(matches / held.length);
  }
  const stability = foldScores.reduce((a, b) => a + b, 0) / 5, byRegime = Array.from({ length: k }, () => []);
  for (let i = 0; i < ordered.length; i += 1) byRegime[full.assignments[i]].push(squared(full.representationRows[i], full.prototypes[full.assignments[i]]));
  const p99 = byRegime.map((values) => { const a = values.slice().sort((x, y) => x - y); return a[Math.max(0, Math.ceil(0.99 * a.length) - 1)]; });
  return { model: full, support, supportFractions: fractions, minimumSupportFraction: Math.min(...fractions), sourcePolicyShares: policyCounts, maximumSingleSourcePolicyShare: Math.max(...policyMax), meanSilhouette, foldScores, fiveFoldAssignmentStability: stability, trainingPrototypeDistanceP99ByRegime: p99 };
}
function candidateEligible(metrics, spec) {
  const t = spec.selectionMetrics; return metrics.minimumSupportFraction >= t.minimumClusterSupportFraction && metrics.meanSilhouette >= t.minimumMeanSilhouette && metrics.fiveFoldAssignmentStability >= t.minimumFiveFoldAssignmentStability && metrics.maximumSingleSourcePolicyShare <= t.maximumSingleSourcePolicyShareWithinAnyRegime && metrics.support.every((x) => x > 0);
}
function candidateSummary(metrics, familyId, k, spec) { return { familyId, k, eligible: candidateEligible(metrics, spec), minimumSupportFraction: metrics.minimumSupportFraction, meanSilhouette: metrics.meanSilhouette, fiveFoldAssignmentStability: metrics.fiveFoldAssignmentStability, maximumSingleSourcePolicyShare: metrics.maximumSingleSourcePolicyShare, support: metrics.support, foldScores: metrics.foldScores }; }
function chooseWinner(candidates, spec) {
  const priority = new Map(spec.winnerRule.tie4FamilyPriority.map((x, i) => [x, i])), eligible = candidates.filter((c) => c.summary.eligible);
  eligible.sort((a, b) => b.summary.fiveFoldAssignmentStability - a.summary.fiveFoldAssignmentStability || b.summary.meanSilhouette - a.summary.meanSilhouette || b.summary.minimumSupportFraction - a.summary.minimumSupportFraction || a.k - b.k || priority.get(a.familyId) - priority.get(b.familyId)); return eligible.length ? eligible[0] : null;
}
function evaluateAll(rows, dictionary, spec) {
  const candidates = [];
  for (const family of FAMILIES) for (const k of spec.candidatePartitionComplexity.candidateK) { const metrics = candidateMetrics(rows, dictionary, family, k); candidates.push({ familyId: family, k, metrics, summary: candidateSummary(metrics, family, k, spec) }); }
  return { candidates, winner: chooseWinner(candidates, spec) };
}
function frozenRepresentation(winner, rows, dictionary, dictionarySha256) {
  if (!winner) return null; const m = winner.metrics.model;
  return { schemaVersion: "PSRRE_FROZEN_REPRESENTATION_V1", studyId: "PSRRE-STUDY1", stageId: "PSRRE-S1-DEVELOPMENT-2026-08-30-v1", featureDictionarySha256: dictionarySha256,
    familyId: winner.familyId, K: winner.k, trainingRawStateKeysHash: digestObject(rows.map((r) => r.rawStateKey).sort()), scalerFeatureIds: m.scaler.featureIds,
    scalerMedianBinary64Hex: m.scaler.center.map(floatHex), scalerMadBinary64Hex: m.scaler.scale.map(floatHex), pcaMeanBinary64Hex: m.pca ? m.pca.mean.map(floatHex) : null,
    pcaLoadingsBinary64Hex: m.pca ? m.pca.loadings.map((r) => r.map(floatHex)) : null, prototypeBinary64Hex: m.prototypes.map((r) => r.map(floatHex)), prototypeKeys: m.prototypeKeys,
    canonicalRegimeLabels: Array.from({ length: winner.k }, (_, i) => `R${String(i + 1).padStart(2, "0")}`), trainingAssignmentHash: digestObject(m.assignments), trainingSupportByRegime: winner.metrics.support,
    meanSilhouette: winner.summary.meanSilhouette, fiveFoldAssignmentStability: winner.summary.fiveFoldAssignmentStability, sourcePolicyShareByRegime: winner.metrics.sourcePolicyShares,
    trainingPrototypeDistanceP99ByRegime: winner.metrics.trainingPrototypeDistanceP99ByRegime.map(floatHex), assignmentRule: "frozen median/MAD -> frozen PCA if applicable -> nearest frozen prototype; tie lower canonical regime label",
    serializationContract: "canonical JSON; scientific floats stored as big-endian IEEE754 binary64 lowercase hex" };
}

module.exports = { SEMANTICS, FAMILY_IDS: FAMILIES, stableStringify: canonical, sha256: digest, hashObject: digestObject, binary64Hex: floatHex, rawStateKey: rawKey,
  runGame: replayOne, generate, select, featureValues: calculateFeatures, analyzeSelected, fitScaler, fitFamily, applyModel, candidateMetrics, candidateEligible, candidateSummary, chooseWinner, evaluateAll, frozenRepresentation };
