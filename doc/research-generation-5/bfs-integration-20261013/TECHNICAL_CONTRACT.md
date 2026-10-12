# 全閉包BFS統合の固定技術契約

技術IDはRCBI-S0-FIXTURE-2026-10-13-v1である。[CONFIG.json](CONFIG.json)のfixtureと資源を実行前に固定する。新規科学source・seed・候補を生成せず、旧科学領域・27未解析代表・実際の2 guard witnessを延長しない。

## 検証対象と独立性

既知P9/forced-winを全閉包まで展開する。既知P9/capture-relayはmicrostate上限1による未知保存だけを確認する。抽象例は合流・境界循環・手内反復・管理停止・256/1024状態の固定鎖・状態/辺上限を検証する。抽象RAWはラベルをpitへ埋めた人工表現であり、Bao遷移・到達性・新しい完全領域の証拠ではない。

主BFSはobject遷移・bit codecでRAWを保持する。参照BFSはring遷移・独立codec・別の走査を用いる。合法手一覧、全辺、各辺のreason/turn、relay数、microstate列のhash、停止witness、未展開境界を照合する。完全グラフだけを既存の独立二解法へ渡す。RECURRENTは勝者nullを保ち、DRAWや0価値へ変換しない。部分グラフはsolution nullであり、有限戦略証明を全閉包へ昇格しない。

## 保存と復元

保存形式は8 byteのmagic、4 byteのheader長、UTF-8 JSON header、33 byte RAW列、12 byteの辺整数列である。headerはrule・codec version・RAW hash・初回境界metadata・合法手表・展開状態・各辺metadata・未知witness・終了/境界情報を保持する。辺はfrom/move/toのuint32で、未知toは0xffffffffである。RAW同一性は旧hashのまま、reason/turnは辺ごとに保持する。対称変換をしない。

各観測をhash連鎖journalへ同期保存し、終了時はsnapshotをfsync後にrenameする。journalとsnapshotを別々に再生・復号して一致させる。破損・欠損・不正index・誤rule・metadata不一致を棄却する。未知手はstate nullと完全停止witnessを保持する。状態上限で受理できない自然子も観測記録を保存する。中断後の科学実行再開は許可しない。これはfixtureの安全保存検証であり、プロセス強制終了からの科学run復旧を認証しない。

## 資源と判定

全体120秒・1 GiB・成果物16 MiB、領域30秒・2048状態・4096辺・8192 microstateを上限とする。fixture内で上限を小さくする診断はCONFIGの名前で固定する。既知/抽象それぞれの完全性を区別し、時間/RSS停止の数値は機械依存の参考とする。

保存量はRAWだけでなくheader/合法手/辺metadata/停止証拠/journalおよびgzipを含めて記録する。固定256/1024抽象鎖を各方式3回、別Nodeプロセスで測り、走査とserializationの時間、最大RSSを記録する。メモリ/速度改善を合格条件にせず、科学グラフへ外挿しない。

技術既読は境界と完全microstateのRAW射影を旧102329識別へ追加する。抽象識別は別区分で保存する。共有RAWによる連結成分を二方式で照合し、部分領域が交わらないことから完全独立性を主張しない。

合格後も新規科学実行には別Study ID、未使用区画、選択・資源・停止・保存の登録、fixture CI、凍結source、別trigger、最初のseed前の永続leaseが必要である。正式関係は未登録・未実行、主課題は勝敗価値損失のままである。
