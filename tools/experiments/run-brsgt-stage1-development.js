#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const P = require("./lib/brsgt-production.js");
const I = require("./lib/brsgt-independent.js");
const TP = require("./lib/lgttci-compatibility-production.js");
const TI = require("./lib/lgttci-compatibility-independent.js");
const FW = require("./lib/brsgt-stage1-firewall.js");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/rule-semantic-geometry-transition");
const SPEC = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STAGE_1_DEVELOPMENT_SPEC.json"), "utf8"));
const FIREWALL = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/UPSTREAM_IDENTITY_FIREWALL.json"), "utf8"));
const AUTH = JSON.parse(fs.readFileSync(path.join(DOC, "authorizations/STAGE_1_AUTHORIZATION.json"), "utf8"));

const FAMILIES = [
  "BRSGT-E1-CAPTURE",
  "BRSGT-E2-NYUMBA-USE-VS-STOP",
  "BRSGT-E3-RESERVE-DECREMENT-NONTRANSITION",
  "BRSGT-E4-NAMUA-TO-MTAJI",
];
const METRICS = P.METRICS.slice();

function need(value, message) { if (!value) throw new Error(message); }
function clone(value) { return JSON.parse(JSON.stringify(value)); }
function stable(value) { return FW.stable(value); }
function same(a, b, message) { need(stable(a) === stable(b), message); }
function sha256Text(value) { return crypto.createHash("sha256").update(String(value), "utf8").digest("hex"); }
function countInc(object, key) { object[key] = (object[key] || 0) + 1; }
function policyFor(seed) { return ((seed - SPEC.seedBlock.start) % 2 === 0) ? TP.P1 : TP.P2; }
function outputDir() {
  const i = process.argv.indexOf("--output");
  return i >= 0 ? path.resolve(process.argv[i + 1]) : path.join(DOC, "results/stage-1");
}
function writeJson(file, object) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const text = JSON.stringify(object, null, 2) + "\n";
  fs.writeFileSync(file, text);
  return { sha256: sha256Text(text), bytes: Buffer.byteLength(text) };
}
function publicReplay(replay) {
  return {
    policyId: replay.policyId,
    seed: replay.seed,
    moveKeys: replay.moveKeys,
    trajectorySha256: replay.trajectorySha256,
    terminal: replay.terminal,
    rows: replay.rows.map((row) => ({
      ply: row.ply,
      phase: row.phase,
      terminal: row.terminal,
      rootLegalWidth: row.rootLegalWidth,
      rawStateSha256: row.rawStateSha256,
    })),
  };
}
function replayResult(lib, policyId, seed) {
  try { return { ok: true, value: lib.replay(E, policyId, seed, SPEC.sourceTrajectory.maxPly) }; }
  catch (error) { return { ok: false, error: String(error && error.message ? error.message : error) }; }
}
function openingPrefixSha(replay) { return TP.digest(replay.moveKeys.slice(0, 16).join("\n")); }
function reachableRows(replay) {
  const initial = E.initialState();
  const rows = [{ ply: 0, rawStateSha256: TP.stateKey(initial), state: initial, terminal: false }];
  for (const row of replay.rows) rows.push({ ply: row.ply, rawStateSha256: row.rawStateSha256, state: row.state, terminal: row.terminal });
  return rows;
}
function identityRow(policyId, seed, replay, prefix) {
  return {
    policyId,
    sourceSeed: seed,
    sourceTrajectorySha256: replay.trajectorySha256,
    openingPrefixSha256: prefix,
    moveCount: replay.moveKeys.length,
    reachableRoots: reachableRows(replay).map((row) => ({ ply: row.ply, rootRawSha256: row.rawStateSha256 })),
  };
}
function firewallCollision(sets, seed, replay, prefix) {
  if (sets.seed.has(String(seed))) return "EXCLUDED-SEED";
  if (sets.trajectory.has(replay.trajectorySha256)) return "UPSTREAM-TRAJECTORY";
  if (sets.prefix.has(prefix)) return "UPSTREAM-OPENING-PREFIX";
  for (const row of reachableRows(replay)) if (sets.root.has(row.rawStateSha256)) return "UPSTREAM-REACHABLE-RAW-ROOT";
  return null;
}
function preStates(replay) {
  const initial = E.initialState();
  const out = [{ eventPly: 1, state: initial, rawStateSha256: TP.stateKey(initial) }];
  for (const row of replay.rows) {
    if (row.ply >= SPEC.sourceTrajectory.maxPly || row.terminal) continue;
    out.push({ eventPly: row.ply + 1, state: row.state, rawStateSha256: row.rawStateSha256 });
  }
  return out;
}
function relayLimit(state) { return Boolean(state && state.reason === "relay-limit"); }
function publicCandidate(candidate) {
  if (!candidate) return null;
  if (candidate.eventFamily === "BRSGT-E2-NYUMBA-USE-VS-STOP") {
    return {
      eventFamily: candidate.eventFamily,
      eventPly: candidate.eventPly,
      canonicalEventKey: candidate.canonicalEventKey,
      preRawSha256: candidate.preRawSha256,
      stopMoveKey: candidate.stopMoveKey,
      useMoveKey: candidate.useMoveKey,
      stopPostRawSha256: candidate.stopPostRawSha256,
      usePostRawSha256: candidate.usePostRawSha256,
    };
  }
  return {
    eventFamily: candidate.eventFamily,
    eventPly: candidate.eventPly,
    canonicalEventKey: candidate.canonicalEventKey,
    preRawSha256: candidate.preRawSha256,
    postRawSha256: candidate.postRawSha256,
    compoundLabelVector: candidate.compoundLabelVector,
  };
}
function extractCandidates(lib, replay) {
  const found = Object.fromEntries(FAMILIES.map((family) => [family, null]));
  for (const pre of preStates(replay)) {
    if (!found["BRSGT-E2-NYUMBA-USE-VS-STOP"]) {
      const pair = lib.nyumbaPairs(E, pre.state).find((row) => !relayLimit(row.stop.post) && !relayLimit(row.use.post));
      if (pair) {
        found["BRSGT-E2-NYUMBA-USE-VS-STOP"] = {
          eventFamily: "BRSGT-E2-NYUMBA-USE-VS-STOP",
          eventPly: pre.eventPly,
          canonicalEventKey: pair.physicalMoveKey,
          preRawSha256: lib.stateKey(pre.state),
          preState: clone(pre.state),
          stopMoveKey: lib.moveKey(pair.stop.move),
          useMoveKey: lib.moveKey(pair.use.move),
          stopPostRawSha256: lib.stateKey(pair.stop.post),
          usePostRawSha256: lib.stateKey(pair.use.post),
          stopPostState: clone(pair.stop.post),
          usePostState: clone(pair.use.post),
        };
      }
    }
    const moves = lib.canonicalMoves(E, pre.state);
    for (const moveRow of moves) {
      const transition = lib.applyComplete(E, pre.state, moveRow.move);
      if (relayLimit(transition.post)) continue;
      const labels = lib.eventLabels(transition);
      for (const family of [FAMILIES[0], FAMILIES[2], FAMILIES[3]]) {
        if (!found[family] && labels.includes(family)) {
          found[family] = {
            eventFamily: family,
            eventPly: pre.eventPly,
            canonicalEventKey: moveRow.key,
            preRawSha256: lib.stateKey(pre.state),
            postRawSha256: lib.stateKey(transition.post),
            compoundLabelVector: labels.slice(),
            preState: clone(pre.state),
            postState: clone(transition.post),
          };
        }
      }
      if (found[FAMILIES[0]] && found[FAMILIES[2]] && found[FAMILIES[3]]) break;
    }
    if (FAMILIES.every((family) => found[family])) break;
  }
  return found;
}
function candidateRoots(candidate) {
  if (candidate.eventFamily === FAMILIES[1]) {
    return [
      { role: "common-pre", state: candidate.preState },
      { role: "stop-post", state: candidate.stopPostState },
      { role: "use-post", state: candidate.usePostState },
    ];
  }
  return [{ role: "pre", state: candidate.preState }, { role: "post", state: candidate.postState }];
}
function rawLimits() {
  const source = SPEC.resourceCeilings.perDepth5Root;
  return {
    globalDistinctRawStates: source.maxDistinctRawStates,
    uniqueCanonicalTransitions: source.maxUniqueTransitions,
    parentExpansions: source.maxParentExpansions,
    legalMoveVariantsEnumerated: source.maxLegalMoveEvaluations,
    treeNodeOccurrences: source.maxTreeNodeOccurrences,
  };
}
function preflightCandidate(candidateP, candidateI, seed) {
  const rootsP = candidateRoots(candidateP);
  const rootsI = candidateRoots(candidateI);
  need(rootsP.length === rootsI.length, "candidate root count mismatch");
  const rows = [];
  let eligible = true;
  for (let index = 0; index < rootsP.length; index += 1) {
    need(rootsP[index].role === rootsI[index].role, "candidate root role mismatch");
    need(P.stateKey(rootsP[index].state) === I.stateKey(rootsI[index].state), "candidate root RAW mismatch");
    const started = Date.now();
    const a = TP.preflightContinuous(E, rootsP[index].state, seed, candidateP.eventPly, rawLimits());
    const b = TI.preflightContinuous(E, rootsI[index].state, seed, candidateI.eventPly, rawLimits());
    const elapsedMs = Date.now() - started;
    same(a, b, `preflight production/independent mismatch seed=${seed} family=${candidateP.eventFamily} role=${rootsP[index].role}`);
    need(elapsedMs <= SPEC.resourceCeilings.perDepth5Root.elapsedMs, `preflight root elapsed ceiling exceeded seed=${seed}`);
    rows.push({ role: rootsP[index].role, eligible: a.eligible, reasonCode: a.reasonCode, counters: a.counters, elapsedMs });
    if (!a.eligible) eligible = false;
  }
  return { eligible, rows };
}
function candidateOrder(a, b) {
  return a.sourceSeed - b.sourceSeed || a.eventPly - b.eventPly || a.canonicalEventKey.localeCompare(b.canonicalEventKey);
}
function measureCandidate(entry, cache) {
  const rootsP = candidateRoots(entry.production);
  const rootsI = candidateRoots(entry.independent);
  const measured = {};
  for (let index = 0; index < rootsP.length; index += 1) {
    const role = rootsP[index].role;
    const keyP = P.stateKey(rootsP[index].state);
    const keyI = I.stateKey(rootsI[index].state);
    need(keyP === keyI, "measurement root RAW mismatch");
    let row = cache.get(keyP);
    if (!row) {
      need(cache.size < SPEC.resourceCeilings.maxGeometryRoots, "geometry root ceiling exceeded");
      const started = Date.now();
      const production = P.measureState(E, rootsP[index].state, `S1:${entry.sourceSeed}:${entry.eventFamily}:${role}`);
      const independent = I.measureState(E, rootsI[index].state, `S1:${entry.sourceSeed}:${entry.eventFamily}:${role}`);
      const elapsedMs = Date.now() - started;
      need(elapsedMs <= SPEC.resourceCeilings.perDepth5Root.elapsedMs, `measurement root elapsed ceiling exceeded seed=${entry.sourceSeed}`);
      need(production.reconstructionCoreSha256 === independent.reconstructionCoreSha256, "reconstruction core hash mismatch");
      same(production.familyCoreSha256, independent.familyCoreSha256, "family core hash mismatch");
      same(production.endpoint, independent.endpoint, "geometry endpoint mismatch");
      row = { rootRawSha256: keyP, production, independent, elapsedMs };
      cache.set(keyP, row);
    }
    measured[role] = row;
  }
  let contrastP, contrastI;
  if (entry.eventFamily === FAMILIES[1]) {
    contrastP = P.nyumbaContrast(measured["use-post"].production, measured["stop-post"].production);
    contrastI = I.nyumbaContrast(measured["use-post"].independent, measured["stop-post"].independent);
  } else {
    contrastP = P.delta(measured.post.production, measured.pre.production);
    contrastI = I.delta(measured.post.independent, measured.pre.independent);
  }
  same(contrastP, contrastI, `contrast exact mismatch seed=${entry.sourceSeed} family=${entry.eventFamily}`);
  const exactDefined = {};
  for (const metric of METRICS) exactDefined[metric] = Boolean(contrastP[metric] && contrastP[metric].defined === true);
  return {
    exactDefined,
    rootIdentities: Object.fromEntries(Object.entries(measured).map(([role, row]) => [role, row.rootRawSha256])),
  };
}
function supportSlots(measurements) {
  const slots = [];
  for (const family of FAMILIES) {
    for (const metric of METRICS) {
      const byPolicy = {};
      for (const policy of [TP.P1, TP.P2]) {
        const rows = measurements.filter((row) => row.eventFamily === family && row.policyId === policy);
        byPolicy[policy] = rows.filter((row) => row.exactDefined[metric] === true).length;
      }
      const combined = byPolicy[TP.P1] + byPolicy[TP.P2];
      const supported = byPolicy[TP.P1] >= SPEC.supportFamily.minimumExactDefinedPerPolicy
        && byPolicy[TP.P2] >= SPEC.supportFamily.minimumExactDefinedPerPolicy
        && combined >= SPEC.supportFamily.minimumExactDefinedCombined;
      slots.push({
        slotId: `${family}/${metric}`,
        eventFamily: family,
        metricId: metric,
        exactDefinedByPolicy: byPolicy,
        exactDefinedCombined: combined,
        classification: supported ? SPEC.supportFamily.supportedLabel : SPEC.supportFamily.unsupportedLabel,
        effectDirectionUsed: false,
      });
    }
  }
  return slots;
}

function main() {
  const out = outputDir();
  const stageStarted = Date.now();
  let freshSeedReads = 0;
  let firstSeedRead = null;
  let lastSeedRead = null;
  let noRescueBoundaryCrossed = false;

  try {
    need(SPEC.studyId === "BRSGT-STUDY1" && AUTH.studyId === SPEC.studyId, "study identity mismatch");
    need(SPEC.stageId === "BRSGT-S1-DEVELOPMENT-2026-09-27-v1" && AUTH.stageId === SPEC.stageId, "stage identity mismatch");
    need(AUTH.decision === "AUTHORIZED", "Stage1 not authorized");
    need(AUTH.authorizationType === "FRESH-DEVELOPMENT-ONE-SHOT", "Stage1 authorization type mismatch");
    need(AUTH.maxScientificExecutions === 1, "Stage1 must be authorized exactly once");
    need(AUTH.formalInferenceAuthorized === false, "formal inference unexpectedly authorized");
    need(AUTH.effectValueRetentionAuthorized === false && AUTH.effectSignRetentionAuthorized === false, "Stage1 blindness guard invalid");
    need(AUTH.seedBlock.start === SPEC.seedBlock.start && AUTH.seedBlock.end === SPEC.seedBlock.end, "authorized seed block mismatch");
    need(TP.P1 === SPEC.sourcePolicies[0].policyId && TP.P2 === SPEC.sourcePolicies[1].policyId, "source policy binding mismatch");
    need(process.env.BRSGT_STAGE1_EXECUTION_TRIGGER_OK === "1", "Stage1 execution trigger env missing");
    need(process.env.GITHUB_RUN_ATTEMPT === "1", "Stage1 run attempt must be 1");

    const upstreamRoot = process.env.BRSGT_STAGE1_UPSTREAM_DIR;
    need(upstreamRoot && fs.existsSync(upstreamRoot), "Stage1 upstream artifact directory missing");

    // Mandatory: materialize and verify the complete upstream identity firewall before the first fresh seed read.
    const firewall = FW.materialize({ repoRoot: ROOT, upstreamRoot, firewall: FIREWALL });
    need(firewall.summary.freshStage1SeedAccessDuringMaterialization === false, "firewall materialization fresh-access violation");

    const candidates = Object.fromEntries(FAMILIES.flatMap((family) => [TP.P1, TP.P2].map((policy) => [`${family}|${policy}`, []])));
    const sourceRejections = {};
    const candidateCounts = {};
    const identityRows = [];

    for (let seed = SPEC.seedBlock.start; seed <= SPEC.seedBlock.end; seed += 1) {
      const policyId = policyFor(seed);
      if (!noRescueBoundaryCrossed) noRescueBoundaryCrossed = true;
      freshSeedReads += 1;
      if (firstSeedRead === null) firstSeedRead = seed;
      lastSeedRead = seed;

      const a = replayResult(TP, policyId, seed);
      const b = replayResult(TI, policyId, seed);
      need(a.ok === b.ok, `source replay success mismatch seed=${seed}`);
      if (!a.ok) {
        need(a.error === b.error, `source replay error mismatch seed=${seed}`);
        countInc(sourceRejections, a.error.includes("relay-limit") ? "SOURCE-RELAY-LIMIT" : "SOURCE-ERROR");
        continue;
      }
      same(publicReplay(a.value), publicReplay(b.value), `source replay identity mismatch seed=${seed}`);
      const prefixA = openingPrefixSha(a.value);
      const prefixB = TI.digest(b.value.moveKeys.slice(0, 16).join("\n"));
      need(prefixA === prefixB, `opening prefix mismatch seed=${seed}`);
      identityRows.push(identityRow(policyId, seed, a.value, prefixA));

      const collision = firewallCollision(firewall.sets, seed, a.value, prefixA);
      if (collision) { countInc(sourceRejections, collision); continue; }

      const cP = extractCandidates(P, a.value);
      const cI = extractCandidates(I, b.value);
      for (const family of FAMILIES) {
        same(publicCandidate(cP[family]), publicCandidate(cI[family]), `event candidate mismatch seed=${seed} family=${family}`);
        if (!cP[family]) continue;
        const key = `${family}|${policyId}`;
        candidates[key].push({
          policyId,
          sourceSeed: seed,
          eventFamily: family,
          eventPly: cP[family].eventPly,
          canonicalEventKey: cP[family].canonicalEventKey,
          identity: publicCandidate(cP[family]),
          production: cP[family],
          independent: cI[family],
        });
        countInc(candidateCounts, key);
      }
    }

    need(freshSeedReads === SPEC.seedBlock.slots, `Stage1 must read exactly ${SPEC.seedBlock.slots} fresh slots`);
    const measurements = [];
    const preflightSummary = {};
    const geometryCache = new Map();

    for (const family of FAMILIES) {
      for (const policyId of [TP.P1, TP.P2]) {
        const key = `${family}|${policyId}`;
        const ordered = candidates[key].sort(candidateOrder);
        const selected = [];
        const reasons = {};
        for (const entry of ordered) {
          if (selected.length >= SPEC.measurementSelection.targetPerFamilyPerPolicy) break;
          const pf = preflightCandidate(entry.production, entry.independent, entry.sourceSeed);
          if (!pf.eligible) {
            const codes = [...new Set(pf.rows.filter((row) => !row.eligible).map((row) => row.reasonCode))].sort();
            countInc(reasons, codes.join("+") || "PREFLIGHT-INELIGIBLE");
            continue;
          }
          selected.push(entry);
        }
        preflightSummary[key] = {
          candidateCount: ordered.length,
          selectedForMeasurement: selected.length,
          rejectionReasonCounts: reasons,
        };
        for (const entry of selected) {
          const measured = measureCandidate(entry, geometryCache);
          measurements.push({
            policyId,
            sourceSeed: entry.sourceSeed,
            eventFamily: family,
            eventPly: entry.eventPly,
            canonicalEventKey: entry.canonicalEventKey,
            eventIdentity: entry.identity,
            rootIdentities: measured.rootIdentities,
            exactDefined: measured.exactDefined,
            effectValueRetained: false,
            effectSignRetained: false,
          });
        }
      }
    }

    need(measurements.length <= SPEC.resourceCeilings.maxMeasuredEventUnits, "measured event-unit ceiling exceeded");
    need(geometryCache.size <= SPEC.resourceCeilings.maxGeometryRoots, "geometry root ceiling exceeded");
    const slots = supportSlots(measurements);
    const supportedSlots = slots.filter((row) => row.classification === SPEC.supportFamily.supportedLabel).map((row) => row.slotId);
    const elapsedMs = Date.now() - stageStarted;
    need(elapsedMs <= SPEC.resourceCeilings.stageElapsedMs, "Stage1 elapsed ceiling exceeded");
    const rssBytes = process.memoryUsage().rss;
    need(rssBytes <= SPEC.resourceCeilings.stagePeakRssBytes, "Stage1 RSS ceiling exceeded");

    const identityExclusion = {
      schemaVersion: 1,
      studyId: SPEC.studyId,
      sourceStageId: SPEC.stageId,
      scientificOutcomeFieldsRetained: false,
      consumedSeedNamespace: { start: SPEC.seedBlock.start, end: SPEC.seedBlock.end },
      freshScientificSeedReads,
      identityRowCount: identityRows.length,
      identityRows,
    };
    const firewallSummary = {
      schemaVersion: 1,
      studyId: SPEC.studyId,
      stageId: SPEC.stageId,
      ...firewall.summary,
      freshScientificSeedReadsBeforeFirewallComplete: 0,
    };
    const result = {
      schemaVersion: 1,
      studyId: SPEC.studyId,
      stageId: SPEC.stageId,
      evidenceClass: SPEC.evidenceClass,
      stageDisposition: "STAGE1-DEVELOPMENT-COMPLETE",
      formalInferencePerformed: false,
      effectValuesRetained: false,
      effectSignsRetained: false,
      noRescueBoundaryCrossed,
      seedBlock: { start: SPEC.seedBlock.start, end: SPEC.seedBlock.end, slots: SPEC.seedBlock.slots },
      freshScientificSeedReads,
      firstSeedRead,
      lastSeedRead,
      sourceRejectionCounts: sourceRejections,
      candidateCounts,
      preflightSummary,
      measuredEventUnitCount: measurements.length,
      uniqueGeometryRootCount: geometryCache.size,
      measurements,
      supportSlots: slots,
      supportedSlotCount: supportedSlots.length,
      supportedSlots,
      productionIndependentExactAgreement: true,
      firewallDigestSha256: firewall.summary.firewallDigestSha256,
      resourceAccounting: { elapsedMs, rssBytes },
      stage2SeedReads: 0,
      g4_10Depth11AccessCount: 0,
      publicAiChanged: false,
    };

    const resultMeta = writeJson(path.join(out, "STAGE_1_RESULT.json"), result);
    const identityMeta = writeJson(path.join(out, "STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json"), identityExclusion);
    const firewallMeta = writeJson(path.join(out, "STAGE_1_FIREWALL_SUMMARY.json"), firewallSummary);
    need(resultMeta.bytes + identityMeta.bytes + firewallMeta.bytes <= SPEC.resourceCeilings.resultArtifactBytes, "Stage1 result artifact ceiling exceeded");
    console.log(JSON.stringify({
      stageDisposition: result.stageDisposition,
      freshScientificSeedReads,
      identityRows: identityRows.length,
      measuredEventUnitCount: measurements.length,
      uniqueGeometryRootCount: geometryCache.size,
      supportedSlotCount: supportedSlots.length,
      supportedSlots,
      firewallDigestSha256: result.firewallDigestSha256,
      resultSha256: resultMeta.sha256,
      identitySha256: identityMeta.sha256,
      firewallSummarySha256: firewallMeta.sha256,
      elapsedMs,
      rssBytes,
      g4_10Depth11AccessCount: 0,
    }, null, 2));
  } catch (error) {
    const failure = {
      schemaVersion: 1,
      studyId: SPEC.studyId,
      stageId: SPEC.stageId,
      evidenceClass: SPEC.evidenceClass,
      stageDisposition: "STAGE1-TECHNICAL-INVALID",
      technicalError: String(error && error.message ? error.message : error),
      noRescueBoundaryCrossed,
      freshScientificSeedReads,
      firstSeedRead,
      lastSeedRead,
      formalInferencePerformed: false,
      effectValuesRetained: false,
      effectSignsRetained: false,
      stage2SeedReads: 0,
      g4_10Depth11AccessCount: 0,
      publicAiChanged: false,
    };
    writeJson(path.join(out, "STAGE_1_FAILURE.json"), failure);
    console.error(JSON.stringify(failure, null, 2));
    process.exitCode = 2;
  }
}

main();
