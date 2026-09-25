#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const ROOT = path.resolve(__dirname, "../..");
const AUTH_PATH = path.join(ROOT, "doc/geometry-trajectory-dynamics-transfer/authorizations/STAGE_0_AUTHORIZATION.json");
const AUTH = JSON.parse(fs.readFileSync(AUTH_PATH, "utf8"));
function need(x,m){ if(!x) throw new Error(m); }
function blobSha(rel){ const b=fs.readFileSync(path.join(ROOT,rel)); const h=Buffer.from(`blob ${b.length}\0`,"utf8"); return crypto.createHash("sha1").update(h).update(b).digest("hex"); }
need(AUTH.studyId === "GTTD-STUDY1", "study mismatch");
need(AUTH.stageId === "GTTD-S0-TECHNICAL-2026-09-25-v1", "stage mismatch");
need(AUTH.executionBinding && AUTH.executionBinding.status === "FROZEN", "execution binding not frozen");
need(AUTH.executionBinding.branch === "research/g4-04-geometry-trajectory-transfer", "branch binding mismatch");
need(AUTH.freshScientificSeedAccessAuthorized === false && AUTH.stage1SeedAccessAuthorized === false && AUTH.stage2SeedAccessAuthorized === false, "fresh guard invalid");
for(const [rel,expected] of Object.entries(AUTH.executionBinding.gitBlobShaByPath || {})){
  const actual=blobSha(rel); need(actual===expected, `blob mismatch ${rel}: ${actual} != ${expected}`);
}
console.log(`GTTD_STAGE0_BINDING_OK=${AUTH.executionBinding.bindingId}`);
