from pathlib import Path
import hashlib, subprocess

SOURCE_TIP = '72bd208267359f461e9dbbde938bb952eb01b91c'
PROGRAM_PLAN_BLOB = '2bb90c11f1625f63f40a7eab8a3de7774505a1ac'
RESULT_SHA256 = 'e8bb384dd8ba526029ee62753836847f25b45546e013fb4b224f5ab02c68a46c'


def read(p): return Path(p).read_text(encoding='utf-8')
def write(p, s): Path(p).write_text(s, encoding='utf-8')

def replace_once(path, old, new):
    s = read(path)
    if s.count(old) != 1:
        raise RuntimeError(f'{path}: expected one target, found {s.count(old)}')
    write(path, s.replace(old, new, 1))

def append_once(path, marker, block):
    s = read(path)
    if marker not in s:
        write(path, s.rstrip() + '\n\n' + block.strip() + '\n')

def git_blob(path):
    return subprocess.check_output(['git','hash-object',path], text=True).strip()

def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

# Study-facing lifecycle metadata.
replace_once(
    'doc/local-geometry-persistence-memory-length/CURRENT_STATUS.md',
    'main integration = NOT AUTHORIZED / NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED',
    f'main integration = COMPLETE / FAST-FORWARD / source tip {SOURCE_TIP} / force=false',
)
replace_once(
    'doc/local-geometry-persistence-memory-length/CURRENT_STATUS.md',
    'Stage 2はauthorizeせず、Stage 2 seed blockとprotected depth-10 holdoutは未アクセスのまま保持する。mainへの統合はユーザーの明示指示まで禁止する。',
    'Stage 2はauthorizeせず、Stage 2 seed blockとprotected depth-10 holdoutは未アクセスのまま保持する。mainへの統合は2026-09-03の明示的ユーザー指示を受け、research branch tipからfast-forward / force=falseで完了した。',
)
replace_once(
    'doc/local-geometry-persistence-memory-length/README.md',
    'mainへの統合はユーザーの明示指示があるまで行わない。',
    f'mainへの統合は2026-09-03の明示的ユーザー指示を受け、research branch tip `{SOURCE_TIP}` からfast-forward / `force=false`で完了した。',
)
replace_once(
    'doc/local-geometry-persistence-memory-length/DECISION_REGISTER.md',
    '| LGPML-D031 | Main integration | `EXPLICIT USER INSTRUCTION REQUIRED` | Study closureでも自動統合しない。 |',
    f'| LGPML-D031 | Main integration | `COMPLETE / FAST-FORWARD / FORCE=FALSE` | 明示的ユーザー指示後、source tip `{SOURCE_TIP}` をmainへ統合。科学的closure/no-rescueは不変。 |',
)
append_once(
    'doc/local-geometry-persistence-memory-length/DECISION_REGISTER.md',
    'LGPML-D050',
    f'| LGPML-D050 | Post-closure repository integration | `COMPLETE` | 2026-09-03、mainを`{SOURCE_TIP}`へfast-forward。squash/rebase/history rewrite/scientific rerunなし。 |',
)
append_once(
    'doc/local-geometry-persistence-memory-length/REPRODUCIBILITY_INDEX.md',
    '<!-- LGPML-G3-08-MAIN-INTEGRATION -->',
    f'''<!-- LGPML-G3-08-MAIN-INTEGRATION -->
## Main integration

2026-09-03、明示的ユーザー指示後にremote `main`をpre-integration SHA `9f6abd3c9b146bb88c11dd04963052300e4cdc3b`からaudited G3-08 research tip `{SOURCE_TIP}`へfast-forwardした。`force=false`。squash、rebase、history rewrite、scientific recomputationは行っていない。

Post-integration documentation finalizationはrepository-lifecycle metadataのみを更新し、scientific result、preregistration、seed、candidate set、protected evidenceを変更しない。
''',
)
append_once(
    'doc/local-geometry-persistence-memory-length/STUDY_1_FINAL_REPORT.md',
    '<!-- LGPML-G3-08-POST-CLOSURE-INTEGRATION -->',
    f'''<!-- LGPML-G3-08-POST-CLOSURE-INTEGRATION -->
## Post-closure repository integration addendum

Study closure時点ではmain integrationは未承認だった。その後、2026-09-03の明示的ユーザー指示により、audited research branch tip `{SOURCE_TIP}` をremote `main`へfast-forward / `force=false`で統合した。このrepository lifecycle eventは`CLOSED / TECHNICAL-INVALID`、formal promoted candidate set `[]`、Stage 2 non-execution、no-rescue、protected depth-10 sealingを変更しない。
''',
)

# Program current-facing metadata.
replace_once(
    'doc/research-generation-3/CURRENT_STATUS.md',
    'G3-08 main integration = NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED',
    f'G3-08 main integration = COMPLETE / FAST-FORWARD / source tip {SOURCE_TIP} / force=false',
)
replace_once(
    'doc/research-generation-3/CURRENT_STATUS.md',
    'Active scientific research branch = none / research/g3-08-local-geometry-persistence-memory-length scientifically CLOSED and pending explicit user decision on main integration',
    'Active scientific research branch = none / G3-08 integrated to main; G3-09 remains NOT AUTHORIZED',
)
replace_once(
    'doc/research-generation-3/README.md',
    'G3-08 main integration = NOT PERFORMED / EXPLICIT USER INSTRUCTION REQUIRED',
    f'G3-08 main integration = COMPLETE / FAST-FORWARD / source tip {SOURCE_TIP} / force=false',
)
replace_once(
    'doc/RESEARCH_INDEX.md',
    'Stage 2 seed blockは未消費、protected depth-10 holdoutはsealedのまま。mainへの統合はユーザーの明示指示まで行わない。',
    f'Stage 2 seed blockは未消費、protected depth-10 holdoutはsealedのまま。2026-09-03の明示的ユーザー指示後、G3-08 research tip `{SOURCE_TIP}` はmainへfast-forward / `force=false`で統合済み。',
)
append_once(
    'doc/FUTURE_RESEARCH_AGENDA.md',
    '<!-- LGPML-G3-08-MAIN-INTEGRATION:FUTURE -->',
    f'''<!-- LGPML-G3-08-MAIN-INTEGRATION:FUTURE -->
G3-08 `LGPML-STUDY1`のresearch branchは、研究closureと最終文書監査後、2026-09-03の明示的ユーザー指示によりtip `{SOURCE_TIP}` からmainへfast-forward / `force=false`で統合された。scientific dispositionは`CLOSED / TECHNICAL-INVALID`のまま不変で、G3-09は引き続きseparate post-G3-08 current-state authorization reviewまで`NOT AUTHORIZED`である。
''',
)

# Integration checkpoints.
checkpoint = Path('doc/research-generation-3/checkpoints/2026-09-03-g3-08-main-integration-complete.md')
checkpoint.write_text(f'''# G3-08 Main Integration Complete

Date: 2026-09-03

## Decision

**`COMPLETE / FAST-FORWARD / FORCE=FALSE`**

Explicit user authorization was received to integrate the closed G3-08 research branch to `main`.

```text
Study = LGPML-STUDY1
Study status = CLOSED / TECHNICAL-INVALID
pre-integration main = 9f6abd3c9b146bb88c11dd04963052300e4cdc3b
integrated research tip = {SOURCE_TIP}
first main fast-forward = SUCCESS
force = false
squash = false
rebase = false
history rewrite = false
scientific rerun = false
formal promoted candidate set = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
protected depth-10 = SEALED / NOT GENERATED / NOT READ / NOT PEEKED
```

The subsequent documentation-finalization commit records this completed lifecycle event only. It does not change scientific evidence or decisions.
''', encoding='utf-8')

study_checkpoint = Path('doc/local-geometry-persistence-memory-length/checkpoints/2026-09-03-main-integration-complete.md')
study_checkpoint.write_text(checkpoint.read_text(encoding='utf-8'), encoding='utf-8')

# Fail-closed invariants.
if git_blob('doc/research-generation-3/PROGRAM_PLAN.md') != PROGRAM_PLAN_BLOB:
    raise RuntimeError('PROGRAM_PLAN drift')
if sha256('doc/local-geometry-persistence-memory-length/results/stage-1/scientific-result.json') != RESULT_SHA256:
    raise RuntimeError('Stage1 result drift')
if 'G3-08 = LGPML-STUDY1 / CLOSED / TECHNICAL-INVALID' not in read('doc/research-generation-3/CURRENT_STATUS.md'):
    raise RuntimeError('G3-08 closure token missing')
if 'G3-09 = NOT AUTHORIZED' not in read('doc/research-generation-3/CURRENT_STATUS.md'):
    raise RuntimeError('G3-09 authorization boundary missing')
if 'SEALED / NOT GENERATED / NOT READ / NOT PEEKED' not in read('doc/research-generation-3/CURRENT_STATUS.md'):
    raise RuntimeError('protected depth-10 boundary missing')

print('G3-08-MAIN-INTEGRATION-DOCS-PASS')
