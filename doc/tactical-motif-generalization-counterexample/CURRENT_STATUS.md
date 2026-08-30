# 現在の状態

更新日: 2026-08-30

## Studyの識別情報

- G2: `G2-09`
- Study ID: `TMGC-STUDY1`
- branch: `research/g2-09-tactical-motif-generalization-counterexample`
- baseline `main`: `bc1263b7076f0a3794da5fd0d4e07821b23e1db6`
- Study: **CLOSED / `TECHNICAL-INVALID`**

## 各Stageの正式状態

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-TECHNICAL-INVALID
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Study = TECHNICAL-INVALID
```

## 科学用seedの状態

- Stage 1 `29110001..29114096`: `RESERVED / UNCONSUMED`
- Stage 2 `29210001..29218192`: `RESERVED / UNCONSUMED`

G2-09 scientific generalization/counterexample evidenceは生成されていない。

## 終端となった技術的事象

Stage 1 scientific authorization前に必須としたtooling smoke:

```text
workflow run = 33287035754
source commit = 65b2e3dee0994e1520ad9a3470feff4f3c9d98ae
artifact id = 9724782927
artifact ZIP SHA-256 = 54c536eceb460d8734ba19e6e79bfc2e9e7c82838056338a4527e7d365e1d51c
syntax checks = PASS
canonical result JSON = NOT PRODUCED
failure = ReferenceError: topSetRate is not defined
```

`STAGE_1_TOOLING_SMOKE_SPEC.json`の事前failure mappingにより、same-study repair/rerunはauthorizeしない。

## 変更しないupstream境界

- `TM-S2-C03 = CONFIRMED`
- `TM-S2-C01/C02/C04 = NOT-CONFIRMED`
- human axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`
- RAW identity only
- validated transform set `[]`
- canonicalization / symmetry reductionは使用していない。
- G2-08のleaf-level development observationsは、G2-09のvalidated inputとして扱わない。

## 解釈上の境界

本closureはC03の科学的generalization failureを意味しない。human/expert/game-theoretic claimもauthorizeしない。将来修正版は新しいprospective Study/versionとして扱う。
