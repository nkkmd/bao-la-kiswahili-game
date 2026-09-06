"""Check immutable completed evidence, never rerun scientific measurements."""
import pathlib,json,hashlib,tarfile,subprocess,re
R=pathlib.Path(__file__).resolve().parents[2];D=R/'doc/ai-engineering/public-ai-improvement-program-5';O=R/'artifacts/pbai-p5'
read=lambda p:json.loads(p.read_text());sha=lambda b:hashlib.sha256(b).hexdigest()
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
for p,h in read(D/'PREPARATION_LOCK.json')['files'].items():assert sha((R/p).read_bytes())==h,p
for p,h in read(D/'SOURCE_LOCK.json')['sourceHashes'].items():assert sha((R/p).read_bytes())==h,p
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
