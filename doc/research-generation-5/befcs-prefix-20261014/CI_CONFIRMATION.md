# CIと取得証拠の確定

実装head `b1828fb5feebe57db96cc1e469ce8315560049b5`、tree `650ccffffe3478a5f21e3249d8a63b85d9c5778a`のPR側12ワークフローとpush側1ワークフロー、計13実行がすべてsuccessとなった。専用PR run `38423072308` / attempt 1 / job `115385211773`で18検査、原結果再生、5停止case再実行、artifact保存を確認した。push run `38423069622`もsuccessである。

artifact `11827720875`の原ZIPは69549 byteで、SHA-256は`f668c0305a4d74d7eb5d56d597282e0ce5cca8683ace0a0f4bf7687d6c406520`。取得ZIPのdigestはGitHub metadataと一致し、RESULT.jsonとTECHNICAL_EVIDENCE.json.gzの全2メンバーはローカルの固定byteと完全一致した。expiryは2027-01-11T15:33:22Zである。原ZIPと取得receiptはresultsへ保存し、CI_OUTPUT_BINDINGへ別固定する。旧実行入力とOUTPUT_BINDINGへ後からhashを付け直さない。

通常完成のsourceへ昇格せず、保存prefixの検算だけを合格とする。技術fixtureは合成receipt・既知抽象RAW・seed 1であり、実remote ancestry、科学source、全資源/期限の合格ではない。科学seed消費0・leaseなし・BEFCS-STUDY1未登録/未実行、103355件遮断・全閉包・未知・救済禁止・正式関係未登録/未実行、main/公開AI未変更を保持する。
