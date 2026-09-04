# Bao研究成果索引

更新日: 2026-09-04
対象: Research Generation 1〜3
現在の状態: **Research Generation 2・3は完了し、`main`へ統合済み**

この文書は、研究成果の入口を世代別にまとめた索引です。結論だけを知りたい場合は各世代の「全体像」を、根拠・再現方法・固定済み境界を確認したい場合は各StudyのFinal ReportやReproducibility Indexを参照してください。

## はじめに読む文書

| 目的 | 文書 |
| --- | --- |
| 第三世代の全体像 | [`research-generation-3/FINAL_SYNTHESIS.md`](research-generation-3/FINAL_SYNTHESIS.md) |
| 第二世代の全体像 | [`research-generation-2/FINAL_SYNTHESIS.md`](research-generation-2/FINAL_SYNTHESIS.md) |
| 今後の研究課題 | [`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md) |
| 公開AIの改善記録 | [`AI_ENGINEERING_INDEX.md`](AI_ENGINEERING_INDEX.md) |
| 文書の言語・表記方針 | [`DOCUMENTATION_LANGUAGE_POLICY.md`](DOCUMENTATION_LANGUAGE_POLICY.md) |

研究世代と公開AIの世代は別の概念です。Research Generation 2・3は純粋研究であり、公開AIの改修は`PBAI-P1`・`PBAI-P2`という独立engineering trackで扱います。研究結果が、そのままAI変更や公開承認を意味することはありません。

## Research Generation 3 — 局所ゲーム木幾何

第三世代のcore `G3-01..G3-12`はすべてformal closureを持ち、`main`への統合も完了しています。中心成果は、RAW stateを基準にしたbounded local game-tree geometryの測定・検証と、主張できる範囲の明確化です。

| Agenda / Study | 最終状態 | 要点 |
| --- | --- | --- |
| `G3-01` / `LGTGMF-STUDY1` | `TECHNICAL-INVALID` | 当初の測定基盤からformal eligible familyは得られませんでした。 |
| 前提Study / `LGTGMIV-STUDY1` | `FORMAL-ELIGIBLE-ALL` | RAW-only・relative depth 5のF1〜F5を測定器として適格化しました。 |
| `G3-02` / `EBRWS-STUDY1` | `TECHNICAL-INVALID` | effective branching / reply-widthのformal claimには到達していません。 |
| `G3-03` / `TCTGD-STUDY1` | `TECHNICAL-INVALID` | transposition / tree-graph divergenceのformal candidateは0件です。 |
| `G3-04` / `SFCDF-STUDY1` | `FORMAL-COMPLETE` | C1は`MTAJI-GREATER`、C6は`NAMUA-GREATER`として`CONFIRMED`です。 |
| `G3-05` / `BECT-STUDY1` | `TECHNICAL-INVALID` | branch expansion / compression transitionのformal resultはありません。 |
| `G3-06` / `BRMGI-STUDY1` | `TECHNICAL-INVALID` | Bao固有rule eventとgeometryの関係はformalに評価できませんでした。 |
| `G3-07` / `SILGM-STUDY1` | `FORMAL-COMPLETE` | 3件`CONFIRMED`、4件`NOT-CONFIRMED`、1件`NON-ESTIMABLE`です。 |
| `G3-08` / `LGPML-STUDY1` | `TECHNICAL-INVALID` | persistence / memory lengthのformal resultはありません。 |
| `G3-09` / `CLGR-STUDY1` | `TECHNICAL-INVALID` | 当初のcontinuous representationはformal eligibilityに到達していません。 |
| 前提Study / `RRCLGR-STUDY1` | `TECHNICAL-INVALID` | resource-robust retryも、別Studyとしてfail-closedしました。 |
| 前提Study / `CRCLGR-STUDY1` | `FORMAL-ELIGIBLE-RESOURCE-BOUNDED-CONTINUOUS-REPRESENTATION` | `CRCLGR-R1-EXACT-SQUASHED-L1`を適格化しました。 |
| `G3-10` / `GCLD-STUDY1` | `FORMAL-COMPLETE` | C1・C2・C3・C5が`CONFIRMED`、C4が`NOT-CONFIRMED`です。 |
| `G3-11` / `FDEGHV-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-10-DOMAIN` | H1〜H4が`DEEPER-CONFIRMED`。depth 10は一度だけ消費済みです。 |
| `G3-12` / `LGTGGC-STUDY1` | `TECHNICAL-INVALID` | Stage 2は未実行で、generalization / counterexampleのformal decisionはありません。 |

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
| 1 | 局面相転移点 | `capture-branch-expansion`を限定scopeで確認 | [`phase-transition/STUDY_1_OVERVIEW.md`](phase-transition/STUDY_1_OVERVIEW.md) |
| 2 | 定石 | 一般定石として採用できる暫定候補は0件 | [`joseki/README.md`](joseki/README.md) |
| 3 | 先攻・後攻差 | 条件依存の統合研究記録 | [`FIRST_PLAYER_ADVANTAGE_RESEARCH.md`](FIRST_PLAYER_ADVANTAGE_RESEARCH.md) |
| 4 | 局面類型と棋風 | Mtajiのbounded two-type morphologyを確認 | [`position-typology/STUDY_1_OVERVIEW.md`](position-typology/STUDY_1_OVERVIEW.md) |
| 5 | Namua→Mtaji transition | `NOT-CONFIRMED` | [`namua-mtaji-transition/STUDY_1_OVERVIEW.md`](namua-mtaji-transition/STUDY_1_OVERVIEW.md) |
| 6 | 局面複雑度 | `INCONCLUSIVE` | [`position-complexity/STUDY_1_OVERVIEW.md`](position-complexity/STUDY_1_OVERVIEW.md) |
| 7 | Tactical Motifs | C03のみ`CONFIRMED` | [`tactical-motifs/STUDY_1_OVERVIEW.md`](tactical-motifs/STUDY_1_OVERVIEW.md) |
| 8 | Tactical Motifの人間検証 | `INCONCLUSIVE-NOT-ESTIMABLE (N=0)` | [`tactical-motif-human-validation/STUDY_1_OVERVIEW.md`](tactical-motif-human-validation/STUDY_1_OVERVIEW.md) |
| 9 | 形勢評価と勝率校正 | `INCONCLUSIVE` | [`position-evaluation-calibration/STUDY_1_OVERVIEW.md`](position-evaluation-calibration/STUDY_1_OVERVIEW.md) |
| 10 | 悪手・誤評価パターン | 0件`CONFIRMED`、4件`NOT-CONFIRMED` | [`blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md`](blunder-misvaluation-patterns/STUDY_1_OVERVIEW.md) |
| 11 | 重要局面と勝敗分岐 | candidate 0件、Stage 2未実行 | [`critical-positions-outcome-branching/STUDY_1_OVERVIEW.md`](critical-positions-outcome-branching/STUDY_1_OVERVIEW.md) |
| 12 | 限定終盤 | frozen 8-state domainをexact solve | [`restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md`](restricted-endgame-winning-regions/STUDY_1_OVERVIEW.md) |
| 13 | 対称性・同型局面 | 5 candidateすべて`NON-ESTIMABLE` | [`symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md`](symmetry-isomorphic-positions/STUDY_1_OVERVIEW.md) |
| 14 | Oracle表現整合性 | Axis A `NOT-CONFIRMED`、Axis B未実行 | [`oracle-representation-integrity-symmetry-confirmation/STUDY_1_OVERVIEW.md`](oracle-representation-integrity-symmetry-confirmation/STUDY_1_OVERVIEW.md) |
| 15 | 状態空間・ゲーム木 | `SSGTC-EXACT-WITHIN-FROZEN-DEPTH-8-DOMAIN`。24,848 RAW states / 30,941 tree nodes | [`state-space-game-tree-complexity/STUDY_1_OVERVIEW.md`](state-space-game-tree-complexity/STUDY_1_OVERVIEW.md) |
| 16 | 実戦的な逆転可能性 | `EXPLORATORY-ONLY`、candidate 0件 | [`practical-comeback-error-inducing-moves/STUDY_1_OVERVIEW.md`](practical-comeback-error-inducing-moves/STUDY_1_OVERVIEW.md) |

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

- `CONFIRMED`は、事前に固定した対象・endpoint・判定条件の範囲で確認されたことを示します。普遍的なBao法則を意味しません。
- `NOT-CONFIRMED`は、仮説全般の不存在を証明するものではありません。
- `INCONCLUSIVE`と`NON-ESTIMABLE`は、negative resultと同義ではありません。
- `TECHNICAL-INVALID`は、必要な技術・検証条件を満たせずformal claimを評価できなかった状態です。
- `NOT-AUTHORIZED-NOT-EXECUTED`は、実行に失敗したのではなく、実行を承認していないことを示します。
- RAW state、tree occurrence、search output、engine evaluation、game-theoretic value、人間の難しさは別のconstructです。

## 新しい研究を追加するとき

1. [`FUTURE_RESEARCH_AGENDA.md`](FUTURE_RESEARCH_AGENDA.md)で、既存結果との境界と優先順位を確認します。
2. 新しいStudy ID、fresh evidence、判定条件、停止規則、no-rescue boundaryを結果を見る前に固定します。
3. machine-readableな結果と、人間向けのOverview・Final Report・Current Statusを分離して保存します。
4. [`JAPANESE_DOCUMENTATION_QUALITY_GATE.md`](JAPANESE_DOCUMENTATION_QUALITY_GATE.md)に従って、見出し・本文・判断理由・限界を日本語で監査します。
5. 中央索引には詳細な時系列を複製せず、最終状態と正本への導線だけを追記します。
