"""正式実行の返却ZIPを照合して保全する。対局・seed生成は実行しない。"""
import hashlib
import io
import json
import pathlib
import sys
import tarfile
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
DEST = ROOT / 'artifacts/pbai-p11/results'
EXPECTED_ZIP = '657d1bc28455cf43e72a73043767402212a5c0042d924e31a3e64ae4d504f638'
SOURCE_COMMIT = '0dd3bb6daf19bf00803d43c91bc832fb38d0213f'

def sha(data):
    return hashlib.sha256(data).hexdigest()

def main():
    data = pathlib.Path(sys.argv[1]).read_bytes()
    assert sha(data) == EXPECTED_ZIP
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        names = ['EVIDENCE_INDEX.json', 'REPORT.md', 'FINAL_RESULT.json', 'final-evidence.tar.gz']
        assert sorted(z.namelist()) == sorted(names)
        returned = {name: z.read(name) for name in names}
    index = json.loads(returned['EVIDENCE_INDEX.json'])
    assert sha(returned['final-evidence.tar.gz']) == index['archiveSha256']
    with tarfile.open(fileobj=io.BytesIO(returned['final-evidence.tar.gz']), mode='r:gz') as t:
        members = t.getmembers()
        assert all(m.isfile() and pathlib.PurePosixPath(m.name).name == m.name for m in members)
        assert len(members) == len({m.name for m in members})
        raw = {m.name: t.extractfile(m).read() for m in members}
    assert set(raw) == set(index['files'])
    for name, body in raw.items():
        assert sha(body) == index['files'][name]['sha256'], name
        assert len(body) == index['files'][name]['bytes'], name
    final = json.loads(returned['FINAL_RESULT.json'])
    assert final['runId'] == '34439270384' and final['sourceCommit'] == SOURCE_COMMIT
    assert final['verificationPassed'] and final['error'] is None
    assert final['decision'] == 'EXPERT-STRENGTH-PASS / ADOPTION-PENDING'
    for key in ['expertAdopted', 'physicalDeviceVerified', 'publicChanged', 'newGenerationIssued']:
        assert final[key] is False
    start = json.loads(raw['RUN_STARTED.json'])
    auth = json.loads(raw['AUTHORIZATION.json'])
    assert start['executionCommit'] == auth['sourceCommit'] == SOURCE_COMMIT
    assert str(start['runId']) == str(auth['runId']) == final['runId']
    assert start['authorizationSha256'] == sha(raw['AUTHORIZATION.json'])
    doc = ROOT / 'doc/ai-engineering/public-ai-improvement-program-11'
    assert start['sourceLockSha256'] == auth['sourceLockSha256'] == sha((doc / 'SOURCE_LOCK.json').read_bytes())
    for p, expected in json.loads((doc / 'SOURCE_LOCK.json').read_text())['files'].items():
        assert sha((ROOT / p).read_bytes()) == expected, p
    assert final['finishedUnix'] < start['deadlineUnix']
    replay = json.loads(raw['replay-verification.json'])
    audit = json.loads(raw['independent-audit.json'])
    assert replay['passed'] and replay['matchGames'] == 784 and replay['sourceRoots'] == 392
    assert audit['passed'] and audit['final']['passed']
    for i in range(49):
        assert json.loads(raw[f'batch-{i:03d}-done.json'])['passed']
    performance = {}
    for tier in ['low', 'standard', 'high']:
        assert audit['final']['tiers'][tier]['passed']
        report = json.loads(raw[tier + '-matches.json'])
        pairs = [json.loads(v) for k, v in raw.items() if k.startswith(tier + '-pair-')]
        assert len(pairs) == 128
        memory = {}
        for actor in ['logic', 'baseline']:
            moves = [m for p in pairs for g in p['games'] for m in g['plies'] if m['actor'] == actor]
            memory[actor] = {key: max(m['workerMemory'][key] for m in moves) for key in ['heapUsed', 'rss', 'external']}
        performance[tier] = {'overrun': report['overrun'], 'latency': report['latency'], 'endOfRequestMemoryMaxBytes': memory}
    verification = {'passed': True, 'zipSha256': EXPECTED_ZIP, 'artifactId': 10161465587,
                    'runId': 34439270384, 'sourceCommit': SOURCE_COMMIT, 'rawFiles': len(raw),
                    'archiveSha256': index['archiveSha256'], 'elapsedSeconds': final['finishedUnix'] - start['startedUnix'],
                    'replay': replay, 'performance': performance, 'timedMatchesRerun': False,
                    'scope': 'returned evidence integrity; original CI replay/audit preserved; no new timed search'}
    DEST.mkdir(parents=True, exist_ok=False)
    for name, body in returned.items():
        (DEST / name).write_bytes(body)
    for name in ['RUN_STARTED.json', 'replay-verification.json', 'independent-audit.json']:
        (DEST / name).write_bytes(raw[name])
    (DEST / 'RETURN_VERIFICATION.json').write_text(json.dumps(verification, indent=2) + '\n')
    print(json.dumps(verification))

if __name__ == '__main__':
    main()
