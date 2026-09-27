"use strict";

function need(value, message) { if (!value) throw new Error(message); }
function abs(x) { x = BigInt(x); return x < 0n ? -x : x; }
function gcd(a, b) { a = abs(a); b = abs(b); while (b !== 0n) { const r = a % b; a = b; b = r; } return a || 1n; }
function q(numerator, denominator = 1n) {
  let n = BigInt(numerator), d = BigInt(denominator);
  need(d !== 0n, "zero denominator");
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { numerator: String(n / g), denominator: String(d / g), defined: true };
}
function pair(x) { need(x && x.defined === true, "undefined rational"); return [BigInt(x.numerator), BigInt(x.denominator)]; }
function cmp(a, b) { const [an, ad] = pair(a), [bn, bd] = pair(b); const z = an * bd - bn * ad; return z < 0n ? -1 : z > 0n ? 1 : 0; }
function mulInt(a, n) { const [an, ad] = pair(a); return q(an * BigInt(n), ad); }
function choose(n, k) {
  n = BigInt(n); k = BigInt(k);
  if (k < 0n || k > n) return 0n;
  if (k > n - k) k = n - k;
  let out = 1n;
  for (let i = 1n; i <= k; i += 1n) out = out * (n - k + i) / i;
  return out;
}
function exactTwoSidedSignTest(positive, negative, zero = 0) {
  for (const [name, value] of Object.entries({ positive, negative, zero })) need(Number.isInteger(value) && value >= 0, `invalid ${name}`);
  const nonzero = positive + negative;
  if (nonzero === 0) return { positive, negative, zero, nonzero, estimable: false, pValue: q(1n) };
  const k = Math.min(positive, negative);
  let lower = 0n;
  for (let i = 0; i <= k; i += 1) lower += choose(nonzero, i);
  const denominator = 1n << BigInt(nonzero);
  const numerator = 2n * lower > denominator ? denominator : 2n * lower;
  return { positive, negative, zero, nonzero, estimable: true, pValue: q(numerator, denominator) };
}
function holm(rows, familySize = 24) {
  need(Array.isArray(rows) && rows.length === familySize, `exactly ${familySize} family rows required`);
  const sorted = rows.map((row) => ({ ...row })).sort((a, b) => cmp(a.pValue, b.pValue) || String(a.slotId).localeCompare(String(b.slotId)));
  let previous = q(0n);
  const map = new Map();
  for (let i = 0; i < sorted.length; i += 1) {
    let adjusted = mulInt(sorted[i].pValue, familySize - i);
    if (cmp(adjusted, q(1n)) > 0) adjusted = q(1n);
    if (cmp(adjusted, previous) < 0) adjusted = previous;
    previous = adjusted;
    map.set(sorted[i].slotId, { ...sorted[i], holmRank: i + 1, holmAdjustedPValue: adjusted });
  }
  return rows.map((row) => map.get(row.slotId));
}
function significant(row, alpha = q(1n, 20n)) { return cmp(row.holmAdjustedPValue, alpha) <= 0; }
function strictMajority(positive, negative) { return positive > negative ? 1 : negative > positive ? -1 : 0; }
function policyConcordant(direction, perPolicy) {
  need(direction === 1 || direction === -1, "direction must be nonzero");
  const rows = Object.values(perPolicy || {});
  return rows.length === 2 && rows.every((row) => strictMajority(row.positive, row.negative) === direction);
}
function decision({ estimable, holmSignificant, positive, negative, perPolicy }) {
  if (!estimable) return "NON-ESTIMABLE";
  if (!holmSignificant) return "NOT-CONFIRMED";
  const direction = strictMajority(positive, negative);
  if (direction === 1 && policyConcordant(1, perPolicy)) return "INCREASE-CONFIRMED";
  if (direction === -1 && policyConcordant(-1, perPolicy)) return "DECREASE-CONFIRMED";
  return "NOT-CONFIRMED";
}

module.exports = { q, cmp, exactTwoSidedSignTest, holm, significant, strictMajority, policyConcordant, decision };
