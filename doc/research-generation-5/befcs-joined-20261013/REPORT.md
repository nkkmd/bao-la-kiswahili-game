# 共通worker結合の技術報告

## 目的と固定境界

前段まで個別fixtureで検証した共通workerと監督を、1つの親cgroupに入れて物理上限が同時適用されるか確認する。親は1 GiB・swap 0。子はwork512 MiB、control448 MiB、watch64 MiBで合計を増やさない。従来のpipeline worker・プロトコル・独立Git replayを変更せず、子workerをsource module初期化より前にworkへ移す。

全4 caseは128 source構成の技術fixtureである。通常は128 ACKと1候補・1全閉包、host OOMはACK1件後で停止、期限caseは停止専用15秒、終了mirror失敗は128件処理後に停止する。各caseで独立replayを行う。期限caseは未完checkpointと停止前のGit prefixを保存するが、未完sourceを補完・再開せず、全閉包の独立検算をスキップする。期限後の証拠保存があれば期限内完了と分類しない。

## 運用上の停止と予約容量

watchdogはwork/controlの`cgroup.kill` descriptorを先に取得する。全体期限の1秒前にまず両killへ書き込み、時刻を取り、最後に同期保存する。これにより前段で観測した「停止後の同期保存が停止完了記録を遅らせる」順序を解消する。通常停止も終了予約と1秒余裕を前倒しし、外側に15秒のsystemd強制停止を持つ。

物理予約16 MiBは終了mirrorの開始時だけ解放する。障害後の回復mirrorはwork停止を確認した後に限る。全体期限caseでmanager自体が停止した場合は、外側から保存prefixを検査・bundle化するだけで、consume・mirror・source再開を行わない。

## 解釈の境界

このhost内1 GiB検証はDocker daemonを使わないため、daemonを含む実行方式の全資源会計を確定しない。Actionsのservice起動・artifact転送と、全ての立ち上げ/破棄のsingle-clock証明も完全には結合していない。期限前の停止余裕は今回の実測下限であり、科学用20分期限の一般保証ではない。実認証Git transport/CAS理由、科学途中checkpoint validator、科学用最終SPEC/CONTRACT/AUTH/hash/review/専用triggerが残る。

科学seed消費0・科学leaseなし・Study未登録/未実行、主課題・正式関係未登録/未実行、main/公開AI未変更を保持する。未完・不明を勝敗や0に置換しない。sourceの追加・差替え、旧root延長、予算増加、retryを許可しない。
