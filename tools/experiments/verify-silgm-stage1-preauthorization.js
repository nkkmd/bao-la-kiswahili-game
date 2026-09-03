#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const crypto = require("node:crypto");

const ROOT = path.resolve(__dirname, "../..");
const TRIGGER = path.join(ROOT, "doc/search-instability-local-geometry-mechanism/authorizations/silgm-stage1-preauthorization-trigger.txt");
const AUTH = path.join(ROOT, "doc/search-instability-local-geometry-mechanism/authorizations/STAGE_1_DEVELOPMENT_AUTHORIZATION.json");
const DEFAULT_OUT = path.join(ROOT, "artifacts/local/search-instability-local-geometry-mechanism/stage1-preauthorization-v1/PREAUTH_AUDIT_RESULT.json");

const EXPECTED = {
  "public/engine.js": "2f7885fa1ae38ddef5f14bbe2fecd4ca4fb84c7c",
  "public/ai.js": "8d472be415fac17e47a8e5e667cea9672e7a9ef5",
  "doc/search-instability-local-geometry-mechanism/prereg/STUDY_1_SPEC.json": "04eeba3f536df846b66282b574009df06490a0bb",
  "doc/search-instability-local-geometry-mechanism/prereg/STAGE_1_DEVELOPMENT_SPEC.json": "6eaa28f7f95f26db27aad56f43c8a511b6af29a0",
  "doc/search-instability-local-geometry-mechanism/prereg/UPSTREAM_IDENTITY_FIREWALL.json": "c1878ccd0739aacc7a0158e541e6e153723fef8e",
  "doc/bao-rule-mechanism-geometry-intervention/prereg/UPSTREAM_IDENTITY_FIREWALL.json": "da438d311808ea4496bd530b3ced169966eff0d9",
  "doc/bao-rule-mechanism-geometry-intervention/results/stage-1/scientific-result.json": "141fd2b7140ba631f0ef50ea715948ff0cafcf7c",
  "doc/search-instability-local-geometry-mechanism/results/stage-0-v4/STAGE_0_TECHNICAL_RESULT.json": "4180c0ccc0e5dec7f297a53fec855fe8664d1c8d",
  "tools/experiments/lib/lgtgmiv-stage1-production.js": "a4664f01535d6abbf6f83821befbb2fafd55cde6",
  "tools/experiments/lib/lgtgmiv-stage1-independent.js": "0c7239ac7acf146e9aee63dae66194681b8631d6",
  "tools/experiments/lib/search-reliability-decision-robustness.js": "f3a6951fe711db62e164910cfb248a9cbc2cac1a",
  "tools/experiments/lib/silgm-production.js": "9712e897540b54ff5fe3aa6acd997d286b09331d",
  "tools/experiments/lib/silgm-independent.js": "0bd60c96e5abfce9d1c99b474709177d52509138",
  "tools/experiments/lib/silgm-stage1-production.js": "514222290aaa22567ad4ab3e140827f3390a3c95",
  "tools/experiments/lib/silgm-stage1-independent.js": "db86f8ddc78b3562453c5254bc984d86d72b5b69",
  "tools/experiments/run-silgm-stage1-development.js": "58718b8d0500d8ea025f8265b7528f4c2c9aa55c"
};

function need(x, m) { if (!x) throw new Error(m); }
function git(...args) { return cp.execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim(); }
function readJson(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }
function shaText(s) { return crypto.createHash("sha256").update(s, "utf8").digest("hex"); }
function parseArgs() { const a=process.argv.slice(2); let out=DEFAULT_OUT; for(let i=0;i<a.length;i++){ if(a[i]==="--output") out=path.resolve(a[++i]); else throw new Error(`unknown arg ${a[i]}`); } return {out}; }
function write(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v,null,2)+"\n");}

function main() {
  const {out}=parseArgs();
  need(fs.existsSync(TRIGGER), "preauthorization trigger absent");
  need(!fs.existsSync(AUTH), "Stage 1 authorization already exists during preauthorization audit");
  const head=git("rev-parse","HEAD"), parent=git("rev-parse","HEAD^");
  const trigger=fs.readFileSync(TRIGGER,"utf8").trim();
  need(trigger===parent, `trigger must bind tooling parent ${parent}`);
  for(const [file,sha] of Object.entries(EXPECTED)){
    const got=git("rev-parse",`HEAD:${file}`); need(got===sha,`blob mismatch ${file}: ${got} != ${sha}`);
  }

  const spec=readJson(path.join(ROOT,"doc/search-instability-local-geometry-mechanism/prereg/STAGE_1_DEVELOPMENT_SPEC.json"));
  const fw=readJson(path.join(ROOT,"doc/search-instability-local-geometry-mechanism/prereg/UPSTREAM_IDENTITY_FIREWALL.json"));
  const base=readJson(path.join(ROOT,"doc/bao-rule-mechanism-geometry-intervention/prereg/UPSTREAM_IDENTITY_FIREWALL.json"));
  const brmgi=readJson(path.join(ROOT,"doc/bao-rule-mechanism-geometry-intervention/results/stage-1/scientific-result.json"));
  const s0=readJson(path.join(ROOT,"doc/search-instability-local-geometry-mechanism/results/stage-0-v4/STAGE_0_TECHNICAL_RESULT.json"));

  need(spec.studyId==="SILGM-STUDY1"&&spec.stageId==="SILGM-S1-DEVELOPMENT-2026-09-03-v1","Stage1 spec identity mismatch");
  need(spec.generationAuthorizedAtThisFreeze===false,"Stage1 spec already authorizes generation");
  need(spec.seedStart===31710001&&spec.seedEnd===31710256&&spec.seedExtension===false,"Stage1 seed contract mismatch");
  need(spec.targetRoots.namua===24&&spec.targetRoots.mtaji===24&&spec.targetRoots.total===48,"Stage1 target mismatch");
  need(spec.protectedDepth10==="SEALED-NOT-GENERATED-NOT-READ","protected depth10 contract mismatch");
  need(spec.executionIntegrity.maxAuthorizedScientificExecutions===1,"Stage1 max execution contract mismatch");
  need(spec.failureHandling.rootReplacement===false&&spec.failureHandling.sameEvidenceRepairRerun===false,"Stage1 no-rescue failure contract mismatch");

  need(fw.scientificOutcomeFieldsRetained===false&&fw.g202ScientificRowsRetained===false,"SILGM firewall scientific fields retained");
  need(fw.g306SelectionMismatchDiagnosticsRetained===false&&fw.g306EventOrMechanismDirectionRetained===false,"G3-06 diagnostic/direction retention forbidden");
  need(fw.brmgiContribution.validMaterializedSelectedPopulationIdentitySetAvailable===false,"BRMGI valid population unexpectedly available");
  need(Array.isArray(fw.brmgiContribution.retainedIdentityRows)&&fw.brmgiContribution.retainedIdentityRows.length===0,"BRMGI failed-selection identities retained");
  need(fw.freshSilgmStage1SeedAccessDuringFirewallMaterialization===false&&fw.protectedDepth10Access===false,"firewall accessed protected/fresh evidence");
  need(base.scientificOutcomeFieldsRetained===false&&base.g303DiagnosticScientificFieldsRetained===false&&base.g304ScientificOutcomeFieldsRetained===false&&base.g305PartialScientificFieldsRetained===false,"base identity firewall flags invalid");
  need(brmgi.stageDisposition==="TECHNICAL-INVALID"&&Array.isArray(brmgi.formalPromotedCandidateSet)&&brmgi.formalPromotedCandidateSet.length===0,"BRMGI canonical boundary mismatch");
  need(s0.stageDisposition==="STAGE0-PASS"&&s0.deterministicCoreSha256==="fc44c69eb5c164143af821da872a1b2f9d842f1369e9dcd98a1cdd14b42ec076","Stage0 prerequisite mismatch");
  need(s0.freshStage1AuthorizedByThisResult===false&&s0.protectedDepth10Access===false,"Stage0 improperly authorizes/accesses fresh/protected evidence");

  const p=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/silgm-stage1-production.js"),"utf8");
  const i=fs.readFileSync(path.join(ROOT,"tools/experiments/lib/silgm-stage1-independent.js"),"utf8");
  const r=fs.readFileSync(path.join(ROOT,"tools/experiments/run-silgm-stage1-development.js"),"utf8");
  need(p.includes('require("./silgm-production.js")')&&p.includes('require("./lgtgmiv-stage1-production.js")'),"production Stage1 bindings missing");
  need(!p.includes('silgm-stage1-independent.js')&&!p.includes('lgtgmiv-stage1-independent.js'),"production aliases independent Stage1 path");
  need(i.includes('require("./silgm-independent.js")')&&i.includes('require("./lgtgmiv-stage1-independent.js")'),"independent Stage1 bindings missing");
  need(!i.includes('silgm-stage1-production.js')&&!i.includes('silgm-production.js')&&!i.includes('search-reliability-decision-robustness.js'),"independent Stage1 aliases production search/aggregation");
  need(p!==i,"production and independent Stage1 sources identical");
  need(r.includes('STAGE_1_DEVELOPMENT_AUTHORIZATION.json')&&r.includes('--unarmed-smoke'),"runner authorization/unarmed guard missing");
  need(r.indexOf('auth=authCheck(spec)')>=0&&r.indexOf('P.selectPopulation')>r.indexOf('auth=authCheck(spec)'),"runner may access population before authorization check");
  need(r.includes('need(!fs.existsSync(AUTH_PATH),"unarmed smoke requires authorization artifact to be absent")'),"unarmed fail-closed guard missing");
  need(r.includes('production/independent population selection mismatch'),"selection exactness fail-closed missing");
  need(r.includes('root replacement')===false,"runner contains root-replacement escape wording");

  const result={
    schemaVersion:1,studyId:"SILGM-STUDY1",stageId:"SILGM-S1-DEVELOPMENT-2026-09-03-v1",
    auditId:"SILGM-S1-PREAUTH-STATIC-2026-09-03-v1",evidenceClass:"FRESH-FREE-STATIC-AUDIT",
    auditDisposition:"STAGE1-PREAUTH-STATIC-AUDIT-PASS",head,parent,triggerBoundToolingParent:trigger,
    checkedBlobCount:Object.keys(EXPECTED).length,productionStage1Sha256:shaText(p),independentStage1Sha256:shaText(i),runnerSha256:shaText(r),
    authorizationArtifactPresent:false,freshStage1SeedAccess:false,freshStage2SeedAccess:false,protectedDepth10Access:false,
    scientificEvidenceGenerated:false,scientificEvidenceRead:false,noRescueBoundaryCrossed:false,
    stage1AuthorizedByThisAudit:false
  };
  write(out,result);
  console.log(JSON.stringify(result));
}

try{main();}catch(e){console.error(e);process.exitCode=1;}
