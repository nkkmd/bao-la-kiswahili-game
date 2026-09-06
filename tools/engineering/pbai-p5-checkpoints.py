"""Persist paused measurement checkpoints to one dedicated, non-main Git ref."""
import base64,hashlib,io,json,os,pathlib,tarfile,time,urllib.request,urllib.error
REPO='nkkmd/bao-la-kiswahili-game'
REF='heads/engineering/pbai-p5-evidence'
class GitHub:
 def __init__(self,token=None):self.token=token
 def call(self,method,path,data=None,deadline=None):
  remaining=60 if deadline is None else min(60,deadline[0]-time.time(),deadline[1]-time.monotonic()) if isinstance(deadline,tuple) else min(60,deadline-time.time())
  if remaining<=0:raise TimeoutError('Checkpoint deadline expired')
  headers={'Accept':'application/vnd.github+json','Content-Type':'application/json','X-GitHub-Api-Version':'2022-11-28'}
  if self.token:headers['Authorization']='Bearer '+self.token
  request=urllib.request.Request('https://api.github.com/repos/'+REPO+path,data=None if data is None else json.dumps(data).encode(),headers=headers,method=method)
  with urllib.request.urlopen(request,timeout=remaining) as response:return json.load(response)

def snapshot(out):
 files={};buffer=io.BytesIO()
 with tarfile.open(fileobj=buffer,mode='w:gz',compresslevel=1) as archive:
  for p in sorted(out.rglob('*')):
   if not p.is_file() or p.is_symlink():continue
   raw=p.read_bytes();name=p.relative_to(out).as_posix();files[name]=hashlib.sha256(raw).hexdigest()
   item=tarfile.TarInfo('run/'+name);item.size=len(raw);archive.addfile(item,io.BytesIO(raw))
 data=buffer.getvalue();started=json.loads((out/'RUN_STARTED.json').read_text());final=out/'RUN_FINAL.json'
 progress={s:len(list((out/s).glob('pair-*.json')))*2 for s in ['development','validation','holdout']}
 resume={'program':'PBAI-P5','run':started,'checkpointAt':time.time(),'completedGames':progress,'final':json.loads(final.read_text()) if final.exists() else None,'archiveSha256':hashlib.sha256(data).hexdigest(),'archiveBytes':len(data),'files':files,'restartAllowed':False,'meaning':'Recorded evidence only; incomplete data never establish strength.'}
 return data,resume

class Publisher:
 def __init__(self,head,api=None):self.source=head;self.api=api or GitHub(os.environ['GITHUB_TOKEN']);self.parent=None
 def publish(self,out,deadline):
  if self.parent is None:
   # Atomic create: an existing ref rejects a new runner even on another machine.
   self.api.call('POST','/git/refs',{'ref':'refs/'+REF,'sha':self.source},deadline)
   self.parent=self.source
  archive,resume=snapshot(out);entries=[]
  for name,data in [('evidence.tar.gz',archive),('RESUME.json',json.dumps(resume,indent=2).encode())]:
   blob=self.api.call('POST','/git/blobs',{'content':base64.b64encode(data).decode(),'encoding':'base64'},deadline)
   entries.append({'path':name,'type':'blob','mode':'100644','sha':blob['sha']})
  tree=self.api.call('POST','/git/trees',{'tree':entries},deadline)
  commit=self.api.call('POST','/git/commits',{'message':'PBAI-P5: 測定済み証拠と再開位置を保存','tree':tree['sha'],'parents':[self.parent]},deadline)
  self.api.call('PATCH','/git/refs/'+REF,{'sha':commit['sha'],'force':False},deadline)
  self.parent=commit['sha'];return resume

def status(api=None):
 api=api or GitHub(os.environ.get('GITHUB_TOKEN'))
 try:ref=api.call('GET','/git/ref/'+REF)
 except urllib.error.HTTPError as e:
  if e.code==404:return {'status':'NO-CLAIM-FOUND','scientificRunNotConfirmed':True}
  raise
 head=ref['object']['sha']
 try:file=api.call('GET','/contents/RESUME.json?ref='+head)
 except urllib.error.HTTPError as e:
  if e.code==404:return {'status':'CLAIMED-NO-CHECKPOINT','head':head,'restartAllowed':False}
  raise
 data=json.loads(base64.b64decode(file['content']));data['fileCount']=len(data.pop('files'));data['run']={k:v for k,v in data['run'].items() if k in ['commit','wallStart','wallDeadline','githubRunId','githubRunUrl']};data['evidenceHead']=head
 data['evidenceUrl']='https://github.com/'+REPO+'/tree/'+head
 return data
if __name__=='__main__':print(json.dumps(status(),ensure_ascii=False,indent=2))
