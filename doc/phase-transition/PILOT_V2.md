# 相転移パイロット v2

## 目的

100局で実施した最初の`pilot`は、開局妥当性フィルターを導入する前の監査記録として保持する。`pilot-v1`では、6 plyのランダム開局中またはその直後に`front-empty`で終局する対局が3局確認された。

`pilot-v2`は、開局6手終了時点で不適格な局面を棄却し、開局生成だけで成立した終局事故を補正版サンプルへ混入させないことを目的とする。

## 開局受理条件

ゲーム0は、決定論的な標準開局を用いるベースラインとして維持する。ゲーム1以降では、seed付き合法ランダム手により6 plyの開局候補を生成し、6 ply終了後に次の条件をすべて満たす場合のみ受理する。

- `winner === null`である
- 合法手が1手以上存在する
- 両プレイヤーとも前列に石の入ったピットが1つ以上ある

不適格な候補は決定論的に再生成する。再試行回数の上限は1局につき100回とする。

## seed互換性

`pilot-v2` study version `0.4.1`では、`pilot-v1`との比較可能性を保つため、開局候補のattempt 1で元のgame seedをそのまま使用する。attempt 2以降でのみ決定論的な派生seedを使用する。

また、attempt 1が受理された対局では、開局生成で消費した乱数回数をAI用PRNGにも反映し、`pilot-v1`と同じ乱数状態からC0探索を開始する。これにより、開局6手終了時点で妥当だった対局は、`pilot-v1`と同一軌跡を維持する。

## 監査メタデータ

各ゲームには次の値を記録する。

- `openingAttempt`
- `openingSeed`
- `openingRejectedCount`
- `openingRejectionReasons`

manifestには、集計値として`openingQuality`を記録する。

- `rejectedOpenings`
- `gamesWithRetries`
- `maximumAttempt`
- `rejectionReasons`
- `acceptedEarlyTerminalCount`

`acceptedEarlyTerminalCount`は、開局候補としては受理されたものの、開局直後のC0着手によって早期終局した対局数を示す。これは開局6手終了時点の妥当性違反とは区別する。

## 実行方法

```bash
node tools/experiments/run-phase-transition-research.js --profile pilot-v2
```

出力先は次のとおり。

```text
artifacts/phase-transition/pilot-v2/
```

## 進捗確認と再開

```bash
node tools/experiments/run-phase-transition-research.js \
  --profile pilot-v2 \
  --status
```

通常の実行コマンドを再度実行すると中断地点から再開する。設定ハッシュが一致する場合に限り、完了済みのゲーム単位ファイルを再利用する。

## 成果物の検証

```bash
node tools/experiments/verify-phase-transition-artifacts.js \
  --input artifacts/phase-transition/pilot-v2
```

## 正式実験結果

study version `0.4.1`の正式な100局実験では、次の結果を得た。

- 完了ゲーム数: 100
- 観測数: 5,650
- 固有軌跡数: 90
- 固有最終局面数: 89
- South勝利: 56
- North勝利: 44
- 引き分け: 0
- 支配的軌跡率: 0.03
- 開局棄却数: 1
- 再試行が発生したゲーム数: 1
- 最大attempt: 2
- 棄却理由: `terminal:front-empty` 1件
- 開局直後の早期終局: 2件
- diversity pilot gate: 通過

成果物検証では、100局・5,650観測の整合性が確認された。

## pilot-v1との比較

`artifacts/phase-transition/pilot/`は上書きせず、`pilot-v1`として扱う。`pilot-v1`には開局妥当性フィルターがなく、6 ply時点ですでに`front-empty`終局していた1局と、7 ply目で終局した2局が含まれる。

`pilot-v2`では、6 ply時点ですでに終局していた1局だけが棄却・再生成された。7 ply目で終局した2局は、6 ply終了時点では受理条件を満たしており、開局直後のC0着手による正規終局であるため成果物に残す。

比較報告では、少なくとも次を明示する。

- `pilot-v1`は無検証開局の比較基準である
- `pilot-v2`はstudy version `0.4.1`の正式な開局検証済みデータである
- 両者の差分は、6 ply終了時点で不適格だった1局の置換によるものである
- 7 ply早期終局2局を含む分析と除外した感度分析を区別する

## 成果物の配置

ローカル成果物は次の構成で管理する。

```text
artifacts/phase-transition/
├── diversity-smoke/
├── pilot/
├── pilot-v2/
└── archive/
    └── pilot-v2-seed-shifted/
```

各ディレクトリの位置づけは次のとおり。

- `artifacts/phase-transition/diversity-smoke/`
  - 10局規模の多様性確認用出力
- `artifacts/phase-transition/pilot/`
  - `pilot-v1`
  - 開局妥当性フィルター導入前の監査記録
- `artifacts/phase-transition/pilot-v2/`
  - study version `0.4.1`
  - 正式な開局検証済みデータ
- `artifacts/phase-transition/archive/pilot-v2-seed-shifted/`
  - study version `0.4.0`
  - attempt 1から派生seedを使用していた旧実験
  - 正式分析には使用せず、seed不具合の監査記録として保持

`pilot-v2-seed-shifted`は破棄可能な一時出力ではなく監査記録であるため、`artifacts/local/`ではなく`artifacts/phase-transition/archive/`へ配置する。

これらのローカル成果物はGit管理対象に含めず、`.gitignore`で除外する。実験の意味、設定、結果、比較方針は本書およびmanifestへ記録し、巨大な生成物自体はリポジトリへコミットしない。
