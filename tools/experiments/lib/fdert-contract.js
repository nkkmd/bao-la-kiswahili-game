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

function classifyDomain({ targetComplete, resourceGatePassed, integrityPassed, independentPassed, stopReason }) {
  if (targetComplete && resourceGatePassed && integrityPassed && independentPassed) {
    return "EXACT-WITHIN-FROZEN-DOMAIN";
  }
  const resourceStops = new Set([
    "UNIQUE_STATE_CAP",
    "DEPTH_LABELLED_EDGE_CAP",
    "PARENT_EXPANSION_CAP",
    "MOVE_EVALUATION_CAP",
    "TREE_OCCURRENCE_CAP",
    "RSS_CAP",
    "WALL_CLOCK_CAP",
    "ARTIFACT_BYTE_CAP",
    "ADMINISTRATIVE_CUTOFF",
  ]);
  if (!targetComplete && integrityPassed && resourceStops.has(stopReason)) return "NON-ESTIMABLE";
  return "TECHNICAL-INVALID";
}

module.exports = {
  assertCompletionMetadata,
  classifyDomain,
  directoryBytes,
  ensure,
  evaluateFinalResources,
};
