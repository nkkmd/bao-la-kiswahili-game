# PBAI-P2 C009-v1 feature-off equivalence checkpoint

日付: 2026-09-01  
Candidate: `PBAI-C009-v1`

## 結論

```text
FEATURE-OFF-EQUIVALENCE-PASS
```

C009 candidateはfrozen baselineから`public/ai.js`だけを変更して実装され、feature `pbaiC009SingleReplyExtension`はdefault `false`のままである。

Canonical workflow:

```text
run = 33503615979
job = 99842398129
candidate AI SHA-256 = 750678ec33c916da35844dc2d999cc3b996c1cc6ec79ad84e12030f0da84517f
deterministic core SHA-256 = c16c1a3a81a0c265d7f01f67da1b1106d098c421a3b313f221729f5b43cc462d
artifact = 9798710901
artifact ZIP SHA-256 = ebdc1ec354fbd7f25ec6b540443f574d7cdc6c7c0a1def0660d6aefe4d3e6735
```

Frozen technical population `43500001..43500064`から32 roots（Namua 16 / Mtaji 16）を選択し、hard/expertの8 search conditionsで256 comparisonsを実施した。

```text
comparison mismatches = 0
candidate diagnostic presence while feature off = 0
root-selection technical failures = 0
```

独立verifierはproduction runnerをimportせず、root populationと全comparison rowsを再構築し、productionと同一deterministic coreを得た。

このPASSはC009の棋力・decision-quality benefitを示さない。許可されるのは、candidate source変更前にfreeze済みのdevelopment measurement specに従って`42400001..42400512`のdevelopment-only評価を実行することだけである。

```text
validation 425xxxxx = NOT AUTHORIZED
release holdout 426xxxxx = NOT AUTHORIZED
public deployment = NOT AUTHORIZED
AI-GEN3 promotion = NOT AUTHORIZED
Research Generation 3 influence = ZERO
```
