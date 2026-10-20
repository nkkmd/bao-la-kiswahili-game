"""保存ソースと未実装の設計判断を照合する。guardを実装・起動するものではない。"""
import hashlib
import json
from pathlib import Path

DOC = Path(__file__).resolve().parents[3] / 'doc/research-generation-5/runner-topology-20261017/fail-first-20261020'
ORIGIN_SHA = 'e1630a1bbf5aaed9193adc904f961dfa25e2b3b2e1e563b5b9bd723c7c03cee5'


def lines(text, needle):
    result = [i + 1 for i, line in enumerate(text.splitlines()) if needle in line]
    if not result:
        raise ValueError('SOURCE-ANCHOR')
    return result


def verify(doc=DOC):
    raw = (doc / 'SOURCE_ORIGIN.json').read_bytes()
    if hashlib.sha256(raw).hexdigest() != ORIGIN_SHA:
        raise ValueError('ORIGIN-HASH')
    origin = json.loads(raw)
    sources = {}
    for row in origin['files']:
        data = (doc / 'upstream' / row['path']).read_bytes()
        blob = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
        if len(data) != row['bytes'] or hashlib.sha256(data).hexdigest() != row['sha256'] or blob != row['gitBlob']:
            raise ValueError('SOURCE-HASH')
        sources[Path(row['path']).name] = data.decode('utf-8-sig')
    if hashlib.sha256((doc / 'upstream/LICENSE').read_bytes()).hexdigest() != origin['licenseSha256']:
        raise ValueError('LICENSE-HASH')
    evidence = {
        'helperClampLines': lines(sources['VssUtil.cs'], 'settings.MaxRetryRequest = Math.Min(Math.Max(maxRetryRequest, 3), 10);'),
        'retryPipelineInsertionLines': lines(sources['VssConnection.cs'], 'delegatingHandlers = delegatingHandlers.Concat('),
        'retryHandlerAttemptCountLines': lines(sources['VssHttpRetryMessageHandler.cs'], 'Int32 maxAttempts = retryOptions.MaxRetries + 1;'),
        'authHandlerSendLines': lines(sources['VssHttpMessageHandler.cs'], 'response = await m_messageInvoker.SendAsync('),
        'authHandlerLoopLines': lines(sources['VssHttpMessageHandler.cs'], 'while (retries >= 0);'),
        'brokerRequestWrapperLines': lines(sources['BrokerServer.cs'], 'var brokerSession = RetryRequest<TaskAgentMessage>(')}
    return {'decision': 'INNER-REQUEST-GUARD-DESIGN-CANDIDATE-NOT-IMPLEMENTED',
            'sourceCommit': origin['sourceCommit'], 'sourceEvidence': evidence,
            'environmentZeroAloneProvesNoRetry': False,
            'listenerPatchAloneProvesNoRetry': False,
            'outerHandlerAloneProvesNoRetry': False,
            'selectedDesignCandidate': 'SOURCE-CONTROLLED-INNER-REQUEST-GUARD',
            'controlImplemented': False, 'atomicAdmissionProven': False,
            'allClientsAndInnerTransportAudited': False, 'allResourcesAccounted': False,
            'knownDataIntegrationStarted': False, 'wholeLifecycleOsProven': False,
            'scientificSeedsRead': 0, 'scientificExecutionAuthorized': False}


if __name__ == '__main__':
    print(json.dumps(verify(), ensure_ascii=False, indent=2))
