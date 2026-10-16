"""原imageを変更せず、ZIP・ファイルシステム・停止証拠を独立に照合する。"""
from pathlib import Path
import hashlib,json,re,subprocess,tempfile,zipfile
BASE=Path(__file__).resolve().parents[3]
DOC=BASE/'doc/research-generation-5/befcs-capacity-20261015'
def digest(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1048576),b''): h.update(b)
    return h.hexdigest()
def verify():
    receipt=json.loads((DOC/'CI_RECEIPT.json').read_bytes());assert receipt['runAttempt']==1 and receipt['conclusion']=='success'
    for name,h in receipt['inputs'].items():assert digest(BASE/name)==h,name
    rows=[]
    for a in receipt['artifacts']:
        archive=DOC/'results'/(a['mode']+'.zip');assert archive.stat().st_size==a['bytes'] and digest(archive)==a['sha256']
        with zipfile.ZipFile(archive) as z,tempfile.TemporaryDirectory(prefix='g5-cap-read-') as temp:
            assert sorted(z.namelist())==['RESULT.json','WORKSPACE.img']
            assert sum(x.file_size for x in z.infolist())<=268435456
            r=json.loads(z.read('RESULT.json'));assert r==json.loads((DOC/'results'/(a['mode']+'.json')).read_bytes())
            image=Path(temp)/'WORKSPACE.img'
            with z.open('WORKSPACE.img') as source,image.open('wb') as target:
                while data:=source.read(1048576):target.write(data)
            before=digest(image);assert before==r['imageSha256'] and image.stat().st_size==r['imageBytes']==251658240
            fsck=subprocess.run(['e2fsck','-fn',str(image)],capture_output=True);assert fsck.returncode==0,fsck.stderr.decode()
            raw=subprocess.check_output(['debugfs','-R','cat /STOP_WITNESS.json',str(image)],stderr=subprocess.DEVNULL)
            witness=json.loads(raw);assert witness==r['witness'] and witness['solution'] is None and witness['scientificSeedsRead']==0
            stat=subprocess.check_output(['debugfs','-R','stat /WORK.bin',str(image)],stderr=subprocess.DEVNULL).decode()
            assert int(re.search(r'Size:\s+(\d+)',stat).group(1))==r['fill']['writtenBytes']
            reserve=subprocess.run(['debugfs','-R','stat /FINAL_RESERVE',str(image)],capture_output=True)
            assert b'File not found' in reserve.stderr
            assert digest(image)==before
            assert r['mode']==a['mode'] and r['reserveReleased'] is True and r['storageReserveBytes']==16777216
            assert r['scientificSeedsRead']==0 and r['scientificExecutionAuthorized'] is False and r['wholeLifecycleOsProven'] is False
            assert r['memoryPeakBytes']<=1073741824 and r['chargedBeforeResult']['charged']+65536<=268435456
            if a['mode']=='enospc':
                assert r['fill']['errno']==28 and r['fixtureWorkCompleted'] is False
                assert r['states'][2]['freeBytes']-r['states'][1]['freeBytes']>=16777216-4096
            else:assert r['fill']=={'writtenBytes':1048576,'errno':None} and r['fixtureWorkCompleted'] is True
            rows.append({'mode':a['mode'],'originalImageUnchanged':True,'filesystemCheck':True,'stopWitnessVerified':True})
    assert sorted(a['mode'] for a in receipt['artifacts'])==['complete','enospc']
    return {'decision':'CAPACITY-FIXTURE-VERIFIED-WHOLE-LIFECYCLE-PENDING','runId':receipt['runId'],'cases':rows,'scientificSeedsRead':0,'wholeLifecycleOsProven':False}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
