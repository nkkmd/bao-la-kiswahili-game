# 第2版の実cgroup CI確定

head `6c1698edf7b26af47d2aa15913b780da8d140165`のpush run [38354225350](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38354225350)とPR run [38354228277](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38354228277)はattempt 1で全stepが合格した。同じheadの15 CI runもすべてsuccessである。

実1 GiB・swap追加分なし・networkなしで全8固定シナリオ、通常240 MiBと終了16 MiBを共有する実容量境界、host UID/GIDによる後片付け、artifact保存まで確認した。[receipt](results-v2/CI_RECEIPT.json)にrun/job/artifactと全head runを保存する。

PR artifact ZIPのdigestを照合し、[実cgroup結果](results-v2/CI_CGROUP_RESULT.json)、[全圧縮証拠](results-v2/CI_CGROUP_EVIDENCE.json.gz)、[共有容量](results-v2/CI_CAPACITY_RESULT.json)を取得した。[CI出力binding](results-v2/CI_OUTPUT_BINDING.json)で全byteを固定し、全8 Git registryと保存journal prefixをローカルでも独立再生する。第1版failureと各原manifest・原結果は保持する。

これは保存済み技術source/固定閉包の運用統合合格である。科学用host/registry/別trigger、最終科学SPEC・契約・認可範囲・レビューは未完で、科学Study未登録/未実行、科学seed消費0、科学leaseなしを保持する。103355件遮断、全合法手閉包、未知の保持、主課題の勝敗価値損失、正式関係未登録/未実行、main・公開AI未変更を維持する。
