# 資源・停止条件の設計レビュー

## 観測済みの基準

G5-05の固定8候補は完全閉包0件だった。6件が各5000状態付近でSTATE-LIMIT、2件が別の合法枝でruntime guardへ達した。この8rootは再試行せず、結果から「上限を増やせば成功する」とは予測しない。

新BFSの固定fixtureでは、完全Bao例は3状態・2辺で旧全閉包と一致し、1024 nodeの抽象例の独立実装間peak RSS中央値は約61/68 MBだった。抽象fixtureは実Baoの分岐を再現しないため、候補上限の根拠として拡大外挿しない。G5-05の全runは最大RSS約569 MiB、raw evidence+journal約56 MiBで終了した。

## 提案値と安全停止

| 上限 | 提案 | 設定理由と限界 |
| --- | ---: | --- |
| fresh trajectories | 128 | 新しい固定有限開発区画。精度やIIDの標本数根拠ではない |
| fixed roots | 最大8 | 旧Studyとレビュー可能な運用量を維持。不足時に補充しない |
| states/domain | 10000 | 初回5000 capの2倍の新領域上限。旧rootへ適用しない。完全性を保証しない |
| edges/domain | 128000 | 10k nodeの分岐余裕を確保する停止上限。実測保証ではない |
| domain time | 180 s | guard-free 遷移と検算・保存を含める固定停止境界 |
| whole run | 1200 s | 20 min固定上限。source/閉包の計測値により実行後延長しない |
| peak RSS | 1 GiB | 直近既知runの569 MiBと余裕を持ち、container上限で止める。成功確率の推定ではない |
| expanded evidence + state journal | 256 MiB | 前runの約56 MiBから4倍超の保存余裕。header/witness/metadataを含む一体cap |
| finish reserve | 16 MiB | 上限を使い切る前に安全status/witnessを書き出す予約域 |
| repository gzip bundle | 256 MiB | 個別blobを48 MiB以下へ分けて、最大6片で全記録を保存・検算する。expanded cap/reserveと並行して監視する |
| checkpoint | source 32 ply / graph 128 edges | 中断区画の部分状態とfrontierを保存し、同一区画を再実行せず終了する |

上限達成時には必ずpartial・`solution: null`を保つ。部分graphをsolverへ渡さない。domain capはsource選択・候補差替え・追加seedを許可する条件ではない。RSS/evidence reserve前の停止でもseed区画全体を消費済みとして保存する。

圧縮だけでcapを通す計画にせず、実バイト量・gzip量・各JSONL/journal行・全読取集合を逐次監視する。1片48 MiB直前、6片合計、expanded capとreserveに達する過程をsmall fixtureへ注入し、分割hash・圧縮・journal・checkpoint・reserveを独立再生する。保存testが通らない間はsource-freeze/leaseを行わない。

## 判断

提案値はG5-05を救済する増枠ではなく、新しいStudyの事前停止条件である。今回のresource logから必要なメモリ/時間を精密推定できない。容量は意図的に停止し得る保守的開発上限として扱い、root countやcap後に結果を見て改訂しない。より確実な運用が必要なら、実sourceより先に別containerでjournal書出し・bundle最大値・RSS停止の負荷fixtureを合格させる。
