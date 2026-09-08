"""保存済みP7成果物の読取専用検査。局面生成・対局・時間測定を行わない。"""
import hashlib
import json
import pathlib
import tarfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'artifacts/pbai-p7'
index = json.loads((OUT / 'final-evidence-index.json').read_text())
archive = OUT / 'final-evidence.tar.gz'
assert hashlib.sha256(archive.read_bytes()).hexdigest() == index['archiveSha256']
with tarfile.open(archive) as tar:
    members = [m for m in tar.getmembers() if m.isfile()]
    assert all(m.name.startswith('run/') for m in members)
    contents = {m.name.removeprefix('run/'): tar.extractfile(m).read() for m in members}
    assert len(contents) == len(members)
assert set(contents) == {r['path'] for r in index['files']}
for row in index['files']:
    data = contents[row['path']]
    assert len(data) == row['bytes']
    assert hashlib.sha256(data).hexdigest() == row['sha256']
for raw, saved in [('FINAL_RESULT.json', 'final-result.json'),
                   ('postclosure-replay-verification.json', 'postclosure-replay-verification.json'),
                   ('postclosure-independent-audit.json', 'postclosure-independent-audit.json'),
                   ('postclosure-incident.json', 'postclosure-incident.json')]:
    assert contents[raw] == (OUT / saved).read_bytes()
assert contents['RUN_STARTED.json'] == (OUT / 'run/RUN_STARTED.json').read_bytes()
result = json.loads(contents['FINAL_RESULT.json'])
audit = json.loads(contents['postclosure-independent-audit.json'])
replay = json.loads(contents['postclosure-replay-verification.json'])
assert result['decision'] == 'TECHNICAL-INVALID / HOLD' and result['error'] is not None
assert 'replay-verification.json' not in contents and 'independent-audit.json' not in contents
assert audit['passed'] and replay['passed']
assert all(report['diagnosticOnly'] and report['formalDecisionUnchanged'] for report in (audit, replay))
assert replay['signedZeroDifferences'] == 2 and not replay['timedMatchesRerun']
assert result['validationGenerated'] == ('validation-source.json' in contents)
assert result['holdoutGenerated'] == ('holdout-matches-source.json' in contents)
for split in ('development', 'validation'):
    name = split + '-evaluation.json'
    if name in contents:
        full = json.loads(contents[name])
        summary = json.loads((OUT / (split + '-summary.json')).read_text())
        assert summary == {k: full[k] for k in summary}
        assert {'name', 'summary', 'gates', 'passed', 'modelSha256', 'compiler'} <= set(summary)
for split in ('development', 'validation', 'holdout'):
    name = split + '-matches.json'
    if name in contents:
        assert contents[name] == (OUT / name).read_bytes()
assert result['holdoutGenerated'] and audit['final'] is not None
assert json.loads(contents['holdout-matches.json'])['points'] == audit['final']['points']
assert result['release'] == 'NO-RELEASE / KEEP-AI-GEN3'
lock = ROOT / 'doc/ai-engineering/public-ai-improvement-program-7/SOURCE_LOCK.json'
started = json.loads(contents['RUN_STARTED.json'])
assert hashlib.sha256(lock.read_bytes()).hexdigest() == started['sourceLockSha256']
for name, digest in json.loads(lock.read_text())['files'].items():
    assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == digest, name
print(json.dumps({'passed': True, 'files': len(contents),
                  'archiveSha256': index['archiveSha256'], 'newMeasurements': 0}))
