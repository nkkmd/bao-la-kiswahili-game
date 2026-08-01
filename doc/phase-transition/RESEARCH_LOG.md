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

| Condition | evaluator | search | depth | A candidates | expansion | controls | candidate rate | control rate | RR | status |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| C0 | bao | phase2 | 2 | 16 | 9 | 16395 | 56.25% | 2.95% | 19.09 | `pass` |
| C1 | bao | phase2 | 1 | 15 | 2 | 15679 | 13.33% | 2.05% | 6.49 | `insufficient` |
| C2 | bao | phase2 | 3 | 12 | 3 | 15801 | 25.00% | 1.75% | 14.26 | `insufficient` |
| C3 | bao-v2 | phase2 | 2 | 19 | 11 | 16437 | 57.89% | 2.88% | 20.08 | `pass` |
| C4 | bao | legacy | 2 | 8 | 0 | 15412 | 0.00% | 1.68% | 0.00 | `insufficient` |

C1/C2はRRと候補率>対照率を満たすが最低expansion候補5件に未達。C4はA候補8件・expansion 0件で最低件数を満たさないため、事前登録status関数により`fail`ではなく`insufficient`。

### Trajectory-ply感度

`trajectoryHash + candidatePly`重複除去後:

| Condition | unique candidates | unique expansion | unique controls | unique control expansion | dedup RR |
|---|---:|---:|---:|---:|---:|
| C0 | 8 | 2 | 12185 | 387 | 7.87 |
| C1 | 13 | 2 | 11407 | 240 | 7.31 |
| C2 | 10 | 2 | 11695 | 213 | 10.98 |
| C3 | 11 | 4 | 12160 | 378 | 11.70 |
| C4 | 6 | 0 | 11412 | 180 | 0.00 |

`phase2`を使用したC0–C3では重複除去後も候補側濃縮方向が残った。C4 (`legacy`)では生・重複除去後ともexpansion候補0。

### 正式全体判定

combined evaluatorは次を出力した。

- `decision: inconclusive`
- `trajectorySensitivityComplete: true`
- pass 2 / insufficient 3 / fail 0

E-011の正式判定は**`inconclusive`**として固定する。結果後に`partially-robust`または`not-robust`へ読み替えず、事前登録global ruleを維持する。

科学的には、phase2 family内では方向的一貫性が見える一方、AI/search条件全般へのglobal robustnessは確認できなかった。C4はsearch profile依存性を示唆するが、C4自体が`insufficient`なので因果を確定せず、別事前登録実験の仮説とする。

### Evaluator exit-code異常

combined evaluatorは`robustness-result.json`、`condition-summary.csv`、`robustness-summary.csv`を正常生成し、完全な`inconclusive`結果を表示した後にexit code 2を設定する。formal runnerの`execFileSync`がこれを`Error: Command failed`として表示した。

これは実行基盤interfaceの問題であり、formal integrityや科学判定の失敗ではない。正式結果は`inconclusive`のまま。

### 最終bundle監査

固定ローカル成果物を最終bundleとして保存し、共有されたアーカイブを監査した。

- archive: `e011-final-formal-evaluation.tar.gz`
- SHA-256: `367d3543d2f404582adce07ac863c90bd11534826ef36528b25376228bef2bbc`
- supplied SHA-256との一致: yes
- tar member count: 97
- unsafe path member: 0
- formal integrity result present: yes / `valid: true`
- formal evaluation outputs present: yes
- C0–C4 trajectory sensitivity summary: 5/5 present
- preregistration SHA-256: execution lockと一致
- execution-policy SHA-256: execution lockと一致

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-01-e011-formal-completion.md`

### 次工程

- E-011の正式`inconclusive`を固定し、閾値・global decision ruleを結果後に変更しない。
- evaluator exit-code interface問題はformal結果と分離した実装修正候補とする。
- `phase2`対`legacy`探索方式依存性を追う場合は別実験として事前登録する。
- E-017は別の明示的開始承認まで正式1000局を開始しない。

## 2026-08-01 — E-017正式1000局開始承認

2026-08-01 22:47 JST、ユーザーから研究再開時に提示した推奨順序「E-017 → H16直接比較実験」に対して「推奨順序で進めてください」と明示的な進行指示を受領した。

この指示をD-073およびE-017 execution policyが要求するE-017固有のformal experiment開始承認として扱う。E-011の過去承認は流用していない。

### Repository許可

E-017の1000局、seed、AI条件、候補検出、主解析単位、構造availability、RR基準、判定contractを変更せず、execution policyの状態と許可フラグだけを専用コミットで有効化した。

- authorization commit: `f0f9e90be0d77dac395e9ec53d951a011ad1f1fd`
- policy status: `approved-awaiting-local-lock`
- `formalExecutionAllowed: true`
- approval token: `E-017-FORMAL-APPROVED`
- checkpoint: `doc/phase-transition/checkpoints/2026-08-01-e017-formal-start-authorization.md`

### 起動状況

現在の操作環境には固定repository `/home/oruorane/github/bao-la-kiswahili-game` が存在しないことを確認した。E-011開始時と同様に、別環境を代替使用せずexecution lock生成前に停止した。

この時点の状態:

- execution lock: 未生成
- formal corpus: `0 / 1000`
- GitHub Actions formal run: 禁止を維持
- PR #26: draft維持

この停止は科学的結果ではなく、固定ローカル実行境界を守るための運用停止である。E-017の結果はまだ存在しない。

### 次工程

固定ローカル機で最新branch headへ更新し、Node.js `v24.6.0`、branch、clean worktreeを確認した上で`prepare-phase-transition-independent-confirmation-execution.js`によりexecution lockを生成する。lock成功後にのみ、完全一致トークンを用いてformal 1000局を開始する。

E-017を`run → analyze → verify → evaluate`まで完了した後、次の推奨工程としてH16の`phase2`対`legacy`直接比較を別事前登録する。

## 2026-08-02 — E-017固定ローカル正式1000局・最終評価完了

### Formal corpus

E-017の明示承認後、固定ローカル環境でexecution lockを生成し、正式1000局を完了した。

- experiment: `E-017`
- analysisVersion: `15-independent-structural-confirmation`
- games: 1000
- seed range: `20263001–20264000`
- condition: `hard / bao / phase2 / depth 2`
- primary population: `pliesRemaining >= 9`
- primary unit: unique `trajectoryHash + eventPly`

### analyze工程

`run`完了後、`analyze`初回実行はPython環境に`pandas`がなく `ModuleNotFoundError: No module named 'pandas'` で解析開始前に停止した。

これはformal corpusや研究条件の失敗ではない。固定corpusを再生成せず、同じ環境の`python3`へpandasを導入して同じlocked sourceのまま`analyze`を再実行した。

再実行は成功。

アーキタイプ解析:

- observationsに基づくcandidate counts: A 108 / B 349 / C 439 / X 0
- A archetypes: 45
- A unique states: 45

レジーム対照解析:

- observations: 56294
- regimes: 4354
- candidate members: 108
- control points: 41631
- candidate capture-branch-expansion: 37
- control capture-branch-expansion: 1235
- sensitivity settings: 27

### clean-worktree guard

`analyze`のPython実行により未追跡 `tools/experiments/__pycache__/` が生成され、最初の`verify`は `Worktree is not clean.` で停止した。

このディレクトリはPython bytecode cacheのみで、研究データ・source・config変更ではないため削除した。commit、checkout、pullは行わず、locked sourceを維持したまま`verify`を再実行した。

clean-worktree guardが意図どおり異常を検出した運用上の事象として記録する。科学条件やformal corpusを変更していない。

### Formal integrity

再実行した`verify`は成功。

- observations: 56294
- games: 1000
- `artifactVerification: true`
- `manifestCompletedGames: true`
- `manifestConfiguredGames: true`
- `manifestBaseSeed: true`
- `manifestProfile: true`
- `manifestLevel: true`
- `manifestEvaluationProfile: true`
- `manifestSearchProfile: true`
- `manifestMaxDepth: true`
- `gamesCount: true`
- `exactSeedSequence: true`
- `uniqueGameIds: true`
- `allTrajectoryHashesPresent: true`
- `gameConfigHashesMatchManifest: true`
- `lockExperimentId: true`
- `lockAnalysisVersion: true`
- `sourceCommitMatchesLock: true`
- `lockPreregistrationHashPresent: true`
- `lockPolicyHashPresent: true`
- `errors: []`
- `mode: formal`
- `valid: true`

### Formal evaluation

Raw endpoint:

- candidates: 53
- expansion candidates: 37
- controls: 40956
- control expansion: 1235
- candidate expansion rate: 69.81%
- control expansion rate: 3.02%
- RR: 23.15

Trajectory-ply deduplicated endpoint:

- unique candidates: 21
- unique expansion: 9
- unique candidate trajectories: 19
- unique candidate archetypes: 19
- unique expansion trajectories: 9
- unique expansion archetypes: 9
- unique controls: 23306
- unique control expansion: 727
- candidate expansion rate: 42.86%
- control expansion rate: 3.12%
- RR: 13.74
- largest trajectory-ply multiplicity: 24

事前登録criteria:

- raw primary candidate rows >=30: pass (53)
- unique candidate trajectory-ply >=15: pass (21)
- unique candidate trajectories >=12: pass (19)
- unique expansion trajectory-ply >=5: pass (9)
- unique expansion trajectories >=5: pass (9)
- unique control trajectory-ply >=30000: **fail (23306)**
- deduplicated RR >=3: pass (13.74)
- deduplicated candidate rate > control rate: pass

### 正式判定

**`not-confirmed`**

formal integrityはvalidで、唯一の不通過はminimum unique control trajectory-ply 30000に対する23306だった。

結果後に最低control数を23306へ緩和しない。RR 13.74や9固有expansion trajectoryを理由に`confirmed`へ読み替えない。

科学的には、独立seed 1000局でもtrajectory-ply重複除去後に強い候補側濃縮方向が維持され、expansionが9固有trajectoryへ分散した。したがって構造的一般性を伴う追加観測として記録するが、事前登録確認成功とは記録しない。

最大trajectory-ply群は24件で、E-010でも反復を確認した`trajectoryHash fe3c176c... / eventPly 7 / archetype 9f778d512ae1`だった。生の37 expansion行を37独立構造とは解釈しない。

### evaluator状態ラベル

formal evaluation JSONの`preregistrationStatus`は`preregistered-not-run`のままだった。これは事前登録configの状態文字列をそのまま表示するmetadata/interface問題であり、formal実行状態の正本ではない。

execution lockとformal integrity `mode=formal / valid=true`が正式実行成立を確認している。状態ラベルを理由にformal結果を無効化しない。

完了チェックポイント:

- `doc/phase-transition/checkpoints/2026-08-02-e017-formal-completion.md`

## 2026-08-02 — E-018 search profile依存性直接比較の事前登録

E-011で浮上したH16「捕獲分岐急拡大の顕在化はsearch profileに依存する」を直接検証する新規独立実験としてE-018を登録した。

E-011 C4のlegacy 0 expansionを確定証拠へ読み替えず、E-017のphase2結果もH16の直接証拠へ読み替えない。

### Corpus

- P2: `hard / bao / phase2 / depth 2`
- LG: `hard / bao / legacy / depth 2`
- 2000局 / condition
- total: 4000局
- shared seed: `20265001–20267000`
- same seed / same random-opening boundary required
- primary population: `pliesRemaining >= 9`

既存探索群、E-010、E-011、E-017のseedと非重複。

### Primary unit / endpoint

一次単位はpaired shared-seed game。

各conditionについて、1ゲーム内にeligible category-A candidateで`capture-branch-expansion`に分類されるものが1件以上あれば1、なければ0。

- `n10`: P2=1 / LG=0
- `n01`: P2=0 / LG=1

主検定:

- two-sided exact McNemar
- alpha `0.05`
- minimum discordant pairs `20`
- direction requirement: `n10 > n01`

formal integrity / pairing成功、discordant >=20、p<=0.05、P2-only > LG-onlyのすべてを満たす場合のみE-018上でH16 `confirmed`。

integrityとdiscordant availabilityが成立した上で効果条件不通過なら`not-confirmed`。

corpus/hash/source/paired-opening/seed-pairing/event/output失敗またはdiscordant <20は`inconclusive`。

### legacy最低expansion数を要求しない理由

H16ではlegacyで0件または極低率となること自体が仮説整合的な観測となり得る。legacyに最低expansion数を要求すると、E-011 C4と同様に最も強いprofile差が自動的に`insufficient`へ変換される可能性がある。

このためE-018ではlegacy expansion最低件数を設けず、paired game-level差を直接検定する。この判断はE-018 data generation前に固定した。

### Structural secondary

各conditionで`trajectoryHash + eventPly`を用いて次を副次報告する。

- unique candidate / expansion trajectory-ply
- unique candidate / expansion trajectory
- archetype counts
- largest duplicate multiplicity
- candidate vs control expansion rate / RR
- P2対LG candidate trajectory-ply expansion率のFisher exact、RR、risk difference

副次解析はprimary McNemar判定を置き換えない。

### Sample size

2000 paired seedsを採用。

- E-011 legacy C4 unique candidate trajectory-ply: 6/400 → 2000局単純投影30。Poisson点推定で20以上約97.81%。
- E-017 phase2 unique candidate trajectory-ply: 21/1000 → 2000局単純投影42。20以上約99.994%。
- E-017 phase2 unique controls 23306/1000 → 2000局単純投影46612。
- E-011 legacy C4 unique controls 11412/400 → 2000局単純投影57060。

これらは計画近似で、正式McNemar powerや証拠ではない。

### Registration

- config: `config/experiments/phase-transition-search-profile-dependence-v1.json`
- config commit: `1fcf6c7cd0c2768a7b56ffc3fefede1580bf34b6`
- checkpoint: `doc/phase-transition/checkpoints/2026-08-02-e018-search-profile-dependence-preregistration.md`
- checkpoint commit: `edf80a0b324cd548407dbfc02746f184ab5b7ea5`

### Execution state

- formal execution approval: **not approved**
- formal corpus: **not generated**
- GitHub Actions formal run: prohibited
- E-017 approval does not carry over

### 次工程

- paired-condition runnerを実装する。
- same-seed / paired-opening / common-source / condition-separation integrity validatorを実装する。
- exact McNemar evaluatorと構造副次解析を実装する。
- fixtureとGitHub Actionsで実装契約のみ検証する。
- **E-018 formal 4000局は別の明示的開始承認まで生成しない。**

## 2026-08-02 — E-018 formal infrastructure監査完了

E-018の事前登録条件を変更せず、formal 4000局を開始する直前までの実行基盤を実装・監査した。

### 実装

既存fixture runner、pair builder、McNemar evaluator、structural secondaryに加えて次を整備した。

- `tools/experiments/run-phase-transition-search-profile-dependence-formal.js`
- `tools/experiments/verify-phase-transition-search-profile-dependence.js` formal mode
- `test/phase-transition-search-profile-dependence-formal.test.js`
- `.github/workflows/phase-transition-search-profile-dependence.yml` formal-guard regression coverage

formal runnerは`status / run / analyze / verify / evaluate`を分離し、GitHub Actionsでのformal runを拒否する。execution lock後のsource commit、branch、clean worktree、Node.js、preregistration hash、execution-policy hash、locked corpus、primary endpoint、decision ruleの差し替えを拒否する。

formal verifierはP2/LG各2000局についてartifact hash、exact seed sequence、common source、source-lock一致、paired opening hash、condition identity、trajectory hash、config hash分離、lockのpreregistration/policy hashを監査する。

formal evaluationはintegrity `mode=formal / valid=true`通過後にのみ実行できる。paired endpointまたはrequired output構築失敗は事前登録どおり`inconclusive`として扱う。structural secondaryはprimary McNemar判定を置き換えない。

### 実行環境予防措置

E-017でPython `__pycache__/`がclean-worktree guardを停止させたため、E-018 formal分析時の同種の非科学的停止を防ぐ目的で`.gitignore`に`__pycache__/`と`*.py[cod]`を追加した。

これはPython bytecode cacheのみを対象とする運用上の変更であり、E-018の局数、seed、search profile、候補検出、分類閾値、primary unit、検定、alpha、direction、minimum discordant pairs、decision ruleを変更していない。

### GitHub Actions検証

- validated implementation head: `c37b0e3d00b11d0d9563a815dbb653297503a90d`
- workflow: `Phase Transition Search Profile Dependence`
- Actions run: `30723040531`
- job: `fixture`
- result: **success**

成功した工程:

- evaluator / pair-builder / preregistration / formal-guard regression tests
- paired two-game fixture generation
- paired fixture integrity verification
- P2/LG candidate/control construction
- paired game-level endpoint construction
- preregistered structural secondary
- artifact upload

GitHub Actionsでは2局fixtureのみを生成し、formal corpusは生成していない。

### Formal state

- execution policy status: `prepared-not-approved`
- `formalExecutionAllowed: false`
- E-018 formal approval: **not granted**
- execution lock: formal run用には未生成
- P2 corpus: `0 / 2000`
- LG corpus: `0 / 2000`
- total formal corpus: `0 / 4000`
- H16 formal result: none

E-017承認は継承していない。

E-011 formal global decisionは**`inconclusive`**、E-017 formal decisionは**`not-confirmed`**のまま固定する。E-011 C4のlegacy 0 expansionやE-017 phase2 enrichmentをE-018の正式結果へ読み替えない。

checkpoint:

- `doc/phase-transition/checkpoints/2026-08-02-e018-formal-infrastructure.md`

### 停止点

E-018 formal infrastructureは正式4000局開始直前まで検証済み。

**ここで停止し、E-018固有の明示的formal開始承認を待つ。**

承認後にのみexecution policyの状態・許可フラグを専用コミットで有効化し、固定ローカル環境でexecution lockを生成する。lock成功後にのみformal 4000局を開始する。
