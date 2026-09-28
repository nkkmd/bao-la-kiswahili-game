# `PBAI-C017-PERFORMANCE-002` — wall-clock検証結果

実行run: [GitHub Actions #36411624798](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/36411624798)  
結果保全run: [GitHub Actions #36412188487](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/36412188487)  
判定: **NO-MATERIAL-WALL-CLOCK-IMPROVEMENT**  
技術状態: **VALID**  
candidate: `PBAI-C017-v1`  
比較source: baseline `22537fb192b6c5bd1e2f3e6bca7488d7baa6f91b`、candidate `e9e98290d600bc342a748b80d4589473a0b5ac57`

## 固定条件と標本

baseline support、developmentとは別のseed block `2026100101..2026100164`を使い、64 seedすべてをActionsの8 shardで処理した。得られた局面は106件（Namua 61、Mtaji 45）で、局面が得られたseedは64件だった。選定規則は計測前に固定したため、欠測補充は行っていない。

計測はdiagnostic instrumentationなしで、expert release経路、固定depth 4、時間制限なし、各局面7 paired repetitions、1 warm-upとした。baseline/candidateの順序を事前規則でcounterbalanceし、同seed内の複数phaseをclusterとして扱った。95%区間はseed単位10,000回percentile bootstrapである。

## 結果

| 指標 | 結果 |
| --- | ---: |
| shard完了・seed coverage | 8/8、64/64、重複なし |
| baseline/candidate探索出力 | 全106局面・全反復で一致 |
| depth 4完了・timeout | 全反復depth 4、timeout 0 |
| source差分 | `public/ai-candidate.js`のみ |
| 推定elapsed削減 | **2.9795%** |
| 95% seed-cluster bootstrap区間 | **1.7091%〜4.1921%** |
| 事前固定した必要点推定 | **3.0%以上** |
| gate | **FAIL**（推定値が3.0%を0.0205 percentage point下回る） |

結果は正のwall-clock差を示すが、正式な採用基準として事前に定めた3.0%の点推定を満たさない。区間の下限が0を上回っていても、点推定gateは別条件なので合格へ読み替えない。これは効果がゼロと証明されたという意味ではなく、PBAI-P14が求めた「意味のある実時間改善」の条件を満たさなかったという判断である。

## 証拠と解釈範囲

- 正式判定に使ったcanonical JSONは[`c017-performance-002.json`](c017-performance-002.json)。Git blob SHAは`eb979df569f1e8c8d58ec8cbbf983b006a7b0af7`。
- shard raw dataとcanonical JSONはActions artifact [`pbai-p14-c017-performance-002-result-36411624798`](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/36412188487)に90日間保存した。artifact ID `10964787533`、ZIP SHA-256 `ea4efabdecb5a54f5c459985b934ec0725e0df5bc37bd6b3905b096171c6512a`。
- run `36411624798`では全shardが完了し、aggregateの技術・標本・意味同値性条件はすべてPASSした。閾値のみ不成立で、Actionsがexit code 2を返した。証拠はrun `36412188487`で保全し、固定gateの不合格もその後に明示した。
- 先行する`PBAI-C017-PERFORMANCE-001`はrunnerの技術的不成立で、記録は[`C017_PERFORMANCE_001_TECHNICAL_FAILURE.md`](C017_PERFORMANCE_001_TECHNICAL_FAILURE.md)にある。001のseed blockは消費済み扱いであり、002の標本・推定へ混ぜていない。
- 本試験は固定depth時の解析時間だけを測った。時間制限付き探索での到達深度、棋力、一般端末での速度、memory、Worker起動費用は判定していない。

## 工学判断

`PBAI-C017-v1`は開発時の同値性と遷移再利用条件を満たしたが、事前固定した実時間改善gateを満たさなかった。PBAI-P14ではA1の性能主張をここで停止し、3%閾値やseedを変更した再試験、強度対局、公開AI採用へ進まない。候補コードはisolated branchに保持し、`main`、公開default、releaseは変更しない。
