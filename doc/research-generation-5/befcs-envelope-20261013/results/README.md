# 全資源と通信不明の固定証拠

[実GitHub receipt](REMOTE_TRANSPORT_RECEIPT.json)は技術隔離区画、固定prefix、consumeの成功応答喪失、ACK拒否とUNKNOWNサービスエラー後のhead不変を保持する。科学用registryではない。CAS拒否理由とraw Git objectの復元は未確認である。

実cgroupの結果はActions artifactへ保存し、取得・hash照合後にCI結果とreceipt・出力bindingを追加する。元入力のhashを取得後に付け替えない。OOM/停止で保存したprefixを完全な科学証拠へ昇格せず、未知と解釈未完を保持する。

[初回CIの失敗](CI_INITIAL_FAILURE.json)はslim imageにGitがなくworker開始前に停止した記録である。archive digestを照合し、全3保存fileを取得した。初回入力manifestは初回headに保持し、Gitを含むimageへの実装修正は新しい技術headの48入力へ別固定する。706保護入力と科学状態は変更しない。

[CI結果](CI_RESULT.json)・[80 fileの圧縮証拠](CI_TECHNICAL_EVIDENCE.json.gz)・[receipt](CI_RECEIPT.json)・[出力binding](CI_OUTPUT_BINDING.json)は取得検算済みの追加記録である。通常・離脱子・worker OOMの3 caseでprefixとcgroup内Git blobの復元が一致した。科学seed、実GitHub registryのraw Git objectやCAS拒否理由を検証済みへ昇格しない。
