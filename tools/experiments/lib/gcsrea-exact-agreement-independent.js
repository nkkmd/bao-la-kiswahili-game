"use strict";

function assert(value, message) { if (!value) throw new Error(`independent:${message}`); }
function normalize(values) {
  const out = [];
  for (const value of values) if (!out.includes(value)) out.push(value);
  out.sort();
  return out;
}
function relation(searchTopSet, exactOptimalSet) {
  const s = normalize(searchTopSet), e = normalize(exactOptimalSet);
  assert(s.length > 0 && e.length > 0, "nonempty sets required");
  const inExact = value => e.indexOf(value) >= 0;
  const inSearch = value => s.indexOf(value) >= 0;
  if (s.length === e.length && s.every((value, index) => value === e[index])) return "EQUAL";
  if (s.every(inExact)) return "SEARCH-SUBSET-EXACT";
  if (e.every(inSearch)) return "SEARCH-SUPERSET-EXACT";
  if (s.some(inExact)) return "OVERLAP";
  return "DISJOINT";
}
function ranks(rows) {
  assert(Array.isArray(rows) && rows.length > 0, "ranking required");
  const keys = [];
  for (const row of rows) {
    assert(row && typeof row.moveKey === "string" && Number.isSafeInteger(row.score), "invalid ranking row");
    assert(!keys.includes(row.moveKey), "duplicate moveKey");
    keys.push(row.moveKey);
  }
  const out = {};
  for (const row of rows) {
    let better = 0;
    for (const other of rows) if (other.score > row.score) better += 1;
    out[row.moveKey] = better + 1;
  }
  return out;
}
function classify(search, exactOptimalMoveKeys) {
  assert(search && search.estimable === true, "estimable search result required");
  const exact = normalize(exactOptimalMoveKeys);
  assert(exact.length > 0, "exact optimal set required");
  assert(typeof search.canonicalBestMoveKey === "string", "canonical best required");
  assert(Array.isArray(search.topSetMoveKeys) && search.topSetMoveKeys.length > 0, "TopSet required");
  const rankMap = ranks(search.ranking);
  const exactRanks = [];
  for (const moveKey of exact) {
    assert(Object.prototype.hasOwnProperty.call(rankMap, moveKey), `exact move absent from search universe: ${moveKey}`);
    exactRanks.push(rankMap[moveKey]);
  }
  let best = exactRanks[0], worst = exactRanks[0];
  for (const value of exactRanks) { if (value < best) best = value; if (value > worst) worst = value; }
  const pvFirst = Array.isArray(search.pvMoveKeys) && search.pvMoveKeys.length > 0 ? search.pvMoveKeys[0] : null;
  return {
    canonicalBestInExactOptimalSet: exact.indexOf(search.canonicalBestMoveKey) >= 0,
    topSetRelation: relation(search.topSetMoveKeys, exact),
    pvFirstMoveInExactOptimalSet: pvFirst === null ? null : exact.indexOf(pvFirst) >= 0,
    exactOptimalBestRank: best,
    exactOptimalWorstRank: worst,
    exactOptimalMoveCount: exact.length,
    searchTopSetCount: normalize(search.topSetMoveKeys).length
  };
}
function forcedClassification(soleLegalMoveKey, exactOptimalMoveKeys) {
  const exact = normalize(exactOptimalMoveKeys);
  assert(typeof soleLegalMoveKey === "string" && exact.length > 0, "forced classification input invalid");
  assert(exact.indexOf(soleLegalMoveKey) >= 0, "sole legal move must be exact-optimal");
  return {
    measurementClass: "TRIVIAL-FORCED-LEGAL",
    searchHelperExecuted: false,
    canonicalBestMoveKey: soleLegalMoveKey,
    topSetMoveKeys: [soleLegalMoveKey],
    pvFirstMoveKey: soleLegalMoveKey,
    canonicalBestInExactOptimalSet: true,
    topSetRelation: relation([soleLegalMoveKey], exact),
    pvFirstMoveInExactOptimalSet: true,
    exactOptimalBestRank: 1,
    exactOptimalWorstRank: 1,
    exactOptimalMoveCount: exact.length,
    searchTopSetCount: 1
  };
}

module.exports = { normalize, relation, ranks, classify, forcedClassification };
