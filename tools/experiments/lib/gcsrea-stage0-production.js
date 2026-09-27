"use strict";

const crypto = require("node:crypto");

function need(value, message) {
  if (!value) throw new Error(message);
}

function stable(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(",")}}`;
}

function digest(value) {
  return crypto.createHash("sha256").update(stable(value), "utf8").digest("hex");
}

function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

function fraction(numerator, denominator) {
  let n = BigInt(numerator);
  let d = BigInt(denominator);
  if (d === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

function relation(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function moveUniverse(result) {
  need(result && result.estimable === true, "estimable search result required");
  need(Array.isArray(result.ranking) && result.ranking.length >= 2, "root ranking with >=2 moves required");
  const keys = uniqueSorted(result.ranking.map((row) => row.moveKey));
  need(keys.length === result.ranking.length, "duplicate move key in ranking");
  return keys;
}

function rankingPreorderEqual(a, b) {
  const keysA = moveUniverse(a);
  const keysB = moveUniverse(b);
  need(stable(keysA) === stable(keysB), "legal move universe differs");
  const A = new Map(a.ranking.map((row) => [row.moveKey, row.score]));
  const B = new Map(b.ranking.map((row) => [row.moveKey, row.score]));
  for (let i = 0; i < keysA.length; i += 1) {
    for (let j = i + 1; j < keysA.length; j += 1) {
      const x = keysA[i];
      const y = keysA[j];
      if (relation(A.get(x), A.get(y)) !== relation(B.get(x), B.get(y))) return false;
    }
  }
  return true;
}

function setRelation(aValues, bValues) {
  const a = uniqueSorted(aValues);
  const b = uniqueSorted(bValues);
  const A = new Set(a);
  const B = new Set(b);
  const intersection = a.filter((key) => B.has(key));
  const union = uniqueSorted([...a, ...b]);
  const aSubsetB = a.every((key) => B.has(key));
  const bSubsetA = b.every((key) => A.has(key));
  let classification;
  if (aSubsetB && bSubsetA) classification = "EQUAL";
  else if (aSubsetB) classification = "A-SUBSET-B";
  else if (bSubsetA) classification = "A-SUPERSET-B";
  else if (intersection.length > 0) classification = "OVERLAP";
  else classification = "DISJOINT";
  return {
    classification,
    a,
    b,
    intersection,
    union,
    intersectionCount: intersection.length,
    unionCount: union.length,
    jaccard: fraction(intersection.length, union.length),
  };
}

function pvPrefix2(result) {
  const out = (result.pvMoveKeys || []).slice(0, 2);
  while (out.length < 2) out.push("<TERMINATED>");
  return out;
}

function compareSearchOutputs(a, b) {
  need(a && b && a.estimable === true && b.estimable === true, "two estimable search results required");
  const keysA = moveUniverse(a);
  const keysB = moveUniverse(b);
  need(stable(keysA) === stable(keysB), "search comparison move universe differs");
  const topSet = setRelation(a.topSetMoveKeys || [], b.topSetMoveKeys || []);
  return {
    canonicalBestEqual: a.canonicalBestMoveKey === b.canonicalBestMoveKey,
    topSetEqual: topSet.classification === "EQUAL",
    topSetRelation: topSet.classification,
    topSetIntersectionCount: topSet.intersectionCount,
    topSetUnionCount: topSet.unionCount,
    topSetJaccard: topSet.jaccard,
    rankingPreorderEqual: rankingPreorderEqual(a, b),
    pvPrefix2Equal: stable(pvPrefix2(a)) === stable(pvPrefix2(b)),
    completedDepthEqual: a.completedDepth === b.completedDepth,
  };
}

function rankedMoveKeys(result) {
  moveUniverse(result);
  return result.ranking
    .slice()
    .sort((x, y) => y.score - x.score || x.moveKey.localeCompare(y.moveKey))
    .map((row) => row.moveKey);
}

function exactAgreement(searchResult, exactMoveKeys, topK = 3) {
  need(searchResult && searchResult.estimable === true, "estimable search result required");
  const universe = moveUniverse(searchResult);
  const exact = uniqueSorted(exactMoveKeys);
  need(exact.length > 0, "nonempty exact value-preserving set required");
  const legal = new Set(universe);
  need(exact.every((key) => legal.has(key)), "exact set contains nonlegal move");
  const topSet = uniqueSorted(searchResult.topSetMoveKeys || []);
  need(topSet.length > 0, "nonempty search TopSet required");
  const relationRow = setRelation(topSet, exact);
  const ranked = rankedMoveKeys(searchResult);
  const k = Math.max(1, Math.min(Number(topK), ranked.length));
  const topKKeys = ranked.slice(0, k);
  const exactSet = new Set(exact);
  const topKExactKeys = topKKeys.filter((key) => exactSet.has(key));
  const pvFirst = (searchResult.pvMoveKeys || [])[0] || null;
  return {
    exactMoveKeys: exact,
    exactMoveCount: exact.length,
    searchTopSetMoveKeys: topSet,
    topSetVsExact: relationRow.classification,
    topSetExactIntersectionCount: relationRow.intersectionCount,
    topSetExactJaccard: relationRow.jaccard,
    canonicalBestInExact: exactSet.has(searchResult.canonicalBestMoveKey),
    topK: k,
    topKKeys,
    topKExactKeys,
    topKExactCoverage: fraction(topKExactKeys.length, exact.length),
    pvFirstMove: pvFirst,
    pvFirstInExact: pvFirst === null ? false : exactSet.has(pvFirst),
  };
}

module.exports = {
  stable,
  digest,
  fraction,
  setRelation,
  rankingPreorderEqual,
  compareSearchOutputs,
  exactAgreement,
};
