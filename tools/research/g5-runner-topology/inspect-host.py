"""現在の実行環境の親scope候補を読取りだけで観察する。配備・認可はしない。"""
import json
import os
from pathlib import Path


def inspect():
    cgroup = Path('/sys/fs/cgroup')
    controllers = cgroup / 'cgroup.controllers'
    unified = controllers.is_file()
    readonly = bool(os.statvfs(cgroup).f_flag & os.ST_RDONLY) if cgroup.exists() else None
    pid1 = Path('/proc/1/comm').read_text().strip()
    return {'evidenceClass': 'READ-ONLY-HOST-OBSERVATION',
            'pid1Comm': pid1, 'systemdBooted': Path('/run/systemd/system').is_dir(),
            'cgroupV2Mounted': unified,
            'memoryControllerPresent': 'memory' in controllers.read_text().split() if unified else False,
            'cgroupMountReadOnly': readonly,
            'cgroupRootWritableByObserver': os.access(cgroup, os.W_OK),
            'dedicatedDelegationInspected': False,
            'runnerInstallationInspected': False,
            'mutationsPerformed': False, 'scientificSeedsRead': 0,
            'parentRunnerEnvironmentConfirmed': False,
            'wholeLifecycleOsProven': False, 'scientificExecutionAuthorized': False}


if __name__ == '__main__':
    print(json.dumps(inspect(), ensure_ascii=False, indent=2))
