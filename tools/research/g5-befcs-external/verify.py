"""固定技術データの原ZIP・GitHub応答・未ACKを保存済み証拠だけで検算する。"""
from pathlib import Path
import base64, hashlib, io, json, zipfile
BASE = Path(__file__).resolve().parents[3]
DOC = BASE / 'doc/research-generation-5/befcs-external-20261015'
def verify():
    receipt = json.loads((DOC / 'CI_RECEIPT.json').read_bytes())
    reads = json.loads((DOC / 'REMOTE_INDEPENDENT_READ.json').read_bytes())
    assert receipt['runAttempt'] == 1 and receipt['event'] == 'push' and receipt['conclusion'] == 'success'
    for name, h in receipt['inputs'].items(): assert hashlib.sha256((BASE / name).read_bytes()).hexdigest() == h, name
    fixed = b'{"fixtureVersion":1,"scientificSeedsRead":0}\n'
    blob = hashlib.sha1(b'blob ' + str(len(fixed)).encode() + b'\0' + fixed).hexdigest()
    rows = []
    for a in receipt['artifacts']:
        raw = (DOC / 'results' / (a['mode'] + '.zip')).read_bytes()
        assert len(raw) == a['bytes'] and hashlib.sha256(raw).hexdigest() == a['sha256']
        with zipfile.ZipFile(io.BytesIO(raw)) as z:
            assert len(z.namelist()) == len(set(z.namelist()))
            r = json.loads(z.read('RESULT.json'))
            assert r == json.loads((DOC / 'results' / (a['mode'] + '.json')).read_bytes())
            assert z.read('FIXTURE.json') == fixed
            assert r['scientificSeedsRead'] == 0 and r['wholeLifecycleOsProven'] is False
            assert r['externalBootstrapCovered'] is False and r['actionsArtifactUploadCovered'] is False
            assert r['physicalWorkspaceHardLimitProven'] is False and r['scientificExecutionAuthorized'] is False
            expected_ref = 'refs/heads/research/g5-lifecycle-preservation-' + str(receipt['runId']) + '-a1-' + a['mode']
            remote = r['remote']; assert r['ref'] == remote['ref'] == expected_ref
            assert remote['blob'] == blob and remote['sha256'] == hashlib.sha256(fixed).hexdigest()
            assert remote['writesLocked'] is True
            journal = [json.loads(line) for line in z.read('TRANSPORT.jsonl').splitlines()]
            before = [v for v in journal if v['event'] == 'BEFORE']
            responses = [v for v in journal if v['event'] == 'RESPONSE']
            assert len(journal) == 2 * len(before) == 2 * len(responses)
            for i in range(len(before)):
                assert journal[2*i]['event'] == 'BEFORE' and journal[2*i+1]['event'] == 'RESPONSE'
                assert {k:before[i][k] for k in ['method','suffix']} == remote['calls'][i]
            assert [(x['method'],x['suffix']) for x in before[:4]] == [('POST','/git/blobs'),('POST','/git/trees'),('POST','/git/commits'),('POST','/git/refs')]
            assert responses[3]['response']['object']['sha'] == remote['commit']
            independent = reads['reads'][a['mode']]
            assert independent['sha'] == blob and independent['content'].encode() == fixed
            if a['mode'] == 'complete':
                assert len(before) == 7 and all(v['method'] == 'GET' for v in before[4:])
                assert base64.b64decode(responses[-1]['response']['content']) == fixed
                assert remote['acknowledged'] is True and r['failure'] is None and r['finished']['phase'] == 'closed'
            else:
                assert len(before) == 4 and remote['acknowledged'] is False and r['finished'] is None
                assert r['failure'].startswith('PRESERVATION-NOT-ACKNOWLEDGED')
            assert 0 <= r['memoryPeakBytes'] <= 1073741824 and 0 <= r['elapsedMs'] < 1200000
            rows.append({'mode':a['mode'],'archiveAndRemoteDataMatch':True,'acknowledged':remote['acknowledged']})
    assert sorted(a['mode'] for a in receipt['artifacts']) == ['ack-loss','complete']
    return {'decision':'EXTERNAL-FIXED-FIXTURE-VERIFIED-WHOLE-LIFECYCLE-PENDING','runId':receipt['runId'],'cases':rows,'scientificSeedsRead':0,'wholeLifecycleOsProven':False}
if __name__ == '__main__': print(json.dumps(verify(),indent=2))
