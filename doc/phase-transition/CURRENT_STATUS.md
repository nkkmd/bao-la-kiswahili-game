# 局面相転移点研究 — 現在地

更新日: 2026-08-07
Status: Active / Study 1 completion phase / Stage A complete / Stage B depth-search-profile mechanism next
原始マスター計画: `doc/PHASE_TRANSITION_RESEARCH_PLAN.md`
第1研究完了計画: `doc/phase-transition/STUDY_1_COMPLETION_PLAN.md`

## 恒久運用ルール

再開指示は研究続行と工程完了時の研究台帳更新を含む。過去結果は黙って上書きせず、解釈変更の理由・根拠・影響を記録する。

必須更新対象:

- `CURRENT_STATUS.md`
- `RESEARCH_LOG.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `HYPOTHESES.md`
- 必要に応じて `checkpoints/`

`RESEARCH_LOG.md`はappend-only。過去formal corpusを再生成・上書きしない。新規formal experimentには新規preregistration、execution policy、実験固有の明示承認、execution lockを要求し、GitHub Actionsではformal corpusを生成しない。

PR #26は明示的な指示があるまでopen / draftのまま維持する。

## 第1研究のスコープ

研究開始時の `PHASE_TRANSITION_RESEARCH_PLAN.md` はRQ1–RQ10を広く設定した探索的マスター計画として保持する。

研究進行により、強制捕獲レジーム内部の `capture-branch-expansion` が最も明瞭な再現可能候補として浮上し、E-010以降の確認研究がこの現象へ集中した。

現在の第1研究は次として整理する。

> **第1研究: Baoにおける局面相転移点の発見と、capture-branch-expansionの確認**

初期RQのうち、第1研究で主対象としなかったreserve、nyumba、前列、capture→mobility、forcing→free-choice、formal phaseとの一般的関係などは否定されたのではなく、追加研究課題として繰り越す。

スコープ整理checkpoint:

- `doc/phase-transition/checkpoints/2026-08-05-study-1-scope-and-completion-plan.md`

## 現在の研究段階

完了済み:

- Phase 0研究基盤・fixture監査
- pilot-v2 100局探索工程
- 候補分類・アーキタイプ・盤面監査
- 強制捕獲レジーム分析
- 候補外対照・終局近傍効果分離
- capture-branch-expansion形成過程分析
- E-010未使用seed確認
- E-011 AI/depth頑健性
- E-017独立構造確認
- E-018 search-profile依存性直接比較
- E-019 search-profile一般化
- E-019 final formal bundle監査・repository外保管
- Stage A D3独立replication設計選定
- E-020 / H18 preregistration・execution policy・専用基盤実装

**Study 1 Stage AはE-020/H18 formal `confirmed`により完了した。現在はStage B depth/search-profile mechanismへ進む状態にある。**

E-020はfixed-localで9000 formal gamesを完了し、formal integrity `mode=formal / valid=true / errors=[]`を通過した。final bundleもrepository外へ固定・監査済みである。

## 固定済みformal decisions

- E-010: **`not-confirmed`**
- E-011: **`inconclusive`**
- E-017: **`not-confirmed`**
- E-018: **`confirmed`**
- E-019: **`not-confirmed`**
- E-020: **`confirmed`**

これらを結果後に変更しない。threshold、sample size、seed、primary endpoint、direction rule、decision ruleも事後変更しない。

E-020/H18はformal `confirmed`。固定`hard / bao / depth3`でLG event-game rate 2.8667%、P2 0.40%、LG-only 129、P2-only 18、discordants 147、exact two-sided McNemar p `7.0456833990241785e-22`。この結果を一般的なdepth interactionへ拡張しない。

## 主要な研究結果

### 探索・構造同定

- pilot-v2: 100局、5650観測、421強制捕獲レジーム
- A候補15区間、13アーキタイプ
- `capture-branch-expansion` は候補5/15 = 33.3%、対照120/4127 = 2.9%、RR約11.46
- forcing解除前兆は終局近傍効果として分離
- capture-branch-expansionを即時大量捕獲ではなく、選択手後に形成される捕獲選択肢構造の拡大として扱う

### E-010 / E-017 — 新規seed・構造一般性

E-010:

- candidate expansion 7/11 = 63.64%
- control 249/8424 = 2.96%
- RR 21.53
- minimum primary candidate 12に対し11のためformal `not-confirmed`
- trajectory-ply重複除去後: 2/5 vs 218/7061、RR 12.96

E-017:

- unique candidates 21
- unique expansion 9
- unique controls 23306
- candidate rate 42.86%
- control rate 3.12%
- dedup RR 13.74
- minimum unique controls 30000に対し23306のためformal `not-confirmed`

濃縮方向と複数固有構造での再観測は記録するが、formal decisionを救済しない。

### E-011 — AI/depth robustness

- C0 `bao/phase2/d2`: pass
- C1 `bao/phase2/d1`: insufficient
- C2 `bao/phase2/d3`: insufficient
- C3 `bao-v2/phase2/d2`: pass
- C4 `bao/legacy/d2`: insufficient
- formal global: **`inconclusive`**

E-011を結果後に`partially-robust`や`not-robust`へ読み替えない。

### E-018 — H16 search-profile dependence

固定 `hard / bao / depth2`、phase2 vs legacy、2000 paired games。

- n01 LG-only = 9
- n10 P2-only = 63
- discordants = 72
- P2 event rate = 3.15%
- LG event rate = 0.45%
- RD = +2.70pp
- OR = 7.0
- exact McNemar p = `4.1812279092751445e-11`

formal decision: **`confirmed`**

H16 confirmationはこの固定条件に限定する。全depth・全evaluatorへ一般化しない。

### E-019 — H17 search-profile generalization

D1 / D3 / V2の3 strata、13000 paired comparisons / 26000 games。

formal integrity: `mode=formal / valid=true / errors=[]`

| stratum | n01 LG-only | n10 P2-only | discordants | RD | OR | exact p | decision |
|---|---:|---:|---:|---:|---:|---:|---|
| D1 `bao/d1` | 4 | 67 | 71 | +0.9692pp | 16.75 | `8.735848890518809e-16` | `pass` |
| D3 `bao/d3` | 140 | 13 | 153 | -2.8222pp | 0.09286 | `4.614222568073049e-28` | **`fail`** |
| V2 `bao-v2/d2` | 18 | 63 | 81 | +2.25pp | 3.5 | `5.204403564731451e-7` | `pass` |

Global IUT: **`not-confirmed`**

重要な境界:

1. E-018 H16 `confirmed`は`hard / bao / depth2`で維持する。
2. H17の同方向一般化は成立しない。
3. D1とV2はphase2 > legacyでHolm standalone confirmed。
4. D3はavailability不足ではなく、legacy > phase2方向へ強く逆転した。
5. D3逆転をE-019内で新しいconfirmatory hypothesisへ読み替えない。

E-019 completion:

- `doc/phase-transition/checkpoints/2026-08-05-e019-formal-completion.md`
- `doc/phase-transition/checkpoints/2026-08-05-e019-final-bundle-audit.md`

Final bundle:

- `/home/oruorane/bao-e019-exports/e019-final-formal-evaluation.tar.gz`
- SHA-256: `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75`
- member count: 26120
- unsafe path members: 0

### E-020 — H18 D3 reversal replication

Stage AではE-019 D3で事後観測されたlegacy > phase2逆転を、独立seed blockでprospectiveに直接replicateした。

Formal design:

- 4500 paired seeds / 9000 games
- formal seed `20275001–20279500`
- condition `hard / bao / depth3`
- P2=`phase2`, LG=`legacy`
- primary population `pliesRemaining >= 9`
- paired game-level endpoint
- two-sided exact McNemar
- alpha 0.05
- minimum discordants 20
- prospective direction **LG-only > P2-only**

Formal integrity: `mode=formal / valid=true / errors=[]`.

Primary result:

- n00: 4353
- LG-only: 129
- P2-only: 18
- n11: 0
- discordants: 147
- P2 event rate: 0.40%
- LG event rate: 2.8667%
- RD P2−LG: -2.4667pp
- OR LG/P2: 7.1667
- exact McNemar p: `7.0456833990241785e-22`
- formal decision: **`confirmed`**

Interpretation boundary: E-020は固定`hard / bao / depth3`だけを確認し、E-019/H17 `not-confirmed`を変更せず、一般的search-profile × depth interactionを自動的にconfirmしない。

Completion / archive:

- `doc/phase-transition/checkpoints/2026-08-07-e020-formal-completion.md`
- `doc/phase-transition/checkpoints/2026-08-07-e020-final-bundle-audit.md`
- archive SHA-256: `37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2`

## 第1研究に残る工程

正本: `doc/phase-transition/STUDY_1_COMPLETION_PLAN.md`

### Stage A — D3逆転の独立確認

**完了。** E-020 / H18はformal `confirmed`。4500 paired gamesでLG-only 129、P2-only 18、discordants 147、exact McNemar p `7.0456833990241785e-22`。

Stage Aの役割はD3境界条件を独立seedでprospectiveに確認することであり、一般的depth interactionを主張することではない。

### Stage B — depth/search-profile依存の機構解析

E-020の独立再現結果を踏まえ、candidate発生・manifestation、trajectory分岐、forced-capture regime、branching、最大捕獲可能量などから方向変化を説明する。

E-020にはStage Bへの橋渡しとしてcandidate occurrence、candidate→expansion manifestation率、regime length / position等のdescriptive secondaryを事前指定したが、primary判定を変更しない。

新しいformal claimが必要な場合だけ別experimentとして事前登録する。

### Stage C — capture-branch-expansionの最終認定範囲

初期計画の相転移認定基準6項目に照らし、各項目を根拠付きで最終評価する。

- 異なる対局で再発
- 複数独立特徴群
- 持続性
- 新規seed再現
- 局面構造として説明可能
- 反例・適用範囲を記録可能

### Stage D — 機械定義 / Bao語彙固定

強制捕獲レジーム、category-A、capture-branch-expansion、persistence、trajectory、search-profile dependence等について、機械条件と人間向け説明を対応付ける。

### Stage E — 最終統合

- FINAL_REPORT相当の最終研究報告
- experiment / hypothesis / decision chronology
- formal decisionsと解釈境界
- 代表例・反例
- reproducibility / archive index
- Future Work

を統合し、第1研究を完了する。

## Future Work / 追加研究

初期RQは削除しない。第1研究の完了条件に含めない問いは独立した追加研究として残す。

- RQ1 namua→mtaji前後の一般的構造変化
- RQ2 formal phaseと独立戦略転移の一般化
- RQ3 reserve閾値
- RQ4 nyumba消失
- RQ5 前列支配
- RQ6 capture→mobility転換
- RQ7 forcing→free-choiceの非終局的転換
- RQ9 一対局の複数相転移の一般的確認
- RQ10 局面状態分類の一般理論

RQ8の探索条件再現性は第1研究内で重点的に扱い、D3境界条件まで整理して閉じる。

## 研究データ識別情報

### 探索群

- studyVersion: `0.4.1`
- games: 100

### E-010

- games: 200
- seed: `20261001–20261200`
- formal decision: `not-confirmed`

### E-011

- games: 2000
- seed: `20262001–20262400`
- formal integrity: valid
- formal decision: `inconclusive`

### E-017

- games: 1000
- seed: `20263001–20264000`
- formal integrity: valid
- formal decision: `not-confirmed`

### E-018

- games: 4000
- seed: `20265001–20267000`
- formal integrity: valid
- formal decision: `confirmed`
- locked source: `1f6b129b9b3cb11580244b1d4c337c067289cfdb`

### E-019

- games: 26000
- paired comparisons: 13000
- master seed block: `20268001–20274500`
- formal integrity: valid
- formal decision: `not-confirmed`
- components: D1 `pass`, D3 `fail`, V2 `pass`
- locked source: `73ccd513218d7afa96fa637b366c3af2abca6323`

### E-020

- games: 9000
- paired comparisons: 4500
- formal seed block: `20275001–20279500`
- condition: `hard / bao / depth3`, phase2 vs legacy
- formal execution authorization: granted 2026-08-05 18:41 JST
- locked source: `43ab667403d307e4163aefab631969a43fa897ee`
- formal corpus generated: yes
- formal integrity: `valid`
- formal decision: **`confirmed`**
- final archive SHA-256: `37d54414778c075069ab9ba2a80b73e6f9eefccbc944db8abf867da7d2800bd2`
