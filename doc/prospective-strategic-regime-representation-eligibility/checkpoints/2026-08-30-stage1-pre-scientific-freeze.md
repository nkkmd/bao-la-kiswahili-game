# PSRRE-STUDY1 — Stage 1科学実行前freeze

Date: 2026-08-30  
Study: `PSRRE-STUDY1`  
Stage: `PSRRE-S1-DEVELOPMENT-2026-08-30-v1`

## freeze時点の状態

Stage 0は`STAGE0-TECHNICAL-PASS`でclosure済みである。Stage 1 / Stage 2 scientific seedsは未消費で、scientific executionは未承認である。

```text
Stage 1 seeds = 29510001..29514096 / RESERVED_UNCONSUMED / NOT AUTHORIZED
Stage 2 seeds = 29610001..29618192 / RESERVED_UNCONSUMED / NOT AUTHORIZED
G2-11 = NOT AUTHORIZED
```

## scientific contract set

scientific outcome生成前に、次を固定した。

```text
STAGE_1_FEATURE_DICTIONARY.json blob = 1cc6f3ca5192e5db80cb893859e1f4c58f02b8ae
STAGE_1_DEVELOPMENT_SPEC.json blob = 7b3dcc527cd169bf4f0b4aa81375fee5b8a8a7a8
STAGE_2_VALIDATION_CONTRACT.json blob = 6fe79f68265cdc4db085a87f0f4e86ea189de0c4
STAGE_1_TOOLING_SMOKE_SPEC.json blob = 833888408444885e15c3a2148ec17f7d47acc52f
```

これらは、tooling implementationを観察した後にscientific outcomeへ合わせて変更しない。technical implementation defectを修正する場合も、scientific threshold / endpoint / family / K / population / seedを変更してはならない。

## frozen Stage 1 representation contract

```text
features = 28
scaling = featurewise MEDIAN-MAD
PCA components for RF-A/RF-B = fixed 8
families = RF-A-ROBUST-PCA-WARD, RF-B-ROBUST-PCA-PAM, RF-C-DIRECT-ROBUST-PAM
candidate K = 2..8
minimum cluster support = 0.10
minimum mean silhouette = 0.10
minimum five-fold assignment stability = 0.80
maximum single source-policy share within any regime = 0.75
```

G2-10の40-feature dictionaryを再利用していない。G2-10のsupport `0.10` / stability `0.80`を緩和せず、silhouetteはG2-10の`0.05`より厳しい`0.10`として事前固定した。

winnerはeligible candidatesだけを対象に、five-fold stability、mean silhouette、minimum support、smaller Kの順で選ぶ。完全同率時のfamily priorityだけ`RF-C`→`RF-B`→`RF-A`とする。

## frozen Stage 2 held-out contract

Stage 2はStage 1からfreshな8,192 games / 1,024 rootsを使用し、次のoverlapをすべて0とする。

```text
seed
historical trajectory hash
opening-prefix hash
selected RAW-state key
```

Stage 2ではscaler / PCA / partition / prototype / label / thresholdのrefitを禁止する。

primary held-out eligibilityは、minimum regime support `0.10`、source-policy concentration上限`0.75`、frozen Stage 1 p99 prototype-domain coverage、Q0/Q2 perturbation label retentionを事前固定した条件で判定する。

G2-11 transition matrix、persistence、recurrence、bottleneck、transition asymmetry、survival/hazard、time-to-first-Mtaji等は使用しない。

## tooling smoke boundary

Stage 1 tooling smokeは`29500001..29500064`のtechnical-only reservationまたはsynthetic fixtureだけを使用する。scientific support / silhouette / stabilityの意味解釈は行わない。

smoke PASSはStage 1 scientific executionを自動承認しない。runner / production / independent sourceを別commitでfreezeし、source bindingとconsume-once gateを監査したうえで、別authorization recordを必要とする。

## no-rescue

本freeze後、same-Studyの結果を見て次を変更しない。

- 28-feature dictionary
- representation family集合
- PCA component count
- K range
- support / silhouette / stability / source-policy threshold
- Stage 1 population / seed
- Stage 2 population / seed
- Stage 1→Stage 2 promotion rule
- Stage 2 primary held-out endpoint
- G2-11 firewall

必要な科学設計変更が生じた場合は、本Studyの同じscientific evidenceを救済せず、別のprospective Study / versionとして扱う。
