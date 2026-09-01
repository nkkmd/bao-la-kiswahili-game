"use strict";

const crypto = require("node:crypto");

function jsonCanon(x) {
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return "[" + x.map(jsonCanon).join(",") + "]";
  const keys = Object.keys(x).sort();
  return "{" + keys.map(k => JSON.stringify(k) + ":" + jsonCanon(x[k])).join(",") + "}";
}

function digest(x) {
  return crypto.createHash("sha256").update(typeof x === "string" ? x : jsonCanon(x), "utf8").digest("hex");
}

function fraction(n, d) {
  const nn = BigInt(n), dd = BigInt(d);
  return { numerator: `${nn}`, denominator: `${dd}`, defined: dd !== 0n };
}

function fractionOrder(left, right) {
  if (left.defined !== true || right.defined !== true) throw new Error("cannot-order-undefined-fraction");
  const a = BigInt(left.numerator) * BigInt(right.denominator);
  const b = BigInt(right.numerator) * BigInt(left.denominator);
  if (a === b) return 0;
  return a > b ? 1 : -1;
}

function treePart(f1) {
  const layers = f1.layers;
  if (!layers || layers.length !== 6) throw new Error("bad-tree-layer-count");
  const widths = Array.from({ length: 5 }, (_, d) => {
    const denom = BigInt(layers[d].treeNodeOccurrences) - BigInt(layers[d].terminalOccurrenceCount);
    return fraction(layers[d + 1].treeNodeOccurrences, denom);
  });
  if (widths.find(w => w.defined === false)) {
    return { treeEffectiveBranching: widths, treeWidthShapeCode: null, treeWidthShapeClass: "TERMINAL-TRUNCATED" };
  }
  const symbols = [];
  const tally = { E: 0, C: 0, S: 0 };
  for (let j = 1; j < widths.length; j++) {
    const o = fractionOrder(widths[j], widths[j - 1]);
    const symbol = o === 0 ? "S" : o > 0 ? "E" : "C";
    symbols.push(symbol);
    tally[symbol]++;
  }
  let category;
  if (tally.E >= 3) category = "EXPANSION-DOMINANT";
  else if (tally.C >= 3) category = "COMPRESSION-DOMINANT";
  else if (tally.S >= 3) category = "FLAT-DOMINANT";
  else category = "MIXED";
  return { treeEffectiveBranching: widths, treeWidthShapeCode: symbols, treeWidthShapeClass: category };
}

function replyPart(f5) {
  const layers = f5.parentLayers;
  if (!layers || layers.length !== 5) throw new Error("bad-reply-parent-layer-count");
  const signs = [];
  let expandDepths = 0, compressDepths = 0;
  for (let d = 0; d < 5; d++) {
    const ex = BigInt(layers[d].widthExpansionCount);
    const co = BigInt(layers[d].widthCompressionCount);
    let sign = "S";
    if (ex > co) sign = "E";
    if (ex < co) sign = "C";
    signs.push(sign);
    if (sign === "E") expandDepths++;
    if (sign === "C") compressDepths++;
  }
  const category = expandDepths >= 3 ? "EXPANSION-DOMINANT" : compressDepths >= 3 ? "COMPRESSION-DOMINANT" : "BALANCED-MIXED";
  return { replyDirection: signs, replyWidthShapeClass: category };
}

function replyImmediate(f5, legalCount) {
  const entries = Object.keys(f5.immediateReplyWidth || {}).sort().map(key => [key, BigInt(f5.immediateReplyWidth[key])]);
  if (entries.length !== Number(legalCount)) throw new Error("root-reply-cardinality-error");
  const hist = {};
  let total = 0n;
  for (const [, w] of entries) {
    total += w;
    const k = `${w}`;
    hist[k] = `${BigInt(hist[k] || "0") + 1n}`;
  }
  let lo = null, hi = null;
  if (entries.length) {
    lo = entries[0][1]; hi = entries[0][1];
    for (const [, w] of entries) {
      if (w < lo) lo = w;
      if (w > hi) hi = w;
    }
  }
  return {
    orderedByRootMoveKey: entries.map(([rootMoveKey, w]) => ({ rootMoveKey, width: `${w}` })),
    minimum: lo === null ? null : `${lo}`,
    maximum: hi === null ? null : `${hi}`,
    mean: fraction(total, BigInt(legalCount)),
    histogram: hist
  };
}

function calculate(fixture) {
  const one = fixture.families["LGTGMIV-F1-TREE-OCCURRENCE"];
  const five = fixture.families["LGTGMIV-F5-REPLY-GEOMETRY"];
  if (one == null || five == null) throw new Error("primary-family-not-present");
  const object = {
    schemaVersion: 1,
    studyId: "EBRWS-STUDY1",
    rootId: fixture.rootId,
    phase: fixture.phase,
    tree: treePart(one),
    reply: replyPart(five),
    immediate: replyImmediate(five, one.rootLegalMoveCount)
  };
  return Object.assign({}, object, { endpointSha256: digest(object) });
}

function selectCandidates(results) {
  const ordered = [...results].sort((x, y) => x.phase.localeCompare(y.phase) || x.rootId.localeCompare(y.rootId));
  const specifications = [
    ["TREE-WIDTH-SHAPE", r => r.tree.treeWidthShapeClass],
    ["REPLY-WIDTH-SHAPE", r => r.reply.replyWidthShapeClass]
  ];
  const summaries = [];
  const candidates = [];
  for (const [constructId, getter] of specifications) {
    for (const phase of ["namua", "mtaji"]) {
      const sample = ordered.filter(r => r.phase === phase);
      const countMap = new Map();
      sample.forEach(r => countMap.set(getter(r), (countMap.get(getter(r)) || 0) + 1));
      const counts = {};
      [...countMap.keys()].sort().forEach(k => { counts[k] = countMap.get(k); });
      summaries.push({ constructId, phase, eligibleRootCount: sample.length, classCounts: counts });
      for (const k of Object.keys(counts)) {
        const n = counts[k];
        if (sample.length !== 0 && n * 3 >= sample.length * 2) {
          candidates.push({ constructId, phase, class: k, classCount: n, eligibleRootCount: sample.length });
        }
      }
    }
  }
  candidates.sort((x, y) => x.constructId.localeCompare(y.constructId) || x.phase.localeCompare(y.phase) || x.class.localeCompare(y.class));
  const core = { schemaVersion: 1, studyId: "EBRWS-STUDY1", summaries, candidates };
  return Object.assign({}, core, { candidateSetSha256: digest(core) });
}

function assembleStage(results, executionTelemetry = null) {
  const ordered = [...results].sort((x, y) => x.phase.localeCompare(y.phase) || x.rootId.localeCompare(y.rootId));
  const promoted = selectCandidates(ordered);
  const scientific = {
    schemaVersion: 1,
    studyId: "EBRWS-STUDY1",
    stageId: "EBRWS-S0-TECHNICAL-2026-09-01-v1",
    rootEndpointDigests: ordered.map(r => ({ rootId: r.rootId, phase: r.phase, endpointSha256: r.endpointSha256 })),
    candidateSetSha256: promoted.candidateSetSha256,
    candidates: promoted.candidates
  };
  return { scientific, stageScientificCoreSha256: digest(scientific), telemetry: executionTelemetry };
}

module.exports = { jsonCanon, digest, fraction, fractionOrder, calculate, selectCandidates, assembleStage };
