"""Verify archived evidence and unchanged contracts; no scientific generation."""
import pathlib,hashlib,json,tarfile,subprocess,re
root=pathlib.Path(__file__).resolve().parents[2]
doc=root/'doc/ai-engineering/public-ai-improvement-program-4';out=root/'artifacts/pbai-p4'
read=lambda p:json.loads(p.read_text())
sha=lambda b:hashlib.sha256(b).hexdigest()
base=read(doc/'BASELINE.json')
for p,h in base['sources'].items():
 assert sha(subprocess.check_output(['git','show',base['commit']+':'+p],cwd=root))==h
assert sha((out/'baseline-diagnostic.json').read_bytes())==base['diagnosticSha256']
freeze='f260b252c8f5f00a9a1b5124748c7303d75b252d'
for name in ['PROTOCOL.md','BASELINE.json','AUTHORIZATION_REVIEW.md']:
 expected=subprocess.check_output(['git','show',freeze+':doc/ai-engineering/public-ai-improvement-program-4/'+name],cwd=root)
 assert (doc/name).read_bytes()==expected, name+' frozen content changed'
correct=read(out/'correctness.json');assert correct['passed'] and correct['mismatches']==0
for name,h in correct['sourceHashes'].items():assert sha((root/'public'/(name+'.js')).read_bytes())==h
bundle=read(out/'EXECUTION_BUNDLE.json')
assert sha((root/bundle['path']).read_bytes())==bundle['sha256']
subprocess.run(['git','bundle','verify',bundle['path']],cwd=root,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
stop=read(out/'RESOURCE_STOP.json')
assert stop['processStopped'] and not stop['retryAuthorized'] and not stop['finalEvidenceEligible']
archives=[];all_roots=[]
for stage in ['development','validation','holdout']:
 summary=out/(stage+'-summary.json')
 if not summary.exists():continue
 s=read(summary);arc=root/s['archive']['path'];assert sha(arc.read_bytes())==s['archive']['sha256']
 with tarfile.open(arc,'r:gz') as t:
  for member in t.getmembers():
   path=pathlib.PurePosixPath(member.name)
   assert path.parts[0]==stage and '..' not in path.parts and not path.is_absolute()
   assert member.isdir() or member.isfile()
   target=out/member.name
   if member.isdir():target.mkdir(parents=True,exist_ok=True);continue
   data=t.extractfile(member).read()
   if target.exists():assert target.read_bytes()==data, str(target)+' differs from archive'
   else:target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
 for n in ['manifest.json','gate.json','independent-replay.json','independent-metrics.json']:assert read(out/stage/n)==s[n]
 assert s['independent-replay.json']['passed'] and s['independent-metrics.json']['verified']
 assert s['manifest.json']['sourceHashes']==correct['sourceHashes']
 assert s['manifest.json']['protocolSha']==sha((doc/'PROTOCOL.md').read_bytes())
 for kind in ['roots','games']:
  p=out/stage/(kind+'-source.json')
  if p.exists():all_roots.extend(read(p)['rows'])
 archives.append(stage)
for key in ['raw','prefix','trajectory']:assert len({r[key] for r in all_roots})==len(all_roots),key+' duplication'
# Only the candidate engine and AI may differ among the baseline public assets.
for p,h in base['sources'].items():
 if p not in ['public/engine.js','public/ai.js']:assert sha((root/p).read_bytes())==h,p+' unexpectedly changed'
if (doc/'FINAL_RESULT.json').exists():
 final=read(doc/'FINAL_RESULT.json');assert final['publicDefaultChanged'] is False and final['mainIntegrated'] is False
 assert final['lineage']=='AI-GEN2' and final['promoted'] is False
 assert final['decision']==read(out/'holdout/independent-metrics.json')['decision']
# New Program docs must have resolvable local links and Japanese explanatory headings.
md=list(doc.glob('*.md'));bad=[];english=[]
for p in md:
 text=p.read_text();body=re.sub(r'```.*?```','',text,flags=re.S)
 for line in body.splitlines():
  if line.startswith('#') and not re.search(r'[ぁ-んァ-ヶ一-龯]',line):english.append((str(p),line))
 for target in re.findall(r'\]\(([^)]+)\)',body):
  target=target.split('#')[0]
  if not target or re.match(r'\w+://',target):continue
  if not (p.parent/target).exists():bad.append((str(p),target))
assert not bad,bad
assert not english,english
print(json.dumps({'passed':True,'archives':archives,'selectedRootCount':len(all_roots),'programMarkdownFiles':len(md),'brokenRelativeLinks':len(bad),'englishOnlyHeadings':len(english),'frozenContractChanged':False,'publicDefaultChanged':False}))
