# Position Evaluation / Empirical Outcome Calibration Replication Study 1 — Final Report

## 1. Study identity

```text
Agenda label = G2-01
Study ID = PEOCR-STUDY1
Research Generation = Research Generation 2
Formal title = Position Evaluation / Empirical Outcome Calibration Replication Study 1
Baseline main = 9e9cb6e2525f09a873e741db9f8fa42696839fbe
Formal decision = INCONCLUSIVE
```

## 2. Scientific question

actor-relative static Bao evaluationと、固定continuation policyの下で得られるfresh empirical continuation outcomeとの対応を、Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE`を変更せず、strict identity firewallを持つ新しいheld-out replicationとしてformalに評価できるかを検証した。

engine evaluation、empirical continuation outcome、game-theoretic value、search reliability、human perception、public AI qualityは別constructとして保持した。

## 3. Prospective contract

Authoritative RAW identityは`pits,reserve,houseOwned,player,phase,winner,pending`。`turn/reason`、symmetry、reflection、seat swap、canonicalizationはformal deduplicationに使用していない。

Frozen continuation/evaluationはhard / bao / phase2 / D2 / Infinity、quiescence depth 1、`orderQuiescenceCaptures=false`、`adaptive=false`、`stableBestDepths=0`、`aspirationWindow=0`、`maxPly=160`、primary score=`AI.evaluate(state,state.player)`。

Stage 1 development familyはoutcome前に`phase-stratified-isotonic-PAVA`へ固定し、candidate-family selectionを行わなかった。Stage 2 prediction clipping `[0.01,0.99]`も事前固定し、Stage 2 refitは禁止した。

## 4. Stage 0

Stage 0 technical validationは`STAGE0-TECHNICAL-PASS`。scientific inference / confirmatory reuseはauthorizedされなかった。

## 5. Stage 1 development and model freeze

Stage 1は2,048 fresh games、seeds `24011001..24013048`。最初のauthorized executionはActions 120-minute ceilingで1536/2048にadministratively停止したが、partial artifactはscientific resultへ使用しなかった。scientific source hashesを変えずexecution ceilingだけを拡張し、同一populationを最初から再実行したrun `33017663172`が成功した。

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

全readiness gateがPASSし、Stage 1 decisionは`MODEL-FROZEN-DEVELOPMENT`。

```text
frozen mapping SHA-256 = b7e99d4e3237be65309b2359d33c3fe650343f130bad6780eb10152922278eac
reference universe SHA-256 = 5138525eb554639a68c3234f567c17e04a7c86686554917039ce9918d9938063
```

Reference universeは1602 unique trajectories、1604 opening prefixes、76010 RAW states、113642 observations。

## 6. Stage 2 technical gate and authorization

Technical smoke run `33037897038`はproduction / independent verificationともPASSし、Stage 2 scientific seedを使用しなかった。

Source-bound formal authorization commit:

```text
5d1b4a40ef95ac639787aa0abf040a455c3c2995
```

Formal populationは8192 games、seeds `24020001..24028192`。executionだけを8 contiguous shards ×1024へ固定し、seed extension / replacement / outcome-dependent extension / Stage 2 refitは禁止した。

## 7. Stage 2 execution and verification

Formal workflow run `33038132423`はSUCCESS。全8 shardがsource audit、1024-game generation、全件independent replay、artifact uploadをPASSした。全shardが揃った後にだけexact 8192-game populationを統合し、outcome-blind firewall / selection / measurementを実行した。

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

Outcomes: Namua wins/losses 903/920、Mtaji 938/809。

Independent integrated verification:

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

## 8. Estimability result

Three prospectively frozen gates failed:

```text
uniqueHistoricalTrajectoriesAfterStage1Firewall = 3898 < 4500
selectedUniqueRawStates = 3570 < 4000
mtajiSelectedStates = 1747 < 1750
```

All identity-overlap, independent-verification, outcome-count, distinct-evaluation, opening-prefix, Namua state-count, and administrative-truncation gates passed。

Mtajiはthresholdまで3 stateだったが、pre-specified ruleにnear-miss exceptionはない。追加seed、replacement、threshold change、favorable subgroup rescueは実施していない。

## 9. Formal decision

Frozen rule:

```text
all estimability/identity gates PASS + all primary criteria PASS -> CONFIRMED
all estimability/identity gates PASS + criterion failure -> NOT-CONFIRMED
any estimability/identity gate failure -> INCONCLUSIVE
```

Therefore:

```text
PEOCR-STUDY1 = INCONCLUSIVE
```

Estimability conjunctionがFAILしたためco-primary Brier-skill / log-loss-skill formal branchとBrier maxima criteriaには入らず、canonical resultは`"primary": null`を保持する。したがって本Studyを`NOT-CONFIRMED`と報告してはならず、frozen PAVAをformally validated Bao win probabilityとも報告しない。

## 10. Required diagnostics

Diagnosticsはrequired secondary diagnosticsとして計算したがformal decisionをoverrideしない。

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

## 11. Canonical evidence

```text
workflow run = 33038132423
artifact ID = 9636207301
artifact ZIP SHA-256 = 056626968573aa8aa12adb4b84a1375c4bba8dd2b816f1464f4df8fa3abcb5b0
STAGE_2_GENERATION_MANIFEST.json = 1c338346cd2d2999068c06637587e2f54913a8532e82b131b52bd479876c3411
STAGE_2_SELECTION_MEASUREMENT_SUMMARY.json = 3e19627869fb57b28b180cabd33c73219d99b0a924b7d54de7b3575cc60c8a45
STAGE_2_VERIFICATION.json = 48edbac47ae1807a512ff187486b1b8d2df4a0e54b9ca1b4c61eb6d65bbde7da
STAGE_2_FORMAL_RESULT.json = 42aab2a086b323c1dcb9e39b1187cdd5375dfc7251bd89e5ed2fd24409c35b0c
```

## 12. Interpretation and no-rescue boundary

Formal claim scopeはfrozen evaluator / population / continuation policy / state-selection rule / Stage 1 mapping下のheld-out empirical continuation-outcome calibrationのみ。

Game-theoretic value、人間の認知、causal claim、frozen population/policy外へのgeneralization、Research Generation 1 decision revision、public AI quality / AI-generation promotionはauthorizeしない。

`PEOCR-STUDY1`内ではadditional Stage 2 games、seed extension、overlap/missing-phase/duplicate-state replacement、4500/4000/1750 gate lowering、Mtaji 1747/1750のnear-miss pass扱い、Stage 1 mapping refit/replacement、favorable subgroup、alternate primary relabelingを行わない。

## 13. Final conclusion

`G2-01 / PEOCR-STUDY1`はscientifically complete。technically cleanなcomplete generationとindependent identity verificationを達成したが、strict post-firewall estimabilityが3つのpre-specified gatesで不足した。正しいformal conclusionは`INCONCLUSIVE`である。

Research Generation 1 `PEC-STUDY1 = INCONCLUSIVE`は不変で、engineering outcomeもこのscientific decisionの外部に留まる。
