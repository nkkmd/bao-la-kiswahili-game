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

### 次工程

- E-011 AI条件・探索深度横断実験を事前登録する。
- 確認群急拡大7件の形成過程と最大捕獲可能量非対称化を副次分析する。
- E-010の候補発生率を用いて独立追加確認実験のサンプル数を設計する。

## 2026-07-31 — E-011 AI条件・探索深度横断実験の事前登録

### 目的

捕獲分岐急拡大の候補群への濃縮が、評価器、探索実装、固定探索depthを変更しても再現するかを確認する。E-010の判定や条件は変更せず、独立した実験として登録した。

### 条件

各条件400局、shared seed範囲 `20262001–20262400`。

- C0: `bao / phase2 / depth 2`
- C1: `bao / phase2 / depth 1`
- C2: `bao / phase2 / depth 3`
- C3: `bao-v2 / phase2 / depth 2`
- C4: `bao / legacy / depth 2`

一度に一要因だけを変更する。全条件で同一seedのランダム開局を共有するが、探索群およびE-010確認群とはseedを重複させない。

### 固定分析条件

E-010から次を維持する。

- category `A`
- `signalThreshold=2.0`
- `persistenceThreshold=0.75`
- `pliesRemaining >= 9`
- `expansionDelta=3`
- `persistenceFraction=0.5`
- `eventWindow=8`
- `controlExclusionBuffer=8`

### サンプル数

E-010の主解析候補発生率11/200局を用いた。400局では期待22候補、Poisson近似で12候補以上の確率は約99.24%。5条件すべてで12候補以上となる確率は単純独立近似で約96.2%。

この設計計算はE-011の局数固定にだけ使用し、E-010の最低候補数や判定は変更していない。

### 判定

条件別成功条件を次に固定した。

- 主解析A候補12件以上
- 急拡大候補5件以上
- 主解析対照10000件以上
- リスク比3以上
- 候補率が対照率を上回る

全体判定は `robust / partially-robust / not-robust / inconclusive` の4分類として事前固定した。

### 実行方針

正式な2000局は固定ローカル環境で `C0 → C1 → C2 → C3 → C4` の順に逐次実行する。GitHub Actionsは回帰テスト、短いfixture、schema・hash・成果物検証に限定する。

### 記録

- analysisVersion: `12-ai-depth-robustness`
- config: `config/experiments/phase-transition-robustness-v1.json`
- checkpoint: `doc/phase-transition/checkpoints/2026-07-31-ai-depth-robustness-preregistration.md`

### 次工程

- multi-condition runner、condition integrity validator、combined evaluatorを実装する。
- 短いfixtureでcondition ID、seed共有、config hash分離を監査する。
- 固定ローカル環境で正式実験を実行する。

## 2026-08-01 — E-011実験基盤とfixture監査

### 実装

次を追加した。

- `tools/experiments/run-phase-transition-robustness.js`
- `tools/experiments/verify-phase-transition-robustness.js`
- `tools/experiments/evaluate-phase-transition-robustness.js`
- `tools/experiments/lib/phase-transition-robustness.js`
- `test/phase-transition-robustness.test.js`
- `.github/workflows/phase-transition-robustness.yml`

runnerはC0–C4を同一seed列から条件別に生成し、game ID、AI source、config hash、出力先を分離する。validatorはcondition混在、seed、source commit、config hash、開局境界hashを検査する。combined evaluatorは事前登録した条件別判定と全体判定を適用する。

### 初回fixtureで判明した問題

既存generatorの`openingStateHash`は開局終了後もAI手ごとに上書きされるため、同一seedの開局でもAI条件が異なると不一致になることを検出した。

E-011 runnerでは、最後のランダム開局手直後の`afterStateHash`を開局境界hashとして明示的に再計算するよう修正した。これは監査メタデータの修正であり、seed、実際の開局手、AI条件、候補検出、成功条件は変更していない。

### fixture結果

5条件×2局のfixtureで次がすべて通過した。

- 全5条件の存在
- condition config hashの一意性
- source commitの一致
- 同一game indexの開局境界hash一致
- game、observation、AI sourceのcondition分離

再現情報:

- validated commit: `5ebc7800d1721179214d896f9587345fe55ebe08`
- Actions run: `30641768496`
- artifact: `phase-transition-robustness-fixture`
- artifact digest: `sha256:3b909d26b5f404b55318f157319fb108d4c03ee7d542695ba156ad400cc9ac26`

正式な400局×5条件は事前登録どおり固定ローカル環境に限定し、この工程では実行していない。

## 2026-08-01 — E-010 trajectory重複の事後感度分析

### 目的と方法

E-010候補行の構造的独立性を確認するため、確認成果物の`trajectoryHash`を候補・対照へ結合し、`trajectoryHash + candidatePly`を重複除去キーとする事後感度分析を実施した。

この分析はE-010の事前登録判定を置き換えない。

### 結果

| 指標 | 生の事前登録単位 | trajectory+ply重複除去後 |
|---|---:|---:|
| 主解析候補 | 11 | 5 |
| 急拡大候補 | 7 | 2 |
| 主解析対照 | 8424 | 7061 |
| 急拡大対照 | 249 | 218 |
| 候補急拡大率 | 63.64% | 40.00% |
| 対照急拡大率 | 2.96% | 3.09% |
| リスク比 | 21.53 | 12.96 |

主解析11候補は5つのtrajectory-ply、4つのtrajectory、5アーキタイプへ集約された。急拡大7候補は2つのtrajectory-ply、2つのtrajectory、2アーキタイプへ集約された。

最大の重複群は6件で、アーキタイプ`9f778d512ae1`、candidate ply 7、stateHash`4328ee11314e976186821b06a296994f0a702b9cf5f6953ce76863aba2f98521`、trajectoryHash`fe3c176c6580e109a7bed260161b3189ea76aad51acd176992ab17f8fde387dd`が完全に一致した。もう1つの急拡大アーキタイプは`cfdb2c4de1a2`で1件だった。

### 解釈

trajectory-ply重複除去後も候補側濃縮は残るが、独立した急拡大構造例は2件に限られる。したがって、生のRR 21.53を7つの独立構造例の再現と解釈しない。

E-010の正式判定は引き続き`not-confirmed`であり、変更しない。

### 再現実装

- `tools/experiments/analyze-confirmation-trajectory-duplication.js`
- `test/phase-transition-confirmation-trajectory-duplication.test.js`
- analysisVersion: `13-confirmation-trajectory-duplication-audit`
- source Actions run: `30630007008`
- source artifact digest: `sha256:c1938edabbfd0a4ac39e3a5b8395bdc049dd795c52c38ea568dce0ae9c4160e3`

## 2026-08-01 — E-011 trajectory重複感度の補足事前登録

E-010で候補のtrajectory反復を検出したため、E-011正式実行前に次を必須副次分析として追加登録した。

- 条件ごとの`trajectoryHash + candidatePly`重複除去後の候補・対照数
- 重複除去後の急拡大率とリスク比
- 候補および急拡大候補の固有trajectory数
- 候補および急拡大候補の固有アーキタイプ数
- 最大trajectory-ply重複数と重複群表

補足事前登録:

- `config/experiments/phase-transition-robustness-v1-trajectory-supplement.json`
- analysisVersion: `12a-ai-depth-robustness-trajectory-sensitivity`

これは加算的な副次感度分析であり、E-011の元の条件別成功条件、全体判定、400局×5条件、seed範囲を変更しない。不利な主判定を置き換えるためにも使用しない。

## 2026-08-01 — E-010捕獲分岐形成確認の実装

確認群の急拡大7候補について、既存の8ply形成過程解析を再利用し、最大捕獲可能量の非対称化を確認する工程を実装した。

同一trajectory反復の影響を分離するため、生の7候補行による平均に加え、`trajectoryHash + candidatePly`で重複除去した形成差分平均も出力する。

実装:

- `tools/experiments/analyze-capture-branch-formation.js`
- `tools/experiments/summarize-confirmation-capture-branch-formation.js`
- `test/phase-transition-confirmation-capture-formation-sensitivity.test.js`
- `.github/workflows/phase-transition-confirmation.yml`

analysisVersion: `14-confirmation-capture-branch-formation-trajectory-sensitivity`

この時点では再生成CIの数値結果は未確定であり、最大捕獲可能量の非対称化が確認群で再現したとは記録しない。E-010の正式判定およびE-011の主判定条件にも使用しない。

## 2026-08-01 — 現在の次工程

1. 確認群7急拡大候補の形成過程再解析を完了し、生の7件平均と2 trajectory-ply平均を確定する。
2. E-011固定ローカル環境のruntime、hardware、source commit、出力先を固定する。
3. E-011を`C0 → C1 → C2 → C3 → C4`の順で各400局実行する。
4. 条件別候補・対照分析、trajectory重複感度、事前登録判定を適用する。
5. 独立追加seed確認実験は、候補行発生率と固有trajectory発生率の両方を用いて別登録する。

## 2026-08-01 — E-010確認群捕獲分岐形成結果

### 実行

E-010の固定seed 200局を再生成し、主解析急拡大候補7件へ8ply形成過程解析を適用した。さらに`trajectoryHash + candidatePly`で重複除去し、2つの独立構造による感度集計を行った。

- source workflow commit: `174ff668d7ada3d91041fcbb8db656233e558122`
- Actions run: `30642671291`
- artifact digest: `sha256:71b10449821604677ab94a713c580a30cf2d8c3890c7d77ccc03c66f4287edf6`

### 結果

| 指標 | 生の7件平均 | 2 trajectory-ply平均 |
|---|---:|---:|
| 捕獲手数ピークまで | 1.71ply | 1.00ply |
| ピーク捕獲手数 | 9.29 | 10.00 |
| 捕獲手数変化 | +0.86 | +0.50 |
| 手番側最大捕獲可能量 | +2.57粒 | +1.50粒 |
| 相手側最大捕獲可能量 | -0.86粒 | -0.50粒 |
| 手番側再利用可能穴数 | -0.86 | -0.50 |
| 相手側再利用可能穴数 | +0.86 | +0.50 |
| phase変化 | 0/7 | 0/2 |

全7件で捕獲手数ピーク時の手番は候補時点のプレイヤーと一致した。最大重複群6件では手番側最大捕獲可能量`+3`、相手側`-1`。もう1つの独立構造では`0 / 0`だった。

### 解釈

探索群E-014の`+3.0 / -1.2`と平均方向は一致し、trajectory-ply重複除去後も`+1.5 / -0.5`で維持された。ただし明確な非対称化は2構造中1構造だけであり、確認群で広く一般化したとは判断しない。

H14は「確認群でも方向一致・限定的再現・未認定」へ更新した。E-010の正式判定`not-confirmed`は変更しない。

チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-01-e010-confirmation-capture-formation.md`

## 2026-08-01 — E-011固定ローカル正式実行ガード

### 固定policy

過去の正式pilot-v2実行記録に基づき、次を既知の固定条件とした。

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux
- corpus output: `artifacts/phase-transition/robustness-v1/`
- analysis output: `artifacts/local/phase-transition-robustness/`
- run order: `C0 → C1 → C2 → C3 → C4`

CPU、memory、OS release、hostname、exact source commitは固定ローカル環境でexecution lockを生成する時点に記録する。

### 実装

- `config/experiments/phase-transition-robustness-execution-policy-v1.json`
- `tools/experiments/prepare-phase-transition-robustness-execution.js`
- `tools/experiments/run-phase-transition-robustness-formal.js`
- `test/phase-transition-robustness-formal.test.js`
- `doc/phase-transition/E011_FORMAL_EXECUTION.md`

execution lock generatorはrepository path、branch、clean worktree、Node.js version、platform、run order、preregistration IDを検査し、source commitとhardware/runtime識別情報を記録する。

formal runnerは次を強制する。

- GitHub Actionsでは実行拒否
- execution lock後のsource commit変更を拒否
- branch変更、dirty worktree、Node.js変更を拒否
- C0–C4の順序違反を拒否
- repositoryの`formalExecutionAllowed`と完全一致の承認トークンを二重要求

現時点では`formalExecutionAllowed: false`であり、正式2000局は開始できない。過去の「明示的な開始承認まで正式実験を実行しない」という条件を維持した。

## 2026-08-01 — 更新後の次工程

1. E-011 formal execution guardのCI結果を確定する。
2. 明示的な正式実験開始承認後に、repository許可フラグを別コミットで有効化する。
3. 固定ローカル環境でexecution lockを生成し、runtime・hardware・source commitを固定する。
4. `C0 → C1 → C2 → C3 → C4`の順で各400局を実行する。
5. 条件別候補・対照分析、trajectory重複感度、最大捕獲可能量非対称化、事前登録判定を適用する。
6. 独立追加seed確認実験は候補行数と最低固有trajectory数を併用して別登録する。
