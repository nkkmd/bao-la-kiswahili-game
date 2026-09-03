from __future__ import annotations

from pathlib import Path
import hashlib
import json
import re
import subprocess

ROOT = Path('.')
FILES = {
    'root': Path('README.md'),
    'index': Path('doc/RESEARCH_INDEX.md'),
    'agenda': Path('doc/FUTURE_RESEARCH_AGENDA.md'),
    'rg3_readme': Path('doc/research-generation-3/README.md'),
    'rg3_status': Path('doc/research-generation-3/CURRENT_STATUS.md'),
    'program_plan': Path('doc/research-generation-3/PROGRAM_PLAN.md'),
}
EXPECTED_PROGRAM_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac'
RESULT_SHA = '05a87f0562a1e2e4ed8043107bd3212d2a223548b817d6922057668fb8cc49f9'
BRANCH = 'research/g3-07-search-instability-local-geometry-mechanism'


def read(path: Path) -> str:
    return path.read_text(encoding='utf-8')


def write(path: Path, text: str) -> None:
    path.write_text(text, encoding='utf-8')


def git_blob(path: Path) -> str:
    return subprocess.check_output(['git', 'hash-object', str(path)], text=True).strip()


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def replace_one(text: str, pattern: str, replacement: str, label: str, flags: int = re.MULTILINE) -> str:
    found = re.findall(pattern, text, flags)
    if len(found) != 1:
        raise RuntimeError(f'{label}: expected exactly one match, got {len(found)}')
    return re.sub(pattern, lambda _m: replacement, text, count=1, flags=flags)


def append_once(text: str, marker: str, block: str) -> str:
    if marker in text:
        return text
    return text.rstrip() + '\n\n' + block.strip() + '\n'


def update_root() -> None:
    path = FILES['root']
    text = read(path)
    current_line = '- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing状態。G3-01 / G3-02 / G3-03 / G3-05 / G3-06は`CLOSED / TECHNICAL-INVALID`、LGTGMIVは`FORMAL-ELIGIBLE-ALL`、G3-04は`CLOSED / FORMAL-COMPLETE`。G3-07 / `SILGM-STUDY1`も`CLOSED / FORMAL-COMPLETE`となり、Stage 2では8 promoted candidates中7 estimable、3 `CONFIRMED` / 4 `NOT-CONFIRMED` / 1 `NON-ESTIMABLE`。3 confirmationsはいずれもG1 root legal width × E3 ranking-preorder changeの`HIGHER-IN-HIGH`で、depth / node-budget / quiescenceの各peer contrastに対するbounded non-causal association。protected depth-10はsealed。次はseparate post-G3-07 G3-08 authorization reviewで、G3-08は未承認。'
    text = replace_one(
        text,
        r'^- \[`doc/research-generation-3/CURRENT_STATUS\.md`\]\(doc/research-generation-3/CURRENT_STATUS\.md\):.*$',
        current_line,
        'root current-status bullet',
    )
    marker = '<!-- SILGM-G3-07-CLOSURE:ROOT-README -->'
    if marker not in text:
        if current_line not in text:
            raise RuntimeError('root README anchor missing after replacement')
        extra = '''<!-- SILGM-G3-07-CLOSURE:ROOT-README -->
- [`doc/search-instability-local-geometry-mechanism/README.md`](doc/search-instability-local-geometry-mechanism/README.md): Research Generation 3 `G3-07` / `SILGM-STUDY1` のformal-complete研究入口。
- [`doc/search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md`](doc/search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md): G3-07のStage 0–2 execution、8 candidateのformal判定、3 confirmations、interpretation boundaryの正本。
- [`doc/search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md`](doc/search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md): G3-07のsource binding、seed、Actions provenance、exact hashes、no-rescue / protected-evidence boundary。
- [`doc/research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md`](doc/research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md): G3-07 `CLOSED / FORMAL-COMPLETE` program decision。G3-08は自動authorizeされない。
- [`doc/research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md`](doc/research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md): RG3側のG3-07 closure checkpoint。main integrationは未実施。'''
        text = text.replace(current_line, current_line + '\n' + extra, 1)
    write(path, text)


def update_rg3_readme() -> None:
    path = FILES['rg3_readme']
    text = read(path)
    text = replace_one(
        text,
        r'^Status = .*$',
        'Status = ACTIVE / G3-07 SILGM-STUDY1 CLOSED FORMAL-COMPLETE / POST-G3-07 G3-08 CURRENT-STATE REVIEW REQUIRED / G3-08 NOT AUTHORIZED',
        'RG3 README status',
    )
    g306 = 'G3-06 no-rescue boundary = CROSSED / ACTIVE'
    if g306 not in text:
        raise RuntimeError('RG3 README G3-06 anchor missing')
    if 'G3-07 = SILGM-STUDY1 / CLOSED / FORMAL-COMPLETE' not in text:
        block = '''G3-07 program review = G3-07-AUTHORIZED
G3-07 = SILGM-STUDY1 / CLOSED / FORMAL-COMPLETE
G3-07 Stage 0 = STAGE0-PASS
G3-07 Stage 1 = STAGE1-PASS / 1 authorized / 1 actual / seed CONSUMED
G3-07 Stage 2 = STAGE2-PASS / 1 authorized / 1 actual / seed CONSUMED
G3-07 formal record = 8 promoted / 7 estimable / 3 CONFIRMED / 4 NOT-CONFIRMED / 1 NON-ESTIMABLE
G3-07 confirmed family = G1 ROOT-LEGAL-WIDTH x E3 RANKING-PREORDER-CHANGE / HIGHER-IN-HIGH under SC1 depth, SC2 node-budget, SC3 quiescence
G3-07 main integration = NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED
G3-08 = NOT AUTHORIZED / separate post-G3-07 current-state review required'''
        text = text.replace(g306, g306 + '\n' + block, 1)
    read_anchor = '- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing program state'
    if read_anchor not in text:
        raise RuntimeError('RG3 README read-first anchor missing')
    read_marker = '<!-- SILGM-G3-07-CLOSURE:RG3-READ-FIRST -->'
    if read_marker not in text:
        links = '''<!-- SILGM-G3-07-CLOSURE:RG3-READ-FIRST -->
- [`../search-instability-local-geometry-mechanism/README.md`](../search-instability-local-geometry-mechanism/README.md) — G3-07 formal-complete Study入口
- [`../search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md`](../search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md) — G3-07 formal result / interpretation boundary正本
- [`../search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md`](../search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md) — G3-07 reproducibility provenance
- [`../research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md`](../research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md) — G3-07 program closure / G3-08 not auto-authorized'''
        text = text.replace(read_anchor, read_anchor + '\n' + links, 1)
    text = append_once(text, '<!-- SILGM-G3-07-CLOSURE:RG3-README -->', '''
<!-- SILGM-G3-07-CLOSURE:RG3-README -->
## G3-07 formal closure

G3-07は`SILGM-STUDY1`として、Stage 0 `STAGE0-PASS`、fresh Stage 1 `STAGE1-PASS`、held-out Stage 2 `STAGE2-PASS`まで完了し、`CLOSED / FORMAL-COMPLETE`で閉じた。

Stage 1は24 Namua + 24 Mtajiから8 formal hypothesesをpromotionした。Stage 2はfresh 36 Namua + 36 Mtajiでexactly one authorized executionを行い、7 estimable / 1 non-estimableとなった。Holm-Bonferroni FWER 1/20後、次の3 candidateが`CONFIRMED / HIGHER-IN-HIGH`となった。

1. depth × E3 ranking-preorder change × G1 root legal width
2. node-budget × E3 ranking-preorder change × G1 root legal width
3. quiescence × E3 ranking-preorder change × G1 root legal width

これはfrozen population / RAW-only relative depth 5 / frozen peer-search contrasts内のbounded non-causal associationである。root widthがsearch instabilityを因果的に生む、より深い/大きい/高quiescence searchが正しい、ranking changeが悪手を意味する、human/game-theoretic difficultyを示す、とは解釈しない。

残るpromoted hypothesesは4 `NOT-CONFIRMED` / 1 `NON-ESTIMABLE`。救済・threshold変更・seed extension・same-evidence rerunは行わない。

Protected standard-initial RAW-root complete exact depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`のままである。

## Post-G3-07 boundary

Historical plan上の次候補G3-08 — Local Geometry Persistence / Memory-Length Study 1 は**自動authorizeされない**。G3-08を開始する場合は、G3-07 closure後のcurrent repository stateを用いたseparate authorization reviewが必要である。

G3-07 research branchのmain integrationもStudy closureではauthorizeされない。ユーザーの明示的指示があるまで`main`へ統合しない。
''')
    write(path, text)


def update_rg3_status() -> None:
    path = FILES['rg3_status']
    text = read(path)
    text = replace_one(
        text,
        r'^Program status = .*$',
        'Program status = ACTIVE / G3-07 SILGM-STUDY1 CLOSED FORMAL-COMPLETE / POST-G3-07 G3-08 REVIEW REQUIRED / G3-08 NOT AUTHORIZED',
        'RG3 CURRENT_STATUS program status',
    )
    text = replace_one(
        text,
        r'^G3-07 program review = G3-07-AUTHORIZED\nG3-07 = .*\nG3-07 fresh Stage 1 = .*$',
        '''G3-07 program review = G3-07-AUTHORIZED
G3-07 = SILGM-STUDY1 / CLOSED / FORMAL-COMPLETE
G3-07 Stage 0 = STAGE0-PASS
G3-07 Stage 1 = STAGE1-PASS / 1 authorized / 1 actual / seeds CONSUMED
G3-07 Stage 2 = STAGE2-PASS / 1 authorized / 1 actual / seeds CONSUMED
G3-07 formal record = 8 promoted / 7 estimable / 3 CONFIRMED / 4 NOT-CONFIRMED / 1 NON-ESTIMABLE
G3-07 confirmed family = G1 ROOT-LEGAL-WIDTH x E3 RANKING-PREORDER-CHANGE / HIGHER-IN-HIGH under SC1/SC2/SC3
G3-07 no-rescue boundary = CROSSED / CLOSED
G3-08 = NOT AUTHORIZED / separate post-G3-07 current-state authorization review required''',
        'RG3 CURRENT_STATUS G3-07 block',
    )
    text = replace_one(
        text,
        r'^Active scientific research branch = .*$',
        f'Active scientific research branch = none / {BRANCH} scientifically CLOSED and pending explicit user decision on integration',
        'RG3 CURRENT_STATUS active branch',
    )
    text = replace_one(
        text,
        r'^Next scientific action = .*$',
        'Next scientific action = separate post-G3-07 current-state G3-08 authorization review; do not auto-start G3-08',
        'RG3 CURRENT_STATUS next action',
    )
    text = append_once(text, '<!-- SILGM-G3-07-CLOSURE:RG3-STATUS -->', f'''
<!-- SILGM-G3-07-CLOSURE:RG3-STATUS -->
## G3-07 formal closure

G3-07 `SILGM-STUDY1` is `CLOSED / FORMAL-COMPLETE`.

```text
Stage 1 = STAGE1-PASS / 24 Namua + 24 Mtaji / 8 promoted
Stage 2 = STAGE2-PASS / 36 Namua + 36 Mtaji
formal = 7 estimable / 3 CONFIRMED / 4 NOT-CONFIRMED / 1 NON-ESTIMABLE
Stage 2 canonical result SHA-256 = {RESULT_SHA}
Stage 2 selection exact = true
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
main integration = NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED
```

Confirmed candidate identities are separately retained, not combined into a new omnibus test:

1. depth × E3 ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`
2. node-budget × E3 ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`
3. quiescence × E3 ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`

Canonical records:

- `../search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md`
- `../search-instability-local-geometry-mechanism/CURRENT_STATUS.md`
- `../search-instability-local-geometry-mechanism/DECISION_REGISTER.md`
- `../search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md`
- `../research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md`
- `checkpoints/2026-09-03-g3-07-formal-complete-closure.md`

G3-08 remains `NOT AUTHORIZED`; a separate post-G3-07 current-state review is required.
''')
    write(path, text)


def update_agenda() -> None:
    path = FILES['agenda']
    text = read(path)
    text = replace_one(
        text,
        r'^Research Generation 3: \*\*.*\*\*$',
        'Research Generation 3: **Active / G3-07 `SILGM-STUDY1` closed `FORMAL-COMPLETE` / 3 `CONFIRMED`, 4 `NOT-CONFIRMED`, 1 `NON-ESTIMABLE` formal candidates / next action is separate post-G3-07 current-state G3-08 authorization review / G3-08 NOT AUTHORIZED (2026-09-03)**',
        'FUTURE_RESEARCH_AGENDA RG3 status',
    )
    heading = '### 2026-09-03 Research Generation 3 current update'
    if heading not in text:
        raise RuntimeError('agenda current update heading missing')
    marker = '<!-- SILGM-G3-07-CLOSURE:FUTURE -->'
    if marker not in text:
        paragraph = '''<!-- SILGM-G3-07-CLOSURE:FUTURE -->
G3-07 `SILGM-STUDY1`はLGTGMIV F1-F5 / RAW-only / relative depth 5のformal-eligible geometryと、depth / node-budget / quiescenceの3 peer search-condition perturbationに対するE1–E5 search-output changeとのbounded non-causal associationをprospectively検証して完了した。Stage 1 fresh 24 Namua + 24 Mtajiから8 candidateをpromotionし、Stage 2 fresh 36 Namua + 36 Mtajiをexactly one authorized formal executionで測定した。Stage 2は`STAGE2-PASS`、7 estimable / 1 non-estimable。Holm-Bonferroni FWER 1/20後、depth・node-budget・quiescenceの各contrastでG1 root legal width × E3 ranking-preorder changeが`CONFIRMED / HIGHER-IN-HIGH`となった。残りは4 `NOT-CONFIRMED` / 1 `NON-ESTIMABLE`。これはroot legal widthがsearch instabilityを因果的に生む、より強いsearch条件が正しい、ranking changeが悪手を意味する、game-theoretic / human difficultyを示す、という結論ではない。Stage 1/2 seedはconsume済みでsame-evidence rerun / seed extension / candidate rescueを行わない。protected depth-10 holdoutは`SEALED / NOT GENERATED / NOT READ / NOT PEEKED`のまま。historical plan上のG3-08は自動authorizeされず、separate post-G3-07 current-state reviewが必要。G3-07のmain integrationも明示的ユーザー指示までは行わない。'''
        text = text.replace(heading, heading + '\n\n' + paragraph, 1)
    write(path, text)


def update_index() -> None:
    path = FILES['index']
    text = read(path)
    text = append_once(text, '<!-- SILGM-G3-07-CLOSURE:RESEARCH-INDEX -->', '''
<!-- SILGM-G3-07-CLOSURE:RESEARCH-INDEX -->
### G3-07 — Search Instability / Local Geometry Mechanism Study 1

**Study ID:** `SILGM-STUDY1`  
**Status:** `CLOSED / FORMAL-COMPLETE`

G3-07はLGTGMIV F1-F5 / RAW-only / relative depth 5のbounded local geometryと、depth・node-budget・quiescenceのpeer search-condition perturbation間で生じるbest-move / TopSet / ranking / score-gap / PV変化のassociationをprospectively検証した。

Stage 1はfresh 24 Namua + 24 Mtajiで`STAGE1-PASS`、15 contrast×endpoint slotsから8 candidateをpromotion。Stage 2はfresh 36 Namua + 36 Mtajiで`STAGE2-PASS`、7 estimable / 1 non-estimable、Holm-Bonferroni FWER 1/20後に3 candidateを`CONFIRMED`した。

Confirmed:

1. depth × E3 ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`
2. node-budget × E3 ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`
3. quiescence × E3 ranking-preorder change × G1 root legal width / `HIGHER-IN-HIGH`

その他は4 `NOT-CONFIRMED` / 1 `NON-ESTIMABLE`。formal resultはcandidate-levelのbounded non-causal associationに限定し、root legal widthのcausal mechanism、objective-best correctness、game-theoretic difficulty、human difficulty、depth >5 generalizationへ拡張しない。

Canonical records:

- [`search-instability-local-geometry-mechanism/README.md`](search-instability-local-geometry-mechanism/README.md)
- [`search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md`](search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md)
- [`search-instability-local-geometry-mechanism/CURRENT_STATUS.md`](search-instability-local-geometry-mechanism/CURRENT_STATUS.md)
- [`search-instability-local-geometry-mechanism/DECISION_REGISTER.md`](search-instability-local-geometry-mechanism/DECISION_REGISTER.md)
- [`search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md`](search-instability-local-geometry-mechanism/REPRODUCIBILITY_INDEX.md)
- [`research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md`](research-program-decisions/2026-09-03-g3-07-formal-complete-closure.md)
- [`research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md`](research-generation-3/checkpoints/2026-09-03-g3-07-formal-complete-closure.md)

**Downstream boundary:** G3-08 — Local Geometry Persistence / Memory-Length Study 1 is not automatically authorized. A separate post-G3-07 current-state authorization review is required. Protected depth-10 remains sealed. G3-07 research branch is not integrated to `main` without explicit user instruction.
''')
    write(path, text)


def verify() -> dict:
    actual_plan = git_blob(FILES['program_plan'])
    if actual_plan != EXPECTED_PROGRAM_PLAN_BLOB:
        raise RuntimeError(f'PROGRAM_PLAN changed: {actual_plan} != {EXPECTED_PROGRAM_PLAN_BLOB}')
    texts = {key: read(FILES[key]) for key in ['root', 'index', 'agenda', 'rg3_readme', 'rg3_status']}
    for label, text in texts.items():
        if 'SILGM-STUDY1' not in text:
            raise RuntimeError(f'{label}: SILGM-STUDY1 missing')
        if 'G3-08' not in text:
            raise RuntimeError(f'{label}: G3-08 boundary missing')
    if RESULT_SHA not in texts['rg3_status']:
        raise RuntimeError('RG3 status canonical result SHA missing')
    if 'NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED' not in texts['rg3_status']:
        raise RuntimeError('RG3 status main-integration firewall missing')
    if 'main integration = NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED' not in texts['rg3_readme']:
        raise RuntimeError('RG3 README integration firewall missing')
    if 'NOT PEEKED' not in texts['agenda']:
        raise RuntimeError('agenda protected holdout wording incomplete')
    if 'doc/search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md' not in texts['root']:
        raise RuntimeError('root G3-07 final report link missing')
    if 'search-instability-local-geometry-mechanism/STUDY_1_FINAL_REPORT.md' not in texts['index']:
        raise RuntimeError('index G3-07 final report link missing')
    return {
        'verified': True,
        'programPlanBlob': actual_plan,
        'files': {
            key: {'path': str(path), 'sha256': sha256(path), 'gitBlob': git_blob(path)}
            for key, path in FILES.items()
        },
        'protectedDepth10': 'SEALED-NOT-GENERATED-NOT-READ-NOT-PEEKED',
        'mainIntegration': 'NOT-PERFORMED-EXPLICIT-USER-INSTRUCTION-REQUIRED',
    }


def main() -> None:
    import sys
    verify_only = '--verify-only' in sys.argv
    if not verify_only:
        update_root()
        update_rg3_readme()
        update_rg3_status()
        update_agenda()
        update_index()
    print(json.dumps(verify(), ensure_ascii=False, separators=(',', ':')))


if __name__ == '__main__':
    main()
