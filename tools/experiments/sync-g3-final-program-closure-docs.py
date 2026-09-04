from pathlib import Path
import re

root = Path('.')


def read(path):
    return (root / path).read_text(encoding='utf-8')


def write(path, text):
    (root / path).write_text(text, encoding='utf-8')


def insert_before(path, marker, block):
    text = read(path)
    if block.strip() in text:
        return
    if marker not in text:
        raise RuntimeError(f'{path}: marker not found: {marker}')
    write(path, text.replace(marker, block.rstrip() + '\n\n' + marker, 1))


def regex_replace(path, pattern, replacement, expected_new):
    text = read(path)
    if expected_new in text:
        return
    text2, n = re.subn(pattern, replacement, text, count=1, flags=re.MULTILINE)
    if n != 1:
        raise RuntimeError(f'{path}: regex replacement failed: {pattern}')
    write(path, text2)


# Root README
root_block = '''<!-- RG3-FINAL-CLOSURE-ROOT:BEGIN -->
- [`doc/research-generation-3/FINAL_SYNTHESIS.md`](doc/research-generation-3/FINAL_SYNTHESIS.md): **Research Generation 3 core program final synthesis**。`G3-01..G3-12`はprospective stop ruleに従って全てclosureし、program statusは`CLOSED / MAIN INTEGRATION PENDING`。formal-completeな主要結果はG3-04 corridor/funnel、G3-07 geometry×search-instability association、G3-10 longitudinal geometry dynamics、G3-11 protected depth-10 exact holdout。technical-invalid Studyはnegative/null resultへ読み替えず、G3-12はformal generalization/counterexample Stage 2未実行のままtechnical-invalid closure。G3-H01は`DEFERRED / INDEPENDENT / NON-BLOCKING`。generation closureのmain統合は明示的指示待ち。
<!-- RG3-FINAL-CLOSURE-ROOT:END -->'''
insert_before('README.md', '<!-- LGTGGC-G3-12-ROOT-README:BEGIN -->', root_block)

p = 'README.md'
text = read(p)
lines = text.splitlines()
new_line = '- [`doc/research-generation-3/CURRENT_STATUS.md`](doc/research-generation-3/CURRENT_STATUS.md): Research Generation 3のcurrent-facing closure state。core agenda `G3-01..G3-12`は`CLOSED`、closure branchは`research/g3-final-program-closure`、final synthesis / machine-readable final result / program closure decisionをmaterialize済み。G3-H01はdeferred non-blocking。`main` integrationは明示的ユーザー指示待ち。'
if new_line not in lines:
    found = False
    for i, line in enumerate(lines):
        if line.startswith('- [`doc/research-generation-3/CURRENT_STATUS.md`]'):
            lines[i] = new_line
            found = True
            break
    if not found:
        raise RuntimeError('README.md: RG3 CURRENT_STATUS index line not found')
write(p, '\n'.join(lines) + ('\n' if text.endswith('\n') else ''))

# Research Index
index_block = '''<!-- RG3-FINAL-CLOSURE-RESEARCH-INDEX:BEGIN -->
### Research Generation 3 — program closure

**状態:** `CLOSED / MAIN INTEGRATION PENDING`

Research Generation 3 core agenda `G3-01..G3-12`は、prospective `PROGRAM_PLAN.md` Section 16の14 completion conditionsを満たしてprogram-level closureした。positive resultだけでなく、`TECHNICAL-INVALID`、`NOT-CONFIRMED`、`NON-ESTIMABLE`、formal-eligible prerequisite、protected exact holdoutを元の意味のまま保存する。主要なformal-complete結果はG3-04、G3-07、G3-10、G3-11。G3-12は`CLOSED / TECHNICAL-INVALID`でformal generalization/counterexample decisionなし。G3-H01は`DEFERRED / INDEPENDENT / NON-BLOCKING`。

**Generation-level正本:**

- [`research-generation-3/FINAL_SYNTHESIS.md`](research-generation-3/FINAL_SYNTHESIS.md)
- [`research-generation-3/PROGRAM_FINAL_RESULT.json`](research-generation-3/PROGRAM_FINAL_RESULT.json)
- [`research-generation-3/CURRENT_STATUS.md`](research-generation-3/CURRENT_STATUS.md)
- [`research-program-decisions/2026-09-04-research-generation-3-program-closure.md`](research-program-decisions/2026-09-04-research-generation-3-program-closure.md)
- [`research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md`](research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md)

`main` integrationは明示的ユーザー指示まで実行しない。
<!-- RG3-FINAL-CLOSURE-RESEARCH-INDEX:END -->'''
insert_before('doc/RESEARCH_INDEX.md', '<!-- LGTGGC-G3-12-RESEARCH-INDEX:BEGIN -->', index_block)
regex_replace(
    'doc/RESEARCH_INDEX.md',
    r'^### Research Generation 3 current highlight — G3-12 / LGTGGC-STUDY1$',
    '### Research Generation 3 final core Study — G3-12 / LGTGGC-STUDY1',
    '### Research Generation 3 final core Study — G3-12 / LGTGGC-STUDY1'
)

# Future agenda
future_status = 'Research Generation 3: **Closed on closure branch / core agenda G3-01..G3-12 complete / final synthesis materialized / G3-H01 deferred non-blocking / main integration pending explicit instruction (2026-09-04)**'
regex_replace(
    'doc/FUTURE_RESEARCH_AGENDA.md',
    r'^Research Generation 3: \*\*Active / core agenda G3-01\.\.G3-12.*$',
    future_status,
    future_status
)
future_block = '''<!-- RG3-FINAL-CLOSURE:FUTURE:BEGIN -->
### 2026-09-04 Research Generation 3 final program closure

Research Generation 3 core agenda `G3-01..G3-12`はprogram-levelに`CLOSED`。prospective `PROGRAM_PLAN.md` Section 16の14 completion conditionsは全てPASSした。Generation-level正本は[`research-generation-3/FINAL_SYNTHESIS.md`](research-generation-3/FINAL_SYNTHESIS.md)、machine-readable final stateは[`research-generation-3/PROGRAM_FINAL_RESULT.json`](research-generation-3/PROGRAM_FINAL_RESULT.json)、closure decisionは[`research-program-decisions/2026-09-04-research-generation-3-program-closure.md`](research-program-decisions/2026-09-04-research-generation-3-program-closure.md)。

第三世代はbounded local-game-tree geometryについて、formal-eligible measurement foundation、限定的corridor/funnel phase structure、geometry×search-instability association、resource-bounded continuous longitudinal dynamics、standard-root depth-10 exact continuationを確立した。一方、universal branching/transposition/rule-mechanism/memory/generalization law、whole-Bao state/game-tree size、game-theoretic/human claimは確立していない。technical-invalid Studyはnegative/null resultへ読み替えない。G3-11 depth-10 same-evidence rerunとdepth 11、G3-12 Stage 1 repair/replayとStage 2 accessは禁止境界を維持する。G3-H01は`DEFERRED / INDEPENDENT / NON-BLOCKING`。

Research Generation 3 closure branchの`main` integrationは明示的ユーザー指示まで行わない。次のResearch Generationまたは新規Studyは、このclosureを救済・completionするものではなく、別のprospective authorizationを必要とする。
<!-- RG3-FINAL-CLOSURE:FUTURE:END -->'''
insert_before('doc/FUTURE_RESEARCH_AGENDA.md', '### 2026-09-04 Research Generation 3 current update', future_block)

# RG3 README
rg3_status = 'Status = CLOSED / core agenda G3-01..G3-12 complete / FINAL_SYNTHESIS materialized / MAIN INTEGRATION PENDING EXPLICIT USER INSTRUCTION'
regex_replace(
    'doc/research-generation-3/README.md',
    r'^Status = ACTIVE / core agenda G3-01\.\.G3-12.*$',
    rg3_status,
    rg3_status
)
regex_replace(
    'doc/research-generation-3/README.md',
    r'^Human track = G3-H01 / independent / non-blocking$',
    'Human track = G3-H01 / DEFERRED / independent / non-blocking',
    'Human track = G3-H01 / DEFERRED / independent / non-blocking'
)
rg3_read = '''<!-- RG3-FINAL-CLOSURE-READ-FIRST:BEGIN -->
- [`FINAL_SYNTHESIS.md`](FINAL_SYNTHESIS.md) — Research Generation 3 generation-level scientific synthesis / completion-condition record
- [`PROGRAM_FINAL_RESULT.json`](PROGRAM_FINAL_RESULT.json) — machine-readable program final state
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — current-facing closure state / main integration boundary
- [`../research-program-decisions/2026-09-04-research-generation-3-program-closure.md`](../research-program-decisions/2026-09-04-research-generation-3-program-closure.md) — formal program closure decision
- [`../research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md`](../research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md) — post-G3-12 closure authorization review
<!-- RG3-FINAL-CLOSURE-READ-FIRST:END -->'''
insert_before('doc/research-generation-3/README.md', '<!-- LGTGGC-G3-12-RG3-READ-FIRST:BEGIN -->', rg3_read)

# RG3 CURRENT_STATUS
current_status = 'Program status = CLOSED / core agenda G3-01..G3-12 complete / final synthesis materialized / main integration pending explicit user instruction'
regex_replace(
    'doc/research-generation-3/CURRENT_STATUS.md',
    r'^Program status = ACTIVE / core agenda G3-01\.\.G3-12.*$',
    current_status,
    current_status
)
regex_replace(
    'doc/research-generation-3/CURRENT_STATUS.md',
    r'^Human track = G3-H01 / independent / non-blocking$',
    'Human track = G3-H01 / DEFERRED / independent / non-blocking',
    'Human track = G3-H01 / DEFERRED / independent / non-blocking'
)
closure_section = '''<!-- RG3-FINAL-CLOSURE-CURRENT:BEGIN -->
## Research Generation 3 program closure

```text
Program lifecycle = CLOSED
Closure review = RG3-PROGRAM-CLOSURE-AUTHORIZED
Closure branch = research/g3-final-program-closure
Baseline main = fd6c8e2a4510d5937b47a87735854e8459b2646f
Core agenda = G3-01..G3-12 / all formally closed by prospective stop rules
G3-H01 = DEFERRED / INDEPENDENT / NON-BLOCKING
Section 16 completion conditions = 14 / 14 PASS
Final synthesis = COMPLETE
Program final result = COMPLETE
Scientific execution authorized by closure = none
Main integration = NOT AUTHORIZED / NOT PERFORMED / explicit user instruction required
```

Generation-level canonical records:

- `FINAL_SYNTHESIS.md`
- `PROGRAM_FINAL_RESULT.json`
- `../research-program-decisions/2026-09-04-post-g3-12-research-generation-3-closure-review.md`
- `../research-program-decisions/2026-09-04-research-generation-3-program-closure.md`

Protected boundaries remain active: G3-11 depth-10 rerun prohibited; depth 11 not authorized; G3-12 Stage 1 same-evidence repair/replay prohibited; G3-12 Stage 2 not authorized and seeds unread; G2-12 estimator scientific reuse and symmetry/canonicalization rescue not authorized.
<!-- RG3-FINAL-CLOSURE-CURRENT:END -->'''
insert_before('doc/research-generation-3/CURRENT_STATUS.md', '<!-- LGTGGC-G3-12-RG3-CLOSURE-SECTION:BEGIN -->', closure_section)

# Assertions.
checks = {
    'README.md': ['RG3-FINAL-CLOSURE-ROOT:BEGIN', 'research/g3-final-program-closure'],
    'doc/RESEARCH_INDEX.md': ['RG3-FINAL-CLOSURE-RESEARCH-INDEX:BEGIN', 'Research Generation 3 — program closure'],
    'doc/FUTURE_RESEARCH_AGENDA.md': ['RG3-FINAL-CLOSURE:FUTURE:BEGIN', 'Research Generation 3: **Closed on closure branch'],
    'doc/research-generation-3/README.md': ['Status = CLOSED / core agenda G3-01..G3-12 complete', 'RG3-FINAL-CLOSURE-READ-FIRST:BEGIN'],
    'doc/research-generation-3/CURRENT_STATUS.md': ['Program status = CLOSED / core agenda G3-01..G3-12 complete', 'RG3-FINAL-CLOSURE-CURRENT:BEGIN'],
}
for path, needles in checks.items():
    text = read(path)
    for needle in needles:
        if needle not in text:
            raise RuntimeError(f'{path}: post-sync assertion missing {needle!r}')

print('RG3 final program closure central document sync complete')
