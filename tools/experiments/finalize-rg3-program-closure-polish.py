from pathlib import Path
import json
import subprocess
import sys

ROOT = Path('.')
EXPECTED_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac'
FINAL_AUDIT = Path('doc/research-generation-3/checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md')
TEMP_PATHS = [
    Path('.github/workflows/rg3-program-closure-final-polish.yml'),
    Path('tools/experiments/finalize-rg3-program-closure-polish.py'),
    Path('doc/research-generation-3/authorizations/rg3-program-closure-final-polish-trigger.txt'),
]
EXPECTED_FINAL_DIFF = {
    'README.md',
    'doc/FUTURE_RESEARCH_AGENDA.md',
    'doc/RESEARCH_INDEX.md',
    'doc/research-generation-3/CURRENT_STATUS.md',
    'doc/research-generation-3/FINAL_SYNTHESIS.md',
    'doc/research-generation-3/PROGRAM_FINAL_RESULT.json',
    'doc/research-generation-3/README.md',
    'doc/research-generation-3/checkpoints/2026-09-04-program-closure-central-sync-complete.md',
    'doc/research-generation-3/checkpoints/2026-09-04-research-generation-3-final-repository-document-consistency-pass.md',
    'doc/research-generation-3/checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md',
    'doc/research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md',
    'doc/research-program-decisions/2026-09-04-research-generation-3-program-closure.md',
}


def read(path):
    return Path(path).read_text(encoding='utf-8')


def write(path, text):
    Path(path).write_text(text, encoding='utf-8')


def replace_once(path, old, new):
    text = read(path)
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f'{path}: expected exactly one occurrence, got {count}: {old!r}')
    write(path, text.replace(old, new, 1))


def insert_after_once(path, anchor, addition):
    text = read(path)
    if addition.strip() in text:
        return
    count = text.count(anchor)
    if count != 1:
        raise RuntimeError(f'{path}: expected exactly one anchor, got {count}: {anchor!r}')
    write(path, text.replace(anchor, anchor + addition, 1))


def git(*args):
    return subprocess.check_output(['git', *args], text=True).strip()


def polish():
    # RG3 README: remove the duplicate CURRENT_STATUS entry left after generation-level read-first insertion.
    replace_once(
        'doc/research-generation-3/README.md',
        '- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing program state\n',
        ''
    )

    read_first_anchor = (
        '- [`../research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md`]'
        '(../research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md)'
        ' — post-G3-12 closure authorization review\n'
    )
    read_first_addition = (
        '- [`checkpoints/2026-09-04-program-closure-central-sync-complete.md`]'
        '(checkpoints/2026-09-04-program-closure-central-sync-complete.md)'
        ' — generation-level central documentation synchronization record\n'
        '- [`checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md`]'
        '(checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md)'
        ' — final pre-main repository/document consistency audit after documentation polish\n'
    )
    insert_after_once('doc/research-generation-3/README.md', read_first_anchor, read_first_addition)

    # CURRENT_STATUS: make repository-closure completion explicit and link the operational closure records.
    replace_once(
        'doc/research-generation-3/CURRENT_STATUS.md',
        'Program final result = COMPLETE\nScientific execution authorized by closure = none\n',
        'Program final result = COMPLETE\n'
        'Central documentation synchronization = COMPLETE\n'
        'Final pre-main documentation consistency audit = PASS\n'
        'Temporary closure write-capable tooling = REMOVED\n'
        'Scientific execution authorized by closure = none\n'
    )
    current_anchor = '- `../research-program-decisions/2026-09-04-research-generation-3-program-closure.md`\n'
    current_addition = (
        '- `checkpoints/2026-09-04-program-closure-central-sync-complete.md`\n'
        '- `checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md`\n'
    )
    insert_after_once('doc/research-generation-3/CURRENT_STATUS.md', current_anchor, current_addition)

    # RESEARCH_INDEX: expose operational closure and final consistency records at the generation-level entry.
    index_anchor = (
        '- [`research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md`]'
        '(research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md)\n'
    )
    index_addition = (
        '\n**Repository closure / consistency:**\n\n'
        '- [`research-generation-3/checkpoints/2026-09-04-program-closure-central-sync-complete.md`]'
        '(research-generation-3/checkpoints/2026-09-04-program-closure-central-sync-complete.md)\n'
        '- [`research-generation-3/checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md`]'
        '(research-generation-3/checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md)\n'
    )
    insert_after_once('doc/RESEARCH_INDEX.md', index_anchor, index_addition)

    # PROGRAM_FINAL_RESULT: normalize completion-condition key naming and record repository-closure state.
    p = Path('doc/research-generation-3/PROGRAM_FINAL_RESULT.json')
    data = json.loads(p.read_text(encoding='utf-8'))
    cc = data['completionConditions']
    renames = {
        'section16_6BranchTransitionAndBaoRuleMechanismClosure': 'section16_6_branchTransitionAndBaoRuleMechanismClosure',
        'section16_7GeometrySearchInstabilityDisposition': 'section16_7_geometrySearchInstabilityDisposition',
        'section16_8GeometryPersistenceMemoryClosure': 'section16_8_geometryPersistenceMemoryClosure',
        'section16_9ContinuousRepresentationAndLongitudinalDynamicsDisposition': 'section16_9_continuousRepresentationAndLongitudinalDynamicsDisposition',
        'section16_10ProtectedDepth10HoldoutClosure': 'section16_10_protectedDepth10HoldoutClosure',
        'section16_11GeneralizationCounterexampleAgendaClosure': 'section16_11_generalizationCounterexampleAgendaClosure',
        'section16_12ConstructSeparationPreserved': 'section16_12_constructSeparationPreserved',
        'section16_13PublicAiEngineeringSeparationPreserved': 'section16_13_publicAiEngineeringSeparationPreserved',
        'section16_14FinalSynthesisCreated': 'section16_14_finalSynthesisCreated',
    }
    for old, new in renames.items():
        if old not in cc:
            raise RuntimeError(f'missing completion condition key: {old}')
        if new in cc:
            raise RuntimeError(f'target completion condition key already exists: {new}')
    data['completionConditions'] = {
        renames.get(k, k): v for k, v in cc.items()
    }
    data['repositoryClosure'] = {
        'centralDocumentationSynchronization': 'COMPLETE',
        'finalPreMainConsistencyAudit': 'PASS',
        'finalAuditCheckpoint': str(FINAL_AUDIT),
        'temporaryClosureWriteCapableToolingPresent': False,
        'preMainIntegrationReady': True,
    }
    p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def audit():
    # Temporary write-capable tooling must already have been git-rm'ed before audit mode runs.
    for path in TEMP_PATHS:
        if path.exists():
            raise RuntimeError(f'temporary closure tooling still present: {path}')

    # Historical program plan must remain byte-identical to its prospective blob.
    plan_blob = git('hash-object', 'doc/research-generation-3/PROGRAM_PLAN.md')
    if plan_blob != EXPECTED_PLAN_BLOB:
        raise RuntimeError(f'PROGRAM_PLAN blob changed: {plan_blob}')

    # Machine-readable closure must parse and preserve the intended boundaries.
    result = json.loads(read('doc/research-generation-3/PROGRAM_FINAL_RESULT.json'))
    if result.get('programStatus') != 'CLOSED':
        raise RuntimeError('PROGRAM_FINAL_RESULT programStatus is not CLOSED')
    if result.get('mainIntegration') != 'PENDING-EXPLICIT-USER-AUTHORIZATION':
        raise RuntimeError('PROGRAM_FINAL_RESULT mainIntegration boundary changed')
    if result.get('mainIntegrationAuthorized') is not False:
        raise RuntimeError('PROGRAM_FINAL_RESULT mainIntegrationAuthorized must be false')
    if result.get('scientificExecutionAuthorizedByProgramClosure') is not False:
        raise RuntimeError('closure unexpectedly authorizes scientific execution')
    if result['repositoryClosure'].get('preMainIntegrationReady') is not True:
        raise RuntimeError('repositoryClosure preMainIntegrationReady not true')
    if result['repositoryClosure'].get('temporaryClosureWriteCapableToolingPresent') is not False:
        raise RuntimeError('temporary tooling flag not false')
    if not all(result['completionConditions'].values()):
        raise RuntimeError('not all completion conditions are true')
    for key in result['completionConditions']:
        prefix = key.split('_', 2)
        if len(prefix) < 3 or not prefix[0].startswith('section16'):
            raise RuntimeError(f'unexpected completion-condition key format: {key}')

    # Current-facing documents must expose one unambiguous generation-level closure state.
    rg3_readme = read('doc/research-generation-3/README.md')
    if rg3_readme.count('- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)') != 1:
        raise RuntimeError('RG3 README CURRENT_STATUS link count is not exactly one')
    for required in [
        'Status = CLOSED / core agenda G3-01..G3-12 complete',
        'MAIN INTEGRATION PENDING EXPLICIT USER INSTRUCTION',
        '2026-09-04-program-closure-central-sync-complete.md',
        '2026-09-04-research-generation-3-final-polish-consistency-pass.md',
    ]:
        if required not in rg3_readme:
            raise RuntimeError(f'RG3 README missing: {required}')

    current = read('doc/research-generation-3/CURRENT_STATUS.md')
    for required in [
        'Program status = CLOSED / core agenda G3-01..G3-12 complete',
        'Central documentation synchronization = COMPLETE',
        'Final pre-main documentation consistency audit = PASS',
        'Temporary closure write-capable tooling = REMOVED',
        'Main integration = NOT AUTHORIZED / NOT PERFORMED / explicit user instruction required',
        '2026-09-04-research-generation-3-final-polish-consistency-pass.md',
    ]:
        if required not in current:
            raise RuntimeError(f'CURRENT_STATUS missing: {required}')

    index = read('doc/RESEARCH_INDEX.md')
    for required in [
        'Research Generation 3 — program closure',
        '`CLOSED / MAIN INTEGRATION PENDING`',
        'Repository closure / consistency:',
        '2026-09-04-research-generation-3-final-polish-consistency-pass.md',
    ]:
        if required not in index:
            raise RuntimeError(f'RESEARCH_INDEX missing: {required}')

    root_readme = read('README.md')
    if 'Research Generation 3 core program final synthesis' not in root_readme:
        raise RuntimeError('root README missing RG3 final synthesis entry')
    if '`CLOSED / MAIN INTEGRATION PENDING`' not in root_readme:
        raise RuntimeError('root README missing RG3 pending integration boundary')

    future = read('doc/FUTURE_RESEARCH_AGENDA.md')
    if 'Research Generation 3: **Closed on closure branch' not in future:
        raise RuntimeError('FUTURE_RESEARCH_AGENDA missing RG3 closed state')
    if 'main integration pending explicit instruction' not in future:
        raise RuntimeError('FUTURE_RESEARCH_AGENDA missing pending integration boundary')

    synthesis = read('doc/research-generation-3/FINAL_SYNTHESIS.md')
    for required in [
        'G3-12 = CLOSED / TECHNICAL-INVALID / no formal generalization-counterexample decision',
        'depth 11 = NOT AUTHORIZED / NOT ACCESSED',
        'G3-H01 = DEFERRED / INDEPENDENT / NON-BLOCKING',
        'whole-Bao state-space / game-tree size = NOT ESTABLISHED',
    ]:
        if required not in synthesis:
            raise RuntimeError(f'FINAL_SYNTHESIS missing: {required}')

    # Create the superseding final audit checkpoint, then verify the final branch diff shape.
    pre_polish_head = git('rev-parse', 'HEAD')
    main_head = git('rev-parse', 'origin/main')
    merge_base = git('merge-base', 'origin/main', 'HEAD')
    if merge_base != main_head:
        raise RuntimeError(f'closure branch is not a pure descendant of main: merge-base={merge_base}, main={main_head}')

    audit_text = f'''# 2026-09-04 — Research Generation 3 final documentation polish / consistency pass

## Decision

**`PASS / PRE-MAIN-INTEGRATION-READY`**

This checkpoint supersedes the earlier pre-main consistency checkpoint for the current closure-branch documentation state. It records the final documentation-only polish requested after the first PASS. No scientific computation, seed access, closed-Study rerun, or `main` integration was performed.

## Audited repository state

```text
Repository = nkkmd/bao-la-kiswahili-game
Closure branch = research/g3-final-program-closure
Committed branch HEAD before final polish commit = {pre_polish_head}
Current main HEAD = {main_head}
merge base = current main HEAD
fast-forward ancestry = PASS
main integration = NOT AUTHORIZED / NOT PERFORMED
```

## Polish findings resolved

1. Removed the duplicate `CURRENT_STATUS.md` entry from `doc/research-generation-3/README.md`.
2. Added the central-sync and final pre-main consistency records to the generation-level read-first / canonical closure navigation in RG3 README, RG3 CURRENT_STATUS, and RESEARCH_INDEX.
3. Normalized `PROGRAM_FINAL_RESULT.json` Section 16 completion-condition key naming so every key uses `section16_<number>_...` form.
4. Added a machine-readable `repositoryClosure` block recording central sync completion, final pre-main audit PASS, temporary tooling absence, and pre-main readiness.

These changes are documentation / repository-governance only. They do not alter any scientific decision or interpretation boundary.

## Scientific boundary re-check

```text
Research Generation 3 = CLOSED
G3-H01 = DEFERRED / INDEPENDENT / NON-BLOCKING
G3-11 depth-10 = OPENED / CONSUMED EXACTLY ONCE / RERUN NOT AUTHORIZED
depth 11 = NOT AUTHORIZED / NOT ACCESSED
G3-12 = CLOSED / TECHNICAL-INVALID
G3-12 Stage 2 = NOT AUTHORIZED / NOT EXECUTED / seeds UNREAD
formal G3-12 generalization decisions = NONE
formal G3-12 counterexample decisions = NONE
G2-12 estimator scientific reuse = NOT AUTHORIZED
symmetry/canonicalization rescue = NOT AUTHORIZED
```

## Historical plan integrity

`doc/research-generation-3/PROGRAM_PLAN.md` remains byte-identical to the prospective historical plan:

```text
blob SHA = {EXPECTED_PLAN_BLOB}
```

## Temporary tooling

The one-time final-polish workflow, helper, and trigger were removed from the staged final tree before this audit checkpoint was generated. No closure write-capable temporary tooling remains in the intended final branch diff.

## Final diff scope

The intended final branch-vs-main diff is restricted to central documentation and generation-level closure/audit records. It contains no scientific workflow, scientific runner, seed authorization, or scientific result artifact generated by this polish.

## Integration boundary

The repository is **pre-main-integration ready**. This checkpoint does not authorize or perform integration.

`main` must remain unchanged until an explicit user instruction authorizes integration.
'''
    FINAL_AUDIT.parent.mkdir(parents=True, exist_ok=True)
    FINAL_AUDIT.write_text(audit_text, encoding='utf-8')

    final_diff = set(filter(None, git('diff', '--name-only', 'origin/main').splitlines()))
    if final_diff != EXPECTED_FINAL_DIFF:
        missing = sorted(EXPECTED_FINAL_DIFF - final_diff)
        extra = sorted(final_diff - EXPECTED_FINAL_DIFF)
        raise RuntimeError(f'final diff scope mismatch; missing={missing}, extra={extra}')

    print('RG3 final documentation polish audit PASS')


if __name__ == '__main__':
    if len(sys.argv) != 2 or sys.argv[1] not in {'--polish', '--audit'}:
        raise SystemExit('usage: finalize-rg3-program-closure-polish.py --polish|--audit')
    if sys.argv[1] == '--polish':
        polish()
    else:
        audit()
