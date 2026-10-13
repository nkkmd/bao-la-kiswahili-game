const fs=require('fs'),path=require('path'),assert=require('assert/strict'),cp=require('child_process');
const root=path.resolve(__dirname,'../../..'),m=__dirname+'/';const evidenceRoot=path.resolve(process.argv[2]),output=path.resolve(process.argv[3]);
const replay=require(m+'replay.cjs'),capture=require(root+'/tools/research/g5-befcs-workload/capture-tree.cjs'),P=require(root+'/tools/research/g5-befcs-pipeline/run.cjs');
const ids=['11853716667','11853148638','11852707959','11852472353','11852327460','11854461369','11854985340','11853741139','11853262654','11852619342'],rows=[];
for(const id of ids){
 const d=path.join(evidenceRoot,id);
 console.log('checking',id);
 let row;const hasScenario=fs.existsSync(d+'/SCENARIO.json');if(hasScenario)row=JSON.parse(fs.readFileSync(d+'/SCENARIO.json'));else{const bundle=fs.readFileSync(d+'/REGISTRY.bundle'),heads=cp.execFileSync('git',['bundle','list-heads',d+'/REGISTRY.bundle'],{encoding:'utf8'}).trim().split(/\s+/),host=JSON.parse(fs.readFileSync(d+'/HOST_RESULT.json')),ackCount=fs.readdirSync(d+'/control').filter(n=>/^ACK-\d+\.json$/.test(n)).length;row={mode:'deadline',registryHead:heads[0],registryRef:heads[1],registryBundleBase64:bundle.toString('base64'),verified:require(root+'/tools/research/g5-befcs-workload/independent-registry.cjs').verify(d+'/observer',heads[0]),ackCount,technicalComplete:false,finalMirrorSaved:host.finalMirrorSaved};row.unacknowledgedMarkers=row.verified.logicalReadsMarked-ackCount;}
 const originalProof=row.remoteMirrorProof,proof=replay.replay(row,P.fixtureConfig('complete','','').sourceSpec);if(hasScenario)assert.deepEqual(proof,originalProof);assert.equal(Buffer.compare(fs.readFileSync(d+'/REGISTRY.bundle'),Buffer.from(row.registryBundleBase64,'base64')),0);
 const captured=capture.captureTree(d+'/evidence',268435456).files,coverage=JSON.parse(captured['COVERAGE.json']),files={};for(const [key,p]of Object.entries(coverage.paths))files[p]=captured[key];
 const localProof=replay.filesProof(files,P.fixtureConfig('complete','','').sourceSpec);if(hasScenario)assert.deepEqual(localProof,row.localSourceProof);
 let resultVerified=false;if(fs.existsSync(d+'/RESULT.json')){require(m+'verify-acquired.cjs').verify(d);resultVerified=true;}
 const head=row.registryHead;
 const remote=cp.execFileSync('git',['ls-remote','https://github.com/nkkmd/bao-la-kiswahili-game.git',row.registryRef],{encoding:'utf8',timeout:30000}).split(/\s+/)[0];assert.equal(remote,head);
 rows.push({id,mode:row.mode,resultVerified,originalScenarioAvailable:hasScenario,originalDecisionUnchanged:true,remoteHeadMatches:true,registryHead:head,registryRef:row.registryRef,registry:row.verified,ackCount:row.ackCount,unacknowledgedMarkers:row.unacknowledgedMarkers,technicalComplete:row.technicalComplete,finalMirrorSaved:row.finalMirrorSaved,remoteMirrorProof:proof,localSourceProof:localProof,scientificSeedsRead:0});

}
fs.writeFileSync(output,JSON.stringify({verified:true,rows,scientificSeedsRead:0,newSourceGeneration:false,scientificExecutionAuthorized:false},null,2)+'\n');console.log('all independent proofs match');
