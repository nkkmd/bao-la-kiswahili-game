# 2026-08-31 — G3-01 post-closure documentation consistency audit

## Scope

G3-01 / `LGTGMF-STUDY1` closure後、`main`統合前にcurrent-facing documentationの不整合・更新漏れを監査した。scientific result、formal decision、seed、Stage authorization、protected holdoutは変更しない。

## Audit input

```text
research branch = research/g3-01-local-game-tree-geometry-measurement-foundation
audit input branch HEAD = 3d637e8555b4cb6688fb712b74ec3b3d9094131b
observed remote main = 7a0e7ce618eedfa3bd1c8d11dfc2ba14bd3e390f
main integration performed by this audit = false
```

## Findings

明確なcurrent-facing stale記述を2件検出した。

1. root `README.md`のResearch Generation 3導線がG3-01開始前の状態を保持し、`scientific Studyは未開始`、`G3-01 formal Study ID未付与、seed未消費`と記載していた。
2. `doc/FUTURE_RESEARCH_AGENDA.md`冒頭metadataが`Research Generation 3: Prospective plan / not yet started`のままだった。

一方、次はclosure stateと整合していた。

- `doc/RESEARCH_INDEX.md`
- `doc/research-generation-3/README.md`
- `doc/research-generation-3/CURRENT_STATUS.md`
- `doc/local-game-tree-geometry-measurement-foundation/README.md`
- `CURRENT_STATUS.md`
- `STUDY_1_OVERVIEW.md`
- `STUDY_1_FINAL_REPORT.md`

## Corrections

root `README.md`のRG3導線をcurrent stateへ同期し、G3-01 Overviewへの直接入口を追加した。`doc/FUTURE_RESEARCH_AGENDA.md`冒頭のRG3 metadataを`Active / dependency reassessment required after G3-01`へ同期した。

次のcanonical closure stateは変更していない。

```text
G3-01 = LGTGMF-STUDY1 / CLOSED / TECHNICAL-INVALID
formal eligible measurement families = []
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seed consumption = 31010001..31010096
Stage 2 seed consumption = NONE
G3-02..G3-08 automatic start = BLOCKED
protected depth-10 exact holdout = SEALED / NOT GENERATED / NOT READ
```

## Prospective-plan preservation

`doc/research-generation-3/PROGRAM_PLAN.md`はG3-01開始前に固定したprospective planning recordであるため、内部の`PROSPECTIVE PROGRAM PLAN / NOT YET STARTED`表記をcurrent statusへ書き換えていない。current-facing状態は`CURRENT_STATUS.md`および中央索引で示す。

```text
PROGRAM_PLAN sha256 = 7f7744fcbb676d64f7be47ed60a82b5a8c81ca1fc2658b3ac9ad0a5859a29b64
```

## Main integration boundary

このauditはresearch branch上のdocumentation consistency correctionだけを行う。`main` refは更新しない。userの現行指示に従い、G3-01 branchの`main`統合は保留する。
