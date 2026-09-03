#!/usr/bin/env python3
from pathlib import Path
import hashlib, re, subprocess

ROOT = Path(__file__).resolve().parents[2]
PROGRAM_PLAN = ROOT / 'doc/research-generation-3/PROGRAM_PLAN.md'
FORMAL_RESULT = ROOT / 'doc/continuous-local-geometry-representation/results/stage-2/STAGE_2_FORMAL_RESULT.json'
EXPECTED_PROGRAM_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac'
EXPECTED_FORMAL_RESULT_SHA256 = '11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73'


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, text=True).strip()


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read(rel):
    return (ROOT / rel).read_text(encoding='utf-8')


def write(rel, text):
    (ROOT / rel).write_text(text, encoding='utf-8')


def replace_regex(rel, pattern, replacement, label):
    text = read(rel)
    new, n = re.subn(pattern, replacement, text, count=1, flags=re.M)
    if n != 1:
        raise RuntimeError(f'{label}: expected exactly one replacement, got {n}')
    write(rel, new)


def replace_exact(rel, old, new, label):
    text = read(rel)
    n = text.count(old)
    if n != 1:
        raise RuntimeError(f'{label}: expected exactly one occurrence, got {n}')
    write(rel, text.replace(old, new, 1))


def append_once(rel, marker, block):
    text = read(rel)
    if marker in text:
        raise RuntimeError(f'{rel}: marker already present')
    if not text.endswith('\n'):
        text += '\n'
    text += '\n' + block.strip() + '\n'
    write(rel, text)


if git('rev-parse', f'HEAD:{PROGRAM_PLAN.relative_to(ROOT)}') != EXPECTED_PROGRAM_PLAN_BLOB:
    raise RuntimeError('historical PROGRAM_PLAN blob drift')
if sha256(FORMAL_RESULT) != EXPECTED_FORMAL_RESULT_SHA256:
    raise RuntimeError('Stage 2 formal result exact bytes drift')

# RG3 current status: update live program lines only; preserve historical sections.
replace_regex(
    'doc/research-generation-3/CURRENT_STATUS.md',
    r'^Program status = .*$',
    'Program status = ACTIVE / G3-09 CLGR-STUDY1 CLOSED TECHNICAL-INVALID / FORMAL REPRESENTATION ELIGIBILITY NOT ESTABLISHED / POST-G3-09 G3-10 REVIEW REQUIRED / G3-10 NOT AUTHORIZED',
    'RG3 CURRENT_STATUS program status')
replace_exact(
    'doc/research-generation-3/CURRENT_STATUS.md',
    'G3-09 = NOT AUTHORIZED / separate post-G3-08 current-state authorization review required',
    '''G3-09 program review = G3-09-AUTHORIZED
G3-09 = CLGR-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-09 Stage 0 v1 = TECHNICAL-INVALID / PRE-FRESH / NO RERUN
G3-09 Stage 0 v2 = STAGE0-PASS
G3-09 Stage 1 = STAGE1-PASS / 1 authorized / 1 actual / seeds CONSUMED
G3-09 Stage 1 canonical result = 1e63937dc5967276f68253c9efa819554b0ea3b346f471c04dea92cbd90dc529
G3-09 Stage 2 = TECHNICAL-INVALID / 1 authorized / 1 actual / seeds CONSUMED
G3-09 Stage 2 selected = 72 / completed before fail-closed = 61
G3-09 Stage 2 failure = mtaji / seed 31920066 / relay-limit enumeration 43481b84d17d064573c13acb90c12e55be710ead276c61a5763ea9dea64be86b
G3-09 formal representation eligibility = NOT ESTABLISHED
G3-09 no-rescue boundary = CROSSED / CLOSED
G3-09 main integration = NOT AUTHORIZED / NOT PERFORMED
G3-10 = NOT AUTHORIZED / separate post-G3-09 current-state authorization review required''',
    'RG3 CURRENT_STATUS G3-09 live line')
replace_regex(
    'doc/research-generation-3/CURRENT_STATUS.md',
    r'^Active scientific research branch = .*$',
    'Active scientific research branch = research/g3-09-continuous-local-geometry-representation / CLOSED / REVIEW-READY / main integration NOT AUTHORIZED',
    'RG3 CURRENT_STATUS active branch')
replace_regex(
    'doc/research-generation-3/CURRENT_STATUS.md',
    r'^Next scientific action = .*$',
    'Next scientific action = separate post-G3-09 current-state G3-10 authorization review; do not auto-start G3-10',
    'RG3 CURRENT_STATUS next action')
append_once(
    'doc/research-generation-3/CURRENT_STATUS.md',
    '<!-- CLGR-G3-09-CLOSURE:RG3-CURRENT -->',
    '''<!-- CLGR-G3-09-CLOSURE:RG3-CURRENT -->
## G3-09 technical-invalid closure

G3-09 `CLGR-STUDY1`は、LGTGMIV F1-F5 / RAW-only / relative depth 5から6本のexact geometry axesを保持する`CLGR-R1-EXACT-SQUASHED-L1`をprospectively固定して実施した。Stage 1 fresh developmentは24 Namua + 24 Mtajiの48 rootsで`STAGE1-PASS`。しかしseparately authorizedなStage 2 fresh formal holdoutは36 Namua + 36 Mtajiの72 rootsを選定後、61 rootsを完了した時点でMtaji seed `31920066`のdepth-5 RAW reconstructionが`relay-limit enumeration 43481b84d17d064573c13acb90c12e55be710ead276c61a5763ea9dea64be86b`となりfail-closedした。final formal decisionは`TECHNICAL-INVALID`、formal representation eligibilityは`NOT ESTABLISHED`。Stage 2 partial measurementsはformal scientific evidenceへ格上げせず、same-evidence rerun / seed extension / root replacement / resource ceiling relaxation / representation redesignを行わない。protected depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`のまま。G3-10は自動authorizeせずseparate post-G3-09 current-state reviewを必要とする。''')

# RG3 README live status.
replace_regex(
    'doc/research-generation-3/README.md',
    r'^Status = .*$',
    'Status = ACTIVE / G3-09 CLGR-STUDY1 CLOSED TECHNICAL-INVALID / FORMAL REPRESENTATION ELIGIBILITY NOT ESTABLISHED / POST-G3-09 G3-10 CURRENT-STATE REVIEW REQUIRED / G3-10 NOT AUTHORIZED',
    'RG3 README status')
replace_exact(
    'doc/research-generation-3/README.md',
    'G3-09 = NOT AUTHORIZED / separate post-G3-08 current-state review required',
    '''G3-09 program review = G3-09-AUTHORIZED
G3-09 = CLGR-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-09 Stage 1 = STAGE1-PASS / exactly one fresh execution / seeds CONSUMED
G3-09 Stage 2 = TECHNICAL-INVALID / exactly one fresh execution / seeds CONSUMED / 61 of 72 roots completed before fail-closed
G3-09 formal representation eligibility = NOT ESTABLISHED
G3-09 main integration = NOT AUTHORIZED / NOT PERFORMED
G3-10 = NOT AUTHORIZED / separate post-G3-09 current-state review required''',
    'RG3 README G3-09 live line')
append_once(
    'doc/research-generation-3/README.md',
    '<!-- CLGR-G3-09-CLOSURE:RG3-README -->',
    '''<!-- CLGR-G3-09-CLOSURE:RG3-README -->
## G3-09 technical-invalid closure

G3-09 `CLGR-STUDY1`は`CLOSED / TECHNICAL-INVALID`。Stage 1 developmentは48/48 rootsでPASSしたが、Stage 2 formal holdoutは72 roots選定後、61 roots完了時点のMtaji seed `31920066`で`relay-limit`によりfail-closedしたためformal representation eligibilityは確立していない。正本は[`../continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md`](../continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md)、program decisionは[`../research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md`](../research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md)。G3-10は別のcurrent-state authorization reviewまで`NOT AUTHORIZED`。''')

# Future agenda top live state and current update; keep PROGRAM_PLAN historical.
replace_regex(
    'doc/FUTURE_RESEARCH_AGENDA.md',
    r'^Research Generation 3: \*\*.*\*\*$',
    'Research Generation 3: **Active / G3-09 `CLGR-STUDY1` closed `TECHNICAL-INVALID` / Stage 1 PASS / Stage 2 TECHNICAL-INVALID after 61 of 72 formal roots / formal continuous-representation eligibility NOT ESTABLISHED / next action is separate post-G3-09 current-state G3-10 authorization review / G3-10 NOT AUTHORIZED (2026-09-03)**',
    'FUTURE RG3 live status')
future = read('doc/FUTURE_RESEARCH_AGENDA.md')
marker = '<!-- CLGR-G3-09-CLOSURE:FUTURE -->'
if marker in future:
    raise RuntimeError('FUTURE marker already present')
anchor = '### 2026-09-03 Research Generation 3 current update\n'
block = '''\n<!-- CLGR-G3-09-CLOSURE:FUTURE -->
G3-09 `CLGR-STUDY1`はcontinuous local-geometry representationを単一のfrozen family `CLGR-R1-EXACT-SQUASHED-L1`としてprospectively構築・検証した。Stage 1 fresh development 24 Namua + 24 Mtajiは48/48でexactness/nondegeneracy gateをPASSした。一方、separate authorization下のStage 2 fresh formal holdout 36 Namua + 36 Mtajiは72 rootsの選定までは完了したが、61 root measurements後、Mtaji seed `31920066`でrequired depth-5 RAW enumerationが`relay-limit`となり`TECHNICAL-INVALID`でfail-closedした。したがってformal continuous-representation eligibilityは`NOT ESTABLISHED`であり、61 partial formal measurementsをpositive/negative/null formal evidenceとして再利用しない。Stage 1/2 seed blockはともにconsume済みでsame-evidence rerunやresource/representation rescueは禁止。protected depth-10は未開封。historical `PROGRAM_PLAN.md`は変更しない。G3-10はvalidated local-geometry coordinate dependencyを前提としていたため自動authorizeせず、separate post-G3-09 current-state reviewを必要とする。\n'''
if anchor not in future:
    raise RuntimeError('FUTURE current update anchor missing')
future = future.replace(anchor, anchor + block, 1)
write('doc/FUTURE_RESEARCH_AGENDA.md', future)

# Research index append current Study entry.
append_once(
    'doc/RESEARCH_INDEX.md',
    '<!-- CLGR-G3-09-CLOSURE:RESEARCH-INDEX -->',
    '''<!-- CLGR-G3-09-CLOSURE:RESEARCH-INDEX -->
### G3-09 — Continuous Local-Geometry Representation Study 1

- Study ID: `CLGR-STUDY1`
- Status: **`CLOSED / TECHNICAL-INVALID`**
- Formal representation: `CLGR-R1-EXACT-SQUASHED-L1`
- Measurement foundation: `LGTGMIV F1-F5 / RAW-only / relative depth 5`
- Stage 1: `STAGE1-PASS`, exactly one fresh execution, 24 Namua + 24 Mtaji
- Stage 2: `TECHNICAL-INVALID`, exactly one fresh formal execution, 36 Namua + 36 Mtaji selected, 61 roots measured before fail-closed
- Failure: Mtaji seed `31920066`, `relay-limit enumeration 43481b84d17d064573c13acb90c12e55be710ead276c61a5763ea9dea64be86b`
- Formal continuous-representation eligibility: **NOT ESTABLISHED**
- Protected depth-10: `SEALED / NOT GENERATED / NOT READ / NOT PEEKED`
- Final report: [`continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md`](continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md)
- Program closure: [`research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md`](research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md)
- Downstream: G3-10 is not authorized without separate post-G3-09 current-state review.''')

# Root README append a concise current-facing entry without rewriting historical study records.
append_once(
    'README.md',
    '<!-- CLGR-G3-09-CLOSURE:ROOT-README -->',
    '''<!-- CLGR-G3-09-CLOSURE:ROOT-README -->
## Research Generation 3 — G3-09 closure

G3-09 [`CLGR-STUDY1`](doc/continuous-local-geometry-representation/README.md) は **`CLOSED / TECHNICAL-INVALID`**。prospectively固定した6-axis exact continuous representationはStage 1 development 48/48 rootsをPASSしたが、Stage 2 fresh formal holdoutは72 roots選定後61 roots完了時点のMtaji seed `31920066`でrequired depth-5 RAW enumerationが`relay-limit`となりfail-closedした。formal representation eligibilityは**確立していない**。same-evidence rerun / root replacement / seed extension / resource ceiling relaxation / representation rescueは禁止し、protected standard-initial RAW depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`のまま保持する。G3-10は別のpost-G3-09 current-state authorization reviewまで`NOT AUTHORIZED`。G3-09 research branchの`main`統合はユーザー明示指示まで行わない。''')

# Assert live state and protected/historical boundaries.
assert git('rev-parse', f'HEAD:{PROGRAM_PLAN.relative_to(ROOT)}') == EXPECTED_PROGRAM_PLAN_BLOB
for rel in [
    'README.md',
    'doc/RESEARCH_INDEX.md',
    'doc/FUTURE_RESEARCH_AGENDA.md',
    'doc/research-generation-3/README.md',
    'doc/research-generation-3/CURRENT_STATUS.md']:
    text = read(rel)
    if 'CLGR-G3-09-CLOSURE' not in text:
        raise RuntimeError(f'missing closure marker in {rel}')
if 'G3-10 = NOT AUTHORIZED' not in read('doc/research-generation-3/CURRENT_STATUS.md'):
    raise RuntimeError('G3-10 downstream boundary missing')
if 'SEALED / NOT GENERATED / NOT READ / NOT PEEKED' not in read('doc/research-generation-3/CURRENT_STATUS.md'):
    raise RuntimeError('protected depth-10 boundary missing')

checkpoint = ROOT / 'doc/continuous-local-geometry-representation/checkpoints/2026-09-03-central-document-update-pass.md'
checkpoint.write_text('''# CLGR-STUDY1 Central Document Update Pass\n\nDate: 2026-09-03\n\n```text\nStudy = CLGR-STUDY1 / CLOSED / TECHNICAL-INVALID\nformal representation eligibility = NOT ESTABLISHED\ncentral docs updated = README.md / doc/RESEARCH_INDEX.md / doc/FUTURE_RESEARCH_AGENDA.md / doc/research-generation-3/README.md / doc/research-generation-3/CURRENT_STATUS.md\nhistorical PROGRAM_PLAN blob = 2bb90c11f1625f63f40a7eab8a3de7774505a1ac / UNCHANGED\nprotected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED\nG3-10 = NOT AUTHORIZED / separate post-G3-09 review required\nmain integration = NOT AUTHORIZED / NOT PERFORMED\n```\n''', encoding='utf-8')
print('CLGR_G3_09_CENTRAL_DOCS_PASS')
