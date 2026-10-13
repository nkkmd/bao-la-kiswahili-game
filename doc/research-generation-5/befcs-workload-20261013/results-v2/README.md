# host UID/GID対応後の第2版結果

[RESULT.json](RESULT.json)と[TECHNICAL_EVIDENCE.json.gz](TECHNICAL_EVIDENCE.json.gz)は、[第2版入力](../SOURCE_MANIFEST_V2.json)に基づく固定技術負荷の結果とGit bundleを保存する。[第2版出力binding](../OUTPUT_BINDING_V2.json)でbyte hashを照合する。

第1版の原記録とCI failureは保持する。UID/GID対応は科学source・科学seed・科学候補の追加やretryではない。科学用host/registry/別triggerと最終科学事前固定は未完である。

## 実cgroupの保存証拠

[CI receipt](CI_RECEIPT.json)、[実行結果](CI_CGROUP_RESULT.json)、[全圧縮証拠](CI_CGROUP_EVIDENCE.json.gz)、[共有容量](CI_CAPACITY_RESULT.json)、[CI出力binding](CI_OUTPUT_BINDING.json)は第2版の実1 GiB pipelineが全step合格した追加記録である。原ローカル結果や第1版を変更せず、別固定している。
