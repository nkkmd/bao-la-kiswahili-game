# `PBAI-P3` — draft PR自動workflow発火の除外記録

日付: 2026-09-05

状態: **`RECORDED / EXCLUDED FROM PBAI-P3 EVIDENCE`**

## 1. 発生したこと

初期化branch `engineering/pbai-p3-program-initialization`からdraft PR #105を作成したところ、既存workflowの広い`pull_request`条件により、過去Program用の検証workflowが自動起動しました。

このPRはcandidate実装、support測定、benchmark実行を認可していないため、PR #105を閉じました。branch上の初期化文書とbaseline manifestは保持しています。

## 2. 発火したrunの範囲

commit `c3ef42f40d0d43f2f8081e43d41b57b18815b1fc`に対して、13件の既存workflow runが観測されました。多くは過去のclosure / contract整合検証でしたが、次のrunには既存のbaseline-only support再構成stepが含まれていました。

```text
33958278602 = PBAI-P1 C004 contract freeze
33958278605 = PBAI-P2 C008 baseline-only root-flip support
33958278724 = PBAI-P2 C006 baseline-only support
```

GitHub pluginに進行中runのcancel actionがなかったため、PRを閉じて追加発火を止めました。run artifact、log内の数値、再構成結果はdownload、read、candidate設計、threshold設定に使用しません。

## 3. 証拠上の処置

```text
PBAI-P3 candidate contract = NONE
PBAI-P3 support population = NONE
PBAI-P3 support measurement = 0
PBAI-P3 benchmark execution = 0
triggered legacy workflow outputs = EXCLUDED / NOT READ / NOT USED
Research Generation 3 formal conclusions changed = false
PBAI-P1 / PBAI-P2 decisions changed = false
```

この自動発火は、PBAI-P3のfresh evidenceを生成したことを意味しません。過去Programの既存契約を現在の候補設計へ再利用することも認可しません。

## 4. 今後の再発防止

次にPRを作成または再開する前に、既存workflowの`pull_request` path filterと実行条件をread-onlyで監査します。PBAI-P3に不要な過去Programのsupport再構成を発火させないことを確認できない場合、branchを保持したままPRを開かず、明示的なworkflow修正認可を別に求めます。

## 5. 現在の停止位置

```text
draft PR #105 = CLOSED / NOT MERGED
remote branch = PRESERVED
main integration = NOT AUTHORIZED / NOT EXECUTED
PBAI-P3-C = NOT AUTHORIZED / NOT EXECUTED
```
