from pathlib import Path
import subprocess
import sys

FILES = [
    ('doc/research-generation-3/README.md', '<!-- LGTGGC-G3-12-RG3-STATUS:BEGIN -->', '<!-- LGTGGC-G3-12-RG3-STATUS:END -->'),
    ('doc/research-generation-3/CURRENT_STATUS.md', '<!-- LGTGGC-G3-12-RG3-CURRENT:BEGIN -->', '<!-- LGTGGC-G3-12-RG3-CURRENT:END -->'),
]
G11_START = 'G3-11 program review = G3-11-AUTHORIZED\n'
G11_END = 'G3-11 main integration = COMPLETE / FAST-FORWARD / source tip 03d1b5bf28ed45aaa9480f0a7c5efc6d394fcbae / previous main e537199a959c0808cbef6cf8aaeb1caab91e3702 / force=false\n'
AUDIT_PATH = Path('doc/research-generation-3/checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md')
EXPECTED_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac'
TEMP_PATHS = [
    Path('.github/workflows/rg3-program-closure-agenda-ordering.yml'),
    Path('tools/experiments/finalize-rg3-agenda-ordering.py'),
    Path('doc/research-generation-3/authorizations/rg3-program-closure-agenda-ordering-trigger.txt'),
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
    'doc/research-generation-3/checkpoints/2026-09-04-research-generation-3-final-polish-consistency-pass.md',
    'doc/research-generation-3/checkpoints/2026-09-04-research-generation-3-final-repository-document-consistency-pass.md',
    'doc/research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md',
    'doc/research-program-decisions/2026-09-04-research-generation-3-program-closure.md',
}


def git(*args):
    return subprocess.check_output(['git', *args], text=True).strip()


def reorder(path, g12_start_marker, g12_end_marker):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    s12 = text.index(g12_start_marker)
    e12 = text.index(g12_end_marker, s12) + len(g12_end_marker)
    while e12 < len(text) and text[e12] == '\n':
        e12 += 1
    s11 = text.index(G11_START)
    e11 = text.index(G11_END, s11) + len(G11_END)
    if not s12 < s11:
        raise RuntimeError(f'{path}: G3-12 block is not before G3-11; unexpected pre-state')
    block12 = text[s12:e12].strip('\n')
    block11 = text[s11:e11].strip('\n')
    text = text[:s12] + block11 + '\n' + block12 + '\n' + text[e11:]
    p.write_text(text, encoding='utf-8')


def apply():
    for args in FILES:
        reorder(*args)


def audit():
    for p in TEMP_PATHS:
        if p.exists():
            raise RuntimeError(f'temporary ordering tooling still present: {p}')

    if git('hash-object', 'doc/research-generation-3/PROGRAM_PLAN.md') != EXPECTED_PLAN_BLOB:
        raise RuntimeError('historical PROGRAM_PLAN changed')

    for path, _, _ in FILES:
        text = Path(path).read_text(encoding='utf-8')
        positions = [
            text.index('G3-10 program review = G3-10-AUTHORIZED'),
            text.index('G3-11 program review = G3-11-AUTHORIZED'),
            text.index('G3-12 program review = G3-12-AUTHORIZED'),
        ]
        if positions != sorted(positions):
            raise RuntimeError(f'{path}: G3-10/G3-11/G3-12 ordering is not ascending')

    if Path('doc/research-generation-3/README.md').read_text(encoding='utf-8').count('- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)') != 1:
        raise RuntimeError('RG3 README CURRENT_STATUS link count is not exactly one')

    main_head = git('rev-parse', 'origin/main')
    if git('merge-base', 'origin/main', 'HEAD') != main_head:
        raise RuntimeError('closure branch lost fast-forward ancestry')

    audit = AUDIT_PATH.read_text(encoding='utf-8')
    insertion_anchor = '4. Added a machine-readable `repositoryClosure` block recording central sync completion, final pre-main audit PASS, temporary tooling absence, and pre-main readiness.\n'
    addition = '5. Normalized the generation status presentation to agenda order `G3-10 → G3-11 → G3-12` in RG3 README and RG3 CURRENT_STATUS.\n'
    if addition not in audit:
        if audit.count(insertion_anchor) != 1:
            raise RuntimeError('final audit polish list anchor not found exactly once')
        audit = audit.replace(insertion_anchor, insertion_anchor + addition, 1)

    followup = f'''\n## Final agenda-order follow-up\n\n```text\nCommitted branch HEAD before ordering commit = {git('rev-parse', 'HEAD')}\nCurrent main HEAD = {main_head}\nG3-10/G3-11/G3-12 status order = PASS\nscientific decision changes = NONE\nscientific seed access = NONE\nmain integration = NOT AUTHORIZED / NOT PERFORMED\n```\n\nThis final presentation-only correction preserves all previously audited scientific and repository boundaries.\n'''
    if '## Final agenda-order follow-up' not in audit:
        audit += followup
    AUDIT_PATH.write_text(audit, encoding='utf-8')

    final_diff = set(filter(None, git('diff', '--name-only', 'origin/main').splitlines()))
    if final_diff != EXPECTED_FINAL_DIFF:
        raise RuntimeError(f'final diff mismatch: missing={sorted(EXPECTED_FINAL_DIFF-final_diff)}, extra={sorted(final_diff-EXPECTED_FINAL_DIFF)}')

    print('RG3 agenda ordering final audit PASS')


if __name__ == '__main__':
    if len(sys.argv) != 2 or sys.argv[1] not in {'--apply', '--audit'}:
        raise SystemExit('usage: finalize-rg3-agenda-ordering.py --apply|--audit')
    apply() if sys.argv[1] == '--apply' else audit()
