"""Single-use PBAI-P5 orchestration. Preparation/self-test never opens scientific seeds."""
import os,sys,json,time,signal,subprocess,pathlib,hashlib,tempfile,platform,importlib.util
ROOT=pathlib.Path(__file__).resolve().parents[2]
DOC=ROOT/'doc/ai-engineering/public-ai-improvement-program-5'
OUT=ROOT/'artifacts/pbai-p5/run'
def read(p):return json.loads(p.read_text())
def write(p,v):
 with p.open('x') as f:json.dump(v,f,indent=2);f.write('\n');f.flush();os.fsync(f.fileno())
def preflight():
 lock=read(DOC/'SOURCE_LOCK.json')
 for p,h in lock['sourceHashes'].items():assert hashlib.sha256((ROOT/p).read_bytes()).hexdigest()==h,p
 assert hashlib.sha256((DOC/'KNOWN_DATA_EXCLUSIONS.json').read_bytes()).hexdigest()==lock['knownExclusionsSha256']
 for p,h in read(DOC/'PREPARATION_LOCK.json')['files'].items():assert hashlib.sha256((ROOT/p).read_bytes()).hexdigest()==h,p
 assert subprocess.check_output(['node','--version'],text=True).strip()=='v24.19.0'
 assert sys.platform=='linux'
 assert not (OUT/'RUN_STARTED.json').exists(),'Already started: inspect records; never reset deadline'
 return {'passed':True,'mode':'preflight','scientificSeedsOpened':0,'candidateUnchanged':True}
def stop_group(p):
 try:os.killpg(p.pid,signal.SIGTERM)
 except ProcessLookupError:return
 try:p.wait(timeout=1)
 except subprocess.TimeoutExpired:pass
 try:os.killpg(p.pid,signal.SIGKILL)
 except ProcessLookupError:pass
 p.wait()
def supervise(commands,out,seconds,gate=None,publisher=None):
 out.mkdir(parents=True,exist_ok=True)
 start=time.time();mono=time.monotonic();deadline=start+seconds
 write(out/'RUN_STARTED.json',{'wallStart':start,'wallDeadline':deadline,'limitSeconds':seconds,'pid':os.getpid(),'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'commands':commands,'githubRunId':os.environ.get('GITHUB_RUN_ID'),'githubRunUrl':('https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/'+os.environ['GITHUB_RUN_ID']) if os.environ.get('GITHUB_RUN_ID') else None,'environment':{'platform':platform.platform(),'cpu':subprocess.check_output(['lscpu'],text=True),'node':subprocess.check_output(['node','--version'],text=True).strip(),'runnerImage':os.environ.get('ImageVersion')},'preparationLockSha256':hashlib.sha256((DOC/'PREPARATION_LOCK.json').read_bytes()).hexdigest()})
 child=None;previous={}
 def interrupt(signum,frame):raise InterruptedError('signal '+str(signum))
 for s in [signal.SIGINT,signal.SIGTERM,signal.SIGHUP]:previous[s]=signal.signal(s,interrupt)
 status='COMPLETE';reason=None;decision=None
 try:
  if publisher:publisher.publish(out,(deadline,mono+seconds))
  for i,cmd in enumerate(commands):
   if time.time()>=deadline or time.monotonic()-mono>=seconds:raise TimeoutError('GLOBAL-WALL-CLOCK-CAP')
   write(out/f'command-{i}.started.json',{'command':cmd,'time':time.time()})
   acknowledged=None
   with (out/f'command-{i}.log').open('x') as log:
    child=subprocess.Popen(cmd,cwd=ROOT,stdout=log,stderr=subprocess.STDOUT,start_new_session=True,env={**os.environ,'PBAI_P5_SUPERVISED':'1','PBAI_P5_CHECKPOINTS':'1' if publisher else '0'})
    while child.poll() is None:
     if time.time()>=deadline or time.monotonic()-mono>=seconds:raise TimeoutError('GLOBAL-WALL-CLOCK-CAP')
     request=out/'CHECKPOINT_REQUEST.json';ack=out/'CHECKPOINT_ACK.json'
     if publisher and request.exists() and not ack.exists():
      try:pending=read(request)
      except json.JSONDecodeError:time.sleep(.01);continue
      if pending['id']!=acknowledged:
       publisher.publish(out,(deadline,mono+seconds))
       temporary=out/'CHECKPOINT_ACK.pending'
       write(temporary,{'id':pending['id']})
       os.link(temporary,ack);temporary.unlink()
       acknowledged=pending['id']
     time.sleep(.05)
    if child.returncode:raise RuntimeError('COMMAND-FAILED '+str(i)+' exit '+str(child.returncode))
   if time.time()>=deadline or time.monotonic()-mono>=seconds:raise TimeoutError('GLOBAL-WALL-CLOCK-CAP')
   if gate:decision=gate(i,cmd)
   if time.time()>=deadline or time.monotonic()-mono>=seconds:raise TimeoutError('GLOBAL-WALL-CLOCK-CAP')
   write(out/f'command-{i}.complete.json',{'time':time.time(),'exitCode':0})
   if publisher:publisher.publish(out,(deadline,mono+seconds))
 except (Exception,KeyboardInterrupt) as e:
  status='HOLD';reason=str(e)
 finally:
  if child is not None:stop_group(child)
  for s,h in previous.items():signal.signal(s,h)
 result={'status':status,'reason':reason,'decision':decision,'finished':time.time(),'elapsedWallSeconds':time.time()-start,'elapsedMonotonicSeconds':time.monotonic()-mono,'deadline':deadline,'retryAuthorized':False}
 if status!='COMPLETE':result['decision']='STRENGTH-NON-ESTIMABLE / HOLD'
 write(out/'RUN_FINAL.json',result)
 if publisher and publisher.parent is not None:
  try:publisher.publish(out,time.time()+120)
  except Exception as e:write(out/'FINAL_UPLOAD_FAILED.json',{'reason':type(e).__name__,'resultRemains':result})
 return result

def commands():
 node=['node','--max-old-space-size=2048'];prefix='tools/engineering/'
 xs=[node+[prefix+'verify-pbai-p5-correctness.js']]
 for stage in ['development','validation','holdout']:
  xs += [node+[prefix+'run-pbai-p5-stage.js',stage],node+[prefix+'verify-pbai-p5-stage-independent.js',stage],['python3',prefix+'verify-pbai-p5-metrics-independent.py',stage]]
 return xs

def gate(i,cmd):
 if i==0:assert read(OUT/'correctness.json')['passed'];return None
 stage=cmd[-1];name=cmd[-2]
 if name.endswith('run-pbai-p5-stage.js'):assert read(OUT/stage/'gate.json')['passed'],'STAGE-GATE-FAILED '+stage
 if name.endswith('independent.py'):
  result=read(OUT/stage/'independent-metrics.json');assert result['verified']
  if stage!='holdout':assert result['games']['passed'],'INDEPENDENT-SCREEN-FAILED'
  else:return result['decision']
 return None

def self_test():
 with tempfile.TemporaryDirectory() as temp:
  d=pathlib.Path(temp)
  a=supervise([[sys.executable,'-c','while True: pass']],d/'timeout',.2)
  assert a['status']=='HOLD' and a['elapsedMonotonicSeconds']<3
  try:supervise([],d/'timeout',100)
  except FileExistsError:pass
  else:raise AssertionError('restart accepted')
  b=supervise([[sys.executable,'-c','pass']],d/'success',3);assert b['status']=='COMPLETE'
  c=supervise([[sys.executable,'-c','raise SystemExit(2)'],[sys.executable,'-c','pass']],d/'failure',3)
  assert c['status']=='HOLD' and not (d/'failure/command-1.started.json').exists()
 return {'passed':True,'timeoutStopsUnresponsiveChild':True,'restartRejected':True,'failedCommandStopsPipeline':True,'scientificSeedsOpened':0}
if __name__=='__main__':
 mode=sys.argv[1] if len(sys.argv)>1 else '--preflight'
 if mode=='--self-test':print(json.dumps(self_test()))
 elif mode=='--preflight':print(json.dumps(preflight()))
 elif mode=='--start':
  preflight()
  assert os.environ.get('GITHUB_ACTIONS')=='true' and os.environ.get('PBAI_P5_EXTERNAL')=='1','Use the prepared external workflow'
  assert os.environ.get('GITHUB_RUN_ATTEMPT')=='1','Workflow retries are forbidden'
  spec=importlib.util.spec_from_file_location('checkpoints',ROOT/'tools/engineering/pbai-p5-checkpoints.py')
  module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
  head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
  result=supervise(commands(),OUT,4*3600,gate,module.Publisher(head))
  print(json.dumps(result));sys.exit(0 if result['status']=='COMPLETE' else 1)
 else:raise SystemExit('Use --preflight, --self-test or --start')
