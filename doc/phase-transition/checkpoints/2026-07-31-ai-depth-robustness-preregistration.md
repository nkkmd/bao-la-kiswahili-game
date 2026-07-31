# E-011 AI条件・探索深度横断頑健性実験 — 事前登録チェックポイント

日付: 2026-07-31  
analysisVersion: `12-ai-depth-robustness`  
状態: `preregistered / not-run`

## 目的

E-010で観測された捕獲分岐急拡大の候補群への濃縮が、評価器、探索実装、固定探索depthを変更しても再現するかを確認する。

E-010の判定や成功条件は変更しない。E-011は独立したseed範囲を用いる別実験として登録する。

## 条件

各条件400局。seed範囲 `20262001–20262400` を全条件で共有し、同一seedから同一ランダム開局を生成する。

| 条件 | 役割 | level | evaluator | search | maxDepth |
|---|---|---|---|---|---:|
| C0 | 基準 | hard | bao | phase2 | 2 |
| C1 | depth低下 | hard | bao | phase2 | 1 |
| C2 | depth増加 | hard | bao | phase2 | 3 |
| C3 | 評価器変更 | hard | bao-v2 | phase2 | 2 |
| C4 | 探索実装変更 | hard | bao | legacy | 2 |

一度に一要因だけを変更する。条件間で開局seedを共有するのは、開局構成差による分散を抑えるためであり、探索群およびE-010確認群とのseed重複は認めない。

## 固定分析条件

E-010から次を変更しない。

- category: `A`
- signalThreshold: `2.0`
- persistenceThreshold: `0.75`
- opening ply除外
- 最終観測除外
- 隣接候補plyの区間統合
- primary population: `pliesRemaining >= 9`
- expansionDelta: `3`
- persistenceFraction: `0.5`
- eventWindow: `8`
- controlExclusionBuffer: `8`

主評価項目は、各条件内での捕獲分岐急拡大の候補率／対照率リスク比とする。対照は条件ごとに構築し、条件間で混合しない。

## サンプル数設計

E-010では200局から主解析A候補11件を観測したため、候補発生率を `0.055件/局` と置く。

各条件400局では期待候補数は22件。Poisson近似では12件以上を得る確率は約99.24%である。5条件すべてで12件以上となる確率は単純独立近似で約96.2%となる。

この計算はE-011のサンプル数を固定するためだけに使用し、E-010の基準や解釈を変更しない。

## 条件別成功条件

- 主解析A候補12件以上
- 急拡大候補5件以上
- 主解析対照10000件以上
- リスク比3以上
- 候補急拡大率が対照急拡大率を上回る

条件別判定:

- `pass`: 全条件を通過
- `insufficient`: integrityは通過したが最低件数条件に未達
- `fail`: 最低件数条件は通過したが濃縮条件に未達
- `inconclusive`: corpus、schema、source条件のintegrity不成立

## 全体判定

- `robust`: C0がpass、かつC1–C4がすべてpass
- `partially-robust`: C0がpass、C1–C4のうち3条件以上がpass、failはなく、残りはinsufficientのみ
- `not-robust`: C0がfail、C1–C4のうち2条件以上がfail、または評価可能な条件でリスク比1以下
- `inconclusive`: 上記に分類できない場合、integrity不成立、または解消しないサンプル不足

## 実行方針

正式な400局×5条件の自己対局は固定ローカル環境で、`C0 → C1 → C2 → C3 → C4` の順に逐次実行する。GitHub Actionsでは回帰テスト、短いfixture、schema・hash・成果物検証だけを行い、正式実験は実行しない。

## 実装前提

実行前に次を実装する。

1. `run-phase-transition-research.js` へ明示的なcondition IDと条件別出力先を渡せるようにする。
2. 事前登録JSONから条件を読み、条件ごとのconfig hashを固定するrunnerを追加する。
3. 条件間でsource、seed、opening policy、feature extractorが混在していないことを検証する。
4. 条件別候補・対照表と全体判定summaryを生成する。
5. 回帰テストと短いfixture監査を追加する。

## 事前登録ファイル

- `config/experiments/phase-transition-robustness-v1.json`

## 次工程

1. E-011のmulti-condition runner、検証器、回帰テストを実装する。
2. 短いfixtureで条件ID、seed共有、config hash分離を監査する。
3. 固定ローカル環境で400局×5条件を逐次実行する。
4. 結果取得後、事前登録判定を適用して研究台帳を更新する。
