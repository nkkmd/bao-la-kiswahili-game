# host通信手順の技術CI確定

実装head `e35fe39cb3d54c01585cd2654c67b2c00509333b` のPR [run 38358568829](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38358568829)は、11テスト、26入力・646保護入力・全出力hash、保存4 Git bundle、先行第2版binding、artifact保存まで全stepが成功した。同headのPR側12ワークフローもすべてsuccessである。取得APIはPR側の一覧だけであり、push側を含む全run数とは主張しない。

[receipt](results/CI_RECEIPT.json)へjob step・artifact metadata・一覧を保存した。artifact ZIPのSHA-256 `0329fc68242292e10e3e1b69c6600d45346d9bbb993720d803b5771089fef424` を照合し、README・RESULT・圧縮証拠の全3ファイルがローカル固定byteと一致した。取得した圧縮証拠の全4 Git bundleも独立再生が一致した。[CI出力binding](results/CI_OUTPUT_BINDING.json)でreceiptを別固定する。元の入力manifest・保護入力・出力binding・結果は付け直していない。

今回のCIはhost単体の通信順序と拒否境界の技術確認である。新hostの科学worker/container全体結合、実GitHub通信失敗fixture、最終科学事前固定、科学専用triggerは未完である。科学seed消費0・科学leaseなし・科学Study未登録/未実行、正式関係未登録/未実行、103355件遮断、主課題・全閉包・未知の保持・救済禁止、main・公開AI未変更を保持する。
