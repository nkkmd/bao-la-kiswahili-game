# PSRRE-STUDY1 — 現在の状態

更新日: 2026-08-30

## 正式状態

```text
Study ID = PSRRE-STUDY1
Formal decision = NON-ESTIMABLE
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-BLOCKED-NON-ESTIMABLE
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
G2-11 candidate input authorized = false
G2-11 = NOT-AUTHORIZED
```

本Studyはclosedである。G2-10とG2-11の間のdependency-resolution prerequisiteとして実施され、新しいG2-xx labelは追加していない。

## Stage 1 formal blocking reason

Stage 1 scientific runは技術的にvalidで、production / independent full exact、population quota、opening diversity、resource gateをPASSした。しかしprospectively fixed readiness floor:

```text
minimum nonzero-MAD features = 20
observed nonzero-MAD features = 15
```

を満たさなかった。したがってrepresentationをfreezeせず、Stage 2をauthorizeしない。

## seed状態

```text
29500001..29500064 = technical-only / scientific evidenceには未使用
29510001..29514096 = Stage 1 CONSUMED / rerun prohibited
29610001..29618192 = Stage 2 RESERVED_UNCONSUMED / NOT AUTHORIZED
```

## scientific run provenance

```text
source freeze = 41124069f89f0706cf943e18688c96a8c2db35d7
authorization = 085c5df24baff44bb644c00eda91d6212caf5708
workflow run = 33308337738
job = 99248759871
artifact = 9731444105
artifact ZIP SHA-256 = c418bca917723eb9c07035c323431972ac541b4b58e286820657b0d1c7e40d7a
```

## interpretation boundary

本結果はhuman-perceived regime、human difficulty、game-theoretic truth、public Bao AI qualityを検証していない。G2-11のlong-horizon outcomeも検査していない。G2-10 closureも変更しない。

## 今後

本Study内のrescueは行わない。strategic-regime representationを再検討する場合は新しいprospective Studyが必要である。mainへの統合は別途明示指示があるまで行わない。
