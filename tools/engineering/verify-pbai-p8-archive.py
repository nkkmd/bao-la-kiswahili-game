"""保存済みP8記録の読取専用確認。新規生成・対局・時間測定を行わない。"""
import hashlib
import json
import pathlib
import tarfile

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'artifacts/pbai-p8'
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
assert contents['FINAL_RESULT.json'] == (OUT / 'final-result.json').read_bytes()
assert contents['RUN_STARTED.json'] == (OUT / 'run/RUN_STARTED.json').read_bytes()
result = json.loads(contents['FINAL_RESULT.json'])
assert result['program'] == 'PBAI-P8'
assert result['release'] == 'NO-RELEASE / KEEP-AI-GEN3'
assert result['validationGenerated'] == ('validation-source.json' in contents)
assert result['holdoutGenerated'] == ('holdout-matches-source.json' in contents)
for split in ('development', 'validation'):
    name = split + '-evaluation.json'
    if name in contents:
        full = json.loads(contents[name])
        summary = json.loads((OUT / (split + '-summary.json')).read_text())
        assert {'name', 'summary', 'gates', 'passed', 'modelSha256', 'compiler'} <= set(summary)
        assert summary == {k: full[k] for k in summary}
for split in ('development', 'validation', 'holdout'):
    name = split + '-matches.json'
    if name in contents:
        assert contents[name] == (OUT / name).read_bytes()
if result['error'] is None:
    for name in ('replay-verification.json', 'independent-audit.json'):
        assert contents[name] == (OUT / name).read_bytes()
        assert json.loads(contents[name])['passed']
    audit = json.loads(contents['independent-audit.json'])
    if result['holdoutGenerated']:
        assert result['decision'] == audit['final']['decision']
    else:
        assert audit['final'] is None
        failed = [split for split in ('development', 'validation')
                  if any(name in contents and not json.loads(contents[name])['passed']
                         for name in (split + '-evaluation.json', split + '-matches.json'))]
        assert failed and result['decision'] == failed[0].upper() + '-GATE-FAIL / HOLD'
else:
    assert result['decision'] == 'TECHNICAL-INVALID / HOLD'
lock = ROOT / 'doc/ai-engineering/public-ai-improvement-program-8/SOURCE_LOCK.json'
started = json.loads(contents['RUN_STARTED.json'])
assert hashlib.sha256(lock.read_bytes()).hexdigest() == started['sourceLockSha256']
for name, digest in json.loads(lock.read_text())['files'].items():
    assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == digest, name
print(json.dumps({'passed': True, 'files': len(contents),
                  'archiveSha256': index['archiveSha256'], 'newMeasurements': 0}))
