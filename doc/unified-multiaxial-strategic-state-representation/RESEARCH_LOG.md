# UMSSR-STUDY1 — 研究ログ

## 2026-08-30 — Study開始

GitHub remote `main`を再取得し、HEADが`495c9a993278ffab03a6d2cfe2c9a7093c559fd5`であることを確認した。ユーザー提示SHAと一致した。

中央文書とResearch Generation 2 `G2-01..G2-09`を監査し、とくにG2-02、G2-06〜G2-09ではCURRENT_STATUS、Final Report、Decision Register、Reproducibility Index、canonical machine-readable resultを照合した。

## 2026-08-30 — prospective identity / eligibility / RAW / seed freeze

```text
Study = UMSSR-STUDY1
Stage 0 = UMSSR-S0-TECHNICAL-2026-08-30-v1
Stage 1 = UMSSR-S1-DEVELOPMENT-2026-08-30-v1
Stage 2 = UMSSR-S2-FORMAL-2026-08-30-v1
branch = research/g2-10-unified-multiaxial-strategic-state-representation
```

eligibility vocabulary:

```text
FORMALLY-ELIGIBLE
BOUNDED-EXACT-ELIGIBLE
TECHNICAL-REFERENCE-ONLY
DEVELOPMENT-CANDIDATE-ONLY
INELIGIBLE
```

RAW identity:

```text
pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
```

seed reservation:

```text
Stage 0 technical-only = 29300001..29300064
Stage 1 scientific = 29310001..29314096 / RESERVED-UNCONSUMED
Stage 2 scientific = 29410001..29418192 / RESERVED-UNCONSUMED
```

G2-09の未消費scientific blockは再利用しない。

## 2026-08-30 — initial freeze materialization

```text
initial freeze commit = d5e5237a6678442cb5f0e72b3430b93e4526c1d4
pre-scientific tightening commit = 54cc0661d283f3740b9fd8f665730ed84eb01bcb
initial consistency audit commit = e3ff29277460d4d7e8529cef565448a6dfa3378d
scientific evidence generated = false
```

G2-07 `DECISION_REGISTER.md` D38だけにstale integration provenanceがあることを記録したが、scientific closureには不一致がないためupstream resultを変更しなかった。

## 2026-08-30 — Stage 0 source/spec freeze

Stage 0 technical spec、technical-only authorization、production / independent implementation、runner、workflowを同一commitへ固定した。

```text
commit = 78de03fde8e286f65d1544ad585e9337dad240a0
Stage 1 authorization = false
Stage 2 authorization = false
scientific seed consumption = false
```

Stage 0はhand-built fixtureを優先し、Stage 1/2 scientific seedを明示的に禁止した。

## 2026-08-30 — Stage 0 technical execution

push-triggered GitHub Actionsを実行した。

```text
workflow = UMSSR Stage 0 Technical
run = 33295423785
job = 99214144073
source commit = 78de03fde8e286f65d1544ad585e9337dad240a0
conclusion = success
artifact id = 9727254008
artifact ZIP SHA-256 = d63883eb0ec188b23c673809d182bc5585459992a30f29892c6a1a86400b6309
```

artifact内部を再検算した。

```text
STAGE_0_TECHNICAL_RESULT.json SHA-256 = a11a81989fde36ff1a5d5fd38fd124365ea301bbbbc9a03e6cef9b6657e63ad1
SOURCE_HASHES.json SHA-256 = 0670489290a5ef193a67ee0355839efe79c5171497cf66e2ca5f9be903c2289a
runner internal result SHA-256 = 9599ba6993daff1f159037f8387e8dbbf5244150db585690d3b8ea0530b68fb9
internal hash recomputation = MATCH
```

mandatory technical gateは14/14 PASSだった。

## 2026-08-30 — Stage 0 technical closure

Stage 0を次でclosureする。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
scientific inference = NONE
scientific seed used = 0
Stage 1 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

Stage 0後のtechnical eligibilityを固定した。

```text
G2-02 search result = TECHNICAL-REFERENCE-ONLY
fresh G2-10 search concept = DEVELOPMENT-CANDIDATE-ONLY
TM-S2-C03 = FORMALLY-ELIGIBLE / ORIGINAL-FROZEN-SCOPE-ONLY
historical morphology classifier = INELIGIBLE
fresh G2-10 morphology concept = DEVELOPMENT-CANDIDATE-ONLY
G2-05 depth-9 exact domain = BOUNDED-EXACT-ELIGIBLE / NO EXTRAPOLATION
```

C03 reconstruction成功はG2-09 generalization evidenceではない。morphology executable absenceはhistorical morphology formal claimの否定ではない。

次はStage 1 scientific executionではなく、Stage 1 development contractのprospective freezeを行う。
