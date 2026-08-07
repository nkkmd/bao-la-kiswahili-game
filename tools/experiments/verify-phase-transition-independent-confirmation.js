#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const Artifacts = require("./verify-phase-transition-artifacts.js");
const Evaluator = require("./evaluate-phase-transition-independent-confirmation.js");

function parseArgs(argv) {
  const options = {
    config: "config/experiments/phase-transition-independent-confirmation-v2.json",
    input: "artifacts/phase-transition/independent-confirmation-v2",
    lock: "artifacts/phase-transition/independent-confirmation-v2/execution-lock.json",
    output: "artifacts/local/phase-transition-independent-confirmation-v2/integrity",
  };
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!value) throw new Error(`Missing value for ${key}`);
    if (key === "--config") options.config = value;
    else if (key === "--input") options.input = value;
    else if (key === "--lock") options.lock = value;
    else if (key === "--output") options.output = value;
    else throw new Error(`Unknown argument: ${key}`);
  }
  return options;
}

function buildIntegrity(config, manifest, games, lock, artifactResult = null, artifactError = null) {
  const corpus = Evaluator.corpusChecks(config, manifest, games);
  const checks = {
    artifactVerification: artifactError === null && artifactResult !== null,
    ...corpus,
    lockExperimentId: lock.experimentId === config.experimentId,
    lockAnalysisVersion: lock.analysisVersion === config.analysisVersion,
    sourceCommitMatchesLock:
      manifest.sourceCommit === lock.environment?.sourceCommit,
    lockPreregistrationHashPresent:
      typeof lock.preregistration?.sha256 === "string"
      && lock.preregistration.sha256.length === 64,
    lockPolicyHashPresent:
      typeof lock.executionPolicy?.sha256 === "string"
      && lock.executionPolicy.sha256.length === 64,
  };
  const errors = [];
  if (artifactError) errors.push(`artifact verification failed: ${artifactError}`);
  for (const [name, passed] of Object.entries(checks)) {
    if (!passed && name !== "artifactVerification") errors.push(`failed check: ${name}`);
  }
  return {
    experimentId: config.experimentId,
    analysisVersion: config.analysisVersion,
    mode: "formal",
    artifactResult,
    checks,
    errors,
    valid: Object.values(checks).every(Boolean),
  };
}

function verify(options) {
  const config = JSON.parse(fs.readFileSync(path.resolve(options.config), "utf8"));
  const input = path.resolve(options.input);
  const manifest = JSON.parse(fs.readFileSync(path.join(input, "manifest.json"), "utf8"));
  const games = JSON.parse(fs.readFileSync(path.join(input, "games.json"), "utf8"));
  const lock = JSON.parse(fs.readFileSync(path.resolve(options.lock), "utf8"));
  let artifactResult = null;
  let artifactError = null;
  try {
    artifactResult = Artifacts.verifyArtifacts(input);
  } catch (error) {
    artifactError = error.message;
  }
  const result = buildIntegrity(
    config,
    manifest,
    games,
    lock,
    artifactResult,
    artifactError,
  );
  const output = path.resolve(options.output);
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(
    path.join(output, "independent-confirmation-integrity.json"),
    `${JSON.stringify(result, null, 2)}\n`,
  );
  console.log(JSON.stringify(result, null, 2));
  if (!result.valid) process.exitCode = 2;
  return result;
}

if (require.main === module) {
  try {
    verify(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  buildIntegrity,
  parseArgs,
  verify,
};
