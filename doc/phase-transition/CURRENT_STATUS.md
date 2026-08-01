# 局面相転移点研究 — 現在地

更新日: 2026-08-02  
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

PR #26は明示的な指示があるまでドラフトのまま維持する。

## 現在の研究段階

完了済み:

- 100局`pilot-v2`探索工程
- E-010未使用seed 200局確認実験
- E-010 trajectory重複の事後感度分析
- E-010確認群7急拡大候補の形成過程・最大捕獲可能量非対称化分析
- E-011 AI条件・探索深度横断頑健性実験の事前登録・実装・formal 2000局・integrity・評価
- E-017独立構造確認実験の事前登録・実装・formal 1000局・integrity・評価
- H16 search profile依存性直接比較E-018の事前登録
- E-018 paired-condition fixture runner / pairing integrity / paired endpoint / exact McNemar evaluator / structural secondary / execution policy / execution-lock preparation / guarded formal runner / formal integrity mode
- E-018専用GitHub Actions fixtureおよびformal-guard回帰検証
- E-018固有formal開始承認とrepository execution policy有効化

未実施:

- E-018 fixed-local execution lock生成
- E-018 formal 4000局

現在の正式判定:

- E-010: **`not-confirmed`**
- E-011: **`inconclusive`**
- E-017: **`not-confirmed`**
- E-018: **preregistered / infrastructure-validated / formal-approved / awaiting-local-lock / not-run**

E-010/E-011/E-017の判定は固定し、結果後に閾値やdecision ruleを緩和しない。

## 主要な確定事項

### 探索群

- 100局、5650観測、421強制捕獲レジーム
- A候補15区間、13アーキタイプ
- 捕獲分岐急拡大は候補33.3%、対照2.9%、RR約11.46
- forcing解除前兆は終局近傍効果として再分類
- 捕獲分岐急拡大は即時大量捕獲ではなく、後続局面の捕獲選択肢形成として扱う

## E-010 未使用seed確認

事前登録条件:

- 200局、seed `20261001–20261200`
- primary population: `pliesRemaining >= 9`
- 主解析A候補12件以上
- 急拡大候補5件以上
- 主解析対照5000件以上
- RR 3以上
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

最低主解析候補12件に対して11件。結果後に11へ緩和しない。

trajectory-ply事後感度:

- unique candidates: 5
- unique expansion: 2
- unique controls: 7061
- dedup candidate rate: 40.00%
- dedup control rate: 3.09%
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

trajectory-ply感度:

| 条件 | unique candidates | unique expansion | unique controls | dedup RR |
|---|---:|---:|---:|---:|
| C0 | 8 | 2 | 12185 | 7.87 |
| C1 | 13 | 2 | 11407 | 7.31 |
| C2 | 10 | 2 | 11695 | 10.98 |
| C3 | 11 | 4 | 12160 | 11.70 |
| C4 | 6 | 0 | 11412 | 0.00 |

phase2 C0–C3では重複除去後も候補側濃縮方向が維持された。legacy C4では生・重複除去後ともexpansion候補0。ただしC4はavailability不足であり、search profile依存性の確定証明とはしない。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-01-e011-formal-completion.md`

## E-017 独立構造確認

### 固定条件

- 1000局
- seed `20263001–20264000`
- `hard / bao / phase2 / depth 2`
- primary population: `pliesRemaining >= 9`
- primary unit: unique `trajectoryHash + eventPly`

成功条件:

- raw primary candidates >= 30
- unique candidate trajectory-ply >= 15
- unique candidate trajectories >= 12
- unique expansion trajectory-ply >= 5
- unique expansion trajectories >= 5
- unique control trajectory-ply >= 30000
- dedup RR >= 3
- dedup candidate rate > control rate

### Formal integrity

固定ローカルでformal 1000局を完了し、`verify`は次を確認した。

- observations: 56294
- games: 1000
- exact seed sequence: true
- unique game IDs: true
- all trajectory hashes present: true
- source commit matches execution lock: true
- lock preregistration/policy hash present: true
- errors: `[]`
- mode: `formal`
- valid: `true`

### Formal result

Raw endpoint:

| 指標 | 結果 |
|---|---:|
| candidates | 53 |
| expansion | 37 |
| controls | 40956 |
| control expansion | 1235 |
| candidate rate | 69.81% |
| control rate | 3.02% |
| RR | 23.15 |

Trajectory-ply deduplicated:

| 指標 | 結果 |
|---|---:|
| unique candidates | 21 |
| unique expansion | 9 |
| unique candidate trajectories | 19 |
| unique expansion trajectories | 9 |
| unique controls | 23306 |
| control expansion | 727 |
| candidate rate | 42.86% |
| control rate | 3.12% |
| RR | 13.74 |
| largest duplicate multiplicity | 24 |

criteria照合:

- raw candidates >=30: pass
- unique candidate trajectory-ply >=15: pass
- unique candidate trajectories >=12: pass
- unique expansion trajectory-ply >=5: pass
- unique expansion trajectories >=5: pass
- unique control trajectory-ply >=30000: **fail (23306)**
- dedup RR >=3: pass
- candidate rate > control rate: pass

formal decision: **`not-confirmed`**

唯一の不通過はunique control trajectory-ply。`30000`を結果後に`23306`へ緩和しない。強い効果方向、dedup RR 13.74、9固有expansion trajectoryを理由に`confirmed`へ読み替えない。

一方、独立seed blockでも構造的一般性を伴う候補側濃縮方向が再観測されたことは、formal判定と分けて記録する。

formal evaluation出力の`preregistrationStatus: preregistered-not-run`はconfig由来の古い状態文字列であり、formal実行状態の正本ではない。execution lockとformal integrity `mode=formal / valid=true`を正本とする。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-02-e017-formal-completion.md`

## E-018 H16 search profile依存性直接比較

H16:

> 捕獲分岐急拡大の顕在化はsearch profileに依存する。

E-011 C4のlegacy 0 expansionは示唆的だがavailability不足だったため、E-011を再解釈せず新規独立実験E-018として事前登録した。

### 固定設計

- P2: `hard / bao / phase2 / depth 2`
- LG: `hard / bao / legacy / depth 2`
- 2000局 / condition
- total 4000局
- shared seed `20265001–20267000`
- same seed / same random-opening boundaryをpair
- primary population: `pliesRemaining >= 9`

### Primary endpoint

一次単位は**paired shared-seed game**。

各conditionで、そのゲーム内にeligible category-A `capture-branch-expansion` candidateが1件以上あれば1、なければ0。

- `n10`: P2=1 / LG=0
- `n01`: P2=0 / LG=1
- test: two-sided exact McNemar
- alpha: 0.05
- minimum discordant pairs: 20
- direction requirement: `n10 > n01`

confirmed:

- formal integrity / pairing成功
- discordant pairs >=20
- McNemar p <=0.05
- P2-only > LG-only

not-confirmed:

- integrity / pairing成功、discordant >=20だがeffect criterion不通過

inconclusive:

- corpus / hash / source / paired opening / seed pairing / event construction / output failure、またはdiscordant <20

### 設計上の重要点

legacy側に最低expansion件数を要求しない。legacyで0件または極低率になること自体がH16と整合し得るため、E-011と同じ「最低expansion未達→insufficient」の構造をH16直接検定へ持ち込まない。

`trajectoryHash + eventPly`によるprofile別構造比較、candidate/control RR、P2/LG候補率Fisher exactは副次解析とし、primary McNemar判定を置き換えない。

### 実装・実行基盤

実装済み:

- fixture-only public runner
- paired same-seed / random-opening boundary / common-source / condition identity integrity verification
- paired game-level endpoint builder
- two-sided exact McNemar evaluator
- `trajectoryHash + eventPly` structural secondaryとFisher exact
- fixed-local execution policyとexecution-lock preparation
- guarded formal runner (`run → analyze → verify → evaluate`)
- formal integrity mode（artifact/hash/source/seed/opening/pairing/condition separation/lock監査）
- regression tests
- E-018専用GitHub Actions fixture workflow

最新の実装監査:

- infrastructure head: `c37b0e3d00b11d0d9563a815dbb653297503a90d`
- workflow: `Phase Transition Search Profile Dependence`
- Actions run: `30723040531`
- result: `success`
- formal-guard regression tests: success
- paired 2-game fixture generation: success
- fixture integrity: success
- paired endpoint construction: success
- structural secondary: success

E-017で発生したPython `__pycache__/`によるclean-worktree停止をE-018で再発させないため、Python bytecode cacheをgit ignore対象とした。これは実行環境上の予防措置であり、科学条件・事前登録・判定条件を変更しない。

### 実行状態

- preregistration: `config/experiments/phase-transition-search-profile-dependence-v1.json`
- preregistration checkpoint: `doc/phase-transition/checkpoints/2026-08-02-e018-search-profile-dependence-preregistration.md`
- infrastructure checkpoint: `doc/phase-transition/checkpoints/2026-08-02-e018-formal-infrastructure.md`
- authorization checkpoint: `doc/phase-transition/checkpoints/2026-08-02-e018-formal-start-authorization.md`
- authorization commit: `9c5a902f3fbe0df02975050f2648a2a08cefb109`
- execution policy: `config/experiments/phase-transition-search-profile-dependence-execution-policy-v1.json`
- policy status: **`approved-awaiting-local-lock`**
- `formalExecutionAllowed`: **true**
- formal execution approved: **true**
- execution lock: **not generated for formal run**
- formal corpus generated: **false**
- GitHub Actions formal run: prohibited

E-018は実験固有の開始承認を受領済み。E-017承認の継承ではない。

## 次工程

1. E-011 formal `inconclusive`、E-017 formal `not-confirmed`を固定し、結果後に判定条件を緩和しない。
2. E-018 formal infrastructureはCI検証済みとして固定する。
3. 固定ローカル環境 `/home/oruorane/github/bao-la-kiswahili-game` をこのcheckpointを含む最新branch headへfast-forwardする。
4. Node.js `v24.6.0`、Linux、clean worktreeを確認し、最新source commit・runtime・hardware・preregistration/policy hashをexecution lockへ固定する。
5. execution lockを監査し、成功後にのみ完全一致トークン `E-018-FORMAL-APPROVED` でformal 4000局を開始する。
6. corpus生成完了後、`analyze → verify → evaluate`を実行する。

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
- games: 4000 planned
- seed: `20265001–20267000`
- infrastructure: validated
- formal execution: approved / awaiting fixed-local lock / not run
