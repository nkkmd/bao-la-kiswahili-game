"""測定を再実行せず、保存アーカイブと凍結ソースの完全性を確認する。"""
import hashlib,json,pathlib,tarfile
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'artifacts/pbai-p9'
def digest(b):return hashlib.sha256(b).hexdigest()
def main():
 index=json.loads((OUT/'final-evidence-index.json').read_text())
 archive=OUT/'final-evidence.tar.gz'
 assert digest(archive.read_bytes())==index['archiveSha256']
 with tarfile.open(archive,'r:gz') as tar:
  members=tar.getmembers();assert all(m.isfile() for m in members)
  assert len(members)==len(index['files'])
  names=[m.name for m in members];assert len(set(names))==len(names)==len(index['files'])
  assert set(names)==set(index['files'])
  saved={}
  for m in members:
   assert pathlib.PurePosixPath(m.name).name==m.name
   b=tar.extractfile(m).read();assert digest(b)==index['files'][m.name]['sha256'];assert len(b)==index['files'][m.name]['bytes'];saved[m.name]=b
 for name in ['RUN_STARTED.json','FINAL_RESULT.json','replay-verification.json','independent-audit.json','pilot-matches.json','holdout-matches.json','low-matches.json']:
  if name in saved:assert (OUT/name).read_bytes()==saved[name]
 lockpath=ROOT/'doc/ai-engineering/public-ai-improvement-program-9/SOURCE_LOCK.json'
 start=json.loads(saved['RUN_STARTED.json']);assert digest(lockpath.read_bytes())==start['sourceLockSha256']
 lock=json.loads(lockpath.read_text())
 for path,value in lock['files'].items():assert digest((ROOT/path).read_bytes())==value,path
 final=json.loads(saved['FINAL_RESULT.json']);assert final['program']=='PBAI-P9';assert final['release']=='NO-RELEASE / KEEP-AI-GEN3'
 print(json.dumps({'passed':True,'files':len(saved),'sourceFiles':len(lock['files']),'executionCommit':start['executionCommit'],'decision':final['decision'],'timedMatchesRerun':False}))
if __name__=='__main__':main()
