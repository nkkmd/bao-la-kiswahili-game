"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const S0 = require("./lib/restricted-endgame-stage0.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT,
  "doc/restricted-endgame-winning-regions/preregistration/STAGE_0_TECHNICAL_SPEC_V3.json");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function parseArgs(argv) {
  const args = { output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--output") args.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!args.output) throw new Error("--output required");
  return args;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(specText);
  const specSha256 = sha256(specText);
  if (spec.stageId !== "REWR-S0-TECHNICAL-2026-08-24-v3"
    || spec.technicalOnly !== true
    || spec.scientificOutcomeGenerationAuthorized !== false
    || spec.scientificTablebaseGenerationAuthorized !== false
    || spec.decisionRule?.additionalCapExpansionAfterV3 !== false) {
    throw new Error("Invalid Stage 0 v3 freeze");
  }

  const scan = S0.scanWitnessRoots({ seedBase: 22800001, games: 256, maxPly: 240 });
  const selected = spec.candidate.rootKeys.map((key) => {
    const root = scan.roots.find((row) => row.rootStateKey === key);
    if (!root) throw new Error(`Frozen v3 root missing: ${key}`);
    return root;
  });
  const actualRootSetSha256 = sha256(selected.map((root) => root.rootStateKey).sort().join("\n"));
  if (actualRootSetSha256 !== spec.candidate.rootSetSha256) throw new Error("Frozen v3 root-set hash mismatch");

  const started = process.hrtime.bigint();
  const closure = S0.enumerateClosure(selected.map((root) => root.state), {
    maxStates: spec.expandedTechnicalLimits.maximumStatesTechnicalStop,
    maxEdges: spec.expandedTechnicalLimits.maximumEdgesTechnicalStop,
    administrativeMaxMicrostates: spec.expandedTechnicalLimits.maximumMoveMicrostatesTechnicalStop,
  });
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
  const complete = closure.complete === true && closure.technicalStopReason === null;
  const result = {
    schemaVersion: 1,
    studyId: spec.studyId,
    stageId: spec.stageId,
    specSha256,
    technicalOnly: true,
    scientificOutcomeGenerationAuthorized: false,
    scientificTablebaseGenerationAuthorized: false,
    outcomeFieldsEmitted: false,
    rootSetSha256: actualRootSetSha256,
    rootKeys: selected.map((root) => root.rootStateKey),
    witnessRootsRescanned: scan.uniqueWitnessRoots,
    closure,
    elapsedMs,
    heapUsedBytesAfter: process.memoryUsage().heapUsed,
    independentVerificationRequired: complete,
    technicalDecision: complete
      ? "V3-COMPLETE-PENDING-INDEPENDENT-VERIFICATION"
      : "V3-INFEASIBLE-USE-V2-FALLBACK",
    additionalCapExpansionAuthorized: false,
  };
  const forbidden = /\b(WIN|LOSS|RECURRENT|DTF|optimalMoveSet|absoluteWinner)\b/;
  if (forbidden.test(stableStringify(result))) throw new Error("Scientific outcome leaked into Stage 0 v3");
  result.resultSha256 = sha256(stableStringify(result));
  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

if (require.main === module) main();
module.exports = { main, parseArgs };
