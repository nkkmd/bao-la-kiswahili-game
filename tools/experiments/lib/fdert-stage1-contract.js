"use strict";

const crypto = require("node:crypto");
const baseContract = require("./fdert-contract.js");

function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
}

function hashCanonical(value) {
  return crypto.createHash("sha256").update(canonical(value), "utf8").digest("hex");
}

function profileFromSpec(spec) {
  const p = spec.resourceProfile;
  return Object.freeze({
    maxCumulativeDistinctRawStates: p.maxCumulativeDistinctRawStates,
    maxDepthLabelledEdges: p.maxDepthLabelledEdges,
    maxParentStateExpansions: p.maxParentStateExpansions,
    maxMoveEvaluations: p.maxMoveEvaluations,
    maxCumulativeTreeNodeOccurrences: p.maxCumulativeTreeNodeOccurrences,
    maxResidentSetBytes: p.maxResidentSetBytes,
    maxWallClockSeconds: p.maxWallClockSeconds,
    maxUncompressedArtifactBytes: p.maxUncompressedArtifactBytes,
  });
}

function targetValues(summary) {
  baseContract.ensure(summary.targetComplete === true && summary.targetDepth === 11, "depth-11 targets require complete target");
  const d10 = summary.layers.find((r) => r.depth === 10);
  const d11 = summary.layers.find((r) => r.depth === 11);
  baseContract.ensure(d10 && d11, "depth 10/11 layers missing");
  const left = BigInt(d11.cumulativeTreeNodeOccurrences) * BigInt(d10.cumulativeRawStateCount);
  const right = BigInt(d10.cumulativeTreeNodeOccurrences) * BigInt(d11.cumulativeRawStateCount);
  return {
    T1: {
      condition: d11.newRawStateCount === d11.uniqueRawStateCount,
      exactComparison: `${d11.newRawStateCount} == ${d11.uniqueRawStateCount}`,
    },
    T2: {
      condition: BigInt(d11.treeNodeOccurrences) > BigInt(d11.uniqueRawStateCount),
      exactComparison: `${d11.treeNodeOccurrences} > ${d11.uniqueRawStateCount}`,
    },
    T3: {
      condition: left > right,
      exactCrossProducts: { left: left.toString(), right: right.toString() },
    },
    T4: {
      condition: d11.arrival.duplicateArrivalCount > 0 && d11.arrival.statesWithMultiplePredecessors > 0,
      duplicateArrivalCount: d11.arrival.duplicateArrivalCount,
      statesWithMultiplePredecessors: d11.arrival.statesWithMultiplePredecessors,
    },
  };
}

function labelTargets(targets) {
  return Object.fromEntries(Object.entries(targets).map(([key, value]) => [key, {
    ...value,
    decision: value.condition ? "DEEPER-CONFIRMED" : "COUNTEREXAMPLE-BOUNDARY",
  }]));
}

function nonEstimableTargets() {
  return {
    T1: { decision: "NON-ESTIMABLE" },
    T2: { decision: "NON-ESTIMABLE" },
    T3: { decision: "NON-ESTIMABLE" },
    T4: { decision: "NON-ESTIMABLE" },
  };
}

function layerProjection(row) {
  return {
    depth: row.depth,
    uniqueRawStateCount: row.uniqueRawStateCount,
    newRawStateCount: row.newRawStateCount,
    cumulativeRawStateCount: row.cumulativeRawStateCount,
    treeNodeOccurrences: row.treeNodeOccurrences,
    cumulativeTreeNodeOccurrences: row.cumulativeTreeNodeOccurrences,
    stateSetSha256: row.stateSetSha256,
    arrival: row.arrival,
  };
}

function parentProjection(row) {
  return {
    depth: row.depth,
    uniqueParentRawStateCount: row.uniqueParentRawStateCount,
    legalEdgeCount: row.legalEdgeCount,
    treeEdgeOccurrences: row.treeEdgeOccurrences,
    branchingDistribution: row.branchingDistribution,
    edgeSetSha256: row.edgeSetSha256,
  };
}

function prefixProjection(summary, throughDepth) {
  return {
    rootStateKey: summary.rootStateKey,
    layers: summary.layers.filter((r) => r.depth <= throughDepth).map(layerProjection),
    parentLayers: summary.parentLayers.filter((r) => r.depth < throughDepth).map(parentProjection),
  };
}

function historicalPrefixProjection(formalResult) {
  const core = formalResult.scientificCore;
  baseContract.ensure(core && core.targetDepth === 10, "historical depth-10 scientific core missing");
  return {
    rootStateKey: core.rootRawStateKey,
    layers: core.layers.filter((r) => r.depth <= 10).map(layerProjection),
    parentLayers: core.parentLayers.filter((r) => r.depth < 10).map(parentProjection),
  };
}

function verifyHistoricalPrefix(currentSummary, historicalFormalResult) {
  const current = prefixProjection(currentSummary, 10);
  const historical = historicalPrefixProjection(historicalFormalResult);
  baseContract.ensure(canonical(current) === canonical(historical), "G4-10 reconstructed 0..10 prefix differs from historical G3-11 canonical exact prefix");
  return {
    passed: true,
    currentPrefixSha256: hashCanonical(current),
    historicalPrefixSha256: hashCanonical(historical),
  };
}

function completePrefixProjection(summary, throughDepth) {
  return {
    rootStateKey: summary.rootStateKey,
    layers: summary.layers.filter((r) => r.depth <= throughDepth).map(layerProjection),
    parentLayers: summary.parentLayers.filter((r) => r.depth < throughDepth).map(parentProjection),
  };
}

module.exports = {
  ...baseContract,
  canonical,
  completePrefixProjection,
  hashCanonical,
  historicalPrefixProjection,
  labelTargets,
  nonEstimableTargets,
  prefixProjection,
  profileFromSpec,
  targetValues,
  verifyHistoricalPrefix,
};
