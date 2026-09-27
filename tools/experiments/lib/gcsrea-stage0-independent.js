"use strict";

const crypto = require("node:crypto");

function assertTrue(value, message) {
  if (!value) throw new Error(message);
}

function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
}

function hash(value) {
  return crypto.createHash("sha256").update(canonical(value), "utf8").digest("hex");
}

function q(n, d) {
  let a = BigInt(n);
  let b = BigInt(d);
  if (b === 0n) return { numerator: "0", denominator: "0", defined: false };
  if (b < 0n) { a = -a; b = -b; }
  const abs = (x) => x < 0n ? -x : x;
  let x = abs(a);
  let y = abs(b);
  while (y !== 0n) {
    const r = x % y;
    x = y;
    y = r;
  }
  const g = x === 0n ? 1n : x;
  return { numerator: String(a / g), denominator: String(b / g), defined: true };
}

function distinct(values) {
  const seen = new Set();
  for (const value of values) seen.add(value);
  return [...seen].sort();
}

function universe(result) {
  assertTrue(result && result.estimable === true, "independent: estimable result required");
  assertTrue(Array.isArray(result.ranking) && result.ranking.length >= 2, "independent: ranking required");
  const keys = distinct(result.ranking.map((row) => row.moveKey));
  assertTrue(keys.length === result.ranking.length, "independent: duplicate ranking key");
  return keys;
}

function sign(value) {
  return value < 0 ? -1 : value > 0 ? 1 : 0;
}

function preorderEqual(left, right) {
  const aKeys = universe(left);
  const bKeys = universe(right);
  assertTrue(canonical(aKeys) === canonical(bKeys), "independent: move universes differ");
  const a = Object.fromEntries(left.ranking.map((row) => [row.moveKey, row.score]));
  const b = Object.fromEntries(right.ranking.map((row) => [row.moveKey, row.score]));
  for (let i = 0; i < aKeys.length; i += 1) {
    for (let j = i + 1; j < aKeys.length; j += 1) {
      const x = aKeys[i];
      const y = aKeys[j];
      if (sign(a[x] - a[y]) !== sign(b[x] - b[y])) return false;
    }
  }
  return true;
}

function compareSets(leftValues, rightValues) {
  const left = distinct(leftValues);
  const right = distinct(rightValues);
  const rightLookup = new Set(right);
  const leftLookup = new Set(left);
  const common = left.filter((value) => rightLookup.has(value));
  const union = distinct(left.concat(right));
  const leftInsideRight = left.every((value) => rightLookup.has(value));
  const rightInsideLeft = right.every((value) => leftLookup.has(value));
  let classification = "DISJOINT";
  if (leftInsideRight && rightInsideLeft) classification = "EQUAL";
  else if (leftInsideRight) classification = "A-SUBSET-B";
  else if (rightInsideLeft) classification = "A-SUPERSET-B";
  else if (common.length) classification = "OVERLAP";
  return {
    classification,
    a: left,
    b: right,
    intersection: common,
    union,
    intersectionCount: common.length,
    unionCount: union.length,
    jaccard: q(common.length, union.length),
  };
}

function prefix2(result) {
  const rows = Array.isArray(result.pvMoveKeys) ? result.pvMoveKeys.slice(0, 2) : [];
  while (rows.length < 2) rows.push("<TERMINATED>");
  return rows;
}

function compareSearchOutputs(left, right) {
  const aKeys = universe(left);
  const bKeys = universe(right);
  assertTrue(canonical(aKeys) === canonical(bKeys), "independent: search move universes differ");
  const setRow = compareSets(left.topSetMoveKeys || [], right.topSetMoveKeys || []);
  return {
    canonicalBestEqual: left.canonicalBestMoveKey === right.canonicalBestMoveKey,
    topSetEqual: setRow.classification === "EQUAL",
    topSetRelation: setRow.classification,
    topSetIntersectionCount: setRow.intersectionCount,
    topSetUnionCount: setRow.unionCount,
    topSetJaccard: setRow.jaccard,
    rankingPreorderEqual: preorderEqual(left, right),
    pvPrefix2Equal: canonical(prefix2(left)) === canonical(prefix2(right)),
    completedDepthEqual: left.completedDepth === right.completedDepth,
  };
}

function orderedKeys(result) {
  universe(result);
  const rows = result.ranking.map((row) => ({ moveKey: row.moveKey, score: row.score }));
  rows.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return a.moveKey < b.moveKey ? -1 : a.moveKey > b.moveKey ? 1 : 0;
  });
  return rows.map((row) => row.moveKey);
}

function exactAgreement(searchResult, exactValues, requestedK = 3) {
  const legalKeys = universe(searchResult);
  const legalSet = new Set(legalKeys);
  const exact = distinct(exactValues);
  assertTrue(exact.length > 0, "independent: exact set must be nonempty");
  assertTrue(exact.every((key) => legalSet.has(key)), "independent: exact move outside legal universe");
  const searchSet = distinct(searchResult.topSetMoveKeys || []);
  assertTrue(searchSet.length > 0, "independent: TopSet must be nonempty");
  const setRow = compareSets(searchSet, exact);
  const ordered = orderedKeys(searchResult);
  const k = Math.max(1, Math.min(Number(requestedK), ordered.length));
  const top = ordered.slice(0, k);
  const exactLookup = new Set(exact);
  const covered = top.filter((key) => exactLookup.has(key));
  const pvFirst = Array.isArray(searchResult.pvMoveKeys) && searchResult.pvMoveKeys.length ? searchResult.pvMoveKeys[0] : null;
  return {
    exactMoveKeys: exact,
    exactMoveCount: exact.length,
    searchTopSetMoveKeys: searchSet,
    topSetVsExact: setRow.classification,
    topSetExactIntersectionCount: setRow.intersectionCount,
    topSetExactJaccard: setRow.jaccard,
    canonicalBestInExact: exactLookup.has(searchResult.canonicalBestMoveKey),
    topK: k,
    topKKeys: top,
    topKExactKeys: covered,
    topKExactCoverage: q(covered.length, exact.length),
    pvFirstMove: pvFirst,
    pvFirstInExact: pvFirst === null ? false : exactLookup.has(pvFirst),
  };
}

module.exports = {
  stable: canonical,
  digest: hash,
  fraction: q,
  setRelation: compareSets,
  rankingPreorderEqual: preorderEqual,
  compareSearchOutputs,
  exactAgreement,
};
