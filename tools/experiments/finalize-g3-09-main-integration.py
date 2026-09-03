#!/usr/bin/env python3
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[2]
INITIAL_MAIN = '64ada67b058811c18d81e7286fd3b12df6964459'
STAGE2_SHA = '11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73'
PROGRAM_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac'


def read(rel):
    return (ROOT / rel).read_text(encoding='utf-8')

def write(rel, text):
    (ROOT / rel).write_text(text, encoding='utf-8')

def replace_once(rel, old, new):
    text = read(rel)
    if text.count(old) != 1:
        raise RuntimeError(f'{rel}: expected exactly one occurrence of {old!r}, got {text.count(old)}')
    write(rel, text.replace(old, new, 1))

def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, text=True).strip()

subprocess.check_call(['git','fetch','--no-tags','origin','main'], cwd=ROOT)
if git('rev-parse','origin/main') != INITIAL_MAIN:
    raise RuntimeError('remote main drifted after initial G3-09 fast-forward')
if git('rev-parse','HEAD:doc/research-generation-3/PROGRAM_PLAN.md') != PROGRAM_PLAN_BLOB:
    raise RuntimeError('historical PROGRAM_PLAN drift')

replace_once('doc/continuous-local-geometry-representation/CURRENT_STATUS.md',
             'research branch lifecycle = CLOSED / REVIEW-READY',
             'research branch lifecycle = CLOSED / RETAINED FOR PROVENANCE')
replace_once('doc/continuous-local-geometry-representation/CURRENT_STATUS.md',
             'main integration = NOT AUTHORIZED / NOT PERFORMED',
             f'main integration = COMPLETE / FAST-FORWARD / initial source tip {INITIAL_MAIN} / force=false')
replace_once('doc/continuous-local-geometry-representation/CURRENT_STATUS.md',
             'The scientific Study and repository/document closure work are complete on the research branch. The branch is `CLOSED / REVIEW-READY`. Integration into `main` remains prohibited until explicit user instruction.',
             f'The scientific Study and repository/document closure work are complete. After explicit user instruction on 2026-09-03, `main` was fast-forwarded to the reviewed source tip `{INITIAL_MAIN}` with `force=false`. The closed research branch is retained for provenance; scientific closure and no-rescue boundaries are unchanged.')

replace_once('doc/continuous-local-geometry-representation/README.md',
             '## Main integration boundary\n\nMain integration is prohibited until explicit user instruction after closure and final repository/document consistency audit.',
             f'## Main integration\n\nAfter explicit user instruction on 2026-09-03, the reviewed G3-09 closure tip `{INITIAL_MAIN}` was fast-forward integrated to `main` with `force=false`. No squash, rebase, history rewrite, scientific recomputation, seed reuse, or protected-holdout access occurred. The closed research branch is retained for provenance.')

replace_once('doc/continuous-local-geometry-representation/DECISION_REGISTER.md',
             '| CLGR-D057 | Research branch lifecycle after final audit | `CLOSED / REVIEW-READY` | main integrationは依然`NOT AUTHORIZED / NOT PERFORMED`。 |',
             '| CLGR-D057 | Research branch lifecycle after final audit | `CLOSED / REVIEW-READY` | main integration前のreview-ready状態。 |\n| CLGR-D058 | Main integration | `COMPLETE / FAST-FORWARD / FORCE=FALSE` | 2026-09-03の明示的ユーザー指示後、review-ready tip `64ada67b058811c18d81e7286fd3b12df6964459` をmainへ統合。scientific closure/no-rescueは不変。 |')

replace_once('doc/continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md',
             'Main integration is **not authorized** and has **not been performed**. Explicit user instruction is required after final repository/document consistency audit.',
             f'After explicit user instruction on 2026-09-03, `main` was fast-forwarded to the reviewed G3-09 closure tip `{INITIAL_MAIN}` with `force=false`. No squash, rebase, history rewrite, scientific recomputation, seed reuse, or protected-holdout access occurred. The closed research branch is retained for provenance.')

replace_once('doc/research-generation-3/CURRENT_STATUS.md',
             'G3-09 main integration = NOT AUTHORIZED / NOT PERFORMED',
             f'G3-09 main integration = COMPLETE / FAST-FORWARD / initial source tip {INITIAL_MAIN} / force=false')
replace_once('doc/research-generation-3/CURRENT_STATUS.md',
             'Active scientific research branch = research/g3-09-continuous-local-geometry-representation / CLOSED / REVIEW-READY / main integration NOT AUTHORIZED',
             'Active scientific research branch = none / G3-09 integrated to main; G3-10 remains NOT AUTHORIZED')

replace_once('doc/research-generation-3/README.md',
             'G3-09 main integration = NOT AUTHORIZED / NOT PERFORMED',
             f'G3-09 main integration = COMPLETE / FAST-FORWARD / initial source tip {INITIAL_MAIN} / force=false')

replace_once('README.md',
             'G3-09 research branchの`main`統合はユーザー明示指示まで行わない。',
             f'G3-09は2026-09-03の明示的ユーザー指示後、review-ready tip `{INITIAL_MAIN}` を`main`へfast-forward統合した（`force=false`）。scientific closure / no-rescue / protected depth-10境界は不変。')

replace_once('doc/RESEARCH_INDEX.md',
             '- Downstream: G3-10 is not authorized without separate post-G3-09 current-state review.',
             f'- Downstream: G3-10 is not authorized without separate post-G3-09 current-state review.\n- Main integration: COMPLETE / fast-forward / initial source tip `{INITIAL_MAIN}` / `force=false` after explicit user instruction on 2026-09-03.')

checkpoint = ROOT / 'doc/research-generation-3/checkpoints/2026-09-03-g3-09-main-integration-complete.md'
checkpoint.write_text(f'''# G3-09 Main Integration Complete\n\nDate: 2026-09-03\n\n```text\nStudy = G3-09 / CLGR-STUDY1 / CLOSED / TECHNICAL-INVALID\nformal continuous-representation eligibility = NOT ESTABLISHED\nreview-ready source tip = {INITIAL_MAIN}\nintegration method = FAST-FORWARD\nforce = false\nsquash = false\nrebase = false\nhistory rewrite = false\nscientific recomputation = false\nStage 1/2 seed reuse = false\nStage 2 formal-result SHA-256 = {STAGE2_SHA} / UNCHANGED\nprotected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED\nhistorical PROGRAM_PLAN blob = {PROGRAM_PLAN_BLOB} / UNCHANGED\nG3-10 = NOT AUTHORIZED / separate post-G3-09 current-state review required\n```\n\nThe first fast-forward moved `main` from the pre-G3-09 baseline to the reviewed closure tip above after explicit user instruction. This post-integration metadata records that lifecycle transition only; it does not change any scientific result, preregistration, seed, representation contract, or protected evidence.\n''', encoding='utf-8')

# Final sanity checks.
for rel in ['README.md','doc/RESEARCH_INDEX.md','doc/research-generation-3/README.md','doc/research-generation-3/CURRENT_STATUS.md','doc/continuous-local-geometry-representation/README.md','doc/continuous-local-geometry-representation/CURRENT_STATUS.md','doc/continuous-local-geometry-representation/DECISION_REGISTER.md','doc/continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md']:
    t=read(rel)
    if 'G3-09 main integration = NOT AUTHORIZED / NOT PERFORMED' in t or 'G3-09 research branchの`main`統合はユーザー明示指示まで行わない。' in t:
        raise RuntimeError(f'stale integration wording remains in {rel}')

print('G3-09 post-integration lifecycle metadata finalized')
