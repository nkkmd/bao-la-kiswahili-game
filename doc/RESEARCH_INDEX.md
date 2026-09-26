# Bao研究成果索引

更新日: 2026-09-26  
対象: Research Generation 1〜4  
現在の状態: **Research Generation 2・3は完了済み。Research Generation 4はG4-01完了、G4-02は科学的判定なしで終了、G4-03完了、G4-04完了、G4-05完了、G4-06完了・main統合済み**

この文書は、研究成果の入口を世代別にまとめた索引です。各研究ディレクトリの`README.md`を共通の入口とし、詳細な根拠・再現方法・固定済み境界は各Studyの正本を参照してください。

## はじめに読む文書

| 目的 | 文書 |
| --- | --- |
| 第四世代の研究計画 | [`research-generation-4/PROGRAM_PLAN.md`](research-generation-4/PROGRAM_PLAN.md) |
| 第四世代の現在状態 | [`research-generation-4/CURRENT_STATUS.md`](research-generation-4/CURRENT_STATUS.md) |
| G4-01の正式結果 | [`local-game-tree-geometry-transfer-compatibility-instrument/README.md`](local-game-tree-geometry-transfer-compatibility-instrument/README.md) |
| G4-02の正式状態 | [`structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md`](structural-forcing-corridor-tree-raw-transfer/CURRENT_STATUS.md) |
| G4-03の正式結果 | [`local-width-search-ranking-transfer/README.md`](local-width-search-ranking-transfer/README.md) |
| G4-04の正式結果 | [`geometry-trajectory-dynamics-transfer/README.md`](geometry-trajectory-dynamics-transfer/README.md) |
| G4-05の正式結果 | [`reachable-late-game-exact-microdomain-oracle-foundation/README.md`](reachable-late-game-exact-microdomain-oracle-foundation/README.md) |
| G4-06の正式結果 | [`local-game-tree-geometry-exact-consequence-bridge/README.md`](local-game-tree-geometry-exact-consequence-bridge/README.md) |
| 第三世代の全体像 | [`research-generation-3/FINAL_SYNTHESIS.md`](research-generation-3/FINAL_SYNTHESIS.md) |
| 第二世代の全体像 | [`research-generation-2/FINAL_SYNTHESIS.md`](research-generation-2/FINAL_SYNTHESIS.md) |
| 今後の研究課題 | [`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md) |
| 公開AIの改善記録 | [`AI_ENGINEERING_INDEX.md`](AI_ENGINEERING_INDEX.md) |
| 文書の言語・表記方針 | [`DOCUMENTATION_LANGUAGE_POLICY.md`](DOCUMENTATION_LANGUAGE_POLICY.md) |

研究世代と公開AIの世代は別の概念です。Research Generation 2〜4は純粋研究であり、公開AIの改修は独立したengineering trackで管理しています。現在の公開AI系統は`AI-GEN4`です。研究結果が、そのままAI変更や公開承認を意味することはありません。

## Research Generation 4 — 局所幾何の意味・移送可能性・exact帰結

第四世代はprospective Program計画を固定したうえで、G3由来claimのfresh-domain transferやexact consequenceを検証しています。

| Agenda | 計画上の役割 | 現在の状態 |
| --- | --- | --- |
| `G4-01` / [`LGTTCI-STUDY1`](local-game-tree-geometry-transfer-compatibility-instrument/) | claim-transfer compatibility instrument | `COMPLETE / COMPATIBILITY-ELIGIBLE-ALL / MAIN INTEGRATED` |
| `G4-02` | corridor / tree-graph transfer | `CLOSED / NO SCIENTIFIC DECISION / MAIN INTEGRATED` |
| `G4-03` / [`LWSRT-STUDY1`](local-width-search-ranking-transfer/) | width / search-ranking transfer | `COMPLETE / STAGE2-COMPLETE-WITH-NON-ESTIMABLE / MAIN INTEGRATED` |
| `G4-04` / [`GTTD-STUDY1`](geometry-trajectory-dynamics-transfer/) | geometry-trajectory transfer | `COMPLETE / FORMAL-COMPLETE / 8-OF-8-GENERALIZATION-CONFIRMED / MAIN INTEGRATED` |
| `G4-05` / [`RLEMOF-STUDY1`](reachable-late-game-exact-microdomain-oracle-foundation/) | exact microdomain oracle foundation | `COMPLETE / EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN / MAIN INTEGRATED` |
| `G4-06` / [`LGTGECB-STUDY1`](local-game-tree-geometry-exact-consequence-bridge/) | geometry / exact consequence bridge | `COMPLETE / FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS / MAIN INTEGRATED` |
| `G4-07` | multiscale memory / return | `NEXT AUTHORIZATION-REVIEW CANDIDATE / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-08` | rule-semantic transition | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-09` | search reliability / exact agreement | `DEPENDENCY-GATED / NOT-AUTHORIZED-NOT-EXECUTED` |
| `G4-10` | protected depth-11 exact topology | `PROTECTED / NOT-AUTHORIZED-NOT-ACCESSED` |
| `G4-P01` | canonicalization re-foundation | `INDEPENDENT / NON-BLOCKING / NOT-AUTHORIZED` |
| `G4-H01` | human / expert evidence | `DEFERRED / INDEPENDENT / NON-BLOCKING` |

### G4-01

SFCDF・SILGM・GCLDの3 familyすべてが`compatible`となり、正式decisionは`COMPATIBILITY-ELIGIBLE-ALL`です。これはcompatibility/readinessの結果であり、fresh-domain generalizationそのものを確認した結果ではありません。

### G4-02

G3-04由来C1/C6のtransferをStudy 1〜4としてprospectiveに実施しましたが、最終Stage 2はformal measurement前のtechnical failureで停止しました。G4-02は`CLOSED / NO SCIENTIFIC DECISION`です。これはC1/C6のgeneralization失敗やcounterexampleを示すnegative scientific evidenceではありません。

### G4-03

G3-07でformal confirmationされたroot legal width HIGH stratumとranking-preorder changeのassociationを、fresh source-policy × root-family domainsへ移送検証しました。

```text
Stage 2 canonical run = 35993172710 / attempt 1 / success
selected roots = 192 / 192
production / independent exact = true
GENERALIZATION-CONFIRMED = 9
NOT-GENERALIZED = 1
NON-ESTIMABLE = 2
COUNTEREXAMPLE-CONFIRMED = 0
```

対象associationは本Studyのfresh domainsへ広く移送されましたが、universal lawではありません。best move correctness、game-theoretic value、AI棋力、人間のdifficulty、causal mechanismの結果でもありません。

### G4-04

G3-10でformal confirmationされたC1・C2・C3・C5のtrajectory-level directionを、fresh P1/P2 source-policy domainsへprospectiveに移送検証しました。

```text
Stage 2 canonical run = 36095831961 / attempt 1 / success
fresh seed block = 40423001..40424024 / 1024
seed reads = 369
formal measured trajectories = 64
production / independent exact = true
GENERALIZATION-CONFIRMED = 8
COUNTEREXAMPLE-CONFIRMED = 0
NOT-GENERALIZED = 0
NON-ESTIMABLE = 0
```

C1・C2・C5はP1/P2ともpositive direction、C3はP1/P2ともnegative directionでG3-10と一致し、8/8 formal testsすべて`GENERALIZATION-CONFIRMED`となりました。

ただしformal domainはP1/P2 full trajectoriesです。RF1/RF2はsupport descriptorのみでformal subgroup inferenceは行っていません。whole-Bao universal law、game-theoretic value、best move correctness、AI棋力、人間のdifficultyを意味しません。

G4-04はPR #165で`main`統合済みです。formal resultと解釈境界は統合後も変更していません。

### G4-05

G4-05 `RLEMOF-STUDY1` は、fresh reachable late-game rootsからoutcome-blind / resource-feasibility-onlyに限定microdomainを選び、complete legal-transition closureと独立exact solver agreementを検証しました。

```text
Stage 0 = STAGE0-TECHNICAL-PASS
Stage 1 = STAGE1-DEVELOPMENT-ACCEPTED
Stage 2 canonical run = 36120286922 / attempt 1 / success
fresh seed block = 40523001..40524024 / 1024 games
Stage 1 RAW identity firewall roots = 8307
fresh RAW overlap excluded count = 0
eligible candidates = 21
inspected candidates = 10
formal complete domains = 8
production / independent agreement = true
formal decision = EXACT-ORACLE-FOUNDATION-ESTABLISHED-WITHIN-FROZEN-MICRODOMAIN
```

candidate 1と4は`STATE-LIMIT`でcomplete closureにならず、そのままfail-closedしました。resource cap増加、root replacement、seed extension、same-evidence rerunは行っていません。

8 formal domainsではgraph identity、transition identity、exact solution、root result、recurrent SCC metadataまでproduction / independentで一致しました。8 domainのrecurrent countは0ですが、これはBao全体のrecurrent構造やDRAW不在を意味しません。`RECURRENT`は公式ルール上の`DRAW`ではなく、draw inferenceは未認可です。

この結果はfrozen microdomain内のexact oracle foundationであり、whole-Bao solution、best move correctness一般保証、AI棋力、人間のdifficulty、public AI変更を意味しません。

G4-05はPR #166で`main`統合済みです。merge commitは`97ffe3758157d2497b5884f7b17abe59a24159b5`で、formal resultと解釈境界は統合後も変更していません。

### G4-06

G4-06 `LGTGECB-STUDY1` は、G4-05で完全解析済みとなった固定8 microdomainをimmutable upstream populationとして使用し、relative depth 5のbounded RAW local geometryとexact value・DTF・value-preserving move countをprospectiveに接続しました。

```text
Stage 0 canonical run = 36211754989 / attempt 1 / success
Stage 0 decision = STAGE0-TECHNICAL-PASS
Stage 1 canonical run = 36214800357 / attempt 1 / success
Stage 1 execution SHA = 90283d1680cef8feda02e11b072e98b145d5d786
artifact ID = 10897225431
formal domains = 8 / 8
relations emitted = 12 / 12
all production / independent agreement = true
formal decision = FORMAL-BRIDGE-MAPPING-COMPLETE-WITHIN-FROZEN-MICRODOMAINS
G4-05 candidate rescan = 0
G4-10 depth-11 access = 0
main integration = COMPLETE / FAST-FORWARD
integrated research HEAD = 889b3d16f09517e5b8aa6621cfd347d4b8902891
```

Tree/RAW inflationは8 rootすべて`1`、transposition occupancyは8 rootすべて`0`で、両axisはvariation不足のためexact consequenceとのrelationが`NON-ESTIMABLE`となりました。Corridorとreply widthにはvariationがあり、事前登録したfinite ordering ruleでは`DTF × reply width`と`value-preserving move count × corridor`が`MONOTONE-DECREASING-ORDER-CONSISTENT`、その他のestimable primary relationは`MIXED-ORDER`でした。

この結果はN=8の固定late-game exact microdomain内のfinite ordering summaryです。whole-Bao universal law、因果関係、AI棋力、人間のdifficulty、public AI変更を意味しません。

G4-06は科学実行、closure、main統合まで完了しています。統合はformal result、no-rescue boundary、G4-10保護境界、public AI非変更を変更しません。次のcore candidateはG4-07 authorization reviewです。

詳しくは、[`research-generation-4/README.md`](research-generation-4/README.md)、[`research-generation-4/CURRENT_STATUS.md`](research-generation-4/CURRENT_STATUS.md)、[`local-game-tree-geometry-exact-consequence-bridge/FINAL_REPORT.md`](local-game-tree-geometry-exact-consequence-bridge/FINAL_REPORT.md)、[`research-generation-4/checkpoints/2026-09-26-g4-06-main-integration.md`](research-generation-4/checkpoints/2026-09-26-g4-06-main-integration.md)を参照してください。

## Research Generation 3 — 局所ゲーム木幾何

第三世代のcore `G3-01..G3-12`はすべてformal closureを持ち、`main`への統合も完了しています。中心成果は、RAW stateを基準にしたbounded local game-tree geometryの測定・検証と、主張できる範囲の明確化です。

| Agenda / Study | 最終状態 | 要点 |
| --- | --- | --- |
| `G3-01` / [`LGTGMF-STUDY1`](local-game-tree-geometry-measurement-foundation/) | `TECHNICAL-INVALID` | 当初の測定基盤からformal eligible familyは得られませんでした。 |
| 前提Study / [`LGTGMIV-STUDY1`](local-game-tree-geometry-measurement-instrument-verification/) | `FORMAL-ELIGIBLE-ALL` | RAW-only・relative depth 5のF1〜F5を測定器として適格化しました。 |
| `G3-02` / [`EBRWS-STUDY1`](effective-branching-reply-width-structure/) | `TECHNICAL-INVALID` | effective branching / reply-widthのformal claimには到達していません。 |
| `G3-03` / [`TCTGD-STUDY1`](transposition-concentration-tree-graph-divergence/) | `TECHNICAL-INVALID` | transposition / tree-graph divergenceのformal candidateは0件です。 |
| `G3-04` / [`SFCDF-STUDY1`](structural-forcing-corridor-decision-funnel/) | `FORMAL-COMPLETE` | C1は`MTAJI-GREATER`、C6は`NAMUA-GREATER`として`CONFIRMED`です。 |
| `G3-05` / [`BECT-STUDY1`](branch-expansion-compression-transition/) | `TECHNICAL-INVALID` | branch expansion / compression transitionのformal resultはありません。 |
| `G3-06` / [`BRMGI-STUDY1`](bao-rule-mechanism-geometry-intervention/) | `TECHNICAL-INVALID` | Bao固有rule eventとgeometryの関係はformalに評価できませんでした。 |
| `G3-07` / [`SILGM-STUDY1`](search-instability-local-geometry-mechanism/) | `FORMAL-COMPLETE` | 3件`CONFIRMED`、4件`NOT-CONFIRMED`、1件`NON-ESTIMABLE`です。 |
| `G3-08` / [`LGPML-STUDY1`](local-geometry-persistence-memory-length/) | `TECHNICAL-INVALID` | persistence / memory lengthのformal resultはありません。 |
| `G3-09` / [`CLGR-STUDY1`](continuous-local-geometry-representation/) | `TECHNICAL-INVALID` | 当初のcontinuous representationはformal eligibilityに到達していません。 |
| 前提Study / [`RRCLGR-STUDY1`](resource-robust-continuous-local-geometry-representation/) | `TECHNICAL-INVALID` | resource-robust retryも、別Studyとしてfail-closedしました。 |
| 前提Study / [`CRCLGR-STUDY1`](canonical-resource-robust-continuous-local-geometry-representation/) | `FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION` | `CRCLGR-R1-EXACT-SQUASHED-L1`を適格化しました。 |
| `G3-10` / [`GCLD-STUDY1`](geometry-conditioned-longitudinal-dynamics/) | `FORMAL-COMPLETE` | C1・C2・C3・C5が`CONFIRMED`、C4が`NOT-CONFIRMED`です。 |
| `G3-11` / [`FDEGHV-STUDY1`](fresh-depth10-exact-geometry-holdout/) | `EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN` | H1〜H4が`DEEPER-CONFIRMED`。depth 10は一度だけ消費済みです。 |
| `G3-12` / [`LGTGGC-STUDY1`](local-game-tree-geometry-generalization-counterexample/) | `TECHNICAL-INVALID` | Stage 2は未実行で、generalization / counterexampleのformal decisionはありません。 |

G3-11のexact resultは、standard initial RAW rootのfrozen depth-10 domainに限られます。

```text
depth-10 unique RAW states = 348270
depth-10 tree-node occurrences = 494456
cumulative distinct RAW states through depth 10 = 451127
cumulative tree-node occurrences through depth 10 = 631101
```

この数値から、Bao全体の状態空間・ゲーム木の大きさ、depth 11以深、symmetry-reduced countを推定してはいけません。

詳しくは、[`research-generation-3/README.md`](research-generation-3/README.md)、[`research-generation-3/CURRENT_STATUS.md`](research-generation-3/CURRENT_STATUS.md)、[`research-generation-3/FINAL_SYNTHESIS.md`](research-generation-3/FINAL_SYNTHESIS.md)を参照してください。

## Research Generation 2 — 測定・表現・bounded exact analysis

第二世代の純粋研究プログラム `G2-01..G2-12`は完了し、`main`へ統合済みです。各Studyはpositive resultの有無ではなく、事前に固定したgateとno-rescue ruleに従って閉じています。

| 番号 / Study | 最終状態 | 詳細 |
| --- | --- | --- |
| 17. `G2-01` / `PEOCR-STUDY1` | `INCONCLUSIVE` | [`position-evaluation-empirical-outcome-calibration-replication/`](position-evaluation-empirical-outcome-calibration-replication/) |
| 18. `G2-02` / `SRDR-STUDY1` | `INCONCLUSIVE` | [`search-reliability-decision-robustness/`](search-reliability-decision-robustness/) |
| 19. `G2-03` / `STSCV-STUDY1` | `INCONCLUSIVE`、candidateは`NON-ESTIMABLE` | [`state-transformation-semantics-canonicalization-validation/`](state-transformation-semantics-canonicalization-validation/) |
| 20. `G2-04` / `REEOE-STUDY1` | `INCONCLUSIVE` | [`restricted-endgame-exact-oracle-expansion/`](restricted-endgame-exact-oracle-expansion/) |
| 21. `G2-05` / `DRSSE-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN` | [`deep-raw-state-space-enumeration/`](deep-raw-state-space-enumeration/) |
| 22. `G2-06` / `RCPR-STUDY1` | `STAGE1-TECHNICAL-INVALID` | [`rich-critical-position-representation/`](rich-critical-position-representation/) |
| 23. `G2-07` / `PCRPR-STUDY1` | `STAGE1-TECHNICAL-INVALID` | [`practical-comeback-reply-pressure-representation/`](practical-comeback-reply-pressure-representation/) |
| 24. `G2-08` / `MDFT-STUDY1` | `NON-ESTIMABLE` | [`machine-decision-failure-taxonomy/`](machine-decision-failure-taxonomy/) |
| 25. `G2-09` / `TMGC-STUDY1` | `TECHNICAL-INVALID` | [`tactical-motif-generalization-counterexample/`](tactical-motif-generalization-counterexample/) |
| 26. `G2-10` / `UMSSR-STUDY1` | representationなし、Stage 2未承認 | [`unified-multiaxial-strategic-state-representation/`](unified-multiaxial-strategic-state-representation/) |
| 27. 前提Study / `PSRRE-STUDY1` | `NON-ESTIMABLE` | [`prospective-strategic-regime-representation-eligibility/`](prospective-strategic-regime-representation-eligibility/) |
| `G2-11` | `NON-ESTIMABLE`、未実行 | 正式Study IDは付与せず、dependency gateで閉じました。 |
| 28. `G2-12` / `SSGTGE-STUDY1` | `TECHNICAL-INVALID` | [`state-space-game-tree-growth-estimation/`](state-space-game-tree-growth-estimation/) |

### 21. Deep RAW State-Space Enumeration — Study 1 — 結果

`G2-05` / `DRSSE-STUDY1`は、standard initial RAW rootからdepth 0〜9をcomplete enumerationしました。

```text
cumulative RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
```

正式判断は`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`です。これはfrozen bounded domain内のexact claimであり、Bao全体の状態空間・ゲーム木の大きさを示すものではありません。

第二世代全体の結論と境界は、[`research-generation-2/FINAL_SYNTHESIS.md`](research-generation-2/FINAL_SYNTHESIS.md)を参照してください。

## Research Generation 1 — 基礎研究

第一世代は、局面、戦術、評価、限定終盤、状態空間を記述する基礎語彙と、prospectiveな検証手順を整えました。以下は初見向けの短い案内です。各リンク先の正式判断とscopeを優先してください。

| 番号 | テーマ | 結果の要約 | 最初に読む文書 |
| ---: | --- | --- | --- |
| 1 | 局面相転移点 | `capture-branch-expansion`を限定scopeで確認 | [`phase-transition/`](phase-transition/) |
| 2 | 定石 | 一般定石として採用できる暫定候補は0件 | [`joseki/README.md`](joseki/README.md) |
| 3 | 先攻・後攻差 | 条件依存の統合研究記録 | [`FIRST_PLAYER_ADVANTAGE_RESEARCH.md`](FIRST_PLAYER_ADVANTAGE_RESEARCH.md) |
| 4 | 局面類型と棋風 | Mtajiのbounded two-type morphologyを確認 | [`position-typology/`](position-typology/) |
| 5 | Namua→Mtaji transition | `NOT-CONFIRMED` | [`namua-mtaji-transition/`](namua-mtaji-transition/) |
| 6 | 局面複雑度 | `INCONCLUSIVE` | [`position-complexity/`](position-complexity/) |
| 7 | Tactical Motifs | C03のみ`CONFIRMED` | [`tactical-motifs/`](tactical-motifs/) |
| 8 | Tactical Motifの人間検証 | `INCONCLUSIVE-NOT-ESTIMABLE (N=0)` | [`tactical-motif-human-validation/`](tactical-motif-human-validation/) |
| 9 | 形勢評価と勝率校正 | `INCONCLUSIVE` | [`position-evaluation-calibration/`](position-evaluation-calibration/) |
| 10 | 悪手・誤評価パターン | 0件`CONFIRMED`、4件`NOT-CONFIRMED` | [`blunder-misvaluation-patterns/`](blunder-misvaluation-patterns/) |
| 11 | 重要局面と勝敗分岐 | candidate 0件、Stage 2未実行 | [`critical-positions-outcome-branching/`](critical-positions-outcome-branching/) |
| 12 | 限定終盤 | frozen 8-state domainをexact solve | [`restricted-endgame-winning-regions/`](restricted-endgame-winning-regions/) |
| 13 | 対称性・同型局面 | 5 candidateすべて`NON-ESTIMABLE` | [`symmetry-isomorphic-positions/`](symmetry-isomorphic-positions/) |
| 14 | Oracle表現整合性 | Axis A `NOT-CONFIRMED`、Axis B未実行 | [`oracle-representation-integrity-symmetry-confirmation/`](oracle-representation-integrity-symmetry-confirmation/) |
| 15 | 状態空間・ゲーム木 | `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`。24,848 RAW states / 30,941 tree nodes | [`state-space-game-tree-complexity/`](state-space-game-tree-complexity/) |
| 16 | 実戦的な逆転可能性 | `EXPLORATORY-ONLY`、candidate 0件 | [`practical-comeback-error-inducing-moves/`](practical-comeback-error-inducing-moves/) |

### 16. Practical Comeback / Error-Inducing Move — Study 1 — 結果

`PCEM-STUDY1`はfresh 3,072 gamesから300 disadvantaged rootsを選び、1,065 root-move interventionsと18,105 continuation rowsを測定しました。productionとindependent verifierは一致しましたが、55 candidate auditsのうちpromotion gateを通過した候補はありませんでした。

```text
candidateAuditCount = 55
promotedCandidateCount = 0
scientificLabel = EXPLORATORY-ONLY
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

これは、game-theoreticな勝負手、人間に対する錯誤誘発、真の勝率を否定または確認する結果ではありません。詳細は[`practical-comeback-error-inducing-moves/STUDY_1_FINAL_REPORT.md`](practical-comeback-error-inducing-moves/STUDY_1_FINAL_REPORT.md)を参照してください。

## 結果を読むときの注意

- `CONFIRMED` / `GENERALIZATION-CONFIRMED`は、事前に固定した対象・endpoint・判定条件の範囲で確認されたことを示します。普遍的なBao法則を意味しません。
- `NOT-CONFIRMED` / `NOT-GENERALIZED`は、仮説全般の不存在を証明するものではありません。
- `INCONCLUSIVE`と`NON-ESTIMABLE`はnegative resultと同義ではありません。
- `COUNTEREXAMPLE-CONFIRMED`は事前登録された反対方向条件をformalに満たした場合だけ用います。
- `TECHNICAL-INVALID`は必要な技術・検証条件を満たせずformal claimを評価できなかった状態です。
- `NOT-AUTHORIZED-NOT-EXECUTED`は実行失敗ではなく、実行を承認していないことを示します。
- RAW state、tree occurrence、search output、engine evaluation、game-theoretic value、人間の難しさは別constructです。
- exact resultは固定domain内でのみexactであり、whole-Bao solutionや未定義のDRAW semanticsへ自動拡張しません。

## 新しい研究を追加するとき

1. [`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)で既存結果との境界と優先順位を確認します。
2. 新しいStudy ID、fresh evidence、判定条件、停止規則、no-rescue boundaryを結果を見る前に固定します。
3. machine-readableな結果と、人間向けのOverview・Final Report・Current Statusを分離して保存します。
4. [`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](JAPANESE_DOCUMENTATION_QUALITY_GATE.md)に従って、見出し・本文・判断理由・限界を日本語で監査します。
5. 中央索引には詳細な時系列を複製せず、最終状態と正本への導線だけを追記します。
