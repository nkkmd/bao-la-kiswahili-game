"use strict";

const crypto = require("node:crypto");

function canonical(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${canonical(value[k])}`).join(",")}}`;
}

function sha256(value) {
  return crypto.createHash("sha256").update(typeof value === "string" ? value : canonical(value), "utf8").digest("hex");
}

function exactRatio(numerator, denominator) {
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  return { numerator: n.toString(), denominator: d.toString(), defined: d !== 0n };
}

function compareRatios(a, b) {
  if (!a.defined || !b.defined) throw new Error("undefined-ratio-comparison");
  const left = BigInt(a.numerator) * BigInt(b.denominator);
  const right = BigInt(b.numerator) * BigInt(a.denominator);
  return left > right ? 1 : left < right ? -1 : 0;
}

function treeProfile(f1) {
  if (!Array.isArray(f1.layers) || f1.layers.length !== 6) throw new Error("f1-layers-must-be-depth-0-through-5");
  const eb = [];
  for (let d = 0; d < 5; d++) {
    const current = f1.layers[d];
    const next = f1.layers[d + 1];
    const denominator = BigInt(current.treeNodeOccurrences) - BigInt(current.terminalOccurrenceCount);
    eb.push(exactRatio(next.treeNodeOccurrences, denominator));
  }
  if (eb.some(x => !x.defined)) {
    return { treeEffectiveBranching: eb, treeWidthShapeCode: null, treeWidthShapeClass: "TERMINAL-TRUNCATED" };
  }
  let e = 0, c = 0, s = 0;
  const code = [];
  for (let i = 0; i < 4; i++) {
    const cmp = compareRatios(eb[i + 1], eb[i]);
    const token = cmp > 0 ? "E" : cmp < 0 ? "C" : "S";
    code.push(token);
    if (token === "E") e++;
    else if (token === "C") c++;
    else s++;
  }
  let klass = "MIXED";
  if (e >= 3) klass = "EXPANSION-DOMINANT";
  else if (c >= 3) klass = "COMPRESSION-DOMINANT";
  else if (s >= 3) klass = "FLAT-DOMINANT";
  return { treeEffectiveBranching: eb, treeWidthShapeCode: code, treeWidthShapeClass: klass };
}

function replyProfile(f5) {
  if (!Array.isArray(f5.parentLayers) || f5.parentLayers.length !== 5) throw new Error("f5-parent-layers-must-be-depth-0-through-4");
  const code = [];
  let e = 0, c = 0;
  for (const layer of f5.parentLayers) {
    const expansion = BigInt(layer.widthExpansionCount);
    const compression = BigInt(layer.widthCompressionCount);
    const token = expansion > compression ? "E" : expansion < compression ? "C" : "S";
    code.push(token);
    if (token === "E") e++;
    else if (token === "C") c++;
  }
  const klass = e >= 3 ? "EXPANSION-DOMINANT" : c >= 3 ? "COMPRESSION-DOMINANT" : "BALANCED-MIXED";
  return { replyDirection: code, replyWidthShapeClass: klass };
}

function immediateSummary(f5, rootLegalMoveCount) {
  const rows = Object.entries(f5.immediateReplyWidth || {}).sort((a, b) => a[0].localeCompare(b[0]));
  if (rows.length !== Number(rootLegalMoveCount)) throw new Error("immediate-reply-width-root-move-count-mismatch");
  const widths = rows.map(([, width]) => BigInt(width));
  const histogram = {};
  let sum = 0n;
  for (const width of widths) {
    sum += width;
    const key = width.toString();
    histogram[key] = String(BigInt(histogram[key] || "0") + 1n);
  }
  return {
    orderedByRootMoveKey: rows.map(([rootMoveKey, width]) => ({ rootMoveKey, width: String(width) })),
    minimum: widths.length ? widths.reduce((a, b) => a < b ? a : b).toString() : null,
    maximum: widths.length ? widths.reduce((a, b) => a > b ? a : b).toString() : null,
    mean: exactRatio(sum, BigInt(rootLegalMoveCount)),
    histogram
  };
}

function deriveRoot(fixture) {
  const f1 = fixture.families["LGTGMIV-F1-TREE-OCCURRENCE"];
  const f5 = fixture.families["LGTGMIV-F5-REPLY-GEOMETRY"];
  if (!f1 || !f5) throw new Error("missing-primary-family");
  const tree = treeProfile(f1);
  const reply = replyProfile(f5);
  const immediate = immediateSummary(f5, f1.rootLegalMoveCount);
  const scientific = {
    schemaVersion: 1,
    studyId: "EBRWS-STUDY1",
    rootId: fixture.rootId,
    phase: fixture.phase,
    tree,
    reply,
    immediate
  };
  return { ...scientific, endpointSha256: sha256(scientific) };
}

function promoteCandidates(rootEndpoints) {
  const roots = rootEndpoints.slice().sort((a, b) => a.phase.localeCompare(b.phase) || a.rootId.localeCompare(b.rootId));
  const constructs = [
    { id: "TREE-WIDTH-SHAPE", field: r => r.tree.treeWidthShapeClass },
    { id: "REPLY-WIDTH-SHAPE", field: r => r.reply.replyWidthShapeClass }
  ];
  const phases = ["namua", "mtaji"];
  const candidates = [];
  const summaries = [];
  for (const construct of constructs) {
    for (const phase of phases) {
      const subset = roots.filter(r => r.phase === phase);
      const counts = {};
      for (const root of subset) {
        const klass = construct.field(root);
        counts[klass] = (counts[klass] || 0) + 1;
      }
      const sortedCounts = Object.fromEntries(Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0])));
      summaries.push({ constructId: construct.id, phase, eligibleRootCount: subset.length, classCounts: sortedCounts });
      for (const [klass, count] of Object.entries(sortedCounts)) {
        if (3 * count >= 2 * subset.length && subset.length > 0) {
          candidates.push({ constructId: construct.id, phase, class: klass, classCount: count, eligibleRootCount: subset.length });
        }
      }
    }
  }
  candidates.sort((a, b) => a.constructId.localeCompare(b.constructId) || a.phase.localeCompare(b.phase) || a.class.localeCompare(b.class));
  const scientific = { schemaVersion: 1, studyId: "EBRWS-STUDY1", summaries, candidates };
  return { ...scientific, candidateSetSha256: sha256(scientific) };
}

function buildStage(rootEndpoints, telemetry = null) {
  const roots = rootEndpoints.slice().sort((a, b) => a.phase.localeCompare(b.phase) || a.rootId.localeCompare(b.rootId));
  const candidate = promoteCandidates(roots);
  const scientific = {
    schemaVersion: 1,
    studyId: "EBRWS-STUDY1",
    stageId: "EBRWS-S0-TECHNICAL-2026-09-01-v1",
    rootEndpointDigests: roots.map(r => ({ rootId: r.rootId, phase: r.phase, endpointSha256: r.endpointSha256 })),
    candidateSetSha256: candidate.candidateSetSha256,
    candidates: candidate.candidates
  };
  return { scientific, stageScientificCoreSha256: sha256(scientific), telemetry };
}

module.exports = { canonical, sha256, exactRatio, compareRatios, deriveRoot, promoteCandidates, buildStage };
