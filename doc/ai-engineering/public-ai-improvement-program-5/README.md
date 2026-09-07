# PBAI-P5 — 軽量な局面遷移の独立再検証

状態: `COMPLETE / ADOPTED / AI-GEN3 / AI-GEN3-RELEASE-001 / PUBLIC-ACTIVE`。同じPBAI-C011-v1を新規データで再検証し、最終512局で328勝184敗、固定範囲の棋力改善を確認した。P4のHOLDは維持する。公開用configはmain `650b4312ed9cd318d9981523533dd692bdce6125`から配信され、hard/expertで候補を既定有効にしている。公開assetのbyte一致とChrome相当経路の初回動作を確認後、2026年9月7日の明示的指示に基づいて正式判断`ADOPT`、release ID `AI-GEN3-RELEASE-001`、公開AI系統`AI-GEN3`への昇格を記録した。さらにmain `e6a3936ee6285d606be83987b5ae3aa2ee61ec25`の画面世代表示とPWA cache v26を手動Cloudflare配信し、実サイトで表示、主要asset、hardのAI着手を確認した。結果の根拠と適用範囲は[最終報告](PROGRAM_FINAL_REPORT.md)、配信確認は[公開配信検証](PUBLIC_DEPLOYMENT_VERIFICATION.md)、正式判断は[AI-GEN3昇格判断](PROMOTION_DECISION.md)を参照する。

## 読む順序

1. [開始準備レビュー](AUTHORIZATION_REVIEW.md) — 現状、認可範囲、過去結果との関係
2. [固定条件](PROTOCOL.md) — 局面、seed、予算、数値gate、停止条件
3. [現在状態と再開位置](CURRENT_STATUS.md) — 完了した準備と次の操作
4. [再現手順](REPRODUCIBILITY_INDEX.md) — 事前点検、監視器、成果物
5. [判断・公開台帳](DECISION_REGISTER.md) — 未実行と公開境界
6. [品質監査](QUALITY_AUDIT.md) — 文書とsourceの監査
7. [main統合前の追加監査](INTEGRATION_READINESS_AUDIT.md) — レビュー指摘、追加認可、公開前gate
8. [公開リリース台帳](RELEASE_REGISTER.md) — 段階的反映、rollback、世代昇格の境界
9. [公開リリース計画](PUBLIC_RELEASE_PLAN.md) — source、設定、確認手順
10. [公開配信検証](PUBLIC_DEPLOYMENT_VERIFICATION.md) — 配信byte、実ブラウザー確認、未確認範囲
11. [AI-GEN3正式昇格判断](PROMOTION_DECISION.md) — `ADOPT`、release ID、昇格根拠

## 前回との違い

候補の強化機構は変えず、全工程を外側の監視器で連続実行する。4時間は最初の正式開始から独立検算の完了までで、チャット待ちも含む。中断後に期限をリセットしない。前回の開いたidentityを除外し、正確性・development・validation・holdoutに別の新規seed blockを割り当てる。

主たる対局比較は前回と同じ100ms/D8の512局である。標準hard500ms/expert2000msでは運用上の探索能力を別に確認する。実端末の効果や標準500msでの棋力を証明する計画ではない。

## チャットに依存しない実行

[実行の追補契約](EXECUTION_CONTRACT.md)で外部runner、途中保存、遠隔の重複起動防止を準備した。[会話中断時の確認位置](RESUME_HERE.md)から同じrunを読み取り確認できる。正式試験は約40分17秒で完了し、外部保存と独立検算も通過した。

開始レビュー・PROTOCOL・実行追補契約の未開始という表記は、開始前に凍結した時点の記録である。現在の状態はCURRENT_STATUSと最終報告を正本とする。
