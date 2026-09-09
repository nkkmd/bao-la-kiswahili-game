"""PBAI-P10 consume-once orchestration with an external process-group deadline."""
import os, sys, time, json, signal, hashlib, pathlib, subprocess, platform
ROOT=pathlib.Path(__file__).resolve().parents[2]
DOC=ROOT/'doc/ai-engineering/public-ai-improvement-program-10'
OUT=ROOT/'artifacts/pbai-p10/run'

def write(p,value):
    with p.open('x') as f: json.dump(value,f,indent=2,allow_nan=False);f.write('\n')
def read(p):return json.loads(p.read_text())
def verify_lock():
    lock=read(DOC/'SOURCE_LOCK.json')
    for p,h in lock['files'].items():
        if hashlib.sha256((ROOT/p).read_bytes()).hexdigest()!=h:raise RuntimeError('Source lock mismatch: '+p)
    return lock

def run_child(args,deadline,wall_deadline,env):
    child=subprocess.Popen(args,cwd=ROOT,env=env,start_new_session=True)
    try:
        while child.poll() is None:
            if time.monotonic()>=deadline or time.time()>=wall_deadline:raise TimeoutError('PBAI-P10 resource deadline')
            time.sleep(.1)
        if child.returncode:raise RuntimeError('Child failed: '+str(args)+' / '+str(child.returncode))
    finally:
        if child.poll() is None:
            os.killpg(child.pid,signal.SIGTERM)
            try:child.wait(timeout=2)
            except subprocess.TimeoutExpired:os.killpg(child.pid,signal.SIGKILL);child.wait()

def main():
    if '--self-test' in sys.argv:
        try:run_child([sys.executable,'-c','while True: pass'],time.monotonic()+.3,time.time()+.3,os.environ.copy())
        except TimeoutError:print('external deadline test passed');return
        raise RuntimeError('Deadline test did not stop child')
    if (ROOT/'artifacts/pbai-p10/RUN_STARTED.json').exists():raise RuntimeError('Archived run already consumed')
    if OUT.exists() and any(OUT.iterdir()):raise RuntimeError('Raw output is not empty; do not restart')
    lock=verify_lock()
    browser=read(DOC/'PREPARATION.json')
    if not browser['passed']:raise RuntimeError('Browser preparation failed')
    if subprocess.check_output(['git','status','--porcelain'],cwd=ROOT,text=True).strip():raise RuntimeError('Commit all preparation before execution')
    OUT.mkdir(parents=True,exist_ok=True)
    start=time.monotonic();wall=time.time();limit=read(DOC/'SPEC.json')['resources']['wallClockSeconds']
    write(OUT/'RUN_STARTED.json',{'startedUnix':wall,'pid':os.getpid(),'limitSeconds':limit,'sourceLockSha256':hashlib.sha256((DOC/'SOURCE_LOCK.json').read_bytes()).hexdigest(),'executionCommit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'python':platform.python_version(),'numpy':__import__('numpy').__version__,'logicalCpus':os.cpu_count(),'platform':platform.platform(),'cpu':platform.processor(),'node':subprocess.check_output(['node','--version'],text=True).strip(),'consumedOnce':True})
    env=os.environ.copy();env.update({'PBAI_P10_SUPERVISED':'1','OPENBLAS_NUM_THREADS':'1','OMP_NUM_THREADS':'1','MKL_NUM_THREADS':'1'})
    def stop_signal(signum,frame):raise RuntimeError('Interrupted by signal '+str(signum))
    signal.signal(signal.SIGTERM,stop_signal);signal.signal(signal.SIGINT,stop_signal)
    def command(args):
        run_child(args,start+limit,wall+limit,env)
    def node(*args):command(['node','--max-old-space-size=2048','tools/engineering/run-pbai-p10-stage.js',*args])
    outcome='TECHNICAL-INVALID / HOLD';details=None
    try:
        node('pilot')
        if not read(OUT/'pilot-matches.json')['operation']:outcome='OPERATION-GATE-FAIL / HOLD'
        else:
            node('low');node('standard');node('high');outcome='PENDING-FINAL-AUDIT'
        command(['node','--max-old-space-size=2048','tools/engineering/verify-pbai-p10.js'])
        command([sys.executable,'tools/engineering/audit-pbai-p10.py'])
        if outcome=='PENDING-FINAL-AUDIT':outcome=read(OUT/'independent-audit.json')['final']['decision']
        verify_lock()
        if time.monotonic()>=start+limit or time.time()>=wall+limit:raise TimeoutError('Final deadline')
    except BaseException as e:
        outcome='TECHNICAL-INVALID / HOLD';details=repr(e)
    write(OUT/'FINAL_RESULT.json',{'program':'PBAI-P10','decision':outcome,'error':details,'elapsedSeconds':time.monotonic()-start,'finishedUnix':time.time(),'release':'NO-RELEASE / KEEP-AI-GEN3','lowGenerated':(OUT/'low-matches-source.json').exists(),'highGenerated':(OUT/'high-matches-source.json').exists()})
    print(json.dumps(read(OUT/'FINAL_RESULT.json')),flush=True)
    return 1 if details else 0
if __name__=='__main__':sys.exit(main())
