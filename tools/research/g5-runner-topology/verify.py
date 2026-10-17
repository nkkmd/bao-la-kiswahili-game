"""保存した公式runnerソースと既存jobのログを照合する。runnerを実行しない。"""
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[3]
DOC = ROOT / 'doc/research-generation-5/runner-topology-20261017'
MANIFEST_SHA = 'b9b32f0de6edc80d1cb506aae86be6046dfffd70d1c57c2c62e95322e6d3b398'
SOURCE = '397b032cbf865e9c3ddfab89d533ec19325e1273'
VERSION = '2.337.0'


def require(condition, reason):
    if not condition:
        raise ValueError(reason)


def unique_line(text, anchor):
    lines = text.splitlines()
    matches = [i + 1 for i, line in enumerate(lines) if anchor in line]
    require(len(matches) == 1, 'SOURCE-ANCHOR-NOT-UNIQUE:' + anchor)
    return matches[0]


def observed_order(log):
    version = unique_line(log, "Current runner version: '" + VERSION + "'")
    checkout_download = unique_line(log, "Download action repository 'actions/checkout@v4'")
    node_download = unique_line(log, "Download action repository 'actions/setup-node@v4'")
    first_step = unique_line(log, '##[group]Run actions/checkout@v4')
    require(version < checkout_download < first_step and version < node_download < first_step,
            'OBSERVED-DOWNLOAD-ORDER-MISMATCH')
    return {'runnerVersionLine': version, 'checkoutDownloadLine': checkout_download,
            'nodeDownloadLine': node_download, 'firstCheckoutStepLine': first_step}


def verify(doc=DOC):
    manifest_bytes = (doc / 'INPUT_MANIFEST.json').read_bytes()
    require(hashlib.sha256(manifest_bytes).hexdigest() == MANIFEST_SHA, 'MANIFEST-HASH-MISMATCH')
    manifest = json.loads(manifest_bytes)
    require(manifest['sourceCommit'] == SOURCE and manifest['sourceTag'] == 'v' + VERSION, 'SOURCE-REF-MISMATCH')
    for name, info in manifest['files'].items():
        relative = Path(name)
        require(not relative.is_absolute() and '..' not in relative.parts, 'UNSAFE-INPUT-PATH')
        file = doc / relative
        require(not file.is_symlink(), 'SYMLINK-INPUT')
        data = file.read_bytes()
        require(len(data) == info['bytes'] and hashlib.sha256(data).hexdigest() == info['sha256'],
                'INPUT-HASH-MISMATCH:' + name)
    observer = manifest['hostObserver']
    require(observer['path'] == 'tools/research/g5-runner-topology/inspect-host.py', 'OBSERVER-PATH-MISMATCH')
    require(hashlib.sha256((ROOT / observer['path']).read_bytes()).hexdigest() == observer['sha256'], 'OBSERVER-HASH-MISMATCH')
    observation = json.loads((doc / 'evidence/LOCAL_HOST_OBSERVATION.json').read_bytes())
    require(observation['evidenceClass'] == 'READ-ONLY-HOST-OBSERVATION'
            and observation['systemdBooted'] is False and observation['cgroupMountReadOnly'] is True
            and observation['mutationsPerformed'] is False
            and observation['scientificExecutionAuthorized'] is False, 'SAVED-HOST-OBSERVATION-MISMATCH')
    origin = json.loads((doc / 'SOURCE_ORIGIN.json').read_bytes())
    require(origin['commit'] == SOURCE and origin['tag'] == 'v' + VERSION and origin['observedVersion'] == VERSION,
            'RUNNER-VERSION-MISMATCH')
    for info in origin['files']:
        data = (doc / 'upstream' / info['path']).read_bytes()
        blob = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
        require(blob == info['blob'], 'UPSTREAM-GIT-BLOB-MISMATCH')
    source = doc / 'upstream/src/Runner.Worker'
    extension = (source / 'JobExtension.cs').read_text()
    runner = (source / 'JobRunner.cs').read_text()
    manager = (source / 'ActionManager.cs').read_text()
    prepare = unique_line(extension, 'var prepareResult = await actionManager.PrepareActionsAsync(context, message.Steps);')
    hook = unique_line(extension, 'var startedHookPath = Environment.GetEnvironmentVariable("ACTIONS_RUNNER_HOOK_JOB_STARTED");')
    container = unique_line(extension, 'preJobSteps.AddRange(prepareResult.ContainerSetupSteps);')
    initialize = unique_line(runner, 'jobSteps = await jobExtension.InitializeJob(jobContext, message);')
    steps = unique_line(runner, 'await stepsRunner.RunAsync(jobContext);')
    require(prepare < hook < container and initialize < steps, 'RUNNER-PREPARATION-ORDER-MISMATCH')
    require(manager.count('await DownloadRepositoryActionAsync(executionContext, downloadInfo);') == 2,
            'DOWNLOADER-CALL-PATH-CHANGED')
    start = manager.index('private async Task DownloadRepositoryArchive(')
    downloader = manager[start:]
    retry = unique_line(downloader, 'while (retryCount < 3)')
    no_backoff = unique_line(downloader, 'Environment.GetEnvironmentVariable("_GITHUB_ACTION_DOWNLOAD_NO_BACKOFF")')
    require(retry < no_backoff and 'retryCount++;' in downloader, 'DOWNLOADER-RETRY-STRUCTURE-CHANGED')
    log = (doc / 'evidence/CHECKPOINT_JOB.log').read_text(encoding='utf-8-sig')
    order = observed_order(log)
    job = json.loads((doc / 'evidence/JOB_METADATA.json').read_bytes())
    run = json.loads((doc / 'evidence/RUN_METADATA.json').read_bytes())
    require((job['id'], job['run_id'], job['status'], job['conclusion']) ==
            (117281084211, 38993598222, 'completed', 'success'), 'JOB-METADATA-MISMATCH')
    require((run['id'], run['run_attempt'], run['event'], run['head_sha'], run['conclusion']) ==
            (38993598222, 1, 'pull_request', '3b345d697cc1b043902c3569fdf5b55af895116b', 'success'),
            'RUN-METADATA-MISMATCH')
    return {'decision': 'PARENT-RUNNER-SCOPE-REQUIRED-NOT-PROVEN',
            'runnerSourceCommit': SOURCE, 'observedRunnerVersion': VERSION,
            'sourceEvidence': {'prepareActionsLine': prepare, 'jobStartedHookRegistrationLine': hook,
                               'containerSetupRegistrationLine': container,
                               'initializeJobLine': initialize, 'runStepsLine': steps},
            'observedJob': {'runId': run['id'], 'jobId': job['id'], 'attempt': run['run_attempt'], **order},
            'jobHookCoversInitialActionDownloads': False,
            'jobContainerAloneCoversInitialActionDownloads': False,
            'retryPossibleInPinnedActionDownloader': True,
            'observedRetryExecutionClaimed': False,
            'runnerBinaryIdentityProvenByVersionString': False,
            'parentRunnerEnvironmentConfirmed': False,
            'wholeLifecycleOsProven': False, 'scientificSeedsRead': 0,
            'scientificExecutionAuthorized': False}


if __name__ == '__main__':
    require(sys.flags.optimize == 0, 'OPTIMIZATION-REFUSED')
    print(json.dumps(verify(), ensure_ascii=False, indent=2))
