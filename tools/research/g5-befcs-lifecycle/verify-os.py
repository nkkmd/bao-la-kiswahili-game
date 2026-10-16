"""保存済みOS fixtureの原ZIPと停止・保存結果を独立に照合する。"""
from pathlib import Path
import hashlib, io, json, zipfile
BASE = Path(__file__).resolve().parents[3]
DOC = BASE / 'doc/research-generation-5/befcs-lifecycle-20261015'
def verify():
    receipt = json.loads((DOC / 'CI_RECEIPT.json').read_bytes())
    assert receipt['runAttempt'] == 1 and receipt['event'] == 'push'
    assert receipt['conclusion'] == 'success'
    for name, expected in receipt['inputs'].items():
        assert hashlib.sha256((BASE / name).read_bytes()).hexdigest() == expected, name
    rows = []
    for a in receipt['artifacts']:
        raw = (DOC / 'os-results' / (a['mode'] + '.zip')).read_bytes()
        assert hashlib.sha256(raw).hexdigest() == a['sha256']
        assert len(raw) == a['bytes']
        with zipfile.ZipFile(io.BytesIO(raw)) as z:
            assert len(z.namelist()) == len(set(z.namelist()))
            r = json.loads(z.read('OS_RESULT.json'))
            assert r == json.loads((DOC / 'os-results' / (a['mode'] + '.json')).read_bytes())
            assert r['mode'] == a['mode'] and r['fixturePassed'] is True
            assert r['scientificSeedsRead'] == 0
            assert r['scientificExecutionAuthorized'] is False and r['wholeLifecycleOsProven'] is False
            assert r['externalBootstrapAndActionsUploadCovered'] is False
            assert r['preservation'] == 'LOCAL-FSYNC-SINK-ONLY'
            assert 0 <= r['memoryPeakBytes'] <= 1073741824 and 0 <= r['elapsedMs'] < 1200000
            samples = r['records']['samples']
            assert samples and samples[0]['phase'] == 'checkout'
            assert all(s['scopeId'] == samples[0]['scopeId'] for s in samples)
            assert all(x['elapsedMs'] <= y['elapsedMs'] for x, y in zip(samples, samples[1:]))
            if a['mode'] == 'memory':
                assert r['finished'] is None and r['failure'] == 'EXPECTED-CHILD-CGROUP-OOM'
                assert any(c['role'] == 'worker' and c['signal'] == 'SIGKILL' for c in r['children'])
            else:
                assert z.read('FINAL.json') == z.read('sink/FINAL.json')
                final = json.loads(z.read('FINAL.json'))
                assert final['workSha256'] == hashlib.sha256(z.read('WORK.json')).hexdigest()
                assert [p['phase'] for p in r['records']['receipts']] == ['checkout', 'prepare', 'work', 'finalize', 'preserve']
                if a['mode'] == 'complete':
                    assert r['failure'] is None and r['finished']['phase'] == 'closed'
                    assert r['finished']['wholeLifecycleOsProven'] is False
                else:
                    assert r['finished'] is None and r['failure'].startswith('PRESERVATION-NOT-ACKNOWLEDGED')
            rows.append({'mode': a['mode'], 'archiveBytes': len(raw), 'resultMatched': True})
    assert sorted(a['mode'] for a in receipt['artifacts']) == ['complete', 'memory', 'preserve-no-ack']
    return {'decision': 'SAVED-OS-FIXTURE-VERIFIED-WHOLE-LIFECYCLE-PENDING', 'runId': receipt['runId'], 'cases': rows, 'scientificSeedsRead': 0, 'wholeLifecycleOsProven': False}
if __name__ == '__main__':
    print(json.dumps(verify(), indent=2))
