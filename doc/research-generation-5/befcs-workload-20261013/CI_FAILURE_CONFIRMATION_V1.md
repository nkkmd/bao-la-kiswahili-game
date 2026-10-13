# 第1版の実cgroup通過と後片付け失敗

commit `8d7bf5f75fa228422a748a983e821433d2c74965`のpush run [38352152608](https://github.com/nkkmd/bao-la-kiswahili-game/actions/runs/38352152608)は、入力hash、12テスト、保存証拠再生、実1 GiBの全8シナリオを通過した。しかし最後の一時directory削除がEACCESで失敗し、job conclusionはfailureである。共有容量の後続stepはskippedであり、全CI合格ではない。

artifact ZIPのdigestをAPI metadataと照合し、[実行結果](results/CI_CGROUP_V1_RESULT.json)と[全圧縮証拠](results/CI_CGROUP_V1_EVIDENCE.json.gz)を取り出した。全8 containerの1 GiB・swap追加分なし・networkなし、各停止/完了、source/closure/registryの保存検算、科学seed消費0を確認した。[失敗receipt](results/CI_FAILURE_RECEIPT_V1.json)にrun/job/artifact/hashと境界を保存する。

[第2版契約](TECHNICAL_CONTRACT_V2.md)ではhost UID/GIDでworkerを動かし、後片付けまで含めて確認する。第1版のmanifest・原結果・証拠を変更せず、SOURCE_MANIFEST_V2・PROTECTED_INPUTS_V2・OUTPUT_BINDING_V2とresults-v2へ別固定する。科学Studyの登録・認可・実行は行っていない。
