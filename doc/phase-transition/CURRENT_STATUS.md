# 局面相転移点研究 — 現在地

更新日: 2026-08-07  
Status: **Study 1 scientifically complete / Stages A–E complete / PR #26 remains open-draft-unmerged**

原始マスター計画: `doc/PHASE_TRANSITION_RESEARCH_PLAN.md`  
第1研究完了計画: `doc/phase-transition/STUDY_1_COMPLETION_PLAN.md`  
第1研究最終報告: `doc/phase-transition/STUDY_1_FINAL_REPORT.md`  
機械定義・語彙: `doc/phase-transition/STUDY_1_VOCABULARY.md`

## 恒久運用ルール

再開指示は研究続行と工程完了時の研究台帳更新を含む。過去結果は黙って上書きせず、解釈変更の理由・根拠・影響を記録する。

- `RESEARCH_LOG.md` はappend-only。
- 過去formal corpusを再生成・上書きしない。
- secondary / retrospective analysisでformal primary decisionを置換・救済・反転しない。
- 新規formal experimentには新規hypothesis / experiment ID / seed block / preregistration / execution policy / explicit authorization / execution lockを要求する。
- GitHub Actionsではformal corpusを生成しない。
- PR #26は明示的な指示があるまで **open / draft / unmerged** のまま維持する。

## 第1研究のスコープ

第1研究は次として完結した。

> **第1研究: Baoにおける局面相転移点の発見と、capture-branch-expansionの確認**

初期RQ1–RQ10は削除しない。第1研究で中心対象にしなかったreserve、nyumba、前列、capture→mobility、forcing→free-choice、formal phaseとの一般的関係等はformal failureではなくFuture Workへ繰り越す。

## 科学的完了状態

- Stage A — D3逆転の独立確認: **complete**
- Stage B — depth/search-profile mechanism analysis: **complete**
- Stage C — capture-branch-expansion recognition scope: **complete**
- Stage D — machine definition / Bao research vocabulary: **complete**
- Stage E — final Study 1 integration: **complete**

Scientific completionとPR #26のmerge/draft状態は分離する。

## 固定済みformal decisions

| Experiment | Formal decision | 固定範囲 / 理由 |
|---|---|---|
| E-010 | **`not-confirmed`** | minimum primary candidate 12に対し11 |
| E-011 | **`inconclusive`** | 複数conditionがavailability不足 |
| E-017 | **`not-confirmed`** | minimum unique controls 30000に対し23306 |
| E-018 / H16 | **`confirmed`** | 固定 `hard / bao / depth2` のphase2 > legacyのみ |
| E-019 / H17 | **`not-confirmed`** | D1/V2 pass、D3が事前登録方向と逆でglobal IUT不成立 |
| E-020 / H18 | **`confirmed`** | 固定 `hard / bao / depth3` のlegacy > phase2のみ |

これらをStage B–Eの統合解釈で変更しない。

## 中心現象

第1研究の中心現象は `capture-branch-expansion`。

最終的な推奨表現:

> **capture-branch-expansion strategic-transition phenotype**

または:

> **strong phase-transition candidate with bounded recognition scope**

無限定の `universal Bao phase transition` とは呼ばない。

Machine definitionと人間向け説明の正本:

- `doc/phase-transition/STUDY_1_VOCABULARY.md`

## 探索・構造同定

pilot-v2:

- 100 games
- 5650 observations
- 421 forced-capture regimes
- Category-A 15 intervals
- 13 Category-A archetypes

探索候補/対照:

- candidate expansion 5/15 = 33.3%
- control expansion 120/4127 = 2.9%
- RR ≈ 11.46

forcing-release precursorは終局近傍へ集中するため、独立した一般戦略転移ではなくterminal-near subtype/confoundとして扱う。

## capture-branch-expansionの機械条件

既存classifier defaultsを維持する。

- before window: 3 ply
- after window: 8 ply
- `expansionDelta = 3`
- `persistenceFraction = 0.5`
- `eventWindow = 8`

classifier order:

1. `namua-to-mtaji-precursor`
2. `forcing-release-precursor`
3. `capture-branch-expansion`
4. `temporary-spike`
5. `capture-branch-convergence`

forced-capture-regime membershipは強いempirical structural findingだが、結果後にclassifier必須条件へ追加していない。

## E-018 — depth2 search-profile dependence

固定 `hard / bao / depth2`、phase2 vs legacy、2000 paired games。

- LG-only = 9
- P2-only = 63
- discordants = 72
- P2 event rate = 3.15%
- LG event rate = 0.45%
- RD = +2.70 pp
- discordant OR = 7.0
- exact McNemar p = `4.1812279092751445e-11`

Formal decision: **`confirmed`**。

この範囲を全depth / evaluatorへ一般化しない。

## E-019 — search-profile generalization

| stratum | P2-only | LG-only | decision |
|---|---:|---:|---|
| D1 `bao/d1` | 67 | 4 | pass |
| D3 `bao/d3` | 13 | 140 | **fail** |
| V2 `bao-v2/d2` | 63 | 18 | pass |

Global H17: **`not-confirmed`**。

D3逆転をE-019内でpost-hoc confirmationへ変更しなかった。

## E-020 — prospective D3 reversal replication

固定 `hard / bao / depth3`、phase2 vs legacy、4500 paired seeds / 9000 games。

- formal seed: `20275001–20279500`
- LG-only = 129
- P2-only = 18
- discordants = 147
- P2 event rate = 0.40%
- LG event rate = 2.8667%
- RD P2−LG = -2.4667 pp
- discordant OR LG/P2 = 7.1667
- exact McNemar p = `7.0456833990241785e-22`

Formal decision: **`confirmed`**。

この結果は固定depth3の境界条件のみを確認する。一般的search-profile × depth interactionや全depth非単調性をconfirmしない。

## Stage B — mechanism synthesis

Stage Bは既存fixed corpora / archived secondary outputsだけを使用し、ゲームを生成していない。

主要結果:

1. favored profileはcandidate-bearing game rateも高い。
2. ただし差の大きい成分はcandidate→expansion manifestation。
3. favored profileはよりexpansion-compatibleなforced-capture morphologyを占める。
4. `namua × inside-regime`に固定してもD2/D3 reversalは残る。
5. captureDelta単独では反転を説明できない。
6. repeated deterministic trajectoriesはraw contrastを増幅するが、trajectory-ply dedup後も反転方向は維持される。

Trajectory-ply dedup:

| comparison | P2 | LG | direction |
|---|---:|---:|---|
| E-018 D2 | 11/34 = 32.35% | 7/31 = 22.58% | P2 > LG |
| E-019 D3 | 6/49 = 12.24% | 17/36 = 47.22% | LG > P2 |
| E-020 D3 | 5/42 = 11.90% | 13/35 = 37.14% | LG > P2 |

Stage Bの最も支持される構造説明:

> search profileとdepthは、Category-A candidateがforced-capture regime lifecycleのどこへ配置されるかを変える。capture-branch-expansionは、比較的長いregimeの早い位置にあり、formal phase transitionやforcing releaseが目前ではなく、高いcapture-option stateが持続できる **sustained-forcing window** と整合的である。固定depth2ではphase2、固定depth3ではlegacyがこのmorphologyをより多く占める。

`sustained-forcing window`はinterpretive termであり、新しいresult-fitted classifierではない。

未解決:

- なぜdepth変更がどちらのsearch profileをこのwindowへ到達させるか。

この問いにはsearch-tree node / PV / cutoff / leaf evaluation / horizon diagnostics等の新規instrumentationが必要であり、第1研究の既存corpus解析には含めない。

Stage B completion checkpoint:

- `doc/phase-transition/checkpoints/2026-08-07-stage-b-completion.md`

## Stage C — recognition scope

原始マスター計画の6認定基準:

| criterion | assessment |
|---|---|
| 異なる対局で再発 | `satisfied` |
| 二つ以上の独立特徴群 | `partially satisfied` |
| 事前指定期間の持続 | `satisfied` |
| 新規seed再現 | `satisfied` |
| 局面構造として説明可能 | `satisfied` |
| 反例・適用範囲を記録可能 | `satisfied` |

第2基準のみpartialとした理由:

- legal capture-option structureは強く再現。
- 第二特徴群としてmaximum capturable seed asymmetryは探索群とE-010で平均方向一致。
- ただしE-010 trajectory-ply dedup後の2独立構造のうち明確な非対称化は1構造のみ。

結果後にfull satisfactionへ昇格しない。

Stage C checkpoint:

- `doc/phase-transition/checkpoints/2026-08-07-stage-c-recognition-scope.md`

## Stage D — vocabulary

正本:

- `doc/phase-transition/STUDY_1_VOCABULARY.md`

主な固定語彙:

- Category-A candidate
- forced-capture regime
- legal capture-option count / capture-move branching proxy
- capture-branch-expansion
- temporary spike
- namua-to-mtaji precursor
- forcing-release precursor
- event persistence
- trajectory
- trajectory-ply
- candidate availability
- candidate-to-expansion manifestation
- search-profile dependence
- sustained-forcing window
- strategic-transition phenotype

Stage D checkpoint:

- `doc/phase-transition/checkpoints/2026-08-07-stage-d-vocabulary-completion.md`

## Stage E — final integration

Final report:

- `doc/phase-transition/STUDY_1_FINAL_REPORT.md`

Final conclusion:

> `capture-branch-expansion`は、観測されたforced-capture lifecycle内部で合法捕獲選択肢が持続的に拡大する、再現可能で構造的に解釈可能なstrategic-transition phenotypeである。顕在化率はsearch profileに依存し、tested fixed depth2とdepth3ではfavored profileが逆転する。ただし原始6認定基準のうち第二独立特徴群はpartialであり、universal Bao phase transitionとは認定しない。

## Formal archive index

正本:

- `doc/phase-transition/FORMAL_EXPORT_INDEX.md`

主要final archives:

- E-011: `367d3543d2f404582adce07ac863c90bd11534826ef36528b25376228bef2bbc`
- E-018: `bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5`
- E-019: `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75`
- E-020: `37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2`

E-020 external deterministic analysis rebuild: `EXTERNAL_REBUILD_MATCH=true`。

## 今後の研究

第1研究のformal decisionsを変更するためではなく、独立した追加研究として扱う。

### Search mechanism

- internal search-tree nodes
- principal variation
- cutoffs
- leaf evaluation
- horizon boundary
- same-opening depth1/2/3 move divergence

### 第二独立特徴群

maximum-capturable-seed asymmetry等を新しい事前登録仮説として独立trajectory-plyで確認する。

### 初期RQ Future Work

- reserve閾値
- nyumba状態変化
- 前列支配
- capture→mobility
- non-terminal forcing→free-choice
- formal namua→mtajiと戦略転移の時間関係
- 一対局の複数転移一般化
- 局面状態分類の一般理論
- evaluator/search implementationの外的妥当性

## 再開時の扱い

第1研究はscientifically complete。

再開時に第1研究のformal decisionやthresholdを変更しない。

次に研究を行う場合は、`STUDY_1_FINAL_REPORT.md`のFuture Workから**新しい研究課題として**設計する。

新しいconfirmatory claimを行う場合は必ず新規hypothesis / experiment / preregistration / seed / execution policy / authorization / lockを作成する。