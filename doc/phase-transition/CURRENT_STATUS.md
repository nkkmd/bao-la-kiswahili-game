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

完了済み:

- 100局`pilot-v2`探索工程
- E-010未使用seed 200局確認実験
- E-010 trajectory重複の事後感度分析
- E-010確認群7急拡大候補の形成過程・最大捕獲可能量非対称化分析
- E-011 AI条件・探索深度横断頑健性実験の事前登録
- E-011 multi-condition runner、integrity validator、combined evaluator、回帰fixture
- E-011 trajectory重複感度の補足事前登録
- E-011固定ローカル実行policy、execution lock generator、guarded formal runner
- E-011正式自己対局の明示的開始承認
- E-011固定ローカルexecution lock生成
- E-011正式400局×5条件、合計2000局
- E-011全条件formal integrity監査
- E-011全条件trajectory-ply感度分析
- E-011 combined evaluatorによる正式全体判定
- E-017独立構造確認実験の1000局事前登録
- E-017 trajectory-ply主解析evaluatorの実装とGitHub Actions検証

未実施:

- E-017正式1000局
- E-011で浮上した`phase2`対`legacy`探索方式依存性の追加確認実験

E-011は正式実験まで完了し、正式全体判定は`inconclusive`である。E-017は正式実行未承認であり、E-011の承認はE-017へ継承しない。GitHub Actionsでは正式corpusを生成しない。

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
- primary population: `pliesRemaining >= 9`

| 条件 | evaluator | search | maxDepth |
|---|---|---|---:|
| C0 | bao | phase2 | 2 |
| C1 | bao | phase2 | 1 |
| C2 | bao | phase2 | 3 |
| C3 | bao-v2 | phase2 | 2 |
| C4 | bao | legacy | 2 |

条件別成功条件は結果後も変更していない。

- 主解析A候補12件以上
- 急拡大候補5件以上
- 主解析対照10000件以上
- RR 3以上
- 候補率 > 対照率

### 固定ローカル実行情報

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- source commit: `ed61d7214967b95535d9f30f8fa47480e2ea5ecb`
- Node.js: `v24.6.0`
- platform: Linux
- formal corpus: 2000局
- preregistration SHA-256: `65253e719463b4e60527bdb96cb4ce234aae76df39d5d2727bd9d09849c7eb69`
- execution-policy SHA-256: `97fa235e340b527919f9414c6859ce63b74cc5a930ce7e9893c66c2ddb02698b`

formal integrity:

- `allConditionsPresent: true`
- `uniqueConditionConfigHashes: true`
- `commonSourceCommit: true`
- `pairedOpeningHashes: true`
- `conditionIdentityClean: true`
- `errors: []`
- `valid: true`

### E-011条件別正式結果

| 条件 | A候補 | expansion | 対照 | 候補率 | 対照率 | RR | status |
|---|---:|---:|---:|---:|---:|---:|---|
| C0 | 16 | 9 | 16395 | 56.25% | 2.95% | 19.09 | `pass` |
| C1 | 15 | 2 | 15679 | 13.33% | 2.05% | 6.49 | `insufficient` |
| C2 | 12 | 3 | 15801 | 25.00% | 1.75% | 14.26 | `insufficient` |
| C3 | 19 | 11 | 16437 | 57.89% | 2.88% | 20.08 | `pass` |
| C4 | 8 | 0 | 15412 | 0.00% | 1.68% | 0.00 | `insufficient` |

正式全体判定: **`inconclusive`**

- C0 referenceは`pass`。
- C3 (`bao-v2 / phase2 / depth2`)も`pass`。
- C1とC2はRRと方向条件を満たすが、急拡大候補5件以上に未達のため`insufficient`。
- C4は候補8件・急拡大0件で最低件数に未達し、RR 0でも事前登録ロジック上は`insufficient`。
- `robust`、`partially-robust`、`not-robust`のいずれの登録条件にも入らないため`inconclusive`。

### E-011 trajectory-ply感度

重複除去キー: `trajectoryHash + candidatePly`

| 条件 | 固有候補 | 固有expansion | 固有対照 | 固有対照expansion | dedup RR |
|---|---:|---:|---:|---:|---:|
| C0 | 8 | 2 | 12185 | 387 | 7.87 |
| C1 | 13 | 2 | 11407 | 240 | 7.31 |
| C2 | 10 | 2 | 11695 | 213 | 10.98 |
| C3 | 11 | 4 | 12160 | 378 | 11.70 |
| C4 | 6 | 0 | 11412 | 180 | 0.00 |

`phase2`を使うC0–C3では重複除去後も候補側濃縮方向が維持された。C4 (`legacy`)では生・重複除去後とも急拡大候補が0である。

科学的解釈は、**phase2 family内では方向的一貫性が見える一方、E-011はAI/search条件全般のglobal robustnessを確認せず、legacy searchが探索方式依存性の具体的な未解決要因として浮上した**、とする。これはE-011の正式`inconclusive`判定を置き換えない。

### Evaluator exit-code異常

combined evaluatorは`robustness-result.json`等を正常生成し、`decision: inconclusive`を出力した後、`inconclusive`時にexit code 2を設定する。formal runnerはこれを`execFileSync`の例外として表示した。

これは実行基盤のinterface問題であり、formal integrityや正式科学判定を無効化しない。修正する場合もlocked-run結果保存後の別変更として扱い、E-011判定を遡及変更しない。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-01-e011-formal-completion.md`

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
- result: `success`

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
- status: `preregistered / infrastructure-validated / formal-complete / inconclusive`
- authorization time: `2026-08-01 06:09 JST`
- authorization commit: `a0378010607aebad76420e0d377ee1b88166d861`
- locked source commit: `ed61d7214967b95535d9f30f8fa47480e2ea5ecb`
- preregistration: `config/experiments/phase-transition-robustness-v1.json`
- trajectory supplement: `config/experiments/phase-transition-robustness-v1-trajectory-supplement.json`
- execution policy: `config/experiments/phase-transition-robustness-execution-policy-v1.json`
- runbook: `doc/phase-transition/E011_FORMAL_EXECUTION.md`
- completion checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e011-formal-completion.md`
- total formal corpus: `2000 / 2000`
- formal integrity: `valid: true`
- trajectory sensitivity complete: `true`
- formal decision: `inconclusive`
- final bundle SHA-256: `367d3543d2f404582adce07ac863c90bd11534826ef36528b25376228bef2bbc`

### E-017

- analysisVersion: `15-independent-structural-confirmation`
- status: `preregistered / evaluator-validated / formal-not-approved`
- preregistration: `config/experiments/phase-transition-independent-confirmation-v2.json`
- preregistration checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e017-independent-confirmation-preregistration.md`
- evaluator checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e017-evaluator-validation.md`

## 次工程

1. E-011の`inconclusive`判定を固定し、結果後に閾値やglobal decision ruleを変更しない。
2. evaluatorの`inconclusive` exit code 2とformal runnerの例外表示のinterface問題を、formal結果と分離した実装修正候補として扱う。
3. `phase2`対`legacy`探索方式依存性を追う場合は、E-011を再解釈せず別実験として事前登録する。
4. E-017は別の明示的開始承認まで正式1000局corpusを生成しない。

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
- games: 400/condition, 2000 total
- conditions: C0–C4
- seed range: `20262001–20262400`
- locked source commit: `ed61d7214967b95535d9f30f8fa47480e2ea5ecb`
- formal integrity: valid
- formal decision: `inconclusive`

### E-017独立構造確認群

- studyVersion: `0.4.1`
- games: 1000 planned
- seed range: `20263001–20264000`
- formal execution: not approved
