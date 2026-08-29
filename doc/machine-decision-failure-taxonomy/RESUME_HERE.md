# MDFT-STUDY1 — Resume Here

更新日: 2026-08-29

## 現在地

G2-08 / `MDFT-STUDY1`はStage 0 technical validationを完了し、Stage 1 scientific seedを消費する前のexact-spec / source-freeze段階にあります。

```text
baseline main = cb660e166460e0f19d4ba16d5283fa880d55757f
branch = research/g2-08-machine-decision-failure-taxonomy
Stage 0 = MDFT-S0-TECHNICAL-2026-08-29-v1 / STAGE0-TECHNICAL-PASS
Stage 1 seeds 28910001..28914096 = RESERVED / UNCONSUMED
Stage 1 = DESIGN/FREEZE IN PROGRESS / NOT AUTHORIZED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
Stage 2 = NOT AUTHORIZED
```

Stage 0 leaf binding:

```text
eligible = F01,F02,F03,F04,F05,F06,F07,F08,F10
F09 = TECHNICALLY-INELIGIBLE
F09 replacement/refit = NOT AUTHORIZED
```

## 最初に読む

1. `STUDY_1_PROTOCOL.md`
2. `FAILURE_MODE_DICTIONARY.md`
3. `DECISION_REGISTER.md`
4. `CURRENT_STATUS.md`
5. `results/STAGE_0_TECHNICAL_RESULT.json`
6. `checkpoints/2026-08-29-stage0-technical-pass.md`
7. `checkpoints/2026-08-29-stage0-f09-static-audit.md`
8. `REPRODUCIBILITY_INDEX.md`

## Stage 0 anchors

```text
core run = 33256737040
core SHA-256 = f5052e9c18b118a194c4a43c8964e789a2a81083ad72ebf259b18c699ed5d6f1
determinism replay = 33256767045
F10 preflight run = 33256932295
```

No Stage 1/2 scientific seed was consumed by Stage 0.

## 次に行うこと

Stage 1 scientific executionより前に、次を順番に固定する。

1. `preregistration/STAGE_1_DEVELOPMENT_SPEC.json`
2. exact source generation / root selection / dedup rule
3. exact search/reply/evaluator/F10 measurement rule
4. exact leaf assignment thresholds and promotion/support gates
5. zero-promotion / non-estimable / technical-invalid / resource-censored mapping
6. production and independent Stage 1 implementations
7. technical-only resource/artifact preflight at projected scientific scale
8. compressed shard ceiling / workflow timeout / upload contract
9. source hash manifest and source-freeze checkpoint
10. explicit Stage 1 authorization

Only after all ten items are frozen may seeds `28910001..28914096` pass the consume-once execution-start gate.

## 禁止事項

- G2-07 Stage 1 blockのrerun/repair
- G2-07 `F05_ALL`等をvalidated inputとして採用
- BMP Stage 2の再解析による救済
- G2-03未validated transformによるcanonicalization
- Stage 1/2 seedをauthorization前に消費
- F09のreplacement/refit
- Stage 1 outcomeを見てleaf/threshold/population/reference conditionを変更
- Stage 0 technical PASSをscientific evidenceとして解釈
