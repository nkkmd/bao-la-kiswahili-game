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
- E-011 multi-condition runner、integrity validator、combined evaluator、回帰テスト
- E-011 5条件×2局fixture監査
- E-011 trajectory重複感度の補足事前登録
- E-011固定ローカル実行policy、execution lock generator、guarded formal runner

E-011正式400局×5条件は未実施であり、正式実行許可は`false`のままである。

## 現時点で確定したこと

- 探索用100局ではA 15区間、13アーキタイプ、5650観測、421レジーム。
- 捕獲分岐急拡大は探索群で候補33.3%、対照2.9%、約11.46倍。
- forcing解除前兆は終局近傍効果であり、独立した戦略転移分類としては撤回した。
- 捕獲分岐急拡大は即時大量捕獲ではなく、後続局面の捕獲選択肢形成として扱う。
- E-010では効果方向と大きさは再現したが、最低主解析候補12件に対して11件で、正式判定は`not-confirmed`。
- E-010主解析11候補は5 trajectory-ply、4 trajectory、5アーキタイプへ集約される。
- E-010急拡大7候補は2 trajectory-ply、2 trajectory、2アーキタイプへ集約され、6件は完全に同一の候補局面・trajectoryだった。
- trajectory-ply重複除去後も候補急拡大率40.0%、対照3.09%、RR 12.96であり、濃縮方向は残る。
- 確認群形成過程は、生の7件で手番側最大捕獲可能量+2.57粒、相手側-0.86粒、重複除去後の2構造で+1.50粒／-0.50粒だった。
- 最大捕獲可能量非対称化は探索群と同方向だが、2構造中、非ゼロ変化を示したのは1構造であり、一般性は未確定。
- 主要候補の正式な戦略的相転移認定は引き続き保留する。

## E-010 未使用seed確認実験

### 事前登録判定

| 指標 | 結果 | 条件 |
|---|---:|---:|
| 主解析A候補 | 11 | 12以上 |
| 急拡大候補 | 7 | 5以上 |
| 主解析対照 | 8424 | 5000以上 |
| 候補急拡大率 | 63.64% | — |
| 対照急拡大率 | 2.96% | — |
| リスク比 | 21.53 | 3以上 |

判定: `not-confirmed`

失敗した条件は主解析A候補数のみ。結果後に条件を緩和せず、正式判定を維持する。

### trajectory重複感度

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

最大重複群はアーキタイプ`9f778d512ae1`の6件。感度分析は事後監査であり、E-010の正式判定を置き換えない。

### 捕獲分岐形成確認

| 指標 | 生の7件平均 | 2 trajectory-ply平均 |
|---|---:|---:|
| 捕獲手数ピークまで | 1.71ply | 1.00ply |
| 捕獲手数変化 | +0.86 | +0.50 |
| 手番側最大捕獲可能量 | +2.57粒 | +1.50粒 |
| 相手側最大捕獲可能量 | -0.86粒 | -0.50粒 |
| phase変化 | 0/7 | 0/2 |

全7件でピーク時の手番は候補時点のプレイヤーと一致した。最大重複群6件は`+3 / -1`、もう1つの独立構造は`0 / 0`だった。

解釈は「確認群でも平均方向は一致したが、独立構造上の再現は限定的」とする。

## E-011 AI条件・探索深度横断頑健性実験

### 事前登録

- 5条件
- 各条件400局、合計2000局
- shared base seed: `20262001`
- shared seed範囲: `20262001–20262400`
- 同一seedのランダム開局を条件間で共有
- 正式実行は固定ローカル環境で逐次実行
- GitHub Actionsで正式2000局は実行しない

| 条件 | 変更要因 | evaluator | search | maxDepth |
|---|---|---|---|---:|
| C0 | 基準 | bao | phase2 | 2 |
| C1 | depth低下 | bao | phase2 | 1 |
| C2 | depth増加 | bao | phase2 | 3 |
| C3 | 評価器変更 | bao-v2 | phase2 | 2 |
| C4 | 探索実装変更 | bao | legacy | 2 |

元の条件別成功条件は変更していない。

- 主解析A候補12件以上
- 急拡大候補5件以上
- 主解析対照10000件以上
- リスク比3以上
- 候補率が対照率を上回る

### 実験基盤

実装済み:

- multi-condition corpus runner
- condition integrity validator
- combined robustness evaluator
- trajectory重複感度の副次出力
- 5条件×2局fixture CI
- execution lock generator
- guarded formal runner
- formal execution runbook

fixture監査:

- validated commit: `5ebc7800d1721179214d896f9587345fe55ebe08`
- Actions run: `30641768496`
- artifact digest: `sha256:3b909d26b5f404b55318f157319fb108d4c03ee7d542695ba156ad400cc9ac26`
- result: success

### 固定ローカル実行policy

既知条件:

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux
- corpus output: `artifacts/phase-transition/robustness-v1/`
- analysis output: `artifacts/local/phase-transition-robustness/`

実行開始時にexecution lockへ記録する未確定情報:

- exact source commit
- OS release
- CPU model / logical CPU count
- total memory
- hostname
- preregistration hash
- execution-policy hash

正式実行には次の両方を要求する。

1. `formalExecutionAllowed: true`
2. 完全一致の承認トークン

現時点では`formalExecutionAllowed: false`であり、正式自己対局は開始できない。

## 再現情報

### E-010

- analysisVersion: `11-unused-seed-confirmation`
- configHash: `5476e77676800c40b90953ea07359d31f2bc47decd0fadd1105070d4367cbce7`
- validated commit: `92c0ffa2354130cb43cdffc309587035be89939f`
- original Actions run: `30630007008`
- original artifact digest: `sha256:c1938edabbfd0a4ac39e3a5b8395bdc049dd795c52c38ea568dce0ae9c4160e3`
- formation source workflow commit: `174ff668d7ada3d91041fcbb8db656233e558122`
- formation Actions run: `30642671291`
- formation artifact digest: `sha256:71b10449821604677ab94a713c580a30cf2d8c3890c7d77ccc03c66f4287edf6`

### E-011

- analysisVersion: `12-ai-depth-robustness`
- status: `preregistered / infrastructure-validated / formal-not-approved`
- games: `400 × 5 conditions`
- seed range: `20262001–20262400`
- preregistration: `config/experiments/phase-transition-robustness-v1.json`
- trajectory supplement: `config/experiments/phase-transition-robustness-v1-trajectory-supplement.json`
- execution policy: `config/experiments/phase-transition-robustness-execution-policy-v1.json`
- runbook: `doc/phase-transition/E011_FORMAL_EXECUTION.md`

## 次工程

1. E-011 formal execution guardのCIを完了させる。
2. 明示的な正式実験開始承認後に、repository許可フラグを別コミットで有効化する。
3. 固定ローカル環境でexecution lockを生成し、runtime・hardware・source commitを固定する。
4. E-011を`C0 → C1 → C2 → C3 → C4`の順で各400局実行する。
5. 条件別候補・対照分析、trajectory重複感度、最大捕獲可能量非対称化、事前登録判定を適用する。
6. 独立追加seed確認実験は、候補行発生率と固有trajectory発生率の両方を用いて別登録する。

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
