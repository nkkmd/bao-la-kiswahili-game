# 保存済み全workload統合の再開位置

安全なcheckpointは、保存済み技術source/固定閉包と運用のローカル結合が合格し、実1 GiB cgroupの全pipeline CIを確認する位置である。

1. [報告](REPORT.md)、[入力manifest](SOURCE_MANIFEST.json)、[保護入力](PROTECTED_INPUTS.json)、[出力binding](OUTPUT_BINDING.json)と最新headのActionsを照合し、全pipelineのcgroup receiptを別記録へ保存する。
2. 専用science-gate、科学source/独立replay/全閉包入口を、科学用hostの原子的全区画lease・読取前consume・container監督・常時/終了mirrorへ接続する。技術registryの科学範囲拒否やfixture生成器を迂回しない。
3. 科学用hostの全資源予算、通信失敗、終了mirror不成立、子process排除、残余予算不足を科学seedなしで検証する。今回の固定byte再生を科学生成の費用保証へ昇格させない。
4. 提案区画・ID・namespaceを最新状態と再照合し、最終科学SPEC・契約・認可範囲・全入力/ソースhash・CI receipt・実行前レビューを結果前に固定する。
5. 全条件成立後にだけ、全128 sourceのleaseを永続確保し、各PRNG初期化前のconsumeとattempt 1固定の別triggerで一度だけ実行する。既存byteの再検算は許容するが、科学生成の再起動はしない。

BEFCS-STUDY1、BEFCS-S1-SUPPLY-2026-10-13-v1、seed案50613001..50613128は未予約・未消費。最大8候補、ply 48以後の第一適格root、103355件遮断、全合法手完全閉包、不足/0/停止時の追加・差替え・上限引上げ・retry禁止を保持する。未知をDRAW・0・敗北へ変換しない。正式関係未登録/未実行、主課題の勝敗価値損失、main・公開AI未変更を維持する。継続指示は有効であり、追加のユーザー認可を求めるために停止したものではない。

## 第2版の照合対象

第1版の後片付けfailureを保持し、現行は[第2版契約](TECHNICAL_CONTRACT_V2.md)、[第2版入力](SOURCE_MANIFEST_V2.json)、[第2版保護入力](PROTECTED_INPUTS_V2.json)、[第2版出力binding](OUTPUT_BINDING_V2.json)、[第2版結果](results-v2/README.md)を照合する。CLIは第2版が存在する場合にそちらを選ぶ。科学用host接続と最終科学freezeの未完条件は変わらない。

## 第2版CIの確認完了

[確定記録](CI_CONFIRMATION_V2.md)のpush/PR両CIで、実1 GiB全8シナリオ、共有256 MiB容量、後片付け、artifact保存まで合格した。科学用host/registry/別triggerと最終科学事前固定は次工程に残す。科学seed消費0・科学leaseなし・未登録/未実行を保持する。
