# Research Generation 2 — 最終統合報告

更新日: 2026-08-31
対象: `Bao Second-Generation Research Program`
Core agenda: `G2-01..G2-12`
状態: **`PROGRAM CLOSED / INTEGRATED TO MAIN`**

## 1. 結論

Research Generation 2は、測定、探索信頼性、state transformation、exact analysis、戦略表現、long-horizon structure、growth estimationを、Studyごとに事前固定したcontractで検証しました。

世代全体の成果は、positive resultを多数得たことではありません。`INCONCLUSIVE`、`NON-ESTIMABLE`、`TECHNICAL-INVALID`、dependencyによる未実行を区別し、結果後に救済せず正式記録として閉じたことにあります。

```text
RAW state identity = authoritative
validated transform set = []
validated strategic-regime representation = none
G2-11 = NON-ESTIMABLE / NOT-AUTHORIZED-NOT-EXECUTED
G2-12 selectedEstimator = null
whole-Bao state-space / game-tree size = NOT ESTABLISHED
G2-H01 = DEFERRED / INDEPENDENT / NON-BLOCKING
Research Generation 2 core program = CLOSED
```

## 2. 研究設計

第二世代は、Research Generation 1の判断を修正する追試ではなく、fresh evidenceを用いる独立研究系列として設計しました。全体を通じて次を守っています。

1. identity、population、seed、endpoint、threshold、stopping ruleを結果を見る前に固定する。
2. development evidenceとformal holdoutを可能な範囲で分離する。
3. production computationとindependent verificationを分離する。
4. gate failure後にthreshold、population、seed、candidate、verifierを変更して救済しない。
5. technical failureをscientific nullへ読み替えない。
6. validated transformがない限りRAW identityを基準にする。
7. 公開AIの棋力・速度・UX・deploymentを研究endpointにしない。
8. machine-only evidenceを人間の判断の代用にしない。

## 3. Study別の最終状態

| Agenda | Study | 最終状態 | 主張できないこと |
| --- | --- | --- | --- |
| `G2-01` | `PEOCR-STUDY1` | `INCONCLUSIVE` | exploratory mappingをvalidated Bao win probabilityとは扱いません。 |
| `G2-02` | `SRDR-STUDY1` | `INCONCLUSIVE` | search reliabilityのprimary criterionは未評価です。 |
| `G2-03` | `STSCV-STUDY1` | `INCONCLUSIVE`、candidateは`NON-ESTIMABLE` | canonicalizationとsymmetry reductionは未承認です。 |
| `G2-04` | `REEOE-STUDY1` | `INCONCLUSIVE` | restricted endgame expansionの一般的成立を示しません。 |
| `G2-05` | `DRSSE-STUDY1` | `EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN` | whole-Bao sizeやfull-game growthを示しません。 |
| `G2-06` | `RCPR-STUDY1` | `STAGE1-TECHNICAL-INVALID` | development structureをformal representationに昇格しません。 |
| `G2-07` | `PCRPR-STUDY1` | `STAGE1-TECHNICAL-INVALID` | reply-pressure representationはformal promotionされていません。 |
| `G2-08` | `MDFT-STUDY1` | `NON-ESTIMABLE` | machine failure taxonomyの成立を主張しません。 |
| `G2-09` | `TMGC-STUDY1` | `TECHNICAL-INVALID` | tactical motifのgeneralization結果はありません。 |
| `G2-10` | `UMSSR-STUDY1` | representationなし | `selectedRepresentation = null`です。 |
| 前提Study | `PSRRE-STUDY1` | `NON-ESTIMABLE` | `selectedRepresentation = null`です。 |
| `G2-11` | ID未付与 | `NON-ESTIMABLE`、未実行 | long-horizon structureのpositive・negative・null resultはありません。 |
| `G2-12` | `SSGTGE-STUDY1` | `TECHNICAL-INVALID` | validated growth estimatorはありません。 |

## 4. 最も強く残ったexact result

`G2-05` / `DRSSE-STUDY1`は、standard initial RAW rootからdepth 0〜9をcomplete enumerationしました。

```text
complete exact layers = 0..9
cumulative RAW states = 102857
depth-labelled legal edges = 106773
tree node occurrences = 136645
tree edge occurrences = 136644
```

正式判断は`EXACT-WITHIN-FROZEN-DEPTH-9-DOMAIN`です。この結果はbounded domain内ではexactですが、Bao全体のstate-space size、full game-tree size、symmetry-reduced countを意味しません。

## 5. 評価と探索

G2-01はfresh held-out replicationとindependent verificationまで到達しましたが、strict identity firewall後のformal populationがestimability requirementを満たさず`INCONCLUSIVE`となりました。したがって、exploratory isotonic mappingをvalidated win probabilityとして使いません。

G2-02もformal population gateが未達で、primary search-robustness criterionを評価しませんでした。数値を計算できても、事前条件を満たさない場合はformal resultへ進めないという境界を維持しています。

## 6. State transformationとexact analysis

G2-03ではmandatory independent formal artifactが成立せず、candidate transformをformal validationできませんでした。そのため、第二世代を通じて次を維持しました。

```text
validated transform set = []
canonicalization authorized = false
symmetry-reduced state counting authorized = false
RAW state identity = authoritative
```

G2-04とG2-05は、未検証のsymmetry reductionへ依存せずRAW-onlyで進めました。G2-04は必要なcomplete closure数を満たさず`INCONCLUSIVE`、G2-05はdepth 9までのbounded exact resultを確立しました。

## 7. Rich representationとfailure taxonomy

G2-06とG2-07はdevelopment上の構造を得ましたが、mandatory verification / artifact gateで停止しました。production-only evidenceをformal representationとして下流へ渡していません。

G2-08はfeature support等のglobal readinessを満たさず`NON-ESTIMABLE`、G2-09はscientific seed消費前のtechnical gateで`TECHNICAL-INVALID`となりました。これらは、それぞれtaxonomyやmotif generalizationが存在しないという結果ではありません。

## 8. Strategic representationとG2-11

G2-10では40-feature representationとdeterministic K-means `K=2..6`を評価しました。scientific readinessとindependent verificationは通過しましたが、support・silhouette・assignment stabilityを同時に満たすcandidateが0件でした。

```text
selectedRepresentation = null
```

この結果を救済せず、別の28-feature familyを`PSRRE-STUDY1`としてfresh evidenceで検証しました。しかし、feature-variation readinessは要求20に対して15で、`NON-ESTIMABLE`となりました。

G2-11を表現なしで開始すると、結果を見ながら表現を選ぶ逆流が起きます。そのため正式Study IDを付けず、次の状態で閉じました。

```text
Scientific disposition = NON-ESTIMABLE
Execution disposition = NOT-AUTHORIZED-NOT-EXECUTED
Scientific outcome generated = false
```

これはlong-horizon transitionが存在しないというnegative resultではありません。

## 9. 成長率の推定

G2-12はG2-05のdepth 0〜9 summariesをdevelopment evidenceとしてfinite estimator familyを評価し、fresh depth-10 holdoutで検証する計画でした。

Stage 1のproduction-onlyでは`E2-LOG-QUADRATIC-D2PLUS`が提案されましたが、independent implementationとのprediction differenceが事前固定したrelative tolerance `1e-12`を超えました。同じevidenceのrerunやtolerance緩和は行っていません。

```text
Stage 1 = STAGE1-TECHNICAL-INVALID
selectedEstimator = null
fresh depth 10/11 = not generated / not read
Stage 2 = NOT-AUTHORIZED-NOT-EXECUTED
```

したがって、第二世代はdepth 9までをexactに測定しましたが、whole-game growth estimatorをvalidationしていません。

## 10. 人間を対象とする研究

`G2-H01 — Human / Expert Strategic Judgment Study 1`はcore machine programから独立したnon-blocking trackです。qualified participantへのアクセスを確保できなかったため開始していません。

`N=0`はnegative human evidenceではなく、machine evidenceをhuman misconceptionやexpert judgmentのproxyとして使うことも認めません。

## 11. 分かったことと未確定なこと

正式に強く残ったものは、RAW identityを用いる再現可能なpipeline、depth 0〜9のexact enumeration、independent verification、fail-closedとno-rescueの運用です。

次は確立していません。

- validated transformation / canonicalization
- validated strategic-regime representation
- formal long-horizon transition structure
- validated whole-game growth estimator
- whole-Bao state-space / game-tree size
- human / expert strategic-judgment claim

「確立していない」は「存在しない」と同じではありません。多くは、今回のprospective contractではformalに評価できなかったことを意味します。

## 12. 将来研究への引き継ぎ

未確定の問いを再検討する場合、closed Studyをreopenしません。新しいStudy ID、fresh evidence、fresh preregistration、独立したauthorizationを用いて、次のような問いを設定できます。

- 新しいstrategic representation family
- representation-free long-horizon descriptor
- stronger numerical-equivalence contractを持つgrowth estimation
- deeper exact RAW enumeration
- state transformation / canonicalizationの独立検証
- qualified human / expert evidence

## 13. 正本

- [`PROGRAM_FINAL_RESULT.json`](PROGRAM_FINAL_RESULT.json) — machine-readableなprogram closure
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md) — 現在の状態
- [`../research-program-decisions/2026-08-31-g2-11-dependency-blocked-closure.md`](../research-program-decisions/2026-08-31-g2-11-dependency-blocked-closure.md) — G2-11 closure
- [`../research-program-decisions/2026-08-31-research-generation-2-program-closure.md`](../research-program-decisions/2026-08-31-research-generation-2-program-closure.md) — program closure
- 各StudyのFinal Report、result、Reproducibility Index

Research Generation 2は、positive resultを最大化するprogramではなく、**Baoについて再現可能に言えることと言えないことを、結果後の救済なしに分けるprogram**として完了しました。
