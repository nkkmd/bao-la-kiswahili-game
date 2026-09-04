"use strict";

const fs = require("node:fs");
const path = require("node:path");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function directoryBytes(root) {
  let total = 0;
  if (!fs.existsSync(root)) return 0;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, entry.name);
    total += entry.isDirectory() ? directoryBytes(p) : fs.statSync(p).size;
  }
  return total;
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

function evaluateFinalResources({ core, profile, artifactBytes, elapsedSeconds, peakResidentSetBytes }) {
  const violations = [];
  const cumulative = core.cumulative || {};
  const use = core.resourceUse || {};
  if (cumulative.distinctRawStatesThroughLastCompleteDepth > profile.maxCumulativeDistinctRawStates) violations.push("UNIQUE_STATE_CAP");
  if (cumulative.depthLabelledLegalEdgesThroughLastCompleteParent > profile.maxDepthLabelledEdges) violations.push("DEPTH_LABELLED_EDGE_CAP");
  if (use.parentStateExpansions > profile.maxParentStateExpansions) violations.push("PARENT_EXPANSION_CAP");
  if (use.moveEvaluations > profile.maxMoveEvaluations) violations.push("MOVE_EVALUATION_CAP");
  if (BigInt(cumulative.treeNodeOccurrencesThroughLastCompleteDepth || "0") > BigInt(profile.maxCumulativeTreeNodeOccurrences)) violations.push("TREE_OCCURRENCE_CAP");
  if (peakResidentSetBytes >= profile.maxResidentSetBytes) violations.push("RSS_CAP");
  if (elapsedSeconds >= profile.maxWallClockSeconds) violations.push("WALL_CLOCK_CAP");
  if (artifactBytes > profile.maxUncompressedArtifactBytes) violations.push("ARTIFACT_BYTE_CAP");
  return {
    passed: violations.length === 0,
    violations,
    observed: { artifactBytes, elapsedSeconds, peakResidentSetBytes },
  };
}

function assertCompletionMetadata(core, targetDepth) {
  ensure(core.targetDepth === targetDepth, "target depth metadata mismatch");
  if (core.targetComplete) {
    ensure(core.lastCompleteDepth === targetDepth, "complete result has wrong lastCompleteDepth");
    ensure(core.firstIncompleteDepth === null, "complete result has firstIncompleteDepth");
    ensure(core.stopReason === null, "complete result has stopReason");
    ensure(core.layers.length === targetDepth + 1, "complete result layer count mismatch");
    ensure(core.parentLayers.length === targetDepth, "complete result parent-layer count mismatch");
  } else {
    ensure(Number.isInteger(core.lastCompleteDepth) && core.lastCompleteDepth < targetDepth, "incomplete result lastCompleteDepth invalid");
    ensure(core.firstIncompleteDepth === core.lastCompleteDepth + 1 || core.firstIncompleteDepth === 0,
      "incomplete result firstIncompleteDepth invalid");
    ensure(typeof core.stopReason === "string" && core.stopReason.length > 0, "incomplete result stopReason missing");
  }
  return true;
}

function exactTargets(core) {
  ensure(core.targetComplete === true && core.targetDepth === 10, "exact targets require complete depth-10 core");
  const d9 = core.layers.find((row) => row.depth === 9);
  const d10 = core.layers.find((row) => row.depth === 10);
  ensure(d9 && d10, "depth 9/10 layers required");
  const h1 = d10.newRawStateCount === d10.uniqueRawStateCount;
  const h2 = BigInt(d10.treeNodeOccurrences) > BigInt(d10.uniqueRawStateCount);
  const left = BigInt(d10.cumulativeTreeNodeOccurrences) * BigInt(d9.cumulativeRawStateCount);
  const right = BigInt(d9.cumulativeTreeNodeOccurrences) * BigInt(d10.cumulativeRawStateCount);
  const h3 = left > right;
  const h4 = d10.arrival.duplicateArrivalCount > 0 && d10.arrival.statesWithMultiplePredecessors > 0;
  return {
    H1: { condition: h1, exactComparison: `${d10.newRawStateCount} == ${d10.uniqueRawStateCount}` },
    H2: { condition: h2, exactComparison: `${d10.treeNodeOccurrences} > ${d10.uniqueRawStateCount}` },
    H3: { condition: h3, exactCrossProducts: { left: left.toString(), right: right.toString() } },
    H4: {
      condition: h4,
      duplicateArrivalCount: d10.arrival.duplicateArrivalCount,
      statesWithMultiplePredecessors: d10.arrival.statesWithMultiplePredecessors,
    },
  };
}

module.exports = {
  assertCompletionMetadata,
  directoryBytes,
  ensure,
  evaluateFinalResources,
  exactTargets,
  profileFromSpec,
};
