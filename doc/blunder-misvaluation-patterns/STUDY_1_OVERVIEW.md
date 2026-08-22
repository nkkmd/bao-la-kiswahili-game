# Blunder / Misvaluation Patterns Study 1 — Overview

更新日: 2026-08-22  
Status: **STUDY 1 ACTIVE / STAGE 1 EXPLORATORY COMPLETE / 4 CANDIDATES PROMOTED / STAGE 2 NOT STARTED**

## 研究題目

> **Baoにおける悪手・誤評価パターンの発見と体系化 — machine-reproducible blunder structures と search-based decision loss の抽出・検証**

## 現在地

Study 1はStage 0→Stage 1 exploratory→Stage 2 formal confirmationの三段階構成である。

```text
Stage 0 technical / construct audit = COMPLETE
Stage 1 fresh exploratory discovery = COMPLETE
Stage 2 fresh formal confirmation = NOT STARTED
```

したがって、現在閉じているのは**Stage 1 exploratory discovery**であり、Study 1全体のformal conclusionはまだ存在しない。

## 何を調べたか

Baoで繰り返し現れる「悪い着手候補」を、対局結果や人間の印象だけで定義せず、同一局面の全合法手をexact searchで比較し、構造変化・応手構造・探索深度差と組み合わせて再利用可能なmachine-reproducible patternとして抽出できるかを調べた。

本Studyでは次を明確に分離した。

```text
search-based decision loss
structural consequence
forcing / response-envelope failure
horizon / static misvaluation
empirical continuation outcome
game-theoretic blunder
human misconception
```

Primary machine referenceは`bao` evaluation / exact full-window root candidate search / D3 + Q1 / root-actor perspectiveである。

## 重要な境界

Position Evaluation / Win-Rate Calibration Study 1は`INCONCLUSIVE`であり、そのStage 1 isotonic mappingをvalidated win probabilityとして本Studyのseverity endpointに使用していない。

また、Human / Expert Validation Study 1はhuman axis `INCONCLUSIVE-NOT-ESTIMABLE (N=0)`であるため、本Studyは人間の錯覚・初心者の誤認・expert judgmentを主張しない。

## Stage 0 — construct / technical validation

Stage 0では、exact move identity、root-actor perspective、TopSet/tie handling、mate-domain boundary、D3+Q1 compute feasibility、failure-token semanticsをtechnical-onlyに監査した。

D3+Q1 feasibilityはPASSし、scientific generation前にprimary referenceを固定した。

## Stage 1 — fresh exploratory discovery

Fresh corpus:

```text
games = 2048
seeds = 22400001..22402048
unique historical trajectories = 1884
distinct opening prefixes = 1621
independent full replay/search verification = PASS
```

Outcome-blind selectionはtrajectory-aware / phase-hash-assigned / no-replacementで実施した。

```text
selected unique rule states = 1200
Namua = 600
Mtaji = 600
distinct selected opening prefixes = 1067
minimum selected generation-stratum count = 185
selection readiness = PASS
```

全1200 selected rootsについて全合法手を測定した。

```text
measured legal-move records = 5295
all selected roots finite D3 candidate tables = true
measurement readiness = PASS
```

## Candidate discovery

凍結済みgrammarにより、phase + 1–2 structural preconditions + move abstractionをmatcherとし、failure tokenをmatcherから分離した。

```text
matcherCount = 16421
lowSupportMatcherCount = 9553
detailedCandidateCount = 123624
promotionPassingBeforeSupportEquivalence = 11
promotionPassingAfterSupportEquivalence = 11
```

Promotion gateはsupport、opening/stratum diversity、failure rate、D3-inferior rate、D3 TopSet rate、median normalized rank lossを事前固定した。

Automatic cap:

```text
maximum total = 6
maximum per phase = 3
maximum per failure family = 2
manual override = false
```

最終的に4 exploratory candidatesがpromotionされた。

## Promoted candidates

| ID | Phase | Matcher summary | Failure token | Failure rate | D3 inferior | Median rank loss |
| --- | --- | --- | --- | ---: | ---: | ---: |
| `BMP-S1-C01` | Namua | frontOccupied 6-8; no house; indexed row0/index4 right-side left capture | `worstReplyActorFrontConnectionsDeltaNegative` | 1.000000 | 0.730769 | 0.732143 |
| `BMP-S1-C02` | Namua | same matcher/support as C01 | `actorCaptureMoveDeltaNegative` | 0.846154 | 0.730769 | 0.732143 |
| `BMP-S1-C03` | Namua | same matcher/support as C01 | `actorLegalMoveDeltaNegative` | 0.846154 | 0.730769 | 0.732143 |
| `BMP-S1-C04` | Mtaji | frontOccupied 3-5; legalMoves 5+; coarse row1 right capture | `allRepliesActorCaptureMoveDeltaNegative` | 0.666667 | 0.703704 | 0.600000 |

C01–C03は同一opportunity supportを共有するが、frozen support-equivalenceは`opportunityIdentityHash + failureToken`で定義されるため別candidateとして保持された。

## Stage 1結論

```text
Stage 1 exploratory discovery = COMPLETE
exploratory candidates promoted = 4
candidate confirmation = NOT PERFORMED
Study 1 formal result = NONE
```

4件は、fresh-data Stage 2 formal confirmationへ送るための**machine-reproducible exploratory candidates**である。

これは「Baoの悪手パターン4件が確認された」という意味ではない。game-theoretic blunder、人間の錯覚、traditional/expert recognition、pedagogical value、別engine/populationへの一般化は未検証である。

## 次に何をすべきか

Stage 1 supportをconfirmation evidenceとして再利用せず、`BMP-S1-C01..C04`の定義を固定したままfresh seed / fresh corpusによるprospective Stage 2 formal-confirmationを設計する。

Stage 2 generationは、formal spec、contract/tooling validation、source freeze、source-bound explicit authorizationが完了するまで開始しない。

## 詳細

- [`STAGE_1_EXPLORATORY_REPORT.md`](STAGE_1_EXPLORATORY_REPORT.md)
- [`REPRODUCIBILITY_INDEX.md`](REPRODUCIBILITY_INDEX.md)
- [`CURRENT_STATUS.md`](CURRENT_STATUS.md)
- [`DECISION_REGISTER.md`](DECISION_REGISTER.md)
- [`results/STAGE_1_DISCOVERY_RESULT.json`](results/STAGE_1_DISCOVERY_RESULT.json)
