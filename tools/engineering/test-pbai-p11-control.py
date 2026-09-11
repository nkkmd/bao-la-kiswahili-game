"""正式seedを使わず、再実行拒否・保存点破損・時間停止を検証する。"""
import importlib.util,pathlib,tempfile,unittest,os,time,sys,json
from unittest.mock import patch
loader=importlib.util.spec_from_file_location('control',pathlib.Path(__file__).with_name('control-pbai-p11.py'))
C=importlib.util.module_from_spec(loader);loader.loader.exec_module(C)
class ControlTest(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.out=pathlib.Path(self.temp.name)
  self.patches=[patch.object(C,'OUT',self.out),patch.object(C,'commit',return_value='known-commit'),patch.dict(os.environ,{'GITHUB_RUN_ID':'123','GITHUB_RUN_ATTEMPT':'1'})]
  for p in self.patches:p.start()
 def tearDown(self):
  for p in reversed(self.patches):p.stop()
  self.temp.cleanup()
 def test_authorization(self):
  a={'program':'PBAI-P11','runId':'123','sourceCommit':'known-commit','sourceLockSha256':'known-lock'}
  C.validate_auth(a,'123','1','known-commit','known-lock')
  for args in [('124','1','known-commit','known-lock'),('123','2','known-commit','known-lock'),('123','1','changed','known-lock'),('123','1','known-commit','changed')]:
   with self.assertRaises(RuntimeError):C.validate_auth(a,*args)
 def test_checkpoint_chain(self):
  C.write(self.out/'known.json',{'knownOnly':True});C.seal(-1);previous=C.digest(self.out/'CHECKPOINT.json');C.verify_checkpoint(self.out,-1)
  C.write(self.out/'done.json',{'passed':True});C.seal(0);self.assertEqual(C.verify_checkpoint(self.out,0)['priorCheckpointSha256'],previous)
  with self.assertRaises(RuntimeError):C.verify_checkpoint(self.out,-1)
 def test_damage(self):
  C.write(self.out/'known.json',{'knownOnly':True});C.seal(-1);(self.out/'known.json').write_text('{}')
  with self.assertRaises(RuntimeError):C.verify_checkpoint(self.out,-1)
 def test_extra_file(self):
  C.seal(-1);C.write(self.out/'unexpected.json',{})
  with self.assertRaises(RuntimeError):C.verify_checkpoint(self.out,-1)
 def test_wrong_run(self):
  C.seal(-1)
  with patch.dict(os.environ,{'GITHUB_RUN_ID':'456'}),self.assertRaises(RuntimeError):C.verify_checkpoint(self.out,-1)
 def test_once_only(self):
  C.write(self.out/'marker.json',{})
  with self.assertRaises(FileExistsError):C.write(self.out/'marker.json',{})
 def test_deadline(self):
  before=time.monotonic()
  with self.assertRaises(TimeoutError):C.run_child([sys.executable,'-c','import time;time.sleep(30)'],time.time()+.3)
  self.assertLess(time.monotonic()-before,5)
 def test_missing_checkpoint_closes_hold(self):
  with patch.object(C,'ROOT',self.out),self.assertRaises(SystemExit):C.finalize()
  result=C.read(self.out/'artifacts/pbai-p11/final/FINAL_RESULT.json')
  self.assertEqual(result['decision'],'TECHNICAL-INVALID / HOLD');self.assertFalse(result['verificationPassed']);self.assertFalse(result['publicChanged'])
if __name__=='__main__':unittest.main()
