# 一度限り運用preflightの再開位置

安全な再開点は**運用moduleのローカルfixture合格・実cgroup確認待ち・科学区画未登録**である。継続指示は次工程にも有効であり、追加のユーザー認可を要求して止めたものではない。

1. [報告](REPORT.md)と最終ActionsのDocker receiptを照合する。128 MiB/1 GiB・swap追加分なし・OOMとprefix保存の合格を確認し、artifactとCI provenanceを固定する。
2. [契約案](CONTRACT_DRAFT.md)とSPEC_DRAFTに沿って科学用source入口・独立source replay・全閉包保存wrapperを運用moduleへ結合する。技術入口の科学範囲拒否を迂回してfixture生成器を使わない。
3. 科学用全workloadのseedなし統合fixtureで、container、domain/全体時間、一体容量と終了reserve、累積mirror容量、強制終了後の保存と独立prefix再生を確認する。host mirrorの資源も別記録へ保持する。
4. 提案seed/Study/Stage/namespaceを再照合し、最終SPEC・契約・認可範囲・SOURCE_MANIFEST・CI receipt・保護入力・実行前レビューを結果前に固定する。技術manifestと未登録案を科学登録へ自動昇格させない。
5. 別trigger・attempt 1固定と全区画の原子的leaseが成立した後だけ一度実行する。各PRNG初期化前にremote consumeを保存し、不足・閉包0・値差0・未知・停止でも追加・差替え・同区画retryをしない。保存byteの再検算だけは独立に行える。

科学seed消費0、科学leaseなし、BEFCS-STUDY1未登録・未実行。旧科学・技術記録、103355件遮断、全閉包と未知の保持、主課題の勝敗価値損失を維持する。正式関係未登録・未実行、main・公開AI未変更である。
