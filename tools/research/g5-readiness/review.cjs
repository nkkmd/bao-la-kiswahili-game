"use strict";
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto"), zlib = require("node:zlib");
const os = require("node:os"), assert = require("node:assert/strict");
const C = require("./core.cjs"), M = require("../g5-01/measurement.cjs");
const root = path.resolve(__dirname,"../../.."), docs = path.join(root,"doc/research-generation-5/readiness-review-20261012");
const read = p => JSON.parse(fs.readFileSync(p,"utf8"));
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const locations = ["g5-01/development","g5-02","g5-03","g5-04"];
function review() {
  const manifest = read(path.join(docs,"SOURCE_MANIFEST.json"));
  for (const [p,h] of Object.entries(manifest.files)) assert.equal(sha(fs.readFileSync(path.join(root,p))),h,p);
  const proposal = read(path.join(docs,"DESIGN_OPTIONS.json"));
  assert.equal(proposal.status,"PROPOSAL-NOT-FORMAL-REGISTRATION");
  const studies = [], allRead = new Set(), blocks = [], formalRows = [];
  let completedNodes = 0, nonterminalNodes = 0, multiChoiceNodes = 0, nodeWinLossContrast = 0, nodeDtfContrast = 0;
  for (const location of locations) {
    const d = path.join(root,"doc/research-generation-5",location), results = path.join(d,"results");
    const b = require(path.join(root,"tools/research",location,"run.cjs")).binding();
    const result = read(path.join(results,"RESULT.json")), lease = read(path.join(d,"executions/LEASE.json"));
    const trigger = read(path.join(d,"executions/TRIGGER.json")), receipt = read(path.join(results,"CI_RECEIPT.json"));
    assert.equal(result.binding,b.digest); assert.equal(lease.binding,b.digest); assert.equal(trigger.binding,b.digest);
    assert.deepEqual(lease.seedBlock,b.spec.seedBlock); assert.equal(lease.acquiredBeforeFreshSeedRead,true);
    assert.equal(lease.status,"CONSUMED-BLOCK / NO-RERUN"); assert.equal(lease.runAttempt,1);
    const run = receipt.run ?? { id:receipt.workflowRunId,attempt:receipt.runAttempt,conclusion:receipt.conclusion };
    assert.equal(Number(result.execution.runId),lease.runId); assert.equal(run.id,lease.runId);
    assert.equal(result.scientificSeedsRead,b.spec.seedBlock.count); assert.equal(result.formalInference,false);
    assert.equal(run.conclusion,"success"); assert.equal(run.attempt,1);
    for (const prior of blocks) assert.ok(b.spec.seedBlock.end < prior.start || b.spec.seedBlock.start > prior.end);
    blocks.push(b.spec.seedBlock);
    const compressed = fs.readFileSync(path.join(results,"EVIDENCE.json.gz"));
    assert.equal(sha(compressed),result.evidenceGzipSha256);
    const evidence = JSON.parse(zlib.gunzipSync(compressed));
    for (const id of evidence.developmentReadIdentities ?? evidence.supplyReadIdentities) allRead.add(id);
    const copy = fs.mkdtempSync(path.join(os.tmpdir(),"g5-readiness-"));
    let verification;
    try {
      fs.cpSync(results,copy,{recursive:true});
      verification = require(path.join(root,"tools/research",location,"verify.cjs")).verify(copy);
      assert.deepEqual(fs.readFileSync(path.join(copy,"VERIFICATION.json")),fs.readFileSync(path.join(results,"VERIFICATION.json")));
    } finally { fs.rmSync(copy,{recursive:true,force:true}); }
    const complete = evidence.domains.filter(d => d.complete), nodes = [], rootRows = [];
    for (const domain of complete) {
      completedNodes += domain.states.length;
      for (const node of domain.nodes) {
        if (node.winner !== null) continue;
        const row = { ...C.characterize(node,domain.solution.results), isOriginalRoot: node.id === domain.rootKey };
        nodes.push(row); nonterminalNodes++; multiChoiceNodes += row.width >= 2;
        nodeWinLossContrast += row.winLossContrast === true; nodeDtfContrast += row.dtfContrast === true;
        if (row.isOriginalRoot) {
          rootRows.push(row);
          formalRows.push({ ...row, sourceId: location + ":" + evidence.selectedCandidates[evidence.domains.indexOf(domain)].sourceIndex,
            componentId: location + ":" + evidence.groups.findIndex(g => g.includes(evidence.domains.indexOf(domain))),
            exactVerified:true, freshHoldout:false, rankingChanged:null, positiveValueLoss:null });
        }
      }
    }
    studies.push({ location,studyId:b.spec.studyId,stageId:b.spec.stageId,binding:b.digest,
      seedBlock:b.spec.seedBlock,sourcesReplayed:verification.sourcesReplayed,
      candidateCount:result.candidateCount,completeDomains:complete.length,
      sourceBound:true,consumeOnce:true,independentReplayByteEqual:true,evidenceGzipSha256:result.evidenceGzipSha256,
      roots:rootRows, nonterminalNodes:nodes });
  }
  return { reviewId:"RG5-PRIMARY-READINESS-REVIEW-2026-10-12-v1",
    kind:"READ-ONLY-DEVELOPMENT-READINESS-REVIEW", priorResearchHead:manifest.priorResearchHead,
    inputManifestSha256:sha(fs.readFileSync(path.join(docs,"SOURCE_MANIFEST.json"))),
    proposalSha256:sha(fs.readFileSync(path.join(docs,"DESIGN_OPTIONS.json"))), studies,
    totalSources:studies.reduce((n,s) => n+s.seedBlock.count,0),totalCandidates:studies.reduce((n,s) => n+s.candidateCount,0),
    completeDomains:studies.reduce((n,s) => n+s.completeDomains,0), completedNodes,nonterminalNodes,multiChoiceNodes,
    nodeWinLossContrast,nodeDtfContrast,rootWinLossContrast:formalRows.filter(r => r.winLossContrast===true).length,
    rootDtfContrast:formalRows.filter(r => r.dtfContrast===true).length,
    existingReadIdentityCount:allRead.size, observedRankingComparisons:0,
    primaryReadiness:C.assess(formalRows,proposal,false),freshScientificSeedsGenerated:0,
    candidatesReselected:0,formalRelationExecuted:false,publicAiChanged:false };
}
if (require.main === module) {
  const value = review(), file = path.join(docs,"results/RESULT.json");
  if (process.argv.includes("--check")) {
    assert.deepEqual(value,read(file));
    const binding = read(path.join(docs,"results/RESULT_BINDING.json"));
    assert.equal(sha(fs.readFileSync(file)),binding.files[path.relative(root,file)]);
    console.log("READINESS-REVIEW-REPLAY-PASS");
  }
  else if (process.argv.includes("--write")) { fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,JSON.stringify(value,null,2)+"\n"); console.log(JSON.stringify({decision:value.primaryReadiness.decision,studies:value.studies.length,completeDomains:value.completeDomains,nodeWinLossContrast:value.nodeWinLossContrast})); }
  else console.log(JSON.stringify(value,null,2));
}
module.exports = { review };
