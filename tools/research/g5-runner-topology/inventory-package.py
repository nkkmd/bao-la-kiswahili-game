"""固定runner archiveをローカルで読む。取得・展開・実行はしない。"""
import hashlib
import json
from pathlib import Path, PurePosixPath
import sys
import tarfile

EXPECTED_BYTES = 226430031
EXPECTED_SHA256 = '70920811a4f8ad4328818682bca5c6469c1c942fab52448868071d0063816613'


def inventory(path, expected_bytes=EXPECTED_BYTES, expected_sha256=EXPECTED_SHA256):
    path = Path(path)
    if not path.is_file() or path.stat().st_size != expected_bytes:
        raise ValueError('ARCHIVE-SIZE-MISMATCH')
    h = hashlib.sha256()
    with path.open('rb') as f:
        while b := f.read(1024**2):
            h.update(b)
    if h.hexdigest() != expected_sha256:
        raise ValueError('ARCHIVE-HASH-MISMATCH')
    rows = []
    seen = set()
    total = 0
    with tarfile.open(path, 'r|gz') as archive:
        for member in archive:
            name = PurePosixPath(member.name)
            if name.is_absolute() or '..' in name.parts or str(name) in seen:
                raise ValueError('UNSAFE-OR-DUPLICATE-MEMBER')
            seen.add(str(name))
            if len(seen) > 20000 or member.size < 0:
                raise ValueError('MEMBER-LIMIT')
            kind = ('file' if member.isfile() else 'directory' if member.isdir()
                    else 'symlink' if member.issym() else 'hardlink' if member.islnk() else 'unsupported')
            if kind == 'unsupported':
                raise ValueError('UNSUPPORTED-MEMBER')
            if kind == 'file':
                total += member.size
                if total > 2 * 1024**3:
                    raise ValueError('UNCOMPRESSED-LIMIT')
            rows.append({'name': member.name, 'kind': kind, 'logicalBytes': member.size,
                         'linkTarget': member.linkname if kind in ('symlink', 'hardlink') else None})
    # 読取中の置換を成功とせず、同じarchiveであることを再照合する。
    final = hashlib.sha256()
    with path.open('rb') as f:
        while b := f.read(1024**2):
            final.update(b)
    if path.stat().st_size != expected_bytes or final.hexdigest() != expected_sha256:
        raise ValueError('ARCHIVE-CHANGED')
    return {'evidenceClass': 'STATIC-RUNNER-ARCHIVE-INVENTORY',
            'archiveBytes': expected_bytes, 'archiveSha256': expected_sha256,
            'regularFileLogicalBytes': total,
            'regularFiles': sum(r['kind'] == 'file' for r in rows),
            'directories': sum(r['kind'] == 'directory' for r in rows),
            'symlinks': sum(r['kind'] == 'symlink' for r in rows),
            'hardlinks': sum(r['kind'] == 'hardlink' for r in rows),
            'entries': rows, 'archiveExtracted': False, 'runnerExecuted': False,
            'hostArchitectureConfirmed': False, 'wholeLifecycleOsProven': False,
            'scientificSeedsRead': 0, 'scientificExecutionAuthorized': False}


if __name__ == '__main__':
    print(json.dumps(inventory(sys.argv[1]), ensure_ascii=False, indent=2))
