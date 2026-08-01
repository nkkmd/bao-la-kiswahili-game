# 局面相転移点研究 — 研究ログ

追記専用。過去記録は原則として変更しない。

## 2026-07-30 — pilot-v2候補分析v2

主設定 `2.0 / 0.75` で95候補区間、66ゲーム。commit: `dcf4b9b26601924c5587e7ac43e18d6a090e0d00`。

## 2026-07-30 — forcingアブレーション

forcing除外で95区間から45区間へ減少。forcingを独立特徴群として使う設計を撤回。commit: `f58de9f0fa3601be4f41646b6b1425eff55fb450`。

## 2026-07-30 — A/B/C分類とアーキタイプ分析

A 15、B 30、C 51、X 0。A 15候補は13固有局面・13アーキタイプ。

## 2026-07-30 — 優先6候補の盤面監査

6候補すべてが強制捕獲状態。中心現象を強制捕獲レジーム内部の捕獲選択肢構造変化と再解釈。

## 2026-07-31 — 強制捕獲レジーム分析の実装

連続区間抽出、候補対応、位置、持続、回復、イベント距離、探索的分類を実装。

## 2026-07-31 — 主要6候補監査

6局、332観測、26レジーム。分類は急拡大3、mtaji前兆2、一時的スパイク1。Actions run: `30614184554`。

## 2026-07-31 — 全Aアーキタイプ分析

現ソースからpilot-v2 100局を決定論的に再生成。5650観測、421レジーム、A 13アーキタイプ、レジーム外0。

初回は候補時点ですでにmtajiの局面を距離0の前兆として誤分類したため撤回。候補時点がnamuaで、将来の初回mtajiがevent window内にある場合だけ前兆とするよう修正した。

## 2026-07-31 — 候補外レジーム対照・感度分析

A候補15区間と候補外4127plyを比較。捕獲分岐急拡大は候補33.3%、対照2.9%で約11.46倍。27設定すべてで候補側に濃縮した。

## 2026-07-31 — forcing解除前兆の終局距離層別分析

forcing解除前兆6件は全て終局まで0–4ply。独立した戦略転移という解釈を撤回し、終局近傍サブタイプへ再分類した。

## 2026-07-31 — 候補手質的特徴量分析

捕獲分岐急拡大5区間は平均捕獲1.6粒、平均capture+relay長2.2。急拡大を後続局面の捕獲選択肢形成として再解釈した。

## 2026-07-31 — 捕獲分岐形成過程分析

候補から捕獲手数ピークまで平均1.8ply。手番側最大捕獲可能量は平均+3.0粒、相手側は平均-1.2粒。全件でピークまでphase変化なし。

## 2026-07-31 — E-010未使用seed確認実験の事前登録

200局、base seed `20261001`、終局まで9ply以上を主解析として固定した。成功条件は主解析候補12件以上、急拡大候補5件以上、対照5000件以上、リスク比3以上、候補率が対照率を上回ること。

- preregistration commit: `a3c07b14f4b01459f790d0eec38c4a341594f47e`

## 2026-07-31 — E-010未使用seed確認実験

### 実施内容

- 未使用seed範囲 `20261001–20261200` で200局を生成。
- 11439観測、845強制捕獲レジーム。
- A候補22区間、15アーキタイプ。
- 候補区間前後8plyを除外した対照8557点を構築。
- 終局まで9ply以上に限定して事前登録判定を適用。

### 結果

- 主解析A候補: 11
- 主解析対照: 8424
- 急拡大候補: 7/11（63.64%）
- 急拡大対照: 249/8424（2.96%）
- リスク比: 21.53

成功条件のうち、急拡大候補数、対照数、リスク比、効果方向は通過した。主解析候補数のみ、最低12件に対して11件で未達だった。

### 判定

`not-confirmed`

結果後に最低候補数を緩和せず、事前登録判定を維持した。一方、効果方向と大きさは未使用seedで強く再現したため、「実質的再現だが事前登録上は未確認」と記録する。

### 実装修正

初回判定器は候補と対照が同一CSVに存在すると誤認し`inconclusive`となった。実際には候補と対照が別CSVであるため、二入力契約へ修正した。事前登録条件は変更していない。

### 再現情報

- analysisVersion: `11-unused-seed-confirmation`
- validated commit: `92c0ffa2354130cb43cdffc309587035be89939f`
- Actions run: `30630007008`
- artifact digest: `sha256:c1938edabbfd0a4ac39e3a5b8395bdc049dd795c52c38ea568dce0ae9c4160e3`

## 2026-07-31 — E-011 AI条件・探索深度横断実験の事前登録

捕獲分岐急拡大の候補群への濃縮が、評価器、探索実装、固定探索depthを変更しても再現するかを確認するため、E-010と独立したE-011を登録した。

各条件400局、shared seed範囲 `20262001–20262400`。

- C0: `bao / phase2 / depth 2`
- C1: `bao / phase2 / depth 1`
- C2: `bao / phase2 / depth 3`
- C3: `bao-v2 / phase2 / depth 2`
- C4: `bao / legacy / depth 2`

E-010から候補検出・終局除外・急拡大分類条件を維持し、条件別成功条件と全体`robust / partially-robust / not-robust / inconclusive`判定を実行前に固定した。

## 2026-08-01 — E-011実験基盤とfixture監査

multi-condition runner、condition integrity validator、combined evaluator、回帰fixtureを実装した。既存generatorの`openingStateHash`上書き問題を検出し、最後のランダム開局手直後のhashをE-011開局境界hashとして再計算するよう修正した。

5条件×2局fixtureは成功。

- validated commit: `5ebc7800d1721179214d896f9587345fe55ebe08`
- Actions run: `30641768496`
- artifact digest: `sha256:3b909d26b5f404b55318f157319fb108d4c03ee7d542695ba156ad400cc9ac26`

## 2026-08-01 — E-010 trajectory重複の事後感度分析

`trajectoryHash + candidatePly`を重複除去キーとしてE-010候補・対照を再集計した。主解析11候補は5 trajectory-plyへ、急拡大7候補は2 trajectory-plyへ集約された。

- raw RR: 21.53
- deduplicated RR: 12.96
- largest duplicate group: 6

濃縮方向は残るが、独立した急拡大構造例は2件。E-010正式`not-confirmed`判定は変更しない。

## 2026-08-01 — E-011 trajectory重複感度の補足事前登録

E-011正式実行前に、条件ごとの`trajectoryHash + candidatePly`重複除去後の候補・対照率、RR、固有trajectory、固有アーキタイプ、最大重複数を必須副次分析として追加登録した。主判定条件は変更していない。

- `config/experiments/phase-transition-robustness-v1-trajectory-supplement.json`
- analysisVersion: `12a-ai-depth-robustness-trajectory-sensitivity`

## 2026-08-01 — E-010確認群捕獲分岐形成結果

E-010急拡大7候補へ8ply形成過程解析を適用し、`trajectoryHash + candidatePly`重複除去後の2構造でも集計した。

| 指標 | 生の7件平均 | 2 trajectory-ply平均 |
|---|---:|---:|
| 捕獲手数ピークまで | 1.71ply | 1.00ply |
| 捕獲手数変化 | +0.86 | +0.50 |
| 手番側最大捕獲可能量 | +2.57粒 | +1.50粒 |
| 相手側最大捕獲可能量 | -0.86粒 | -0.50粒 |
| phase変化 | 0/7 | 0/2 |

最大重複群6件では`+3 / -1`、もう1構造は`0 / 0`。H14は「方向一致・限定的再現・未認定」とした。

- Actions run: `30642671291`
- artifact digest: `sha256:71b10449821604677ab94a713c580a30cf2d8c3890c7d77ccc03c66f4287edf6`

## 2026-08-01 — E-011固定ローカル正式実行ガード

固定policyとしてrepository `/home/oruorane/github/bao-la-kiswahili-game`、branch `research/forced-capture-regime-analysis`、Node.js `v24.6.0`、Linux、C0→C4順序を固定した。

execution lock generatorとformal runnerはGitHub Actions拒否、source commit/branch/clean worktree/Node.js固定、出力ignore確認、preregistration/policy hash再照合、順序制約、二重承認、integrity gateを強制する。

## 2026-08-01 — E-017独立構造確認実験の事前登録

1000局、seed `20263001–20264000`、`hard / bao / phase2 / depth2`を固定した。主解析単位は`trajectoryHash + eventPly`。最低15固有candidate trajectory-ply、12固有candidate trajectory、5固有expansion trajectory-ply、5固有expansion trajectory、30000固有control trajectory-ply、重複除去後RR 3以上、候補率>対照率を成功条件とした。

E-017正式1000局は別の明示的開始承認を要求する。

## 2026-08-01 — E-017 evaluator GitHub Actions検証

- validated commit: `9190998507e144d239adb55cadc3f61860a005be`
- Actions run: `30646973255`
- result: success

固有trajectory-ply重複除去、固有trajectory数、RR、`confirmed / not-confirmed / inconclusive`分岐をfixtureで検証した。正式corpusは生成していない。

## 2026-08-01 — E-011正式自己対局開始承認

2026-08-01 06:09 JST、ユーザーから「E-011の正式自己対局を開始してください」と明示的な開始指示を受領した。

- authorization commit: `a0378010607aebad76420e0d377ee1b88166d861`
- policy status: `approved-awaiting-local-lock`
- `formalExecutionAllowed: true`
- approval token: `E-011-FORMAL-APPROVED`
- checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e011-formal-start-authorization.md`

開始承認は5条件、各400局、seed範囲、順序、候補検出、急拡大分類、成功条件、trajectory副次分析を変更しない。

## 2026-08-01 — E-011固定ローカル正式2000局完了

### 実行固定情報

固定ローカル機でexecution lockを生成し、C0→C4を順序どおり各400局、合計2000局実行した。

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- locked source commit: `ed61d7214967b95535d9f30f8fa47480e2ea5ecb`
- Node.js: `v24.6.0`
- platform: Linux
- shared seeds: `20262001–20262400`
- preregistration SHA-256: `65253e719463b4e60527bdb96cb4ce234aae76df39d5d2727bd9d09849c7eb69`
- execution-policy SHA-256: `97fa235e340b527919f9414c6859ce63b74cc5a930ce7e9893c66c2ddb02698b`

### Formal integrity

`--phase verify`は次を全て通過した。

- 5条件すべて400/400局
- condition config hash分離
- common source commit
- paired opening hashes
- condition identity clean
- errors: `[]`
- `valid: true`

### 条件別結果

主解析: `pliesRemaining >= 9`。

| Condition | evaluator | search | depth | A candidates | expansion | controls | candidate rate | control rate | RR | status |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| C0 | bao | phase2 | 2 | 16 | 9 | 16395 | 56.25% | 2.95% | 19.09 | `pass` |
| C1 | bao | phase2 | 1 | 15 | 2 | 15679 | 13.33% | 2.05% | 6.49 | `insufficient` |
| C2 | bao | phase2 | 3 | 12 | 3 | 15801 | 25.00% | 1.75% | 14.26 | `insufficient` |
| C3 | bao-v2 | phase2 | 2 | 19 | 11 | 16437 | 57.89% | 2.88% | 20.08 | `pass` |
| C4 | bao | legacy | 2 | 8 | 0 | 15412 | 0.00% | 1.68% | 0.00 | `insufficient` |

C1/C2はRRと方向条件を通過したが最低expansion候補5件に未達。C4はA候補8件・expansion 0件で最低件数を満たさず、事前登録status関数により`fail`ではなく`insufficient`。

### Trajectory-ply感度

| Condition | unique candidates | unique expansion | unique controls | unique control expansion | dedup RR |
|---|---:|---:|---:|---:|---:|
| C0 | 8 | 2 | 12185 | 387 | 7.87 |
| C1 | 13 | 2 | 11407 | 240 | 7.31 |
| C2 | 10 | 2 | 11695 | 213 | 10.98 |
| C3 | 11 | 4 | 12160 | 378 | 11.70 |
| C4 | 6 | 0 | 11412 | 180 | 0.00 |

phase2を使用したC0–C3では重複除去後も候補側濃縮方向が残った。C4 (`legacy`)では生・重複除去後ともexpansion候補0。

### 正式全体判定

combined evaluator:

- `decision: inconclusive`
- `trajectorySensitivityComplete: true`
- pass 2 / insufficient 3 / fail 0

正式判定は**`inconclusive`**として固定する。結果後に`partially-robust`や`not-robust`へ読み替えない。

科学的には、phase2 family内で方向的一貫性が見える一方、AI/search条件全般へのglobal robustnessは確認できなかった。C4はsearch profile依存性を示唆するが、C4自体が`insufficient`なので因果を確定せず、別事前登録実験の仮説とする。

### Evaluator exit-code異常

combined evaluatorは`robustness-result.json`、`condition-summary.csv`、`robustness-summary.csv`を正常生成し完全な`inconclusive`結果を表示した後、`decision === "inconclusive"`でexit code 2を設定する。formal runnerの`execFileSync`がこれを`Error: Command failed`として表示した。

これは実行基盤interfaceの問題であり、formal integrityや科学判定の失敗ではない。E-011正式結果は`inconclusive`のまま。

### 最終bundle監査

ユーザーが固定ローカル成果物を最終bundleとして保存し、共有した。

- archive: `e011-final-formal-evaluation.tar.gz`
- SHA-256: `367d3543d2f404582adce07ac863c90bd11534826ef36528b25376228bef2bbc`
- supplied SHA-256 fileとの一致: yes
- tar members: 97
- unsafe path members: 0
- formal integrity result present: yes / `valid: true`
- formal evaluation outputs present: yes
- C0–C4 trajectory sensitivity summary present: 5/5
- preregistration hash: execution lockと一致
- execution policy hash: execution lockと一致

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-01-e011-formal-completion.md`

### 次工程

- E-011の正式`inconclusive`を固定し、閾値・global ruleを結果後に変更しない。
- evaluator exit-code interface問題はformal結果と分離して修正候補とする。
- `phase2`対`legacy`探索方式依存性を追う場合は別実験として事前登録する。
- E-017は別の明示的開始承認まで正式1000局を開始しない。
