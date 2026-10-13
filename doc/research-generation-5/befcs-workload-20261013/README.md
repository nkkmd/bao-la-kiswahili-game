# BEFCSの保存済み全workload統合fixture

科学seedを読まず、保存済み技術source 128件の独立再生、固定抽象閉包8件、共有保存予算、読取前marker、稼働中/終了mirror、時間監督を同じpipelineへ結合する。[報告](REPORT.md)、[技術契約](TECHNICAL_CONTRACT.md)、[現在状態](CURRENT_STATUS.md)、[再開位置](RESUME_HERE.md)、[再現性](REPRODUCIBILITY.md)を順に読む。

ローカルで58テストと8停止/完了シナリオが合格した。実256 MiBの共有容量境界も合格した。科学用専用source・独立source・全閉包の入口は、最終科学freezeがない状態で初期化前に拒否する。科学用hostへの接続、最終SPEC/契約/認可範囲/レビュー、別triggerは未完である。

先行[運用preflight](../befcs-operations-20261013/CI_CONFIRMATION.md)の128 MiB/1 GiB OOM確認は合格済み。本統合pipelineを実1 GiB cgroupへ入れる新CIは別条件として確認する。技術fixtureを科学候補・科学供給成功へ昇格させない。科学seed消費0・科学leaseなし・科学Study未登録/未実行、正式関係未登録/未実行、main・公開AI未変更を保持する。

## 第2版への更新

第1版の実1 GiB全8シナリオは通過したが、後片付けのEACCESによりCI jobはfailureとなった。[失敗記録](CI_FAILURE_CONFIRMATION_V1.md)を保持し、host UID/GID対応を[第2版契約](TECHNICAL_CONTRACT_V2.md)と[第2版入力manifest](SOURCE_MANIFEST_V2.json)へ別固定した。現行結果は[第2版](results-v2/README.md)を読む。元の584入力と追加の固定記録を合わせた623保護入力を保持する。科学seed消費0・科学leaseなし・未登録/未実行を維持する。
