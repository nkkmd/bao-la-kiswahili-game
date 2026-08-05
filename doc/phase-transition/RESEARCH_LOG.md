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

## 2026-08-01 — E-011正式実行ガードの追加監査

静的監査と隔離Gitリポジトリ試験により、正式実行開始前の追加失敗経路を検出し修正した。

### formal出力とclean worktree

execution lockおよびpartial corpusが未追跡ファイルとして現れると、clean-worktreeガードがC0開始前またはC1再開前に自己停止する。このため正式corpus rootを`.gitignore`へ固定し、lock生成時にGitのignore規則をprobeパスで実照合するようにした。

未作成ディレクトリ名そのものを`git check-ignore`へ渡す初期実装は、末尾スラッシュ規則を正しく検証できなかった。配下の`.e011-ignore-probe`を照合する方式へ修正した。分析条件・seed・出力内容は変更していない。

### lock後の入力不変性

各formal phaseの開始前に次をexecution lockと再照合する。

- execution policyのrepository相対パス
- execution policyのSHA-256
- 事前登録ファイルのrepository相対パス
- 事前登録ファイルのSHA-256

代替policyや代替事前登録をCLIで渡す経路、lock後に設定を差し替える経路を拒否する。

### 評価前integrity gate

全体評価は`robustness-integrity.json`が存在し、`mode=formal`かつ`valid=true`の場合だけ実行する。5条件のsource、seed、paired opening、condition分離が未確認のまま統計判定へ進む経路を閉じた。

### 検証

隔離Gitリポジトリで次のテストが成功した。

- repository許可フラグと承認トークン
- C0–C4順序制約
- formal corpus rootの実ignore照合
- GitHub Actionsでのlock生成拒否
- 事前登録・policy hash差し替え拒否
- formal integrity未通過時の評価拒否

GitHub Actionsの最新fixture検証はキュー待機中である。正式自己対局は実行していない。

## 2026-08-01 — E-017独立構造確認実験の事前登録

### 目的

E-010で観測した捕獲分岐急拡大濃縮を独立seedで再確認し、同一決定論的trajectoryの反復を主効果から除外する。

### コーパス

- 1000局
- base seed `20263001`
- seed範囲 `20263001–20264000`
- `hard / bao / phase2 / depth 2`
- 既存の探索群、E-010、E-011 seedと非重複

### 主解析単位

`trajectoryHash + eventPly`を主キーとする。eventPlyは`candidatePly → representativePly → ply`の優先順で解決する。生の候補行endpointは副次解析として保持する。

### サンプル数

E-010 200局では、生候補11、固有candidate trajectory-ply 5、固有candidate trajectory 4、固有expansion trajectory-ply 2、固有control trajectory-ply 7061だった。

1000局での期待値は、生候補55、固有candidate trajectory-ply 25、固有candidate trajectory 20、固有expansion trajectory-ply 10、固有control trajectory-ply 35305。

成功条件として次を固定した。

- 生の主解析候補行30件以上
- 固有candidate trajectory-ply 15件以上
- 固有candidate trajectory 12件以上
- 固有expansion trajectory-ply 5件以上
- 固有expansion trajectory 5件以上
- 固有control trajectory-ply 30000件以上
- 重複除去後RR 3以上
- 重複除去後候補率が対照率を上回る

構造availability 4条件のPoisson点推定単純積は約93.8121%。相関を無視した計画値であり、正式な同時達成確率や統計的証拠として使用しない。

### 登録・実装

- `config/experiments/phase-transition-independent-confirmation-v2.json`
- `doc/phase-transition/checkpoints/2026-08-01-e017-independent-confirmation-preregistration.md`
- `tools/experiments/evaluate-phase-transition-independent-confirmation.js`
- `test/phase-transition-independent-confirmation.test.js`
- `.github/workflows/phase-transition-independent-confirmation.yml`

corpus条件不一致は`inconclusive`、構造availabilityまたは効果基準不通過は`not-confirmed`、全条件通過のみ`confirmed`とする。

E-017正式1000局は未承認・未実施であり、別の明示的開始指示を要求する。E-010およびE-011の既存判定・条件は変更していない。

## 2026-08-01 — 最新の次工程

1. E-011 formal execution guard CIを完了する。
2. E-017 evaluator CIを完了する。
3. 明示的承認なしにE-011またはE-017の正式corpusを生成しない。
4. E-011承認後は固定ローカル環境でexecution lockを生成し、C0から順に実行する。
5. E-017の正式実行policyとcorpus integrity validatorは、正式開始承認前に別工程として実装する。

## 2026-08-01 — E-017 evaluator GitHub Actions検証

E-017の構造主解析evaluatorと回帰fixtureをGitHub Actionsで検証した。

- validated commit: `9190998507e144d239adb55cadc3f61860a005be`
- workflow: `Phase Transition Independent Confirmation`
- Actions run: `30646973255`
- job: `evaluator`
- result: `success`

成功した回帰項目:

- 固有`trajectoryHash + eventPly`への重複除去
- 固有candidate trajectory数と固有expansion trajectory数の計数
- 重複除去後候補率・対照率・RRの算出
- 全条件通過時の`confirmed`
- 構造availability不足時の`not-confirmed`
- manifest完了局数不一致時の`inconclusive`

この検証はevaluator契約の回帰テストであり、正式1000局の結果ではない。E-017 corpusは生成しておらず、正式開始には別の明示的承認を要求する。E-010およびE-011の既存判定・事前登録条件も変更していない。

チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-01-e017-evaluator-validation.md`

## 2026-08-01 — 更新後の次工程

1. E-011 formal execution guardのGitHub Actions検証を完了する。
2. E-017固定ローカル実行policy、execution lock、corpus integrity runnerを実装する。
3. 明示的承認なしにE-011またはE-017の正式corpusを生成しない。
4. E-011開始承認後は固定ローカル環境でexecution lockを生成し、C0から順に実行する。
5. E-017は別の開始承認まで正式1000局corpusを生成しない。

## 2026-08-01 — E-011正式自己対局開始承認

2026-08-01 06:09 JST、ユーザーから「E-011の正式自己対局を開始してください」と明示的な開始指示を受領した。

### Repository許可

execution policyの実験条件・分析条件・判定条件を変更せず、状態と許可フラグだけを専用コミットで有効化した。

- authorization commit: `a0378010607aebad76420e0d377ee1b88166d861`
- policy status: `approved-awaiting-local-lock`
- `formalExecutionAllowed: true`
- approval token: `E-011-FORMAL-APPROVED`
- checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e011-formal-start-authorization.md`

### 起動状況

現在の操作環境には固定repository `/home/oruorane/github/bao-la-kiswahili-game` が存在しない。このため、別環境を代替使用せず、execution lock生成前に停止した。

この時点の状態:

- execution lock: 未生成
- C0 corpus: `0 / 400`
- total formal corpus: `0 / 2000`
- PR #26: draft維持

### 次工程

固定ローカル機で最新branch headへ更新し、Node.js `v24.6.0`、branch、clean worktreeを確認した上でexecution lockを生成する。lock成功後、承認トークンを用いてC0 400局を開始する。

開始承認は、5条件、各400局、seed範囲、実行順、候補検出、急拡大分類、成功条件、trajectory副次分析のいずれも変更しない。

## 2026-08-01 — E-011固定ローカル正式2000局・最終評価完了

### 実行固定情報

固定ローカル機でexecution lockを生成し、`C0 → C1 → C2 → C3 → C4`の順で各400局、合計2000局を実行した。

- repository: `/home/oruorane/github/bao-la-kiswahili-game`
- branch: `research/forced-capture-regime-analysis`
- locked source commit: `ed61d7214967b95535d9f30f8fa47480e2ea5ecb`
- Node.js: `v24.6.0`
- platform: Linux
- shared seeds: `20262001–20262400`
- preregistration SHA-256: `65253e719463b4e60527bdb96cb4ce234aae76df39d5d2727bd9d09849c7eb69`
- execution-policy SHA-256: `97fa235e340b527919f9414c6859ce63b74cc5a930ce7e9893c66c2ddb02698b`

### Formal integrity

`run-phase-transition-robustness-formal.js --phase verify`は成功した。

- 5条件すべて400/400局
- `allConditionsPresent: true`
- `uniqueConditionConfigHashes: true`
- `commonSourceCommit: true`
- `pairedOpeningHashes: true`
- `conditionIdentityClean: true`
- `errors: []`
- `valid: true`

### 条件別結果

主解析は`pliesRemaining >= 9`。

| Condition | evaluator | search | depth | A candidates | expansion | controls | RR | status |
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

## 2026-08-02 — E-018 H16 search profile依存性直接比較

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

E-018は実験固有のformal開始承認を2026-08-02 08:39 JSTに受領済み。E-017承認の流用ではない。

承認checkpoint:

- `doc/phase-transition/checkpoints/2026-08-02-e018-formal-start-authorization.md`

### 次工程

固定ローカルrepositoryでexecution lockを生成し、source commit/runtime/hardware/preregistration hash/policy hashを固定する。lock成功後にのみformal 4000局を実行し、`analyze → verify → evaluate`まで同一lock下で完了する。primary判定は事前登録McNemar条件を変更せず適用する。

## 2026-08-02 — E-018 fixed-local formal 4000局・最終評価完了

### 実行固定情報

E-018は専用開始承認後、固定ローカル環境でexecution lockを生成し、P2/LG各2000局、合計4000局を完了した。

- locked source commit: `1f6b129b9b3cb11580244b1d4c337c067289cfdb`
- Node.js: `v24.6.0`
- Python venv: `/home/oruorane/.venvs/bao-phase-transition-e011`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`
- preregistration SHA-256: `17fb28bf250d2218b91d5d6196ec58ac7ba0c8b8d2ced93d498135ea669e4298`
- execution-policy SHA-256: `b1bd2769877989a236f24576ea8e11070fbe573f4f7a92b9c56d3f998b1b9653`
- seeds: `20265001–20267000`
- P2: `hard / bao / phase2 / depth 2`
- LG: `hard / bao / legacy / depth 2`

formal run中、1局単位の進捗表示がない仕様確認のため一度`Ctrl+C`で中断した。P2 60局はatomic-write済みで、同一lock・同一source・同一configのresume contractにより既存局を検証再利用し、未完了局のみ再計算して完了した。科学条件・seed・source・lockの変更はない。

### Formal integrity

P2 2000局・110985観測、LG 2000局・115785観測。

`verify`は以下をすべて通過した。

- both conditions present
- unique condition config hashes
- common source commit
- source commit matches lock
- exact paired seed sequence
- paired opening hashes
- condition identity clean
- trajectory hashes present
- execution mode correct
- lock preregistration hash
- lock policy hash present
- artifact verification
- `errors: []`
- `mode: formal`
- **`valid: true`**

### Preregistered primary endpoint

2000 paired gamesについて、eligible category-A `capture-branch-expansion` candidateが1件以上あるかをcondition別binary endpointとした。

- `n00`: 1928
- `n01` (LG only): 9
- `n10` (P2 only): 63
- `n11`: 0
- discordant pairs: 72
- P2 event-game rate: 63/2000 = 3.15%
- LG event-game rate: 9/2000 = 0.45%
- paired risk difference: +2.70 percentage points
- discordant odds ratio `n10/n01`: 7.0
- two-sided exact McNemar p: `4.1812279092751445e-11`

事前登録criteriaは全通過した。

- exact pair count: pass
- discordant pairs >=20: pass (72)
- McNemar p <=0.05: pass
- direction `n10 > n01`: pass (63 > 9)

### Formal decision

**`confirmed`**

H16「捕獲分岐急拡大の顕在化はsearch profileに依存する」は、E-018の事前登録primary endpoint上で確認された。

E-011 C4を事後的に確定証拠へ読み替えたものではなく、独立seed block、paired same-opening設計、事前登録McNemar検定による直接確認である。

### Structural secondary

P2 raw eligible candidates 107、expansion 63、controls 80579、control expansion 2449、RR 19.37。trajectory-ply重複除去後は34 candidates / 11 expansion、32 candidate trajectories / 11 expansion trajectories、dedup RR 10.12。

LG raw eligible candidates 54、expansion 9、controls 77567、control expansion 1283、RR 10.08。trajectory-ply重複除去後は31 candidates / 7 expansion、30 candidate trajectories / 7 expansion trajectories、dedup RR 13.43。

candidate trajectory-plyのP2対LG直接比較は11/34対7/31、risk difference +9.77 percentage points、RR 1.43、two-sided Fisher exact p `0.41837226457118804`。

これは事前登録structural secondaryであり、primary McNemar判定を置き換えない。Fisher p>0.05を理由にformal `confirmed`を変更しない。

### 解釈境界

E-018が直接確認した範囲は固定 `hard / bao / depth 2` 条件におけるP2=`phase2`対LG=`legacy`のpaired game-level manifestation差である。全evaluator、全depth、全search implementationへの一般化はしない。

E-010 `not-confirmed`、E-011 `inconclusive`、E-017 `not-confirmed`は変更しない。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-02-e018-formal-completion.md`

## 2026-08-02 — E-019事前登録v2訂正・formal infrastructure確立

E-019/H17として、E-018の固定`hard / bao / depth2` confirmationをD1=`bao/depth1`、D3=`bao/depth3`、V2=`bao-v2/depth2`へ一般化できるかを、新規独立実験として事前登録した。

v1のsample-size planning参考Nに数pairの算術誤差を検出したため、formal data生成前にv2へ訂正した。訂正対象は参考planning Nのみであり、採用sample size、seed、strata、endpoint、McNemar、IUT、Holm、direction ruleは変更していない。

Current preregistration:

- `config/experiments/phase-transition-search-profile-generalization-v2.json`
- SHA-256: `046e38edc1baba276fe2444715e09da3280e6438b036ad3ebb89e323e3fe0ec8`
- analysisVersion: `17-search-profile-generalization`

Formal design:

- D1: 6500 pairs / 13000 games / seed `20268001–20274500`
- D3: 4500 pairs / 9000 games / seed `20268001–20272500`
- V2: 2000 pairs / 4000 games / seed `20268001–20270000`
- total: 13000 paired comparisons / 26000 games
- paired same-opening within stratum
- exact two-sided McNemar
- component alpha 0.05
- minimum discordants 20
- direction `phase2-only > legacy-only`
- global IUT requires all three strata pass
- standalone claims use Holm-Bonferroni
- structural trajectory-ply analysis is secondary only

Non-formal infrastructure validation completed successfully. E-019 formal seeds were not used by GitHub Actions and GitHub Actions formal execution remained prohibited。

## 2026-08-03 — E-019 formal開始承認・fixed-local execution lock

E-019固有のformal開始承認を受領し、過去experimentの承認を流用せずexecution policyを`approved-awaiting-local-lock / formalExecutionAllowed=true`へ遷移した。

承認済み状態のE-019 fixture CIも全工程success。

- workflow: `Phase Transition Search Profile Generalization`
- Actions run: `30779314186`
- fixture artifact: `8843108847`
- artifact digest: `sha256:d3d32c5a4a5b857dd6da86a99cf50cdbcdd1f569a6c2cf085e6dd9fb7c2d1f4c`
- formal GitHub Actions run: prohibited

固定ローカルpreflight後、E-019専用execution lockを生成した。

- status: `prepared-approved`
- errors: `[]`
- locked source commit: `73ccd513218d7afa96fa637b366c3af2abca6323`
- branch: `research/forced-capture-regime-analysis`
- Node.js: `v24.6.0`
- platform: Linux / WSL2
- Python venv: `/home/oruorane/.venvs/bao-phase-transition-e011`
- Python: `3.12.3`
- numpy: `2.5.1`
- pandas: `3.0.5`
- preregistration SHA-256: `046e38edc1baba276fe2444715e09da3280e6438b036ad3ebb89e323e3fe0ec8`
- execution-policy SHA-256: `47d8b0df17eaa7fb9e878117d973bba91aba6963bbd65cecb8e0bcb0a939495c`

lock後はsource、branch、runtime、preregistration、policyを変更せずformal corpusを生成した。

## 2026-08-05 — E-019 fixed-local formal 26000局・最終評価完了

### Corpus / integrity

全6 conditionsを完了した。

- D1-P2: 6500 games / 393710 observations
- D1-LG: 6500 / 310951
- D3-P2: 4500 / 277876
- D3-LG: 4500 / 251160
- V2-P2: 2000 / 112412
- V2-LG: 2000 / 117587

Formal verify:

- all conditions present: true
- unique condition config hashes: true
- common source commit: true
- source commit matches lock: true
- within-stratum seed sequences: true
- paired opening hashes within stratum: true
- nested formal seed prefixes: true
- condition identity clean: true
- trajectory hashes present: true
- execution mode correct: true
- lock preregistration hash: true
- lock policy hash present: true
- artifact verification: true
- errors: `[]`
- mode: `formal`
- **valid: true**

### Primary formal result

| stratum | n01 LG-only | n10 P2-only | discordants | P2 rate | LG rate | RD | OR | exact McNemar p | decision |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| D1 | 4 | 67 | 71 | 1.0308% | 0.0615% | +0.9692pp | 16.75 | `8.735848890518809e-16` | `pass` |
| D3 | 140 | 13 | 153 | 0.2889% | 3.1111% | -2.8222pp | 0.09286 | `4.614222568073049e-28` | `fail` |
| V2 | 18 | 63 | 81 | 3.15% | 0.90% | +2.25pp | 3.5 | `5.204403564731451e-7` | `pass` |

Holm standalone:

- D1: confirmed, adjusted p `1.7471697781037618e-15`
- D3: preregistered P2>LG directionはnot confirmed
- V2: confirmed, adjusted p `5.204403564731451e-7`

D3ではminimum discordantsを十分満たし、p値も小さいが、`P2-only=13 < LG-only=140`となって事前登録方向が逆転した。このため`fail`。結果後にdirection ruleを反転しない。

Global IUTはD1/D3/V2全てpassを要求するため、formal global decisionは**`not-confirmed`**。

D1/V2のpass・Holm standalone confirmationでglobal判定を救済しない。

### Structural secondary

Trajectory-ply direct comparison:

- D1: P2 12/64 vs LG 4/33, RD +6.63pp, RR 1.5469, Fisher p `0.565927217884321`
- D3: P2 6/49 vs LG 17/36, RD -34.98pp, RR 0.2593, Fisher p `0.0004792331642727793`
- V2: P2 17/34 vs LG 11/41, RD +23.17pp, RR 1.8636, Fisher p `0.05523184537701421`

D3 secondaryでも逆方向だが、structural secondaryはprimary/global decisionを変更しない。

### 解釈

E-018 H16の`confirmed`は固定`hard / bao / depth2`に限定して維持する。E-019はその結果を取り消すものではない。

一方、H17「指定depth/evaluator変更下でもphase2優位として維持される」というconjunctionはD3逆転により`not-confirmed`。

D3の`legacy > phase2`を新しいconfirmatory hypothesisとして結果後に認定しない。depth依存の非単調性や探索方式相互作用を検証する場合は、新規仮説・新規事前登録・新規seed blockへ分離する。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-05-e019-formal-completion.md`

## 2026-08-05 — E-019 final formal bundle固定

E-019 final成果物をrepository外の統一保管先へ固定した。

- directory: `/home/oruorane/bao-e019-exports/`
- archive: `e019-final-formal-evaluation.tar.gz`
- SHA-256: `6a43fa611997049462a14a4ef4ba4816f6469f7c9931b3920e50f7eef866da75`
- `sha256sum -c`: `OK`
- archive member count: 26120
- unsafe path member: 0
- reported size: 321M

Final bundle audit:

- `doc/phase-transition/checkpoints/2026-08-05-e019-final-bundle-audit.md`

既存formal decisionsは変更しない。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: `not-confirmed`

PR #26は引き続きopen / draftのまま維持する。

## 2026-08-05 — 第1研究スコープ整理・完了計画

### 背景

研究開始時の`doc/PHASE_TRANSITION_RESEARCH_PLAN.md`はRQ1–RQ10を広く設定した探索的マスター計画だった。

その後、探索・確認研究を進める中で、強制捕獲レジーム内部の`capture-branch-expansion`が最も明瞭な再現可能候補として浮上し、E-010–E-019の確認研究がこの現象へ集中した。

初期RQを全て同一研究内でformalに消化することを完了条件にすると、探索で中心化した現象の確認と、未着手の別テーマが混在する。このため研究プログラムを次のように整理した。

- 第1研究: **「Baoにおける局面相転移点の発見と、capture-branch-expansionの確認」**
- 第1研究で主対象としなかった初期RQ: 将来の追加研究課題 / Future Work

この整理はformal結果や事前登録条件の変更ではない。

### 第1研究に残す工程

1. E-019 D3で観測されたlegacy > phase2逆転の独立確認
2. depth/search-profile依存性の必要な機構解析
3. 初期の相転移認定基準6項目に対するcapture-branch-expansionの最終評価
4. 機械定義と人間向けBao語彙の対応付け
5. 最終研究報告・再現情報・Future Workの統合

D3逆転はE-019の事前登録方向とは逆の観測なので、E-019内でconfirmatory resultへ読み替えない。独立検証を行う場合は新規仮説・新規seed・新規preregistration・新規execution lockを要求する。

現時点で**E-020 / H18は未登録**。

### Future Work

reserve、nyumba、前列支配、capture→mobility、forcing→free-choice、namua→mtajiとの一般的時間関係、複数相転移の一般化等は、第1研究で否定されたのではなく独立した追加研究課題として残す。

RQ8の探索条件依存性はE-011/E-018/E-019で重点的に扱われており、D3境界条件まで第1研究内で閉じる。

### 文書

- completion plan: `doc/phase-transition/STUDY_1_COMPLETION_PLAN.md`
- scope checkpoint: `doc/phase-transition/checkpoints/2026-08-05-study-1-scope-and-completion-plan.md`

既存formal decisionsは固定する。

- E-010: `not-confirmed`
- E-011: `inconclusive`
- E-017: `not-confirmed`
- E-018: `confirmed`
- E-019: `not-confirmed`

PR #26は科学的完了条件とは分離し、明示的指示までopen / draftを維持する。
