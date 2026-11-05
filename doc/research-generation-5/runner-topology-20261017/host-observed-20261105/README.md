# WSL読取結果の受領と起動・保存条件の再評価

## 受領した観察

2026-11-05、ユーザーが自身のWSLで固定head `c9d19445f61e553d20e83d4151209d1dcdd22f8b`の観察器を実行し、会話へ貼り付けた出力を受領した。[観察JSON](OBSERVATION.json)はその値の転記で、端末原byteの取得、署名、独立した実機検証ではない。[出所記録](PROVENANCE.json)のhashは保存した転記fileを識別するもので、観測時点の原stdout hashとは呼ばない。観察器をChatGPT側で再実行して補完していない。

照合したmainは `9bc8fac5758140df67faa45e1e890714f1005676`、tree `02c1bc5b2ef062032f0d1dfdaefb01f7169b19bf`。PR #231後の変更・未統合PRはなかった。開始時の無関係な未追跡一時ファイル6件は保持し、今回の差分に含めない。

| 項目 | 受領値 | 解釈 |
| --- | --- | --- |
| architecture・kernel | x86_64、6.18.54.1-microsoft-standard-WSL2 | 過去の共有値と一致。上流Linuxとのbuild同一性は未証明 |
| systemd | 255 (255.4-1ubuntu8.17)、running | 版表示と稼働状態の観察。専用system unitの作成権限は未検証 |
| user service | uid 1000、active、Delegate=yes | 管理権限の分離や制限解除禁止の証明ではない |
| 表示されたroot | domain、controllersはcpuset cpu io memory hugetlb pids rdma、subtreeはcpu memory pids | /sys/fs/cgroupから見える範囲。host全体のglobal rootやnamespace構成と同一とは断定しない |
| 委任先 | domain、controllers/subtreeともcpu memory pids | 指定user serviceの観察。将来の専用Cを作成した証拠ではない |
| memory.max・memory.swap.max | root・委任先ともmax | 観察した各箇所のローカル値に有限上限がない。祖先・別領域の有効制限まで推測しない |
| cgroup.events | 両方populated 1、frozen 0 | 観察時に生存processがあり、凍結完了状態ではない。将来の停止確認ではない |
| cgroup.kill | 両方regular file、mode 0o200 | metadataのみ。owner・ACL・capability・namespace・open/書込権限と停止成功は未検証 |

systemctlの固定3照会はexitCode 0、選択した12件のcgroup値はOBSERVEDだった。ただし逐次読取で原子的snapshotではない。実行時刻の精密timestampは共有されていない。受領日を単調時計や実行証跡の開始時刻へ置換しない。

## 起動・保存設計への帰結

[前段の起動・保存案](../launcher-terminal-20261105/README.md)の6gateはすべて未成立のままである。今回の観察により過去値へ依存せずWSLを検討候補として扱えるが、WSLの採用・不採用、専用環境の準備成立、全工程成立は認定しない。

| 残条件 | 今回増えた材料 | なお必要なこと |
| --- | --- | --- |
| 起動担当Lの初回ロード計数 | 現在のsystemdとcgroup表示の確認 | OS側の制限確立からL初回execまでの担当・時刻・全費用。LをC外で先に動かす救済はしない |
| 対象限定の停止権限 | kill fileの属性確認 | FDの対象同一性、namespace条件、最小launcher、資格切替えと迂回拒否。modeだけで使用権限を認定しない |
| 子孫込み1 GiB・swap 0 | memory/pids委任と現在のローカルmax | 将来の専用Cと全roleの制限・監督余裕・継承・実効性。現在のuser serviceへそのまま書込まない |
| 最終保存・親終了 | 今回の観察は新しい成立証拠を提供しない | DへのACK、最終制御記録T、親終了証拠Eの保全先・担当・有限な終端を同じ時計・容量へ結合 |

次に扱うのは、既存信頼基盤と計数対象の境界を明示した起動経路と、D/A/T/Eの保全を満たす一つの候補の契約適合確認である。OS managerや外側uploaderを無料扱いせず、実行後に読むことと実行内ACKを区別する。既存user serviceのlimit変更、namespace/mount操作、権限試験や結合試験を、この読取成功の次に自動実行しない。

観察の反復だけでは上の設計不足は解消しないため、追加の同じWSL観察は今は求めない。具体的な設定変更が必要になった場合も、先に対象・影響・費用・後片付けを整理する。経路・権限・全egress・下位無再送・容量・最終receiptが閉じるまでrunner改変・build・登録・実行、新規remote結合試験は開始しない。

## 保存と検証

観察器は[読取専用手順](../host-recheck-20261105/README.md)と同じ固定版で、SHA-256は `f0236e9368afcf0f8243d1d637fc7fb339ff8cf29d15f0d36f6439659aa8e342`。ユーザーのfetch表示はorigin/mainが2f07b503から9bc8fac5へ進んだことを示すが、WSLの作業treeをcheckoutした証拠ではない。

保存時は転記の全field・値と、観察器の固定版hashを照合する。現在用保存監査とclient保存照合を実施する。今回、新しいhost観察・故障注入・科学検算を実行しない。以前の人工入力5テストを、今回の実機隔離・停止検証の成功へ読み替えない。[現在用手順](../../../../tools/research/g5-checkpoint/CURRENT_USAGE.md)に従い、凍結済み原verify.pyや旧manifestは変更しない。

## 維持する研究境界と品質

第五世代研究は継続中で、主要課題は探索順位変動と厳密勝敗価値損失の関係である。BEFCS-STUDY1と正式関係は未登録・未実行、科学seed消費0・leaseなし・未認可、wholeLifecycleOsProven=falseを維持する。20分・終了予約180秒・1 GiB・swap無効・保存256 MiB・終了容量予約16 MiB、103355件遮断、全合法手完全閉包、未知、固定有限開発コーパス、G5-05の凍結規則と採用35代表・8候補の選定差0件を保持する。

提案seedの読取・生成、旧区画/root/witnessの再実行・延長、source追加、候補差替え、上限増加、救済的retry、成功済み外部保存取引の反復をしない。公開ゲーム・AI-GEN4・Worker・観察器・実行認可を変更しない。WSL更新・再起動・設定変更・package導入・mount・cgroup/network/証明書変更を行わない。

本書・前段手順の受領追補・研究案内5文書の更新部分、計7文書を監査する。英語だけの見出し・通常説明文、相対リンク切れ、意図しない既存code block・canonical値変更を0件とする。JSON/path/ID/field/hash/commandは機械定義・転記値の例外で、日本語で意味と限界を説明した。CI・自己レビュー・main統合後監査の結果はPR記録へ残す。
