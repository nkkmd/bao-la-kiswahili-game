# 共通workloadの固定技術証拠

case開始前のheader、物理quota、primary inspection、watchdogと停止済みregistryをActions artifactへ逐次保存する。回収はprimary停止後に限り、consumeを増やさず、未知・再開不可を保持する。全7 caseの合格と取得検算は確認待ちである。observer全体期限後の診断は期限内完了falseとして保存する。

結果取得後は固定入力を変更せず、CI receipt・圧縮bundle証拠・出力bindingを追加する。終了mirror失敗caseではローカル保存を科学的な完全証拠へ昇格しない。科学seed/lease/Study/正式関係とmain/公開AIは変更しない。

[先行6 caseのmetadata](CI_PRELIMINARY_METADATA.json)はrun 38385862011の全step成功とjob logの結果を保持する。artifact metadataのdigestは取得したが、この先行ZIPは未取得・digest未照合である。外部検算tmpのquota内配置とobserver全体停止を補強した最終版の取得検算とは区別する。

[最終CI結果](CI_RESULT.json)・[7 Git bundleの圧縮証拠](CI_TECHNICAL_EVIDENCE.json.gz)・[1229 fileのimage由来証拠](CI_IMAGE_EVIDENCE.json.gz)・[image manifest](CI_IMAGE_MANIFEST.json)・[receipt](CI_RECEIPT.json)・[出力binding](CI_OUTPUT_BINDING.json)は取得検算済みの追加記録である。[取得後検算器](VERIFY_IMAGE.cjs)も出力bindingへ固定する。途中checkpointのnullを保持し、完全source検算のエラーをprefixのみの検証と区別する。
