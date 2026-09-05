# G2-01 第1研究 最終報告 — 形勢評価と実現勝敗の校正再検証

## 1. 研究識別子

```text
Agenda label = G2-01
Study ID = PEOCR-STUDY1
Research Generation = Research Generation 2
Formal title = Position Evaluation / Empirical Outcome Calibration Replication Study 1
Baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
Formal decision = INCONCLUSIVE
```

## 2. 科学的な問い

本研究では、**手番側から見たBaoの静的評価値（actor-relative static Bao evaluation）と、固定したcontinuation policyの下で得られる新しい継続対局の実現勝敗との対応関係を、独立したheld-out replicationとして正式に評価できるか**を検証しました。

Research Generation 1の`PEC-STUDY1 = INCONCLUSIVE`という既存判断は変更・救済しません。

また、次の概念は互いに別のconstructとして扱いました。

- engine evaluation
- empirical continuation outcome
- game-theoretic value
- search reliability
- human perception
- public AI quality

## 3. 結果を見る前に固定した契約

Authoritative RAW identityは次の7項目です。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason`、symmetry、reflection、seat swap、canonicalizationはformal deduplicationに使用していません。

固定したcontinuation / evaluation条件はhard / bao / phase2 / D2 / Infinity、quiescence depth 1、`orderQuiescenceCaptures=false`、`adaptive=false`、`stableBestDepths=0`、`aspirationWindow=0`、`maxPly=160`、primary score=`AI.evaluate(state,state.player)`です。

Stage 1のdevelopment familyは科学的outcomeを見る前に`phase-stratified-isotonic-PAVA`へ固定し、candidate-family selectionは行いませんでした。Stage 2 prediction clipping `[0.01,0.99]`も事前固定し、Stage 2でのrefitは禁止しました。

## 4. Stage 0 — 技術検証

Stage 0 technical validationは`STAGE0-TECHNICAL-PASS`でした。

このStageではscientific inference / confirmatory reuseは承認されていません。

## 5. Stage 1 — developmentとmodel固定

Stage 1では2,048 fresh games、seed `24011001..24013048`を使用しました。

最初のauthorized executionはGitHub Actionsの120-minute ceilingによって1536/2048局でadministratively停止しましたが、そのpartial artifactはscientific resultへ使用していません。scientific source hashを変更せずexecution ceilingだけを拡張し、同一populationを最初から再実行したrun `33017663172`が成功しました。

```text
games = 2048
unique historical trajectories = 1602
selected unique RAW states = 1547
Namua = 806
Mtaji = 741
administrative truncation rate = 0
independent replay mismatches = 0
measurement mismatches = 0
```

すべてのreadiness gateがPASSし、Stage 1 decisionは`MODEL-FROZEN-DEVELOPMENT`となりました。

```text
frozen mapping SHA-256 = b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac
reference universe SHA-256 = 5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063
```

Reference universeは1602 unique trajectories、1604 opening prefixes、76010 RAW states、113642 observationsです。

## 6. Stage 2 — technical gateと正式実行承認

Technical smoke run `33037897038`はproduction / independent verificationともPASSし、Stage 2 scientific seedは使用していません。

Source-bound formal authorization commitは次です。

```text
5d1b4a40ef95ac639787aa0abf040a455c3c2995
```

Formal populationは8192 games、seed `24020001..24028192`です。実行上のみ8 contiguous shards ×1024へ分割し、seed extension / replacement / outcome-dependent extension / Stage 2 refitは禁止しました。

## 7. Stage 2 — 実行と独立検証

Formal workflow run `33038132423`はSUCCESSでした。全8 shardがsource audit、1024-game generation、全件independent replay、artifact uploadをPASSしました。

全shardが揃った後にのみexact 8192-game populationを統合し、outcome-blind firewall / selection / measurementを実行しました。

```text
generated games = 8192
unique trajectories before Stage 1 firewall = 4714
Stage 1 trajectory overlap excluded = 816
Stage 1 opening-prefix overlap excluded = 0
unique trajectories after trajectory/opening firewall = 3898
Stage 1 RAW observations excluded = 4765
unavailable assigned phase = 318
provisional selected states = 3580
duplicate selected RAW states collapsed = 10
selected unique RAW states = 3570
Namua = 1823
Mtaji = 1747
distinct opening prefixes = 3570
administrative truncation rate = 0
```

実現勝敗はNamua wins/losses 903/920、Mtaji 938/809でした。

統合後の独立検証結果は次です。

```text
passed = true
measurement mismatches = 0
selection hash match = true
measurement hash match = true
Stage 1 trajectory overlap = 0
Stage 1 opening-prefix overlap = 0
Stage 1 RAW-state overlap = 0
selection hash = eb3e65fd388168e6440eee7c64675face828d285755992f01bcf4b8c8879dbea
measurement hash = e3e6fe1d763f5ca2bf8b654ce39a4d3b3edda125e7e1eb92f9daee00c0f38294
```

## 8. 推定可能性の判定結果

事前に固定した判定条件のうち、次の3条件がFAILしました。

```text
uniqueHistoricalTrajectoriesAfterStage1Firewall = 3898 < 4500
selectedUniqueRawStates = 3570 < 4000
mtajiSelectedStates = 1747 < 1750
```

一方、identity overlap、independent verification、outcome count、distinct evaluation、opening prefix、Namua state count、administrative truncationに関する条件はすべてPASSしました。

Mtajiはthresholdまで3 stateでしたが、pre-specified ruleにnear-miss exceptionはありません。追加seed、replacement、threshold change、favorable subgroupによる救済は実施していません。

## 9. 正式判断

事前固定した判断規則は次です。

```text
all estimability/identity gates PASS + all primary criteria PASS -> CONFIRMED
all estimability/identity gates PASS + criterion failure -> NOT-CONFIRMED
any estimability/identity gate failure -> INCONCLUSIVE
```

したがって、正式判断は次のとおりです。

```text
PEOCR-STUDY1 = INCONCLUSIVE
```

Estimability conjunctionがFAILしたため、co-primary Brier-skill / log-loss-skill formal branchおよびBrier maxima criteriaには入りませんでした。canonical resultは`"primary": null`を保持します。

したがって、本Studyを`NOT-CONFIRMED`と報告してはいけません。また、frozen PAVAをformally validated Bao win probabilityとして報告することもできません。

## 10. 必須secondary diagnostics

Diagnosticsは事前指定されたrequired secondary diagnosticsとして計算しましたが、formal decisionを上書きしません。

```text
Namua: n=1823, bias=-0.0106267429, ECE=0.0376802844,
       calibration slope=0.8232591596,
       slope bootstrap95=[0.6533723064,0.9948506094],
       raw-score AUC=0.6711703741

Mtaji: n=1747, bias=-0.0052727836, ECE=0.0274862636,
       calibration slope=1.0895006226,
       slope bootstrap95=[0.9940119515,1.2040293401],
       raw-score AUC=0.9722287380
```

## 11. canonical evidence （証拠と成果物）

```text
workflow run = 33038132423
artifact ID = 9636207301
artifact ZIP SHA-256 = 056626968573aa8aa12adb4b84a1375c4bba8dd2b816f1464f4df8fa3abcb5b0
STAGE_2_GENERATION_MANIFEST.json = 1c338346cd2d2999068c06637587e2f54913a8532e82b131b52bd479876c3411
STAGE_2_SELECTION_MEASUREMENT_SUMMARY.json = 3e19627869fb57b28b180cabd33c73219d99b0a924b7d54de7b3575cc60c8a45
STAGE_2_VERIFICATION.json = 48edbac47ae1807a512ff187486b1b8d2df4a0e54b9ca1b4c61eb6d65bbde7da
STAGE_2_FORMAL_RESULT.json = 42aab2a086b323c1dcb9e39b1187cdd5375dfc7251bd89e5ed2fd24409c35b0c
```

## 12. 解釈上の境界とno-rescue boundary

正式なclaimの範囲は、固定したevaluator / population / continuation policy / state-selection rule / Stage 1 mappingの下におけるheld-out empirical continuation-outcome calibrationだけです。

次の主張は承認しません。

- game-theoretic value
- 人間の認知に関するclaim
- causal claim
- frozen population / policy外へのgeneralization
- Research Generation 1 decisionの変更
- public AI quality / AI-generation promotion

`PEOCR-STUDY1`内では、additional Stage 2 games、seed extension、overlap / missing-phase / duplicate-state replacement、4500 / 4000 / 1750 gate lowering、Mtaji 1747/1750のnear-miss pass扱い、Stage 1 mapping refit / replacement、favorable subgroup、alternate primary relabelingを行いません。

## 13. 最終結論

`G2-01 / PEOCR-STUDY1`は科学的に完了しています。

技術的にcleanなcomplete generationと独立なidentity verificationを達成しましたが、strict post-firewall estimabilityが事前指定した3つの条件で不足しました。したがって、正しいformal conclusionは`INCONCLUSIVE`です。

Research Generation 1の`PEC-STUDY1 = INCONCLUSIVE`は不変であり、engineering outcomeもこの科学的判断の外部に留まります。
