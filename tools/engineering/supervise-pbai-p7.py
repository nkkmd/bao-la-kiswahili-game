"""PBAI-P7 consume-once orchestration with an external process-group deadline."""
import os, sys, time, json, signal, hashlib, pathlib, subprocess, platform
ROOT=pathlib.Path(__file__).resolve().parents[2]
DOC=ROOT/'doc/ai-engineering/public-ai-improvement-program-7'
OUT=ROOT/'artifacts/pbai-p7/run'

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
            if time.monotonic()>=deadline or time.time()>=wall_deadline:raise TimeoutError('PBAI-P7 resource deadline')
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
    lock=verify_lock(); OUT.mkdir(parents=True,exist_ok=True)
    start=time.monotonic();wall=time.time();limit=read(DOC/'SPEC.json')['resources']['wallClockSeconds']
    write(OUT/'RUN_STARTED.json',{'startedUnix':wall,'pid':os.getpid(),'limitSeconds':limit,'sourceLockSha256':hashlib.sha256((DOC/'SOURCE_LOCK.json').read_bytes()).hexdigest(),'executionCommit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'python':platform.python_version(),'platform':platform.platform(),'cpu':platform.processor(),'node':subprocess.check_output(['node','--version'],text=True).strip(),'consumedOnce':True})
    env=os.environ.copy();env.update({'PBAI_P7_SUPERVISED':'1','OPENBLAS_NUM_THREADS':'1','OMP_NUM_THREADS':'1','MKL_NUM_THREADS':'1'})
    def stop_signal(signum,frame):raise RuntimeError('Interrupted by signal '+str(signum))
    signal.signal(signal.SIGTERM,stop_signal);signal.signal(signal.SIGINT,stop_signal)
    def command(args):
        run_child(args,start+limit,wall+limit,env)
    def node(*args):command(['node','--max-old-space-size=2048','tools/engineering/run-pbai-p7-stage.js',*args])
    outcome='TECHNICAL-INVALID / HOLD';details=None
    try:
        node('generate','development')
        node('evaluate','development')
        if not read(OUT/'development-evaluation.json')['passed']:outcome='DEVELOPMENT-GATE-FAIL / HOLD'
        else:
            node('matches','development')
            if not read(OUT/'development-matches.json')['passed']:outcome='DEVELOPMENT-GATE-FAIL / HOLD'
            else:
                node('generate','validation');node('evaluate','validation')
                if not read(OUT/'validation-evaluation.json')['passed']:outcome='VALIDATION-GATE-FAIL / HOLD'
                else:
                    node('matches','validation')
                    if not read(OUT/'validation-matches.json')['passed']:outcome='VALIDATION-GATE-FAIL / HOLD'
                    else:node('matches','holdout');outcome='PENDING-FINAL-AUDIT'
        command(['node','--max-old-space-size=2048','tools/engineering/verify-pbai-p7.js'])
        command([sys.executable,'tools/engineering/audit-pbai-p7.py'])
        if outcome=='PENDING-FINAL-AUDIT':outcome=read(OUT/'independent-audit.json')['final']['decision']
        verify_lock()
        if time.monotonic()>=start+limit or time.time()>=wall+limit:raise TimeoutError('Final deadline')
    except BaseException as e:
        outcome='TECHNICAL-INVALID / HOLD';details=repr(e)
    write(OUT/'FINAL_RESULT.json',{'program':'PBAI-P7','decision':outcome,'error':details,'elapsedSeconds':time.monotonic()-start,'finishedUnix':time.time(),'release':'NO-RELEASE / KEEP-AI-GEN3','validationGenerated':(OUT/'validation-source.json').exists(),'holdoutGenerated':(OUT/'holdout-matches-source.json').exists()})
    print(json.dumps(read(OUT/'FINAL_RESULT.json')),flush=True)
    return 1 if details else 0
if __name__=='__main__':sys.exit(main())
