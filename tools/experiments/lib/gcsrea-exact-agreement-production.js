"use strict";

function need(value, message) { if (!value) throw new Error(message); }
function uniqueSorted(xs) { return [...new Set(xs)].sort(); }
function sameSet(a, b) {
  const x = uniqueSorted(a), y = uniqueSorted(b);
  return x.length === y.length && x.every((v, i) => v === y[i]);
}
function setRelation(searchTopSet, exactOptimalSet) {
  const s = uniqueSorted(searchTopSet), e = uniqueSorted(exactOptimalSet);
  need(s.length > 0 && e.length > 0, "nonempty sets required");
  const S = new Set(s), E = new Set(e);
  if (sameSet(s, e)) return "EQUAL";
  const sInE = s.every(x => E.has(x));
  const eInS = e.every(x => S.has(x));
  if (sInE) return "SEARCH-SUBSET-EXACT";
  if (eInS) return "SEARCH-SUPERSET-EXACT";
  if (s.some(x => E.has(x))) return "OVERLAP";
  return "DISJOINT";
}
function scoreRanks(ranking) {
  need(Array.isArray(ranking) && ranking.length > 0, "ranking required");
  const seen = new Set();
  for (const row of ranking) {
    need(row && typeof row.moveKey === "string" && Number.isSafeInteger(row.score), "invalid ranking row");
    need(!seen.has(row.moveKey), "duplicate moveKey");
    seen.add(row.moveKey);
  }
  const out = new Map();
  for (const row of ranking) {
    const better = ranking.filter(other => other.score > row.score).length;
    out.set(row.moveKey, better + 1);
  }
  return out;
}
function classify(search, exactOptimalMoveKeys) {
  need(search && search.estimable === true, "estimable search result required");
  const exact = uniqueSorted(exactOptimalMoveKeys);
  need(exact.length > 0, "exact optimal set required");
  need(typeof search.canonicalBestMoveKey === "string", "canonical best required");
  need(Array.isArray(search.topSetMoveKeys) && search.topSetMoveKeys.length > 0, "TopSet required");
  need(Array.isArray(search.ranking), "ranking required");
  const ranks = scoreRanks(search.ranking);
  for (const moveKey of exact) need(ranks.has(moveKey), `exact move absent from search universe: ${moveKey}`);
  const exactRanks = exact.map(moveKey => ranks.get(moveKey));
  const pvFirst = Array.isArray(search.pvMoveKeys) && search.pvMoveKeys.length ? search.pvMoveKeys[0] : null;
  return {
    canonicalBestInExactOptimalSet: exact.includes(search.canonicalBestMoveKey),
    topSetRelation: setRelation(search.topSetMoveKeys, exact),
    pvFirstMoveInExactOptimalSet: pvFirst === null ? null : exact.includes(pvFirst),
    exactOptimalBestRank: Math.min(...exactRanks),
    exactOptimalWorstRank: Math.max(...exactRanks),
    exactOptimalMoveCount: exact.length,
    searchTopSetCount: uniqueSorted(search.topSetMoveKeys).length
  };
}
function forcedClassification(soleLegalMoveKey, exactOptimalMoveKeys) {
  const exact = uniqueSorted(exactOptimalMoveKeys);
  need(typeof soleLegalMoveKey === "string" && exact.length > 0, "forced classification input invalid");
  need(exact.includes(soleLegalMoveKey), "sole legal move must be exact-optimal");
  return {
    measurementClass: "TRIVIAL-FORCED-LEGAL",
    searchHelperExecuted: false,
    canonicalBestMoveKey: soleLegalMoveKey,
    topSetMoveKeys: [soleLegalMoveKey],
    pvFirstMoveKey: soleLegalMoveKey,
    canonicalBestInExactOptimalSet: true,
    topSetRelation: setRelation([soleLegalMoveKey], exact),
    pvFirstMoveInExactOptimalSet: true,
    exactOptimalBestRank: 1,
    exactOptimalWorstRank: 1,
    exactOptimalMoveCount: exact.length,
    searchTopSetCount: 1
  };
}

module.exports = { uniqueSorted, sameSet, setRelation, scoreRanks, classify, forcedClassification };
