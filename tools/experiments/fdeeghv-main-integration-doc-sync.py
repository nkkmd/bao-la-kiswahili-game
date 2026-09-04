from pathlib import Path
import os, subprocess

ROOT = Path('.')
INTEGRATED_TIP = '03d1b5bf28ed45aaa9480f0a7c5efc6d394fcbae'
PREVIOUS_MAIN = 'e537199a959c0808cbef6cf8aaeb1caab91e3702'
RESULT_SHA = '5cfaffe66b8b2a2bf710c6acbc28cfa714bc4bab5dd48b8cae8b50ef42162bd9'
PROGRAM_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac'
INTEGRATION = f'COMPLETE / FAST-FORWARD / source tip {INTEGRATED_TIP} / previous main {PREVIOUS_MAIN} / force=false'

# Fail closed on scientific/historical identity.
plan_blob = subprocess.check_output(['git','hash-object','doc/research-generation-3/PROGRAM_PLAN.md'], text=True).strip()
assert plan_blob == PROGRAM_PLAN_BLOB, (plan_blob, PROGRAM_PLAN_BLOB)
formal = (ROOT/'doc/fresh-depth10-exact-geometry-holdout/results/stage-1/STAGE_1_FORMAL_RESULT.json').read_text()
assert RESULT_SHA in formal
assert subprocess.run(['git','merge-base','--is-ancestor',INTEGRATED_TIP,'HEAD']).returncode == 0

files = [
    'README.md',
    'doc/RESEARCH_INDEX.md',
    'doc/FUTURE_RESEARCH_AGENDA.md',
    'doc/research-generation-3/README.md',
    'doc/research-generation-3/CURRENT_STATUS.md',
    'doc/fresh-depth10-exact-geometry-holdout/README.md',
    'doc/fresh-depth10-exact-geometry-holdout/CURRENT_STATUS.md',
    'doc/fresh-depth10-exact-geometry-holdout/STUDY_1_FINAL_REPORT.md',
    'doc/fresh-depth10-exact-geometry-holdout/DECISION_REGISTER.md',
    'doc/fresh-depth10-exact-geometry-holdout/REPRODUCIBILITY_INDEX.md',
]

replacements = [
    ('G3-11 MAIN INTEGRATION NOT AUTHORIZED-NOT PERFORMED', 'G3-11 MAIN INTEGRATION COMPLETE / FAST-FORWARD'),
    ('G3-11 main integration NOT AUTHORIZED-NOT PERFORMED', 'G3-11 main integration COMPLETE FAST-FORWARD'),
    ('G3-11 main integration = NOT AUTHORIZED / NOT PERFORMED', f'G3-11 main integration = {INTEGRATION}'),
    ('Main integration = NOT AUTHORIZED / NOT PERFORMED', f'Main integration = {INTEGRATION}'),
    ('main integration = NOT AUTHORIZED / NOT PERFORMED', f'main integration = {INTEGRATION}'),
    ('G3-11 main integrationは未承認・未実施', f'G3-11 main integrationは`{INTEGRATION}`'),
    ('main integrationは未承認・未実施', f'main integrationは`{INTEGRATION}`'),
    ('G3-11のmain integrationは`NOT AUTHORIZED / NOT PERFORMED`。', f'G3-11のmain integrationは`{INTEGRATION}`として完了した。'),
    ('科学的closureと`main` integrationは別gateであり、main統合は未承認・未実施である。', f'科学的closureと`main` integrationは別gateであり、2026-09-04の明示的ユーザー指示に基づきmain統合は`{INTEGRATION}`として完了した。'),
    ('`main` integrationは科学的closureとは別操作であり、明示的ユーザー指示があるまで`NOT AUTHORIZED / NOT PERFORMED`を維持する。', f'`main` integrationは科学的closureとは別操作であり、2026-09-04の明示的ユーザー指示に基づき`{INTEGRATION}`として完了した。'),
]

changed = []
for rel in files:
    p = ROOT/rel
    text = p.read_text()
    original = text
    for a,b in replacements:
        text = text.replace(a,b)
    # Current-facing G3-11 docs must no longer present integration as pending.
    if rel.startswith('doc/fresh-depth10-exact-geometry-holdout/') or rel in {'README.md','doc/RESEARCH_INDEX.md','doc/FUTURE_RESEARCH_AGENDA.md','doc/research-generation-3/README.md','doc/research-generation-3/CURRENT_STATUS.md'}:
        text = text.replace('G3-11のmain integrationは未承認・未実施', f'G3-11のmain integrationは`{INTEGRATION}`として完了')
    if text != original:
        p.write_text(text)
        changed.append(rel)

assert changed, 'no documents changed'

# Ensure current-facing G3-11 documents do not retain the pre-integration state.
for rel in files:
    text = (ROOT/rel).read_text()
    bad = [
        'G3-11 main integration = NOT AUTHORIZED / NOT PERFORMED',
        'G3-11 main integration NOT AUTHORIZED-NOT PERFORMED',
        'G3-11 main integrationは未承認・未実施',
    ]
    assert not any(x in text for x in bad), (rel, [x for x in bad if x in text])

checkpoint = ROOT/'doc/research-generation-3/checkpoints/2026-09-04-g3-11-main-integration-complete.md'
checkpoint.write_text(f'''# G3-11 main integration complete — 2026-09-04

## Integration

```text
Study = FDEGHV-STUDY1
Program position = Research Generation 3 / G3-11
scientific lifecycle = CLOSED / FORMAL-COMPLETE
formal domain decision = EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN
H1..H4 = all DEEPER-CONFIRMED
previous main = {PREVIOUS_MAIN}
integrated research tip = {INTEGRATED_TIP}
operation = FAST-FORWARD
force = false
user authorization = EXPLICIT / 2026-09-04
```

The integration operation changes repository state only. It does not recompute or reinterpret scientific evidence.

## Immutable scientific identity

```text
canonical scientific-result-core SHA-256 = {RESULT_SHA}
protected depth-10 = CONSUMED EXACTLY ONCE
same-evidence rerun = NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
G2-12 estimator scientific input = NOT USED / NOT AUTHORIZED
```

Historical `doc/research-generation-3/PROGRAM_PLAN.md` remains unchanged at Git blob `{PROGRAM_PLAN_BLOB}`.

Current-facing documentation was synchronized after the fast-forward so that repository integration state is no longer shown as pending. Historical pre-integration closure/audit records remain unchanged as chronology records.
''')

# Remove temporary integration-sync machinery in the same bookkeeping commit.
for rel in ['tools/experiments/fdeeghv-main-integration-doc-sync.py', '.github/workflows/fdeeghv-main-integration-doc-sync.yml']:
    p = ROOT/rel
    if p.exists():
        p.unlink()

print('changed:', *changed, sep='\n- ')
print('checkpoint:', checkpoint)
