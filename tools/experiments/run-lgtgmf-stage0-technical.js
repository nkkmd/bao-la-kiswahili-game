#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const engine = require("../../public/engine.js");
const prod = require("./lib/lgtgmf-production.js");

const STUDY_ID = "LGTGMF-STUDY1";
const STAGE_ID = "LGTGMF-S0-TECHNICAL-2026-08-31-v1";
const OUT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, "../../artifacts/local/local-game-tree-geometry-measurement-foundation/stage0-technical-v1");
const G2_05 = Object.freeze({
  rootRawKey: "2c13e69c51d58e2605bf6018ac848d99685aa4d4fe78c0af9f8e0fc07e1d3fd6",
  targetDepth: 2,
  cumulativeRawStates: 19,
  cumulativeEdges: 18,
  cumulativeRawStateSetSha256: "0a942b654f00265542c82b87f5dc53d685e96f3c0ef69a61fc574f90c6990a1f",
  cumulativeGlobalRawGraphEdgeSetSha256: "be534cbc3e99808a668483c21fca1720dc5ea5a7ac442075294f21a8542baea1",
});

function ensure(ok, message) { if (!ok) throw new Error(message); }
function graph(id, root, nodes) { return { id, root, nodes }; }
function fixtures() {
  return {
    T01: { depth: 0, graph: graph("T01-IDENTITY-TRIVIAL", "R", { R: { moves: [] } }) },
    T02: { depth: 2, graph: graph("T02-NO-TRANSPOSITION-SYNTHETIC", "R", {
      R:{moves:[{id:"a",to:"A"},{id:"b",to:"B"}]}, A:{moves:[{id:"c",to:"C"},{id:"d",to:"D"}]}, B:{moves:[{id:"e",to:"E"}]}, C:{moves:[]},D:{moves:[]},E:{moves:[]},
    }) },
    T03: { depth: 2, graph: graph("T03-KNOWN-TRANSPOSITION-SYNTHETIC", "R", {
      R:{moves:[{id:"a",to:"A"},{id:"b",to:"B"}]}, A:{moves:[{id:"c",to:"C"}]}, B:{moves:[{id:"d",to:"C"}]}, C:{moves:[]},
    }) },
    T04: { depth: 3, graph: graph("T04-KNOWN-RECONVERGENCE-SYNTHETIC", "R", {
      R:{moves:[{id:"a",to:"A"},{id:"b",to:"B"}]}, A:{moves:[{id:"c",to:"C"}]}, B:{moves:[{id:"d",to:"D"}]}, C:{moves:[{id:"e",to:"E"}]}, D:{moves:[{id:"f",to:"E"}]}, E:{moves:[]},
    }) },
    T05: { depth: 2, graph: graph("T05-BRANCH-EXPANSION-SYNTHETIC", "R", {
      R:{moves:[{id:"a",to:"A"}]}, A:{moves:[{id:"b",to:"B"},{id:"c",to:"C"},{id:"d",to:"D"}]}, B:{moves:[]},C:{moves:[]},D:{moves:[]},
    }) },
    T06: { depth: 2, graph: graph("T06-BRANCH-COMPRESSION-SYNTHETIC", "R", {
      R:{moves:[{id:"a",to:"A"},{id:"b",to:"B"},{id:"c",to:"C"}]}, A:{moves:[{id:"d",to:"D"}]},B:{moves:[{id:"e",to:"E"}]},C:{moves:[{id:"f",to:"F"}]},D:{moves:[]},E:{moves:[]},F:{moves:[]},
    }) },
    T07: { depth: 1, graph: graph("T07-TERMINAL-SYNTHETIC", "R", { R:{moves:[{id:"a",to:"T"}]}, T:{terminal:true,moves:[]} }) },
  };
}

function assertSynthetic(id, result) {
  if (id === "T01") ensure(result.layers[0].treeNodeOccurrences === "1" && result.layers[0].uniqueStateCount === 1, "T01 identity failure");
  if (id === "T02") ensure(result.layers[2].treeNodeOccurrences === "3" && result.layers[2].uniqueStateCount === 3 && result.parentLayers.every((x) => x.duplicateEncounterCount === 0), "T02 no-transposition failure");
  if (id === "T03") ensure(result.layers[2].treeNodeOccurrences === "2" && result.layers[2].uniqueStateCount === 1 && result.parentLayers[1].duplicateEncounterCount === 1 && result.parentLayers[1].multiParentStateCount === 1, "T03 transposition failure");
  if (id === "T04") ensure(result.firstReconvergenceDepth === 3 && result.layers[3].reconvergentStateCount === 1, "T04 reconvergence failure");
  if (id === "T05") ensure(result.parentLayers[0].widthExpansionCount === 1 && result.parentLayers[0].branchReopeningCount === 1, "T05 expansion failure");
  if (id === "T06") ensure(result.parentLayers[0].widthCompressionCount === 3, "T06 compression failure");
  if (id === "T07") ensure(result.parentLayers[0].branchExtinctionCount === 1, "T07 terminal failure");
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const initial = engine.initialState();
  const originalKey = prod.stateKey(initial);
  ensure(originalKey === G2_05.rootRawKey, "T00 initial RAW key mismatch");
  ensure(prod.representedSeeds(initial) === 64, "T00 seed invariant failure");
  const transient = engine.clone(initial); transient.turn = 999; transient.reason = "diagnostic-only";
  ensure(prod.stateKey(transient) === originalKey, "T00 transient field leakage");
  const missingPending = engine.clone(initial); delete missingPending.pending;
  let missingPendingRejected = false; try { prod.stateKey(missingPending); } catch (_) { missingPendingRejected = true; }
  ensure(missingPendingRejected, "T00 missing pending not rejected");

  const synth = {};
  for (const [id, fixture] of Object.entries(fixtures())) {
    const result = prod.syntheticMeasure(fixture.graph, fixture.depth, "ascending");
    assertSynthetic(id, result); synth[id] = result;
  }
  const t08Fixture = fixtures().T04;
  const t08 = ["ascending","descending","shuffled"].map((order) => prod.syntheticMeasure(t08Fixture.graph, t08Fixture.depth, order));
  ensure(new Set(t08.map((x) => x.coreSha256)).size === 1, "T08 traversal-order hash mismatch");

  const historical = prod.enumerateBaoLocal({ engine, rootState: initial, targetDepth: 2, traversalOrder: "ascending" });
  ensure(historical.complete === true, "T09 incomplete");
  ensure(historical.cumulative.distinctRawStates === G2_05.cumulativeRawStates, "T09 state count mismatch");
  ensure(historical.cumulative.uniqueGlobalTransitions === G2_05.cumulativeEdges, "T09 edge count mismatch");
  ensure(historical.cumulative.cumulativeRawStateSetSha256 === G2_05.cumulativeRawStateSetSha256, "T09 state hash mismatch");
  ensure(historical.cumulative.cumulativeGlobalRawGraphEdgeSetSha256 === G2_05.cumulativeGlobalRawGraphEdgeSetSha256, "T09 transition hash mismatch");
  const historicalOrders = ["descending","shuffled"].map((order) => prod.enumerateBaoLocal({ engine, rootState: initial, targetDepth: 2, traversalOrder: order }));
  ensure(historicalOrders.every((x) => x.measurementCoreSha256 === historical.measurementCoreSha256), "T09 Bao traversal-order mismatch");

  const result = {
    schemaVersion: 1,
    studyId: STUDY_ID,
    stageId: STAGE_ID,
    resultClass: "TECHNICAL-FIXTURE",
    scientificInferenceAuthorized: false,
    scientificSeedConsumption: "NONE",
    protectedStandardRootDepth10Generated: false,
    protectedStandardRootDepth10Read: false,
    productionPassed: true,
    T00: { rootRawKey: originalKey, representedSeeds: 64, transientFieldsExcluded: true, missingPendingRejected },
    synthetic: synth,
    T08: { orders: t08.map((x) => ({ order:x.traversalOrder, coreSha256:x.coreSha256 })), invariant: true },
    T09: { historicalReference: G2_05, measurement: historical, traversalInvariant: true },
    independentVerificationRequired: true,
  };
  result.productionSummarySha256 = prod.sha256Text(prod.stableStringify(result));
  fs.writeFileSync(path.join(OUT_DIR, "stage0-production-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`LGTGMF_STAGE0_PRODUCTION=${JSON.stringify({passed:true,stageId:STAGE_ID,productionSummarySha256:result.productionSummarySha256,measurementCoreSha256:historical.measurementCoreSha256,outDir:OUT_DIR})}`);
}
main();
