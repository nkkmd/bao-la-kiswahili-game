"""Single-use PBAI-P5 orchestration. Preparation/self-test never opens scientific seeds."""
import os,sys,json,time,signal,subprocess,pathlib,hashlib,tempfile
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
def supervise(commands,out,seconds,gate=None):
 out.mkdir(parents=True,exist_ok=True)
 start=time.time();mono=time.monotonic();deadline=start+seconds
 write(out/'RUN_STARTED.json',{'wallStart':start,'wallDeadline':deadline,'limitSeconds':seconds,'pid':os.getpid(),'commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'commands':commands})
 child=None;previous={}
 def interrupt(signum,frame):raise InterruptedError('signal '+str(signum))
 for s in [signal.SIGINT,signal.SIGTERM,signal.SIGHUP]:previous[s]=signal.signal(s,interrupt)
 status='COMPLETE';reason=None;decision=None
 try:
  for i,cmd in enumerate(commands):
   if time.time()>=deadline or time.monotonic()-mono>=seconds:raise TimeoutError('GLOBAL-WALL-CLOCK-CAP')
   write(out/f'command-{i}.started.json',{'command':cmd,'time':time.time()})
   with (out/f'command-{i}.log').open('x') as log:
    child=subprocess.Popen(cmd,cwd=ROOT,stdout=log,stderr=subprocess.STDOUT,start_new_session=True,env={**os.environ,'PBAI_P5_SUPERVISED':'1'})
    while child.poll() is None:
     if time.time()>=deadline or time.monotonic()-mono>=seconds:raise TimeoutError('GLOBAL-WALL-CLOCK-CAP')
     time.sleep(.05)
    if child.returncode:raise RuntimeError('COMMAND-FAILED '+str(i)+' exit '+str(child.returncode))
   if time.time()>=deadline or time.monotonic()-mono>=seconds:raise TimeoutError('GLOBAL-WALL-CLOCK-CAP')
   if gate:decision=gate(i,cmd)
   write(out/f'command-{i}.complete.json',{'time':time.time(),'exitCode':0})
 except (Exception,KeyboardInterrupt) as e:
  status='HOLD';reason=str(e)
 finally:
  if child is not None:stop_group(child)
  for s,h in previous.items():signal.signal(s,h)
 result={'status':status,'reason':reason,'decision':decision,'finished':time.time(),'elapsedWallSeconds':time.time()-start,'elapsedMonotonicSeconds':time.monotonic()-mono,'deadline':deadline,'retryAuthorized':False}
 if status!='COMPLETE':result['decision']='STRENGTH-NON-ESTIMABLE / HOLD'
 write(out/'RUN_FINAL.json',result)
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
  preflight();print(json.dumps(supervise(commands(),OUT,4*3600,gate)))
 else:raise SystemExit('Use --preflight, --self-test or --start')
