from pathlib import Path
import hashlib
import json
import subprocess

EXPECTED_PROGRAM_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac'
FILES = [
    Path('doc/research-generation-3/README.md'),
    Path('doc/research-generation-3/CURRENT_STATUS.md'),
    Path('doc/FUTURE_RESEARCH_AGENDA.md'),
    Path('doc/RESEARCH_INDEX.md'),
]
PROGRAM_PLAN = Path('doc/research-generation-3/PROGRAM_PLAN.md')


def blob(path):
    return subprocess.check_output(['git', 'hash-object', str(path)], text=True).strip()


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def replace_exact(path, old, new):
    text = path.read_text(encoding='utf-8')
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{path}: expected one exact occurrence, got {count}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')


def mutate():
    for path in [Path('doc/research-generation-3/README.md'), Path('doc/research-generation-3/CURRENT_STATUS.md')]:
        replace_exact(
            path,
            'Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ',
            'Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ / NOT PEEKED',
        )

    replace_exact(
        Path('doc/FUTURE_RESEARCH_AGENDA.md'),
        'same-evidence selector repair/rerunを行わず、G3-07を実施する場合はseparate post-G3-06 current-state authorization reviewを必要とする。protected depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ`のまま。',
        'same-evidence selector repair/rerunを行わない。**G3-06 closure時点では**G3-07の実施にseparate post-G3-06 current-state authorization reviewを必要とした。そのreviewは後に完了し、G3-07も現在は独立Studyとして`CLOSED / FORMAL-COMPLETE`である。protected depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`のまま。',
    )

    replace_exact(
        Path('doc/RESEARCH_INDEX.md'),
        '**Boundary:** G3-06 technical-invalid provenanceをG3-07以降のpositive/negative mechanism evidenceへ昇格させない。G3-07を実施する場合はseparate post-G3-06 current-state authorization reviewを必要とする。',
        '**Boundary:** G3-06 technical-invalid provenanceをG3-07以降のpositive/negative mechanism evidenceへ昇格させない。**G3-06 closure時点では**G3-07の実施にseparate post-G3-06 current-state authorization reviewを必要とした。そのreviewは後に完了し、G3-07は独立Studyとして`CLOSED / FORMAL-COMPLETE`である。',
    )


def verify():
    if blob(PROGRAM_PLAN) != EXPECTED_PROGRAM_PLAN_BLOB:
        raise RuntimeError('historical PROGRAM_PLAN changed')
    rr = Path('doc/research-generation-3/README.md').read_text(encoding='utf-8')
    rs = Path('doc/research-generation-3/CURRENT_STATUS.md').read_text(encoding='utf-8')
    agenda = Path('doc/FUTURE_RESEARCH_AGENDA.md').read_text(encoding='utf-8')
    index = Path('doc/RESEARCH_INDEX.md').read_text(encoding='utf-8')
    for label, text in [('rg3_readme', rr), ('rg3_status', rs)]:
        if 'Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ / NOT PEEKED' not in text:
            raise RuntimeError(f'{label}: protected holdout top line incomplete')
    if '**G3-06 closure時点では**G3-07の実施' not in agenda:
        raise RuntimeError('agenda: G3-06 historical boundary missing')
    if '**G3-06 closure時点では**G3-07の実施' not in index:
        raise RuntimeError('index: G3-06 historical boundary missing')
    if 'G3-08 NOT AUTHORIZED' not in agenda:
        raise RuntimeError('agenda: G3-08 current boundary missing')
    return {
        'verified': True,
        'programPlanBlob': blob(PROGRAM_PLAN),
        'files': {str(p): {'gitBlob': blob(p), 'sha256': sha256(p)} for p in FILES},
        'protectedDepth10': 'SEALED-NOT-GENERATED-NOT-READ-NOT-PEEKED',
        'g306Boundary': 'HISTORICAL-CLOSURE-TIME-QUALIFIED',
        'g308': 'NOT-AUTHORIZED',
        'mainIntegration': 'NOT-PERFORMED-EXPLICIT-USER-INSTRUCTION-REQUIRED',
    }


def main():
    import sys
    if '--verify-only' not in sys.argv:
        mutate()
    print(json.dumps(verify(), ensure_ascii=False, separators=(',', ':')))


if __name__ == '__main__':
    main()
