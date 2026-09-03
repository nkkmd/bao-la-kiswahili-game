#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, os, subprocess

ROOT = Path(__file__).resolve().parents[2]
BASELINE_MAIN = '6c218b9cc3f492fb96d051768702682fef9bb66a'
PROGRAM_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac'
STAGE1_CANON = '1e63937dc5967276f68253c9efa819554b0ea3b346f471c04dea92cbd90dc529'
STAGE2_RESULT_SHA = '11cee4ab7d2fbd1105f69ff1592b01a3ebd651aa1bedbf79414e7b338935ef73'


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT, text=True).strip()


def read(rel):
    return (ROOT / rel).read_text(encoding='utf-8')


def sha256(rel):
    return hashlib.sha256((ROOT / rel).read_bytes()).hexdigest()


def need(cond, msg):
    if not cond:
        raise RuntimeError(msg)

# Main must remain untouched and historical plan immutable.
subprocess.check_call(['git', 'fetch', '--no-tags', 'origin', 'main'], cwd=ROOT)
need(git('rev-parse', 'origin/main') == BASELINE_MAIN, 'remote main changed or was integrated')
need(git('rev-parse', 'HEAD:doc/research-generation-3/PROGRAM_PLAN.md') == PROGRAM_PLAN_BLOB, 'historical PROGRAM_PLAN drift')

# Canonical scientific/technical artifacts.
s1 = json.loads(read('doc/continuous-local-geometry-representation/results/stage-1/STAGE_1_DEVELOPMENT_RESULT.json'))
s2 = json.loads(read('doc/continuous-local-geometry-representation/results/stage-2/STAGE_2_FORMAL_RESULT.json'))
need(s1['stageDisposition'] == 'STAGE1-PASS', 'Stage1 disposition drift')
need(s1['stage2Eligible'] is True, 'Stage1 eligibility drift')
need(s1['canonicalScientificResultSha256'] == STAGE1_CANON, 'Stage1 canonical hash drift')
need(s1['stage1SeedBlockConsumed'] is True and s1['sameEvidenceRerunAuthorized'] is False, 'Stage1 no-rescue drift')
need(s1['protectedDepth10Access'] is False, 'Stage1 protected evidence access drift')
need(sha256('doc/continuous-local-geometry-representation/results/stage-2/STAGE_2_FORMAL_RESULT.json') == STAGE2_RESULT_SHA, 'Stage2 exact-byte result drift')
need(s2['formalDecision'] == 'TECHNICAL-INVALID', 'Stage2 formal decision drift')
need(s2['selectedCounts'] == {'namua':36,'mtaji':36,'total':72}, 'Stage2 selected population drift')
need(s2['partialMeasurementCount'] == 61, 'Stage2 partial count drift')
need(s2['technicalFailure']['sourceSeed'] == 31920066 and s2['technicalFailure']['phase'] == 'mtaji', 'Stage2 failure identity drift')
need(s2['scientificSummaryAuthorized'] is False and s2['sameEvidenceRerunAuthorized'] is False, 'Stage2 inference/no-rescue drift')
need(s2['stage2SeedBlockConsumed'] is True and s2['protectedDepth10Access'] is False, 'Stage2 evidence boundary drift')

# Study-local lifecycle coherence.
local_docs = [
    'doc/continuous-local-geometry-representation/README.md',
    'doc/continuous-local-geometry-representation/CURRENT_STATUS.md',
    'doc/continuous-local-geometry-representation/DECISION_REGISTER.md',
    'doc/continuous-local-geometry-representation/REPRODUCIBILITY_INDEX.md',
    'doc/continuous-local-geometry-representation/STUDY_1_FINAL_REPORT.md',
    'doc/research-program-decisions/2026-09-03-g3-09-technical-invalid-closure.md',
    'doc/research-generation-3/checkpoints/2026-09-03-g3-09-technical-invalid-closure.md']
for rel in local_docs:
    text = read(rel)
    need('TECHNICAL-INVALID' in text, f'missing technical-invalid closure in {rel}')
    need('main integration' in text.lower(), f'missing main integration boundary in {rel}')

status = read('doc/continuous-local-geometry-representation/CURRENT_STATUS.md')
need('Study status = CLOSED / TECHNICAL-INVALID' in status, 'CLGR current status not closed')
need('formal representation eligibility = NOT ESTABLISHED' in status, 'CLGR eligibility boundary missing')
need('Stage 2 seeds = 31920001..31920384 / CONSUMED' in status, 'Stage2 consumed status missing')
need('main integration = NOT AUTHORIZED / NOT PERFORMED' in status, 'CLGR main boundary missing')

# Current-facing central program state.
central = [
    'README.md',
    'doc/RESEARCH_INDEX.md',
    'doc/FUTURE_RESEARCH_AGENDA.md',
    'doc/research-generation-3/README.md',
    'doc/research-generation-3/CURRENT_STATUS.md']
for rel in central:
    text = read(rel)
    need('CLGR-G3-09-CLOSURE' in text, f'G3-09 closure marker missing in {rel}')
    need('G3-09' in text and 'TECHNICAL-INVALID' in text, f'G3-09 closure state missing in {rel}')

rg3 = read('doc/research-generation-3/CURRENT_STATUS.md')
need('G3-09 = CLGR-STUDY1 / CLOSED / TECHNICAL-INVALID' in rg3, 'RG3 G3-09 line missing')
need('G3-10 = NOT AUTHORIZED / separate post-G3-09 current-state authorization review required' in rg3, 'RG3 G3-10 gate missing')
need('Protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ / NOT PEEKED' in rg3, 'RG3 protected holdout drift')
need('Active scientific research branch = research/g3-09-continuous-local-geometry-representation / CLOSED / REVIEW-READY / main integration NOT AUTHORIZED' in rg3, 'RG3 branch state drift')

future = read('doc/FUTURE_RESEARCH_AGENDA.md')
need('formal continuous-representation eligibility NOT ESTABLISHED' in future, 'future agenda eligibility boundary missing')
need('G3-10 NOT AUTHORIZED' in future, 'future agenda G3-10 gate missing')

# Prior current-facing G3-07 metadata must no longer claim G3-09 is pending authorization.
for rel in [
    'doc/search-instability-local-geometry-mechanism/README.md',
    'doc/search-instability-local-geometry-mechanism/CURRENT_STATUS.md']:
    text = read(rel)
    need('G3-09 remains' not in text, f'stale G3-09 current wording in {rel}')
    need('G3-09 / `CLGR-STUDY1`' in text and 'G3-10' in text, f'current downstream chain missing in {rel}')

# Historical program plan must still contain its original G3-09/G3-10 prospective descriptions.
plan = read('doc/research-generation-3/PROGRAM_PLAN.md')
need('## G3-09 — Continuous Local-Geometry Representation Study 1' in plan, 'historical G3-09 plan missing')
need('## G3-10 — Geometry-Conditioned Longitudinal Dynamics Study 1' in plan, 'historical G3-10 plan missing')

# Branch diff must be confined to the G3-09 study, current-facing metadata, RG3/program closure records, G3-07 current downstream metadata, and supporting workflows/tools.
changed = [x for x in git('diff', '--name-only', 'origin/main...HEAD').splitlines() if x.strip()]
allowed_prefixes = (
    'doc/continuous-local-geometry-representation/',
    'doc/research-program-decisions/2026-09-03-post-g3-08-g3-09-',
    'doc/research-program-decisions/2026-09-03-g3-09-',
    'doc/research-generation-3/checkpoints/2026-09-03-post-g3-08-g3-09-',
    'doc/research-generation-3/checkpoints/2026-09-03-g3-09-',
    '.github/workflows/clgr-',
    'tools/experiments/lib/clgr-',
    'tools/experiments/run-clgr-',
    'tools/experiments/verify-clgr-',
    'tools/experiments/finalize-clgr-',
    'tools/experiments/audit-clgr-')
allowed_exact = {
    'README.md',
    'doc/RESEARCH_INDEX.md',
    'doc/FUTURE_RESEARCH_AGENDA.md',
    'doc/research-generation-3/README.md',
    'doc/research-generation-3/CURRENT_STATUS.md',
    'doc/search-instability-local-geometry-mechanism/README.md',
    'doc/search-instability-local-geometry-mechanism/CURRENT_STATUS.md'}
for p in changed:
    need(p in allowed_exact or p.startswith(allowed_prefixes), f'unrelated branch change: {p}')

run_id = os.environ.get('GITHUB_RUN_ID', 'unknown')
head = git('rev-parse', 'HEAD')
checkpoint = ROOT / 'doc/continuous-local-geometry-representation/checkpoints/2026-09-03-final-repository-document-consistency-pass.md'
checkpoint.write_text(f'''# CLGR-STUDY1 Final Repository / Document Consistency Pass\n\nDate: 2026-09-03\n\n```text\nStudy = CLGR-STUDY1 / CLOSED / TECHNICAL-INVALID\nformal representation eligibility = NOT ESTABLISHED\nStage 1 = STAGE1-PASS / seed block CONSUMED\nStage 2 = TECHNICAL-INVALID / seed block CONSUMED / partial formal scientific reuse PROHIBITED\nStage 2 formal-result SHA-256 = {STAGE2_RESULT_SHA}\nprotected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED\nhistorical PROGRAM_PLAN blob = {PROGRAM_PLAN_BLOB} / UNCHANGED\nremote main = {BASELINE_MAIN} / UNCHANGED\nG3-10 = NOT AUTHORIZED / separate post-G3-09 current-state review required\nmain integration = NOT AUTHORIZED / NOT PERFORMED\naudit workflow run = {run_id}\naudit input branch HEAD = {head}\nchanged-path confinement = PASS\ncurrent-facing stale G3-09 authorization wording = NONE IN AUDITED SET\nfinal audit = PASS\n```\n\nThe research branch is scientifically closed and review-ready. No scientific recomputation and no main integration occurred during this audit.\n''', encoding='utf-8')

print(json.dumps({
    'auditDisposition':'FINAL-REPOSITORY-DOCUMENT-CONSISTENCY-PASS',
    'study':'CLGR-STUDY1',
    'formalDecision':'TECHNICAL-INVALID',
    'remoteMain':BASELINE_MAIN,
    'historicalProgramPlanBlob':PROGRAM_PLAN_BLOB,
    'protectedDepth10Access':False,
    'mainIntegration':False,
    'changedPathCount':len(changed),
    'auditInputHead':head,
    'workflowRun':run_id
}, sort_keys=True))
