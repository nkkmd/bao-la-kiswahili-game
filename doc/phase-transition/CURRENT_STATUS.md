# 局面相転移点研究 — 現在地

更新日: 2026-08-05  
Status: Active  
研究計画: `doc/PHASE_TRANSITION_RESEARCH_PLAN.md`

## 恒久運用ルール

再開指示は研究続行と工程完了時の研究台帳更新を含む。過去結果は黙って上書きせず、解釈変更の理由・根拠・影響を記録する。

必須更新対象:

- `CURRENT_STATUS.md`
- `RESEARCH_LOG.md`
- `DECISION_REGISTER.md`
- `EXPERIMENT_INDEX.md`
- `HYPOTHESES.md`
- 必要に応じて `checkpoints/`

PR #26は明示的な指示があるまでopen / draftのまま維持する。

## 現在の研究段階

完了済み:

- 100局`pilot-v2`探索工程
- E-010未使用seed 200局確認実験
- E-010 trajectory重複の事後感度分析
- E-010確認群7急拡大候補の形成過程・最大捕獲可能量非対称化分析
- E-011 AI条件・探索深度横断頑健性 formal 2000局
- E-017独立構造確認 formal 1000局
- E-018 H16 search-profile依存性直接比較 formal 4000局
- E-019 H17 search-profile一般化 formal 26000局
- E-019 final formal bundle監査・repository外保管

現在の正式判定:

- E-010: **`not-confirmed`**
- E-011: **`inconclusive`**
- E-017: **`not-confirmed`**
- E-018: **`confirmed`**
- E-019: **`not-confirmed`**

これらの判定は固定し、結果後にthreshold、sample size、seed、primary endpoint、direction rule、decision ruleを変更しない。

## 主要な確定事項

### 探索群

- 100局、5650観測、421強制捕獲レジーム
- A候補15区間、13アーキタイプ
- 捕獲分岐急拡大は候補33.3%、対照2.9%、RR約11.46
- forcing解除前兆は終局近傍効果として再分類
- 捕獲分岐急拡大は即時大量捕獲ではなく、後続局面の捕獲選択肢形成として扱う

## E-010 未使用seed確認

固定条件:

- 200局、seed `20261001–20261200`
- primary population: `pliesRemaining >= 9`
- 最低主解析A候補12
- 最低急拡大候補5
- 最低主解析対照5000
- RR >=3
- 候補率 > 対照率

結果:

| 指標 | 結果 |
|---|---:|
| 主解析A候補 | 11 |
| 急拡大候補 | 7 |
| 主解析対照 | 8424 |
| 候補急拡大率 | 63.64% |
| 対照急拡大率 | 2.96% |
| RR | 21.53 |

正式判定: **`not-confirmed`**

最低主解析候補12に対し11。結果後に11へ緩和しない。

trajectory-ply事後感度:

- unique candidates: 5
- unique expansion: 2
- unique controls: 7061
- dedup RR: 12.96
- largest duplicate group: 6

生の7 expansion候補を7独立構造とは解釈しない。

## E-011 AI条件・探索深度横断頑健性

固定条件:

- 5条件×400局、2000局
- shared seed `20262001–20262400`
- primary population `pliesRemaining >= 9`

| 条件 | evaluator | search | depth | A候補 | expansion | controls | RR | status |
|---|---|---|---:|---:|---:|---:|---:|---|
| C0 | bao | phase2 | 2 | 16 | 9 | 16395 | 19.09 | `pass` |
| C1 | bao | phase2 | 1 | 15 | 2 | 15679 | 6.49 | `insufficient` |
| C2 | bao | phase2 | 3 | 12 | 3 | 15801 | 14.26 | `insufficient` |
| C3 | bao-v2 | phase2 | 2 | 19 | 11 | 16437 | 20.08 | `pass` |
| C4 | bao | legacy | 2 | 8 | 0 | 15412 | 0.00 | `insufficient` |

formal integrity: `valid: true`  
formal global decision: **`inconclusive`**

trajectory-ply重複除去後RR:

- C0 7.87
- C1 7.31
- C2 10.98
- C3 11.70
- C4 0.00

E-011を結果後に`partially-robust`や`not-robust`へ読み替えない。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-01-e011-formal-completion.md`

## E-017 独立構造確認

固定条件:

- 1000局
- seed `20263001–20264000`
- `hard / bao / phase2 / depth 2`
- primary population: `pliesRemaining >= 9`
- primary unit: unique `trajectoryHash + eventPly`
- minimum unique control trajectory-ply: 30000

formal integrity:

- games: 1000
- observations: 56294
- source commit matches lock: true
- errors: `[]`
- mode: `formal`
- valid: `true`

主結果:

| 指標 | 結果 |
|---|---:|
| unique candidates | 21 |
| unique expansion | 9 |
| unique candidate trajectories | 19 |
| unique expansion trajectories | 9 |
| unique controls | 23306 |
| candidate rate | 42.86% |
| control rate | 3.12% |
| dedup RR | 13.74 |

正式判定: **`not-confirmed`**

唯一の不通過はunique control trajectory-ply `23306 < 30000`。結果後に30000を緩和しない。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-02-e017-formal-completion.md`

## E-018 H16 search-profile依存性直接比較

H16:

> 捕獲分岐急拡大の顕在化はsearch profileに依存する。

固定設計:

- P2: `hard / bao / phase2 / depth 2`
- LG: `hard / bao / legacy / depth 2`
- 2000 paired seeds / 4000 games
- shared seed `20265001–20267000`
- same seed / same random-opening boundary
- primary population `pliesRemaining >= 9`
- paired game-level binary endpoint
- exact two-sided McNemar
- alpha 0.05
- minimum discordants 20
- direction `P2-only > LG-only`

formal integrity: `mode=formal / valid=true / errors=[]`

Primary:

- n00 = 1928
- n01 LG-only = 9
- n10 P2-only = 63
- n11 = 0
- discordants = 72
- P2 event rate = 3.15%
- LG event rate = 0.45%
- RD = +2.70pp
- discordant OR = 7.0
- exact McNemar p = `4.1812279092751445e-11`

正式判定: **`confirmed`**

H16は固定`hard / bao / depth2`のphase2対legacyに限って正式確認された。全depth・全evaluatorへ一般化しない。

Structural secondaryのtrajectory-ply直接比較は11/34対7/31、Fisher p=`0.41837226457118804`。secondaryはprimaryを変更しない。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-02-e018-formal-completion.md`

## E-019 H17 search-profile一般化

H17:

> 捕獲分岐急拡大のsearch-profile依存性は、事前指定したsearch depthおよびevaluator変更下でもphase2優位として維持される。

E-018のdepth2 confirmationを遡及拡張せず、3つの事前指定strataで新規formal experimentとして検定した。

### 固定設計

| stratum | evaluator | depth | paired seeds | games | seed range |
|---|---|---:|---:|---:|---|
| D1 | bao | 1 | 6500 | 13000 | `20268001–20274500` |
| D3 | bao | 3 | 4500 | 9000 | `20268001–20272500` |
| V2 | bao-v2 | 2 | 2000 | 4000 | `20268001–20270000` |
| total |  |  | 13000 | 26000 | nested-prefix design |

PrimaryはE-018を継承:

- `pliesRemaining >= 9`
- paired game-level eligible expansion event
- exact two-sided McNemar per stratum
- component alpha 0.05
- minimum discordants 20
- direction `phase2-only > legacy-only`
- global IUT: D1/D3/V2全て`pass`でのみ`confirmed`
- standalone stratum: Holm-Bonferroni family alpha 0.05

Locked execution:

- source commit: `73ccd513218d7afa96fa637b366c3af2abca6323`
- preregistration SHA-256: `046e38edc1baba276fe2444715e09da3280e6438b036ad3ebb89e323e3fe0ec8`
- execution-policy SHA-256: `47d8b0df17eaa7fb9e878117d973bba91aba6963bbd65cecb8e0bcb0a939495c`
- Node `v24.6.0`
- Python `3.12.3`
- numpy `2.5.1`
- pandas `3.0.5`

### Formal integrity

全26000局完了。

- D1-P2: 6500 / 393710 observations
- D1-LG: 6500 / 310951
- D3-P2: 4500 / 277876
- D3-LG: 4500 / 251160
- V2-P2: 2000 / 112412
- V2-LG: 2000 / 117587
- allConditionsPresent: true
- uniqueConditionConfigHashes: true
- commonSourceCommit: true
- sourceCommitMatchesLock: true
- withinStratumSeedSequences: true
- pairedOpeningHashesWithinStratum: true
- nestedFormalSeedPrefixes: true
- conditionIdentityClean: true
- trajectoryHashesPresent: true
- executionModeCorrect: true
- lockPreregistrationHash: true
- lockPolicyHashPresent: true
- artifactVerification: true
- errors: `[]`
- mode: `formal`
- **valid: true**

### Primary formal result

| stratum | n01 LG-only | n10 P2-only | discordants | P2 rate | LG rate | RD | OR | exact p | decision |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| D1 | 4 | 67 | 71 | 1.0308% | 0.0615% | +0.9692pp | 16.75 | `8.735848890518809e-16` | `pass` |
| D3 | 140 | 13 | 153 | 0.2889% | 3.1111% | -2.8222pp | 0.09286 | `4.614222568073049e-28` | **`fail`** |
| V2 | 18 | 63 | 81 | 3.15% | 0.90% | +2.25pp | 3.5 | `5.204403564731451e-7` | `pass` |

Holm standalone:

- D1: confirmed, adjusted p `1.7471697781037618e-15`
- D3: not confirmed for preregistered P2>LG direction
- V2: confirmed, adjusted p `5.204403564731451e-7`

D3はavailability不足ではない。153 discordant pairsを持ち、差は強いが、`P2-only=13 < LG-only=140`で事前登録方向と逆転したため`fail`。

Global formal decision: **`not-confirmed`**

IUTは全3 strataのpassを要求しているため、D3 `fail`によってH17 conjunctionは確認されなかった。D1/V2のpassやHolm standalone confirmationでglobal判定を救済しない。

### Structural secondary

Trajectory-ply direct comparison:

- D1: P2 12/64 vs LG 4/33, RD +6.63pp, RR 1.5469, Fisher p `0.565927217884321`
- D3: P2 6/49 vs LG 17/36, RD -34.98pp, RR 0.2593, Fisher p `0.0004792331642727793`
- V2: P2 17/34 vs LG 11/41, RD +23.17pp, RR 1.8636, Fisher p `0.05523184537701421`

D3 secondaryも逆方向だが、secondaryはprimary/global decisionを置き換えない。

### 解釈境界

現在の最も重要な整理:

1. **H16は維持** — `hard / bao / depth2`ではE-018によりphase2 > legacyがformal confirmed。
2. **H17はnot-confirmed** — 指定depth/evaluator全体への同方向一般化は成立しない。
3. D1 (`depth1`)とV2 (`bao-v2/depth2`)ではphase2 > legacyがstandalone Holmでも確認された。
4. D3 (`bao/depth3`)ではlegacy > phase2方向へ強く反転した。
5. D3逆転をE-019内で新しいconfirmatory仮説へ読み替えない。機構検証は新規仮説・新規事前登録・新規seed blockで行う。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-05-e019-formal-completion.md`
- `doc/phase-transition/checkpoints/2026-08-05-e019-final-bundle-audit.md`

Final bundle:

- `/home/oruorane/bao-e019-exports/e019-final-formal-evaluation.tar.gz`
- SHA-256: `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75`
- member count: 26120
- unsafe path members: 0
- reported size: 321M

## 次工程

1. E-010 `not-confirmed`、E-011 `inconclusive`、E-017 `not-confirmed`、E-018 `confirmed`、E-019 `not-confirmed`を固定する。
2. H16の確認範囲を`hard / bao / depth2`から結果後に拡張しない。
3. H17をD1/V2結果だけで`partially confirmed`等へ読み替えず、事前登録global `not-confirmed`を維持する。
4. D3の逆転を研究する場合、depth依存の非単調性・探索方式相互作用などを新規仮説として定義し、E-019 formal seedを再利用しない独立設計とする。
5. PR #26は明示的な指示があるまでopen / draftを維持する。

## 研究データ識別情報

### 探索群

- studyVersion: `0.4.1`
- games: 100

### E-010

- studyVersion: `0.4.1`
- games: 200
- seed: `20261001–20261200`
- formal decision: `not-confirmed`

### E-011

- studyVersion: `0.4.1`
- games: 2000
- seed: `20262001–20262400`
- formal integrity: valid
- formal decision: `inconclusive`

### E-017

- studyVersion: `0.4.1`
- games: 1000
- seed: `20263001–20264000`
- formal integrity: valid
- formal decision: `not-confirmed`

### E-018

- studyVersion: `0.4.1`
- games: 4000
- seed: `20265001–20267000`
- formal integrity: valid
- formal decision: `confirmed`
- locked source commit: `1f6b129b9b3cb11580244b1d4c337c067289cfdb`

### E-019

- studyVersion: `0.4.1`
- games: 26000
- paired comparisons: 13000
- master seed block: `20268001–20274500`
- formal integrity: valid
- formal decision: `not-confirmed`
- component decisions: D1 `pass`, D3 `fail`, V2 `pass`
- locked source commit: `73ccd513218d7afa96fa637b366c3af2abca6323`
