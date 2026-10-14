"use strict";
const assert = require("node:assert/strict");
function characterize(node, results) {
  assert.equal(node.winner, null); assert.ok(node.moves.length);
  const children = node.moves.map(m => results[m.to]);
  const known = children.every(c => c && (c.absoluteWinner === 0 || c.absoluteWinner === 1));
  const values = known ? children.map(c => c.absoluteWinner === node.player ? 1 : -1) : null;
  const dtfs = children.every(c => c && Number.isInteger(c.dtf) && c.dtf >= 0) ? children.map(c => c.dtf + 1) : null;
  return { raw: node.id, width: node.moves.length, valuesKnown: known,
    winLossContrast: known ? new Set(values).size > 1 : null,
    allChoiceWinLossRegretZero: known ? new Set(values).size === 1 : null,
    dtfContrast: dtfs ? new Set(dtfs).size > 1 : null };
}
function tailBound(n0, n1, epsilon) {
  assert.ok(epsilon > 0 && epsilon < 1);
  if (!Number.isInteger(n0) || !Number.isInteger(n1) || n0 < 1 || n1 < 1) return null;
  return Math.min(1, 2 * Math.exp(-2 * epsilon ** 2 / (1 / n0 + 1 / n1)));
}
function balancedMinimum(alpha, epsilon) {
  assert.ok(alpha > 0 && alpha < 1 && epsilon > 0 && epsilon < 1);
  return Math.ceil(Math.log(2 / alpha) / epsilon ** 2);
}
function representatives(rows) {
  const parent = rows.map((_,i) => i), sources = new Map(), components = new Map();
  const find = i => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
  rows.forEach((r,i) => {
    assert.ok(typeof r.raw === "string" && r.sourceId && r.componentId);
    for (const [map,id] of [[sources,r.sourceId],[components,r.componentId]]) {
      if (map.has(id)) parent[find(i)] = find(map.get(id)); else map.set(id,i);
    }
  });
  const groups = new Map();
  rows.forEach((r,i) => { const key = find(i), prior = groups.get(key);
    if (!prior || r.raw < prior.raw) groups.set(key,r);
  });
  return [...groups.values()].sort((a,b) => a.raw < b.raw ? -1 : 1);
}
function assess(rows, proposal, independentSamplingVerified = false) {
  const chosen = representatives(rows);
  const n0 = chosen.filter(r => r.rankingChanged === false).length;
  const n1 = chosen.filter(r => r.rankingChanged === true).length;
  const observed = chosen.filter(r => typeof r.positiveValueLoss === "boolean");
  const bound = tailBound(n0,n1,proposal.errorHalfWidth);
  const gates = {
    exactAndKnown: chosen.length > 0 && chosen.every(r => r.exactVerified === true && r.valuesKnown === true),
    freshHoldout: chosen.length > 0 && chosen.every(r => r.freshHoldout === true),
    potentialWinLossContrast: chosen.some(r => r.winLossContrast === true),
    rankingMeasured: chosen.length > 0 && n0 + n1 === chosen.length,
    lossMeasured: chosen.length > 0 && observed.length === chosen.length,
    observedLossVariation: observed.some(r => r.positiveValueLoss === true) && observed.some(r => r.positiveValueLoss === false),
    independentSampling: independentSamplingVerified === true,
    conditionalPrecision: bound !== null && bound <= proposal.alpha
  };
  return { decision: Object.values(gates).every(Boolean) ? "DESIGN-CHECK-PASS-NOT-AUTHORIZATION" : "PRIMARY-READINESS-NOT-MET",
    representativeCount: chosen.length, n0, n1, conditionalTailBound: bound,
    balancedMinimumPerGroup: balancedMinimum(proposal.alpha,proposal.errorHalfWidth), gates,
    failedGates: Object.keys(gates).filter(k => !gates[k]), formalAuthorization: false };
}
module.exports = { characterize, tailBound, balancedMinimum, representatives, assess };
