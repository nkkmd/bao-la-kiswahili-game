"""GitHubの独立ジョブ間でPBAI-P11を継続する。消費済みバッチは再実行しない。"""
import os,sys,json,time,hashlib,pathlib,subprocess,signal,tarfile,shutil,platform
ROOT=pathlib.Path(__file__).resolve().parents[2]
DOC=ROOT/'doc/ai-engineering/public-ai-improvement-program-11'
OUT=ROOT/'artifacts/pbai-p11/run'
def read(p):return json.loads(p.read_text())
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,v):
 p.parent.mkdir(parents=True,exist_ok=True)
 with p.open('x') as f:json.dump(v,f,indent=2,allow_nan=False);f.write('\n')
def commit():return subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
def verify_lock():
 lock=read(DOC/'SOURCE_LOCK.json')
 for p,h in lock['files'].items():
  if digest(ROOT/p)!=h:raise RuntimeError('Frozen source mismatch: '+p)
 return digest(DOC/'SOURCE_LOCK.json')
def validate_auth(auth,run_id,attempt,head,lock_sha):
 if auth.get('program')!='PBAI-P11' or str(attempt)!='1' or str(auth['runId'])!=str(run_id) or auth['sourceCommit']!=head or auth['sourceLockSha256']!=lock_sha:raise RuntimeError('Execution authorization mismatch')
def auth():
 a=read(OUT/'AUTHORIZATION.json');validate_auth(a,os.environ['GITHUB_RUN_ID'],os.environ['GITHUB_RUN_ATTEMPT'],commit(),verify_lock());return a

def inventory(folder):return {p.name:{'sha256':digest(p),'bytes':p.stat().st_size} for p in sorted(folder.iterdir()) if p.is_file() and p.name!='CHECKPOINT.json'}
def seal(index):
 p=OUT/'CHECKPOINT.json';prior=digest(p) if p.exists() else None
 value={'program':'PBAI-P11','index':index,'runId':os.environ.get('GITHUB_RUN_ID'),'sourceCommit':commit(),'priorCheckpointSha256':prior,'files':inventory(OUT)}
 tmp=OUT/'CHECKPOINT.tmp';write(tmp,value);os.replace(tmp,p)
def verify_checkpoint(folder,expected_index=None):
 c=read(folder/'CHECKPOINT.json')
 if c['program']!='PBAI-P11' or c['sourceCommit']!=commit() or str(c['runId'])!=os.environ.get('GITHUB_RUN_ID'):raise RuntimeError('Checkpoint provenance mismatch')
 if expected_index is not None and c['index']!=expected_index:raise RuntimeError('Wrong predecessor')
 if inventory(folder)!=c['files']:raise RuntimeError('Checkpoint damaged or unexpected files')
 return c

def run_child(args,deadline):
 env=os.environ.copy();env.update(PBAI_P11_SUPERVISED='1',OPENBLAS_NUM_THREADS='1',OMP_NUM_THREADS='1',MKL_NUM_THREADS='1')
 if time.time()>=deadline:raise TimeoutError('Global/batch deadline before child')
 child=subprocess.Popen(args,cwd=ROOT,env=env,start_new_session=True)
 try:
  while child.poll() is None:
   if time.time()>=deadline:raise TimeoutError('Global/batch deadline')
   time.sleep(.1)
  if child.returncode:raise RuntimeError('Child failed: '+str(child.returncode))
 finally:
  if child.poll() is None:
   os.killpg(child.pid,signal.SIGTERM)
   try:child.wait(timeout=2)
   except subprocess.TimeoutExpired:os.killpg(child.pid,signal.SIGKILL);child.wait()

def init():
 a=auth();spec=read(DOC/'SPEC.json')
 if set(p.name for p in OUT.iterdir())!={'AUTHORIZATION.json'}:raise RuntimeError('Init output already used')
 now=time.time();write(OUT/'RUN_STARTED.json',{'program':'PBAI-P11','runId':a['runId'],'executionCommit':commit(),'sourceLockSha256':verify_lock(),'authorizationSha256':digest(OUT/'AUTHORIZATION.json'),'startedUnix':now,'deadlineUnix':now+spec['resources']['wallClockSeconds'],'node':subprocess.check_output(['node','--version'],text=True).strip(),'python':platform.python_version(),'logicalCpus':os.cpu_count(),'consumedOnce':True})
 seal(-1)

def verify_start(start):
 if start['executionCommit']!=commit() or str(start['runId'])!=os.environ['GITHUB_RUN_ID'] or start['sourceLockSha256']!=verify_lock() or start['authorizationSha256']!=digest(OUT/'AUTHORIZATION.json'):raise RuntimeError('Start provenance mismatch')
 if start['node']!=subprocess.check_output(['node','--version'],text=True).strip() or start['python']!=platform.python_version():raise RuntimeError('Runtime version changed')

def batch(index):
 auth();verify_checkpoint(OUT,index-1);start=read(OUT/'RUN_STARTED.json');verify_start(start);spec=read(DOC/'SPEC.json')
 if not 0<=index<len(spec['batches']):raise RuntimeError('Batch index')
 if (OUT/'STOPPED.json').exists():raise RuntimeError('Run already stopped')
 for i in range(index):
  if not read(OUT/f'batch-{i:03d}-done.json')['passed']:raise RuntimeError('Prior batch incomplete')
 marker=OUT/f'batch-{index:03d}-started.json';write(marker,{'index':index,'startedUnix':time.time(),'runId':os.environ['GITHUB_RUN_ID'],'batch':spec['batches'][index]})
 try:
  deadline=min(start['deadlineUnix'],time.time()+spec['resources']['batchWallClockSeconds'])
  run_child(['node','--max-old-space-size=2048','tools/engineering/run-pbai-p11-batch.js',str(index)],deadline)
  if index==0 and not read(OUT/'pilot-matches.json')['operation']:raise RuntimeError('Pilot operation gate failed')
  verify_lock()
  if time.time()>=start['deadlineUnix']:raise TimeoutError('Global deadline after batch')
  write(OUT/f'batch-{index:03d}-done.json',{'passed':True,'index':index,'finishedUnix':time.time()})
 except BaseException as e:
  write(OUT/'STOPPED.json',{'decision':'TECHNICAL-INVALID / HOLD','index':index,'reason':repr(e),'finishedUnix':time.time()});raise
 finally:seal(index)

def finalize():
 target=ROOT/'artifacts/pbai-p11/final';target.mkdir(parents=True,exist_ok=True)
 incoming=ROOT/'artifacts/local/pbai-p11-checkpoints';state=None;error=None;decision='TECHNICAL-INVALID / HOLD';verified=False
 try:
  folders=[p.parent for p in incoming.rglob('CHECKPOINT.json')];checkpoints=sorted([(verify_checkpoint(p)['index'],p) for p in folders],key=lambda x:x[0])
  if not checkpoints:raise RuntimeError('No durable checkpoint')
  last_index,last=checkpoints[-1];shutil.copytree(last,OUT,dirs_exist_ok=True);auth();state=read(OUT/'RUN_STARTED.json');verify_start(state);spec=read(DOC/'SPEC.json')
  if [i for i,_ in checkpoints]!=list(range(-1,len(spec['batches']))):raise RuntimeError('Incomplete checkpoint chain')
  for (idx,folder),(_,previous) in zip(checkpoints[1:],checkpoints[:-1]):
   if read(folder/'CHECKPOINT.json')['priorCheckpointSha256']!=digest(previous/'CHECKPOINT.json'):raise RuntimeError('Broken checkpoint chain')
  if (OUT/'STOPPED.json').exists():raise RuntimeError('Stopped batch')
  for i in range(len(spec['batches'])):
   if not read(OUT/f'batch-{i:03d}-done.json')['passed']:raise RuntimeError('Missing completion')
  outcomes=json.loads(os.environ.get('PBAI_JOB_RESULTS','{}'))
  if outcomes and any(v.get('result')!='success' for v in outcomes.values()):raise RuntimeError('A prerequisite job failed')
  run_child(['node','--max-old-space-size=2048','tools/engineering/verify-pbai-p11.js'],state['deadlineUnix'])
  run_child(['python','tools/engineering/audit-pbai-p11.py'],state['deadlineUnix'])
  verify_lock();audit=read(OUT/'independent-audit.json');decision=audit['final']['decision'];verified=True
  if time.time()>=state['deadlineUnix']:raise TimeoutError('Global deadline after verification')
 except BaseException as e:error=repr(e);decision='TECHNICAL-INVALID / HOLD';verified=False
 final={'program':'PBAI-P11','runId':os.environ.get('GITHUB_RUN_ID'),'sourceCommit':commit(),'decision':decision,'error':error,'verificationPassed':verified,'finishedUnix':time.time(),'newGenerationIssued':False,'expertAdopted':False,'physicalDeviceVerified':False,'publicChanged':False}
 write(target/'FINAL_RESULT.json',final)
 if OUT.exists():
  files=inventory(OUT);archive=target/'final-evidence.tar.gz'
  with tarfile.open(archive,'x:gz') as t:
   for p in sorted(OUT.iterdir()):
    if p.is_file():t.add(p,arcname=p.name)
  write(target/'EVIDENCE_INDEX.json',{'archiveSha256':digest(archive),'files':{p.name:{'sha256':digest(p),'bytes':p.stat().st_size} for p in OUT.iterdir() if p.is_file()}})
 text='# PBAI-P11：自動実行の終了報告\n\n判断：`'+decision+'`。\n\n'
 if verified:
  text+='全対局の再生と独立集計を完了した。実機確認と正式採用は別であり、公開AIを変更していない。\n\n| 設定 | 勝ち | 負け | 引分 | 勝点率 | 95%区間 | 判定 |\n| --- | ---: | ---: | ---: | ---: | --- | --- |\n'
  for k,v in audit['final']['tiers'].items():text+=f"| {k} | {v['wins']} | {v['losses']} | {v['draws']} | {v['points']:.6f} | {v['interval95']} | {'合格' if v['passed'] else '未達'} |\n"
 else:text+='実行または検算が完了していないため、棋力改善を認定しない。保存済み対局を再測定して同じ正式試験へ戻さない。\n\n停止理由（実行記録）：`'+str(error)+'`\n'
 text+='\nmain統合・公開切替・AI-GEN4昇格・release ID発行は実施していない。\n'
 (target/'REPORT.md').write_text(text)
 print(json.dumps(final),flush=True)
 if error:sys.exit(1)

if __name__=='__main__':
 mode=sys.argv[1]
 if mode=='init':init()
 elif mode=='batch':batch(int(sys.argv[2]))
 elif mode=='finalize':finalize()
 else:raise RuntimeError('Unknown mode')
