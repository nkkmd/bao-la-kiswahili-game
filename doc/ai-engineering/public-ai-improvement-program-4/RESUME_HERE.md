# PBAI-P4 — 再開位置

更新日: 2026-09-06。ブランチは `engineering/pbai-p4-c011-lightweight-transitions`。main統合・公開変更・世代昇格は未認可。

## 最初に確認すること

1. CURRENT_STATUS.md、PROTOCOL.md、BASELINE.jsonを読む。
2. `git status --short` と `git rev-parse HEAD` を確認する。他ブランチや他作業を上書きしない。
3. `artifacts/pbai-p4/holdout/gate.json`、holdout.log、各開始markerと完了JSONを確認する。完了JSONを持つ測定は再実行しない。開始markerだけの場合は、進行中処理の有無を確認し、停止済みなら勝手に再試行しない。
4. 前段の独立検証がすべてPASSであることを確認する。

## commitと証拠

- 開始main: `548ccead3965fa98602d99c8b3e2a49fbeeed093`
- 契約固定: `f260b252c8f5f00a9a1b5124748c7303d75b252d`
- 正確性・development実装commit: `fe1ff9aa1911a1a753349fe9c648e38d2bdf3644`
- validation実行commit: `fdfe9e8582aa8c1036a2de2a15847026e6921180`
- GitHub保存済みのdevelopment checkpoint: `5a9245c351e2e220183ee3e2b566dd0c24039070`

shellでのpush認証がないため、GitHub connectorで同一treeを保存した。ローカルの実行commitとGitHubの保存commitが異なる場合は、source hashとtreeで対応を検証する。履歴を隠すためのSHA置換は行わない。

診断はbaseline-diagnostic.json、正確性はcorrectness.json、前段の全観測はdevelopment-evidence.tar.gzとvalidation-evidence.tar.gz、索引とhashは各summary.jsonに保存した。archive内のroot/source/対局/探索行と開始markerを維持する。

## 実行済みと次のコマンド

次を各1回実行済み。

```sh
node tools/engineering/diagnose-pbai-p4-baseline.js
node --max-old-space-size=2048 tools/engineering/verify-pbai-p4-correctness.js
node test/pbai-p4-transitions.test.js
node --max-old-space-size=2048 tools/engineering/run-pbai-p4-stage.js development
node tools/engineering/verify-pbai-p4-stage-independent.js development
python3 tools/engineering/verify-pbai-p4-metrics-independent.py development
node --max-old-space-size=2048 tools/engineering/run-pbai-p4-stage.js validation
node tools/engineering/verify-pbai-p4-stage-independent.js validation
python3 tools/engineering/verify-pbai-p4-metrics-independent.py validation
```

次に許可されたコマンドは `node --max-old-space-size=2048 tools/engineering/run-pbai-p4-stage.js holdout`。開始後の正確な実行commit・時刻はholdout/manifest.jsonを正本とする。最終測定の完了後はholdoutに対する独立replayと独立集計へ進む。

## seedの状態

診断811000001..811000008、正確性815000001..815000064は消費済み。developmentは812/816 block、validationは813/817 blockのseeds.jsonlに列挙したseedを消費した。未使用seedの追加や、同一測定の再試行は禁止する。

最終holdoutは814/818 blockであり、このcheckpoint時点では開く条件だけが成立した。開始後はmanifest、seeds.jsonl、各pairの開始markerと完了JSONを参照し、全block未使用とはみなさない。再標本化seed819000001は固定済みの統計集計用であり、対局生成用ではない。
