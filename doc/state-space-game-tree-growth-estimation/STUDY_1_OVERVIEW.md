# G2-12 第1研究概要 — 状態空間・ゲーム木成長の推定

Program: **Research Generation 2 / G2-12**  
Study ID: `SSGTGE-STUDY1`  
状態: **完了 / technical-invalid closure**  
正式判断: **`TECHNICAL-INVALID`**

正式英語名: **State-Space / Game-Tree Growth Estimation Study 1**

## 1. 何を調べた研究か

G2-05 `DRSSE-STUDY1`でexactに得られた標準初期局面のdepth 0..9成長系列をdevelopment evidenceとして使い、事前固定した有限のestimator候補から1つを選び、その後fresh exact depth 10で検証できるかを研究した。

重要なのは、G2-05のformal exact domainを後から拡張するのではなく、growth estimatorのdevelopmentとfresh deeper holdout validationを独立したStudyとして分離した点である。

## 2. 凍結したcontract

RAW identityは次を維持した。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

候補は:

```text
E1-TRAILING-LOG-LINEAR-W5
E2-LOG-QUADRATIC-D2PLUS
E3-LOCAL-LOG-INCREMENT-TREND-W4
```

primary seriesは`newRawStateCount`と`treeNodeOccurrences`、development backtestは`5->6`, `6->7`, `7->8`, `8->9`、eligibilityは最大absolute natural-log error `<=0.15`とした。

Fresh depth 10をprimary holdout、depth 11をsecondary stress-testとして予約し、Stage 1完了前の生成・readを禁止した。

## 3. Stage 0

Stage 0 v1はsource-binding defectによりoutput前に`STAGE0-TECHNICAL-INVALID`となった。科学output前のtechnical failureだったため、科学contractを変更せず、新しいtechnical-entry v2としてsource bindingとworkflow fail-closed mechanicsだけをprospectively修正した。

v2はproduction / independent双方でdepth-2 technical fixtureを一致して再現し:

```text
Stage 0 v2 = STAGE0-TECHNICAL-PASS
```

となった。

## 4. Stage 1

Stage 1は別source freeze・別authorizationで一度だけ実行した。

production pathではE1/E2/E3を実development seriesへ適用し、production-onlyではE2が最良となった。

```text
E1 max abs log error = 0.2813333110915206
E2 max abs log error = 0.07917793679237395
E3 max abs log error = 0.1129709359542721
production proposed winner = E2-LOG-QUADRATIC-D2PLUS
```

しかしmandatory independent verifierはE2の`newRawStateCount` depth 7 predictionで、凍結済みcross-implementation relative tolerance `1e-12`を超える差を検出した。

```text
prediction mismatch: E2-LOG-QUADRATIC-D2PLUS/newRawStateCount/7
```

したがってproduction-only E2 proposalはcanonical estimatorへ昇格していない。

## 5. 正式結論

Stage 1 authorizationはsame-evidence rerunを明示的に禁止していた。real development outcomeがproduction pathで既に生成された後のfailureであるため、verifier修正、tolerance緩和、E2 special-case、failed cell除外等による救済を行わない。

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
canonical selectedEstimator = null
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
formal decision = TECHNICAL-INVALID
```

Fresh depth 10/11は生成もreadもしていない。したがってformal deeper holdout validationは行われていない。

## 6. 解釈境界

本Studyから「E2がvalidationされた」「depth 10は約34万RAW statesになる」「Bao全体の状態空間はこの規模である」とは主張しない。production-only予測値はfailure provenance / hypothesis-generation / resource-planning用diagnosticに限定する。

G2-05は`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`のまま不変であり、G2-11も`NOT-AUTHORIZED`のままである。

再検証する場合は、このStudyを救済せず、新しいprospective Studyまたは明示的new versionとしてnumerical equivalence contractを含めてoutcome前に再freezeする必要がある。

詳細は`STUDY_1_FINAL_REPORT.md`、`results/STUDY_1_FINAL_RESULT.json`、`REPRODUCIBILITY_INDEX.md`を参照する。
