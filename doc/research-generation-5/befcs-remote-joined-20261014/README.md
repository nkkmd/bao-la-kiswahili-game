# 共通128 source・実Git・監督区画の結合

PR #201の実Git検証を、PR #199の親1 GiB・work/control/watch区画と既存128 source workerへ接続する。[技術契約](TECHNICAL_CONTRACT.md)で予算と5 caseを結果前に固定した。科学seed・科学lease・科学Studyを使用しない。

[報告](REPORT.md)、[結果入口](results/README.md)、[再現手順](REPRODUCIBILITY.md)、[再開位置](RESUME_HERE.md)を読む。[現在状態](CURRENT_STATUS.md)と[品質監査](AUDIT.md)に未完条件を残す。

通信不明後に旧hostが回復mirrorへ進む経路も、新transportのwrite guardで拒否する。途中sourceの保存prefixはPR #200の検算器で照合し、checkpointや未ACKを補わない。fixture合格を科学実行認可へ昇格しない。
