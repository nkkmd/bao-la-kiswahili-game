"""Check immutable completed evidence, never rerun scientific measurements."""
import pathlib,json,hashlib,tarfile,subprocess,re
R=pathlib.Path(__file__).resolve().parents[2];D=R/'doc/ai-engineering/public-ai-improvement-program-5';O=R/'artifacts/pbai-p5'
read=lambda p:json.loads(p.read_text());sha=lambda b:hashlib.sha256(b).hexdigest()
historical_dependencies={
 'public/engine.js':'2c5d245d731bbfd682eec7a0bbd8324c680ad6fbabd567286752d61b985d1bd3',
 'public/ai.js':'aa894e0f34f5545488073a0706743b6ba373a1349152da8f8fc6c18ea74d1498',
 'tools/engineering/lib/pbai-p4-common.js':'2e78220b7f4cd8e2b93ec53f456a07efc131c93f9a542e06721acdb1a156b44d',
 'tools/engineering/lib/pbai-p4-event-verifier.js':'e35272063b5e50675982ea71a3b92a045ff029b0b8d9760678f74016f4159839',
 'test/tactical.test.js':'14af832389a31f441c8ba0dc6f70cceb57fcd65d9c11ed27af5e93de7ef980bf',
 'test/pbai-p4-transitions.test.js':'fc57e768dde3116398e4c7591cf76bb1ae29f7771ca8393482a813c749238062',
}
for ref in ('2d77792220af80ca2700bd0b3c0ab8e45197c24e','b7ec229a7b34eb9266d4bc19506f3e0cd550004b'):
 for p,h in historical_dependencies.items():
  data=subprocess.check_output(['git','show',f'{ref}:{p}'],cwd=R)
  assert sha(data)==h,(ref,p)
for p,h in historical_dependencies.items():assert sha((R/p).read_bytes())==h,p
index=read(O/'final-evidence-index.json');archive=O/'final-evidence.tar.gz'
assert sha(archive.read_bytes())==index['archiveSha256']
with tarfile.open(archive) as t:
 assert {m.name[4:] for m in t.getmembers()}==set(index['files'])
 for m in t.getmembers():
  p=pathlib.PurePosixPath(m.name);assert m.isfile() and p.parts[0]=='run' and '..' not in p.parts
  data=t.extractfile(m).read();assert sha(data)==index['files'][m.name[4:]]
  target=O/m.name;target.parent.mkdir(parents=True,exist_ok=True)
  if target.exists():assert target.read_bytes()==data
  else:target.write_bytes(data)
run=O/'run';start=read(run/'RUN_STARTED.json');end=read(run/'RUN_FINAL.json')
assert start==index['run'] and end==index['final']
assert start['commit']=='b7ec229a7b34eb9266d4bc19506f3e0cd550004b'
assert end['status']=='COMPLETE' and end['reason'] is None
assert end['finished']<=start['wallDeadline'] and end['elapsedMonotonicSeconds']<=14400
assert not end['retryAuthorized'] and end['decision']=='STRENGTH-IMPROVED-IN-FROZEN-DOMAIN'
assert sha((D/'PREPARATION_LOCK.json').read_bytes())==start['preparationLockSha256']
for p,h in read(D/'PREPARATION_LOCK.json')['files'].items():
 data=subprocess.check_output(['git','show',f'b7ec229a7b34eb9266d4bc19506f3e0cd550004b:{p}'],cwd=R)
 assert sha(data)==h,p
for p,h in read(D/'SOURCE_LOCK.json')['sourceHashes'].items():
 data=subprocess.check_output(['git','show',f'b7ec229a7b34eb9266d4bc19506f3e0cd550004b:{p}'],cwd=R)
 assert sha(data)==h,p
for i in range(10):
 a=read(run/f'command-{i}.started.json');b=read(run/f'command-{i}.complete.json')
 assert a['command']==start['commands'][i] and a['time']<=b['time']<=start['wallDeadline'] and b['exitCode']==0
for p in run.rglob('*.json.started'):assert pathlib.Path(str(p)[:-8]).exists(),p
correct=read(run/'correctness.json');assert correct['passed'] and correct['mismatches']==0
for s,count in [('development',16),('validation',32),('holdout',512)]:
 d=run/s;m=read(d/'independent-metrics.json');g=read(d/'gate.json');v=read(d/'independent-replay.json')
 assert g['passed'] and g['tacticalPassed'] and m['verified'] and m['speed']['passed'] and m['operational']['passed']
 assert v['passed'] and v['games']==count and m['games']['games']==count
 assert read(d/'manifest.json')['sourceHashes']==correct['sourceHashes']
 assert read(d/'manifest.json')['protocolSha']==sha((D/'PROTOCOL.md').read_bytes())
 assert read(d/'tactical.json')['passed']
final=read(O/'final-result.json');assert final['decision']==end['decision'] and final['publicDefaultChanged'] is False and final['mainIntegrated'] is False and final['lineage']=='AI-GEN2'
assert final['holdout']==read(run/'holdout/independent-metrics.json')['games']
for p in D.glob('*.md'):
 body=re.sub(r'```.*?```','',p.read_text(),flags=re.S)
 for line in body.splitlines():
  if line.startswith('#'):assert re.search('[ぁ-んァ-ヶ一-龯]',line),line
 for target in re.findall(r'\]\(([^)]+)\)',body):
  if not target.startswith('http'):assert (p.parent/target.split('#')[0]).exists(),(p,target)
print(json.dumps({'passed':True,'archiveFiles':len(index['files']),'allScientificCommandsWithinDeadline':True,'formalMeasurementRepeated':False,'sourceAndContractUnchanged':True,'programMarkdownFiles':len(list(D.glob('*.md'))),'brokenLinks':0,'englishOnlyHeadings':0,'decision':end['decision']}))
