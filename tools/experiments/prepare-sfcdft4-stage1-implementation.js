#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "../..");
function p(rel) { return path.join(ROOT, rel); }
function read(rel) { return fs.readFileSync(p(rel), "utf8"); }
function write(rel, text) { fs.mkdirSync(path.dirname(p(rel)), { recursive: true }); fs.writeFileSync(p(rel), text, "utf8"); }
function need(x, message) { if (!x) throw new Error(message); }
function replaceOnce(text, from, to, label) {
  need(text.includes(from), `${label}: replacement anchor missing`);
  return text.replace(from, to);
}

const copies = {
  ".github/actions/sfcdft3-stage1-acquire-slot/action.yml": ".github/actions/sfcdft4-stage1-acquire-slot/action.yml",
  ".github/workflows/sfcdft3-stage1-github-actions.yml": ".github/workflows/sfcdft4-stage1-github-actions.yml",
  "tools/experiments/lib/sfcdft3-source-production.js": "tools/experiments/lib/sfcdft4-source-production.js",
  "tools/experiments/lib/sfcdft3-source-independent.js": "tools/experiments/lib/sfcdft4-source-independent.js",
  "tools/experiments/lib/sfcdft3-production.js": "tools/experiments/lib/sfcdft4-production.js",
  "tools/experiments/lib/sfcdft3-independent.js": "tools/experiments/lib/sfcdft4-independent.js",
  "tools/experiments/run-sfcdft3-stage1-source-unit.js": "tools/experiments/run-sfcdft4-stage1-source-unit.js",
  "tools/experiments/generate-sfcdft3-stage1-actions-matrices.js": "tools/experiments/generate-sfcdft4-stage1-actions-matrices.js",
  "tools/experiments/classify-sfcdft3-stage1-actions-artifacts.js": "tools/experiments/classify-sfcdft4-stage1-actions-artifacts.js",
  "tools/experiments/bundle-sfcdft3-stage1-source.js": "tools/experiments/bundle-sfcdft4-stage1-source.js",
  "tools/experiments/run-sfcdft3-stage1-measurement-task.js": "tools/experiments/run-sfcdft4-stage1-measurement-task.js",
  "tools/experiments/run-sfcdft3-stage1-aggregate.js": "tools/experiments/run-sfcdft4-stage1-aggregate.js",
  "tools/experiments/verify-sfcdft3-stage1-actions-authorization.js": "tools/experiments/verify-sfcdft4-stage1-actions-authorization.js"
};

const replacements = [
  ["research/g4-02-sfcdft-study3-prereg", "research/g4-02-sfcdft-study4-prereg"],
  ["SFCDFT3-S1-COMPATIBILITY-2026-09-19-v1", "SFCDFT4-S1-COMPATIBILITY-2026-09-19-v1"],
  ["SFCDFT-STUDY3", "SFCDFT-STUDY4"],
  ["SFCDFT3-D", "SFCDFT4-D"],
  ["STUDY_3_STAGE_1", "STUDY_4_STAGE_1"],
  ["STUDY_3_SPEC.json", "STUDY_4_SPEC.json"],
  ["sfcdft3", "sfcdft4"],
  ["Study3", "Study4"],
  ["40511001", "40611001"],
  ["40511384", "40611384"],
  ["41511001", "41611001"],
  ["41511384", "41611384"],
  ["49031002", "49041002"],
  ["50031002", "50041002"]
];

for (const [src, dst] of Object.entries(copies)) {
  let text = read(src);
  for (const [a, b] of replacements) text = text.split(a).join(b);
  write(dst, text);
}

const spec = JSON.parse(read("doc/structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_3_STAGE_1_COMPATIBILITY_SPEC.json"));
spec.studyId = "SFCDFT-STUDY4";
spec.stageId = "SFCDFT4-S1-COMPATIBILITY-2026-09-19-v1";
spec.statusAtFreeze = "FROZEN-AFTER-PREACCESS-PASS-BEFORE-FRESH-ACCESS";
spec.prerequisiteStage0 = {
  path: "doc/structural-forcing-corridor-tree-raw-transfer/results/stage-0-study4/STUDY_4_STAGE_0_TECHNICAL_RESULT.json",
  gitBlobSha: "a930140db87ae98da6079d4484812092d30211e0",
  decision: "STAGE0-PASS",
  workflowRunId: 35435952961,
  sourceBundleArtifactId: 10582054771,
  sourceBundleArtifactDigest: "sha256:c171dcfc78320be4ce51cd93afdf95cf76f5cdc735a7c099c27ac542feccf8e5",
  finalResultArtifactId: 10582298316,
  finalResultArtifactDigest: "sha256:292ff27460f3c14f02f22c723245c06af408376475d71dfcf89230d74d48ba5a",
  bundleCoreSha256: "ee402806f362ecb483f04353632d2e829ee13175bcab91b8b4038a091a3df01f",
  deterministicCoreSha256: "ebcffb9ab33acbafa6f5344740f0cc93d12fbd330911a2f96cac76b6c66d2133"
};
spec.freshSeedSlots = {
  primary: { seedStart: 40611001, seedEnd: 40611384, count: 384 },
  pairedReserve: { seedStart: 41611001, seedEnd: 41611384, count: 384 },
  reserveMapping: "reserveSeed = primarySeed + 1000000",
  maxInfrastructureReplacements: 16,
  maxFreshSeedReads: 400,
  seedExtensionAuthorized: false,
  reserveOfReserveAuthorized: false
};
for (const d of spec.domains) d.domainId = d.domainId.replace("SFCDFT3-D", "SFCDFT4-D");
spec.identityFirewalls.study3Stage1 = {
  path: "doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study3-stage1/MANIFEST.json",
  gitBlobSha: "b4d1add69c4ee446dcdf1eb516c24c6b1b7a5a18",
  identityCoreSha256: "3d8e9b9e175c63a864ea72a1cdc3b667feba2f216758a9325ebacba2c3c81cda",
  forbiddenSeedNamespaces: ["40511001..40511384", "41511001..41511384"],
  exclude: ["sourceTrajectorySha256", "openingPrefixSha256", "rootRawSha256"]
};
spec.identityFirewalls.study3Stage2 = {
  path: "doc/research-generation-4/identity-firewalls/g4-02-sfcdft-study3-stage2/MANIFEST.json",
  gitBlobSha: "b7d9d369f6dae9f083ab25554a1617998e363af5",
  identityCoreSha256: "4e9948fed1f7274f7d25b07f95fbc65ce3341b892dc64a288a6bcaa86f39b382",
  forbiddenSeedNamespaces: ["40521001..40521768", "41521001..41521768"],
  exclude: ["sourceTrajectorySha256", "openingPrefixSha256", "rootRawSha256"],
  scientificDecisionImported: false
};
spec.measurement.productionImplementation = "tools/experiments/lib/sfcdft4-production.js";
spec.measurement.independentImplementation = "tools/experiments/lib/sfcdft4-independent.js";
spec.protectedEvidence.study3Stage1Replay = false;
spec.protectedEvidence.study3Stage2RepairOrRerun = false;
spec.protectedEvidence.study3ScientificSeedReread = false;
write("doc/structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_4_STAGE_1_COMPATIBILITY_SPEC.json", `${JSON.stringify(spec, null, 2)}\n`);

let bundle = read("tools/experiments/bundle-sfcdft4-stage1-source.js");
const loaderFns = `function loadStudy3Stage1(){const cfg=SPEC.identityFirewalls.study3Stage1,fw=readBound(cfg.path,cfg.gitBlobSha),base=path.dirname(path.join(ROOT,cfg.path));need(fw.identityCoreSha256===cfg.identityCoreSha256,'Study3 Stage1 firewall core mismatch');need(fw.scientificSeedReplay===false&&fw.scientificEndpointLoaded===false,'Study3 Stage1 firewall boundary mismatch');const out={trajectory:readSet(path.join(base,'SOURCE_TRAJECTORY_SHA256.txt')),prefix:readSet(path.join(base,'OPENING_PREFIX_SHA256.txt')),root:readSet(path.join(base,'RAW_ROOT_SHA256.txt'))};need(out.trajectory.size===fw.identityCounts.uniqueSourceTrajectorySha256&&out.prefix.size===fw.identityCounts.uniqueOpeningPrefixSha256&&out.root.size===fw.identityCounts.uniqueRawRootSha256,'Study3 Stage1 firewall count mismatch');return out;}\nfunction loadStudy3Stage2(){const cfg=SPEC.identityFirewalls.study3Stage2,fw=readBound(cfg.path,cfg.gitBlobSha),base=path.dirname(path.join(ROOT,cfg.path));need(fw.identityCoreSha256===cfg.identityCoreSha256,'Study3 Stage2 firewall core mismatch');need(fw.scientificSeedReplay===false&&fw.scientificEndpointLoaded===false&&fw.scientificMeasurementLoaded===false&&fw.scientificAggregateLoaded===false,'Study3 Stage2 firewall boundary mismatch');const out={trajectory:readSet(path.join(base,'SOURCE_TRAJECTORY_SHA256.txt')),prefix:readSet(path.join(base,'OPENING_PREFIX_SHA256.txt')),root:readSet(path.join(base,'RAW_ROOT_SHA256.txt'))};need(out.trajectory.size===fw.identityCounts.uniqueSourceTrajectorySha256&&out.prefix.size===fw.identityCounts.uniqueOpeningPrefixSha256&&out.root.size===fw.identityCounts.uniqueRawRootSha256,'Study3 Stage2 firewall count mismatch');return out;}\n`;
bundle = replaceOnce(bundle, "function limits(){", `${loaderFns}function limits(){`, "bundle loader functions");
bundle = replaceOnce(bundle,
  "const legacy=loadLegacy(),study1=loadStudy1(),study2=loadStudy2();",
  "const legacy=loadLegacy(),study1=loadStudy1(),study2=loadStudy2(),study3s1=loadStudy3Stage1(),study3s2=loadStudy3Stage2();",
  "bundle loader invocation");
bundle = replaceOnce(bundle,
  "for(const fw of[SPEC.identityFirewalls.g4_01Legacy,SPEC.identityFirewalls.study1,SPEC.identityFirewalls.study2])",
  "for(const fw of[SPEC.identityFirewalls.g4_01Legacy,SPEC.identityFirewalls.study1,SPEC.identityFirewalls.study2,SPEC.identityFirewalls.study3Stage1,SPEC.identityFirewalls.study3Stage2])",
  "bundle seed namespace firewall");
const collisionAnchor = "  if(!reason&&study2.trajectory.has(j.sourceTrajectorySha256))reason='STUDY2-TRAJECTORY-COLLISION';if(!reason&&study2.prefix.has(j.openingPrefixSha256))reason='STUDY2-OPENING-PREFIX-COLLISION';if(!reason&&(study2.root.has(j.namua.rawStateSha256)||study2.root.has(j.mtaji.rawStateSha256)))reason='STUDY2-RAW-ROOT-COLLISION';";
const collisionExtra = `${collisionAnchor}\n  if(!reason&&study3s1.trajectory.has(j.sourceTrajectorySha256))reason='STUDY3-STAGE1-TRAJECTORY-COLLISION';if(!reason&&study3s1.prefix.has(j.openingPrefixSha256))reason='STUDY3-STAGE1-OPENING-PREFIX-COLLISION';if(!reason&&(study3s1.root.has(j.namua.rawStateSha256)||study3s1.root.has(j.mtaji.rawStateSha256)))reason='STUDY3-STAGE1-RAW-ROOT-COLLISION';\n  if(!reason&&study3s2.trajectory.has(j.sourceTrajectorySha256))reason='STUDY3-STAGE2-TRAJECTORY-COLLISION';if(!reason&&study3s2.prefix.has(j.openingPrefixSha256))reason='STUDY3-STAGE2-OPENING-PREFIX-COLLISION';if(!reason&&(study3s2.root.has(j.namua.rawStateSha256)||study3s2.root.has(j.mtaji.rawStateSha256)))reason='STUDY3-STAGE2-RAW-ROOT-COLLISION';`;
bundle = replaceOnce(bundle, collisionAnchor, collisionExtra, "bundle Study3 collision firewall");
bundle = replaceOnce(bundle,
  "study2Root:study2.root.size}",
  "study2Root:study2.root.size,study3Stage1Trajectory:study3s1.trajectory.size,study3Stage1OpeningPrefix:study3s1.prefix.size,study3Stage1Root:study3s1.root.size,study3Stage2Trajectory:study3s2.trajectory.size,study3Stage2OpeningPrefix:study3s2.prefix.size,study3Stage2Root:study3s2.root.size}",
  "bundle firewall manifest counts");
write("tools/experiments/bundle-sfcdft4-stage1-source.js", bundle);

const preflight = `name: SFCDFT4 Stage1 pre-access preflight

on:
  push:
    branches:
      - research/g4-02-sfcdft-study4-prereg
    paths:
      - doc/structural-forcing-corridor-tree-raw-transfer/authorizations/STUDY_4_STAGE_1_PRE_EXECUTION_BINDING.json

permissions:
  contents: read

jobs:
  preflight:
    name: Study4 Stage1 seed-free preflight
    runs-on: ubuntu-24.04
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      - name: Verify frozen pre-execution binding
        env:
          EVENT_BEFORE: \${{ github.event.before }}
        run: |
          node - <<'NODE'
          const fs=require('node:fs'),cp=require('node:child_process');
          const binding='doc/structural-forcing-corridor-tree-raw-transfer/authorizations/STUDY_4_STAGE_1_PRE_EXECUTION_BINDING.json';
          const final='doc/structural-forcing-corridor-tree-raw-transfer/authorizations/STUDY_4_STAGE_1_EXECUTION_AUTHORIZATION.json';
          if(fs.existsSync(final)) throw new Error('final Stage1 authorization must be absent during preflight');
          const b=JSON.parse(fs.readFileSync(binding,'utf8'));
          if(b.studyId!=='SFCDFT-STUDY4'||b.stageId!=='SFCDFT4-S1-COMPATIBILITY-2026-09-19-v1'||b.status!=='FROZEN-PRE-EXECUTION') throw new Error('binding identity mismatch');
          if(b.bindingBaseHead!==process.env.EVENT_BEFORE) throw new Error('binding parent mismatch');
          if(b.freshScientificSeedAccessAuthorized!==false||b.stage2ScientificSeedAccessAuthorized!==false||b.mainIntegrationAuthorized!==false) throw new Error('preflight authorization boundary violated');
          for(const [file,sha] of Object.entries(b.boundGitBlobs)){if(!fs.existsSync(file))throw new Error('missing bound file '+file);const actual=cp.execFileSync('git',['hash-object',file],{encoding:'utf8'}).trim();if(actual!==sha)throw new Error('bound blob mismatch '+file);}
          console.log(JSON.stringify({boundFileCount:Object.keys(b.boundGitBlobs).length,bindingBaseHead:b.bindingBaseHead}));
          NODE
      - name: Syntax check Study4 Stage1 implementation
        run: |
          set -euo pipefail
          node --check tools/experiments/lib/sfcdft4-source-production.js
          node --check tools/experiments/lib/sfcdft4-source-independent.js
          node --check tools/experiments/lib/sfcdft4-production.js
          node --check tools/experiments/lib/sfcdft4-independent.js
          node --check tools/experiments/run-sfcdft4-stage1-source-unit.js
          node --check tools/experiments/generate-sfcdft4-stage1-actions-matrices.js
          node --check tools/experiments/classify-sfcdft4-stage1-actions-artifacts.js
          node --check tools/experiments/bundle-sfcdft4-stage1-source.js
          node --check tools/experiments/run-sfcdft4-stage1-measurement-task.js
          node --check tools/experiments/run-sfcdft4-stage1-aggregate.js
          node --check tools/experiments/verify-sfcdft4-stage1-actions-authorization.js
      - name: Verify canonical Study4 Stage0 prerequisite
        run: |
          node - <<'NODE'
          const fs=require('node:fs');
          const r=JSON.parse(fs.readFileSync('doc/structural-forcing-corridor-tree-raw-transfer/results/stage-0-study4/STUDY_4_STAGE_0_TECHNICAL_RESULT.json','utf8'));
          if(r.studyId!=='SFCDFT-STUDY4'||r.stageId!=='SFCDFT4-S0-E2E-TECHNICAL-2026-09-19-v1'||r.decision!=='STAGE0-PASS')throw new Error('Stage0 prerequisite mismatch');
          if(r.freshScientificSeedReads!==0||r.scientificOutputsGenerated!==0)throw new Error('Stage0 scientific boundary mismatch');
          if(r.deterministicCoreSha256!=='ebcffb9ab33acbafa6f5344740f0cc93d12fbd330911a2f96cac76b6c66d2133')throw new Error('Stage0 deterministic core mismatch');
          fs.writeFileSync('/tmp/stage0.json',JSON.stringify(r));
          NODE
      - name: Verify durable Study3 identity firewalls
        run: |
          node - <<'NODE'
          const fs=require('node:fs'),cp=require('node:child_process');
          const s=require('./doc/structural-forcing-corridor-tree-raw-transfer/prereg/STUDY_4_STAGE_1_COMPATIBILITY_SPEC.json');
          for(const key of ['study3Stage1','study3Stage2']){
            const c=s.identityFirewalls[key];
            const actual=cp.execFileSync('git',['hash-object',c.path],{encoding:'utf8'}).trim();
            if(actual!==c.gitBlobSha)throw new Error(key+' manifest blob mismatch');
            const m=JSON.parse(fs.readFileSync(c.path,'utf8'));
            if(m.identityCoreSha256!==c.identityCoreSha256)throw new Error(key+' identity core mismatch');
            if(m.scientificSeedReplay!==false||m.scientificEndpointLoaded!==false)throw new Error(key+' scientific boundary mismatch');
          }
          const fresh=[40611001,40611384,41611001,41611384];
          for(const c of Object.values(s.identityFirewalls))for(const range of c.forbiddenSeedNamespaces||[]){const [a,b]=range.split('..').map(Number);for(const seed of fresh)if(seed>=a&&seed<=b)throw new Error('fresh namespace collision '+seed+' with '+range);}
          NODE
      - name: Verify primary/reserve assignment semantics on technical seeds
        run: |
          set -euo pipefail
          node tools/experiments/run-sfcdft4-stage1-source-unit.js --technical-fixture --slot-seed 49041002 --effective-seed 49041002 --output /tmp/source-primary.json
          node tools/experiments/run-sfcdft4-stage1-source-unit.js --technical-fixture --slot-seed 49041002 --effective-seed 50041002 --output /tmp/source-reserve.json
          node - <<'NODE'
          const p=require('/tmp/source-primary.json'),r=require('/tmp/source-reserve.json');
          if(p.policyId!==r.policyId||p.rootFamilyId!==r.rootFamilyId||p.domainId!==r.domainId)throw new Error('reserve changed primary assignment');
          if(p.slotSeed!==r.slotSeed||r.effectiveSeed!==50041002)throw new Error('reserve provenance mismatch');
          const ok=new Set(['CANDIDATE-PAIR-COMPLETE','NO-CANDIDATE-ROOT-SHORTAGE','NO-CANDIDATE-ENGINE-GUARD-CENSORING']);
          if(!ok.has(p.candidateStatus)||!ok.has(r.candidateStatus))throw new Error('unexpected technical source status');
          NODE
      - name: Verify frozen source and measurement matrices
        run: |
          set -euo pipefail
          rm -f /tmp/matrix-output
          GITHUB_OUTPUT=/tmp/matrix-output node tools/experiments/generate-sfcdft4-stage1-actions-matrices.js
          grep -q '^source=' /tmp/matrix-output
          grep -q '^measurement=' /tmp/matrix-output
      - name: Verify classifier with synthetic complete immutable artifact set
        run: |
          node - <<'NODE' > /tmp/artifact-names.txt
          for(let s=40611001;s<=40611384;s++){console.log('sfcdft4-s1-primary-start-'+s);console.log('sfcdft4-s1-source-'+s);}
          NODE
          node tools/experiments/classify-sfcdft4-stage1-actions-artifacts.js --mode final --names /tmp/artifact-names.txt --summary /tmp/classifier.json
          node - <<'NODE'
          const r=require('/tmp/classifier.json');if(r.fatal||r.sourceCount!==384||r.primaryStartCount!==384||r.deterministicFailureCount!==0||r.unresolvedCount!==0)throw new Error('classifier synthetic final mismatch');
          NODE
      - name: Write seed-free preflight result
        run: |
          node - <<'NODE'
          const fs=require('node:fs'),crypto=require('node:crypto');
          const s0=require('/tmp/stage0.json'),p=require('/tmp/source-primary.json'),r=require('/tmp/source-reserve.json'),c=require('/tmp/classifier.json');
          const core={schemaVersion:1,studyId:'SFCDFT-STUDY4',stageId:'SFCDFT4-S1-COMPATIBILITY-2026-09-19-v1',decision:'PREFLIGHT-PASS',freshScientificSeedReads:0,stage0DeterministicCoreSha256:s0.deterministicCoreSha256,study3Stage1FirewallCore:'3d8e9b9e175c63a864ea72a1cdc3b667feba2f216758a9325ebacba2c3c81cda',study3Stage2FirewallCore:'4e9948fed1f7274f7d25b07f95fbc65ce3341b892dc64a288a6bcaa86f39b382',primaryFixtureStatus:p.candidateStatus,reserveFixtureStatus:r.candidateStatus,assignmentStable:p.domainId===r.domainId,classifierSourceCount:c.sourceCount,classifierFatal:c.fatal,stage1FreshAccessAuthorized:false,stage2AccessAuthorized:false,mainIntegrationAuthorized:false};
          const stable=x=>x===null||typeof x!=='object'?JSON.stringify(x):Array.isArray(x)?'['+x.map(stable).join(',')+']':'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}';
          core.deterministicCoreSha256=crypto.createHash('sha256').update(stable(core)).digest('hex');
          fs.mkdirSync('artifacts/sfcdft4-stage1-preflight',{recursive:true});fs.writeFileSync('artifacts/sfcdft4-stage1-preflight/PREFLIGHT_RESULT.json',JSON.stringify(core,null,2)+'\\n');console.log(JSON.stringify(core));
          NODE
      - uses: actions/upload-artifact@v4
        with:
          name: sfcdft4-stage1-preflight-\${{ github.run_id }}
          path: artifacts/sfcdft4-stage1-preflight/PREFLIGHT_RESULT.json
          if-no-files-found: error
          retention-days: 90
          compression-level: 0
`;
write(".github/workflows/sfcdft4-stage1-preflight.yml", preflight);

for (const file of [
  "tools/experiments/run-sfcdft4-stage1-source-unit.js",
  "tools/experiments/generate-sfcdft4-stage1-actions-matrices.js",
  "tools/experiments/classify-sfcdft4-stage1-actions-artifacts.js",
  "tools/experiments/bundle-sfcdft4-stage1-source.js",
  "tools/experiments/run-sfcdft4-stage1-measurement-task.js",
  "tools/experiments/run-sfcdft4-stage1-aggregate.js",
  "tools/experiments/verify-sfcdft4-stage1-actions-authorization.js"
]) {
  const text = read(file);
  need(!text.includes("SFCDFT-STUDY3"), `${file}: stale Study3 identity`);
  need(!text.includes("40511001"), `${file}: stale Study3 primary namespace`);
}

process.stdout.write(JSON.stringify({event:"SFCDFT4-STAGE1-IMPLEMENTATION-PREPARED",studyId:"SFCDFT-STUDY4",stageId:"SFCDFT4-S1-COMPATIBILITY-2026-09-19-v1",freshScientificSeedReads:0}) + "\n");
