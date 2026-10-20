"""選択した実行fileだけを読取り、容量の下限を返す。実行・再帰走査・認可はしない。"""
import hashlib
import json
import os
from pathlib import Path
import shutil
import stat

ROLES = ('python3', 'node', 'git', 'systemd-run', 'timeout', 'gzip')
MAX_FILE_BYTES = 512 * 1024**2


def fingerprint(path):
    """特殊file・過大file・観察中の変化を拒否し、リンク先の通常fileを読む。"""
    target = Path(path).resolve(strict=True)
    fd = os.open(target, os.O_RDONLY | os.O_NONBLOCK | os.O_NOFOLLOW)
    with os.fdopen(fd, 'rb') as stream:
        before = os.fstat(stream.fileno())
        if not stat.S_ISREG(before.st_mode) or before.st_size > MAX_FILE_BYTES:
            raise ValueError('UNSUPPORTED-OR-OVERSIZE-FILE')
        digest = hashlib.sha256()
        count = 0
        while block := stream.read(1024**2):
            count += len(block)
            if count > MAX_FILE_BYTES:
                raise ValueError('FILE-GREW-BEYOND-LIMIT')
            digest.update(block)
        after = os.fstat(stream.fileno())
    identity = lambda s: (s.st_dev, s.st_ino, s.st_size, s.st_mtime_ns, s.st_ctime_ns)
    if identity(before) != identity(after) or count != before.st_size:
        raise ValueError('FILE-CHANGED-DURING-OBSERVATION')
    if identity(target.stat()) != identity(after):
        raise ValueError('PATH-CHANGED-DURING-OBSERVATION')
    return {'resolvedPath': str(target), 'logicalBytes': count,
            'allocatedBytes': after.st_blocks * 512, 'sha256': digest.hexdigest()}


def inspect(which=shutil.which):
    rows = []
    for role in ROLES:
        path = which(role)
        row = {'role': role, 'selectedPath': path, 'status': 'NOT-FOUND'}
        if path:
            try:
                row.update(fingerprint(path))
                row['status'] = 'OBSERVED-REGULAR-FILE'
            except (OSError, ValueError, RuntimeError) as error:
                row.update(status='UNMEASURED', errorType=type(error).__name__)
        rows.append(row)
    return {'evidenceClass': 'READ-ONLY-SELECTED-HOST-FILES', 'files': rows,
            'logicalBytesSumByRole': sum(r.get('logicalBytes', 0) for r in rows),
            'allocatedBytesSumByRole': sum(r.get('allocatedBytes', 0) for r in rows),
            'sumIsCompleteBudget': False, 'duplicateRoleFilesCountedSeparately': True,
            'dependenciesInspected': False, 'runnerInspected': False,
            'directoriesRecursivelyScanned': False, 'executablesInvoked': False,
            'mutationsPerformed': False, 'scientificSeedsRead': 0,
            'parentRunnerEnvironmentConfirmed': False, 'wholeLifecycleOsProven': False,
            'scientificExecutionAuthorized': False}


if __name__ == '__main__':
    print(json.dumps(inspect(), ensure_ascii=False, indent=2))
