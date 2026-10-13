# 第2版の回収tmp修正

第1版head `430c902b822d0a86aa3a3cfb3452dc837c3c3f4b` / run `38473413073`の期限caseは、停止後の外側検算でroot所有のtmpへ一時directoryを作ろうとしてEACCESとなった。job `115558190533`はfailure、artifact `11852707959`は保存された。失敗を成功へ付け替えない。

修正は期限後の回収検算だけが、同じ専用256 MiB filesystem内に呼出し側所有の`forensic-tmp`を作るものである。元のtmp・原snapshot・registry・sourceは変更しない。親1 GiB・区画512/448/64 MiB・全体20分/終了180秒・30秒停止fixture・救済禁止を変更しない。

第1版SOURCE_MANIFESTとPROTECTED_INPUTSを原byteで保持し、14実装入力のV1_SOURCE_SNAPSHOTを別保存した。修正後はSOURCE_MANIFEST_V2へ別固定する。第1版のlocal結果を第2版実行結果へ付け直さない。旧科学入力・原研究結果と保護入力は変更しない。

第2版の技術CIは新しいrun IDの独立したfixture refで検証し、旧refは削除・巻戻しせず保持する。科学区画の再実行ではなく、科学seed0・科学leaseなし・BEFCS-STUDY1未登録/未実行を維持する。第1版の他caseも取消さず、原結果とartifactを取得して保存する。
