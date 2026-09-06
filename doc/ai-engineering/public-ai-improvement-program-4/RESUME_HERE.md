# PBAI-P4 — 再開位置

ブランチは `engineering/pbai-p4-c011-lightweight-transitions`。開始mainは `548ccead3965fa98602d99c8b3e2a49fbeeed093`。現在HEADは `git rev-parse HEAD`、契約固定は `git log --oneline -- PROTOCOL.md` ではなく本ディレクトリのPROTOCOL.mdの履歴を確認する。

実行済みコマンドは `node tools/engineering/diagnose-pbai-p4-baseline.js`。診断seed 811000001..811000008は消費済みで再実行しない。成果物は `artifacts/pbai-p4/baseline-diagnostic.json`、hashはBASELINE.jsonに記録した。全development/validation/holdout blockは未使用、進行中処理なし。次はPROTOCOL.mdに沿った実装である。main統合・公開変更は未認可。

## 正確性通過後の追記

契約のGitHub固定commitは `f260b252c8f5f00a9a1b5124748c7303d75b252d`。ローカルの最初の同一tree commitは `aa4a00500cf418d395ef465c4ce7883230521ab0` だったが、shellのpush用認証がないためGitHub connectorで同じtreeを保存し、そのcommitへ同期した。

`node --max-old-space-size=2048 tools/engineering/verify-pbai-p4-correctness.js` は完了。815000001..815000064は正確性用として消費済み。結果は `artifacts/pbai-p4/correctness.json`。実装source hashも同ファイルに含む。`node test/pbai-p4-transitions.test.js` とCURRENT_STATUS記載の関連回帰はPASS。次の測定コマンドは `node --max-old-space-size=2048 tools/engineering/run-pbai-p4-stage.js development`。各測定の開始markerと完了JSONを残す。中断markerだけの行は再測定しない。
