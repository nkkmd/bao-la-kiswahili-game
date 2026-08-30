#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const { execFileSync } = require("node:child_process");
const Prod = require("./lib/tmgc-stage1-production.js");
const Independent = require("./lib/tmgc-stage1-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const CONTRACT_PATH = path.join(ROOT, "doc/tactical-motif-generalization-counterexample/preregistration/STAGE_1_2_BOUNDARY_CONTRACT.json");
const AUTH_PATH = path.join(ROOT, "doc/tactical-motif-generalization-counterexample/authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json");
function sha256(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function fileSha(file) { return sha256(fs.readFileSync(path.join(ROOT, file))); }
function parseArgs(argv) {
  const out = { shard: null, output: path.join(ROOT, "artifacts/local/tmgc-stage1-source") };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--shard") out.shard = Number(argv[++i]);
    else if (argv[i] === "--output") out.output = path.resolve(argv[++i]);
    else throw new Error(`Unknown argument ${argv[i]}`);
  }
  if (!Number.isInteger(out.shard) || out.shard < 0) throw new Error("Invalid --shard");
  return out;
}
function loadBound() {
  const contractText = fs.readFileSync(CONTRACT_PATH, "utf8");
  const contract = JSON.parse(contractText);
  const authText = fs.readFileSync(AUTH_PATH, "utf8");
  const auth = JSON.parse(authText);
  if (auth.studyId !== "TMGC-STUDY1" || auth.stageId !== contract.stage1Id
    || auth.stage1ScientificGenerationAuthorized !== true
    || auth.scientificInferenceAuthorized !== true
    || auth.contractSha256 !== sha256(contractText)
    || auth.seedStart !== contract.sourcePopulation.stage1.seedStart
    || auth.seedEnd !== contract.sourcePopulation.stage1.seedEnd
    || auth.games !== contract.sourcePopulation.stage1.games) {
    throw new Error("Invalid Stage1 authorization binding");
  }
  for (const [file, expected] of Object.entries(auth.authorizedSourceFileSha256)) {
    if (fileSha(file) !== expected) throw new Error(`Stage1 authorized source hash mismatch: ${file}`);
  }
  return { contract, contractSha256: sha256(contractText), authSha256: sha256(authText) };
}
function main() {
  const options = parseArgs(process.argv.slice(2));
  const { contract, contractSha256, authSha256 } = loadBound();
  const stage = contract.sourcePopulation.stage1;
  if (options.shard >= stage.shardCount) throw new Error("Shard out of range");
  const first = options.shard * stage.shardGames;
  const lastExclusive = first + stage.shardGames;
  const games = [];
  for (let index = first; index < lastExclusive; index += 1) {
    const production = Prod.generateGame(contract, stage.seedStart, index);
    const independent = Independent.generateGame(contract, stage.seedStart, index);
    if (Prod.stable(production) !== Independent.stable(independent)) {
      throw new Error(`Production/independent source mismatch at game ${index}`);
    }
    games.push(production);
    console.error(`[TMGC S1 source ${options.shard}] ${index - first + 1}/${stage.shardGames}`);
  }
  const result = {
    schemaVersion: "TMGC_STAGE1_SOURCE_SHARD_V1",
    studyId: "TMGC-STUDY1", stageId: contract.stage1Id,
    scientificInferenceAuthorized: true, developmentEvidence: true,
    contractSha256, authorizationSha256: authSha256,
    sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
    shardIndex: options.shard, gameIndexStart: first, gameIndexEndInclusive: lastExclusive - 1,
    games, productionIndependentFullSourceReplayExact: true,
  };
  fs.mkdirSync(options.output, { recursive: true });
  const file = path.join(options.output, `source-shard-${String(options.shard).padStart(2, "0")}.json.gz`);
  fs.writeFileSync(file, zlib.gzipSync(Buffer.from(JSON.stringify(result)), { level: 9 }));
  console.log(JSON.stringify({
    shardIndex: options.shard, games: games.length,
    selectedInShard: games.filter((game) => game.selected).length,
    productionIndependentFullSourceReplayExact: true, output: file,
  }, null, 2));
}
if (require.main === module) main();
