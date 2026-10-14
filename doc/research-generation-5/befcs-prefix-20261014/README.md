# 停止途中のsource記録を検算する技術工程

PR #199で共通128 sourceと監督処理の統合fixtureを確認した後、途中checkpointの`null`を補わず保存範囲だけを検算する処理を追加する。これは科学sourceの供給実験ではない。科学seed消費0・科学leaseなし・BEFCS-STUDY1未登録/未実行を維持する。

読む順序は[技術契約](TECHNICAL_CONTRACT.md)、[報告](REPORT.md)、[結果入口](results/README.md)、[再現手順](REPRODUCIBILITY.md)、[再開位置](RESUME_HERE.md)である。[現在状態](CURRENT_STATUS.md)と[品質監査](AUDIT.md)に判断と限界を示す。

既知抽象fixtureの4箇所でSIGKILLを行い、もう1箇所で管理停止を行う。保存2/10/48/49/10手と古いcheckpointを照合し、原snapshotへ後続step・screen・候補を追記しない。途中記録の検算合格を、完全sourceの合格や再開許可へ昇格しない。
