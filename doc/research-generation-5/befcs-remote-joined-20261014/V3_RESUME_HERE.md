# 第3版の安全な再開位置

まず[V3修正の根拠](V3_REVISION.md)と[原CIの取得後確認](CI_ACQUIRED_CONFIRMATION.md)を読み、PR #202の最新headとSOURCE_MANIFEST_V3・PROTECTED_INPUTS・CI_ACQUIRED_BINDINGを照合する。旧RESUME_HEREは第2版時点の記録として保持する。

1. 修正版の5実Git/cgroup caseと拒否検査のrun/head/attemptを確認する。通常128 ACK・全source・1候補/1閉包・最終mirror、host OOM、未ACK保持、期限prefixとwrite遮断、最終mirror実proxy拒否を別々に取得・独立検算する。GitHub側の予定外拒否はそのまま失敗とし、retryや旧refの復活を行わない。
2. 判定エラー時のwork停止・timer解除・watch終了を確認する。停止専用fixtureの期限後回収は期限内完了の証拠にしない。
3. checkoutから起動・終了・artifact保全までの全資源と単一20分時計をレビューする。service内確認だけで科学全体の保証にしない。
4. 科学reference API・初期状態の最終配線、途中closureとmicrostate停止witness、資源停止中の検算範囲を固定する。
5. 最終SPEC/CONTRACT/AUTH/hash/CI/レビュー/専用triggerが成立するまで科学hostを拒否する。その後に一度限りの科学lease・読取前consume・供給実行を検討する。

科学seed0・科学leaseなし・BEFCS-STUDY1未登録/未実行を維持する。103355遮断、全合法手完全閉包、未知、不足時終了、追加/差替え/旧root・witness延長/上限引上げ/retry禁止、正式関係未登録/未実行、主課題の勝敗価値損失、main・公開AI未変更を保持する。
