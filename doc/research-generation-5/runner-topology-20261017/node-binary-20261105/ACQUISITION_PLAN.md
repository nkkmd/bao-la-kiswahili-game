# Node binary静的照合の取得計画

2026-11-05、資料取得の前に対象と停止条件を固定する。これは調査用の読取計画で、科学用全工程試験・実行認可ではない。作業領域の自動メンテナンス後にGitHubのmainから保存記録を復旧した。過去の取得記録は保持し、成功済み外部保存取引や科学sourceを再実行しない。

| 順序 | 対象 | 固定条件 |
| --- | --- | --- |
| 1 | https://nodejs.org/dist/v20.20.2/SHASUMS256.txt | 最大1 MiB、60秒、1回。node-v20.20.2-linux-x64.tar.gzのSHA-256が一意な64桁hexとして存在しなければ停止 |
| 2 | https://github.com/actions/runner/releases/download/v2.337.0/actions-runner-linux-x64-2.337.0.tar.gz | 226430031 byte、SHA-256 70920811a4f8ad4328818682bca5c6469c1c942fab52448868071d0063816613、120秒、1回 |
| 3 | https://nodejs.org/dist/v20.20.2/node-v20.20.2-linux-x64.tar.gz | 順序1で固定したSHA-256、最大64 MiB、120秒、1回。実byte数は取得後に記録 |

curlはfail・location・retry 0と上記最大byte/時間を指定する。通常redirectと失敗後retryを区別し、失敗時の再試行・別URL・別版への切替えは行わない。順序1に失敗したら後続を取得しない。

両archiveはhash確認後にtarをstreamで読む。対象はrunner側./externals/node20/bin/nodeと公式Node側node-v20.20.2-linux-x64/bin/nodeの通常file各1件。重複・リンク・欠落・上限超過は拒否する。binaryのbyte数とSHA-256を比較し、実行・通常展開・binaryのロードは行わない。

checksum本文、取得の終了状態・実byte/hash、memberのbyte/hashと照合結果を保存する。archiveやbinaryをリポジトリへ格納せず、再検算には同一hashの既存入力を使う。checksumのHTTPS取得と暗号署名検証を区別し、署名検証を行ったとは主張しない。binary一致をソースbuild来歴、work互換性、下位無再送、全工程成立へ昇格しない。

親監督・runner・work・全保存の20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiBを変更せず、この調査取得を同予算内の実証へ転用しない。科学seed0・leaseなし・未認可、wholeLifecycleOsProven=falseを維持する。WSLを操作せず、runner改変・build・登録・実行、新規remote結合試験、科学処理を開始しない。
