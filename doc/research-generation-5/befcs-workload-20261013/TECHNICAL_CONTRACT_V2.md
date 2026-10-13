# 全workload統合fixtureの第2版技術契約

[第1版契約](TECHNICAL_CONTRACT.md)の128件の保存済み技術source再生・固定抽象閉包8件・共有保存予算・停止・mirror・科学入口拒否の範囲を保持する。科学source、科学seed、旧candidate/guard witnessを生成・延長しない。

第1版の実1 GiB cgroupは全8シナリオを通過したが、root所有の一時directoryをhostが削除できず、CI jobはEACCESで失敗した。第2版はhostのUID/GIDでworkerを動かし、停止、結果保存、検算、後片付け、artifact保存まで確認する。通常240 MiB/終了16 MiB、1 GiB、swap追加分なし、時間/状態/辺の上限は変更しない。

第1版のSOURCE_MANIFEST、PROTECTED_INPUTS、OUTPUT_BINDING、結果・証拠はそのbyteのまま保持する。第2版はSOURCE_MANIFEST_V2・PROTECTED_INPUTS_V2・OUTPUT_BINDING_V2とresults-v2へ別固定する。第1版CIの結果と圧縮証拠も別名で保存し、job failureをsuccessへ読み替えない。新しいfreezeは技術fixtureの修正版であり、科学Studyの登録・認可・retryではない。

科学用host/registry/別trigger、最終科学SPEC・契約・認可範囲・レビューは未完である。全閉包、103355件遮断、未知の保持、主課題の勝敗価値損失、科学seed消費0、科学leaseなし、科学Study未登録/未実行、正式関係未登録/未実行、main・公開AI未変更を維持する。
