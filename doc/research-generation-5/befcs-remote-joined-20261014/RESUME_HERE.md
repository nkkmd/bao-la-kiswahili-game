# 安全な再開位置

最初にSOURCE_MANIFEST・PROTECTED_INPUTS、[結果入口](results/README.md)、最新head/CIと原artifactを照合する。科学seed0・科学leaseなし・Study未登録/未実行を維持する。

現行入力は[第2版](V2_REVISION.md)のSOURCE_MANIFEST_V2である。第1版の期限回収EACCESと原manifest・14実装入力snapshotを保持し、結果を修正版へ付け直していない。

1. 5 caseの実認証Git/親cgroup/停止記録を取得し、全source・途中prefix・raw bundle・未ACK・最終mirrorを独立検算する。失敗や期限後保存を完了へ昇格しない。
2. checkoutから起動・終了・artifact保全までの全資源と単一20分時計をレビューする。今回のservice内確認と期限後回収を科学全体の保証にしない。
3. 科学reference API・initial stateとSPECの最終配線、途中closure/microstate停止witness、資源停止中の検算範囲を固定する。
4. 最終SPEC/CONTRACT/AUTH/hash/CI/review/専用triggerが成立するまで科学hostを拒否する。その後に一度限り科学lease・読取前consume・供給実行を検討する。

103355遮断・全合法手完全閉包・未知・不足時終了・追加/差替え/旧root延長/予算増加/retry禁止、正式関係未登録/未実行、主課題の勝敗価値損失、main/公開AI未変更を保持する。
