"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const S0 = require("./lib/restricted-endgame-stage0.js");
const V = require("./lib/restricted-endgame-independent-verifier.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT,
  "doc/restricted-endgame-winning-regions/preregistration/STAGE_0_TECHNICAL_SPEC_V3.json");

function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function parseArgs(argv) {
  const args = { input: null, output: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--input") args.input = path.resolve(argv[++i]);
    else if (argv[i] === "--output") args.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  if (!args.input || !args.output) throw new Error("--input and --output required");
  return args;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const production = JSON.parse(fs.readFileSync(args.input, "utf8"));
  const specText = fs.readFileSync(SPEC_PATH, "utf8");
  const spec = JSON.parse(specText);
  const specSha256 = sha256(specText);
  if (production.specSha256 !== specSha256 || production.technicalOnly !== true
    || production.scientificOutcomeGenerationAuthorized !== false
    || production.scientificTablebaseGenerationAuthorized !== false) {
    throw new Error("Invalid v3 production input");
  }

  let result;
  if (!(production.closure.complete === true && production.closure.technicalStopReason === null)) {
    result = {
      schemaVersion: 1,
      studyId: spec.studyId,
      stageId: "REWR-S0-V3-INDEPENDENT-VERIFY-2026-08-24-v1",
      specSha256,
      productionResultSha256: production.resultSha256,
      technicalOnly: true,
      scientificOutcomeGenerationAuthorized: false,
      scientificTablebaseGenerationAuthorized: false,
      outcomeFieldsEmitted: false,
      verificationRequired: false,
      passed: null,
      v3Complete: false,
      finalTechnicalDomainChoice: "V2-FALLBACK",
      chosenRootSetSha256: spec.decisionRule.fallbackV2RootSetSha256,
      additionalCapExpansionAuthorized: false,
    };
  } else {
    const scan = S0.scanWitnessRoots({ seedBase: 22800001, games: 256, maxPly: 240 });
    const roots = production.rootKeys.map((key) => {
      const root = scan.roots.find((row) => row.rootStateKey === key);
      if (!root) throw new Error(`v3 root missing in verifier: ${key}`);
      if (V.stateKey(root.state) !== key) throw new Error(`Independent v3 root hash mismatch: ${key}`);
      return root;
    });
    const started = process.hrtime.bigint();
    const independent = V.enumerateClosure(roots.map((root) => root.state), {
      maxStates: spec.expandedTechnicalLimits.maximumStatesTechnicalStop,
      maxEdges: spec.expandedTechnicalLimits.maximumEdgesTechnicalStop,
      maxMicrostates: spec.expandedTechnicalLimits.maximumMoveMicrostatesTechnicalStop,
    });
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
    const checks = {
      complete: independent.complete === true && independent.technicalStopReason === null,
      stateCount: independent.stateCount === production.closure.stateCount,
      edgeCount: independent.edgeCount === production.closure.edgeCount,
      stateSetSha256: independent.stateSetSha256 === production.closure.stateSetSha256,
      transitionSetSha256: independent.transitionSetSha256 === production.closure.transitionSetSha256,
      rootKeys: stableStringify(independent.rootKeys) === stableStringify(production.closure.rootKeys),
    };
    const passed = Object.values(checks).every(Boolean);
    result = {
      schemaVersion: 1,
      studyId: spec.studyId,
      stageId: "REWR-S0-V3-INDEPENDENT-VERIFY-2026-08-24-v1",
      specSha256,
      productionResultSha256: production.resultSha256,
      technicalOnly: true,
      scientificOutcomeGenerationAuthorized: false,
      scientificTablebaseGenerationAuthorized: false,
      outcomeFieldsEmitted: false,
      verificationRequired: true,
      passed,
      v3Complete: true,
      checks,
      independent: {
        stateCount: independent.stateCount,
        edgeCount: independent.edgeCount,
        stateSetSha256: independent.stateSetSha256,
        transitionSetSha256: independent.transitionSetSha256,
        maxMoveMicrosteps: independent.maxMoveMicrosteps,
        elapsedMs,
        heapUsedBytesAfter: process.memoryUsage().heapUsed,
      },
      finalTechnicalDomainChoice: passed ? "V3-DOMAIN" : "V2-FALLBACK",
      chosenRootSetSha256: passed
        ? production.rootSetSha256 : spec.decisionRule.fallbackV2RootSetSha256,
      additionalCapExpansionAuthorized: false,
    };
  }

  const forbidden = /\b(WIN|LOSS|RECURRENT|DTF|optimalMoveSet|absoluteWinner)\b/;
  if (forbidden.test(stableStringify(result))) throw new Error("Scientific outcome leaked into v3 verification");
  result.resultSha256 = sha256(stableStringify(result));
  fs.mkdirSync(path.dirname(args.output), { recursive: true });
  fs.writeFileSync(args.output, `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  return result;
}

if (require.main === module) main();
module.exports = { main, parseArgs };
