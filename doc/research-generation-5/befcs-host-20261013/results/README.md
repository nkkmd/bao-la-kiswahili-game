# host通信手順の保存証拠

[RESULT.json](RESULT.json)は固定4シナリオの件数と停止状態、[TECHNICAL_EVIDENCE.json.gz](TECHNICAL_EVIDENCE.json.gz)は隔離Git registryのbundleを保存する。[出力binding](../OUTPUT_BINDING.json)で各byteを固定する。

論理markerと管理用prefixだけの技術証拠であり、科学seedの消費や科学leaseではない。FINISHEDはhost通信の終了で、科学的解釈の完了ではない。失敗後のmarkerは保持し、応答不明を未消費へ巻き戻さない。
