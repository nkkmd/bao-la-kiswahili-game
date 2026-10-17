"""PR #208の保存証拠から全工程の未成立範囲を抽出する。実行器ではない。"""
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DOC = ROOT / 'doc/research-generation-5/befcs-capsule-20261016'


def coverage(result):
    # 凍結済み第208号の結果だけを解釈する。将来の真偽値を自動承認しない。
    for key in ('externalBootstrapCovered', 'postSealTransportJournalInsideImage',
                'actionsArtifactUploadCovered', 'wholeLifecycleOsProven',
                'scientificExecutionAuthorized', 'finalScientificInputSet'):
        if result.get(key) is not False:
            raise ValueError('UNREVIEWED-COVERAGE-CHANGE:' + key)
    if type(result.get('scientificSeedsRead')) is not int or result['scientificSeedsRead'] != 0:
        raise ValueError('SCIENTIFIC-READ-NOT-ZERO')
    mode = result['mode']
    if mode not in ('complete', 'ack-loss'):
        raise ValueError('UNKNOWN-CASE')
    ack = result['remote']['acknowledged']
    if ack is not (mode == 'complete'):
        raise ValueError('ACK-BOUNDARY-CHANGED')
    if (result['finished'] is not None) != ack:
        raise ValueError('FINISH-BOUNDARY-CHANGED')
    return {'mode': mode, 'inScopeElapsedMs': result['elapsedMs'],
            'inScopeMemoryPeakBytes': result['memoryPeakBytes'],
            'inScopePreResultChargedBytes': result['chargedBytes'],
            'inScopeFinalChargedBytes': None,
            'inRunArchiveAcknowledged': ack,
            'wholeLifecycleElapsedMs': None, 'wholeLifecycleMemoryPeakBytes': None,
            'wholeLifecycleStoragePeakBytes': None,
            'postSealJournalInMeasuredService': True,
            'postSealJournalInSealedImage': False,
            'postSealJournalDurableWithinWholeLifecycle': None}


def audit():
    spec = importlib.util.spec_from_file_location('capsule', Path(__file__).with_name('verify-capsule.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    verified = module.verify()  # 原ZIP、全image、Git object、固定workflowを先に検算する。
    cases = [coverage(json.loads((DOC / 'results' / mode / 'RESULT.json').read_bytes()))
             for mode in ('complete', 'ack-loss')]
    return {'decision': 'WHOLE-LIFECYCLE-READINESS-NOT-MET',
            'sourceRunId': 38850453567, 'sourceAttempt': 1,
            'verifiedEvidenceDecision': verified['decision'], 'cases': cases,
            'blockers': ['OUTER-BOOTSTRAP-AND-ACTIONS-PREPARATION-OUTSIDE-SCOPE',
                         'ARTIFACT-UPLOAD-AND-RECEIPT-OUTSIDE-SCOPE',
                         'NO-COMBINED-CLOCK-MEMORY-STORAGE-ENFORCEMENT-EVIDENCE',
                         'POST-SEAL-CONTROL-DURABILITY-NOT-ESTABLISHED-IN-WHOLE-LIFECYCLE'],
            'wholeLifecycleOsProven': False, 'scientificExecutionAuthorized': False,
            'scientificSeedsRead': 0,
            'interpretation': 'SAVED-EVIDENCE-COVERAGE-ONLY-NOT-NEW-OS-PROOF'}


if __name__ == '__main__':
    print(json.dumps(audit(), ensure_ascii=False, indent=2))
