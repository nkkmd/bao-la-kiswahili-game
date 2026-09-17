#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path");
const ROOT=path.resolve(process.cwd());
const spec=JSON.parse(fs.readFileSync(path.join(ROOT,"doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/STAGE_1R_RETEST_SPEC.json"),"utf8"));
const amendment=JSON.parse(fs.readFileSync(path.join(ROOT,"doc/local-game-tree-geometry-transfer-compatibility-instrument/prereg/STAGE_1R_GITHUB_ACTIONS_EXECUTION_AMENDMENT_V1.json"),"utf8"));
function need(x,m){if(!x)throw new Error(m);}
need(amendment.statusAtFreeze==="FROZEN-BEFORE-FRESH-SEED-ACCESS","amendment not frozen pre-access");
need(amendment.freshSeedAccessBeforeAmendment===0,"amendment fresh access must be zero");
need(amendment.scientificContractChanged===false,"scientific contract unexpectedly changed");
need(amendment.executionRoute==="GITHUB-ACTIONS-IMMUTABLE-ARTIFACT-PIPELINE","route mismatch");
need(amendment.primaryAcquisition.totalPrimarySlots===spec.freshSeedSlots.primaryCount,"primary slot count mismatch");
need(amendment.recoveryRules.maximumInfrastructureReplacementsTotal===spec.freshSeedSlots.maxInfrastructureReplacementsTotal,"replacement ceiling mismatch");
need(amendment.measurementAndAggregation.measurementTaskCount===22,"measurement task count mismatch");
for(const [block,jobs] of Object.entries({SFCDF:96,SILGM:192,GCLD:96})){
  const r=spec.freshSeedSlots.primary[block];
  need(r.count===jobs*4,`${block} quartet packing mismatch`);
  need(jobs<=256,`${block} matrix exceeds GitHub maximum`);
}
const auth=path.join(ROOT,"doc/local-game-tree-geometry-transfer-compatibility-instrument/authorizations/STAGE_1R_EXECUTION_AUTHORIZATION.json");
need(!fs.existsSync(auth),"final execution authorization must remain absent during preflight");
for(const p of [
  ".github/actions/lgttci-stage1r-acquire-slot/action.yml",
  ".github/workflows/lgttci-stage1r-github-actions.yml",
  "tools/experiments/verify-lgttci-stage1r-actions-authorization.js",
  "tools/experiments/generate-lgttci-stage1r-actions-matrices.js",
  "tools/experiments/classify-lgttci-stage1r-actions-artifacts.js",
  "tools/experiments/bundle-lgttci-stage1r-actions-source.js"
])need(fs.existsSync(path.join(ROOT,p)),`missing ${p}`);
process.stdout.write("LGTTCI_STAGE1R_GHA_DESIGN=PASS\n");
