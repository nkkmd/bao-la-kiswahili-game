"""保存済みG5-05だけを読み、rootとscreen子の重複除外の影響を監査する。"""
from pathlib import Path
import gzip, hashlib, json, sys
BASE = Path(__file__).resolve().parents[3]
DOC = BASE / 'doc/research-generation-5'
def read(path):
    return json.loads(path.read_bytes())
def audit():
    path = DOC / 'g5-05/results/EVIDENCE.json.gz'
    data = path.read_bytes()
    result = read(DOC / 'g5-05/results/RESULT.json')
    assert hashlib.sha256(data).hexdigest() == result['evidenceGzipSha256']
    e = json.loads(gzip.decompress(data))
    fixed = set(e['technicalFirewall']) | set(e['priorReadFirewall'])
    old, contract, strict = set(fixed), set(fixed), set(fixed)
    old_selected, contract_selected, strict_selected, differences = [], [], [], []
    contract_accepted = 0
    accepted_screens = []
    for n, s in enumerate(e['sources']):
        last = s['lastEligible']
        regular = s['stop'] in ('NATURAL-TERMINAL', 'PLY-LIMIT')
        ids = set([last['raw']] + [b['to'] for b in last['screen']['branches']]) if last else set()
        old_accept = bool(regular and last and not (ids & old))
        contract_accept = bool(regular and last and not (ids & contract))
        strict_accept = bool(regular and last and not (ids & strict))
        assert old_accept == (s['candidate'] is not None)
        if old_accept:
            old.add(last['raw'])
            if len(old_selected) < 8: old_selected.append(n)
        assert contract_accept == old_accept
        if contract_accept:
            contract.add(last['raw'])
            contract_accepted += 1
            if len(contract_selected) < 8: contract_selected.append(n)
        if strict_accept:
            strict.update(ids)
            accepted_screens.append((n, ids))
            if len(strict_selected) < 8: strict_selected.append(n)
        if old_accept != strict_accept:
            differences.append({'sourceIndex': n, 'historicalAccepted': old_accept, 'hypotheticalStrongerPolicyAccepted': strict_accept})
    assert old_selected == [c['sourceIndex'] for c in e['selectedCandidates']]
    assert len(e['sources']) == 64
    return {'auditId': 'G5-05-SAVED-OVERLAP-AUDIT-20261015', 'evidenceSha256': hashlib.sha256(data).hexdigest(),
        'sourcesChecked': len(e['sources']), 'historicalAcceptedCount': sum(s['candidate'] is not None for s in e['sources']),
        'contractAcceptedCount': contract_accepted, 'hypotheticalStrongerPolicyAcceptedCount': len(accepted_screens), 'historicalSelectedSourceIndices': old_selected,
        'contractSelectedSourceIndices': contract_selected, 'hypotheticalStrongerPolicySelectedSourceIndices': strict_selected, 'hypotheticalStrongerPolicySelectionDifferences': differences,
        'contractSha256': hashlib.sha256((DOC / 'g5-05/CONTRACT.md').read_bytes()).hexdigest(),
        'contractRule': 'CHECK-ROOT-AND-CHILDREN-AGAINST-PRIOR-ROOTS-ADD-ACCEPTED-ROOT-ONLY',
        'implementationDefectEstablished': False,
        'selectedEightUnchanged': old_selected == strict_selected,
        'newScientificSeedsRead': 0, 'transitionsGenerated': 0, 'oldExecutionRepeated': False}
if __name__ == '__main__':
    value = audit()
    if '--check' in sys.argv:
        assert value == read(DOC / 'resume-audit-20261015/RESULT.json')
    print(json.dumps(value, ensure_ascii=False, indent=2))
