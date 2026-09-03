#!/usr/bin/env python3
from pathlib import Path
import hashlib, subprocess, os

ROOT = Path(__file__).resolve().parents[2]
BASELINE_MAIN = '6c218b9cc3f492fb96d051768702682fef9bb66a'
PROGRAM_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac'
STAGE2_RESULT_SHA256 = '11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73'


def p(rel):
    return ROOT / rel


def read(rel):
    return p(rel).read_text(encoding='utf-8')


def write(rel, text):
    p(rel).write_text(text, encoding='utf-8')


def replace_once(rel, old, new):
    text = read(rel)
    if new in text:
        return
    if text.count(old) != 1:
        raise RuntimeError(f'{rel}: expected exactly one replacement target, found {text.count(old)}')
    write(rel, text.replace(old, new, 1))


def insert_after_once(rel, anchor, marker, block):
    text = read(rel)
    if marker in text:
        return
    if text.count(anchor) != 1:
        raise RuntimeError(f'{rel}: expected exactly one anchor, found {text.count(anchor)}')
    write(rel, text.replace(anchor, anchor + '\n' + block, 1))


def sha256(rel):
    return hashlib.sha256(p(rel).read_bytes()).hexdigest()


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, text=True).strip()


# 1. Root README: update the current-facing RG3 status description and add direct G3-09 canonical links.
replace_once(
    'README.md',
    "- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / G3-02 / G3-03 / G3-05 / G3-06 / G3-08は`CLOSED / TECHNICAL-INVALID`、LGTGMIVは`FORMAL-ELIGIBLE-ALL`、G3-04 / G3-07は`CLOSED / FORMAL-COMPLETE`。G3-08 / `LGPML-STUDY1`はStage 0 PASS後、exactly-one fresh Stage 1で`relay-limit enumeration` technical errorによりcomplete development populationへ到達せず、formal promoted set `[]`、Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`で閉鎖。protected depth-10はsealed。次はseparate post-G3-08 G3-09 authorization reviewで、G3-09は未承認。",
    "- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-09 / `CLGR-STUDY1`は`CLOSED / TECHNICAL-INVALID`。Stage 1は48/48 fresh rootsでPASSしたが、Stage 2は72 roots選定後61 roots完了時点の`relay-limit enumeration`でfail-closedし、formal continuous-representation eligibilityは`NOT ESTABLISHED`。protected depth-10はsealed。次のscientific actionはseparate post-G3-09 G3-10 current-state authorization reviewで、G3-10は未承認。"
)
insert_after_once(
    'README.md',
    "- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-09 / `CLGR-STUDY1`は`CLOSED / TECHNICAL-INVALID`。Stage 1は48/48 fresh rootsでPASSしたが、Stage 2は72 roots選定後61 roots完了時点の`relay-limit enumeration`でfail-closedし、formal continuous-representation eligibilityは`NOT ESTABLISHED`。protected depth-10はsealed。次のscientific actionはseparate post-G3-09 G3-10 current-state authorization reviewで、G3-10は未承認。",
    '<!-- CLGR-G3-09-CANONICAL-LINKS:ROOT -->',
    """<!-- CLGR-G3-09-CANONICAL-LINKS:ROOT -->
- [`doc/continuous-local-geometry-representation/README.md`](doc/continuous-local-geometry-representation/README.md): Research Generation 3 `G3-09` / `CLGR-STUDY1` のtechnical-invalid closure入口。
- [`doc/continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md`](doc/continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md): G3-09のprospective representation contract、Stage 1 PASS、Stage 2 relay-limit fail-closed、no-rescue / interpretation boundaryの科学的最終正本。
- [`doc/continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md`](doc/continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md): G3-09のsource binding、seed、exact hashes、Actions provenance、protected-evidence / final-audit provenance。
- [`doc/research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md`](doc/research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md): G3-09 `CLOSED / TECHNICAL-INVALID` program decision。G3-10は自動authorizeされない。"""
)

# 2. RG3 README: make the current Study the first canonical read target, retaining historical earlier-study links.
insert_after_once(
    'doc/research-generation-3/README.md',
    '- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing program state',
    '<!-- CLGR-G3-09-READ-FIRST -->',
    """<!-- CLGR-G3-09-READ-FIRST -->
- [`../continuous-local-geometry-representation/README.md`](../continuous-local-geometry-representation/README.md) — G3-09 technical-invalid closure入口 / current Study summary
- [`../continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md`](../continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md) — G3-09 scientific closure / interpretation boundary正本
- [`../continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md`](../continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md) — G3-09 exact artifacts / source binding / final audit provenance
- [`../research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md`](../research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md) — G3-09 program closure / G3-10 not auto-authorized
- [`../continuous-local-geometry-representation/checkpoints/2026-09-03-final-repository-document-consistency-pass.md`](../continuous-local-geometry-representation/checkpoints/2026-09-03-final-repository-document-consistency-pass.md) — G3-09 final repository/document consistency audit PASS
- [`../local-geometry-persistence-memory-length/README.md`](../local-geometry-persistence-memory-length/README.md) — G3-08 technical-invalid closure入口
- [`../local-geometry-persistence-memory-length/STUDY_1_FINAL_REPORT.md`](../local-geometry-persistence-memory-length/STUDY_1_FINAL_REPORT.md) — G3-08 scientific/technical closure正本"""
)

# 3. Research index: complete G3-09 navigation without rewriting the scientific summary.
insert_after_once(
    'doc/RESEARCH_INDEX.md',
    '- Downstream: G3-10 is not authorized without separate post-G3-09 current-state review.',
    '<!-- CLGR-G3-09-CANONICAL-INDEX -->',
    """<!-- CLGR-G3-09-CANONICAL-INDEX -->

**最初に読む:**

- [`continuous-local-geometry-representation/README.md`](continuous-local-geometry-representation/README.md) — G3-09 closure概要とcurrent boundary

**詳細・正本:**

- [`continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md`](continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md) — scientific/technical final report
- [`continuous-local-geometry-representation/CURRENT_STATUS.md`](continuous-local-geometry-representation/CURRENT_STATUS.md) — current lifecycle / final audit / main-integration boundary
- [`continuous-local-geometry-representation/DECISION_REGISTER.md`](continuous-local-geometry-representation/DECISION_REGISTER.md) — authorization・execution・closure decisions
- [`continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md`](continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md) — source binding・artifact・hash・Actions provenance
- [`research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md`](research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md) — program-level closure
- [`research-generation-3/checkpoints/2026-09-03-g3-09-technical-invalid-closure.md`](research-generation-3/checkpoints/2026-09-03-g3-09-technical-invalid-closure.md) — RG3 closure checkpoint
- [`continuous-local-geometry-representation/checkpoints/2026-09-03-final-repository-document-consistency-pass.md`](continuous-local-geometry-representation/checkpoints/2026-09-03-final-repository-document-consistency-pass.md) — final repository/document consistency audit PASS"""
)

# 4. G3-08 reproducibility: retain historical facts but remove stale present-tense authority claims.
replace_once(
    'doc/local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md',
    "## Main integration boundary\n\n`main` integration is **NOT AUTHORIZED**. The user has explicitly required that integration must not occur until a later explicit instruction. Current remote `main` remains `9f6abd3c9b146bb88c11dd04963052300e4cdc3b`.",
    "## Historical pre-integration boundary\n\nAt G3-08 scientific closure, `main` integration was **NOT AUTHORIZED** and remote `main` was `9f6abd3c9b146bb88c11dd04963052300e4cdc3b`. This is retained as closure-time provenance; the later authorized integration is recorded below."
)
replace_once(
    'doc/local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md',
    "Current authoritative program state remains: G3-08 / `LGPML-STUDY1 = CLOSED / TECHNICAL-INVALID`; G3-09 `NOT AUTHORIZED`; protected depth-10 sealed; G3-08 main integration not performed.",
    "At that follow-up checkpoint, the then-current state was: G3-08 / `LGPML-STUDY1 = CLOSED / TECHNICAL-INVALID`; G3-09 `NOT AUTHORIZED`; protected depth-10 sealed; G3-08 main integration not yet performed. Those statements are historical checkpoint provenance. Current program state is authoritative in `../research-generation-3/CURRENT_STATUS.md`; G3-08 integration is complete and G3-09 / `CLGR-STUDY1` is now `CLOSED / TECHNICAL-INVALID`."
)

# 5. G3-09 local navigation/provenance: record the already completed final audit.
insert_after_once(
    'doc/continuous-local-geometry-representation/README.md',
    '**`CLOSED / TECHNICAL-INVALID`**',
    '<!-- CLGR-G3-09-FINAL-AUDIT:README -->',
    """<!-- CLGR-G3-09-FINAL-AUDIT:README -->

Repository/document closure status: **`FINAL CONSISTENCY AUDIT PASS / RESEARCH BRANCH REVIEW-READY`** (`33754250314`)."""
)
insert_after_once(
    'doc/continuous-local-geometry-representation/DECISION_REGISTER.md',
    '| CLGR-D054 | Main integration at closure | `NOT AUTHORIZED / NOT PERFORMED` | user明示指示までresearch branchをreview-readyに保持。 |',
    '<!-- CLGR-G3-09-FINAL-AUDIT:DECISIONS -->',
    """<!-- CLGR-G3-09-FINAL-AUDIT:DECISIONS -->
| CLGR-D055 | Final repository/document consistency audit v1 | `DOCUMENTATION-AUDIT-ALLOWLIST-TOO-NARROW / NO SCIENTIFIC CONSEQUENCE / NO RERUN` | valid CLGR authorization-review pathsのallowlist漏れ。scientific computation/evidence accessなし。 |
| CLGR-D056 | Final repository/document consistency audit v2 | `PASS / run 33754250314` | exact result identity、no-rescue、protected depth-10、historical PROGRAM_PLAN、current-facing docs、changed-path confinement、remote main不変を確認。 |
| CLGR-D057 | Research branch lifecycle after final audit | `CLOSED / REVIEW-READY` | main integrationは依然`NOT AUTHORIZED / NOT PERFORMED`。 |"""
)
insert_after_once(
    'doc/continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md',
    'Main integration is **not authorized** and has **not been performed**. Explicit user instruction is required after final repository/document consistency audit.',
    '<!-- CLGR-G3-09-FINAL-AUDIT:REPRO -->',
    """<!-- CLGR-G3-09-FINAL-AUDIT:REPRO -->

## Final repository/document consistency audit

Final audit v1 stopped on a documentation allowlist omission before any scientific computation. It was not rerun. A fresh documentation-only v2 audit expanded only the valid CLGR program-decision path allowlist and otherwise retained the same checks.

```text
v2 workflow run = 33754250314
disposition = FINAL-REPOSITORY-DOCUMENT-CONSISTENCY-PASS
Stage 2 formal-result SHA-256 = 11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73
historical PROGRAM_PLAN blob = 2bb90c11f1625f63f40a7eab8a3de7774505a1ac / UNCHANGED
remote main at audit = 6c218b9cc3f492fb96d051768702682fef9bb66a / UNCHANGED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT AUTHORIZED / NOT PERFORMED
research branch = CLOSED / REVIEW-READY
```

Canonical checkpoint: `checkpoints/2026-09-03-final-repository-document-consistency-pass.md`."""
)

# Invariants: historical plan and canonical formal result must not change.
if git('rev-parse', 'HEAD:doc/research-generation-3/PROGRAM_PLAN.md') != PROGRAM_PLAN_BLOB:
    raise RuntimeError('historical PROGRAM_PLAN blob drift before follow-up')
if sha256('doc/continuous-local-geometry-representation/results/stage-2/STAGE_2_FORMAL_RESULT.json') != STAGE2_RESULT_SHA256:
    raise RuntimeError('Stage 2 formal result drift')

# Verify all current-facing claims after patch.
root = read('README.md')
if 'G3-09 / `CLGR-STUDY1`は`CLOSED / TECHNICAL-INVALID`' not in root or 'G3-09は未承認' in root.split('<!-- LGPML-G3-08-CLOSURE:ROOT-README -->')[0]:
    raise RuntimeError('root README current-facing RG3 description still stale')
rg3 = read('doc/research-generation-3/README.md')
if '<!-- CLGR-G3-09-READ-FIRST -->' not in rg3:
    raise RuntimeError('RG3 README G3-09 read-first links missing')
idx = read('doc/RESEARCH_INDEX.md')
if '<!-- CLGR-G3-09-CANONICAL-INDEX -->' not in idx:
    raise RuntimeError('RESEARCH_INDEX G3-09 canonical links missing')
g8r = read('doc/local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md')
if 'Current authoritative program state remains:' in g8r or '## Main integration boundary\n\n`main` integration is **NOT AUTHORIZED**' in g8r:
    raise RuntimeError('G3-08 reproducibility stale present-tense wording remains')

# Remote main must remain untouched throughout this documentation-only follow-up.
subprocess.check_call(['git', 'fetch', '--no-tags', 'origin', 'main'], cwd=ROOT)
if git('rev-parse', 'origin/main') != BASELINE_MAIN:
    raise RuntimeError('remote main changed unexpectedly')

run_id = os.environ.get('GITHUB_RUN_ID', 'unknown')
checkpoint = p('doc/continuous-local-geometry-representation/checkpoints/2026-09-03-final-document-consistency-followup-pass.md')
checkpoint.write_text(f'''# CLGR-STUDY1 Final Document Consistency Follow-up Pass\n\nDate: 2026-09-03\n\n```text\nStudy = CLGR-STUDY1 / CLOSED / TECHNICAL-INVALID\nfollow-up type = DOCUMENTATION-ONLY / NO SCIENTIFIC RECOMPUTATION\nroot README stale RG3 status = CORRECTED\nRG3 README G3-09 read-first links = ADDED\nRESEARCH_INDEX G3-09 canonical navigation = COMPLETED\nG3-08 reproducibility stale present-tense lifecycle wording = HISTORICALLY QUALIFIED\nG3-09 Decision Register final audit provenance = ADDED\nG3-09 Reproducibility Index final audit provenance = ADDED\nG3-09 README review-ready state = ADDED\nStage 2 formal-result SHA-256 = {STAGE2_RESULT_SHA256} / UNCHANGED\nhistorical PROGRAM_PLAN blob = {PROGRAM_PLAN_BLOB} / UNCHANGED\nprotected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED\nremote main = {BASELINE_MAIN} / UNCHANGED\nmain integration = NOT AUTHORIZED / NOT PERFORMED\nworkflow run = {run_id}\nfollow-up audit = PASS\n```\n\nNo scientific result, preregistration, seed block, representation rule, or historical prospective program plan was changed.\n''', encoding='utf-8')

print('CLGR G3-09 final document consistency follow-up PASS')
