"""Synthetic tests only: no Bao states, seeds, network requests or remote claims."""
import importlib.util,pathlib,tempfile,subprocess,sys,json,hashlib,io,tarfile,base64
ROOT=pathlib.Path(__file__).resolve().parents[2]
def load(name,file):
 spec=importlib.util.spec_from_file_location(name,ROOT/'tools/engineering'/file);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
S=load('supervisor','supervise-pbai-p5.py');K=load('checkpoints','pbai-p5-checkpoints.py')
class API:
 def __init__(self):self.exists=False;self.calls=[];self.blobs={}
 def call(self,method,path,data=None,deadline=None):
  self.calls.append((method,path,data))
  if path=='/git/refs':
   assert not self.exists,'Duplicate remote claim';self.exists=True;return {}
  if path=='/git/blobs':
   b=base64.b64decode(data['content']);sha=hashlib.sha256(b).hexdigest();self.blobs[sha]=b;return {'sha':sha}
  if method=='PATCH':assert data['force'] is False and path=='/git/refs/'+K.REF;return {}
  return {'sha':hashlib.sha256(json.dumps(data).encode()).hexdigest()}
with tempfile.TemporaryDirectory() as temp:
 root=pathlib.Path(temp);out=root/'artifacts/pbai-p5/run';api=API();publisher=K.Publisher('1'*40,api)
 code="""const fs=require('fs'),path=require('path'),vm=require('vm');
 const root=process.argv[1],file=process.argv[2],mod={exports:{}};
 const C={ROOT:root,write:(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v),{flag:'wx'});}};
 vm.runInNewContext(fs.readFileSync(file,'utf8'),{require:n=>n==='./pbai-p4-common.js'?C:require(n),module:mod,process,Atomics,SharedArrayBuffer,Int32Array});
 mod.exports.write(path.join(mod.exports.OUT,'development/pair-15.json'),{synthetic:true});
 fs.writeFileSync(path.join(mod.exports.OUT,'child-resumed'), 'yes');"""
 result=S.supervise([['node','-e',code,str(root),str(ROOT/'tools/engineering/lib/pbai-p5-common.js')]],out,10,publisher=publisher)
 assert result['status']=='COMPLETE',result
 assert (out/'child-resumed').exists() and not (out/'CHECKPOINT_REQUEST.json').exists()
 assert sum(method=='PATCH' for method,path,data in api.calls)>=4
 for b in api.blobs.values():
  if b.startswith(b'\x1f\x8b'):
   with tarfile.open(fileobj=io.BytesIO(b)) as t:
    assert all(x.name.startswith('run/') and '..' not in x.name for x in t.getmembers())
 archive,resume=K.snapshot(out)
 assert hashlib.sha256(archive).hexdigest()==resume['archiveSha256']
 with tarfile.open(fileobj=io.BytesIO(archive)) as t:
  for name,sha in resume['files'].items():assert hashlib.sha256(t.extractfile('run/'+name).read()).hexdigest()==sha
 try:K.Publisher('2'*40,api).publish(out,None)
 except AssertionError as e:assert 'Duplicate remote claim' in str(e)
 else:raise AssertionError('New machine could rerun the same Program')
 class Failing:
  parent='claimed'
  def publish(self,out,deadline):raise OSError('Synthetic storage failure')
 failure=S.supervise([['node','-e',"require('fs').writeFileSync(process.argv[1],'BAD')",str(root/'must-not-exist')]],root/'failure',2,publisher=Failing())
 assert failure['status']=='HOLD' and not (root/'must-not-exist').exists()
print(json.dumps({'passed':True,'actualNodeHandshake':True,'completedRecordsSavedBeforeResume':True,'archiveHashesVerified':True,'remoteDuplicateClaimRejected':True,'storageFailureStopsBeforeMeasurement':True,'scientificSeedsOpened':0,'remoteWrites':0}))
