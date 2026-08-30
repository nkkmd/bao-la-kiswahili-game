"use strict";
const crypto=require("node:crypto");
const fs=require("node:fs");
const path=require("node:path");
const zlib=require("node:zlib");
const {performance}=require("node:perf_hooks");
const P=require("./lib/mdft-stage1-production.js");
const I=require("./lib/mdft-stage1-independent.js");

const SPEC_PATH=path.resolve("doc/machine-decision-failure-taxonomy/preregistration/STAGE_1_DEVELOPMENT_SPEC.json");
const OUT=path.resolve(process.argv[2]||"artifacts/local/mdft-stage1-preflight");
const TECH_SEED_START=8_082_001;
const TECH_GAMES=128;
const TECH_QUOTA={namua:8,mtaji:8};
const FORCE_F10_ROOTS=4;
const TRANSFER_PROBE_BYTES=8*1024*1024;
function stable(x){if(x===null||typeof x!=="object")return JSON.stringify(x);if(Array.isArray(x))return`[${x.map(stable).join(",")}]`;return`{${Object.keys(x).sort().map(k=>`${JSON.stringify(k)}:${stable(x[k])}`).join(",")}}`}
function sha(x){return crypto.createHash("sha256").update(Buffer.isBuffer(x)?x:String(x)).digest("hex")}
function hash(x){return sha(stable(x))}
function assert(x,m){if(!x)throw new Error(m)}
function writeJson(name,x){fs.writeFileSync(path.join(OUT,name),JSON.stringify(x,null,2)+"\n")}
function ms(fn){const t=performance.now(),value=fn();return{value,ms:performance.now()-t}}
function summarySelection(s){return{generatedGames:s.generatedGames,uniqueTrajectories:s.uniqueTrajectories,distinctOpeningPrefixes:s.distinctOpeningPrefixes,selectedRoots:s.selectedRoots,selectedNamua:s.selectedNamua,selectedMtaji:s.selectedMtaji,sourcePolicyCounts:s.sourcePolicyCounts,selectionHash:s.selectionHash}}
function selectedIdentity(s){return s.selected.map(x=>({seed:x.seed,sourcePolicy:x.sourcePolicy,phase:x.phase,ply:x.ply,legalMoveCount:x.legalMoveCount,rawStateKey:x.rawStateKey,trajectoryHash:x.trajectoryHash,openingPrefixHash:x.openingPrefixHash,quotaRank:x.quotaRank}))}
function comparisonRows(rows){const out=JSON.parse(JSON.stringify(rows));for(const r of out){for(const k of ["reserve","house"]){if(r.diagnostics&&r.diagnostics.ablation&&r.diagnostics.ablation[k])delete r.diagnostics.ablation[k].bestScore}}return out}
function project(observed,scale){return observed*scale}
function makeProbe(size){const b=Buffer.allocUnsafe(size);let offset=0,counter=0;while(offset<size){const block=crypto.createHash("sha256").update(`MDFT-STAGE1-TRANSFER-PROBE|${counter}`).digest();block.copy(b,offset,0,Math.min(block.length,size-offset));offset+=block.length;counter+=1}return b}
fs.mkdirSync(OUT,{recursive:true});
const spec=JSON.parse(fs.readFileSync(SPEC_PATH,"utf8"));
const noHash=JSON.parse(JSON.stringify(spec));delete noHash.specSha256;
assert(hash(noHash)===spec.specSha256,`spec hash mismatch ${hash(noHash)} != ${spec.specSha256}`);
assert(spec.specSha256==="85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203","unexpected Stage 1 spec hash");
assert(TECH_SEED_START+TECH_GAMES-1<spec.seedBlock.seedStart,"technical seeds overlap scientific block");

const opt={games:TECH_GAMES,seedStart:TECH_SEED_START,phaseQuota:TECH_QUOTA,maxPly:spec.sourceGeneration.maxPly};
const pg=ms(()=>P.generate(spec,opt));
const ig=ms(()=>I.generate(spec,opt));
const pGameSummaries=pg.value.map(r=>r.gameSummary),iGameSummaries=ig.value.map(r=>r.gameSummary);
assert(stable(pGameSummaries)===stable(iGameSummaries),"production/independent source generation mismatch");
const ps=ms(()=>P.selectRoots(pg.value,spec,opt));
const isel=ms(()=>I.select(ig.value,spec,opt));
assert(stable(summarySelection(ps.value))===stable(summarySelection(isel.value)),"selection summary mismatch");
assert(stable(selectedIdentity(ps.value))===stable(selectedIdentity(isel.value)),"selected root identity mismatch");
assert(ps.value.selectedNamua>0&&ps.value.selectedMtaji>0,"technical preflight lacks both phases");

const pa=ms(()=>ps.value.selected.map(r=>P.analyzeRoot(r,spec)));
const ia=ms(()=>isel.value.selected.map(r=>I.analyze(r,spec)));
const pRows=comparisonRows(pa.value),iRows=comparisonRows(ia.value);
assert(stable(pRows)===stable(iRows),"production/independent Stage 1 analysis mismatch");

const f10p=[],f10i=[];
const f10Start=performance.now();
for(let n=0;n<Math.min(FORCE_F10_ROOTS,ps.value.selected.length);n++){
  const pr=ps.value.selected[n],ir=isel.value.selected[n];
  const rowP=pa.value[n],rowI=ia.value[n];
  const bp=rowP.searchGrid.D2_Q1_BASE.canonicalBestMoveKey,rp=rowP.searchGrid.D3_Q1_REFERENCE.canonicalBestMoveKey;
  const bi=rowI.searchGrid.D2_Q1_BASE.canonicalBestMoveKey,ri=rowI.searchGrid.D3_Q1_REFERENCE.canonicalBestMoveKey;
  f10p.push(P.f10Pair(pr.root,bp,rp,spec));
  f10i.push(I.f10(ir.root,bi,ri,spec));
}
const forcedF10Ms=performance.now()-f10Start;
assert(stable(f10p)===stable(f10i),"forced F10 production/independent mismatch");

const detailedProduction={games:pGameSummaries,selection:selectedIdentity(ps.value),rows:pRows,forcedF10:f10p};
const detailedIndependent={games:iGameSummaries,selection:selectedIdentity(isel.value),rows:iRows,forcedF10:f10i};
const pCanonical=Buffer.from(stable(detailedProduction)),iCanonical=Buffer.from(stable(detailedIndependent));
assert(pCanonical.equals(iCanonical),"canonical detailed payload mismatch");
const pGzip=zlib.gzipSync(pCanonical,{level:6}),iGzip=zlib.gzipSync(iCanonical,{level:6});
assert(pGzip.equals(iGzip),"gzip detailed payload mismatch");

const gameScale=spec.seedBlock.games/TECH_GAMES;
const rootScale=spec.readinessGates.requiredSelectedRoots/Math.max(1,ps.value.selectedRoots);
const pProjectedMs=project(pg.ms+ps.ms,gameScale)+project(pa.ms,rootScale)+project(forcedF10Ms/2,rootScale);
const iProjectedMs=project(ig.ms+isel.ms,gameScale)+project(ia.ms,rootScale)+project(forcedF10Ms/2,rootScale);
const sourceOnlyP=Buffer.from(stable(pGameSummaries)),rowsOnlyP=Buffer.from(stable({selection:selectedIdentity(ps.value),rows:pRows,forcedF10:f10p}));
const sourceGzip=zlib.gzipSync(sourceOnlyP,{level:6}).length,rowsGzip=zlib.gzipSync(rowsOnlyP,{level:6}).length;
const projectedOneSideGzip=project(sourceGzip,gameScale)+project(rowsGzip,rootScale);
const projectedBothSidesGzip=projectedOneSideGzip*2;
const rssKb=process.resourceUsage().maxRSS;

const comparison={
  stageId:spec.stageId,
  specSha256:spec.specSha256,
  technicalSeedStart:TECH_SEED_START,
  technicalSeedEnd:TECH_SEED_START+TECH_GAMES-1,
  scientificSeedOverlap:false,
  sourceGenerationExact:true,
  rootSelectionExact:true,
  analysisExact:true,
  forcedF10Exact:true,
  canonicalPayloadExact:true,
  canonicalPayloadSha256:sha(pCanonical),
  canonicalGzipSha256:sha(pGzip),
  selectedRootCount:ps.value.selectedRoots,
  selectedPhaseCoverage:{namua:ps.value.selectedNamua>0,mtaji:ps.value.selectedMtaji>0},
  selectedSourcePolicyCoverage:Object.fromEntries(Object.entries(ps.value.sourcePolicyCounts).map(([k,v])=>[k,v>0]))
};
writeJson("FINAL_EXACT_COMPARISON.json",comparison);

const probe=makeProbe(TRANSFER_PROBE_BYTES);fs.writeFileSync(path.join(OUT,"TRANSFER_PROBE_8M.bin"),probe);
const result={
  schemaVersion:"1.0.0",
  stageId:spec.stageId,
  type:"TECHNICAL_ONLY_PREFLIGHT",
  scientificInferenceAuthorized:false,
  scientificSeedUseAllowed:false,
  specSha256:spec.specSha256,
  technicalCorpus:{games:TECH_GAMES,seedStart:TECH_SEED_START,seedEnd:TECH_SEED_START+TECH_GAMES-1,quota:TECH_QUOTA},
  equality:{source:true,selection:true,analysis:true,forcedF10:true,canonicalPayload:true},
  controls:{bothPhasesPresent:ps.value.selectedNamua>0&&ps.value.selectedMtaji>0,allSourcePoliciesPresent:Object.values(ps.value.sourcePolicyCounts).every(v=>v>0),forcedF10Roots:f10p.length},
  resource:{productionObservedMs:{generation:pg.ms,selection:ps.ms,analysis:pa.ms},independentObservedMs:{generation:ig.ms,selection:isel.ms,analysis:ia.ms},forcedF10CombinedMs:forcedF10Ms,productionProjectedScientificMs:pProjectedMs,independentProjectedScientificMs:iProjectedMs,productionCeilingMs:spec.artifactContract.productionWallClockCeilingMs,independentCeilingMs:spec.artifactContract.independentWallClockCeilingMs,maxRssKb:rssKb,rssCeilingKb:spec.artifactContract.peakRssCeilingKb},
  artifactProjection:{technicalCanonicalBytes:pCanonical.length,technicalGzipBytes:pGzip.length,sourceTechnicalGzipBytes:sourceGzip,rootTechnicalGzipBytes:rowsGzip,projectedOneSideGzipBytes:projectedOneSideGzip,projectedBothSidesGzipBytes:projectedBothSidesGzip,totalCompressedArtifactCeilingBytes:spec.artifactContract.totalCompressedArtifactCeilingBytes,compressedShardCeilingBytes:spec.artifactContract.compressedShardCeilingBytes,transferProbeBytes:TRANSFER_PROBE_BYTES},
  gates:{productionRuntime:pProjectedMs<=spec.artifactContract.productionWallClockCeilingMs,independentRuntime:iProjectedMs<=spec.artifactContract.independentWallClockCeilingMs,rss:rssKb<=spec.artifactContract.peakRssCeilingKb,artifact:projectedBothSidesGzip<=spec.artifactContract.totalCompressedArtifactCeilingBytes,shardProbe:TRANSFER_PROBE_BYTES<=spec.artifactContract.compressedShardCeilingBytes},
  targetDistributionReported:false
};
result.allGatesPass=Object.values(result.gates).every(Boolean)&&Object.values(result.equality).every(Boolean)&&result.controls.bothPhasesPresent&&result.controls.allSourcePoliciesPresent&&result.controls.forcedF10Roots>=1;
writeJson("STAGE_1_TECHNICAL_PREFLIGHT_RESULT.json",result);
const manifest={
  spec:{path:"doc/machine-decision-failure-taxonomy/preregistration/STAGE_1_DEVELOPMENT_SPEC.json",sha256:sha(fs.readFileSync(SPEC_PATH))},
  outputs:{}
};
for(const name of["FINAL_EXACT_COMPARISON.json","STAGE_1_TECHNICAL_PREFLIGHT_RESULT.json","TRANSFER_PROBE_8M.bin"]){const b=fs.readFileSync(path.join(OUT,name));manifest.outputs[name]={bytes:b.length,sha256:sha(b)}}
writeJson("HASH_MANIFEST.json",manifest);
console.log(JSON.stringify({stageId:spec.stageId,technicalOnly:true,specSha256:spec.specSha256,selectedRootCount:ps.value.selectedRoots,equality:result.equality,gates:result.gates,allGatesPass:result.allGatesPass,targetDistributionReported:false},null,2));
if(!result.allGatesPass)process.exitCode=2;
