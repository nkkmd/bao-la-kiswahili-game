import hashlib,json,re,sys,zipfile
from pathlib import Path
archive=Path(sys.argv[1]);dest=Path(sys.argv[2]);expected=sys.argv[3]
assert hashlib.sha256(archive.read_bytes()).hexdigest()==expected
dest.mkdir(parents=True,exist_ok=False)
files={}
with zipfile.ZipFile(archive) as z:
 for i in z.infolist():
  p=Path(i.filename)
  assert not p.is_absolute() and '..' not in p.parts
  assert ((i.external_attr>>16)&0o170000)!=0o120000
  if i.is_dir():continue
  b=z.read(i);target=dest/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(b)
  files[i.filename]={'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()}
r=json.loads((dest/'RESULT.json').read_bytes());assert r['scientificSeedsRead']==0
assert [x['mode'] for x in r['rows']]==['complete','worker-oom','observer-oom','deadline']
summary=[]
for row in r['rows']:
 m=row['mode'];directory=dest/m
 assert row==json.loads((directory/'RESULT.json').read_bytes())
 assert row['boundary']==json.loads((directory/'BOUNDARY.json').read_bytes())
 assert row['resources']==json.loads((directory/'RESOURCE.json').read_bytes())
 assert row['watch']==json.loads((directory/'WATCH.json').read_bytes())
 assert re.fullmatch(r'bao-g5-supervisor-[0-9a-f]{16}\.service',row['unit'])
 assert row['boundary']['parentResidentEmpty'] is True
 assert row['boundary']['root'].endswith('/'+row['unit'])
 for n,limit in [('parent',1073741824),('work',805306368),('control',201326592),('watch',67108864)]:
  assert row['resources'][n]['max']==str(limit) and row['resources'][n]['swapMax']=='0'
 assert row['resources']['parent']['peak']<=1073741824
 for k in ['scientificLeaseCreated','scientificStudyRegistered','common128SourceIntegrated','dockerDaemonIntegrated','scientificHostReleased']:assert row[k] is False
 assert row['scientificSeedsRead']==0
 ready=json.loads((directory/'WATCH_READY.json').read_bytes());pids=json.loads((directory/'PIDS.json').read_bytes())
 assert ready['pid']==pids['watch'] and ready['cgroup']==row['boundary']['root']+'/watch'
 events=lambda n:int(re.search(r'^oom_kill (\d+)$',row['resources'][n]['events'],re.M)[1])
 if m=='complete':
  done=json.loads((directory/'WORK_DONE.json').read_bytes());assert done['bytes']==201326592 and done['checksum']==1176
  assert row['systemdExit']['status']==0 and not row['watch']['records']
 elif m=='worker-oom':
  assert events('work')>0;assert json.loads((directory/'EXIT.json').read_bytes())['workerExit']['signal']=='SIGKILL'
  assert json.loads((directory/'OBSERVER_DONE.json').read_bytes())['workerUnknown'] is True
 elif m=='observer-oom':
  assert events('control')>0;assert json.loads((directory/'EXIT.json').read_bytes())['observerExit']['signal']=='SIGKILL'
  assert any(x['target']=='work' and x['reason']=='OBSERVER-OOM-NO-RESUME' for x in row['watch']['records'])
 else:
  assert row['systemdExit']['status']!=0 and not (directory/'EXIT.json').exists()
  assert not (directory/'WORK_DONE.json').exists() and not (directory/'OBSERVER_DONE.json').exists()
  assert any(x['target']=='work' and x['reason']=='ORDINARY-DEADLINE' for x in row['watch']['records'])
  assert any(x['target']=='control' and x['reason']=='TOTAL-DEADLINE' for x in row['watch']['records'])
 summary.append({'mode':m,'parentPeakBytes':row['resources']['parent']['peak'],'workOomKills':events('work'),'controlOomKills':events('control'),'watchRecords':row['watch']['records'],'resourceSampleIsFinal':m!='deadline'})
output={'archiveSha256':expected,'fileCount':len(files),'files':files,'cases':summary,'scientificSeedsRead':0,'integrationPending':True}
Path(sys.argv[4] if len(sys.argv)>4 else str(archive)+'.verification.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'fileCount':len(files),'cases':summary},ensure_ascii=False))
