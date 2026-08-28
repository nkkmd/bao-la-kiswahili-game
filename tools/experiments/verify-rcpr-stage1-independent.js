"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const childProcess = require("node:child_process");
const I = require("./lib/rcpr-stage1-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const SPEC_PATH = path.join(ROOT, "doc/rich-critical-position-representation/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/rich-critical-position-representation/authorizations/STAGE_1_EXECUTE.json");
const DEFAULT_DIR = path.join(ROOT, "artifacts/local/rich-critical-position-representation/stage1-development-v1");
function ensure(c,m){if(!c)throw new Error(m);}
function sha256File(p){return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");}
function gitBlob(p){return childProcess.execFileSync("git",["hash-object",p],{cwd:ROOT,encoding:"utf8"}).trim();}
function writeJson(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,`${JSON.stringify(v,null,2)}\n`,"utf8");}
function parseDir(){const at=process.argv.indexOf("--dir");return at>=0&&process.argv[at+1]?path.resolve(process.argv[at+1]):DEFAULT_DIR;}

function validateAuthorization(spec){
  ensure(fs.existsSync(AUTH_PATH),"Stage 1 execution authorization absent");
  const auth=JSON.parse(fs.readFileSync(AUTH_PATH,"utf8"));
  ensure(auth.studyId===spec.studyId&&auth.stageId===spec.stageId,"authorization identity mismatch");
  ensure(auth.status==="AUTHORIZED"&&auth.scientificDevelopmentOutcomeGenerationAuthorized===true,"authorization inactive");
  ensure(auth.specSha256===sha256File(SPEC_PATH),"spec hash mismatch");
  for(const [relative,expected] of Object.entries(auth.sourceBlobHashes||{}))ensure(gitBlob(relative)===expected,`authorized source blob drift: ${relative}`);
  return auth;
}

function run(){
  const dir=parseDir();
  const production=JSON.parse(fs.readFileSync(path.join(dir,"production-result.json"),"utf8"));
  const spec=JSON.parse(fs.readFileSync(SPEC_PATH,"utf8"));
  validateAuthorization(spec);
  ensure(production.specSha256===sha256File(SPEC_PATH),"production spec hash mismatch");
  const development=I.runDevelopment(spec);
  const rowIndex=new Map(development.rows.map((row)=>[row.representationRowIdentity,row]));
  const rowChecks=production.development.rows.map((row)=>{
    const other=rowIndex.get(row.representationRowIdentity);
    return {
      representationRowIdentity:row.representationRowIdentity,
      present:Boolean(other),
      rawStateKeyMatch:Boolean(other&&other.rawStateKey===row.rawStateKey),
      featureVectorMatch:Boolean(other&&other.featureVectorSha256===row.featureVectorSha256),
      measurementMatch:Boolean(other&&other.measurementSha256===row.measurementSha256),
      dRangeMatch:Boolean(other&&other.dRange===row.dRange),
      highDivergenceMatch:Boolean(other&&other.highDivergence===row.highDivergence),
    };
  });
  const checks={
    fullCorpusReplay:true,
    rootReselection:development.selection.selectionHash===production.development.selection.selectionHash,
    selectedRowCount:development.rows.length===production.development.rows.length,
    independentFeatureRecomputation:rowChecks.every((r)=>r.present&&r.rawStateKeyMatch&&r.featureVectorMatch),
    independentFullContinuationRemeasurement:rowChecks.every((r)=>r.present&&r.measurementMatch&&r.dRangeMatch&&r.highDivergenceMatch),
    independentModelDevelopmentRecomputation:(development.model.modelDevelopmentSha256||null)===(production.development.model.modelDevelopmentSha256||null),
    readinessRecomputation:I.canonicalHash(development.readiness)===I.canonicalHash(production.development.readiness),
    developmentCoreMatch:development.developmentCoreSha256===production.development.developmentCoreSha256,
  };
  const technicalPass=Object.values(checks).every(Boolean);
  let finalDecision;
  if(!technicalPass) finalDecision=spec.developmentDecision.technicalIntegrityFailure;
  else if(production.development.readiness.productionDisposition===spec.developmentDecision.populationOrClassSupportInsufficient) finalDecision=spec.developmentDecision.populationOrClassSupportInsufficient;
  else if(production.development.readiness.productionDisposition===spec.developmentDecision.modelPerformanceOrStabilityBelowGate) finalDecision=spec.developmentDecision.modelPerformanceOrStabilityBelowGate;
  else finalDecision=spec.developmentDecision.allReadinessAndIndependentVerificationGatesPass;
  const verification={
    schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,
    scientificInferenceAuthorized:false,confirmatoryReuseAllowed:false,
    checks,rowChecks,technicalPass,finalDecision,
    independentDevelopmentCoreSha256:development.developmentCoreSha256,
    productionDevelopmentCoreSha256:production.development.developmentCoreSha256,
  };
  verification.verificationSha256=I.canonicalHash(verification);
  writeJson(path.join(dir,"independent-verification.json"),verification);
  console.log(JSON.stringify({technicalPass,finalDecision,checks,verificationSha256:verification.verificationSha256},null,2));
  ensure(technicalPass,"independent Stage 1 verification failed");
}
try{run();}catch(error){console.error(error.stack||error.message||String(error));process.exitCode=1;}
