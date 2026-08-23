# 局面相転移点研究 — 現在地

更新日: 2026-08-07  
Status: **Study 1 closed / Stages A–E complete / PR #26 merged into main**

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
- PR #26は2026-08-07に通常のmerge commitで`main`へ統合済み。merge commitは`f0c74a0e76e9309844f5207fd009b9a6813c14e9`。merge前の最新head `329607627c1175c6f4dbddf9159846636bb8f138`では11/11 GitHub Actions workflowが`success`だった。

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

Scientific completionとPR #26のmerge状態は分離して管理した。科学的完了後、repository closureとしてPR #26を`main`へ統合し、第1研究をrepository上でも閉じた。

## 固定済みformal decisions

| Experiment | Formal decision | 固定範囲 / 理由 |
|---|---|---|
| E-010 | **`NOT-CONFIRMED`** | minimum primary candidate 12に対し11 |
| E-011 | **`INCONCLUSIVE`** | 複数conditionがavailability不足 |
| E-017 | **`NOT-CONFIRMED`** | minimum unique controls 30000に対し23306 |
| E-018 / H16 | **`CONFIRMED`** | 固定 `hard / bao / depth2` のphase2 > legacyのみ |
| E-019 / H17 | **`NOT-CONFIRMED`** | D1/V2 pass、D3が事前登録方向と逆でglobal IUT不成立 |
| E-020 / H18 | **`CONFIRMED`** | 固定 `hard / bao / depth3` のlegacy > phase2のみ |

これらをStage B–Eの統合解釈およびrepository closureで変更しない。

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
- `capture-branch-expansion` 5/15 = 33.3%
- forced-capture control 120/4127 = 2.9%
- RR ≈ 11.46

探索段階でforcing-release precursorは終局近傍効果へ分離し、一時的spikeも独立分類した。

## 新規seed・構造一般性

### E-010

- candidate expansion 7/11 = 63.64%
- control 249/8424 = 2.96%
- RR 21.53
- trajectory-ply dedup: 2/5 vs 218/7061, RR 12.96
- formal decision: `NOT-CONFIRMED`

### E-017

- unique candidates 21
- unique expansion trajectory-ply 9
- unique expansion trajectories 9
- unique controls 23306
- dedup candidate rate 42.86%
- dedup control rate 3.12%
- RR 13.74
- formal decision: `NOT-CONFIRMED`

これらは濃縮方向と構造的一般性を支持するが、formal decisionを救済しない。

## Search-profile boundary

### E-018 / H16 — depth2

固定 `hard / bao / depth2`、P2 phase2 vs LG legacy、2000 paired games。

- P2-only 63
- LG-only 9
- discordants 72
- P2 event 3.15%
- LG event 0.45%
- RD +2.70pp
- OR P2/LG 7.0
- exact McNemar p `4.1812279092751445e-11`
- formal: **`CONFIRMED`**

### E-019 / H17 — generalization

D1 / D3 / V2の3 strata。

- D1: phase2 > legacy, pass
- D3: legacy > phase2, preregistered direction fail
- V2: phase2 > legacy, pass
- global IUT: **`NOT-CONFIRMED`**

D3 reverse:

- P2 event 13/4500
- LG event 140/4500
- exact McNemar p `4.614222568073049e-28`

### E-020 / H18 — independent D3 replication

固定 `hard / bao / depth3`、independent seeds `20275001–20279500`、4500 paired games。

- P2-only 18
- LG-only 129
- discordants 147
- P2 event 0.40%
- LG event 2.8667%
- OR LG/P2 7.1667
- exact McNemar p `7.0456833990241785e-22`
- formal: **`CONFIRMED`**

H18 confirmationはこの固定条件だけに限定する。

## Stage B mechanism synthesis

Stage Bはretrospective / secondaryであり、formal decisionsを変更しない。

主要所見:

1. game-level event rateはcandidate-bearing game rateとconditional manifestation rateへ算術分解でき、3比較すべてでconditional manifestation差がより大きい成分だった。
2. D3 legacy優位はE-019と独立E-020でregime morphologyまで再現した。
3. `namua × inside forced-capture regime`に限定しても、D2ではP2優位、D3ではLG優位が残る。
4. classifier fixed-gate分解では`captureDelta >= 3`のprofile差は小さく、phase-transition proximity、forcing-release proximity、persistenceで大きく分離する。
5. trajectory-ply dedup後も方向は維持:
   - E-018 D2: P2 11/34 = 32.35%, LG 7/31 = 22.58%
   - E-019 D3: P2 6/49 = 12.24%, LG 17/36 = 47.22%
   - E-020 D3: P2 5/42 = 11.90%, LG 13/35 = 37.14%

Working structural explanation:

> search profileとdepthはcandidateをforced-capture regimeの異なるライフサイクル位置へ配置し、長いregimeの比較的早い位置でphase transition / forcing releaseから十分離れた、持続可能なforcing区間への到達profileがD2ではP2、D3ではLGへ反転する。

これはcausal mediation / general search-profile × depth interaction confirmationではない。

Search-tree内部のPV、cutoff、leaf evaluation、horizon diagnosticsは現formal archiveに存在せず、「なぜdepth3でこの到達先が反転するか」はFuture Workへ分離する。

## Stage C recognition scope

原始マスター計画の6認定基準:

| Criterion | Final assessment |
|---|---|
| 異なる対局で再発 | **satisfied** |
| 二つ以上の独立特徴群に変化 | **partially satisfied** |
| 事前指定期間の持続 | **satisfied** |
| 新規seedで再現 | **satisfied** |
| 局面構造として説明可能 | **satisfied** |
| 反例・適用範囲を記録可能 | **satisfied** |

第2基準のみ保守的にpartialとする。最大捕獲可能量非対称化は探索群とE-010で平均方向一致したが、trajectory-ply dedup後E-010の2独立構造すべてに一般化していない。

この評価はformal experiment decisionとは別の総合認定である。

## Stage D vocabulary

正本:

- `doc/phase-transition/STUDY_1_VOCABULARY.md`

重要な区別:

- `capture-branch-expansion`のmachine classifier
- formal primary event-game endpoint
- empirical forced-capture-regime scope
- `search-profile dependence`
- `trajectory` / `trajectory-ply`

を別々に定義する。

特に「forced-capture regime内」は経験的な強いscopeだが、結果後にclassifierの新しい必要条件へ追加しない。

## Stage E final integration

正本:

- `doc/phase-transition/STUDY_1_FINAL_REPORT.md`

統合済み:

- exploration → E-020 chronology
- formal decisions
- Stage B mechanism
- Stage C recognition
- Stage D vocabulary
- representative positive / negative cases
- reproducibility / archive index
- Future Work

## Formal archive index

Repository外final bundles:

- E-011: SHA-256 `367d3543d2f404582adce07ac863c90bd11534826ef36528b25376228bef2bbc`
- E-018: SHA-256 `bc9b5ae8423628e499b97285d6a56a7abde558d29efe7fb47d9c5a550cee3bc5`
- E-019: SHA-256 `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75`
- E-020: SHA-256 `37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2`

正本:

- `doc/phase-transition/FORMAL_EXPORT_INDEX.md`

## Future Work

第1研究のformal conclusionsを拡張せず、独立研究として扱う。

- search-tree / horizon mechanism diagnostics
- reserve threshold
- nyumba transition
- front-row control
- capture→mobility transition
- non-terminal forcing→free-choice transition
- formal namua→mtajiとstrategic transitionの時間関係
- multiple transition taxonomy
- broader evaluator / depth / search implementation external validity

## 再開時の原則

第1研究はscientifically completeかつrepository closure completeとして扱う。

新規研究では:

1. 第1研究formal decisionsを変更しない。
2. 新しいformal claimには新規preregistrationを要求する。
3. 第1研究の未解決mechanismを新規studyへ持ち越す場合、Stage B retrospective findingsをhypothesis-generation evidenceとして扱う。
4. `main`上のStudy 1 final report / vocabulary / checkpointsを第1研究の正本とする。
