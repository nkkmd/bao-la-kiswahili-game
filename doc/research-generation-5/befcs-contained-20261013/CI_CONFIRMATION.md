# 共通workload・物理quota・外部停止のCI確定

実装head `4c4c9dcaa106a983ac661c58a499a063a7b75a2e`、tree `08ed122fe4e7c93310cc6a33ae4740935897a771`の[run 38387080147](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38387080147)は20検査と全stepに合格した。同headのPR側12ワークフローもすべてsuccessだった。取得APIはPR側一覧であり、push側を含む全run一覧とはしない。

| 技術case | marker / ACK | 停止・保存・解釈 |
| --- | ---: | --- |
| 通常 | 128 / 128 | 128 source・候補1・閉包1、終了mirrorと回収成功 |
| host OOM | 1 / 1 | PID 1のOOMKilled true、host結果なし、外部回収成功 |
| 実容量不足 | 1 / 1 | BALLAST 211812352 byteでENOSPC、終了予約解放後に保存成功 |
| 通常期限 | 22 / 22 | kernel cgroup.kill、保存済みprefixだけを回収 |
| observer全体期限 | 22 / 22 | primary停止後にobserverをSIGKILL、期限内完了false・期限後診断保存 |
| 離脱子 | 1 / 1 | primary停止後に回収、技術未完・再開不可 |
| 終了mirror失敗 | 128 / 128 | workerは閉包まで完了、終了mirrorなし・技術完了false |

primaryは1 GiB・追加swap 0・pids32・networkなし・read-only rootである。各新規imageは268435456 byteで、読取専用debugfs検査でblock count 65536 × block size 4096と一致した。filesystem metadataを含む容量制限であり、通常128 sourceは約63秒、終了mirror失敗caseは約60秒で保存・検算・圧縮まで終了した。

artifact `11806871986`、ZIP SHA-256 `542c9dbf6aa86f68263d5fb2981f15cc02fff907a68cccccd8d9bcc2a2fb71eb`を取得照合した。全93 fileのhash、7 Git bundle、7 filesystem image、回収した1229 evidence fileを検算した。[保存Git証拠](results/CI_TECHNICAL_EVIDENCE.json.gz)と[imageから回収した証拠](results/CI_IMAGE_EVIDENCE.json.gz)を別に保存する。後者は320 content-addressed objectから全fileを復元でき、未mirrorのsourceと閉包も保持する。[image manifest](results/CI_IMAGE_MANIFEST.json)、[receipt](results/CI_RECEIPT.json)、[出力binding](results/CI_OUTPUT_BINDING.json)を照合する。

完全source snapshotは301件、未完checkpointは1件だった。途中checkpointの`stop/candidate/selectionStatus: null`は補わず、checkpointの32 stepとjournalの追加9 stepを保存範囲だけで照合した。旧完全source validatorのnullエラーも保持する。[取得後検算器](results/VERIFY_IMAGE.cjs)は出力bindingへ別固定し、fixture実行入力manifestは付け替えない。journal chain、保存source/候補/閉包の独立再生と、prefixの先へ進まないこと・改変拒否を確認した。

これは既知抽象fixtureの技術合格である。外部observer/watchdog/Docker制御の資源総量、認証付き実GitHub transport・CAS拒否理由・remote pack、科学経路の途中checkpoint検算・最終配備・SPEC/契約/認可/全hash/CI/レビュー/別triggerは未完である。科学seed消費0・科学leaseなし・BEFCS-STUDY1未登録/未実行、103355件遮断・完全閉包/未知/救済禁止、主課題・正式関係未登録/未実行、main/公開AI未変更を保持する。
