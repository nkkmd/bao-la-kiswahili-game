# 監督区画の証拠入口

実行結果は未確定である。Actionsではcaseごとに実上限、memory peak、OOM event、watchdog停止、終了状態を保存する。正常caseと停止caseを同じ「研究成功」へ読み替えない。

取得後に原結果のbyte列と全fileのSHA256、実行head・run・artifact digestを固定する。科学seedや科学leaseを作成しない。入力manifestと取得後の出力bindingは分離する。原出力内の英語fieldは機械検算用の例外であり、解釈は[報告](../REPORT.md)を参照する。
