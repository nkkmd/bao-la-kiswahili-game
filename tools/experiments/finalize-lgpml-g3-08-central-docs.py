from __future__ import annotations

from pathlib import Path
import re
import subprocess

ROOT = Path('.')
BRANCH = 'research/g3-08-local-geometry-persistence-memory-length'
EXPECTED_PROGRAM_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac'

FILES = {
    'root': Path('README.md'),
    'index': Path('doc/RESEARCH_INDEX.md'),
    'agenda': Path('doc/FUTURE_RESEARCH_AGENDA.md'),
    'rg3_readme': Path('doc/research-generation-3/README.md'),
    'rg3_status': Path('doc/research-generation-3/CURRENT_STATUS.md'),
    'program_plan': Path('doc/research-generation-3/PROGRAM_PLAN.md'),
}


def read(path: Path) -> str:
    return path.read_text(encoding='utf-8')


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding='utf-8')


def git(*args: str) -> str:
    return subprocess.check_output(['git', *args], text=True).strip()


def replace_one(text: str, pattern: str, replacement: str, label: str, flags: int = re.MULTILINE) -> str:
    matches = list(re.finditer(pattern, text, flags))
    if len(matches) != 1:
        raise RuntimeError(f'{label}: expected exactly one match, got {len(matches)}')
    return re.sub(pattern, lambda _m: replacement, text, count=1, flags=flags)


def append_once(text: str, marker: str, block: str) -> str:
    if marker in text:
        return text
    return text.rstrip() + '\n\n' + block.strip() + '\n'


def update_root() -> None:
    path = FILES['root']
    text = read(path)
    current_line = ('- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): '
        'Research Generation 3のcurrent-facing状態。G3-01 / G3-02 / G3-03 / G3-05 / G3-06 / G3-08は'
        '`CLOSED / TECHNICAL-INVALID`、LGTGMIVは`FORMAL-ELIGIBLE-ALL`、G3-04 / G3-07は'
        '`CLOSED / FORMAL-COMPLETE`。G3-08 / `LGPML-STUDY1`はStage 0 PASS後、exactly-one fresh Stage 1で'
        '`relay-limit enumeration` technical errorによりcomplete development populationへ到達せず、formal promoted set `[]`、'
        'Stage 2 `NOT-AUTHORIZED-NOT-EXECUTED`で閉鎖。protected depth-10はsealed。次はseparate post-G3-08 G3-09 authorization reviewで、G3-09は未承認。')
    text = replace_one(
        text,
        r'^- \[`doc/research-generation-3/CURRENT_STATUS\.md`\]\(doc/research-generation-3/CURRENT_STATUS\.md\):.*$',
        current_line,
        'root current-status bullet',
    )
    marker = '<!-- LGPML-G3-08-CLOSURE:ROOT-README -->'
    if marker not in text:
        block = '''<!-- LGPML-G3-08-CLOSURE:ROOT-README -->
- [`doc/local-geometry-persistence-memory-length/README.md`](doc/local-geometry-persistence-memory-length/README.md): Research Generation 3 `G3-08` / `LGPML-STUDY1` のtechnical-invalid closure入口。
- [`doc/local-geometry-persistence-memory-length/STUDY_1_FINAL_REPORT.md`](doc/local-geometry-persistence-memory-length/STUDY_1_FINAL_REPORT.md): G3-08のprospective contract、Stage 0/1 execution、relay-limit technical failure、no-rescue / interpretation boundaryの正本。
- [`doc/local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md`](doc/local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md): G3-08のsource binding、seed、Actions provenance、exact result hashes、protected-evidence boundary。
- [`doc/research-program-decisions/2026-09-03-g3-08-technical-invalid-closure.md`](doc/research-program-decisions/2026-09-03-g3-08-technical-invalid-closure.md): G3-08 `CLOSED / TECHNICAL-INVALID` program decision。G3-09は自動authorizeされない。'''
        text = text.replace(current_line, current_line + '\n' + block, 1)
    write(path, text)


def update_rg3_readme() -> None:
    path = FILES['rg3_readme']
    text = read(path)
    text = replace_one(
        text,
        r'^Status = .*$',
        'Status = ACTIVE / G3-08 LGPML-STUDY1 CLOSED TECHNICAL-INVALID / POST-G3-08 G3-09 CURRENT-STATE REVIEW REQUIRED / G3-09 NOT AUTHORIZED',
        'RG3 README status',
    )
    if 'G3-08 = LGPML-STUDY1 / CLOSED / TECHNICAL-INVALID' not in text:
        m = re.search(r'^G3-07 main integration = .*$', text, re.MULTILINE)
        if not m:
            raise RuntimeError('RG3 README G3-07 integration anchor missing')
        block = '''G3-08 program review = G3-08-AUTHORIZED
G3-08 = LGPML-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-08 Stage 0 = STAGE0-PASS
G3-08 Stage 1 = STAGE1-TECHNICAL-INVALID / 1 authorized / 1 actual / seeds CONSUMED
G3-08 technical error = relay-limit enumeration 74581ece7d29895d9727bb9cd507046f98a158b51466abdeaa335eb9e60d510e
G3-08 formal promoted candidate set = []
G3-08 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED / seeds NOT CONSUMED
G3-08 no-rescue boundary = CROSSED / ACTIVE
G3-08 main integration = NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED
G3-09 = NOT AUTHORIZED / separate post-G3-08 current-state review required'''
        text = text[:m.end()] + '\n' + block + text[m.end():]
    text = append_once(text, '<!-- LGPML-G3-08-CLOSURE:RG3-README -->', '''
<!-- LGPML-G3-08-CLOSURE:RG3-README -->
## G3-08 technical-invalid closure

G3-08は`LGPML-STUDY1`としてprospectively freezeされ、LGTGMIV F1-F5 / RAW-only / relative depth 5のboundaryでtrajectory上のgeometry change-sign persistenceを検証する設計だった。

Stage 0は`STAGE0-PASS`。fresh Stage 1はexactly one authorized executionで開始したが、10 trajectoryのcomplete frozen development populationを完遂する前にrequired bounded RAW reconstructionで`relay-limit enumeration`へ到達した。そのためcanonical Stage 1 dispositionは`STAGE1-TECHNICAL-INVALID`、formal promoted candidate setは`[]`である。

このclosureはgeometry persistenceのnegative/null scientific findingではない。9 complete trajectory logsを含むpartial outputはtechnical provenanceのみであり、candidate promotion、phase-specific persistence、bounded memory-lengthのscientific claimへ使用しない。

```text
G3-08 / LGPML-STUDY1 = CLOSED / TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed = CONSUMED
Stage 2 seed = NOT CONSUMED
same-evidence rescue = PROHIBITED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT PERFORMED
```

## Post-G3-08 boundary

Historical plan上の次候補G3-09 — Continuous Local-Geometry Representation Study 1 は**自動authorizeされない**。開始する場合はG3-08 closure後のcurrent repository stateを用いたseparate authorization reviewが必要である。
''')
    write(path, text)


def update_rg3_status() -> None:
    path = FILES['rg3_status']
    text = read(path)
    text = replace_one(
        text,
        r'^Program status = .*$',
        'Program status = ACTIVE / G3-08 LGPML-STUDY1 CLOSED TECHNICAL-INVALID / POST-G3-08 G3-09 REVIEW REQUIRED / G3-09 NOT AUTHORIZED',
        'RG3 status program line',
    )
    g308_block = '''G3-08 program review = G3-08-AUTHORIZED
G3-08 = LGPML-STUDY1 / CLOSED / TECHNICAL-INVALID
G3-08 Stage 0 = STAGE0-PASS
G3-08 Stage 1 = STAGE1-TECHNICAL-INVALID / 1 authorized / 1 actual
G3-08 Stage 1 seed = 31810001..31810256 / CONSUMED
G3-08 technical error = relay-limit enumeration 74581ece7d29895d9727bb9cd507046f98a158b51466abdeaa335eb9e60d510e
G3-08 formal promoted candidate set = []
G3-08 Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G3-08 Stage 2 seed = 31820001..31820384 / NOT CONSUMED
G3-08 no-rescue boundary = CROSSED / ACTIVE
G3-08 main integration = NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED
G3-09 = NOT AUTHORIZED / separate post-G3-08 current-state authorization review required'''
    if 'G3-08 = LGPML-STUDY1 / CLOSED / TECHNICAL-INVALID' not in text:
        text = replace_one(text, r'^G3-08 = .*$', g308_block, 'RG3 status G3-08 line')
    text = replace_one(
        text,
        r'^Active scientific research branch = .*$',
        f'Active scientific research branch = none / {BRANCH} scientifically CLOSED and pending explicit user decision on main integration',
        'RG3 status active branch',
    )
    text = replace_one(
        text,
        r'^Next scientific action = .*$',
        'Next scientific action = separate post-G3-08 current-state G3-09 authorization review; do not auto-start G3-09',
        'RG3 status next action',
    )
    text = append_once(text, '<!-- LGPML-G3-08-CLOSURE:RG3-STATUS -->', '''
<!-- LGPML-G3-08-CLOSURE:RG3-STATUS -->
## G3-08 formal lifecycle closure

```text
Study = LGPML-STUDY1
Stage 0 = STAGE0-PASS
Stage 1 = STAGE1-TECHNICAL-INVALID / exactly one authorized execution
Stage 1 run = 33731577464 / job 100572486927
Stage 1 result artifact = 9886738874
Stage 1 result ZIP SHA-256 = ef2ed1d6c28b30461d03f3a294cb3cb3d11d9f951fa24b6e6f2a94f546d6f53c
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
```

Canonical records:

- `../local-geometry-persistence-memory-length/STUDY_1_FINAL_REPORT.md`
- `../local-geometry-persistence-memory-length/CURRENT_STATUS.md`
- `../local-geometry-persistence-memory-length/DECISION_REGISTER.md`
- `../local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md`
- `../research-program-decisions/2026-09-03-g3-08-technical-invalid-closure.md`
- `checkpoints/2026-09-03-g3-08-technical-invalid-closure.md`

Partial Stage 1 trajectory outputはscientific findingとして再利用しない。G3-09は別のcurrent-state authorization reviewなしに開始しない。
''')
    write(path, text)


def update_agenda() -> None:
    path = FILES['agenda']
    text = read(path)
    text = replace_one(
        text,
        r'^Research Generation 3: \*\*.*\*\*$',
        'Research Generation 3: **Active / G3-08 `LGPML-STUDY1` closed `TECHNICAL-INVALID` / formal promoted candidate set `[]` / Stage 2 NOT-AUTHORIZED-NOT-EXECUTED / next action is separate post-G3-08 current-state G3-09 authorization review / G3-09 NOT AUTHORIZED (2026-09-03)**',
        'agenda RG3 status',
    )
    text = append_once(text, '<!-- LGPML-G3-08-CLOSURE:FUTURE -->', '''
<!-- LGPML-G3-08-CLOSURE:FUTURE -->
### 2026-09-03 G3-08 closure update

G3-08 `LGPML-STUDY1`は`CLOSED / TECHNICAL-INVALID`で閉鎖した。Stage 0はPASSしたが、fresh Stage 1のexactly-one authorized execution中にrequired depth-5 RAW reconstructionで`relay-limit enumeration`が発生し、complete 10-trajectory development populationへ到達しなかった。

```text
formal promoted candidate set = []
Stage 1 seed block = CONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seed block = NOT CONSUMED
same-evidence rescue = PROHIBITED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
```

このtechnical-invalid closureをgeometry persistenceのnegative/null evidenceとして扱わない。relay-limit-safeなlongitudinal studyが必要なら、新しいprospective independent Study/versionとして別途扱う。

Historical program plan上の次候補は**G3-09 — Continuous Local-Geometry Representation Study 1**だが、G3-08 closureから自動authorizeされない。開始前にpost-G3-08 current-state authorization reviewが必要である。
''')
    write(path, text)


def update_index() -> None:
    path = FILES['index']
    text = read(path)
    text = append_once(text, '<!-- LGPML-G3-08-CLOSURE:RESEARCH-INDEX -->', '''
<!-- LGPML-G3-08-CLOSURE:RESEARCH-INDEX -->
### G3-08 — Local Geometry Persistence / Memory-Length Study 1

**Study ID:** `LGPML-STUDY1`  
**Status:** `CLOSED / TECHNICAL-INVALID`

G3-08はLGTGMIV F1-F5 / RAW-only / relative depth 5を用いて、trajectory上のone-ply geometry change signのlag `{1,2,4,8}`におけるpersistence / reversalとbounded memory lengthをprospectively検証するStudyとして開始した。

Stage 0はPASSし、fresh Stage 1はexactly one authorized executionで開始した。しかしfrozen 10-trajectory development populationを完遂する前にrequired bounded RAW reconstructionで`relay-limit enumeration` technical errorが発生したため、Stage 1は`STAGE1-TECHNICAL-INVALID`、formal promoted candidate setは`[]`となった。Stage 2は`NOT-AUTHORIZED-NOT-EXECUTED`。

これはlocal geometry persistenceのnegative/null scientific resultではない。partial 9 trajectory logsはtechnical provenanceのみで、candidate promotionやmemory-length claimへ使用しない。

**最初に読む:**

- [`local-geometry-persistence-memory-length/README.md`](local-geometry-persistence-memory-length/README.md)
- [`local-geometry-persistence-memory-length/STUDY_1_FINAL_REPORT.md`](local-geometry-persistence-memory-length/STUDY_1_FINAL_REPORT.md)

**詳細・正本:**

- [`local-geometry-persistence-memory-length/CURRENT_STATUS.md`](local-geometry-persistence-memory-length/CURRENT_STATUS.md)
- [`local-geometry-persistence-memory-length/DECISION_REGISTER.md`](local-geometry-persistence-memory-length/DECISION_REGISTER.md)
- [`local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md`](local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md)
- [`research-program-decisions/2026-09-03-g3-08-technical-invalid-closure.md`](research-program-decisions/2026-09-03-g3-08-technical-invalid-closure.md)
- [`research-generation-3/checkpoints/2026-09-03-g3-08-technical-invalid-closure.md`](research-generation-3/checkpoints/2026-09-03-g3-08-technical-invalid-closure.md)

Stage 2 seed blockは未消費、protected depth-10 holdoutはsealedのまま。mainへの統合はユーザーの明示指示まで行わない。
''')
    write(path, text)


def verify() -> None:
    branch = git('branch', '--show-current')
    if branch != BRANCH:
        raise RuntimeError(f'wrong branch: {branch}')
    blob = git('hash-object', str(FILES['program_plan']))
    if blob != EXPECTED_PROGRAM_PLAN_BLOB:
        raise RuntimeError(f'PROGRAM_PLAN blob changed: {blob}')

    root = read(FILES['root'])
    index = read(FILES['index'])
    agenda = read(FILES['agenda'])
    rg3r = read(FILES['rg3_readme'])
    rg3s = read(FILES['rg3_status'])

    required = [
        ('root', root, 'LGPML-STUDY1'),
        ('index', index, '<!-- LGPML-G3-08-CLOSURE:RESEARCH-INDEX -->'),
        ('agenda', agenda, 'G3-09 NOT AUTHORIZED'),
        ('rg3 README', rg3r, 'G3-08 = LGPML-STUDY1 / CLOSED / TECHNICAL-INVALID'),
        ('rg3 status', rg3s, 'G3-08 = LGPML-STUDY1 / CLOSED / TECHNICAL-INVALID'),
    ]
    for label, text, token in required:
        if token not in text:
            raise RuntimeError(f'{label}: missing {token}')
    if 'PROGRAM_PLAN.md' not in root:
        raise RuntimeError('root README lost PROGRAM_PLAN reference')


def main() -> None:
    verify_pre = git('hash-object', str(FILES['program_plan']))
    if verify_pre != EXPECTED_PROGRAM_PLAN_BLOB:
        raise RuntimeError('PROGRAM_PLAN changed before finalization')
    update_root()
    update_rg3_readme()
    update_rg3_status()
    update_agenda()
    update_index()
    verify()
    changed = git('diff', '--name-only').splitlines()
    allowed = {str(FILES[k]) for k in ('root','index','agenda','rg3_readme','rg3_status')}
    unexpected = sorted(set(changed) - allowed)
    if unexpected:
        raise RuntimeError(f'unexpected changed files: {unexpected}')
    print('LGPML_G3_08_CENTRAL_DOCS_FINALIZED')
    for p in sorted(changed):
        print(p)


if __name__ == '__main__':
    main()
