# Search Reliability / Decision Robustness Study 1 — Final Report

## 1. Study identity

```text
Agenda label = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Formal title = Search Reliability / Decision Robustness Study 1
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Formal decision = INCONCLUSIVE
```

Japanese working title:

**Baoにおける探索信頼性と意思決定頑健性の定量化 — depth, node budget, quiescence等の探索条件変化に対するbest move・ranking・evaluation・principal variation安定性のprospective検証**

## 2. Scientific question and boundary

同一RAW stateに対するsearch-derived decisionが、depth / node budget / quiescenceのprospectively frozen perturbationに対してどの程度stableかを、fresh historically reachable statesで定量化することを目的とした。

本StudyはPosition Complexity / Difficulty Study 1のhuman difficulty constructを救済しない。engine evaluation correctness、game-theoretic true best move、empirical win probability、人間の知覚、public AI strengthもendpointではない。higher-resource searchはtruthではなくfrozen referenceに限定した。

## 3. Authoritative identity and search contract

Formal RAW identity:

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason`、reflection、seat swap、symmetry canonicalizationはidentityに使用していない。

Frozen scientific grid:

```text
D1_Q1
D2_Q1
D3_Q1
D2_Q0
D2_Q2
B64_Q1_MAXD3
B256_Q1_MAXD3
B1024_Q1_MAXD3
```

Node-budget conditionsはiterative deepeningで**全root candidatesを完了した最後のdepthだけ**を採用し、partial root iterationを破棄した。PVは`canonical-exact-nominal-pv/quiescence-score-only/v1`としてdeterministic postprocessingした。

## 4. Stage 0 technical validation

Stage 0 `SRDR-S0-TECHNICAL-2026-08-27-v1`はtechnical PASS。既存Position Complexity exact diagnosticとのroot-score / TopSet agreement、node-budget semantics、quiescence、move-ordering control、RAW identity、PV reconstruction、independent verificationを通過した。

Technical-only resource auditではD3 cumulative node cost distributionを測定し、Stage 1 gridをoutcome前に有限freezeした。technical fixturesはscientific evidenceから永久除外した。

## 5. Stage 1 development

Stage 1 `SRDR-S1-DEVELOPMENT-2026-08-27-v1`は1,280 fresh games、seeds `25011001..25012280`。

```text
games generated / verified = 1280 / 1280
unique historical trajectories = 1057
selected unique RAW states = 1018
Namua = 527
Mtaji = 491
game replay mismatches = 0
selected-state mismatches = 0
measurement mismatches = 0
```

Initial verificationでは全1018 scientific rowsが一致した一方、production in-memory hashがJSON persistenceで脱落する`undefined` keysを含んだためaggregate measurement hashだけが不一致となった。scientific rowsを変更せず、original failed verificationを保持したrepresentation-only correctionを別workflowで実行し、canonical JSON artifact hashとlegacy production hashを双方再現した。

Stage 1 readinessは全PASSし、decisionは:

```text
PROFILE-FROZEN-DEVELOPMENT
development profile hash = 665c284efeb0a9531ea49133ba313c0ed76cb09d888cbbe9324e2c0b6f3af280
```

このdevelopment result自体はformal confirmation claimをauthorizedしない。

## 6. Stage 2 prospective freeze

Stage 1 profileを消費後、Stage 2 formal ruleをoutcome前にfreezeした。

```text
games = 1536
seeds = 25021001..25022536
firewall = Stage 1 trajectory + opening-prefix + selected RAW state
search grid = unchanged from Stage 1
source-freeze commit = e176cafc15d2dde7b8767de6961959bb7ee9bb7b
authorization commit = bec87d54540c96c24353f2eeadc25338c53e54eb
```

Formal primary criterionは、全estimability / identity / reproducibility gatesがPASSした場合にのみ3条件を評価するconjunctionとして固定した。gate failure時はprimaryを評価せず`INCONCLUSIVE`とするruleを事前固定した。

## 7. Stage 2 execution and independent verification

Formal workflow run `33124538584`はSUCCESS。

```text
generated games = 1536
Stage 1 trajectory/opening firewall後 trajectories = 1132
unique historical trajectories after firewall = 1040
selected unique RAW states = 1007
Namua = 518
Mtaji = 489
post-firewall overlap = trajectory 0 / opening prefix 0 / RAW state 0
```

Independent verifierはproduction Stage 1 common/search moduleおよびStage 2 runnerをimportせず、1536 gamesと1007 selected-state measurementsを再構築した。

```text
games verified = 1536
game replay mismatches = 0
selected-state mismatches = 0
measurement mismatches = 0
selection hash = a929e00fcedfcd9e6f89780d5ca02f9a5f126250e569bd3840d4d79cfa2d6f46
measurement hash = 13ca8825c250f038c510a2a7e7c0e8d1567f0d5027bd32ecb4dee0e34f64e2bd
selection hash match = true
measurement hash match = true
```

## 8. Formal gate result

唯一のfailed preregistered gate:

```text
uniqueHistoricalTrajectoriesAfterStage1Firewall = 1040 < 1050
```

他のpopulation、phase、opening-prefix、identity-overlap、measurement completion、node-budget estimability、independent verification、hash-match gatesはPASSした。

10 trajectories不足はnear missだが、prospective contractに例外はない。追加seed、追加game、replacement、threshold 1050→1040変更、favorable subgroup、post-outcome population reconstructionは実施していない。

## 9. Formal decision

```text
SRDR-STUDY1 = INCONCLUSIVE
primaryFormalCriterion = null
```

これは3 primary criteriaが`NOT-CONFIRMED`だったことを意味しない。formal gate conjunctionが成立しなかったためprimary branchへ入っていない。

## 10. Descriptive secondary profile

Formal decisionに使用しないpre-specified secondary profileでは、pooled canonical-best agreementは次だった。

```text
D1_Q1 vs D2_Q1 = 0.637537
D2_Q1 vs D3_Q1 = 0.734856
D2_Q0 vs D2_Q1 = 0.643496
D2_Q2 vs D2_Q1 = 0.748759
B64 vs D3 = 0.644751
B256 vs D3 = 0.795432
B1024 vs D3 = 0.941410
```

Namua B1024→D3 agreementは0.889961、Mtajiは0.995910だった。これらはbounded machine-search descriptorsであり、true optimality、human difficulty、engine correctnessへ昇格させない。

## 11. Provenance

```text
Stage 2 artifact ID = 9672561139
Stage 2 artifact ZIP SHA-256 = c107773d7f7a7cd9ba05a875305486738e10268435730283d6aa46cb5340e47a
formal result file SHA-256 = c7f71a4422d6f11fdf7dc14a76796b21c6e9670b503f930f6e1cea0b899b5553
verification file SHA-256 = aafefdd033da71104662202360c77579649ec62c4820b07d37461678fdca1a13
generation manifest SHA-256 = 64ee67538d1a07a77553c1cd83319a23bc07574a2cff6ad70a02afd8cb67f209
selected states artifact SHA-256 = 1c30b384c4afc38d6505f7065b1faba94111731a844565f55dd5b10d6996f263
measurements artifact SHA-256 = d58e14880853b8d0bf0929dfa8f8e6216e9f8aac33622b87c2dda0e1907ded34
canonical result hash = 7386f3efed01ba325bc3f03ed02e9cfc2d72ad48c356509987b5fcc8780f7d36
```

Large per-game / selected-state / measurement artifacts remain in the immutable GitHub Actions artifact. Repository-facing canonical small artifacts preserve the formal result, verification, generation manifest and compact selection/measurement summary.

## 12. Immutable closure boundary

- 同じStage 2 populationへseed extensionを行わない。
- 1050 trajectory gateを結果後に緩和しない。
- Stage 2 rowsをreplacement / favorable subgroupで差し替えない。
- null primary criterionをsecondary profileで救済しない。
- `D3`や`B1024`をgame-theoretic truthとして扱わない。
- public AI engineering outcomeで本decisionを変更しない。

再検証する場合はnew Study IDまたは明示的versioned prospective protocol、fresh evidence、outcome前のnew estimability designが必要である。
