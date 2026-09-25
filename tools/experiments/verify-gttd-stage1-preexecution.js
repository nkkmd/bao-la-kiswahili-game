#!/usr/bin/env node
"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto");
const ROOT=path.resolve(__dirname,"../..");
const DOC=path.join(ROOT,"doc/geometry-trajectory-dynamics-transfer");
const G3=path.join(ROOT,"doc/geometry-conditioned-longitudinal-dynamics");
const BIND=JSON.parse(fs.readFileSync(path.join(DOC,"prereg/STAGE_1_EXECUTION_BINDING.json"),"utf8"));
const AUTH=JSON.parse(fs.readFileSync(path.join(DOC,"authorizations/STAGE_1_AUTHORIZATION.json"),"utf8"));
const SPEC=JSON.parse(fs.readFileSync(path.join(DOC,"prereg/STAGE_1_DEVELOPMENT_SPEC.json"),"utf8"));
const FW=JSON.parse(fs.readFileSync(path.join(DOC,"prereg/UPSTREAM_IDENTITY_FIREWALL.json"),"utf8"));
function need(x,m){if(!x)throw new Error(m)}
function sha256Bytes(b){return crypto.createHash("sha256").update(b).digest("hex")}
function sha256Text(s){return sha256Bytes(Buffer.from(String(s),"utf8"))}
function fileSha256(p){return sha256Bytes(fs.readFileSync(p))}
function gitBlobSha(rel){const b=fs.readFileSync(path.join(ROOT,rel));const h=Buffer.from(`blob ${b.length}\0`,"utf8");return crypto.createHash("sha1").update(h).update(b).digest("hex")}
function stable(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return`[${v.map(stable).join(",")}]`;return`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`}
function setDigest(s){return sha256Text([...s].map(String).sort().join("\n"))}
need(BIND.studyId==="GTTD-STUDY1"&&BIND.stageId===SPEC.stageId,"binding identity mismatch");
need(BIND.status==="FROZEN-PRE-FRESH"&&BIND.freshScientificSeedAccessAtBinding===0,"binding not pre-fresh");
need(AUTH.decision==="GTTD-STUDY1-STAGE1-AUTHORIZED-GITHUB-ACTIONS-ONCE"&&AUTH.authorizedScientificExecutions===1,"authorization mismatch");
need(AUTH.stage2SeedAccessAuthorized===false&&AUTH.rerunAuthorized===false&&AUTH.seedExtensionAuthorized===false,"authorization boundary invalid");
for(const [rel,expected] of Object.entries(BIND.gitBlobShaByPath||{})){const actual=gitBlobSha(rel);need(actual===expected,`blob mismatch ${rel}: ${actual} != ${expected}`)}
const s1=path.join(G3,"results/stage-1/STAGE_1_IDENTITY_EXCLUSION_FOR_STAGE_2.json"),s2=path.join(G3,"results/stage-2/STAGE_2_CANDIDATE_MANIFEST.json");
need(fileSha256(s1)===FW.identitySources.g3_10_stage1.fileSha256,"G3-10 Stage1 identity hash mismatch");
need(fileSha256(s2)===FW.identitySources.g3_10_stage2.fileSha256,"G3-10 Stage2 identity hash mismatch");
const g4dir=process.env.GTTD_G4_01_GCLD_SOURCE_DIR;need(g4dir&&fs.existsSync(g4dir),"G4-01 extracted source dir missing");
const meta=FW.identitySources.g4_01_stage1r_gcld,files=fs.readdirSync(g4dir).filter(n=>/^\d+\.json$/.test(n)).sort();need(files.length===meta.sourceRowCount,"G4-01 source row count mismatch");
const projected=[],seeds=new Set(),traj=new Set(),roots=new Set(),pc={};
for(const name of files){const o=JSON.parse(fs.readFileSync(path.join(g4dir,name),"utf8"));const cps=(o.checkpoints||[]).filter(Boolean).map(cp=>({ply:cp.ply,rootRawSha256:cp.rawStateSha256}));const r={sourceSeed:o.effectiveSeed??o.slotSeed,slotSeed:o.slotSeed,seedRole:o.seedRole,policyId:o.policyId,fullTrajectorySha256:o.trajectorySha256,checkpointRoots:cps};projected.push(r);seeds.add(String(r.sourceSeed));traj.add(r.fullTrajectorySha256);for(const cp of cps)if(cp.rootRawSha256)roots.add(cp.rootRawSha256);pc[r.policyId]=(pc[r.policyId]||0)+1}
need(sha256Text(stable(projected))===meta.canonicalIdentityProjectionSha256,"G4-01 projection digest mismatch");
need(seeds.size===meta.setDigests.sourceSeed.uniqueCount&&setDigest(seeds)===meta.setDigests.sourceSeed.sha256,"G4-01 seed set mismatch");
need(traj.size===meta.setDigests.fullTrajectorySha256.uniqueCount&&setDigest(traj)===meta.setDigests.fullTrajectorySha256.sha256,"G4-01 trajectory set mismatch");
need(roots.size===meta.setDigests.rootRawSha256.uniqueCount&&setDigest(roots)===meta.setDigests.rootRawSha256.sha256,"G4-01 root set mismatch");
need(stable(pc)===stable(meta.policyCounts),"G4-01 policy count mismatch");
need(SPEC.seedBlock.start===40413001&&SPEC.seedBlock.end===40413512&&SPEC.seedBlock.count===512,"Stage1 seed block mismatch");
console.log(`GTTD_STAGE1_PREFRESH_OK=${BIND.bindingId}`);
