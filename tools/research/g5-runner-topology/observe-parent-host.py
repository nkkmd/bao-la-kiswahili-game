"""親監督候補の現在値だけを読む。設定・権限試験・runner起動は行わない。"""
import json
import os
from pathlib import Path, PurePosixPath
import stat
import subprocess

LIMIT = 4096
CGROOT = Path('/sys/fs/cgroup')


def read_small(path):
    fd = os.open(path, os.O_RDONLY | os.O_NONBLOCK | os.O_NOFOLLOW)
    with os.fdopen(fd, 'rb') as stream:
        if not stat.S_ISREG(os.fstat(stream.fileno()).st_mode):
            raise ValueError('NOT-REGULAR')
        raw = stream.read(LIMIT + 1)
    if len(raw) > LIMIT:
        raise ValueError('TOO-LARGE')
    return raw.decode().strip()


def command(args):
    try:
        result = subprocess.run(args, capture_output=True, text=True, timeout=5,
                                env={**os.environ, 'LC_ALL': 'C'}, check=False)
        if len(result.stdout) > LIMIT:
            return {'status': 'UNOBSERVED', 'reason': 'OUTPUT-LIMIT'}
        return {'status': 'OBSERVED', 'exitCode': result.returncode,
                'stdout': result.stdout.strip()}
    except (OSError, subprocess.TimeoutExpired) as error:
        return {'status': 'UNOBSERVED', 'reason': type(error).__name__}


def selected_group(root, value):
    parts = value.split('/')
    if not value.startswith('/') or value == '/' or any(p in ('', '.', '..') for p in parts[1:]):
        raise ValueError('INVALID-CONTROL-GROUP')
    path = root.joinpath(*PurePosixPath(value).parts[1:])
    # 解決先が選択root外なら読まない。観察全体の原子的snapshotは保証しない。
    if not path.resolve().is_relative_to(root.resolve()):
        raise ValueError('OUTSIDE-CGROUP-ROOT')
    return path


def group_snapshot(path, reader=read_small):
    values = {}
    for name in ('cgroup.type', 'cgroup.controllers', 'cgroup.subtree_control',
                 'memory.max', 'memory.swap.max', 'cgroup.events'):
        try:
            values[name] = {'status': 'OBSERVED', 'value': reader(path / name)}
        except (OSError, ValueError, UnicodeError) as error:
            values[name] = {'status': 'UNOBSERVED', 'reason': type(error).__name__}
    # cgroup.killはwrite-only。存在属性だけを見て、openも書込もしない。
    try:
        info = (path / 'cgroup.kill').lstat()
        kill = {'status': 'METADATA-ONLY', 'regularFile': stat.S_ISREG(info.st_mode),
                'mode': oct(stat.S_IMODE(info.st_mode))}
    except OSError as error:
        kill = {'status': 'UNOBSERVED', 'reason': type(error).__name__}
    return {'path': str(path), 'values': values, 'killFile': kill}


def observe(run=command, root=CGROOT, snapshot=group_snapshot, uid=None):
    uid = os.getuid() if uid is None else uid
    host = os.uname()
    prefix = ['systemctl', '--system', '--no-pager']
    version = run(['systemctl', '--version'])
    # 版表示の最初の行だけを保存する。
    if version.get('status') == 'OBSERVED':
        version['stdout'] = version['stdout'].splitlines()[0] if version['stdout'] else ''
    state = run(prefix + ['is-system-running'])
    service = run(prefix + ['show', f'user@{uid}.service',
                            '--property=ControlGroup', '--property=ActiveState', '--property=Delegate'])
    delegated = {'status': 'UNOBSERVED'}
    if service.get('status') == 'OBSERVED' and service.get('exitCode') == 0:
        props = {}
        for line in service['stdout'].splitlines():
            key, separator, value = line.partition('=')
            if separator and key in ('ControlGroup', 'ActiveState', 'Delegate'):
                if key in props:
                    raise ValueError('DUPLICATE-PROPERTY')
                props[key] = value
        if props.get('ControlGroup'):
            try:
                delegated = snapshot(selected_group(root, props['ControlGroup']))
            except ValueError as error:
                delegated = {'status': 'UNOBSERVED', 'reason': str(error)}
    return {'evidenceClass': 'READ-ONLY-SELECTED-PARENT-HOST-OBSERVATION',
            'architecture': host.machine, 'kernelRelease': host.release, 'uid': uid,
            'systemdVersion': version, 'systemState': state, 'userService': service,
            'rootCgroup': snapshot(root), 'selectedUserCgroup': delegated,
            'observationAtomic': False, 'privilegedOperationsTested': False,
            'killFileOpened': False, 'limitsWritten': False,
            'networkIsolationTested': False, 'mutationsPerformed': False,
            'runnerExecuted': False, 'scientificSeedsRead': 0,
            'wholeLifecycleOsProven': False, 'scientificExecutionAuthorized': False}


if __name__ == '__main__':
    print(json.dumps(observe(), ensure_ascii=False, indent=2))
