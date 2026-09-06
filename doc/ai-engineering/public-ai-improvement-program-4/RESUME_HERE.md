# PBAI-P4 — 再開位置

更新日: 2026-09-06。状態は `COMPLETE / STRENGTH-NON-ESTIMABLE / HOLD`。ブランチは `engineering/pbai-p4-c011-lightweight-transitions`。進行中測定はない。次に可能なのは保存済み証拠の検算とPRレビューであり、対局の継続ではない。

## HEADと実行履歴

開始mainは `548ccead3965fa98602d99c8b3e2a49fbeeed093`、契約固定は `f260b252c8f5f00a9a1b5124748c7303d75b252d`。現在HEADはブランチをGitHubから取得して `git rev-parse HEAD` で確認する。文書自身のcommit SHAは自己参照になるため、実行時の固定SHAは以下と各manifestを正本とする。

| 用途 | ローカル実行commit |
| --- | --- |
| 正確性・development | fe1ff9aa1911a1a753349fe9c648e38d2bdf3644 |
| validation | fdfe9e8582aa8c1036a2de2a15847026e6921180 |
| holdout | e064c4b10fb751f5897011fb908bda69c1739211 |

shellのpush認証がないため、GitHub connectorへ同じtreeを保存した。公開保存commitとローカル実行commitの違いをsource hashで追跡する。ローカル実行履歴はexecution-commits.bundleとEXECUTION_BUNDLE.jsonへ保存する。freezeを持つcloneでbundleをverifyし、記録されたrefをfetchすれば元の実行SHAを復元できる。

## 実行済みコマンド

診断・正確性・各stage測定は次を各1回だけ開始した。holdoutは354局完了後に停止した。これらは再実行コマンドの推奨ではなく履歴である。

```sh
node tools/engineering/diagnose-pbai-p4-baseline.js
node --max-old-space-size=2048 tools/engineering/verify-pbai-p4-correctness.js
node --max-old-space-size=2048 tools/engineering/run-pbai-p4-stage.js development
node --max-old-space-size=2048 tools/engineering/run-pbai-p4-stage.js validation
node --max-old-space-size=2048 tools/engineering/run-pbai-p4-stage.js holdout
```

各stageの独立source・棋譜再生とPython集計も実行済み。[再現手順](REPRODUCIBILITY_INDEX.md)の --check は保存済み観測の検算であり、測定の再試行ではない。通常回帰とVM・Workerの検証は専用CIに列挙する。

## 成果物・seed・未完了境界

artifacts/pbai-p4のbaseline-diagnostic.json、correctness.json、3組のevidence.tar.gzとsummary.jsonを正本とし、summary記載のSHA-256を照合する。途中97ペアのcheckpointは履歴資料であり、最終holdout archiveを優先する。RESOURCE_STOP.jsonは停止時刻・上限・未完了markerを記録する。

診断811000001..811000008、正確性815000001..815000064は消費済み。developmentの812/816 block、validationの813/817 block、holdoutの814/818 blockについて、各archiveのseeds.jsonlとsource auditが消費済みseedの正本である。最終holdoutの320採用rootと全候補sourceは既に開いており、未使用holdoutとは扱わない。対局未実行openingも新しい独立holdoutへ転用しない。統計seed819000001は既知データ集計に使用済み。

pair-177.json.startedだけが残る次ペアは未完了で、勝敗を付与しない。完了177ペア354局を再実行しない。残りblockの未採用seedへ拡張せず、本Programを閉じる。

## 再開条件

誤実行防止guardにより測定runnerはRESOURCE_STOP.jsonがあれば停止する。このguardは監視漏れ発見後の変更であり、過去の測定条件を修復したものではない。新しい検証を行うには別途明示的指示と、資源監視・新規ID・新規データ・結果を見る前の開始認可が必要である。main統合、公開デプロイ、default切替、世代昇格は未認可のままである。
