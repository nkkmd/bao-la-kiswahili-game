"use strict";

function assert(condition, message) { if (!condition) throw new Error(message); }
function normalize(n, d) {
  n = BigInt(n); d = BigInt(d);
  assert(d !== 0n, "denominator zero");
  if (d < 0n) { n = -n; d = -d; }
  let a = n < 0n ? -n : n, b = d;
  while (b !== 0n) [a, b] = [b, a % b];
  const g = a || 1n;
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function q(n, d = 1n) { return normalize(n, d); }
function compare(x, y) {
  assert(x && y && x.defined === true && y.defined === true, "rational undefined");
  const lhs = BigInt(x.numerator) * BigInt(y.denominator);
  const rhs = BigInt(y.numerator) * BigInt(x.denominator);
  return lhs < rhs ? -1 : lhs > rhs ? 1 : 0;
}
function timesInteger(x, k) { return normalize(BigInt(x.numerator) * BigInt(k), BigInt(x.denominator)); }
function lowerBinomialTail(n, k) {
  let coefficient = 1n;
  let total = 1n;
  for (let i = 1; i <= k; i += 1) {
    coefficient = coefficient * BigInt(n - i + 1) / BigInt(i);
    total += coefficient;
  }
  return total;
}
function exactTwoSidedSignTest(positive, negative, zero = 0) {
  assert([positive, negative, zero].every((v) => Number.isInteger(v) && v >= 0), "bad sign counts");
  const n = positive + negative;
  if (n === 0) return { positive, negative, zero, nonzero: 0, estimable: false, pValue: q(1n) };
  const tail = lowerBinomialTail(n, Math.min(positive, negative));
  const denominator = 2n ** BigInt(n);
  let numerator = 2n * tail;
  if (numerator > denominator) numerator = denominator;
  return { positive, negative, zero, nonzero: n, estimable: true, pValue: normalize(numerator, denominator) };
}
function holm(rows, familySize = 24) {
  assert(Array.isArray(rows) && rows.length === familySize, "Holm family size mismatch");
  const order = rows.map((row, index) => ({ row, index })).sort((a, b) => compare(a.row.pValue, b.row.pValue) || String(a.row.slotId).localeCompare(String(b.row.slotId)));
  const out = new Array(rows.length);
  let floor = q(0n);
  order.forEach(({ row, index }, rankIndex) => {
    let adjusted = timesInteger(row.pValue, familySize - rankIndex);
    if (compare(adjusted, q(1n)) > 0) adjusted = q(1n);
    if (compare(adjusted, floor) < 0) adjusted = floor;
    floor = adjusted;
    out[index] = { ...row, holmRank: rankIndex + 1, holmAdjustedPValue: adjusted };
  });
  return out;
}
function significant(row, alpha = q(1n, 20n)) { return compare(row.holmAdjustedPValue, alpha) <= 0; }
function majority(positive, negative) { return Math.sign(positive - negative); }
function policyConcordant(direction, perPolicy) {
  assert(direction === 1 || direction === -1, "nonzero direction required");
  const keys = Object.keys(perPolicy || {}).sort();
  if (keys.length !== 2) return false;
  for (const key of keys) if (majority(perPolicy[key].positive, perPolicy[key].negative) !== direction) return false;
  return true;
}
function decision(input) {
  if (!input.estimable) return "NON-ESTIMABLE";
  if (!input.holmSignificant) return "NOT-CONFIRMED";
  const direction = majority(input.positive, input.negative);
  if (direction > 0 && policyConcordant(1, input.perPolicy)) return "INCREASE-CONFIRMED";
  if (direction < 0 && policyConcordant(-1, input.perPolicy)) return "DECREASE-CONFIRMED";
  return "NOT-CONFIRMED";
}

module.exports = { q, cmp: compare, exactTwoSidedSignTest, holm, significant, strictMajority: majority, policyConcordant, decision };
