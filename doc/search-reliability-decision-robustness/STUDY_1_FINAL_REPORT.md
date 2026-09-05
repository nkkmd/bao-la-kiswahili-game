# G2-02 第1研究 最終報告 — 探索信頼性と意思決定頑健性

## 1. 研究識別子

```text
Agenda label = G2-02
Study ID = SRDR-STUDY1
Research Generation = Research Generation 2
Formal title = Search Reliability / Decision Robustness Study 1
Baseline main = db6980bffb7e6853751914da628db8936c76d81e
Formal decision = INCONCLUSIVE
```

日本語題目:

**Baoにおける探索信頼性と意思決定頑健性の定量化 — depth, node budget, quiescence等の探索条件変化に対するbest move・ranking・evaluation・principal variation安定性の事前規定による検証**

## 2. 科学的な問いと境界

本研究では、同一のRAW stateに対して得られるsearch-derived decisionが、結果を見る前に固定したdepth / node budget / quiescenceの変化に対してどの程度安定するかを、新しく生成したhistorically reachable statesで定量化しました。

本StudyはPosition Complexity / Difficulty Study 1のhuman difficulty constructを救済するものではありません。

また、次は本研究のendpointではありません。

- engine evaluation correctness
- game-theoretic true best move
- empirical win probability
- 人間の知覚
- public AI strength

higher-resource searchはtruthではなく、固定したsearch referenceとしてのみ扱いました。

## 3. authoritative identityとsearch contract

Formal RAW identityは次です。

```text
pits,reserve,houseOwned,player,phase,winner,pending
```

`turn/reason`、reflection、seat swap、symmetry canonicalizationはidentityに使用していません。

固定したscientific gridは次です。

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

Node-budget条件ではiterative deepeningにおいて**全root candidateを完了した最後のdepthだけ**を採用し、partial root iterationは破棄しました。

PVは`canonical-exact-nominal-pv/quiescence-score-only/v1`としてdeterministic postprocessingしました。

## 4. Stage 0 — 技術検証

Stage 0 `SRDR-S0-TECHNICAL-2026-08-27-v1`はtechnical PASSでした。

既存Position Complexity exact diagnosticとのroot-score / TopSet agreement、node-budget semantics、quiescence、move-ordering control、RAW identity、PV reconstruction、independent verificationを通過しました。

Technical-only resource auditではD3 cumulative node cost distributionを測定し、Stage 1 gridを科学的outcomeを見る前に有限な形で固定しました。technical fixtureはscientific evidenceから永久に除外しました。

## 5. Stage 1 — development （Stageの記録）

Stage 1 `SRDR-S1-DEVELOPMENT-2026-08-27-v1`では1,280 fresh games、seed `25011001..25012280`を使用しました。

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

Initial verificationでは全1018 scientific rowsが一致しました。一方、production in-memory hashにはJSON persistence時に消える`undefined` keyが含まれていたため、aggregate measurement hashだけが不一致となりました。

scientific rowを変更せずoriginal failed verificationを保持したまま、representation-only correctionを別workflowで実行し、canonical JSON artifact hashとlegacy production hashの双方を再現しました。

Stage 1 readinessはすべてPASSし、decisionは次となりました。

```text
PROFILE-FROZEN-DEVELOPMENT
development profile hash = 665c284efeb0a9531ea49133ba313c0ed76cb09d888cbbe9324e2c0b6f3af280
```

このdevelopment result自体はformal confirmation claimを承認しません。

## 6. Stage 2 — 結果を見る前の固定

Stage 1 profileを消費した後、Stage 2 formal ruleをoutcome生成前に固定しました。

```text
games = 1536
seeds = 25021001..25022536
firewall = Stage 1 trajectory + opening-prefix + selected RAW state
search grid = unchanged from Stage 1
source-freeze commit = e176cafc15d2dde7b8767de6961959bb7ee9bb7b
authorization commit = bec87d54540c96c24353f2eeadc25338c53e54eb
```

Formal primary criterionは、すべてのestimability / identity / reproducibility gateがPASSした場合にのみ3条件を評価するconjunctionとして固定しました。

gate failure時にはprimaryを評価せず`INCONCLUSIVE`とするruleも事前に固定しました。

## 7. Stage 2 — 実行と独立検証

Formal workflow run `33124538584`はSUCCESSでした。

```text
generated games = 1536
Stage 1 trajectory/opening firewall後 trajectories = 1132
unique historical trajectories after firewall = 1040
selected unique RAW states = 1007
Namua = 518
Mtaji = 489
post-firewall overlap = trajectory 0 / opening prefix 0 / RAW state 0
```

Independent verifierはproduction Stage 1 common / search moduleおよびStage 2 runnerをimportせず、1536 gamesと1007 selected-state measurementsを再構築しました。

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

## 8. formal gateの結果

事前登録したgateのうち、FAILしたのは次の1条件だけでした。

```text
uniqueHistoricalTrajectoriesAfterStage1Firewall = 1040 < 1050
```

その他のpopulation、phase、opening-prefix、identity-overlap、measurement completion、node-budget estimability、independent verification、hash-match gateはPASSしました。

10 trajectoriesの不足はnear missですが、事前契約に例外はありません。追加seed、追加game、replacement、threshold 1050→1040変更、favorable subgroup、post-outcome population reconstructionは実施していません。

## 9. 正式判断

```text
SRDR-STUDY1 = INCONCLUSIVE
primaryFormalCriterion = null
```

これは3つのprimary criterionが`NOT-CONFIRMED`だったことを意味しません。

formal gate conjunctionが成立しなかったため、primary branchそのものへ入っていません。

## 10. 記述的secondary profile

Formal decisionには使用しない、事前指定済みsecondary profileのpooled canonical-best agreementは次でした。

```text
D1_Q1 vs D2_Q1 = 0.637537
D2_Q1 vs D3_Q1 = 0.734856
D2_Q0 vs D2_Q1 = 0.643496
D2_Q2 vs D2_Q1 = 0.748759
B64 vs D3 = 0.644751
B256 vs D3 = 0.795432
B1024 vs D3 = 0.941410
```

Namua B1024→D3 agreementは0.889961、Mtajiは0.995910でした。

これらはbounded machine-search descriptorであり、true optimality、human difficulty、engine correctnessへ昇格させません。

## 11. provenance （記録）

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

大きなper-game / selected-state / measurement artifactはimmutable GitHub Actions artifactに保持されています。

Repository-facing canonical small artifactには、formal result、verification、generation manifest、compact selection / measurement summaryを保存しています。

## 12. 変更しないclosure boundary

- 同じStage 2 populationへseed extensionを行わない。
- 1050 trajectory gateを結果確認後に緩和しない。
- Stage 2 rowをreplacement / favorable subgroupで差し替えない。
- null primary criterionをsecondary profileで救済しない。
- `D3`や`B1024`をgame-theoretic truthとして扱わない。
- public AI engineering outcomeで本decisionを変更しない。

再検証する場合は、新しいStudy IDまたは明示的にversion管理されたprospective protocol、新しい独立証拠、outcome生成前の新しいestimability designが必要です。
