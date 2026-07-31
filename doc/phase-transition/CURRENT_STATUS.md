# 局面相転移点研究 — 現在地

更新日: 2026-08-01  
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

次まで完了した。

- 100局`pilot-v2`探索工程
- E-010未使用seed 200局確認実験
- E-010 trajectory重複の事後感度分析
- E-010確認群7急拡大候補の形成過程・最大捕獲可能量非対称化分析
- E-011 AI条件・探索深度横断頑健性実験の事前登録
- E-011 multi-condition runner、integrity validator、combined evaluator、回帰fixture
- E-011 trajectory重複感度の補足事前登録
- E-011固定ローカル実行policy、execution lock generator、guarded formal runner
- E-017独立構造確認実験の1000局事前登録
- E-017 trajectory-ply主解析evaluatorの実装とGitHub Actions検証

未実施:

- E-011正式400局×5条件
- E-017正式1000局

両実験とも正式実行未承認であり、GitHub Actionsでは正式corpusを生成しない。

## 主要な確定事項

### 探索群

- 100局、5650観測、421強制捕獲レジーム
- A候補15区間、13アーキタイプ
- 捕獲分岐急拡大は候補33.3%、対照2.9%、RR約11.46
- forcing解除前兆は終局近傍効果として再分類
- 捕獲分岐急拡大は即時大量捕獲ではなく、後続局面の捕獲選択肢形成として扱う

### E-010事前登録判定

| 指標 | 結果 | 条件 |
|---|---:|---:|
| 主解析A候補 | 11 | 12以上 |
| 急拡大候補 | 7 | 5以上 |
| 主解析対照 | 8424 | 5000以上 |
| 候補急拡大率 | 63.64% | — |
| 対照急拡大率 | 2.96% | — |
| リスク比 | 21.53 | 3以上 |

正式判定: `not-confirmed`

最低主解析候補12件に対して11件だった。結果後に条件を緩和せず、正式判定を維持する。

### E-010 trajectory重複感度

重複除去キー: `trajectoryHash + candidatePly`

| 指標 | 生の単位 | 重複除去後 |
|---|---:|---:|
| 主解析A候補 | 11 | 5 |
| 急拡大候補 | 7 | 2 |
| 主解析対照 | 8424 | 7061 |
| 急拡大対照 | 249 | 218 |
| 候補急拡大率 | 63.64% | 40.00% |
| 対照急拡大率 | 2.96% | 3.09% |
| リスク比 | 21.53 | 12.96 |

急拡大7件中6件は同一candidate ply・局面・trajectoryだった。濃縮方向は重複除去後にも残るが、独立した急拡大構造例は2件に限られる。事後感度分析はE-010の正式判定を置き換えない。

### E-010捕獲分岐形成確認

| 指標 | 生の7件平均 | 2 trajectory-ply平均 |
|---|---:|---:|
| 捕獲手数ピークまで | 1.71ply | 1.00ply |
| 捕獲手数変化 | +0.86 | +0.50 |
| 手番側最大捕獲可能量 | +2.57粒 | +1.50粒 |
| 相手側最大捕獲可能量 | -0.86粒 | -0.50粒 |
| phase変化 | 0/7 | 0/2 |

探索群と平均方向は一致した。しかし、2独立構造のうち非ゼロの非対称化を示したのは1構造だけであり、H14は「方向一致・限定的再現・未認定」とする。

## E-011 AI条件・探索深度横断頑健性実験

### 固定条件

- 5条件×各400局、合計2000局
- shared seed: `20262001–20262400`
- `C0 → C1 → C2 → C3 → C4`の順で固定ローカル逐次実行

| 条件 | evaluator | search | maxDepth |
|---|---|---|---:|
| C0 | bao | phase2 | 2 |
| C1 | bao | phase2 | 1 |
| C2 | bao | phase2 | 3 |
| C3 | bao-v2 | phase2 | 2 |
| C4 | bao | legacy | 2 |

条件別成功条件は変更していない。

- 主解析A候補12件以上
- 急拡大候補5件以上
- 主解析対照10000件以上
- RR 3以上
- 候補率 > 対照率

### 基盤検証

5条件×2局fixtureは成功済み。

- validated commit: `5ebc7800d1721179214d896f9587345fe55ebe08`
- Actions run: `30641768496`
- artifact digest: `sha256:3b909d26b5f404b55318f157319fb108d4c03ee7d542695ba156ad400cc9ac26`

### 正式実行ガード

既知の固定環境:

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux

ガード:

1. repositoryの`formalExecutionAllowed: true`
2. 完全一致の承認トークン
3. repository path、branch、clean worktree、Node.js、source commitのexecution lock
4. formal corpus rootのgit-ignore実照合
5. 事前登録・execution policyのパスとSHA-256再照合
6. C0–C4順序強制
7. formal integrity成功前の全体評価拒否
8. GitHub Actions環境での正式実行拒否

現時点では`formalExecutionAllowed: false`。隔離Gitリポジトリのガードテストは成功し、最新GitHub Actions検証はキュー待機中である。

## E-017 独立構造確認実験

### 事前登録

- 1000局
- seed: `20263001–20264000`
- AI: `hard / bao / phase2 / depth 2`
- 主解析: `pliesRemaining >= 9`
- 主解析単位: 固有`trajectoryHash + eventPly`
- 生の候補行endpointは副次解析

成功条件:

- 生の主解析候補行30件以上
- 固有candidate trajectory-ply 15件以上
- 固有candidate trajectory 12件以上
- 固有expansion trajectory-ply 5件以上
- 固有expansion trajectory 5件以上
- 固有control trajectory-ply 30000件以上
- 重複除去後RR 3以上
- 重複除去後候補率 > 対照率

全条件通過のみ`confirmed`。Corpus・hash・trajectory結合・必要出力の失敗は`inconclusive`、その他の条件不通過は`not-confirmed`。

### Evaluator検証

- validated commit: `9190998507e144d239adb55cadc3f61860a005be`
- workflow: `Phase Transition Independent Confirmation`
- Actions run: `30646973255`
- job: `evaluator`
- result: `success`

確認済み:

- 固有trajectory-ply重複除去
- 固有trajectory数の計数
- 重複除去後RR
- `confirmed / not-confirmed / inconclusive`の分岐
- manifest、condition、局数、seed列、trajectory hash、config hashのcorpus検査

正式1000局は生成していない。別の明示的開始承認を要求する。

## 再現情報

### E-010

- analysisVersion: `11-unused-seed-confirmation`
- configHash: `5476e77676800c40b90953ea07359d31f2bc47decd0fadd1105070d4367cbce7`
- original validated commit: `92c0ffa2354130cb43cdffc309587035be89939f`
- original Actions run: `30630007008`
- original artifact digest: `sha256:c1938edabbfd0a4ac39e3a5b8395bdc049dd795c52c38ea568dce0ae9c4160e3`
- formation Actions run: `30642671291`
- formation artifact digest: `sha256:71b10449821604677ab94a713c580a30cf2d8c3890c7d77ccc03c66f4287edf6`

### E-011

- analysisVersion: `12-ai-depth-robustness`
- status: `preregistered / infrastructure-validated / formal-not-approved`
- preregistration: `config/experiments/phase-transition-robustness-v1.json`
- trajectory supplement: `config/experiments/phase-transition-robustness-v1-trajectory-supplement.json`
- execution policy: `config/experiments/phase-transition-robustness-execution-policy-v1.json`
- runbook: `doc/phase-transition/E011_FORMAL_EXECUTION.md`

### E-017

- analysisVersion: `15-independent-structural-confirmation`
- status: `preregistered / evaluator-validated / formal-not-approved`
- preregistration: `config/experiments/phase-transition-independent-confirmation-v2.json`
- preregistration checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e017-independent-confirmation-preregistration.md`
- evaluator checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e017-evaluator-validation.md`

## 次工程

1. E-011 formal execution guardのGitHub Actions検証を完了する。
2. E-017固定ローカル実行policy、execution lock、corpus integrity runnerを実装する。
3. 明示的なE-011開始承認後にのみrepository許可フラグを別コミットで有効化し、execution lockを生成する。
4. E-011をC0から順に実行し、条件別分析・trajectory重複感度・形成過程・事前登録判定を適用する。
5. E-017は別の明示的開始承認まで正式1000局corpusを生成しない。

## 研究データ識別情報

### 探索群

- studyVersion: `0.4.1`
- configHash: `3567b34b3289bda4903c6df98238f12a50d025d3b487871372d3dd5d7869d9c5`
- games: 100

### E-010確認群

- studyVersion: `0.4.1`
- configHash: `5476e77676800c40b90953ea07359d31f2bc47decd0fadd1105070d4367cbce7`
- games: 200
- unique trajectories: 167
- primary candidate trajectory-ply: 5
- expansion trajectory-ply: 2

### E-011頑健性群

- studyVersion: `0.4.1`
- configHash: 未生成
- games: 400/condition
- conditions: C0–C4

### E-017独立構造確認群

- studyVersion: `0.4.1`
- configHash: 未生成
- games: 1000
- seed range: `20263001–20264000`
