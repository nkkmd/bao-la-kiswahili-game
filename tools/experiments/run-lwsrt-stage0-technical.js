#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const E = require("../../public/engine.js");
const P = require("./lib/lgttci-compatibility-production.js");
const I = require("./lib/lgttci-compatibility-independent.js");
const HP = require("./lib/lgtggc-stage0-production.js");
const HI = require("./lib/lgtggc-stage0-independent.js");

const ROOT = path.resolve(__dirname, "../..");
const STUDY = "LWSRT-STUDY1";
const STAGE = "LWSRT-S0-TECHNICAL-2026-09-24-v1";
const SPEC_PATH = path.join(ROOT, "doc/local-width-search-ranking-transfer/prereg/STUDY_1_SPEC.json");
const AUTH_PATH = path.join(ROOT, "doc/local-width-search-ranking-transfer/authorizations/STAGE_0_AUTHORIZATION.json");
const DEFAULT_OUT = path.join(ROOT, "artifacts/lwsrt-stage0/result.json");

function need(x, message) { if (!x) throw new Error(message); }
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function stable(x) {
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return `[${x.map(stable).join(",")}]`;
  return `{${Object.keys(x).sort().map(k => `${JSON.stringify(k)}:${stable(x[k])}`).join(",")}}`;
}
function sha256(x) { return crypto.createHash("sha256").update(typeof x === "string" ? x : stable(x), "utf8").digest("hex"); }
function gitBlobSha(file) {
  const body = fs.readFileSync(file);
  return crypto.createHash("sha1").update(Buffer.from(`blob ${body.length}\0`, "utf8")).update(body).digest("hex");
}
function sourceBindings(spec) {
  const out = [];
  for (const [name, item] of Object.entries(spec.sourceIdentity)) {
    need(item && item.path && item.gitBlobSha, `source identity incomplete: ${name}`);
    const file = path.join(ROOT, item.path);
    need(fs.existsSync(file), `source file missing: ${item.path}`);
    const actual = gitBlobSha(file);
    need(actual === item.gitBlobSha, `source blob mismatch ${name}: ${actual} != ${item.gitBlobSha}`);
    out.push({name, path:item.path, gitBlobSha:actual});
  }
  return out;
}
function replayCore(x) {
  return {
    policyId:x.policyId, seed:x.seed, moveKeys:x.moveKeys,
    rows:x.rows.map(r => ({ply:r.ply, phase:r.phase, terminal:r.terminal, rootLegalWidth:r.rootLegalWidth, rawStateSha256:r.rawStateSha256})),
    trajectorySha256:x.trajectorySha256, terminal:x.terminal
  };
}
function anchorCore(x) {
  const row = r => r ? ({ply:r.ply, phase:r.phase, terminal:r.terminal, rootLegalWidth:r.rootLegalWidth, rawStateSha256:r.rawStateSha256}) : null;
  return {familyId:x.familyId, namua:row(x.namua), mtaji:row(x.mtaji), complete:x.complete};
}
function widthClass(phase, width, thresholds) {
  need(phase === "namua" || phase === "mtaji", "invalid phase");
  need(Number.isInteger(width) && width >= 0, "invalid width");
  if (width < 2) return "SINGLETON";
  const t = thresholds[phase];
  if (width < t) return "LOW";
  if (width === t) return "EQUAL";
  return "HIGH";
}
function flattenConditions(spec) {
  const map = new Map();
  for (const c of spec.claimFamily.contrasts) {
    map.set(c.a.id, c.a);
    map.set(c.b.id, c.b);
  }
  return [...map.values()].sort((a,b)=>a.id.localeCompare(b.id));
}
function compareSearch(state, condition) {
  const a = P.classifySearch(E, state, condition);
  const b = I.classifySearch(E, state, condition);
  need(P.stable(a) === I.stable(b), `search production/independent mismatch ${condition.id}`);
  return {conditionId:condition.id, estimable:a.estimable, reasonCode:a.reasonCode, rootLegalWidth:a.rootLegalWidth, digest:P.digest(a)};
}
function exactArithmeticCheck() {
  const fixtures = [
    [{total:24, highN:12, changedTotal:12, changedHigh:9},{total:24, highN:12, changedTotal:10, changedHigh:7}],
    [{total:24, highN:12, changedTotal:8, changedHigh:2},{total:24, highN:12, changedTotal:14, changedHigh:5}],
    [{total:24, highN:12, changedTotal:12, changedHigh:6},{total:24, highN:12, changedTotal:12, changedHigh:6}]
  ];
  const rows = [];
  for (let i=0;i<fixtures.length;i++) {
    const p = HP.twoSidedStratified(fixtures[i]);
    const q = HI.twoSidedStratified(fixtures[i]);
    need(HP.stable(p) === HI.stable(q), `two-sided exact mismatch fixture ${i}`);
    rows.push({id:`F${i+1}`, pValue:p.pTwoSided, direction:p.direction, digest:HP.digest(p)});
  }
  const hp = HP.holm(rows);
  const hi = HI.holm(rows);
  need(HP.stable(hp) === HI.stable(hi), "Holm exact mismatch");
  return {rows, holmDigest:HP.digest(hp)};
}
function main(outFile) {
  const started = Date.now();
  const result = {schemaVersion:1, studyId:STUDY, stageId:STAGE, status:"TECHNICAL-INVALID", checks:{}, freshScientificSeedAccess:false};
  try {
    const spec = readJson(SPEC_PATH);
    const auth = readJson(AUTH_PATH);
    need(spec.studyId === STUDY, "Study identity mismatch");
    need(spec.stageStructure[0].stageId === STAGE, "Stage identity mismatch");
    need(auth.studyId === STUDY && auth.stageId === STAGE && auth.decision === "AUTHORIZED", "Stage0 authorization mismatch");
    need(auth.authorizationType === "TECHNICAL-ONLY", "Stage0 must be technical-only");
    need(auth.freshScientificSeedAccessAuthorized === false && auth.scientificOutcomeAuthorized === false, "fresh/scientific access unexpectedly authorized");
    need(spec.stage1.seedBlock.statusAtFreeze === "RESERVED-NOT-ACCESSED", "Stage1 namespace not sealed");
    need(spec.stage2.seedBlock.statusAtFreeze === "RESERVED-NOT-ACCESSED", "Stage2 namespace not sealed");
    result.checks.contractAuthorizationBinding = true;

    result.sourceBindings = sourceBindings(spec);
    result.checks.frozenSourceBlobBinding = true;

    need(P.P1 === spec.sourcePolicies[0].policyId && P.P2 === spec.sourcePolicies[1].policyId, "source policy binding mismatch");
    need(P.RF1 === spec.rootFamilies[0].rootFamilyId && P.RF2 === spec.rootFamilies[1].rootFamilyId, "root family binding mismatch");

    const tech = spec.technicalFixtureNamespace;
    need(tech.seedStart === auth.allowedTechnicalFixtureSeeds.start && tech.seedEnd === auth.allowedTechnicalFixtureSeeds.end, "technical seed authorization mismatch");

    let distinctPolicyTrajectories = 0;
    let completeAnchors = 0;
    let singletonSeen = false;
    let rankableSeen = false;
    const representative = new Map();
    for (let seed=tech.seedStart; seed<=tech.seedEnd; seed++) {
      const byPolicy = {};
      for (const policyId of [P.P1, P.P2]) {
        const pr = P.replay(E, policyId, seed, spec.resourceCeilings.maxSourcePliesPerTrajectory);
        const ir = I.replay(E, policyId, seed, spec.resourceCeilings.maxSourcePliesPerTrajectory);
        need(P.stable(replayCore(pr)) === I.stable(replayCore(ir)), `replay mismatch ${policyId} ${seed}`);
        byPolicy[policyId] = pr.trajectorySha256;
        for (const familyId of [P.RF1, P.RF2]) {
          const pa = P.selectAnchors(pr.rows, familyId);
          const ia = I.selectAnchors(ir.rows, familyId);
          need(P.stable(anchorCore(pa)) === I.stable(anchorCore(ia)), `anchor mismatch ${policyId} ${familyId} ${seed}`);
          if (pa.complete) completeAnchors++;
          for (const phase of ["namua","mtaji"]) {
            const r = pa[phase];
            if (!r) continue;
            if (r.rootLegalWidth < 2) singletonSeen = true;
            else {
              rankableSeen = true;
              const key = phase;
              if (!representative.has(key)) representative.set(key, r);
            }
          }
        }
      }
      if (byPolicy[P.P1] !== byPolicy[P.P2]) distinctPolicyTrajectories++;
    }
    need(distinctPolicyTrajectories > 0, "P1/P2 not technically distinguishable");
    need(completeAnchors > 0, "no complete RF anchor fixture");
    need(rankableSeen, "no rankable technical root");
    result.checks.sourcePolicyReplayExact = true;
    result.checks.sourcePoliciesDistinguishable = true;
    result.checks.rootFamilySelectionExact = true;

    const thresholds = spec.claimFamily.phaseThresholds;
    const boundaryCases = {
      namua:[1,2,3,4,5].map(w => [w,widthClass("namua",w,thresholds)]),
      mtaji:[1,2,3,4].map(w => [w,widthClass("mtaji",w,thresholds)])
    };
    need(stable(boundaryCases.namua) === stable([[1,"SINGLETON"],[2,"LOW"],[3,"LOW"],[4,"EQUAL"],[5,"HIGH"]]), "Namua width boundary mismatch");
    need(stable(boundaryCases.mtaji) === stable([[1,"SINGLETON"],[2,"LOW"],[3,"EQUAL"],[4,"HIGH"]]), "Mtaji width boundary mismatch");
    result.boundaryCases = boundaryCases;
    result.checks.widthClassBoundaryExact = true;

    const conditions = flattenConditions(spec);
    const searchChecks = [];
    for (const [key,row] of representative) {
      if (row.rootLegalWidth < 2) continue;
      for (const condition of conditions) searchChecks.push({rootClass:key, ...compareSearch(row.state, condition)});
    }
    need(searchChecks.length > 0, "no search exactness checks executed");
    result.searchChecks = searchChecks;
    result.checks.searchProductionIndependentExact = true;

    const singletonRows = [];
    if (singletonSeen) {
      for (let seed=tech.seedStart; seed<=tech.seedEnd && singletonRows.length===0; seed++) {
        for (const policyId of [P.P1,P.P2]) {
          const pr=P.replay(E,policyId,seed,spec.resourceCeilings.maxSourcePliesPerTrajectory);
          const row=pr.rows.find(r=>!r.terminal && r.rootLegalWidth===1);
          if (row) singletonRows.push(row);
        }
      }
    }
    if (singletonRows.length) {
      const c=conditions[0], a=P.classifySearch(E,singletonRows[0].state,c), b=I.classifySearch(E,singletonRows[0].state,c);
      need(P.stable(a)===I.stable(b), "singleton classification mismatch");
      need(a.estimable===false && a.reasonCode==="ROOT-LEGAL-WIDTH-LT2" && a.helperCalled===false, "singleton did not fail before helper");
      result.checks.singletonPreconditionFailClosed = true;
    } else {
      result.checks.singletonPreconditionFailClosed = "NOT-OBSERVED-IN-FIXTURE-NAMESPACE";
    }

    result.exactArithmetic = exactArithmeticCheck();
    result.checks.twoSidedHypergeometricExact = true;
    result.checks.holmExact = true;

    need(spec.protectedEvidence.g3_11Depth10Rerun === false, "depth10 rerun unexpectedly allowed");
    need(spec.protectedEvidence.g4_10Depth11Access === false, "depth11 access unexpectedly allowed");
    need(spec.protectedEvidence.publicAiChange === false, "public AI change unexpectedly allowed");
    result.checks.protectedBoundariesSealed = true;

    result.status = "STAGE0-PASS";
  } catch (error) {
    result.error = {name:error.name, message:error.message, stack:error.stack};
  } finally {
    result.elapsedMs = Date.now() - started;
    result.peakRssBytes = process.memoryUsage().rss;
    result.resultCoreSha256 = sha256({studyId:result.studyId,stageId:result.stageId,status:result.status,checks:result.checks,freshScientificSeedAccess:result.freshScientificSeedAccess});
    fs.mkdirSync(path.dirname(outFile), {recursive:true});
    fs.writeFileSync(outFile, JSON.stringify(result,null,2)+"\n");
  }
  if (result.status !== "STAGE0-PASS") process.exitCode = 1;
}

main(process.argv[2] || DEFAULT_OUT);
