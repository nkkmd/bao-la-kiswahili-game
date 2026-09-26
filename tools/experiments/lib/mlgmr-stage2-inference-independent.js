"use strict";

function assert(condition, message) { if (!condition) throw new Error(message); }
function reduce(num, den) {
  let a = num < 0n ? -num : num;
  let b = den < 0n ? -den : den;
  while (b) { const r = a % b; a = b; b = r; }
  const g = a || 1n;
  if (den < 0n) { num = -num; den = -den; }
  return { numerator: String(num / g), denominator: String(den / g), defined: true };
}
function rational(num, den = 1n) {
  num = BigInt(num); den = BigInt(den);
  assert(den !== 0n, "zero denominator");
  return reduce(num, den);
}
function compare(left, right) {
  assert(left && left.defined === true && right && right.defined === true, "undefined rational");
  const l = BigInt(left.numerator) * BigInt(right.denominator);
  const r = BigInt(right.numerator) * BigInt(left.denominator);
  return l < r ? -1 : l > r ? 1 : 0;
}
function binomialRow(n) {
  const row = [1n];
  for (let k = 1; k <= n; k++) row[k] = row[k - 1] * BigInt(n - k + 1) / BigInt(k);
  return row;
}
function exactTwoSidedSignTest(positive, negative, zero = 0) {
  assert(Number.isInteger(positive) && positive >= 0, "bad positive");
  assert(Number.isInteger(negative) && negative >= 0, "bad negative");
  assert(Number.isInteger(zero) && zero >= 0, "bad zero");
  const nonzero = positive + negative;
  if (nonzero === 0) return { positive, negative, zero, nonzero, estimable: false, pValue: rational(1n) };
  const coefficients = binomialRow(nonzero);
  const cutoff = Math.min(positive, negative);
  let mass = 0n;
  for (let i = 0; i <= cutoff; i++) mass += coefficients[i];
  const total = coefficients.reduce((sum, x) => sum + x, 0n);
  const doubled = 2n * mass;
  return {
    positive,
    negative,
    zero,
    nonzero,
    estimable: true,
    pValue: rational(doubled > total ? total : doubled, total)
  };
}
function multiply(r, factor) {
  return rational(BigInt(r.numerator) * BigInt(factor), BigInt(r.denominator));
}
function holm(rows, familySize = 16) {
  assert(Array.isArray(rows) && rows.length === familySize, "family size mismatch");
  const order = [...rows].sort((x, y) => compare(x.pValue, y.pValue) || String(x.slotId).localeCompare(String(y.slotId)));
  const adjusted = new Map();
  let floor = rational(0n);
  for (let index = 0; index < order.length; index++) {
    let value = multiply(order[index].pValue, familySize - index);
    if (compare(value, rational(1n)) > 0) value = rational(1n);
    if (compare(value, floor) < 0) value = floor;
    floor = value;
    adjusted.set(order[index].slotId, { ...order[index], holmRank: index + 1, holmAdjustedPValue: value });
  }
  return rows.map(row => adjusted.get(row.slotId));
}
function significantAtFamilyAlpha(row) {
  return compare(row.holmAdjustedPValue, rational(1n, 20n)) <= 0;
}
function decision(input) {
  if (!input.estimable) return "NON-ESTIMABLE";
  if (!input.holmSignificant) return "NOT-CONFIRMED";
  return input.positive > input.negative
    ? "PERSISTENCE-CONFIRMED"
    : input.negative > input.positive
      ? "REVERSAL-CONFIRMED"
      : "NOT-CONFIRMED";
}

module.exports = { q: rational, cmp: compare, exactTwoSidedSignTest, holm, significantAtFamilyAlpha, decision };
