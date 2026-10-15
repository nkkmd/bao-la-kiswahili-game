"""統合fixtureの原image・input・通信prefix・remote診断を読み取り専用で検算する。"""
from pathlib import Path
import hashlib,json,subprocess,tempfile,zipfile
BASE=Path(__file__).resolve().parents[3]
DOC=BASE/'doc/research-generation-5/befcs-integrated-20261016'
def digest(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1048576),b''):h.update(b)
    return h.hexdigest()
def verify():
    receipt=json.loads((DOC/'CI_RECEIPT.json').read_bytes());reads=json.loads((DOC/'REMOTE_INDEPENDENT_READ.json').read_bytes())['reads']
    assert receipt['runAttempt']==1 and receipt['event']=='push' and receipt['conclusion']=='success'
    for name,h in receipt['inputs'].items():assert digest(BASE/name)==h,name
    rows=[]
    for a in receipt['artifacts']:
        archive=DOC/'results'/(a['mode']+'.zip');assert archive.stat().st_size==a['bytes'] and digest(archive)==a['sha256']
        with zipfile.ZipFile(archive) as z,tempfile.TemporaryDirectory(prefix='g5-integrated-read-') as temp:
            assert sorted(z.namelist())==['RESULT.json','WORKSPACE.img']
            assert sum(x.file_size for x in z.infolist())<=268435456
            r=json.loads(z.read('RESULT.json'));assert r==json.loads((DOC/'results'/(a['mode']+'.json')).read_bytes())
            image=Path(temp)/'WORKSPACE.img'
            with z.open('WORKSPACE.img') as src,image.open('wb') as dst:
                while b:=src.read(1048576):dst.write(b)
            h=digest(image);assert image.stat().st_size==r['imageBytes']==234881024
            assert subprocess.run(['e2fsck','-fn',str(image)],capture_output=True).returncode==0
            def get(name):return subprocess.check_output(['debugfs','-R','cat /'+name,str(image)],stderr=subprocess.DEVNULL)
            fixed=b'{"fixtureVersion":1,"scientificSeedsRead":0}\n';assert get('INPUT.json')==fixed
            input_receipt=json.loads(get('INPUT_RECEIPT.json'));assert input_receipt['blob']=='4c35ece242bc55a57a4ceebdbaaa815dadc666a7'
            witness=json.loads(get('STOP_WITNESS.json'));assert witness['evidenceClass']=='TECHNICAL-INTEGRATED-FIXTURE' and witness['scientificSeedsRead']==0
            payload=json.dumps(witness,separators=(',',':')).encode();blob=hashlib.sha1(b'blob '+str(len(payload)).encode()+b'\0'+payload).hexdigest()
            remote=json.loads(get('REMOTE_RECEIPT.json'));assert remote==r['remote'] and remote['blob']==blob and remote['sha256']==hashlib.sha256(payload).hexdigest()
            assert reads[a['mode']]['sha']==blob and reads[a['mode']]['content'].encode()==payload
            ref='refs/heads/research/g5-integrated-preservation-'+str(receipt['runId'])+'-a1-'+a['mode'];assert r['ref']==remote['ref']==ref
            journal=[json.loads(x) for x in get('TRANSPORT.jsonl').splitlines()]
            before=journal[::2];after=journal[1::2];assert len(before)==len(after)
            assert all(x['event']=='BEFORE' and y['event']=='RESPONSE' and x['method']==y['method'] and x['suffix']==y['suffix'] for x,y in zip(before,after))
            assert [(x['method'],x['suffix']) for x in before[:4]]==[('POST','/git/blobs'),('POST','/git/trees'),('POST','/git/commits'),('POST','/git/refs')]
            assert len(before)==(4 if a['mode']=='ack-loss' else 7)
            assert r['fixtureWorkCompleted']==witness['workCompleted']==(a['mode']!='enospc')
            assert witness['workErrno']==r['work']['errno']==(28 if a['mode']=='enospc' else None)
            if a['mode']=='ack-loss':assert r['finished'] is None and r['preservationCompleted'] is False and remote['acknowledged'] is False
            else:assert r['finished']['phase']=='closed' and r['preservationCompleted'] is True and remote['acknowledged'] is True
            assert r['wholeLifecycleOsProven'] is False and r['scientificExecutionAuthorized'] is False and r['scientificSeedsRead']==0
            assert r['fullImagePreservedRemotely'] is False and r['externalBootstrapCovered'] is False
            assert r['physicalBackingCharge']<=268435456 and r['memoryPeakBytes']<=1073741824
            assert r['initialTechnicalInputAcquiredInsideScope'] is True
            assert digest(image)==h
            rows.append({'mode':a['mode'],'imageUnchanged':True,'inputAndRemoteDiagnosticMatched':True,'workCompleted':r['fixtureWorkCompleted'],'preservationCompleted':r['preservationCompleted'],'imageSha256':h})
    assert sorted(a['mode'] for a in receipt['artifacts'])==['ack-loss','complete','enospc']
    return {'decision':'INTEGRATED-FIXTURE-VERIFIED-WHOLE-LIFECYCLE-PENDING','runId':receipt['runId'],'cases':rows,'scientificSeedsRead':0,'wholeLifecycleOsProven':False}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
