# 分岐包絡による新しい供給Studyの設計

状態: **設計案・未登録・未実行**

全閉包BFS統合後に可能となる、新しい有限開発供給Studyの設計案である。G5-05の候補・seed・部分閉包・guard witnessを使わず、別のsource母集団から新しい代表を選ぶ。ここでは科学sourceを生成せず、正式関係検定や公開AIの変更を行わない。

最初に[推奨設計](PROPOSAL.md)、次に[機械定義案](PROPOSAL.json)、[資源と停止の根拠](RESOURCE_REVIEW.md)、[実行前の条件](PREEXECUTION_REVIEW.md)、[再開位置](RESUME_HERE.md)を読む。proposal上のIDとseed範囲は空き状況を確認した草案であり、予約・消費ではない。

主課題は探索順位変動と厳密勝敗価値損失の関係で、DTFへ置き換えない。対象は固定有限の開発コーパスであり、IIDや一般Bao局面への確率推論はしない。
