"""固定runnerのC#構文候補を列挙する。call graphやegressの完全性は証明しない。"""
import gzip
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

COMMIT = '397b032cbf865e9c3ddfab89d533ec19325e1273'
DOC = Path(__file__).resolve().parents[3] / 'doc/research-generation-5/runner-topology-20261017/client-map-20261020'
PATTERNS = {
    'constructor': r'\bnew\s+(?:System\.Net\.Http\.)?(?:HttpClient|HttpClientHandler|SocketsHttpHandler|WebClient|VssConnection|RawConnection|VssHttpMessageHandler|RawHttpMessageHandler|VssHttpRetryMessageHandler|TcpClient|Socket|ClientWebSocket)\s*\(',
    'targetTypedNew': r'\b(?:HttpClient|HttpClientHandler|VssConnection|RawConnection|VssHttpMessageHandler|RawHttpMessageHandler)\s+\w+\s*=\s*new\s*\(',
    'factory': r'\b(?:CreateHttpClientHandler|CreateClientHandler|CreateRawConnection|CreateConnection|HttpClientFactory\.CreatePipeline|WebRequest\.Create(?:Http)?)\s*\(',
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def matches(path, text):
    return [{'path': path, 'line': i + 1, 'pattern': name, 'text': line}
            for i, line in enumerate(text.splitlines())
            for name, pattern in PATTERNS.items() if re.search(pattern, line)]


def scan(repo):
    def git(*args):
        return subprocess.check_output(['git', '-C', str(repo), *args], env={**__import__('os').environ, 'GIT_NO_LAZY_FETCH': '1'})
    if git('rev-parse', 'HEAD').decode().strip() != COMMIT:
        raise ValueError('SOURCE-COMMIT-MISMATCH')
    records, hits, sources = [], [], {}
    for raw in git('ls-tree', '-r', '-z', 'HEAD').split(b'\0'):
        if not raw:
            continue
        meta, name = raw.split(b'\t', 1)
        path = name.decode()
        if not path.endswith('.cs') or not path.startswith(('src/Runner.', 'src/Sdk/')):
            continue
        mode, kind, blob = meta.decode().split()
        if kind != 'blob' or mode not in ('100644', '100755'):
            raise ValueError('UNSUPPORTED-SOURCE')
        local = repo / path
        if local.is_symlink():
            raise ValueError('SYMLINK-SOURCE')
        data = local.read_bytes()
        if hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest() != blob:
            raise ValueError('SOURCE-BLOB-MISMATCH')
        found = matches(path, data.decode('utf-8-sig'))
        records.append({'path': path, 'gitBlob': blob, 'bytes': len(data), 'sha256': sha(data), 'literalMatches': len(found)})
        hits.extend(found)
        if found:
            sources[path] = data.decode('utf-8')
    return {'sourceCommit': COMMIT, 'sourceTree': git('rev-parse', 'HEAD^{tree}').decode().strip(),
            'scope': 'tracked src/Runner.*/**/*.cs and src/Sdk/**/*.cs; src/Test excluded',
            'patterns': PATTERNS, 'files': records, 'matches': hits, 'matchedSources': sources}


def verify_saved(doc=DOC):
    summary = json.loads((doc / 'REVIEW.json').read_bytes())
    decoded = {}
    for name, field in [('SCAN.json.gz', 'scanGzipSha256'), ('MATCHED_SOURCES.json.gz', 'sourcesGzipSha256')]:
        data = (doc / name).read_bytes()
        if sha(data) != summary[field]:
            raise ValueError('SAVED-HASH')
        decoded[name] = json.loads(gzip.decompress(data))
    scan = decoded['SCAN.json.gz']
    sources = decoded['MATCHED_SOURCES.json.gz']
    if scan['sourceCommit'] != COMMIT or scan['patterns'] != PATTERNS:
        raise ValueError('SCAN-SCOPE')
    expected_sources = {f['path'] for f in scan['files'] if f['literalMatches']}
    if set(sources) != expected_sources or len(scan['files']) != summary['scannedCSharpFiles']:
        raise ValueError('SOURCE-SET')
    rebuilt = []
    for row in scan['files']:
        if row['path'] not in sources:
            continue
        data = sources[row['path']].encode()
        if len(data) != row['bytes'] or sha(data) != row['sha256']:
            raise ValueError('SOURCE-HASH')
        if hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest() != row['gitBlob']:
            raise ValueError('SOURCE-BLOB')
        found = matches(row['path'], data.decode('utf-8-sig'))
        if len(found) != row['literalMatches']:
            raise ValueError('MATCH-COUNT')
        rebuilt.extend(found)
    if rebuilt != scan['matches'] or len(rebuilt) != summary['literalMatchCount'] or len(sources) != summary['matchedFiles']:
        raise ValueError('MATCH-INDEX')
    for key in ('allClientsEnumerated', 'allEgressMediated', 'innerTransportAudited',
                'controlImplemented', 'wholeLifecycleOsProven', 'scientificExecutionAuthorized'):
        if summary[key] is not False:
            raise ValueError('UNPROVEN-CLAIM')
    if summary['scientificSeedsRead'] != 0:
        raise ValueError('SCIENTIFIC-BOUNDARY')
    return {'savedMatchedSourceAndIndexVerified': True, 'fullSourceRescanPerformed': False,
            'scannedCSharpFilesInSavedManifest': len(scan['files']),
            'matchedSourceFilesVerified': len(sources), 'literalMatchesVerified': len(rebuilt),
            'wholeLifecycleOsProven': False, 'scientificSeedsRead': 0, 'scientificExecutionAuthorized': False}


if __name__ == '__main__':
    result = verify_saved() if sys.argv[1:] == ['--verify-saved'] else scan(Path(sys.argv[1]))
    print(json.dumps(result, ensure_ascii=False, indent=2))
