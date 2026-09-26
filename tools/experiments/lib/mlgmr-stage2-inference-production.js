"use strict";

function need(value, message) { if (!value) throw new Error(message); }
function gcd(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) { const t = a % b; a = b; b = t; }
  return a || 1n;
}
function q(numerator, denominator = 1n) {
  let n = BigInt(numerator), d = BigInt(denominator);
  need(d !== 0n, "zero denominator");
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function pair(x) {
  need(x && x.defined === true, "undefined rational");
  return [BigInt(x.numerator), BigInt(x.denominator)];
}
function cmp(a, b) {
  const [an, ad] = pair(a), [bn, bd] = pair(b);
  const z = an * bd - bn * ad;
  return z < 0n ? -1 : z > 0n ? 1 : 0;
}
function mulInt(a, n) {
  const [an, ad] = pair(a);
  return q(an * BigInt(n), ad);
}
function choose(n, k) {
  n = BigInt(n); k = BigInt(k);
  if (k < 0n || k > n) return 0n;
  if (k > n - k) k = n - k;
  let out = 1n;
  for (let i = 1n; i <= k; i++) out = out * (n - k + i) / i;
  return out;
}
function exactTwoSidedSignTest(positive, negative, zero = 0) {
  positive = Number(positive); negative = Number(negative); zero = Number(zero);
  need(Number.isInteger(positive) && positive >= 0, "invalid positive");
  need(Number.isInteger(negative) && negative >= 0, "invalid negative");
  need(Number.isInteger(zero) && zero >= 0, "invalid zero");
  const nonzero = positive + negative;
  if (nonzero === 0) return { positive, negative, zero, nonzero, estimable: false, pValue: q(1n) };
  const k = Math.min(positive, negative);
  let lower = 0n;
  for (let i = 0; i <= k; i++) lower += choose(nonzero, i);
  const denominator = 1n << BigInt(nonzero);
  let numerator = 2n * lower;
  if (numerator > denominator) numerator = denominator;
  return { positive, negative, zero, nonzero, estimable: true, pValue: q(numerator, denominator) };
}
function holm(rows, familySize = 16) {
  need(Array.isArray(rows) && rows.length === familySize, `exactly ${familySize} family rows required`);
  const sorted = rows.map(row => ({ ...row })).sort((a, b) => cmp(a.pValue, b.pValue) || String(a.slotId).localeCompare(String(b.slotId)));
  const byId = new Map();
  let previous = q(0n);
  for (let i = 0; i < sorted.length; i++) {
    const raw = mulInt(sorted[i].pValue, familySize - i);
    const capped = cmp(raw, q(1n)) > 0 ? q(1n) : raw;
    const adjusted = cmp(capped, previous) < 0 ? previous : capped;
    previous = adjusted;
    byId.set(sorted[i].slotId, { ...sorted[i], holmRank: i + 1, holmAdjustedPValue: adjusted });
  }
  return rows.map(row => byId.get(row.slotId));
}
function significantAtFamilyAlpha(row) {
  return cmp(row.holmAdjustedPValue, q(1n, 20n)) <= 0;
}
function decision({ estimable, holmSignificant, positive, negative }) {
  if (!estimable) return "NON-ESTIMABLE";
  if (!holmSignificant) return "NOT-CONFIRMED";
  if (positive > negative) return "PERSISTENCE-CONFIRMED";
  if (negative > positive) return "REVERSAL-CONFIRMED";
  return "NOT-CONFIRMED";
}

module.exports = { q, cmp, exactTwoSidedSignTest, holm, significantAtFamilyAlpha, decision };
