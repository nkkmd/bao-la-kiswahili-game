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

## 現在の研究段階

次まで完了した。

- 100局`pilot-v2`探索工程
- E-010未使用seed 200局確認実験
- E-011 AI条件・探索深度横断頑健性実験の事前登録
- E-011 multi-condition runner、integrity validator、combined evaluator、回帰テストの実装
- E-011 5条件×2局fixture監査
- E-010 trajectory重複の事後感度分析
- E-011 trajectory重複感度分析の補足事前登録

E-011正式400局×5条件は未実施である。確認群7急拡大候補の形成過程再解析はコード・CI工程まで実装済みだが、数値結果は未確定である。

## 現時点で確定したこと

- 探索用100局ではA 15区間、13アーキタイプ、5650観測、421レジーム。
- 捕獲分岐急拡大は探索群で候補33.3%、対照2.9%、約11.46倍。
- forcing解除前兆は終局近傍効果であり、独立した戦略転移分類としては撤回した。
- 捕獲分岐急拡大は即時大量捕獲ではなく、後続局面の捕獲選択肢形成として扱う。
- E-010では効果方向と大きさは再現したが、事前登録した最低主解析候補数に1件届かず、正式判定は`not-confirmed`。
- E-010の成功条件と正式判定は結果後に変更しない。
- E-010主解析11候補は5 trajectory-ply、4 trajectory、5アーキタイプへ集約される。
- E-010急拡大7候補は2 trajectory-ply、2 trajectory、2アーキタイプへ集約され、6件は完全に同一の候補局面・trajectoryだった。
- trajectory-ply重複除去後も候補急拡大率40.0%、対照3.09%、RR 12.96だが、独立した構造例は少ない。
- E-011の元の主判定条件は変更せず、trajectory重複感度を必須副次分析として追加登録した。
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

失敗した条件は主解析A候補数のみで、最低12件に対して11件だった。

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

最大重複群はアーキタイプ`9f778d512ae1`の6件。重複除去後も濃縮は残るが、構造的一般性の根拠は2つの急拡大trajectory-plyに限られる。

この感度分析は事後監査であり、E-010の事前登録判定を置き換えない。

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
- 回帰テスト
- 5条件×2局fixture CI

fixture監査:

- validated commit: `5ebc7800d1721179214d896f9587345fe55ebe08`
- Actions run: `30641768496`
- artifact digest: `sha256:3b909d26b5f404b55318f157319fb108d4c03ee7d542695ba156ad400cc9ac26`
- result: success

初回監査で既存generatorの`openingStateHash`上書きを検出した。E-011 runnerでは最後のランダム開局手直後の`afterStateHash`を開局境界hashとして再計算し、全条件の開局一致を確認した。分析条件は変更していない。

### trajectory感度補足事前登録

- `config/experiments/phase-transition-robustness-v1-trajectory-supplement.json`
- 元の条件別・全体判定を変更しない
- 各条件内で`trajectoryHash + candidatePly`重複除去後の候補・対照率、RR、固有trajectory数、固有アーキタイプ数、最大重複数を必須報告する

## 解釈

- 捕獲分岐急拡大の候補側濃縮は、E-010のtrajectory重複除去後にも残った。
- ただしE-010の7急拡大行のうち6件が同一trajectoryであり、未使用seedによる構造的一般化の証拠は当初評価より弱い。
- E-010は「効果方向は再現したが事前登録上は未確認、かつ独立構造例が少ない」と記録する。
- E-011はAI・探索条件への頑健性を検証する独立実験であり、E-010の再判定には使わない。

## 再現情報

### E-010

- analysisVersion: `11-unused-seed-confirmation`
- configHash: `5476e77676800c40b90953ea07359d31f2bc47decd0fadd1105070d4367cbce7`
- validated commit: `92c0ffa2354130cb43cdffc309587035be89939f`
- Actions run: `30630007008`
- artifact digest: `sha256:c1938edabbfd0a4ac39e3a5b8395bdc049dd795c52c38ea568dce0ae9c4160e3`
- trajectory audit analysisVersion: `13-confirmation-trajectory-duplication-audit`

### E-011

- analysisVersion: `12-ai-depth-robustness`
- status: `preregistered / infrastructure-validated / formal-not-run`
- games: `400 × 5 conditions`
- seed range: `20262001–20262400`
- preregistration: `config/experiments/phase-transition-robustness-v1.json`
- trajectory supplement: `config/experiments/phase-transition-robustness-v1-trajectory-supplement.json`

## 次工程

1. 確認群7急拡大候補の形成過程再解析を完了し、生の7件平均と2 trajectory-ply平均を確定する。
2. E-011固定ローカル環境のruntime、hardware、source commit、出力先を固定する。
3. E-011を`C0 → C1 → C2 → C3 → C4`の順で各400局実行する。
4. 条件別候補・対照分析、trajectory重複感度、事前登録判定を適用する。
5. 独立追加seed確認実験は、候補行発生率と固有trajectory発生率の両方を用いて別登録する。

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
