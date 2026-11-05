"""固定26ファイルの限定API参照を本文だけから索引化する。JSを実行しない。"""
import hashlib
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT.parent / 'work-deps-20261031/SCAN.json'
PATTERN = re.compile(r'\b(?:fs|cp|crypto|process|Buffer|performance|assert)\.[A-Za-z_$][\w$]*|\bstructuredClone\b|\.toReversed\b')


def inventory():
    manifest = json.loads(MANIFEST.read_text())
    uses = {}
    for item in manifest['files']:
        raw = subprocess.check_output(['git', 'show', manifest['sourceCommit'] + ':' + item['path']])
        blob = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
        if (len(raw), hashlib.sha256(raw).hexdigest(), blob) != (item['bytes'], item['sha256'], item['gitBlob']):
            raise ValueError('INPUT-IDENTITY-MISMATCH: ' + item['path'])
        if item['path'].endswith('.json'):
            continue
        for line, text in enumerate(raw.decode().splitlines(), 1):
            for match in PATTERN.finditer(text):
                uses.setdefault(match[0], []).append({'path': item['path'], 'line': line, 'column': match.start() + 1})
    return {
        'evidenceClass': 'TEXTUAL-SELECTED-API-REFERENCES-NOT-CALL-GRAPH',
        'sourceCommit': manifest['sourceCommit'],
        'inputManifestSha256': hashlib.sha256(MANIFEST.read_bytes()).hexdigest(),
        'verifiedInputFiles': len(manifest['files']),
        'pattern': PATTERN.pattern,
        'symbols': [{'symbol': key, 'sites': uses[key]} for key in sorted(uses)],
        'runtimeExecuted': False,
        'node20WorkCompatibilityProven': False,
        'wholeLifecycleOsProven': False,
        'scientificSeedsRead': 0,
        'scientificExecutionAuthorized': False,
    }


if __name__ == '__main__':
    print(json.dumps(inventory(), indent=2))
