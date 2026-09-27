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
const FW = require("./lib/brsgt-stage2-firewall.js");
const IP = require("./lib/brsgt-stage2-inference-production.js");
const II = require("./lib/brsgt-stage2-inference-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const DOC = path.join(ROOT, "doc/rule-semantic-geometry-transition");
const SPEC = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STAGE_2_FORMAL_SPEC.json"), "utf8"));
const FIREWALL = JSON.parse(fs.readFileSync(path.join(DOC, "prereg/STAGE_2_IDENTITY_FIREWALL.json"), "utf8"));
const AUTH = JSON.parse(fs.readFileSync(path.join(DOC, "authorizations/STAGE_2_AUTHORIZATION.json"), "utf8"));
const STAGE1 = JSON.parse(fs.readFileSync(path.join(ROOT, SPEC.stage1Source.canonicalRecordPath), "utf8"));
const FAMILIES = P.EVENTS.slice();
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
  return i >= 0 ? path.resolve(process.argv[i + 1]) : path.join(DOC, "results/stage-2");
}
function writeJson(file, object) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const text = JSON.stringify(object, null, 2) + "\n";
  fs.writeFileSync(file, text);
  return { sha256: sha256Text(text), bytes: Buffer.byteLength(text) };
}
function replayResult(lib, policyId, seed) {
  try { return { ok: true, value: lib.replay(E, policyId, seed, SPEC.sourceTrajectory.maxPly) }; }
  catch (error) { return { ok: false, error: String(error && error.message ? error.message : error) }; }
}
function publicReplay(replay) {
  return {
    policyId: replay.policyId,
    seed: replay.seed,
    moveKeys: replay.moveKeys,
    trajectorySha256: replay.trajectorySha256,
    terminal: replay.terminal,
    rows: replay.rows.map((row) => ({ ply: row.ply, phase: row.phase, terminal: row.terminal, rootLegalWidth: row.rootLegalWidth, rawStateSha256: row.rawStateSha256 })),
  };
}
function openingPrefixSha(replay) { return TP.digest(replay.moveKeys.slice(0, 16).join("\n")); }
function reachableRows(replay) {
  const initial = E.initialState();
  return [{ ply: 0, rawStateSha256: TP.stateKey(initial), state: initial, terminal: false }]
    .concat(replay.rows.map((row) => ({ ply: row.ply, rawStateSha256: row.rawStateSha256, state: row.state, terminal: row.terminal })));
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
    if (!found[FAMILIES[1]]) {
      const pair = lib.nyumbaPairs(E, pre.state).find((row) => !relayLimit(row.stop.post) && !relayLimit(row.use.post));
      if (pair) {
        found[FAMILIES[1]] = {
          eventFamily: FAMILIES[1],
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
    for (const moveRow of lib.canonicalMoves(E, pre.state)) {
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
  if (candidate.eventFamily === FAMILIES[1]) return [
    { role: "common-pre", state: candidate.preState },
    { role: "stop-post", state: candidate.stopPostState },
    { role: "use-post", state: candidate.usePostState },
  ];
  return [{ role: "pre", state: candidate.preState }, { role: "post", state: candidate.postState }];
}
function rawLimits() {
  const source = SPEC.resourceCeilings.perDepth5Root;
  return {
    distinctRawStates: source.maxDistinctRawStates,
    uniqueTransitions: source.maxUniqueTransitions,
    parentExpansions: source.maxParentExpansions,
    legalMoveEvaluations: source.maxLegalMoveEvaluations,
    treeNodeOccurrences: source.maxTreeNodeOccurrences,
  };
}
function preflightCandidate(candidateP, candidateI, seed) {
  const rootsP = candidateRoots(candidateP), rootsI = candidateRoots(candidateI);
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
    same(a, b, `preflight production/independent mismatch seed=${seed} family=${candidateP.eventFamily}`);
    need(elapsedMs <= SPEC.resourceCeilings.perDepth5Root.elapsedMs, `preflight root elapsed ceiling exceeded seed=${seed}`);
    rows.push({ role: rootsP[index].role, eligible: a.eligible, reasonCode: a.reasonCode, counters: a.counters, elapsedMs });
    if (!a.eligible) eligible = false;
  }
  return { eligible, rows };
}
function candidateOrder(a, b) { return a.sourceSeed - b.sourceSeed || a.eventPly - b.eventPly || a.canonicalEventKey.localeCompare(b.canonicalEventKey); }
function measureCandidate(entry, cache) {
  const rootsP = candidateRoots(entry.production), rootsI = candidateRoots(entry.independent);
  const measured = {};
  for (let index = 0; index < rootsP.length; index += 1) {
    const role = rootsP[index].role;
    const keyP = P.stateKey(rootsP[index].state), keyI = I.stateKey(rootsI[index].state);
    need(keyP === keyI, "measurement root RAW mismatch");
    let row = cache.get(keyP);
    if (!row) {
      need(cache.size < SPEC.resourceCeilings.maxGeometryRoots, "geometry root ceiling exceeded");
      const started = Date.now();
      const production = P.measureState(E, rootsP[index].state, `S2:${entry.sourceSeed}:${entry.eventFamily}:${role}`);
      const independent = I.measureState(E, rootsI[index].state, `S2:${entry.sourceSeed}:${entry.eventFamily}:${role}`);
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
  const contrastP = entry.eventFamily === FAMILIES[1]
    ? P.nyumbaContrast(measured["use-post"].production, measured["stop-post"].production)
    : P.delta(measured.post.production, measured.pre.production);
  const contrastI = entry.eventFamily === FAMILIES[1]
    ? I.nyumbaContrast(measured["use-post"].independent, measured["stop-post"].independent)
    : I.delta(measured.post.independent, measured.pre.independent);
  same(contrastP, contrastI, `contrast exact mismatch seed=${entry.sourceSeed} family=${entry.eventFamily}`);
  return {
    contrast: contrastP,
    rootIdentities: Object.fromEntries(Object.entries(measured).map(([role, row]) => [role, row.rootRawSha256])),
  };
}
function rationalSign(value) {
  if (!value || value.defined !== true) return null;
  const n = BigInt(value.numerator);
  return n > 0n ? 1 : n < 0n ? -1 : 0;
}
function formalRows(measurements) {
  const bases = [];
  for (const slotId of SPEC.formalFamily.slotIds) {
    const [family, metric] = slotId.split("/");
    const perPolicy = {};
    let positive = 0, negative = 0, zero = 0, exactDefined = 0;
    for (const policy of [TP.P1, TP.P2]) {
      const counts = { measured: 0, exactDefined: 0, positive: 0, negative: 0, zero: 0, nonzero: 0 };
      for (const row of measurements.filter((x) => x.eventFamily === family && x.policyId === policy)) {
        counts.measured += 1;
        const sign = rationalSign(row.contrast[metric]);
        if (sign === null) continue;
        counts.exactDefined += 1; exactDefined += 1;
        if (sign > 0) { counts.positive += 1; positive += 1; }
        else if (sign < 0) { counts.negative += 1; negative += 1; }
        else { counts.zero += 1; zero += 1; }
      }
      counts.nonzero = counts.positive + counts.negative;
      perPolicy[policy] = counts;
    }
    const nonzero = positive + negative;
    const gate = SPEC.formalEstimabilityGate;
    const estimable = perPolicy[TP.P1].exactDefined >= gate.exactDefinedPerPolicyRequired
      && perPolicy[TP.P2].exactDefined >= gate.exactDefinedPerPolicyRequired
      && exactDefined >= gate.exactDefinedCombinedRequired
      && perPolicy[TP.P1].nonzero >= gate.nonzeroPerPolicyRequired
      && perPolicy[TP.P2].nonzero >= gate.nonzeroPerPolicyRequired
      && nonzero >= gate.nonzeroCombinedRequired;
    const testP = estimable ? IP.exactTwoSidedSignTest(positive, negative, zero) : { positive, negative, zero, nonzero, estimable: false, pValue: IP.q(1n) };
    const testI = estimable ? II.exactTwoSidedSignTest(positive, negative, zero) : { positive, negative, zero, nonzero, estimable: false, pValue: II.q(1n) };
    same(testP, testI, `sign test mismatch ${slotId}`);
    bases.push({ slotId, eventFamily: family, metricId: metric, estimable, exactDefined, perPolicy, positive, negative, zero, nonzero, pValue: testP.pValue });
  }
  const holmP = IP.holm(bases, SPEC.formalFamily.fixedFamilySize);
  const holmI = II.holm(bases, SPEC.formalFamily.fixedFamilySize);
  same(holmP, holmI, "Holm production/independent mismatch");
  return holmP.map((row) => {
    const holmSignificantP = row.estimable && IP.significant(row, SPEC.formalInference.familyAlpha);
    const holmSignificantI = row.estimable && II.significant(row, SPEC.formalInference.familyAlpha);
    need(holmSignificantP === holmSignificantI, `significance mismatch ${row.slotId}`);
    const decisionInput = { estimable: row.estimable, holmSignificant: holmSignificantP, positive: row.positive, negative: row.negative, perPolicy: row.perPolicy };
    const decisionP = IP.decision(decisionInput), decisionI = II.decision(decisionInput);
    need(decisionP === decisionI, `decision mismatch ${row.slotId}`);
    return { ...row, holmSignificant: holmSignificantP, decision: decisionP };
  });
}

function main() {
  const out = outputDir();
  const stageStarted = Date.now();
  let freshSeedReads = 0, firstSeedRead = null, lastSeedRead = null, noRescueBoundaryCrossed = false;
  try {
    need(SPEC.studyId === "BRSGT-STUDY1" && AUTH.studyId === SPEC.studyId, "study identity mismatch");
    need(SPEC.stageId === "BRSGT-S2-FORMAL-2026-09-27-v1" && AUTH.stageId === SPEC.stageId, "stage identity mismatch");
    need(AUTH.decision === "AUTHORIZED" && AUTH.authorizationType === "FRESH-FORMAL-HOLDOUT-ONE-SHOT", "Stage2 authorization invalid");
    need(AUTH.maxScientificExecutions === 1 && AUTH.singleAttemptOnly === true, "Stage2 must be one-shot attempt one");
    need(AUTH.formalInferenceAuthorized === true, "formal inference not authorized");
    need(AUTH.seedBlock.start === SPEC.seedBlock.start && AUTH.seedBlock.end === SPEC.seedBlock.end && AUTH.seedBlock.slots === SPEC.seedBlock.slots, "Stage2 seed block authorization mismatch");
    need(AUTH.g4_10Depth11AccessAuthorized === false && AUTH.publicAiChangeAuthorized === false && AUTH.mainIntegrationAuthorized === false, "protected boundary invalid");
    need(STAGE1.disposition === "STAGE1-DEVELOPMENT-COMPLETE" && STAGE1.supportOnlyPromotion.effectDirectionUsedForPromotion === false, "Stage1 support source invalid");
    same(STAGE1.supportOnlyPromotion.supportedSlotIds, SPEC.formalFamily.slotIds, "formal family differs from Stage1 support-only family");
    need(SPEC.formalFamily.slotIds.length === 24, "formal family size != 24");

    const upstreamRoot = process.env.BRSGT_STAGE2_UPSTREAM_DIR;
    need(upstreamRoot && fs.existsSync(upstreamRoot), "Stage2 upstream artifact directory missing");
    const firewall = FW.materialize({ repoRoot: ROOT, upstreamRoot, firewall: FIREWALL });
    need(firewall.summary.freshStage2SeedAccessDuringMaterialization === false, "Stage2 firewall materialization fresh-access violation");

    const candidates = Object.fromEntries(FAMILIES.flatMap((family) => [TP.P1, TP.P2].map((policy) => [`${family}|${policy}`, []])));
    const sourceRejections = {}, identityRows = [];
    for (let seed = SPEC.seedBlock.start; seed <= SPEC.seedBlock.end; seed += 1) {
      const policyId = policyFor(seed);
      noRescueBoundaryCrossed = true;
      freshSeedReads += 1;
      if (firstSeedRead === null) firstSeedRead = seed;
      lastSeedRead = seed;
      const rp = replayResult(TP, policyId, seed), ri = replayResult(TI, policyId, seed);
      need(rp.ok === ri.ok, `replay success mismatch seed=${seed}`);
      if (!rp.ok) { need(rp.error === ri.error, `replay error mismatch seed=${seed}`); countInc(sourceRejections, `SOURCE-REPLAY:${rp.error}`); continue; }
      same(publicReplay(rp.value), publicReplay(ri.value), `source replay mismatch seed=${seed}`);
      const prefixP = openingPrefixSha(rp.value), prefixI = openingPrefixSha(ri.value);
      need(prefixP === prefixI, `opening prefix mismatch seed=${seed}`);
      identityRows.push(identityRow(policyId, seed, rp.value, prefixP));
      const collision = firewallCollision(firewall.sets, seed, rp.value, prefixP);
      if (collision) { countInc(sourceRejections, collision); continue; }
      const cp = extractCandidates(P, rp.value), ci = extractCandidates(I, ri.value);
      for (const family of FAMILIES) {
        same(publicCandidate(cp[family]), publicCandidate(ci[family]), `event selection mismatch seed=${seed} family=${family}`);
        if (!cp[family]) continue;
        candidates[`${family}|${policyId}`].push({ sourceSeed: seed, policyId, eventFamily: family, eventPly: cp[family].eventPly, canonicalEventKey: cp[family].canonicalEventKey, production: cp[family], independent: ci[family] });
      }
    }

    const selected = [], preflightSummary = {};
    for (const family of FAMILIES) for (const policy of [TP.P1, TP.P2]) {
      const key = `${family}|${policy}`;
      const rows = candidates[key].sort(candidateOrder);
      const summary = { candidateCount: rows.length, selectedForMeasurement: 0, rejectionReasonCounts: {} };
      for (const row of rows) {
        if (summary.selectedForMeasurement >= SPEC.measurementSelection.targetPerFamilyPerPolicy) break;
        const preflight = preflightCandidate(row.production, row.independent, row.sourceSeed);
        if (!preflight.eligible) {
          for (const x of preflight.rows.filter((x) => !x.eligible)) countInc(summary.rejectionReasonCounts, x.reasonCode);
          continue;
        }
        selected.push(row); summary.selectedForMeasurement += 1;
      }
      preflightSummary[key] = summary;
    }
    need(selected.length <= SPEC.measurementSelection.maxMeasuredEventUnits, "Stage2 measured event-unit ceiling exceeded");

    const cache = new Map(), measurements = [];
    for (const entry of selected) {
      const measured = measureCandidate(entry, cache);
      measurements.push({
        policyId: entry.policyId,
        sourceSeed: entry.sourceSeed,
        eventFamily: entry.eventFamily,
        eventPly: entry.eventPly,
        canonicalEventKey: entry.canonicalEventKey,
        eventIdentity: publicCandidate(entry.production),
        rootIdentities: measured.rootIdentities,
        contrast: measured.contrast,
      });
    }
    const formal = formalRows(measurements);
    const labelCounts = {};
    for (const row of formal) countInc(labelCounts, row.decision);

    const elapsedMs = Date.now() - stageStarted;
    need(elapsedMs <= SPEC.resourceCeilings.stageElapsedMs, "Stage2 elapsed ceiling exceeded");
    need(process.memoryUsage().rss <= SPEC.resourceCeilings.stagePeakRssBytes, "Stage2 RSS ceiling exceeded");

    const candidateManifest = {
      schemaVersion: 1,
      studyId: SPEC.studyId,
      sourceStageId: SPEC.stageId,
      scientificOutcomeFieldsRetained: false,
      consumedSeedNamespace: { start: SPEC.seedBlock.start, end: SPEC.seedBlock.end },
      freshScientificSeedReads: freshSeedReads,
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
      stageDisposition: "STAGE2-FORMAL-COMPLETE",
      formalInferencePerformed: true,
      noRescueBoundaryCrossed,
      seedBlock: SPEC.seedBlock,
      freshScientificSeedReads: freshSeedReads,
      firstSeedRead,
      lastSeedRead,
      sourceRejectionCounts: sourceRejections,
      candidateCounts: Object.fromEntries(Object.entries(candidates).map(([key, value]) => [key, value.length])),
      preflightSummary,
      measuredEventUnitCount: measurements.length,
      uniqueGeometryRootCount: cache.size,
      measurements,
      formalFamilySize: formal.length,
      formalResults: formal,
      labelCounts,
      productionIndependentExactAgreement: true,
      firewallDigestSha256: firewall.summary.firewallDigestSha256,
      resourceAccounting: { elapsedMs, rssBytes: process.memoryUsage().rss },
      stage1EffectDirectionUsedForFamilyMembership: false,
      stage1EffectValueUsedForFamilyMembership: false,
      g4_10Depth11AccessCount: 0,
      publicAiChanged: false,
    };
    const resultMeta = writeJson(path.join(out, "STAGE_2_RESULT.json"), result);
    const identityMeta = writeJson(path.join(out, "STAGE_2_CANDIDATE_MANIFEST.json"), candidateManifest);
    const firewallMeta = writeJson(path.join(out, "STAGE_2_FIREWALL_SUMMARY.json"), firewallSummary);
    const totalBytes = resultMeta.bytes + identityMeta.bytes + firewallMeta.bytes;
    need(totalBytes <= SPEC.resourceCeilings.resultArtifactBytes, "Stage2 result artifact byte ceiling exceeded");
    console.log(JSON.stringify({
      studyId: SPEC.studyId,
      stageId: SPEC.stageId,
      stageDisposition: result.stageDisposition,
      freshScientificSeedReads: freshSeedReads,
      identityRows: identityRows.length,
      measuredEventUnitCount: measurements.length,
      uniqueGeometryRootCount: cache.size,
      formalFamilySize: formal.length,
      labelCounts,
      productionIndependentExactAgreement: true,
      firewallDigestSha256: firewall.summary.firewallDigestSha256,
      resultSha256: resultMeta.sha256,
      candidateManifestSha256: identityMeta.sha256,
      firewallSummarySha256: firewallMeta.sha256,
      elapsedMs,
      rssBytes: process.memoryUsage().rss,
      g4_10Depth11AccessCount: 0,
      publicAiChanged: false,
    }, null, 2));
  } catch (error) {
    const failure = {
      schemaVersion: 1,
      studyId: SPEC.studyId,
      stageId: SPEC.stageId,
      evidenceClass: SPEC.evidenceClass,
      stageDisposition: "STAGE2-TECHNICAL-INVALID",
      technicalError: String(error && error.message ? error.message : error),
      noRescueBoundaryCrossed,
      freshScientificSeedReads: freshSeedReads,
      firstSeedRead,
      lastSeedRead,
      formalInferencePerformed: false,
      g4_10Depth11AccessCount: 0,
      publicAiChanged: false,
    };
    writeJson(path.join(out, "STAGE_2_FAILURE.json"), failure);
    console.error(JSON.stringify(failure, null, 2));
    process.exitCode = 2;
  }
}

main();
