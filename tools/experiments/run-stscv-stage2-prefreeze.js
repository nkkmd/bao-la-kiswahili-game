#!/usr/bin/env node
"use strict";
const crypto=require("node:crypto"),fs=require("node:fs"),path=require("node:path");
const ROOT=path.resolve(__dirname,"../..");
const P=(rel)=>path.join(ROOT,rel);
const SPEC_REL="doc/state-transformation-semantics-canonicalization-validation/preregistration/STAGE_2_SPEC.json";
const CONTRACT_REL="doc/state-transformation-semantics-canonicalization-validation/preregistration/STAGE_1_CANDIDATE_CONTRACT.json";
const FIREWALL_REL="doc/state-transformation-semantics-canonicalization-validation/preregistration/STAGE_2_FIREWALL.json";
const RULE_REL="doc/state-transformation-semantics-canonicalization-validation/preregistration/STAGE_2_DECISION_RULE.json";
const S1_REL="doc/state-transformation-semantics-canonicalization-validation/results/STAGE_1_DEVELOPMENT_RESULT.json";
function sha(v){return crypto.createHash("sha256").update(v).digest("hex");}function shaf(rel){return sha(fs.readFileSync(P(rel)));}
function ensure(c,m){if(!c)throw new Error(m);}function load(rel){return JSON.parse(fs.readFileSync(P(rel),"utf8"));}
function stable(v){if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return`[${v.map(stable).join(",")}]`;return`{${Object.keys(v).sort().map((k)=>`${JSON.stringify(k)}:${stable(v[k])}`).join(",")}}`;}
function main(){
 const oi=process.argv.indexOf("--output");ensure(oi>=0,"--output required");const output=path.resolve(process.argv[oi+1]);
 const spec=load(SPEC_REL),contract=load(CONTRACT_REL),fw=load(FIREWALL_REL),rule=load(RULE_REL),s1=load(S1_REL);
 ensure(spec.studyId==="STSCV-STUDY1"&&spec.stageId==="STSCV-S2-FORMAL-2026-08-28-v1","Stage 2 identity mismatch");
 ensure(spec.scientificInferenceAuthorized===false&&spec.formalConfirmationAuthorized===false,"Stage 2 must be locked before authorization");
 ensure(spec.population.seedBlock.count===spec.population.seedBlock.end-spec.population.seedBlock.start+1,"seed block count mismatch");
 ensure(spec.population.seedBlock.start>26031384,"Stage 2 seed block overlaps Stage 1 seed block");
 ensure(spec.population.targetRootsPerStratum===32,"formal root target drift");
 ensure(spec.localGraph.depth===3,"formal graph depth drift");
 ensure(spec.population.replacementOutsideFrozenSeedBlock===false&&spec.population.seedExtensionAfterOutcome===false,"replacement/extension authorized unexpectedly");
 ensure(spec.authoritativeRawIdentity.include.join(",")==="pits,reserve,houseOwned,player,phase,winner,pending","RAW identity drift");
 ensure(spec.authoritativeRawIdentity.exclude.join(",")==="turn,reason","RAW exclude drift");
 ensure(contract.scientificCandidates.map((x)=>x.candidateId).join(",")===spec.candidateIds.join(","),"candidate set differs from Stage 1 frozen contract");
 ensure(s1.independentVerification?.passed===true&&Object.values(s1.readinessGates||{}).every((v)=>v===true),"Stage 1 readiness/verification not complete");
 ensure(s1.formalCandidateDecisionsAuthorized===false,"Stage 1 incorrectly carries formal candidate decisions");
 ensure(fw.candidateOutcomeUsedToDefineFirewall===false&&fw.firewallRelaxationAfterOutcomeAuthorized===false,"Stage 2 firewall outcome dependence");
 ensure(fw.sourceStage1.selectionSha256===s1.hashes.selectionSha256&&fw.sourceStage1.measurementSha256===s1.hashes.measurementSha256,"Stage 1 firewall binding mismatch");
 const s1Rows=Object.entries(s1.selectedRoots).flatMap(([stratum,rows])=>rows.map((r)=>({stratum,...r})));
 const fwCounts={trajectorySeeds:new Set(s1Rows.map((r)=>r.seed)).size,openingPrefixSha256:new Set(s1Rows.map((r)=>r.openingPrefixSha256)).size,rawStateKeys:new Set(s1Rows.map((r)=>r.stateKey)).size};
 ensure(s1Rows.length===fw.sourceStage1.selectedRootCount,"firewall Stage1 root count mismatch");
 ensure(fwCounts.trajectorySeeds===fw.sourceStage1.expectedUniqueTrajectorySeeds,"firewall seed count mismatch");
 ensure(fwCounts.openingPrefixSha256===fw.sourceStage1.expectedUniqueOpeningPrefixSha256,"firewall prefix count mismatch");
 ensure(fwCounts.rawStateKeys===fw.sourceStage1.expectedUniqueRawStateKeys,"firewall RAW count mismatch");
 const partsDir=P("tools/experiments/stscv-stage2-formal-parts");
 const joinParts=(prefix)=>fs.readdirSync(partsDir).filter((name)=>name.startsWith(prefix)&&name.endsWith(".jsfrag")).sort().map((name)=>fs.readFileSync(path.join(partsDir,name),"utf8")).join("");
 const runner=joinParts("run-stscv-stage2-formal.part");
 const verifier=joinParts("verify-stscv-stage2-formal.part");
 ensure(runner.length>0&&verifier.length>0,"missing Stage 2 source fragments");
 ensure(!/symmetry-isomorphic-positions\/results/.test(runner+verifier),"Stage 2 imports SIP result evidence");
 ensure(!/oracle-representation-integrity-symmetry-confirmation\/results/.test(runner+verifier),"Stage 2 imports ORISC result evidence");
 ensure(!/require\([^)]*run-stscv-stage2-formal/.test(verifier),"independent verifier imports production runner");
 ensure(!/require\([^)]*stscv-stage0-production/.test(verifier),"independent verifier imports production transform");
 const sourceSha256={};for(const rel of spec.frozenSourcePathsToBindBeforeAuthorization){ensure(fs.existsSync(P(rel)),`missing frozen source ${rel}`);sourceSha256[rel]=shaf(rel);}
 const manifest={schemaVersion:1,studyId:spec.studyId,stageId:spec.stageId,classification:"PRE-FORMAL-SOURCE-AND-FIREWALL-FREEZE",readyForExplicitAuthorization:true,scientificOutcomeGenerated:false,
   specSha256:shaf(SPEC_REL),candidateContractSha256:shaf(CONTRACT_REL),firewallSha256:shaf(FIREWALL_REL),decisionRuleSha256:shaf(RULE_REL),stage1ResultSha256:shaf(S1_REL),
   rawStateIdentitySha256:sha(Buffer.from(stable(spec.authoritativeRawIdentity),"utf8")),transformationDefinitionSha256:shaf(CONTRACT_REL),sourceSha256,combinedSourceSha256:{productionRunner:sha(Buffer.from(runner,"utf8")),independentVerifier:sha(Buffer.from(verifier,"utf8"))},
   frozenPopulation:spec.population,formalGlobalGates:spec.formalGlobalGates,candidateIds:spec.candidateIds,controlIds:spec.controlIds,
   stage1FirewallCounts:fwCounts,canonicalizationRepresentativeRule:spec.canonicalizationEndpoint.representativeRule,canonicalizationAuthorized:false,formalStage2Authorized:false};
 fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,`${JSON.stringify(manifest,null,2)}\n`,"utf8");process.stdout.write(`${JSON.stringify(manifest,null,2)}\n`);
}
if(require.main===module)main();
