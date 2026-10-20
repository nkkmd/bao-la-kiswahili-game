"""shell経路の限定判断を固定ソースだけから再計算する。実行・通信はしない。"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DOC = ROOT / 'doc/research-generation-5/runner-topology-20261017'
ORIGIN_SHA = '3437f1486ee5c89f92842ce0b4fa4323244d0fb3359f2d14f6901df422f9f765'
ACTION_SHA = '084a98970ed891514c6dc9a6a28c5d12d987ef54e60695f5c11edd5d96a546fd'


def anchor(text, value):
    lines = [i + 1 for i, line in enumerate(text.splitlines()) if value in line]
    if len(lines) != 1:
        raise ValueError('SOURCE-ANCHOR')
    return lines[0]


def verify(doc=DOC):
    folder = doc / 'shell-route-20261020'
    raw = (folder / 'SOURCE_ORIGIN.json').read_bytes()
    if hashlib.sha256(raw).hexdigest() != ORIGIN_SHA:
        raise ValueError('ORIGIN-HASH')
    origin = json.loads(raw)
    sources = {}
    for row in origin['files']:
        data = (folder / 'upstream' / row['path']).read_bytes()
        if len(data) != row['bytes'] or hashlib.sha256(data).hexdigest() != row['sha256']:
            raise ValueError('SOURCE-HASH')
        if hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest() != row['gitBlob']:
            raise ValueError('SOURCE-GIT-BLOB')
        sources[Path(row['path']).name] = data.decode('utf-8-sig')
    if hashlib.sha256((folder / 'upstream/LICENSE').read_bytes()).hexdigest() != origin['licenseSha256']:
        raise ValueError('LICENSE-HASH')
    actions = (doc / 'upstream/src/Runner.Worker/ActionManager.cs').read_bytes()
    if hashlib.sha256(actions).hexdigest() != ACTION_SHA:
        raise ValueError('ACTION-SOURCE-HASH')
    evidence = {'runnerListenerChoiceLine': anchor(sources['Runner.cs'], 'if (settings.UseV2Flow)'),
                'scriptExecutionLine': anchor(actions.decode('utf-8-sig'), 'definition.Data.Execution = new ScriptActionExecutionData();')}
    for name in ('MessageListener.cs', 'BrokerMessageListener.cs'):
        s = sources[name]
        evidence[name] = {
            'createSessionLine': anchor(s, 'public async Task<CreateSessionResult> CreateSessionAsync('),
            'createSessionRetryDelayLine': anchor(s, 'await HostContext.Delay(_sessionCreationRetryInterval, token);'),
            'getNextMessageLine': anchor(s, 'public async Task<TaskAgentMessage> GetNextMessageAsync('),
            'sessionRecoveryGuardLine': anchor(s, '!_settings.SkipSessionRecover &&'),
            'retryClassifierLine': anchor(s, 'private bool IsGetNextMessageExceptionRetriable(')}
    return {'decision': 'SHELL-ONLY-NOT-SUFFICIENT-FOR-FAIL-FIRST-COMMUNICATION',
            'sourceCommit': origin['sourceCommit'], 'sourceEvidence': evidence,
            'normalAndBrokerListenersHaveRetryPaths': True,
            'scriptReferenceHasSeparateExecutionData': True,
            'allJobPathsAudited': False, 'allLowerHttpRetriesAudited': False,
            'runOnceProvesCommunicationRetryDisabled': False,
            'skipSessionRecoverProvesAllRetriesDisabled': False,
            'retryObservedInExistingJobClaimed': False,
            'additionalFailFirstControlRequired': True,
            'additionalControlImplemented': False, 'shellOnlyRouteCertified': False,
            'nextStep': 'REVIEW-FAIL-FIRST-CONTROL-DESIGN-NO-DEPLOYMENT',
            'wholeLifecycleOsProven': False, 'scientificSeedsRead': 0,
            'scientificExecutionAuthorized': False}


if __name__ == '__main__':
    print(json.dumps(verify(), ensure_ascii=False, indent=2))
