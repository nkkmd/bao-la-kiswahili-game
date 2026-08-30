# G2-10 / UMSSR-STUDY1 — 最終報告

更新日: 2026-08-30  
正式判断: **`STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION`**

## 1. 研究

**Study ID:** `UMSSR-STUDY1`  
**Program:** Research Generation 2 `G2-10`  
**正式英語題目:** Unified Multiaxial Strategic State Representation Study 1

日本語研究題目:

> **Baoにおける多軸戦略状態表現の統合的構築とprospective検証 — search reliability, structural state, reply pressure, decision-failure evidence, tactical structure等のevidence-eligible axesを用いた再現可能なstrategic-state / regime representationの構築**

本Studyは、既存研究のpositive resultだけを集めて統合するのではなく、upstream evidence eligibilityを先に固定したうえで、fresh population上に40次元のmultiaxial strategic-state vectorを構築し、事前固定したdeterministic K-means候補から再現可能なregime representationを選択できるかを検証した。

## 2. 結論

Study 1の正式判断は:

```text
STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
```

である。

これはtechnical failureでも`NON-ESTIMABLE`でもない。Stage 1では、4096 fresh gamesの生成、population diversity、512 rootsのstratified selection、40 featuresの計算、production / independent implementationの完全一致、resource / artifact gateのすべてが成立した。そのうえで、scientific seed消費前に固定した`K=2..6`の全候補がrepresentation promotion criterionを満たさなかった。

したがって`selectedRepresentation = null`とし、`FROZEN_REPRESENTATION.json`は生成しなかった。Stage 2はauthorization prerequisiteを満たさないため:

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

で閉じる。

## 3. upstream scientific firewall

G2-10は、G2-06〜G2-09のclosureを救済する研究として扱わなかった。

- G2-02 `SRDR-STUDY1 = INCONCLUSIVE`は`TECHNICAL-REFERENCE-ONLY`とし、fresh search observable conceptだけをG2-10のdevelopment candidateとして再定義した。
- G2-06 `RCPR-STUDY1`のrich representation / classifierをvalidated axisとして直接使用しなかった。
- G2-07 `PCRPR-STUDY1`のreply-pressure modelをvalidated axisとして直接使用しなかった。
- G2-08 `MDFT-STUDY1 = NON-ESTIMABLE`のpromoted taxonomy / classifierをformal inputとして使用しなかった。
- G2-09 `TMGC-STUDY1 = TECHNICAL-INVALID`からgeneralization / counterexample evidenceが得られたとは解釈しなかった。
- Research Generation 1 `TM-S2-C03 = CONFIRMED`はoriginal frozen scope内だけで利用資格を維持し、G2-10から新しいC03 generalization claimを生成しなかった。
- G2-05のexact resultはstandard initial RAW root depth 0..9のbounded domainだけ`BOUNDED-EXACT-ELIGIBLE`とし、fresh G2-10 stateへ外挿しなかった。

## 4. RAW identityとrepresentation boundary

validated transformation setが空であるため、Study全体でRAW-state distinctnessを維持した。

```text
RAW identity = pits,reserve,houseOwned,player,phase,winner,pending
excluded = turn,reason
validated transform set = []
canonicalization = false
symmetry reduction = false
```

単一のstrategic scoreへ早期圧縮せず、Stage 1では40-feature standardized vectorをそのまま保持した。dimensionality reductionは`NONE-IN-STUDY1`として凍結した。

## 5. Stage 0

Stage 0はtechnical / eligibility / feasibilityだけを評価し、scientific inferenceを行わなかった。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
workflow run = 33295423785
artifact id = 9727254008
mandatory gates = 14 / 14 PASS
scientific seed use = 0
```

Stage 0ではRAW identity、numeric serialization、search instrument、C03 original-scope reconstruction、G2-05 bounded exact control、production / independent separation等を確認した。

historical morphology classifierはrepositoryからexact executable reconstructionできなかったため、direct executable eligibilityを`INELIGIBLE`とした。これはhistorical morphology formal claimの否定ではない。

## 6. Stage 1のprospective design

Stage 1 scientific seed消費前に以下を固定した。

```text
Stage 1 seeds = 29310001..29314096
fresh games = 4096
selected roots = 512
phase/source strata = 8
quota per stratum = 64
feature width = 40
candidate K = 2,3,4,5,6
dimensionality reduction = NONE-IN-STUDY1
```

candidate eligibilityは、empty clusterがなく、次をすべて満たすこととした。

```text
minimum cluster support fraction >= 0.10
mean silhouette >= 0.05
five-fold assignment stability >= 0.80
```

eligible candidateが複数ある場合のwinner ruleも事前固定し、eligible candidateが0の場合は:

```text
STAGE1-DEVELOPMENT-BLOCKED-NO-REPRESENTATION
```

とすることをscientific outcome前に固定した。

## 7. Stage 1 accepted scientific execution

accepted consume-once runは次である。

```text
source freeze commit = 10801fbc1529902bf3f4c0aa6e464c1dc39f1267
authorization commit = d6487403dba9fa1de8895b473e5e662d90b1f13b
workflow run = 33297178656
job = 99218754656
artifact id = 9727918107
artifact ZIP SHA-256 = 8f2f92d88ccb040f53bae28acb7124f230d51b00ff4466835adfda6260934e86
```

Stage 1 scientific seedsはaccepted runの開始gateでconsume-onceとして消費された。

```text
29310001..29314096 = CONSUMED
same-block rerun = false
```

accepted population:

```text
generated games = 4096
unique trajectories = 4068
distinct opening prefixes = 3711
selected roots = 512
selected distinct opening prefixes = 504
maximum single selected opening-prefix share = 0.005859375
active features = 40 / 40
```

8 strataはすべて64 rootsで一致した。

## 8. independent verification

production / independent implementationは、accepted scientific runで次をすべてexact一致させた。

```text
recordsExact = true
selectionExact = true
analysisRowsExact = true
scalerExact = true
candidateKExact = true
representationExact = true
readinessObjectExact = true
fullExact = true
```

production / independent full compressed shardは同一SHA-256だった。

```text
66bf5fbeda877235d76628b108398a0c88741d677f8079951668b62ee3366595
```

scientific readiness gateとresource gateはいずれも全項目PASSした。このためStage 1の`NO-REPRESENTATION`判断は、technical invalidityやpopulation insufficiencyによる代替labelではない。

## 9. K候補の結果

事前固定した全K候補のmean silhouetteは0.05以上だったが、supportまたはassignment stabilityの条件を満たさなかった。

| K | minimum support | mean silhouette | five-fold stability | eligibility | 主な未達条件 |
|---:|---:|---:|---:|---|---|
| 2 | 0.142578125 | 0.1733702470 | 0.740234375 | false | stability |
| 3 | 0.009765625 | 0.1812164738 | 0.744140625 | false | support, stability |
| 4 | 0.0078125 | 0.2057637512 | 0.916015625 | false | support |
| 5 | 0.0078125 | 0.1830961152 | 0.822265625 | false | support |
| 6 | 0.001953125 | 0.1843106779 | 0.69921875 | false | support, stability |

K=4は候補中もっとも高いmean silhouetteと0.916のassignment stabilityを持ったが、最小clusterが4/512であり、事前に要求した10% supportを大きく下回った。結果後にsupport thresholdを緩和してK=4を採用することはno-rescue ruleに反するため行わない。

同様にK=2はsupportを満たしたがstabilityが0.80未満であり、結果後にstability thresholdを緩和して採用しない。

## 10. Stage 2を実行しない理由

Stage 2 validation contractはStage 1 outcomeを見る前に固定していたが、そのcontractはStage 1で凍結されたactive features、scaler、centroids、Kを使用し、refit / reclustering / axis replacementを禁止している。

Stage 1でeligible representationが1件も得られなかったため、Stage 2で検証すべきfrozen representationが存在しない。したがって:

```text
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
Stage 2 seeds 29410001..29418192 = RESERVED / UNCONSUMED
```

とする。

Stage 2を実行して別Kを選ぶ、Stage 2 dataで再standardizeする、Stage 1 thresholdを緩和する、Stage 1 populationをStage 2 evidenceへ流用する、といった救済は行わない。

## 11. 解釈境界

本Studyから言えるのは、**凍結した40-feature representation、4096-game development design、deterministic K-means `K=2..6`、事前固定promotion criteriaの組合せでは、Stage 2へ昇格可能なregime representationを得られなかった**ということである。

次は主張しない。

- Baoには戦略的state familyやregimeが存在しない。
- 40 featuresの各axisが個別に無意味である。
- 別のprospective representation methodでも必ず失敗する。
- K=4の小clusterが実戦的・人間的に意味あるcategoryである。
- higher-resource searchがgame-theoretic truthである。
- C03がoriginal scope外へgeneralizeする、またはgeneralizeしない。
- historical morphology claimが否定された。
- machine-only evidenceからhuman strategic conceptを推定できる。

## 12. G2-11との境界

G2-10はG2-11へ渡せるvalidated / frozen regime representationを生成しなかった。

```text
G2-11 candidate input from UMSSR-STUDY1 = NOT AUTHORIZED
```

G2-11を実施する場合、G2-10のK range、threshold、feature setを結果後に変更して同じStudyを救済してはならない。long-horizon strategic transitionを扱うためのrepresentationが必要なら、**新しいprospective Studyまたは明示的versioned protocol**として、representation source、population、seed、selection / validation ruleを新たにoutcome前に固定する必要がある。

## 13. no-rescue closure

次は同じ`UMSSR-STUDY1`では行わない。

- minimum cluster support 0.10の緩和
- five-fold stability 0.80の緩和
- `K=2..6`からのK追加・削除
- PCA / latent representation /別clustering法の事後導入
- favorable phase / source policyだけでの再選択
- Stage 1 seed blockのrerunまたはextension
- Stage 2の事後authorization

これらを研究する場合は、新しいprospective identifierとfresh scientific evidence contractを必要とする。
