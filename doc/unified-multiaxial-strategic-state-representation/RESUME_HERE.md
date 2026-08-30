# UMSSR-STUDY1 — 再開位置

## 現在の安全な状態

Stage 0 technical executionは完了し、`STAGE0-TECHNICAL-PASS`でclosure済みである。scientific evidenceはまだ生成していない。

```text
branch = research/g2-10-unified-multiaxial-strategic-state-representation
baseline main = 495c9a993278ffab03a6d2cfe2c9a7093c559fd5
Study = UMSSR-STUDY1
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 1 seeds 29310001..29314096 = RESERVED / UNCONSUMED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
validated transform set = []
```

Stage 0 source/spec freeze:

```text
78de03fde8e286f65d1544ad585e9337dad240a0
```

canonical technical run:

```text
run = 33295423785
job = 99214144073
artifact id = 9727254008
artifact ZIP SHA-256 = d63883eb0ec188b23c673809d182bc5585459992a30f29892c6a1a86400b6309
mandatory gates = 14/14 PASS
```

## 次回最初に読む

1. `CURRENT_STATUS.md`
2. `DECISION_REGISTER.md`
3. `results/STAGE_0_TECHNICAL_CLOSURE_RESULT.json`
4. `checkpoints/2026-08-30-stage0-technical-pass.md`
5. `UPSTREAM_EVIDENCE_ELIGIBILITY_CONTRACT.md`
6. `CANDIDATE_AXIS_INVENTORY.md`
7. `STUDY_1_PROTOCOL.md`
8. `REPRODUCIBILITY_INDEX.md`

## Stage 0後の重要なeligibility

```text
G2-02 search = TECHNICAL-REFERENCE-ONLY
fresh G2-10 search observable = DEVELOPMENT-CANDIDATE-ONLY
TM-S2-C03 = FORMALLY-ELIGIBLE / ORIGINAL-FROZEN-SCOPE-ONLY
historical morphology classifier = INELIGIBLE
fresh G2-10 morphology = DEVELOPMENT-CANDIDATE-ONLY
G2-05 depth-9 exact = BOUNDED-EXACT-ELIGIBLE / NO EXTRAPOLATION
```

## 次に行う作業

次はStage 1 scientific runではなく、**Stage 1 pre-scientific freeze**である。

1. fresh development population generation / selection ruleを固定する。
2. actual candidate axis setとfeature dictionaryを固定する。
3. search condition、scaling、numeric serialization、missingnessを固定する。
4. dimensionality reduction / clustering / representation selectionのmethodとhyperparameter search spaceを固定する。
5. dimension / regime-number選択、stability/readiness/promotion ruleを固定する。
6. Stage 2 primary / key secondary endpointとthresholdをStage 1 outcome前に固定する。
7. Stage 1→Stage 2のseed / trajectory / opening-prefix / selected RAW-state overlap=0 firewallを固定する。
8. production / independent implementationとartifact preservation contractを実装・source-freezeする。
9. scientific seedを使わないtooling smoke / resource preflightを完了する。
10. 全pre-scientific gate PASS時だけ別commitでStage 1 explicit authorizationを発行する。

## 禁止

- `29310001..29314096`をauthorization前に消費しない。
- G2-06〜G2-09 development outputをvalidated axisとして昇格しない。
- G2-09の未消費seedを再利用しない。
- historical morphology classifierをrefitしてupstream validated input扱いしない。
- C03 original scope reconstructionをgeneralization evidenceへ読み替えない。
- symmetry / canonicalizationを導入しない。
- G2-11 long-horizon endpointを先取りしない。
- Stage 1 outcome後にthreshold / axis / clustering rule / formal endpointを変更しない。
