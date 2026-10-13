# 固定技術結果と取得証拠

RESULT.jsonとTECHNICAL_EVIDENCE.json.gzはlocal Gitの5 caseと生bundleの正本である。proxy caseはlocal注入で、実認証通信やkernel制限の合格を主張しない。原結果・入力manifest・OUTPUT_BINDINGを別照合する。

新規8検査＋既存pipeline5検査の計13検査、local全5 caseの生bundle独立再生、2232入力・2222保護入力のhash照合が合格した。local出力をOUTPUT_BINDINGへ別固定した。

Actionsの実認証Git結果は取得後にCI receiptへ別保存する。zip digestと全member hash、5 caseのref・head・marker/ACK・mirror・資源と独立bundle検算を確認するまで、実通信の成功を主張しない。tokenとauth headerは保存しない。

科学seed0・科学leaseなし・BEFCS-STUDY1未登録/未実行、正式関係未登録/未実行、main/公開AI未変更を維持する。
