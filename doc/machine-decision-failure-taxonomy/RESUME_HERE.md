# MDFT-STUDY1 — Resume Here

更新日: 2026-08-30

## 現在地

G2-08 / `MDFT-STUDY1`は完了しています。

```text
baseline main = cb660e166460e0f19d4ba16d5283fa880d55757f
branch = research/g2-08-machine-decision-failure-taxonomy
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 1 seeds 28910001..28914096 = CONSUMED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29010001..29018192 = RESERVED / UNCONSUMED
Study = NON-ESTIMABLE
```

## 最初に読む

1. `STUDY_1_OVERVIEW.md`
2. `STUDY_1_FINAL_REPORT.md`
3. `CURRENT_STATUS.md`
4. `DECISION_REGISTER.md`
5. `results/STAGE_1_DEVELOPMENT_RESULT.json`
6. `results/STAGE_1_FINAL_EXACT_COMPARISON.json`
7. `results/STAGE_1_ARTIFACT_MANIFEST.json`
8. `checkpoints/2026-08-30-stage1-development-blocked-non-estimable.md`
9. `REPRODUCIBILITY_INDEX.md`

## Canonical Stage 1 anchors

```text
spec SHA-256 = 85090d7820a1f3afcb8633b54d07aca408df648554f80262eb9e54ef9d8fe203
scientific run = 33277102013
artifact = 9722157483
production/independent core = f7e4e962f0a0c44e2466ed3d52b28c8c98b2a6e4aa0ee8c29b329c9afa5e305c
full shard SHA-256 = 21d55192d45a9b568d7cae01a367e20e39159bb8c7332683137863a926774830
```

## Closure reason

```text
distinct opening prefixes = 2836 < 3000
LOW_CAPTURE selected share = 170/512 = 0.33203125 > 0.32
```

These are preregistered global readiness failures. F01/F02/F03/F05/F06/F10 had leaf-level promotion calculation `true`, but they are not a frozen taxonomy because the global gate failed.

## 禁止事項

- Stage 1 seed blockのsame-block rerun / repair / replacement / extension
- opening-prefix floorのpost-hoc relaxation
- source-policy maximum-share ceilingのpost-hoc relaxation
- LOW_CAPTURE rootsのpost-hoc deletionによるrescue
- leaf-level `promoted=true`をStage 2 targetへ直接昇格
- F09のreplacement/refit
- G2-07やBMPの既存formal decisionの変更
- G2-03未validated transformによるcanonicalization

将来この問いを再検討する場合は、新しいStudy/version、fresh seeds、prospectively frozen population contractを使用してください。
